/* Funções comuns aos scripts: caminhos e gravação de JSON legível (listas de pontos numa linha só). */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const cam = (...p) => path.join(RAIZ, ...p);
export const lerJson = f => JSON.parse(fs.readFileSync(cam(f), 'utf8'));
const COMPACTAS = ['centro', 'contorno', 'atrio', 'torre'];
export function gravarShopping(id, obj) {
  let s = JSON.stringify(obj, (k, v) => COMPACTAS.includes(k) && Array.isArray(v) ? '@@' + JSON.stringify(v) + '@@' : v, 2);
  s = s.replace(/"@@(.*?)@@"/g, (m, x) => x.replace(/\\"/g, '"'));
  fs.writeFileSync(cam('shoppings', id, 'shopping.json'), s + '\n');
}
export function gravarEntorno(id, X) {
  const txt = '{\n' + ['ruas', 'nomes', 'predios', 'acessos', 'pontos'].map(k => `  "${k}": [\n` + (X[k] || []).map(o => '    ' + JSON.stringify(o)).join(',\n') + '\n  ]').join(',\n') + '\n}\n';
  fs.writeFileSync(cam('shoppings', id, 'entorno.json'), txt);
}
export const hoje = () => new Date().toLocaleDateString('pt-BR');
export function args(argv) {      // --chave valor  e  posicionais
  const o = {_: []};
  for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (a.startsWith('--')) { const v = argv[i + 1]; if (v == null || v.startsWith('--')) o[a.slice(2)] = true; else { o[a.slice(2)] = v; i++; } } else o._.push(a); }
  return o;
}
