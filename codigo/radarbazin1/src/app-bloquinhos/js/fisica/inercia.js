// Caixa Teimosa — 1ª Lei de Newton (inércia): as coisas continuam paradas
// ou em movimento até que ALGO (uma força) mude isso.
import { rodarExperimentos } from '../screens/fisica.js';

const caixa = (x, cor = '#f0a821') =>
  `<g class="exp-caixa"><rect x="${x}" y="112" width="28" height="28" rx="5" fill="${cor}" stroke="#a06e08" stroke-width="2.5"/></g>`;

function moverCaixa(svg, animarFn, { ate, freia }) {
  const g = svg.querySelector('.exp-caixa');
  return new Promise((res) => {
    animarFn(1800, (k) => {
      const t = freia ? 1 - (1 - k) * (1 - k) : k; // freando: desacelera; sem atrito: constante
      g.setAttribute('transform', `translate(${(ate - 30) * t}, 0)`);
    }, res);
  });
}

const RODADAS = [
  {
    pergunta: 'Empurramos a caixa no GELO lisinho. O que ela faz?',
    chaoCor: '#bfe8ff',
    cenaInicial(svg) {
      svg.innerHTML += `<rect x="0" y="140" width="320" height="8" fill="#bfe8ff"/>` + caixa(30) +
        `<text x="12" y="132" font-size="18">🤖</text><text x="290" y="30" font-size="14">❄️</text>`;
    },
    opcoes: [
      { rotulo: 'Para logo ali', certa: false },
      { rotulo: 'Desliza sem parar', certa: true },
      { rotulo: 'Volta para trás', certa: false },
    ],
    experimento: (svg, animarFn) => moverCaixa(svg, animarFn, { ate: 330, freia: false }),
    descoberta: 'No gelo quase nada segura a caixa — e ela continua indo! As coisas em movimento CONTINUAM em movimento até uma força atrapalhar. Isso é a INÉRCIA.',
  },
  {
    pergunta: 'Agora empurramos a MESMA caixa na AREIA fofa. E aí?',
    chaoCor: '#e0c184',
    cenaInicial(svg) {
      svg.innerHTML += `<rect x="0" y="140" width="320" height="8" fill="#e0c184"/>` + caixa(30) +
        `<text x="12" y="132" font-size="18">🤖</text><text x="285" y="30" font-size="14">🏜️</text>`;
    },
    opcoes: [
      { rotulo: 'Desliza sem parar', certa: false },
      { rotulo: 'Para logo', certa: true },
    ],
    experimento: (svg, animarFn) => moverCaixa(svg, animarFn, { ate: 150, freia: true }),
    descoberta: 'A areia esfrega na caixa e a freia. Essa força que freia tem nome: ATRITO. Não é que as coisas "cansam" — é o atrito que as para!',
  },
  {
    pergunta: 'O carro freia de repente. O boneco de teste SEM cinto…',
    opcoes: [
      { rotulo: 'Para junto com o carro', certa: false },
      { rotulo: 'Voa para a frente', certa: true },
      { rotulo: 'Voa para trás', certa: false },
    ],
    descoberta: 'O carro parou, mas o corpo do boneco CONTINUA indo para a frente (inércia!). Por isso o cinto de segurança salva vidas: ele segura você.',
  },
  {
    pergunta: 'No ESPAÇO não tem ar nem chão. A nave desliga o motor e…',
    chaoCor: 'transparent',
    cenaInicial(svg) {
      svg.innerHTML = `<text x="30" y="40" font-size="12">✦</text><text x="150" y="26" font-size="10">✦</text><text x="260" y="52" font-size="12">✦</text><text x="90" y="120" font-size="10">✦</text>` +
        `<g class="exp-caixa"><text x="20" y="90" font-size="30">🚀</text></g>`;
    },
    opcoes: [
      { rotulo: 'Para devagarzinho', certa: false },
      { rotulo: 'Viaja para sempre', certa: true },
    ],
    experimento: (svg, animarFn) => moverCaixa(svg, animarFn, { ate: 330, freia: false }),
    descoberta: 'Sem ar e sem atrito, NADA freia a nave: ela viaja para sempre na mesma velocidade. As sondas espaciais fazem isso de verdade!',
  },
  {
    pergunta: 'Essa "teimosia" das coisas tem um nome científico:',
    opcoes: [
      { rotulo: 'Preguiça', certa: false },
      { rotulo: 'Inércia', certa: true },
      { rotulo: 'Magia', certa: false },
    ],
    descoberta: 'INÉRCIA — a 1ª Lei de Newton: todo corpo continua parado ou em movimento constante, até que uma força mude isso.',
  },
];

export function missaoInercia(el, ctx) {
  return rodarExperimentos(el, ctx, {
    id: 'inercia',
    rodadas: RODADAS,
    minimo: 4,
    mensagem: (a, t) => `Você acertou ${a} de ${t} apostas e descobriu a Lei da Inércia!`,
  });
}
