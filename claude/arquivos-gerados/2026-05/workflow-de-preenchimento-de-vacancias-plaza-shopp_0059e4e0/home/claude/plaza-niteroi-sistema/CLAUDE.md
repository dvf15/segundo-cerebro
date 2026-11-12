# Briefing para Claude Code

Este arquivo é lido automaticamente pelo Claude Code para ter contexto do projeto.

## O que é este projeto

Sistema de pipeline comercial Workflow 1 (Vacancy-to-Contract) para o Plaza Shopping Niterói, operado pela Allos. Baseado na metodologia **Shopping Inteligente OS v5**.

Composto por:
- **App web standalone** (`app/index.html`) — HTML+CSS+JS vanilla, persistência via `window.storage` (artefato Claude) ou `localStorage` em deploy próprio
- **Planilha Excel colaborativa** (`planilha/Plaza_Niteroi_Sistema.xlsx`) — 7 abas com dropdowns, validações, formatação condicional e 64 fórmulas

## Cluster e batalhas

- **Cluster:** Entretenimento (Cinemark é âncora preservada)
- **Batalhas:** 1) Entretenimento adulto, 2) Gastronomia autoral, 3) Lojas conceito

## Regra de ouro

**SEMPRE validar duplicidade ANTES de sugerir nova marca.** A lista de marcas atuais do Plaza está em `data/mix-atual-plaza.json` e na aba `Mix Atual Plaza` da planilha.

Marcas que descobri estarem no Plaza ao longo das rodadas anteriores (preciso reforçar):
- Bacio di Latte, Oakberry, Yogoberry, Bibi Sucos, Habib's, Light Café, Beluga
- Decathlon, Hocus Pocus (quiosque)
- Coco Bambu, Outback, Madero, Abbraccio, Benihana, L'Entrecôte, NOI, Cabana Burger
- Renner, Riachuelo, C&A, Marisa, Calvin Klein, Lacoste, GAP, Levi's, Reserva
- Nike, Centauro, Trackfield, World Tennis, Authentic Feet, Atlhetic Way
- LEGO, Ri Happy, Bay Games, Resident Games

## Confiança da análise atual

**8/10.** Ressalvas em `docs/03-FONTES.md`.

Não chega a 10 porque:
- Lista brasil-shoppings (288 marcas) pode ter desatualizações
- Status real das 39 saídas Ano 1 precisa validação do EV
- Sem acesso ao Sistema Bahia (preço/m², FPP, CDU)
- Sem CRM Farmer estruturado

## Como ajudar a evoluir

### Possíveis tarefas
1. **Validar duplicidade contra sistema interno Allos** — atualizar `data/mix-atual-plaza.json` quando o EV trouxer a lista oficial
2. **Adicionar oportunidades** — seguir schema de `data/pipeline-seed.json`
3. **Melhorar app web** — adicionar funcionalidades do roadmap em `docs/04-ROADMAP.md`
4. **Replicar para outros shoppings Allos** — adaptar cluster, batalhas e mix
5. **Migrar para Pipedrive/HubSpot** quando time crescer

### Antes de qualquer mudança no pipeline
1. Ler `docs/02-METODOLOGIA.md` (framework v5)
2. Cruzar marcas-alvo com `data/mix-atual-plaza.json` para evitar duplicidade
3. Atualizar versão em `docs/04-ROADMAP.md`

## Stack técnico

- **App web:** HTML5 + CSS3 + JavaScript vanilla. Sem build, sem dependências externas. Roda direto no navegador.
- **Planilha:** Excel (.xlsx) com openpyxl-style. Para regenerar do zero, há um script Python que pode ser reconstruído a partir dos dados em `data/`.
- **Sem backend.** Por enquanto.

## Convenções de código

- Português para conteúdo de negócio (saídas, marcas, teses)
- Inglês para tipos técnicos (estágios do pipeline, papéis)
- Datas em ISO (YYYY-MM-DD)
- IDs de oportunidade: `OPP-XX` ou `OPP-XX-YY`
- Sem libs externas no app web (vanilla JS)

## Pessoas envolvidas

- **EV (Executivo Comercial)** — dono diário do sistema
- **Diretoria Allos** — consumidor de relatórios
- **KA / Hunter / Street Converter / Farmer** — donos de oportunidades específicas

## Próxima ação prioritária

Ver `docs/04-ROADMAP.md` seção "Curto prazo (30 dias)":
1. Validar duplicidade vs sistema interno Allos
2. Confirmar status real das 39 saídas Ano 1
3. Master plan do Foyer Cinemark
4. Pitch H&M Plaza (via Grupo Dorben)
5. Reuniões prioritárias Street Converter (Bullguer, Ferro e Farinha, Cantón)

---

## Política de honestidade

Conforme preferências do usuário (Rules 1-3):
- Se não estiver confiante, dizer "I'm not sure" e explicar
- Avaliar confiança 1-10 após cada resposta
- Citar fontes verificáveis para todo número/estatística/citação

## Política de API paga

Nunca acionar SerpApi, DataForSEO, Similarweb, Semrush, Apollo, Hunter.io, Clearbit, LinkedIn Sales Navigator ou similares sem confirmação explícita do usuário.
