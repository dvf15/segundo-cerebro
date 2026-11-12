// Teclado numérico grande, amigável para dedos pequenos.
import { audio } from './audio.js';

/**
 * Cria um teclado 0-9 + apagar + OK.
 * @param {(valor:number)=>void} aoConfirmar
 * @returns {{el:HTMLElement, display:HTMLElement, limpar:Function, travar:Function, destravar:Function}}
 */
export function criarTeclado(aoConfirmar) {
  const raiz = document.createElement('div');
  const display = document.createElement('div');
  display.className = 'resposta-atual';
  display.setAttribute('aria-live', 'polite');
  display.textContent = '';

  const grade = document.createElement('div');
  grade.className = 'teclado';
  let atual = '';
  let travado = false;

  const atualizar = () => { display.textContent = atual || '_'; };
  atualizar();

  const teclas = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', 'OK'];
  for (const t of teclas) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = t;
    if (t === 'OK') b.className = 'tecla-ok';
    b.setAttribute('aria-label', t === '⌫' ? 'Apagar' : t === 'OK' ? 'Confirmar resposta' : `Dígito ${t}`);
    b.addEventListener('click', () => {
      if (travado) return;
      audio.clique();
      if (t === '⌫') atual = atual.slice(0, -1);
      else if (t === 'OK') {
        if (atual !== '') aoConfirmar(parseInt(atual, 10));
        return;
      } else if (atual.length < 3) atual += t;
      atualizar();
    });
    grade.appendChild(b);
  }

  // teclado físico também funciona
  const fisico = (e) => {
    if (travado) return;
    if (/^[0-9]$/.test(e.key) && atual.length < 3) { atual += e.key; atualizar(); }
    else if (e.key === 'Backspace') { atual = atual.slice(0, -1); atualizar(); }
    else if (e.key === 'Enter' && atual !== '') aoConfirmar(parseInt(atual, 10));
  };
  document.addEventListener('keydown', fisico);

  raiz.appendChild(display);
  raiz.appendChild(grade);
  return {
    el: raiz,
    display,
    limpar() { atual = ''; atualizar(); },
    travar() { travado = true; },
    destravar() { travado = false; },
    destruir() { document.removeEventListener('keydown', fisico); },
  };
}
