#!/usr/bin/env python3
"""Lê o diretório público do Shopping Nova América (novaamerica.com.br/lojas e /alimentacao)
e grava shoppings/nova-america/lojas.json.

Uso:  python3 coleta/nova-america.py <pasta com lojas.html, alimentacao.html e rua-do-rio.html>
Baixe antes as três páginas (curl -A "Mozilla/5.0" https://www.novaamerica.com.br/lojas -o lojas.html, etc.).

O site publica nome, segmento, localização (piso) e LUC. Não publica área nem tipo de operação:
- tipo sai do código (Q... = quiosque), do segmento e da lista de restaurantes da Rua do Rio;
- piso ausente é deduzido do LUC (3 dígitos = 1º piso, 3xx = 3º piso, 4 dígitos = 2º piso) e marcado como deduzido;
- a área é só a referência de desenho por tipo (config.json), multiplicada pelo nº de LUCs unidos. Não é medida."""
import re, sys, json, html, os, unicodedata

SRC = sys.argv[1]
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BENCH = json.load(open(os.path.join(RAIZ, 'config.json'), encoding='utf8'))['area_referencia_m2']
deacc = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
limpa = lambda m: re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', '', m.group(1)))).strip() if m else ''

def itens(arq):
    s = open(os.path.join(SRC, arq), encoding='utf8', errors='replace').read(); out = []
    for blk in re.split(r'<li class="item noDot', s)[1:]:
        blk = blk.split('</li>')[0]
        seg = re.search(r'data-segmento="([^"]*)"', blk); slug = re.search(r'href="https://www\.novaamerica\.com\.br/([a-z]+/[^"]+)"', blk)
        out.append({'nome': limpa(re.search(r'<h4>(.*?)</h4>', blk, re.S)), 'seg': html.unescape(seg.group(1)) if seg else '',
                    'piso': limpa(re.search(r'Localiza[çc][ãa]o:\s*(.*?)<br', blk, re.S)), 'luc': limpa(re.search(r'LUC:\s*(.*?)</p>', blk, re.S)), 'slug': slug.group(1) if slug else None})
    return out

def rua_do_rio():
    s = open(os.path.join(SRC, 'rua-do-rio.html'), encoding='utf8', errors='replace').read()
    t = html.unescape(re.sub(r'<[^>]+>', '\n', s)); i = t.find('Restaurantes', t.find('Rua do Rio,'))
    nomes = [l.strip() for l in t[i:i + 3000].split('\n') if l.strip()][1:40]
    fim = next((k for k, n in enumerate(nomes) if len(n) > 40 or deacc(n).lower().startswith(('rua do rio', 'hor', 'endereco', 'como chegar', 'nossas'))), len(nomes))
    return {deacc(n).upper() for n in nomes[:fim] if not n.upper().startswith('QUIOSQUE')}

GRUPO = {'Vestuário': 'Moda e calçados', 'Calçados': 'Moda e calçados', 'Perfumaria e cosméticos': 'Beleza e saúde', 'Joias, relógios e bijuterias': 'Joias, óticas e acessórios',
  'Óticas': 'Joias, óticas e acessórios', 'Telefonia e acessórios': 'Tecnologia e telefonia', 'Cabeleireiro, clínicas de estética e podologia)': 'Beleza e saúde', 'Artigos do lar': 'Casa e decoração',
  'Alimentação': 'Alimentação', 'Alimentos especiais (congelados/dietéticos/naturais)': 'Alimentação', 'Farmácia/drogaria / farmácias especiais (homeopatia /manipulação/vitaminas)': 'Beleza e saúde',
  'Diversões (parques/videogames)': 'Lazer', 'Artigos esportivos': 'Esporte', 'Serviços médicos (clínicas/laboratórios)': 'Beleza e saúde', 'Lojas âncoras': 'Departamento', 'Loja de departamentos': 'Departamento',
  'Massagem express': 'Beleza e saúde', 'Eletrodomésticos e eletroeletrônicos (novo)': 'Tecnologia e telefonia', 'Móveis/decoração/cama, mesa e banho': 'Casa e decoração', 'Cinemas': 'Lazer', 'Lazer': 'Lazer', 'Hipermercado': 'Departamento'}
SERVICO = {'Outros serviços', 'Serviços médicos (clínicas/laboratórios)', 'Serviços financeiros (banco/financeira)', 'Lavanderia', 'Consertos', 'Correio', 'Universidades, educação/ensino', 'Conveniência/serviços', 'Hotel', 'Lotérica', 'Chaveiro'}

def nivel(piso, luc):
    t = deacc(piso).upper()
    if 'SUBSOLO' in t and re.search(r'\b1', t): return 'L1', 'oficial (1º piso e subsolo)'
    if 'SUBSOLO' in t: return 'SS', 'oficial'
    if 'ESTACIONAMENTO' in t or 'DECK' in t: return 'EST', 'oficial'
    m = re.search(r'([123])\s*[°ºO]?\s*PISO|PISO\s*([123])|^([123])\s*[°º]$', t)
    if m: return 'L' + next(g for g in m.groups() if g), 'oficial'
    if 'RUA' in t: return 'L1', 'oficial (Rua do Rio fica no 1º piso)'
    d = re.match(r'\D*(\d+)', luc or '')
    if d and not re.match(r'(?i)\s*(LUC\s*[-:]?\s*)?(Q|MAQ)', luc):
        n = d.group(1)
        if len(n) == 4: return 'L2', 'deduzido do LUC (4 dígitos = 2º piso)'
        if len(n) == 3: return ('L3', 'deduzido do LUC (3xx = 3º piso)') if n[0] == '3' else ('L1', 'deduzido do LUC (3 dígitos = 1º piso)')
    return None, 'não informado'

def setor(piso, rr):
    t = deacc(piso).upper()
    if rr or 'RUA DO RIO' in t or 'RUA 8' in t: return 'Rua do Rio'
    m = re.search(r'ACESSO\s*([A-J])', t)
    if m: return 'Acesso ' + m.group(1)
    if 'EXPANS' in t: return 'Expansão'
    if 'PRACA' in t: return 'Praça ' + (re.search(r'PRACA\s*(\d)', t) or [0, ''])[1]
    return None

RR = rua_do_rio(); vistos = set(); lojas = []; semPiso = []
for fonte, arq in (('lojas', 'lojas.html'), ('alimentacao', 'alimentacao.html')):
    for x in itens(arq):
        if not x['nome'] or x['slug'] in vistos: continue
        vistos.add(x['slug'])
        seg, luc, nomeU = x['seg'], re.sub(r'(?i)^\s*(LUC|LOJA|LJ)\s*[-:]?\s*', '', x['luc']).strip(' .-') or None, deacc(x['nome']).upper()
        naRua = nomeU in RR
        if re.match(r'(?i)^Q', luc or '') or 'QUIOSQUE' in nomeU: tipo, tf = 'Quiosque', 'oficial (código de quiosque no site)' if re.match(r'(?i)^Q', luc or '') else 'oficial (nome no site)'
        elif re.match(r'(?i)^MAQ', luc or ''): tipo, tf = 'Serviço', 'máquina de autoatendimento (código MAQ no site)'
        elif seg in ('Loja de departamentos', 'Hipermercado'): tipo, tf = 'Âncora', 'inferido pelo segmento do site'
        elif seg in ('Cinemas', 'Diversões (parques/videogames)', 'Lazer'): tipo, tf = 'Lazer', 'inferido pelo segmento do site'
        elif naRua: tipo, tf = 'Restaurante', 'oficial (lista de restaurantes da Rua do Rio)'
        elif fonte == 'alimentacao' or GRUPO.get(seg) == 'Alimentação': tipo, tf = 'Alimentação', 'oficial (página de gastronomia)' if fonte == 'alimentacao' else 'inferido pelo segmento do site'
        elif seg in SERVICO: tipo, tf = 'Serviço', 'inferido pelo segmento do site'
        else: tipo, tf = 'Loja', 'inferido pelo segmento do site'
        grupo = 'Alimentação' if fonte == 'alimentacao' else GRUPO.get(seg) or ('Serviços e conveniência' if seg in SERVICO else None)
        nv, nf = nivel(x['piso'], luc)
        if not nv: semPiso.append(x['nome'])
        n_luc = max(1, len([c for c in re.split(r'[/,]|\s+(?=\d{3,4}\b)', luc or '') if re.search(r'\d', c)]))
        area = (3 if (luc or '').upper().startswith('MAQ') else BENCH[tipo]) * (n_luc if tipo in ('Loja', 'Alimentação', 'Restaurante', 'Serviço') else 1)
        l = {'nome': x['nome'].upper(), 'slug': x['slug'], 'categoria': seg or 'Não informado', 'piso_oficial': x['piso'] or 'Não informado', 'nivel': nv or 'L1',
             'tipo': tipo, 'tipo_fonte': tf, 'status': 'Em operação', 'luc': luc, 'luc_nota': None if luc else 'sem código no site', 'n_luc': n_luc,
             'area_est': area, 'faixa': 'referência de desenho por tipo de operação' + (f' × {n_luc} unidades unidas' if n_luc > 1 and area != BENCH[tipo] else '') + '; o site não publica área', 'piso_fonte': nf if nv else 'sem piso no site; desenhada no 1º piso'}
        if grupo: l['grupo'] = grupo
        st = setor(x['piso'], naRua)
        if st: l['setor'] = st
        lojas.append(l)
with open(os.path.join(RAIZ, 'shoppings/nova-america/lojas.json'), 'w', encoding='utf8') as f:
    f.write('[\n' + ',\n'.join(json.dumps(l, ensure_ascii=False) for l in lojas) + '\n]\n')
from collections import Counter
print(len(lojas), 'operações |', dict(Counter(l['nivel'] for l in lojas)), '|', dict(Counter(l['tipo'] for l in lojas)))
print('piso deduzido do LUC:', sum('deduzido' in l['piso_fonte'] for l in lojas), '| sem piso (desenhadas em L1):', semPiso)
print('setores:', dict(Counter(l.get('setor') for l in lojas)), '| Rua do Rio reconhecidos:', sorted(RR))
