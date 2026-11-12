"""
Grava demo/simulacao/00-roteiro-de-simulacao.xlsx a partir do que
scripts/conferir-simulacao.mjs conferiu no app (demo/simulacao/.resultado.json).
Uso: python3 scripts/gerar-roteiro-simulacao.py   (precisa de openpyxl)
"""
import json
from pathlib import Path
from datetime import date
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

raiz = Path(__file__).resolve().parent.parent
sim = raiz / 'demo' / 'simulacao'
res = json.loads((sim / '.resultado.json').read_text(encoding='utf-8'))
cen = json.loads((sim / '.cenarios.json').read_text(encoding='utf-8'))

F = 'Arial'
fonte = Font(name=F, size=10); negrito = Font(name=F, size=10, bold=True)
cab_font = Font(name=F, size=10, bold=True, color='FFFFFF'); cab_fill = PatternFill('solid', fgColor='1F3A5F')
tit = Font(name=F, size=14, bold=True); sub = Font(name=F, size=10, italic=True, color='555555')
secao = Font(name=F, size=11, bold=True, color='1F3A5F')
amarelo = PatternFill('solid', fgColor='FFF4C2'); passo_fill = PatternFill('solid', fgColor='E8EEF5')
borda = Border(bottom=Side(style='thin', color='D0D7E2'))
quebra = Alignment(wrap_text=True, vertical='top')
y, m, d = res['geradoEm'].split('-'); conferido = f'{d}/{m}/{y}'

def nome(chave): return cen['lojas'][chave]['nome']

# o que cada arquivo é e o que ele exercita
ARQUIVOS = [
  ('0-base/base-ficticia.json', 'JSON (cópia do acompanhamento)', '40 lojistas', 'Alternativa ao botão: Painel → Restaurar cópia. As datas são as do dia em que foi gerado.'),
  ('0-base/base-ficticia.xlsx', 'Excel', '40 lojistas', 'Consulta da base inteira (status calculados) e roteiro dos 27 cenários fixos. A aba Lojistas pode ser importada.'),
  ('1-carteira/lojistas-novos-e-com-erros.xlsx', 'Excel (carteira)', '3 novos + Bela', 'Importação: 3 novos, 1 atualizado (Bela), CNPJ inválido recusado, CNPJ repetido ignorado, lojista sem UF.'),
  ('2-auditoria/bela-livro-saidas-2025.pdf', 'PDF — livro impresso P1/P2', nome('BELA') + ' e quiosque', 'Jan–mar/2025: OK, DIVERGENTE (venda com ST fora da ficha), contra-lançamento 5929 explicado; quiosque com ATENÇÃO e SÓ NA APURAÇÃO.'),
  ('2-auditoria/bela-livro-entradas-2025.pdf', 'PDF — livro impresso P1/P2', nome('BELA') + ' e quiosque', 'Devoluções de venda deduzidas (1202, 1411).'),
  ('2-auditoria/trilha-sped-efd-2025-01.txt', 'SPED EFD ICMS/IPI (TXT)', nome('TRILHA'), 'Vendas em CF-e SAT (C850) = R$ 180.000; NF-e cancelada (COD_SIT 02) fica fora. Resultado OK.'),
  ('2-auditoria/trilha-sped-efd-2025-02.txt', 'SPED EFD ICMS/IPI (TXT)', nome('TRILHA'), 'Devolução de R$ 3.000 deduzida; ficha R$ 1.500 abaixo (0,96%): ATENÇÃO.'),
  ('2-auditoria/trilha-sped-efd-2025-03.txt', 'SPED EFD ICMS/IPI (TXT)', nome('TRILHA'), 'Venda com ST (5405) de R$ 25.000 fora da ficha: DIVERGENTE.'),
  ('2-auditoria/urbano-resumo-cst-cfop-saidas-2025.pdf', 'PDF — resumo por CST/CFOP', nome('URBANO'), 'Jan: OK com alerta de CFOP 5949 (genérico, revisão manual) e 5910 fora da venda. Fev: DIVERGENTE (10,3%).'),
  ('2-auditoria/urbano-resumo-cst-cfop-entradas-2025.pdf', 'PDF — resumo por CST/CFOP', nome('URBANO'), 'Devoluções 1202 deduzidas; compras 1102 não mexem na venda.'),
  ('2-auditoria/cafe-aurora-extrato-pgdas-d-2025-12.pdf', 'PDF — extrato do Simples (PGDAS-D)', nome('CAFE'), 'Empresa do Simples: 13 competências (histórico 12/2024–11/2025 + PA 12/2025). Maio/2025 DIVERGENTE; 12/2024 SÓ NA APURAÇÃO.'),
  ('2-auditoria/otica-livro-fiscal-planilha-2025.xlsx', 'Excel — livro exportado do sistema', nome('OTICA'), 'Jan OK (ficha em duas linhas, somadas e avisadas); mar SÓ NO INFORMADO; abr SÓ NA APURAÇÃO; mai LIVRO INCOMPLETO (só entradas).'),
  ('2-auditoria/ficha-vendas-informadas-2025.xlsx', 'Excel — ficha de vendas informadas', '6 lojistas', 'O informado de 2025 de todos os cenários acima; uma linha sem CNPJ, recusada com aviso.'),
  ('3-triangulacao/lume-joias-reducao-z-2026-10.pdf', 'PDF — cupons de redução Z', nome('LUME'), '25 dias; Z = PDV = ficha: COERENTE.'),
  ('3-triangulacao/lume-joias-pdv-2026-10.pdf', 'PDF — relatório de PDV', nome('LUME'), 'Vendas por dia e forma de pagamento.'),
  ('3-triangulacao/vertice-calcados-reducao-z-2026-10.pdf', 'PDF — cupons de redução Z', nome('VERTICE'), 'Dias 8 a 12: PDV acima da Z (venda sem cupom): DISPERSO, dias marcados no dia a dia.'),
  ('3-triangulacao/vertice-calcados-pdv-2026-10.pdf', 'PDF — relatório de PDV', nome('VERTICE'), 'PDV R$ 8.500 acima da Z no mês.'),
  ('3-triangulacao/mundo-pet-reducao-z-2026-10.pdf', 'PDF — cupons de redução Z', nome('MUNDOPET'), 'Falta a Z do dia 15: o CRZ pula e o Grande Total denuncia; DISPERSO.'),
  ('3-triangulacao/mundo-pet-pdv-2026-10.pdf', 'PDF — relatório de PDV', nome('MUNDOPET'), '25 dias de PDV contra 24 de Z.'),
  ('3-triangulacao/raiz-natural-reducao-z-2026-10.pdf', 'PDF — cupons de redução Z', nome('RAIZ'), 'Só a Z, sem PDV nem ficha: FONTE ÚNICA.'),
  ('3-triangulacao/bambu-decor-reducao-z-foto-01-10-2026.jpg', 'Foto (JPG) da redução Z', nome('BAMBU'), 'Leitura por OCR — precisa de internet. Conferir valor por valor.'),
  ('3-triangulacao/bambu-decor-reducao-z-foto-02-10-2026.jpg', 'Foto (JPG) da redução Z', nome('BAMBU'), 'Idem.'),
  ('3-triangulacao/bambu-decor-reducao-z-foto-03-10-2026.jpg', 'Foto (JPG) da redução Z', nome('BAMBU'), 'Idem.'),
  ('3-triangulacao/bambu-decor-pdv-2026-10.pdf', 'PDF — relatório de PDV', nome('BAMBU'), '3 dias, iguais às fotos da Z e à ficha: COERENTE.'),
  ('3-triangulacao/trilha-reducao-z-2025-01.pdf', 'PDF — cupons de redução Z', nome('TRILHA'), 'Janeiro/2025 para o cruzamento final com o SPED: as 4 fontes fecham.'),
  ('3-triangulacao/trilha-pdv-2025-01.pdf', 'PDF — relatório de PDV', nome('TRILHA'), 'Idem.'),
  ('3-triangulacao/bela-reducao-z-marco-2025.pdf', 'PDF — cupons de redução Z', nome('BELA'), 'Março/2025: Z do dia 20 ausente; PDV acima da Z nos dias 12 a 14; cruzamento INVESTIGAR.'),
  ('3-triangulacao/bela-pdv-marco-2025.pdf', 'PDF — relatório de PDV', nome('BELA'), 'Idem.'),
  ('3-triangulacao/napp-vendas-diarias-2026-10.xlsx', 'Excel — NAPP diário (pelo número da loja)', '3 lojistas + 1 fora da carteira', 'Lume: igual à Z (COERENTE). Vértice: igual ao PDV, os dois empatam no maior valor. Mundo Pet: NAPP é o maior (dias 1–5 acima do PDV). Loja 999 fora da carteira: aviso.'),
  ('3-triangulacao/ficha-vendas-informadas-2026-10.xlsx', 'Excel — ficha de vendas de 10/2026', '4 lojistas', 'O "declarado" da triangulação de outubro. Na Auditoria fiscal essas linhas aparecem como SÓ NO INFORMADO — é esperado.'),
]

wb = Workbook()

# ---------------- LEIA-ME
ws = wb.active; ws.title = 'LEIA-ME'
ws.column_dimensions['A'].width = 3; ws.column_dimensions['B'].width = 112
linhas = [
  (tit, 'Radar de Auditoria — simulação completa'),
  (sub, f'Conferida no app em {conferido}: o resultado esperado de cada passo foi o que o app mostrou nessa data.'),
  (fonte, ''),
  (negrito, 'Tudo aqui é fictício: empresas, CNPJs, valores. Os CNPJs são os da base fictícia do app.'),
  (fonte, ''),
  (secao, 'O que esta simulação cobre'),
  (fonte, '• Carteira: importação de planilha com lojistas novos, atualização, CNPJ inválido e repetido, lojista sem UF.'),
  (fonte, '• Painel, Notificações, Societário e Dashboard: a base fictícia (40 lojistas, 27 cenários fixos — ver base-ficticia.xlsx).'),
  (fonte, '• Auditoria fiscal: os 5 formatos de livro que o app lê — PDF impresso (P1/P2), SPED EFD, resumo por CST/CFOP, extrato do Simples (PGDAS-D) e planilha — mais a ficha de vendas.'),
  (fonte, '  Todos os status da conciliação: OK, ATENÇÃO, DIVERGENTE, SÓ NA APURAÇÃO, SÓ NO INFORMADO e LIVRO INCOMPLETO.'),
  (fonte, '• Triangulação: redução Z em PDF e em foto, relatório de PDV, NAPP em Excel diário, ficha do mês; maior valor em destaque, variação em R$; COERENTE, DISPERSO, FONTE ÚNICA, Z faltando (sequência do CRZ), fechamento do mês.'),
  (fonte, '• Cruzamento final: TUDO FECHA, ATENÇÃO, INVESTIGAR e FONTES DE MENOS.'),
  (fonte, ''),
  (secao, 'Como usar'),
  (fonte, '1. Abra o app (link ou arquivo radar-de-auditoria.html) num navegador limpo, ou apague a base fictícia antes.'),
  (fonte, '2. Siga a aba Roteiro na ordem: cada passo diz onde clicar, quais arquivos carregar e o que conferir.'),
  (fonte, '3. Marque nas colunas amarelas se o app mostrou o esperado. A aba Arquivos explica o cenário de cada arquivo.'),
  (fonte, ''),
  (secao, 'Cuidados'),
  (fonte, '• As fotos da redução Z (Bambu Decor) usam OCR, que baixa a biblioteca da internet na hora. Sem internet elas dão erro com aviso — o resto funciona offline.'),
  (fonte, f"• {'Nesta conferência o OCR rodou e foi conferido.' if res['ocr'] else 'Nesta conferência não havia internet: a leitura das fotos NÃO foi conferida. O resultado esperado da Bambu com as fotos é Z, PDV e ficha iguais (COERENTE).'}"),
  (fonte, '• Os status de Painel/Notificações da base dependem do dia em que ela é carregada (o ciclo anda com o calendário). Os arquivos de livros e da triangulação não mudam.'),
  (fonte, '• Outubro/2026 é a competência da rotina de triangulação. Se a base for carregada depois de outubro, ela já traz um fechamento de 10/2026; fechar de novo substitui.'),
]
for i, (fnt, t) in enumerate(linhas, 1):
    c = ws.cell(row=i, column=2, value=t); c.font = fnt; c.alignment = quebra
    if len(t) > 110: ws.row_dimensions[i].height = 15 * (len(t) // 110 + 1)

# ---------------- Roteiro
ws = wb.create_sheet('Roteiro')
cab = ['Passo', 'O que fazer', 'Onde no app', 'Arquivos', 'O que conferir', 'Deve aparecer', f'App em {conferido}', 'Resultado do time (ok / divergiu)', 'Observação do time']
larg = [6, 30, 26, 40, 40, 44, 12, 18, 30]
ws['A1'] = 'Roteiro da simulação completa'; ws['A1'].font = tit
ws['A2'] = 'Siga na ordem. Colunas amarelas para o time preencher.'; ws['A2'].font = sub
for i, (h, w) in enumerate(zip(cab, larg), 1):
    c = ws.cell(row=4, column=i, value=h); c.font = cab_font; c.fill = cab_fill; c.alignment = quebra
    ws.column_dimensions[get_column_letter(i)].width = w
ws.row_dimensions[4].height = 30
ws.freeze_panes = 'B5'
r = 5
for n, pa in enumerate(res['passos'], 1):
    arqs = '\n'.join(pa['arquivos']) if pa['arquivos'] else '—'
    for j, c in enumerate(pa['conferencias']):
        vals = [n if j == 0 else None, pa['titulo'] if j == 0 else None, pa['onde'] if j == 0 else None, arqs if j == 0 else None,
                c['item'], c['esperado'], 'ok' if c['ok'] else ('não conferido' if not c['obrigatorio'] else 'FALHOU'), None, None]
        for k, v in enumerate(vals, 1):
            cell = ws.cell(row=r, column=k, value=v); cell.font = negrito if (j == 0 and k <= 2) else fonte
            cell.alignment = quebra; cell.border = borda
            if j == 0 and k <= 4: cell.fill = passo_fill
        for k in (8, 9): ws.cell(row=r, column=k).fill = amarelo
        if j == 0 and pa['arquivos']: ws.row_dimensions[r].height = max(30, 13 * len(pa['arquivos']))
        r += 1
ultima = r - 1
ws.auto_filter.ref = f'A4:{get_column_letter(len(cab))}{ultima}'
r += 1
ws.cell(row=r, column=5, value='Conferências').font = negrito
ws.cell(row=r, column=6, value=f'=COUNTA(E5:E{ultima})').font = negrito
ws.cell(row=r + 1, column=5, value='Marcadas pelo time').font = negrito
ws.cell(row=r + 1, column=6, value=f'=COUNTA(H5:H{ultima})').font = negrito
ws.cell(row=r + 2, column=5, value='Divergências do time').font = negrito
ws.cell(row=r + 2, column=6, value=f'=COUNTIF(H5:H{ultima},"divergiu*")').font = negrito

# ---------------- Arquivos
ws = wb.create_sheet('Arquivos')
ws['A1'] = 'Os arquivos da simulação'; ws['A1'].font = tit
ws['A2'] = 'Cada arquivo no formato em que chega de verdade ao time.'; ws['A2'].font = sub
cab = ['Arquivo', 'Formato', 'Lojista', 'Cenário']
for i, (h, w) in enumerate(zip(cab, [52, 32, 28, 90]), 1):
    c = ws.cell(row=4, column=i, value=h); c.font = cab_font; c.fill = cab_fill
    ws.column_dimensions[get_column_letter(i)].width = w
for i, linha in enumerate(ARQUIVOS, 5):
    for k, v in enumerate(linha, 1):
        c = ws.cell(row=i, column=k, value=v); c.font = fonte; c.alignment = quebra; c.border = borda
ws.freeze_panes = 'B5'
ws.auto_filter.ref = f'A4:D{4 + len(ARQUIVOS)}'

faltam = [a[0] for a in ARQUIVOS if not (sim / a[0]).exists()]
assert not faltam, f'arquivos descritos que não existem: {faltam}'
saida = sim / '00-roteiro-de-simulacao.xlsx'
# impressão: paisagem, cabendo na largura da folha
for folha in wb.worksheets:
    folha.page_setup.orientation = 'landscape'
    folha.sheet_properties.pageSetUpPr.fitToPage = True
    folha.page_setup.fitToWidth = 1
    folha.page_setup.fitToHeight = 0
wb.save(saida); print('ok', saida)
