---
title: "Skill pptallos para paleta de cores Allos"
date: 2026-05-14
updated: 2026-05-14
source: "claude-chat"
source_id: "806c8351-2969-4e76-9a8e-52caf0505103"
url: "https://claude.ai/chat/806c8351-2969-4e76-9a8e-52caf0505103"
project: null
messages: 2
generated_files: 1
tags: ["claude", "conversa"]
---
# Skill pptallos para paleta de cores Allos

> **Resumo:** **Conversation Overview** The person requested that Claude create a custom skill called "pptallos" to standardize the Allos brand color palette whenever they request a PowerPoint presentation in the "Allos standard." The skill was built to work in conjunction with an existing "pptx" skill, with pptallos handling only the color palette rules and application guidelines while pptx handles the technical file construction. Claude created the SKILL.md file following the established skill-creator format, defining eight official Allos brand colors with their hex codes: petróleo escuro (#00616F), verde-escuro (#0D454A), teal médio (#368C82), vermelho coral (#CD5151), verde menta (#6CC680), laranja/âmbar (#EDA754), bege claro (#CCC5BC), and areia/off-white (#E5DED4). The skill includes trigger phrases in Brazilian Portuguese ("padrão Allos," "PPT Allos," "slides Allos," etc.), semantic color role assignments, text and background application rules, a default chart series order, and a ready-to-use python-pptx code snippet with named constants. Claude transparently noted that the hex codes were taken directly from the person's input but that the role assignments (primary color, chart series order, positive/negative/attention semantics) were Claude's own interpretation based on color theory rather than an official Allos brand guide, rating confidence at 7/10 and suggesting verification against any official brand documentation. The person communicates in Brazilian Portuguese and works within an established skill-based workflow, storing skills at `/mnt/skills/user/`. Claude structured the deliverable with a checklist section for pre-delivery validation, following the pattern of the existing skill ecosystem.

**Mensagens:** 2 · **Criada:** 2026-05-14 · **Atualizada:** 2026-05-14

---

## 👤 Usuário · 2026-05-14 01:21

Crie uma skill para padronizar a paleta de cores quando peço uma apresentação pptx no padrão Allos, nomeie a skill como pptallos:
#00616F — petróleo escuro
#0D454A — verde-escuro/quase preto
#368C82 — teal médio
#CD5151 — vermelho coral
#6CC680 — verde menta
#EDA754 — laranja/âmbar
#CCC5BC — bege claro
#E5DED4 — areia/off-white

## 🤖 Claude · 2026-05-14 01:23

  I need to create a skill called "pptallos" that applies the Allos color palette to PowerPoint presentations, so let me first look at how the skill-creator skill works to understand the proper structure.
```
This block is not supported on your current device yet.
```

 I've got the skill format down now. The user needs a "pptallos" skill that triggers on pptx requests matching the "Allos" pattern and applies a standardized color palette. I can see the user skills directory at `/mnt/skills/user/`, so I'll create the skill file there.

Now I'm mapping out the color palette roles—the dark petroleum and dark green shades work well for backgrounds and headers, while the teals, corals, and mint greens provide accent colors, and the light beige tones serve as neutral backgrounds.

The skill needs to enforce exclusive use of this palette, guide when to apply each color, and include ready-to-use code patterns that integrate with the existing pptx skill. I should also consider whether to apply the user's communication preferences about objectivity and confidence ratings to this skill itself.

Actually, I'm noticing the user is Brazilian Portuguese based on their existing skills, so I should write this skill in Portuguese to match their workflow.

Writing the skill definition... Agora estou definindo as regras fundamentais: preciso usar exclusivamente as cores da paleta Allos, sem exceções para azuis ou cinzas padrão do PowerPoint, e quando precisar de variação, devo trabalhar com transparência em vez de introduzir cores novas. Estou compilando a paleta oficial com as cores primárias e secundárias — petróleo escuro para títulos e marca, verde-escuro para texto principal e fundos, e teal médio para destaques. Agora estou definindo as regras de aplicação para texto, fundos e gráficos — especificando quais cores usar para títulos, corpo de texto e subtítulos, além de orientações sobre fundos claros versus escuros e a preferência por tons mais suaves em apresentações com muito conteúdo. Defining color constants... Defining semantic color mappings for positive, negative, and warning states, then running through a checklist to ensure the color palette is applied consistently across titles, charts, and data visualization...

Now I'm thinking through the implementation approach — I should create the skill structure and write out the SKILL.md file so the user can install it, rather than asking clarifying questions about color assignments since the palette is already defined. I'll create a clean skill document with transparent notes about my color role assignments so they can easily adjust them if needed.
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

Skill criada. Trigger: "padrão Allos", "no padrão da Allos", "PPT Allos", "slides Allos", etc. Funciona em conjunto com a skill `pptx` — esta só carrega a paleta e as regras.

Decisões que tomei sem você confirmar (pode ajustar se quiser):

- **Primária**: `#00616F` (petróleo) para títulos e marca.
- **Texto corpo**: `#0D454A`.
- **Secundária**: `#368C82` para subtítulos/destaque suave.
- **Semântica de gráfico**: menta = positivo, coral = negativo, âmbar = atenção.
- **Ordem de séries de gráfico**: petróleo → âmbar → teal → coral → menta → bege.
- **Fundos neutros**: `#E5DED4` ou `#CCC5BC` em vez de cinza padrão do PowerPoint.

Para instalar: salva o arquivo em `/mnt/skills/user/pptallos/SKILL.md` (mesmo padrão dos seus mandamentos).

Se quiser que algum papel mude (ex.: cor primária diferente, outra ordem de séries, inclusão de tipografia padrão), é só dizer.

---
Confiança: 7/10. Os hex codes e nomes que você passou estão corretos. As **atribuições de papel** (qual cor é primária, ordem de séries, semântica positivo/negativo) são minha interpretação baseada em teoria de cor, não em um manual de marca Allos que eu tenha visto — se a Allos já tem um brand guide oficial, vale conferir.


---

## Arquivos gerados nesta conversa

- [[claude/arquivos-gerados/2026-05/skill-pptallos-para-paleta-de-cores-allos_806c8351/home/claude/pptallos/SKILL.md]] (4 KB)
