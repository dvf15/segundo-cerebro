// Shopping das Lojas — moda e brinquedos: comparar lojas, entender desconto,
// saber quanto falta, separar necessidade de desejo e fechar um orçamento.
import { rodarLoja, cartaoProduto, reais } from '../screens/dinheiro.js';
import { embaralhar, opcoesNumericas } from '../screens/robos.js';

const MODA = [['👕', 'Camiseta', 30], ['👟', 'Tênis', 60], ['🧢', 'Boné', 20], ['🎒', 'Mochila', 45], ['🧥', 'Casaco', 50]];
const BRINQUEDOS = [['🧸', 'Ursinho', 25], ['🚗', 'Carrinho', 15], ['🎮', 'Videogame', 90], ['⚽', 'Bola', 35], ['🪁', 'Pipa', 10], ['🤖', 'Robô de brinquedo', 40]];

const opcoesReais = (certa, distratores) =>
  opcoesNumericas(certa, distratores).map(n => ({ rotulo: reais(n), certa: n === certa }));

function planejarRodadas() {
  const rodadas = [];

  // 1: qual loja é mais barata
  {
    const [e, nome, preco] = embaralhar([...MODA])[0];
    rodadas.push({
      pergunta: `O mesmo ${nome.toLowerCase()} em duas lojas do shopping. Qual é a compra esperta?`,
      mostraHTML:
        `<div class="produto-card"><span class="produto-emoji">${e}</span><span class="produto-nome">Loja Estilosa</span><span class="produto-preco">${reais(preco + 10)}</span></div>` +
        `<div class="produto-card"><span class="produto-emoji">${e}</span><span class="produto-nome">Loja Amiga</span><span class="produto-preco">${reais(preco)}</span></div>`,
      opcoes: embaralhar([
        { rotulo: 'Loja Estilosa', certa: false },
        { rotulo: 'Loja Amiga', certa: true },
      ]),
      descoberta: `É o MESMO produto por ${reais(10)} a menos. Pesquisar antes de comprar é economia sem abrir mão de nada!`,
    });
  }

  // 2: quanto economiza comprando na mais barata
  {
    const [e, nome, preco] = embaralhar([...BRINQUEDOS])[0];
    const dif = 5 + Math.floor(Math.random() * 3) * 5;
    rodadas.push({
      pergunta: `O ${nome.toLowerCase()} custa ${reais(preco + dif)} numa loja e ${reais(preco)} na outra. Quanto você ECONOMIZA na mais barata?`,
      mostraHTML: cartaoProduto(e, nome, preco),
      opcoes: embaralhar(opcoesReais(dif, [dif + 5, dif - 5, dif + 10])),
      descoberta: `${reais(preco + dif)} − ${reais(preco)} = ${reais(dif)} no seu bolso. Economizar também é ganhar!`,
    });
  }

  // 3-4: descontos
  {
    const [e, nome, preco] = embaralhar([...MODA])[0];
    const desconto = 10;
    rodadas.push({
      pergunta: `O ${nome.toLowerCase()} de ${reais(preco)} está com ${reais(desconto)} de DESCONTO. Quanto você paga?`,
      mostraHTML: cartaoProduto(e, nome, preco) + `<div class="produto-card"><span class="produto-emoji">🏷️</span><span class="produto-nome">Desconto</span><span class="produto-preco">−${reais(desconto)}</span></div>`,
      opcoes: embaralhar(opcoesReais(preco - desconto, [preco, preco - desconto - 5, preco - desconto + 5])),
      descoberta: `${reais(preco)} − ${reais(desconto)} = ${reais(preco - desconto)}. Desconto é subtração com sorriso!`,
    });
  }
  {
    const [e, nome, preco] = embaralhar(BRINQUEDOS.filter(b => b[2] % 2 === 0))[0];
    rodadas.push({
      pergunta: `Liquidação: o ${nome.toLowerCase()} está pela METADE do preço! De ${reais(preco)} por…`,
      mostraHTML: cartaoProduto(e, nome, preco) + `<div class="produto-card"><span class="produto-emoji">🔖</span><span class="produto-nome">50% OFF</span><span class="produto-preco">÷ 2</span></div>`,
      opcoes: embaralhar(opcoesReais(preco / 2, [preco / 2 + 5, preco / 2 - 5, preco])),
      descoberta: `Metade = dividir por 2: ${reais(preco)} ÷ 2 = ${reais(preco / 2)}. 50% de desconto é meio preço!`,
    });
  }

  // 5: quanto falta
  {
    const [e, nome, preco] = embaralhar(BRINQUEDOS.filter(b => b[2] >= 25))[0];
    const tem = preco - (5 + Math.floor(Math.random() * 3) * 5);
    rodadas.push({
      pergunta: `Você juntou ${reais(tem)} e o ${nome.toLowerCase()} custa ${reais(preco)}. Quanto FALTA?`,
      mostraHTML: cartaoProduto(e, nome, preco) + `<div class="produto-card"><span class="produto-emoji">👛</span><span class="produto-nome">Você tem</span><span class="produto-preco">${reais(tem)}</span></div>`,
      opcoes: embaralhar(opcoesReais(preco - tem, [preco - tem + 5, preco - tem - 5, preco - tem + 10])),
      descoberta: `${reais(preco)} − ${reais(tem)} = faltam ${reais(preco - tem)}. Saber quanto falta transforma desejo em meta!`,
    });
  }

  // 6: necessidade × desejo
  rodadas.push({
    pergunta: 'Chegou o inverno! O dinheiro dá para UMA coisa. Qual é a NECESSIDADE?',
    mostraHTML: cartaoProduto('🧥', 'Casaco de frio', 50) + cartaoProduto('🎮', 'Mais um jogo', 50),
    opcoes: embaralhar([
      { rotulo: 'Casaco de frio', certa: true },
      { rotulo: 'Mais um jogo', certa: false },
    ]),
    descoberta: 'Necessidade vem primeiro (frio de verdade!), desejo pode esperar e virar meta. Quem sabe a diferença decide melhor.',
  });

  // 7: fechar o orçamento
  {
    const carteira = 100;
    const [a, b] = [MODA[1], MODA[0]]; // tênis 60 + camiseta 30
    const total = a[2] + b[2];
    rodadas.push({
      pergunta: `Dia de compras com ${reais(carteira)}! Levando ${a[1].toLowerCase()} e ${b[1].toLowerCase()}, quanto SOBRA?`,
      mostraHTML: cartaoProduto(...a) + cartaoProduto(...b),
      opcoes: embaralhar(opcoesReais(carteira - total, [carteira - total + 10, carteira - total - 5, total])),
      descoberta: `${a[2]} + ${b[2]} = ${reais(total)}; ${reais(carteira)} − ${reais(total)} = sobram ${reais(carteira - total)}. Isso é fechar um orçamento!`,
    });
  }

  // 8: a vitrine tentadora
  rodadas.push({
    pergunta: 'A vitrine está linda e você NÃO planejava comprar nada. Qual é a jogada de mestre?',
    mostraHTML: cartaoProduto('🪀', 'Novidade da vitrine', 20),
    opcoes: embaralhar([
      { rotulo: 'Comprar agora', certa: false },
      { rotulo: 'Anotar e pensar até amanhã', certa: true },
    ]),
    descoberta: 'Esperar um dia é o truque anti-impulso: se amanhã ainda fizer sentido (e couber no bolso), aí sim! Muitos desejos passam sozinhos.',
  });

  return rodadas;
}

export function missaoShopping(el, ctx) {
  return rodarLoja(el, ctx, {
    id: 'shopping',
    rodadas: planejarRodadas(),
    minimo: 6,
    mensagem: (a, t) => `Você acertou ${a} de ${t} decisões — comprador esperto reconhecido no shopping inteiro!`,
  });
}
