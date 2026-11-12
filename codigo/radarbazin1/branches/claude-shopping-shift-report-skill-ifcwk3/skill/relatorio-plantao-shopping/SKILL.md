---
name: relatorio-plantao-shopping
description: >-
  Use sempre que o assunto for o relatório de plantão de shopping (fim de
  semana/feriado): preencher o relatório de um shopping, gerar o fechamento
  de fluxo do estacionamento (comparativo com ano anterior e semana
  anterior), ou consolidar os relatórios de vários shoppings e rankear as
  melhores performances de fluxo, destaques de vendas, eventos e
  ocorrências do dia. Acione também quando o usuário mencionar "plantão",
  "relatório do domingo/sábado/feriado", "fechamento de fluxo",
  "consolidado dos shoppings" ou colar números de fluxo de
  pessoas/veículos/receita de estacionamento de um dia de operação.
---

# Relatório de Plantão de Shopping

Esta skill padroniza o **relatório de plantão** que cada shopping envia ao
final de um dia de operação (fim de semana, feriado ou evento) e permite que
a holding **consolide todos os shoppings** e rankeie as performances do dia.

Ela tem dois modos. Identifique qual usar pelo contexto:

1. **Modo Preenchimento** — um shopping (normalmente o gerente de marketing
   de plantão) quer gerar o seu relatório do dia. Ele fornece números brutos
   e observações; você devolve o relatório padronizado completo.
2. **Modo Consolidação** — a holding recebeu os relatórios de vários
   shoppings e quer o consolidado do dia com rankings e destaques.

O que torna a consolidação possível é que **todo relatório gerado no Modo
Preenchimento termina com um bloco de dados estruturado (JSON)**. Nunca
omita esse bloco: sem ele, o consolidador precisa "garimpar" números de
texto livre, o que é lento e sujeito a erro.

---

## Modo Preenchimento

### Passo 1 — Coletar os dados em uma única rodada

O objetivo é que o gerente preencha em **menos de 5 minutos**. Por isso,
não faça perguntas em série: envie **um único formulário** para ele
responder de uma vez (pode responder por cima, em qualquer ordem, ou colar
prints/planilhas do sistema do estacionamento — extraia os números de lá).

Formulário a enviar (adapte itens que já estejam na conversa):

```
IDENTIFICAÇÃO
- Shopping:
- Responsável (nome e cargo):
- Data do plantão:
- Clima (sol, nublado, chuva...):

FLUXO DO DIA (números brutos — as variações % eu calculo)
Para cada métrica, informe: valor de HOJE | mesmo dia da semana do ANO
ANTERIOR | mesmo dia da SEMANA ANTERIOR
- Fluxo de Pessoas:
- Fluxo de Veículos:
- Fluxo Pagante:
- Fluxo Valet:
- Ocupação Máxima (% e faixa de horário do pico):
- Receita do estacionamento (R$):
- Isenções App — CAT 1 / CAT 2 / CAT 3 (quantidades):
- Isenções App — $ CAT 1 / $ CAT 2 / $ CAT 3 (valores R$):

PERCEPÇÃO (use a escala: Excelente / Ótimo / Bom / Moderado / Fraco)
- Percepção de fluxo geral + comentário curto:
- Percepção de vendas + comentário curto:

DESTAQUES
- Lojas destaque (âncoras, satélites, cafeterias...):
- Gastronomia (restaurantes com serviço / praça de alimentação /
  cafeterias e gelaterias — como foi o movimento em cada grupo?):
- Entretenimento e lazer (cinema, parques, eventos — se evento com
  bilheteria, informe ingressos vendidos e faturamento):

EVENTOS
- Evento(s) no shopping:
- Evento(s) externo(s) relevante(s) na cidade:

OCORRÊNCIAS
- Alguma ocorrência com risco de imagem (SAC, brigada, segurança)?
  Se sim, descreva o que houve e como foi tratado.
```

Aceite dados parciais: se faltar um comparativo (ex.: shopping novo sem ano
anterior), gere o relatório mesmo assim e marque o campo como `null` no
JSON — nunca invente número. Se faltar algo essencial (fluxo de pessoas ou
veículos do dia), peça apenas o que falta.

**A escala de percepção é fixa** (Excelente / Ótimo / Bom / Moderado /
Fraco). Se o gerente usar outra palavra ("bombou", "fraquinho"), mapeie
para a escala e mantenha o comentário original — é essa padronização que
permite comparar shoppings entre si na consolidação.

### Passo 2 — Calcular as variações com o script

Não calcule porcentagens de cabeça. Grave os dados no JSON (esquema em
[`modelo-relatorio.md`](modelo-relatorio.md)) e rode:

```bash
python skill/relatorio-plantao-shopping/scripts/plantao.py fechamento <arquivo.json>
```

O script devolve as duas tabelas de fechamento prontas em markdown
(vs. ano anterior e vs. semana anterior), com as variações calculadas e
formatação brasileira (2.932 / R$ 87.651 / 71,84%). Datas de referência:
**ano anterior = mesmo dia da semana mais próximo no ano anterior** (ex.:
domingo 02/08/2026 compara com domingo 03/08/2025) e **semana anterior =
mesmo dia da semana, 7 dias antes**. O script deriva essas datas sozinho se
não forem informadas.

### Passo 3 — Montar o relatório final

Use exatamente a estrutura de [`modelo-relatorio.md`](modelo-relatorio.md)
(há um exemplo real preenchido lá). Ordem das seções:

1. Cabeçalho (shopping | responsável | data | clima)
2. Fluxo e Ocupação do Estacionamento (resumo em 1 frase com os principais %)
3. Percepção de fluxo / vendas
4. Lojas
5. Gastronomia (restaurantes com serviço / praça / cafeterias e gelaterias)
6. Entretenimento e Lazer (com bilheteria dos eventos, quando houver)
7. Ocorrências que gerem risco de imagem
8. Fechamento do fluxo (as duas tabelas do script)
9. Bloco de dados para consolidação (o JSON, dentro de um fence ```json)

Entregue o relatório inteiro em um único bloco copiável, pronto para o
gerente colar no e-mail/WhatsApp do grupo. O JSON vai junto, no final —
ele é pequeno e é o que permite à holding consolidar sem retrabalho.

---

## Modo Consolidação

Quando a holding colar/enviar os relatórios de vários shoppings do mesmo
dia:

1. **Extraia o bloco JSON** do final de cada relatório e salve um arquivo
   por shopping (ex.: `plantao/2026-08-02/plaza-niteroi.json`). Se algum
   shopping mandou relatório fora do padrão (sem JSON), monte o JSON você
   mesmo a partir do texto — e avise no consolidado que aquele shopping
   veio fora do padrão, para a holding cobrar o uso da skill.
2. **Rode o consolidador**:

   ```bash
   python skill/relatorio-plantao-shopping/scripts/plantao.py consolidar <dir-ou-arquivos.json>
   ```

   Ele gera, em markdown: totais do dia (todos os shoppings), **ranking de
   fluxo** (ordenado pela variação de fluxo de pessoas vs. ano anterior,
   com veículos, receita e ocupação lado a lado), quadro de percepções,
   eventos por shopping e ocorrências relevantes.
3. **Escreva a síntese executiva por cima do output do script** — o script
   dá os números; você dá a leitura. Abra o consolidado com 3-5 bullets:
   quem foi o destaque do dia e por quê (evento? clima? bilheteria?), quem
   caiu e qual a hipótese, e o que merece atenção (ocorrências, quedas
   recorrentes). Cite os destaques de vendas qualitativos (lojas/operações
   mais citadas entre os shoppings).

Critério de ranking: a ordenação principal é **variação de fluxo de
pessoas vs. ano anterior** (é a métrica que melhor captura performance
real do dia contra a base). Empate ou ausência de ano anterior: use a
variação vs. semana anterior. Nunca rankeie por número absoluto —
shoppings têm portes diferentes; variação percentual é o que os torna
comparáveis.

---

## Arquivos da skill

- [`modelo-relatorio.md`](modelo-relatorio.md) — modelo completo do
  relatório (texto + tabelas + esquema JSON) e exemplo real preenchido.
  Leia antes de gerar o primeiro relatório da conversa.
- `scripts/plantao.py` — calculadora de fechamento (`fechamento`) e
  consolidador com ranking (`consolidar`). Sem dependências externas
  (Python padrão).
- `exemplos/plaza-niteroi-2026-08-02.json` — JSON de exemplo válido; use
  como referência de esquema e para testar os comandos.
