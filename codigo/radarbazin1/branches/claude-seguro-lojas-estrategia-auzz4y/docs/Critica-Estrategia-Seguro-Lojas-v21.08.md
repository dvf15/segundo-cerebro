# Crítica Estratégica — "Estratégia de Seguro para Lojas" (v21.08)

Análise crítica do deck executivo de 15 slides, avaliado contra os objetivos macro
declarados no resumo estratégico: reduzir custo da apólice master, minimizar gaps de
cobertura, diminuir risco jurídico do empreendedor, garantir proteção patrimonial,
estruturar governança contínua, criar compliance escalável e viabilizar modelos
híbridos/centralizados inovadores.

**Veredito resumido:** o material acerta o diagnóstico do problema operacional e é
honesto sobre os dados (inclusive sobre o fracasso da negociação Ezze). Mas ele é hoje
um **projeto de compliance documental vestido de tese de eficiência de capital**. Falta
o business case, falta o elo com a apólice master, a métrica principal mede a coisa
errada, a recomendação não é sustentada pelos dados apresentados, e a alternativa de
desenho mais promissora não foi considerada. Como está, não é aprovável em comitê sem
um cheque em branco.

---

## 1. Avaliação sintética

| Dimensão | Nota | Comentário |
|---|---|---|
| Diagnóstico do problema | **Forte** | Slides 3 e 4 são precisos: exigência contratual ≠ transferência de risco. |
| Honestidade dos dados | **Forte** | Documentar o fracasso da Ezze e os 48% é raro e valioso. |
| Comparação de modelos | **Médio** | Qualitativa, sem pesos, sem custo, e falta um quarto modelo. |
| Sustentação da recomendação | **Fraco** | n=1 (Estação Cuiabá), sem controle, causalidade insinuada. |
| Business case financeiro | **Ausente** | Nenhum número de prêmio, sinistralidade, PML, economia ou custo do programa. |
| Elo com a apólice master | **Ausente** | Objetivo macro nº 1 não é mencionado uma única vez no deck. |
| Tratamento jurídico | **Fraco** | Responsabilidade subsidiária afirmada sem base; cláusulas técnicas ausentes. |
| Risco regulatório/conflito | **Subavaliado** | "SUSEP: baixo" é otimista; a pergunta central (quem recebe a comissão) não é respondida. |
| Governança e accountability | **Médio** | Ritos definidos, mas sem dono, sem meta e sem consequência. |
| Roadmap | **Fraco** | Ignora o estoque de contratos vigentes; prazo de 24 meses é irreal. |
| Acabamento editorial | **Fraco** | Numeração duplicada, placeholder "XX" não preenchido, dado de julho suspeito. |

---

## 2. Os cinco problemas graves

### 2.1 Não existe business case — e o objetivo nº 1 sequer aparece

O subtítulo do deck é "Otimização de Risco e **Eficiência de Capital**". O material não
apresenta um único número financeiro: nem prêmio atual, nem sinistralidade histórica,
nem valor em risco (PML), nem economia estimada, nem custo da estrutura de governança
que ele propõe criar.

Mais grave: **a apólice master do shopping — cujo custo o objetivo macro nº 1 pretende
reduzir — não é mencionada em nenhum slide.** O deck trata exclusivamente do seguro do
lojista. Sem demonstrar o mecanismo de transmissão (cobertura do lojista ↑ → sinistros
que hoje batem no master ↓ → retenção/prêmio do master renegociável), a tese de
eficiência de capital é retórica, não análise.

**O que falta, em números:**
- Prêmio anual e franquia da apólice master, por shopping e consolidado.
- Sinistros dos últimos 5 anos com origem em loja: quantidade, valor pago, quanto foi
  absorvido pelo shopping (franquia, não coberto, acordo, condenação).
- Valor em risco não coberto hoje (estimativa a partir da amostra de LMIs).
- Economia esperada: (a) no prêmio do lojista via escala, (b) no prêmio/retenção do
  master via redução de exposição, (c) em perdas evitadas.
- Custo do programa: headcount dedicado, sistema/painel, auditoria independente, RFP.
- Payback e VPL em 3 anos, com cenário conservador.

Sem isso, o comitê está sendo convidado a aprovar uma estrutura permanente de custo
contra um benefício não quantificado.

### 2.2 A métrica principal mede a coisa errada

O KPI central do programa é **adesão** — posse de um documento. O próprio deck (slide 14)
demonstra por que isso não funciona: *"variações de LMI entre R$ 1,5 mil e R$ 7 milhões"*.

Uma apólice com LMI de R$ 1,5 mil conta como "aderente" e não protege absolutamente nada.
Isso significa que **o programa pode atingir 100% de adesão sem reduzir a exposição do
shopping em um centavo** — e, pior, cria incentivo perverso: o time regional é cobrado por
papel, então busca papel, e o lojista entrega a apólice mais barata que existir.

**Correção necessária:** substituir a métrica principal por **Cobertura Qualificada** —
% do GLA com apólice vigente **que atende às coberturas e LMIs mínimos da categoria**.
Adesão nominal vira métrica secundária, de processo. Enquanto essa troca não for feita,
todo o dashboard do slide 13 está medindo conformidade documental, não risco.

### 2.3 A recomendação não é sustentada pelos dados

O deck recomenda o Modelo Híbrido e apresenta como evidência a Estação Cuiabá (74,9%,
"modelo híbrido"), único caso do portfólio. Mas os próprios dados do slide 14 enfraquecem
a inferência:

| Shopping | Adesão | Modelo |
|---|---|---|
| Estação Cuiabá | 74,9% | Híbrido |
| Mooca | 71,3% | Individual |
| Belo Horizonte | 63,2% | Individual |
| ... | ... | ... |
| Norteshopping | 8,2% | Individual |

A diferença entre o único caso híbrido (74,9%) e o melhor caso individual (71,3%) é de
**3,6 p.p.** — dentro do ruído. Já a dispersão *dentro* do modelo individual vai de 8,2%
a 71,3%: **63 p.p.** A variável que mais explica a adesão nesses dados não é o modelo —
é a execução local.

Isso não invalida o Modelo Híbrido, mas invalida a evidência apresentada, e um comitê
atento vai apontar isso. Duas consequências práticas:

1. **Antes de trocar de modelo, entender a variância de execução.** Por que Cuiabá e
   Mooca conseguem e Norteshopping (8,2%) não? Se a resposta for gestão, processo ou
   perfil de lojista (% de redes nacionais, porte, maturidade), o modelo híbrido não
   resolve sozinho — e pode ser adotado carregando o mesmo problema.
2. **Desenhar um piloto controlado**: 3 shoppings híbridos e 3 comparáveis individuais,
   pareados por porte, mix e % de redes, medindo Cobertura Qualificada (não adesão) por
   6 meses. É a diferença entre uma decisão auditável e uma anedota.

### 2.4 A pergunta mais importante do modelo não é respondida: quem fica com a comissão?

O slide 9 promete "remuneração transparente" da corretora homologada. O deck nunca diz
**quem recebe o quê**. Essa é a pergunta que define se o programa é legítimo ou se é um
problema de compliance esperando acontecer.

O slide 12 revela, quase de passagem, o dado mais relevante de todo o material:
*"redução da remuneração total, tomando a tabela de **30%** como referência inicial"*.
Uma comissão de 30% em seguro empresarial é muito alta. Isso significa que **a maior
alavanca de preço para o lojista não é a escala de negociação — é a comissão.** Um deck
que promete "custo otimizado via escala" enquanto trabalha com 30% de comissão está
otimizando a variável errada e deve dizer isso ao comitê.

Decisão que precisa ser explicitada e aprovada:

- O shopping/administradora **recebe alguma remuneração, rebate, verba de marketing ou
  participação** da corretora ou seguradora? Recomendação: **não**. Se receber, o discurso
  de "benefício direto ao varejista" cai, o conflito de interesse deixa de ser "médio" e
  o risco de caracterização de venda casada e de exercício irregular de corretagem
  (Lei 4.594/64, que condiciona o recebimento de comissão a registro) sobe materialmente.
- Se houver qualquer valor, ele deve ser revertido ao condomínio/FPP, contabilizado e
  divulgado em assembleia — nunca ao empreendedor.
- Teto de comissão contratado no RFP (ordem de 15–20%), com a diferença revertida em
  redução de prêmio, e a tabela de remuneração aberta ao lojista.

Complementarmente, o risco regulatório está classificado como **"Baixo"** no slide 10 com
a justificativa de que "o modelo opera como regra contratual, não como apólice coletiva".
Isso cobre o risco SUSEP de estipulação, mas ignora três outros: **CDC art. 39, I**
(venda casada, se a "opção" for percebida como imposição), **concorrencial/CADE**
(indicação exclusiva de corretora em posição de poder contratual sobre o locatário) e
**conflito fiduciário** se houver captura de valor. Classificação honesta: **Médio**,
com parecer jurídico formal como pré-requisito da Fase 1.

### 2.5 O roadmap ignora o estoque de contratos vigentes

O slide 15 prevê "atualizar minuta de locação" (0–3 meses) e "programa SIL replicado em
todo o portfólio" (12–24 meses). Isso é aritmeticamente impossível: a minuta nova só
alcança **novos contratos e renovações**. Com prazo típico de locação de 5 anos, ao final
de 24 meses aproximadamente 40% do portfólio terá passado por renovação. O programa
completo levaria ~5 anos por essa via.

O deck não trata da alavanca que resolveria isso: **as Normas Gerais / regimento interno
do condomínio**, alteráveis por assembleia e aplicáveis ao estoque vigente. É um caminho
jurídico distinto do contrato de locação, com riscos e requisitos próprios, e sua ausência
é uma lacuna estrutural do plano. Como o próprio slide 4 já aponta que as *"Normas Gerais
não padronizadas entre os shoppings dificultam notificações"*, a padronização desse
documento deveria ser entregável da Fase 1 — provavelmente antes da minuta de locação.

**Correção:** adicionar ao roadmap a curva de vencimentos contratuais do portfólio e um
plano de duas vias (locação para o fluxo novo, normas gerais/assembleia para o estoque).

---

## 3. O modelo que falta no deck — Modelo IV: centralizado por escopo

O deck compara três modelos ao longo de um único eixo: **quem contrata**. Falta o eixo mais
produtivo: **o que se contrata**. Nem toda cobertura tem o mesmo dono de interesse.

| Cobertura | Interesse primário | Quem deve contratar |
|---|---|---|
| RC Operações (danos a terceiros e ao empreendimento) | Shopping | **Shopping** |
| Incêndio/explosão com dano à estrutura e a terceiros | Shopping | **Shopping** |
| Perda de aluguel e encargos | Shopping (locador) | **Shopping** |
| Estoque, benfeitorias, equipamentos | Lojista | Lojista |
| Lucros cessantes do lojista | Lojista | Lojista |
| RC profissional (saúde, estética) | Lojista | Lojista |

**Modelo IV — camada dupla:** o shopping contrata, como estipulante, uma apólice coletiva
cobrindo **apenas as coberturas de interesse do empreendedor** (RC, incêndio/dano ao imóvel
locado, perda de aluguel), com custo repassado por rateio — valor por m² previsível e baixo,
porque o escopo é estreito. As coberturas de interesse exclusivo do lojista permanecem
livres, com regras mínimas e corretora homologada opcional.

Por que isso é superior ao híbrido puro para os objetivos declarados:

- **Elimina a dependência de adesão** justamente onde o shopping está exposto. Hoje o
  programa está a 48% e a exposição do empreendedor é função direta desse número. No
  Modelo IV essa camada vai a 100% no dia 1.
- **Reduz drasticamente a fricção** do centralizado puro: o lojista não é obrigado a
  abandonar sua apólice de estoque nem sua corretora, o que neutraliza a principal
  objeção das redes nacionais.
- **Resolve o problema de LMI heterogêneo** na camada que importa, sem precisar auditar
  milhares de apólices individuais.
- **Custo por m² é pequeno e negociável em escala real** (portfólio inteiro, prêmio único).
- **Cria o elo com a apólice master**: a camada centralizada pode ser negociada como
  extensão do programa corporativo, permitindo discutir retenção e prêmio consolidados —
  exatamente o objetivo macro nº 1.

Riscos a tratar: caracterização de repasse no condomínio (exige previsão em normas gerais
e aprovação em assembleia), papel de estipulante perante a SUSEP (aqui sim aplicável, ao
contrário do híbrido), tratamento tributário do repasse e responsabilidade reputacional
em sinistro. São riscos reais e administráveis — e merecem ser comparados de frente com o
custo de conviver com 48% de cobertura por tempo indeterminado.

**Recomendação:** o deck deveria apresentar quatro modelos, não três, e submeter ao comitê
uma matriz ponderada com pesos explícitos por critério, e não a tabela qualitativa do
slide 7 (que hoje mistura dimensões — "risco sistêmico: concentrado" não é comparável a
"alto"/"baixo" — e não permite auditar como a recomendação foi obtida).

---

## 4. A alavanca de enforcement que está faltando

O fluxograma do slide 4 termina em **despejo**. Todo lojista sabe que nenhum shopping
despeja um inquilino adimplente por causa de apólice, especialmente com pressão de
vacância. A escada de escalação é, portanto, um blefe conhecido — e isso explica boa parte
dos 48% melhor do que qualquer escolha de modelo. Enquanto a sanção terminal não for
crível, o processo continuará "moroso e concentrado em esforço de pessoas", como o próprio
slide admite.

Alavancas mais críveis, graduais e efetivamente aplicáveis:

1. **Seguro contratado pelo shopping por conta do lojista inadimplente** (*force-placed
   insurance*, padrão em real estate nos EUA): decorrido o prazo de notificação, o shopping
   contrata a cobertura mínima e cobra no boleto de condomínio. Converte um problema de
   cobrança de documento — que o shopping não sabe fazer — em cobrança financeira, que ele
   faz todo mês. É a mudança de maior impacto isolado disponível e não está no material.
   Requisitos: cláusula contratual expressa, previsão em normas gerais, notificação prévia
   com prazo, preço comprovadamente de mercado e repasse a custo (sem margem).
2. **Bloqueio de benefícios**: mídia interna, participação em campanhas, ações promocionais,
   destaque em app/site — retirados enquanto houver pendência.
3. **Retenção de aprovações**: projeto de reforma, autorização de obra, "nada consta" para
   renovação e para cessão/transferência de ponto.
4. **Débito automático da multa contratual** no boleto de condomínio, sem etapa jurídica.

Essas alavancas funcionam nos três (ou quatro) modelos e provavelmente têm efeito maior
sobre a Cobertura Qualificada do que a troca de modelo — a um custo de implantação
significativamente menor.

---

## 5. O que precisa existir e não existe: as regras mínimas

O slide 9 lista "coberturas obrigatórias definidas" e "limites mínimos por categoria" como
bullets. **Essa matriz é o produto real do projeto** e não está no deck. Sem ela, o comitê
não tem o que aprovar — está aprovando a intenção de definir regras, não as regras.

O aprendizado da Ezze (slide 12) já identificou a necessidade de segmentação por operação,
mas ela não foi incorporada à recomendação. Estrutura mínima do que falta:

**Categorias de risco** (proposta): quiosque; satélite varejo seco; alimentação sem cocção;
alimentação com cocção; restaurante/cozinha industrial; joalheria, relojoaria e eletrônicos;
saúde, estética e clínicas; lazer infantil e entretenimento; academia; megaloja/âncora
(tratamento individual).

**Coberturas obrigatórias em todas as categorias:**
1. Incêndio, raio, explosão, fumaça e queda de aeronave.
2. **RC Operações**, com o empreendedor, o condomínio e a administradora como
   **segurados adicionais / cossegurados**.
3. **Cláusula de renúncia ao direito de sub-rogação** contra empreendedor, condomínio e
   administradora — tecnicamente a cláusula mais importante de todo o programa, e que
   sequer é mencionada no deck.
4. Danos elétricos.
5. Vendaval, alagamento e danos por água.
6. **Perda de aluguel e encargos, com o locador como beneficiário direto**, período
   indenitário de 12 meses. (O slide 12 mostra que a equipe fez a pergunta certa à Ezze —
   "quem recebe a indenização, quais encargos, 6 ou 12 meses" — mas a resposta nunca foi
   fixada como regra.)
7. Desentulho e recomposição de registros/documentos.
8. **Obrigação de aviso prévio ao shopping (30 dias) em caso de cancelamento, sinistro
   relevante ou não renovação** — resolve o problema dos "3% já vencidos" sem detecção,
   apontado no slide 14.

**LMIs mínimos por categoria** (ordem de grandeza a calibrar com corretora e atuário,
não valores definitivos):

| Categoria | RC Operações (mín.) | Incêndio/patrimônio |
|---|---|---|
| Quiosque | R$ 250 mil | Valor em risco declarado, piso por m² |
| Satélite varejo seco | R$ 500 mil | Valor em risco declarado, piso por m² |
| Alimentação com cocção | R$ 1 milhão | Valor em risco + risco de propagação |
| Saúde/estética | R$ 1 milhão + RC profissional | Valor em risco |
| Lazer infantil | R$ 2 milhões (danos corporais) | Valor em risco |
| Alto valor (joias/eletrônicos) | R$ 500 mil | Valor em risco + cláusula de roubo |
| Âncora/megaloja | R$ 5 milhões | Individual, por análise |

O **piso por m²** para a cobertura patrimonial é o que impede o caso do LMI de R$ 1,5 mil
aparecer como "aderente".

---

## 6. Consistência dos dados — verificar antes de levar ao comitê

1. **Julho parece replicar junho.** No gráfico do slide 13, todas as séries extraídas
   repetem exatamente os valores de junho em julho (181/181, 786/786, 378/378, 1223/1223).
   Ou o dado de julho não foi atualizado, ou a série está mal montada — em qualquer dos
   casos, o deck reporta "48% em jul/26" e "evolução" sobre um mês que pode não ter dado
   novo. Verificar antes de apresentar; é o tipo de erro que compromete a credibilidade
   de todo o material.
2. **"+32 p.p. vs março/26"** implica base de ~16% em março, mas o gráfico começa em abril
   (~21%). Explicitar a base de março.
3. **"−68% em sem contato"**: a série cai de 576 (abr) para 129 (mai) e **sobe** para 181
   (jun/jul). O número está correto na ponta, mas a tendência não é monotônica — apresentar
   como "−68% vs abril", não como evolução contínua.
4. **Escopo do "portfólio"**: os slides 13 e 14 tratam de 10 shoppings e ~2.570 lojas. Isso
   é o portfólio inteiro ou um piloto? O deck não diz, e a diferença muda completamente a
   leitura dos 48%.
5. **Acabamento**: numeração de páginas duplicada e inconsistente (dois slides marcados "5";
   slide 4 marcado "4" e "9"; slides 7 e 8 ambos "10"); placeholder **"Primeira reunião: XX"**
   não preenchido no slide 12; "ESTACAO CUIABA" sem acento. Em material de comitê executivo
   marcado como confidencial, isso sinaliza revisão incompleta.

---

## 7. Leitura crítica do caso Ezze — a lição estrutural não foi extraída

Cinco meses (março a julho), duas calls remarcadas e não realizadas, uma call sem retornos,
dúvidas reenviadas, e desistência unilateral da seguradora. Os aprendizados listados no
slide 12 são todos táticos (segmentação, dashboards, limites de RC, transparência). A lição
estrutural é outra e é mais dura:

**O projeto, como foi levado ao mercado, não foi atrativo o suficiente para a seguradora
tratá-lo como prioridade.** Provavelmente porque combinou exigências de produto customizado
(segmentação por operação, limites diferenciados, franquias reduzidas para quiosques,
portal de governança) com pedido de **redução de comissão** e **sem compromisso de volume
garantido** — já que, no modelo híbrido, a adesão é voluntária. Do ponto de vista da
seguradora: alto custo de desenvolvimento, receita incerta, volume não contratado.

Implicações para a Fase 1:

- **Nunca negociar em série e em exclusividade.** Ir a mercado com RFP simultâneo a 4–6
  players (massificado e corporativo), com prazo de resposta e critérios de avaliação
  publicados.
- **Levar volume agregado e compromisso.** O poder de negociação vem do portfólio
  consolidado com escopo obrigatório — o que reforça o argumento a favor do Modelo IV:
  uma camada centralizada é volume contratado, não volume esperado.
- **Separar o que é customização essencial do que é preferência.** Se o mercado massificado
  não entrega segmentação fina, avaliar produto de prateleira + camada corporativa
  centralizada em vez de tentar customizar o massificado.
- **Definir prazo de decisão e desistência.** Cinco meses para descobrir que o parceiro não
  vai seguir é custo de oportunidade evitável com gates de 30 dias.

---

## 8. Crítica ao resumo estratégico (a tese central)

> *"O shopping do futuro gerencia risco, continuidade, compliance, dados, prevenção e
> resiliência. O seguro deixa de ser proteção financeira e se torna uma camada estratégica
> de inteligência operacional."*

A tese é boa e defensável — **mas o deck não a entrega.** O que o material descreve é
cobrança de apólice com dashboard. Para que a narrativa se sustente, faltam três conexões
que hoje não existem em nenhum slide:

1. **Seguro ↔ prevenção.** Sinistralidade cai com PPCI em dia, inspeção termográfica,
   manutenção de coifas e dutos em alimentação, laudo elétrico. Nada disso está conectado
   ao programa. Um lojista com laudo elétrico e coifa certificada deveria pagar menos — e
   essa é a única forma de o seguro virar, de fato, instrumento de prevenção.
2. **Seguro ↔ comercialização.** O dado de risco por loja deveria alimentar a decisão de
   mix, a renovação contratual e a análise de crédito do lojista. Hoje o painel é um
   relatório de conformidade que não retroalimenta nenhuma decisão de negócio.
3. **Seguro ↔ programa corporativo.** Sem o elo com a apólice master, "eficiência de
   capital" não existe.

**Proposta concreta para materializar a tese:** um **Índice de Risco da Loja (IRL)**,
composto por cobertura qualificada + conformidade PPCI/laudos + histórico de sinistros e
ocorrências + categoria de operação, exibido no mesmo painel de adesão e usado como input
formal em renovação contratual, aprovação de reforma e precificação diferenciada. É o que
transforma um controle de documentos em inteligência operacional — e é barato, porque roda
sobre dados que a operação já coleta.

**Sobre os stakeholders listados**, faltam quatro que vão determinar o sucesso ou o
fracasso: as **corretoras atuais dos lojistas** (incumbentes que perderão carteira e farão
oposição ativa), as **redes nacionais e suas associações** (Abrasce/Alshop), o
**condomínio/assembleia** (veículo jurídico do enforcement sobre o estoque de contratos) e
os **credores/financiadores do empreendimento** (covenants de financiamento costumam exigir
programa de seguros — alavanca esquecida e potencialmente decisiva na negociação interna).

**Sobre os objetivos macro:** nenhum é SMART. Não têm baseline, meta numérica, prazo nem
dono. "Reduzir o custo total da apólice master" sem saber quanto ela custa hoje não é
objetivo — é intenção.

---

## 9. As dez perguntas que o comitê vai fazer e o deck não responde

1. Quanto custa hoje a apólice master, e quanto deste projeto retorna para ela?
2. Quantos sinistros com origem em loja o shopping absorveu nos últimos 5 anos, e quanto pagou?
3. Quanto custa montar e operar o programa (headcount, sistema, auditoria) por ano?
4. Qual é a economia esperada para o lojista, em R$/m², e com que evidência?
5. O shopping recebe alguma remuneração da corretora ou seguradora? Direta ou indireta?
6. Se a comissão de mercado é 30%, quanto do "ganho de escala" prometido é, na verdade, corte de comissão?
7. Quais são exatamente as coberturas e os LMIs mínimos que estamos aprovando?
8. Como isso alcança os contratos vigentes, e não só as novas locações?
9. Por que Norteshopping está em 8,2% e Cuiabá em 74,9%? Isso é modelo ou é gestão?
10. Qual é o gate de go/no-go da Fase 1, com que critério e em que prazo?

---

## 10. Recomendações — o que mudar antes de levar ao comitê

**Fase 0 — Baseline (30 dias, e ela não existe hoje no roadmap).** Levantar prêmio,
franquia e sinistralidade da apólice master; sinistros com origem em loja nos últimos 5
anos e quanto o shopping absorveu; curva de vencimento dos contratos de locação; amostra
auditada de 200 apólices vigentes para medir a distribuição real de LMI e exclusões;
parecer jurídico sobre venda casada, papel de estipulante, force-placed e alteração de
normas gerais. **Sem a Fase 0 não há decisão informada — há preferência.**

**Mudanças no material:**

| # | Mudança | Prioridade |
|---|---|---|
| 1 | Incluir business case completo (baseline, economia, custo do programa, payback) | Crítica |
| 2 | Conectar explicitamente o programa à apólice master e à retenção corporativa | Crítica |
| 3 | Trocar a métrica principal de "adesão" para "Cobertura Qualificada (% GLA)" | Crítica |
| 4 | Publicar a matriz de coberturas e LMIs mínimos por categoria | Crítica |
| 5 | Declarar quem recebe a comissão e fixar teto e transparência | Crítica |
| 6 | Adicionar o Modelo IV (centralizado por escopo) e usar matriz ponderada | Alta |
| 7 | Incluir renúncia de sub-rogação, segurado adicional e aviso de cancelamento nas regras | Alta |
| 8 | Substituir a "evidência Cuiabá" por piloto controlado e pareado | Alta |
| 9 | Adicionar as alavancas de enforcement, com destaque para force-placed | Alta |
| 10 | Reclassificar risco regulatório para Médio e exigir parecer jurídico como pré-requisito | Alta |
| 11 | Adicionar as duas vias do roadmap (locação + normas gerais/assembleia) e a curva de vencimentos | Alta |
| 12 | Corrigir o dado de julho, a base de março e o escopo do "portfólio" | Alta |
| 13 | Definir dono, meta trimestral e consequência por shopping (RACI) | Média |
| 14 | Extrair a lição estrutural da Ezze e desenhar RFP simultâneo com gates de 30 dias | Média |
| 15 | Introduzir o Índice de Risco da Loja para materializar a tese de inteligência operacional | Média |
| 16 | Revisar numeração, placeholder "XX" e acentuação | Média |

**Painel de KPIs proposto** (substituindo o atual):

- **Cobertura Qualificada (% GLA)** — métrica principal, meta por shopping.
- Adesão nominal (%) — secundária, de processo.
- % de apólices vencidas ou canceladas nos últimos 30 dias — hoje 3%, sem acompanhamento.
- Prazo médio de regularização (dias, da notificação à apólice válida).
- LMI mediano por categoria vs. mínimo exigido — mede a qualidade, não a quantidade.
- Prêmio médio por m² por categoria — a única forma de provar o ganho de escala prometido.
- Nº e R$ de sinistros com transbordo ao shopping — o resultado que de fato importa.
- Custo do programa vs. economia comprovada — o business case, medido continuamente.

---

## 11. O que o material já faz bem e deve ser preservado

- **O diagnóstico dos slides 3 e 4** é o melhor conteúdo do deck: "a exigência contratual
  não garante transferência efetiva do risco" é a frase certa, e os seis pontos de atenção
  (morosidade, falta de padrão, desconhecimento, subestimação do risco subsidiário, seguro
  tratado como custo, ausência de rito) são um diagnóstico organizacional preciso.
- **A transparência sobre o fracasso da Ezze.** Materiais executivos costumam esconder isso.
  Manter — e aprofundar a lição estrutural.
- **O reconhecimento explícito dos próprios limites** no slide 14 (LMI de R$ 1,5 mil a
  R$ 7 milhões, 3% vencidos, sem visão consolidada de risco). São exatamente os pontos que
  justificam o projeto; devem subir para o sumário executivo, não ficar no rodapé do
  penúltimo slide.
- **A tabela de riscos e mitigações do slide 10.** A estrutura é correta; falta calibrar as
  severidades e acrescentar os riscos jurídicos e concorrenciais omitidos.
