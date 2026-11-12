// Trilha do Tesouro — corrida de continhas, 1 jogador (contra o Robô) ou 2 no mesmo aparelho.
import { gerarConta } from '../gerador.js';
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { fimDeJogo } from '../screens/jogos.js';
import { criarRobo } from '../robos.js';
import { voz, falaDaConta, botaoOuvir, esperarFalaEntao } from '../voz.js';

const CASAS = 20;

export function jogoTrilha(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  // ------- escolha de modo -------
  const escolha = document.createElement('div');
  escolha.className = 'painel-conta';
  escolha.innerHTML = '<p style="font-weight:800;font-size:1.15rem">Quem vai correr até o tesouro?</p>';
  const linha = document.createElement('div');
  linha.style.cssText = 'display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-top:.7rem';
  const b1 = document.createElement('button');
  b1.className = 'btn grande';
  b1.style.background = 'var(--c5)';
  b1.textContent = '🙂 Eu contra o Robô 🤖';
  const b2 = document.createElement('button');
  b2.className = 'btn grande';
  b2.style.background = 'var(--c7)';
  b2.textContent = '🙂 Dois jogadores 😀';
  linha.appendChild(b1); linha.appendChild(b2);
  escolha.appendChild(linha);
  raiz.appendChild(escolha);

  b1.addEventListener('click', () => { audio.clique(); iniciar(false); });
  b2.addEventListener('click', () => { audio.clique(); iniciar(true); });

  let vivo = true;

  function iniciar(doisJogadores) {
    raiz.innerHTML = '';
    const jogadores = doisJogadores
      ? [{ nome: 'Jogador 1', emoji: '🙂', pos: 0, acertos: 0 }, { nome: 'Jogador 2', emoji: '😀', pos: 0, acertos: 0 }]
      : [{ nome: 'Você', emoji: '🙂', pos: 0, acertos: 0 }, { nome: 'Robô Bloco', emoji: '🤖', pos: 0, robo: true }];
    let vez = 0;

    const placar = document.createElement('div');
    placar.className = 'placar-jogo';
    raiz.appendChild(placar);

    const tabuleiro = document.createElement('div');
    tabuleiro.className = 'trilha-tabuleiro';
    const casas = [];
    for (let i = 1; i <= CASAS; i++) {
      const c = document.createElement('div');
      c.className = 'casa' + (i === CASAS ? ' tesouro' : '');
      c.textContent = i === CASAS ? '💎' : i;
      tabuleiro.appendChild(c);
      casas.push(c);
    }
    raiz.appendChild(tabuleiro);

    const zona = document.createElement('div');
    zona.className = 'painel-conta';
    raiz.appendChild(zona);

    function desenhar() {
      casas.forEach(c => c.querySelectorAll('.peao').forEach(p => p.remove()));
      jogadores.forEach((j, i) => {
        if (j.pos > 0) {
          const p = document.createElement('span');
          p.className = 'peao ' + (i === 0 ? 'p1' : 'p2');
          p.textContent = j.emoji;
          casas[Math.min(j.pos, CASAS) - 1].appendChild(p);
        }
      });
      placar.innerHTML = jogadores.map((j, i) =>
        `<span style="${i === vez ? 'text-decoration:underline' : 'opacity:.7'}">${j.emoji} ${j.nome}: casa <b>${j.pos}</b></span>`).join('');
    }

    function mover(j, passos) {
      j.pos = Math.min(CASAS, j.pos + passos);
      desenhar();
      if (j.pos >= CASAS) return fimTrilha(j);
      vez = (vez + 1) % 2;
      turno();
    }

    function fimTrilha(vencedor) {
      if (!vivo) return;
      const eu = jogadores[0];
      const venceu = doisJogadores || vencedor === eu;
      if (venceu) { audio.vitoria(); confete(60); } else audio.erro();
      zona.innerHTML = '';
      fimDeJogo(raiz, {
        ...ctx, jogoId: 'trilha',
        venceu,
        pontos: eu.acertos,
        mensagem: doisJogadores
          ? `${vencedor.emoji} ${vencedor.nome} chegou ao tesouro primeiro!`
          : vencedor === eu
            ? `Você venceu o Robô Bloco acertando ${eu.acertos} continhas!`
            : 'O Robô Bloco chegou primeiro. Revanche?',
      });
    }

    function turno() {
      if (!vivo) return;
      const j = jogadores[vez];
      zona.innerHTML = '';

      if (j.robo) { // o robô anda sozinho, devagarzinho
        const passos = 1 + Math.floor(Math.random() * 3);
        zona.innerHTML = `<p style="font-weight:800">O Robô Bloco pensou... e andou <b>${passos}</b> casa${passos === 1 ? '' : 's'}.</p>`;
        zona.prepend(criarRobo({ tamanho: 52, cor: '#ffb0e6' }));
        setTimeout(() => { if (vivo) mover(j, passos); }, 1400);
        return;
      }

      const titulo = document.createElement('p');
      titulo.style.cssText = 'font-weight:800;font-size:1.1rem';
      titulo.textContent = `${j.emoji} ${j.nome}: role o dado!`;
      zona.appendChild(titulo);

      const rolar = document.createElement('button');
      rolar.className = 'btn grande';
      rolar.style.background = 'var(--c6)';
      rolar.textContent = '🎲 Rolar dado';
      zona.appendChild(rolar);

      rolar.addEventListener('click', () => {
        audio.pop();
        const dado = 1 + Math.floor(Math.random() * 6);
        zona.innerHTML = '';

        // conta rápida: acertou anda o dado inteiro, errou anda 1
        const nivel = j.pos < 8 ? 'faisca' : 'chama';
        const conta = gerarConta(nivel, j.pos < 8 ? 3 : 2);

        const p = document.createElement('p');
        p.style.cssText = 'font-weight:800;font-size:1.05rem';
        p.innerHTML = `🎲 Deu <b>${dado}</b>! Acerte para andar ${dado} casa${dado === 1 ? '' : 's'} (errou, anda 1):`;
        zona.appendChild(p);

        const linhaEnun = document.createElement('div');
        linhaEnun.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:.6rem';
        const enun = document.createElement('p');
        enun.className = 'enunciado';
        enun.style.fontSize = '1.7rem';
        enun.innerHTML = conta.texto.replace(/\?$/, '<span class="lacuna">?</span>');
        linhaEnun.appendChild(enun);
        linhaEnun.appendChild(botaoOuvir(() => falaDaConta(conta.texto)));
        zona.appendChild(linhaEnun);
        voz.falar(falaDaConta(conta.texto));

        // três opções de resposta
        const ops = new Set([conta.resposta]);
        while (ops.size < 3) {
          const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 3));
          const d = conta.resposta + delta;
          if (d >= 0) ops.add(d);
        }
        const linhaOps = document.createElement('div');
        linhaOps.style.cssText = 'display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap';
        [...ops].sort(() => Math.random() - 0.5).forEach(v => {
          const b = document.createElement('button');
          b.className = 'btn grande';
          b.style.background = 'var(--tinta)';
          b.textContent = v;
          b.addEventListener('click', () => {
            linhaOps.querySelectorAll('button').forEach(x => { x.disabled = true; });
            if (v === conta.resposta) {
              j.acertos = (j.acertos || 0) + 1;
              audio.fusao();
              enun.innerHTML = conta.texto.replace(/\?$/, `<span style="color:var(--c4)">${conta.resposta}</span>`);
              p.textContent = `✔ Acertou! Ande ${dado} casa${dado === 1 ? '' : 's'}.`;
              voz.falar(p.textContent.slice(2));
              esperarFalaEntao(() => mover(j, dado), 700);
            } else {
              audio.erro();
              enun.innerHTML = conta.texto.replace(/\?$/, `<span style="color:var(--c1)">${conta.resposta}</span>`);
              p.textContent = `✖ Errou — a resposta era ${conta.resposta}. Ande 1 casa.`;
              esperarFalaEntao(() => mover(j, 1), 900);
            }
          });
          linhaOps.appendChild(b);
        });
        zona.appendChild(linhaOps);
      }, { once: true });
    }

    desenhar();
    turno();
  }

  return () => { vivo = false; };
}
