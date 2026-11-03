---
title: "claude/acompanhamento-financeiro-obra.md"
date: 2026-09-29
source: "claude-project-doc"
source_id: "82cf8f4b-1713-48e8-a16e-c4dc39bc5fcb"
project: "Obra Casa 4"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/acompanhamento-financeiro-obra.md

# Acompanhamento Financeiro — Obra Casa 4 Palm Hill
Atualizado até **30/10/2026** (conciliação de 30/10; cópia HTML na pasta e Excel sincronizados; artefato desktop segue na versão de 15/08 — ferramenta indisponível). Fontes: orçamento R01 (02/04/26), comprovantes OneDrive, cronograma **Rev.04A** + aditivo Fratelli (docs `claude/fluxo-fratelli-rev04A.md`, `claude/resposta-fratelli-22-10.md`, `claude/aditivo-regua-staccato.md`, `claude/linha-do-tempo-obra.md`). Último arquivo conciliado: 20261027_215148200_iOS.png (mtime 1793138034000).

**Infra**: scripts geradores salvos neste projeto (`claude/build_dashboard.py`, `claude/build_xlsx.py`) — em caso de container reciclado, baixar do projeto com project_read e recriar com Write (aconteceu em 29/08, 26/09 e 30/10). Fluxo do "atualize": listar pasta 2026 → stage/ler novos (mtime > última conciliação) → editar scripts → rodar + recalc.py (skill xlsx; 0 erros) → SendUserFile → device_commit_files do HTML (force=true) → atualizar este doc + reenviar scripts ao projeto (local_path dentro de /home/claude). Ao mudar `prog` no painel, refletir os totais mensais na `meses_fc` do Excel (imprimir `sum(prog[m])`; o último mês "FECHA"). Marcador "hoje" do gantt = `HOJE` (6,97 = 30/10). Rateio dos acabamentos não contratados: out 20 / nov 20 / dez 10 / jan 25 / fev 20 / mar 5 %.
**Pastas**: comprovantes em `...\Obra\Comprov Pagto Obra\2026` (conectada). Existe também `...\Obra\orçamento` (propostas/contratos; acesso só na sessão de 29/09 — pedir de novo com device_request_folder_access se preciso). Nomes com "Ç" podem estar em NFD.

## Custo total da obra
| | Valor |
|---|---|
| Desembolsado até hoje (com comprovante) | **R$ 1.101.184,90** |
| Comprometido (pago + faturado/parcelado) | R$ 1.135.439,78 |
| Projeção de custo total (orçamento R01 + não orçados) | **R$ 1.546.161,49** |
| Projeção ajustada pelos contratos | **R$ 1.530.263,48** (−R$ 15.898,01) |
| % executado (pago ÷ ajustada) | **71,96%** |
| Falta desembolsar (ajustada − pago) | **R$ 429.078,58** |

## Resumo — escopo da proposta civil
| | Valor |
|---|---|
| Orçamento proposta civil (R01) | **R$ 1.485.436,99** |
| Pago com comprovante | **R$ 1.047.960,40** (70,5%) |
| Faturado/parcelado a confirmar | R$ 26.754,88 |
| Falta pagar (vs. base contratada/orçada) | **R$ 410.721,71** |

## Novidades (14–30/10)
- **Piso Piso Arte — restauração do piso de madeira, escada e adequações do deck (NFS-e 319)**: contratado **R$ 24.730** (orçado 28.845,96 → −4.115,96 na projeção). Pago em 27/10: **R$ 23.900 no cartão 4×** + **R$ 830 via SumUp** (complemento, pois a cobrança anterior saiu errada). Confirmado pelo Daniel em 30/10. ⚠ A divisão 23.900 + 830 é **inferida** (não há comprovante da cobrança 4× na pasta). Item saiu de "não iniciado".
- **Staccato**: 4º boleto (32.660, 28/08) lançado como **pago** por confirmação do Daniel (23/10), sem comprovante na pasta. Pago 130.640/130.640. ⚠ Pedidos somam 163.300 (5×32.660) — diferença de 32.660 a conferir (possível boleto de 28/05 faltando).
- **Aditivo Fratelli / Rev.04A**: parc. 7 da reforma → **fev/27** e parc. 8 → **mar/27**; mudança em **mar/27**; marcenaria instala jan–fev; marmoraria out–nov. Aditivo **ainda não assinado** (extensão da data de perdão por atraso da Staccato em aberto). Linha do tempo estendida até mar/27 no painel.
- Sem outros desembolsos novos conciliados. Casa de máquinas: NF-e 2599 (tampão) e 2705 (bomba) arquivadas.

## Novidades anteriores (06–13/10)
- Fratelli gerenciamento parc. 6 = 3.925,23 (06/10); LED do marceneiro 1.707,70 (Cielo 6×, 06/10 — classificado em Iluminação); bomba Eberle 1.255 (C6 4×, 13/10; proposta 17728) na casa de máquinas; Hidrauli aquecimento 5.895 em 8× (NF-e 2220 + NFS-e 697).
## Novidades (26–29/09)
- Fratelli reforma parc. 6 (28/09, 45.388,36); Telhanorte confirmado (9.687,68 em 8×); Bracci Getnet 6× de 3.943,36; Yamamura 1.882,10 (Visa 1.017,91 + vale-crédito 864,19). Pasta `orçamento`: Hidrauli 16377 = 35.000 em 10× (infra elétrica do quadro até a casa de máquinas fica por conta do cliente). Alucustom: contrato de 28/05 prevê 62.000 + 9.500 (5ª parc. em 20/09) — os 9.500 **não estão na projeção**.

## Cronograma Rev.04A (adotado, aproximado no painel)
Deck/piso de madeira concluídos; marmoraria set–início nov (5–8,1 na escala do gantt); marcenaria produz até dez (recesso ~8,5–9,0) e instala jan–fev; acabamentos fev; limpezas e **mudança mar/27**.

## Curva S (% = pago ÷ 1.530.263,48)
Acumulados reais: abr 187.904,50 · mai 440.750,13 · jun 617.935,59 · jul 797.073,75 · ago 999.819,11 · set 1.069.566,97 · out (30/10) 1.101.184,90. Projeção acumulada: out 1.227.644,58 (80,2%) → nov 1.280.605,12 (83,7%) → dez 1.310.074,75 (85,6%) → jan 1.374.780,75 (89,8%) → fev 1.473.129,65 (96,3%) → **mar/27 1.530.263,48 (100%)**.

## Fluxo_Caixa (Excel)
Previsto por mês (soma do `prog` do painel): out/26 126.459,68 (+ realizado 31.617,93) · nov 52.960,54 · dez 29.469,63 · jan/27 64.706,00 · fev 98.348,90 · **mar/27 fecha em 57.133,83**. Conferências zeradas; recalc: 691 fórmulas, 0 erros.

## Cartões (fluxo de fatura, por vir: R$ 156.501,66)
set 28.383,71 · out 27.330,12 · nov 30.847,38 · dez 28.638,63 · jan 24.695,56 · fev 13.055,20 · mar 3.266,45 · abr 284,62. Premissa mantida: faturas pagas só até ago/26 (set e out ainda aparecem como "por vir" — confirmar). Novo: Piso Piso 4× de 5.975 (nov→fev; divisão inferida).

## Situação por contrato (principais)
- **Unimóveis**: 276.000/320.000; **parc. 5 (44.000) venceu ~21/09 — CONFIRMAR**. Instala jan–fev/27.
- **Fratelli reforma**: parc. 1–6 pagas (272.330,16; NF-06 pendente); faltam parc. 7 (fev/27) e 8 (mar/27) = 90.776,70 (aditivo não assinado).
- **Gerenciamento**: 68.862,59 (parc. 1–6; NFs das parc. 5 e 6 pendentes); saldo 29.893,60 (estendido até a entrega).
- **Staccato**: 130.640/130.640 pago (4º boleto por confirmação do Daniel); ver diferença de 32.660 vs pedidos.
- **Alucustom**: parc. 1–3 (48.568); **parc. 4 (13.432, venceu 20/08) — CONFIRMAR**; possível +9.500.
- **Piso Piso (restauração)**: 24.730/24.730 pago. **Deck**: 38.485 pago.
- **Porcelanatos**: 38.852,03 — estourado +5.165,49. **Iluminação**: 11.152,24 (Yamamura 23.636 em análise → estouraria ~5.912). **Louças/metais**: 30.301,02 + Leroy 3.289,88 a confirmar. **Acab. elétricos**: 7.518,86 (+1.518,86). **Serralheria Márcio**: 16.604,50.
- **Casa de máquinas** (38.920), Deck, TJK, Moralez, PS: concluídos/contratados pagos. **Aquecimento**: 5.895 em 8×. **Caixa de Fogo**: 8.272/36.012. **Ar-cond**: BHP 5× até set.

## Não iniciado — R$ 149.794,65
Omissos 66.032, cortinas 23.468, box 16.000, limpeza fina 12.000, marcenaria à parte 9.300, corrimão 5.700, piso academia 5.583 (Aubicon ~2.930 em análise), serralheria interface 4.500, intertravado 3.212, instalação equipamentos 2.500, varal 1.500.

## Agenda
- **Vencidos a confirmar (R$ 57.432)**: Alucustom 13.432 (20/08) + Unimóveis 44.000 (~21/09) — **+ possível Alucustom 9.500 (20/09)**
- **Out/26–Mar/27 (aditivo Fratelli + Rev.04A)**: Fratelli parc. 7 (fev) 45.388,36 e parc. 8 (mar) 45.388,36, gerenciamento 29.893,60, louças 16.067,14, Márcio 5.395,50, não contratados 149.794,65

## Pendências para o Daniel
1. **Staccato**: pedidos 163.300 (5×32.660) × contratado/pago 130.640 — falta um boleto de 32.660 (28/05?) ou o contrato é de 4 parcelas? · comprovante do 4º boleto (28/08).
2. **Alucustom parc. 4 (venceu 20/08)** — comprovante · **Unimóveis parc. 5 (44.000, ~21/09)** — comprovante.
3. **Alucustom — R$ 9.500 extra (parc. 5 em 20/09)**: é adicional real? Já pago? (+9.500 na projeção)
4. **Piso Piso**: confirmar a divisão 23.900 (cartão 4×) + 830 (SumUp) e enviar o comprovante da cobrança no cartão.
5. **Aditivo Fratelli**: assinatura e extensão da data de perdão por atraso da Staccato (em aberto).
6. **NFs Fratelli pendentes**: gerenciamento parc. 5 (13.636,10) e 6 (3.925,23), reforma parc. 6 (45.388,36).
7. **Gerenciamento parc. 6 = 3.925,23** (bem menor que as anteriores): parcela cheia ou parcial? E quanto de gerenciamento além de fev/27 (entrega agora mar/27)?
8. **Vale-crédito Yamamura 864,19** — origem? · orçamento Yamamura 23.636: fechar? (estouraria iluminação ~5.912)
9. Leroy 3.289,88 — aprovação · Portobello Gabriel × Telhanorte (substituiu ou somou?) · NF-e Schneider/ML 884,58 · Telhanorte +346,76 vs cupom · infra elétrica do quadro até a casa de máquinas (por conta do cliente) — está na Fratelli/omissos?
10. **Bomba Eberle 1.255** (adicional ou troca da proposta 16377?) · **LED do marceneiro 1.707,70**: fornecedor e classificação (Iluminação como está, ou extra da marcenaria).
11. **Faturas de cartão**: confirmar set e out pagas para zerar o "por vir".
12. Pedido Hidrauli aquecimento: 57035 ou 57045 (NF-e mostra 57045).

## Observações
Artefato desktop desatualizado (15/08); pasta e chat em dia (30/10).

