# Monta base-teste.xlsx a partir de base-teste.json (abas Lojas, Parametros, Historico, Cenarios, Instrucoes)
import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
d = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(d, 'base-teste.json'), encoding='utf-8'))
sn = lambda b: 'sim' if b else 'não'
COLS = [
 ('LUC', lambda l: l['luc']), ('Nome fantasia', lambda l: l['nome']), ('CNPJ', lambda l: l['cnpj']), ('Segmento', lambda l: l['segmento']), ('Piso', lambda l: l['piso']), ('Área m²', lambda l: l['area']), ('Formato', lambda l: l['formato']),
 ('Key Account', lambda l: sn(l.get('keyAccount'))), ('Mix', lambda l: l.get('mix') or ''), ('Mix validado pelo comitê', lambda l: sn(l.get('mixValidado'))), ('Cluster', lambda l: l.get('cluster','')), ('Status', lambda l: l['status']),
 ('Início vigência', lambda l: l['contrato'].get('inicio','')), ('Fim vigência', lambda l: l['contrato'].get('fim','')), ('Último reajuste', lambda l: l['contrato'].get('ultimoReajuste','')), ('Índice', lambda l: l['contrato'].get('indice','')), ('Degrau', lambda l: l['contrato'].get('degrau','')), ('Fator aluguel %', lambda l: l['contrato'].get('fatorPercentual','')), ('Contrato comercial', lambda l: sn(l['contrato'].get('comercial', True))), ('Inflação acumulada %', lambda l: l.get('inflacaoAcumuladaPct','')), ('Cláusulas especiais', lambda l: ', '.join(l['contrato'].get('clausulasEspeciais',[]))), ('Subsídios', lambda l: ', '.join(l['contrato'].get('subsidios',[]))),
 ('AMM último mês', lambda l: l['faturamento'].get('amm','')), ('A% médio sem dezembro', lambda l: l['faturamento'].get('aPctMedioSemDezembro','')), ('Vendas média 12m expurgada', lambda l: l['desempenho'].get('vendas12mExpurgada','')), ('Custo de ocupação', lambda l: l['desempenho'].get('custoOcupacao','')), ('Meses inadimplente', lambda l: l['desempenho'].get('mesesInadimplente','')), ('Saldo em aberto', lambda l: l['desempenho'].get('saldoAberto','')),
 ('Última auditoria integral', lambda l: l['auditoria'].get('ultimaIntegral','')), ('Dispersão %', lambda l: l['auditoria'].get('dispersaoPct','')), ('Livros fiscais', lambda l: l['auditoria'].get('statusLivros','')), ('Ação contra o shopping', lambda l: sn(l['juridico'].get('acaoContraShopping'))), ('Renovatória ajuizada', lambda l: sn(l['juridico'].get('renovatoriaAjuizada'))), ('Lojista resistente', lambda l: sn(l.get('negociacao',{}).get('resistencia'))),
 ('CO/Vendas rede %', lambda l: l['comparativos'].get('coVendasRedePct','')), ('CO/Vendas segmento shopping %', lambda l: l['comparativos'].get('coVendasSegmentoShoppingPct','')), ('AMM/m² entorno', lambda l: l['comparativos'].get('ammM2Entorno','')), ('AMM/m² piso', lambda l: l['comparativos'].get('ammM2Piso','')), ('AMM/m² tamanho', lambda l: l['comparativos'].get('ammM2Tamanho','')), ('AMM/m² concorrentes', lambda l: l['comparativos'].get('ammM2Concorrentes','')), ('AMM/m² segmento Abrasce', lambda l: l['comparativos'].get('ammM2SegmentoAbrasce','')), ('Tabela ABC R$/m²', lambda l: l['comparativos'].get('tabelaAbcM2','')),
 ('AMM novo (realizado)', lambda l: l['realizado'].get('ammNovo','')), ('Data renovação', lambda l: l['realizado'].get('data','')), ('Nova vigência até', lambda l: l['realizado'].get('novoFim','')),
]
hdr = Font(bold=True, color='FFFFFF'); fill = PatternFill('solid', fgColor='00616F')
def cab(ws, names, widths=None):
    for i, c in enumerate(names, 1):
        cell = ws.cell(row=1, column=i, value=c); cell.font = hdr; cell.fill = fill; cell.alignment = Alignment(wrap_text=True, vertical='center')
        ws.column_dimensions[get_column_letter(i)].width = (widths[i-1] if widths else max(12, min(26, len(c) + 2)))
    ws.row_dimensions[1].height = 32; ws.freeze_panes = 'C2'
wb = Workbook(); ws = wb.active; ws.title = 'Lojas'; cab(ws, [c for c, _ in COLS])
for r, l in enumerate(base['lojas'], 2):
    for i, (_, f) in enumerate(COLS, 1):
        v = f(l); ws.cell(row=r, column=i, value=None if v is None else v)
wp = wb.create_sheet('Parametros'); cab(wp, ['Parâmetro', 'Valor'], [30, 22])
P = base['params']
for r, (k, v) in enumerate([('Shopping', P['shopping']), ('Média AMM/m² satélites', P['mediaAmmM2Satelites']), ('Média Vendas/m² satélites', P['mediaVendasM2Satelites']), ('Inflação acumulada %', P['inflacaoAcumuladaPct']), ('Meta LSR anual %', P['metaLsrAnualPct']), ('Ano planejamento', P['anoPlanejamento']), ('Janela auditoria meses', P['janelaAuditoriaMeses']), ('Tolerância dispersão %', P['toleranciaDispersaoPct']), ('Meses sazonais', ', '.join(map(str, P['mesesSazonais'])))], 2):
    wp.cell(row=r, column=1, value=k); wp.cell(row=r, column=2, value=v)
wh = wb.create_sheet('Historico'); cab(wh, ['LUC', 'Competência', 'Vendas', 'AMM', 'A%', 'Custo de ocupação'], [10, 14, 14, 12, 12, 18])
r = 2
for l in base['lojas']:
    for h in l.get('historico', []):
        for i, v in enumerate([l['luc'], h['competencia'], h['vendas'], h['amm'], h['aPct'], h['custoOcupacao']], 1): wh.cell(row=r, column=i, value=v)
        r += 1
wc = wb.create_sheet('Cenarios'); cab(wc, ['LUC', 'Loja', 'O que testa'], [10, 28, 110])
for r, l in enumerate(base['lojas'], 2):
    wc.cell(row=r, column=1, value=l['luc']); wc.cell(row=r, column=2, value=l['nome']); wc.cell(row=r, column=3, value=l['cenario'])
wi = wb.create_sheet('Instrucoes'); wi.column_dimensions['A'].width = 120
for r, t in enumerate(['Base fictícia de teste do Radar de Renovações', base['_aviso'], '1. No painel, aba Cadastro: Limpar base → Importar Excel → este arquivo.', '2. Aba Auditoria: importar dispersao-teste.csv.', '3. Data de referência no topo: 2026-10-25.', '4. Conferir cada loja com guia-de-teste.md (resultados esperados por loja).', 'A aba Cenarios diz o que cada loja exercita. A planilha também serve de modelo para a base real: basta substituir as linhas.'], 1):
    wi.cell(row=r, column=1, value=t)
wi['A1'].font = Font(bold=True, size=13)
wb.save(os.path.join(d, 'base-teste.xlsx')); print('base-teste.xlsx', wb.sheetnames, 'historico linhas', r)
