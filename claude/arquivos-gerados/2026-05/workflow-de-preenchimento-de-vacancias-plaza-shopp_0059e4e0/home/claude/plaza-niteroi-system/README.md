# Plaza Niterói — Sistema Vacancy-to-Contract

Sistema de acompanhamento de pipeline comercial para o Workflow 1 (Vacancy-to-Contract Sprint) do Plaza Shopping Niterói. Construído a partir do framework Shopping Inteligente OS v5 (Allos).

## O que tem aqui

| Caminho | Descrição |
|---|---|
| `web/index.html` | Sistema web standalone — uso individual offline, dados salvos por navegador |
| `excel/Plaza_Niteroi_Sistema.xlsx` | Planilha Excel estruturada — uso colaborativo via SharePoint/OneDrive |
| `data/pipeline-seed.json` | Pipeline inicial com 27 oportunidades + canais de contato |
| `data/mix-atual-plaza.json` | Lista de marcas confirmadas no Plaza (filtro de duplicidade) |
| `scripts/build_excel.py` | Regenera a planilha Excel a partir dos dados em JSON |
| `docs/` | Documentação operacional, glossário e fontes |

## Início rápido

### Sistema web (uso individual)

```bash
# Abre no navegador padrão
open web/index.html        # macOS
xdg-open web/index.html    # Linux
start web/index.html       # Windows
```

Ou simplesmente dê duplo-clique no arquivo. Dados são salvos automaticamente no navegador via `window.storage`. **Para backup, use o botão "Backup JSON" dentro do sistema** — a aplicação não tem servidor.

### Planilha Excel (uso colaborativo)

1. Abrir `excel/Plaza_Niteroi_Sistema.xlsx` no Excel desktop ou Excel Online
2. Para co-autoria do time: subir o arquivo no SharePoint ou OneDrive corporativo
3. A aba **Instruções** tem o manual completo

### Regenerar a planilha a partir dos JSONs

Se você editar `data/pipeline-seed.json` e quiser recriar a planilha:

```bash
cd scripts
pip install openpyxl
python build_excel.py
# Saída em excel/Plaza_Niteroi_Sistema.xlsx
```

## Arquitetura

```
plaza-niteroi-system/
├── README.md               ← este arquivo
├── web/
│   └── index.html          ← sistema web standalone (HTML + JS + CSS em um arquivo)
├── excel/
│   └── Plaza_Niteroi_Sistema.xlsx  ← planilha gerada
├── data/
│   ├── pipeline-seed.json  ← 27 oportunidades iniciais
│   └── mix-atual-plaza.json ← marcas presentes no shopping (NÃO duplicar)
├── scripts/
│   └── build_excel.py      ← regenerador da planilha
└── docs/
    ├── GLOSSARIO.md
    ├── FONTES.md
    └── OPERACAO.md
```

## Workflow recomendado de uso

| Quem | Onde | Quando |
|---|---|---|
| EV (uso diário) | sistema web | Atualizações rápidas, captura de leads, registro de reuniões |
| Diretoria | planilha Excel | Visão consolidada, relatórios executivos |
| Time inteiro | planilha Excel (SharePoint) | Reuniões de pipeline, sincronização semanal |

Sincronização: o sistema web exporta CSV → o time consolida na planilha → diretoria lê o dashboard. Backup JSON do web faz parte da rotina semanal.

## Próximos passos sugeridos (roadmap)

- [ ] Cruzar pipeline com sistema interno Allos para validar duplicidades
- [ ] Validar status real das 39 saídas do Ano 1 com o EV
- [ ] Pitch H&M Brasil via Grupo Dorben (prioridade 1)
- [ ] Reuniões Bullguer, Ferro e Farinha, Cantón em 21 dias
- [ ] Aprovar conceito do redev foyer com Allos Desenvolvimento (15 dias)
- [ ] Se uso for consistente em 30 dias, migrar para Pipedrive/HubSpot

## Limitações conhecidas

- O sistema web salva dados por navegador, não por usuário. Trocar de máquina = perder dados (a menos que use o JSON backup).
- A planilha Excel suporta co-autoria via SharePoint, mas conflitos em mesma célula prevalece a última gravação.
- Para mais de ~10 usuários simultâneos ou integrações (calendário, email), o caminho correto é Pipedrive/HubSpot/Salesforce.

## Contexto estratégico

Plaza Shopping Niterói: 43.000 m² ABL, 300+ lojas, cluster Entretenimento (Cinemark mantido como âncora). Vacância tratada: ~6.028 m² em 38 saídas + redev do foyer Cinemark (5.097 m²).

Framework: Shopping Inteligente OS v5 / RISC-SRIS / Allos. Workflow 1 = Vacancy-to-Contract Sprint.

Cluster Fit Score escalado: 0–40 (baixo, não priorizar) | 41–70 (aceitável) | 71–85 (forte) | 86–100 (estratégico, sponsor exec).

## Licença e uso

Uso interno Allos. Dados públicos foram coletados de fontes abertas (sites oficiais, brasil-shoppings.com.br, Foursquare, iFood, imprensa local — ver `docs/FONTES.md`). Nenhuma API paga foi acionada na construção.
