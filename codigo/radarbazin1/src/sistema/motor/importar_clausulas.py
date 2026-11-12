# -*- coding: utf-8 -*-
"""
Importa cláusulas (texto livre) e compara com os filtros do modelo.

Uso:
  python3 motor/importar_clausulas.py exemplos/clausula_exemplo.txt --segmento "Vestuário Feminino"
  python3 motor/importar_clausulas.py exemplos/lote_exemplo.csv           # CSV: texto,segmento,marca
  python3 motor/importar_clausulas.py <arquivo> [--segmento S] [--marca M] [--out relatorio.json]

O CSV pode ter as colunas: texto, segmento, marca (nome que exista em config/marcas.csv).
"Comparar com os filtros" = classificar o tipo, aplicar a matriz (status por segmento) e a alçada.
"""
import argparse
import csv
import json
import os
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import Motor, BASE

# Dicionário de sinônimos/palavras-chave por tipo (classificação simples por correspondência).
PALAVRAS = {
    "Isenção de Taxa de Transferência": ["isenta", "isenção", "taxa de transferência", "transferir", "ceder"],
    "Redução da Taxa de Transferência": ["redução", "taxa de transferência", "reduzir a taxa"],
    "Isenção TT mesmo Grupo Econômico": ["mesmo grupo", "grupo econômico", "reorganização societária"],
    "Alteração de Índice de Reajuste": ["índice", "reajuste", "igpm", "ipca", "índice de reajuste"],
    "Alteração de Prazo para Reajuste": ["prazo", "reajuste", "periodicidade", "postergar"],
    "Isenção de Multa Rescisória": ["isenta", "multa rescisória", "dispensada da multa", "sem multa"],
    "Redução de Multa Rescisória Gradual": ["multa", "gradual", "decrescente", "ao longo"],
    "Redução de Multa Rescisória Proporcional": ["multa", "proporcional", "proporção"],
    "Redução de Multa Rescisória Fixa": ["multa", "fixa", "valor fixo"],
    "Multa por Infração - Auditoria de Vendas": ["auditoria", "fiscalização", "diferença", "faturamento apurado"],
    "Multa por Infração Contratual": ["infração", "descumprimento", "penalidade"],
    "Cláusula \"Fumaça\"": ["fumaça", "fictícia"],
    "Cláusula sem multa e custos": ["napp", "sem multa", "sistema", "sem custo"],
    "Cláusula Padrão": ["napp", "sistema de informação de vendas", "sistema informatizado"],
    "Vendas Líquidas": ["venda líquida", "vendas líquidas", "líquido", "deduções", "impostos sobre venda"],
    "Vendas Online": ["online", "e-commerce", "site", "comércio eletrônico"],
    "Vendas - Ship from Store / Click & Collect": ["ship from store", "click and collect", "retirar na loja", "omnichannel"],
    "Informe Mensal de Vendas - 3º d.ú.": ["terceiro dia útil", "3º dia útil", "3o dia util"],
    "Informe Mensal de Vendas": ["informe", "primeiro dia útil", "declarar vendas", "informar as vendas"],
    "Confidencialidade": ["confidencial", "sigilo", "sigilosas"],
    "Anticorrupção": ["anticorrupção", "corrupção", "suborno"],
    "PEP - Pessoa Exposta Politicamente": ["pep", "pessoa exposta politicamente", "politicamente exposta"],
    "Proteção de Dados (LGPD)": ["lgpd", "proteção de dados", "13.709", "dados pessoais"],
    "Remoção de Benfeitorias": ["benfeitorias", "remover", "retirada de benfeitorias"],
    "Perda de Benefícios": ["perda de benefícios", "carência", "inadimplente perde"],
    "Renúncia ao Direito de Preferência/Vigência": ["renúncia", "preferência", "renovatória", "vigência"],
    "Comunicação": ["comunicação", "notificação", "endereço", "extrajudicial"],
}


def _norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return s


def classificar(texto):
    """Retorna (tipo_detectado, score). Score 0 => não identificado com confiança."""
    t = _norm(texto)
    melhor, melhor_score = None, 0
    for tipo, chaves in PALAVRAS.items():
        score = sum(1 for k in chaves if _norm(k) in t)
        if score > melhor_score:
            melhor, melhor_score = tipo, score
    return melhor, melhor_score


def carregar_marcas():
    marcas = {}
    caminho = os.path.join(BASE, "config", "marcas.csv")
    if os.path.exists(caminho):
        with open(caminho, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                marcas[row["marca"].strip()] = {
                    "marca": row["marca"].strip(),
                    "segmento": row.get("segmento", "").strip(),
                    "grau_estrategico": row.get("grau_estrategico", "Padrao").strip(),
                    "num_pracas": int(row.get("num_pracas", "1") or 1),
                }
    return marcas


def processar(entradas, motor, marcas):
    saida = []
    for texto, segmento, marca_nome in entradas:
        tipo, score = classificar(texto)
        marca = marcas.get((marca_nome or "").strip(), {"grau_estrategico": "Padrao", "num_pracas": 1})
        if not segmento:
            segmento = marca.get("segmento", "")
        item = {"texto": texto.strip()[:160], "tipo_detectado": tipo, "score": score,
                "segmento": segmento, "marca": marca_nome or ""}
        if tipo and segmento:
            r = motor.decidir(tipo, segmento, marca, {})
            item.update({"status": r["status"], "desconto_pct": r.get("desconto_pct"),
                         "alcada": r["alcada"], "motivo_alcada": r.get("motivo_alcada"),
                         "veredito": r["veredito"]})
        else:
            item["veredito"] = "Não classificado — informe o segmento e/ou revise o texto."
        saida.append(item)
    return saida


def ler_entradas(caminho, segmento_cli, marca_cli):
    if caminho.lower().endswith(".csv"):
        with open(caminho, encoding="utf-8") as f:
            return [(row.get("texto", ""), row.get("segmento", "") or segmento_cli or "",
                     row.get("marca", "") or marca_cli or "") for row in csv.DictReader(f)]
    with open(caminho, encoding="utf-8") as f:
        return [(f.read(), segmento_cli or "", marca_cli or "")]


def main():
    ap = argparse.ArgumentParser(description="Importa cláusulas e compara com os filtros do modelo.")
    ap.add_argument("arquivo", help=".txt (uma cláusula) ou .csv (texto,segmento,marca)")
    ap.add_argument("--segmento", default="")
    ap.add_argument("--marca", default="")
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    motor = Motor()
    marcas = carregar_marcas()
    entradas = ler_entradas(args.arquivo, args.segmento, args.marca)
    resultado = processar(entradas, motor, marcas)

    print("=" * 92)
    print("RELATÓRIO DE IMPORTAÇÃO — Copiloto de Decisão de Cláusulas (ALLOS)")
    print("=" * 92)
    for i, r in enumerate(resultado, 1):
        print("\n[%d] %s" % (i, r["texto"]))
        print("    tipo detectado : %s (score %s)" % (r.get("tipo_detectado"), r.get("score")))
        print("    segmento/marca : %s / %s" % (r.get("segmento"), r.get("marca") or "-"))
        if "status" in r:
            print("    status (guia)  : %s" % r["status"])
            if r.get("desconto_pct") is not None:
                print("    desconto       : %s%%" % r["desconto_pct"])
            print("    ALÇADA         : %s — %s" % (r["alcada"], r.get("motivo_alcada", "")))
        print("    veredito       : %s" % r["veredito"])

    if args.out:
        json.dump(resultado, open(args.out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print("\nRelatório JSON gravado em: %s" % args.out)


if __name__ == "__main__":
    main()
