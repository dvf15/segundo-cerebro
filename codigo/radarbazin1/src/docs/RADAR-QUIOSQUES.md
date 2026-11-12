# Radar Quiosques — Triagem e Seleção de Investidores

Ferramenta de apoio ao **executivo comercial de shopping** para conduzir a
triagem de investidores interessados em operar um **quiosque**, fazer as
perguntas certas, e cruzar o perfil levantado com a base de marcas da **ABF /
PEGN** e com o **planejamento de mix** do empreendimento.

> Arquivo único, sem build, sem dependências: **`public/quiosques.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve em **`https://radarbazin1.vercel.app/quiosques.html`**
> após o merge na branch de produção.

---

## Estrutura em abas

A ferramenta é organizada em quatro abas:

1. **Triagem** — o roteiro de perguntas + recomendação; ao final, **salva o
   investidor** na base (novo ou atualização).
2. **Investidores** — o **banco de investidores** (mini-CRM): busca, filtro por
   status (Novo / Em contato / Proposta / Fechado / Descartado), detalhe
   recalculado ao vivo, anotações do executivo, e **exportar CSV / backup JSON /
   importar**.
3. **Planejamento** — cadastro dos **pontos do shopping**: pontos **ocupados**
   (com a marca que opera) e pontos **vagos** (com até **3 opções de mix
   desejado**, em ordem de preferência). Mais a lista de **marcas desejadas**.
4. **Cruzamento** — casa a base de investidores com o planejamento comercial:
   para cada **ponto vago**, o melhor **investidor × marca**; para cada **marca
   desejada**, quem na base se encaixa; e a **cobertura** (pontos vagos já com
   candidato vs. focos de captação).

### Ficha do investidor (enviar / receber, sem servidor)

O executivo clica em **Enviar ficha** (aba Triagem) → obtém um **link** (o app
em modo investidor, via `#investidor`) e o envia por WhatsApp/e-mail. O
investidor abre no celular, preenche uma ficha simplificada (sem ver scores) e
gera um **código** (`RQ1:...`) ou um arquivo `.json` que devolve. O executivo
clica em **Receber resposta**, cola o código / importa o arquivo, e a ficha
**entra no banco já pontuada** para triagem — tudo client-side.

### Importar investidores por CSV (cadastro em massa)

Na aba Investidores, **Exportar CSV** serve de modelo: abra no Excel/Google
Sheets, edite/adicione linhas e use **Importar CSV**. As colunas de `status`,
`tempo`, `operacao` e `experiencia` aceitam tanto o **rótulo** ("Integral",
"Contrato gerente", "Primeira vez", "Novo") quanto o **código** interno. Cada
linha importada é pontuada na hora contra o planejamento atual.

### Expandir a base de marcas por CSV (aba Planejamento → Base de marcas)

**Modelo de marcas** exporta as marcas atuais (colunas `nome, segmento,
investimento, giro, faturamento, payback, royalties, fundo, tempo, experiencia,
complexidade, abf, pegn, descricao`). Edite no Excel/Sheets e **Importar
marcas** — as marcas personalizadas ficam salvas no navegador e entram por cima
da base (uma marca com nome igual ao da base a substitui). **Segmentos novos**
citados no CSV são criados automaticamente e passam a aparecer nas opções de mix
dos pontos e nos interesses. "Restaurar base original" limpa as personalizadas.

### Importar pontos por CSV (preenchimento em massa)

Na aba Planejamento, **Baixar modelo (CSV)** gera um arquivo com os pontos
atuais + exemplos + a lista de segmentos válidos. Abra no Excel/Google Sheets,
preencha (colunas `nome, status, marca, mix1, mix2, mix3`; `status` = `ocupado`
com marca, ou `vago` com até 3 segmentos) e use **Importar CSV** para carregar —
opção de substituir todos os pontos ou adicionar aos existentes. O parser aceita
`,` ou `;` (Excel BR), campos com aspas, ignora linhas iniciadas por `#`, e
casa os nomes de segmento com a lista oficial (inclusive por correspondência
parcial).

### Planejamento por pontos

O mix do shopping é derivado dos **pontos**: a ocupação por segmento vem dos
pontos ocupados (marcas já presentes não são recomendadas de novo — anti
canibalização a nível de marca) e a **demanda** vem das opções de mix dos pontos
vagos (1ª opção pesa mais). O cruzamento resolve, por ponto vago, qual
investidor da base melhor se encaixa em qual marca dos segmentos desejados.

> Persistência: investidores, mix e planejamento ficam em `localStorage` (por
> navegador/dispositivo). Use **Backup JSON** para levar entre dispositivos ou
> guardar cópia. Para uma base **compartilhada entre vários executivos**, é
> preciso um backend (ver observação ao final).

## O que a ferramenta faz

1. **Roteiro de entrevista guiado** — leva o executivo pelas perguntas corretas,
   organizadas em 5 blocos:
   - **Identificação** (nome, contato, origem do lead).
   - **Capacidade de investimento** — capital para implantação **e** capital de
     giro reservado (separados de propósito: giro insuficiente é a maior causa
     de mortalidade no 1º ano), além da fonte do capital.
   - **Tempo dedicado** — disponibilidade (integral / parcial / baixa) e se vai
     operar pessoalmente ou contratar gerente.
   - **Experiência prévia** — primeira vez / já geriu negócio / experiência no
     setor; segmentos que já conhece; se já é franqueado.
   - **Marca & segmento em mente** — captura se o investidor **já tem uma marca
     específica** ou **segmentos de interesse**, além do perfil de risco e do
     objetivo.

2. **Cruzamento de dados (matching)** — pontua cada marca da base em 7 dimensões
   ponderadas (financeiro, capital de giro, tempo/operação, experiência,
   interesse/marca em mente, risco) gerando o **match do investidor**.

3. **Cruzamento com o mix do shopping** — o match é **modulado** pela aderência
   ao planejamento de mix: segmento com **vaga e lacuna** vira prioridade;
   segmento **saturado** derruba o score (evita canibalização). A modulação
   nunca infla o score acima do match do investidor — assim uma marca fora da
   capacidade financeira **não** é "resgatada" só porque há vaga.

4. **Saídas para a reunião**:
   - **Diagnóstico do investidor** (tipo de perfil + alertas, ex.: reserva de
     giro baixa, primeira operação → priorizar baixa complexidade).
   - **Lacunas do mix** do shopping (segmentos com vaga abaixo da meta).
   - **Ranking de marcas recomendadas** com score, faixas de investimento,
     payback, royalties, selos ABF / Destaque PEGN, e as razões de cada nota.
   - **Resumo copiável** para registrar no CRM ou enviar ao investidor.
   - Se o investidor citou uma marca, ela é **validada explicitamente** (com o
     score e alternativas equivalentes quando a aderência é baixa).

---

## Metodologia de score

- **Match do investidor** (0–100): média ponderada das 7 dimensões.
  Pesos em `W` no script (financeiro 30 · interesse 18 · giro/tempo/experiência
  14 cada · risco 10). O **financeiro** funciona como trava: implantação acima
  do capital penaliza forte a nota.
- **Aderência ao mix** (0–100): derivada de `meta / atual / vagas` do segmento.
- **Score final** = `match × (0,7 + 0,3 × mix/100) + bônus_lacuna`, limitado a
  100. Isto é: o mix modula entre **0,7× e 1,0×** o match e adiciona um pequeno
  bônus quando preenche uma lacuna prioritária — nunca resgata um perfil
  inviável.
- **Faixas**: ≥78 Alto match · 60–77 Médio · 42–59 Baixo · <42 Não recomendado.

---

## Fontes dos dados e ressalvas

A base de marcas (`BRANDS` no script) reúne franquias que operam em **formato
quiosque / quiosque-express** em shoppings brasileiros. Os valores de
**investimento de implantação, capital de giro, faturamento médio, payback,
royalties e fundo de propaganda** são de **referência**, compilados de material
público da **ABF (Associação Brasileira de Franchising)** e do **PEGN —
Pequenas Empresas & Grandes Negócios** (Guia/Ranking das Melhores Franquias).

> ⚠️ Números reais variam por praça, formato, ano e negociação. **Sempre
> confirme na COF (Circular de Oferta de Franquia)** e na proposta comercial da
> rede antes de qualquer decisão. A ferramenta é apoio à decisão do executivo —
> **não substitui** a análise financeira formal nem a due diligence.

---

## Como personalizar

### Ajustar o mix do shopping
Clique em **⚙ Mix do Shopping** no topo. Para cada segmento defina **Meta**
(quantos quiosques o mix ideal quer), **Atual** (quantos já operam) e **Vagas**
(posições comercializáveis agora). É salvo no navegador (`localStorage`).
O padrão está em `DEFAULT_MIX` no script.

### Adicionar / editar marcas
Edite o array `BRANDS` em `public/quiosques.html`. Campos:

| campo | significado |
|-------|-------------|
| `n` | nome da marca |
| `seg` | segmento (deve existir em `SEGMENTS`) |
| `invest` | investimento de implantação (R$) |
| `giro` | capital de giro sugerido (R$) |
| `fat` | faturamento médio mensal (R$) |
| `payback` | retorno em meses |
| `roy` / `fpp` | royalties / fundo de propaganda (%) |
| `tempo` | `dono` \| `gerente` \| `passivo` (dedicação que a rede pede) |
| `exp` | `iniciante` \| `intermediario` \| `avancado` (experiência recomendada) |
| `compl` | complexidade operacional (1–5) |
| `abf` / `pegn` | selo ABF / destaque PEGN (1/0) |
| `desc` | descrição curta |

### Novos segmentos
Inclua o nome em `SEGMENTS` e a linha correspondente em `DEFAULT_MIX`.

---

## Publicação — link para o executivo

O arquivo vive em **`public/quiosques.html`**. Como o repositório já tem deploy
na **Vercel**, ao chegar na branch de produção (`main`) a ferramenta fica
disponível no link público:

```
https://radarbazin1.vercel.app/quiosques.html
```

Esse link abre em qualquer navegador/celular, sem login e sem baixar nada, e é
atualizado automaticamente a cada `git push` na branch de produção. Basta
compartilhar a URL com o executivo (ou adicionar à tela inicial no celular).

> Repositório privado: o **código** continua privado; apenas a página estática
> publicada fica acessível pela URL. Não há GitHub Pages configurado (exigiria
> repositório público).
