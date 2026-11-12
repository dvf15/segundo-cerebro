"""
Grava demo/base-ficticia.xlsx: a base fictícia de teste em Excel, para o time.
Uso: python3 scripts/gerar-base-excel.py  (precisa de node e openpyxl; DATA=aaaa-mm-dd fixa o dia)
Abas: LEIA-ME, Resumo (fórmulas), Lojistas (importável no app), Roteiro de testes,
Auditoria fiscal, Triangulação e Societário, com o status que o app calcula.
"""
import json, subprocess
from pathlib import Path
from datetime import date
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment
from openpyxl.formatting.rule import FormulaRule

raiz = Path(__file__).resolve().parent.parent
d = json.loads(subprocess.run(['node', str(raiz / 'scripts' / 'exportar-base.mjs')], capture_output=True, check=True, text=True).stdout)
saida = raiz / 'demo' / 'base-ficticia.xlsx'
F = 'Arial'
fonte = Font(name=F, size=10); negrito = Font(name=F, size=10, bold=True)
cab_font = Font(name=F, size=10, bold=True, color='FFFFFF'); cab_fill = PatternFill('solid', fgColor='1F3A5F')
tit = Font(name=F, size=14, bold=True); sub = Font(name=F, size=10, italic=True, color='555555')
tot_fill = PatternFill('solid', fgColor='E8EEF5')
borda = Border(bottom=Side(style='thin', color='D0D7E2'))
DATA = 'dd/mm/yyyy'; MOEDA = 'R$ #,##0.00;-R$ #,##0.00;-'; PCT = '0.00%'

def dt(s):
    if not s: return None
    y, m, dd = str(s)[:10].split('-'); return date(int(y), int(m), int(dd))
def cnpj(c): return f'{c[:2]}.{c[2:5]}.{c[5:8]}/{c[8:12]}-{c[12:]}'
def comp(c): return f'{c[5:7]}/{c[:4]}'
lojas = {l['cnpj']: l for l in d['lojistas']}

wb = Workbook()
def aba(nome, titulo, nota, cab, larguras, linha0=4):
    ws = wb.create_sheet(nome)
    ws['A1'] = titulo; ws['A1'].font = tit
    ws['A2'] = nota; ws['A2'].font = sub
    for i, (h, w) in enumerate(zip(cab, larguras), 1):
        c = ws.cell(row=linha0, column=i, value=h); c.font = cab_font; c.fill = cab_fill
        c.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[linha0].height = 30
    ws.freeze_panes = ws.cell(row=linha0 + 1, column=3)
    return ws
def linha(ws, r, valores, fmts={}):
    for i, v in enumerate(valores, 1):
        c = ws.cell(row=r, column=i, value=v); c.font = fonte; c.border = borda
        if i in fmts: c.number_format = fmts[i]
def filtro(ws, linha0, ultima, ncol):
    ws.auto_filter.ref = f'A{linha0}:{get_column_letter(ncol)}{ultima}'

# ---------------- LEIA-ME
ws = wb.active; ws.title = 'LEIA-ME'
ws.column_dimensions['A'].width = 4; ws.column_dimensions['B'].width = 110
txt = [
 ('t', 'Radar de Auditoria 2.1 — base de teste (fictícia)'),
 ('s', f"Gerada em {dt(d['geradaEm']).strftime('%d/%m/%Y')} · ciclo {d['ciclo']['ano']} (livros de {d['ciclo']['livros']}), aberto em {dt(d['ciclo']['inicio']).strftime('%d/%m/%Y')} · {d['prefs']['shopping']}"),
 ('', ''),
 ('b', 'Tudo aqui é inventado: empresas, CNPJs (com dígito verificador válido), contatos e valores.'),
 ('', ''),
 ('h', 'Abas'),
 ('', 'Lojistas — a carteira (40 lojistas). Pode ser arrastada direto na aba Lojistas do app: as colunas são reconhecidas pelo cabeçalho.'),
 ('', f'Roteiro de testes — {len(d["cenarios"])} cenários fixos: loja a loja, o que o app deve mostrar e em qual aba. Coluna "Resultado do teste" para o time preencher.'),
 ('', 'Auditoria fiscal — ciclo anual: marcos (recebido, auditado, negociado, cobrado), notificações e valores, com o status que o app calcula.'),
 ('', 'Triangulação — meses fechados: redução Z, PDV, NAPP e declarado; maior valor (em destaque), variação e não declarado em R$ por fórmula (mesma regra do app).'),
 ('', 'Societário — pesquisa na Junta, checklist da skill, mudança societária, validação de isenção/limite e taxa de transferência.'),
 ('', 'Resumo — contagens por status, por fórmula sobre as outras abas.'),
 ('', ''),
 ('h', 'Como testar no app'),
 ('', 'Opção 1 (completa): aba Lojistas → "Carregar base fictícia". O app gera exatamente esta base, com a data do dia. Depois confira o roteiro.'),
 ('', 'Opção 2 (só a carteira): aba Lojistas → arraste este arquivo Excel. O app acha a aba Lojistas e importa os 40, sem marcos, fechamentos nem societário.'),
 ('', 'Na opção 2 a coluna Situação não é lida: o lojista inativo entra como ativo — desative-o na aba Lojistas do app, se quiser reproduzir a base.'),
 ('', 'Os marcos, fechamentos e o societário não são importados do Excel: o app só restaura o acompanhamento completo pelo JSON (Painel → Restaurar cópia).'),
 ('', ''),
 ('h', 'Legenda'),
 ('', 'Status: texto exatamente como o app mostra no dia da geração. Datas relativas a hoje: abrir em outro dia pode mudar etapas devidas e a janela de 12 meses.'),
 ('', 'Células cinza-azuladas no fim das tabelas = totais por fórmula. Coluna amarela no Roteiro = para o time preencher.'),
 ('', 'Variação = maior − menor e não declarado = maior − declarado, em R$, entre os tipos presentes (Z, PDV, NAPP, declarado); com menos de dois fica vazia.'),
]
for i, (k, t) in enumerate(txt, 1):
    c = ws.cell(row=i, column=2, value=t); c.alignment = Alignment(wrap_text=True, vertical='top')
    c.font = tit if k == 't' else sub if k == 's' else Font(name=F, size=11, bold=True, color='1F3A5F') if k == 'h' else negrito if k == 'b' else fonte
    if len(t) > 100: ws.row_dimensions[i].height = 15 * (len(t) // 100 + 1)   # quebra de linha visível sem depender do autoajuste

# ---------------- Lojistas (mesmo cabeçalho do CSV que o app importa)
cab = ['LUC', 'Loja', 'Razão Social', 'CNPJ', 'UF', 'Início do contrato', 'E-mail', 'WhatsApp', 'Regime', 'Segmento', 'Situação']
ws = wb.create_sheet('Lojistas')
for i, (h, w) in enumerate(zip(cab, [7, 28, 36, 20, 5, 17, 40, 15, 17, 14, 10]), 1):
    c = ws.cell(row=1, column=i, value=h); c.font = cab_font; c.fill = cab_fill
    ws.column_dimensions[get_column_letter(i)].width = w
ws.freeze_panes = 'C2'
for r, l in enumerate(d['lojistas'], 2):
    linha(ws, r, [l['luc'], l['nome'], l['razao'], cnpj(l['cnpj']), l.get('uf') or '', dt(l.get('inicioContrato')),
                  l.get('email') or '', l.get('telefone') or '', 'Simples Nacional' if l.get('regime') == 'simples' else 'Lucro presumido',
                  l.get('segmento') or '', 'inativo' if l.get('ativo') is False else 'ativo'], {6: DATA})
    ws.cell(row=r, column=1).number_format = '@'; ws.cell(row=r, column=8).number_format = '@'
filtro(ws, 1, len(d['lojistas']) + 1, len(cab))

# ---------------- Roteiro
cab = ['#', 'Loja', 'CNPJ', 'Processo', 'O que deve aparecer', 'Onde', 'Resultado do teste (ok / divergiu)', 'Observação do time']
ws = aba('Roteiro de testes', f'Roteiro de testes — {len(d["cenarios"])} cenários fixos', 'Carregue a base no app (Lojistas → Carregar base fictícia) e confira cada linha. Preencha as colunas amarelas.',
         cab, [5, 28, 20, 17, 70, 26, 18, 36])
amarelo = PatternFill('solid', fgColor='FFF4C2')
for i, c in enumerate(d['cenarios'], 1):
    r = 4 + i
    linha(ws, r, [i, c['loja'], cnpj(c['cnpj']), c['processo'], c['situacao'], c['onde'], None, None])
    ws.cell(row=r, column=5).alignment = Alignment(wrap_text=True, vertical='top')
    for col in (7, 8): ws.cell(row=r, column=col).fill = amarelo
ultima = 4 + len(d['cenarios']); filtro(ws, 4, ultima, len(cab))
r = ultima + 2
ws.cell(row=r, column=6, value='Testados').font = negrito
ws.cell(row=r, column=7, value=f'=COUNTA(G5:G{ultima})').font = negrito
ws.cell(row=r + 1, column=6, value='Com divergência').font = negrito
ws.cell(row=r + 1, column=7, value=f'=COUNTIF(G5:G{ultima},"divergiu*")').font = negrito
ws.cell(row=r, column=7).comment = Comment('Conta as linhas da coluna G preenchidas.', 'Radar')

# ---------------- Auditoria fiscal
et = d['etapas']
cab = ['LUC', 'Loja', 'CNPJ', 'Status (app)', 'Etapa devida agora', 'Recebido', 'Auditado', 'Negociado', 'Cobrado'] + \
      [e[1] for e in et] + ['Divergência apurada (R$)', 'Negociado (R$)', 'Cobrado (R$)', 'Observação']
ws = aba('Auditoria fiscal', f"Auditoria fiscal — ciclo {d['ciclo']['ano']} (livros de {d['ciclo']['livros']})",
         'Status e etapa devida exatamente como o app calcula no dia da geração. Valores negociado/cobrado são os lançados pelo time.',
         cab, [7, 28, 20, 15, 18, 11, 11, 11, 11] + [11] * len(et) + [16, 15, 15, 20])
fd = {i: DATA for i in range(6, 10 + len(et))}
n0 = 10 + len(et)
for k in (n0, n0 + 1, n0 + 2): fd[k] = MOEDA
for i, x in enumerate(d['fiscal']):
    l = x['l']; g = x['r']; v = g.get('valores') or {}; nt = g.get('notificacoes') or {}
    linha(ws, 5 + i, [l['luc'], l['nome'], cnpj(l['cnpj']), x['status'], x['devida'] + (f" ({x['atrasadas']} acumuladas)" if x['atrasadas'] > 1 else ''),
                      dt(g.get('recebido')), dt(g.get('auditado')), dt(g.get('negociado')), dt(g.get('cobrado'))] +
                     [dt(nt.get(e[0])) for e in et] + [v.get('divergencia'), v.get('negociado'), v.get('cobrado'), g.get('obs') or ''], fd)
ultima = 4 + len(d['fiscal']); filtro(ws, 4, ultima, len(cab))
t = ultima + 1
ws.cell(row=t, column=2, value='Total / contagem')
for col in range(6, n0):
    L = get_column_letter(col); ws.cell(row=t, column=col, value=f'=COUNT({L}5:{L}{ultima})')
for col in (n0, n0 + 1, n0 + 2):
    L = get_column_letter(col); c = ws.cell(row=t, column=col, value=f'=SUM({L}5:{L}{ultima})'); c.number_format = MOEDA
for col in range(1, len(cab) + 1):
    c = ws.cell(row=t, column=col); c.font = negrito; c.fill = tot_fill

# ---------------- Triangulação
cab = ['Competência', 'LUC', 'Loja', 'CNPJ', 'Redução Z (R$)', 'PDV (R$)', 'NAPP (R$)', 'Declarado (R$)', 'Maior valor (R$)', 'Tipo do maior valor',
       'Variação R$ (maior − menor)', 'Não declarado R$ (maior − declarado)', 'Status (app)', 'Alertas', 'Dias com Z', 'Dias com PDV', 'Dias com NAPP', 'Fechado em']
ws = aba('Triangulação', 'Triangulação — meses fechados', 'Maior valor, variação e não declarado por fórmula, em R$. O maior valor de cada linha fica em destaque. Status como o app classificou (pela variação em R$).',
         cab, [11, 7, 28, 20, 15, 15, 15, 15, 15, 16, 16, 18, 14, 50, 9, 9, 9, 11])
ws.freeze_panes = 'E5'
NOMES_TRI = {'z': 'Redução Z', 'pdv': 'PDV', 'napp': 'NAPP', 'declarado': 'Declarado'}
fech = sorted(d['fechamentos'], key=lambda f: (f['competencia'], lojas.get(f['cnpj'], {}).get('luc', '')))
for i, f in enumerate(fech):
    r = 5 + i; l = lojas.get(f['cnpj'], {'luc': '', 'nome': f['cnpj']})
    linha(ws, r, [comp(f['competencia']), l['luc'], l['nome'], cnpj(f['cnpj']), f.get('z'), f.get('pdv'), f.get('napp'), f.get('declarado'),
                  f'=IF(COUNT(E{r}:H{r})=0,"",MAX(E{r}:H{r}))',
                  ' e '.join(NOMES_TRI.get(k, k) for k in (f.get('fonteMaior') or [])),
                  f'=IF(COUNT(E{r}:H{r})<2,"",MAX(E{r}:H{r})-MIN(E{r}:H{r}))',
                  f'=IF(OR(H{r}="",COUNT(E{r}:H{r})<2),"",MAX(0,MAX(E{r}:H{r})-H{r}))',
                  f.get('status'), '; '.join(a if isinstance(a, str) else a.get('texto', str(a)) for a in (f.get('alertas') or [])),
                  f.get('diasZ'), f.get('diasPdv'), f.get('diasNapp'), dt(f.get('fechadoEm'))], {5: MOEDA, 6: MOEDA, 7: MOEDA, 8: MOEDA, 9: MOEDA, 11: MOEDA, 12: MOEDA, 18: DATA})
ultima = 4 + len(fech); filtro(ws, 4, ultima, len(cab))
# o maior valor da linha em destaque (só quando os tipos de lançamento diferem)
ws.conditional_formatting.add(f'E5:H{ultima}', FormulaRule(formula=['AND(E5<>"",E5=MAX($E5:$H5),$K5<>"",$K5>0)'],
    font=Font(name=F, size=10, bold=True, color='1F3A5F'), fill=PatternFill('solid', fgColor='DCE8F7')))

# ---------------- Societário
cab = ['LUC', 'Loja', 'CNPJ', 'UF', 'Início do contrato', 'Status (app)', 'Checklist', 'Motivo da pesquisa', 'NIRE', 'NIRE confirmado', 'Atos listados',
       'Consultado em', 'Indício na triagem', 'Protocolo', 'Guia paga em', 'Certidão baixada em', 'Houve mudança', 'Data da alteração', 'Causa',
       'O que mudou', 'Isenção no contrato', 'Limite contratual', 'Validado em', 'Cobrar', 'Taxa prevista (R$)', 'Negociado (R$)', 'Cobrado (R$)',
       'Etapa da taxa devida', 'Encaminhado em']
ws = aba('Societário', 'Societário — mudança societária e taxa de transferência', 'Status e checklist (itens feitos / 7) exatamente como o app calcula no dia da geração.',
         cab, [7, 28, 20, 5, 12, 26, 9, 24, 13, 9, 9, 12, 10, 13, 12, 12, 9, 12, 30, 36, 10, 30, 12, 8, 15, 15, 15, 18, 12])
sn = lambda v: '' if v is None else ('sim' if v is True else 'não' if v is False else v)
for i, x in enumerate(d['soc']):
    l = x['l']; g = x['r']; v = g.get('valores') or {}
    linha(ws, 5 + i, [l['luc'], l['nome'], cnpj(l['cnpj']), l.get('uf') or '', dt(l.get('inicioContrato')), x['status'], x['checklist'], x['motivo'],
                      g.get('nire') or '', sn(g.get('nireConfirmado')), sn(g.get('atosListados')), dt(g.get('consultadoEm')), sn(g.get('indicio')),
                      g.get('protocolo') or g.get('guiaNumero') or '', dt(g.get('guiaPagaEm')), dt(g.get('certidaoBaixadaEm')), sn(g.get('houveMudanca')),
                      dt(g.get('dataMudanca')), x['tipo'], g.get('descricao') or '', sn(g.get('isencao')), g.get('limite') or '', dt(g.get('validadoEm')),
                      sn(g.get('cobrar')), v.get('taxa'), v.get('negociado'), v.get('cobrado'), x['devida'], dt(g.get('encaminhadoEm'))],
         {5: DATA, 12: DATA, 15: DATA, 16: DATA, 18: DATA, 23: DATA, 25: MOEDA, 26: MOEDA, 27: MOEDA, 29: DATA})
    ws.cell(row=5 + i, column=9).number_format = '@'
ultima = 4 + len(d['soc']); filtro(ws, 4, ultima, len(cab))
t = ultima + 1; ws.cell(row=t, column=2, value='Total')
for col in (25, 26, 27):
    L = get_column_letter(col); ws.cell(row=t, column=col, value=f'=SUM({L}5:{L}{ultima})').number_format = MOEDA
for col in range(1, len(cab) + 1):
    c = ws.cell(row=t, column=col); c.font = negrito; c.fill = tot_fill

# ---------------- Resumo (fórmulas)
ws = wb.create_sheet('Resumo', 1)
ws['A1'] = 'Resumo da base de teste'; ws['A1'].font = tit
ws['A2'] = 'Contagens por fórmula sobre as outras abas — mudam se você editar os status.'; ws['A2'].font = sub
ws.column_dimensions['A'].width = 40; ws.column_dimensions['B'].width = 14
nf = 4 + len(d['fiscal']); ns = 4 + len(d['soc']); nt_ = 4 + len(fech)
r = 4
def bloco(titulo, rotulos, rng):
    global r
    ws.cell(row=r, column=1, value=titulo).font = Font(name=F, size=11, bold=True, color='1F3A5F'); r += 1
    for s in rotulos:
        ws.cell(row=r, column=1, value=s).font = fonte
        ws.cell(row=r, column=2, value=f'=COUNTIF({rng},"{s}")').font = fonte; r += 1
    r += 1
bloco('Auditoria fiscal — lojistas por status', ['NÃO RECEBIDO', 'RECEBIDO', 'AUDITADO', 'NEGOCIADO', 'COBRADO', 'INATIVO'], f"'Auditoria fiscal'!D5:D{nf}")
bloco('Triangulação — meses fechados por status', sorted({f['status'] for f in fech}), f"'Triangulação'!M5:M{nt_}")
bloco('Societário — lojistas por status', ['NÃO CONSULTADO', 'SEM INDÍCIO (TRIAGEM)', 'SEM MUDANÇA', 'ANTERIOR AO CONTRATO', 'OUTRA ALTERAÇÃO (NÃO É TT)',
      'INFORME A DATA DA ALTERAÇÃO', 'MUDANÇA NOS ÚLTIMOS 12 MESES', 'ISENTO', 'TAXA EM COBRANÇA', 'NEGOCIADO', 'COBRADO', 'INATIVO'], f"'Societário'!F5:F{ns}")
ws.cell(row=r, column=1, value='Valores').font = Font(name=F, size=11, bold=True, color='1F3A5F'); r += 1
L0 = get_column_letter(10 + len(et))
for rot, f_ in [('Divergência apurada — auditoria fiscal', f"=SUM('Auditoria fiscal'!{L0}5:{L0}{nf})"),
                ('Cobrado — auditoria fiscal', f"=SUM('Auditoria fiscal'!{get_column_letter(12 + len(et))}5:{get_column_letter(12 + len(et))}{nf})"),
                ('TT prevista — societário', f"=SUM('Societário'!Y5:Y{ns})"), ('TT cobrada — societário', f"=SUM('Societário'!AA5:AA{ns})")]:
    ws.cell(row=r, column=1, value=rot).font = fonte; c = ws.cell(row=r, column=2, value=f_); c.font = fonte; c.number_format = MOEDA; r += 1
ws.column_dimensions['B'].width = 18
# impressão: paisagem, cabendo na largura da folha
for folha in wb.worksheets:
    folha.page_setup.orientation = 'landscape'
    folha.sheet_properties.pageSetUpPr.fitToPage = True
    folha.page_setup.fitToWidth = 1
    folha.page_setup.fitToHeight = 0
wb.save(saida); print('ok', saida)
