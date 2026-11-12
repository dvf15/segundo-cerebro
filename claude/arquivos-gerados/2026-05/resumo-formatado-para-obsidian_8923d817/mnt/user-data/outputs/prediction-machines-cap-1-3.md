---
tipo: resumo-livro
área: inteligência-artificial
status: ativo
criado: 2026-05-21
tags:
  - IA
  - prediction-machines
  - economia-da-IA
  - machine-learning
  - estratégia-de-negócios
  - tomada-de-decisão
aliases:
  - Prediction Machines Cap 1-3
  - Máquinas de Predição
  - PM 1-3
---

# Prediction Machines — Resumo dos Capítulos 1-3

> [!info] Sobre este resumo
> Resumo detalhado dos três primeiros capítulos do livro **Prediction Machines: The Simple Economics of Artificial Intelligence**, de [[Ajay Agrawal]], [[Joshua Gans]] e [[Avi Goldfarb]] — economistas e fundadores do [[Creative Destruction Lab]] (CDL), em Toronto.

## Tese central do livro

A nova onda de [[Inteligência Artificial]] **não nos traz inteligência**, mas sim um componente crítico dela: **[[predição]]**. A IA é, na essência, uma **tecnologia de predição** cujo custo está caindo rapidamente — e isso é tudo o que importa para entender o impacto econômico.

> [!quote] Definição operacional
> **Predição é o processo de preencher informação faltante.** Toma a informação que você tem (chamada "dados") e a usa para gerar informação que você não tem.

---

## Capítulo 1 — Introduction: Machine Intelligence

### Argumento principal

- A IA atual (ex.: [[Alexa]]) não "sabe" coisas — ela **prediz** qual resposta o usuário quer ouvir.
- Predições são **inputs para decisões**.
- A [[economia]] já tem um framework consolidado para lidar com incerteza e trade-offs em decisão — e é exatamente esse framework que os autores aplicam à IA.

### Para quem é o livro

| Público | O que o livro entrega |
|---|---|
| Líder de negócio | Impacto da IA em gestão e decisão |
| Estudante / recém-formado | Framework para pensar carreiras futuras |
| Analista financeiro / VC | Estrutura para teses de investimento |
| Policy maker | Diretrizes para entender impacto social |

### Trade-offs explícitos da IA

> [!warning] Não existe resposta única
> A "melhor estratégia de IA" depende de como você pesa cada lado:
> - **Mais [[dados]]** → menos [[privacidade]]
> - **Mais [[velocidade]]** → menos [[acurácia]]
> - **Mais [[autonomia]]** → menos [[controle]]

### Ações

- [ ] Listar 3 decisões importantes do meu trabalho que envolvem predição implícita
- [ ] Identificar quais trade-offs eu prioridade hoje (velocidade vs. acurácia, etc.)

---

## Capítulo 2 — Cheap Changes Everything

### O "AI Moment"

Todos terão o seu — o instante em que percebem que **essa tecnologia é diferente**:

- **Cientistas da computação (2012):** o time da Universidade de Toronto vence o [[ImageNet]] com [[deep learning]].
- **CEOs de tech (jan/2014):** Google compra a [[DeepMind]] por mais de US$ 600 milhões.
- **Governo chinês (2016/2017):** [[AlphaGo]] vence Lee Se-dol e depois Ke Jie — o *New York Times* chama de "momento Sputnik" da China. Resposta: estratégia nacional para dominar a IA até 2030.

### Princípio econômico fundamental

> [!important] Quando o preço cai, usamos mais
> A IA tornará algo importante **muito mais barato**. Esse "algo" é a **predição**.
> Não só usaremos mais predição nas tarefas tradicionais — ela vai emergir em **lugares inesperados**.

### Analogias históricas (a lente do economista)

#### 1. [[Luz artificial]]
- Segundo [[William Nordhaus]], em 1800 a luz custava **400x** o que custa hoje.
- Quando ficou barata, mudou comportamento: passamos de "vale a pena acender?" para "nem penso antes de apertar o interruptor".
- Tornou possível trabalhar à noite, em prédios sem luz natural, etc.

#### 2. [[Aritmética]]
- Segundo [[Tim Bresnahan]] (Stanford), computadores fazem aritmética e nada mais.
- Quando aritmética ficou barata, foi usada em coisas que ninguém associava a "aritmética": [[fotografia digital]], música (já antevisto por [[Ada Lovelace]] no século XIX), etc.

> [!quote] Lady Lovelace's Objection
> "[O computador] não tem pretensão de originar nada. Pode fazer o que sabemos ordená-lo a fazer."
> Citada por [[Alan Turing]] — e ainda válida. **Computadores não pensam**, então o pensamento não vai ficar barato. Mas a **predição**, sim.

#### 3. [[Internet]] (1995)
- IPO da [[Netscape]] (>US$ 3 bilhões sem lucro) marcou a transição da internet de curiosidade para tsunami comercial.
- Economistas viram não uma "Nova Economia", mas uma **queda no custo de distribuição, comunicação e busca**.
- Empresas que vendiam busca por outros meios (Páginas Amarelas, agentes de viagem) sofreram; empresas que viviam de ser encontradas prosperaram.

### Predição barata → o que ganha valor?

Conceito-chave de economia: **complementos sobem de valor, substitutos caem.**

| Quando [[predição]] fica barata | O que acontece |
|---|---|
| [[Dados]] | sobe de valor (complemento) |
| [[Sensores]] | sobe de valor (complemento) |
| [[Julgamento humano]] | sobe de valor (complemento) |
| [[Ação]] | sobe de valor (complemento) |
| [[Predição humana]] | cai de valor (substituto) |

> [!example] Caso Mobileye (2017)
> A [[Intel]] pagou mais de **US$ 15 bilhões** pela startup israelense [[Mobileye]] — principalmente pela tecnologia de coleta de dados que permite carros "verem" objetos e marcações. Predição barata → sensores valem mais.

### Veículos autônomos = reframing como problema de predição

Em vez de programar regras "se X, então Y" para cada cenário possível (intratável em ruas reais), engenheiros reformularam tudo numa **única pergunta preditiva**:

> *"O que um humano faria nessa situação?"*

A IA observa milhões de quilômetros dirigidos por humanos e aprende a **prever a ação humana** dado o contexto sensorial.

### Thought experiment: Amazon

- **Modelo atual:** *shopping-then-shipping* (cliente compra → Amazon envia).
- A IA da Amazon acerta hoje ~5% das recomendações (1 em 20 itens).
- Imagine girar o **"dial" da predição**: em algum ponto fica mais lucrativo **enviar antes de o cliente pedir**.
- Novo modelo: ***shipping-then-shopping***.
- Cliente devolve o que não quer; Amazon investe em logística reversa (frota de caminhões).
- Consequência: cliente não procura outros varejistas → Amazon ganha share of wallet.
- *Não é hipótese vazia:* a Amazon **patenteou "anticipatory shipping" em 2013**.

> [!important] Implicação estratégica central
> Em algum threshold, a precisão da predição **muda o modelo de negócio inteiro**, não apenas otimiza o atual. Adotar cedo demais é custoso; **adotar tarde demais pode ser fatal** (ciclo virtuoso: mais usuários → mais dados → melhor predição → mais usuários).

### Ações

- [ ] Identificar 1 decisão no meu negócio que viraria diferente se predição fosse perfeita
- [ ] Mapear quem são os **complementos** valiosos no meu setor (dados, sensores, julgamento)
- [ ] Pesquisar onde "girar o dial" da predição pode mudar o modelo, não só a execução

---

## Capítulo 3 — Prediction Machine Magic

### A definição reforçada

> [!info] PREDICTION
> Predição é o processo de preencher informação faltante.
> Pode ser sobre o **futuro** (vai chover?), o **presente** (essa transação é fraude?) ou o **passado** (este tumor é maligno?).

### Casos canônicos

#### Caso 1: [[Detecção de fraude]] em cartão
- Anos 90: melhores métodos pegavam **~80%** das fraudes.
- 2000: subiu para **90-95%**.
- Hoje (com machine learning): **98-99,9%**.
- [[Mastercard]] (Ajay Bhalla): além de reduzir fraude, resolve "a dor de ser falsamente recusado".

#### Caso 2: [[Google Translate]]
- Antes: linguista escrevia regras (substituir palavra, inverter ordem de substantivos/adjetivos, etc.).
- **Novembro de 2016:** Google trocou o motor por [[deep learning]]. De um dia para o outro, a tradução pulou de "robótica e dura" para "fluente e coerente".
- Tradução = problema preditivo: dado um conjunto de palavras em japonês, **preveja** a sequência correta em inglês.
- [[iFlytek]] na China: 500 milhões de pessoas usam serviços similares (transcrição, tradução, comunicação).

#### Caso 3: [[ImageNet Challenge]]

| Ano | Taxa de erro da máquina | Observação |
|---|---|---|
| 2010 | 28% | Primeiro ano da competição |
| 2012 | 16% | Primeiro uso de [[deep learning]] |
| 2015 | <5% | Primeira vez **abaixo do benchmark humano** |
| 2017 | erros pela metade do melhor humano | Vasta maioria das 38 equipes superou humanos |

Citação de Olga Russakovsky (Princeton): 2012 foi o ano do "breakthrough massivo em acurácia" e da prova de conceito para deep learning, que existia há décadas.

### Insight contraintuitivo: pequenas melhorias podem ser transformacionais

> [!important] A matemática dos erros
> Subir de **85% → 90%** parece maior que subir de **98% → 99,9%**.
> Mas o que importa é **quanto os erros caem**:
> - 85→90%: erros caem **1/3**
> - 98→99,9%: erros caem **20x**

| Acurácia | Variação aparente | Redução real de erros |
|---|---|---|
| 85% → 90% | +5 p.p. | erros caem 33% |
| 98% → 99,9% | +1,9 p.p. | erros caem **95%** (20x) |

Em contextos onde erros são caros (cirurgia, direção autônoma, fraude), os "últimos 1,9%" são transformacionais.

### Ações

- [ ] Listar 1 problema do meu trabalho que pode ser **reformulado como predição**
- [ ] Mapear se há decisões em que ganhar 1-2 p.p. de acurácia reduz erros de forma dramática

---

## Síntese: estrutura do livro (5 partes)

1. **[[Predição]]** — a fundação técnica/econômica
2. **[[Tomada de decisão]]** — [[julgamento]] como complemento à predição
3. **[[Ferramentas de IA]]** — implementações práticas (introduz o [[AI Canvas]])
4. **[[Estratégia]]** — quando IA deixa de executar a estratégia e *muda* a estratégia
5. **[[Sociedade]]** — empregos, desigualdade, concentração de poder, privacidade, geopolítica

> [!question] As 5 perguntas finais dos autores
> 1. Ainda haverá empregos? **Sim.**
> 2. Vai gerar mais desigualdade? **Talvez.**
> 3. Poucas empresas controlarão tudo? **Depende.**
> 4. Países farão race-to-the-bottom de privacidade/segurança? **Alguns farão.**
> 5. O mundo vai acabar? *Ainda dá tempo de tirar valor do livro.*

---

## Conceitos-chave para criar como notas próprias

- [[Predição]]
- [[Inteligência Artificial]]
- [[Machine Learning]]
- [[Deep Learning]]
- [[Tomada de decisão]]
- [[Julgamento]]
- [[Complementos vs substitutos]]
- [[AI Canvas]]
- [[Creative Destruction Lab]]
- [[Lady Lovelace's Objection]]
- [[Anticipatory shipping]]
- [[Trade-offs da IA]]

---

## Connections (Dataview)

```dataview
LIST 
FROM [[]]
WHERE contains(file.outlinks, this.file.link)
```

```dataview
TABLE tipo, status, criado
FROM "" 
WHERE contains(tags, "IA") OR contains(tags, "prediction-machines")
SORT criado DESC
```

---

## Nota de uso

- Os `[[wikilinks]]` apontam para notas que você pode criar progressivamente. Mesmo que ainda não existam, o Obsidian as mostra como **notas órfãs** — clique para criar e expandir o grafo aos poucos.
- Os **callouts** (`>[!info]`, `>[!warning]`, `>[!important]`, `>[!quote]`, `>[!example]`, `>[!question]`) ajudam a destacar tipos diferentes de conteúdo durante leitura/revisão.
- As **queries Dataview** no final exigem o plugin **Dataview** instalado. A primeira lista todas as notas que apontam para esta; a segunda lista notas relacionadas ao tema. Ajuste o `FROM` se você organiza por pastas específicas.
- Os **checkboxes** (`- [ ]`) podem ser usados com o plugin **Tasks** para virarem tarefas rastreáveis.
- Os **frontmatter fields** (`tipo`, `área`, `status`, `criado`, `tags`, `aliases`) seguem seu padrão e permitem consultas Dataview em escala.

---

## Confidence rating

**Confiança: 9/10**

- ✅ Todo o conteúdo factual (números, citações, exemplos, datas) vem **diretamente das páginas 1–30 do PDF fornecido**. Não houve invenção nem extrapolação externa.
- ✅ A estrutura segue seu padrão Obsidian estabelecido.
- ⚠️ O ponto que não chega a 10: a **escolha de quais conceitos virar `[[wikilinks]]`** é interpretativa — você pode preferir granularidade diferente (mais ou menos notas atômicas). Ajuste conforme seu vault.
- ⚠️ Algumas claims dentro do livro (ex.: "500 milhões usam iFlytek", "Intel pagou >US$ 15 bi pela Mobileye") são afirmações dos próprios autores em 2018 — verdadeiras à época, mas eu não validei contra fontes independentes neste resumo. Se quiser checagem externa, peça.
