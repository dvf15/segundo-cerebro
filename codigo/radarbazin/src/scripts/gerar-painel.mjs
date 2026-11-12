#!/usr/bin/env node
/**
 * Gera as duas saídas do painel a partir de src/painel.html e dos JSON de dados:
 *
 *   index.html          página completa, publicada no GitHub Pages
 *   artifact/painel.html mesmo conteúdo sem o esqueleto <html>/<head>/<body>,
 *                        no formato que o Claude Artifact espera
 *
 * Os dados são embutidos nas duas. No Pages a página ainda busca
 * data/cotacoes.json e sobrescreve os preços; fora dele, vale o embutido.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = async (p) => JSON.parse(await readFile(join(raiz, p), "utf8"));

const dados = {
  carteira: await ler("data/carteira.json"),
  fundamentos: await ler("data/fundamentos.json"),
  cotacoes: await ler("data/cotacoes.json"),
  tecnica: await ler("data/tecnica.json"),
  termometro: await ler("data/termometro.json").catch(() => null),
  opcoes: await ler("data/opcoes.json").catch(() => null),
};

// "<" escapado para que nada no JSON possa fechar a tag <script> que o carrega
const json = JSON.stringify(dados).replaceAll("<", "\\u003c");

const modelo = await readFile(join(raiz, "src", "painel.html"), "utf8");
const [cabeca, corpo] = modelo.split("<!--/head-->");
if (corpo === undefined) throw new Error("marcador <!--/head--> não encontrado em src/painel.html");

const conteudo = (cabeca + corpo).replace("__DADOS__", json);

const paginaCompleta = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#124559">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Radar Bazin">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icone.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
${cabeca.trim()}
</head>
<body>
${corpo.trim().replace("__DADOS__", json)}
</body>
</html>
`;

await writeFile(join(raiz, "index.html"), paginaCompleta, "utf8");
await mkdir(join(raiz, "artifact"), { recursive: true });
await writeFile(join(raiz, "artifact", "painel.html"), conteudo, "utf8");

console.log(`index.html            ${(paginaCompleta.length / 1024).toFixed(1)} KB`);
console.log(`artifact/painel.html  ${(conteudo.length / 1024).toFixed(1)} KB`);
