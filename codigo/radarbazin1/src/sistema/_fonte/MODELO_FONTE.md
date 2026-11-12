# MODELO_FONTE — Copiloto de Decisão de Cláusulas (ALLOS)

> Fonte-da-verdade do sistema. Todos os componentes (configs, motor, console, instruções)
> devem ser fiéis a este documento. Sistema em modo **APOIO À DECISÃO** — quem decide é sempre a pessoa.

## 1. Objetivo
Apoiar a aprovação/recusa de cláusulas contratuais por marca e segmento, maximizando rentabilidade
e minimizando risco. O sistema deve ser:
- **Parametrizável a posteriori**: marcas, alçadas, tetos e fatores ficam em arquivos de config editáveis.
- **Capaz de importar cláusulas** (texto livre ou lote) e **compará-las com os filtros** (status por segmento×tipo, custo, marca, pegada de rede).
- **Operável dentro do Claude chat** (Projeto do Claude) no ambiente corporativo.

## 2. A balança de decisão
Conceder faz sentido quando: `Valor (deal + valor estratégico da marca) >= Custo + Risco + pegada de rede`.
- Status do guia (🟢/🟡/🔴) = veredito-padrão (ponto de partida).
- Marca estratégica pesa a favor (↑ tolerância). Pegada de rede pesa contra (↓ tolerância).
- `Alçada final = MAX(comporta_status, comporta_custo_efetivo, comporta_pegada)`.

## 3. Custo da concessão
- **Tipo A (computável)**: fórmula sobre os dados do contrato.
- **Tipo B (risco ordinal)**: sem R$ direto → peso 1 / 3 / 9 (Baixo/Médio/Alto).
- **Limite duro**: Compliance (Anticorrupção, PEP, LGPD, Confidencialidade) — inegociável, fora da balança.
- `CLC = custo_TipoA + (peso_TipoB * FATOR_PESO_RS)`.
- `Custo_efetivo = CLC * FR` (fator de replicação da pegada de rede).

## 4. Taxonomia (Ramo → Segmentos)
- **Acessórios**: Cosméticos; Joias e Relógios; Ótica; Outros Acessórios
- **Alimentação**: Café e lanches; Fast Food
- **Conveniência & Serviços**: Academia de Ginástica; Agência de Viagens; Educação; Farmácia; Mantimentos; Outros Serviços; Saúde; Serviços de Beleza; Serviços Financeiros
- **Diversos**: Brinquedos e Games; Papelaria e Livraria; Produtos Diversos
- **Eletrodomésticos E Eletrônicos**: Eletrodomésticos e Eletrônicos; Telefonia
- **Lar**: CAMEBA; Decoração e Construção
- **Lazer**: Cinema, teatro e show; Lazer e Diversão
- **Restaurantes**: Restaurantes
- **Roupas E Calçados**: Calçados Femininos; Calçados Geral e Masculinos; Esportes; Lojas Departamento; Moda Íntima e Praia; Vestuário Feminino; Vestuário Geral; Vestuário Infantil; Vestuário Masculino

## 5. Temas (7)
Taxa de Transferência · Reajuste · Multa · Sistema de Inf de Vendas - NAPP · Vendas · Compliance · Outros

## 6. Os 32 tipos de cláusula
Colunas: Tema | Tipo | Classe (A/AB/B/Limite) | fórmula ou peso | risco | status_default
(status_default = valor semente da matriz de recomendação, sobrescrevível por segmento)

| Tema | Tipo | Classe | Fórmula / Peso | Risco | status_default |
|---|---|---|---|---|---|
| Taxa de Transferência | Isenção de Taxa de Transferência | A | = valor integral da taxa | Baixo | Não Recomendado |
| Taxa de Transferência | Isenção 1ª Taxa de Transferência | A | = valor da 1ª taxa | Baixo | Não Recomendado |
| Taxa de Transferência | Isenção TT mesmo Grupo Econômico | A | = taxa, sem entrada de terceiro | Baixo | Não Recomendado |
| Taxa de Transferência | Redução da Taxa de Transferência | A | = % reduzido × taxa | Baixo | Não Recomendado |
| Reajuste | Alteração de Índice de Reajuste | A | = Δ índice × aluguel × prazo | Médio | Não Recomendado |
| Reajuste | Alteração de Prazo para Reajuste | A | = aluguel × meses de postergação | Médio | Não Recomendado |
| Multa | Alteração de Multa Rescisória | AB | = P(rescisão) × Δ multa | Médio | Recomendado com Ressalvas |
| Multa | Isenção de Multa Rescisória | A | = P(rescisão) × multa integral | Alto | Não Recomendado |
| Multa | Redução de Multa Rescisória Fixa | A | = P(resc) × (padrão − fixa) | Médio | Não Recomendado |
| Multa | Redução de Multa Rescisória Gradual | A | = Σ P(resc período) × multa abdicada | Médio | Não Recomendado |
| Multa | Redução de Multa Rescisória Proporcional | A | = P(resc) × (cheia − proporcional) | Médio | Não Recomendado |
| Multa | Multa por Infração Contratual | B | Peso 3 | Médio | Recomendado |
| Multa | Multa por Infração - Auditoria de Vendas | B | Peso 9 | Alto | Recomendado |
| Multa | Multa por Infração - Auditoria de Vendas (agravada) | B | Peso 9 | Alto | Não Recomendado |
| Sistema de Inf de Vendas - NAPP | Cláusula Padrão | Referencia | Peso 0 | Baixo | Recomendado |
| Sistema de Inf de Vendas - NAPP | Cláusula sem multa e custos | B | Peso 3 | Médio | Recomendado com Ressalvas |
| Sistema de Inf de Vendas - NAPP | Cláusula "Fumaça" | B | Peso 9 | Alto | Não Recomendado |
| Sistema de Inf de Vendas - NAPP | Proteção de Dados ref. ao Sistema | Limite | Não negociável | Crítico | Não Recomendado |
| Vendas | Vendas Líquidas | A | = (bruta − líquida) × % aluguel | Alto | Não Recomendado |
| Vendas | Vendas Online | AB | = vendas online não computadas × % | Médio | Recomendado |
| Vendas | Vendas Online - Fumaça | B | Peso 9 | Alto | Não Recomendado |
| Vendas | Vendas - Ship from Store / Click & Collect | AB | = vendas omni não computadas × % | Médio | Recomendado |
| Vendas | Informe Mensal de Vendas | A | Peso 1 | Baixo | Não Recomendado |
| Vendas | Informe Mensal de Vendas - 3º d.ú. | A | Peso 1 | Baixo | Não Recomendado |
| Compliance | Confidencialidade | Limite | Não negociável | Alto | Recomendado |
| Compliance | Anticorrupção | Limite | Não negociável | Crítico | Recomendado |
| Compliance | PEP - Pessoa Exposta Politicamente | Limite | Não negociável | Crítico | Recomendado |
| Compliance | Proteção de Dados (LGPD) | Limite | Não negociável | Crítico | Recomendado |
| Outros | Remoção de Benfeitorias | AB | = valor das benfeitorias não incorporadas | Médio | Recomendado |
| Outros | Perda de Benefícios | A | = benefícios não revertidos | Médio | Recomendado |
| Outros | Renúncia ao Direito de Preferência/Vigência | B | Peso 9 | Alto | Recomendado |
| Outros | Comunicação | A | Peso 1 | Baixo | Não Recomendado |

> Observação: cláusulas que PROTEGEM a Cia (Multa por Infração, Renúncia à Preferência, Perda de Benefícios) —
> "conceder" = enfraquecer a proteção. O status_default acima é a semente; a matriz real por segmento é
> parametrizável (config/recomendacoes.json) e pode ser importada da planilha original quando disponível.

## 7. Parâmetros calibráveis (ILUSTRATIVOS — editar em config/parametros.json)
- desconto_max_pct = 50 (desconto máximo que as alçadas delegadas aprovam)
- max_pracas_diretor = 4 (limite de praças do Diretor de Portfólio)
- graus_somente_diretoria = [A, B]  (quais graus vão sempre à Diretoria — parametrizável)
- graus (rótulo) e graus_criterio (definição) por grau — parametrizáveis na aba Parametrização do console:
  A = "Âncora"; B = "Alavancadora de posicionamento"; Padrao = "Padrão"
- FATOR_PESO_RS (cálculo de custo estimado por peso): 1→0,5% · 3→1,5% · 9→4,5%
- default_por_risco_pct (custo estimado por risco): Baixo 1% · Médio 3% · Alto/Crítico 6%

## 7b. Cláusulas quantitativas (custo por loja × nº de praças)
Para Taxa de Transferência (redução/isenção), Reajuste (índice e prazo) e Multa Rescisória
(alteração/redução/isenção), o custo é **calculado por loja** e o **total = custo por loja × nº de praças**
(usa o número real de praças, não o FR heurístico). Base: **aluguel mensal**; taxas e multas em **nº de
aluguéis mensais (amm)**.

- **Taxa**: `custo_loja = (taxa_padrao_amm − taxa_neg_amm) × aluguel_mensal`
- **Reajuste (índice)**: `custo_loja = aluguel_mensal × (reajuste_padrao_% − reajuste_neg_%)/100 × meses`
- **Reajuste (prazo)**: `custo_loja = aluguel_mensal × (reajuste_%/100) × meses_postergacao`
- **Multa**: `custo_loja = (multa_padrao_amm − multa_neg_amm) × aluguel_mensal × P(rescisão)/100`
- `custo_total = custo_loja × num_pracas`; `clc_% = custo_loja / aluguel_anual × 100`;
  `custo_efetivo_% = custo_total / aluguel_anual × 100`. A comporta de pegada (piso) segue as faixas normais.

## 8. Alçadas (nomenclatura oficial)
Superintendente → Diretor de Portfólio → Diretoria de Operações

## 9. Regra de roteamento (motor determinístico)
```
entrada: clausula(tema,tipo), segmento, marca(grau, num_pracas, dentro_portfolio), contrato
1. status = recomendacoes[segmento][tipo]  (fallback status_default) — informativo (veredito)
2. se classe == "Limite" (Compliance/LGPD): INEGOCIÁVEL; alçada = Diretoria de Operações; fim
3. desconto% = derivado dos campos quantitativos (taxa/multa/reajuste) ou informado
4. REGRA DE ALÇADA:
   - se grau ∈ {A, B}                                   → Diretoria de Operações
   - senão se desconto% > desconto_max_pct (50)         → Diretoria de Operações
   - senão se num_pracas == 1                           → Superintendente (até 50%)
   - senão se num_pracas <= max_pracas_diretor (4) E todas as lojas dentro do portfólio
                                                         → Diretor de Portfólio (até 50%)
   - senão (num_pracas > 4 OU loja fora do portfólio)   → Diretoria de Operações
5. custo (informativo, cláusulas quantitativas): custo_por_loja e custo_total = por loja × num_pracas
6. veredito por status (Recomendado / com Ressalvas / Não Recomendado → exceção com business case)
7. se alçada == Diretoria de Operações → montar business case (marca, grau, pegada, portfólio,
   desconto, custo por loja e total, motivo da alçada)
```
> Nota: a lógica de alçada passou a ser baseada em grau + nº de praças + portfólio + desconto (≤50%),
> substituindo os antigos tetos %/fatores/FR. O custo por loja × praças permanece como informação.

## 10. Paleta ALLOS (para console/apresentações)
Petróleo `#00616F` (primária) · Verde-escuro `#0D454A` · Teal `#368C82` · Coral `#CD5151` (negativo) ·
Menta `#6CC680` (positivo) · Âmbar `#EDA754` (atenção) · Bege `#CCC5BC` · Areia `#E5DED4`

## 11. Como será usado no Claude chat (corporativo)
1. Criar um **Projeto** no Claude (claude.ai) no ambiente corporativo.
2. Anexar os arquivos de `config/` + `instrucoes/SYSTEM_PROMPT.md` ao conhecimento do Projeto.
3. Colar uma cláusula (ou lote) no chat → o Claude classifica (tema/tipo), calcula custo/pegada,
   aplica a matriz e devolve veredito + alçada + (se preciso) business case.
4. Parametrizar depois: editar `config/marcas.csv`, `config/parametros.json`, `config/recomendacoes.json`.
