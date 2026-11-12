// Complete o 10 — toque nos pares que somam 10 antes que a tela encha.
import { PERSONAGENS, corTexto } from '../characters.js';
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { fimDeJogo } from '../screens/jogos.js';

const LINHAS = 5, COLUNAS = 4, META = 10;
const PARES = [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5]];

export function jogoComplete10(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  const placar = document.createElement('div');
  placar.className = 'placar-jogo';
  raiz.appendChild(placar);

  const dica = document.createElement('p');
  dica.className = 'dica-flutuante';
  dica.textContent = 'Toque em DOIS bloquinhos que somem 10. Não deixe a tela encher!';
  raiz.appendChild(dica);

  const grade = document.createElement('div');
  grade.className = 'grade-jogo';
  grade.style.gridTemplateColumns = `repeat(${COLUNAS}, 62px)`;
  raiz.appendChild(grade);

  const celulas = []; // {btn, valor|null}
  let marcado = null;
  let paresFeitos = 0;
  let acabou = false;
  let timer = null;

  for (let i = 0; i < LINHAS * COLUNAS; i++) {
    const btn = document.createElement('button');
    btn.className = 'bloco-jogo vazio';
    btn.disabled = true;
    const cel = { btn, valor: null };
    btn.addEventListener('click', () => tocar(cel));
    grade.appendChild(btn);
    celulas.push(cel);
  }

  function atualizarPlacar() {
    placar.innerHTML = `<span>Pares: <b>${paresFeitos}</b> / ${META}</span>` +
      `<span>Cheio: <b>${celulas.filter(c => c.valor !== null).length}</b> / ${celulas.length}</span>`;
  }

  function definir(cel, valor) {
    cel.valor = valor;
    if (valor === null) {
      cel.btn.className = 'bloco-jogo vazio';
      cel.btn.textContent = '';
      cel.btn.disabled = true;
      cel.btn.removeAttribute('aria-label');
    } else {
      cel.btn.className = 'bloco-jogo';
      cel.btn.style.background = PERSONAGENS[valor].hex;
      cel.btn.style.color = corTexto(PERSONAGENS[valor].hex);
      cel.btn.textContent = valor;
      cel.btn.disabled = false;
      cel.btn.setAttribute('aria-label', `Bloco ${valor}`);
    }
  }

  function surgirPar() {
    if (acabou) return;
    const vazias = celulas.filter(c => c.valor === null);
    if (vazias.length < 2) return perder();
    const [a, b] = PARES[Math.floor(Math.random() * PARES.length)];
    for (const v of [a, b]) {
      const livres = celulas.filter(c => c.valor === null);
      const cel = livres[Math.floor(Math.random() * livres.length)];
      definir(cel, v);
    }
    audio.pop();
    atualizarPlacar();
    if (celulas.every(c => c.valor !== null)) perder();
  }

  function tocar(cel) {
    if (acabou || cel.valor === null) return;
    audio.clique();
    if (marcado === cel) {
      cel.btn.classList.remove('marcado');
      marcado = null;
      return;
    }
    if (!marcado) {
      marcado = cel;
      cel.btn.classList.add('marcado');
      return;
    }
    // segundo toque
    if (marcado.valor + cel.valor === 10) {
      audio.fusao();
      paresFeitos++;
      definir(marcado, null);
      definir(cel, null);
      marcado.btn.classList.remove('marcado');
      marcado = null;
      atualizarPlacar();
      if (paresFeitos >= META) vencer();
    } else {
      audio.erro();
      [marcado.btn, cel.btn].forEach(b => {
        b.classList.remove('tremida');
        void b.offsetWidth;
        b.classList.add('tremida');
      });
      marcado.btn.classList.remove('marcado');
      marcado = null;
    }
  }

  function encerrar() {
    acabou = true;
    clearInterval(timer);
    celulas.forEach(c => { c.btn.disabled = true; });
  }

  function vencer() {
    encerrar();
    audio.vitoria();
    confete(60);
    fimDeJogo(raiz, { ...ctx, jogoId: 'complete10', venceu: true, pontos: paresFeitos, mensagem: `Você formou ${META} dezenas douradas!` });
  }

  function perder() {
    encerrar();
    audio.erro();
    fimDeJogo(raiz, { ...ctx, jogoId: 'complete10', venceu: false, pontos: paresFeitos, mensagem: `A tela encheu! Você formou ${paresFeitos} ${paresFeitos === 1 ? 'par' : 'pares'}.` });
  }

  // começo suave: 3 pares na tela, depois um par a cada 3,2 s
  for (let i = 0; i < 3; i++) surgirPar();
  atualizarPlacar();
  timer = setInterval(surgirPar, 3200);

  return () => { acabou = true; clearInterval(timer); };
}
