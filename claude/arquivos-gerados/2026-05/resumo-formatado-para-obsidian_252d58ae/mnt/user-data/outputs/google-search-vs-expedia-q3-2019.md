---
tipo: resumo-artigo
área: varejo-digital/marketing-de-performance
status: ativo
criado: 2026-05-21
tags:
  - google-ads
  - seo
  - online-travel
  - marketing-de-performance
  - canal-pago-vs-organico
  - case-expedia
aliases:
  - Google vs Expedia Q3 2019
  - Pressão do Google sobre OTAs
  - SEO headwinds 2019
---

# Resumo — What's Good for Google's Search Business Is Proving to Be Bad News for Expedia

> [!info] Metadados do artigo
> - **Autor:** Eric Jhonsa
> - **Veículo:** RealMoney / TheStreet
> - **Publicação:** 08/novembro/2019
> - **Empresas citadas:** [[Alphabet|GOOGL]], [[Expedia|EXPE]], [[TripAdvisor|TRIP]], [[Booking Holdings|BKNG]]

---

## Tese central

O artigo argumenta que as mudanças do [[Google Search]] — em especial a expansão de módulos pagos no topo da página (hotéis, voos) — estão **transferindo tráfego do [[SEO]] orgânico para canais pagos**, pressionando a margem das [[OTA|OTAs (Online Travel Agencies)]] enquanto reforçam o negócio de [[Google Ads]].

> [!quote] Mark Okerstrom (CEO Expedia, à época)
> "Generally, what we saw was a continued shift of essentially the free links further down the page by other modules that were inserted and ultimately a shift of traffic from the SEO channel over to some of the other products."

---

## O caso [[Expedia]]

> [!warning] Impacto financeiro
> Ações caíram **27% no pós-earnings** na quinta-feira após o resultado do 3T19.

### Indicadores reportados

- Receita e bookings ficaram **quase em linha** com o consenso.
- **EPS abaixo** das estimativas.
- Guidance de **crescimento de EBITDA ajustado para o ano** foi **cortado**:
  - Antes: **12% a 15%**
  - Depois: **5% a 8%**

### Pressão de marketing

- Gasto de [[Sales & Marketing]] no 3T19: **US$ 1,66 bilhão** (≈ **47% da receita**).
- Crescimento do S&M: **11% a/a** (vs. 7% no 2T19).
- "Direct" S&M (inclui marca + busca paga): **+14% a/a**.
- Motivo principal apontado pela companhia: **mix shift para canais de alto custo** (incluindo [[Google Search Ads]]).

> [!note] Leitura estratégica
> A combinação **receita em linha + EPS pior + corte de guidance** é o padrão clássico de **erosão por canal pago**: a empresa mantém volume, mas a cada venda compra tráfego mais caro.

---

## O caso [[TripAdvisor]]

- Também **errou as estimativas do 3T19** e caiu forte no pós-earnings.
- Companhia citou explicitamente **"incremental SEO headwinds"**.

> [!quote] Steve Kaufer (CEO TripAdvisor, à época)
> "I think you're seeing this across the industry as Google has gotten more aggressive. We know that this SEO issue is an ongoing trend and we're not predicting that it's going to turn around."

---

## O contraste: [[Booking Holdings]]

> [!success] Por que sofre menos
> Booking está **menos dependente de busca paga** porque tem mais tráfego direto (app + site) e, segundo o analista [[James Lee]] (Mizuho), obtém **maior ROI por dólar de mídia** do que a concorrência.

### Indicadores reportados

- **Superou** estimativa de EPS no 3T19.
- **Performance marketing**: **US$ 1,29 bi** (≈ **26% da receita**), **caindo 2% a/a**.
- Guidance de EPS do 4T19 abaixo do consenso — mas atribuído a **macroeconomia internacional**, não ao Google.
- Ações: **−8% na quinta**, **+2% na sexta** pós-resultado.

> [!quote] Glenn Fogel (CEO Booking, à época)
> Admitiu "some headwinds in the SEO channel", mas classificou como **modestos**, já que busca orgânica é **um canal pequeno** para Booking.

---

## O outro lado: [[Google]] no 3T19

| Métrica                          | Valor          | Variação a/a |
| -------------------------------- | -------------- | ------------ |
| Ad sales em propriedades Google  | US$ 28,65 bi   | **+19%**     |
| Consenso de receita de ads       | US$ 28,43 bi   | superado     |
| Cliques pagos                    | —              | **+18%**     |
| Preço médio do anúncio           | —              | **−2%**      |

> [!info] Origem do crescimento
> O autor sinaliza que **parte do crescimento não vem de mais buscas ou anúncios melhores**, mas de **mais "real estate" na página dedicado a resultados pagos** vs. orgânicos — algo com **limite estrutural**.

---

## Dinâmica do módulo de hotéis no Google

- Módulos de hotel/voo aparecem **no topo** da SERP em buscas de viagem.
- Propriedades de [[OTA|OTAs]], **redes hoteleiras** e **companhias aéreas** aparecem nesses módulos.
- Modelo de cobrança do Google:
  - **CPC** (cobra por clique no link), **ou**
  - **CPA/comissão** (cobra quando o clique gera reserva).
- Escolha do modelo depende de como o anunciante decide **bidar pela posição**.

---

## Implicações para [[varejo digital]] e [[marketing de performance]]

> [!todo] Pontos para discussão / aplicação
> - [ ] Revisar a dependência da minha operação em canais que o Google controla a alocação (SEO)
> - [ ] Medir o **share of organic vs. paid** ao longo do tempo
> - [ ] Construir tráfego **direto** (app, CRM, marca) como hedge contra mudanças de SERP
> - [ ] Avaliar [[ROAS]] real por canal, não só CAC blended
> - [ ] Monitorar mudanças de layout do Google como **risco operacional**, não só de marketing

---

## Conexões sugeridas

```dataview
LIST
FROM [[]]
WHERE contains(file.outlinks, this.file.link)
   OR contains(tags, "google-ads")
   OR contains(tags, "marketing-de-performance")
   OR contains(tags, "online-travel")
SORT file.mtime DESC
```

---

## Nota de uso

> [!tip] Como esta nota funciona no Obsidian
> - **[[wikilinks]]**: conectam esta nota a outras sobre os mesmos conceitos. Crie notas vazias para os links órfãos quando quiser desenvolver o tema.
> - **Dataview block**: o bloco acima preenche dinamicamente uma lista de notas relacionadas. Requer o plugin **Dataview** instalado e ativado.
> - **Callouts** (`> [!info]`, `> [!quote]`, etc.): exigem Obsidian 0.14+; funcionam nativamente.
> - **Aliases**: facilitam encontrar a nota por nomes alternativos no quick switcher.
> - **Templates**: este formato pode virar template em `Settings → Templates` para reaproveitar a estrutura em outros resumos de artigos.

---

## Confiança da síntese

**8/10**

- **Por que não 10:** todos os números acima vêm **exclusivamente do PDF enviado**. Não fiz checagem cruzada com os releases oficiais de Expedia/TripAdvisor/Booking/Alphabet do 3T19. Se algum dado for usado em decisão real, vale validar diretamente nos comunicados ao mercado das companhias e em relatórios da SEC (10-Q).
- **Por que 8 e não menos:** o artigo é fonte primária (jornalística) sobre o tema, citações e dados estão claros no texto, e a estrutura lógica do argumento foi preservada sem inferência minha.

**Fonte:** Jhonsa, Eric. *What's Good for Google's Search Business Is Proving to Be Bad News for Expedia*. RealMoney / TheStreet, 08/nov/2019. URL no PDF: realmoney.thestreet.com/investing/technology/google-search-business-bad-news-for-expedia-15160360
