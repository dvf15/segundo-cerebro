---
tipo: nota-aula
área: estratégia/risco-político
status: estudo
criado: 2026-05-21
tags:
  - risco-político
  - estratégia-integrada
  - expropriação
  - teoria-dos-jogos
  - estudo-de-caso
  - stanford-gsb
  - epso
aliases:
  - "Repsol YPF Argentina"
  - "Caso Repsol"
  - "Political Risk - Repsol"
fonte: "Stanford GSB — EPSO, Session 2: Political Risk — Katherine Casey"
---

# Risco Político — Repsol na Argentina

> [!info] Contexto da aula
> Material da **Stanford Graduate School of Business**, Executive Program in Strategy and Organization (EPSO), Sessão 2 sobre [[Risco Político]]. Conduzida pela professora Katherine Casey (Política Econômica). Usa o caso da expropriação da YPF pela Argentina (2012) para introduzir o framework de [[Estratégia Integrada]] e a modelagem de [[Expropriação como Hold-Up Problem]].

---

## 🎯 Mensagens centrais (recap)

> [!quote] Quatro ideias-âncora da disciplina
> 1. Governos **intervêm nos mercados** o tempo todo, em todos os lugares.
> 2. Intervenção governamental **impõe custos** e **cria oportunidades**.
> 3. Minimizar custos e alavancar oportunidades é o que define a [[Estratégia Integrada]].
> 4. Para isso é preciso **entender políticos, burocratas e reguladores**.

---

## 📰 O caso: a expropriação da YPF

Em **16 de abril de 2012**, a presidente argentina **Cristina Fernández de Kirchner** anunciou que o governo tomaria participação majoritária na **YPF**, a maior petrolífera do país, então controlada pela espanhola [[Repsol]].

> [!quote] Justificativa pública da presidente
> "Recovery of sovereignty and control" (recuperação da soberania e do controle). Em resposta à indignação espanhola, ela completou: "I am a head of state and not a hoodlum" (sou chefe de Estado, não uma marginal).

### Impacto na Repsol

- **Jan 2012**: governo anuncia possibilidade de nacionalizar a YPF → ação da Repsol começa a cair (em torno de €20).
- **Abr 2012**: nacionalização efetiva dos **51%** da Repsol na YPF.
- **Jul 2012**: ação atinge a faixa de **€10–11**, queda de aproximadamente **45–50%** em seis meses.

> [!warning] Leitura do gráfico
> O mercado **precificou o risco antes da expropriação efetiva**. A queda começa no anúncio (jan/2012) e acelera no ato (abr/2012). Isso é típico de [[Risco Político]] sinalizado.

---

## ❓ Três perguntas da sessão

1. A Repsol **deveria ter previsto** isso desde o começo?
2. Poderia ter **tomado medidas para prevenir**?
3. O que a Repsol **deveria fazer agora** (pós-expropriação)?

---

## 🌎 Pergunta 1 — Foi boa ideia entrar na Argentina em 1999?

### Tendências do Estado de Direito (Rule of Law)

Usando o **Worldwide Governance Indicators (WGI)** do Banco Mundial, em unidades de desvio-padrão (escala aproximada de -2,5 a +2,5):

| País | Posição típica no período | Tendência 1996–2012 |
|---|---|---|
| Estados Unidos | ~+1,5 (referência alta) | Estável |
| Brasil | ~-0,2 a 0,0 | Levemente positiva |
| Argentina | ~0,0 em 1996 → ~-0,7 após 2002 | **Forte deterioração** |
| Bolívia | ~-0,3 → ~-0,9 | Deterioração |
| Equador | ~-0,5 → ~-1,2 | Deterioração |
| Venezuela | ~-0,9 → ~-1,7 | Forte deterioração |

> [!info] Insight do gráfico
> Quando a Repsol entrou (1999), a Argentina ainda estava próxima de zero em Rule of Law — **comparável ao Brasil**. Após a **crise de 2002**, o país caiu para o patamar do bloco andino (Bolívia/Equador). A escolha de **comparar com a Petrobras no Brasil** é proposital: contexto inicial semelhante, trajetórias muito diferentes.

### Principais players de O&G na região (2007)

| País | Produção de petróleo (k bpd) | Reservas provadas (B boe) |
|---|---|---|
| Venezuela | 3.093 | 118,8 |
| Brasil | 2.023 | 14,9 |
| Argentina | 1.454 | 5,3 |
| Equador | 520 | 4,3 |
| Bolívia | 228 | 4,6 |

> [!note]
> Argentina tinha produção relevante, mas reservas modestas — o que muda dramaticamente com a descoberta do potencial de **shale (Vaca Muerta)**, fator decisivo para entender o timing da expropriação.

- [ ] Revisar tendência de Rule of Law da Argentina nos anos imediatamente anteriores a 2012
- [ ] Comparar com indicadores complementares (Control of Corruption, Regulatory Quality)

---

## 🎲 Pergunta 2 — A expropriação foi boa decisão (econômica e politicamente)?

### Risco político como [[Hold-Up Problem]]

> [!important] Definição
> **Hold-up problem**: uma parte faz investimento específico (irreversível) e fica refém da outra, que pode renegociar termos depois. No caso, a empresa investe primeiro; o governo decide depois se expropria.

### Estrutura do jogo

**Dois jogadores:**
- **Firma**: maximiza lucro.
- **Governo**: maximiza receita e "rents" políticos.

**Dois períodos:**
- Período 1 (curto prazo): firma decide investir ou não.
- Período 2 (longo prazo): governo decide expropriar ou não.

**Parâmetros:**

| Símbolo | Significado |
|---|---|
| `t` | Alíquota de imposto |
| `K` | Custo fixo do investimento |
| `P1` | Lucro pré-imposto no período 1 |
| `P2` | Lucro pré-imposto no período 2 |
| `B` | Benefícios políticos da expropriação |
| `C` | Custos políticos da expropriação |
| `a` | Eficiência do governo operando o ativo (0 < a < 1) |

> [!warning] Premissa-chave
> **O governo não consegue se comprometer credivelmente a não expropriar.** Toda a tensão estratégica nasce daí.

### Matriz de payoffs

| Cenário | Payoff da firma | Payoff do governo |
|---|---|---|
| Não investe | 0 | 0 |
| Investe, sem expropriação | (1−t)·(P1 + P2) − K | t·(P1 + P2) |
| Investe, com expropriação | (1−t)·P1 − K | t·P1 + a·P2 + B − C |

### A condição de expropriação

Comparando payoffs do governo:

$$\text{Expropria se: } (a - t) \cdot P_2 + B > C$$

> [!tip] Como ler a desigualdade
> O governo expropria quando o ganho de operar diretamente (descontada sua menor eficiência `a` em relação ao imposto `t` que já receberia), aplicado sobre o lucro de longo prazo `P2`, somado aos ganhos políticos `B`, supera os custos políticos `C`.

### Decisão da firma

- Se **não espera** expropriação: investe se `(1−t)·(P1 + P2) > K`
- Se **espera** expropriação: investe se `(1−t)·P1 > K`

**Fatores que tornam o investimento mais atrativo:**
- Lucros altos e "garantidos" de curto prazo (`P1` alto)
- Custo inicial baixo (`K` baixo)
- Impostos baixos (`t` baixo)
- Ausência de expropriação

### Dois cenários ilustrativos

**Cenário 1 — "A Sure Thing":** mesmo se expropriado, `(1−t)·P1 − K > 0`. A firma investe de qualquer jeito porque o retorno só do período 1 já paga o custo. Bom para a firma, mas sinaliza que o investimento podia ter sido maior se a ameaça não existisse.

**Cenário 2 — Investment Deterred:** o investimento seria sólido sem expropriação, mas o governo expropriaria, e com expropriação o retorno fica negativo. **A firma não investe**, e o investimento socialmente útil nunca acontece.

> [!danger] Problema central
> 1. **Perdas de produtividade** quando o governo expropria e opera (a < 1).
> 2. **Investimento lucrativo é deterred** pela ameaça — especialmente os com alto `P2`, que são **exatamente os mais importantes para o desenvolvimento**.
> 3. **Tanto a firma quanto o governo estariam melhor** se a expropriação fosse impossível.

---

## 🧠 Aplicando o modelo ao caso Repsol

> [!question] Discussão em grupo (slide 23)
> Tomando a perspectiva da presidente Fernández: o que motivou a expropriação? Onde a Repsol errou? Organizar a resposta pelos parâmetros do modelo: `a`, `t`, `P2`, `B`, `C`.

### Hipóteses de leitura pelos parâmetros

> [!note] Estas são interpretações analíticas a partir dos slides — o material não fornece valores numéricos específicos para cada parâmetro no caso real.

- **P2 (lucros de longo prazo)**: descoberta do **Vaca Muerta** (shale gas/oil) elevou drasticamente o `P2` esperado da YPF → tornou a expropriação mais atrativa.
- **B (benefícios políticos)**: discurso de "soberania" + apelo nacionalista + crise de balanço de pagamentos + necessidade de aumentar produção doméstica para reduzir importações de energia → `B` alto.
- **C (custos políticos)**: a Argentina já tinha rule of law deteriorado e relações tensas com mercados internacionais; o custo reputacional **adicional** era baixo → `C` baixo.
- **a (eficiência do governo)**: provavelmente baixa, mas a percepção política tende a superestimá-la.
- **t (impostos)**: se a Repsol percebia retornos "altos demais" via baixa taxação ou repatriação agressiva de dividendos, o governo via `t·P2` como insuficiente.

### Onde a Repsol pode ter errado (leitura via modelo)

- **Subinvestimento em desenvolvimento de reservas** → narrativa de "estão tirando lucro mas não estão investindo no país" → aumentou `B` (benefício político de retomar).
- **Distribuição agressiva de dividendos** → reforçou percepção de extração de valor.
- **Pouco engajamento político/diplomático preventivo** → não construiu `C` (custo político) suficiente para dissuadir.
- **Pouca diversificação de stakeholders locais** (sócios locais relevantes, parcerias provinciais) que aumentariam `C`.

---

## ⚖️ Pergunta 3 — O que a Repsol deve fazer agora?

### Quatro opções (B-case)

| Opção | Lógica |
|---|---|
| **Arbitragem** | Foro internacional (ICSID/Banco Mundial). Pressão institucional. |
| **Ação judicial** | Tribunais nacionais e internacionais. |
| **Diplomacia** | Pressão via governo espanhol, UE, mercados financeiros. |
| **Write-off** | Reconhecer perda, sair, focar em outros mercados. |

### Perguntas-guia

- Prós e contras de cada opção?
- Quais as **fontes de leverage** de cada parte?
- Há espaço para **acordo win-win**?

> [!tip] Fontes de leverage da Repsol
> - Arbitragem internacional (ICSID) com potencial de bilhões em compensação.
> - Capacidade de **bloquear** acesso da YPF/Argentina a capital, tecnologia e parceiros internacionais para Vaca Muerta.
> - Litígio contra a Chevron pelo deal de set/2012.
> - Reputação argentina junto a investidores estrangeiros.

> [!tip] Fontes de leverage da Argentina
> - Posse física do ativo.
> - Soberania jurisdicional.
> - Apelo político-eleitoral interno.
> - Capacidade de protelar (tempo joga contra a Repsol no fluxo de caixa).

### Timeline da recuperação de valor (C-case)

| Data | Evento |
|---|---|
| Abr 2012 | Argentina nacionaliza 51% da YPF |
| Set 2012 | YPF assina com Chevron para desenvolver Vaca Muerta |
| Dez 2012 | Repsol abre arbitragem no Banco Mundial pedindo **US$ 10,5 bi** |
| Dez 2012 | Repsol processa Chevron pelo deal com a YPF |
| Jul 2013 | Repsol ataca o "scandalous" investimento da Chevron |
| Jan 2014 | Início de negociações secretas |
| Fev 2014 | Acordo final: **US$ 5 bi (ou ~US$ 6 bi, fontes divergem nos slides)** em compensação |

> [!quote] Avaliação dos analistas (FT, 2014)
> Citi avaliou o pacote de compensação como "better than the market expected".

> [!note] Discrepância nos slides
> O slide 26 menciona em texto que o board votou por aceitar **US$ 5 bi**, mas no caption do gráfico aparece **US$ 6 bi** como "compensation offer". O valor amplamente reportado pela imprensa internacional na época foi de cerca de **US$ 5 bi em títulos soberanos argentinos**. Vale checar a fonte primária para citação precisa.

---

## 🧩 Take-aways finais

> [!success] Três pilares
> **1. Risco político**
> Expropriação é um **hold-up problem**. Analise por **dual perspective taking**: o que o governo quer? Como as ações da firma se alinham ou colidem com os objetivos do governo?
>
> **2. Estratégia integrada**
> A **interdependência** entre fatores de mercado e não-mercado exige estratégia integrada. O objetivo é **proativamente** endereçar realidades não-mercado em apoio à estratégia comercial.
>
> **3. Recuperar valor**
> Para investimentos comprometidos, avaliar: opções de **foro institucional**, **fontes de leverage** de cada parte, espaço para **compromisso win-win**.

---

## 🔗 Conexões e leituras relacionadas

```dataview
LIST
FROM #risco-político OR #estratégia-integrada OR #teoria-dos-jogos
WHERE file.name != this.file.name
SORT file.mtime DESC
```

### Conceitos para criar/conectar

- [[Hold-Up Problem]]
- [[Estratégia Integrada]] (market + nonmarket)
- [[Worldwide Governance Indicators (WGI)]]
- [[Vaca Muerta]]
- [[ICSID — Arbitragem do Banco Mundial]]
- [[Dual Perspective Taking]]
- [[Commitment Problem]] (teoria dos jogos)
- [[Risco Soberano vs Risco Político]]

### Referência primária

- Shotts, Ken. **"Political Risk as a Hold-up Problem: Implications for Integrated Strategy."** *Advances in Strategic Management*, Vol. 34, 2016.
- Romero, S. & Minder, R. **"Argentina to Seize Control of Oil Company."** *The New York Times*, 16 abr 2012.

---

## 📚 Como usar esta nota

> [!info] Padrão de uso
> - **Wikilinks** `[[ ]]` levam a conceitos relacionados — crie a nota quando clicar.
> - **Bloco Dataview** acima lista automaticamente outras notas com as mesmas tags.
> - **Templates**: esta nota segue o padrão tipo=nota-aula para uso com Templater.
> - **Callouts** (`>[!info]`, `>[!warning]`, etc.) destacam tipos diferentes de conteúdo.
> - **Checkboxes** marcam pontos para revisão futura.

---

## 🎚️ Confiança da nota

**Confiança: 7/10**

> [!warning] Pontos de incerteza
> - O slide 26 traz **inconsistência interna** entre US$ 5 bi (texto) e US$ 6 bi (caption do gráfico) para o acordo final — não consigo resolver isso só com o material fornecido.
> - As **hipóteses sobre os parâmetros do modelo aplicados ao caso real** (seção "Onde a Repsol pode ter errado") são minhas leituras analíticas a partir do framework, não estão explicitamente nos slides. Os slides apresentam isso como discussão aberta em grupo, sem respostas oficiais.
> - Os **valores aproximados de Rule of Law** na tabela são leituras visuais do gráfico (slide 11), não dados extraídos do dataset WGI — podem ter erro de ±0,1.
> - O caption do slide 5 cita "Thomson Reuters Datastream in FT.com, Feb 26, 2014" como fonte do gráfico de preço da ação — não verifiquei se a faixa exata de queda (45–50%) está correta; é estimativa visual do gráfico.
> - **Não busquei verificação externa** (web search) das datas e valores; tudo aqui vem exclusivamente do PDF enviado. Para uso em apresentação ou citação formal, recomendo cruzar com fontes primárias (FT, NYT, relatórios anuais da Repsol).
