---
title: "radar-bazin-tool"
date: 2026-09-28
source: "claude-memory"
source_id: "/projects/019e2d7d-dc63-728a-bc55-e50063dd1ad1/radar-bazin-tool.md"
description: "RadarBazin.jsx React artifact — daily Bazin calculator features, window.storage constraint, and the Chat vs Claude Cowork split"
tags: ["claude", "memoria", "memoria/projects"]
---
## The tool

- [stated] `RadarBazin.jsx` is a working React component serving as an interactive daily calculator for Bazin-method valuations; it lives as an artifact in Claude Chat and is the primary valuation tool
- [stated] Supports editable current price and 5-year average dividend fields per stock
- [stated] Supports an adjustable minimum DY threshold (default 6%) and a safety margin
- [stated] Calculates fair price, discount %, estimated DY, and a color-coded status (BARATA/JUSTA/CARA) in real time
- [stated] Session persistence via `window.storage`, which is specific to Claude's artifact environment in Chat
- [stated] Mobile-friendly dark theme UI

## Design constraints and tooling decisions (current state)

- [stated] The radar is deliberately built for daily manual input of current prices — an interactive calculator, not a live-updating feed
- [stated] `window.storage` persistence is artifact-environment-specific and won't transfer cleanly to local file contexts
- [stated] Explored migrating the project to Claude Cowork; Claude recommended keeping `RadarBazin.jsx` as a Chat artifact because of the `window.storage` dependency, while using Cowork for execution tasks like generating reports or organizing data
- [stated] Uses Claude Cowork (Desktop app, paid plan) for report generation and data organization tasks
- [stated] Whether and how to migrate tooling to Claude Cowork remains an open question as the platform matures
