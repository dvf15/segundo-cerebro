// Converte o export oficial do claude.ai (formato de novembro/2026: manifesto + zips por categoria)
// colocado em _raw/claude-export/<data>/ em notas .md com frontmatter.
//   conversations.json            -> claude/conversas/AAAA-MM/
//   projects/*.json | projects.json -> claude/projetos/<projeto>/
//   memories/*.json               -> claude/memoria/
//   design_chats/*.json           -> claude/design-chats/
//   artifacts/*/data/documents.json -> claude/artifacts/_dados/
//   claude_code_cloud/*.json      -> claude/claude-code-cloud/tarefas-agendadas.md
//   reflections/*.json            -> claude/reflexoes/
//   users.json / login_history.json / frames-*.zip -> ignorados
// Idempotente: dedup por UUID (sobrescreve a nota com o mesmo source_id).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { RAIZ, slugify, dataISO, frontmatter, escrever, andar, lerFrontmatter } from './lib.mjs';

const RAW = path.join(RAIZ, '_raw', 'claude-export');
const C = (...p) => path.join(RAIZ, 'claude', ...p);
const lerJson = a => { try { return JSON.parse(fs.readFileSync(a, 'utf8')); } catch { console.warn('JSON inválido:', path.relative(RAIZ, a)); return null; } };
const tot = {};
const conta = k => { tot[k] = (tot[k] || 0) + 1; };

function extrairZips() {
  for (const zip of andar(RAW, p => p.endsWith('.zip'))) {
    if (/frames-\d+\.zip$/.test(zip)) continue;
    const destino = zip.replace(/\.zip$/, '');
    if (fs.existsSync(destino)) continue;
    fs.mkdirSync(destino, { recursive: true });
    try { execFileSync('unzip', ['-o', '-q', zip, '-d', destino], { stdio: 'inherit' }); console.log('extraído', path.relative(RAIZ, zip)); }
    catch { console.warn('não consegui extrair', zip, '(instale unzip ou extraia manualmente)'); }
  }
}

// ---------- conversas ----------
function textoDaMensagem(msg) {
  if (typeof msg.text === 'string' && msg.text.trim()) return msg.text;
  if (Array.isArray(msg.content)) {
    return msg.content.map(b => {
      if (typeof b === 'string') return b;
      if (b.type === 'text') return b.text || '';
      if (b.type === 'tool_use') return `> 🔧 ferramenta: ${b.name || ''}`;
      if (b.type === 'document' || b.type === 'image') return `> 📎 ${b.type}${b.title || b.name ? `: ${b.title || b.name}` : ''}`;
      return '';
    }).filter(Boolean).join('\n\n');
  }
  return '';
}
// Reconstrói os arquivos que o Claude criou/editou DENTRO da conversa (create_file, str_replace, Write, Edit):
// versão final de cada caminho, aplicando as edições em ordem. Salvos em claude/arquivos-gerados/.
function coletarArquivos(msgs) {
  const arq = new Map();
  for (const m of msgs) for (const b of (m.content || [])) {
    if (b.type !== 'tool_use') continue;
    const i = b.input || {}, n = b.name, p = i.path || i.file_path;
    if (!p || typeof p !== 'string') continue;
    if (n === 'create_file' && typeof i.file_text === 'string') arq.set(p, i.file_text);
    else if (n === 'Write' && typeof i.content === 'string') arq.set(p, i.content);
    else if ((n === 'str_replace' || n === 'Edit') && arq.has(p)) {
      const antigo = i.old_str ?? i.old_string, novo = i.new_str ?? i.new_string;
      if (typeof antigo === 'string' && antigo && arq.get(p).includes(antigo)) arq.set(p, arq.get(p).replace(antigo, typeof novo === 'string' ? novo : ''));
    }
  }
  return arq;
}

function converterConversas(conversas, projetoDaConversa) {
  for (const c of conversas) {
    const msgs = c.chat_messages || c.messages || [];
    if (!msgs.some(m => textoDaMensagem(m).trim())) { conta('conversas-vazias'); continue; }
    const data = dataISO(c.created_at) || dataISO(msgs[0]?.created_at) || '0000-00-00';
    const titulo = (c.name || '').trim() || (textoDaMensagem(msgs.find(m => m.sender === 'human') || {}) || 'Conversa sem título').replace(/\s+/g, ' ').slice(0, 80);
    const projeto = projetoDaConversa.get(c.uuid) || c.project?.name || null;
    const arquivos = coletarArquivos(msgs);
    const corpo = [`# ${titulo}`, ''];
    if (c.summary) corpo.push(`> **Resumo:** ${String(c.summary).replace(/\n+/g, ' ')}`, '');
    corpo.push(`**Mensagens:** ${msgs.length} · **Criada:** ${data} · **Atualizada:** ${dataISO(c.updated_at) || '?'}`, '', '---', '');
    for (const m of msgs) {
      const quem = m.sender === 'human' ? '👤 Usuário' : '🤖 Claude';
      const quando = m.created_at ? new Date(m.created_at).toISOString().replace('T', ' ').slice(0, 16) : '';
      corpo.push(`## ${quem}${quando ? ` · ${quando}` : ''}`, '', textoDaMensagem(m) || '_(sem texto)_', '');
      const anexos = [...(m.attachments || []), ...(m.files || [])];
      for (const a of anexos) {
        corpo.push(`- 📎 ${a.file_name || a.name || 'anexo'}${a.file_type ? ` (${a.file_type})` : ''}`);
        if (a.extracted_content) corpo.push('', '```', String(a.extracted_content).slice(0, 20000), '```');
      }
      if (anexos.length) corpo.push('');
    }
    if (arquivos.size) {
      const base = ['arquivos-gerados', data.slice(0, 7), `${slugify(titulo, 50)}_${String(c.uuid).slice(0, 8)}`];
      corpo.push('', '---', '', '## Arquivos gerados nesta conversa', '');
      for (const [p, conteudo] of arquivos) {
        const limpo = p.replace(/^[\\/]+/, '').split(/[\\/]+/).filter(x => x && x !== '..' && x !== '.').join('/');
        if (!limpo || Buffer.byteLength(conteudo) > 8 * 1024 * 1024) continue;
        escrever(C(...base, limpo), conteudo);
        corpo.push(`- [[${['claude', ...base, limpo].join('/')}]] (${Math.round(Buffer.byteLength(conteudo) / 1024) || '<1'} KB)`);
        conta('arquivos-gerados');
      }
      corpo.push('');
    }
    escrever(C('conversas', data.slice(0, 7), `${data}_${slugify(titulo, 60)}_${String(c.uuid).slice(0, 8)}.md`), frontmatter({
      title: titulo, date: data, updated: dataISO(c.updated_at), source: 'claude-chat', source_id: c.uuid,
      url: `https://claude.ai/chat/${c.uuid}`, project: projeto, messages: msgs.length, generated_files: arquivos.size,
      tags: ['claude', 'conversa', ...(projeto ? ['projeto/' + slugify(projeto, 40)] : [])],
    }) + corpo.join('\n'));
    conta('conversas');
  }
}

// ---------- projetos ----------
function converterProjeto(p) {
  const pasta = C('projetos', slugify(p.name, 60));
  const data = dataISO(p.created_at) || '0000-00-00';
  const corpo = [`# ${p.name}`, ''];
  if (p.description) corpo.push(p.description, '');
  if (p.prompt_template) corpo.push('## Instruções do projeto', '', p.prompt_template, '');
  const docs = p.docs || [];
  if (docs.length) {
    corpo.push('## Arquivos de conhecimento', '');
    for (const d of docs) {
      const nome = d.filename || d.name || 'documento';
      const arqDoc = `${slugify(nome, 60)}_${String(d.uuid || '').slice(0, 8)}.md`;
      corpo.push(`- [[${path.posix.join('claude/projetos', slugify(p.name, 60), arqDoc.replace(/\.md$/, ''))}|${nome}]]`);
      escrever(path.join(pasta, arqDoc), frontmatter({
        title: nome, date: dataISO(d.created_at) || data, source: 'claude-project-doc', source_id: d.uuid || null,
        project: p.name, tags: ['claude', 'projeto', 'conhecimento'],
      }) + `# ${nome}\n\n${d.content || ''}\n`);
    }
    corpo.push('');
  }
  escrever(path.join(pasta, '_projeto.md'), frontmatter({
    title: p.name, date: data, updated: dataISO(p.updated_at), source: 'claude-project', source_id: p.uuid,
    url: `https://claude.ai/project/${p.uuid}`, project: p.name, docs: docs.length, private: p.is_private ?? null, tags: ['claude', 'projeto'],
  }) + corpo.join('\n'));
  conta('projetos');
}

// ---------- memória ----------
function converterMemoria(m, nomesProjetos) {
  const base = C('memoria');
  if (m.conversations_memory) {
    escrever(path.join(base, '_memoria-geral.md'), frontmatter({ title: 'Memória geral das conversas', source: 'claude-memory', source_id: 'conversations_memory', tags: ['claude', 'memoria'] }) + `# Memória geral das conversas\n\n${m.conversations_memory}\n`);
    conta('memoria');
  }
  for (const [pid, texto] of Object.entries(m.project_memories || {})) {
    const nome = nomesProjetos.get(pid) || pid;
    escrever(path.join(base, 'projetos', `${slugify(nome, 60)}_${pid.slice(0, 8)}.md`), frontmatter({ title: `Memória do projeto: ${nome}`, source: 'claude-memory', source_id: pid, project: nome, tags: ['claude', 'memoria', 'projeto/' + slugify(nome, 40)] }) + `# Memória do projeto: ${nome}\n\n${texto}\n`);
    conta('memoria');
  }
  for (const f of m.memory_files || []) {
    let conteudo = f.content || '';
    const fmInterno = lerFrontmatter(conteudo);
    if (/^---\r?\n/.test(conteudo)) conteudo = conteudo.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
    let rel = f.path.replace(/^\//, '');
    rel = rel.replace(/^projects\/([0-9a-f-]{36})/, (_, id) => 'projects/' + slugify(nomesProjetos.get(id) || id, 50));
    escrever(path.join(base, 'arquivos', rel.endsWith('.md') ? rel : rel + '.md'), frontmatter({
      title: fmInterno.name || path.basename(f.path, '.md'), date: dataISO(f.updated_at), source: 'claude-memory', source_id: f.path,
      description: fmInterno.description || null, tags: ['claude', 'memoria', 'memoria/' + (f.path.split('/')[1] || 'raiz')],
    }) + conteudo.trim() + '\n');
    conta('memoria');
  }
}

// ---------- design chats ----------
function converterDesignChat(d) {
  const data = dataISO(d.created_at) || '0000-00-00';
  const titulo = (d.title && d.title !== 'Chat' ? d.title : null) || d.project?.name || 'Design chat';
  const corpo = [`# ${titulo}`, '', `**Projeto de design:** ${d.project?.name || '?'} · **Mensagens:** ${(d.messages || []).length}`, '', '---', ''];
  for (const m of d.messages || []) {
    const c = m.content || {};
    const texto = typeof c === 'string' ? c : (c.content || c.text || '');
    corpo.push(`## ${m.role === 'user' ? '👤 Usuário' : '🤖 Claude'}${m.created_at ? ` · ${m.created_at.slice(0, 16).replace('T', ' ')}` : ''}`, '', texto || '_(sem texto)_', '');
    for (const a of (c.attachments || [])) corpo.push(`- 📎 ${a.name || a.title || a.type || 'anexo'}${a.content ? `: ${String(a.content).slice(0, 300).replace(/\n/g, ' ')}` : ''}`);
    if ((c.attachments || []).length) corpo.push('');
  }
  escrever(C('design-chats', `${data}_${slugify(titulo, 50)}_${String(d.uuid).slice(0, 8)}.md`), frontmatter({
    title: titulo, date: data, updated: dataISO(d.updated_at), source: 'claude-design-chat', source_id: d.uuid, project: d.project?.name || null, tags: ['claude', 'design'],
  }) + corpo.join('\n'));
  conta('design-chats');
}

// ---------- dados de artifacts ----------
function converterDadosArtifact(arq, docs) {
  const id = arq.split(path.sep).slice(-3)[0];
  const porColecao = {};
  for (const d of docs.documents || []) (porColecao[d.collection || 'default'] ||= []).push(d);
  const corpo = [`# Dados do artifact ${id}`, '', `Banco de dados do artifact (coleções: ${Object.keys(porColecao).join(', ') || 'nenhuma'}).`, ''];
  for (const [col, lista] of Object.entries(porColecao)) {
    corpo.push(`## ${col} (${lista.length})`, '', '```json', JSON.stringify(lista, null, 2).slice(0, 60000), '```', '');
  }
  escrever(C('artifacts', '_dados', `${id}.md`), frontmatter({ title: `Dados do artifact ${id.slice(0, 8)}`, source: 'claude-artifact-data', source_id: id, documents: (docs.documents || []).length, tags: ['claude', 'artifact', 'artifact/dados'] }) + corpo.join('\n'));
  conta('artifact-dados');
}

// ---------- tarefas agendadas (claude_code_cloud) ----------
function converterRotinas(rotinas, execucoes) {
  const corpo = ['# Tarefas agendadas do Claude Code (nuvem)', '', '> O export oficial traz apenas as definições e execuções das tarefas agendadas, não as transcrições das sessões.', ''];
  for (const r of rotinas) {
    const runs = execucoes.filter(e => e.routine_id === r.routine_id);
    const ok = runs.filter(e => e.status === 'succeeded').length;
    corpo.push(`## ${r.name}`, '', `- **ID:** ${r.routine_id}`, `- **Ativa:** ${r.enabled ? 'sim' : 'não'}${r.ended_at ? ` (encerrada em ${r.ended_at.slice(0, 10)})` : ''}`,
      `- **Agenda:** ${r.schedule?.cron || r.schedule?.run_once_at || '?'}`, `- **Criada:** ${dataISO(r.created_at)}`, `- **Execuções:** ${runs.length} (${ok} com sucesso)`, '',
      '**Prompt:**', '', '```', r.prompt_withheld ? '(prompt omitido pelo export)' : (r.prompt || ''), '```', '');
    if (runs.length) {
      corpo.push('| Agendada para | Status | Sessão |', '| --- | --- | --- |');
      for (const e of runs.sort((a, b) => (b.scheduled_for || '').localeCompare(a.scheduled_for || '')).slice(0, 50)) corpo.push(`| ${(e.scheduled_for || '').slice(0, 16).replace('T', ' ')} | ${e.status} | ${e.session_id ? `[${e.session_id.slice(0, 12)}…](https://claude.ai/code/${e.session_id})` : ''} |`);
      corpo.push('');
    }
  }
  escrever(C('claude-code-cloud', 'tarefas-agendadas.md'), frontmatter({ title: 'Tarefas agendadas do Claude Code', date: new Date().toISOString().slice(0, 10), source: 'claude-routines', source_id: 'claude_code_cloud', routines: rotinas.length, runs: execucoes.length, tags: ['claude', 'claude-code', 'rotinas'] }) + corpo.join('\n'));
  conta('rotinas');
}

// ---------- reflexões ----------
function converterReflexoes(r) {
  for (const x of r.reflections || []) {
    const c = x.content || {};
    const corpo = [`# ${c.hero_title || 'Reflexão'} · ${c.period || x.period}`, '', c.hero_body || '', ''];
    const lista = (titulo, itens, f) => { if (itens?.length) { corpo.push(`## ${titulo}`, ''); for (const i of itens) corpo.push(f(i)); corpo.push(''); } };
    lista('Números', c.stats, i => `- **${i.label}:** ${i.n}${i.sublabel ? ` (${i.sublabel})` : ''}`);
    lista('Temas', c.topics, i => `- **${i.title}** (${i.percent}%): ${i.description}`);
    lista('Sobre o seu tempo', c.about_your_time, i => `### ${i.title}\n\n${i.body}\n`);
    lista('Expandindo habilidades', c.expanding_your_skills, i => `### ${i.title}${i.skill ? ` (${i.skill})` : ''}\n\n${i.body}\n`);
    lista('Vale pensar', c.worth_thinking_about, i => `### ${i.title}\n\n${i.body}\n`);
    escrever(C('reflexoes', `${x.period.replace(/[^0-9A-Za-z-]+/g, '_')}.md`), frontmatter({ title: `Reflexão ${c.period || x.period}`, date: dataISO(x.created_at), source: 'claude-reflection', source_id: x.period, tags: ['claude', 'reflexao'] }) + corpo.join('\n'));
    conta('reflexoes');
  }
}

function main() {
  if (!fs.existsSync(RAW)) { console.log('nada em _raw/claude-export'); return; }
  extrairZips();
  const conversas = [], projetos = [], memorias = [], designs = [], dadosArt = [], rotinas = [], execucoes = [], reflexoes = [];
  for (const arq of andar(RAW, p => p.endsWith('.json'))) {
    const nome = path.basename(arq), pai = path.basename(path.dirname(arq)), avo = path.basename(path.dirname(path.dirname(arq)));
    if (nome.startsWith('manifest-') || nome === 'users.json' || nome === 'login_history.json') continue;
    const d = lerJson(arq); if (d == null) continue;
    if (nome === 'conversations.json' && Array.isArray(d)) conversas.push(...d);
    else if (nome === 'projects.json' && Array.isArray(d)) projetos.push(...d);
    else if (pai === 'projects' && d.uuid) projetos.push({ ...d, name: (d.name || '').trim() || 'Projeto sem nome ' + String(d.uuid).slice(0, 8) });
    else if (pai === 'memories' && (d.memory_files || d.conversations_memory)) memorias.push(d);
    else if (pai === 'design_chats' && d.messages) designs.push(d);
    else if (nome === 'documents.json' && pai === 'data') dadosArt.push([arq, d]);
    else if (nome === 'routines.json') rotinas.push(...(d.claude_code_cloud || []));
    else if (nome === 'routine_runs.json') execucoes.push(...(d.claude_code_cloud || []));
    else if (pai === 'reflections') reflexoes.push(d);
    else console.log('ignorado:', path.relative(RAW, arq), `(${avo}/${pai})`);
  }
  const porId = new Map();
  for (const c of conversas) { const ant = porId.get(c.uuid); if (!ant || (c.updated_at || '') > (ant.updated_at || '')) porId.set(c.uuid, c); }
  const projPorId = new Map();
  for (const p of projetos) { const ant = projPorId.get(p.uuid); if (!ant || (p.updated_at || '') > (ant.updated_at || '')) projPorId.set(p.uuid, p); }
  const nomesProjetos = new Map([...projPorId.values()].map(p => [p.uuid, p.name]));
  const projetoDaConversa = new Map();
  for (const p of projPorId.values()) for (const c of p.conversations || []) projetoDaConversa.set(typeof c === 'string' ? c : c.uuid, p.name);

  converterConversas([...porId.values()], projetoDaConversa);
  for (const p of projPorId.values()) converterProjeto(p);
  for (const m of memorias) converterMemoria(m, nomesProjetos);
  for (const d of designs) converterDesignChat(d);
  for (const [arq, d] of dadosArt) converterDadosArtifact(arq, d);
  if (rotinas.length) converterRotinas(rotinas, execucoes);
  for (const r of reflexoes) converterReflexoes(r);
  const obsoleto = C('users.md'); if (fs.existsSync(obsoleto)) fs.rmSync(obsoleto);
  console.log('export convertido:', JSON.stringify(tot));
}
main();
