/**
 * Acompanhamento do ciclo de auditoria: a carteira de lojistas do shopping, o
 * recebimento anual dos livros (a partir de 1º de abril), o fluxo mensal de
 * notificações para quem não entregou, e o fechamento mensal da triangulação.
 *
 * Funções puras: recebem o estado persistido e a data de hoje, devolvem o que
 * a tela precisa. Nada aqui toca localStorage nem DOM.
 *
 * Duas cadências convivem:
 *   - a auditoria fiscal é ANUAL: o ciclo abre em 1º de abril e cobre os livros
 *     do ano-calendário anterior;
 *   - a triangulação é DIÁRIA ou SEMANAL na entrada e FECHADA POR MÊS: cada
 *     fechamento vira uma linha do histórico, que o cruzamento final usa contra
 *     a auditoria anual.
 */
import { normalizarCnpj, formatarCnpj, competenciaLabel, moedaBR, percentBR, mapearColunas, numeroBR } from './parsers.js'

export const VERSAO_ACOMPANHAMENTO = 2

/* --------------------------------------------------------------- o ciclo */

/**
 * Ciclo em vigor numa data. Abre em `mesInicio` (4 = abril) e audita os livros
 * do ano-calendário anterior: em setembro de 2026 o ciclo é 2026 e os livros
 * são os de 2025.
 */
export function cicloAtual (hoje = new Date(), mesInicio = 4) {
  const d = paraData(hoje)
  const ano = d.getMonth() + 1 >= mesInicio ? d.getFullYear() : d.getFullYear() - 1
  const inicio = iso(new Date(ano, mesInicio - 1, 1))
  const mesesDecorridos = (d.getFullYear() - ano) * 12 + (d.getMonth() + 1) - mesInicio + 1  // abril = mês 1
  return { ano, chave: String(ano), inicio, anoLivros: ano - 1, mesesDecorridos, mesInicio }
}

/** Todos os meses do ciclo, do mês de abertura até o de hoje (para o gráfico de recebimento). */
export function mesesDoCiclo (ciclo, hoje = new Date()) {
  const out = []
  for (let i = 0; i < ciclo.mesesDecorridos; i++) {
    const d = new Date(ciclo.ano, ciclo.mesInicio - 1 + i, 1)
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return out
}

/* ------------------------------------------------------------- o pipeline */

export const STATUS_LIVRO = {
  NAO_RECEBIDO: 'NÃO RECEBIDO',
  RECEBIDO: 'RECEBIDO',
  AUDITADO: 'AUDITADO',
  NEGOCIADO: 'NEGOCIADO',
  COBRADO: 'COBRADO',
}
/** A ordem em que um lojista avança. A data de cada marco fica em registro[chave]. */
export const MARCOS = [
  { chave: 'recebido', status: STATUS_LIVRO.RECEBIDO, rotulo: 'Livros recebidos' },
  { chave: 'auditado', status: STATUS_LIVRO.AUDITADO, rotulo: 'Auditado' },
  { chave: 'negociado', status: STATUS_LIVRO.NEGOCIADO, rotulo: 'Negociado' },
  { chave: 'cobrado', status: STATUS_LIVRO.COBRADO, rotulo: 'Cobrado' },
]

/**
 * O fluxo mensal para quem não entregou: uma etapa por mês, a partir da abertura
 * do ciclo. Em abril a 1ª notificação; maio a 2ª; junho a 3ª; julho o aviso de
 * multa; agosto o comando de enviar a multa.
 */
export const ETAPAS = [
  { chave: 'n1', rotulo: '1ª notificação', curto: '1ª notif.', mes: 1 },
  { chave: 'n2', rotulo: '2ª notificação', curto: '2ª notif.', mes: 2 },
  { chave: 'n3', rotulo: '3ª notificação', curto: '3ª notif.', mes: 3 },
  { chave: 'aviso', rotulo: 'Aviso de multa', curto: 'aviso multa', mes: 4 },
  { chave: 'multa', rotulo: 'Multa enviada', curto: 'multa', mes: 5 },
]

/** Estado persistido vazio. */
export function acompanhamentoVazio () {
  return { versao: VERSAO_ACOMPANHAMENTO, lojistas: [], ciclos: {}, fechamentos: [], societario: {}, prefs: {} }
}

/* --------------------------------------------------------------- carteira */

const SINONIMOS_LOJISTA = {
  nome: ['nome', 'loja', 'nomefantasia', 'fantasia', 'lojista', 'marca'],
  razao: ['razaosocial', 'razao', 'empresa', 'razão social'],
  cnpj: ['cnpj', 'cnpjcpf', 'documento'],
  luc: ['luc', 'unidade', 'sala', 'ponto', 'lojan', 'numeroloja', 'nloja'],
  email: ['email', 'e-mail', 'contato', 'emailcontato'],
  telefone: ['telefone', 'celular', 'whatsapp', 'fone', 'tel'],
  regime: ['regime', 'regimetributario', 'tributacao', 'simples'],
  segmento: ['segmento', 'ramo', 'categoria', 'atividade'],
  uf: ['uf', 'estado', 'ufcontrato', 'estadocontrato', 'ufdaloja'],
  inicioContrato: ['iniciocontrato', 'iniciodocontrato', 'datacontrato', 'datadocontrato', 'inicio', 'datainicio', 'contratodesde', 'vigenciainicio'],
}

/** Dígitos verificadores do CNPJ (os dois últimos), pela regra da Receita. */
export function cnpjValido (bruto) {
  const d = String(bruto ?? '').replace(/\D/g, '')
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false
  const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const dv = (n) => {
    let soma = 0
    for (let i = 0; i < n.length; i++) soma += Number(n[i]) * pesos[pesos.length - n.length + i]
    const r = soma % 11
    return r < 2 ? 0 : 11 - r
  }
  const base = d.slice(0, 12)
  return d === base + dv(base) + dv(base + dv(base))
}

/** Um lojista limpo, com a chave que o resto do sistema usa (o CNPJ só com dígitos). */
export function normalizarLojista (bruto = {}) {
  const cnpj = normalizarCnpj(bruto.cnpj) || ''
  const regime = /simples/i.test(String(bruto.regime || '')) ? 'simples' : (String(bruto.regime || '').trim() ? 'normal' : '')
  return {
    cnpj,
    nome: String(bruto.nome || bruto.razao || '').trim(),
    razao: String(bruto.razao || '').trim(),
    luc: String(bruto.luc || '').trim(),
    email: String(bruto.email || '').trim(),
    telefone: String(bruto.telefone || '').replace(/[^\d+]/g, ''),
    regime,
    segmento: String(bruto.segmento || '').trim(),
    uf: String(bruto.uf || '').trim().toUpperCase().slice(0, 2),
    inicioContrato: normalizarDataIso(bruto.inicioContrato),
    ativo: bruto.ativo === undefined ? true : !!bruto.ativo,
  }
}

/**
 * Lê a relação de lojistas de uma planilha (linhas já em matriz). As colunas
 * são reconhecidas pelo cabeçalho. Devolve o que entrou e o que foi recusado.
 */
export function importarLojistas (linhas) {
  const avisos = []
  let iCab = -1; let mapa = null
  for (let i = 0; i < Math.min(linhas.length, 15); i++) {
    const m = mapearColunas((linhas[i] || []).map(c => String(c ?? '')), SINONIMOS_LOJISTA)
    if (m.cnpj != null && (m.nome != null || m.razao != null)) { iCab = i; mapa = m; break }
  }
  if (iCab === -1) return { lojistas: [], avisos: ['Não encontrei um cabeçalho com CNPJ e nome/loja.'] }
  const out = []
  const vistos = new Set()
  for (let r = iCab + 1; r < linhas.length; r++) {
    const l = linhas[r]
    if (!l || l.every(c => c === '' || c == null)) continue
    const pega = (k) => mapa[k] != null ? l[mapa[k]] : ''
    const loj = normalizarLojista({ nome: pega('nome'), razao: pega('razao'), cnpj: pega('cnpj'), luc: pega('luc'),
      email: pega('email'), telefone: pega('telefone'), regime: pega('regime'), segmento: pega('segmento'), uf: pega('uf'), inicioContrato: pega('inicioContrato') })
    if (!cnpjValido(pega('cnpj'))) { avisos.push(`Linha ${r + 1}: CNPJ inválido ("${pega('cnpj')}") — ignorada.`); continue }
    if (vistos.has(loj.cnpj)) { avisos.push(`Linha ${r + 1}: CNPJ ${formatarCnpj(loj.cnpj)} repetido — ignorada.`); continue }
    vistos.add(loj.cnpj)
    out.push(loj)
  }
  return { lojistas: out, avisos, mapa }
}

/** Junta lojistas importados à carteira: CNPJ já existente é atualizado, não duplicado. */
export function mesclarLojistas (carteira, novos) {
  const porCnpj = new Map(carteira.map(l => [l.cnpj, l]))
  let inseridos = 0; let atualizados = 0
  for (const n of novos) {
    if (porCnpj.has(n.cnpj)) {
      const atual = porCnpj.get(n.cnpj)
      for (const k of Object.keys(n)) if (n[k] !== '' && n[k] != null && k !== 'ativo') atual[k] = n[k]
      atualizados++
    } else { porCnpj.set(n.cnpj, { ...n }); inseridos++ }
  }
  return { lojistas: [...porCnpj.values()], inseridos, atualizados }
}

/* --------------------------------------------------------- situação de cada um */

/** O registro de um lojista num ciclo, sempre com a forma completa. */
export function registroDe (acomp, cicloChave, cnpj) {
  const c = acomp.ciclos[cicloChave] || (acomp.ciclos[cicloChave] = {})
  if (!c[cnpj]) c[cnpj] = { recebido: null, auditado: null, negociado: null, cobrado: null, notificacoes: {}, valores: {}, obs: '' }
  if (!c[cnpj].notificacoes) c[cnpj].notificacoes = {}
  if (!c[cnpj].valores) c[cnpj].valores = {}
  return c[cnpj]
}

/** Status atual pelo marco mais avançado com data. */
export function statusDoRegistro (reg) {
  let status = STATUS_LIVRO.NAO_RECEBIDO
  for (const m of MARCOS) if (reg && reg[m.chave]) status = m.status
  return status
}

/**
 * Situação de um lojista no ciclo: status, quantas etapas de notificação já
 * foram cumpridas e qual é a etapa devida agora (se houver).
 *
 * A etapa devida é a próxima ainda não registrada cujo mês já chegou. Quem
 * entregou os livros sai do fluxo de notificação, com o histórico preservado.
 */
export function situacao (lojista, reg, ciclo) {
  const status = statusDoRegistro(reg)
  const feitas = ETAPAS.filter(e => reg && reg.notificacoes && reg.notificacoes[e.chave])
  const recebido = status !== STATUS_LIVRO.NAO_RECEBIDO
  let devida = null
  let atrasadas = 0
  if (!recebido) {
    for (const e of ETAPAS) {
      if (reg && reg.notificacoes && reg.notificacoes[e.chave]) continue
      if (e.mes <= ciclo.mesesDecorridos) { if (!devida) devida = e; atrasadas++ }
    }
  }
  return {
    cnpj: lojista.cnpj, lojista, reg, status, recebido,
    etapasFeitas: feitas.map(e => e.chave),
    ultimaEtapa: feitas.length ? feitas[feitas.length - 1] : null,
    devida,                      // a etapa que o mês pede agora
    atrasadas,                   // quantas etapas o mês já deveria ter visto (1 = em dia, >1 = acumulou)
    multada: !!(reg && reg.notificacoes && reg.notificacoes.multa),
  }
}

/** O painel: contagem por status, recebimento mês a mês e a lista de situações. */
export function resumoPainel (acomp, ciclo, opts = {}) {
  const ativos = acomp.lojistas.filter(l => l.ativo !== false)
  const situacoes = ativos.map(l => situacao(l, (acomp.ciclos[ciclo.chave] || {})[l.cnpj], ciclo))
  const contagem = { total: ativos.length }
  for (const s of Object.values(STATUS_LIVRO)) contagem[s] = 0
  for (const s of situacoes) contagem[s.status]++
  // a barra de recebimento: quantos entregaram até cada mês do ciclo
  const meses = mesesDoCiclo(ciclo)
  const porMes = meses.map(m => ({ mes: m, label: competenciaLabel(m), recebidos: 0, acumulado: 0 }))
  for (const s of situacoes) {
    const d = s.reg && s.reg.recebido
    if (!d) continue
    const i = meses.indexOf(String(d).slice(0, 7))
    if (i >= 0) porMes[i].recebidos++
  }
  let acc = 0
  for (const p of porMes) { acc += p.recebidos; p.acumulado = acc }
  const pendentes = situacoes.filter(s => s.devida)
  const multados = situacoes.filter(s => s.multada && !s.recebido)
  const valores = { divergencia: 0, negociado: 0, cobrado: 0 }
  for (const s of situacoes) for (const k of Object.keys(valores)) valores[k] += Number((s.reg && s.reg.valores && s.reg.valores[k]) || 0)
  return { ciclo, contagem, porMes, situacoes, pendentes, multados, valores,
    percentualRecebido: ativos.length ? Math.round((ativos.length - contagem[STATUS_LIVRO.NAO_RECEBIDO]) / ativos.length * 1000) / 10 : 0 }
}

/* ----------------------------------------------------------- notificações */

/**
 * O texto de cada etapa, pronto para copiar, mandar por e-mail ou WhatsApp.
 * `prefs.shopping`, `prefs.prazoDias`, `prefs.clausulaMulta` e `prefs.assinatura`
 * personalizam; o resto vem do lojista e do ciclo.
 */
export function textoNotificacao (etapa, lojista, ciclo, prefs = {}) {
  const shopping = prefs.shopping || 'o Shopping'
  const prazo = Number(prefs.prazoDias) || 10
  const nome = lojista.nome || lojista.razao || formatarCnpj(lojista.cnpj)
  const luc = lojista.luc ? ` (LUC ${lojista.luc})` : ''
  const ano = ciclo.anoLivros
  const clausula = prefs.clausulaMulta || 'a cláusula de multa por não apresentação dos livros fiscais prevista no contrato de locação'
  const assinatura = prefs.assinatura || 'Equipe de Auditoria de Vendas'
  const pedido = `livros fiscais de Entradas e Saídas do exercício de ${ano} (ou do extrato do Simples Nacional, se for o caso), ` +
    'em PDF, SPED ou planilha, junto com a ficha de vendas informadas'
  const modelos = {
    n1: {
      assunto: `Auditoria de vendas ${ano} — envio dos livros fiscais — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nComo todo ano, a partir de 1º de abril ${shopping} realiza a auditoria das vendas declaradas. ` +
        `Pedimos o envio dos ${pedido}, no prazo de ${prazo} dias.\n\nQualquer dúvida sobre o formato, respondam esta mensagem.\n\n${assinatura}`,
    },
    n2: {
      assunto: `2ª notificação — livros fiscais ${ano} ainda não recebidos — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nNão recebemos até o momento os ${pedido}. ` +
        `Esta é a segunda solicitação. Pedimos o envio em ${prazo} dias.\n\n${assinatura}`,
    },
    n3: {
      assunto: `3ª e última notificação — livros fiscais ${ano} — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nEsta é a terceira e última solicitação dos ${pedido}. ` +
        `Sem o recebimento em ${prazo} dias, ${shopping} passará a aplicar ${clausula}.\n\n${assinatura}`,
    },
    aviso: {
      assunto: `Aviso de multa — não apresentação dos livros fiscais ${ano} — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nApós três solicitações sem retorno, comunicamos que a não apresentação dos ${pedido} ` +
        `caracteriza descumprimento contratual e enseja ${clausula}. Este é o aviso prévio: o envio dos documentos em ${prazo} dias ` +
        `evita a cobrança.\n\n${assinatura}`,
    },
    multa: {
      assunto: `Aplicação de multa contratual — livros fiscais ${ano} — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nEsgotado o prazo do aviso, fica aplicada ${clausula}, referente ao exercício de ${ano}, ` +
        `com lançamento no próximo boleto de encargos. A apresentação dos documentos continua obrigatória e não afasta a multa já aplicada.\n\n${assinatura}`,
    },
  }
  const m = modelos[etapa] || modelos.n1
  return { ...m, mailto: `mailto:${encodeURIComponent(lojista.email || '')}?subject=${encodeURIComponent(m.assunto)}&body=${encodeURIComponent(m.corpo)}`,
    whatsapp: lojista.telefone ? `https://wa.me/${lojista.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(m.assunto + '\n\n' + m.corpo)}` : null }
}

/* ---------------------------------------------------- fechamento mensal */

/**
 * Fecha uma competência da triangulação: as linhas de `porMes` daquela
 * competência viram histórico. Fechar de novo substitui o fechamento anterior
 * da mesma competência e CNPJ (o mês foi reaberto e refeito).
 */
export function fecharMes (fechamentos, porMes, competencia, hoje = new Date()) {
  const novas = porMes.filter(p => p.competencia === competencia).map(p => ({
    competencia, cnpj: p.cnpj, fechadoEm: iso(paraData(hoje)),
    z: p.z ?? null, pdv: p.pdv ?? null, napp: p.napp ?? null, declarado: p.declarado ?? null,
    diasZ: p.diasZ || 0, diasPdv: p.diasPdv || 0, diasNapp: p.diasNapp || 0,
    maior: p.maior ?? null, fonteMaior: p.fonteMaior || [], naoDeclarado: p.naoDeclarado ?? null,
    amplitude: p.amplitude ?? null, dispersao: p.dispersao ?? null, status: p.status,
    alertas: (p.alertas || []).map(a => ({ tipo: a.tipo, grave: !!a.grave, texto: a.texto })),
    explicacao: p.explicacao || '',
  }))
  const chaves = new Set(novas.map(n => n.cnpj + '|' + n.competencia))
  const mantidas = (fechamentos || []).filter(f => !chaves.has(f.cnpj + '|' + f.competencia))
  return { fechamentos: [...mantidas, ...novas].sort((a, b) => a.competencia.localeCompare(b.competencia) || a.cnpj.localeCompare(b.cnpj)), fechadas: novas.length }
}

/**
 * O que vai para o cruzamento final: o histórico fechado mais os meses ainda
 * abertos nesta sessão. Um mês aberto não substitui o fechado — o fechamento é
 * o registro; o aberto aparece marcado como tal.
 */
export function historicoParaCruzamento (fechamentos, porMesAberto = []) {
  const out = (fechamentos || []).map(f => ({ ...f, competenciaLabel: competenciaLabel(f.competencia), fechado: true }))
  const chaves = new Set(out.map(f => f.cnpj + '|' + f.competencia))
  for (const p of porMesAberto) {
    if (chaves.has(p.cnpj + '|' + p.competencia)) continue
    out.push({ ...p, fechado: false })
  }
  return out
}

/* ------------------------------------------------------------------ CSV */

export function acompanhamentoCsv (resumo) {
  const cab = ['CNPJ', 'Loja', 'LUC', 'Status', 'Livros recebidos em', 'Auditado em', 'Negociado em', 'Cobrado em',
    '1ª notificação', '2ª notificação', '3ª notificação', 'Aviso de multa', 'Multa enviada', 'Etapa devida agora',
    'Divergência (R$)', 'Negociado (R$)', 'Cobrado (R$)', 'Observações']
  const linhas = resumo.situacoes.map(s => {
    const r = s.reg || {}; const n = r.notificacoes || {}; const v = r.valores || {}
    return [formatarCnpj(s.cnpj), s.lojista.nome, s.lojista.luc, s.status, r.recebido, r.auditado, r.negociado, r.cobrado,
      n.n1, n.n2, n.n3, n.aviso, n.multa, s.devida ? s.devida.rotulo : '', v.divergencia, v.negociado, v.cobrado, r.obs]
  })
  return csv([cab, ...linhas])
}

export function fechamentosCsv (fechamentos) {
  const cab = ['Competência', 'CNPJ', 'Fechado em', 'Redução Z', 'PDV', 'NAPP', 'Declarado', 'Maior valor', 'Dias Z', 'Dias PDV', 'Dias NAPP',
    'Variação R$', 'Não declarado R$', 'Dispersão %', 'Status', 'Alertas graves']
  return csv([cab, ...(fechamentos || []).map(f => [competenciaLabel(f.competencia), formatarCnpj(f.cnpj), f.fechadoEm, f.z, f.pdv, f.napp, f.declarado,
    f.maior, f.diasZ, f.diasPdv, f.diasNapp, f.amplitude, f.naoDeclarado, f.dispersao, f.status, (f.alertas || []).filter(a => a.grave).length])])
}

export function carteiraCsv (lojistas) {
  const cab = ['CNPJ', 'Loja', 'Razão social', 'LUC', 'UF', 'Início do contrato', 'E-mail', 'Telefone', 'Regime', 'Segmento', 'Ativo']
  return csv([cab, ...lojistas.map(l => [formatarCnpj(l.cnpj), l.nome, l.razao, l.luc, l.uf, l.inicioContrato, l.email, l.telefone, l.regime, l.segmento, l.ativo === false ? 'não' : 'sim'])])
}

function csv (matriz) {
  const cel = (v) => {
    if (v == null) return ''
    if (typeof v === 'number') return String(Math.round(v * 100) / 100).replace('.', ',')
    const s = String(v)
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  return '﻿' + matriz.map(l => l.map(cel).join(';')).join('\r\n') + '\r\n'
}

/* -------------------------------------------------------------- utilidades */

function paraData (d) {
  if (d instanceof Date) return d
  if (typeof d === 'string') { const [a, m, dia] = d.split('-').map(Number); return new Date(a, m - 1, dia || 1) }
  return new Date(d)
}
/** Data vinda de planilha (dd/mm/aaaa, aaaa-mm-dd, serial do Excel ou Date) para aaaa-mm-dd; vazio se não der. */
export function normalizarDataIso (bruto) {
  if (bruto == null || bruto === '') return ''
  if (bruto instanceof Date) return Number.isNaN(bruto.getTime()) ? '' : iso(bruto)
  if (typeof bruto === 'number' && bruto > 20000 && bruto < 80000) return iso(new Date(Math.round((bruto - 25569) * 86400000)))  // serial do Excel
  const s = String(bruto).trim()
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}`
  m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
  return ''
}
export function iso (d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const hojeIso = () => iso(new Date())
export const dataBR = (s) => s ? String(s).slice(0, 10).split('-').reverse().join('/') : '—'

