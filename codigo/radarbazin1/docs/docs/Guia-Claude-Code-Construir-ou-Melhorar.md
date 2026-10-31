---
title: Guia Claude Code — Construir ou Melhorar
aliases:
  - Guia Claude Code
  - Construir ou Melhorar a Ferramenta
  - Claude Code do Zero
tags:
  - claude-code
  - tutorial
  - quiosques
  - no-code
  - vibe-coding
created: 2026-07-03
updated: 2026-07-03
status: tutorial
---

# Guia Claude Code — Construir ou Melhorar

> [!abstract] Para quem é este guia
> Para quem **ainda não usa o [[Claude Code]]** e quer, na própria máquina,
> pegar a ferramenta [[Radar Quiosques]] e **melhorá-la** — ou **construir uma
> solução parecida do zero**. Sem experiência prévia de programação.

## Índice
- [[#1. O que é o Claude Code]]
- [[#2. Instalar (uma vez)]]
- [[#3. Caminho A — Melhorar esta ferramenta]]
- [[#4. Caminho B — Construir do zero]]
- [[#5. Como pedir bem (prompts)]]
- [[#6. Onde ficam as coisas na ferramenta]]
- [[#7. Testar, publicar e versionar]]
- [[#8. O ciclo do dono]]

---

## 1. O que é o Claude Code

O [[Claude Code]] é o assistente da Anthropic que roda **no terminal** e trabalha
**dentro de uma pasta do seu computador**: ele lê, cria e edita arquivos, roda
comandos e testa — você conversa em português e aprova as ações. É a forma mais
direta de evoluir um projeto de verdade (foi assim que o [[Radar Quiosques]] foi
construído).

> [!tip] Sem instalar nada, só para experimentar
> Se quiser só provar a ideia, dá para usar o **[[Claude.ai]]** no navegador:
> peça um "app em um único arquivo HTML" e ele gera num Artifact. Mas para
> **melhorar de verdade e versionar**, siga com o Claude Code abaixo.

## 2. Instalar (uma vez)

> [!note] Pré-requisitos
> 1. **Node.js 18+** — baixe em nodejs.org e instale. Confira no terminal:
> ```bash
> node --version
> ```
> 2. **Claude Code**:
> ```bash
> npm install -g @anthropic-ai/claude-code
> ```
> 3. Uma **conta Claude** (autentica na primeira vez que rodar `claude`).

## 3. Caminho A — Melhorar esta ferramenta

**Ideal para:** partir de algo pronto e adaptar à sua praça.

1. **Pegue o projeto.** Se você tem o repositório no GitHub:
```bash
git clone https://github.com/dvf15/radarbazin1.git
cd radarbazin1
```
   (Sem git? Baixe o `public/quiosques.html` e coloque numa pasta só dele.)
2. **Abra o Claude Code na pasta:**
```bash
claude
```
3. **Peça a melhoria, uma de cada vez.** Exemplos reais:
   - "No `public/quiosques.html`, troque a base de exemplo pelas marcas da minha praça — vou colar a lista."
   - "Adicione um campo 'ponto pretendido' na triagem e mostre no cadastro do investidor."
   - "Mude os pesos do score: financeiro deve valer mais que interesse."
   - "Gere um relatório em PDF por investidor."
4. **Teste** (peça ao próprio Claude): "abra o arquivo no navegador e rode um caso: investidor com R$ 80 mil, primeira vez — o ranking faz sentido?"

> [!tip] Peça também os testes
> Este projeto valida a lógica com testes "headless" (Node). Diga: *"depois de
> mudar, rode um teste rápido conferindo que os scores continuam entre 0 e 100"*.

## 4. Caminho B — Construir do zero

**Ideal para:** um app novo, seu, com outra cara.

1. Crie a pasta e entre:
```bash
mkdir minha-ferramenta && cd minha-ferramenta
```
2. Rode `claude` e faça o **pedido inicial** (adapte):

> [!quote] Prompt inicial
> "Você é um especialista em comercialização de quiosques de shopping. Crie uma
> ferramenta em **um único arquivo HTML** (sem dependências, offline, tema
> escuro, celular-friendly) que faça a triagem de um investidor: pergunte
> capital de implantação, capital de giro, tempo, experiência e marca/segmento
> em mente. Depois cruze com uma base de ~20 marcas de franquia em quiosque
> (investimento, payback, royalties) e mostre um ranking com nota 0–100 e a
> justificativa de cada nota. Comece pela versão mais simples que funcione."

3. **Evolua em camadas**: banco de investidores → planejamento → cruzamento →
   ficha → import CSV. (Foi exatamente essa a ordem do [[Radar Quiosques]].)

## 5. Como pedir bem (prompts)

> [!tip] Boas práticas de pedido
> - **Uma mudança por vez** e teste antes da próxima.
> - **Dê contexto e exemplo**: "usando os nomes de segmento que já existem…".
> - **Peça o critério**: "marca acima do capital do investidor deve cair no ranking".
> - **Peça verificação**: "rode um caso real e me diga se faz sentido".
> - **Reverta sem medo**: "desfaça a última mudança" (com git, é seguro).

## 6. Onde ficam as coisas na ferramenta

> [!info] Mapa rápido de `public/quiosques.html`
> Tudo em um arquivo. Para pedir mudanças precisas, cite estes pontos:

| Quero mudar… | Onde |
|--------------|------|
| Marcas da base | array `BASE_BRANDS` (ou importe por CSV) |
| Segmentos | array `SEGMENTS` |
| Pontos padrão | `DEFAULT_POINTS` |
| **Pesos do score** | objeto `W` e a função `scoreBrand()` |
| Regra do mix/planejamento | trecho "mix a partir dos pontos" em `scoreBrand()` |
| Faixas de nota (Alto/Médio…) | função `tierOf()` |
| Perguntas da triagem | HTML da seção `view-triagem` |
| Textos/rótulos | direto no HTML |

Documentação de apoio: `docs/RADAR-QUIOSQUES.md` e o capítulo
[[Agente Farmer e Conector de Quiosques]].

## 7. Testar, publicar e versionar

> [!note] Rotina saudável
> - **Testar**: duplo clique no `.html`, ou peça ao Claude para abrir no navegador.
> - **Versionar**: *"inicialize um git e faça um commit"* — cada melhoria fica registrada e reversível.
> - **Publicar (opcional)**: *"me ajude a publicar na [[Vercel]]"* — um arquivo estático vira um link que abre em qualquer celular. Coloque-o em `public/` e a Vercel serve em `/arquivo.html`.
> - **Apresentação**: este projeto até gera o guia em PPTX via `docs/deck/build_quiosques_ppt.py` (`python3 docs/deck/build_quiosques_ppt.py`).

## 8. O ciclo do dono

```
PERGUNTE  →  TESTE COM UM CASO REAL  →  AJUSTE UMA REGRA  →  repita
```

Ideias de evolução por ordem de valor:
- Base de marcas **real** da sua praça (números de [[COF]]).
- Campos extras (região, ponto pretendido, prazo de decisão, crédito).
- **Proposta em PDF** por investidor.
- **QR Code** do link da ficha para o balcão.
- **Base compartilhada em nuvem** (Postgres/Prisma) para vários executivos.

> [!tip] Regra de ouro
> Não tente acertar tudo de primeira. Rode o ciclo: cada volta melhora um
> pedaço, e o git guarda o caminho de volta.

## Notas relacionadas
- [[Agente Farmer e Conector de Quiosques]]
- [[Radar Quiosques]]
- [[Claude Code]]
- [[Vercel]]
