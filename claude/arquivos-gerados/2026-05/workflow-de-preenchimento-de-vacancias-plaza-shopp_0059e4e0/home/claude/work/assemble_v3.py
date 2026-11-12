"""Monta ShoppingOS_Console_v3.html a partir dos arquivos parciais."""
import json, os
import sys
sys.path.insert(0, "/home/claude/work")
from databases_schema import DATABASES, AGENTS
from categories import AGENT_CATEGORIES, CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS

# Aplicar categoria nos agentes
for a in AGENTS:
    a["category"] = AGENT_CATEGORIES.get(a["id"], "Comercial")

categories_meta = {"list": CATEGORIES, "icons": CATEGORY_ICONS, "colors": CATEGORY_COLORS}

# Carregar partes
with open("/home/claude/work/console_v3.css") as f: css = f.read()
with open("/home/claude/work/console_v3_body.html") as f: body = f.read()
with open("/home/claude/work/console_v3_js1.js") as f: js1 = f.read()
with open("/home/claude/work/console_v3_js2.js") as f: js2 = f.read()

# Schema JSON
databases_json = json.dumps(DATABASES, ensure_ascii=False)
agents_json = json.dumps(AGENTS, ensure_ascii=False)
categories_json = json.dumps(categories_meta, ensure_ascii=False)

# Montar HTML completo
html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shopping.OS · Console v3</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=JetBrains+Mono:wght@400;500;700&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
{body}
<script>
const DATABASES = {databases_json};
const AGENTS = {agents_json};
const CATEGORIES_META = {categories_json};

{js1}

{js2}
</script>
</body>
</html>
'''

out = "/mnt/user-data/outputs/ShoppingOS_Console_v3.html"
with open(out, "w", encoding="utf-8") as f:
    f.write(html)
print(f"OK: {out}")
print(f"Tamanho: {os.path.getsize(out)/1024:.1f} KB")
