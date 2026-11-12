// Espelha o código-fonte completo de cada repositório listado em codigo/repos.json em codigo/<nome>/src/
// (todos os arquivos versionados do branch padrão, sem .git e sem node_modules; arquivos acima de
// LIMITE_MB ficam só no GitHub e são listados na nota). Gera codigo/<nome>/_repo.md com frontmatter.
// Token: variável REPOS_TOKEN (PAT com leitura de conteúdo dos repos privados) ou GITHUB_TOKEN.
// Uso alternativo: node scripts/importar-repos.mjs --local <nome>=<caminho-ja-clonado> ...
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { RAIZ, frontmatter, escrever, dataISO } from './lib.mjs';

const LIMITE_MB = 20;
const lista = JSON.parse(fs.readFileSync(path.join(RAIZ, 'codigo', 'repos.json'), 'utf8'));
const DEST = path.join(RAIZ, 'codigo');
const token = process.env.REPOS_TOKEN || process.env.GITHUB_TOKEN || '';
const locais = {};
const argv = process.argv.slice(2);
if (argv[0] === '--local') for (const par of argv.slice(1)) { const [n, c] = par.split('='); locais[n] = c; }

function git(dir, ...args) { return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim(); }
function clonar(repo) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-'));
  const url = token ? `https://x-access-token:${token}@github.com/${repo}` : `https://github.com/${repo}`;
  execFileSync('git', ['clone', '--depth', '1', '--quiet', url, tmp], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, GIT_LFS_SKIP_SMUDGE: '1', GIT_TERMINAL_PROMPT: '0' } });
  return tmp;
}

let total = 0;
for (const r of lista) {
  const nome = r.repo.split('/')[1];
  let dir;
  try { dir = locais[nome] || clonar(r.repo); } catch (e) { console.warn(`falha ao clonar ${r.repo}: ${e.message.split('\n')[0]} (mantida a cópia anterior)`); continue; }
  const destino = path.join(DEST, nome);
  const src = path.join(destino, 'src');
  const arquivos = git(dir, 'ls-files', '-z').split('\0').filter(Boolean);
  // espelho: apaga a cópia anterior para refletir remoções, depois copia os versionados
  fs.rmSync(src, { recursive: true, force: true });
  fs.rmSync(path.join(destino, 'docs'), { recursive: true, force: true }); // layout antigo
  let copiados = 0, bytes = 0; const pulados = [], mds = [];
  for (const rel of arquivos) {
    const origem = path.join(dir, rel);
    let st; try { st = fs.lstatSync(origem); } catch { continue; }
    if (st.isSymbolicLink() || !st.isFile()) continue;
    if (st.size > LIMITE_MB * 1024 * 1024) { pulados.push(`${rel} (${(st.size / 1048576).toFixed(1)} MB)`); continue; }
    const alvo = path.join(src, rel);
    fs.mkdirSync(path.dirname(alvo), { recursive: true });
    fs.copyFileSync(origem, alvo);
    copiados++; bytes += st.size;
    if (/\.mdx?$/i.test(rel)) mds.push(rel);
  }
  let ultimoCommit = null, hash = null, branch = null;
  try { ultimoCommit = git(dir, 'log', '-1', '--format=%cI'); hash = git(dir, 'rev-parse', '--short', 'HEAD'); branch = git(dir, 'rev-parse', '--abbrev-ref', 'HEAD'); } catch {}
  escrever(path.join(destino, '_repo.md'), frontmatter({
    title: nome, date: dataISO(ultimoCommit), source: 'github', source_id: r.repo, url: `https://github.com/${r.repo}`,
    private: !!r.privado, branch, commit: hash, files: copiados, size_mb: Math.round(bytes / 1048576 * 10) / 10, skipped: pulados.length,
    tags: ['codigo', 'github', 'repo/' + nome],
  }) + [
    `# ${nome}`, '', r.descricao || '', '',
    `- **GitHub:** https://github.com/${r.repo}`, `- **Branch espelhado:** ${branch || '?'} · **commit:** ${hash || '?'} · **último commit:** ${ultimoCommit || '?'}`,
    `- **Código-fonte completo:** pasta \`src/\` (${copiados} arquivos, ${(bytes / 1048576).toFixed(1)} MB). Histórico de commits e demais branches ficam no GitHub.`,
    ...(pulados.length ? ['', `## Arquivos acima de ${LIMITE_MB} MB (só no GitHub)`, '', ...pulados.map(p => `- ${p}`)] : []),
    '', '## Documentação (.md) dentro do código', '', ...(mds.length ? mds.sort().map(a => `- [[${path.posix.join('codigo', nome, 'src', a.replace(/\.mdx?$/i, ''))}|${a}]]`) : ['_nenhum arquivo .md_']),
    '', '## Árvore (até 400 arquivos)', '', '```', ...arquivos.slice(0, 400), ...(arquivos.length > 400 ? [`… e mais ${arquivos.length - 400}`] : []), '```', '',
  ].join('\n'));
  if (!locais[nome]) fs.rmSync(dir, { recursive: true, force: true });
  console.log(`${r.repo}: ${copiados} arquivos (${(bytes / 1048576).toFixed(1)} MB)${pulados.length ? `, ${pulados.length} pulados` : ''}`); total++;
}
console.log(`repos espelhados: ${total}/${lista.length}`);
