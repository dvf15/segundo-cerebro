// Cofrinho e Mesada — tarefas do dia a dia que rendem, metas de poupança e o
// desafio de encher o cofrinho com o valor EXATO usando as moedas certas.
import { audio } from '../audio.js';
import { voz } from '../voz.js';
import { rodarLoja, cartaoProduto, reais, falaDinheiro } from '../screens/dinheiro.js';
import { embaralhar, opcoesNumericas } from '../screens/robos.js';

const opcoesReais = (certa, distratores) =>
  opcoesNumericas(certa, distratores).map(n => ({ rotulo: reais(n), certa: n === certa }));

/** Rodada interativa: encher o cofrinho com o valor exato usando moedas. */
function rodadaCofrinho(alvo) {
  return {
    pergunta: `Coloque EXATAMENTE ${reais(alvo)} no cofrinho!`,
    fala: `Coloque exatamente ${alvo} reais no cofrinho, tocando nas moedas. Se passar, ele devolve tudo!`,
    descoberta: `${reais(alvo)} certinhos! Juntar as moedas certas é o primeiro passo de todo poupador.`,
    interativa(painel, concluir) {
      painel.dataset.alvo = alvo; // gancho para testes
      let total = 0, errou = false, resolvido = false;

      const cofre = document.createElement('div');
      cofre.className = 'cofre-zona';
      cofre.innerHTML = `<span class="cofre-porco">🐷</span><span class="cofre-total" aria-live="polite">${reais(0)}</span>` +
        `<span class="cofre-meta">meta: ${reais(alvo)}</span>`;
      painel.appendChild(cofre);
      const elTotal = cofre.querySelector('.cofre-total');

      const linha = document.createElement('div');
      linha.style.cssText = 'display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap;margin-top:.6rem';
      for (const valor of [1, 2, 5, 10]) {
        const b = document.createElement('button');
        b.className = 'moeda-btn';
        b.textContent = `${valor}`;
        b.setAttribute('aria-label', `Moeda de ${valor} ${valor === 1 ? 'real' : 'reais'}`);
        b.addEventListener('click', () => {
          if (resolvido) return;
          total += valor;
          audio.encaixe();
          if (total === alvo) {
            resolvido = true;
            elTotal.textContent = reais(total);
            cofre.classList.add('cofre-cheio');
            linha.querySelectorAll('button').forEach(x => { x.disabled = true; });
            concluir(!errou);
          } else if (total > alvo) {
            errou = true;
            total = 0;
            audio.erro();
            elTotal.textContent = reais(0);
            cofre.classList.remove('tremida');
            void cofre.offsetWidth;
            cofre.classList.add('tremida');
            voz.falar('Ops, passou da meta! O cofrinho devolveu tudo. Tente outra combinação.');
          } else {
            elTotal.textContent = reais(total);
          }
        });
        linha.appendChild(b);
      }
      painel.appendChild(linha);
    },
  };
}

function planejarRodadas() {
  const rodadas = [];

  rodadas.push(rodadaCofrinho(7 + Math.floor(Math.random() * 6))); // 7..12

  // tarefas do dia a dia que rendem mesada
  {
    const tarefas = embaralhar([
      ['🧹', 'Arrumar o quarto', 2], ['🍽️', 'Ajudar com a louça', 3],
      ['🐕', 'Passear com o cachorro', 4], ['🚗', 'Ajudar a lavar o carro', 6],
      ['🪴', 'Regar as plantas', 2],
    ]).slice(0, 2);
    const total = tarefas[0][2] + tarefas[1][2];
    rodadas.push({
      pergunta: 'Semana de ajudante! Fazendo as duas tarefas, quanto você ganha?',
      mostraHTML: cartaoProduto(...tarefas[0]) + '<span class="op-simbolo">+</span>' + cartaoProduto(...tarefas[1]),
      opcoes: embaralhar(opcoesReais(total, [total + 1, total - 1, total + 2])),
      descoberta: `${tarefas[0][2]} + ${tarefas[1][2]} = ${reais(total)}. Trabalho feito, mesada merecida — dinheiro vem do esforço!`,
    });
  }

  // quantas semanas até a meta
  {
    const porSemana = [2, 5, 5, 10][Math.floor(Math.random() * 4)];
    const semanas = 3 + Math.floor(Math.random() * 3); // 3..5
    const meta = porSemana * semanas;
    rodadas.push({
      pergunta: `Guardando ${reais(porSemana)} por semana, em quantas SEMANAS você junta ${reais(meta)}?`,
      mostraHTML: cartaoProduto('🐷', 'Por semana', porSemana) + `<div class="produto-card"><span class="produto-emoji">🎯</span><span class="produto-nome">Meta</span><span class="produto-preco">${reais(meta)}</span></div>`,
      opcoes: embaralhar(opcoesNumericas(semanas, [semanas + 1, semanas - 1, semanas + 2])
        .map(n => ({ rotulo: `${n} semanas`, certa: n === semanas }))),
      descoberta: `${reais(meta)} ÷ ${reais(porSemana)} = ${semanas} semanas. Poupar é uma divisão com data de festa no final!`,
    });
  }

  rodadas.push(rodadaCofrinho(13 + Math.floor(Math.random() * 6))); // 13..18

  // meta do brinquedo
  {
    const preco = 30, tem = 18;
    rodadas.push({
      pergunta: `O robô de brinquedo custa ${reais(preco)} e seu cofrinho tem ${reais(tem)}. Quanto falta?`,
      mostraHTML: cartaoProduto('🤖', 'Meta', preco) + cartaoProduto('🐷', 'Cofrinho', tem),
      opcoes: embaralhar(opcoesReais(preco - tem, [preco - tem + 2, preco - tem - 2, preco - tem + 5])),
      descoberta: `${reais(preco)} − ${reais(tem)} = faltam ${reais(preco - tem)}. Cada moedinha guardada te deixa mais perto!`,
    });
  }

  // gastar tudo × guardar metade
  rodadas.push({
    pergunta: `Mesada de ${reais(10)} na mão! Sua meta é o robô. Qual plano te leva até ele?`,
    mostraHTML: cartaoProduto('🍭', 'Gastar tudo hoje', 10) + cartaoProduto('🐷', 'Doce + guardar metade', 5),
    opcoes: embaralhar([
      { rotulo: 'Gastar tudo hoje', certa: false },
      { rotulo: 'Curtir metade e guardar metade', certa: true },
    ]),
    descoberta: 'Metade para hoje, metade para o sonho: dá para se divertir E chegar na meta. Quem guarda um pouco SEMPRE, chega em qualquer lugar.',
  });

  // troco do dia a dia (padaria)
  {
    const compra = 7;
    rodadas.push({
      pergunta: `Missão de casa: comprar pão! Ele custa ${reais(compra)} e você levou uma nota de ${reais(10)}. Quanto traz de volta?`,
      mostraHTML: cartaoProduto('🍞', 'Pão', compra) + `<div class="produto-card"><span class="produto-emoji">💵</span><span class="produto-nome">Nota</span><span class="produto-preco">${reais(10)}</span></div>`,
      opcoes: embaralhar(opcoesReais(10 - compra, [10 - compra + 1, 10 - compra - 1, 10 - compra + 2])),
      descoberta: `${reais(10)} − ${reais(compra)} = ${reais(10 - compra)} de troco. Missão do dia a dia cumprida com matemática!`,
    });
  }

  rodadas.push(rodadaCofrinho(21 + Math.floor(Math.random() * 5))); // 21..25

  return rodadas;
}

export function missaoCofrinho(el, ctx) {
  return rodarLoja(el, ctx, {
    id: 'cofrinho',
    rodadas: planejarRodadas(),
    minimo: 6,
    mensagem: (a, t) => `Você acertou ${a} de ${t} desafios — seu cofrinho está orgulhoso!`,
  });
}
