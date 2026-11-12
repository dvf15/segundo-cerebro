// Quente e Frio — termodinâmica básica: o calor flui do quente para o frio,
// temperatura é agitação de partículas, estados da matéria e isolantes.
import { rodarExperimentos } from '../screens/fisica.js';

// termômetro simples: tubo + mercúrio que sobe/desce
function termometro(x, rotulo, classe) {
  return `
    <g>
      <rect x="${x}" y="20" width="14" height="100" rx="7" fill="#ffffff" stroke="#1d3557" stroke-width="2.5"/>
      <circle cx="${x + 7}" cy="124" r="11" fill="#e63946" stroke="#1d3557" stroke-width="2.5"/>
      <rect class="${classe}" x="${x + 4}" y="40" width="6" height="80" rx="3" fill="#e63946"/>
      <text x="${x + 7}" y="152" text-anchor="middle" font-size="11" font-weight="800" fill="#1d3557">${rotulo}</text>
    </g>`;
}

const RODADAS = [
  {
    pergunta: 'O chocolate quente ficou esquecido na mesa. O que acontece com ele?',
    cenaInicial(svg) {
      svg.innerHTML += `<text x="30" y="120" font-size="34">☕</text>` +
        `<g class="exp-vapor"><text x="42" y="66" font-size="16">♨️</text></g>` +
        termometro(150, 'CHOCOLATE', 'exp-tq') + termometro(240, 'SALA', 'exp-ta');
      const tq = svg.querySelector('.exp-tq');
      tq.setAttribute('y', '44'); tq.setAttribute('height', '76'); // bem quente
      const ta = svg.querySelector('.exp-ta');
      ta.setAttribute('y', '92'); ta.setAttribute('height', '28'); ta.setAttribute('fill', '#2196c9');
    },
    opcoes: [
      { rotulo: 'Esfria até ficar como a sala', certa: true },
      { rotulo: 'Fica quente para sempre', certa: false },
      { rotulo: 'Esquenta mais', certa: false },
    ],
    experimento(svg, animarFn) {
      const tq = svg.querySelector('.exp-tq');
      const vapor = svg.querySelector('.exp-vapor');
      return new Promise((res) => {
        animarFn(2200, (k) => {
          const y = 44 + 32 * k;                 // mercúrio desce até perto da sala
          tq.setAttribute('y', y);
          tq.setAttribute('height', 120 - y);
          vapor.setAttribute('opacity', String(1 - k));
        }, res);
      });
    },
    descoberta: 'O calor SAI do chocolate quente e vai para o ar mais frio, até os dois ficarem parecidos. O calor sempre flui do QUENTE para o FRIO — nunca ao contrário sozinho!',
  },
  {
    pergunta: 'E o sorvete esquecido na mesa: por que ele derrete?',
    cenaInicial(svg) {
      svg.innerHTML += `<g class="exp-sorvete"><text x="140" y="110" font-size="40">🍦</text></g>` +
        `<ellipse class="exp-poca" cx="160" cy="132" rx="2" ry="1" fill="#ffe3b3" stroke="#e0b060" stroke-width="1.5"/>`;
    },
    opcoes: [
      { rotulo: 'O frio dele escapa', certa: false },
      { rotulo: 'O calor do ar entra nele', certa: true },
      { rotulo: 'É mágica da mesa', certa: false },
    ],
    experimento(svg, animarFn) {
      const s = svg.querySelector('.exp-sorvete');
      const poca = svg.querySelector('.exp-poca');
      return new Promise((res) => {
        animarFn(2200, (k) => {
          s.setAttribute('transform', `translate(${8 * k}, ${14 * k}) scale(${1 - 0.35 * k})`);
          poca.setAttribute('rx', String(2 + 34 * k));
          poca.setAttribute('ry', String(1 + 5 * k));
        }, res);
      });
    },
    descoberta: 'Não existe "frio escapando" — o que existe é CALOR entrando! O ar da sala é mais quente que o sorvete, então o calor flui do ar para ele… e derrete.',
  },
  {
    pergunta: 'Toda coisa é feita de partículas minúsculas. Se a gente ESQUENTA a caixinha, as partículas ficam…',
    cenaInicial(svg) {
      let bolinhas = '';
      for (let i = 0; i < 8; i++) {
        const bx = 110 + (i % 4) * 28, by = 55 + Math.floor(i / 4) * 34;
        bolinhas += `<circle class="exp-part" data-bx="${bx}" data-by="${by}" data-f="${i}" cx="${bx}" cy="${by}" r="7" fill="#2196c9" stroke="#0d5c7d" stroke-width="2"/>`;
      }
      svg.innerHTML += `<rect class="exp-caixa-t" x="92" y="34" width="130" height="86" rx="10" fill="none" stroke="#8d7bb8" stroke-width="3.5"/>` +
        bolinhas + `<g class="exp-fogo" opacity="0"><text x="140" y="150" font-size="16">🔥🔥🔥</text></g>`;
    },
    opcoes: [
      { rotulo: 'Mais paradas', certa: false },
      { rotulo: 'Mais agitadas', certa: true },
      { rotulo: 'Do mesmo jeito', certa: false },
    ],
    experimento(svg, animarFn) {
      const partes = [...svg.querySelectorAll('.exp-part')];
      const caixa = svg.querySelector('.exp-caixa-t');
      svg.querySelector('.exp-fogo').setAttribute('opacity', '1');
      return new Promise((res) => {
        animarFn(2600, (k) => {
          const amp = 1 + 9 * k; // a agitação cresce com o aquecimento
          for (const p of partes) {
            const f = +p.dataset.f;
            p.setAttribute('cx', +p.dataset.bx + Math.sin(k * 40 + f * 2.1) * amp);
            p.setAttribute('cy', +p.dataset.by + Math.cos(k * 34 + f * 1.7) * amp);
            if (k > 0.5) p.setAttribute('fill', '#e63946');
          }
          caixa.setAttribute('stroke', k > 0.4 ? '#e63946' : '#8d7bb8');
        }, res);
      });
    },
    descoberta: 'TEMPERATURA é isso: o quanto as partículas estão agitadas! Quente = partículas dançando rápido; frio = partículas quase paradas.',
  },
  {
    pergunta: 'Aquecendo um cubo de GELO sem parar, ele vira água… e depois?',
    cenaInicial(svg) {
      svg.innerHTML += `<g class="exp-gelo"><rect x="140" y="90" width="40" height="40" rx="8" fill="#bfe8ff" stroke="#2196c9" stroke-width="3"/></g>` +
        `<ellipse class="exp-agua" cx="160" cy="132" rx="2" ry="1" fill="#7fd4ff" stroke="#2196c9" stroke-width="1.5"/>` +
        `<g class="exp-vapor2" opacity="0"><text x="130" y="70" font-size="15">💨</text><text x="165" y="52" font-size="15">💨</text></g>` +
        `<text x="140" y="152" font-size="14">🔥🔥</text>`;
    },
    opcoes: [
      { rotulo: 'Vira vapor', certa: true },
      { rotulo: 'Vira pedra', certa: false },
      { rotulo: 'Some para sempre', certa: false },
    ],
    experimento(svg, animarFn) {
      const gelo = svg.querySelector('.exp-gelo rect');
      const agua = svg.querySelector('.exp-agua');
      const vapor = svg.querySelector('.exp-vapor2');
      return new Promise((res) => {
        animarFn(2600, (k) => {
          const derr = Math.min(1, k * 2);           // primeira metade: derrete
          gelo.setAttribute('height', String(40 * (1 - derr)));
          gelo.setAttribute('y', String(90 + 40 * derr));
          agua.setAttribute('rx', String(2 + 36 * derr));
          agua.setAttribute('ry', String(1 + 5 * derr));
          if (k > 0.5) {                              // segunda metade: evapora
            const ev = (k - 0.5) * 2;
            vapor.setAttribute('opacity', String(ev));
            vapor.setAttribute('transform', `translate(0, ${-24 * ev})`);
            agua.setAttribute('rx', String(38 * (1 - 0.5 * ev)));
          }
        }, res);
      });
    },
    descoberta: 'Sólido → líquido → gasoso! Com calor, as partículas se agitam tanto que se soltam: o gelo vira água e a água vira VAPOR. É a mesma água mudando de estado.',
  },
  {
    pergunta: 'Duas colheres no chocolate quente: uma de METAL e uma de MADEIRA. Qual esquenta sua mão?',
    cenaInicial(svg) {
      svg.innerHTML += `<rect x="120" y="86" width="80" height="48" rx="10" fill="#6b4226" stroke="#4a2c17" stroke-width="3"/>` +
        `<g class="exp-metal">` +
        [0, 1, 2, 3].map(i => `<rect class="exp-seg" data-i="${i}" x="136" y="${78 - i * 16}" width="8" height="16" rx="3" fill="#b0bec5" stroke="#546e7a" stroke-width="1.5"/>`).join('') +
        `</g>` +
        `<rect x="178" y="30" width="8" height="64" rx="3" fill="#c49a6c" stroke="#8a6844" stroke-width="1.5"/>` +
        `<text x="128" y="24" font-size="11" font-weight="800" fill="#eaf2ff">METAL</text>` +
        `<text x="172" y="24" font-size="11" font-weight="800" fill="#eaf2ff">MADEIRA</text>`;
    },
    opcoes: [
      { rotulo: 'A de metal', certa: true },
      { rotulo: 'A de madeira', certa: false },
      { rotulo: 'Nenhuma', certa: false },
    ],
    experimento(svg, animarFn) {
      const segs = [...svg.querySelectorAll('.exp-seg')];
      return new Promise((res) => {
        animarFn(2400, (k) => {
          // o calor sobe pela colher de metal, segmento por segmento
          segs.forEach((s, i) => {
            if (k > (i + 1) / 5) s.setAttribute('fill', '#e63946');
          });
        }, res);
      });
    },
    descoberta: 'O metal é CONDUTOR: o calor viaja rapidinho por ele até a sua mão. A madeira é ISOLANTE: o calor quase não passa. Por isso panelas têm cabo de madeira ou plástico!',
  },
  {
    pergunta: 'Pergunta de mestre: o casaco ESQUENTA você?',
    opcoes: [
      { rotulo: 'Sim, ele fabrica calor', certa: false },
      { rotulo: 'Não — ele guarda o MEU calor', certa: true },
      { rotulo: 'Só se for de lã', certa: false },
    ],
    descoberta: 'O casaco não fabrica calor nenhum — ele é um ISOLANTE que impede o calor do SEU corpo de fugir para o ar frio. Tanto que um sorvete embrulhado num casaco derrete MAIS DEVAGAR!',
  },
];

export function missaoCalor(el, ctx) {
  return rodarExperimentos(el, ctx, {
    id: 'calor',
    rodadas: RODADAS,
    minimo: 4,
    mensagem: (a, t) => `Você acertou ${a} de ${t} apostas e descobriu os segredos do calor!`,
  });
}
