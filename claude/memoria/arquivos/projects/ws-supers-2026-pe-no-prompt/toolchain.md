---
title: "toolchain"
date: 2026-09-28
source: "claude-memory"
source_id: "/projects/019dd0b1-c7f8-70b1-b02f-112ab5cf8395/toolchain.md"
description: "Build and QA pipeline for the Zél workshop materials — pptxgenjs, PIL cropping, soffice/pdftoppm review, NotebookLM and CapCut"
tags: ["claude", "memoria", "memoria/projects"]
---
- [stated] PPTX generation uses `pptxgenjs` (Node.js).
- [stated] In the pptxgenjs build, `cardShadow()` must be a factory function rather than a shared constant, to avoid silent shadow mutation bugs across shapes.
- [stated] Image processing uses PIL/Python. The Zél JPEG required `img.crop((0, 0, 832, 1080))` to remove a baked-in caption; output is saved as PNG with a base64 reference.
- [stated] QA pipeline: `node build.js` → `soffice --headless --convert-to pdf` → `pdftoppm -jpeg -r 100` → visual review per slide. 100 DPI balances speed and clarity.
- [stated] Runtime note: the `NODE_PATH=$(npm root -g)` prefix is required for scripts using globally installed npm modules.
- [stated] Video production uses NotebookLM plus CapCut/Canva.
- [stated] Output location: `/mnt/user-data/outputs/`.
