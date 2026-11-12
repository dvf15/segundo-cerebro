// Álbum de Fusões — as descobertas do sandbox.
import { store } from '../storage.js';
import { PERSONAGENS, infoPersonagem } from '../characters.js';

export function telaAlbum(el) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';

  const total = 45; // pares (a,b) com 1 <= a <= b <= 9
  const descobertas = store.dados.album.length;

  const resumo = document.createElement('div');
  resumo.className = 'prosa';
  resumo.innerHTML = `<h2>📔 Suas fusões</h2>` +
    `<p>Você já descobriu <b>${descobertas}</b> de <b>${total}</b> fusões no Mundo dos Bloquinhos.` +
    (descobertas < total ? ' Junte pares novos para completar o álbum!' : ' 🏆 Álbum completo, parabéns!') + `</p>` +
    `<p>⭐ Estrelas: <b>${store.dados.estrelas}</b> · 🏅 Medalhas: ` +
    ['faisca', 'chama', 'fogueira', 'vulcao'].map(n => `${store.dados.medalhas[n] > 0 ? '⭐'.repeat(store.dados.medalhas[n]) : '·'}`).join(' | ') + `</p>`;
  raiz.appendChild(resumo);

  const grade = document.createElement('div');
  grade.className = 'grade-album';
  for (let a = 1; a <= 9; a++) {
    for (let b = a; b <= 9; b++) {
      const chave = `${a}+${b}`;
      const tem = store.dados.album.includes(chave);
      const soma = a + b;
      const item = document.createElement('div');
      item.className = 'fusao-item' + (tem ? '' : ' bloqueada');
      item.innerHTML = tem
        ? `<div style="color:${PERSONAGENS[a].hex}">${a} + <span style="color:${PERSONAGENS[b].hex}">${b}</span></div>` +
          `<div style="font-size:1.2rem">= ${soma}</div><div style="font-size:.72rem">${infoPersonagem(soma).nome}</div>`
        : `<div>${a} + ${b}</div><div style="font-size:1.2rem">= ?</div><div style="font-size:.72rem">???</div>`;
      grade.appendChild(item);
    }
  }
  raiz.appendChild(grade);
  el.appendChild(raiz);
}
