---
title: "claude/resumo-atualizacao-2026.md"
date: 2026-09-29
source: "claude-project-doc"
source_id: "eda10bf9-41f0-4fd5-b5b2-48b65f477be0"
project: "Imposto de renda - ativar investimentos em imoveis"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/resumo-atualizacao-2026.md

# Atualização das planilhas Casa 4 e Ap. Av. Portugal — out/2026

## Operacional (fluxo estabilizado)
- Planilha da Casa 4 vive no OneDrive: `Imóveis\Casa4 Palm Hill\Valor Imovel Casa4 IR - atualizado 2026.xlsx`. Fluxo por rodada: stage do OneDrive → verificar integridade contra este doc → diff da pasta 2026 → atualizar → SendUserFile → commit de volta (guarda de mtime). Acessos `...\Imóveis` e `...\2026` concedidos.
- **Ap. Av. Portugal: planilha AINDA PERDIDA** (não está no OneDrive; Downloads negado). Daniel precisa anexar o arquivo de 14/08. Último estado: contrato 10183777607, 37 parcelas pagas + FGTS 129.294,56 (07/2024) e 217.354,71 (12/08/2026), quitação 09/2029, ativável conservador 761.271,32 / amplo 912.872,82.

## Situação da planilha Casa 4 (31/10/2026) — checkpoint p/ verificação de integridade
- **70 lançamentos (última linha 71; próxima vazia 72).** 2025: R$ 71.985,36 (ativável 59.560,86). 2026: R$ 1.194.800,85 (ativável R$ 1.115.052,46). Total: R$ 1.266.786,21 / ativável R$ 1.174.613,32. 26 riscos altos.
- Rodada 31/10: (a) linha 70 — PisoPiso NFS-e 319 (27/10) R$ 24.730, deck Cumaru + restauração piso/tacos/escada, 100%; proposta IMG_2662 = R$ 24.740 em 4x R$ 6.185 cartão; **comprovante do pagamento principal não localizado**; (b) linha 71 — SumUp PisoPiso 27/10 R$ 830 (X8FBDRFEQR), finalidade desconhecida, 0% para evitar dupla contagem; (c) linha 56 tampão Hidrauli → NF-e 2599 (risco baixo); (d) linha 69 bomba → NF-e 2705 (risco baixo). Arquivos "DANFE 2175 1", "2220 1", "NFS-e 633 1", "697 1" são reemissões/cópias de docs já lançados (linhas 20 e 26) — não relançar. Print 20261013_211450939 foi removido da pasta (duplicata).
- Rodadas anteriores: 14/10 — PIX Fratelli 06/10 R$ 3.925,23 (linha 67, 0% a identificar), link Cielo 06/10 R$ 1.707,70 (linha 68, 0% lojista a identificar), bomba (linha 69). 29/09 — Fratelli parcela 06 reforma (sem NFS-e); Telhanorte linha 28 (diferença R$ 346,76).
- Fornecedores: Fratelli R$ 356.192,75; Unimóveis R$ 276.000 (4/5 + sinal); Staccato R$ 113.260,51 (3/4); Alucustom R$ 48.568 (3/4); Itaú juros R$ 163.333,59; PisoPiso R$ 64.045 (38.485 + 24.730 + 830); Hidrauli R$ 44.815; ANDRA R$ 14.196,72; Yamamura R$ 1.882,10.

## Pendências
1. Ap. Portugal: reanexar planilha de 14/08.
2. PisoPiso: comprovante do pagamento da NFS-e 319 (4x R$ 6.185?) e finalidade do SumUp R$ 830 (linha 71).
3. Fratelli: NFS-e reforma parcela 06 (28/09) e gerenciamento parcela 05 (PIX 04/09); identificar PIX 06/10 R$ 3.925,23 (linha 67).
4. Cielo 06/10 R$ 1.707,70 (linha 68): identificar lojista e NF.
5. Unimóveis: parcela 5 (R$ 44.000) em aberto; recibos 3-4 / NFS-e.
6. Staccato 4ª (R$ 32.660) e Alucustom 4ª (R$ 13.432): comprovantes ausentes.
7. Financiamento Casa 4: parcelas desde 29/08 sem quebra de juros — pedir DDC novo.
8. ANDRA 17/09 (R$ 394,28) CPF de terceiro, 0%. ML 18/09 (R$ 884,58): NF-e + destino.
9. Yamamura: orçamento 6768637 (28/08) sem comprovante.
10. Sem NF/DANFE: Bracci, Telhanorte (+ R$ 346,76), churrasqueira, Franke, ML/Centro Encanador, DX Store, Leroy, Lino Ar, Italmex, pastilhas piscina, ANDRA 26/08 e 03/09, Marcio parcelas futuras.
11. Letícia Brito (2× R$ 1.050): não identificado, 0%.
12. Cód. 01430 nas NFs Fratelli; cód. 01236 nas NFs PisoPiso; pagamentos pela Renata; entregas fora da obra — contador.

