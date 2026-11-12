# CONTEXTO DO APP — DIÁRIO NUTRICIONAL

## O QUE É ESTE APP

Replica o sistema de meal logging que o usuário faz em chat com IA. O problema do chat é que a conversa fica muito longa e consome toda a janela de contexto. Este app resolve isso: histórico fica no banco de dados, cada chamada à IA usa só o perfil + dia atual.

---

## PERFIL DO USUÁRIO

```
Nome: Daniel
Peso: 111.2 kg
Músculo esquelético: 53.1 kg
Gordura corporal: 17.7%
TMB: 2346 kcal
Objetivo: cutting lento (meta 102-104 kg até jun/2027)
Ritmo: ~0.15 kg/semana, déficit ~150-180 kcal/dia
Alertas lipídicos: LDL 137 (alto), HDL 39 (baixo), triglicérides 141 (alto)
```

---

## METAS DIÁRIAS POR TIPO DE TREINO

```
descanso:    2900-3000 kcal | P:220-240g | C:180-230g | G:80-100g
leve:        3000-3100 kcal | P:220-240g | C:200-280g | G:80-100g
musculação:  3100-3300 kcal | P:220-240g | C:250-320g | G:80-100g
perna:       3100-3300 kcal | P:220-240g | C:300-350g | G:80-100g
BJJ:         3300-3400 kcal | P:220-240g | C:320-400g | G:85-105g
duplo:       3300-3500 kcal | P:230-250g | C:350-420g | G:85-105g
```

---

## ALIMENTOS COM MACROS FIXOS

Usar SEMPRE estes valores quando mencionados:

```
Rap10 tortilla (40g):          93 kcal | P:2.9g  C:18g   G:1g
Whey scoop padrão (30g):      120 kcal | P:24g   C:2g    G:2g
CarboLift/palatinose (30g):   116 kcal | P:0     C:29g   G:0
SuperCoffee (10g):             40 kcal | P:2g    C:1g    G:3g
Creatina (5g):                  0 kcal
Koala Sleep (12g):             31 kcal | P:0     C:6g    G:0.5g
Iogurte desnatado (250g):     150 kcal | P:25g   C:15g   G:0
Yorgus grego integral (250g): 200 kcal | P:17g   C:9g    G:11g
PeptiStrong/LiftStrong (7.9g): 23 kcal | P:2.5g  C:2g    G:0.5g
```

---

## FLUXO DE USO

1. Abre o app → define tipo de treino do dia (dropdown)
2. Come algo → registra por **foto** ou **texto livre**
3. IA estima macros → usuário confirma ou edita → salva
4. Dashboard atualiza totais + saldo restante + flags de alerta
5. Repete ao longo do dia
6. "Fechar o dia" no fim → registro permanente
7. Histórico + gráficos acessíveis a qualquer momento

---

## TELAS

### Tela 1 — Dashboard (tela principal)
- Cabeçalho: data de hoje + dropdown tipo de treino
- 4 cards de progresso: **Kcal / Proteína / Carbo / Gordura**
  - Cada card: valor realizado / meta, barra de progresso colorida
  - Verde = dentro da meta | Amarelo = abaixo | Vermelho = acima do teto
- Lista de refeições do dia (R1, R2, R3... com macros e flags)
- Botão flutuante "＋ Registrar refeição"
- Botão "Fechar o dia" (aparece quando há ≥3 refeições)
- Seção de alertas do dia (flags automáticas)

### Tela 2 — Registro de Refeição
- Botão: tirar foto / fazer upload
- Campo: texto livre descrevendo a refeição
- Chama IA → mostra card de resultado:
  - Descrição identificada
  - Macros estimados (todos editáveis)
  - Badge de confiança (X/10) — amarelo se < 7
  - Flags de alerta se houver
  - Incertezas: "Tipo de queijo não identificado — estimei minas padrão"
  - Pergunta se necessário: "Foi arroz integral ou couve-flor?"
- Botão "Salvar" → volta pro dashboard

### Tela 3 — Histórico / Gráficos
- Seletor de período: 7d / 14d / 30d
- Gráfico 1: Calorias realizado vs meta (barras agrupadas)
- Gráfico 2: Proteína / Carbo / Gordura ao longo do tempo (linhas)
- Gráfico 3: Realizado vs meta por macro (últimos 7 dias)
- Tabela: dias fechados com totais e tipo de treino

---

## INFERÊNCIAS SILENCIOSAS DA IA

A IA aplica estas regras sem perguntar:

- Carne sem preparo mencionado → assume grelhada
- Item empanado → +30% kcal sobre o grelhado equivalente
- Sem bebida na foto → água (0 kcal)
- Correção pelo usuário → recalcula imediatamente sem pedir confirmação

---

## FLAGS DE ALERTA AUTOMÁTICO

```
⚠️ saturada_alta    → queijo / creme / manteiga / embutido / fritura concentrados
⚠️ carbo_baixo      → carbo < 75% do alvo em dia de BJJ / duplo / perna
⚠️ deficit_agressivo→ kcal < 80% do teto em dia de treino pesado
✅ proteina_ok      → proteína acima do piso da meta
🐟 omega3           → peixe / chia / linhaça presentes
```

---

## PROMPT DO SISTEMA — ESTIMATIVA DE MACROS

Cole este prompt exato como system prompt nas chamadas à API:

```
Você é assistente de nutrição especializado em estimar macros de refeições.

PERFIL DO USUÁRIO:
- Homem, 111kg, 53kg músculo esquelético, objetivo: cutting lento
- Alertas lipídicos: LDL 137 (alto), HDL 39 (baixo), triglicérides 141 (alto)
- Sempre sinalizar: gordura saturada concentrada (queijo, creme, manteiga, embutido, fritura)

ALIMENTOS COM MACROS FIXOS — use estes valores exatos quando mencionados:
- Rap10 tortilla (40g): 93 kcal P:2.9 C:18 G:1
- Whey scoop (30g): 120 kcal P:24 C:2 G:2
- CarboLift/palatinose (30g): 116 kcal P:0 C:29 G:0
- SuperCoffee (10g): 40 kcal P:2 C:1 G:3
- Creatina (5g): 0 kcal
- Iogurte desnatado (250g): 150 kcal P:25 C:15 G:0

INFERÊNCIAS SILENCIOSAS:
- Sem preparo mencionado = grelhado
- Empanado = +30% kcal sobre grelhado equivalente
- Sem bebida na foto = água (0 kcal)

RETORNE SOMENTE JSON, sem texto antes ou depois, sem markdown:
{
  "description": "descrição curta do identificado",
  "kcal": number,
  "protein_g": number,
  "carb_g": number,
  "fat_g": number,
  "confidence": number (1-10),
  "flags": ["saturada_alta" | "carbo_baixo" | "omega3" | "poco_proteina"],
  "uncertainties": ["descrição de itens não confirmados"],
  "questions": ["pergunta se algo importante precisar confirmação"]
}
```

---

## SCHEMA DO BANCO (PRISMA)

```prisma
model Day {
  id             String   @id @default(cuid())
  date           String   @unique  // "2026-06-12"
  training_type  String   // rest | light | strength | legs | bjj | double
  training_notes String?
  closed         Boolean  @default(false)
  createdAt      DateTime @default(now())
  meals          Meal[]
}

model Meal {
  id          String   @id @default(cuid())
  day_id      String
  day         Day      @relation(fields: [day_id], references: [id])
  code        String   // R1, R2, R3...
  description String
  photo_url   String?
  kcal        Float
  protein_g   Float
  carb_g      Float
  fat_g       Float
  confidence  Int
  flags       String?  // JSON array serializado
  notes       String?
  createdAt   DateTime @default(now())
}

model KnownFood {
  id              String  @id @default(cuid())
  name            String  @unique
  serving_g       Float
  kcal_per_serving Float
  protein_g       Float
  carb_g          Float
  fat_g           Float
  notes           String?
}
```

---

## LÓGICA DE CÁLCULO

```typescript
// Totais acumulados do dia
function calcTotals(meals: Meal[]) {
  return meals.reduce((acc, m) => ({
    kcal:      acc.kcal      + m.kcal,
    protein_g: acc.protein_g + m.protein_g,
    carb_g:    acc.carb_g    + m.carb_g,
    fat_g:     acc.fat_g     + m.fat_g,
  }), { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 })
}

// Saldo restante (vs teto da meta)
function calcRemaining(totals, targets) {
  return {
    kcal:      targets.kcal[1]      - totals.kcal,
    protein_g: targets.protein_g[1] - totals.protein_g,
    carb_g:    targets.carb_g[1]    - totals.carb_g,
    fat_g:     targets.fat_g[1]     - totals.fat_g,
  }
}

// Status visual de cada macro
function macroStatus(value, [min, max]) {
  if (value > max * 1.1) return 'over'    // vermelho
  if (value >= min * 0.8) return 'good'   // verde
  return 'under'                          // amarelo
}

// Próximo código de refeição
function nextMealCode(meals) {
  if (meals.length === 0) return 'R1'
  const last = parseInt(meals[meals.length - 1].code.replace('R', ''))
  return `R${last + 1}`
}
```

---

## CORES E VISUAL

```
Proteína:  verde   #16A34A
Carbo:     laranja #EA580C
Gordura:   vermelho #DC2626
Calorias:  roxo   #7C3AED
Fundo:     cinza claro #F9FAFB
Cards:     branco com sombra leve
```

- Mobile first — tudo funciona com uma mão
- Botões grandes e tapáveis
- Sem tabelas densas na tela principal
- Toast notifications após salvar
- Skeleton screens nos estados de loading
- Badge amarelo quando confiança da IA < 7

---

## STACK

```
Frontend:  Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
Banco:     Prisma + SQLite (dev) → PostgreSQL (prod)
IA:        Anthropic SDK — modelo: claude-sonnet-4-6
Gráficos:  Recharts
Deploy:    Vercel ou local (npm run dev)
```

---

## VARIÁVEIS DE AMBIENTE

```env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ROTAS DA API

```
POST /api/meals/estimate   → recebe foto (base64) ou texto, retorna macros estimados
POST /api/meals/save       → salva refeição confirmada no banco
GET  /api/day/[date]       → retorna dia completo com totais e metas
POST /api/day/close        → fecha o dia
POST /api/day/training     → define/altera tipo de treino do dia
GET  /api/history          → histórico de dias fechados para gráficos
```

---

## SEQUÊNCIA DE DESENVOLVIMENTO

1. Setup: `npx create-next-app@latest`, instala prisma + anthropic + shadcn + recharts
2. Schema Prisma + migration
3. `POST /api/meals/estimate` — testa com texto simples
4. Dashboard com mock data + barras de progresso
5. Tela de registro — integra com API estimate
6. Salva no banco + atualiza dashboard em tempo real
7. Upload de foto (base64 encoding)
8. Fechar dia
9. Histórico + gráficos Recharts
10. Polish: toasts, loading states, responsivo mobile

---

## REGRA PRINCIPAL DE UX

**Mínimo atrito acima de tudo.**
- Foto → estimativa automática, sem formulários
- Texto → estima sem confirmação item a item
- Correção → edita direto no card, recalcula na hora
- Usuário nunca precisa calcular nada manualmente
