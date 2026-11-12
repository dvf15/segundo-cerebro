# Simulador de Remuneração Executiva — PJ x CLT

Ferramenta de negociação salarial para **cargos executivos**: compara o pacote
completo nos dois modelos de contratação (**CLT** e **PJ**), mostrando o que
sobra no bolso do executivo, quanto custa para a empresa e qual faturamento PJ
empata com o pacote CLT.

> Arquivo único, sem build, sem dependências: **`public/simulador-remuneracao.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve em
> **`https://radarbazin1.vercel.app/simulador-remuneracao.html`** após o merge
> na branch de produção. Roda 100% no navegador; nada é enviado para servidor.

> No celular, **"Adicionar à Tela de Início"** (iPhone) ou **"Instalar"** (Android)
> cria um app com ícone e nome próprios — cifrão minimalista sobre o gradiente do
> cabeçalho da ferramenta. Arquivos: `remuneracao-icon.svg`, `remuneracao-icon-180/192/512.png`
> e `remuneracao.webmanifest`.

---

## O que entra na conta

| Componente | CLT | PJ |
|---|---|---|
| Salário fixo | 12 salários | faturamento mensal do contrato |
| PLR / bônus | múltiplos do salário + parcela absoluta; tabela exclusiva da Lei 10.101/2000 (sem INSS/FGTS) | faturamento extra, tributado como receita |
| ILP | co-investimento: o executivo aporta % da PLR líquida e a empresa dá matching, com vesting | faturamento extra |
| 13º salário | +1 salário, com INSS e IRRF próprios | não existe |
| Férias | terço constitucional (+1/3 de salário) | não existe |
| FGTS | 8% + provisão opcional da multa de 40% | não existe |
| Plano de saúde executivo | pago pela empresa, sem incidência salarial | em regra, custo do próprio executivo |
| Check-up anual | pago pela empresa | em regra, custo do próprio executivo |

**Cada item liga e desliga individualmente** — é o ponto central da ferramenta:
dá para medir quanto vale cada benefício isoladamente dentro do pacote.

### ILP — co-investimento com matching

Desenho padrão: o executivo aporta uma fatia da **PLR líquida** (30% por padrão) e a
empresa **iguala o aporte** (matching de 100%), liberado após o **vesting** (3 anos).

- O **aporte é dinheiro dele** — não é ganho nem perda, é liquidez: sai do caixa livre,
  fica bloqueado no prazo do vesting e é perdido, em regra, se ele sair antes.
- O **matching é o ganho**. Como só chega em 3 anos e pode não vingar, o simulador o traz
  a **valor presente** pela taxa de custo de oportunidade informada e multiplica pela
  **chance de chegar ao vesting**. Dá para exibir em valor nominal também.
- A conta mede o **grant do ano** (o aporte de agora e o matching que ele gera), não o
  caixa de um plano maduro em regime permanente.
- Tirar a PLR zera o ILP automaticamente — o aporte sai dela.
- **Gross-up** (padrão): a empresa banca todos os encargos e o executivo recebe **líquido
  igual à parcela investida**. O bruto vira a incógnita — o simulador resolve o valor que
  faz o líquido fechar (INSS e IRRF incrementais sobre o salário do mês) e soma INSS
  patronal e FGTS por cima, no custo da empresa. Com salário acima do teto do INSS, o bruto
  fica em torno do líquido ÷ 0,725. Nesse desenho o tratamento é necessariamente
  remuneratório, então o seletor de IR fica travado.
- **FGTS sobre o matching**: no plano atual o matching recolhe FGTS, então o depósito de 8%
  entra na conta da pessoa física, pelo mesmo critério de contabilização do matching (o valor
  nominal aparece ao lado na memória de cálculo). É um interruptor próprio, independente do
  tratamento de IR — mas recolher FGTS é indício de natureza salarial, e o simulador avisa
  quando essa marcação convive com a tributação como ganho de capital.

O desenho antigo continua disponível no seletor: **grant direto** em múltiplos do salário
+ parcela absoluta.

### Tratamento do ILP

Três opções, porque a tributação depende do desenho do plano:

- **Remuneração** — INSS, IRRF na tabela progressiva e FGTS.
- **Ganho de capital** — 15% (padrão), na linha do **STJ, Tema 1226**
  (REsp 2.069.644 e 2.074.564, julgado em 11/09/2024): planos de opção de
  natureza mercantil são tributados como ganho de capital na venda.
- **Diferido** — sem tributação no ano simulado.

### Modelo PJ

- **Regimes**: Simples Nacional Anexo III (com Fator R), Anexo V, e Lucro
  Presumido (presunção de 32%, com IRPJ, adicional de 10%, CSLL, PIS, COFINS,
  ISS e INSS patronal de 20% sobre o pró-labore).
- **Fator R** é calculado e, se ficar abaixo de 28% no Anexo III, o cálculo
  passa automaticamente para o Anexo V (é o que a lei determina) e avisa.
- **Dividendos**: opção de aplicar a regra de 2026 (Lei 15.270/2025) — retenção
  de 10% quando o pagamento mensal da mesma PJ à mesma PF passa de R$ 50 mil.
  A base da retenção (valor total x apenas o excedente) é configurável.

---

## Como o comparativo é feito

A conta final é a **renda disponível**: o líquido em caixa **menos** o que o
executivo precisa desembolsar do próprio bolso com os benefícios de saúde que o
contratante não cobre. É a única forma de comparar os modelos em pé de
igualdade — no PJ o plano de saúde e o check-up costumam sair do bolso.

Além disso a ferramenta mostra:

- **Custo total para a empresa** nos dois modelos (com encargos, FGTS e provisões).
- **Eficiência do gasto** — quanto do custo da empresa chega no bolso do executivo.
- **Ponto de equilíbrio** — o faturamento PJ mensal que iguala o líquido CLT.
- **Sensibilidade** — o efeito de faturamentos maiores e menores.
- **Totalizador 2×2** — renda disponível nos quatro cenários: com e sem ILP, com e sem
  benefícios (plano de saúde + check-up), nos dois modelos, com o delta de cada um contra
  o pacote completo.
- **Valor marginal de cada item** — quanto a renda cai ao remover ILP, plano de saúde,
  check-up, PLR, 13º, terço de férias ou FGTS, um a um.

---

## Antes de usar em negociação

A aba **Fontes e premissas** lista a base legal de cada linha do cálculo e,
principalmente, **onde a confiança é baixa**:

- As tabelas de **INSS, IRRF e PLR** que vêm de fábrica são as de **2025**.
  Se você simula em 2026 ou depois, atualize na aba **Parâmetros fiscais**
  (JSON editável) com a tabela vigente publicada pela Receita Federal.
- O **IRPFM** (imposto mínimo de alta renda) **não** é calculado.
- Os valores de **plano de saúde e check-up** são placeholders de ordem de
  grandeza — **não são cotação** da SulAmérica nem de qualquer operadora.
- O **risco de pejotização** (reconhecimento de vínculo) não está precificado.

É ferramenta de negociação, não opinião fiscal. Feche os números com contador e
advogado antes de assinar contrato.

---

## Estrutura do arquivo

`public/simulador-remuneracao.html` — HTML, CSS e JS em um arquivo só:

| Bloco | O que faz |
|---|---|
| `P_PADRAO` | tabelas de INSS, IRRF, PLR, Simples (Anexos III e V) e parâmetros do Lucro Presumido |
| `inssEmpregado`, `tabelaIR`, `irrfMensal`, `aliquotaSimples` | motor tributário |
| `derivarILP` | aporte, matching, valor presente e chance de vesting — recalculado por cenário |
| `calcCLT` | pacote CLT: salários, 13º, terço, PLR, ILP, FGTS, benefícios e custo da empresa |
| `calcPJ` | faturamento, regime, pró-labore, dividendos e custo do contratante |
| `breakEven` | busca binária do faturamento PJ que iguala o líquido CLT |
| `render` | monta KPIs, comparativo, memórias de cálculo e sensibilidade |

Os dados do formulário ficam em `localStorage` (`simRemun`) — nada sai do
dispositivo.
