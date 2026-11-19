/* Radar de Eventos — motor de cálculo (simulador e viabilidade técnica).
   Regra central: dado ausente nunca é estimado. Vira "falta" e o total fica nulo. */
(function (root) {
  'use strict';

  function num(v) {
    if (v === '' || v === null || v === undefined) return null;
    var n = Number(v);
    return isNaN(n) ? null : n;
  }

  function diasEntre(inicio, fim) {
    if (!inicio || !fim) return null;
    var a = new Date(inicio + 'T00:00:00Z'), b = new Date(fim + 'T00:00:00Z');
    if (isNaN(a) || isNaN(b) || b < a) return null;
    return Math.round((b - a) / 86400000) + 1;
  }

  function somaLinhas(linhas, faltas, rotulo) {
    var bruto = 0, shopping = 0, incompleto = false;
    (linhas || []).forEach(function (l, i) {
      var q = num(l.qtd), v = num(l.valor), p = num(l.pctShopping);
      if (q === null || v === null || p === null) {
        incompleto = true;
        faltas.push(rotulo + ' — linha ' + (i + 1) + (l.descricao ? ' (' + l.descricao + ')' : '') + ': quantidade, valor ou % do shopping');
        return;
      }
      bruto += q * v;
      shopping += q * v * p / 100;
    });
    return incompleto ? { bruto: null, shopping: null } : { bruto: bruto, shopping: shopping };
  }

  /* sim: parâmetros do simulador do evento; ev: evento (datas, requisitos); area: área vinculada */
  function simular(sim, ev, area) {
    sim = sim || {}; ev = ev || {};
    var faltas = [];
    var dias = num(sim.dias);
    if (dias === null) dias = diasEntre(ev.inicio, ev.fim);
    if (dias === null) faltas.push('dias de operação (ou datas do evento)');

    // Locação
    var locacao = null;
    if (sim.locacaoModelo === 'nenhuma') locacao = 0;
    else if (sim.locacaoModelo === 'fixo') {
      locacao = num(sim.aluguelFixo);
      if (locacao === null) faltas.push('valor fixo de locação');
    } else if (sim.locacaoModelo === 'm2dia') {
      var vm2 = num(sim.valorM2Dia);
      var m2 = num(ev.req && ev.req.areaM2);
      if (m2 === null && area) m2 = num(area.metragem);
      if (vm2 === null) faltas.push('valor de locação por m²/dia');
      if (m2 === null) faltas.push('metragem ocupada (requisito do evento ou metragem da área)');
      if (vm2 !== null && m2 !== null && dias !== null) locacao = vm2 * m2 * dias;
    } else faltas.push('modelo de locação');

    // Sublocação e mídia
    var sub = somaLinhas(sim.sublocacoes, faltas, 'Sublocação');
    var mid = somaLinhas(sim.midias, faltas, 'Mídia');

    // Bilheteria
    var tem = sim.temBilheteria;
    var sess = num(sim.sessoesDia), cap = num(sim.capacidadeSessao), ticket = num(sim.ticketMedio), pct = num(sim.pctBilheteria);
    if (tem === 'sim') {
      if (sess === null) faltas.push('sessões por dia');
      if (cap === null) faltas.push('capacidade por sessão');
      if (ticket === null) faltas.push('ticket médio');
      if (pct === null) faltas.push('% do shopping sobre a bilheteria');
    } else if (tem !== 'nao') faltas.push('evento tem bilheteria? (sim/não)');

    var custos = num(sim.custosShopping);
    var defs = [['Pessimista', 'ocupPess'], ['Base', 'ocupBase'], ['Otimista', 'ocupOtim']];
    var cenarios = defs.map(function (d) {
      var c = { nome: d[0], ocupacao: num(sim[d[1]]), publico: null, bilheteria: null, parteBilheteria: null, total: null, liquido: null };
      if (tem === 'nao') { c.publico = null; c.bilheteria = 0; c.parteBilheteria = 0; }
      else if (tem === 'sim') {
        if (c.ocupacao === null) faltas.push('ocupação do cenário ' + d[0].toLowerCase());
        if (c.ocupacao !== null && dias !== null && sess !== null && cap !== null) {
          c.publico = dias * sess * cap * c.ocupacao / 100;
          if (ticket !== null) {
            c.bilheteria = c.publico * ticket;
            if (pct !== null) c.parteBilheteria = c.bilheteria * pct / 100;
          }
        }
      }
      if (locacao !== null && c.parteBilheteria !== null && sub.shopping !== null && mid.shopping !== null) {
        var base = sim.regraBilheteria === 'maior' ? Math.max(locacao, c.parteBilheteria) : locacao + c.parteBilheteria;
        c.locacaoMaisBilheteria = base;
        c.total = base + sub.shopping + mid.shopping;
        if (custos !== null) c.liquido = c.total - custos;
      }
      return c;
    });

    return {
      dias: dias, locacao: locacao,
      sublocacaoBruta: sub.bruto, sublocacaoShopping: sub.shopping,
      midiaBruta: mid.bruto, midiaShopping: mid.shopping,
      custos: custos, cenarios: cenarios, faltas: faltas
    };
  }

  function sobrepoe(a, b) {
    if (!a.inicio || !a.fim || !b.inicio || !b.fim) return false;
    return a.inicio <= b.fim && b.inicio <= a.fim;
  }

  function conflitos(ev, eventos) {
    return (eventos || []).filter(function (o) {
      return o.id !== ev.id && o.areaId && o.areaId === ev.areaId && o.etapa !== 'cancelado' && sobrepoe(ev, o);
    });
  }

  function comparar(item, req, disp, un, rotuloDisp) {
    if (req === null) return { item: item, status: 'falta', detalhe: 'requisito do evento não informado' };
    if (disp === null) return { item: item, status: 'falta', detalhe: (rotuloDisp || 'dado da área') + ' não cadastrado' };
    var ok = req <= disp;
    return { item: item, status: ok ? 'ok' : 'falha', detalhe: 'evento precisa de ' + req + ' ' + un + ' · disponível ' + disp + ' ' + un };
  }

  function triEstado(item, req, disp) {
    if (req !== 'sim' && req !== 'nao') return { item: item, status: 'falta', detalhe: 'requisito do evento não informado' };
    if (req === 'nao') return { item: item, status: 'ok', detalhe: 'evento não requer' };
    if (disp === 'sim') return { item: item, status: 'ok', detalhe: 'evento requer · área dispõe' };
    if (disp === 'nao') return { item: item, status: 'falha', detalhe: 'evento requer · área NÃO dispõe' };
    return { item: item, status: 'falta', detalhe: 'disponibilidade não cadastrada na área' };
  }

  /* Confronta requisitos do evento com a área e com o caderno técnico. */
  function viabilidade(ev, area, caderno, eventos) {
    var r = [];
    var req = ev.req || {};
    caderno = caderno || {};
    if (!area) {
      r.push({ item: 'Área', status: 'falta', detalhe: 'evento sem área vinculada' });
    } else {
      var en = area.energia || {};
      r.push(comparar('Metragem', num(req.areaM2), num(area.metragem), 'm²'));
      var pe = num(area.peDireito), folga = num(caderno.folgaAlturaM);
      var limite = pe === null ? null : pe - (folga || 0);
      var alt = comparar('Altura da estrutura × pé-direito', num(req.alturaM), limite, 'm', 'pé-direito da área');
      if (folga === null && alt.status !== 'falta') alt.detalhe += ' (folga do caderno técnico não definida — comparado ao pé-direito bruto)';
      if (area.peDireitoLivre === 'sim' && num(req.alturaM) !== null) alt = { item: alt.item, status: 'ok', detalhe: 'área a céu aberto — sem limite de pé-direito cadastrado' };
      r.push(alt);
      var kva = num(req.cargaKva);
      if (kva === null) r.push({ item: 'Energia elétrica', status: 'falta', detalhe: 'carga requerida não informada' });
      else if (kva === 0) r.push({ item: 'Energia elétrica', status: 'ok', detalhe: 'evento não requer energia do shopping' });
      else if (en.disponivel === 'nao') r.push({ item: 'Energia elétrica', status: 'falha', detalhe: 'evento precisa de ' + kva + ' kVA · área sem ponto de energia (avaliar gerador)' });
      else r.push(comparar('Energia elétrica', kva, num(en.cargaKva), 'kVA', 'carga disponível na área'));
      r.push(triEstado('Água', req.agua, area.agua));
      r.push(triEstado('Esgoto', req.esgoto, area.esgoto));
      r.push(comparar('Lotação simultânea', num(req.publicoSimultaneo), num(area.lotacaoMax), 'pessoas', 'lotação máxima da área'));
      if (num(req.cargaPisoKgM2) !== null || num(area.sobrecargaKgM2) !== null)
        r.push(comparar('Sobrecarga no piso', num(req.cargaPisoKgM2), num(area.sobrecargaKgM2), 'kg/m²', 'sobrecarga admissível da área'));
      if (!ev.inicio || !ev.fim) r.push({ item: 'Agenda da área', status: 'falta', detalhe: 'datas do evento não informadas' });
      else {
        var c = conflitos(ev, eventos);
        r.push(c.length
          ? { item: 'Agenda da área', status: 'falha', detalhe: 'conflito de datas com: ' + c.map(function (o) { return o.nome; }).join(', ') }
          : { item: 'Agenda da área', status: 'ok', detalhe: 'sem conflito de datas na área' });
      }
    }
    (caderno.regras || []).forEach(function (g) {
      var m = ev.regras && ev.regras[g.id];
      var st = m === 'atende' ? 'ok' : m === 'na' ? 'ok' : m === 'nao' ? 'falha' : (g.obrigatoria ? 'falta' : 'ok');
      var det = m === 'atende' ? 'atende' : m === 'na' ? 'não se aplica' : m === 'nao' ? 'NÃO atende' : (g.obrigatoria ? 'não avaliada' : 'não avaliada (recomendação)');
      r.push({ item: 'Regra: ' + g.texto, status: st, detalhe: det, regra: true });
    });
    var pend = (ev.docs || []).filter(function (d) { return d.obrigatorio && d.status !== 'aprovado' && d.status !== 'na'; });
    r.push(pend.length
      ? { item: 'Documentos obrigatórios', status: 'falta', detalhe: pend.length + ' pendente(s) de aprovação' }
      : { item: 'Documentos obrigatórios', status: (ev.docs || []).length ? 'ok' : 'falta', detalhe: (ev.docs || []).length ? 'todos aprovados ou não aplicáveis' : 'checklist vazio' });
    var falhas = r.filter(function (x) { return x.status === 'falha'; }).length;
    var faltas = r.filter(function (x) { return x.status === 'falta'; }).length;
    return { itens: r, falhas: falhas, faltas: faltas, veredito: falhas ? 'inviavel' : faltas ? 'pendente' : 'apto' };
  }

  var api = { num: num, diasEntre: diasEntre, simular: simular, viabilidade: viabilidade, conflitos: conflitos };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RadarCalc = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
