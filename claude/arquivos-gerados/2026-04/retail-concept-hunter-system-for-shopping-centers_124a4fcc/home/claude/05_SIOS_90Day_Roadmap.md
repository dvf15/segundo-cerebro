# SIOS - Guia de Implementação Executivo
## Como colocar o sistema em produção em 90 dias

---

## PARTE 1: AVALIAÇÃO DE REALIDADE

### O que você realmente tem HOJE?

**Perguntas críticas:**

1. Quantos shoppings? (1-3 / 4-10 / 10+)
   - Recomendação: Começar com 1 piloto
   
2. Equipe atual?
   - Executivos de vendas: Quantos?
   - Gerente de leasing: Qual nível?
   - Tech disponível? (Alguém que entenda API?)
   
3. Dados atuais?
   - Sistema Bahia implementado? (Preços/condições)
   - Fotos dos espaços? (Quantas % têm)
   - Histórico de tenants? (Quanto retroceder?)
   
4. Budget?
   - Quanto está disponível para tech/ferramentas?
   - Pode pagar SERASA (R$ 300-500/mês)? Ou precisa usar alternativa gratuita?
   
5. Tecnologia atual?
   - Tem CRM? (Pipedrive, HubSpot, Salesforce, Planilha?)
   - Tem BI? (Power BI, Metabase, Looker, Nada?)

---

## PARTE 2: ROADMAP 90 DIAS

### FASE 0: SEMANAS 1-2 (Preparação)

**Objetivo**: Infra + primeira base de dados

**Tarefas**:
```
[ ] Criar conta Supabase (free tier) → PostgreSQL hospedado
[ ] Executar script 02_SIOS_Database_Schema.sql
[ ] Criar 1 shopping piloto no banco
[ ] Nomear person/team de cada função:
    - HUNTER: Exec Sales 1
    - FARMER: Exec Sales 2
    - KA: Exec Sales 3
    - BUILDER: Gerente de Leasing
    - Suporte: Tech person
[ ] Criar pasta compartilhada para Excel templates
[ ] Fazer backup DIÁRIO (ritual)
```

**Deliverables**:
- ✓ Banco PostgreSQL rodando
- ✓ 1 shopping master preenchido
- ✓ Primeiras 10-15 linhas de Espaços Vagos
- ✓ Nomes de responsáveis

**Tempo esperado**: 2 × 4h = ~1 dia de trabalho concentrado

---

### FASE 1: SEMANAS 3-4 (Dados Base)

**Objetivo**: Planilhas Excel populadas com dados reais

**Hunter Focus**:
```
[ ] Fazer prospecção MANUAL de rua em raio 2-5km
    - Documentar endereços, categorias, nomes
    - Coletar contatos de 20-30 prospects
    - Fotos com celular dos espaços
[ ] Pesquisar no Google Maps cada prospect
    - Copiar rating, reviews, categorias
    - Screenshot do mapa com localização
[ ] Montar em Planilha 04 (Marcas e Franquias)
    - Começar com 15-20 marcas reais que têm interesse
```

**Farmer Focus**:
```
[ ] Validar investidores já mapeados/conhecidos
    - Ligar, conversar, entender perfil
    - Preencher Planilha 03
    - Começar com 10-15 (melhor qualidade > quantidade)
[ ] Se tiver SERASA, integrar scores
    - Senão, usar scoring manual (experiência + capital)
```

**Leasing Focus**:
```
[ ] Inventário completo de espaços vagos
    - ID, localização, metragem, infraestrutura
    - Fotos (mín. 5 por espaço, upload para S3 ou Google Drive)
    - Planta baixa (PDF ou foto)
    - Preço e condições comerciais (integrar Sistema Bahia)
[ ] Listar todos os tenants operacionais
    - Nome, categoria, performance estimada
    - Contato de gerente
    - Data de início
```

**Tempo esperado**: 8-16h concentradas (2-3 dias)

**Deliverables**:
- ✓ Planilha 02: 30-50 espaços (20 vagos, 30 ocupados)
- ✓ Planilha 03: 15-20 investidores com scores
- ✓ Planilha 04: 15-20 marcas em expansão
- ✓ Fotos no S3 ou Google Drive

---

### FASE 2: SEMANAS 5-6 (Primeiro Código)

**Objetivo**: APIs de Hunter e Farmer rodando

**Dev Tasks**:
```
[ ] Setup FastAPI backend (copiar 03_SIOS_Python_Backend.py)
[ ] Configurar Google Places API
    - Ativar API no Google Cloud Console
    - Gerar API key
    - Testar 1 busca
[ ] Implementar Hunter.search_nearby_businesses()
    - Teste: buscar "moda" em raio 3km do shopping
    - Verificar se traz resultados
[ ] Implementar Farmer.calculate_suitability_score()
    - Teste: scoring de 5 investidores conhecidos
[ ] Conectar BD: fazer INSERT/SELECT básicos
[ ] Criar 2-3 endpoints GET no FastAPI
```

**Testing**:
```
[ ] Testar Hunter com shopping piloto
    - Resultado esperado: 10-20 prospects com score
[ ] Testar Farmer com investidores base
    - Resultado esperado: scores 0-100, qualificados >60
[ ] Testar conexão DB
    - INSERT e SELECT funcionam
```

**Custo desta fase**: ~R$ 30-50 (APIs Google)

**Deliverables**:
- ✓ FastAPI rodando em localhost:8000
- ✓ `/api/v1/hunter/search` retornando prospects
- ✓ `/api/v1/farmer/qualify` retornando scores
- ✓ 3 primeiros endpoints testados

**Tempo**: 16-24h (3 dias para dev, 1 dia para QA)

---

### FASE 3: SEMANAS 7-8 (Excel ↔ Backend)

**Objetivo**: Fluxo Excel → Banco → Agentes

**Tasks**:
```
[ ] Criar script Python sios_monthly_sync.py
    - Ler todas as 7 planilhas
    - Validar dados (tipos, ranges, obrigatoriedade)
    - Inserir em PostgreSQL
    - Gerar relatório de erros
[ ] Testar com dados reais
    - Rodar sync 1x com planilhas preenchidas
    - Validar inserts no BD
    - Corrigir erros
[ ] Criar dashboard BÁSICO (Streamlit ou Metabase)
    - View: Espaços vagos por piso
    - View: Investidores qualificados
    - View: Prospects de Hunter
    - View: Occupancy % vs. meta
[ ] Automatizar com n8n (workflow)
    - Trigger: weekly (toda segunda-feira 8am)
    - Action: rodar sios_monthly_sync.py
    - Notificação: enviar relatório por email
```

**Testing**:
```
[ ] Preencher Planilhas 1-5 com dados reais
[ ] Rodar sync.py → validar no BD
[ ] Comparar dashboard com planilha → valores batem?
[ ] Testar email com relatório
```

**Custo**: ~R$ 0 (n8n free tier)

**Deliverables**:
- ✓ Script sync.py funcional
- ✓ Dashboard básico com 4-5 views
- ✓ Automação rodando 1x/semana

**Tempo**: 12-16h

---

### FASE 4: SEMANAS 9-10 (Agentes em Produção)

**Objetivo**: Agentes gerando value real

**Hunter**:
```
[ ] Rodar busca mensal de prospects
    - Raio configurável (2-50km)
    - Entregar top 20 prospects/mês
    - Score de fit integrado
[ ] Setup relatório automático
    - Listar: Brand, categoria, location, fit_score, reasoning
    - Exportar: PDF ou Google Sheets
    - Enviar para EV toda segunda-feira
```

**Farmer**:
```
[ ] Gatilho: novo investidor → scoring automático
    - Score suitability gerado instantaneamente
    - Se ≥60, notificar responsável
[ ] Relatório: "Investidores Qualificados"
    - Listar top 10 por score
    - Mostrar capital total disponível
    - Mostrar preferências/restrições
```

**KA**:
```
[ ] Match automático: Marca × Investidor × Espaço
    - Critérios: m², infraestrutura, capital, categoria
    - Output: "TOP 3 MATCHES para Zara"
    - Cada match com reasoning
[ ] Relatório: Oportunidades abertas
    - Marcas em expansão
    - Espaços compatíveis
    - Investidores dispostos
    - Score de probabilidade de fechamento
```

**Deliverables**:
- ✓ Hunter: 20+ prospects/mês com scoring
- ✓ Farmer: 10+ investidores qualificados
- ✓ Agentes: gerando 2-3 matches propostos/mês

**Tempo**: 8-12h

---

### FASE 5: SEMANAS 11-12 (Otimização + Documentação)

**Objetivo**: Sistema rodando em produção limpo

**Tarefas**:
```
[ ] Documentar API
    - Copiar 01_SIOS_Architecture.md para Postman
    - Testar todos os 10+ endpoints
    - Documentar rate limits e autenticação
[ ] Segurança
    - Adicionar JWT em todos endpoints
    - Ativar 2FA para admin
    - Configurar backup automático PostgreSQL
    - Audit log: todas as ações registradas
[ ] Training da equipe
    - Sessão 1: "Como usar Excel sem errar" (1h)
    - Sessão 2: "Lendo o Dashboard" (45min)
    - Sessão 3: "Interpretando Scores e Matches" (1h)
    - Material: Vídeos + PDFs
[ ] Monitoramento
    - Setup de logs centralizados
    - Alertas: se sync falhar, notificar tech
    - Métricas: tempo de sync, erros, volumes
[ ] Performance tuning
    - Adicionar indexes no BD (se lento)
    - Cache de resultados Hunter
    - Listar endpoints que mais custam em API
    - Otimizar chamadas
[ ] Documentação FINAL
    - Escrito: Playbook de cada agente (20 páginas)
    - Vídeo: Setup inicial (15 min)
    - Video: Fluxo de um match (10 min)
```

**Deliverables**:
- ✓ Sistema robusto pronto para produção
- ✓ Documentação completa
- ✓ Equipe treinada

**Tempo**: 16-20h

---

## PARTE 3: TIMELINE VISUAL

```
Semana 1-2: ███░░░░░░░ Preparação infra
Semana 3-4: ██████░░░░ Dados base
Semana 5-6: ████████░░ Código (Hunter + Farmer)
Semana 7-8: █████████░ Integração Excel
Semana 9-10: ██████████ Agentes live
Semana 11-12: ██████████ Otimização

Total de trabalho estimado:
- Dev/Tech: 50-60h
- Leasing/Sales: 30-40h
- Management/Training: 10-15h
- TOTAL: ~90-115h (referência)
```

---

## PARTE 4: INVESTIMENTO MÍNIMO

### Opção 1: LEAN (R$ 0 - R$ 200/mês)

```
Infraestrutura:
- Supabase (PostgreSQL free tier): GRÁTIS
- Railway ou Render (FastAPI hosting): R$ 50-100/mês
- Google Drive (armazenar Excel): GRÁTIS

APIs:
- Google Places (estimado 200 req/mês = ~R$ 1.40): ~R$ 20-30
- Google Maps Geocoding: ~R$ 15/mês
- SERASA: SKIP (usar scoring manual) = GRÁTIS

Ferramentas:
- Excel/Google Sheets: GRÁTIS
- Streamlit (dashboard): GRÁTIS
- n8n (automação): FREE tier

TOTAL MENSAL: R$ 85-145
SETUP INICIAL: ~R$ 0
```

### Opção 2: CONFORTÁVEL (R$ 300-600/mês)

```
Acrescenta:
- SERASA API (score crédito): +R$ 300-500
- Metabase Cloud (BI profissional): +R$ 50
- Sentry (error tracking): +R$ 0 (free tier)

TOTAL MENSAL: R$ 400-700
```

### Opção 3: ENTERPRISE (R$ 1.000-2.000/mês)

```
Acrescenta:
- AWS RDS (PostgreSQL managed): +R$ 100
- AWS S3 (fotos/docs): +R$ 50
- Claude API (IA para análise): +R$ 100-200
- DataDog (monitoring): +R$ 150
- Bright Data (web scraping scale): +R$ 200

TOTAL MENSAL: R$ 1.000-1.500
```

**Recomendação**: Começar com LEAN, migrar para CONFORTÁVEL quando tiver 3+ shoppings

---

## PARTE 5: KPIs DE SUCESSO

### Mês 1 (Semanas 1-4)
```
✓ 1 shopping piloto online
✓ 30+ espaços catalogados
✓ 15+ investidores mapeados
✓ 15+ marcas em DB
Status: ~60% dados

Esperado: Aceitação de usar Excel + entender a lógica
```

### Mês 2 (Semanas 5-8)
```
✓ Hunter rodando: 10+ prospects/semana
✓ Farmer operacional: scores automáticos
✓ Dashboard básico: 4+ views
✓ 1-2 matches propostos

KPI esperado: "10 leads qualificados novos"
```

### Mês 3 (Semanas 9-12)
```
✓ Sistema rodando smooth (0 crashes)
✓ Hunter: 20+ prospects/semana
✓ Farmer: 15+ investidores qualificados
✓ KA: 3+ matches/semana com > 70% score
✓ 1 contrato fechado (via sistema)

KPI esperado: "Tempo triagem reduzido em 50%"
KPI esperado: "3-5 novos contratos em negociação"
```

### Trimestre 1+ (Escala)
```
Métrica | Target | Realidade Atual | Com SIOS
---------|--------|------------------|----------
Tempo triagem investidor | 5h | → | 15 min (20x faster)
Tempo encontrar espaço | 3h | → | 5 min (36x faster)
Propostas/mês | 2-3 | → | 8-10 (4x mais)
Closing rate | 10% | → | 25% (2,5x melhor)
Occupancy | 88% | → | 93% (+5pp)
```

---

## PARTE 6: RISCOS E MITIGAÇÃO

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|--------|-----------|
| Dados incorretos em planilha | ALTA | CRÍTICO | Validação automática + 2 pessoas conferem |
| Excel desatualizado | ALTA | MÉDIO | Sync automático semanal |
| APIs caem (Google, SERASA) | BAIXA | MÉDIO | Fallback para dados em cache + manual |
| Staff não usa sistema | MÉDIA | CRÍTICO | Training + incentivo + KPI tracking |
| Vazamento de dados (CPF/CNPJ) | BAIXA | CRÍTICO | Encriptação + audit log + LGPD compliance |
| Servidor cai | BAIXA | CRÍTICO | Backup horário + redundância |

---

## PARTE 7: CHECKLIST FINAL

### PRÉ-PRODUÇÃO
- [ ] Banco de dados criado e testado
- [ ] Todas as 7 planilhas criadas com dados
- [ ] Backend rodando sem erros
- [ ] Dashboard mostrando dados reais
- [ ] Sync Python testado 3x
- [ ] Equipe treinada
- [ ] Documentação escrita
- [ ] Backup automático configurado

### GO LIVE
- [ ] Comunicar à empresa (mail + reunião)
- [ ] Day 1: monitorar 24/7
- [ ] Primeira semana: correções rápidas
- [ ] Relatório de problemas / feedback
- [ ] Iteração rápida

### PÓS-PRODUÇÃO
- [ ] Métricas sendo coletadas
- [ ] Relatórios saindo automaticamente
- [ ] Team usando ativamente
- [ ] Primeiros resultados visíveis (3-4 semanas)

---

## PRÓXIMOS PASSOS IMEDIATOS

1. **Esta semana**:
   - [ ] Ler este documento todo
   - [ ] Responder as 5 perguntas de realidade
   - [ ] Escolher 1 shopping piloto
   - [ ] Nomear as 3-4 pessoas-chave

2. **Próximas 2 semanas**:
   - [ ] Criar Supabase account
   - [ ] Rodar schema SQL
   - [ ] Preencher Planilha 01 (Shopping Master)
   - [ ] Arranjar Tech person

3. **Semana 3-4**:
   - [ ] Começar prospecção Hunter
   - [ ] Listar investidores conhecidos
   - [ ] Fazer inventário de espaços

---

## APOIO E SUPORTE

**Se tiver dúvidas:**
1. Releia este documento
2. Procure no `01_SIOS_Architecture.md`
3. Cheque os templates em `04_SIOS_Excel_Implementation_Guide.md`
4. Rode os testes no backend

**Se tiver problemas técnicos:**
- Check logs em /home/claude/logs
- Validate BD com: `SELECT * FROM shopping;`
- Test API: `curl http://localhost:8000/health`

---

**Versão**: 1.0
**Data**: Janeiro 2025
**Status**: Pronto para implementação
