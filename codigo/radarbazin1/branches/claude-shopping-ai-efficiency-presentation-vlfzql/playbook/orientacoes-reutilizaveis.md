# Orientações reutilizáveis — Treinamento de IA (playbook)

> Padrões extraídos do workshop "Shopping Inteligente" (público: coordenadores e
> analistas) para reaproveitar em outros treinamentos — por exemplo, a **versão
> para gerentes no Claude Cowork**. Três blocos: **(1) Estrutura de agentes**,
> **(2) Lógica C.R.I.A.R.** e **(3) Slide de conclusão**. No fim, **adaptação
> para gerentes** e um **bloco pronto para colar** como instrução do projeto.

---

## Princípios gerais do treinamento (o "jeito" que funcionou)

1. **Dois atos:** primeiro a **Visão** (curta, conceitual — a direção/estratégia),
   depois a **Prática** (a maior parte — o que a pessoa faz amanhã). ~⅓ visão, ~⅔ prática.
2. **Ponte explícita** entre os atos: *"o sistema completo é a direção; enquanto
   ele amadurece, VOCÊ já age assim hoje, com IA."* Reduz medo e aumenta adesão.
3. **Tudo aterrado em exemplos reais** do dia a dia do público + **prompts prontos
   para copiar**. Nada de teoria solta.
4. **Orçamento de tempo explícito** na agenda (ex.: vídeo X + apresentação Y +
   exercício Z = total). Cada slide com marcação de minutos.
5. **Notas do apresentador** em todos os slides (fala + tempo).
6. **Governança desde o início:** LGPD, sigilo, "confira sempre", decisão humana.
7. **Identidade visual da marca** (paleta oficial), termos em português claro
   (traduzir anglicismos: ROI → Retorno sobre Investimentos, KPI → indicador etc.).
8. **Fechamento positivo** com o fator humano (ver bloco 3).

---

## Bloco 1 — Estrutura de agentes (o padrão de arquitetura)

Padrão para apresentar um **ecossistema de IA** de forma que qualquer área entenda
onde se encaixa.

### 1.1 Arquitetura em camadas
- **Orquestrador** (centro): faz o "match"/decisão central, cruza necessidades e
  oportunidades; funciona como uma **consultoria** que recomenda o melhor caminho.
- **Camada de Descoberta** (entradas): agentes que trazem insumos/sinais.
- **Camada de Execução** (entrega): agentes que realizam e operam.
- **Cérebro de posicionamento/tese** + **plataforma/dados**: o que orienta e
  alimenta o sistema.
- **Ciclo fechado:** a execução devolve dados que realimentam a descoberta.

### 1.2 Template de UM agente (use sempre o mesmo "card")
Descreva cada agente com estes campos, em 1–3 frases cada:
- **Nome + papel** (1 linha que cabe num chip)
- **Missão** (1 frase: o que ele maximiza)
- **Entradas** (de onde vêm os dados)
- **Processo** (2–4 passos)
- **Saídas** (entregáveis concretos)
- **Indicadores** (como se mede)
- **Salvaguardas** (limites/risco/LGPD)

### 1.3 Princípios de decisão (válidos para qualquer ecossistema)
1. Valor de longo prazo > ganho de curto prazo
2. **Explicabilidade** (toda recomendação carrega tese e premissas)
3. **Decisão sempre humana** (human-in-the-loop)
4. Otimização sistêmica (impacto no todo, não só na parte)
5. Aprendizado contínuo (cada ciclo realimenta o sistema)

### 1.4 Como virar prática (o "pulo do gato")
Para **cada agente**, crie um slide de caso com 3 elementos:
- **Onde usar** — no espírito daquele agente (5 bullets do dia a dia)
- **Prompt pronto para copiar** — um exemplo real, parametrizável (`<cole aqui>`)
- **Ganho** — uma frase com o resultado (tempo economizado / qualidade)

> Reuso: liste os "agentes" do SEU domínio (mesmo que ainda sejam pessoas/
> processos), descreva cada um com o template 1.2, mostre as 2 camadas, e mapeie
> cada agente a tarefas práticas com IA para o público (1.4).

---

## Bloco 2 — Lógica C.R.I.A.R. (método para bons pedidos à IA)

Um pedido bem feito = um bom briefing a um assistente. Cinco ingredientes:

| Letra | Elemento | O que colocar |
|---|---|---|
| **C** | Contexto | quem é você e a situação |
| **R** | Resultado | o que quer e em que formato |
| **I** | Informação | os dados/base que a IA deve usar |
| **A** | Audiência | para quem é (define o tom) |
| **R** | Restrições | limites, tamanho, o que evitar |

**Como ensinar:**
- Comece com **C + R + I** (o mínimo) e refine pedindo ajustes.
- Sempre **conferir** o resultado (a IA pode errar dado/fato).
- Mostre um **exemplo ao vivo** transformando um pedido ruim em bom.
- Feche com um **exercício**: cada um escreve 1 pedido de uma tarefa real.

**Mensagem-chave:** a diferença entre uma resposta ruim e ótima está quase sempre
no **pedido**, não na ferramenta.

---

## Bloco 3 — Slide de conclusão ("Inteligência Aumentada")

Fechamento positivo que valoriza o **fator humano** e posiciona a IA como
**alavanca** (não substituto), ancorado no **propósito da empresa**.

### 3.1 Estrutura
- **Eyebrow:** "PARA FECHAR · INTELIGÊNCIA AUMENTADA"
- **Título:** *"A IA não substitui [o fator humano / o nosso propósito]. Ela o **amplifica**."*
- **Subtítulo = propósito oficial da empresa** (cite literalmente)
- **3 pontos em 1ª pessoa do plural (nós):**
  1. *Nós lemos o contexto* — uma imagem concreta e sensorial do negócio
  2. *A IA cuida do que se repete* — devolve "tempo para gente"
  3. *A decisão é nossa* — a IA propõe; quem decide/conecta/encanta somos nós
- **Frase final (mic-drop):** ecoa os **verbos do propósito/tagline** da empresa,
  em 1ª pessoa do plural.

### 3.2 Regras para não cair no clichê
- **Evite:** "humano no centro", "o futuro é agora", "tecnologia a serviço das
  pessoas", "ve[i]o para somar".
- **Use:** imagem **concreta e específica** do negócio (algo que se vive) +
  **verbos do propósito real** da empresa + **1ª pessoa do plural**.
- Confirme o **propósito/tagline oficiais** da marca e costure-os na frase final.

### 3.3 Template para preencher
```
Título:   A IA não substitui [FATOR HUMANO]. Ela o amplifica.
Subtítulo:[PROPÓSITO OFICIAL DA EMPRESA — literal]
Ponto 1:  Nós lemos o contexto — [IMAGEM CONCRETA E SENSORIAL DO NEGÓCIO].
          Isso se vive, não se baixa de um sistema.
Ponto 2:  A IA cuida do que se repete — resume, organiza e rascunha, e nos
          devolve o recurso mais escasso: tempo para gente.
Ponto 3:  A decisão é nossa — a IA propõe e amplia o alcance; quem [VERBOS DO
          PROPÓSITO] somos nós.
Fecho:    A IA amplia o nosso alcance. [O FATOR HUMANO] é o que transforma.
          Inteligência Aumentada é como [VERBO1, VERBO2 e VERBO3 do propósito]
          — todos os dias.
```

---

## Adaptação para GERENTES (mudança de altitude vs. coordenadores/analistas)

O conteúdo é o mesmo; muda o **ângulo**:

| Tema | Coordenador/Analista | **Gerente** |
|---|---|---|
| Foco | executar tarefas com IA | **decidir, habilitar o time e governar** o uso |
| C.R.I.A.R. — exemplos | e-mail, relatório, planilha | **business case, comunicação executiva, análise de desempenho do time, priorização** |
| Agentes | "aja como o agente" | **"orquestre os agentes": onde delegar à IA, onde exigir humano** |
| Indicadores | tempo economizado na tarefa | **produtividade do time, qualidade da decisão, adoção** |
| Governança | regras de ouro pessoais | **política de uso da IA na área, exemplo, gestão de risco/LGPD** |
| Conclusão | "tempo para gente" | **liderança aumentada: a IA libera o gestor para liderar pessoas** |

**Slides extras úteis para gerentes:**
- *Onde delegar à IA × onde exigir julgamento humano* (matriz simples)
- *Como habilitar o time* (definir política, dar exemplo, montar biblioteca de
  prompts da área, medir adoção em 30-60-90)
- *Gestão de risco* (LGPD, dados sensíveis, decisão humana, viés)
- Conclusão na chave **"Liderança/Inteligência Aumentada"** (bloco 3 adaptado).

---

## Bloco pronto para COLAR no Claude Cowork (instrução do projeto)

> Cole isto como contexto/instrução do seu projeto de gerentes para o assistente
> aplicar os padrões acima.

```
Contexto: estou montando um treinamento de IA para GERENTES. Quero reaproveitar
3 padrões de um workshop anterior:

1) ESTRUTURA DE AGENTES — apresente qualquer ecossistema de IA em 2 camadas
   (Descoberta + Execução) ao redor de um Orquestrador, descreva cada agente com
   o card padrão (nome+papel, missão, entradas, processo, saídas, indicadores,
   salvaguardas) e, para cada agente, crie um slide de caso prático com
   "Onde usar" + "Prompt pronto para copiar" + "Ganho". Inclua os princípios de
   decisão (valor de longo prazo, explicabilidade, decisão humana, otimização
   sistêmica, aprendizado contínuo).

2) MÉTODO C.R.I.A.R. — ensine bons pedidos à IA com Contexto, Resultado,
   Informação, Audiência, Restrições; comece por C+R+I e sempre conferir o
   resultado; inclua exemplo ao vivo e exercício.

3) SLIDE DE CONCLUSÃO "Inteligência Aumentada" — fechamento positivo, fator
   humano + IA como alavanca, ancorado no PROPÓSITO OFICIAL da empresa, em 1ª
   pessoa do plural, sem clichês (use imagem concreta do negócio + verbos do
   propósito real). Siga o template do playbook.

Ajuste a ALTITUDE para gerentes: foco em decidir, habilitar o time e governar o
uso da IA; exemplos de business case, comunicação executiva, análise de
desempenho do time e priorização; indicadores de produtividade/adoção; e um
slide "onde delegar à IA × onde exigir julgamento humano".

Estrutura em 2 atos (Visão curta + Prática longa) com ponte explícita, orçamento
de tempo na agenda, notas do apresentador, paleta da marca e termos em português
claro. Antes de gerar, me apresente um esboço/plano para aprovação.
```

---

### Para eu deixar isso ainda melhor, me diga:
- **Qual o tema/domínio** do treinamento de gerentes? (assim eu instancio os
  "agentes" e os exemplos do C.R.I.A.R. para o contexto certo)
- Quer que eu gere a **versão da conclusão para gerentes** ("Liderança Aumentada")
  já preenchida?
- Quer este playbook também como **arquivo de instruções/skill** (formato que o
  Cowork lê automaticamente)?
