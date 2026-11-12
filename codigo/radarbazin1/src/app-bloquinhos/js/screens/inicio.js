// Tela inicial — mapa dos modos de jogo.
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { svgPersonagem, corTexto } from '../characters.js';
import { criarRobo } from '../robos.js';

const MODOS = [
  { id: 'sandbox', emoji: '🧱', nome: 'Mundo dos Bloquinhos', desc: 'Brinque livre e descubra fusões', cor: '#2196c9' },
  { id: 'contas', emoji: '🔢', nome: 'Contas com Blocos', desc: '4 níveis, do Faísca ao Vulcão', cor: '#43a047' },
  { id: 'jogos', emoji: '🎲', nome: 'Jogos de Lógica', desc: '5 desafios coloridos', cor: '#8e44ad' },
  { id: 'robos', emoji: '🤖', nome: 'Mundo dos Robôs', desc: 'Espaço, formas, área, volume e ângulos', cor: '#3f51b5' },
  { id: 'fisica', emoji: '🧪', nome: 'Laboratório de Física', desc: 'Aposte, experimente e descubra as leis', cor: '#0d7d5c' },
  { id: 'dinheiro', emoji: '💰', nome: 'Cidade do Dinheiro', desc: 'Mercado, shopping e cofrinho', cor: '#b8791a' },
  { id: 'album', emoji: '📔', nome: 'Álbum de Fusões', desc: 'Suas descobertas', cor: '#f77f00' },
  { id: 'pais', emoji: '🧑‍🏫', nome: 'Pais e professores', desc: 'Como o jogo ensina', cor: '#1d3557' },
];

export function telaInicio(el, { navegar }) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';

  const boasVindas = document.createElement('div');
  boasVindas.style.cssText = 'display:flex;justify-content:center;gap:12px;align-items:flex-end;padding:.4rem 0 .2rem';
  const roboEsq = criarRobo({ tamanho: 54 });
  const bloco1 = document.createElement('div');
  bloco1.innerHTML = svgPersonagem(1, { cubo: 22 }).svg;
  const tom = document.createElement('img');
  tom.src = 'icon-tom.png';
  tom.alt = 'Tom, o dono deste mundo mágico';
  tom.style.cssText = 'width:104px;height:104px;border-radius:50%;box-shadow:0 0 24px rgba(240,168,33,.55)';
  const bloco2 = document.createElement('div');
  bloco2.innerHTML = svgPersonagem(2, { cubo: 22 }).svg;
  const roboDir = criarRobo({ tamanho: 54, atraso: '1.4s', cor: '#ffb0e6' });
  boasVindas.appendChild(roboEsq);
  boasVindas.appendChild(bloco1);
  boasVindas.appendChild(tom);
  boasVindas.appendChild(bloco2);
  boasVindas.appendChild(roboDir);
  raiz.appendChild(boasVindas);

  const titulo = document.createElement('h1');
  titulo.style.cssText = 'text-align:center;font-size:1.5rem;font-weight:900;margin-top:.3rem;color:var(--luz-espacial);text-shadow:0 0 14px rgba(90,200,255,.6)';
  titulo.textContent = '🌟 Mundo Mágico do Tom 🌟';
  raiz.appendChild(titulo);

  const frase = document.createElement('p');
  frase.className = 'dica-flutuante';
  frase.textContent = 'Junte bloquinhos com o Tom e veja a matemática nascer!';
  raiz.appendChild(frase);

  const grade = document.createElement('div');
  grade.className = 'grade-menu';
  for (const m of MODOS) {
    const b = document.createElement('button');
    b.className = 'card-modo';
    b.style.background = m.cor;
    b.style.color = corTexto(m.cor);
    b.innerHTML = `<span class="emoji">${m.emoji}</span><span>${m.nome}</span><small>${m.desc}</small>`;
    b.addEventListener('click', () => { audio.clique(); navegar(m.id); });
    grade.appendChild(b);
  }
  raiz.appendChild(grade);

  const medalhas = store.dados.medalhas;
  const totalMedalhas = Object.values(medalhas).reduce((s, v) => s + v, 0);
  if (totalMedalhas > 0) {
    const p = document.createElement('p');
    p.className = 'dica-flutuante';
    p.innerHTML = `Medalhas: <span class="medalha">🏅</span> × ${totalMedalhas}`;
    raiz.appendChild(p);
  }

  el.appendChild(raiz);
}
