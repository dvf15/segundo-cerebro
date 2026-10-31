// Copia README, CLAUDE.md e todos os .md (docs) de cada repositório listado em codigo/repos.json
// para codigo/<nome>/, com uma nota _repo.md de frontmatter. Clona raso em pasta temporária.
// Token: variável REPOS_TOKEN (PAT com leitura dos repos privados) ou GITHUB_TOKEN.
// Uso alternativo: node scripts/importar-repos.mjs --local <nome>=<caminho-ja-clonado> ...
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { RAIZ, frontmatter, escrever, andar, dataISO } from './lib.mjs';

const lista = JSON.parse(fs.readFileSync(path.join(RAIZ, 'codigo', 'repos.json'), 'utf8'));
const DEST = path.join(RAIZ, 'codigo');
const token = process.env.REPOS_TOKEN || process.env.GITHUB_TOKEN || '';
const locais = {};
const argv = process.argv.slice(2);
if (argv[0] === '--local') for (const par of argv.slice(1)) { const [n, c] = par.split('='); locais[n] = c; }

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
  try { dir = locais[nome] || clonar(r.repo); } catch (e) { console.warn(`falha ao clonar ${r.repo}: ${e.message.split('\n')[0]}`); continue; }
  const destino = path.join(DEST, nome);
  let copiados = 0;
  const arquivosMd = [];
  for (const arq of andar(dir, p => /\.(md|mdx)$/i.test(p) || /(^|\/)CLAUDE\.md$/.test(p))) {
    const rel = path.relative(dir, arq);
    if (rel.includes('node_modules')) continue;
    const alvo = path.join(destino, 'docs', rel);
    escrever(alvo, fs.readFileSync(arq, 'utf8'));
    arquivosMd.push(rel); copiados++;
  }
  let ultimoCommit = null, hash = null;
  try {
    ultimoCommit = execFileSync('git', ['-C', dir, 'log', '-1', '--format=%cI'], { encoding: 'utf8' }).trim();
    hash = execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {}
  const arvore = execFileSync('git', ['-C', dir, 'ls-files'], { encoding: 'utf8' }).trim().split('\n').slice(0, 400);
  escrever(path.join(destino, '_repo.md'), frontmatter({
    title: nome, date: dataISO(ultimoCommit), source: 'github', source_id: r.repo, url: `https://github.com/${r.repo}`,
    private: !!r.privado, commit: hash, md_files: copiados, tags: ['codigo', 'github', 'repo/' + nome],
  }) + [
    `# ${nome}`, '', r.descricao || '', '',
    `- **GitHub:** https://github.com/${r.repo}`, `- **Último commit:** ${ultimoCommit || '?'} (${hash || '?'})`, `- **Arquivos .md copiados:** ${copiados}`, '',
    '## Documentação copiada', '', ...arquivosMd.sort().map(a => `- [[${path.posix.join('codigo', nome, 'docs', a.replace(/\.mdx?$/i, ''))}|${a}]]`), '',
    '## Árvore do repositório (até 400 arquivos)', '', '```', ...arvore, '```', '',
  ].join('\n'));
  if (!locais[nome]) fs.rmSync(dir, { recursive: true, force: true });
  console.log(`${r.repo}: ${copiados} .md`); total++;
}
console.log(`repos processados: ${total}/${lista.length}`);
