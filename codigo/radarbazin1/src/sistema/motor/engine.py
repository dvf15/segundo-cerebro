# -*- coding: utf-8 -*-
"""
Motor de decisão de cláusulas — Copiloto ALLOS (apoio à decisão; humano decide).

Lógica de alçada (parametrizável em config/parametros.json):
- Marca A (âncora) ou B (alavancadora de posicionamento) → SEMPRE Diretoria de Operações.
- Marca Padrão:
    • 1 praça (local): Superintendente decide até `desconto_max_pct` (50%).
    • 2..max_pracas_diretor praças, todas dentro do portfólio: Diretor de Portfólio até 50%.
    • > max_pracas_diretor praças OU alguma loja fora do portfólio: Diretoria de Operações.
- Desconto acima de `desconto_max_pct` → Diretoria de Operações.
- Compliance (classe "Limite") → inegociável (Diretoria de Operações).

Custo (para cláusulas quantitativas): custo por loja e total = por loja × nº de praças.
Somente biblioteca padrão.
"""
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(BASE, "config")

KIND = {
    "Redução da Taxa de Transferência": "taxa",
    "Isenção de Taxa de Transferência": "taxa",
    "Isenção 1ª Taxa de Transferência": "taxa",
    "Isenção TT mesmo Grupo Econômico": "taxa",
    "Alteração de Índice de Reajuste": "reajuste_indice",
    "Alteração de Prazo para Reajuste": "reajuste_prazo",
    "Alteração de Multa Rescisória": "multa",
    "Isenção de Multa Rescisória": "multa",
    "Redução de Multa Rescisória Fixa": "multa",
    "Redução de Multa Rescisória Gradual": "multa",
    "Redução de Multa Rescisória Proporcional": "multa",
}


def kind(tipo):
    return KIND.get(tipo)


def _num(v):
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _bool(v, default=True):
    if v is None or v == "":
        return default
    if isinstance(v, bool):
        return v
    return str(v).strip().lower() in ("sim", "true", "1", "yes", "s")


def _load(nome):
    with open(os.path.join(CONFIG, nome), encoding="utf-8") as f:
        return json.load(f)


class Motor:
    def __init__(self, config_dir=None):
        global CONFIG
        if config_dir:
            CONFIG = config_dir
        self.p = _load("parametros.json")
        self.clausulas = {c["tipo"]: c for c in _load("clausulas.json")}
        self.recomendacoes = _load("recomendacoes.json").get("matriz", {})

    # ---- consultas ----
    def status_do(self, tipo, segmento):
        c = self.clausulas.get(tipo, {})
        return self.recomendacoes.get(segmento, {}).get(tipo) or c.get("status_default", "Não Recomendado")

    def _aluguel_anual(self, ct):
        if _num(ct.get("aluguel_anual")):
            return _num(ct.get("aluguel_anual"))
        am = _num(ct.get("aluguel_mensal"))
        return am * 12 if am else None

    # ---- custo por loja (R$) para cláusulas quantitativas ----
    def custo_por_loja_rs(self, tipo, ct):
        k = kind(tipo)
        am = _num(ct.get("aluguel_mensal"))
        if not k or not am:
            return None
        g = ct.get
        if k == "taxa":
            tp, tn = _num(g("taxa_padrao_amm")), _num(g("taxa_neg_amm")) or 0.0
            return None if tp is None else max(0.0, tp - tn) * am
        if k == "reajuste_indice":
            rp, rn = _num(g("reajuste_padrao_pct")), _num(g("reajuste_neg_pct"))
            meses = _num(g("meses")) or 12.0
            return None if (rp is None or rn is None) else am * max(0.0, rp - rn) / 100.0 * meses
        if k == "reajuste_prazo":
            r, meses = _num(g("reajuste_pct")), _num(g("meses_postergacao"))
            return None if (r is None or meses is None) else am * (r / 100.0) * meses
        if k == "multa":
            mp, mn = _num(g("multa_padrao_amm")), _num(g("multa_neg_amm")) or 0.0
            p = _num(g("prob_rescisao_pct"))
            p = 100.0 if p is None else p
            return None if mp is None else max(0.0, mp - mn) * am * (p / 100.0)
        return None

    # ---- % de desconto da concessão ----
    def desconto_pct(self, tipo, ct):
        if _num(ct.get("desconto_pct")) is not None:
            return _num(ct.get("desconto_pct"))
        k = kind(tipo)
        g = ct.get
        if k == "taxa":
            tp, tn = _num(g("taxa_padrao_amm")), _num(g("taxa_neg_amm")) or 0.0
            if tp:
                return round(max(0.0, tp - tn) / tp * 100.0, 1)
        if k == "multa":
            mp, mn = _num(g("multa_padrao_amm")), _num(g("multa_neg_amm")) or 0.0
            if mp:
                return round(max(0.0, mp - mn) / mp * 100.0, 1)
        if k == "reajuste_indice":
            rp, rn = _num(g("reajuste_padrao_pct")), _num(g("reajuste_neg_pct"))
            if rp and rn is not None:
                return round(max(0.0, rp - rn) / rp * 100.0, 1)
        return None

    # ---- regra de alçada ----
    def alcada_rule(self, grau, num_pracas, desconto, dentro_portfolio):
        dmax = self.p.get("desconto_max_pct", 50)
        maxp = self.p.get("max_pracas_diretor", 4)
        if grau in self.p.get("graus_somente_diretoria", ["A", "B"]):
            rot = self.p.get("graus", {}).get(grau, grau)
            return "Diretoria de Operações", "Marca %s (%s) → alçada exclusiva da Diretoria de Operações." % (grau, rot)
        if desconto is not None and desconto > dmax:
            return "Diretoria de Operações", "Desconto de %s%% acima do limite de %d%% das alçadas delegadas." % (desconto, dmax)
        if num_pracas <= 1:
            return "Superintendente", "Marca local (1 praça); desconto até %d%%." % dmax
        if num_pracas <= maxp and dentro_portfolio:
            return "Diretor de Portfólio", "Marca em %d praças, todas no portfólio (≤%d); desconto até %d%%." % (num_pracas, maxp, dmax)
        motivos = []
        if num_pracas > maxp:
            motivos.append("mais de %d praças" % maxp)
        if not dentro_portfolio:
            motivos.append("loja fora do portfólio")
        return "Diretoria de Operações", "Superintendente/Diretor sem alçada (%s)." % (" e ".join(motivos) or "regra de pegada")

    # ---- decisão ----
    def decidir(self, tipo, segmento, marca=None, contrato=None):
        marca = marca or {}
        contrato = contrato or {}
        clausula = self.clausulas.get(tipo)
        if not clausula:
            raise ValueError("Tipo de cláusula desconhecido: %s" % tipo)

        classe = clausula["classe"]
        status = self.status_do(tipo, segmento)
        grau = marca.get("grau_estrategico", "Padrao")
        num_pracas = int(marca.get("num_pracas", 1) or 1)
        dentro = _bool(marca.get("dentro_portfolio", True), True)

        # custo (informativo)
        rs = self.custo_por_loja_rs(tipo, contrato)
        anual = self._aluguel_anual(contrato)
        custo_por_loja = custo_total = clc_pct = custo_efetivo = None
        if rs is not None and anual:
            custo_por_loja = round(rs, 2)
            custo_total = round(rs * num_pracas, 2)
            clc_pct = round(rs / anual * 100.0, 3)
            custo_efetivo = round(clc_pct * num_pracas, 3)

        desconto = self.desconto_pct(tipo, contrato)

        if classe == "Limite":
            alcada = "Diretoria de Operações"
            motivo = "Compliance/LGPD — limite duro, inegociável."
            veredito = "INEGOCIÁVEL — limite duro (Compliance/LGPD). Não entra na balança econômica."
        else:
            alcada, motivo = self.alcada_rule(grau, num_pracas, desconto, dentro)
            if status == "Não Recomendado":
                veredito = "Exceção — requer business case (status do guia: Não Recomendado)."
            elif status == "Recomendado com Ressalvas":
                veredito = "Aprovar com ressalva (dentro da alçada indicada)."
            else:
                veredito = "Aprovar (recomendado, dentro da alçada indicada)."

        r = {
            "tipo": tipo, "segmento": segmento, "status": status, "classe": classe,
            "grau_marca": grau, "grau_rotulo": self.p.get("graus", {}).get(grau, grau),
            "num_pracas": num_pracas, "dentro_portfolio": dentro,
            "desconto_pct": desconto,
            "custo_por_loja": custo_por_loja, "custo_total": custo_total,
            "clc_pct": clc_pct, "custo_efetivo_pct": custo_efetivo,
            "alcada": alcada, "motivo_alcada": motivo,
            "veredito": veredito, "marca": marca, "business_case": None,
        }
        if alcada == "Diretoria de Operações" and classe != "Limite":
            r["business_case"] = self._business_case(r, clausula)
        return r

    def _business_case(self, r, clausula):
        return {
            "titulo": "Decisão de Cláusula — Diretoria de Operações",
            "marca": r.get("marca", {}).get("marca", "(marca)"),
            "grau": "%s (%s)" % (r["grau_marca"], r["grau_rotulo"]),
            "pegada": "%s praça(s) · dentro do portfólio: %s" % (r["num_pracas"], "sim" if r["dentro_portfolio"] else "não"),
            "clausula": "%s → %s" % (clausula["tema"], clausula["tipo"]),
            "status_guia": r["status"], "desconto_pct": r["desconto_pct"],
            "custo_por_loja": r["custo_por_loja"], "custo_total": r["custo_total"],
            "motivo": r["motivo_alcada"],
            "decisao": "[ Aprovar ] [ Negar ] [ Aprovar com ajuste ] + justificativa (vira precedente)",
        }


def decidir(tipo, segmento, marca=None, contrato=None):
    return Motor().decidir(tipo, segmento, marca, contrato)


if __name__ == "__main__":
    m = Motor()
    print("== Demonstração ==")
    casos = [
        ("Redução da Taxa de Transferência", "Vestuário Feminino",
         {"grau_estrategico": "Padrao", "num_pracas": 1},
         {"aluguel_mensal": 20000, "taxa_padrao_amm": 3, "taxa_neg_amm": 1.5}),  # 50% local
        ("Redução da Taxa de Transferência", "Vestuário Feminino",
         {"grau_estrategico": "Padrao", "num_pracas": 3, "dentro_portfolio": True},
         {"aluguel_mensal": 20000, "taxa_padrao_amm": 3, "taxa_neg_amm": 1.5}),  # 3 praças no portfólio
        ("Redução da Taxa de Transferência", "Vestuário Feminino",
         {"grau_estrategico": "Padrao", "num_pracas": 6},
         {"aluguel_mensal": 20000, "taxa_padrao_amm": 3, "taxa_neg_amm": 1.5}),  # 6 praças
        ("Redução da Taxa de Transferência", "Vestuário Feminino",
         {"grau_estrategico": "A", "num_pracas": 1},
         {"aluguel_mensal": 20000, "taxa_padrao_amm": 3, "taxa_neg_amm": 1.5}),  # marca A
    ]
    for tipo, seg, marca, ct in casos:
        r = m.decidir(tipo, seg, marca, ct)
        print("\n- grau %s · %s praça(s) · desconto %s%%" % (r["grau_marca"], r["num_pracas"], r["desconto_pct"]))
        print("  ALÇADA: %s — %s" % (r["alcada"], r["motivo_alcada"]))
        if r["custo_por_loja"] is not None:
            print("  custo/loja R$ %s · total R$ %s" % (r["custo_por_loja"], r["custo_total"]))
