# -*- coding: utf-8 -*-
"""
Passo a passo para deixar seguros os apps da demonstração (para imprimir).
Baseado no que foi verificado no GitHub (dvf15/radarbazin1) e na Vercel (radarbazin1-s68m).
Saída: Seguranca_Apps_Passo_a_Passo.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
                                TableStyle, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FD="/usr/share/fonts/truetype/dejavu/"
pdfmetrics.registerFont(TTFont("DV",FD+"DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DVB",FD+"DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DVM",FD+"DejaVuSansMono.ttf"))
pdfmetrics.registerFontFamily("DV",normal="DV",bold="DVB",italic="DV",boldItalic="DVB")

PET=Color(0,0x61/255,0x6F/255); VER=Color(0x0D/255,0x45/255,0x4A/255); TEAL=Color(0x36/255,0x8C/255,0x82/255)
AMB=Color(0xED/255,0xA7/255,0x54/255); AREIA=Color(0xE5/255,0xDE/255,0xD4/255); BEGE=Color(0xCC/255,0xC5/255,0xBC/255)
CORAL=Color(0xCD/255,0x51/255,0x51/255); MENTA=Color(0x6C/255,0xC6/255,0x80/255)
WHITE=Color(1,1,1); CARD=Color(0xF4/255,0xF1/255,0xEC/255); SOFT=Color(0xFB/255,0xF3/255,0xE6/255)

out="/home/user/radarbazin1/apresentacao/Seguranca_Apps_Passo_a_Passo.pdf"
W,H=A4; M=16*mm

def st(**k):
    base=dict(fontName="DV",fontSize=9.5,leading=13,textColor=VER); base.update(k)
    return ParagraphStyle("x",**base)
P   =st()
PS  =st(fontSize=8.5,leading=11.5)
H2  =st(fontName="DVB",fontSize=13,leading=16,textColor=PET,spaceBefore=10,spaceAfter=4)
SUB =st(fontSize=8.8,leading=12,textColor=TEAL,spaceAfter=4)
BOLD=st(fontName="DVB")
CODE=st(fontName="DVM",fontSize=8.3,leading=11,textColor=VER,backColor=CARD,borderPadding=(4,5,4,5),leftIndent=5,rightIndent=5,spaceBefore=3,spaceAfter=5)
CELL=st(fontSize=8.3,leading=11)
CELLB=st(fontName="DVB",fontSize=8.3,leading=11)
HEAD=st(fontName="DVB",fontSize=8.3,leading=11,textColor=WHITE)

def passos(itens):
    """Lista numerada com caixinha para marcar ao imprimir."""
    rows=[]
    for i,it in enumerate(itens,1):
        rows.append([Paragraph("☐",st(fontSize=12,leading=13,textColor=PET)),
                     Paragraph(f"<b>{i}.</b>",P),
                     it if not isinstance(it,str) else Paragraph(it,P)])
    t=Table(rows,colWidths=[7*mm,6*mm,W-2*M-13*mm])
    t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),
                           ("RIGHTPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),3),("TOPPADDING",(0,0),(-1,-1),1)]))
    return t

def secao(num,titulo,cor):
    t=Table([[Paragraph(f"<font color='white'><b>{num}</b></font>",st(fontSize=11,alignment=1)),
              Paragraph(titulo,H2)]],colWidths=[8*mm,W-2*M-8*mm])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(0,0),cor),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                           ("LEFTPADDING",(1,0),(1,0),8),("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2)]))
    return t

def nota(texto,cor=AMB):
    t=Table([[Paragraph(texto,PS)]],colWidths=[W-2*M])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),SOFT),("LINEBEFORE",(0,0),(0,-1),3,cor),
                           ("LEFTPADDING",(0,0),(-1,-1),8),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
    return t

story=[]
story.append(Paragraph("Situação verificada em 28/09/2026 no GitHub (repositório <b>dvf15/radarbazin1</b>, privado) "
                       "e na Vercel (projeto <b>radarbazin1-s68m</b>). A produção está no ar e funcionando.",SUB))

# ---- resumo ----
res=[["App","Situação hoje","O que fazer"],
     ["Radar de Mídia, Radar de Varejo, Otimizador de Obras e Radar de Operações",
      "Abertos de propósito. Sem chave e sem banco; os dados ficam no navegador de quem usa. A varredura não achou dado interno (e-mails e valores são de exemplo).",
      "Bloquear a indexação no Google; revisar o conteúdo embutido; senha própria só se houver algo interno."],
     ["NuTre","Seguro: pede senha (APP_SENHA); chave da Anthropic guardada na Vercel e usada só no servidor; nenhuma chave no histórico do código.",
      "Opcional: limite de gasto e troca periódica da chave."],
     ["Radar de Dispersão de Vendas","Não verificado: não está neste repositório nem nesta Vercel. Lida com livro fiscal — dado real e confidencial.",
      "Confirmar onde está hospedado e que o processamento é mesmo local."],
     ["Contas","Repositório, Vercel e chave estão na conta pessoal (dvf15).",
      "Levar as ferramentas comerciais para as contas da empresa; o NuTre fica na pessoal."]]
tab=Table([[Paragraph(c,HEAD if r==0 else (CELLB if j==0 else CELL)) for j,c in enumerate(row)] for r,row in enumerate(res)],
          colWidths=[38*mm,(W-2*M-38*mm)*0.55,(W-2*M-38*mm)*0.45],repeatRows=1)
tab.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),PET),("VALIGN",(0,0),(-1,-1),"TOP"),
                         ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,CARD]),("GRID",(0,0),(-1,-1),0.5,BEGE),
                         ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
story+= [Paragraph("Resumo",H2),tab]

# ---- 1. ferramentas abertas ----
story+= [Spacer(1,4),secao("1","Ferramentas abertas — Radar de Mídia, Radar de Varejo, Otimizador de Obras, Radar de Operações",TEAL),
         Paragraph("Pelo critério do treinamento elas podem ficar abertas: rodam no navegador, não têm chave nem banco. Faltam três cuidados.",SUB),
         Paragraph("<b>a) Tirar do Google</b> — hoje nenhuma delas bloqueia a indexação.",P),
         passos([[Paragraph("Em cada arquivo — <font name='DVM'>public/midia.html</font>, <font name='DVM'>quiosques.html</font>, "
                            "<font name='DVM'>obras.html</font>, <font name='DVM'>operacoes.html</font> — incluir dentro do <font name='DVM'>&lt;head&gt;</font>:",P),
                  Paragraph('&lt;meta name="robots" content="noindex, nofollow"&gt;',CODE)],
                 Paragraph("Publicar (commit no <font name='DVM'>main</font>). A página continua abrindo para quem tem o link, mas some das buscas.",P)]),
         Paragraph("<b>b) Revisar o que vai dentro da página</b> — quem tem o link lê tudo o que está nela.",P),
         passos(["Abrir cada ferramenta e ler a base embutida: marcas, propriedades de mídia, fornecedores, mix planejado.",
                 "Se houver algo interno (preço real, condição comercial, contato de fornecedor), trocar por dado fictício — "
                 "ou tirar a ferramenta da lista <font name='DVM'>PUBLICO</font> do <font name='DVM'>middleware.ts</font>, para ela passar a pedir senha."]),
         Paragraph("<b>c) Se quiser senha nas ferramentas</b>",P),
         passos(["Não usar a <font name='DVM'>APP_SENHA</font>: ela também abre o NuTre.",
                 "Criar na Vercel uma senha só para as ferramentas (ex.: <font name='DVM'>FERRAMENTAS_SENHA</font>) e ajustar o "
                 "<font name='DVM'>middleware.ts</font> para pedi-la nessas páginas.",
                 "Mandar a senha separada do link (ex.: link por e-mail, senha por mensagem)."])]

# ---- 2. contas da empresa ----
story+= [Spacer(1,4),secao("2","Contas pessoais → contas da empresa (ajuste principal)",CORAL),
         Paragraph("Hoje repositório, Vercel e chave estão na conta pessoal <b>dvf15</b>.",SUB),
         passos(["<b>Separar os apps</b>: ferramentas comerciais vão para a empresa; o NuTre (uso pessoal) fica na sua conta. Hoje os dois dividem o mesmo domínio.",
                 "<b>GitHub</b>: criar (ou pedir ao TI) a organização da empresa e levar o código das ferramentas para um repositório <b>privado</b> lá.",
                 "<b>Vercel</b>: criar o time da empresa e publicar lá o projeto das ferramentas "
                 "(ou transferir o atual em Project → Settings → General → Transfer Project).",
                 "<b>Acessos</b>: revisar quem é membro da organização e do time — só quem desenvolve.",
                 "<b>Endereço</b>: o link das ferramentas muda — atualizar QR codes, apresentações e links já enviados."])]

# ---- 3. radar de dispersão ----
story+= [Spacer(1,4),secao("3","Radar de Dispersão de Vendas (verificar)",AMB),
         Paragraph("Lida com livro fiscal de lojista — dado real e confidencial.",SUB),
         passos(["<b>Onde está hospedado?</b> Artefato do claude.ai: em Share, confirmar que está privado ou restrito à empresa. "
                 "Arquivo no computador: ok. Site: precisa de senha ou login.",
                 "<b>Confirmar o processamento local</b>: abrir no Chrome, F12 → aba Network, carregar um livro fiscal <b>fictício</b> e processar. "
                 "Não pode aparecer nenhum envio para fora além dos arquivos do próprio app.",
                 "<b>Onde ficam os dados</b> da aba Lojistas: se no navegador, cada pessoa vê só a sua; se em servidor, precisa de login."])]

# ---- 4. nutre ----
story+= [Spacer(1,4),secao("4","NuTre (já está seguro — reforços opcionais)",MENTA),
         passos(["<b>Limite de gasto</b> na chave: Console da Anthropic → Settings → Limits → definir um teto mensal.",
                 "<b>Trocar a chave a cada poucos meses</b>: gerar a nova no Console, substituir <font name='DVM'>ANTHROPIC_API_KEY</font> "
                 "na Vercel, publicar de novo e revogar a antiga.",
                 "<b>Senha forte</b> em <font name='DVM'>APP_SENHA</font> (frase longa); trocar se alguém que tinha acesso deixar de precisar."]),
         Spacer(1,6),
         nota("<b>Regra de bolso.</b> Precisa de senha quando o app tem dado real ou interno, grava em banco ou servidor, ou chama uma API com chave. "
              "Pode circular aberto quando roda só no navegador, não tem chave nem banco e o conteúdo da página pode ser público. "
              "<b>Na dúvida, feche.</b> Chave vazada: revogue primeiro, investigue depois.")]

def fundo(c,doc):
    c.saveState()
    if doc.page==1:
        c.setFillColor(PET); c.rect(0,H-30*mm,W,30*mm,stroke=0,fill=1)
        c.setFillColor(AMB); c.rect(0,H-30*mm,W,1.6*mm,stroke=0,fill=1)
        c.setFillColor(WHITE); c.setFont("DVB",18); c.drawString(M,H-15*mm,"Segurança dos apps — passo a passo")
        c.setFillColor(AREIA); c.setFont("DV",9.5); c.drawString(M,H-22*mm,"O que fazer para deixar seguros os apps da demonstração · para imprimir e marcar")
    else:
        c.setFillColor(PET); c.rect(0,H-12*mm,W,12*mm,stroke=0,fill=1)
        c.setFillColor(WHITE); c.setFont("DVB",10); c.drawString(M,H-8*mm,"Segurança dos apps — passo a passo")
    c.setFillColor(VER); c.rect(0,0,W,10*mm,stroke=0,fill=1)
    c.setFillColor(AREIA); c.setFont("DV",7.5)
    c.drawString(M,4*mm,"Nunca cole chave, senha ou dado real no chat, no código ou em print. A decisão continua humana.")
    c.setFillColor(AMB); c.setFont("DVB",7.5); c.drawRightString(W-M,4*mm,f"{doc.page}")
    c.restoreState()

doc=BaseDocTemplate(out,pagesize=A4,leftMargin=M,rightMargin=M,topMargin=M,bottomMargin=14*mm,
                    title="Segurança dos apps — passo a passo",author="Workshop Shopping Inteligente")
f1=Frame(M,14*mm,W-2*M,H-30*mm-14*mm-6*mm,id="f1")
f2=Frame(M,14*mm,W-2*M,H-12*mm-14*mm-6*mm,id="f2")
doc.addPageTemplates([PageTemplate(id="p1",frames=[f1],onPage=fundo,autoNextPageTemplate="p2"),
                      PageTemplate(id="p2",frames=[f2],onPage=fundo)])
doc.build(story)
print("gerado:",out)
