# SIOS - Shopping Intelligent Operating System
## Arquitetura Técnica Completa v1.0

---

## 1. STACK RECOMENDADO (Menor Custo + Máxima Automação)

### Backend: Python + FastAPI (gratuito + escalável)
- **Por quê**: Ideal para multi-agentes, processamento de dados, integração de APIs
- **Alternativa barata**: Node.js com Nest.js

### Banco de Dados: PostgreSQL (open-source)
- **Produção**: Managed PostgreSQL (Supabase grátis até 50GB)
- **Alternative**: Railway ou Render (R$50-200/mês)

### Storage de Arquivos: AWS S3 (pague só o que usa)
- **Estimativa**: ~R$50-100/mês para 1-10 shoppings

### IA/LLM: Claude API + OpenAI (usar o mais barato por tarefa)
- Claude para análise complexa
- OpenAI GPT-4o mini para tarefas simples (~10x mais barato)

### Orquestração de Agentes: n8n (open-source + cloud free tier)
- Automação de workflows entre agentes
- Alternativa: Temporal (mais complexo, mais poderoso)

---

## 2. APIS RECOMENDADAS POR AGENTE

### HUNTER (Prospecção)
```
ESSENCIAL:
- Google Places API: R$ 0,007 por request (máx ~R$300/mês para 1 shopping)
- Google Maps Geocoding: R$ 0,005 por request
- Instagram Graph API: GRÁTIS (com Business Account)

OPTIONAL (high-value):
- SerpApi (busca web): R$ 0,01/request (máx R$100/mês)
- Bright Data (web scraping): R$ 300/mês (se precisar escala)

STARTUP HACK:
- ABF (franchising BR): contrato direto, planilha compartilhada
- CNPJ/Receita Federal: API CNPJ.ws = GRÁTIS
- Dados de fluxo: integração Sistema Bahia (já tem)

CUSTO TOTAL HUNTER: R$ 0 - R$ 200/mês
```

### FARMER (Investidores)
```
ESSENCIAL:
- SERASA Experian: R$ 300-500/mês (contrato B2B mínimo)
- Banco Central (validação CPF): API GRÁTIS
- Plataforma suitability: build custom (cálculos simples)

OPTIONAL:
- LinkedIn Sales Navigator: R$ 500/mês (buscar investidores)
- CRM gratuito: Pipedrive free tier (para começar)

CUSTO TOTAL FARMER: R$ 300-500/mês
```

### KA / EXPANSÃO (Marcas)
```
ESSENCIAL:
- ABF Database: contrato + scraping automático
- Google Trends API: GRÁTIS (volume de busca)
- Similarweb: API paga (R$ 500+) OU fazer scraping grátis

OPTIONAL:
- Market Intelligence (Euromonitor): caro, pule no início

CUSTO TOTAL KA: R$ 0-200/mês
```

### ALAVANCADOR (Financeiro)
```
INTEGRAÇÃO BANCÁRIA:
- Open Banking BR (SPB): API GRÁTIS do Banco Central
- Para crédito: integrar com fintechs (C6, Nubank, Banco Inter)

SEGUROS:
- Sulamerica, Unimed, XP: contatos diretos + integração manual

CUSTO: R$ 0 (integração direta com instituições)
```

### BUILDER + SELLER
```
Basicamente automação interna:
- ERP light: sugerido Odoo Community (GRÁTIS)
- CRM: Pipedrive (free tier) ou Supabase + custom
- Marketing: integração Meta (GRÁTIS com facebook pixel)

CUSTO: R$ 0-100/mês
```

---

## 3. ESTIMATIVA DE CUSTO TOTAL (1 shopping)

| Componente | Custo/mês | Notas |
|---|---|---|
| Hosting (FastAPI + DB) | R$ 50-100 | Supabase ou Railway |
| APIs (Google, SERASA) | R$ 200-500 | Escalável com volume |
| LLM (Claude + OpenAI) | R$ 100-300 | Depende de uso |
| Storage S3 | R$ 50-100 | Para fotos/documentos |
| Ferramentas (n8n, etc) | R$ 0-200 | Se usar cloud, free tier local |
| **TOTAL** | **R$ 400-1.200/mês** | **Escalável linearmente** |

**Escala 10 shoppings**: não é 10x, é ~6-8x (economia de escala em infra compartilhada)

---

## 4. MÓDULOS DE CÓDIGO - ORDEM DE IMPLEMENTAÇÃO

### SPRINT 0 (Semana 1): Fundações
1. ✅ Setup banco PostgreSQL (Supabase)
2. ✅ Esquema de dados base
3. ✅ FastAPI skeleton
4. ✅ Autenticação/segurança

### SPRINT 1 (Semana 2-3): HUNTER v1
1. Google Places integrado
2. Scraping de Instagram (público)
3. Scoring inicial de brands

### SPRINT 2 (Semana 4-5): FARMER v1
1. Triagem de investidores (forms simples)
2. Scoring suitability
3. Match automático básico

### SPRINT 3 (Semana 6-7): KA v1
1. Base de marcas em expansão
2. Matching com investidores
3. Painel de oportunidades

### SPRINT 4 (Semana 8): Automação Cross-Agent
1. Orquestração n8n
2. Webhooks entre agentes
3. Relatórios automáticos

---

## 5. SEGURANÇA - CAMADAS OBRIGATÓRIAS

### Nível 1: Infraestrutura
```
- VPC isolada (na Supabase/Railway já vem)
- HTTPS obrigatório (Let's Encrypt grátis)
- Backup automático diário (PostgreSQL nativo)
- Rate limiting: 100 req/min por IP (FastAPI middleware)
```

### Nível 2: Dados
```
- Encriptação em repouso: pgcrypto do PostgreSQL
- Encriptação em trânsito: TLS 1.3
- PII masking automático em logs
- Hashing de CPF/CNPJ (nunca armazenar em texto)
```

### Nível 3: Acesso
```
- JWT com refresh token (segurança padrão)
- RBAC: Admin / Executor / Leitor
- Auditoria de todas as ações (tabela audit_log)
- 2FA para admins (TOTP)
```

### Nível 4: IA/APIs
```
- API keys em ambiente (nunca no código)
- Rotação de chaves a cada 90 dias
- Limites de spending por API (monitore custos)
- Sanitização de input antes de passar para LLM
```

---

## 6. ESTRUTURA DE PASTAS RECOMENDADA

```
sios/
├── backend/
│   ├── core/
│   │   ├── config.py          # Variáveis de env
│   │   ├── security.py        # JWT, hashing, encryption
│   │   └── database.py        # Conexão PostgreSQL
│   ├── agents/
│   │   ├── hunter/
│   │   │   ├── scraper.py     # Google Places, Instagram
│   │   │   ├── scorer.py      # SRIS scoring
│   │   │   └── router.py      # Endpoints FastAPI
│   │   ├── farmer/
│   │   ├── ka_expansion/
│   │   ├── alavancador/
│   │   ├── builder/
│   │   ├── seller/
│   │   └── orchestrator.py   # Coordena todos os agentes
│   ├── models/
│   │   ├── schemas.py         # Pydantic models
│   │   └── database.py        # SQLAlchemy ORM
│   ├── tests/
│   └── main.py               # FastAPI app
├── database/
│   ├── migrations/            # Alembic (versionamento DB)
│   └── seeds/                 # Dados iniciais
├── excel_templates/
│   ├── 01_Shopping_Master.xlsx
│   ├── 02_Pontos_Vagos.xlsx
│   ├── 03_Investidores_CRM.xlsx
│   ├── 04_Marcas_KA.xlsx
│   ├── 05_Mix_Plan.xlsx
│   ├── 06_Fornecedores.xlsx
│   └── 07_Produtos_Financeiros.xlsx
├── n8n/
│   └── workflows/             # JSONs dos workflows
├── docs/
│   ├── API.md
│   ├── DATA_DICTIONARY.md
│   └── SECURITY.md
└── requirements.txt
```

---

## 7. FLUXO DE INTEGRAÇÃO EXCEL → SISTEMA

```
[Excel] → [Python Script] → [Validação] → [PostgreSQL] → [Agentes] → [Dashboard]

Processo específico:
1. User faz upload de Excel (ou planilha Google)
2. Script Python lê + valida (usando Pandas + Pydantic)
3. Se erro → feedback automático para usuário
4. Se OK → insere em PostgreSQL
5. Triggers automáticos (PostgreSQL) ativam agentes relevantes
6. Resultados aparecem em dashboard web em tempo real
```

---

## 8. DASHBOARD RECOMENDADO (GRATUITO/BARATO)

| Tool | Custo | Caso de Uso |
|---|---|---|
| Metabase Community | GRÁTIS | Dashboards + SQL simples |
| Superset (Apache) | GRÁTIS | BI complexo |
| Streamlit | GRÁTIS | Painéis rápidos para agentes |
| Grafana + PostgreSQL | GRÁTIS | Monitoramento |
| Google Data Studio | GRÁTIS | Relatórios operacionais |

**Recomendação**: Streamlit (mais fácil integrar com Python) + Metabase (BI profissional)

---

## PRÓXIMOS PASSOS

1. Executar **SPRINT 0** (infra + BD)
2. Ler arquivo **02_SIOS_Database_Schema.sql**
3. Ler arquivo **03_SIOS_Python_Scaffold.py**
4. Ler arquivo **04_SIOS_Excel_Templates.md**
