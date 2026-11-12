# Radar de Renovações

Sistema de maximização de renovação contratual de lojas-satélite em shopping center.
Transforma o *Book de Renovações* (skill `renovacao-contratos-shopping`) em um motor de
cálculo testado e em um painel operacional no mesmo padrão dos outros radares
(Radar Bazin, Radar de Operações, Radar de Dispersão de Vendas): HTML único, pt-BR,
farol por loja, base salva no navegador, exportação e "pacote do comitê" em Markdown.

## Como os três conceitos se encaixam

| Conceito | Papel no sistema |
|---|---|
| **Book de Renovações** (skill) | Fonte de todas as fórmulas: classificação, janela, 4 argumentos, matriz mix × quadrante, inflação, Tabela ABC, alçadas, degrau, bloqueios. |
| **Radar de Auditoria** (Radar de Dispersão de Vendas) | A **trava de auditoria** do Book vira uma integração de mão dupla: o sistema gera a *agenda* de quem precisa de auditoria integral e quando (6 a 3 meses antes da negociação); o radar de dispersão devolve, por CNPJ, a dispersão da curva e o status dos livros. Dispersão acima da tolerância ou auditoria fora da janela **bloqueia** a negociação. |
| **Shopping inteligente** | Premissa de gestão orientada por dados: nenhuma proposta sem base numérica, nenhum comparativo estimado, cada loja com farol, prioridade e nota de confiança, e uma fila única que diz o que fazer hoje. *Não encontrei definição escrita deste termo no vault ou nos artifacts; esta é a leitura adotada e pode ser ajustada.* |

## Arquivos

```
renovacoes/
  motor.mjs              motor puro (ESM): fórmulas do Book + heurísticas marcadas [SISTEMA]
  testar.mjs             testes contra os exemplos numéricos do Book (10% · 27,3% · 20% · 13% · 23,6%)
  exemplo.json           base fictícia de 9 lojas, só para demonstrar (marcada como exemplo no painel)
  src/painel.src.html    fonte do painel (o motor e o exemplo são embutidos na geração)
  gerar.mjs              gera radar-renovacoes.html
  radar-renovacoes.html  o painel pronto (abrir no navegador ou publicar como Artifact)
  modelo-importacao.xlsx modelo de planilha com as abas Lojas, Parametros e Instrucoes
  radar-renovacoes-como-usar.mp4 / .webm       vídeo no computador: preenchimento e análises (gravar-como-usar.cjs)
  radar-renovacoes-celular.mp4                 vídeo vertical "tela de celular" (gravar-celular.cjs + moldura-celular.py)
  base-teste/            base fictícia para o time testar: base-teste.xlsx, base-teste.json,
                         dispersao-teste.csv, guia-de-teste.md (resultados esperados) e os geradores
```

```bash
node renovacoes/testar.mjs   # deve terminar em "TODOS OS TESTES PASSARAM"
node renovacoes/gerar.mjs    # regera o painel após editar motor, exemplo ou src
```

## O fluxo (as 7 fases do Book, automatizadas)

1. **Classificar** — AMM/m² (último mês ÷ área) e Vendas/m² (média 12 m expurgada ÷ área)
   contra a média das satélites → quadrante 1 a 4. O mix vem do cadastro e fica marcado como
   *preliminar* até o comitê validar.
2. **Janela** — meses até o fim da vigência e data do último reajuste. Antes do último reajuste:
   *aguardar* (o LSR derrete). Essencial/Relevante: contato ativo de 12 a 6 meses;
   Indiferente/Ofensora: abaixo de 6. Abaixo de 6 meses o sistema exige checar o jurídico.
   Contrato vencido vira farol vermelho crítico.
3. **Due diligence e trava de auditoria** — integral em pelo menos um mês nos 6 meses anteriores
   ao início da negociação; mês sazonal não conta; dispersão acima de 15% manda reauditar.
   Fora disso é **bloqueio**, não observação. Inadimplência e ação judicial contra o shopping
   também bloqueiam.
4. **Argumentos** — os quatro do Book, sempre com o maior indicador de cada um e com a memória de
   cálculo exposta, mais um quinto a partir do histórico (abaixo). Comparativo ausente aparece como
   `[FALTA: …]`; nada é estimado. A incorporação do A% (argumento 1) só entra quando a loja **já paga
   aluguel variável**; com A% zero o argumento diz isso e fica de fora.
5. **LSR real** — matriz do Book: Relevante Q1/2/4 = média dos 2 maiores + inflação; Indiferente
   Q1/2/4 = maior + inflação; Q3 = avaliar posicionamento/permanência; Essencial = caso a caso;
   Ofensora = pode inviabilizar. Fecha com inflação, Tabela ABC e teste do perito.
6. **Alçadas** — comitê aprova o valor; coordenador 115→110%, gerente 110→105%,
   superintendente 105→100%. Degrau no 12º e 36º mês.
7. **Planejamento** — por ano: AMM base, LSR planejado, realizado, atingimento da meta, gap por
   mês, contratos vencidos.

## Histórico desde a última renovação

Cada loja pode ter `historico`: um registro por mês (competência, vendas, AMM, A% pago, custo de
ocupação) desde a última renovação ou entrada, uns 5 anos. Entra pelo cadastro (uma linha por mês),
pela aba **Historico** do Excel ou pelo JSON. Com ele o sistema:

- agrupa por ano de contrato e mostra vendas/mês, AMM médio, A% e CO/Vendas de cada ano;
- compara o CO/Vendas dos 12 primeiros meses com o dos 12 últimos; **se caiu, vira o argumento 5**
  (queda do custo de ocupação): diferença × vendas/mês ÷ AMM, que concorre com os demais na matriz
  mix × quadrante; se subiu, o argumento diz isso e fica de fora;
- preenche o que o cadastro deixou em branco (AMM do último mês, A% médio sem dezembro, vendas 12 m
  expurgadas, custo de ocupação), marcando na análise que o valor foi derivado.

O argumento 5 e a derivação são pedidos do usuário sobre o método, não parte do Book de 2011.

## Perícia: método comparativo, laudo prévio e linearidade

Fonte: *Aspectos técnicos da perícia judicial em avaliações de lojas em shopping centers* (Rodrigo
Salton Leites, 2025). Marcado `[PERÍCIA]` no código; não é regra do Book.

- **Comparáveis intra-shopping**: para cada loja, as outras satélites com área dentro de ±50%,
  contrato (início ou renovação) com até 36 meses, sem subsídio, contrato comercial, excluindo quem
  saiu, outros formatos e outliers (1,5 × IQR). Um **evento estrutural** cadastrado (reforma, expansão,
  sinistro, pandemia) tira os contratos anteriores a ele. Limites editáveis em Parâmetros.
- **Laudo prévio**: mediana dos comparáveis × área = valor locativo provável; faixa Q1 a Q3; posição
  do AMM atual e do proposto na amostra. Veredito: forte (proposto até Q3), atenção (até o máximo),
  frágil (acima do máximo). Detecta amostra bimodal (dois grupos, caso "Shopping B"). Com 3 ou mais
  comparáveis, o laudo **substitui a heurística** do teste do perito; com menos, aparece `[FALTA]`.
- **Linearidade** (aba Perícia): coeficiente de variação do AMM/m² das satélites, geral, por faixa de
  área e por piso (linear < 15%, moderada, dispersa > 30%), quanto da base está dentro de ±30% da
  média, lojas fora da curva com campo para o **racional comercial** (também no cadastro e no Excel,
  coluna "Racional comercial") e a lista de eventos estruturais.
- **Visão de laudo** (aba Laudo): proposta × laudo prévio para cada loja em negociação, com o **risco de
  perda em renovatória** em baixo, moderado ou alto. Baixo: proposta até o 3º quartil dos comparáveis e até
  10% acima do valor provável. Moderado: acima do 3º quartil, 10% a 25% acima do provável, amostra bimodal
  ou sem laudo com LSR agressivo. Alto: acima do maior comparável, mais de 25% acima do provável ou laudo
  abaixo do AMM atual (a renovatória pode reduzir o aluguel). Mostra o valor defensável (3º quartil × área),
  o excedente, a receita em risco em 60 meses e a perda esperada ponderada. O LSR não muda; limiares em Parâmetros.
- **Checklist técnico da perícia** (15 pontos) na análise de lojas com risco médio ou alto ou com
  renovatória ajuizada, e na nota Obsidian.

## Abas do painel

- **Radar** — KPIs, fila priorizada com farol e mapa de quadrantes.
- **Análise da loja** — as 7 fases, argumentos, proposta, alçadas, risco, ações, faltantes,
  nota de confiança; botão *Copiar análise (Obsidian)* no formato da skill.
- **Cadastro** — ficha completa da loja, apoio às 7 perguntas de mix, **importar Excel** (modelo com as
  abas Lojas e Parametros; LUC repetido atualiza, comparativo em branco vira `[FALTA]`), importar/exportar JSON.
- **Auditoria** — agenda para o Radar de Auditoria (CSV) e importação do CSV de dispersão.
- **Planejamento** — ano, metas, planejado × realizado, gap.
- **Comitê** — pacote Markdown de todas as lojas em negociação para a reunião semanal.
- **Laudo** — visão de laudo: risco de perda em renovatória por loja, defensável, receita em risco.
- **Perícia** — linearidade do shopping, faixas de área e pisos, lojas fora da curva com racional, eventos estruturais.
- **Parâmetros** — médias do shopping, inflação, meta, tolerâncias e pesos.
- **Como usar** — os vídeos do passo a passo (computador: preenchimento e análises; celular: resumo), o que ter em
  mãos, o preenchimento passo a passo (parâmetros, Excel, loja a loja, histórico, auditoria, renovação), como ler
  cada análise, rotina semanal/mensal/anual, erros comuns, glossário e o que é do Book, da perícia ou do sistema.

## Importação em Excel

`modelo-importacao.xlsx` tem três abas. **Lojas**: uma linha por loja-satélite, cabeçalho na linha 1,
colunas reconhecidas pelo nome (sem depender de acento, maiúscula ou ordem); datas em AAAA-MM-DD,
DD/MM/AAAA ou data do Excel; sim/não aceita sim, s, 1, x. **Parametros**: coluna A o nome do parâmetro,
coluna B o valor. **Instrucoes**: as regras acima. A leitura do arquivo usa a biblioteca SheetJS
(carregada do cdnjs, permitido pelo Artifact); o casamento de colunas e a montagem das lojas estão em
`importarLojasPlanilha` e `importarParamsPlanilha` no motor, cobertos pelos testes. Um CSV só com as
lojas também é aceito.

## Base de teste para o time

`base-teste/` traz 33 lojas fictícias: 25 cenários de renovação e 8 comparáveis contemporâneos para o laudo prévio. Cenários: caso ideal, Essencial caso a caso, Q3 e Q4,
Ofensora a menos de 6 meses, mix não validado, auditoria fora da janela, em dezembro e com dispersão
acima de 15%, inadimplência, ação judicial, renovatória ajuizada, Key Account com CDU, quiosque fora do
escopo, loja recém-entrada, contrato vencido, renovada, não renovada, só histórico, cadastro vazio,
perito frágil, preparação e inflação própria. `guia-de-teste.md` lista o que cada loja deve mostrar
(farol, fase, quadrante, LSR, bloqueios, faltantes, confiança) com data de referência 2026-10-25.
Para regerar: `node base-teste/gerar-base-teste.mjs` e `python3 base-teste/montar-xlsx.py`.

## Os vídeos

Gravados com Playwright sobre a base de exemplo, sem áudio, com legendas na tela e cursor visível,
no mesmo formato da seção "Vídeos: o passo a passo" do Radar de Dispersão de Vendas. Acompanham a
versão publicada como arquivos do Artifact; na cópia local de arquivo único a seção some sozinha.
Para regravar: `node gravar-como-usar.cjs` (computador, já converte para mp4/webm) e `node gravar-celular.cjs`, que
captura quadros nítidos em 390×844 com DPR 2, usa a base de teste e já monta o MP4 dentro da moldura
de celular (`moldura-celular.py`, precisa de Pillow e ffmpeg).

## Modelo de dados (resumo)

```json
{ "luc": "L-118", "nome": "…", "cnpj": "…", "segmento": "…", "area": 100, "formato": "satelite",
  "mix": "Relevante", "mixValidado": true, "status": "a-negociar",
  "contrato": { "inicio": "2022-07-01", "fim": "2027-06-30", "ultimoReajuste": "2026-07-01", "clausulasEspeciais": [], "subsidios": [] },
  "faturamento": { "amm": 10000, "aPctMedioSemDezembro": 1000 },
  "desempenho": { "vendas12mExpurgada": 130000, "custoOcupacao": 11960, "mesesInadimplente": 0, "saldoAberto": 0 },
  "auditoria": { "ultimaIntegral": "2026-06-15", "dispersaoPct": 4.1, "statusLivros": "auditado" },
  "juridico": { "acaoContraShopping": false, "renovatoriaAjuizada": false },
  "comparativos": { "coVendasRedePct": 11.3, "coVendasSegmentoShoppingPct": null, "ammM2Entorno": 120, "ammM2Piso": 96, "ammM2Tamanho": 108, "ammM2Concorrentes": 113, "ammM2SegmentoAbrasce": 107, "tabelaAbcM2": 135 },
  "realizado": { "ammNovo": null, "data": "", "novoFim": "" } }
```

## O que é do Book e o que é heurística deste sistema

**Do Book:** AMM/m², Vendas/m², quadrantes, janelas, trava de auditoria (6 meses, sazonal, 15%),
os 4 argumentos, a matriz de diretriz, inflação, Tabela ABC, alçadas, degrau, bloqueios, os
lembretes de renovatória.

**Deste sistema (marcado `[SISTEMA]` no código e nos textos do painel):**
- **Teste do perito automatizado** — "frágil" quando o AMM/m² proposto passa o maior comparativo
  e a Tabela ABC; "atenção" quando passa só um deles.
- **Risco renovatório** (0 a 100) — soma de fatores: Ofensora, janela 12–6, LSR agressivo,
  perito frágil, resistência do lojista, renovatória ajuizada.
- **Prioridade da fila** — ganho em 60 meses × urgência da janela × peso do mix.
- **Nota de confiança** — cai um ponto por dado faltante e por mix não validado.
- **Sugestão de mix** pelas 7 perguntas — só apoio; a classificação é do comitê.

Pesos e limiares ficam na aba Parâmetros.

## Limites

- O material-fonte é de 2011: nomenclatura interna (PES, Tabela ABC, Key Account) e conteúdo
  jurídico devem ser validados com a política vigente. Não substitui parecer jurídico.
- Só lojas-satélite. Outros formatos são aceitos no cadastro, mas ficam bloqueados como fora do escopo.
- A base vive no navegador (localStorage). Para guardar, use *Copiar base (JSON)* e salve o arquivo.
- A importação do Radar de Dispersão lê o CSV exportado por ele (CNPJ, competência, dispersão, status);
  se o formato daquele export mudar, ajuste `importarDispersao` no motor.
