// Contas com Blocos — 4 níveis com progressão adaptativa e resolução animada.
import { gerarConta, NIVEIS } from '../gerador.js';
import { svgQuantidade, svgRetangulo, svgFileira, svgBarra100, corTexto } from '../characters.js';
import { criarTeclado } from '../teclado.js';
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { confete, anunciar } from '../engine.js';
import { criarRobo } from '../robos.js';
import { voz, falaDaConta, botaoOuvir, elogiar, esperarFalaEntao } from '../voz.js';

// substitui o '?' final (a lacuna) do enunciado
const preencher = (texto, valor) => texto.replace(/\?$/, String(valor));

const QUESTOES_POR_SESSAO = 10;

function renderVisual(visual) {
  const div = document.createElement('div');
  div.className = 'visual-blocos';
  if (!visual || visual.tipo === 'nenhum') return div;
  if (visual.tipo === 'quantidade') {
    div.innerHTML = `<div class="grupo-quantidade">${svgQuantidade(visual.n)}</div>`;
  } else if (visual.tipo === 'par') {
    div.innerHTML =
      `<div class="grupo-quantidade">${svgQuantidade(visual.a)}<span>${visual.a}</span></div>` +
      `<span class="op-simbolo">${visual.op}</span>` +
      `<div class="grupo-quantidade">${svgQuantidade(visual.b)}<span>${visual.b}</span></div>`;
  } else if (visual.tipo === 'retangulo') {
    div.innerHTML = svgRetangulo(visual.linhas, visual.colunas, { cubo: Math.min(20, 280 / visual.colunas) });
  } else if (visual.tipo === 'fileira') {
    div.innerHTML = svgFileira(visual.n, visual.pintados, { cubo: Math.min(22, 300 / visual.n) });
  } else if (visual.tipo === 'barra100') {
    div.innerHTML = svgBarra100(visual.pct);
  }
  return div;
}

export function telaContas(el, { navegar, params }) {
  if (!params.nivel) return menuNiveis(el, navegar);
  return sessao(el, navegar, params.nivel);
}

function menuNiveis(el, navegar) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  const recepcao = document.createElement('div');
  recepcao.style.cssText = 'display:flex;justify-content:center;gap:14px;align-items:center';
  recepcao.appendChild(criarRobo({ tamanho: 50 }));
  const intro = document.createElement('p');
  intro.className = 'dica-flutuante';
  intro.textContent = 'Escolha seu nível. Acerte 3 seguidas e o desafio cresce!';
  recepcao.appendChild(intro);
  raiz.appendChild(recepcao);

  const grade = document.createElement('div');
  grade.className = 'grade-menu';
  for (const n of NIVEIS) {
    const medalha = store.dados.medalhas[n.id] || 0;
    const b = document.createElement('button');
    b.className = 'card-modo';
    b.style.background = n.cor;
    b.style.color = corTexto(n.cor);
    b.innerHTML = `<span class="emoji">${n.emoji}</span><span>${n.nome}</span>` +
      `<small>${n.faixa} · ${n.desc}</small>` +
      `<small>${medalha > 0 ? '⭐'.repeat(medalha) : '— sem medalha ainda —'}</small>`;
    b.addEventListener('click', () => { audio.clique(); navegar('contas', { nivel: n.id }); });
    grade.appendChild(b);
  }
  raiz.appendChild(grade);
  el.appendChild(raiz);
}

function sessao(el, navegar, nivelId) {
  const nivel = NIVEIS.find(n => n.id === nivelId);
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let sub = store.dados.subniveis[nivelId] || 1;
  let questao = 0;
  let acertosPrimeira = 0;
  let sequencia = 0;   // acertos seguidos
  let errosSeguidos = 0;
  let teclado = null;
  let timerProxima = 0;
  let encerrada = false;

  function proxima() {
    if (encerrada) return;
    questao++;
    if (questao > QUESTOES_POR_SESSAO) return fim();
    raiz.innerHTML = '';

    const conta = gerarConta(nivelId, sub);
    let tentativas = 0;

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    painel.dataset.resposta = conta.resposta; // gancho para testes automatizados

    const cab = document.createElement('div');
    cab.style.cssText = 'display:flex;justify-content:space-between;font-weight:800;opacity:.75;font-size:.95rem';
    cab.innerHTML = `<span>${nivel.emoji} ${nivel.nome} · fase ${sub}</span><span>${questao} / ${QUESTOES_POR_SESSAO}</span>`;
    painel.appendChild(cab);

    const linhaEnun = document.createElement('div');
    linhaEnun.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:.6rem';
    const enun = document.createElement('div');
    enun.className = 'enunciado';
    enun.innerHTML = conta.texto.replace(/\?$/, '<span class="lacuna">?</span>');
    linhaEnun.appendChild(enun);
    linhaEnun.appendChild(botaoOuvir(() => falaDaConta(conta.texto)));
    painel.appendChild(linhaEnun);
    painel.appendChild(renderVisual(conta.visual));
    voz.falar(falaDaConta(conta.texto)); // lê a pergunta em voz alta ao aparecer

    teclado?.destruir();
    teclado = criarTeclado((valor) => {
      if (valor === conta.resposta) {
        audio.fusao();
        if (tentativas === 0) { acertosPrimeira++; sequencia++; errosSeguidos = 0; }
        if (sequencia >= 3 && sub < 5) {
          sub++; sequencia = 0;
          store.setSubnivel(nivelId, sub);
          confete(25);
          audio.fanfarra();
          toast(painel, `🚀 Subiu para a fase ${sub}!`);
        }
        enun.innerHTML = conta.texto.replace(/\?$/, `<span style="color:var(--c4)">${conta.resposta}</span>`);
        anunciar(`Certo! ${preencher(conta.texto, conta.resposta)}`);
        if (tentativas === 0) elogiar();
        teclado.travar();
        esperarFalaEntao(proxima, tentativas === 0 ? 900 : 700);
      } else {
        tentativas++;
        sequencia = 0;
        audio.erro();
        painel.classList.remove('tremida');
        void painel.offsetWidth;
        painel.classList.add('tremida');
        teclado.limpar();
        if (tentativas >= 2) {
          errosSeguidos++;
          if (errosSeguidos >= 2 && sub > 1) {
            sub--; errosSeguidos = 0;
            store.setSubnivel(nivelId, sub);
            toast(painel, `Vamos treinar na fase ${sub}, sem pressa!`);
          }
          mostrarSolucao(conta);
        } else {
          toast(painel, 'Quase! Olhe os bloquinhos e tente de novo.');
        }
      }
    });

    painel.appendChild(teclado.el);
    raiz.appendChild(painel);

    const barra = document.createElement('div');
    barra.className = 'barra-progresso';
    barra.innerHTML = `<div style="width:${((questao - 1) / QUESTOES_POR_SESSAO) * 100}%"></div>`;
    raiz.appendChild(barra);

    function mostrarSolucao(c) {
      teclado.travar();
      let i = 0;
      const caixa = document.createElement('div');
      caixa.className = 'passo-solucao';
      raiz.appendChild(caixa);

      const mostrarPasso = () => {
        const p = c.passos[i];
        caixa.innerHTML = `<p>💡 <b>Passo ${i + 1}:</b> ${p.texto}</p>`;
        voz.falar(p.texto);
        if (p.visual) caixa.appendChild(renderVisual(p.visual));
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.marginTop = '.6rem';
        btn.textContent = i < c.passos.length - 1 ? 'Próximo passo ▶' : 'Entendi! Próxima conta';
        btn.addEventListener('click', () => {
          audio.clique();
          i++;
          if (i < c.passos.length) mostrarPasso();
          else proxima();
        });
        caixa.appendChild(btn);
        caixa.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      enun.innerHTML = c.texto.replace(/\?$/, `<span style="color:var(--c5)">${c.resposta}</span>`);
      mostrarPasso();
    }
  }

  function fim() {
    raiz.innerHTML = '';
    const estrelas = acertosPrimeira >= 9 ? 3 : acertosPrimeira >= 7 ? 2 : acertosPrimeira >= 5 ? 1 : 0;
    store.setMedalha(nivelId, estrelas);
    if (estrelas > 0) { store.addEstrelas(estrelas); audio.vitoria(); confete(30 * estrelas); }
    else audio.fala();

    const fimEl = document.createElement('div');
    fimEl.className = 'tela-fim';
    fimEl.innerHTML = `<h2>${estrelas > 0 ? 'Mandou bem!' : 'Bom treino!'}</h2>` +
      `<p>Você acertou <b>${acertosPrimeira}</b> de ${QUESTOES_POR_SESSAO} de primeira.</p>` +
      `<div class="estrelas-ganhas">${'⭐'.repeat(estrelas) || '💪'}</div>` +
      (estrelas === 0 ? '<p>Acerte 5 de primeira para ganhar a primeira estrela.</p>' : '');
    fimEl.prepend(criarRobo({ tamanho: 58, cor: estrelas > 0 ? '#ffd166' : '#5ac8ff' }));
    const acoes = document.createElement('div');
    acoes.style.cssText = 'display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:.8rem';
    const denovo = document.createElement('button');
    denovo.className = 'btn grande';
    denovo.style.background = nivel.cor;
    denovo.textContent = '🔁 Jogar de novo';
    denovo.addEventListener('click', () => navegar('contas', { nivel: nivelId }));
    const voltar = document.createElement('button');
    voltar.className = 'btn secundario';
    voltar.textContent = 'Outros níveis';
    voltar.addEventListener('click', () => navegar('contas'));
    acoes.appendChild(denovo); acoes.appendChild(voltar);
    fimEl.appendChild(acoes);
    raiz.appendChild(fimEl);
  }

  proxima();
  return () => {
    encerrada = true;
    clearTimeout(timerProxima);
    teclado?.destruir();
  };
}

function toast(pai, texto) {
  const t = document.createElement('div');
  t.className = 'passo-solucao';
  t.style.textAlign = 'center';
  t.textContent = texto;
  anunciar(texto);
  pai.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
