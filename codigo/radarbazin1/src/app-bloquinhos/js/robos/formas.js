// Correio das Formas — geometria 2D: identificar formas, lados e vértices,
// e reconhecê-las em objetos do dia a dia. O robô carteiro entrega os pacotes.
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { placarMissao, fimMissao, embaralhar, opcoesNumericas } from '../screens/robos.js';

const RODADAS = 8;

export const FORMAS = {
  circulo:   { nome: 'círculo',   plural: 'círculos',   lados: 0, vertices: 0, cor: '#2196c9', exemplo: 'um prato', emoji: '🍽️' },
  triangulo: { nome: 'triângulo', plural: 'triângulos', lados: 3, vertices: 3, cor: '#e63946', exemplo: 'uma fatia de pizza', emoji: '🍕' },
  quadrado:  { nome: 'quadrado',  plural: 'quadrados',  lados: 4, vertices: 4, cor: '#43a047', exemplo: 'uma janela', emoji: '🪟' },
  retangulo: { nome: 'retângulo', plural: 'retângulos', lados: 4, vertices: 4, cor: '#f0a821', exemplo: 'uma porta', emoji: '🚪' },
  pentagono: { nome: 'pentágono', plural: 'pentágonos', lados: 5, vertices: 5, cor: '#8e44ad', exemplo: 'uma casinha de desenho', emoji: '🏠' },
  hexagono:  { nome: 'hexágono',  plural: 'hexágonos',  lados: 6, vertices: 6, cor: '#e91e8c', exemplo: 'a colmeia das abelhas', emoji: '🐝' },
  elipse:    { nome: 'elipse',    plural: 'elipses',    lados: 0, vertices: 0, cor: '#7fd4d8', exemplo: 'um ovo', emoji: '🥚' },
};

// sólidos simples — a porta de entrada do 3D
export const SOLIDOS = {
  cubo:     { nome: 'cubo',     cor: '#43a047', fato: 'O cubo tem 6 faces quadradas e EMPILHA que é uma beleza.' },
  piramide: { nome: 'pirâmide', cor: '#f0a821', fato: 'A pirâmide tem base embaixo e um bico no topo — como as do Egito!' },
  cilindro: { nome: 'cilindro', cor: '#e63946', fato: 'O cilindro ROLA deitado e empilha em pé — como uma lata.' },
};

export function svgSolido(tipo, { tamanho = 110 } = {}) {
  const f = SOLIDOS[tipo];
  const s = tamanho;
  let corpo = '';
  if (tipo === 'cubo') {
    const a = s * 0.52, d = s * 0.22, x = s * 0.14, y = s * 0.3;
    corpo =
      `<polygon points="${x},${y} ${x + d},${y - d} ${x + a + d},${y - d} ${x + a},${y}" fill="${f.cor}" stroke="#1d3557" stroke-width="3.5" stroke-linejoin="round" opacity="0.85"/>` +
      `<polygon points="${x + a},${y} ${x + a + d},${y - d} ${x + a + d},${y + a - d} ${x + a},${y + a}" fill="#1b5e20" stroke="#1d3557" stroke-width="3.5" stroke-linejoin="round"/>` +
      `<rect x="${x}" y="${y}" width="${a}" height="${a}" rx="4" fill="${f.cor}" stroke="#1d3557" stroke-width="3.5"/>`;
  } else if (tipo === 'piramide') {
    const topoX = s / 2, topoY = s * 0.12, bE = s * 0.12, bD = s * 0.88, bY = s * 0.86, meio = s * 0.62;
    corpo =
      `<polygon points="${topoX},${topoY} ${bE},${bY} ${meio},${bY}" fill="${f.cor}" stroke="#1d3557" stroke-width="3.5" stroke-linejoin="round"/>` +
      `<polygon points="${topoX},${topoY} ${meio},${bY} ${bD},${bY - s * 0.08}" fill="#b57e0a" stroke="#1d3557" stroke-width="3.5" stroke-linejoin="round"/>`;
  } else { // cilindro
    const cx = s / 2, rx = s * 0.3, ry = s * 0.12, topo = s * 0.2, base = s * 0.8;
    corpo =
      `<rect x="${cx - rx}" y="${topo}" width="${2 * rx}" height="${base - topo}" fill="${f.cor}" stroke="none"/>` +
      `<line x1="${cx - rx}" y1="${topo}" x2="${cx - rx}" y2="${base}" stroke="#1d3557" stroke-width="3.5"/>` +
      `<line x1="${cx + rx}" y1="${topo}" x2="${cx + rx}" y2="${base}" stroke="#1d3557" stroke-width="3.5"/>` +
      `<path d="M ${cx - rx} ${base} A ${rx} ${ry} 0 0 0 ${cx + rx} ${base}" fill="${f.cor}" stroke="#1d3557" stroke-width="3.5"/>` +
      `<ellipse cx="${cx}" cy="${topo}" rx="${rx}" ry="${ry}" fill="#f08a80" stroke="#1d3557" stroke-width="3.5"/>`;
  }
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" role="img" aria-label="${f.nome}">${corpo}</svg>`;
}

/** SVG da forma, com rostinho simpático (identidade própria do jogo). */
export function svgForma(tipo, { tamanho = 110, rosto = true } = {}) {
  const f = FORMAS[tipo];
  const s = tamanho, c = s / 2;
  let corpo;
  if (tipo === 'circulo') {
    corpo = `<circle cx="${c}" cy="${c}" r="${c - 6}" fill="${f.cor}" stroke="#1d3557" stroke-width="4"/>`;
  } else if (tipo === 'elipse') {
    corpo = `<ellipse cx="${c}" cy="${c}" rx="${c - 6}" ry="${c * 0.62}" fill="${f.cor}" stroke="#1d3557" stroke-width="4"/>`;
  } else if (tipo === 'quadrado') {
    corpo = `<rect x="10" y="10" width="${s - 20}" height="${s - 20}" rx="8" fill="${f.cor}" stroke="#1d3557" stroke-width="4"/>`;
  } else if (tipo === 'retangulo') {
    corpo = `<rect x="6" y="${s * 0.22}" width="${s - 12}" height="${s * 0.56}" rx="8" fill="${f.cor}" stroke="#1d3557" stroke-width="4"/>`;
  } else {
    const n = f.lados;
    const pontos = Array.from({ length: n }, (_, i) => {
      const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
      return `${c + (c - 8) * Math.cos(ang)},${c + (c - 8) * Math.sin(ang)}`;
    }).join(' ');
    corpo = `<polygon points="${pontos}" fill="${f.cor}" stroke="#1d3557" stroke-width="4" stroke-linejoin="round"/>`;
  }
  const cara = rosto
    ? `<circle cx="${c - s * 0.13}" cy="${c}" r="${s * 0.055}" fill="#fff"/><circle cx="${c + s * 0.13}" cy="${c}" r="${s * 0.055}" fill="#fff"/>` +
      `<circle cx="${c - s * 0.13}" cy="${c}" r="${s * 0.028}" fill="#1d3557"/><circle cx="${c + s * 0.13}" cy="${c}" r="${s * 0.028}" fill="#1d3557"/>` +
      `<path d="M ${c - s * 0.1} ${c + s * 0.13} Q ${c} ${c + s * 0.22} ${c + s * 0.1} ${c + s * 0.13}" stroke="#1d3557" stroke-width="${s * 0.035}" fill="none" stroke-linecap="round"/>`
    : '';
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" role="img" aria-label="${f.nome}">${corpo}${cara}</svg>`;
}

function gerarRodada(rodada) {
  const tipos = Object.keys(FORMAS);
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const f = FORMAS[tipo];
  if (rodada <= 3) { // identificar a forma pelo nome
    const opcoes = embaralhar([tipo, ...embaralhar(tipos.filter(t => t !== tipo)).slice(0, 2)]);
    return {
      pergunta: 'Que forma o robô vai entregar?',
      fala: 'Que forma é esta?',
      mostra: { tipo: 'forma', valor: tipo },
      opcoes: opcoes.map(t => ({ rotulo: FORMAS[t].nome, certa: t === tipo })),
      descoberta: `É um ${f.nome}! Parece com ${f.exemplo} ${f.emoji}`,
    };
  }
  if (rodada <= 5) { // contar lados ou vértices (construir → contar)
    const t2 = (tipo === 'circulo' || tipo === 'elipse') ? 'pentagono' : tipo; // curvas não têm lados para contar
    const f2 = FORMAS[t2];
    const pedeLados = Math.random() < 0.5;
    const certa = pedeLados ? f2.lados : f2.vertices;
    return {
      pergunta: `Quantos ${pedeLados ? 'lados' : 'vértices (cantinhos)'} tem o ${f2.nome}?`,
      fala: `Conte: quantos ${pedeLados ? 'lados' : 'cantinhos'} tem o ${f2.nome}?`,
      mostra: { tipo: 'forma', valor: t2 },
      opcoes: opcoesNumericas(certa, [certa - 1, certa + 1, certa + 2]).map(n => ({ rotulo: String(n), certa: n === certa })),
      descoberta: `O ${f2.nome} tem ${f2.lados} lados e ${f2.vertices} vértices — sempre o mesmo número!`,
    };
  }
  if (rodada === 6) { // cotidiano: qual forma parece com…?
    const opcoes = embaralhar([tipo, ...embaralhar(Object.keys(FORMAS).filter(t => t !== tipo)).slice(0, 2)]);
    return {
      pergunta: `Qual pacote parece com ${f.exemplo}? ${f.emoji}`,
      fala: `Qual forma parece com ${f.exemplo}?`,
      mostra: { tipo: 'nenhum' },
      opcoes: opcoes.map(t => ({ rotulo: FORMAS[t].nome, svg: svgForma(t, { tamanho: 84 }), certa: t === tipo })),
      descoberta: `Isso! ${f.exemplo[0].toUpperCase() + f.exemplo.slice(1)} tem forma de ${f.nome}.`,
    };
  }
  // rodadas 7-8: sólidos 3D — cubo, pirâmide e cilindro
  const tipos3d = Object.keys(SOLIDOS);
  const alvo3d = tipos3d[Math.floor(Math.random() * tipos3d.length)];
  const s3 = SOLIDOS[alvo3d];
  if (Math.random() < 0.5) { // achar o sólido pelo nome
    return {
      pergunta: `Agora em 3D! Qual pacote é o ${s3.nome.toUpperCase()}?`,
      fala: `Qual destes é o ${s3.nome}?`,
      mostra: { tipo: 'nenhum' },
      opcoes: embaralhar(tipos3d).map(t => ({ rotulo: SOLIDOS[t].nome, svg: svgSolido(t, { tamanho: 84 }), certa: t === alvo3d })),
      descoberta: s3.fato,
    };
  }
  return { // nomear o sólido mostrado
    pergunta: 'Que sólido 3D é este?',
    fala: 'Que sólido é este?',
    mostra: { tipo: 'solido', valor: alvo3d },
    opcoes: embaralhar(tipos3d).map(t => ({ rotulo: SOLIDOS[t].nome, certa: t === alvo3d })),
    descoberta: s3.fato,
  };
}

export function missaoFormas(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let rodada = 0, acertos = 0, vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) {
      return fimMissao(raiz, ctx, 'formas', {
        venceu: acertos >= 6,
        pontos: acertos,
        mensagem: `O robô carteiro entregou ${acertos} de ${RODADAS} pacotes sem errar o endereço.`,
      });
    }
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(rodada, RODADAS, acertos));

    const r = gerarRodada(rodada);
    let tentou = false;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const topo = document.createElement('div');
    topo.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px';
    topo.appendChild(criarRobo({ tamanho: 44 }));
    const perg = document.createElement('p');
    perg.style.cssText = 'font-weight:800;font-size:1.1rem';
    perg.textContent = r.pergunta;
    topo.appendChild(perg);
    painel.appendChild(topo);
    voz.falar(r.fala);

    if (r.mostra.tipo === 'forma' || r.mostra.tipo === 'solido') {
      const zona = document.createElement('div');
      zona.className = 'visual-blocos';
      zona.innerHTML = r.mostra.tipo === 'forma' ? svgForma(r.mostra.valor) : svgSolido(r.mostra.valor);
      painel.appendChild(zona);
    }

    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    for (const op of r.opcoes) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      if (op.svg) {
        b.style.cssText = 'background:#fff;min-width:96px;min-height:96px;padding:4px';
        b.innerHTML = op.svg;
        b.setAttribute('aria-label', op.rotulo);
      } else {
        b.style.cssText = 'background:var(--tinta);min-width:96px;font-size:1rem;padding:.4rem .6rem';
        b.textContent = op.rotulo;
      }
      b.addEventListener('click', () => {
        if (op.certa) {
          if (!tentou) acertos++;
          audio.fusao();
          confete(20);
          linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
          const desc = document.createElement('p');
          desc.className = 'passo-solucao';
          desc.innerHTML = `💡 <b>Descoberta:</b> ${r.descoberta}`;
          painel.appendChild(desc);
          voz.falar(r.descoberta);
          esperarFalaEntao(proxima, 1300);
        } else {
          tentou = true;
          audio.erro();
          b.classList.add('tremida');
          b.disabled = true;
        }
      });
      linha.appendChild(b);
    }
    painel.appendChild(linha);
    raiz.appendChild(painel);
  }

  proxima();
  return () => { vivo = false; };
}
