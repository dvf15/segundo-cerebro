---
title: "Framework personalizável para calibração de dados fitness"
date: 2026-05-29
updated: 2026-05-29
source: "claude-chat"
source_id: "3978d1c7-5e97-4e15-98be-5e328f3f24b2"
url: "https://claude.ai/chat/3978d1c7-5e97-4e15-98be-5e328f3f24b2"
project: null
messages: 4
tags: ["claude", "conversa"]
---
# Framework personalizável para calibração de dados fitness

> **Resumo:** **Conversation Overview** The person is working on a "Fitness" project in Claude and asked Claude to transform an existing personalized fitness coaching system into a reusable, calibratable framework that other people could adapt to their own data and preferences. The project is built around principles from Peter Attia (Outlive), Andy Galpin/Andrew Huberman, and Stuart McGill, covering training periodization, strength, cardio, mobility, nutrition, sleep, and recovery. In the first phase, Claude built an interactive React artifact (fitness-calibration.jsx) serving as a calibration calculator where users input their profile (age, weight, height, sex, body fat percentage, experience level), primary goal (BJJ/hypertrophy/longevity/recomposition), nutritional phase (cutting/maintenance/bulking), weekly availability across BJJ, strength, and cardio sessions, and injury limitations. The system outputs a personalized weekly training template across scenarios A/B/C based on BJJ frequency, calibrated calorie and macro targets using Morton/Helms/Phillips literature references, prehab protocols adjusted for reported injuries per McGill's framework, automated risk flags for dangerous combinations (RED-S risk, sarcopenia, interference effect, overtraining), and a dynamically generated system prompt the user can copy and paste into any LLM as a coaching assistant. A companion specification document (sistema-calibracao-spec.md) was also produced explaining the calculation logic, scientific sources, and instructions for porting the system to other platforms (Notion, ChatGPT Custom GPT, spreadsheets). In the second phase, the person requested two specific adjustments: making BJJ optional rather than assumed, and adding daily meal plan suggestions scaled to the user's inputs. Claude rewrote the artifact to include a toggle for BJJ practice that, when disabled, switches the system to a new Scenario S (force + cardio + longevity focus), adapts prehab blocks, removes BJJ-specific flags, and changes the system prompt framing accordingly. New risk flags were added for the BJJ-off state. A meal planning module was also added with tabs for training days versus light/rest days, showing four concrete meals per day with ingredient quantities dynamically scaled from a reference template using the user's caloric target and weight, with phase-specific carbohydrate adjustments (−15% cutting, +10% bulking), approximate macro breakdowns per meal, and a substitution guide. Both the JSX artifact and the specification document were updated and validated before delivery.

**Mensagens:** 4 · **Criada:** 2026-05-29 · **Atualizada:** 2026-05-29

---

## 👤 Usuário · 2026-05-29 16:43

Com base em tudo o que montamos no projeto “Fitness” crie um sistema para que outras pessoas possam ajustar calibrando seus proprios dados e preferências

## 🤖 Claude · 2026-05-29 16:51

  O usuário quer que eu crie um sistema configurável baseado no projeto "Fitness" para que outras pessoas possam personalizar seus próprios dados e preferências. Preciso começar explorando o conteúdo do projeto usando a busca de conhecimento, especialmente os arquivos sobre periodização de treino BJJ e força.

Vejo que o projeto contém vários módulos: treino com periodização, hipertrofia, cardio, mobilidade, nutrição, sono e recuperação, além de um sistema de análise de refeições por foto. Vou fazer buscas para entender como esses componentes estão estruturados e como posso transformá-los em um sistema configurável.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Estou vendo a estrutura completa do projeto: seis arquivos principais cobrindo periodização de treino, força, cardio, mobilidade, nutrição e sono, além de recursos adicionais como análise de refeições por foto, dados de composição corporal do InBody e laudos médicos.

O usuário quer transformar isso em um sistema que outras pessoas possam usar para calibrar suas próprias recomendações com seus dados e preferências — basicamente um framework de personalização onde alguém preenche seu perfil (idade, peso, objetivos, restrições, disponibilidade) e recebe recomendações personalizadas baseadas nos mesmos princípios. Estou considerando entregar isso como um artifact React interativo que coleta dados do usuário, gera recomendações calibradas, mostra outputs personalizados como semana de treino e macros, e permite ajustes em tempo real — uma abordagem prática considerando que o usuário está no mobile.
```
This block is not supported on your current device yet.
```

 Tenho todo o contexto do projeto agora — é um sistema de coaching personalizado para Daniel que precisa ser transformado em uma ferramenta genérica e configurável para outros usuários. Vou criar um componente React que funcione como um sistema de coaching adaptável, onde cada pessoa possa inserir seus próprios dados e preferências.

Building the calibration interface...Antes de criar, preciso entender bem o que vai entregar. Você quer transformar o sistema personalizado (que hoje tem seus dados e objetivos hardcoded) num **framework reutilizável** onde qualquer pessoa preenche seus dados e recebe uma versão calibrada dos mesmos princípios.

Vou entregar 2 coisas:

1. **Um artifact React interativo** — calculadora/sistema que coleta inputs (idade, peso, objetivos, disponibilidade, lesões) e gera plano semanal + macros + protocolos personalizados, mantendo os princípios do projeto (Attia, Galpin, McGill) intactos.
2. **Um documento de especificação** — o "manual" do sistema, para quem quiser entender a lógica por trás ou portar pra outro contexto (Notion, planilha, outro coach).

Vou ler os skills relevantes antes de construir.
```
This block is not supported on your current device yet.
```

 I'm planning to build a functional React calibration tool that prioritizes usability—users need to input data and get meaningful results. The design should be technically sober and straightforward, avoiding unnecessary flourishes, with a visual approach inspired by sports technical manuals.

I'm mapping out the form inputs (age, weight, height, sex, body fat percentage, primary goal, training frequency, available time for strength and cardio, experience level, injury considerations, age-related protein adjustments, and current phase) and the outputs the tool will generate based on the project's principles—weekly training templates, estimated calories, macro breakdowns, strength blocks, and conditioning protocols.

Now I'm thinking through the design approach: a mobile-first interface with clean typography and prominent numbers, structured as a form on top with real-time results below. I want a serious, technical aesthetic without unnecessary decoration—a sober palette of black, white, gray, and maybe a warm accent like dark terracotta or military green, like a technical manual. I'll build this as a single React component.

I need to keep everything in memory with no external dependencies or local storage. Now I'm mapping out the calculation logic based on training frequency: if someone does BJJ 4-5 times weekly, that's Scenario A with lower-volume strength work, one VO2max session, and optional Zone 2; if 2-3 times, that's Scenario B with more moderate strength, stronger Zone 2 emphasis, and VO2max or BJJ on Saturday.

For the third scenario with reduced frequency, I'm setting up a structure with twice-weekly BJJ, twice-weekly strength, one Zone 2 session, and daily mobility work. Then I'm establishing the macronutrient formulas: protein scales from 1.6-2.2g per kilogram for active individuals up to 2.0-2.4g when cutting, with an additional floor for those over 50; calories use a baseline of 32 times bodyweight for maintenance, adjusted down 300-500 for cuts or up 200-400 for surplus, plus extra on heavy BJJ days; carbs range from 3-6g per kilogram on hard training days down to 2-4g on lighter days; fat sits around 0.8-1.2g per kilogram. I'm also starting to build in automatic warning signals for when things are off.

Now I'm thinking through the interface design—since this is mobile, I need to be thoughtful about how information is presented. I'm leaning toward a straightforward wizard with one main screen, clear sections that can collapse, and vertical scrolling. At the bottom there's a button to generate the plan, which displays the output below it. Real-time updates would be nice but might overwhelm the user.

Actually, reactive updates make more sense—cleaner and more intuitive. For the visual style, I'm going for something like a military athlete's technical manual: cream background with deep black text, serif fonts for headings to give it that editorial feel, sans-serif for data, and minimal decorative elements like lines and separators to evoke a field notebook. The color palette uses a light beige background, deep black for primary text, brick red for alerts and highlights, and gray for secondary information. For typography, I'm considering serif display fonts like Crimson Pro or EB Garamond for headers, with a clean sans-serif for body text.

I'm refining the font choices now—avoiding generic options and going with Fraunces or Newsreader for the serif display, IBM Plex Sans for body text, and IBM Plex Mono for data. This gives it that serious athlete vibe with editorial restraint. Now I need to work through the calculation logic...

Writing calculation function... Writing nutrition calculations... Thinking about what the user actually needs—they might want a framework document, an interactive tool, or prompt templates for others to use with Claude. I'll deliver both an interactive calculator and a guide on how to adapt the system while keeping the core principles intact, including a system prompt template for using Claude as a coaching assistant.

The key insight is that calibration is central—users input their own data and preferences, and the system adapts accordingly. Since this is fundamentally a Claude-based system with a system prompt and skills, what really needs to be customizable are the system prompt itself (reflecting the person's profile and goals) and the underlying parameters.

So the best approach is to build an artifact that generates a personalized system prompt the user can copy and paste directly into Claude or use in any other platform. The artifact would let them fill in their information, then display both the analysis and recommendations alongside a ready-to-use system prompt calibrated specifically for them. Let me start building this out.

I'm structuring the form with sections for personal info, goals, availability, and restrictions, then organizing the output to show a calibrated summary, suggested weekly template, nutrition macros, specific protocols, personalized warning signs, and a copyable system prompt. I'll make it fully reactive with state management and use a mobile-first layout that expands to a two-column grid on desktop, with Tailwind for styling.

Building the component structure... Vou injetar as fontes do Google Fonts diretamente via uma tag style no componente, o que funciona bem em artifacts. Agora estou pensando no design geral: vibe de caderno de campo de atleta com influências de manual militar e wabi-sabi, usando fundo creme e texto preto profundo, sem elementos brilhantes.

Vou usar terracota ou vermelho-tijolo como cor de destaque, combinando Fraunces para títulos expressivos, IBM Plex Sans para o corpo e IBM Plex Mono para dados numéricos. Os separadores serão sutis com hairlines e tracejados, os blocos de dados terão bordas finas como fichas, e vou adicionar numeração de seção discreta tipo "01 / 04".

Building the React component... I'm wrapping up the calculation logic and returning the computed values, then building out the JSX structure for the component. I need to set up the file in the outputs directory as a React artifact and plan the layout carefully before writing it all out.

Building the component structure with a two-column grid on desktop that collapses to single column on mobile, organizing the form into sections for profile data, training goals, availability, and injury limitations, then displaying the diagnostic summary and recommendations in the output area.

Writing component markup... Vou estruturar o arquivo em partes primeiro, já que vai ser longo, e depois copiar a versão final para outputs.Bom, antes de codar, deixa eu pensar na arquitetura para garantir que entrego algo útil.

**Decisão de design:** o sistema atual é um "system prompt + skills" para Claude. O que precisa ser calibrável para outras pessoas são (1) os parâmetros pessoais (idade, peso, fase, lesões), (2) os outputs derivados (macros, semana, protocolos) e (3) o próprio system prompt para a pessoa usar com qualquer LLM como coach.

Então o artifact vai funcionar como **gerador**: pessoa entra com os dados, recebe (a) o plano calibrado e (b) um system prompt copiável pronto para colar em qualquer Claude/ChatGPT.

Vou montar.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Let me quickly review the JSX syntax and check for any obvious issues—I'll scan through the key parts like the hooks, inline styles, and export statement to make sure everything looks correct.

Looking at the implementation, the responsive grid should work fine on mobile, and while there are some Tailwind classes mixed with inline styles, that's not a problem since the artifact environment supports Tailwind core. Now I'll copy this over to the outputs and write up the specification document.Agora vou criar o documento complementar (especificação do sistema):
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Copying the validated JSX to the outputs and present_files.JSX validado. Copiando para outputs.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Pronto. Entreguei dois artefatos:

**1. `fitness-calibration.jsx`** — calculadora interativa. Pessoa preenche perfil, objetivo, disponibilidade e lesões; o sistema gera (a) cenário semanal A/B/C, (b) calorias e macros calibrados, (c) semana sugerida, (d) prehab personalizado por lesão, (e) flags automáticos de risco (RED-S, sarcopenia, interferência, etc.) e (f) um *system prompt* copiável para colar em qualquer LLM como coach AI.

**2. `sistema-calibracao-spec.md`** — manual do framework. Explica a lógica de cada cálculo, as fontes científicas, o que o sistema NÃO faz, e como portar para Notion, ChatGPT Custom GPT, planilha ou papel.

**O que vale destacar nas decisões de design:**

- **A pessoa não escolhe princípios, escolhe dose.** "BJJ é prioridade", "proteína 1.6–2.2 g/kg", "Zone 2 + VO2max", "McGill Big 3 diário" são fixos. O que muda é o quanto e em que ordem.
- **O system prompt é o ponto-chave de portabilidade.** Em vez de tentar replicar o projeto inteiro (6 arquivos + skills + memory) para cada pessoa, o gerador empacota perfil + princípios + alvos num único texto que funciona em qualquer LLM.
- **Flags personalizados detectam combinações arriscadas** (45+ + cutting + BJJ 4x + força → RED-S; 50+ sem força → sarcopenia; bulk + longevidade → conflito de metas). Isso é o que diferencia de uma calculadora burra.

**Limitações que mantive transparentes no próprio sistema:**

- TDEE por `peso × fator` erra ±10–15%. É bússola, não GPS.
- O sistema não substitui médico do esporte para exames, sintomas ou lesão atual.
- Templates semanais são genéricos — quem trabalha por turnos ou viaja muito vai adaptar.

**Para testar:** abra o `.jsx` no claude.ai (ele renderiza como artifact React). Brinque com os inputs e veja como cenário, macros, flags e system prompt mudam em tempo real.

**Confiança: 8/10.** Os cálculos refletem fielmente os princípios dos arquivos do projeto. Pontos onde fui mais conservador (e pode valer revisar com você): (1) o "fator TDEE" (30/32/34) é minha simplificação — Mifflin-St Jeor + fator de atividade seria mais preciso e dependeria do `bodyFat`; (2) os limiares dos flags são heurísticos calibrados pelos princípios, não validados em estudo. Se quiser, posso refinar qualquer um desses depois.

- 📎 IMG_0715.jpeg
- 📎 IMG_0714.jpeg
- 📎 20260527_121152984_iOS.pdf
- 📎 20260527_121152984_iOS.pdf
- 📎 20260527_121152984_iOS.pdf
- 📎 IMG_0712.jpeg

## 👤 Usuário · 2026-05-29 16:59

Ajuste deixando a opcionalidade de fazer ou nao bjj e traga sugestões de cardapios basicos para o dia calculados com base nos inputs

## 🤖 Claude · 2026-05-29 17:06

  O usuário quer dois ajustes principais: primeiro, tornar BJJ opcional no sistema em vez de assumir que é o padrão para todos os cenários, e segundo, adicionar sugestões de cardápios diários baseadas nos inputs de macros do usuário. Vou começar adicionando um toggle para permitir que usuários indiquem se praticam BJJ ou não.

Se a pessoa não faz BJJ, o sistema muda completamente para focar em força e longevidade, com cenários repensados para força + cardio em vez de BJJ. A linguagem e o system prompt precisam se adaptar dinamicamente, e qualquer flag relacionada a BJJ só aparece se o usuário confirmar que pratica. Para os cardápios, vou calcular as calorias e macros alvo já existentes, distribuir em 3-5 refeições, e sugerir combinações simples de alimentos considerando dias de treino versus dias leves, com proteína distribuída entre 0,3-0,4g/kg por refeição. Vou estruturar em quatro refeições principais (café da manhã, almoço, lanche/pré-treino, jantar) e oferecer 2-3 opções por refeição para variedade, com um toggle para ajustar os carboidratos conforme o tipo de dia.

Agora estou definindo as quantidades específicas de proteína, carboidratos e gordura por refeição, usando referências práticas do projeto como a palma da mão para proteína e o punho para carboidratos cozidos, e compilando exemplos de alimentos com seus valores nutricionais. Agora vou montar cardápios que atendam aos alvos nutricionais. Para um exemplo de 80kg com 3300 kcal de manutenção e 175g de proteína, preciso distribuir isso em 4 refeições de cerca de 825 kcal e 44g de proteína cada. Testei uma opção com aveia, claras, banana e pasta de amendoim, mas ficou pequena, então vou considerar 3-4 refeições mais um pré-treino. Minha abordagem será simplificar dividindo as calorias e proteína totais por 4, depois apresentar 2-3 opções genéricas para cada refeição com os macros aproximados.

Mas gerar cardápios dinâmicos baseados nos macros específicos do usuário fica muito complexo. Melhor é mostrar o alvo por refeição e listar opções modulares que a pessoa monta combinando base proteica, base de carboidrato, acompanhamento e gordura. Ou ainda melhor: gerar 2 dias completos de exemplo (um de treino, outro leve) com refeições prontas que somam exatamente os alvos, com as quantidades escaladas pelo peso do usuário e ajustadas para cutting, manutenção ou bulking.

Vou estruturar isso assim: cada refeição mostra os alimentos com gramatura calculada e macros aproximados. O algoritmo calcula um fator de escala baseado no peso e nas calorias do usuário, depois aplica isso a uma estrutura base de 4 refeições. Para o dia de treino, priorizo mais carboidrato com café de aveia, frutas, ovos e pasta de amendoim; almoço com proteína, arroz, feijão e salada; pré/pós-treino com shake e frutas; e jantar com proteína, batata doce e vegetais. O dia leve segue um padrão similar mas com menos carboidrato.

Para escalar, vou usar um método pragmático: recebo o target de calorias ou proteína para cada refeição e retorno as comidas com gramaturas ajustadas, em vez de tentar multiplicar um template fixo por um ratio genérico.

Defining meal builder function... Estou finalizando a segunda opção de refeição com peru, pão integral, maçã e castanhas, mas preciso calcular as gramas com base no peso da pessoa usando um fator de escala simples (peso dividido por 80kg como referência). Vou simplificar apresentando opções fundamentais com uma fórmula clara para que a pessoa escale conforme seu peso, depois dou exemplos práticos.

Agora estou compilando as conversões de proteína e carboidratos para cada alimento — frango, carne magra, ovos, peixe, whey e iogurte grego para proteína, e aveia para carboidratos — para poder calcular as gramas exatas em cada refeição.

Vou criar um cardápio com três opções para cada refeição (café, almoço, lanche, jantar) e usar um peso base de 80kg como referência, escalando as porções proporcionalmente conforme o peso do usuário varia. Vou criar uma função dinâmica que calcula as gramaturas baseado no peso do usuário, escalando proporcionalmente a partir do modelo de 80kg. Agora preciso adaptar toda a estrutura do app — adicionar o campo de prática de BJJ no estado, ajustar a lógica de cenários, templates semanais e o system prompt para considerar usuários que não praticam, além de integrar um bloco de cardápio com dois modelos diferentes.

Defining the meal scaling function... Vou escalar todas as gramaturas usando a ingestão calórica do usuário como referência, dividindo pela média entre os limites baixo e alto e comparando com uma base de 3000 kcal. Nos dias leves, reduzo os carbos em cerca de 30% para manter a progressão adequada conforme a fase de treino.

Agora preciso pensar na interface: um toggle para ativar/desativar BJJ no topo que controla todo o resto, um slider que só aparece se BJJ estiver ativo, e uma nova seção no resultado mostrando cardápios sugeridos com abas separando dias de treino e dias leves. Vou começar a editar o arquivo e implementar os cardápios com opções variadas para cada refeição.

Adicionando opções de cardápio... Renaming "training day" to "hard training day" and "light/rest day" to keep things more generic since the user might not do BJJ. I'll structure this with a function that builds meals based on weight, calorie range, training phase, and whether it's a hard or light day — keeping it simple with one solid option per meal rather than multiple choices, giving us eight total meal plans across the two day types.

For scaling, I'm using an 80kg baseline at maintenance (3200 kcal, 160g protein) and applying a scale factor, but I'll add min/max limits to avoid absurd portions at extreme weights. Writing rounding functions...

Now I'm going to modify the actual file with surgical edits. I'll start by adding a `practicesBJJ` field to the initial state, adding a checkbox in the form, and renaming or adapting the `bjjDays` variable so it only applies when BJJ is selected. Then I'll update the calculation logic to handle scenarios where BJJ isn't practiced.

I need to adapt the weekly template builder, prehab settings, flags, and system prompt accordingly. I also want to create a meal builder function and add a UI component for meal plans with tabs for workouts and nutrition.

Actually, it'll be cleaner to recreate the file from scratch rather than doing multiple string replacements. Defining the meal builder function... Continuing with the meal plan structure... Finishing the dinner section with fish, sweet potato, vegetables and olive oil, then moving into the light day meals starting with breakfast options. Defining the remaining meals... I need to apply phase-specific adjustments—reducing carbs and calories by about 15% for cutting phases and increasing by 10% for bulking—but I'll note that this is a baseline model requiring personal adaptation. Rather than doing multiple string replacements, I think it's cleaner to recreate the entire file from scratch, even though it's 28kb, so I'll delete and rewrite it completely.Vou ajustar. Duas mudanças significativas:

1. **BJJ opcional** — adicionar toggle no topo. Se não pratica, cenários, prehab, flags e prompt mudam para foco força + cardio + longevidade puro.
2. **Cardápio sugerido** — 2 dias-exemplo (treino duro / leve) com gramaturas escaladas pelo peso e ajustadas por fase nutricional. Mostra 4 refeições com items concretos e macros aproximados.

Vou reescrever o arquivo.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 I should also update the specification document to reflect these two new features.Vou atualizar o doc de especificação para refletir BJJ opcional e o módulo de cardápio.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Pronto. Mudanças aplicadas:

**1. BJJ opcional**

- Toggle no topo da seção "Modalidades" — quando desligado, o slider de BJJ some.
- Novo **Cenário S** (sem BJJ): semana focada em força 3x + Zone 2 frequente + 1x VO2max, sem competição entre tatame e sala.
- Prehab adapta: quem não pratica BJJ ganha bloco "Manutenção geral" (dead hang + carry + mobilidade) em vez de "BJJ sempre".
- System prompt muda o framing: "coach de força, condicionamento e longevidade" e remove a linha "BJJ é prioridade".
- Flag nova: "Sem BJJ + força <2 + cardio <1 = volume insuficiente p/ qualquer adaptação".
- Flag nova: "Objetivo BJJ mas BJJ desligado — conflito de metas".

**2. Cardápio do dia (novo bloco)**

- Tabs **Dia treino** / **Dia leve / descanso** para comparar.
- 4 refeições por dia, com gramaturas calculadas em tempo real a partir de:
  - **Peso** do usuário (multiplicador de escala),
  - **Meta calórica** (cutting puxa pra baixo, bulking pra cima),
  - **Fase nutricional** (carbo ajustado −15% em cutting, +10% em bulking).
- Cada refeição mostra os items concretos (frango 180g, arroz 150g, etc.) e os **macros aproximados** estimados.
- Lista de substituições válidas no rodapé (frango ↔ peixe ↔ ovos; arroz ↔ batata doce; etc.).

**Como o cardápio escala (resumo da lógica):**

Template base é para 80 kg (≈3200 kcal dia treino / 2600 kcal dia leve). Para outros perfis, `scale = meta_calórica_usuário / referência`. Aplica em todas as gramaturas e arredonda para múltiplos de 5g. Unidades (ovos, frutas) escalam em inteiros.

**Limitações que mantive transparentes:**

- Macros estimados têm erro de ±15%. É bússola, não prescrição.
- Para precisão real, pesar comida por 1–2 semanas pra calibrar percepção.
- Substituições são livres dentro da mesma categoria (proteína, carbo, gordura) — o sistema não força marca/alimento específico.

**Confiança: 7.5/10.** Os princípios do cardápio (proteína distribuída, carbo periodizado por dia, gordura boa) são bem suportados. O que tem mais incerteza: (1) a estimativa de macros por porção (variabilidade real de cortes, marcas, preparo); (2) o template base para 80 kg pode ficar "torto" em extremos (50 kg ou 130 kg) — gramaturas funcionam, mas a distribuição entre refeições pode precisar de ajuste manual. Se quiser, posso refinar isso com inputs adicionais (preferência alimentar, restrições) ou com opções A/B por refeição.
