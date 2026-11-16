#!/usr/bin/env python3
"""Leva para shoppings/<id>/shopping.json as vendas por shopping divulgadas por empresas listadas.

Uso: python3 coleta/aplicar-vendas.py <pasta com <id>.json> <id> [<id> ...]
Cada <id>.json tem: empresa, ticker, vendas[] (periodo, tipo_periodo, vendas_reais, base, vendas_m2,
vendas_m2_unidade, vendas_m2_publicado, abl_m2, url, trecho), outros_indicadores[], divergencias[],
nao_encontrado[]. Uma cópia fica em coleta/pesquisa/vendas-<id>.json, com os trechos da fonte.

Venda por m², duas medidas lado a lado: "m2_pub" é o número que a fonte publica, na base dela
(a Multiplan, por exemplo, usa só a área das lojas que reportam venda, sem quiosques); "m2" é a
venda dividida pela ABL total do mesmo documento (ou, na falta, da ficha) e pelos meses do período."""
import json, os, re, sys, shutil
pasta, ids = sys.argv[1], sys.argv[2:]
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTAS = json.load(open(os.path.join(RAIZ, 'coleta/vendas-notas.json'), encoding='utf8')) if os.path.exists(os.path.join(RAIZ, 'coleta/vendas-notas.json')) else {}      # nota redigida por shopping, no lugar da automática
MESES = {'ano': 12, '12 meses': 12, 'trimestre': 3, 'mês': 1}
nf = lambda v: f'{v:,.0f}'.replace(',', '.')
def tipo(t):
    t = (t or '').lower()
    return 'ano' if 'ano' in t else '12 meses' if '12' in t else 'trimestre' if 'tri' in t else 'mês' if 'm' in t else t
for ident in ids:
    P = json.load(open(os.path.join(pasta, ident + '.json'), encoding='utf8'))
    os.makedirs(os.path.join(RAIZ, 'coleta/pesquisa'), exist_ok=True); shutil.copy(os.path.join(pasta, ident + '.json'), os.path.join(RAIZ, 'coleta/pesquisa', 'vendas-' + ident + '.json'))
    arq = os.path.join(RAIZ, 'shoppings', ident, 'shopping.json'); txt = open(arq, encoding='utf8').read(); D = json.loads(txt)
    abl_ficha = next((f['valor'] for f in D.get('ficha', []) if f['chave'] == 'abl_m2' and isinstance(f.get('valor'), (int, float))), None)
    V = []; tem_abl_doc = any(x.get('abl_m2') for x in P.get('vendas', []))
    for x in P.get('vendas', []):
        tp = tipo(x.get('tipo_periodo')); v = x.get('vendas_reais'); o = {'periodo': str(x['periodo']), 'tipo_periodo': tp, 'vendas': v, 'fonte': x.get('url')}
        notas = []
        base = x.get('base') or ''
        if base and not base.lower().startswith('100%'): notas.append('Base: ' + base)
        if x.get('vendas_m2') is not None and x.get('vendas_m2_publicado'):       # número da própria fonte, na base dela
            un = (x.get('vendas_m2_unidade') or '').lower(); div = 12 if 'ano' in un else 3 if 'tri' in un else 1
            o['m2_pub'] = round(x['vendas_m2'] / div, 1)
            if div != 1: notas.append(f'A fonte publica R$ {nf(x["vendas_m2"])} por m² no período; a coluna mostra o valor por mês.')
        if v and tp in MESES:                                                      # venda ÷ ABL total ÷ meses, igual para todos os shoppings
            abl = x.get('abl_m2') or (None if tem_abl_doc else abl_ficha)      # sem ABL do período, não calcula (a ABL pode ter mudado)
            if abl:
                o['m2'] = round(v / abl / MESES[tp], 1); o['abl'] = abl; o['abl_origem'] = 'do mesmo documento' if x.get('abl_m2') else 'da ficha deste painel'
        if notas: o['nota'] = ' '.join(notas)
        V.append(o)
    def ordem(o):           # posição no tempo do fim do período: 2025 -> 2026.0, 3T26 -> 2026.75, "12 meses até mar/26" -> 2026.25
        t = o['periodo'].lower(); m = re.search(r'([1-4])t(\d{2})', t)
        if m: return 2000 + int(m.group(2)) + int(m.group(1)) / 4
        m = re.search(r'(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\w*/(\d{2,4})', t)
        if m: return (int(m.group(2)) % 100) + 2000 + (['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'].index(m.group(1)) + 1) / 12
        m = re.search(r'(20\d{2})', t); return int(m.group(1)) + 1 if m else 0
    for o in V: o['ordem'] = round(ordem(o), 2)
    V.sort(key=lambda o: (MESES.get(o['tipo_periodo']) != 12, -o['ordem']))
    emp = P.get('empresa') or ''; tk = P.get('ticker') or ''
    campos = {'vendas': V, 'vendas_empresa': (emp + (f' ({tk})' if tk and tk not in ('-', '—') else '')) if V else None,
              'vendas_nota': None if V else 'Sem venda por shopping em fonte de empresa listada. ' + ' '.join(re.sub(r'\s*\(?https?://\S+?\)?(?=[\s,.;]|$)', '', str(n)).strip().rstrip('.') + '.' for n in P.get('nao_encontrado', []))}
    if V and P.get('divergencias'): campos['vendas_nota'] = 'Divergências: ' + ' '.join(re.sub(r'\s*\(?https?://\S+?\)?(?=[\s,.;]|$)', '', str(n)).strip().rstrip('.') + '.' for n in P['divergencias'])
    if ident in NOTAS: campos['vendas_nota'] = NOTAS[ident]
    for k in ('vendas', 'vendas_empresa', 'vendas_nota'): D.pop(k, None)
    novo = {}
    for k, val in D.items():
        if k == 'niveis':
            for a, b in campos.items():
                if b is not None: novo[a] = b
        novo[k] = val
    s = json.dumps(novo, ensure_ascii=False, indent=2)
    for k in ('centro', 'contorno', 'atrio', 'torre'):
        if isinstance(novo.get(k), list): s = re.sub(r'"%s": \[.*?\n  \]' % k, lambda m: '"%s": %s' % (k, json.dumps(novo[k], separators=(',', ':'))), s, count=1, flags=re.S)
    open(arq, 'w', encoding='utf8').write(s + '\n')
    print(ident, '|', campos['vendas_empresa'], '|', [(o['periodo'], o['tipo_periodo'], o['vendas'], o.get('m2'), o.get('m2_pub')) for o in V], '|', (campos['vendas_nota'] or '')[:200])
