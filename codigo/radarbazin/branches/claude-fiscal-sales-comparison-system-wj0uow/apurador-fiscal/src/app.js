/**
 * Interface do Radar de Auditoria (2.0).
 *
 * Duas cadências: a auditoria fiscal é anual (o ciclo abre em 1º de abril e
 * cobre os livros do ano anterior); a triangulação entra dia a dia ou semana a
 * semana e é fechada por mês. O acompanhamento — carteira de lojistas, marcos
 * de cada ciclo, notificações e fechamentos mensais — fica no localStorage
 * deste navegador. Os arquivos fiscais continuam só em memória.
 */
import { classificarCfop, listarCfops, NATUREZA, NATUREZA_LABEL } from './cfop.js'
import { formatarCnpj, normalizarCnpj, normalizarCompetencia, competenciaLabel, acharCabecalho, percentBR } from './parsers.js'
import { apurar, apurarDeclaracoes, mesclarApuracao, conciliar, paraCsv, detalhePorCfopCsv,
  fmt, STATUS, MEDIDA, BASE_DECLARACAO } from './apurar.js'
import { lerArquivo, extrairLancamentos, extrairVendasInformadas, extrairMovimentos, FORMATOS_ACEITOS, FORMATOS_TRIANGULACAO, FORMATOS_NAPP } from './ingest.js'
import { triangular, cruzarComAuditoria, triangulacaoCsv, cruzamentoCsv, dataLabel,
  STATUS_TRI, VEREDITO, FONTES, limitesTri, resumirFontes, SINONIMOS_MOV } from './triangulacao.js'
import { cicloAtual, ETAPAS, MARCOS, STATUS_LIVRO, acompanhamentoVazio, normalizarLojista, importarLojistas,
  mesclarLojistas, registroDe, situacao, resumoPainel, textoNotificacao, fecharMes, historicoParaCruzamento,
  acompanhamentoCsv, fechamentosCsv, carteiraCsv, cnpjValido, hojeIso, dataBR, VERSAO_ACOMPANHAMENTO } from './acompanhamento.js'
import { dashFiscal, dashTriangulacao, dashSocietario } from './dashboard.js'
import { gerarBaseFicticia, lojistasFicticiosCsv, roteiroMarkdown } from './basefic.js'
import { UFS, STATUS_SOC, TIPOS_MUDANCA, CAUSAS_TT, PONTOS_ATENCAO, MOTIVOS_PESQUISA, PASSOS_JUNTA, normalizarTipo, registroSocietario, resumoSocietario, textoTaxa, rotuloEtapaTaxa, linksPesquisa, societarioCsv } from './societario.js'

const $ = (sel, raiz = document) => raiz.querySelector(sel)
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)]
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const CHAVE_PREFS = 'apurador-fiscal:prefs:v1'
const CHAVE_ACOMP = 'radar-dispersao:acompanhamento:v2'

const estado = {
  livros: [],            // { id, nome, lido, opts, resultado }
  vendas: [],            // mesma forma; planilha, CSV ou extrato do PGDAS-D
  z: [],                 // reduções Z
  pdv: [],               // relatórios de PDV
  napp: [],              // NAPP: planilha diária
  prefs: {
    medida: 'valorContabil',
    baseDeclaracao: 'total',
    toleranciaReais: 0.05,
    toleranciaPercent: 0.5,
    atencaoPercent: 2,
    // triangulação: leitura pela maior variação em R$ entre os tipos de lançamento
    triCoerenteReais: 100,
    triAtencaoReais: 1000,
    triDiaReais: 100,
    overrides: {},
    tema: 'auto',
  },
  fontePreferida: {},
  acomp: acompanhamentoVazio(),   // persistido: carteira, ciclos, fechamentos, textos das notificações
  aba: 'dashboard',
  dashComp: null,                 // competência de referência da triangulação no dashboard
  pendAberta: null,               // grupo de pendências aberto no dashboard
  subAba: 'dados',                // dentro da auditoria: dados | resultado | detalhe
  filtroPainel: { status: '', busca: '' },
  textoAberto: null,              // cnpj|etapa cuja notificação está expandida
  ocupado: false,
}

/* ------------------------------------------------------------- preferências */

function carregarPrefs () {
  try {
    const s = localStorage.getItem(CHAVE_PREFS)
    if (s) Object.assign(estado.prefs, JSON.parse(s))
  } catch { /* localStorage pode estar bloqueado — segue com os padrões */ }
  aplicarTema()
}
function salvarPrefs () {
  try { localStorage.setItem(CHAVE_PREFS, JSON.stringify(estado.prefs)) } catch { /* sem persistência */ }
}
function aplicarTema () {
  document.documentElement.dataset.tema = estado.prefs.tema === 'auto' ? '' : estado.prefs.tema
}

function carregarAcomp () {
  try {
    const s = localStorage.getItem(CHAVE_ACOMP)
    if (s) {
      const dados = JSON.parse(s)
      if (dados && dados.versao === VERSAO_ACOMPANHAMENTO) estado.acomp = { ...acompanhamentoVazio(), ...dados }
    }
  } catch { /* sem persistência: começa vazio */ }
}
function salvarAcomp () {
  try { localStorage.setItem(CHAVE_ACOMP, JSON.stringify(estado.acomp)) } catch { avisarSalvamento('Não consegui gravar o acompanhamento neste navegador.') }
}
const ciclo = () => cicloAtual(new Date(), estado.acomp.prefs.mesInicio || 4)
const lojistaDe = (cnpj) => estado.acomp.lojistas.find(l => l.cnpj === cnpj)
/** Nome para mostrar numa linha: o do arquivo e, se ele não trouxer, o da carteira. */
const nomeDe = (l) => l.empresa || (lojistaDe(l.cnpj) || {}).nome || ''

/**
 * Arquivo carregado é livro entregue: quem está na carteira e teve livro lido
 * nesta sessão ganha a data de recebimento; quem teve conciliação, a de
 * auditoria. Só preenche o que está vazio — data marcada à mão não é mexida.
 */
function marcarPelosArquivos (r) {
  if (!estado.acomp.lojistas.length) return
  const c = ciclo()
  let mudou = false
  const comLivro = new Set(r.periodos.map(p => p.cnpj))
  const comConciliacao = new Set(r.linhas.filter(l => l.status !== STATUS.SO_PLANILHA).map(l => l.cnpj))
  for (const l of estado.acomp.lojistas) {
    if (comLivro.has(l.cnpj)) {
      const reg = registroDe(estado.acomp, c.chave, l.cnpj)
      if (!reg.recebido) { reg.recebido = hojeIso(); reg.recebidoAuto = true; mudou = true }
      if (comConciliacao.has(l.cnpj) && !reg.auditado) { reg.auditado = hojeIso(); reg.auditadoAuto = true; mudou = true }
    }
  }
  if (mudou) salvarAcomp()
}

/* ------------------------------------------------------------ carga de arquivo */

let seq = 0

async function carregar (files, destino) {
  if (!files || !files.length) return
  estado.ocupado = true
  for (const file of files) {
    const id = 'f' + (++seq)
    const entrada = { id, nome: file.name, tamanho: file.size, lido: null, resultado: null, erro: null,
      opts: { formatoForcado: 'auto', livroPadrao: '', cnpjPadrao: '', competenciaPadrao: '', aba: '', mapa: null } }
    if (destino === 'planilha') estado.vendas.push(entrada)
    else if (ehTri(destino)) estado[destino].push(entrada)
    else estado.livros.push(entrada)
    renderizar()
    progresso(`${file.name}: lendo…`)
    try {
      entrada.lido = await lerArquivo(file, (msg) => progresso(`${file.name}: ${msg}`))
      if (entrada.lido.abas && entrada.lido.abas.length) entrada.opts.aba = entrada.lido.abas[0].nome
      processar(entrada, destino)
    } catch (e) {
      entrada.erro = e && e.message ? e.message : String(e)
    }
    renderizar()
  }
  progresso('')
  estado.ocupado = false
  renderizar()
}

function processar (entrada, destino) {
  const opts = { ...entrada.opts, arquivo: entrada.nome, fonteId: entrada.id }
  if (opts.formatoForcado === 'auto') delete opts.formatoForcado
  if (!opts.livroPadrao) delete opts.livroPadrao
  opts.cnpjPadrao = normalizarCnpj(opts.cnpjPadrao) || undefined
  opts.competenciaPadrao = normalizarCompetencia(opts.competenciaPadrao) || undefined
  entrada.resultado = destino === 'planilha' ? extrairVendasInformadas(entrada.lido, opts)
    : ehTri(destino) ? extrairMovimentos(entrada.lido, { ...opts, fonte: destino })
    : extrairLancamentos(entrada.lido, opts)
  if (ehTri(destino)) resolverLuc(entrada.resultado)
}

/** Os três tipos de lançamento que entram por arquivo na triangulação. */
const ehTri = (destino) => destino === 'z' || destino === 'pdv' || destino === 'napp'

/**
 * Planilha que traz o número da loja em vez do CNPJ (é o caso do NAPP): a LUC
 * é trocada pelo CNPJ da carteira. LUC que não está na carteira fica avisada.
 */
function resolverLuc (res) {
  if (!res || !res.movimentos) return
  const porLuc = new Map(estado.acomp.lojistas.filter(l => l.luc).map(l => [String(l.luc).trim(), l.cnpj]))
  const semCarteira = new Set()
  for (const m of res.movimentos) {
    if (m.cnpj || !m.luc) continue
    const cnpj = porLuc.get(String(m.luc).trim())
    if (cnpj) m.cnpj = cnpj
    else semCarteira.add(m.luc)
  }
  if (semCarteira.size) {
    res.avisos = [...(res.avisos || []), `Loja(s) ${[...semCarteira].join(', ')} sem CNPJ na carteira — cadastre na aba Lojistas ou escolha o lojista abaixo.`]
  }
}

function reprocessar (entrada, destino) {
  if (!entrada.lido) return
  try { processar(entrada, destino) } catch (e) { entrada.erro = String(e.message || e) }
  renderizar()
}

function progresso (msg) {
  const el = $('#progresso')
  if (el) { el.textContent = msg; el.style.display = msg ? '' : 'none' }
}

/* ------------------------------------------------------------------ cálculo */

function calcular () {
  const lancamentos = estado.livros.flatMap(l => (l.resultado && l.resultado.lancamentos) || [])
  const declaracoes = estado.livros.flatMap(l => (l.resultado && l.resultado.declaracoes) || [])
  const informadas = estado.vendas.flatMap(v => (v.resultado && v.resultado.registros) || [])
  const ap = apurar(lancamentos, {
    medida: estado.prefs.medida,
    overrides: estado.prefs.overrides,
    fontePreferida: estado.fontePreferida,
  })
  const dec = apurarDeclaracoes(declaracoes, { baseDeclaracao: estado.prefs.baseDeclaracao })
  const periodos = mesclarApuracao(ap.periodos, dec.periodos)
  const co = conciliar(periodos, informadas, estado.prefs)

  // movimento sem CNPJ (nem LUC achada na carteira) fica fora: o cartão do arquivo já avisa e pede o lojista
  const movimentos = [...estado.z, ...estado.pdv, ...estado.napp].flatMap(f => (f.resultado && f.resultado.movimentos) || []).filter(m => m.cnpj)
  const tri = triangular(movimentos, informadas, estado.prefs)
  // o cruzamento final usa o histórico fechado mais os meses abertos nesta sessão
  const historico = historicoParaCruzamento(estado.acomp.fechamentos, tri.porMes)
  const cruz = cruzarComAuditoria(co.linhas, historico, estado.prefs)
  const painel = resumoPainel(estado.acomp, ciclo())
  const soc = resumoSocietario(estado.acomp)

  return { ...ap, ...co, periodos, lancamentos, declaracoes, informadas, movimentos, tri, historico, cruz, painel, soc }
}

/* ---------------------------------------------------------------- render */

function renderizar () {
  const app = $('#app')
  if (!app) return
  let r = calcular()
  marcarPelosArquivos(r)
  r = { ...r, painel: resumoPainel(estado.acomp, ciclo()) }
  r.dash = { fiscal: dashFiscal(estado.acomp, ciclo()), tri: dashTriangulacao(estado.acomp, r.historico, { atencaoPercent: estado.prefs.atencaoPercent, competencia: estado.dashComp }), soc: dashSocietario(estado.acomp) }
  const pend = r.painel.pendentes.length + r.soc.pendentes.length
  const pendSoc = r.soc.aValidar.length + r.soc.pendentes.length
  app.innerHTML = `
    <nav class="abas" role="tablist">
      ${[['dashboard', 'Dashboard'], ['painel', 'Painel'], ['lojistas', `Lojistas${estado.acomp.lojistas.length ? ` (${estado.acomp.lojistas.length})` : ''}`],
         ['notificacoes', `Notificações${pend ? ` <b class="pendencia">${pend}</b>` : ''}`],
         ['societario', `Societário${pendSoc ? ` <b class="pendencia">${pendSoc}</b>` : ''}`],
         ['triangulacao', `Triangulação${r.tri.porMes.length ? ` (${r.tri.porMes.length})` : ''}`],
         ['auditoria', `Auditoria fiscal${r.linhas.length ? ` (${r.linhas.length})` : ''}`],
         ['tabela', 'Tabela de códigos'], ['ajuda', 'Como funciona']]
        .map(([k, t]) => `<button role="tab" data-aba="${k}" aria-selected="${estado.aba === k}">${t}</button>`).join('')}
    </nav>
    <div id="progresso" class="progresso" style="display:none"></div>
    ${estado.acomp.ficticia ? `<div class="faixa-ficticia">🧪 <strong>Base fictícia de teste</strong> carregada em ${dataBR(estado.acomp.geradaEm)} — ${estado.acomp.lojistas.length} lojistas inventados.
      Tudo o que você fizer aqui fica só neste navegador. <button class="leve" id="limpar-ficticia">Apagar base fictícia</button></div>` : ''}
    <div id="conteudo">${
      estado.aba === 'dashboard' ? viewDashboard(r)
      : estado.aba === 'painel' ? viewPainel(r)
      : estado.aba === 'lojistas' ? viewLojistas(r)
      : estado.aba === 'notificacoes' ? viewNotificacoes(r)
      : estado.aba === 'societario' ? viewSocietario(r)
      : estado.aba === 'triangulacao' ? viewTriangulacao(r)
      : estado.aba === 'auditoria' ? viewAuditoria(r)
      : estado.aba === 'tabela' ? viewTabela()
      : viewAjuda()
    }</div>`
  ligarEventos(r)
}

/* ---- aba Auditoria fiscal (anual): arquivos, conciliação e detalhe ---- */

function viewAuditoria (r) {
  const c = ciclo()
  return `
  <div class="faixa-ciclo">
    <div><strong>Ciclo ${c.ano}</strong> · auditoria dos livros de <strong>${c.anoLivros}</strong> · aberto em ${dataBR(c.inicio)} · ${c.mesesDecorridos}º mês</div>
    <div class="sub">A auditoria fiscal é anual. Carregue os livros de cada lojista conforme chegam; o Painel marca o recebimento sozinho.</div>
  </div>
  <nav class="subabas">
    ${[['dados', 'Arquivos'], ['resultado', `Conciliação${r.linhas.length ? ` (${r.linhas.length})` : ''}`], ['detalhe', 'Detalhe por CFOP']]
      .map(([k, t]) => `<button data-subaba="${k}" aria-selected="${estado.subAba === k}">${t}</button>`).join('')}
  </nav>
  ${estado.subAba === 'resultado' ? viewResultado(r) : estado.subAba === 'detalhe' ? viewDetalhe(r) : viewDados(r)}`
}

/* ---- aba Arquivos ---- */

function viewDados (r) {
  return `
  <section class="painel">
    <div class="cab"><span class="passo">1</span><div>
      <h2>Apuração fiscal</h2>
      <p class="sub">Registro de Entradas e de Saídas (PDF, SPED EFD .txt, Excel, CSV ou foto) — carregue os dois,
        porque as devoluções de venda estão no de entradas. Para empresa do <strong>Simples Nacional</strong>,
        carregue aqui o PDF do <strong>Extrato do Simples (PGDAS-D)</strong>: é ele que serve de referência.</p>
    </div></div>
    <div class="drop" id="drop-livros" tabindex="0" role="button">
      Arraste os arquivos aqui ou <strong>clique para escolher</strong>
      <div class="sub" style="margin-top:6px">Livro fiscal ou extrato do Simples · PDF · TXT/SPED · XLSX · CSV · PNG/JPG</div>
    </div>
    <input type="file" id="in-livros" multiple accept="${FORMATOS_ACEITOS}" hidden>
    ${estado.livros.map(e => cartaoArquivo(e, 'livro')).join('')}
    ${r.conflitos.length ? blocoConflitos(r.conflitos) : ''}
  </section>

  <section class="painel">
    <div class="cab"><span class="passo">2</span><div>
      <h2>Vendas informadas</h2>
      <p class="sub">Excel ou CSV com CNPJ, competência e valor da venda — o que a loja informou.
        As colunas são reconhecidas pelo cabeçalho. Pode carregar vários arquivos.</p>
    </div></div>
    <div class="drop" id="drop-planilha" tabindex="0" role="button">
      Arraste os arquivos aqui ou <strong>clique para escolher</strong>
      <div class="sub" style="margin-top:6px">XLSX · CSV</div>
    </div>
    <input type="file" id="in-planilha" multiple accept=".xlsx,.xls,.xlsm,.csv" hidden>
    ${estado.vendas.map(v => cartaoArquivo(v, 'planilha')).join('')}
    <p class="nota">Para planilha, o modelo mínimo de colunas é <code>CNPJ</code> · <code>Competencia</code> · <code>Vendas</code>.
      O extrato do Simples é lido direto do PDF, sem preparo.
      <button class="leve" id="baixar-modelo" style="margin-left:6px">Baixar modelo CSV</button></p>
  </section>

  <section class="painel">
    <div class="cab"><span class="passo">3</span><div>
      <h2>Parâmetros da apuração</h2>
      <p class="sub">Definem o que conta como venda e a partir de quanto uma diferença vira divergência.</p>
    </div></div>
    <div class="grade2">
      <label class="campo">Valor usado como venda
        <select id="p-medida">${Object.entries(MEDIDA).map(([k, v]) =>
          `<option value="${k}" ${estado.prefs.medida === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      </label>
      <label class="campo">Tolerância absoluta (R$)
        <input type="number" id="p-tolR" step="0.01" min="0" value="${estado.prefs.toleranciaReais}">
      </label>
      <label class="campo">Tolerância relativa (%)
        <input type="number" id="p-tolP" step="0.1" min="0" value="${estado.prefs.toleranciaPercent}">
      </label>
      <label class="campo">Acima deste % vira DIVERGENTE
        <input type="number" id="p-aten" step="0.1" min="0" value="${estado.prefs.atencaoPercent}">
      </label>
      <label class="campo">Base do extrato do Simples
        <select id="p-base">${Object.entries(BASE_DECLARACAO).map(([k, v]) =>
          `<option value="${k}" ${estado.prefs.baseDeclaracao === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      </label>
    </div>
    <p class="nota">Abaixo da tolerância o mês fica <span class="tag ok">OK</span>;
      entre a tolerância e o limite, <span class="tag atencao">ATENÇÃO</span>; acima dele, <span class="tag erro">DIVERGENTE</span>.</p>
  </section>`
}

function cartaoArquivo (e, tipo) {
  const res = e.resultado || {}
  const ehDeclaracao = !!(res.declaracoes && res.declaracoes.length)
  const ehMovimento = ehTri(tipo)
  const lanc = tipo === 'planilha' ? (res.registros || [])
    : ehMovimento ? (res.movimentos || [])
    : ehDeclaracao ? res.declaracoes : (res.lancamentos || [])
  const n = lanc.length
  const unidade = tipo === 'planilha' ? 'linha(s) de venda'
    : ehMovimento ? ({ z: 'redução(ões) Z', pdv: 'dia(s) de PDV', napp: 'dia(s) de NAPP' })[tipo]
    : ehDeclaracao ? 'competência(s) declarada(s)' : 'lançamento(s)'
  const cnpjs = [...new Set(lanc.map(l => l.cnpj).filter(Boolean))]
  const comps = [...new Set(lanc.map(l => l.competencia).filter(Boolean))].sort()
  const abas = (e.lido && e.lido.abas) || []
  return `
  <div class="arquivo" data-arq="${e.id}" data-tipo="${tipo}">
    <div style="display:flex;gap:8px;align-items:flex-start">
      <div style="flex:1;min-width:0">
        <div class="nome">${esc(e.nome)}</div>
        <div class="meta">
          ${e.erro ? `<span class="tag erro">erro</span> ${esc(e.erro)}`
            : `${res.formato ? esc(res.formato) + ' · ' : ''}${n} ${unidade}
               ${cnpjs.length ? ` · ${cnpjs.length === 1 ? formatarCnpj(cnpjs[0]) : cnpjs.length + ' CNPJ'}` : ''}
               ${comps.length ? ` · ${comps.length === 1 ? competenciaLabel(comps[0]) : competenciaLabel(comps[0]) + '–' + competenciaLabel(comps[comps.length - 1])}` : ''}
               ${e.lido && e.lido.confianca === 'baixa' ? ' <span class="tag atencao">OCR — conferir</span>' : ''}`}
        </div>
      </div>
      <button class="icone" data-remover="${e.id}" title="Remover arquivo">✕</button>
    </div>
    <div class="opcoes">
      ${tipo === 'livro' && !ehDeclaracao ? `
        <label class="campo">Formato
          <select data-opt="formatoForcado">
            ${[['auto', 'detectar'], ['livro-classico', 'livro impresso (P1/P2)'], ['resumo-cst', 'resumo por CST/CFOP'], ['sped', 'SPED EFD']]
              .map(([k, t]) => `<option value="${k}" ${e.opts.formatoForcado === k ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>
        <label class="campo">Livro
          <select data-opt="livroPadrao">
            ${[['', 'pelo CFOP'], ['entradas', 'entradas'], ['saidas', 'saídas']]
              .map(([k, t]) => `<option value="${k}" ${e.opts.livroPadrao === k ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>` : ''}
      ${abas.length > 1 ? `<label class="campo">Aba
          <select data-opt="aba">${abas.map(a => `<option ${e.opts.aba === a.nome ? 'selected' : ''}>${esc(a.nome)}</option>`).join('')}</select>
        </label>` : ''}
      ${estado.acomp.lojistas.length ? `<label class="campo">Lojista (se o arquivo não trouxer CNPJ)
        <select data-opt="cnpjPadrao">
          <option value="">— pelo arquivo —</option>
          ${estado.acomp.lojistas.filter(l => l.ativo !== false).map(l => `<option value="${l.cnpj}" ${normalizarCnpj(e.opts.cnpjPadrao) === l.cnpj ? 'selected' : ''}>${esc(l.nome || l.razao)} · ${formatarCnpj(l.cnpj)}</option>`).join('')}
        </select>
      </label>` : `<label class="campo">CNPJ (se faltar no arquivo)
        <input data-opt="cnpjPadrao" value="${esc(e.opts.cnpjPadrao)}" placeholder="00.000.000/0000-00" size="18">
      </label>`}
      <label class="campo">Competência (se faltar)
        <input data-opt="competenciaPadrao" value="${esc(e.opts.competenciaPadrao)}" placeholder="01/2025" size="9">
      </label>
    </div>
    ${abas.length ? mapeamento(e, tipo) : ''}
    ${(res.avisos || []).length ? `<ul class="avisos">${res.avisos.slice(0, 12).map(a => `<li>${esc(a)}</li>`).join('')}
      ${res.avisos.length > 12 ? `<li class="info">…e mais ${res.avisos.length - 12} aviso(s).</li>` : ''}</ul>` : ''}
  </div>`
}

const CAMPOS_MAPA = [
  ['cnpj', 'CNPJ'], ['empresa', 'Empresa'], ['competencia', 'Competência'],
  ['cfop', 'CFOP'], ['livro', 'Entrada/Saída'], ['valorContabil', 'Valor contábil'],
  ['baseCalculo', 'Base de cálculo'], ['icms', 'ICMS'], ['valorInformado', 'Venda informada'],
]
/** Planilha diária da triangulação (o NAPP): as colunas são outras. */
const CAMPOS_MAPA_MOV = [['data', 'Data'], ['valor', 'Valor da venda'], ['cnpj', 'CNPJ'], ['luc', 'Número da loja (LUC)']]

function mapeamento (e, tipo) {
  const aba = (e.lido.abas || []).find(a => a.nome === e.opts.aba) || (e.lido.abas || [])[0]
  if (!aba || !aba.linhas.length) return ''
  const ehMov = ehTri(tipo)
  const { i, mapa: auto } = acharCabecalho(aba.linhas, ehMov ? SINONIMOS_MOV : undefined)
  if (i === -1) return ''
  const cabecalho = aba.linhas[i].map(c => String(c ?? ''))
  const mapa = e.opts.mapa || auto
  const campos = ehMov ? CAMPOS_MAPA_MOV
    : tipo === 'planilha'
    ? CAMPOS_MAPA.filter(c => ['cnpj', 'empresa', 'competencia', 'valorInformado'].includes(c[0]))
    : CAMPOS_MAPA.filter(c => c[0] !== 'valorInformado')
  return `<details class="cfops" style="margin-top:8px"><summary>Mapeamento de colunas</summary>
    <div class="opcoes">${campos.map(([campo, rot]) => `
      <label class="campo">${rot}
        <select data-mapa="${campo}">
          <option value="">— nenhuma —</option>
          ${cabecalho.map((h, idx) => `<option value="${idx}" ${mapa[campo] === idx ? 'selected' : ''}>${esc(h || 'coluna ' + (idx + 1))}</option>`).join('')}
        </select>
      </label>`).join('')}</div>
    <p class="nota">Cabeçalho detectado na linha ${i + 1}.</p>
  </details>`
}

function blocoConflitos (conflitos) {
  return `<ul class="avisos">${conflitos.map(c => `<li>
    <strong>${formatarCnpj(c.cnpj)} · ${competenciaLabel(c.competencia)} · ${c.livro}</strong>
    aparece em ${c.fontes.length} arquivos. Escolha qual vale:
    <select data-conflito="${esc(c.chave)}" style="margin-left:6px">
      ${c.fontes.map(f => `<option value="${f.fonteId}" ${(estado.fontePreferida[c.chave] || c.fontes[0].fonteId) === f.fonteId ? 'selected' : ''}>
        ${esc(f.arquivo)} (${f.formato}, ${fmt(f.total)})</option>`).join('')}
    </select>
  </li>`).join('')}</ul>`
}

/* ---- aba Conciliação ---- */

function viewResultado (r) {
  if (!r.linhas.length) {
    return `<div class="painel vazio">Carregue os livros fiscais e a ficha de vendas em <strong>Arquivos</strong>, aqui na auditoria.</div>`
  }
  const s = r.resumo
  const cls = s.divergente ? 'erro' : s.atencao ? 'atencao' : 'ok'
  return `
  <div class="cards">
    <div class="card"><div class="rot">Apurado (livro/extrato)</div><div class="val">${fmt(s.totalLivro)}</div></div>
    <div class="card"><div class="rot">Vendas informadas</div><div class="val">${fmt(s.totalPlanilha)}</div></div>
    <div class="card ${cls}"><div class="rot">Diferença</div><div class="val">${fmt(s.totalDiferenca)}</div></div>
    <div class="card"><div class="rot">Competências</div><div class="val">${s.periodos}</div></div>
    <div class="card ${s.divergente ? 'erro' : ''}"><div class="rot">Divergentes</div><div class="val">${s.divergente}</div></div>
    <div class="card ${s.atencao ? 'atencao' : ''}"><div class="rot">Atenção</div><div class="val">${s.atencao}</div></div>
    ${s.incompleto ? `<div class="card atencao"><div class="rot">Falta livro de saídas</div><div class="val">${s.incompleto}</div></div>` : ''}
  </div>
  <section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
      <h2 style="margin:0">Conciliação por CNPJ e competência</h2><span class="espaco"></span>
      <button class="leve" id="exp-conc">Exportar conciliação (CSV)</button>
      <button class="leve" id="exp-cfop">Exportar detalhe por CFOP (CSV)</button>
    </div>
    <div class="rolagem"><table>
      <thead><tr>
        <th>CNPJ</th><th>Competência</th>
        <th class="num">Apurado bruto</th><th class="num">(−) Devoluções</th><th class="num">Apurado líquido</th>
        <th class="num">Informado</th><th class="num">Diferença</th><th class="num">%</th><th>Status</th>
      </tr></thead>
      <tbody>${r.linhas.map(linhaConc).join('')}</tbody>
    </table></div>
    <p class="nota">Para livro fiscal, o apurado líquido = soma dos CFOP de venda no livro de saídas − devoluções de venda
      no livro de entradas; remessas, bonificações, transferências, baixas de estoque e contra-lançamentos ficam de fora.
      Para empresa do Simples, é a receita do extrato PGDAS-D. A coluna <em>Informado</em> vem da planilha do Passo 2.</p>
  </section>`
}

const TAG_STATUS = {
  [STATUS.OK]: 'ok', [STATUS.ATENCAO]: 'atencao', [STATUS.DIVERGENTE]: 'erro',
  [STATUS.SO_LIVRO]: 'neutro', [STATUS.SO_PLANILHA]: 'neutro',
  [STATUS.INCOMPLETO]: 'atencao',
}

function linhaConc (l) {
  const nd = (v) => v == null ? '<td class="num">—</td>' : `<td class="num">${fmt(v)}</td>`
  const alertas = (l.alertas || []).filter(a => a.texto)
  return `<tr>
    <td>${formatarCnpj(l.cnpj)}${nomeDe(l) ? `<div class="sub" style="font-size:11.5px">${esc(nomeDe(l))}</div>` : ''}</td>
    <td>${l.competenciaLabel}</td>
    ${nd(l.vendasBrutas)}${nd(l.devolucoes)}${nd(l.vendasLiquidas)}${nd(l.informado)}${nd(l.diferenca)}
    <td class="num">${percentBR(l.percent)}</td>
    <td><span class="tag ${TAG_STATUS[l.status]}">${l.status}</span>
      ${l.explicacao ? `<div class="sub" style="font-size:11.5px;max-width:330px;white-space:normal">${esc(l.explicacao)}</div>` : ''}
      ${alertas.length ? `<details class="cfops"><summary>${alertas.length} alerta(s)</summary>
        <ul class="avisos">${alertas.map(a => `<li>${esc(a.texto)}</li>`).join('')}</ul></details>` : ''}
    </td>
  </tr>`
}

/* ---- aba Triangulação ---- */

const TAG_TRI = {
  [STATUS_TRI.COERENTE]: 'ok', [STATUS_TRI.ATENCAO]: 'atencao',
  [STATUS_TRI.DISPERSO]: 'erro', [STATUS_TRI.FONTE_UNICA]: 'neutro',
}
const TAG_VEREDITO = {
  [VEREDITO.COERENTE]: 'ok', [VEREDITO.ATENCAO]: 'atencao',
  [VEREDITO.GRAVE]: 'erro', [VEREDITO.PARCIAL]: 'neutro',
}

/**
 * Célula de valor da triangulação. O maior valor da linha fica em destaque e com
 * o rótulo "maior" escrito — a cor sozinha não pode ser a única pista.
 */
function celTri (v, fonte, maiores, destacar = false) {
  if (v == null) return '<td class="num">—</td>'
  const eMaior = destacar && (maiores || []).includes(fonte)
  return `<td class="num${eMaior ? ' maior' : ''}">${fmt(v)}${eMaior ? '<div class="rot-maior">maior</div>' : ''}</td>`
}

function viewTriangulacao (r) {
  const t = r.tri
  const temFontes = estado.z.length || estado.pdv.length || estado.napp.length
  const lim = limitesTri(estado.prefs)
  return `
  <section class="painel">
    <div class="cab"><span class="passo">Z</span><div>
      <h2>Triangulação de vendas — entrada diária ou semanal, fechamento mensal</h2>
      <p class="sub">Quatro tipos de lançamento de venda que deveriam contar a mesma história: o que o <strong>equipamento fiscal</strong>
        registrou (redução Z), o que o <strong>PDV</strong> registrou, o que entrou no <strong>NAPP</strong> e o que foi <strong>declarado</strong>.
        Em cada mês e em cada dia o <strong>maior valor</strong> fica em destaque, e a leitura é pela <strong>maior variação em R$</strong>
        entre eles. Lance conforme chega da loja e feche cada mês quando ele terminar: o fechado vira histórico e é o que o
        cruzamento final usa contra a auditoria anual.</p>
    </div></div>
    <div class="grade3">
      <div>
        <h3>Redução Z</h3>
        <div class="drop" id="drop-z" tabindex="0" role="button">
          Arraste as reduções Z ou <strong>clique para escolher</strong>
          <div class="sub" style="margin-top:6px">cupom de redução Z em PDF ou foto</div>
        </div>
        <input type="file" id="in-z" multiple accept="${FORMATOS_TRIANGULACAO}" hidden>
        ${estado.z.map(e => cartaoArquivo(e, 'z')).join('')}
      </div>
      <div>
        <h3>Relatório de PDV</h3>
        <div class="drop" id="drop-pdv" tabindex="0" role="button">
          Arraste os relatórios de PDV ou <strong>clique para escolher</strong>
          <div class="sub" style="margin-top:6px">relatório de vendas por dia em PDF ou foto</div>
        </div>
        <input type="file" id="in-pdv" multiple accept="${FORMATOS_TRIANGULACAO}" hidden>
        ${estado.pdv.map(e => cartaoArquivo(e, 'pdv')).join('')}
      </div>
      <div>
        <h3>NAPP</h3>
        <div class="drop" id="drop-napp" tabindex="0" role="button">
          Arraste a planilha do NAPP ou <strong>clique para escolher</strong>
          <div class="sub" style="margin-top:6px">Excel diário: data, valor e CNPJ ou número da loja</div>
        </div>
        <input type="file" id="in-napp" multiple accept="${FORMATOS_NAPP}" hidden>
        ${estado.napp.map(e => cartaoArquivo(e, 'napp')).join('')}
      </div>
    </div>
    <p class="nota">O <em>declarado</em> vem da ficha de vendas informadas (Auditoria fiscal → Dados → Vendas informadas).
      Linhas do mesmo dia são somadas, então relatório quebrado por caixa ou por forma de pagamento entra direto.
      O NAPP sem CNPJ é ligado ao lojista pelo número da loja (LUC) da carteira. Foto passa por OCR: confira os valores lidos antes de fechar o mês.</p>
    <details class="cfops" id="limites-tri" ${estado.limitesTriAbertos ? 'open' : ''}><summary>Limites da leitura em R$ — mês: até ${fmt(lim.coerente)} coerente, até ${fmt(lim.atencao)} atenção; dia: até ${fmt(lim.dia)}</summary>
      <div class="opcoes" style="margin-top:8px">
        <label class="campo">Mês: coerente até (R$)<input type="number" id="p-tri-coerente" step="10" min="0" value="${lim.coerente}"></label>
        <label class="campo">Mês: atenção até (R$)<input type="number" id="p-tri-atencao" step="10" min="0" value="${lim.atencao}"></label>
        <label class="campo">Dia: coerente até (R$)<input type="number" id="p-tri-dia" step="10" min="0" value="${lim.dia}"></label>
      </div>
      <p class="nota">A variação é o maior valor menos o menor, entre os tipos de lançamento presentes. Acima do limite de atenção o mês fica DISPERSO.
        Os limites valem também para o cruzamento final e ficam salvos neste navegador.</p>
    </details>
  </section>

  ${!temFontes ? `<div class="painel vazio">Carregue a redução Z, o relatório de PDV ou o NAPP acima para triangular.</div>` : `
  <div class="cards">
    <div class="card"><div class="rot">Redução Z</div><div class="val">${fmt(t.resumo.totalZ)}</div></div>
    <div class="card"><div class="rot">PDV</div><div class="val">${fmt(t.resumo.totalPdv)}</div></div>
    <div class="card"><div class="rot">NAPP</div><div class="val">${fmt(t.resumo.totalNapp)}</div></div>
    <div class="card"><div class="rot">Declarado (meses com Z/PDV/NAPP)</div><div class="val">${fmt(t.resumo.totalDeclarado)}</div></div>
    <div class="card ${t.resumo.totalNaoDeclarado ? 'atencao' : ''}"><div class="rot">Não declarado (maior − declarado)</div><div class="val">${fmt(t.resumo.totalNaoDeclarado)}</div></div>
    <div class="card ${t.resumo.disperso ? 'erro' : ''}"><div class="rot">Dispersas</div><div class="val">${t.resumo.disperso}</div></div>
    <div class="card ${t.resumo.atencao ? 'atencao' : ''}"><div class="rot">Atenção</div><div class="val">${t.resumo.atencao}</div></div>
    <div class="card ${t.resumo.alertasGraves ? 'erro' : ''}"><div class="rot">Alertas graves</div><div class="val">${t.resumo.alertasGraves}</div></div>
  </div>

  ${t.sequencia.length ? `<section class="painel">
    <h2>Sequência do equipamento fiscal</h2>
    <p class="sub">Duas conferências que só a redução Z permite: o contador CRZ sobe de um em um, e o Grande Total é acumulador que não zera.</p>
    <ul class="avisos">${t.sequencia.map(a => `<li>${esc(a.texto)}</li>`).join('')}</ul>
  </section>` : ''}

  <section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
      <h2 style="margin:0">Mês a mês</h2><span class="espaco"></span>
      <button class="leve" id="exp-tri">Exportar triangulação (CSV)</button>
    </div>
    <div class="rolagem"><table>
      <thead><tr>
        <th>CNPJ</th><th>Competência</th>
        <th class="num">Redução Z</th><th class="num">PDV</th><th class="num">NAPP</th><th class="num">Declarado</th>
        <th class="num">Variação R$<div class="sub" style="font-size:10.5px;font-weight:400">maior − menor</div></th>
        <th class="num">Não declarado R$<div class="sub" style="font-size:10.5px;font-weight:400">maior − declarado</div></th>
        <th>Status</th>
      </tr></thead>
      <tbody>${t.porMes.map(p => linhaTri(p)).join('')}</tbody>
    </table></div>
    <p class="nota">Em cada linha o <strong>maior valor</strong> entre os tipos de lançamento fica em destaque. Variação = maior menos o menor;
      não declarado = quanto o maior passa do declarado. Com um tipo só a linha fica marcada como tal em vez de aparecer como se fechasse.</p>
    ${blocoFechamento(t)}
  </section>

  ${t.porDia.filter(d => d.variacao != null).length ? `<section class="painel">
    <h2>Dia a dia, onde dois ou mais tipos de lançamento se encontram</h2>
    <p class="sub">Ordenado pela maior variação em R$. É aqui que um dia específico aparece.</p>
    <div class="rolagem"><table>
      <thead><tr><th>CNPJ</th><th>Data</th><th class="num">Redução Z</th><th class="num">PDV</th><th class="num">NAPP</th>
        <th class="num">Variação R$</th><th>Status</th></tr></thead>
      <tbody>${t.porDia.filter(d => d.variacao != null)
        .sort((a, b) => b.variacao - a.variacao).slice(0, 60).map(d => `
        <tr class="${d.status === STATUS_TRI.DISPERSO ? 'grave' : ''}">
          <td>${formatarCnpj(d.cnpj)}</td><td>${dataLabel(d.data)}</td>
          ${celTri(d.z, 'z', d.fonteMaior, d.variacao > 0)}${celTri(d.pdv, 'pdv', d.fonteMaior, d.variacao > 0)}${celTri(d.napp, 'napp', d.fonteMaior, d.variacao > 0)}
          <td class="num">${fmt(d.variacao)}</td>
          <td><span class="tag ${TAG_TRI[d.status]}">${d.status}</span></td>
        </tr>`).join('')}</tbody>
    </table></div>
  </section>` : ''}
  `}

  ${viewHistorico(r)}
  ${viewCruzamento(r)}`
}

/** Fechar um mês: as linhas daquela competência viram histórico. */
function blocoFechamento (t) {
  const comps = [...new Set(t.porMes.filter(p => p.z != null || p.pdv != null).map(p => p.competencia))].sort()
  if (!comps.length) return ''
  const fechadas = new Set(estado.acomp.fechamentos.map(f => f.competencia))
  return `<div class="fechar">
    <label class="campo">Fechar o mês
      <select id="mes-fechar">${comps.map(c => `<option value="${c}">${competenciaLabel(c)}${fechadas.has(c) ? ' (já fechado — refaz)' : ''}</option>`).join('')}</select>
    </label>
    <button class="acao" id="fechar-mes">Fechar mês</button>
    <span class="sub">O fechamento grava Z, PDV, NAPP, declarado, o maior valor, a variação em R$ e os alertas de cada lojista no histórico deste navegador.
      Fechar de novo o mesmo mês substitui o fechamento anterior.</span>
  </div>`
}

/** O histórico dos meses fechados — é ele que o cruzamento final usa. */
function viewHistorico (r) {
  const f = estado.acomp.fechamentos
  if (!f.length) return ''
  return `<section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
      <h2 style="margin:0">Histórico da triangulação (${f.length} fechamento(s))</h2><span class="espaco"></span>
      <button class="leve" id="exp-hist">Exportar histórico (CSV)</button>
    </div>
    <div class="rolagem"><table>
      <thead><tr><th>Competência</th><th>Lojista</th><th>Fechado em</th>
        <th class="num">Redução Z</th><th class="num">PDV</th><th class="num">NAPP</th><th class="num">Declarado</th><th class="num">Variação R$</th><th>Status</th><th></th></tr></thead>
      <tbody>${f.map(x => {
        const l = lojistaDe(x.cnpj)
        // fechamento antigo (sem NAPP nem maior gravados): o maior é calculado na hora
        const r = x.fonteMaior ? x : resumirFontes({ z: x.z, pdv: x.pdv, napp: x.napp, declarado: x.declarado }, estado.prefs)
        const destacar = (x.amplitude ?? r.amplitude) > 0
        return `<tr class="${(x.alertas || []).some(a => a.grave) ? 'grave' : ''}">
          <td>${competenciaLabel(x.competencia)}</td>
          <td>${l ? esc(l.nome) + '<div class="sub" style="font-size:11px">' + formatarCnpj(x.cnpj) + '</div>' : formatarCnpj(x.cnpj)}</td>
          <td>${dataBR(x.fechadoEm)}</td>
          ${celTri(x.z, 'z', r.fonteMaior, destacar)}${celTri(x.pdv, 'pdv', r.fonteMaior, destacar)}
          ${celTri(x.napp, 'napp', r.fonteMaior, destacar)}${celTri(x.declarado, 'declarado', r.fonteMaior, destacar)}
          <td class="num">${x.amplitude == null ? '—' : fmt(x.amplitude)}</td>
          <td><span class="tag ${TAG_TRI[x.status] || 'neutro'}">${x.status}</span>
            ${(x.alertas || []).length ? `<div class="sub" style="font-size:11px">${x.alertas.filter(a => a.grave).length} alerta(s) grave(s)</div>` : ''}</td>
          <td><button class="icone" data-reabrir="${x.cnpj}|${x.competencia}" title="Reabrir (apaga este fechamento)">✕</button></td>
        </tr>`
      }).join('')}</tbody>
    </table></div>
  </section>`
}

function linhaTri (p) {
  const grave = (p.alertas || []).some(a => a.grave)
  // só há "maior" quando os tipos de lançamento diferem; tudo igual não tem destaque
  const destacar = p.amplitude > 0
  return `<tr class="${grave ? 'grave' : ''}">
    <td>${formatarCnpj(p.cnpj)}${nomeDe(p) ? `<div class="sub" style="font-size:11px">${esc(nomeDe(p))}</div>` : ''}</td>
    <td>${p.competenciaLabel}<div class="sub" style="font-size:11px">${p.diasZ}d Z · ${p.diasPdv}d PDV · ${p.diasNapp || 0}d NAPP</div></td>
    ${celTri(p.z, 'z', p.fonteMaior, destacar)}${celTri(p.pdv, 'pdv', p.fonteMaior, destacar)}
    ${celTri(p.napp, 'napp', p.fonteMaior, destacar)}${celTri(p.declarado, 'declarado', p.fonteMaior, destacar)}
    <td class="num" title="${p.dispersao == null ? '' : 'equivale a ' + percentBR(p.dispersao) + ' do maior valor'}">${p.amplitude == null ? '—' : fmt(p.amplitude)}</td>
    <td class="num">${p.naoDeclarado == null ? '—' : fmt(p.naoDeclarado)}</td>
    <td><span class="tag ${TAG_TRI[p.status]}">${p.status}</span>
      <div class="sub" style="font-size:11.5px;min-width:190px;max-width:320px;white-space:normal">${esc(p.explicacao)}</div>
      ${(p.alertas || []).length ? `<details class="cfops"><summary>${p.alertas.length} alerta(s)</summary>
        <ul class="avisos">${p.alertas.map(a => `<li>${esc(a.texto)}</li>`).join('')}</ul></details>` : ''}
    </td>
  </tr>`
}

/* ---- cruzamento final: triangulação x auditoria fiscal ---- */

function viewCruzamento (r) {
  const c = r.cruz
  if (!c.linhas.length) return ''
  return `<section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
      <h2 style="margin:0">Cruzamento final</h2><span class="espaco"></span>
      <button class="leve" id="exp-cruz">Exportar cruzamento (CSV)</button>
    </div>
    <p class="sub">Todas as fontes numa linha só: apurado, redução Z, PDV, NAPP e informado, com o <strong>maior valor</strong> em destaque.
      A referência é o <strong>apurado</strong> — o que sai do livro fiscal ou do extrato do Simples — porque é a peça que o fisco
      já tem; sem ele, a redução Z assume. A maior diferença em R$ contra a referência decide o veredito.</p>
    <div class="cards" style="margin-top:14px">
      <div class="card ${c.resumo.grave ? 'erro' : ''}"><div class="rot">Investigar</div><div class="val">${c.resumo.grave}</div></div>
      <div class="card ${c.resumo.atencao ? 'atencao' : ''}"><div class="rot">Atenção</div><div class="val">${c.resumo.atencao}</div></div>
      <div class="card ok"><div class="rot">Tudo fecha</div><div class="val">${c.resumo.coerente}</div></div>
      <div class="card"><div class="rot">Fontes de menos</div><div class="val">${c.resumo.parcial}</div></div>
    </div>
    <div class="rolagem"><table>
      <thead><tr>
        <th>CNPJ</th><th>Competência</th><th>Referência</th>
        <th class="num">Apurado</th><th class="num">Redução Z</th><th class="num">PDV</th><th class="num">NAPP</th><th class="num">Informado</th>
        <th class="num">Maior diferença R$</th><th>Veredito</th>
      </tr></thead>
      <tbody>${c.linhas.map(l => {
        const destacar = l.fontes >= 2 && l.piorValor > 0
        const dicas = Object.entries(l.desvios).filter(([, d]) => d).map(([k, d]) => `${k}: ${fmt(d.valor)}${d.percent == null ? '' : ' (' + percentBR(d.percent) + ')'}`).join(' · ')
        return `<tr class="${l.veredito === VEREDITO.GRAVE ? 'grave' : ''}">
          <td>${l.cnpjFmt}${nomeDe(l) ? `<div class="sub" style="font-size:11px">${esc(nomeDe(l))}</div>` : ''}</td>
          <td>${l.competenciaLabel}${l.fechado === false ? '<div class="sub" style="font-size:11px">mês aberto</div>' : l.fechado ? '<div class="sub" style="font-size:11px">fechado</div>' : ''}</td>
          <td><span class="tag neutro">${l.referencia === 'apurado' ? esc(l.tipoApurado || 'apurado') : l.referencia === 'z' ? 'redução Z' : '—'}</span></td>
          ${celTri(l.apurado, 'apurado', l.fonteMaior, destacar)}${celTri(l.z, 'z', l.fonteMaior, destacar)}
          ${celTri(l.pdv, 'pdv', l.fonteMaior, destacar)}${celTri(l.napp, 'napp', l.fonteMaior, destacar)}
          ${celTri(l.informado, 'informado', l.fonteMaior, destacar)}
          <td class="num" title="${esc(dicas)}">${l.fontes >= 2 ? fmt(l.piorValor) : '—'}</td>
          <td><span class="tag ${TAG_VEREDITO[l.veredito]}">${l.veredito}</span>
            <div class="sub" style="font-size:11.5px;max-width:320px;white-space:normal">${esc(l.leitura)}</div></td>
        </tr>`
      }).join('')}</tbody>
    </table></div>
    <p class="nota">Uma linha só vira <strong>${VEREDITO.COERENTE}</strong> com pelo menos duas fontes.
      Com uma só ela fica em <strong>${VEREDITO.PARCIAL}</strong> — ausência de divergência não é prova de acerto.</p>
  </section>`
}

/* ---- aba Detalhe ---- */

function viewDetalhe (r) {
  if (!r.periodos.length) return `<div class="painel vazio">Nenhum livro carregado ainda.</div>`
  return `<section class="painel">
    <h2>De onde saiu cada número</h2>
    <p class="sub">Para livro fiscal, todo CFOP lido e o que ele fez com o resultado — confira se algum caiu no balde errado e mude a regra na aba <strong>Tabela de códigos</strong>. Para o extrato do Simples, a quebra da receita declarada por atividade.</p>
    ${r.periodos.map(p => `
      <h3 style="margin-top:18px">${formatarCnpj(p.cnpj)} · ${p.competenciaLabel}
        <span class="tag neutro">${p.tipo === 'declaracao' ? 'PGDAS-D' : esc((p.livros || []).join(' + ') || 'sem livro')}</span>
        ${p.confiancaMinima !== 'alta' ? `<span class="tag atencao">confiança ${p.confiancaMinima}</span>` : ''}</h3>
      ${p.tipo === 'declaracao' ? blocoDeclaracao(p) : `
      <div class="rolagem"><table>
        <thead><tr><th>CFOP</th><th>Livro</th><th>Descrição</th><th>Tratamento</th>
          <th class="num">Valor</th><th class="num">Base</th><th class="num">ICMS</th></tr></thead>
        <tbody>${p.cfops.map(c => {
          const efeito = c.natureza === 'VENDA' ? 'ok' : (c.natureza === 'DEVOLUCAO_VENDA' || c.natureza === 'ANULACAO_SAIDA') ? 'atencao'
            : (c.natureza === 'DESCONHECIDO' || c.natureza === 'REVISAR') ? 'erro' : 'neutro'
          return `<tr>
            <td><code>${c.cfop}</code></td><td>${esc(c.livro || '—')}</td>
            <td style="white-space:normal;max-width:360px">${esc(c.descricao)}</td>
            <td><span class="tag ${efeito}">${esc(NATUREZA_LABEL[c.natureza] || c.natureza)}</span></td>
            <td class="num">${fmt(c.valor)}</td><td class="num">${fmt(c.base)}</td><td class="num">${fmt(c.icms)}</td>
          </tr>`
        }).join('')}
        <tr><td colspan="4"><strong>Vendas líquidas</strong></td>
          <td class="num"><strong>${fmt(p.vendasLiquidas)}</strong></td><td class="num"></td><td class="num"></td></tr>
        </tbody>
      </table></div>`}`).join('')}
  </section>`
}

/** Um período vindo do extrato do Simples não tem CFOP: mostra a quebra por atividade. */
function blocoDeclaracao (p) {
  const d = p.declarado || {}
  const linha = (rot, v, forte) => v == null ? '' :
    `<tr><td>${rot}</td><td class="num">${forte ? '<strong>' + fmt(v) + '</strong>' : fmt(v)}</td></tr>`
  return `<div class="rolagem"><table>
    <thead><tr><th>Receita declarada no PGDAS-D</th><th class="num">Valor</th></tr></thead>
    <tbody>
      ${linha('Revenda de mercadorias', d.mercadoria)}
      ${linha('Prestação de serviço (ISS)', d.servico)}
      ${linha('Receita bruta total', d.total)}
      ${linha('Usado na comparação', p.vendasLiquidas, true)}
    </tbody>
  </table></div>
  <p class="nota">${d.escopo === 'estabelecimento'
    ? 'Declaração do próprio estabelecimento, com a quebra por atividade.'
    : 'Mês vindo do histórico do extrato: receita consolidada da empresa, sem quebra por atividade.'}</p>`
}

/* ---- aba Dashboard: evolução e pendências dos três processos ---- */

const SERIE_FISCAL = {
  recebido: { rotulo: 'Recebidos', cor: 'var(--serie-1)' },
  auditado: { rotulo: 'Apurados', cor: 'var(--serie-2)' },
  cobrado: { rotulo: 'Cobrados', cor: 'var(--serie-3)' },
}
/** Tela de celular: os gráficos usam um viewBox mais estreito para o texto não ficar minúsculo. */
const estreito = () => typeof innerWidth !== 'undefined' && innerWidth < 640
const pctBR = (v) => (v == null ? '—' : String(Math.round(v * 10) / 10).replace('.', ',') + '%')

function viewDashboard (r) {
  const d = r.dash
  if (!estado.acomp.lojistas.length) {
    return `<div class="painel vazio">O dashboard acompanha a carteira. Lance os lojistas na aba <strong>Lojistas</strong> —
      ou, para conhecer o app, <button class="acao" data-carregar-ficticia>Carregar base fictícia</button></div>`
  }
  const f = d.fiscal; const t = d.tri; const s = d.soc
  const cen = estado.acomp.ficticia && estado.acomp.cenarios ? estado.acomp.cenarios : null
  return `${faixaCiclo(r.painel.ciclo)}
  ${cen ? `<details class="cfops roteiro" ${estado.roteiroAberto ? 'open' : ''} id="roteiro"><summary>Roteiro de testes da base fictícia — ${cen.length} cenários com o que deve aparecer</summary>
    <div class="rolagem"><table><thead><tr><th>#</th><th>Loja</th><th>Processo</th><th>O que deve aparecer</th><th>Onde</th></tr></thead>
    <tbody>${cen.map((c, i) => `<tr><td>${i + 1}</td><td><strong>${esc(c.loja)}</strong><div class="sub" style="font-size:11px">${formatarCnpj(c.cnpj)}</div></td><td>${esc(c.processo)}</td><td style="white-space:normal;min-width:240px">${esc(c.situacao)}</td><td>${esc(c.onde)}</td></tr>`).join('')}</tbody></table></div>
    <p class="nota"><button class="leve" id="baixar-roteiro">Baixar o roteiro (Markdown)</button></p>
  </details>` : ''}
  <div class="cards">
    <div class="card"><div class="rot">Livros recebidos</div><div class="val">${pctBR(f.etapas[0].pct)}</div></div>
    <div class="card"><div class="rot">Apurados</div><div class="val">${pctBR(f.etapas[1].pct)}</div></div>
    <div class="card"><div class="rot">Cobrados</div><div class="val">${pctBR(f.etapas[3].pct)}</div></div>
    <div class="card"><div class="rot">Triangulação: meses fechados${t.referencia ? ' (' + competenciaLabel(t.referencia) + ')' : ''}</div><div class="val">${t.etapas.length ? pctBR(t.etapas.find(e => e.rotulo === 'Mês fechado').pct) : '—'}</div></div>
    <div class="card"><div class="rot">Pesquisados na Junta</div><div class="val">${pctBR(s.etapas[0].pct)}</div></div>
    <div class="card"><div class="rot">TT faturada / encontrada</div><div class="val">${s.ttEncontrada ? pctBR(s.pctFaturado) : '—'}</div></div>
  </div>

  <section class="painel dash">
    <div class="dash-cab"><h2>Auditoria fiscal — ciclo ${r.painel.ciclo.ano}</h2><span class="sub">base: ${f.total} lojista(s) ativo(s)</span></div>
    <div class="grade-dash">
      <div>${medidores(f.etapas)}
        <div class="mini-valores">
          <span>Divergência apurada <b>${fmt(f.valores.divergencia)}</b></span>
          <span>Negociado <b>${fmt(f.valores.negociado)}</b></span>
          <span>Cobrado <b>${fmt(f.valores.cobrado)}</b></span>
        </div>
      </div>
      <div>${graficoEvolucao(f.series)}</div>
    </div>
    ${blocoPendencias(f.pendencias, 'fiscal')}
  </section>

  <section class="painel dash">
    <div class="dash-cab"><h2>Triangulação${t.referencia ? ' — ' + competenciaLabel(t.referencia) : ''}</h2>
      <span class="sub">base: ${t.total} lojista(s) ativo(s)${t.competencias.length > 1 ? ' · ' : ''}</span>
      ${t.competencias.length > 1 ? `<label class="campo" style="flex-direction:row;align-items:center;gap:6px">competência
        <select id="dash-comp">${t.competencias.map(c => `<option value="${c}" ${c === t.referencia ? 'selected' : ''}>${competenciaLabel(c)}</option>`).join('')}</select></label>` : ''}
    </div>
    ${t.referencia ? `<div class="grade-dash">
      <div><h3>% de cada etapa realizada</h3>${medidores(t.etapas)}</div>
      <div><h3>Variação em R$ entre os tipos de lançamento, por competência</h3>${graficoDispersao(t.dispersao, t.atencao)}</div>
    </div>` : '<p class="sub">Nenhuma competência triangulada ainda: carregue reduções Z e relatórios de PDV na aba Triangulação.</p>'}
    ${blocoPendencias(t.pendencias, 'tri')}
  </section>

  <section class="painel dash">
    <div class="dash-cab"><h2>Mudança societária e taxa de transferência</h2><span class="sub">base: ${s.total} lojista(s) ativo(s)</span></div>
    <div class="grade-dash">
      <div>${medidores(s.etapas)}</div>
      <div>
        <div class="cards" style="margin-bottom:10px">
          <div class="card"><div class="rot">TT contratual encontrada</div><div class="val">${fmt(s.ttEncontrada)}</div></div>
          <div class="card"><div class="rot">TT negociada</div><div class="val">${fmt(s.ttNegociada)}</div></div>
          <div class="card"><div class="rot">TT faturada</div><div class="val">${fmt(s.ttFaturada)}</div></div>
        </div>
        ${medidores([{ rotulo: 'TT faturada sobre a encontrada', qtd: s.ttFaturada, total: s.ttEncontrada, pct: s.pctFaturado, moeda: true }])}
      </div>
    </div>
    ${blocoPendencias(s.pendencias, 'soc')}
  </section>`
}

/** Barra de progresso 0–100% por etapa, com o número escrito ao lado (não só a cor). */
function medidores (etapas) {
  return `<div class="medidores">${etapas.map(e => {
    const largura = Math.max(0, Math.min(100, e.pct || 0))
    const texto = e.moeda ? `${fmt(e.qtd)} de ${fmt(e.total)}` : `${e.qtd} de ${e.total}${e.base ? ' ' + e.base : ''}`
    return `<div class="medidor" data-dica="${esc(e.rotulo)}: ${esc(texto)} (${pctBR(e.pct)})">
      <div class="medidor-rot"><span>${esc(e.rotulo)}</span><b>${pctBR(e.pct)}</b></div>
      <div class="medidor-trilho"><i style="width:${largura}%"></i></div>
      <div class="sub" style="font-size:11.5px">${esc(texto)}</div>
    </div>`
  }).join('')}</div>`
}

/** Linhas da evolução acumulada (% da carteira) mês a mês, com rótulo direto no fim de cada linha. */
function graficoEvolucao (series) {
  const pontos = series[0] ? series[0].pontos : []
  if (pontos.length < 1) return ''
  const W = estreito() ? 380 : 520; const H = estreito() ? 240 : 220; const m = { e: 34, d: 86, t: 12, b: 26 }
  const iw = W - m.e - m.d; const ih = H - m.t - m.b
  const x = (i) => m.e + (pontos.length === 1 ? iw / 2 : i * iw / (pontos.length - 1))
  const y = (v) => m.t + ih - (v / 100) * ih
  const grade = [0, 25, 50, 75, 100].map(v => `<line x1="${m.e}" x2="${W - m.d}" y1="${y(v)}" y2="${y(v)}" class="grade"/><text x="${m.e - 6}" y="${y(v) + 4}" class="eixo" text-anchor="end">${v}%</text>`).join('')
  const passo = Math.ceil(pontos.length / 6)
  const rotX = pontos.map((p, i) => i % passo === 0 || i === pontos.length - 1 ? `<text x="${x(i)}" y="${H - 8}" class="eixo" text-anchor="middle">${p.label.slice(0, 2)}/${p.label.slice(5)}</text>` : '').join('')
  // rótulos diretos: evita sobreposição empurrando para baixo
  const fins = series.map(s => ({ s, yy: y(s.pontos[s.pontos.length - 1].pct) })).sort((a, b) => a.yy - b.yy)
  for (let i = 1; i < fins.length; i++) if (fins[i].yy - fins[i - 1].yy < 14) fins[i].yy = fins[i - 1].yy + 14
  const linhas = series.map(s => {
    const c = SERIE_FISCAL[s.chave].cor
    const pts = s.pontos.map((p, i) => `${x(i)},${y(p.pct)}`).join(' ')
    const ult = s.pontos[s.pontos.length - 1]
    return `<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="${x(s.pontos.length - 1)}" cy="${y(ult.pct)}" r="4" fill="${c}" stroke="var(--painel)" stroke-width="2"/>`
  }).join('')
  const rotulos = fins.map(({ s, yy }) => `<text x="${W - m.d + 8}" y="${yy + 4}" class="rot-serie">${SERIE_FISCAL[s.chave].rotulo} ${pctBR(s.pontos[s.pontos.length - 1].pct)}</text>`).join('')
  // faixas de hover por mês
  const faixa = iw / Math.max(1, pontos.length - 1)
  const hits = pontos.map((p, i) => `<rect x="${x(i) - faixa / 2}" y="${m.t}" width="${faixa}" height="${ih}" fill="transparent"
    data-dica="${p.label} · ${series.map(s => `${SERIE_FISCAL[s.chave].rotulo} ${pctBR(s.pontos[i].pct)} (${s.pontos[i].qtd})`).join(' · ')}"/>`).join('')
  return `<h3>Evolução acumulada no ciclo (% da carteira)</h3>
    <div class="legenda-viz">${series.map(s => `<span><b style="background:${SERIE_FISCAL[s.chave].cor}"></b>${SERIE_FISCAL[s.chave].rotulo}</span>`).join('')}</div>
    <svg viewBox="0 0 ${W} ${H}" class="grafico" role="img" aria-label="Evolução acumulada de livros recebidos, apurados e cobrados">${grade}${rotX}${linhas}${rotulos}${hits}</svg>
    <details class="cfops"><summary>Ver em tabela</summary>
      <div class="rolagem"><table><thead><tr><th>Mês</th>${series.map(s => `<th class="num">${SERIE_FISCAL[s.chave].rotulo}</th>`).join('')}</tr></thead>
      <tbody>${pontos.map((p, i) => `<tr><td>${p.label}</td>${series.map(s => `<td class="num">${s.pontos[i].qtd} · ${pctBR(s.pontos[i].pct)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    </details>`
}

/** R$ curto para eixo de gráfico: "R$ 12,5 mil". */
const reaisCurto = (v) => Math.abs(v) >= 1000 ? 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil'
  : 'R$ ' + Math.round(v).toLocaleString('pt-BR')

/** Variação em R$ (maior − menor) média e máxima por competência, com o limite de atenção. */
function graficoDispersao (lista, limite) {
  const dados = lista.filter(c => c.media != null)
  if (!dados.length) return '<p class="sub">Nenhuma competência com dois tipos de lançamento ou mais.</p>'
  const W = estreito() ? 380 : 520; const H = estreito() ? 240 : 220; const m = { e: 58, d: 12, t: 12, b: 26 }
  const iw = W - m.e - m.d; const ih = H - m.t - m.b
  const topo = Math.max(limite * 1.5, ...dados.map(c => c.maxima || 0)) * 1.1
  const y = (v) => m.t + ih - (v / topo) * ih
  const banda = iw / dados.length; const larg = Math.min(46, banda * 0.6)
  const marcas = [0, topo / 2, topo].map(v => `<line x1="${m.e}" x2="${W - m.d}" y1="${y(v)}" y2="${y(v)}" class="grade"/><text x="${m.e - 6}" y="${y(v) + 4}" class="eixo" text-anchor="end">${reaisCurto(v)}</text>`).join('')
  const barras = dados.map((c, i) => {
    const cx = m.e + banda * i + banda / 2
    const h = Math.max(2, m.t + ih - y(c.media))
    return `<g data-dica="${c.label} · média ${fmt(c.media)} · máxima ${fmt(c.maxima)} · não declarado ${fmt(c.naoDeclarado)} · ${c.lojistas} lojista(s)${c.fechada ? ' · fechada' : ' · aberta'}">
      <rect x="${cx - banda / 2}" y="${m.t}" width="${banda}" height="${ih}" fill="transparent"/>
      <path d="M${cx - larg / 2},${m.t + ih} v${-(h - 4)} q0,-4 4,-4 h${larg - 8} q4,0 4,4 v${h - 4} z" fill="var(--serie-1)" opacity="${c.fechada ? 1 : 0.55}"/>
      <line x1="${cx - larg / 2}" x2="${cx + larg / 2}" y1="${y(c.maxima)}" y2="${y(c.maxima)}" stroke="var(--texto)" stroke-width="2"/>
      <text x="${cx}" y="${H - 8}" class="eixo" text-anchor="middle">${c.label}</text>
    </g>`
  }).join('')
  return `<div class="legenda-viz"><span><b style="background:var(--serie-1)"></b>média (mais clara = mês aberto)</span><span><b style="background:var(--texto);height:2px"></b>máxima</span><span>- - - limite de atenção ${fmt(limite)}</span></div>
    <svg viewBox="0 0 ${W} ${H}" class="grafico" role="img" aria-label="Variação em reais média e máxima por competência">${marcas}
      <line x1="${m.e}" x2="${W - m.d}" y1="${y(limite)}" y2="${y(limite)}" stroke="var(--erro)" stroke-width="1.5" stroke-dasharray="5 4"/>${barras}</svg>
    <details class="cfops"><summary>Ver em tabela</summary>
      <div class="rolagem"><table><thead><tr><th>Competência</th><th class="num">Lojistas</th><th class="num">Variação média</th><th class="num">Variação máxima</th><th class="num">Não declarado</th><th>Situação</th></tr></thead>
      <tbody>${dados.map(c => `<tr><td>${c.label}</td><td class="num">${c.lojistas}</td><td class="num">${fmt(c.media)}</td><td class="num">${fmt(c.maxima)}</td><td class="num">${fmt(c.naoDeclarado)}</td><td>${c.fechada ? 'fechada' : 'aberta'}</td></tr>`).join('')}</tbody></table></div>
    </details>`
}

/** Pendências de um processo: um grupo por tipo, com contagem; abre para ver quem. */
function blocoPendencias (grupos, chave) {
  const total = grupos.reduce((a, g) => a + g.lista.length, 0)
  return `<div class="pendencias">
    <h3>Pendências ${total ? `<span class="tag atencao">${total}</span>` : '<span class="tag ok">nenhuma</span>'}</h3>
    <div class="grupos-pend">${grupos.map((g, i) => `<details class="grupo-pend ${g.lista.length ? '' : 'vazio-pend'}" ${estado.pendAberta === chave + i ? 'open' : ''} data-pend="${chave + i}">
      <summary><span>${esc(g.rotulo)}</span><b>${g.lista.length}</b></summary>
      ${g.lista.length ? `<ul>${g.lista.slice(0, 40).map(x => {
        const l = x.lojista || {}
        const det = typeof g.detalhe === 'function' ? g.detalhe(x) : x.detalhe
        return `<li><strong>${esc(l.nome || l.razao || formatarCnpj(x.cnpj))}</strong>${l.luc ? ` · LUC ${esc(l.luc)}` : ''} <span class="sub">${esc(det || '')}</span></li>`
      }).join('')}${g.lista.length > 40 ? `<li class="sub">…e mais ${g.lista.length - 40}</li>` : ''}</ul>` : ''}
    </details>`).join('')}</div>
  </div>`
}

/* ---- aba Painel: o ciclo anual de recebimento dos livros ---- */

const TAG_LIVRO = {
  [STATUS_LIVRO.NAO_RECEBIDO]: 'erro', [STATUS_LIVRO.RECEBIDO]: 'neutro', [STATUS_LIVRO.AUDITADO]: 'atencao',
  [STATUS_LIVRO.NEGOCIADO]: 'atencao', [STATUS_LIVRO.COBRADO]: 'ok',
}

function viewPainel (r) {
  const p = r.painel; const c = p.ciclo
  if (!estado.acomp.lojistas.length) {
    return `${faixaCiclo(c)}
    <div class="painel vazio">Comece pela aba <strong>Lojistas</strong>: lance a relação de lojistas do shopping (planilha ou um a um).
      A partir daí o painel acompanha, ciclo a ciclo, quem entregou os livros, quem foi auditado, negociado e cobrado.
      <p class="nota" style="margin-top:10px">Já tem uma cópia salva em outro aparelho?
        <button class="leve" id="imp-backup">Restaurar cópia</button><input type="file" id="in-backup" accept=".json" hidden></p></div>`
  }
  const n = p.contagem
  const f = estado.filtroPainel
  const busca = f.busca.toLowerCase()
  const linhas = p.situacoes.filter(s => (!f.status || s.status === f.status) &&
    (!busca || (s.lojista.nome + ' ' + s.lojista.razao + ' ' + s.lojista.luc + ' ' + formatarCnpj(s.cnpj)).toLowerCase().includes(busca)))
  const maxMes = Math.max(1, ...p.porMes.map(m => m.acumulado))
  return `${faixaCiclo(c)}
  <div class="cards">
    <div class="card"><div class="rot">Lojistas ativos</div><div class="val">${n.total}</div></div>
    <div class="card ${n[STATUS_LIVRO.NAO_RECEBIDO] ? 'erro' : 'ok'}"><div class="rot">Não recebidos</div><div class="val">${n[STATUS_LIVRO.NAO_RECEBIDO]}</div></div>
    <div class="card"><div class="rot">Recebidos</div><div class="val">${n[STATUS_LIVRO.RECEBIDO]}</div></div>
    <div class="card"><div class="rot">Auditados</div><div class="val">${n[STATUS_LIVRO.AUDITADO]}</div></div>
    <div class="card"><div class="rot">Negociados</div><div class="val">${n[STATUS_LIVRO.NEGOCIADO]}</div></div>
    <div class="card ok"><div class="rot">Cobrados</div><div class="val">${n[STATUS_LIVRO.COBRADO]}</div></div>
    <div class="card ${p.pendentes.length ? 'atencao' : ''}"><div class="rot">Notificações devidas</div><div class="val">${p.pendentes.length}</div></div>
    <div class="card ${p.multados.length ? 'erro' : ''}"><div class="rot">Multados sem livro</div><div class="val">${p.multados.length}</div></div>
    <div class="card ${r.soc.aValidar.length ? 'erro' : r.soc.contagem[STATUS_SOC.EM_COBRANCA] ? 'atencao' : ''}"><div class="rot">Societário: a validar / em cobrança</div><div class="val">${r.soc.aValidar.length} / ${r.soc.contagem[STATUS_SOC.EM_COBRANCA]}</div></div>
  </div>
  <section class="painel">
    <h2>Recebimento dos livros, mês a mês do ciclo</h2>
    <p class="sub">Quantos lojistas já tinham entregado ao fim de cada mês, desde a abertura em ${dataBR(c.inicio)}. Hoje: <strong>${p.percentualRecebido}%</strong> da carteira.</p>
    <div class="barras-mes" role="img" aria-label="recebimento acumulado por mês">
      ${p.porMes.map(m => `<div class="bm"><div class="bm-trilho"><div class="bm-barra" style="height:${Math.round(m.acumulado / maxMes * 100)}%"></div></div>
        <div class="bm-val">${m.acumulado}<span class="sub">${m.recebidos ? ` (+${m.recebidos})` : ''}</span></div><div class="bm-rot">${m.label}</div></div>`).join('')}
      <div class="bm meta"><div class="bm-trilho"><div class="bm-barra" style="height:${Math.round(n.total / maxMes * 100)}%"></div></div>
        <div class="bm-val">${n.total}</div><div class="bm-rot">carteira</div></div>
    </div>
  </section>
  <section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
      <h2 style="margin:0">Lojista a lojista</h2><span class="espaco"></span>
      <input id="busca-painel" placeholder="loja, LUC ou CNPJ" value="${esc(f.busca)}" size="20">
      <select id="filtro-status"><option value="">todos os status</option>
        ${Object.values(STATUS_LIVRO).map(st => `<option value="${st}" ${f.status === st ? 'selected' : ''}>${st}</option>`).join('')}</select>
      <button class="leve" id="exp-acomp">Exportar acompanhamento (CSV)</button>
      <button class="leve" id="exp-backup">Salvar cópia (JSON)</button>
      <button class="leve" id="imp-backup">Restaurar cópia</button>
      <input type="file" id="in-backup" accept=".json" hidden>
    </div>
    <div class="rolagem"><table class="tabela-painel">
      <thead><tr><th>Lojista</th><th>Status</th>
        ${MARCOS.map(m => `<th>${m.rotulo}</th>`).join('')}
        <th>Notificações</th><th class="num">Divergência</th><th class="num">Negociado</th><th class="num">Cobrado</th><th>Obs.</th></tr></thead>
      <tbody>${linhas.map(s => linhaPainel(s)).join('') || `<tr><td colspan="10" class="vazio">Nenhum lojista neste filtro.</td></tr>`}</tbody>
    </table></div>
    <p class="nota">Data em cada marco muda o status na hora; apague a data para voltar. Os marcos <em>recebido</em> e <em>auditado</em> também são
      preenchidos sozinhos quando o livro do lojista é carregado e conciliado na aba Auditoria fiscal (marcados com ✦). Valores em reais são os da negociação de cada caso.</p>
  </section>`
}

function faixaCiclo (c) {
  return `<div class="faixa-ciclo">
    <div><strong>Ciclo ${c.ano}</strong> · livros de <strong>${c.anoLivros}</strong> · aberto em ${dataBR(c.inicio)} · ${c.mesesDecorridos}º mês do ciclo</div>
    <div class="sub">A auditoria fiscal é anual e abre todo 1º de abril. A triangulação é diária ou semanal, fechada mês a mês.</div>
  </div>`
}

function linhaPainel (s) {
  const reg = s.reg || {}; const l = s.lojista; const notif = reg.notificacoes || {}; const v = reg.valores || {}
  const marco = (m) => `<td><input type="date" data-marco="${m.chave}" data-cnpj="${s.cnpj}" value="${reg[m.chave] || ''}" title="${m.rotulo}">${reg[m.chave + 'Auto'] ? ' <span title="preenchido pelo arquivo carregado">✦</span>' : ''}</td>`
  const valor = (k) => `<td class="num"><input type="number" step="0.01" min="0" data-valor="${k}" data-cnpj="${s.cnpj}" value="${v[k] ?? ''}" placeholder="0,00" style="width:110px;text-align:right"></td>`
  return `<tr class="${s.status === STATUS_LIVRO.NAO_RECEBIDO && s.multada ? 'grave' : ''}">
    <td><strong>${esc(l.nome || l.razao)}</strong><div class="sub" style="font-size:11px">${l.luc ? 'LUC ' + esc(l.luc) + ' · ' : ''}${formatarCnpj(s.cnpj)}${l.regime === 'simples' ? ' · Simples' : ''}</div></td>
    <td><span class="tag ${TAG_LIVRO[s.status]}">${s.status}</span>${s.devida ? `<div class="sub" style="font-size:11px">devida: ${s.devida.rotulo}</div>` : ''}</td>
    ${MARCOS.map(marco).join('')}
    <td>${ETAPAS.map(e => `<span class="etapa ${notif[e.chave] ? 'feita' : ''} ${e.chave === 'multa' && notif[e.chave] ? 'multa' : ''}" title="${e.rotulo}${notif[e.chave] ? ' em ' + dataBR(notif[e.chave]) : ''}">${e.curto}</span>`).join('')}</td>
    ${valor('divergencia')}${valor('negociado')}${valor('cobrado')}
    <td><input data-obs data-cnpj="${s.cnpj}" value="${esc(reg.obs || '')}" placeholder="anotação" size="18"></td>
  </tr>`
}

/* ---- aba Lojistas: a carteira ---- */

function viewLojistas (r) {
  const ls = estado.acomp.lojistas
  return `<section class="painel">
    <div class="cab"><span class="passo">1</span><div>
      <h2>Relação de lojistas do shopping</h2>
      <p class="sub">Lance a carteira uma vez; ela vale para todos os ciclos. Planilha com <code>CNPJ</code>, <code>Loja</code> e, se tiver,
        <code>LUC</code>, <code>E-mail</code>, <code>WhatsApp</code> e <code>Regime</code> — as colunas são reconhecidas pelo cabeçalho.
        CNPJ com dígito verificador errado é recusado e avisado.</p>
    </div></div>
    <div class="drop" id="drop-lojistas" tabindex="0" role="button">
      Arraste a relação de lojistas ou <strong>clique para escolher</strong>
      <div class="sub" style="margin-top:6px">XLSX · CSV</div>
    </div>
    <input type="file" id="in-lojistas" multiple accept=".xlsx,.xls,.xlsm,.csv" hidden>
    ${estado.avisoLojistas ? `<ul class="avisos">${estado.avisoLojistas.map(a => `<li class="${/^\d+ lojista/.test(a) ? 'info' : ''}">${esc(a)}</li>`).join('')}</ul>` : ''}
    <div class="ficticia-box">
      <div><strong>Quer testar antes de lançar a carteira real?</strong>
        <div class="sub">A base fictícia traz 40 lojistas inventados com o ciclo em andamento, notificações, seis meses de triangulação fechada e casos de mudança societária — em datas relativas a hoje.</div></div>
      <button class="acao" data-carregar-ficticia>Carregar base fictícia</button>
      <button class="leve" id="baixar-ficticia">Baixar a carteira fictícia (CSV)</button>
    </div>
    <p class="nota"><button class="leve" id="modelo-lojistas">Baixar modelo CSV</button>
      ${ls.length ? `<button class="leve" id="exp-lojistas" style="margin-left:6px">Exportar carteira (CSV)</button>` : ''}</p>
  </section>
  <section class="painel">
    <h2>Incluir um lojista</h2>
    <div class="opcoes" id="form-lojista">
      <label class="campo">Loja <input id="nl-nome" placeholder="nome fantasia" size="22"></label>
      <label class="campo">CNPJ <input id="nl-cnpj" placeholder="00.000.000/0000-00" size="18"></label>
      <label class="campo">LUC <input id="nl-luc" placeholder="loja" size="8"></label>
      <label class="campo">UF do contrato <select id="nl-uf"><option value="">—</option>${UFS.map(u => `<option>${u}</option>`).join('')}</select></label>
      <label class="campo">Início do contrato <input type="date" id="nl-inicio"></label>
      <label class="campo">E-mail <input id="nl-email" placeholder="contato@loja.com" size="22"></label>
      <label class="campo">WhatsApp <input id="nl-tel" placeholder="11 98888-7777" size="14"></label>
      <label class="campo">Regime <select id="nl-regime"><option value="">—</option><option value="simples">Simples Nacional</option><option value="normal">Lucro presumido / real</option></select></label>
      <label class="campo">&nbsp;<button class="acao" id="add-lojista">Incluir</button></label>
    </div>
    <p class="sub" id="erro-lojista" style="color:var(--erro);margin-top:6px"></p>
  </section>
  ${ls.length ? `<section class="painel">
    <h2>Carteira (${ls.length})</h2>
    <div class="rolagem"><table>
      <thead><tr><th>Loja</th><th>CNPJ</th><th>LUC</th><th>UF</th><th>Início do contrato</th><th>E-mail</th><th>WhatsApp</th><th>Regime</th><th>Ativo</th><th></th></tr></thead>
      <tbody>${ls.map(l => `<tr class="${l.ativo === false ? 'inativo' : ''}">
        <td><input data-loj="nome" data-cnpj="${l.cnpj}" value="${esc(l.nome)}" size="22"><div class="sub" style="font-size:11px">${esc(l.razao)}</div></td>
        <td>${formatarCnpj(l.cnpj)}</td>
        <td><input data-loj="luc" data-cnpj="${l.cnpj}" value="${esc(l.luc)}" size="6"></td>
        <td><select data-loj="uf" data-cnpj="${l.cnpj}"><option value="">—</option>${UFS.map(u => `<option ${l.uf === u ? 'selected' : ''}>${u}</option>`).join('')}</select></td>
        <td><input type="date" data-loj="inicioContrato" data-cnpj="${l.cnpj}" value="${esc(l.inicioContrato || '')}"></td>
        <td><input data-loj="email" data-cnpj="${l.cnpj}" value="${esc(l.email)}" size="22"></td>
        <td><input data-loj="telefone" data-cnpj="${l.cnpj}" value="${esc(l.telefone)}" size="13"></td>
        <td><select data-loj="regime" data-cnpj="${l.cnpj}"><option value="" ${!l.regime ? 'selected' : ''}>—</option>
          <option value="simples" ${l.regime === 'simples' ? 'selected' : ''}>Simples</option><option value="normal" ${l.regime === 'normal' ? 'selected' : ''}>Normal</option></select></td>
        <td><input type="checkbox" data-loj="ativo" data-cnpj="${l.cnpj}" ${l.ativo !== false ? 'checked' : ''} style="min-width:auto"></td>
        <td><button class="icone" data-remover-lojista="${l.cnpj}" title="Remover da carteira">✕</button></td>
      </tr>`).join('')}</tbody>
    </table></div>
    <p class="nota">Lojista inativo (loja fechada, contrato encerrado) sai do painel e das notificações sem perder o histórico.</p>
  </section>` : ''}`
}

/* ---- aba Notificações: o fluxo mensal para quem não entregou ---- */

function viewNotificacoes (r) {
  const p = r.painel; const c = p.ciclo; const prefs = estado.acomp.prefs
  const semLivro = p.situacoes.filter(s => !s.recebido)
  const porEtapa = ETAPAS.map(e => ({ etapa: e, lista: p.pendentes.filter(s => s.devida.chave === e.chave) }))
  return `${faixaCiclo(c)}
  <section class="painel">
    <h2>Como funciona o fluxo</h2>
    <p class="sub">Uma etapa por mês, contada a partir da abertura do ciclo em ${dataBR(c.inicio)}, para todo lojista que ainda não entregou os livros:
      ${ETAPAS.map((e, i) => `<strong>${e.rotulo}</strong> no ${e.mes}º mês${i < ETAPAS.length - 1 ? ', ' : '.'}`).join('')}
      Registrar uma etapa marca a data; o texto sai pronto para e-mail ou WhatsApp. Quem entrega sai do fluxo na hora.</p>
    <details class="cfops"><summary>Textos e prazos (personalize uma vez)</summary>
      <div class="opcoes" style="margin-top:8px">
        <label class="campo">Nome do shopping <input data-pref-notif="shopping" value="${esc(prefs.shopping || '')}" placeholder="o Shopping Exemplo" size="24"></label>
        <label class="campo">Prazo em cada notificação (dias) <input type="number" min="1" data-pref-notif="prazoDias" value="${prefs.prazoDias || 10}" style="width:80px"></label>
        <label class="campo">Assinatura <input data-pref-notif="assinatura" value="${esc(prefs.assinatura || '')}" placeholder="Equipe de Auditoria de Vendas" size="28"></label>
        <label class="campo" style="flex:1 1 100%">Cláusula de multa (como está no contrato)
          <input data-pref-notif="clausulaMulta" value="${esc(prefs.clausulaMulta || '')}" placeholder="a multa de X% do aluguel mínimo prevista na cláusula N" style="width:100%"></label>
      </div>
    </details>
  </section>
  ${!estado.acomp.lojistas.length ? `<div class="painel vazio">Sem carteira não há quem notificar. Lance os lojistas na aba <strong>Lojistas</strong>.</div>`
  : !p.pendentes.length ? `<div class="painel vazio">Nenhuma notificação devida neste mês${semLivro.length ? ` — ${semLivro.length} lojista(s) sem livro, todos em dia no fluxo` : ' — todos os lojistas entregaram'}.</div>`
  : porEtapa.filter(g => g.lista.length).map(g => `<section class="painel">
    <h2>${g.etapa.rotulo} — ${g.lista.length} lojista(s)</h2>
    ${g.lista.map(s => cartaoNotificacao(s, g.etapa, c)).join('')}
  </section>`).join('')}
  ${r.soc.pendentes.length ? `<section class="painel">
    <h2>Taxa de transferência — ${r.soc.pendentes.length} notificação(ões) devida(s)</h2>
    <p class="sub">Mesma régua, contada da data em que o time confirmou a cobrança na aba <strong>Societário</strong>.</p>
    ${r.soc.pendentes.map(x => cartaoNotificacao(x, x.devida, c, 'taxa')).join('')}
  </section>` : ''}
  ${semLivro.length ? `<section class="painel">
    <h2>Quem ainda não entregou (${semLivro.length})</h2>
    <div class="rolagem"><table>
      <thead><tr><th>Lojista</th>${ETAPAS.map(e => `<th>${e.rotulo}</th>`).join('')}<th>Situação</th></tr></thead>
      <tbody>${semLivro.map(s => { const n = (s.reg && s.reg.notificacoes) || {}; return `<tr class="${s.multada ? 'grave' : ''}">
        <td><strong>${esc(s.lojista.nome || s.lojista.razao)}</strong><div class="sub" style="font-size:11px">${s.lojista.luc ? 'LUC ' + esc(s.lojista.luc) + ' · ' : ''}${formatarCnpj(s.cnpj)}</div></td>
        ${ETAPAS.map(e => `<td>${n[e.chave] ? dataBR(n[e.chave]) : '<span class="sub">—</span>'}</td>`).join('')}
        <td>${s.multada ? '<span class="tag erro">MULTADO</span>' : s.devida ? `<span class="tag atencao">${s.atrasadas > 1 ? s.atrasadas + ' etapas acumuladas' : 'etapa do mês pendente'}</span>` : '<span class="tag ok">em dia</span>'}</td>
      </tr>` }).join('')}</tbody>
    </table></div>
  </section>` : ''}`
}

function cartaoNotificacao (s, etapa, c, processo = 'fiscal') {
  const l = s.lojista
  const id = `${s.cnpj}|${etapa.chave}|${processo}`
  const aberto = estado.textoAberto === id
  const t = processo === 'taxa' ? textoTaxa(etapa.chave, l, s.reg, estado.acomp.prefs) : textoNotificacao(etapa.chave, l, c, estado.acomp.prefs)
  const ehMulta = etapa.chave === 'multa'
  const rotulo = processo === 'taxa' ? rotuloEtapaTaxa(etapa) : etapa.rotulo
  return `<div class="arquivo notif ${ehMulta ? 'multa' : ''}">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <div style="flex:1;min-width:200px"><div class="nome">${esc(l.nome || l.razao)}</div>
        <div class="meta">${l.luc ? 'LUC ' + esc(l.luc) + ' · ' : ''}${formatarCnpj(s.cnpj)}${l.email ? ' · ' + esc(l.email) : ' · <span class="tag atencao">sem e-mail</span>'}
          ${s.atrasadas > 1 ? ` · <span class="tag erro">${s.atrasadas} etapas acumuladas</span>` : ''}</div></div>
      ${processo === 'taxa' ? '<span class="tag neutro">taxa de transferência</span>' : ''}
      <button class="leve" data-ver-texto="${id}">${aberto ? 'Fechar texto' : 'Ver texto'}</button>
      ${l.email ? `<a class="leve botao" href="${t.mailto}" target="_blank" rel="noopener">E-mail</a>` : ''}
      ${t.whatsapp ? `<a class="leve botao" href="${t.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>` : ''}
      <button class="${ehMulta ? 'acao perigo' : 'acao'}" data-registrar="${id}">${ehMulta ? (processo === 'taxa' ? 'Lançar taxa' : 'Enviar multa') : 'Registrar ' + rotulo.toLowerCase()}</button>
    </div>
    ${aberto ? `<div class="texto-notif"><div><strong>Assunto:</strong> ${esc(t.assunto)}</div><pre>${esc(t.corpo)}</pre>
      <button class="leve" data-copiar="${id}">Copiar texto</button></div>` : ''}
  </div>`
}

/* ---- aba Societário: mudança societária e taxa de transferência ---- */

const TAG_SOC = {
  [STATUS_SOC.NAO_CONSULTADO]: 'neutro', [STATUS_SOC.SEM_INDICIO]: 'ok', [STATUS_SOC.ANTERIOR_CONTRATO]: 'neutro', [STATUS_SOC.OUTRA_ALTERACAO]: 'neutro', [STATUS_SOC.FALTA_DATA]: 'atencao',
  [STATUS_SOC.SEM_MUDANCA]: 'ok', [STATUS_SOC.MUDANCA_ANTIGA]: 'neutro',
  [STATUS_SOC.SINALIZADO]: 'erro', [STATUS_SOC.ISENTO]: 'ok', [STATUS_SOC.EM_COBRANCA]: 'atencao',
  [STATUS_SOC.NEGOCIADO]: 'atencao', [STATUS_SOC.COBRADO]: 'ok',
}

function viewSocietario (r) {
  const s = r.soc; const n = s.contagem; const prefs = estado.acomp.prefs
  if (!estado.acomp.lojistas.length) {
    return `<div class="painel vazio">Lance a carteira na aba <strong>Lojistas</strong> — com a UF do contrato de cada loja — para pesquisar a Junta Comercial e acompanhar a taxa de transferência.</div>`
  }
  const semUf = estado.acomp.lojistas.filter(l => l.ativo !== false && !l.uf).length
  return `<section class="painel">
    <div class="cab"><span class="passo">§</span><div>
      <h2>Mudança societária nos últimos 12 meses</h2>
      <p class="sub">Loja que muda de mãos — cessão de quotas, novo controle, incorporação — costuma dever a <strong>taxa de transferência</strong> do contrato.
        A ferramenta não consulta a Junta sozinha (cada estado tem portal próprio, sem API): o botão abre a Junta do estado do contrato com o
        CNPJ copiado; você registra o que encontrou; o sistema sinaliza a mudança recente, pede a validação de isenção e limite contratual e,
        confirmada a cobrança, roda o mesmo fluxo de notificação e negociação da auditoria fiscal com os textos da taxa.</p>
    </div></div>
    <div class="grade2" style="margin-top:4px">
      <div class="racional">
        <h3>Possíveis causas de TT</h3>
        <ul>${CAUSAS_TT.map(([, t]) => `<li>${t}</li>`).join('')}</ul>
        <p class="sub">Qualquer uma delas, registrada <strong>depois do início do contrato</strong> e nos <strong>últimos 12 meses</strong>, sinaliza o lojista.
          "Outra alteração" não sinaliza.</p>
      </div>
      <div class="racional">
        <h3>Pontos de atenção</h3>
        <ul>${PONTOS_ATENCAO.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>
    </div>
    <details class="cfops guia-junta"><summary>Passo a passo no portal da Junta — Certidão de Inteiro Teor</summary>
      <p class="sub" style="margin:8px 0">Quando usar: ${MOTIVOS_PESQUISA.map(m => m[1].toLowerCase()).join('; ')}. Os nomes dos menus e da guia variam conforme a Junta de cada estado.</p>
      <div class="grade-dash">${PASSOS_JUNTA.map((e, k) => `<div class="racional">
        <h3>${esc(e.etapa)} ${e.paga ? '<span class="tag atencao">paga</span>' : '<span class="tag ok">gratuita</span>'}</h3>
        <ol start="${PASSOS_JUNTA.slice(0, k).reduce((a, x) => a + x.passos.length, 0) + 1}">${e.passos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
        ${e.nota ? `<p class="sub" style="margin-top:6px">${esc(e.nota)}</p>` : ''}
      </div>`).join('')}</div>
    </details>
    ${semUf ? `<ul class="avisos"><li>${semUf} lojista(s) sem UF do contrato — sem UF não há Junta para abrir. Preencha na coluna UF abaixo ou na aba Lojistas.</li></ul>` : ''}
    ${s.semInicioContrato.length ? `<ul class="avisos"><li>${s.semInicioContrato.length} lojista(s) sem <strong>data de início do contrato</strong> — sem ela a ferramenta não separa alteração anterior ao contrato (não é TT) de posterior. Preencha no cartão ou na aba Lojistas.</li></ul>` : ''}
    <details class="cfops"><summary>Cláusula da taxa (personalize uma vez)</summary>
      <div class="opcoes" style="margin-top:8px">
        <label class="campo" style="flex:1 1 100%">Cláusula de taxa de transferência (como está no contrato)
          <input data-pref-notif="clausulaTaxa" value="${esc(prefs.clausulaTaxa || '')}" placeholder="a taxa de transferência de N aluguéis mínimos prevista na cláusula X" style="width:100%"></label>
      </div>
    </details>
  </section>
  <div class="cards">
    <div class="card"><div class="rot">Não consultados</div><div class="val">${n[STATUS_SOC.NAO_CONSULTADO]}</div></div>
    <div class="card ok"><div class="rot">Sem indício / sem mudança</div><div class="val">${n[STATUS_SOC.SEM_INDICIO] + n[STATUS_SOC.SEM_MUDANCA]}</div></div>
    <div class="card ${s.guiasAPagar.length ? 'atencao' : ''}"><div class="rot">Guias a pagar</div><div class="val">${s.guiasAPagar.length}</div></div>
    <div class="card ${s.aguardandoDownload.length ? 'atencao' : ''}"><div class="rot">Certidão a baixar</div><div class="val">${s.aguardandoDownload.length}</div></div>
    <div class="card"><div class="rot">Checklist completo</div><div class="val">${s.checklistCompleto.length}</div></div>
    <div class="card"><div class="rot">Anterior ao contrato</div><div class="val">${n[STATUS_SOC.ANTERIOR_CONTRATO]}</div></div>
    <div class="card ${s.aValidar.length ? 'erro' : ''}"><div class="rot">Sinalizados a validar</div><div class="val">${s.aValidar.length}</div></div>
    <div class="card"><div class="rot">Isentos</div><div class="val">${n[STATUS_SOC.ISENTO]}</div></div>
    <div class="card ${n[STATUS_SOC.EM_COBRANCA] ? 'atencao' : ''}"><div class="rot">Taxa em cobrança</div><div class="val">${n[STATUS_SOC.EM_COBRANCA]}</div></div>
    <div class="card"><div class="rot">Negociados</div><div class="val">${n[STATUS_SOC.NEGOCIADO]}</div></div>
    <div class="card ok"><div class="rot">Cobrados</div><div class="val">${n[STATUS_SOC.COBRADO]}</div></div>
    <div class="card ${s.pendentes.length ? 'atencao' : ''}"><div class="rot">Notificações devidas</div><div class="val">${s.pendentes.length}</div></div>
  </div>
  ${s.pendentes.length ? `<section class="painel">
    <h2>Notificações da taxa devidas agora (${s.pendentes.length})</h2>
    <p class="sub">Mesma régua da auditoria fiscal, contada da data da validação: 1ª, 2ª e 3ª notificação, aviso de cobrança e lançamento da taxa.</p>
    ${s.pendentes.map(x => cartaoNotificacao(x, x.devida, ciclo(), 'taxa')).join('')}
  </section>` : ''}
  <section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
      <h2 style="margin:0">Lojista a lojista</h2><span class="espaco"></span>
      <button class="leve" id="exp-soc">Exportar societário (CSV)</button>
    </div>
    ${s.situacoes.map(cartaoSocietario).join('')}
    <p class="nota">Os endereços das Juntas marcados com <em>(verificar)</em> são os conhecidos do órgão, não confirmados em fonte oficial em 14/10/2026 — se o
      portal tiver mudado, use <em>Buscar</em>. A consulta federal da Receita mostra o quadro de sócios e administradores (QSA) de qualquer CNPJ.</p>
  </section>`
}

function cartaoSocietario (s) {
  const l = s.lojista; const reg = s.reg; const n = reg.notificacoes || {}; const v = reg.valores || {}
  const links = linksPesquisa(l)
  const campo = (rot, html) => `<label class="campo">${rot}${html}</label>`
  const data = (chave, valor) => `<input type="date" data-soc="${chave}" data-cnpj="${s.cnpj}" value="${valor || ''}">`
  const num = (chave, valor) => `<input type="number" step="0.01" min="0" data-soc-valor="${chave}" data-cnpj="${s.cnpj}" value="${valor ?? ''}" placeholder="0,00" style="width:120px;text-align:right">`
  return `<div class="arquivo soc ${s.recente ? 'sinal' : ''}">
    <div style="display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap">
      <div style="flex:1;min-width:220px">
        <div class="nome">${esc(l.nome || l.razao)} <span class="tag ${TAG_SOC[s.status]}">${s.status}</span></div>
        <div class="meta">${l.luc ? 'LUC ' + esc(l.luc) + ' · ' : ''}${formatarCnpj(s.cnpj)}${l.razao ? ' · ' + esc(l.razao) : ''}</div>
      </div>
      <label class="campo">Início do contrato${!l.inicioContrato ? ' <span class="tag atencao">falta</span>' : ''}
        <input type="date" data-loj="inicioContrato" data-cnpj="${s.cnpj}" value="${esc(l.inicioContrato || '')}" title="só alterações a partir desta data interessam">
      </label>
      <label class="campo">UF do contrato
        <select data-loj="uf" data-cnpj="${s.cnpj}"><option value="">—</option>${UFS.map(u => `<option ${l.uf === u ? 'selected' : ''}>${u}</option>`).join('')}</select>
      </label>
      <div class="campo" style="gap:5px">Pesquisar
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${links.junta ? `<a class="leve botao" href="${links.junta.url}" target="_blank" rel="noopener" data-abrir="${s.cnpj}" title="${esc(links.junta.nome)}${links.junta.verificado ? '' : ' — endereço a verificar'}">${links.junta.sigla}${links.junta.verificado ? '' : ' (verificar)'}</a>`
            : '<span class="tag atencao">informe a UF</span>'}
          <a class="leve botao" href="${links.busca}" target="_blank" rel="noopener" data-abrir="${s.cnpj}">Buscar</a>
          <a class="leve botao" href="${links.receita}" target="_blank" rel="noopener" data-abrir="${s.cnpj}">Receita (QSA)</a>
        </div>
      </div>
    </div>
    <div class="opcoes" style="margin-top:10px">
      ${campo('Motivo do levantamento', `<select data-soc="motivo" data-cnpj="${s.cnpj}"><option value="">—</option>${MOTIVOS_PESQUISA.map(([k, t]) => `<option value="${k}" ${reg.motivo === k ? 'selected' : ''}>${t}</option>`).join('')}</select>`)}
      ${campo('NIRE', `<input data-soc="nire" data-cnpj="${s.cnpj}" value="${esc(reg.nire || '')}" placeholder="nº na Junta" size="13">`)}
      <label class="campo check"><span><input type="checkbox" data-soc-check="nireConfirmado" data-cnpj="${s.cnpj}" ${reg.nireConfirmado ? 'checked' : ''}> CNPJ / NIRE confirmado</span></label>
      <label class="campo check"><span><input type="checkbox" data-soc-check="atosListados" data-cnpj="${s.cnpj}" ${reg.atosListados ? 'checked' : ''}> Atos posteriores ao contrato listados</span></label>
    </div>
    <div class="opcoes" style="margin-top:8px">
      ${campo('1. Triagem (gratuita): indício de TT?', `<select data-soc="indicio" data-cnpj="${s.cnpj}">
        <option value="" ${!reg.indicio ? 'selected' : ''}>—</option>
        <option value="nao" ${reg.indicio === 'nao' ? 'selected' : ''}>Não — sem indício</option>
        <option value="sim" ${reg.indicio === 'sim' ? 'selected' : ''}>Sim — pedir certidão (guia)</option></select>`)}
      ${reg.indicio === 'sim' ? `${campo('2. Protocolo da solicitação', `<input data-soc="protocolo" data-cnpj="${s.cnpj}" value="${esc(reg.protocolo || reg.guiaNumero || '')}" size="14">`)}
        ${campo('Guia paga em', data('guiaPagaEm', reg.guiaPagaEm))}
        ${reg.guiaPagaEm ? campo('3. Certidão baixada em', data('certidaoBaixadaEm', reg.certidaoBaixadaEm)) : ''}` : ''}
    </div>
    <div class="opcoes" style="margin-top:8px">
      ${campo('3. Houve mudança a partir do início do contrato?', `<select data-soc="houveMudanca" data-cnpj="${s.cnpj}">
        <option value="" ${reg.houveMudanca == null ? 'selected' : ''}>— não consultado —</option>
        <option value="nao" ${reg.houveMudanca === false ? 'selected' : ''}>Não</option>
        <option value="sim" ${reg.houveMudanca === true ? 'selected' : ''}>Sim</option></select>`)}
      ${campo('Consultado em', data('consultadoEm', reg.consultadoEm))}
      ${reg.houveMudanca === true ? `
        ${campo('Data da alteração', data('dataMudanca', reg.dataMudanca))}
        ${campo('Causa', `<select data-soc="tipo" data-cnpj="${s.cnpj}"><option value="">—</option>${TIPOS_MUDANCA.map(([k, t]) => `<option value="${k}" ${normalizarTipo(reg.tipo) === k ? 'selected' : ''}>${t}</option>`).join('')}</select>`)}
        ${campo('Nº do registro / protocolo', `<input data-soc="registro" data-cnpj="${s.cnpj}" value="${esc(reg.registro || '')}" size="14">`)}
        ${campo('O que mudou (resumo)', `<input data-soc="descricao" data-cnpj="${s.cnpj}" value="${esc(reg.descricao || '')}" placeholder="ex.: saída do sócio A, entrada de B com 60%" size="34">`)}` : ''}
    </div>
    ${s.checklist.gatilho ? `<div class="opcoes" style="margin-top:8px">${campo('Encaminhado para cobrança / jurídico em', data('encaminhadoEm', reg.encaminhadoEm))}</div>` : ''}
    <div class="checklist-tt">
      <span class="sub">Checklist <b>${s.checklist.feitos}/${s.checklist.total}</b></span>
      ${s.checklist.itens.map(i => `<span class="item-check ${i.naoAplica ? 'na' : i.feito ? 'feito' : ''}" title="${i.naoAplica ? 'não se aplica: sem gatilho de TT' : i.feito ? 'feito' : 'pendente'}">${i.naoAplica ? '–' : i.feito ? '✓' : '○'} ${esc(i.rotulo)}</span>`).join('')}
    </div>
    ${s.status === STATUS_SOC.ANTERIOR_CONTRATO ? `<p class="nota">Alteração em ${dataBR(reg.dataMudanca)}, <strong>antes</strong> do início do contrato (${dataBR(l.inicioContrato)}): não caracteriza TT.</p>` : ''}
    ${s.recente ? `<div class="validacao ${reg.validadoEm ? 'feita' : ''}">
      <div class="sub" style="margin-bottom:6px"><strong>Sinalizado:</strong> alteração em ${dataBR(reg.dataMudanca)}, dentro dos últimos 12 meses${l.inicioContrato ? ` e depois do início do contrato (${dataBR(l.inicioContrato)})` : ''}.
        ${reg.validadoEm ? `Validado pelo time em ${dataBR(reg.validadoEm)}: ${reg.isencao === 'sim' ? 'isento de taxa' : 'taxa devida'}.` : 'Validação do time pendente.'}</div>
      <div class="opcoes">
        ${campo('Há isenção de taxa no contrato?', `<select data-soc="isencao" data-cnpj="${s.cnpj}"><option value="" ${!reg.isencao ? 'selected' : ''}>—</option>
          <option value="nao" ${reg.isencao === 'nao' ? 'selected' : ''}>Não — taxa devida</option><option value="sim" ${reg.isencao === 'sim' ? 'selected' : ''}>Sim — isento</option></select>`)}
        ${campo('Limite contratual (conferência)', `<input data-soc="limite" data-cnpj="${s.cnpj}" value="${esc(reg.limite || '')}" placeholder="ex.: até 25% das quotas entre sócios atuais" size="36">`)}
        ${campo('Taxa prevista (R$)', num('taxa', v.taxa))}
        ${!reg.validadoEm ? `<label class="campo">&nbsp;<span style="display:flex;gap:6px">
          <button class="acao" data-soc-acao="cobrar" data-cnpj="${s.cnpj}" ${reg.isencao !== 'nao' ? 'disabled title="marque Não há isenção"' : ''}>Confirmar cobrança</button>
          <button class="leve" data-soc-acao="isentar" data-cnpj="${s.cnpj}" ${reg.isencao !== 'sim' ? 'disabled title="marque Sim, isento"' : ''}>Confirmar isenção</button></span></label>`
          : `<label class="campo">&nbsp;<button class="leve" data-soc-acao="reabrir" data-cnpj="${s.cnpj}">Reabrir validação</button></label>`}
      </div>
      ${s.emCobranca ? `<div class="opcoes" style="margin-top:8px">
        <div class="campo">Notificações<div>${ETAPAS.map(e => `<span class="etapa ${n[e.chave] ? 'feita' : ''} ${e.chave === 'multa' && n[e.chave] ? 'multa' : ''}" title="${rotuloEtapaTaxa(e)}${n[e.chave] ? ' em ' + dataBR(n[e.chave]) : ''}">${e.chave === 'multa' ? 'lançada' : e.chave === 'aviso' ? 'aviso' : e.curto}</span>`).join('')}</div></div>
        ${campo('Negociado em', data('negociado', reg.negociado))}${campo('Negociado (R$)', num('negociado', v.negociado))}
        ${campo('Cobrado em', data('cobrado', reg.cobrado))}${campo('Cobrado (R$)', num('cobrado', v.cobrado))}
        ${campo('Obs.', `<input data-soc="obs" data-cnpj="${s.cnpj}" value="${esc(reg.obs || '')}" size="24">`)}
      </div>` : ''}
    </div>` : ''}
  </div>`
}

/* ---- aba Tabela de códigos ---- */

function viewTabela () {
  const linhas = listarCfops()
  const usados = new Set(estado.livros.flatMap(l => ((l.resultado && l.resultado.lancamentos) || []).map(x => x.cfop && String(x.cfop).replace(/\D/g, ''))))
  return `<section class="painel">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <h2 style="margin:0">Tabela de códigos fiscais</h2><span class="espaco"></span>
      <input id="busca-cfop" placeholder="filtrar por código ou texto" size="26">
      <label class="campo" style="flex-direction:row;align-items:center;gap:5px">
        <input type="checkbox" id="so-usados" style="min-width:auto"> só os usados nos arquivos</label>
      ${Object.keys(estado.prefs.overrides).length ? `<button class="leve" id="limpar-overrides">Limpar ${Object.keys(estado.prefs.overrides).length} regra(s) minha(s)</button>` : ''}
    </div>
    <p class="sub" style="margin-top:6px">Base: Convênio S/Nº de 15/12/1970, Anexo (tabela CFOP), na redação do Ajuste SINIEF 07/01 e alterações.
      O <em>tratamento</em> é a regra deste sistema — você pode mudá-la e o cálculo refaz na hora.</p>
    <div class="rolagem"><table id="tab-cfop">
      <thead><tr><th>CFOP</th><th>Sentido</th><th>Descrição</th><th>Tratamento</th></tr></thead>
      <tbody>${linhas.map(c => `
        <tr data-cfop="${c.cfop}" data-usado="${usados.has(c.cfop) ? 1 : 0}"
            data-busca="${esc((c.cfop + ' ' + c.descricao).toLowerCase())}">
          <td><code>${c.cfop}</code>${usados.has(c.cfop) ? ' <span class="tag ok">em uso</span>' : ''}</td>
          <td>${c.sentido === 'saida' ? 'saída' : 'entrada'}</td>
          <td style="white-space:normal">${esc(c.descricao)}</td>
          <td><select data-override="${c.cfop}">
            ${Object.keys(NATUREZA).map(n => `<option value="${n}" ${natAtual(c) === n ? 'selected' : ''}>${esc(NATUREZA_LABEL[n])}</option>`).join('')}
          </select>${estado.prefs.overrides[c.cfop] ? ' <span class="tag atencao">alterado</span>' : ''}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </section>`
}

function natAtual (c) {
  const ov = estado.prefs.overrides[c.cfop]
  return ov ? ov.natureza : c.natureza
}

/* ---- aba Ajuda ---- */

function viewAjuda () {
  return `<section class="painel" id="painel-video" style="position:absolute;left:-99999px;top:0">
    <h2>Vídeos: o passo a passo</h2>
    <p class="sub">Com dados fictícios e legendas na tela. Um no computador, sem áudio, do carregamento dos arquivos à leitura
      das divergências; o passo a passo completo no celular, narrado, passando por todas as abas; e um curto, também narrado,
      só com as novidades mais recentes.</p>
    <div class="videos">
      <figure data-video>
        <video controls preload="metadata" playsinline>
          <source src="apurador-fiscal-passo-a-passo.webm" type="video/webm">
          <source src="apurador-fiscal-passo-a-passo.mp4" type="video/mp4">
        </video>
        <figcaption>No computador · 3min42</figcaption>
      </figure>
      <figure data-video class="vertical">
        <video controls preload="metadata" playsinline>
          <source src="apurador-fiscal-celular.mp4" type="video/mp4">
        </video>
        <figcaption>No celular · da ficha do lojista ao cruzamento final</figcaption>
      </figure>
      <figure data-video class="vertical">
        <video controls preload="metadata" playsinline>
          <source src="radar-novidades.mp4" type="video/mp4">
        </video>
        <figcaption>Novidades · triangulação com NAPP, maior valor e leitura em R$</figcaption>
      </figure>
    </div>
  </section>
  <section class="painel">
    <h2>O que este sistema faz</h2>
    <p class="sub">Acelera a auditoria de vendas dos lojistas de um shopping em duas cadências que não se misturam:
      a <strong>triangulação</strong>, que entra dia a dia ou semana a semana e fecha por mês, e a <strong>auditoria fiscal</strong>,
      que é anual e abre todo 1º de abril sobre os livros do ano anterior. O <strong>Painel</strong> acompanha, lojista a lojista,
      o recebimento dos livros, a auditoria, a negociação e a cobrança; as <strong>Notificações</strong> cuidam de quem não entregou; a aba <strong>Societário</strong> acompanha mudança societária e a taxa de transferência.</p>
    <h3 style="margin-top:18px">As abas, na ordem do trabalho</h3>
    <ul class="nota" style="font-size:14px;padding-left:20px">
      <li><strong>Lojistas</strong> — a carteira do shopping, lançada uma vez (planilha ou um a um) e válida para todos os ciclos.
        CNPJ com dígito verificador errado é recusado. Loja fechada vira <em>inativa</em> e sai do painel sem perder histórico.</li>
      <li><strong>Painel</strong> — o ciclo em vigor: quantos entregaram os livros, mês a mês desde abril, e o status de cada um
        (<em>não recebido → recebido → auditado → negociado → cobrado</em>). A data de cada marco é editável; <em>recebido</em> e <em>auditado</em>
        também são preenchidos sozinhos quando o livro do lojista é carregado e conciliado. Valores de divergência, negociado e cobrado
        ficam na linha do lojista.</li>
      <li><strong>Notificações</strong> — para quem ainda não entregou, uma etapa por mês contada da abertura do ciclo:
        1ª, 2ª e 3ª notificação, aviso de multa e o comando de enviar a multa. Cada etapa tem o texto pronto (e-mail, WhatsApp ou copiar)
        e o botão que registra a data. Quem entrega sai do fluxo na hora. A página não envia nada sozinha: ela abre o seu e-mail ou WhatsApp
        com o texto e guarda a data quando você confirma.</li>
      <li><strong>Triangulação</strong> — redução Z e relatório de PDV entram <strong>só em PDF ou foto</strong>, como saem da loja,
        conforme chegam. Ao fim do mês, <em>Fechar mês</em> grava o resultado no histórico. É o histórico que o cruzamento final usa.</li>
      <li><strong>Auditoria fiscal</strong> — o anual: livros de Entradas e Saídas (ou extrato do Simples) e a ficha de vendas informadas,
        a conciliação por CNPJ e competência e o detalhe por CFOP.</li>
    </ul>
    <h3 style="margin-top:18px">A aba Societário: mudança societária e taxa de transferência</h3>
    <p class="nota" style="font-size:14px">Loja que muda de mãos costuma dever a <strong>taxa de transferência</strong> do contrato. A ferramenta não
      consulta a Junta Comercial sozinha — cada estado tem portal próprio, sem API pública —, então o trabalho é dividido: o botão abre a Junta
      do <strong>estado do contrato</strong> (a UF da loja) com o CNPJ já copiado, mais a busca de apoio e a consulta federal da Receita (quadro
      de sócios); você registra o que encontrou. O racional do time: <strong>possíveis causas de TT</strong> — alteração de capital social,
      alteração de sócio/administrador, entrada/saída de sócio/administrador, alteração de objeto social; <strong>triagem primeiro</strong> —
      levante todas as lojas de graça (QSA, listagem de atos) e pague a guia da certidão só das que possam caracterizar TT; e <strong>a data de
      início do contrato</strong> — só alterações a partir dela interessam, alteração anterior não é TT. Com causa de TT registrada depois do
      início do contrato e nos <strong>últimos 12 meses</strong> o lojista fica <strong>sinalizado</strong> e aparece o bloco de validação do time: há isenção no contrato? qual o limite contratual para
      conferência? taxa prevista? <em>Confirmar cobrança</em> abre, a partir daquele dia, o mesmo fluxo de cinco etapas da auditoria fiscal
      (1ª, 2ª e 3ª notificação, aviso de cobrança, lançamento da taxa) com os textos adaptados à taxa, e os marcos negociado e cobrado.
      <em>Confirmar isenção</em> encerra o caso. Endereços de Junta marcados como <em>(verificar)</em> não foram confirmados em fonte oficial.</p>
    <h3 style="margin-top:18px">O que fica guardado, e onde</h3>
    <p class="nota" style="font-size:14px">A carteira, os marcos de cada ciclo, as notificações registradas, os textos personalizados e os fechamentos mensais
      ficam no <code>localStorage</code> <strong>deste navegador</strong>. Isso significa: outro computador não vê o mesmo painel.
      Para o time trabalhar junto, use <em>Salvar cópia (JSON)</em> no Painel e <em>Restaurar cópia</em> no outro aparelho — ou combine
      um aparelho como o oficial. Os arquivos fiscais (livros, Z, PDV, ficha) continuam só em memória: fechou a aba, sumiram.</p>
    <h3 style="margin-top:18px">A conta da auditoria fiscal</h3>
    <p class="nota" style="font-size:14px">
      <strong>Vendas brutas</strong> = soma dos CFOP de venda no livro de <strong>saídas</strong> (x.101, x.102, x.103…, x.401 a x.405, energia, transporte e comunicação).<br>
      <strong>(−) Devoluções de venda</strong> = CFOP x.201 a x.207, x.410, x.411 e devoluções de exportação, lançados no livro de <strong>entradas</strong>.<br>
      <strong>= Vendas líquidas</strong>, que é o número comparado com a planilha.
    </p>
    <h3 style="margin-top:18px">O que fica de fora, de propósito</h3>
    <ul class="nota" style="font-size:14px;padding-left:20px">
      <li><strong>Remessas e transferências</strong> (x.151/x.152, x.9xx): saem mercadorias, mas não há venda.</li>
      <li><strong>Bonificação, doação, brinde e amostra</strong> (x.910, x.911): saída sem receita.</li>
      <li><strong>Baixa de estoque</strong> por perda, roubo ou deterioração (x.927).</li>
      <li><strong>Contra-lançamentos</strong> (x.922 de faturamento antecipado e x.929 de ECF/SAT): são o espelho de uma operação já registrada. Somá-los dobraria a venda.</li>
      <li><strong>Venda de ativo imobilizado</strong> (x.551): é receita, mas não é venda de mercadoria — fica em coluna separada.</li>
      <li><strong>Serviço tributado pelo ISS</strong> (x.933): fora do ICMS.</li>
      <li><strong>CFOP genérico x.949</strong>: fica de fora e vira alerta, porque só quem conhece a operação sabe dizer se é venda.</li>
      <li><strong>Documentos cancelados</strong>: descartados no SPED (COD_SIT 02 a 05) e no livro impresso quando a linha está marcada como cancelada.</li>
    </ul>
    <h3 style="margin-top:18px">Formatos que ele lê</h3>
    <ul class="nota" style="font-size:14px;padding-left:20px">
      <li><strong>SPED EFD ICMS/IPI (.txt)</strong> — o mais confiável. Usa os registros 0000, C100/C190, C400/C490, C800/C850, C500/C590, D100/D190 e D500/D590.</li>
      <li><strong>PDF do livro impresso</strong> (modelo P1/P2) — usa o "Resumo mensal de operações por código fiscal" de cada mês e confere contra a soma das linhas de detalhe.</li>
      <li><strong>PDF/relatório de resumo por CST e CFOP</strong> — descobre a ordem das colunas pela conta <em>base × alíquota = ICMS</em>.</li>
      <li><strong>Excel e CSV</strong> — reconhece as colunas pelo cabeçalho, com correção manual.</li>
      <li><strong>Foto (PNG/JPG)</strong> — passa por OCR. Precisa de internet e <mark>o resultado tem que ser conferido</mark>: número lido errado vira divergência falsa.</li>
    </ul>
    <h3 style="margin-top:18px">A aba Triangulação</h3>
    <p class="nota" style="font-size:14px">A conciliação da auditoria compara <strong>duas</strong> fontes, e as duas podem estar erradas juntas:
      se uma venda nunca virou documento, ela não está no livro nem na planilha. A triangulação existe para atacar isso.
      Ela põe lado a lado quatro tipos de lançamento da mesma venda — a <strong>redução Z</strong> do equipamento fiscal,
      o <strong>relatório do PDV</strong> (registro de gestão, não fiscal), o <strong>NAPP</strong> (planilha diária, ligada pelo número
      da loja quando não traz CNPJ) e o <strong>declarado</strong>. Onde eles não batem, a <em>direção</em> da diferença é a informação:</p>
    <ul class="nota" style="font-size:14px;padding-left:20px">
      <li><strong>PDV maior que a redução Z</strong> — venda que o caixa registrou e o equipamento fiscal não. É o alerta mais sério da aba.</li>
      <li><strong>Redução Z maior que o PDV</strong> — pode ser relatório de PDV incompleto (um caixa de fora, um dia faltando) ou documento emitido sem venda no caixa.</li>
      <li><strong>Declarado menor que as duas</strong> — a venda foi registrada nos dois sistemas e não chegou inteira à declaração.</li>
    </ul>
    <p class="nota" style="font-size:14px">Em cada mês e em cada dia o <strong>maior valor</strong> entre os tipos de lançamento fica em
      destaque, com o rótulo "maior". A leitura é em <strong>reais</strong>, não em percentual: <strong>variação</strong> = maior − menor, e é ela
      que define o status (coerente, atenção, disperso) pelos limites em R$ da aba, que você ajusta; <strong>não declarado</strong> = quanto
      o maior passa do declarado. O percentual aparece só ao passar o mouse sobre a variação. Uma competência com um tipo só é
      marcada como tal, e não aparece como se fechasse — ausência de divergência não é prova de acerto.</p>
    <h3 style="margin-top:18px">Duas conferências que só a redução Z permite</h3>
    <ul class="nota" style="font-size:14px;padding-left:20px">
      <li><strong>Contador de reduções (CRZ)</strong> sobe de um em um, uma vez por dia de movimento. Salto no número
        significa Z que existiu e não está no arquivo.</li>
      <li><strong>Grande Total (GT)</strong> é acumulador que nunca zera. A diferença entre o GT de duas reduções
        seguidas tem que ser igual à venda bruta do dia. Não sendo, a diferença é venda que passou pelo equipamento
        e não apareceu no cupom — e o sistema diz de quanto foi.</li>
    </ul>
    <h3 style="margin-top:18px">O cruzamento final</h3>
    <p class="nota" style="font-size:14px">Ao fim da aba, as quatro fontes ficam numa linha só: apurado (livro fiscal ou extrato do Simples),
      redução Z, PDV e informado. A <strong>referência</strong> é o apurado — é a peça que o fisco já tem; sem ele, a redução Z assume,
      e a linha diz qual das duas está valendo. Cada desvio é medido contra essa referência. O veredito
      <strong>INVESTIGAR</strong> sai quando há alerta grave ou desvio acima do limite de divergência; <strong>FONTES DE MENOS</strong>
      quando só uma fonte chegou. As linhas do cruzamento vêm do histórico de fechamentos mensais — e, marcadas como <em>mês aberto</em>, dos meses ainda em andamento nesta sessão.</p>
    <h3 style="margin-top:18px">Privacidade</h3>
    <p class="nota" style="font-size:14px">Os arquivos são lidos dentro do navegador. A página não tem servidor, não faz upload e não guarda dados fiscais: o que persiste (no <code>localStorage</code> deste navegador) são as preferências, as regras de CFOP alteradas e o acompanhamento — carteira, marcos, notificações e fechamentos. A única função que acessa a rede é o OCR, que baixa a biblioteca de reconhecimento — e só quando você carrega uma foto.</p>
    <h3 style="margin-top:18px">Limites que você precisa conhecer</h3>
    <ul class="nota" style="font-size:14px;padding-left:20px">
      <li>A conciliação da auditoria confere <strong>livro contra planilha</strong>: ela não prova que o livro reflete as vendas reais. Quem ataca isso é a aba <strong>Triangulação</strong>, e só até onde as fontes que você carregar alcançarem — venda em dinheiro que não passou nem pelo PDV nem pelo equipamento fiscal continua invisível para qualquer cruzamento.</li>
      <li>A classificação dos CFOP é uma convenção razoável, não uma norma. Casos como consignação, venda para entrega futura e industrialização por encomenda merecem conferência de quem conhece a operação.</li>
      <li>Isto não substitui a leitura de um contador. É uma ferramenta de triagem: aponta onde olhar.</li>
    </ul>
  </section>`
}

/* ------------------------------------------------------------------ eventos */

function ligarEventos (r) {
  $$('nav.abas button').forEach(b => b.onclick = () => { estado.aba = b.dataset.aba; renderizar() })

  ligarDrop('#drop-livros', '#in-livros', 'livro')
  ligarDrop('#drop-planilha', '#in-planilha', 'planilha')
  ligarDrop('#drop-z', '#in-z', 'z')
  ligarDrop('#drop-pdv', '#in-pdv', 'pdv')
  ligarDrop('#drop-napp', '#in-napp', 'napp')

  $$('[data-remover]').forEach(b => b.onclick = () => {
    const id = b.dataset.remover
    estado.vendas = estado.vendas.filter(v => v.id !== id)
    estado.z = estado.z.filter(v => v.id !== id)
    estado.pdv = estado.pdv.filter(v => v.id !== id)
    estado.napp = estado.napp.filter(v => v.id !== id)
    estado.livros = estado.livros.filter(l => l.id !== id)
    renderizar()
  })

  $$('.arquivo').forEach(div => {
    const id = div.dataset.arq
    const tipo = div.dataset.tipo
    const entrada = tipo === 'planilha' ? estado.vendas.find(v => v.id === id)
      : ehTri(tipo) ? estado[tipo].find(v => v.id === id)
      : estado.livros.find(l => l.id === id)
    if (!entrada) return
    $$('[data-opt]', div).forEach(el => {
      el.onchange = () => { entrada.opts[el.dataset.opt] = el.value; entrada.opts.mapa = null; reprocessar(entrada, tipo) }
    })
    $$('[data-mapa]', div).forEach(el => {
      el.onchange = () => {
        const mapa = { ...(entrada.opts.mapa || {}) }
        $$('[data-mapa]', div).forEach(s => {
          if (s.value === '') delete mapa[s.dataset.mapa]
          else mapa[s.dataset.mapa] = Number(s.value)
        })
        entrada.opts.mapa = mapa
        reprocessar(entrada, tipo)
      }
    })
  })

  $$('[data-conflito]').forEach(sel => sel.onchange = () => {
    estado.fontePreferida[sel.dataset.conflito] = sel.value
    renderizar()
  })

  const liga = (sel, campo, num) => {
    const el = $(sel)
    if (el) el.onchange = () => { estado.prefs[campo] = num ? Number(el.value) : el.value; salvarPrefs(); renderizar() }
  }
  liga('#p-medida', 'medida'); liga('#p-base', 'baseDeclaracao'); liga('#p-tolR', 'toleranciaReais', true)
  liga('#p-tolP', 'toleranciaPercent', true); liga('#p-aten', 'atencaoPercent', true)
  liga('#p-tri-coerente', 'triCoerenteReais', true); liga('#p-tri-atencao', 'triAtencaoReais', true); liga('#p-tri-dia', 'triDiaReais', true)

  const modelo = $('#baixar-modelo')
  if (modelo) modelo.onclick = () => baixar('modelo-vendas-informadas.csv',
    '﻿CNPJ;Empresa;Competencia;Vendas\r\n' +
    '30.571.578/0001-69;Loja Centro;01/2025;66468,00\r\n' +
    '30.571.578/0001-69;Loja Centro;02/2025;69388,50\r\n' +
    '07.739.834/0017-20;Filial 17;01/2025;180659,98\r\n', 'text/csv')

  const ec = $('#exp-conc')
  if (ec) ec.onclick = () => baixar(`conciliacao-${hoje()}.csv`, paraCsv(r.linhas), 'text/csv')
  const ed = $('#exp-cfop')
  if (ed) ed.onclick = () => baixar(`detalhe-cfop-${hoje()}.csv`, detalhePorCfopCsv(r.periodos), 'text/csv')
  const et = $('#exp-tri')
  if (et) et.onclick = () => baixar(`triangulacao-${hoje()}.csv`, triangulacaoCsv(r.tri.porMes), 'text/csv')
  const ec2 = $('#exp-cruz')
  if (ec2) ec2.onclick = () => baixar(`cruzamento-${hoje()}.csv`, cruzamentoCsv(r.cruz.linhas), 'text/csv')

  $$('[data-override]').forEach(sel => sel.onchange = () => {
    const cfop = sel.dataset.override
    const padrao = classificarCfop(cfop).natureza
    if (sel.value === padrao) delete estado.prefs.overrides[cfop]
    else estado.prefs.overrides[cfop] = { natureza: sel.value }
    salvarPrefs(); renderizar()
  })
  const limpar = $('#limpar-overrides')
  if (limpar) limpar.onclick = () => { estado.prefs.overrides = {}; salvarPrefs(); renderizar() }

  const painelVideo = $('#painel-video')
  if (painelVideo) {
    /*
     * Os vídeos acompanham a versão publicada, mas não a cópia local de arquivo
     * único. O painel nasce fora da tela — e não com display:none, senão o
     * navegador nem tenta carregar os metadados — e só entra em cena quando
     * algum arquivo responder; cada vídeo que não responder some sozinho.
     */
    $$('#painel-video figure[data-video]').forEach(fig => {
      const video = fig.querySelector('video')
      // com vários <source>, o erro chega no último source, não no <video>
      const falhou = () => fig.remove()
      video.onerror = falhou
      const fontes = video.querySelectorAll('source')
      if (fontes.length) fontes[fontes.length - 1].onerror = falhou
      video.onloadedmetadata = () => { painelVideo.style.cssText = '' }
      video.load()
    })
    setTimeout(() => { if (painelVideo.style.left) painelVideo.remove() }, 4000)
  }

  /* ---- 2.0: painel, lojistas, notificações, fechamento mensal ---- */

  $$('nav.subabas button').forEach(b => b.onclick = () => { estado.subAba = b.dataset.subaba; renderizar() })

  const buscaPainel = $('#busca-painel')
  if (buscaPainel) buscaPainel.oninput = () => { estado.filtroPainel.busca = buscaPainel.value; renderizar(); const el = $('#busca-painel'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length) } }
  const filtroStatus = $('#filtro-status')
  if (filtroStatus) filtroStatus.onchange = () => { estado.filtroPainel.status = filtroStatus.value; renderizar() }

  $$('[data-marco]').forEach(el => el.onchange = () => {
    const reg = registroDe(estado.acomp, ciclo().chave, el.dataset.cnpj)
    reg[el.dataset.marco] = el.value || null
    delete reg[el.dataset.marco + 'Auto']
    salvarAcomp(); renderizar()
  })
  $$('[data-valor]').forEach(el => el.onchange = () => {
    const reg = registroDe(estado.acomp, ciclo().chave, el.dataset.cnpj)
    reg.valores[el.dataset.valor] = el.value === '' ? null : Number(el.value)
    salvarAcomp()
  })
  $$('[data-obs]').forEach(el => el.onchange = () => {
    registroDe(estado.acomp, ciclo().chave, el.dataset.cnpj).obs = el.value
    salvarAcomp()
  })
  const ea = $('#exp-acomp')
  if (ea) ea.onclick = () => baixar(`acompanhamento-ciclo-${ciclo().ano}-${hoje()}.csv`, acompanhamentoCsv(r.painel), 'text/csv')
  const eb = $('#exp-backup')
  if (eb) eb.onclick = () => baixar(`radar-acompanhamento-${hoje()}.json`, JSON.stringify(estado.acomp, null, 2), 'application/json')
  const ib = $('#imp-backup'); const inb = $('#in-backup')
  if (ib && inb) {
    ib.onclick = () => inb.click()
    inb.onchange = async () => {
      const f = inb.files[0]; inb.value = ''
      if (!f) return
      try {
        const dados = JSON.parse(await f.text())
        if (!dados || dados.versao !== VERSAO_ACOMPANHAMENTO || !Array.isArray(dados.lojistas)) throw new Error('não é uma cópia deste sistema')
        if (!await perguntar(`Substituir o acompanhamento atual pela cópia (${dados.lojistas.length} lojista(s), ${(dados.fechamentos || []).length} fechamento(s))?`)) return
        estado.acomp = { ...acompanhamentoVazio(), ...dados }
        salvarAcomp(); renderizar()
      } catch (e) { avisarSalvamento('Não consegui restaurar: ' + (e.message || e)) }
    }
  }

  // carteira
  const dropL = $('#drop-lojistas'); const inL = $('#in-lojistas')
  if (dropL && inL) {
    const receber = async (files) => {
      const avisos = []
      for (const f of files) {
        try {
          const lido = await lerArquivo(f, () => {})
          const abas = lido.abas || []
          if (!abas.length) { avisos.push(`${f.name}: sem aba legível.`); continue }
          // a carteira pode não estar na primeira aba (capa, instruções): vale a primeira que tiver lojistas
          const tentativas = abas.map(a => importarLojistas(a.linhas))
          const imp = tentativas.find(t => t.lojistas.length) || tentativas[0]
          const m = mesclarLojistas(estado.acomp.lojistas, imp.lojistas)
          estado.acomp.lojistas = m.lojistas
          avisos.push(`${m.inseridos + m.atualizados} lojista(s) de ${f.name}: ${m.inseridos} novo(s), ${m.atualizados} atualizado(s).`, ...imp.avisos)
        } catch (e) { avisos.push(`${f.name}: ${e.message || e}`) }
      }
      estado.avisoLojistas = avisos
      salvarAcomp(); renderizar()
    }
    dropL.onclick = () => inL.click()
    dropL.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inL.click() } }
    inL.onchange = () => { receber([...inL.files]); inL.value = '' }
    dropL.ondragover = (e) => { e.preventDefault(); dropL.classList.add('ativo') }
    dropL.ondragleave = () => dropL.classList.remove('ativo')
    dropL.ondrop = (e) => { e.preventDefault(); dropL.classList.remove('ativo'); receber([...e.dataTransfer.files]) }
  }
  const ml = $('#modelo-lojistas')
  if (ml) ml.onclick = () => baixar('modelo-lojistas.csv',
    '﻿LUC;Loja;Razao Social;CNPJ;UF;Inicio do contrato;E-mail;WhatsApp;Regime;Segmento\r\n' +
    '101;Loja Exemplo;LOJA EXEMPLO LTDA;30.571.578/0001-69;SP;15/03/2021;contato@lojaexemplo.com.br;11 98888-7777;Simples Nacional;Moda\r\n' +
    '215;Filial 17;FILIAL DEZESSETE SA;07.739.834/0017-20;RJ;01/08/2023;fiscal@filial17.com.br;;Lucro presumido;Alimentação\r\n', 'text/csv')
  const el2 = $('#exp-lojistas')
  if (el2) el2.onclick = () => baixar(`carteira-lojistas-${hoje()}.csv`, carteiraCsv(estado.acomp.lojistas), 'text/csv')
  const add = $('#add-lojista')
  if (add) add.onclick = () => {
    const bruto = { nome: $('#nl-nome').value, cnpj: $('#nl-cnpj').value, luc: $('#nl-luc').value, uf: $('#nl-uf').value, inicioContrato: $('#nl-inicio').value, email: $('#nl-email').value,
      telefone: $('#nl-tel').value, regime: $('#nl-regime').value === 'simples' ? 'Simples' : $('#nl-regime').value }
    const erro = $('#erro-lojista')
    if (!cnpjValido(bruto.cnpj)) { erro.textContent = 'CNPJ inválido (dígito verificador não confere).'; return }
    if (!bruto.nome.trim()) { erro.textContent = 'Informe o nome da loja.'; return }
    const m = mesclarLojistas(estado.acomp.lojistas, [normalizarLojista(bruto)])
    estado.acomp.lojistas = m.lojistas
    estado.avisoLojistas = null
    salvarAcomp(); renderizar()
  }
  $$('[data-loj]').forEach(el => el.onchange = () => {
    const l = lojistaDe(el.dataset.cnpj); if (!l) return
    const campo = el.dataset.loj
    l[campo] = campo === 'ativo' ? el.checked : campo === 'telefone' ? el.value.replace(/[^\d+]/g, '') : el.value
    salvarAcomp()
    if (campo === 'ativo' || campo === 'uf' || campo === 'inicioContrato') renderizar()
  })
  $$('[data-remover-lojista]').forEach(b => b.onclick = async () => {
    const l = lojistaDe(b.dataset.removerLojista)
    if (!l || !await perguntar(`Remover ${l.nome || formatarCnpj(l.cnpj)} da carteira? O histórico de ciclos deste CNPJ é mantido, mas some do painel.`)) return
    estado.acomp.lojistas = estado.acomp.lojistas.filter(x => x.cnpj !== l.cnpj)
    salvarAcomp(); renderizar()
  })

  // notificações
  $$('[data-pref-notif]').forEach(el => el.onchange = () => {
    estado.acomp.prefs[el.dataset.prefNotif] = el.type === 'number' ? Number(el.value) : el.value
    salvarAcomp(); renderizar()
  })
  $$('[data-ver-texto]').forEach(b => b.onclick = () => {
    estado.textoAberto = estado.textoAberto === b.dataset.verTexto ? null : b.dataset.verTexto
    renderizar()
  })
  $$('[data-copiar]').forEach(b => b.onclick = async () => {
    const [cnpj, etapa, processo] = b.dataset.copiar.split('|')
    const t = processo === 'taxa' ? textoTaxa(etapa, lojistaDe(cnpj), registroSocietario(estado.acomp, cnpj), estado.acomp.prefs)
      : textoNotificacao(etapa, lojistaDe(cnpj), ciclo(), estado.acomp.prefs)
    try { await navigator.clipboard.writeText(t.assunto + '\n\n' + t.corpo); b.textContent = 'Copiado' } catch { b.textContent = 'Selecione e copie' }
  })
  $$('[data-registrar]').forEach(b => b.onclick = async () => {
    const [cnpj, etapa, processo] = b.dataset.registrar.split('|')
    const e = ETAPAS.find(x => x.chave === etapa); const l = lojistaDe(cnpj)
    const taxa = processo === 'taxa'
    if (etapa === 'multa' && !await perguntar(taxa
      ? `Registrar o lançamento da taxa de transferência para ${l ? l.nome : cnpj}?`
      : `Registrar a multa enviada para ${l ? l.nome : cnpj}? Isto marca o lojista como multado no ciclo ${ciclo().ano}.`)) return
    const reg = taxa ? registroSocietario(estado.acomp, cnpj) : registroDe(estado.acomp, ciclo().chave, cnpj)
    reg.notificacoes[etapa] = hojeIso()
    estado.textoAberto = null
    salvarAcomp(); renderizar()
    avisarSalvamento(`${taxa && e ? rotuloEtapaTaxa(e) : e ? e.rotulo : etapa} registrada para ${l ? l.nome : cnpj} em ${dataBR(hojeIso())}.`)
  })

  // base fictícia: substitui o acompanhamento; se já houver dados, pede confirmação duas vezes
  $$('[data-carregar-ficticia]').forEach(b => b.onclick = async () => {
    const temDados = estado.acomp.lojistas.length && !estado.acomp.ficticia
    if (temDados) {
      if (!await perguntar(`Já existe uma carteira com ${estado.acomp.lojistas.length} lojista(s) neste navegador. A base fictícia SUBSTITUI esse acompanhamento. Continuar?`)) return
      if (!await perguntar('Confirma de novo: o acompanhamento atual será apagado deste navegador. Se quiser guardá-lo, cancele e use "Salvar cópia (JSON)" no Painel antes.')) return
    }
    estado.acomp = { ...acompanhamentoVazio(), ...gerarBaseFicticia(new Date()) }
    estado.aba = 'dashboard'
    salvarAcomp(); renderizar()
    avisarSalvamento('Base fictícia carregada: 40 lojistas. Explore o Dashboard, o Painel, as Notificações e o Societário.')
  })
  const lf = $('#limpar-ficticia')
  if (lf) lf.onclick = async () => {
    if (!await perguntar('Apagar a base fictícia deste navegador?')) return
    if (!await perguntar('Confirma de novo: carteira, marcos, notificações, fechamentos e societário fictícios serão apagados.')) return
    estado.acomp = acompanhamentoVazio(); salvarAcomp(); renderizar()
  }
  const bf = $('#baixar-ficticia')
  if (bf) bf.onclick = () => baixar('lojistas-base-ficticia.csv', lojistasFicticiosCsv(gerarBaseFicticia(new Date())), 'text/csv')

  // limites da triangulação: o bloco continua aberto enquanto o time ajusta os valores
  const lt = $('#limites-tri')
  if (lt) lt.ontoggle = () => { estado.limitesTriAbertos = lt.open }

  // dashboard
  const rt = $('#roteiro')
  if (rt) rt.ontoggle = () => { estado.roteiroAberto = rt.open }
  const br = $('#baixar-roteiro')
  if (br) br.onclick = () => baixar('roteiro-de-testes.md', roteiroMarkdown(estado.acomp), 'text/markdown')
  const dc = $('#dash-comp')
  if (dc) dc.onchange = () => { estado.dashComp = dc.value; renderizar() }
  $$('details[data-pend]').forEach(d => d.ontoggle = () => {
    if (d.open) estado.pendAberta = d.dataset.pend
    else if (estado.pendAberta === d.dataset.pend) estado.pendAberta = null
  })
  ligarDicas()

  // societário
  $$('[data-soc]').forEach(el => el.onchange = () => {
    const reg = registroSocietario(estado.acomp, el.dataset.cnpj)
    const k = el.dataset.soc
    if (k === 'houveMudanca') {
      reg.houveMudanca = el.value === '' ? null : el.value === 'sim'
      if (el.value !== '' && !reg.consultadoEm) reg.consultadoEm = hojeIso()
    } else if (k === 'isencao' || k === 'indicio') reg[k] = el.value || null
    else reg[k] = el.value || (el.type === 'date' ? null : '')
    salvarAcomp(); renderizar()
  })
  $$('[data-soc-check]').forEach(el => el.onchange = () => {
    registroSocietario(estado.acomp, el.dataset.cnpj)[el.dataset.socCheck] = el.checked
    salvarAcomp(); renderizar()
  })
  $$('[data-soc-valor]').forEach(el => el.onchange = () => {
    registroSocietario(estado.acomp, el.dataset.cnpj).valores[el.dataset.socValor] = el.value === '' ? null : Number(el.value)
    salvarAcomp()
  })
  $$('[data-soc-acao]').forEach(b => b.onclick = async () => {
    const reg = registroSocietario(estado.acomp, b.dataset.cnpj); const l = lojistaDe(b.dataset.cnpj)
    const acao = b.dataset.socAcao
    if (acao === 'cobrar') {
      if (!await perguntar(`Confirmar a cobrança da taxa de transferência de ${l ? l.nome : b.dataset.cnpj}? Isto abre o fluxo de notificação a partir de hoje.`)) return
      reg.cobrar = true; reg.validadoEm = hojeIso()
    } else if (acao === 'isentar') { reg.cobrar = false; reg.validadoEm = hojeIso() }
    else if (acao === 'reabrir') { reg.cobrar = null; reg.validadoEm = null }
    salvarAcomp(); renderizar()
  })
  // abrir a Junta/Receita com o CNPJ já na área de transferência: os portais não aceitam o número na URL
  $$('[data-abrir]').forEach(a => a.onclick = () => {
    try { navigator.clipboard.writeText(formatarCnpj(a.dataset.abrir)) } catch { /* sem clipboard: o usuário digita */ }
    avisarSalvamento(`CNPJ ${formatarCnpj(a.dataset.abrir)} copiado — cole na consulta que abriu em outra aba.`)
  })
  const es = $('#exp-soc')
  if (es) es.onclick = () => baixar(`societario-${hoje()}.csv`, societarioCsv(r.soc), 'text/csv')

  // fechamento mensal e histórico
  const fm = $('#fechar-mes')
  if (fm) fm.onclick = () => {
    const comp = $('#mes-fechar').value
    const res = fecharMes(estado.acomp.fechamentos, r.tri.porMes, comp)
    estado.acomp.fechamentos = res.fechamentos
    salvarAcomp(); renderizar()
    avisarSalvamento(`${competenciaLabel(comp)} fechado: ${res.fechadas} lojista(s) no histórico.`)
  }
  $$('[data-reabrir]').forEach(b => b.onclick = async () => {
    const [cnpj, comp] = b.dataset.reabrir.split('|')
    if (!await perguntar(`Reabrir ${competenciaLabel(comp)} de ${formatarCnpj(cnpj)}? O fechamento é apagado do histórico.`)) return
    estado.acomp.fechamentos = estado.acomp.fechamentos.filter(f => !(f.cnpj === cnpj && f.competencia === comp))
    salvarAcomp(); renderizar()
  })
  const eh = $('#exp-hist')
  if (eh) eh.onclick = () => baixar(`historico-triangulacao-${hoje()}.csv`, fechamentosCsv(estado.acomp.fechamentos), 'text/csv')

  const busca = $('#busca-cfop')
  const soUsados = $('#so-usados')
  const filtrar = () => {
    const q = (busca ? busca.value : '').toLowerCase().trim()
    const apenas = soUsados && soUsados.checked
    $$('#tab-cfop tbody tr').forEach(tr => {
      const passa = (!q || tr.dataset.busca.includes(q)) && (!apenas || tr.dataset.usado === '1')
      tr.style.display = passa ? '' : 'none'
    })
  }
  if (busca) busca.oninput = filtrar
  if (soUsados) soUsados.onchange = filtrar
}

/** Dica flutuante para os gráficos: segue o ponteiro, some ao sair. Também abre no toque. */
function ligarDicas () {
  let dica = $('#dica-viz')
  if (!dica) { dica = document.createElement('div'); dica.id = 'dica-viz'; dica.setAttribute('role', 'tooltip'); document.body.appendChild(dica) }
  const mostrar = (el, ev) => {
    dica.textContent = el.dataset.dica
    dica.style.display = 'block'
    const x = Math.min(ev.clientX + 14, innerWidth - dica.offsetWidth - 8)
    const y = ev.clientY - dica.offsetHeight - 12 < 4 ? ev.clientY + 16 : ev.clientY - dica.offsetHeight - 12
    dica.style.left = x + 'px'; dica.style.top = y + 'px'
  }
  $$('[data-dica]').forEach(el => {
    el.onpointermove = (ev) => mostrar(el, ev)
    el.onpointerleave = () => { dica.style.display = 'none' }
  })
}

function ligarDrop (dropSel, inputSel, destino) {
  const drop = $(dropSel); const input = $(inputSel)
  if (!drop || !input) return
  drop.onclick = () => input.click()
  drop.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click() } }
  input.onchange = () => { carregar([...input.files], destino); input.value = '' }
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('ativo') }
  drop.ondragleave = () => drop.classList.remove('ativo')
  drop.ondrop = (e) => {
    e.preventDefault(); drop.classList.remove('ativo')
    carregar([...e.dataTransfer.files], destino)
  }
}

/**
 * Salvar um arquivo funciona de dois jeitos, conforme onde a página está:
 *  - hospedada como artifact, o visualizador não honra link de download;
 *    quem entrega o arquivo é a capacidade `downloads`, que pede confirmação;
 *  - aberta local (duplo clique, servidor próprio), vale o link comum.
 */
async function baixar (nome, conteudo, tipo) {
  const ns = await capacidadeDownloads()
  if (ns) {
    try {
      await ns.save({ filename: nome, data: new Blob([conteudo], { type: tipo + ';charset=utf-8' }) })
    } catch (e) {
      const codigo = e && e.code
      if (codigo === 'declined') return                       // o usuário disse não; nada a fazer
      if (codigo === 'rate_limited') return avisarSalvamento('Já existe um download aguardando confirmação.')
      avisarSalvamento('Não foi possível salvar o arquivo aqui. Baixe a página e abra local.')
    }
    return
  }
  const blob = new Blob([conteudo], { type: tipo + ';charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = nome
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

let promessaDownloads
function capacidadeDownloads () {
  if (promessaDownloads === undefined) {
    const c = globalThis.claude
    promessaDownloads = (c && typeof c.use === 'function')
      ? Promise.resolve(c.use('downloads')).catch(() => null)
      : Promise.resolve(null)
  }
  return promessaDownloads
}

/**
 * Confirmação desenhada na própria página. window.confirm() não serve: dentro de
 * um iframe sem allow-modals (como no link publicado) o navegador o ignora em
 * silêncio e devolve "Cancelar". Resolve true só com o botão Confirmar.
 */
function perguntar (msg) {
  return new Promise(resolve => {
    const d = document.createElement('dialog')
    d.className = 'pergunta'
    d.innerHTML = '<p></p><div class="botoes"><button class="leve" value="nao">Cancelar</button><button class="acao" value="sim">Confirmar</button></div>'
    d.querySelector('p').textContent = msg
    d.querySelectorAll('button').forEach(b => { b.onclick = () => d.close(b.value) })
    d.onclose = () => { d.remove(); resolve(d.returnValue === 'sim') }
    document.body.appendChild(d)
    d.showModal()
    d.querySelector('button.leve').focus()   // Enter por engano não apaga nada
  })
}

function avisarSalvamento (msg) {
  const el = $('#progresso')
  if (!el) return
  el.textContent = msg
  el.style.display = ''
  setTimeout(() => { if (el.textContent === msg) { el.textContent = ''; el.style.display = 'none' } }, 6000)
}

const hoje = () => new Date().toISOString().slice(0, 10)

/* -------------------------------------------------------------------- boot */

export function iniciar () {
  carregarPrefs()
  carregarAcomp()
  const bt = $('#tema')
  if (bt) bt.onclick = () => {
    const ordem = ['auto', 'claro', 'escuro']
    estado.prefs.tema = ordem[(ordem.indexOf(estado.prefs.tema) + 1) % 3]
    aplicarTema(); salvarPrefs()
    bt.textContent = { auto: 'Tema: auto', claro: 'Tema: claro', escuro: 'Tema: escuro' }[estado.prefs.tema]
  }
  if (bt) bt.textContent = { auto: 'Tema: auto', claro: 'Tema: claro', escuro: 'Tema: escuro' }[estado.prefs.tema]
  renderizar()
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar)
  else iniciar()
}
