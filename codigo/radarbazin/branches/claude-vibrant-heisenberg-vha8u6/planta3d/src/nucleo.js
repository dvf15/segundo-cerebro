/* Núcleo sem tela: geometria, planta esquemática e leitura da relação de lojas.
   É o mesmo código na página e nos scripts de linha de comando (scripts/montar.mjs carrega este arquivo). */
function criarNucleo(CFG) {
  const deacc = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const GRUPOS = CFG.grupos.map(g => g.nome);
  const GRULES = (CFG.regras_grupo || []).map(r => [r[0], new RegExp(r[1])]);
  const BENCH = CFG.area_referencia_m2;
  const CAMPOS = CFG.campos || [];

  /* ---------- geometria ---------- */
  const centroid = P => { let a = 0, x = 0, y = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length], c = p[0] * q[1] - q[0] * p[1]; a += c; x += (p[0] + q[0]) * c; y += (p[1] + q[1]) * c; } return a ? [x / (3 * a), y / (3 * a)] : P[0].slice(); };
  const inPoly = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  function rayHits(C, P, th) {      // menor e maior distância do centro C às arestas de P na direção th
    let mn = 1e9, mx = -1; const dx = Math.cos(th), dy = Math.sin(th);
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], ex = b[0] - a[0], ey = b[1] - a[1], den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
      const t = ((a[0] - C[0]) * ey - (a[1] - C[1]) * ex) / den, u = ((a[0] - C[0]) * dy - (a[1] - C[1]) * dx) / den; if (t > 0 && u >= 0 && u <= 1) { if (t < mn) mn = t; if (t > mx) mx = t; } }
    return mx < 0 ? null : [mn, mx];
  }

  /* ---------- planta esquemática ----------
     Faixas a partir do centro: átrio, ilha central (duas faces), corredor com quiosques e fileira externa.
     Só desenha as lojas que chegam sem "poly"; quem já tem desenho próprio fica como está. */
  const BAND = {atr:.2, a1:.36, c0:.52, c1:.62, out:.965};
  function layoutMall(Dm) {
    if (!Dm.centro) Dm.centro = centroid(Dm.contorno).map(v => +v.toFixed(1));
    const C = Dm.centro, NA = 720, R = new Float32Array(NA), dth = 2 * Math.PI / NA;
    for (let k = 0; k < NA; k++) { const h = rayHits(C, Dm.contorno, k * dth); R[k] = h ? h[0] : 1; }
    const pt = (k, f) => { const kk = ((k % NA) + NA) % NA, th = kk * dth, r = R[kk] * f; return [+(C[0] + r * Math.cos(th)).toFixed(1), +(C[1] + r * Math.sin(th)).toFixed(1)]; };
    if (!Dm.atrio) { Dm.atrio = []; for (let k = 0; k < NA; k += 6) Dm.atrio.push(pt(k, BAND.atr)); }
    const bands = [{n:'fileira externa', f0:BAND.c1, f1:BAND.out}, {n:'ilha central, face corredor', f0:BAND.a1, f1:BAND.c0}, {n:'ilha central, face átrio', f0:BAND.atr, f1:BAND.a1}];
    bands.forEach(b => { b.w = new Float32Array(NA); b.cap = 0; for (let k = 0; k < NA; k++) { b.w[k] = .5 * R[k] * R[k] * (b.f1 * b.f1 - b.f0 * b.f0) * dth; b.cap += b.w[k]; } });
    const capT = bands.reduce((a, b) => a + b.cap, 0), K0 = Math.round(NA * .75);
    const place = (b, list, fill) => {
      if (!list.length) return;
      const sum = list.reduce((a, s) => a + s.area_est, 0), sc = fill ? b.cap * .985 / sum : Math.min(1, b.cap * .985 / sum);
      let k = K0;
      list.forEach(s => {
        const need = s.area_est * sc, k0 = k; let a = 0; while (a < need && k - K0 < NA) { a += b.w[k % NA]; k++; }
        const ks = k0, ke = Math.max(k0 + 1, k - 1), poly = [];
        for (let j = ks; j < ke; j += 5) poly.push(pt(j, b.f1)); poly.push(pt(ke, b.f1));
        for (let j = ke; j > ks; j -= 5) poly.push(pt(j, b.f0)); poly.push(pt(ks, b.f0));
        s.poly = poly; s.anel = b.n;
      });
    };
    const byLv = {}; Dm.lojas.forEach(s => { if (!s.poly) (byLv[s.nivel] = byLv[s.nivel] || []).push(s); });
    Object.keys(byLv).forEach(lv => {
      const L = byLv[lv], shops = L.filter(s => s.tipo !== 'Quiosque'), kios = L.filter(s => s.tipo === 'Quiosque');
      const tot = shops.reduce((a, s) => a + s.area_est, 0), full = tot > capT * .5;
      const isBig = s => s.tipo === 'Âncora' || s.tipo === 'Megaloja' || s.tipo === 'Lazer' || s.area_est >= 400;
      const ord = (a, b) => (a.luc || '').localeCompare(b.luc || '', 'pt', {numeric:true}) || GRUPOS.indexOf(a.grupo) - GRUPOS.indexOf(b.grupo) || a.nome.localeCompare(b.nome, 'pt');
      const sat = shops.filter(s => !isBig(s)).sort(ord), bigs = shops.filter(isBig).sort((a, b) => b.area_est - a.area_est);
      if (!full) { place(bands[0], bigs.concat(sat), false); }
      else {
        const unit = tot / capT, outCap = bands[0].cap * unit, corCap = bands[1].cap * unit;
        let need = outCap - bigs.reduce((a, s) => a + s.area_est, 0); const outSat = [];
        while (sat.length && need > 0) { const s = sat.shift(); outSat.push(s); need -= s.area_est; }
        const seq = [], per = Math.ceil(outSat.length / Math.max(1, bigs.length));
        if (!bigs.length) seq.push(...outSat); else bigs.forEach((bg, i) => { seq.push(bg); seq.push(...outSat.slice(i * per, (i + 1) * per)); });
        const cor = []; let c = corCap; while (sat.length && c > 0) { const s = sat.shift(); cor.push(s); c -= s.area_est; }
        place(bands[0], seq, true); place(bands[1], cor, true); place(bands[2], sat, true);
      }
      kios.forEach((s, j) => {       // quiosques espalhados no corredor
        const k = Math.round(K0 + (j + .5) * NA / kios.length), th = (((k % NA) + NA) % NA) * dth, c = pt(k, (BAND.c0 + BAND.c1) / 2), nx = Math.cos(th), ny = Math.sin(th), tx = -ny, ty = nx, h = 1.5;
        s.poly = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(q => [+(c[0] + h * (q[0] * tx + q[1] * nx)).toFixed(1), +(c[1] + h * (q[0] * ty + q[1] * ny)).toFixed(1)]); s.anel = 'corredor';
      });
    });
  }

  /* ---------- leitura da relação (Excel, CSV ou texto). Só Nome e Piso são obrigatórios. ---------- */
  const grupoDe = cat => { const c = String(cat || '').toLowerCase(); const r = GRULES.find(g => g[1].test(c)); return r ? r[0] : (CFG.grupo_padrao || GRUPOS[GRUPOS.length - 1]); };
  function nivelDe(p) {
    const t = deacc(String(p || '')).toUpperCase().trim(); let m;
    if (/SUB|^SS/.test(t)) return (m = t.match(/^SS\s*(\d)/)) ? 'SS' + m[1] : 'SS';
    if ((m = t.match(/\bG\s*-?(\d)/)) || (m = t.match(/GARAGEM\s*(\d)/))) return 'G' + m[1];
    if ((m = t.match(/\bL\s*-?(\d)/)) || (m = t.match(/(\d)\s*[ºO°A]?\s*(PISO|ANDAR|PAV)/))) return 'L' + m[1];
    if ((m = t.match(/(PISO|ANDAR|NIVEL)\s*(\d)/))) return 'L' + m[2];
    if ((m = t.match(/^(\d)$/))) return 'L' + m[1];
    if (/TERREO/.test(t)) return 'L1';
    return t.replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'L1';
  }
  const num = v => parseFloat(String(v).replace(/[^\d,.\-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
  function splitCsv(line, del) {     // respeita campos entre aspas
    const out = []; let cur = '', q = false;
    for (let i = 0; i < line.length; i++) { const ch = line[i];
      if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true; else if (ch === del) { out.push(cur.trim()); cur = ''; } else cur += ch; }
    out.push(cur.trim()); return out;
  }
  function parseLista(text) {
    const lines = String(text).replace(/^\uFEFF/, '').split(/\r?\n/).map(l => l.trim()).filter(Boolean); if (!lines.length) return {rows:[], erro:'A caixa está vazia.'};
    const del = lines.some(l => l.includes('\t')) ? '\t' : lines.some(l => l.includes(';')) ? ';' : ',';
    const cells = l => splitCsv(l, del);
    const hd = cells(lines[0]).map(c => deacc(c).toLowerCase());
    const find = re => hd.findIndex(c => re.test(c));
    let ix = {nome:find(/nome|loja|marca|fantasia|opera/), piso:find(/piso|andar|nivel|pavim/), cat:find(/segment|categ|ativid|ramo/), tipo:find(/tipo|formato/), luc:find(/luc|codigo|unidade|numero/), area:find(/area|abl|m2|m²/), status:find(/status|situac/), slug:find(/slug|link|url/)};
    let start = 1; if (ix.nome < 0 || ix.piso < 0) { ix = {nome:0, piso:1, cat:2, tipo:3, luc:4, area:5, status:-1, slug:-1}; start = 0; }
    const usados = new Set(Object.values(ix).filter(i => i >= 0));
    const ixc = start ? CAMPOS.map(c => { const alvo = [deacc(c.chave).toLowerCase(), deacc(c.rotulo || '').toLowerCase()]; return hd.findIndex((h, i) => !usados.has(i) && alvo.includes(h)); }) : CAMPOS.map(() => -1);
    const rows = [];
    for (let i = start; i < lines.length; i++) {
      const c = cells(lines[i]), nome = c[ix.nome]; if (!nome) continue;
      const cat = (ix.cat >= 0 && c[ix.cat]) || '', tp = deacc((ix.tipo >= 0 && c[ix.tipo]) || '').toLowerCase(), luc = (ix.luc >= 0 && c[ix.luc]) || null, all = deacc(nome + ' ' + cat + ' ' + tp).toLowerCase();
      let tipo = 'Loja';
      if (/quios/.test(all) || /^Q[A-Z]?\d/i.test(luc || '')) tipo = 'Quiosque'; else if (/ancora/.test(tp)) tipo = 'Âncora'; else if (/mega/.test(tp)) tipo = 'Megaloja'; else if (/restaur/.test(tp + ' ' + deacc(cat).toLowerCase())) tipo = 'Restaurante';
      else if (/lazer|cinema|academia/.test(tp)) tipo = 'Lazer'; else if (/aliment|fast|food/.test(tp + ' ' + deacc(cat).toLowerCase())) tipo = 'Alimentação'; else if (/servi/.test(tp)) tipo = 'Serviço';
      const av = ix.area >= 0 && c[ix.area] ? num(c[ix.area]) : NaN, temArea = av > 0;
      const area = temArea ? av : BENCH[tipo];
      const stx = deacc((ix.status >= 0 && c[ix.status]) || '').toLowerCase(), status = /obra/.test(stx) ? 'Em obras' : /breve|inaugura|novo|anunci/.test(stx) ? 'Em breve' : 'Em operação';
      const row = {nome:nome.toUpperCase(), slug:(ix.slug >= 0 && c[ix.slug]) || null, categoria:cat || 'Não informado', grupo:grupoDe(cat + ' ' + nome), piso_oficial:(c[ix.piso] || '').trim() || 'Não informado', tipo, tipo_fonte:'relação importada', status,
        luc, luc_nota:null, n_luc:1, grid:null, nivel:nivelDe(c[ix.piso]), area_est:Math.round(area), area_real:temArea, fachada_est:Math.round(Math.sqrt(area / 2.2) * 2) / 2,
        faixa:temArea ? 'área informada na relação' : 'referência por tipo de operação (sem área na relação)'};
      CAMPOS.forEach((f, k) => { const v = ixc[k] >= 0 ? c[ixc[k]] : ''; if (v) row[f.chave] = f.tipo === 'numero' && !isNaN(num(v)) ? num(v) : v; });
      rows.push(row);
    }
    return rows.length ? {rows} : {rows, erro:'Não achei linhas com nome de loja. Confira se a primeira linha tem o cabeçalho.'};
  }
  const ordNivel = id => (/^SS/.test(id) ? 0 : /^L/.test(id) ? 10 : /^G/.test(id) ? 20 : 30) + (parseInt(id.replace(/^\D+/, ''), 10) || 0);
  function garantirNiveis(Dm) {        // cria os pisos citados nas lojas e que não estão em "niveis"
    const novos = [];
    Dm.lojas.forEach(s => { if (!Dm.niveis.some(n => n.id === s.nivel)) { Dm.niveis.push({id:s.nivel, nome:s.nivel + ' · ' + (s.piso_oficial || s.nivel), uso:'Nível criado pela relação importada'}); novos.push(s.nivel); } });
    if (novos.length) Dm.niveis.sort((a, b) => ordNivel(a.id) - ordNivel(b.id));
    return novos;
  }
  function aplicarLista(Dm, rows) {    // troca a lista de um shopping e redesenha a planta esquemática
    Dm.lojas = rows; garantirNiveis(Dm); layoutMall(Dm);
  }

  /* ---------- cruzamento de marcas ---------- */
  function brandKey(n) {
    let t = deacc(n).toUpperCase().replace(/\(.*?\)/g, ' ').replace(/\b\d\s*[ºO°]?\s*PISO\b/g, ' ').replace(/\bQUIOSQUE\b/g, ' ');
    const i = t.indexOf(' - '); if (i >= 3) t = t.slice(0, i);
    return t.replace(/&/g, ' E ').replace(/[^A-Z0-9]+/g, ' ').trim();
  }
  const sameBrand = (a, b) => { if (a === b) return true; const [s, l] = a.length <= b.length ? [a, b] : [b, a]; return (s.length >= 6 || s.includes(' ')) && s.length >= 4 && (' ' + l + ' ').includes(' ' + s + ' '); };

  return {deacc, GRUPOS, BENCH, CAMPOS, BAND, centroid, inPoly, rayHits, layoutMall, grupoDe, nivelDe, num, parseLista, garantirNiveis, aplicarLista, brandKey, sameBrand};
}
if (typeof module !== 'undefined') module.exports = {criarNucleo};
