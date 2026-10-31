// Converte o export oficial do claude.ai (zip ou JSON em _raw/claude-export/**)
// em notas .md com frontmatter: claude/conversas/AAAA-MM/*.md e claude/projetos/<projeto>/*.md
// Idempotente: dedup por UUID (sobrescreve a nota com o mesmo source_id).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { RAIZ, slugify, dataISO, frontmatter, escrever, andar } from './lib.mjs';

const RAW = path.join(RAIZ, '_raw', 'claude-export');
const DEST_CONV = path.join(RAIZ, 'claude', 'conversas');
const DEST_PROJ = path.join(RAIZ, 'claude', 'projetos');

function extrairZips() {
  for (const zip of andar(RAW, p => p.endsWith('.zip'))) {
    const destino = zip.replace(/\.zip$/, '');
    if (fs.existsSync(destino)) continue;
    fs.mkdirSync(destino, { recursive: true });
    try {
      execFileSync('unzip', ['-o', '-q', zip, '-d', destino], { stdio: 'inherit' });
      console.log('extraído', path.relative(RAIZ, zip));
    } catch (e) {
      console.warn('não consegui extrair', zip, '(instale unzip ou extraia manualmente)');
    }
  }
}

function textoDaMensagem(msg) {
  if (typeof msg.text === 'string' && msg.text.trim()) return msg.text;
  if (Array.isArray(msg.content)) {
    return msg.content.map(b => {
      if (typeof b === 'string') return b;
      if (b.type === 'text') return b.text || '';
      if (b.type === 'tool_use') return `> 🔧 ferramenta: ${b.name || ''}`;
      if (b.type === 'tool_result') return '';
      return b.text || '';
    }).filter(Boolean).join('\n\n');
  }
  return '';
}

function indexarProjetos(projetos) {
  const porConversa = new Map();
  for (const p of projetos) {
    for (const c of p.conversations || p.chat_conversations || []) {
      const id = typeof c === 'string' ? c : c.uuid;
      if (id) porConversa.set(id, p.name);
    }
  }
  return porConversa;
}

function converterConversas(conversas, projetoDaConversa) {
  let n = 0;
  for (const c of conversas) {
    const msgs = c.chat_messages || c.messages || [];
    const data = dataISO(c.created_at) || dataISO(msgs[0]?.created_at) || '0000-00-00';
    const titulo = (c.name || '').trim() || (textoDaMensagem(msgs.find(m => m.sender === 'human') || {}) || 'Conversa sem título').slice(0, 80);
    const projeto = projetoDaConversa.get(c.uuid) || c.project?.name || null;
    const corpo = [];
    corpo.push(`# ${titulo}`, '');
    if (c.summary) corpo.push(`> **Resumo:** ${c.summary}`, '');
    corpo.push(`**Mensagens:** ${msgs.length} · **Criada:** ${data} · **Atualizada:** ${dataISO(c.updated_at) || '?'}`, '', '---', '');
    for (const m of msgs) {
      const quem = m.sender === 'human' ? '👤 Usuário' : '🤖 Claude';
      const quando = m.created_at ? new Date(m.created_at).toISOString().replace('T', ' ').slice(0, 16) : '';
      corpo.push(`## ${quem} ${quando ? `· ${quando}` : ''}`.trim(), '');
      corpo.push(textoDaMensagem(m) || '_(sem texto)_', '');
      const anexos = [...(m.attachments || []), ...(m.files || [])];
      for (const a of anexos) {
        const nome = a.file_name || a.name || 'anexo';
        corpo.push(`- 📎 ${nome}${a.file_type ? ` (${a.file_type})` : ''}`);
        if (a.extracted_content) corpo.push('', '```', String(a.extracted_content).slice(0, 20000), '```');
      }
      if (anexos.length) corpo.push('');
    }
    const fm = frontmatter({
      title: titulo,
      date: data,
      updated: dataISO(c.updated_at),
      source: 'claude-chat',
      source_id: c.uuid,
      url: `https://claude.ai/chat/${c.uuid}`,
      project: projeto,
      messages: msgs.length,
      tags: ['claude', 'conversa', ...(projeto ? ['projeto/' + slugify(projeto, 40)] : [])],
    });
    const arquivo = path.join(DEST_CONV, data.slice(0, 7), `${data}_${slugify(titulo, 60)}_${String(c.uuid).slice(0, 8)}.md`);
    escrever(arquivo, fm + corpo.join('\n'));
    n++;
  }
  return n;
}

function converterProjetos(projetos) {
  let n = 0;
  for (const p of projetos) {
    const pasta = path.join(DEST_PROJ, slugify(p.name, 60));
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
      url: `https://claude.ai/project/${p.uuid}`, project: p.name, docs: docs.length, tags: ['claude', 'projeto'],
    }) + corpo.join('\n'));
    n++;
  }
  return n;
}

function main() {
  if (!fs.existsSync(RAW)) { console.log('nada em _raw/claude-export'); return; }
  extrairZips();
  const conversas = [], projetos = [];
  for (const arq of andar(RAW, p => p.endsWith('.json'))) {
    const nome = path.basename(arq);
    try {
      const dados = JSON.parse(fs.readFileSync(arq, 'utf8'));
      if (nome === 'conversations.json' && Array.isArray(dados)) conversas.push(...dados);
      else if (nome === 'projects.json' && Array.isArray(dados)) projetos.push(...dados);
      else if (nome === 'memories.json' || nome === 'users.json') {
        escrever(path.join(RAIZ, 'claude', nome.replace('.json', '.md')), frontmatter({ title: nome, source: 'claude-export', tags: ['claude'] }) + '```json\n' + JSON.stringify(dados, null, 2) + '\n```\n');
      }
    } catch (e) { console.warn('ignorado (JSON inválido):', nome); }
  }
  // dedup por uuid, mantendo a versão mais recente
  const porId = new Map();
  for (const c of conversas) { const ant = porId.get(c.uuid); if (!ant || (c.updated_at || '') > (ant.updated_at || '')) porId.set(c.uuid, c); }
  const nConv = converterConversas([...porId.values()], indexarProjetos(projetos));
  const nProj = converterProjetos(projetos);
  console.log(`conversas: ${nConv} · projetos: ${nProj}`);
}
main();
