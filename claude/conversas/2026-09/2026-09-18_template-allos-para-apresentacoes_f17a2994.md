---
title: "Template Allos para apresentações"
date: 2026-09-18
updated: 2026-09-18
source: "claude-chat"
source_id: "f17a2994-1484-480c-8877-dbe4da2028f7"
url: "https://claude.ai/chat/f17a2994-1484-480c-8877-dbe4da2028f7"
project: null
messages: 4
tags: ["claude", "conversa"]
---
# Template Allos para apresentações

> **Resumo:** **Conversation Overview** The person shared a zip file containing the Allos brand design system (`Allos_Design_System.zip`) and instructed Claude to apply this design whenever they request a presentation in the "template Allos." Claude extracted and analyzed the package, reading tokens for color, typography, spacing, and brand guidelines from the source files, then saved the design system rules to memory for future reference. Claude identified the key design parameters from the package: primary teal color `#00616F` with secondary teal variants, tertiary colors (orange `#EDA754`, red `#CD5151`, green `#6CC680`, warm gray `#CCC5BC`, off-white `#E5DED4`) used only for text and graphic accents never as dominant backgrounds, Gantari typeface (with Calibri as Office fallback), arc-based line graphic elements in thin strokes, documentary black-and-white photography of shopping mall interiors, and short aspirational headlines in sentence case. Claude noted two important caveats: no official slide deck template exists in the package (layouts must be constructed from brand tokens), and binary assets like logos and SVG icons do not persist between conversations without re-uploading the zip. When asked to generate an example presentation, Claude built an 8-slide deck themed as a "Plano Comercial 2026" for an internal shopping portfolio audience, as this was judged the most contextually appropriate theme. The deck included a cover, agenda, context, metrics, three strategic priorities, a vacancy table by asset, a brand statement slide, and next steps. All numerical data was left as placeholder markers to be filled in. Claude flagged that the green tertiary color required darkening for readable contrast on white backgrounds, and invited feedback on adjustments to theme, slide count, or content density.

**Mensagens:** 4 · **Criada:** 2026-09-18 · **Atualizada:** 2026-09-18

---

## 👤 Usuário · 2026-09-18 16:07

Considere esse design sempre que eu pedir uma apresentação no template Allos

- 📎 Allos Design System.zip

## 🤖 Claude · 2026-09-18 16:09


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

Registrado — vou aplicar sempre que você pedir "template Allos".

Do que li no pacote, o que vou usar como base: teal primário `#00616F` (secundários `#098B80`, `#0D454A`), terciárias laranja/vermelho/verde só em texto e grafismo (nunca fundo dominante), tipografia **Gantari** com fallback Calibri, grafismos de arco em traço fino, fotos documentais em P&B, headlines curtas em sentence case, sem emoji.

Dois pontos honestos antes de você contar com isso:

**1. Não existe template de slides no pacote.** O próprio readme diz que nenhum template de deck foi fornecido e que, por isso, não há grupo "Slides". Então "template Allos" para apresentação vai ser um layout que eu construo a partir dos tokens da marca — consistente com o manual, mas não um template oficial de PPT da Allos. Se existir um deck padrão interno, vale me mandar.

**2. Os assets binários não persistem.** Guardei as regras de cor, tipo e layout, mas logo, os ~48 ícones SVG e as fotos não ficam salvos entre conversas. Três formas de resolver isso de verdade:

- Publicar o pacote como artifact do tipo **Design System** — fica disponível e virou referência padrão para decks e designs futuros
- Instalar o `SKILL.md` (`allos-design`) que já vem no zip, como skill
- Simplesmente reenviar o zip quando for usar

A primeira é a mais durável. Quer que eu publique? Só faço com seu ok.

---
Confiança: 8/10. Alta quanto aos tokens e regras (li direto do `readme.md`, `tokens/colors.css` e `tokens/typography.css` do seu arquivo). O ponto que baixa a nota é eu não saber se existe um template de PPT oficial da Allos fora deste pacote.

## 👤 Usuário · 2026-09-18 16:57

Gere uma apresentação como exemplo

## 🤖 Claude · 2026-09-18 17:01


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

Pronto — 8 slides, aplicando o design system que você mandou.

O que assumi, já que você não deu tema: um "Plano Comercial 2026" da carteira, público interno, porque é o tipo de deck mais provável no seu contexto. Estrutura: capa → agenda → contexto → números → três frentes → tabela de vacância → slide de respiro → próximos passos.

**Como o template foi aplicado:** teal `#00616F` na capa, `#0D454A` nos slides de respiro, off-white `#E5DED4` como segundo fundo, terciárias (laranja/verde) só como filete e rótulo, nunca fundo. Tipografia Gantari. Grafismos de arco em traço fino saindo das bordas. Foto de interior em P&B. Logo negativo na capa, positivo no rodapé final.

**Não inventei nenhum número.** Tudo que seria dado está como marcador para você preencher:
- Vacância da carteira, atual e ano anterior
- Aluguel médio por m² e leasing spread
- Nº de contratos a vencer e % da ABL
- Tabela por ativo: nome, praça, ABL locada, vacância e meta (4 linhas + total)
- Datas e responsáveis dos próximos passos
- Autor, mês e nome da carteira na capa
- Fonte no rodapé dos dois slides de dados

Duas ressalvas honestas: o verde `#6CC680` do manual não passa contraste legível como texto sobre branco, então escureci só o rótulo da Frente 02 — se preferir fidelidade estrita ao hex, é só dizer. E, como já falei, isso é um layout derivado dos tokens da marca, não um template oficial de PPT da Allos.

Quer que eu ajuste tema, número de slides ou densidade?

---
Confiança: 7/10. Alta na aplicação dos tokens (li direto dos arquivos). Mais baixa porque não vi o deck renderizado e o julgamento de "isso parece Allos" depende de um padrão interno que eu não tenho como verificar.
