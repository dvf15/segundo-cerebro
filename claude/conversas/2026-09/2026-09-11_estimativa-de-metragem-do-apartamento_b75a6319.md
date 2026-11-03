---
title: "Estimativa de metragem do apartamento"
date: 2026-09-11
updated: 2026-09-14
source: "claude-chat"
source_id: "b75a6319-528f-4b8f-9204-d4f4d9ec0eaf"
url: "https://claude.ai/chat/b75a6319-528f-4b8f-9204-d4f4d9ec0eaf"
project: null
messages: 10
tags: ["claude", "conversa"]
---
# Estimativa de metragem do apartamento

> **Resumo:** **Conversation Overview**

The person is investigating the area (square meters) of their duplex apartment, unit 109, at Edifício Atlantys Duplex Service, Av. Afonso Arinos de Melo Franco, 191, Barra da Tijuca, Rio de Janeiro. The conversation built progressively on prior context: Claude had previously analyzed a floor plan file (Planta_Afonso_Arinos_de_Melo_Franco.pptx) and estimated ~70 m² of private area. In this session, the person provided two additional documents — the property registration (matrícula 189.269, 9º Registro de Imóveis) and the building's condominium convention — and revealed that the IPTU lists 63 m² while a sale listing shows 74 m².

Claude analyzed both documents in depth to reconcile the discrepancy. From the matrícula, key facts confirmed: the unit is apartment 109, it carries an ideal fraction of 0.004524, and one parking space is included as common-use right (not a separate autonomous unit). From the condominium convention, Claude extracted floor areas per typical story (712.60 m² for odd floors, 618.52 m² for even floors), confirmed the duplex typology (odd floor: living room, balcony, kitchen, lavatory; even floor: 2 en-suite bedrooms), verified that all 224 ideal fractions sum to exactly 1.000000, and noted that the convention explicitly prohibits glazing or enclosing balconies under Decreto 322/1976. Using the fraction proportionality and floor area data, Claude estimated the unit's private area at approximately 71–73 m², concluding that the 63 m² IPTU figure likely excludes the balcony (~5.5–6 m²) and uses a stricter measurement criterion, while the 74 m² listing figure is slightly generous. The parking space hypothesis for explaining the 11 m² gap was ruled out, as the convention treats parking as common-use right rather than private area.

Claude also attempted a web search for the incorporation memorial (registro nº 19 on matrícula 142.656, 9º RI, dated February 1993) but confirmed it is not publicly available online, as pre-digitization cartório records in Rio de Janeiro are not indexed in open databases. Claude recommended requesting a full certified copy (certidão inteiro teor) of matrícula 142.656 via the ONR portal (registradores.onr.org.br), following the same process the person had already used for matrícula 189.269, and noted that contacting the building's property manager for a copy of the memorial may be faster and free of charge. The incorporation memorial's NBR 12721 tables are identified as the only document that would definitively resolve the area figure per unit.

**Mensagens:** 10 · **Criada:** 2026-09-11 · **Atualizada:** 2026-09-14

---

## 👤 Usuário · 2026-09-11 18:06

Estime a metragem quadrada desse apto

- 📎 Planta Afonso Arinos de Melo Franco.pptx

## 🤖 Claude · 2026-09-11 18:15


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**Estimativa: ~70 m² de área privativa** (1º pav ~34 m² + 2º pav ~35 m²), dos quais ~5,5 m² de varanda. Faixa realista: **68–73 m²**.

**Como cheguei lá**

Extraí as plantas do PPTX e usei as cotas que você mesmo marcou para calibrar a escala em pixels, depois medi o polígono de cada pavimento pelo eixo das paredes:

| Ambiente | Estimativa |
|---|---|
| Sala (2,65 × 5,45) | ~14 m² |
| Varanda (2,70 × 1,95) | ~5,3 m² |
| Cozinha + circulação + lavabo | ~11–12 m² |
| Quarto 1 (~2,40 larg.) | ~11,5 m² |
| Quarto 2 (~2,70 larg.) | ~12,5 m² |
| Banheiros 1 e 2 | ~2,7 m² cada |
| Escada + paredes internas | ~7–8 m² |

**Validação externa:** é o Atlantys Duplex Service (Av. Afonso Arinos de Melo Franco, 191). Os anúncios que levantamos no ZAP em jun/2026 para o prédio concentram-se em **73–75 m²**, com faixa de 64 a 78 m² — coerente com o cálculo geométrico, já que anúncio costuma usar a área da escritura (medida na face externa das paredes, não no eixo), o que adiciona 3–5%.

**Ressalvas honestas**

- A digitalização da planta tem baixa resolução (~240×250 px por pavimento), então cada medida de parede carrega ±2 px ≈ ±7 cm.
- Suas próprias cotas divergem entre si: o slide 1 traz varanda 1,80 e sala 5,20; o slide 4 traz 1,95 e 5,45. A escala derivada do pav. 1 e a do pav. 2 diferem ~7% entre si.
- Não sei se essa metragem corresponde à **área privativa** ou à **área total** da matrícula. A área total (com vaga e fração de comum) costuma ser bem maior — num prédio assim, algo entre 95 e 115 m². Só a matrícula atualizada confirma.

Se quiser precisão real, a matrícula no 9º RI resolve — e você já tem o passo a passo para tirá-la online.

**Confiança: 6/10** ⚠️ — a convergência entre o cálculo geométrico (~70 m²) e os anúncios do prédio (73–75 m²) é boa, mas a base é uma planta escaneada em baixa resolução com cotas manuais inconsistentes entre si. Fontes: arquivo enviado (Planta_Afonso_Arinos_de_Melo_Franco.pptx) e levantamento ZAP Imóveis de jun/2026 feito na nossa conversa anterior.

## 👤 Usuário · 2026-09-11 18:17

_(sem texto)_

- 📎 Matricula_189269_cod21339.pdf

## 🤖 Claude · 2026-09-11 18:18

A matrícula não traz a metragem. Essa é a resposta curta — e é normal em matrículas de incorporação dos anos 90 do RJ.

O que a ficha 01 descreve do imóvel é: **apartamento 109**, edifício nº 191 da Av. "A" (hoje Av. Afonso Arinos de Melo Franco, conforme AV-12), com direito a **uma vaga** e **fração ideal de 0,004524** do terreno. Área privativa, área comum e área total não aparecem em nenhum dos 24 atos.

**Onde a metragem está de fato**

1. **Memorial de incorporação** — registrado sob nº 19 na **matrícula 142.656** (Av.01, de 09.02.93). É o documento que discrimina área privativa, comum e total de cada unidade. Dá para pedir a certidão dessa matrícula no mesmo 9º RI, pelo ONR.
2. **IPTU** — a AV-15 averba a **inscrição fiscal 1994293-7** (CL 18302-0). A área edificada consta no espelho do IPTU, acessível pelo Carioca Digital. É o caminho mais rápido e barato.

**O que a matrícula confirma sobre a planta**

O apto é o **109**, coerente com a "Coluna 09" das plantas. E a Av.01 registra que o memorial previa "dependências nos pavimentos pares" — o que é consistente com a estrutura duplex (nível inferior no pavimento ímpar, superior no par acima).

**Sobre a fração ideal:** 0,004524 não converte diretamente em m². Ela é proporção do terreno, e só vira metragem se você souber a área privativa total do empreendimento — que está justamente no memorial. Então não fecha o cálculo sozinha.

Minha estimativa anterior de **~70 m²** continua de pé, apoiada na planta e nos anúncios de 73–75 m² do prédio. Mas ela permanece estimativa até sair o memorial ou o IPTU.

**Um ponto adicional, já que é útil para custo de aquisição:** o R-19 registra a compra por você e Renata em 13/09/2011 por **R$ 470.000,00**, sendo R$ 9.422,08 com FGTS, e a AV-24 averba o cancelamento da alienação fiduciária por quitação em 2021.

**Confiança: 9/10** — alta quanto à ausência de metragem no documento e quanto aos dados transcritos (leitura direta do PDF). O ponto de 1 desconto é que a via do memorial pressupõe que ele discrimine as áreas por unidade, o que é o padrão mas não verifiquei no documento em si.

## 👤 Usuário · 2026-09-11 18:20

No iptu está 63m2 mas no anuncio de venda 74

## 🤖 Claude · 2026-09-11 18:20

Essa diferença de 11 m² tem explicações prováveis, e a boa notícia é que ela bate com o que a planta já indicava.

**O que a planta dizia**

Meu cálculo geométrico deu ~70 m² no total, sendo ~5,5 m² de varanda — ou seja, **~64 m² de área coberta interna**. Isso praticamente coincide com os 63 m² do IPTU. Não é coincidência: o cadastro da Prefeitura tende a registrar a área edificada da unidade, sem somar vaga nem área comum.

**As três hipóteses para os 74 m²**

1. **Vaga de garagem somada.** É a explicação mais comum. Uma vaga costuma ser computada entre 10 e 12 m² nos memoriais. 63 + ~11 = 74. O encaixe é bom demais para ignorar — e sua matrícula garante o direito a uma vaga (ficha 01 e Av.07).
2. **Varanda + área comum proporcional.** O anúncio usaria a "área privativa total" do memorial (com varanda e paredes medidas pela face externa), que ficaria em ~70 m², mais um resíduo de comum.
3. **Anúncio simplesmente arredondado para cima.** Os anúncios do prédio variavam de 64 a 78 m² para unidades da mesma tipologia, o que sugere que os corretores não usam um critério único.

A hipótese 1 é a que melhor fecha aritmeticamente. Mas não tenho como escolher entre elas só com o que está aqui.

**Como resolver em definitivo**

O memorial de incorporação (registro nº 19 na **matrícula 142.656**, 9º RI) discrimina, por unidade, área privativa / comum / total e como a vaga entra. É o único documento que encerra a discussão. Pedindo a certidão dessa matrícula pelo ONR você resolve.

**Para uso prático:** se for anunciar, o honesto é declarar a área privativa do memorial e informar a vaga separadamente. Se for para ganho de capital, o que importa é o valor, não a metragem — a área só entra como argumento de precificação.

**Confiança: 7/10** — alta na constatação de que 63 m² ≈ área interna sem varanda (dois métodos independentes convergiram). Média na escolha entre as hipóteses para os 74 m²: a soma da vaga é a mais provável, mas é inferência aritmética, não documento verificado.

## 👤 Usuário · 2026-09-14 19:16

Com base nesse documento, vc consegue chegar a uma conclusão?

- 📎 CONVENÇÃO DO CONDOMÍNIO (2) (1).pdf

## 🤖 Claude · 2026-09-14 19:18

Sim — a convenção resolve boa parte da questão, e o resultado converge com o que a planta já apontava.

**O que o documento prova diretamente**

- O apto **109 tem fração ideal de 0,004524**, igual à do 106 (a convenção agrupa "106/1406 e 109/1409"). Bate exatamente com a matrícula.
- A tipologia confere com a planta: pavimentos ímpares = 1º piso com **sala, varanda, cozinha e lavabo**; pavimentos pares = 2º piso com **2 quartos e 2 banheiros (2 suítes)**.
- **A vaga não tem local pré-determinado** e não é unidade autônoma discriminada. Isso praticamente elimina a hipótese que levantei antes de que os 74 m² fossem 63 + vaga. Vaga aqui é direito de uso sobre área comum, não m² privativo.

**O cálculo que dá para fazer**

Somei todas as frações ideais das 224 unidades: dá **exatamente 1,000000**. Ou seja, as frações são coerentes e proporcionais entre si, e a fração média por unidade é 1/224 = 0,004464. O 109, com 0,004524, está **1,3% acima da média** do prédio.

Pelas áreas dos pavimentos-tipo:

| | Área real |
|---|---|
| Pavimento ímpar (1º piso de 16 aptos + hall, circulação, escadas, poços) | 712,60 m² |
| Pavimento par (2º piso de 16 aptos + poços e escadas) | 618,52 m² |

Descontando uma estimativa de área comum por andar (~140 m² nos ímpares, que têm 2 halls e circulação; ~53 m² nos pares, que só têm poços e escadas), sobra cerca de **35,5 m² de área privativa por apartamento em cada piso** — ou seja, **~71 m² por duplex**, e ~72 m² para o 109 pelo ajuste da fração.

**Um detalhe que reforça a conta:** nos ímpares a área real (712,60) supera a equivalente (689,08) em 23,52 m². Essa diferença só aparece nos ímpares — exatamente onde ficam as varandas, que entram na área equivalente com coeficiente reduzido. Se o coeficiente for 75%, a varanda total seria 94,08 m², ou **5,88 m² por unidade** — praticamente o que medi na planta (~5,5 m²).

**A conclusão**

Os 74 m² do anúncio são provavelmente a **área privativa real com varanda**, e os 63 m² do IPTU a **área interna coberta**, sem varanda. A diferença de 11 m² é grande demais para ser só a varanda (~6 m²), então parte deve vir de critério de medição (o IPTU costuma ser mais restritivo e o cadastro é antigo). Minha estimativa fica em **71–73 m² de privativa**, com o anúncio ligeiramente generoso e o IPTU ligeiramente conservador.

**Um alerta que vale registrar:** a convenção proíbe expressamente fechar ou envidraçar varandas, mesmo em parte, citando o Decreto 322/1976. Se a unidade tem varanda envidraçada ou você pensa em fazer, isso é irregular perante a convenção.

**O que ainda falta:** o memorial de incorporação (registro 19 na matrícula 142.656) traz os quadros da NBR 12721 com a área privativa unidade por unidade. É o único documento que fecha o número sem margem.

**Confiança: 8/10** — alta nos dados extraídos (frações, áreas dos pavimentos, tipologia, regra da vaga) e na soma das frações, que fechou em 1,000000 e valida a leitura. O desconto é porque a área comum por pavimento foi estimada por mim, não está discriminada no documento — é o que mantém o resultado numa faixa de ±3 m² em vez de um número exato.

## 👤 Usuário · 2026-09-14 22:53

Tente encontrar na internet o memorial de incorporação

## 🤖 Claude · 2026-09-14 22:54


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Não encontrei — e a explicação é estrutural, não falta de busca.

**Por que não está online**

Memoriais de incorporação no Brasil não são publicados em bases abertas. O registro nº 19 na matrícula 142.656 é de **fevereiro de 1993**, muito anterior à digitalização dos cartórios do RJ. Ele existe em papel no acervo do 9º RI e só sai por certidão. Nem o ONR/SAEC indexa o conteúdo dos memoriais — o portal entrega a imagem da matrícula que você pedir, não permite buscar por empreendimento.

**O que as buscas devolveram**

Só portais imobiliários, e com dados inconsistentes entre si:

- Podium Imóveis descreve as unidades como 75 m², 2 quartos suítes e 1 a 2 vagas — o "1 a 2 vagas" já contraria a convenção, que vincula uma vaga por apartamento com exceção só do 1401.
- Um anúncio no Trovit traz o apto 105 com 73 m² e uma vaga; outro traz um duplex reformado de 64 m² com 2 suítes e varanda. Pela convenção, 105 e 110 têm fração 0,004869 — maior que a sua (0,004524). Se o 105 tem 73 m², o seu 109 seria proporcionalmente menor, na casa dos **68 m²**.
- Loft e QuintoAndar sequer acertam o endereço (registram "Avenida das Américas" e "Apartamento Bruna"), o que mostra o nível de confiabilidade dessas fichas.

Nenhuma dessas fontes cita o memorial. São metragens de anúncio, o mesmo tipo de dado que já tínhamos.

**O caminho que funciona**

Pedir a **certidão da matrícula 142.656** no 9º RI, pelo ONR (registradores.onr.org.br) — mesmo fluxo que você já usou para a 189.269. O R-19 daquela matrícula é o registro da incorporação, e a certidão inteiro teor traz os quadros da NBR 12721 com área privativa, comum e total por unidade. Custo e prazo semelhantes ao da certidão que você já tirou.

**Uma observação relevante:** a fração do 105 (0,004869) ser 7,6% maior que a do 109 (0,004524) sugere que nem todas as unidades do prédio têm a mesma metragem, apesar da planta-tipo. Isso enfraquece a leitura de que "as unidades têm 73–75 m²" como se fosse uma coisa só — os anúncios podem estar descrevendo colunas diferentes da sua.

**Confiança: 8/10** — alta na conclusão de que o memorial não está disponível publicamente (duas buscas por ângulos distintos, e a natureza do documento explica o resultado). O desconto é porque não esgotei todas as vias: não tentei a administradora do condomínio, que costuma guardar cópia do memorial e pode fornecer a um condômino sem custo. Vale um telefonema antes de pagar a certidão.
