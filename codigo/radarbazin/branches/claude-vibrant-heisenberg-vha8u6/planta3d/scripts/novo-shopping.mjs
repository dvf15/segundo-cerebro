#!/usr/bin/env node
/* Cria a pasta de um shopping novo a partir de shoppings/_modelo e o inclui em config.json.
   Uso: node scripts/novo-shopping.mjs <id> "<Nome>" [--papel "meu shopping"|concorrente] */
import fs from 'node:fs';
import {cam, lerJson, gravarShopping, args} from './_util.mjs';

const a = args(process.argv.slice(2)), id = a._[0], nome = a._[1];
if (!id || !nome || !/^[a-z0-9-]+$/.test(id)) { console.error('Uso: node scripts/novo-shopping.mjs <id> "<Nome>" [--papel "meu shopping"]\nO id vira o nome da pasta: só letras minúsculas, números e hífen.'); process.exit(1); }
if (fs.existsSync(cam('shoppings', id))) { console.error(`shoppings/${id} já existe. Nada foi alterado.`); process.exit(1); }
fs.mkdirSync(cam('shoppings', id));
const D = lerJson('shoppings/_modelo/shopping.json');
D.id = id; D.nome = nome; D.curto = nome.toUpperCase().replace(/^SHOPPING\s+/, ''); D.papel = typeof a.papel === 'string' ? a.papel : 'concorrente';
gravarShopping(id, D);
const cfgTxt = fs.readFileSync(cam('config.json'), 'utf8'), cfg = JSON.parse(cfgTxt);
if (!cfg.shoppings.includes(id)) {
  const novo = cfgTxt.replace(/"shoppings":\s*\[[^\]]*\]/, '"shoppings": ' + JSON.stringify(cfg.shoppings.concat(id)).replace(/,/g, ', '));
  JSON.parse(novo); fs.writeFileSync(cam('config.json'), novo);
}
console.log(`Criado shoppings/${id}/shopping.json e incluído em config.json.
Próximos passos:
  1. Contorno e entorno reais:  node scripts/osm.mjs ${id} --way <id do prédio no OpenStreetMap>
  2. Lista de lojas:            grave shoppings/${id}/lojas.csv (modelo em shoppings/_modelo/lojas.exemplo.csv)
  3. Ficha, pisos e fontes:     edite shoppings/${id}/shopping.json (valor null aparece como [FALTA: dado])
  4. Montar a página:           node scripts/montar.mjs`);
