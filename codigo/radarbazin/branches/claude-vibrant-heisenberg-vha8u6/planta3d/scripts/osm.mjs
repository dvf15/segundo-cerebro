#!/usr/bin/env node
/* Busca no OpenStreetMap o contorno do prédio e o entorno (ruas, prédios vizinhos, entradas, transporte)
   e grava em shoppings/<id>/shopping.json ("contorno") e shoppings/<id>/entorno.json.
   Coordenadas: metros a partir do centro do prédio, x para leste e y para norte.

   Uso: node scripts/osm.mjs <id> --way 991851293            (prédio mapeado como "way")
        node scripts/osm.mjs <id> --relation 123456          (prédio mapeado como "relation")
        node scripts/osm.mjs <id> --way 991851293 --raio 350 (raio do entorno em metros; padrão 320)
        node scripts/osm.mjs <id> --way 991851293 --so-consulta   (só imprime a consulta, para rodar em overpass-turbo.eu)
        node scripts/osm.mjs <id> --arquivo resposta.json    (usa uma resposta do Overpass já salva, sem rede)
        ... --origem "ways 1, 2 e 3"                        (texto da fonte, quando o contorno junta vários elementos)
   O id do prédio aparece em openstreetmap.org ao clicar no shopping com "Consultar elementos". */
import fs from 'node:fs';
import {cam, lerJson, gravarShopping, gravarEntorno, hoje, args} from './_util.mjs';
import {converter} from './_osm-converter.mjs';

const a = args(process.argv.slice(2)), id = a._[0];
if (!id || (!a.way && !a.relation && !a.arquivo)) { console.error('Uso: node scripts/osm.mjs <id> --way <id OSM> | --relation <id OSM> | --arquivo <resposta.json>'); process.exit(1); }
if (!fs.existsSync(cam('shoppings', id, 'shopping.json'))) { console.error(`shoppings/${id}/shopping.json não existe. Rode antes: node scripts/novo-shopping.mjs ${id} "<Nome>"`); process.exit(1); }
const R = +a.raio || 320, alvo = a.way ? `way(${+a.way})` : `rel(${+a.relation})`;
const consulta = `[out:json][timeout:90];
${alvo}->.b;
.b out geom tags;
(
  way(around.b:${R})[highway][highway!~"^(footway|path|steps|cycleway|pedestrian|track|corridor|elevator|platform|construction|proposed)$"];
  way(around.b:${R})[building];
  node(around.b:45)[entrance];
  node(around.b:45)[amenity=parking_entrance];
  node(around.b:60)[barrier=lift_gate];
  node(around.b:250)[amenity=taxi];
  node(around.b:250)[highway=bus_stop];
  node(around.b:450)[railway~"^(station|subway_entrance)$"];
);
out geom tags;`;
if (a['so-consulta']) { console.log(consulta); process.exit(0); }

async function buscar() {
  if (a.arquivo) return JSON.parse(fs.readFileSync(a.arquivo, 'utf8'));
  const hosts = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
  let ultimo = '';
  for (let t = 0; t < 6; t++) {
    const h = hosts[t % hosts.length];
    try {
      const r = await fetch(h, {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded', 'User-Agent':'planta3d-shoppings/1.0'}, body:'data=' + encodeURIComponent(consulta)});
      const txt = await r.text();
      if (r.ok && txt.trim().startsWith('{')) return JSON.parse(txt);
      ultimo = `${h}: HTTP ${r.status}`;
    } catch (e) { ultimo = `${h}: ${e.cause ? e.cause.message || e.cause.code : e.message}`; }
    console.error(`tentativa ${t + 1} falhou (${ultimo}); aguardando...`);
    await new Promise(ok => setTimeout(ok, 4000 * (t + 1)));
  }
  throw new Error(`O Overpass não respondeu (${ultimo}). Se a rede bloqueia o acesso, rode com --so-consulta, cole a consulta em overpass-turbo.eu, exporte "dados brutos" e use --arquivo.`);
}

{
  const osm = await buscar(), r = converter(osm, {alvoId:+a.way || +a.relation || null});
  const D = lerJson(`shoppings/${id}/shopping.json`);
  D.contorno = r.contorno; delete D.centro; delete D.atrio;
  const ref = `OpenStreetMap, ${typeof a.origem === 'string' ? a.origem : r.origem.tipo + ' ' + r.origem.id} (contorno do prédio, ruas, entradas e prédios vizinhos), lido em ${hoje()} © colaboradores do OpenStreetMap, ODbL`;
  D.fontes = (D.fontes || []).filter(f => !/^OpenStreetMap, /.test(f)); D.fontes.unshift(ref);
  D.metodo = (D.metodo || []).filter(m => !/retângulo provisório/.test(m.texto)); if (!D.metodo.some(m => /OpenStreetMap/.test(m.texto))) D.metodo.unshift({tag:'real', texto:'Contorno do prédio, entradas e ruas: OpenStreetMap.'});
  (D.conexoes || []).forEach(c => {       // conexão com "osm": procura no mapa um elemento com esse nome e grava a posição
    if (!c.osm) return; const re = new RegExp(c.osm, 'i'), m = r.nomeados.filter(n => re.test(n.nome)).sort((p, q) => p.d - q.d)[0];
    if (m) { c.x = m.x; c.y = m.y; c.d = m.d; c.osm_nome = m.nome; } else { delete c.x; delete c.y; delete c.d; delete c.osm_nome; console.log(`Aviso: conexão "${c.nome}" não achada no mapa (osm: ${c.osm}).`); } });
  gravarShopping(id, D); gravarEntorno(id, r.entorno);
  const X = r.entorno, t = r.origem.tags, xs = r.contorno.map(p => p[0]), ys = r.contorno.map(p => p[1]);
  console.log(`shoppings/${id}: contorno com ${r.contorno.length} pontos (${Math.round(Math.max(...xs) - Math.min(...xs))} × ${Math.round(Math.max(...ys) - Math.min(...ys))} m), ${X.ruas.length} ruas, ${X.predios.length} prédios vizinhos, ${X.acessos.length} acessos, ${X.pontos.length} pontos de transporte.`);
  console.log(`No mapa: nome "${t.name || '—'}", pavimentos ${t['building:levels'] || 'não informado'}, subsolos ${t['building:levels:underground'] || 'não informado'}. Use isso para conferir "niveis" em shopping.json.`);
  if (!X.acessos.length) console.log('Aviso: o mapa não tem entradas marcadas neste prédio. Inclua-as à mão em entorno.json ("acessos") se precisar.');
}
