// Foguete da Contagem — números gigantes e TIPOS de contagem.
// A criança descobre que contar até 1 bilhão de 1 em 1 levaria ~32 anos,
// e então aprende a contagem por potências: de 1 em 1 até 10, de 10 em 10
// até 100, de 100 em 100 até 1.000… chegando ao BILHÃO em 81 pulos.
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { formatarNumero, falaNumero } from '../characters.js';
import { placarMissao, fimMissao, embaralhar } from '../screens/robos.js';

const ETAPAS = [
  { passo: 1, ate: 10, nome: 'de 1 em 1' },
  { passo: 10, ate: 100, nome: 'de 10 em 10' },
  { passo: 100, ate: 1_000, nome: 'de 100 em 100' },
  { passo: 1_000, ate: 10_000, nome: 'de mil em mil' },
  { passo: 10_000, ate: 100_000, nome: 'de 10 mil em 10 mil' },
  { passo: 100_000, ate: 1_000_000, nome: 'de 100 mil em 100 mil' },
  { passo: 1_000_000, ate: 10_000_000, nome: 'de 1 milhão em 1 milhão' },
  { passo: 10_000_000, ate: 100_000_000, nome: 'de 10 milhões em 10 milhões' },
  { passo: 100_000_000, ate: 1_000_000_000, nome: 'de 100 milhões em 100 milhões' },
];

const QUIZZES = [
  {
    aposEtapa: 0,
    pergunta: 'Contando 1 número por segundo, sem dormir, quanto tempo até 1 BILHÃO?',
    opcoes: ['3 DIAS', '2 MESES', '32 ANOS'],
    certa: '32 ANOS',
    descoberta: '32 ANOS contando sem parar! Por isso os matemáticos inventaram pulos mais espertos. Vamos aprender?',
  },
  {
    aposEtapa: 3,
    pergunta: 'Para ir de 200 até 1.000, pulamos de quanto em quanto?',
    opcoes: ['DE 10 EM 10', 'DE 100 EM 100', 'DE MIL EM MIL'],
    certa: 'DE 100 EM 100',
    descoberta: 'Isso! Cada família de números tem seu pulo: unidades, dezenas, centenas, milhares…',
  },
  {
    aposEtapa: 6,
    pergunta: 'Cada etapa multiplica o pulo por 10. Esse crescimento se chama…',
    opcoes: ['PULO DE MINHOCA', 'PROGRESSÃO GEOMÉTRICA', 'CONTA DE PADARIA'],
    certa: 'PROGRESSÃO GEOMÉTRICA',
    descoberta: 'Progressão geométrica: em vez de somar sempre igual, a gente MULTIPLICA. É assim que se chega longe rápido!',
  },
];

export function missaoContagem(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let etapa = 0;        // índice em ETAPAS (0..8); começa após o quiz de abertura
  let acertosQuiz = 0;
  let pulosTotais = 0;
  let vivo = true;

  function fim() {
    fimMissao(raiz, ctx, 'contagem', {
      venceu: true,
      pontos: acertosQuiz,
      mensagem: `Você chegou a 1 BILHÃO com apenas ${pulosTotais} pulos — de 1 em 1 seriam 32 anos! (${acertosQuiz} de ${QUIZZES.length} perguntas de primeira)`,
    });
  }

  function mostrarQuiz(q, depois) {
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(Math.min(etapa + 1, 9), 9, acertosQuiz));
    let tentou = false;
    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const topo = document.createElement('div');
    topo.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px';
    topo.appendChild(criarRobo({ tamanho: 46 }));
    const p = document.createElement('p');
    p.style.cssText = 'font-weight:800;font-size:1.1rem';
    p.textContent = q.pergunta;
    topo.appendChild(p);
    painel.appendChild(topo);
    voz.falar(q.pergunta);

    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    for (const op of embaralhar([...q.opcoes])) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      b.style.cssText = 'background:var(--tinta);min-width:100px;font-size:.95rem;padding:.5rem .7rem';
      b.textContent = op;
      b.addEventListener('click', () => {
        if (op === q.certa) {
          if (!tentou) acertosQuiz++;
          audio.fusao();
          confete(25);
          linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
          const desc = document.createElement('p');
          desc.className = 'passo-solucao';
          desc.innerHTML = `💡 <b>Descoberta:</b> ${q.descoberta}`;
          painel.appendChild(desc);
          voz.falar(q.descoberta);
          esperarFalaEntao(() => { if (vivo) depois(); }, 1500);
        } else {
          tentou = true;
          audio.erro();
          b.classList.add('tremida');
          b.disabled = true;
        }
      });
      linha.appendChild(b);
    }
    painel.appendChild(linha);
    raiz.appendChild(painel);
  }

  function mostrarEtapa() {
    if (!vivo) return;
    if (etapa >= ETAPAS.length) {
      audio.vitoria();
      confete(90);
      return setTimeout(fim, 600);
    }
    const quiz = QUIZZES.find(q => q.aposEtapa === etapa && !q.feito);
    if (quiz) {
      quiz.feito = true;
      return mostrarQuiz(quiz, mostrarEtapa);
    }

    const e = ETAPAS[etapa];
    const base = etapa === 0 ? 1 : ETAPAS[etapa - 1].ate; // a contagem começa no 1
    let atual = base;
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(etapa + 1, 9, acertosQuiz));

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const instrucao = `Agora contamos ${e.nome}, até ${falaNumero(e.ate)}!`;
    painel.innerHTML = `<p style="font-weight:800;font-size:1.05rem">🚀 ${instrucao}</p>`;
    voz.falar(instrucao);

    const numerao = document.createElement('div');
    numerao.className = 'numerao';
    numerao.setAttribute('aria-live', 'polite');
    numerao.textContent = formatarNumero(atual);
    painel.appendChild(numerao);

    const trilhos = document.createElement('div');
    trilhos.className = 'barra-progresso';
    trilhos.innerHTML = '<div style="width:0%"></div>';
    painel.appendChild(trilhos);

    const info = document.createElement('p');
    info.style.cssText = 'font-weight:700;opacity:.8;margin-top:.4rem';
    info.textContent = `Pulos até agora: ${pulosTotais}`;
    painel.appendChild(info);

    const botao = document.createElement('button');
    botao.className = 'btn grande';
    botao.style.cssText = 'background:var(--c6);margin-top:.7rem';
    botao.textContent = `🦘 Pular +${formatarNumero(e.passo)}`;
    botao.addEventListener('click', () => {
      atual += e.passo;
      pulosTotais++;
      audio.pop();
      numerao.textContent = formatarNumero(atual);
      numerao.classList.remove('nascimento');
      void numerao.offsetWidth;
      numerao.classList.add('nascimento');
      trilhos.firstChild.style.width = `${(atual - base) / (e.ate - base) * 100}%`;
      info.textContent = `Pulos até agora: ${pulosTotais}`;
      if (atual >= e.ate) {
        botao.disabled = true;
        audio.fanfarra();
        confete(30);
        const marco = document.createElement('p');
        marco.className = 'passo-solucao';
        marco.innerHTML = `🎉 Chegamos a <b>${formatarNumero(e.ate)}</b>! ${etapa + 1 < ETAPAS.length ? `O próximo pulo é 10 vezes maior: ${ETAPAS[etapa + 1].nome}.` : 'É 1 BILHÃO!'}`;
        painel.appendChild(marco);
        voz.falar(`Chegamos a ${falaNumero(e.ate)}!`);
        etapa++;
        esperarFalaEntao(() => { if (vivo) mostrarEtapa(); }, 1400);
      }
    });
    painel.appendChild(botao);
    raiz.appendChild(painel);
  }

  // recomeça o estado dos quizzes a cada partida
  QUIZZES.forEach(q => { delete q.feito; });
  mostrarEtapa();
  return () => { vivo = false; };
}
