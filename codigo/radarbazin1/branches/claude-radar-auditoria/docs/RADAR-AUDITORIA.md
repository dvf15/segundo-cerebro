---
title: Radar de Auditoria — Auditoria de Vendas de Lojistas
aliases:
  - Radar de Auditoria
  - Acelerador de Auditoria
  - Apurador Fiscal
  - Auditoria de Vendas
tags:
  - shopping-inteligente
  - auditoria
  - aluguel-percentual
  - triangulacao
  - taxa-de-transferencia
  - ferramenta
created: 2026-11-16
updated: 2026-11-16
status: ativo
---

# Radar de Auditoria — Auditoria de Vendas de Lojistas

Ferramenta do time de auditoria do shopping para conferir se a venda que o
lojista **declara** — e sobre a qual o aluguel percentual é cobrado — bate com o
que os outros registros da mesma venda mostram. Duas cadências que não se
misturam: a **triangulação**, que entra dia a dia ou semana a semana e fecha por
mês, e a **auditoria fiscal**, anual, que abre todo **1º de abril** com os livros
do ano anterior.

> Arquivo único, sem build: **`public/auditoria.html`**. Abra direto no
> navegador (duplo clique) **ou** acesse online — como está em `public/`, a
> Vercel serve em **`https://radarbazin1.vercel.app/auditoria.html`** após o
> merge na branch de produção. Tudo roda no navegador: nenhum arquivo fiscal sai
> do aparelho.

## Visual

Mesmo template e paleta do [[RADAR-VAREJO|Radar de Varejo]]: fundo areia
`#e5ded4`, verde-petróleo `#00616f`, texto `#0d454a`, cartões brancos
arredondados, abas em pílula com ícone e só tema claro. O ícone segue o dos
outros radares (fundo verde-petróleo, traço branco, detalhe verde-claro). As
cores vêm de `apurador-fiscal/icones/paleta.json` na fonte.

## De onde ela vem

- **Código-fonte:** repositório `radarbazin`, pasta `apurador-fiscal/` (módulos
  em `src/`, testes, simulação e vídeos). O `auditoria.html` daqui é **saída** do
  script `apurador-fiscal/scripts/exportar-radar.mjs` — para mudar a ferramenta,
  edite lá, rode `npm run build` e exporte de novo. Editar o HTML direto aqui faz
  as duas versões divergirem.
- **Nomes anteriores:** Apurador Fiscal (1.x), Acelerador de Auditoria e Radar
  de Dispersão de Vendas (2.0).

---

## Estrutura em abas

1. **Dashboard** — os três processos numa tela (auditoria fiscal,
   triangulação, societário), com gráficos e **pendências** de cada um.
2. **Painel** — o ciclo anual: quem entregou os livros, quem foi auditado,
   negociado e cobrado; marcos com data e valores.
3. **Lojistas** — a carteira do shopping (CNPJ, LUC, UF e início do contrato),
   importada por planilha; CNPJ com dígito errado é recusado.
4. **Notificações** — o fluxo mensal para quem não entregou: 1ª, 2ª e 3ª
   notificação, aviso de multa e o comando de enviar a multa. Texto pronto para
   e-mail ou WhatsApp.
5. **Societário** — mudança societária nos últimos 12 meses e **taxa de
   transferência** (TT): botão para a Junta Comercial da UF do contrato, o passo
   a passo da Certidão de Inteiro Teor, checklist por lojista, validação de
   isenção e limite contratual, e o mesmo fluxo de notificação da auditoria.
6. **Triangulação** — quatro tipos de lançamento da mesma venda: **redução Z**
   e **relatório de PDV** (só PDF ou foto), **NAPP** (planilha diária, pelo
   CNPJ ou pelo número da loja) e o **declarado** (ficha de vendas). O **maior
   valor** de cada mês e de cada dia fica em destaque, e o status sai da **maior
   variação em R$** entre eles (limites editáveis). Fecha o mês e cruza com a
   auditoria anual no **cruzamento final**.
7. **Auditoria fiscal** — os livros de Entradas e Saídas (PDF impresso, SPED
   EFD, resumo por CST/CFOP, extrato do Simples PGDAS-D ou planilha) contra a
   ficha de vendas informadas, por CNPJ e competência.
8. **Tabela de códigos** — o tratamento de cada CFOP (venda, devolução, fora da
   venda, revisão manual), editável.
9. **Como funciona** — a explicação completa e os vídeos de uso.

## Onde os dados ficam

No `localStorage` **deste navegador**: carteira, marcos, notificações,
fechamentos da triangulação e societário. Outro aparelho não vê o mesmo
acompanhamento — para passar entre pessoas, **Painel → Salvar cópia (JSON)** e
**Restaurar cópia** no outro aparelho. Os arquivos fiscais ficam só em memória:
fechou a aba, sumiram.

## Vídeos

Servidos ao lado da página e mostrados na aba **Como funciona**:

- `auditoria-passo-a-passo-celular.mp4` — passo a passo completo, vertical e
  narrado (~15 min);
- `auditoria-novidades.mp4` — só as mudanças mais recentes (~5 min).

## Base de teste

Em `public/exemplos/`:

- `auditoria-base-teste.json` (Painel → Restaurar cópia) e
  `auditoria-base-teste.xlsx` — 40 lojistas fictícios, 27 cenários fixos. O
  mesmo conteúdo sai do botão **Carregar base fictícia** da aba Lojistas, com a
  data do dia;
- `auditoria-roteiro-de-testes.md` — o que cada cenário deve mostrar e onde;
- `auditoria-simulacao/` — um arquivo de cada formato que a ferramenta lê
  (livros em PDF, SPED, resumo CST/CFOP, PGDAS-D, planilha; reduções Z em PDF e
  foto; PDV; NAPP; fichas) e o roteiro em Excel
  (`00-roteiro-de-simulacao.xlsx`).

Tudo fictício: empresas, CNPJs (com dígito válido) e valores.

## Acesso

Pública, como as demais ferramentas: `auditoria.html`, o manifest, os ícones e
os vídeos `auditoria-*.mp4` estão na lista `PUBLICO` do `middleware.ts` (ver
[[ACESSO-E-PROTECAO|Acesso e proteção]]). O OCR de foto é o único recurso que
usa a internet — baixa o `tesseract.js` do `cdn.jsdelivr.net`, liberado na
política de segurança da própria página; o resto funciona offline.

## Em desenvolvimento

Pedidos em andamento, nesta ordem: conferência do CNPJ do contrato contra a base
do **PB** (Societário), **Auditoria Contratual** (contrato × faturado/RDL,
reajuste, degraus, AMM e A%), a etapa de **receita** na auditoria fiscal
(dispersão de venda → dispersão de receita, pelo ponto de equilíbrio) e o
**dashboard por loja**.

## Fontes e ressalvas

> ⚠️ A ferramenta **aponta onde olhar**. Ela não prova que o livro reflete as
> vendas reais, não envia nada sozinha e **não substitui** a análise do contador
> nem a leitura do contrato de locação. Os endereços das Juntas Comerciais foram
> conferidos em fonte oficial em 14/10/2026 e podem mudar.

## Relacionadas

- [[RADAR-VAREJO|Radar de Varejo]] — o modelo de ferramenta em arquivo único que esta segue
- [[RADAR-CLAUSULAS|Radar de Cláusulas]]
- [[ACESSO-E-PROTECAO|Acesso e proteção]]
