from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = load_workbook('/mnt/user-data/outputs/Valor_Imovel_Ap_Av_Portugal_IR.xlsx')

print("=== LIMPANDO DADOS DA CASA 4 ===\n")

# ════════════════════════════════════════════════════════════════════
# 1. ABA Lancamentos — limpar lançamentos específicos da Casa 4
# ════════════════════════════════════════════════════════════════════
ws = wb['Lancamentos']
print("1. Limpando aba Lancamentos...")

# Linhas 2-12 têm dados (11 lançamentos da Casa 4)
# Vou limpar só os campos editáveis (B, E, F, G, H, I, J, K, L, M, N, O, X)
# As fórmulas de A, C, D, P, R, S, T, U, V ficam (mas vão dar vazio quando A vazio)
campos_editaveis = [2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 23, 24]
for row in range(2, 13):
    for col in campos_editaveis:
        ws.cell(row=row, column=col).value = None

print(f"   ✓ Linhas 2-12 limpas ({11} lançamentos)")

# ════════════════════════════════════════════════════════════════════
# 2. ABA Financiamento_IR — limpar dados do contrato Itaú
# ════════════════════════════════════════════════════════════════════
ws = wb['Financiamento_IR']
print("\n2. Limpando aba Financiamento_IR...")

# Cabeçalho L2 - atualizar
ws.cell(row=2, column=1).value = (
    "Contrato [a preencher] | [Banco] | Daniel Vieira de Freitas | Imóvel: Apartamento Av. Portugal"
)

# Limpar dados do contrato (linhas 5-18, coluna C com merge até E)
dados_contrato_limpar = [5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18]
# Mantém o sistema de amortização (10) e modalidade (11) como referência
for row in dados_contrato_limpar:
    ws.cell(row=row, column=3).value = None

print("   ✓ Dados do contrato limpos (mantidas as labels para preenchimento)")

# Tabela de parcelas (linhas 24-30, dados das 7 parcelas pagas)
# Limpar as 7 linhas de parcelas mantendo cabeçalhos e fórmulas de total
print("   ✓ Limpando tabela de parcelas pagas...")
for row in range(24, 31):  # linhas das parcelas pagas
    for col in range(1, 11):  # A a J
        cell = ws.cell(row=row, column=col)
        # Mantém só fórmulas, limpa valores
        if cell.value and not (isinstance(cell.value, str) and cell.value.startswith('=')):
            cell.value = None

# Limpar saldo devedor da linha total (linha 31)
# H31 tem o saldo devedor "1688975.63" hard-coded
cell_h31 = ws.cell(row=31, column=8)
if cell_h31.value == 1688975.63:
    cell_h31.value = None

# ════════════════════════════════════════════════════════════════════
# 3. ABA Custo_Total_Imovel — limpar valores específicos
# ════════════════════════════════════════════════════════════════════
ws = wb['Custo_Total_Imovel']
print("\n3. Limpando aba Custo_Total_Imovel...")

# L2: subtítulo
ws.cell(row=2, column=1).value = "Apartamento Av. Portugal | Daniel Vieira de Freitas | A preencher"

# Seção 1: aquisição (linhas 6-10)
# L7 D/E: entrada R$1.500.000
ws.cell(row=7, column=4).value = None
ws.cell(row=7, column=5).value = None
# L8 D/E: ITBI R$96.000
ws.cell(row=8, column=4).value = None
ws.cell(row=8, column=5).value = None
# L9 D/E: emolumentos R$12.897,67
ws.cell(row=9, column=4).value = None
ws.cell(row=9, column=5).value = None
# L10 corretagem (já estava vazio)

# Atualizar observações específicas
# L7 obs: trocar referência ao contrato Itaú
ws.cell(row=7, column=6).value = "Preencher: valor pago como entrada/recursos próprios na aquisição. Ativável 100%."
# L8 obs: ITBI
ws.cell(row=8, column=6).value = "Preencher: valor da guia ITBI paga ao município. Ativável 100%."
# L9 obs: emolumentos
ws.cell(row=9, column=6).value = "Preencher: emolumentos cartório (V&C + Alienação + Certidão) + tarifa avaliação. Ativável 100%."

# Seção 5: informações complementares (linhas 25-28)
ws.cell(row=25, column=4).value = None  # Preço de venda
ws.cell(row=26, column=4).value = None  # Valor venal
ws.cell(row=27, column=4).value = None  # Valor de avaliação banco
ws.cell(row=28, column=4).value = None  # Saldo devedor 29/04/2026
# Atualizar label do saldo devedor
ws.cell(row=28, column=1).value = "Saldo devedor (data atualizada do DDC)"

# L18: troca de label da subcategoria GoStudio que era específica
# Vou tornar a fórmula genérica - deixar a SUMIFS apontando para "Decoração / móveis soltos"
# já está, OK

# Seção 2 — descrição genérica
ws.cell(row=11, column=1).value = "2. ENCARGOS DO FINANCIAMENTO PAGOS (parcelas pagas — atualizar conforme DDC)"
ws.cell(row=12, column=6).value = "Total de amortizações pagas. Puxa da aba Financiamento_IR."
ws.cell(row=13, column=6).value = "Cenário conservador não ativa juros. Cenário amplo ativa (IN RFB 84/2001 art.17, V)."

# L17 obs: trocar "NFS-e 444 e 446"
ws.cell(row=17, column=6).value = "Soma dos lançamentos com categoria 'Projetos e taxas' da aba Lancamentos."

# L18 obs: trocar mention a GoStudio
ws.cell(row=18, column=6).value = "⚠ Soma dos lançamentos categoria 'Decoração / móveis soltos'. Bem móvel = 0% ativável."

print("   ✓ Aquisição zerada, observações atualizadas")

# ════════════════════════════════════════════════════════════════════
# 4. ABA Evolucao_Anual_IR — limpar valores pagos das linhas 9-19
# ════════════════════════════════════════════════════════════════════
ws = wb['Evolucao_Anual_IR']
print("\n4. Limpando aba Evolucao_Anual_IR...")

# L2: subtítulo
ws.cell(row=2, column=1).value = (
    "Apartamento Av. Portugal | Apenas valores EFETIVAMENTE PAGOS são acumulados"
)

# Linhas 9-19: limpar TODOS os valores pré-preenchidos do financiamento Casa 4
# Manter apenas:
#   - Coluna A (anos)
#   - Coluna F (Benfeitorias - fórmula SUMIFS por ano)
#   - Colunas G-O com fórmulas
# Limpar:
#   - B (Aquisição), C (Amortização), D (Juros), E (Seguros), J (Saldo devedor)

# Os anos podem ser mantidos genericamente. Mas vou perguntar se o usuário
# quer manter os anos ou parametrizar o ano-base.
# Por ora, mantenho 2025-2035 e zero os valores.

for row in range(9, 20):
    # B: Aquisição
    cb = ws.cell(row=row, column=2)
    if isinstance(cb.value, (int, float)):
        cb.value = None
    # C: Amortização
    cc = ws.cell(row=row, column=3)
    if isinstance(cc.value, (int, float)):
        cc.value = None
    # D: Juros
    cd = ws.cell(row=row, column=4)
    if isinstance(cd.value, (int, float)):
        cd.value = None
    # E: Seguros
    ce = ws.cell(row=row, column=5)
    if isinstance(ce.value, (int, float)):
        ce.value = None
    # J: Saldo devedor (col 10)
    cj = ws.cell(row=row, column=10)
    if isinstance(cj.value, (int, float)):
        cj.value = None
    # F = Benfeitorias (fórmula SUMIFS) — manter

# Linhas 23-33 (resumo IR) têm fórmulas que puxam de cima — mantém
# Linha 23: Status muda de "Real" para "Pendente" para todos
# Mas como as fórmulas refletem isso, OK

print("   ✓ Valores numéricos limpos. Fórmulas e estrutura mantidas.")
print("   ✓ Coluna F (Benfeitorias) continua puxando da aba Lancamentos automaticamente")

# ════════════════════════════════════════════════════════════════════
# 5. Guia_e_Fontes e Dashboard — atualizar referências
# ════════════════════════════════════════════════════════════════════
print("\n5. Verificando Guia_e_Fontes e Dashboard...")

# Vou verificar se essas abas têm referências específicas ao Casa 4
ws = wb['Guia_e_Fontes']
for row in range(1, ws.max_row + 1):
    for col in range(1, ws.max_column + 1):
        v = ws.cell(row=row, column=col).value
        if v and isinstance(v, str):
            if 'Casa 4' in v or 'Palm Hill' in v or 'Joaquim' in v:
                # Substituir por placeholder
                v_novo = v.replace('Casa 4', '[Imóvel]').replace('Palm Hill', '').replace('Joaquim José Esteves', '[endereço]')
                ws.cell(row=row, column=col).value = v_novo
                print(f"   ✓ Guia_e_Fontes L{row}C{col}: substituído")

# Dashboard - geralmente tem fórmulas, não conteúdo hardcoded
# Mas pode ter título
ws = wb['Dashboard']
for row in range(1, min(15, ws.max_row + 1)):
    for col in range(1, min(10, ws.max_column + 1)):
        v = ws.cell(row=row, column=col).value
        if v and isinstance(v, str):
            if 'Casa 4' in v or 'Palm Hill' in v:
                v_novo = v.replace('Casa 4', 'Apartamento Av. Portugal').replace('Palm Hill', '')
                ws.cell(row=row, column=col).value = v_novo
                print(f"   ✓ Dashboard L{row}C{col}: substituído")

# ════════════════════════════════════════════════════════════════════
# 6. Salvar
# ════════════════════════════════════════════════════════════════════
wb.save('/mnt/user-data/outputs/Valor_Imovel_Ap_Av_Portugal_IR.xlsx')
print("\n✓ Arquivo limpo salvo")
