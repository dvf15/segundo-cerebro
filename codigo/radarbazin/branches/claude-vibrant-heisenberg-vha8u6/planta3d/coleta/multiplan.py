#!/usr/bin/env python3
"""Lê o diretório público de um shopping da Multiplan e grava shoppings/<id>/lojas.json.

Os sites da Multiplan (diamondmall.com.br, shoppinganaliafranco.com.br, parkshoppingsaocaetano.com.br...)
listam cada operação no sitemap.xml, e a página de cada uma traz piso, LUC, categorias e situação.

Uso:  python3 coleta/multiplan.py <id> <dominio> <pasta de cache> [--so-baixar]
  ex.: python3 coleta/multiplan.py diamondmall www.diamondmall.com.br /tmp/cache-dm
A pasta de cache guarda as páginas baixadas; rodar de novo só baixa o que falta.
O mapa de pisos (nome no site -> id do nível) fica em coleta/multiplan-pisos.json.

O site publica nome, categorias, piso, LUC e situação. Não publica área nem tipo de operação:
- tipo sai do LUC (Q... = quiosque; P + sigla do piso também, por coincidir com os quiosques que o site nomeia),
  da seção do site (gastronomia) e da categoria;
- a área é só a referência de desenho por tipo (config.json) x nº de LUCs. Não é medida."""
import re, sys, json, html, os, time, subprocess, unicodedata
from collections import Counter

ident, dominio, cache = sys.argv[1:4]; so_baixar = '--so-baixar' in sys.argv
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'
deacc = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
os.makedirs(cache, exist_ok=True)

def baixar(url, arq):
    p = os.path.join(cache, arq)
    if not (os.path.exists(p) and os.path.getsize(p) > 2000):
        for t in range(3):
            r = subprocess.run(['curl', '-sS', '-L', '-m', '40', '-A', UA, '-o', p, '-w', '%{http_code}', url], capture_output=True, text=True)
            if r.stdout.strip() == '200': break
            time.sleep(2 + 3 * t)
        time.sleep(.35)
    return open(p, encoding='utf8', errors='replace').read() if os.path.exists(p) else ''

mapa = baixar(f'https://{dominio}/sitemap.xml', 'sitemap.xml')
urls = [u for u in re.findall(r'<loc>([^<]+)</loc>', mapa) if re.search(r'/(lojas|gastronomia)/[^/]+/?$', u)]
brutos = []
for i, u in enumerate(sorted(set(urls))):
    sec, slug = re.search(r'/(lojas|gastronomia)/([^/]+)/?$', u).groups()
    s = baixar(u, f'{sec}__{slug}.html')
    m = re.search(r'<div id="store_detail_[0-9a-f-]{36}"[^>]*?data-props="(.*?)"', s, re.S)
    if not m: print('sem dados:', u); continue
    j = json.loads(html.unescape(m.group(1)))
    brutos.append({'sec': sec, 'slug': f'{sec}/{slug}', 'nome': j.get('displayName') or '', 'status': j.get('status'), 'abre': j.get('openedAt'),
                   'cats': [c.get('displayName') or c.get('name') for c in j.get('categories', [])],
                   'lucs': [{'luc': l.get('name'), 'piso': (l.get('floor') or {}).get('name')} for l in j.get('lucs', [])]})
    if i % 50 == 0: print(i, 'de', len(urls), flush=True)
json.dump(brutos, open(os.path.join(cache, 'brutos.json'), 'w'), ensure_ascii=False)
print(len(brutos), 'operações lidas |', 'pisos:', dict(Counter(l['piso'] for b in brutos for l in b['lucs'])), '| sem LUC:', sum(not b['lucs'] for b in brutos),
      '| situação:', dict(Counter(b['status'] for b in brutos)), '| categorias nível 1:', dict(Counter((b['cats'] or ['—'])[0].split(' > ')[0] for b in brutos)))
if so_baixar: sys.exit(0)

PISOS = json.load(open(os.path.join(RAIZ, 'coleta/multiplan-pisos.json'), encoding='utf8'))[ident]
BENCH = json.load(open(os.path.join(RAIZ, 'config.json'), encoding='utf8'))['area_referencia_m2']
lojas = []
for b in brutos:
    cat = ' · '.join(b['cats']) or 'Não informado'; c = deacc(cat).lower(); lucs = [l['luc'] for l in b['lucs'] if l['luc']]; pisos = list(dict.fromkeys(l['piso'] for l in b['lucs'] if l['piso']))
    quiosque = any(re.match(r'(?i)^Q', l) for l in lucs) or 'quiosque' in deacc(b['nome']).lower() or 'quiosque' in c
    cod_p = any(re.match(r'^P(?!SUB)[A-Z]{2,3}[-\s]?\d', l.upper()) for l in lucs)      # PTL12, POQ09, PSC20...: mesmo padrão dos quiosques que o site nomeia
    if quiosque: tipo, tf = 'Quiosque', 'oficial (código de quiosque no site)' if any(re.match(r'(?i)^Q', l) for l in lucs) else 'oficial (nome ou categoria no site)'
    elif cod_p: tipo, tf = 'Quiosque', 'inferido pelo código (iniciado em P, como os quiosques que o site identifica pelo nome)'
    elif re.search(r'ancora|departamento|hipermercado|supermercado', c): tipo, tf = 'Âncora', 'inferido pela categoria do site'
    elif re.search(r'megaloja', c): tipo, tf = 'Megaloja', 'inferido pela categoria do site'
    elif re.search(r'cinema|teatro|\blazer\b|entretenimento|diversao|diversoes', c): tipo, tf = 'Lazer', 'inferido pela categoria do site'
    elif re.search(r'restaurante', c): tipo, tf = 'Restaurante', 'inferido pela categoria do site'
    elif b['sec'] == 'gastronomia' or re.search(r'alimenta|fast.?food|cafe|doceria|sorvet', c): tipo, tf = 'Alimentação', 'oficial (seção de gastronomia do site)' if b['sec'] == 'gastronomia' else 'inferido pela categoria do site'
    elif re.search(r'servico|banco|cambio|loteri|correio|lavanderia|medic|clinica|academia', c): tipo, tf = 'Serviço', 'inferido pela categoria do site'
    else: tipo, tf = 'Loja', 'inferido pela categoria do site'
    nv = next((PISOS[p] for p in pisos if p in PISOS), None)
    n = max(1, sum(len([c for c in re.split(r'[/_]', l) if re.search(r'\d', c)]) or 1 for l in lucs)); area = BENCH[tipo] * (n if tipo in ('Loja', 'Alimentação', 'Restaurante', 'Serviço') else 1)
    st = deacc(str(b['status'] or '')).lower()
    l = {'nome': b['nome'].upper(), 'slug': b['slug'], 'categoria': cat, 'piso_oficial': ' e '.join(pisos) or 'Não informado', 'nivel': nv or PISOS['_sem_piso'],
         'tipo': tipo, 'tipo_fonte': tf, 'status': 'Em operação' if st in ('working', '') else 'Em obras' if re.search(r'construc|obra|reform', st) else 'Em breve',
         'luc': ' / '.join(lucs) or None, 'luc_nota': None if lucs else 'sem código no site', 'n_luc': n, 'area_est': area,
         'faixa': 'referência de desenho por tipo de operação' + (f' × {n} unidades' if area != BENCH[tipo] else '') + '; o site não publica área',
         'piso_fonte': 'oficial' if nv else 'sem piso no site; desenhada em ' + PISOS['_sem_piso']}
    if b['sec'] == 'gastronomia': l['grupo'] = 'Alimentação'
    lojas.append(l)
os.makedirs(os.path.join(RAIZ, 'shoppings', ident), exist_ok=True)
with open(os.path.join(RAIZ, 'shoppings', ident, 'lojas.json'), 'w', encoding='utf8') as f:
    f.write('[\n' + ',\n'.join(json.dumps(l, ensure_ascii=False) for l in lojas) + '\n]\n')
print(ident, len(lojas), 'operações |', dict(Counter(l['nivel'] for l in lojas)), '|', dict(Counter(l['tipo'] for l in lojas)), '|', dict(Counter(l['status'] for l in lojas)),
      '| sem piso:', [l['nome'] for l in lojas if l['piso_fonte'] != 'oficial'])
