# -*- coding: utf-8 -*-
"""
(Opcional) Gera config/recomendacoes.json a partir da planilha original da ALLOS.

Coloque o arquivo em: sistema/_fonte/Guia_Negociacao_Clausulas_ALLOS.xlsx
Requer openpyxl (opcional). Se o arquivo ou a lib não existirem, avisa e sai sem erro.

Uso:  python3 motor/carregar_planilha.py
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(BASE, "_fonte", "Guia_Negociacao_Clausulas_ALLOS.xlsx")
SAIDA = os.path.join(BASE, "config", "recomendacoes.json")


def main():
    if not os.path.exists(XLSX):
        print("Planilha não encontrada em %s." % XLSX)
        print("→ Coloque o Guia original nesse caminho e rode de novo. (O sistema funciona sem ela: "
              "usa o status_default de cada cláusula + os overrides em config/recomendacoes.json.)")
        return 0
    try:
        import openpyxl  # noqa
    except ImportError:
        print("openpyxl não instalado. Instale com: pip install openpyxl  (opcional).")
        return 0

    wb = openpyxl.load_workbook(XLSX, data_only=True)
    if "Quadro de Recomendação" not in wb.sheetnames:
        print("Aba 'Quadro de Recomendação' não encontrada na planilha.")
        return 0
    ws = wb["Quadro de Recomendação"]

    # Linha 4 = cabeçalho: col1 Ramo, col2 Segmento, col3.. = tipos de cláusula.
    linhas = list(ws.iter_rows(values_only=True))
    header = linhas[3]
    tipos = [c for c in header[2:] if c]
    matriz = {}
    for row in linhas[4:]:
        if not row or not row[1]:
            continue
        segmento = str(row[1]).strip()
        matriz[segmento] = {}
        for j, tipo in enumerate(tipos):
            val = row[2 + j]
            if val:
                matriz[segmento][str(tipo).strip()] = str(val).strip()

    dados = {
        "_meta": "Gerado de _fonte/Guia_Negociacao_Clausulas_ALLOS.xlsx (aba 'Quadro de Recomendação').",
        "matriz": matriz,
    }
    json.dump(dados, open(SAIDA, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("OK: %d segmentos × %d tipos gravados em %s" % (len(matriz), len(tipos), SAIDA))
    return 0


if __name__ == "__main__":
    sys.exit(main())
