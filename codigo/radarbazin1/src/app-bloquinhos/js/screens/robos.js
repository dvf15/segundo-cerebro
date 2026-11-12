// Mundo dos Robôs — noções espaciais, geometria e trigonometria lúdica.
// Pedagogia (base: "Cidade dos Números"): construir → manipular → contar →
// comparar → representar → generalizar. A fórmula só aparece depois do concreto.
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { criarRobo } from '../robos.js';
import { fimDeJogo } from './jogos.js';
import { missaoComande } from '../robos/comande.js';
import { missaoFormas } from '../robos/formas.js';
import { missaoAreas } from '../robos/areas.js';
import { missaoCaixas } from '../robos/caixas.js';
import { missaoAngulos } from '../robos/angulos.js';
import { missaoContagem } from '../robos/contagem.js';
import { missaoPlanetas } from '../robos/planetas.js';

export const MISSOES = [
  { id: 'comande', emoji: '🕹️', nome: 'Comande o Robô', desc: 'Direções e coordenadas no mapa espacial', cor: '#2196c9', montar: missaoComande },
  { id: 'contagem', emoji: '🦘', nome: 'Foguete da Contagem', desc: 'Até 1 BILHÃO em 81 pulos espertos', cor: '#3f51b5', montar: missaoContagem },
  { id: 'planetas', emoji: '🪐', nome: 'Viagem Planetária', desc: 'Tamanhos, cores e distâncias gigantes', cor: '#0d5c7d', montar: missaoPlanetas },
  { id: 'formas', emoji: '📦', nome: 'Correio das Formas', desc: 'Formas 2D e sólidos 3D para entregar', cor: '#43a047', montar: missaoFormas },
  { id: 'areas', emoji: '🌻', nome: 'Jardim das Áreas', desc: 'Cubra terrenos com quadradinhos', cor: '#f0a821', montar: missaoAreas },
  { id: 'caixas', emoji: '🏗️', nome: 'Fábrica de Caixas', desc: 'Volume: cubinhos, camadas e caixas', cor: '#e63946', montar: missaoCaixas },
  { id: 'angulos', emoji: '🚀', nome: 'Rampa dos Ângulos', desc: 'Giros, graus e lançamentos espaciais', cor: '#8e44ad', montar: missaoAngulos },
];

export function telaRobos(el, { navegar, params }) {
  const missao = MISSOES.find(m => m.id === params.missao);
  if (missao) {
    document.getElementById('titulo-tela').textContent = missao.nome;
    return missao.montar(el, { navegar });
  }

  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';

  const recepcao = document.createElement('div');
  recepcao.style.cssText = 'display:flex;justify-content:center;gap:16px;align-items:center';
  recepcao.appendChild(criarRobo({ tamanho: 62 }));
  const oi = document.createElement('p');
  oi.className = 'dica-flutuante';
  oi.textContent = 'Os robôs precisam da sua ajuda para explorar o espaço!';
  recepcao.appendChild(oi);
  recepcao.appendChild(criarRobo({ tamanho: 62, atraso: '1.6s', cor: '#ffd166' }));
  raiz.appendChild(recepcao);

  const grade = document.createElement('div');
  grade.className = 'grade-menu';
  for (const m of MISSOES) {
    const rec = store.dados.recordes['robo-' + m.id];
    const b = document.createElement('button');
    b.className = 'card-modo';
    b.style.background = m.cor;
    b.innerHTML = `<span class="emoji">${m.emoji}</span><span>${m.nome}</span><small>${m.desc}</small>` +
      `<small>${rec ? `Recorde: ${rec}` : '— nunca jogado —'}</small>`;
    b.addEventListener('click', () => { audio.clique(); navegar('robos', { missao: m.id }); });
    grade.appendChild(b);
  }
  raiz.appendChild(grade);
  el.appendChild(raiz);
}

// ---------- utilidades compartilhadas pelas missões ----------

export function embaralhar(lista) {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** 3 opções numéricas: a certa + distratores plausíveis (sempre > 0 e únicos). */
export function opcoesNumericas(certa, candidatos) {
  const s = new Set([certa]);
  for (const c of embaralhar(candidatos)) {
    if (c > 0 && !s.has(c)) s.add(c);
    if (s.size === 3) break;
  }
  let salto = 1;
  while (s.size < 3) { if (!s.has(certa + salto)) s.add(certa + salto); salto++; }
  return embaralhar([...s]);
}

/** Placar padrão das missões. */
export function placarMissao(rodada, total, acertos) {
  const p = document.createElement('div');
  p.className = 'placar-jogo';
  p.innerHTML = `<span>Missão <b>${rodada}</b> / ${total}</span><span>⭐ de primeira: <b>${acertos}</b></span>`;
  return p;
}

/** Tela de fim das missões (volta para o menu do Mundo dos Robôs). */
export function fimMissao(raiz, { navegar }, missaoId, { venceu, pontos, mensagem }) {
  raiz.innerHTML = '';
  fimDeJogo(raiz, {
    navegar,
    jogoId: 'robo-' + missaoId,
    venceu,
    pontos,
    mensagem,
    aoRepetir: () => navegar('robos', { missao: missaoId }),
    aoVoltar: () => navegar('robos'),
    rotuloVoltar: 'Outras missões',
  });
}
