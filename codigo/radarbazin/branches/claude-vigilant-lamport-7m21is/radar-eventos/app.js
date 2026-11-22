/* Radar de Eventos — interface. Dados ficam no navegador (localStorage + IndexedDB para plantas). */
(function () {
  'use strict';
  var C = window.RadarCalc, D = window.RadarDados;
  var CHAVE = 'radar-eventos-v1';
  var app = document.getElementById('app');
  var liveFns = {}, raiz = null;

  /* ---------- estado ---------- */
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function estadoInicial() {
    return {
      versao: 2,
      shopping: { nome: '', endereco: '', cidade: '', uf: '', raioKm: null, perfil: '', fluxoMensal: null, entorno: '', cluster: '', clusterStatus: '' },
      caderno: { folgaAlturaM: null, horarioMontagem: '', linkCaderno: '', observacoes: '',
        regras: D.REGRAS_MODELO.map(function (r) { return { id: uid(), texto: r.texto, obrigatoria: r.obrigatoria }; }) },
      docsModelo: D.DOCS_MODELO.map(function (d) { return { id: uid(), nome: d.nome, obrigatorio: d.obrigatorio, quando: d.quando }; }),
      temas: D.TEMAS.slice(), areas: [], operadores: [], eventos: []
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(CHAVE)) || estadoInicial(); } catch (e) { S = estadoInicial(); }
  /* v1 → v2: cluster, batalha, Event Occupancy Score e Deal Conversion Layer por evento */
  function migrar(st) {
    st.shopping = st.shopping || {};
    if (st.shopping.cluster === undefined) st.shopping.cluster = '';
    if (st.shopping.clusterStatus === undefined) st.shopping.clusterStatus = '';
    (st.eventos || []).forEach(function (e) {
      if (e.cluster === undefined) e.cluster = '';
      if (e.batalha === undefined) e.batalha = '';
      e.eos = e.eos || {};
      e.dcl = e.dcl || novoDcl();
    });
    st.versao = 2;
    return st;
  }
  function novoDcl() { return { dono: '', proximaAcao: '', prazo: '', blocker: '', probabilidade: null, apoio: '', sponsor: '', criterioKill: '', proximaRevisao: '', ultimaAtualizacao: '' }; }
  migrar(S);
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { toast('Não foi possível salvar no navegador: ' + e.message); }
  }

  /* ---------- plantas (IndexedDB) ---------- */
  function idb() {
    return new Promise(function (ok, erro) {
      var r = indexedDB.open('radar-eventos', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('plantas'); };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { erro(r.error); };
    });
  }
  function plantaOp(modo, fn) {
    return idb().then(function (db) {
      return new Promise(function (ok, erro) {
        var t = db.transaction('plantas', modo), q = fn(t.objectStore('plantas'));
        q.onsuccess = function () { ok(q.result); };
        q.onerror = function () { erro(q.error); };
      });
    });
  }

  /* ---------- utilitários ---------- */
  function h(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function falta(o) { return '<span class="falta-txt">[FALTA: ' + h(o) + ']</span>'; }
  function brl(v, o) { return v === null || v === undefined ? falta(o || 'dado') : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  function n(v, o, un) { return v === null || v === undefined || v === '' ? falta(o || 'dado') : Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + (un ? ' ' + un : ''); }
  function txt(v, o) { return v ? h(v) : falta(o); }
  function data(d) { return d ? d.split('-').reverse().join('/') : ''; }
  function hoje() { return new Date().toISOString().slice(0, 10); }
  function ler(o, caminho) { return caminho.split('.').reduce(function (a, k) { return a == null ? undefined : a[k]; }, o); }
  function gravar(o, caminho, v) {
    var ks = caminho.split('.'), ult = ks.pop();
    var alvo = ks.reduce(function (a, k) { if (a[k] == null) a[k] = {}; return a[k]; }, o);
    alvo[ult] = v;
  }
  function porId(l, id) { return l.filter(function (x) { return x.id === id; })[0]; }
  function toast(m) {
    var t = document.getElementById('toast'); t.textContent = m; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function copiar(texto) {
    (navigator.clipboard ? navigator.clipboard.writeText(texto) : Promise.reject()).then(function () { toast('Copiado'); }, function () {
      var a = document.createElement('textarea'); a.value = texto; document.body.appendChild(a); a.select();
      try { document.execCommand('copy'); toast('Copiado'); } catch (e) { toast('Selecione e copie manualmente'); }
      a.remove();
    });
  }

  /* ---------- componentes de formulário (auto-salvam via data-b) ---------- */
  function campo(rot, caminho, o) {
    o = o || {};
    var v = ler(raiz, caminho), attrs = ' data-b="' + caminho + '"' + (o.rr ? ' data-rr="1"' : ''), ctl;
    if (o.opts) {
      ctl = '<select' + attrs + '>' + (o.semVazio ? '' : '<option value="">— não informado —</option>') + o.opts.map(function (p) {
        var val = Array.isArray(p) ? p[0] : p, lab = Array.isArray(p) ? p[1] : p;
        return '<option value="' + h(val) + '"' + (String(v == null ? '' : v) === String(val) ? ' selected' : '') + '>' + h(lab) + '</option>';
      }).join('') + '</select>';
    } else if (o.tipo === 'area') ctl = '<textarea' + attrs + ' placeholder="' + h(o.ph || '') + '">' + h(v) + '</textarea>';
    else ctl = '<input type="' + (o.tipo || 'text') + '"' + (o.tipo === 'number' ? ' step="any" min="0"' : '') + attrs + ' value="' + h(v) + '" placeholder="' + h(o.ph || '') + '">';
    if (o.nu) return ctl;
    return '<label class="campo' + (o.cheio ? ' cheio' : '') + '">' + h(rot) + ctl + '</label>';
  }
  var SN = [['sim', 'Sim'], ['nao', 'Não']];
  function check(caminho) { return '<input type="checkbox" data-b="' + caminho + '"' + (ler(raiz, caminho) ? ' checked' : '') + '>'; }
  function live(id, fn) { liveFns[id] = fn; return '<div data-live="' + id + '">' + fn() + '</div>'; }
  function selo(st, t) { return '<span class="selo ' + st + '">' + h(t) + '</span>'; }

  /* ---------- domínio ---------- */
  function novoEvento() {
    return { id: uid(), nome: 'Novo evento', tema: '', descricao: '', areaId: '', operadorId: '', inicio: '', fim: '', etapa: 'prospeccao',
      cluster: S.shopping.cluster || '', batalha: '', eos: {}, dcl: novoDcl(),
      historico: [{ etapa: 'prospeccao', data: hoje() }], tarefas: {}, regras: {},
      req: { areaM2: null, alturaM: null, cargaKva: null, agua: '', esgoto: '', publicoSimultaneo: null, cargaPisoKgM2: null },
      docs: S.docsModelo.map(function (d) { return { id: uid(), nome: d.nome, obrigatorio: d.obrigatorio, quando: d.quando, status: 'pendente', validade: '', obs: '' }; }),
      contrato: { tipo: '', numero: '', status: D.CONTRATO_STATUS[0], plataforma: '', obs: '', signatarios: [] },
      sim: { dias: null, temBilheteria: '', sessoesDia: null, capacidadeSessao: null, ticketMedio: null, ocupPess: null, ocupBase: null, ocupOtim: null,
        pctBilheteria: null, locacaoModelo: '', aluguelFixo: null, valorM2Dia: null, regraBilheteria: 'soma', sublocacoes: [], midias: [], custosShopping: null } };
  }
  function novaArea() {
    return { id: uid(), nome: 'Nova área', tipo: '', piso: '', metragem: null, peDireito: null, peDireitoLivre: '', lotacaoMax: null, sobrecargaKgM2: null, vagas: null,
      energia: { disponivel: '', tensao: '', cargaKva: null, obs: '' }, agua: '', esgoto: '', acessoCarga: '', plantaUrl: '', plantaNome: '', obs: '' };
  }
  function novoOperador(o) {
    o = o || {};
    return { id: uid(), nome: o.nome || 'Novo operador', tema: o.tema || '', cidade: o.cidade || '', distanciaKm: C.num(o.distanciaKm), site: o.site || '', contato: o.contato || '',
      fonte: o.fonte || '', estagio: 'Novo', notas: o.notas || '', criado: hoje() };
  }
  function viab(ev) { return C.viabilidade(ev, porId(S.areas, ev.areaId), S.caderno, S.eventos); }
  function simu(ev) { return C.simular(ev.sim, ev, porId(S.areas, ev.areaId)); }
  function etapaIdx(ev) { for (var i = 0; i < D.ETAPAS.length; i++) if (D.ETAPAS[i].id === ev.etapa) return i; return -1; }
  function etapaNome(ev) { return ev.etapa === 'cancelado' ? 'Cancelado' : (D.ETAPAS[etapaIdx(ev)] || {}).nome || '—'; }
  var VER = { apto: ['ok', 'Apto'], pendente: ['falta', 'Pendente'], inviavel: ['falha', 'Inviável'] };
  function seloViab(ev) { var v = viab(ev); return selo(VER[v.veredito][0], VER[v.veredito][1]); }
  function clusterEv(ev) { return ev.cluster || S.shopping.cluster || ''; }
  function score(ev) { return C.eventScore(ev, S.caderno, D, clusterEv(ev)); }
  function deal(ev) {
    return C.dealConversion(ev, { shopping: S.shopping, area: porId(S.areas, ev.areaId), operador: porId(S.operadores, ev.operadorId),
      receitaBase: simu(ev).cenarios[1].total, score: score(ev), hoje: hoje() }, D);
  }
  var FAIXA_COR = { baixo: 'falha', aceitavel: 'falta', forte: 'ok', estrategico: 'ok' };
  function seloScore(sc) { return sc.score === null ? selo('falta', 'Score em aberto') : selo(FAIXA_COR[sc.faixa.id], sc.score + ' · ' + sc.faixa.nome); }
  var DEC_COR = { 'Avançar': 'ok', 'Avançar com sponsor executivo': 'ok', 'Cobrar blocker': 'falta', 'Revisar performance': 'falta', 'Pausar': 'falha', 'Perdido / pausado': '' };
  function seloDec(r) { return selo(DEC_COR[r.decisao] !== undefined ? DEC_COR[r.decisao] : 'falha', r.decisao); }

  /* ---------- telas ---------- */
  var telas = {};

  telas.painel = function () {
    var ativos = S.eventos.filter(function (e) { return e.etapa !== 'cancelado' && e.etapa !== 'encerramento'; });
    var soma = 0, comSim = 0;
    ativos.forEach(function (e) { var t = simu(e).cenarios[1].total; if (t !== null) { soma += t; comSim++; } });
    var semSim = ativos.length - comSim;
    var html = '<h1>Painel</h1><p class="sub">Visão do planejamento de eventos' + (S.shopping.nome ? ' — ' + h(S.shopping.nome) : '') + '.</p>';
    if (!S.shopping.nome || !S.areas.length) html += '<p class="nota">Comece por <a href="#/shopping">Shopping &amp; caderno técnico</a> e depois cadastre as <a href="#/areas">áreas</a>. Nada é estimado pelo app: o que não for informado aparece como [FALTA].</p>';
    html += '<div class="kpis">' +
      '<div class="kpi"><b>' + S.areas.length + '</b><span>áreas cadastradas</span></div>' +
      '<div class="kpi"><b>' + ativos.length + '</b><span>eventos em andamento</span></div>' +
      '<div class="kpi"><b>' + S.operadores.filter(function (o) { return o.estagio !== 'Descartado'; }).length + '</b><span>operadores no pipeline</span></div>' +
      '<div class="kpi"><b>' + (comSim ? brl(soma) : '—') + '</b><span>receita do shopping, cenário base (' + comSim + ' evento(s) com simulação completa' + (semSim ? '; ' + semSim + ' sem' : '') + ')</span></div>' +
      '<div class="kpi"><b>' + (S.shopping.cluster ? h(S.shopping.cluster) : '—') + '</b><span>cluster do shopping' + (S.shopping.clusterStatus === 'inferido' ? ' (inferido — validar)' : '') + '</span></div></div>';
    html += '<div class="card"><h2>Eventos por etapa</h2>' + (ativos.length ? '<div class="rolagem"><table><tr><th>Evento</th><th>Área</th><th>Período</th><th>Etapa</th><th>Viabilidade</th><th>Score</th><th>Decisão DCL</th><th class="n">Receita base</th></tr>' +
      ativos.map(function (e) {
        var a = porId(S.areas, e.areaId);
        return '<tr><td><a href="#/eventos/' + e.id + '">' + h(e.nome) + '</a></td><td>' + (a ? h(a.nome) : falta('área')) + '</td><td>' + (e.inicio ? data(e.inicio) + ' a ' + data(e.fim) : falta('datas')) +
          '</td><td>' + h(etapaNome(e)) + '</td><td>' + seloViab(e) + '</td><td>' + seloScore(score(e)) + '</td><td>' + seloDec(deal(e)) + '</td><td class="n">' + brl(simu(e).cenarios[1].total, 'simulação incompleta') + '</td></tr>';
      }).join('') + '</table></div>' : '<div class="vazio">Nenhum evento em andamento. <a href="#/eventos">Criar evento</a></div>') + '</div>';
    var pend = [];
    ativos.forEach(function (e) {
      var v = viab(e);
      if (v.falhas) pend.push('<li><a href="#/eventos/' + e.id + '/viabilidade">' + h(e.nome) + '</a>: ' + v.falhas + ' item(ns) em desacordo com a área ou o caderno técnico</li>');
      var sp = e.contrato.signatarios.filter(function (s) { return s.status !== 'assinado'; }).length;
      if (sp) pend.push('<li><a href="#/eventos/' + e.id + '/contrato">' + h(e.nome) + '</a>: ' + sp + ' assinatura(s) pendente(s)</li>');
      deal(e).alertas.forEach(function (a) { pend.push('<li><a href="#/eventos/' + e.id + '/deal">' + h(e.nome) + '</a>: ' + h(a.txt) + '</li>'); });
    });
    html += '<div class="card"><h2>Pendências críticas</h2>' + (pend.length ? '<ul>' + pend.join('') + '</ul>' : '<div class="vazio">Sem pendências críticas registradas.</div>') + '</div>';
    return html;
  };

  telas.shopping = function () {
    raiz = S;
    var html = '<h1>Shopping &amp; caderno técnico</h1><p class="sub">Dados usados nas análises de viabilidade e nos prompts de prospecção.</p>';
    html += '<div class="card"><h2>Shopping</h2><div class="grade">' + campo('Nome', 'shopping.nome') + campo('Endereço', 'shopping.endereco') + campo('Cidade', 'shopping.cidade') + campo('UF', 'shopping.uf') +
      campo('Raio de prospecção (km)', 'shopping.raioKm', { tipo: 'number' }) + campo('Fluxo mensal de visitantes', 'shopping.fluxoMensal', { tipo: 'number' }) +
      campo('Cluster (Shopping Inteligente OS)', 'shopping.cluster', { opts: D.CLUSTERS.map(function (c) { return c.nome; }), rr: 1 }) +
      campo('Situação do cluster', 'shopping.clusterStatus', { opts: [['validado', 'Validado'], ['inferido', 'Inferido — validar']] }) +
      campo('Perfil de público / posicionamento', 'shopping.perfil', { tipo: 'area', cheio: true }) +
      campo('Entorno: empreendimentos, obras e investimentos conhecidos', 'shopping.entorno', { tipo: 'area', cheio: true, ph: 'Ex.: lançamentos imobiliários, novas concessionárias, universidades, hospitais, obras viárias…' }) + '</div>' +
      (function () { var def =D.CLUSTERS.filter(function (x) { return x.nome === S.shopping.cluster; })[0];
        return def ? '<p class="sub">Essência: “' + h(def.essencia) + '” · Batalhas, em ordem de prioridade: ' + def.batalhas.map(function (b, i) { return (i + 1) + '. ' + h(b); }).join(' · ') + '</p>' : ''; })() + '</div>';
    html += '<div class="card"><h2>Caderno técnico — parâmetros</h2><p class="nota">As regras abaixo são um modelo genérico. Substitua pelo caderno técnico oficial do shopping e pelas exigências do Corpo de Bombeiros e da prefeitura locais.</p><div class="grade">' +
      campo('Folga mínima sob o pé-direito (m)', 'caderno.folgaAlturaM', { tipo: 'number' }) + campo('Horário de montagem/desmontagem', 'caderno.horarioMontagem') + campo('Link do caderno técnico', 'caderno.linkCaderno', { tipo: 'url' }) +
      campo('Observações', 'caderno.observacoes', { tipo: 'area', cheio: true }) + '</div>' +
      '<h3>Regras de segurança e operação (avaliadas em cada evento)</h3><table><tr><th>Regra</th><th>Obrigatória</th><th></th></tr>' +
      S.caderno.regras.map(function (r, i) { return '<tr><td>' + campo('', 'caderno.regras.' + i + '.texto', { nu: 1 }) + '</td><td>' + check('caderno.regras.' + i + '.obrigatoria') + '</td><td><button class="mini perigo" data-action="rm" data-lista="caderno.regras" data-i="' + i + '">Remover</button></td></tr>'; }).join('') +
      '</table><p><button data-action="add-regra">+ Regra</button></p></div>';
    html += '<div class="card"><h2>Modelo de checklist de documentos</h2><p class="sub">Copiado para cada novo evento. A exigência real varia por município e estado — valide com o jurídico.</p><table><tr><th>Documento</th><th>Quando se aplica</th><th>Obrigatório</th><th></th></tr>' +
      S.docsModelo.map(function (d, i) { return '<tr><td>' + campo('', 'docsModelo.' + i + '.nome', { nu: 1 }) + '</td><td>' + campo('', 'docsModelo.' + i + '.quando', { nu: 1 }) + '</td><td>' + check('docsModelo.' + i + '.obrigatorio') + '</td><td><button class="mini perigo" data-action="rm" data-lista="docsModelo" data-i="' + i + '">Remover</button></td></tr>'; }).join('') +
      '</table><p><button data-action="add-docmodelo">+ Documento</button></p></div>';
    return html;
  };

  telas.areas = function (id) {
    if (id) return telaArea(id);
    var html = '<div class="cab"><div><h1>Áreas</h1><p class="sub">Praças de eventos, áreas internas, externas e estacionamento.</p></div><button class="pri" data-action="add-area">+ Nova área</button></div>';
    if (!S.areas.length) return html + '<div class="card vazio">Nenhuma área cadastrada.</div>';
    return html + '<div class="card rolagem"><table><tr><th>Área</th><th>Tipo</th><th class="n">Metragem</th><th class="n">Pé-direito</th><th class="n">Energia</th><th>Água</th><th>Esgoto</th><th class="n">Lotação</th><th>Eventos</th></tr>' +
      S.areas.map(function (a) {
        var sn = function (v) { return v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : falta('dado'); };
        return '<tr><td><a href="#/areas/' + a.id + '">' + h(a.nome) + '</a></td><td>' + txt(a.tipo, 'tipo') + '</td><td class="n">' + n(a.metragem, 'metragem', 'm²') + '</td><td class="n">' +
          (a.peDireitoLivre === 'sim' ? 'céu aberto' : n(a.peDireito, 'pé-direito', 'm')) + '</td><td class="n">' + (a.energia.disponivel === 'nao' ? 'Sem ponto' : n(a.energia.cargaKva, 'carga', 'kVA')) +
          '</td><td>' + sn(a.agua) + '</td><td>' + sn(a.esgoto) + '</td><td class="n">' + n(a.lotacaoMax, 'lotação') + '</td><td>' + S.eventos.filter(function (e) { return e.areaId === a.id; }).length + '</td></tr>';
      }).join('') + '</table></div>';
  };

  function telaArea(id) {
    var a = porId(S.areas, id);
    if (!a) return '<p>Área não encontrada. <a href="#/areas">Voltar</a></p>';
    raiz = a;
    var html = '<div class="cab"><div><h1>' + h(a.nome) + '</h1><p class="sub"><a href="#/areas">← Áreas</a></p></div><button class="perigo" data-action="del-area" data-id="' + a.id + '">Excluir área</button></div>';
    html += '<div class="card"><h2>Identificação e dimensões</h2><div class="grade">' + campo('Nome', 'nome') + campo('Tipo', 'tipo', { opts: D.TIPOS_AREA }) + campo('Piso / localização', 'piso') +
      campo('Metragem (m²)', 'metragem', { tipo: 'number' }) + campo('Pé-direito (m)', 'peDireito', { tipo: 'number' }) + campo('Área a céu aberto (sem pé-direito)?', 'peDireitoLivre', { opts: SN }) +
      campo('Lotação máxima (pessoas, conforme projeto de segurança)', 'lotacaoMax', { tipo: 'number' }) + campo('Sobrecarga admissível do piso (kg/m²)', 'sobrecargaKgM2', { tipo: 'number' }) +
      campo('Vagas ocupadas (se estacionamento)', 'vagas', { tipo: 'number' }) + campo('Acesso de carga / doca', 'acessoCarga') + '</div></div>';
    html += '<div class="card"><h2>Infraestrutura</h2><div class="grade">' + campo('Energia elétrica disponível?', 'energia.disponivel', { opts: SN }) + campo('Carga disponível (kVA)', 'energia.cargaKva', { tipo: 'number' }) +
      campo('Tensão / tipo de ponto', 'energia.tensao', { ph: 'Ex.: 220/380 V trifásico' }) + campo('Observações de energia', 'energia.obs') +
      campo('Ponto de água?', 'agua', { opts: SN }) + campo('Ponto de esgoto?', 'esgoto', { opts: SN }) + campo('Observações gerais', 'obs', { tipo: 'area', cheio: true }) + '</div></div>';
    html += '<div class="card planta"><h2>Planta</h2><div class="grade larga">' + campo('Link da planta (drive, DWG, PDF)', 'plantaUrl', { tipo: 'url' }) +
      '<label class="campo">Arquivo da planta (imagem ou PDF — fica só neste navegador)<input type="file" accept="image/*,application/pdf" data-planta="' + a.id + '"></label></div>' +
      (a.plantaUrl ? '<p><a href="' + h(a.plantaUrl) + '" target="_blank" rel="noopener">Abrir link da planta</a></p>' : '') + '<div id="planta-view"></div></div>';
    var evs = S.eventos.filter(function (e) { return e.areaId === a.id; });
    html += '<div class="card"><h2>Agenda da área</h2>' + (evs.length ? '<table><tr><th>Evento</th><th>Período</th><th>Etapa</th></tr>' + evs.map(function (e) {
      return '<tr><td><a href="#/eventos/' + e.id + '">' + h(e.nome) + '</a></td><td>' + (e.inicio ? data(e.inicio) + ' a ' + data(e.fim) : falta('datas')) + '</td><td>' + h(etapaNome(e)) + '</td></tr>';
    }).join('') + '</table>' : '<div class="vazio">Sem eventos nesta área.</div>') + '</div>';
    return html;
  }
  function mostrarPlanta(a) {
    var alvo = document.getElementById('planta-view');
    if (!alvo) return;
    plantaOp('readonly', function (st) { return st.get(a.id); }).then(function (p) {
      if (!p || !document.getElementById('planta-view')) return;
      var url = URL.createObjectURL(p.blob);
      alvo.innerHTML = '<p>' + h(p.nome) + ' · <a href="' + url + '" target="_blank">abrir</a> · <button class="mini perigo" data-action="del-planta" data-id="' + a.id + '">remover arquivo</button></p>' +
        (p.blob.type.indexOf('image/') === 0 ? '<img src="' + url + '" alt="Planta da área">' : '');
    }).catch(function () {});
  }

  telas.eventos = function (id, aba) {
    if (id) return telaEvento(id, aba || 'dados');
    var html = '<div class="cab"><div><h1>Eventos</h1><p class="sub">Cada evento passa por viabilidade técnica, fluxo de negociação, contrato, documentos e simulação.</p></div><button class="pri" data-action="add-evento">+ Novo evento</button></div>';
    if (!S.eventos.length) return html + '<div class="card vazio">Nenhum evento cadastrado.</div>';
    return html + '<div class="card rolagem"><table><tr><th>Evento</th><th>Tema</th><th>Área</th><th>Operador</th><th>Período</th><th>Etapa</th><th>Viabilidade</th><th>Event Occupancy Score</th></tr>' +
      S.eventos.map(function (e) {
        var a = porId(S.areas, e.areaId), o = porId(S.operadores, e.operadorId);
        return '<tr><td><a href="#/eventos/' + e.id + '">' + h(e.nome) + '</a></td><td>' + h(e.tema) + '</td><td>' + (a ? h(a.nome) : falta('área')) + '</td><td>' + (o ? h(o.nome) : falta('operador')) + '</td><td>' +
          (e.inicio ? data(e.inicio) + ' a ' + data(e.fim) : falta('datas')) + '</td><td>' + h(etapaNome(e)) + '</td><td>' + seloViab(e) + '</td><td>' + seloScore(score(e)) + '</td></tr>';
      }).join('') + '</table></div>';
  };

  var ABAS = [['dados', 'Dados e requisitos'], ['cluster', 'Cluster e score'], ['viabilidade', 'Viabilidade técnica'], ['fluxo', 'Fluxo de negociação'], ['contrato', 'Contrato e assinaturas'], ['documentos', 'Documentos'], ['simulador', 'Simulador'], ['midia', 'Mídia e anunciantes'], ['deal', 'Deal Conversion']];
  function telaEvento(id, aba) {
    var ev = porId(S.eventos, id);
    if (!ev) return '<p>Evento não encontrado. <a href="#/eventos">Voltar</a></p>';
    raiz = ev;
    var html = '<div class="cab"><div><h1>' + h(ev.nome) + '</h1><p class="sub"><a href="#/eventos">← Eventos</a> · Etapa: <b>' + h(etapaNome(ev)) + '</b> · ' + live('selo', function () { return seloViab(ev); }).replace('<div', '<span').replace('</div>', '</span>') + '</p></div>' +
      '<div class="acoes"><button onclick="window.print()">Imprimir</button><button class="perigo" data-action="del-evento" data-id="' + ev.id + '">Excluir evento</button></div></div>';
    html += '<div class="abas">' + ABAS.map(function (a) { return '<a href="#/eventos/' + ev.id + '/' + a[0] + '"' + (a[0] === aba ? ' class="ativo"' : '') + '>' + a[1] + '</a>'; }).join('') + '</div>';
    return html + (abasEvento[aba] || abasEvento.dados)(ev);
  }
  var abasEvento = {};

  abasEvento.dados = function (ev) {
    var a = porId(S.areas, ev.areaId);
    return '<div class="card"><h2>Evento</h2><div class="grade">' + campo('Nome', 'nome') + campo('Tema', 'tema', { opts: S.temas }) +
      campo('Área', 'areaId', { rr: 1, opts: S.areas.map(function (x) { return [x.id, x.nome]; }) }) + campo('Operador', 'operadorId', { opts: S.operadores.map(function (x) { return [x.id, x.nome]; }) }) +
      campo('Início (abertura ao público)', 'inicio', { tipo: 'date' }) + campo('Fim', 'fim', { tipo: 'date' }) + campo('Descrição / briefing', 'descricao', { tipo: 'area', cheio: true }) + '</div></div>' +
      '<div class="card"><h2>Requisitos técnicos do evento</h2><p class="sub">Informados pelo operador. São confrontados com a área na aba Viabilidade técnica.</p><div class="grade">' +
      campo('Área necessária (m²)', 'req.areaM2', { tipo: 'number' }) + campo('Altura máxima das estruturas (m)', 'req.alturaM', { tipo: 'number' }) + campo('Carga elétrica necessária (kVA; 0 = não usa)', 'req.cargaKva', { tipo: 'number' }) +
      campo('Precisa de água?', 'req.agua', { opts: SN }) + campo('Precisa de esgoto?', 'req.esgoto', { opts: SN }) + campo('Público simultâneo máximo', 'req.publicoSimultaneo', { tipo: 'number' }) +
      campo('Carga das estruturas no piso (kg/m²)', 'req.cargaPisoKgM2', { tipo: 'number' }) + '</div></div>' +
      (a ? '<div class="card"><h2>Área vinculada: <a href="#/areas/' + a.id + '">' + h(a.nome) + '</a></h2><p>' + txt(a.tipo, 'tipo') + ' · ' + n(a.metragem, 'metragem', 'm²') + ' · pé-direito ' +
        (a.peDireitoLivre === 'sim' ? 'céu aberto' : n(a.peDireito, 'pé-direito', 'm')) + ' · energia ' + (a.energia.disponivel === 'nao' ? 'sem ponto' : n(a.energia.cargaKva, 'carga', 'kVA')) + ' · lotação ' + n(a.lotacaoMax, 'lotação') + '</p></div>' : '');
  };

  abasEvento.cluster = function (ev) {
    var cl = clusterEv(ev), def = D.CLUSTERS.filter(function (c) { return c.nome === cl; })[0];
    var bat = def ? def.batalhas.map(function (b, i) { return [b, (i + 1) + 'ª batalha — ' + b]; }) : [];
    bat.push([D.FORA_BATALHA, D.FORA_BATALHA]);
    var html = '<div class="card"><h2>Cluster e batalha</h2><p class="sub">Cluster First: todo evento declara a batalha do cluster que atende. Em branco, o evento usa o cluster do shopping' +
      (S.shopping.cluster ? ' (' + h(S.shopping.cluster) + (S.shopping.clusterStatus === 'inferido' ? ', inferido — validar' : '') + ')' : ' — ' + falta('cluster do shopping')) + '.</p><div class="grade">' +
      campo('Cluster do evento (vazio = o do shopping)', 'cluster', { opts: D.CLUSTERS.map(function (c) { return c.nome; }), rr: 1 }) +
      campo('Batalha atendida', 'batalha', { opts: bat, rr: 1 }) +
      campo('Justificativa do fit (público, ocasião, por que este evento neste cluster)', 'fitJustificativa', { tipo: 'area', cheio: true }) + '</div>' +
      (def ? '<p class="sub">' + h(def.nome) + ': “' + h(def.essencia) + '”</p>' : '') + '</div>';
    html += '<div class="card"><h2>Event Occupancy Score</h2><p class="sub">Pesos do dicionário de scores do Shopping Inteligente OS v5. Dê nota de 0 a 5 com base em fato (histórico do operador, proposta, anunciante): o app não estima. Segurança é calculada pelas regras avaliadas na aba Viabilidade.</p>' +
      '<div class="rolagem"><table><tr><th>Critério</th><th class="n">Peso</th><th>Nota (0–5)</th><th>Como pontuar</th></tr>' + D.EOS_CRITERIOS.map(function (c) {
        return '<tr><td>' + h(c.nome) + '</td><td class="n">' + c.peso + '</td><td>' + (c.auto ? '<span class="sub">automático</span>' : campo('', 'eos.' + c.id, { nu: 1, tipo: 'number' })) + '</td><td><small>' + h(c.guia) + '</small></td></tr>';
      }).join('') + '</table></div>' + live('eos', function () {
        var sc = score(ev), o = '<h3>Resultado</h3><p>' + seloScore(sc) + (sc.faixa ? ' ' + h(sc.faixa.acao) + '.' : ' Apurado até agora: ' + sc.apurado + ' de ' + sc.possivel + ' pontos possíveis (o score só fecha com todos os critérios).') + '</p>';
        o += '<p>Cluster Fit (nota de fit × 20): ' + (sc.clusterFit === null ? falta('nota de fit com o cluster') : '<b>' + sc.clusterFit + '</b> · ' + h(sc.clusterFitFaixa.nome) + ' — ' + h(sc.clusterFitFaixa.acao)) + '</p>';
        o += '<table><tr><th>Critério</th><th class="n">Nota</th><th class="n">Pontos</th><th>Detalhe</th></tr>' + sc.itens.map(function (i) {
          return '<tr><td>' + h(i.nome) + '</td><td class="n">' + (i.nota === null ? falta('nota') : Number(i.nota.toFixed(2)).toLocaleString('pt-BR')) + '</td><td class="n">' + (i.pontos === null ? '—' : Number(i.pontos.toFixed(1)).toLocaleString('pt-BR') + ' / ' + i.peso) + '</td><td><small>' + h(i.detalhe) + '</small></td></tr>';
        }).join('') + '</table>';
        if (sc.alertas.length) o += '<p class="nota">' + sc.alertas.map(h).join('<br>') + '</p>';
        if (sc.faltas.length) o += '<h3>Para fechar o score</h3><ul>' + sc.faltas.map(function (f) { return '<li>' + falta(f) + '</li>'; }).join('') + '</ul>';
        o += '<p class="sub">Faixas: as mesmas do Cluster Fit do OS (0–40 baixo · 41–70 aceitável · 71–85 forte · 86–100 estratégico). O dicionário não define faixas próprias para este score; esta é uma escolha do app.</p>';
        return o;
      }) + '</div>';
    return html;
  };

  abasEvento.deal = function (ev) {
    var html = '<div class="card"><h2>Deal Conversion Layer</h2><p class="sub">Estágio vem do fluxo de negociação. Nenhum evento fica sem dono, próxima ação e prazo. Os dados aparecem na tela <a href="#/deal">Deal Conversion</a> e saem em CSV/JSON no formato do OS.</p><div class="grade">' +
      campo('Dono', 'dcl.dono') + campo('Próxima ação', 'dcl.proximaAcao') + campo('Prazo da próxima ação', 'dcl.prazo', { tipo: 'date' }) +
      campo('Blocker', 'dcl.blocker', { ph: 'O que impede avançar' }) + campo('Probabilidade de fechamento (%)', 'dcl.probabilidade', { tipo: 'number' }) +
      campo('Apoio necessário', 'dcl.apoio', { ph: 'Ex.: Operações, Jurídico, Marketing' }) + campo('Sponsor executivo (obrigatório se Cluster Fit > 85)', 'dcl.sponsor') +
      campo('Próxima revisão', 'dcl.proximaRevisao', { tipo: 'date' }) + campo('Critério de matar ou pausar', 'dcl.criterioKill', { tipo: 'area', cheio: true, ph: 'Ex.: sem resposta após 3 tentativas; viabilidade inviável; receita base abaixo do custo da praça' }) + '</div></div>';
    html += '<div class="card"><h2>Registro no pipeline</h2>' + live('dcl', function () {
      var r = deal(ev);
      var o = '<table>' + [['Estágio', h(r.estagio) + ' <small>(etapa: ' + h(etapaNome(ev)) + ')</small>'], ['Decisão', seloDec(r)], ['Cluster / batalha', (r.cluster ? h(r.cluster) : falta('cluster')) + ' · ' + (r.batalha ? h(r.batalha) : falta('batalha'))],
        ['Cluster Fit', r.cluster_fit_score === null ? falta('nota de fit') : r.cluster_fit_score], ['Event Occupancy Score', r.event_occupancy_score === null ? falta('score em aberto') : r.event_occupancy_score],
        ['Impacto financeiro (receita base do shopping)', brl(r.impacto_financeiro_estimado, 'simulação incompleta')], ['Impacto ponderado pela probabilidade', brl(r.impacto_ponderado, 'impacto ou probabilidade')],
        ['Última atualização', r.ultima_atualizacao ? data(r.ultima_atualizacao) : '—']].map(function (l) { return '<tr><th>' + l[0] + '</th><td>' + l[1] + '</td></tr>'; }).join('') + '</table>';
      if (r.alertas.length) o += '<h3>Regras do Deal Conversion acionadas</h3><ul>' + r.alertas.map(function (a) { return '<li>' + h(a.txt) + '</li>'; }).join('') + '</ul>';
      if (r.faltas.length) o += '<ul>' + r.faltas.map(function (f) { return '<li>' + falta(f) + '</li>'; }).join('') + '</ul>';
      return o;
    }) + '</div>';
    return html;
  };

  abasEvento.viabilidade = function (ev) {
    var regrasHtml = S.caderno.regras.length ? '<table><tr><th>Regra</th><th>Tipo</th><th>Avaliação</th></tr>' + S.caderno.regras.map(function (g) {
      return '<tr><td>' + h(g.texto) + '</td><td>' + (g.obrigatoria ? 'Obrigatória' : 'Recomendação') + '</td><td>' + campo('', 'regras.' + g.id, { nu: 1, opts: [['atende', 'Atende'], ['nao', 'Não atende'], ['na', 'Não se aplica']] }) + '</td></tr>';
    }).join('') + '</table>' : '<div class="vazio">Nenhuma regra no caderno técnico. <a href="#/shopping">Cadastrar</a></div>';
    return '<div class="card"><h2>Parecer</h2>' + live('viab', function () {
      var v = viab(ev), msg = { apto: 'Evento atende à área, ao caderno técnico e ao checklist.', pendente: 'Há ' + v.faltas + ' item(ns) sem dado ou sem avaliação. O evento não pode ser liberado para montagem.', inviavel: v.falhas + ' item(ns) em desacordo. Ajuste o projeto, troque de área ou reprove.' }[v.veredito];
      return '<p>' + selo(VER[v.veredito][0], VER[v.veredito][1]) + ' ' + h(msg) + '</p><table><tr><th>Item</th><th>Situação</th><th>Detalhe</th></tr>' + v.itens.filter(function (i) { return !i.regra; }).map(function (i) {
        return '<tr><td>' + h(i.item) + '</td><td>' + selo(i.status, { ok: 'OK', falha: 'Falha', falta: 'Falta dado' }[i.status]) + '</td><td>' + h(i.detalhe) + '</td></tr>';
      }).join('') + '</table>';
    }) + '</div><div class="card"><h2>Regras de segurança e do caderno técnico</h2>' + (S.caderno.linkCaderno ? '<p><a href="' + h(S.caderno.linkCaderno) + '" target="_blank" rel="noopener">Abrir caderno técnico</a></p>' : '') + regrasHtml + '</div>';
  };

  abasEvento.fluxo = function (ev) {
    var idx = etapaIdx(ev), canc = ev.etapa === 'cancelado';
    var html = '<div class="card"><div class="cab"><h2>Fluxo de negociação</h2><div class="acoes">' +
      (canc ? '<button data-action="reabrir">Reabrir evento</button>' : '<button data-action="voltar-etapa"' + (idx <= 0 ? ' disabled' : '') + '>← Voltar etapa</button><button class="pri" data-action="avancar-etapa"' + (idx >= D.ETAPAS.length - 1 ? ' disabled' : '') + '>Avançar etapa →</button><button class="perigo" data-action="cancelar-evento">Cancelar evento</button>') +
      '</div></div><p class="sub">A montagem só é liberada com viabilidade "Apto" e contrato assinado.</p><ol class="fluxo">';
    D.ETAPAS.forEach(function (et, i) {
      var reg = ev.historico.filter(function (x) { return x.etapa === et.id; }).pop();
      html += '<li class="' + (!canc && i < idx ? 'feito' : !canc && i === idx ? 'atual' : '') + '"><span class="bola">' + (!canc && i < idx ? '✓' : i + 1) + '</span><div><div class="tit">' + h(et.nome) + (reg ? ' <small>· desde ' + data(reg.data) + '</small>' : '') +
        '</div><small>' + h(et.desc) + '</small><ul>' + et.tarefas.map(function (t, j) { return '<li><label>' + check('tarefas.' + et.id + ':' + j) + ' ' + h(t) + '</label></li>'; }).join('') + '</ul></div></li>';
    });
    return html + '</ol></div>';
  };

  abasEvento.contrato = function (ev) {
    var c = ev.contrato;
    return '<div class="card"><h2>Contrato</h2><div class="grade">' + campo('Tipo de contrato', 'contrato.tipo', { opts: D.CONTRATO_TIPOS }) + campo('Número / referência', 'contrato.numero') +
      campo('Status', 'contrato.status', { opts: D.CONTRATO_STATUS, semVazio: 1 }) + campo('Plataforma de assinatura / link', 'contrato.plataforma') + campo('Condições e observações', 'contrato.obs', { tipo: 'area', cheio: true }) + '</div></div>' +
      '<div class="card"><h2>Assinaturas</h2>' + (c.signatarios.length ? '<div class="rolagem"><table><tr><th>Nome</th><th>Papel</th><th>Status</th><th>Data</th><th></th></tr>' + c.signatarios.map(function (s, i) {
        var p = 'contrato.signatarios.' + i + '.';
        return '<tr><td>' + campo('', p + 'nome', { nu: 1 }) + '</td><td>' + campo('', p + 'papel', { nu: 1, opts: ['Shopping — representante legal', 'Shopping — testemunha', 'Operador — representante legal', 'Operador — testemunha', 'Fiador / garantidor', 'Outro'] }) +
          '</td><td>' + campo('', p + 'status', { nu: 1, semVazio: 1, opts: [['pendente', 'Pendente'], ['enviado', 'Enviado'], ['assinado', 'Assinado']] }) + '</td><td>' + campo('', p + 'data', { nu: 1, tipo: 'date' }) +
          '</td><td><button class="mini perigo" data-action="rm" data-lista="contrato.signatarios" data-i="' + i + '">Remover</button></td></tr>';
      }).join('') + '</table></div>' : '<div class="vazio">Nenhum signatário.</div>') + '<p><button data-action="add-signatario">+ Signatário</button></p></div>';
  };

  abasEvento.documentos = function (ev) {
    return '<div class="card"><h2>Checklist de documentos para abertura</h2>' + live('docs-resumo', function () {
      var ob = ev.docs.filter(function (d) { return d.obrigatorio; }), okk = ob.filter(function (d) { return d.status === 'aprovado' || d.status === 'na'; }).length;
      return '<p class="sub">' + okk + ' de ' + ob.length + ' obrigatórios aprovados ou não aplicáveis.</p>';
    }) + '<div class="rolagem"><table><tr><th>Documento</th><th>Quando se aplica</th><th>Obrig.</th><th>Status</th><th>Validade</th><th>Observação / link</th><th></th></tr>' + ev.docs.map(function (d, i) {
      var p = 'docs.' + i + '.';
      return '<tr><td>' + campo('', p + 'nome', { nu: 1 }) + '</td><td><small>' + h(d.quando) + '</small></td><td>' + check(p + 'obrigatorio') + '</td><td>' +
        campo('', p + 'status', { nu: 1, semVazio: 1, opts: [['pendente', 'Pendente'], ['recebido', 'Recebido'], ['aprovado', 'Aprovado'], ['na', 'Não se aplica']] }) + '</td><td>' + campo('', p + 'validade', { nu: 1, tipo: 'date' }) +
        '</td><td>' + campo('', p + 'obs', { nu: 1 }) + '</td><td><button class="mini perigo" data-action="rm" data-lista="docs" data-i="' + i + '">Remover</button></td></tr>';
    }).join('') + '</table></div><p><button data-action="add-doc">+ Documento</button></p></div>';
  };

  function linhasSim(lista, titulo, rotQtd, ph) {
    var ev = raiz;
    return '<h3>' + titulo + '</h3>' + (ev.sim[lista].length ? '<div class="rolagem"><table><tr><th>Descrição</th><th>' + rotQtd + '</th><th>Valor unitário (R$)</th><th>% que fica com o shopping</th><th></th></tr>' + ev.sim[lista].map(function (l, i) {
      var p = 'sim.' + lista + '.' + i + '.';
      return '<tr><td>' + campo('', p + 'descricao', { nu: 1, ph: ph }) + '</td><td>' + campo('', p + 'qtd', { nu: 1, tipo: 'number' }) + '</td><td>' + campo('', p + 'valor', { nu: 1, tipo: 'number' }) + '</td><td>' + campo('', p + 'pctShopping', { nu: 1, tipo: 'number' }) +
        '</td><td><button class="mini perigo" data-action="rm" data-lista="sim.' + lista + '" data-i="' + i + '">Remover</button></td></tr>';
    }).join('') + '</table></div>' : '') + '<p><button data-action="add-linha" data-lista="' + lista + '">+ Linha</button></p>';
  }

  abasEvento.simulador = function (ev) {
    var s = ev.sim, dd = C.diasEntre(ev.inicio, ev.fim);
    var html = '<p class="nota">O simulador só calcula com o que você informar. Ocupação, ticket e valores devem vir de histórico do operador, propostas ou tabela comercial do shopping — o app não estima médias de mercado.</p>';
    html += '<div class="card"><h2>Bilheteria</h2><div class="grade">' + campo('Evento tem bilheteria?', 'sim.temBilheteria', { opts: SN, rr: 1 }) + campo('Dias de operação' + (dd ? ' (datas = ' + dd + ')' : ''), 'sim.dias', { tipo: 'number', ph: dd || '' });
    if (s.temBilheteria === 'sim') html += campo('Sessões por dia', 'sim.sessoesDia', { tipo: 'number' }) + campo('Capacidade por sessão (pessoas)', 'sim.capacidadeSessao', { tipo: 'number' }) + campo('Ticket médio (R$)', 'sim.ticketMedio', { tipo: 'number' }) +
      campo('Ocupação pessimista (%)', 'sim.ocupPess', { tipo: 'number' }) + campo('Ocupação base (%)', 'sim.ocupBase', { tipo: 'number' }) + campo('Ocupação otimista (%)', 'sim.ocupOtim', { tipo: 'number' }) + campo('% do shopping sobre a bilheteria', 'sim.pctBilheteria', { tipo: 'number' });
    html += '</div></div><div class="card"><h2>Locação</h2><div class="grade">' + campo('Modelo de locação', 'sim.locacaoModelo', { rr: 1, opts: [['fixo', 'Valor fixo pelo período'], ['m2dia', 'Valor por m² por dia'], ['nenhuma', 'Sem locação (só variável)']] });
    if (s.locacaoModelo === 'fixo') html += campo('Valor fixo de locação (R$)', 'sim.aluguelFixo', { tipo: 'number' });
    if (s.locacaoModelo === 'm2dia') html += campo('Valor por m²/dia (R$)', 'sim.valorM2Dia', { tipo: 'number' });
    html += campo('Locação × % da bilheteria', 'sim.regraBilheteria', { semVazio: 1, opts: [['soma', 'Somar os dois'], ['maior', 'O maior entre os dois (mínimo garantido)']] }) + campo('Custos do shopping com o evento (R$, opcional)', 'sim.custosShopping', { tipo: 'number' }) + '</div></div>';
    html += '<div class="card"><h2>Sublocação e mídia</h2>' + linhasSim('sublocacoes', 'Sublocação (estandes, quiosques, food trucks, espaços dentro do evento)', 'Qtd.', 'Ex.: estande 3×3') +
      linhasSim('midias', 'Mídia e patrocínio (cotas, naming, painéis, ativações)', 'Qtd. de cotas', 'Ex.: cota master') + '</div>';
    html += '<div class="card"><h2>Resultado estimado</h2>' + live('sim', function () {
      var r = simu(ev), o = '';
      o += '<div class="rolagem"><table><tr><th></th>' + r.cenarios.map(function (c) { return '<th class="n">' + c.nome + (c.ocupacao !== null ? ' (' + c.ocupacao + '%)' : '') + '</th>'; }).join('') + '</tr>';
      function linha(rot, f, cls) { return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + rot + '</td>' + r.cenarios.map(function (c) { return '<td class="n">' + f(c) + '</td>'; }).join('') + '</tr>'; }
      if (s.temBilheteria === 'sim') {
        o += linha('Público pagante', function (c) { return n(c.publico, 'público'); });
        o += linha('Bilheteria bruta potencial (operador)', function (c) { return brl(c.bilheteria, 'bilheteria'); });
        o += linha('Parte do shopping na bilheteria', function (c) { return brl(c.parteBilheteria, '% bilheteria'); });
      }
      o += linha('Locação', function () { return brl(r.locacao, 'locação'); });
      if (s.temBilheteria === 'sim' && s.regraBilheteria === 'maior') o += linha('→ Aplicado (maior entre locação e % bilheteria)', function (c) { return brl(c.locacaoMaisBilheteria, 'dados'); });
      o += linha('Sublocação — bruta', function () { return brl(r.sublocacaoBruta, 'sublocação'); });
      o += linha('Sublocação — parte do shopping', function () { return brl(r.sublocacaoShopping, 'sublocação'); });
      o += linha('Mídia — bruta', function () { return brl(r.midiaBruta, 'mídia'); });
      o += linha('Mídia — parte do shopping', function () { return brl(r.midiaShopping, 'mídia'); });
      o += linha('Receita total do shopping', function (c) { return brl(c.total, 'dados incompletos'); }, 'total');
      if (r.custos !== null) o += linha('Resultado após custos do shopping', function (c) { return brl(c.liquido, 'dados incompletos'); }, 'total');
      o += '</table></div>';
      if (r.faltas.length) o += '<h3>Dados que faltam para fechar a simulação</h3><ul>' + r.faltas.map(function (f) { return '<li>' + falta(f) + '</li>'; }).join('') + '</ul>';
      return o;
    }) + '</div>';
    return html;
  };

  function contextoShopping() {
    var sh = S.shopping;
    return 'Shopping: ' + (sh.nome || '[FALTA: nome do shopping]') + '\nEndereço: ' + (sh.endereco || '[FALTA: endereço]') + ' — ' + (sh.cidade || '[FALTA: cidade]') + '/' + (sh.uf || '[FALTA: UF]') +
      '\nRaio de análise: ' + (sh.raioKm !== null && sh.raioKm !== '' ? sh.raioKm + ' km' : '[FALTA: raio em km]') + '\nPerfil de público: ' + (sh.perfil || '[FALTA: perfil]') +
      (sh.fluxoMensal ? '\nFluxo mensal informado: ' + sh.fluxoMensal + ' visitantes' : '');
  }
  var REGRAS_PROMPT = '\n\nRegras da resposta:\n- Só inclua informação com fonte verificável e traga o link de cada fonte.\n- Não estime números, valores ou médias de mercado. Dado não encontrado vira [FALTA: dado].\n- Se não tiver certeza, diga "não sei" e explique por quê.\n- Diferencie fato (com fonte) de hipótese.';

  function promptMidia(ev) {
    var a = porId(S.areas, ev.areaId), r = simu(ev), pub = r.cenarios[1].publico;
    var cotas = ev.sim.midias.filter(function (m) { return m.descricao; }).map(function (m) { return m.descricao; }).join(', ');
    return 'Atue como analista de mídia e patrocínio de eventos em shopping centers.\n\n' + contextoShopping() +
      '\nEntorno conhecido: ' + (S.shopping.entorno || '[FALTA: descrição do entorno]') +
      '\n\nEvento: ' + ev.nome + '\nTema: ' + (ev.tema || '[FALTA: tema]') + '\nDescrição: ' + (ev.descricao || '[FALTA: descrição]') +
      '\nPeríodo: ' + (ev.inicio ? data(ev.inicio) + ' a ' + data(ev.fim) : '[FALTA: datas]') + '\nLocal no shopping: ' + (a ? a.nome + ' (' + (a.tipo || 'tipo não informado') + ')' : '[FALTA: área]') +
      '\nPúblico previsto no cenário base: ' + (pub !== null ? Math.round(pub) + ' pessoas (simulação interna)' : '[FALTA: público previsto]') + '\nFormatos de mídia disponíveis: ' + (cotas || '[FALTA: cotas de mídia]') +
      '\n\nTarefa: pesquise e liste potenciais anunciantes e patrocinadores para este evento, com base em:\n1. Investimentos recentes e em andamento no entorno (dentro do raio): lançamentos imobiliários, novas lojas e concessionárias, redes de saúde e educação, academias, bancos e fintechs, obras e concessões públicas, indústrias e empregadores relevantes.\n2. O momento: sazonalidade do período do evento, datas comerciais, campanhas e lançamentos de marcas previstos para a janela.\n3. Afinidade de marca com o tema e com o perfil de público do shopping.\n4. Marcas que patrocinaram eventos semelhantes na região ou em outros shoppings.\n\nPara cada anunciante potencial, traga: nome; segmento; por que agora (gatilho de investimento ou de momento, com fonte e data); afinidade com o evento; formato de mídia sugerido entre os disponíveis; área/cargo a abordar (marketing, trade, regional); fonte (link).\n\nOrganize em três grupos: (A) investimentos do entorno, (B) momento/sazonalidade, (C) afinidade com o tema. Ao final, indique os 5 com maior probabilidade de fechamento e o motivo.' + REGRAS_PROMPT;
  }

  abasEvento.midia = function (ev) {
    var p = promptMidia(ev);
    return '<div class="card"><h2>Prompt de pesquisa de anunciantes</h2><p class="sub">Gerado com os dados do shopping, do entorno e deste evento. Cole em um assistente com busca na web (Claude, Perplexity etc.). As cotas de mídia são definidas na aba Simulador.</p><pre class="prompt" id="prompt-txt">' + h(p) +
      '</pre><div class="acoes"><button class="pri" data-action="copiar-prompt">Copiar prompt</button><a class="btn" href="#/shopping">Editar entorno do shopping</a></div></div>' +
      '<div class="card"><h2>Anunciantes prospectados</h2>' + ((ev.anunciantes || []).length ? '<div class="rolagem"><table><tr><th>Anunciante</th><th>Gatilho / por que agora</th><th>Fonte (link)</th><th>Status</th><th></th></tr>' + ev.anunciantes.map(function (x, i) {
        var q = 'anunciantes.' + i + '.';
        return '<tr><td>' + campo('', q + 'nome', { nu: 1 }) + '</td><td>' + campo('', q + 'gatilho', { nu: 1 }) + '</td><td>' + campo('', q + 'fonte', { nu: 1 }) + '</td><td>' +
          campo('', q + 'status', { nu: 1, semVazio: 1, opts: ['A abordar', 'Contatado', 'Proposta enviada', 'Fechado', 'Recusou'] }) + '</td><td><button class="mini perigo" data-action="rm" data-lista="anunciantes" data-i="' + i + '">Remover</button></td></tr>';
      }).join('') + '</table></div>' : '<div class="vazio">Nenhum anunciante registrado.</div>') + '<p><button data-action="add-anunciante">+ Anunciante</button></p></div>';
  };

  telas.operadores = function (id) {
    if (id) {
      var o = porId(S.operadores, id);
      if (!o) return '<p>Operador não encontrado. <a href="#/operadores">Voltar</a></p>';
      raiz = o;
      var evs = S.eventos.filter(function (e) { return e.operadorId === o.id; });
      return '<div class="cab"><div><h1>' + h(o.nome) + '</h1><p class="sub"><a href="#/operadores">← Operadores</a></p></div><div class="acoes"><button class="pri" data-action="evento-do-operador" data-id="' + o.id + '">Criar evento com este operador</button><button class="perigo" data-action="del-operador" data-id="' + o.id + '">Excluir</button></div></div>' +
        '<div class="card"><div class="grade">' + campo('Nome', 'nome') + campo('Tema principal', 'tema', { opts: S.temas }) + campo('Estágio no pipeline', 'estagio', { opts: D.PIPELINE, semVazio: 1 }) + campo('Cidade', 'cidade') +
        campo('Distância do shopping (km)', 'distanciaKm', { tipo: 'number' }) + campo('Site / Instagram', 'site') + campo('Contato', 'contato') + campo('Fonte da informação (link)', 'fonte') + campo('Notas e histórico de eventos', 'notas', { tipo: 'area', cheio: true }) + '</div></div>' +
        '<div class="card"><h2>Eventos</h2>' + (evs.length ? '<ul>' + evs.map(function (e) { return '<li><a href="#/eventos/' + e.id + '">' + h(e.nome) + '</a> — ' + h(etapaNome(e)) + '</li>'; }).join('') + '</ul>' : '<div class="vazio">Nenhum evento com este operador.</div>') + '</div>';
    }
    var html = '<div class="cab"><div><h1>Operadores</h1><p class="sub">Pipeline de operadores e produtoras de eventos.</p></div><div class="acoes"><a class="btn" href="#/prospeccao">Buscar novos no raio</a><button class="pri" data-action="add-operador">+ Novo operador</button></div></div>';
    if (!S.operadores.length) return html + '<div class="card vazio">Pipeline vazio. Use <a href="#/prospeccao">Prospecção no raio</a> para encontrar operadores.</div>';
    return html + '<div class="kanban">' + D.PIPELINE.map(function (st) {
      var l = S.operadores.filter(function (o) { return o.estagio === st; });
      return '<div class="col"><h3>' + st + ' <span class="selo">' + l.length + '</span></h3>' + l.map(function (o) {
        return '<a class="item" href="#/operadores/' + o.id + '"><b>' + h(o.nome) + '</b><small>' + h(o.tema || 'tema não informado') + '</small><small>' + h(o.cidade) + (o.distanciaKm !== null ? ' · ' + o.distanciaKm + ' km' : '') + '</small></a>';
      }).join('') + '</div>';
    }).join('') + '</div>';
  };

  var prosp = { tema: '' };
  function promptOperadores(tema) {
    var areas = S.areas.map(function (a) {
      return '- ' + a.nome + ' (' + (a.tipo || 'tipo não informado') + '): ' + (a.metragem !== null ? a.metragem + ' m²' : '[FALTA: metragem]') + ', pé-direito ' + (a.peDireitoLivre === 'sim' ? 'céu aberto' : a.peDireito !== null ? a.peDireito + ' m' : '[FALTA]') +
        ', energia ' + (a.energia.disponivel === 'nao' ? 'sem ponto' : a.energia.cargaKva !== null ? a.energia.cargaKva + ' kVA' : '[FALTA]') + ', água ' + (a.agua || '[FALTA]') + ', esgoto ' + (a.esgoto || '[FALTA]');
    }).join('\n') || '[FALTA: áreas cadastradas]';
    var ja = S.operadores.map(function (o) { return o.nome; }).join(', ');
    return 'Atue como analista de prospecção de eventos para shopping centers.\n\n' + contextoShopping() + '\n\nÁreas disponíveis para eventos:\n' + areas +
      '\n\nTema buscado: ' + (tema || 'todos os temas de eventos temporários para shopping') + (ja ? '\nJá estão no nosso pipeline (não repetir): ' + ja : '') +
      '\n\nTarefa: encontre operadores, produtoras e promotores de eventos deste tema com sede ou atuação dentro do raio informado, e também operadores itinerantes que já passaram por shoppings ou espaços da região. Priorize quem tem evento compatível com as áreas acima.\n\nPara cada operador, traga: nome; tema; cidade-sede; distância aproximada do shopping em km (somente se der para calcular pelo endereço; senão [FALTA]); site ou Instagram; contato comercial público; eventos realizados recentemente (local, data, link); necessidades técnicas típicas se divulgadas.\n\nDepois da lista comentada, devolva também um bloco JSON neste formato exato, para importação:\n[{"nome":"","tema":"","cidade":"","distanciaKm":null,"site":"","contato":"","fonte":"","notas":""}]' + REGRAS_PROMPT;
  }
  telas.prospeccao = function () {
    raiz = prosp;
    var sh = S.shopping, local = [sh.endereco, sh.cidade, sh.uf].filter(Boolean).join(', ');
    var tema = prosp.tema, termos = ['produtora de eventos', 'operador de eventos itinerantes', 'promotor de feiras'];
    var html = '<h1>Prospecção no raio</h1><p class="sub">Busca de novos operadores no raio do shopping' + (sh.raioKm ? ' (' + h(sh.raioKm) + ' km)' : '') + ' para ampliar o pipeline.</p>';
    if (!local || !sh.raioKm) html += '<p class="nota">Preencha endereço, cidade e raio em <a href="#/shopping">Shopping &amp; caderno técnico</a> para a busca sair completa.</p>';
    html += '<div class="card"><div class="grade">' + campo('Tema', 'tema', { opts: S.temas, rr: 1 }) + '</div><h3>Buscas diretas</h3><ul>' + termos.map(function (t) {
      var q = (t + ' ' + tema + ' ' + (sh.cidade || '')).replace(/\s+/g, ' ').trim();
      return '<li>' + h(q) + ' — <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q + (local ? ' perto de ' + local : '')) + '">Google Maps</a> · <a target="_blank" rel="noopener" href="https://www.google.com/search?q=' + encodeURIComponent(q) + '">Google</a></li>';
    }).join('') + '</ul></div>';
    html += '<div class="card"><h2>Prompt de pesquisa de operadores</h2><p class="sub">Cole em um assistente com busca na web. A resposta traz um bloco JSON que você importa abaixo.</p><pre class="prompt" id="prompt-txt">' + h(promptOperadores(tema)) + '</pre><button class="pri" data-action="copiar-prompt">Copiar prompt</button></div>';
    html += '<div class="card"><h2>Importar operadores (JSON)</h2><textarea id="import-ops" placeholder=\'[{"nome":"...","tema":"...","cidade":"...","distanciaKm":null,"site":"","contato":"","fonte":"","notas":""}]\'></textarea><p><button class="pri" data-action="importar-ops">Importar para o pipeline</button></p></div>';
    return html;
  };

  telas.deal = function () {
    var regs = S.eventos.map(function (e) { return { ev: e, r: deal(e) }; });
    var html = '<div class="cab"><div><h1>Deal Conversion</h1><p class="sub">Eventos no pipeline do Shopping Inteligente OS: estágio, dono, próxima ação, prazo, blocker, probabilidade, impacto e decisão.</p></div>' +
      '<div class="acoes"><button data-action="dcl-csv">Baixar CSV</button><button data-action="dcl-json">Baixar JSON</button><button class="pri" data-action="dcl-md">Copiar para o comitê</button></div></div>';
    if (!regs.length) return html + '<div class="card vazio">Nenhum evento cadastrado.</div>';
    var ativos = regs.filter(function (x) { return x.r.estagio !== 'Lost / Parked'; });
    var semDono = ativos.filter(function (x) { return x.r.alertas.some(function (a) { return a.nivel === 'risco'; }); }).length;
    var rebaixar = ativos.filter(function (x) { return x.r.alertas.some(function (a) { return a.nivel === 'rebaixar'; }); }).length;
    var pond = 0, comPond = 0;
    ativos.forEach(function (x) { if (x.r.impacto_ponderado !== null) { pond += x.r.impacto_ponderado; comPond++; } });
    html += '<div class="kpis"><div class="kpi"><b>' + ativos.length + '</b><span>eventos ativos no pipeline</span></div><div class="kpi"><b>' + semDono + '</b><span>sem dono</span></div>' +
      '<div class="kpi"><b>' + rebaixar + '</b><span>sem próxima ação em até 7 dias</span></div><div class="kpi"><b>' + (comPond ? brl(pond) : '—') + '</b><span>impacto ponderado (' + comPond + ' de ' + ativos.length + ' com receita e probabilidade)</span></div></div>';
    html += '<div class="card rolagem"><table><tr><th>Oportunidade</th><th>Estágio</th><th>Dono</th><th>Próxima ação</th><th>Prazo</th><th>Blocker</th><th class="n">Prob.</th><th class="n">Impacto</th><th class="n">Cluster Fit</th><th class="n">EOS</th><th>Apoio</th><th>Decisão</th></tr>' +
      regs.map(function (x) {
        var r = x.r;
        return '<tr><td><a href="#/eventos/' + x.ev.id + '/deal">' + h(r.nome) + '</a><br><small>' + h(r.batalha || '') + '</small></td><td>' + h(r.estagio) + '</td><td>' + (r.dono ? h(r.dono) : falta('dono')) + '</td><td>' + (r.proxima_acao ? h(r.proxima_acao) : falta('próxima ação')) +
          '</td><td>' + (r.prazo ? data(r.prazo) : falta('prazo')) + '</td><td>' + h(r.blocker) + '</td><td class="n">' + (r.probabilidade_fechamento === null ? falta('%') : r.probabilidade_fechamento + '%') +
          '</td><td class="n">' + brl(r.impacto_financeiro_estimado, 'simulação') + '</td><td class="n">' + (r.cluster_fit_score === null ? falta('fit') : r.cluster_fit_score) + '</td><td class="n">' + (r.event_occupancy_score === null ? falta('score') : r.event_occupancy_score) +
          '</td><td>' + h(r.apoio_necessario) + '</td><td>' + seloDec(r) + (r.alertas.length ? '<br><small>' + r.alertas.map(function (a) { return h(a.txt); }).join('<br>') + '</small>' : '') + '</td></tr>';
      }).join('') + '</table></div>';
    html += '<p class="sub">Estágio: Prospecção → Lead · Qualificação → Qualified Lead · Visita técnica → Meeting Done · Viabilidade → Technical Feasibility · Proposta → Proposal · Minuta e Assinaturas → Contract Negotiation · Documentação → Contract Signed · Montagem → Construction / Obra · Operação → Opening · Encerramento → Performance Review · Cancelado → Lost / Parked. Conversion Score fica em branco: o app não tem os dados para calculá-lo.</p>';
    return html;
  };
  function mdComite() {
    var linhas = S.eventos.map(deal).filter(function (r) { return r.estagio !== 'Lost / Parked'; });
    function c(v, o) { return v === null || v === undefined || v === '' ? '[FALTA: ' + o + ']' : String(v).replace(/\|/g, '/'); }
    return '# Deal Conversion — Eventos' + (S.shopping.nome ? ' — ' + S.shopping.nome : '') + '\n\nData: ' + data(hoje()) + ' · Cluster do shopping: ' + c(S.shopping.cluster, 'cluster') + '\n\n' +
      '| Oportunidade | Estágio | Dono | Próxima ação | Prazo | Blocker | Probabilidade | Impacto financeiro | Cluster Fit | EOS | Apoio necessário | Decisão |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n' +
      linhas.map(function (r) {
        return '| ' + [c(r.nome, 'nome'), r.estagio, c(r.dono, 'dono'), c(r.proxima_acao, 'próxima ação'), r.prazo ? data(r.prazo) : '[FALTA: prazo]', r.blocker || '—',
          r.probabilidade_fechamento === null ? '[FALTA: %]' : r.probabilidade_fechamento + '%',
          r.impacto_financeiro_estimado === null ? '[FALTA: simulação]' : r.impacto_financeiro_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          c(r.cluster_fit_score, 'fit'), c(r.event_occupancy_score, 'score'), r.apoio_necessario || '—', r.decisao].join(' | ') + ' |';
      }).join('\n') + '\n';
  }
  function baixar(nome, conteudo, tipo) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([conteudo], { type: tipo })); a.download = nome; a.click();
  }

  telas.dados = function () {
    return '<h1>Backup</h1><p class="sub">Os dados ficam apenas neste navegador. Exporte para guardar ou levar para outro computador. Arquivos de planta não entram no backup — use o campo de link da planta para isso.</p>' +
      '<div class="card"><h2>Exportar</h2><button class="pri" data-action="exportar">Baixar backup (.json)</button></div>' +
      '<div class="card"><h2>Importar</h2><p class="sub">Substitui todos os dados atuais pelos do arquivo.</p><input type="file" accept="application/json" id="import-backup"></div>';
  };

  /* ---------- roteador / render ---------- */
  function rota() { var p = (location.hash || '#/painel').slice(2).split('/'); return { tela: telas[p[0]] ? p[0] : 'painel', id: p[1], aba: p[2] }; }
  function render() {
    var r = rota(), y = window.scrollY;
    liveFns = {}; raiz = null;
    app.innerHTML = telas[r.tela](r.id, r.aba);
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('ativo', a.dataset.nav === r.tela); });
    document.getElementById('shopping-nome').textContent = S.shopping.nome || '';
    document.getElementById('nav').classList.remove('aberta');
    if (r.tela === 'areas' && r.id) { var a = porId(S.areas, r.id); if (a) mostrarPlanta(a); }
    window.scrollTo(0, render.mesma === location.hash ? y : 0);
    render.mesma = location.hash;
  }
  function atualizarLive() {
    Object.keys(liveFns).forEach(function (k) { var el = app.querySelector('[data-live="' + k + '"]'); if (el) el.innerHTML = liveFns[k](); });
  }

  /* ---------- eventos de UI ---------- */
  app.addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset.planta) {
      var f = el.files[0], ar = porId(S.areas, el.dataset.planta);
      if (f) plantaOp('readwrite', function (st) { return st.put({ nome: f.name, blob: f }, ar.id); }).then(function () { toast('Planta salva neste navegador'); mostrarPlanta(ar); }, function () { toast('Não foi possível salvar a planta'); });
      return;
    }
    if (el.id === 'import-backup') {
      var arq = el.files[0];
      if (arq && confirm('Importar substitui TODOS os dados atuais. Continuar?') && confirm('Confirma a substituição? Esta ação não pode ser desfeita.')) arq.text().then(function (t) {
        var d = JSON.parse(t);
        if (!d.shopping || !Array.isArray(d.eventos) || !Array.isArray(d.areas)) throw new Error('formato');
        S = migrar(d); salvar(); toast('Backup importado'); location.hash = '#/painel'; render();
      }).catch(function () { toast('Arquivo inválido'); });
      return;
    }
    if (!el.dataset.b || !raiz) return;
    var v = el.type === 'checkbox' ? el.checked : el.type === 'number' ? C.num(el.value) : el.value;
    gravar(raiz, el.dataset.b, v);
    if (el.dataset.b.indexOf('dcl.') === 0) raiz.dcl.ultimaAtualizacao = hoje();
    if (raiz !== prosp) salvar();
    if (el.dataset.rr) render(); else atualizarLive();
  });

  function confirmar2(msg) { return confirm(msg) && confirm('Confirma mesmo? Esta ação não pode ser desfeita.'); }
  var acoes = {
    'add-area': function () { var a = novaArea(); S.areas.push(a); location.hash = '#/areas/' + a.id; },
    'add-evento': function () { var e = novoEvento(); S.eventos.push(e); location.hash = '#/eventos/' + e.id; },
    'add-operador': function () { var o = novoOperador(); S.operadores.push(o); location.hash = '#/operadores/' + o.id; },
    'evento-do-operador': function (el) { var o = porId(S.operadores, el.dataset.id), e = novoEvento(); e.operadorId = o.id; e.tema = o.tema; e.nome = 'Evento — ' + o.nome; S.eventos.push(e); location.hash = '#/eventos/' + e.id; },
    'add-regra': function () { S.caderno.regras.push({ id: uid(), texto: '', obrigatoria: true }); },
    'add-docmodelo': function () { S.docsModelo.push({ id: uid(), nome: '', obrigatorio: true, quando: '' }); },
    'add-doc': function () { raiz.docs.push({ id: uid(), nome: '', obrigatorio: true, quando: '', status: 'pendente', validade: '', obs: '' }); },
    'add-signatario': function () { raiz.contrato.signatarios.push({ nome: '', papel: '', status: 'pendente', data: '' }); },
    'add-linha': function (el) { raiz.sim[el.dataset.lista].push({ descricao: '', qtd: null, valor: null, pctShopping: null }); },
    'add-anunciante': function () { (raiz.anunciantes = raiz.anunciantes || []).push({ nome: '', gatilho: '', fonte: '', status: 'A abordar' }); },
    'rm': function (el) { if (confirmar2('Remover este item?')) ler(raiz, el.dataset.lista).splice(Number(el.dataset.i), 1); },
    'del-area': function (el) {
      if (S.eventos.some(function (e) { return e.areaId === el.dataset.id; })) return toast('Há eventos vinculados a esta área. Desvincule antes de excluir.');
      if (!confirmar2('Excluir esta área?')) return;
      S.areas = S.areas.filter(function (a) { return a.id !== el.dataset.id; });
      plantaOp('readwrite', function (st) { return st.delete(el.dataset.id); }).catch(function () {});
      location.hash = '#/areas';
    },
    'del-planta': function (el) { if (confirmar2('Remover o arquivo da planta?')) plantaOp('readwrite', function (st) { return st.delete(el.dataset.id); }).then(render); },
    'del-evento': function (el) { if (confirmar2('Excluir este evento e todo o seu histórico?')) { S.eventos = S.eventos.filter(function (e) { return e.id !== el.dataset.id; }); location.hash = '#/eventos'; } },
    'del-operador': function (el) {
      if (S.eventos.some(function (e) { return e.operadorId === el.dataset.id; })) return toast('Há eventos vinculados a este operador.');
      if (confirmar2('Excluir este operador?')) { S.operadores = S.operadores.filter(function (o) { return o.id !== el.dataset.id; }); location.hash = '#/operadores'; }
    },
    'avancar-etapa': function () {
      var ev = raiz, i = etapaIdx(ev), prox = D.ETAPAS[i + 1];
      if (!prox) return;
      var iMont = D.ETAPAS.map(function (x) { return x.id; }).indexOf('montagem');
      if (i + 1 >= iMont) {
        var v = viab(ev);
        if (v.veredito !== 'apto') return toast('Bloqueado: viabilidade técnica "' + VER[v.veredito][1] + '". Resolva os itens na aba Viabilidade.');
        if (ev.contrato.status !== 'Assinado') return toast('Bloqueado: o contrato precisa estar com status "Assinado".');
      }
      ev.etapa = prox.id; ev.historico.push({ etapa: prox.id, data: hoje() }); ev.dcl.ultimaAtualizacao = hoje();
    },
    'voltar-etapa': function () { var ev = raiz, i = etapaIdx(ev); if (i > 0) { ev.etapa = D.ETAPAS[i - 1].id; ev.historico.push({ etapa: ev.etapa, data: hoje() }); } },
    'cancelar-evento': function () { if (confirmar2('Cancelar este evento?')) { raiz.etapaAnterior = raiz.etapa; raiz.etapa = 'cancelado'; raiz.historico.push({ etapa: 'cancelado', data: hoje() }); } },
    'reabrir': function () { raiz.etapa = raiz.etapaAnterior || 'prospeccao'; raiz.historico.push({ etapa: raiz.etapa, data: hoje() }); },
    'copiar-prompt': function () { copiar(document.getElementById('prompt-txt').textContent); return 'semrender'; },
    'importar-ops': function () {
      var t = document.getElementById('import-ops').value, m = t.match(/\[[\s\S]*\]/), l;
      try { l = JSON.parse(m ? m[0] : t); } catch (e) { toast('JSON inválido'); return 'semrender'; }
      if (!Array.isArray(l)) { toast('Esperado: uma lista JSON'); return 'semrender'; }
      var novos = 0;
      l.forEach(function (o) {
        if (!o || !o.nome || S.operadores.some(function (x) { return x.nome.toLowerCase() === String(o.nome).toLowerCase(); })) return;
        S.operadores.push(novoOperador(o)); novos++;
      });
      toast(novos + ' operador(es) importado(s); ' + (l.length - novos) + ' ignorado(s) (duplicado ou sem nome)');
      if (novos) location.hash = '#/operadores';
    },
    'dcl-csv': function () { baixar('deal-conversion-eventos-' + hoje() + '.csv', C.csvDcl(S.eventos.map(deal)), 'text/csv;charset=utf-8'); return 'semrender'; },
    'dcl-json': function () { baixar('deal-conversion-eventos-' + hoje() + '.json', JSON.stringify(S.eventos.map(deal), null, 2), 'application/json'); return 'semrender'; },
    'dcl-md': function () { copiar(mdComite()); return 'semrender'; },
    'exportar': function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
      a.download = 'radar-eventos-' + hoje() + '.json'; a.click(); return 'semrender';
    }
  };

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    if (el.dataset.action === 'menu') return document.getElementById('nav').classList.toggle('aberta');
    var f = acoes[el.dataset.action];
    if (!f) return;
    var antes = location.hash, r = f(el);
    salvar();
    if (r !== 'semrender' && location.hash === antes) render();
  });
  window.addEventListener('hashchange', render);
  render();
})();
