// Sons gerados por Web Audio API — nenhum arquivo externo.
let ctx = null;
let mudo = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tom(freq, dur, { tipo = 'sine', quando = 0, vol = 0.18, desliza = 0 } = {}) {
  const a = ac();
  if (!a || mudo) return;
  const t0 = a.currentTime + quando;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, t0);
  if (desliza) osc.frequency.exponentialRampToValueAtTime(desliza, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const audio = {
  get mudo() { return mudo; },
  setMudo(v) { mudo = v; },
  clique()  { tom(660, 0.08, { tipo: 'triangle', vol: 0.12 }); },
  pop()     { tom(520, 0.1, { tipo: 'triangle', desliza: 880, vol: 0.16 }); },
  encaixe() { tom(330, 0.09, { tipo: 'square', vol: 0.08 }); tom(494, 0.1, { quando: 0.05, tipo: 'triangle' }); },
  fusao()   { [523, 659, 784].forEach((f, i) => tom(f, 0.16, { quando: i * 0.07, tipo: 'triangle' })); },
  fanfarra(){ [392, 523, 659, 784, 1047].forEach((f, i) => tom(f, i === 4 ? 0.5 : 0.14, { quando: i * 0.11, tipo: 'triangle', vol: 0.2 })); },
  erro()    { tom(220, 0.25, { tipo: 'sine', desliza: 165, vol: 0.12 }); },
  vitoria() { [523, 587, 659, 784, 880, 1047].forEach((f, i) => tom(f, 0.13, { quando: i * 0.09, tipo: 'triangle', vol: 0.18 })); },
  fala()    { tom(740, 0.06, { tipo: 'triangle', vol: 0.1 }); tom(880, 0.07, { quando: 0.06, tipo: 'triangle', vol: 0.1 }); },
  whoosh()  { tom(180, 0.35, { tipo: 'sine', desliza: 760, vol: 0.1 }); tom(240, 0.3, { quando: 0.05, tipo: 'triangle', desliza: 990, vol: 0.06 }); },
};
