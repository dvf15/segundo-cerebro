# Modelo do Relatório de Plantão

Este arquivo tem três partes: (1) o modelo em branco, (2) um exemplo real
preenchido (Plaza Shopping Niterói, 02/08/2026) e (3) o esquema do bloco
JSON de consolidação.

---

## 1. Modelo em branco

```
[Nome do Shopping] | Nome: [nome] ([cargo])
[DD-MM-AAAA] | [Clima].

Fluxo e Ocupação do Estacionamento: [fluxo de pessoas arredondado]
([var% pessoas vs. ano anterior]) e [veículos] carros ([var% veículos])
com pico de ocupação máxima de [X]% [período do pico].

Percepção de fluxo/vendas: [Excelente/Ótimo/Bom/Moderado/Fraco].
[Comentário curto do gerente.]

Lojas: [destaques — âncoras, satélites, cafeterias etc.]

Gastronomia:
Restaurantes com serviço: [movimento por piso/grupo, com destaques nominais.]
Praça de Alimentação: [movimento no almoço e no jantar.]
Cafeterias e gelaterias: [movimento ao longo do dia.]

Entretenimento e Lazer:
[Operações fixas (cinema, parques) e eventos. Para evento com bilheteria,
informe ingressos vendidos e faturamento por dia.]

Ocorrências que gerem risco de imagem | SAC, atendimento brigada,
segurança etc.: [descrição ou "Não houve nenhuma situação relevante."]

Abaixo o fechamento do fluxo com mais detalhes.

[TABELA 1 — comparativo vs. mesmo dia da semana do ano anterior]
[TABELA 2 — comparativo vs. mesmo dia da semana anterior]

[BLOCO JSON DE CONSOLIDAÇÃO]
```

As duas tabelas saem prontas do script (`plantao.py fechamento`). Cada uma
compara, na ordem: Fluxo de Veículos, Fluxo Pagante, Fluxo Valet, Ocupação
Máxima (com a faixa de horário do pico), Isenções App (CAT 1-3 em
quantidade e R$), Receita e Fluxo de Pessoas — sempre com a coluna de
variação %.

---

## 2. Exemplo preenchido (referência de tom e nível de detalhe)

```
Plaza Shopping Niterói | Nome: xxxx (Gerente de Marketing)
02-08-2026 | Dia de sol.

Fluxo e Ocupação do Estacionamento: +40 mil (+44%) e 2.932 carros (+11%)
com pico de ocupação máxima de 71% na tarde (15h – 16h).

Percepção de fluxo/vendas: Shopping com fluxo excelente. No final da
tarde, lojas e corredores cheios com forte percepção de vendas.

Lojas: destaque para as cafeterias, âncoras (Renner, Centauro, C&A,
Sephora), lojas de sorvete/gelatos etc.

Gastronomia:
Restaurantes com serviço: O piso L4 apresentou excelente fluxo no almoço,
com picos de filas de espera. Destaque para o Sardinha, Balada Mix,
Abbraccio e Coco Bambu. Os restaurantes dos outros pisos também com
excelente fluxo, destaque para Madero, Mamma Jamma, NOI e Outback.
Praça de Alimentação: Fluxo excelente no almoço com alto movimento e bom
movimento no jantar.
Cafeterias e gelaterias: Excelente movimento durante todo o dia.

Entretenimento e Lazer:
A operação destaque foi o Cinemark (L3) com excelente fluxo e
atratividade. Já a World Games (L3) com fluxo/movimento moderado.
PKXD – Evento corporativo (meia praça central, L1) com fluxo excelente.
No sábado, 377 ingressos vendidos, R$ 18.693 de faturamento. No domingo,
223 ingressos vendidos, R$ 10.554,50 de faturamento.
Feira de Livros Bora Lê – meia praça central com movimento razoável.

Ocorrências que gerem risco de imagem | SAC, atendimento brigada,
segurança etc.: Não houve nenhuma situação relevante.

Abaixo o fechamento do fluxo com mais detalhes.
```

(Seguem as duas tabelas geradas pelo script e o bloco JSON.)

Repare no estilo: frases curtas, destaques **nominais** (nomes de lojas e
restaurantes, não "algumas lojas"), números de bilheteria quando há evento
pago, e a seção de ocorrências sempre presente — mesmo quando não houve
nada.

---

## 3. Esquema do bloco JSON de consolidação

Todo relatório termina com este bloco dentro de um fence ` ```json `.
Campos sem dado ficam `null` (nunca invente). Números sem formatação
(inteiros/decimais com ponto), datas em ISO (`AAAA-MM-DD`).

```json
{
  "schema": "relatorio-plantao/v1",
  "shopping": "Plaza Shopping Niterói",
  "responsavel": "xxxx (Gerente de Marketing)",
  "data": "2026-08-02",
  "clima": "Dia de sol",
  "comparativos": {
    "ano_anterior": "2025-08-03",
    "semana_anterior": "2026-07-26"
  },
  "fluxo": {
    "pessoas":  {"atual": 40287, "ano_anterior": 27789, "semana_anterior": 39156},
    "veiculos": {"atual": 2932,  "ano_anterior": 2627,  "semana_anterior": 2500},
    "pagante":  {"atual": 2511,  "ano_anterior": 2149,  "semana_anterior": 2164},
    "valet":    {"atual": 192,   "ano_anterior": 118,   "semana_anterior": 155},
    "ocupacao_maxima_pct": {"atual": 71.84, "ano_anterior": 64.08, "semana_anterior": 62.88},
    "ocupacao_pico_horario": "15h - 16h",
    "receita":  {"atual": 87651, "ano_anterior": 68967, "semana_anterior": 75510},
    "isencoes_app": {
      "cat1":       {"atual": 44,       "ano_anterior": 113,      "semana_anterior": 30},
      "cat2":       {"atual": 375,      "ano_anterior": 290,      "semana_anterior": 296},
      "cat3":       {"atual": 257,      "ano_anterior": 347,      "semana_anterior": 208},
      "valor_cat1": {"atual": 171.40,   "ano_anterior": 414.50,   "semana_anterior": 108.60},
      "valor_cat2": {"atual": 7197.00,  "ano_anterior": 5284.50,  "semana_anterior": 5708.00},
      "valor_cat3": {"atual": 13376.00, "ano_anterior": 14231.00, "semana_anterior": 10587.00}
    }
  },
  "percepcao": {
    "fluxo": "Excelente",
    "vendas": "Excelente",
    "comentario": "No final da tarde, lojas e corredores cheios com forte percepção de vendas."
  },
  "destaques": {
    "lojas": ["Cafeterias", "Renner", "Centauro", "C&A", "Sephora", "Sorvete/gelatos"],
    "gastronomia": ["Sardinha", "Balada Mix", "Abbraccio", "Coco Bambu", "Madero", "Mamma Jamma", "NOI", "Outback"],
    "entretenimento": ["Cinemark (excelente)", "PKXD (excelente)", "Feira de Livros Bora Lê (razoável)"]
  },
  "eventos": {
    "shopping": [
      {"nome": "PKXD", "ingressos": 223, "faturamento": 10554.50},
      {"nome": "Feira de Livros Bora Lê", "ingressos": null, "faturamento": null}
    ],
    "externos": ["Arraiá Harmonya de Piratininga"]
  },
  "ocorrencias": {
    "houve": false,
    "descricao": null
  }
}
```

Notas:

- `percepcao.fluxo` e `percepcao.vendas` usam a escala fixa: Excelente /
  Ótimo / Bom / Moderado / Fraco.
- `eventos.shopping[].ingressos`/`faturamento` são **do dia do relatório**
  (não acumulado do fim de semana); eventos gratuitos ficam `null`.
- `comparativos` pode ser omitido — o script deriva as datas (mesmo dia da
  semana no ano anterior e 7 dias antes).
- Shopping sem histórico (inauguração recente): deixe `ano_anterior: null`
  nas métricas; o consolidador rankeia esse shopping pela variação semanal
  e sinaliza a ausência de base anual.
