---
title: "Retificadora do IR da Renata"
date: 2026-11-02
updated: 2026-11-02
source: "claude-chat"
source_id: "4934e1db-f790-4843-b5a9-6845c93c86d7"
url: "https://claude.ai/chat/4934e1db-f790-4843-b5a9-6845c93c86d7"
project: null
messages: 10
tags: ["claude", "conversa"]
---
# Retificadora do IR da Renata

**Mensagens:** 10 · **Criada:** 2026-11-02 · **Atualizada:** 2026-11-02

---

## 👤 Usuário · 2026-11-02 19:24

tive que fazer uma retificadora do IR pf da renata, ja paguei parciamente na declaracao anterior, como fazer para pagar somente o complementar?

- 📎 1793647354686_26421559867-IRPF-2026-2025-retif-imagem-declaracao.pdf
- 📎 1793647354689_26421559867-IRPF-2026-2025-origi-imagem-declaracao.pdf
- 📎 1793647457273_26421559867-IRPF-2026-2025-origi-darf1quota-new.pdf

## 🤖 Claude · 2026-11-02 19:27

Vou verificar a orientação oficial da Receita e as taxas vigentes antes de responder.
```
This block is not supported on your current device yet.
```

```
This block is not supported on your current device yet.
```



```
This block is not supported on your current device yet.
```

Paga-se só a diferença, e o caminho é emitir um DARF novo no Sicalc — não o DARF que o programa da retificadora gera.

**O que aconteceu nos números**

| | Original | Retificadora |
|---|---|---|
| Saldo a pagar (quota única) | R$ 5.390,02 (pago) | R$ 11.513,58 |
| **Diferença a recolher (principal)** | | **R$ 6.123,56** |

A diferença vem da inclusão dos aluguéis de jan–abr/2025 (a original só tinha mai–dez). A retificadora substitui integralmente a original, então a Receita enxerga uma quota única de R$ 11.513,58 com R$ 5.390,02 já alocados.

**Por que não usar o DARF do programa:** ele emite o valor cheio (R$ 11.513,58), porque não sabe do pagamento anterior. Se pagar, você duplica R$ 5.390,02 e só recupera via PER/DCOMP — lento.

**Como fazer (Sicalc Web)**

1. Acesse o Sicalc no portal da Receita (gov.br/receitafederal → Pagamentos → Emitir DARF / Sicalc) → "Preenchimento rápido" → Pessoa Física.
2. Código de receita 0211, período de apuração original (31/12/2025), valor principal = só a diferença; o Sicalc aplica juros e multa automaticamente. Preencha a data em que pretende pagar. Vencimento original: 29/05/2026.
3. Ele gera o DARF com código de barras/Pix já com os acréscimos até a data informada. Pague até essa data, senão precisa reemitir.

**Quanto vai dar (estimativa)**

A multa de mora é de 0,33% por dia de atraso, limitada a 20%; com 61 dias ou mais, aplica-se 20%. Como o vencimento foi 29/05, já está no teto. Os juros são a Selic acumulada mensalmente até o último dia do mês anterior ao do pagamento, mais 1% relativo ao mês do pagamento.

| Componente | Valor |
|---|---|
| Principal | 6.123,56 |
| Multa 20% | 1.224,71 |
| Juros (jun–out/2026 + 1%) ≈ 6,5–6,7% | ≈ 400–410 |
| **Total aproximado (pagando em novembro)** | **≈ R$ 7.750** |

A Selic de jun e jul/2026 foi 1,12% e 1,22%; ago e set derivo em 1,09% e 1,08% da tabela de outubro/2026 da Receita. A de outubro ainda não encontrei publicada — por isso a faixa. O Sicalc dará o número exato.

**Conferência no e-CAC**

Depois que a retificadora for processada (pode levar alguns dias), em e-CAC → Meu Imposto de Renda → extrato/pagamentos, a quota deve aparecer como "paga a menor" com o saldo devedor e opção de emitir DARF já descontando os R$ 5.390,02. Vale checar lá antes e depois de pagar: se sobrar algum resíduo de centavos por diferença de cálculo, é ali que aparece. Também confirme que o DARF de maio consta como alocado ao IRPF 2026.

**Ponto de atenção (não é o foco, mas convém saber):** os aluguéis de jan–abr entraram sem carnê-leão recolhido naqueles meses. A Receita pode lançar multa isolada sobre carnê-leão não pago, mesmo com o rendimento declarado na anual. Não tenho certeza de quão frequente isso é na prática — vale uma palavra com o contador da Renata.

**Confiança:** procedimento e diferença de R$ 6.123,56 → 9/10. Estimativa do total (≈ R$ 7.750) → 7/10, porque falta a Selic de outubro e pode haver pequena variação na forma como o Sicalc conta os dias. Ponto sobre carnê-leão → 6/10 (sinalizado).

Sources:
- [Fórum Contábeis – procedimento DARF retificadora via Sicalc](https://www.contabeis.com.br/forum/tributos-federais/255406/irpf-retificadora-procedimento-darf/)
- [Diário Fiscal – Selic RFB mensal 2026 e regra da multa de mora](https://diariofiscal.com.br/selic__rfb_.html)
- [Portal do RI – Tabela de acréscimos legais vigência outubro/2026 (fonte: Receita Federal)](https://portaldori.com.br/2026/10/06/receita-federal-divulga-tabela-para-recolhimento-de-debitos-federais-em-atraso-vigencia-outubro-2026/)
- [CNB-SP – Regra de juros de mora (Selic acumulada + 1%)](https://cnbsp.org.br/?p=62713)

## 👤 Usuário · 2026-11-02 19:31

o codigo 0211 esta aparecendo como saida definitiva do pais

- 📎 1793647909404_image.png

## 🤖 Claude · 2026-11-02 19:32

Está certo — é o código correto. O nome completo da receita 0211 é "IRPF – Declaração de Ajuste Anual, Declaração de Saída Definitiva do País e Declaração Final de Espólio": os três tipos de declaração usam o mesmo código, e a lista só cortou o texto. "AN" indica apuração anual.

As três linhas (01, 02, 03) são variações do mesmo código por período de vigência das regras. Para ano-calendário 2025, escolha a **03 – a partir de 01/01/2010**, que é a vigente.

Depois de selecionar, confira os campos que aparecem:

- **Período de apuração:** 2025 (se pedir data, 31/12/2025)
- **Quota:** única / 1ª, se o campo aparecer — o vencimento deve preencher sozinho como 29/05/2026; se vier outra data, algo foi marcado errado
- **Valor principal:** 6.123,56 (só a diferença)
- **Data de consolidação:** a data em que vai pagar

Adicione à tabela, confira multa (deve vir R$ 1.224,71, 20%) e juros, e então "Emitir Darf" ou "Pagar Online".

Confiança: 9/10 sobre o código/variação; 7/10 sobre os nomes exatos dos campos seguintes (vou pela lógica do Sicalc, não vejo a tela seguinte). Se aparecer algo diferente, me manda o print.

## 👤 Usuário · 2026-11-02 19:33

> 📎 image

- 📎 1793648027900_image.png

## 🤖 Claude · 2026-11-02 19:34

Esse detalhe importa: o quadro azul diz que a variação **03** é a de "DECLARAÇÃO DE SAÍDA DEFINITIVA DO PAÍS". Minha leitura (não tenho certeza absoluta, mas bate com o histórico das normas): as três variações do 0211 são os três tipos de declaração que usam o código — 01 = Ajuste Anual (regras desde 1995), 02 = Final de Espólio (prazo mudou em 2008), 03 = Saída Definitiva (regras de 2010). Reforça isso o fato de a tela não ter perguntado o número da quota, coisa que a Ajuste Anual tem.

Então: clique em **Retornar** (ou Limpar), digite 0211 de novo e escolha a **01 – a partir de 01/01/1995**. O quadro azul deve passar a dizer "DECLARAÇÃO DE AJUSTE ANUAL". Se aparecer campo de quota, informe 1 (única).

O resto você já preencheu certo:

- Data de consolidação 03/11/2026 — ok se pagar amanhã (hoje é feriado)
- Período de apuração 2025 — ok
- Número de referência — deixe em branco
- Vencimento 29/05/2026 — deve vir igual na variação 01; se vier outra data, me avise
- **Valor do principal: 6123,56** (o campo está em 0,00)

Depois **Calcular**: a multa de mora deve dar R$ 1.224,71 e os juros algo em torno de R$ 400. Aí **Emitir Darf** ou **Pagar Online**.

Se na prática a 01 e a 03 gerarem o mesmo vencimento e os mesmos acréscimos, o DARF final sai só com "0211" e a Receita aloca por CPF + código + período, então o risco é baixo de qualquer forma — mas use a 01 para ficar alinhado com o tipo de declaração.

Confiança: 7/10 no mapeamento das variações (inferência); 9/10 no restante do preenchimento.

## 👤 Usuário · 2026-11-02 19:38

nao e uma saida definitiva e apenas uma retificacao

## 🤖 Claude · 2026-11-02 19:38

Exato — e é por isso que a variação certa é a **01 (Ajuste Anual)**, não a 03 que você tinha selecionado.

Não existe código ou variação específica para "retificadora". A retificadora continua sendo uma Declaração de Ajuste Anual; o DARF é o mesmo da quota original (0211, PA 2025, vencimento 29/05/2026), só que agora com o valor da diferença (R$ 6.123,56) e os acréscimos. Então volte, escolha 0211 – 01, confirme no quadro azul que aparece "AJUSTE ANUAL", informe quota 1 se pedir, preencha o principal e calcule.

Confiança: 9/10.

## 👤 Usuário · 2026-11-02 19:39

> 📎 image

- 📎 1793648394198_image.png

## 🤖 Claude · 2026-11-02 19:39

Agora sim — o quadro azul confirma "DECLARAÇÃO DE AJUSTE ANUAL" e apareceram as quotas, como esperado.

Falta só:

1. Marcar **Quota Única (29/05/2026)**
2. **Valor da Quota:** 6123,56
3. **Calcular**

Confira na linha gerada: multa de mora R$ 1.224,71 (20%) e juros na faixa de R$ 400. Se bater, **Emitir Darf** ou **Pagar Online** — pagar até 03/11, que é a data de consolidação; depois disso o DARF perde validade e precisa reemitir com outra data.

Confiança: 9/10.
