const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/mnt/skills/public/pptx/scripts/apply_theme.js");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const THEME = {
  name: "Allos Guarda Alta",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "0D454A", lt1: "F4F1EC", dk2: "00616F", lt2: "BFD8D5",
    accent1: "6CC680", accent2: "368C82", accent3: "0F4F55", accent4: "F08C86",
    accent5: "5E2C2C", accent6: "FFD9D6", hlink: "6CC680", folHlink: "BFD8D5",
  },
};

async function icon(name, color) {
  const Comp = fa[name];
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "Guarda Alta — Resumo";
  pres.author = "Allos";
  pres.lang = "pt-BR";
  const C = pres.SchemeColor;
  const BG = THEME.colors.dk1, CARD = THEME.colors.accent3, ACC = THEME.colors.accent1;
  const TXT = THEME.colors.lt1, MUT = THEME.colors.lt2;

  // Layouts
  pres.defineSlideMaster({
    title: "COVER", background: { color: THEME.colors.dk2 },
    objects: [
      { text: { text: "ALLOS", options: { x: 11.0, y: 0.45, w: 1.9, h: 0.5, fontSize: 24, bold: true, color: TXT, align: "right", charSpacing: 4, margin: 0 } } },
      { text: { text: "CONVENÇÃO DE GERENTES E SUPERINTENDENTES", options: { x: 0.8, y: 6.55, w: 9, h: 0.4, fontSize: 13, bold: true, color: ACC, charSpacing: 2, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.1, w: 10, h: 1.4, fontSize: 66, bold: true, color: TXT, margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 3.6, w: 10, h: 0.8, fontSize: 28, color: TXT, margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: BG },
    slideNumber: { x: 12.3, y: 6.9, w: 0.5, h: 0.3, fontSize: 10, color: MUT, bold: true, align: "right" },
    objects: [
      { text: { text: "ALLOS", options: { x: 11.0, y: 0.4, w: 1.9, h: 0.4, fontSize: 18, bold: true, color: TXT, align: "right", charSpacing: 3, margin: 0 } } },
      { placeholder: { options: { name: "eyebrow", type: "body", x: 0.6, y: 0.42, w: 9, h: 0.3, fontSize: 11, bold: true, color: ACC, charSpacing: 2, margin: 0 }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.72, w: 10.3, h: 0.7, fontSize: 30, bold: true, color: TXT, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "footer", type: "body", x: 0.6, y: 6.78, w: 11.4, h: 0.5, fontSize: 11, color: MUT, margin: 0, valign: "middle" }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CLOSE", background: { color: THEME.colors.dk2 },
    slideNumber: { x: 12.3, y: 6.9, w: 0.5, h: 0.3, fontSize: 10, color: MUT, bold: true, align: "right" },
    objects: [
      { text: { text: "ALLOS", options: { x: 11.0, y: 0.4, w: 1.9, h: 0.4, fontSize: 18, bold: true, color: TXT, align: "right", charSpacing: 3, margin: 0 } } },
      { placeholder: { options: { name: "eyebrow", type: "body", x: 0.6, y: 0.42, w: 9, h: 0.3, fontSize: 11, bold: true, color: ACC, charSpacing: 2, margin: 0 }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.72, w: 10.3, h: 0.7, fontSize: 30, bold: true, color: TXT, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "footer", type: "body", x: 0.6, y: 6.78, w: 11.4, h: 0.5, fontSize: 12, bold: true, color: ACC, margin: 0, valign: "middle" }, text: "" } },
    ],
  });

  // Helpers
  const icons = {};
  async function ic(name) { if (!icons[name]) icons[name] = await icon(name, ACC); return icons[name]; }

  async function card(slide, { x, y, w, h, icon: iconName, head, paras, note, warn }) {
    slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: CARD }, line: { color: CARD }, rectRadius: 0.12, objectName: "card " + head });
    const pad = 0.28;
    let cy = y + pad;
    if (iconName) {
      slide.addImage({ data: await ic(iconName), x: x + pad, y: cy, w: 0.38, h: 0.38, objectName: "ícone " + head });
      cy += 0.5;
    }
    slide.addText(head, { x: x + pad, y: cy, w: w - 2 * pad, h: 0.55, fontSize: 16, bold: true, color: ACC, margin: 0, valign: "top", isTextBox: true, objectName: "título " + head });
    cy += 0.55;
    const runs = [];
    paras.forEach((p, i) => {
      const last = i === paras.length - 1 && !note;
      if (Array.isArray(p)) {
        runs.push({ text: p[0] + " ", options: { bold: true, color: TXT } });
        runs.push({ text: p[1], options: { color: TXT, breakLine: !last, paraSpaceAfter: 6 } });
      } else {
        runs.push({ text: p, options: { color: TXT, breakLine: !last, paraSpaceAfter: 6 } });
      }
    });
    if (note) runs.push({ text: note, options: { color: MUT, paraSpaceAfter: 6 } });
    let bodyH = h - (cy - y) - pad - (warn ? 1.1 : 0);
    slide.addText(runs, { x: x + pad, y: cy, w: w - 2 * pad, h: bodyH, fontSize: 12.5, margin: 0, valign: "top", isTextBox: true, objectName: "texto " + head, lineSpacingMultiple: 1.05 });
    if (warn) {
      slide.addShape(pres.ShapeType.roundRect, { x: x + pad, y: y + h - pad - 1.0, w: w - 2 * pad, h: 1.0, fill: { color: THEME.colors.accent5 }, line: { color: THEME.colors.accent5 }, rectRadius: 0.08, objectName: "alerta" });
      slide.addText(warn, { x: x + pad + 0.15, y: y + h - pad - 1.0, w: w - 2 * pad - 0.3, h: 1.0, fontSize: 12, bold: true, color: THEME.colors.accent6, margin: 0, valign: "middle", isTextBox: true, objectName: "texto alerta" });
    }
  }

  async function row(slide, { y, h, icon: iconName, head, text, textSize }) {
    slide.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 12.1, h, fill: { color: CARD }, line: { color: CARD }, rectRadius: 0.12, objectName: "linha " + head });
    slide.addImage({ data: await ic(iconName), x: 0.9, y: y + h / 2 - 0.25, w: 0.5, h: 0.5, objectName: "ícone " + head });
    slide.addText(head, { x: 1.7, y, w: 2.6, h, fontSize: 18, bold: true, color: ACC, margin: 0, valign: "middle", isTextBox: true, objectName: "título " + head });
    slide.addText(text, { x: 4.5, y, w: 7.9, h, fontSize: textSize || 16, color: TXT, margin: 0, valign: "middle", isTextBox: true, objectName: "texto " + head });
  }

  const colsGeom = (n) => { const gap = 0.3, x0 = 0.6, W = 12.1; const w = (W - gap * (n - 1)) / n; return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (w + gap), w })); };
  const TOP = 1.6, CARD_H = 5.0;

  // ---------- 1. Cover
  pres.addSection({ title: "Abertura" });
  let s = pres.addSlide({ masterName: "COVER", sectionTitle: "Abertura" });
  s.addText("Guarda Alta", { placeholder: "title" });
  s.addText("Prevenção de riscos e crises no shopping", { placeholder: "body" });

  // ---------- 2. Três fatores (kept)
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Abertura" });
  s.addText("RISCOS SIMULTÂNEOS", { placeholder: "eyebrow" });
  s.addText("Três fatores que aumentam o risco ao mesmo tempo", { placeholder: "title" });
  await row(s, { y: 1.75, h: 1.35, icon: "FaUsers", head: "Mais movimento", text: "Mais público, estoques, entregas e serviços pressionam a operação." });
  await row(s, { y: 3.3, h: 1.35, icon: "FaUserPlus", head: "Mais equipes novas", text: "Mais temporários e terceiros no shopping e nas lojas. Orientar sobre as rotinas locais antes de iniciar e acompanhar a execução." });
  await row(s, { y: 4.85, h: 1.55, icon: "FaSearch", head: "Risco de redução da atenção", text: "A rotina e o clima de festas podem reduzir a atenção. Reforçar supervisão em campo, cumprimento dos procedimentos e reporte de desvios." });
  s.addText([{ text: "Esses fatores exigem equipes preparadas e atenção redobrada aos sistemas, acessos e rotinas do shopping.", options: { bold: true, color: ACC } }], { placeholder: "footer" });

  // ---------- 3. Infraestrutura
  pres.addSection({ title: "Sistemas e riscos" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Sistemas e riscos" });
  s.addText("RECURSOS ESSENCIAIS", { placeholder: "eyebrow" });
  s.addText("Infraestrutura sob maior demanda", { placeholder: "title" });
  let g = colsGeom(3);
  await card(s, { ...g[0], y: TOP, h: CARD_H, icon: "FaTint", head: "Água, drenagem e abastecimento", paras: [
    "Calhas, condutores e bombas de drenagem: conferir limpeza e funcionamento.",
    "Rever pontos com histórico de infiltração ou alagamento e o plano de resposta.",
    "Conhecer autonomia e reposição de água, preservando a reserva de incêndio.",
    "Confirmar recursos de contingência e suporte para falhas que possam interromper a operação." ] });
  await card(s, { ...g[1], y: TOP, h: CARD_H, icon: "FaBolt", head: "Energia", paras: [
    "Avaliar cargas adicionais, quadros e QGBT (quadro geral de distribuição elétrica).",
    "Tratar aquecimento anormal identificado na termografia, desarmes e reparos provisórios." ] });
  await card(s, { ...g[2], y: TOP, h: CARD_H, icon: "FaSnowflake", head: "Climatização", paras: [
    "Acompanhar desempenho no pico, condensação e chamados recorrentes.",
    "Verificar setpoint, approach e corrente dos chillers.",
    "Partida e desligamento acompanham o horário da operação." ] });
  s.addText("Preparar a resposta aos pontos vulneráveis antes que a chuva comprometa a operação. Parâmetros e liberação seguem projeto, fabricante e plano técnico local.", { placeholder: "footer" });

  // ---------- 4. Incêndio
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Sistemas e riscos" });
  s.addText("DETECÇÃO, COMBATE E NOVAS EXPOSIÇÕES", { placeholder: "eyebrow" });
  s.addText("Risco de incêndio", { placeholder: "title" });
  await card(s, { ...g[0], y: TOP, h: CARD_H, icon: "FaFireExtinguisher", head: "Proteção contra incêndio", paras: [
    ["Alarme e central:", "acionamentos exigem verificação e registro do retorno à central, conforme o procedimento. A liderança conhece falhas e limitações."],
    ["Combate:", "bombas, válvulas, rede e reserva de água em condição de uso. Acompanhar pendências e confirmar a correção."],
    ["Saídas e pessoas:", "rotas livres e proteção acessível. Brigada e equipes conhecem as funções previstas no plano de emergência."] ] });
  await card(s, { ...g[1], y: TOP, h: CARD_H, icon: "FaMotorcycle", head: "Motos e bicicletas elétricas", paras: [
    ["Estoque e recarga:", "mapear lojas que vendem, armazenam ou recarregam. Avaliar estoque e recarga, preservando rotas de saída."],
    ["Proteção e resposta:", "proteção e recursos adequados às baterias presentes, com validação técnica. Alarme, proteção das pessoas e acionamento do socorro seguem o plano de emergência."] ],
    note: "Especificação e quantidade de equipamentos dependem da avaliação técnica do risco." });
  await card(s, { ...g[2], y: TOP, h: CARD_H, icon: "FaFire", head: "Cozinhas e operação a quente", paras: [
    ["Exaustão e limpeza:", "coifas, filtros, dutos e exaustores. Pendências de limpeza ou funcionamento exigem avaliação e tratamento."],
    ["Gás e proteção:", "proteção, identificação e acesso aos registros de gás de cada loja. Equipe conhece os pontos de corte. Mudanças exigem análise técnica."],
    ["Correção e retomada:", "acompanhar desvios das inspeções e condições de fechamento. Restrição e retorno seguem a matriz e a circular vigentes."] ] });
  s.addText("A proteção precisa funcionar quando necessária. Indisponibilidades exigem tratamento; a correção precisa atender ao risco identificado e ter confirmação técnica.", { placeholder: "footer" });

  // ---------- 5. Ocupação
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Sistemas e riscos" });
  s.addText("MUDANÇAS NA OCUPAÇÃO E ACÚMULO DE MATERIAIS", { placeholder: "eyebrow" });
  s.addText("Lojas temporárias, eventos e áreas de serviço", { placeholder: "title" });
  g = colsGeom(2);
  await card(s, { ...g[0], y: TOP, h: CARD_H, icon: "FaStore", head: "Lojas temporárias, estoques e eventos", paras: [
    ["Lojas temporárias:", "lojas e depósitos temporários passam por vistoria da brigada antes da ocupação, com elétrica, detecção, proteção e saídas adequadas. Não liberar por pressa ou pressão financeira."],
    ["Estoque e layout:", "caixas e mercadorias preservam saídas e proteção contra incêndio. Avaliar depósitos extras e cargas adicionais."],
    ["Áreas alinhadas:", "Marketing, Comercial e Operações alinham antes dos compromissos e montagens. Organizar filas, carga e descarga nas docas, preservando circulação e saídas."] ],
    warn: "Nenhuma loja, depósito temporário ou evento poderá ser liberado para ocupação ou funcionamento sem validação prévia de Operações e cumprimento dos requisitos de segurança." });
  await card(s, { ...g[1], y: TOP, h: CARD_H, icon: "FaRecycle", head: "Resíduos e áreas de serviço", paras: [
    ["Acúmulo de materiais:", "papelão e resíduos nas docas e depósitos precisam de coleta e armazenamento compatíveis com a demanda."],
    ["Compactadora e coleta:", "conferir funcionamento e capacidade de atendimento. Avaliar alternativa de coleta diante de falhas para evitar acúmulo."],
    ["Rotas e acesso:", "materiais não devem bloquear corredores de serviço, equipamentos de segurança ou acesso de socorro."] ],
    note: "Falhas na coleta e acúmulo de materiais precisam chegar à gestão antes de comprometer a operação." });
  s.addText("Ocupação, estoque e resíduos mudam o risco do shopping: validar antes, preservar saídas e acessos de socorro.", { placeholder: "footer" });

  // ---------- 6. Segurança
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Sistemas e riscos" });
  s.addText("SINAIS QUE EXIGEM ATENÇÃO E SEGURANÇA PATRIMONIAL", { placeholder: "eyebrow" });
  s.addText("Equipamentos, acessos e equipes", { placeholder: "title" });
  await card(s, { ...g[0], y: TOP, h: CARD_H, icon: "FaVideo", head: "Equipamentos, acessos e comunicação", paras: [
    ["Escadas e elevadores:", "ruídos, vibrações, falhas repetidas e manutenção pendente exigem avaliação técnica. Paradas afetam circulação e acessibilidade."],
    ["Estacionamento:", "cancelas, insumos, máquinas de pagamento e filas precisam de suporte e contingência. Preservar saída do público e entrada de socorro."],
    ["CFTV e rádio:", "câmeras, gravação e comunicação apoiam a resposta. Conhecer falhas, pontos sem cobertura e alternativas disponíveis."] ],
    note: "Equipe preparada para proteger o público e acionar apoio. Resgates e intervenções somente por profissionais habilitados." });
  await card(s, { ...g[1], y: TOP, h: CARD_H, icon: "FaLock", head: "Fechamento, acessos e equipes", paras: [
    ["Fechamento seguro:", "conferir fechamento e permanência indevida. Reforçar atenção aos acessos restritos, forros e áreas técnicas, conforme o procedimento local."],
    ["Furtos e roubos:", "reforçar rondas e monitoramento nos pontos vulneráveis. Sinais suspeitos e ocorrências exigem acionamento e registro conforme o procedimento."],
    ["Temporários e terceiros:", "orientar antes do início sobre acessos, riscos e quem acionar. Treinar por função e acompanhar mais de perto a aplicação das rotinas, no shopping e nas lojas."] ],
    note: "Potencial de crise exige comunicação pronta à regional. Proteção e socorro seguem em paralelo." });
  s.addText("Conhecer falhas e limitações dos equipamentos e manter equipes orientadas é o que permite proteger o público e acionar apoio a tempo.", { placeholder: "footer" });

  // ---------- 7. Prontidão
  pres.addSection({ title: "Resposta e liderança" });
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Resposta e liderança" });
  s.addText("RECURSOS DE RESPOSTA E PLANEJAMENTO POR OFÍCIOS", { placeholder: "eyebrow" });
  s.addText("Prontidão para a resposta", { placeholder: "title" });
  g = colsGeom(3);
  await card(s, { ...g[0], y: TOP, h: CARD_H, icon: "FaBoxOpen", head: "Prateleira vermelha", paras: [
    ["O que é:", "estoque de peças essenciais para reduzir a interrupção dos sistemas críticos."],
    ["O que conferir:", "saldo físico, compatibilidade com o equipamento e condição de uso."],
    ["Reposição planejada:", "repor peças utilizadas. Conferir insumos para gerador, no-breaks e suporte técnico."] ],
    note: "Peças de reposição reduzem a parada. Equipamentos de contingência apoiam a resposta." });
  await card(s, { ...g[1], y: TOP, h: CARD_H, icon: "FaClipboardCheck", head: "Kit crise pronto para mobilização", paras: [
    ["Inventário e testes:", "conferir itens e testes previstos no Book. Geradores, bombas, no-breaks e demais recursos de contingência em condição de uso."],
    ["Extratores:", "avaliar capacidade e funcionamento. Prever alternativa de apoio em caso de falha ou insuficiência, conforme avaliação técnica."],
    ["Apoio disponível:", "fornecedores e contatos atualizados. Conhecer os recursos da regional, responsáveis e condições para mobilizá-los."] ] });
  await card(s, { ...g[2], y: TOP, h: CARD_H, icon: "FaCar", head: "Apoio de trânsito e policiamento", paras: [
    ["Apoio solicitado:", "encaminhar ofícios aos órgãos de trânsito e policiamento para o apoio previsto. Alinhar acessos, entorno, horários e pontos de maior concentração."],
    ["Dados do ofício:", "data, local e horários; previsão de movimento e impacto nas vias; apoio solicitado e acessos de emergência; contato responsável pelo shopping."] ],
    note: "Confirmar recebimento, retorno e contatos antes da operação planejada." });
  s.addText("Antecipar necessidades e confirmar prontidão. Compras e mobilização seguem as alçadas vigentes.", { placeholder: "footer" });

  // ---------- 8. Comunicação
  s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Resposta e liderança" });
  s.addText("INFORMAÇÃO ANTECIPADA, REGISTRO E ESCALONAMENTO", { placeholder: "eyebrow" });
  s.addText("Comunicação de ocorrências e crise", { placeholder: "title" });
  await card(s, { ...g[0], y: TOP, h: CARD_H, icon: "FaBinoculars", head: "Prevenção diante de manifestações", paras: [
    ["Acompanhar sinais:", "mobilização, local, data e possível impacto no shopping e no entorno."],
    ["Avaliar impactos:", "antecipar efeitos sobre acessos, circulação e segurança. Alinhar apoio com a liderança."],
    ["Registrar e informar:", "fatos no grupo interno, se houver, ou no oficial, indicando o que falta confirmar."],
    ["Destacar e atualizar:", "potencial de crise vai prontamente à regional no grupo oficial, com atualizações."] ],
    note: "Preservar acessos e orientar atuação respeitosa, sem confronto." });
  await card(s, { ...g[1], y: TOP, h: CARD_H, icon: "FaWhatsapp", head: "Grupos de ocorrências no WhatsApp", paras: [
    ["Interno (opcional):", "ocorrências de baixa, média ou alta relevância. Liderança do shopping, supervisores de mall, conservação e SAC. Sem assessoria de imprensa."],
    ["Oficial / regional:", "potencial de crise operacional ou de imagem. Diretor regional e todos os gerentes regionais; plantonistas (superintendente, gerentes e coordenadores); assessoria de imprensa."] ],
    note: "Com ou sem grupo interno, informar à regional todo potencial de crise. Qualquer grupo com assessoria de imprensa inclui obrigatoriamente o time regional." });
  await card(s, { ...g[2], y: TOP, h: CARD_H, icon: "FaBullhorn", head: "Comunicação de crise", paras: [
    ["Informação inicial:", "horário, local, fato e impacto conhecido. Compartilhar antes que a ocorrência vire notícia ou post."],
    ["Resposta e apoio:", "medidas adotadas, atendimento em andamento e apoio necessário. Proteção e socorro seguem em paralelo."],
    ["Atualizações:", "fatos, decisões e condição de retomada. Separar confirmado do que falta verificar. Comunicação ao público e à imprensa segue o fluxo corporativo."] ] });
  s.addText([{ text: "ATENÇÃO: comunicar o potencial de crise sem esperar a apuração completa.", options: { bold: true, color: THEME.colors.accent4, fontSize: 13 } }], { placeholder: "footer" });

  // ---------- 9. Liderança
  s = pres.addSlide({ masterName: "CLOSE", sectionTitle: "Resposta e liderança" });
  s.addText("GUARDA ALTA", { placeholder: "eyebrow" });
  s.addText("O que a liderança precisa garantir", { placeholder: "title" });
  await row(s, { y: 1.7, h: 1.2, icon: "FaSearch", head: "Riscos conhecidos", text: "Superintendência e Operações conhecem riscos, limitações e impactos. Presença em campo e equipes orientadas para reconhecer e reportar desvios.", textSize: 14 });
  await row(s, { y: 3.05, h: 1.2, icon: "FaTools", head: "Tratamento articulado", text: "Integrar Operações, Marketing e Financeiro. Antecipar recursos, acompanhar responsável e prazo e solicitar apoio regional quando necessário.", textSize: 14 });
  await row(s, { y: 4.4, h: 1.2, icon: "FaClipboardCheck", head: "Solução confirmada", text: "Confirmar correção e liberação pelos responsáveis. Manter a regional informada sobre riscos não resolvidos e situações com potencial de crise.", textSize: 14 });
  s.addText("Guarda alta é reconhecer o risco e agir antes que ele vire crise.", { x: 0.6, y: 5.85, w: 12.1, h: 0.7, fontSize: 22, color: TXT, italic: true, margin: 0, valign: "middle", isTextBox: true, objectName: "frase de encerramento" });
  s.addText("Comunicar não encerra o tratamento: acompanhar até a solução confirmada.", { placeholder: "footer" });

  await pres.writeFile({ fileName: "/home/claude/Guarda_Alta_Resumo.pptx" });
  await applyTheme("/home/claude/Guarda_Alta_Resumo.pptx", THEME);
  console.log("ok");
})().catch((e) => { console.error(e); process.exit(1); });
