// Caça-Quadrados — monte o maior quadrado possível com N cubinhos.
import { svgRetangulo } from '../characters.js';
import { audio } from '../audio.js';
import { confete, anunciar } from '../engine.js';
import { fimDeJogo } from '../screens/jogos.js';

const RODADAS = 6;

export function jogoQuadrados(el, ctx) {
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

    const n = 5 + Math.floor(Math.random() * 36); // 5..40
    const resposta = Math.floor(Math.sqrt(n));
    let lado = 1;
    let tentativas = 0;

    const placar = document.createElement('div');
    placar.className = 'placar-jogo';
    placar.innerHTML = `<span>Rodada <b>${rodada}</b> / ${RODADAS}</span><span>Acertos: <b>${acertos}</b></span>`;
    raiz.appendChild(placar);

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    painel.innerHTML = `<p style="font-weight:800;font-size:1.15rem">Você tem <b style="color:var(--c5)">${n}</b> cubinhos.</p>` +
      `<p>Qual o MAIOR quadrado que dá para montar?</p>`;

    const preview = document.createElement('div');
    preview.className = 'visual-blocos';
    const infoLado = document.createElement('p');
    infoLado.style.cssText = 'font-weight:900;font-size:1.3rem';
    infoLado.setAttribute('aria-live', 'polite');

    function desenhar() {
      const usa = lado * lado;
      preview.innerHTML = svgRetangulo(lado, lado, { cubo: Math.min(22, 220 / lado), destaque: usa <= n ? Infinity : n });
      infoLado.innerHTML = `Lado ${lado} → ${lado} × ${lado} = <b>${usa}</b> cubinhos ` +
        (usa <= n ? `<span style="color:var(--c4)">(sobram ${n - usa})</span>` : `<span style="color:var(--c1)">(faltam ${usa - n}!)</span>`);
    }
    desenhar();

    const controles = document.createElement('div');
    controles.style.cssText = 'display:flex;gap:.6rem;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:.5rem';
    const menos = document.createElement('button');
    menos.className = 'btn secundario';
    menos.textContent = '−';
    menos.setAttribute('aria-label', 'Diminuir o lado do quadrado');
    const mais = document.createElement('button');
    mais.className = 'btn secundario';
    mais.textContent = '+';
    mais.setAttribute('aria-label', 'Aumentar o lado do quadrado');
    const ok = document.createElement('button');
    ok.className = 'btn';
    ok.style.background = 'var(--c4)';
    ok.textContent = 'É esse!';
    menos.addEventListener('click', () => { if (lado > 1) { lado--; audio.clique(); desenhar(); } });
    mais.addEventListener('click', () => { if (lado < 7) { lado++; audio.clique(); desenhar(); } });
    ok.addEventListener('click', () => {
      if (lado === resposta) {
        if (tentativas === 0) acertos++;
        audio.fusao();
        [menos, mais, ok].forEach(b => { b.disabled = true; });
        const okMsg = document.createElement('p');
        okMsg.style.cssText = 'font-weight:900;color:var(--c4);font-size:1.2rem';
        okMsg.textContent = `🟩 Isso! ${resposta} × ${resposta} = ${resposta * resposta} é o maior que cabe em ${n}.`;
        anunciar(okMsg.textContent);
        painel.appendChild(okMsg);
        setTimeout(proxima, 1400);
      } else {
        tentativas++;
        audio.erro();
        const msg = document.createElement('p');
        msg.className = 'passo-solucao';
        msg.textContent = lado < resposta ? 'Cabe um quadrado maior ainda! Tente aumentar.' : 'Esse passou dos cubinhos que você tem. Diminua!';
        anunciar(msg.textContent);
        painel.appendChild(msg);
        setTimeout(() => msg.remove(), 2200);
        if (tentativas >= 3) {
          lado = resposta;
          desenhar();
          [menos, mais, ok].forEach(b => { b.disabled = true; });
          const sol = document.createElement('p');
          sol.className = 'passo-solucao';
          sol.innerHTML = `A resposta era lado <b>${resposta}</b>: ${resposta} × ${resposta} = ${resposta * resposta} ≤ ${n}.`;
          painel.appendChild(sol);
          setTimeout(proxima, 2600);
        }
      }
    });
    controles.appendChild(menos);
    controles.appendChild(infoLado);
    controles.appendChild(mais);
    painel.appendChild(preview);
    painel.appendChild(controles);
    painel.appendChild(ok);
    ok.style.marginTop = '.7rem';
    raiz.appendChild(painel);
  }

  function fim() {
    if (!vivo) return;
    raiz.innerHTML = '';
    const venceu = acertos >= 4;
    if (venceu) { audio.vitoria(); confete(50); } else audio.fala();
    fimDeJogo(raiz, { ...ctx, jogoId: 'quadrados', venceu, pontos: acertos, mensagem: `Você achou ${acertos} de ${RODADAS} quadrados de primeira.` });
  }

  proxima();
  return () => { vivo = false; };
}
