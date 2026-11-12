// Menu dos jogos de lógica + roteador interno.
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { corTexto } from '../characters.js';
import { criarRobo } from '../robos.js';
import { jogoComplete10 } from '../jogos/complete10.js';
import { jogoPadrao } from '../jogos/padrao.js';
import { jogoBalanca } from '../jogos/balanca.js';
import { jogoQuadrados } from '../jogos/quadrados.js';
import { jogoTrilha } from '../jogos/trilha.js';

export const JOGOS = [
  { id: 'complete10', emoji: '🔟', nome: 'Complete o 10', desc: 'Ache os pares que somam 10', cor: '#f0a821', montar: jogoComplete10 },
  { id: 'padrao', emoji: '🌈', nome: 'Padrão Maluco', desc: 'Qual bloquinho vem depois?', cor: '#8e44ad', montar: jogoPadrao },
  { id: 'balanca', emoji: '⚖️', nome: 'Balança Justa', desc: 'Equilibre os dois lados', cor: '#2196c9', montar: jogoBalanca },
  { id: 'quadrados', emoji: '🟩', nome: 'Caça-Quadrados', desc: 'Monte o maior quadrado', cor: '#43a047', montar: jogoQuadrados },
  { id: 'trilha', emoji: '🗺️', nome: 'Trilha do Tesouro', desc: 'Corrida de continhas (1 ou 2 jogadores)', cor: '#e63946', montar: jogoTrilha },
];

export function telaJogos(el, { navegar, params }) {
  const jogo = JOGOS.find(j => j.id === params.jogo);
  if (jogo) {
    document.getElementById('titulo-tela').textContent = jogo.nome;
    return jogo.montar(el, { navegar });
  }

  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';

  const recepcao = document.createElement('div');
  recepcao.style.cssText = 'display:flex;justify-content:center;gap:18px;align-items:center';
  recepcao.appendChild(criarRobo({ tamanho: 52 }));
  const oi = document.createElement('p');
  oi.className = 'dica-flutuante';
  oi.textContent = 'Escolha um desafio, tripulante!';
  recepcao.appendChild(oi);
  recepcao.appendChild(criarRobo({ tamanho: 52, atraso: '1.7s', cor: '#a0ffb0' }));
  raiz.appendChild(recepcao);

  const grade = document.createElement('div');
  grade.className = 'grade-menu';
  for (const j of JOGOS) {
    const rec = store.dados.recordes[j.id];
    const b = document.createElement('button');
    b.className = 'card-modo';
    b.style.background = j.cor;
    b.style.color = corTexto(j.cor);
    b.innerHTML = `<span class="emoji">${j.emoji}</span><span>${j.nome}</span><small>${j.desc}</small>` +
      `<small>${rec ? `Recorde: ${rec}` : '— nunca jogado —'}</small>`;
    b.addEventListener('click', () => { audio.clique(); navegar('jogos', { jogo: j.id }); });
    grade.appendChild(b);
  }
  raiz.appendChild(grade);
  el.appendChild(raiz);
}

/** Tela de fim comum aos jogos de lógica e às missões dos robôs. */
export function fimDeJogo(el, { navegar, jogoId, venceu, pontos, mensagem, aoRepetir, aoVoltar, rotuloVoltar }) {
  const div = document.createElement('div');
  div.className = 'tela-fim';
  const recorde = store.setRecorde(jogoId, pontos);
  if (venceu) store.addEstrelas(1);
  div.innerHTML = `<h2>${venceu ? '🎉 Você conseguiu!' : 'Boa tentativa!'}</h2>` +
    `<p>${mensagem}</p>` +
    (venceu ? '<div class="estrelas-ganhas">⭐</div>' : '') +
    (recorde && pontos > 0 ? '<p>🏆 Novo recorde!</p>' : '');
  div.prepend(criarRobo({ tamanho: 58, cor: venceu ? '#ffd166' : '#5ac8ff' }));
  const acoes = document.createElement('div');
  acoes.style.cssText = 'display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:.8rem';
  const denovo = document.createElement('button');
  denovo.className = 'btn grande';
  denovo.textContent = '🔁 De novo';
  denovo.addEventListener('click', aoRepetir || (() => navegar('jogos', { jogo: jogoId })));
  const voltar = document.createElement('button');
  voltar.className = 'btn secundario';
  voltar.textContent = rotuloVoltar || 'Outros jogos';
  voltar.addEventListener('click', aoVoltar || (() => navegar('jogos')));
  acoes.appendChild(denovo); acoes.appendChild(voltar);
  div.appendChild(acoes);
  el.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
