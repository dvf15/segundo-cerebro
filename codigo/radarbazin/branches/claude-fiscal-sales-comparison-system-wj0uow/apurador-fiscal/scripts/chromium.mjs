/**
 * Onde está o Chromium do Playwright. Cada ambiente instala numa pasta com
 * número de build diferente, e três scripts precisavam saber disso — em vez de
 * repetir o caminho (e deixar um deles envelhecer), a busca vive aqui.
 *
 * CHROMIUM_PATH no ambiente vence tudo. Sem ele, procura o build instalado em
 * PLAYWRIGHT_BROWSERS_PATH (ou /opt/pw-browsers) e devolve `undefined` se não
 * achar, para o Playwright tentar a resolução dele mesmo e dar o erro dele.
 */
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const RAIZ = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers'

export function caminhoChromium () {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  let pastas = []
  try {
    pastas = readdirSync(RAIZ)
      .filter(d => /^chromium(-\d+)?$/.test(d))   // o headless_shell não serve para PDF nem vídeo
      .sort().reverse()
  } catch { return undefined }
  for (const p of pastas) {
    for (const exe of ['chrome-linux/chrome', 'chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
      const c = join(RAIZ, p, exe)
      if (existsSync(c)) return c
    }
  }
  return undefined
}
