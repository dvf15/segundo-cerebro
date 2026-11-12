# Radar de Auditoria — 2.1

> Acelerador de auditoria de lojistas de um shopping. Antes chamado *Apurador Fiscal*
> (1.x), *Acelerador de Auditoria* e *Radar de Dispersão de Vendas* (2.0). A pasta (`apurador-fiscal/`), o pacote e os
> nomes de arquivo continuam os mesmos, para nenhum link ou script quebrar.

Duas cadências que não se misturam:

- a **triangulação** entra **dia a dia ou semana a semana** — redução Z e relatório do PDV,
  só em PDF ou foto, como saem da loja — e é **fechada por mês**; o fechado vira histórico;
- a **auditoria fiscal** é **anual**: o ciclo abre todo **1º de abril** e audita os livros do
  ano-calendário anterior, comparando o que aparece nos livros com o que o lojista informou.

Em volta das duas, o **acompanhamento**: a carteira de lojistas, o painel de livros
recebidos / auditados / negociados / cobrados do ciclo, e o fluxo mensal de notificações
para quem não entregou — três notificações, aviso de multa e o comando de enviar a multa.
No fim, o **cruzamento** entre o histórico da triangulação e a auditoria anual.

A página roda inteira dentro do navegador. Não há servidor, não há upload e não há
dependência de internet — as bibliotecas de leitura de PDF e de Excel estão embutidas
no próprio arquivo HTML. O único recurso que acessa a rede é o OCR de fotos, e só
quando você carrega uma imagem.

> Isto é uma ferramenta de **triagem**: ela mostra onde olhar. Não substitui a análise
> do seu contador e não prova que as vendas realmente ocorridas estão em algum lugar:
> compara só as fontes que você forneceu.

## Vídeos do passo a passo

Dois, sem áudio, com legendas na tela. Os dois aparecem na aba **Como funciona** da
versão publicada.

| Arquivo | Formato | O que mostra |
|---|---|---|
| `demo/apurador-fiscal-passo-a-passo.mp4` | 1280×820, 3min42 | no computador: do carregamento dos arquivos à leitura das divergências |
| `demo/apurador-fiscal-celular.mp4` | 1080×1920 vertical, narrado | o passo a passo completo no celular: carteira de lojistas, notificação, societário, **triangulação** (Z e PDV em PDF, NAPP em planilha), depois a **auditoria fiscal** (livros e ficha), o painel marcando sozinho, o fechamento do mês, o cruzamento final, o dashboard e a base fictícia |
| `demo/radar-novidades.mp4` | 1080×1920 vertical, narrado, curto | só as mudanças mais recentes: a triangulação com o NAPP, o maior valor em destaque e a leitura pela variação em R$ |

Nenhum dos dois é encenação: é um Chromium de verdade usando o sistema de verdade,
com os arquivos de `demo/`. O roteiro confere na tela cada número que narra — se o
sistema mudar e o vídeo passar a dizer algo falso, a gravação falha em vez de
publicar a afirmação errada.

```bash
npm run demo            # gera os arquivos fictícios de demo/
npm run video           # regrava o vídeo de computador (precisa de ffmpeg; ~10 min)
pip install piper-tts && npm run voz   # uma vez: o sintetizador e a voz pt-BR da narração
npm run video:celular   # regrava o vídeo vertical, com narração em áudio (~20 min)
npm run video:novidades # regrava o vídeo curto das novidades (precisa de demo/simulacao/)
SEM_AUDIO=1 npm run video:celular      # o mesmo, só com legendas
RAPIDO=1 npm run video:novidades       # ensaio: só as conferências, sem gerar vídeo
```

### A narração

O vídeo vertical é narrado por voz sintética, gerada local pelo [Piper](https://github.com/rhasspy/piper)
(rede neural na CPU, sem internet depois de baixar a voz). Cada legenda vira um trecho
de áudio em cache (`demo/.narracao/cache`, fora do git) e entra na trilha no instante em
que a legenda apareceu; o roteiro espera o maior entre o tempo de leitura e o da fala.
`scripts/narracao.mjs` também traduz legenda em fala: siglas soletradas (C N P J, P D V),
código CFOP dígito a dígito, milhar sem ponto, "R$" fora.

A voz é a `pt-br-edresson-low` do release v0.0.2 do Piper no GitHub — as vozes mais
novas ficam no Hugging Face, que o proxy deste ambiente bloqueia. Limite conhecido dela:
o mapa de fonemas não tem a marca de nasalização, então "não" sai perto de "nau".
Inteligível, com sotaque; para uma voz melhor, troque o modelo em `scripts/narracao.mjs`
(`VOZ`) por uma voz pt_BR mais nova e rode `npm run video:celular` de novo.

Os dois vídeos verticais usam a mesma câmera, `scripts/video-celular.mjs` (gravação,
narração, destaques e pós-produção); cada um é só um roteiro que a usa.

O vídeo vertical usa viewport de 1080×1920 com `zoom: 2.5` no `<body>`, e não um
viewport de celular: o Playwright grava no tamanho do viewport em pixels CSS e
ignora o `deviceScaleFactor`, então 432 px de largura sairiam borrados ao ampliar.
Com o zoom o layout se comporta como uma tela de 432 px e cada pixel gravado é nítido.

### Os arquivos de demonstração

Empresa, CNPJ e valores são fictícios, para o vídeo poder ser compartilhado.
Cada mês foi montado para produzir um desfecho diferente:

| CNPJ | Competência | Resultado | O que ensina |
|---|---|---|---|
| …0001-81 | 01/2025 | OK | 120.000 de venda − 4.500 de devolução = 115.500, igual à planilha |
| …0001-81 | 02/2025 | DIVERGENTE | 40.000 em CFOP 5405 (venda com ST) ficaram fora da planilha |
| …0001-81 | 03/2025 | OK | o CFOP 5929 é espelho de venda já registrada — somá-lo dobraria o mês |
| …0002-62 | 01/2025 | ATENÇÃO | 900 reais em 45 mil: abaixo do limite, provavelmente desconto |
| …0002-62 | 02/2025 | SÓ NA APURAÇÃO | houve venda escriturada e a planilha não trouxe o mês |

Para a aba **Triangulação**, `npm run demo` também gera `demo/reducao-z-marco-2025.pdf`
(30 cupons de redução Z, um por página, em bobina de 80 mm) e `demo/pdv-marco-2025.pdf`
(relatório de vendas por dia). E `demo/lojistas.csv`, uma carteira de oito lojistas com
CNPJ fictícios de dígito verificador válido. Z e PDV foram montados para produzir achados
de propósito: os dias 12, 13 e 14/03 têm venda no PDV
que não aparece na redução Z, e a Z do dia 20 está **ausente** — o CRZ salta de 629 para
631 e o Grande Total avança R$ 8.211,00 num dia cuja venda bruta registrada é R$ 4.591,00,
deixando R$ 3.620,00 sem cupom.

## Como usar

**Jeito rápido:** abra `index.html` com duplo clique. É um arquivo só, autocontido —
dá para mandar por e-mail, colocar num pendrive ou publicar como página estática.

**Pelo repositório:**

```bash
cd apurador-fiscal
npm run build     # regenera index.html a partir de src/ + vendor/
npm test          # 118 testes de unidade
npm run e2e -- livro-entradas.pdf livro-saidas.pdf -- vendas.csv   # teste no navegador
```

Na página, na ordem do trabalho:

1. **Lojistas.** Lance a carteira do shopping uma vez — planilha com `CNPJ`, `Loja` e, se
   tiver, `LUC`, `E-mail`, `WhatsApp` e `Regime` (colunas reconhecidas pelo cabeçalho) — ou
   um a um. CNPJ com dígito verificador errado é recusado. Loja fechada vira *inativa*.
2. **Painel.** O ciclo em vigor (em setembro de 2026: ciclo 2026, livros de 2025, 6º mês),
   quantos entregaram mês a mês desde abril e o status de cada lojista: *não recebido →
   recebido → auditado → negociado → cobrado*. A data de cada marco é editável; *recebido* e
   *auditado* também são preenchidos sozinhos quando o livro do lojista é carregado e
   conciliado (marcados com ✦). Valores de divergência, negociado e cobrado ficam na linha.
   *Salvar cópia (JSON)* / *Restaurar cópia* levam o acompanhamento para outro aparelho.
3. **Notificações.** Para quem não entregou, uma etapa por mês contada da abertura do ciclo:
   1ª notificação (abril), 2ª (maio), 3ª (junho), aviso de multa (julho), **enviar multa**
   (agosto). Cada etapa tem o texto pronto — e-mail, WhatsApp ou copiar — e o botão que
   registra a data; a multa pede confirmação. Quem entrega sai do fluxo na hora. Quem entrou
   atrasado no fluxo acumula etapas e a página diz quantas. A página não envia nada sozinha:
   abre o seu e-mail ou WhatsApp com o texto e guarda a data quando você confirma.
4. **Triangulação.** Reduções Z e relatórios de PDV **só em PDF ou foto**, conforme chegam;
   o **NAPP** em planilha diária (Excel ou CSV), pelo CNPJ ou pelo número da loja.
   Mês a mês e dia a dia com o **maior valor** em destaque e a variação em R$; ao fim do mês, **Fechar mês** grava o
   resultado no histórico (fechar de novo substitui). O **cruzamento final** cruza o histórico
   com a auditoria anual — os meses ainda abertos aparecem marcados como tal.
5. **Auditoria fiscal → Arquivos → Apuração fiscal.** Carregue o Registro de Entradas *e* o de Saídas.
   Os dois importam: as devoluções de venda, que reduzem o faturamento, ficam no livro
   de entradas.
   **Empresa do Simples Nacional:** carregue aqui o PDF do *Extrato do Simples (PGDAS-D)*.
   Para essas empresas é ele — a receita declarada à Receita Federal — que serve de
   referência contra a venda informada, no lugar do livro de ICMS.
6. **Auditoria fiscal → Arquivos → Vendas informadas.** Excel ou CSV com CNPJ, competência e valor
   (o cabeçalho é reconhecido sozinho; havendo dúvida, corrija em *Mapeamento de
   colunas*) — **ou** o PDF do *Extrato do Simples Nacional (PGDAS-D)*, lido direto,
   sem preparo. Pode carregar vários arquivos.
7. **Auditoria fiscal → Conciliação.** Uma linha por CNPJ e competência, com vendas brutas, devoluções,
   vendas líquidas, o informado e a diferença. Uma competência cujo livro de saídas
   não foi carregado aparece como **LIVRO INCOMPLETO**, não como divergência — a
   diferença ali é falta de arquivo, e chamá-la de divergência afogaria as de verdade.
8. **Auditoria fiscal → Detalhe por CFOP.** Todo código lido e o que ele fez com o número
   final. É aqui que se confere se algo caiu no balde errado.

### O ciclo anual e o fluxo de notificações

O ciclo abre em 1º de abril (mês configurável em `prefs.mesInicio`) e cobre os livros do
ano-calendário anterior. Antes de abril, o ciclo em vigor ainda é o do ano passado. Para
cada lojista ativo o registro do ciclo guarda as datas dos quatro marcos, as datas de cada
etapa de notificação, os valores negociados e uma observação.

| Mês do ciclo | Etapa devida para quem não entregou |
|---|---|
| 1º (abril) | 1ª notificação |
| 2º (maio) | 2ª notificação |
| 3º (junho) | 3ª notificação |
| 4º (julho) | Aviso de multa |
| 5º (agosto) | Multa enviada |

A etapa devida é a próxima ainda não registrada cujo mês já chegou; quem começa tarde
acumula. O que é multa, quanto e por qual cláusula vem do contrato de locação e é você
quem escreve em *Textos e prazos* — o sistema não inventa valor.

### Base fictícia para teste

Na aba **Lojistas** (ou no Dashboard vazio), **Carregar base fictícia** preenche o app com um
shopping inventado — *Shopping Parque Exemplo* — para conhecer tudo sem dados reais:

- **40 lojistas** (39 ativos), CNPJs fictícios com dígito verificador válido, 30 em SP e 10
  em outros estados, datas de início de contrato entre 2015 e 2026, alguns sem e-mail ou
  WhatsApp. Os dois primeiros usam os CNPJs dos livros de `demo/`, então a auditoria fiscal
  concilia com eles.
- **Ciclo anual em andamento:** livros recebidos, apurados, negociados e cobrados espalhados
  pelos meses desde abril, com valores; notificações em dia, atrasadas e multas enviadas.
- **Triangulação:** seis meses fechados, adesão crescendo mês a mês, a maioria coerente e
  uma parte dispersa (com alerta de PDV acima da redução Z).
- **Societário:** pesquisados e não pesquisados, triagem sem indício, guia a pagar,
  alteração anterior ao contrato, sinalizados aguardando validação, isento, TT em cobrança,
  negociada e cobrada; cláusulas de multa e de TT já preenchidas.

As datas são relativas ao dia em que a base é carregada, e a geração é determinística.
Uma faixa de aviso no topo indica que a base é fictícia, com o botão **Apagar base fictícia**. Se já
houver uma carteira real no navegador, o app pede **duas confirmações** antes de
substituí-la (use *Salvar cópia (JSON)* antes, se quiser guardá-la).

**Roteiro de testes.** Os 24 primeiros lojistas têm cenários fixos — 27 ao todo, cobrindo
todos os status do livro (não recebido em cada etapa do fluxo, multado, recebido, apurado,
negociado, cobrado), da triangulação (disperso, coerente, só Z, sem Z nem PDV, NAPP como maior valor) e do
societário (não consultado, sem indício, guia a pagar, certidão a baixar, anterior ao
contrato, outra alteração, falta a data, sinalizado, isento, TT em cobrança em dia e
atrasada, negociada, cobrada). Com a base carregada, o Dashboard mostra o roteiro — loja a
loja, o que deve aparecer e em qual aba — com botão para baixá-lo em Markdown.

Fora do app: `npm run base` grava `demo/base-ficticia.json` (para *Restaurar cópia* no
Painel), `demo/lojistas-base-ficticia.csv` (só a carteira, para a aba Lojistas) e
`demo/roteiro-de-testes.md` (o roteiro acima). `python3 scripts/gerar-base-excel.py` (precisa de
`openpyxl`) grava `demo/base-ficticia.xlsx`: a base inteira em Excel para o time — Lojistas
(importável na aba Lojistas), Roteiro de testes com coluna de resultado, Auditoria fiscal,
Triangulação e Societário com o status que o app calcula, e um Resumo por fórmula.

A planilha de lojistas pode ter outras abas (capa, instruções): o app usa a primeira aba em
que encontrar o cabeçalho com CNPJ e nome.

### Simulação completa (para o time testar tudo)

`demo/simulacao/` traz, sobre a base fictícia, um arquivo de cada tipo que o app lê, no formato
em que ele chega de verdade, e o roteiro em Excel (`00-roteiro-de-simulacao.xlsx`) com o passo a
passo e o que cada arquivo deve produzir:

- `0-base/` — a base (JSON para *Restaurar cópia* e Excel de consulta);
- `1-carteira/` — lojistas novos, uma atualização, CNPJ inválido, CNPJ repetido, lojista sem UF;
- `2-auditoria/` — livro impresso P1/P2 (PDF), SPED EFD (TXT), resumo por CST/CFOP (PDF), extrato do
  Simples PGDAS-D (PDF), livro em planilha (XLSX) e a ficha de vendas 2025: todos os status da
  conciliação (OK, ATENÇÃO, DIVERGENTE, SÓ NA APURAÇÃO, SÓ NO INFORMADO, LIVRO INCOMPLETO);
- `3-triangulacao/` — reduções Z em PDF e em foto (JPG, lida por OCR — precisa de internet),
  relatórios de PDV e a ficha de 10/2026: COERENTE, DISPERSO, FONTE ÚNICA, Z faltando, fechamento do
  mês e o cruzamento final (TUDO FECHA, ATENÇÃO, INVESTIGAR, FONTES DE MENOS).

Para regerar e conferir no app:

```bash
npm run base && python3 scripts/gerar-base-excel.py
node scripts/gerar-simulacao.mjs        # os arquivos
node scripts/conferir-simulacao.mjs     # carrega tudo no app e confere (50 conferências)
python3 scripts/gerar-roteiro-simulacao.py
```

### Dashboard

A primeira aba. Uma seção por processo, cada uma com gráfico e **pendências** (grupos
com contagem; clique para ver quem):

| Processo | Indicadores | Pendências |
|---|---|---|
| Auditoria fiscal | % de livros recebidos, apurados, negociados e cobrados sobre a carteira ativa; evolução acumulada mês a mês do ciclo (linhas, com tabela); divergência, negociado e cobrado em R$ | não recebidos (com a etapa devida), recebidos sem apuração, apurados sem negociação, negociados sem cobrança |
| Triangulação | % de lojistas com cada etapa na competência escolhida — redução Z, PDV, NAPP, declarado, mês fechado; variação em R$ média e máxima por competência contra o limite de atenção, e a venda não declarada (barras, com tabela) | sem Z, sem PDV, meses abertos, variação acima do limite |
| Societário / TT | % pesquisados na Junta, sinalizados, TT confirmada, % contatados e cobrados (sobre as confirmadas); TT contratual encontrada, negociada e faturada; % faturado sobre o encontrado | não pesquisados, guias a pagar, a validar, TT sem contato, notificações devidas, sem início de contrato |

"Encontrada" é a soma da taxa prevista dos lojistas sinalizados nos últimos 12 meses que não
são isentos; "faturada" é a soma do valor cobrado. As três cores das linhas são a paleta de
referência validada (contraste e daltonismo) nos dois temas; cada série tem rótulo escrito
ao lado, para não depender só da cor. Os números vêm de `src/dashboard.js` (funções puras,
3 testes).

### Mudança societária e taxa de transferência (aba Societário)

Loja que muda de mãos — cessão de quotas, novo controle, incorporação — costuma dever a
**taxa de transferência** do contrato. A ferramenta **não consulta a Junta sozinha**: cada
estado tem portal próprio, sem API pública, e os portais não aceitam o CNPJ na URL. O que
ela faz:

1. **Pesquisar** — botão que abre a Junta Comercial do **estado do contrato** (a UF do
   lojista) com o CNPJ já copiado para colar; mais um botão de busca de apoio e a consulta
   federal da Receita (QSA, o quadro de sócios e administradores).
2. **Triar antes de pagar** — levante todas as lojas de graça (QSA da Receita, listagem de
   atos na Junta) e marque o indício; a guia da certidão só é paga para as que possam
   caracterizar TT. O painel conta as *guias a pagar*.
3. **Registrar** — houve mudança a partir do início do contrato? data, **causa** (as quatro
   possíveis causas de TT: alteração de capital social, alteração de sócio/administrador,
   entrada/saída de sócio/administrador, alteração de objeto social — ou "outra", que não
   sinaliza), número do registro, resumo.
4. **Sinalizar** — causa de TT registrada **depois do início do contrato** com o shopping e
   dentro dos **últimos 12 meses** marca o lojista em vermelho e abre o bloco de validação.
   Alteração anterior ao início do contrato fica como *anterior ao contrato*: não é TT. Por
   isso a carteira tem a coluna *Início do contrato*, e a aba avisa quem está sem ela.
5. **Validar** — há isenção no contrato? qual o **limite contratual** para conferência
   (ex.: "até 25% das quotas entre sócios atuais")? taxa prevista? *Confirmar cobrança* ou
   *Confirmar isenção*.
6. **Notificar e negociar** — confirmada a cobrança, roda o mesmo fluxo de cinco etapas da
   auditoria fiscal, contado da data da validação, com textos adaptados: 1ª, 2ª e 3ª
   notificação, aviso de cobrança e **lançamento da taxa**; depois os marcos negociado e
   cobrado, com valores. As pendências aparecem na aba Societário e na aba Notificações.

**Skill "Levantamento de TT via Junta Comercial"** (`docs/skill-levantamento-tt.md`, em
formato de nota do Obsidian) está incorporada à aba: o **passo a passo** de 17 passos no
portal da Junta (triagem gratuita → certidão de inteiro teor paga → download após a
compensação), o **motivo** do levantamento (auditoria periódica, renovação/aditivo,
suspeita), os campos **NIRE**, **protocolo**, **guia paga em** e **certidão baixada em**, e o
**checklist por lojista** de sete itens com progresso — os itens de certidão e
encaminhamento não se aplicam a quem não tem gatilho de TT depois do início do contrato.
O Dashboard conta *checklist completo* e lista *certidão paga, aguardando download*.

A cláusula da taxa (quantos aluguéis, qual artigo) é escrita uma vez pelo time; o sistema
não inventa percentual nem valor.

**Endereços das Juntas.** Confirmados em fonte oficial ou de referência em 14/10/2026:
SP, RJ, MG, PA, BA, CE, PE, GO e DF. Os outros 18 são o endereço conhecido do órgão,
marcados *(verificar)* na tela — o proxy deste ambiente bloqueia os sites `.gov.br`, então
não consegui abri-los daqui. Se um tiver mudado, corrija em `src/societario.js` (`JUNTAS`)
ou use o botão *Buscar*.

### Onde o acompanhamento fica

No `localStorage` **deste navegador**, na chave `radar-dispersao:acompanhamento:v2`. Outro
computador não vê o mesmo painel. Para o time trabalhar junto, ou combine um aparelho como
oficial ou passe a cópia JSON adiante. Uma base compartilhada entre pessoas seria o passo
seguinte natural — está em *Limites conhecidos*.

## A conta

```
  Vendas brutas        CFOP de venda no livro de SAÍDAS
(−) Devoluções         CFOP de devolução de venda no livro de ENTRADAS
─────────────────
= Vendas líquidas      é este número que vai contra a planilha
```

### O que entra como venda

| Faixa de CFOP | O que é |
|---|---|
| `x.101` a `x.106`, `x.109` a `x.120`, `x.122`, `x.123` | Venda de produção própria ou de mercadoria de terceiros, inclusive consignação, entrega futura e venda à ordem |
| `x.251` a `x.258` | Venda de energia elétrica |
| `x.301` a `x.307` | Prestação de serviço de comunicação |
| `x.351` a `x.360`, `x.931`, `x.932` | Prestação de serviço de transporte |
| `x.401` a `x.405` | Venda com substituição tributária (substituto e substituído) |

### O que deduz da venda

| CFOP | O que é |
|---|---|
| `x.201` a `x.204` | Devolução de venda |
| `x.205` a `x.207` | Anulação de comunicação, transporte e energia |
| `x.212`, `x.213` | Devolução de venda sob drawback |
| `x.410`, `x.411` | Devolução de venda com substituição tributária |
| `x.503` a `x.505` | Devolução de remessa com fim específico de exportação |
| `3.201`, `3.202` | Devolução de venda de exportação |

### O que fica de fora, e por quê

| CFOP | Por que não é venda |
|---|---|
| `x.151` a `x.156` | Transferência entre estabelecimentos da mesma empresa |
| `x.910`, `x.911` | Bonificação, doação, brinde e amostra grátis: saída sem receita |
| `x.901` a `x.909`, `x.912` a `x.921`, `x.923` a `x.926`, `x.934` | Remessas e retornos: industrialização, conserto, demonstração, feira, comodato, armazém geral, consignação |
| `x.927`, `x.928` | Baixa de estoque por perda, roubo, deterioração ou fim de atividade |
| `x.922` | Simples faturamento de venda para entrega futura — a venda é lançada no `x.116`/`x.117`. Somar os dois dobraria o faturamento |
| `x.929` | Espelho de operação já registrada em ECF/SAT/cupom. Mesma razão |
| `x.201` a `x.210` (saída) | Devolução de **compra**: mercadoria voltando ao fornecedor |
| `x.501` a `x.505` (saída) | Remessa com fim específico de exportação; a venda é a exportação em si |
| `x.6xx` | Transferência de crédito e ressarcimento de ICMS |

Três códigos ficam em colunas separadas, porque são receita mas não são venda de mercadoria:

- `x.551` — **venda de ativo imobilizado**;
- `x.933` — **serviço tributado pelo ISS**, fora do ICMS;
- `x.949` — **"outra saída não especificada"**. Genérico demais para o sistema decidir:
  fica fora das vendas e vira alerta, com o valor à vista, para você julgar.

CFOP que não esteja na tabela também fica de fora e gera alerta — o sistema não chuta.
Se a sua operação exige tratamento diferente, a aba **Tabela de códigos** deixa mudar a
regra de qualquer CFOP, e o cálculo refaz na hora.

**Base da tabela:** Convênio S/Nº de 15/12/1970, Anexo (Tabela de Códigos Fiscais de
Operações e Prestações), na redação do Ajuste SINIEF 07/01 e alterações posteriores,
publicado pelo CONFAZ em <https://www.confaz.fazenda.gov.br/legislacao/convenios/1970/CV_SN_70>.
A tabela de códigos é norma; a classificação em "venda / não venda" é a convenção
deste sistema, descrita acima e editável por você.

## Formatos de entrada

| Formato | Como é lido | Confiança |
|---|---|---|
| **SPED EFD ICMS/IPI** (`.txt`) | Registros `0000`, `C100`/`C190`, `C400`/`C490`, `C800`/`C850`, `C500`/`C590`, `D100`/`D190`, `D500`/`D590`. Documento com `COD_SIT` 02 a 05 (cancelado, denegado, inutilizado) é descartado | Alta — é a fonte oficial |
| **PDF do livro impresso** (modelo P1/P2) | Usa o *Resumo mensal de operações por código fiscal* de cada mês e confere contra a soma das linhas de detalhe. Linha marcada como cancelada não entra | Alta |
| **PDF/relatório de resumo por CST e CFOP** (o do visualizador do Sped) | Endireita a página quando o texto vem girado; descobre a ordem das colunas pela conta `base × alíquota = ICMS` e pela contagem de colunas da página; **confere a soma contra o TOTAL impresso** e avisa se não fechar | Alta |
| **Excel / CSV** | Colunas reconhecidas pelo cabeçalho, com correção manual | Alta |
| **Foto** (PNG, JPG, …) | OCR via tesseract.js, baixado sob demanda | **Baixa — confira valor por valor** |

### Extrato do Simples Nacional (PGDAS-D)

É a **referência** de empresa do Simples: a receita declarada à Receita Federal,
comparada contra o que a loja informou em planilha. Não tem CFOP e não se separa em
entradas e saídas — a receita já vem apurada, não há o que somar ou subtrair por
código. Vai no **Passo 1**; largado no Passo 2 por engano, o sistema diz isso.

Havendo livro fiscal *e* extrato para a mesma competência, o livro continua sendo a
base — é dele que sai o detalhe por CFOP — e o valor declarado vira alerta, que é uma
terceira conferência de graça.

Duas escalas convivem no documento, e misturá-las dá erro:

- a **seção 3** traz a receita **por estabelecimento**, com CNPJ completo;
- a **seção 2.2** traz o histórico mensal **consolidado da empresa inteira**.

O histórico só é atribuído a um CNPJ quando o extrato tem um único estabelecimento.
Havendo mais de um, ele não tem como ser repartido: o sistema aproveita só o mês do
PA, um por estabelecimento, e avisa.

A leitura se confere sozinha contra três números impressos no próprio extrato — o
**RBA** (acumulado do ano), o **RBT12** (doze meses anteriores) e a soma das receitas
por atividade de cada estabelecimento. Qualquer uma que não feche vira aviso.

A receita declarada inclui serviço tributado pelo ISS, que não aparece como venda de
mercadoria no livro de ICMS. Quando há essa parcela, a conciliação mostra quanto é,
para uma diferença pequena não virar mistério.

A receita declarada inclui serviço tributado pelo ISS, que não é venda de mercadoria.
Em *Parâmetros*, **Base do extrato do Simples** escolhe entre a receita bruta total
(padrão) e só a revenda de mercadorias. Meses vindos do histórico não têm quebra por
atividade: caem para o total e são marcados.

Duas origens para o mesmo CNPJ e competência do lado informado **não são somadas** —
isso dobraria a venda informada. Vale a de maior peso e a divergência vira alerta.

Livro fiscal em A4 retrato com o conteúdo impresso em paisagem é comum: o texto sai
do PDF girado 90°, e lido na horizontal vira `SOÇIVRES` em vez de `SERVIÇOS`. O
sistema mede o ângulo pela matriz de cada fragmento e gira a página antes de ler.

Carregou o mesmo mês em dois arquivos? O sistema avisa do conflito e deixa você escolher
qual fonte vale, em vez de somar os dois.

## Triangulação de vendas

A conciliação compara **duas** fontes — e as duas podem errar juntas. Se uma venda nunca
virou documento, ela não está no livro nem na planilha, e nenhuma comparação entre os dois
a encontra. A aba **Triangulação** existe para atacar isso: ela põe lado a lado três
registros que nascem em momentos diferentes da mesma venda.

| Fonte | O que é | Por que importa |
|---|---|---|
| **Redução Z** | fechamento diário do equipamento fiscal (ECF/SAT/PAF) | registro fiscal do dia, com contador e acumulador próprios |
| **Relatório de PDV** | fechamento do sistema de caixa | registro de **gestão**, não fiscal: ele não tem por que esconder venda |
| **Declarado** | a ficha de vendas informadas (Auditoria fiscal → Arquivos → Passo 2) | o número que saiu para fora |

A triangulação recebe **só PDF ou foto**: o cupom de redução Z e o relatório do PDV do
jeito que saem da loja. Planilha, CSV e SPED são recusados na hora, com aviso. A leitura é
por rótulo, não por posição — "VENDA BRUTA DIÁRIA", "CRZ", "GRANDE TOTAL" no cupom; data
e valor por linha no relatório do PDV, com as linhas do mesmo dia somadas e as de total
ignoradas. Foto passa por OCR e pede conferência antes de fechar o mês. O parser de SPED
`C405` continua no código e nos testes, mas não é mais uma entrada da tela.

### A direção da diferença é a informação

| Sinal | Leitura |
|---|---|
| **PDV > redução Z** | venda que o caixa registrou e o equipamento fiscal não. É o alerta mais sério da aba |
| **Redução Z > PDV** | relatório de PDV incompleto (um caixa de fora, um dia faltando) ou documento emitido sem venda no caixa |
| **Declarado < o maior valor** | a venda foi registrada (Z, PDV ou NAPP) e não chegou inteira à declaração |

Quatro tipos de lançamento entram: **redução Z**, **PDV**, **NAPP** e **declarado**. A leitura é
em reais, não em percentual:

```
maior valor    = o maior entre os tipos presentes (fica em destaque, com o rótulo "maior")
variação       = maior − menor                     → define o status
não declarado  = maior − declarado
```

Status do mês pela variação: até **R$ 100** coerente, até **R$ 1.000** atenção, acima disso
disperso; no dia, até **R$ 100**. São valores iniciais e ficam editáveis na própria aba
(*Limites da leitura em R$*); valem também para o cruzamento final. O percentual continua
calculado, mas só aparece ao passar o mouse sobre a variação. Uma competência com **um tipo
só** é marcada como tal em vez de aparecer como se fechasse: ausência de divergência não é
prova de acerto.

O **NAPP** chega em planilha diária (Excel ou CSV) — é o único lançamento da triangulação
que entra em planilha. Sem coluna de CNPJ, o número da loja (LUC) é ligado ao lojista pela
carteira; loja que não está na carteira fica avisada no cartão do arquivo e fora da conta.

### Duas conferências que só a redução Z permite

- **Contador de reduções (CRZ)** sobe de um em um, uma vez por dia de movimento. Salto no
  número significa Z que existiu e não está no arquivo — e o sistema diz quais faltam.
- **Grande Total (GT)** é acumulador que nunca zera. `GT(n) − GT(n−1)` tem que ser igual à
  venda bruta daquele dia. Não sendo, a diferença é venda que passou pelo equipamento e não
  apareceu no cupom; GT que **retrocede** indica troca ou reinício de memória fiscal.

### O cruzamento final

Ao fim da aba, as quatro fontes ficam numa linha só — apurado, redução Z, PDV e informado.
A **referência** é o *apurado* (livro fiscal ou extrato do Simples), porque é a peça que o
fisco já tem; não havendo apurado, a redução Z assume, e a linha diz qual das duas está
valendo. Cada desvio é medido contra essa referência.

| Veredito | Quando |
|---|---|
| **TUDO FECHA** | duas fontes ou mais, todas dentro da tolerância |
| **ATENÇÃO** | desvio entre a tolerância e o limite de divergência |
| **INVESTIGAR** | alerta grave da triangulação ou desvio acima do limite |
| **FONTES DE MENOS** | só uma fonte chegou — nada a cruzar |

Os dois CSV (`Exportar triangulação` e `Exportar cruzamento`) saem com uma linha por CNPJ e
competência, para levar o resultado para a planilha de trabalho.

## Privacidade e isolamento

- Nenhum arquivo sai do navegador. Não existe backend, endpoint ou telemetria.
- pdf.js e SheetJS estão embutidos no HTML; a página abre e funciona **offline**.
  O teste de ponta a ponta verifica que a página não faz nenhuma requisição externa.
- O `localStorage` guarda as preferências, as regras de CFOP que você alterar e o
  acompanhamento (carteira, marcos, notificações, fechamentos mensais). Nenhum arquivo
  fiscal é persistido — fechou a aba, livros, Z, PDV e ficha somem.
- O OCR é a única exceção: carregar uma foto baixa a biblioteca de reconhecimento de
  um CDN público. Nenhuma imagem é enviada — a biblioteca é que vem para cá e roda local.
- O projeto não compartilha código, dados nem dependências com o resto do repositório.
  Tudo vive dentro de `apurador-fiscal/`.

## Limites conhecidos

- A conciliação é **livro contra planilha**: uma venda que nunca foi documentada não está
  em nenhuma das duas fontes e não aparece como divergência. A triangulação ataca isso, mas
  só até onde as fontes que você carregar alcançam — venda em dinheiro que não passou nem
  pelo PDV nem pelo equipamento fiscal continua invisível para qualquer cruzamento.
- A conferência de CRZ e Grande Total depende de o cupom trazer esses campos legíveis. Foto
  ruim perde o CRZ e permite a comparação com o PDV, não a de sequência.
- O acompanhamento é por navegador. Dois auditores em dois computadores têm dois painéis; a
  cópia JSON resolve na mão, não sozinha.
- A página não envia e-mail nem WhatsApp: ela abre o seu cliente com o texto pronto e
  registra a data quando você confirma. O envio em si é seu.
- Consignação, venda para entrega futura, industrialização por encomenda e venda à ordem
  usam pares de CFOP cujo tratamento depende de como a operação foi de fato escriturada.
  Confira o detalhe por CFOP nesses casos.
- PDF digitalizado sem camada de texto só funciona via OCR, com a ressalva acima.
- A carteira valida o dígito verificador do CNPJ, mas não cruza com a base da Receita.

## Salvar como app na tela inicial

Abra o link no celular e use *Adicionar à Tela de Início* (Safari) ou *Instalar app*
(Chrome). O ícone é um livro aberto minimalista sobre o verde da Allos.

> **O verde é provisório.** Não consegui verificar os hex oficiais da Allos: o proxy
> deste ambiente bloqueia `allos.co`, `ri.allos.co` e os agregadores de marca. Os
> valores em `icones/paleta.json` são uma escolha coerente com a cor institucional
> verde da marca, não o padrão oficial. Para corrigir, troque lá e rode:

```bash
npm run icones   # redesenha SVG e PNG e reescreve o manifesto
npm run build    # embute tudo no index.html
```

O manifesto é montado em tempo de execução como *blob*, e não embutido em `data:`
URL: um manifesto em `data:` é de outra origem, e aí `start_url` e `scope` relativos
não resolvem. Sendo blob, os dois campos ficam de fora e o navegador assume a própria
página — que é o comportamento certo para um arquivo único. O iOS não lê manifesto:
para ele vale a `apple-touch-icon`, embutida como `data:` URI.

## Estrutura

```
src/cfop.js        tabela CFOP e classificação (678 códigos)
src/parsers.js     SPED, livro impresso, resumo CST/CFOP, PGDAS-D, tabular — funções puras
src/triangulacao.js redução Z, PDV (impressos), triangulação e cruzamento final
src/acompanhamento.js ciclo anual, carteira, painel, notificações, fechamento mensal — funções puras
src/dashboard.js   indicadores e pendências dos três processos para o Dashboard
src/basefic.js     base fictícia de teste (40 lojistas, datas relativas a hoje)
src/societario.js  Juntas por UF, mudança societária, validação e notificações da taxa de transferência
src/apurar.js      apuração das vendas e conciliação com a planilha
src/ingest.js      leitura de PDF, Excel, CSV e OCR (só no navegador)
src/app.js         interface
src/ui.css         estilo (claro e escuro)
scripts/build.mjs  junta tudo em index.html, um arquivo só
scripts/gerar-demo.mjs   cria os arquivos fictícios de demo/
scripts/gravar-video.mjs grava o vídeo de orientação e confere o que ele narra
scripts/video-celular.mjs         a câmera dos vídeos verticais (gravação, narração, pós-produção)
scripts/gravar-video-celular.mjs  roteiro do passo a passo completo, em 9:16 e com narração
scripts/gravar-video-novidades.mjs roteiro do vídeo curto das novidades
scripts/narracao.mjs     síntese de voz (Piper), trilha e mixagem
scripts/baixar-voz.mjs   traz a voz pt-BR para demo/.narracao/voz (fora do git)
scripts/gerar-icones.mjs desenha os ícones do app e escreve o manifesto
scripts/chromium.mjs     acha o Chromium do Playwright (usado pelos três acima e pelo e2e)
test/unidade.test.mjs      55 testes das regras, dos parsers e da conciliação
test/triangulacao.test.mjs 23 testes da triangulação, do PDV impresso e do cruzamento final
test/acompanhamento.test.mjs 18 testes do ciclo, da carteira, das notificações e do fechamento
test/societario.test.mjs 8 testes da mudança societária e da taxa de transferência
test/e2e.mjs       abre a página num Chromium e carrega arquivos de verdade
vendor/            pdf.js 3.11.174 e SheetJS 0.18.5 (Apache-2.0)
exemplos/          modelo de planilha de vendas informadas
demo/              arquivos fictícios (livros, ficha, cupons Z e PDV em PDF, lojistas) e os vídeos
icones/            paleta.json (as cores), SVG e PNG do ícone do app
```

Toda mudança em `src/` ou `vendor/` exige `npm run build` para refletir no `index.html`.
