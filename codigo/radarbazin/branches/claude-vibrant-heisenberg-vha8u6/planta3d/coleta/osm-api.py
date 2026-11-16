#!/usr/bin/env python3
"""Baixa a vizinhança de um shopping pela API oficial do OpenStreetMap (api.openstreetmap.org) e grava
no formato que scripts/osm.mjs lê com --arquivo. Serve quando os servidores Overpass estão fora do ar.

Uso: python3 coleta/osm-api.py <saida.json> <lat> <lon> [raio em metros, padrão 420]
Depois: node scripts/osm.mjs <id> --arquivo <saida.json> --way <id do prédio>"""
import json, math, subprocess, sys
saida, lat, lon = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); R = float(sys.argv[4]) if len(sys.argv) > 4 else 420
dlat = R / 110540; dlon = R / (111320 * math.cos(math.radians(lat)))
url = f'https://api.openstreetmap.org/api/0.6/map.json?bbox={lon - dlon:.6f},{lat - dlat:.6f},{lon + dlon:.6f},{lat + dlat:.6f}'
r = subprocess.run(['curl', '-sS', '-m', '120', '-A', 'planta3d-shoppings/1.0', url], capture_output=True, text=True)
if not r.stdout.lstrip().startswith('{'): sys.exit('A API não respondeu com dados: ' + (r.stdout[:200] or r.stderr[:200]))
els = json.loads(r.stdout)['elements']
N = {e['id']: e for e in els if e['type'] == 'node'}; W = {e['id']: e for e in els if e['type'] == 'way'}
geo = lambda w: [{'lat': N[i]['lat'], 'lon': N[i]['lon']} for i in w.get('nodes', []) if i in N]
def serve(t):
    return ('highway' in t or 'building' in t or t.get('shop') == 'mall' or 'entrance' in t or t.get('amenity') in ('parking_entrance', 'taxi', 'parking')
            or t.get('barrier') == 'lift_gate' or t.get('railway') in ('station', 'subway_entrance') or t.get('public_transport') == 'station')
out = []
for e in els:
    t = e.get('tags') or {}
    if not serve(t): continue
    if e['type'] == 'node': out.append({'type': 'node', 'id': e['id'], 'lat': e['lat'], 'lon': e['lon'], 'tags': t})
    elif e['type'] == 'way':
        g = geo(e)
        if len(g) >= 2: out.append({'type': 'way', 'id': e['id'], 'tags': t, 'geometry': g})
    elif e['type'] == 'relation':
        ms = [{'type': 'way', 'role': m.get('role', ''), 'geometry': geo(W[m['ref']])} for m in e.get('members', []) if m['type'] == 'way' and m['ref'] in W]
        if ms: out.append({'type': 'relation', 'id': e['id'], 'tags': t, 'members': ms})
json.dump({'elements': out}, open(saida, 'w'), ensure_ascii=False)
print(saida, len(out), 'elementos de', len(els))
