p = '/tmp/claude-0/-home-claude/1d373f48-ea32-5217-acc9-66547f6844b2/scratchpad/build.js'
s = open(p).read()

def ins_before(marker, code):
    global s
    assert marker in s, marker
    s = s.replace(marker, code + "\n  " + marker, 1)

def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)

# ---- helper ----
helper = r'''
  async function stepSlide(title, tg, steps, note) {
    const s = content(title, tg, null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 12, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [[
      { text: "#", options: { ...hdr, align: "center" } }, { text: "Passo", options: hdr },
      { text: "Responsável", options: hdr }, { text: "Semana", options: hdr }, { text: "Entregável", options: hdr },
    ]];
    steps.forEach(([t, d, r, w, e], i) => rows.push([
      c(String(i + 1), { bold: true, color: T.teal, align: "center", fontSize: 13 }),
      { text: [{ text: t, options: { bold: true, color: T.teal9 } }, { text: " — " + d, options: { color: T.text } }], options: { fontSize: 11.5, valign: "middle" } },
      c(r), c(w), c(e, { color: T.muted }),
    ]));
    s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [0.45, 6.35, 1.85, 1.0, 2.45], rowH: [0.4].concat(steps.map(() => 0.6)),
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.04, 0.1, 0.04, 0.1] });
    if (note) s.addText(note, { x: 0.6, y: 6.62, w: 11.6, h: 0.32, fontSize: 11, italic: true, color: T.muted, margin: 0, isTextBox: true });
    return s;
  }
'''
rep("  const bullets = (arr, opts = {})", helper + "  const bullets = (arr, opts = {})")

# ---- Etapa 0: fundação técnica (antes da Frente 0) ----
etapa0 = r'''// ---------- 5b. Etapa 0 — esteira ----------
  {
    const s = content("Nada entra em produção sem passar pela esteira de segurança", "Etapa 0 · Fundação técnica",
      "Pré-requisito de todas as frentes: dados da companhia conectados com segurança e cada app validado no Orca antes de ir para o ambiente corporativo.");
    const fl = [
      ["Desenvolver", "Ambiente de dev, dados mascarados", T.tint, T.teal],
      ["Testar", "Homologação com dados reais e reconciliação", T.tint, T.teal],
      ["Validar no Orca", "Varredura de segurança e tratamento de achados", T.teal, T.white],
      ["Aprovar", "SI + TI na gestão de mudanças", T.tint, T.teal],
      ["Produção", "Liberação no ambiente corporativo", T.teal9, T.white],
      ["Monitorar", "Orca contínuo e logs de uso", T.tint, T.teal],
    ];
    const bw = 1.85, gap = 0.2;
    fl.forEach(([t, d, bg, fg], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 2.05, bw, 1.75, bg);
      s.addText(t, { x: x + 0.15, y: 2.18, w: bw - 0.3, h: 0.4, fontSize: 15, bold: true, color: fg, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.15, y: 2.62, w: bw - 0.3, h: 1.1, fontSize: 12, color: fg === T.white ? T.off : T.text, margin: 0, valign: "top", isTextBox: true });
      if (i < fl.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.02, y: 2.8, w: 0.16, h: 0.26, fill: { color: T.teal5 }, line: { color: T.teal5 } });
    });
    s.addText("Gates de liberação em produção", { x: 0.6, y: 4.1, w: 6, h: 0.4, fontSize: 16, bold: true, color: T.text, margin: 0, isTextBox: true });
    const g = [
      ["G1 · S4", "Conector da base de dados, repositório e segundo cérebro"],
      ["G2 · S6", "Gestão à vista, renovações e ferramenta de cláusulas"],
      ["G3 · S7", "Radar de auditoria e os 4 pilotos operacionais"],
      ["G4 · S9", "Manual operacional e automações avançadas"],
    ];
    g.forEach(([a, b], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 0.6 + col * 6.1, y = 4.6 + row * 0.95;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.3, h: 0.75, rectRadius: 0.08, fill: { color: T.orange }, line: { color: T.orange } });
      s.addText(a, { x, y, w: 1.3, h: 0.75, fontSize: 14, bold: true, color: T.teal9, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(b, { x: x + 1.45, y, w: 4.4, h: 0.75, fontSize: 13, color: T.text, valign: "middle", margin: 0, isTextBox: true });
    });
    s.addText("Enquanto um gate não é aprovado, o trabalho segue em desenvolvimento com dados mascarados — o cronograma não para.",
      { x: 0.6, y: 6.55, w: 12, h: 0.35, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 5c. Etapa 0A — base de dados ----------
  await stepSlide("Passo a passo · conexão com a base de dados da companhia", "Etapa 0A · Fundação técnica", [
    ["Kickoff técnico com TI e dados", "mapear onde estão os dados de cada frente (sistema de gestão dos shoppings, BI, data lake, pastas de rede)", "Gerente regional + TI", "S1", "Inventário de fontes"],
    ["Escopo mínimo de dados", "por frente, listar só os campos necessários (minimização); nada de dados pessoais sem necessidade (LGPD)", "Diretor + pontos focais", "S1", "Matriz frente × campos"],
    ["Classificação dos dados", "definir com SI e Jurídico o que é interno, restrito ou confidencial e o que pode trafegar para o Claude", "SI + Jurídico", "S1–S2", "Matriz de classificação aprovada"],
    ["Acesso técnico", "usuário de serviço somente leitura e views dedicadas por frente; credencial guardada em cofre de senhas", "TI", "S2", "Views e credencial em cofre"],
    ["Construção do conector", "conector MCP no ambiente de dev da Cia; onde não houver API, exportação agendada para CSV em 06-dados", "TI / dados", "S2", "Conector em dev"],
    ["Configuração no Claude Enterprise", "administrador da organização habilita o conector só para os 5 usuários, com SSO e logs de auditoria", "Admin Claude (TI)", "S2–S3", "Conector restrito ao grupo"],
    ["Teste e reconciliação", "rodar as consultas de cada frente em homologação e conferir os números contra o BI oficial", "Gerente regional", "S3", "Relatório de reconciliação"],
    ["Envio para o Orca (G1)", "conector, repositório e infraestrutura entram na esteira de validação (próximo slide)", "TI + SI", "S3–S4", "Pedido de liberação aberto"],
  ], "O tipo de conector (API, banco, exportação) depende da arquitetura de dados da Allos e será fechado no kickoff técnico.");

  // ---------- 5d. Etapa 0B — Orca ----------
  await stepSlide("Passo a passo · validação no Orca e liberação em produção", "Etapa 0B · Fundação técnica", [
    ["Alinhar o processo com SI", "critérios de aprovação, severidades que bloqueiam, prazos e quem aprova cada gate", "Diretor + SI", "S1", "Checklist de liberação"],
    ["Separar ambientes", "dev (dados mascarados), homologação e produção; repositório Git para conectores, scripts e skills .md", "TI", "S1–S2", "3 ambientes + repositório"],
    ["Registrar ativos no Orca", "conta cloud que hospeda os conectores, repositório de código e cofre de segredos", "SI", "S2", "Ativos monitorados"],
    ["Varredura", "vulnerabilidades, configuração, segredos expostos, permissões excessivas e exposição de dados sensíveis", "SI", "S3", "Relatório de achados"],
    ["Tratar achados", "corrigir críticos e altos; riscos residuais aceitos formalmente pelo responsável", "TI", "S3–S4", "Achados zerados ou aceitos"],
    ["Aprovação na gestão de mudanças", "SI e TI aprovam a mudança com evidências da varredura e dos testes", "SI + TI", "S4", "Mudança aprovada"],
    ["Liberação em produção", "deploy do conector, Claude Enterprise apontado para produção e teste rápido de funcionamento", "TI", "S4", "G1 liberado"],
    ["Ciclo contínuo", "todo app, skill ou conector novo repete a esteira (G2 a G4); Orca monitora o ambiente em produção", "SI + gerente regional", "Contínuo", "Esteira padrão da regional"],
  ], "Escopo exato da varredura depende de como o Orca está configurado na Allos — a validar com Segurança da Informação na semana 1.");
'''
ins_before("// ---------- 6. Frente 0 — princípios ----------", etapa0)

# ---- Frente 0 passo a passo ----
f0 = r'''// ---------- 8b. Frente 0 — passo a passo ----------
  await stepSlide("Passo a passo · segundo cérebro", "Frente 0 · Segundo cérebro", [
    ["Repositório mestre", "criar a estrutura de pastas no SharePoint/Git com permissões por pasta", "Diretor + TI", "S1", "Estrutura publicada"],
    ["Templates .md", "um modelo por tipo de nota (contrato, processo, visita, decisão, shopping) com o cabeçalho padrão", "Diretor", "S1", "Templates em 00-governanca"],
    ["Governança e glossário", "papéis, ritmos, alçadas e siglas da regional", "Gerente regional", "S1–S2", "Pasta 00 completa"],
    ["Fichas dos shoppings", "dados cadastrais, mix, metas e plano anual, puxados pelo conector quando disponível", "Pontos focais", "S2–S3", "Uma ficha por shopping"],
    ["Migração do conhecimento", "apresentações, planilhas e manuais convertidos em .md com o Claude, com status rascunho", "Todos", "S2–S4", "Notas em rascunho"],
    ["Curadoria", "dono de cada pasta valida e muda o status para validado; diretor revisa uma amostra", "Donos de pasta", "S3–S4", "Base v1 validada"],
    ["Projects no Claude Enterprise", "um Project base e um por frente, carregados só com conteúdo validado", "Gerente regional", "S3", "Projects configurados"],
    ["Rotina e portabilidade", "captura semanal, log de decisões; na S12 rodar 2 apps em outro modelo só com os .md", "Gerente regional", "S5–S12", "Teste de portabilidade"],
  ]);
'''
ins_before("// ---------- 9. Frente 1 — gestão à vista ----------", f0)

f1 = r'''// ---------- 10b. Frente 1 — passo a passo ----------
  await stepSlide("Passo a passo · gestão à vista integrada", "Frente 1 · Gestão à vista integrada", [
    ["Dicionário de indicadores", "partir da lista da visita estruturada: definição, fórmula, fonte, meta e dono de cada indicador", "Gerente regional", "S2", "Dicionário em .md"],
    ["Indicador × base de dados", "ligar cada indicador à tabela ou view acessada pelo conector", "TI + gerente regional", "S2", "Mapa de origem"],
    ["Pipeline de atualização", "tarefa agendada extrai, padroniza em CSV (06-dados) e checa consistência antes de publicar", "TI / dados", "S3–S4", "CSVs atualizados"],
    ["Painel do shopping", "semáforo por indicador vs. meta e lista de ações abertas com dono e prazo", "Gerente regional", "S4", "Painel nível shopping"],
    ["Visões RMR e regional", "comparativo entre shoppings, ranking, tendências e scorecard do teste", "Gerente regional", "S5", "Painéis RMR e regional"],
    ["Visita estruturada", "roteiro e checklist gerados do painel; registro em .md; ações voltam para o painel", "Gerente regional", "S5", "Kit de visita"],
    ["Esteira de segurança (G2)", "validação no Orca e liberação em produção; compartilhamento com os shoppings", "TI + SI", "S5–S6", "Painéis em produção"],
    ["Primeira RMR automática", "material pré-montado 3 dias antes; alertas diários ligados; ajustes pós-RMR", "Gerente regional", "S6–S7", "RMR rodando no modelo"],
  ]);
'''
ins_before("// ---------- 11. Frente 2 ----------", f1)

f2 = r'''// ---------- 11b. Frente 2 — passo a passo ----------
  await stepSlide("Passo a passo · gestão de renovações", "Frente 2 · Apps de processo", [
    ["Carteira de vencimentos", "extrair pelo conector os contratos que vencem em 18 meses, por shopping", "Ponto focal de negócios", "S2", "Carteira consolidada"],
    ["Regras no Project", "carregar política de renovação, alçadas e a skill de renovação em .md", "Ponto focal de negócios", "S2", "Project de renovações"],
    ["Classificação das lojas", "mix, quadrante e desempenho (vendas, custo de ocupação, inadimplência)", "Ponto focal de negócios", "S3", "Lojas classificadas"],
    ["Estratégia por loja", "janela de negociação, argumentos e leasing spread alvo", "IA + negócios", "S3–S4", "Estratégia por contrato"],
    ["Validação com o shopping", "gerente do shopping revisa as estratégias; ajustes na skill", "Gerentes dos shoppings", "S4", "Estratégias validadas"],
    ["Proposta e pauta", "minuta de proposta e pauta de negociação dentro das alçadas", "Ponto focal de negócios", "S5", "Minutas prontas"],
    ["Esteira de segurança (G2)", "validação no Orca e liberação em produção; alertas de janela ligados", "TI + SI", "S5–S6", "App em produção"],
    ["Rotina mensal", "atualização da carteira e leasing spread acompanhado no painel", "Ponto focal de negócios", "S6+", "Renovações no painel"],
  ]);

  // ---------- 11c. Frente 2 — auditoria ----------
  await stepSlide("Passo a passo · radar de auditoria", "Frente 2 · Apps de processo", [
    ["Reunir referências", "políticas, checklists e relatórios das últimas auditorias", "Ponto focal de operações", "S4", "Pasta de referências"],
    ["Requisitos em .md", "um requisito por item, com o critério de evidência que o comprova", "Ponto focal de operações", "S4–S5", "Base de requisitos"],
    ["Mapa de evidências", "onde cada evidência fica e quem a gera em cada shopping", "Ponto focal de operações", "S5", "Mapa por shopping"],
    ["Construção do radar", "cruza requisito × evidência e gera risco, dono e prazo de cada pendência", "IA + operações", "S5–S6", "Radar em homologação"],
    ["Validação", "conferir o radar com a auditoria interna em um shopping", "Operações + auditoria", "S6", "Taxa de acerto medida"],
    ["Esteira de segurança (G3)", "validação no Orca e liberação em produção", "TI + SI", "S7", "App em produção"],
    ["Expansão", "todos os shoppings da regional; alertas 30, 15 e 7 dias antes do vencimento", "Ponto focal de operações", "S7–S8", "Radar regional"],
    ["Integração", "pendências entram no painel de gestão à vista e na pauta da RMR", "Gerente regional", "S8", "Pendências no painel"],
  ]);

  // ---------- 11d. Frente 2 — manual ----------
  await stepSlide("Passo a passo · manual operacional", "Frente 2 · Apps de processo", [
    ["Priorização", "listar os processos e escolher os 20 mais usados ou de maior risco", "Ponto focal de operações", "S3", "Top 20 definido"],
    ["Coleta", "reunir as versões vigentes de normas e procedimentos", "Ponto focal de operações", "S3–S4", "Documentos vigentes"],
    ["Conversão", "um processo por arquivo .md, com dono, versão e data", "IA + operações", "S4–S6", "20 processos em .md"],
    ["Validação", "cada dono de processo confirma o conteúdo", "Donos dos processos", "S5–S7", "Processos validados"],
    ["Assistente de consulta", "responde citando a seção e diz quando não há fonte, sem inventar", "Ponto focal de operações", "S6–S7", "Assistente em homologação"],
    ["Teste com usuários", "30 perguntas reais dos gerentes dos shoppings; medir taxa de acerto", "Gerentes dos shoppings", "S8", "Taxa de acerto"],
    ["Esteira de segurança (G4)", "validação no Orca e liberação em produção", "TI + SI", "S8–S9", "Manual em produção"],
    ["Melhoria contínua", "lacunas e conflitos viram backlog de revisão dos processos", "Ponto focal de operações", "S9+", "Backlog de revisão"],
  ]);
'''
ins_before("// ---------- 12. Frente 3 ----------", f2)

f3 = r'''// ---------- 12b. Frente 3 — protocolo ----------
  await stepSlide("Passo a passo · protocolo comum dos pilotos", "Frente 3 · Piloto", [
    ["Shopping e dono", "escolher o shopping piloto e o dono de cada um dos 4 apps", "Diretor", "S3", "Pilotos designados"],
    ["Métrica e baseline", "definir métrica e meta; medir 3 semanas no modelo atual", "Dono do app", "S4–S6", "Baseline registrado"],
    ["Dados de entrada", "preparar a entrada pelo conector ou pasta (ex.: PDFs dos boletos por mês)", "Dono do app + TI", "S4–S5", "Entrada disponível"],
    ["Configuração", "skill .md, Project e fontes de cada app", "Dono do app", "S5–S6", "App em dev"],
    ["Back-test", "rodar com casos passados de resultado conhecido (ex.: boletos com erros já identificados)", "Dono do app", "S6", "Taxa de acerto e falsos positivos"],
    ["Esteira de segurança (G3)", "validação no Orca e liberação em produção", "TI + SI", "S7", "Apps em produção"],
    ["Operação", "6 semanas com check-in semanal; registrar acertos, erros e tempo ganho", "Dono do app", "S7–S12", "Log do piloto"],
    ["Decisão", "escalar, ajustar ou parar, com plano de replicação para os demais shoppings", "Diretor", "S13", "Decisão por app"],
  ]);

  // ---------- 12c. Frente 3 — especificação ----------
  {
    const s = content("O que cada piloto recebe, faz e entrega", "Frente 3 · Piloto", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 12, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "App", options: hdr }, { text: "Entrada", options: hdr }, { text: "O que faz", options: hdr }, { text: "Saída", options: hdr }, { text: "Validação humana", options: hdr }],
      [c("Radar de varejo", { bold: true, color: T.teal9 }), c("Vacância e mix (conector); pesquisa de marcas"), c("Prioriza marcas por aderência ao cluster e ao espaço vago"), c("Pipeline de leads"), c("Negócios qualifica antes do contato")],
      [c("Radar de mídia", { bold: true, color: T.teal9 }), c("Inventário de mídia, calendário, histórico de receita"), c("Mapeia e prioriza anunciantes e patrocínios"), c("Pipeline de mídia"), c("Marketing aprova a abordagem")],
      [c("Otimizador de obras", { bold: true, color: T.teal9 }), c("Cronogramas, projetos, checklist regulatório local"), c("Antecipa gargalos e pendências de cada obra"), c("Cronograma com alertas"), c("Operações confirma com o lojista")],
      [c("Auditoria de boletos", { bold: true, color: T.teal9 }), c("PDFs do mês por pasta + histórico por LUC/rubrica"), c("Aprende o padrão de cobrança e gera nota de risco por loja"), c("Lista de pendências"), c("Negócios/financeiro confirma antes de cobrar")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [2.0, 2.9, 3.1, 1.8, 2.3], rowH: [0.45, 0.95, 0.95, 0.95, 0.95],
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.05, 0.1, 0.05, 0.1] });
    s.addText("Regra comum: nenhum app age sozinho sobre lojista ou contrato — toda saída é recomendação revisada por uma pessoa.",
      { x: 0.6, y: 6.25, w: 12, h: 0.4, fontSize: 13, italic: true, color: T.teal9, margin: 0, isTextBox: true });
  }
'''
ins_before("// ---------- 13. Frente 4 ----------", f3)

f4 = r'''// ---------- 13b. Frente 4 — passo a passo ----------
  await stepSlide("Passo a passo · gestão de cláusulas", "Frente 4 · Contratos em .md", [
    ["Regras de uso dos contratos", "validar com Jurídico e SI o uso de contratos no Claude Enterprise (pré-requisito)", "Diretor + Jurídico + SI", "S1–S2", "Regras aprovadas"],
    ["Inventário", "contratos e aditivos por shopping; separar os escaneados que precisam de OCR", "Ponto focal de negócios", "S2", "Lista de contratos"],
    ["Template do contrato", "campos-chave no cabeçalho e texto integral separado por cláusula", "Negócios + Jurídico", "S2", "Template .md"],
    ["Conversão piloto", "converter o shopping piloto com o Claude, com status rascunho", "Ponto focal de negócios", "S3–S4", "Piloto convertido"],
    ["Conferência humana", "100% dos campos críticos e amostra do texto; medir taxa de erro e ajustar", "Negócios + Jurídico", "S4–S5", "Taxa de erro medida"],
    ["Ferramenta + G2", "busca, comparação e alertas (reajuste, renovação, exclusividade, raio); validação no Orca", "Negócios + TI + SI", "S5–S6", "Ferramenta em produção"],
    ["Onda regional", "demais shoppings em lotes, com a mesma conferência", "Ponto focal de negócios", "S6–S11", "Regional convertida"],
    ["Índice e rotina", "índice em 06-dados ligado a renovações, auditoria e boletos; novos aditivos entram no fluxo", "Ponto focal de negócios", "S12", "Índice completo"],
  ]);
'''
ins_before("// ---------- 14. Frente 5 ----------", f4)

f5 = r'''// ---------- 14b. Frente 5 — passo a passo ----------
  await stepSlide("Passo a passo · treinamento em IA", "Frente 5 · Treinamento em IA", [
    ["Diagnóstico", "autoavaliação de competências em IA de cada pessoa (baseline do indicador de pessoas)", "Diretor", "S1", "Baseline de competências"],
    ["Fundamentos 1", "como um LLM funciona, limites, alucinação, classificação de dados e uso permitido", "Diretor", "S1", "Sessão de 90 min"],
    ["Fundamentos 2", "prompts, Projects e segundo cérebro; exercício: converter um documento próprio em .md", "Diretor", "S2–S3", "1 nota por pessoa"],
    ["Prática por função", "cada ponto focal constrói e opera o app da sua frente, em par com o diretor", "Pontos focais", "S3–S8", "1 app em uso por pessoa"],
    ["Clínica semanal", "1 h para dúvidas; biblioteca de prompts e casos em 07-treinamento", "Gerente regional", "S3–S12", "Biblioteca de casos"],
    ["Avançado", "skills .md, tarefas agendadas, painéis, avaliação de qualidade e a esteira dev → Orca → produção", "Diretor", "S8–S12", "Automação sem intervenção"],
    ["Formação externa", "Asimov para os gerentes e MIT para o diretor; conteúdo trazido para o time", "Diretor", "Em paralelo", "Sujeito à aprovação"],
    ["Demo day", "cada pessoa apresenta um caso com ganho medido; autoavaliação final; multiplicadores definidos", "Todos", "S13", "Casos e multiplicadores"],
  ]);
'''
ins_before("// ---------- 15. Cronograma ----------", f5)

# ---- updates elsewhere ----
rep('''      s.addText("Dono: " + fr[i][4], { x: x + 0.3, y: y + 1.8, w: 3.3, h: 0.35, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
    }''', '''      s.addText("Dono: " + fr[i][4], { x: x + 0.3, y: y + 1.8, w: 3.3, h: 0.35, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
    }
    s.addText([{ text: "Etapa 0 · pré-requisito de todas as frentes: ", options: { bold: true, color: T.teal } }, { text: "conexão com a base de dados da companhia e validação no Orca antes de liberar em produção.", options: { color: T.text } }],
      { x: 0.6, y: 6.6, w: 12.1, h: 0.32, fontSize: 13, margin: 0, isTextBox: true });''')

# cronograma
rep('''      ["0 · Segundo cérebro", [[1, 4, T.teal], [5, 13, T.teal5, "manutenção"]]],''',
    '''      ["Etapa 0 · Dados + Orca", [[1, 4, T.teal9, "conexão e G1"], [5, 13, T.teal5, "esteira contínua"]]],
      ["0 · Segundo cérebro", [[1, 4, T.teal], [5, 13, T.teal5, "manutenção"]]],''')
rep('''      ["Teste regional", [[1, 3, T.warm, "baseline"], [4, 12, T.teal9, "medição"], [13, 13, T.orange]]],
    ];''', '''      ["Teste regional", [[1, 3, T.warm, "baseline"], [4, 12, T.teal9, "medição"], [13, 13, T.orange]]],
      ["Gates Orca → produção", []],
    ];''')
rep("const y = y0 + 0.7 + r * 0.47;", "const y = y0 + 0.7 + r * 0.405;")
rep("bold: r === 8, color: T.text", "bold: r === 9 || r === 10, color: T.text")
rep('''        if (t) s.addText(t, { x: x0 + (a - 1) * wk, y: y + 0.04, w: (b - a + 1) * wk, h: 0.3,''',
    '''        if (t) s.addText(t, { x: x0 + (a - 1) * wk, y: y + 0.04, w: (b - a + 1) * wk, h: 0.3,''')
rep('''    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 6.62, w: 0.25, h: 0.2,''',
    '''    [[4, "G1"], [6, "G2"], [7, "G3"], [9, "G4"]].forEach(([w, gl]) => {
      const gy = y0 + 0.7 + 10 * 0.405;
      s.addShape(pres.shapes.DIAMOND, { x: x0 + (w - 1) * wk + 0.17, y: gy + 0.02, w: 0.36, h: 0.36, fill: { color: T.red }, line: { color: T.red } });
      s.addText(gl, { x: x0 + (w - 1) * wk + 0.17, y: gy + 0.02, w: 0.36, h: 0.36, fontSize: 8, bold: true, color: T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 6.62, w: 0.25, h: 0.2,''')
rep("h: 4.3, fill: { color: T.orange, transparency: 82 }", "h: 4.5, fill: { color: T.orange, transparency: 82 }")
rep("y: y0 + 4.98, w: 4 * wk, h: 0.28", "y: y0 + 5.12, w: 4 * wk, h: 0.25")

# marcos
rep('"Fontes de dados mapeadas"', '"Base de dados conectada e liberada no Orca (G1)"')
rep('"Pilotos operacionais rodando"', '"Apps liberados em produção (G2 e G3)"')

# governança
rep('''      "Decisões registradas no segundo cérebro",''', '''      "Decisões registradas no segundo cérebro",
      "Nada vai para produção sem aprovação no Orca",''')

# riscos
rep('''      [c("Só 5 licenças no piloto", { bold: true }), c("Shoppings consomem painéis e materiais publicados, sem precisar de licença")],''',
    '''      [c("Só 5 licenças no piloto", { bold: true }), c("Shoppings consomem painéis e materiais publicados, sem precisar de licença")],
      [c("Liberação de segurança atrasa o cronograma", { bold: true }), c("SI no kickoff da S1; gates planejados; trabalho segue em dev com dados mascarados enquanto aguarda")],''')
rep("colW: [4.0, 8.1], rowH: 0.6,", "colW: [4.0, 8.1], rowH: 0.54,")

# próximos passos
rep('''      "Definir a regional de comparação",''', '''      "Definir a regional de comparação",
      "Confirmar com SI o processo de liberação no Orca",''')
rep('"Inventário de fontes de dados e contratos"', '"Kickoff técnico com TI e SI: base de dados e Orca"')

open(p, 'w').write(s)
print("ok")
