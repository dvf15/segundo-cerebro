// Empurra-Empurra — 2ª Lei de Newton: Força = massa × aceleração.
// Mesma força: caixa leve dispara, caixa pesada custa a andar.
import { rodarExperimentos } from '../screens/fisica.js';

function duasCaixas(svg) {
  svg.innerHTML += `
    <text x="8" y="72" font-size="16">🤖</text>
    <g class="exp-leve"><rect x="34" y="52" width="22" height="22" rx="4" fill="#f0a821" stroke="#a06e08" stroke-width="2.5"/><text x="45" y="48" text-anchor="middle" font-size="10" font-weight="800" fill="#eaf2ff">LEVE</text></g>
    <text x="8" y="130" font-size="16">🤖</text>
    <g class="exp-pesada"><rect x="34" y="100" width="38" height="38" rx="5" fill="#a26a42" stroke="#6b4226" stroke-width="3"/><text x="53" y="96" text-anchor="middle" font-size="10" font-weight="800" fill="#eaf2ff">PESADA</text></g>
    <line x1="0" y1="78" x2="320" y2="78" stroke="#8d7bb8" stroke-width="2" stroke-dasharray="4 5"/>`;
}

function empurrar(svg, animarFn, distLeve, distPesada) {
  const leve = svg.querySelector('.exp-leve');
  const pesada = svg.querySelector('.exp-pesada');
  return new Promise((res) => {
    animarFn(1800, (k) => {
      const t = 1 - (1 - k) * (1 - k);
      if (leve) leve.setAttribute('transform', `translate(${distLeve * t}, 0)`);
      if (pesada) pesada.setAttribute('transform', `translate(${distPesada * t}, 0)`);
    }, res);
  });
}

const RODADAS = [
  {
    pergunta: 'O robô dá o MESMO empurrão nas duas caixas. Qual vai mais longe?',
    cenaInicial: duasCaixas,
    opcoes: [
      { rotulo: 'A leve', certa: true },
      { rotulo: 'A pesada', certa: false },
      { rotulo: 'As duas iguais', certa: false },
    ],
    experimento: (svg, animarFn) => empurrar(svg, animarFn, 240, 80),
    descoberta: 'Mesma força, massas diferentes: a LEVE dispara e a PESADA quase não sai do lugar. Quanto mais massa, mais difícil acelerar.',
  },
  {
    pergunta: 'Para a caixa PESADA ir tão longe quanto a leve, o empurrão precisa ser…',
    cenaInicial: duasCaixas,
    opcoes: [
      { rotulo: 'Mais fraco', certa: false },
      { rotulo: 'Igual', certa: false },
      { rotulo: 'Muito mais forte', certa: true },
    ],
    experimento: (svg, animarFn) => empurrar(svg, animarFn, 240, 240),
    descoberta: 'Com uma força bem maior, a pesada acompanha a leve. Força e massa andam juntas!',
  },
  {
    pergunta: 'Força 2 na caixa de massa 2 faz ela andar 100. A MESMA força na massa 1 faz andar…',
    opcoes: [
      { rotulo: '50', certa: false },
      { rotulo: '100', certa: false },
      { rotulo: '200', certa: true },
    ],
    descoberta: 'Metade da massa, o dobro do embalo! A aceleração é a força DIVIDIDA pela massa.',
  },
  {
    pergunta: 'E se a massa DOBRAR com a mesma força? A aceleração vira…',
    opcoes: [
      { rotulo: 'A metade', certa: true },
      { rotulo: 'O dobro', certa: false },
      { rotulo: 'Não muda', certa: false },
    ],
    descoberta: 'É a 2ª Lei de Newton: FORÇA = MASSA × ACELERAÇÃO. Massa dobrada, aceleração pela metade.',
  },
  {
    pergunta: 'Quem descobriu essa lei, há mais de 300 anos?',
    opcoes: [
      { rotulo: 'Isaac Newton', certa: true },
      { rotulo: 'Um robô', certa: false },
      { rotulo: 'O Tom', certa: false },
    ],
    descoberta: 'Isaac Newton! Dizem que tudo começou observando uma maçã cair. As 3 leis dele explicam quase todo movimento que você vê.',
  },
];

export function missaoForca(el, ctx) {
  return rodarExperimentos(el, ctx, {
    id: 'forca',
    rodadas: RODADAS,
    minimo: 4,
    mensagem: (a, t) => `Você acertou ${a} de ${t} apostas e descobriu que Força = massa × aceleração!`,
  });
}
