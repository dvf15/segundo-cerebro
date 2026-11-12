# Guia de teste — Radar de Renovações

Base fictícia com 33 lojas: 25 cenários de renovação e 8 comparáveis contemporâneos para o laudo prévio. **Antes de conferir, ajuste a "Data de referência" do painel para 2026-10-25**: os faróis e os meses restantes dependem dela.

## Como carregar

1. Abra o Radar de Renovações e vá em **Cadastro**.
2. Clique **Limpar base** (confirme) e depois **Importar Excel**, escolhendo `base-teste.xlsx` (abas Lojas, Parametros e Historico). Alternativa: **Importar JSON** colando o conteúdo de `base-teste.json`.
3. Em **Auditoria**, importe `dispersao-teste.csv` (ou cole o conteúdo): a T-113 fica dispersa, a T-101, T-105, T-120 e T-121 atualizam a dispersão e um CNPJ inexistente é apontado.
4. No topo, coloque a Data de referência em 2026-10-25.

## O que cada loja testa

| Loja | Cenário | Farol esperado | Fase | Q | LSR total | AMM proposto | Perito | Risco renov. | Risco de perda |
|---|---|---|---|---|---|---|---|---|---|
| **T-101** Maré Alta Moda Praia | Caso ideal: Relevante Q1 dentro da janela, histórico com queda de CO/Vendas (argumento 5), tudo informado. | Negociar | ativa (7.2 m) | 1 | 29,6% | R$ 9.849 | atencao | medio | moderado |
| **T-102** Café do Pátio | Essencial em negociação: cálculo caso a caso, subsídio de condomínio a retirar. | Negociar | curta (5.2 m) | 2 | 12,2% | R$ 7.181 | fragil | baixo | alto |
| **T-103** Casa Bela Decor | Indiferente em Q3 (vende mal, paga caro): avaliar permanência; sem A% (argumento 1 fora); CO/Vendas subindo (argumento 5 zero). | Preparar | monitorar (10.2 m) | 3 | — | — | indefinido | baixo | indefinido |
| **T-104** Bazar Tudo Barato | Ofensora a menos de 6 meses do fim, lojista resistente: negociar agora, checar jurídico, risco renovatório alto. | Negociar | ativa (4.1 m) | 4 | 47,1% | R$ 7.206 | forte | alto | baixo |
| **T-105** Ótica Visão Clara | Auditoria integral fora da janela de 6 meses e livros pendentes: BLOQUEIO; mix ainda não validado pelo comitê. | Bloqueado | ativa (9.2 m) | 2 | 32,7% | R$ 7.296 | fragil | alto | alto |
| **T-106** Sapataria Passo Firme | Lojista inadimplente (2 meses, saldo em aberto): BLOQUEIO, não renovar até regularizar. | Bloqueado | ativa (6.1 m) | 2 | 19,3% | R$ 8.590 | atencao | medio | alto |
| **T-107** Tech Ponto | Contrato longe do fim e ainda sujeito a reajuste: AGUARDAR (negociar antes derrete o LSR); auditoria entra como "programar", não bloqueio. | Aguardar reajuste | antes-do-reajuste (23.2 m) | 2 | 23,6% | R$ 10.134 | fragil | baixo | alto |
| **T-108** Doce Encanto | Já renovada com AMM novo registrado: entra no realizado do planejamento, farol azul. | Renovado | curta (4.1 m) | 2 | 18,5% | R$ 5.923 | fragil | medio | alto |
| **T-109** Papel & Cia | Contrato VENCIDO sem renovação: crítico, nenhuma loja pode operar vencida. | Contrato vencido | vencido (-1.8 m) | 4 | 32,1% | R$ 5.681 | forte | baixo | baixo |
| **T-110** Kids Mundo | Relevante em Q4 (vende mal, paga pouco): investigar a origem (localização × performance) antes do número; CO/Vendas da rede não dá base. | Negociar | ativa (8.1 m) | 4 | 39,8% | R$ 10.067 | forte | medio | baixo |
| **T-111** Joia Rara | Relevante Q2 que NÃO paga aluguel variável (A% = 0): argumento 1 sai da conta; pares e entorno sustentam a proposta. | Negociar | ativa (11.2 m) | 2 | 15,7% | R$ 8.854 | fragil | medio | alto |
| **T-112** Loja Sem Dados | Cadastro incompleto: sem A%, vendas, custo de ocupação, auditoria, comparativos nem histórico. Muitos [FALTA], confiança baixa, bloqueio de auditoria. | Bloqueado | ativa (6.1 m) | — | — | — | indefinido | baixo | indefinido |
| **T-113** Perfumaria Essência | Dispersão da curva de vendas de 18,2% (acima da tolerância de 15%): reauditar no mês seguinte, BLOQUEIO. | Bloqueado | ativa (7.2 m) | 2 | 23,1% | R$ 7.388 | fragil | medio | alto |
| **T-114** Esporte Total | Auditoria integral feita em dezembro (mês sazonal): não conta, BLOQUEIO. | Bloqueado | ativa (7.2 m) | 1 | 32% | R$ 13.789 | fragil | alto | alto |
| **T-115** Pet Amigo | Lojista com ação judicial contra o shopping: BLOQUEIO absoluto. | Bloqueado | ativa (9.2 m) | 1 | 23,1% | R$ 8.309 | forte | baixo | baixo |
| **T-116** Livraria Página | Ação renovatória já ajuizada: risco 100, contraproposta vincula, envolver o jurídico. | Negociar | curta (5.2 m) | 4 | 42,9% | R$ 10.864 | atencao | alto | moderado |
| **T-117** Rede Nacional Calçados | Key Account (informar a Holding) com contrato não comercial (haverá CDU) e cláusula limitante a retirar. | Negociar | ativa (6.1 m) | 2 | 22,5% | R$ 11.455 | fragil | medio | alto |
| **T-118** Quiosque Açaí Bom | Quiosque: fora do escopo do método (só lojas-satélite), bloqueado. | Bloqueado | ativa (3.2 m) | 2 | 7,3% | R$ 3.434 | atencao | baixo | moderado |
| **T-119** Nova Marca Streetwear | Loja recém-entrada (vigência até 2030) com só 10 meses de histórico: aguardar reajuste; argumento 5 pede histórico maior. | Aguardar reajuste | antes-do-reajuste (41.2 m) | 2 | 21,5% | R$ 8.017 | atencao | baixo | moderado |
| **T-120** Burger da Praça | Relevante a 3 meses do fim (atrasado para o ideal de 12 a 6): negociar já e confirmar com o jurídico; histórico com queda forte de CO/Vendas. | Negociar | curta (3.2 m) | 2 | 29,4% | R$ 9.062 | fragil | medio | alto |
| **T-121** Presentes & Afetos | Cadastro só com o histórico mensal (AMM, A%, vendas e custo de ocupação em branco): o sistema deriva do histórico e avisa. | Negociar | ativa (8.1 m) | 2 | 19,2% | R$ 7.391 | atencao | medio | moderado |
| **T-122** Butique Lux | CO/Vendas da rede muito acima da loja gera LSR enorme: teste do perito FRÁGIL, risco alto, apertar menos. | Negociar | ativa (7.2 m) | 2 | 69,6% | R$ 15.432 | fragil | alto | alto |
| **T-123** Antiga Loja Fechada | Não renovada: fica cinza, fora da fila, do mapa e do planejamento. | Não renovado | vencido (-4.8 m) | 4 | 37,5% | R$ 6.189 | forte | baixo | baixo |
| **T-124** Cozinha & Mesa | Mais de 12 meses para o fim e sem data de último reajuste: fase de preparação (levantar comparativos e pedir auditoria). | Preparar | preparacao (14.2 m) | 1 | 19% | R$ 11.662 | atencao | baixo | moderado |
| **T-125** Farmácia Vida | Essencial com inflação acumulada própria (6,1%) diferente da do shopping (4,2%). | Negociar | ativa (7.2 m) | 2 | 31,7% | R$ 10.276 | fragil | alto | alto |
| **T-126** Doce Vida Sorvetes | Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (31.2 m) | 2 | 11,3% | R$ 5.892 | atencao | baixo | alto |
| **T-127** Lingerie & Cia | Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (39.3 m) | 2 | 11,8% | R$ 9.501 | atencao | baixo | alto |
| **T-128** Mundo dos Óculos | Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (36.2 m) | 2 | 11,6% | R$ 7.487 | atencao | baixo | alto |
| **T-129** Brinque Bem | Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (42.2 m) | 2 | 12,9% | R$ 11.150 | atencao | baixo | moderado |
| **T-130** Casa da Mala | Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (34.2 m) | 1 | 13,6% | R$ 7.087 | forte | baixo | baixo |
| **T-131** Barba & Cabelo | Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (45.2 m) | 2 | 13,1% | R$ 5.484 | forte | baixo | baixo |
| **T-132** Toque Final Acessórios | Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (40.2 m) | 2 | 10,8% | R$ 5.812 | fragil | baixo | alto |
| **T-133** Fit Nutri Suplementos | Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping. | Aguardar reajuste | antes-do-reajuste (29.2 m) | 2 | 12,5% | R$ 10.331 | atencao | baixo | alto |

## Conferências por loja

### T-101 · Maré Alta Moda Praia

Caso ideal: Relevante Q1 dentro da janela, histórico com queda de CO/Vendas (argumento 5), tudo informado.

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Argumentos: 1=11,8% · 2=26,6% · 3=24,2% · 4=21,1% · 5=11,3%
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **moderado** — proposta 12,9% acima do valor provável do laudo (defensável até R$ 9.520, receita em risco R$ 67.752)
- LSR 25,4% + inflação 4,2% = **29,6%** → AMM R$ 9.849 (abertura do coordenador R$ 11.327) · perito atencao · risco medio (45)
- Histórico: 52 meses, CO/Vendas 10,9% → 10,3%
- Confiança 10/10

### T-102 · Café do Pátio

Essencial em negociação: cálculo caso a caso, subsídio de condomínio a retirar.

- Farol **Negociar** · Atrasado para o ideal (12–6). Confirmar com o jurídico que não há renovatória ajuizada
- Aviso: Negociar a retirada de cláusulas especiais e subsídios; incluir reforma como obrigação no novo contrato
- Argumentos: 1=5,9% · 2=8,6% · 3=6,3% · 4=5% · 5=7,4%
- Essencial: cálculo CASO A CASO (referência do sistema: média dos 2 maiores) — mais atenção aos valores, não aplicar fórmula mecanicamente
- Risco de perda em renovatória: **alto** — proposto R$ 180/m² acima do maior comparável (R$ 138/m²) · proposta 47,1% acima do valor provável do laudo (R$ 4.880) · laudo provável (R$ 4.880) ABAIXO do AMM atual (R$ 6.400): a renovatória pode reduzir o aluguel (defensável até R$ 5.040, receita em risco R$ 138.032)
- LSR 8% + inflação 4,2% = **12,2%** → AMM R$ 7.181 (abertura do coordenador R$ 8.258) · perito fragil · risco baixo (25)
- Histórico: 54 meses, CO/Vendas 12,1% → 11,5%
- Confiança 10/10

### T-103 · Casa Bela Decor

Indiferente em Q3 (vende mal, paga caro): avaliar permanência; sem A% (argumento 1 fora); CO/Vendas subindo (argumento 5 zero).

- Farol **Preparar** · Monitorar; contato ativo abaixo de 6 meses. Lojista pode procurar a qualquer momento
- Argumentos: 1=0% (fora) · 2=-40,3% (fora) · 3=-6,1% (fora) · 4=-9,6% (fora) · 5=0% (fora)
- Indiferente Q3: avaliar PERMANÊNCIA da operação (referência: maior argumento)
- Risco de perda em renovatória: **indefinido** — sem proposta calculável
- Histórico: 49 meses, CO/Vendas 17,5% → 18,6%
- Confiança 10/10

### T-104 · Bazar Tudo Barato

Ofensora a menos de 6 meses do fim, lojista resistente: negociar agora, checar jurídico, risco renovatório alto.

- Farol **Negociar** · Negociar agora (< 6 meses). Confirmar com o jurídico que não há renovatória ajuizada
- Aviso: Quadrante 4: antes do número, responder a ORIGEM do problema (localização × performance)
- Argumentos: 1=2,4% · 2=28,2% · 3=37,1% · 4=42,9% · 5=FALTA (fora)
- Ofensora: a ideia é que não permaneça — LSR alto pode inviabilizar (referência: maior argumento). Atenção redobrada à renovatória
- Risco de perda em renovatória: **baixo** — proposto R$ 103/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 8.540, receita em risco R$ 0)
- LSR 42,9% + inflação 4,2% = **47,1%** → AMM R$ 7.206 (abertura do coordenador R$ 8.287) · perito forte · risco alto (80)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-105 · Ótica Visão Clara

Auditoria integral fora da janela de 6 meses e livros pendentes: BLOQUEIO; mix ainda não validado pelo comitê.

- Farol **Bloqueado** · Negociar agora (12 a 6 meses do fim)
- Bloqueio: Trava de auditoria: Última integral em 2025-10-12, fora da janela de 6 meses antes de 2026-10-25 — a negociação não deveria começar · livros fiscais: pendente
- Aviso: Classificação de mix PRELIMINAR — precisa de validação do comitê comercial
- Argumentos: 1=8,2% · 2=25,1% · 3=31,8% · 4=23,6% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 146/m² acima do maior comparável (R$ 138/m²) · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 6.200, receita em risco R$ 83.760)
- LSR 28,5% + inflação 4,2% = **32,7%** → AMM R$ 7.296 (abertura do coordenador R$ 8.390) · perito fragil · risco alto (60)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 7/10

### T-106 · Sapataria Passo Firme

Lojista inadimplente (2 meses, saldo em aberto): BLOQUEIO, não renovar até regularizar.

- Farol **Bloqueado** · Negociar agora (12 a 6 meses do fim)
- Bloqueio: Lojista inadimplente (2 mês(es), R$ 19.500 em aberto) — NÃO renovar até regularizar
- Argumentos: 1=7,2% · 2=11,2% · 3=12,8% · 4=17,4% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposta 20,1% acima do valor provável do laudo · laudo provável (R$ 7.150) ABAIXO do AMM atual (R$ 7.200): a renovatória pode reduzir o aluguel · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 7.930, receita em risco R$ 86.394)
- LSR 15,1% + inflação 4,2% = **19,3%** → AMM R$ 8.590 (abertura do coordenador R$ 9.878) · perito atencao · risco medio (30)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-107 · Tech Ponto

Contrato longe do fim e ainda sujeito a reajuste: AGUARDAR (negociar antes derrete o LSR); auditoria entra como "programar", não bloqueio.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-10-01 — negociar antes derrete o LSR
- Argumentos: 1=10,4% · 2=21,7% · 3=13,4% · 4=17,1% · 5=2,8%
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 169/m² acima do maior comparável (R$ 138/m²) · proposta 48,2% acima do valor provável do laudo (R$ 6.840) · laudo provável (R$ 6.840) ABAIXO do AMM atual (R$ 8.200): a renovatória pode reduzir o aluguel (defensável até R$ 7.380, receita em risco R$ 197.664)
- LSR 19,4% + inflação 4,2% = **23,6%** → AMM R$ 10.134 (abertura do coordenador R$ 11.655) · perito fragil · risco baixo (25)
- Histórico: 36 meses, CO/Vendas 10,5% → 10,3%
- Faltantes (1): média AMM/m² — mesmo segmento (abrasce)
- Confiança 9/10

### T-108 · Doce Encanto

Já renovada com AMM novo registrado: entra no realizado do planejamento, farol azul.

- Farol **Renovado** · Atrasado para o ideal (12–6). Confirmar com o jurídico que não há renovatória ajuizada
- Bloqueio: Trava de auditoria: Última integral em 2026-04-18, fora da janela de 6 meses antes de 2026-10-25 — a negociação não deveria começar
- Argumentos: 1=13% · 2=10% · 3=15,5% · 4=10,6% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 169/m² acima do maior comparável (R$ 138/m²) · proposta 34,3% acima do valor provável do laudo (R$ 4.410) · laudo provável (R$ 4.410) ABAIXO do AMM atual (R$ 5.000): a renovatória pode reduzir o aluguel (defensável até R$ 4.620, receita em risco R$ 90.750)
- LSR 14,3% + inflação 4,2% = **18,5%** → AMM R$ 5.923 (abertura do coordenador R$ 6.811) · perito fragil · risco medio (30)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-109 · Papel & Cia

Contrato VENCIDO sem renovação: crítico, nenhuma loja pode operar vencida.

- Farol **Contrato vencido** · CRÍTICO: nenhuma loja pode operar com contrato vencido — regularizar já
- Aviso: Quadrante 4: antes do número, responder a ORIGEM do problema (localização × performance)
- Argumentos: 1=4,2% · 2=7,2% · 3=21,5% · 4=27,9% · 5=FALTA (fora)
- Indiferente Q1/2/4: maior argumento + inflação
- Risco de perda em renovatória: **baixo** — proposto R$ 103/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 6.820, receita em risco R$ 0)
- LSR 27,9% + inflação 4,2% = **32,1%** → AMM R$ 5.681 (abertura do coordenador R$ 6.533) · perito forte · risco baixo (15)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-110 · Kids Mundo

Relevante em Q4 (vende mal, paga pouco): investigar a origem (localização × performance) antes do número; CO/Vendas da rede não dá base.

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Aviso: Quadrante 4: antes do número, responder a ORIGEM do problema (localização × performance)
- Argumentos: 1=0% (fora) · 2=-10,3% (fora) · 3=40% · 4=31,3% · 5=0% (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **baixo** — proposto R$ 112/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 10.260, receita em risco R$ 20.844)
- LSR 35,6% + inflação 4,2% = **39,8%** → AMM R$ 10.067 (abertura do coordenador R$ 11.578) · perito forte · risco medio (35)
- Histórico: 51 meses, CO/Vendas 10,5% → 11,8%
- Confiança 10/10

### T-111 · Joia Rara

Relevante Q2 que NÃO paga aluguel variável (A% = 0): argumento 1 sai da conta; pares e entorno sustentam a proposta.

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Argumentos: 1=0% (fora) · 2=20,1% · 3=-5,9% (fora) · 4=2,9% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 197/m² acima do maior comparável (R$ 138/m²) · proposta 69,6% acima do valor provável do laudo (R$ 5.220) · laudo provável (R$ 5.220) ABAIXO do AMM atual (R$ 7.650): a renovatória pode reduzir o aluguel · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 5.625, receita em risco R$ 218.028)
- LSR 11,5% + inflação 4,2% = **15,7%** → AMM R$ 8.854 (abertura do coordenador R$ 10.182) · perito fragil · risco medio (45)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-112 · Loja Sem Dados

Cadastro incompleto: sem A%, vendas, custo de ocupação, auditoria, comparativos nem histórico. Muitos [FALTA], confiança baixa, bloqueio de auditoria.

- Farol **Bloqueado** · Negociar agora (12 a 6 meses do fim)
- Bloqueio: Trava de auditoria: Sem auditoria integral registrada — a negociação não deveria começar
- Aviso: Classificação de mix PRELIMINAR — precisa de validação do comitê comercial
- Argumentos: 1=FALTA (fora) · 2=FALTA (fora) · 3=FALTA (fora) · 4=-9,1% (fora) · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **indefinido** — sem proposta calculável
- Faltantes (13): vendas média 12 meses (expurgada); data da última auditoria integral; A% médio 12 meses (expurgando dezembro); custo de ocupação / CO÷Vendas da loja; CO/Vendas da mesma loja na rede OU do segmento no shopping; média AMM/m² — entorno (lojas próximas); média AMM/m² — mesmo piso; média AMM/m² — mesmo tamanho; média AMM/m² — 3 principais concorrentes no shopping; média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação; quadrante (depende das médias das satélites); Tabela ABC (R$/m²) para o espaço
- Confiança 1/10

### T-113 · Perfumaria Essência

Dispersão da curva de vendas de 18,2% (acima da tolerância de 15%): reauditar no mês seguinte, BLOQUEIO.

- Farol **Bloqueado** · Negociar agora (12 a 6 meses do fim)
- Bloqueio: Trava de auditoria: Dispersão de 18.2% na curva de vendas (tolerância 15%) — reauditar no mês seguinte
- Argumentos: 1=11,7% · 2=21,2% · 3=12,5% · 4=16,7% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 148/m² acima do maior comparável (R$ 138/m²) · proposta 25,2% acima do valor provável do laudo (R$ 5.900) · laudo provável (R$ 5.900) ABAIXO do AMM atual (R$ 6.000): a renovatória pode reduzir o aluguel · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 6.200, receita em risco R$ 89.280)
- LSR 18,9% + inflação 4,2% = **23,1%** → AMM R$ 7.388 (abertura do coordenador R$ 8.496) · perito fragil · risco medio (45)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-114 · Esporte Total

Auditoria integral feita em dezembro (mês sazonal): não conta, BLOQUEIO.

- Farol **Bloqueado** · Negociar agora (12 a 6 meses do fim)
- Bloqueio: Trava de auditoria: Auditoria de 2025-12-10 caiu em mês sazonal e não conta — reauditar
- Argumentos: 1=5,7% · 2=29,2% · 3=24,2% · 4=26,3% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 125/m² acima do maior comparável (R$ 122/m²) · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 12.760, receita em risco R$ 107.934)
- LSR 27,8% + inflação 4,2% = **32%** → AMM R$ 13.789 (abertura do coordenador R$ 15.857) · perito fragil · risco alto (60)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-115 · Pet Amigo

Lojista com ação judicial contra o shopping: BLOQUEIO absoluto.

- Farol **Bloqueado** · Negociar agora (12 a 6 meses do fim)
- Bloqueio: Lojista com ação judicial contra o shopping — NÃO renovar
- Argumentos: 1=5,9% · 2=22,2% · 3=11,1% · 4=15,6% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **baixo** — proposto R$ 111/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 9.150, receita em risco R$ 3.510)
- LSR 18,9% + inflação 4,2% = **23,1%** → AMM R$ 8.309 (abertura do coordenador R$ 9.555) · perito forte · risco baixo (20)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-116 · Livraria Página

Ação renovatória já ajuizada: risco 100, contraproposta vincula, envolver o jurídico.

- Farol **Negociar** · Atrasado para o ideal (12–6). Confirmar com o jurídico que não há renovatória ajuizada
- Aviso: Quadrante 4: antes do número, responder a ORIGEM do problema (localização × performance)
- Argumentos: 1=3,9% · 2=23,1% · 3=40% · 4=37,5% · 5=FALTA (fora)
- Essencial: cálculo CASO A CASO (referência do sistema: média dos 2 maiores) — mais atenção aos valores, não aplicar fórmula mecanicamente
- Risco de perda em renovatória: **moderado** — proposto acima do 3º quartil (R$ 114/m²): só os comparáveis do topo sustentam (defensável até R$ 10.830, receita em risco R$ 36.252)
- LSR 38,7% + inflação 4,2% = **42,9%** → AMM R$ 10.864 (abertura do coordenador R$ 12.494) · perito atencao · risco alto (100)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-117 · Rede Nacional Calçados

Key Account (informar a Holding) com contrato não comercial (haverá CDU) e cláusula limitante a retirar.

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Aviso: Negociar a retirada de cláusulas especiais e subsídios; incluir reforma como obrigação no novo contrato
- Aviso: Contrato não comercial: haverá CDU
- Aviso: Key Account: informar a Holding
- Argumentos: 1=5,3% · 2=23% · 3=10,9% · 4=13,6% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 135/m² acima do maior comparável (R$ 122/m²) · laudo provável (R$ 9.180) ABAIXO do AMM atual (R$ 9.350): a renovatória pode reduzir o aluguel · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 9.690, receita em risco R$ 136.512)
- LSR 18,3% + inflação 4,2% = **22,5%** → AMM R$ 11.455 (abertura do coordenador R$ 13.173) · perito fragil · risco medio (45)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-118 · Quiosque Açaí Bom

Quiosque: fora do escopo do método (só lojas-satélite), bloqueado.

- Farol **Bloqueado** · Negociar agora (< 6 meses). Confirmar com o jurídico que não há renovatória ajuizada
- Bloqueio: Fora do escopo do método: só lojas-satélite (âncora, megaloja, quiosque, mídia e atípicos não entram)
- Argumentos: 1=3,1% · 2=FALTA (fora) · 3=FALTA (fora) · 4=-75% (fora) · 5=FALTA (fora)
- Indiferente Q1/2/4: maior argumento + inflação
- Risco de perda em renovatória: **moderado** — sem laudo prévio (Nenhum comparável intra-shopping após os filtros.) · proposta sem laudo: montar comparáveis antes de negociar abaixo de 12 meses
- LSR 3,1% + inflação 4,2% = **7,3%** → AMM R$ 3.434 (abertura do coordenador R$ 3.950) · perito atencao · risco baixo (10)
- Faltantes (8): CO/Vendas da mesma loja na rede OU do segmento no shopping; média AMM/m² — entorno (lojas próximas); média AMM/m² — mesmo piso; média AMM/m² — mesmo tamanho; média AMM/m² — 3 principais concorrentes no shopping; média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação; Tabela ABC (R$/m²) para o espaço
- Confiança 2/10

### T-119 · Nova Marca Streetwear

Loja recém-entrada (vigência até 2030) com só 10 meses de histórico: aguardar reajuste; argumento 5 pede histórico maior.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-04-01 — negociar antes derrete o LSR
- Argumentos: 1=5,3% · 2=12,1% · 3=18,2% · 4=16,4% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **moderado** — proposta 13,2% acima do valor provável do laudo (defensável até R$ 7.440, receita em risco R$ 56.232)
- LSR 17,3% + inflação 4,2% = **21,5%** → AMM R$ 8.017 (abertura do coordenador R$ 9.220) · perito atencao · risco baixo (10)
- Histórico: 10 meses (curto demais para comparar)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico com pelo menos 18 meses (12 iniciais + 12 recentes) para comparar CO/Vendas
- Confiança 8/10

### T-120 · Burger da Praça

Relevante a 3 meses do fim (atrasado para o ideal de 12 a 6): negociar já e confirmar com o jurídico; histórico com queda forte de CO/Vendas.

- Farol **Negociar** · Atrasado para o ideal (12–6). Confirmar com o jurídico que não há renovatória ajuizada
- Argumentos: 1=12,9% · 2=29,1% · 3=17,9% · 4=21,4% · 5=15,8%
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 181/m² acima do maior comparável (R$ 138/m²) · proposta 53,6% acima do valor provável do laudo (R$ 5.900) · laudo provável (R$ 5.900) ABAIXO do AMM atual (R$ 7.000): a renovatória pode reduzir o aluguel (defensável até R$ 6.200, receita em risco R$ 189.690)
- LSR 25,2% + inflação 4,2% = **29,4%** → AMM R$ 9.062 (abertura do coordenador R$ 10.421) · perito fragil · risco medio (40)
- Histórico: 56 meses, CO/Vendas 11,2% → 10,3%
- Confiança 10/10

### T-121 · Presentes & Afetos

Cadastro só com o histórico mensal (AMM, A%, vendas e custo de ocupação em branco): o sistema deriva do histórico e avisa.

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Aviso: Derivado do histórico mensal (cadastro em branco): AMM do último mês, A% médio sem dezembro, vendas média 12 meses expurgada, custo de ocupação
- Argumentos: 1=20% · 2=2,4% · 3=6,5% · 4=10% · 5=8,3%
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **moderado** — proposta 13,9% acima do valor provável do laudo (defensável até R$ 6.820, receita em risco R$ 54.070)
- LSR 15% + inflação 4,2% = **19,2%** → AMM R$ 7.391 (abertura do coordenador R$ 8.500) · perito atencao · risco medio (30)
- Histórico: 51 meses, CO/Vendas 12,1% → 11,5%
- Confiança 10/10

### T-122 · Butique Lux

CO/Vendas da rede muito acima da loja gera LSR enorme: teste do perito FRÁGIL, risco alto, apertar menos.

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Argumentos: 1=16,5% · 2=114,3% · 3=7,7% · 4=6,2% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 220/m² acima do maior comparável (R$ 138/m²) · proposta 100,4% acima do valor provável do laudo (R$ 7.700) · laudo provável (R$ 7.700) ABAIXO do AMM atual (R$ 9.100): a renovatória pode reduzir o aluguel · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 8.540, receita em risco R$ 463.932)
- LSR 65,4% + inflação 4,2% = **69,6%** → AMM R$ 15.432 (abertura do coordenador R$ 17.747) · perito fragil · risco alto (75)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-123 · Antiga Loja Fechada

Não renovada: fica cinza, fora da fila, do mapa e do planejamento.

- Farol **Não renovado** · CRÍTICO: nenhuma loja pode operar com contrato vencido — regularizar já
- Bloqueio: Trava de auditoria: Sem auditoria integral registrada — a negociação não deveria começar
- Aviso: Quadrante 4: antes do número, responder a ORIGEM do problema (localização × performance)
- Argumentos: 1=0% (fora) · 2=FALTA (fora) · 3=FALTA (fora) · 4=33,3% · 5=FALTA (fora)
- Indiferente Q1/2/4: maior argumento + inflação
- Risco de perda em renovatória: **baixo** — proposto R$ 103/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 7.380, receita em risco R$ 0)
- LSR 33,3% + inflação 4,2% = **37,5%** → AMM R$ 6.189 (abertura do coordenador R$ 7.117) · perito forte · risco baixo (15)
- Faltantes (9): data da última auditoria integral; CO/Vendas da mesma loja na rede OU do segmento no shopping; média AMM/m² — entorno (lojas próximas); média AMM/m² — mesmo piso; média AMM/m² — mesmo tamanho; média AMM/m² — 3 principais concorrentes no shopping; média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação; Tabela ABC (R$/m²) para o espaço
- Confiança 1/10

### T-124 · Cozinha & Mesa

Mais de 12 meses para o fim e sem data de último reajuste: fase de preparação (levantar comparativos e pedir auditoria).

- Farol **Preparar** · Preparar: pedir auditoria integral e levantar comparativos
- Argumentos: 1=4,1% · 2=15,3% · 3=12,2% · 4=14,3% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **moderado** — proposto acima do 3º quartil (R$ 116/m²): só os comparáveis do topo sustentam (defensável até R$ 11.600, receita em risco R$ 45.696)
- LSR 14,8% + inflação 4,2% = **19%** → AMM R$ 11.662 (abertura do coordenador R$ 13.411) · perito atencao · risco baixo (15)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-125 · Farmácia Vida

Essencial com inflação acumulada própria (6,1%) diferente da do shopping (4,2%).

- Farol **Negociar** · Negociar agora (12 a 6 meses do fim)
- Argumentos: 1=5,4% · 2=39,7% · 3=7,7% · 4=11,5% · 5=FALTA (fora)
- Essencial: cálculo CASO A CASO (referência do sistema: média dos 2 maiores) — mais atenção aos valores, não aplicar fórmula mecanicamente
- Risco de perda em renovatória: **alto** — proposto R$ 171/m² acima do maior comparável (R$ 138/m²) · proposta 50,2% acima do valor provável do laudo (R$ 6.840) · laudo provável (R$ 6.840) ABAIXO do AMM atual (R$ 7.800): a renovatória pode reduzir o aluguel · dentro da janela de ajuizamento (12 a 6 meses) (defensável até R$ 7.380, receita em risco R$ 206.148)
- LSR 25,6% + inflação 6,1% = **31,7%** → AMM R$ 10.276 (abertura do coordenador R$ 11.817) · perito fragil · risco alto (60)
- Faltantes (1): histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 9/10

### T-126 · Doce Vida Sorvetes

Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-06-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=6,3% · 4=7,9% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposta 15% acima do valor provável do laudo · laudo provável (R$ 5.124) ABAIXO do AMM atual (R$ 5.292): a renovatória pode reduzir o aluguel (defensável até R$ 5.796, receita em risco R$ 46.096)
- LSR 7,1% + inflação 4,2% = **11,3%** → AMM R$ 5.892 (abertura do coordenador R$ 6.776) · perito atencao · risco baixo (10)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-127 · Lingerie & Cia

Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-02-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=6,8% · 4=8,5% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposta 21,1% acima do valor provável do laudo · laudo provável (R$ 7.848) ABAIXO do AMM atual (R$ 8.496): a renovatória pode reduzir o aluguel (defensável até R$ 8.856, receita em risco R$ 99.170)
- LSR 7,6% + inflação 4,2% = **11,8%** → AMM R$ 9.501 (abertura do coordenador R$ 10.926) · perito atencao · risco baixo (10)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-128 · Mundo dos Óculos

Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-11-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=6,6% · 4=8,2% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposta 19,4% acima do valor provável do laudo · laudo provável (R$ 6.270) ABAIXO do AMM atual (R$ 6.710): a renovatória pode reduzir o aluguel (defensável até R$ 6.820, receita em risco R$ 73.009)
- LSR 7,4% + inflação 4,2% = **11,6%** → AMM R$ 7.487 (abertura do coordenador R$ 8.610) · perito atencao · risco baixo (10)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-129 · Brinque Bem

Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-05-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=7,7% · 4=9,6% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **moderado** — proposto acima do 3º quartil (R$ 116/m²): só os comparáveis do topo sustentam (defensável até R$ 11.020, receita em risco R$ 47.698)
- LSR 8,7% + inflação 4,2% = **12,9%** → AMM R$ 11.150 (abertura do coordenador R$ 12.822) · perito atencao · risco baixo (10)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-130 · Casa da Mala

Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-09-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=8,3% · 4=10,4% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **baixo** — proposto R$ 109/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 7.995, receita em risco R$ 0)
- LSR 9,4% + inflação 4,2% = **13,6%** → AMM R$ 7.087 (abertura do coordenador R$ 8.150) · perito forte · risco baixo (0)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-131 · Barba & Cabelo

Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-08-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=7,9% · 4=9,9% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **baixo** — proposto R$ 114/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar (defensável até R$ 6.000, receita em risco R$ 0)
- LSR 8,9% + inflação 4,2% = **13,1%** → AMM R$ 5.484 (abertura do coordenador R$ 6.306) · perito forte · risco baixo (0)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-132 · Toque Final Acessórios

Comparável contemporâneo: contrato recente (2025), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-03-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=5,8% · 4=7,2% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposto R$ 153/m² acima do maior comparável (R$ 126/m²) · proposta 25,4% acima do valor provável do laudo (R$ 4.636) · laudo provável (R$ 4.636) ABAIXO do AMM atual (R$ 5.244): a renovatória pode reduzir o aluguel (defensável até R$ 4.712, receita em risco R$ 70.545)
- LSR 6,6% + inflação 4,2% = **10,8%** → AMM R$ 5.812 (abertura do coordenador R$ 6.684) · perito fragil · risco baixo (25)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

### T-133 · Fit Nutri Suplementos

Comparável contemporâneo: contrato recente (2024), vigência longa; não negocia agora, mas sustenta o laudo prévio e a linearidade do shopping.

- Farol **Aguardar reajuste** · Aguardar o reajuste de 2027-04-01 — negociar antes derrete o LSR
- Argumentos: 1=6% · 2=2,5% · 3=7,4% · 4=9,3% · 5=FALTA (fora)
- Relevante Q1/2/4: média dos 2 maiores argumentos + inflação
- Risco de perda em renovatória: **alto** — proposta 13,6% acima do valor provável do laudo · laudo provável (R$ 9.095) ABAIXO do AMM atual (R$ 9.180): a renovatória pode reduzir o aluguel (defensável até R$ 9.860, receita em risco R$ 74.134)
- LSR 8,3% + inflação 4,2% = **12,5%** → AMM R$ 10.331 (abertura do coordenador R$ 11.880) · perito atencao · risco baixo (10)
- Faltantes (2): média AMM/m² — mesmo segmento (abrasce); histórico mensal de vendas e custo de ocupação desde a última renovação
- Confiança 8/10

## Outras conferências

- **Planejamento 2027**: as lojas com fim em 2027 entram; a T-108 aparece como realizada (LSR realizado 22%); a T-109 conta como vencida; a T-123 não entra.
- **Comitê**: só as lojas com farol Negociar ou status em negociação entram no pacote.
- **Mapa de quadrantes**: a T-105 e a T-112 aparecem como losango (mix não validado); a T-112 não aparece se faltar vendas.
- **Excel**: reimportar `base-teste.xlsx` deve dar 0 novas e 33 atualizadas, sem perder o histórico.
- **Laudo**: a aba classifica o risco de perda em renovatória; a T-122 deve sair ALTA (acima do maior comparável), a T-101 moderada (acima do 3º quartil), e as lojas sem comparáveis saem como moderado/alto conforme o LSR.
- **Perícia**: a aba mostra a linearidade do shopping (geral, por faixa de área e por piso) e as lojas fora da curva; na análise da T-101 o laudo prévio usa os comparáveis contemporâneos (T-126 a T-133 e outros com contrato recente); a T-122 deve sair frágil também pelo laudo; lojas com contrato de 2022 sem comparáveis similares mostram [FALTA: comparáveis suficientes].
- **Cadastro**: editar a T-112 preenchendo A%, vendas e comparativos deve subir a confiança e destravar o LSR; a trava de auditoria continua até informar uma integral dentro da janela.

_Gerado por gerar-base-teste.mjs em 2026-11-08 com o motor do sistema._