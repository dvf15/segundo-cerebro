# Contexto para Claude Code

Este arquivo orienta o Claude Code (e outros agentes) sobre o projeto. Leia antes de fazer mudanças.

## O que é este projeto

Sistema de acompanhamento de pipeline comercial para o **Workflow 1 — Vacancy-to-Contract Sprint** do **Plaza Shopping Niterói** (Allos). Implementa o framework **Shopping Inteligente OS v5**.

Dois artefatos principais:
1. **Sistema web standalone** (`web/index.html`) — HTML+JS+CSS em arquivo único, usa `window.storage` para persistência local
2. **Planilha Excel estruturada** (`excel/Plaza_Niteroi_Sistema.xlsx`) — com dropdowns, formatação condicional, dashboard com fórmulas

Os dois consomem dados de `data/pipeline-seed.json` e `data/mix-atual-plaza.json`.

## Estrutura

```
plaza-niteroi-system/
├── README.md
├── CLAUDE.md                       ← este arquivo
├── .gitignore
├── web/
│   └── index.html                  ← sistema web (NÃO depende de servidor)
├── excel/
│   └── Plaza_Niteroi_Sistema.xlsx  ← gerada pelo script
├── data/
│   ├── pipeline-seed.json          ← 27 oportunidades + canais de contato
│   └── mix-atual-plaza.json        ← marcas confirmadas no shopping (filtro duplicidade)
├── scripts/
│   ├── build_excel.py              ← regenera a planilha a partir dos JSONs
│   └── requirements.txt
└── docs/
    ├── OPERACAO.md                 ← manual de uso para o time
    ├── GLOSSARIO.md                ← definições de estágios, scores, termos
    └── FONTES.md                   ← fontes públicas verificadas
```

## Comandos úteis

```bash
# Regenerar a planilha após editar os JSONs
cd scripts
pip install -r requirements.txt
python build_excel.py

# Abrir o sistema web no navegador
open web/index.html        # macOS
xdg-open web/index.html    # Linux
start web/index.html       # Windows
```

## Regras críticas ao modificar

### 1. Ao adicionar marca ao pipeline-seed.json
Sempre verificar `data/mix-atual-plaza.json` primeiro. Marca que já está no Plaza **NÃO** deve ser adicionada como pipeline novo. Esta verificação foi causa de retrabalho repetido no desenvolvimento — não pule.

### 2. Ao mudar a estrutura de campos
O sistema web (`web/index.html`) tem seus próprios dados embarcados (constante `SEED_DATA`). Se mudar campos no JSON, atualizar também o HTML e o `build_excel.py`. Os três precisam estar sincronizados.

### 3. Ao alterar listas de estágios/donos/prioridades
Mudar em três lugares:
- `web/index.html` (variáveis dentro do `<script>`)
- `scripts/build_excel.py` (constantes `ESTAGIOS`, `DONOS`, `PRIORIDADES`)
- `docs/GLOSSARIO.md` (documentação)

### 4. Política sobre APIs pagas
O framework v5 exige confirmação explícita antes de acionar qualquer API paga (SerpApi, Similarweb, Apollo, Hunter.io, etc.). Não automatize chamadas sem autorização. Lista completa em `docs/FONTES.md`.

### 5. Validar duplicidade antes de pipeline
Esta é a regra mais quebrada historicamente. Lista de marcas verificadas em `data/mix-atual-plaza.json`. **Saturações conhecidas:**
- Esporte (Nike/Centauro/Decathlon/Trackfield/+4)
- Moda mainstream feminina/masculina (Renner/Riachuelo/C&A/Marisa/Calvin Klein/Lacoste/+30)
- Lazer infantil (LEGO/Ri Happy/Bay Games/+4 lojas internas Plaza)
- Sorveteria/açaí (Bacio di Latte/Oakberry/Yogoberry/Bibi Sucos JÁ EXISTEM)
- Beleza mainstream (Sephora/MAC/L'Occitane/+10)

## Conhecimento de domínio relevante

### Plaza Shopping Niterói
- ABL: 43.000 m² | 300+ lojas | Inaugurado 1986
- Operadora: Allos (ex-BR Malls/Aliansce/Sonae)
- Localização: Rua XV de Novembro 8, Centro de Niterói/RJ
- Cluster: **Entretenimento** (Cinemark mantido como âncora)
- Vacância tratada: ~6.028 m² em 38 saídas + redev foyer Cinemark 5.097 m²

### Framework Shopping Inteligente OS v5
- Operacional Conversion Cockpit Edition
- 3 workflows prioritários:
  - W1: Vacancy-to-Contract (este sistema)
  - W2: Street-to-Shopping Conversion
  - W3: Cluster Experience Growth
- Cluster Fit Score (0-100) escalado por bandas (40/70/85)
- Deal Conversion Layer com 15 estágios + dono + próxima ação + prazo + blocker

### Mandamentos do Levy (referência no framework)
- Mand. 6: Prospecção de rua
- Mand. 7: Multimarcas como vetor
- Mand. 8: Multifranqueado da região
- Mand. 10: 10 reuniões semanais por executivo

## Limitações conhecidas

1. Lista de duplicidade (~100 marcas em `mix-atual-plaza.json`) pode estar incompleta. Para validação final, cruzar com sistema interno Allos.
2. Sistema web salva por navegador. Backup JSON é responsabilidade do usuário.
3. Co-autoria Excel via SharePoint não foi testada pela construção — depende do ambiente do cliente.
4. Para >10 usuários simultâneos, recomenda-se migrar para Pipedrive/HubSpot.

## Histórico de retrabalho (lições aprendidas)

Durante a construção, marcas foram sugeridas erradamente várias vezes por não consultar a lista atual. Marcas que foram removidas após validação:
- Bacio di Latte, Oakberry, Yogoberry, Bibi Sucos (sorveteria/açaí — JÁ EXISTEM)
- Decathlon, Nike, Centauro, Hocus Pocus (saturadas/já presentes)
- LEGO, Ri Happy, Bay Games, Cherry Park (lazer infantil saturado)
- Carter's, Puket, Lilica Tigor (infantil saturado)

**Regra aprendida:** ao sugerir nova marca, fazer busca individual ("[marca] Plaza Niterói") antes de incluir. Não confiar apenas em listas agregadas como brasil-shoppings.

## Próximos passos do projeto

1. Cruzar pipeline com sistema interno Allos para validar duplicidades finais
2. Validar status real das 39 saídas do Ano 1 com o EV (várias aparecem ainda na lista de tenants ativos)
3. Pitch H&M Brasil via Grupo Dorben (prioridade 1)
4. Reuniões Bullguer, Ferro e Farinha, Cantón em 21 dias
5. Aprovar conceito do redev foyer com Allos Desenvolvimento (15 dias)
6. Se uso for consistente em 30 dias, migrar para Pipedrive/HubSpot
