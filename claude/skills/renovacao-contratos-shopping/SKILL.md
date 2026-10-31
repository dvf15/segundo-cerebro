---
name: renovacao-contratos-shopping
description: "Conduz renovações de contrato de lojas-satélite em shopping center: classifica por mix e quadrante, define a janela de negociação, monta os 4 argumentos, calcula o Leasing Spread real, aplica alçadas e planeja o LSR anual."
---

# Renovação de Contratos de Loja

## Quando usar

Ative quando o pedido envolver: renovar/reajustar/renegociar contrato de loja · calcular ou justificar LSR (Leasing Spread) · classificar lojas por mix ou quadrante · decidir quando abrir a negociação · montar argumentos de aumento de AMM · avaliar risco de ação renovatória · montar ou revisar o planejamento anual de renovações · preparar reunião com lojista sobre fim de vigência.

**NÃO use para:** locação nova/prospecção (é precificação de tabela) · âncoras, megalojas, quiosques, mídia, contratos atípicos (o método cobre **apenas lojas-satélite**) · cobrança/inadimplência/despejo por falta de pagamento · pedido puramente jurídico (dê contexto, não parecer).

## Princípios

1. **Escopo:** só lojas-satélite.
2. **O LSR é a única alavanca real.** Inflação e degrau já estão dados no contrato.
3. **Nenhum argumento sem base numérica.**
4. **Horizonte de 60 meses** — o erro de hoje se paga por 5 anos.
5. **Relacionamento é ativo de longo prazo**, mas não se troca resultado por relacionamento — nem se destrói relacionamento por uma negociação.

## Dados de entrada obrigatórios

Antes de produzir qualquer número, confirme. Se faltar, **peça — não estime**.

```
IDENTIFICAÇÃO  LUC · Nome Fantasia · Segmento · Área (m²) · Shopping
CONTRATO       Início · Fim da vigência (validar na MINUTA, não só no sistema) · Índice de reajuste ·
               Mês base · Data do último reajuste · Degrau · Piso · Fator de aluguel percentual ·
               Ponto de equilíbrio · Aditivos · Cláusulas especiais · Contrato comercial? (se não, haverá CDU)
FATURAMENTO    (média 12m) AMM · A% · Condomínio comum · Condomínio específico · FPP
DESEMPENHO     Vendas (média 12m EXPURGANDO sazonalidade) · Custo de Ocupação · CO/Vendas % ·
               Crescimento anual · Meses inadimplente · Saldo em aberto · Data da última auditoria integral
COMPARATIVOS   Média AMM/m² e Vendas/m² das satélites · Média AMM/m² de lojas próximas / mesmo piso /
               mesmo tamanho · Média AMM/m² de 3 principais concorrentes / mesmo segmento (Abrasce) ·
               CO/Vendas da mesma loja na rede · Tabela ABC do espaço · Inflação acumulada
CLASSIFICAÇÃO  Mix validado pelo comitê comercial
```

**Regra anti-alucinação:** nunca invente comparativos, médias de rede, Tabela ABC ou inflação. Se o dado não veio, escreva `[FALTA: <dado>]`, siga com o que der e liste os faltantes no fim.

## Fluxo — 7 fases

```
1 Classificar → 2 Definir janela → 3 Due diligence → 4 Montar argumentos
→ 5 Calcular LSR real → 6 Negociar dentro da alçada → 7 Registrar no planejamento
```

### Fase 1 — Classificação

**Mix.** Pergunte: a marca é aderente ao posicionamento? gera fluxo? produtos direcionados ao público-alvo? está nos concorrentes? é referência no segmento? o segmento está saturado ou carente? o segmento suportaria a saída da loja?

| Classificação | Significado |
|---|---|
| Essencial | Valoriza a imagem — queremos/precisamos renovar |
| Relevante | Importante para o mix — temos interesse em renovar |
| Indiferente | Mantenedora — sem prejuízo ao mix se não renovar |
| Ofensora | Não adequada — denigre a imagem, sem interesse em renovar |

A classificação **precisa de validação do comitê comercial**. Se o usuário não disse que foi validada, trate como preliminar e sinalize.

**Quadrante.** Compare contra a média das lojas-satélite do shopping. AMM/m² = AMM do último mês ÷ área. Vendas/m² = vendas média 12m expurgada ÷ área.

| Quadrante | Vendas/m² | AMM/m² | Leitura |
|---|---|---|---|
| 1 | ↑ | ↓ | Vende bem, paga pouco → maior espaço de LSR |
| 2 | ↑ | ↑ | Vende bem, já paga bem |
| 3 | ↓ | ↑ | Vende mal, já paga caro → avaliar posicionamento/permanência |
| 4 | ↓ | ↓ | Vende mal, paga pouco → investigar a origem do problema |

### Fase 2 — Janela de negociação

**Regra zero: nunca negocie antes do último reajuste** (em geral, faltando 12 meses). Antes disso o contrato ainda sofre reajuste por índice ou degrau e o LSR estimado derrete. Exemplo real: LSR de 33,3% fechado a 14 meses do fim virou **21% efetivo** após reajuste de 10%. Exceção: contratos de gestão anterior com reajuste próximo ao fim — incorporar esse reajuste na proposta.

| Mix | Janela de contato ativo |
|---|---|
| Essencial · Relevante | **12 a 6 meses** do fim do contrato |
| Indiferente · Ofensora | **menos de 6 meses** do fim |

Abaixo de 6 meses o direito à ação renovatória expira e o poder de decisão passa para o shopping. **Antes de negociar nessa faixa, confirme com o jurídico que não há ação ajuizada** — sempre inclua esse passo na saída.

Impasse em loja Essencial/Relevante: aditivo de contrato, no máximo **3 vezes** e **90 dias no total** de alteração da data de fim. Contato pelo lojista pode vir a qualquer momento — estar sempre acessível.

### Fase 3 — Due diligence

Levante: perfil do lojista (profissional × pouca experiência em varejo) · se é Key Account (informar a Holding) · business (mercado / rede / interno) · leitura do contrato (data da última reforma, condições de degrau, aditivos, reajuste só em variação positiva, cláusulas especiais) · faturamento · desempenho · auditoria · Tabela ABC.

**Trava de auditoria:** 100% das lojas a renovar devem ter auditoria integral em pelo menos um mês nos **6 meses anteriores** ao início da negociação. Ideal: integral de 6 a 3 meses antes + fechamento nos 2 últimos meses. Auditorias em mês de sazonalidade histórica não contam. Dispersão de 15% na curva → reauditar no mês seguinte. Se a data estiver fora da janela, **trate como bloqueio**, não como observação.

Composição média do boleto (satélites): AMM 60% · Condomínio 30% · FPP 6% · A% 4%.

O argumento de diluição (aumento de X% no AMM = +1,33% no custo total do lojista) é delicado: **só use se o lojista levantar o assunto**.

### Fase 4 — Os 4 argumentos

Calcule os quatro. **Dentro de cada argumento, use sempre o MAIOR valor.** Expurgue lojas não comparáveis de todas as médias.

**Argumento 1 — Incorporação do A%**
```
Arg1 = A% médio (expurgando dezembro) ÷ AMM     ex.: 1.000 ÷ 10.000 = 10%
```
Justificativa ao lojista: o boleto não muda — o A% já pago migra para o AMM. Ganho: mitiga sonegação e garante receita corrigida pela inflação.

**Argumento 2 — CO/Vendas da mesma loja em outros shoppings**
```
1. CO/Vendas da loja                      →  9,2%
2. Média CO/Vendas da mesma loja na rede  → 11,3%
3. Diferença                              →  2,1%
4. Diferença × Vendas (2,1% × 130.000)    →  2.730
5. (10.000 + 2.730) ÷ 10.000 − 1          → 27,3%
```
Sem base na rede, ou diferença negativa → usar o CO/Vendas do segmento dentro do próprio shopping.

**Argumento 3 — Entorno, piso e tamanho**
```
entorno = Média AMM/m² (lojas próximas) ÷ AMM/m² − 1
piso    = Média AMM/m² (mesmo piso)     ÷ AMM/m² − 1
tamanho = Média AMM/m² (mesmo tamanho)  ÷ AMM/m² − 1
ex.: 120/100−1 = 20% · 96/100−1 = −4% · 108/100−1 = 8% → usa 20%
```

**Argumento 4 — Pares**
```
concorrentes = Média AMM/m² (3 principais concorrentes) ÷ AMM/m² − 1
segmento     = Média AMM/m² (mesmo segmento, Abrasce)   ÷ AMM/m² − 1
satélites    = Média AMM/m² (satélites do shopping)     ÷ AMM/m² − 1
ex.: 113/100−1 = 13% · 107/100−1 = 7% · 91/100−1 = −9% → usa 13%
```

Sempre apresente o resumo em tabela: Argumento | Comparativo | Incremento.

### Fase 5 — LSR real

**Relevantes e Indiferentes:**

| Mix | Quadrantes 1, 2 e 4 | Quadrante 3 |
|---|---|---|
| Relevante | **Média dos 2 maiores** argumentos + inflação | Avaliar **posicionamento** da operação |
| Indiferente | **Maior** argumento + inflação | Avaliar **permanência** da operação |

Ex.: Relevante → média(27,3%; 20%) = 23,6% + inflação · Indiferente → 27,3% + inflação.

**Essenciais e Ofensoras** (independe do quadrante): Essencial → importante para imagem/estratégia, cálculo **caso a caso**, não aplique a fórmula mecanicamente. Ofensora → a ideia é que não permaneça; se o shopping está forte, pode-se inviabilizar a renovação (LSR alto), com atenção redobrada à renovatória.

**Quadrante 4 (Relevante/Indiferente):** antes do número, responda qual a origem do problema. *Localização* → ponderar a força dos argumentos contra a dificuldade real de locar o espaço. *Performance* → CO/Vendas elevado por baixa venda: comparar com o segmento e demonstrar que o problema não é o valor cobrado, e sim o desempenho (layout, estoque, equipe, produtos desalinhados).

**Feche sempre com três checagens:** (1) somar a **inflação acumulada** do último aniversário até o início da nova vigência; (2) comparar com a **Tabela ABC**; (3) **teste do perito** — "se isso virar renovatória, o laudo me dá razão?". Se não, aperte menos: sentença favorável ao lojista faz o shopping arcar com os custos dele.

**Degrau:** posicione preferencialmente no 12º e 36º mês (não 24º/48º) — antecipa receita.

### Fase 6 — Negociação

**1º contato:** ouvir, apresentar o shopping do presente e o que vem (revitalização, expansão, qualificação de mix), ter estudado redução de área ou mudança de ponto. Ideal: sair com proposta do próprio varejista. Deixar claro que **a decisão final é do comitê comercial** (reunião semanal).

**2º contato:** valor-alvo **já aprovado em comitê**. Não aceitar a proposta da 1ª reunião. Contraproposta com todos os argumentos, explicando cada diferença.

**Alçadas** (sobre a proposta aprovada em comitê): Coordenador Comercial **115% → 110%** · Gerente Financeiro/Comercial **110% → 105%** · Superintendente **105% → 100%**. Ultrapassou o valor aprovado → volta ao comitê. Negociação improdutiva → subir o interlocutor. Superintendente acionado direto pelo lojista → leva o coordenador e recomeça pelo processo de alçadas.

**Os cinco NUNCA:** insinuar sonegação · modificar a proposta porque o lojista perdeu o prazo da renovatória · citar a palavra "meta" · desvalorizar o ponto onde a loja está · fornecer informação confidencial de concorrentes.

**Os cinco SEMPRE:** valorizar o empreendimento · tratar o lojista com respeito · demonstrar conhecimento da loja/ramo/varejo · ter certeza dos números informados · apresentar melhorias feitas e próximos passos.

**Bloqueios absolutos:** não renovar com lojista **inadimplente**; não renovar com lojista que tenha **ação judicial contra o shopping**. Sempre negociar a retirada de cláusulas especiais e subsídios e incluir **reforma como obrigatoriedade** no novo contrato.

### Fase 7 — Planejamento anual

Feito junto com o Orçamento, concluído **antes** de qualquer negociação do ano, atualizado a cada contrato renovado. Blocos: Cadastro (LUC, Nome Fantasia, Área, Fim da Vigência, Finalizar Negociação em) · Parâmetros (quadrante, mix, Vendas/m², CO/Vendas, último AMM e AMM/m², Tabela ABC, data da última auditoria) · Planejado (AMM médio/m², AMM médio, LSR) · Realizado. Validar meta anual e % de atingimento com o comitê; havendo gap, elaborar estratégia. Nenhuma loja pode operar com contrato vencido.

## Risco renovatório

Levante ativamente quando: a loja for Ofensora · faltarem entre 12 e 6 meses · o LSR proposto for agressivo · o usuário mencionar resistência do lojista.

Pontos-chave: janela de ajuizamento **12 a 6 meses** · resposta do shopping em **15 dias** · a **contraproposta vincula** e define a sucumbência · aluguel provisório **≤ 80%** do pedido/contraproposta · honorários advocatícios **10% a 20%** · duração média **2,5 anos** · **acordo, em regra, é a melhor opção** · **Laudo Preliminar não vai aos autos**.

## Formato de saída

Entregue em markdown no padrão Obsidian: frontmatter YAML (`tipo`, `área`, `status`, `criado`, `tags`, `aliases`), wikilinks nos conceitos, callouts, checkboxes nas ações, seções separadas por `---`, bloco Dataview no fim e **nota de confiança 1-10**.

Esqueleto de uma análise de loja:

```markdown
---
tipo: analise-renovacao
área: shopping-centers/comercial
status: em-negociacao
criado: AAAA-MM-DD
tags: [renovacao, <shopping>, <segmento>]
aliases: [<Nome Fantasia>, <LUC>]
---

# Renovação — <Nome Fantasia> (<LUC>)

> [!info] Ficha
> Shopping · Segmento · Área · Fim da vigência · Meses restantes · Última auditoria

## 1. Classificação
Mix: <> (validado pelo comitê? sim/não) · Quadrante: <> · AMM/m²: <> vs satélites <> · Vendas/m²: <> vs satélites <>

## 2. Janela
<dentro/fora> · último reajuste em <> · ação: <negociar agora / aguardar / checar jurídico>

## 3. Diagnóstico
CO/Vendas · crescimento · inadimplência · cláusulas especiais a extinguir

## 4. Argumentos
| Argumento | Tipo | Incremento |

## 5. Proposta
LSR real <>% + inflação <>% = <>% → AMM proposto R$ <>
Tabela ABC: R$ <> · Teste do perito: <forte/frágil> · Degrau sugerido: 12º e 36º mês
Faixa de alçada: comitê R$ <> · coordenador até R$ <>

## 6. Ações
- [ ] ...

## 7. Riscos
> [!danger] ...

## Dados faltantes
- [FALTA: ...]

> [!note] Confiança: X/10 — <justificativa>
```

## Guardrails

- Confirmei que é **loja-satélite**
- **Não inventei** comparativos, médias de rede, Tabela ABC ou inflação
- Sinalizei se a classificação de mix não foi validada pelo comitê
- Checei a **trava de auditoria** e a tratei como bloqueio, se fora da janela
- Usei o maior valor dentro de cada argumento e a regra certa de mix × quadrante
- **Somei a inflação** ao LSR real
- Confrontei com a **Tabela ABC**
- Fiz o **teste do perito** e sinalizei risco renovatório
- Lembrei que **a decisão é do comitê**
- Não sugeri renovar com lojista inadimplente ou com ação judicial
- Marquei o que é cálculo do método e o que é julgamento meu
- Entreguei no formato Obsidian com nota de confiança

**Limites honestos:** o material-fonte é de 2011. Nomes de processos internos (PES, Tabela ABC, comitê, Key Account, auditoria) e o conteúdo jurídico podem ter mudado. Quando um desses pontos for decisivo para a recomendação, diga que precisa ser validado contra a política vigente em vez de afirmar como regra atual. Esta skill **não substitui parecer jurídico**.