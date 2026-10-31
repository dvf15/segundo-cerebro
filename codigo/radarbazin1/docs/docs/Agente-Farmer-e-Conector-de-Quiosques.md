---
title: Agente Farmer e Conector de Quiosques
aliases:
  - Agente Farmer
  - Conector de Quiosques
  - Radar Quiosques — Capítulo
tags:
  - shopping-inteligente
  - agente-farmer
  - quiosques
  - franchising
  - triagem-investidores
  - tenant-mix
  - claude
created: 2026-07-03
updated: 2026-07-03
status: referência
---

# Agente Farmer e Conector de Quiosques

> [!abstract] Sobre este capítulo
> Um capítulo do conceito de **[[Shopping Inteligente]]**: o dado deixa de ser
> relatório e vira conversa comercial. Descreve o **Agente Farmer** — apoio ao
> executivo de mall para **captar, triar e conectar** investidores aos quiosques
> certos — e resume **toda a lógica** construída na ferramenta [[Radar Quiosques]]
> (`public/quiosques.html`), que roda **100% local** no navegador.

## Índice
- [[#1. O conceito: Shopping Inteligente e o papel Farmer]]
- [[#2. Anatomia do sistema (4 abas + ficha)]]
- [[#3. A receita do agente]]
	- [[#3.1 As perguntas certas (roteiro de triagem)]]
	- [[#3.2 Motor de match investidor × marca]]
	- [[#3.3 Planejamento por pontos do shopping]]
	- [[#3.4 A regra de ouro do score]]
	- [[#3.5 O cruzamento (o conector)]]
	- [[#3.6 A ficha do investidor (captação sem servidor)]]
	- [[#3.7 Carga em massa por planilha (CSV)]]
- [[#4. Princípios de projeto]]
- [[#5. Arquitetura e persistência]]
- [[#6. Referências]]

---

## 1. O conceito: Shopping Inteligente e o papel Farmer

Um [[Shopping Inteligente]] usa **dados para decidir o mix** — quais marcas, em
quais segmentos, em quais pontos — maximizando fluxo, ticket e permanência.
Comercializar um quiosque deixa de ser "quem chegou primeiro com o cheque" e
passa a ser **casar o investidor certo, com a marca certa, na vaga certa**.

Na cultura comercial há dois perfis:

| Perfil | O que faz | Risco quando falta |
|--------|-----------|--------------------|
| **Hunter** (caçador) | Prospecta leads novos | Pipeline vazio |
| **Farmer** (fazendeiro) | Cultiva a base, qualifica, nutre e converte | Bons leads se perdem por falta de método |

O **Agente Farmer** é a versão digital do farmer: não inventa o negócio — ele
**faz as perguntas certas, guarda a informação e cruza as bases**. É "conector"
porque liga três mundos que normalmente vivem em planilhas separadas:

```
   INVESTIDOR             BASE DE MARCAS (ABF/PEGN)         PONTOS DO SHOPPING
 capital, giro,     ⇄   franquias em quiosque, faixas   ⇄   ocupados (marca) e
 tempo, experiência,     de investimento, payback,           vagos (3 opções de
 marca em mente          royalties, complexidade              mix desejado)
```

## 2. Anatomia do sistema (4 abas + ficha)

> [!info] Um app, quatro abas
> O trabalho vai da configuração ao fechamento.

| Aba | Função |
|-----|--------|
| **➕ Triagem** | Faz as perguntas e recomenda marcas ao investidor |
| **👥 Investidores** | Banco persistente (mini-CRM) para consulta futura |
| **🗺️ Planejamento** | Pontos do shopping, marcas desejadas e a base de marcas |
| **🔗 Cruzamento** | Conecta a base ao planejamento comercial |

Fora das abas, um fluxo de **captação**: a **[[#3.6 A ficha do investidor (captação sem servidor)|ficha do investidor]]**
(enviar link → investidor preenche → devolve código → cai no banco pontuado).

## 3. A receita do agente

### 3.1 As perguntas certas (roteiro de triagem)

Cinco blocos, na ordem de uma boa qualificação:

1. **Identificação** — nome, contato, origem do lead (indicação, feira [[ABF]], corretor…).
2. **Capacidade de investimento** — **capital de implantação** *e* **capital de giro reservado** (separados de propósito) + fonte do capital.
3. **Tempo dedicado** — integral / parcial / baixa, e se opera ou contrata gerente.
4. **Experiência prévia** — primeira vez / gestão / setor; segmentos que conhece; se já é franqueado.
5. **Marca & segmento em mente** — marca específica e/ou segmentos de interesse; perfil de risco; objetivo.

> [!warning] Por que o giro é perguntado à parte
> **Capital de giro insuficiente é a maior causa de mortalidade de quiosque no
> 1º ano.** Nunca é somado por preguiça ao capital de implantação.

> [!tip] Princípio de ordem
> Levante **restrições** (o que limita) antes de **desejos** (marca/segmento).

### 3.2 Motor de match investidor × marca

Cada marca é pontuada de 0 a 100 em **7 dimensões ponderadas**:

| Dimensão | Peso | Avalia |
|----------|:----:|--------|
| **Financeiro** | 30 | Implantação cabe no capital? (é **trava**, não só peso) |
| **Interesse** | 18 | Marca em mente / segmento desejado |
| **Capital de giro** | 14 | Reserva ≥ giro sugerido |
| **Tempo/operação** | 14 | Dedicação × o que a marca exige |
| **Experiência** | 14 | Perfil recomendado × experiência real |
| **Risco** | 10 | Complexidade e payback × apetite |

A média ponderada é o **match do investidor** (`invScore`).

### 3.3 Planejamento por pontos do shopping

O mix não é digitado como meta/atual — é **derivado dos pontos** cadastrados:

- Ponto **ocupado** → informa a **marca** (a marca entra em "já presente").
- Ponto **vago** → até **3 opções de mix desejado** (segmentos, por preferência; a 1ª pesa mais).

Daí sai, por segmento: **ocupação** (quantos pontos já operam nele) e **demanda**
(quanto as vagas o pedem). E o conjunto de **marcas já presentes**.

### 3.4 A regra de ouro do score

> [!important] O planejamento modula, não infla
> O `mix` **modula** o match (multiplica ~0,7×–1,0×) e **nunca** o infla acima
> dele. Marca **já presente** num ponto é penalizada (anti-canibalização);
> marca **desejada** pelo shopping ganha um bônus.

```
score_final = invScore × (0,7 + 0,3 × mix/100) + bônus_lacuna   (limitado a 100)
```

Consequência: uma marca **fora da capacidade financeira não é "resgatada"** só
porque há vaga. Viabilidade do investidor primeiro; o mix ordena entre os viáveis.

### 3.5 O cruzamento (o conector)

A aba que vira decisão para o executivo:

- **Pontos vagos × melhor encaixe** — por ponto vago, os melhores **investidor × marca** dos segmentos desejados daquele ponto.
- **Marcas desejadas × base** — para cada marca-alvo, **quem na base** se encaixa (com a trava financeira).
- **Cobertura** — quantas vagas já têm candidato forte e quais estão **sem candidato** (foco de captação).

### 3.6 A ficha do investidor (captação sem servidor)

Fluxo por **link + código**, sem backend:

1. Executivo clica **📤 Enviar ficha** → link do app em *modo investidor* (`#investidor`), enviado por WhatsApp/e-mail.
2. Investidor preenche no celular uma ficha simples (sem ver notas) e clica **Concluir**.
3. O app gera um **código `RQ1:...`** (base64) ou um `.json` que ele devolve.
4. Executivo clica **📥 Receber resposta**, cola o código, e a ficha **entra no banco já pontuada**.

### 3.7 Carga em massa por planilha (CSV)

Três importadores, para popular tudo por Excel/Sheets:

| Dado | Onde | Observação |
|------|------|-----------|
| Investidores | Investidores → Importar CSV | aceita rótulo ou código; pontua na importação |
| Pontos | Planejamento → Importar CSV | `nome, status, marca, mix1..3` |
| Marcas | Base de marcas → Importar marcas | expande a base; **segmentos novos criados sozinhos** |

O parser tolera `,` ou `;` (Excel BR), aspas, ignora linhas `#`, e casa segmentos
por match exato ou parcial.

## 4. Princípios de projeto

1. **Restrições antes de desejos.**
2. **Trava dura onde o negócio quebra** — acessibilidade não é média, é porta.
3. **Dado é sempre "de referência"** — validar na [[COF]] de cada rede.
4. **O planejamento é do empreendimento** — o agente organiza; a curadoria é do executivo.
5. **Transparência da nota** — todo score vem com o "porquê".
6. **Local-first** — roda offline, dados no navegador, com backup/portabilidade.

## 5. Arquitetura e persistência

> [!note] Um arquivo, sem servidor
> Todo o app é **um `.html` autossuficiente**. Sem build, sem banco, sem login.

- **Persistência**: `localStorage` (por dispositivo). Chaves: investidores, plano (pontos + marcas desejadas), marcas personalizadas.
- **Portabilidade**: export **CSV** (planilha) e **Backup JSON** (cópia completa) + importar em outro dispositivo.
- **Publicação**: como arquivo estático, abre local (duplo clique) e também é servido pela [[Vercel]] em `radarbazin1.vercel.app/quiosques.html`.
- **Evolução possível**: base compartilhada em nuvem usando o Postgres/Prisma já presente no repositório (multiusuário, fichas caindo direto no banco).

## 6. Referências
- Ferramenta: `public/quiosques.html`
- Apresentação/guia: `public/apresentacao.html` e `docs/Radar-Quiosques-Guia-Executivo.pptx`
- Metodologia detalhada: `docs/RADAR-QUIOSQUES.md`
- Como construir/melhorar: [[Guia Claude Code — Construir ou Melhorar]]
- Fontes de dados: [[ABF]] e [[PEGN]] — valores de referência, **validar na [[COF]]**.

## Notas relacionadas
- [[Shopping Inteligente]]
- [[Radar Quiosques]]
- [[Tenant Mix]]
- [[Guia Claude Code — Construir ou Melhorar]]
- [[Claude Code]]
