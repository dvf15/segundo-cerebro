// Histórico de peso. Os pontos abaixo foram lidos do gráfico de longo prazo
// (2011–2025) e, para o período recente (set/2025 → ago/2026), dos gráficos
// exportados do app de saúde do usuário — mais densos e precisos:
//   • 17/ago/2025 – 17/ago/2026 (tendência −18,6 kg): pontos mensais.
//   • 02/fev/2026 – 03/ago/2026 (tendência −5,6 kg): pontos ~quinzenais.
//   • 15/mai/2026 – 13/ago/2026 (tendência −4,4 kg): pontos ~semanais.
// Cada ponto é editável na tela de Peso. Os pontos até 2025 continuam sendo
// aproximações; os de 2026 refletem os gráficos exportados.
export interface WeightPoint {
  date: string; // YYYY-MM-DD
  weight_kg: number;
}

export const WEIGHT_SEED: WeightPoint[] = [
  // Longo prazo (aproximado do gráfico 2011–2025).
  { date: "2011-03-05", weight_kg: 123.0 },
  { date: "2011-10-01", weight_kg: 122.0 },
  { date: "2012-06-01", weight_kg: 113.0 },
  { date: "2013-06-01", weight_kg: 116.0 },
  { date: "2014-06-01", weight_kg: 119.0 },
  { date: "2015-06-01", weight_kg: 123.0 },
  { date: "2016-06-01", weight_kg: 122.0 },
  { date: "2017-01-01", weight_kg: 109.0 },
  { date: "2017-06-01", weight_kg: 110.0 },
  { date: "2017-12-01", weight_kg: 111.0 },
  { date: "2018-06-01", weight_kg: 113.0 },
  { date: "2018-12-01", weight_kg: 116.0 },
  { date: "2019-06-01", weight_kg: 127.0 },
  { date: "2019-12-01", weight_kg: 122.0 },
  { date: "2020-06-01", weight_kg: 110.0 },
  { date: "2020-12-01", weight_kg: 112.0 },
  { date: "2021-06-01", weight_kg: 117.0 },
  { date: "2021-12-01", weight_kg: 123.0 },
  { date: "2022-06-01", weight_kg: 123.0 },
  { date: "2023-01-01", weight_kg: 124.0 },
  { date: "2023-08-01", weight_kg: 121.0 },
  { date: "2024-06-01", weight_kg: 120.0 },
  { date: "2025-01-01", weight_kg: 123.0 },
  { date: "2025-06-01", weight_kg: 125.0 },

  // Gráfico anual (mensal), set/2025 → jan/2026.
  { date: "2025-09-01", weight_kg: 124.0 },
  { date: "2025-10-01", weight_kg: 124.0 },
  { date: "2025-11-01", weight_kg: 121.0 },
  { date: "2025-12-01", weight_kg: 117.5 },
  { date: "2026-01-01", weight_kg: 115.5 },

  // Gráfico quinzenal, fev → início de mai/2026.
  { date: "2026-02-02", weight_kg: 112.5 },
  { date: "2026-02-16", weight_kg: 112.0 },
  { date: "2026-03-02", weight_kg: 111.3 },
  { date: "2026-03-16", weight_kg: 111.0 },
  { date: "2026-03-23", weight_kg: 110.6 },
  { date: "2026-03-30", weight_kg: 110.4 },
  { date: "2026-04-13", weight_kg: 110.6 },
  { date: "2026-04-20", weight_kg: 111.2 },
  { date: "2026-04-27", weight_kg: 110.4 },
  { date: "2026-05-04", weight_kg: 110.6 },

  // Gráfico semanal, mai → ago/2026 (ponto final 13/ago).
  { date: "2026-05-15", weight_kg: 111.3 },
  { date: "2026-05-22", weight_kg: 110.7 },
  { date: "2026-05-30", weight_kg: 110.0 },
  { date: "2026-06-06", weight_kg: 110.5 },
  { date: "2026-06-13", weight_kg: 111.0 },
  { date: "2026-06-20", weight_kg: 110.5 },
  { date: "2026-06-27", weight_kg: 109.7 },
  { date: "2026-07-04", weight_kg: 109.1 },
  { date: "2026-07-11", weight_kg: 109.2 },
  { date: "2026-07-18", weight_kg: 109.5 },
  { date: "2026-07-25", weight_kg: 108.7 },
  { date: "2026-08-01", weight_kg: 107.5 },
  { date: "2026-08-13", weight_kg: 107.7 },
];

// Data-assinatura presente apenas no seed enriquecido (gráficos de 2026). Se um
// banco já semeado com a versão antiga (esparsa) não tiver este ponto, o seed é
// reaplicado uma vez para enriquecer/corrigir; depois disso não roda mais,
// preservando edições manuais. Ver app/api/peso/route.ts.
export const WEIGHT_SEED_SIGNATURE = "2026-06-13";
