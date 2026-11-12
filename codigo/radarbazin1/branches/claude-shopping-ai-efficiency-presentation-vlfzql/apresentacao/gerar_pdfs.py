# -*- coding: utf-8 -*-
"""
Gera dois PDFs a partir do .pptx do workshop (o LibreOffice nao converte neste
ambiente, entao renderizamos o conteudo diretamente com reportlab):
  1) ..._slides.pdf        — 1 slide por pagina (paisagem), versao de leitura/impressao
  2) ..._handout_notas.pdf — titulo + tempo + notas do apresentador por slide
Paleta Allos.
"""
import re
from pptx import Presentation
from pptx.util import Emu
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, HRFlowable, KeepTogether)
from reportlab.lib.enums import TA_LEFT

# paleta Allos
PETROLEO = colors.HexColor("#00616F")
VERDE    = colors.HexColor("#0D454A")
TEAL     = colors.HexColor("#368C82")
CORAL    = colors.HexColor("#CD5151")
MENTA    = colors.HexColor("#6CC680")
AMBAR    = colors.HexColor("#EDA754")
BEGE     = colors.HexColor("#CCC5BC")
AREIA    = colors.HexColor("#E5DED4")
WHITE    = colors.white

SRC = "/home/user/radarbazin1/apresentacao/Shopping_Inteligente_IA_Mooca_Plaza.pptx"
prs = Presentation(SRC)

TIME_RE = re.compile(r'^\d+(?:[–-]\d+)?\s*min$', re.I)

def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def slide_data(slide):
    paras = []
    for sh in slide.shapes:
        if not sh.has_text_frame:
            continue
        top = int(sh.top) if sh.top is not None else 0
        left = int(sh.left) if sh.left is not None else 0
        for p in sh.text_frame.paragraphs:
            txt = "".join(r.text for r in p.runs)
            if not txt.strip():
                continue
            sizes = [r.font.size.pt for r in p.runs if r.font.size is not None]
            size = max(sizes) if sizes else 12.0
            bold = any(bool(r.font.bold) for r in p.runs)
            color = None
            for r in p.runs:
                try:
                    if r.font.color is not None and r.font.color.rgb is not None:
                        color = "#" + str(r.font.color.rgb); break
                except Exception:
                    pass
            paras.append({"txt": txt, "size": size, "bold": bold,
                          "color": color, "top": top, "left": left})
    title = max(paras, key=lambda d: d["size"]) if paras else None
    timev = None
    for d in paras:
        s = d["txt"].strip()
        if TIME_RE.match(s) or "7 MIN 30 S" in s or s == "45 min":
            timev = s
    notes = ""
    if slide.has_notes_slide:
        notes = slide.notes_slide.notes_text_frame.text.strip()
    return paras, title, timev, notes

# ----------------------------------------------------------------- 1) SLIDES PDF
def body_style(size, bold):
    if size >= 16:
        return ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=12.5,
                              textColor=PETROLEO, leading=16, spaceAfter=3, spaceBefore=4)
    if size >= 13.5:
        return ParagraphStyle("b", fontName="Helvetica-Bold" if bold else "Helvetica",
                              fontSize=11, textColor=(PETROLEO if bold else VERDE),
                              leading=14, spaceAfter=2)
    if size <= 11.6:
        return ParagraphStyle("s", fontName="Helvetica", fontSize=9.5,
                              textColor=TEAL, leading=12, spaceAfter=1, leftIndent=10)
    return ParagraphStyle("n", fontName="Helvetica-Bold" if bold else "Helvetica",
                          fontSize=10.5, textColor=VERDE, leading=13, spaceAfter=2)

def build_slides_pdf(path):
    PW, PH = landscape(A4)
    doc = SimpleDocTemplate(path, pagesize=landscape(A4),
                            leftMargin=14*mm, rightMargin=14*mm,
                            topMargin=12*mm, bottomMargin=10*mm,
                            title="Shopping Inteligente — slides")
    story = []
    kicker_st = ParagraphStyle("k", fontName="Helvetica-Bold", fontSize=10,
                               textColor=TEAL, leading=12)
    title_st = ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=20,
                              textColor=WHITE, leading=23)
    time_st = ParagraphStyle("tm", fontName="Helvetica-Bold", fontSize=12,
                             textColor=PETROLEO, leading=14, alignment=2)
    foot_st = ParagraphStyle("f", fontName="Helvetica-Oblique", fontSize=8,
                             textColor=BEGE)
    n = len(prs.slides._sldIdLst)
    for idx, slide in enumerate(prs.slides, 1):
        paras, title, timev, _ = slide_data(slide)
        ttl = title["txt"] if title else f"Slide {idx}"
        # kicker = primeira linha curta em maiusculas (eyebrow), diferente do titulo
        kicker = None
        for d in sorted(paras, key=lambda d: (d["top"], d["left"])):
            s = d["txt"].strip()
            if d is title or (timev and s == timev):
                continue
            if s == s.upper() and 3 <= len(s) <= 48 and 9 <= d["size"] <= 14 and d["bold"]:
                kicker = s; break
        # banda de titulo
        left_cell = []
        if kicker:
            left_cell.append(Paragraph(esc(kicker), kicker_st))
        left_cell.append(Paragraph(esc(ttl), title_st))
        right_cell = Paragraph(esc(timev) if timev else "", time_st)
        band = Table([[left_cell, right_cell]], colWidths=[(PW-28*mm)*0.82, (PW-28*mm)*0.18])
        band.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, 0), PETROLEO),
            ("BACKGROUND", (1, 0), (1, 0), AREIA),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ]))
        flow = [band, Spacer(1, 8)]
        used = {id(title)}
        for d in sorted(paras, key=lambda d: (round(d["top"]/360000), d["left"])):
            if id(d) in used:
                continue
            s = d["txt"].strip()
            if (timev and s == timev) or (kicker and s == kicker):
                continue
            flow.append(Paragraph(esc(d["txt"]), body_style(d["size"], d["bold"])))
        flow.append(Spacer(1, 6))
        flow.append(Paragraph(f"Shopping Inteligente · Time Mooca — Mooca Plaza Shopping   ·   "
                              f"slide {idx}/{n}", foot_st))
        story.append(KeepTogether(flow) if False else flow[0])
        for f in flow[1:]:
            story.append(f)
        if idx < n:
            story.append(PageBreak())
    doc.build(story)
    print("slides PDF ->", path)

# ----------------------------------------------------------------- 2) HANDOUT NOTAS
def build_handout_pdf(path):
    doc = SimpleDocTemplate(path, pagesize=A4,
                            leftMargin=18*mm, rightMargin=18*mm,
                            topMargin=16*mm, bottomMargin=14*mm,
                            title="Shopping Inteligente — handout do apresentador")
    story = []
    cover_t = ParagraphStyle("ct", fontName="Helvetica-Bold", fontSize=20,
                             textColor=PETROLEO, leading=24, spaceAfter=2)
    cover_s = ParagraphStyle("cs", fontName="Helvetica", fontSize=11,
                             textColor=TEAL, leading=15, spaceAfter=2)
    head_st = ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=12.5,
                             textColor=PETROLEO, leading=15, spaceBefore=10, spaceAfter=2)
    time_st = ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=10,
                             textColor=AMBAR, leading=12)
    note_st = ParagraphStyle("n", fontName="Helvetica", fontSize=10.5,
                             textColor=VERDE, leading=14, spaceAfter=2)
    none_st = ParagraphStyle("nn", fontName="Helvetica-Oblique", fontSize=10,
                             textColor=TEAL, leading=13)
    story.append(Paragraph("Shopping Inteligente — Guia do apresentador", cover_t))
    story.append(Paragraph("IA para eficiência e agilidade · Time Mooca — Mooca Plaza Shopping · "
                           "45 min (vídeo 7,5 + apresentação 34,5 + exercício 3)", cover_s))
    story.append(Paragraph("Notas de cada slide, com a marcação de tempo. Lembrete: a IA gera o rascunho, "
                           "você confere e decide.", cover_s))
    story.append(HRFlowable(width="100%", color=BEGE, spaceBefore=6, spaceAfter=2))
    n = len(prs.slides._sldIdLst)
    for idx, slide in enumerate(prs.slides, 1):
        paras, title, timev, notes = slide_data(slide)
        ttl = title["txt"] if title else f"Slide {idx}"
        block = [Paragraph(f"{idx}. {esc(ttl)}", head_st)]
        if timev:
            block.append(Paragraph(f"⏱ {esc(timev)}", time_st))
        block.append(Paragraph(esc(notes) if notes else "—", note_st if notes else none_st))
        block.append(HRFlowable(width="100%", color=BEGE, spaceBefore=4, spaceAfter=0))
        story.append(KeepTogether(block))
    doc.build(story)
    print("handout PDF ->", path)

base = "/home/user/radarbazin1/apresentacao/"
build_slides_pdf(base + "Shopping_Inteligente_slides.pdf")
build_handout_pdf(base + "Shopping_Inteligente_handout_notas.pdf")
