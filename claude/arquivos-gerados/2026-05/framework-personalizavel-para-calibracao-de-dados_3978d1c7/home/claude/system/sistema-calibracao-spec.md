# Sistema de Calibração — Força / Cardio / Longevidade (+ BJJ opcional)

Framework reutilizável de coaching de performance física baseado em literatura peer-reviewed (Attia, Galpin, McGill, Schoenfeld, Morton).
Permite que qualquer pessoa calibre os mesmos princípios para seu próprio perfil, objetivos e disponibilidade — pratique ou não BJJ/esportes de combate.

> **Princípio-mestre.** Os fundamentos são universais (proteína suficiente, força progressiva, Zone 2 + VO2max, sono, McGill Big 3 para coluna). O que muda entre pessoas é dose, volume, ênfase e ordem. O sistema calibra a dose, não inventa princípios.

---

## 1. Para que serve

Três usos possíveis, do menor para o maior compromisso:

1. **Plano único.** A pessoa preenche o formulário e exporta um plano semanal + macros + protocolos. Usa em papel.
2. **Coach AI calibrado.** Copia o *system prompt* gerado e cola em Claude/ChatGPT como instrução de sistema. A partir dali, conversa com o LLM como coach — e o LLM já carrega o perfil, alvos e princípios.
3. **Sistema vivo (avançado).** Quem usa Claude com Projects/Memory pode replicar a estrutura do projeto original: 6 arquivos de princípios + 1 skill de análise de refeição + system prompt. Personaliza substituindo os dados.

---

## 2. Inputs (o que a pessoa precisa saber sobre si)

| Categoria | Campos | Por que importa |
|---|---|---|
| **Perfil** | idade, peso, altura, sexo, % gordura (opc.), nível | Calibra calorias, proteína, intensidade de progressão |
| **Objetivo** | foco principal (BJJ / hipertrofia / longevidade / recomp), fase (cutting / manutenção / bulking) | Define hierarquia entre treinos e direção da nutrição |
| **Modalidades** | toggle BJJ (sim/não); sessões/semana de BJJ, força e cardio | Determina o cenário semanal (S/A/B/C) e onde encaixar volumes |
| **Limitações** | lesões em lombar / joelho / ombro / cervical | Ativa blocos específicos de prehab e flags de risco |

**O que o sistema **não** pergunta** (e por quê):

- Histórico médico detalhado, exames laboratoriais, medicação → não é função do sistema; recomendar médico do esporte.
- Preferências alimentares (low-carb, jejum, etc.) → o sistema assume os princípios (BJJ é glicolítico, proteína distribuída). Não negocia isso.
- Suplementos → tratados separadamente; o ponto de partida é comida.

---

## 3. Outputs (o que o sistema entrega)

### 3.1 Diagnóstico

- **Cenário semanal:** S (sem BJJ — foco força + cardio), A (BJJ 4-5x), B (BJJ 2-3x) ou C (mínimo viável com BJJ).
  - Lógica: `!practicesBJJ → S`, `bjjDays >= 4 → A`, `bjjDays >= 2 → B`, senão `C`.
- **Manutenção calórica:** `peso × fator`, onde fator = 28 (até 1 sessão), 30 (2-3), 32 (4-5), 34 (6+).
- **Meta calórica:**
  - Cutting: `manutenção - 500` a `manutenção - 300`
  - Manutenção: `manutenção ± 100`
  - Bulking: `manutenção + 200` a `manutenção + 400`

### 3.2 Macros

| Macro | Faixa | Fonte |
|---|---|---|
| Proteína (geral) | 1.6–2.2 g/kg | Morton et al., *Br J Sports Med* 2018 |
| Proteína (cutting) | 2.0–2.4 g/kg | Helms et al., *Int J Sport Nutr Exerc Metab* 2014 |
| Proteína (50+) | piso elevado a 2.0 g/kg | Phillips et al., *Front Nutr* 2016 |
| Carbo · dia treino duro | 3–6 g/kg | Burke et al., *J Sports Sci* 2011 |
| Carbo · dia leve | 2–4 g/kg | idem |
| Gordura | 0.8–1.2 g/kg | mínimo para função hormonal saudável |

### 3.3 Semana sugerida

Templates pré-construídos por cenário. Regras de empilhamento:

- Nunca força pesada de pernas no dia anterior a competição/seletivo BJJ (Tendões + SNC precisam 48–72h).
- Rolamento duro = HIIT. Não somar VO2max no dia seguinte.
- Não empilhar VO2max + BJJ duro + força pesada em 24h (interferência — Wilson et al., *J Strength Cond Res* 2012).
- Sem BJJ: separar VO2max de força pesada por ≥24h; Zone 2 pode coexistir com força.
- Deload a cada 4–6 semanas (volume −40–50%).

### 3.4 Prehab

- **Base universal:** McGill Big 3 (curl-up, side plank, bird-dog) diário + CARs (pescoço/ombro/quadril).
- **Camadas adicionais por lesão reportada:**
  - Lombar → McGill rigoroso, dead bug, hinge bem ensinado, evitar flexão sob carga.
  - Joelho → ATG split squat, tibialis raises, nordic curl, step-down lento.
  - Ombro → scapular pull-up/dip, sleeper stretch, band pull-aparts, dead hang.
  - Cervical → isometrias 4 direções, evitar wrestler's bridge sem base, trapézio.
- **Se pratica BJJ:** pescoço isométrico, dead hang, trabalho de dedos sempre.
- **Se não pratica:** dead hang + carry pesado + mobilidade de tornozelo/quadril como base de manutenção.

### 3.5 Sinais de alerta personalizados

Combinações que o sistema sinaliza automaticamente:

| Condição | Risco | Ação |
|---|---|---|
| 45+ anos + cutting + BJJ 4+ + força 2+ | RED-S (Mountjoy 2018) | deficit suave, proteína no topo, monitorar libido/sono/FC |
| ≥7 sessões/sem | Recuperação como gargalo | 1 dia off completo, cortar cardio primeiro |
| BJJ pesado + cardio + cutting empilhados | Interferência + queda de performance | cortar VO2max em fases de cutting |
| Bulk + objetivo longevidade | Conflito de metas | surplus modesto (+200), não bulk agressivo |
| 50+ com força <2x/sem | Sarcopenia (Volpi 2004) | mínimo 2x/sem força progressiva |
| 0 BJJ mas objetivo BJJ | Falta de especificidade | mínimo 2x/sem BJJ |
| BJJ desligado mas objetivo BJJ | Conflito de metas | reativar BJJ ou trocar objetivo |
| Lombar + força ≥2x | Risco em hinge mal feito | validar técnica, ou trocar por KB swing/hip thrust |
| 40+ sem cardio | VO2max baixo prediz mortalidade (Mandsager 2018) | mínimo 1x Zone 2 + 1x VO2max |
| Iniciante + ≥6 sessões | Overtraining/lesão | reduzir para 3–4 sessões |
| Sem BJJ + força <2 + cardio <1 | Volume insuficiente p/ qualquer adaptação | mínimo 2x força + 1x cardio |

### 3.6 Cardápio sugerido (NOVO)

Dois dias-exemplo gerados dinamicamente a partir do peso, meta calórica e fase nutricional do usuário:

- **Dia treino** — 4 refeições, mais carboidratos (R3 funciona como pré ou pós-treino com whey + carbo rápido).
- **Dia leve / descanso** — 4 refeições, menos carboidratos, mais gordura e proteína proporcionalmente.

**Como o sistema escala:**

1. Calcula a meta calórica do usuário (calLow / calHigh dependendo do dia).
2. Compara com um template base (3200 kcal dia treino, 2600 kcal dia leve para referência de 80 kg).
3. Aplica `scale = meta / referência` em todas as gramaturas, arredondando para múltiplos de 5g (ou unidades inteiras para ovos/frutas).
4. Aplica ajuste adicional de carboidratos por fase (–15% em cutting, +10% em bulking).

**Estrutura padrão (dia treino):**

- R1 · Café: aveia + leite + banana + ovos + pasta de amendoim.
- R2 · Almoço: proteína magra grelhada + arroz/feijão + salada + azeite.
- R3 · Pré/pós-treino: whey + banana + aveia/tapioca + castanhas.
- R4 · Jantar: peixe ou frango + batata doce + vegetais verdes + azeite.

**Estrutura padrão (dia leve):**

- R1 · Café: ovos + pão integral + abacate + iogurte grego.
- R2 · Almoço: proteína magra + arroz reduzido + salada generosa + azeite.
- R3 · Lanche: iogurte grego + castanhas + fruta.
- R4 · Jantar: peixe ou omelete + vegetais + porção menor de carbo + azeite.

**Substituições válidas (sem recalcular):**

- Proteína: frango ↔ peixe ↔ carne magra ↔ ovos ↔ tofu (vegetal — ajustar volume).
- Carbo: arroz ↔ batata doce ↔ mandioca ↔ quinoa ↔ aveia.
- Laticínio: iogurte grego ↔ queijo cottage ↔ skyr.
- Gordura boa: pasta de amendoim ↔ castanhas ↔ abacate ↔ azeite.

**Limitação importante:** macros mostrados são estimativas com erro de ±15%. O cardápio é ponto de partida, não prescrição. Para precisão real, pesar comida 1–2 semanas para calibrar percepção e ajustar.

### 3.7 System prompt copiável

Texto gerado dinamicamente com:
- Princípios do framework (referencial científico, o que NÃO usar)
- Perfil do usuário
- Objetivo ativo e fase nutricional
- Alvos calibrados (calorias, proteína, carbo, gordura)
- Cenário semanal
- Regras de resposta (objetivo, fonte citada, confiança 1–10)

Esse prompt funciona em qualquer LLM bom como instrução de sistema.

---

## 4. O que o sistema **NÃO** faz

- Não diagnostica. Sintomas, dor persistente, exames fora da faixa → médico.
- Não substitui treinador presencial para técnica (especialmente hinge, agachamento, BJJ).
- Não escolhe entre objetivos conflitantes — apresenta o trade-off e a pessoa decide.
- Não usa Gary Brecka, biohacks de marketing, suplementos sem evidência, jejum prolongado para atleta de combate.
- Não calcula com precisão milimétrica. Análise visual de refeição erra 20–40% (Hochsmann 2019). O sistema é bússola, não GPS.

---

## 5. Como portar o sistema para outras stacks

| Plataforma | Como portar |
|---|---|
| **Claude com Projects** | Criar projeto, subir os 6 arquivos `.md` de princípios (treino, força, cardio, mobilidade, nutrição, sono), o system prompt gerado e — opcional — a skill de análise de refeição. |
| **ChatGPT com Custom GPT** | Colar o system prompt na "Instructions", subir os 6 arquivos como Knowledge. |
| **Notion** | Cada arquivo de princípio vira uma página. Database de treinos semanais + log de macros. |
| **Planilha** | Aba de inputs (perfil) + aba de outputs (macros, semana) com fórmulas refletindo as regras das seções 3.1–3.2. |
| **Papel** | Imprime o output do artifact, vive 4–6 semanas com ele, reavalia. |

---

## 6. Cadência de reavaliação

- **Semanal:** ajustar carga de força e BJJ por sensação + métricas (HRV, sono, FC repouso).
- **A cada 4–6 semanas:** deload (volume −40–50%) e reavaliação dos alvos.
- **A cada 12 semanas:** recompor bloco — possivelmente trocar de cenário ou de fase nutricional.
- **A cada 6–12 meses:** exames de sangue (lipídico, glicêmico, vit D, hormônios) com médico do esporte.

---

## 7. Limitações honestas

- **Calorias estimadas por peso × fator** têm erro real de ±10–15%. Para precisão, indireta calorimetria (cara) ou Tdee tracking de 2–3 semanas com peso estável.
- **Templates semanais são genéricos.** Quem trabalha por turnos, tem filhos pequenos ou viaja muito precisa adaptar livremente.
- **Lesão atual ≠ histórico de lesão.** O sistema trata o input como "área sensível", não diagnostica.
- **% gordura por bioimpedância** tem erro de ±3–5 pontos. Use tendência, não valor isolado.

---

## 8. Fontes principais

- Attia, P. *Outlive: The Science and Art of Longevity* (2023).
- Morton, R.W. et al. "Protein supplementation on resistance training." *Br J Sports Med* (2018).
- Helms, E. et al. "Protein during caloric restriction in lean athletes." *Int J Sport Nutr Exerc Metab* (2014).
- Schoenfeld, B.J. et al. "Dose-response: resistance training volume." *Sports Med* (2017).
- Helgerud, J. et al. "Aerobic high-intensity intervals (Norwegian 4×4)." *MSSE* (2007).
- McGill, S. *Back Mechanic / Ultimate Back Fitness* (livros).
- Wilson, J.M. et al. "Concurrent training interference effect." *J Strength Cond Res* (2012).
- Mountjoy, M. et al. "RED-S consensus statement." *Br J Sports Med* (2018).
- Mandsager, K. et al. "Cardiorespiratory fitness and mortality." *JAMA Netw Open* (2018).
- Meeusen, R. et al. "Overtraining syndrome consensus." *MSSE* (2013).

---

**Confiança no framework: 8/10.** Os princípios são robustos. As fórmulas de calibração (calorias, macros) são aproximações úteis, não exatas — esperar erro de ±10–15% no TDEE e ajustar pela resposta real do corpo (peso, performance, sono).

Não é aconselhamento médico.
