// Rampa dos Ângulos — trigonometria lúdica: giros e graus, ângulo agudo/reto/
// obtuso, e lançamentos onde a criança DESCOBRE que 30° e 60° caem no mesmo
// lugar (complementares) e que 45° vai mais longe. Experimentar antes da fórmula.
import { audio } from '../audio.js';
import { confete } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { popupAviso } from '../popup.js';
import { placarMissao, fimMissao, embaralhar } from '../screens/robos.js';

const RODADAS = 8;
const ANGULOS_RAMPA = [15, 30, 45, 60, 75];
const ALCANCE = { 15: 130, 30: 225, 45: 260, 60: 225, 75: 130 };
const ALVOS = { perto: { x: 130, angulos: [15, 75] }, medio: { x: 225, angulos: [30, 60] }, longe: { x: 260, angulos: [45] } };

function svgAngulo(graus, { tamanho = 150 } = {}) {
  const cx = 20, cy = tamanho - 20, r = tamanho - 46;
  const rad = -graus * Math.PI / 180;
  const x2 = cx + r * Math.cos(rad), y2 = cy + r * Math.sin(rad);
  const arcoR = 34;
  const ax = cx + arcoR * Math.cos(rad), ay = cy + arcoR * Math.sin(rad);
  return `<svg width="${tamanho}" height="${tamanho}" viewBox="0 0 ${tamanho} ${tamanho}" role="img" aria-label="ângulo de ${graus} graus">
    <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#eaf2ff" stroke-width="5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#5ac8ff" stroke-width="5" stroke-linecap="round"/>
    <path d="M ${cx + arcoR} ${cy} A ${arcoR} ${arcoR} 0 ${graus > 180 ? 1 : 0} 0 ${ax} ${ay}" fill="none" stroke="#ffd166" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="#ffd166"/>
  </svg>`;
}

function planejarRodadas() {
  const quizClasse = () => {
    const graus = embaralhar([30, 45, 60, 90, 120, 150])[0];
    const certa = graus < 90 ? 'Agudo' : graus === 90 ? 'Reto' : 'Obtuso';
    return { tipo: 'quiz', graus, pergunta: 'Este ângulo é agudo, reto ou obtuso?', opcoes: embaralhar(['Agudo', 'Reto', 'Obtuso']), certa,
      descoberta: `${graus}° é ${certa.toLowerCase()}: ${certa === 'Agudo' ? 'menor que 90°' : certa === 'Reto' ? 'exatamente 90°, um canto perfeito' : 'maior que 90°'}.` };
  };
  const quizGraus = () => {
    const q = embaralhar([
      { pergunta: 'Meia-volta completa: quantos graus?', certa: '180°', opcoes: ['90°', '180°', '360°'], descoberta: 'Meia-volta = 180°. A volta inteira tem 360°!' },
      { pergunta: 'Um canto reto (como o da porta): quantos graus?', certa: '90°', opcoes: ['45°', '90°', '180°'], descoberta: 'O ângulo reto tem 90° — um quarto da volta.' },
      { pergunta: 'A volta inteira: quantos graus?', certa: '360°', opcoes: ['100°', '180°', '360°'], descoberta: 'A volta completa tem 360°, como o robô girando até voltar ao começo.' },
    ])[0];
    return { tipo: 'quiz', graus: null, ...q, opcoes: embaralhar([...q.opcoes]) };
  };
  return [
    { tipo: 'giro' },
    { tipo: 'rampa', alvo: 'medio' },
    { tipo: 'giro' },
    quizClasse(),
    { tipo: 'rampa', alvo: 'perto' },
    { tipo: 'rampa', alvo: 'medio', complementar: true },
    quizGraus(),
    { tipo: 'rampa', alvo: 'longe' },
  ];
}

export function missaoAngulos(el, ctx) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  const rodadas = planejarRodadas();
  let rodada = 0, acertos = 0, vivo = true;
  let anguloUsadoNoMedio = null; // para a rodada dos complementares

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > RODADAS) {
      return fimMissao(raiz, ctx, 'angulos', {
        venceu: acertos >= 5,
        pontos: acertos,
        mensagem: `Piloto de primeira em ${acertos} de ${RODADAS} manobras! Você descobriu o segredo dos ângulos.`,
      });
    }
    raiz.innerHTML = '';
    raiz.appendChild(placarMissao(rodada, RODADAS, acertos));
    const r = rodadas[rodada - 1];
    if (r.tipo === 'giro') rodadaGiro();
    else if (r.tipo === 'rampa') rodadaRampa(r);
    else rodadaQuiz(r);
  }

  function concluir(painel, descoberta, ganhouPonto) {
    if (ganhouPonto) acertos++;
    audio.fusao();
    confete(20);
    const desc = document.createElement('p');
    desc.className = 'passo-solucao';
    desc.innerHTML = `💡 <b>Descoberta:</b> ${descoberta}`;
    painel.appendChild(desc);
    voz.falar(descoberta);
    esperarFalaEntao(proxima, 1500);
  }

  // ---------- girar o robô (graus e sentido) ----------
  function rodadaGiro() {
    const alvo = (1 + Math.floor(Math.random() * 7)) * 45; // 45..315
    const minimo = Math.min(Math.ceil((alvo % 360) / 90), Math.ceil((360 - alvo) / 90)) || 1;
    let direcao = 0, toques = 0, resolvido = false;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const pergunta = 'Gire o robô até ele apontar para o planeta!';
    painel.innerHTML = `<p style="font-weight:800;font-size:1.1rem">${pergunta}</p>`;
    voz.falar(pergunta);

    const palco = document.createElement('div');
    palco.className = 'giro-palco';
    for (let a = 0; a < 360; a += 45) {
      const marca = document.createElement('span');
      marca.className = 'giro-slot';
      const rad = (a - 90) * Math.PI / 180;
      marca.style.left = `calc(50% + ${104 * Math.cos(rad)}px)`;
      marca.style.top = `calc(50% + ${104 * Math.sin(rad)}px)`;
      marca.textContent = a === alvo ? '🪐' : '·';
      if (a === alvo) marca.style.fontSize = '1.8rem';
      palco.appendChild(marca);
    }
    const ponteiro = document.createElement('div');
    ponteiro.className = 'giro-ponteiro';
    ponteiro.innerHTML = '<div style="font-size:1.5rem;line-height:1">🔺</div>';
    ponteiro.appendChild(criarRobo({ tamanho: 44, flutua: false }));
    palco.appendChild(ponteiro);
    painel.appendChild(palco);

    const info = document.createElement('p');
    info.style.cssText = 'font-weight:800;margin-top:.4rem';
    info.setAttribute('aria-live', 'polite');
    info.textContent = 'Giro total: 0°';
    painel.appendChild(info);

    const controles = document.createElement('div');
    controles.style.cssText = 'display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-top:.5rem';
    for (const [rotulo, delta] of [['↺ 45°', -45], ['↺ 90°', -90], ['↻ 45°', 45], ['↻ 90°', 90]]) {
      const b = document.createElement('button');
      b.className = 'btn secundario';
      b.textContent = rotulo;
      b.setAttribute('aria-label', `Girar ${Math.abs(delta)} graus para a ${delta > 0 ? 'direita' : 'esquerda'}`);
      b.addEventListener('click', () => {
        if (resolvido) return;
        toques++;
        direcao += delta;
        audio.encaixe();
        ponteiro.style.transform = `translate(-50%, -50%) rotate(${direcao}deg)`;
        info.textContent = `Giro total: ${Math.abs(direcao)}° ${direcao === 0 ? '' : direcao > 0 ? '(para a direita ↻)' : '(para a esquerda ↺)'}`;
        if (((direcao % 360) + 360) % 360 === alvo) {
          resolvido = true;
          controles.querySelectorAll('button').forEach(x => { x.disabled = true; });
          setTimeout(() => concluir(painel,
            `Apontou! ${alvo}° para a direita é o mesmo que ${360 - alvo}° para a esquerda — a volta inteira tem 360°.`,
            toques <= minimo + 1), 450);
        }
      });
      controles.appendChild(b);
    }
    painel.appendChild(controles);
    raiz.appendChild(painel);
  }

  // ---------- rampa de lançamento (complementares e alcance) ----------
  function rodadaRampa(cfg) {
    const alvo = ALVOS[cfg.alvo];
    const proibido = cfg.complementar ? anguloUsadoNoMedio : null;
    const permitidos = alvo.angulos.filter(a => a !== proibido);
    let angulo = 45, resolvido = false, primeira = true;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    painel.dataset.angulos = permitidos.join(','); // gancho para testes
    const pergunta = cfg.complementar
      ? `Acerte a MESMA cratera de antes, mas usando um ângulo diferente de ${proibido}°!`
      : 'Escolha o ângulo da rampa e acerte a cratera-alvo!';
    painel.innerHTML = `<p style="font-weight:800;font-size:1.05rem">${pergunta}</p>`;
    voz.falar(pergunta);

    const W = 320, H = 190, chao = H - 18, x0 = 30;
    const cena = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cena.setAttribute('viewBox', `0 0 ${W} ${H}`);
    cena.setAttribute('class', 'rampa-cena');
    const estatico = () => {
      let s = `<line x1="0" y1="${chao}" x2="${W}" y2="${chao}" stroke="#8d7bb8" stroke-width="4"/>`;
      for (const [nome, a] of Object.entries(ALVOS)) {
        const destaque = a.x === alvo.x;
        s += `<ellipse cx="${x0 + a.x}" cy="${chao}" rx="17" ry="6" fill="${destaque ? '#ffd166' : '#3a2b6e'}" stroke="${destaque ? '#a06e08' : '#8d7bb8'}" stroke-width="2"/>`;
        if (destaque) s += `<text x="${x0 + a.x}" y="${chao - 12}" text-anchor="middle" font-size="15">🎯</text>`;
      }
      const rad = angulo * Math.PI / 180;
      s += `<line x1="${x0}" y1="${chao}" x2="${x0 + 42 * Math.cos(rad)}" y2="${chao - 42 * Math.sin(rad)}" stroke="#5ac8ff" stroke-width="6" stroke-linecap="round"/>`;
      s += `<text x="${x0 + 6}" y="${chao - 46}" font-size="14" font-weight="800" fill="#eaf2ff">${angulo}°</text>`;
      return s;
    };
    cena.innerHTML = estatico();
    painel.appendChild(cena);

    const controles = document.createElement('div');
    controles.style.cssText = 'display:flex;gap:.5rem;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:.4rem';
    const menos = document.createElement('button');
    menos.className = 'btn secundario';
    menos.textContent = '−15°';
    const mais = document.createElement('button');
    mais.className = 'btn secundario';
    mais.textContent = '+15°';
    const mostra = document.createElement('span');
    mostra.style.cssText = 'font-weight:900;font-size:1.3rem;color:var(--luz-espacial);min-width:3.2ch;text-align:center';
    mostra.setAttribute('aria-live', 'polite');
    const atualizar = () => { mostra.textContent = `${angulo}°`; cena.innerHTML = estatico(); };
    atualizar();
    menos.addEventListener('click', () => { if (!resolvido && angulo > 15) { angulo -= 15; audio.clique(); atualizar(); } });
    mais.addEventListener('click', () => { if (!resolvido && angulo < 75) { angulo += 15; audio.clique(); atualizar(); } });
    const lancar = document.createElement('button');
    lancar.className = 'btn';
    lancar.style.background = 'var(--c4)';
    lancar.textContent = '🚀 Lançar';
    controles.appendChild(menos);
    controles.appendChild(mostra);
    controles.appendChild(mais);
    controles.appendChild(lancar);
    painel.appendChild(controles);
    raiz.appendChild(painel);

    lancar.addEventListener('click', () => {
      if (resolvido) return;
      if (cfg.complementar && angulo === proibido) {
        audio.erro();
        voz.falar(`O desafio é usar um ângulo diferente de ${proibido} graus!`);
        return;
      }
      lancar.disabled = true;
      audio.pop();
      const R = ALCANCE[angulo];
      const hMax = 105 * Math.sin(angulo * Math.PI / 180) ** 2 + 18;
      const bola = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bola.setAttribute('r', '7');
      bola.setAttribute('fill', '#ffd166');
      bola.setAttribute('stroke', '#a06e08');
      cena.appendChild(bola);
      const t0 = performance.now(), dur = 750;
      const anima = (agora) => {
        if (!vivo) return;
        const t = Math.min(1, (agora - t0) / dur);
        bola.setAttribute('cx', x0 + R * t);
        bola.setAttribute('cy', chao - hMax * 4 * t * (1 - t) - 6);
        if (t < 1) return requestAnimationFrame(anima);
        // aterrissou
        if (Math.abs(R - alvo.x) < 20) {
          resolvido = true;
          if (cfg.alvo === 'medio') anguloUsadoNoMedio = angulo;
          const licao = cfg.complementar
            ? `${proibido}° e ${angulo}° caem no MESMO lugar! Eles somam 90° — são ângulos complementares.`
            : angulo === 45
              ? '45° é o campeão de distância — nem muito baixo, nem muito alto!'
              : `Com ${angulo}°, o foguete ${angulo < 45 ? 'voa baixinho' : 'sobe bastante'} e cai nessa distância. Guarde essa descoberta!`;
          concluir(painel, licao, primeira);
        } else {
          primeira = false;
          audio.erro();
          const msg = R > alvo.x ? 'Passou do alvo! Tente outro ângulo.' : 'Faltou força na distância! Tente outro ângulo.';
          voz.falar(msg);
          const aviso = document.createElement('p');
          aviso.className = 'passo-solucao';
          aviso.textContent = msg;
          painel.appendChild(aviso);
          setTimeout(() => { aviso.remove(); bola.remove(); lancar.disabled = false; }, 1600);
        }
      };
      requestAnimationFrame(anima);
    });
  }

  // ---------- quiz de ângulos ----------
  function rodadaQuiz(r) {
    let tentou = false;
    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    painel.innerHTML = `<p style="font-weight:800;font-size:1.1rem">${r.pergunta}</p>`;
    voz.falar(r.pergunta);
    if (r.graus) {
      const zona = document.createElement('div');
      zona.className = 'visual-blocos';
      zona.innerHTML = svgAngulo(r.graus);
      painel.appendChild(zona);
    }
    const linha = document.createElement('div');
    linha.className = 'visual-blocos';
    for (const op of r.opcoes) {
      const b = document.createElement('button');
      b.className = 'bloco-jogo';
      b.style.cssText = 'background:var(--tinta);min-width:92px;font-size:1.1rem;padding:.4rem .7rem';
      b.textContent = op;
      b.addEventListener('click', () => {
        if (op === r.certa) {
          linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
          concluir(painel, r.descoberta, !tentou);
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
