// Robozinhos animados — companheiros espaciais do Tom (SVG puro, sem assets externos).
let seq = 0;

/**
 * Cria um robô flutuante decorativo.
 * @param {{tamanho?:number, atraso?:string, cor?:string}} opts
 */
export function criarRobo({ tamanho = 72, atraso = '', cor = '#5ac8ff', flutua = true } = {}) {
  const el = document.createElement('div');
  el.className = flutua ? 'robo robo-flutua' : 'robo';
  el.setAttribute('aria-hidden', 'true');
  if (atraso) el.style.animationDelay = atraso;
  const id = `robo${++seq}`;
  el.innerHTML = `<svg width="${tamanho}" height="${Math.round(tamanho * 1.18)}" viewBox="0 0 100 118">
    <defs>
      <radialGradient id="${id}-brilho" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${cor}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${cor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse class="robo-jato" cx="50" cy="108" rx="17" ry="7" fill="url(#${id}-brilho)"/>
    <line x1="50" y1="15" x2="50" y2="6" stroke="#cfd8e3" stroke-width="3.5" stroke-linecap="round"/>
    <circle class="robo-antena" cx="50" cy="5" r="4.5" fill="${cor}"/>
    <rect x="17" y="14" width="66" height="48" rx="23" fill="#f4f8ff" stroke="#b7c6d8" stroke-width="2.5"/>
    <rect x="25" y="24" width="50" height="28" rx="14" fill="#101a3c"/>
    <circle class="robo-olho" cx="40.5" cy="38" r="6.5" fill="${cor}"/>
    <circle class="robo-olho" cx="59.5" cy="38" r="6.5" fill="${cor}"/>
    <rect class="robo-braco robo-braco-e" x="12" y="68" width="13" height="22" rx="6.5" fill="#f4f8ff" stroke="#b7c6d8" stroke-width="2.5"/>
    <rect class="robo-braco robo-braco-d" x="75" y="68" width="13" height="22" rx="6.5" fill="#f4f8ff" stroke="#b7c6d8" stroke-width="2.5"/>
    <rect x="29" y="64" width="42" height="36" rx="17" fill="#f4f8ff" stroke="#b7c6d8" stroke-width="2.5"/>
    <circle class="robo-peito" cx="50" cy="82" r="6.5" fill="${cor}"/>
  </svg>`;
  return el;
}
