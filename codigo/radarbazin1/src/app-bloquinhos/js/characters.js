// Personagens 1–10 e renderizadores de blocos (material dourado).
export const PERSONAGENS = {
  1:  { nome: 'Uni',       cor: 'var(--c1)', hex: '#e63946', escura: '#a4161a', bordao: 'Um por todos!' },
  2:  { nome: 'Dupla',     cor: 'var(--c2)', hex: '#f77f00', escura: '#b45309', bordao: 'Dois pés, dois passos!' },
  3:  { nome: 'Trio',      cor: 'var(--c3)', hex: '#eba800', escura: '#92670a', bordao: 'Um, dois, TRÊS!' },
  4:  { nome: 'Quadrado',  cor: 'var(--c4)', hex: '#43a047', escura: '#1b5e20', bordao: 'Tudo no esquadro!' },
  5:  { nome: 'Manola',    cor: 'var(--c5)', hex: '#2196c9', escura: '#0d5c7d', bordao: 'Toca aqui!' },
  6:  { nome: 'Dado',      cor: 'var(--c6)', hex: '#3f51b5', escura: '#232f7a', bordao: 'Vamos jogar!' },
  7:  { nome: 'Arco',      cor: 'var(--c7)', hex: '#8e44ad', escura: '#5b2c6f', bordao: 'Sete cores, sete sonhos!' },
  8:  { nome: 'Polvo',     cor: 'var(--c8)', hex: '#e91e8c', escura: '#9c105c', bordao: 'Oito abraços de uma vez!' },
  9:  { nome: 'Quase-Dez', cor: 'var(--c9)', hex: '#a26a42', escura: '#6b4226', bordao: 'Só falta UM!' },
  10: { nome: 'Dezena',    cor: 'var(--ouro)', hex: '#f0a821', escura: '#a06e08', bordao: 'Juntos somos dez!' },
};

/** Cor de texto legível (contraste >= 3:1) para um fundo hex. */
export function corTexto(hex) {
  const canal = (i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
  return 1.05 / (L + 0.05) >= 3 ? '#ffffff' : '#1d3557';
}

/** Formata em pt-BR: 1234567 → "1.234.567". */
export function formatarNumero(v) { return v.toLocaleString('pt-BR'); }

/** Número por extenso aproximado, para narração e bordões ("300 mil", "2 milhões"). */
export function falaNumero(v) {
  if (v >= 1e9) { const n = v / 1e9; return n === 1 ? '1 bilhão' : `${formatarNumero(Math.round(n * 10) / 10)} bilhões`; }
  if (v >= 1e6) { const n = Math.floor(v / 1e6); const resto = v % 1e6; return `${n} ${n === 1 ? 'milhão' : 'milhões'}${resto ? ' e ' + falaNumero(resto) : ''}`; }
  if (v >= 1e3) { const n = Math.floor(v / 1e3); const resto = v % 1e3; return `${n} mil${resto ? ' e ' + resto : ''}`; }
  return String(v);
}

const MARCOS = {
  100: 'CEM! Dez barras douradas viraram uma PLACA!',
  1000: 'MIL! Dez placas viraram um CUBÃO dourado!',
  10000: 'DEZ MIL! Os números só crescem!',
  100000: 'CEM MIL! Quase um milhão!',
  1000000: 'UM MILHÃO! Um número com SEIS zeros!',
  10000000: 'DEZ MILHÕES! Que gigante!',
  100000000: 'CEM MILHÕES! Falta pouco pro topo!',
  1000000000: 'UM BILHÃO! O rei dos números! 👑',
};

export function infoPersonagem(valor) {
  if (valor <= 10) return PERSONAGENS[valor];
  const base = { hex: '#f0a821', escura: '#a06e08' };
  if (valor < 100) {
    const dez = Math.floor(valor / 10);
    return { ...base, nome: `Turma do ${valor}`, bordao: valor % 10 === 0 ? `${dez} barras douradas, somos ${valor}!` : `Juntos somos ${valor}!` };
  }
  return {
    ...base,
    nome: `Turma do ${formatarNumero(valor)}`,
    bordao: MARCOS[valor] || `Juntos somos ${falaNumero(valor)}!`,
  };
}

// Disposição dos cubinhos [coluna, linha], linha 0 = chão.
const DISPOSICOES = {
  1: [[0, 0]],
  2: [[0, 0], [0, 1]],
  3: [[0, 0], [0, 1], [0, 2]],
  4: [[0, 0], [1, 0], [0, 1], [1, 1]],
  5: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  6: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]],
  7: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3]],
  8: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2], [0, 3], [1, 3]],
  9: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
};

function svgCubo(x, y, s, hex, escura) {
  const m = s * 0.14;
  return `<g><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.16}" fill="${hex}" stroke="${escura}" stroke-width="${Math.max(1.5, s * 0.07)}"/>` +
    `<rect x="${x + m}" y="${y + m}" width="${s - 2 * m}" height="${(s - 2 * m) * 0.42}" rx="${s * 0.1}" fill="#ffffff" opacity="0.28"/></g>`;
}

// Barra dourada vertical de 10 (material dourado: 10 cubinhos em linha).
function svgBarraV(x, yTopo, s, altura) {
  const seg = altura / 10;
  let g = `<g><rect x="${x}" y="${yTopo}" width="${s}" height="${altura}" rx="${s * 0.16}" fill="url(#grad-ouro)" stroke="#a06e08" stroke-width="${Math.max(1.5, s * 0.07)}"/>`;
  for (let i = 1; i < 10; i++) {
    g += `<line x1="${x + s * 0.12}" x2="${x + s * 0.88}" y1="${yTopo + seg * i}" y2="${yTopo + seg * i}" stroke="#a06e08" stroke-width="1.2" opacity="0.55"/>`;
  }
  return g + '</g>';
}

const GRAD_OURO = `<defs><linearGradient id="grad-ouro" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#f0a821"/></linearGradient></defs>`;

function svgRosto(cx, cy, s, expressao) {
  const r = s * 0.16, dx = s * 0.26;
  const olhoY = expressao === 'pensativo' ? -r * 0.35 : 0;
  let boca;
  if (expressao === 'feliz') {
    boca = `<path d="M ${cx - s * 0.24} ${cy + s * 0.22} Q ${cx} ${cy + s * 0.48} ${cx + s * 0.24} ${cy + s * 0.22}" stroke="#1d3557" stroke-width="${s * 0.07}" fill="none" stroke-linecap="round"/>`;
  } else if (expressao === 'pensativo') {
    boca = `<circle cx="${cx}" cy="${cy + s * 0.3}" r="${s * 0.09}" fill="#1d3557"/>`;
  } else { // neutro
    boca = `<line x1="${cx - s * 0.18}" x2="${cx + s * 0.18}" y1="${cy + s * 0.3}" y2="${cy + s * 0.3}" stroke="#1d3557" stroke-width="${s * 0.07}" stroke-linecap="round"/>`;
  }
  return `<g class="rosto-bob">` +
    `<circle cx="${cx - dx}" cy="${cy}" r="${r}" fill="#fff"/><circle cx="${cx + dx}" cy="${cy}" r="${r}" fill="#fff"/>` +
    `<circle cx="${cx - dx}" cy="${cy + olhoY}" r="${r * 0.5}" fill="#1d3557"/><circle cx="${cx + dx}" cy="${cy + olhoY}" r="${r * 0.5}" fill="#1d3557"/>` +
    boca + `</g>`;
}

// ---------- números gigantes (100 a 1 bilhão) ----------
const POTENCIAS_GRANDES = [
  { p: 1e9, rotulo: '1 BILHÃO', w: 100, h: 58, borda: '#8e44ad' },
  { p: 1e8, rotulo: '100 MILHÕES', w: 88, h: 50, borda: '#e63946' },
  { p: 1e7, rotulo: '10 MILHÕES', w: 82, h: 48, borda: '#e91e8c' },
  { p: 1e6, rotulo: '1 MILHÃO', w: 76, h: 46, borda: '#f77f00' },
  { p: 1e5, rotulo: '100 MIL', w: 66, h: 40, borda: '#43a047' },
  { p: 1e4, rotulo: '10 MIL', w: 60, h: 38, borda: '#2196c9' },
];

function svgPlaca100(x, y, s) {
  let g = `<g><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="6" fill="url(#grad-ouro)" stroke="#a06e08" stroke-width="2"/>`;
  for (let k = 1; k < 10; k++) {
    g += `<line x1="${x}" x2="${x + s}" y1="${y + s * k / 10}" y2="${y + s * k / 10}" stroke="#a06e08" stroke-width="0.7" opacity="0.5"/>`;
    g += `<line y1="${y}" y2="${y + s}" x1="${x + s * k / 10}" x2="${x + s * k / 10}" stroke="#a06e08" stroke-width="0.7" opacity="0.5"/>`;
  }
  return g + '</g>';
}

function svgCubo1000(x, y, s) {
  const d = s * 0.3;
  return `<g>
    <polygon points="${x},${y + d} ${x + d},${y} ${x + s + d},${y} ${x + s},${y + d}" fill="#ffd166" stroke="#a06e08" stroke-width="2"/>
    <polygon points="${x + s},${y + d} ${x + s + d},${y} ${x + s + d},${y + s}" fill="#c98d12" stroke="#a06e08" stroke-width="2"/>
    <rect x="${x}" y="${y + d}" width="${s}" height="${s - d}" rx="3" fill="url(#grad-ouro)" stroke="#a06e08" stroke-width="2"/>
    <text x="${x + s / 2}" y="${y + d + (s - d) * 0.65}" text-anchor="middle" font-size="${s * 0.3}" font-weight="900" fill="#6b4a10">MIL</text>
  </g>`;
}

function svgBlocoRotulado(x, y, w, h, rotulo, borda) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#grad-ouro)" stroke="${borda}" stroke-width="3.5"/>
    <text x="${x + w / 2}" y="${y + h * 0.62}" text-anchor="middle" font-size="${Math.min(h * 0.34, w / (rotulo.length * 0.62))}" font-weight="900" fill="#1d3557">${rotulo}</text>
    <text x="${x + w - 6}" y="${y + 12}" text-anchor="end" font-size="10">✨</text>
  </g>`;
}

/** Personagem para valores de 100 a 1 bilhão: super-blocos por potência de dez. */
function svgPersonagemGrande(valor, { cubo = 26, expressao = 'feliz', rosto = true, rotulo = false } = {}) {
  // decompõe em ícones: super-blocos, cubões, placas, barras e cubinhos
  const icones = [];
  let resto = valor;
  for (const pot of POTENCIAS_GRANDES) {
    const n = Math.floor(resto / pot.p);
    for (let i = 0; i < n; i++) icones.push({ tipo: 'super', ...pot });
    resto %= pot.p;
  }
  const milhares = Math.floor(resto / 1000);
  for (let i = 0; i < milhares; i++) icones.push({ tipo: 'cubo1000', w: 58, h: 60 });
  resto %= 1000;
  const centenas = Math.floor(resto / 100);
  for (let i = 0; i < centenas; i++) icones.push({ tipo: 'placa', w: 44, h: 44 });
  resto %= 100;
  const dezenas = Math.floor(resto / 10);
  for (let i = 0; i < dezenas; i++) icones.push({ tipo: 'barra', w: 13, h: 52 });
  const unidades = resto % 10;
  for (let i = 0; i < unidades; i++) icones.push({ tipo: 'cubinho', w: 18, h: 18 });

  // muitos ícones? vira um medalhão único com o número
  if (icones.length > 18) {
    icones.length = 0;
    icones.push({ tipo: 'super', w: Math.min(190, 60 + String(valor).length * 12), h: 72, rotulo: formatarNumero(valor), borda: '#8e44ad' });
  }

  const LARG_MAX = 270, folga = 6, margem = 20;
  let x = 0, y = margem, alturaLinha = 0, largura = 0;
  const posicoes = [];
  for (const ic of icones) {
    if (x > 0 && x + ic.w > LARG_MAX) { x = 0; y += alturaLinha + folga; alturaLinha = 0; }
    posicoes.push({ ...ic, x, y });
    x += ic.w + folga;
    alturaLinha = Math.max(alturaLinha, ic.h);
    largura = Math.max(largura, x - folga);
  }
  const alturaCorpo = y + alturaLinha;

  const alturaLinhaDe = (linhaY) => Math.max(...posicoes.filter(q => q.y === linhaY).map(q => q.h));
  let corpo = '';
  for (const p of posicoes) {
    // alinha cada ícone pela base da sua linha
    p.yBase = p.y + (alturaLinhaDe(p.y) - p.h);
    if (p.tipo === 'super') corpo += svgBlocoRotulado(p.x, p.yBase, p.w, p.h, p.rotulo, p.borda);
    else if (p.tipo === 'cubo1000') corpo += svgCubo1000(p.x, p.yBase, p.w * 0.77);
    else if (p.tipo === 'placa') corpo += svgPlaca100(p.x, p.yBase, p.w);
    else if (p.tipo === 'barra') corpo += svgBarraV(p.x, p.yBase, p.w, p.h);
    else corpo += svgCubo(p.x, p.yBase, p.w, '#f0a821', '#a06e08');
  }

  const primeiro = posicoes[0];
  const rostoSvg = rosto ? svgRosto(primeiro.x + primeiro.w / 2, Math.max(9, primeiro.yBase - 9), 22, expressao) : '';
  const rotuloSvg = rotulo
    ? `<text x="${largura / 2}" y="${alturaCorpo + 18}" text-anchor="middle" font-size="15" font-weight="900" fill="#1d3557">${formatarNumero(valor)}</text>`
    : '';
  const alturaSvg = alturaCorpo + (rotulo ? 24 : 6);
  const svg = `<svg width="${largura}" height="${alturaSvg}" viewBox="0 0 ${largura} ${alturaSvg}" role="img" aria-label="${infoPersonagem(valor).nome}">` +
    GRAD_OURO + corpo + rostoSvg + rotuloSvg + `</svg>`;
  return { svg, largura, altura: alturaSvg };
}

/**
 * SVG de um personagem/valor (1 a 1 bilhão).
 * Até 99: cubinhos e barras; acima: placas, cubões e super-blocos dourados.
 * Retorna { svg, largura, altura }.
 */
export function svgPersonagem(valor, { cubo = 26, expressao = 'feliz', rosto = true, rotulo = false } = {}) {
  valor = Math.max(1, Math.round(valor));
  if (valor > 99) return svgPersonagemGrande(valor, { cubo, expressao, rosto, rotulo });
  valor = Math.min(99, valor);
  const dezenas = Math.floor(valor / 10);
  const resto = valor % 10;
  const partes = [];
  let x = 0;

  // altura máxima ~ 6.5 cubos para caber no celular
  const alturaMax = cubo * 6.5;
  const alturaBarra = Math.min(cubo * 10, alturaMax);
  const larguraBarra = alturaBarra / 10 * 1.6;
  const folga = cubo * 0.3;

  let alturaTotal = 0;

  for (let i = 0; i < dezenas; i++) {
    partes.push({ tipo: 'barra', x, largura: larguraBarra, altura: alturaBarra });
    x += larguraBarra + folga;
    alturaTotal = Math.max(alturaTotal, alturaBarra);
  }

  if (resto > 0) {
    const disp = DISPOSICOES[resto];
    const cols = Math.max(...disp.map(p => p[0])) + 1;
    const rows = Math.max(...disp.map(p => p[1])) + 1;
    partes.push({ tipo: 'cubos', x, disp, cols, rows, valor: resto });
    x += cols * cubo;
    alturaTotal = Math.max(alturaTotal, rows * cubo);
  }

  const largura = Math.max(x, cubo);
  const margem = cubo * 0.55; // espaço para o rosto respirar
  const info = infoPersonagem(valor);
  let corpo = '';
  let rostoSvg = '';

  for (const p of partes) {
    if (p.tipo === 'barra') {
      corpo += svgBarraV(p.x, alturaTotal - p.altura + margem, p.largura, p.altura);
      if (rosto && resto === 0 && !rostoSvg) {
        rostoSvg = svgRosto(p.x + p.largura / 2, margem + p.largura * 0.55, p.largura * 1.15, expressao);
      }
    } else {
      const infoR = valor <= 10 ? info : PERSONAGENS[p.valor];
      const topo = alturaTotal - p.rows * cubo + margem;
      for (const [c, l] of p.disp) {
        corpo += svgCubo(p.x + c * cubo, topo + (p.rows - 1 - l) * cubo, cubo, infoR.hex, infoR.escura);
      }
      if (rosto && !rostoSvg) {
        // rosto centrado no cubo mais alto
        const colTopo = p.disp.filter(([, l]) => l === p.rows - 1);
        const cxCubo = p.x + (colTopo.reduce((s2, [c]) => s2 + c, 0) / colTopo.length + 0.5) * cubo;
        rostoSvg = svgRosto(cxCubo, topo + cubo * 0.45, cubo, expressao);
      }
    }
  }

  const rotuloSvg = rotulo
    ? `<text x="${largura / 2}" y="${alturaTotal + margem + cubo * 0.75}" text-anchor="middle" font-size="${cubo * 0.7}" font-weight="900" fill="#1d3557" font-family="inherit">${valor}</text>`
    : '';
  const alturaSvg = alturaTotal + margem + (rotulo ? cubo * 0.95 : cubo * 0.15);
  const svg = `<svg width="${largura}" height="${alturaSvg}" viewBox="0 0 ${largura} ${alturaSvg}" role="img" aria-label="${info.nome}, número ${valor}">` +
    GRAD_OURO + corpo + rostoSvg + rotuloSvg + `</svg>`;
  return { svg, largura, altura: alturaSvg };
}

/** Quantidade "material dourado" para as contas: placas de 100, barras de 10 e cubinhos, na horizontal. */
export function svgQuantidade(n, { cubo = 16, cor } = {}) {
  n = Math.max(0, Math.round(n));
  const centenas = Math.floor(n / 100);
  const dezenas = Math.floor((n % 100) / 10);
  const unidades = n % 10;
  const corU = cor || (unidades > 0 ? PERSONAGENS[unidades].hex : '#f0a821');
  const escU = cor ? '#00000055' : (unidades > 0 ? PERSONAGENS[unidades].escura : '#a06e08');
  const folga = cubo * 0.45;
  let x = 0, corpo = '', alturaMax = cubo;

  const ph = cubo * 5; // placa 100 compacta (10x10 mini células)
  for (let i = 0; i < centenas; i++) {
    const cel = ph / 10;
    corpo += `<g><rect x="${x}" y="0" width="${ph}" height="${ph}" rx="4" fill="url(#grad-ouro)" stroke="#a06e08" stroke-width="1.5"/>`;
    for (let k = 1; k < 10; k++) {
      corpo += `<line x1="${x}" x2="${x + ph}" y1="${k * cel}" y2="${k * cel}" stroke="#a06e08" stroke-width="0.6" opacity="0.5"/>`;
      corpo += `<line y1="0" y2="${ph}" x1="${x + k * cel}" x2="${x + k * cel}" stroke="#a06e08" stroke-width="0.6" opacity="0.5"/>`;
    }
    corpo += '</g>';
    x += ph + folga; alturaMax = Math.max(alturaMax, ph);
  }

  const bh = cubo * 5; // barra vertical compacta
  const bw = bh / 10 * 1.6;
  for (let i = 0; i < dezenas; i++) {
    corpo += svgBarraV(x, 0, bw, bh);
    x += bw + folga; alturaMax = Math.max(alturaMax, bh);
  }

  // unidades em coluna (até 9)
  if (unidades > 0) {
    const porColuna = 5;
    const colunas = Math.ceil(unidades / porColuna);
    for (let i = 0; i < unidades; i++) {
      const c = Math.floor(i / porColuna), l = i % porColuna;
      corpo += svgCubo(x + c * (cubo + 2), alturaMax - (l + 1) * (cubo + 2) + 2, cubo, corU, escU);
    }
    x += colunas * (cubo + 2);
  }
  if (n === 0) corpo += `<text x="0" y="${cubo}" font-size="${cubo}" font-weight="900" fill="#1d3557">0</text>`;

  const largura = Math.max(x, cubo);
  return `<svg width="${largura}" height="${alturaMax + 4}" viewBox="0 -2 ${largura} ${alturaMax + 6}" aria-label="${n} em blocos">${GRAD_OURO}${corpo}</svg>`;
}

/** Retângulo a×b para multiplicação. */
export function svgRetangulo(linhas, colunas, { cubo = 20, destaque = Infinity } = {}) {
  let corpo = '';
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      const idx = l * colunas + c;
      const cor = idx < destaque ? PERSONAGENS[((l % 9) + 1)].hex : '#cfd8e3';
      const esc = idx < destaque ? PERSONAGENS[((l % 9) + 1)].escura : '#9fb0c3';
      corpo += svgCubo(c * (cubo + 2), l * (cubo + 2), cubo, cor, esc);
    }
  }
  const w = colunas * (cubo + 2), h = linhas * (cubo + 2);
  return `<svg width="${w}" height="${h}" viewBox="-1 -1 ${w + 2} ${h + 2}" aria-label="retângulo de ${linhas} por ${colunas}">${corpo}</svg>`;
}

/** Fileira de n cubinhos com os primeiros `pintados` destacados (frações). */
export function svgFileira(n, pintados, { cubo = 22 } = {}) {
  let corpo = '';
  for (let i = 0; i < n; i++) {
    const ok = i < pintados;
    corpo += svgCubo(i * (cubo + 3), 0, cubo, ok ? '#2196c9' : '#e3edf5', ok ? '#0d5c7d' : '#9fb0c3');
  }
  const w = n * (cubo + 3);
  return `<svg width="${w}" height="${cubo + 2}" viewBox="-1 -1 ${w + 2} ${cubo + 4}" aria-label="${pintados} de ${n} cubinhos pintados">${corpo}</svg>`;
}

/** Barra de 100 células para porcentagem. */
export function svgBarra100(pct, { largura = 260 } = {}) {
  const h = 34, cel = largura / 10;
  let corpo = `<rect x="0" y="0" width="${largura}" height="${h}" rx="8" fill="#e3edf5" stroke="#9fb0c3" stroke-width="1.5"/>`;
  corpo += `<rect x="0" y="0" width="${largura * pct / 100}" height="${h}" rx="8" fill="url(#grad-ouro)"/>`;
  for (let k = 1; k < 10; k++) {
    corpo += `<line x1="${k * cel}" x2="${k * cel}" y1="0" y2="${h}" stroke="#9fb0c3" stroke-width="1" opacity="0.7"/>`;
  }
  return `<svg width="${largura}" height="${h + 2}" viewBox="0 -1 ${largura} ${h + 3}" aria-label="${pct} por cento">${GRAD_OURO}${corpo}</svg>`;
}
