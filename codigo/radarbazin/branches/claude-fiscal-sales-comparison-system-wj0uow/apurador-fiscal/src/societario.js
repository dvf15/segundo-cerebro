/**
 * Mudança societária e taxa de transferência.
 *
 * Contrato de shopping costuma prever taxa quando a loja muda de mãos — cessão
 * de quotas, troca de controle, incorporação — com ou sem faixa de isenção
 * (ex.: até X% das quotas, ou entre sócios já existentes). A ferramenta não
 * consulta a Junta sozinha (cada estado tem portal próprio, sem API pública):
 * ela abre a Junta do estado do contrato com o CNPJ já copiado, o time
 * registra o que encontrou, e a partir daí o sistema sinaliza a mudança
 * recente, pede a validação de isenção e limite contratual e, confirmada a
 * cobrança, roda o mesmo fluxo de notificação e negociação da auditoria
 * fiscal, com os textos adaptados à taxa de transferência.
 *
 * Funções puras; o estado vem em `acomp.societario[cnpj]`.
 */
import { formatarCnpj, moedaBR } from './parsers.js'
import { ETAPAS } from './acompanhamento.js'

export const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

/**
 * A Junta Comercial de cada estado. `verificado` diz se o endereço foi
 * confirmado em fonte oficial ou de referência em 14/10/2026; os demais são
 * o endereço conhecido do órgão e podem ter mudado — por isso o botão de
 * busca ao lado de cada um.
 */
export const JUNTAS = {
  AC: { sigla: 'JUCEAC', nome: 'Junta Comercial do Estado do Acre', url: 'https://www.juceac.ac.gov.br/', verificado: false },
  AL: { sigla: 'JUCEAL', nome: 'Junta Comercial do Estado de Alagoas', url: 'https://www.juceal.al.gov.br/', verificado: false },
  AP: { sigla: 'JUCAP', nome: 'Junta Comercial do Estado do Amapá', url: 'https://www.jucap.ap.gov.br/', verificado: false },
  AM: { sigla: 'JUCEA', nome: 'Junta Comercial do Estado do Amazonas', url: 'https://www.jucea.am.gov.br/', verificado: false },
  BA: { sigla: 'JUCEB', nome: 'Junta Comercial do Estado da Bahia', url: 'https://www.juceb.ba.gov.br/', verificado: true },
  CE: { sigla: 'JUCEC', nome: 'Junta Comercial do Estado do Ceará', url: 'https://www.jucec.ce.gov.br/', verificado: true },
  DF: { sigla: 'JUCIS-DF', nome: 'Junta Comercial, Industrial e Serviços do Distrito Federal', url: 'https://jucis.df.gov.br/', verificado: true },
  ES: { sigla: 'JUCEES', nome: 'Junta Comercial do Estado do Espírito Santo', url: 'https://www.jucees.es.gov.br/', verificado: false },
  GO: { sigla: 'JUCEG', nome: 'Junta Comercial do Estado de Goiás', url: 'https://goias.gov.br/juceg/', verificado: true },
  MA: { sigla: 'JUCEMA', nome: 'Junta Comercial do Estado do Maranhão', url: 'https://www.jucema.ma.gov.br/', verificado: false },
  MT: { sigla: 'JUCEMAT', nome: 'Junta Comercial do Estado de Mato Grosso', url: 'https://www.jucemat.mt.gov.br/', verificado: false },
  MS: { sigla: 'JUCEMS', nome: 'Junta Comercial do Estado de Mato Grosso do Sul', url: 'https://www.jucems.ms.gov.br/', verificado: false },
  MG: { sigla: 'JUCEMG', nome: 'Junta Comercial do Estado de Minas Gerais', url: 'https://www.jucemg.mg.gov.br/', verificado: true },
  PA: { sigla: 'JUCEPA', nome: 'Junta Comercial do Estado do Pará', url: 'https://www.jucepa.pa.gov.br/', verificado: true },
  PB: { sigla: 'JUCEP', nome: 'Junta Comercial do Estado da Paraíba', url: 'https://www.jucep.pb.gov.br/', verificado: false },
  PR: { sigla: 'JUCEPAR', nome: 'Junta Comercial do Paraná', url: 'https://www.jucepar.pr.gov.br/', verificado: false },
  PE: { sigla: 'JUCEPE', nome: 'Junta Comercial do Estado de Pernambuco', url: 'http://portal.jucepe.pe.gov.br/', verificado: true },
  PI: { sigla: 'JUCEPI', nome: 'Junta Comercial do Estado do Piauí', url: 'https://www.jucepi.pi.gov.br/', verificado: false },
  RJ: { sigla: 'JUCERJA', nome: 'Junta Comercial do Estado do Rio de Janeiro', url: 'https://www.jucerja.rj.gov.br/', verificado: true },
  RN: { sigla: 'JUCERN', nome: 'Junta Comercial do Estado do Rio Grande do Norte', url: 'https://www.jucern.rn.gov.br/', verificado: false },
  RS: { sigla: 'JUCISRS', nome: 'Junta Comercial, Industrial e Serviços do Rio Grande do Sul', url: 'https://jucisrs.rs.gov.br/', verificado: false },
  RO: { sigla: 'JUCER', nome: 'Junta Comercial do Estado de Rondônia', url: 'https://www.jucer.ro.gov.br/', verificado: false },
  RR: { sigla: 'JUCERR', nome: 'Junta Comercial do Estado de Roraima', url: 'https://www.jucerr.rr.gov.br/', verificado: false },
  SC: { sigla: 'JUCESC', nome: 'Junta Comercial do Estado de Santa Catarina', url: 'https://www.jucesc.sc.gov.br/', verificado: false },
  SP: { sigla: 'JUCESP', nome: 'Junta Comercial do Estado de São Paulo', url: 'https://www.jucesp.sp.gov.br/', verificado: true },
  SE: { sigla: 'JUCESE', nome: 'Junta Comercial do Estado de Sergipe', url: 'https://www.jucese.se.gov.br/', verificado: false },
  TO: { sigla: 'JUCETINS', nome: 'Junta Comercial do Estado do Tocantins', url: 'https://www.jucetins.to.gov.br/', verificado: false },
}

/** A consulta federal do CNPJ (quadro de sócios e administradores), que vale para qualquer estado. */
export const RECEITA_CNPJ = 'https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp'

/** Os links de pesquisa de um lojista: a Junta do estado, a busca de apoio e a Receita. */
export function linksPesquisa (lojista) {
  const uf = String(lojista.uf || '').toUpperCase()
  const junta = JUNTAS[uf] || null
  const termo = `junta comercial ${uf || ''} consulta empresa ${formatarCnpj(lojista.cnpj)}`.replace(/\s+/g, ' ').trim()
  return {
    uf, junta,
    busca: 'https://www.google.com/search?q=' + encodeURIComponent(termo),
    receita: RECEITA_CNPJ,
  }
}

export const STATUS_SOC = {
  NAO_CONSULTADO: 'NÃO CONSULTADO',
  SEM_INDICIO: 'SEM INDÍCIO (TRIAGEM)',
  ANTERIOR_CONTRATO: 'ANTERIOR AO CONTRATO',
  OUTRA_ALTERACAO: 'OUTRA ALTERAÇÃO (NÃO É TT)',
  FALTA_DATA: 'INFORME A DATA DA ALTERAÇÃO',
  SEM_MUDANCA: 'SEM MUDANÇA',
  MUDANCA_ANTIGA: 'MUDANÇA ANTIGA',
  SINALIZADO: 'MUDANÇA NOS ÚLTIMOS 12 MESES',
  ISENTO: 'ISENTO',
  EM_COBRANCA: 'TAXA EM COBRANÇA',
  NEGOCIADO: 'NEGOCIADO',
  COBRADO: 'COBRADO',
}

/**
 * As possíveis causas de taxa de transferência (TT), como o time as classifica
 * na Junta. Qualquer uma delas, registrada depois do início do contrato e
 * dentro dos últimos 12 meses, sinaliza o lojista para validação.
 */
export const CAUSAS_TT = [
  ['capital', 'Alteração de capital social'],
  ['socio_admin', 'Alteração de sócio/administrador'],
  ['entrada_saida', 'Entrada/saída de sócio/administrador'],
  ['objeto', 'Alteração de objeto social'],
]
export const TIPOS_MUDANCA = [...CAUSAS_TT, ['outra', 'Outra alteração (não costuma caracterizar TT)']]
/** Chaves antigas gravadas antes desta classificação. */
const TIPOS_LEGADO = { cessao: 'entrada_saida', controle: 'socio_admin', administrador: 'socio_admin', transformacao: 'outra', incorporacao: 'outra' }
export const normalizarTipo = (t) => TIPOS_LEGADO[t] || t || ''

/** Quando o levantamento de TT é feito (skill "Levantamento de TT via Junta Comercial"). */
export const MOTIVOS_PESQUISA = [
  ['periodica', 'Auditoria periódica da base de lojistas'],
  ['renovacao', 'Antes de renovação ou aditivo contratual'],
  ['suspeita', 'Suspeita de troca de sócio/controle não comunicada'],
]

/**
 * O passo a passo no portal da Junta Comercial, como o time faz. Os nomes dos
 * menus e da guia variam conforme a Junta de cada estado (em MG a guia é o DAE).
 */
export const PASSOS_JUNTA = [
  { etapa: 'Etapa 1 — Triagem gratuita', paga: false, passos: [
    'Acessar o Portal de Serviços da Junta Comercial local.',
    'Fazer login com CPF e senha.',
    'Clicar em Serviços Web.',
    'Clicar em Certidão de Inteiro Teor (disponível e validada apenas pela internet).',
    'Buscar a empresa pelo nome, NIRE ou CNPJ.',
    'Selecionar a empresa desejada.',
  ], nota: 'Até aqui a consulta é gratuita: já dá para ver a lista de alterações arquivadas e identificar as que podem caracterizar TT. Faça a triagem de todas as lojas antes de pagar qualquer guia.' },
  { etapa: 'Etapa 2 — Solicitação da certidão (paga)', paga: true, passos: [
    'Selecionar o(s) arquivamento(s) desejado(s) e clicar em Selecionar atos.',
    'Conferir os dados e clicar em Solicitar serviço.',
    'Selecionar o requerente e clicar em Confirmar.',
    'Conferir os dados e clicar em Confirmar.',
    'Anotar o número de protocolo da solicitação.',
    'Imprimir a guia de recolhimento (em MG, DAE; o nome varia por estado) e efetuar o pagamento.',
  ] },
  { etapa: 'Etapa 3 — Download após a compensação', paga: false, passos: [
    'Após a compensação do pagamento, acessar o Portal de Serviços.',
    'Fazer login com CPF e senha.',
    'Clicar em Serviços Web.',
    'Clicar em Download Serviços.',
    'Digitar o número de protocolo e os caracteres da imagem (captcha) e clicar em Download Serviço.',
  ] },
]

/** O racional da pesquisa, nas palavras do time — aparece na aba e vai para o texto de ajuda. */
export const PONTOS_ATENCAO = [
  'Realizar o levantamento de todas as lojas e pagar as guias somente das que possam caracterizar TT: a lista de arquivamentos no portal da Junta (Certidão de Inteiro Teor, etapa 1) é gratuita; só a certidão dos atos selecionados é paga.',
  'Atentar para a data de início do contrato do lojista com o shopping: só as alterações a partir desta data interessam. Alteração anterior ao contrato não caracteriza TT.',
]

/** Registro vazio de um lojista. */
export function registroSocietario (acomp, cnpj) {
  if (!acomp.societario) acomp.societario = {}
  if (!acomp.societario[cnpj]) {
    acomp.societario[cnpj] = { motivo: '', nire: '', nireConfirmado: false, atosListados: false, protocolo: '', certidaoBaixadaEm: null, encaminhadoEm: null,
      indicio: null, guiaPagaEm: null, guiaNumero: '', consultadoEm: null, houveMudanca: null, dataMudanca: null, tipo: '', registro: '', descricao: '',
      isencao: null, limite: '', validadoEm: null, cobrar: null, notificacoes: {}, negociado: null, cobrado: null,
      valores: { taxa: null, negociado: null, cobrado: null }, obs: '' }
  }
  const r = acomp.societario[cnpj]
  if (!r.notificacoes) r.notificacoes = {}
  if (!r.valores) r.valores = {}
  return r
}

/**
 * O checklist por lojista da skill. Itens que dependem de haver gatilho de TT
 * (certidão, download, encaminhamento) não se aplicam a quem não tem gatilho
 * depois do início do contrato — e não contam contra o progresso.
 */
export function checklistTT (lojista, reg) {
  const r = reg || {}
  const respondeu = r.houveMudanca != null || r.indicio === 'nao'
  const gatilho = r.houveMudanca === true && normalizarTipo(r.tipo) !== 'outra' &&
    (!lojista.inicioContrato || !r.dataMudanca || String(r.dataMudanca).slice(0, 10) >= String(lojista.inicioContrato).slice(0, 10))
  const semGatilho = respondeu && !gatilho
  const protocolo = r.protocolo || r.guiaNumero
  const itens = [
    { chave: 'cnpj', rotulo: 'CNPJ / NIRE confirmado', feito: !!r.nireConfirmado },
    { chave: 'inicio', rotulo: 'Data de início do contrato anotada', feito: !!lojista.inicioContrato, auto: true },
    { chave: 'atos', rotulo: 'Atos posteriores à data do contrato listados', feito: !!r.atosListados },
    { chave: 'gatilho', rotulo: 'Gatilho de TT avaliado (capital / sócio / administrador / objeto)', feito: respondeu, auto: true },
    { chave: 'certidao', rotulo: 'Certidão solicitada, protocolo anotado, guia paga', feito: !!(protocolo && r.guiaPagaEm), naoAplica: semGatilho },
    { chave: 'baixada', rotulo: 'Certidão baixada e arquivada', feito: !!r.certidaoBaixadaEm, naoAplica: semGatilho },
    { chave: 'encaminhado', rotulo: 'Caso encaminhado para cobrança / jurídico', feito: !!(r.encaminhadoEm || (r.validadoEm && r.cobrar === true)), naoAplica: semGatilho || (!!r.validadoEm && r.cobrar === false) },
  ]
  const aplicaveis = itens.filter(i => !i.naoAplica)
  const feitos = aplicaveis.filter(i => i.feito).length
  return { itens, feitos, total: aplicaveis.length, completo: feitos === aplicaveis.length, gatilho }
}

/** A mudança é recente se a data cai nos 12 meses anteriores a hoje. */
export function mudancaRecente (dataMudanca, hoje = new Date()) {
  if (!dataMudanca) return false
  const d = new Date(String(dataMudanca).slice(0, 10) + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return false
  const limite = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate())
  return d >= limite && d <= hoje
}

/** Meses inteiros decorridos desde uma data (contando o mês da data como 1º). */
function mesesDesde (dataIso, hoje) {
  const d = new Date(String(dataIso).slice(0, 10) + 'T00:00:00')
  return (hoje.getFullYear() - d.getFullYear()) * 12 + (hoje.getMonth() - d.getMonth()) + 1
}

/**
 * Situação societária de um lojista. O fluxo de notificação começa na data da
 * validação (não na abertura do ciclo), uma etapa por mês — a mesma régua da
 * auditoria fiscal.
 */
export function situacaoSocietaria (lojista, reg, hoje = new Date()) {
  const r = reg || {}
  // só interessa alteração registrada depois do início do contrato com o shopping
  const inicio = lojista.inicioContrato ? String(lojista.inicioContrato).slice(0, 10) : null
  const aposContrato = !inicio || !r.dataMudanca || String(r.dataMudanca).slice(0, 10) >= inicio
  const causaTT = !r.tipo || normalizarTipo(r.tipo) !== 'outra'
  const recente = r.houveMudanca === true && mudancaRecente(r.dataMudanca, hoje) && aposContrato && causaTT
  let status = STATUS_SOC.NAO_CONSULTADO
  if (r.houveMudanca == null && r.indicio === 'nao') status = STATUS_SOC.SEM_INDICIO
  if (r.houveMudanca === false) status = STATUS_SOC.SEM_MUDANCA
  else if (r.houveMudanca === true && !aposContrato) status = STATUS_SOC.ANTERIOR_CONTRATO
  else if (r.houveMudanca === true && !causaTT) status = STATUS_SOC.OUTRA_ALTERACAO
  else if (r.houveMudanca === true && !r.dataMudanca) status = STATUS_SOC.FALTA_DATA
  else if (r.houveMudanca === true && !recente) status = STATUS_SOC.MUDANCA_ANTIGA
  else if (recente) status = STATUS_SOC.SINALIZADO
  // a janela de 12 meses vale para sinalizar; caso já validado pelo time não some quando ela passa
  const validado = r.houveMudanca === true && aposContrato && causaTT && !!r.validadoEm && (recente || r.cobrar != null)
  if (validado && r.isencao === 'sim' && r.cobrar !== true) status = STATUS_SOC.ISENTO
  const emCobranca = validado && r.cobrar === true
  if (emCobranca) status = r.cobrado ? STATUS_SOC.COBRADO : r.negociado ? STATUS_SOC.NEGOCIADO : STATUS_SOC.EM_COBRANCA

  const feitas = ETAPAS.filter(e => r.notificacoes && r.notificacoes[e.chave]).map(e => e.chave)
  let devida = null; let atrasadas = 0
  if (status === STATUS_SOC.EM_COBRANCA) {
    const meses = mesesDesde(r.validadoEm, hoje)
    for (const e of ETAPAS) {
      if (r.notificacoes && r.notificacoes[e.chave]) continue
      if (e.mes <= meses) { if (!devida) devida = e; atrasadas++ }
    }
  }
  return {
    cnpj: lojista.cnpj, lojista, reg: r, status, recente, aposContrato, inicioContrato: inicio,
    semInicioContrato: !inicio,
    guiaAPagar: r.indicio === 'sim' && !r.guiaPagaEm,
    aguardandoDownload: !!r.guiaPagaEm && !r.certidaoBaixadaEm,
    checklist: checklistTT(lojista, r),
    precisaValidar: recente && !r.validadoEm,
    emCobranca, devida, atrasadas, etapasFeitas: feitas,
    multada: !!(r.notificacoes && r.notificacoes.multa),
  }
}

export function resumoSocietario (acomp, hoje = new Date()) {
  const ativos = (acomp.lojistas || []).filter(l => l.ativo !== false)
  const situacoes = ativos.map(l => situacaoSocietaria(l, (acomp.societario || {})[l.cnpj], hoje))
  const contagem = { total: ativos.length }
  for (const s of Object.values(STATUS_SOC)) contagem[s] = 0
  for (const s of situacoes) contagem[s.status]++
  const valores = { taxa: 0, negociado: 0, cobrado: 0 }
  for (const s of situacoes) for (const k of Object.keys(valores)) valores[k] += Number((s.reg.valores && s.reg.valores[k]) || 0)
  return { situacoes, contagem, valores,
    aValidar: situacoes.filter(s => s.precisaValidar),
    guiasAPagar: situacoes.filter(s => s.guiaAPagar),
    aguardandoDownload: situacoes.filter(s => s.aguardandoDownload),
    checklistCompleto: situacoes.filter(s => s.checklist.completo),
    semInicioContrato: situacoes.filter(s => s.semInicioContrato),
    pendentes: situacoes.filter(s => s.devida),
    sinalizados: situacoes.filter(s => s.recente) }
}

/** Nome do tipo de mudança, para texto. */
function tipoRotulo (chave) {
  const t = TIPOS_MUDANCA.find(x => x[0] === normalizarTipo(chave))
  return t ? t[1].toLowerCase() : 'alteração societária'
}

/**
 * Os textos da cobrança da taxa de transferência, com a mesma régua de cinco
 * etapas da auditoria fiscal. `prefs.clausulaTaxa` é a cláusula do contrato,
 * escrita pelo time; o sistema não inventa percentual nem valor.
 */
export function textoTaxa (etapa, lojista, reg, prefs = {}) {
  const shopping = prefs.shopping || 'o Shopping'
  const prazo = Number(prefs.prazoDias) || 10
  const nome = lojista.nome || lojista.razao || formatarCnpj(lojista.cnpj)
  const luc = lojista.luc ? ` (LUC ${lojista.luc})` : ''
  const assinatura = prefs.assinatura || 'Equipe de Auditoria'
  const clausula = prefs.clausulaTaxa || 'a cláusula de taxa de transferência prevista no contrato de locação'
  const quando = reg.dataMudanca ? ` registrada em ${String(reg.dataMudanca).slice(0, 10).split('-').reverse().join('/')}` : ''
  const registro = reg.registro ? ` (registro ${reg.registro})` : ''
  const fato = `a ${tipoRotulo(reg.tipo)} na ${lojista.razao || nome}${quando}${registro}`
  const valor = reg.valores && reg.valores.taxa ? `, no valor de ${moedaBR(reg.valores.taxa)}` : ''
  const limite = reg.limite ? ` O contrato admite sem taxa: ${reg.limite}; a alteração registrada ultrapassa esse limite.` : ''
  const modelos = {
    n1: {
      assunto: `Taxa de transferência — alteração societária — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nIdentificamos na Junta Comercial ${fato}. Pelo contrato de locação, a transferência da loja a novos sócios ` +
        `ou o novo controle enseja ${clausula}${valor}.${limite}\n\nPedimos, em ${prazo} dias, a comprovação da alteração (contrato social consolidado) e o ` +
        `contato para o acerto da taxa — ou, se entenderem que a alteração está na faixa de isenção, a demonstração disso.\n\n${assinatura}`,
    },
    n2: {
      assunto: `2ª notificação — taxa de transferência — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nNão recebemos retorno sobre ${fato} e ${clausula}${valor}. Esta é a segunda solicitação; pedimos o retorno em ${prazo} dias.\n\n${assinatura}`,
    },
    n3: {
      assunto: `3ª e última notificação — taxa de transferência — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nEsta é a terceira e última solicitação de acerto d${clausula.startsWith('a ') ? clausula.slice(1) : 'e ' + clausula}${valor}, ` +
        `devida por ${fato}. Sem retorno em ${prazo} dias, ${shopping} passará a aplicar os encargos contratuais pela inadimplência.\n\n${assinatura}`,
    },
    aviso: {
      assunto: `Aviso de cobrança — taxa de transferência — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nApós três solicitações sem acerto, comunicamos que ${clausula}${valor}, devida por ${fato}, será lançada ` +
        `no próximo boleto de encargos com os acréscimos contratuais. Este é o aviso prévio: o acerto em ${prazo} dias evita os acréscimos.\n\n${assinatura}`,
    },
    multa: {
      assunto: `Lançamento da taxa de transferência — ${nome}`,
      corpo: `Prezados, ${nome}${luc},\n\nEsgotado o prazo do aviso, fica lançada ${clausula}${valor}, devida por ${fato}, com os acréscimos contratuais, ` +
        `no próximo boleto de encargos. A apresentação do contrato social consolidado continua obrigatória.\n\n${assinatura}`,
    },
  }
  const m = modelos[etapa] || modelos.n1
  return { ...m,
    mailto: `mailto:${encodeURIComponent(lojista.email || '')}?subject=${encodeURIComponent(m.assunto)}&body=${encodeURIComponent(m.corpo)}`,
    whatsapp: lojista.telefone ? `https://wa.me/${String(lojista.telefone).replace(/\D/g, '')}?text=${encodeURIComponent(m.assunto + '\n\n' + m.corpo)}` : null }
}

/** Rótulos das etapas no contexto da taxa: a última é lançamento, não multa. */
export function rotuloEtapaTaxa (etapa) {
  return etapa.chave === 'multa' ? 'Taxa lançada' : etapa.chave === 'aviso' ? 'Aviso de cobrança' : etapa.rotulo
}

export function societarioCsv (resumo) {
  const cab = ['CNPJ', 'Loja', 'LUC', 'UF', 'Junta', 'Início do contrato', 'Status', 'Motivo', 'NIRE', 'Checklist', 'Indício na triagem', 'Guia paga em', 'Protocolo', 'Certidão baixada em', 'Encaminhado em', 'Consultado em', 'Houve mudança', 'Data da mudança', 'Tipo', 'Registro',
    'Isenção', 'Limite contratual', 'Validado em', 'Cobrar', '1ª notificação', '2ª notificação', '3ª notificação', 'Aviso de cobrança', 'Taxa lançada',
    'Negociado em', 'Cobrado em', 'Taxa (R$)', 'Negociado (R$)', 'Cobrado (R$)', 'Observações']
  const linhas = resumo.situacoes.map(s => {
    const r = s.reg; const n = r.notificacoes || {}; const v = r.valores || {}; const j = JUNTAS[String(s.lojista.uf || '').toUpperCase()]
    return [formatarCnpj(s.cnpj), s.lojista.nome, s.lojista.luc, s.lojista.uf, j ? j.sigla : '', s.lojista.inicioContrato, s.status,
      (MOTIVOS_PESQUISA.find(m => m[0] === r.motivo) || ['', ''])[1], r.nire, `${s.checklist.feitos}/${s.checklist.total}`,
      r.indicio, r.guiaPagaEm, r.protocolo || r.guiaNumero, r.certidaoBaixadaEm, r.encaminhadoEm, r.consultadoEm,
      r.houveMudanca == null ? '' : r.houveMudanca ? 'sim' : 'não', r.dataMudanca, r.tipo, r.registro, r.isencao, r.limite, r.validadoEm,
      r.cobrar == null ? '' : r.cobrar ? 'sim' : 'não', n.n1, n.n2, n.n3, n.aviso, n.multa, r.negociado, r.cobrado, v.taxa, v.negociado, v.cobrado, r.obs]
  })
  const cel = (x) => {
    if (x == null) return ''
    if (typeof x === 'number') return String(Math.round(x * 100) / 100).replace('.', ',')
    const s = String(x)
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  return '﻿' + [cab, ...linhas].map(l => l.map(cel).join(';')).join('\r\n') + '\r\n'
}

