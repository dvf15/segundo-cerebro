# 01 — Como usar o sistema

## Quem usa o quê

| Perfil | Ferramenta principal | Frequência | Por quê |
|---|---|---|---|
| **EV (Executivo Comercial)** | `app/index.html` (web) | Diária | Rápido, offline, histórico automático |
| **KA / Hunter / Street Converter** | `app/index.html` | Diária | Mesma interface, filtro por dono |
| **Diretoria Allos** | `planilha/Plaza_Niteroi_Sistema.xlsx` | Semanal | Dashboard executivo, co-autoria, relatórios formais |

---

## Workflow diário (EV)

1. **Manhã (15 min):**
   - Abrir `app/index.html`
   - Aba **Dashboard** → revisar ações atrasadas (vermelho)
   - Aba **Pipeline** → filtrar `Prio = ALTA` → priorizar essas ações no dia

2. **Após cada reunião/contato:**
   - Abrir a oportunidade → clicar Editar
   - Atualizar estágio se mudou
   - Escrever observação no campo "Histórico" (entra automaticamente no log)
   - Atualizar próxima ação e prazo

3. **Sexta-feira (30 min):**
   - Exportar CSV (botão no Pipeline)
   - Subir para a pasta compartilhada do time
   - Diretoria revisa dashboard semanal na planilha

---

## Workflow semanal (Diretoria)

1. **Segunda-feira:**
   - Abrir `Plaza_Niteroi_Sistema.xlsx` no SharePoint
   - Aba **Dashboard** → KPIs (Total, Contratos, ABL, Atrasados, Fit médio)
   - Aba **Log Atualizações** → ler updates da semana

2. **Reunião semanal de Deal Conversion (40 min):**
   - Compartilhar tela com a aba Pipeline
   - Filtrar por `Estágio = Proposal` ou `Contract Negotiation` → revisar essas
   - Revisar atrasados
   - Definir 3 prioridades da semana

---

## Adicionando nova oportunidade

### Regra de ouro
**SEMPRE validar duplicidade ANTES** de adicionar uma marca nova:
1. Abrir aba `Mix Atual Plaza` (planilha) ou consultar lista pública
2. Buscar pela marca
3. Se aparece como `JÁ EXISTE` → não adicionar; marcar oportunidade existente como `Lost / Parked` se for o caso
4. Se aparece como `SATURADA` → categoria saturada, pivotar para outra
5. Se NÃO aparece → seguir para passo 2

### Adicionar no app web
1. Clicar `+ Nova Oportunidade`
2. Preencher: Saída (espaço físico), Marca-alvo, Tese (1-2 frases), Canal de contato
3. Salvar — entra no pipeline com estágio Lead

### Adicionar na planilha
1. Aba `Pipeline` → ir até a primeira linha vazia (após linha 30)
2. Preencher dropdowns + campos
3. Última atualização: data de hoje
4. Aba `Log Atualizações` → registrar criação

---

## Codificação de estágios

```
Lead              → Contacted        → Meeting Scheduled
Meeting Done      → Proposal         → Contract Negotiation
Contract Signed   → Construction     → Opening   → Ramp-up
                  ↘ Lost / Parked  (qualquer estágio pode terminar aqui)
```

Mover para `Lost / Parked` se:
- Marca não responde após 3 tentativas qualificadas
- Cluster Fit < 40 e sem emergência de vacância
- Marca confirmou desinteresse
- Aluguel viável não fecha conta

---

## Códigos de cor (semáforos)

| Cor | Significado |
|---|---|
| 🟢 Verde | Status positivo (AUSENTE confirmado, Contract Signed, Fit alto) |
| 🟡 Amarelo | Precisa verificação (n.v., MÉDIA prioridade, Lead novo) |
| 🔴 Vermelho | Risco (JÁ EXISTE, prazo vencido, Lost, Alta prioridade) |
| 🔵 Azul | Em análise (estágios intermediários) |

---

## Sincronização entre web e planilha

**Não é automática.** Recomendação:

- **Web é a fonte de verdade individual** (EV usa diariamente)
- **Planilha é a fonte de verdade coletiva** (atualizada 1x por semana via CSV)

### Como sincronizar
1. Web → "📥 Exportar CSV"
2. Excel → aba Pipeline → linha de cabeçalho (linha 3) → **Importar dados** ou colar manualmente
3. Salvar

### Backup do web
1. Web → "💾 Backup JSON" (gera arquivo)
2. Salvar em `data/backups/AAAA-MM-DD-backup.json`
3. Para restaurar: "📤 Restaurar JSON"

---

## Troubleshooting

### "Perdi os dados do web"
- Os dados ficam no navegador. Se trocou de máquina/navegador, restaurar via JSON.
- Para evitar: fazer backup JSON semanalmente.

### "Dashboard da planilha não atualiza"
- Pressionar **F9** para forçar recálculo
- Verificar se não há filtros aplicados na aba Pipeline

### "Marca aparece duplicada"
- Confirmar status na aba `Mix Atual Plaza`
- Se já existe no shopping → mudar status para `JÁ EXISTE - descartar` no pipeline
- Mover oportunidade para `Lost / Parked` se quiser manter histórico

### "Conflito de edição na planilha (SharePoint)"
- Excel preserva edições em células diferentes
- Conflito em mesma célula: prevalece última gravação
- Para evitar: dividir responsabilidade por dono (EV edita uma faixa, Diretoria edita outra)

---

## Contatos de suporte

- **Metodologia:** revisar `docs/02-METODOLOGIA.md` (Shopping Inteligente OS v5)
- **Mudanças no sistema:** abrir issue no repositório do projeto
- **Acesso ao Sistema Bahia, CRM Farmer, base KA interna:** acionar TI Allos
