# Otimizador de Obras — Triagem da loja & seleção de fornecedores

Ferramenta de apoio ao **lojista** e ao **time de obras do shopping** para
conduzir a entrada de uma nova loja: fazer as perguntas certas sobre a loja e
sobre o lojista, estimar **custo, prazo e escopo obrigatório**, e cruzar esses
dados com a **base de fornecedores credenciados do empreendimento** para chegar
ao pacote de contratação mais adequado — obra no menor prazo e custo possíveis,
sem abrir mão dos padrões de segurança do shopping.

> Arquivo único, sem build, sem dependências: **`public/obras.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve a página estática. Os links estão na seção
> [Publicação](#publicação--link-para-o-time-e-para-o-lojista).

Estrutura espelhada no **[[RADAR-QUIOSQUES]]**: mesmas abas, mesma triagem
guiada, mesmo mini-CRM, mesma ficha enviável sem servidor, mesmo motor de
matching com travas de pré-requisito.

---

## Estrutura em abas

A ferramenta é organizada em torno do **[[FLUXO-OBRAS-E-INAUGURACAO|fluxo de
obras e inauguração]]** — as 30 etapas, cada uma com responsável, entre o
comunicado de fechamento da operação que sai e o feedback dos fornecedores da
que entra.

1. **Minha fila** — a tela inicial. Mostra as obras em que **a vez é sua**,
   as que esperam o lojista e as que estão com o outro perfil. No primeiro
   acesso, cada pessoa escolhe se é de **Operações** ou **Executivo**. Daqui
   saem as ações de cada etapa (vistoriar, validar, orçar, analisar, negociar)
   e o cartão **Receber e enviar** (ficha para um lojista novo e recebimento de
   obras, fichas e mensagens). Ver [Trilha da triagem](#trilha-da-triagem-d4).
2. **Obras** — o **banco de obras**. No topo de cada obra fica a **trilha da
   triagem** (4 etapas, dono atual, resumo e histórico). Abaixo, as **30 etapas**:
   caixa de seleção por etapa (com data registrada), atalho *até aqui* para
   marcar todas as anteriores, etapa atual com **quem está com a bola**, bloco
   (A–F), progresso e alerta de **obra parada** (sem etapa concluída há 14+
   dias). Por obra, ainda: **fornecedores contratados** por disciplina e a
   **avaliação da etapa 30**, que devolve a nota para a base. Anotações do
   time, filtro por bloco e exportação CSV. Os **Parâmetros do empreendimento**
   (custo e prazo) ficam no fim da aba, recolhidos.
3. **Fornecedores** (só Operações) — o **catálogo de fornecedores do shopping**, organizado nos
   três grupos pedidos (engenharia/arquitetura/gerenciamento · materiais e
   acabamentos · segurança e regularização): busca, filtro por categoria e por
   situação de credenciamento, cadastro/edição, **exportar CSV / importar CSV /
   backup JSON**.
4. **Negociações** (só Executivo) — divergências do lojista em aberto e as
   já encerradas, com o desfecho.
5. **Painel** — o quadro da **trilha da triagem** (quantas obras em cada
   etapa e com quem, e as atrasadas), **onde cada obra está** no fluxo (blocos A–F e concluídas), **com quem
   está a bola** (obras por responsável da etapa atual, etapas mais frequentes,
   obras paradas), e o cruzamento com a base: cobertura por disciplina, obras
   antes do início (até a etapa 16) × disciplinas **sem fornecedor apto**,
   fornecedores mais aderentes à carteira e conformidade documental.

### Ficha da obra (enviar / receber, sem servidor)

Há dois jeitos de enviar a ficha. Na **etapa 2**, o Executivo toca em **Enviar
ficha a este lojista**: o link já leva o id da obra, a LUC e a área, e a
resposta volta direto para a validação daquela obra. Para um lojista que ainda
não tem obra aberta, use **Enviar ficha a um lojista novo** (Minha fila): a
resposta abre uma obra nova, que começa na vistoria. Em ambos os casos o link é
o app em modo lojista (`#lojista`), enviado por WhatsApp/e-mail.
O lojista abre no celular, responde as mesmas perguntas, **recebe uma prévia de
custo, prazo e do que precisa contratar** (sem ver a base nem os scores) e gera
um **código** (`RO1:...`), um **link** ou um arquivo `.json` de devolução. O
time toca em **Receber obra, ficha ou mensagem**, cola o código ou importa o
arquivo, e a ficha **entra no banco já cruzada com os fornecedores**, tudo no
navegador. A ficha não pergunta mais AVCB, alvará, licença sanitária, ART nem
projeto na engenharia: esses itens viraram a lista de documentos da etapa 3.

---

## Trilha da triagem (D4)

A triagem é feita em **4 etapas, cada uma com um dono**. Só o dono edita.
A proposta completa, com as perguntas em aberto, está em
[[OTIMIZADOR-OBRAS-D4-TRIAGEM-POR-BLOCOS]].

| Etapa | Dono | O que faz no app | Ao concluir |
|---|---|---|---|
| 1 · Vistoria | Operações | LUC, área, testada, condição de entrega, AVCB, **o que já existe na loja** (9 itens), carga disponível em kVA, vistorias feitas, comentário interno | Passa ao Executivo. Marca as etapas 4 e 6 do fluxo |
| 2 · Validação | Executivo, com o lojista | O que a loja vai precisar (ficha ou preenchido junto), contrato, investimento, data da validação. O app mostra **Precisa × Existe** e sugere se a infra atende | **Atende**: libera documentos ao lojista. **Não atende**: vai para Operações orçar. Marca a etapa 14 |
| Orçamento | Operações | Itens a adequar (vêm da comparação), valor, prazo, observação para o lojista | Libera documentos ao lojista. Pode devolver ao Executivo, com motivo |
| 3 · Documentos | automático | Lista atual de documentos com prioridade (antes de iniciar, antes de inaugurar, depois de inaugurar) e até 3 fornecedores indicados por disciplina obrigatória | Marca a etapa 13 |
| 4 · Intranet e análise | Lojista, depois Operações | Lojista envia na intranet e toca em **Enviei**. Operações aprova ou marca pendência com motivo, documento a documento | Pendência volta ao lojista (rodadas contadas). Aprovação marca as etapas 15 e 16 |

**Negociação.** Em validação, orçamento, envio ou pendências, o lojista pode
tocar em **Não concordo** (ou o Executivo registra por ele). A obra **pausa onde
estava** e a vez passa ao Executivo, que conversa (comentário interno ou
visível ao lojista) e escolhe o desfecho: retomar, refazer o orçamento, rever
a validação ou encerrar sem acordo.

**Indicador.** Toda obra mostra uma linha no mesmo formato, por exemplo
`Etapa 2 de 4 · Validação · agora é com: Executivo · há 3 dias`, na cor do
dono. A partir de 2 dias úteis com o mesmo dono aparece um aviso amarelo; a
partir de 5, **atrasada**. Os dois prazos ficam em `LEMBRETE_UTEIS` e
`ESCALA_UTEIS`, no script.

**Corrigir e reabrir.** O dono de uma etapa já concluída pode **corrigir** os
dados sem mudar a etapa (fica no histórico) ou **reabrir** a etapa com motivo.

### Como a obra passa de uma pessoa para outra (sem servidor)

Cada botão de conclusão abre **Avisar agora**: a mensagem para o próximo
responsável já vem escrita, com um link, e sai com um toque no WhatsApp, no
e-mail ou copiando. O link carrega a obra comprimida; quem toca nele recebe a
versão atual no próprio navegador. Se o navegador já tiver uma versão **mais
nova** da obra, o app pergunta antes de substituir.

| Link | Para quem | O que faz |
|---|---|---|
| `obras.html#t=RO2:...` | Operações ou Executivo | Entrega a obra atualizada (trilha, vistoria, orçamento, documentos, histórico) |
| `obras.html#loja=RO2:...` | Lojista | Abre a página **Sua loja no shopping**: etapa, o que fazer agora, documentos, pendências com motivo, fornecedores indicados, orçamento e linha do tempo. Sem comentários internos nem notas de fornecedor |
| `obras.html#a=RO2:...` | Time, enviado pelo lojista | Registra "enviei", "reenviei" ou "não concordo". Uma mensagem já aplicada, ou de uma etapa que já passou, é recusada |
| `obras.html#lojista=RO2:...` | Lojista | Ficha da etapa 2, já com LUC e área da obra |

Tudo que chega por link é saneado antes de entrar no banco (ids, estados,
textos e listas). Os links **não são criptografados**: quem tiver o link
consegue ler o conteúdo. Envie só por canais diretos.

Obras que já existiam ganham a trilha automaticamente, a partir das etapas já
marcadas no fluxo de 30 etapas.

O **CSV de obras** (aba Obras → Exportar CSV) ganhou as colunas
`trilha_etapa`, `trilha_situacao`, `agora_com`, `dias_com_responsavel`,
`decisao_infra`, `orcamento_adequacao`, `rodada_analise` e `negociacao_aberta`.

> Persistência: fornecedores, obras e parâmetros ficam em `localStorage` (por
> navegador/dispositivo). Use **Backup JSON** para levar entre dispositivos ou
> guardar cópia. Para uma base **compartilhada entre vários usuários**, é
> preciso um backend (ver observação ao final).

---

## O que a ferramenta pergunta

O roteiro cobre exatamente o que muda a decisão de obra, em 6 blocos:

1. **Identificação** — lojista/marca, contato, ponto/LUC, segmento e tipo de
   operação (satélite, âncora, praça de alimentação, restaurante, serviço…).
2. **A loja** — **área (m²)**, testada de vitrine, **condição de entrega**
   (casca crua / com infra básica / loja existente), tipo de obra (nova,
   reforma, troca de marca), **carência concedida** e data alvo de inauguração.
3. **Padrão construtivo & materiais** — padrão pretendido (econômico,
   intermediário, alto, premium/flagship), **materiais e sistemas primordiais**
   (17 opções: marcenaria, pedra natural, ACM, vidro, resina, inox, iluminação
   cênica, comunicação visual…) e se a marca tem **manual construtivo próprio**.
4. **Instalações e complexidade** — ar-condicionado próprio, exaustão/coifa,
   gás, água/esgoto, carga elétrica reforçada (kVA), mezanino/estrutura
   metálica, fachada especial, refrigeração, automação e **alteração de
   sprinkler/detecção**.
5. **Segurança e regularização** — projeto submetido à engenharia do shopping,
   alteração de sprinkler/rota de fuga, AVCB/CLCB (do shopping ou próprio),
   alvará de funcionamento, licença sanitária e ART/RRT.
6. **Investimento e experiência** — **orçamento de obra**, reserva para
   imprevistos (%), forma de contratação (turn-key / administração / separada)
   e — o campo que mais muda a recomendação — a **experiência do lojista em
   obra**: primeira obra · já fez 1–2 lojas · rede com várias lojas · equipe
   técnica própria; além de já ter projeto e já ter gerenciadora.

---

## O que a ferramenta entrega

1. **Diagnóstico do lojista e da loja** — tipo de perfil e alertas acionáveis
   (orçamento abaixo da estimativa, reserva insuficiente, prazo estourando a
   carência, primeira obra com contratação separada, sprinkler indefinido…).
2. **Estimativa paramétrica de custo e prazo** — faixa de custo, custo por m²,
   dias de obra, dias de projeto/aprovação e ciclo total, comparados ao
   orçamento informado e à carência.
3. **Checklist de segurança e regularização** — 11 itens cobrindo shopping,
   prefeitura e Corpo de Bombeiros, com o estado de cada um a partir das
   respostas e a **etapa do fluxo** em que precisa estar resolvido (15–16 para
   projetos e ART, 21 para alvará e licenças, 29 para CA · seguro · PMOC).
3b. **O que o shopping vistoria nesta loja** — as disciplinas das vistorias
   gerais (6), de obra (20) e final (23) do fluxo — arquitetura, elétrica, SPK,
   detecção, hidráulica, cozinha/FTR, manta e forro, estanqueidade de gás,
   dados condominiais — marcadas como *aplica / não se aplica* pelas respostas.
4. **Escopo obrigatório** — as disciplinas que **precisam** ser contratadas para
   esta loja, com o motivo de cada uma (obrigatório / recomendado / opcional).
5. **Pacote de fornecedores recomendado** — para cada disciplina, os 3 melhores
   fornecedores da base com score, situação de credenciamento, obras já feitas
   no shopping, prazo de mobilização, nota histórica e **a razão mais crítica**
   de cada nota.
6. **Onde isto entra no fluxo** — o resultado aponta as etapas que consome e
   alimenta: 13 (kick off), 15–16 (documentos → início de obra), 20 · 23 · 25
   (vistorias) e 30 (feedback de fornecedores).
7. **Resumo copiável** para registrar no sistema ou enviar ao lojista, com o
   próximo passo no fluxo.

### Acompanhamento da obra pelo fluxo (aba Obras)

Cada obra guarda `steps` (etapas concluídas, com data), `contratados` (quem o
lojista contratou por disciplina) e `avaliacoes` (notas da etapa 30). Dali saem:

- **Etapa atual** = primeira etapa não concluída; **bloco** = o bloco dela;
  **responsável** = o dono da etapa, nas cores do fluxograma original.
- **Obra parada** = nenhuma etapa concluída há 14 dias ou mais (`STALE_DAYS`).
- **Etapa 30 → base.** *Registrar na base* atualiza a nota histórica de cada
  fornecedor contratado (média com as avaliações anteriores — uma base sem
  histórico trata a nota atual como uma observação), soma uma obra ao contador
  *obras neste shopping* e marca a etapa 30 como concluída. É o que fecha o
  ciclo: a avaliação de hoje muda a recomendação do próximo kick off.

> Registros salvos pela versão anterior (status manual Triagem → Projeto →
> Aprovação → Obra → Vistoria → Inaugurada) são convertidos na abertura: o
> status vira o conjunto de etapas concluídas até o marco equivalente (13, 15,
> 18, 22 ou 30). Anotações e triagem são preservadas.

---

## Metodologia de score

### Escopo (quais disciplinas entram)

Derivado das respostas, não de uma lista fixa. Exemplos:
**gerenciamento** vira obrigatório quando é a primeira obra do lojista, quando a
área ≥ 200 m² ou quando o padrão é alto/premium; **combate a incêndio** entra
sempre que há alteração de sprinkler/detecção — inclusive quando a resposta é
"não sei", caso em que o motivo é levantar antes de aprovar o projeto;
**hidráulica/gás** e **climatização/exaustão** entram por segmento de
alimentação ou pelas instalações marcadas; **arquitetura** cai para opcional
quando o lojista já tem projeto.

### Match do fornecedor (0–100)

Média ponderada de 6 dimensões:

| Dimensão | Peso | O que mede |
|----------|------|------------|
| Padrão construtivo | 22 | O fornecedor entrega o padrão da loja? Padrão vizinho pontua parcial. |
| Segmento | 18 | Experiência no segmento da loja (+ bônus por obras já feitas neste shopping). |
| Porte | 16 | A área da loja cabe na faixa de obra em que o fornecedor atua. |
| Credenciamento & documentação | 18 | Credenciado no empreendimento e com ART, seguro e NRs em dia. |
| Preço vs. orçamento | 14 | Faixa de preço do fornecedor contra o que o orçamento do lojista comporta. |
| Capacidade & prazo | 12 | Mobilização vs. carência, obras simultâneas e nota histórica. |

Mais um **bônus de até 6 pontos** por materiais primordiais do projeto que o
fornecedor domina.

### Travas (o que nenhum score compensa)

- **Não credenciado** → teto de **42**. O shopping não libera acesso à obra.
- **Credenciado com documentação pendente** → teto de **62**. Regularizar antes
  de emitir ordem de serviço.
- **Preço 2 faixas acima do que o orçamento comporta** → score multiplicado por
  **0,6** (penaliza sem achatar a ordem entre os penalizados).

Segurança e conformidade vêm antes de qualquer aderência técnica — é o mesmo
princípio do Radar de Quiosques, onde capital de implantação é pré-requisito.

**Faixas**: ≥78 Alto match · 60–77 Médio · 42–59 Baixo · <42 Não recomendado.

### Custo e prazo

```
custo_m2 = custo_base × fator_padrão × fator_segmento × fator_entrega
custo    = área × custo_m2 + extras de instalação
faixa    = custo × 0,85  a  custo × 1,20

dias_obra  = (prazo_base + área × prazo_por_m2) × fator_padrão + adicionais
ciclo_total = dias_obra + dias de projeto e aprovação
```

Fatores de padrão (custo): econômico 0,72 · intermediário 1,00 · alto 1,45 ·
premium 2,15. Fatores de segmento e de condição de entrega (casca crua 1,00 ·
infra básica 0,90 · reforma 0,78) estão no script. Todos os **valores base**
(custo/m², prazos, adicionais de climatização, exaustão, fachada, sprinkler, gás
e carga) são editáveis na aba **Obras → Parâmetros do empreendimento**.

---

## Fontes dos dados e ressalvas

> ⚠️ **A base de fornecedores que vem no arquivo é fictícia.** Os nomes
> ("Atelier Norte", "Construtora Bandeira", "Fogo Zero"…) e seus números foram
> criados apenas para a ferramenta nascer utilizável e demonstrável. **Não são
> fornecedores reais e não constituem recomendação.** Substitua pela base real
> de credenciados do seu empreendimento — aba **Fornecedores → Importar CSV**,
> ou **Cadastrar fornecedor** um a um.

> ⚠️ **Os parâmetros de custo e prazo são valores de partida, não referência de
> mercado auditada.** Não vieram de estudo publicado, tabela oficial ou índice
> setorial: são ordens de grandeza para o modelo funcionar. **Calibre com o
> histórico de obras do seu shopping** antes de usar o número em conversa
> comercial. A estimativa **não substitui** orçamento de fornecedor, projeto
> executivo nem a análise da engenharia do empreendimento.

O checklist de regularização (alvará, AVCB/CLCB, ART/RRT, licença sanitária,
NBR 9050) lista as **etapas usuais** de uma obra de loja em shopping no Brasil.
Exigências, prazos e competências variam por município, por Corpo de Bombeiros
estadual e pelo regulamento interno de cada empreendimento — **confirme sempre
com a engenharia do shopping e com o órgão local**.

---

## Como personalizar

### Ajustar os parâmetros de custo e prazo
Aba **Obras → Parâmetros do empreendimento**. É salvo no navegador
(`localStorage`). O padrão está em `DEFAULT_PARAMS` no script.

### Cadastrar / editar fornecedores
Aba **Fornecedores → Cadastrar fornecedor** (formulário completo) ou por CSV.
**Exportar CSV** serve de modelo — o rodapé do arquivo traz as chaves de
categoria, os padrões, os segmentos e as especialidades válidas. Campos:

| campo | significado |
|-------|-------------|
| `nome` | razão social ou nome comercial |
| `categoria` | disciplina (nome ou chave: `arquitetura`, `construtora`, `incendio`…) |
| `segmentos` | segmentos com experiência, separados por `;` (vazio = atende todos) |
| `padroes` | padrões construtivos atendidos, separados por `;` |
| `area_min` / `area_max` | faixa de área (m²) em que costuma atuar |
| `preco` | faixa de preço: 1 econômico · 2 intermediário · 3 alto · 4 premium |
| `credenciado` | 1/0 — credenciado no empreendimento |
| `documentacao_ok` | 1/0 — ART, seguro de obra, NRs e ASO em dia |
| `obras_simultaneas` | quantas obras toca ao mesmo tempo |
| `mobilizacao_dias` | dias entre a contratação e o início efetivo |
| `nota` | avaliação histórica de 0 a 5 |
| `avaliacoes` | quantas avaliações (etapa 30) compõem a nota — a próxima entra como média ponderada |
| `obras_neste_shopping` | quantas obras já executou no empreendimento |
| `especialidades` | materiais/sistemas que domina, separados por `;` |
| `contato` / `observacoes` | livre |

O import/export é **sem perda**: exportar e reimportar devolve exatamente a
mesma base.

### Base de teste (dados fictícios)
Para o time experimentar a ferramenta sem cadastrar nada: aba **Obras →
Carregar base de teste**. O botão baixa `public/exemplos/otimizador-obras-exemplo.json`
e **substitui** fornecedores, obras e parâmetros do navegador (a ferramenta
pede confirmação — faça um Backup JSON antes se houver dados reais). Conteúdo:

- **46 fornecedores fictícios** nas 16 disciplinas, com variedade de
  credenciamento (2 não credenciados, 4 com documentação pendente), faixa de
  preço, padrões, segmentos, áreas e notas — para ver travas, lacunas de
  cobertura e o ranking reagindo.
- **13 obras** em todos os estados da trilha: vistoria em andamento, validação
  atrasada com o Executivo (megaloja de 900 m² com carga insuficiente),
  orçamento com Operações, **negociação aberta** sobre o orçamento, documentos
  com o lojista, análise, **pendências na 2ª rodada**, aprovadas e uma
  **encerrada sem acordo**. No fluxo de 30 etapas há ainda troca de marca, uma
  obra **parada há 21 dias** e uma **concluída 30/30** com avaliações já
  somadas à base.
- Os mesmos arquivos ficam em `public/exemplos/` para uso manual:
  `fornecedores-obras-exemplo.csv` (Importar CSV),
  `fichas-lojista-exemplo.txt` (dois códigos `RO1:` prontos para colar em
  **Receber resposta**) e `otimizador-obras-base-teste.xlsx` (a mesma base
  em Excel, com abas de fornecedores, obras com as colunas da trilha, fluxo,
  fichas e resumo).

Nenhuma empresa, pessoa ou valor da base de teste é real.

### Novas disciplinas, segmentos ou materiais
Edite os arrays `CATEGORIES`, `SEGMENTS` e `MATERIAIS` no script de
`public/obras.html`. Segmentos e especialidades do CSV que não batem com a
lista oficial são preservados como texto livre.

---

## Publicação — link para o time e para o lojista

O projeto na Vercel é **`radarbazin1-s68m`** (conta `dvf15s-projects`), ligado a
este repositório. Domínios de produção do projeto:

```
https://radarbazin1-s68m.vercel.app/obras.html            (time de obras)
https://radarbazin1-s68m.vercel.app/obras.html#lojista    (ficha do lojista)
```

Esses links passam a servir o Otimizador de Obras **depois do merge em `main`**.
Antes disso, a própria branch já tem um deploy de pré-visualização:

```
https://radarbazin1-s68m-git-claude-supplier-scr-922e30-dvf15s-projects.vercel.app/obras.html
```

> ⚠️ Links de pré-visualização da Vercel costumam exigir que você esteja
> **logado na conta Vercel** dona do projeto para abrir (proteção de deployment).
> O link de produção, depois do merge, é público.

> ⚠️ Outros documentos deste repositório citam `radarbazin1.vercel.app`. Esse
> domínio **não** consta na lista de domínios deste projeto na API da Vercel
> (`radarbazin1-s68m.vercel.app`, `radarbazin1-s68m-dvf15s-projects.vercel.app`,
> `radarbazin1-s68m-git-main-dvf15s-projects.vercel.app`). Confirme qual é o
> domínio válido antes de compartilhar com terceiros.

Abre em qualquer navegador/celular, sem login e sem baixar nada. No iPhone,
**Compartilhar → Adicionar à Tela de Início** (pelo Safari) e, no Android,
**Instalar app**, criam um atalho com o ícone e o nome próprios, definidos em
`public/obras.webmanifest`.

### Ícone

Martelo de unha minimalista, silhueta branca sólida sobre o teal do app
(`#00616f`): unha em V à esquerda, corpo da cabeça, face de bater à direita e
cabo descendo do centro. Sem ornamento nem perspectiva.

Ao contrário do ícone do Radar de Quiosques, que é traço (line art), este é
**preenchido**: em traço fino o martelo perde a leitura abaixo de ~40 px e passa
a parecer uma placa. Preenchido, continua reconhecível a 28 px.

| arquivo | uso |
|---------|-----|
| `public/obra-icon.svg` | fonte do desenho e favicon vetorial |
| `public/obra-icon.png` | 512×512 — manifest (`any` e `maskable`) |
| `public/obra-icon-192.png` | 192×192 — favicon e manifest |
| `public/obra-icon-180.png` | 180×180 — `apple-touch-icon` |

Os PNGs são gerados a partir do SVG e são *full-bleed* (sem cantos próprios),
porque iOS e Android aplicam a própria máscara. O mesmo desenho é usado no
quadrado ao lado do título da página, para atalho e página terem a mesma
identidade.

> Repositório privado: o **código** continua privado; apenas a página estática
> publicada fica acessível pela URL.

---

## Limitação conhecida

Os dados ficam no `localStorage` de cada navegador. Dois usuários do time de
obras **não compartilham** a mesma base de fornecedores nem o mesmo banco de
obras. A trilha D4 contorna isso com os links de passagem (só o dono da vez
edita), mas o aviso ainda sai por um toque humano e duas pessoas podem ficar
com versões diferentes se uma delas não abrir o link mais recente. A escolha
de perfil organiza a tela, mas **não é controle de acesso**. Uma base compartilhada exigiria
backend (API + banco), o que sai do formato "arquivo único sem build" desta
ferramenta e do Radar de Quiosques.
