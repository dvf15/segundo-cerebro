#!/usr/bin/env python3
"""Leva para shoppings/<id>/shopping.json o resultado de uma pesquisa de fontes públicas.

Uso: python3 coleta/aplicar-pesquisa.py <pasta com <id>.json> <id> [<id> ...] [--papel "meu shopping"]
Cada <id>.json tem: nome, administradora, endereco, ficha[], pisos[], arquitetura[], conexoes[],
divergencias[], nao_encontrado[]; todo item traz "url" (fonte) e "trecho" (frase da fonte).
O arquivo fica guardado em coleta/pesquisa/<id>.json, com os trechos, para conferência.

O script troca: ficha pesquisada, itens de projeto e pisos (na ficha), conexoes, e as notas de
divergência e de dado não encontrado (no método). Não mexe em contorno, niveis, lojas nem kpis."""
import json, os, re, sys, shutil
args = sys.argv[1:]; papel = None
if '--papel' in args: i = args.index('--papel'); papel = args[i + 1]; del args[i:i + 2]
pasta, ids = args[0], args[1:]
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dom = lambda u: re.sub(r'^https?://(www\.)?', '', u or '').split('/')[0]
COMPACTAS = ('centro', 'contorno', 'atrio', 'torre')
def gravar(p, D):
    s = json.dumps(D, ensure_ascii=False, indent=2, default=str)
    for k in COMPACTAS:
        if isinstance(D.get(k), list): s = re.sub(r'"%s": \[.*?\n  \]' % k, lambda m: '"%s": %s' % (k, json.dumps(D[k], separators=(',', ':'))), s, count=1, flags=re.S)
    open(p, 'w', encoding='utf8').write(s + '\n')
ROT = {'inauguracao': 'Inauguração', 'abl_m2': 'ABL', 'abc_m2': 'ABC', 'construida_m2': 'Área construída', 'lojas': 'Lojas', 'quiosques': 'Quiosques', 'ancoras': 'Âncoras', 'megalojas': 'Megalojas',
       'restaurantes': 'Restaurantes', 'cinema': 'Cinema', 'vagas': 'Vagas', 'consumidores_mes': 'Consumidores por mês', 'pisos_lojas': 'Pisos de lojas', 'perfil': 'Perfil de público'}
for ident in ids:
    P = json.load(open(os.path.join(pasta, ident + '.json'), encoding='utf8'))
    os.makedirs(os.path.join(RAIZ, 'coleta/pesquisa'), exist_ok=True); shutil.copy(os.path.join(pasta, ident + '.json'), os.path.join(RAIZ, 'coleta/pesquisa', ident + '.json'))
    arq = os.path.join(RAIZ, 'shoppings', ident, 'shopping.json'); D = json.load(open(arq, encoding='utf8'))
    if P.get('nome'): D['nome'] = P['nome']; D['curto'] = re.sub(r'^SHOPPING\s+', '', P['nome'].upper())
    if papel: D['papel'] = papel
    if P.get('endereco') or P.get('administradora'): D['subtitulo'] = ' · '.join(x for x in [re.sub(r'\s*\(fonte:.*?\)', '', P.get('endereco') or ''), P.get('administradora')] if x)
    urls = []
    def item(chave, rotulo, x, valor=None):
        v = x.get('valor') if valor is None else valor
        if isinstance(v, float) and abs(v - round(v)) < 1: v = round(v)
        o = {'chave': chave, 'rotulo': rotulo, 'valor': v}
        un = x.get('unidade')
        if un and not (isinstance(v, str) and un in v) and un.split('/')[0].lower() not in rotulo.lower(): o['unidade'] = un
        if x.get('nota'): o['nota'] = x['nota']
        if x.get('url'): o['fonte'] = dom(x['url']); urls.append(x['url'])
        return o
    if P.get('ficha'):
        F = [item(x['chave'], x.get('rotulo') or ROT.get(x['chave'], x['chave']), x) for x in P['ficha']]
        tem = {f['chave'] for f in F}
        F = [f for f in D.get('ficha', []) if f['chave'] in ('endereco', 'administradora') and f.get('valor')] + F
        for k in ('quiosques', 'ancoras', 'megalojas'):
            if k not in tem: F.append({'chave': k, 'rotulo': ROT[k], 'valor': None})
        D['ficha'] = F
    else: D['ficha'] = [f for f in D.get('ficha', []) if not re.match(r'^(arq|piso)_\d+$', f['chave']) and f['chave'] not in ('autor_projeto', 'planta_baixa', 'pisos_lojas') or f.get('valor') is not None and not re.match(r'^(arq|piso)_\d+$', f['chave'])]
    D['ficha'] = [f for f in D['ficha'] if not re.match(r'^(arq|piso)_\d+$', f['chave'])]
    for n, x in enumerate(P.get('arquitetura', [])): D['ficha'].append(item(f'arq_{n + 1}', 'Projeto · ' + x['item'], x))
    for n, x in enumerate(P.get('pisos', [])): D['ficha'].append(item(f'piso_{n + 1}', 'Piso ' + re.sub(r'(?i)^piso\s+', '', x['nome']), x, x['uso']))
    antigas = {c['nome']: c for c in D.get('conexoes', [])}; cx = []
    for x in P.get('conexoes', []):
        if re.search(r'\((posição|distância)\)$', x['nome']): urls.append(x['url']); continue      # segunda fonte da mesma conexão
        c = {'tipo': x['tipo'], 'nome': x['nome'], 'descricao': x['descricao'], 'piso': x.get('piso'), 'acesso': x.get('acesso') or 'a confirmar', 'fonte': x['url']}
        for k in ('osm', 'x', 'y', 'd'):
            if k in antigas.get(x['nome'], {}): c[k] = antigas[x['nome']][k]
        cx.append(c); urls.append(x['url'])
    D['conexoes'] = cx
    M = [m for m in D.get('metodo', []) if not m['texto'].startswith(('Divergência entre fontes', 'Não encontrado em fonte pública', 'Pesquisa de ficha'))]
    M = [m for m in M if 'não encontrados em fonte pública nesta pesquisa' not in m['texto'] and 'retângulo provisório' not in m['texto'] and 'confirme a quantidade' not in m['texto']]
    M.append({'tag': 'a confirmar', 'texto': 'Pesquisa de ficha, projeto e conexões: fontes públicas lidas em 14/11/2026 por busca automatizada. Cada item da ficha traz o site de origem e cada conexão traz o link; os trechos citados estão em coleta/pesquisa.'})
    for d in P.get('divergencias', []): M.append({'tag': 'a confirmar', 'texto': 'Divergência entre fontes: ' + re.sub(r'\s*\(?https?://\S+?\)?(?=[\s,.;]|$)', '', str(d)).strip()})
    if P.get('nao_encontrado'): M.append({'tag': 'a confirmar', 'texto': 'Não encontrado em fonte pública: ' + '; '.join(re.sub(r'\s*\(?https?://\S+?\)?(?=[\s,.;]|$)', '', str(x)).strip().rstrip('.') for x in P['nao_encontrado']) + '.'})
    D['metodo'] = M
    F0 = [f for f in D.get('fontes', []) if not f.startswith('Pesquisa em fontes públicas')]
    doms = sorted({dom(u) for u in urls if u})
    if doms: F0.append('Pesquisa em fontes públicas (ficha, projeto e conexões), lida em 14/11/2026: ' + ', '.join(doms))
    D['fontes'] = F0
    gravar(arq, D)
    print(ident, '| ficha', len(D['ficha']), '| conexões', [(c['tipo'], c['nome'], c['acesso']) for c in cx])
