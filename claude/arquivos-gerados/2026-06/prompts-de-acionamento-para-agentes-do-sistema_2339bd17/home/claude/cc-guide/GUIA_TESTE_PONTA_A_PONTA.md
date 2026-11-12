# Rodar de ponta a ponta no Claude Code — guia de teste (Fase 1, dados fictícios)

> Objetivo deste arquivo: depois de construir a Fase 1 (guia anterior), fazer o sistema rodar
> inteiro com dados fictícios e te dar um jeito simples de enxergar **o que funciona e o que não
> funciona**. É um guia de teste, não de construção.

---

## Antes de começar

Você já deve ter passado pelo guia de construção e ter, na pasta `shopping-os`, pelo menos:
as 7 bases fictícias, os scores, o motor_ia (modo simulado), alguns agentes, o orquestrador e o main.py.

Se ainda não tem tudo isso, **volte ao guia de construção primeiro**. Este teste assume o sistema montado.

Abra o Claude Code dentro da pasta:

```
cd shopping-os
claude
```

---

## PARTE 1 — Pedir um "teste de fumaça" (roda tudo e vê o que quebra)

"Teste de fumaça" é rodar o sistema inteiro de uma vez só para ver o que acende e o que apaga.
Cole no Claude Code:

```
Quero fazer um teste de ponta a ponta da Fase 1, só com dados fictícios.
Antes de rodar, leia o CLAUDE.md e o tasks/todo.md para lembrar o estado do projeto.

Faça o seguinte, em ordem, e NÃO corrija nada ainda — só rode e relate:
1. Carregue as 7 bases fictícias e confirme que cada uma abriu sem erro.
2. Rode os 4 scores com um exemplo e mostre os números.
3. Rode cada agente que existe, um por um, em modo simulado.
4. Rode o orquestrador num workflow completo.

No fim, me entregue um RELATÓRIO simples em tabela com três colunas:
Componente | Funcionou? (sim / não / parcial) | O que aconteceu.
Não conserte nada nesta etapa. Só quero o diagnóstico.
```

**Por que assim:** você quer primeiro o mapa do que está de pé e do que caiu — antes de sair
corrigindo. Esse relatório é o seu painel de controle.

---

## PARTE 2 — Ler o relatório (o que cada resultado significa)

Quando o relatório chegar, interprete assim:

- **Tudo "sim":** ótimo, a Fase 1 está funcional. Pule para a Parte 4 (rodar você mesmo).
- **Algum "parcial":** o componente roda mas entrega algo incompleto ou estranho. Normal num
  protótipo. Vá para a Parte 3 e conserte um por vez.
- **Algum "não":** aquele componente quebrou. Também normal. Parte 3, um por vez.

**Não tente consertar tudo de uma vez.** Um item por vez, do primeiro da lista para baixo —
porque às vezes o de baixo quebra só por causa do de cima.

---

## PARTE 3 — Consertar um item por vez

Para cada item marcado "não" ou "parcial", cole (trocando o NOME):

```
Vamos consertar só UM item: [NOME DO COMPONENTE].
Entre em plan mode. Me explique em 2 ou 3 linhas qual é a causa provável do problema,
e o que você vai mudar — antes de mudar. Depois que eu aprovar, corrija APENAS esse item,
rode de novo só ele, e me mostre que agora funciona.
Não toque em nenhum outro componente.
```

**Sua ação:** leia a causa que ele explica. Se fizer sentido, responda `pode corrigir`.
Se ele quiser mexer em coisas demais, responda `só o item X, o resto deixe como está`.

Quando terminar um item, volte ao topo da Parte 3 com o próximo. Repita até a lista estar limpa.

---

## PARTE 4 — Rodar você mesmo (sem depender do Claude Code)

Agora você roda direto, para sentir o sistema na mão. No terminal (pode ser dentro ou fora do
Claude Code):

```
python main.py
```

**O que você deve conseguir fazer:**
- escolher um workflow (ex: Vacancy-to-Contract ou Cluster Experience);
- ver os agentes sendo acionados em sequência;
- ver no fim uma Deal Conversion Table com dados fictícios.

**Enquanto roda, vá anotando** (use a ficha no fim deste arquivo):
- A saída faz sentido para o seu olhar de negócio?
- Os scores parecem coerentes (um lead claramente bom tem score alto)?
- Falta alguma informação que você esperava ver?
- Algo travou ou apareceu erro na tela?

---

## PARTE 5 — Pedir uma rodada "guiada" para entender por dentro

Para aprender o que está acontecendo em cada etapa, cole:

```
Rode o orquestrador de novo, mas em MODO EXPLICADO: antes de cada agente entrar,
imprima uma linha dizendo qual agente vai rodar, quais bases ele vai ler, e o que
ele deveria produzir. Depois mostre a saída dele. Faça isso para um workflow completo,
devagar, para eu acompanhar o raciocínio do sistema.
```

**Por que isso ajuda:** você passa a ver o sistema pensando — qual agente usa qual dado, em que
ordem, gerando o quê. É o que te dá segurança para explicar o sistema para a liderança depois.

---

## PARTE 6 — Fechar o teste com um veredito

Cole:

```
Atualize tasks/todo.md com uma seção "Teste de ponta a ponta — [data]".
Registre: o que funcionou, o que foi corrigido, e o que ainda fica pendente como
[FASE 2 — TI] (porque depende de dado real ou da TI da Allos, não de bug).
Seja honesto sobre limitações. Não marque como pronto o que não foi testado de verdade.
```

---

## Ficha de avaliação (preencha enquanto testa a Parte 4)

Imprima ou copie isto e vá preenchendo:

```
COMPONENTE.................. FUNCIONOU?...... OBSERVAÇÃO
7 bases carregam........... [ ] sim [ ] não  ____________________
Scores calculam............ [ ] sim [ ] não  ____________________
Agente Cluster............. [ ] sim [ ] não  ____________________
Agente Hunter.............. [ ] sim [ ] não  ____________________
Agente Deal Conversion..... [ ] sim [ ] não  ____________________
Orquestrador ponta a ponta. [ ] sim [ ] não  ____________________
Saída faz sentido p/ negócio[ ] sim [ ] não  ____________________

O QUE MAIS ME AGRADOU: ____________________________________
O QUE PARECEU FRACO/CONFUSO: ______________________________
O QUE FALTOU: _____________________________________________
```

---

## Limites honestos deste teste

- **Modo simulado:** nesta fase os agentes devolvem respostas de exemplo, não análises geradas por
  IA de verdade. Então você testa se o **encanamento** funciona (dados → agente → orquestrador →
  saída), não a qualidade do raciocínio da IA. Isso é proposital e suficiente para a Fase 1.
- **Dados fictícios:** nada do que aparecer reflete a realidade dos shoppings. Serve para validar a
  mecânica, não para tomar decisão comercial.
- **"Funciona na Fase 1" não é "funciona em produção":** a produção depende de dado real, hospedagem
  e integrações que só a TI da Allos define. Este teste valida a base, não o sistema final.

---

## Depois deste teste

Com a ficha preenchida você terá, pela primeira vez, uma opinião fundamentada sobre o próprio
sistema: o que está sólido, o que é frágil, o que falta. Isso é exatamente o que te deixa forte
para (1) apresentar à liderança e (2) conversar com a TI sobre a Fase 2. Quando voltar dessas
conversas, a gente desenha o próximo passo com base no que você de fato viu funcionar.
