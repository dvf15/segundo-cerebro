# Radar de Mídia — Triagem e Seleção de Oferta (Helloo Mídia)

Ferramenta de apoio ao **executivo comercial de mídia** para conduzir a triagem
de anunciantes interessados na **Helloo Mídia**, fazer as perguntas certas
(capacidade de investimento, intenção do anúncio, público-alvo, tempo de
campanha, segmento e propriedade em mente) e **cruzar o briefing levantado com a
base de propriedades** e com o **inventário real** de espaços do
empreendimento — chegando à propriedade mais adequada ao segmento, ao tempo e
aos recursos disponíveis.

> Arquivo único, sem build, sem dependências: **`public/midia.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve em **`https://radarbazin1-s68m.vercel.app/midia.html`**
> após o merge na branch de produção.

Mesma estrutura, metodologia e visual do **[Radar Quiosques](RADAR-QUIOSQUES.md)**
(`public/quiosques.html`), adaptada de "investidor × marca de quiosque" para
"anunciante × propriedade de mídia".

---

## Estrutura em abas

1. **Triagem** — o roteiro de perguntas + recomendação; ao final, **salva o
   anunciante** na base (novo ou atualização).
2. **Anunciantes** — o **banco de anunciantes** (mini-CRM): busca, filtro por
   status (Novo / Em contato / Proposta / Fechado / Descartado), detalhe
   recalculado ao vivo, anotações do executivo, e **exportar CSV / backup JSON /
   importar**.
3. **Inventário** — cadastro dos **espaços comercializáveis** (praça +
   propriedade): espaços **ocupados** (com o anunciante que veicula e até
   quando) e espaços **disponíveis** (com valor de tabela, prioridade de venda e
   até **3+ segmentos prioritários**, em ordem de preferência). Mais a lista de
   **anunciantes desejados** (captação) e a **base de propriedades**.
4. **Cruzamento** — casa a base de anunciantes com o inventário: para cada
   **espaço disponível**, o melhor **anunciante × propriedade**; para cada
   **anunciante desejado**, a aderência; e a **cobertura** (espaços com
   candidato forte, receita/mês endereçada e focos de captação).

### Duas linguagens na mesma ferramenta

O anunciante (marca, agência ou lojista do shopping) **não fala mídia** — e não precisa. A ferramenta tem
o mesmo motor com duas superfícies:

| | Executivo (link normal) | Anunciante (`#anunciante`) |
|---|---|---|
| Formulário | os 6 blocos visíveis de uma vez | **um passo por vez**, com "Passo 3 de 6" e bolinhas de progresso |
| Termos técnicos | aparecem em cinza ao lado da pergunta (`verba total`, `flight`, `KPI`, `nichos`) | ocultos |
| Campos internos | origem do lead, situação da verba | escondidos ou reescritos |
| Títulos | "Quanto o cliente pode investir" | "Quanto **você** pode investir" |
| Resultado | ranking com notas por dimensão, inventário e plano | cartões com "Combina muito / bem / pouco", o que é o espaço em uma frase, **por que combina** e **pontos de atenção** |

O vocabulário do cliente e o de mídia andam lado a lado:

| O cliente diz | A ferramenta entende |
|---|---|
| Ser mais conhecido | awareness / lançamento |
| Atrair gente para a loja | consideração / tráfego |
| Vender agora | conversão / performance |
| Fazer o cliente voltar | fidelização / CRM |
| Fortalecer a imagem da marca | institucional / branding |
| Falar com as pessoas certas | 1-a-1 na base do programa |
| Tempo mínimo no ar | flight mínimo |
| Aparições por mês | impactos/mês |
| Quanto cabe por mês | verba mensal × ticket |

O objetivo é escolhido em **cartões com explicação** ("A marca já é conhecida;
falta gente entrando na loja"), não num select de jargão. Investimento e tempo
têm **faixas prontas** ("Até R$ 10 mil", "R$ 10 a 30 mil"… / "2 semanas",
"1 mês", "O ano todo") — quem não sabe o número exato toca na faixa. E cada uma
das 30 propriedades tem uma frase em português claro ("Telas dentro do elevador
dos prédios: o morador vê a sua marca várias vezes por dia").

### Entrada pela estratégia do cliente (atalhos de preenchimento)

O topo da Triagem tem o card **Estratégia de mídia do cliente**, para não
redigitar o que o cliente já contou:

- **Seis estratégias** em um clique — *Lançamento, Data de varejo, Always on,
  Performance, Relacionamento, Branding*. Cada uma preenche objetivo, KPI,
  duração típica, abordagem (1-a-1 ou massa), exclusividade e os formatos
  usuais daquele tipo de campanha. Verba e público continuam com o executivo.
- **Colar briefing** — cole o e-mail, o WhatsApp ou o PI da agência e a
  ferramenta lê o texto **no próprio navegador** (nada sai do dispositivo),
  preenchendo verba total e mensal, duração, objetivo, KPI, praça, segmento,
  públicos, nichos, data de varejo, formatos citados, propriedade em mente,
  canal (direto/agência/lojista), situação da verba, nome e contato. Ao final
  ela lista **o que entendeu** e **o que ficou faltando confirmar** com o
  cliente. É leitura por palavras-chave: sempre confira antes de cruzar.

### Briefing do anunciante (enviar / receber, sem servidor)

O executivo clica em **Enviar briefing** (aba Triagem) → obtém um **link** (o app
em modo cliente, via `#anunciante`) e o envia por WhatsApp/e-mail. O anunciante,
o anunciante abre no celular e responde **seis passos em português
claro** (sem ver o inventário nem as notas do executivo), **vê o que mais
combina com o que pediu** e gera um **link/código** (`RM1:...`) ou um arquivo
`.json` que devolve. O executivo toca no link (ou clica em **Receber
resposta** e cola o código), e o briefing **entra no banco já pontuado** —
tudo client-side.

### Base fictícia para o time testar

Em `public/exemplos/` há uma base de testes completa, toda com nomes
fictícios (prefixo `Exemplo_`), montada para exercitar os caminhos da
ferramenta:

| arquivo | o que traz | como carregar |
|---------|-----------|---------------|
| `base-teste-radar-midia.json` | tudo de uma vez: 25 anunciantes já pontuados e 36 espaços de inventário | Anunciantes → **Importar backup** → OK (substituir) |
| `base-teste-radar-midia.xlsx` | a mesma base em Excel: abas Anunciantes e Inventário com listas suspensas, aba Opções com os valores aceitos e um Resumo com fórmulas | importe o próprio .xlsx em Anunciantes → **Importar CSV / Excel** (lê a aba Anunciantes) e em Inventário → **Importar CSV / Excel** (lê a aba Inventário) |
| `base-teste-anunciantes.csv` | os 25 anunciantes, editáveis no Excel | Anunciantes → **Importar CSV** |
| `base-teste-inventario.csv` | os 36 espaços (shopping, aeroporto, Helloo Home e programática) | Inventário → **Importar CSV** |

O que a base cobre, de propósito:

- **Perfis de anunciante**: lojistas do shopping com verba pequena (ótica,
  café, academia, pet shop, livraria, farmácia, restaurante), marcas diretas
  (banco, construtora, delivery, seguradora, telecom, colégio, clínica,
  cervejaria, prefeitura, pet food, baby, carro elétrico, fintech) e marcas via
  agência (montadora, cosméticos, companhia aérea).
- **Praças**: shopping, aeroporto, prédios (Helloo Home) e "tanto faz".
- **Objetivos e KPIs**: os cinco objetivos e os seis KPIs aparecem pelo menos
  uma vez; há pedidos 1-a-1 e de alcance.
- **Casos-limite para ver as travas e alertas**: verba exploratória de
  R$ 5 mil (Livraria), campanha de 1 semana pedindo túnel icônico (Fintech),
  verba mensal baixa para adoção (Pet Vila), pedido de exclusividade em
  categoria já ocupada (Banco Beta × Banco Alfa no Acelerador), propriedade
  pedida fora da verba (Moda Rua Nova pedindo a empena), lançamento
  imobiliário pedindo só prédios (Construtora Horizonte).
- **Dúvidas levantadas**: as oito objeções do speech aparecem em algum
  anunciante, para testar o bloco de argumentação e a proposta.
- **Status**: novo, em contato, proposta, fechado e descartado.
- **Inventário**: espaços ocupados (com anunciante e data de saída),
  disponíveis com prioridade de venda e segmentos preferidos, e um conflito
  de exclusividade pronto (Acelerador ocupado por banco).

Para voltar ao zero, use Inventário → **Restaurar exemplo** e exclua os
anunciantes (ou importe um backup vazio).

### Fluxo do anunciante (versão revisada com o time)

- **Passo 1**: tipo de campanha (Lançamento, Data de varejo, Frequência,
  Vendas, Fidelização, Construção e fortalecimento de marca) e **ramo do
  negócio** já na primeira tela.
- **Passo 2**: nome, contato e quem fala (marca, agência ou **lojista /
  proprietário de loja no shopping**).
- **Passo 3**: faixas de investimento (a partir de "Até R$ 15 mil"), **régua
  em R$** sincronizada com o valor, e "O investimento já está disponível?".
- **Passo 4**: objetivo (inclui o cartão **Lançar um produto**), métrica de
  avaliação **filtrada pelo objetivo** e a pergunta de exclusividade de
  segmento no período de veiculação.
- **Passo 5**: perfis do público, **campo livre para descrever o público**,
  **onde quer aparecer com até duas opções** (shopping, aeroporto, prédios ou
  tanto faz) e regiões; nichos ficam num bloco opcional.
- **Passo 6**: tempo no ar (mínimo de 1 semana) e data importante. "Já viu
  algum espaço que gostou?" e "Tipos de divulgação" ficam só no executivo.
- **Tela final**: *Sua solução dentro do investimento* (combinação que cabe
  na verba, cada espaço com **o que é e onde fica, como aparece, quem vê, o
  que significa aparições por mês e por que indicamos**, mais a foto quando
  houver no cadastro), *Para ir além* (complementos com investimento e
  aparições incrementais), *Outras opções que também combinam*, o que cada um
  recebe ao final, envio por WhatsApp/e-mail com confirmação **"Seu briefing
  foi enviado com sucesso"** e **Baixar resumo (PDF)**.
- Lojista sem praça definida é tratado como shopping; propriedades fora da
  praça pedida não entram na recomendação do anunciante.

As mesmas explicações e fotos aparecem na proposta do executivo (app e PDF).
Fotos e o texto "como aparece" vêm do cadastro de propriedades: colunas
`foto` (URL https) e `formato` no CSV de propriedades. Sem foto cadastrada,
não há espaço vazio.

### Importar planilhas: CSV ou Excel direto

Os três importadores (anunciantes, inventário e propriedades) aceitam **CSV**
com vírgula ou ponto e vírgula (o formato que o Excel em português gera), com
ou sem BOM, e também o **arquivo .xlsx direto**, sem converter. No Excel a
ferramenta procura a aba pelo nome (Anunciantes, Inventário, Propriedades) e,
se não achar, usa a primeira. A linha de cabeçalho pode estar abaixo de um
título. Quando o cabeçalho não é reconhecido, a mensagem de erro mostra as
colunas encontradas para facilitar o ajuste.

### Importar anunciantes por CSV (cadastro em massa)

Na aba Anunciantes, **Exportar CSV** serve de modelo: abra no Excel/Google
Sheets, edite/adicione linhas e use **Importar CSV**. As colunas de `status`,
`objetivo`, `kpi`, `praca`, `um_a_um`, `canal` e `situacao_verba` aceitam tanto o
**rótulo** ("Conversão / venda", "Aeroporto", "1-a-1") quanto o **código**
interno. Cada linha importada é pontuada na hora contra o inventário atual.
Exemplo pronto: `public/exemplos/anunciantes-exemplo.csv`.

### Importar o inventário por CSV (preenchimento em massa)

Na aba Inventário, **Baixar modelo (CSV)** gera um arquivo com os espaços
atuais + a lista de propriedades e segmentos válidos. Colunas: `nome, praca,
propriedade, status, anunciante, ate, valor, prioridade, seg1, seg2, seg3`
(pode acrescentar `seg4, seg5…`). `status` = `ocupado` (preencha anunciante e
`ate`) ou `disponivel` (preencha `valor`, `prioridade` 0/1 e os segmentos
prioritários em ordem). O parser aceita `,` ou `;` (Excel BR), campos com
aspas, ignora linhas iniciadas por `#` e casa os nomes de propriedade/segmento
com a lista oficial (inclusive por correspondência parcial).
Exemplo pronto: `public/exemplos/inventario-midia-exemplo.csv`.

### Expandir a base de propriedades por CSV (Inventário → Base de propriedades)

**Modelo de propriedades** exporta as propriedades atuais (colunas `nome,
categoria, local, minimo, ticket_mes, impactos_mes, objetivos, publicos,
segmentos, dias_min, dias_ideal, antecedencia, sazonal, um_a_um, exclusividade,
complexidade, descricao`). Edite e **Importe** — as propriedades personalizadas
ficam salvas no navegador e entram por cima da base (mesmo nome substitui).
**Categorias novas** citadas no CSV são criadas automaticamente e passam a
aparecer nos formatos de interesse. "Restaurar base original" limpa as
personalizadas.

> Persistência: anunciantes, inventário e base personalizada ficam em
> `localStorage` (por navegador/dispositivo). Use **Backup JSON** para levar
> entre dispositivos ou guardar cópia. Para uma base **compartilhada entre
> vários executivos**, é preciso um backend.

---

## O que a ferramenta faz

1. **Roteiro de entrevista guiado** — leva o executivo pelas perguntas corretas,
   organizadas em 5 blocos:
   - **Identificação** (anunciante, contato, origem do lead, e se é **cliente
     direto, via agência ou lojista do shopping** — a verba de lojista puxa o
     que atua perto da loja e converte).
   - **Capacidade de investimento** — verba **total** da campanha **e** verba
     **mensal** (separadas de propósito: é a verba mensal que diz se a
     propriedade se sustenta no ar pelo período pedido), além da situação da
     verba (aprovada / em aprovação / exploratória).
   - **Intenção do anúncio** — objetivo no funil (reconhecimento, consideração,
     conversão, fidelização, institucional), KPI de sucesso e se pede
     **exclusividade de categoria**.
   - **Público-alvo / audiência** — perfis desejados, praça (**shopping /
     aeroporto / residencial** — este último é a **Helloo Home**, telas em
     prédios) e se quer falar com **pessoa identificada** (base do programa de
     relacionamento) ou com alcance de massa.
   - **Tempo de campanha & segmento** — duração em semanas, janela/data de
     varejo, segmento do anunciante e se ele **já tem uma propriedade em mente**
     ou formatos de interesse.
   - **Nichos de audiência** (dentro do bloco de público) — 15 nichos como
     *Alta renda, Famílias & mães, Fitness & saúde, Moda & tendência, Pet
     lovers, Viajantes frequentes, Investidores & finanças*. Nicho declarado
     puxa formatos **segmentáveis** (programática, app, venda certa,
     acelerador) e derruba mídia de massa — é o que separa alcance de
     assertividade.

2. **Cruzamento de dados (matching)** — pontua cada propriedade da base em 8
   dimensões ponderadas (verba, cadência mensal, objetivo, audiência, tempo,
   segmento, nicho/segmentabilidade, preferência) gerando a **aderência ao
   briefing**.

3. **Cruzamento com o inventário** — a aderência é **modulada** pela
   disponibilidade real: propriedade com espaço livre e o segmento do anunciante
   como 1ª prioridade vira prioridade; **concorrente de mesmo segmento** já
   ocupando a propriedade derruba o score (**conflito de exclusividade**);
   inventário todo ocupado vira "fila / próxima janela". A modulação nunca infla
   o score acima da aderência ao briefing — uma propriedade fora da verba **não**
   é "resgatada" só porque há espaço livre.

4. **Saídas para a reunião**:
   - **Diagnóstico do anunciante** (tipo de campanha + alertas, ex.: verba
     mensal × duração incoerentes, campanha curta demais para adoções/naming,
     verba exploratória → começar por propriedade de entrada).
   - **Inventário disponível hoje** (quantos espaços livres e em que categorias).
   - **Plano de mídia sugerido dentro da verba** — combinação de até 4
     propriedades de categorias diferentes que cabe na verba, com custo por item,
     total, % da verba e impactos estimados. A montagem testa começar pela 1ª,
     2ª, 3ª ou 4ª opção elegível e fica com a combinação de maior aderência
     somada acima do piso — assim uma propriedade cara não engole a verba quando
     duas ou três boas cabem (o speech defende o mix). Propriedades fora da
     praça pedida nunca entram no plano.
   - **Formatos pedidos no briefing** — para cada formato que o cliente citou, a
     melhor propriedade daquela categoria e a nota honesta, inclusive quando a
     resposta é "não é o melhor caminho, e aqui está o porquê". A recomendação
     nunca ignora em silêncio o que foi pedido.
   - **Ranking de propriedades** com aderência, investimento mínimo, ticket/mês,
     custo estimado na janela, impactos, flight mínimo, antecedência e as razões
     de cada nota.
   - **Resumo copiável** para registrar no CRM ou enviar ao anunciante.
   - Se o anunciante citou uma propriedade, ela é **validada explicitamente**
     (com o score e alternativas equivalentes quando a aderência é baixa).
   - **Argumentação para a reunião** — roteiro de fala por vertical (shopping,
     aeroporto, Helloo Home, Helloo Live, outdoors, programática), montado a
     partir do **speech consolidado da equipe** (ver abaixo).
   - **Gerar proposta** — documento pronto para o cliente, a partir da
     triagem ou da ficha salva em Anunciantes.

5. **Argumentação e proposta (camada do speech consolidado)** — a
   ferramenta operacionaliza o
   [`Speech-Comercial-Helloo-Algoritmo.md`](Speech-Comercial-Helloo-Algoritmo.md),
   consolidado a partir do Termômetro Comercial com peso por tempo de casa:
   - **Dúvida levantada** (campo do executivo, bloco "O que o cliente quer"):
     a objeção que o cliente trouxe — impacto da mídia em elevador, influência
     no consumidor, engajamento além da exposição, público do aeroporto,
     online × OOH, preço, mensuração ou "não concentrar a verba". A leitura do
     briefing colado detecta a dúvida automaticamente quando o texto a cita.
   - **Argumentação para a reunião** (resultado da triagem): para cada
     vertical envolvida — primeiro a **praça pedida**, depois as verticais dos
     espaços do plano — os passos do roteiro na ordem do algoritmo, com o
     **apoio ponderado** de cada tese (% do time), a **confiança do time** na
     vertical (nota interna) e os **dados citados** marcados como ✔ (fonte
     nomeada) ou ⚠ (sem fonte — confirmar antes de usar em material). Se o
     cliente levantou uma dúvida, o card de resposta daquela vertical aparece
     em destaque; quando a vertical não tem resposta própria, entra uma
     **resposta transversal** (preço, mensuração, online × OOH, mix).
   - **Gerar proposta**: monta um documento com *O que entendemos* (briefing
     em linguagem do cliente), *O que recomendamos* (o plano dentro da verba,
     com "por que para você" tirado das razões verdes de cada espaço, total,
     % da verba e aparições), *Por que esse caminho funciona* (as três teses de
     maior apoio por vertical, no texto para o cliente, citando só dados **com
     fonte**), *Sobre a dúvida levantada* e *Próximos passos* (inclui a
     antecedência de produção do espaço mais exigente e o relatório contra a
     métrica combinada antes). As **notas internas** (confiança do time, dados a
     validar, formatos pedidos e não recomendados, aviso de tabela) só saem com
     a opção "Incluir notas internas" marcada — desmarque antes de enviar.
     **Imprimir / PDF** gera o documento limpo; **Copiar texto** leva para
     e-mail ou WhatsApp. O campo "Dúvida levantada" também sai e entra no CSV
     de anunciantes (coluna `objecao`).

---

## Base de propriedades (portfólio Helloo)

| Categoria | Propriedades |
|-----------|--------------|
| Mídia digital — Shopping | Totem Digital · Megabanner Digital · Testeira Digital |
| Mídia digital — Aeroporto | Totem Digital · Megabanner · Testeira Digital |
| Outdoors & icônicos | Túnel Icônico (shopping e aeroporto) · Outdoor Digital (shopping e aeroporto) · Empena/Fachada Icônica · Painel Rodoviário / Avenida |
| Mídia programática (DOOH) | DOOH Programático — Rede Helloo (CPM via DSP/PMP, dayparting, geo) · Extensão de Audiência — Mobile & CTV · Geofencing & Drive-to-Store |
| App do programa | Anúncio no App do Programa de Relacionamento |
| CRM & venda certa | Venda Certa — benefício direcionado |
| Promoções & cupons | Cupom Extra em Promoções (datas de varejo) |
| Programa de pontos | Status Match · Acelerador de Categoria (ex.: BTG Shopping Leblon) |
| Patrocínio de eventos | Patrocínio de Evento no Shopping |
| Campanhas sazonais | Patrocínio de Campanha de Data de Varejo |
| Adoção de espaços | Valet · Pet Park · Fraldário · Eletroposto · Naming da Praça de Eventos |
| Helloo Home — Residencial | Elevador Residencial · Hall & Portaria · Rede Geolocalizada (edifícios por bairro/CEP) |

---

## Metodologia de score

- **Aderência ao briefing** (0–100): média ponderada das 8 dimensões.
  Pesos em `W` no script (verba 24 · objetivo 17 · audiência 13 · tempo 12 ·
  segmento 10 · nicho 9 · cadência mensal 9 · preferência 6).
- **Nicho × segmentabilidade**: cada propriedade tem `prec` (1–5, o quanto
  consegue mirar um nicho). Sem nicho declarado a dimensão é neutra (70). Com
  nicho, a nota parte da precisão (5 → 100 … 1 → 42), sobe se a propriedade
  atende aquele nicho e cai 18 pontos se não atende — por isso um icônico de
  massa perde para a venda certa quando o cliente pede um público específico.
  Formatos programáticos e de CRM entram como "segmentável para qualquer
  nicho".
- **Verba de lojista** (`canal = lojista`): +5 nas propriedades marcadas como
  indicadas para lojista (testeira, app, cupom, venda certa, programática de
  proximidade) e −8 nas de marca/institucional.
- **Custo estimado** = `máx(investimento mínimo, ticket/mês × meses da campanha)`.
  É ele — e não o mínimo de tabela — que é comparado com a verba.
- **Travas (pré-requisitos)**: verba abaixo de 85% do custo estimado limita o
  score a 38; janela abaixo do **flight mínimo** limita a 55; verba mensal abaixo
  de metade do ticket limita a 62; pedido de exclusividade em propriedade
  compartilhada limita a 60; e **praça diferente da pedida** limita a 50 —
  shopping, aeroporto e residencial são audiências distintas, então o anunciante
  que pediu Helloo Home não recebe totem de aeroporto no plano. Propriedades do
  programa de relacionamento (`local: app`) são ativos do shopping/aeroporto:
  atendem essas duas praças, mas entram na trava quando o pedido é **só
  residencial**.
- **Inventário** (0–100): derivado de espaços livres/ocupados da propriedade,
  dos segmentos prioritários de cada espaço e do conflito de exclusividade.
- **Score final** = `aderência × (0,85 + 0,15 × inventário/100) + bônus`,
  limitado a 100 (bônus de 3 para segmento como 1ª prioridade e 3 para espaço
  marcado como **prioridade de venda**). Conflito de exclusividade limita o
  resultado a 45.
- **Faixas**: ≥78 Alta aderência · 60–77 Média · 42–59 Baixa · <42 Não recomendada.

---

## Fontes dos dados e ressalvas

Os valores de **investimento mínimo, ticket mensal, impactos, flight mínimo/ideal
e antecedência de produção** de cada propriedade são de **referência**, definidos
para dar ordem de grandeza à triagem.

> ⚠️ Números reais variam por praça, período, formato e negociação. **Sempre
> confirme no mídia kit e na tabela comercial vigente** antes de emitir proposta
> ou PI. A ferramenta é apoio à decisão do executivo — **não substitui** a
> precificação oficial nem a checagem de disponibilidade no sistema comercial.

---

## Como personalizar

### Ajustar o inventário
Aba **Inventário**: cadastre cada espaço (praça + propriedade), marque
ocupado/disponível, o valor de tabela, a prioridade de venda e os segmentos
prioritários. É salvo no navegador (`localStorage`). O padrão está em
`DEFAULT_SPACES` no script.

### Adicionar / editar propriedades
Pelo CSV (recomendado) ou editando o array `BASE_PROPS` em `public/midia.html`:

| campo | significado |
|-------|-------------|
| `n` | nome da propriedade |
| `cat` | categoria (deve existir em `CATEGORIAS`) |
| `local` | `shopping` \| `aeroporto` \| `residencial` \| `app` \| `ambos` |
| `min` | investimento mínimo de entrada (R$) |
| `ticket` | investimento típico por mês (R$) |
| `imp` | impactos/alcance estimado por mês |
| `funil` | objetivos atendidos (`awareness`, `consideracao`, `conversao`, `fidelizacao`, `institucional`) |
| `pub` | perfis de audiência entregues |
| `segs` | segmentos de anunciante com maior aderência (vazio = universal) |
| `nichos` | nichos de audiência que a propriedade alcança naturalmente |
| `prec` | precisão de segmentação, 1–5 (5 = 1-a-1 / programática; 1 = massa) |
| `loj` | formato indicado para verba de lojista (1/0) |
| `dmin` / `dideal` | flight mínimo / ideal, em dias |
| `lead` | antecedência de produção e aprovação, em dias |
| `saz` | atrelada a datas de varejo (1/0) |
| `um1` | permite falar 1-a-1 com a base do programa (1/0) |
| `excl` | comporta exclusividade de categoria (1/0) |
| `compl` | complexidade operacional (1–5) |
| `desc` | descrição curta |

### Novos segmentos ou categorias
Inclua o nome em `SEGMENTOS` / `CATEGORIAS` — ou apenas cite no CSV de
propriedades (categorias novas são criadas automaticamente).

---

## Publicação — link para o executivo

O arquivo vive em **`public/midia.html`**. Como o repositório já tem deploy na
**Vercel**, ao chegar na branch de produção (`main`) a ferramenta fica disponível
em:

```
https://radarbazin1-s68m.vercel.app/midia.html
```

Esse link abre em qualquer navegador/celular, sem login e sem baixar nada, e é
atualizado automaticamente a cada `git push` na branch de produção. O link do
briefing para o anunciante é o mesmo endereço com `?modo=anunciante` no final (o antigo `#anunciante` continua valendo).

A ferramenta tem **ícone e manifest próprios** (`midia-icon-*.png` e
`midia.webmanifest`): uma **tela de mídia minimalista com um alvo**, referência à
mídia assertiva. Em "Adicionar à Tela de Início" (iPhone) ou "Instalar"
(Android) ela vira um app com esse ícone e o nome "Radar Mídia" — o mesmo
desenho aparece no cabeçalho da página.
