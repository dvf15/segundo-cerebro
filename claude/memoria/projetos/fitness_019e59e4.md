---
title: "Memória do projeto: Fitness"
source: "claude-memory"
source_id: "019e59e4-16f8-74ec-9cf9-9cb81fcfb10e"
project: "Fitness"
tags: ["claude", "memoria", "projeto/fitness"]
---
# Memória do projeto: Fitness

**Purpose & context**

Daniel is running a long-term body recomposition program combining Brazilian Jiu-Jitsu (BJJ), structured strength training, and a data-driven nutrition system. The overarching goal is fat loss while preserving skeletal muscle mass (target ≥53–54 kg MME), reducing visceral fat, and sustaining BJJ performance — with a current body weight trajectory targeting the 102–104 kg range. A secondary but integrated focus is cardiovascular health monitoring, informed by periodic lab work, MAPA exams, ergometric testing, and wearable data.

Daniel works with a physician (Dra. Juliana) overseeing pharmacological management and cardiovascular monitoring. An orthopedist (Dr. Fernando) was involved following a recent lower-limb muscle injury. The project operates at the intersection of performance coaching, clinical nutrition, and health analytics, with Claude functioning as a primary analytical and operational partner.

**Current state**

- **Active injury protocol:** Daniel sustained a tennis leg injury (partial high-grade tear of the medial gastrocnemius myotendinous junction with retraction and hematoma). Phase 1 PEACE & LOVE rehabilitation is active. All legs/BJJ/double training tiers are suspended ("SUSPENSO - lesão"). 10 physiotherapy sessions are prescribed. Return-to-sport criteria: 25+ pain-free unilateral calf raises, <10% force asymmetry.
- **NutriTreino JSON (current configuration):** 10–12% caloric deficit; protein fixed at 235–250 g across all tiers distributed across 5 meals including a 40 g pre-sleep dose; sodium ceiling 2,000 mg/day; potassium floor 4,000 mg/day with Na/K ratio alert at 0.60; omega-3 at 3.5–4.0 g/day; collagen/gelatin 15 g + 50 mg vitamin C 60 min before physiotherapy sessions; creatine 5 g/day maintained throughout immobilization; CarboLift and PeptiStrong suspended.
- **Active medications:** Mounjaro (tirzepatide, ongoing) + Vencer (valsartan/BRA, for blood pressure). Note: Zolpidem and Losartan appeared in a prior exam record but do NOT reflect current use.
- **Cardiovascular monitoring:** Twice-daily blood pressure checks active. A 3-day average alert threshold and an immediate-contact threshold are configured in the NutriTreino `monitoramento` block. Weight trend rule: if weekly average loss exceeds 0.25 kg over 14 days, trigger a 150 kcal upward adjustment. Expected fat loss pace during injury phase: 0.12–0.18 kg/week.

**On the horizon**

- Transition from Phase 1 (PEACE) to Phase 2 (LOVE/progressive loading) as injury heals — timing driven by pain-free isometric tolerance and physiotherapy progression.
- Recalibration of NutriTreino tiers and training schedule once legs/BJJ tiers reactivate.
- Return to the body weight target trajectory after injury interruption; original timeline was March 2027.
- Wearable upgrade decision deferred (Garmin CIRQA vs. current Apple Watch setup); recommended path was to await official Garmin Brasil launch for cost-effectiveness.
- High-sensitivity CRP test to be requested at next lab draw (not measured in recent 2026 panel).
- Ongoing monitoring of: HDL trajectory (declining trend flagged), ferritin (persistently elevated across three measurements, requires active medical follow-up), creatinine (gradual upward trend to monitor).

**Key learnings & principles**

- **BIA hydration artifacts:** Significant day-to-day shifts in InBody readings often reflect hydration state rather than real compositional change. Simultaneous apparent muscle loss + fat gain is a hydration signal, not a genuine finding.
- **Deficit pace risk:** Observed caloric deficit has run faster than planned. Carbohydrates are the consistently under-filled macro on training days; protein tends to start low on liquid-dominant breakfast days.
- **Leg session scheduling:** The 48-hour rule between leg training and Saturday BJJ is a non-negotiable structural constraint. Leg sessions placed on Sundays (24 hours post-BJJ) violate this rule and should be on Tuesday/Thursday.
- **CarboLift usage:** Reserved for glycolytic training sessions (weights, BJJ) only — not Zone 2 cardio — to preserve fat oxidation adaptation and given triglyceride considerations.
- **Saturated fat accumulation:** Restaurant days with molho, queijo, burrata, cream cheese, azeite, and braised preparations consistently push saturated fat high. Flagged as a recurring concern relative to lipid profile.
- **Zone 2 priority:** Minimum twice weekly. Primary lever for HDL improvement and HRV targets. Confirmed Zone 2 range ~120–140 bpm (Karvonen-derived; valsartan/BRA does not blunt heart rate response, keeping zones valid).
- **PeptiStrong evidence:** Weak and largely industry-funded; redundant given Daniel's dietary protein load. Documented as expectation calibration.
- **Anti-inflammatory caution:** PEACE framework recommends avoiding NSAIDs; Daniel was instructed not to stop prescribed medication unilaterally but to raise the question with Dr. Fernando.
- **Composition-based targets preferred:** Weight-based target (102–104 kg) is less meaningful than MME preservation; a maintenance calorie block of 8–12 weeks was recommended at a prior phase to protect lean mass.

**Approach & patterns**

- **NutriTreino app** is the operational hub: JSON configuration drives daily caloric and macro targets by training tier (rest, light, strength, legs, BJJ, double). All nutritional decisions are expressed as JSON updates importable via Settings → Profile → Import from Summary.
- **Obsidian vault** is the knowledge management system: all analytical outputs, exam transcriptions, skill files, and comparative notes are formatted with YAML frontmatter, callout blocks, collapsible sections, wikilinks, and dataview-compatible structure. File naming follows a numbered convention (`1-` through `7-` prefixes).
- **Meal logging (Mode A):** Single-conversation daily accumulation. Daniel sends meal photos or descriptions; Claude logs, estimates macros, recalculates remaining targets, and provides next-meal guidance automatically. Confidence scores (X/10) accompany every estimate. Day closes with "fecha o dia." Silent inference defaults are applied (e.g., unstated meat preparation = grilled, no beverage = water).
- **Scientific reference stack:** Peter Attia, Andy Galpin, Andrew Huberman, Stuart McGill, Rhonda Patrick (FoundMyFitness). Claims are expected to be evidence-cited.
- **Communication style:** Brazilian Portuguese throughout. Concise, direct, no moralizing. Mobile-friendly formatting with emoji markers (📸📅🎯📌✏️⚠️). Confidence ratings included. Analytical heavy lifting is expected from Claude with proactive flagging of patterns.
- **Output format:** All health/training documents delivered as Obsidian-formatted markdown. JSON blobs delivered ready to paste into NutriTreino.

**Tools & resources**

- **NutriTreino app** — JSON-configured nutrition and training tracker; accepts profile imports, tier-based macro targets, alert rules, and medication/monitoring blocks.
- **Apple Watch** — ~7 years of historical health data; current primary wearable. BJJ sessions not reliably logged on-wrist (mat constraint).
- **InBody 570** — Bioimpedance device used for body composition tracking across a 10-measurement series (August 2025–August 2026).
- **Obsidian vault** — Health records, training files, lab transcriptions, skill files, and cross-linked notes.
- **Ergometric/MAPA exams** — Fleury lab; used for cardiovascular zone calibration and blood pressure load analysis.
- **Key skill file:** `7-analise-refeicoes-foto.md` — meal photo analysis skill with silent inference table and auto-accumulation behavior.
- **Scientific frameworks in use:** PEACE & LOVE (Dubois & Esculier, BJSM 2020) for injury rehab; Karvonen method for HR zones; Helms et al. 2014 for protein targets; Morton/Phillips for macro calibration; McGill Big 3 for core/prehab.
