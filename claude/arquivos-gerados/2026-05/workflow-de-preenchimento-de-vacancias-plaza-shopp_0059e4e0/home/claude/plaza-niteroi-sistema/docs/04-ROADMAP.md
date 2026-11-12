# 04 — Roadmap

## Próximos passos (priorizados)

### Curto prazo (30 dias)

1. **Validar duplicidade vs sistema interno Allos**
   - Cruzar `data/mix-atual-plaza.json` com o tenant mix oficial
   - Atualizar status de marcas como `JÁ EXISTE`, `AUSENTE` ou `n.v.`
   - Risco mitigado: descobrir nova duplicidade ao longo do uso

2. **Confirmar status real das 39 saídas Ano 1 com EV**
   - 8 marcas aparecem ainda na lista atual de tenants (Lojas Americanas, Vivo, Havaianas, Walter Coiffeur, Maxvision, MMartan, First Class, Sensoria)
   - Mover para `Lost / Parked` as que não saíram de fato

3. **Master plan do Foyer Cinemark (5.097m²)**
   - Aprovação executiva Allos Desenv.
   - CAPEX preliminar
   - Conceito INDOOR (NÃO Taste Lab)

4. **Pitch H&M Plaza**
   - Reunião institucional Diretoria Allos → Grupo Dorben (JV oficial H&M Brasil)
   - Caixa Americanas 2.724m²

5. **Reuniões prioritárias Street Converter**
   - Bullguer, Ferro e Farinha, Cantón, Pli On Board
   - Visita presencial + tese de conversão

### Médio prazo (60-90 dias)

6. **Liberar acesso ao Sistema Bahia**
   - Preço/m², FPP, CDU, condições comerciais
   - Habilita underwriting financeiro preciso (hoje é direcional)

7. **Estruturar CRM Farmer**
   - Cadastro de investidores com suitability (capital, experiência, perfil de risco)
   - Match com marcas em expansão

8. **Integrar Plataforma de Espaços Allos**
   - Ficha digital de cada caixa vaga
   - Foto, planta, infraestrutura, condições comerciais

9. **Multifranqueado RJ (Mand. 8 Levy)**
   - Mapear via Sindilojas RJ
   - Lote único 10-15 caixas pequenas (1.485m²)

### Longo prazo (6+ meses)

10. **Migrar para CRM corporativo (Pipedrive ou HubSpot)**
    - Quando o time crescer além de 10 pessoas
    - Quando precisar de integrações (email, calendar, telefone)
    - Quando precisar de relatórios automáticos por email
    - Os dados deste sistema servem como import inicial

11. **Integrar com sistemas Allos**
    - Sistema Bahia (precificação)
    - CRM Farmer (investidores)
    - Plataforma de Espaços (vacâncias)
    - Possível via API se Allos liberar

12. **Replicar para outros shoppings Allos**
    - Mesma estrutura (cluster, batalhas, deal conversion)
    - Adaptar mix atual e operadores de rua por cidade

---

## Melhorias de funcionalidade (backlog)

### Web app (`app/index.html`)

- [ ] Autenticação multi-usuário (hoje cada usuário tem seu storage)
- [ ] Sincronização com Google Drive ou Dropbox (backup automático)
- [ ] Notificações de prazo vencido (push browser)
- [ ] Gráfico de funil de conversão (visualização)
- [ ] Filtro por período (criadas/atualizadas em X dias)
- [ ] Exportar para PDF (relatório executivo)
- [ ] Dark mode

### Planilha Excel

- [ ] Power Query para importar CSV do web app automaticamente
- [ ] Macro VBA para timestamping automático
- [ ] Pivot table interativa para diretoria
- [ ] Dashboard com gráficos (já tem números, falta visual)

### Estrutura de dados

- [ ] Vincular oportunidades a saídas específicas (com ABL real)
- [ ] Campo de "investidor compatível" (cruzar com CRM Farmer)
- [ ] Histórico de mudanças de preço/aluguel
- [ ] Anexos (LOIs, propostas, fotos do espaço)

---

## Métricas de sucesso do sistema

### KPIs do sistema (não do negócio)
- Adoção: % de oportunidades atualizadas semanalmente
- Higiene: % de oportunidades com próxima ação dentro do prazo
- Velocidade: tempo médio entre estágios

### KPIs do negócio
Ver aba **KPIs** da planilha. Principais:
- Contratos assinados (90d: 1 | 180d: 4 | 270d: 8)
- ABL recolocada / vacância (90d: 30% | 180d: 65% | 270d: 85%)
- Dias médios saída → contrato (270d: ≤ 90)
- # reuniões Street Converter (Mand. 10: 30/90/150)

---

## Quando migrar para CRM profissional

Sinais de que chegou a hora:
- Time > 10 pessoas usando o sistema
- > 100 oportunidades ativas
- Necessidade de integração com email/calendar
- Diretoria pede relatórios diários por email
- Necessidade de controle de acesso por papel
- Necessidade de auditoria detalhada

**Recomendações:**
- **Pipedrive:** mais simples, foco em pipeline visual, ~R$ 80/usuário/mês
- **HubSpot Sales:** mais robusto, integra com marketing, free tier limitado
- **Salesforce:** overkill para esta operação

---

## Versionamento

| Versão | Data | Mudanças |
|---|---|---|
| v5 | 2026-05 | Filtro de duplicidade vs mix verificado + canais de contato comerciais |
| v4 | 2026-05 | 14 abas, raio expandido Tijuca + Zona Sul |
| v3 | 2026-05 | Filtro de duplicidade inicial (288 marcas brasil-shoppings) |
| v2 | 2026-05 | Foyer redev sem Taste Lab |
| v1 | 2026-05 | Análise inicial do Plaza Niterói |
