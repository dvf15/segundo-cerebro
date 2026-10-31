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

1. **Triagem** — o roteiro de perguntas (6 blocos) + o resultado: diagnóstico,
   estimativa de custo e prazo, checklist de segurança/regularização (cada item
   marcado com a **etapa do fluxo** em que precisa estar resolvido), o quadro do
   que o shopping **vistoria** nesta loja (etapas 6, 20 e 23) e o **pacote de
   fornecedores recomendado** por disciplina. É o material do **Kick Off de
   Obras (etapa 13)**. Ao final, **salva a obra** no banco.
2. **Obras** — o **banco de obras**, com cada obra percorrendo as **30 etapas**:
   caixa de seleção por etapa (com data registrada), atalho *até aqui* para
   marcar todas as anteriores, etapa atual com **quem está com a bola**, bloco
   (A–F), progresso e alerta de **obra parada** (sem etapa concluída há 14+
   dias). Por obra, ainda: **fornecedores contratados** por disciplina e a
   **avaliação da etapa 30**, que devolve a nota para a base. Anotações do
   time, filtro por bloco e exportação CSV. Os **Parâmetros do empreendimento**
   (custo e prazo) ficam no fim da aba, recolhidos.
3. **Fornecedores** — o **catálogo de fornecedores do shopping**, organizado nos
   três grupos pedidos (engenharia/arquitetura/gerenciamento · materiais e
   acabamentos · segurança e regularização): busca, filtro por categoria e por
   situação de credenciamento, cadastro/edição, **exportar CSV / importar CSV /
   backup JSON**.
4. **Painel** — **onde cada obra está** (blocos A–F e concluídas), **com quem
   está a bola** (obras por responsável da etapa atual, etapas mais frequentes,
   obras paradas), e o cruzamento com a base: cobertura por disciplina, obras
   antes do início (até a etapa 16) × disciplinas **sem fornecedor apto**,
   fornecedores mais aderentes à carteira e conformidade documental.

### Ficha da obra (enviar / receber, sem servidor)

O time de obras clica em **Enviar ficha ao lojista** (aba Triagem) → obtém um
**link** (o app em modo lojista, via `#lojista`) e o envia por WhatsApp/e-mail.
O lojista abre no celular, responde as mesmas perguntas, **recebe uma prévia de
custo, prazo e do que precisa contratar** (sem ver a base nem os scores) e gera
um **código** (`RO1:...`), um **link** ou um arquivo `.json` de devolução. O
time clica em **Receber resposta**, cola o código / importa o arquivo, e a ficha
**entra no banco já cruzada com os fornecedores** — tudo client-side.

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
| `obras_neste_shopping` | quantas obras já executou no empreendimento |
| `especialidades` | materiais/sistemas que domina, separados por `;` |
| `contato` / `observacoes` | livre |

O import/export é **sem perda**: exportar e reimportar devolve exatamente a
mesma base.

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
obras — a troca é manual, via Backup JSON ou CSV. Uma base compartilhada exigiria
backend (API + banco), o que sai do formato "arquivo único sem build" desta
ferramenta e do Radar de Quiosques.
