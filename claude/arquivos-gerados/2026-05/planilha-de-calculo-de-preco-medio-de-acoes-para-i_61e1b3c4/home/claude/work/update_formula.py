"""
1. Atualiza fórmula de classificação na aba 3 para reconhecer "(BTC" como IGNORAR
2. Recalcula
3. Refaz a aba 5_DIRPF_2026 com os novos valores
"""
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

dst = "/home/claude/work/Calculadora_Preco_Medio_IR_FINAL_v2.xlsx"
wb = load_workbook(dst)

NUM_ROWS = 1000
NUM_TICKERS = 100

# ============================================================
# STEP 1: Reescrever fórmula de classificação na aba 3
# ============================================================
ws3 = wb["3_Cálculo"]

for r in range(2, NUM_ROWS + 2):
    mov_ref = f"'2_Extrato_B3'!C{r}"
    val_ref = f"'2_Extrato_B3'!H{r}"
    es_ref = f"'2_Extrato_B3'!A{r}"

    classify = (
        f'=IF(\'2_Extrato_B3\'!D{r}="","",'
        # ALUGUEL/BTC primeiro (mais prioritário)
        f'IF(ISNUMBER(SEARCH("BTC",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("aluguel",{mov_ref})),"IGNORAR",'
        # Aluguel/BTC mechanics
        f'IF(EXACT({mov_ref},"Empréstimo"),"IGNORAR",'
        f'IF(EXACT({mov_ref},"Reembolso"),"IGNORAR",'
        f'IF(EXACT({mov_ref},"Transferência"),"IGNORAR",'
        f'IF(AND(EXACT({mov_ref},"Transferência - Liquidação"),OR({val_ref}=0,{val_ref}="")),"IGNORAR",'
        # Renda fixa
        f'IF(ISNUMBER(SEARCH("COMPROMISSADA",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("APLICAÇÃO",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("RESGATE",{mov_ref})),"IGNORAR",'
        # Income
        f'IF(ISNUMBER(SEARCH("Dividendo",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Juros",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Rendimento",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Leilão",{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Leilao",{mov_ref})),"IGNORAR",'
        # Subscription
        f'IF(AND(ISNUMBER(SEARCH("Direito",{mov_ref})),ISNUMBER(SEARCH("Exerc",{mov_ref})),NOT(ISNUMBER(SEARCH("Não",{mov_ref})))),"SUBSCRICAO",'
        f'IF(AND(ISNUMBER(SEARCH("Direito",{mov_ref})),ISNUMBER(SEARCH("Não",{mov_ref}))),"IGNORAR",'
        f'IF(AND(ISNUMBER(SEARCH("Direito",{mov_ref})),ISNUMBER(SEARCH("Sobras",{mov_ref}))),"IGNORAR",'
        f'IF(EXACT({mov_ref},"Direito de Subscrição"),"IGNORAR",'
        f'IF(EXACT({mov_ref},"Solicitação de Subscrição"),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Recibo de Subscri",{mov_ref})),"IGNORAR",'
        # Corporate actions needing review
        f'IF(ISNUMBER(SEARCH("Atualiza",{mov_ref})),"REVISAR",'
        f'IF(ISNUMBER(SEARCH("Cisão",{mov_ref})),"REVISAR",'
        f'IF(ISNUMBER(SEARCH("Cisao",{mov_ref})),"REVISAR",'
        f'IF(ISNUMBER(SEARCH("Fração",{mov_ref})),"REVISAR",'
        # Splits
        f'IF(ISNUMBER(SEARCH("Bonifica",{mov_ref})),"BONIFICACAO",'
        f'IF(ISNUMBER(SEARCH("Desdobr",{mov_ref})),"DESDOBRAMENTO",'
        f'IF(ISNUMBER(SEARCH("Grupament",{mov_ref})),"GRUPAMENTO",'
        # Real trades
        f'IF(EXACT({mov_ref},"Transferência - Liquidação"),IF({es_ref}="Credito","COMPRA","VENDA"),'
        f'IF(ISNUMBER(SEARCH("Compra",{mov_ref})),"COMPRA",'
        f'IF(ISNUMBER(SEARCH("Venda",{mov_ref})),"VENDA",'
        f'"REVISAR")))))))))))))))))))))))))))))))'
    )
    ws3.cell(row=r, column=4).value = classify

print("Fórmula de classificação atualizada (regra BTC adicionada)")
wb.save(dst)
