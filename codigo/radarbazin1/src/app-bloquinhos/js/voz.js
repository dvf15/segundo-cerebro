// Narração por voz (Web Speech API) — usa a melhor voz em português do
// aparelho, sem internet e sem arquivos de áudio. Se o aparelho não tiver
// voz, o jogo segue normal, só sem narração.
import { audio } from './audio.js';
import { store } from './storage.js';

let vozEscolhida = null;
let falaAtual = Promise.resolve();

/** Nota de qualidade: vozes naturais ganham, vozes robóticas (eSpeak) perdem. */
function pontuar(v) {
  let p = 0;
  const nome = (v.name || '').toLowerCase();
  if (v.lang === 'pt-BR' || v.lang === 'pt_BR') p += 5;
  else if ((v.lang || '').startsWith('pt')) p += 2;
  else return -99; // só vozes em português
  if (/natural|neural|premium|enhanced|aprimorad/.test(nome)) p += 5;
  if (/google/.test(nome)) p += 3;
  if (/luciana|felipe|francisca|camila|thalita|antonio/.test(nome)) p += 2;
  if (/espeak|compact|robo/.test(nome)) p -= 5;
  if (!v.localService) p += 1; // vozes de nuvem costumam soar melhor (quando online)
  return p;
}

function atualizarVozes() {
  const vozes = speechSynthesis.getVoices();
  const preferida = store.dados.vozURI && vozes.find(v => v.voiceURI === store.dados.vozURI);
  if (preferida) { vozEscolhida = preferida; return; }
  vozEscolhida = vozes
    .filter(v => pontuar(v) > -50)
    .sort((a, b) => pontuar(b) - pontuar(a))[0] || null;
}
if ('speechSynthesis' in window) {
  atualizarVozes();
  speechSynthesis.addEventListener?.('voiceschanged', atualizarVozes);
}

export const voz = {
  get disponivel() { return 'speechSynthesis' in window; },
  get vozAtual() { return vozEscolhida; },

  /** Lista as vozes em português disponíveis, da melhor para a pior. */
  listarVozesPt() {
    if (!this.disponivel) return [];
    return speechSynthesis.getVoices()
      .filter(v => pontuar(v) > -50)
      .sort((a, b) => pontuar(b) - pontuar(a));
  },

  /** Define a voz preferida (persistida) e a usa daqui em diante. */
  escolherVoz(voiceURI) {
    store.setVozURI(voiceURI);
    atualizarVozes();
  },

  /**
   * Fala o texto e retorna uma Promise que resolve quando a fala TERMINA
   * (ou imediatamente, se não houver voz / estiver no mudo).
   */
  falar(texto) {
    if (!this.disponivel || audio.mudo || !texto) {
      falaAtual = Promise.resolve();
      return falaAtual;
    }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'pt-BR';
      if (vozEscolhida) u.voice = vozEscolhida;
      u.rate = 0.95;
      u.pitch = 1.02;
      falaAtual = new Promise((resolver) => {
        let pronto = false;
        const fim = () => { if (!pronto) { pronto = true; clearInterval(vigia); resolver(); } };
        u.onend = fim;
        u.onerror = fim;
        // vigia: se o motor de voz nem começou (ou travou), não prende o jogo
        const vigia = setInterval(() => {
          if (!speechSynthesis.speaking && !speechSynthesis.pending) fim();
        }, 300);
        setTimeout(fim, Math.min(18000, 2000 + texto.length * 110));
      });
      speechSynthesis.speak(u);
    } catch {
      falaAtual = Promise.resolve();
    }
    return falaAtual;
  },

  parar() {
    if (this.disponivel) { try { speechSynthesis.cancel(); } catch { /* ok */ } }
  },
};

/**
 * Avança só quando a NARRAÇÃO terminar (e depois de um tempo mínimo de
 * leitura visual). É o maestro do ritmo: nada de cortar a voz no meio.
 */
export function esperarFalaEntao(fn, minMs = 1200) {
  const minimo = new Promise(r => setTimeout(r, minMs));
  Promise.all([minimo, falaAtual]).then(() => setTimeout(fn, 250));
}

const FRACOES = { 2: ['meio', 'meios'], 3: ['terço', 'terços'], 4: ['quarto', 'quartos'], 5: ['quinto', 'quintos'] };

/** Converte o enunciado escrito ("23 + 35 = ?") em fala natural ("Quanto é 23 mais 35?"). */
export function falaDaConta(texto) {
  let t = texto.replace(/\s*=\s*\?\s*$/, '').trim();
  if (t.startsWith('Quantos cubinhos')) return 'Quantos cubinhos ao todo?';
  t = t.replace(/^O dobro/, 'o dobro').replace(/^A metade/, 'a metade');
  t = t.replace(/^\((\d+) \+ (\d+)\) × (\d+)$/, 'primeiro, $1 mais $2; depois, vezes $3');
  t = t.replace(/^(\d+)\/(\d+) de (\d+)$/, (m, n, d, b) => {
    const f = FRACOES[d] || ['sobre ' + d, 'sobre ' + d];
    return `${n} ${+n === 1 ? f[0] : f[1]} de ${b}`;
  });
  t = t.replace(/(\d+)% de (\d+)/, '$1 por cento de $2');
  t = t.replaceAll(' + ', ' mais ')
    .replaceAll(' − ', ' menos ')
    .replaceAll(' × ', ' vezes ')
    .replaceAll(' ÷ ', ' dividido por ');
  return `Quanto é ${t}?`;
}

/** Botão redondo 🔊 que lê um texto em voz alta. */
export function botaoOuvir(obterTexto) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn-ouvir';
  b.textContent = '🔊';
  b.setAttribute('aria-label', 'Ouvir a pergunta em voz alta');
  if (!voz.disponivel) b.hidden = true;
  b.addEventListener('click', () => voz.falar(typeof obterTexto === 'function' ? obterTexto() : obterTexto));
  return b;
}

const ELOGIOS = ['Muito bem!', 'Isso mesmo!', 'Acertou!', 'Mandou bem!', 'Você é demais!'];
export function elogiar() {
  voz.falar(ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)]);
}
