# Radar Bazin

Painel de acompanhamento de carteira com farol de preço pelo método Décio Bazin,
fundamentos do último trimestre divulgado e link direto para a leitura gráfica de
cada ativo.

## Como funciona

```
data/carteira.json     posições (quantidade e preço médio por lote)
data/fundamentos.json  pesquisa por ativo: resultado, indicadores, notícias,
                       DPA usado no Bazin, fonte e nível de confiança
data/cotacoes.json     preços — reescrito automaticamente pelo workflow
data/tecnica.json      suporte, resistência, tendência — idem
data/opcoes.json       puts candidatas a "dividendo sintético" por papel — idem

src/painel.html        o painel (marcação, estilo e lógica)
scripts/gerar-painel.mjs      gera index.html e artifact/painel.html
scripts/atualizar-cotacoes.mjs  busca preços, câmbio e histórico de 1 ano
scripts/tecnica.mjs             Volume Profile + pivôs + MM21/MM200 -> níveis
scripts/opcoes.mjs              cadeia de puts (B3 e Nasdaq) + CDI + vol realizada
scripts/putsel.mjs              Black-Scholes, regras previdenciárias e nota das puts
manifest.webmanifest, icone*.png  instalação como app no celular
```

Depois de editar qualquer coisa em `data/` ou `src/`, rode:

```bash
node scripts/gerar-painel.mjs
```

Isso reescreve `index.html` (publicado no GitHub Pages) e `artifact/painel.html`
(mesmo conteúdo no formato de Artifact do Claude).

## Atualização automática

O workflow `.github/workflows/atualizar-cotacoes.yml` roda em dias úteis às
13h10, 17h10, 21h10 e 21h40 UTC — abertura da B3, meio do pregão, fechamento da
B3 e fechamento de Nova York. Ele busca os preços, reescreve `data/cotacoes.json`
e commita se algo mudou. A página aberta também refaz a leitura desse arquivo a
cada 5 minutos.

Fontes de preço, em ordem de tentativa:

1. **Yahoo Finance** (padrão, sem chave)
2. **brapi.dev** para os ativos da B3, se o secret `BRAPI_TOKEN` existir
3. **AwesomeAPI** para USD/BRL, com Yahoo como reserva

Se todos falharem para um ticker, o valor anterior é preservado e marcado como
defasado — o painel nunca substitui um preço bom por lixo.

### Publicação

`.github/workflows/publicar-painel.yml` publica a raiz do repositório no GitHub
Pages a cada push na `main`. Ative em **Settings → Pages → Source: GitHub Actions**.

## Dividendos sintéticos (venda de put)

`scripts/opcoes.mjs` roda no mesmo workflow das cotações. Para cada papel da
carteira ele baixa a lista de séries e o consolidado de negociação da B3
(`arquivos.b3.com.br`, sem chave), consulta o intradiário das séries negociadas
em `cotacao.b3.com.br`, pega o CDI
no BCB (SGS 4389) e a volatilidade realizada no Yahoo. `scripts/putsel.mjs`
avalia cada put (Black-Scholes, delta, probabilidade de exercício, yield sobre
o caixa) e dá uma nota de 0 a 100 pelas regras de carteira previdenciária:
15 a 60 dias, strike 3% a 15% abaixo do preço e nunca acima do teto Bazin,
delta entre -0,10 e -0,35, no mínimo 10 negócios no dia. Só papéis nacionais. O "preço ideal de venda" é o
limite da ordem: o maior entre o justo pela vol realizada (+5%) e o prêmio que
faz a put render, sozinha, o CDI sobre o caixa reservado. A B3 não publica
bid/ask nem posição em aberto de graça; o "último preço" das séries
brasileiras é o último negócio (intradiário quando existe, senão o do dia de
referência).

## Manutenção trimestral

Os preços se atualizam sozinhos; os fundamentos não. A cada temporada de
balanços, atualize em `data/fundamentos.json`, por ativo:

- `ultimoResultado` — período, data e resumo
- `indicadores` — números do trimestre
- `noticias` — as mais recentes, com link
- `bazin.dpa12m` e `bazin.dpaRecorrente` — se a política de proventos mudou

O campo `bazin.confianca` (1 a 10) é levado a sério pelo painel: abaixo de 6 ele
aparece em vermelho no bloco de memória de cálculo. Rebaixe quando as fontes
divergirem.

## Posições editáveis

Cada ativo tem um bloco "Ajustar posição" no detalhe. Compras e vendas
recalculam quantidade, preço médio e resultado realizado. O estado fica em
`localStorage` e, quando o painel roda como Artifact no claude.ai, também no
banco do artifact (`carteira/atual`), o que sincroniza celular e computador.
"Copiar carteira (JSON)" gera o conteúdo para `data/carteira.json`.

## O cálculo

`preço-teto = DPA ÷ yield mínimo`, com 6% como padrão de Bazin — ajustável no
próprio painel.

| Faixa | Regra |
|---|---|
| Compra forte | preço ≤ 80% do teto |
| Compra | 80% < preço ≤ teto |
| Manter | teto < preço ≤ 120% do teto |
| Reduzir | preço > 120% do teto |
| Fora do método | sem dividendo recorrente |

`dpa12m` é o dividendo publicado dos últimos 12 meses, com fonte registrada.
`dpaRecorrente` é uma estimativa com haircut sobre eventos não repetíveis (venda
de ativo, dividendo extraordinário) — é premissa, não dado divulgado, e o
critério está escrito em `bazin.premissa` de cada ativo.

## Aviso

Organização de informação pública, não recomendação de investimento.
