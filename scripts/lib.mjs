// Funções comuns aos scripts do vault segundo-cerebro.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function slugify(texto, max = 70) {
  return String(texto || 'sem-titulo')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '') || 'sem-titulo';
}

export function dataISO(valor) {
  if (!valor) return null;
  const d = new Date(typeof valor === 'number' && valor < 1e12 ? valor * 1000 : valor);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
}

function yamlEscalar(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  const s = String(v);
  if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s)) return s;
  return JSON.stringify(s); // aspas duplas com escape seguro
}

export function frontmatter(obj) {
  const linhas = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      linhas.push(`${k}: [${v.map(yamlEscalar).join(', ')}]`);
    } else {
      linhas.push(`${k}: ${yamlEscalar(v)}`);
    }
  }
  linhas.push('---', '');
  return linhas.join('\n');
}

// Parser mínimo de frontmatter: escalares, listas inline [a, b] e strings com aspas.
export function lerFrontmatter(conteudo) {
  const m = conteudo.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const linha of m[1].split(/\r?\n/)) {
    const mm = linha.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!mm) continue;
    let [, k, v] = mm;
    v = v.trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      fm[k] = v.slice(1, -1).split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')).filter(Boolean);
    } else if (v === 'null' || v === '') {
      fm[k] = null;
    } else if (/^".*"$/.test(v)) {
      try { fm[k] = JSON.parse(v); } catch { fm[k] = v.slice(1, -1); }
    } else {
      fm[k] = v.replace(/^'(.*)'$/, '$1');
    }
  }
  return fm;
}

export function escrever(arquivo, conteudo) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  fs.writeFileSync(arquivo, conteudo, 'utf8');
}

export function* andar(dir, filtro = () => true) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* andar(p, filtro);
    else if (filtro(p)) yield p;
  }
}

export function htmlParaTexto(html, max = 2000) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function tituloHtml(html) {
  const m = String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? htmlParaTexto(m[1], 200) : null;
}

export function wikilink(arquivoRelativo, rotulo) {
  const semExt = arquivoRelativo.replace(/\.md$/, '');
  return rotulo ? `[[${semExt}|${rotulo.replace(/[\[\]|]/g, ' ')}]]` : `[[${semExt}]]`;
}
