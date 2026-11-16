#!/usr/bin/env python3
"""Monta varejistas.json a partir da pesquisa de empresas listadas (um <TICKER>.json por empresa).

Uso: python3 coleta/aplicar-varejistas.py <pasta com os <TICKER>.json>
Cada arquivo tem: empresa, ticker, bolsa, situacao, marcas[] (marca, nomes_no_arquivo[], url, trecho),
indicadores[] (indicador, periodo, valor, unidade, escopo, publicado, url, trecho), divergencias[],
nao_encontrado[]. As cópias ficam em coleta/pesquisa/varejo-<TICKER>.json, com os trechos da fonte.

Para cada empresa o painel mostra um número por indicador: o do período mais recente de 12 meses,
de preferência o consolidado. "conf": false marca número que veio só do resumo do buscador,
sem o trecho literal da fonte; a página mostra "a conferir". Venda por m²: usa a publicada; se não houver e existirem receita e
área de vendas do mesmo período, divide uma pela outra e marca "calculado", com o escopo no texto."""
import json, os, re, sys, glob, shutil, unicodedata
pasta = sys.argv[1]; RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
deacc = lambda s: ''.join(c for c in unicodedata.normalize('NFD', str(s)) if unicodedata.category(c) != 'Mn').lower()
def ordem(p):
    t = deacc(p); m = re.search(r'([1-4])t(\d{2})', t)
    if m: return 2000 + int(m.group(2)) + int(m.group(1)) / 4
    m = re.search(r'(\d)m(\d{2})\b', t)
    if m: return 2000 + int(m.group(2)) + int(m.group(1)) / 12
    m = re.search(r'(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\w*/(\d{2,4})', t)
    if m: return int(m.group(2)) % 100 + 2000 + (['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'].index(m.group(1)) + 1) / 12
    m = re.search(r'(20\d{2})', t); return int(m.group(1)) + 1 if m else 0
anual = lambda p: bool(re.fullmatch(r'\s*(fy\s*)?20\d{2}(/\d{2,4})?\s*', deacc(p))) or '12 meses' in deacc(p) or 'ano fiscal' in deacc(p) or 'fy' in deacc(p)
def escolhe(L, pref_anual=True):      # mais recente; ano fechado antes de trimestre; consolidado antes de recorte
    def chave(x):
        e = deacc(x.get('escopo') or '')
        return ((anual(x['periodo']) if pref_anual else True), ('consolid' in e or 'companhia' in e or 'total' in e or e == ''), ordem(x['periodo']))
    return sorted(L, key=chave, reverse=True)[0] if L else None
moeda = lambda u: 'US$' if 'us$' in deacc(u) or 'usd' in deacc(u) else 'EUR' if 'eur' in deacc(u) or '€' in u else 'SEK' if 'sek' in deacc(u) else 'DKK' if 'dkk' in deacc(u) else 'HK$' if 'hk' in deacc(u) else 'R$' if 'r$' in deacc(u) or 'brl' in deacc(u) else u
FORA = {'ALLD3.json'}      # Allied: a pesquisa não confirmou quais lojas Samsung do painel ela opera
empresas = []; usados = set()
def prioridade(arq):       # B3 listada primeiro, depois listada no exterior, depois quem fechou capital mas ainda divulga
    P = json.load(open(arq, encoding='utf8')); sit = deacc(P.get('situacao') or '')
    return (0 if sit.startswith('listada') and deacc(P.get('bolsa') or '') == 'b3' else 1 if sit.startswith('listada') else 2, os.path.basename(arq))
for arq in sorted(glob.glob(os.path.join(pasta, '*.json')), key=prioridade):
    P = json.load(open(arq, encoding='utf8'))
    if not P.get('marcas') or os.path.basename(arq) in FORA: continue
    if not deacc(P.get('situacao') or '').startswith('listada') and not P.get('indicadores'): continue      # não listada e sem números públicos: fica fora
    os.makedirs(os.path.join(RAIZ, 'coleta/pesquisa'), exist_ok=True); shutil.copy(arq, os.path.join(RAIZ, 'coleta/pesquisa', 'varejo-' + os.path.basename(arq)))
    I = [x for x in P.get('indicadores', []) if isinstance(x.get('valor'), (int, float))]
    tipo = lambda x: deacc(x.get('indicador') or '')
    def cons(x): e = deacc(x.get('escopo') or ''); return 'consolid' in e or 'companhia' in e or 'total' in e or e == ''
    R = [x for x in I if tipo(x).startswith(('receita_liquida', 'receita_bruta', 'vendas_totais'))]      # ano fechado > consolidado > líquida > mais recente
    rec = sorted(R, key=lambda x: (anual(x['periodo']), cons(x), tipo(x).startswith('receita_liquida'), ordem(x['periodo'])), reverse=True)[0] if R else None; rl = rec if rec and tipo(rec).startswith('receita_liquida') else None
    conf = lambda x: not re.match(r'\s*\[(resumo|trecho obtido via resumo)', str(x.get('trecho') or '[resumo'), re.I)      # trecho literal da fonte, e não resumo do buscador
    num = lambda x, **k: dict({'valor': x['valor'], 'periodo': re.sub(r'\s*\(.*?\)', '', str(x['periodo'])).strip(), 'recorte': None if cons(x) else x.get('escopo'), 'escopo': x.get('escopo'), 'fonte': x.get('url'), 'conf': conf(x)}, **k)
    lojas = escolhe([x for x in I if tipo(x).startswith('lojas')], False); area = escolhe([x for x in I if tipo(x).startswith('area_vendas')], False)
    vm = escolhe([x for x in I if tipo(x).startswith('venda_m2') and x.get('publicado')]); sss = escolhe([x for x in I if tipo(x).startswith('sss')], False)
    c = {'empresa': re.sub(r',?\s+(S\.?\s?A\.?|Inc\.?|AG|SE|AB|A/S|Holdings)(?=\s|$|,)', '', re.sub(r'\s*\(.*?\)', '', P['empresa'])).strip(' ,.'), 'ticker': re.sub(r'\s*\(.*?\)', '', str(P.get('ticker') or '')).strip(), 'bolsa': P.get('bolsa'), 'situacao': P.get('situacao'),
         'marcas': [{'marca': re.sub(r'\s*\(.*?\)', '', m['marca']).strip(), 'nomes': m.get('nomes_no_arquivo') or [], 'fonte': m.get('url')} for m in P['marcas'] if m.get('nomes_no_arquivo')]}
    for m in c['marcas']: m['nomes'] = [n for n in m['nomes'] if n.upper() not in usados]      # uma loja pertence a uma empresa só: vale a de maior prioridade
    c['marcas'] = [m for m in c['marcas'] if m['nomes']]
    if not c['marcas']: continue
    usados.update(n.upper() for m in c['marcas'] for n in m['nomes'])
    if rec: c['receita'] = num(rec, moeda=moeda(rec.get('unidade') or 'R$'), rotulo=('Receita líquida' if rec is rl else 'Receita bruta' if tipo(rec).startswith('receita_bruta') else 'Vendas totais') + (', ' + rec['escopo'] if rec.get('escopo') and not re.search(r'consolid|companhia', deacc(rec['escopo'])) else ''))
    if lojas: c['lojas'] = num(lojas)
    if area: c['area'] = num(area)
    if vm: c['venda_m2'] = num(vm, unidade=vm.get('unidade') or 'R$/m²', origem='publicado')
    elif rec and c['receita']['moeda'] == 'R$' and anual(rec['periodo']):
        a2 = next((x for x in I if tipo(x).startswith('area_vendas') and str(x['periodo']) == str(rec['periodo']) and x['valor'] > 0), None)
        if a2: c['venda_m2'] = {'valor': round(rec['valor'] / a2['valor'] / 12, 1), 'unidade': 'R$/m²/mês', 'periodo': str(rec['periodo']), 'origem': 'calculado', 'fonte': a2.get('url'), 'conf': conf(rec) and conf(a2),
                               'escopo': f"{c['receita']['rotulo'].lower()} ÷ área de vendas de {a2['valor']:,.0f} m² ({a2.get('escopo') or 'sem escopo informado'}) ÷ 12".replace(',', '.')}
    if sss: c['sss'] = num(sss)
    empresas.append(c)
json.dump({'lido_em': '14/11/2026', 'empresas': empresas}, open(os.path.join(RAIZ, 'varejistas.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
for c in empresas: print(c['ticker'], '|', c['empresa'], '|', [m['marca'] for m in c['marcas']], '|', (c.get('receita') or {}).get('valor'), (c.get('receita') or {}).get('periodo'), '| lojas', (c.get('lojas') or {}).get('valor'), '| m2', (c.get('venda_m2') or {}).get('valor'), (c.get('venda_m2') or {}).get('origem'))
