/**
 * Dados da base fictícia de hoje (ou DATA=aaaa-mm-dd), com o status que o app
 * calcula, em JSON na saída padrão. Quem consome: scripts/gerar-base-excel.py.
 */
import { gerarBaseFicticia } from '../src/basefic.js'
import { cicloAtual, situacao, ETAPAS } from '../src/acompanhamento.js'
import { situacaoSocietaria, TIPOS_MUDANCA, MOTIVOS_PESQUISA } from '../src/societario.js'
const hoje = process.env.DATA ? new Date(process.env.DATA + 'T12:00:00') : new Date()
const base = gerarBaseFicticia(hoje)
const ciclo = cicloAtual(hoje)
const regs = base.ciclos[ciclo.chave] || {}
const nomeTipo = Object.fromEntries(TIPOS_MUDANCA)
const nomeMotivo = Object.fromEntries(MOTIVOS_PESQUISA)
const fiscal = base.lojistas.map(l => {
  const s = situacao(l, regs[l.cnpj], ciclo); const r = regs[l.cnpj] || {}
  return { l, status: l.ativo === false ? 'INATIVO' : s.status, devida: s.devida ? s.devida.rotulo : '', atrasadas: s.atrasadas, r }
})
const soc = base.lojistas.map(l => {
  const s = situacaoSocietaria(l, base.societario[l.cnpj], hoje); const r = base.societario[l.cnpj] || {}
  return { l, status: l.ativo === false ? 'INATIVO' : s.status, checklist: `${s.checklist.feitos}/${s.checklist.total}`,
    devida: s.devida ? s.devida.rotulo : '', tipo: r.tipo ? nomeTipo[r.tipo] || r.tipo : '', motivo: r.motivo ? nomeMotivo[r.motivo] || r.motivo : '', r }
})
process.stdout.write(JSON.stringify({ geradaEm: base.geradaEm, ciclo: { ano: ciclo.ano, inicio: ciclo.inicio, livros: ciclo.ano - 1 }, etapas: ETAPAS.map(e => [e.chave, e.rotulo]),
  lojistas: base.lojistas, fiscal, fechamentos: base.fechamentos, soc, cenarios: base.cenarios, prefs: base.prefs }))
