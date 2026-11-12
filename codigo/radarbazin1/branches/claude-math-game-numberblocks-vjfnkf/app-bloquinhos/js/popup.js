// Pop-up de aviso compartilhado: escurece a tela, fala o texto e espera
// o "Entendi" (usado nos jogos de múltipla escolha quando a resposta erra).
import { audio } from './audio.js';
import { voz } from './voz.js';

export function popupAviso(texto, { aoFechar } = {}) {
  document.querySelectorAll('.popup-fundo').forEach(p => p.remove());
  const fundo = document.createElement('div');
  fundo.className = 'popup-fundo';
  fundo.innerHTML = `<div class="popup-caixa" role="alertdialog" aria-label="Aviso">` +
    `<span class="popup-emoji">🤔</span><p class="popup-texto">${texto}</p>` +
    `<button class="btn grande popup-ok">Entendi</button></div>`;
  const fechar = () => { fundo.remove(); if (aoFechar) aoFechar(); };
  fundo.addEventListener('click', (e) => { if (e.target === fundo) fechar(); });
  fundo.querySelector('.popup-ok').addEventListener('click', () => { audio.clique(); fechar(); });
  document.body.appendChild(fundo);
  voz.falar(texto);
}
