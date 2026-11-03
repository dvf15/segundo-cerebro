---
title: "Montagem de material para workshop de IA e shopping inteligente"
date: 2026-04-27
updated: 2026-04-28
source: "claude-chat"
source_id: "af041611-6e3e-47a1-b974-1594f4ee3713"
url: "https://claude.ai/chat/af041611-6e3e-47a1-b974-1594f4ee3713"
project: null
messages: 19
tags: ["claude", "conversa"]
---
# Montagem de material para workshop de IA e shopping inteligente

> **Resumo:** **Conversation Overview**

This session continued a workshop planning project for shopping mall superintendents focused on AI agents and commercial prospecting. The person is working on an internal workshop that introduces AI tools to shopping mall teams while simultaneously building a practical AI agent called "Zél" — a commercial prospecting agent designed to identify, qualify, and initiate contact with potential tenants within a 2–50km radius of a mall.

The session had three distinct deliverables. First, the person requested a rebuild of an existing PowerPoint presentation for the Hunter Agent with two specifications: focus exclusively on the Hunter Agent (matching a previously created HTML file) and use a sober corporate visual style (light background, charcoal and amber/copper palette, Georgia/Calibri typography). Claude built a 12-slide deck covering the agent's mission, system prompt with Sam Zell principles, six operational skills in table format, scoring rubric, approach scripts, ecosystem integration, and a D0 action plan. Several visual defects were identified through iterative PDF-to-image QA and corrected: a large number overlapping title text in slide 2, a stat block clipped by a bottom card in slide 4, and a wrapping title in slide 11.

Second, the person requested a complete rebuild incorporating new content: the mandamentos (principles) of José Roberto Levy (provided via image upload) alongside Sam Zell's principles, a group dynamic exercise for participants, an informal tone, and the "Zél" caricature mascot (provided as an image file) appearing throughout. Zél is framed as a fusion of Sam Zell (mentalidade/mindset) and Zé Roberto Levy (execução/execution). Levy's 12 mandamentos cover field prospecting practices specific to Brazilian shopping mall commercial operations — including monitoring competitor malls, tracking expansion signals in nearby capitals, leveraging multi-brand and multi-franchisee operators, and maintaining a cadence of 10 meetings per week. The rebuilt 14-slide deck added a DNA slide showing Zell and Levy as Zél's "two parents," dedicated slides for each set of principles (6 Zell + 12 Levy), a logic slide explaining how Zell becomes prompt context and Levy becomes agent skills, a 60-minute group dynamic with three timed stages (context building 10 min, skill design 25 min, live Claude.ai testing 15 min), a blank worksheet template, a fully worked example using Levy mandamento #4, and a closing quote. The Zél image required cropping to remove a baked-in caption before use as a corner mascot across slides. Multiple QA rounds fixed corner image proportions, cover title sizing, duplicate captions in slide 2, and card overlap in slide 12.

Third, the person requested a video opening for Zél to be produced via NotebookLM. Claude delivered a complete 90-second production package: a timed narration script with natural pauses and energy direction, a scene-by-scene visual storyboard with transition types, color palette and typography specifications matching the PPT, audio direction including SFX and background music suggestions, CapCut/Canva assembly instructions, and second-by-second timing breakdown. The tone follows the informal register established in the PPT rebuild. Key collaborators referenced include Sam Zell (American investor, "Am I Being Too Subtle?" author) and Zé Roberto Levy (shopping mall commercial executive whose field principles anchor the agent's operational design). Output files were saved to `/mnt/user-data/outputs/`.

**Tool Knowledge**

For PPTX generation using pptxgenjs in this environment, the `cardShadow()` pattern must be a factory function returning a new object each call rather than a shared constant — reusing the same shadow object across shapes causes silent mutation bugs where later shapes inherit modified shadow properties. The Zél JPEG image had a baked-in caption in the lower portion that required PIL cropping (`img.crop((0, 0, 832, 1080))`) before use as a repeating corner mascot; the clean PNG was then referenced as `"image/png;base64,..."`. For iterative QA, the reliable pipeline was: `node build.js` → `soffice.py --headless --convert-to pdf` → `pdftoppm -jpeg -r 100` → view each slide image. Running `pdftoppm` at 100 DPI produces files fast enough for QA without being too large. The `NODE_PATH=$(npm root -g)` prefix is required when running scripts that use globally

**Mensagens:** 19 · **Criada:** 2026-04-27 · **Atualizada:** 2026-04-28

---

## 👤 Usuário · 2026-04-27 20:48

Monte material para o workshop

Objetivos:
1-Nivelar conhecimentos basicos de IA e provocar a utilização 
2-Iniciar a construção de uma plataforma de shopping inteligente 

Foco em 2 trabalhos com os supers
1-Criação de contexto para cada agente (referência Zell+prompts enviados)
2-Detalhamento das tarefas repetitivas (skills) 
3- Montar estrutura para Agente Hunter (foco em prospecção de lojas existentes em shoppings ou nao)

Dividir os supers em 5 grupos
Usando uma ferramenta de AI (definir uma) crie o contexto e um conjunto de skills detalhado com foco no shopping que estamos para resolver o seguinte problema (definir um agente ou poataforma por grupo, podemos definir ou sortear).
Entregaveis de cada grupo, criar agente detalhado. Output utilizável no D0 (lista objetiva para a equipe do Shopping). 
Atividade em grupo, juntar todos os grupos desenvolvendo e seus agentes. Criara grupo de WhatsApp para cada grupo com foco exclusivo no trabalho(sem bom dia e boa tarde). Usar video Notebook LM. Ao final os grupos devem jogar o modelo no Notebook LM e fazer um novo video

## 🤖 Claude · 2026-04-27 20:48

 Vou montar o material do workshop. Antes de começar, uma observação honesta: sua referência ao "Zell" e aos "prompts enviados" — não tenho acesso a esses materiais específicos, então vou trabalhar com o que dá pra inferir da imagem do Zél (agente IA comercial) e do ecossistema mostrado no infográfico. Se você tiver os prompts originais do Zél, vale anexar depois pra calibrar o tom.

Vou estruturar como um documento de workshop pronto pra rodar. Faz sentido eu gerar isso como um arquivo .docx que vocês possam imprimir/distribuir, ou prefere que eu deixe tudo aqui no chat pra você copiar?
```
This block is not supported on your current device yet.
```

Confiança: 6/10 — entendi a intenção do workshop, mas algumas peças estão dependendo de contexto que não tenho (material do Zél, dinâmica interna da equipe "supers"). Sinalizei acima.

## 🤖 Claude · 2026-04-27 21:01


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Pronto. O material cobre tudo que você descreveu, organizado em seções prontas para o workshop:

**O que está dentro:**

- **Capa** com posicionamento claro (IA do zero ao agente)
- **Agenda em 5 blocos** — nivelamento → ecossistema → construção → apresentação → NotebookLM
- **Nivelamento de IA** em 3 conceitos diretos (LLM, prompt, agente) com Claude.ai como ferramenta definida
- **Mapa do ecossistema** com os 5 agentes/plataformas do seu infográfico
- **Dinâmica dos grupos** com os 5 cards e missão de cada um
- **Template de prompt** para construção do contexto — referência Zell embutida
- **Agente Hunter detalhado** com 6 skills (input/output/frequência) como referência para os outros grupos
- **Regras do jogo** — WhatsApp sem bom dia, D0 utilizável, etc.
- **Entregável padronizado** por grupo: documento do agente + skills + lista D0
- **Conexão com Zell** — 3 princípios específicos aplicados ao design dos agentes

**Uma observação direta:** o material deixa o sorteio/definição do agente por grupo em aberto, como você indicou. Recomendo definir antes — sorteio ao vivo gera engajamento mas pode gerar resistência se alguém pegar o que considera "menos relevante". Melhor ter um plano B.

Confiança: 8/10

## 👤 Usuário · 2026-04-27 21:05

Refaça com foco somente no agente hunter

## 🤖 Claude · 2026-04-27 21:07


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Refiz com foco exclusivo no Hunter. O que está dentro:

**Estrutura:**
- Hero com os 3 números que importam (6 skills, raio 2–50km, output D0)
- **System prompt completo** pronto para colar no Claude.ai — com lógica Zell embutida
- **6 skills detalhadas** em tabela: nome, input, output e frequência de cada uma
- **Fluxo operacional** mostrando como as skills se encadeiam
- **Rubrica de score** — 5 critérios com o que aprova, o que acende alerta e o que descarta
- **Scripts prontos** de primeira abordagem (lojista de rua vs. lojista em outro shopping)
- **Mapa de integração** mostrando o que o Hunter alimenta nos outros agentes
- **Lista D0** — o que a equipe faz nos primeiros 3 dias após o workshop

**Uma observação direta:** o script de abordagem é propositalmente simples e sem jargão de shopping. A tendência natural é querer explicar tudo no primeiro contato — isso mata a conversa antes de começar. O objetivo do primeiro contato é só conseguir a reunião.

Confiança: 9/10

## 👤 Usuário · 2026-04-27 21:12

Gere apresentação em ppt

## 🤖 Claude · 2026-04-27 21:13

 ## Confirmar antes de gerar

Antes de criar o PPT, quero confirmar duas coisas:
```
This block is not supported on your current device yet.
```



## 👤 Usuário · 2026-04-27 21:13

P: Qual o foco da apresentação?
R: Só Hunter (como o último HTML)

P: Estilo visual?
R: Sóbrio corporativo (claro)

## 🤖 Claude · 2026-04-27 21:19

 Vou ler o skill do PPTX antes de criar.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Good — pptxgenjs, react-icons, and sharp are all installed. Let me build the deck.
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

Cover looks clean. Let me check the rest.
```
This block is not supported on your current device yet.
```

The "01" and "02" numbers are overlapping with the title text ("Nivelar IA" overlaps with "01"). Need to fix.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Issue: D0 stat block on right is being clipped by the bottom card. Need to fix spacing.
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


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Issues identified:

1. **Slide 2** — The big "01" / "02" numbers overlap with the title text ("Nivelar IA na prática" runs through "01")
2. **Slide 4** — The "D0" stat block on the right is partially hidden under the bottom card
3. **Slide 11** — "Primeiro contato real" wraps to 2 lines and the icon now visually overlaps slightly

Let me fix all three.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now fix slide 4 — the third stat block runs into the bottom card. Move stats up and tighten.
```
This block is not supported on your current device yet.
```

Now slide 11 — "Primeiro contato real" wraps. Let me shorten it.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Fixed. Now slide 4:
```
This block is not supported on your current device yet.
```

Fixed. Now slide 11:
```
This block is not supported on your current device yet.
```

All three issues fixed. Cleanly resolved. Now move the file to outputs and present.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Pronto. Apresentação em 12 slides, estilo sóbrio corporativo (charcoal + cobre/âmbar como accent, tipografia Georgia/Calibri).

**Estrutura:**
1. Capa
2. Por que estamos aqui — 2 objetivos
3. IA em 3 conceitos (LLM / Prompt / Agente) + ferramenta
4. Missão do Hunter + 3 stats principais
5. System prompt completo + princípios Zell
6. Tabela das 6 skills com input/output/frequência
7. Fluxo operacional em 6 passos
8. Rubrica de score (positivo/atenção/descarta)
9. Scripts de primeira abordagem
10. Integração com os outros agentes do ecossistema
11. Lista D0 — o que fazer nos primeiros 3 dias
12. Quote Sam Zell de fechamento

Após o primeiro render encontrei e corrigi 3 defeitos visuais: número grande sobreposto ao título no slide 2, terceiro stat block ("D0") cortado pelo card de baixo no slide 4, e título do Dia 3 quebrando em 2 linhas no slide 11.

Confiança: 9/10

- 📎 slide-01.jpg
- 📎 slide-02.jpg
- 📎 slide-03.jpg
- 📎 slide-04.jpg
- 📎 slide-05.jpg
- 📎 slide-06.jpg
- 📎 slide-07.jpg
- 📎 slide-08.jpg
- 📎 slide-09.jpg
- 📎 slide-10.jpg
- 📎 slide-11.jpg
- 📎 slide-12.jpg
- 📎 slide-02.jpg
- 📎 slide-04.jpg
- 📎 slide-11.jpg

## 👤 Usuário · 2026-04-27 21:32

Inclua uma dinamica para que os participantes tenham que exercitar a criação de conceitos e os skills, coloque os madamentos se Sam Zell e do Jozé Roberto Levy como dados para a criação de contexto e de execução. Use como figura ilustrativa o Zél como sendo a fusão do Sam Zell com o José Roberto, refaça apresentação colocando um tom mais informal

## 🤖 Claude · 2026-04-27 21:33

 Antes de refazer, preciso confirmar duas coisas — não tenho informação sobre José Roberto Levy nem sobre seus mandamentos, e preciso da imagem do Zél.

**Sobre José Roberto Levy:** Não sei quem é nem conheço seus mandamentos de investimento. Posso buscar na web, mas vou precisar que você confirme antes — pode haver várias pessoas com esse nome, e errar a pessoa seria pior que não ter o conteúdo.
```
This block is not supported on your current device yet.
```



## 👤 Usuário · 2026-04-27 21:33

P: Como prefere fornecer os mandamentos de José Roberto Levy?
R: Você vai colar o texto na próxima mensagem

P: A imagem do Zél (caricatura barbudo de óculos) deve aparecer:
R: Em vários slides como mascote

## 🤖 Claude · 2026-04-27 21:33

 Beleza. Aguardando você colar os mandamentos do José Roberto Levy na próxima mensagem para eu refazer a apresentação.

Confiança: 10/10 (instrução clara — só esperar o texto)

## 👤 Usuário · 2026-04-27 21:37

_(sem texto)_

- 📎 Mandamentos de Comercialização do Zé Roberto Levy.docx (docx)

```
Mandamentos de Comercialização do Zé Roberto Levy:

1- gastar muita sola na prospecção de lojas e visita ao mercado

2- monitorar mensalmente a concorrência do shopping analisado.

3- monitorar shoppings do clister do shopping analisado nas cidades de SP e Rio de Janeiro .

4- acompanhar o mercado das capitais mais próximas ao shopping analisado. Marcas locais começam a sair nas vizinhanças antes de estar em shopping 

 Ex: Recife - olhar o que acontece  em João Pessoa e Maceió. Ex: BH - Olhar SP Rio e Brasília 

5- Usar base da Allos (projeto Bahia) pra ver todas as lojas dos shoppings nessa rotas que estamos trabalhando e que estão provavelmente expandindo.

Ex: para a expansão do Mooca: Olhar Morumbi Eldorado Center Norte Anália Franco São Caetano. Ex: Na praça de BH se usarmos o Boulevard BH como exemplo , colocar todos os shoppings de BH mais Morumbi Eldorado Center Norte em SP no Rio Barra Leblon NS Tijuca Plaza 

6- Prospecção de RUA 

Mapear as principais vias de lojas de rua e multimarcas da cidade do shopping e quando for fora se capital, das maiores cidades vizinhas.

7- multimarcas podem ser vetor pra entrada de mono marcas em nosso shoppings, trazer multimarcas que trabalhem marcas que ainda nao estejam expandindo para a praça.

8- Multifranqueado da sua região e peça chave. Mapear multifranqueados e oportunidades para oferecer a eles de marcas que queiram expandir para a região.

9- os shoppings devem fazer muitos almoço / cafés com lojistas com potencial de crescimento . Temos um "aquário em casa com vários peixes" que já conhecemos. Pescar no aquárioé mais fácil do que em "mar aberto" .

10- Reunião é a peça chave . Cada um de nós tem que ter a missão de pelo menos 10 reuniões semanais. Não tem segredo e PRESENÇA que faz a diferença.

11- Acompanhar relatório de status semanal do assinado na Cia e aprovação pra ver se atende seu shopping

12- temos TODOS vender a ALLOS..Alavancar vendas na Cia
```
- 📎 IMG_0206.jpeg
- 📎 Mandamentos de Comercialização do Zé Roberto Levy.docx

## 🤖 Claude · 2026-04-27 21:46

 Tenho tudo que preciso. Vou refazer a apresentação com:
- Mandamentos do Zé Roberto Levy como base de execução
- Mandamentos do Sam Zell como base de mentalidade
- Zél (caricatura) como mascote em vários slides
- Tom mais informal
- Dinâmica prática para os participantes exercitarem contexto e skills
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

Issue: title "Conheça o Zél." wraps and overlaps with the subtitle. Need to shrink title. Let me check more slides and fix at the end.
```
This block is not supported on your current device yet.
```

Slide 2 looks great. The Zél image already includes its own caption "Zél, agente IA comercial" — and I added another caption below it. Need to remove my added captions to avoid duplication. Let me check more slides first.
```
This block is not supported on your current device yet.
```

Mini Zél in corner is showing both the mascot and its caption ("Zél, agente IA comercial"). The original image already has white margin and the caption baked in. I need to crop the image to just the face/torso. Let me check slide 7 and 9 first.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Slide 9 looks great. The dynamic is clear. Let me check the remaining slides.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Slight overlap on S5 — "região" gets cut off by the badge. Let me check the rest.
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

Good. Now let me list the actual issues to fix:

1. **Slide 1 cover** — Title "Conheça o Zél." is too big, wraps to 2 lines and overlaps subtitle
2. **Slide 2** — I added a redundant "ZÉL / agente IA comercial" caption below the image (the image already has this text)
3. **Slide 12 (S5)** — "região" gets cut off by the "Origem" badge

The mini Zél image showing "Zél, agente IA comercial" caption baked into it — I need to crop the image to just the face/torso area, removing the baked-in caption.

Let me crop the Zél image to remove the bottom caption portion, and fix the slide-specific issues.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Good — aspect ~0.77. Now update build script: use clean image, fix cover title, fix slide 2 redundant caption, fix slide 12 overlap.
```
This block is not supported on your current device yet.
```

Fix cover title — make it fit on one line.
```
This block is not supported on your current device yet.
```

Fix slide 2 — remove redundant ZÉL caption and adjust image proportions.
```
This block is not supported on your current device yet.
```

Fix mini Zél in corner — use clean image and adjust aspect ratio. The clean image is 832x1080 = ~0.77 aspect.
```
This block is not supported on your current device yet.
```

Fix slide 9 mini Zél (used direct addImage, not miniZel helper):
```
This block is not supported on your current device yet.
```

Fix slide 14 closing — use clean image without bottom caption (it was reading "Zél, agente IA comercial" twice — once in the caption box and once as text on the slide):
```
This block is not supported on your current device yet.
```

Now fix slide 12 — the S5 description "região" cuts under the Origem badge. Increase card height or move badge.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Cover looks much better. Now slide 2:
```
This block is not supported on your current device yet.
```

Slide 2 is now clean — no duplicate caption. Let me check slide 12 and the corner Zél on other slides:
```
This block is not supported on your current device yet.
```

Now bottom note overlaps with the footer. Let me push the bottom note up or remove. Actually the cards are fine — issue is the bottom note "As skills do seu grupo..." overlaps with the footer. Let me also check the corner Zél on other slides.
```
This block is not supported on your current device yet.
```

Mini Zél now clean — just the face/torso, no caption. Now fix slide 12 bottom note position.
```
This block is not supported on your current device yet.
```

Wait — actually the problem is the cards take up to y=6.55, and y=6.85 is right where the footer line is at y=7.1. Let me reduce card height back a touch instead so we have proper clearance:
```
This block is not supported on your current device yet.
```

Right — I already changed that block. Let me view it again and do it properly:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

With cardH=2.5 and startY=1.85, last card ends at y = 1.85 + 2.5 + 0.13 + 2.5 = 6.98. The note at 6.85 will overlap. Fix:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Slide 12 fixed. Let me check the closing slide and the cover one more time:
```
This block is not supported on your current device yet.
```

Looks great. Let me copy to outputs and present:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Pronto. 14 slides, tom mais informal, Zél como mascote em quase todos.

**Estrutura:**
1. Capa — "Conheça o Zél" com a caricatura completa
2. Dois pais, um agente — Zell (cabeça) + Levy (sola de sapato), Zél no meio
3. Por que estamos aqui — 2 objetivos, tom direto
4. IA em 3 minutos — LLM, Prompt, Agente
5. Missão do Zél + 3 stats (incluindo a meta Levy de 10 reuniões/semana)
6. **6 mandamentos do Zell** → mentalidade
7. **12 mandamentos do Levy** → execução (todos os 12, com créditos)
8. A lógica: Zell vira contexto, Levy vira skill — com exemplo de cada
9. **Dinâmica em grupo, 60 min** — 3 etapas (10/25/15 min) com regras da brincadeira
10. **Folha de trabalho pra preencher** — template do contexto + template de skill com 4 campos
11. **Exemplo resolvido** — Mandamento Levy #4 transformado em skill completa, com prompt pronto pro Claude
12. 6 skills de inspiração (com referência ao mandamento Levy de origem)
13. Plano D0 — o que fazer dia 1, 2 e 3
14. Fechamento — "Não tem segredo. É presença." (mandamento Levy #10)

**Sobre a dinâmica:** os participantes pegam mandamentos específicos do Zell e do Levy e exercitam a transformação — Zell vira instrução de contexto ("antes de me recomendar..."), Levy vira skill com input/output/frequência. Tem template em branco (slide 10) e exemplo resolvido (slide 11) pra eles compararem.

Confiança: 9/10

- 📎 slide-01.jpg
- 📎 slide-02.jpg
- 📎 slide-06.jpg
- 📎 slide-07.jpg
- 📎 slide-09.jpg
- 📎 slide-10.jpg
- 📎 slide-11.jpg
- 📎 slide-12.jpg
- 📎 slide-13.jpg
- 📎 slide-14.jpg
- 📎 slide-08.jpg
- 📎 slide-03.jpg
- 📎 slide-04.jpg
- 📎 slide-05.jpg
- 📎 slide-01.jpg
- 📎 slide-02.jpg
- 📎 slide-12.jpg
- 📎 slide-06.jpg
- 📎 slide-12.jpg
- 📎 slide-14.jpg

## 👤 Usuário · 2026-04-27 23:33

Construa um video de abertura do Zel

## 🤖 Claude · 2026-04-27 23:33

 ## Limitação real

Não consigo gerar vídeo — não tenho ferramenta de geração de vídeo neste ambiente. Posso construir alternativas que funcionam como abertura. Antes de escolher, quero ser direto sobre o que cada uma realmente entrega:
```
This block is not supported on your current device yet.
```



## 👤 Usuário · 2026-04-28 06:46

P: O que você prefere?
R: Roteiro pronto pra gravar no NotebookLM (áudio/vídeo)

## 🤖 Claude · 2026-04-28 06:47

 Vou criar um roteiro profissional de abertura para NotebookLM com timing, tom, efeitos e direcionamento visual.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Pronto. Roteiro de 90 segundos para NotebookLM.

**O que você faz agora:**

1. **Abra NotebookLM** (notebooklm.google.com)
2. **Cole o roteiro completo** (seção "ROTEIRO COMPLETO" do arquivo) 
3. **Clique em "Generate"** → selecione **voz descontraída** (tipo "Marcus" ou "Jordan")
4. **Exporte o áudio** como MP3
5. **Abra CapCut ou Canva** → importe o áudio → arraste as cenas visuais conforme o timing indicado
6. **Use as imagens visuais sugeridas** (grid de shoppings, caricatura Zél, cards de skills, etc.)
7. **Exporte e pronto** — tem seu vídeo de abertura

**Tempo total de montagem:** ~30 min no CapCut (se você já tiver as imagens).

Confiança: 8/10

(Não é 10 porque NotebookLM pode variar um pouco no timing final — mas o roteiro está estruturado pra absorver essas variações sem quebrar.)
