/**
 * Motor de apuração de vendas e conciliação com a planilha informada.
 * Puro: recebe lançamentos já parseados, devolve números e divergências.
 */
import { classificarCfop, NATUREZA } from './cfop.js'
import { competenciaLabel, formatarCnpj } from './parsers.js'

export const BASE_DECLARACAO = {
  total: 'Receita bruta total declarada',
  mercadoria: 'Só revenda de mercadorias (exclui serviço com ISS)',
}

export const MEDIDA = {
  valorContabil: 'Valor contábil / total da operação',
  baseCalculo: 'Base de cálculo do ICMS',
}

const CHAVE = (l) => `${l.cnpj || 'SEM-CNPJ'}|${l.competencia || 'SEM-COMP'}`

/**
 * @param {Array} lancamentos
 * @param {object} opts
 *   medida: 'valorContabil' | 'baseCalculo'
 *   overrides: { [cfop]: { natureza, descricao } }
 *   fontePreferida: { [`cnpj|comp|livro`]: fonteId }  — desempate quando há duas origens
 */
export function apurar (lancamentos, opts = {}) {
  const medida = opts.medida || 'valorContabil'
  const overrides = opts.overrides || {}
  const preferida = opts.fontePreferida || {}

  const conflitos = detectarConflitos(lancamentos)
  const usados = lancamentos.filter(l => {
    const k = `${l.cnpj}|${l.competencia}|${l.livro}`
    const c = conflitos.get(k)
    if (!c) return true
    const escolhida = preferida[k] || c.fontes[0].fonteId
    return (l.origem && l.origem.fonteId) === escolhida
  })

  const periodos = new Map()
  for (const l of usados) {
    const k = CHAVE(l)
    if (!periodos.has(k)) {
      periodos.set(k, {
        chave: k,
        cnpj: l.cnpj, cnpjFmt: formatarCnpj(l.cnpj),
        empresa: l.empresa || null,
        competencia: l.competencia,
        competenciaLabel: competenciaLabel(l.competencia),
        vendasBrutas: 0, devolucoes: 0, vendasLiquidas: 0,
        ativo: 0, servicoIss: 0, naoVenda: 0, naoVendaSaidas: 0, naoVendaEntradas: 0, contraLancamento: 0,
        revisar: 0, desconhecido: 0,
        totalEntradas: 0, totalSaidas: 0,
        porCfop: new Map(), alertas: [], livros: new Set(), fontes: new Set(),
        confiancaMinima: 'alta',
      })
    }
    const p = periodos.get(k)
    if (!p.empresa && l.empresa) p.empresa = l.empresa
    if (l.livro) p.livros.add(l.livro)
    if (l.origem && l.origem.arquivo) p.fontes.add(l.origem.arquivo)
    if (l.confianca === 'baixa') p.confiancaMinima = 'baixa'
    else if (l.confianca === 'media' && p.confiancaMinima === 'alta') p.confiancaMinima = 'media'

    if (l.semMovimento || !l.cfop) continue

    const cls = classificarCfop(l.cfop, overrides)
    const valor = Number(l[medida]) || 0

    // coerência entre o CFOP e o livro em que ele foi lançado
    if (l.livro && cls.sentido && ((cls.sentido === 'saida') !== (l.livro === 'saidas'))) {
      p.alertas.push({
        tipo: 'cfop_no_livro_errado', cfop: cls.cfop, valor,
        texto: `CFOP ${cls.cfop} (${cls.sentido}) aparece no livro de ${l.livro}. ${cls.descricao}`,
      })
    }

    if (l.livro === 'entradas') p.totalEntradas += valor
    if (l.livro === 'saidas') p.totalSaidas += valor

    switch (cls.natureza) {
      case NATUREZA.VENDA: p.vendasBrutas += valor; break
      case NATUREZA.DEVOLUCAO_VENDA:
      case NATUREZA.ANULACAO_SAIDA: p.devolucoes += valor; break
      case NATUREZA.ATIVO: p.ativo += valor; break
      case NATUREZA.SERVICO_ISS: p.servicoIss += valor; break
      case NATUREZA.CONTRA_LANCAMENTO: p.contraLancamento += valor; break
      case NATUREZA.REVISAR:
        p.revisar += valor
        p.alertas.push({ tipo: 'exige_revisao', cfop: cls.cfop, valor,
          texto: `CFOP ${cls.cfop} é genérico (${cls.descricao}). ${fmt(valor)} ficou FORA das vendas — confira se deveria entrar.` })
        break
      case NATUREZA.DESCONHECIDO:
        p.desconhecido += valor
        p.alertas.push({ tipo: 'cfop_desconhecido', cfop: cls.cfop, valor,
          texto: `CFOP ${cls.cfop} não está na tabela. ${fmt(valor)} ficou FORA das vendas até você classificá-lo.` })
        break
      default:
        p.naoVenda += valor
        if (l.livro === 'entradas') p.naoVendaEntradas += valor
        else p.naoVendaSaidas += valor
    }

    const pc = p.porCfop.get(cls.cfop) || { cfop: cls.cfop, natureza: cls.natureza, descricao: cls.descricao,
      sentido: cls.sentido, livro: l.livro, valor: 0, base: 0, icms: 0, qtd: 0, fonte: cls.fonte }
    pc.valor += valor
    pc.base += Number(l.baseCalculo) || 0
    pc.icms += Number(l.icms) || 0
    pc.qtd += 1
    p.porCfop.set(cls.cfop, pc)
  }

  for (const p of periodos.values()) {
    p.vendasLiquidas = round2(p.vendasBrutas - p.devolucoes)
    p.vendasBrutas = round2(p.vendasBrutas)
    p.devolucoes = round2(p.devolucoes)
    for (const campo of ['ativo', 'servicoIss', 'naoVenda', 'naoVendaSaidas', 'naoVendaEntradas',
      'contraLancamento', 'revisar', 'desconhecido', 'totalEntradas', 'totalSaidas']) {
      p[campo] = round2(p[campo])
    }
    p.livros = [...p.livros]
    p.fontes = [...p.fontes]
    p.cfops = [...p.porCfop.values()].sort((a, b) => b.valor - a.valor)
    delete p.porCfop
    if (!p.livros.includes('saidas')) {
      p.alertas.push({ tipo: 'sem_livro_saidas',
        texto: 'Nenhum livro de SAÍDAS foi carregado para esta competência — as vendas apuradas podem estar incompletas.' })
    }
    if (!p.livros.includes('entradas')) {
      p.alertas.push({ tipo: 'sem_livro_entradas',
        texto: 'Nenhum livro de ENTRADAS foi carregado — devoluções de venda (que reduzem o faturamento) não foram deduzidas.' })
    }
  }

  return {
    periodos: [...periodos.values()].sort(ordenar),
    conflitos: [...conflitos.values()],
    medida,
  }
}

/**
 * Monta períodos a partir de declarações do Simples Nacional (PGDAS-D).
 *
 * Para empresa do Simples é o extrato — e não o livro de ICMS — que serve de
 * referência contra a venda informada. Não há CFOP aqui: a receita já vem
 * apurada, então não há o que somar ou subtrair por código.
 */
export function apurarDeclaracoes (registros, opts = {}) {
  const base = opts.baseDeclaracao || 'total'
  const periodos = new Map()
  for (const r of registros || []) {
    if (!r || !r.cnpj || !r.competencia) continue
    const k = `${r.cnpj}|${r.competencia}`
    const d = r.detalhe || null
    const temQuebra = !!d && (d.mercadoria || d.servico || d.outros)
    const valor = (base === 'mercadoria' && temQuebra) ? round2(d.mercadoria) : round2(r.valor)

    const anterior = periodos.get(k)
    // entre duas declarações do mesmo mês, vale a que traz o detalhe por atividade
    if (anterior && !(temQuebra && !anterior.temQuebra)) continue

    const alertas = []
    if (base === 'mercadoria' && !temQuebra) {
      alertas.push({ tipo: 'sem_quebra_por_atividade',
        texto: 'Este mês veio do histórico consolidado do extrato, que não separa mercadoria de serviço. ' +
          `Foi usada a receita bruta total (${fmt(r.valor)}).` })
    }
    periodos.set(k, {
      chave: k, tipo: 'declaracao',
      cnpj: r.cnpj, cnpjFmt: formatarCnpj(r.cnpj), empresa: r.empresa || null,
      competencia: r.competencia, competenciaLabel: competenciaLabel(r.competencia),
      vendasBrutas: valor, devolucoes: 0, vendasLiquidas: valor,
      ativo: 0, servicoIss: d ? round2(d.servico) : 0, naoVenda: 0, naoVendaSaidas: 0, naoVendaEntradas: 0,
      contraLancamento: 0, revisar: 0, desconhecido: 0, totalEntradas: 0, totalSaidas: 0,
      cfops: [], livros: [], fontes: [r.arquivo || '—'], confiancaMinima: 'alta',
      declarado: { total: round2(r.valor), mercadoria: d ? round2(d.mercadoria) : null,
        servico: d ? round2(d.servico) : null, escopo: r.escopo || null, rotulo: r.fonte || 'PGDAS-D' },
      temQuebra, alertas,
    })
  }
  return { periodos: [...periodos.values()].sort(ordenar), base }
}

/**
 * Junta o que veio dos livros fiscais com o que veio das declarações.
 * Havendo os dois para a mesma competência, o livro continua sendo a base —
 * é dele que sai o detalhe por CFOP — e o valor declarado vira alerta, que é
 * uma terceira conferência de graça.
 */
export function mesclarApuracao (deLivros, deDeclaracoes) {
  const out = new Map()
  for (const p of deLivros) out.set(`${p.cnpj}|${p.competencia}`, p)
  for (const d of deDeclaracoes) {
    const k = `${d.cnpj}|${d.competencia}`
    const livro = out.get(k)
    if (!livro) { out.set(k, d); continue }
    const dif = round2(livro.vendasLiquidas - d.vendasLiquidas)
    livro.declarado = d.declarado
    livro.alertas = [...(livro.alertas || []), { tipo: 'livro_x_declaracao',
      texto: Math.abs(dif) <= 0.05
        ? `O livro fiscal e o extrato do Simples batem (${fmt(d.vendasLiquidas)}).`
        : `O extrato do Simples declara ${fmt(d.vendasLiquidas)} nesta competência — ` +
          `${fmt(Math.abs(dif))} ${dif > 0 ? 'a menos que' : 'a mais que'} o livro fiscal.` }]
  }
  return [...out.values()].sort(ordenar)
}

function detectarConflitos (lancamentos) {
  const mapa = new Map()
  for (const l of lancamentos) {
    if (!l.cnpj || !l.competencia || !l.livro) continue
    const k = `${l.cnpj}|${l.competencia}|${l.livro}`
    const fonteId = (l.origem && l.origem.fonteId) || (l.origem && l.origem.arquivo) || '?'
    if (!mapa.has(k)) mapa.set(k, new Map())
    const m = mapa.get(k)
    if (!m.has(fonteId)) m.set(fonteId, { fonteId, arquivo: (l.origem && l.origem.arquivo) || '?', formato: (l.origem && l.origem.formato) || '?', qtd: 0, total: 0 })
    const f = m.get(fonteId)
    f.qtd++; f.total += Number(l.valorContabil) || 0
  }
  const conflitos = new Map()
  for (const [k, m] of mapa) {
    if (m.size > 1) {
      const [cnpj, competencia, livro] = k.split('|')
      conflitos.set(k, { chave: k, cnpj, competencia, livro, fontes: [...m.values()] })
    }
  }
  return conflitos
}

/* ------------------------------------------------------------- conciliação */

export const STATUS = {
  OK: 'OK',
  ATENCAO: 'ATENÇÃO',
  DIVERGENTE: 'DIVERGENTE',
  SO_LIVRO: 'SÓ NA APURAÇÃO',
  SO_PLANILHA: 'SÓ NO INFORMADO',
  INCOMPLETO: 'LIVRO INCOMPLETO',
}

/**
 * Cruza a apuração dos livros com a planilha de vendas informadas.
 * @param {Array} periodos saída de apurar().periodos
 * @param {Array} informadas saída de parseVendasInformadas().registros
 * @param {{toleranciaReais?:number, toleranciaPercent?:number}} opts
 */
export function conciliar (periodos, informadasBrutas, opts = {}) {
  const tolR = opts.toleranciaReais ?? 0.05
  const tolP = opts.toleranciaPercent ?? 0.5   // %
  const atencaoP = opts.atencaoPercent ?? 2    // %
  const { informadas, conflitosVendas } = resolverFontesDeVenda(informadasBrutas)

  const porChave = new Map()
  for (const p of periodos) porChave.set(CHAVE(p), { ...p, informado: null, linhasPlanilha: [] })

  for (const r of informadas) {
    const k = `${r.cnpj}|${r.competencia}`
    if (!porChave.has(k)) {
      porChave.set(k, {
        chave: k, cnpj: r.cnpj, cnpjFmt: formatarCnpj(r.cnpj), empresa: r.empresa,
        competencia: r.competencia, competenciaLabel: competenciaLabel(r.competencia),
        vendasBrutas: null, devolucoes: null, vendasLiquidas: null,
        alertas: [], cfops: [], livros: [], fontes: [], informado: 0, linhasPlanilha: [],
      })
    }
    const p = porChave.get(k)
    if (!p.empresa && r.empresa) p.empresa = r.empresa
    p.informado = round2((p.informado || 0) + r.valor)
    p.linhasPlanilha.push(r)
  }

  const linhas = []
  // a chave vem do próprio mapa: o objeto do período pode não carregar o campo
  for (const [chave, p] of porChave) {
    const temLivro = p.vendasLiquidas !== null && p.vendasLiquidas !== undefined
    const temPlanilha = p.informado !== null && p.informado !== undefined
    let status, diferenca = null, percent = null

    if (temLivro && temPlanilha) {
      diferenca = round2(p.vendasLiquidas - p.informado)
      const base = Math.max(Math.abs(p.vendasLiquidas), Math.abs(p.informado))
      percent = base > 0 ? round2((diferenca / base) * 100) : 0
      const dentro = Math.abs(diferenca) <= tolR || Math.abs(percent) <= tolP
      /*
       * Sem o livro de saídas da competência não há venda para comparar: a
       * diferença é falta de arquivo, não divergência. Chamar isso de
       * DIVERGENTE afogaria as divergências de verdade no relatório.
       */
      status = (p.tipo !== 'declaracao' && !(p.livros || []).includes('saidas')) ? STATUS.INCOMPLETO
        : dentro ? STATUS.OK
        : (Math.abs(percent) <= atencaoP ? STATUS.ATENCAO : STATUS.DIVERGENTE)
    } else if (temLivro) {
      status = STATUS.SO_LIVRO
    } else {
      status = STATUS.SO_PLANILHA
    }

    if (p.linhasPlanilha.length > 1) {
      const onde = p.linhasPlanilha.map(l => l.linha).filter(Boolean)
      p.alertas = [...(p.alertas || []), { tipo: 'planilha_duplicada',
        texto: `A mesma origem traz ${p.linhasPlanilha.length} linhas para este CNPJ/competência` +
          (onde.length ? ` (linhas ${onde.join(', ')})` : '') + ' — foram somadas.' }]
    }
    const conf = conflitosVendas.get(chave)
    if (conf) p.alertas = [...(p.alertas || []), conf]
    const dec = p.declarado
    if (dec && dec.servico > 0 && dec.mercadoria != null && temPlanilha) {
      const difMerc = round2(dec.mercadoria - p.informado)
      p.alertas = [...(p.alertas || []), { tipo: 'receita_de_servico',
        texto: `A receita declarada inclui ${fmt(dec.servico)} de serviço tributado pelo ISS. ` +
          `Considerando só revenda de mercadorias (${fmt(dec.mercadoria)}), a diferença seria ${fmt(difMerc)}.` }]
    }

    linhas.push({ ...p, status, diferenca, percent,
      explicacao: explicar(p, diferenca, status) })
  }

  linhas.sort(ordenar)
  return { linhas, resumo: resumir(linhas) }
}

/**
 * Peso de cada origem de venda informada quando duas cobrem o mesmo mês.
 * A declaração por estabelecimento é a mais forte: é o número entregue à
 * Receita para aquele CNPJ. Depois vem o histórico do extrato, que é
 * consolidado da empresa. Por último a planilha, que é mantida à mão.
 */
const PESO_FONTE = (r) => r.escopo === 'estabelecimento' ? 3 : r.escopo === 'empresa' ? 2 : 1

/**
 * Duas origens para o mesmo CNPJ e competência não podem ser somadas — isso
 * dobraria a venda informada. Fica a de maior peso, e a divergência entre
 * elas vira alerta em vez de sumir na conta.
 */
function resolverFontesDeVenda (registros) {
  const porChaveFonte = new Map()
  for (const r of registros || []) {
    const chave = `${r.cnpj}|${r.competencia}`
    const fonte = r.fonteId || r.arquivo || 'origem'
    if (!porChaveFonte.has(chave)) porChaveFonte.set(chave, new Map())
    const m = porChaveFonte.get(chave)
    if (!m.has(fonte)) m.set(fonte, { fonte, arquivo: r.arquivo || '—', rotulo: r.fonte || 'planilha', peso: PESO_FONTE(r), total: 0, itens: [] })
    const f = m.get(fonte)
    f.total = round2(f.total + (Number(r.valor) || 0))
    f.itens.push(r)
  }

  const informadas = []
  const conflitosVendas = new Map()
  for (const [chave, m] of porChaveFonte) {
    const fontes = [...m.values()].sort((a, b) => b.peso - a.peso)
    const escolhida = fontes[0]
    informadas.push(...escolhida.itens)
    if (fontes.length > 1) {
      const divergem = fontes.some(f => Math.abs(f.total - escolhida.total) > 0.01)
      if (divergem) {
        conflitosVendas.set(chave, { tipo: 'fontes_de_venda_divergem',
          texto: `Mais de uma origem informa esta competência: ` +
            fontes.map(f => `${f.arquivo} (${f.rotulo}) ${fmt(f.total)}`).join(' · ') +
            `. Usei ${escolhida.arquivo}; as outras foram ignoradas para não somar duas vezes.` })
      }
    }
  }
  return { informadas, conflitosVendas }
}

function explicar (p, diferenca, status) {
  if (status === STATUS.INCOMPLETO) {
    return 'O livro de SAÍDAS desta competência não foi carregado — sem ele não há venda para comparar. ' +
      'Carregue o livro de saídas do mês antes de tirar conclusão desta linha.'
  }
  if (status === STATUS.SO_LIVRO) {
    return p.tipo === 'declaracao'
      ? 'Há receita declarada no extrato do Simples e nenhuma venda informada para esta competência.'
      : 'Existe movimento no livro fiscal e nenhuma venda informada para esta competência.'
  }
  if (status === STATUS.SO_PLANILHA) return 'Há venda informada e nenhuma apuração (livro fiscal ou extrato) para esta competência.'
  if (status === STATUS.OK) return 'A apuração e o informado batem dentro da tolerância.'
  const pistas = []
  if (diferenca < 0) {
    pistas.push(p.tipo === 'declaracao'
      ? 'o informado é MAIOR do que a receita declarada no Simples'
      : 'o informado é MAIOR do que o livro registra')
    if (p.revisar > 0) pistas.push(`há ${fmt(p.revisar)} em CFOP genérico (x.949) fora das vendas`)
    if (p.naoVendaSaidas > 0) pistas.push(`há ${fmt(p.naoVendaSaidas)} em saídas que não são venda (remessa, bonificação, transferência)`)
    if (p.contraLancamento > 0) pistas.push(`há ${fmt(p.contraLancamento)} em contra-lançamento (x.922/x.929)`)
  } else {
    pistas.push(p.tipo === 'declaracao'
      ? 'a receita declarada no Simples é MAIOR do que o informado'
      : 'o livro registra MAIS do que o informado')
    if (p.devolucoes > 0) pistas.push(`as devoluções de venda já deduzidas somam ${fmt(p.devolucoes)}`)
  }
  if (p.desconhecido > 0) pistas.push(`${fmt(p.desconhecido)} está em CFOP não classificado`)
  return pistas.join('; ') + '.'
}

function resumir (linhas) {
  const r = { periodos: linhas.length, ok: 0, atencao: 0, divergente: 0, soLivro: 0, soPlanilha: 0,
    incompleto: 0, totalLivro: 0, totalPlanilha: 0, totalDiferenca: 0, maiorDivergencia: null }
  for (const l of linhas) {
    if (l.status === STATUS.OK) r.ok++
    else if (l.status === STATUS.ATENCAO) r.atencao++
    else if (l.status === STATUS.DIVERGENTE) r.divergente++
    else if (l.status === STATUS.SO_LIVRO) r.soLivro++
    else if (l.status === STATUS.INCOMPLETO) r.incompleto++
    else r.soPlanilha++
    r.totalLivro += l.vendasLiquidas || 0
    r.totalPlanilha += l.informado || 0
    // uma competência sem o livro de saídas não entra na diferença total
    if (l.diferenca != null && l.status !== STATUS.INCOMPLETO) {
      r.totalDiferenca += l.diferenca
      if (!r.maiorDivergencia || Math.abs(l.diferenca) > Math.abs(r.maiorDivergencia.diferenca)) r.maiorDivergencia = l
    }
  }
  r.totalLivro = round2(r.totalLivro)
  r.totalPlanilha = round2(r.totalPlanilha)
  r.totalDiferenca = round2(r.totalDiferenca)
  return r
}

function ordenar (a, b) {
  return (a.cnpj || '').localeCompare(b.cnpj || '') || (a.competencia || '').localeCompare(b.competencia || '')
}

export function round2 (n) { return Math.round((Number(n) || 0) * 100) / 100 }

export function fmt (n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/* ------------------------------------------------------------------ export */

const CSV_COLUNAS = [
  ['cnpjFmt', 'CNPJ'], ['empresa', 'Empresa'], ['competenciaLabel', 'Competência'],
  ['vendasBrutas', 'Receita apurada (livro ou extrato)'], ['devolucoes', 'Devoluções de venda'],
  ['vendasLiquidas', 'Apurado líquido'], ['informado', 'Vendas informadas'],
  ['diferenca', 'Diferença'], ['percent', 'Diferença %'], ['status', 'Status'],
  ['naoVendaSaidas', 'Saídas que não são venda'], ['naoVendaEntradas', 'Entradas que não são devolução'],
  ['revisar', 'CFOP genérico (revisar)'],
  ['desconhecido', 'CFOP não classificado'], ['ativo', 'Venda de ativo'],
  ['servicoIss', 'Serviço ISS'], ['contraLancamento', 'Contra-lançamento'],
  ['explicacao', 'Observação'],
]

export function paraCsv (linhas) {
  const esc = (v) => {
    if (v == null) return ''
    const s = typeof v === 'number' ? String(v).replace('.', ',') : String(v)
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const out = [CSV_COLUNAS.map(c => c[1]).join(';')]
  for (const l of linhas) out.push(CSV_COLUNAS.map(c => esc(l[c[0]])).join(';'))
  return '﻿' + out.join('\r\n')
}

export function detalhePorCfopCsv (periodos) {
  const esc = (v) => (v == null ? '' : typeof v === 'number' ? String(v).replace('.', ',') : String(v))
  const out = ['CNPJ;Empresa;Competência;Livro;CFOP;Natureza;Descrição;Qtd;Valor;Base de cálculo;ICMS']
  for (const p of periodos) {
    for (const c of p.cfops || []) {
      out.push([p.cnpjFmt, p.empresa, p.competenciaLabel, c.livro, c.cfop, c.natureza, c.descricao,
        c.qtd, c.valor, c.base, c.icms].map(esc).join(';'))
    }
  }
  return '﻿' + out.join('\r\n')
}
