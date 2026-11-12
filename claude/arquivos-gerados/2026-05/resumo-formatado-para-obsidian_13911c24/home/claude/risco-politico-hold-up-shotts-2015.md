---
tipo: resumo-academico
área: estratégia-empresarial
status: ativo
criado: 2026-05-21
tags:
  - risco-político
  - estratégia-integrada
  - economia-política
  - hold-up-problem
  - investimento-estrangeiro
  - expropriação
  - teoria-dos-jogos
aliases:
  - Risco Político como Hold-Up Problem
  - Shotts 2015
  - Modelo Hold-Up Político
---

# Political Risk as a Hold-Up Problem: Implications for Integrated Strategy

> [!info] Metadados do material
> - **Autor:** Kenneth W. Shotts
> - **Instituição:** Stanford Graduate School of Business
> - **Data:** 20 de abril de 2015
> - **Tipo:** Paper acadêmico / Working paper
> - **Tema central:** Modelagem de risco político como problema de hold-up e implicações para estratégia integrada das firmas

---

## 1. Tese central

O paper desenvolve um modelo simples de teoria dos jogos para tratar [[risco político]] como um clássico [[hold-up problem]]: a firma faz um investimento irreversível (relationship-specific) e, depois, o governo decide se respeita o investimento ou se expropria parte/todo o retorno.

> [!important] Insight principal
> A gestão eficaz de risco político **não pode ser delegada apenas à área de Relações Governamentais ou Public Affairs**. Exige uma [[estratégia integrada]] que abrange finanças, RH, value chain e operações, garantindo que governo e comunidades locais enxerguem benefício claro e contínuo na presença da firma.

---

## 2. Tipos de risco político

O autor identifica três formas principais:

- [[Nacionalização direta]] ou expropriação total dos ativos
- [[Creeping expropriation]] — mudanças graduais em impostos, propriedade intelectual ou regulação que erodem o lucro
- [[Controles cambiais]] que impedem multinacionais de remeter lucros para fora do país

> [!note] Escopo do modelo
> O modelo foca em expropriação direta, mas Shotts argumenta que os mesmos mecanismos se aplicam às outras formas. A violência política fica fora do escopo.

---

## 3. O modelo formal

### 3.1 Estrutura do jogo

Dois atores: [[firma]] (move primeiro) e [[governo]] (move depois).

1. A firma decide se investe pagando custo fixo $K$
2. Se investe, gera lucros pré-tributação $P_1$ (curto prazo) e $P_2$ (longo prazo)
3. O governo decide entre tributar à alíquota $t$ **ou** expropriar

### 3.2 Payoffs da firma

| Cenário | Payoff |
|---|---|
| Não investe | $\pi_0^f = 0$ |
| Investe e é tributada | $\pi_t^f = (1-t)(P_1+P_2) - K$ |
| Investe e é expropriada | $\pi_e^f = (1-t)P_1 - K$ |

### 3.3 Payoffs do governo

| Cenário | Payoff |
|---|---|
| Sem investimento | $\pi_0^g = 0$ |
| Tributa | $\pi_t^g = t(P_1+P_2)$ |
| Expropria | $\pi_e^g = tP_1 + aP_2 + B - C$ |

Onde:
- $a \leq 1$ = quão eficaz o governo acredita que será operando a fábrica
- $B$ = [[benefícios políticos da expropriação]] (patronagem, populismo, sinalização)
- $C$ = [[custos políticos da expropriação]] (retaliação externa, perda de reputação, pressão de stakeholders)

---

## 4. Resultados centrais (Proposições)

### 4.1 Proposição 1 — Incentivos para expropriação

O governo expropria quando:

$$aP_2 + B - C > tP_2$$

> [!warning] Fatores que aumentam o risco de expropriação
> - Governo acredita conseguir operar a fábrica de forma rentável (alto $a$)
> - Altos benefícios políticos $B$ e baixos custos políticos $C$
> - Baixa arrecadação tributária da firma (paradoxo: impostos baixos **aumentam** risco)
> - Lucros de longo prazo $P_2$ muito altos (quando $a > t$)

### 4.2 Proposição 2 — Decisão de investir

- **Caso 1 — Investimento sem risco político:** se o governo não expropriará, a firma investe se $(1-t)(P_1+P_2) > K$
- **Caso 2 — Investimento apesar da expropriação:** se a firma espera ser expropriada mas $(1-t)P_1 > K$, ainda investe (recupera no curto prazo)
- **Caso 3 — Investimento dissuadido:** se espera expropriação e o curto prazo não cobre $K$, não investe — **resultado ruim para ambos os lados**

> [!quote] A maldição do soberano (Vernon, 1971)
> Qualquer acordo entre empresa e governo é um *obsolescing bargain*: "quase no momento em que as assinaturas secam no documento, forças poderosas começam a trabalhar para tornar os acordos obsoletos aos olhos do governo."

---

## 5. Exemplos empíricos citados

- **[[Bolívia]] / Lítio (Salar de Uyuni):** Evo Morales declarou que "o Estado nunca perderá soberania sobre o lítio" — investimento estrangeiro dissuadido após nacionalização do gás natural em 2006
- **[[Equador]] / Petróleo:** Rafael Correa expropriou ativos de multinacionais em 2008; em 2013 tentou atrair investimento de volta sem sucesso significativo
- **[[México]] (1911-1929):** Apesar da instabilidade política, mineração e petróleo ficaram protegidos por (i) alta arrecadação tributária, (ii) baixo $a$ — governo sem expertise técnica, (iii) proteção dos EUA aumentando $C$
- **[[Singapura]] / Siemens:** Caso de investimento sem risco político — decisão puramente de mercado
- **[[Sakhalin II]] / Shell:** PSA extremamente favorável à Shell acabou sendo o gatilho para a Gazprom assumir o controle abaixo do preço de mercado
- **[[Chile]] / Kennecott (El Teniente):** Caso clássico de [[seguro de risco político]] estruturado
- **[[Canadá]] / Vale (Voisey's Bay):** Construiu refinaria local em Newfoundland para reduzir risco político mesmo em país "seguro"
- **[[Índia]] / Tata Nano (Singur):** Risco político veio de político local (Bhattacharya) fazendo [[pandering]] eleitoral
- **[[Argélia]] / Djezzy-Orascom:** Nacionalismo após confrontos de futebol com Egito levou à expropriação

---

## 6. Estratégias de mitigação

### 6.1 Compromisso do governo (limitações)

- [[Contratos internacionais]] e [[arbitragem]] — só funcionam com ameaça crível de punição substancial
- [[Reforma institucional]] — criação de [[judiciário independente]] e [[agências reguladoras autônomas]] (cf. Henisz 2000; Jensen 2006)
- [[Relational contracts]] — governo respeita propriedade porque espera fluxo futuro de investimentos (Guriev, Kolotilin & Sonin 2011)

> [!caution] Limites do compromisso
> A maioria desses fatores está fora do controle da firma individual. Reputação do governo e horizonte temporal são exógenos do ponto de vista da empresa.

### 6.2 Concessões voluntárias

- Oferecer pagar [[alíquota maior]] antes que o governo anuncie expropriação
- Robustos programas de [[Corporate Social Responsibility|CSR]] que compartilham lucro com comunidades locais
- **Timing importa:** depois do anúncio público, o político tende a manter a posição por custo de "flip-flop"

> [!warning] Faca de dois gumes
> Tax holidays e PSAs favoráveis **aumentam o risco de expropriação** justamente por concentrar todo o ganho na firma. Jensen et al (2014) classificam "contratos desbalanceados" como gatilho frequente.

### 6.3 Estratégias políticas

- Usar [[governo do país de origem]] como alavanca — mas pode aumentar $B$ se interpretado como pressão estrangeira ilegítima
- Construir [[base de apoio local]] genuína via [[CSR]] estratégico (Porter & Kramer 2011)
- **Não recomendado:** envolvimento direto em política eleitoral — antiético e frequentemente contraproducente

### 6.4 Estratégia integrada: RH, operações e value chain

Caminho ético e sustentável:
- [[Contratar localmente]] e treinar gerentes locais
- Comprar insumos de fornecedores locais
- Localizar etapas downstream do value chain no país

Caminho [[scorched earth]] (Maquiavélico, antiético, não recomendado):
- Manter $a$ baixo deliberadamente — só expatriados, processos opacos, fornecedores estrangeiros
- Reduz capacidade do governo operar a fábrica, mas aumenta $B$ por gerar ressentimento local

### 6.5 Estratégia integrada: propriedade e contratos

- [[Joint ventures]] com sócios locais politicamente influentes — risco de ficar amarrado a uma facção
- [[Seguro de risco político]] formal (OPIC, MIGA do Banco Mundial)
- Empréstimos com bancos locais como "seguro implícito"
- Estruturação de contratos com clientes europeus/japoneses (caso Kennecott)

### 6.6 Estratégia integrada: timing dos lucros

- [[Frontload]] dos lucros — concentrar retorno em $P_1$ e minimizar $K$
- [[Earnings smoothing]] — reduzir variância para evitar gatilhos de expropriação em picos (relevante em commodities cíclicas, ex.: óleo)

---

## 7. Implicações para avaliação de risco político

> [!tip] Risco é específico da firma, não apenas do país
> O risco político é função da **interação entre uma firma específica e oficiais governamentais específicos**. Uma empresa americana no Equador enfrenta risco diferente de uma chinesa. Para um determinado ativo, pode existir um "dono natural" — quem enfrenta menor risco político.

Desafios típicos para empresas inexperientes:
- [ ] Reconhecer que respeito à propriedade não é "dever do governo" — depende dos próprios atos da firma
- [ ] Entender que receita é apenas um componente da função-utilidade do governo
- [ ] Mapear motivações específicas dos decisores políticos (estabilidade social, grupos de interesse, nacionalismo, pandering)

---

## 8. Pontos de ação para uso prático

- [ ] Mapear $B$ e $C$ específicos do governo-alvo antes de qualquer investimento
- [ ] Avaliar o valor de $a$ — quão facilmente o governo poderia operar o ativo
- [ ] Estruturar deal para que o frontload de lucros cubra $K$
- [ ] Desenhar CSR estrategicamente conectado ao core business (Porter & Kramer)
- [ ] Construir coalizão de stakeholders com incentivo a pressionar contra expropriação
- [ ] Garantir envolvimento de liderança sênior na estratégia integrada (não delegar só ao Public Affairs)
- [ ] Criar awareness corporativo: cada divisão precisa entender seu papel no risco político

---

## 9. Conexões com outros temas

```dataview
LIST
FROM #risco-político OR #estratégia-integrada OR #economia-política OR #investimento-estrangeiro
WHERE file.name != this.file.name
```

Conexões sugeridas:
- [[CSR estratégico]]
- [[Análise de stakeholders]]
- [[Joint ventures internacionais]]
- [[Porter e Kramer - Creating Shared Value]]
- [[Baron - Integrated Strategy]]
- [[Teoria dos jogos aplicada a negócios]]
- [[Resource curse]]
- [[Foreign Direct Investment]]

---

## 10. Citações-chave para reuso

> [!quote] Sobre commitment
> "Como argumentado por Acemoglu (2003), há boas razões para crer que o Coase theorem não se aplica à economia política, porque um Estado soberano não pode fazer compromissos vinculantes."

> [!quote] Sobre o erro de leitura empresarial
> "Para muitos oficiais de governo, a receita é apenas um pequeno componente dos benefícios e custos totais de suas decisões. Nessas situações, é fácil para empresários concluírem que os políticos são loucos, ineptos ou desinteressados em fazer o certo. Mas, frequentemente, o que está realmente acontecendo é que os políticos são motivados por um conjunto mais complicado de fatores."

---

## 11. Nota de uso (Obsidian)

> [!note] Como usar este resumo
> - **Wikilinks** `[[ ]]` permitem navegar para notas conceituais ainda não criadas (links em vermelho/cinza) — clicar cria automaticamente a nota
> - **Bloco Dataview** acima retorna automaticamente todas as notas com tags relacionadas — atualize conforme adicionar notas ao vault
> - **Callouts** (`>[!info]`, `>[!warning]`, etc.) destacam visualmente trechos críticos no preview
> - **Checkboxes** servem para transformar pontos de ação em tarefas trackeáveis via plugins como Tasks
> - **Templates** sugeridos: crie notas-conceito para cada wikilink importante (ex.: `[[hold-up problem]]`, `[[Corporate Social Responsibility]]`) seguindo o mesmo padrão YAML+seções+Dataview

---

## 12. Avaliação de confiança

**Confiança: 9/10**

Justificativa: o material-fonte foi fornecido integralmente, então fidelidade ao conteúdo é alta. O ponto de incerteza (-1) é se a compressão privilegiou os trechos mais úteis para o seu contexto profissional — alguns exemplos secundários e nuances teóricas foram resumidos ou omitidos para manter o documento navegável. Se precisar aprofundar alguma seção específica (ex.: matemática do modelo, caso Kennecott em detalhe, ou aplicação a um setor específico), posso expandir.
