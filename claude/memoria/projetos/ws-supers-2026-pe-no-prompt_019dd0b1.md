---
title: "Memória do projeto: WS Supers 2026 - Pé no prompt"
source: "claude-memory"
source_id: "019dd0b1-c7f8-70b1-b02f-112ab5cf8395"
project: "WS Supers 2026 - Pé no prompt"
tags: ["claude", "memoria", "projeto/ws-supers-2026-pe-no-prompt"]
---
# Memória do projeto: WS Supers 2026 - Pé no prompt

**Purpose & context**

Daniel is building an internal workshop for shopping mall superintendents that introduces AI tools to commercial teams while simultaneously developing a practical AI agent called **"Zél"** — a commercial prospecting agent designed to identify, qualify, and initiate contact with potential tenants within a defined radius of a mall.

Zél is conceptually framed as a fusion of two real-world figures:
- **Sam Zell** (American investor, *Am I Being Too Subtle?*) → contributes mindset/mentalidade (system prompt context)
- **Zé Roberto Levy** (shopping mall commercial executive) → contributes execution/execução (agent operational skills)

Levy's 12 *mandamentos* cover Brazilian shopping mall field prospecting practices: monitoring competitor malls, tracking expansion signals, leveraging multi-brand/multi-franchisee operators, maintaining a cadence of prospecting meetings, etc.

The workshop blends conceptual framing with hands-on group dynamics and live AI testing (Claude.ai), targeting a practical, informal tone with a caricature mascot (Zél) appearing throughout materials.

---

**Current state**

Three deliverables have been completed for the workshop:

1. **PowerPoint deck (14 slides)** — Corporate sober style (light background, charcoal + amber/copper palette, Georgia/Calibri typography). Includes: Zél DNA slide, Zell + Levy principle slides, logic slide (how each maps to agent design), 60-minute group dynamic (3 timed stages: context building → skill design → live Claude.ai testing), blank worksheet template, worked example using Levy mandamento #4, and closing quote. The Zél JPEG mascot appears as a corner image across slides (required PIL cropping to remove baked-in caption).

2. **Video opening (90 seconds)** — Produced for NotebookLM. Includes timed narration script, scene-by-scene storyboard, color/typography specs matching the PPT, audio/SFX direction, and CapCut/Canva assembly instructions.

3. **Hunter Agent specification** — Covers mission, system prompt with Sam Zell principles, six operational skills, scoring rubric, approach scripts, and ecosystem integration.

---

**Key learnings & principles**

- The dual-parent framing (Zell = mindset → prompt; Levy = execution → skills) is a core pedagogical device that makes the agent's design logic legible to non-technical audiences.
- Workshop tone is deliberately **informal** to match the audience and encourage participation.
- Iterative PDF-to-image QA was essential for catching visual defects (overlapping text, clipped elements, card overflow, image proportion issues).

---

**Tools & resources**

- **PPTX generation**: `pptxgenjs` (Node.js) — `cardShadow()` must be a factory function (not a shared constant) to avoid silent shadow mutation bugs across shapes
- **Image processing**: PIL/Python — Zél JPEG required `img.crop((0, 0, 832, 1080))` to remove baked-in caption; output saved as PNG with base64 reference
- **QA pipeline**: `node build.js` → `soffice --headless --convert-to pdf` → `pdftoppm -jpeg -r 100` → visual review per slide (100 DPI balances speed and clarity)
- **Runtime note**: `NODE_PATH=$(npm root -g)` prefix required for scripts using globally installed npm modules
- **Video production**: NotebookLM + CapCut/Canva
- **Output location**: `/mnt/user-data/outputs/`
