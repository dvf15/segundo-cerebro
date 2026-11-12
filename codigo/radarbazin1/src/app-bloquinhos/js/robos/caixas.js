// Fábrica de Caixas — volume concreto: contar cubinhos, pensar por camadas
// e generalizar comprimento × largura × altura (base: "Cidade dos Números").
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { placarMissao, fimMissao, opcoesNumericas } from '../screens/robos.js';

const RODADAS = 8;

/** Construção 3D estilizada: cubos em camadas com profundidade deslocada. */
export function svgConstrucao(comp, larg, alt, { cubo = 34 } = {}) {
  const desloc = cubo * 0.42;
  const w = comp * cubo + (larg - 1) * desloc + 4;
  const h = alt * cubo + (larg - 1) * desloc + 4;
  let corpo = '';
  // de trás para a frente para a sobreposição ficar correta
  for (let d = larg - 1; d >= 0; d--) {
    for (let l = 0; l < alt; l++) {
      for (let c = 0; c < comp; c++) {
        const x = c * cubo + d * desloc + 2;
        const y = h - (l + 1) * cubo - d * desloc - 2;
        const tom = d === 0 ? '#62b6f0' : d === 1 ? '#4a9fd8' : '#3a88c0';
        corpo += `<rect x="${x}" y="${y}" width="${cubo - 2}" height="${cubo - 2}" rx="4" fill="${tom}" stroke="#29496b" stroke-width="2"/>` +
          `<rect x="${x + 3}" y="${y + 3}" width="${cubo - 8}" height="6" rx="3" fill="#ffffff" opacity="0.35"/>`;
      }
    }
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="construção com comprimento ${comp}, largura ${larg} e altura ${alt}">${corpo}</svg>`;
}

function planejarRodadas() {
  const rodadas = [];
  // 1-2: contar tudo (uma camada só — construir e contar)
  for (let i = 0; i < 2; i++) {
    const comp = 2 + Math.floor(Math.random() * 3), larg = 1 + Math.floor(Math.random() * 2);
    const total = comp * larg;
    rodadas.push({
      caixa: [comp, larg, 1],
      pergunta: 'Quantos cubinhos o robô usou nesta construção?',
      certa: total,
      opcoes: opcoesNumericas(total, [total + 1, total - 1, comp + larg]),
      descoberta: `Uma camada com ${comp} × ${larg} = ${total} cubinhos.`,
    });
  }
  // 3-4 e 5-6: a mesma caixa em dupla — primeiro a camada, depois o total
  for (let i = 0; i < 2; i++) {
    const comp = 2 + Math.floor(Math.random() * 2), larg = 2, alt = 2 + Math.floor(Math.random() * 2);
    const camada = comp * larg, total = camada * alt;
    rodadas.push({
      caixa: [comp, larg, alt],
      pergunta: 'Quantos cubinhos tem CADA camada desta construção?',
      certa: camada,
      opcoes: opcoesNumericas(camada, [camada + comp, camada - comp, total]),
      descoberta: `Cada camada tem ${comp} × ${larg} = ${camada} cubinhos.`,
    });
    rodadas.push({
      caixa: [comp, larg, alt],
      pergunta: `Ela tem ${alt} camadas de ${camada}. Quantos cubinhos ao TODO?`,
      certa: total,
      opcoes: opcoesNumericas(total, [total + camada, total - camada, camada + alt]),
      descoberta: `${camada} cubinhos por camada × ${alt} camadas = ${total}. Isso é o VOLUME!`,
    });
  }
  // 7-8: generalização — comprimento × largura × altura
  for (let i = 0; i < 2; i++) {
    const comp = 2 + Math.floor(Math.random() * 3), larg = 1 + Math.floor(Math.random() * 2), alt = 2 + Math.floor(Math.random() * 2);
    const total = comp * larg * alt;
    rodadas.push({
      caixa: [comp, larg, alt],
      pergunta: 'Quantos cubinhos cabem nesta caixa?',
      certa: total,
      opcoes: opcoesNumericas(total, [comp * larg, comp + larg + alt, total + comp]),
      descoberta: `Comprimento × largura × altura: ${comp} × ${larg} × ${alt} = ${total} cubinhos.`,
    });
  }
  return rodadas;
}

export function missaoCaixas(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  const rodadas = planejarRodadas();
  let rodada = 0, acertos = 0, vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) {
      return fimMissao(raiz, ctx, 'caixas', {
        venceu: acertos >= 6,
        pontos: acertos,
        mensagem: `A fábrica aprovou ${acertos} de ${RODADAS} caixas de primeira!`,
      });
    }
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(rodada, RODADAS, acertos));

    const r = rodadas[rodada - 1];
    let tentou = false;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const topo = document.createElement('div');
    topo.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px';
    topo.appendChild(criarRobo({ tamanho: 44, cor: '#ffd166' }));
    const perg = document.createElement('p');
    perg.style.cssText = 'font-weight:800;font-size:1.1rem';
    perg.textContent = r.pergunta;
    topo.appendChild(perg);
    painel.appendChild(topo);
    voz.falar(r.pergunta);

    const zona = document.createElement('div');
    zona.className = 'visual-blocos';
    zona.innerHTML = svgConstrucao(...r.caixa);
    painel.appendChild(zona);

    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    for (const op of r.opcoes) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      b.style.cssText = 'background:var(--tinta);min-width:76px;font-size:1.3rem';
      b.textContent = op;
      b.addEventListener('click', () => {
        if (op === r.certa) {
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
          voz.falar('Tente contar camada por camada.');
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
