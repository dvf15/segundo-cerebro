/* Converte a resposta do Overpass (OpenStreetMap) para o formato do painel: metros a partir do centro do prédio. */
export function converter(osm, opt = {}) {
  const els = osm.elements || [];
  const b = els.find(e => (e.type === 'way' || e.type === 'relation') && e.tags && (e.tags.building || e.tags.shop === 'mall' || e.tags.amenity) && (opt.alvoId ? e.id === opt.alvoId : true)) || els[0];
  if (!b) throw new Error('A resposta do OpenStreetMap veio vazia. Confira o id do prédio.');
  let anel = b.geometry;
  if (b.type === 'relation') { const outs = (b.members || []).filter(m => m.type === 'way' && m.role !== 'inner' && m.geometry); if (!outs.length) throw new Error('A relation não tem contorno externo com geometria.'); anel = juntar(outs.map(m => m.geometry)); }
  if (!anel || anel.length < 4) throw new Error('O elemento não tem geometria de prédio.');
  const lats = anel.map(p => p.lat), lons = anel.map(p => p.lon), lat0 = (Math.min(...lats) + Math.max(...lats)) / 2, lon0 = (Math.min(...lons) + Math.max(...lons)) / 2;
  const kx = 111320 * Math.cos(lat0 * Math.PI / 180), ky = 110540, r1 = v => Math.round(v * 10) / 10;
  const xy = p => [(p.lon - lon0) * kx, (p.lat - lat0) * ky];
  let cont = anel.map(xy); if (dist(cont[0], cont[cont.length - 1]) < .05) cont.pop();
  cont = simplificar(cont, .35).map(p => [r1(p[0]), r1(p[1])]);
  const cen = centroide(cont);
  const dContorno = p => { let d = 1e9; for (let i = 0; i < cont.length; i++) d = Math.min(d, distSeg(p, cont[i], cont[(i + 1) % cont.length])); return dentro(cont, p) ? 0 : d; };

  const ruasBrutas = els.filter(e => e.type === 'way' && e.tags && e.tags.highway && e.geometry && e.id !== b.id).map(e => ({nome:e.tags.name || null, m:/^(motorway|trunk|primary|secondary|tertiary)(_link)?$/.test(e.tags.highway) ? 1 : 0, pts:e.geometry.map(xy)}));
  const ruas = ruasBrutas.map(r => ({m:r.m, p:r.pts.flatMap(p => [Math.round(p[0]), Math.round(p[1])])}));
  const porNome = new Map();        // nome da rua: ponto do traçado mais próximo do prédio e direção da via ali
  ruasBrutas.forEach(r => { if (!r.nome) return; for (let i = 0; i < r.pts.length - 1; i++) { const q = maisPerto(cen, r.pts[i], r.pts[i + 1]), d = dContorno(q), cur = porNome.get(r.nome);
    if (!cur || d < cur.d) porNome.set(r.nome, {n:r.nome, x:Math.round(q[0]), y:Math.round(q[1]), a:+Math.atan2(r.pts[i + 1][1] - r.pts[i][1], r.pts[i + 1][0] - r.pts[i][0]).toFixed(2), d:Math.round(d)}); } });
  const nomes = [...porNome.values()].filter(s => s.d <= 160).sort((p, q) => p.d - q.d).slice(0, 8);
  const ruaPerto = p => { let best = null, bd = 1e9; ruasBrutas.forEach(r => { if (!r.nome) return; for (let i = 0; i < r.pts.length - 1; i++) { const d = distSeg(p, r.pts[i], r.pts[i + 1]); if (d < bd) { bd = d; best = r.nome; } } }); return bd < 80 ? best : null; };

  const predios = els.filter(e => e.type === 'way' && e.tags && e.tags.building && e.geometry && e.id !== b.id).map(e => { const pts = e.geometry.map(xy); if (dist(pts[0], pts[pts.length - 1]) < .05) pts.pop();
    const h = parseFloat(e.tags.height) || (parseFloat(e.tags['building:levels']) || 0) * 3.2; return {h:Math.round(h) || 0, p:pts.flatMap(p => [Math.round(p[0]), Math.round(p[1])]), d:dContorno(centroide(pts))}; })
    .filter(p => p.p.length >= 6 && p.d > 1).sort((p, q) => p.d - q.d).slice(0, 220).map(({h, p}) => ({h, p}));

  const nos = els.filter(e => e.type === 'node' && e.tags);
  const acessos = nos.map(e => { const t = e.tags, p = xy(e); let tipo = null;
    if (t.barrier === 'lift_gate') tipo = 'cancela'; else if (t.amenity === 'parking_entrance' || t.entrance === 'garage') tipo = 'garagem'; else if (t.entrance === 'main') tipo = 'principal'; else if (t.entrance && !/^(no|emergency|exit|service|staff)$/.test(t.entrance)) tipo = 'entrada';
    if (!tipo || dContorno(p) > (tipo === 'cancela' ? 60 : 12)) return null;
    return {x:r1(p[0]), y:r1(p[1]), t:tipo, rua:ruaPerto(p), lv:t.level != null ? t.level : null}; }).filter(Boolean);
  const pontos = nos.map(e => { const t = e.tags, p = xy(e), tipo = t.amenity === 'taxi' ? 'táxi' : t.highway === 'bus_stop' ? 'ônibus' : /^(station|subway_entrance)$/.test(t.railway || '') ? 'metrô' : null;
    return tipo ? {x:Math.round(p[0]), y:Math.round(p[1]), t:tipo, n:t.name || null, d:Math.round(dContorno(p))} : null; }).filter(Boolean).sort((p, q) => p.d - q.d).slice(0, 8);
  const nomeados = els.filter(e => e.tags && e.tags.name && e.id !== b.id && !e.tags.highway).map(e => { let pts = null;
    if (e.type === 'node') pts = [xy(e)]; else if (e.geometry) pts = e.geometry.map(xy); else if (e.members && e.members.some(m => m.geometry)) pts = e.members.filter(m => m.geometry).flatMap(m => m.geometry.map(xy)); else if (e.bounds) pts = [xy({lat:(e.bounds.minlat + e.bounds.maxlat) / 2, lon:(e.bounds.minlon + e.bounds.maxlon) / 2})];
    if (!pts || !pts.length) return null; const c = pts.length > 2 ? centroide(pts) : pts[0];
    return {nome:e.tags.name, x:r1(c[0]), y:r1(c[1]), d:Math.round(dContorno(c))}; }).filter(Boolean);
  return {contorno:cont, nomeados, entorno:{ruas, nomes, predios, acessos, pontos}, origem:{tipo:b.type, id:b.id, tags:b.tags || {}, lat:lat0, lon:lon0}};
}
function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
function maisPerto(p, s, e) { const dx = e[0] - s[0], dy = e[1] - s[1], l = dx * dx + dy * dy, t = l ? Math.max(0, Math.min(1, ((p[0] - s[0]) * dx + (p[1] - s[1]) * dy) / l)) : 0; return [s[0] + dx * t, s[1] + dy * t]; }
function distSeg(p, s, e) { return dist(p, maisPerto(p, s, e)); }
function dentro(P, p) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const s = P[i], e = P[j]; if ((s[1] > p[1]) !== (e[1] > p[1]) && p[0] < (e[0] - s[0]) * (p[1] - s[1]) / (e[1] - s[1]) + s[0]) c = !c; } return c; }
function centroide(P) { let ar = 0, x = 0, y = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length], c = p[0] * q[1] - q[0] * p[1]; ar += c; x += (p[0] + q[0]) * c; y += (p[1] + q[1]) * c; } return ar ? [x / (3 * ar), y / (3 * ar)] : P[0]; }
function simplificar(P, tol) {      // Douglas-Peucker no anel fechado
  if (P.length < 8) return P;
  const rec = (i, j, keep) => { let md = 0, mk = -1; for (let k = i + 1; k < j; k++) { const d = distSeg(P[k], P[i], P[j]); if (d > md) { md = d; mk = k; } } if (md > tol) { keep.add(mk); rec(i, mk, keep); rec(mk, j, keep); } };
  let far = 0, fd = 0; P.forEach((p, k) => { const d = dist(p, P[0]); if (d > fd) { fd = d; far = k; } });
  const keep = new Set([0, far, P.length - 1]); rec(0, far, keep); rec(far, P.length - 1, keep);
  return P.filter((p, k) => keep.has(k));
}
function juntar(partes) {          // une os trechos externos de uma relation num anel só
  const rest = partes.map(g => g.slice()), anel = rest.shift(), igual = (p, q) => Math.abs(p.lat - q.lat) < 1e-7 && Math.abs(p.lon - q.lon) < 1e-7;
  for (let g = 0; g < 1000 && rest.length; g++) { const fim = anel[anel.length - 1]; const i = rest.findIndex(s => igual(s[0], fim) || igual(s[s.length - 1], fim)); if (i < 0) break; let s = rest.splice(i, 1)[0]; if (!igual(s[0], fim)) s.reverse(); anel.push(...s.slice(1)); }
  return anel;
}
