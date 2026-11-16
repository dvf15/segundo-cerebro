#!/usr/bin/env node
/* Monta a página: junta config.json, as pastas de shoppings/ e o código de src/ em dist/planta-3d.html.
   Uso: node scripts/montar.mjs            (monta e confere)
        node scripts/montar.mjs --conferir (só confere os dados, sem gravar)
        node scripts/montar.mjs --config config.zona-norte.json
   Um config pode herdar de outro com "base": "config.json" e gravar em outro arquivo com "saida". */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const json = f => { try { return JSON.parse(ler(f)); } catch (e) { throw new Error(`${f}: JSON inválido (${e.message})`); } };
const existe = f => fs.existsSync(path.join(RAIZ, f));
const {criarNucleo} = createRequire(import.meta.url)(path.join(RAIZ, 'src/nucleo.js'));

const TIPOS = ['Loja', 'Quiosque', 'Âncora', 'Megaloja', 'Restaurante', 'Alimentação', 'Serviço', 'Lazer'];
const STATUS = ['Em operação', 'Em obras', 'Em breve'];
const erros = [], avisos = [];

const ic = process.argv.indexOf('--config'), cfgArq = ic > 0 ? process.argv[ic + 1] : 'config.json';
let config = json(cfgArq);
if (config.base) { config = {...json(config.base), ...config}; delete config.base; }
const SAIDA = config.saida || 'dist/planta-3d.html'; delete config.saida;
const N = criarNucleo(config);
const grupos = new Set(N.GRUPOS);
if (!Array.isArray(config.shoppings) || !config.shoppings.length) erros.push('config.json: "shoppings" precisa listar ao menos uma pasta de shoppings/.');
(config.campos || []).forEach(c => { if (!c.chave || !c.rotulo) erros.push('config.json: cada item de "campos" precisa de "chave" e "rotulo".'); });

const shoppings = {};
for (const id of config.shoppings || []) {
  const dir = `shoppings/${id}`, onde = m => `${dir}: ${m}`;
  if (!existe(`${dir}/shopping.json`)) { erros.push(onde('falta shopping.json.')); continue; }
  const D = json(`${dir}/shopping.json`);
  if (!D.nome) erros.push(onde('falta "nome".'));
  if (!Array.isArray(D.contorno) || D.contorno.length < 3) { erros.push(onde('"contorno" precisa de ao menos 3 pontos [x, y] em metros.')); continue; }
  if (!Array.isArray(D.niveis) || !D.niveis.length) { erros.push(onde('"niveis" precisa de ao menos um piso.')); continue; }
  if (!D.niveis.some(n => /^L/.test(n.id))) avisos.push(onde('nenhum piso com id começando em "L". Pisos de lojas usam L1, L2...; garagens, G1...; subsolo, SS.'));

  // lista de lojas: lojas.json (com ou sem desenho próprio) ou lojas.csv (planilha)
  if (existe(`${dir}/lojas.json`)) D.lojas = json(`${dir}/lojas.json`);
  else if (existe(`${dir}/lojas.csv`)) { const r = N.parseLista(ler(`${dir}/lojas.csv`)); if (r.erro) erros.push(onde('lojas.csv: ' + r.erro)); D.lojas = r.rows; }
  else D.lojas = [];
  const ids = new Set(D.niveis.map(n => n.id));
  D.lojas.forEach((s, i) => {
    const q = `loja ${i + 1} (${s.nome || 'sem nome'})`;
    if (!s.nome) erros.push(onde(q + ': falta "nome".'));
    if (!s.nivel) s.nivel = N.nivelDe(s.piso_oficial);
    if (!TIPOS.includes(s.tipo)) { avisos.push(onde(`${q}: tipo "${s.tipo}" fora da lista (${TIPOS.join(', ')}); tratado como Loja.`)); s.tipo = 'Loja'; }
    if (!grupos.has(s.grupo)) { const g = N.grupoDe((s.categoria || '') + ' ' + (s.nome || '')); if (s.grupo) avisos.push(onde(`${q}: grupo "${s.grupo}" não está em config.json; virou "${g}".`)); s.grupo = g; }
    if (!STATUS.includes(s.status)) s.status = 'Em operação';
    if (!(s.area_est > 0)) { s.area_est = N.BENCH[s.tipo]; s.faixa = s.faixa || 'referência por tipo de operação (sem área na base)'; }
    if (!(s.fachada_est > 0)) s.fachada_est = Math.round(Math.sqrt(s.area_est / 2.2) * 2) / 2;
    s.categoria = s.categoria || 'Não informado'; s.piso_oficial = s.piso_oficial || s.nivel; s.n_luc = s.n_luc || 1;
    if (s.poly && (!Array.isArray(s.poly) || s.poly.length < 3)) { avisos.push(onde(q + ': "poly" inválido; a planta esquemática vai desenhar esta loja.')); delete s.poly; }
  });
  const novos = N.garantirNiveis(D).filter(n => !ids.has(n));
  if (novos.length) avisos.push(onde(`pisos criados a partir da lista de lojas: ${[...new Set(novos)].join(', ')}. Descreva-os em "niveis" para dar nome e uso.`));

  const chaves = new Set((D.ficha || []).map(f => f.chave));
  (D.kpis || []).forEach(k => { const refs = typeof k === 'string' ? (k.startsWith('@') ? [] : [k]) : k.chaves || []; refs.forEach(c => { if (!chaves.has(c)) avisos.push(onde(`kpis cita "${c}", que não existe na ficha.`)); }); });
  const faltas = (D.ficha || []).filter(f => f.valor == null || f.valor === '').map(f => f.rotulo);
  if (faltas.length) avisos.push(onde(`ficha sem valor (a página mostra [FALTA: dado]): ${faltas.join(', ')}.`));
  if (!chaves.has('abl_m2')) avisos.push(onde('ficha sem "abl_m2": a densidade de quiosques por ABL fica sem cálculo.'));
  Object.keys(D.ajustes || {}).forEach(nome => { if (!D.lojas.some(s => s.nome === nome)) avisos.push(onde(`ajustes cita "${nome}", que não está na lista de lojas.`)); });

  if (existe(`${dir}/entorno.json`)) D.entorno = json(`${dir}/entorno.json`); else avisos.push(onde('sem entorno.json: a maquete sai sem ruas, entradas e prédios vizinhos.'));
  D.id = id; shoppings[id] = D;
}
(config.filtros || []).forEach(f => { if (!f.id || !f.nome || !Array.isArray(f.shoppings)) erros.push('config: cada filtro precisa de "id", "nome" e "shoppings".'); else f.shoppings.forEach(id => { if (!shoppings[id]) erros.push(`config: o filtro "${f.nome}" cita "${id}", que não está em "shoppings".`); }); });
for (const [id, D] of Object.entries(shoppings)) (D.conexoes || []).forEach(c => { if (!c.nome || !c.tipo) erros.push(`shoppings/${id}: cada conexão precisa de "nome" e "tipo".`); if (!c.fonte) avisos.push(`shoppings/${id}: conexão "${c.nome}" sem fonte.`); });
if (config.inicial && !shoppings[config.inicial]) avisos.push(`config.json: "inicial" (${config.inicial}) não está entre os shoppings montados.`);

avisos.forEach(a => console.log('aviso · ' + a));
if (erros.length) { erros.forEach(e => console.error('ERRO  · ' + e)); process.exit(1); }
for (const [id, D] of Object.entries(shoppings)) {
  const k = D.lojas.filter(s => s.tipo === 'Quiosque').length, semDesenho = D.lojas.filter(s => !s.poly).length;
  console.log(`${id}: ${D.lojas.length} operações (${k} quiosques), ${D.niveis.length} pisos, ${semDesenho} lojas na planta esquemática automática, entorno ${D.entorno ? 'sim' : 'não'}`);
}
if (process.argv.includes('--conferir')) process.exit(0);

const varejistas = existe('varejistas.json') ? json('varejistas.json') : null;
if (varejistas) console.log(`varejistas.json: ${varejistas.empresas.length} empresas listadas, ${varejistas.empresas.reduce((n, c) => n + (c.marcas || []).length, 0)} marcas`);
const dados = JSON.stringify({config, shoppings, varejistas}).replace(/<\//g, '<\\/').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const html = `<meta charset="utf-8">
<title>${String(config.titulo || 'Planta 3D').replace(/[<&]/g, '')}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${ler('src/estilo.css')}</style>
${ler('src/corpo.html')}
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const DADOS = ${dados};
${ler('src/nucleo.js')}
${ler('src/app.js')}
</script>
`;
fs.mkdirSync(path.join(RAIZ, 'dist'), {recursive:true});
fs.writeFileSync(path.join(RAIZ, SAIDA), html);
console.log(`${SAIDA} gravado (${Math.round(html.length / 1024)} KB)`);
