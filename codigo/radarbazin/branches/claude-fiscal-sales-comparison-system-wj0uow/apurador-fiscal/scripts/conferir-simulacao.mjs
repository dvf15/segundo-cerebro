#!/usr/bin/env node
/**
 * Roda a simulação completa no app, na ordem do roteiro, e confere o que cada
 * arquivo de demo/simulacao/ produz. Grava demo/simulacao/.resultado.json, que
 * scripts/gerar-roteiro-simulacao.py transforma no roteiro em Excel.
 *
 *   node scripts/conferir-simulacao.mjs     (rode antes: node scripts/gerar-simulacao.mjs)
 *
 * As fotos de redução Z dependem do OCR, que baixa o tesseract.js da internet;
 * sem conexão elas falham com aviso, e a conferência registra isso sem reprovar.
 */
import { chromium } from 'playwright'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { caminhoChromium } from './chromium.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const sim = join(raiz, 'demo', 'simulacao')
const C = JSON.parse(readFileSync(join(sim, '.cenarios.json'), 'utf8'))
const fmt = (c) => `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`
const L = Object.fromEntries(Object.entries(C.lojas).map(([k, l]) => [k, { ...l, f: fmt(l.cnpj) }]))

const navegador = await chromium.launch({ executablePath: caminhoChromium() })
const ctx = await navegador.newContext({ locale: 'pt-BR', timezoneId: 'America/Sao_Paulo', viewport: { width: 1400, height: 1000 } })
const p = await ctx.newPage()
const erros = []
p.on('pageerror', e => erros.push(e.message))

const passos = []
let passo = null
const novoPasso = (titulo, onde, arquivos) => { passo = { titulo, onde, arquivos, conferencias: [] }; passos.push(passo) }
const limpo = (t) => String(t || '').replace(/\s+/g, ' ').trim()
/** Registra uma conferência: o que a tela deve mostrar, e o que mostrou. */
function confere (item, esperado, observado, obrigatorio = true) {
  const faltando = [].concat(esperado).filter(e => !observado.includes(e))
  const ok = !faltando.length
  passo.conferencias.push({ item, esperado: [].concat(esperado).join(' · '), observado: observado.slice(0, 400), ok, obrigatorio })
  console.log(`  ${ok ? '✓' : obrigatorio ? '✗' : '–'} ${item}${ok ? '' : '  (faltou: ' + faltando.join(', ') + ')'}`)
}
const texto = async (sel) => limpo(await p.locator(sel).first().innerText().catch(() => ''))
const linha = async (escopo, cnpjF, comp) => limpo(await p.locator(`${escopo} tbody tr`, { hasText: cnpjF }).filter({ hasText: comp }).first().innerText().catch(() => ''))
const aba = async (a) => { await p.click(`nav.abas button[data-aba="${a}"]`); await p.waitForTimeout(300) }
const subaba = async (a) => { await p.click(`nav.subabas button[data-subaba="${a}"]`); await p.waitForTimeout(300) }
const esperaLeitura = async () => {
  await p.waitForTimeout(400)
  await p.waitForFunction(() => { const e = document.querySelector('#progresso'); return !e || e.style.display === 'none' || !/lendo|OCR|processando/i.test(e.textContent) }, null, { timeout: 180000 })
  await p.waitForTimeout(1200)
}
const arquivo = async (nome) => texto(`.arquivo:has-text("${nome}") .meta`) || texto(`.arquivo:has-text("${nome}")`)
const pasta = (d, filtro) => readdirSync(join(sim, d)).filter(filtro).sort().map(f => join(sim, d, f))

await p.goto(pathToFileURL(join(raiz, 'index.html')).href)
await p.waitForSelector('nav.abas')

/* 1. base */
novoPasso('Carregar a base fictícia', 'Lojistas → Carregar base fictícia', [])
await aba('lojistas'); await p.click('[data-carregar-ficticia]'); await p.waitForTimeout(500)
confere('a base entrou com 40 lojistas', ['Base fictícia de teste', '40 lojistas'], await texto('.faixa-ficticia'))

/* 2. carteira com erros */
novoPasso('Importar lojistas novos (com erros de propósito)', 'Lojistas → arrastar a planilha', ['1-carteira/lojistas-novos-e-com-erros.xlsx'])
await aba('lojistas'); await p.setInputFiles('#in-lojistas', join(sim, '1-carteira', 'lojistas-novos-e-com-erros.xlsx')); await p.waitForTimeout(1200)
const avL = await texto('ul.avisos')
confere('3 lojistas novos e a Bela atualizada', '3 novo(s), 1 atualizado(s)', avL)
confere('CNPJ com dígito errado é recusado', 'CNPJ inválido ("12.345.678/0001-00")', avL)
confere('CNPJ repetido na planilha é ignorado', 'repetido — ignorada', avL)
await aba('societario')
confere('o Societário avisa o lojista sem UF', 'sem UF do contrato', await texto('#conteudo'))

/* 3. livros fiscais em todos os formatos */
const livros = pasta('2-auditoria', f => !f.startsWith('ficha') && !f.startsWith('.'))
novoPasso('Carregar os livros fiscais (todos os formatos)', 'Auditoria fiscal → Dados → Livros', livros.map(f => '2-auditoria/' + f.split('/').pop()))
await aba('auditoria'); await p.setInputFiles('#in-livros', livros); await esperaLeitura()
confere('livro impresso (P1/P2) da Bela', 'Livro fiscal impresso (modelo P1/P2)', await arquivo('bela-livro-saidas-2025.pdf'))
confere('SPED EFD da Trilha', 'SPED EFD ICMS/IPI', await arquivo('trilha-sped-efd-2025-01.txt'))
confere('SPED: documento cancelado fica fora', 'cancelad', (await texto('.arquivo:has-text("trilha-sped-efd-2025-01.txt")')).toLowerCase())
confere('resumo CST/CFOP da Urbano', 'Resumo fiscal por CST/CFOP', await arquivo('urbano-resumo-cst-cfop-saidas-2025.pdf'))
confere('extrato do Simples (PGDAS-D) do Café Aurora', ['Extrato do Simples Nacional (PGDAS-D)', '13 competência(s)'], await arquivo('cafe-aurora-extrato-pgdas-d-2025-12.pdf'))
confere('planilha de livro da Ótica', 'Tabular (livro fiscal)', await arquivo('otica-livro-fiscal-planilha-2025.xlsx'))

/* 4. fichas */
novoPasso('Carregar as fichas de vendas informadas', 'Auditoria fiscal → Dados → Vendas informadas',
  ['2-auditoria/ficha-vendas-informadas-2025.xlsx', '3-triangulacao/ficha-vendas-informadas-2026-10.xlsx'])
await p.setInputFiles('#in-planilha', [join(sim, '2-auditoria', 'ficha-vendas-informadas-2025.xlsx'), join(sim, '3-triangulacao', 'ficha-vendas-informadas-2026-10.xlsx')])
await p.waitForTimeout(1800)
const fichaTxt = await texto('.arquivo:has-text("ficha-vendas-informadas-2025.xlsx")')
confere('ficha 2025 lida', '26 linha(s) de venda', fichaTxt)
confere('linha sem CNPJ recusada com aviso', 'CNPJ ilegível', fichaTxt)

/* 5. conciliação */
novoPasso('Conferir a conciliação', 'Auditoria fiscal → Resultado', [])
await subaba('resultado')
const conc = '#conteudo'
const casos = [
  ['Bela 02/2025: venda com ST fora da ficha', L.BELA.f, '02/2025', ['R$ 40.000,00', 'DIVERGENTE']],
  ['Quiosque 01/2025: diferença pequena', L.QUIOSQUE.f, '01/2025', ['-R$ 900,00', 'ATENÇÃO']],
  ['Trilha 01/2025 (SPED): tudo bate', L.TRILHA.f, '01/2025', ['R$ 180.000,00', 'OK']],
  ['Trilha 02/2025: devolução deduzida, 0,96% de diferença', L.TRILHA.f, '02/2025', ['R$ 3.000,00', 'R$ 1.500,00', 'ATENÇÃO']],
  ['Trilha 03/2025: ST (5405) fora da ficha', L.TRILHA.f, '03/2025', ['R$ 25.000,00', 'DIVERGENTE']],
  ['Urbano 01/2025: bate, com CFOP 5949 para revisar', L.URBANO.f, '01/2025', ['R$ 245.000,00', 'OK', 'alerta']],
  ['Urbano 02/2025: informado 10% abaixo', L.URBANO.f, '02/2025', ['R$ 23.000,00', 'DIVERGENTE']],
  ['Café 05/2025 (Simples): declarado no PGDAS maior que a ficha', L.CAFE.f, '05/2025', ['R$ 12.000,00', 'DIVERGENTE']],
  ['Café 12/2025: mês do PA bate', L.CAFE.f, '12/2025', ['R$ 95.000,00', 'OK']],
  ['Café 12/2024: só no histórico do extrato', L.CAFE.f, '12/2024', ['SÓ NA APURAÇÃO']],
  ['Ótica 01/2025: duas linhas na ficha, somadas', L.OTICA.f, '01/2025', ['R$ 79.000,00', 'OK', 'alerta']],
  ['Ótica 03/2025: ficha sem livro', L.OTICA.f, '03/2025', ['SÓ NO INFORMADO']],
  ['Ótica 04/2025: livro sem ficha (nome vem da carteira)', L.OTICA.f, '04/2025', ['Ótica Horizonte', 'SÓ NA APURAÇÃO']],
  ['Ótica 05/2025: só o livro de entradas', L.OTICA.f, '05/2025', ['LIVRO INCOMPLETO']],
  ['Lume 10/2026: a ficha do mês aparece sem livro (esperado)', L.LUME.f, '10/2026', ['SÓ NO INFORMADO']],
]
for (const [item, c, comp, esp] of casos) confere(item, esp, await linha(conc, c, comp))

/* 6. painel marcou sozinho */
novoPasso('Conferir o Painel: livros carregados viram AUDITADO ✦', 'Painel', [])
await aba('painel')
for (const k of ['TRILHA', 'URBANO', 'CAFE', 'OTICA', 'QUIOSQUE']) {
  const t = limpo(await p.locator('#conteudo tbody tr', { hasText: L[k].f }).first().innerText().catch(() => ''))
  const st = (t.match(/AUDITADO|NEGOCIADO|COBRADO/) || [''])[0]
  confere(`${L[k].nome} avançou para AUDITADO (ou já estava além)`, st || 'AUDITADO', t)
}

/* 7. triangulação */
const zs = pasta('3-triangulacao', f => /reducao-z/.test(f))
const pdvs = pasta('3-triangulacao', f => /-pdv-/.test(f))
novoPasso('Carregar reduções Z (PDF e foto), relatórios de PDV e o NAPP', 'Triangulação',
  [...zs, ...pdvs, join(sim, '3-triangulacao', 'napp-vendas-diarias-2026-10.xlsx')].map(f => '3-triangulacao/' + f.split('/').pop()))
await aba('triangulacao')
await p.setInputFiles('#in-z', zs); await esperaLeitura()
await p.setInputFiles('#in-pdv', pdvs); await esperaLeitura()
await p.setInputFiles('#in-napp', join(sim, '3-triangulacao', 'napp-vendas-diarias-2026-10.xlsx')); await esperaLeitura()
const nappTxt = await texto('.arquivo:has-text("napp-vendas-diarias-2026-10.xlsx")')
confere('planilha do NAPP lida pelo número da loja', ['Tabular (NAPP)', 'dia(s) de NAPP'], nappTxt)
confere('loja do NAPP fora da carteira é avisada', 'Loja(s) 999 sem CNPJ na carteira', nappTxt)
const foto = await texto('.arquivo:has-text("bambu-decor-reducao-z-foto-01")')
const ocrOk = !/erro/i.test(foto)
confere('foto da redução Z lida por OCR (precisa de internet)', 'Redução Z', foto, false)
const mm = '.painel:has(h2:has-text("Mês a mês"))'
const tri = [
  ['Lume 10/2026: Z, PDV, NAPP e ficha iguais', L.LUME.f, '10/2026', ['25d Z · 25d PDV · 25d NAPP', 'COERENTE']],
  ['Vértice 10/2026: PDV e NAPP empatam no maior, acima da Z (venda sem cupom)', L.VERTICE.f, '10/2026', ['Maior valor: PDV e NAPP R$ 140.675,00', 'R$ 8.500,00 acima do declarado', 'DISPERSO']],
  ['Mundo Pet 10/2026: NAPP é o maior; falta a Z do dia 15', L.MUNDOPET.f, '10/2026', ['24d Z · 25d PDV · 25d NAPP', 'Maior valor: NAPP R$ 94.675,00', 'DISPERSO']],
  ['Raiz Natural 10/2026: só a redução Z', L.RAIZ.f, '10/2026', ['FONTE ÚNICA']],
  ['Bambu Decor 10/2026: Z em foto + PDV', L.BAMBU.f, '10/2026', ocrOk ? ['3d Z · 3d PDV', 'COERENTE'] : ['3d PDV', 'COERENTE']],
  ['Trilha 01/2025: Z = PDV = ficha', L.TRILHA.f, '01/2025', ['31d Z · 31d PDV', 'COERENTE']],
  ['Bela 03/2025: PDV acima da Z e ficha abaixo', L.BELA.f, '03/2025', ['variação de R$ 21.026,00', 'DISPERSO']],
]
for (const [item, c, comp, esp] of tri) confere(item, esp, await linha(mm, c, comp))
const maiorPet = limpo(await p.locator(`${mm} tbody tr`, { hasText: L.MUNDOPET.f }).filter({ hasText: '10/2026' }).first().locator('td.maior').allInnerTexts().then(x => x.join(' | ')).catch(() => ''))
confere('o maior valor fica em destaque na linha (Mundo Pet: NAPP)', ['R$ 94.675,00', 'MAIOR'], maiorPet.toUpperCase())
confere('a tabela não traz mais a coluna de dispersão em %', 'sem coluna de %', (await texto(mm + ' thead')).includes('DISPERSÃO') ? 'tem coluna de %' : 'sem coluna de %')
confere('sequência: o CRZ da Mundo Pet pula', ['pula de', '(14/10/2026)'], await texto('.painel:has(h2:has-text("Sequência do equipamento fiscal"))'))

/* 8. fechar outubro */
novoPasso('Fechar outubro/2026', 'Triangulação → Fechar o mês', [])
await p.selectOption('#mes-fechar', '2026-10'); await p.click('#fechar-mes'); await p.waitForTimeout(900)
confere('outubro entra no histórico', '10/2026 fechado: 5 lojista(s) no histórico', await texto('#progresso'))

/* 9. cruzamento */
novoPasso('Conferir o cruzamento final', 'Triangulação → Cruzamento final', [])
const cz = '.painel:has(h2:has-text("Cruzamento final"))'
const cruz = [
  ['Trilha 01/2025: as 4 fontes fecham', L.TRILHA.f, '01/2025', ['As 4 fontes fecham', 'TUDO FECHA']],
  ['Bela 03/2025: Z e PDV acima do livro', L.BELA.f, '03/2025', ['INVESTIGAR']],
  ['Café 05/2025: extrato do Simples acima da ficha', L.CAFE.f, '05/2025', ['extrato do Simples', 'INVESTIGAR']],
  ['Ótica 05/2025: sem livro de saídas não há referência', L.OTICA.f, '05/2025', ['sem apurado nem redução Z', 'FONTES DE MENOS']],
  ['Vértice 10/2026 (fechado): referência é a Z', L.VERTICE.f, '10/2026', ['fechado', 'redução Z', 'INVESTIGAR']],
]
for (const [item, c, comp, esp] of cruz) confere(item, esp, await linha(cz, c, comp))

/* 10. dashboard */
novoPasso('Ver o Dashboard', 'Dashboard', [])
await aba('dashboard')
confere('o dashboard reflete a simulação', ['LIVROS RECEBIDOS', 'TRIANGULAÇÃO: MESES FECHADOS (10/2026)'], await texto('#conteudo > .cards'))

confere('nenhum erro de JavaScript na página', 'nenhum', erros.length ? erros.join(' | ') : 'nenhum')
await navegador.close()

const todas = passos.flatMap(x => x.conferencias)
const falhas = todas.filter(c => !c.ok && c.obrigatorio)
writeFileSync(join(sim, '.resultado.json'), JSON.stringify({ geradoEm: new Date().toISOString().slice(0, 10), ocr: ocrOk, passos }, null, 2))
console.log(`\n${todas.length} conferências, ${falhas.length} falha(s)${ocrOk ? '' : ' — OCR sem internet: a foto não foi conferida'}`)
process.exit(falhas.length ? 1 : 0)
