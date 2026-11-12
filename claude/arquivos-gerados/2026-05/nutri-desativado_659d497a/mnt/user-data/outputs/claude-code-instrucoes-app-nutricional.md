# 📋 INSTRUÇÃO PARA CLAUDE CODE — App de Diário Nutricional

## CONTEXTO DO PROJETO

Este app replica o sistema de meal logging que o usuário faz atualmente em conversas longas com o Claude no chat, o que consome toda a janela de contexto. O objetivo é mover esse fluxo para um app persistente, onde o histórico fica no banco de dados e cada interação com a IA usa um contexto mínimo (só o dia atual + perfil).

---

## STACK RECOMENDADA

```
Frontend:  Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
Backend:   Next.js API Routes (serverless)
Banco:     SQLite via Prisma (local/dev) → PostgreSQL (produção)
IA:        Anthropic API (claude-sonnet-4-6) para estimativa de macros
Upload:    Vercel Blob ou local (fotos de refeição)
Charts:    Recharts
Deploy:    Vercel (ou local com npm run dev)
```

---

## PERFIL DO USUÁRIO (hardcoded v1, editável depois)

```json
{
  "name": "Daniel",
  "weight_kg": 111.2,
  "skeletal_muscle_kg": 53.1,
  "body_fat_pct": 17.7,
  "tmb_kcal": 2346,
  "goal": "slow_cut",
  "target_weight_kg": 102,
  "target_date": "2027-06-01"
}
```

---

## METAS DIÁRIAS POR TIPO DE TREINO

```json
{
  "rest": {
    "kcal": [2900, 3000],
    "protein_g": [220, 240],
    "carb_g": [180, 230],
    "fat_g": [80, 100]
  },
  "light": {
    "kcal": [3000, 3100],
    "protein_g": [220, 240],
    "carb_g": [200, 280],
    "fat_g": [80, 100]
  },
  "strength": {
    "kcal": [3100, 3300],
    "protein_g": [220, 240],
    "carb_g": [250, 320],
    "fat_g": [80, 100]
  },
  "bjj": {
    "kcal": [3300, 3400],
    "protein_g": [220, 240],
    "carb_g": [320, 400],
    "fat_g": [85, 105]
  },
  "double": {
    "kcal": [3300, 3500],
    "protein_g": [230, 250],
    "carb_g": [350, 420],
    "fat_g": [85, 105]
  },
  "legs": {
    "kcal": [3100, 3300],
    "protein_g": [220, 240],
    "carb_g": [300, 350],
    "fat_g": [80, 100]
  }
}
```

---

## BANCO DE DADOS — SCHEMA PRISMA

```prisma
model Day {
  id           String   @id @default(cuid())
  date         String   @unique  // "2026-06-12"
  training_type String  // rest | light | strength | bjj | double | legs
  training_notes String? // "BJJ + musculação ombro"
  closed       Boolean  @default(false)
  createdAt    DateTime @default(now())
  meals        Meal[]
}

model Meal {
  id           String   @id @default(cuid())
  day_id       String
  day          Day      @relation(fields: [day_id], references: [id])
  code         String   // R1, R2, R3...
  description  String   // descrição livre
  photo_url    String?  // URL da foto
  kcal         Float
  protein_g    Float
  carb_g       Float
  fat_g        Float
  confidence   Int      // 1-10
  notes        String?  // flags geradas pela IA (ex: saturada alta)
  createdAt    DateTime @default(now())
}

model KnownFood {
  id          String @id @default(cuid())
  name        String @unique
  kcal_per_100g Float
  protein_g   Float
  carb_g      Float
  fat_g       Float
  notes       String? // "Rap10: 93kcal/40g, P:2.9 C:18 G:1"
}
```

---

## ROTAS DA API

### `POST /api/meals/estimate`
Recebe foto (base64) ou texto descrevendo a refeição. Chama Claude API com prompt especializado. Retorna macros estimados + confiança + flags.

### `POST /api/meals/save`
Salva refeição no banco com macros confirmados.

### `GET /api/day/[date]`
Retorna o dia completo: refeições, totais acumulados, metas, saldo restante.

### `POST /api/day/close`
Fecha o dia (closed = true). Calcula totais finais.

### `GET /api/history`
Retorna histórico de dias fechados para os gráficos.

### `POST /api/day/training`
Define ou altera o tipo de treino do dia.

---

## PROMPT DO SISTEMA — ESTIMATIVA DE MACROS

Use este prompt exato na chamada Claude API em `/api/meals/estimate`:

```
Você é um assistente de nutrição especializado em estimar macros de refeições.

PERFIL DO USUÁRIO:
- Homem, 111kg, 53kg músculo esquelético, cutting lento
- Alerta: LDL 137 (alto), HDL 39 (baixo), triglicérides 141 (alto)
- Foco: preservar massa magra, reduzir gordura saturada

ALIMENTOS COM MACROS CONHECIDOS (use estes valores exatos):
- Rap10 tortilla (40g): 93 kcal | P:2.9g | C:18g | G:1g
- 1 scoop whey padrão (30g): 120 kcal | P:24g | C:2g | G:2g
- CarboLift/palatinose (30g): 116 kcal | P:0 | C:29g | G:0
- SuperCoffee (10g): 40 kcal | P:2g | C:1g | G:3g
- Creatina (5g): 0 kcal
- Koala Sleep (12g): 31 kcal | P:0 | C:6g | G:0.5g

INFERÊNCIAS SILENCIOSAS (aplique sem perguntar):
- Carne sem preparo mencionado = grelhada
- Empanado = +30% kcal sobre grelhado equivalente
- Sem bebida na foto = água (0 kcal)
- Iogurte desnatado 250g padrão = 150 kcal | P:25g | C:15g | G:0

RETORNE SOMENTE JSON, sem texto antes ou depois:
{
  "description": "descrição curta do que foi identificado",
  "kcal": número,
  "protein_g": número,
  "carb_g": número,
  "fat_g": número,
  "confidence": número de 1 a 10,
  "flags": ["flag1", "flag2"],
  "uncertainties": ["item1 não confirmado: x vs y kcal"],
  "questions": ["pergunta se necessário para precisar algo importante"]
}

FLAGS possíveis (use quando aplicável):
- "saturada_alta": gordura saturada concentrada (queijo, creme, manteiga, embutido, fritura)
- "carbo_baixo_treino": carbo insuficiente para o tipo de treino do dia
- "proteina_boa": proteína magra de qualidade
- "omega3": fonte de ômega-3 (peixe, chia, linhaça)
- "poco_proteina": refeição com menos de 15g de proteína
```

---

## FLUXO DO APP — TELAS

### 1. TELA PRINCIPAL (Dashboard do Dia)

**Layout:**
- Cabeçalho: data + tipo de treino (dropdown editável)
- Cards de progresso: Kcal / Proteína / Carbo / Gordura (realizado vs meta, barra colorida)
- Lista de refeições do dia (R1, R2, R3...)
- Botão flutuante "+ Registrar refeição"
- Botão "Fechar o dia" (aparece quando há pelo menos 3 refeições)

**Cores dos cards:**
- Verde: dentro da meta
- Amarelo: abaixo do alvo (-20%)
- Vermelho: acima do teto (+10%)

---

### 2. TELA DE REGISTRO DE REFEIÇÃO

**Fluxo:**
1. Usuário abre a tela
2. Pode tirar foto, fazer upload, ou digitar descrição em texto livre
3. App chama `/api/meals/estimate` com foto (base64) ou texto
4. Claude retorna estimativa JSON
5. App mostra card de resultado:
   - Descrição identificada
   - Macros estimados (editáveis)
   - Barra de confiança (X/10)
   - Flags se houver (ex: "⚠️ Gordura saturada concentrada")
   - Incertezas identificadas (ex: "🔍 Tipo de queijo não identificado")
   - Pergunta se necessário (ex: "Foi arroz integral ou couve-flor?")
6. Usuário confirma, edita macros se quiser, salva
7. Volta pro dashboard com totais atualizados

---

### 3. TELA DE HISTÓRICO / GRÁFICOS

**Gráficos com Recharts:**
- Calorias: realizado vs meta (bar chart, últimos 14 dias)
- Macros: proteína/carbo/gordura (line chart, últimos 14 dias)
- Realizado vs Meta por macro (bar agrupado, últimos 7 dias)

**Seletor de período:** 7d / 14d / 30d

**Tabela:** dias fechados com totais e tipo de treino

---

### 4. TELA DE ALIMENTOS CONHECIDOS (opcional, v2)

CRUD de alimentos com macros fixos para acelerar logging.

---

## LÓGICA DE NEGÓCIO CRÍTICA

### Cálculo do saldo restante
```typescript
function calcRemaining(day: Day, meals: Meal[], targets: Targets) {
  const totals = meals.reduce((acc, m) => ({
    kcal: acc.kcal + m.kcal,
    protein_g: acc.protein_g + m.protein_g,
    carb_g: acc.carb_g + m.carb_g,
    fat_g: acc.fat_g + m.fat_g,
  }), { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 })

  return {
    totals,
    remaining: {
      kcal: targets.kcal[1] - totals.kcal,           // vs teto
      protein_g: targets.protein_g[1] - totals.protein_g,
      carb_g: targets.carb_g[1] - totals.carb_g,
      fat_g: targets.fat_g[1] - totals.fat_g,         // margem disponível
    }
  }
}
```

### Status de cada macro
```typescript
function macroStatus(value: number, target: [number, number]) {
  const [min, max] = target
  if (value > max * 1.1) return 'over'       // vermelho
  if (value >= min * 0.8) return 'good'      // verde
  return 'under'                              // amarelo
}
```

### Geração do código da refeição
```typescript
function nextMealCode(meals: Meal[]): string {
  const count = meals.length
  if (count === 0) return 'R1'
  const last = meals[meals.length - 1].code
  // R0 = pré-treino (especial), R1+ sequencial
  const num = parseInt(last.replace('R', ''))
  return `R${num + 1}`
}
```

---

## CHAMADA CLAUDE API — IMPLEMENTAÇÃO

```typescript
// /api/meals/estimate/route.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic() // usa ANTHROPIC_API_KEY do env

export async function POST(req: Request) {
  const { text, imageBase64, imageMediaType, dayContext } = await req.json()

  const content = []

  // Adiciona imagem se houver
  if (imageBase64) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: imageMediaType || 'image/jpeg',
        data: imageBase64,
      }
    })
  }

  // Adiciona descrição textual
  content.push({
    type: 'text',
    text: text
      ? `Refeição descrita pelo usuário: "${text}"`
      : 'Estime os macros desta refeição na foto.'
  })

  // Contexto do dia (refeições anteriores + saldo)
  if (dayContext) {
    content.push({
      type: 'text',
      text: `CONTEXTO DO DIA (${dayContext.trainingType}):
Já consumido hoje: ${dayContext.totals.kcal} kcal | P:${dayContext.totals.protein_g}g | C:${dayContext.totals.carb_g}g | G:${dayContext.totals.fat_g}g
Falta pra meta: kcal:${dayContext.remaining.kcal} | P:${dayContext.remaining.protein_g}g | C:${dayContext.remaining.carb_g}g | G:${dayContext.remaining.fat_g}g`
    })
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: SYSTEM_PROMPT, // o prompt acima
    messages: [{ role: 'user', content }]
  })

  const text_response = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')

  // Remove markdown fences se houver
  const clean = text_response.replace(/```json|```/g, '').trim()
  const result = JSON.parse(clean)

  return Response.json(result)
}
```

---

## VARIÁVEIS DE AMBIENTE

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL="file:./dev.db"        # SQLite local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ESTRUTURA DE ARQUIVOS

```
/app
  /page.tsx                  → Dashboard (dia atual)
  /history/page.tsx          → Histórico + gráficos
  /api
    /meals/estimate/route.ts → Estimativa via Claude
    /meals/save/route.ts     → Salvar refeição
    /day/[date]/route.ts     → GET dia completo
    /day/close/route.ts      → Fechar dia
    /day/training/route.ts   → Definir tipo de treino
    /history/route.ts        → Histórico para gráficos
/components
  /DayDashboard.tsx          → Painel do dia
  /MealCard.tsx              → Card de refeição
  /MacroProgress.tsx         → Barras de progresso
  /MealLogger.tsx            → Tela de registro (foto/texto)
  /EstimateResult.tsx        → Card de resultado da IA
  /HistoryCharts.tsx         → Gráficos recharts
  /TrainingSelector.tsx      → Dropdown tipo de treino
/lib
  /prisma.ts                 → Client Prisma singleton
  /targets.ts                → Metas por tipo de treino
  /macros.ts                 → Funções de cálculo
  /prompts.ts                → System prompt da IA
/prisma
  /schema.prisma             → Schema do banco
```

---

## UX — COMPORTAMENTOS IMPORTANTES

### Mínimo atrito (regra principal)
- Upload de foto → estimativa automática, sem formulários
- Texto livre → estima sem perguntar confirmação de cada item
- Correção → edita macro direto no card, recalcula instantaneamente
- Inferências silenciosas: sem preparo = grelhado; sem bebida = água

### Feedback visual
- Após salvar refeição: toast com totais atualizados
- Flag de alerta sempre visível no card da refeição
- Barra de progresso muda de cor conforme o status
- Confiança < 7: mostra badge amarelo "⚠️ Estimativa incerta"

### Mobile first
- Tudo funciona com uma mão no celular
- Botão de câmera direto na tela principal
- Cards grandes, tapáveis
- Sem tabelas densas na tela principal (só no histórico)

---

## ALERTAS AUTOMÁTICOS (lógica de flags)

Gerar alerta automático quando:

```typescript
const AUTO_FLAGS = [
  {
    condition: (day) => day.fat_saturated_estimate > 25,
    message: "⚠️ Gordura saturada alta hoje — atenção ao LDL 137",
    type: 'warning'
  },
  {
    condition: (day, targets) =>
      ['bjj', 'double', 'legs'].includes(day.training_type) &&
      day.totals.carb_g < targets.carb_g[0] * 0.75,
    message: "⚠️ Carbo abaixo do alvo pra esse tipo de treino",
    type: 'warning'
  },
  {
    condition: (day, targets) =>
      day.totals.kcal < targets.kcal[0] * 0.80 &&
      ['bjj', 'double'].includes(day.training_type),
    message: "⚠️ Déficit calórico agressivo em dia de treino pesado",
    type: 'warning'
  },
  {
    condition: (day, targets) => day.totals.protein_g >= targets.protein_g[0],
    message: "✅ Proteína no alvo",
    type: 'success'
  }
]
```

---

## SEQUÊNCIA DE DESENVOLVIMENTO RECOMENDADA

1. **Setup:** `npx create-next-app@latest`, instala dependências (prisma, anthropic, shadcn, recharts)
2. **Banco:** cria schema Prisma, roda migration
3. **API estimate:** implementa rota + testa com texto simples (sem foto ainda)
4. **Dashboard:** tela principal com mock data, progresso visual
5. **MealLogger:** tela de registro, integra com API estimate
6. **Save + reload:** salva no banco, atualiza dashboard em tempo real
7. **Fechar dia:** botão + lógica de fechamento
8. **Upload foto:** adiciona base64 encoding, testa com foto real
9. **Histórico:** rotas + gráficos Recharts
10. **Polish:** toast notifications, loading states, mobile responsivo

---

## DADOS CONHECIDOS PARA SEED

```typescript
// prisma/seed.ts — alimentos com macros confirmados
const knownFoods = [
  { name: "Rap10 tortilla", kcal_per_100g: 232, protein_g: 7.2, carb_g: 45, fat_g: 2.5, notes: "Porção 40g: 93 kcal P:2.9 C:18 G:1" },
  { name: "Whey scoop padrão 30g", kcal_per_100g: 400, protein_g: 80, carb_g: 6.7, fat_g: 6.7, notes: "Por scoop (30g): 120 kcal P:24 C:2 G:2" },
  { name: "CarboLift palatinose", kcal_per_100g: 387, protein_g: 0, carb_g: 97, fat_g: 0, notes: "Por dose 30g: 116 kcal C:29" },
  { name: "SuperCoffee 3.0", kcal_per_100g: 400, protein_g: 20, carb_g: 10, fat_g: 30, notes: "Por dose 10g: 40 kcal P:2 C:1 G:3" },
  { name: "Iogurte desnatado", kcal_per_100g: 60, protein_g: 10, carb_g: 6, fat_g: 0, notes: "250g: 150 kcal P:25 C:15 G:0" },
  { name: "Yorgus grego integral", kcal_per_100g: 80, protein_g: 6.8, carb_g: 3.6, fat_g: 4.4, notes: "Sem açúcar adicionado" },
]
```

---

## NOTAS PARA O CLAUDE CODE

- Use **TypeScript estrito** em tudo
- Todos os estados de loading com skeleton screens
- Erros da API tratados com try/catch + toast de erro
- Não use localStorage (não funciona no Claude.ai) — use banco de dados
- Componentes do shadcn/ui para inputs, cards, dropdowns, toasts
- Recharts para todos os gráficos
- Datas sempre em formato "YYYY-MM-DD" no banco
- Sempre mostrar confiança da estimativa da IA
- Permitir edição inline dos macros antes de salvar
- O campo `notes` da refeição guarda as flags geradas pela IA

---

## REFERÊNCIA DO SISTEMA ATUAL (chat)

O app replica este fluxo exato do chat:

1. Usuário abre o app de manhã → define tipo de treino do dia
2. Come algo → abre "Registrar refeição" → manda foto ou descreve
3. IA estima macros → usuário confirma ou edita → salva
4. Dashboard atualiza totais + saldo restante + flags
5. Repete ao longo do dia
6. No fim do dia → "Fechar o dia" → registro permanente
7. Histórico + gráficos disponíveis a qualquer momento

**Diferença do chat:** contexto da IA em cada chamada = só perfil + dia atual (não toda a conversa). Histórico fica no banco, não na janela de contexto.
