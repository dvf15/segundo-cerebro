---
tags: [projeto/clausulas, skill, geracao, automacao]
aliases: [Geração de Artefatos, Gerar PPTX XLSX PDF]
name: gerar-artefatos-clausulas
description: Gera os artefatos do projeto Cláusulas — apresentação (.pptx), planilha do modelo (.xlsx) e PDF — na paleta ALLOS. Acionar ao pedir "gere o ppt/xls/pdf do modelo de cláusulas". Usar junto da skill pptallos.
---

# Skill — Geração de Artefatos (pptx, xlsx, pdf)

> [!info]
> Como (re)gerar os arquivos do projeto. Combina com [[Skill - Paleta ALLOS (pptallos)]]. Conteúdo conceitual vem das notas em [[00 - MOC - Projeto Cláusulas|Conceitos]].

## Dependências (ambiente)
```bash
pip install python-pptx openpyxl
# Para exportar PDF (este ambiente vinha sem o módulo Impress):
apt-get install -y libreoffice-impress   # requer rede; soffice core sozinho NÃO converte
```

## 1) Apresentação (.pptx) — python-pptx
- Slide 16:9 (13.333 × 7.5 in), layout em branco (`slide_layouts[6]`).
- Helpers: `rect`, `oval`, `txt`, `bullets`, `header` (faixa petróleo + linha âmbar), `footer`, `resumo` (faixa "Em resumo" verde-escuro).
- Estrutura didática (13 slides): Capa → Agenda → Problema → Proposta → **A régua de alçada** → Os três níveis → Grau da marca → Praças e portfólio → Desconto e custo → Business case → O que definir → Próximos passos → Fecho.
- Em cada slide de conceito, faixa **"Em resumo"** em linguagem simples.
- Paleta: ver [[Skill - Paleta ALLOS (pptallos)]].

## 2) Planilha do modelo (.xlsx) — openpyxl
Abas (alinhar à régua atual — ver [[Alçadas e Roteamento]]):
1. **Visão Geral** — objetivo, modo (apoio à decisão), a régua.
2. **Decomposição Cláusulas** — os 32 tipos (ver [[Decomposição das 32 Cláusulas]]); cor por classe (A=menta, A/B=teal, B=âmbar, Limite=coral).
3. **Régua de Alçada** — grau A/B → Diretoria; 1 praça → Superintendente; 2–4 no portfólio → Diretor; >4/fora → Diretoria; desconto ≤50%.
4. **Marcas** — grau (A/B/Padrão) e nº de praças; portfólio de cada Diretor.
5. **Decisões a Tomar** — D1–D9.
- Cabeçalhos petróleo; sub-cabeçalhos teal; bordas bege.

## 3) Exportar para PDF — LibreOffice headless
```bash
pkill -9 soffice 2>/dev/null; sleep 1
HOME=/tmp soffice --headless --norestore \
  -env:UserInstallation=file:///tmp/lop \
  --convert-to pdf --outdir <dir> <arquivo>.pptx
```
> [!warning]
> Se aparecer `source file could not be loaded` para qualquer arquivo, falta o módulo **libreoffice-impress** (instale-o). O `soffice --version` funciona mesmo sem ele.

## Parâmetros e nomenclatura
- Valores numéricos: ver [[Parâmetros Calibráveis]].
- Nomenclatura: Superintendente / Diretor de Portfólio / Diretoria de Operações.

## Saídas do projeto (nomes de arquivo)
- `Apresentacao_Decisao_Clausulas_ALLOS.pptx` / `.pdf`
- `Modelo_Decisao_Clausulas_ALLOS.xlsx`
- `Decomposicao_Clausulas_ALLOS.xlsx`

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
