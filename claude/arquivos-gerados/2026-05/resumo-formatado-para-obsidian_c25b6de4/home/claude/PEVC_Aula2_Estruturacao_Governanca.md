---
tipo: resumo-aula
área: finanças/private-equity
status: revisar
criado: 2026-05-20
fonte: PEVC2_Programas_Executivos_fev2020_T16_Aula2.pptx
autor: Arlete Nese
data-aula: 2020-02-10
tags:
  - private-equity
  - venture-capital
  - governança
  - fundos-de-investimento
  - alinhamento-incentivos
  - resumo-aula
aliases:
  - PEVC Aula 2
  - Estruturação de Fundos PE/VC
  - Mecanismos de Alinhamento PE/VC
---

# PEVC — Aula 2: Estruturação, Mecanismos de Alinhamento e Governança de Fundos de PE e VC

> [!info] Contexto
> Aula 2 do programa executivo de [[Private Equity]] e [[Venture Capital]], ministrada por **Arlete Nese** em 10/02/2020.
> O foco é entender **como fundos de PE/VC são estruturados economicamente** e **quais mecanismos contratuais alinham interesses entre [[GP - General Partner|GP]] e [[LP - Limited Partner|LP]]**.

---

## 1. Termos-chave do vocabulário de fundos

> [!abstract] Glossário operacional
> Os termos abaixo formam o "alfabeto" de qualquer contrato de partnership PE/VC. Entendê-los é pré-requisito para os cálculos das próximas seções.

- [[Capital Comprometido]] (*committed capital*) — total que o LP se compromete a aportar ao longo da vida do fundo.
- [[Capital Investido]] — parcela do capital comprometido efetivamente alocada em empresas-alvo.
- [[Carried Interest]] (*carry*) — taxa de performance do GP; principal mecanismo de alinhamento.
- [[Claw Back]] — mecanismo de devolução de carry pago em excesso ao GP.
- [[Escrow Account]] — conta de garantia onde parte do carry pode ficar retida.
- [[Management Fee]] — taxa de administração para custear despesas operacionais do fundo.
- [[Hurdle Rate]] — taxa mínima de retorno antes do GP fazer jus ao carry.
- [[Priority Return]] — retorno preferencial garantido ao LP antes de qualquer carry.
- [[Catch Up Provision]] — cláusula que permite ao GP "recuperar" sua participação após o LP receber o priority return.

---

## 2. Management Fee

> [!note] Conceito
> Taxa cobrada para cobrir despesas gerais do fundo. **Base mais comum: [[Capital Comprometido]]**. Pode também ser [[Capital Investido]] ou capital sob gestão. Taxa e base podem variar ao longo da vida do fundo.

### 2.1 Exemplo numérico — Fundo Max III

- Captação: R$ 500 mm
- Vida do fundo: 10 anos
- Management fee: 2% a.a. sobre capital comprometido, pago **somente nos 7 primeiros anos**

```
Total de management fee = 500 mm × (7 × 0,02) = 500 mm × 0,14 = 70 mm
Capital disponível para investimento = 500 mm − 70 mm = 430 mm
```

> [!tip] Insight
> O **capital efetivamente investível é menor que o capital comprometido**. Esse é um dos motivos pelos quais o LP olha a TIR sobre o comprometido — e não só sobre o investido — para avaliar o GP.

---

## 3. Carried Interest (Carry)

> [!note] Princípio
> Preferencialmente pago **após** o LP recuperar o capital investido **corrigido por uma taxa de retorno combinada** ([[Hurdle Rate|hurdle]] / [[Priority Return]]).

### 3.1 Modalidades

- [[Priority Return]] **sem** [[Catch Up Provision|catch up]]
- [[Priority Return]] **com** [[Catch Up Provision|catch up]]
- Carry **deal-by-deal** (pago após saída de investimentos individuais) → geralmente vem acompanhado de [[Claw Back]] e [[Escrow Account]]

---

### 3.2 Caso A — Carry com priority return SEM catch up

**Setup:** carry de 20% sobre o que exceder hurdle de 8% a.a. sobre capital comprometido. Investimentos com vida de 5 anos e retorno de 20% a.a.

```
Capital investido (t=0)     = 430 mm
Capital investido (t=5)     = 430 × (1,20)^5 = 1.070 mm
Priority return             = 500 × (1,08)^5 = 734,66 mm
Carry                       = 0,2 × (1.070 − 734,66) = 67 mm
Distribuição LP (t=5)       = 1.070 − 67 = 1.003 mm
TIR do LP                   = (1.003 / 500)^(1/5) − 1 = 14,93% a.a.
```

---

### 3.3 Caso B — Carry com priority return COM catch up provision

> [!warning] Mecânica do catch up
> 1. Até o valor de liquidação atingir o **priority return**, nada de carry.
> 2. Acima disso, **100% do excedente vai para o GP como carry** até que a divisão acumulada atinja a proporção **20%-80%** (GP-LP).
> 3. Daí em diante, todo o excedente é dividido **20%-80%**.

#### Cenário B1 — Retorno de 20% a.a. (supera hurdle)

```
Valor t=5         = 1.070 mm
Carry             = 0,2 × (1.070 − 500) = 114 mm
Distribuição LP   = 1.070 − 114 = 956 mm
TIR LP            = 13,8% a.a.
```

#### Cenário B2 — Retorno de 10% a.a. (NÃO supera hurdle)

```
Total a distribuir = 430 × (1,10)^5 = 692,52 mm
Priority return    = 734,66 mm
Como 692,52 < 734,66 → carry = 0
Recebimento LP     = 692,52 mm
TIR LP             = 6,73% a.a.
```

> [!quote] Simplificação assumida
> Os cálculos ignoram que (i) o carry é pago após cada amortização de cota, se o priority return já foi atingido, e (ii) os aportes do LP (management fee + investimentos) ocorrem ao longo do tempo e são corrigidos pelo hurdle desde a integralização até a amortização.

---

### 3.4 Comparação dos esquemas

> [!question] Reflexão da aula
> - Qual esquema gera **maior alinhamento** entre GP e LP?
> - Qual gera **maior retorno** para o LP?

| Esquema | Carry (cenário 20%) | TIR LP | Alinhamento |
|---|---|---|---|
| Sem catch up | 67 mm | 14,93% | LP mais protegido |
| Com catch up | 114 mm | 13,80% | GP mais incentivado |

---

## 4. Comportamento oportunístico

> [!danger] Auto-liquidação do fundo — duas faces

**Positivo:** força o GP a uma disciplina saudável (porém dolorosa) de encerrar investimentos em empresas de mau desempenho.

**Negativo:** como [[Track Record]] é decisivo para captar próximos fundos, GPs mais novos têm incentivo a **levar empresas imaturas para IPO**.

### 4.1 Por que investir em PE/VC é um "leap of faith"

- Quem monitora e seleciona investimentos é o **GP**, não o LP.
- Há mecanismos de longo prazo para alinhar incentivos:
  - [[Carried Interest]] — parcela do lucro alocada ao GP
  - Percentual investido pelo próprio GP no fundo (skin in the game)
- **Mas:** ainda é possível transferir valor entre partes sem aumentar o bolo total.
  - *Exemplo:* manipulação do **tempo de pagamento do carry**.

---

## 5. Importância do contrato de partnership

> [!info] Por que contratos de longo prazo são críticos
> - Transações com problemas de negociação **repetitivos** devem ser reguladas por contratos de longo prazo.
> - Em PE/VC, o papel do contrato é **ainda mais crítico** por:
>   - Relações de longo prazo
>   - [[Assimetria de Informação]] estrutural
>   - Poucos mecanismos disponíveis ao LP para interferir no fundo

### 5.1 Restrições contratuais a LP, tamanho de fundo e prazos

- [ ] Tamanho **mínimo** de investimento por LP
- [ ] Tamanho **mínimo e máximo** do fundo
  - Se não atinge o mínimo → investidores iniciais preferem dissolução
  - Cláusulas permitem ultrapassar o máximo em 10-20% **mediante autorização** dos LPs existentes
- [ ] [[Takedown Schedule]] — dinheiro solicitado sob demanda; se não investido nos 5 primeiros anos, LP é desonerado das obrigações
- [ ] Vida de 10 anos com cláusulas de extensão
- [ ] Possibilidade de **destituir o GP** sob certas condições
- [ ] Comitê de aprovação de ações do fundo

---

## 6. [[Gompers e Lerner 1996]] — Análise empírica de cláusulas

> [!cite] Referência seminal
> Gompers, P. & Lerner, J. *The Use of Covenants: An Empirical Analysis of Venture Partnership Agreements.* Journal of Law and Economics, 1996, 39(2), pp. 463-498.

- Examinaram **140 contratos** de partnership
- Dois gatekeepers e um LP
- Contratos com mais de 100 páginas
- Cláusulas classificadas em **3 classes e 14 subclasses**

### 6.1 Classe 1 — Administração geral do fundo

- Limita quantia investida em qualquer empresa (evita "salvar" um mau investimento; lembrar que [[Carried Interest|carry é uma call option]])
- Limita uso de dívidas (aumenta risco da carteira)
- Restringe coinvestimentos em fundos anteriores/posteriores (exige aprovação do conselho)
- Restringe reinvestimento dos lucros gerados (aprovação ou proibição após data X)

### 6.2 Classe 2 — Atividades dos GP

- Limita habilidade dos GP de investir fundos pessoais em empresas da carteira (desvia atenção)
- Trata do problema reverso: GP vendendo seu interesse na parceria (reduz incentivo a monitorar)
- Limite a *fundraising* — novo fundo aumenta management fees e pode reduzir esforço nos fundos existentes
- Restrição a outras atividades dos GP
- Restrições à adição de novos GP (mais baratos, mas podem reduzir qualidade)
- **Áreas tipicamente não tratadas:** [[Vesting Schedule|vesting schedule]] e divisão de lucro entre GP

### 6.3 Classe 3 — Tipo de investimento

- Limita tipos de ativo em que o fundo pode investir
- Proíbe alocação acima de % do capital em determinada classe

---

## 7. Regulamentação no Brasil — [[FIP]] e [[CVM 578|CVM 578/16]]

> [!info] FIP (Fundo de Investimento em Participações)
> Regulado pela [[CVM 578|Instrução CVM 578/16]]. CVM exige **transparência** dos gestores, mas não impõe outros aspectos de governança.

### 7.1 Características

- Cláusulas dos FIPs brasileiros **mitigam diversos conflitos** previstos em contratos internacionais
- Pode receber investidores estrangeiros qualificados **sem ser de capital aberto**
- Tributação diferenciada para cotistas:
  - Ganhos aparecem como **ganhos de capital**
  - Impostos recolhidos apenas no **resgate/amortização**
  - **Reinvestimento posterga impostos automaticamente**
  - **Isenção** para não residentes (se detiver < 40% das cotas ou rendimentos)

### 7.2 Aspectos da [[LGPD]] (Lei 13.709/18)

- [ ] Melhores práticas no processamento e proteção de dados
- [ ] Evidências de governança de dados
- [ ] Registros de processamentos
- [ ] Tratamento de incidentes de privacidade

---

## 8. FIPs vs. estruturas offshore

> [!warning] Diferença-chave: governança, não cláusulas
> As cláusulas para lidar com conflitos são **semelhantes**. A diferença está no **modelo de governança**.

- CVM exige **transparência** dos FIPs, mas não impõe outros aspectos de governança.
- A maioria dos FIPs brasileiros que captam com **fundos de pensão nacionais e BNDES** tem **[[Comitê de Investimento]]** com participação dos cotistas e **muita interferência na gestão da carteira**.
- LP participa das decisões de investimento e saída.
- **Conflito:** gera atrito com LPs internacionais ou que não querem participar do Comitê.
- Outra diferença: existência de **administrador da carteira**, que pode ou não ser o gestor.

---

## 9. Estatísticas descritivas (slides 26-30)

> [!warning] Lacuna de conteúdo
> Os slides 26 a 30 do deck contêm apenas títulos — os gráficos/tabelas com a estatística descritiva não foram extraídos em texto. Para completar este resumo, abrir o `.pptx` e capturar:
>
> - [ ] Cláusulas gerais existentes em FIPs (slide 26)
> - [ ] Cláusulas de remuneração de gestores/administradores (slide 27)
> - [ ] Cláusulas relativas à governança corporativa do FIP (slide 28)
> - [ ] Resumo: cláusulas regulam gestão, atividades dos GP e tipos de ativo (slide 29)
> - [ ] Cláusulas de remuneração — antigo FIEE, Felipe Cresciullo (slide 30)

---

## 10. Leituras sugeridas

- ABVCAP (2015). *Estrutura Legal dos Fundos de Private Equity e Venture Capital no Brasil*
- Chaplinsky (2015). *The Basics of Private Equity Funds.* Darden Business Publishing
- Phalippou, Rauch & Umber (2016). *Private Equity Portfolio Company Fees*

---

## 11. Próximas ações

- [ ] Revisar cálculos do Fundo Max III em planilha própria
- [ ] Comparar cláusulas Gompers & Lerner com cláusulas típicas de FIP brasileiro
- [ ] Buscar e ler ABVCAP (2015) e Chaplinsky (2015)
- [ ] Detalhar slides 26-30 (estatísticas descritivas)
- [ ] Conectar esta nota a [[Aula 1 - Introdução a PE e VC]] (se existir)
- [ ] Criar nota separada para [[Catch Up Provision]] com diagrama da cascata de distribuição

---

## 12. Conexões — Dataview

```dataview
TABLE área AS "Área", status AS "Status", criado AS "Criado"
FROM "" 
WHERE contains(tags, "private-equity") OR contains(tags, "venture-capital")
SORT criado DESC
```

```dataview
LIST FROM [[]]
WHERE contains(tags, "resumo-aula")
SORT file.ctime DESC
```

---

## Nota de uso

> [!info] Como usar esta nota no Obsidian
> - **Wikilinks** (`[[Termo]]`) criam notas-stub para cada conceito-chave. Clique nos links para criar a nota correspondente; conforme você povoar essas notas, o grafo se conecta automaticamente.
> - **Plugin Dataview obrigatório** para que os blocos de consulta no final renderizem. Instale via *Settings → Community Plugins → Dataview* e ative *"Enable JavaScript Queries"* só se for usar `dataviewjs`.
> - **Fluxo de templates por instância:** se for revisar essa aula em sessões diferentes, duplique a nota como `PEVC_Aula2 — Sessão 1 - YYYY-MM-DD.md`, atualize o frontmatter (`status`, `criado`) e use as checkboxes da seção 11 como roteiro de estudo da sessão.
> - **Frontmatter `aliases`** permite encontrar a nota digitando qualquer um dos nomes alternativos no quick-switcher (Ctrl/Cmd+O).

---

> [!success] Rating de confiança: **8/10**
> - Conteúdo dos slides 1-25 e 31 extraído integralmente do .pptx — **alta confiança** na fidelidade.
> - Slides 26-30 contêm apenas títulos no texto extraído (provavelmente são gráficos/tabelas em imagem) — sinalizado como lacuna no §9.
> - Cálculos verificados pela aritmética apresentada nos próprios slides; não recalculei independentemente cada potência composta.
> - Formatação Obsidian segue convenções padrão; testei mentalmente a sintaxe Dataview mas não rodei em vault real.
