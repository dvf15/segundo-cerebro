// Balança Justa — pré-álgebra sem susto: 3 + ? = 7.
import { PERSONAGENS, corTexto } from '../characters.js';
import { audio } from '../audio.js';
import { confete, anunciar } from '../engine.js';
import { fimDeJogo } from '../screens/jogos.js';
import { voz, botaoOuvir, esperarFalaEntao } from '../voz.js';

const RODADAS = 8;

function svgBalanca(esq, dir, inclinacao) {
  // inclinacao: -1 (esquerda pesa), 0 (equilíbrio), 1 (direita pesa)
  const ang = inclinacao * 9;
  const blocos = (valores, cx) => valores.map((v, i) =>
    `<g><rect x="${cx - (valores.length * 34) / 2 + i * 34}" y="-46" width="30" height="30" rx="6" fill="${PERSONAGENS[v].hex}" stroke="${PERSONAGENS[v].escura}" stroke-width="2"/>` +
    `<text x="${cx - (valores.length * 34) / 2 + i * 34 + 15}" y="-25" text-anchor="middle" font-size="17" font-weight="900" fill="#fff">${v}</text></g>`
  ).join('');
  const prato = (cx) =>
    `<line x1="${cx}" y1="0" x2="${cx - 34}" y2="-14" stroke="#1d3557" stroke-width="3"/>` +
    `<line x1="${cx}" y1="0" x2="${cx + 34}" y2="-14" stroke="#1d3557" stroke-width="3"/>` +
    `<path d="M ${cx - 44} -14 A 44 26 0 0 0 ${cx + 44} -14 Z" fill="#cfd8e3" stroke="#1d3557" stroke-width="2.5"/>`;
  return `<svg class="balanca-svg" viewBox="0 0 420 210" role="img" aria-label="balança com ${esq.join(' e ')} à esquerda e ${dir.join(' e ') || 'nada'} à direita">
    <g transform="translate(210,120) rotate(${ang})">
      <rect x="-150" y="-5" width="300" height="10" rx="5" fill="#1d3557"/>
      <g transform="translate(-120,5)">${prato(0)}${blocos(esq, 0)}</g>
      <g transform="translate(120,5)">${prato(0)}${blocos(dir, 0)}</g>
    </g>
    <polygon points="196,206 224,206 210,118" fill="#a26a42" stroke="#6b4226" stroke-width="2"/>
  </svg>`;
}

export function jogoBalanca(el, ctx) {
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

    // esquerda: a + b; direita: c + ? — resposta entre 1 e 9
    const a = 1 + Math.floor(Math.random() * 8);
    const b = 1 + Math.floor(Math.random() * Math.min(9, 15 - a));
    const total = a + b;
    const c = Math.max(1, total - 9) + Math.floor(Math.random() * (Math.min(9, total - 1) - Math.max(1, total - 9) + 1));
    const resposta = total - c;
    let tentativas = 0;

    const placar = document.createElement('div');
    placar.className = 'placar-jogo';
    placar.innerHTML = `<span>Rodada <b>${rodada}</b> / ${RODADAS}</span><span>Acertos: <b>${acertos}</b></span>`;
    raiz.appendChild(placar);

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    painel.innerHTML = `<p style="font-weight:800;font-size:1.15rem">Equilibre a balança!</p>` +
      `<p class="enunciado" style="font-size:1.6rem">${a} + ${b} = ${c} + <span class="lacuna">?</span></p>`;
    const falaBalanca = `Equilibre a balança! ${a} mais ${b} é igual a ${c} mais quanto?`;
    painel.appendChild(botaoOuvir(falaBalanca));
    voz.falar(falaBalanca);
    const zona = document.createElement('div');
    zona.innerHTML = svgBalanca([a, b], [c], -1);
    painel.appendChild(zona);

    const botoes = document.createElement('div');
    botoes.className = 'visual-blocos';
    for (let v = 1; v <= 9; v++) {
      const btn = document.createElement('button');
      btn.className = 'bloco-jogo';
      btn.style.background = PERSONAGENS[v].hex;
      btn.style.color = corTexto(PERSONAGENS[v].hex);
      btn.textContent = v;
      btn.setAttribute('aria-label', `Colocar o bloco ${v} na balança`);
      btn.addEventListener('click', () => {
        audio.encaixe();
        const soma = c + v;
        const inc = soma === total ? 0 : soma < total ? -1 : 1;
        zona.innerHTML = svgBalanca([a, b], [c, v], inc);
        if (v === resposta) {
          if (tentativas === 0) acertos++;
          audio.fusao();
          botoes.querySelectorAll('button').forEach(x => { x.disabled = true; });
          const ok = document.createElement('p');
          ok.style.cssText = 'font-weight:900;color:var(--c4);font-size:1.2rem';
          ok.textContent = '⚖️ Equilibrou!';
          anunciar(`Equilibrou! ${a} mais ${b} é igual a ${c} mais ${v}.`);
          painel.appendChild(ok);
          esperarFalaEntao(proxima, 900);
        } else {
          tentativas++;
          audio.erro();
          btn.disabled = true;
          if (tentativas >= 2) {
            const sol = document.createElement('p');
            sol.className = 'passo-solucao';
            sol.innerHTML = `Os dois lados precisam somar <b>${total}</b>. Como ${c} + <b>${resposta}</b> = ${total}, o bloco certo era o <b>${resposta}</b>.`;
            anunciar(`O bloco certo era o ${resposta}.`);
            painel.appendChild(sol);
            botoes.querySelectorAll('button').forEach(x => { x.disabled = true; });
            zona.innerHTML = svgBalanca([a, b], [c, resposta], 0);
            esperarFalaEntao(proxima, 1600);
          }
        }
      });
      botoes.appendChild(btn);
    }
    painel.appendChild(botoes);
    raiz.appendChild(painel);
  }

  function fim() {
    if (!vivo) return;
    raiz.innerHTML = '';
    const venceu = acertos >= 6;
    if (venceu) { audio.vitoria(); confete(50); } else audio.fala();
    fimDeJogo(raiz, { ...ctx, jogoId: 'balanca', venceu, pontos: acertos, mensagem: `Você equilibrou ${acertos} de ${RODADAS} balanças de primeira.` });
  }

  proxima();
  return () => { vivo = false; };
}
