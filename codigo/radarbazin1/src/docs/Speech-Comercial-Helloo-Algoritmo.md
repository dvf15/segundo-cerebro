# Speech Comercial Helloo Mídia — em formato de algoritmo

Consolidação das respostas de 19 executivos ao **Termômetro Comercial – Helloo Mídia**
(6 perguntas), reescrita como procedimentos de decisão. Fonte: `Consolidado_respostas_Forms_Speech.xlsx`.
Versão em planilha, com os apoios calculados: `docs/Speech-Comercial-Helloo-Consolidado.xlsx`.

Convenções: `ENTRADA` = o que o executivo precisa saber antes de falar · `PASSO n` = ordem de fala ·
`SE … ENTÃO` = resposta a objeção · `DADO` = número citado pelos executivos (ver `VALIDAR` antes de usar
em material oficial) · `apoio` = soma dos pesos de quem defende a tese ÷ 38.

---

## ALGORITMO 0 — Pesar quem respondeu

```
ENTRADA: tempo_de_casa de cada executivo (texto do formulário)

PARA CADA executivo:
    SE tempo_de_casa == "XX"            ENTÃO anos ← menos de 1   # orientação do solicitante
    SENÃO SE unidade == "meses"         ENTÃO anos ← n / 12
    SENÃO                                    anos ← n

    SE anos ≥ 5      ENTÃO peso ← 4      # Cristiane (8), Kalvin (6), Thaísa (6)
    SENÃO SE anos ≥ 3 ENTÃO peso ← 3     # Felipe (4), Luana (3)
    SENÃO SE anos ≥ 1 ENTÃO peso ← 2     # Breno, Jésus, Leonardo, Rogério, Vinicius (2), William (1)
    SENÃO                 peso ← 1       # 6 "XX" + Luiza (3 meses) + Mariana (3 meses)

PESO_TOTAL ← Σ peso = 38

PARA CADA pergunta, PARA CADA tese:
    apoio(tese) ← Σ peso(executivo que defende a tese) / PESO_TOTAL
    # um executivo pode defender mais de uma tese

DESCARTAR:
    resposta P4 de Breno            # é cópia da resposta P6
    respostas P4 e P5 de Gabriella  # em branco ("-")

ORDENAR teses por apoio, decrescente.
REDIGIR cada tese a partir do texto dos executivos de maior peso; complementar com os demais.
```

---

## ALGORITMO 1 — Escolher o procedimento pela situação

```
ENTRADA: segmento do cliente, objetivo, objeção levantada

SE objeção == "elevador residencial tem impacto?"        ENTÃO EXECUTAR ALGORITMO 2 (Home)
SE objeção == "mídia no shopping influencia o consumidor?" ENTÃO EXECUTAR ALGORITMO 3 (Shopping)
SE cliente quer "ação ao vivo / engajamento"              ENTÃO EXECUTAR ALGORITMO 4 (Helloo Live)
SE objeção == "aeroporto impacta o público certo?"        ENTÃO EXECUTAR ALGORITMO 5 (Aeroportos)
SE cliente compara "online × outdoor digital"             ENTÃO EXECUTAR ALGORITMO 6 (Outdoor)

ANTES DE QUALQUER UM:
    LER ALGORITMO 8 (dados a validar)   # não citar número sem fonte em material oficial
```

---

## ALGORITMO 2 — Home: elevadores residenciais (lançamento imobiliário)

```
ENTRADA: localização e perfil do empreendimento; o que o cliente está comparando
         (outro OOH? tráfego pago?)

PASSO 1  — abrir com a jornada do comprador                       [apoio 18%; Kalvin 6a]
    PEDIR ao cliente que se imagine como comprador:
        "Você vai pesquisar construtora, bairro, áreas comuns, financiamento —
         e discutir tudo isso com a família. Onde? Em casa."
    PERGUNTAR: "Qual empreendimento tem mais chance de ser contatado:
                o que apareceu no dia a dia dele ou o que não comunicou nada?"

PASSO 2  — frequência e narrativa de longo prazo                  [apoio 61%; tese líder]
    DIZER: morador usa o elevador em média 5 vezes por dia          # DADO: ver VALIDAR
           → a marca é o primeiro contato do dia e o último antes de dormir
           → mídia de FREQUÊNCIA e LEMBRANÇA, não de resposta imediata
    DIZER: proprietário fica anos; locatário no mínimo 12 meses
           → dá para acompanhar as fases da vida daquela família

PASSO 3  — mostrar o filtro de prédios                            [apoio 45%]
    APRESENTAR estudo geolocalizado:
        raio em torno do empreendimento
        classe social e valor do condomínio
        perfil das famílias (filhos, pet), estrutura (kids, academia, carregador EV)
        metragem dos apartamentos
    DIZER: "é quem já mora e consome na região — o oposto da dispersão"

PASSO 4  — ambiente de atenção                                    [apoio 50%]
    DIZER: no elevador o celular não pega, ninguém conversa, atenção vai para a tela
           ambiente de conforto e confiança (dentro de casa) → receptividade maior
           público fechado → baixa dispersão

PASSO 5  — prova social e números                                 [apoio 32%]
    MOSTRAR vinhetas em veiculação
    CITAR casos de recorrência: concessionária (feirões), escola (prova de bolsa, desconto p/ moradores)
    LEVAR números macro e da proposta: telas, edifícios, apartamentos, famílias alcançadas
    PARA mensurar: amarrar a cupom exclusivo para moradores ou QR code + relatório pós-venda

SE objeção == "vou apostar todo o orçamento nisso?"                [apoio 11%]
    ENTÃO reenquadrar: Home é mídia COMPLEMENTAR, reforço do plano, não substituto
          E orientar o criativo: vídeo pensado para o elevador converte melhor

SE objeção == "como eu meço o impacto individual?"
    ENTÃO ser transparente (Vinicius, 2a): a entrega (prédios, telas, impactos) é medida;
          resultado de venda só com cupom/QR.  # alinhar o que a casa promete — ver VALIDAR
```

---

## ALGORITMO 3 — Shopping: mídia digital interna (loja de moda feminina)

```
ENTRADA: performance da loja vs. concorrentes e vs. segmento
         (o problema é da loja ou é tendência geral?)

PASSO 1  — momento e ambiente                                     [apoio 29%]
    DIZER: cliente passa ~2 horas no shopping                       # DADO: ver VALIDAR
           em lazer, com família/amigos, relaxado, aberto a estímulos
           nossa mídia NÃO interrompe (≠ TV, ≠ post patrocinado): soma-se ao passeio

PASSO 2  — decisão no ponto de venda                              [apoio 63%; tese líder]
    DIZER: "70% da decisão de compra acontece no PDV"               # DADO: ver VALIDAR
           cliente vem decidido a gastar; sabe que quer um presente, não sabe qual
           a loja que comunicou tem mais visitas do que a que ficou em silêncio
    EXEMPLO (Kalvin): amigos decidem o restaurante no shopping; o que mostrou a
             promoção na tela ganha a "olhadinha"
    CONCLUIR: "o shopping é o seu PDV — influência e conversão no último metro antes da vitrine"

PASSO 3  — caso real do segmento                                  [apoio 26%]
    LEVAR case com número, comparando período da campanha × mesmo período do ano anterior
    CASE da casa (Cristiane): franqueado Spoletto, São Bernardo Plaza, +6% em vendas
         trabalhando produtos por faixa de horário no circuito digital
    SE não houver case do segmento ENTÃO registrar a lacuna   # ver ALGORITMO 7

PASSO 4  — jornada e corredores                                   [apoio 24%]
    PERGUNTAR: por onde a cliente dela circula? quais lojas complementam a oferta?
    DIRECIONAR anúncios para esses corredores e pontos quentes (frente de escada rolante, acessos)
    LEMBRAR: principal audiência do shopping é o público feminino

PASSO 5  — flexibilidade do digital + campanha para medir         [apoio 45%]
    OFERECER: institucional alternado com promoção · produto por faixa de horário ·
              datas sazonais · lançamento de coleção · vídeo (prende mais que estático) ·
              sem custo de impressão · troca imediata
    PROPOR uma peça com produto + preço → conversão mensurável

PASSO 6  — dados de audiência                                     [apoio 21%]
    DIZER: conhecemos perfil e hábitos da audiência; dados antes e depois
    OFERECER combinação com o programa de benefícios → CRM para o público certo
    # DADOS "37 s diante do totem", "59% acham que propaganda estimula", "9,8 vezes": ver VALIDAR
```

---

## ALGORITMO 4 — Helloo Live (ação de marca ao vivo)

```
ENTRADA: briefing da marca; verba; vertical mais aderente (shopping, home, aeroporto)

PASSO 1  — experiência e emoção                                   [apoio 53%]
    TÉCNICA (Jésus): pedir ao cliente que lembre de uma ação de marca que viveu
                     e descreva o que sentiu e por que ficou na memória
    DIZER: nada substitui o tête-à-tête; o público tira dúvidas, experimenta, sente
           (cheiro, degustação, demonstração, realidade virtual, espaço instagramável)
    DADO (Cristiane, 8a): WGSN — 95% das decisões de compra são influenciadas por emoção;
                           pós-pandemia há fadiga digital
    DIZER: interação gera mídia espontânea — fotos, posts, lives no local

PASSO 2  — full service                                           [apoio 79%; tese líder, quase unânime]
    DIZER: a Live faz planejamento, criação, orçamento, produção, fornecedores,
           ART e documentação, execução e análise pós-evento
           "repasse a ideia e nós realizamos; sem ideia? temos área específica para construir junto"
    CONCLUIR: zero carga para a equipe do cliente — é o que diferencia da agência de eventos

PASSO 3  — integração com as verticais                            [apoio 29%]
    DIZER: a Live conecta a ação à vertical mais aderente e à mídia em volta
           "pegamos o cliente da entrada até a saída"; somos especialistas em OOH

PASSO 4  — prova social                                           [apoio 13%]
    MOSTRAR imagens de entregas recentes (a ação se vende pela foto)
    CITAR marcas: Natura, Coca-Cola, Amazon, Adidas, Samsung, O Boticário   # ver VALIDAR

SE objeção == "com essa verba eu faço muita mídia"                 [apoio 8%; Yure]
    ENTÃO DIZER: "com essa verba você faz outras mídias, mas nenhuma entrega experiência
                  ao vivo, emoção e contato direto"
          E reenquadrar: não é patrocinar o evento de outro — é associar a marca a um
            momento que já tem o público certo, no lugar certo, na hora certa, com a
            mídia do shopping em volta
          E OFERECER apresentar junto para a diretoria

SE executivo não sabe valorar a Live (Rogério, Mariana, Felipe)
    ENTÃO pedir exemplos de jobs entregues com faixa de preço   # ver ALGORITMO 7
```

---

## ALGORITMO 5 — Aeroportos (bebida premium, presença nacional)

```
ENTRADA: praças-alvo da marca; perfil do consumidor premium
ALERTA: 15 de 19 executivos declaram menos confiança nesta vertical;
        a argumentação forte está em Kalvin, Thaísa e Thiago N.  # ver ALGORITMO 7

PASSO 1  — público qualificado                                    [apoio 58%; tese líder]
    DIZER: alto nível de instrução e poder aquisitivo — executivos, viajantes frequentes, turistas
    DADO (Kalvin, 6a; Datafolha/AENA), Congonhas:
         81% com ensino superior · 48% com renda familiar > R$ 14 mil/mês
    CONCLUIR: "é exatamente quem consome a sua bebida — segmentação pelo próprio ambiente"

PASSO 2  — tempo e momento receptivo                              [apoio 47%]
    DADO (Kalvin; Datafolha/AENA): 75% chegam com mais de 1 hora de antecedência
    DIZER: maioria viaja a lazer → descontração, expectativa, tempo ocioso
           circula, come, procura novidade → receptividade e exposição repetida

PASSO 3  — cobertura nacional                                     [apoio 42%]
    DIZER: 17 aeroportos (parceria NEOOH), +120 mil passageiros/dia            # ver VALIDAR
           Congonhas, Maceió, João Pessoa, Campo Grande
           "quem é impactado em São Paulo encontra a marca de novo no destino"
    SOMAR às outras verticais → narrativa que faz da marca a primeira opção

PASSO 4  — prestígio                                              [apoio 26%]
    DIZER: ambiente reforça status e confiança; vizinhança de grandes anunciantes;
           formatos grandes ao longo da jornada; estilo de vida do viajante
    PONTE: aeroporto permite degustação/experimentação → ALGORITMO 4 (Live)

OPCIONAL (apoio 3%, um executivo cada — validar antes):
    "aeroporto também é PDV: influência e conversão no mesmo lugar" (Caio)
    case Beach Park: +118% conversões SP, +74% awareness (Thiago N.)

SE o executivo só tem "levaria dados" para dizer (Jésus, Rogério, Felipe)
    ENTÃO não improvisar: usar PASSO 1 e PASSO 2 com os dados de Kalvin
```

---

## ALGORITMO 6 — Outdoor digital (vestibular; online × OOH)

```
ENTRADA: região da universidade; verba total; fases do calendário (institucional,
         inscrições, exame de bolsas, provas)

PASSO 1  — tirar o "ou" da mesa                                   [apoio 55%; tese líder; Cristiane 8a, Kalvin 6a]
    DIZER: uma mídia não exclui a outra — elas se complementam
    DADO (Kalvin; Altermark): OOH é o 2º maior meio em penetração; combinado com TV
                               aberta ou digital, alavanca a cobertura
    DIZER: campanha de alvo amplo (vestibular) exige meio massivo; grande formato tem o
           melhor custo-benefício entre os offline
    RECOMENDAR: dividir a verba — online para segmentar, outdoor digital para alcance,
                cobertura, frequência e impacto
    LEMBRAR: o "online" a Helloo também vende — push segmentado por idade no programa de
             benefícios dos shoppings
    PEDIR "uma fatia do bolo", não o bolo inteiro

PASSO 2  — visto × pulado                                         [apoio 37%]
    DIZER: a internet está lotada de anúncio; a maioria pula ou ignora —
           online chega em mais gente, impacta menos
           painel de LED em via de alto fluxo prende quem está no carro, em grupo,
           puxando assunto sobre o que vê; impacta mais tempo que um reels; lembrança posterior
    CUIDADO: não desqualificar o online — contradiz o PASSO 1

PASSO 3  — presença regional 24h, mensagem por fase               [apoio 47%]
    DIZER: perenidade na região; jornada diária (trabalho, escola, casa)
           posiciona com o entorno — "falsa fachada" de dominância regional (Cristiane)
           digital troca a mensagem: institucional → inscrições → bolsas → provas
    CRIATIVO (Thaísa, Leonardo): pessoas reais que conseguiram bolsa

PASSO 4  — fluxo da via                                           [apoio 13%]
    LEVAR o fluxo mensal da via em que o painel está   # sem o número, o argumento é vazio

PASSO 5  — cross-sell Home na região                              [apoio 5%]
    PROPOR elevadores dos prédios da região: ali moram as famílias dos vestibulandos;
           seleção por classe social e bairro → celular + caminho + casa

NOTA (Leonardo, 2a): a dificuldade do produto é comercial, não de argumento —
     inventário externo pequeno, muita concorrência, preço de mercado baixo.
```

---

## ALGORITMO 7 — Confiança por vertical (o que a base pede à gestão)

```
ENTRADA: respostas à pergunta 6

CONTAR vertical de MAIOR confiança:
    Shopping ← 17 de 19     # é o dia a dia; inventário completo; dados internos de lojistas
    Home     ← 6            # atende cliente de verba limitada

CONTAR vertical de MAIOR dificuldade:
    Aeroportos ← 15 de 19   # em TODAS as faixas, inclusive os três com 6+ anos
        motivos: vertical mais recente · precificação e operação diferentes ·
                 ticket alto que não combina com a carteira da praça ·
                 falta de treinamento e de material
    Helloo Live ← 4         # não sabem valorar; não entendem como comercializar
    Outdoors    ← 3         # inventário pequeno, concorrência, preço baixo

AÇÕES PEDIDAS PELOS EXECUTIVOS (em ordem de frequência):
    1. treinamento de speech e apresentação técnica de Aeroportos (Caio, Luana, Jésus, Rogério)
    2. apresentação única da Helloo com todas as verticais, em vez de materiais separados (Camila)
    3. visita ao aeroporto com olhar estratégico (Camila)
    4. exemplos de jobs da Live com referência de valores (Rogério)
    5. biblioteca de cases por segmento                       # lacuna implícita em P2 e P4
    6. reciclagem periódica de pitch com troca entre pares (Yure)

CORRELAÇÃO:
    SE vertical == Aeroportos ENTÃO a fraqueza declarada se confirma em P4
        (argumentação em 3 pessoas; 3 respostas vagas)
    SE vertical == Live       ENTÃO a tese central é unânime, falta a camada de preço
    SE vertical == Outdoor    ENTÃO o speech é consistente; o problema é inventário e preço
```

---

## ALGORITMO 8 — VALIDAR antes de usar em material oficial

```
PARA CADA dado abaixo: SE não houver fonte oficial ENTÃO usar o valor dos executivos mais antigos
                       OU omitir o número e manter o argumento qualitativo.

viagens de elevador por dia ........ "5x" (Kalvin, Thaísa) · "5 a 6" · "6 a 8"  → usar "em média 5"
inventário Home .................... "+15 mil telas" · "+13 mil telas em 24 cidades, +1,2 mi moradores/dia,
                                     750 edifícios no RJ" (ambos < 1 ano)       → mídia kit vigente
permanência no shopping ............ "120 min" · "2 h" · "180 min" (todos < 1 ano) → um dado oficial
"70% da decisão no PDV" ............ citado por 7, inclusive os 3 mais antigos, sem fonte → nomear a pesquisa
métricas de totem .................. "37 s" · "59%" · "9,8 vezes" (≤ 2 anos)     → validar com dados
aeroportos — cobertura ............. "17 aeroportos, NEOOH, +120 mil pax/dia" (< 1 ano) → mídia kit
aeroportos — permanência ........... "75% > 1 h (Datafolha/AENA)" (Kalvin) · "2 h" → usar o com fonte
case Beach Park .................... um executivo (< 1 ano); não necessariamente aeroporto → verificar
marcas que fizeram Live ............ Natura, Coca-Cola, Amazon · Adidas, Samsung, O Boticário → lista citável
mensuração em Home ................. "não medimos impacto real" × "relatório pós-venda" → alinhar a promessa

RESPOSTAS DESCARTADAS:
    Breno — P4 (cópia da P6) · Gabriella — P4 e P5 (em branco)
```
