/**
 * Suporte, resistência e tendência a partir de candles diários.
 *
 * Método (o mesmo descrito no painel):
 *  - Volume Profile da janela: volume distribuído por faixa de preço; POC é a
 *    faixa mais negociada, Value Area concentra 70% do volume ao redor do POC,
 *    HVNs são máximos locais do perfil.
 *  - Pivôs de swing (fractais de 5 barras) nos últimos ~6 meses.
 *  - MM21 e MM200 para a tendência.
 *  Suporte = candidato mais próximo abaixo do preço (pivô, HVN, VAL ou POC);
 *  resistência = mais próximo acima (pivô, HVN, VAH, POC, máxima da janela).
 *  Candidatos a menos de 2% um do outro são fundidos — isso vira "confluência".
 *
 * Módulo puro: recebe barras, devolve níveis. Não acessa rede.
 */

const media = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

function mediaMovel(fechamentos, n) {
  if (fechamentos.length < n) return null;
  return media(fechamentos.slice(-n));
}

function perfilDeVolume(barras, faixas = 40) {
  const minimo = Math.min(...barras.map((b) => b.l));
  const maximo = Math.max(...barras.map((b) => b.h));
  const passo = (maximo - minimo) / faixas || 1;
  const volume = new Array(faixas).fill(0);

  for (const b of barras) {
    const de = Math.max(0, Math.floor((b.l - minimo) / passo));
    const ate = Math.min(faixas - 1, Math.floor((b.h - minimo) / passo));
    const partes = ate - de + 1;
    for (let i = de; i <= ate; i += 1) volume[i] += b.v / partes;
  }

  const total = volume.reduce((s, v) => s + v, 0);
  let poc = 0;
  volume.forEach((v, i) => { if (v > volume[poc]) poc = i; });

  // Value Area: expande do POC para o lado com mais volume até cobrir 70%
  let baixo = poc, alto = poc, acumulado = volume[poc];
  while (acumulado < total * 0.7 && (baixo > 0 || alto < faixas - 1)) {
    const vBaixo = baixo > 0 ? volume[baixo - 1] : -1;
    const vAlto = alto < faixas - 1 ? volume[alto + 1] : -1;
    if (vAlto >= vBaixo) { alto += 1; acumulado += volume[alto]; }
    else { baixo -= 1; acumulado += volume[baixo]; }
  }

  const centro = (i) => minimo + (i + 0.5) * passo;
  const mediana = [...volume].sort((a, b) => a - b)[Math.floor(faixas / 2)];
  const hvns = [];
  for (let i = 1; i < faixas - 1; i += 1) {
    if (volume[i] > volume[i - 1] && volume[i] >= volume[i + 1] && volume[i] >= mediana * 1.3) {
      hvns.push(centro(i));
    }
  }

  return { poc: centro(poc), val: minimo + baixo * passo, vah: minimo + (alto + 1) * passo, hvns };
}

function pivos(barras, k = 5) {
  const fundos = [], topos = [];
  for (let i = k; i < barras.length - k; i += 1) {
    const janela = barras.slice(i - k, i + k + 1);
    if (barras[i].l <= Math.min(...janela.map((b) => b.l))) fundos.push(barras[i].l);
    if (barras[i].h >= Math.max(...janela.map((b) => b.h))) topos.push(barras[i].h);
  }
  return { fundos, topos };
}

function fundir(candidatos, preco, lado) {
  // lado "abaixo": maior candidato < preço; "acima": menor candidato > preço
  const validos = candidatos
    .filter((c) => (lado === "abaixo" ? c.nivel < preco * 0.995 : c.nivel > preco * 1.005))
    .sort((a, b) => (lado === "abaixo" ? b.nivel - a.nivel : a.nivel - b.nivel));
  if (!validos.length) return null;

  const alvo = validos[0];
  const grupo = validos.filter((c) => Math.abs(c.nivel / alvo.nivel - 1) <= 0.02);
  return {
    nivel: media(grupo.map((c) => c.nivel)),
    confluencia: [...new Set(grupo.map((c) => c.tipo))],
  };
}

/**
 * @param {Array<{t:number,o:number,h:number,l:number,c:number,v:number}>} barras
 *   candles diários em ordem cronológica, idealmente ~250 (1 ano)
 */
export function calcularNiveis(barras) {
  const limpas = barras.filter((b) =>
    [b.o, b.h, b.l, b.c, b.v].every((x) => typeof x === "number" && Number.isFinite(x)) && b.h >= b.l
  );
  if (limpas.length < 40) return null;

  const fechamentos = limpas.map((b) => b.c);
  const preco = fechamentos.at(-1);
  const mm21 = mediaMovel(fechamentos, 21);
  const mm200 = mediaMovel(fechamentos, 200);
  const perfil = perfilDeVolume(limpas);
  const recentes = limpas.slice(-130);
  const { fundos, topos } = pivos(recentes);
  const max52 = Math.max(...limpas.map((b) => b.h));
  const min52 = Math.min(...limpas.map((b) => b.l));

  const candidatosBaixo = [
    ...fundos.map((n) => ({ nivel: n, tipo: "pivô" })),
    ...perfil.hvns.map((n) => ({ nivel: n, tipo: "HVN" })),
    { nivel: perfil.val, tipo: "VAL" },
    { nivel: perfil.poc, tipo: "POC" },
    { nivel: min52, tipo: "mínima 52s" },
  ];
  const candidatosAlto = [
    ...topos.map((n) => ({ nivel: n, tipo: "pivô" })),
    ...perfil.hvns.map((n) => ({ nivel: n, tipo: "HVN" })),
    { nivel: perfil.vah, tipo: "VAH" },
    { nivel: perfil.poc, tipo: "POC" },
    { nivel: max52, tipo: "máxima 52s" },
  ];
  if (mm200) {
    (mm200 < preco ? candidatosBaixo : candidatosAlto).push({ nivel: mm200, tipo: "MM200" });
  }

  const suporte = fundir(candidatosBaixo, preco, "abaixo");
  const resistencia = fundir(candidatosAlto, preco, "acima");

  let tendencia = "lateral";
  if (mm200 && mm21) {
    if (preco > mm200 && mm21 > mm200) tendencia = "alta";
    else if (preco < mm200 && mm21 < mm200) tendencia = "baixa";
  } else if (mm21) {
    tendencia = preco > mm21 * 1.02 ? "alta" : preco < mm21 * 0.98 ? "baixa" : "lateral";
  }

  const casas = preco < 20 ? 2 : 2;
  const r = (x) => (x === null || x === undefined ? null : Number(x.toFixed(casas)));

  return {
    preco: r(preco),
    suporte: suporte ? r(suporte.nivel) : null,
    suporteBase: suporte ? suporte.confluencia : [],
    resistencia: resistencia ? r(resistencia.nivel) : null,
    resistenciaBase: resistencia ? resistencia.confluencia : [],
    poc: r(perfil.poc),
    val: r(perfil.val),
    vah: r(perfil.vah),
    mm21: r(mm21),
    mm200: r(mm200),
    max52: r(max52),
    min52: r(min52),
    tendencia,
    barras: limpas.length,
  };
}

// Auto-teste com uma série sintética, para validar o módulo sem rede:
//   node scripts/tecnica.mjs
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const barras = [];
  let p = 25;
  for (let i = 0; i < 250; i += 1) {
    const ruido = Math.sin(i / 9) * 0.8 + Math.sin(i / 37) * 2;
    const c = 25 + ruido + i * 0.012;
    const o = p;
    const h = Math.max(o, c) + 0.3;
    const l = Math.min(o, c) - 0.3;
    barras.push({ t: i, o, h, l, c, v: 1e6 + (i % 7) * 2e5 });
    p = c;
  }
  console.log(calcularNiveis(barras));
}
