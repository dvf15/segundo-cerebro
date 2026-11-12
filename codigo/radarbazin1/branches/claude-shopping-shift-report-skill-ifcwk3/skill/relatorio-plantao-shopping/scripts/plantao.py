#!/usr/bin/env python3
"""Calculadora do relatório de plantão de shoppings.

Uso:
  python plantao.py fechamento <relatorio.json>
      Gera as duas tabelas de fechamento de fluxo (vs. ano anterior e
      vs. semana anterior) em markdown, com variações calculadas.

  python plantao.py consolidar <dir-ou-arquivos.json...> [--data AAAA-MM-DD]
      Consolida os relatórios de vários shoppings: totais do dia, ranking
      de fluxo, percepções, eventos e ocorrências, em markdown.

Sem dependências externas (somente biblioteca padrão).
"""

import json
import sys
from datetime import date, timedelta
from pathlib import Path

DIAS_SEMANA = [
    "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira",
    "sexta-feira", "sábado", "domingo",
]
MESES = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
    "agosto", "setembro", "outubro", "novembro", "dezembro",
]


# ---------------------------------------------------------------- formatação

def fmt_int(v):
    if v is None:
        return "—"
    return f"{v:,.0f}".replace(",", ".")


def fmt_moeda(v):
    if v is None:
        return "—"
    inteiro, centavos = f"{v:,.2f}".split(".")
    inteiro = inteiro.replace(",", ".")
    return f"R$ {inteiro},{centavos}"


def fmt_pct(v, casas=2, sinal=False):
    if v is None:
        return "—"
    s = f"{v:+.{casas}f}" if sinal else f"{v:.{casas}f}"
    return s.replace(".", ",") + "%"


def fmt_data_extenso(iso):
    d = date.fromisoformat(iso)
    return f"{DIAS_SEMANA[d.weekday()]}, {d.day} de {MESES[d.month - 1]} de {d.year}"


def variacao(atual, ref):
    if atual is None or ref in (None, 0):
        return None
    return (atual - ref) / ref * 100


# ---------------------------------------------------------------- fechamento

def datas_comparativas(rel):
    """Datas de referência: informadas no JSON ou derivadas da data do plantão.

    Ano anterior = mesmo dia da semana mais próximo (data - 364 dias);
    semana anterior = data - 7 dias.
    """
    d = date.fromisoformat(rel["data"])
    comp = rel.get("comparativos") or {}
    ano = comp.get("ano_anterior") or (d - timedelta(days=364)).isoformat()
    sem = comp.get("semana_anterior") or (d - timedelta(days=7)).isoformat()
    return ano, sem


def _linhas_fechamento(fluxo, ref):
    """Pares (rótulo, atual, referência, formatador) na ordem do padrão."""
    def m(metrica):
        bloco = fluxo.get(metrica) or {}
        return bloco.get("atual"), bloco.get(ref)

    isen = fluxo.get("isencoes_app") or {}

    def i(cat):
        bloco = isen.get(cat) or {}
        return bloco.get("atual"), bloco.get(ref)

    ocup = fluxo.get("ocupacao_maxima_pct") or {}
    pico = fluxo.get("ocupacao_pico_horario") or ""
    rotulo_ocup = f"Ocupação Máxima ({pico})" if pico else "Ocupação Máxima"

    def pct(v):
        return fmt_pct(v) if v is not None else "—"

    return [
        ("Fluxo de Veículos", *m("veiculos"), fmt_int),
        ("Fluxo Pagante", *m("pagante"), fmt_int),
        ("Fluxo Valet", *m("valet"), fmt_int),
        (rotulo_ocup, ocup.get("atual"), ocup.get(ref), pct),
        ("Isenções App — CAT 1", *i("cat1"), fmt_int),
        ("Isenções App — CAT 2", *i("cat2"), fmt_int),
        ("Isenções App — CAT 3", *i("cat3"), fmt_int),
        ("Isenções App — $ CAT 1", *i("valor_cat1"), fmt_moeda),
        ("Isenções App — $ CAT 2", *i("valor_cat2"), fmt_moeda),
        ("Isenções App — $ CAT 3", *i("valor_cat3"), fmt_moeda),
        ("Receita", *m("receita"), fmt_moeda),
        ("Fluxo de Pessoas", *m("pessoas"), fmt_int),
    ]


def tabela_fechamento(rel, ref, data_ref, titulo):
    fluxo = rel["fluxo"]
    out = [f"**{titulo}**", ""]
    out.append(f"| Indicador | {fmt_data_extenso(rel['data'])} | {fmt_data_extenso(data_ref)} | % |")
    out.append("|---|---:|---:|---:|")
    for rotulo, atual, anterior, fmt in _linhas_fechamento(fluxo, ref):
        var = variacao(atual, anterior)
        out.append(f"| {rotulo} | {fmt(atual)} | {fmt(anterior)} | {fmt_pct(var, sinal=True)} |")
    return "\n".join(out)


def cmd_fechamento(caminho):
    rel = json.loads(Path(caminho).read_text(encoding="utf-8"))
    ano, sem = datas_comparativas(rel)
    print(tabela_fechamento(rel, "ano_anterior", ano, "Comparativo com o ano anterior"))
    print()
    print(tabela_fechamento(rel, "semana_anterior", sem, "Comparativo com a semana anterior"))


# --------------------------------------------------------------- consolidado

def _metrica(rel, nome, campo="atual"):
    return ((rel.get("fluxo") or {}).get(nome) or {}).get(campo)


def _var_metrica(rel, nome, ref):
    return variacao(_metrica(rel, nome), _metrica(rel, nome, ref))


def carregar(caminhos):
    arquivos = []
    for c in caminhos:
        p = Path(c)
        if p.is_dir():
            arquivos.extend(sorted(p.glob("*.json")))
        else:
            arquivos.append(p)
    rels = []
    for p in arquivos:
        try:
            rel = json.loads(p.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            print(f"AVISO: ignorando {p} ({e})", file=sys.stderr)
            continue
        rel["_arquivo"] = str(p)
        rels.append(rel)
    return rels


def cmd_consolidar(caminhos, data_filtro=None):
    rels = carregar(caminhos)
    if data_filtro:
        rels = [r for r in rels if r.get("data") == data_filtro]
    if not rels:
        sys.exit("Nenhum relatório válido encontrado.")

    datas = sorted({r.get("data") for r in rels if r.get("data")})
    titulo_data = fmt_data_extenso(datas[0]) if len(datas) == 1 else " / ".join(datas)
    if len(datas) > 1:
        print(f"AVISO: relatórios de datas diferentes no consolidado: {datas}", file=sys.stderr)

    out = [f"# Consolidado do Plantão — {titulo_data}", ""]
    out.append(f"Shoppings reportados: **{len(rels)}**")
    out.append("")

    # ---- totais do dia
    def total(nome, campo="atual"):
        vals = [_metrica(r, nome, campo) for r in rels]
        vals = [v for v in vals if v is not None]
        return sum(vals) if vals else None

    def var_total(nome, ref):
        pares = [(_metrica(r, nome), _metrica(r, nome, ref)) for r in rels]
        pares = [(a, b) for a, b in pares if a is not None and b is not None]
        if not pares:
            return None
        return variacao(sum(a for a, _ in pares), sum(b for _, b in pares))

    out.append("## Totais do dia (todos os shoppings)")
    out.append("")
    out.append("| Indicador | Total | Δ ano anterior | Δ semana anterior |")
    out.append("|---|---:|---:|---:|")
    for rotulo, nome, fmt in [
        ("Fluxo de Pessoas", "pessoas", fmt_int),
        ("Fluxo de Veículos", "veiculos", fmt_int),
        ("Fluxo Pagante", "pagante", fmt_int),
        ("Receita de estacionamento", "receita", fmt_moeda),
    ]:
        out.append(
            f"| {rotulo} | {fmt(total(nome))} "
            f"| {fmt_pct(var_total(nome, 'ano_anterior'), sinal=True)} "
            f"| {fmt_pct(var_total(nome, 'semana_anterior'), sinal=True)} |"
        )
    out.append("")

    # ---- ranking de fluxo
    def chave(rel):
        v_ano = _var_metrica(rel, "pessoas", "ano_anterior")
        v_sem = _var_metrica(rel, "pessoas", "semana_anterior")
        # sem base anual, rankeia pela variação semanal; sem nada, vai pro fim
        if v_ano is not None:
            return (0, -v_ano)
        if v_sem is not None:
            return (1, -v_sem)
        return (2, 0)

    out.append("## Ranking de fluxo (variação de pessoas vs. ano anterior)")
    out.append("")
    out.append(
        "| # | Shopping | Pessoas | Δ ano | Δ semana | Veículos Δ ano "
        "| Receita Δ ano | Ocup. máx. | Percepção vendas |"
    )
    out.append("|---:|---|---:|---:|---:|---:|---:|---:|---|")
    for pos, rel in enumerate(sorted(rels, key=chave), start=1):
        v_ano = _var_metrica(rel, "pessoas", "ano_anterior")
        v_sem = _var_metrica(rel, "pessoas", "semana_anterior")
        ocup = ((rel.get("fluxo") or {}).get("ocupacao_maxima_pct") or {}).get("atual")
        percep = (rel.get("percepcao") or {}).get("vendas") or "—"
        nota = "" if v_ano is not None else " *(sem base anual)*"
        out.append(
            f"| {pos} | {rel.get('shopping', '?')}{nota} "
            f"| {fmt_int(_metrica(rel, 'pessoas'))} "
            f"| {fmt_pct(v_ano, sinal=True)} | {fmt_pct(v_sem, sinal=True)} "
            f"| {fmt_pct(_var_metrica(rel, 'veiculos', 'ano_anterior'), sinal=True)} "
            f"| {fmt_pct(_var_metrica(rel, 'receita', 'ano_anterior'), sinal=True)} "
            f"| {fmt_pct(ocup, casas=1)} | {percep} |"
        )
    out.append("")

    # ---- destaques de vendas
    out.append("## Destaques de vendas e lojas")
    out.append("")
    for rel in rels:
        percep = rel.get("percepcao") or {}
        dest = rel.get("destaques") or {}
        lojas = ", ".join(dest.get("lojas") or []) or "—"
        gastro = ", ".join(dest.get("gastronomia") or []) or "—"
        out.append(f"**{rel.get('shopping', '?')}** — vendas: {percep.get('vendas', '—')}"
                   f" | fluxo: {percep.get('fluxo', '—')}")
        if percep.get("comentario"):
            out.append(f"- Percepção: {percep['comentario']}")
        out.append(f"- Lojas: {lojas}")
        out.append(f"- Gastronomia: {gastro}")
        out.append("")

    # ---- eventos
    out.append("## Eventos do dia")
    out.append("")
    for rel in rels:
        ev = rel.get("eventos") or {}
        internos = ev.get("shopping") or []
        externos = ev.get("externos") or []
        if not internos and not externos:
            continue
        partes = []
        for e in internos:
            if isinstance(e, dict):
                desc = e.get("nome", "?")
                if e.get("ingressos") is not None:
                    desc += f" ({fmt_int(e['ingressos'])} ingressos"
                    if e.get("faturamento") is not None:
                        desc += f", {fmt_moeda(e['faturamento'])}"
                    desc += ")"
                partes.append(desc)
            else:
                partes.append(str(e))
        linha = f"- **{rel.get('shopping', '?')}**: " + ("; ".join(partes) or "—")
        if externos:
            linha += f" | Externos: {'; '.join(externos)}"
        out.append(linha)
    out.append("")

    # ---- ocorrências
    out.append("## Ocorrências relevantes")
    out.append("")
    com_ocorrencia = [r for r in rels if (r.get("ocorrencias") or {}).get("houve")]
    if not com_ocorrencia:
        out.append("Nenhum shopping reportou ocorrência com risco de imagem.")
    else:
        for rel in com_ocorrencia:
            out.append(f"- **{rel.get('shopping', '?')}**: "
                       f"{(rel['ocorrencias'].get('descricao') or 'sem descrição')}")
    out.append("")

    print("\n".join(out))


# ---------------------------------------------------------------------- main

def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    cmd, args = argv[1], argv[2:]
    if cmd == "fechamento" and len(args) == 1:
        cmd_fechamento(args[0])
    elif cmd == "consolidar" and args:
        data_filtro = None
        if "--data" in args:
            i = args.index("--data")
            data_filtro = args[i + 1]
            args = args[:i] + args[i + 2:]
        cmd_consolidar(args, data_filtro)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(sys.argv)
