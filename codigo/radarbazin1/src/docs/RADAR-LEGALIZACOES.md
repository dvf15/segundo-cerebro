---
title: Radar de Legalizações Promo — Sorteios e Compre e Ganhe na SPA/MF
aliases:
  - Radar de Legalizações
  - Radar de Legalizações Promo
  - Legalização de Promoções
tags:
  - shopping-inteligente
  - promocao-comercial
  - spa-mf
  - scpc
  - prestacao-de-contas
  - ferramenta
created: 2026-11-19
updated: 2026-11-19
status: ativo
---

# Radar de Legalizações Promo — Sorteios e Compre e Ganhe na SPA/MF

Ferramenta de quem conduz a **legalização das promoções do shopping** — sorteio,
compre e ganhe, vale-brinde e concurso — na Secretaria de Prêmios e Apostas do
Ministério da Fazenda. A partir das datas da promoção, monta o cronograma legal,
acompanha a captação dos documentos, a revisão do regulamento e a prestação de
contas, e avisa o shopping antes de cada prazo.

> Arquivo único, sem build, sem dependências: **`public/legalizacoes.html`**.
> Como está em `public/`, a Vercel serve em **`/legalizacoes.html`** do domínio
> do projeto após o merge na branch de produção.

## Base legal

- Lei nº 5.768/1971 e Decreto nº 70.951/1972.
- Portaria SEAE/ME nº 7.638/2022 — pedido, documentos, prazos e prestação de
  contas. É dela que saem todos os prazos calculados.
- Portaria SPA/MF nº 1.818/2026 — regime sancionador.

## Estrutura

1. **Painel** — prazos vencidos e os que vencem em 7, 30 e 60 dias, de todas as
   promoções, com filtro por shopping; e a lista de promoções com a situação e
   o andamento dos documentos.
2. **Dossiê da promoção**, em cinco abas:
   - **Cronograma** — cada prazo com data, artigo e marcação de feito.
   - **Documentos** — a lista do art. 18 e Anexo I, com status, link do arquivo
     e validade das certidões. Muda se a promoção é coletiva (shopping como
     mandatária das lojas) ou feita por procurador.
   - **Regulamento** — pontos de revisão do plano de distribuição de prêmios
     (Anexo II), filtrados pela modalidade.
   - **Prestação de contas** — art. 48 (vale-brinde) ou art. 49 (demais).
   - **Dados** — datas, modalidade, protocolo, certificado e responsável.
3. **Base legal** — resumo das regras com os links das normas e o parâmetro de
   antecedência interna da captação.
4. **Backup** — exportar e importar JSON, exportar os prazos para agenda
   (`.ics`, com alarme sete dias antes) e o **aviso ao shopping** pronto para
   copiar.

## Prazos calculados

| Etapa | Prazo | Portaria 7.638/2022 |
|---|---|---|
| Protocolo no SCPC | de 120 a 40 dias antes do início | art. 20 |
| Decisão da SPA | até 30 dias, suspensos durante exigência | art. 20, §§ 2º e 4º |
| Propriedade dos prêmios | até 8 dias antes da apuração; antes do início no vale-brinde | arts. 49 e 50 |
| Banco de participantes no SCPC | antes da extração (sorteio) | Anexo II, XXII |
| IR de 20%, DARF 0916 | 3º dia útil após o decêndio da apuração | art. 49, IV |
| Divulgação e entrega | 30 dias após a apuração | arts. 14 e 66 |
| Prescrição | 180 dias | art. 64 |
| Prestação de contas | 30 dias após a prescrição | art. 47 |
| DARF 0394 dos prêmios prescritos | 45 dias após a prescrição | art. 64 |

Situação de cada prazo: **vencido**, **crítico** (até 7 dias), **atenção** (até
30 dias) ou **no prazo**.

## Limites conhecidos

- Persistência em `localStorage`, por navegador. Use **Backup** para levar a
  carteira entre pessoas e dispositivos. A ferramenta guarda o **link** de cada
  documento, não o arquivo.
- O prazo do IR conta dias úteis de segunda a sexta e **não considera feriados**.
- A criticidade alta ou média dos pontos do regulamento é classificação da
  ferramenta, para ordenar a revisão. Não vem da norma.
- "Iniciar captação de documentos" é marco de gestão, ajustável na aba Base
  legal. Não é prazo legal.
- Ficam fora: o valor da taxa de fiscalização (Anexo I da MP 2.158-35/2001) e o
  limite de premiação sobre a receita operacional (Decreto 70.951, art. 3º).
- O enquadramento do compre e ganhe (concurso ou vale-brinde, art. 2º, III e
  IV) deve ser confirmado com a SPA antes do protocolo.
- As duas promoções que aparecem no primeiro acesso são exemplos fictícios,
  marcados como tal, com botão para remover.

## Ao publicar

A página precisa constar nas duas listas de `middleware.ts` (a de `PUBLICO` e a
do `matcher`) para ser servida sem senha — ver [[ACESSO-E-PROTECAO]].
