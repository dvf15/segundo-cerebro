// Jardim das Áreas — área concreta: contar quadradinhos, descobrir
// linhas × colunas e comparar terrenos (base: "Cidade dos Números").
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { placarMissao, fimMissao, opcoesNumericas, embaralhar } from '../screens/robos.js';

const RODADAS = 8;

/** Terreno de quadradinhos dourados (com numeração opcional para contar). */
export function svgTerreno(linhas, colunas, { celula = 34, numeros = false } = {}) {
  const w = colunas * celula, h = linhas * celula;
  let corpo = '';
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      corpo += `<rect x="${c * celula + 1}" y="${l * celula + 1}" width="${celula - 2}" height="${celula - 2}" rx="5" fill="#f2c94c" stroke="#986b18" stroke-width="2"/>`;
      if (numeros) {
        corpo += `<text x="${c * celula + celula / 2}" y="${l * celula + celula * 0.66}" text-anchor="middle" font-size="${celula * 0.42}" font-weight="800" fill="#6b4a10">${l * colunas + c + 1}</text>`;
      }
    }
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="terreno com ${linhas} linhas e ${colunas} colunas, ${linhas * colunas} quadradinhos">${corpo}</svg>`;
}

function gerarRodada(rodada) {
  if (rodada <= 5) { // contar (1-2 com números) → estruturar em linhas × colunas (3-5)
    const linhas = rodada <= 2 ? 2 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 3);
    const colunas = rodada <= 2 ? 2 + Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 3);
    const certa = linhas * colunas;
    return {
      tipo: 'contar',
      linhas, colunas,
      numeros: rodada <= 2,
      pergunta: 'Quantos quadradinhos cobrem o terreno do robô jardineiro?',
      opcoes: opcoesNumericas(certa, [certa + linhas, certa - linhas, certa + colunas, certa - colunas, linhas + colunas]),
      certa,
      descoberta: `São ${linhas} linhas com ${colunas} quadradinhos em cada uma: ${linhas} × ${colunas} = ${certa}. Essa é a ÁREA do terreno!`,
    };
  }
  // comparar áreas: figuras diferentes podem ter a mesma área
  const a = { linhas: 1 + Math.floor(Math.random() * 2), colunas: 3 + Math.floor(Math.random() * 3) };
  const areaA = a.linhas * a.colunas;
  const iguais = Math.random() < 0.5;
  let b;
  if (iguais) { // mesma área, formato diferente
    const divisores = [];
    for (let d = 1; d <= areaA; d++) if (areaA % d === 0 && d !== a.linhas) divisores.push(d);
    const dl = divisores.length ? divisores[Math.floor(Math.random() * divisores.length)] : a.linhas;
    b = { linhas: dl, colunas: areaA / dl };
  } else {
    b = { linhas: a.linhas + 1, colunas: a.colunas };
  }
  const areaB = b.linhas * b.colunas;
  const certa = areaA === areaB ? 'Mesma área' : (areaA > areaB ? 'Terreno A' : 'Terreno B');
  return {
    tipo: 'comparar',
    a, b, certa,
    pergunta: 'Qual terreno é maior?',
    opcoes: embaralhar(['Terreno A', 'Terreno B', 'Mesma área']),
    descoberta: areaA === areaB
      ? `Formatos diferentes, MESMA área: os dois têm ${areaA} quadradinhos!`
      : `O ${certa} tem mais quadradinhos: ${Math.max(areaA, areaB)} contra ${Math.min(areaA, areaB)}.`,
  };
}

export function missaoAreas(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let rodada = 0, acertos = 0, vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) {
      return fimMissao(raiz, ctx, 'areas', {
        venceu: acertos >= 6,
        pontos: acertos,
        mensagem: `Você cobriu ${acertos} de ${RODADAS} terrenos de primeira. O jardim está florido!`,
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
    topo.appendChild(criarRobo({ tamanho: 44, cor: '#a0ffb0' }));
    const perg = document.createElement('p');
    perg.style.cssText = 'font-weight:800;font-size:1.1rem';
    perg.textContent = r.pergunta;
    topo.appendChild(perg);
    painel.appendChild(topo);
    voz.falar(r.pergunta);

    const zona = document.createElement('div');
    zona.className = 'visual-blocos';
    if (r.tipo === 'contar') {
      zona.innerHTML = svgTerreno(r.linhas, r.colunas, { numeros: r.numeros, celula: Math.min(34, 290 / r.colunas) });
    } else {
      zona.innerHTML =
        `<div class="grupo-quantidade">${svgTerreno(r.a.linhas, r.a.colunas, { celula: 26 })}<span>Terreno A</span></div>` +
        `<div class="grupo-quantidade">${svgTerreno(r.b.linhas, r.b.colunas, { celula: 26 })}<span>Terreno B</span></div>`;
    }
    painel.appendChild(zona);

    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    for (const op of r.opcoes) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      b.style.cssText = 'background:var(--tinta);min-width:88px;font-size:1.1rem;padding:.4rem .7rem';
      b.textContent = op;
      b.addEventListener('click', () => {
        if (String(op) === String(r.certa)) {
          if (!tentou) acertos++;
          audio.fusao();
          confete(20);
          linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
          const desc = document.createElement('p');
          desc.className = 'passo-solucao';
          desc.innerHTML = `💡 <b>Descoberta:</b> ${r.descoberta}`;
          painel.appendChild(desc);
          voz.falar(r.descoberta);
          esperarFalaEntao(proxima, 1400);
        } else {
          tentou = true;
          audio.erro();
          b.classList.add('tremida');
          b.disabled = true;
          voz.falar('Observe as linhas e as colunas. Você também pode contar um por um.');
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
