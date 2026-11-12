// Para pais e professores — a pedagogia em uma tela + escolha da voz.
import { voz } from '../voz.js';
import { store } from '../storage.js';
import { audio } from '../audio.js';

export function telaPais(el) {
  let limpeza = null;
  const raiz = document.createElement('div');
  raiz.className = 'tela-interna';
  const prosa = document.createElement('div');
  prosa.className = 'prosa';
  prosa.innerHTML = `
    <h2>🧑‍🏫 Como o Mundo Mágico do Tom ensina</h2>
    <p>Este jogo usa o raciocínio do <b>material dourado</b>, criado pela educadora Maria
    Montessori: toda quantidade é representada por blocos físicos — cubinhos (unidades),
    barras (dezenas) e placas (centenas). Quando 10 cubinhos se juntam, eles <b>viram uma
    barra dourada</b> diante dos olhos da criança. É assim que o famoso "vai um" deixa de
    ser uma regra decorada e passa a ser algo que ela <i>viu acontecer</i>.</p>
    <p>Os números de 1 a 9 são personagens com personalidade, inspirados em desenhos como
    Numberblocks: somar é juntar amigos e ver um personagem novo nascer; subtrair é
    separá-los; multiplicar é formar retângulos; dividir é repartir em grupos iguais.
    A criança manipula, erra sem punição e vê a resolução passo a passo com os blocos.</p>
    <p><b>Progressão:</b> os níveis Faísca (5–7), Chama (7–9), Fogueira (9–12) e Vulcão
    (12–14) se adaptam sozinhos — 3 acertos seguidos sobem a dificuldade, 2 erros seguidos
    descem e mostram a resolução. Os jogos de lógica treinam fatos fundamentais, padrões,
    pré-álgebra (balança), números quadrados e cálculo mental.</p>
    <p><b>Mundo dos Robôs (espaço e geometria):</b> cinco missões desenvolvem as noções
    espaciais e preparam a trigonometria: programar caminhos com setas e coordenadas,
    reconhecer formas 2D com lados e vértices, medir área cobrindo terrenos com
    quadradinhos (até descobrir o "linhas × colunas"), entender volume contando cubinhos
    por camadas, e explorar ângulos com giros e lançamentos — onde a criança descobre
    sozinha que 30° e 60° caem no mesmo lugar. A sequência segue o princípio
    <i>construir → manipular → contar → comparar → representar → generalizar</i>:
    a fórmula só aparece depois que o conceito foi vivido.</p>
    <p><b>Laboratório de Física:</b> cinco experimentos apresentam as três Leis de
    Newton, a gravidade e a termodinâmica básica (o calor flui do quente para o frio,
    temperatura como agitação de partículas, estados da matéria, condutores e isolantes)
    pelo método científico em miniatura: a criança <i>aposta</i> o
    que vai acontecer (hipótese), <i>vê o experimento animado</i> (observação) e só então
    a lei ganha nome (conclusão) — inércia no gelo e na areia, força × massa, ação e
    reação no skate e no foguete, e o martelo e a pena caindo juntos na Lua, como no
    teste real da Apollo 15.</p>
    <p><b>Cidade do Dinheiro (educação financeira):</b> três lojas ensinam finanças com
    a matemática do dia a dia — somar o carrinho e conferir o troco no supermercado;
    comparar preços, entender descontos e separar necessidade de desejo no shopping;
    e no cofrinho, tarefas que rendem mesada, metas de poupança ("quantas semanas até
    juntar?") e o desafio de compor valores exatos com moedas. Sem cartão, sem dívida:
    só as ideias-base de contar, comparar, esperar e poupar.</p>
    <p><b>Narração em voz alta:</b> as perguntas das Contas, da Balança e da Trilha são
    lidas em voz alta (útil para quem ainda não lê), usando a voz em português do próprio
    aparelho — sem internet. O botão 🔊 ao lado da pergunta repete a leitura, e o botão de
    som no topo silencia tudo.</p>
    <p><b>Privacidade:</b> o jogo funciona 100% no aparelho, sem internet, sem cadastro,
    sem anúncios e sem coleta de dados. O progresso fica salvo apenas neste navegador.</p>
    <p><b>Dica de uso:</b> comece pelo Mundo dos Bloquinhos e deixe a criança descobrir as
    fusões sozinha. Pergunte "o que acontece se juntar 7 com 3?" — e comemore a barra
    dourada junto com ela.</p>
  `;
  raiz.appendChild(prosa);

  // escolha da voz da narração — a qualidade varia muito entre aparelhos
  if (voz.disponivel) {
    const painel = document.createElement('div');
    painel.className = 'prosa';
    painel.innerHTML = '<h2>🎙️ Voz da narração</h2>' +
      '<p>A qualidade da voz depende do seu aparelho. Se ela soar robótica, escolha outra aqui ' +
      '(no iPhone e no Android dá para instalar vozes melhores em Ajustes → Acessibilidade → Conteúdo falado / Leitor de tela).</p>';

    const linha = document.createElement('div');
    linha.style.cssText = 'display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;margin-top:.6rem';
    const seletor = document.createElement('select');
    seletor.style.cssText = 'flex:1;min-width:200px;min-height:48px;border-radius:12px;border:2px solid #c9d7e6;font-family:inherit;font-weight:700;font-size:1rem;padding:.3rem .5rem;color:var(--tinta)';
    seletor.setAttribute('aria-label', 'Escolher a voz da narração');

    const preencher = () => {
      const vozes = voz.listarVozesPt();
      seletor.innerHTML = '';
      if (!vozes.length) {
        seletor.innerHTML = '<option>Nenhuma voz em português encontrada</option>';
        seletor.disabled = true;
        return;
      }
      const auto = document.createElement('option');
      auto.value = '';
      auto.textContent = '✨ Automática (a melhor que eu achar)';
      seletor.appendChild(auto);
      for (const v of vozes) {
        const o = document.createElement('option');
        o.value = v.voiceURI;
        o.textContent = `${v.name} (${v.lang})${v.localService ? '' : ' · online'}`;
        seletor.appendChild(o);
      }
      seletor.value = store.dados.vozURI || '';
    };
    preencher();
    speechSynthesis.addEventListener?.('voiceschanged', preencher);
    limpeza = () => speechSynthesis.removeEventListener?.('voiceschanged', preencher);

    const testar = document.createElement('button');
    testar.className = 'btn';
    testar.style.background = 'var(--c5)';
    testar.textContent = '🔊 Testar';
    const falarTeste = () => voz.falar('Olá! Eu sou a voz do Mundo Mágico do Tom. Quanto é 7 mais 3?');
    seletor.addEventListener('change', () => { voz.escolherVoz(seletor.value); audio.clique(); falarTeste(); });
    testar.addEventListener('click', falarTeste);

    linha.appendChild(seletor);
    linha.appendChild(testar);
    painel.appendChild(linha);
    raiz.appendChild(painel);
  }

  el.appendChild(raiz);
  return () => limpeza?.();
}
