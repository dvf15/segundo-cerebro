#!/usr/bin/env python3
"""Monta o arquivo que scripts/osm.mjs lê com --arquivo quando o prédio do shopping não é um único
elemento no OpenStreetMap (caso do NorteShopping, mapeado em vários blocos) ou quando o contorno
veio da API do OpenStreetMap e o entorno do Overpass.

Uso: python3 coleta/juntar-osm.py <saida.json> <contorno.json> [entorno1.json entorno2.json ...]
  contorno.json: {"ring": [[lat, lon], ...], "nome": "...", "ids_partes": [ids dos blocos unidos]}
  entorno*.json: respostas do Overpass (out geom tags) da vizinhança."""
import json, sys
saida, cont, *ctx = sys.argv[1:]
C = json.load(open(cont)); partes = set(C.get('ids_partes', []))
els = [{'type': 'way', 'id': 1, 'tags': {'building': 'retail', 'name': C.get('nome', '')}, 'geometry': [{'lat': a, 'lon': b} for a, b in C['ring']]}]
vistos = set()
for f in ctx:
    for e in json.load(open(f)).get('elements', []):
        k = (e['type'], e['id'])
        if k in vistos or e['id'] in partes: continue
        vistos.add(k)
        if e.get('tags', {}).get('shop') == 'mall' and 'building' not in e.get('tags', {}): continue      # terreno do shopping, não prédio
        els.append(e)
json.dump({'elements': els}, open(saida, 'w'), ensure_ascii=False)
print(saida, len(els), 'elementos')
