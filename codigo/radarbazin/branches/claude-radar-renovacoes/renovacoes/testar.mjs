// Testa o motor contra os exemplos numéricos do Book de Renovações (skill renovacao-contratos-shopping)
import { analisarLoja, importarDispersao, planejamento, agendaAuditoria, analiseObsidian } from './motor.mjs'

const hoje = '2026-10-14'
const params = { shopping: 'Teste', mediaAmmM2Satelites: 91, mediaVendasM2Satelites: 1000, inflacaoAcumuladaPct: 4.5, metaLsrAnualPct: 20, anoPlanejamento: 2027 }
// Loja do exemplo do book: AMM 10.000 · A% 1.000 · vendas 130.000 · CO/Vendas 9,2% vs rede 11,3%
// AMM/m² = 100 (área 100 m²) · entorno 120 · piso 96 · tamanho 108 · concorrentes 113 · segmento 107 · satélites 91
const base = {
  luc: 'L-101', nome: 'Loja Exemplo', segmento: 'Vestuário feminino', area: 100, formato: 'satelite', mix: 'Relevante', mixValidado: true,
  contrato: { inicio: '2022-07-01', fim: '2027-06-30', ultimoReajuste: '2026-07-01' },
  faturamento: { amm: 10000, aPctMedioSemDezembro: 1000 },
  desempenho: { vendas12mExpurgada: 130000, custoOcupacao: 11960 }, // 9,2% de 130.000
  auditoria: { ultimaIntegral: '2026-06-15', dispersaoPct: 4 },
  comparativos: { coVendasRedePct: 11.3, ammM2Entorno: 120, ammM2Piso: 96, ammM2Tamanho: 108, ammM2Concorrentes: 113, ammM2SegmentoAbrasce: 107, tabelaAbcM2: 130 },
}
let falhas = 0
const ok = (nome, got, exp, tol = 0.0006) => { const p = Math.abs(got - exp) <= tol; if (!p) falhas++; console.log(`${p ? 'OK ' : 'ERRO'} ${nome}: ${got} (esperado ${exp})`) }

const a = analisarLoja(base, params, hoje)
ok('Arg1 A%', a.args[0].incremento, 0.10)
ok('Arg2 CO/Vendas', a.args[1].incremento, 0.273)
ok('Arg3 entorno', a.args[2].incremento, 0.20)
ok('Arg4 concorrentes', a.args[3].incremento, 0.13)
ok('Relevante: média dos 2 maiores', a.lsr.lsrBase, 0.2365, 0.001)
ok('LSR total = base + inflação', a.lsr.lsrTotal, 0.2365 + 0.045, 0.001)
ok('AMM/m²', a.cls.ammM2, 100)
ok('Vendas/m²', a.cls.vendasM2, 1300)
ok('Quadrante 2 (vende bem 1300>1000, já paga bem 100>91)', a.cls.quadrante, 2)
const q1 = analisarLoja(base, { ...params, mediaAmmM2Satelites: 110 }, hoje)
ok('Quadrante 1 quando a média das satélites é 110', q1.cls.quadrante, 1)
ok('Meses restantes', a.jan.meses, 8.5, 0.2)
console.log('Janela:', a.jan.fase, '|', a.jan.acao)
console.log('Auditoria:', a.trava.status, '|', a.trava.motivo)
console.log('Farol:', a.farol.rotulo, '| perito:', a.prop.perito, '| risco:', a.risco.nivel, a.risco.score)

const ind = analisarLoja({ ...base, mix: 'Indiferente' }, params, hoje)
ok('Indiferente: maior argumento', ind.lsr.lsrBase, 0.273)

// Arg2 com rede negativa cai para o segmento no shopping
const seg = analisarLoja({ ...base, comparativos: { ...base.comparativos, coVendasRedePct: 8, coVendasSegmentoShoppingPct: 10.2 } }, params, hoje)
ok('Arg2 fallback segmento (10,2% − 9,2% = 1% × 130k = 1.300 → 13%)', seg.args[1].incremento, 0.13)
console.log('  fonte:', seg.args[1].tipo)

// Trava de auditoria fora da janela bloqueia
const semAud = analisarLoja({ ...base, auditoria: { ultimaIntegral: '2025-09-01' } }, params, hoje)
ok('Auditoria fora da janela → bloqueio', semAud.trava.status === 'bloqueio' ? 1 : 0, 1)
ok('Farol vermelho com bloqueio', semAud.farol.cor === 'vermelho' ? 1 : 0, 1)
const disp = analisarLoja({ ...base, auditoria: { ultimaIntegral: '2026-06-15', dispersaoPct: 18 } }, params, hoje)
ok('Dispersão 18% > 15% → bloqueio (reauditar)', disp.trava.status === 'bloqueio' ? 1 : 0, 1)
const dez = analisarLoja({ ...base, auditoria: { ultimaIntegral: '2025-12-10' } }, params, hoje)
ok('Auditoria em dezembro não conta', dez.trava.status === 'bloqueio' ? 1 : 0, 1)

// Inadimplente bloqueia
const inad = analisarLoja({ ...base, desempenho: { ...base.desempenho, mesesInadimplente: 2, saldoAberto: 25000 } }, params, hoje)
ok('Inadimplente → bloqueio', inad.bloq.some(b => b.includes('inadimplente')) ? 1 : 0, 1)

// Antes do reajuste: contrato acabando em 2028, reajuste em 2027-07 → aguardar
const cedo = analisarLoja({ ...base, contrato: { inicio: '2023-07-01', fim: '2028-06-30', ultimoReajuste: '2026-07-01' } }, params, hoje)
ok('Antes do último reajuste → fase antes-do-reajuste', cedo.jan.fase === 'antes-do-reajuste' ? 1 : 0, 1)

// Faltantes: sem comparativos
const falt = analisarLoja({ ...base, comparativos: {} }, { ...params, inflacaoAcumuladaPct: null }, hoje)
console.log('Faltantes sem comparativos:', falt.faltantes.length, '→', falt.faltantes.slice(0, 3).join(' | '), '… confiança', falt.confianca)
ok('Sem inflação → LSR total nulo', falt.lsr.lsrTotal === null ? 1 : 0, 1)

// Alçadas
ok('Coordenador abre em 115%', a.prop.alcadas[0].de, a.prop.ammProposto * 1.15, 0.01)
ok('Superintendente até 100%', a.prop.alcadas[2].ate, a.prop.ammProposto, 0.01)

// Importação do Radar de Dispersão
const lojas = [{ ...base, cnpj: '12.345.678/0001-90' }]
const r = importarDispersao('CNPJ;Competência;Redução Z;PDV;Declarado;Dispersão %;Status\n12345678000190;2026-08;100;98;90;10,5;DISPERSO\n12345678000190;2026-09;100;99;95;5,2;OK\n99999999000199;2026-09;1;1;1;0;OK', lojas)
ok('Importação atualiza 1 loja', r.atualizadas, 1)
ok('Mantém a competência mais recente', lojas[0].auditoria.dispersaoPct, 5.2)
ok('CNPJ sem loja listado', r.semLoja.length, 1)

// Planejamento
const pl = planejamento([base, { ...base, luc: 'L-102', status: 'renovado', realizado: { ammNovo: 12000 } }], params, hoje)
ok('Planejamento: 2 lojas em 2027', pl.n, 2)
ok('LSR realizado 20%', pl.lsrRealizado, 0.20)
console.log('LSR planejado', pl.lsrPlanejado, 'gap vs meta', pl.gap)
const ag = agendaAuditoria([base, semAud.loja], params, hoje)
console.log('Agenda:', ag.map(x => `${x.luc} ${x.prioridade} integral ${x.integralDe}→${x.integralAte}`).join(' | '))

const md = analiseObsidian({ ...a, shopping: 'Teste' })
ok('Obsidian tem frontmatter e confiança', md.startsWith('---') && md.includes('Confiança:') ? 1 : 0, 1)
console.log(falhas ? `${falhas} FALHA(S)` : "TESTES DO MOTOR PASSARAM")

// ---- importação de planilha (cadastro e parâmetros)
import { importarLojasPlanilha, importarParamsPlanilha } from './motor.mjs'
const linhas = [
  { 'LUC': 'L-118', 'Nome fantasia': 'Flor de Lis', 'CNPJ': '11.111.111/0001-11', 'Segmento': 'Moda', 'Piso': 1, 'Área m²': 100, 'Formato': 'satelite', 'Key Account': 'não', 'Mix': 'relevante', 'Mix validado pelo comitê': 'sim', 'Status': 'a-negociar', 'Início vigência': '2022-07-01', 'Fim vigência': 46568, 'Último reajuste': '01/07/2026', 'Índice': 'IGP-M', 'Contrato comercial': 'sim', 'Cláusulas especiais': 'limitante, subsídio x', 'AMM último mês': 10000, 'A% médio sem dezembro': 1000, 'Vendas média 12m expurgada': 130000, 'Custo de ocupação': 11960, 'Meses inadimplente': 0, 'Saldo em aberto': 0, 'Última auditoria integral': '2026-06-15', 'Dispersão %': '4,1', 'Livros fiscais': 'Auditado', 'Ação contra o shopping': 'não', 'Renovatória ajuizada': 'não', 'Lojista resistente': '', 'CO/Vendas rede %': 11.3, 'CO/Vendas segmento shopping %': '', 'AMM/m² entorno': 120, 'AMM/m² piso': 96, 'AMM/m² tamanho': 108, 'AMM/m² concorrentes': 113, 'AMM/m² segmento Abrasce': 107, 'Tabela ABC R$/m²': 135, 'AMM novo (realizado)': '', 'Coluna estranha': 'x' },
  { 'LUC': '', 'Nome fantasia': 'linha vazia' },
  { 'LUC': 'L-999', 'Nome fantasia': 'Nova', 'Fim vigência': '2027-12-31', 'AMM último mês': 5000, 'Área m²': 50, 'Mix': 'Ofensora' },
]
const ri = importarLojasPlanilha(linhas, [{ id: 'old', luc: 'L-118', nome: 'Antiga', contrato: { fim: '2020-01-01' } }])
ok('Planilha: 1 atualizada', ri.atualizadas, 1); ok('Planilha: 1 nova', ri.novas, 1); ok('Planilha: 1 ignorada', ri.ignoradas, 1)
ok('Mantém id da loja existente', ri.lojas[0].id === 'old' ? 1 : 0, 1)
ok('Data serial do Excel → 2027-06-30', ri.lojas[0].contrato.fim === '2027-06-30' ? 1 : 0, 1)
ok('Data dd/mm/aaaa', ri.lojas[0].contrato.ultimoReajuste === '2026-07-01' ? 1 : 0, 1)
ok('Mix normalizado', ri.lojas[0].mix === 'Relevante' ? 1 : 0, 1)
ok('Dispersão com vírgula', ri.lojas[0].auditoria.dispersaoPct, 4.1)
ok('Piso AMM/m² não confunde com Piso', ri.lojas[0].comparativos.ammM2Piso, 96)
ok('Piso da loja', ri.lojas[0].piso === '1' ? 1 : 0, 1)
ok('Cláusulas em lista', ri.lojas[0].contrato.clausulasEspeciais.length, 2)
ok('Coluna não reconhecida listada', ri.naoReconhecidas.length, 1)
const ai = analisarLoja(ri.lojas[0], params, hoje)
ok('Loja importada reproduz o LSR do Book', ai.lsr.lsrBase, 0.2365, 0.001)
const rp = importarParamsPlanilha([{ a: 'Parâmetro', b: 'Valor' }, { a: 'Shopping', b: 'Meu Shopping' }, { a: 'Média AMM/m² satélites', b: 95 }, { a: 'Média Vendas/m² satélites', b: 1100 }, { a: 'Inflação acumulada %', b: '4,5' }, { a: 'Meta LSR anual %', b: 18 }, { a: 'Ano planejamento', b: 2027 }, { a: 'Meses sazonais', b: '12, 1' }, { a: 'LSR agressivo %', b: 25 }, { a: 'LSR muito agressivo %', b: 40 }, { a: 'Tolerância acima da ABC %', b: 10 }, { a: 'Inventado', b: 1 }])
ok('Parâmetros aplicados', rp.aplicados, 10); ok('Parâmetro não reconhecido (cabeçalho ignorado)', rp.naoReconhecidos.length, 1)
ok('Meses sazonais lidos', rp.params.mesesSazonais.length, 2); ok('Muito agressivo não cai no agressivo', rp.params.lsrMuitoAgressivoPct, 40); ok('Agressivo', rp.params.lsrAgressivoPct, 25)
ok('Shopping', rp.params.shopping === 'Meu Shopping' ? 1 : 0, 1)
console.log(falhas ? `\n${falhas} FALHA(S) (planilha)` : 'TODOS OS TESTES DE PLANILHA PASSARAM')

// ---- histórico desde a última renovação
import { historico, argumentoHistorico, parseHistoricoTexto, importarHistoricoPlanilha, historicoTexto } from './motor.mjs'
function gerarHist(inicio, meses, v0, cresc, amm0, coExtra, aPctFator) {
  const out = []; const [y0, m0] = inicio.split('-').map(Number)
  for (let i = 0; i < meses; i++) { const d = new Date(Date.UTC(y0, m0 - 1 + i, 1)); const comp = d.toISOString().slice(0, 7); const mes = d.getUTCMonth() + 1
    const vendas = Math.round(v0 * Math.pow(1 + cresc, i / 12) * (mes === 12 ? 1.6 : 1)); const amm = Math.round(amm0 * Math.pow(1.05, Math.floor(i / 12)))
    const aPct = Math.max(0, Math.round(vendas * aPctFator - amm)); out.push({ competencia: comp, vendas, amm, aPct, custoOcupacao: amm + aPct + coExtra }) }
  return out
}
// loja com vendas subindo 9% a.a. e AMM 5% a.a.: CO/Vendas cai
const histQueda = gerarHist('2022-07', 51, 100000, 0.09, 8500, 3000, 0.08)
const lh = { ...base, contrato: { ...base.contrato, inicio: '2022-07-01' }, historico: histQueda }
const ah = analisarLoja(lh, params, hoje)
ok('Histórico disponível com 51 meses', ah.hist.meses, 51)
ok('5 anos de contrato → anos agrupados', ah.hist.anos.length, 5)
ok('CO/Vendas caiu (delta negativo)', ah.hist.deltaCoVendas < 0 ? 1 : 0, 1)
ok('Arg5 usável quando CO/Vendas caiu', ah.args[4].usavel ? 1 : 0, 1)
const esperado5 = (-ah.hist.deltaCoVendas) * ah.hist.ultimos12.vendasMes / 10000
ok('Arg5 = dif × vendas/mês ÷ AMM', ah.args[4].incremento, esperado5, 1e-9)
console.log('  Arg5:', ah.args[4].detalhe)
ok('Arg1 condicionado: base paga A% (1000) → usável', ah.args[0].usavel ? 1 : 0, 1)
const semA = analisarLoja({ ...base, faturamento: { amm: 10000, aPctMedioSemDezembro: 0 } }, params, hoje)
ok('Arg1 com A% = 0 → não usável, incremento 0', semA.args[0].incremento, 0)
ok('Arg1 com A% = 0 não entra na média dos 2 maiores', semA.lsr.lsrBase, 0.2365, 0.001)
// derivação quando o cadastro está em branco
const lv = { ...base, contrato: { ...base.contrato, inicio: '2022-07-01' }, historico: histQueda, faturamento: {}, desempenho: {} }
const av = analisarLoja(lv, params, hoje)
ok('AMM derivado do último mês do histórico', av.prop.ammAtual, histQueda.filter(r => r.competencia <= '2026-10').slice(-1)[0].amm)
ok('Aviso de derivação presente', av.avisos.some(x => x.includes('Derivado do histórico')) ? 1 : 0, 1)
ok('Loja original não é mutada', lv.faturamento.amm === undefined ? 1 : 0, 1)
// histórico subindo → sem argumento
const histSobe = gerarHist('2022-07', 51, 130000, -0.04, 8500, 3000, 0.08)
const as2 = analisarLoja({ ...lh, historico: histSobe }, params, hoje)
ok('CO/Vendas subiu → Arg5 = 0, não usável', as2.args[4].incremento, 0)
// sem histórico → faltante listado, não bloqueia
const sh = analisarLoja(base, params, hoje)
ok('Sem histórico: Arg5 nulo com faltante', sh.args[4].incremento === null && sh.args[4].faltantes.length === 1 ? 1 : 0, 1)
// texto e planilha
const txt = '2025-01;120000;9000;600;12600\n2025-02;118000;9000;440;12440\nlixo\n03/2025;121000;9000;680;12680'
const ph = parseHistoricoTexto(txt)
ok('parseHistoricoTexto lê 3 linhas e converte MM/AAAA', ph.length === 3 && ph[2].competencia === '2025-03' ? 1 : 0, 1)
ok('historicoTexto reversível', historicoTexto(ph).split('\n').length, 3)
const lojasH = [{ luc: 'L-118', nome: 'x' }, { luc: 'L-2' }]
const rh = importarHistoricoPlanilha([{ 'LUC': 'L-118', 'Competência': '2025-01', 'Vendas': 120000, 'AMM': 9000, 'A%': 600, 'Custo de ocupação': 12600 }, { 'LUC': 'L-118', 'Competência': 45689, 'Vendas': 1, 'AMM': 1, 'A%': 0, 'Custo de ocupação': 1 }, { 'LUC': 'L-9', 'Competência': '2025-01', 'Vendas': 1 }], lojasH)
ok('Planilha Historico: 2 meses na L-118', lojasH[0].historico.length, 2)
ok('Competência serial do Excel → 2025-02', lojasH[0].historico[1].competencia === '2025-02' ? 1 : 0, 1)
ok('LUC sem loja listado', rh.semLoja.length, 1)
console.log(falhas ? `${falhas} FALHA(S) (histórico)` : 'TODOS OS TESTES DE HISTÓRICO PASSARAM')

// ---- revisão: merge por coluna e regex de colunas
{
  const atual = [{ id: 'k1', luc: 'L-500', nome: 'Antiga', segmento: 'Moda', mix: 'Relevante', mixValidado: true, contrato: { fim: '2027-01-31', inicio: '2022-02-01' }, faturamento: { amm: 7000, aPctMedioSemDezembro: 300 }, comparativos: { tabelaAbcM2: 120, ammM2Entorno: 100 }, historico: [{ competencia: '2025-01', vendas: 1, amm: 1, aPct: 0, custoOcupacao: 1 }] }]
  const r = importarLojasPlanilha([{ 'LUC': 'L-500', 'AMM último mês': 7500, 'CO/Vendas rede %': 12, 'CO/Vendas segmento shopping %': 13 }], atual)
  const l = r.lojas[0]
  ok('Merge: AMM atualizado', l.faturamento.amm, 7500)
  ok('Merge: nome preservado', l.nome === 'Antiga' ? 1 : 0, 1)
  ok('Merge: mix validado preservado', l.mixValidado ? 1 : 0, 1)
  ok('Merge: Tabela ABC preservada', l.comparativos.tabelaAbcM2, 120)
  ok('Merge: histórico preservado', l.historico.length, 1)
  ok('Merge: fim preservado', l.contrato.fim === '2027-01-31' ? 1 : 0, 1)
  ok('CO/Vendas rede não vira Vendas', l.comparativos.coVendasRedePct, 12)
  ok('Vendas 12m continua vazia', l.desempenho.vendas12mExpurgada === null || l.desempenho.vendas12mExpurgada === undefined ? 1 : 0, 1)
  ok('CO/Vendas segmento não vira Segmento', l.segmento === 'Moda' ? 1 : 0, 1)
  ok('CO/Vendas segmento lido', l.comparativos.coVendasSegmentoShoppingPct, 13)
  const ren = analisarLoja({ ...base, status: 'renovado', contrato: { ...base.contrato, fim: '2026-01-31' }, realizado: { ammNovo: 12000 } }, params, hoje)
  ok('Renovada com vigência antiga não pede regularizar', ren.acoes.some(x => x.includes('vencido')) ? 0 : 1, 1)
  console.log(falhas ? `${falhas} FALHA(S) (revisão)` : 'TODOS OS TESTES DE REVISÃO PASSARAM')
}

// ---- perícia: comparáveis, laudo prévio e linearidade
import { comparaveis, laudoPrevio, linearidade, estatisticas, faixaArea, CHECKLIST_PERICIA, PARAMS_PADRAO, pct } from './motor.mjs'
{
  const mk = (luc, area, ammM2, extra = {}) => ({ id: luc, luc, nome: luc, area, piso: '1', formato: 'satelite', status: 'a-negociar', contrato: { inicio: '2025-01-01', fim: '2030-01-01', subsidios: [], comercial: true, ...(extra.contrato || {}) }, faturamento: { amm: ammM2 * area }, ...extra })
  const alvo = mk('X', 100, 100)
  const uni = [alvo, mk('A', 90, 110), mk('B', 110, 120), mk('C', 120, 130), mk('D', 80, 115), mk('E', 300, 60), mk('F', 100, 125, { contrato: { inicio: '2019-01-01' } }), mk('G', 100, 118, { contrato: { subsidios: ['desconto'] } }), mk('H', 8, 400, { formato: 'quiosque' }), mk('I', 100, 400), mk('J', 100, 112, { status: 'nao-renovado' })]
  const c = comparaveis(alvo, uni, PARAMS_PADRAO, '2026-10-25')
  const inc = c.finais.map(x => x.luc).sort().join('')
  ok('Comparáveis incluídos: A B C D (área ±50%, contemporâneos, sem subsídio, satélites)', inc === 'ABCD' ? 1 : 0, 1)
  ok('E excluída por área', c.amostra.find(x => x.luc === 'E').motivos.some(m => /área/.test(m)) ? 1 : 0, 1)
  ok('F excluída por contrato antigo', c.amostra.find(x => x.luc === 'F').motivos.some(m => /meses/.test(m)) ? 1 : 0, 1)
  ok('G excluída por subsídio', c.amostra.find(x => x.luc === 'G').motivos.some(m => /subsídio/.test(m)) ? 1 : 0, 1)
  ok('H excluída por tipologia', c.amostra.find(x => x.luc === 'H').motivos.some(m => /tipologia/.test(m)) ? 1 : 0, 1)
  ok('I excluída como outlier', c.amostra.find(x => x.luc === 'I').motivos.some(m => /outlier/.test(m)) ? 1 : 0, 1)
  ok('J excluída (saiu)', c.amostra.find(x => x.luc === 'J').incluido ? 0 : 1, 1)
  ok('Mediana dos comparáveis', c.stats.mediana, 117.5)
  const lp = laudoPrevio(alvo, c, 10000, 11500)
  ok('Laudo: valor provável = mediana × área', lp.provavel, 11750)
  ok('Laudo: proposto 115/m² ≤ Q3 → forte', lp.veredito === 'forte' ? 1 : 0, 1)
  ok('Laudo: proposto acima do máximo → frágil', laudoPrevio(alvo, c, 10000, 14000).veredito === 'fragil' ? 1 : 0, 1)
  ok('Laudo: entre Q3 e máx → atenção', laudoPrevio(alvo, c, 10000, 12700).veredito === 'atencao' ? 1 : 0, 1)
  ok('Laudo insuficiente com 2 comparáveis', laudoPrevio(alvo, comparaveis(alvo, uni.slice(0, 3), PARAMS_PADRAO, '2026-10-25'), 10000, 11000).veredito === 'insuficiente' ? 1 : 0, 1)
  // evento estrutural: contratos anteriores saem
  const ce = comparaveis(alvo, uni, { ...PARAMS_PADRAO, eventosEstruturais: [{ data: '2025-06-01', descricao: 'expansão' }] }, '2026-10-25')
  ok('Evento estrutural exclui contratos anteriores', ce.n, 0)
  // analisarLoja com todasLojas usa o laudo no perito
  const ana = analisarLoja({ ...alvo, mix: 'Relevante', mixValidado: true, contrato: { ...alvo.contrato, fim: '2027-06-30', ultimoReajuste: '2026-07-01' }, faturamento: { amm: 10000, aPctMedioSemDezembro: 500 }, desempenho: { vendas12mExpurgada: 130000, custoOcupacao: 12000 }, auditoria: { ultimaIntegral: '2026-08-01', dispersaoPct: 3 }, comparativos: { ammM2Entorno: 120 } }, { ...params, inflacaoAcumuladaPct: 4 }, '2026-10-25', uni)
  ok('Perito vem do laudo prévio', ana.prop.peritoFonte === 'laudo-previo' ? 1 : 0, 1)
  console.log('  LSR', pct(ana.lsr.lsrTotal), 'AMM/m² proposto', ana.prop.ammPropostoM2?.toFixed(1), '→', ana.prop.perito)
  // linearidade: Shopping A (20 × 100) vs Shopping B (10 × 50 + 10 × 150)
  const A = Array.from({ length: 20 }, (_, i) => mk('A' + i, 60, 100))
  const B = [...Array.from({ length: 10 }, (_, i) => mk('B' + i, 60, 50)), ...Array.from({ length: 10 }, (_, i) => mk('C' + i, 60, 150))]
  const la = linearidade(A, PARAMS_PADRAO, '2026-10-25'), lb = linearidade(B, PARAMS_PADRAO, '2026-10-25')
  ok('Shopping A: média 100, linear', la.geral.media === 100 && la.geral.classif === 'linear' ? 1 : 0, 1)
  ok('Shopping B: média 100 mas dispersa', lb.geral.media === 100 && lb.geral.classif === 'dispersa' ? 1 : 0, 1)
  ok('Shopping B: nenhuma loja dentro de ±30% da média', lb.dentro30, 0)
  const cb = comparaveis(mk('Z', 60, 100), B, PARAMS_PADRAO, '2026-10-25')
  ok('Shopping B: amostra bimodal detectada', cb.grupos ? 1 : 0, 1)
  ok('Faixa de área', faixaArea(75) === '50–100 m²' && faixaArea(30) === 'até 50 m²' && faixaArea(500) === 'acima de 200 m²' ? 1 : 0, 1)
  ok('Checklist com 15 itens', CHECKLIST_PERICIA.length, 15)
  console.log(falhas ? `${falhas} FALHA(S) (perícia)` : 'TODOS OS TESTES DE PERÍCIA PASSARAM')
}

// ---- visão de laudo: risco de perda em renovatória
import { riscoPerda } from './motor.mjs'
{
  const loja = { area: 100, juridico: {} }
  const laudo = { disponivel: true, provavel: 11000, q1M2: 100, q3M2: 118, maxM2: 130, medianaM2: 110, bimodal: false }
  const jan = { meses: 9 }
  const rp = (prop, extra = {}) => riscoPerda({ ...loja, ...extra }, { ...laudo, ...(extra.laudo || {}) }, { ammAtual: 10000, ammProposto: prop }, jan, { lsrTotal: prop / 10000 - 1 }, PARAMS_PADRAO)
  ok('Baixo: proposto 11.500 (115/m² ≤ Q3, gap 4,5%)', rp(11500).nivel === 'baixo' ? 1 : 0, 1)
  ok('Moderado: proposto 12.000 (gap 9% mas acima de Q3)', rp(12000).nivel === 'moderado' ? 1 : 0, 1)
  ok('Moderado: gap 15% sem passar o máximo', rp(12650).nivel === 'moderado' ? 1 : 0, 1)
  ok('Alto: acima do maior comparável (14.000 > 130/m²)', rp(14000).nivel === 'alto' ? 1 : 0, 1)
  ok('Alto: laudo abaixo do AMM atual', rp(10500, { laudo: { provavel: 9500 } }).nivel === 'alto' ? 1 : 0, 1)
  ok('Receita em risco = (proposto − provável) × 60', rp(14000).receitaEmRisco, 3000 * 60)
  ok('Defensável = Q3 × área', rp(14000).defensavel, 11800)
  ok('Ajuste = proposto − defensável', rp(14000).ajuste, 2200)
  ok('Bimodal sobe baixo para moderado', rp(11500, { laudo: { bimodal: true } }).nivel === 'moderado' ? 1 : 0, 1)
  ok('Renovatória ajuizada sobe baixo para moderado', rp(11500, { juridico: { renovatoriaAjuizada: true } }).nivel === 'moderado' ? 1 : 0, 1)
  const semLaudo = riscoPerda(loja, { disponivel: false, motivo: 'x' }, { ammAtual: 10000, ammProposto: 15000 }, jan, { lsrTotal: 0.5 }, PARAMS_PADRAO)
  ok('Sem laudo e LSR 50% → alto', semLaudo.nivel === 'alto' ? 1 : 0, 1)
  ok('Sem laudo e LSR 15% → moderado', riscoPerda(loja, { disponivel: false }, { ammAtual: 10000, ammProposto: 11500 }, jan, { lsrTotal: 0.15 }, PARAMS_PADRAO).nivel === 'moderado' ? 1 : 0, 1)
  ok('Sem proposta → indefinido', riscoPerda(loja, laudo, { ammAtual: 10000, ammProposto: null }, jan, {}, PARAMS_PADRAO).nivel === 'indefinido' ? 1 : 0, 1)
  console.log(falhas ? `${falhas} FALHA(S) (perda)` : 'TODOS OS TESTES DE RISCO DE PERDA PASSARAM')
}
process.exit(falhas ? 1 : 0)
