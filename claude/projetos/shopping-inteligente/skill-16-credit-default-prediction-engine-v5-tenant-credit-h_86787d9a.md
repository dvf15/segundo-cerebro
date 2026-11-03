---
title: "SKILL 16 — CREDIT & DEFAULT PREDICTION ENGINE v5 # Tenant Credit Health OS — Shopping Inteligente OS"
date: 2026-07-12
source: "claude-project-doc"
source_id: "86787d9a-0629-49e3-abb9-64bb44d5cb06"
project: "Shopping Inteligente"
tags: ["claude", "projeto", "conhecimento"]
---
# SKILL 16 — CREDIT & DEFAULT PREDICTION ENGINE v5 # Tenant Credit Health OS — Shopping Inteligente OS

SKILL 16 — CREDIT & DEFAULT PREDICTION ENGINE v5
# Tenant Credit Health OS — Shopping Inteligente OS

---

## Missão

Avaliar a saúde de crédito de lojistas atuais e candidatos, prever risco de inadimplência e devolução de ponto, e transformar cada diagnóstico em ação preventiva com dono, prazo e impacto financeiro — antes que o problema vire vacância.

Princípio central: **default de lojista raramente é evento súbito. É uma trajetória observável.** O papel desta skill é detectar a trajetória cedo e acionar o agente certo (Alavancador, Seller, Deal Conversion Layer) enquanto ainda há opções.

---

## Tese de risco

```
RISCO DE DEFAULT = f(CAPACIDADE × DISPOSIÇÃO × CONTEXTO)
```

- **Capacidade de pagar**: venda real (Master Equation), margem do segmento, custo de ocupação, estrutura de capital.
- **Disposição de pagar**: comportamento histórico de boleto, padrão de renegociação, prioridade que o operador dá àquele ponto dentro do portfólio dele.
- **Contexto**: saúde do segmento, sazonalidade, cluster do shopping, ciclo macro, posição da loja no ciclo de vida (ramp-up, maturidade, declínio).

Nenhuma variável isolada decide. Loja com venda fraca mas dono comprometido e capitalizado ≠ loja com venda ok e sócio que atrasa em todos os shoppings da região.

---

## Regra nº 1 — Segmentar antes de analisar

O mesmo modelo não serve para uma doceria familiar e para uma rede de capital aberto. Toda análise começa classificando o lojista em um dos 4 perfis abaixo. O perfil define quais dados existem, quais são confiáveis e o que "default" significa na prática.

### Perfil A — Operação familiar / independente (MEI, LTDA pequena, 1–2 pontos)

- Realidade dos dados: demonstrações inexistentes ou não auditadas; finanças PF e PJ misturadas; venda informada com risco alto de subnotificação.
- O que pesa mais: **comportamento de boleto** (dado interno, o mais confiável que temos), sinais observáveis (equipe, estoque, vitrine, horário de funcionamento), garantias pessoais e crédito do sócio.
- Risco típico: fragilidade de capital de giro. Um mês ruim vira atraso; três meses ruins viram default.
- Modo de default: inadimplência progressiva → abandono ou despejo.

### Perfil B — Franqueado

- Realidade dos dados: risco em duas camadas — saúde do franqueado (local) + saúde da rede (nacional).
- O que pesa mais: adimplência do franqueado, histórico da marca no portfólio, política da franqueadora para repasse de ponto e suporte a franqueado em dificuldade.
- Risco atenuante: franqueadora forte frequentemente substitui o operador antes de devolver o ponto — o risco real pode ser de troca de CNPJ, não de vacância.
- Modo de default: inadimplência do franqueado com possível resgate pela rede.

### Perfil C — Rede regional/nacional de capital fechado

- Realidade dos dados: demonstrações não públicas; venda informada mais estruturada mas ainda não auditável externamente.
- O que pesa mais: **comportamento cross-portfólio** — como a rede paga nos outros shoppings do grupo (Sistema Bahia como fonte quando exposto); ritmo de expansão vs. fechamento de lojas; notícias de mercado.
- Risco típico: decisão de portfólio — a rede fecha as lojas de pior performance primeiro. A pergunta não é "a rede vai quebrar?" e sim "esta loja está no quartil que a rede corta?".
- Modo de default: devolução negociada de ponto ou inadimplência estratégica como alavanca de renegociação.

### Perfil D — Capital aberto (S.A. listada) e grandes grupos

- Realidade dos dados: demonstrações públicas (CVM), releases de resultados, ratings, guidance de expansão/fechamento.
- O que pesa mais: análise fundamentalista pública + comportamento da marca no portfólio. Inadimplência clássica é rara; **o risco dominante é saída estratégica** (fechamento de lojas deficitárias anunciado em plano de reestruturação).
- Modo de default: devolução de ponto com aviso — o dano é vacância de área grande (frequentemente âncora), não crédito perdido.
- Regra prática: para Perfil D, o output principal não é "probabilidade de calote", é **probabilidade de não renovação / devolução antecipada** e o custo de reposição daquela ABL.

---

## Regra nº 2 — Hierarquia de dados

Usar sempre nesta ordem de confiabilidade:

1. **Boleto / adimplência (dado interno — ouro)**: pontualidade, dias médios de atraso, atrasos parciais, frequência de renegociação, uso de acordos, histórico de FPP e encargos. É o único dado que o lojista não consegue maquiar.
2. **Venda informada + auditoria cruzada (Master Equation)**: nunca aceitar venda declarada como verdade. Cruzar com fluxo do shopping, benchmark de vendas/m² do cluster, ticket da categoria. Delta grande entre venda informada e venda estimada = red flag de sonegação (que, ironicamente, pode significar que a capacidade de pagar é MAIOR que a declarada — tratar como risco de dado, não necessariamente de crédito).
3. **Histórico contratual**: tempo de casa, renovações anteriores, carências concedidas, descontos ativos, garantias vigentes (fiança, seguro-fiança, caução) e sua suficiência.
4. **Dados externos**: situação cadastral CNPJ/Receita (fonte gratuita), protestos e score de bureau (Serasa — requer contrato, ver política de API paga), Reclame Aqui, presença digital ativa, notícias do segmento.
5. **Sinais observáveis em campo**: redução de equipe, prateleira vazia, vitrine desatualizada, horário reduzido, promoções agressivas de queima de estoque. Input do time de operações/EV — baixo custo, altíssimo valor preditivo.

---

## Ajuste por segmento de varejo

O mesmo custo de ocupação significa coisas diferentes por categoria. Calibrar a leitura:

| Segmento | Margem típica | Sensibilidade sazonal | Leitura de risco |
|---|---|---|---|
| Moda | Média-alta | Alta (coleções, datas) | Ruptura de curva A e estoque velho antecipam queda |
| Alimentação (praça) | Baixa-média | Média | Volume é tudo; queda de fluxo bate rápido |
| Restaurantes | Média | Média | CMV e equipe pesam; atraso costuma começar nos encargos |
| Serviços/Saúde/Beleza | Alta | Baixa | Recorrência protege; atraso aqui é sinal mais grave |
| Eletro/Tech | Baixa | Alta (BF, Natal) | Capital de giro intensivo; crédito ao consumidor afeta |
| Entretenimento/Lazer | Média | Alta | CAPEX alto, breakeven longo; avaliar fase do ramp-up |
| Quiosques | Variável | Alta | Barreira de saída baixa = abandono rápido; exigir garantia proporcionalmente maior |

> Nota: caracterizações qualitativas de mercado, sem fonte validada por ativo. Confiança 6/10. Substituir por dados reais do portfólio (Sistema Bahia) quando disponíveis.

---

## Fator de Risco: Velocidade de Expansão × Intensidade de CAPEX

Padrão recorrente no varejo: a operação não quebra por falta de venda — quebra por caixa, no meio de uma expansão acelerada. O mecanismo:

1. Loja nova consome CAPEX pesado antes de gerar o primeiro real.
2. Loja em ramp-up (primeiros 12–24 meses) opera abaixo da maturidade — consome capital de giro.
3. Expansão veloz significa que uma fração grande da rede está imatura ao mesmo tempo.
4. Se o funding é dívida (ou luvas/carências agressivas negociadas com shoppings), o serviço da dívida corre mais rápido que a maturação das lojas.
5. Qualquer choque (queda de fluxo, juros, sazonalidade ruim) encontra a rede sem colchão — e o default chega em bloco, em vários shoppings simultaneamente.

**Regra central: quanto mais cara a implantação por loja e mais veloz a expansão, maior o risco — e o risco é multiplicativo, não aditivo.**

### Expansion Stress Index (ESI)

```
ESI = Velocidade × Intensidade de CAPEX × Fator de Funding
```

- **Velocidade** = lojas abertas nos últimos 12m ÷ base de lojas existente no início do período.
  - < 15% a.a.: orgânica (1,0) | 15–30%: acelerada (1,5) | 30–50%: agressiva (2,0) | > 50%: crítica (3,0)
- **Intensidade de CAPEX** (proxy por categoria quando não houver dado declarado):
  - Baixa (quiosque, serviços leves): 1,0
  - Média (moda satélite, alimentação de praça): 1,5
  - Alta (restaurante de serviço completo, academia, saúde): 2,0
  - Muito alta (entretenimento, âncora, cinema, operações com obra civil pesada): 3,0
- **Fator de Funding**: caixa próprio/lucro retido (1,0) | capital de franqueados (1,2) | dívida bancária/FIDC (1,5) | funding não identificado + expansão veloz (1,5 e marcar n.v. como red flag)

Leitura: **ESI ≥ 4,5 rebaixa automaticamente uma faixa de risco** no Tenant Credit Score, mesmo com boleto em dia. Boleto em dia durante expansão agressiva é fotografia; o ESI é a trajetória.

### Matriz de leitura rápida

| | CAPEX baixo | CAPEX alto |
|---|---|---|
| **Expansão lenta** | Risco base | Risco moderado: breakeven longo, avaliar fase do ramp-up |
| **Expansão veloz** | Risco moderado: barreira de saída baixa, pode abandonar pontos | **Zona crítica: monitoramento reforçado + garantia reforçada obrigatória** |

### Sinais específicos de stress de expansão

- % da rede com menos de 18–24 meses de operação acima de ~40% (rede estruturalmente imatura).
- Pedido de carência/luvas agressivas para abrir lojas novas **enquanto atrasa nas existentes** — sinal máximo: está financiando expansão com o caixa dos aluguéis atrasados.
- Inaugurações anunciadas e adiadas repetidamente.
- Entrada simultânea em praças secundárias sem histórico da marca.
- Perfil D: guidance de expansão + alavancagem crescente nos releases (verificável via CVM).

### Leitura por perfil

- **Perfil A**: o caso especial é a abertura da 2ª loja — dobrar a operação familiar é o salto de risco mais subestimado; o dono divide atenção, caixa e equipe.
- **Perfil B**: franqueado multi-unidade em expansão acelerada concentra o risco no operador local, mesmo com rede saudável.
- **Perfil C**: é onde este fator mais mata — rede fechada, sem transparência, crescendo com dívida. O sinal cross-portfólio (Sistema Bahia) é a melhor defesa.
- **Perfil D**: verificável publicamente; risco vira devolução em bloco de pontos deficitários quando o plano de expansão é revisado.

### O paradoxo comercial (regra de conciliação com Hunter/KA)

A marca em expansão veloz é exatamente o alvo preferencial do Hunter e do KA — e deve continuar sendo. **Expansão veloz não é kill criteria: é gatilho de estruturação.** A regra é aprovar com contrapartida proporcional ao ESI: garantia reforçada (seguro-fiança maior, caução), menos luvas/carência na negociação, cláusulas de performance no ramp-up e revisão de score trimestral em vez de anual. O sistema não deve recusar a marca quente; deve precificar o risco dela.

---

## Fator de Risco: Atraso de Inauguração (Opening Delay Risk)

O atraso de inauguração é o **primeiro dado comportamental** que o shopping tem sobre um lojista — aparece antes do primeiro boleto. E é um preditor duplo: revela stress de capital presente e antecipa default no ramp-up.

O mecanismo:

1. Obra atrasa → a carência contratual queima sem a loja faturar.
2. Lojista chega à abertura com o capital de giro já consumido pela obra estendida.
3. A loja abre descapitalizada, no pior momento do ciclo (ramp-up, quando mais precisa de fôlego).
4. O default aparece nos primeiros 6–12 meses — mas a origem estava visível meses antes, no canteiro parado.

Para o shopping, o custo é imediato mesmo sem default: fachada morta no corredor (dano de fluxo à vizinhança), aluguel não iniciado e efeito dominó em inaugurações casadas.

### Tipologia de causa (diagnóstico obrigatório via Builder)

| Causa | Gravidade | Leitura |
|---|---|---|
| Projeto/aprovação técnica (documentação, adequações) | Baixa | Fricção de processo — o Builder resolve; não penaliza crédito |
| Obra/fornecedor (empreiteira, material, cronograma) | Média | Capacidade de execução fraca — penaliza levemente e prediz problemas operacionais futuros |
| **Falta de capital (obra parada, fornecedor não pago)** | **Alta** | **Presunção de stress financeiro — a loja vai abrir queimada. Penalização plena + gatilho de ação** |
| Causa não identificada / lojista evasivo | Alta | Tratar como falta de capital até prova em contrário (n.v. como red flag) |

### Regras de leitura

- **Atraso > 30 dias** vs. cronograma contratual: Builder investiga a causa em até 7 dias. Sem diagnóstico, não há score válido.
- **Atraso > 60–90 dias sem causa técnica clara**: presunção de stress de capital → rebaixamento de uma faixa + entrada automática em monitoramento reforçado nos primeiros 12 meses pós-abertura.
- **Reincidência cross-portfólio**: marca que atrasa inauguração em um shopping do grupo tende a atrasar em todos — sinal a consultar no Sistema Bahia antes de aprovar loja nova da mesma marca. Reincidência pesa mais que um atraso isolado.
- **Combinação com ESI**: atraso de inauguração durante expansão veloz é a confirmação empírica do stress que o ESI previu — os dois juntos = faixa Laranja no mínimo, independentemente do restante do score.
- **Memória do indicador**: loja que abriu com atraso grave por capital carrega o flag por 12 meses e tem revisão de score trimestral nesse período.

### Leitura por perfil

- **Perfil A**: mais vulnerável — obra é o maior desembolso da vida do operador familiar; atraso aqui quase sempre é capital, raramente é processo.
- **Perfil B**: distinguir se o atraso é do franqueado (capital local) ou padrão da rede (projeto/implantação da franqueadora) — a segunda hipótese contamina todas as próximas lojas da marca.
- **Perfil C/D**: atrasos simultâneos em múltiplas praças são leading indicator de revisão do plano de expansão — frequentemente antecedem o anúncio público de desaceleração.

### O lado comercial (integração Alavancador/Builder)

Assim como no ESI, atraso não é só penalidade — é gatilho de oferta. Atraso por capital diagnosticado cedo é o caso de uso perfeito do **Alavancador (financiamento de obra)** e do **Builder (destravar fornecedor/cronograma)**. Salvar a inauguração custa menos que repor a loja: a régua de decisão é comparar o custo do pacote de resgate vs. custo de vacância + reposição do ponto.

---

## Tenant Credit Score (0–100)

Pesos **variam por perfil** — esta é a diferença estrutural desta skill:

| Dimensão | Perfil A (familiar) | Perfil B (franqueado) | Perfil C (rede fechada) | Perfil D (cap. aberto) |
|---|---|---|---|---|
| Comportamento de boleto (12m) | 27 | 21 | 17 | 8 |
| Custo de ocupação vs. faixa saudável | 15 | 13 | 12 | 12 |
| Tendência de venda vs. benchmark cluster | 14 | 13 | 12 | 8 |
| Saúde financeira externa (bureau/CVM) | 10 | 10 | 12 | 26 |
| Comportamento cross-portfólio | 5 | 10 | 17 | 12 |
| Risco de expansão (ESI: velocidade × CAPEX × funding) | 5 | 8 | 12 | 12 |
| Pontualidade de inauguração (histórico + causa) | 4 | 6 | 8 | 7 |
| Garantias e suficiência | 10 | 7 | 5 | 5 |
| Suporte estrutural (franqueadora/grupo) | 0 | 9 | 3 | 8 |
| Sinais de campo / operacionais | 10 | 3 | 2 | 2 |

> Modificadores de faixa (agem além do peso na tabela):
> - **ESI ≥ 4,5** rebaixa uma faixa, mesmo com boleto em dia.
> - **Atraso de inauguração > 60–90 dias por causa de capital (ou causa não identificada)** rebaixa uma faixa e ativa monitoramento reforçado por 12 meses.
> - **ESI crítico + atraso de inauguração simultâneos** = Laranja no mínimo, independentemente do score somado.

### Faixas de risco

- **80–100 — Verde**: saudável. Candidato a expansão, renovação antecipada, cross-sell Seller.
- **60–79 — Amarelo**: atenção. Monitoramento mensal, entender causa via Master Equation.
- **40–59 — Laranja**: watchlist. Plano de ação obrigatório em 15 dias com dono definido.
- **0–39 — Vermelho**: risco crítico. Acionar protocolo de recuperação ou preparar reposição (Workflow 1 preventivo).

---

## Custo de Ocupação — a métrica-ponte

```
Custo de Ocupação = (Aluguel + Encargos + FPP) / Venda Informada Ajustada
```

- Usar **venda ajustada** pela auditoria cruzada da Master Equation, não a declarada crua.
- Faixa de referência de mercado: saudável entre ~8% e 12%; moda tolera até ~15%; alimentação de praça opera apertado e sensível. **Confiança 6/10 — estimativa de mercado, validar com Sistema Bahia.**
- Regra de leitura: **nível importa menos que trajetória.** Custo de ocupação subindo por 2+ trimestres consecutivos é o leading indicator mais forte de default do sistema.

---

## Early Warning System — sinais antecedentes

Detectar a trajetória, não o evento. Gatilhos que rebaixam automaticamente o score ou a faixa:

1. Atraso migrando de **eventual → recorrente** (2+ atrasos em 6 meses, mesmo que pagos).
2. Pagamento **parcial** de boleto (paga aluguel, atrasa encargos — padrão clássico de pré-default).
3. Pedido espontâneo de **renegociação ou desconto** fora de ciclo.
4. **Custo de ocupação em alta** por 2+ trimestres.
5. Venda caindo com **fluxo do shopping estável** (pela Master Equation: problema é da loja, não do ativo).
6. Sinais de campo: equipe reduzida, ruptura visível de estoque, liquidação atípica.
7. Perfil C/D: fechamento de lojas da mesma rede em outras praças, notícias de reestruturação, downgrade de rating.
8. Vencimento de garantia sem renovação.
9. Delta crescente entre venda informada e venda estimada (deterioração da qualidade do dado = deterioração do relacionamento).
10. **ESI ≥ 4,5** ou salto de velocidade de expansão entre trimestres (rede que dobrou o ritmo de aberturas).
11. Pedido de condições agressivas para lojas novas (carência, luvas, CDU) **simultâneo a atraso nas lojas existentes** — o gatilho mais grave da lista de expansão.
12. Rede com mais de ~40% das lojas com menos de 18–24 meses de operação e CAPEX alto por loja.
13. **Atraso de inauguração > 30 dias** vs. cronograma contratual — Builder investiga causa em até 7 dias.
14. **Obra parada ou fornecedor não pago** relatado em campo — presunção de stress de capital, tratar como gatilho grave imediato.
15. Mesma marca com atrasos de inauguração em 2+ shoppings do portfólio (reincidência cross-Sistema Bahia).

Qualquer gatilho ativo = revisão do score em até 7 dias, com registro no Deal Conversion Layer.

---

## Protocolo de ação por faixa

| Faixa | Ação | Agente dono | Prazo |
|---|---|---|---|
| Verde | Renovação antecipada, oferta de expansão, plano Seller de crescimento | Seller / KA | Ciclo normal |
| Amarelo | Diagnóstico Master Equation (qual variável caiu?), conversa estruturada com lojista | Seller + EV | 30 dias |
| Laranja | Plano de recuperação: pacote Alavancador (capital de giro, renegociação estruturada com contrapartida), reforço de garantia, plano Seller intensivo | Alavancador + Seller | 15 dias |
| Vermelho | Decisão executiva: recuperar (última rodada Alavancador com garantia) OU repor (acionar Workflow 1 preventivo com a loja ainda ocupada — pipeline pronto antes da vacância) | Orquestrador + Deal Conversion Layer | 7 dias |

Regra de ouro da faixa vermelha: **começar a caçar o substituto antes do despejo, não depois.** O KPI "dias de vacância até contrato" começa a contar na prática no dia em que o risco vira crítico, não no dia da devolução da chave.

---

## Disclaimers obrigatórios (incluir em todo output)

1. **Não é decisão de crédito automatizada.** Todo score é insumo para decisão humana do EV/superintendência. Nenhuma ação de cobrança, despejo, execução de garantia ou recusa de candidato é tomada pelo sistema.
2. **Venda informada ≠ venda real.** Estimativas de venda ajustada são inferências e devem ser marcadas como tal.
3. **Assimetria por perfil.** Análises de Perfil A operam com dados escassos — a confiança do score deve ser declarada (X/10) e scores de baixa confiança não sustentam ação drástica sozinhos.
4. **LGPD.** Dados de sócios PF (CPF, score pessoal, bens) só podem ser tratados com base legal adequada e nunca expostos em outputs compartilhados. Dados de bureau exigem contrato e finalidade declarada.
5. **Benchmarks são estimativas** (confiança 6/10) até substituição por dados validados do Sistema Bahia.
6. **Perfil D**: informações públicas de companhias abertas devem citar fonte (release CVM, data). Nunca especular sobre saúde financeira de empresa listada sem fonte.

---

## Política de API paga

Fontes que exigem confirmação explícita antes de acionar: **Serasa Experian (contrato B2B), Boa Vista, Quod, Similarweb/Semrush, enriquecedores B2B.**

Mensagem obrigatória:
"Essa etapa pode exigir API/ferramenta paga ([nome]). Confirma que devo acionar? Posso executar primeiro com fontes públicas gratuitas (CNPJ/Receita, CVM, Reclame Aqui, notícias) e marcar dados não encontrados como n.v."

---

## Integração com o OS

| Situação | Conexão |
|---|---|
| Candidato novo (Workflow 1 e 2) | Score de crédito de entrada complementa Conversion Score e Investor Suitability antes da proposta |
| Lojista em amarelo/laranja | Master Equation diagnostica a variável; Seller ataca conversão/ticket; Entertainer ataca fluxo |
| Lojista em laranja | Alavancador estrutura pacote financeiro com contrapartida de garantia |
| Lojista em vermelho | Deal Conversion Layer abre oportunidade de reposição preventiva (Workflow 1) em paralelo à recuperação |
| Governança | KPI Monitor inclui: % ABL em cada faixa de risco, inadimplência líquida, taxa de recuperação de amarelos, dias de antecipação média do warning vs. default real |

---

## Saída padrão

```
Lojista / Marca:
Perfil (A/B/C/D):
Segmento:
Cluster do shopping:
Tenant Credit Score: [0–100] — Faixa: [Verde/Amarelo/Laranja/Vermelho]
Confiança da análise: [X/10] — lacunas marcadas como n.v.

Comportamento de boleto (12m): [resumo]
Custo de ocupação: [%] — trajetória: [estável/subindo/caindo]
Venda vs. benchmark cluster: [acima/dentro/abaixo]
ESI (velocidade × CAPEX × funding): [valor] — [orgânica/acelerada/agressiva/crítica]
  Lojas abertas 12m / base: [n/n] | CAPEX por loja: [baixo/médio/alto/muito alto ou R$] | Funding: [caixa/franqueados/dívida/n.v.]
Inauguração: [no prazo / atraso de X dias] — causa: [técnica/obra/capital/n.v.] | Reincidência no portfólio: [sim/não/n.v.]
Gatilhos de early warning ativos: [lista ou nenhum]

Diagnóstico (Master Equation quando aplicável):
Variável crítica: [Fluxo/Conversão/Ticket/Capital]

Recomendação: [recuperar/monitorar/reforçar garantia/repor preventivamente]
Agente responsável: [agente]
Próxima ação: [ação]
Dono: [EV/superintendente/agente]
Prazo: [prazo]
Impacto financeiro em risco: [R$ aluguel anual + custo estimado de reposição]
KPI de acompanhamento: [KPI]
```

---

## Regras críticas

- Nunca analisar sem antes classificar o perfil (A/B/C/D). Modelo único é erro estrutural.
- Trajetória > fotografia. Dois trimestres de tendência valem mais que um número absoluto.
- Boleto é o dado soberano. Quando boleto e venda declarada contam histórias diferentes, acreditar no boleto.
- Risco vermelho sem pipeline de reposição aberto é falha de processo, não de previsão.
- Score sem confiança declarada é score inválido.
- Boleto em dia não anula ESI crítico: expansão agressiva com CAPEX alto é risco de trajetória, e trajetória vence fotografia.
- Marca em expansão veloz não se recusa — se estrutura: garantia proporcional ao ESI, revisão trimestral e cláusula de performance no ramp-up.
- Atraso de inauguração sem diagnóstico de causa é score inválido: a causa (processo vs. capital) muda tudo. Salvar a inauguração via Alavancador/Builder quase sempre custa menos que repor o ponto.

