# SIOS - Decisões Arquiteturais

## DECISÃO 1: PostgreSQL
- **Por quê**: ACID + relacional + GIS nativo + free
- **Risk**: >1M registros precisa particionamento

## DECISÃO 2: FastAPI
- **Por quê**: Async nativo, auto-docs, 2-3x rápido que Flask
- **Risk**: Menos mature que Django

## DECISÃO 3: Google Places API Público
- **Por quê**: R$20-30/mês vs R$5.000+ dados premium
- **Risk**: Google muda preço (mitigação: cache)

## DECISÃO 4: Suitability Score 5 Dimensões
- **Peso**: Capital (30) + Experiência (20) + Risco (20) + Disponibilidade (15) + Crédito (15)
- **Corte**: 60+ = Qualificado

## DECISÃO 5: 7 Planilhas Excel + Sync
- **Por quê**: Baixo atrito, todos entendem Excel
- **Risk**: Alguém deleta coluna (mitigação: data validation)

## DECISÃO 6: n8n para Automação
- **Por quê**: Visual, self-hosted, grátis, webhooks
- **Risk**: 3rd party (mitigação: pode rodar local)

## DECISÃO 7: Streamlit → Metabase
- **Faseamento**: Streamlit agora (2-3h), Metabase mês 3+ (1 semana)
- **Por quê**: Prototipa rápido depois profissional

## DECISÃO 8: Ordem Agentes
Hunter → Farmer → KA (simples antes complexo)

## DECISÃO 9: Segurança 4 Níveis
Nível 1: HTTPS + env vars + rate limit (Dia 1)
Nível 2: JWT + RBAC (Semana 2)
Nível 3: Audit log + encriptação PII (Semana 4)
Nível 4: Pen test + LGPD (Mês 3)

## DECISÃO 10: Sem SERASA no Começo
- **Por quê**: Caro (R$300-500/mês), começa qualitativo
- **Quando**: Adicionar em Mês 2

## DECISÃO 11: KPI Primário
50% redução tempo triagem: 3h → 1,5h

## DECISÃO 12: 1 BD para N Shoppings
- **Vantagem**: Mais barato, agentes isolados por shop_id
- **Custo marginal**: R$30-50/shop/mês
