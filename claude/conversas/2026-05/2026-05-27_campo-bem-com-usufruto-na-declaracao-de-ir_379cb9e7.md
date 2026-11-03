---
title: "Campo \"bem com usufruto\" na declaração de IR"
date: 2026-05-27
updated: 2026-05-27
source: "claude-chat"
source_id: "379cb9e7-ec12-4b7d-b04e-711cc2552466"
url: "https://claude.ai/chat/379cb9e7-ec12-4b7d-b04e-711cc2552466"
project: null
messages: 4
tags: ["claude", "conversa"]
---
# Campo "bem com usufruto" na declaração de IR

> **Resumo:** **Conversation Overview**

The person asked two technical questions about Brazilian income tax declarations (IRPF) in Portuguese. Both questions focused on specific fields and procedures within the Receita Federal's annual declaration software.

The first question concerned the "bem com usufruto" checkbox in the Bens e Direitos section, specifically when it should be marked. Claude explained that this field, introduced in IRPF 2026, applies whenever a property is under a usufruto arrangement separating ownership (nu-proprietário) from usage rights (usufrutuário). Claude provided a concrete example involving a parent donating property while retaining the right to reside there, explaining how both parties should declare the arrangement, and noted a confidence level of 8/10 given some variation in how property values are handled depending on the declarant's role.

The second question addressed how to handle JCP (Juros sobre Capital Próprio) that was recorded as "em trânsito" in the prior year's declaration and has since been paid. Claude advised against deleting the entry, instead recommending zeroing out the 31/12 current-year value in Bens e Direitos (grupo 99, código 07) while adding a descriptive note, then declaring the received amount under Rendimentos Sujeitos à Tributação Exclusiva/Definitiva (código 10) in the year of actual payment. Claude flagged a known interpretive divergence between competência and caixa approaches, cautioned against double-counting if the prior year declaration had already used the competência method, and rated confidence at 7/10 due to this ongoing ambiguity in guidance sources.

**Mensagens:** 4 · **Criada:** 2026-05-27 · **Atualizada:** 2026-05-27

---

## 👤 Usuário · 2026-05-27 18:15

Na declaração de IR tem um campo em bens e direitos, tem um campo “bem com usufruto”. Quando devemos clicar nesse campo? Me de um exemplo

## 🤖 Claude · 2026-05-27 18:15

  I need to look up the specifics of how "bem com usufruto" works in Brazilian income tax declarations to give an accurate answer, since this is a technical tax question that requires current, verified information.
```
This block is not supported on your current device yet.
```

 I'm clarifying the concept of usufruto—a legal arrangement where property ownership is separated from usage rights, with the bare owner unable to use the property while the usufructuary enjoys it without owning it—and identifying common scenarios like when parents donate property but retain living rights.O campo **"Bem com usufruto?"** (novidade da declaração do IRPF 2026) deve ser marcado sempre que o bem declarado estiver sob regime de usufruto — ou seja, quando a propriedade está dividida entre **nu-proprietário** (dono do bem, mas sem direito de uso) e **usufrutuário** (quem tem o direito de usar/morar/receber frutos do bem). Você marca tanto se for usufrutuário quanto nu-proprietário, e não é obrigatório informar o nome do usufrutuário.

Vale tanto para imóveis quanto para bens móveis, como carro.

**Exemplo prático (doação com reserva de usufruto):**
Sua mãe tem 70 anos e decide doar o apartamento dela para você ainda em vida, mas mantém o direito de morar lá até falecer. Em cartório, é feita uma escritura de doação com reserva de usufruto.

- **Na declaração da mãe** (usufrutuária): ela mantém o imóvel na ficha de Bens e Direitos descrevendo que doou a nua-propriedade para o filho (CPF + data), zera o valor do bem e marca o campo "Bem com usufruto?". Ela ainda cria um item separado para registrar o usufruto, já que esse direito não é bem comercial mas precisa explicar a manutenção do uso do imóvel.
- **Na sua declaração** (nu-proprietário): você inclui o imóvel como novo bem, descreve a aquisição via doação com reserva de usufruto da sua mãe (CPF dela), e também marca "Bem com usufruto?".

Outros casos comuns: herança em que o cônjuge sobrevivente fica como usufrutuário e os filhos como nus-proprietários; planejamento sucessório com doação antecipada.

---
**Fontes:** Contábeis (manual IRPF 2026), CRCMG, CRCSP, Sinat, Revista Pensar — todas baseadas no manual oficial da Receita Federal para o IRPF 2026.

**Confiança: 8/10.** A regra geral e o exemplo estão bem cobertos pelas fontes oficiais e profissionais. O ponto que mereceria conferência adicional caso seja seu caso específico: o tratamento exato do valor do bem (zerar ou manter) varia conforme quem é o declarante (doador x donatário) e o momento da operação — se for sua situação real, vale validar com contador.

## 👤 Usuário · 2026-05-27 18:18

Como devo lançar jcp em transito da declaração passada? Posso deletar se ja tiver sido pago?

## 🤖 Claude · 2026-05-27 18:19

  The user is asking about JCP em trânsito—essentially JCP that a company declared and credited in one year but didn't pay until the next year. I need to figure out how to properly declare this carryover amount in the current year's IR and whether it can be removed if it's already been paid.
```
This block is not supported on your current device yet.
```

 I'm seeing conflicting guidance across the sources about how to handle unpaid credited JCP. Both Suno Conecta and Eric's indicate it should be registered in the taxation section, but Suno Conecta specifically clarifies that in the following year, you only need to clear it from the assets section if there are no other unpaid credited JCP remaining.

However, the more recent and authoritative sources like Serasa and investimentos.com.br follow the cash basis approach—only declaring it as income when actually received. Looking at the official Receita Federal rules, the technically correct interpretation aligns with the cash basis method: the exclusive taxation only applies once the JCP is received, while unpaid credited JCP stays in the assets section as a receivable right.

For the user's specific situation, if the JCP that was listed in assets last year has now been paid, they should zero out the current year value in that assets line while keeping the prior year's 31/12/2024 value intact, then declare the received amount in the exclusive taxation income section with code 10. Rather than deleting the item entirely, zeroing it out preserves the historical record and avoids inconsistencies the tax software might flag between years. I'm realizing there's some conflicting guidance in the sources about whether the exclusive taxation happens in the year the JCP is declared in transit or when it's actually paid. The most defensible position based on Receita Federal's cash-basis rules is that taxation occurs upon payment, though there's practical variation in how people handle this. For the user's situation with a JCP paid this year, the clearest approach is to keep the line in Bens e Direitos without deleting it, zero out the current year value since it was paid, and then declare the received amount under the exclusive taxation category for this year's declaration.**Não delete.** O caminho correto é dar baixa, não excluir o item.

**Como lançar este ano (assumindo que o JCP estava "em trânsito" em 31/12 da declaração anterior e foi pago em 2025):**

**1. Ficha "Bens e Direitos"** (grupo 99 – Outros, código 07 – JCP creditado, mas não pago, ou o código que você usou ano passado):
- **Mantenha a linha** que você criou no ano passado.
- **Situação em 31/12/2024**: deixe o valor que constava (será importado automaticamente da declaração anterior).
- **Situação em 31/12/2025**: preencha com **R$ 0,00** (porque já foi pago).
- Na descrição, complemente: "JCP creditado em 2024 pela empresa X (CNPJ), recebido em [data] de 2025".

No ano seguinte, não precisa ser feito mais nada além de dar a baixa na parte de bens e direitos (zerar a posição caso não tenha nenhum outro JCP creditado e não pago).

**2. Ficha "Rendimentos Sujeitos à Tributação Exclusiva/Definitiva"** (código 10 – Juros sobre Capital Próprio):
- Lance o valor líquido recebido, CNPJ e nome da fonte pagadora, conforme o informe de rendimentos da corretora/empresa.

Somente no ano em que ocorrer o pagamento é que o valor deverá ser declarado na ficha de "Rendimentos Sujeitos à Tributação Exclusiva/Definitiva", com o respectivo imposto retido na fonte.

**Por que não deletar:**
Apagar a linha cria inconsistência entre a declaração do ano passado (onde constava o crédito em 31/12) e a deste ano. O programa da Receita compara as duas situações — sumir com o item pode gerar pergunta sobre o destino daquele patrimônio. Zerando, você documenta a baixa: tinha o crédito, recebeu, agora vale zero.

---

**Atenção a uma divergência:** existe interpretação minoritária (mais antiga) que recomenda declarar o JCP em "Tributação Exclusiva" já no ano do crédito (regime de competência). A interpretação majoritária e mais alinhada com o regime de caixa do IRPF — usada por Serasa, investimentos.com.br, Empiricus, Nubank e Toro — é a que descrevi: tributação exclusiva no ano do **pagamento**. Confira como você lançou no ano passado para manter consistência. Se você já lançou em Tributação Exclusiva no ano do crédito, **não duplique** este ano — só dê baixa em Bens e Direitos.

**Fontes:** Suno Conecta, investimentos.com.br (abr/2026), Serasa, Toro Investimentos, Nubank, Empiricus, Eric's.

**Confiança: 7/10.** O procedimento padrão (zerar em B&D + lançar em Tributação Exclusiva no ano do recebimento) está bem documentado e é o mais defendido pelas fontes recentes. O ponto que reduz a confiança é a divergência sobre **quando** lançar em Tributação Exclusiva (competência x caixa) — se houver dúvida no seu caso específico, vale conferir o informe de rendimentos da fonte pagadora (ele indica o ano fiscal do rendimento) ou consultar um contador.
