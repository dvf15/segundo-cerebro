// Comande o Robô — noções espaciais: direções, lateralidade e coordenadas.
// A criança monta um programa de setas e vê o robô executar passo a passo.
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { placarMissao, fimMissao } from '../screens/robos.js';

const N = 5, RODADAS = 6, MAX_PASSOS = 12;
const SETAS = { cima: '⬆️', baixo: '⬇️', esquerda: '⬅️', direita: '➡️' };
const DELTA = { cima: [0, 1], baixo: [0, -1], esquerda: [-1, 0], direita: [1, 0] };

// caminho existe? (busca em largura)
function temCaminho(inicio, fim, pedras) {
  const chave = (x, y) => `${x},${y}`;
  const bloqueada = new Set(pedras.map(p => chave(p.x, p.y)));
  const visitada = new Set([chave(inicio.x, inicio.y)]);
  const fila = [inicio];
  while (fila.length) {
    const { x, y } = fila.shift();
    if (x === fim.x && y === fim.y) return true;
    for (const [dx, dy] of Object.values(DELTA)) {
      const nx = x + dx, ny = y + dy;
      if (nx < 1 || nx > N || ny < 1 || ny > N) continue;
      if (bloqueada.has(chave(nx, ny)) || visitada.has(chave(nx, ny))) continue;
      visitada.add(chave(nx, ny));
      fila.push({ x: nx, y: ny });
    }
  }
  return false;
}

function gerarRodada(rodada) {
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const robo = { x: 1 + Math.floor(Math.random() * N), y: 1 };
    const estrela = { x: 1 + Math.floor(Math.random() * N), y: 3 + Math.floor(Math.random() * 3) };
    const qtd = Math.min(1 + Math.floor((rodada - 1) / 2), 4);
    const pedras = [];
    while (pedras.length < qtd) {
      const p = { x: 1 + Math.floor(Math.random() * N), y: 1 + Math.floor(Math.random() * N) };
      const livre = !(p.x === robo.x && p.y === robo.y) && !(p.x === estrela.x && p.y === estrela.y) &&
        !pedras.some(q => q.x === p.x && q.y === p.y);
      if (livre) pedras.push(p);
    }
    if (temCaminho(robo, estrela, pedras)) return { robo, estrela, pedras };
  }
  return { robo: { x: 1, y: 1 }, estrela: { x: 4, y: 4 }, pedras: [] };
}

export function missaoComande(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let rodada = 0, acertos = 0;
  let vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) {
      return fimMissao(raiz, ctx, 'comande', {
        venceu: acertos >= 4,
        pontos: acertos,
        mensagem: `Você guiou o robô até a estrela em ${acertos} de ${RODADAS} missões logo na primeira decolagem.`,
      });
    }
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(rodada, RODADAS, acertos));

    const { robo, estrela, pedras } = gerarRodada(rodada);
    const comCoordenadas = rodada >= 4;
    let pos = { ...robo };
    let programa = [];
    let primeiraExecucao = true;
    let executando = false;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const enunciado = comCoordenadas
      ? `A estrela está na casa (${estrela.x}, ${estrela.y}). Programe o caminho do robô!`
      : 'Programe o caminho do robô até a estrela — sem bater nos asteroides!';
    painel.innerHTML = `<p style="font-weight:800;font-size:1.05rem">${enunciado}</p>`;
    voz.falar(enunciado);

    // tabuleiro com eixos (x embaixo, y na lateral) — coordenadas de verdade
    const moldura = document.createElement('div');
    moldura.className = 'mapa-robo';
    const grade = document.createElement('div');
    grade.className = 'trilha-tabuleiro mapa-grade';
    const celulas = {};
    for (let y = N; y >= 1; y--) {
      for (let x = 1; x <= N; x++) {
        const c = document.createElement('div');
        c.className = 'casa casa-espacial';
        c.dataset.x = x; c.dataset.y = y;
        grade.appendChild(c);
        celulas[`${x},${y}`] = c;
      }
    }
    const eixoY = document.createElement('div');
    eixoY.className = 'eixo eixo-y';
    for (let y = N; y >= 1; y--) eixoY.innerHTML += `<span>${y}</span>`;
    const eixoX = document.createElement('div');
    eixoX.className = 'eixo eixo-x';
    for (let x = 1; x <= N; x++) eixoX.innerHTML += `<span>${x}</span>`;
    moldura.appendChild(eixoY);
    moldura.appendChild(grade);
    moldura.appendChild(document.createElement('span'));
    moldura.appendChild(eixoX);
    painel.appendChild(moldura);

    const desenhar = () => {
      for (const c of Object.values(celulas)) c.innerHTML = '';
      celulas[`${estrela.x},${estrela.y}`].innerHTML = '<span style="font-size:1.5rem">⭐</span>';
      for (const p of pedras) celulas[`${p.x},${p.y}`].innerHTML = '<span style="font-size:1.3rem">☄️</span>';
      const cel = celulas[`${pos.x},${pos.y}`];
      cel.innerHTML = '';
      cel.appendChild(criarRobo({ tamanho: 28, flutua: false }));
    };
    desenhar();

    // fila do programa
    const fila = document.createElement('div');
    fila.className = 'fila-programa';
    fila.setAttribute('aria-label', 'Programa do robô. Toque numa seta para removê-la.');
    const desenharFila = () => {
      fila.innerHTML = '';
      if (!programa.length) fila.innerHTML = '<span style="opacity:.6;font-weight:700">Toque nas setas para programar…</span>';
      programa.forEach((dir, i) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = SETAS[dir];
        chip.setAttribute('aria-label', `Passo ${i + 1}: ${dir}. Toque para remover.`);
        chip.addEventListener('click', () => {
          if (executando) return;
          programa.splice(i, 1);
          audio.clique();
          desenharFila();
        });
        fila.appendChild(chip);
      });
    };
    desenharFila();
    painel.appendChild(fila);

    const controles = document.createElement('div');
    controles.className = 'controles-robo';
    for (const dir of ['cima', 'baixo', 'esquerda', 'direita']) {
      const b = document.createElement('button');
      b.className = 'btn secundario';
      b.textContent = SETAS[dir];
      b.setAttribute('aria-label', `Adicionar passo: ${dir}`);
      b.addEventListener('click', () => {
        if (executando || programa.length >= MAX_PASSOS) return;
        programa.push(dir);
        audio.clique();
        desenharFila();
      });
      controles.appendChild(b);
    }
    const executar = document.createElement('button');
    executar.className = 'btn';
    executar.style.background = 'var(--c4)';
    executar.textContent = '▶ Executar';
    const limpar = document.createElement('button');
    limpar.className = 'btn secundario';
    limpar.textContent = '🧹';
    limpar.setAttribute('aria-label', 'Apagar o programa');
    limpar.addEventListener('click', () => {
      if (executando) return;
      programa = [];
      audio.clique();
      desenharFila();
    });
    controles.appendChild(executar);
    controles.appendChild(limpar);
    painel.appendChild(controles);
    raiz.appendChild(painel);

    executar.addEventListener('click', () => {
      if (executando || !programa.length) return;
      executando = true;
      executar.disabled = true;
      let i = 0;
      const passo = () => {
        if (!vivo) return;
        if (pos.x === estrela.x && pos.y === estrela.y) return sucesso();
        if (i >= programa.length) return falhou('O programa acabou antes de chegar. Ajuste as setas!');
        const [dx, dy] = DELTA[programa[i]];
        const nx = pos.x + dx, ny = pos.y + dy;
        i++;
        if (nx < 1 || nx > N || ny < 1 || ny > N) return falhou('Ops! O robô quase caiu do mapa.');
        if (pedras.some(p => p.x === nx && p.y === ny)) return falhou('Ops! Bateu num asteroide.');
        pos = { x: nx, y: ny };
        audio.encaixe();
        desenhar();
        setTimeout(passo, 380);
      };
      setTimeout(passo, 250);

      function sucesso() {
        audio.vitoria();
        if (primeiraExecucao) acertos++;
        confete(30);
        voz.falar('Chegou na estrela! Muito bem!');
        esperarFalaEntao(proxima, 1000);
      }
      function falhou(motivo) {
        audio.erro();
        voz.falar(motivo);
        const aviso = document.createElement('p');
        aviso.className = 'passo-solucao';
        aviso.textContent = motivo + ' O robô voltou ao começo — conserte o programa e tente de novo.';
        painel.appendChild(aviso);
        setTimeout(() => aviso.remove(), 2600);
        primeiraExecucao = false;
        pos = { ...robo };
        desenhar();
        executando = false;
        executar.disabled = false;
      }
    });
  }

  proxima();
  return () => { vivo = false; };
}
