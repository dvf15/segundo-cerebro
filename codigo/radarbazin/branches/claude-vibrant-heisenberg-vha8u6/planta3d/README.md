# Planta 3D de Shoppings

Maquete 3D de um shopping, com lojas e quiosques por piso, leitura de mix, comparação de
quiosques entre dois shoppings e quadro de prospecção por marca. Sai como uma página só
(`dist/planta-3d.html`), publicada como Artifact do Claude.

Cada shopping é uma pasta de dados. O código não cita nenhum shopping pelo nome.

```
config.json                 quais shoppings entram, grupos de segmento e cores, campos extras
shoppings/<id>/
  shopping.json             nome, papel, ficha, pisos, contorno do prédio, método e fontes
  lojas.json  ou  lojas.csv lista de operações
  entorno.json              ruas, entradas e prédios vizinhos (OpenStreetMap)
shoppings/_modelo/          ponto de partida para um shopping novo
src/                        a página: nucleo.js (cálculo), app.js (tela), estilo.css, corpo.html
scripts/montar.mjs          confere os dados e grava dist/planta-3d.html
scripts/novo-shopping.mjs   cria a pasta de um shopping novo
scripts/osm.mjs             busca contorno e entorno no OpenStreetMap
```

Depois de mexer em qualquer arquivo, rode `node scripts/montar.mjs` (precisa só do Node 18+,
sem instalar nada). Ele lista o que falta ou está inconsistente antes de gravar.
`node scripts/montar.mjs --conferir` só confere.

## Filtros de comparação

Um artefato só traz todos os shoppings. `filtros`, em `config.json`, define os grupos que
aparecem no seletor do topo:

```json
"filtros": [
  {"id": "tijuca-riosul", "nome": "1 · Tijuca × RIOSUL", "shoppings": ["tijuca", "riosul"], "inicial": "riosul"}
]
```

Cada filtro lista um shopping de referência (o que tiver `"papel": "meu shopping"`, ou o primeiro)
e um ou mais concorrentes. Só os shoppings do filtro ativo ficam montados na cena. O endereço da
página guarda o filtro (`#tijuca-riosul`). Para um filtro novo, acrescente os shoppings em
`shoppings` e uma linha em `filtros`.

## Torres, metrô e conexões

`conexoes`, em `shopping.json`, lista torres, hotéis, estações e empreendimentos ligados ao shopping:

```json
{"tipo": "torre", "nome": "Torre X", "descricao": "como se liga ao shopping", "piso": null,
 "acesso": "direto", "fonte": "https://...", "osm": "Torre X"}
```

`acesso` é `direto` (a fonte afirma a ligação por dentro), `pela rua` (vizinhança) ou
`a confirmar`. Com `osm` (um nome a procurar no mapa), `scripts/osm.mjs` grava a posição e a
conexão aparece marcada na maquete; sem posição, aparece só na Ficha, no Resumo e na aba Comparar.

## Vendas por shopping

`vendas`, em `shopping.json`, traz a venda dos lojistas divulgada por empresas listadas
(Multiplan, ALLOS e Iguatemi abrem o número por shopping nos releases e planilhas de RI):

```json
{"periodo": "2025", "tipo_periodo": "ano", "vendas": 1042900000, "m2": 3592.6, "abl": 24191,
 "m2_pub": 3838, "fonte": "https://...", "ordem": 2026}
```

`m2` é conta do painel (venda ÷ ABL total ÷ meses do período), igual para todos. `m2_pub` é a
venda por m² ao mês que a própria empresa publica, na base dela; só a Multiplan publica por
shopping, e sobre a área das lojas que reportam venda. A seção aparece na aba Comparar, na Ficha
e no Resumo. `coleta/aplicar-vendas.py` monta esses itens a partir de `coleta/pesquisa/vendas-<id>.json`
e usa `coleta/vendas-notas.json` para a nota de cada shopping.

## Varejistas listadas

`varejistas.json` lista as empresas listadas em bolsa donas de marcas presentes nos shoppings:
ticker, marcas (com os nomes exatos de loja que casam com cada uma) e um número por indicador
(receita, lojas, área de vendas, venda por m², vendas mesmas lojas), cada um com período e fonte.
A página liga cada loja à empresa, mostra a tabela na aba Comparar, uma linha no detalhe da loja
e o destaque "Varejistas listadas" na maquete. Número com `"conf": false` veio só do resumo de um
buscador e aparece como "a conferir". `coleta/aplicar-varejistas.py` gera o arquivo a partir de
`coleta/pesquisa/varejo-<TICKER>.json`.

## De onde vêm os dados (`coleta/`)

- `coleta/multiplan.py`: diretório de lojas dos sites da Multiplan (DiamondMall, Anália Franco,
  ParkShopping São Caetano), a partir do sitemap e da página de cada loja.
- `coleta/nova-america.py`: diretório do site do Nova América.
- `coleta/osm-api.py`: vizinhança pela API oficial do OpenStreetMap, para quando o Overpass cai.
  `coleta/juntar-osm.py` junta contorno e entorno quando o prédio está mapeado em vários blocos.
  `coleta/osm/` guarda as respostas usadas.
- `coleta/aplicar-pesquisa.py` leva para `shopping.json` uma pesquisa de fontes públicas
  (ficha, projeto, pisos e conexões). `coleta/pesquisa/` guarda cada item com o link e o
  trecho da fonte, para conferência.
- Shoppings da ALLOS (Tijuca, NorteShopping, Boulevard BH, Mooca Plaza) não têm lista embutida:
  entram por relação colada na aba Lojas ou por `lojas.csv`.

`config.zona-norte.json` é um exemplo de painel separado, com `"base"` e `"saida"`
(`node scripts/montar.mjs --config config.zona-norte.json`).

## Incluir outro shopping

1. `node scripts/novo-shopping.mjs barra "BarraShopping" --papel concorrente`
   cria `shoppings/barra/` e inclui o id em `config.json`. Um dos shoppings pode ter
   `"papel": "meu shopping"`: ele vira a referência da comparação e não ganha quadro de prospecção.
2. `node scripts/osm.mjs barra --way <id>` grava o contorno real e o entorno. O id é o do
   prédio em openstreetmap.org (botão "Consultar elementos" sobre o shopping). Sem rede até o
   OpenStreetMap, use `--so-consulta`, rode a consulta em overpass-turbo.eu, exporte os dados
   brutos e passe o arquivo com `--arquivo`.
3. Lista de lojas, por um destes caminhos:
   - `shoppings/barra/lojas.csv`, exportado do Excel. Só **Nome** e **Piso** são obrigatórios.
     Colunas reconhecidas: Segmento, Tipo, LUC, Área, Situação, mais os campos extras do
     `config.json`. Modelo em `shoppings/_modelo/lojas.exemplo.csv`.
   - `lojas.json`, quando houver desenho próprio de cada loja (`poly`, em metros). É o caso do RIOSUL.
   - colar a relação na própria página (aba Lojas). Fica só no navegador de quem colou.
4. Preencher `shopping.json`: ficha, pisos, fontes. Valor `null` aparece na página como
   `[FALTA: dado]`, de propósito: nada é estimado para preencher lacuna.
5. `node scripts/montar.mjs` e publicar `dist/planta-3d.html`.

Lojas sem `poly` entram na planta esquemática automática: fileira externa, corredor com
quiosques, ilha central e átrio, na ordem do código (LUC) e proporcionais à área.

## Incluir novas informações

**Sobre o shopping.** Acrescente um item em `ficha`, em `shopping.json`:

```json
{"chave": "taxa_ocupacao", "rotulo": "Taxa de ocupação", "valor": null, "unidade": "%", "fonte": "relatório 3T26"}
```

Ele aparece na aba Ficha. Para subir ao topo da página, cite a chave em `kpis`. `fonte` vira
etiqueta ao lado do valor e `nota` vira complemento do texto.

**Sobre cada loja.** Declare o campo em `config.json`:

```json
"campos": [
  {"chave": "obs", "rotulo": "Observação", "tipo": "texto"},
  {"chave": "vencimento", "rotulo": "Vencimento do contrato", "tipo": "texto", "agrupar": true},
  {"chave": "aluguel_m2", "rotulo": "Aluguel", "tipo": "numero", "unidade": "R$/m²", "fonte": "base interna"}
]
```

e preencha a coluna com o mesmo rótulo (ou a chave) no `lojas.csv`, ou a propriedade com a chave
no `lojas.json`. O campo entra no detalhe da loja, na busca e no CSV da base; com
`"agrupar": true` ganha um gráfico na aba Mix.

**Correção pontual com fonte.** `ajustes`, em `shopping.json`, troca a área estimada de uma loja:

```json
"ajustes": {"H&M": {"area": 1400, "etiqueta": "imprensa", "faixa": "de onde veio o número"}}
```

**Texto de método e fontes.** `metodo` e `fontes`, em `shopping.json`. Em `metodo`, os marcadores
`{ops}`, `{com_codigo}`, `{quiosques}`, `{quiosques_oficiais}`, `{quiosques_inferidos}` e
`{ficha:chave}` são trocados pelos números da base.

**Segmentos.** `grupos` (nome e cor), `regras_grupo` (palavras que levam uma categoria a um
grupo, testadas na ordem) e `area_referencia_m2` (área usada quando a lista não traz área) ficam
em `config.json`.

## Convenções dos dados

- **Pisos** (`niveis[].id`): `L1`, `L2`… para pisos de lojas, `G1`… para garagens, `SS` para
  subsolo. Só os pisos `L` têm o vão do átrio. A ordem em `niveis` é de baixo para cima.
- **Tipo** da operação: Loja, Quiosque, Âncora, Megaloja, Restaurante, Alimentação, Serviço, Lazer.
- **Situação**: Em operação, Em obras, Em breve.
- **Coordenadas**: metros a partir do centro do prédio, x para leste e y para norte.
- **Loja no `lojas.json`**: `nome`, `nivel`, `categoria`, `grupo`, `tipo`, `status`, `luc`,
  `area_est`, `fachada_est`, `faixa` (de onde vem a área), `slug` (para `link_loja`) e, se houver,
  `poly` e `anel`.

## Publicar

A página usa duas capacidades do Artifact: `db` e `user`. O quadro de prospecção de cada
shopping fica em `data/users/<id de quem vê>/quadro-<id do shopping>`, privado de cada pessoa,
com cópia no navegador. Ao publicar, declare `capabilities: {db: {}, user: {}}`.

As decisões não passam de um Artifact para outro sozinhas. Para levar: "Copiar decisões em CSV"
na página antiga e "Trazer decisões de um CSV" na nova (aba Prospecção).

## O que este projeto não faz

- Não coleta a lista de lojas de sites. Cada site tem um formato, e alguns bloqueiam leitura
  automática. A lista do RIOSUL aqui é a coleta de 12/11/2026 do diretório público; para
  atualizar, é preciso refazer a coleta ou trocar o arquivo.
- Não desenha a planta real. Posição dentro do piso é esquemática, e áreas sem fonte são
  estimativas (ver `faixa` de cada loja).
