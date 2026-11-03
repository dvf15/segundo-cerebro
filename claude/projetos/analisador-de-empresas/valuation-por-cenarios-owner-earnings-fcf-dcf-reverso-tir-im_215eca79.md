---
title: "Valuation por cenários (owner earnings / FCF), DCF reverso, TIR implícita e faixas de preço.  Uso: python valuation.py"
date: 2026-09-25
source: "claude-project-doc"
source_id: "215eca79-0caa-49b5-a4e9-7ffeb958143c"
project: "Analisador de Empresas"
tags: ["claude", "projeto", "conhecimento"]
---
# Valuation por cenários (owner earnings / FCF), DCF reverso, TIR implícita e faixas de preço.  Uso: python valuation.py

#!/usr/bin/env python3
"""Valuation por cenários (owner earnings / FCF), DCF reverso, TIR implícita e faixas de preço.

Uso: python valuation.py --config premissas.json
Todos os valores monetários na mesma moeda e base (reais ou nominais) da taxa.
"""
import argparse
import json
import sys

MARGENS = {"A": 0.225, "B": 0.325, "C": 0.45}


def dcf(oe0, r, g1, g2, gt, anos1=5, anos2=5):
    if r <= gt:
        raise ValueError(f"taxa ({r:.2%}) deve ser maior que o crescimento na perpetuidade ({gt:.2%})")
    pv, oe = 0.0, oe0
    n = anos1 + anos2
    for t in range(1, n + 1):
        oe *= 1 + (g1 if t <= anos1 else g2)
        pv += oe / (1 + r) ** t
    tv = oe * (1 + gt) / (r - gt)
    return pv + tv / (1 + r) ** n


def valor_por_acao(cfg, cen, r):
    v = dcf(cfg["owner_earnings_base"], r, cen["g1"], cen["g2"], cen["gt"])
    if cfg.get("fluxo_tipo", "acionista") == "firma":
        v -= cfg.get("divida_liquida", 0.0)
    return v / cfg["acoes"]


def ponderado(cfg, r):
    return sum(c["prob"] * valor_por_acao(cfg, c, r) for c in cfg["cenarios"].values())


def bissecao(f, lo, hi, it=200):
    flo = f(lo)
    for _ in range(it):
        mid = (lo + hi) / 2
        fm = f(mid)
        if (fm > 0) == (flo > 0):
            lo, flo = mid, fm
        else:
            hi = mid
    return (lo + hi) / 2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    cfg = json.load(open(ap.parse_args().config, encoding="utf-8"))

    probs = sum(c["prob"] for c in cfg["cenarios"].values())
    if abs(probs - 1) > 1e-6:
        sys.exit(f"Probabilidades somam {probs:.2f}; devem somar 1.")

    r, preco, nota = cfg["taxa"], cfg["preco_atual"], cfg["nota_qualidade"].upper()
    print(f"== {cfg.get('empresa', '')} | preço atual {preco:,.2f} | taxa {r:.2%} | nota {nota}\n")

    valores = {}
    for nome, c in cfg["cenarios"].items():
        valores[nome] = valor_por_acao(cfg, c, r)
        print(f"{nome:>6}: {valores[nome]:>10,.2f}  (prob {c['prob']:.0%}, g1 {c['g1']:.1%}, g2 {c['g2']:.1%}, gt {c['gt']:.1%})")
    base_pond = ponderado(cfg, r)
    print(f"Ponderado: {base_pond:,.2f}  | upside/downside vs. preço: {base_pond / preco - 1:+.1%}\n")

    # DCF reverso: crescimento constante 10 anos que justifica o preço (gt do cenário base)
    base = cfg["cenarios"].get("base", list(cfg["cenarios"].values())[0])
    f_rev = lambda g: valor_por_acao(cfg, {"g1": g, "g2": g, "gt": base["gt"]}, r) - preco
    try:
        g_imp = bissecao(f_rev, -0.5, 1.0)
        print(f"DCF reverso: o preço embute crescimento de {g_imp:.2%} a.a. por 10 anos (perpetuidade {base['gt']:.1%})")
    except Exception as e:
        print(f"DCF reverso não convergiu: {e}")

    # TIR implícita
    gt_max = max(c["gt"] for c in cfg["cenarios"].values())
    try:
        tir = bissecao(lambda x: ponderado(cfg, x) - preco, gt_max + 0.001, 1.0)
        print(f"TIR implícita ao preço atual: {tir:.2%} a.a. (hurdle {r:.2%})\n")
    except Exception as e:
        tir = None
        print(f"TIR não convergiu: {e}\n")

    if nota == "D":
        print("Nota D: não investir, independentemente do preço.")
        return
    m = cfg.get("margem_override", MARGENS[nota])
    entrada = base_pond * (1 - m)
    if nota == "A":
        saida = valores.get("bull", base_pond * 1.3)
        regra = "preço > valor bull OU TIR < hurdle − 2 p.p."
        vender = preco > saida or (tir is not None and tir < r - 0.02)
    elif nota == "B":
        saida = base_pond * 1.15
        regra = "preço > valor ponderado × 1,15 OU TIR < hurdle"
        vender = preco > saida or (tir is not None and tir < r)
    else:
        saida = base_pond
        regra = "preço ≥ valor ponderado"
        vender = preco >= saida

    print(f"Margem de segurança: {m:.0%}")
    print(f"PREÇO DE ENTRADA (teto de compra): {entrada:,.2f}")
    print(f"Zona de acumulação: {entrada:,.2f} – {base_pond:,.2f}")
    print(f"PREÇO DE SAÍDA: {saida:,.2f}  ({regra})")

    if vender:
        rec = "VENDER / REDUZIR"
    elif preco <= entrada:
        rec = "COMPRAR"
    elif preco <= base_pond:
        rec = f"ACUMULAR ABAIXO DE {entrada:,.2f} / MANTER"
    else:
        rec = "MANTER (sem novas compras)"
    print(f"\nRecomendação mecânica: {rec}")
    print("(Confrontar com gatilhos qualitativos, governança e red team antes do veredito.)\n")

    # Sensibilidade
    print("Sensibilidade do valor ponderado por ação (linhas: taxa; colunas: Δ gt):")
    deltas = [-0.01, 0.0, 0.01]
    print("        " + "".join(f"{d:+.1%}".rjust(12) for d in deltas))
    for dr in [-0.01, 0.0, 0.01]:
        linha = []
        for dg in deltas:
            c2 = dict(cfg)
            c2["cenarios"] = {k: {**v, "gt": v["gt"] + dg} for k, v in cfg["cenarios"].items()}
            try:
                linha.append(f"{ponderado(c2, r + dr):,.2f}".rjust(12))
            except ValueError:
                linha.append("n/a".rjust(12))
        print(f"{r + dr:>7.2%} " + "".join(linha))


if __name__ == "__main__":
    main()

