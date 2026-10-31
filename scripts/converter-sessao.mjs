// Converte transcrições do Claude Code (.jsonl de ~/.claude/projects/**) em notas .md.
// Uso: node scripts/converter-sessao.mjs [arquivo.jsonl ...]   (sem args: tudo em _raw/sessoes-code/)
// Saída: claude/sessoes-code/AAAA-MM/AAAA-MM-DD_<titulo>_<id8>.md
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, slugify, dataISO, frontmatter, escrever, andar } from './lib.mjs';

const RAW = path.join(RAIZ, '_raw', 'sessoes-code');
const DEST = path.join(RAIZ, 'claude', 'sessoes-code');
const LIMITE_RESULTADO = 1500; // caracteres de saída de ferramenta mantidos na nota

function resumoInput(nome, input) {
  if (!input || typeof input !== 'object') return '';
  const chaves = ['command', 'description', 'file_path', 'pattern', 'query', 'url', 'prompt', 'path'];
  const partes = [];
  for (const k of chaves) if (input[k]) partes.push(`${k}: ${String(input[k]).replace(/\s+/g, ' ').slice(0, 300)}`);
  return partes.join(' · ');
}

function converter(arquivo) {
  const linhas = fs.readFileSync(arquivo, 'utf8').split('\n').filter(Boolean);
  let sessionId = null, titulo = null, cwd = null, modelo = null, custo = null, inicio = null, fim = null;
  const eventos = [];
  const ferramentas = new Map(); // tool_use_id -> nome
  let nThinking = 0;

  for (const l of linhas) {
    let ev; try { ev = JSON.parse(l); } catch { continue; }
    sessionId ||= ev.sessionId;
    if (ev.type === 'custom-title') { titulo = ev.customTitle; continue; }
    if (ev.type === 'cost-state') { custo = ev.totalCostUSD; continue; }
    if (ev.type === 'attachment') {
      if (ev.attachment?.type === 'environment') cwd = ev.attachment.snapshot?.workingDirectory;
      if (ev.attachment?.type === 'model') modelo = ev.attachment.identity?.modelId;
      continue;
    }
    if (ev.type !== 'user' && ev.type !== 'assistant') continue;
    if (ev.timestamp) { inicio ||= ev.timestamp; fim = ev.timestamp; }
    const conteudo = ev.message?.content;
    const blocos = typeof conteudo === 'string' ? [{ type: 'text', text: conteudo }] : Array.isArray(conteudo) ? conteudo : [];
    for (const b of blocos) {
      if (b.type === 'thinking') { nThinking++; continue; }
      if (b.type === 'text' && b.text?.trim()) {
        if (ev.type === 'user' && /^<(system-reminder|task-notification|local-command)/.test(b.text.trim())) continue;
        eventos.push({ papel: ev.type, texto: b.text, side: ev.isSidechain, ts: ev.timestamp });
      } else if (b.type === 'tool_use') {
        ferramentas.set(b.id, b.name);
        eventos.push({ papel: 'tool_use', nome: b.name, resumo: resumoInput(b.name, b.input), side: ev.isSidechain, ts: ev.timestamp });
      } else if (b.type === 'tool_result') {
        const txt = typeof b.content === 'string' ? b.content : Array.isArray(b.content) ? b.content.map(x => x.text || '').join('\n') : '';
        eventos.push({ papel: 'tool_result', nome: ferramentas.get(b.tool_use_id) || '?', texto: txt, erro: b.is_error, side: ev.isSidechain });
      }
    }
  }
  if (!eventos.length) return null;

  const primeiroUsuario = eventos.find(e => e.papel === 'user' && !e.side)?.texto || 'Sessão Claude Code';
  titulo ||= primeiroUsuario.replace(/\s+/g, ' ').slice(0, 80);
  const data = dataISO(inicio) || '0000-00-00';
  const repo = cwd ? path.basename(cwd) : null;
  const nTools = eventos.filter(e => e.papel === 'tool_use').length;

  const corpo = [`# ${titulo}`, ''];
  corpo.push(`**Repositório:** ${repo || '?'} · **Início:** ${inicio?.replace('T', ' ').slice(0, 16) || '?'} · **Fim:** ${fim?.replace('T', ' ').slice(0, 16) || '?'} · **Ferramentas chamadas:** ${nTools} · **Blocos de raciocínio omitidos:** ${nThinking}`, '');
  corpo.push('> Transcrição bruta completa em `_raw/sessoes-code/`. Saídas de ferramentas estão truncadas aqui.', '', '---', '');
  for (const e of eventos) {
    const marcaSide = e.side ? ' _(subagente)_' : '';
    if (e.papel === 'user') corpo.push(`## 👤 Usuário${marcaSide}`, '', e.texto.trim(), '');
    else if (e.papel === 'assistant') corpo.push(`## 🤖 Claude${marcaSide}`, '', e.texto.trim(), '');
    else if (e.papel === 'tool_use') corpo.push(`> 🔧 **${e.nome}**${marcaSide}${e.resumo ? ` — ${e.resumo.replace(/\n/g, ' ')}` : ''}`, '');
    else if (e.papel === 'tool_result') {
      const t = (e.texto || '').trim();
      if (!t) continue;
      const cortado = t.length > LIMITE_RESULTADO ? t.slice(0, LIMITE_RESULTADO) + `\n… (${t.length - LIMITE_RESULTADO} caracteres omitidos)` : t;
      corpo.push(`<details><summary>${e.erro ? '❌' : '📄'} resultado de ${e.nome}</summary>`, '', '```', cortado.replace(/```/g, "'''"), '```', '', '</details>', '');
    }
  }
  const fm = frontmatter({
    title: titulo, date: data, source: 'claude-code', source_id: sessionId,
    url: sessionId ? `https://claude.ai/code/${sessionId}` : null, repo, cwd, model: modelo,
    cost_usd: custo != null ? Math.round(custo * 100) / 100 : null, tool_calls: nTools,
    raw: path.posix.join('_raw/sessoes-code', path.basename(arquivo)),
    tags: ['claude', 'claude-code', ...(repo ? ['repo/' + slugify(repo, 40)] : [])],
  });
  const destino = path.join(DEST, data.slice(0, 7), `${data}_${slugify(titulo, 50)}_${String(sessionId || 'x').slice(0, 8)}.md`);
  escrever(destino, fm + corpo.join('\n'));
  return destino;
}

const args = process.argv.slice(2);
const arquivos = args.length ? args : [...andar(RAW, p => p.endsWith('.jsonl'))];
let n = 0;
for (const a of arquivos) {
  // se veio de fora do vault, guarda cópia bruta primeiro
  if (!path.resolve(a).startsWith(RAW)) {
    const copia = path.join(RAW, path.basename(a));
    fs.mkdirSync(RAW, { recursive: true }); fs.copyFileSync(a, copia);
  }
  const r = converter(a); if (r) { n++; console.log('→', path.relative(RAIZ, r)); }
}
console.log(`sessões convertidas: ${n}`);
