---
title: Acesso e proteção do domínio
aliases:
  - Acesso e proteção
  - APP_SENHA
tags:
  - infraestrutura
  - seguranca
  - vercel
created: 2026-09-03
updated: 2026-09-03
status: ativo
---

# Acesso e proteção do domínio

O projeto na Vercel serve **duas coisas muito diferentes no mesmo domínio**:

| O quê | Onde | Quem precisa abrir |
|---|---|---|
| Ferramentas comerciais | `public/*.html` (estático) | O time — circula por link |
| NutriTreino | app Next.js + Postgres + chave da Anthropic | Só o dono |

Enquanto o **Vercel Authentication** cobria o domínio inteiro, essa mistura não
tinha consequência: nada abria sem login na conta Vercel. Ao abrir o domínio
para compartilhar as ferramentas com o time, as **17 rotas de `/api` ficaram
públicas** — nenhuma verifica sessão, token ou senha; leem e gravam direto no
banco, e `meals/estimate` e `recommend` chamam a Anthropic com a chave do
projeto.

> [!warning] Confirmado em produção
> Em 02/09/2026, `GET /api/profile` em janela anônima devolvia o perfil de saúde
> completo — peso, composição corporal, exames e notas clínicas.

## Como está protegido agora

`middleware.ts` na raiz do repositório é a porta de entrada do domínio.

**Público, sem senha:**

- `operacoes.html`, `quiosques.html`, `midia.html`, `obras.html`,
  `apresentacao.html`, `simulador-estrutura.html`, `simulador-remuneracao.html`,
  `clausulas.html`
- manifests (`*.webmanifest`), ícones (`*-icon-*.png|svg`), service workers
  (`sw-*.js`) e as planilhas em `exemplos/`

**Exige senha — tudo o mais**, incluindo `/`, as páginas do NutriTreino e todas
as rotas de `/api`.

A senha vive na variável de ambiente **`APP_SENHA`** do projeto na Vercel. Nunca
no repositório.

> [!important] Falha fechada
> Sem `APP_SENHA` configurada, nada além das ferramentas responde — nem com
> cookie válido. É proposital: uma variável apagada por engano fecha o app, não
> o abre.

## Como entrar no NutriTreino

1. Configure `APP_SENHA` em **Vercel → Settings → Environment Variables**
   (Production), com uma senha longa e única.
2. Faça um redeploy para a variável valer.
3. Abra o domínio. Qualquer página protegida leva à tela de senha em
   `/acesso`; depois de entrar, o app volta para onde você tentou ir.

O middleware grava um cookie `acesso_nutri` — `httpOnly`, `secure`,
`sameSite=lax`, 90 dias. Depois disso o app funciona normalmente naquele
aparelho, inclusive pelo atalho da tela de início.

Para revogar o acesso de todos os aparelhos, troque a `APP_SENHA` e faça um
redeploy: os cookies antigos deixam de bater.

> [!note] Por que a senha não vai mais na URL
> A primeira versão aceitava `?senha=...` no endereço. Parecia prático e era
> traiçoeiro: numa query string o `+` chega como espaço e o `#` corta tudo o
> que vem depois, então uma senha legítima com esses caracteres era recusada
> sem qualquer explicação — foi o que aconteceu na estreia. Somem-se a isso a
> maiúscula automática do teclado do iPhone e a senha registrada no histórico
> do navegador. Um campo de formulário não tem nenhum desses problemas, e a
> tela de senha passou a ser a única entrada.

Duas tolerâncias deliberadas: espaço e quebra de linha nas pontas somem tanto
do valor digitado quanto do que está em `APP_SENHA` — colar o valor no painel
com um espaço sobrando é acidente comum e não deve trancar o dono para fora.
No meio da senha, nada é alterado.

## Detalhes de implementação

- A comparação da senha é feita em **tempo constante**, para não vazar o tamanho
  pela latência da resposta.
- Os bundles em `_next/static` ficam **fora** do matcher: não carregam segredo
  (variáveis de servidor não vão para o cliente) e bloqueá-los quebraria o app
  depois do login.
- A proteção da Vercel segue ligada em `prod_deployment_urls_and_all_previews`,
  o modo mais restritivo disponível no plano Hobby. Ela cobre as URLs de deploy
  e as prévias de branch, mas **não** o domínio de produção — daí a necessidade
  do middleware.

## O caminho definitivo

A separação real é tirar as ferramentas deste domínio: um site estático próprio,
sem repositório com segredos, sem variáveis de ambiente, sem banco e sem API.
Aí o time recebe um link que não tem nada por trás, e este projeto pode voltar a
ficar fechado por completo.

Enquanto isso não acontece, o middleware é a divisória.

## Colocar no ar

Duas armadilhas aparecerem na primeira tentativa, as duas registradas aqui para
não se repetirem.

**A variável precisa existir antes do build.** A Vercel injeta as variáveis de
ambiente no pacote do middleware no momento em que ele é construído — não as lê
a cada requisição. Criar `APP_SENHA` e promover um deploy antigo não adianta:
aquele pacote foi montado sem ela e vai continuar recusando tudo. Depois de
criar ou trocar a variável, é preciso um **build novo**.

**Projeto pausado não publica.** A pausa não interrompe só o tráfego: todo
deploy disparado com o projeto pausado termina em `BLOCKED`, sem build. E um
deploy que conclui enquanto a pausa cai no meio do caminho fica com os aliases
internos e não assume o domínio — foi o que aconteceu em 03/09/2026 com
`66b9f8a`, que ficou READY com o middleware enquanto
`radarbazin1-s68m.vercel.app` seguiu no deploy de `47b5ff9`, sem proteção.

A consequência prática é incômoda mas inevitável: para publicar a proteção é
preciso despausar, e entre o despause e o novo deploy ficar no ar existe uma
janela de um a dois minutos em que o deploy antigo, sem middleware, ainda
atende. Vale deixar o commit e o pull request prontos antes de despausar, para
que a janela seja só o tempo do build.

Ordem que funciona:

1. `APP_SENHA` configurada em **Production**.
2. Projeto **despausado**.
3. Um deploy de produção novo — merge no `main` ou *Redeploy* pelo painel.
4. Conferir: `/api/profile` sem cookie tem que responder 401, e
   `operacoes.html` tem que responder 200.

Enquanto o passo 4 não fecha, o domínio não está protegido.

## Verificação

Servidor Next local, com `APP_SENHA` valendo `se+nha Teste#1` — de propósito
com `+`, espaço e `#`, os três caracteres que quebravam a entrada pela URL — e
gravada com espaços sobrando no fim:

| Caso | Esperado | Resultado |
|---|---|---|
| `/api/history`, `/api/meals/save` sem cookie | 401 texto | ✅ |
| `/`, `/history` sem cookie, no navegador | 303 para `/acesso` | ✅ |
| ferramentas, ícones, manifests, `exemplos/*.csv` | 200 | ✅ |
| `/acesso` sem cookie | 200 com o formulário | ✅ |
| `/acesso` com cookie válido | 303 para o destino | ✅ |
| senha errada no formulário | 401 com o erro na tela | ✅ |
| senha certa, com `+`, espaço e `#` | 303 + cookie | ✅ |
| senha certa digitada com espaços nas pontas | 303 + cookie | ✅ |
| `APP_SENHA` gravada com espaços no fim | continua batendo | ✅ |
| `de=//evil.com` | volta para `/`, não redireciona para fora | ✅ |
| sem `APP_SENHA`, mesmo com cookie válido | 401 | ✅ |

O fluxo completo também foi percorrido num navegador de verdade: abrir `/`,
cair na tela de senha, digitar e chegar ao diário.

## Relacionadas

- [[RADAR-VAREJO|Radar de Varejo]]
- [[RADAR-QUIOSQUES|Radar Quiosques]]
