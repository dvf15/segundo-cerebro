from openpyxl import load_workbook
from datetime import datetime

wb = load_workbook('/mnt/user-data/outputs/Valor_Imovel_Casa4_IR.xlsx')
ws = wb['Lancamentos']

# Linhas atualmente preenchidas: 2-5 (4 lançamentos GoStudio + Bambu parc 1 e 2)
# Vou inserir a partir da linha 6 em ordem cronológica

# Estrutura das colunas:
# A: ID (fórmula), B: Data, C: Ano (fórmula), D: Mês (fórmula),
# E: Etapa, F: Categoria, G: Subcategoria, H: Descrição,
# I: Fornecedor, J: CPF/CNPJ, K: Tipo gasto, L: Forma pgto,
# M: Documento/NF, N: Nota?, O: Valor bruto,
# P-V: fórmulas (% e ativável), W: Link, X: Observações

novos = [
    # 1. Bambu NF 447 - Parcela 3
    {
        'data': datetime(2026, 1, 14),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Projeto arquitetura interiores Casa 4 Palm Hill - Parcela 03/04 (Proposta 25ARQ183)',
        'fornecedor': 'BAMBU.ARQ PROJETOS & GERENCIAMENTO LTDA - ME',
        'cpf_cnpj': '26.490.306/0001-67',
        'tipo_gasto': 'Projeto',
        'forma_pgto': 'PIX',
        'documento': 'NFS-e 00000447',
        'nota': 'Sim',
        'valor': 10400.00,
        'observacoes': 'NFS-e 00000447 emitida 14/01/2026. Parcela 3 de 4 (R$41.600 total). Cód. Serviço 01523 (Arquitetura).',
    },
    # 2. Fratelli NF 456 - Parcela 1 - PIX 12/02/2026 (data do pagamento)
    {
        'data': datetime(2026, 2, 12),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Elaboração de orçamentos da reforma Casa 4 Palm Hill - Parcela 01',
        'fornecedor': 'FRATELLI MONTEIRO SALVADOR INTERIORES LTDA',
        'cpf_cnpj': '17.032.879/0001-56',
        'tipo_gasto': 'Serviço',
        'forma_pgto': 'PIX',
        'documento': 'NFS-e 00000456',
        'nota': 'Sim',
        'valor': 7500.00,
        'observacoes': 'PIX 12/02/2026 R$7.500 (E60701190202602122154DY59V4XP088). NFS-e 00000456 emitida 25/02/2026. ⚠ Tomador na NF saiu como "NÃO INFORMADO" (apenas CPF). Solicitar reemissão com tomador correto.',
    },
    # 3. Bambu NF 454 - Parcela 4 (QUITADA)
    {
        'data': datetime(2026, 2, 24),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Projeto arquitetura interiores Casa 4 Palm Hill - Parcela 04/04 (QUITADA)',
        'fornecedor': 'BAMBU.ARQ PROJETOS & GERENCIAMENTO LTDA - ME',
        'cpf_cnpj': '26.490.306/0001-67',
        'tipo_gasto': 'Projeto',
        'forma_pgto': 'PIX',
        'documento': 'NFS-e 00000454',
        'nota': 'Sim',
        'valor': 10400.00,
        'observacoes': 'NFS-e 00000454 emitida 24/02/2026. Parcela 4 de 4 - PROPOSTA QUITADA. Total contratado R$41.600,00 (4x10.400). Cód. Serviço 01523.',
    },
    # 4. Fratelli NF 477 - Parcela 2
    {
        'data': datetime(2026, 4, 6),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Elaboração de orçamentos da reforma Casa 4 Palm Hill - Parcela 02',
        'fornecedor': 'FRATELLI MONTEIRO SALVADOR INTERIORES LTDA',
        'cpf_cnpj': '17.032.879/0001-56',
        'tipo_gasto': 'Serviço',
        'forma_pgto': 'PIX',
        'documento': 'NFS-e 00000477',
        'nota': 'Sim',
        'valor': 7500.00,
        'observacoes': 'NFS-e 00000477 emitida 06/04/2026. Cód. Serviço 01430 (Decoração) - mas serviço é orçamento de obra, considerar reclassificar.',
    },
    # 5. Rodolfo Moralez - Calculista (laudo estrutural)
    {
        'data': datetime(2026, 4, 8),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Laudo técnico estrutural - modificação entre sala e cozinha',
        'fornecedor': 'RODOLFO SANTANA ROQUE MORALEZ',
        'cpf_cnpj': 'CPF 409.876.288-95',
        'tipo_gasto': 'Serviço',
        'forma_pgto': 'PIX',
        'documento': 'Autorização Salvador Arquitetura + PIX',
        'nota': 'Parcial',
        'valor': 3070.00,
        'observacoes': 'PIX 08/04/2026 R$3.070 (E60701190202604081439DY50J8SSGDQ). Conforme autorização: R$2.650 c/NF + R$70 NF visita (total c/ NF R$2.720) + R$350 visita s/NF. ⚠ Solicitar NF cobrindo R$3.000 ou R$3.070.',
    },
    # 6. Unimóveis - Marcenaria fina (sinal)
    {
        'data': datetime(2026, 4, 20),
        'etapa': 'Acabamentos',
        'categoria': 'Mão de obra',
        'subcategoria': 'Armário planejado fixo',
        'descricao': 'Sinal Obra 1920 - Marcenaria fina (móveis planejados Casa 4)',
        'fornecedor': 'UNIMÓVEIS COMÉRCIO DE MÓVEIS LTDA',
        'cpf_cnpj': 'PIX para CPF Francisco Carlos Limonta ***700848**',
        'tipo_gasto': 'Serviço/Material',
        'forma_pgto': 'PIX',
        'documento': 'Recibo Unimóveis 20/04/2026',
        'nota': 'Recibo',
        'valor': 100000.00,
        'observacoes': '⚠ ATENÇÃO: Recibo emitido pela Unimóveis (PJ) mas PIX foi feito para PF (Francisco Carlos Limonta). Risco fiscal alto: vínculo entre PJ emissora e PF recebedora deve ser comprovado. Solicitar NFS-e em nome do contribuinte.',
    },
    # 7. STACCATO - Mármores/pedras/bancadas fixas
    {
        'data': datetime(2026, 4, 29),
        'etapa': 'Acabamentos',
        'categoria': 'Materiais',
        'subcategoria': 'Bancada / pedra fixa',
        'descricao': 'Mármores / pedras / bancadas fixas Casa 4',
        'fornecedor': 'STACCATO',
        'cpf_cnpj': '***501.300-**10',
        'tipo_gasto': 'Material',
        'forma_pgto': 'PIX',
        'documento': 'PIX E60701190202604291749DY5WI8J27K5',
        'nota': 'Não',
        'valor': 32660.00,
        'observacoes': '⚠ PIX 29/04/2026 R$32.660 sem NF anexada. Solicitar NF com discriminação dos itens (mármores/pedras/bancadas fixas). Sem NF, risco documental alto na declaração.',
    },
]

# Inserir nas linhas 6 a 12
linha_inicial = 6
for idx, lc in enumerate(novos):
    r = linha_inicial + idx
    
    ws.cell(row=r, column=2, value=lc['data'])
    ws.cell(row=r, column=2).number_format = 'dd/mm/yyyy'
    ws.cell(row=r, column=5, value=lc['etapa'])
    ws.cell(row=r, column=6, value=lc['categoria'])
    ws.cell(row=r, column=7, value=lc['subcategoria'])
    ws.cell(row=r, column=8, value=lc['descricao'])
    ws.cell(row=r, column=9, value=lc['fornecedor'])
    ws.cell(row=r, column=10, value=lc['cpf_cnpj'])
    ws.cell(row=r, column=11, value=lc['tipo_gasto'])
    ws.cell(row=r, column=12, value=lc['forma_pgto'])
    ws.cell(row=r, column=13, value=lc['documento'])
    ws.cell(row=r, column=14, value=lc['nota'])
    ws.cell(row=r, column=15, value=lc['valor'])
    ws.cell(row=r, column=15).number_format = 'R$ #,##0.00'
    ws.cell(row=r, column=24, value=lc['observacoes'])

wb.save('/mnt/user-data/outputs/Valor_Imovel_Casa4_IR.xlsx')

print(f"✓ {len(novos)} lançamentos inseridos nas linhas 6-12")
print(f"\nResumo dos novos lançamentos:")
print(f"{'#':<3}{'Data':<12}{'Fornecedor':<35}{'Valor':>13}{'Subcat':<25}")
print("-"*90)
total = 0
for idx, lc in enumerate(novos, 1):
    print(f"{idx:<3}{lc['data'].strftime('%d/%m/%Y'):<12}{lc['fornecedor'][:34]:<35}R$ {lc['valor']:>10,.2f}  {lc['subcategoria'][:22]}")
    total += lc['valor']
print(f"\nTOTAL adicionado: R$ {total:,.2f}")
EOF