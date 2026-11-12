---
tipo: resumo
área: investimentos / ferramentas-ia
status: ativo
criado: 2026-05-20
tags:
  - claude
  - plugins
  - investimentos
  - equity-research
  - valuation
  - ia-aplicada
aliases:
  - 4 Plugins Financeiros do Claude
  - Plugins Marketplace Financeiro
---

# Plugins Financeiros Claude — 4 Essenciais para Investidores

> [!info] Contexto
> O marketplace financeiro do Claude foi construído para o ecossistema inteiro: bancos, fundos, compliance, private equity, contabilidade institucional e M&A. Para o **investidor comum**, apenas **4 plugins** realmente importam — porque cobrem o que de fato se faz no dia a dia: acompanhar ações, gerenciar carteira, analisar empresas e pensar como profissional.

---

## Visão Geral — Qual Plugin Usar?

| # | Plugin | Função Central | Quando Usar |
|---|--------|----------------|-------------|
| 1 | [[Equity Research]] | Workspace completo de análise sell-side | Se instalar **apenas um**, instale este |
| 2 | [[Earnings Reviewer]] | Bisturi para resultados trimestrais | Acompanhar poucas ações com profundidade trimestral |
| 3 | [[Financial Analysis]] | Camada matemática: DCF, comps, modelos | Depois de decidir modelar uma empresa |
| 4 | [[Market Researcher]] | Visão macro de setores e tendências | Quando ainda não sabe **no que** investir |

---

## 01 — Equity Research

>[!tip] O Workspace Completo
> Ambiente equivalente ao trabalho diário de um analista júnior de [[Goldman Sachs]] ou [[Morgan Stanley]], condensado em um único plugin.

### Cobertura do ciclo de pesquisa
- Análises de resultados
- Relatórios de cobertura
- Visão de setores
- Geração de ideias
- Acompanhamento de teses
- Calendário de catalisadores
- Notas matinais

### Principais comandos

| Comando | Função |
|---------|--------|
| `/earnings-analysis` | Relatório institucional de 8–12 páginas a partir de um resultado trimestral |
| `/initiating-coverage` | Relatório completo iniciando cobertura de uma empresa |
| `/screen` | Screening de ações e geração de ideias |
| `/sector` | Relatórios setoriais completos |
| `/thesis` | Cria ou atualiza tese de investimento |
| `/thesis-tracker` | Acompanha desempenho de teses |
| `/catalysts` | Monitora eventos e catalisadores |
| `/earnings-preview` | O que observar antes do resultado |
| `/idea-generation` | Ideias de investimento por tema/setor |
| `/model-update` | Atualiza modelos com novos números |
| `/morning-note` | Nota matinal resumida |

### Exemplo prático
> [[Apple]] divulga resultados → cola a transcrição da call em `/earnings-analysis` → retorno: receita, crescimento de serviços, guidance, desempenho por segmento e riscos mencionados pela gestão.

>[!warning] Limitação real
> **Garbage in, garbage out.** A qualidade depende totalmente dos inputs (transcrições, 10-K, releases). O plugin **não** diz se comprar ou vender — mostra o que mudou, os riscos e os impactos. A decisão é sua.

---

## 02 — Earnings Reviewer

>[!tip] O Bisturi
> Mais rápido e focado que o Equity Research. Feito para uma única pergunta: *"A empresa divulgou resultado. O que eu faço agora?"*

### Principais comandos

| Comando | Função |
|---------|--------|
| `/earnings-analysis` | Análise completa do trimestre |
| `/earnings-preview` | Expectativas antes do resultado |
| `/model-update` | Atualiza receitas, margens e guidance automaticamente |
| `/morning-note` | Resumo rápido do trimestre |
| `/audit-xls` | Audita planilhas procurando erros |
| `/xlsx-author` | Gera arquivos Excel organizados |

### Exemplo prático
> [[Costco]] divulga resultados → cola transcrição → executa `/earnings-analysis` + `/model-update` → projeções atualizadas, planilha corrigida, resumo pronto.

>[!warning] Limitação real
> Não tem análise setorial, geração ampla de ideias nem acompanhamento de teses. Perfeito para **poucas ações**. Para estrutura completa, use [[Equity Research]].

---

## 03 — Financial Analysis

>[!tip] A Camada Matemática
> [[DCF]], [[valuation]], [[comparáveis]] e modelagem financeira. Tudo o que você precisa **depois** de decidir modelar uma empresa.

### Três grandes comandos

| Comando | Função |
|---------|--------|
| `/dcf` | Valuation via fluxo de caixa descontado |
| `/comps` | Comparação com empresas similares |
| `/3-statement-model` | Modelo completo: DRE + balanço + fluxo de caixa |

### Diferencial mais inteligente — Auditoria

> [!quote] Comandos de auditoria
> Envia um modelo financeiro existente e o Claude encontra: fórmulas quebradas, links errados, inconsistências e erros de premissas. **Isso sozinho já justifica usar o plugin.**

### Exemplo prático
> Analisar [[NVIDIA]] → `/dcf` (coleta dados, monta valuation, retorna preço justo) → `/comps` (compara com [[AMD]], [[Broadcom]] e concorrentes do setor).

>[!warning] Limitação real
> Maior curva de aprendizado dos quatro. DCF e modelagem exigem fundamentos de valuation. Mesmo assim vale: **você aprende mais construindo um DCF na prática do que lendo dezenas de artigos.**

---

## 04 — Market Researcher

>[!tip] A Visão Macro
> Enquanto o [[Earnings Reviewer]] é um microscópio em uma empresa, este olha o **setor inteiro**. Ideal quando ainda não sabe no que investir.

### Principais comandos

| Comando | Função |
|---------|--------|
| `/sector-overview` | Visão completa de um setor |
| `/competitive-analysis` | Mapa competitivo do mercado |
| `/comps-analysis` | Comparação entre empresas do setor |
| `/idea-generation` | Gera ideias de investimento |
| `/pptx-author` | Exporta análises em PowerPoint |

### Exemplo prático
> Entender setor de defesa após notícias geopolíticas → `/sector-overview` (empresas, cadeia de suprimentos, dinâmica) → `/idea-generation` (sugere [[RTX]], [[Lockheed Martin]], [[General Dynamics]] e empresas menores).

>[!warning] Limitação real
> Plugin **leve**. Excelente para descobrir ideias, mas depois migre para [[Equity Research]] ou [[Earnings Reviewer]] para aprofundar.

---

## O Que Esses Agentes NÃO Fazem

> [!danger] Pontos críticos
> Esta é a parte mais importante do conteúdo.

- [ ] **Não dizem o que comprar** — entregam valuation, análise, riscos e interpretação. Não entregam BUY ou SELL.
- [ ] **Dados têm limite de atualização** — sem transcrições, filings e documentos atuais, o Claude pode trabalhar com informações antigas. **Sempre valide a atualização dos dados.**
- [ ] **Garbage In, Garbage Out** — premissas absurdas geram resultados absurdos. O plugin organiza cálculos, **não substitui pensamento crítico**.
- [ ] **Não substituem julgamento humano** — aceleram o processo, mas não eliminam a necessidade de análise, reflexão, experiência e [[gestão de risco]].

---

## Princípio-Chave

> [!quote] A tese central do material
> A melhor forma de usar IA não é analisar **mais** ações. É analisar **menos** ações — com mais profundidade.

---

## Resumo Final

- **Melhor plugin geral** → [[Equity Research]]
- **Melhor para resultados trimestrais** → [[Earnings Reviewer]]
- **Melhor para valuation e modelagem** → [[Financial Analysis]]
- **Melhor para descobrir tendências** → [[Market Researcher]]

---

## Próximos Passos Sugeridos

- [ ] Definir 3–5 ações para acompanhar com [[Earnings Reviewer]]
- [ ] Testar `/dcf` em uma empresa que você já conhece bem (validação de premissas)
- [ ] Criar um template de [[tese de investimento]] no Obsidian alinhado ao comando `/thesis`
- [ ] Estruturar fluxo: `/sector-overview` → `/idea-generation` → `/initiating-coverage` → `/thesis-tracker`

---

## Conexões (Dataview)

```dataview
LIST
FROM [[]]
WHERE contains(file.outlinks, this.file.link)
SORT file.mtime DESC
```

```dataview
TABLE tipo, status, criado
FROM #investimentos OR #valuation OR #ia-aplicada
WHERE file.name != this.file.name
SORT criado DESC
LIMIT 10
```

---

## Notas de Uso

> [!info] Sobre este formato
> - **Wikilinks** (`[[ ]]`) funcionam automaticamente no Obsidian — clique para navegar ou criar notas relacionadas.
> - **Callouts** (`>[!tip]`, `>[!warning]` etc.) requerem Obsidian 0.14+ (já incluso no padrão atual).
> - **Bloco Dataview** no final depende do **plugin Dataview** instalado e habilitado.
> - **Fluxo de templates**: esta nota é o *master document*. Para cada plugin que você usar de verdade, crie uma nota-instância (ex.: `Equity Research - Apple Q3 2026`) com link de volta para esta master.

---

> [!note] Confiança: **8/10**
> O resumo está fiel ao documento fornecido — comandos, exemplos e limitações foram preservados com precisão. Fica abaixo de 10 apenas porque:
> - Não validei externamente se todos os comandos listados existem **exatamente** assim no marketplace atual do Claude (o conteúdo é de um criador terceiro, não documentação oficial).
> - Os nomes "Equity Research", "Earnings Reviewer", "Financial Analysis" e "Market Researcher" como plugins do marketplace precisariam ser confirmados em fonte primária da Anthropic se você for usá-los para tomar decisão de instalação.
