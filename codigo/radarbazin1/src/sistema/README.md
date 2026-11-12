# Copiloto de Decisão de Cláusulas — ALLOS

Sistema de **apoio à decisão** para aprovar/negar cláusulas contratuais por **marca** e **segmento**,
maximizando rentabilidade e minimizando risco. **O humano sempre decide.** Parametrizável a posteriori
(marcas, alçadas, tetos, fatores) e capaz de **importar cláusulas** e **compará-las com os filtros** do modelo.

> Baseado no *Guia de Negociação de Cláusulas* da ALLOS. Conceitos completos no vault Obsidian do projeto
> e em `_fonte/MODELO_FONTE.md`.

## Estrutura
```
sistema/
├── README.md                      ← este arquivo
├── COMO_USAR_NO_CLAUDE_CHAT.md    ← passo a passo no ambiente corporativo (Claude chat)
├── instrucoes/
│   └── SYSTEM_PROMPT.md           ← instruções para colar num Projeto do Claude
├── config/                        ← PARAMETRIZAÇÃO (edite estes arquivos)
│   ├── parametros.json            ← tetos, fatores de marca, faixas de pegada, pesos
│   ├── alcadas.json               ← níveis de alçada
│   ├── clausulas.json             ← os 32 tipos (tema, classe, peso/fórmula, risco, status)
│   ├── recomendacoes.json         ← matriz segmento×tipo (overrides; regenerável da planilha)
│   ├── segmentos.json             ← ramos e segmentos
│   └── marcas.csv                 ← cadastro de marcas (marca, segmento, grau, nº de praças)
├── motor/                         ← MOTOR determinístico (Python, só stdlib)
│   ├── engine.py                  ← regra de roteamento (custo, pegada, alçada, veredito)
│   ├── test_engine.py             ← testes (python3 motor/test_engine.py)
│   ├── importar_clausulas.py      ← importa .txt/.csv e compara com os filtros
│   └── carregar_planilha.py       ← (opcional) gera recomendacoes.json da planilha original
├── console/
│   └── index.html                 ← console web self-contained (parametrizar + avaliar)
└── exemplos/
    ├── clausula_exemplo.txt
    └── lote_exemplo.csv
```

## As três formas de usar
1. **Claude chat (corporativo)** — crie um Projeto no Claude, anexe `config/` + `instrucoes/SYSTEM_PROMPT.md`
   e cole a cláusula. Ver `COMO_USAR_NO_CLAUDE_CHAT.md`. **É o uso principal.**
2. **Console web** — abra `console/index.html` no navegador (ou publique como Artifact no Claude). Parametrize
   marcas/alçadas e avalie cláusulas com cálculo exato. Não precisa de internet nem servidor.
3. **Linha de comando (Python)** — motor e importador para automação/lotes:
   ```bash
   python3 motor/test_engine.py                      # roda os testes
   python3 motor/engine.py                            # demonstração
   python3 motor/importar_clausulas.py exemplos/lote_exemplo.csv
   python3 motor/importar_clausulas.py exemplos/clausula_exemplo.txt --segmento "Vestuário Feminino" --marca "Boutique Beta"
   ```

## Como parametrizar (a posteriori)
- **Marcas** → `config/marcas.csv` (ou a aba Parametrização do console): `marca,segmento,grau_estrategico,num_pracas`
  (grau ∈ A, B, Padrao). O **grau** eleva a tolerância; o **nº de praças** (pegada de rede) a reduz.
- **Alçadas / tetos / fatores** → `config/parametros.json` (tetos %, `fatores_marca`, faixas de `pegada`).
- **Status por segmento** → `config/recomendacoes.json` (campo `matriz`). Sem entrada, usa o `status_default`
  da cláusula. Para popular a matriz real, coloque a planilha em `_fonte/` e rode `carregar_planilha.py`.

## Modelo de decisão (resumo)
`Alçada final = MAX(comporta_status, comporta_custo_efetivo, comporta_pegada)` — onde
`custo_efetivo = custo × fator_de_replicação(pegada)`; marca estratégica eleva os tetos de custo; Compliance
é **limite duro** (inegociável). Detalhe em `_fonte/MODELO_FONTE.md` (seção 9).

## Requisitos
- Python 3 (só biblioteca padrão). `openpyxl` é **opcional** (apenas para `carregar_planilha.py`).
- Nenhuma dependência de rede no console.
