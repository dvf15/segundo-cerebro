# App para uma 2ª pessoa (ex.: esposa) — cópia isolada na sua conta Vercel

Esta é a forma de dar o app para outra pessoa **sem conta nova** e **sem
afetar o seu app**: um 2º projeto na sua conta Vercel, apontando para o
**mesmo código**, mas com **banco de dados próprio** e o perfil começando em
branco. Os dois apps não se enxergam.

## Como funciona

- Mesmo repositório/código nos dois projetos.
- Bancos de dados (Neon) **separados** → dados 100% isolados.
- A variável `PROFILE_PRESET=blank` faz o 2º app começar **sem** seus dados
  (sem seu nome, peso, exames ou suplementos) e com metas de treino genéricas,
  para a pessoa preencher tudo no próprio app (incluindo **Metas por treino**).
- O seu app **não muda** (ele não define `PROFILE_PRESET`).

## Passo a passo

1. **Crie um novo banco Neon** (separado do atual)
   - No painel da Vercel → Storage → Create Database → Neon (ou direto no
     neon.tech). Copie as duas connection strings (pooled e unpooled/direct).

2. **Crie um novo projeto na Vercel a partir do mesmo repositório**
   - Vercel → Add New → Project → importe `dvf15/radarbazin1` (o mesmo repo).
   - Branch de produção: `main`.

3. **Configure as variáveis de ambiente do novo projeto**
   - `DATABASE_URL` = connection string **pooled** do banco novo
   - `DATABASE_URL_UNPOOLED` = connection string **direct/unpooled** do banco novo
   - `ANTHROPIC_API_KEY` = pode ser a mesma do seu app (o consumo cai na sua
     conta da Anthropic) ou uma chave separada
   - `PROFILE_PRESET` = `renata` (perfil/treinos pré-configurados da Renata) —
     ou `blank` para um perfil totalmente em branco/genérico
   - `NEXT_PUBLIC_APP_NAME` = `Renata` (nome exibido no app e no ícone/PWA)
   - `NEXT_PUBLIC_APP_ICON` = `/icon-pink.svg` (ícone rosa, p/ diferenciar do seu)

### O que o preset `renata` já traz

- Nome do perfil **Renata** (editável no app).
- **Metas estimadas (faixa feminina)** por treino — ela ajusta em
  **⚙ Perfil → Metas por treino**.
- Tipos de treino dela: **Descanso, Musculação, Pilates, Treino leve**.
- **Agenda semanal automática**: ao abrir um dia novo, já vem
  **terça/quinta = Musculação** e **quarta/sexta = Pilates** (ela pode trocar).
- Sem os suplementos/dados do dono.

4. **Deploy**
   - O build roda as migrações automaticamente (`prisma migrate deploy`) e cria
     as tabelas no banco novo. Nada é compartilhado com o seu banco.

5. **No celular dela**
   - Abrir a URL do novo projeto, **adicionar à tela de início** (PWA) — o
     ícone/nome aparece como definido em `NEXT_PUBLIC_APP_NAME`.
   - Em **⚙ Perfil**: conferir/ajustar peso, objetivo e abrir **"Metas por
     treino (macros)"** para afinar calorias/macros (já vêm estimadas).
   - Pronto: registrar refeições, ver scores e usar as sugestões normalmente.

## Observações

- Para voltar atrás é só apagar o 2º projeto e o 2º banco — o seu app
  permanece intacto.
- Os tipos de treino (Descanso, Musculação, HIIT, etc.) são os mesmos do app;
  ela ajusta as **metas** de cada um. Renomear os tipos por pessoa seria uma
  evolução futura.
