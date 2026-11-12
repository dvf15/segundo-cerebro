// Supermercado do Tom — somar o carrinho, calcular o troco, saber se o
// dinheiro dá e comparar preços. Matemática de verdade do dia a dia.
import { rodarLoja, cartaoProduto, reais } from '../screens/dinheiro.js';
import { embaralhar, opcoesNumericas } from '../screens/robos.js';

const SALADINHA = ['🥗', 'Saladinha da Juju', 6];
const PRODUTOS = [
  ['🥛', 'Leite', 6], ['🍞', 'Pão', 4], ['🍎', 'Maçã', 3], ['🧃', 'Suco', 5],
  ['🧀', 'Queijo', 9], ['🍌', 'Banana', 2], ['🥚', 'Ovos', 8], ['🍫', 'Chocolate', 7],
  ['🍝', 'Macarrão', 5], ['🍦', 'Sorvete', 10],
];

function sorteia(qtd) {
  return embaralhar([...PRODUTOS]).slice(0, qtd);
}

function opcoesReais(certa, distratores) {
  return opcoesNumericas(certa, distratores).map(n => ({ rotulo: reais(n), certa: n === certa }));
}

function planejarRodadas() {
  const rodadas = [];

  // 1: a Saladinha da Juju abre as compras!
  {
    const [b] = sorteia(1);
    const total = SALADINHA[2] + b[2];
    rodadas.push({
      pergunta: 'A famosa Saladinha da Juju entrou no carrinho! Quanto custam os dois juntos?',
      mostraHTML: cartaoProduto(...SALADINHA) + '<span class="op-simbolo">+</span>' + cartaoProduto(...b),
      opcoes: embaralhar(opcoesReais(total, [total + 1, total - 1, total + 2])),
      descoberta: `Saladinha da Juju (${reais(SALADINHA[2])}) + ${b[1]} (${reais(b[2])}) = ${reais(total)}. Comida saudável e conta certinha — a Juju aprova!`,
    });
  }
  // 2: somar 2 itens do carrinho
  {
    const [a, b] = sorteia(2);
    const total = a[2] + b[2];
    rodadas.push({
      pergunta: 'Quanto custam os dois juntos?',
      mostraHTML: cartaoProduto(...a) + '<span class="op-simbolo">+</span>' + cartaoProduto(...b),
      opcoes: embaralhar(opcoesReais(total, [total + 1, total - 1, total + 2])),
      descoberta: `${a[1]} (${reais(a[2])}) + ${b[1]} (${reais(b[2])}) = ${reais(total)}. Somar o carrinho evita surpresa no caixa!`,
    });
  }

  // 3-4: somar 3 itens
  for (let i = 0; i < 2; i++) {
    const [a, b, c] = sorteia(3);
    const total = a[2] + b[2] + c[2];
    rodadas.push({
      pergunta: 'E agora, com três itens no carrinho?',
      mostraHTML: cartaoProduto(...a) + cartaoProduto(...b) + cartaoProduto(...c),
      opcoes: embaralhar(opcoesReais(total, [total + 2, total - 2, total + 3])),
      descoberta: `${a[2]} + ${b[2]} + ${c[2]} = ${reais(total)}. Dica de feirante: some de dois em dois!`,
    });
  }

  // 5-6: troco
  for (const nota of embaralhar([20, 50]).slice(0, 2)) {
    const compra = 5 + Math.floor(Math.random() * (nota - 8));
    const troco = nota - compra;
    rodadas.push({
      pergunta: `A compra deu ${reais(compra)} e você pagou com uma nota de ${reais(nota)}. Quanto vem de troco?`,
      mostraHTML: `<div class="produto-card"><span class="produto-emoji">💵</span><span class="produto-nome">Nota</span><span class="produto-preco">${reais(nota)}</span></div>` +
        `<span class="op-simbolo">−</span>` +
        `<div class="produto-card"><span class="produto-emoji">🧾</span><span class="produto-nome">Compra</span><span class="produto-preco">${reais(compra)}</span></div>`,
      opcoes: embaralhar(opcoesReais(troco, [troco + 1, troco - 1, troco + 2])),
      descoberta: `${reais(nota)} − ${reais(compra)} = ${reais(troco)} de troco. Sempre confira o troco — é subtração!`,
    });
  }

  // 7: o dinheiro dá?
  {
    const [a, b] = sorteia(2);
    const total = a[2] + b[2];
    const carteira = Math.random() < 0.5 ? total + 2 : total - 1;
    const da = carteira >= total;
    rodadas.push({
      pergunta: `Você tem ${reais(carteira)}. Dá para levar os dois?`,
      mostraHTML: cartaoProduto(...a) + cartaoProduto(...b),
      opcoes: embaralhar([
        { rotulo: 'Sim, dá!', certa: da },
        { rotulo: 'Não dá', certa: !da },
      ]),
      descoberta: `Os dois custam ${reais(total)} e você tem ${reais(carteira)}: ${da ? `dá, e ainda ${total === carteira ? 'sai zerado' : `sobram ${reais(carteira - total)}`}!` : `faltam ${reais(total - carteira)}. Antes de pegar, confira a carteira!`}`,
    });
  }

  // 8: onde é mais barato?
  {
    const [p] = sorteia(1);
    const caro = p[2] + 2;
    rodadas.push({
      pergunta: `O mesmo ${p[1].toLowerCase()} em duas lojas. Onde você compra?`,
      mostraHTML:
        `<div class="produto-card"><span class="produto-emoji">${p[0]}</span><span class="produto-nome">Mercado A</span><span class="produto-preco">${reais(caro)}</span></div>` +
        `<div class="produto-card"><span class="produto-emoji">${p[0]}</span><span class="produto-nome">Mercado B</span><span class="produto-preco">${reais(p[2])}</span></div>`,
      opcoes: embaralhar([
        { rotulo: 'Mercado A', certa: false },
        { rotulo: 'Mercado B', certa: true },
      ]),
      descoberta: `Mesmo produto, ${reais(2)} de diferença! Comparar preços é o superpoder de quem cuida bem do dinheiro.`,
    });
  }

  return rodadas;
}

export function missaoMercado(el, ctx) {
  return rodarLoja(el, ctx, {
    id: 'mercado',
    rodadas: planejarRodadas(),
    minimo: 6,
    mensagem: (a, t) => `Você acertou ${a} de ${t} compras — o caixa do supermercado te respeita!`,
  });
}
