#!/usr/bin/env node
/**
 * Vídeo vertical do passo a passo completo, da carteira de lojistas e da
 * notificação ao cruzamento final, passando por todas as abas. A câmera
 * (gravação, narração, destaques, pós-produção) está em video-celular.mjs.
 *
 *   node scripts/gerar-demo.mjs             (uma vez, para criar os arquivos)
 *   node scripts/gravar-video-celular.mjs   -> demo/apurador-fiscal-celular.mp4
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gravacao } from './video-celular.mjs'

const demo = join(dirname(fileURLToPath(import.meta.url)), '..', 'demo')
const { p, pausa, fala, aponta, caixa, limpa, falaVarrendo, cliqueVisivel, aceitar, confirmar, cartela, ficha, topo, aba, linhaDe, painel, finalizar } =
  await gravacao({ nome: 'apurador-fiscal-celular', arquivos: ['livro-entradas-2025.pdf', 'livro-saidas-2025.pdf', 'vendas-informadas.xlsx',
    'reducao-z-marco-2025.pdf', 'pdv-marco-2025.pdf', 'napp-marco-2025.xlsx', 'lojistas.csv'] })

/* o ciclo abre em 1º de abril: outubro é o 7º mês, e a narração acompanha a data da gravação */
const ORDINAL = ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto', 'sétimo', 'oitavo', 'nono', 'décimo', 'décimo primeiro', 'décimo segundo']
const mesDoCiclo = (new Date().getMonth() - 3 + 12) % 12 + 1

/* 1. abertura */
await cartela('Radar de Auditoria',
  'Acelerador de auditoria de lojistas, versão 2.1.\nPasso a passo no celular: carteira, notificações, societário, triangulação, auditoria, dashboard e a base fictícia de teste.', 6400)
await fala('Antes de começar',
  'Os dados aqui são fictícios. Duas cadências convivem: a triangulação é diária ou semanal e fecha por mês; a auditoria fiscal é anual e abre todo 1º de abril.')

/* 2. lojistas */
await aba('lojistas')
await aponta('#drop-lojistas')
await fala('Lojistas — a carteira do shopping',
  'Primeiro passo, uma vez só: a relação de lojistas. Planilha com CNPJ, loja, LUC, e-mail e WhatsApp — as colunas são reconhecidas pelo cabeçalho.')
await p.evaluate(() => document.querySelector('#drop-lojistas').classList.add('ativo'))
await pausa(400)
await p.setInputFiles('#in-lojistas', join(demo, 'lojistas.csv'))
await pausa(1200)
await confirmar('a carteira entrou com 8 lojistas', 'ul.avisos', ['8 lojista(s)', '8 novo(s)'])
await aponta('ul.avisos', 6)
await fala('Oito lojistas na carteira',
  'CNPJ com dígito verificador errado é recusado e avisado. Loja fechada vira inativa e sai do painel sem perder histórico.')
await limpa()

/* 3. painel */
await aba('painel')
await confirmar('o painel abre no ciclo 2026', '.faixa-ciclo', ['Ciclo 2026', 'livros de 2025'])
await aponta('.faixa-ciclo', 8)
await fala('Painel — o ciclo anual',
  'Estamos no ciclo 2026, que audita os livros de 2025, aberto em 1º de abril. O painel mostra quem entregou, quem foi auditado, negociado e cobrado.')
await confirmar('ninguém entregou ainda', '.cards', ['NÃO RECEBIDOS 8', 'NOTIFICAÇÕES DEVIDAS 8'])
await aponta('.cards', 8)
await fala('Ninguém entregou ainda',
  `Oito não recebidos e oito notificações devidas. É o ${ORDINAL[mesDoCiclo - 1]} mês do ciclo e o fluxo de cobrança já deveria ter começado.`)
await limpa()

/* 4. notificações: o envio */
await aba('notificacoes')
await aponta(painel('Como funciona o fluxo'), 6)
await fala('Notificações — uma etapa por mês',
  'Para quem não entregou: 1ª notificação em abril, 2ª em maio, 3ª em junho, aviso de multa em julho e o comando de enviar a multa em agosto.')
await limpa()
await cliqueVisivel('[data-ver-texto]')
await confirmar('o texto pede os livros de 2025', '.texto-notif', ['Auditoria de vendas 2025', 'livros fiscais', 'ficha de vendas informadas'])
await aponta('.texto-notif', 6)
await fala('O envio da ficha ao lojista',
  'O texto sai pronto: pede os livros de Entradas e Saídas de 2025 e a ficha de vendas informadas, com prazo. Vai por e-mail ou WhatsApp com um toque; a data fica registrada ao confirmar.')
await limpa()
await cliqueVisivel('[data-registrar]')
await confirmar('a 1ª notificação foi registrada', '#conteudo', ['1ª notificação — 7 lojista(s)', '2ª notificação — 1 lojista(s)'])
await aponta(painel('2ª notificação'), 6)
await fala('Registrado',
  'A Bela Cosméticos já recebeu a primeira. Como entrou atrasada no fluxo, a segunda já está devida — a página conta quantas etapas acumularam.')
await limpa()

/* 4b. societário: mudança de sócios e taxa de transferência */
await aba('societario')
await p.waitForSelector('.soc')
await fala('Societário — mudança de sócios e taxa de transferência',
  'Loja que muda de mãos costuma dever a taxa de transferência do contrato. A ferramenta não consulta a Junta sozinha: ela abre a Junta do estado do contrato com o CNPJ copiado, e você registra o que encontrou.')
await aponta('.racional', 6)
await fala('O racional',
  'Quatro possíveis causas de taxa: alteração de capital social, de sócio ou administrador, entrada ou saída de sócio, e de objeto social. Dois cuidados: triar todas as lojas de graça e pagar a guia só de quem pode caracterizar a taxa; e olhar só as alterações a partir do início do contrato.')
await limpa()
const bela = '.soc:has-text("Bela Cosméticos"):not(:has-text("quiosque"))'
await aponta(bela + ' a.botao:has-text("JUCESP")', 8)
await fala('Pesquisar na Junta',
  'A Bela tem contrato em São Paulo: o botão abre a JUCESP. Ao lado, a busca de apoio e a consulta da Receita, que mostra o quadro de sócios de qualquer CNPJ.')
await limpa()
await cliqueVisivel('.guia-junta summary')
await confirmar('o passo a passo da Junta tem as três etapas', '.guia-junta', ['Certidão de Inteiro Teor', 'gratuita', 'paga'])
await aponta('.guia-junta', 6)
await fala('O passo a passo da Junta',
  'Aberto aqui, o roteiro da pesquisa em três etapas: triagem gratuita da ficha cadastral, pedido pago da certidão de inteiro teor só para quem tem indício, e o download da certidão. Os nomes dos menus mudam de uma Junta para outra.')
await limpa()
await p.evaluate(() => { const d = document.querySelector('.guia-junta'); if (d) d.open = false })
await pausa(300)
await p.selectOption(bela + ' select[data-soc="houveMudanca"]', 'sim'); await pausa(400)
await p.fill(bela + ' input[data-soc="dataMudanca"]', '2026-06-10')
await p.locator(bela + ' input[data-soc="dataMudanca"]').dispatchEvent('change'); await pausa(400)
await p.selectOption(bela + ' select[data-soc="tipo"]', 'entrada_saida'); await pausa(500)
await confirmar('a mudança foi sinalizada', bela + ' .nome', ['MUDANÇA NOS ÚLTIMOS 12 MESES'])
await aponta(bela + ' .validacao', 6)
await fala('Sinalizado: agora o time valida',
  'Cessão de quotas em junho, dentro dos últimos 12 meses: o lojista fica sinalizado. O time responde se há isenção no contrato, qual o limite para conferência e a taxa prevista.')
await p.selectOption(bela + ' select[data-soc="isencao"]', 'nao'); await pausa(300)
await p.fill(bela + ' input[data-soc="limite"]', 'até 25% das quotas entre sócios atuais')
await p.locator(bela + ' input[data-soc="limite"]').dispatchEvent('change'); await pausa(300)
await p.fill(bela + ' input[data-soc-valor="taxa"]', '15000')
await p.locator(bela + ' input[data-soc-valor="taxa"]').dispatchEvent('change'); await pausa(300)
await limpa()
await cliqueVisivel(bela + ' [data-soc-acao="cobrar"]')
await aceitar()
await confirmar('a taxa entrou em cobrança', bela + ' .nome', ['TAXA EM COBRANÇA'])
await confirmar('a 1ª notificação da taxa ficou devida', painel('Notificações da taxa'), ['Bela Cosméticos', 'taxa de transferência'])
await cliqueVisivel('[data-ver-texto$="|taxa"]')
await confirmar('o texto cita a alteração e a taxa', '.texto-notif', ['Taxa de transferência', '10/06/2026', 'R$ 15.000,00', '25% das quotas'])
await aponta('.texto-notif', 6)
await fala('O mesmo fluxo, com o texto da taxa',
  'Confirmada a cobrança, nasce o mesmo fluxo de cinco etapas da auditoria: o texto já cita a alteração, a data, o limite do contrato e a taxa prevista. Depois, negociado e cobrado.')
await limpa()
await cliqueVisivel('[data-registrar$="|taxa"]')
await pausa(500)
await confirmar('o checklist da skill acompanha a Bela', bela + ' .checklist-tt', ['Checklist 3/7'])
await aponta(bela + ' .checklist-tt', 6)
await fala('O checklist por lojista',
  'Cada cartão traz o checklist da pesquisa: três de sete itens feitos. Início do contrato e gatilho já contam; faltam confirmar o NIRE, listar os atos posteriores ao contrato, pedir e baixar a certidão.')
await limpa()

/* 5. triangulação (antes da auditoria: entra dia a dia, sem esperar os livros) */
await aba('triangulacao')
await p.waitForSelector('#drop-z')
await fala('Triangulação — diária ou semanal, fechada por mês',
  'Enquanto os livros não chegam, a triangulação já trabalha: a redução Z e o relatório do PDV entram conforme saem da loja, e cada mês é fechado quando termina.')
await aponta('#drop-z')
await fala('Redução Z — só PDF ou foto',
  'O cupom de fechamento diário do equipamento fiscal, do jeito que sai da impressora. Planilha e SPED não entram aqui.')
await p.evaluate(() => document.querySelector('#drop-z').classList.add('ativo'))
await pausa(400)
await p.setInputFiles('#in-z', join(demo, 'reducao-z-marco-2025.pdf'))
await p.evaluate(() => document.querySelector('#drop-z')?.classList.remove('ativo'))
await p.waitForFunction(() => document.querySelector('#progresso')?.style.display === 'none', { timeout: 120000 })
await pausa(600)
await confirmar('30 reduções Z lidas do PDF', '.arquivo:has-text("reducao-z") .meta', ['Redução Z impressa', '30 redução(ões) Z', '03/2025'])
await limpa()
await aponta('#drop-pdv')
await fala('Relatório do PDV — só PDF ou foto',
  'O fechamento do sistema de caixa. É registro de gestão, não fiscal — por isso ele não tem por que esconder venda.')
await p.evaluate(() => document.querySelector('#drop-pdv').classList.add('ativo'))
await pausa(400)
await p.setInputFiles('#in-pdv', join(demo, 'pdv-marco-2025.pdf'))
await p.evaluate(() => document.querySelector('#drop-pdv')?.classList.remove('ativo'))
await p.waitForFunction(() => document.querySelector('#progresso')?.style.display === 'none', { timeout: 120000 })
await pausa(600)
await confirmar('31 dias de PDV lidos do PDF', '.arquivo:has-text("pdv-marco") .meta', ['PDV impresso', '31 dia(s) de PDV', '0001-81'])
await limpa()
await aponta('#drop-napp')
await fala('NAPP — o quarto tipo de lançamento',
  'O NAPP chega em planilha diária, Excel ou CSV: é o único lançamento da triangulação que entra em planilha. Quando vem pelo número da loja, o app liga ao lojista pela carteira.')
await p.evaluate(() => document.querySelector('#drop-napp').classList.add('ativo'))
await pausa(400)
await p.setInputFiles('#in-napp', join(demo, 'napp-marco-2025.xlsx'))
await p.evaluate(() => document.querySelector('#drop-napp')?.classList.remove('ativo'))
await p.waitForFunction(() => document.querySelector('#progresso')?.style.display === 'none', { timeout: 120000 })
await pausa(600)
await confirmar('31 dias de NAPP, ligados à Bela pela loja 101', '.arquivo:has-text("napp-marco") .meta', ['Tabular (NAPP)', '31 dia(s) de NAPP', '11.222.333/0001-81'])
await aponta('.arquivo:has-text("napp-marco") .meta', 8)
await fala('Ligado pela loja 101',
  'A planilha não traz CNPJ, só o número da loja. A loja 101 está na carteira: é a Bela Cosméticos.')
await limpa()

await confirmar('os totais da triangulação, ainda sem o declarado', '.cards', ['REDUÇÃO Z R$ 121.196,00', 'PDV R$ 129.076,00', 'NAPP R$ 129.076,00'])
await aponta('.cards', 10)
await fala('Três números para a mesma venda — por enquanto',
  'Redução Z: 121.196. PDV e NAPP: 129.076 cada. Já não batem. O quarto, o declarado, vem da ficha do lojista, que entra na auditoria fiscal — logo mais.')
await limpa()
await confirmar('a sequência do ECF acusa a Z ausente', painel('Sequência do equipamento'),
  ['629', '631', 'R$ 8.211,00', 'R$ 4.591,00', 'R$ 3.620,00'])
await aponta(painel('Sequência do equipamento') + ' ul.avisos', 8)
await fala('Duas conferências que só a Z permite',
  'O contador CRZ pulou de 629 para 631: falta uma redução Z. E o Grande Total avançou 8.211 num dia de venda 4.591 — sobram 3.620 reais sem cupom.')
await limpa()
const mes = painel('Mês a mês')
await confirmar('março está DISPERSO só com Z e PDV', linhaDe('03/2025', '0001-81', mes),
  ['R$ 121.196,00', 'R$ 129.076,00', 'MAIOR', 'R$ 7.880,00', 'DISPERSO'])
await aponta(linhaDe('03/2025', '0001-81', mes), 4)
await falaVarrendo('O maior valor e a variação em reais',
  'O maior valor do mês fica em destaque: PDV e NAPP empatam em 129.076. A variação entre os lançamentos é de 7.880 reais — é ela, em reais, que define o status.',
  linhaDe('03/2025', '0001-81', mes))
await fala('A direção é a informação',
  'PDV acima da Z é venda que o caixa registrou e o equipamento fiscal não. É o alerta mais sério desta aba.')
await limpa()
const dia = painel('Dia a dia')
await confirmar('14/03 é o pior dia', dia + ' tbody tr:first-child', ['14/03/2025', 'R$ 3.494,00', 'R$ 4.954,00'])
await aponta(dia + ' tbody tr:first-child', 4)
await falaVarrendo('Dia a dia, o pior primeiro',
  'No dia 14 a Z registrou 3.494; o PDV e o NAPP, 4.954: 1.460 reais a mais no caixa. Dias 12 e 13 têm o mesmo padrão.',
  dia + ' tbody tr:first-child')
await limpa()

/* 6. auditoria: recebimento da ficha e dos livros */
await aba('dados')
await aponta('#drop-livros')
await fala('Auditoria fiscal — a ficha voltou, com os livros',
  'A parte anual. Toque na área e escolha os dois livros: Entradas e Saídas. Aceita PDF, SPED em .txt, Excel, CSV e foto. As devoluções de venda estão no de Entradas — por isso os dois.')
await p.evaluate(() => document.querySelector('#drop-livros').classList.add('ativo'))
await p.evaluate(c => window.__demo.cursorCaixa(c), await caixa('#drop-livros'))
await pausa(700)
await p.setInputFiles('#in-livros', [join(demo, 'livro-entradas-2025.pdf'), join(demo, 'livro-saidas-2025.pdf')])
await p.evaluate(() => { document.querySelector('#drop-livros')?.classList.remove('ativo'); window.__demo.esconderCursor() })
await p.waitForFunction(() => document.querySelector('#progresso')?.style.display === 'none', { timeout: 120000 })
await pausa(700)
await confirmar('os dois livros foram lidos', '.arquivo:has-text("livro-saidas") .meta',
  ['Livro fiscal impresso', '2 CNPJ', '01/2025–03/2025'])
await aponta('.arquivo:has-text("livro-saidas") .meta', 8)
await fala('Confira o que foi lido',
  'Formato reconhecido, lançamentos, CNPJ encontrados e o intervalo de competências. Se isto estiver errado, o resto estará também.')
await limpa()
await aponta('#drop-planilha')
await fala('A ficha preenchida',
  'Agora a ficha que voltou do lojista: CNPJ, competência e valor por linha. O cabeçalho é reconhecido sozinho.')
await p.evaluate(() => document.querySelector('#drop-planilha').classList.add('ativo'))
await pausa(500)
await p.setInputFiles('#in-planilha', join(demo, 'vendas-informadas.xlsx'))
await p.evaluate(() => document.querySelector('#drop-planilha')?.classList.remove('ativo'))
await pausa(1400)
await confirmar('a ficha foi lida com 4 linhas', '.arquivo:has-text("vendas-informadas") .meta', ['4 linha(s) de venda', '2 CNPJ'])
await aponta('.arquivo:has-text("vendas-informadas") .meta', 8)
await fala('Quatro linhas, dois CNPJ',
  'Repare: a filial não informou fevereiro. O sistema vai apontar isso sozinho.')
await limpa()

/* 7. conciliação */
await aba('resultado')
await p.waitForSelector('tbody tr')
await aponta('.cards', 10)
await fala('Conciliação — o resultado em uma olhada',
  'Total apurado pelo livro, total informado na ficha, a diferença e quantos meses pedem atenção.')
await limpa()
const conc = painel('Conciliação por CNPJ')
await confirmar('janeiro fecha em 115.500', linhaDe('01/2025', '0001-81', conc),
  ['R$ 120.000,00', 'R$ 4.500,00', 'R$ 115.500,00', 'OK'])
await aponta(linhaDe('01/2025', '0001-81', conc), 4)
await falaVarrendo('Um mês que fecha',
  'Arraste a linha para o lado: 120 mil de venda, menos 4.500 de devolução, dá 115.500 — o que a ficha informa. Status OK.',
  linhaDe('01/2025', '0001-81', conc))
await confirmar('fevereiro diverge em 40 mil', linhaDe('02/2025', '0001-81', conc),
  ['R$ 138.500,00', 'R$ 98.500,00', 'R$ 40.000,00', 'DIVERGENTE'])
await aponta(linhaDe('02/2025', '0001-81', conc), 4)
await falaVarrendo('Um mês que não fecha',
  'O livro registra 138.500 e a ficha informa 98.500. Faltam 40 mil, quase 29%: DIVERGENTE.',
  linhaDe('02/2025', '0001-81', conc))
await confirmar('fevereiro da filial só existe no livro', linhaDe('02/2025', '0002-62', conc),
  ['R$ 52.000,00', 'SÓ NA APURAÇÃO'])
await aponta(linhaDe('02/2025', '0002-62', conc), 4)
await falaVarrendo('O mês que a ficha não trouxe',
  'SÓ NA APURAÇÃO: houve venda escriturada e a ficha não trouxe o mês. É o caso que mais merece explicação do lojista.',
  linhaDe('02/2025', '0002-62', conc))
await limpa()

/* 8. painel marcou sozinho */
await aba('painel')
await confirmar('a Bela virou AUDITADO sozinha', 'tr:has-text("Bela Cosméticos")', ['AUDITADO', '✦'])
await confirmar('os cards refletem', '.cards', ['NÃO RECEBIDOS 6', 'AUDITADOS 2'])
await aponta('tr:has-text("Bela Cosméticos")', 4)
await falaVarrendo('O painel marcou sozinho',
  'Livro carregado e conciliado: a Bela e o quiosque passaram a AUDITADO com a data de hoje, marcada com ✦. Negociado e cobrado você preenche à mão, com os valores.',
  'tr:has-text("Bela Cosméticos")')
await limpa()

/* 9. de volta à triangulação: o declarado entrou */
await aba('triangulacao')
await p.waitForSelector('#drop-z')
await confirmar('com a ficha, o declarado entrou', '.cards', ['R$ 121.196,00', 'R$ 129.076,00', 'R$ 108.050,00'])
await aponta('.cards', 10)
await fala('Agora são três números',
  'Com a ficha carregada, o declarado entrou: 108.050. Redução Z 121.196, PDV e NAPP 129.076. Os quatro deveriam contar a mesma história — e não contam.')
await limpa()
await confirmar('março: 21.026 abaixo do maior valor', linhaDe('03/2025', '0001-81', mes),
  ['R$ 108.050,00', 'R$ 21.026,00', 'DISPERSO'])
await aponta(linhaDe('03/2025', '0001-81', mes), 4)
await falaVarrendo('A venda que não chegou à ficha',
  'O declarado ficou 21.026 reais abaixo do maior valor, o do PDV e do NAPP. É venda registrada no caixa que não chegou inteira à ficha.',
  linhaDe('03/2025', '0001-81', mes))
await limpa()

/* 10. fechar o mês */
await aponta('.fechar', 8)
await fala('Fechar o mês',
  'Terminou março? Fechar o mês grava Z, PDV, NAPP, declarado, o maior valor e os alertas no histórico. Fechar de novo substitui.')
await cliqueVisivel('#fechar-mes')
await pausa(600)
await confirmar('março entrou no histórico', painel('Histórico da triangulação'), ['03/2025', 'Bela Cosméticos', 'R$ 121.196,00', 'DISPERSO'])
await aponta(painel('Histórico da triangulação') + ' tbody tr:first-child', 4)
await falaVarrendo('O histórico',
  'Uma linha por lojista e mês fechado. É este histórico que o cruzamento final usa contra a auditoria anual — e ele fica guardado neste aparelho.',
  painel('Histórico da triangulação') + ' tbody tr:first-child')
await limpa()

/* 11. cruzamento final */
const cruz = painel('Cruzamento final')
await confirmar('o cruzamento final resume', cruz + ' .cards', ['INVESTIGAR 2', 'TUDO FECHA 1', 'FONTES DE MENOS 1'])
await aponta(cruz + ' .cards', 8)
await fala('Cruzamento final — histórico contra auditoria',
  'Todas as fontes numa linha: apurado, Z, PDV, NAPP e informado. A referência é o apurado, que é o que o fisco já tem.')
await confirmar('março pede investigação', linhaDe('03/2025', '0001-81', cruz), ['INVESTIGAR', 'fechado'])
await aponta(linhaDe('03/2025', '0001-81', cruz), 4)
await falaVarrendo('O veredito',
  'Março, vindo do histórico fechado: INVESTIGAR. Livro e ficha batem entre si em 108.050, mas Z e PDV dizem que a venda foi maior.',
  linhaDe('03/2025', '0001-81', cruz))
await confirmar('fevereiro da filial tem fontes de menos', linhaDe('02/2025', '0002-62', cruz), ['FONTES DE MENOS'])
await aponta(linhaDe('02/2025', '0002-62', cruz), 4)
await falaVarrendo('Uma fonte só não prova nada',
  'Fevereiro da filial tem só o livro. Fica em FONTES DE MENOS, e não em "tudo fecha": ausência de divergência não é prova de acerto.',
  linhaDe('02/2025', '0002-62', cruz))
await limpa()

/* 11b. dashboard */
await aba('dashboard')
await p.waitForSelector('.dash')
await confirmar('o dashboard resume os três processos', '#conteudo > .cards', ['LIVROS RECEBIDOS 25%', 'APURADOS 25%', 'PESQUISADOS NA JUNTA 12,5%'])
await aponta('#conteudo > .cards', 8)
await fala('Dashboard — os três processos numa tela',
  'Um quarto da carteira entregou e foi apurada, um oitavo foi pesquisado na Junta. Os números saem do que você registrou nas outras abas: nada é digitado aqui.')
await limpa()
await aponta('.dash svg.grafico', 6)
await fala('A evolução do ciclo',
  'O gráfico acumula, mês a mês do ciclo, quantos livros foram recebidos, apurados e cobrados. Toque num ponto para ver o número; cada gráfico tem também a versão em tabela.')
await limpa()
await aponta('.dash .pendencias', 6)
await fala('As pendências de cada processo',
  'Abaixo de cada processo, a lista do que falta: livros não recebidos, apurados sem negociação, meses abertos na triangulação, lojas não pesquisadas na Junta, taxa confirmada sem contato.')
await limpa()

/* 12. detalhe por CFOP e tabela */
await aba('detalhe')
await pausa(500)
await fala('Detalhe por CFOP — de onde veio cada número',
  'Todo código lido e o que ele fez com o resultado: somou, deduziu ou ficou de fora.')
await confirmar('5949 exige revisão', '#conteudo tbody tr:has(code:text-is("5949"))', ['Outra saída', 'revisão manual'])
await aponta('#conteudo tbody tr:has(code:text-is("5949"))', 4)
await falaVarrendo('O código que ninguém deve chutar',
  'O 5949 é "outra saída não especificada". Genérico demais: fica de fora e vira alerta, para você decidir.',
  '#conteudo tbody tr:has(code:text-is("5949"))')
await confirmar('5929 é contra-lançamento', '#conteudo tbody tr:has(code:text-is("5929"))', ['R$ 110.250,00', 'Contra-lançamento'])
await aponta('#conteudo tbody tr:has(code:text-is("5929"))', 4)
await falaVarrendo('O que dobraria o faturamento',
  'O 5929 é o espelho de uma venda já registrada no cupom. Somar os dois contaria a mesma venda duas vezes. Fica de fora.',
  '#conteudo tbody tr:has(code:text-is("5929"))')
await limpa()
await aba('tabela')
await p.waitForSelector('#tab-cfop')
await fala('Tabela de códigos — discorda de uma regra?',
  'A classificação é editável. Mude o tratamento de qualquer CFOP e o cálculo refaz na hora; a regra fica salva só neste aparelho.')

/* 12b. base fictícia para o time testar */
await aba('lojistas')
await aponta('[data-carregar-ficticia]', 8)
await fala('Base fictícia — para o time testar sem medo',
  'Para treinar, há uma base fictícia com 40 lojistas inventados e 27 cenários prontos. Como já existe uma carteira aqui, o app pede confirmação duas vezes antes de substituí-la.')
await limpa()
await cliqueVisivel('[data-carregar-ficticia]')
await aceitar()   // já existe uma carteira: o app pergunta duas vezes
await aceitar()
await pausa(800)
await confirmar('a base fictícia entrou', '.faixa-ficticia', ['Base fictícia de teste', '40 lojistas'])
await aponta('.faixa-ficticia', 6)
await fala('Base carregada',
  'A faixa no topo avisa que tudo é inventado, e o botão Apagar base fictícia remove tudo com a mesma dupla confirmação.')
await limpa()
await cliqueVisivel('#roteiro summary')
await confirmar('o roteiro lista os 27 cenários', '#roteiro', ['27 cenários', 'O QUE DEVE APARECER'])
await aponta('#roteiro tbody tr:first-child', 4)
await falaVarrendo('O roteiro de testes',
  'No dashboard, o roteiro diz loja a loja o que deve aparecer e em qual aba: livro multado, venda não declarada, guia a pagar, alteração anterior ao contrato, taxa isenta. Dá para baixar e dividir entre o time.',
  '#roteiro tbody tr:first-child')
await limpa()

/* 13. como funciona e fechamento */
await aba('ajuda')
await pausa(500)
await fala('Como funciona',
  'A última aba explica as duas cadências, o que fica guardado e onde, a conta, os formatos e os limites. Vale uma leitura antes da primeira auditoria de verdade.')
await p.evaluate(() => window.scrollBy({ top: 1400, behavior: 'smooth' }))
await pausa(2200)
await p.evaluate(() => window.__demo.legenda('', ''))
await pausa(400)
await cartela('Antes de concluir qualquer coisa',
  'A ferramenta aponta onde olhar. Ela não prova que o livro reflete as vendas reais, não envia nada sozinha, e não substitui a análise do seu contador.', 7000)
await p.evaluate(() => window.__demo.legenda('', ''))
await pausa(900)

await finalizar()
