# Teste Piloto — Relatório de Plantão Padronizado

Instruções para encaminhar ao shopping que vai testar. A mensagem abaixo é
autossuficiente: o gerente só precisa de acesso ao Claude (claude.ai) e dos
números do dia — não precisa instalar nada.

---

## Mensagem para encaminhar ao gerente de plantão

Olá! Estamos padronizando o relatório de plantão de todos os shoppings para
conseguir consolidar e comparar as performances do dia. Você foi
escolhido(a) para o teste piloto. O objetivo é que o preenchimento leve
**menos de 10 minutos**. Siga os passos abaixo no seu próximo plantão.

### O que ter em mãos antes de começar

Do sistema do estacionamento (pode ser print da tela ou os números):

1. **Do dia do plantão**: fluxo de veículos, fluxo pagante, fluxo valet,
   ocupação máxima (% e horário do pico), isenções App (CAT 1, 2 e 3 —
   quantidades e valores em R$), receita e fluxo de pessoas.
2. **Os mesmos números do mesmo dia da semana do ano passado** (ex.: se o
   plantão é domingo, o domingo equivalente de um ano atrás).
3. **Os mesmos números do mesmo dia da semana passada** (7 dias antes).

E da sua observação do dia: percepção de fluxo e vendas, lojas destaque,
como foi a gastronomia, entretenimento/eventos (com ingressos e
faturamento, se houver bilheteria) e ocorrências.

### Passo a passo

1. Abra o **claude.ai** (logado na conta da empresa) e inicie uma conversa
   nova.
2. **Copie e cole o prompt completo** que está no final desta mensagem
   (tudo que está dentro do bloco). Se preferir, anexe também os prints do
   sistema do estacionamento na mesma mensagem — o Claude extrai os
   números deles.
3. O Claude vai te devolver **um formulário único**. Responda tudo de uma
   vez, na ordem que quiser (pode escrever por cima do formulário). Não
   precisa calcular nenhuma porcentagem — informe só os números brutos.
4. O Claude vai gerar o relatório completo: texto padrão + duas tabelas de
   fechamento + um bloco de código no final (JSON). **Confira os números
   das tabelas** contra o sistema. Se algo estiver errado, diga ao Claude
   o que corrigir.
5. Copie o relatório **inteiro, incluindo o bloco de código do final** — é
   ele que permite consolidar todos os shoppings automaticamente — e envie
   no canal de sempre (grupo/e-mail do plantão).

### Depois do teste, me responda estas 4 perguntas

1. Quanto tempo levou, do início ao envio?
2. Algum dado pedido que você não tem no seu sistema (ou tem com outro
   nome)?
3. O relatório final ficou fiel ao que você teria escrito manualmente?
   O que faltou ou sobrou?
4. O que tornaria o preenchimento mais rápido?

---

### PROMPT PARA COLAR NO CLAUDE (copie tudo abaixo)

```
Você vai me ajudar a preencher o RELATÓRIO DE PLANTÃO padronizado do meu
shopping. Siga exatamente este processo:

PASSO 1 — Me envie UM ÚNICO formulário com todos os campos abaixo para eu
responder de uma vez (não pergunte em série). Se eu anexar prints do
sistema do estacionamento, extraia os números de lá e me pergunte apenas o
que faltar.

IDENTIFICAÇÃO: shopping; responsável (nome e cargo); data do plantão;
clima.

FLUXO DO DIA — para cada métrica, 3 valores: HOJE | mesmo dia da semana do
ANO ANTERIOR | mesmo dia da SEMANA ANTERIOR:
fluxo de pessoas; fluxo de veículos; fluxo pagante; fluxo valet; ocupação
máxima (% e faixa de horário do pico); receita do estacionamento (R$);
isenções App CAT 1/2/3 (quantidades); isenções App $ CAT 1/2/3 (valores).

PERCEPÇÃO (escala fixa: Excelente / Ótimo / Bom / Moderado / Fraco):
percepção de fluxo + comentário curto; percepção de vendas + comentário.

DESTAQUES: lojas destaque; gastronomia (restaurantes com serviço / praça
de alimentação / cafeterias e gelaterias); entretenimento e lazer (para
evento com bilheteria: ingressos vendidos e faturamento do dia).

EVENTOS: evento(s) no shopping; evento(s) externo(s) na cidade.

OCORRÊNCIAS: houve ocorrência com risco de imagem (SAC, brigada,
segurança)? Se sim, o que houve e como foi tratado.

PASSO 2 — Com as minhas respostas, calcule as variações percentuais de
cada métrica: (atual − referência) ÷ referência × 100, com 2 casas
decimais. Calcule com cuidado, uma a uma, e não invente nenhum número: se
eu não informar um dado, deixe "—" na tabela e null no JSON.

PASSO 3 — Gere o relatório final em UM ÚNICO bloco copiável, nesta ordem:

1. Cabeçalho: [Shopping] | Nome: [nome] ([cargo]) / [DD-MM-AAAA] | [clima]
2. "Fluxo e Ocupação do Estacionamento:" — 1 frase com fluxo de pessoas
   (variação vs. ano anterior), veículos (variação) e pico de ocupação
   máxima com horário. Ex.: "+40 mil (+44%) e 2.932 carros (+11%) com pico
   de ocupação máxima de 71% na tarde (15h – 16h)."
3. "Percepção de fluxo/vendas:" — com a escala fixa + meu comentário.
4. "Lojas:" — destaques nominais.
5. "Gastronomia:" — três linhas: Restaurantes com serviço / Praça de
   Alimentação / Cafeterias e gelaterias.
6. "Entretenimento e Lazer:" — operações e eventos, com ingressos e
   faturamento quando houver.
7. "Ocorrências que gerem risco de imagem | SAC, atendimento brigada,
   segurança etc.:" — descrição, ou "Não houve nenhuma situação
   relevante."
8. "Abaixo o fechamento do fluxo com mais detalhes." seguido de DUAS
   tabelas markdown (comparativo com o ano anterior; comparativo com a
   semana anterior). Colunas: Indicador | [data do plantão por extenso] |
   [data de referência por extenso] | %. Linhas, nesta ordem: Fluxo de
   Veículos; Fluxo Pagante; Fluxo Valet; Ocupação Máxima (horário do
   pico); Isenções App CAT 1, 2, 3; Isenções App $ CAT 1, 2, 3; Receita;
   Fluxo de Pessoas. Formato brasileiro: 2.932 / R$ 87.651,00 / 71,84% /
   variações com sinal (+11,61%).
9. Ao final, um bloco de código JSON com esta estrutura exata (números sem
   formatação, datas AAAA-MM-DD, campos sem dado = null):

{
  "schema": "relatorio-plantao/v1",
  "shopping": "...", "responsavel": "...", "data": "AAAA-MM-DD",
  "clima": "...",
  "comparativos": {"ano_anterior": "AAAA-MM-DD", "semana_anterior": "AAAA-MM-DD"},
  "fluxo": {
    "pessoas": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
    "veiculos": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
    "pagante": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
    "valet": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
    "ocupacao_maxima_pct": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
    "ocupacao_pico_horario": "15h - 16h",
    "receita": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
    "isencoes_app": {
      "cat1": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
      "cat2": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
      "cat3": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
      "valor_cat1": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
      "valor_cat2": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0},
      "valor_cat3": {"atual": 0, "ano_anterior": 0, "semana_anterior": 0}
    }
  },
  "percepcao": {"fluxo": "Excelente|Ótimo|Bom|Moderado|Fraco", "vendas": "...", "comentario": "..."},
  "destaques": {"lojas": [], "gastronomia": [], "entretenimento": []},
  "eventos": {"shopping": [{"nome": "...", "ingressos": null, "faturamento": null}], "externos": []},
  "ocorrencias": {"houve": false, "descricao": null}
}

Regras: as datas de referência são o mesmo dia da semana (ano anterior =
data − 364 dias; semana anterior = data − 7 dias), a menos que eu informe
outras. Se eu usar palavras fora da escala de percepção ("bombou",
"fraco"), mapeie para a escala fixa e mantenha meu comentário original.
Mostre o relatório completo e me pergunte se quero corrigir algo antes de
finalizar.

Pode começar me enviando o formulário.
```

---

## Para a holding (uso interno)

- Quando o relatório do piloto chegar, valide a consolidação rodando:
  `python skill/relatorio-plantao-shopping/scripts/plantao.py consolidar <dir com os .json>`
  (salve o bloco JSON de cada relatório como um arquivo `.json`).
- Compare as variações % do relatório com o sistema do estacionamento —
  no piloto, vale conferir uma a uma.
- Colete as respostas das 4 perguntas de feedback e use-as para ajustar a
  skill (formulário, nomes de campos, seções) antes de expandir para os
  demais shoppings.
