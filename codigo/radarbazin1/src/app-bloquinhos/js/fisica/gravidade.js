// Queda Livre — gravidade: a força que puxa tudo para baixo,
// o papel do ar, e o famoso teste do martelo e da pena na Lua.
import { rodarExperimentos } from '../screens/fisica.js';

function cenaQueda(svg, fundo) {
  if (fundo === 'lua') {
    svg.innerHTML = `<line x1="0" y1="140" x2="320" y2="140" stroke="#9e9e9e" stroke-width="4"/>` +
      `<text x="20" y="34" font-size="12">✦</text><text x="270" y="28" font-size="12">✦</text><text x="150" y="20" font-size="10">✦</text>`;
  } else {
    svg.innerHTML += `<text x="272" y="34" font-size="22">☀️</text><text x="30" y="40" font-size="16">☁️</text>`;
  }
  svg.innerHTML += `
    <g class="exp-martelo"><text x="90" y="34" font-size="22">🔨</text></g>
    <g class="exp-pena"><text x="200" y="34" font-size="22">🪶</text></g>`;
}

function soltar(svg, animarFn, { penaLenta }) {
  const martelo = svg.querySelector('.exp-martelo');
  const pena = svg.querySelector('.exp-pena');
  return new Promise((res) => {
    animarFn(penaLenta ? 2400 : 1400, (k) => {
      const alvo = 100;
      const kM = penaLenta ? Math.min(1, k * 2.2) : k;
      martelo.setAttribute('transform', `translate(0, ${alvo * kM * kM})`);
      const desvio = penaLenta ? Math.sin(k * 9) * 12 : 0;
      pena.setAttribute('transform', `translate(${desvio}, ${alvo * (penaLenta ? k : k * k)})`);
    }, res);
  });
}

const RODADAS = [
  {
    pergunta: 'Na TERRA, soltamos um martelo e uma pena juntos. Quem chega primeiro?',
    cenaInicial: (svg) => cenaQueda(svg, 'terra'),
    opcoes: [
      { rotulo: 'O martelo', certa: true },
      { rotulo: 'A pena', certa: false },
      { rotulo: 'Chegam juntos', certa: false },
    ],
    experimento: (svg, animarFn) => soltar(svg, animarFn, { penaLenta: true }),
    descoberta: 'O martelo despenca e a pena flutua devagarinho. Mas o "culpado" não é o peso — é o AR segurando a pena!',
  },
  {
    pergunta: 'Agora na LUA, onde NÃO TEM AR. Martelo e pena: quem chega primeiro?',
    cenaInicial: (svg) => cenaQueda(svg, 'lua'),
    opcoes: [
      { rotulo: 'O martelo', certa: false },
      { rotulo: 'Chegam juntos', certa: true },
      { rotulo: 'A pena', certa: false },
    ],
    experimento: (svg, animarFn) => soltar(svg, animarFn, { penaLenta: false }),
    descoberta: 'JUNTOS! Sem ar, a gravidade puxa tudo igual. O astronauta David Scott fez esse teste NA LUA em 1971 — e foi exatamente isso!',
  },
  {
    pergunta: 'O robô "pesa" 60 na Terra. Na Lua, onde a gravidade é 6 vezes mais fraca, ele pesa…',
    opcoes: [
      { rotulo: '10', certa: true },
      { rotulo: '60', certa: false },
      { rotulo: '360', certa: false },
    ],
    descoberta: '60 ÷ 6 = 10! Na Lua você daria pulos gigantes. A massa não muda, mas o PESO depende da gravidade do lugar.',
  },
  {
    pergunta: 'Jogamos uma bola para o ALTO. O que acontece com ela?',
    cenaInicial(svg) {
      svg.innerHTML += `<g class="exp-bola"><circle cx="160" cy="130" r="11" fill="#e63946" stroke="#a4161a" stroke-width="2.5"/></g>`;
    },
    opcoes: [
      { rotulo: 'Sobe para sempre', certa: false },
      { rotulo: 'Sobe, para e desce', certa: true },
      { rotulo: 'Fica flutuando', certa: false },
    ],
    experimento(svg, animarFn) {
      const bola = svg.querySelector('.exp-bola');
      return new Promise((res) => {
        animarFn(2000, (k) => {
          bola.setAttribute('transform', `translate(0, ${-110 * 4 * k * (1 - k)})`);
        }, res);
      });
    },
    descoberta: 'A gravidade freia a subida, para a bola no topo e puxa de volta. Tudo que sobe… desce!',
  },
  {
    pergunta: 'Quem mantém a gente grudado no chão (e a Lua girando em volta da Terra)?',
    opcoes: [
      { rotulo: 'A gravidade', certa: true },
      { rotulo: 'Uma cola invisível', certa: false },
      { rotulo: 'O vento', certa: false },
    ],
    descoberta: 'A GRAVIDADE: toda coisa com massa atrai as outras. A Terra, gigante, puxa tudo para o centro dela — inclusive você e a Lua!',
  },
];

export function missaoGravidade(el, ctx) {
  return rodarExperimentos(el, ctx, {
    id: 'gravidade',
    rodadas: RODADAS,
    minimo: 4,
    mensagem: (a, t) => `Você acertou ${a} de ${t} apostas e descobriu a força que segura o universo!`,
  });
}
