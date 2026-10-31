// Gera uma nota .md por artifact a partir de _raw/artifacts-manifest.json e do index.html salvo
// em claude/artifacts/<slug>/index.html. A nota traz metadados + texto extraído (buscável).
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, frontmatter, escrever, htmlParaTexto, tituloHtml, slugify } from './lib.mjs';

const manifest = JSON.parse(fs.readFileSync(path.join(RAIZ, '_raw', 'artifacts-manifest.json'), 'utf8'));
const DIR = path.join(RAIZ, 'claude', 'artifacts');
let n = 0;
for (const a of manifest) {
  const pasta = path.join(DIR, a.slug);
  const htmlPath = path.join(pasta, 'index.html');
  const temHtml = fs.existsSync(htmlPath);
  const html = temHtml ? fs.readFileSync(htmlPath, 'utf8') : '';
  const tamanho = temHtml ? fs.statSync(htmlPath).size : 0;
  const texto = temHtml ? htmlParaTexto(html, 6000) : '';
  const corpo = [
    `# ${a.title}`, '',
    `- **Link:** ${a.url}`,
    `- **Tipo:** ${a.kind}${a.owner === 'shared' ? ' · compartilhado comigo (autoria de terceiros)' : ''}`,
    `- **Última atualização conhecida:** ${a.updated || 'desconhecida'}`,
    `- **Arquivo:** ${temHtml ? `[index.html](index.html) (${(tamanho / 1024).toFixed(0)} KB)` : '_não baixado_'}`,
    '',
    '## Texto extraído (para busca)', '',
    texto ? texto : '_sem texto extraível (página renderizada só por JavaScript)_', '',
  ];
  escrever(path.join(pasta, `${a.slug}.md`), frontmatter({
    title: a.title, date: a.updated || null, source: 'claude-artifact', source_id: a.url.split('/').pop(), url: a.url,
    kind: a.kind, owner: a.owner, html_title: temHtml ? tituloHtml(html) : null, size_kb: Math.round(tamanho / 1024),
    tags: ['claude', 'artifact', 'artifact/' + a.kind],
  }) + corpo.join('\n'));
  n++;
}
console.log(`artifacts anotados: ${n}`);
