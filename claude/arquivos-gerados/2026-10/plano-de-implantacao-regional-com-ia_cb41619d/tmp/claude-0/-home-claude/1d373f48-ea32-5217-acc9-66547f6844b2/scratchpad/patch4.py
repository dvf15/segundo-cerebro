p = '/tmp/claude-0/-home-claude/1d373f48-ea32-5217-acc9-66547f6844b2/scratchpad/build.js'
s = open(p).read()

def rep(a, b):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, 1)

rep('"Metas e estratégia de cada ativo visíveis do shopping à regional, com visita estruturada"',
    '"Metas, estratégia e placar das batalhas de posicionamento, do shopping à regional"')
rep('["Treinamento em IA",    "PP.S......"],', '["Treinamento em IA",    "PP.S......"],\n      ["Monitor de batalhas",  "S.P.SPPSSP"],')
rep('rowH: [0.32, 0.55].concat(M.map(() => 0.38))', 'rowH: [0.32, 0.55].concat(M.map(() => 0.35))')
rep('["  02-shoppings/<nome>/ posicionamento, metas, mix, RMR", false],', '["  02-shoppings/<nome>/ posicionamento, batalhas, RMR", false],')
rep('["Material gerado a partir do painel, não montado à mão", "Desvios explicados e plano de ação", "Comparativo entre shoppings da regional"]',
    '["Abre pelo placar das batalhas de posicionamento", "Material gerado do painel; desvios e plano de ação", "Comparativo entre shoppings da regional"]')
rep('c("Prioriza lojas, serviços, gastronomia e entretenimento por aderência; qualifica investidores e marcas e indica o shopping certo")',
    'c("Prioriza por aderência às batalhas de cada shopping; qualifica investidores e marcas e indica o shopping certo")')
rep('"Painel de gestão à vista no ar nos três níveis", "Primeira RMR com material pré-montado",',
    '"Painel de gestão à vista no ar nos três níveis", "Placar das batalhas na primeira RMR automática",')
rep('c("Vacância; operações novas aderentes ao posicionamento; renovações na janela; leasing spread")',
    'c("Batalhas de posicionamento no prazo; vacância; operações novas aderentes; renovações na janela; leasing spread")')

novos = r'''// ---------- 10c. Monitor das batalhas ----------
  {
    const s = content("Monitor das batalhas de posicionamento de cada shopping", "Frente 1 · Gestão à vista integrada",
      "Cada shopping tem as batalhas que precisa vencer para cumprir o seu posicionamento. O plano passa a medir, toda semana, se elas estão sendo entregues.");
    const fl = [
      ["Batalhas definidas", "Por shopping, a partir do posicionamento e do cluster vigentes, com peso e meta"],
      ["Indicadores", "Por batalha: participação da categoria na ABL e nas vendas, operações abertas, frequência, ticket, satisfação"],
      ["Iniciativas ligadas", "Cada lead, renovação, campanha de mídia, evento e obra marcado com a batalha que serve"],
      ["Placar", "Semáforo por batalha no painel do shopping, na RMR e na visão regional"],
      ["Decisão", "Batalha sem avanço vira pauta: reforçar, ajustar ou rever com a diretoria"],
    ];
    const bw = 2.2, gap = 0.275;
    fl.forEach(([t, d], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 2.05, bw, 1.75, i === 3 ? T.teal : T.tint);
      s.addText(t, { x: x + 0.18, y: 2.15, w: bw - 0.36, h: 0.36, fontSize: 14.5, bold: true, color: i === 3 ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.18, y: 2.52, w: bw - 0.36, h: 1.22, fontSize: 11.5, color: i === 3 ? T.off : T.text, margin: 0, valign: "top", isTextBox: true });
      if (i < fl.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.04, y: 2.8, w: 0.2, h: 0.28, fill: { color: T.teal5 }, line: { color: T.teal5 } });
    });
    s.addText("Ficha de cada batalha (.md)", { x: 0.6, y: 4.05, w: 5, h: 0.35, fontSize: 15, bold: true, color: T.text, margin: 0, isTextBox: true });
    const fm = ["---", "tipo: batalha", "shopping: <nome>", "batalha: <nome da batalha>", "peso: <% na decisão>", "meta: <resultado e prazo>", "indicadores: [<lista>]", "iniciativas: [<leads, renovações, eventos>]", "dono: <papel>  ·  status: <semáforo>", "---"];
    card(s, 0.6, 4.45, 5.6, 2.25);
    s.addText(fm.map((t, i) => ({ text: t, options: { breakLine: i < fm.length - 1 } })),
      { x: 0.8, y: 4.55, w: 5.3, h: 2.1, fontFace: "Courier New", fontSize: 10.5, color: T.teal9, valign: "top", margin: 0, isTextBox: true });
    card(s, 6.5, 4.05, 6.2, 2.65, T.teal9);
    s.addText("Como se liga ao resto do plano", { x: 6.75, y: 4.18, w: 5.7, h: 0.35, fontSize: 15, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Radar de varejo prioriza leads pela batalha que preenchem",
      "Renovações pesam a aderência da loja às batalhas do shopping",
      "Mídia, eventos e obras declaram a batalha que servem",
      "Visita estruturada e RMR abrem pelo placar das batalhas",
      "Scorecard: % de batalhas no prazo, por shopping e na regional",
    ], { fontSize: 12.5, color: T.off, paraSpaceAfter: 5 }), { x: 6.75, y: 4.6, w: 5.75, h: 2.0, valign: "top", margin: 0, isTextBox: true });
  }

  // ---------- 10d. Passo a passo batalhas ----------
  await stepSlide("Passo a passo · monitor das batalhas de posicionamento", "Frente 1 · Gestão à vista integrada", [
    ["Levantar as batalhas", "confirmar as batalhas e os pesos de cada shopping a partir do posicionamento e do cluster oficiais da companhia", "Diretor + gerente regional", "S2", "Batalhas validadas"],
    ["Ficha de batalha", "uma ficha .md por batalha em 02-shoppings/<nome>/batalhas: meta, prazo, indicadores, iniciativas e dono", "Pontos focais", "S2–S3", "Fichas validadas"],
    ["Indicadores por batalha", "ligar cada indicador ao dicionário e à base pelo conector (ABL e vendas da categoria, operações abertas, fluxo, ticket)", "TI + gerente regional", "S3", "Mapa batalha × dado"],
    ["Marcar iniciativas", "cada lead, renovação, campanha, evento e obra recebe a batalha que serve; radar e renovações passam a usar o peso", "Pontos focais", "S3–S5", "Iniciativas marcadas"],
    ["Placar no painel", "semáforo por batalha nos três níveis; liberação junto com a gestão à vista (G2)", "Gerente regional", "S5–S6", "Placar em produção"],
    ["Visita estruturada e RMR", "roteiro de visita e material da RMR abrem pelo placar, com plano de ação por batalha atrasada", "Gerente regional", "S6", "RMR por batalha"],
    ["Alertas", "batalha sem avanço ou iniciativa atrasada avisa o dono e entra na pauta da semana", "Gerente regional", "S6–S7", "Alertas ativos"],
    ["Revisão com a diretoria", "na S13 e depois trimestralmente: reforçar, ajustar ou rever batalhas e pesos com base no placar", "Diretor", "S13", "Decisão por batalha"],
  ], "As batalhas e os pesos vêm do posicionamento oficial de cada shopping; o plano monitora a entrega, não redefine a estratégia.");
'''
rep("// ---------- 11. Frente 2 ----------", novos + "\n  // ---------- 11. Frente 2 ----------")

open(p, 'w').write(s)
print("ok")
