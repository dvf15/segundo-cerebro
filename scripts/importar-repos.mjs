// Espelha o código-fonte de cada repositório listado em codigo/repos.json:
//   codigo/<nome>/src/                     código completo do branch padrão (arquivos versionados)
//   codigo/<nome>/branches/<branch>/...    arquivos novos/alterados em cada OUTRO branch desde que divergiu do padrão
//                                          (trabalho não mesclado, ex.: ferramentas Radar em branches claude/*)
// Arquivos acima de LIMITE_MB e vídeos ficam só no GitHub e são listados na nota. Histórico de commits fica no GitHub.
// Token: REPOS_TOKEN (PAT de leitura de conteúdo dos repos privados) ou GITHUB_TOKEN.
// Uso alternativo: node scripts/importar-repos.mjs --local <nome>=<caminho-ja-clonado> ...
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { RAIZ, frontmatter, escrever, dataISO, slugify } from './lib.mjs';

const LIMITE_MB = 20;
const VIDEO = /\.(mp4|mov|webm|mkv|avi|m4v)$/i;
const lista = JSON.parse(fs.readFileSync(path.join(RAIZ, 'codigo', 'repos.json'), 'utf8'));
const DEST = path.join(RAIZ, 'codigo');
const token = process.env.REPOS_TOKEN || process.env.GITHUB_TOKEN || '';
const locais = {};
const argv = process.argv.slice(2);
if (argv[0] === '--local') for (const par of argv.slice(1)) { const [n, c] = par.split('='); locais[n] = c; }

const ENV = { ...process.env, GIT_LFS_SKIP_SMUDGE: '1', GIT_TERMINAL_PROMPT: '0' };
const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', env: ENV, maxBuffer: 256 * 1024 * 1024 }).trim();
function clonar(repo) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-'));
  const url = token ? `https://x-access-token:${token}@github.com/${repo}` : `https://github.com/${repo}`;
  execFileSync('git', ['clone', '--depth', '1', '--quiet', url, tmp], { stdio: ['ignore', 'ignore', 'inherit'], env: ENV });
  return tmp;
}

function espelharBranches(dir, pastaBranches, padrao) {
  try {
    if (git(dir, 'rev-parse', '--is-shallow-repository') === 'true') git(dir, 'fetch', '-q', '--filter=blob:none', '--unshallow', 'origin');
    git(dir, 'fetch', '-q', '--filter=blob:none', 'origin', '+refs/heads/*:refs/remotes/origin/*');
  } catch (e) { console.warn('  não consegui buscar os branches (mantida a cópia anterior):', e.message.split('\n')[0]); return null; }
  fs.rmSync(pastaBranches, { recursive: true, force: true });
  const nomes = git(dir, 'for-each-ref', '--format=%(refname)', 'refs/remotes/origin').split('\n')
    .map(r => r.replace('refs/remotes/origin/', '')).filter(b => b && b !== 'HEAD' && b !== padrao);
  const resumo = [];
  for (const b of nomes) {
    let base; try { base = git(dir, 'merge-base', `origin/${padrao}`, `origin/${b}`); } catch { resumo.push({ branch: b, semBase: true, copiados: 0, pulados: [] }); continue; }
    const arqs = git(dir, 'diff', '--name-only', '-z', '--diff-filter=AM', '--no-renames', base, `origin/${b}`).split('\0').filter(Boolean);
    if (!arqs.length) continue;
    const info = { branch: b, copiados: 0, bytes: 0, pulados: [], commits: Number(git(dir, 'rev-list', '--count', `${base}..origin/${b}`)),
      ultimo: git(dir, 'log', '-1', '--format=%cs|%s', `origin/${b}`) };
    const pasta = path.join(pastaBranches, slugify(b, 80));
    for (const rel of arqs) {
      if (VIDEO.test(rel)) { info.pulados.push(`${rel} (vídeo)`); continue; }
      let buf;
      try { buf = execFileSync('git', ['-C', dir, 'cat-file', 'blob', `origin/${b}:${rel}`], { env: ENV, maxBuffer: LIMITE_MB * 1024 * 1024 }); }
      catch { info.pulados.push(`${rel} (acima de ${LIMITE_MB} MB ou ilegível)`); continue; }
      const alvo = path.join(pasta, rel);
      fs.mkdirSync(path.dirname(alvo), { recursive: true });
      fs.writeFileSync(alvo, buf);
      info.copiados++; info.bytes += buf.length;
    }
    resumo.push(info);
  }
  return resumo;
}

let total = 0;
for (const r of lista) {
  const nome = r.repo.split('/')[1];
  let dir;
  try { dir = locais[nome] || clonar(r.repo); } catch (e) { console.warn(`falha ao clonar ${r.repo}: ${e.message.split('\n')[0]} (mantida a cópia anterior)`); continue; }
  const destino = path.join(DEST, nome);
  const src = path.join(destino, 'src');
  const arquivos = git(dir, 'ls-files', '-z').split('\0').filter(Boolean);
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
  const branches = espelharBranches(dir, path.join(destino, 'branches'), branch);
  const nBr = (branches || []).filter(b => b.copiados).length;
  const nBrArq = (branches || []).reduce((s, b) => s + b.copiados, 0);
  const nBrMB = (branches || []).reduce((s, b) => s + (b.bytes || 0), 0) / 1048576;
  escrever(path.join(destino, '_repo.md'), frontmatter({
    title: nome, date: dataISO(ultimoCommit), source: 'github', source_id: r.repo, url: `https://github.com/${r.repo}`,
    private: !!r.privado, branch, commit: hash, files: copiados, size_mb: Math.round(bytes / 1048576 * 10) / 10, skipped: pulados.length,
    branches_with_work: nBr, tags: ['codigo', 'github', 'repo/' + nome],
  }) + [
    `# ${nome}`, '', r.descricao || '', '',
    `- **GitHub:** https://github.com/${r.repo}`, `- **Branch padrão espelhado:** ${branch || '?'} · **commit:** ${hash || '?'} · **último commit:** ${ultimoCommit || '?'}`,
    `- **Código-fonte do branch padrão:** pasta \`src/\` (${copiados} arquivos, ${(bytes / 1048576).toFixed(1)} MB). Histórico de commits fica no GitHub.`,
    ...(branches ? [`- **Trabalho em outros branches:** pasta \`branches/\` (${nBr} branches, ${nBrArq} arquivos, ${nBrMB.toFixed(1)} MB). Cada pasta traz só os arquivos novos ou alterados no branch desde que divergiu do padrão.`] : ['- **Outros branches:** não foi possível buscá-los nesta execução; vale a cópia anterior.']),
    ...(pulados.length ? ['', `## Arquivos do branch padrão acima de ${LIMITE_MB} MB (só no GitHub)`, '', ...pulados.map(p => `- ${p}`)] : []),
    ...(nBr || (branches || []).some(b => b.semBase) ? ['', '## Branches com trabalho não mesclado', '', '| Branch | Pasta | Commits | Arquivos | Último commit |', '| --- | --- | --- | --- | --- |',
      ...branches.filter(b => b.copiados || b.pulados.length || b.semBase).map(b => `| \`${b.branch}\` | \`branches/${slugify(b.branch, 80)}/\` | ${b.commits ?? '?'} | ${b.semBase ? 'sem ancestral comum' : b.copiados + (b.pulados.length ? ` (+${b.pulados.length} só no GitHub)` : '')} | ${(b.ultimo || '').replace('|', ' — ').slice(0, 90)} |`),
      ...branches.filter(b => b.pulados.length).flatMap(b => ['', `**Só no GitHub (\`${b.branch}\`):** ${b.pulados.join(', ')}`])] : []),
    '', '## Documentação (.md) no branch padrão', '', ...(mds.length ? mds.sort().map(a => `- [[${path.posix.join('codigo', nome, 'src', a.replace(/\.mdx?$/i, ''))}|${a}]]`) : ['_nenhum arquivo .md_']),
    '', '## Árvore do branch padrão (até 400 arquivos)', '', '```', ...arquivos.slice(0, 400), ...(arquivos.length > 400 ? [`… e mais ${arquivos.length - 400}`] : []), '```', '',
  ].join('\n'));
  if (!locais[nome]) fs.rmSync(dir, { recursive: true, force: true });
  console.log(`${r.repo}: padrão ${copiados} arquivos (${(bytes / 1048576).toFixed(1)} MB)${pulados.length ? `, ${pulados.length} pulados` : ''} · branches: ${nBr} com trabalho, ${nBrArq} arquivos (${nBrMB.toFixed(1)} MB)`); total++;
}
console.log(`repos espelhados: ${total}/${lista.length}`);
