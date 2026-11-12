// ---- Data
const actions = [
  { n: 1, title: 'Definir o envelope de capital da transição e a supervisão de IA no conselho',
    alvo: 'Fraqueza: payout ~R$ 1,7 bi/ano vs capex R$ 350–450 mi', poder: 'Habilitador de todas as demais', horizonte: '0–6 meses', resp: 'CEO + CFO/RI, com o Presidente do Conselho',
    desc: 'Envelope plurianual de capex e opex para dados, tecnologia e reconversão; comitê de IA & Dados com um conselheiro independente especialista; métricas de IA no relatório trimestral e no guidance.',
    ex: 'R$ 250 mi/ano por 5 anos ≈ 11% do ponto médio do guidance de EBITDA 2026 e R$ 0,50/ação/ano: o dividendo mensal cairia de ~R$ 0,29 para ~R$ 0,25/ação, mantendo 1,7x. Alternativa: financiar com desinvestimentos da ação 2 (só o Curitiba rendeu R$ 199,6 mi). Aritmética minha, ilustrativa.',
    passos: ['Proposta ao conselho: envelope, comitê e KPIs; revisão da política de dividendos sem romper o guidance 2026', 'Conselheiro especialista em IA indicado para a AGO 2027'],
    kpi: 'Capex de transição / EBITDA; métricas de IA reportadas; decisões revisadas pelo comitê',
    inv: 'O envelope: R$ 220–330 mi/ano por 5 anos (10–15% do EBITDA), capex + opex das ações 3 a 10. Comitê e conselheiro: < R$ 2 mi/ano.',
    gain: 'Habilitador. Custo de não fazer: ~R$ 20 mi/ano por p.p. de ocupação perdido; ~R$ 50 mi/ano por cada 10% de estacionamento perdido sem reconversão.',
    team: 'Letramento em IA para o conselho (2 sessões/ano); célula de alocação de capital na CFO; conselheiro independente com experiência em plataformas de dados.' },
  { n: 2, title: 'Concentrar o portfólio: eleger ~20 ativos "destino" e sair da cauda em 24–36 meses',
    alvo: 'Fraqueza: cauda exposta a "agente + entrega"', poder: 'Recurso encurralado + escala', horizonte: '6–36 meses', resp: 'Investimentos e M&A + Portfólio',
    desc: 'Pontuar os 46 ativos por dominância, exposição do mix, opcionalidade de terreno e controle; concentrar capex nos ~20 melhores; vender ou aportar os demais no Kinea ALLOS Malls FII e em permutas.',
    ex: '"Destino": marca, terreno e controle — Parque Dom Pedro (319 mil m² disponíveis), Passeio das Águas (332 mil m²), Leblon, Villa-Lobos, Norteshopping, Tamboré. Critérios de revisão: participação minoritária sem gestão (ABC, 1,3%), ocupação baixa (Brasília 84,7%; Rio Design Leblon 63,9%). Dados públicos; decisão exige NOI e cap rate.',
    passos: ['Scoring dos 46 ativos aprovado pelo comitê de investimentos; lista de saída e cronograma 2027–2028', 'Capex 2027 realocado para os top-20; mandato para o FII'],
    kpi: '% do NOI nos top-20; cap rate de saída vs custo de capital; capex/m² nos top-20',
    inv: 'Custos de transação e estruturação: 1–2% do valor (R$ 10–40 mi em 24–36 meses; parte já incorrida no FII). Capex realocado, não adicional.',
    gain: 'R$ 1–2 bi de capital liberado (FII mira R$ 2 bi; Curitiba rendeu R$ 199,6 mi a 9,6%). +0,5–1,0 p.p. de margem NOI no remanescente (~R$ 15–25 mi/ano). Ganho é de valor.',
    team: '2–3 analistas de valuation usando fluxo e GMV como insumos; "dono do scoring" na Diretoria de Portfólio; comitê de investimentos com rito trimestral.' },
  { n: 3, title: 'Allos Agent Gateway: oferta, benefício, estoque e evento legíveis por agentes de IA',
    alvo: 'Ameaça → oportunidade: comércio agêntico', poder: 'Economias de rede + custos de troca', horizonte: 'MVP em 12 meses; total em 24', resp: 'Desenvolvimento e Novos Negócios + helloo + TI',
    desc: 'API em padrão aberto (estilo MCP) com catálogo de lojas, benefícios, eventos, estacionamento e reservas; padrão para lojistas publicarem estoque; integração com assistentes de consumo de massa.',
    ex: 'O cliente diz ao assistente: "quero um tênis de corrida hoje à tarde, perto de casa". O assistente consulta o Gateway: On Running no Leblon tem o modelo, o programa dá cashback, há vaga reservável e corrida no sábado. Sugere a visita e reserva a vaga — e a Allos sabe que a visita veio de agente. Sem o Gateway, sugere entrega em casa.',
    passos: ['MVP com catálogo e benefícios de 5 shoppings; piloto com um assistente de massa (WhatsApp, Google ou Apple)', 'Padrão de estoque publicado por ≥ 200 lojas em 12 meses; 37 shoppings em 24'],
    kpi: '% de visitas e resgates originados por agentes; cobertura do catálogo; conversão sugestão → visita',
    inv: 'Capex R$ 15–30 mi em 24 meses (API, integrações de estoque e assistentes); opex R$ 5–10 mi/ano (squad de 10–15 pessoas e parcerias).',
    gain: '10% das visitas via agentes em 2030 e +1–2% de vendas = R$ 400–800 mi/ano @100% e ~R$ 15–30 mi/ano em aluguel variável. Evitar "taxa de descoberta" de 5–15% vale mais.',
    team: 'Squad: 1 PM, 6–8 engenheiros, 2 de dados; 1 gerente de parcerias com assistentes; gerentes comerciais treinados no onboarding de estoque dos lojistas.' },
  { n: 4, title: 'Escalar o ciclo fechado de retail media (VendaCerta) ao portfólio e às marcas',
    alvo: 'Oportunidade: mídia já é 10,6% da receita', poder: 'Economias de rede + recurso encurralado (dado)', horizonte: '12–24 meses', resp: 'helloo (Geral e Comercial) + CRM',
    desc: 'Levar o VendaCerta dos pilotos SP/RJ aos 37 shoppings com plataforma; produto "venda incremental comprovada" para marcas de consumo; tudo medido contra grupo de controle; mesmo ciclo em aeroportos e edifícios.',
    ex: 'Hoje: a loja cadastra um benefício no app; o CRM aciona "clientes de concorrentes", "adormecidos há 45 dias" e "compradores de lojas complementares"; a venda é comprovada no GMV (R$ 11,50 por R$ 1 nos pilotos). Em 2036: uma marca de bebidas paga por garrafa vendida a membros expostos nas telas e no app — nada sem comprovação é faturado.',
    passos: ['Rollout em 15 shoppings; 3 marcas nacionais em piloto com medição de incrementalidade', 'Painel de ROAS auditável; 37 shoppings e 20 marcas em 12 meses'],
    kpi: 'Receita de mídia por resultado; ROAS comprovado; % lojistas ativos; mídia / receita total',
    inv: 'Opex R$ 10–20 mi/ano (CRM, mídia por resultado, medição, ativação); capex < R$ 5 mi. Menor investimento por real de ganho do plano.',
    gain: 'Mídia de 10,6% para 15% da receita em 2030: de ~R$ 330 mi para ~R$ 450–500 mi/ano (+R$ 120–170 mi); ~R$ 60–90 mi/ano de EBITDA incremental.',
    team: '20–30 pessoas na helloo em CRM, mídia por resultado e analytics; gerentes de marketing dos 37 shoppings certificados (Academia); comercial vendendo venda comprovada, não CPM.' },
  { n: 5, title: 'Camada proprietária de dados e IA, com estratégia multi-fornecedor',
    alvo: 'Fraqueza: dependência de 2–3 provedores de IA', poder: 'Recurso encurralado + escala', horizonte: '12–24 meses', resp: 'Head de Dados e IA + helloo + Jurídico',
    desc: 'Modelo de dados único (CRM, GMV, fluxo, estacionamento, locação); modelos próprios de propensão, churn, inadimplência, mix e preço; ≥2 provedores com portabilidade; consentimento "agent-ready" e clean room para marcas.',
    ex: 'O modelo de propensão a visita cruza frequência pós-adesão (+15%; +31% nos maduros), categoria e horário, e alimenta o mix (9), a mídia (4) e o Gateway (3). Uma marca de CPG acessa a audiência por clean room — agregados, nunca o indivíduo — e paga pela ativação. O provedor de modelo é substituível; o dado não.',
    passos: ['Inventário e governança de dados; contrato com ≥2 provedores, com cláusula de portabilidade', 'Primeiro modelo próprio em produção; 5 modelos e clean room com 3 marcas em 12 meses'],
    kpi: '% das decisões com modelos próprios; custo de IA por shopping; % de dados com consentimento ativável',
    inv: 'Capex R$ 30–50 mi em 3 anos (modelo de dados, infra, clean room); opex R$ 15–25 mi/ano (time de 20–30 pessoas, licenças, governança e LGPD).',
    gain: 'Multiplicador de 3, 4, 7 e 9. Diretos: inadimplência de 1,4% para 1,0% (~R$ 11 mi/ano); 10–20% do custo de IA evitado (sem lock-in); clean room R$ 5–10 mi/ano.',
    team: 'Head de Dados e IA reportando ao CEO/COO; 20–30 profissionais; letramento em dados (20 h) para 100% dos superintendentes e gerentes; um "dono de dado" por domínio.' },
  { n: 6, title: 'Reconverter estacionamento antes da queda: plano por ativo',
    alvo: 'Fraqueza: 18% da receita líquida (~R$ 510 mi/ano)', poder: 'Recurso encurralado (terreno) + contraposicionamento', horizonte: 'Projetos em 36 meses; obra 2029–34', resp: 'Desenvolvimento e Novos Negócios + Operações',
    desc: 'Mapear ocupação de vagas por ativo e horário; definir para cada dominante o uso que substitui o deck (saúde, educação, moradia, last-mile, lazer); aprovar projetos e licenças enquanto a receita atual financia a obra.',
    ex: 'O Taste do Tijuca é o caso-piloto realizado: estacionamento descoberto virou rooftop de 2.167 m² com 22 operações, R$ 5 mi no 1º mês (+22%) e ~15% do fluxo — ~R$ 27 mil/m²/ano de vendas, mais de 3x a média do portfólio. Maceió é a versão residencial (5 torres). Em 2036, o deck superior abriga clínica-dia, escola e hub de last-mile.',
    passos: ['Mapa de ocupação de vagas dos 46 ativos; 3 pilotos de reconversão de deck com modelo de receita por m² de solo', 'Projetos conceituais nos top-20 e licenciamento em 5 em 12 meses; contratos de estacionamento com cláusula de saída'],
    kpi: 'm² de estacionamento com projeto aprovado; receita/m² de solo vs receita perdida; prazo de licença',
    inv: 'R$ 10–20 mi em projetos e licenças; capex R$ 150–400 mi em 2029–34 (50–100 mil m² a R$ 3–5 mil/m²), parte via permuta com incorporadores, sem capital da Allos.',
    gain: 'Protege ~R$ 510 mi/ano de estacionamento. 50 mil m² reconvertidos a ~R$ 1.600/m²/ano = ~R$ 80 mi/ano de locação, mais VGV de multiúso por permuta.',
    team: '3–5 gerentes de projeto de reconversão; célula de licenciamento por município (Builder OS já calibrado para o Rio: COSCIP, CBMERJ, CA); operações em gestão dinâmica de vagas.' },
  { n: 7, title: 'Operação agêntica: vacância, renovação, cobrança e atendimento',
    alvo: 'Oportunidade: SG&A de ~14% para um dígito; gargalos H2/H3', poder: 'Poder de processo + escala', horizonte: '12–36 meses', resp: 'COO + Locação + Pessoas (H1)',
    desc: 'Padronizar os playbooks (H2) e colocar agentes em produção nos processos de maior volume — pipeline de vacância (H3), underwriting de renovação, PDD, atendimento e cobrança — redesenhando o processo, não só acoplando ferramenta.',
    ex: 'Contrato de satélite vence em 9 meses: o agente classifica a loja por mix e quadrante, define a janela, calcula o leasing spread real e a alçada e entrega o dossiê; o gerente negocia. Se o churn indica saída, o Hunter lista marcas com fit de cluster, o Farmer qualifica o investidor, o Alavancador estrutura a condição e o Builder entrega projeto e licenças.',
    passos: ['Playbooks com SLA para renovação, vacância e cobrança; 3 agentes em produção em 5 shoppings; linha de base de ciclo e custo', 'Pipeline de vacância em 20 shoppings e renovação assistida em 100% dos vencimentos em 12 meses'],
    kpi: 'SG&A / receita líquida; dias de renovação; dias de vacância; inadimplência; shoppings por gestor',
    inv: 'Capex R$ 10–20 mi (integração e agentes); opex R$ 10–20 mi/ano (licenças, 3–4 squads); Academia R$ 3–5 mi/ano. Total < 10% do SG&A atual (~R$ 410 mi/ano).',
    gain: 'Maior ganho operacional: SG&A −20% até 2030 (~R$ 80 mi/ano); vacância −30% em dias ≈ +1 p.p. de ocupação (~R$ 20 mi); PDD e cobrança ~R$ 10 mi. ~R$ 110 mi/ano; ~R$ 150 mi em 2036.',
    team: 'Academia (6 meses) para superintendentes e gerentes; 10 "donos de playbook" (padronizar antes de automatizar); 3–4 squads de agentes; metas de uso no bônus; carreira de "orquestrador" (4 → 7–8 shoppings por gestor).' },
  { n: 8, title: 'Contrato híbrido por desempenho: piloto em 5 shoppings',
    alvo: 'Oportunidade de contraposicionamento', poder: 'Contraposicionamento + custos de troca do lojista', horizonte: '12–24 meses', resp: 'Locação + Jurídico + helloo',
    desc: 'Aluguel mínimo menor, variável sobre venda medida pela plataforma e pacote de mídia e dados incluído; cobrar por resultado, não só por m²; medir contra grupo de controle antes de escalar.',
    ex: 'Ilustrativo: uma loja de moda paga mínimo + 7% sobre vendas acima do ponto de equilíbrio. No piloto, o mínimo cai 20%, a variável sobe para 9% sobre vendas medidas (GMV + nota fiscal) e o contrato inclui VendaCerta e painel de fluxo. Se vende mais, a Allos ganha mais; se vende menos, perde pouco e tem dado para agir. O lojista fica preso por dados, não por obra.',
    passos: ['Desenho jurídico e financeiro; piloto com 30 lojistas em 5 shoppings e grupo de controle', '150 contratos híbridos e decisão de escala em 12 meses'],
    kpi: 'SSR do piloto vs controle; churn; share de GMV capturado; margem de mídia incremental',
    inv: 'Opex R$ 1–3 mi (jurídico, auditoria de vendas, célula de pricing). Receita em risco limitada ao piloto: 30 lojas com mínimo 20% menor.',
    gain: 'SSR +3 p.p. vs controle, escalado a 30% dos satélites (~R$ 600 mi/ano de locação) = ~R$ 18 mi/ano, mais mídia embutida e menor churn (cada p.p. de ocupação ≈ R$ 20 mi/ano).',
    team: 'Célula de pricing por desempenho na Locação (2–3 pessoas com dados e jurídico); negociadores treinados em contratos variáveis e leitura do painel de fluxo; auditoria de vendas integrada ao GMV.' },
  { n: 9, title: 'Rebalancear o mix para categorias não agentizáveis',
    alvo: 'Fraqueza: comparáveis com SSS de 1–2%', poder: 'Marca por ativo + recurso encurralado', horizonte: '24–60 meses', resp: 'Locação + Desenvolvimento + Marketing/Eventos',
    desc: 'Meta por ativo de % de ABL em serviços, saúde, educação, gastronomia, lazer e eventos; replicar o Taste em áreas de baixa produtividade; pipeline de operadores de saúde e educação; bilheteria precificada por demanda.',
    ex: 'Serviços e Lazer crescem 6,5% vs Roupas 1,2%. O Taste (4 unidades) é o formato replicável; On Running, Fazenda Churrascada, Track & Field e Aramis mostram a direção. Em 2036, uma antiga âncora de eletrônicos vira polo de saúde com agendamento via Gateway; o São João vende ingresso e patrocínio por dado de intenção.',
    passos: ['Diagnóstico de mix por ativo e exposição a comparáveis; metas 2028 por shopping', '5 reconversões de âncora, 2 novos Taste e bilheteria dinâmica em 10 shoppings em 12 meses'],
    kpi: '% de ABL não agentizável; SSS de serviços e lazer; fluxo; receita de bilheteria e patrocínio',
    inv: 'Capex R$ 50–100 mi/ano em reconversões de âncoras e áreas ociosas, dentro do guidance de expansões (R$ 350–450 mi em 2026); CDU e luvas ajudam a financiar.',
    gain: 'Cada Taste (~2 mil m²) ≈ R$ 5 mi/ano de aluguel sobre ~R$ 60 mi de vendas; 10 reconversões até 2030 ≈ R$ 50 mi/ano. Deslocar 10 p.p. de ABL para SSS de 6,5% soma ~0,5 p.p. ao SSS.',
    team: '2–3 especialistas de prospecção em saúde, educação e serviços (ciclo de decisão longo e técnico); curadoria de eventos com bilheteria dinâmica; Hunter como ferramenta de prospecção.' },
  { n: 10, title: 'Plataforma de gestão como produto para terceiros e FIIs',
    alvo: 'Oportunidade: monetizar o know-how antes que a IA o comoditize', poder: 'Escala + poder de processo', horizonte: '24–48 meses', resp: 'Desenvolvimento e Novos Negócios + COO + helloo',
    desc: 'Empacotar operação agêntica (7), camada de dados (5), Gateway (3) e mídia (4) como serviço de gestão para shoppings de terceiros e FIIs, começando pelo Kinea ALLOS Malls FII; precificar com variável sobre NOI e GMV.',
    ex: 'O FII compra ativos da cauda (ação 2) e contrata a plataforma: o shopping ganha pipeline de vacância, retail media e Gateway sem o custo fixo de uma companhia aberta. A Allos troca aluguel por taxa de gestão + mídia + dados, sem capital imobilizado. Um shopping independente de cidade média contrata o pacote para não ficar invisível aos agentes.',
    passos: ['Proposta de valor e precificação; oferta aos 6 shoppings já administrados (207,6 mil m²)', 'FII como cliente-âncora; 10 shoppings de terceiros em 12 meses'],
    kpi: 'ABL administrada de terceiros; receita e margem de serviços de gestão; NOI gerido vs benchmark',
    inv: 'Opex R$ 5–10 mi/ano (produto B2B, contas, onboarding). A plataforma é construída pelas ações 3, 5 e 7; esta só a empacota.',
    gain: 'Cada 100 mil m² de terceiros ≈ R$ 10–15 mi/ano em taxas, mais mídia e dados; 300 mil m² adicionais até 2032 ≈ R$ 30–50 mi/ano, com margem alta e sem capital imobilizado.',
    team: '5–8 pessoas em produto B2B, gerentes de conta e onboarding; SLA com métricas de IA; política de conflito de interesse entre ativos próprios e de terceiros escrita antes do 1º contrato.' },
];

// ---- Overview tables: investimento e ganho
const shortTitles = [
  'Envelope de capital da transição e comitê de IA',
  'Concentrar o portfólio nos ~20 "destino"; sair da cauda',
  'Allos Agent Gateway: legível para agentes de IA',
  'Escalar o ciclo fechado de retail media (VendaCerta)',
  'Camada proprietária de dados e IA, multi-fornecedor',
  'Reconverter estacionamento antes da queda',
  'Operação agêntica: vacância, renovação, cobrança',
  'Contrato híbrido por desempenho (piloto)',
  'Rebalancear o mix para categorias não agentizáveis',
  'Plataforma de gestão para terceiros e FIIs',
];
const shortInv = [
  'Envelope: R$ 220–330 mi/ano × 5 anos; comitê < R$ 2 mi/ano',
  'Transação 1–2% (R$ 10–40 mi); capex realocado',
  'Capex R$ 15–30 mi; opex R$ 5–10 mi/ano',
  'Opex R$ 10–20 mi/ano; capex < R$ 5 mi',
  'Capex R$ 30–50 mi (3 anos); opex R$ 15–25 mi/ano',
  'Projetos R$ 10–20 mi; capex R$ 150–400 mi (2029–34), parte via permuta',
  'Capex R$ 10–20 mi; opex R$ 10–20 mi/ano; Academia R$ 3–5 mi/ano',
  'Opex R$ 1–3 mi; receita em risco só no piloto',
  'Capex R$ 50–100 mi/ano, dentro do guidance de expansões',
  'Opex R$ 5–10 mi/ano',
];
const shortGain = [
  'Habilitador; custo de não fazer ~R$ 20 mi/ano por p.p. de ocupação',
  'R$ 1–2 bi de capital liberado; +0,5–1 p.p. de margem NOI (~R$ 15–25 mi/ano)',
  '+1–2% de vendas (~R$ 15–30 mi/ano); evita taxa de descoberta de 5–15%',
  '+R$ 120–170 mi/ano de mídia; ~R$ 60–90 mi/ano de EBITDA',
  '~R$ 11 mi/ano em PDD; 10–20% do custo de IA evitado; multiplicador',
  'Protege ~R$ 510 mi/ano; ~R$ 80 mi/ano de locação + VGV',
  '~R$ 110 mi/ano (SG&A −80; vacância +20; PDD −10); ~R$ 150 mi em 2036',
  '~R$ 18 mi/ano se escalado a 30% dos satélites (SSR +3 p.p.)',
  '~R$ 50 mi/ano com 10 reconversões tipo Taste; +0,5 p.p. de SSS',
  '~R$ 30–50 mi/ano com 300 mil m² adicionais de terceiros',
];
[[0, 5, 'As 10 ações (1 a 5): alvo, investimento e ganho potencial'], [5, 10, 'As 10 ações (6 a 10): alvo, investimento e ganho potencial']].forEach(([from, to, ttl]) => {
  const sv = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
  sv.addText(ttl, { placeholder: 'title' });
  const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 10.5, valign: 'middle' };
  const rows = [[
    { text: '#', options: { ...hdr, align: 'center' } }, { text: 'Ação', options: { ...hdr } }, { text: 'Alvo', options: { ...hdr } },
    { text: 'Investimento (capex / opex)', options: { ...hdr } }, { text: 'Ganho potencial (run-rate 2030)', options: { ...hdr } },
  ]];
  actions.slice(from, to).forEach((a, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    const opt = { fontSize: 10.5, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
    rows.push([
      { text: String(a.n), options: { ...opt, bold: true, color: THEME.colors.accent2, align: 'center', fontSize: 14 } },
      { text: shortTitles[from + i], options: { ...opt, bold: true, color: THEME.colors.dk2 } },
      { text: shortAlvo[from + i], options: { ...opt } },
      { text: shortInv[from + i], options: { ...opt } },
      { text: shortGain[from + i], options: { ...opt, bold: true, color: THEME.colors.accent4 } },
    ]);
  });
  sv.addTable(rows, { x: 0.5, y: 1.1, w: 9.0, colW: [0.35, 2.35, 1.95, 2.1, 2.25], rowH: [0.4, 0.7, 0.7, 0.7, 0.7, 0.7], border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.06, objectName: 'overview table ' + (from + 1) });
  sv.addText('Investimentos e ganhos são hipóteses minhas sobre run-rates do 2T26/6M26; cada p.p. de ocupação ≈ R$ 20 mi/ano de locação. Não é guidance.', { x: 0.5, y: 4.95, w: 9, h: 0.3, fontSize: 9.5, italic: true, color: C.accent6, margin: 0, isTextBox: true, objectName: 'overview note ' + (from + 1) });
});

// ---- Action slides
actions.forEach((a) => {
  const sl = pres.addSlide({ masterName: 'ACTION', sectionTitle: 'Plano de ação' });
  sl.addText(a.title, { placeholder: 'title' });
  sl.addText(String(a.n).padStart(2, '0'), { x: 0.35, y: 0.25, w: 2.6, h: 0.8, fontSize: 44, bold: true, color: C.accent2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'action number' });
  const rows = [['ALVO', a.alvo, 1.15, 0.6], ['PODER DE HELMER', a.poder, 1.95, 0.5], ['HORIZONTE', a.horizonte, 2.65, 0.42], ['RESPONSÁVEL SUGERIDO', a.resp, 3.25, 0.6], ['KPI', a.kpi, 4.05, 1.1]];
  rows.forEach(([lab, val, y, h], i) => {
    label(sl, lab, 0.35, y, 2.6, 'label ' + (i + 1), true);
    sl.addText(val, { x: 0.35, y: y + 0.23, w: 2.6, h, fontSize: 10.5, bold: true, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'value ' + (i + 1) });
  });
  sl.addText(a.desc, { x: 3.65, y: 1.2, w: 5.85, h: 0.62, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'description' });
  label(sl, 'EXEMPLO PRÁTICO', 3.65, 1.86, 5.85, 'example label');
  sl.addText(a.ex, { x: 3.65, y: 2.07, w: 5.85, h: 0.9, fontSize: 10, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'example' });
  label(sl, 'PRIMEIROS 90 DIAS E MARCOS DE 12 MESES', 3.65, 3.0, 5.85, 'steps label');
  sl.addText(bullets(a.passos, 10.5, 2), { x: 3.65, y: 3.21, w: 5.85, h: 0.58, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'steps' });
  const strip = [['INVESTIMENTO (CAPEX / OPEX)', a.inv, false], ['GANHO POTENCIAL', a.gain, true], ['PREPARAÇÃO DO TIME', a.team, false]];
  strip.forEach(([lab, txt, dark], i) => {
    const x = 3.65 + i * 1.98;
    card(sl, x, 3.85, 1.88, 1.3, 'strip card ' + (i + 1), dark);
    label(sl, lab, x + 0.1, 3.93, 1.7, 'strip label ' + (i + 1), dark);
    sl.addText(txt, { x: x + 0.1, y: 4.15, w: 1.7, h: 0.95, fontSize: 8.5, color: dark ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'strip text ' + (i + 1) });
  });
  sl.addNotes(`Ação ${a.n}: ${a.title}. Alvo: ${a.alvo}. Poder: ${a.poder}. Horizonte: ${a.horizonte}. Responsável sugerido: ${a.resp}. Investimento: ${a.inv} Ganho potencial: ${a.gain} Preparação do time: ${a.team}`);
});

