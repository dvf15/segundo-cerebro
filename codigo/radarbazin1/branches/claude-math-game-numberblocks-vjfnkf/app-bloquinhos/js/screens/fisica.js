// Laboratório de Física — as leis da física vividas em experimentos lúdicos.
// Padrão pedagógico: PREVER (a criança aposta) → EXPERIMENTAR (animação) →
// OBSERVAR → EXPLICAR (a lei ganha nome só depois de vista).
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { criarRobo } from '../robos.js';
import { confete } from '../engine.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { popupAviso } from '../popup.js';
import { fimDeJogo } from './jogos.js';
import { missaoInercia } from '../fisica/inercia.js';
import { missaoForca } from '../fisica/forca.js';
import { missaoReacao } from '../fisica/reacao.js';
import { missaoGravidade } from '../fisica/gravidade.js';
import { missaoCalor } from '../fisica/calor.js';

export const EXPERIMENTOS = [
  { id: 'inercia', emoji: '🧊', nome: 'Caixa Teimosa', desc: 'Inércia: por que as coisas não param sozinhas?', cor: '#2196c9', montar: missaoInercia },
  { id: 'forca', emoji: '💪', nome: 'Empurra-Empurra', desc: 'Força e massa: leve voa, pesado custa', cor: '#e63946', montar: missaoForca },
  { id: 'reacao', emoji: '🛹', nome: 'Robô no Skate', desc: 'Ação e reação: todo empurrão volta', cor: '#8e44ad', montar: missaoReacao },
  { id: 'gravidade', emoji: '🌙', nome: 'Queda Livre', desc: 'Gravidade: martelo, pena, Terra e Lua', cor: '#3f51b5', montar: missaoGravidade },
  { id: 'calor', emoji: '🌡️', nome: 'Quente e Frio', desc: 'Termodinâmica: calor, partículas e estados', cor: '#c2410c', montar: missaoCalor },
];

export function telaFisica(el, { navegar, params }) {
  const exp = EXPERIMENTOS.find(e => e.id === params.experimento);
  if (exp) {
    document.getElementById('titulo-tela').textContent = exp.nome;
    return exp.montar(el, { navegar });
  }

  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';

  const recepcao = document.createElement('div');
  recepcao.style.cssText = 'display:flex;justify-content:center;gap:16px;align-items:center';
  recepcao.appendChild(criarRobo({ tamanho: 60, cor: '#a0ffb0' }));
  const oi = document.createElement('p');
  oi.className = 'dica-flutuante';
  oi.textContent = 'Bem-vindo ao laboratório! Faça sua aposta e veja a física acontecer.';
  recepcao.appendChild(oi);
  raiz.appendChild(recepcao);

  const grade = document.createElement('div');
  grade.className = 'grade-menu';
  for (const e of EXPERIMENTOS) {
    const rec = store.dados.recordes['fis-' + e.id];
    const b = document.createElement('button');
    b.className = 'card-modo';
    b.style.background = e.cor;
    b.innerHTML = `<span class="emoji">${e.emoji}</span><span>${e.nome}</span><small>${e.desc}</small>` +
      `<small>${rec ? `Recorde: ${rec}` : '— nunca testado —'}</small>`;
    b.addEventListener('click', () => { audio.clique(); navegar('fisica', { experimento: e.id }); });
    grade.appendChild(b);
  }
  raiz.appendChild(grade);
  el.appendChild(raiz);
}

// ---------- executor comum dos experimentos ----------

/** Tween simples com requestAnimationFrame. Retorna função de cancelamento. */
export function animar(duracao, passo, aoTerminar) {
  let cancelado = false;
  const t0 = performance.now();
  const laco = (t) => {
    if (cancelado) return;
    const k = Math.min(1, (t - t0) / duracao);
    passo(k);
    if (k < 1) requestAnimationFrame(laco);
    else aoTerminar && aoTerminar();
  };
  requestAnimationFrame(laco);
  return () => { cancelado = true; };
}

/** Cena SVG padrão do laboratório (320×160 com chão). */
export function novaCena(chaoCor = '#8d7bb8') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 320 160');
  svg.setAttribute('class', 'rampa-cena');
  svg.innerHTML = `<line x1="0" y1="140" x2="320" y2="140" stroke="${chaoCor}" stroke-width="4"/>`;
  return svg;
}

/**
 * Roda uma missão do laboratório.
 * Cada rodada: { pergunta, fala?, opcoes: [{rotulo, certa}], cenaInicial?(svg),
 *               experimento?(svg, animarFn) → Promise, descoberta }
 */
export function rodarExperimentos(el, ctx, { id, rodadas, minimo, mensagem }) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let rodada = 0, acertos = 0, vivo = true;
  const cancelamentos = [];
  const animarSeguro = (dur, passo, fim) => {
    const cancelar = animar(dur, (k) => { if (vivo) passo(k); }, () => { if (vivo) fim && fim(); });
    cancelamentos.push(cancelar);
  };

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > rodadas.length) {
      raiz.innerHTML = '';
      const venceu = acertos >= minimo;
      if (venceu) { audio.vitoria(); confete(50); }
      return fimDeJogo(raiz, {
        navegar: ctx.navegar,
        jogoId: 'fis-' + id,
        venceu,
        pontos: acertos,
        mensagem: mensagem(acertos, rodadas.length),
        aoRepetir: () => ctx.navegar('fisica', { experimento: id }),
        aoVoltar: () => ctx.navegar('fisica'),
        rotuloVoltar: 'Outros experimentos',
      });
    }
    raiz.innerHTML = '';

    const r = rodadas[rodada - 1];
    let tentou = false;

    const placar = document.createElement('div');
    placar.className = 'placar-jogo';
    placar.innerHTML = `<span>Experimento <b>${rodada}</b> / ${rodadas.length}</span><span>🔬 Apostas certas: <b>${acertos}</b></span>`;
    raiz.appendChild(placar);

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const topo = document.createElement('div');
    topo.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px';
    topo.appendChild(criarRobo({ tamanho: 42, cor: '#a0ffb0' }));
    const perg = document.createElement('p');
    perg.style.cssText = 'font-weight:800;font-size:1.05rem';
    perg.textContent = r.pergunta;
    topo.appendChild(perg);
    painel.appendChild(topo);
    voz.falar(r.fala || r.pergunta);

    let svg = null;
    if (r.cenaInicial) {
      svg = novaCena(r.chaoCor);
      r.cenaInicial(svg);
      painel.appendChild(svg);
    }

    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    const aposResposta = () => {
      linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
      const revelar = () => {
        if (!vivo) return;
        const desc = document.createElement('p');
        desc.className = 'passo-solucao';
        desc.innerHTML = `💡 <b>Lei da física:</b> ${r.descoberta}`;
        painel.appendChild(desc);
        voz.falar(r.descoberta);
        esperarFalaEntao(() => { if (vivo) proxima(); }, 1600);
      };
      if (r.experimento && svg) {
        const aviso = document.createElement('p');
        aviso.style.cssText = 'font-weight:800;margin-top:.3rem';
        aviso.textContent = '🔬 Vamos ver o que acontece…';
        painel.appendChild(aviso);
        r.experimento(svg, animarSeguro).then(() => { aviso.remove(); revelar(); });
      } else {
        revelar();
      }
    };
    for (const op of r.opcoes) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      b.style.cssText = 'background:var(--tinta);min-width:104px;font-size:.92rem;padding:.5rem .7rem';
      b.textContent = op.rotulo;
      b.addEventListener('click', () => {
        if (op.certa) {
          if (!tentou) acertos++;
          audio.fusao();
          aposResposta();
        } else {
          tentou = true;
          audio.erro();
          b.classList.add('tremida');
          b.disabled = true;
          popupAviso('Pense com calma');
        }
      });
      linha.appendChild(b);
    }
    painel.appendChild(linha);
    raiz.appendChild(painel);
  }

  proxima();
  return () => { vivo = false; cancelamentos.forEach(c => c()); };
}
