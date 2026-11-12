#!/usr/bin/env node
/**
 * Vídeo vertical curto só com as mudanças mais recentes — hoje, o item 1 do
 * pedido de ajustes: a Triangulação com o NAPP, o maior valor em destaque e a
 * leitura pela maior variação em R$. Usa a base fictícia e os arquivos da
 * simulação (demo/simulacao/3-triangulacao), que já trazem os casos.
 *
 *   node scripts/gerar-simulacao.mjs          (uma vez, para criar os arquivos)
 *   node scripts/gravar-video-novidades.mjs   -> demo/radar-novidades.mp4
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gravacao } from './video-celular.mjs'

const demo = join(dirname(fileURLToPath(import.meta.url)), '..', 'demo')
const T = 'simulacao/3-triangulacao/'
const Z = ['lume-joias', 'vertice-calcados', 'mundo-pet'].map(n => `${T}${n}-reducao-z-2026-10.pdf`)
const PDV = ['lume-joias', 'vertice-calcados', 'mundo-pet'].map(n => `${T}${n}-pdv-2026-10.pdf`)
const NAPP = `${T}napp-vendas-diarias-2026-10.xlsx`
const FICHA = `${T}ficha-vendas-informadas-2026-10.xlsx`

const { p, pausa, fala, aponta, limpa, falaVarrendo, cliqueVisivel, confirmar, cartela, topo, aba, linhaDe, painel, finalizar } =
  await gravacao({ nome: 'radar-novidades', arquivos: [...Z, ...PDV, NAPP, FICHA] })
const esperaLeitura = () => p.waitForFunction(() => document.querySelector('#progresso')?.style.display === 'none', { timeout: 120000 })

// os lojistas da base fictícia usados aqui
const LUME = '17.385.654/0001-83'; const VERTICE = '24.538.526/0001-98'; const PET = '80.230.013/0001-96'

/* abertura */
await cartela('Novidades: Triangulação',
  'Item 1 dos 5 ajustes pedidos:\nNAPP como tipo de lançamento, maior valor em destaque e leitura em reais.', 5600)
await fala('O que mudou',
  'Três mudanças na triangulação: o NAPP entrou como quarto tipo de lançamento, o maior valor fica em destaque e o status passa a vir da maior variação em reais, e não do percentual.')

/* preparação: base fictícia e a ficha de outubro */
await aba('lojistas')
await cliqueVisivel('[data-carregar-ficticia]')
await pausa(600)
await confirmar('a base fictícia entrou', '.faixa-ficticia', ['Base fictícia de teste', '40 lojistas'])
await fala('Para mostrar, a base fictícia',
  'Uso a base fictícia, com 40 lojistas inventados. A ficha de vendas de outubro entra na auditoria fiscal e vira o declarado da triangulação.')
await aba('dados')
await p.setInputFiles('#in-planilha', join(demo, FICHA))
await pausa(1500)
await limpa()

/* as três caixas */
await aba('triangulacao')
await p.waitForSelector('#drop-napp')
await aponta('.grade3', 6)
await fala('Agora são três caixas',
  'Redução Z e relatório de PDV continuam só em PDF ou foto, como saem da loja. A terceira caixa é a do NAPP.')
await limpa()
await p.setInputFiles('#in-z', Z.map(f => join(demo, f))); await esperaLeitura(); await pausa(800)
await p.setInputFiles('#in-pdv', PDV.map(f => join(demo, f))); await esperaLeitura(); await pausa(800)
await aponta('#drop-napp')
await fala('NAPP: planilha diária',
  'O NAPP é o único lançamento da triangulação que entra em planilha: Excel ou CSV, um valor por dia, com o CNPJ ou com o número da loja.')
await p.evaluate(() => document.querySelector('#drop-napp').classList.add('ativo'))
await pausa(400)
await p.setInputFiles('#in-napp', join(demo, NAPP))
await p.evaluate(() => document.querySelector('#drop-napp')?.classList.remove('ativo'))
await esperaLeitura(); await pausa(700)
const cartaoNapp = '.arquivo:has-text("napp-vendas-diarias")'
await confirmar('o NAPP entrou pelo número da loja', cartaoNapp, ['Tabular (NAPP)', '76 dia(s) de NAPP', '3 CNPJ'])
await aponta(cartaoNapp + ' .meta', 8)
await fala('Ligado pela carteira',
  'A planilha traz o número da loja, não o CNPJ. O app procura a loja na carteira e liga ao lojista: três lojas, 76 dias de venda.')
await limpa()
await confirmar('a loja fora da carteira é avisada', cartaoNapp, ['Loja(s) 999 sem CNPJ na carteira'])
await aponta(cartaoNapp + ' ul.avisos', 6)
await fala('Loja que não está na carteira',
  'A loja 999 não está cadastrada: ela fica avisada aqui e fora da conta, até alguém cadastrá-la na aba Lojistas.')
await limpa()

/* cards */
await confirmar('os cards trazem NAPP e o não declarado', '.cards', ['NAPP', 'NÃO DECLARADO (MAIOR − DECLARADO)'])
await aponta('.cards', 8)
await fala('Novos cards',
  'Os cards ganharam o total do NAPP e o não declarado: quanto o maior valor passa do que foi declarado na ficha.')
await limpa()

/* mês a mês */
const mes = painel('Mês a mês')
await confirmar('Mundo Pet: o NAPP é o maior', linhaDe('10/2026', PET, mes), ['R$ 94.675,00', 'MAIOR', 'R$ 6.365,00', 'R$ 2.463,37', 'DISPERSO'])
await aponta(linhaDe('10/2026', PET, mes), 4)
await falaVarrendo('O maior valor em destaque',
  'Na Mundo Pet o maior valor do mês é o NAPP, 94.675, destacado e com a palavra maior. A variação entre os lançamentos é de 6.365 reais, e o não declarado, 2.463.',
  linhaDe('10/2026', PET, mes))
await limpa()
await confirmar('Vértice: PDV e NAPP empatam no maior', linhaDe('10/2026', VERTICE, mes), ['R$ 140.675,00', 'R$ 8.500,00', 'DISPERSO'])
await aponta(linhaDe('10/2026', VERTICE, mes), 4)
await falaVarrendo('Empate no maior',
  'Na Vértice, PDV e NAPP empatam em 140.675: os dois ficam em destaque. São 8.500 reais acima da redução Z e acima do declarado.',
  linhaDe('10/2026', VERTICE, mes))
await limpa()
await confirmar('Lume: tudo igual, sem destaque', linhaDe('10/2026', LUME, mes), ['R$ 110.725,00', 'R$ 0,00', 'COERENTE'])
await aponta(linhaDe('10/2026', LUME, mes), 4)
await fala('Tudo igual, nada destacado',
  'Na Lume Joias os quatro lançamentos são iguais. Não há maior valor para destacar, e a linha fica coerente.')
await limpa()
await confirmar('a coluna de dispersão em % saiu', mes + ' thead', ['VARIAÇÃO R$', 'NÃO DECLARADO R$'])
await aponta(mes + ' thead', 4)
await fala('Sem foco no percentual',
  'A coluna de dispersão em percentual e as barras de percentual saíram. O percentual só aparece se você parar o dedo, ou o mouse, sobre a variação.')
await limpa()

/* limites em R$ */
const limites = '#limites-tri'
await cliqueVisivel(limites + ' summary')
await confirmar('os limites em reais', limites, ['R$ 100,00 coerente', 'R$ 1.000,00 atenção'])
await aponta(limites, 6)
await fala('O status sai da maior variação em reais',
  'No mês, até 100 reais de variação é coerente, até mil é atenção, acima disso, disperso. No dia, até 100. São valores iniciais: o time ajusta aqui, e eles valem também para o cruzamento final.')
await limpa()
await p.fill('#p-tri-atencao', '10000')
await p.locator('#p-tri-atencao').dispatchEvent('change')
await pausa(900)
await confirmar('com limite de 10 mil, a Vértice vira atenção', linhaDe('10/2026', VERTICE, mes), ['ATENÇÃO'])
await aponta(linhaDe('10/2026', VERTICE, mes), 4)
await fala('Mudou o limite, mudou o status',
  'Com o limite de atenção em 10 mil reais, a Vértice, com 8.500 de variação, passa de disperso para atenção. Volto para mil.')
await limpa()
await p.fill('#p-tri-atencao', '1000')
await p.locator('#p-tri-atencao').dispatchEvent('change')
await pausa(700)

/* dia a dia */
const dia = painel('Dia a dia')
await confirmar('o dia a dia começa pela maior variação', dia + ' tbody tr:first-child', ['24.538.526/0001-98', '12/10/2026', 'DISPERSO'])
await aponta(dia + ' tbody tr:first-child', 4)
await falaVarrendo('Dia a dia pela maior variação',
  'O dia a dia agora junta Z, PDV e NAPP e vem ordenado pela maior variação em reais. No topo, os dias em que o caixa da Vértice vendeu mais do que o cupom fiscal.',
  dia + ' tbody tr:first-child')
await limpa()

/* fechar o mês e o histórico */
await p.selectOption('#mes-fechar', '2026-10')
await cliqueVisivel('#fechar-mes')
await pausa(700)
const hist = painel('Histórico da triangulação')
await confirmar('o histórico guarda o NAPP', hist + ' thead', ['NAPP', 'VARIAÇÃO R$'])
await aponta(hist + ' thead', 4)
await fala('O fechamento guarda o NAPP',
  'Ao fechar outubro, o histórico grava também o NAPP, o maior valor e a variação. Os fechamentos antigos continuam valendo.')
await limpa()

/* dashboard */
await aba('dashboard')
await p.waitForSelector('.dash')
const triDash = 'section.dash:has(h2:has-text("Triangulação"))'
await confirmar('o dashboard tem a etapa NAPP e o gráfico em reais', triDash, ['NAPP recebido', 'VARIAÇÃO EM R$ ENTRE OS TIPOS DE LANÇAMENTO', 'Variação acima de R$'])
await aponta(triDash + ' .grade-dash', 6)
await fala('No dashboard, também em reais',
  'A triangulação do dashboard ganhou a etapa NAPP recebido, e o gráfico passou a mostrar a variação em reais por competência, com a venda não declarada na dica de cada barra.')
await limpa()
await topo()

/* fechamento */
await cartela('Próximos ajustes',
  'Societário: conferência do CNPJ do PB. Auditoria contratual. A receita na auditoria fiscal. E o dashboard por loja.', 6500)
await finalizar()
