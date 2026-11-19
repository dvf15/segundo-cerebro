// Gera legalizacoes/index.html (GitHub Pages) a partir de legalizacoes/app.html,
// que fica no formato de Artifact do Claude (sem <html>/<head>/<body>).
import { readFileSync, writeFileSync } from 'node:fs';

const raiz = new URL('../legalizacoes/', import.meta.url);
const app = readFileSync(new URL('app.html', raiz), 'utf8');
const fimCabeca = app.indexOf('</style>') + '</style>'.length;

const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>body{margin:0}[hidden]{display:none!important}</style>
${app.slice(0, fimCabeca)}
</head>
<body>
${app.slice(fimCabeca)}
</body>
</html>
`;
writeFileSync(new URL('index.html', raiz), pagina);
console.log('legalizacoes/index.html gerado');
