
/* ================= base ================= */
/* DADOS vem de scripts/montar.mjs: {config, shoppings:{id:{...shopping.json, lojas, entorno}}}. Nada de shopping fica fixo neste arquivo. */
const CFG = DADOS.config;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const nf = n => Number(n).toLocaleString('pt-BR');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const {deacc, GRUPOS, CAMPOS, BAND, inPoly, rayHits, layoutMall, parseLista, aplicarLista, brandKey, sameBrand} = criarNucleo(CFG);
const PAL = {}; CFG.grupos.forEach(g => { PAL[g.nome] = g.cor; });
const KHEX = '#f2b84b', MINE = '#4cc38a', OPP = '#f08c4a', BOTH = '#e8eef6';
const G_FOOD = CFG.grupo_alimentacao || 'Alimentação', FALTA = '[FALTA: dado]';
const fmtVal = (v, un) => v == null || v === '' ? FALTA : (typeof v === 'number' ? nf(v) : String(v)) + (un ? ' ' + un : '');
const campoVal = (s, f) => { const v = s[f.chave]; return v == null || v === '' ? '' : (typeof v === 'number' ? nf(v) : String(v)) + (f.unidade ? ' ' + f.unidade : ''); };

/* ================= inteligência: cruzamento de marcas ================= */
function crossBrands(A, B) {     // A = shopping de referência (o meu), B = o outro
  const kA = A.filter(s => s.tipo === 'Quiosque'), kB = B.filter(s => s.tipo === 'Quiosque');
  const has = (L, key) => L.find(s => sameBrand(s.key, key));
  const uniq = L => { const m = new Map(); L.forEach(s => { const k = [...m.keys()].find(x => sameBrand(x, s.key)) || s.key; (m.get(k) || m.set(k, []).get(k)).push(s); }); return [...m.entries()].map(([key, st]) => ({key, st})); };
  const uA = uniq(kA), uB = uniq(kB), both = [], onlyA = [], onlyB = [];
  uB.forEach(b => { const a = uA.find(x => sameBrand(x.key, b.key)); if (a) both.push({key:b.key, a:a.st, b:b.st}); else onlyB.push({key:b.key, b:b.st, lojaA:has(A, b.key) || null}); });
  uA.forEach(a => { if (!uB.some(x => sameBrand(x.key, a.key))) onlyA.push({key:a.key, a:a.st, lojaB:has(B, a.key) || null}); });
  A.concat(B).forEach(s => { s.cmp = null; });
  kA.forEach(s => { s.cmp = both.some(x => x.a.includes(s)) ? 'both' : 'only'; }); kB.forEach(s => { s.cmp = both.some(x => x.b.includes(s)) ? 'both' : 'only'; });
  const bA = new Set(A.map(s => s.key)), bB = new Set(B.map(s => s.key)); let inter = 0; bA.forEach(k => { if ([...bB].some(x => sameBrand(x, k))) inter++; });
  const seg = GRUPOS.map(g => ({g, a:kA.filter(s => s.grupo === g).length, b:kB.filter(s => s.grupo === g).length})).filter(x => x.a || x.b);
  return {kA, kB, both, onlyA, onlyB, seg, marcasA:bA.size, marcasB:bB.size, inter};
}

/* ================= cena ================= */
const canvas = $('#gl'), ov = $('#ov'), ox = ov.getContext('2d'), stage = $('#stage');
const DPR = Math.min(window.devicePixelRatio || 1, 2), BG = 0x0b111b;
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(DPR); renderer.setClearColor(BG, 1);
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(BG, 600, 2100);
const camera = new THREE.PerspectiveCamera(38, 1, .5, 6000);
scene.add(new THREE.AmbientLight(0xffffff, .8));
const sun = new THREE.DirectionalLight(0xffffff, .6); sun.position.set(120, 300, 160); scene.add(sun);
const ADD = {transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide};
const shapeOf = pts => { const sh = new THREE.Shape(); pts.forEach((p, i) => i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1])); return sh; };
const extrude = (shape, h) => { const g = new THREE.ExtrudeGeometry(shape, {depth:h, bevelEnabled:false}); g.rotateX(-Math.PI / 2); return g; };
const GRIDFRAG = `
  varying vec3 vW; uniform float uT; uniform float uFar; uniform float uCell; uniform float uA;
  float grid(vec2 p, float s){ vec2 q = p / s; vec2 fw = fwidth(q); vec2 g = abs(fract(q - .5) - .5) / fw; return (1. - min(min(g.x, g.y), 1.)) * (1. - smoothstep(.25, .7, max(fw.x, fw.y))); }
  void main(){
    float d = length(vW.xz);
    float a = grid(vW.xz, uCell) * .2 + grid(vW.xz, uCell * 5.) * .5;
    float fall = smoothstep(uFar, uFar * .12, d);
    float ring = 0.;
    vec3 col = mix(vec3(.22, .32, .46), vec3(.42, .56, .74), a);
    gl_FragColor = vec4(col, ((a + ring) * fall + smoothstep(280., 0., d) * .02) * uA);
  }`;
const GRIDVERT = `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const groundGeo = new THREE.PlaneGeometry(3600, 3600); groundGeo.rotateX(-Math.PI / 2);
const ground = new THREE.Mesh(groundGeo, new THREE.ShaderMaterial({transparent:true, depthWrite:false, extensions:{derivatives:true},
  uniforms:{uT:{value:0}, uFar:{value:900}, uCell:{value:10}, uA:{value:.42}}, vertexShader:GRIDVERT, fragmentShader:GRIDFRAG}));
ground.position.y = -3; ground.renderOrder = -2; scene.add(ground);
// seleção: feixe, anel e moldura
const selBeam = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, 70, 8, 1, true), new THREE.MeshBasicMaterial(Object.assign({color:0xffffff, opacity:.4}, ADD))); selBeam.visible = false; scene.add(selBeam);
const ringGeo = new THREE.RingGeometry(.93, 1, 64); ringGeo.rotateX(-Math.PI / 2);
const selRing = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial(Object.assign({color:0xffffff, opacity:.9}, ADD))); selRing.visible = false; scene.add(selRing);

const C_HOLO = new THREE.Color(0x4a78a8), C_EDGE = new THREE.Color(0x9cc3e6), C_DIM = new THREE.Color(0x3a5676), C_WHITE = new THREE.Color(0xffffff),
  C_K = new THREE.Color(KHEX), C_MINE = new THREE.Color(MINE), C_OPP = new THREE.Color(OPP), C_BOTH = new THREE.Color(BOTH);
const PALC = {}; Object.keys(PAL).forEach(k => { PALC[k] = new THREE.Color(PAL[k]); });
const hOf = s => s.tipo === 'Quiosque' ? 2.2 : s.tipo === 'Âncora' ? 6 : (s.tipo === 'Megaloja' || s.tipo === 'Lazer') ? 4.8 : 3.4;
const shortName = s => s.nome.replace(/\s*\(.*\)/, '').replace(/\s*-?\s*\dº PISO/i, '').trim();

/* Shoppings em tela: um objeto por pasta de shoppings/. "meu" marca o shopping de referência da comparação. */
const ALL = CFG.shoppings.map(id => { const D = DADOS.shoppings[id]; D.lojas = D.lojas || []; D.fontes = D.fontes || []; D.niveis = D.niveis || []; D.F = {}; (D.ficha || []).forEach(f => { D.F[f.chave] = f; });
  if (D.entorno) ['ruas', 'nomes', 'predios', 'acessos', 'pontos'].forEach(k => { D.entorno[k] = D.entorno[k] || []; });
  return {key:id, nome:D.nome, curto:(D.curto || D.nome).toUpperCase(), papel:D.papel || 'concorrente', meu:/meu/i.test(D.papel || ''), D}; });
const MALLS = {}; ALL.forEach(M => { MALLS[M.key] = M; });
const fv = (M, k) => { const f = M.D.F[k]; return f && f.valor != null && f.valor !== '' ? f.valor : null; };
const nK = M => M.S.filter(s => s.tipo === 'Quiosque').length;
const pbOn = M => !!M && !M.meu;                     // quadro de prospecção: só para shopping que não é o meu
const pbM = () => { const M = CM() || CB; return pbOn(M) ? M : null; };
/* Varejistas listadas em bolsa: liga cada loja à empresa dona da marca (varejistas.json). */
const VAREJO = (DADOS.varejistas && DADOS.varejistas.empresas) || [], VNOME = new Map(), VMARCA = [];
const nomeBase = n => deacc(String(n).replace(/\s*\(.*?\)/g, '').replace(/\s+-\s+.*$/, '')).toUpperCase().replace(/\s+/g, ' ').trim();
VAREJO.forEach(c => (c.marcas || []).forEach(m => { (m.nomes || []).forEach(n => VNOME.set(nomeBase(n), {c, m})); VMARCA.push({k:brandKey(m.marca), c, m}); }));
const ciaDe = s => { const e = VNOME.get(nomeBase(s.nome)); if (e) return e; const k = s.key; return VMARCA.find(x => x.k === k) || null; };
const fmtMoeda = (v, moeda) => v == null ? FALTA : (moeda && moeda !== 'R$' ? moeda + ' ' : 'R$ ') + (v >= 1e9 ? (v / 1e9).toFixed(1).replace('.', ',') + ' bi' : nf(Math.round(v / 1e6)) + ' mi');
const vInd = (x, f) => x ? f(x) + ' (' + x.periodo + ')' : '—';

/* Filtros: cada um junta um shopping de referência e seus concorrentes. Só os shoppings do filtro ativo ficam montados na cena. */
const FILTROS = (CFG.filtros && CFG.filtros.length ? CFG.filtros : [{id:'todos', nome:'Todos', shoppings:CFG.shoppings}]).map(f => Object.assign({}, f, {shoppings:f.shoppings.filter(id => MALLS[id])})).filter(f => f.shoppings.length);
const FM = () => (FILTROS.find(f => f.id === st.filtro) || FILTROS[0]).shoppings.map(id => MALLS[id]);
let CA = null, CB = null, FONTS = false;     // par da comparação: referência × outro
function disposeMall(M) {
  M.root.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
  scene.remove(M.root); M.root = null;
}
function anchorOf(s, C) {
  const P = s.poly, av = [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];
  if (inPoly(P, av[0], av[1])) return av;
  let r0 = 1e9, r1 = 0, sx = 0, sy = 0; P.forEach(p => { const dx = p[0] - C[0], dy = p[1] - C[1], r = Math.hypot(dx, dy) || 1; r0 = Math.min(r0, r); r1 = Math.max(r1, r); sx += dx / r; sy += dy / r; });
  const th = Math.atan2(sy, sx), rm = (r0 + r1) / 2, pm = [C[0] + rm * Math.cos(th), C[1] + rm * Math.sin(th)];
  return inPoly(P, pm[0], pm[1]) ? pm : av;
}
function corridorPath(M) {       // linha média do corredor: entre a ilha central e a fileira externa
  const Dm = M.D, C = Dm.centro, N = 96, isl = M.S.filter(s => /ilha/.test(s.anel || '')), out = M.S.filter(s => /externa/.test(s.anel || '')), rr = [];
  for (let k = 0; k < N; k++) {
    const th = k / N * 2 * Math.PI, hc = rayHits(C, Dm.contorno, th), Rc = hc ? hc[0] : 50; let rin = 0, rout = 1e9;
    isl.forEach(s => { const h = rayHits(C, s.poly, th); if (h && h[1] > rin) rin = h[1]; }); out.forEach(s => { const h = rayHits(C, s.poly, th); if (h && h[0] < rout) rout = h[0]; });
    rr.push(rout < 1e9 && rin > 0 && rout > rin ? rout - Math.min(4, (rout - rin) / 2) : rout < 1e9 ? rout - 3 : rin > 0 ? rin + 3 : Rc * (BAND.c0 + BAND.c1) / 2);
  }
  return rr.map((r, k) => { const a = (rr[(k + N - 1) % N] + r * 2 + rr[(k + 1) % N]) / 4, th = k / N * 2 * Math.PI; return [C[0] + a * Math.cos(th), C[1] + a * Math.sin(th)]; });
}
function buildMall(M) {
  const Dm = M.D; if (M.root) disposeMall(M);
  M.S = Dm.lojas; M.S.forEach((s, i) => { s.i = i; s.M = M; s.key = brandKey(s.nome); s.la = 0; s.cia = VAREJO.length ? ciaDe(s) : null; if (s.tipo === 'Lazer' && PAL.Lazer) s.grupo = 'Lazer';
    const aj = (Dm.ajustes || {})[s.nome]; if (aj && !s.aj) { s.ajTag = aj.etiqueta || 'ajuste'; s.area_est = aj.area; s.fachada_est = Math.round(Math.sqrt(aj.area / 1.3) * 2) / 2; s.faixa = aj.faixa; s.aj = true; } });
  M.LV = Dm.niveis.map(n => n.id);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; Dm.contorno.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
  M.cx = (x0 + x1) / 2; M.cy = (y0 + y1) / 2; M.w = x1 - x0; M.h = y1 - y0; M.ext = [M.w, M.h]; M.top = y1;
  M.root = new THREE.Group(); M.rootT = M.rootT || new THREE.Vector3(); M.inner = new THREE.Group(); M.inner.position.set(-M.cx, 0, M.cy); M.root.add(M.inner); scene.add(M.root);
  M.groups = {}; M.meshes = []; M.roofs = []; M.slabs = [];
  Dm.niveis.forEach((n, i) => {
    const g = new THREE.Group(), cnt = M.S.filter(s => s.nivel === n.id).length, hole = /^L/.test(n.id) && Dm.atrio, sh = shapeOf(Dm.contorno);
    if (hole) sh.holes.push(new THREE.Path(Dm.atrio.map(p => new THREE.Vector2(p[0], p[1]))));
    const slab = new THREE.Mesh(extrude(sh, .5), new THREE.MeshBasicMaterial({color:0x121e31, transparent:true, opacity:.93})); slab.position.y = -.5;
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(slab.geometry, 40), new THREE.LineBasicMaterial({color:0x6f93bb, transparent:true, opacity:.9})); edge.position.y = -.5;
    g.add(slab, edge); g.userData = {id:n.id, i, n:cnt, slab, edge, solid:/^L/.test(n.id) || cnt >= 20, hole:!!hole, tp:new THREE.Vector3(0, 0, 0), show:true, M, tag:{}};
    slab.userData.slabOf = g; M.slabs.push(slab); M.inner.add(g); M.groups[n.id] = g;
  });
  M.S.forEach(s => {
    if (!M.groups[s.nivel]) return;
    const h = hOf(s), geo = extrude(shapeOf(s.poly), h), m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({transparent:true}));
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), new THREE.LineBasicMaterial({transparent:true})); m.add(e);
    const a = anchorOf(s, Dm.centro); s.ax = a[0]; s.ay = a[1]; s.h = h; s.c = new THREE.Vector3(a[0], h, -a[1]); s.mesh = m; s.edge = e; m.userData.s = s;
    if (s.tipo === 'Quiosque') { const bg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], h, -a[1]), new THREE.Vector3(a[0], h + 3.5, -a[1])]);
      s.beam = new THREE.Line(bg, new THREE.LineBasicMaterial(Object.assign({color:0xf2b84b, opacity:.7}, ADD))); m.add(s.beam); }
    M.groups[s.nivel].add(m); M.meshes.push(m);
  });
  // torre: malha de pavimentos sobre o conjunto, como arranha-céu em linha de luz
  M.tower = null;
  if (Dm.torre) {
    const P = Dm.torre, n = P.length, H = 130, F = 14, pos = [], col = [], c0 = C_EDGE;
    for (let f = 0; f <= F; f++) { const y = f / F * H, a = Math.pow(1 - f / F, 1.5) * .8; for (let i = 0; i < n; i++) { const p = P[i], q = P[(i + 1) % n]; pos.push(p[0], y, -p[1], q[0], y, -q[1]); col.push(c0.r * a, c0.g * a, c0.b * a, c0.r * a, c0.g * a, c0.b * a); } }
    for (let i = 0; i < n; i++) { const p = P[i]; pos.push(p[0], 0, -p[1], p[0], H, -p[1]); col.push(c0.r, c0.g, c0.b, 0, 0, 0); }
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); tg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    M.tower = new THREE.LineSegments(tg, new THREE.LineBasicMaterial(Object.assign({vertexColors:true, opacity:.3, fog:false}, ADD))); M.inner.add(M.tower);
  }
  // feixe do átrio
  const rA = Dm.atrio ? Math.min(...Dm.atrio.map(p => Math.hypot(p[0] - Dm.centro[0], p[1] - Dm.centro[1]))) * .9 : 10;
  M.atr = new THREE.Mesh(new THREE.CylinderGeometry(rA, rA, 1, 40, 1, true), new THREE.MeshBasicMaterial(Object.assign({color:0x8fb4dc, opacity:.03}, ADD))); M.atr.position.set(Dm.centro[0], 0, -Dm.centro[1]); M.inner.add(M.atr);
  const sg = new THREE.ShapeGeometry(shapeOf(Dm.contorno)); sg.rotateX(-Math.PI / 2);
  M.scan = new THREE.Mesh(sg, new THREE.MeshBasicMaterial(Object.assign({color:0x35d6ff, opacity:.16}, ADD))); M.scan.add(new THREE.LineSegments(new THREE.EdgesGeometry(sg), new THREE.LineBasicMaterial({color:0x9fefff}))); M.scan.visible = false; M.inner.add(M.scan); M.scanT = 1;
  // passeio: corredor com setas e piso em grade
  M.path = corridorPath(M);
  const pp = [], N = M.path.length;
  for (let k = 0; k < N; k++) { const a = M.path[k], b = M.path[(k + 1) % N]; pp.push(a[0], .15, -a[1], b[0], .15, -b[1]);
    if (k % 2 === 0) { const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1, ux = tx / l, uy = ty / l, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      [[-1, 1], [-1, -1]].forEach(q => { pp.push(mx + ux * .9, .15, -(my + uy * .9), mx + ux * q[0] * .7 - uy * q[1] * 1.1, .15, -(my + uy * q[0] * .7 + ux * q[1] * 1.1)); }); } }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
  M.pathObj = new THREE.LineSegments(pg, new THREE.LineBasicMaterial(Object.assign({color:0x9cc3e6, opacity:.6}, ADD))); M.pathObj.visible = false; M.inner.add(M.pathObj);
  const fg = new THREE.ShapeGeometry(shapeOf(Dm.contorno)); fg.rotateX(-Math.PI / 2);
  M.floor = new THREE.Mesh(fg, new THREE.ShaderMaterial({transparent:true, depthWrite:false, extensions:{derivatives:true}, uniforms:{uT:{value:0}, uFar:{value:260}, uCell:{value:2.5}, uA:{value:1}}, vertexShader:GRIDVERT, fragmentShader:GRIDFRAG}));
  M.floor.visible = false; M.inner.add(M.floor);
  M.empty = !M.S.length;
}

/* ================= nomes ================= */
const LBF = '"IBM Plex Sans Condensed","Arial Narrow",system-ui,sans-serif', mcv = document.createElement('canvas').getContext('2d');
function splitLines(words, n) {       // quebra equilibrada em n linhas
  if (n <= 1 || words.length < n) return [words.join(' ')];
  let best = null;
  if (n === 2) { for (let i = 1; i < words.length; i++) { const L = [words.slice(0, i).join(' '), words.slice(i).join(' ')], m = Math.max(L[0].length, L[1].length); if (!best || m < best[0]) best = [m, L]; } return best[1]; }
  for (let i = 1; i < words.length - 1; i++) for (let j = i + 1; j < words.length; j++) { const L = [words.slice(0, i).join(' '), words.slice(i, j).join(' '), words.slice(j).join(' ')], m = Math.max(L[0].length, L[1].length, L[2].length); if (!best || m < best[0]) best = [m, L]; }
  return best[1];
}
function roofLabel(M, s) {            // nome pintado no teto, encaixado no espaço da loja e alinhado ao maior eixo
  const [CX, CY] = M.D.centro; let ux = s.ax - CX, uy = s.ay - CY; const n = Math.hypot(ux, uy) || 1; ux /= n; uy /= n;
  let r0 = 1e9, r1 = -1e9, t0 = 1e9, t1 = -1e9;
  s.poly.forEach(p => { const r = (p[0] - CX) * ux + (p[1] - CY) * uy, t = -(p[0] - CX) * uy + (p[1] - CY) * ux; r0 = Math.min(r0, r); r1 = Math.max(r1, r); t0 = Math.min(t0, t); t1 = Math.max(t1, t); });
  const dr = r1 - r0, dt = (t1 - t0) * .8, radial = dr >= dt, L = (radial ? dr : dt) * .86, Wd = (radial ? dt : dr) * .78;
  const words = shortName(s).split(/\s+/), fs = 46, lh = 50; mcv.font = `600 ${fs}px ${LBF}`;
  let best = null;
  [1, 2, 3].forEach(k => { if (k > words.length) return; const lines = splitLines(words, k), w = Math.max(...lines.map(l => mcv.measureText(l).width)) + 14, h = lines.length * lh + 8, sc = Math.min(L / w, Wd / h); if (!best || sc > best.sc * 1.08) best = {lines, w, h, sc}; });
  const sc = Math.min(best.sc, (s.area_est >= 1000 ? 7 : 4.2) / lh);
  const c = document.createElement('canvas'), x = c.getContext('2d'); c.width = Math.ceil(best.w); c.height = best.h;
  x.font = `600 ${fs}px ${LBF}`; x.textBaseline = 'middle'; x.textAlign = 'center'; x.lineJoin = 'round'; x.lineWidth = 7; x.strokeStyle = 'rgba(11,17,27,.85)'; x.fillStyle = '#f3f6fa';
  best.lines.forEach((l, i) => { const y = 4 + lh * (i + .5) + 1; x.strokeText(l, c.width / 2, y); x.fillText(l, c.width / 2, y); });
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const g = new THREE.PlaneGeometry(c.width * sc, c.height * sc); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-2}));
  let dx = radial ? ux : -uy, dz = radial ? -uy : -ux; if (dx < 0) { dx = -dx; dz = -dz; }
  const ry = Math.atan2(-dz, dx), rm = (r0 + r1) / 2, tm = (t0 + t1) / 2; let px = CX + rm * ux - tm * uy, py = CY + rm * uy + tm * ux;
  if (!inPoly(s.poly, px, py)) { px = s.ax; py = s.ay; }
  m.rotation.y = ry; m.position.set(px, s.h + .1, -py); m.userData = {s, ry, flip:false, px:c.height * sc}; m.renderOrder = 3;
  return m;
}
function buildRoofs(M) { M.roofs.forEach(r => { r.parent.remove(r); r.geometry.dispose(); r.material.map.dispose(); r.material.dispose(); }); M.roofs = [];
  M.S.forEach(s => { if (s.tipo === 'Quiosque' || !s.mesh) return; const m = roofLabel(M, s); M.groups[s.nivel].add(m); M.roofs.push(m); }); }

/* ================= entorno e acessos (OpenStreetMap) ================= */
const abrev = n => String(n || '').replace(/^Avenida/i, 'Av.').replace(/^Rua/i, 'R.').replace(/Engenheiro/i, 'Eng.').replace(/Marechal/i, 'Mal.').replace(/General/i, 'Gal.');
const ACC_TXT = {principal:'ENTRADA PRINCIPAL', entrada:'ENTRADA', garagem:'ACESSO GARAGEM', cancela:'CANCELA', 'ônibus':'PONTO DE ÔNIBUS', 'táxi':'TÁXI', 'metrô':'METRÔ'};
function buildContext(M) {
  const Dm = M.D, X = Dm.entorno; M.ctx = new THREE.Group(); M.ctx.position.y = -2.9; M.inner.add(M.ctx); M.decals = []; M.accs = []; M.cones = []; M.gl = Dm.terreo && M.groups[Dm.terreo] ? Dm.terreo : M.groups.L1 ? 'L1' : M.LV[0];
  (Dm.conexoes || []).forEach(c => {      // torres, metrô e ligações com outros empreendimentos, quando há posição no mapa
    if (c.x == null || c.y == null) return; const g0 = M.groups[M.gl], H = 34;
    const bg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(c.x, 0, -c.y), new THREE.Vector3(c.x, H, -c.y)]);
    const ln = new THREE.Line(bg, new THREE.LineBasicMaterial(Object.assign({color:0xc9a7f5, opacity:.75}, ADD))); g0.add(ln); M.cones.push(ln);
    M.accs.push({acc:{t:'conexão', x:c.x, y:c.y}, M, lt:(String(c.tipo || 'conexão') + ' · ' + String(c.nome).split(/ \(| — | – | da Linha /)[0].slice(0, 42)).toUpperCase(), c:new THREE.Vector3(c.x, H, -c.y), parent:g0, la:0, pri:9500, col:'#c9a7f5'});
  });
  if (!X) return;
  const mk = (arr, col, op) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); return new THREE.LineSegments(g, new THREE.LineBasicMaterial(Object.assign({color:col, opacity:op}, ADD))); };
  const p0 = [], p1 = [];
  X.ruas.forEach(r => { const arr = r.m ? p1 : p0; for (let i = 0; i < r.p.length - 2; i += 2) arr.push(r.p[i], 0, -r.p[i + 1], r.p[i + 2], 0, -r.p[i + 3]); });
  M.ctx.add(mk(p0, 0x4a6a8e, .42), mk(p1, 0x6f93bb, .6));
  const bp = [];                 // prédios vizinhos em linha de luz (altura ilustrativa quando o mapa não informa)
  X.predios.forEach((b, bi) => { const n = b.p.length / 2, h = b.h || (8 + ((bi * 7919) % 23));
    for (let i = 0; i < n; i++) { const j = (i + 1) % n, x0 = b.p[i * 2], y0 = b.p[i * 2 + 1], x1 = b.p[j * 2], y1 = b.p[j * 2 + 1]; bp.push(x0, 0, -y0, x1, 0, -y1, x0, h, -y0, x1, h, -y1, x0, 0, -y0, x0, h, -y0); } });
  M.city = mk(bp, 0x3f5d82, .4); M.city.visible = false; M.ctx.add(M.city);
  X.nomes.forEach(s => {         // nome da rua deitado no chão, ao longo da via
    const c = document.createElement('canvas'), x = c.getContext('2d'), txt = abrev(s.n).toUpperCase(); x.font = `600 40px ${LBF}`; c.width = Math.ceil(x.measureText(txt).width) + 16; c.height = 50;
    x.font = `600 40px ${LBF}`; x.textBaseline = 'middle'; x.fillStyle = '#8aa3bf'; x.fillText(txt, 8, 26);
    const hh = 5, g = new THREE.PlaneGeometry(c.width / c.height * hh, hh); g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c), transparent:true, depthWrite:false, opacity:.9}));
    const dx = s.x - M.cx, dy = s.y - M.cy, l = Math.hypot(dx, dy) || 1, ox_ = s.d < 12 ? dx / l * 7 : 0, oy_ = s.d < 12 ? dy / l * 7 : 0;
    m.position.set(s.x + ox_, .3, -(s.y + oy_)); m.rotation.y = s.a; m.userData = {ry:s.a, flip:false}; M.ctx.add(m); M.decals.push(m);
  });
  const g1 = M.groups[M.gl];     // acessos presos ao piso térreo
  const add = (a, pri) => {
    const dx = a.x - Dm.centro[0], dy = a.y - Dm.centro[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, px = a.x + ux * 5, py = a.y + uy * 5;
    if (a.t !== 'ônibus' && a.t !== 'táxi' && a.t !== 'metrô') { const cg = new THREE.ConeGeometry(a.t === 'cancela' ? 1 : 1.6, a.t === 'cancela' ? 2.6 : 4.4, 3); cg.rotateX(Math.PI / 2);
      const cone = new THREE.Mesh(cg, new THREE.MeshBasicMaterial(Object.assign({color:a.t === 'garagem' || a.t === 'cancela' ? 0x6f9fd8 : 0x4cc38a, opacity:.85}, ADD))); cone.position.set(px, .6, -py); cone.rotation.y = Math.atan2(-ux, uy); cone.scale.y = .25; g1.add(cone); M.cones.push(cone); }
    const o = {acc:a, M, lt:ACC_TXT[a.t] + (a.t === 'cancela' ? '' : a.rua ? ' · ' + abrev(a.rua).toUpperCase() : a.n ? ' · ' + a.n.toUpperCase() : ''), c:new THREE.Vector3(px, 1.2, -py), parent:g1, la:0, pri, col:a.t === 'garagem' || a.t === 'cancela' ? '#9db8d8' : '#7fd6aa'};
    M.accs.push(o);
  };
  X.acessos.filter(a => a.t !== 'cancela').forEach(a => add(a, a.t === 'principal' ? 9000 : a.t === 'entrada' ? 4200 : 2600));
}

/* ================= estado ================= */
const st = {filtro:FILTROS[0].id, mall:null, view:'3d', level:null, q:'', tipo:'', grupos:new Set(GRUPOS), sel:null, hov:null, exp:20, tower:false, ctx:false, labels:true, seg:false, tour:false, preset:null};
let wake = 0; const poke = () => { wake = performance.now() + 1600; };
const AM = () => st.mall === 'cmp' ? [CA, CB] : [MALLS[st.mall]];
const CM = () => st.mall === 'cmp' ? null : MALLS[st.mall];
const isFiltered = () => !!(st.q || st.tipo || st.preset || st.grupos.size < GRUPOS.length);
const ghostAll = () => st.mall === 'cmp' || (isFiltered() && !st.level && st.view === '3d');
const lvName = (M, id) => (M.D.niveis.find(n => n.id === id) || {nome:id}).nome;
let INTEL = null, SW = 800, SH = 600;
function match(s) {
  if (!st.grupos.has(s.grupo)) return false;
  if (st.tipo && s.tipo !== st.tipo) return false;
  if (st.preset === 'novo' && s.status === 'Em operação') return false;
  if (st.preset === 'anc' && s.tipo !== 'Âncora' && s.tipo !== 'Megaloja') return false;
  if (st.preset === 'amp' && !(s.n_luc > 1)) return false;
  if (st.preset === 'pro' && pbOf(s.M, s.key).s !== 'pro') return false;
  if (st.preset === 'lst' && (!s.cia || (st.ciaSel && s.cia.c !== st.ciaSel))) return false;
  if (st.q) { const q = st.q.toLowerCase(); if (!(s.nome + ' ' + s.categoria + ' ' + s.tipo + ' ' + (s.luc || '') + CAMPOS.map(f => ' ' + campoVal(s, f)).join('')).toLowerCase().includes(q)) return false; }
  return true;
}
const makeMall = M => { layoutMall(M.D); buildMall(M); buildContext(M); M.l0 = M.LV.findIndex(id => /^L/.test(id)); M.l1 = M.LV.length - 1 - [...M.LV].reverse().findIndex(id => /^L/.test(id)); };

/* ================= câmera ================= */
const cam = {th:-.75, ph:1.02, r:560, t:new THREE.Vector3(0, 70, 0)}, goal = {th:-.75, ph:1.02, r:560, t:new THREE.Vector3(0, 70, 0)};
const V = new THREE.Vector3(), W3 = new THREE.Vector3(), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function placeCam() {
  const sp = Math.sin(cam.ph);
  camera.position.set(cam.t.x + cam.r * sp * Math.sin(cam.th), cam.t.y + cam.r * Math.cos(cam.ph), cam.t.z + cam.r * sp * Math.cos(cam.th));
  camera.lookAt(cam.t);
}
function pan(dx, dy) {            // move no plano da tela: arrastar para cima e para baixo sobe e desce na vertical
  const k = goal.r * .0012, sp = Math.sin(goal.ph), cp = Math.cos(goal.ph);
  goal.t.x += -dx * k * Math.cos(goal.th) + dy * k * -Math.sin(goal.th) * cp; goal.t.y += dy * k * sp; goal.t.z += dx * k * Math.sin(goal.th) + dy * k * -Math.cos(goal.th) * cp;
}
const angDiff = (a, b) => { let d = (a - b) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; return d; };
function tgt(s, out) { const M = s.M, g = M.groups[s.nivel].userData.tp; return out.set(M.rootT.x + M.inner.position.x + g.x + s.c.x, g.y + 1, M.rootT.z + M.inner.position.z + g.z + s.c.z); }
function layout() {               // posição de cada piso conforme o modo: empilhado (3D e passeio) ou lado a lado (planta 2D)
  const A = AM();
  A.forEach(M => {
    let grid = null, cols = 1, rows = 1; const GW = M.w + 36, GH = M.h + 44;
    if (st.view === '2d' && !st.level) { grid = M.LV.filter(id => M.groups[id].userData.n >= 2); if (!grid.length) grid = M.LV.filter(id => /^L/.test(id)); cols = Math.ceil(Math.sqrt(grid.length)); rows = Math.ceil(grid.length / cols); }
    M.LV.forEach((id, i) => { const ud = M.groups[id].userData; let show = true;
      if (st.view === '2d') { if (st.level) { show = id === st.level; ud.tp.set(0, 0, 0); } else { const k = grid.indexOf(id); show = k >= 0; if (show) ud.tp.set((k % cols - (cols - 1) / 2) * GW, 0, (Math.floor(k / cols) - (rows - 1) / 2) * GH); } }
      else { ud.tp.set(0, i * st.exp, 0); if (st.view === 'walk') show = id === st.level; }
      ud.show = show; });
    M.ext = grid ? [cols * GW, rows * GH] : [M.w, M.h];
  });
  if (A.length === 2) { const gap = st.view === '2d' ? 70 : 150, tot = A[0].ext[0] + A[1].ext[0] + gap; A[0].rootT.set(-tot / 2 + A[0].ext[0] / 2, 0, 0); A[1].rootT.set(tot / 2 - A[1].ext[0] / 2, 0, 0); } else A[0].rootT.set(0, 0, 0);
}
function frameView(keep) {
  const A = AM(), Wd = A.reduce((a, M) => a + M.ext[0], 0) + (A.length - 1) * (st.view === '2d' ? 70 : 150), Hd = Math.max(...A.map(M => M.ext[1])), asp = camera.aspect || 1.6, tan = Math.tan(19 * Math.PI / 180);
  if (st.view === '2d') { goal.th = 0; goal.ph = .02; const pw = Math.max(200, SW - 130), ph_ = Math.max(200, SH - 110); goal.r = Math.max(Hd / 2 * SH / ph_, Wd / 2 / asp * SW / pw) / tan * 1.06; const wpp = 2 * goal.r * tan / SH; goal.t.set(SW > 700 ? -55 * wpp : 0, 0, -12 * wpp); return; }
  const M = A[0], li = st.level ? M.LV.indexOf(st.level) : (M.LV.length - 1) * .42, size = Math.max(Wd / asp * .9, Hd * (st.level ? .72 : .62));
  goal.t.set(0, li * st.exp, 0); goal.r = st.level ? size / tan * .68 : size / tan * .8 + st.exp * 9;
  if (!keep) goal.ph = st.level ? .78 : 1.02;
  if (A.length === 2) { goal.th = 0; goal.r = size / tan * .62 + st.exp * 9; }
}

/* ================= passeio em primeira pessoa ================= */
const wk = {u:0, gu:0, dir:1, off:0, pitch:-.03, yaw:0, look:null, py:null, align:false};
function pathAt(M, u) { const P = M.path, n = P.length; u = ((u % n) + n) % n; const i = Math.floor(u), f = u - i, a = P[i], b = P[(i + 1) % n]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
const tanYaw = (M, u, dir) => { const p = pathAt(M, u), q = pathAt(M, u + .5); return Math.atan2(q[0] - p[0], -(q[1] - p[1])) + (dir < 0 ? Math.PI : 0); };
function nearestNode(M, x, y) { let b = 0, bd = 1e9; M.path.forEach((p, i) => { const d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; b = i; } }); return b; }
function walkTo(M, n0, look) {
  poke();
  const N = M.path.length, g = n0 + N * Math.round((wk.u - n0) / N), d = g - wk.u; wk.gu = g;
  if (Math.abs(d) > .3) { wk.dir = d > 0 ? 1 : -1; wk.off = angDiff(wk.yaw, tanYaw(M, wk.u, wk.dir)); wk.align = true; }
  wk.look = look || null;
}
function walkGo(k) { poke();              // k > 0 avança para onde a câmera olha; k < 0 recua
  const M = CM(), f = Math.cos(angDiff(wk.yaw, tanYaw(M, wk.u, 1))) >= 0 ? 1 : -1;
  wk.look = null; wk.dir = f; wk.off = angDiff(wk.yaw, tanYaw(M, wk.u, f)); wk.gu = wk.gu + f * k; wk.align = k > 0;
}
function walkTurn(a) { poke(); const M = CM(); if (wk.look) { wk.off = angDiff(wk.yaw, tanYaw(M, wk.u, wk.dir)); wk.look = null; } wk.off += a; wk.align = false; }
function initWalk() { const M = CM(); if (st.sel && st.sel.M === M) wk.u = nearestNode(M, st.sel.ax, st.sel.ay); wk.gu = wk.u; wk.dir = 1; wk.off = 0; wk.pitch = -.03; wk.look = st.sel || null; wk.yaw = tanYaw(M, wk.u, 1); wk.py = null; }
function placeWalk() {
  const M = CM(), g = M.groups[st.level], d = wk.gu - wk.u, stp = reduce ? d : Math.max(-.24, Math.min(.24, d * .07)); wk.u += stp;
  if (wk.align && Math.abs(d) > .05) wk.off *= .9;
  const p = pathAt(M, wk.u); V.set(p[0], 1.7, -p[1]).applyMatrix4(g.matrixWorld);
  wk.py = wk.py == null || reduce ? V.y : wk.py + (V.y - wk.py) * .12;
  let gy = tanYaw(M, wk.u, wk.dir) + wk.off;
  if (wk.look && wk.look.mesh) { W3.copy(wk.look.c).applyMatrix4(wk.look.mesh.parent.matrixWorld); gy = Math.atan2(W3.x - V.x, W3.z - V.z); }
  wk.yaw += angDiff(gy, wk.yaw) * (reduce ? 1 : .12);
  camera.position.set(V.x, wk.py, V.z); camera.lookAt(V.x + Math.sin(wk.yaw) * 10, wk.py + wk.pitch * 10, V.z + Math.cos(wk.yaw) * 10);
}

/* ================= ponteiro ================= */
const ptr = new Map(), rc = new THREE.Raycaster(), v2 = new THREE.Vector2(); let moved = 0, pinch = 0, pickList = [], labelHits = [], lastHover = 0;
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('pointerdown', e => { poke(); canvas.setPointerCapture(e.pointerId); ptr.set(e.pointerId, {x:e.clientX, y:e.clientY, b:e.button}); moved = 0; pinch = 0; stopTour(); });
canvas.addEventListener('pointermove', e => {
  poke();
  const p = ptr.get(e.pointerId);
  if (!p) { const n = performance.now(); if (n - lastHover > 32) { lastHover = n; hover(e); } return; }
  const dx = e.clientX - p.x, dy = e.clientY - p.y; moved += Math.abs(dx) + Math.abs(dy); p.x = e.clientX; p.y = e.clientY;
  if (st.view === 'walk') { if (ptr.size === 1) { if (wk.look) { wk.off = angDiff(wk.yaw, tanYaw(CM(), wk.u, wk.dir)); wk.look = null; } wk.align = false; wk.off += dx * .0045; wk.pitch = Math.max(-.6, Math.min(.6, wk.pitch + dy * .003)); } return; }
  if (ptr.size === 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch) goal.r = Math.min(1800, Math.max(40, goal.r * pinch / d)); pinch = d; pan(dx / 2, dy / 2); }
  else if (p.b === 2 || e.shiftKey || st.view === '2d') pan(dx, dy);
  else { goal.th -= dx * .006; goal.ph = Math.min(1.5, Math.max(.02, goal.ph - dy * .005)); }
});
canvas.addEventListener('pointerup', e => { const p = ptr.get(e.pointerId); ptr.delete(e.pointerId); if (p && moved < 6 && p.b === 0) click(e); });
canvas.addEventListener('pointercancel', e => ptr.delete(e.pointerId));
canvas.addEventListener('pointerleave', () => { $('#tip').hidden = true; });
canvas.addEventListener('wheel', e => { e.preventDefault(); poke(); stopTour(); if (st.view === 'walk') { walkGo(e.deltaY < 0 ? 2 : -2); return; } goal.r = Math.min(1800, Math.max(40, goal.r * Math.exp(e.deltaY * .0012))); }, {passive:false});
window.addEventListener('keydown', e => {
  poke();
  if (/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return;
  if (e.key === 'PageUp') { stepLevel(1); e.preventDefault(); } else if (e.key === 'PageDown') { stepLevel(-1); e.preventDefault(); }
  else if (st.view === 'walk') { if (e.key === 'ArrowUp') walkGo(4); else if (e.key === 'ArrowDown') walkGo(-4); else if (e.key === 'ArrowLeft') walkTurn(.5); else if (e.key === 'ArrowRight') walkTurn(-.5); else return; e.preventDefault(); }
});
function pickAt(e) {
  const r = canvas.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
  for (let i = labelHits.length - 1; i >= 0; i--) { const b = labelHits[i]; if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) return b.o; }
  v2.set(px / r.width * 2 - 1, -py / r.height * 2 + 1); rc.setFromCamera(v2, camera);
  const hit = rc.intersectObjects(pickList)[0];
  return hit && hit.object.userData.s ? hit.object.userData.s : null;
}
function click(e) {
  const o = pickAt(e);
  if (o && o.mallTag) { setMall(o.M.key); return; }
  if (o && o.lvTag) { if (st.mall === 'cmp') { setMall(o.M.key); focusLevel(o.id); } else focusLevel(st.view !== 'walk' && o.id === st.level ? null : o.id); return; }
  if (o && o.nome) { select(o); return; }
  if (st.view === 'walk') {
    const M = CM(), g = M.groups[st.level], y = g.getWorldPosition(V).y, ro = rc.ray.origin, rd = rc.ray.direction;
    if (rd.y > -.02) { walkGo(4); return; }
    const t = (y - ro.y) / rd.y, lx = ro.x + rd.x * t - M.root.position.x - M.inner.position.x - g.position.x, ly = -(ro.z + rd.z * t - M.root.position.z - M.inner.position.z - g.position.z);
    walkTo(M, nearestNode(M, lx, ly)); return;
  }
  if (st.sel) select(null);
}
function hover(e) {
  const o = pickAt(e), s = o && o.nome ? o : null, tip = $('#tip');
  canvas.style.cursor = s || (o && (o.lvTag || o.mallTag)) ? 'pointer' : st.view === 'walk' ? 'crosshair' : 'grab';
  if (s !== st.hov) { const p = st.hov; st.hov = s; if (p && p.mesh) paint(p); if (s) paint(s); }
  if (!s) { tip.hidden = true; return; }
  const r = stage.getBoundingClientRect();
  tip.innerHTML = `${esc(s.nome)}<small>${st.mall === 'cmp' ? s.M.nome + ' · ' : ''}${s.luc ? 'Código ' + esc(s.luc) + ' · ' : ''}${esc(s.categoria)} · ${lvName(s.M, s.nivel)} · ~${nf(s.area_est)} m²</small>`;
  tip.style.left = Math.min(e.clientX - r.left, r.width - 250) + 'px'; tip.style.top = Math.min(e.clientY - r.top, r.height - 60) + 'px'; tip.hidden = false;
}

/* ================= estado → cena ================= */
const TMP = new THREE.Color();
function paint(s) {
  const M = s.M, m = s.mesh; if (!m) return;
  const k = s.tipo === 'Quiosque', inLv = !st.level || s.nivel === st.level, ok = match(s), cmp = st.mall === 'cmp', sel = st.sel === s, hov = st.hov === s, f = isFiltered();
  s.ok = ok; m.visible = inLv; m.userData.on = ok && inLv && (!cmp || k);
  let base, lit;
  if (cmp) { base = k ? (s.cmp === 'both' ? C_BOTH : M === CA ? C_MINE : C_OPP) : C_HOLO; lit = k; }
  else { lit = st.seg || f; base = k ? C_K : lit ? PALC[s.grupo] : C_HOLO; }
  const mat = m.material, em = s.edge.material, dim = !ok || (cmp && !k);
  const walk = st.view === 'walk';
  if (dim && !sel) { const ctx = !!st.level && !cmp; mat.visible = ctx; if (ctx) { mat.color.copy(C_HOLO).multiplyScalar(.24); mat.emissive.setRGB(0, 0, 0); mat.opacity = .55; } em.color.copy(C_DIM); em.opacity = cmp ? .3 : ctx ? .5 : .12; }
  else {
    const big = s.area_est >= 1000, fade = st.sel && !sel && !walk ? .5 : 1;
    mat.visible = true;
    mat.color.copy(base).multiplyScalar((k ? .95 : lit ? .72 : big ? .82 : .64) * fade);
    mat.emissive.copy(sel ? (k ? C_K : C_EDGE) : base).multiplyScalar(sel ? (walk ? .25 : .6) : hov ? .22 : (k ? .22 : lit ? .06 : 0) * fade);
    mat.opacity = walk ? (k ? .92 : .6) : (k ? .97 : .93);
    em.color.copy(k || lit ? base : C_EDGE).lerp(C_WHITE, sel ? .95 : hov ? .6 : k ? .35 : lit ? .3 : 0);
    em.opacity = sel || hov ? 1 : walk ? .8 : (k || lit ? .8 : .45) * (fade < 1 ? .6 : 1);
  }
  if (s.beam) s.beam.visible = !dim || sel;
}
let cand = [];
function buildCands() {
  cand = []; const A = AM(), f = isFiltered(), cmp = st.mall === 'cmp';
  if (!st.labels) { if (st.sel) cand.push([st.sel, 1e7]); return; }
  A.forEach(M => {
    M.S.forEach(s => {
      if (!s.mesh || !M.groups[s.nivel].userData.show) return;
      const k = s.tipo === 'Quiosque', inLv = !st.level || s.nivel === st.level; let p = 0;
      if (s === st.sel) p = 1e7;
      else if (!inLv || !s.ok) p = 0;
      else if (cmp) p = k ? (s.cmp === 'both' ? 5000 : M === CB ? 6000 : 4000) : 0;
      else if (st.view === 'walk') p = 1000 + (k ? 500 : 0) + Math.min(s.area_est, 900);
      else if (f) p = 5000 + Math.min(s.area_est, 3000);
      else if (st.level || st.view === '2d') p = k ? 3000 : 0;
      else p = s.area_est >= 1000 ? 2000 + s.area_est : 0;
      if (p) cand.push([s, p]);
    });
    if (!cmp && M.groups[M.gl].userData.show && (!st.level || st.level === M.gl)) M.accs.forEach(a => { if (st.level || a.pri >= 4000) cand.push([a, st.level ? a.pri : a.pri * .4]); });
  });
}
function refresh() {
  poke();
  const A = AM(), ghost = ghostAll(), f = isFiltered(), cmp = st.mall === 'cmp';
  ALL.forEach(M => { if (M.root) M.root.visible = A.includes(M); });
  layout(); pickList = [];
  A.forEach(M => {
    M.S.forEach(paint);
    M.LV.forEach(id => {
      const g = M.groups[id], ud = g.userData, on = !st.level || st.level === id, solid = ud.solid && !ghost;
      ud.slab.material.opacity = !on ? .03 : solid ? .93 : ghost && ud.solid ? .2 : .1; ud.slab.material.depthWrite = on && solid;
      ud.edge.material.opacity = !on ? .14 : ud.solid ? .95 : .45; ud.occ = on && solid; g.visible = ud.show;
      if (ud.occ && ud.show) pickList.push(ud.slab);
      const L = M.S.filter(s => s.nivel === id), n = L.filter(s => s.ok).length, nome = lvName(M, id), curto = (/^L/.test(id) ? nome.replace(/\s*\(.*\)/, '') : nome.replace(/^.*·\s*/, '')).toUpperCase();
      ud.tag = {chip:(cmp ? M.curto.slice(0, 3) + ' ' : '') + id, lt:on ? curto + (f ? (n ? ' · ' + n + (st.tipo === 'Quiosque' ? ' QUIOSQ.' : ' EM DESTAQUE') : '') : L.length ? ' · ' + L.length + ' OPS' : '') : '', uso:(M.D.niveis.find(x => x.id === id) || {}).uso || '', w:0};
    });
    M.meshes.forEach(m => { if (m.visible && m.userData.on && m.parent.visible) pickList.push(m); });
    M.roofs.forEach(r => { const s = r.userData.s; r.userData.on = st.labels && s.ok && !cmp && (!st.level || st.level === s.nivel) && st.view !== 'walk'; });
    M.ctx.visible = !cmp && !(st.view === '2d' && !st.level); M.cones.forEach(c => { c.visible = !st.level || st.level === M.gl; }); if (M.city) M.city.visible = st.ctx;
    M.pathObj.visible = M.floor.visible = st.view === 'walk';
  });
  roofA = -1; buildCands();
  const eM = CM(); $('#empty').hidden = !(eM && eM.empty); if (eM && eM.empty) $('#emptyT').textContent = eM.nome + ': falta a lista de lojas';
  renderList(); renderMix(); renderCmp(); renderResumo(); renderPB(); syncButtons(); measureUI();
}
function sweep() {}
function focusLevel(id, keep) {
  if (st.mall === 'cmp') return;
  if (st.view === 'walk' && !id) id = st.level;
  st.level = id || null; if (st.sel && id && st.sel.nivel !== id) { st.sel = null; renderDetail(); }
  layout(); if (st.view !== 'walk') frameView(keep); if (st.view === '3d') sweep(CM());
  refresh();
}
function stepLevel(d) {           // sobe ou desce um piso
  const M = CM(); if (!M) return; stopTour();
  const i = st.level ? M.LV.indexOf(st.level) + d : d > 0 ? Math.max(0, M.LV.findIndex(id => M.groups[id].userData.n > 0)) : M.LV.length - 1;
  focusLevel(M.LV[Math.max(0, Math.min(M.LV.length - 1, i))], true);
}
function select(s) {
  stopTour(); st.sel = s || null;
  if (s) {
    if (st.mall !== 'cmp' && s.M.key !== st.mall) { st.mall = s.M.key; st.level = null; mallChanged(); }
    if (st.mall !== 'cmp') st.level = s.nivel;
    layout();
    if (st.view === 'walk') walkTo(s.M, nearestNode(s.M, s.ax, s.ay), s);
    else { tgt(s, goal.t); const zr = Math.max(95, Math.min(210, Math.sqrt(s.area_est) * 6.5 + 45)); goal.r = st.view === '2d' ? Math.min(goal.r, zr + 30) : st.mall === 'cmp' ? Math.min(goal.r, 330) : zr; if (st.view === '3d' && st.mall !== 'cmp') goal.ph = Math.min(goal.ph, .8); }
    showTab('lojas');
  }
  renderDetail(); refresh();
}
function setView(v) {
  stopTour(); const M = CM();
  if (v === 'walk') { if (!M || M.empty) return; if (!st.level) st.level = M.groups.L1 && M.groups.L1.userData.n ? 'L1' : M.LV.find(id => M.groups[id].userData.n > 0) || M.LV[0]; st.view = v; layout(); scene.updateMatrixWorld(); initWalk(); }
  st.view = v; camera.fov = v === 'walk' ? 64 : 38; camera.updateProjectionMatrix(); scene.fog.near = v === 'walk' ? 80 : 600; scene.fog.far = v === 'walk' ? 620 : 2100;
  layout(); if (v !== 'walk') frameView(); refresh(); measureUI();
}
function setMall(key) {
  stopTour(); if (key === 'cmp' && st.view === 'walk') { st.view = '3d'; camera.fov = 38; camera.updateProjectionMatrix(); scene.fog.near = 600; scene.fog.far = 2100; }
  if (st.view === 'walk' && MALLS[key] && MALLS[key].empty) { st.view = '3d'; camera.fov = 38; camera.updateProjectionMatrix(); scene.fog.near = 600; scene.fog.far = 2100; }
  st.mall = key; st.level = null; st.sel = null; st.hov = null; st.q = ''; st.tipo = ''; st.preset = null; st.ciaSel = null; st.grupos = new Set(GRUPOS); $('#q').value = '';
  mallChanged(); layout();
  if (st.view === 'walk') { st.level = CM().groups.L1 ? 'L1' : CM().LV[0]; layout(); scene.updateMatrixWorld(); initWalk(); } else frameView();
  renderDetail(); renderFicha(); refresh(); measureUI();
  if (key === 'cmp') showTab('cmp'); else if (!$('#pane-cmp').hidden && !CB) showTab('resumo');
}

/* ================= painel ================= */
const lvBox = $('#levels');
function kpis(M) {                // números do topo, na ordem de "kpis" em shopping.json
  const out = [];
  (M.D.kpis || []).forEach(k => {
    if (k === '@ops') out.push([M.empty ? '—' : M.S.length, 'Operações na lista']);
    else if (k === '@quiosques') out.push([M.empty ? '—' : nK(M), 'Quiosques na lista']);
    else if (typeof k === 'string') { const f = M.D.F[k]; if (f) out.push([esc(fmtVal(f.valor, f.unidade)), esc(f.curto || f.rotulo)]); }
    else if (k.chaves) out.push([esc(k.chaves.map(c => fmtVal(fv(M, c))).join(k.sep || ' + ')), esc(k.rotulo)]);
    else out.push([esc(k.texto), esc(k.rotulo)]);
  });
  return out;
}
function mallChanged() {
  const M = CM(), cmp = !M;
  const FL = FM(); $('#mallSel').hidden = FL.length < 2;
  $('#mallSel').innerHTML = FL.map(m => `<button data-mall="${m.key}" aria-pressed="${m.key === st.mall}">${esc(m.nome)}<small>${esc(m.papel)}</small></button>`).join('') + (CB ? `<button data-mall="cmp" aria-pressed="${cmp}">Comparar<small>quiosques</small></button>` : '');
  $('#tb-cmp').hidden = !CB; $('#tb-pb').hidden = !pbM(); if ($('#tb-pb').hidden && !$('#pane-pb').hidden) showTab('resumo');
  lvBox.hidden = cmp;
  if (M) lvBox.innerHTML = `<button data-step="1" title="Subir um piso (PageUp)">▲ Subir</button><button data-lv="" aria-pressed="true">Todos<i>${M.S.length}</i></button>` + [...M.D.niveis].reverse().map(n => {
    const c = M.S.filter(s => s.nivel === n.id).length; return `<button data-lv="${esc(n.id)}" aria-pressed="false" title="${esc(n.nome + ' · ' + (n.uso || ''))}">${esc(n.id)}<i>${c || '–'}</i></button>`; }).join('') + `<button data-step="-1" title="Descer um piso (PageDown)">▼ Descer</button>`;
  const tipos = [...new Set(AM().flatMap(m => m.S.map(s => s.tipo)))].sort();
  $('#selTipo').innerHTML = '<option value="">Todos os tipos</option>' + tipos.map(t => `<option>${t}</option>`).join('');
  let kp, ttl, sub;
  if (cmp) { const vazio = CA.empty || CB.empty; ttl = `${CA.nome} × ${CB.nome} · Inteligência de quiosques`; sub = (CA.meu ? 'Meu shopping frente ao concorrente: ' : '') + 'marcas em comum, exclusivas e oportunidades';
    kp = [[CA.empty ? '—' : nK(CA), 'Quiosques ' + esc(CA.nome)], [CB.empty ? '—' : nK(CB), 'Quiosques ' + esc(CB.nome)], [vazio ? '—' : INTEL.both.length, 'Marcas em comum'], [vazio ? '—' : INTEL.onlyB.filter(x => !x.lojaA).length, 'Oportunidades']]; }
  else { const D = M.D; ttl = `${M.nome} · Planta 3D${M.papel === 'concorrente' ? ' do concorrente' : ''}`;
    sub = [D.subtitulo, D.coleta && D.embutida ? 'lista coletada em ' + D.coleta : '', M.empty ? 'lista de lojas pendente' : D.importada ? 'lojas pela relação importada' : ''].filter(Boolean).join(' · ');
    kp = kpis(M); }
  $('#ttl').innerHTML = `${esc(ttl)}<small>${esc(sub)}</small>`;
  $('#kpis').innerHTML = kp.map(k => `<div class="kpi"><b>${k[0]}</b><span>${k[1]}</span></div>`).join('');
  $('#legend').innerHTML = cmp ? `<span><i class="dot" style="background:${BOTH}"></i>quiosque nos dois</span><span><i class="dot" style="background:${MINE}"></i>só no ${esc(CA.nome)}</span><span><i class="dot" style="background:${OPP}"></i>só no ${esc(CB.nome)}</span>`
    : `<span>posição das lojas no piso: esquemática</span><span><i class="dot" style="background:${KHEX}"></i>quiosque</span><span><i class="dot" style="background:#9cc3e6"></i>loja</span><span><i class="dot" style="background:#7fd6aa"></i>entrada</span><span><i class="dot" style="background:#9db8d8"></i>garagem</span>${(M.D.conexoes || []).some(c => c.x != null) ? '<span><i class="dot" style="background:#c9a7f5"></i>torre, metrô ou conexão</span>' : ''}`;
}
lvBox.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; stopTour(); if (b.dataset.step) stepLevel(+b.dataset.step); else focusLevel(b.dataset.lv || null); });
$('#mallSel').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setMall(b.dataset.mall); });
$('#viewSel').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setView(b.dataset.view); });
$('#chips').innerHTML = GRUPOS.map(g => `<button class="chip" aria-pressed="true" data-g="${esc(g)}"><span class="dot" style="background:${PAL[g]}"></span>${esc(g)}</button>`).join('');
$('#chips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const g = b.dataset.g;
  if (st.grupos.size === GRUPOS.length) st.grupos = new Set([g]); else if (st.grupos.has(g) && st.grupos.size === 1) st.grupos = new Set(GRUPOS); else st.grupos.has(g) ? st.grupos.delete(g) : st.grupos.add(g);
  refresh(); });
$('#selTipo').addEventListener('change', e => { st.tipo = e.target.value; refresh(); });
$('#q').addEventListener('input', e => { st.q = e.target.value.trim(); refresh(); });
function scope() { const out = []; AM().forEach(M => M.S.forEach(s => { if ((!st.level || s.nivel === st.level) && match(s)) out.push(s); })); return out; }
const dotOf = s => s.tipo === 'Quiosque' ? KHEX : PAL[s.grupo];
const li = (s, extra) => `<li><button data-m="${s.M.key}" data-i="${s.i}"><span class="dot" style="background:${dotOf(s)}"></span><span class="nm">${esc(s.nome)}${extra || ''}<small>${s.luc ? esc(s.luc) + ' · ' : ''}${esc(s.categoria)} · ${s.tipo}</small></span><span class="mt">${st.mall === 'cmp' ? s.M.curto.slice(0, 3) + ' ' : ''}${s.nivel}<br>~${nf(s.area_est)} m²</span></button></li>`;
function renderList() {
  $$('#chips .chip').forEach(b => b.setAttribute('aria-pressed', st.grupos.has(b.dataset.g)));
  const key = s => s.luc && !/^Q|^MDL/.test(s.luc) ? s.luc : 'zz' + (s.luc || s.nome);
  const L = scope().sort((a, b) => (ALL.indexOf(a.M) - ALL.indexOf(b.M)) || a.M.LV.indexOf(a.nivel) - b.M.LV.indexOf(b.nivel) || key(a).localeCompare(key(b), 'pt', {numeric:true}));
  const M = CM();
  $('#count').textContent = M && M.empty ? 'Sem lista de lojas neste shopping.' : `${L.length} operações · ${st.level ? lvName(M, st.level) : 'todos os pisos'} · ~${nf(L.reduce((a, s) => a + s.area_est, 0))} m² estimados`;
  $('#list').innerHTML = L.map(s => li(s)).join('');
  $('#btClear').hidden = !isFiltered();
  const ib = $('#impBox'), want = M && !M.D.embutida ? M.key + (M.empty ? ':0' : ':1') : '';      // caixa de colar a relação, só para shopping sem lista embutida
  if (ib.dataset.k !== want) { ib.dataset.k = want; ib.innerHTML = want ? impHtml(M) : ''; }
}
const pickLi = e => { const b = e.target.closest('button[data-i]'); return b ? MALLS[b.dataset.m].S[+b.dataset.i] : null; };
$('#list').addEventListener('click', e => { const s = pickLi(e); if (s) { select(s); $('#detail').scrollIntoView({block:'nearest'}); } });
function renderDetail() {
  const s = st.sel, el = $('#detail');
  if (!s) { el.innerHTML = ''; return; }
  const of = '<span class="tag of">oficial</span>', es = '<span class="tag es">estimado</span>', imp = s.tipo_fonte === 'relação importada', src = imp ? '<span class="tag cm">relação</span>' : of, D = s.M.D;
  const extras = CAMPOS.map(f => { const v = campoVal(s, f); return v ? `<dt>${esc(f.rotulo)}</dt><dd>${esc(v)}${f.fonte ? `<span class="tag cm">${esc(f.fonte)}</span>` : ''}</dd>` : ''; }).join('');
  el.innerHTML = `<div class="detail"><div><button class="close" id="dClose" aria-label="Fechar">×</button><h2>${esc(s.nome)}</h2></div><dl>
    <dt>Shopping</dt><dd>${esc(s.M.nome)} (${esc(s.M.papel)})</dd>
    <dt>Código</dt><dd>${s.luc ? esc(s.luc) + (s.n_luc > 1 ? ' (' + s.n_luc + ' unidades unidas)' : '') + src : esc(s.luc_nota || 'não informado')}</dd>
    <dt>Piso</dt><dd>${esc(s.piso_oficial)}${src}</dd>
    <dt>Categoria</dt><dd>${esc(s.categoria)}${src}</dd>
    <dt>Situação</dt><dd>${esc(s.status)}${src}</dd>
    <dt>Tipo</dt><dd>${esc(s.tipo)}${imp ? src : String(s.tipo_fonte || '').startsWith('oficial') ? of : es}</dd>
    <dt>Área</dt><dd>~${nf(s.area_est)} m²${s.aj ? `<span class="tag cm">${esc(s.ajTag)}</span>` : s.area_real ? src : es}</dd>
    <dt>Fachada</dt><dd>~${String(s.fachada_est).replace('.', ',')} m${es}</dd>
    <dt>Margem</dt><dd>${esc(s.faixa || '')}</dd>
    <dt>Posição</dt><dd>${s.luc && !imp ? 'Ordem pelo código oficial; ' : ''}${esc(s.anel || '')}. Desenho esquemático${es}</dd>${extras}
    ${s.cia ? `<dt>Empresa listada</dt><dd>${esc(s.cia.c.empresa)} (${esc(s.cia.c.ticker)} · ${esc(s.cia.c.bolsa || '')})<br>${[s.cia.c.receita ? esc(s.cia.c.receita.rotulo || 'Receita') + ' ' + vInd(s.cia.c.receita, x => fmtMoeda(x.valor, x.moeda)) : '', s.cia.c.lojas ? vInd(s.cia.c.lojas, x => nf(x.valor) + ' lojas') : '', s.cia.c.venda_m2 ? vInd(s.cia.c.venda_m2, x => nf(Math.round(x.valor)) + ' ' + x.unidade) : ''].filter(Boolean).join(' · ')}${s.cia.c.receita && s.cia.c.receita.fonte ? ` <a href="${esc(s.cia.c.receita.fonte)}" target="_blank" rel="noopener">fonte ↗</a>` : ''}</dd>` : ''}
    ${pbOn(s.M) ? `<dt>Decisão</dt><dd>${decHtml(s.M, s.key)}</dd>` : ''}</dl>
    <div class="row"><button class="btn" id="dWalk">Ir até a loja no passeio</button>${s.slug && D.link_loja ? `<a href="${esc(D.link_loja.replace('{slug}', encodeURI(s.slug)))}" target="_blank" rel="noopener">Página no site do shopping ↗</a>` : ''}</div></div>`;
  $('#dClose').onclick = () => select(null);
  $('#dWalk').onclick = () => { if (st.mall === 'cmp') { const k = s; setMall(s.M.key); st.sel = k; st.level = k.nivel; renderDetail(); } setView('walk'); };
}
const bars = (rows, col, tot) => `<div class="bars">${rows.map(([k, v]) => `<div class="bar"><span>${esc(k)}</span><span class="track"><span class="fill" style="width:${(v.a / rows[0][1].a * 100).toFixed(1)}%;background:${col(k)}"></span></span><span class="v">${v.n} · ${(v.a / tot * 100).toFixed(0)}% da área</span></div>`).join('')}</div>`;
function renderMix() {
  const L = scope(), el = $('#pane-mix'); if (el.hidden) return;
  if (!L.length) { el.innerHTML = '<p class="count">Sem operações neste recorte.</p>'; return; }
  const by = k => { const m = {}; L.forEach(s => { (m[s[k]] = m[s[k]] || {n:0, a:0}).n++; m[s[k]].a += s.area_est; }); return Object.entries(m).sort((a, b) => b[1].a - a[1].a); };
  const tot = L.reduce((a, s) => a + s.area_est, 0) || 1, lv = [];
  AM().forEach(M => M.LV.forEach(id => { const a = M.S.filter(s => s.nivel === id && match(s)); if (a.length) lv.push([(st.mall === 'cmp' ? M.curto.slice(0, 3) + ' · ' : '') + lvName(M, id), a]); }));
  const mx = Math.max(...lv.map(x => x[1].length));
  el.innerHTML = `<p class="count">${L.length} operações em ${st.level ? lvName(CM(), st.level) : 'todos os pisos'}. Barras pela área do desenho (informada, estimada ou de referência, conforme a ficha de cada loja); à direita, nº de operações e participação nessa área.</p>
    <h3>Por grupo de segmento</h3>${bars(by('grupo'), k => PAL[k], tot)}
    <h3>Por tipo de operação</h3>${bars(by('tipo'), () => 'var(--cy)', tot)}
    <h3>Operações por piso</h3><div class="bars">${lv.map(([nm, a]) => `<div class="bar"><span>${esc(nm)}</span><span class="track"><span class="fill" style="width:${a.length / mx * 100}%;background:var(--muted)"></span></span><span class="v">${a.length} · ${a.filter(s => s.tipo === 'Quiosque').length} quiosq.</span></div>`).join('')}</div>
    ${CAMPOS.filter(f => f.agrupar && L.some(s => s[f.chave] != null && s[f.chave] !== '')).map(f => { const m = {}; L.forEach(s => { const v = s[f.chave]; if (v == null || v === '') return; (m[v] = m[v] || {n:0, a:0}).n++; m[v].a += s.area_est; }); return `<h3>Por ${esc(f.rotulo.toLowerCase())}</h3>${bars(Object.entries(m).sort((a, b) => b[1].a - a[1].a), () => 'var(--cy)', tot)}`; }).join('')}
    <h3>Maiores áreas estimadas</h3><ul class="list">${[...L].sort((a, b) => b.area_est - a.area_est).slice(0, 12).map(s => li(s)).join('')}</ul>`;
}
$('#pane-mix').addEventListener('click', e => { const s = pickLi(e); if (s) select(s); });

/* ---------- relação de lojas colada na página ---------- */
/* Vale para qualquer shopping que chegue sem lojas.json nem lojas.csv. Fica só neste navegador; para fixar, grave o texto em shoppings/<id>/lojas.csv e monte de novo. */
function impHtml(M) {
  const cols = ['Nome', 'Piso', 'Segmento', 'Tipo', 'LUC', 'Área', 'Situação'].concat(CAMPOS.map(f => f.rotulo)).join(';');
  const box = `<textarea id="imp" aria-label="Relação de lojas do ${esc(M.nome)}" placeholder="${esc(cols)}&#10;NOME DA LOJA;L1;Moda feminina;Loja;L1-045;120&#10;NOME DO QUIOSQUE;L2;Sorvetes;Quiosque;Q2-07;8"></textarea>
    <div class="row"><button class="btn pri" id="btImp">Montar ${esc(M.nome)}</button>${M.empty ? '' : '<button class="btn" id="btClr">Limpar lista</button>'}</div><p class="msg" id="impMsg"></p>
    <p class="count">Cole direto do Excel, com a linha de cabeçalho. Só Nome e Piso são obrigatórios; as outras colunas melhoram o resultado. A lista fica salva só neste navegador. Para fixá-la para todos, grave-a em shoppings/${esc(M.key)}/lojas.csv e monte a página de novo.</p>`;
  return M.empty ? `<h3>Colar a lista de lojas do ${esc(M.nome)}</h3>${box}` : `<details><summary>Trocar a lista do ${esc(M.nome)}</summary>${box}</details>`;
}
function doImport(M, text, save) {
  const r = parseLista(text); if (r.erro) return r.erro;
  aplicarLista(M.D, r.rows); M.D.importada = new Date().toLocaleDateString('pt-BR'); makeMall(M); buildRoofs(M); relink(M);
  if (save) try { localStorage.setItem('lista-' + M.key, text); } catch (e) {}
  return null;
}
function relink(M) { if (PBS[M.key]) PBS[M.key].brands = null; if (CB) INTEL = crossBrands(CA.S, CB.S); }
$('#impBox').addEventListener('click', e => {
  const M = CM(); if (!M) return;
  if (e.target.id === 'btImp') { const err = doImport(M, $('#imp').value, true); if (err) $('#impMsg').textContent = err; else setMall(M.key); }
  if (e.target.id === 'btClr') { try { localStorage.removeItem('lista-' + M.key); } catch (x) {} M.D.lojas = []; M.D.importada = null; makeMall(M); relink(M); setMall(M.key); }
});
$('#btGoImp').onclick = () => { showTab('lojas'); const t = $('#imp'); if (t) t.focus(); };

/* ---------- inteligência de quiosques ---------- */
const kStats = M => { const k = M.S.filter(s => s.tipo === 'Quiosque'), abl = fv(M, 'abl_m2'); return {ops:M.S.length, k:k.length, dens:typeof abl === 'number' && abl > 0 ? k.length / (abl / 1000) : null, part:M.S.length ? k.length / M.S.length * 100 : 0, pisos:new Set(k.map(s => s.nivel)).size}; };
const dec1 = v => v == null ? FALTA : v.toFixed(1).replace('.', ',');
function radarHtml(M) {            // leitura de quiosques de um shopping só, enquanto o outro não tem lista
  const R = kStats(M), kR = M.S.filter(s => s.tipo === 'Quiosque');
  const seg = GRUPOS.map(g => [g, kR.filter(s => s.grupo === g).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1]), lv = M.LV.map(id => [id, kR.filter(s => s.nivel === id).length]).filter(x => x[1]);
  return `<h3>Radar · ${R.k} quiosques no ${esc(M.nome)}</h3>
    <div class="score"><span></span><span class="hd">${esc(M.nome)}</span><span></span><span>Quiosques por 1.000 m² de ABL</span><b>${dec1(R.dens)}</b><span></span><span>Participação nas operações</span><b>${dec1(R.part)}%</b><span></span><span>Pisos com quiosque</span><b>${R.pisos}</b><span></span></div>
    ${seg.length ? `<h3>Por segmento</h3><div class="bars">${seg.map(([g, n]) => `<div class="bar"><span>${esc(g)}</span><span class="track"><span class="fill" style="width:${n / seg[0][1] * 100}%;background:${PAL[g]}"></span></span><span class="v">${n}</span></div>`).join('')}</div>
    <h3>Por piso</h3><div class="bars">${lv.map(([id, n]) => `<div class="bar"><span>${esc(lvName(M, id))}</span><span class="track"><span class="fill" style="width:${n / Math.max(...lv.map(x => x[1])) * 100}%;background:${KHEX}"></span></span><span class="v">${n}</span></div>`).join('')}</div>` : ''}
    <h3>Marcas com quiosque no ${esc(M.nome)}</h3><ul class="list">${[...kR].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')).map(s => li(s)).join('') || '<li class="count">Nenhuma.</li>'}</ul>`;
}
function renderCmp() {
  const el = $('#pane-cmp'); if (el.hidden || !CB) return;
  const A = CA, B = CB, nA = esc(A.nome), nB = esc(B.nome), opts = sel => FM().map(m => `<option value="${m.key}"${m === sel ? ' selected' : ''}>${esc(m.nome)}</option>`).join('');
  const par = FM().length > 2 ? `<div class="search"><select id="cmpA" aria-label="Shopping de referência">${opts(A)}</select><select id="cmpB" aria-label="Shopping comparado">${opts(B)}</select></div>` : '';
  if (A.empty || B.empty) {
    const falta = [A, B].filter(m => m.empty), tem = [A, B].filter(m => !m.empty);
    el.innerHTML = par + vendasHtml(FM()) + varejoHtml(FM()) + [A, B].map(conexHtml).join('') + falta.map(m => `<h3>Falta a lista do ${esc(m.nome)}</h3><p>O cruzamento começa quando a relação de lojas e quiosques entrar.</p><div class="row"><button class="btn pri" data-imp="${m.key}">Colar a lista do ${esc(m.nome)}</button></div>`).join('') + tem.map(radarHtml).join('');
    return;
  }
  const I = INTEL, T = kStats(A), R = kStats(B), opp = I.onlyB.filter(x => !x.lojaA), fmt = I.onlyB.filter(x => x.lojaA), mxs = Math.max(1, ...I.seg.map(x => Math.max(x.a, x.b)));
  const gaps = I.seg.filter(x => x.b > x.a).sort((a, b) => (b.b - b.a) - (a.b - a.a));
  const csv = [`Marca;Segmento;Piso no ${B.nome};Situação no ${A.nome}`].concat(I.onlyB.map(x => [x.b[0].nome, x.b[0].categoria, x.b.map(s => s.nivel).join('/'), x.lojaA ? 'já é loja (' + x.lojaA.nivel + ')' : 'ausente'].join(';'))).join('\n');
  el.innerHTML = `${par}${vendasHtml(FM())}${varejoHtml(FM())}<div class="big3"><div><b style="color:${MINE}">${T.k}</b><span>Quiosques ${nA}</span></div><div><b style="color:${OPP}">${R.k}</b><span>Quiosques ${nB}</span></div><div><b style="color:${BOTH}">${I.both.length}</b><span>Marcas em comum</span></div></div>
    <h3>Placar</h3><div class="score"><span></span><span class="hd">${nA}</span><span class="hd">${nB}</span>
      <span>Operações na base</span><b>${T.ops}</b><b>${R.ops}</b><span>Quiosques</span><b>${T.k}</b><b>${R.k}</b>
      <span>Quiosques por 1.000 m² de ABL</span><b>${dec1(T.dens)}</b><b>${dec1(R.dens)}</b><span>Quiosques nas operações</span><b>${dec1(T.part)}%</b><b>${dec1(R.part)}%</b>
      <span>Pisos com quiosque</span><b>${T.pisos}</b><b>${R.pisos}</b><span>Marcas (lojas e quiosques)</span><b>${I.marcasA}</b><b>${I.marcasB}</b></div>
    <p class="count">${I.inter} marcas aparecem nos dois shoppings, somando lojas e quiosques. Em quiosques, ${I.both.length} marcas se repetem.</p>
    <h3>Quiosques por segmento</h3><div class="duo">${I.seg.map(x => `<span>${esc(x.g)}</span><span class="tr"><i style="width:${x.a / mxs * 100}%;background:${MINE}"></i><i style="width:${x.b / mxs * 100}%;background:${OPP}"></i></span><span class="v">${x.a} × ${x.b}</span>`).join('')}</div>
    <p class="count">Verde: ${nA}. Laranja: ${nB}.${gaps.length ? ' O ' + nB + ' tem mais quiosques em ' + gaps.slice(0, 3).map(x => esc(x.g) + ' (+' + (x.b - x.a) + ')').join(', ') + '.' : ''}</p>
    <h3>Oportunidades · ${opp.length} marcas com quiosque no ${nB} e fora do ${nA}</h3><ul class="list">${opp.map(x => li(x.b[0], '<span class="tag op">prospectar</span>')).join('') || '<li class="count">Nenhuma.</li>'}</ul>
    ${fmt.length ? `<h3>Já são lojistas do ${nA}, com quiosque no ${nB} · ${fmt.length}</h3><ul class="list">${fmt.map(x => li(x.b[0], `<span class="tag cm">loja no ${nA}</span>`)).join('')}</ul>` : ''}
    <h3>Quiosques em comum · ${I.both.length}</h3><ul class="list">${I.both.map(x => li(x.a[0], '<span class="tag cm">nos dois</span>')).join('') || '<li class="count">Nenhuma marca em comum.</li>'}</ul>
    <h3>Só no ${nA} · ${I.onlyA.length}</h3><ul class="list">${I.onlyA.map(x => li(x.a[0], x.lojaB ? `<span class="tag cm">loja no ${nB}</span>` : '<span class="tag mi">exclusivo</span>')).join('') || '<li class="count">Nenhuma.</li>'}</ul>
    ${[A, B].map(conexHtml).join('')}
    <h3>Levar para a prospecção</h3><button class="btn" id="btCsvO">Copiar oportunidades em CSV</button><textarea id="csvO" readonly aria-label="Oportunidades em CSV">${esc(csv)}</textarea>
    <p class="count">O cruzamento compara nomes de marca (sem acento, piso ou complemento). Confira homônimos antes de abordar.</p>`;
  $('#btCsvO').onclick = async () => { const b = $('#btCsvO'); try { await navigator.clipboard.writeText(csv); b.textContent = 'Copiado. Cole no Excel'; } catch (e) { $('#csvO').select(); b.textContent = 'Selecionado. Use Ctrl+C'; } };
}
$('#pane-cmp').addEventListener('click', e => {
  const lk = e.target.closest('button[data-cia]'); if (lk) { const c = VAREJO[+lk.dataset.cia]; setMall(lk.dataset.m); st.preset = 'lst'; st.ciaSel = c; refresh(); showTab('lojas'); return; }
  const b = e.target.closest('button[data-imp]'); if (b) { setMall(b.dataset.imp); showTab('lojas'); const t = $('#imp'); if (t) t.focus(); return; }
  const s = pickLi(e); if (s) { if (st.mall !== 'cmp') setMall('cmp'); select(s); } });
$('#pane-cmp').addEventListener('change', e => {     // troca o par comparado quando há mais de dois shoppings
  if (e.target.id !== 'cmpA' && e.target.id !== 'cmpB') return;
  const a = MALLS[$('#cmpA').value], b = MALLS[$('#cmpB').value]; if (a === b) { renderCmp(); return; }
  CA = a; CB = b; INTEL = crossBrands(CA.S, CB.S); setMall('cmp');
});

/* ---------- ficha, acessos e método ---------- */
/* ---------- vendas divulgadas por empresas listadas ---------- */
const MESES = {ano:12, '12 meses':12, trimestre:3, 'mês':1};
const fmtR = v => v == null ? FALTA : v >= 1e9 ? 'R$ ' + (v / 1e9).toFixed(2).replace('.', ',') + ' bi' : 'R$ ' + nf(Math.round(v / 1e6)) + ' mi';
const vendaRef = M => (M.D.vendas || []).filter(x => MESES[x.tipo_periodo] === 12).sort((a, b) => (b.tipo_periodo === 'ano') - (a.tipo_periodo === 'ano') || (b.ordem || 0) - (a.ordem || 0))[0] || null;     // último ano fechado; sem ele, os 12 meses mais recentes
const rm2 = v => v == null ? '—' : 'R$ ' + nf(Math.round(v));
function varejoHtml(L) {            // varejistas listadas presentes em cada shopping do filtro, com os números públicos da empresa
  if (!VAREJO.length) return '';
  const cab = L.map(M => `<th title="${esc(M.nome)}">${esc(M.curto.slice(0, 9))}</th>`).join('');
  const conta = (c, M) => M.empty ? null : M.S.filter(s => s.cia && s.cia.c === c).length;
  const R = VAREJO.map(c => ({c, n:L.map(M => conta(c, M))})).filter(x => x.n.some(v => v)).sort((a, b) => ((b.c.receita && b.c.receita.moeda === 'R$' ? b.c.receita.valor : 0) - (a.c.receita && a.c.receita.moeda === 'R$' ? a.c.receita.valor : 0)) || a.c.empresa.localeCompare(b.c.empresa, 'pt'));
  const tot = L.map((M, i) => M.empty ? null : M.S.filter(s => s.cia).length);
  if (!R.length) return `<h3>Varejistas listadas em bolsa</h3><p class="count">Nenhuma marca de empresa listada identificada nas listas deste filtro.</p>`;
  const lk = x => (x && x.conf === false ? '<span class="tag es">a conferir</span>' : '') + (x && x.fonte ? ` <a href="${esc(x.fonte)}" target="_blank" rel="noopener">↗</a>` : '');
  return `<h3>Varejistas listadas em bolsa · ${R.length} empresas</h3>
    <p class="count">${L.map((M, i) => esc(M.nome) + ': ' + (tot[i] == null ? 'sem lista de lojas' : tot[i] + ' operações de empresas listadas (' + pct(tot[i] / M.S.length) + ' das operações)')).join(' · ')}.</p>
    <div class="tbw"><table class="tb"><thead><tr><th>Empresa</th>${cab}<th>Receita</th><th>Lojas</th><th>Área de vendas</th><th>Venda por m²</th><th>Mesmas lojas</th></tr></thead><tbody>${R.map(({c, n}) => `<tr>
      <td><b>${esc(c.empresa)}</b><br><span class="mut">${esc(c.ticker)} · ${esc(c.bolsa || '')}${c.situacao && !/^listada/i.test(c.situacao) ? ' · ' + esc(c.situacao) : ''}</span><br><span class="mut">${esc((c.marcas || []).filter(m => L.some(M => !M.empty && M.S.some(s => s.cia && s.cia.m === m))).map(m => m.marca).join(', '))}</span></td>
      ${n.map((v, i) => `<td>${v == null ? '—' : v ? `<button class="lk" data-cia="${VAREJO.indexOf(c)}" data-m="${L[i].key}">${v}</button>` : '0'}</td>`).join('')}
      <td>${c.receita ? fmtMoeda(c.receita.valor, c.receita.moeda) + `<br><span class="mut">${esc(c.receita.rotulo || '')} ${esc(c.receita.periodo)}</span>` + lk(c.receita) : FALTA}</td>
      <td>${c.lojas ? nf(c.lojas.valor) + `<br><span class="mut">${esc(c.lojas.periodo)}${c.lojas.recorte ? ' · ' + esc(c.lojas.recorte) : ''}</span>` + lk(c.lojas) : '—'}</td>
      <td>${c.area ? nf(Math.round(c.area.valor)) + ' m²' + `<br><span class="mut">${esc(c.area.periodo)}${c.area.recorte ? ' · ' + esc(c.area.recorte) : ''}</span>` + lk(c.area) : '—'}</td>
      <td>${c.venda_m2 ? nf(Math.round(c.venda_m2.valor)) + `<br><span class="mut">${esc(c.venda_m2.unidade)} · ${esc(c.venda_m2.periodo)}</span><span class="tag ${c.venda_m2.origem === 'publicado' ? 'of' : 'es'}">${esc(c.venda_m2.origem)}</span>${c.venda_m2.origem === 'calculado' && c.venda_m2.escopo ? `<br><span class="mut">${esc(c.venda_m2.escopo)}</span>` : ''}` + lk(c.venda_m2) : '—'}</td>
      <td>${c.sss ? String(c.sss.valor).replace('.', ',') + '%' + `<br><span class="mut">${esc(c.sss.periodo)}</span>` + lk(c.sss) : '—'}</td></tr>`).join('')}</tbody></table></div>
    <p class="count">As colunas dos shoppings contam as operações de cada empresa na lista de lojas; clique no número para destacá-las na maquete. Receita, lojas, área e venda por m² são da empresa inteira (ou do recorte indicado), não da loja deste shopping. "Publicado": número divulgado pela empresa. "Calculado": receita dividida pela área de vendas divulgada, conta deste painel. "A conferir": o número veio do resumo de um buscador, sem leitura do documento da empresa; confirme na fonte antes de usar. Empresas estrangeiras aparecem na moeda do balanço.</p>`;
}
function vendasHtml(L) {            // venda dos lojistas e venda por m², por shopping, com a fonte de cada número
  if (!L.some(M => M.D.vendas || M.D.vendas_nota)) return '';
  const ref = L.map(M => [M, vendaRef(M)]).filter(x => x[1]);
  const barras = (tit, val, fmt) => { const R = ref.filter(x => val(x[1]) != null).sort((a, b) => val(b[1]) - val(a[1])); if (!R.length) return ''; const mx = val(R[0][1]) || 1;
    return `<h3>${tit}</h3><div class="bars">${R.map(([M, x]) => `<div class="bar"><span>${esc(M.nome)}</span><span class="track"><span class="fill" style="width:${(val(x) / mx * 100).toFixed(1)}%;background:${M.meu ? MINE : OPP}"></span></span><span class="v">${fmt(val(x))} · ${esc(x.periodo)}</span></div>`).join('')}</div>`; };
  const linhas = M => (M.D.vendas || []).map(x => `<tr><td>${esc(String(x.periodo).replace('12 meses até ', '12m até '))}</td><td>${x.vendas != null ? fmtR(x.vendas) : '—'}</td><td>${rm2(x.m2)}</td><td>${rm2(x.m2_pub)}</td><td>${x.fonte ? `<a href="${esc(x.fonte)}" target="_blank" rel="noopener">fonte ↗</a>` : ''}</td></tr>${x.nota ? `<tr class="nt"><td colspan="5">${esc(x.nota)}</td></tr>` : ''}`).join('');
  const abls = M => { const a = [...new Set((M.D.vendas || []).filter(x => x.abl).map(x => nf(x.abl) + ' m² (' + x.abl_origem + ')'))]; return a.length ? `<p class="count">Venda ÷ ABL usa ABL de ${esc(a.join(' e '))}.</p>` : ''; };
  return `<h3>Vendas divulgadas por empresas listadas</h3>
    ${barras('Venda dos lojistas no último ano fechado', x => x.vendas, fmtR)}${barras('Venda ÷ ABL total, por m² ao mês (calculado)', x => x.m2, rm2)}${barras('Venda por m² ao mês publicada pela empresa', x => x.m2_pub, rm2)}
    ${L.map(M => `<h3>${esc(M.nome)}${M.D.vendas_empresa ? ' · ' + esc(M.D.vendas_empresa) : ''}</h3>${(M.D.vendas || []).length ? `<div class="tbw"><table class="tb"><thead><tr><th>Período</th><th>Venda</th><th>÷ ABL /mês</th><th>Publicada /mês</th><th></th></tr></thead><tbody>${linhas(M)}</tbody></table></div>${abls(M)}` : ''}${M.D.vendas_nota ? `<p class="count">${esc(M.D.vendas_nota)}</p>` : (M.D.vendas || []).length ? '' : `<p class="count">${FALTA}</p>`}`).join('')}
    <p class="count">Venda é a dos lojistas do shopping inteiro, como a empresa divulga. "÷ ABL" é conta deste painel: venda dividida pela ABL total e pelos meses do período; serve para comparar shoppings na mesma régua. "Publicada" é a venda por m² que a própria empresa divulga, na base dela, que pode excluir quiosques e lojas que não reportam venda; por isso é maior e não se compara entre empresas. Verde: meu shopping. Laranja: concorrente.</p>`;
}
const ACESSO_TAG = {direto:'of', 'pela rua':'cm', 'a confirmar':'es'};
function conexHtml(M) {            // torres, metrô e ligações com outros empreendimentos, cada uma com a fonte
  const L = M.D.conexoes; if (!L) return '';
  return `<h3>Torres, metrô e conexões · ${esc(M.nome)}</h3>` + (L.length ? `<ul class="plain">${L.map(c => `<li><b>${esc(c.nome)}</b> <span class="tag cm" style="margin:0 4px">${esc(c.tipo || 'conexão')}</span><span class="tag ${ACESSO_TAG[c.acesso] || 'es'}" style="margin:0 4px 0 0">acesso ${esc(c.acesso || 'a confirmar')}</span>${c.piso ? ' · ' + esc(c.piso) : ''}<br>${esc(String(c.descricao || '').replace(/\s*$/, '').replace(/([^.!?])$/, '$1.'))}${c.d != null ? (c.d < 3 ? ' No mapa, colada ao prédio do shopping.' : ' No mapa, a cerca de ' + c.d + ' m do prédio.') : ''}${c.fonte ? ` <a href="${esc(c.fonte)}" target="_blank" rel="noopener">fonte ↗</a>` : ''}</li>`).join('')}</ul>
    <p class="count">"Direto" só quando a fonte afirma a ligação por dentro do shopping. "Pela rua" é vizinhança. "A confirmar" pede visita ou planta.</p>` : `<p class="count">Nenhuma torre, estação ou ligação com outro empreendimento encontrada em fonte pública.</p>`);
}
function accHtml(M) {
  const X = M.D.entorno; if (!X) return '';
  const by = t => X.acessos.filter(a => a.t === t), ruas = L => [...new Set(L.map(a => abrev(a.rua)).filter(Boolean))].join(' e '), pts = X.pontos.filter(p => p.d <= 170);
  const rows = [];
  if (by('principal').length) rows.push(['Entrada principal', ruas(by('principal')) + ', no piso térreo (' + M.gl + ')']);
  if (by('entrada').length) rows.push(['Outras entradas de pedestres', by('entrada').length + ' mapeadas: ' + ruas(by('entrada'))]);
  if (by('garagem').length) rows.push(['Acessos de garagem', by('garagem').length + ' mapeados: ' + ruas(by('garagem'))]);
  if (by('cancela').length) rows.push(['Cancelas no mapa', String(by('cancela').length)]);
  if (X.nomes.length) rows.push(['Ruas do entorno', X.nomes.map(s => abrev(s.n)).join(' · ')]);
  if (pts.length) rows.push(['Transporte próximo', pts.map(p => (p.t === 'táxi' ? 'Ponto de táxi' : p.t === 'ônibus' ? 'Ônibus' : 'Metrô') + (p.n ? ' ' + p.n : '') + ' (' + p.d + ' m)').join(' · ')]);
  return `<h3>Acessos e referências · ${esc(M.nome)}</h3><dl>${rows.map(r => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>
    <dl>${M.D.niveis.map(n => `<dt>${esc(n.id)}</dt><dd>${esc(n.uso || '')}</dd>`).join('')}</dl>
    <p class="count">Entradas, ruas e prédios vizinhos vêm do OpenStreetMap. No 3D, as setas verdes marcam entradas de pedestres e as azuis, garagem. A altura dos prédios vizinhos é ilustrativa quando o mapa não informa.</p>`;
}
const TAGC = {oficial:'of', real:'of', estimado:'es', 'a confirmar':'es'};
function metodoTxt(M, t) {         // troca {ops}, {com_codigo}, {quiosques}, {quiosques_oficiais}, {quiosques_inferidos} e {ficha:chave} pelos números da base
  const S = M.S, K = S.filter(x => x.tipo === 'Quiosque'), kOf = K.filter(x => String(x.tipo_fonte || '').startsWith('oficial')).length;
  const v = {ops:S.length, com_codigo:S.filter(x => x.luc).length, quiosques:K.length, quiosques_oficiais:kOf, quiosques_inferidos:K.length - kOf};
  return String(t).replace(/\{ficha:([\w-]+)\}/g, (m, k) => fmtVal(fv(M, k))).replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? v[k] : m);
}
function renderFicha() {
  let h = '';
  AM().forEach(M => {
    const D = M.D, S = M.S;
    const rows = (D.ficha || []).map(f => [f.rotulo, fmtVal(f.valor, f.unidade) + (f.nota ? ' · ' + f.nota : ''), f.fonte]);
    rows.push(['Lista de lojas', M.empty ? 'pendente' : S.length + ' operações, ' + nK(M) + ' quiosques' + (D.importada ? ', importada em ' + D.importada : D.coleta ? ', coletada em ' + D.coleta : ''), D.embutida ? D.origem_lista : null]);
    h += `<h3>Ficha técnica · ${esc(M.nome)}</h3><dl>${rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}${r[2] ? `<span class="tag cm">${esc(r[2])}</span>` : ''}</dd>`).join('')}</dl>${vendasHtml([M])}${conexHtml(M)}${accHtml(M)}
      ${(D.metodo || []).length ? `<h3>O que é oficial e o que é estimado · ${esc(M.nome)}</h3><ul class="plain">${D.metodo.map(x => `<li><span class="tag ${TAGC[x.tag] || 'cm'}" style="margin:0 5px 0 0">${esc(x.tag)}</span>${esc(metodoTxt(M, x.texto))}</li>`).join('')}</ul>` : ''}
      <h3>Fontes · ${esc(M.nome)}</h3><ul class="plain">${D.fontes.map(f => `<li>${esc(f)}</li>`).join('') || `<li>${FALTA}</li>`}</ul>`;
  });
  const csv = ['Shopping;Nome;Codigo de localizacao;Piso;Categoria;Grupo;Tipo;Status;Area estimada m2;Fachada estimada m'.split(';').concat(CAMPOS.map(f => deacc(f.rotulo))).join(';')].concat(AM().flatMap(M => M.S.map(s => [M.nome, s.nome, s.luc || '', s.piso_oficial, s.categoria, s.grupo, s.tipo, s.status, s.area_est, String(s.fachada_est).replace('.', ',')].concat(CAMPOS.map(f => campoVal(s, f).replace(/[;\n]/g, ' '))).join(';')))).join('\n');
  h += `${(CFG.orientacoes || []).length ? `<h3>Como chegar à planta real</h3><ol>${CFG.orientacoes.map(o => `<li>${esc(o)}</li>`).join('')}</ol>` : ''}
    <h3>Base completa</h3><button class="btn" id="btCopy">Copiar base em CSV</button><textarea id="csv" readonly aria-label="Base em CSV">${esc(csv)}</textarea>`;
  $('#pane-ficha').innerHTML = h;
  $('#btCopy').onclick = async () => { const b = $('#btCopy'); try { await navigator.clipboard.writeText(csv); b.textContent = 'Copiado. Cole no Excel'; } catch (e) { $('#csv').select(); b.textContent = 'Selecionado. Use Ctrl+C'; } };
}
function showTab(t) {
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
  ['resumo', 'pb', 'lojas', 'mix', 'cmp', 'ficha'].forEach(k => { $('#pane-' + k).hidden = k !== t; });
  if (t === 'mix') renderMix(); if (t === 'cmp') renderCmp(); if (t === 'resumo') renderResumo(); if (t === 'pb') renderPB();
}
$('.tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) showTab(b.dataset.tab); });

/* ================= ferramentas e tour ================= */
const HINTS = {'3d':'Arraste para girar · roda ou botões + e − para zoom · botão direito move a vista · clique numa loja para destacar', '2d':'Arraste para mover · roda ou botões + e − para zoom · clique numa loja para destacar', walk:'Clique no chão ou numa loja para ir até lá · arraste para olhar em volta'};
function syncButtons() {
  const cmp = st.mall === 'cmp', M = CM();
  $$('#levels button[data-lv]').forEach(b => b.setAttribute('aria-pressed', (b.dataset.lv || null) === st.level));
  $$('#viewSel button').forEach(b => { b.setAttribute('aria-pressed', b.dataset.view === st.view); if (b.dataset.view === 'walk') b.disabled = cmp || (M && M.empty); });
  $('#btTower').setAttribute('aria-pressed', st.tower); $('#btTower').hidden = !AM().some(m => m.tower);
  $('#btLabels').setAttribute('aria-pressed', st.labels); $('#btSeg').setAttribute('aria-pressed', st.seg); $('#btSeg').hidden = cmp;
  $('#btKiosk').setAttribute('aria-pressed', st.tipo === 'Quiosque'); $('#selTipo').value = st.tipo; $('#btTour').setAttribute('aria-pressed', st.tour); $('#btTour').hidden = cmp || st.view !== '3d';
  $('#btTour').textContent = st.tour ? 'Parar tour' : 'Tour pelos pisos'; $('#btCtx').setAttribute('aria-pressed', st.ctx); $('#btCtx').hidden = cmp; $('#zoom').hidden = st.view === 'walk';
  $('#walk').hidden = st.view !== 'walk'; $('#hint').textContent = HINTS[st.view];
  document.querySelector('label[for=rgExp]').hidden = st.view === '2d';
}
$('#btTower').onclick = () => { st.tower = !st.tower; syncButtons(); poke(); };
$('#btCtx').onclick = () => { st.ctx = !st.ctx; refresh(); };
$('#btMore').onclick = () => { const m = $('#more'); m.hidden = !m.hidden; $('#btMore').setAttribute('aria-expanded', !m.hidden); measureUI(); poke(); };
$('#zIn').onclick = () => { stopTour(); goal.r = Math.max(40, goal.r * .76); poke(); };
$('#zOut').onclick = () => { stopTour(); goal.r = Math.min(1800, goal.r / .76); poke(); };
$('#btLabels').onclick = () => { st.labels = !st.labels; refresh(); };
$('#btSeg').onclick = () => { st.seg = !st.seg; refresh(); };
$('#btKiosk').onclick = () => { st.tipo = st.tipo === 'Quiosque' ? '' : 'Quiosque'; refresh(); };
$('#rgExp').oninput = e => { poke(); st.exp = +e.target.value; layout(); if (st.view === '3d') goal.t.y = (st.level ? CM().LV.indexOf(st.level) : st.sel ? AM()[0].LV.indexOf(st.sel.nivel) : (AM()[0].LV.length - 1) * .42) * st.exp; };
$('#wkGo').onclick = () => walkGo(4); $('#wkBack').onclick = () => walkGo(-4); $('#wkLeft').onclick = () => walkTurn(.6); $('#wkRight').onclick = () => walkTurn(-.6);
$('#wkUp').onclick = () => stepLevel(1); $('#wkDown').onclick = () => stepLevel(-1);
let TOUR = [], tourI = 0, tourT = 0;
function tourStep() {
  const M = CM(), id = TOUR[tourI], cap = $('#caption');
  focusLevel(id || null); goal.th += .9;
  if (id) { const n = M.D.niveis.find(x => x.id === id), L = M.S.filter(s => s.nivel === id), top = [...L].sort((a, b) => b.area_est - a.area_est).slice(0, 4).map(s => s.nome.replace(/\s*\(.*\)/, ''));
    cap.innerHTML = `<b>${esc(n.nome)}</b><span>${L.length} operações · ${esc(n.uso || '')}<br>Destaques: ${esc(top.join(', '))}</span>`; }
  else cap.innerHTML = `<b>${esc(M.nome)} · visão geral</b><span>${esc(fmtVal(fv(M, 'abl_m2'), 'm²'))} de ABL · ${M.S.length} operações na base, ${M.S.filter(s => s.tipo === 'Quiosque').length} quiosques</span>`;
  cap.hidden = false;
  tourT = setTimeout(() => { tourI++; if (tourI >= TOUR.length) stopTour(); else tourStep(); }, 5200);
}
function stopTour() { if (!st.tour) return; st.tour = false; clearTimeout(tourT); $('#caption').hidden = true; syncButtons(); }
$('#btTour').onclick = () => { if (st.tour) { stopTour(); return; } const M = CM(); if (!M || M.empty) return; st.tour = true; tourI = 0; st.sel = null; renderDetail(); TOUR = [''].concat(M.LV.filter(id => M.groups[id].userData.n >= 5), ['']); tourStep(); };

/* ================= resumo para o comitê ================= */
const PRESETS = {k:'Quiosques', novo:'Novidades', anc:'Âncoras e megalojas', food:'Alimentação', amp:'Lojas ampliadas', lst:'Varejistas listadas', pro:'Alvos de prospecção'};
const presetOn = p => p === 'k' ? st.tipo === 'Quiosque' : p === 'food' ? st.grupos.size === 1 && st.grupos.has(G_FOOD) : st.preset === p;
function clearFilters() { st.q = ''; $('#q').value = ''; st.tipo = ''; st.preset = null; st.ciaSel = null; st.grupos = new Set(GRUPOS); refresh(); }
function applyPreset(p) {          // destaca um tema na maquete, na visão geral de todos os pisos
  stopTour(); const on = presetOn(p);
  st.q = ''; $('#q').value = ''; st.tipo = ''; st.preset = null; st.ciaSel = null; st.grupos = new Set(GRUPOS);
  if (!on) { if (p === 'k') st.tipo = 'Quiosque'; else if (p === 'food') st.grupos = new Set([G_FOOD]); else st.preset = p; }
  if (st.sel) { st.sel = null; renderDetail(); }
  if (st.view !== 'walk') { st.level = null; layout(); frameView(); }
  refresh();
}
$('#btClear').onclick = clearFilters;
const pct = v => Math.round(v * 100) + '%', lista = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1] : a.join('');
function resumoData(M) {
  const S = M.S, tot = S.reduce((a, s) => a + s.area_est, 0) || 1, K = S.filter(s => s.tipo === 'Quiosque'), big = S.filter(s => s.tipo === 'Âncora' || s.tipo === 'Megaloja'),
    novo = S.filter(s => s.status !== 'Em operação'), food = S.filter(s => s.grupo === G_FOOD), amp = S.filter(s => s.n_luc > 1);
  const grp = GRUPOS.map(g => { const L = S.filter(s => s.grupo === g); return {g, n:L.length, a:L.reduce((a, s) => a + s.area_est, 0)}; }).filter(x => x.n);
  const porArea = [...grp].sort((a, b) => b.a - a.a), porN = [...grp].sort((a, b) => b.n - a.n);
  const kg = GRUPOS.map(g => ({g, n:K.filter(s => s.grupo === g).length})).filter(x => x.n).sort((a, b) => b.n - a.n);
  const conta = (L, id) => L.filter(s => s.nivel === id).length, lvTop = L => M.LV.map(id => ({id, n:conta(L, id)})).sort((a, b) => b.n - a.n)[0];
  const marcas = L => { const m = new Map(); L.forEach(s => { const k = shortName(s); (m.get(k) || m.set(k, []).get(k)).push(s.nivel); }); return [...m.entries()]; };
  const dup = marcas(S).filter(x => x[1].length > 1).map(x => x[0]);
  const pisos = M.D.niveis.map(n => { const L = S.filter(s => s.nivel === n.id); if (!L.length) return null; const a = L.reduce((x, s) => x + s.area_est, 0), g = {}; L.forEach(s => { g[s.grupo] = (g[s.grupo] || 0) + s.area_est; });
    const top = Object.entries(g).sort((x, y) => y[1] - x[1])[0]; return {id:n.id, nome:n.nome, uso:n.uso, n:L.length, k:L.filter(s => s.tipo === 'Quiosque').length, a, top:top[0], share:top[1] / a}; }).filter(Boolean);
  return {S, tot, K, big, novo, food, amp, porArea, porN, kg, lvTop, marcas, dup, pisos, bigA:big.reduce((a, s) => a + s.area_est, 0)};
}
function resumoTexto(M) {           // leituras em frases, usadas na aba e no botão de copiar
  const R = resumoData(M), fq = fv(M, 'quiosques'), fa = fv(M, 'ancoras'), fm = fv(M, 'megalojas'), t = [], nome = s => shortName(s);
  if (R.porArea.length > 1) t.push(['Mix', `As duas maiores fatias da área estimada são ${R.porArea[0].g} (${pct(R.porArea[0].a / R.tot)}) e ${R.porArea[1].g} (${pct(R.porArea[1].a / R.tot)}). Em número de operações, lidera ${R.porN[0].g} (${R.porN[0].n}), seguida de ${R.porN[1].g} (${R.porN[1].n}).`, null]);
  else if (R.porArea.length) t.push(['Mix', `Toda a área estimada está em ${R.porArea[0].g}, com ${R.porArea[0].n} operações.`, null]);
  if (R.K.length) { const kl = R.lvTop(R.K); t.push(['Quiosques', `${R.K.length} quiosques na base${fq && fq !== R.K.length ? ' (a ficha oficial informa ' + fq + ')' : ''}, ${pct(R.K.length / R.S.length)} das operações. ${R.kg[0].g} responde por ${R.kg[0].n} deles (${pct(R.kg[0].n / R.K.length)}). O piso com mais quiosques é o ${kl.id}, com ${kl.n}.`, 'k']); }
  if (R.novo.length) t.push(['Novidades', `${R.novo.length} operações anunciadas ou em obra: ${lista(R.novo.map(nome))}.`, 'novo']);
  if (R.big.length) t.push(['Âncoras e megalojas', `${R.marcas(R.big).length} marcas em ${R.big.length} blocos${fa != null || fm != null ? ' identificados na lista (a ficha oficial informa ' + fmtVal(fa) + ' âncoras e ' + fmtVal(fm) + ' megalojas)' : ''}, ${pct(R.bigA / R.tot)} da área estimada: ${lista(R.marcas(R.big).map(x => x[0] + ' (' + [...new Set(x[1])].join(' e ') + ')'))}.`, 'anc']);
  if (R.food.length) { const fl = R.lvTop(R.food); t.push(['Alimentação', `${R.food.length} operações, das quais ${R.food.filter(s => s.tipo === 'Restaurante').length} restaurantes e ${R.food.filter(s => s.tipo === 'Quiosque').length} quiosques. A maior concentração está no ${fl.id}, com ${fl.n}.`, 'food']); }
  if (R.amp.length) t.push(['Lojas ampliadas', `${R.amp.length} operações ocupam duas ou mais unidades vizinhas unidas, segundo o código de localização.`, 'amp']);
  const lst = M.S.filter(s => s.cia); if (lst.length) { const por = new Map(); lst.forEach(s => por.set(s.cia.c, (por.get(s.cia.c) || 0) + 1)); const top = [...por.entries()].sort((a, b) => b[1] - a[1]);
    t.push(['Varejistas listadas', `${lst.length} operações (${pct(lst.length / M.S.length)}) são de ${top.length} empresas listadas em bolsa. As com mais operações: ${lista(top.slice(0, 5).map(x => x[0].empresa + ' (' + x[1] + ')'))}.`, 'lst']); }
  const vr = vendaRef(M); if (vr) t.push(['Vendas', `${vr.vendas != null ? fmtR(vr.vendas) + ' em vendas dos lojistas em ' + vr.periodo : 'Sem venda total em ' + vr.periodo}${vr.m2 != null ? '; dividido pela ABL total, R$ ' + nf(Math.round(vr.m2)) + ' por m² ao mês' : ''}${vr.m2_pub != null ? '; a empresa publica R$ ' + nf(Math.round(vr.m2_pub)) + ' por m² ao mês, na base dela' : ''}. Fonte: ${M.D.vendas_empresa || 'empresa listada'}.`, null]);
  const cx = M.D.conexoes || []; if (cx.length) t.push(['Torres, metrô e conexões', lista(cx.map(c => c.nome + ' (' + (c.tipo || 'conexão') + ', acesso ' + (c.acesso || 'a confirmar') + ')')) + '.', null]);
  if (R.dup.length) t.push(['Marcas com duas operações', `${lista(R.dup)}.`, null]);
  return {R, t};
}
function renderResumo() {
  const el = $('#pane-resumo'); if (el.hidden) return; const M = CM() || CB, D = M.D, quando = D.importada ? 'importada em ' + D.importada : D.coleta ? 'coletada em ' + D.coleta : 'data de coleta ' + FALTA, nota = D.resumo_nota || (D.importada ? 'Nome, piso e categoria vêm da relação importada. A posição de cada loja dentro do piso é esquemática; áreas não informadas usam a referência por tipo de operação.' : 'A posição de cada loja dentro do piso é esquemática e as áreas são estimativas.'), origem = `Leitura da lista do ${M.nome} (${D.importada ? 'relação importada' : D.origem_lista || 'origem ' + FALTA}), ${quando}.`;
  if (!M.S.length) { el.innerHTML = '<p class="count">Sem lista de lojas para resumir.</p>'; return; }
  const {R, t} = resumoTexto(M), n = {k:R.K.length, novo:R.novo.length, anc:R.big.length, food:R.food.length, amp:R.amp.length, lst:M.S.filter(s => s.cia).length, pro:pbOn(M) ? M.S.filter(s => pbOf(M, s.key).s === 'pro').length : 0};
  el.innerHTML = `<p class="count">${esc(origem + ' ' + nota)}</p>
    <div class="big4"><div><b>${R.S.length}</b><span>operações na base</span></div><div><b style="color:var(--kiosk)">${R.K.length}</b><span>quiosques · ${pct(R.K.length / R.S.length)} das operações</span></div>
      <div><b>${R.big.length}</b><span>âncoras e megalojas · ${pct(R.bigA / R.tot)} da área</span></div><div><b>${R.novo.length}</b><span>novidades anunciadas ou em obra</span></div></div>
    <h3>Destacar na maquete</h3><div class="pre">${Object.keys(PRESETS).filter(p => n[p]).map(p => `<button data-preset="${p}" aria-pressed="${presetOn(p)}">${PRESETS[p]} · ${n[p]}</button>`).join('')}</div>
    <h3>Leituras para o comitê</h3><div>${t.map(x => `<div class="ins"><b>${esc(x[0])}</b><p>${esc(x[1])}</p>${x[2] ? `<button data-preset="${x[2]}">${presetOn(x[2]) ? 'Tirar o destaque' : 'Ver na maquete'}</button>` : ''}</div>`).join('')}</div>
    <h3>Perfil por piso</h3><ul class="list">${[...R.pisos].reverse().map(p => `<li><button class="fl" data-lv="${p.id}"><span class="id">${p.id}</span><span class="nm">${esc(p.uso || p.nome)}${p.n >= 5 ? `<small>Vocação: ${esc(p.top)} (${pct(p.share)} da área do piso)</small>` : ''}</span><span class="mt">${p.n} ops<br>${p.k} quiosq.</span></button></li>`).join('')}</ul>
    ${R.novo.length ? `<h3>Novidades anunciadas ou em obra</h3><ul class="list">${R.novo.map(s => li(s)).join('')}</ul>` : ''}
    <h3>Levar para a ata</h3><button class="btn" id="btCopyR">Copiar resumo em texto</button><textarea id="txtR" readonly aria-label="Resumo em texto">${esc(origem + '\n' + t.map(x => '- ' + x[0] + ': ' + x[1]).join('\n') + '\n' + nota)}</textarea>`;
  $('#btCopyR').onclick = async () => { const b = $('#btCopyR'), v = $('#txtR').value; try { await navigator.clipboard.writeText(v); b.textContent = 'Copiado'; } catch (e) { $('#txtR').select(); b.textContent = 'Selecionado. Use Ctrl+C'; } };
}
$('#pane-resumo').addEventListener('click', e => {
  const p = e.target.closest('button[data-preset]'); if (p) { applyPreset(p.dataset.preset); return; }
  const f = e.target.closest('button[data-lv]'); if (f) { stopTour(); focusLevel(f.dataset.lv); return; }
  const s = pickLi(e); if (s) select(s);
});
if (document.documentElement.requestFullscreen) { $('#btFull').onclick = () => { const d = document; if (d.fullscreenElement) d.exitFullscreen(); else d.documentElement.requestFullscreen().catch(() => { $('#btFull').hidden = true; }); };
  document.addEventListener('fullscreenchange', () => { $('#btFull').setAttribute('aria-pressed', !!document.fullscreenElement); }); } else $('#btFull').hidden = true;

/* ================= quadro de prospecção ================= */
/* Decisão do comitê por marca, um quadro por shopping que não é o meu. Fica no espaço privado de quem está vendo
   (data/users/<id>/quadro-<shopping>), com cópia no navegador. */
const PBS = {}, PBU = {dec:'', f:'todos', q:''}, PBX = {db:null, uid:null};
const DEC = {tem:'Temos', pro:'Prospectar', nao:'Não'}, DEC_LONG = {tem:'Já temos', pro:'Prospectar', nao:'Sem interesse'};
function pbS(M) {
  let P = PBS[M.key]; if (P) return P;
  P = PBS[M.key] = {M, key:'pb-' + M.key, data:{}, doc:null, sync:'local', saving:false, dirty:false, timer:0, brands:null};
  try { const j = JSON.parse(localStorage.getItem(P.key) || '{}'); if (j && typeof j === 'object') P.data = j; } catch (e) {}
  return P;
}
const pbOf = (M, k) => pbS(M).data[k] || {s:'', n:''};
const pbSave = P => { try { localStorage.setItem(P.key, JSON.stringify(P.data)); } catch (e) {} };
function pbBrands(M) {
  const P = pbS(M); if (P.brands) return P.brands; const m = new Map();
  M.S.forEach(s => { let b = m.get(s.key); if (!b) m.set(s.key, b = {key:s.key, nome:shortName(s).replace(/\s+-\s+.*$/, ''), st:[]}); b.st.push(s); });
  P.brands = [...m.values()].map(b => Object.assign(b, {k:b.st.some(s => s.tipo === 'Quiosque'), novo:b.st.some(s => s.status !== 'Em operação'), anc:b.st.some(s => s.tipo === 'Âncora' || s.tipo === 'Megaloja'), area:b.st.reduce((a, s) => a + s.area_est, 0)}))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt')); P.brands.forEach((b, i) => { b.i = i; }); return P.brands;
}
const decHtml = (M, key) => `<span class="dec" data-m="${M.key}" data-k="${esc(key)}">${Object.keys(DEC).map(d => `<button data-d="${d}" title="${DEC_LONG[d]}" aria-pressed="${pbOf(M, key).s === d}">${DEC[d]}</button>`).join('')}</span>`;
function pbFlush(P) {
  if (!P.doc || P.saving) return; P.saving = true; P.dirty = false;
  P.doc.set({v:1, marks:JSON.parse(JSON.stringify(P.data))}).then(() => { P.saving = false; if (P.dirty) pbFlush(P); }, e => { P.saving = false; if (e && e.code === 'invalid_argument') { P.doc = null; P.sync = 'local'; pbStatus(); } });
}
function pbPush(P) { P.dirty = true; clearTimeout(P.timer); P.timer = setTimeout(() => pbFlush(P), 800); }
function pbSet(M, key, patch) {       // uma decisão ou observação mudou
  const P = pbS(M), cur = pbOf(M, key); P.data[key] = {s:patch.s != null ? patch.s : cur.s || '', n:patch.n != null ? patch.n : cur.n || '', t:Date.now()};
  pbSave(P); if (P.doc) pbPush(P);
}
function pbPull(P, remote, meta) {    // junta o que veio da conta com o que está neste navegador; vale a marcação mais recente
  const R = remote && typeof remote === 'object' ? remote : {}; let got = false, ahead = false;
  Object.keys(R).forEach(k => { const r = R[k] || {}, l = P.data[k]; if (!l || (r.t || 0) > (l.t || 0)) { P.data[k] = {s:String(r.s || ''), n:String(r.n || ''), t:r.t || 0}; got = true; } });
  Object.keys(P.data).forEach(k => { if (!R[k] || (P.data[k].t || 0) > (R[k].t || 0)) ahead = true; });
  if (got) { pbSave(P); if (P.M === pbM()) pbRedraw(); }
  if (ahead && !meta.fromCache && !meta.hasPendingWrites && !P.saving) pbPush(P);
}
function pbLink(M) {                  // liga o quadro de um shopping à conta de quem está vendo
  const P = pbS(M); if (!PBX.db || P.doc) return;
  P.doc = PBX.db.doc('data/users/' + PBX.uid + '/quadro-' + M.key); P.sync = 'ligando'; pbStatus();
  const tm = setTimeout(() => { if (P.sync === 'ligando') { P.sync = 'espera'; pbStatus(); } }, 10000);
  P.doc.onSnapshot(snap => { const d = snap.exists ? snap.data() : null; if (!snap.metadata.fromCache) { clearTimeout(tm); P.sync = 'conta'; pbStatus(); } pbPull(P, d && d.marks, snap.metadata); },
    () => { clearTimeout(tm); P.doc = null; P.sync = 'local'; pbStatus(); });
}
async function pbInit() {
  if (!window.claude || !window.claude.use) return;
  try {
    const db = await window.claude.use('db'), user = await window.claude.use('user'); if (!db || !user) return;
    const uid = await user.id(); if (!uid) return;
    PBX.db = db; PBX.uid = uid; ALL.filter(pbOn).forEach(pbLink);
  } catch (e) {}
}
const PB_MSG = {local:'As marcações ficam salvas neste navegador.', ligando:'Conectando à sua conta…', conta:'Salvo na sua conta. Só você vê estas marcações.', espera:'A conta ainda não respondeu. As marcações ficam neste navegador e sobem quando ela responder.'};
function pbStatus() { const el = $('#pbSt'), M = pbM(); if (el && M) el.textContent = PB_MSG[pbS(M).sync]; }
function pbCounts(M) { const B = pbBrands(M), c = {pro:0, tem:0, nao:0}; B.forEach(b => { const d = pbOf(M, b.key).s; if (c[d] != null) c[d]++; }); c.none = B.length - c.pro - c.tem - c.nao; return c; }
function pbRow(M, b) {
  const o = pbOf(M, b.key), niv = [...new Set(b.st.map(s => s.nivel))].join('/'), tp = [...new Set(b.st.map(s => s.tipo))].join(' e ');
  return `<li data-b="${b.i}"><div class="pbh"><button class="pbn" data-go="${b.st[0].i}" title="Ver na maquete">${esc(b.nome)}<small>${esc(tp)} · ${esc(niv)} · ${esc(b.st[0].categoria)}${b.novo ? ' · novidade' : ''}</small></button>${decHtml(M, b.key)}</div>
    ${o.s || o.n ? `<input class="obs" id="obs-${b.i}" data-obs="${b.i}" placeholder="Observação (contato, formato, prazo)" value="${esc(o.n || '')}" aria-label="Observação sobre ${esc(b.nome)}">` : ''}</li>`;
}
function pbList(M) {
  const q = deacc(PBU.q).toLowerCase();
  return pbBrands(M).filter(b => (PBU.f === 'todos' || b[PBU.f]) && (!PBU.dec || (PBU.dec === 'none' ? !pbOf(M, b.key).s : pbOf(M, b.key).s === PBU.dec)) && (!q || deacc(b.nome + ' ' + b.st[0].categoria).toLowerCase().includes(q)));
}
function pbCsv(M) {
  return [`Marca;Segmento;Formato no ${M.nome};Piso no ${M.nome};Area estimada m2;Decisao;Observacao`].concat(pbBrands(M).filter(b => pbOf(M, b.key).s).map(b => { const o = pbOf(M, b.key);
    return [b.nome, b.st[0].categoria, [...new Set(b.st.map(s => s.tipo))].join(' e '), [...new Set(b.st.map(s => s.nivel))].join('/'), b.area, DEC_LONG[o.s], (o.n || '').replace(/[;\n]/g, ' ')].join(';'); })).join('\n');
}
function pbImport(M, text) {          // lê o CSV de "Copiar decisões" (deste painel ou de uma versão anterior) e aplica às marcas deste shopping
  const lines = String(text).split(/\r?\n/).map(l => l.trim()).filter(Boolean); if (!lines.length) return 'A caixa está vazia.';
  const hd = lines[0].split(';').map(c => deacc(c).toLowerCase().trim()), has = hd.includes('marca');
  const im = has ? hd.indexOf('marca') : 0, id = has ? hd.findIndex(c => /decis/.test(c)) : 5, io = has ? hd.findIndex(c => /observ/.test(c)) : 6;
  if (id < 0) return 'Não achei a coluna Decisao no cabeçalho.';
  const B = pbBrands(M); let ok = 0; const fora = [];
  lines.slice(has ? 1 : 0).forEach(l => { const c = l.split(';'), nome = (c[im] || '').trim(), d = deacc(c[id] || '').toLowerCase(), s = /prospect/.test(d) ? 'pro' : /temos/.test(d) ? 'tem' : /interesse|^nao/.test(d) ? 'nao' : '';
    if (!nome || !s) return; const k = brandKey(nome), b = B.find(x => x.key === k) || B.find(x => sameBrand(x.key, k));
    if (b) { pbSet(M, b.key, {s, n:io >= 0 ? (c[io] || '').trim() : ''}); ok++; } else fora.push(nome); });
  pbRedraw();
  return ok + ' decisões aplicadas.' + (fora.length ? ' Sem marca correspondente neste shopping: ' + fora.join(', ') + '.' : '');
}
function renderPB() {
  const el = $('#pane-pb'); if (el.hidden) return; const M = pbM(); if (!M) { el.innerHTML = '<p class="count">O quadro de prospecção vale para os shoppings concorrentes.</p>'; return; }
  if (M.empty) { el.innerHTML = `<p class="count">Sem lista de lojas do ${esc(M.nome)} para prospectar.</p>`; return; }
  const c = pbCounts(M), L = pbList(M), card = (k, n, t) => `<button data-dec="${k}" aria-pressed="${PBU.dec === k}"><b>${n}</b><span>${t}</span></button>`;
  el.innerHTML = `<p class="count">Marque a decisão do comitê para cada marca do ${esc(M.nome)}. <span id="pbSt">${PB_MSG[pbS(M).sync]}</span></p>
    <div class="pbc" id="pbC">${card('pro', c.pro, 'prospectar')}${card('tem', c.tem, 'já temos')}${card('nao', c.nao, 'sem interesse')}${card('none', c.none, 'a avaliar')}</div>
    <div class="search"><input id="pbq" type="search" placeholder="Buscar marca ou categoria" aria-label="Buscar marca" value="${esc(PBU.q)}">
      <select id="pbf" aria-label="Recorte de marcas">${[['todos', 'Todas as marcas'], ['k', 'Com quiosque'], ['novo', 'Novidades'], ['anc', 'Âncoras e megalojas']].map(o => `<option value="${o[0]}"${PBU.f === o[0] ? ' selected' : ''}>${o[1]}</option>`).join('')}</select></div>
    <div class="row"><button class="btn" id="pbMap" aria-pressed="${st.preset === 'pro'}">${st.preset === 'pro' ? 'Tirar alvos da maquete' : 'Ver alvos na maquete'}</button><button class="btn" id="pbCopy">Copiar decisões em CSV</button></div>
    <p class="count" id="pbN">${L.length} marcas neste recorte. Clique no nome para ver a loja na maquete.</p>
    <ul class="pbl" id="pbL">${L.map(b => pbRow(M, b)).join('')}</ul><textarea id="pbTxt" readonly hidden aria-label="Decisões em CSV"></textarea>
    <details><summary>Trazer decisões de um CSV</summary><textarea id="pbImp" aria-label="Decisões em CSV para aplicar" placeholder="Marca;Segmento;Formato;Piso;Area estimada m2;Decisao;Observacao"></textarea>
      <div class="row"><button class="btn" id="pbImpBt">Aplicar decisões</button></div><p class="msg" id="pbImpMsg"></p>
      <p class="count">Cole aqui o texto do botão "Copiar decisões em CSV", deste painel ou de uma versão anterior. Vale a marcação colada.</p></details>`;
}
function pbRedraw() { renderPB(); if (!$('#pane-resumo').hidden) renderResumo(); if (st.sel) renderDetail(); if (st.preset === 'pro') refresh(); }
function pbClick(M, key, d, li) {      // marca ou desmarca uma decisão, sem redesenhar a lista inteira
  pbSet(M, key, {s:pbOf(M, key).s === d ? '' : d});
  if (li && $('#pbL') && !PBU.dec) { const b = pbBrands(M)[+li.dataset.b]; li.outerHTML = pbRow(M, b); const c = pbCounts(M); $$('#pbC button').forEach(x => { x.querySelector('b').textContent = c[x.dataset.dec]; }); } else renderPB();
  if (!$('#pane-resumo').hidden) renderResumo(); if (st.preset === 'pro') refresh();
}
$('#pane-pb').addEventListener('click', async e => {
  const M = pbM(); if (!M) return;
  const d = e.target.closest('.dec button'); if (d) { pbClick(M, d.parentNode.dataset.k, d.dataset.d, d.closest('li')); if (st.sel) renderDetail(); return; }
  const g = e.target.closest('button[data-go]'); if (g) { select(M.S[+g.dataset.go]); showTab('pb'); return; }
  const c = e.target.closest('button[data-dec]'); if (c) { PBU.dec = PBU.dec === c.dataset.dec ? '' : c.dataset.dec; renderPB(); return; }
  if (e.target.id === 'pbMap') { applyPreset('pro'); return; }
  if (e.target.id === 'pbImpBt') { const msg = pbImport(M, $('#pbImp').value); const m = $('#pbImpMsg'); if (m) m.textContent = msg; const dt = m && m.closest('details'); if (dt) dt.open = true; return; }
  if (e.target.id === 'pbCopy') { const b = e.target, v = pbCsv(M); try { await navigator.clipboard.writeText(v); b.textContent = 'Copiado. Cole no Excel'; } catch (x) { const t = $('#pbTxt'); t.hidden = false; t.value = v; t.select(); b.textContent = 'Selecionado. Use Ctrl+C'; } }
});
$('#pane-pb').addEventListener('change', e => { const M = pbM(); if (!M) return; const o = e.target.closest('input[data-obs]'); if (o) { pbSet(M, pbBrands(M)[+o.dataset.obs].key, {n:o.value.trim()}); return; } if (e.target.id === 'pbf') { PBU.f = e.target.value; renderPB(); } });
$('#pane-pb').addEventListener('input', e => { if (e.target.id !== 'pbq') return; const M = pbM(); PBU.q = e.target.value; const L = pbList(M); $('#pbL').innerHTML = L.map(b => pbRow(M, b)).join(''); $('#pbN').textContent = L.length + ' marcas neste recorte. Clique no nome para ver a loja na maquete.'; });
$('#detail').addEventListener('click', e => { const d = e.target.closest('.dec button'); if (!d) return; const M = MALLS[d.parentNode.dataset.m], k = d.parentNode.dataset.k; pbSet(M, k, {s:pbOf(M, k).s === d.dataset.d ? '' : d.dataset.d}); renderDetail(); pbRedraw(); });
pbInit();

/* ================= etiquetas sobre a cena (sem sobreposição) ================= */
let uiRects = [], roofA = -1, frameN = 0;
const F_L = `500 12px ${LBF}`, F_M = '500 10px "IBM Plex Mono",ui-monospace,monospace', F_U = '400 11px "IBM Plex Sans",system-ui,sans-serif';
const OFFS = [[0, -22], [0, -40], [0, -58], [1, 0], [-1, 0], [0, -78], [0, 20]], live = new Set();
function measureUI() {
  const r0 = stage.getBoundingClientRect(); uiRects = [];
  ['#levels', '.tools', '#more', '#walk', '#zoom', '#caption', '#empty'].forEach(sel => { const el = $(sel); if (!el || el.hidden) return; const r = el.getBoundingClientRect(); if (r.width) uiRects.push([r.left - r0.left, r.top - r0.top, r.width, r.height]); });
  uiRects.push([0, SH - 26, SW, 26]);
  if (st.view === 'walk') { const S = Math.min(150, SW * .32); uiRects.push([12, SH - S - 40, S, S]); }
}
function scr(v) { v.applyMatrix4(camera.matrixWorldInverse); if (v.z > -.6) return null; const d = -v.z; v.applyMatrix4(camera.projectionMatrix); return [(v.x + 1) / 2 * SW, (1 - v.y) / 2 * SH, d]; }
function occluded(M, nivel, P) {  // o ponto P (mundo) está atrás de uma laje de piso acima?
  const li = M.LV.indexOf(nivel), c = camera.position;
  for (let j = li + 1; j < M.LV.length; j++) { const g = M.groups[M.LV[j]], ud = g.userData; if (!ud.occ || !ud.show) continue;
    const t = (g.position.y - c.y) / (P.y - c.y); if (!(t > 0 && t < 1)) continue;
    const x = c.x + (P.x - c.x) * t - M.root.position.x - M.inner.position.x - g.position.x, y = -(c.z + (P.z - c.z) * t - M.root.position.z - M.inner.position.z - g.position.z);
    if (inPoly(M.D.contorno, x, y) && !(ud.hole && inPoly(M.D.atrio, x, y))) return true; }
  return false;
}
function lblText(o) {
  if (o.acc) return;
  const chip = st.mall === 'cmp' ? o.M.curto.slice(0, 3) + ' ' + o.nivel : (!st.level && st.view !== 'walk' ? o.nivel : '');
  if (o._chip !== chip || !o.lt) { o._chip = chip; o.chip = chip; o.lt = shortName(o).toUpperCase(); o.lw = null; }
}
function measure(o) { if (o.lw == null) { ox.font = F_L; o.lw = Math.ceil(ox.measureText(o.lt).width); ox.font = F_M; o.chw = o.chip ? Math.ceil(ox.measureText(o.chip).width) + 7 : 0; o.cw = o.chw + (o.acc || o.tipo === 'Quiosque' ? 11 : 0); } return o.lw + o.cw + 14; }
function rr(x, y, w, h, r) { ox.beginPath(); ox.moveTo(x + r, y); ox.lineTo(x + w - r, y); ox.quadraticCurveTo(x + w, y, x + w, y + r); ox.lineTo(x + w, y + h - r); ox.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ox.lineTo(x + r, y + h); ox.quadraticCurveTo(x, y + h, x, y + h - r); ox.lineTo(x, y + r); ox.quadraticCurveTo(x, y, x + r, y); ox.closePath(); }
function drawLabel(o) {             // etiqueta discreta: fundo escuro, texto claro; a cor fica só num ponto
  const w = o.lw + o.cw + 14, h = 18, x = Math.round(o.lx), y = Math.round(o.ly), sel = o === st.sel, kio = o.tipo === 'Quiosque';
  const col = o.acc ? o.col : kio ? (st.mall === 'cmp' ? (o.cmp === 'both' ? BOTH : o.M === CA ? MINE : OPP) : KHEX) : '#9cc3e6';
  ox.globalAlpha = o.la;
  const lx = Math.max(x + 3, Math.min(x + w - 3, o.px)), ly = o.py < y ? y : o.py > y + h ? y + h : o.py;
  ox.strokeStyle = 'rgba(232,238,246,.4)'; ox.lineWidth = 1; ox.beginPath(); ox.moveTo(o.px, o.py); ox.lineTo(lx, ly); ox.stroke();
  ox.fillStyle = sel ? '#ffffff' : col; ox.beginPath(); ox.arc(o.px, o.py, 2.5, 0, 2 * Math.PI); ox.fill();
  rr(x, y, w, h, 3); ox.fillStyle = sel ? 'rgba(240,244,250,.97)' : 'rgba(11,17,27,.84)'; ox.fill();
  let tx = x + 7;
  if (o.acc || kio) { ox.fillStyle = col; ox.beginPath(); ox.arc(tx + 3, y + h / 2, 3, 0, 2 * Math.PI); ox.fill(); tx += 11; }
  if (o.chw) { ox.fillStyle = sel ? '#4a5d75' : '#8696ab'; ox.font = F_M; ox.fillText(o.chip, tx, y + h / 2 + .5); tx += o.chw; }
  ox.fillStyle = sel ? '#0b111b' : '#e8eef6'; ox.font = F_L; ox.fillText(o.lt, tx, y + h / 2 + 1);
  ox.globalAlpha = 1;
  if (!o.acc && o.la > .5) labelHits.push({x, y, w, h, o});
}
function levelTags(rects, hit) {
  AM().forEach(M => M.LV.forEach(id => {
    const g = M.groups[id], ud = g.userData, T = ud.tag; if (!ud.show || !T || !T.chip) return;
    const on = !st.level || st.level === id, two = st.view === '2d'; let ax = -1e9, ay = 0;
    if (two) { V.set(M.cx, 0, -M.top).applyMatrix4(g.matrixWorld); const p = scr(V); if (!p) return; ax = p[0]; ay = p[1]; }
    else { const C = M.D.contorno; for (let i = 0; i < C.length; i += 2) { V.set(C[i][0], 0, -C[i][1]).applyMatrix4(g.matrixWorld); const p = scr(V); if (p && p[0] > ax) { ax = p[0]; ay = p[1]; } } if (ax < -1e8) return; }
    if (!T.w) { ox.font = F_M; T.cw = Math.ceil(ox.measureText(T.chip).width) + 10; ox.font = F_L; T.tw = T.lt ? Math.ceil(ox.measureText(T.lt).width) + 12 : 0; T.w = T.cw + T.tw; }
    const w = T.w, h = 18; let x = two ? ax - w / 2 : ax + 12, y = two ? ay - h - 8 : ay - h / 2;
    x = Math.max(4, Math.min(SW - w - 4, x)); if (y < 4 || y > SH - 30) return;
    let k = 0; while (hit(x, y, w, h) && k < 5) { y += h + 3; k++; } if (k === 5) return;
    rects.push([x, y, w, h]);
    const foc = st.level === id;
    ox.globalAlpha = on ? 1 : .5;
    if (!two) { ox.strokeStyle = 'rgba(156,195,230,.4)'; ox.lineWidth = 1; ox.beginPath(); ox.moveTo(ax, ay); ox.lineTo(x, y + h / 2); ox.stroke(); }
    rr(x, y, w, h, 3); ox.fillStyle = foc ? 'rgba(240,244,250,.97)' : 'rgba(11,17,27,.84)'; ox.fill();
    ox.fillStyle = foc ? '#0b111b' : '#9cc3e6'; ox.font = F_M; ox.fillText(T.chip, x + 6, y + h / 2 + .5);
    if (T.tw) { ox.fillStyle = foc ? '#0b111b' : '#e8eef6'; ox.font = F_L; ox.fillText(T.lt, x + T.cw + 3, y + h / 2 + 1); }
    if (foc && T.uso) { ox.font = F_U; const uw = Math.ceil(ox.measureText(T.uso).width), ux = Math.max(4, Math.min(SW - uw - 6, two ? ax - uw / 2 : x)), uy = two ? y - 20 : y + h + 5;
      if (!hit(ux, uy, uw, 14)) { ox.fillStyle = '#8696ab'; ox.fillText(T.uso, ux, uy + 7); rects.push([ux, uy, uw, 14]); } }
    ox.globalAlpha = 1;
    labelHits.push({x, y, w, h, o:{lvTag:true, id, M}});
  }));
}
function mallTags(rects) {         // na comparação em 3D: uma etiqueta por shopping
  AM().forEach(M => { const g = M.groups[M.LV[M.LV.length - 1]]; V.set(M.cx, 14, -M.cy).applyMatrix4(g.matrixWorld); const p = scr(V); if (!p) return;
    const k = M.S.filter(s => s.tipo === 'Quiosque').length, t = M.nome.toUpperCase() + ' · ' + (M.empty ? 'SEM LISTA' : k + ' QUIOSQUES'), col = M === CA ? MINE : OPP;
    ox.font = F_L; const w = Math.ceil(ox.measureText(t).width) + 27, h = 20, x = Math.max(4, Math.min(SW - w - 4, p[0] - w / 2)), y = Math.max(50, p[1] - h);
    rr(x, y, w, h, 3); ox.fillStyle = 'rgba(11,17,27,.88)'; ox.fill(); ox.fillStyle = col; ox.beginPath(); ox.arc(x + 9, y + h / 2, 3.5, 0, 2 * Math.PI); ox.fill(); ox.fillStyle = '#e8eef6'; ox.fillText(t, x + 18, y + h / 2 + 1);
    rects.push([x, y, w, h]); labelHits.push({x, y, w, h, o:{mallTag:true, M}}); });
}
function compass() {
  if (SW < 430) return;
  const cx = SW - 34, cy = SH - 62, fx = st.view === 'walk' ? Math.sin(wk.yaw) : -Math.sin(cam.th), fz = st.view === 'walk' ? Math.cos(wk.yaw) : -Math.cos(cam.th), dx = -fx, dy = fz;
  ox.strokeStyle = 'rgba(156,195,230,.45)'; ox.lineWidth = 1; ox.beginPath(); ox.arc(cx, cy, 15, 0, 2 * Math.PI); ox.stroke();
  ox.fillStyle = '#9cc3e6'; ox.beginPath(); ox.moveTo(cx + dx * 13, cy + dy * 13); ox.lineTo(cx - dy * 4.5 - dx * 3, cy + dx * 4.5 - dy * 3); ox.lineTo(cx + dy * 4.5 - dx * 3, cy - dx * 4.5 - dy * 3); ox.fill();
  ox.font = F_M; ox.fillStyle = '#8696ab'; ox.textAlign = 'center'; ox.fillText('N', cx + dx * 24, cy + dy * 24 + .5); ox.textAlign = 'left';
}
function minimap() {              // planta do piso com a posição e a direção do passeio
  const M = CM(), S = Math.min(150, SW * .32), bx = 12, by = SH - S - 40, sc = (S - 16) / Math.max(M.w, M.h), mx = x => bx + S / 2 + (x - M.cx) * sc, my = y => by + S / 2 - (y - M.cy) * sc;
  ox.fillStyle = 'rgba(11,17,27,.88)'; ox.fillRect(bx, by, S, S); ox.strokeStyle = '#33486a'; ox.lineWidth = 1; ox.strokeRect(bx + .5, by + .5, S - 1, S - 1);
  const poly = (P, col) => { ox.strokeStyle = col; ox.beginPath(); P.forEach((p, i) => i ? ox.lineTo(mx(p[0]), my(p[1])) : ox.moveTo(mx(p[0]), my(p[1]))); ox.closePath(); ox.stroke(); };
  poly(M.D.contorno, '#9cc3e6'); poly(M.path, 'rgba(156,195,230,.4)');
  M.S.forEach(s => { if (s.nivel === st.level && s.tipo === 'Quiosque') { ox.fillStyle = KHEX; ox.fillRect(mx(s.ax) - 1.5, my(s.ay) - 1.5, 3, 3); } });
  if (st.level === M.gl) M.accs.forEach(a => { if (a.acc.t === 'principal' || a.acc.t === 'entrada') { ox.fillStyle = '#7fd6aa'; ox.fillRect(mx(a.acc.x) - 2, my(a.acc.y) - 2, 4, 4); } });
  if (st.sel && st.sel.M === M && st.sel.nivel === st.level) { ox.strokeStyle = '#ffffff'; ox.beginPath(); ox.arc(mx(st.sel.ax), my(st.sel.ay), 4.5, 0, 2 * Math.PI); ox.stroke(); }
  const p = pathAt(M, wk.u), px = mx(p[0]), py = my(p[1]), hx = Math.sin(wk.yaw), hy = -Math.cos(wk.yaw);
  ox.fillStyle = 'rgba(255,255,255,.22)'; ox.beginPath(); ox.moveTo(px, py); ox.arc(px, py, 22, Math.atan2(hy, hx) - .5, Math.atan2(hy, hx) + .5); ox.fill();
  ox.fillStyle = '#ffffff'; ox.beginPath(); ox.arc(px, py, 3.5, 0, 2 * Math.PI); ox.fill();
  ox.font = F_M; ox.fillStyle = '#8696ab'; ox.fillText(st.level + ' · você está aqui', bx + 6, by + 10);
}
function drawOverlay() {
  ox.setTransform(DPR, 0, 0, DPR, 0, 0); ox.clearRect(0, 0, SW, SH); ox.textBaseline = 'middle'; ox.textAlign = 'left'; labelHits = [];
  const rects = uiRects.slice(), walk = st.view === 'walk', cmp = st.mall === 'cmp';
  const hit = (x, y, w, h) => { if (x < 2 || y < 2 || x + w > SW - 2 || y + h > SH - 2) return true; for (let i = 0; i < rects.length; i++) { const r = rects[i]; if (x < r[0] + r[2] + 4 && x + w + 4 > r[0] && y < r[1] + r[3] + 3 && y + h + 3 > r[1]) return true; } return false; };
  if (cmp && st.view === '3d') mallTags(rects); else if (!walk) levelTags(rects, hit);
  const occl = st.view === '3d' && !st.level && !ghostAll(), maxN = walk ? 14 : st.level || st.view === '2d' || cmp || isFiltered() ? 60 : 14;
  let list;
  if (walk) { list = []; cand.forEach(c => { const o = c[0], par = o.acc ? o.parent : o.mesh && o.mesh.parent; if (!par) return; V.copy(o.c).applyMatrix4(par.matrixWorld); const dd = V.distanceTo(camera.position); list.push([o, o === st.sel ? 1e9 : -dd * (o.lv_ ? .8 : 1)]); }); list.sort((a, b) => b[1] - a[1]); }
  else list = cand.map(c => [c[0], c[1] * (c[0].lv_ ? 1.3 : 1)]).sort((a, b) => b[1] - a[1]);
  const seen = new Set(); let n = 0;
  for (let i = 0; i < list.length; i++) {
    const o = list[i][0], par = o.acc ? o.parent : o.mesh && o.mesh.parent; let ok = false; seen.add(o);
    if (n < maxN && par) {
      V.copy(o.c).applyMatrix4(par.matrixWorld); W3.copy(V); const p = scr(V), sel = o === st.sel;
      if (p && p[0] > 4 && p[0] < SW - 4 && p[1] > 4 && p[1] < SH - 4 && !(walk && p[2] > (sel ? 500 : 75)) && !(occl && !sel && occluded(o.M, o.acc ? o.M.gl : o.nivel, W3))) {
        lblText(o); const w = measure(o), h = 18, order = o.lo != null ? [o.lo, 0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6];
        for (let q = 0; q < order.length; q++) { const kk = order[q]; if (q > 0 && kk === o.lo) continue; const of = OFFS[kk]; let x, y;
          if (of[0]) { x = of[0] > 0 ? p[0] + 14 : p[0] - 14 - w; y = p[1] - h / 2 - 8; } else { x = p[0] - w / 2; y = of[1] < 0 ? p[1] + of[1] - h : p[1] + of[1]; }
          x = Math.max(4, Math.min(SW - w - 4, x));
          if (!hit(x, y, w, h)) { rects.push([x, y, w, h], [p[0] - 3, p[1] - 3, 6, 6]); o.lx = x; o.ly = y; o.px = p[0]; o.py = p[1]; o.lo = kk; ok = true; n++; break; } }
      }
    }
    o.lv_ = ok; if (ok) live.add(o);
  }
  live.forEach(o => {
    const target = seen.has(o) && o.lv_ ? 1 : 0; if (!target) o.lv_ = false;
    o.la = reduce ? target : o.la + (target - o.la) * .25;
    if (!target && o.la < .04) { live.delete(o); o.la = 0; return; }
    drawLabel(o);
  });
  compass(); if (walk) minimap();
}

/* ================= laço ================= */
function resize() {
  SW = Math.max(50, stage.clientWidth); SH = Math.max(50, stage.clientHeight); renderer.setSize(SW, SH, false); poke();
  ov.width = Math.round(SW * DPR); ov.height = Math.round(SH * DPR); camera.aspect = SW / SH; camera.updateProjectionMatrix(); measureUI();
}
selRing.material.depthTest = false; selRing.renderOrder = 6;
let last = performance.now(), slow = 0, frames = 0;
function tick(now) {
  const dt = Math.min(100, now - last), k = reduce ? 1 : .1, A = AM(); last = now;
  const camMov = st.view !== 'walk' && (Math.abs(goal.th - cam.th) + Math.abs(goal.ph - cam.ph) > 1e-3 || Math.abs(goal.r - cam.r) > .05 || cam.t.distanceToSquared(goal.t) > .01), wkMov = st.view === 'walk' && Math.abs(wk.gu - wk.u) > .01;
  if (camMov || wkMov || st.tour) wake = now + 900;
  if (now > wake) { requestAnimationFrame(tick); return; }
  frameN++;
  A.forEach(M => {
    M.root.position.lerp(M.rootT, reduce ? 1 : .12);
    M.LV.forEach(id => { const g = M.groups[id]; g.position.lerp(g.userData.tp, reduce ? 1 : .11); });
    const n = M.LV.length;
    if (M.tower) { M.tower.position.y = (n - 1) * st.exp + 7; M.tower.visible = st.tower && (st.view === 'walk' || (st.view === '3d' && !st.level)); }
    M.atr.visible = M.l0 >= 0 && st.view !== '2d' && (!st.level || /^L/.test(st.level)); if (M.l0 >= 0) { M.atr.scale.y = (M.l1 - M.l0) * st.exp + 8; M.atr.position.y = (M.l0 + M.l1) / 2 * st.exp + 2; }
    if (M.scanT < 1) { M.scanT = Math.min(1, M.scanT + (reduce ? 1 : .012)); M.scan.visible = M.scanT < 1 && st.view === '3d'; M.scan.position.y = (st.level ? (M.LV.indexOf(st.level) - .5 + M.scanT) : M.scanT * (n - .6)) * st.exp; M.scan.material.opacity = .16 * Math.sin(Math.PI * M.scanT); }
    if (st.view === 'walk' && st.level) { const y = M.groups[st.level].position.y; M.pathObj.position.y = y; M.floor.position.y = y + .04; M.floor.material.uniforms.uT.value = reduce ? 0 : now / 1000; }
  });
  scene.updateMatrixWorld();
  if (st.view === 'walk') placeWalk();
  else { cam.th += (goal.th - cam.th) * k; cam.ph += (goal.ph - cam.ph) * k; cam.r += (goal.r - cam.r) * k; cam.t.lerp(goal.t, k); if (st.tour) goal.th += .0016; placeCam(); }
  camera.updateMatrixWorld();
  const s = st.sel;
  if (s && s.mesh && s.mesh.parent) {
    V.copy(s.c).applyMatrix4(s.mesh.parent.matrixWorld); const pulse = .5, kc = s.tipo === 'Quiosque' ? C_K : C_WHITE, rad = Math.max(4, Math.sqrt(s.area_est) * .75) * (1 + .12 * pulse);
    selBeam.visible = st.view === '3d'; selBeam.position.set(V.x, V.y + 45, V.z); selBeam.material.color.copy(kc); selBeam.material.opacity = .3 + .3 * pulse;
    selRing.visible = st.view !== 'walk'; selRing.position.set(V.x, V.y - s.h + .4, V.z); selRing.scale.set(rad, 1, rad); selRing.material.color.copy(kc); selRing.material.opacity = .5 + .45 * pulse;
  } else selBeam.visible = selRing.visible = false;
  const ra = st.view === 'walk' ? 0 : st.level || st.view === '2d' ? 1 : Math.max(0, Math.min(1, (380 - cam.r) / 110));
  if (roofA < 0 || Math.abs(ra - roofA) > .02) { roofA = ra; A.forEach(M => M.roofs.forEach(r => { r.visible = r.userData.on && ra > .02; r.material.opacity = ra; })); }
  if (frameN % 6 === 0 && st.view !== 'walk') { const fl = m => { const d = Math.cos(m.userData.ry - cam.th), f = m.userData.flip ? d < .15 : d < -.15; if (f !== m.userData.flip) { m.userData.flip = f; m.rotation.y = m.userData.ry + (f ? Math.PI : 0); } };
    A.forEach(M => { M.roofs.forEach(r => { if (r.visible) fl(r); }); M.decals.forEach(fl); }); }
  renderer.render(scene, camera);
  drawOverlay();
  requestAnimationFrame(tick);
}

/* ================= partida ================= */
ALL.forEach(M => { const D = M.D; D.embutida = D.lojas.length > 0;      // shopping sem lista embutida: tenta a relação colada antes neste navegador
  if (!D.embutida) { let saved = null; try { saved = localStorage.getItem('lista-' + M.key); } catch (e) {} if (saved) { const r = parseLista(saved); if (!r.erro) { aplicarLista(D, r.rows); D.importada = 'sessão anterior'; } } } });
function setFiltro(id, mall) {       // troca o grupo de comparação: desmonta os shoppings de fora e monta os do filtro
  stopTour(); const F = FILTROS.find(f => f.id === id) || FILTROS[0]; st.filtro = F.id; const L = FM();
  ALL.forEach(M => { if (M.root && !L.includes(M)) disposeMall(M); });
  L.forEach(M => { if (!M.root) { makeMall(M); if (FONTS) buildRoofs(M); } });
  CA = L.find(M => M.meu) || L[0]; CB = L.find(M => M !== CA) || null; INTEL = CB ? crossBrands(CA.S, CB.S) : null;
  const fs = $('#filtroSel'); fs.value = F.id; try { if (location.hash.slice(1) !== F.id) history.replaceState(null, '', '#' + F.id); } catch (e) {}
  setMall(mall && L.includes(MALLS[mall]) ? mall : F.inicial && L.includes(MALLS[F.inicial]) ? F.inicial : (CB || CA).key);
}
$('#filtroBox').hidden = FILTROS.length < 2;
$('#filtroSel').innerHTML = FILTROS.map(f => `<option value="${esc(f.id)}">${esc(f.nome)}</option>`).join('');
$('#filtroSel').addEventListener('change', e => setFiltro(e.target.value));
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h !== st.filtro && FILTROS.some(f => f.id === h)) setFiltro(h); });
new ResizeObserver(resize).observe(stage); resize();
setFiltro(FILTROS.some(f => f.id === location.hash.slice(1)) ? location.hash.slice(1) : CFG.filtro_inicial || FILTROS[0].id);
const fontsReady = document.fonts && document.fonts.load ? Promise.race([Promise.all([document.fonts.load('600 46px "IBM Plex Sans Condensed"'), document.fonts.load('500 12px "IBM Plex Sans Condensed"'), document.fonts.load('500 10px "IBM Plex Mono"'), document.fonts.ready]).catch(() => 0), new Promise(r => setTimeout(r, 2500))]) : Promise.resolve();
fontsReady.then(() => { FONTS = true; ALL.forEach(M => { if (!M.root) return; buildRoofs(M); M.S.forEach(s => { s.lw = null; }); M.accs.forEach(a => { a.lw = null; }); }); refresh(); });
requestAnimationFrame(tick);
