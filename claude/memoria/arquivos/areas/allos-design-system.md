---
title: "allos-design-system"
date: 2026-09-18
source: "claude-memory"
source_id: "/areas/allos-design-system.md"
description: "Design system da marca Allos (cores, tipografia, grafismos, logo) a aplicar em apresentações e materiais no \"template Allos\""
tags: ["claude", "memoria", "memoria/areas"]
---
- [stated] Daniel enviou o pacote `Allos_Design_System.zip` e pediu que esse design seja considerado sempre que ele pedir uma apresentação no template Allos
- [stated] O pacote contém: readme, tokens CSS (cores/tipografia/espaçamento), guidelines HTML, componentes React, UI kit de site institucional, SKILL.md (`allos-design`) e assets (logos, ~48 ícones SVG, imagens)
- [stated] O pacote é derivado do Manual da Marca oficial da Allos; não inclui template de slides pronto — o visual de deck precisa ser construído a partir dos tokens da marca

---

## Tokens de cor

- Primária: teal `#00616F` (--teal-800)
- Secundárias: `#098B80` (--teal-600), `#0D454A` (--teal-900), `#368C82` (--teal-500), branco
- Terciárias (só texto e grafismos, nunca fundo dominante): laranja `#EDA754`, vermelho `#CD5151`, verde `#6CC680`, cinza quente `#CCC5BC`, off-white quente `#E5DED4`
- Texto: corpo `#1E2B2D`, secundário `#5C6E70`, sobre marca branco; bordas `#D8D2C8`

## Tipografia

- Display e corpo: **Gantari** (Google Fonts, Extralight→Black + itálicos)
- Fallback para Office/Word/PPT: **Calibri**
- Escala: display 64/48/36px; headings 28/22/18px; corpo 18/16/14px; caption 12px
- Line-height: 1.1 tight, 1.25 heading, 1.55 corpo

## Espaçamento, raio e sombra

- Espaços: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Raios: 4 / 8 / 16 / pill; sombras com tinta teal `rgba(13,69,74,0.08)` e `(0.14)`

## Regras visuais da marca

- **Grafismos**: arcos de linha com cantos arredondados (derivados do arco do monograma e do anel do "O", leitura de "aliança"), repetidos/sobrepostos/rotacionados sobre fundo colorido ou foto; traço fino ~1–1,5px, nunca forma preenchida
- **Fundos**: cor chapada full-bleed ou fotografia — o manual roda texto e logo direto sobre fundo, não sobre cards brancos
- **Imagens**: fotografia documental real de interiores de shopping (arquitetura, escadas rolantes, jardins verticais, pessoas em movimento), em **preto e branco**
- **Ícones**: glifos single-tone preenchidos (não outline), uma cor da paleta por ícone
- **Logo**: versão positiva teal para fundo claro, negativa branca para fundo escuro/foto; área de proteção ≥ altura do próprio logo; tamanho mínimo 20px em tela / 2mm em impressão
- **Tom de voz**: headlines curtas, aspiracionais, sentence case (não title case); confiante e caloroso, não corporativo-duro; sem emoji

---

## Limitações a lembrar

- [stated] Assets binários (logo, ícones SVG, fotos) não ficam salvos na memória — em nova conversa Daniel precisa reenviar o zip, publicar o pacote como artifact do tipo "Design System", ou instalar o `SKILL.md` (`allos-design`) como skill
- Sem o zip, é possível reconstruir cor/tipo/layout a partir deste arquivo, mas não os assets
