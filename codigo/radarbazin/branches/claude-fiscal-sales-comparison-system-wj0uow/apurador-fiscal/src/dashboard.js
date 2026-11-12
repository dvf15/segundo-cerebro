/**
 * Dashboard: os números de acompanhamento dos três processos, e as pendências
 * de cada um. Funções puras — recebem o acompanhamento persistido, o histórico
 * da triangulação e a data; a tela só desenha.
 *
 *   Auditoria fiscal (anual)  % recebidos, auditados, negociados, cobrados;
 *                             evolução acumulada mês a mês do ciclo.
 *   Triangulação (mensal)     % de lojistas com cada etapa na competência de
 *                             referência (Z, PDV, NAPP, declarado, mês fechado);
 *                             variação em R$ (maior − menor) média e máxima, e
 *                             venda não declarada, por competência.
 *   Societário / TT           % pesquisados na Junta, % contatados, TT
 *                             contratual encontrada e % faturado sobre ela.
 */
import { competenciaLabel, moedaBR } from './parsers.js'
import { STATUS_LIVRO, mesesDoCiclo, situacao, dataBR } from './acompanhamento.js'
import { STATUS_SOC, situacaoSocietaria } from './societario.js'
import { limitesTri } from './triangulacao.js'

const pct = (n, d) => d ? Math.round(n / d * 1000) / 10 : 0
const ORDEM_LIVRO = [STATUS_LIVRO.NAO_RECEBIDO, STATUS_LIVRO.RECEBIDO, STATUS_LIVRO.AUDITADO, STATUS_LIVRO.NEGOCIADO, STATUS_LIVRO.COBRADO]
const alcancou = (status, alvo) => ORDEM_LIVRO.indexOf(status) >= ORDEM_LIVRO.indexOf(alvo)

/* ------------------------------------------------------ auditoria fiscal */

export function dashFiscal (acomp, ciclo) {
  const ativos = acomp.lojistas.filter(l => l.ativo !== false)
  const regs = acomp.ciclos[ciclo.chave] || {}
  const sit = ativos.map(l => situacao(l, regs[l.cnpj], ciclo))
  const n = ativos.length
  const conta = (alvo) => sit.filter(s => alcancou(s.status, alvo)).length
  const etapas = [
    { chave: 'recebido', rotulo: 'Livros recebidos', qtd: conta(STATUS_LIVRO.RECEBIDO) },
    { chave: 'auditado', rotulo: 'Apurados (auditados)', qtd: conta(STATUS_LIVRO.AUDITADO) },
    { chave: 'negociado', rotulo: 'Negociados', qtd: conta(STATUS_LIVRO.NEGOCIADO) },
    { chave: 'cobrado', rotulo: 'Cobrados', qtd: conta(STATUS_LIVRO.COBRADO) },
  ].map(e => ({ ...e, total: n, pct: pct(e.qtd, n) }))

  // evolução: quantos tinham cada marco ao fim de cada mês do ciclo
  const meses = mesesDoCiclo(ciclo)
  const series = ['recebido', 'auditado', 'cobrado'].map(chave => ({
    chave,
    pontos: meses.map(m => ({ mes: m, label: competenciaLabel(m),
      qtd: sit.filter(s => s.reg && s.reg[chave] && String(s.reg[chave]).slice(0, 7) <= m).length })),
  }))
  for (const s of series) for (const p of s.pontos) p.pct = pct(p.qtd, n)

  const valores = { divergencia: 0, negociado: 0, cobrado: 0 }
  for (const s of sit) for (const k of Object.keys(valores)) valores[k] += Number((s.reg && s.reg.valores && s.reg.valores[k]) || 0)

  const pendencias = [
    { rotulo: 'Livros não recebidos', lista: sit.filter(s => s.status === STATUS_LIVRO.NAO_RECEBIDO),
      detalhe: s => s.multada ? 'multado' : s.devida ? `devida: ${s.devida.rotulo}` : 'em dia no fluxo' },
    { rotulo: 'Recebidos, aguardando apuração', lista: sit.filter(s => s.status === STATUS_LIVRO.RECEBIDO),
      detalhe: s => `recebido em ${dataBR(s.reg.recebido)}` },
    { rotulo: 'Apurados, aguardando negociação', lista: sit.filter(s => s.status === STATUS_LIVRO.AUDITADO),
      detalhe: s => `apurado em ${dataBR(s.reg.auditado)}` },
    { rotulo: 'Negociados, aguardando cobrança', lista: sit.filter(s => s.status === STATUS_LIVRO.NEGOCIADO),
      detalhe: s => `negociado em ${dataBR(s.reg.negociado)}` },
  ]
  return { total: n, etapas, series, valores, pendencias, notificacoesDevidas: sit.filter(s => s.devida).length }
}

/* ---------------------------------------------------------- triangulação */

/**
 * Etapas por lojista ativo numa competência: redução Z, relatório de PDV,
 * declarado e mês fechado. `historico` é o que `historicoParaCruzamento`
 * devolve: fechamentos persistidos mais os meses abertos da sessão.
 */
export function dashTriangulacao (acomp, historico, opts = {}) {
  const ativos = acomp.lojistas.filter(l => l.ativo !== false)
  const n = ativos.length
  const atencao = limitesTri(opts).atencao
  const comps = [...new Set((historico || []).map(h => h.competencia))].sort()
  const referencia = opts.competencia && comps.includes(opts.competencia) ? opts.competencia : comps[comps.length - 1] || null
  const daComp = (c) => (historico || []).filter(h => h.competencia === c)
  const linhasRef = referencia ? daComp(referencia) : []
  const porCnpj = new Map(linhasRef.map(h => [h.cnpj, h]))
  const tem = (h, campo) => h && h[campo] != null
  const etapa = (rotulo, teste) => { const qtd = ativos.filter(l => teste(porCnpj.get(l.cnpj))).length; return { rotulo, qtd, total: n, pct: pct(qtd, n) } }
  const etapas = referencia ? [
    etapa('Redução Z recebida', h => tem(h, 'z')),
    etapa('Relatório de PDV recebido', h => tem(h, 'pdv')),
    etapa('NAPP recebido', h => tem(h, 'napp')),
    etapa('Declarado (ficha) presente', h => tem(h, 'declarado')),
    etapa('Mês fechado', h => !!(h && h.fechado)),
  ] : []

  // variação em R$ por competência: média e máxima entre os lojistas com 2+ tipos de lançamento
  const dispersao = comps.slice(-12).map(c => {
    const vals = daComp(c).map(h => h.amplitude).filter(v => v != null)
    const naoDeclarado = daComp(c).reduce((a, h) => a + (Number(h.naoDeclarado) || 0), 0)
    return { competencia: c, label: competenciaLabel(c), lojistas: vals.length,
      media: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 100) / 100 : null,
      maxima: vals.length ? Math.max(...vals) : null,
      naoDeclarado: Math.round(naoDeclarado * 100) / 100,
      fechada: daComp(c).length > 0 && daComp(c).every(h => h.fechado) }
  })
  const nome = (cnpj) => (ativos.find(l => l.cnpj === cnpj) || { nome: cnpj }).nome
  const item = (h, detalhe) => ({ cnpj: h.cnpj, lojista: ativos.find(l => l.cnpj === h.cnpj) || { cnpj: h.cnpj, nome: nome(h.cnpj) }, detalhe })
  const pendencias = referencia ? [
    { rotulo: `Sem redução Z em ${competenciaLabel(referencia)}`, lista: ativos.filter(l => !tem(porCnpj.get(l.cnpj), 'z')).map(l => ({ cnpj: l.cnpj, lojista: l, detalhe: 'pedir os cupons Z do mês' })) },
    { rotulo: `Sem relatório de PDV em ${competenciaLabel(referencia)}`, lista: ativos.filter(l => !tem(porCnpj.get(l.cnpj), 'pdv')).map(l => ({ cnpj: l.cnpj, lojista: l, detalhe: 'pedir o relatório do caixa' })) },
    { rotulo: 'Meses com dados e ainda não fechados', lista: (historico || []).filter(h => !h.fechado).map(h => item(h, `${competenciaLabel(h.competencia)} aberto`)) },
    { rotulo: `Variação acima de ${moedaBR(atencao)}`, lista: (historico || []).filter(h => h.amplitude != null && h.amplitude > atencao)
      .sort((a, b) => b.amplitude - a.amplitude).map(h => item(h, `${competenciaLabel(h.competencia)}: ${moedaBR(h.amplitude)}`)) },
  ] : [
    { rotulo: 'Nenhuma competência triangulada ainda', lista: ativos.map(l => ({ cnpj: l.cnpj, lojista: l, detalhe: 'sem Z nem PDV' })) },
  ]
  return { total: n, referencia, competencias: comps, etapas, dispersao, atencao, pendencias }
}

/* -------------------------------------------------------------- societário */

export function dashSocietario (acomp, hoje = new Date()) {
  const ativos = acomp.lojistas.filter(l => l.ativo !== false)
  const sit = ativos.map(l => situacaoSocietaria(l, (acomp.societario || {})[l.cnpj], hoje))
  const n = ativos.length
  const pesquisados = sit.filter(s => s.status !== STATUS_SOC.NAO_CONSULTADO || s.reg.consultadoEm || s.reg.indicio)
  const confirmados = sit.filter(s => s.emCobranca)
  const contatados = confirmados.filter(s => s.etapasFeitas.length)
  // encontrada: sinalizada nos 12 meses ou já em cobrança (que segue valendo depois da janela), menos as isentas
  const encontrada = sit.filter(s => (s.recente || s.emCobranca) && s.status !== STATUS_SOC.ISENTO)
  const soma = (lista, k) => lista.reduce((a, s) => a + Number((s.reg.valores && s.reg.valores[k]) || 0), 0)
  const ttEncontrada = soma(encontrada, 'taxa')
  // negociada e faturada sobre o mesmo conjunto da encontrada, para o % fazer sentido
  const ttFaturada = soma(encontrada, 'cobrado')
  const ttNegociada = soma(encontrada, 'negociado')
  const etapas = [
    { rotulo: 'Pesquisados na Junta', qtd: pesquisados.length, total: n },
    { rotulo: 'Checklist da skill completo', qtd: sit.filter(s => s.checklist.completo).length, total: n },
    { rotulo: 'Sinalizados (causa de TT, 12 meses)', qtd: sit.filter(s => s.recente).length, total: n },
    { rotulo: 'TT confirmada pelo time', qtd: confirmados.length, total: n },
    { rotulo: 'Contatados (1ª notificação ou além)', qtd: contatados.length, total: confirmados.length, base: 'das confirmadas' },
    { rotulo: 'Cobrados', qtd: sit.filter(s => s.status === STATUS_SOC.COBRADO).length, total: confirmados.length, base: 'das confirmadas' },
  ].map(e => ({ ...e, pct: pct(e.qtd, e.total) }))
  const pendencias = [
    { rotulo: 'Não pesquisados na Junta', lista: sit.filter(s => !pesquisados.includes(s)), detalhe: s => s.lojista.uf ? `Junta de ${s.lojista.uf}` : 'falta UF do contrato' },
    { rotulo: 'Guias a pagar (indício na triagem)', lista: sit.filter(s => s.guiaAPagar), detalhe: () => 'pedir a certidão' },
    { rotulo: 'Certidão paga, aguardando download', lista: sit.filter(s => s.aguardandoDownload), detalhe: s => `protocolo ${s.reg.protocolo || s.reg.guiaNumero || '—'} · pago em ${dataBR(s.reg.guiaPagaEm)}` },
    { rotulo: 'Sinalizados aguardando validação do time', lista: sit.filter(s => s.precisaValidar), detalhe: s => `alteração em ${dataBR(s.reg.dataMudanca)}` },
    { rotulo: 'TT confirmada sem contato', lista: confirmados.filter(s => !s.etapasFeitas.length), detalhe: s => `confirmada em ${dataBR(s.reg.validadoEm)}` },
    { rotulo: 'Notificações de TT devidas', lista: sit.filter(s => s.devida), detalhe: s => s.devida.rotulo },
    { rotulo: 'Sem data de início do contrato', lista: sit.filter(s => s.semInicioContrato), detalhe: () => 'não dá para separar alteração anterior' },
  ]
  return { total: n, etapas, ttEncontrada, ttNegociada, ttFaturada, pctFaturado: pct(ttFaturada, ttEncontrada), pendencias }
}

