# Manual de Operação — Plaza Niterói System

## Fluxo de trabalho recomendado

### Diariamente (EV)
1. Abrir `web/index.html` no navegador
2. Atualizar oportunidades que mudaram (estágio, próxima ação, blocker)
3. No fim do dia, exportar JSON (botão "Backup JSON" no sistema) — guardar em pasta segura

### Semanalmente (EV)
1. Exportar CSV do sistema web
2. Subir CSV para SharePoint ou colar manualmente na aba **Pipeline** da planilha Excel
3. Conferir o Dashboard — KPIs e ações atrasadas

### Quinzenalmente (Time completo)
1. Reunião de pipeline — abrir planilha Excel no SharePoint
2. Revisar oportunidades ALTA prioridade primeiro
3. Atualizar log na aba **Log Atualizações** (data, usuário, mudança, observação)
4. Repassar ações atrasadas (Dashboard mostra)

### Mensalmente (Diretoria)
1. Abrir aba **Dashboard** da planilha (snapshot atualizado)
2. Gerar relatório executivo a partir do sistema web (botão "Copiar relatório")
3. Decisões estratégicas sobre OPP-F1 (foyer) e OPP-B-HM (H&M)

## Regras de input

### Ao adicionar nova oportunidade
1. **Antes de adicionar**, consultar `data/mix-atual-plaza.json` ou aba **Mix Atual Plaza** da planilha
2. Se a marca **JÁ EXISTE no Plaza**, NÃO adicionar (descartar)
3. Se for **n.v.**, adicionar com status "n.v. - verificar duplicidade" e investigar antes de avançar

### Ao mudar estágio
1. Sempre registrar no **Log Atualizações** (data + usuário + mudança + observação)
2. Atualizar a próxima ação e o prazo

### Ao perder uma oportunidade
1. Mudar estágio para "Lost / Parked"
2. Registrar motivo no campo Blocker e no Log
3. **NÃO** apagar — manter para histórico e aprendizado

## Cadência sugerida

| Frequência | Rito | Quem |
|---|---|---|
| Diária | Atualização individual | EV |
| Semanal | Sincronização CSV → planilha | EV |
| Quinzenal | Comitê de pipeline | EV + KA + Street + Hunter + Farmer |
| Mensal | Comitê de cluster experience | EV + Cluster Engine + Diretoria |
| Trimestral | Revisão de KPIs | Diretoria Allos |

## Quando pedir ajuda

- **Cluster Fit < 40** em uma oportunidade ativa = revisar com Cluster Engine
- **3+ tentativas sem resposta** da marca = considerar "Lost / Parked"
- **Blocker técnico do espaço** (m², infra) = acionar Builder antes de avançar
- **Marca exige investidor** = acionar Farmer para match

## Indicadores críticos para reportar

1. **# de contratos assinados** (meta 90d: 1)
2. **ABL recolocada** (meta 90d: 30% dos 6.028 m²)
3. **Dias médios saída → contrato** (meta: ≤ 180 d em 90 dias)
4. **# reuniões Street Converter** (meta 90d: 30 — Mandamento 10 do Levy)
5. **Resposta H&M Brasil** (binário — meta 90d: reunião realizada)

## Limitações que o time precisa conhecer

- A lista de duplicidade (Mix Atual Plaza) tem ~100+ marcas verificadas via fontes públicas. **Pode estar incompleta**. Cruzar com o sistema interno Allos antes de cada abordagem comercial real.
- O sistema web salva dados por navegador (não por usuário). Trocar de máquina = perder dados. **Backup JSON semanal é obrigatório**.
- Co-autoria da planilha via SharePoint resolve a maior parte dos conflitos, mas em mesma célula prevalece a última gravação.
- Para mais de ~10 usuários simultâneos ou integrações com calendário/email, migrar para Pipedrive ou HubSpot.
