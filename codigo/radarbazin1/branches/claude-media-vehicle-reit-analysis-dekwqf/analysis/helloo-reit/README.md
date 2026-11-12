---
title: "Helloo como REIT — MOC"
aliases: [Helloo REIT MOC, Mapa Helloo REIT, índice Helloo REIT]
tags: [MOC, indice, real-estate, REIT, FII, midia-ooh, helloo]
created: 2026-06-26
cssclass: moc
---

# 🗺️ Helloo como um REIT? — Mapa de Conteúdo (MOC)

Análise estratégica preparada para discussão de board. Avalia se um veículo de
mídia digital de elevador/prédios ([[DOOH]]) como a [[Helloo]] pode ser estruturado
sob a lógica de um [[REIT]], à luz da cobertura da [[Green Street]], com os cases
comparáveis e o equivalente regulatório brasileiro ([[FII]] vs [[FIDC]]).

> [!success] Resposta curta
> [[Helloo]] é **locatária** de espaço, não dona de imóvel → **não cabe em [[REIT]]/[[FII]]**.
> Via correta: securitizar recebíveis via **[[FIDC]]**.

## 🧭 Navegação (notas)
- **Tese** → [[Tese - Helloo como REIT]]
- **Cases comparáveis** → [[Cases - OOH que viraram REIT]]
- **Legislação BR** → [[Legislação - FII vs FIDC vs CRI]]
- **Cobertura Green Street** → [[Green Street - cobertura de setores]]
- **Perfil do alvo** → [[Helloo - perfil do negócio]]

## 🧩 Conceitos
[[REIT]] · [[FII]] · [[FIDC]] · [[CRI]] · [[CR genérico]] · [[§1033(g)(3)]] ·
[[Treas. Reg. §1.856-10]] · [[DOOH]] · [[Green Street]] · [[CPPI]]

## 🏢 Empresas
[[Helloo]] · [[Eletromidia]] · [[Lamar Advertising]] · [[Outfront Media]] ·
[[Clear Channel Outdoor]] · [[American Tower]] · [[Crown Castle]] · [[Focus Media]] ·
[[Captivate]] · [[Allos]]

## 📎 Artefatos nesta pasta
- `Helloo_REIT_Board_ALLOS.pptx` — deck de 10 slides (paleta ALLOS) para o board.
- `build_deck.py` — script python-pptx que gera o deck.
- `conceitos/` — notas-stub de conceitos e empresas (resolvem o grafo do Obsidian).

---

## Análise completa (escrita)

> Nota: análise baseada em fontes públicas. Não constitui aconselhamento
> jurídico, tributário ou de investimento.

---

## TL;DR (resposta ao board)

**Mídia OOH já virou REIT — mas apenas em billboards (outdoors), porque o operador
é DONO da estrutura física.** A Helloo é o caso oposto: é **locatária/licenciada**
de espaço em prédios de terceiros. Seu ativo econômico é o **contrato + recebível
publicitário**, não um imóvel. Portanto **não se enquadra como REIT** (EUA) nem como
**FII** (Brasil). O caminho viável para acessar mercado de capitais a partir desses
ativos é **securitizar os recebíveis** — estrutura recomendada: **FIDC**
(alternativa: CR genérico / debênture). **FII e CRI estão descartados** por falta de
natureza imobiliária.

---

## 1. Tese

A intuição de origem é correta: **ativo físico de longa duração + fluxo de "aluguel"
previsível ligado a uma localização = candidato natural a REIT.**

- **Lógica do REIT:** elimina o imposto corporativo na entidade em troca de
  distribuir **≥90%** do lucro tributável. Premia negócios intensivos em ativo com
  caixa estável.
- **Onde já funcionou além do "tijolo":** torres de telecom (American Tower, Crown
  Castle), data centers, e — o caso mais próximo de mídia — outdoors/billboards.
- **O teste decisivo:** a renda precisa ser **"rents from real property"** (≥75% da
  receita bruta). O veículo tem de **deter** um imóvel/estrutura permanente e alugá-lo.
- **Onde a tese quebra para a Helloo:** mídia de elevador **não aluga imóvel** — vende
  espaço publicitário (serviço). A receita é operacional/ativa, não aluguel passivo.

**Conclusão da tese:** o REIT recompensa quem é **dono do espaço** — não quem **opera
mídia** dentro do espaço de outro.

---

## 2. Cases semelhantes

### 2.1. Billboards que viraram REIT (o precedente direto)

| Empresa | Status | Marcos |
|---|---|---|
| **Lamar Advertising (LAMR)** | REIT desde 1/jan/2014 | Pediu ruling ao IRS em nov/2012; PLR favorável em **23/abr/2014**; driblou a "no-rule list" (Rev. Proc. 2014-3) via eleição **§1033(g)(3)** (outdoor = real property); IRS confirmou aluguel de painel = "rents from real property"; E&P pré-REIT ~US$ 40 mi. |
| **Outfront Media (OUT, ex-CBS Outdoor)** | REIT desde 17/jul/2014 | IPO de 19% em mar/2014; PLR favorável em **16/abr/2014**; separação total da CBS em 16/jul/2014; rebatizada Outfront Media (NYSE: OUT) em nov/2014. |
| **Clear Channel Outdoor (CCO)** | **NÃO** converteu | Explorou a ideia, mas alavancagem alta (meta de 7–8x net leverage até 2028) é incompatível com distribuir 90%. Sem REIT = sem obrigação de dividendo; prioriza reduzir dívida. |

**Leitura:** o gatilho da conversão não é só jurídico — é também **estrutura de
capital**. Empresas muito alavancadas não conseguem cumprir o payout de 90%.

### 2.2. Players de mídia indoor/elevador no mundo (nenhum é REIT)

| Empresa / ativo | Tipo de ativo | Estrutura | REIT/FII? |
|---|---|---|---|
| American Tower / Crown Castle | Torres de telecom (dono) | REIT (EUA) | **SIM** |
| Lamar / Outfront | Outdoors/billboards (dono) | REIT (EUA) | **SIM** |
| Focus Media (China) | Mídia de elevador | Media company (bolsa, via VIEs) | NÃO |
| Captivate (EUA) | Mídia de elevador/lobby | Private equity / TEGNA | NÃO |
| Eletromidia (Brasil) | OOH/DOOH (concessão + licença) | Operacional (Globo, fechou capital 2025) | NÃO |
| **Helloo (Brasil)** | Mídia de elevador (licença) | Operacional (Grupo Allos) | NÃO |

**Padrão claro:** quem é **dono** do ativo físico (torre, painel) vira REIT; quem
**opera** mídia indoor sob licença permanece **empresa operacional** — em todos os
mercados.

> Observação factual: a **Helloo** foi adquirida pela **BRMalls** (set/2021) e hoje
> integra o **Grupo Allos** (fusão BRMalls + Aliansce Sonae, 2023). Não confundir com
> a Eletromidia (que incorporou a Elemidia e foi controlada pela Globo).

### 2.3. O ponto crítico — DONO vs LOCATÁRIO

| | Billboard (Lamar/Outfront) → cabe em REIT | Elevador/indoor (Helloo) → não cabe |
|---|---|---|
| Propriedade | **Possui** o painel, fixado permanentemente | Instala telas em prédios **de terceiros** via licença |
| Real property | Outdoor c/ eleição §1033(g)(3) é estrutura inerentemente permanente | Tela = bem móvel; contrato de exibição = serviço |
| Renda | Aluga o espaço do painel = "rents from real property" | Vende publicidade (verba de anunciante) — renda operacional |
| Testes 75%/95% | **Passa** | **Reprova** |

---

## 3. Como a Green Street cobre o setor

- **Billboard NÃO é setor próprio na Green Street:** não está no índice de preços
  (**CPPI**) nem nas listas públicas de setores. Pesos do CPPI "All Property": retail
  20%, apartment 15%, health care 15%, industrial 12,5%, office 12,5%, lodging 7,5%,
  data center 5%, net lease 5%, self-storage 5%, manufactured home 2,5% — **sem
  billboards**.
- **Atenção à confusão comum:** o "Billboard REIT Index" que aparece em buscas
  (Lamar + Outfront) é da **Hoya Capital**, **não** da Green Street.
- **A Green Street cobre o "não-tradicional":** data centers, torres, gaming,
  self-storage, net/ground lease, cold storage, life science, senior/student housing
  — e lançou em 2025 uma vertical de **Infraestrutura** (torres, data centers,
  aeroportos, rodovias, ferrovias).
- **Leitura para o board:** a Green Street é simpática à tese "fluxo previsível +
  ativo físico = real estate", mas a aplica a **torres e data centers**, não a
  billboards nem a mídia indoor. Jim Sullivan (Green Street): as tendências de
  crescimento das torres superam "a maioria dos tipos tradicionais de real estate".
  A fronteira do "novo REIT" hoje é **infra/digital** — mídia indoor não está no radar
  como real estate.

> Limitação: greenstreet.com bloqueia acesso automatizado (HTTP 403). A conclusão de
> "ausência de cobertura de billboard" baseia-se na não-aparição do setor em todas as
> listas públicas (CPPI, setores, infraestrutura). Confirmação definitiva exigiria
> acesso autenticado ao portal de research.

---

## 4. Legislação — Brasil (FII vs FIDC vs CRI)

| Objetivo | Veículo | Base legal | Cabe à Helloo? |
|---|---|---|---|
| Deter o imóvel (laje, prédio, terreno) | **FII** | Lei 8.668/93; Res. CVM 175, Anexo III | NÃO |
| Publicidade em fachada de imóvel próprio | FII (receita acessória) | Res. CVM 175 | NÃO |
| Securitizar recebíveis de anunciantes | **FIDC** | Res. CVM 175, Anexo II | **SIM** |
| Emissão pública lastreada em recebíveis | CR genérico (securitizadora) | Lei 14.430/2022 | Alternativa |
| Lastro imobiliário específico | CRI | Lei 14.430/2022 | NÃO |

- **FII não serve:** telas e contratos de mídia não são "empreendimento imobiliário".
  Não há FII de mídia/OOH na B3 — nem de torres de telecom (ao contrário dos REITs de
  torres americanos). A única ponte seria o **FII dono dos prédios** capturar receita
  de mídia como **item acessório** do imóvel — o que não monetiza o negócio da Helloo.
- **Marco da Securitização (Lei 14.430/22):** criou o **CR genérico**, que securitiza
  qualquer recebível. Mas a **isenção de IR para PF só vale para CRI/CRA**, não para o
  CR genérico — o que reduz o apelo tributário frente ao CRI.
- **CRI descartado:** exige lastro em crédito imobiliário; recebível publicitário não é.

---

## 5. Recomendação

1. **Recomendado — FIDC** lastreado nos recebíveis dos contratos de anunciantes.
   Adquire os direitos creditórios e emite cotas (sênior/mezanino/subordinada).
   Antecipa caixa, permite *true sale* (desconsolidação de balanço) e estrutura risco
   por tranches — perfil ideal para carteira pulverizada e recorrente de anunciantes.
2. **Alternativa — CR genérico via securitizadora** (Lei 14.430/22): rótulo de mercado
   de capitais e acesso a investidores de renda fixa. Custo: sem isenção de IR para PF.
   Debênture com cessão fiduciária dos recebíveis é uma variante.
3. **Descartados — REIT, FII e CRI:** todos exigem natureza imobiliária que a Helloo
   não possui.
4. **Se o objetivo é uma tese de equity:** o caminho do setor é **equity de empresa
   operacional** (Eletromidia/B3, Focus Media/bolsa) ou private equity — não um veículo
   imobiliário.

### Próximos passos
- Validar tributação FIDC vs CR genérico com estruturador/assessor jurídico (IR e
  desconsolidação de balanço).
- Mapear a carteira de recebíveis (concentração por anunciante, prazo médio,
  inadimplência, recorrência) — define viabilidade e rating das tranches.
- Definir o objetivo real: caixa/antecipação (→ FIDC) vs narrativa de "ativo
  imobiliário" (→ não se sustenta juridicamente).
- Benchmark de equity: estudar o múltiplo de Eletromidia/Focus Media como operacional.
- Para confirmar a visão da Green Street sobre OOH, obter acesso autenticado ao portal.

---

## Fontes

**Conversões OOH → REIT (EUA):**
- Lamar 8-K (REIT/PLR/§1033(g)(3)): https://www.sec.gov/Archives/edgar/data/0001090425/000119312514003519/d653413dex991.htm
- Lamar 8-K (E&P pré-REIT ~US$40 mi): https://www.sec.gov/Archives/edgar/data/0001090425/000119312514208976/d732431dex991.htm
- Law360 — Lamar Lands IRS Approval: https://www.law360.com/articles/531147/lamar-advertising-lands-irs-approval-for-reit-conversion
- CBS Outdoor 8-K (separação/REIT): https://www.sec.gov/Archives/edgar/data/0001579877/000119312514270475/d754744dex991.htm
- Outfront IR — CBS Obtains Favorable REIT Ruling: http://investor.outfrontmedia.com/who-we-are/investor-relations/investor-news/press-release-details/2014/CBS-Obtains-Favorable-REIT-Ruling-From-The-IRS/default.aspx
- PR Newswire — CBS Outdoor to Become Outfront Media: https://www.prnewswire.com/news-releases/cbs-outdoor-to-become-outfront-media-732080860.html
- Clear Channel Outdoor — Q2 2025 (não-REIT): https://investor.clearchannel.com/news/detail/543/clear-channel-outdoor-holdings-inc-reports-results-for-the-second-quarter-of-2025
- Seeking Alpha — Billboard REITs: https://seekingalpha.com/article/4317208-billboard-reits-in-your-face-under-radar

**Tratamento do IRS (real property / outdoors):**
- 26 CFR §1.856-10 (definição de real property): https://www.law.cornell.edu/cfr/text/26/1.856-10
- Federal Register — Definition of REIT Real Property (regs finais, 31/08/2016): https://www.federalregister.gov/documents/2016/08/31/2016-20987/definition-of-real-estate-investment-trust-real-property
- eCFR §1.1033(g)-1: https://www.ecfr.gov/current/title-26/chapter-I/subchapter-A/part-1/subject-group-ECFRbf83dcc4bd89326/section-1.1033(g)-1
- 26 USC §1033(g)(3): https://www.law.cornell.edu/definitions/uscode.php?def_id=26-USC-1314874974-143898713
- McDermott — Final Regulations Define Real Property for REITs: https://www.mwe.com/insights/final-regulations-define-real-property-for-reits/
- EisnerAmper — Basics of REITs (testes 75%/95%/90%): https://www.eisneramper.com/insights/real-estate/reits-basics-1019/

**Green Street:**
- Tracking Property Prices Beyond Core Sectors — Nareit: https://www.reit.com/news/blog/market-commentary/tracking-property-prices-and-reit-total-return-beyond-the-core-sectors
- Green Street Infrastructure Research (PRNewswire): https://www.prnewswire.com/news-releases/green-street-infrastructure-research-now-available-expanding-market-coverage-across-infrastructure-debt-transport-and-data-centers-302795981.html
- Green Street Expands Private Market Coverage (BusinessWire): https://www.businesswire.com/news/home/20250626668484/en/Green-Street-Expands-Private-Market-Coverage-with-U.S.-Data-Centers-and-Lodging
- Green Street — REIT Conversion / Real Estate Monetization: https://www.greenstreet.com/advisory/reit-conversion-real-estate-monetization-alternatives
- Crowning Achievement (tower REITs / Jim Sullivan) — Nareit: https://www.reit.com/news/reit-magazine/september-october-2014/crowning-achievement

**Mídia indoor / Helloo / Eletromidia / players globais:**
- Helloo (anuncie): https://anuncie.helloo.com.br/
- Helloo — Meio & Mensagem: https://ooh.meioemensagem.com.br/capitulos/helloo-e-midia-out-of-home-mas-pode-chamar-de-vizinha/
- BR Malls compra Helloo (Brazil Journal): https://braziljournal.com/br-malls-compra-helloo-e-dobra-aposta-em-midia-out-of-home/
- Aliansce Sonae + BRMalls = Allos (Propmark): https://propmark.com.br/aliansce-sonae-e-brmalls-agora-sao-allos/
- Globo adquire controle da Eletromidia (Meio & Mensagem): https://www.meioemensagem.com.br/midia/globo-adquire-controle-da-eletromidia
- Globo fecha capital da Eletromidia (Seu Dinheiro): https://www.seudinheiro.com/2025/bolsa-dolar/da-b3-para-as-telinhas-globo-fecha-o-capital-da-eletromidia-elmd3-e-companhia-deixa-a-bolsa-brasileira-paty-julw/
- Focus Media — about: https://www.focusmedia.cn/en/about/index
- Captivate — about: https://www.captivate.com/about-captivate/

**Legislação Brasil (FII / securitização / FIDC):**
- Res. CVM 175: https://conteudo.cvm.gov.br/legislacao/resolucoes/resol175.html
- Res. CVM 175, Anexo III (FII): https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_Anexo03.pdf
- Res. CVM 175, Anexo II (FIDC): https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/100/resol175consolid_Anexo02.pdf
- Lei 14.430/2022 (Marco da Securitização): https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14430.htm
- Mattos Filho — Marco Legal da Securitização: https://www.mattosfilho.com.br/unico/marco-legal-securitizacao-inovacoes/
- CVM permite FII acessar créditos imobiliários via FIDC (Capital Aberto): https://capitalaberto.com.br/mercados/entendimento-da-cvm-permite-que-fii-acesse-carteiras-de-creditos-imobiliarios-via-fidc-sem-violar-a-vedacao-de-investimento/
