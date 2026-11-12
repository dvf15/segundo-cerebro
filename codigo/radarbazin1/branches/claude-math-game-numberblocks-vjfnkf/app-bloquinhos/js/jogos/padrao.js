// Padrão Maluco — descubra qual bloquinho continua a sequência.
import { svgPersonagem, PERSONAGENS, corTexto } from '../characters.js';
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { popupAviso } from '../popup.js';
import { fimDeJogo } from '../screens/jogos.js';

const RODADAS = 8;

// geradores de padrão: retornam a sequência completa (4 mostrados + resposta), tudo entre 1 e 9
const maisUm = () => { const i = 1 + Math.floor(Math.random() * 4); return [i, i + 1, i + 2, i + 3, i + 4]; };
const maisDois = () => [1, 3, 5, 7, 9];
const alternado = () => { const a = 1 + Math.floor(Math.random() * 4), b = 5 + Math.floor(Math.random() * 4); return [a, b, a, b, a]; };
const menosUm = () => { const i = 5 + Math.floor(Math.random() * 4); return [i, i - 1, i - 2, i - 3, i - 4]; };
const umDoisUmDois = () => { const i = 1 + Math.floor(Math.random() * 3); return [i, i + 1, i + 3, i + 4, i + 6]; };

function gerarPadrao(rodada) {
  // rodadas 1-2: +1; 3-4: alternado; 5-6: -1; 7-8: +2 ou +1,+2
  if (rodada <= 2) return maisUm();
  if (rodada <= 4) return alternado();
  if (rodada <= 6) return menosUm();
  return Math.random() < 0.5 ? maisDois() : umDoisUmDois();
}

export function jogoPadrao(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let rodada = 0, acertos = 0;
  let vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) return fim();
    raiz.innerHTML = '';

    const placar = document.createElement('div');
    placar.className = 'placar-jogo';
    placar.innerHTML = `<span>Rodada <b>${rodada}</b> / ${RODADAS}</span><span>Acertos: <b>${acertos}</b></span>`;
    raiz.appendChild(placar);

    const seq = gerarPadrao(rodada);
    const resposta = seq[4];

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    painel.innerHTML = '<p style="font-weight:800;font-size:1.1rem">Qual bloquinho vem depois?</p>';

    const fila = document.createElement('div');
    fila.className = 'visual-blocos';
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('div');
      d.className = 'grupo-quantidade';
      d.innerHTML = svgPersonagem(seq[i], { cubo: 16, rotulo: true }).svg;
      fila.appendChild(d);
    }
    const interr = document.createElement('div');
    interr.className = 'grupo-quantidade';
    interr.innerHTML = '<span style="font-size:2.6rem;font-weight:900;color:var(--c5)">?</span>';
    fila.appendChild(interr);
    painel.appendChild(fila);

    // opções: resposta + 2 distratores
    const opcoes = new Set([resposta]);
    while (opcoes.size < 3) {
      const d = Math.max(1, Math.min(9, resposta + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 3))));
      opcoes.add(d);
    }
    const lista = [...opcoes].sort(() => Math.random() - 0.5);

    const linhaOpcoes = document.createElement('div');
    linhaOpcoes.className = 'visual-blocos';
    let tentou = false;
    for (const v of lista) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      b.style.cssText = `background:${PERSONAGENS[v].hex};color:${corTexto(PERSONAGENS[v].hex)};min-width:64px;min-height:64px;font-size:1.6rem`;
      b.textContent = v;
      b.setAttribute('aria-label', `Escolher ${v}`);
      b.addEventListener('click', () => {
        if (v === resposta) {
          if (!tentou) acertos++;
          audio.fusao();
          interr.innerHTML = svgPersonagem(resposta, { cubo: 16, rotulo: true }).svg;
          linhaOpcoes.querySelectorAll('button').forEach(x => { x.disabled = true; });
          setTimeout(proxima, 900);
        } else {
          tentou = true;
          audio.erro();
          b.classList.add('tremida');
          b.disabled = true;
          popupAviso('Pense com calma');
        }
      });
      linhaOpcoes.appendChild(b);
    }
    painel.appendChild(linhaOpcoes);
    raiz.appendChild(painel);
  }

  function fim() {
    if (!vivo) return;
    raiz.innerHTML = '';
    const venceu = acertos >= 6;
    if (venceu) { audio.vitoria(); confete(50); } else audio.fala();
    fimDeJogo(raiz, { ...ctx, jogoId: 'padrao', venceu, pontos: acertos, mensagem: `Você acertou ${acertos} de ${RODADAS} padrões de primeira.` });
  }

  proxima();
  return () => { vivo = false; };
}
