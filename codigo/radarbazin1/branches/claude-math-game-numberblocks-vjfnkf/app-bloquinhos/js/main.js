// Mundo Mágico do Tom — navegação e HUD.
import { audio } from './audio.js';
import { voz } from './voz.js';
import { store } from './storage.js';
import { telaInicio } from './screens/inicio.js';
import { telaSandbox } from './screens/sandbox.js';
import { telaContas } from './screens/contas.js';
import { telaJogos } from './screens/jogos.js';
import { telaRobos } from './screens/robos.js';
import { telaFisica } from './screens/fisica.js';
import { telaDinheiro } from './screens/dinheiro.js';
import { telaAlbum } from './screens/album.js';
import { telaPais } from './screens/pais.js';

const TELAS = {
  inicio: { titulo: 'Mundo Mágico do Tom', montar: telaInicio },
  sandbox: { titulo: 'Mundo dos Bloquinhos', montar: telaSandbox },
  contas: { titulo: 'Contas com Blocos', montar: telaContas },
  jogos: { titulo: 'Jogos de Lógica', montar: telaJogos },
  robos: { titulo: 'Mundo dos Robôs', montar: telaRobos },
  fisica: { titulo: 'Laboratório de Física', montar: telaFisica },
  dinheiro: { titulo: 'Cidade do Dinheiro', montar: telaDinheiro },
  album: { titulo: 'Álbum de Fusões', montar: telaAlbum },
  pais: { titulo: 'Para pais e professores', montar: telaPais },
};

// visual da cortina de transição de cada mundo
const TEMA_MUNDOS = {
  inicio: { emoji: '🏠', cor: 'linear-gradient(160deg, #1d3557, #3f51b5)' },
  sandbox: { emoji: '🧱', cor: 'linear-gradient(160deg, #0d5c7d, #2196c9)' },
  contas: { emoji: '🔢', cor: 'linear-gradient(160deg, #1b5e20, #43a047)' },
  jogos: { emoji: '🎲', cor: 'linear-gradient(160deg, #5b2c6f, #8e44ad)' },
  robos: { emoji: '🤖', cor: 'linear-gradient(160deg, #232f7a, #3f51b5)' },
  fisica: { emoji: '🧪', cor: 'linear-gradient(160deg, #0a4d3a, #0d7d5c)' },
  dinheiro: { emoji: '💰', cor: 'linear-gradient(160deg, #7a5310, #b8791a)' },
  album: { emoji: '📔', cor: 'linear-gradient(160deg, #b45309, #f77f00)' },
  pais: { emoji: '🧑‍🏫', cor: 'linear-gradient(160deg, #10203f, #1d3557)' },
};

const elTela = document.getElementById('tela');
const elTitulo = document.getElementById('titulo-tela');
const btnVoltar = document.getElementById('btn-voltar');
const btnSom = document.getElementById('btn-som');
const elEstrelas = document.getElementById('total-estrelas');

let limpezaAtual = null;
let telaAtual = 'inicio';
let paramsAtuais = {};

let transicaoTimer = 0;

function montarTela(id, params) {
  voz.parar();
  if (typeof limpezaAtual === 'function') { try { limpezaAtual(); } catch { /* segue */ } }
  limpezaAtual = null;
  const t = TELAS[id];
  elTela.innerHTML = '';
  elTela.scrollTop = 0;
  elTitulo.textContent = t.titulo;
  btnVoltar.hidden = id === 'inicio';
  limpezaAtual = t.montar(elTela, { navegar, params }) || null;
  elTela.focus({ preventScroll: true });
}

export function navegar(id, params = {}) {
  // pop-ups de aviso não sobrevivem à troca de tela
  document.querySelectorAll('.popup-fundo').forEach(p => p.remove());
  const trocaDeMundo = id !== telaAtual;
  telaAtual = id;
  paramsAtuais = params;

  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay = document.getElementById('transicao');
  if (!trocaDeMundo || reduz || !overlay) {
    montarTela(id, params);
    return;
  }

  // cortina circular com o emoji do mundo de destino
  clearTimeout(transicaoTimer);
  overlay.className = '';
  const tema = TEMA_MUNDOS[id] || TEMA_MUNDOS.inicio;
  overlay.querySelector('.transicao-fundo').style.background = tema.cor;
  overlay.querySelector('.transicao-emoji').textContent = tema.emoji;
  overlay.querySelector('.transicao-nome').textContent = TELAS[id].titulo;
  void overlay.offsetWidth; // reinicia as animações
  overlay.classList.add('ativa', 'entrando');
  audio.whoosh();

  transicaoTimer = setTimeout(() => {
    montarTela(id, params);
    overlay.classList.remove('entrando');
    overlay.classList.add('saindo');
    transicaoTimer = setTimeout(() => { overlay.className = ''; }, 400);
  }, 430);
}

btnVoltar.addEventListener('click', () => {
  audio.clique();
  // dentro de um jogo/sessão (há params), volta ao menu da própria tela; do menu, volta ao início
  if (Object.keys(paramsAtuais).length > 0) navegar(telaAtual);
  else navegar('inicio');
});

function atualizarSom() {
  btnSom.textContent = audio.mudo ? '🔇' : '🔊';
  btnSom.setAttribute('aria-label', audio.mudo ? 'Ligar o som' : 'Desligar o som');
}
btnSom.addEventListener('click', () => {
  audio.setMudo(!audio.mudo);
  if (audio.mudo) voz.parar();
  store.setMudo(audio.mudo);
  atualizarSom();
  audio.clique();
});

function atualizarEstrelas() { elEstrelas.textContent = store.dados.estrelas; }
document.addEventListener('estrelas', atualizarEstrelas);

// estado inicial
audio.setMudo(store.dados.mudo);
atualizarSom();
atualizarEstrelas();
navegar('inicio');

// PWA — funciona offline após a primeira visita
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline continua ok sem sw */ });
  });
}
