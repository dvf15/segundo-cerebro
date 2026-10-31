// Varre o vault, lê o frontmatter de cada .md e gera os MOCs em 00-index/.
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, lerFrontmatter, escrever, andar, frontmatter, wikilink } from './lib.mjs';

const IGNORAR = new Set(['00-index', '_raw', 'scripts', 'node_modules', '.github', '.obsidian']);
const notas = [];
for (const arq of andar(RAIZ, p => p.endsWith('.md'))) {
  const rel = path.relative(RAIZ, arq).split(path.sep).join('/');
  const topo = rel.split('/')[0];
  if (IGNORAR.has(topo) || rel === 'README.md') continue;
  const fm = lerFrontmatter(fs.readFileSync(arq, 'utf8'));
  const titulo = fm.title || fm.name || path.basename(arq, '.md');
  let fonte = fm.source || null;
  if (!fonte && rel.startsWith('claude/skills/')) fonte = 'skill';
  if (!fonte && rel.startsWith('codigo/')) fonte = 'github-doc';
  if (!fonte && rel.startsWith('reunioes/')) fonte = 'granola';
  notas.push({ rel, titulo, fonte, data: fm.date || null, tags: fm.tags || [], projeto: fm.project || null, repo: fm.repo || null, desc: fm.description || null, url: fm.url || null });
}
const hoje = new Date().toISOString().slice(0, 10);
const porData = (a, b) => String(b.data || '').localeCompare(String(a.data || '')) || a.titulo.localeCompare(b.titulo);
const esc = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function tabela(lista, colunas) {
  if (!lista.length) return '_nenhuma nota ainda_\n';
  const cab = `| ${colunas.map(c => c.nome).join(' | ')} |\n| ${colunas.map(() => '---').join(' | ')} |`;
  return cab + '\n' + lista.map(n => `| ${colunas.map(c => esc(c.valor(n))).join(' | ')} |`).join('\n') + '\n';
}
const colTitulo = { nome: 'Nota', valor: n => wikilink(n.rel, n.titulo) };
const colData = { nome: 'Data', valor: n => n.data || '' };

const secoes = [
  { arq: 'Conversas.md', titulo: 'Conversas do claude.ai', filtro: n => n.fonte === 'claude-chat', cols: [colData, colTitulo, { nome: 'Projeto', valor: n => n.projeto || '' }] },
  { arq: 'Projetos.md', titulo: 'Projetos do claude.ai', filtro: n => n.fonte === 'claude-project' || n.fonte === 'claude-project-doc', cols: [colData, colTitulo, { nome: 'Tipo', valor: n => n.fonte }] },
  { arq: 'Sessoes-Code.md', titulo: 'Sessões do Claude Code', filtro: n => n.fonte === 'claude-code', cols: [colData, colTitulo, { nome: 'Repo', valor: n => n.repo || '' }] },
  { arq: 'Artifacts.md', titulo: 'Artifacts', filtro: n => n.fonte === 'claude-artifact', cols: [colData, colTitulo, { nome: 'Link', valor: n => n.url || '' }] },
  { arq: 'Skills.md', titulo: 'Skills (SKILL.md)', filtro: n => n.fonte === 'skill' && n.rel.endsWith('/SKILL.md'), cols: [colTitulo, { nome: 'Descrição', valor: n => (n.desc || '').slice(0, 160) }] },
  { arq: 'Codigo.md', titulo: 'Código e documentação dos repositórios', filtro: n => n.fonte === 'github', cols: [colData, colTitulo, { nome: 'URL', valor: n => n.url || '' }] },
  { arq: 'Reunioes.md', titulo: 'Reuniões (Granola)', filtro: n => n.fonte === 'granola' && !n.rel.endsWith('_index.md'), cols: [colData, colTitulo] },
];

const resumo = [];
for (const s of secoes) {
  const lista = notas.filter(s.filtro).sort(porData);
  escrever(path.join(RAIZ, '00-index', s.arq), frontmatter({ title: s.titulo, generated: hoje, count: lista.length, tags: ['index'] }) + `# ${s.titulo}\n\n_${lista.length} notas · gerado em ${hoje} por scripts/gerar-indices.mjs_\n\n` + tabela(lista, s.cols));
  resumo.push({ s, n: lista.length });
}

// índice de tags
const tags = new Map();
for (const n of notas) for (const t of n.tags) { if (!tags.has(t)) tags.set(t, []); tags.get(t).push(n); }
const linhasTags = [...tags.entries()].sort((a, b) => b[1].length - a[1].length).map(([t, l]) => `- **#${t}** (${l.length}): ${l.sort(porData).slice(0, 8).map(n => wikilink(n.rel, n.titulo)).join(' · ')}${l.length > 8 ? ' …' : ''}`);
escrever(path.join(RAIZ, '00-index', 'Tags.md'), frontmatter({ title: 'Tags', generated: hoje, tags: ['index'] }) + `# Tags\n\n${linhasTags.join('\n')}\n`);

// recentes
const recentes = notas.filter(n => n.data).sort(porData).slice(0, 40);

escrever(path.join(RAIZ, '00-index', 'Inicio.md'), frontmatter({ title: 'Início', generated: hoje, total: notas.length, tags: ['index'] }) + [
  '# Segundo Cérebro · Início', '',
  `_${notas.length} notas indexadas · gerado em ${hoje}_`, '',
  '## Mapas de conteúdo', '',
  ...resumo.map(({ s, n }) => `- ${wikilink('00-index/' + s.arq, s.titulo)} — ${n}`),
  `- ${wikilink('00-index/Tags.md', 'Tags')} — ${tags.size}`, '',
  '## Recentes', '',
  tabela(recentes, [colData, colTitulo, { nome: 'Fonte', valor: n => n.fonte || '' }]),
  '## Como manter', '',
  '1. Export do claude.ai → `_raw/claude-export/` → `npm run converter:export`',
  '2. Sessão do Claude Code → `_raw/sessoes-code/*.jsonl` → `npm run converter:sessao`',
  '3. `npm run indices` (ou deixe a GitHub Action semanal fazer)', '',
].join('\n'));
console.log(`indexadas ${notas.length} notas · ${tags.size} tags`);
