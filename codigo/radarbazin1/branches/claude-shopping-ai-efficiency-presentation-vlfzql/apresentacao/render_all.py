# -*- coding: utf-8 -*-
"""
Renderiza TODOS os slides do .pptx como imagens (Pillow) e monta um PDF de previa
visual. Generico: le geometria (retangulos/arredondados/elipses), preenchimento,
borda e texto (tamanho, cor, negrito, alinhamento, ancora vertical) de cada forma.
Aproximacao: fonte DejaVu (o .pptx usa Calibri) e emojis sao removidos.
"""
import re
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE as AST
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Pt
from PIL import Image, ImageDraw, ImageFont

SRC = "/home/user/radarbazin1/apresentacao/Shopping_Inteligente_IA_Mooca_Plaza.pptx"
SCALE = 1.5
EMU_IN = 914400.0
def epx(emu): return int(round((emu / EMU_IN) * 96 * SCALE))
def ppx(pt):  return max(1, int(round(pt * (96/72) * SCALE)))

REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
_fcache = {}
def font(size_px, bold):
    k = (size_px, bold)
    if k not in _fcache:
        _fcache[k] = ImageFont.truetype(BLD if bold else REG, size_px)
    return _fcache[k]

EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-⛿️‍⭐]")
def clean(t): return EMOJI.sub("", t)

def rgb(c):
    try: return tuple(int(str(c)[i:i+2], 16) for i in (0, 2, 4))
    except Exception: return None

prs = Presentation(SRC)
SW, SH = epx(prs.slide_width), epx(prs.slide_height)

def fill_of(shape):
    try:
        if shape.fill.type == 1:  # SOLID
            return rgb(shape.fill.fore_color.rgb)
    except Exception: pass
    return None
def border_of(shape):
    try:
        if shape.line.fill.type == 1:
            w = shape.line.width
            return rgb(shape.line.color.rgb), max(1, epx(int(w)) if w else ppx(1))
    except Exception: pass
    return None, 0

def tokens_of(paragraph):
    toks = []; prev_tr = False
    for r in paragraph.runs:
        txt = clean(r.text)
        if txt == "": continue
        if txt.strip() == "":
            prev_tr = True; continue
        size = r.font.size.pt if r.font.size is not None else 12.0
        bold = bool(r.font.bold)
        col = rgb(r.font.color.rgb) if (r.font.color is not None and r.font.color.type is not None) else (13,69,74)
        lead_sp = txt[:1].isspace()
        for i, w in enumerate(txt.split()):
            toks.append({"w": w, "f": font(ppx(size), bold), "c": col or (13,69,74),
                         "h": ppx(size), "sp_before": (i>0 or lead_sp or prev_tr)})
        prev_tr = txt[-1:].isspace()
    return toks

def wrap_lines(d, toks, maxw):
    lines = []; cur = []; curw = 0
    sp = None
    for t in toks:
        tw = d.textlength(t["w"], font=t["f"])
        spw = d.textlength(" ", font=t["f"]) if (cur and t["sp_before"]) else 0
        if cur and curw + spw + tw > maxw:
            lines.append(cur); cur = []; curw = 0; spw = 0
        t["_sp"] = spw if cur else 0
        cur.append(t); curw += (spw if cur[:-1] else 0) + tw
    if cur: lines.append(cur)
    return lines

def draw_textframe(d, shape):
    tf = shape.text_frame
    L = epx(shape.left); T = epx(shape.top); W = epx(shape.width); H = epx(shape.height)
    ml = epx(tf.margin_left) if tf.margin_left is not None else epx(91440)
    mr = epx(tf.margin_right) if tf.margin_right is not None else epx(91440)
    mt = epx(tf.margin_top) if tf.margin_top is not None else epx(45720)
    mb = epx(tf.margin_bottom) if tf.margin_bottom is not None else epx(45720)
    x0 = L + ml; y0 = T + mt; innerw = max(10, W - ml - mr); innerh = H - mt - mb
    blocks = []  # (lines, align, space_after_px)
    total = 0
    for p in tf.paragraphs:
        toks = tokens_of(p)
        if not toks:
            blocks.append(([], p.alignment, ppx(6))); total += ppx(10); continue
        lines = wrap_lines(d, toks, innerw)
        ls = p.line_spacing if isinstance(p.line_spacing, float) else 1.08
        lhs = [max(t["h"] for t in ln) * ls for ln in lines]
        sa = (p.space_after.pt if p.space_after is not None else 2)
        blocks.append((lines, p.alignment, ppx(sa), lhs))
        total += sum(lhs) + ppx(sa)
    va = tf.vertical_anchor
    if va == MSO_ANCHOR.MIDDLE: y = y0 + max(0, (innerh - total)//2)
    elif va == MSO_ANCHOR.BOTTOM: y = y0 + max(0, innerh - total)
    else: y = y0
    for blk in blocks:
        if len(blk) == 3:
            y += blk[2]; continue
        lines, align, sa, lhs = blk
        for ln, lh in zip(lines, lhs):
            lw = sum(d.textlength(t["w"], font=t["f"]) + t["_sp"] for t in ln)
            if align == PP_ALIGN.CENTER: x = x0 + (innerw - lw)//2
            elif align == PP_ALIGN.RIGHT: x = x0 + (innerw - lw)
            else: x = x0
            for t in ln:
                x += t["_sp"]
                d.text((x, y + lh*0.12), t["w"], font=t["f"], fill=t["c"])
                x += d.textlength(t["w"], font=t["f"])
            y += lh
        y += sa

def render_slide(slide):
    img = Image.new("RGB", (SW, SH), (255,255,255)); d = ImageDraw.Draw(img)
    for shape in slide.shapes:
        L = epx(shape.left or 0); T = epx(shape.top or 0)
        W = epx(shape.width or 0); Hh = epx(shape.height or 0)
        ast = None
        if shape.shape_type == MSO_SHAPE_TYPE.AUTO_SHAPE:
            try: ast = shape.auto_shape_type
            except Exception: ast = None
        if ast is not None:
            fl = fill_of(shape); bc, bw = border_of(shape)
            box = [L, T, L+W, T+Hh]
            if ast == AST.OVAL:
                if fl: d.ellipse(box, fill=fl)
                if bc: d.ellipse(box, outline=bc, width=bw)
            elif ast == AST.ROUNDED_RECTANGLE:
                # honra o ajuste de raio do shape (fracao do lado menor), como o PowerPoint; 0.18 so como fallback
                try: _adj = shape.adjustments[0] if len(shape.adjustments) else None
                except Exception: _adj = None
                rad = int(min(W, Hh) * (_adj if _adj is not None else 0.18))
                if fl: d.rounded_rectangle(box, radius=rad, fill=fl)
                if bc: d.rounded_rectangle(box, radius=rad, outline=bc, width=bw)
            else:
                if fl: d.rectangle(box, fill=fl)
                if bc: d.rectangle(box, outline=bc, width=bw)
        if shape.has_text_frame and shape.text_frame.text.strip():
            draw_textframe(d, shape)
    return img

import os, tempfile
from reportlab.pdfgen import canvas
imgs = [render_slide(s) for s in prs.slides]
tmp = tempfile.mkdtemp()
paths = []
for i, im in enumerate(imgs):
    p = os.path.join(tmp, f"s{i:02d}.png"); im.save(p); paths.append(p)
out = "/home/user/radarbazin1/apresentacao/Shopping_Inteligente_PREVIEW_deck.pdf"
pw, ph = SW*72/96, SH*72/96
c = canvas.Canvas(out, pagesize=(pw, ph))
for p in paths:
    c.drawImage(p, 0, 0, width=pw, height=ph)
    c.showPage()
c.save()
print("preview PDF ->", out, "| paginas:", len(imgs), "| px:", imgs[0].size)
