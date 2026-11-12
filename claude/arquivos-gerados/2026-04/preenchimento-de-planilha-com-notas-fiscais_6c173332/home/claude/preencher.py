from openpyxl import load_workbook
from datetime import datetime

wb = load_workbook('/home/claude/planilha.xlsx')
ws = wb['Lancamentos']

# Lançamentos a inserir
# Para Bambu: PIX 12/11 corresponde à NF 444 (parcela 01) e PIX 12/12 à NF 446 (parcela 02).
# Lanço pela data do PIX (evento financeiro de pagamento) e uso o nº da NF como documento.
# Para GoStudio: não há NF anexada, lanço pela data do PIX.

lancamentos = [
    {
        'data': datetime(2025, 9, 24),
        'etapa': 'Documentação',
        'categoria': 'Decoração / móveis soltos',
        'subcategoria': 'Decoração / objetos',
        'descricao': 'Pagamento GoStudio Decorações - PIX 24/09/2025',
        'fornecedor': 'GOSTUDIO DECORACOES LTDA',
        'cpf_cnpj': '***.203.400-**26',  # CNPJ parcial conforme comprovante
        'tipo_gasto': 'Serviço',
        'forma_pgto': 'PIX',
        'documento': 'PIX E60701190202509241437DY5QL1CG8H6',
        'nota_recibo': 'Não',  # apenas comprovante PIX, sem NF anexada
        'valor': 1026.25,
        'observacoes': 'Comprovante PIX Itaú. Sem NF anexada - solicitar nota fiscal ao fornecedor para fortalecer comprovação.',
    },
    {
        'data': datetime(2025, 10, 24),
        'etapa': 'Documentação',
        'categoria': 'Decoração / móveis soltos',
        'subcategoria': 'Decoração / objetos',
        'descricao': 'Pagamento GoStudio Decorações - PIX 24/10/2025',
        'fornecedor': 'GOSTUDIO DECORACOES LTDA',
        'cpf_cnpj': '***.203.400-**26',
        'tipo_gasto': 'Serviço',
        'forma_pgto': 'PIX',
        'documento': 'PIX E60701190202510241639DY5ZW09IYR4',
        'nota_recibo': 'Não',
        'valor': 998.25,
        'observacoes': 'Comprovante PIX Itaú. Sem NF anexada - solicitar nota fiscal ao fornecedor.',
    },
    {
        'data': datetime(2025, 11, 12),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Projeto arquitetura interiores Casa 4 Palm Hill - Parcela 01/04 (Proposta 25ARQ183)',
        'fornecedor': 'BAMBU.ARQ PROJETOS & GERENCIAMENTO LTDA - ME',
        'cpf_cnpj': '26.490.306/0001-67',
        'tipo_gasto': 'Projeto',
        'forma_pgto': 'PIX',
        'documento': 'NFS-e 00000444',
        'nota_recibo': 'Sim',
        'valor': 10400.00,
        'observacoes': 'PIX em 12/11/2025 + NFS-e 00000444 emitida em 12/11/2025. Parcela 1 de 4 (valor global R$41.600,00). Verificar com contador % ativável (padrão tabela: 50%).',
    },
    {
        'data': datetime(2025, 12, 12),
        'etapa': 'Documentação',
        'categoria': 'Projetos e taxas',
        'subcategoria': 'Projeto arquitetônico',
        'descricao': 'Projeto arquitetura interiores Casa 4 Palm Hill - Parcela 02/04 (Proposta 25ARQ183)',
        'fornecedor': 'BAMBU.ARQ PROJETOS & GERENCIAMENTO LTDA - ME',
        'cpf_cnpj': '26.490.306/0001-67',
        'tipo_gasto': 'Projeto',
        'forma_pgto': 'PIX',
        'documento': 'NFS-e 00000446',
        'nota_recibo': 'Sim',
        'valor': 10400.00,
        'observacoes': 'PIX em 12/12/2025 + NFS-e 00000446 emitida em 19/12/2025. Parcela 2 de 4 (valor global R$41.600,00). Verificar com contador % ativável (padrão tabela: 50%).',
    },
]

# Inserir nas linhas 2..5 (mantém as fórmulas que já existem)
# Colunas: A(ID-formula), B(Data), C(Ano-formula), D(Mês-formula), E(Etapa), F(Categoria),
# G(Subcategoria), H(Descrição), I(Fornecedor), J(CPF/CNPJ), K(Tipo gasto), L(Forma pgto),
# M(Documento), N(Nota?), O(Valor bruto), P-V(formulas), W(Link), X(Observações)

for i, lc in enumerate(lancamentos, start=2):
    ws.cell(row=i, column=2, value=lc['data'])
    ws.cell(row=i, column=2).number_format = 'dd/mm/yyyy'
    ws.cell(row=i, column=5, value=lc['etapa'])
    ws.cell(row=i, column=6, value=lc['categoria'])
    ws.cell(row=i, column=7, value=lc['subcategoria'])
    ws.cell(row=i, column=8, value=lc['descricao'])
    ws.cell(row=i, column=9, value=lc['fornecedor'])
    ws.cell(row=i, column=10, value=lc['cpf_cnpj'])
    ws.cell(row=i, column=11, value=lc['tipo_gasto'])
    ws.cell(row=i, column=12, value=lc['forma_pgto'])
    ws.cell(row=i, column=13, value=lc['documento'])
    ws.cell(row=i, column=14, value=lc['nota_recibo'])
    ws.cell(row=i, column=15, value=lc['valor'])
    ws.cell(row=i, column=15).number_format = 'R$ #,##0.00'
    ws.cell(row=i, column=24, value=lc['observacoes'])

    # Garante que as fórmulas das demais colunas existam (caso a planilha original tenha apenas na linha 2)
    # Verifica se as fórmulas já estão nessas linhas
    if ws.cell(row=i, column=1).value is None:
        ws.cell(row=i, column=1, value=f'=IF(OR(B{i}<>"",F{i}<>"",G{i}<>"",H{i}<>"",O{i}<>""),ROW()-1,"")')
    if ws.cell(row=i, column=3).value is None:
        ws.cell(row=i, column=3, value=f'=IF(A{i}="","",YEAR(B{i}))')
    if ws.cell(row=i, column=4).value is None:
        ws.cell(row=i, column=4, value=f'=IF(A{i}="","",CHOOSE(MONTH(B{i}),"Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"))')
    if ws.cell(row=i, column=16).value is None:
        ws.cell(row=i, column=16, value=f'=IF(A{i}="","",IFERROR(INDEX(Classificacao_IR!$D$2:$D$100,MATCH($G{i},Classificacao_IR!$B$2:$B$100,0)),0))')
    if ws.cell(row=i, column=18).value is None:
        ws.cell(row=i, column=18, value=f'=IF(A{i}="","",IF(Q{i}<>"",Q{i},P{i}))')
    if ws.cell(row=i, column=19).value is None:
        ws.cell(row=i, column=19, value=f'=IF(A{i}="","",IF(O{i}="","",O{i}*R{i}))')
    if ws.cell(row=i, column=20).value is None:
        ws.cell(row=i, column=20, value=f'=IF(A{i}="","",IF(R{i}=1,"Sim",IF(R{i}=0,"Não","Parcial / Revisar")))')
    if ws.cell(row=i, column=21).value is None:
        ws.cell(row=i, column=21, value=f'=IF(A{i}="","",IFERROR(INDEX(Classificacao_IR!$E$2:$E$100,MATCH($G{i},Classificacao_IR!$B$2:$B$100,0)),"Revisar"))')
    if ws.cell(row=i, column=22).value is None:
        ws.cell(row=i, column=22, value=f'=IF(A{i}="","",IF(S{i}=0,"Baixo",IF(AND(N{i}="Sim",J{i}<>"",M{i}<>""),"Baixo",IF(OR(N{i}="Não",J{i}="",M{i}=""),"Alto","Médio"))))')

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print("Arquivo salvo com sucesso")
