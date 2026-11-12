// Robô no Skate — 3ª Lei de Newton: toda ação tem uma reação igual e contrária.
import { rodarExperimentos } from '../screens/fisica.js';

const RODADAS = [
  {
    pergunta: 'O robô está num skate e joga a caixa para a DIREITA com força. O robô…',
    cenaInicial(svg) {
      svg.innerHTML += `
        <g class="exp-robo">
          <text x="130" y="122" font-size="26">🤖</text>
          <line x1="128" y1="130" x2="162" y2="130" stroke="#1d3557" stroke-width="4" stroke-linecap="round"/>
          <circle cx="134" cy="136" r="5" fill="#5ac8ff" stroke="#1d3557" stroke-width="2"/>
          <circle cx="156" cy="136" r="5" fill="#5ac8ff" stroke="#1d3557" stroke-width="2"/>
        </g>
        <g class="exp-caixa"><rect x="162" y="102" width="22" height="22" rx="4" fill="#f0a821" stroke="#a06e08" stroke-width="2.5"/></g>`;
    },
    opcoes: [
      { rotulo: 'Fica parado', certa: false },
      { rotulo: 'Desliza para a esquerda', certa: true },
      { rotulo: 'Pula para cima', certa: false },
    ],
    experimento(svg, animarFn) {
      const robo = svg.querySelector('.exp-robo');
      const cx = svg.querySelector('.exp-caixa');
      return new Promise((res) => {
        animarFn(1600, (k) => {
          const t = 1 - (1 - k) * (1 - k);
          cx.setAttribute('transform', `translate(${140 * t}, 0)`);
          robo.setAttribute('transform', `translate(${-95 * t}, 0)`);
        }, res);
      });
    },
    descoberta: 'A caixa foi para lá… e o robô veio para cá! Quando você empurra algo, esse algo te empurra DE VOLTA com a mesma força.',
  },
  {
    pergunta: 'Um balão cheio é solto e o ar sai por trás. O balão voa…',
    cenaInicial(svg) {
      svg.innerHTML += `<g class="exp-balao"><ellipse cx="60" cy="70" rx="24" ry="30" fill="#e91e8c" stroke="#9c105c" stroke-width="2.5"/><path d="M 56 100 l 8 0 l -4 8 z" fill="#9c105c"/></g>` +
        `<g class="exp-ar" opacity="0"><text x="20" y="112" font-size="14">💨</text></g>`;
    },
    opcoes: [
      { rotulo: 'Para o lado do ar', certa: false },
      { rotulo: 'Para o lado oposto', certa: true },
      { rotulo: 'Fica parado', certa: false },
    ],
    experimento(svg, animarFn) {
      const balao = svg.querySelector('.exp-balao');
      const ar = svg.querySelector('.exp-ar');
      ar.setAttribute('opacity', '1');
      return new Promise((res) => {
        animarFn(1500, (k) => {
          balao.setAttribute('transform', `translate(${220 * k}, ${-25 * k})`);
          ar.setAttribute('transform', `translate(${-15 * k}, ${8 * k})`);
        }, res);
      });
    },
    descoberta: 'O ar sai para um lado, o balão dispara para o outro. Ação para lá, reação para cá!',
  },
  {
    pergunta: 'O foguete solta gás quente para BAIXO. O foguete vai…',
    cenaInicial(svg) {
      svg.innerHTML += `<g class="exp-foguete"><text x="140" y="128" font-size="34">🚀</text></g>` +
        `<g class="exp-fogo" opacity="0"><text x="144" y="150" font-size="18">🔥</text></g>`;
    },
    opcoes: [
      { rotulo: 'Para baixo', certa: false },
      { rotulo: 'Para cima', certa: true },
      { rotulo: 'Para o lado', certa: false },
    ],
    experimento(svg, animarFn) {
      const fog = svg.querySelector('.exp-foguete');
      const fogo = svg.querySelector('.exp-fogo');
      fogo.setAttribute('opacity', '1');
      return new Promise((res) => {
        animarFn(1600, (k) => {
          fog.setAttribute('transform', `translate(0, ${-115 * k * k})`);
          fogo.setAttribute('transform', `translate(0, ${-115 * k * k + 8})`);
        }, res);
      });
    },
    descoberta: 'É assim que foguetes DE VERDADE voam: empurram gás para baixo e o gás empurra o foguete para cima. 3ª Lei de Newton no espaço!',
  },
  {
    pergunta: 'Você empurra uma parede com toda a força. A parede…',
    opcoes: [
      { rotulo: 'Não faz nada', certa: false },
      { rotulo: 'Te empurra de volta', certa: true },
      { rotulo: 'Cai', certa: false },
    ],
    descoberta: 'A parede te empurra de volta com a MESMA força — por isso sua mão sente o aperto. Toda ação tem uma reação igual e contrária.',
  },
];

export function missaoReacao(el, ctx) {
  return rodarExperimentos(el, ctx, {
    id: 'reacao',
    rodadas: RODADAS,
    minimo: 3,
    mensagem: (a, t) => `Você acertou ${a} de ${t} apostas e descobriu a lei que faz os foguetes voarem!`,
  });
}
