// Cidade do Dinheiro — educação financeira básica de forma lúdica:
// supermercado, shopping e cofrinho. Dinheiro em reais inteiros, sempre
// ligado às contas que a criança já domina.
import { audio } from '../audio.js';
import { store } from '../storage.js';
import { criarRobo } from '../robos.js';
import { confete } from '../engine.js';
import { voz, esperarFalaEntao } from '../voz.js';
import { popupAviso } from '../popup.js';
import { fimDeJogo } from './jogos.js';
import { missaoMercado } from '../dinheiro/mercado.js';
import { missaoShopping } from '../dinheiro/shopping.js';
import { missaoCofrinho } from '../dinheiro/cofrinho.js';

export const LOJAS = [
  { id: 'mercado', emoji: '🛒', nome: 'Supermercado do Tom', desc: 'Some o carrinho, confira o troco', cor: '#0d7d5c', montar: missaoMercado },
  { id: 'shopping', emoji: '🏬', nome: 'Shopping da Juju', desc: 'Moda e brinquedos: preços e descontos', cor: '#c2185b', montar: missaoShopping },
  { id: 'cofrinho', emoji: '🐷', nome: 'Cofrinho e Mesada', desc: 'Tarefas, poupança e metas', cor: '#b8791a', montar: missaoCofrinho },
];

export function telaDinheiro(el, { navegar, params }) {
  const loja = LOJAS.find(l => l.id === params.loja);
  if (loja) {
    document.getElementById('titulo-tela').textContent = loja.nome;
    return loja.montar(el, { navegar });
  }

  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';

  const recepcao = document.createElement('div');
  recepcao.style.cssText = 'display:flex;justify-content:center;gap:16px;align-items:center';
  recepcao.appendChild(criarRobo({ tamanho: 60, cor: '#ffd166' }));
  const oi = document.createElement('p');
  oi.className = 'dica-flutuante';
  oi.textContent = 'Dinheiro também é matemática! Vamos às compras?';
  recepcao.appendChild(oi);
  raiz.appendChild(recepcao);

  const grade = document.createElement('div');
  grade.className = 'grade-menu';
  for (const l of LOJAS) {
    const rec = store.dados.recordes['din-' + l.id];
    const b = document.createElement('button');
    b.className = 'card-modo';
    b.style.background = l.cor;
    b.innerHTML = `<span class="emoji">${l.emoji}</span><span>${l.nome}</span><small>${l.desc}</small>` +
      `<small>${rec ? `Recorde: ${rec}` : '— primeira visita —'}</small>`;
    b.addEventListener('click', () => { audio.clique(); navegar('dinheiro', { loja: l.id }); });
    grade.appendChild(b);
  }
  raiz.appendChild(grade);
  el.appendChild(raiz);
}

// ---------- utilidades ----------

export const reais = (n) => `R$ ${n}`;

/** Troca "R$ 12" por "12 reais" para a narração soar natural. */
export function falaDinheiro(texto) {
  return texto.replaceAll(/R\$\s?(\d+)/g, (m, n) => `${n} ${+n === 1 ? 'real' : 'reais'}`);
}

/** Cartão visual de um produto com etiqueta de preço. */
export function cartaoProduto(emoji, nome, preco) {
  return `<div class="produto-card"><span class="produto-emoji">${emoji}</span>` +
    `<span class="produto-nome">${nome}</span><span class="produto-preco">${reais(preco)}</span></div>`;
}

/**
 * Executor das missões da Cidade do Dinheiro.
 * Rodada: { pergunta, fala?, mostraHTML?, opcoes?: [{rotulo, certa}], descoberta,
 *           interativa?(painel, concluir) } — interativa cuida da própria UI e
 * chama concluir(acertouDePrimeira) quando terminar.
 */
export function rodarLoja(el, ctx, { id, rodadas, minimo, mensagem }) {
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  el.appendChild(raiz);

  let rodada = 0, acertos = 0, vivo = true;

  function proxima() {
    if (!vivo) return;
    rodada++;
    if (rodada > rodadas.length) {
      raiz.innerHTML = '';
      const venceu = acertos >= minimo;
      if (venceu) { audio.vitoria(); confete(50); }
      return fimDeJogo(raiz, {
        navegar: ctx.navegar,
        jogoId: 'din-' + id,
        venceu,
        pontos: acertos,
        mensagem: mensagem(acertos, rodadas.length),
        aoRepetir: () => ctx.navegar('dinheiro', { loja: id }),
        aoVoltar: () => ctx.navegar('dinheiro'),
        rotuloVoltar: 'Outras lojas',
      });
    }
    raiz.innerHTML = '';

    const r = rodadas[rodada - 1];
    let tentou = false;

    const placar = document.createElement('div');
    placar.className = 'placar-jogo';
    placar.innerHTML = `<span>Compra <b>${rodada}</b> / ${rodadas.length}</span><span>💰 Acertos: <b>${acertos}</b></span>`;
    raiz.appendChild(placar);

    const painel = document.createElement('div');
    painel.className = 'painel-conta';
    const topo = document.createElement('div');
    topo.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:12px';
    topo.appendChild(criarRobo({ tamanho: 42, cor: '#ffd166' }));
    const perg = document.createElement('p');
    perg.style.cssText = 'font-weight:800;font-size:1.05rem';
    perg.textContent = r.pergunta;
    topo.appendChild(perg);
    painel.appendChild(topo);
    voz.falar(falaDinheiro(r.fala || r.pergunta));

    if (r.mostraHTML) {
      const zona = document.createElement('div');
      zona.className = 'visual-blocos';
      zona.innerHTML = r.mostraHTML;
      painel.appendChild(zona);
    }

    const concluir = (ganhouPonto) => {
      if (ganhouPonto) acertos++;
      audio.fusao();
      confete(18);
      const desc = document.createElement('p');
      desc.className = 'passo-solucao';
      desc.innerHTML = `💡 <b>Descoberta:</b> ${r.descoberta}`;
      painel.appendChild(desc);
      voz.falar(falaDinheiro(r.descoberta));
      esperarFalaEntao(proxima, 1400);
    };

    if (r.interativa) {
      r.interativa(painel, concluir);
    } else {
      const linha = document.createElement('div');
      linha.className = 'visual-blocos';
      for (const op of r.opcoes) {
        const b = document.createElement('button');
        b.className = 'bloco-jogo';
        b.style.cssText = 'background:var(--tinta);min-width:96px;font-size:1rem;padding:.5rem .7rem';
        b.textContent = op.rotulo;
        b.addEventListener('click', () => {
          if (op.certa) {
            linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
            concluir(!tentou);
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
    }
    raiz.appendChild(painel);
  }

  proxima();
  return () => { vivo = false; };
}
