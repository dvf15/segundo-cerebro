---
title: "Cálculo de imposto na venda de ações"
date: 2026-09-16
updated: 2026-09-16
source: "claude-chat"
source_id: "e3fc4014-5738-456b-9f67-0f4213f21241"
url: "https://claude.ai/chat/e3fc4014-5738-456b-9f67-0f4213f21241"
project: null
messages: 4
tags: ["claude", "conversa"]
---
# Cálculo de imposto na venda de ações

> **Resumo:** **Conversation Overview** The person is an investor holding shares of Allos (a Brazilian company) and sought help calculating the tax implications of a large share sale in Brazil. They indicated they work at Allos, which introduced a relevant regulatory consideration around trading windows. The conversation involved specific calculations using their cost basis and current market price to determine capital gains tax owed on a planned sale. Claude walked through the full tax calculation for selling shares at current market price, explaining that since the total sale value far exceeded the R$20,000 monthly exemption threshold, the entire gain would be taxed at 15% under Brazilian income tax rules. Claude detailed the net tax owed after deducting the withholding tax automatically retained by the broker, explained how to generate and pay the DARF (tax payment form) using code 6015 by the last business day of the following month, and noted how to update the asset declaration for remaining shares. Claude also flagged a compliance consideration under CVM Resolution 44, art. 14, regarding trading blackout periods applicable to company insiders, advising the person to verify with their compliance or investor relations team before executing the sale. In a follow-up question, the person asked about using the R$20,000 monthly exemption strategically in other months. Claude confirmed the exemption resets each calendar month with no annual cap, explained the limit applies to total sales across all brokers and all stocks in a given month, cautioned that exceeding the threshold in any month makes the entire month's gains taxable (not just the excess), and estimated how many months it would take to sell remaining shares tax-free. Claude noted that exempt gains must still be reported in the annual declaration under "Rendimentos Isentos e Não Tributáveis," and reiterated that the CVM blackout period and internal company policy apply to each monthly sale, not only the large transaction.

**Mensagens:** 4 · **Criada:** 2026-09-16 · **Atualizada:** 2026-09-16

---

## 👤 Usuário · 2026-09-16 14:42

Tenho 29628 acoes da allos compradas a um preco registrado no meu ir de 24,95. Hoje a cotação está em 28,54, se eu vender 720k na cotação de hoje, quanto vou pagar de imposto, me passe o racional e o que devo fazer para pagar esse imposto

## 🤖 Claude · 2026-09-16 14:43


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Imposto estimado: **R$ 13.585,28** (15% sobre o lucro). Descontando o IR retido na fonte pela corretora, o DARF fica em torno de **R$ 13.549**.

**Cálculo**

Não dá para vender fração de ação, então 720.000 ÷ 28,54 = 25.227,75, arredondado para **25.228 ações**.

```
Venda:  25.228 × 28,54 = R$ 720.007,12
Custo:  25.228 × 24,95 = R$ 629.438,60
Lucro:                   R$  90.568,52
IR 15%:                  R$  13.585,28
(–) IRRF 0,005%:         R$      36,00
DARF ≈                   R$  13.549,28
```

A lógica por trás disso:
- O imposto incide só sobre o lucro, não sobre o total vendido. Em operações comuns a alíquota é 15%, com isenção apenas se as vendas do mês não passarem de R$ 20 mil. Como você vai vender R$ 720 mil, não há isenção.
- A corretora retém automaticamente 0,005% do valor da venda como antecipação (o "dedo-duro"). Esse valor é abatido do DARF.
- A regra de 17,5%/18% não vale. A Câmara retirou a MP 1303 de pauta e ela perdeu a validade, então ações continuam em 15%.

**O que pode reduzir o valor**
- **Custos da operação:** corretagem e taxas da venda são descontadas do valor vendido no cálculo do lucro. Isso reduz um pouco o imposto.
- **Prejuízos anteriores em swing trade:** podem ser abatidos do lucro e não expiram, mas só dentro da mesma modalidade.
- **Outras vendas no mesmo mês:** entram na mesma apuração, com lucro ou prejuízo.

**Como pagar**
1. Gere o DARF no Sicalc, no site da Receita, ou pelo app da sua corretora. Use o código 6015.
2. Pague até o último dia útil do mês seguinte à venda. Vendendo em setembro, o prazo é **30/10/2026**, uma sexta-feira.
3. Na declaração de 2027, lance a apuração do mês na ficha de Renda Variável, informe o DARF pago e o IRRF. Em Bens e Direitos, mantenha as **4.400 ações** restantes a R$ 24,95, total de R$ 109.780,00. O custo médio não muda com a venda.

**Ponto de atenção antes de vender**
Como você trabalha na Allos, confira a política de negociação da empresa com o RI ou compliance. Pela Resolução CVM 44, art. 14, há um período vedado nos 15 dias anteriores à divulgação dos resultados trimestrais e anuais. Essa vedação é objetiva e vale mesmo sem acesso às informações. Não sei se seu cargo é estatutário nem a data do release do 3T26, então não consigo dizer se isso se aplica a você. Mesmo fora do período vedado, a política interna costuma alcançar funcionários.

**Confiança: 8/10.** As regras de alíquota, isenção, prazo e código estão bem documentadas. As incertezas são três: não sei se seus R$ 24,95 já incluem os custos de compra, não incluí os custos da venda por falta dos valores exatos, e não sei se a vedação da CVM se aplica ao seu cargo. Para um valor desse porte, vale validar com seu contador.

## 👤 Usuário · 2026-09-16 17:10

Como fica a venda de 20 mil isentos? Posso vender com isenção todos os outros meses do ano?

## 🤖 Claude · 2026-09-16 17:10


```
This block is not supported on your current device yet.
```

Sim. A isenção é **mensal e sem limite anual**. Em cada mês em que o total de ações vendidas ficar em até R$ 20 mil, o lucro é isento, e isso vale todo mês, inclusive seguindo para 2027. A lei fala em vendas de ações à vista na bolsa cujo valor, realizadas em cada mês, seja igual ou inferior a R$ 20.000,00.

**No mês da venda de R$ 720 mil não há isenção nenhuma.** Os primeiros R$ 20 mil não ficam isentos: vendas de ações à vista acima de R$ 20 mil no mês têm o ganho inteiramente tributado. Por isso o cálculo anterior aplicou 15% sobre todo o lucro.

**Nos outros meses, com as 4.400 ações restantes:**
- A R$ 28,54, o máximo é **700 ações por mês** (R$ 19.978). Com 701 ações você já passa de R$ 20 mil.
- Seriam cerca de 6 a 7 meses para zerar a posição.
- A economia é de uns **R$ 377 por mês** (lucro de 700 × R$ 3,59 = R$ 2.513, vezes 15%). É útil, mas pequena perto do imposto da venda grande.

**Cuidados**
- O limite é a soma das vendas, não o lucro. Conta o total do mês somando todas as corretoras e **todas as ações** que você vender, não só Allos ([Nord](https://www.nordinvestimentos.com.br/blog/imposto-renda-venda-de-acoes/)).
- A cotação muda. Vendendo perto do teto, uma oscilação pode passar de R$ 20 mil e tornar o mês inteiro tributável. Deixe uma folga.
- A isenção não vale para FIIs e ETFs ([Nord](https://www.nordinvestimentos.com.br/blog/imposto-renda-venda-de-acoes/)) nem para day trade, que é sempre tributado, independentemente do valor vendido no mês.
- Isento não significa dispensado de declarar. Esses ganhos vão na ficha "Rendimentos Isentos e Não Tributáveis" ([Suno](https://www.suno.com.br/guias/como-declarar-acoes-no-imposto-de-renda-2025/)).
- O período vedado da CVM e a política interna da Allos valem para cada venda mensal também, não só para a grande.

**Confiança: 9/10.** A regra está no texto da Lei 11.033/2004, art. 3º. A única conta que depende do mercado é o número de ações por mês, que varia com a cotação.
