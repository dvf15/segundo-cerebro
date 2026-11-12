// Viagem Planetária — tamanhos, cores e distâncias dos planetas em números
// grandes e redondos: dividir milhões vira brincadeira de cortar zeros.
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { popupAviso } from '../popup.js';
import { placarMissao, fimMissao, embaralhar } from '../screens/robos.js';

const RODADAS = 8;

// raios de desenho proporcionais (não à escala exata, mas na ordem certa)
export const PLANETAS = {
  mercurio: { nome: 'MERCÚRIO', r: 10, cor: '#9e9e9e', detalhe: '#6d6d6d' },
  venus:    { nome: 'VÊNUS',    r: 15, cor: '#e8c468', detalhe: '#b89331' },
  terra:    { nome: 'TERRA',    r: 16, cor: '#2196c9', detalhe: '#43a047' },
  marte:    { nome: 'MARTE',    r: 12, cor: '#d1543a', detalhe: '#8f2e1b' },
  jupiter:  { nome: 'JÚPITER',  r: 44, cor: '#d9a066', detalhe: '#a5683a' },
  saturno:  { nome: 'SATURNO',  r: 38, cor: '#e8cf8f', detalhe: '#b89b52', aneis: true },
  urano:    { nome: 'URANO',    r: 24, cor: '#7fd4d8', detalhe: '#3f9ba0' },
  netuno:   { nome: 'NETUNO',   r: 23, cor: '#3f51b5', detalhe: '#232f7a' },
};

export function svgPlaneta(chave, { escala = 1 } = {}) {
  const p = PLANETAS[chave];
  const r = p.r * escala;
  const pad = p.aneis ? r * 0.9 : 6;
  const s = 2 * r + 2 * pad;
  const c = s / 2;
  let corpo = '';
  if (p.aneis) {
    corpo += `<ellipse cx="${c}" cy="${c}" rx="${r * 1.7}" ry="${r * 0.5}" fill="none" stroke="${p.detalhe}" stroke-width="${r * 0.18}" opacity="0.85"/>`;
  }
  corpo += `<circle cx="${c}" cy="${c}" r="${r}" fill="${p.cor}" stroke="${p.detalhe}" stroke-width="2.5"/>`;
  corpo += `<ellipse cx="${c - r * 0.3}" cy="${c - r * 0.35}" rx="${r * 0.35}" ry="${r * 0.18}" fill="#ffffff" opacity="0.35"/>`;
  if (chave === 'jupiter') corpo += `<ellipse cx="${c + r * 0.25}" cy="${c + r * 0.28}" rx="${r * 0.22}" ry="${r * 0.13}" fill="#b33c2e" opacity="0.8"/>`;
  if (chave === 'terra') corpo += `<path d="M ${c - r * 0.4} ${c} q ${r * 0.3} ${-r * 0.5} ${r * 0.7} ${-r * 0.15} q ${-r * 0.1} ${r * 0.5} ${-r * 0.55} ${r * 0.4} z" fill="${p.detalhe}" opacity="0.9"/>`;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" role="img" aria-label="planeta ${p.nome}">${corpo}</svg>`;
}

function rodadas() {
  return [
    {
      pergunta: 'Qual destes é o MAIOR planeta?',
      mostra: ['terra', 'jupiter', 'marte'],
      opcaoPorPlaneta: true,
      certa: 'jupiter',
      descoberta: 'Júpiter é o gigante: dentro dele caberiam mais de MIL Terras!',
    },
    {
      pergunta: 'Qual é o famoso planeta VERMELHO?',
      mostra: ['venus', 'marte', 'netuno'],
      opcaoPorPlaneta: true,
      certa: 'marte',
      descoberta: 'Marte é vermelho por causa da ferrugem (óxido de ferro) na poeira dele!',
    },
    {
      pergunta: 'Quantas TERRAS cabem dentro de Júpiter?',
      mostra: ['terra', 'jupiter'],
      opcoes: ['DEZ', 'CEM', 'MAIS DE MIL'],
      certa: 'MAIS DE MIL',
      descoberta: 'Mais de MIL Terras! Números gigantes descrevem coisas gigantes.',
    },
    {
      pergunta: 'Do Sol até a TERRA são 150 MILHÕES de km. Escreve-se…',
      mostra: ['terra'],
      opcoes: ['150.000.000', '150.000', '1.500'],
      certa: '150.000.000',
      descoberta: '150 milhões tem SEIS zeros depois do 150. Cada vírgula de milhar são 3 zeros!',
    },
    {
      pergunta: 'Nosso foguete anda 1 MILHÃO de km por dia. Até a LUA (400 MIL km), leva…',
      mostra: [],
      opcoes: ['MENOS DE 1 DIA', '1 MÊS', '1 ANO'],
      certa: 'MENOS DE 1 DIA',
      descoberta: '400 mil é MENOR que 1 milhão — chegamos antes do jantar! 🌕',
    },
    {
      pergunta: 'Até MARTE são 100 MILHÕES de km. A 1 MILHÃO por dia, levamos…',
      mostra: ['marte'],
      opcoes: ['10 DIAS', '100 DIAS', 'MIL DIAS'],
      certa: '100 DIAS',
      descoberta: '100 milhões ÷ 1 milhão = 100. Dividir números redondos é só cortar os zeros iguais!',
    },
    {
      pergunta: 'Até NETUNO são 4 BILHÕES e meio de km! A 1 MILHÃO por dia…',
      mostra: ['netuno'],
      opcoes: ['45 DIAS', '450 DIAS', '4.500 DIAS (12 anos!)'],
      certa: '4.500 DIAS (12 anos!)',
      descoberta: '4.500 dias — uns 12 ANOS de viagem! O espaço é grande de verdade.',
    },
    {
      pergunta: 'Saindo do SOL, qual planeta vem PRIMEIRO?',
      mostra: ['mercurio', 'terra', 'jupiter'],
      opcaoPorPlaneta: true,
      certa: 'mercurio',
      descoberta: 'Mercúrio é o primeiro e o mais rápido: dá a volta no Sol em só 88 dias!',
    },
  ];
}

export function missaoPlanetas(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  const lista = rodadas();
  let rodada = 0, acertos = 0, vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) {
      return fimMissao(raiz, ctx, 'planetas', {
        venceu: acertos >= 6,
        pontos: acertos,
        mensagem: `Astronauta de primeira em ${acertos} de ${RODADAS} paradas da viagem!`,
      });
    }
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(rodada, RODADAS, acertos));

    const r = lista[rodada - 1];
    let tentou = false;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const topo = document.createElement('div');
    topo.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px';
    topo.appendChild(criarRobo({ tamanho: 44, cor: '#7fd4d8' }));
    const perg = document.createElement('p');
    perg.style.cssText = 'font-weight:800;font-size:1.05rem';
    perg.textContent = r.pergunta;
    topo.appendChild(perg);
    painel.appendChild(topo);
    voz.falar(r.pergunta);

    if (r.mostra.length && !r.opcaoPorPlaneta) {
      const zona = document.createElement('div');
      zona.className = 'visual-blocos';
      zona.innerHTML = r.mostra.map(ch => `<div class="grupo-quantidade">${svgPlaneta(ch)}<span style="font-size:.8rem">${PLANETAS[ch].nome}</span></div>`).join('');
      painel.appendChild(zona);
    }

    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    const opcoes = r.opcaoPorPlaneta
      ? embaralhar(r.mostra).map(ch => ({ rotulo: PLANETAS[ch].nome, svg: svgPlaneta(ch), valor: ch }))
      : embaralhar([...r.opcoes]).map(o => ({ rotulo: o, valor: o }));
    for (const op of opcoes) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      if (op.svg) {
        b.style.cssText = 'background:rgba(255,255,255,.95);min-width:104px;min-height:104px;padding:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:var(--tinta);font-size:.75rem';
        b.innerHTML = op.svg + `<span>${op.rotulo}</span>`;
        b.setAttribute('aria-label', op.rotulo);
      } else {
        b.style.cssText = 'background:var(--tinta);min-width:104px;font-size:.95rem;padding:.5rem .7rem';
        b.textContent = op.rotulo;
      }
      b.addEventListener('click', () => {
        if (op.valor === r.certa) {
          if (!tentou) acertos++;
          audio.fusao();
          confete(20);
          linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
          const desc = document.createElement('p');
          desc.className = 'passo-solucao';
          desc.innerHTML = `💡 <b>Descoberta:</b> ${r.descoberta}`;
          painel.appendChild(desc);
          voz.falar(r.descoberta);
          esperarFalaEntao(proxima, 1400);
        } else {
          tentou = true;
          audio.erro();
          b.classList.add('tremida');
          b.disabled = true;
          popupAviso('Pense com calma');
        }
      });
      linha.appendChild(b);
    }
    painel.appendChild(linha);
    raiz.appendChild(painel);
  }

  proxima();
  return () => { vivo = false; };
}
