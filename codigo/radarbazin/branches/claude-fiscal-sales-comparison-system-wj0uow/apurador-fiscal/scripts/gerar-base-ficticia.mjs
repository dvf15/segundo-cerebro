#!/usr/bin/env node
/**
 * Grava a base fictícia em demo/ para quem quiser usá-la fora do botão do app:
 *   demo/base-ficticia.json         acompanhamento completo — "Restaurar cópia" no Painel
 *   demo/lojistas-base-ficticia.csv a carteira — "Arraste a relação de lojistas" na aba Lojistas
 * As datas são relativas ao dia em que o script roda (ou a DATA=aaaa-mm-dd).
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { gerarBaseFicticia, lojistasFicticiosCsv, roteiroMarkdown } from '../src/basefic.js'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const hoje = process.env.DATA ? new Date(process.env.DATA + 'T12:00:00') : new Date()
const base = gerarBaseFicticia(hoje)
writeFileSync(join(raiz, 'demo', 'base-ficticia.json'), JSON.stringify(base, null, 2))
writeFileSync(join(raiz, 'demo', 'lojistas-base-ficticia.csv'), lojistasFicticiosCsv(base))
writeFileSync(join(raiz, 'demo', 'roteiro-de-testes.md'), roteiroMarkdown(base))
console.log(`base fictícia de ${base.geradaEm}: ${base.lojistas.length} lojistas, ${base.fechamentos.length} fechamentos, ${Object.keys(base.societario).length} registros societários`)
console.log('  demo/base-ficticia.json\n  demo/lojistas-base-ficticia.csv\n  demo/roteiro-de-testes.md')
