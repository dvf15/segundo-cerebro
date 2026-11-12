// BlockEngine — palco do sandbox: arrastar, encaixar, fundir e trocar 10 por barra.
import { svgPersonagem, infoPersonagem } from './characters.js';
import { audio } from './audio.js';
import { store } from './storage.js';

const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Anúncio para leitores de tela (região aria-live invisível). */
export function anunciar(texto) {
  const r = document.getElementById('leitor-avisos');
  if (r) { r.textContent = ''; r.textContent = texto; }
}

/** Balão de fala próximo a um elemento. */
export function falar(alvo, texto, dur = 2000) {
  if (!alvo.isConnected) return;
  const camada = document.getElementById('balao-camada');
  const r = alvo.getBoundingClientRect();
  const b = document.createElement('div');
  b.className = 'balao';
  b.textContent = texto;
  camada.appendChild(b);
  const bw = Math.min(240, b.offsetWidth);
  b.style.left = Math.max(6, Math.min(window.innerWidth - bw - 6, r.left + r.width / 2 - 20)) + 'px';
  b.style.top = Math.max(6, r.top - b.offsetHeight - 10) + 'px';
  setTimeout(() => b.remove(), dur);
}

/** Chuva de confete. */
export function confete(qtd = 40) {
  if (reduzMovimento()) return;
  const camada = document.getElementById('confete-camada');
  const cores = ['#e63946', '#f77f00', '#eba800', '#43a047', '#2196c9', '#8e44ad', '#e91e8c', '#ffd166'];
  for (let i = 0; i < qtd; i++) {
    const c = document.createElement('div');
    c.className = 'confete';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = cores[i % cores.length];
    c.style.animationDuration = (1 + Math.random() * 1.2) + 's';
    c.style.animationDelay = (Math.random() * 0.4) + 's';
    camada.appendChild(c);
    setTimeout(() => c.remove(), 2800);
  }
}

const MAX_PERSONAGENS = 12;
const MAX_VALOR = 1_000_000_000; // até 1 BILHÃO!
const MARCOS_GRANDES = [100, 1000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];

export class Sandbox {
  /**
   * @param {HTMLElement} palco área absoluta onde os personagens vivem
   * @param {{aoFundir?:Function}} opts callbacks
   */
  constructor(palco, opts = {}) {
    this.palco = palco;
    this.opts = opts;
    this.personagens = [];
    this.selecionado = null;
    this._ultimoToque = { el: null, t: 0 };
    this._timers = new Set();
  }

  _agendar(fn, ms) {
    const t = setTimeout(() => { this._timers.delete(t); fn(); }, ms);
    this._timers.add(t);
  }

  criar(valor, x, y) {
    if (this.personagens.length >= MAX_PERSONAGENS) {
      audio.erro();
      return null;
    }
    const el = document.createElement('div');
    el.className = 'personagem nascimento';
    el.tabIndex = 0;
    const { svg, largura, altura } = svgPersonagem(valor, { rotulo: true });
    el.innerHTML = svg;
    el.dataset.valor = valor;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${infoPersonagem(valor).nome}, número ${valor}. Enter seleciona; com outro selecionado, funde os dois. Delete separa 1.`);
    // área de toque mínima de 48px, sem mudar o visual
    const w = Math.max(largura, 48), h = Math.max(altura, 48);
    const palcoR = this.palco.getBoundingClientRect();
    const px = Math.max(4, Math.min(x - w / 2, palcoR.width - w - 4));
    const py = Math.max(4, Math.min(y - h / 2, palcoR.height - h - 4));
    el.style.left = px + 'px';
    el.style.top = py + 'px';
    this.palco.appendChild(el);
    const p = { valor, el, largura: w, altura: h };
    this.personagens.push(p);
    this._instalarEventos(p);
    setTimeout(() => el.classList.remove('nascimento'), 550);
    return p;
  }

  _instalarEventos(p) {
    const el = p.el;
    let arrastou = false, sx = 0, sy = 0, ox = 0, oy = 0;

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      arrastou = false;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(el.style.left); oy = parseFloat(el.style.top);
    });
    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture?.(e.pointerId)) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!arrastou && Math.hypot(dx, dy) < 7) return;
      arrastou = true;
      el.classList.add('arrastando');
      const palcoR = this.palco.getBoundingClientRect();
      el.style.left = Math.max(-10, Math.min(ox + dx, palcoR.width - p.largura + 10)) + 'px';
      el.style.top = Math.max(-10, Math.min(oy + dy, palcoR.height - p.altura + 10)) + 'px';
    });
    el.addEventListener('pointerup', (e) => {
      el.classList.remove('arrastando');
      if (arrastou) {
        const alvo = this._alvoSobreposto(p);
        if (alvo) this.fundir(alvo, p);
        else audio.encaixe();
      } else {
        this._toque(p);
      }
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._toque(p); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); this.separar(p); }
    });
  }

  _toque(p) {
    const agora = Date.now();
    const duplo = this._ultimoToque.el === p.el && agora - this._ultimoToque.t < 350;
    this._ultimoToque = { el: p.el, t: agora };

    if (duplo) { this.separar(p); return; }

    if (this.selecionado && this.selecionado !== p) {
      const outro = this.selecionado;
      this._selecionar(null);
      this.fundir(p, outro);
      return;
    }
    if (this.selecionado === p) {
      this._selecionar(null);
    } else {
      this._selecionar(p);
      audio.fala();
      falar(p.el, infoPersonagem(p.valor).bordao);
    }
  }

  _selecionar(p) {
    this.personagens.forEach(q => q.el.classList.toggle('selecionado', q === p));
    this.selecionado = p;
  }

  _alvoSobreposto(p) {
    const r = p.el.getBoundingClientRect();
    let melhor = null, melhorArea = 0;
    for (const q of this.personagens) {
      if (q === p) continue;
      const s = q.el.getBoundingClientRect();
      const w = Math.min(r.right, s.right) - Math.max(r.left, s.left);
      const h = Math.min(r.bottom, s.bottom) - Math.max(r.top, s.top);
      if (w > 8 && h > 8 && w * h > melhorArea) { melhor = q; melhorArea = w * h; }
    }
    return melhor;
  }

  /** Funde dois personagens: soma os valores e faz nascer o novo. */
  fundir(base, movel) {
    const total = base.valor + movel.valor;
    if (total > MAX_VALOR) {
      audio.erro();
      falar(base.el, 'Uau! 1 bilhão é o nosso teto do universo!');
      return;
    }
    const a = base.valor, b = movel.valor;
    // celebra a troca de 10 cubinhos por barra e a passagem de marcos gigantes
    const houveTroca = (a % 10) + (b % 10) >= 10 ||
      MARCOS_GRANDES.some(m => total >= m && a < m && b < m);
    const rb = base.el.getBoundingClientRect();
    const palcoR = this.palco.getBoundingClientRect();
    const cx = rb.left - palcoR.left + rb.width / 2;
    const cy = rb.top - palcoR.top + rb.height / 2;

    audio.fusao();
    if (this.selecionado === base || this.selecionado === movel) this._selecionar(null);
    const tinhaFoco = base.el === document.activeElement || movel.el === document.activeElement;
    [base, movel].forEach(p => {
      p.el.classList.add('sumindo');
      this._agendar(() => p.el.remove(), 280);
    });
    this.personagens = this.personagens.filter(p => p !== base && p !== movel);

    const atraso = reduzMovimento() ? 0 : 300;
    this._agendar(() => {
      const novo = this.criar(total, cx, cy);
      if (!novo) return;
      if (tinhaFoco) novo.el.focus({ preventScroll: true });
      falar(novo.el, infoPersonagem(total).bordao);
      anunciar(`${a} mais ${b} virou ${total}: ${infoPersonagem(total).nome}!${houveTroca ? ' Dez cubinhos viraram uma barra dourada.' : ''}`);
      audio.fala();
      if (houveTroca) {
        audio.fanfarra();
        confete(total % 10 === 0 ? 60 : 30);
      }
      if (a <= 9 && b <= 9) {
        const inedita = store.descobrirFusao(a, b);
        if (inedita) this._agendar(() => falar(novo.el, `✨ Fusão nova no álbum: ${a} + ${b}!`), 1200);
      }
      this.opts.aoFundir?.(a, b, total, novo);
    }, atraso);
  }

  /** Multiplica um personagem por 10 — o pulo mágico das potências. */
  multiplicarPorDez(p) {
    const novoValor = p.valor * 10;
    if (novoValor > MAX_VALOR) {
      audio.erro();
      falar(p.el, '1 bilhão é o topo! Não dá para crescer mais.');
      return;
    }
    const r = p.el.getBoundingClientRect();
    const palcoR = this.palco.getBoundingClientRect();
    const cx = r.left - palcoR.left + r.width / 2;
    const cy = r.top - palcoR.top + r.height / 2;
    const tinhaFoco = p.el === document.activeElement;
    if (this.selecionado === p) this._selecionar(null);
    p.el.remove();
    this.personagens = this.personagens.filter(q => q !== p);
    audio.fusao();
    const novo = this.criar(novoValor, cx, cy);
    if (!novo) return;
    if (tinhaFoco) novo.el.focus({ preventScroll: true });
    falar(novo.el, infoPersonagem(novoValor).bordao);
    anunciar(infoPersonagem(novoValor).bordao);
    if (MARCOS_GRANDES.includes(novoValor)) {
      audio.fanfarra();
      confete(novoValor >= 1_000_000 ? 80 : 45);
    }
    return novo;
  }

  /** Duplo toque: separa 1 cubinho (subtração ao contrário). */
  separar(p) {
    if (p.valor <= 1) {
      falar(p.el, 'Eu já sou só um!');
      return;
    }
    if (p.valor > 99) {
      falar(p.el, 'Sou gigante demais para soltar um cubinho só!');
      return;
    }
    const r = p.el.getBoundingClientRect();
    const palcoR = this.palco.getBoundingClientRect();
    const cx = r.left - palcoR.left + r.width / 2;
    const cy = r.top - palcoR.top + r.height / 2;
    const valorNovo = p.valor - 1;
    const tinhaFoco = p.el === document.activeElement;
    p.el.remove();
    this.personagens = this.personagens.filter(q => q !== p);
    audio.pop();
    const grande = this.criar(valorNovo, cx, cy);
    const um = this.criar(1, Math.min(cx + 90, palcoR.width - 40), Math.max(40, cy - 30));
    if (grande && tinhaFoco) grande.el.focus({ preventScroll: true });
    if (um) falar(um.el, 'Pulei pra fora!');
    anunciar(`${p.valor} se separou em ${valorNovo} e 1.`);
    return grande;
  }

  limpar() {
    this._timers.forEach(clearTimeout);
    this._timers.clear();
    this.personagens.forEach(p => p.el.remove());
    this.personagens = [];
    this.selecionado = null;
  }
}
