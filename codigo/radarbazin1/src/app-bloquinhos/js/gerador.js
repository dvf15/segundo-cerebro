// Gerador de contas — função pura e testável. A resposta é SEMPRE calculada
// a partir dos operandos, nunca sorteada: é impossível gerar questão errada.

function inteiro(rnd, min, max) { // inclusivo
  return min + Math.floor(rnd() * (max - min + 1));
}
function escolher(rnd, lista) { return lista[Math.floor(rnd() * lista.length)]; }

export const NIVEIS = [
  { id: 'faisca', nome: 'Faísca', emoji: '✨', faixa: '5–7 anos', cor: '#f77f00', desc: 'Contar, somar e tirar até 10' },
  { id: 'chama', nome: 'Chama', emoji: '🔥', faixa: '7–9 anos', cor: '#e63946', desc: 'Até 100, com a troca da barra dourada' },
  { id: 'fogueira', nome: 'Fogueira', emoji: '🏕️', faixa: '9–12 anos', cor: '#43a047', desc: 'Vezes, dividir, dobro e metade' },
  { id: 'vulcao', nome: 'Vulcão', emoji: '🌋', faixa: '12–14 anos', cor: '#8e44ad', desc: 'Dois passos, frações e porcentagem' },
];

/**
 * @param {'faisca'|'chama'|'fogueira'|'vulcao'} nivel
 * @param {number} sub subnível 1..5
 * @param {()=>number} rnd gerador aleatório (injetável para teste)
 * @returns {{texto:string, resposta:number, visual:object, passos:Array<{texto:string, visual?:object}>}}
 */
export function gerarConta(nivel, sub, rnd = Math.random) {
  sub = Math.max(1, Math.min(5, sub));
  switch (nivel) {
    case 'faisca': return faisca(sub, rnd);
    case 'chama': return chama(sub, rnd);
    case 'fogueira': return fogueira(sub, rnd);
    case 'vulcao': return vulcao(sub, rnd);
    default: return faisca(1, rnd);
  }
}

// ---------- Faísca: contagem, soma e subtração até 10 ----------
function faisca(sub, rnd) {
  if (sub <= 2) {
    const n = sub === 1 ? inteiro(rnd, 1, 5) : inteiro(rnd, 6, 10);
    return {
      texto: 'Quantos cubinhos ao todo = ?',
      resposta: n,
      visual: { tipo: 'quantidade', n },
      passos: [
        { texto: 'Conte um cubinho de cada vez, apontando com o dedo.', visual: { tipo: 'quantidade', n } },
        { texto: `São ${n} cubinhos!`, visual: { tipo: 'quantidade', n } },
      ],
    };
  }
  if (sub === 3 || (sub === 5 && rnd() < 0.5)) {
    const a = inteiro(rnd, 1, 8);
    const b = inteiro(rnd, 1, Math.min(9, 10 - a));
    return {
      texto: `${a} + ${b} = ?`,
      resposta: a + b,
      visual: { tipo: 'par', a, b, op: '+' },
      passos: [
        { texto: `${a} bloquinhos aqui e ${b} ali. Vamos juntar!`, visual: { tipo: 'par', a, b, op: '+' } },
        { texto: `Juntando tudo: ${a} + ${b} = ${a + b}${a + b === 10 ? ' — virou uma barra dourada!' : ''}.`, visual: { tipo: 'quantidade', n: a + b } },
      ],
    };
  }
  const a = inteiro(rnd, 2, 10);
  const b = inteiro(rnd, 1, a - 1);
  return {
    texto: `${a} − ${b} = ?`,
    resposta: a - b,
    visual: { tipo: 'par', a, b, op: '−' },
    passos: [
      { texto: `Temos ${a} bloquinhos. ${b} vão pular para fora.`, visual: { tipo: 'quantidade', n: a } },
      { texto: `Sobraram ${a - b}: ${a} − ${b} = ${a - b}.`, visual: { tipo: 'quantidade', n: a - b } },
    ],
  };
}

// ---------- Chama: até 100, com e sem troca ----------
function chama(sub, rnd) {
  if (sub === 1) { // dezenas exatas
    const a = inteiro(rnd, 1, 5) * 10;
    const b = inteiro(rnd, 1, Math.min(4, (90 - a) / 10)) * 10;
    return {
      texto: `${a} + ${b} = ?`,
      resposta: a + b,
      visual: { tipo: 'par', a, b, op: '+' },
      passos: [
        { texto: `${a} são ${a / 10} barras douradas. ${b} são ${b / 10} barras.`, visual: { tipo: 'par', a, b, op: '+' } },
        { texto: `Juntando as barras: ${a / 10} + ${b / 10} = ${(a + b) / 10} barras, ou seja, ${a + b}.`, visual: { tipo: 'quantidade', n: a + b } },
      ],
    };
  }
  if (sub === 2) { // soma sem troca
    const u1 = inteiro(rnd, 1, 8), u2 = inteiro(rnd, 1, 9 - u1);
    const d1 = inteiro(rnd, 1, 5), d2 = inteiro(rnd, 1, 8 - d1);
    const a = d1 * 10 + u1, b = d2 * 10 + u2;
    return {
      texto: `${a} + ${b} = ?`,
      resposta: a + b,
      visual: { tipo: 'par', a, b, op: '+' },
      passos: [
        { texto: `Cada número é feito de barras (dezenas) e cubinhos (unidades).`, visual: { tipo: 'par', a, b, op: '+' } },
        { texto: `Cubinhos: ${u1} + ${u2} = ${u1 + u2}. Barras: ${d1} + ${d2} = ${d1 + d2}.`, visual: { tipo: 'quantidade', n: a + b } },
        { texto: `Total: ${a} + ${b} = ${a + b}.`, visual: { tipo: 'quantidade', n: a + b } },
      ],
    };
  }
  if (sub === 3) { // soma COM troca — o coração do jogo
    const u1 = inteiro(rnd, 2, 9), u2 = inteiro(rnd, 10 - u1 > 9 ? 9 : 10 - u1, 9);
    const d1 = inteiro(rnd, 1, 4), d2 = inteiro(rnd, 1, 8 - d1);
    const a = d1 * 10 + u1, b = d2 * 10 + u2;
    const somaU = u1 + u2;
    return {
      texto: `${a} + ${b} = ?`,
      resposta: a + b,
      visual: { tipo: 'par', a, b, op: '+' },
      passos: [
        { texto: `Primeiro os cubinhos: ${u1} + ${u2} = ${somaU}.`, visual: { tipo: 'par', a: u1, b: u2, op: '+' } },
        { texto: `${somaU} cubinhos são demais! 10 deles se alinham e viram UMA BARRA DOURADA, sobra${somaU - 10 === 1 ? '' : 'm'} ${somaU - 10}.`, visual: { tipo: 'quantidade', n: somaU } },
        { texto: `Agora as barras: ${d1} + ${d2} + 1 (a nova!) = ${d1 + d2 + 1} barras. Total: ${a + b}.`, visual: { tipo: 'quantidade', n: a + b } },
      ],
    };
  }
  if (sub === 4) { // subtração sem empréstimo
    const u1 = inteiro(rnd, 1, 9), u2 = inteiro(rnd, 0, u1);
    const d1 = inteiro(rnd, 2, 9), d2 = inteiro(rnd, 1, d1 - 1);
    const a = d1 * 10 + u1, b = d2 * 10 + u2;
    return {
      texto: `${a} − ${b} = ?`,
      resposta: a - b,
      visual: { tipo: 'par', a, b, op: '−' },
      passos: [
        { texto: `Tiramos ${u2} cubinho${u2 === 1 ? '' : 's'} e ${d2} barra${d2 === 1 ? '' : 's'} de ${a}.`, visual: { tipo: 'quantidade', n: a } },
        { texto: `Sobrou: ${a} − ${b} = ${a - b}.`, visual: { tipo: 'quantidade', n: a - b } },
      ],
    };
  }
  // sub 5: subtração COM empréstimo
  const u1 = inteiro(rnd, 0, 7), u2 = inteiro(rnd, u1 + 1, 9);
  const d1 = inteiro(rnd, 2, 9), d2 = inteiro(rnd, 1, d1 - 1);
  const a = d1 * 10 + u1, b = d2 * 10 + u2;
  return {
    texto: `${a} − ${b} = ?`,
    resposta: a - b,
    visual: { tipo: 'par', a, b, op: '−' },
    passos: [
      { texto: `Precisamos tirar ${u2} cubinhos, mas só temos ${u1}!`, visual: { tipo: 'quantidade', n: a } },
      { texto: `Sem problema: UMA barra dourada se desfaz em 10 cubinhos. Agora temos ${u1 + 10} cubinhos e ${d1 - 1} barras.`, visual: { tipo: 'quantidade', n: a } },
      { texto: `Cubinhos: ${u1 + 10} − ${u2} = ${u1 + 10 - u2}. Barras: ${d1 - 1} − ${d2} = ${d1 - 1 - d2}. Total: ${a - b}.`, visual: { tipo: 'quantidade', n: a - b } },
    ],
  };
}

// ---------- Fogueira: multiplicação, divisão, dobro e metade ----------
function fogueira(sub, rnd) {
  if (sub === 1) {
    if (rnd() < 0.5) {
      const n = inteiro(rnd, 2, 12);
      return {
        texto: `O dobro de ${n} = ?`,
        resposta: 2 * n,
        visual: { tipo: 'retangulo', linhas: 2, colunas: n },
        passos: [
          { texto: `Dobro é 2 fileiras iguais de ${n}.`, visual: { tipo: 'retangulo', linhas: 2, colunas: n } },
          { texto: `2 × ${n} = ${2 * n}.`, visual: { tipo: 'quantidade', n: 2 * n } },
        ],
      };
    }
    const m = inteiro(rnd, 2, 12);
    return {
      texto: `A metade de ${2 * m} = ?`,
      resposta: m,
      visual: { tipo: 'retangulo', linhas: 2, colunas: m },
      passos: [
        { texto: `Reparta ${2 * m} em 2 fileiras iguais.`, visual: { tipo: 'retangulo', linhas: 2, colunas: m } },
        { texto: `Cada fileira ficou com ${m}. A metade de ${2 * m} é ${m}.`, visual: { tipo: 'quantidade', n: m } },
      ],
    };
  }
  if (sub === 2 || sub === 3) {
    const max = sub === 2 ? 5 : 9;
    const a = inteiro(rnd, 2, max), b = inteiro(rnd, 2, max);
    return {
      texto: `${a} × ${b} = ?`,
      resposta: a * b,
      visual: { tipo: 'retangulo', linhas: a, colunas: b },
      passos: [
        { texto: `${a} × ${b} é um retângulo: ${a} fileiras com ${b} cubinhos cada.`, visual: { tipo: 'retangulo', linhas: a, colunas: b } },
        { texto: `Contando tudo: ${Array.from({ length: a }, () => b).join(' + ')} = ${a * b}.`, visual: { tipo: 'quantidade', n: a * b } },
      ],
    };
  }
  // sub 4 e 5: divisão exata
  const divisor = sub === 4 ? inteiro(rnd, 2, 5) : inteiro(rnd, 2, 9);
  const quociente = inteiro(rnd, 2, 9);
  const dividendo = divisor * quociente;
  return {
    texto: `${dividendo} ÷ ${divisor} = ?`,
    resposta: quociente,
    visual: { tipo: 'retangulo', linhas: divisor, colunas: quociente },
    passos: [
      { texto: `Reparta ${dividendo} cubinhos em ${divisor} grupos iguais.`, visual: { tipo: 'retangulo', linhas: divisor, colunas: quociente } },
      { texto: `Cada grupo ficou com ${quociente}: ${dividendo} ÷ ${divisor} = ${quociente}.`, visual: { tipo: 'quantidade', n: quociente } },
    ],
  };
}

// ---------- Vulcão: dois passos, frações e porcentagem ----------
function vulcao(sub, rnd) {
  if (sub === 1) {
    const a = inteiro(rnd, 10, 40), b = inteiro(rnd, 5, 30);
    const c = inteiro(rnd, 1, Math.min(20, a + b - 1));
    return {
      texto: `${a} + ${b} − ${c} = ?`,
      resposta: a + b - c,
      visual: { tipo: 'nenhum' },
      passos: [
        { texto: `Um passo de cada vez. Primeiro: ${a} + ${b} = ${a + b}.`, visual: { tipo: 'quantidade', n: a + b } },
        { texto: `Agora: ${a + b} − ${c} = ${a + b - c}.`, visual: { tipo: 'quantidade', n: a + b - c } },
      ],
    };
  }
  if (sub === 2) {
    const a = inteiro(rnd, 2, 6), b = inteiro(rnd, 1, 6), c = inteiro(rnd, 2, 6);
    return {
      texto: `(${a} + ${b}) × ${c} = ?`,
      resposta: (a + b) * c,
      visual: { tipo: 'nenhum' },
      passos: [
        { texto: `Parênteses primeiro: ${a} + ${b} = ${a + b}.`, visual: { tipo: 'quantidade', n: a + b } },
        { texto: `Depois o retângulo: ${a + b} × ${c} = ${(a + b) * c}.`, visual: { tipo: 'retangulo', linhas: c, colunas: a + b } },
      ],
    };
  }
  if (sub === 3 || sub === 4) {
    const den = escolher(rnd, [2, 3, 4, 5]);
    const num = sub === 3 ? 1 : inteiro(rnd, 1, den - 1);
    const parte = inteiro(rnd, 2, 8);
    const n = den * parte;
    return {
      texto: `${num}/${den} de ${n} = ?`,
      resposta: num * parte,
      visual: { tipo: 'fileira', n, pintados: num * parte },
      passos: [
        { texto: `Reparta ${n} em ${den} pedaços iguais: cada pedaço tem ${parte}.`, visual: { tipo: 'fileira', n, pintados: parte } },
        { texto: `Pegue ${num} pedaço${num === 1 ? '' : 's'}: ${num} × ${parte} = ${num * parte}.`, visual: { tipo: 'fileira', n, pintados: num * parte } },
      ],
    };
  }
  // sub 5: porcentagem visual
  const pct = escolher(rnd, [10, 25, 50]);
  const base = pct === 25 ? inteiro(rnd, 1, 12) * 4 : pct === 50 ? inteiro(rnd, 1, 25) * 2 : inteiro(rnd, 1, 9) * 10;
  return {
    texto: `${pct}% de ${base} = ?`,
    resposta: base * pct / 100,
    visual: { tipo: 'barra100', pct },
    passos: [
      { texto: `${pct}% é ${pct} de cada 100 — olhe a barra pintada.`, visual: { tipo: 'barra100', pct } },
      { texto: pct === 50 ? `50% é a metade: ${base} ÷ 2 = ${base / 2}.` : pct === 25 ? `25% é um quarto: ${base} ÷ 4 = ${base / 4}.` : `10% é dividir por 10: ${base} ÷ 10 = ${base / 10}.`, visual: { tipo: 'quantidade', n: base * pct / 100 } },
    ],
  };
}
