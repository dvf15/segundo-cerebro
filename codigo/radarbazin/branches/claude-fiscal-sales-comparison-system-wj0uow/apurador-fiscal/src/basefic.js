/**
 * Base fictícia para testar o app: uma carteira de 40 lojistas de um shopping
 * inventado, com o ciclo anual em andamento, notificações, seis meses de
 * triangulação fechada e o societário em vários estágios. Tudo é gerado em
 * relação à data de hoje, para o ciclo e os prazos fazerem sentido em qualquer
 * dia que alguém abrir a base.
 *
 * Determinística (semente fixa): a mesma data gera a mesma base, o que deixa
 * testes e vídeos reproduzíveis. Nomes, CNPJs e valores são FICTÍCIOS; os
 * CNPJs têm dígito verificador válido porque o app recusa os inválidos. Os
 * dois primeiros lojistas usam os CNPJs dos livros de demo/, para a auditoria
 * fiscal dar conciliação com eles.
 */
import { VERSAO_ACOMPANHAMENTO, cicloAtual, iso } from './acompanhamento.js'
import { resumirFontes } from './triangulacao.js'

const LOJAS = [
  ['Bela Cosméticos', 'Beleza'], ['Bela Cosméticos — quiosque', 'Beleza'], ['Café Aurora', 'Alimentação'], ['Trilha & Cia', 'Esporte'],
  ['Ótica Horizonte', 'Serviços'], ['Brinquedos Pipa', 'Infantil'], ['Casa Linho', 'Casa'], ['Studio Vinil', 'Cultura'],
  ['Sabor da Serra', 'Alimentação'], ['Vértice Calçados', 'Calçados'], ['Lume Joias', 'Joias'], ['Pão de Ló Confeitaria', 'Alimentação'],
  ['Urbano Moda Masculina', 'Moda'], ['Flor de Sal', 'Alimentação'], ['Mundo Pet Center', 'Pet'], ['Ateliê Brisa', 'Moda'],
  ['Tech Point Celulares', 'Eletrônicos'], ['Livraria Página 9', 'Cultura'], ['Doce Lima Sorvetes', 'Alimentação'], ['Nuvem Kids', 'Infantil'],
  ['Forma Academia Store', 'Esporte'], ['Raiz Natural', 'Saúde'], ['Bambu Decor', 'Casa'], ['Farol Óculos', 'Serviços'],
  ['Matiz Perfumaria', 'Beleza'], ['Grão Torrado Café', 'Alimentação'], ['Passo Leve Tênis', 'Calçados'], ['Linha Fina Alfaiataria', 'Moda'],
  ['Brasa Grill', 'Alimentação'], ['Clique Fotografia', 'Serviços'], ['Onda Surf Shop', 'Esporte'], ['Prisma Bijoux', 'Joias'],
  ['Vila Massas', 'Alimentação'], ['Ponto Cruz Armarinho', 'Casa'], ['Cacau & Cia', 'Alimentação'], ['Zênite Eletro', 'Eletrônicos'],
  ['Rota Viagens', 'Serviços'], ['Alfa Farma', 'Saúde'], ['Corte Certo Barbearia', 'Serviços'], ['Estação Games', 'Eletrônicos'],
]
const SOBRENOMES = ['COMERCIO', 'ALIMENTOS', 'MODA', 'SERVICOS', 'VAREJO', 'DISTRIBUIDORA', 'ARTIGOS']

/** Gerador pseudoaleatório com semente (mulberry32). */
function semente (s) {
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function cnpjComDv (base12) {
  const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const dv = (n) => { let s = 0; for (let i = 0; i < n.length; i++) s += Number(n[i]) * pesos[pesos.length - n.length + i]; const r = s % 11; return r < 2 ? 0 : 11 - r }
  const d1 = dv(base12)
  return base12 + d1 + dv(base12 + d1)
}

/** Um mês fechado da triangulação, com a mesma conta do app (maior valor e variação em R$). */
function fechamento (competencia, cnpj, fechadoEm, { z = null, pdv = null, napp = null, declarado = null, diasZ, diasPdv, diasNapp }) {
  const r = resumirFontes({ z, pdv, napp, declarado })
  const alertas = []
  if (pdv != null && z != null && pdv - z > 100) alertas.push({ tipo: 'venda_sem_documento', grave: true, texto: `O PDV registra R$ ${(pdv - z).toLocaleString('pt-BR')} a mais do que a redução Z.` })
  if (r.naoDeclarado > 100) alertas.push({ tipo: 'declarado_a_menor', grave: true, texto: `Foi declarado R$ ${r.naoDeclarado.toLocaleString('pt-BR')} a menos do que o maior valor registrado.` })
  const nomes = { z: 'Redução Z', pdv: 'PDV', napp: 'NAPP', declarado: 'Declarado' }
  return { competencia, cnpj, fechadoEm, z, pdv, napp, declarado, diasZ: diasZ ?? (z == null ? 0 : 30), diasPdv: diasPdv ?? (pdv == null ? 0 : 30),
    diasNapp: diasNapp ?? (napp == null ? 0 : 30), ...r, alertas,
    explicacao: r.amplitude == null ? 'Só uma fonte.' : `Maior valor: ${r.fonteMaior.map(k => nomes[k]).join(' e ')}; variação de R$ ${r.amplitude.toLocaleString('pt-BR')} entre os tipos de lançamento.` }
}

/** Monta o acompanhamento fictício completo (a mesma forma que o app guarda). */
export function gerarBaseFicticia (hoje = new Date()) {
  const rnd = semente(20261018)
  // sequência à parte para os campos da skill de TT: não altera o resto da base
  const rnd2 = semente(7)
  const sorte2 = (p) => rnd2() < p
  const entre2 = (a, b) => a + Math.floor(rnd2() * (b - a + 1))
  // outra sequência à parte para o NAPP, que veio depois: a base de antes não muda
  const rnd3 = semente(11)
  const entre = (a, b) => a + Math.floor(rnd() * (b - a + 1))
  const sorte = (p) => rnd() < p
  const ciclo = cicloAtual(hoje)
  const inicioCiclo = new Date(ciclo.ano, 3, 1)
  const diaDoCiclo = (minMes, maxMes) => {
    const m = entre(minMes, maxMes); const d = new Date(ciclo.ano, 3 + m, entre(2, 27))
    return d > hoje ? hoje : d
  }
  const depois = (data, minDias, maxDias) => { const d = new Date(data); d.setDate(d.getDate() + entre(minDias, maxDias)); return d > hoje ? null : d }
  const dIso = (d) => d ? iso(d) : null
  const decorridos = ciclo.mesesDecorridos

  const lojistas = LOJAS.map(([nome, segmento], i) => {
    const cnpj = i === 0 ? '11222333000181' : i === 1 ? '11222333000262'
      : cnpjComDv(String(10 + entre(0, 89)).padStart(2, '0') + String(entre(100000, 999999)) + '0001')
    const uf = i < 30 ? 'SP' : ['RJ', 'MG', 'PR', 'RJ', 'MG', 'SC', 'BA', 'RS', 'GO', 'DF'][i - 30]
    const ini = new Date(entre(2015, 2026), entre(0, 11), entre(1, 28))
    const inicio = ini > hoje ? new Date(hoje.getFullYear() - 1, 5, 1) : ini
    return {
      cnpj, nome, razao: i < 2 ? 'BELA COSMETICOS LTDA' : `${nome.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z0-9 ]/g, '').trim()} ${SOBRENOMES[i % SOBRENOMES.length]} LTDA`,
      luc: String(100 + i * 7 + entre(0, 5)),
      email: i % 9 === 5 ? '' : `fiscal@${nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '')}.com.br`,
      telefone: i % 7 === 3 ? '' : `1198${String(entre(1000000, 9999999))}`,
      regime: sorte(0.45) ? 'simples' : 'normal', segmento, uf, inicioContrato: iso(inicio), ativo: i !== 39,
    }
  })

  /* ---- auditoria fiscal do ciclo: marcos, valores, notificações ---- */
  const regs = {}
  for (const l of lojistas) {
    const reg = { recebido: null, auditado: null, negociado: null, cobrado: null, notificacoes: {}, valores: {}, obs: '' }
    const entregou = sorte(0.58)
    if (entregou) {
      const rec = diaDoCiclo(0, Math.max(0, decorridos - 1)); reg.recebido = dIso(rec)
      const aud = sorte(0.72) ? depois(rec, 12, 60) : null; reg.auditado = dIso(aud)
      if (aud) {
        const div = sorte(0.35) ? 0 : Math.round(entre(800, 85000) / 10) * 10
        reg.valores.divergencia = div
        const neg = div && sorte(0.65) ? depois(aud, 10, 45) : null; reg.negociado = dIso(neg)
        if (neg) {
          reg.valores.negociado = Math.round(div * (0.6 + rnd() * 0.35) / 10) * 10
          const cob = sorte(0.7) ? depois(neg, 7, 40) : null; reg.cobrado = dIso(cob)
          if (cob) reg.valores.cobrado = reg.valores.negociado
        }
      }
      // quem entregou tarde passou por notificações antes
      const mesRec = (rec.getFullYear() - ciclo.ano) * 12 + rec.getMonth() - 3
      ;['n1', 'n2', 'n3', 'aviso'].slice(0, Math.max(0, mesRec)).forEach((e, k) => { reg.notificacoes[e] = iso(new Date(ciclo.ano, 3 + k, 5)) })
    } else {
      // em dia, atrasado ou multado no fluxo
      const feitas = sorte(0.35) ? Math.min(5, decorridos) : Math.max(0, Math.min(4, decorridos - 1) - entre(0, 3))   // multados × atrasados no fluxo
      ;['n1', 'n2', 'n3', 'aviso', 'multa'].slice(0, Math.min(5, feitas)).forEach((e, k) => { reg.notificacoes[e] = iso(new Date(ciclo.ano, 3 + k, entre(3, 9))) })
    }
    regs[l.cnpj] = reg
  }

  /* ---- triangulação: seis meses fechados antes do mês corrente ---- */
  const fechamentos = []
  for (let k = 6; k >= 1; k--) {
    const ref = new Date(hoje.getFullYear(), hoje.getMonth() - k, 1)
    const comp = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`
    const fechadoEm = iso(new Date(ref.getFullYear(), ref.getMonth() + 1, entre(3, 12)))
    const cobertura = 0.45 + (6 - k) * 0.07   // a adesão cresce mês a mês
    for (const l of lojistas.filter(x => x.ativo)) {
      if (!sorte(cobertura)) continue
      const base = entre(30000, 260000)
      const temPdv = sorte(0.9); const temDec = sorte(0.85)
      // desvio grande em ~18%; o pequeno fica na casa das dezenas a poucas centenas de reais
      const desvio = sorte(0.18) ? 0.04 + rnd() * 0.16 : rnd() * 0.0012
      const z = base
      const pdv = temPdv ? Math.round(base * (1 + (sorte(0.7) ? desvio : -desvio / 2))) : null
      const dec = temDec ? Math.round(base * (1 - (sorte(0.6) ? desvio : rnd() * 0.0004))) : null
      // NAPP em pouco mais da metade dos lojistas; às vezes acima de todos os outros lançamentos
      const napp = rnd3() < 0.55 ? Math.round(base * (rnd3() < 0.12 ? 1.03 + rnd3() * 0.05 : 0.9997 + rnd3() * 0.0008)) : null
      const diasZ = 28 + entre(0, 3); const diasPdv = temPdv ? 28 + entre(0, 3) : 0
      fechamentos.push(fechamento(comp, l.cnpj, fechadoEm, { z, pdv, napp, declarado: dec, diasZ, diasPdv, diasNapp: napp == null ? 0 : diasZ }))
    }
  }

  /* ---- societário ---- */
  const societario = {}
  const causas = ['capital', 'socio_admin', 'entrada_saida', 'objeto']
  for (const l of lojistas) {
    if (!sorte(0.78)) continue    // ainda não pesquisado
    const r = { indicio: null, guiaPagaEm: null, guiaNumero: '', consultadoEm: dIso(diaDoCiclo(0, Math.max(0, decorridos - 1))), houveMudanca: null, dataMudanca: null,
      tipo: '', registro: '', descricao: '', isencao: null, limite: '', validadoEm: null, cobrar: null, notificacoes: {}, negociado: null, cobrado: null,
      valores: { taxa: null, negociado: null, cobrado: null }, obs: '' }
    r.motivo = sorte2(0.75) ? 'periodica' : sorte2(0.5) ? 'renovacao' : 'suspeita'
    r.nire = String(entre2(31200000000, 35299999999)); r.nireConfirmado = sorte2(0.85); r.atosListados = sorte2(0.8)
    const x = rnd()
    if (x < 0.42) { r.indicio = 'nao' } else if (x < 0.5) { r.indicio = 'sim' } else if (x < 0.62) { r.indicio = 'nao'; r.houveMudanca = false } else {
      r.indicio = 'sim'; r.guiaPagaEm = r.consultadoEm; entre(10000, 99999) /* mantém a sequência da base original */; r.protocolo = `${ciclo.ano}${entre2(1000000, 9999999)}`
      if (sorte2(0.75)) { const b = new Date(r.guiaPagaEm + 'T12:00:00'); b.setDate(b.getDate() + entre2(2, 8)); if (b <= hoje) r.certidaoBaixadaEm = iso(b) }
      r.houveMudanca = true
      const meses = sorte(0.15) ? entre(13, 16) : entre(1, 11)
      const dm = new Date(hoje.getFullYear(), hoje.getMonth() - meses, entre(1, 27))
      r.dataMudanca = iso(dm); r.tipo = sorte(0.12) ? 'outra' : causas[entre(0, 3)]
      r.registro = `${entre(100000, 999999)}/${dm.getFullYear()}`
      r.descricao = { capital: 'aumento de capital social', socio_admin: 'troca de administrador', entrada_saida: 'saída de sócio e entrada de novo sócio', objeto: 'inclusão de atividade no objeto social', outra: 'mudança de endereço da sede' }[r.tipo]
      const taxa = Math.round(entre(8000, 45000) / 100) * 100
      const y = rnd()
      if (y < 0.25) { /* sinalizado, aguardando validação */ } else if (y < 0.4) {
        r.isencao = 'sim'; r.limite = 'até 25% das quotas entre sócios atuais'; r.validadoEm = dIso(depois(dm, 5, 40)) || iso(hoje); r.cobrar = false
      } else {
        r.isencao = 'nao'; r.limite = 'até 25% das quotas entre sócios atuais'; r.valores.taxa = taxa
        const val = depois(dm, 10, 60) || new Date(hoje.getFullYear(), hoje.getMonth() - 1, 10)
        r.validadoEm = iso(val); r.cobrar = true; r.encaminhadoEm = iso(val)
        const mesesVal = (hoje.getFullYear() - val.getFullYear()) * 12 + hoje.getMonth() - val.getMonth() + 1
        ;['n1', 'n2', 'n3', 'aviso', 'multa'].slice(0, Math.max(0, mesesVal - entre(0, 2))).forEach((e, k) => { r.notificacoes[e] = iso(new Date(val.getFullYear(), val.getMonth() + k, Math.min(28, val.getDate() + 1))) })
        if (sorte(0.55)) {
          const neg = depois(val, 20, 90); if (neg) { r.negociado = iso(neg); r.valores.negociado = Math.round(taxa * (0.7 + rnd() * 0.3) / 100) * 100 }
          if (neg && sorte(0.6)) { const cob = depois(neg, 10, 40); if (cob) { r.cobrado = iso(cob); r.valores.cobrado = r.valores.negociado } }
        }
      }
    }
    societario[l.cnpj] = r
  }

  const cenarios = aplicarCenarios({ lojistas, regs, fechamentos, societario, ciclo, hoje })

  return {
    versao: VERSAO_ACOMPANHAMENTO, ficticia: true, geradaEm: iso(hoje),
    lojistas, ciclos: { [ciclo.chave]: regs }, fechamentos, societario, cenarios,
    prefs: {
      shopping: 'o Shopping Parque Exemplo', prazoDias: 10, assinatura: 'Equipe de Auditoria — Shopping Parque Exemplo',
      clausulaMulta: 'a multa de 1 (um) aluguel mínimo prevista na cláusula 18.3 do contrato de locação',
      clausulaTaxa: 'a taxa de transferência de 3 (três) aluguéis mínimos prevista na cláusula 22 do contrato de locação',
    },
    _inicioCiclo: iso(inicioCiclo),
  }
}

/**
 * Cenários fixos: os 22 primeiros lojistas deixam de ser aleatórios e passam a
 * cobrir, de propósito, cada situação que o app sabe mostrar — para o time
 * testar sabendo o que deve aparecer. Devolve o roteiro (quem, processo, o que
 * ver e onde).
 */
function aplicarCenarios ({ lojistas, regs, fechamentos, societario, ciclo, hoje }) {
  const L = (i) => lojistas[i]
  const dCiclo = (mes, dia) => { const d = new Date(ciclo.ano, 3 + mes, dia); return iso(d > hoje ? hoje : d) }
  const mesesAtras = (m, dia = 10) => iso(new Date(hoje.getFullYear(), hoje.getMonth() - m, dia))
  const ultimo = Math.max(0, ciclo.mesesDecorridos - 1)
  const etapas = (n) => Object.fromEntries(['n1', 'n2', 'n3', 'aviso', 'multa'].slice(0, n).map((e, k) => [e, dCiclo(k, 5)]))
  const fiscal = (i, r) => { regs[L(i).cnpj] = { recebido: null, auditado: null, negociado: null, cobrado: null, notificacoes: {}, valores: {}, obs: '', ...r } }
  const soc = (i, r) => {
    societario[L(i).cnpj] = { motivo: 'periodica', nire: String(31200000000 + i * 7919), nireConfirmado: true, atosListados: true, protocolo: '', certidaoBaixadaEm: null,
      encaminhadoEm: null, indicio: null, guiaPagaEm: null, guiaNumero: '', consultadoEm: mesesAtras(1, 3), houveMudanca: null, dataMudanca: null, tipo: '', registro: '',
      descricao: '', isencao: null, limite: '', validadoEm: null, cobrar: null, notificacoes: {}, negociado: null, cobrado: null,
      valores: { taxa: null, negociado: null, cobrado: null }, obs: '', ...r }
  }
  const mudanca = (tipo, meses, extra = {}) => ({ indicio: 'sim', protocolo: `${hoje.getFullYear()}0${meses}1234`, guiaPagaEm: mesesAtras(meses - 1, 2),
    certidaoBaixadaEm: mesesAtras(meses - 1, 8), houveMudanca: true, dataMudanca: mesesAtras(meses, 15), tipo, registro: `${400000 + meses}/${hoje.getFullYear()}`,
    descricao: { capital: 'aumento de capital social', socio_admin: 'troca de administrador', entrada_saida: 'saída de sócio e entrada de novo sócio com 60%', objeto: 'inclusão de atividade no objeto social', outra: 'mudança de endereço da sede' }[tipo], ...extra })
  const cobranca = (taxa, mesesValidado, extra = {}) => ({ isencao: 'nao', limite: 'até 25% das quotas entre sócios atuais', validadoEm: mesesAtras(mesesValidado, 5), cobrar: true,
    encaminhadoEm: mesesAtras(mesesValidado, 5), valores: { taxa, negociado: null, cobrado: null }, ...extra })

  // ---- fiscal ----
  fiscal(0, { recebido: dCiclo(0, 18), auditado: dCiclo(1, 20), negociado: dCiclo(2, 15), cobrado: dCiclo(3, 10), valores: { divergencia: 40000, negociado: 36000, cobrado: 36000 } })
  fiscal(1, { recebido: dCiclo(1, 12) })
  fiscal(2, { notificacoes: etapas(Math.min(3, ultimo)) })
  fiscal(3, { notificacoes: etapas(5) })
  fiscal(4, { notificacoes: etapas(1) })
  fiscal(5, { recebido: dCiclo(1, 6), auditado: dCiclo(2, 9), valores: { divergencia: 18400 } })
  fiscal(6, { recebido: dCiclo(0, 22), auditado: dCiclo(1, 25), negociado: dCiclo(3, 2), valores: { divergencia: 9600, negociado: 8000 } })
  fiscal(7, {})
  L(7).email = ''; L(7).telefone = ''
  // ---- cadastro incompleto ----
  L(8).uf = ''; L(8).inicioContrato = ''
  // ---- triangulação: a competência de referência é o mês passado ----
  const ref = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
  const comp = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`
  const fechadoEm = iso(new Date(hoje.getFullYear(), hoje.getMonth(), 3))
  const tri = (i, z, pdv, dec, napp = null) => {
    const cnpj = L(i).cnpj
    for (let k = fechamentos.length - 1; k >= 0; k--) if (fechamentos[k].cnpj === cnpj && fechamentos[k].competencia === comp) fechamentos.splice(k, 1)
    if (z == null && pdv == null && dec == null && napp == null) return
    fechamentos.push(fechamento(comp, cnpj, fechadoEm, { z, pdv, napp, declarado: dec }))
  }
  tri(0, 121196, 129076, 108050)
  tri(19, 84200, null, null)
  tri(20, null, null, null)
  tri(21, 152300, 152350, 152300, 152320)
  tri(23, 98000, 98100, 98000, 104500)
  fechamentos.sort((a, b) => a.competencia.localeCompare(b.competencia) || a.cnpj.localeCompare(b.cnpj))
  // ---- societário ----
  // contratos antigos para quem tem alteração recente (senão viraria "anterior ao contrato")
  for (const i of [0, 9, 10, 12, 13, 14, 15, 16, 17, 18]) L(i).inicioContrato = `${2016 + (i % 6)}-0${1 + (i % 8)}-1${i % 9}`
  soc(0, { ...mudanca('entrada_saida', 2), ...cobranca(15000, 0) })
  soc(1, { indicio: 'nao' })
  delete societario[L(8).cnpj]
  soc(9, { indicio: 'sim' })
  soc(10, { indicio: 'sim', protocolo: `${hoje.getFullYear()}07778899`, guiaPagaEm: mesesAtras(0, 2) })
  L(11).inicioContrato = mesesAtras(3, 1)
  soc(11, mudanca('capital', 6))
  soc(12, mudanca('outra', 4))
  soc(13, { indicio: 'sim', houveMudanca: true })
  soc(14, mudanca('socio_admin', 3))
  soc(15, { ...mudanca('entrada_saida', 5), isencao: 'sim', limite: 'até 25% das quotas entre sócios atuais', validadoEm: mesesAtras(4, 5), cobrar: false })
  soc(16, { ...mudanca('capital', 6), ...cobranca(22000, 3, { notificacoes: { n1: mesesAtras(3, 6) } }) })
  soc(17, { ...mudanca('objeto', 8), ...cobranca(18000, 6, { notificacoes: { n1: mesesAtras(6, 6), n2: mesesAtras(5, 6) }, negociado: mesesAtras(4, 20), valores: { taxa: 18000, negociado: 14500, cobrado: null } }) })
  soc(18, { ...mudanca('entrada_saida', 9), ...cobranca(30000, 8, { notificacoes: { n1: mesesAtras(8, 6) }, negociado: mesesAtras(7, 10), cobrado: mesesAtras(6, 10), valores: { taxa: 30000, negociado: 27000, cobrado: 27000 } }) })
  soc(21, { indicio: 'nao', houveMudanca: false })

  const nome = (i) => L(i).nome
  return [
    { loja: nome(0), cnpj: L(0).cnpj, processo: 'Auditoria fiscal', situacao: 'Ciclo completo: recebido, apurado, negociado e cobrado (R$ 36.000)', onde: 'Painel · Dashboard' },
    { loja: nome(0), cnpj: L(0).cnpj, processo: 'Triangulação', situacao: `DISPERSO em ${comp.slice(5)}/${comp.slice(0, 4)}: PDV acima da redução Z (alerta grave)`, onde: 'Triangulação · Dashboard' },
    { loja: nome(0), cnpj: L(0).cnpj, processo: 'Societário', situacao: 'TT confirmada este mês, 1ª notificação devida (R$ 15.000)', onde: 'Societário · Notificações' },
    { loja: nome(1), cnpj: L(1).cnpj, processo: 'Auditoria fiscal', situacao: 'Livro recebido, aguardando apuração — carregue os livros de demo/ e ele vira AUDITADO sozinho', onde: 'Auditoria fiscal · Painel' },
    { loja: nome(1), cnpj: L(1).cnpj, processo: 'Societário', situacao: 'Triagem sem indício de TT', onde: 'Societário' },
    { loja: nome(2), cnpj: L(2).cnpj, processo: 'Auditoria fiscal', situacao: 'Livro não recebido, três notificações feitas, próxima etapa devida', onde: 'Notificações' },
    { loja: nome(3), cnpj: L(3).cnpj, processo: 'Auditoria fiscal', situacao: 'Livro não recebido, multa enviada', onde: 'Notificações · Painel (multados)' },
    { loja: nome(4), cnpj: L(4).cnpj, processo: 'Auditoria fiscal', situacao: 'Livro não recebido, só a 1ª notificação: etapas acumuladas', onde: 'Notificações' },
    { loja: nome(5), cnpj: L(5).cnpj, processo: 'Auditoria fiscal', situacao: 'Apurado com divergência de R$ 18.400, aguardando negociação', onde: 'Dashboard (pendências)' },
    { loja: nome(6), cnpj: L(6).cnpj, processo: 'Auditoria fiscal', situacao: 'Negociado (R$ 8.000), aguardando cobrança', onde: 'Dashboard (pendências)' },
    { loja: nome(7), cnpj: L(7).cnpj, processo: 'Auditoria fiscal', situacao: 'Livro não recebido, sem e-mail nem WhatsApp, nenhuma notificação', onde: 'Notificações' },
    { loja: nome(8), cnpj: L(8).cnpj, processo: 'Cadastro', situacao: 'Sem UF e sem início do contrato: a Junta não abre e a aba avisa', onde: 'Societário · Lojistas' },
    { loja: nome(9), cnpj: L(9).cnpj, processo: 'Societário', situacao: 'Indício na triagem, guia a pagar', onde: 'Societário · Dashboard' },
    { loja: nome(10), cnpj: L(10).cnpj, processo: 'Societário', situacao: 'Certidão paga, aguardando download', onde: 'Societário · Dashboard' },
    { loja: nome(11), cnpj: L(11).cnpj, processo: 'Societário', situacao: 'Alteração de capital ANTERIOR ao início do contrato: não é TT', onde: 'Societário' },
    { loja: nome(12), cnpj: L(12).cnpj, processo: 'Societário', situacao: 'Outra alteração (endereço): não é TT', onde: 'Societário' },
    { loja: nome(13), cnpj: L(13).cnpj, processo: 'Societário', situacao: 'Mudança marcada sem a data: "informe a data da alteração"', onde: 'Societário' },
    { loja: nome(14), cnpj: L(14).cnpj, processo: 'Societário', situacao: 'Troca de administrador há 3 meses: sinalizado, aguardando validação', onde: 'Societário · Dashboard' },
    { loja: nome(15), cnpj: L(15).cnpj, processo: 'Societário', situacao: 'Alteração dentro do limite contratual: isento', onde: 'Societário' },
    { loja: nome(16), cnpj: L(16).cnpj, processo: 'Societário', situacao: 'TT em cobrança há 3 meses com só a 1ª notificação: etapas acumuladas (R$ 22.000)', onde: 'Societário · Notificações' },
    { loja: nome(17), cnpj: L(17).cnpj, processo: 'Societário', situacao: 'TT negociada (R$ 14.500 de R$ 18.000)', onde: 'Societário · Dashboard' },
    { loja: nome(18), cnpj: L(18).cnpj, processo: 'Societário', situacao: 'TT cobrada (R$ 27.000), alteração há 9 meses', onde: 'Societário · Dashboard' },
    { loja: nome(19), cnpj: L(19).cnpj, processo: 'Triangulação', situacao: 'Só a redução Z no mês: FONTE ÚNICA', onde: 'Triangulação (histórico)' },
    { loja: nome(20), cnpj: L(20).cnpj, processo: 'Triangulação', situacao: 'Sem Z nem PDV no mês de referência', onde: 'Dashboard (pendências)' },
    { loja: nome(21), cnpj: L(21).cnpj, processo: 'Triangulação + Societário', situacao: 'Z, PDV, NAPP e declarado variam R$ 50: COERENTE; sem mudança societária; checklist completo', onde: 'Triangulação · Societário' },
    { loja: nome(23), cnpj: L(23).cnpj, processo: 'Triangulação', situacao: `NAPP é o maior valor em ${comp.slice(5)}/${comp.slice(0, 4)} (R$ 104.500): R$ 6.500 acima do declarado, DISPERSO`, onde: 'Triangulação (histórico) · Dashboard' },
    { loja: lojistas[39].nome, cnpj: lojistas[39].cnpj, processo: 'Cadastro', situacao: 'Lojista inativo: fora do painel, das notificações e do dashboard', onde: 'Lojistas' },
  ]
}

/** O roteiro de testes da base fictícia em Markdown. */
export function roteiroMarkdown (base) {
  const fmt = (c) => c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  return `# Roteiro de testes — base fictícia do Radar de Auditoria\n\nGerada em ${base.geradaEm.split('-').reverse().join('/')}. ` +
    `${base.lojistas.length} lojistas inventados; os ${base.cenarios.length} cenários abaixo são fixos (sempre iguais), os demais lojistas são aleatórios para dar volume.\n\n` +
    '| # | Loja | CNPJ | Processo | O que deve aparecer | Onde |\n|---|---|---|---|---|---|\n' +
    base.cenarios.map((c, i) => `| ${i + 1} | ${c.loja} | ${fmt(c.cnpj)} | ${c.processo} | ${c.situacao} | ${c.onde} |`).join('\n') + '\n'
}

/** A carteira da base fictícia em CSV, no formato que a aba Lojistas importa. */
export function lojistasFicticiosCsv (base) {
  const cel = (v) => /[;"]/.test(String(v ?? '')) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v ?? '')
  const fmtCnpj = (c) => c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  const linhas = [['LUC', 'Loja', 'Razão Social', 'CNPJ', 'UF', 'Início do contrato', 'E-mail', 'WhatsApp', 'Regime', 'Segmento'],
    ...base.lojistas.map(l => [l.luc, l.nome, l.razao, fmtCnpj(l.cnpj), l.uf, (l.inicioContrato || '').split('-').reverse().join('/'), l.email, l.telefone,
      l.regime === 'simples' ? 'Simples Nacional' : 'Lucro presumido', l.segmento])]
  return '﻿' + linhas.map(l => l.map(cel).join(';')).join('\r\n') + '\r\n'
}
