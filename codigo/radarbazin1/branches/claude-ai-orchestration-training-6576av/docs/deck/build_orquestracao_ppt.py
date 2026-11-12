#!/usr/bin/env python3
"""Gera a apresentacao 'Orquestracao de IA — Treinamento Introdutorio' em PPTX
(16:9, tema escuro). Conteudo espelha docs/TREINAMENTO-ORQUESTRACAO-IA.md.
Uso: python3 docs/deck/build_orquestracao_ppt.py [saida.pptx]
"""
import sys, re
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ------------------------------------------------------------------ paleta (tema escuro)
BG    = RGBColor(0x16, 0x1B, 0x28)   # fundo
CARD  = RGBColor(0x22, 0x29, 0x3B)   # cards
CARD2 = RGBColor(0x2A, 0x32, 0x47)   # cards claros
LINE  = RGBColor(0x3A, 0x44, 0x5C)   # bordas
TX    = RGBColor(0xE9, 0xED, 0xF5)   # texto principal
MUT   = RGBColor(0xA7, 0xB1, 0xC4)   # texto secundario
DIM   = RGBColor(0x66, 0x71, 0x86)   # texto apagado
CYAN  = RGBColor(0x5B, 0xC8, 0xE8)   # destaque primario (orquestracao)
GRN   = RGBColor(0x53, 0xD8, 0x9A)   # positivo / verificacao
AMB   = RGBColor(0xF5, 0xC5, 0x4E)   # atencao / harness
VIO   = RGBColor(0xB9, 0x9A, 0xF5)   # workflows / paralelo
ROSE  = RGBColor(0xF2, 0x8B, 0x9B)   # alerta / adversarial
INKD  = RGBColor(0x0E, 0x12, 0x1C)   # texto sobre cor clara
MONOBG= RGBColor(0x11, 0x15, 0x20)   # fundo de "codigo"

FONT  = "Calibri"
MONO  = "Consolas"

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
SW, SH = prs.slide_width, prs.slide_height
LX = Inches(0.9)
CW = Inches(11.53)

def solid(shape, color, line=None, lw=1.0):
    shape.fill.solid(); shape.fill.fore_color.rgb = color
    if line is None: shape.line.fill.background()
    else: shape.line.color.rgb = line; shape.line.width = Pt(lw)
    shape.shadow.inherit = False

def new():
    s = prs.slides.add_slide(BLANK)
    r = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH); solid(r, BG)
    return s

def tb(slide, l, t, w, h):
    box = slide.shapes.add_textbox(l, t, w, h); tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    return box, tf

def setrun(p, text, size, color, bold=False, italic=False, font=FONT):
    r = p.add_run(); r.text = text
    r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
    r.font.name = font; r.font.color.rgb = color
    return r

def para(tf, first=False):
    return tf.paragraphs[0] if first else tf.add_paragraph()

def rich(p, txt, size=13.5, color=None, strong=None):
    """**negrito** vira destaque claro; `mono` vira fonte monoespacada."""
    color = color or MUT; strong = strong or TX
    for seg in re.split(r'(\*\*[^*]+\*\*|`[^`]+`)', txt):
        if not seg: continue
        if seg.startswith("**"): setrun(p, seg[2:-2], size, strong, bold=True)
        elif seg.startswith("`"): setrun(p, seg[1:-1], size - 0.5, CYAN, font=MONO)
        else: setrun(p, seg, size, color)

def eyebrow(slide, text, color=CYAN):
    bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, Inches(0.58), Inches(0.3), Inches(0.12))
    solid(bar, color)
    box, tf = tb(slide, LX + Inches(0.44), Inches(0.5), CW, Inches(0.36))
    p = para(tf, True); r = setrun(p, text.upper(), 12, color, bold=True)
    r.font.spacing = Pt(1.6)

def title(slide, text, size=29):
    box, tf = tb(slide, LX, Inches(0.94), CW, Inches(0.9))
    p = para(tf, True); setrun(p, text, size, TX, bold=True)

def lead(slide, text, t=Inches(1.72), w=None):
    box, tf = tb(slide, LX, t, w or Inches(10.6), Inches(0.75))
    p = para(tf, True); p.line_spacing = 1.25; rich(p, text, 14, MUT)
    return box

def footer(slide, idx, total):
    box, tf = tb(slide, LX, SH - Inches(0.36), Inches(8), Inches(0.28))
    p = para(tf, True); setrun(p, "Orquestração de IA — Treinamento Introdutório · Shopping Inteligente & Cia.", 9, DIM)
    b2, tf2 = tb(slide, SW - Inches(1.5), SH - Inches(0.36), Inches(0.6), Inches(0.28))
    p2 = para(tf2, True); p2.alignment = PP_ALIGN.RIGHT
    setrun(p2, f"{idx}/{total}", 9, DIM, bold=True)

def cards(slide, items, cols, t=Inches(2.4), total_h=Inches(4.1), gap=Inches(0.22)):
    """items: lista de (accent_color, titulo, corpo)"""
    n = len(items); rows = (n + cols - 1) // cols
    cw = int((CW - gap * (cols - 1)) / cols)
    ch = int((total_h - gap * (rows - 1)) / rows)
    for k, (acc, h3, body) in enumerate(items):
        rr, cc = divmod(k, cols)
        x = LX + cc * (cw + gap); y = t + rr * (ch + gap)
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, cw, ch)
        solid(r, CARD, LINE, 0.75)
        bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.16), y + Inches(0.2), Inches(0.42), Inches(0.09))
        solid(bar, acc)
        tf = r.text_frame; tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.18); tf.margin_top = Inches(0.34); tf.margin_bottom = Inches(0.1)
        p = para(tf, True); setrun(p, h3, 14.5, TX, bold=True)
        p2 = para(tf); p2.space_before = Pt(4); p2.line_spacing = 1.18; rich(p2, body, 11.8, MUT)

def steps(slide, items, t=Inches(2.35), h=Inches(0.72), gap=Inches(0.16), acc=CYAN):
    y = t
    for i, txt in enumerate(items, 1):
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, y, CW, h)
        solid(r, CARD, LINE, 0.75)
        c = slide.shapes.add_shape(MSO_SHAPE.OVAL, LX + Inches(0.18), y + (h - Inches(0.34)) / 2, Inches(0.34), Inches(0.34))
        solid(c, acc)
        ctf = c.text_frame
        ctf.margin_left = ctf.margin_right = ctf.margin_top = ctf.margin_bottom = 0
        ctf.vertical_anchor = MSO_ANCHOR.MIDDLE
        cp = para(ctf, True); cp.alignment = PP_ALIGN.CENTER; setrun(cp, str(i), 13, INKD, bold=True)
        box, tf = tb(slide, LX + Inches(0.7), y, CW - Inches(0.95), h)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = para(tf, True); p.line_spacing = 1.12; rich(p, txt, 13)
        y = y + h + gap

def note(slide, text, color=CYAN, t=None, h=Inches(0.84)):
    if t is None: t = SH - Inches(1.3)
    r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, t, CW, h)
    solid(r, CARD2, color, 1.0)
    tf = r.text_frame; tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.18); tf.margin_top = tf.margin_bottom = Inches(0.08)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = para(tf, True); p.line_spacing = 1.2
    setrun(p, "★  ", 12, color, bold=True); rich(p, text, 12)

def flow(slide, items, t, h=Inches(1.05), gap=Inches(0.34), lx=None, w=None):
    """items: (accent, titulo, sub). Caixas ligadas por setas horizontais."""
    lx = lx or LX; w = w or CW
    n = len(items)
    bw = int((w - gap * (n - 1)) / n)
    for i, (acc, h3, sub) in enumerate(items):
        x = lx + i * (bw + gap)
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, t, bw, h)
        solid(r, CARD, acc, 1.25)
        tf = r.text_frame; tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.1); tf.margin_top = Inches(0.09); tf.margin_bottom = Inches(0.06)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = para(tf, True); p.alignment = PP_ALIGN.CENTER; setrun(p, h3, 13, acc, bold=True)
        if sub:
            p2 = para(tf); p2.alignment = PP_ALIGN.CENTER; p2.space_before = Pt(2); p2.line_spacing = 1.05
            rich(p2, sub, 10.3, MUT)
        if i < n - 1:
            ar = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x + bw + Inches(0.04), t + h / 2 - Inches(0.085), gap - Inches(0.08), Inches(0.17))
            solid(ar, LINE)

def codebox(slide, lines, l, t, w, h, size=11.5):
    r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h)
    solid(r, MONOBG, LINE, 0.75)
    tf = r.text_frame; tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.2); tf.margin_top = tf.margin_bottom = Inches(0.14)
    for i, (txt, col) in enumerate(lines):
        p = para(tf, i == 0); p.line_spacing = 1.18; p.alignment = PP_ALIGN.LEFT
        setrun(p, txt, size, col, font=MONO)
    return r

def pills(slide, items, t, lx=None):
    x = lx or LX
    for txt, col in items:
        w = Inches(0.5 + 0.093 * len(txt))
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, t, w, Inches(0.44))
        solid(r, CARD, col, 1.0)
        tf = r.text_frame; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.margin_left = tf.margin_right = Inches(0.12); tf.margin_top = tf.margin_bottom = 0
        p = para(tf, True); p.alignment = PP_ALIGN.CENTER; setrun(p, txt, 12, col, bold=True)
        x = x + w + Inches(0.18)

# ================================================================== slides
TOTAL = 22

# 1 — capa
s = new()
g = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(2.62), SW, Inches(0.05)); solid(g, CYAN)
box, tf = tb(s, LX, Inches(1.05), CW, Inches(0.4))
p = para(tf, True); r = setrun(p, "TREINAMENTO INTRODUTÓRIO", 13, CYAN, bold=True); r.font.spacing = Pt(2)
box, tf = tb(s, LX, Inches(1.5), CW, Inches(1.0))
p = para(tf, True); setrun(p, "Orquestração de IA", 46, TX, bold=True)
lead(s, "Conceitos básicos de orquestração, **harness** e construção de **workflows** — com exemplos reais dos projetos **Shopping Inteligente** (Radar Quiosques / Agente Farmer), **NutriTreino** e **Bloquinhos Mágicos**.", Inches(2.95), Inches(10.2))
pills(s, [("🧠 Conceitos", CYAN), ("🔧 Harness", AMB), ("🔀 Workflows", VIO), ("🛡️ Guardrails", ROSE), ("🔍 Auditoria", GRN), ("🏬 Casos reais", CYAN)], Inches(4.15))
box, tf = tb(s, LX, Inches(6.5), CW, Inches(0.4))
p = para(tf, True); setrun(p, "Material completo: docs/TREINAMENTO-ORQUESTRACAO-IA.md (com exercícios e glossário)", 12, DIM)
footer(s, 1, TOTAL)

# 2 — da conversa ao sistema
s = new(); eyebrow(s, "Módulo 1 · Conceitos"); title(s, "Da conversa solta ao sistema orquestrado")
lead(s, "Usar IA no chat é ter um consultor brilhante **sem mesa, sem arquivo e sem processo**. Orquestrar é dar estrutura de trabalho a ele.")
cards(s, [
    (ROSE, "💬 Sem orquestração", "Você cola o contexto na mão, toda vez. Uma pergunta, uma resposta. A IA \"acha\" que terminou. Erros passam despercebidos. O resultado vive preso na conversa."),
    (GRN, "🎼 Com orquestração", "O sistema monta o **contexto certo** automaticamente. Um objetivo vira **várias etapas encadeadas**. **Critérios de aceite** definem o pronto. **Verificação** faz parte do fluxo. Tarefas independentes rodam em **paralelo**."),
], cols=2, t=Inches(2.55), total_h=Inches(2.7))
note(s, "Definição de trabalho: orquestrar é decidir **qual informação entra, qual tarefa é pedida, em que ordem, quem verifica e o que acontece com a saída**. O modelo é o músculo; a orquestração é o sistema nervoso.")
footer(s, 2, TOTAL)

# 3 — 4 papéis
s = new(); eyebrow(s, "Módulo 1 · Conceitos"); title(s, "Os quatro papéis de todo sistema orquestrado")
cards(s, [
    (CYAN, "🎼 Orquestrador", "Decide a sequência. Pode ser **você**, um script, ou a própria IA em modo agente — como o Claude Code conduzindo um projeto inteiro."),
    (VIO, "⚙️ Trabalhadores", "Executam cada etapa: chamadas ao modelo, subagentes, **funções determinísticas** (código comum!) ou pessoas."),
    (AMB, "📦 Contexto", "A informação que cada trabalhador recebe. Regra de ouro: **mínimo e suficiente** — nem falta, nem sobra."),
    (GRN, "✅ Verificador", "Confere o resultado antes de ele valer: testes, revisão adversarial, ou o **humano no circuito**."),
], cols=2, t=Inches(2.15), total_h=Inches(3.6))
note(s, "Erro comum de iniciante: jogar IA em tudo. **IA para o ambíguo** (foto, texto, julgamento) · **código para o exato** (somar, pontuar, ordenar, validar).")
footer(s, 3, TOTAL)

# 4 — harness conceito
s = new(); eyebrow(s, "Módulo 2 · Harness", AMB); title(s, "Harness: a \"carcaça\" em volta do modelo")
lead(s, "O harness transforma um gerador de texto em um **agente útil e seguro**. É tudo o que envolve o modelo:")
flow(s, [
    (CYAN, "🎯 Objetivo", "prompt de sistema + contexto montado"),
    (AMB, "🤖 Modelo ⇄ Ferramentas", "ler/editar arquivos, rodar comandos, testar"),
    (VIO, "🔁 Loop de agente", "age → observa → decide de novo"),
    (ROSE, "🛡️ Permissões e limites", "o que pode sem perguntar"),
    (GRN, "✅ Resultado verificado", "testes + revisão + humano"),
], Inches(2.7), h=Inches(1.5))
note(s, "O **Claude Code** é um harness pronto: ferramentas + loop + permissões. Quando você escreve um `SKILL.md` ou um documento de instruções, está **programando o harness sem escrever código**.", color=AMB, t=Inches(4.85))
box, tf = tb(s, LX, Inches(5.95), CW, Inches(0.9))
p = para(tf, True); p.line_spacing = 1.3
rich(p, "Componentes no repositório:  prompts → `lib/prompts.ts` · contexto → `lib/mealAI.ts` · contrato de saída → `skill/atualizar-perfil-nutritreino` · regras e limites → doc do Bloquinhos", 12.5)
footer(s, 4, TOTAL)

# 5 — contrato de saída
s = new(); eyebrow(s, "Módulo 2 · Harness", AMB); title(s, "Contrato de saída — exemplo: skill do NutriTreino")
lead(s, "A skill transforma conversa livre (\"fiz bioimpedância, deu 110,4 kg…\") em saída **contratual**, que o app importa sem retoque:")
codebox(s, [
    ('{', DIM),
    ('  "weight_kg": 110.4,', TX),
    ('  "skeletal_muscle_kg": 53.5,', TX),
    ('  "exams": { "ldl": 120, "hdl": 42, "date": "2026-06-10" },', TX),
    ('  "notes": "Preservar massa magra; reduzir gordura saturada…"', TX),
    ('}', DIM),
], LX, Inches(2.5), Inches(6.1), Inches(2.3))
box, tf = tb(s, Inches(7.35), Inches(2.5), Inches(5.1), Inches(3.4))
regras = [
    ("Somente o JSON", "nada de texto em volta — a saída é entrada de outra etapa"),
    ("Só os campos que mudaram", "o app mantém o resto (atualização incremental)"),
    ("Números são números", "sem \"kg\", sem aspas; datas YYYY-MM-DD"),
    ("Chaves enumeradas", "targets: rest, bjj, legs… — nada inventado"),
]
for i, (h3, b) in enumerate(regras):
    p = para(tf, i == 0); p.space_after = Pt(3); p.line_spacing = 1.15
    setrun(p, "✓ ", 13, GRN, bold=True); setrun(p, h3 + " — ", 13, TX, bold=True); setrun(p, b, 12.5, MUT)
    if i < len(regras) - 1:
        sp = para(tf); sp.space_after = Pt(3); setrun(sp, "", 4, MUT)
note(s, "Todo workflow confiável nasce de **contratos de saída claros entre as etapas** — a saída de uma vira entrada da próxima, sem retrabalho humano.", color=AMB)
footer(s, 5, TOTAL)

# 6 — engenharia de contexto
s = new(); eyebrow(s, "Módulo 3 · Contexto", GRN); title(s, "Engenharia de contexto — o caso NutriTreino")
lead(s, "Antes: registro no **chat** — o histórico inteiro arrastado a cada pergunta. Depois: estado no **banco**, e cada chamada usa só **perfil + dia atual** (contexto mínimo).")
steps(s, [
    "**Perfil** — peso, massa muscular, objetivo, exames (LDL, HDL…) e as diretrizes do usuário (`notes`).",
    "**Metas do dia** — faixas de kcal/proteína/carbo/gordura conforme o treino (rest, BJJ, perna…).",
    "**Estado atual** — o que já foi consumido e **o que falta até o teto** (pré-calculado em código).",
    "**Histórico compacto** — 7 dias, uma linha por refeição: `R2 frango com arroz [520kcal P45 C50 G12]`.",
    "**Dicas calculadas** — os 5 micros mais baixos do dia. O código calcula; **a IA recebe a conclusão**.",
], t=Inches(2.6), h=Inches(0.62), gap=Inches(0.13), acc=GRN)
note(s, "Lições: **resuma antes de enviar** · **pré-calcule o que é exato** · **injete as diretrizes do usuário como regra** em toda chamada. Código: `buildMealContext()` em `lib/mealAI.ts`.", color=GRN)
footer(s, 6, TOTAL)

# 7 — ciclo NutriTreino
s = new(); eyebrow(s, "Módulo 3 · Contexto", GRN); title(s, "O ciclo completo: IA + humano + banco")
lead(s, "Dois padrões de harness em ação: **contrato de saída** (estimativa estruturada) e **human-in-the-loop** (nada entra sem confirmação).")
flow(s, [
    (CYAN, "📸 Foto / texto", "usuário registra a refeição"),
    (AMB, "🤖 IA estima", "macros em formato estruturado"),
    (ROSE, "🙋 Humano confirma", "edita e aprova — nada entra sozinho"),
    (VIO, "🗄️ Banco salva", "o estado vive fora da conversa"),
], Inches(2.6), h=Inches(1.35))
flow(s, [
    (VIO, "🗄️ Banco (estado)", None),
    (GRN, "📦 Contexto mínimo", "montado por código a cada chamada"),
    (AMB, "🤖 IA sugere", "próxima refeição, plano do dia"),
], Inches(4.45), h=Inches(1.1), lx=Inches(2.6), w=Inches(8.2))
note(s, "O estado mora no **banco**, não no chat. A conversa pode acabar — o sistema continua sabendo tudo o que precisa.", color=GRN)
footer(s, 7, TOTAL)

# 8 — workflow: 5 elementos
s = new(); eyebrow(s, "Módulo 4 · Workflows", VIO); title(s, "Os cinco elementos de um bom workflow")
steps(s, [
    "**Fases ordenadas por dependência** — fundação antes de fachada: o motor de blocos vem antes dos personagens.",
    "**Critério de pronto observável** — \"arrastar 7 sobre 3 forma uma barra dourada com som\" ≠ \"deve funcionar bem\".",
    "**Pontos de paralelização identificados** — o que é independente? 10 personagens SVG, 5 jogos de lógica.",
    "**Fase de verificação obrigatória** — teste real + revisão. Não é \"se der tempo\".",
    "**Checkpoint por fase** — um commit por fase: se a fase 3 quebrar, a 2 está salva.",
], t=Inches(2.15), h=Inches(0.68), gap=Inches(0.14), acc=VIO)
note(s, "Use como **checklist** ao desenhar qualquer fluxo — de um pipeline de dados a um projeto inteiro com agentes.", color=VIO)
footer(s, 8, TOTAL)

# 9 — sequencial / paralelo / barreira
s = new(); eyebrow(s, "Módulo 4 · Workflows", VIO); title(s, "Sequencial · paralelo · barreira")
cards(s, [
    (CYAN, "➡️ Sequencial (pipeline)", "B precisa da saída de A.\n\nEx.: montar contexto → chamar a IA → validar o JSON → salvar no banco."),
    (VIO, "🔀 Paralelo (fan-out)", "N tarefas independentes ao mesmo tempo.\n\nEx.: um agente por personagem SVG — **mesmo template**, variando número, cor e personalidade."),
    (AMB, "⏸️ Barreira (fan-in)", "Esperar **todos** para uma etapa que precisa do conjunto.\n\nEx.: **harmonizar o estilo** dos 10 personagens — só dá com todos prontos."),
], cols=3, t=Inches(2.3), total_h=Inches(3.3))
note(s, "Barreira tem custo: o fluxo anda na velocidade do item mais lento. **Só sincronize quando a próxima etapa precisa do conjunto** (deduplicar, comparar, harmonizar).", color=VIO)
footer(s, 9, TOTAL)

# 10 — fan-out por template
s = new(); eyebrow(s, "Módulo 5 · Padrões", VIO); title(s, "Padrão 1 — Fan-out por template")
lead(s, "**Quando usar:** N itens do mesmo tipo, independentes entre si. Exemplo real: fase 2 do Bloquinhos, um agente por personagem.")
codebox(s, [
    ("Desenhe o personagem {NÚMERO} (\"{NOME}\") em SVG inline:", TX),
    ("cor base {COR}, personalidade {PERSONALIDADE},", TX),
    ("bordão \"{BORDÃO}\".", TX),
    ("", TX),
    ("Requisitos fixos: olhos e boca animados, 3 expressões,", MUT),
    ("sem assets externos, seguindo as constantes de design.", MUT),
], LX, Inches(2.55), Inches(7.0), Inches(2.35))
box, tf = tb(s, Inches(8.25), Inches(2.55), Inches(4.2), Inches(2.6))
p = para(tf, True); p.line_spacing = 1.3
rich(p, "A parte **fixa** do template carrega os requisitos de consistência.\n", 13)
p2 = para(tf); p2.line_spacing = 1.3; p2.space_before = Pt(6)
rich(p2, "Só as **variáveis** mudam entre agentes.\n", 13)
p3 = para(tf); p3.line_spacing = 1.3; p3.space_before = Pt(6)
rich(p3, "Depois, uma etapa de **integração** harmoniza o resultado (a barreira).", 13)
note(s, "O mesmo padrão serve para: uma página por seção do site, um resumo por reunião, uma análise por loja do shopping…", color=VIO)
footer(s, 10, TOTAL)

# 11 — revisão adversarial
s = new(); eyebrow(s, "Módulo 5 · Padrões", ROSE); title(s, "Padrão 2 — Revisão adversarial por lentes")
lead(s, "**Quando usar:** antes de dar algo por pronto, quando o erro custa caro. Exemplo real: fase 5 do Bloquinhos — 4 revisores em paralelo, cada um com uma lente.")
cards(s, [
    (ROSE, "🔢 Correção matemática", "O gerador de contas **nunca** produz resposta errada ou negativa indevida."),
    (AMB, "🧒 Usabilidade infantil", "Alvos de toque, leitura, frustração — a lente de quem usa."),
    (VIO, "⚡ Performance mobile", "60 fps no arrastar, sem travadas em celular modesto."),
    (GRN, "♿ Acessibilidade", "Contraste, `prefers-reduced-motion`, funciona por teclado."),
], cols=4, t=Inches(2.75), total_h=Inches(2.2))
note(s, "Duas regras: **lentes diversas, não redundantes** (4 revisores genéricos acham 4× o mesmo bug; 4 lentes acham bugs diferentes) e **só integrar achados confirmados** — revisor também erra.", color=ROSE)
footer(s, 11, TOTAL)

# 12 — verificar de verdade
s = new(); eyebrow(s, "Módulo 5 · Padrões", GRN); title(s, "Padrão 3 — Verificar de verdade, depois entregar")
lead(s, "Não basta a IA **dizer** que funciona — o plano exige exercitar o resultado real antes do push.")
cards(s, [
    (GRN, "🎮 Bloquinhos — teste no navegador real", "Abrir o jogo no Chromium e exercitar: fusão 7+3 → barra; uma conta de cada nível **certa e errada**; recarregar e conferir persistência; modo offline. E **reportar o que foi testado**."),
    (CYAN, "📊 Radar Quiosques — invariantes baratas", "Após qualquer mudança: \"rode um teste conferindo que **os scores continuam entre 0 e 100**\". Uma propriedade simples de verificar que pega muitos erros."),
], cols=2, t=Inches(2.55), total_h=Inches(2.6))
note(s, "Regra de bolso: se a saída é executável (código, planilha, fórmula), a verificação **executa** — não confia no relato.", color=GRN)
footer(s, 12, TOTAL)

# 13 — doc de instruções + prompt mestre
s = new(); eyebrow(s, "Módulo 5 · Padrões", CYAN); title(s, "Padrão 4 — Documento de instruções + prompt mestre", size=25)
cards(s, [
    (CYAN, "📄 Documento de instruções (longo)", "Visão do produto, requisitos inegociáveis, plano de fases, regras de orquestração, critérios de aceite. É a **especificação executável**: versionada no git, revisável, reutilizável.\n\nEx.: `docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md`"),
    (AMB, "▶️ Prompt mestre (curto)", "\"Construa o jogo **seguindo à risca o documento X**. Execute as fases 0 a 5 na ordem, commitando ao fim de cada fase. Use agentes em paralelo nas fases 2, 3 e 5. Não abra PR sem eu pedir.\"\n\nSó aponta para o documento e reforça o inegociável."),
], cols=2, t=Inches(2.2), total_h=Inches(3.35))
note(s, "Vantagem: o conhecimento fica no **repositório**, não perdido numa conversa. Qualquer sessão futura — ou outra pessoa — reexecuta o mesmo plano.")
footer(s, 13, TOTAL)

# 14 — estudo de caso Bloquinhos (tabela de fases)
s = new(); eyebrow(s, "Módulo 6 · Estudo de caso", VIO); title(s, "Bloquinhos Mágicos — o mapa das fases")
fases = [
    ("0 · Fundação", "estrutura, constantes de design", "Inline, sem agentes — barato demais para paralelizar", CYAN),
    ("1 · Motor", "BlockEngine: o núcleo de tudo", "Sequencial e caprichada — é a raiz da árvore de dependências", CYAN),
    ("2 · Personagens", "10 personagens SVG + sandbox", "Fan-out por template (1 agente/personagem) + barreira de harmonização", VIO),
    ("3 · Modos de jogo", "4 níveis de contas + 5 jogos", "Fan-out (1 agente/jogo) sobre a mesma API + gerador puro e testável", VIO),
    ("4 · Polimento", "PWA, recompensas, persistência", "Sequencial", CYAN),
    ("5 · Verificação", "teste real + revisão", "Chromium de verdade + revisão adversarial em 4 lentes", GRN),
]
y = Inches(2.0)
for nome, oque, tec, acc in fases:
    r = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, y, CW, Inches(0.58)); solid(r, CARD, LINE, 0.75)
    b1, tf1 = tb(s, LX + Inches(0.2), y, Inches(2.0), Inches(0.58)); tf1.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = para(tf1, True); setrun(p, nome, 12.5, acc, bold=True)
    b2, tf2 = tb(s, LX + Inches(2.35), y, Inches(3.4), Inches(0.58)); tf2.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = para(tf2, True); setrun(p, oque, 12, TX)
    b3, tf3 = tb(s, LX + Inches(5.95), y, Inches(5.4), Inches(0.58)); tf3.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = para(tf3, True); p.line_spacing = 1.05; setrun(p, tec, 11.5, MUT)
    y = y + Inches(0.58) + Inches(0.12)
note(s, "Regras transversais: branch dedicada (nunca `main`) · 1 commit por fase · dependência externa só com justificativa · dúvida de **escopo** → perguntar; o resto → **decidir e seguir**. Paralelize as **folhas**, nunca a **raiz**.", t=Inches(6.26), h=Inches(0.78))
footer(s, 14, TOTAL)

# 15 — Shopping Inteligente: workflow do Agente Farmer
s = new(); eyebrow(s, "Módulo 7 · Estudo de caso", ROSE); title(s, "Shopping Inteligente — o workflow do Agente Farmer", size=25)
lead(s, "Dados decidindo o tenant mix é, em si, um problema de orquestração: várias fontes, um fluxo de decisão, um humano no fim.")
flow(s, [
    (CYAN, "📤 Captação", "ficha por link, sem servidor — volta como código `RQ1:` **já pontuado**"),
    (AMB, "📋 Triagem", "5 blocos de perguntas — **restrições antes de desejos**"),
    (VIO, "🔗 Cruzamento", "investidor × marca × ponto — fan-in de 3 fontes (base, ABF/PEGN, pontos)"),
    (GRN, "🤝 Decisão", "ranking **com o porquê** — a curadoria é do executivo"),
], Inches(2.7), h=Inches(1.65))
codebox(s, [
    ("score_final = match × (0,7 + 0,3 × mix/100) + bônus_lacuna", TX),
], LX, Inches(4.75), Inches(7.3), Inches(0.62), size=13)
box, tf = tb(s, Inches(8.5), Inches(4.75), Inches(3.9), Inches(0.75))
tf.vertical_anchor = MSO_ANCHOR.MIDDLE
p = para(tf, True); p.line_spacing = 1.2
rich(p, "Regra de ouro: o mix **modula**, nunca **infla** — etapa posterior não resgata o que uma trava reprovou.", 12)
note(s, "Cada conceito do treinamento aparece aqui: pipeline com ordem deliberada · contrato de dados (`RQ1:`) · fan-in · regra de composição explícita · human-in-the-loop.", color=ROSE)
footer(s, 15, TOTAL)

# 16 — dupla camada
s = new(); eyebrow(s, "Módulo 7 · Estudo de caso", ROSE); title(s, "A dupla camada de orquestração")
cards(s, [
    (AMB, "🔨 Na construção", "O Radar Quiosques foi construído **conversando com o Claude Code**, em camadas utilizáveis: triagem → banco → planejamento → cruzamento → ficha → CSV.\n\nIA como **trabalhadora**; humano como orquestrador. Uma mudança por vez, teste antes da próxima, reverta sem medo."),
    (CYAN, "▶️ Na execução", "A ferramenta pronta orquestra um fluxo de decisão **100% determinístico** — sem IA em tempo de execução!\n\nProva o ponto: orquestrar é **estruturar decisão**; IA é um dos trabalhadores possíveis, não o único."),
], cols=2, t=Inches(2.15), total_h=Inches(3.4))
note(s, "Evolução natural: base compartilhada em nuvem (o Postgres já existe no repositório) e, daí, um agente que lê a ficha `RQ1:` e **sugere perguntas de aprofundamento** — o fluxo já tem contratos claros para receber esse trabalhador novo.", color=ROSE)
footer(s, 16, TOTAL)

# 17 — guardrails: 4 camadas
s = new(); eyebrow(s, "Módulo 8 · Guardrails", ROSE); title(s, "Guardrails: limites em quatro camadas")
lead(s, "O modelo é probabilístico — em algum momento ele erra. **Guardrail é o limite determinístico** que impede o erro de virar estrago. Uma regra por camada, no mínimo:")
cards(s, [
    (CYAN, "1 · Entrada — o que pode entrar?", "Contexto mínimo (o modelo nunca vê o banco cru) · ficha do investidor com **campos fechados** · Bloquinhos: **zero texto livre digitado** (LGPD/COPPA)."),
    (AMB, "2 · Saída — o que pode ser aproveitado?", "Contrato JSON com **chaves enumeradas** · invariante **\"scores entre 0 e 100\"** · flags automáticas (gordura saturada × LDL) — **código auditando a saída da IA**."),
    (ROSE, "3 · Ação — o que o agente pode fazer?", "**Nunca commitar em `main`** · dependência externa **só com justificativa escrita** · `API key` **só no servidor** · jogo com **zero chamadas de rede**."),
    (GRN, "4 · Processo — quem aprova o quê?", "Nada entra no banco sem o usuário **confirmar/editar** · a **curadoria é do executivo** · dúvida de **escopo** → perguntar; o resto → decidir e seguir."),
], cols=2, t=Inches(2.5), total_h=Inches(3.35))
note(s, "A maioria dos incidentes nasce na camada que **não existia**. Ao desenhar um fluxo novo, percorra as 4 camadas e escreva a regra de cada uma.", color=ROSE)
footer(s, 17, TOTAL)

# 18 — guardrails eficientes: princípios
s = new(); eyebrow(s, "Módulo 8 · Guardrails", ROSE); title(s, "Guardrails eficientes — cinco princípios")
steps(s, [
    "**No caminho obrigatório** — a trava financeira roda em todo cálculo; não é \"boa prática recomendada\".",
    "**Trava dura onde o negócio quebra; peso onde é preferência** — \"acessibilidade não é média, é porta\".",
    "**Escada de custo** — código/schema → invariantes → revisão por IA → humano. Use o degrau mais barato que pega o erro.",
    "**Falhar fechado** — JSON inválido: rejeita e repete a chamada. Nunca \"aproveita o que der\".",
    "**Impossível por construção** — `score = match × (0,7 + 0,3 × mix/100)`: o mix é **incapaz** de resgatar um reprovado.",
], t=Inches(2.05), h=Inches(0.68), gap=Inches(0.14), acc=ROSE)
note(s, "Anti-padrão clássico: a **média que esconde o veto** — um critério eliminatório diluído entre sete pesos \"some\" e o sistema recomenda o inviável com nota razoável.", color=ROSE)
footer(s, 18, TOTAL)

# 19 — auditoria: fixe e registre
s = new(); eyebrow(s, "Módulo 9 · Auditoria", GRN); title(s, "Auditoria do modelo — fixe, versione, registre")
lead(s, "A pergunta que a auditoria responde: **\"por que o sistema decidiu isso — com qual modelo, qual prompt, qual contexto, e quem aprovou?\"**")
cards(s, [
    (AMB, "📌 Fixe e versione (elimine o implícito)", "**Modelo pinned**: `claude-sonnet-4-6` no código — trocar é um diff no git, com autor e data.\n\n**Prompts no repositório** (`lib/prompts.ts`) · **parâmetros de geração explícitos** (temperatura baixa para extração) · **instruções do agente versionadas** (doc do Bloquinhos)."),
    (GRN, "🧾 Registre por chamada (trilha)", "`timestamp` · `model_id` + `prompt_version` · **contexto enviado** (ou hash + resumo) · **saída bruta** · resultado da **validação** · **decisão humana** (aceito / editado **com o delta** / rejeitado) · tokens, custo, latência."),
], cols=2, t=Inches(2.6), total_h=Inches(3.15))
note(s, "O dado mais valioso é o **delta humano**: no NutriTreino, o fluxo estima → confirma/edita já mede de graça a qualidade do modelo no mundo real.", color=GRN)
footer(s, 19, TOTAL)

# 20 — auditoria contínua: métricas e golden set
s = new(); eyebrow(s, "Módulo 9 · Auditoria", GRN); title(s, "Auditoria contínua — métricas e golden set")
cards(s, [
    (GRN, "✅ Aceitação sem edição", "% de saídas aprovadas como vieram. **Caiu?** O modelo ou o contexto pioraram."),
    (ROSE, "📉 Contrato violado", "% de saídas que falham na validação (JSON inválido, faixa estourada). **Subiu?** Prompt/modelo mudaram de comportamento."),
    (VIO, "📊 Distribuição das saídas", "Scores, flags disparadas, macros médios. **Deslocou sem causa?** Investigue — é *drift*."),
    (AMB, "💸 Custo e latência", "Por tarefa. Regressões silenciosas aparecem primeiro aqui."),
], cols=4, t=Inches(2.0), total_h=Inches(2.5))
box, tf = tb(s, LX, Inches(4.75), CW, Inches(1.0))
p = para(tf, True); p.line_spacing = 1.25
rich(p, "**Golden set** — casos com resposta conhecida, rodados a cada mudança de prompt/modelo (o teste de regressão da IA):  \"investidor R$ 80 mil, primeira vez\" → ranking esperado · 10 refeições conferidas à mão → estimativa dentro de ±15% · gerador de contas × 1.000 → **nenhuma** resposta errada.", 12.5)
note(s, "Nunca troque o `model_id` \"porque saiu versão nova\" sem rodar o golden set **antes e depois** — a diferença entre os dois relatórios é a sua decisão de migração, documentada.", color=GRN)
footer(s, 20, TOTAL)

# 21 — exercícios
s = new(); eyebrow(s, "Módulo 10 · Prática", GRN); title(s, "Exercícios — do ler ao orquestrar")
steps(s, [
    "**Ler um harness** (30 min) — abra a skill do NutriTreino e liste as 3 regras que tornam a saída \"importável sem retoque\".",
    "**Auditar contexto** (45 min) — em `lib/mealAI.ts`: camada → de onde vem → por que resumida assim. O que ficou **de fora**?",
    "**Desenhar um workflow** (1 h) — escreva um documento de instruções no molde do Bloquinhos + prompt mestre de 5–10 linhas.",
    "**Executar e verificar** (2 h) — rode o prompt mestre no Claude Code: 1 commit por fase, verificação real antes do push.",
    "**Avançado** — especifique um agente de IA para o Radar Quiosques (contexto mínimo, contrato, humano, e **o que ele não pode fazer**).",
    "**Guardrails + auditoria** — para esse agente: 1 guardrail por camada, trava vs. peso, registro por chamada e golden set de 5 fichas.",
], t=Inches(1.95), h=Inches(0.62), gap=Inches(0.12), acc=GRN)
note(s, "Sugestão no espírito do Shopping Inteligente: **\"Radar de Lojas Satélite\"** — a mesma lógica do Radar Quiosques com outra base de marcas e outros pesos.", color=GRN, t=Inches(6.5), h=Inches(0.66))
footer(s, 21, TOTAL)

# 18 — encerramento
s = new()
g = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(2.42), SW, Inches(0.05)); solid(g, CYAN)
box, tf = tb(s, LX, Inches(1.55), CW, Inches(0.8))
p = para(tf, True); setrun(p, "O que levar deste treinamento", 38, TX, bold=True)
box, tf = tb(s, LX, Inches(2.85), Inches(11.4), Inches(3.0))
finais = [
    ("Contexto mínimo e suficiente", "o estado mora no banco/arquivos; cada chamada recebe só o que resolve a tarefa."),
    ("Contratos entre etapas", "JSON, CSV, `RQ1:` — a saída de uma etapa é a entrada da próxima, sem retrabalho."),
    ("Critério de pronto observável", "\"7 + 3 vira barra dourada com som\" — nunca \"deve funcionar bem\"."),
    ("Paralelize folhas, capriche na raiz", "fan-out no que é independente; sequencial e bem-feito no que tudo depende."),
    ("Verifique de verdade", "executar > relatar; lentes adversariais diversas; só integrar o confirmado."),
    ("O humano no lugar certo", "confirmação de dados, dúvidas de escopo e a decisão final — a curadoria é sua."),
    ("Guardrails por construção", "trava dura onde o negócio quebra; a violação deve ser impossível, não \"proibida\"."),
    ("Tudo auditável", "modelo pinned, prompt versionado, registro por chamada, delta humano e golden set."),
]
for i, (h3, b) in enumerate(finais):
    p = para(tf, i == 0); p.space_after = Pt(6); p.line_spacing = 1.15
    setrun(p, "✓  ", 13.5, GRN, bold=True); setrun(p, h3 + " — ", 13.5, TX, bold=True); rich(p, b, 12.5, MUT)
box, tf = tb(s, LX, Inches(6.6), CW, Inches(0.4))
p = para(tf, True)
setrun(p, "Aprofunde: docs/TREINAMENTO-ORQUESTRACAO-IA.md · docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md · docs/Agente-Farmer-e-Conector-de-Quiosques.md", 12, DIM)
footer(s, 22, TOTAL)

out = sys.argv[1] if len(sys.argv) > 1 else "Treinamento-Orquestracao-IA.pptx"
prs.save(out)
print("Salvo:", out, "|", len(prs.slides._sldIdLst), "slides")
