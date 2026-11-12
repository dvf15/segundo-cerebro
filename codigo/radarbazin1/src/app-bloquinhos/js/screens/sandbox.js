// Mundo dos Bloquinhos — brincar livre com fusões.
import { Sandbox, falar, confete } from '../engine.js';
import { PERSONAGENS, corTexto } from '../characters.js';
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { criarRobo } from '../robos.js';

export function telaSandbox(el, ctx) {
  const palco = document.createElement('div');
  palco.id = 'palco';
  el.appendChild(palco);

  const roboGuia = criarRobo({ tamanho: 46 });
  roboGuia.classList.add('robo-palco');
  palco.appendChild(roboGuia);

  const dica = document.createElement('p');
  dica.className = 'dica-flutuante';
  dica.style.cssText = 'position:absolute;top:4px;left:0;right:0;pointer-events:none;z-index:5';
  dica.textContent = 'Toque num número para criar e arraste um sobre o outro para somar! Selecione um bloco e toque em ✨×10 para crescer até 1 BILHÃO.';
  palco.appendChild(dica);

  let desafio = false;
  let desafioBtn;

  const sandbox = new Sandbox(palco, {
    aoFundir(a, b, total) {
      if (desafio && total === 10) {
        desafio = false;
        desafioBtn.textContent = '🎉 Conseguiu!';
        store.addEstrelas(1);
        confete(70);
        setTimeout(() => { desafioBtn.textContent = '⭐ Desafio: forme 10!'; }, 2500);
      }
    },
  });

  const paleta = document.createElement('div');
  paleta.className = 'paleta';
  for (let v = 1; v <= 9; v++) {
    const b = document.createElement('button');
    b.style.background = PERSONAGENS[v].hex;
    b.style.color = corTexto(PERSONAGENS[v].hex);
    b.textContent = v;
    b.setAttribute('aria-label', `Criar o número ${v}, ${PERSONAGENS[v].nome}`);
    b.addEventListener('click', () => {
      audio.pop();
      const r = palco.getBoundingClientRect();
      const p = sandbox.criar(v, 60 + Math.random() * (r.width - 140), 80 + Math.random() * Math.max(60, r.height - 260));
      if (p && sandbox.personagens.length === 1) falar(p.el, PERSONAGENS[v].bordao);
    });
    paleta.appendChild(b);
  }

  const vezesDez = document.createElement('button');
  vezesDez.className = 'btn';
  vezesDez.style.cssText = 'flex:0 0 auto;font-size:1rem;background:var(--c7)';
  vezesDez.textContent = '✨×10';
  vezesDez.setAttribute('aria-label', 'Multiplicar o bloco selecionado por dez');
  vezesDez.addEventListener('click', () => {
    audio.clique();
    if (!sandbox.selecionado) {
      falar(vezesDez, 'Primeiro toque num bloquinho para escolher — depois toque aqui!');
      return;
    }
    sandbox.multiplicarPorDez(sandbox.selecionado);
  });
  paleta.appendChild(vezesDez);

  desafioBtn = document.createElement('button');
  desafioBtn.className = 'btn';
  desafioBtn.style.cssText = 'flex:0 0 auto;font-size:.95rem;background:var(--ouro-escuro)';
  desafioBtn.textContent = '⭐ Desafio: forme 10!';
  desafioBtn.addEventListener('click', () => {
    audio.clique();
    desafio = true;
    falar(desafioBtn, 'Junte bloquinhos até formar uma dezena dourada!');
  });
  paleta.appendChild(desafioBtn);

  const limparBtn = document.createElement('button');
  limparBtn.className = 'btn secundario';
  limparBtn.style.cssText = 'flex:0 0 auto;font-size:.95rem';
  limparBtn.textContent = '🧹';
  limparBtn.setAttribute('aria-label', 'Limpar o palco');
  limparBtn.addEventListener('click', () => { audio.clique(); sandbox.limpar(); });
  paleta.appendChild(limparBtn);

  el.appendChild(paleta);

  // dois personagens de boas-vindas
  setTimeout(() => {
    const r = palco.getBoundingClientRect();
    if (r.width > 0 && sandbox.personagens.length === 0) {
      sandbox.criar(3, r.width * 0.32, r.height * 0.4);
      sandbox.criar(4, r.width * 0.65, r.height * 0.45);
    }
  }, 150);

  return () => sandbox.limpar();
}
