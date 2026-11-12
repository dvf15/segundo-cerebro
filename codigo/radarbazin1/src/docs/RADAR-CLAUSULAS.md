---
title: Radar de Cláusulas — Gestão e Aprovação por Alçada
aliases:
  - Radar de Cláusulas
  - Aprovação de Cláusulas
  - Alçadas de Cláusulas
tags:
  - shopping-inteligente
  - clausulas
  - alcadas
  - auditoria
  - ferramenta
created: 2026-10-14
updated: 2026-10-14
status: ativo
---

# Radar de Cláusulas — Gestão e Aprovação por Alçada

Ferramenta de apoio ao **executivo comercial de shopping** para registrar um
pedido de cláusula contratual, saber **quem tem alçada** para aprová-lo, medir
o **custo da concessão** (por loja e no total da rede) e conduzir a aprovação
com **trilha de auditoria** — quem decidiu, quando, por quê.

> Arquivo único, sem build, sem dependências: **`public/clausulas.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve em **`https://radarbazin1.vercel.app/clausulas.html`**
> após o merge na branch de produção.

## De onde ela vem

- **Família Radar:** mesma estrutura, visual e mecânica do
  [[RADAR-VAREJO|Radar de Varejo]] — abas, banco com status (mini-CRM),
  parametrização, ficha enviar/receber por código, CSV/backup, checagens
  antes de concluir e saída de texto para acompanhamento.
- **Racional de decisão:** a régua de alçadas do projeto
  *Copiloto de Decisão de Cláusulas* (pasta `sistema/`, vault Obsidian em
  `obsidian/`), já validada no motor Python (`sistema/motor/engine.py`).
- **O que é novo:** o **fluxo de aprovação** (pipeline com decisões,
  escalada e devolução), o **modo aprovador** à distância e a **trilha de
  auditoria** com hash encadeado, precedentes, indicadores e relatório.

---

## Estrutura em abas

1. **Solicitação** — a avaliação: marca (do cadastro), tema/tipo de cláusula,
   segmento, praças, portfólio e os **valores da concessão**. O resultado traz a
   **alçada que decide**, o porquê, o desconto, o custo por loja e total, o
   status do guia, o veredito, as **checagens** ("confira antes de registrar") e
   o **dossiê** pronto. Daí: **Registrar no pipeline** ou **Enviar ao aprovador**.
   No topo, **Receber decisão** (cola o código `RC1D:`) e o **link do aprovador**.
2. **Pipeline** — as solicitações com status do fluxo (aguardando · aprovada ·
   aprovada com ajuste · negada · devolvida), busca, filtro por status e por
   alçada, contagem de pendentes por alçada e, em cada card, o dossiê, a
   **decisão** (Aprovar · Aprovar com ajuste · Negar · Escalar · Devolver, sempre
   com decisor e justificativa), notas e o follow-up "sem atualização há N dias".
   **Excel (CSV)**, **Backup** e **Importar**.
3. **Parametrização** — regras de alçada (desconto máximo, máx. de praças do
   Diretor, dias para marcar como parado), **graus estratégicos** (rótulo,
   critério e quais vão sempre à Diretoria), **marcas** (segmento, grau, nº de
   praças — com filtro e edição em linha), **portfólios** dos Diretores, a
   **biblioteca** dos 32 tipos com status-padrão do guia e as **exceções por
   segmento**. Backup/Importar só da parametrização, para circular entre
   executivos.
4. **Auditoria** — indicadores (solicitações, pendentes, % aprovadas, custo
   concedido, tempo médio de decisão, integridade), quadro por alçada,
   **precedentes** ("já decidimos isso antes?"), a **trilha** de eventos com
   filtro por período e tipo, **Verificar integridade**, CSV da trilha e o
   **relatório de auditoria** (copiar · .txt · WhatsApp).

### Modo aprovador — enviar e receber (sem servidor)

O executivo clica em **Enviar ao aprovador** → a ferramenta monta a mensagem
com o dossiê, o **link** (a mesma página em modo aprovador, via `#aprovador`) e
o **código** `RC1:...` da solicitação. O aprovador (Superintendente, Diretor
de Portfólio ou Diretoria) abre o link no celular: **só o card de decisão
existe na página** — pipeline, parametrização e auditoria são **removidos do
DOM**, não apenas ocultados. Ele cola o código, lê o dossiê, informa nome e
**justificativa obrigatória** e decide. Sai um código `RC1D:...` que ele devolve
por WhatsApp/e-mail; o executivo cola em **Receber decisão** e a decisão entra
no pipeline e na trilha, marcada "via código". Se a solicitação não existir
naquele navegador, o código traz o dossiê e ela é criada junto.

> [!note] O leitor tolera o que o caminho faz com o código
> E-mail dobra o texto, o WhatsApp insere quebra ou espaço, apps tiram o `=`
> do fim e o `:` às vezes vira `%3A`. O leitor tenta o texto como veio, sem
> espaços, decodificado de URL e completa o preenchimento do base64 antes de
> desistir. A mensagem inteira, com texto em volta, também entra.

Tudo que chega de fora passa por whitelist (`sanitizeSolic`): campos
inesperados são descartados, tamanhos limitados, números e alçadas forçados a
valores válidos.

Persistência em `localStorage` (por navegador). Use **Backup** para levar
entre dispositivos. Para uma base compartilhada entre vários executivos, é
preciso um backend.

---

## 1 · A régua de alçada

A alçada sai de uma sequência, nesta ordem — a primeira condição verdadeira
decide:

| # | Pergunta | Alçada |
|---|---|---|
| 1 | A marca é grau **A (âncora)** ou **B (alavancadora de posicionamento)**? | **Diretoria de Operações** |
| 2 | O **desconto** é maior que o máximo (50%)? | **Diretoria de Operações** |
| 3 | A marca é **local (1 praça)**? | **Superintendente** |
| 4 | Tem **2 a 4 praças**, todas **dentro do portfólio** do Diretor? | **Diretor de Portfólio** |
| 5 | Mais de 4 praças **ou** alguma loja fora do portfólio | **Diretoria de Operações** |

Cláusulas de **Compliance** (Anticorrupção, PEP, LGPD, Confidencialidade e
Proteção de Dados do sistema) são **limite duro**: inegociáveis, não entram na
balança econômica e vão à Diretoria/Jurídico.

**A trava do Diretor.** O Diretor de Portfólio só decide marcas 100% dentro do
seu portfólio e com até `max_pracas` praças. Uma loja fora, ou a 5ª praça, leva
o caso à Diretoria de Operações — é o que impede que uma concessão a marca de
rede vire precedente sistêmico decidido localmente.

**O status do guia** (🟢 Recomendado · 🟡 com Ressalvas · 🔴 Não Recomendado,
por segmento) **não muda a alçada**: vira o veredito ("aprovar", "aprovar com
ressalva", "exceção — requer business case").

---

## 2 · Desconto e custo da concessão

Para as cláusulas quantitativas, os valores da cláusula geram o desconto e o
custo — **por loja**, multiplicado pelo **nº de praças** para o total:

| Cláusula | Campos | Custo por loja | Desconto |
|---|---|---|---|
| Taxa de transferência (isenção/redução) | aluguel mensal · taxa padrão e negociada (em nº de aluguéis) | `(padrão − negociada) × aluguel` | `(padrão − negociada) ÷ padrão` |
| Reajuste — índice | reajuste padrão e negociado (% a.a.) · meses | `aluguel × Δ% × meses` | `Δ% ÷ padrão` |
| Reajuste — prazo | reajuste anual (%) · meses de postergação | `aluguel × % × meses` | informado (opcional) |
| Multa rescisória (alteração/redução/isenção) | multa padrão e negociada (em aluguéis) · prob. de rescisão | `(padrão − negociada) × aluguel × P` | `(padrão − negociada) ÷ padrão` |

`custo total = custo por loja × nº de praças`. Também sai o custo como % do
aluguel anual. Para os demais tipos, o executivo informa o **desconto (%)**
diretamente — é ele que a régua compara com o máximo das alçadas delegadas.

### Checagens (antes de registrar)

Nada bloqueia; o que fica passa marcado: cláusula de Compliance (inegociável),
marca fora do cadastro (grau assumido como Padrão), desconto acima do máximo
(sobe à Diretoria), loja fora do portfólio (trava), desconto não informado,
custo não calculado (faltou aluguel ou valores), tipo "Não Recomendado" para o
segmento (exceção), solicitante em branco.

---

## 3 · Pipeline de aprovação

| Status | Significado |
|---|---|
| **Aguardando** | esperando a decisão da alçada atual |
| **Aprovada** / **Aprovada com ajuste** | concedida (com ou sem condição) |
| **Negada** | recusada |
| **Devolvida** | voltou ao solicitante para completar |

Toda decisão exige **decisor** e **justificativa** — é a justificativa que
vira precedente. **Escalar** sobe a solicitação para a próxima alçada (e a
alçada máxima não escala). Uma solicitação decidida pode ser **reaberta**
(volta a aguardar) e tudo fica na trilha. Pendente sem atualização há mais de
`dias_parado` (7) ganha a etiqueta "sem atualização há N dias" e o filtro
"Parados há +7 dias".

**Excel (CSV)** sai com separador `;` (o que o Excel em português usa), uma
solicitação por linha, com alçada original e atual, última decisão, decisor,
justificativa e datas. **Backup** leva solicitações, trilha, parametrização,
marcas e portfólios; **Importar** substitui tudo, com sanitização.

---

## 4 · Trilha de auditoria

Cada evento — solicitação criada, decisão, escalada, reabertura, exclusão,
mudança de regra, marca, exceção, importação — entra na trilha com data/hora,
solicitação, marca, cláusula, alçada, decisor, justificativa e um **hash
encadeado**: o hash de cada evento inclui o hash do anterior.

**Verificar integridade** recalcula a cadeia inteira. Se algum evento foi
alterado ou removido fora da ferramenta (editando o `localStorage` ou um backup
importado com mudança), a verificação aponta **em qual evento** a cadeia
quebrou. É verificação de integridade local, não prova criptográfica: para
auditoria formal, exporte a trilha (CSV) periodicamente para um lugar que o
navegador não controle.

**Precedentes.** Busca por marca ou cláusula nas decisões já tomadas, com
alçada, desconto, custo, decisor e justificativa — a resposta a "já aprovamos
isso antes?".

**Indicadores.** Solicitações, pendentes, decididas, % aprovadas, custo
concedido (soma do custo total das aprovadas), tempo médio entre criação e
decisão, eventos na trilha e integridade; mais o quadro por alçada.

**Relatório de auditoria** (hoje · 7 · 30 dias · tudo): resumo, decisões do
período com justificativa, pendências por alçada com dias parados, escaladas e
o estado da integridade. Copiar, baixar `.txt` ou WhatsApp — acima de 3.000
caracteres o botão do WhatsApp avisa em vez de mandar meio relatório.

---

## 5 · Parametrização

| O que | Onde | Padrão |
|---|---|---|
| Desconto máximo das alçadas delegadas | Regras de alçada | 50% |
| Máx. de praças do Diretor de Portfólio | Regras de alçada | 4 |
| Dias sem atualização para "parado" | Regras de alçada | 7 |
| Graus: rótulo, critério, "só Diretoria" | Graus estratégicos | A Âncora · B Alavancadora de posicionamento · Padrão; A e B → Diretoria |
| Marcas: segmento, grau, nº de praças | Marcas | 4 exemplos |
| Portfólios dos Diretores | Portfólios | 1 exemplo |
| Exceções de status por segmento | Biblioteca | Serviços Financeiros · Cinema |

Mudanças de regra, marca e exceção entram na trilha de auditoria. **Restaurar
padrão** volta as regras (as marcas ficam).

---

## Como personalizar

Tudo em um arquivo. Para pedir mudanças precisas, cite estes pontos de
`public/clausulas.html`:

| Quero mudar… | Onde |
|---|---|
| Os 32 tipos de cláusula (tema, classe, peso, risco, status-padrão) | array `CLAUSULAS` |
| Quais tipos têm custo quantitativo e qual fórmula | mapa `KIND` e `custoPorLojaRS()` / `descontoPct()` |
| Ramos e segmentos | `RAMOS` |
| Regras e graus padrão | `DEFAULT_PARAMS` |
| **A régua de alçada** | `alcadaRule()` |
| Checagens | `checagens()` |
| Status do pipeline e cores | `STATUS` e as classes `.st-*` |
| Texto do dossiê | `dossieTexto()` |
| Relatório de auditoria | `relatorioTexto()` |
| Hash da trilha | `hashEvento()` (FNV-1a duplo) |

## Testes

A lógica é validada sem navegador: `node scripts/test-clausulas.mjs` carrega
o script da página (sem o bloco de inicialização) e confere cada ramo da
régua, desconto e custo, decisões e escalada, a detecção de adulteração e
remoção na trilha, e o codec `RC1:`/`RC1D:` com texto quebrado em volta. O
mesmo conjunto de casos existe no motor Python (`sistema/motor/test_engine.py`).

## Publicação — link para o executivo

O arquivo vive em **`public/clausulas.html`** e é uma das ferramentas públicas
liberadas pelo `middleware.ts` (ver [[ACESSO-E-PROTECAO|Acesso e proteção]]).
Ao chegar na branch de produção (`main`):

```
https://radarbazin1.vercel.app/clausulas.html
```

Abre em qualquer navegador/celular, sem login. O link do aprovador é o mesmo
endereço com `#aprovador`. Tem **ícone e manifest próprios**
(`clausulas-icon-*.png`, `clausulas.webmanifest`): em "Adicionar à Tela de
Início" vira app com o nome "Radar Cláusulas".

## Fontes e ressalvas

Os tipos de cláusula e o status-padrão por segmento vêm do **Guia de
Negociação de Cláusulas** da ALLOS; a régua de alçada (grau, desconto, praças,
portfólio) é a definida pela Diretoria no projeto Copiloto de Decisão de
Cláusulas. Os parâmetros (50%, 4 praças) são calibráveis.

> ⚠️ A ferramenta é apoio à decisão — **quem aprova é sempre a alçada
> indicada**. Compliance é inegociável. Confirme com o Jurídico antes de
> alterar a minuta.

## Relacionadas

- [[RADAR-VAREJO|Radar de Varejo]] — a ferramenta de origem da família
- [[ACESSO-E-PROTECAO|Acesso e proteção do domínio]] — por que a ferramenta é pública e o app não
- `sistema/` — motor Python, console e instruções para o Projeto no Claude
- `obsidian/` — vault com o racional completo (régua, custo, graus, decisões)
