#!/usr/bin/env node
/** Teste de ponta a ponta: abre index.html num Chromium e carrega arquivos de verdade. */
import { chromium } from 'playwright'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { caminhoChromium } from '../scripts/chromium.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const arquivos = process.argv.slice(2)
if (!arquivos.length) {
  console.error('uso: node test/e2e.mjs <livro1> [livro2 ...] -- <planilha.csv>')
  process.exit(2)
}
const corte = arquivos.indexOf('--')
const livros = (corte === -1 ? arquivos : arquivos.slice(0, corte)).map(p => resolve(p))
const planilha = corte === -1 ? null : resolve(arquivos[corte + 1])
for (const f of [...livros, planilha].filter(Boolean)) {
  if (!existsSync(f)) { console.error('arquivo inexistente:', f); process.exit(2) }
}

const executablePath = caminhoChromium()
const navegador = await chromium.launch(executablePath ? { executablePath } : {})
const pagina = await navegador.newPage()
const erros = []
pagina.on('pageerror', e => erros.push('pageerror: ' + e.message))
pagina.on('console', m => { if (m.type() === 'error') erros.push('console: ' + m.text()) })
const rede = []
pagina.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('blob:') && !r.url().startsWith('data:')) rede.push(r.url()) })

await pagina.goto(pathToFileURL(join(raiz, 'index.html')).href)
await pagina.waitForSelector('nav.abas')
// desde a 2.0 os arquivos fiscais vivem na aba Auditoria fiscal
await pagina.click('nav.abas button[data-aba="auditoria"]')
await pagina.waitForSelector('#drop-livros')

await pagina.setInputFiles('#in-livros', livros)
await pagina.waitForFunction(() => !document.querySelector('#progresso') || document.querySelector('#progresso').style.display === 'none', { timeout: 120000 })
if (planilha) {
  await pagina.setInputFiles('#in-planilha', planilha)
  await pagina.waitForTimeout(1500)
}

const arquivosLidos = await pagina.$$eval('.arquivo', els => els.map(e => ({
  meta: e.querySelector('.meta').textContent.replace(/\s+/g, ' ').trim(),
  avisos: [...e.querySelectorAll('ul.avisos li')].map(li => li.textContent.replace(/\s+/g, ' ').trim()),
})))
console.log('\n== arquivos lidos ==')
arquivosLidos.forEach(a => {
  console.log(' ·', a.meta)
  a.avisos.forEach(v => console.log('     aviso:', v))
})

await pagina.click('nav.subabas button[data-subaba="resultado"]')
await pagina.waitForSelector('table')
const cards = await pagina.$$eval('.card', els => els.map(e => e.querySelector('.rot').textContent + ': ' + e.querySelector('.val').textContent))
console.log('\n== resumo ==')
cards.forEach(c => console.log(' ·', c))

const linhas = await pagina.$$eval('tbody tr', trs => trs.map(tr => [...tr.querySelectorAll('td')].slice(0, 9).map(td => td.childNodes[0] ? td.childNodes[0].textContent.trim() : td.textContent.trim())))
console.log('\n== conciliação ==')
linhas.forEach(l => console.log(' ', l.join(' | ')))

await pagina.click('nav.subabas button[data-subaba="detalhe"]')
await pagina.waitForTimeout(300)
const detalhe = await pagina.$$eval('#conteudo tbody tr', trs => trs.slice(0, 40).map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim()).join(' | ')))
console.log('\n== detalhe por CFOP (primeiras linhas) ==')
detalhe.forEach(l => console.log('  ', l))

await pagina.click('nav.abas button[data-aba="tabela"]')
await pagina.waitForSelector('#tab-cfop')
const nCfop = await pagina.$$eval('#tab-cfop tbody tr', t => t.length)
console.log('\ntabela de códigos:', nCfop, 'CFOP')

console.log('\nrequisições de rede externas:', rede.length ? rede : 'nenhuma ✅')
if (erros.length) { console.log('\n❌ ERROS:'); erros.forEach(e => console.log('  ', e)) }
await navegador.close()
process.exit(erros.length ? 1 : 0)
