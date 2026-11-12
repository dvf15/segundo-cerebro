// Gera renovacoes/radar-renovacoes.html a partir de src/painel.src.html, embutindo o motor e a base de exemplo.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = dirname(fileURLToPath(import.meta.url))
const motor = readFileSync(join(dir, 'motor.mjs'), 'utf8').replace(/^export (const|function) /gm, '$1 ')
const exemplo = JSON.stringify(JSON.parse(readFileSync(join(dir, 'exemplo.json'), 'utf8')))
const src = readFileSync(join(dir, 'src/painel.src.html'), 'utf8')
const out = src.replace('/*__MOTOR__*/', () => motor).replace('/*__EXEMPLO__*/', () => exemplo)
writeFileSync(join(dir, 'radar-renovacoes.html'), out)
console.log('gerado renovacoes/radar-renovacoes.html', (out.length / 1024).toFixed(0), 'KB')
