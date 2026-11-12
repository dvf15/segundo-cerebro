/**
 * Tabela e classificação de CFOP para apuração de vendas.
 *
 * Fonte da tabela: Convênio S/Nº de 15/12/1970, Anexo (Tabela de Códigos
 * Fiscais de Operações e Prestações), com a redação dada pelo Ajuste SINIEF
 * 07/01 e alterações posteriores. Publicada pelo CONFAZ em
 * https://www.confaz.fazenda.gov.br/legislacao/convenios/1970/CV_SN_70
 *
 * A classificação de NATUREZA abaixo (o que é ou não receita de venda) é uma
 * convenção deste sistema, não um texto legal. Está explicitada em README.md
 * e pode ser sobrescrita pelo usuário em tempo de execução.
 */

export const NATUREZA = {
  VENDA: 'VENDA',                         // saída que compõe a receita bruta de venda
  DEVOLUCAO_VENDA: 'DEVOLUCAO_VENDA',     // entrada que anula venda -> deduz
  ANULACAO_SAIDA: 'ANULACAO_SAIDA',       // saída de anulação/devolução simbólica -> deduz
  NAO_VENDA: 'NAO_VENDA',                 // remessa, transferência, bonificação, compra...
  ATIVO: 'ATIVO',                         // venda de bem do ativo imobilizado
  SERVICO_ISS: 'SERVICO_ISS',             // prestação tributada pelo ISSQN
  CONTRA_LANCAMENTO: 'CONTRA_LANCAMENTO', // espelho de operação já registrada (ECF/SAT, entrega futura)
  REVISAR: 'REVISAR',                     // genérico "outras saídas" - exige análise humana
  DESCONHECIDO: 'DESCONHECIDO',
}

/** Efeito no cálculo de VENDAS LÍQUIDAS. */
export const EFEITO = {
  [NATUREZA.VENDA]: +1,
  [NATUREZA.DEVOLUCAO_VENDA]: -1,
  [NATUREZA.ANULACAO_SAIDA]: -1,
  [NATUREZA.NAO_VENDA]: 0,
  [NATUREZA.ATIVO]: 0,
  [NATUREZA.SERVICO_ISS]: 0,
  [NATUREZA.CONTRA_LANCAMENTO]: 0,
  [NATUREZA.REVISAR]: 0,
  [NATUREZA.DESCONHECIDO]: 0,
}

const GRUPOS = {
  1: { sentido: 'entrada', escopo: 'Entrada/aquisição de serviço dentro do Estado' },
  2: { sentido: 'entrada', escopo: 'Entrada/aquisição de serviço de outro Estado' },
  3: { sentido: 'entrada', escopo: 'Entrada/aquisição de serviço do exterior' },
  5: { sentido: 'saida', escopo: 'Saída/prestação de serviço dentro do Estado' },
  6: { sentido: 'saida', escopo: 'Saída/prestação de serviço para outro Estado' },
  7: { sentido: 'saida', escopo: 'Saída/prestação de serviço para o exterior' },
}

/**
 * Sufixos (3 últimos dígitos) -> { nat, desc }.
 * O primeiro dígito só define o sentido/escopo (interno, interestadual, exterior).
 */
const SUFIXO_SAIDA = {
  // --- Vendas de produção própria e de terceiros (5.1xx / 6.1xx / 7.1xx)
  '101': ['VENDA', 'Venda de produção do estabelecimento'],
  '102': ['VENDA', 'Venda de mercadoria adquirida ou recebida de terceiros'],
  '103': ['VENDA', 'Venda de produção do estabelecimento, efetuada fora do estabelecimento'],
  '104': ['VENDA', 'Venda de mercadoria de terceiros, efetuada fora do estabelecimento'],
  '105': ['VENDA', 'Venda de produção do estabelecimento que não deva por ele transitar'],
  '106': ['VENDA', 'Venda de mercadoria de terceiros que não deva por ele transitar'],
  '109': ['VENDA', 'Venda de produção do estabelecimento destinada à ZFM ou ALC'],
  '110': ['VENDA', 'Venda de mercadoria de terceiros destinada à ZFM ou ALC'],
  '111': ['VENDA', 'Venda de produção remetida anteriormente em consignação industrial'],
  '112': ['VENDA', 'Venda de mercadoria de terceiros remetida em consignação industrial'],
  '113': ['VENDA', 'Venda de produção remetida anteriormente em consignação mercantil'],
  '114': ['VENDA', 'Venda de mercadoria de terceiros remetida em consignação mercantil'],
  '115': ['VENDA', 'Venda de mercadoria de terceiros recebida anteriormente em consignação mercantil'],
  '116': ['VENDA', 'Venda de produção do estabelecimento originada de encomenda para entrega futura'],
  '117': ['VENDA', 'Venda de mercadoria de terceiros originada de encomenda para entrega futura'],
  '118': ['VENDA', 'Venda de produção entregue ao destinatário por conta e ordem do adquirente originário'],
  '119': ['VENDA', 'Venda de mercadoria de terceiros entregue por conta e ordem do adquirente originário'],
  '120': ['VENDA', 'Venda de mercadoria de terceiros entregue ao destinatário pelo vendedor remetente'],
  '122': ['VENDA', 'Venda de produção remetida para industrialização, por conta e ordem do adquirente'],
  '123': ['VENDA', 'Venda de mercadoria de terceiros remetida para industrialização, por conta e ordem do adquirente'],
  '124': ['NAO_VENDA', 'Industrialização efetuada para outra empresa'],
  '125': ['NAO_VENDA', 'Industrialização efetuada para outra empresa quando a mercadoria não transitar'],

  // --- Transferências (x.15x)
  '151': ['NAO_VENDA', 'Transferência de produção do estabelecimento'],
  '152': ['NAO_VENDA', 'Transferência de mercadoria adquirida ou recebida de terceiros'],
  '153': ['NAO_VENDA', 'Transferência de energia elétrica'],
  '155': ['NAO_VENDA', 'Transferência de produção depositada em armazém geral ou depósito fechado'],
  '156': ['NAO_VENDA', 'Transferência de mercadoria de terceiros depositada em armazém geral ou depósito fechado'],

  // --- Devoluções de COMPRA e anulações (x.2xx) - saída, não é venda
  '201': ['NAO_VENDA', 'Devolução de compra para industrialização'],
  '202': ['NAO_VENDA', 'Devolução de compra para comercialização'],
  '205': ['NAO_VENDA', 'Anulação de valor relativo a aquisição de serviço de comunicação'],
  '206': ['NAO_VENDA', 'Anulação de valor relativo a aquisição de serviço de transporte'],
  '207': ['NAO_VENDA', 'Anulação de valor relativo à compra de energia elétrica'],
  '208': ['NAO_VENDA', 'Devolução de mercadoria recebida em transferência para industrialização'],
  '209': ['NAO_VENDA', 'Devolução de mercadoria recebida em transferência para comercialização'],
  '210': ['NAO_VENDA', 'Devolução de compra para utilização na prestação de serviço'],

  // --- Energia elétrica (x.25x)
  '251': ['VENDA', 'Venda de energia elétrica para distribuição ou comercialização'],
  '252': ['VENDA', 'Venda de energia elétrica para estabelecimento industrial'],
  '253': ['VENDA', 'Venda de energia elétrica para estabelecimento comercial'],
  '254': ['VENDA', 'Venda de energia elétrica para estabelecimento prestador de serviço de transporte'],
  '255': ['VENDA', 'Venda de energia elétrica para estabelecimento prestador de serviço de comunicação'],
  '256': ['VENDA', 'Venda de energia elétrica para estabelecimento de produtor rural'],
  '257': ['VENDA', 'Venda de energia elétrica para consumo por demanda contratada'],
  '258': ['VENDA', 'Venda de energia elétrica a não contribuinte'],

  // --- Comunicação (x.30x)
  '301': ['VENDA', 'Prestação de serviço de comunicação para execução de serviço da mesma natureza'],
  '302': ['VENDA', 'Prestação de serviço de comunicação a estabelecimento industrial'],
  '303': ['VENDA', 'Prestação de serviço de comunicação a estabelecimento comercial'],
  '304': ['VENDA', 'Prestação de serviço de comunicação a estabelecimento de prestador de serviço de transporte'],
  '305': ['VENDA', 'Prestação de serviço de comunicação a estabelecimento de geradora ou distribuidora de energia'],
  '306': ['VENDA', 'Prestação de serviço de comunicação a estabelecimento de produtor rural'],
  '307': ['VENDA', 'Prestação de serviço de comunicação a não contribuinte'],

  // --- Transporte (x.35x / x.36x)
  '351': ['VENDA', 'Prestação de serviço de transporte para execução de serviço da mesma natureza'],
  '352': ['VENDA', 'Prestação de serviço de transporte a estabelecimento industrial'],
  '353': ['VENDA', 'Prestação de serviço de transporte a estabelecimento comercial'],
  '354': ['VENDA', 'Prestação de serviço de transporte a estabelecimento de prestador de serviço de comunicação'],
  '355': ['VENDA', 'Prestação de serviço de transporte a estabelecimento de geradora ou distribuidora de energia'],
  '356': ['VENDA', 'Prestação de serviço de transporte a estabelecimento de produtor rural'],
  '357': ['VENDA', 'Prestação de serviço de transporte a não contribuinte'],
  '359': ['VENDA', 'Prestação de serviço de transporte a contribuinte ou a não contribuinte quando a mercadoria transportada está dispensada de documento fiscal'],
  '360': ['VENDA', 'Prestação de serviço de transporte a contribuinte substituto em relação ao serviço de transporte'],

  // --- Substituição tributária (x.4xx)
  '401': ['VENDA', 'Venda de produção do estabelecimento em operação com mercadoria sujeita a ST, na condição de substituto'],
  '402': ['VENDA', 'Venda de produção do estabelecimento de mercadoria sujeita a ST, entre contribuintes substitutos'],
  '403': ['VENDA', 'Venda de mercadoria de terceiros sujeita a ST, na condição de contribuinte substituto'],
  '404': ['VENDA', 'Venda de mercadoria sujeita a ST, cujo imposto já tenha sido retido anteriormente'],
  '405': ['VENDA', 'Venda de mercadoria de terceiros sujeita a ST, na condição de contribuinte substituído'],
  '408': ['NAO_VENDA', 'Transferência para industrialização em operação com mercadoria sujeita a ST'],
  '409': ['NAO_VENDA', 'Transferência para comercialização em operação com mercadoria sujeita a ST'],
  '410': ['NAO_VENDA', 'Devolução de compra para industrialização em operação com mercadoria sujeita a ST'],
  '411': ['NAO_VENDA', 'Devolução de compra para comercialização em operação com mercadoria sujeita a ST'],
  '412': ['NAO_VENDA', 'Devolução de bem do ativo imobilizado em operação com mercadoria sujeita a ST'],
  '413': ['NAO_VENDA', 'Devolução de mercadoria destinada ao uso ou consumo em operação com mercadoria sujeita a ST'],
  '414': ['NAO_VENDA', 'Remessa de produção do estabelecimento para venda fora do estabelecimento (mercadoria sujeita a ST)'],
  '415': ['NAO_VENDA', 'Remessa de mercadoria de terceiros para venda fora do estabelecimento (mercadoria sujeita a ST)'],

  // --- Exportação / fim específico (x.5xx)
  '501': ['NAO_VENDA', 'Remessa de produção do estabelecimento com fim específico de exportação'],
  '502': ['NAO_VENDA', 'Remessa de mercadoria de terceiros com fim específico de exportação'],
  '503': ['NAO_VENDA', 'Devolução de mercadoria recebida com fim específico de exportação'],
  '504': ['NAO_VENDA', 'Remessa de mercadoria para formação de lote de exportação, de produção do estabelecimento'],
  '505': ['NAO_VENDA', 'Remessa de mercadoria para formação de lote de exportação, de mercadoria de terceiros'],

  // --- Ativo imobilizado e uso/consumo (x.55x)
  '551': ['ATIVO', 'Venda de bem do ativo imobilizado'],
  '552': ['NAO_VENDA', 'Transferência de bem do ativo imobilizado'],
  '553': ['NAO_VENDA', 'Devolução de compra de bem do ativo imobilizado'],
  '554': ['NAO_VENDA', 'Remessa de bem do ativo imobilizado para uso fora do estabelecimento'],
  '555': ['NAO_VENDA', 'Devolução de bem do ativo imobilizado de terceiro recebido para uso no estabelecimento'],
  '556': ['NAO_VENDA', 'Devolução de compra de material de uso ou consumo'],
  '557': ['NAO_VENDA', 'Transferência de material de uso ou consumo'],

  // --- Créditos e ressarcimentos (x.6xx)
  '601': ['NAO_VENDA', 'Transferência de crédito de ICMS acumulado'],
  '602': ['NAO_VENDA', 'Transferência de saldo devedor de ICMS de outro estabelecimento'],
  '603': ['NAO_VENDA', 'Ressarcimento de ICMS retido por substituição tributária'],
  '605': ['NAO_VENDA', 'Transferência de saldo devedor de ICMS'],
  '606': ['NAO_VENDA', 'Utilização de saldo credor de ICMS para liquidação de débito fiscal'],

  // --- Outras saídas (x.9xx)
  '901': ['NAO_VENDA', 'Remessa para industrialização por encomenda'],
  '902': ['NAO_VENDA', 'Retorno de mercadoria utilizada na industrialização por encomenda'],
  '903': ['NAO_VENDA', 'Retorno de mercadoria recebida para industrialização e não aplicada no processo'],
  '904': ['NAO_VENDA', 'Remessa para venda fora do estabelecimento'],
  '905': ['NAO_VENDA', 'Remessa para depósito fechado ou armazém geral'],
  '906': ['NAO_VENDA', 'Retorno de mercadoria depositada em depósito fechado ou armazém geral'],
  '907': ['NAO_VENDA', 'Retorno simbólico de mercadoria depositada em depósito fechado ou armazém geral'],
  '908': ['NAO_VENDA', 'Remessa de bem por conta de contrato de comodato ou locação'],
  '909': ['NAO_VENDA', 'Retorno de bem recebido por conta de contrato de comodato ou locação'],
  '910': ['NAO_VENDA', 'Remessa em bonificação, doação ou brinde'],
  '911': ['NAO_VENDA', 'Remessa de amostra grátis'],
  '912': ['NAO_VENDA', 'Remessa de mercadoria ou bem para demonstração, mostruário ou treinamento'],
  '913': ['NAO_VENDA', 'Retorno de mercadoria ou bem recebido para demonstração ou mostruário'],
  '914': ['NAO_VENDA', 'Remessa de mercadoria ou bem para exposição ou feira'],
  '915': ['NAO_VENDA', 'Remessa de mercadoria ou bem para conserto ou reparo'],
  '916': ['NAO_VENDA', 'Retorno de mercadoria ou bem recebido para conserto ou reparo'],
  '917': ['NAO_VENDA', 'Remessa de mercadoria em consignação mercantil ou industrial'],
  '918': ['NAO_VENDA', 'Devolução de mercadoria recebida em consignação mercantil ou industrial'],
  '919': ['NAO_VENDA', 'Devolução simbólica de mercadoria vendida ou utilizada em consignação'],
  '920': ['NAO_VENDA', 'Remessa de vasilhame ou sacaria'],
  '921': ['NAO_VENDA', 'Devolução de vasilhame ou sacaria'],
  '922': ['CONTRA_LANCAMENTO', 'Simples faturamento decorrente de venda para entrega futura (a venda é lançada no x.116/x.117)'],
  '923': ['NAO_VENDA', 'Remessa por conta e ordem de terceiros de mercadoria vendida para entrega futura'],
  '924': ['NAO_VENDA', 'Remessa para industrialização por conta e ordem do adquirente, quando não transitar pelo estabelecimento'],
  '925': ['NAO_VENDA', 'Retorno de mercadoria industrializada por conta e ordem do adquirente'],
  '926': ['NAO_VENDA', 'Reclassificação de mercadoria decorrente de formação ou desagregação de kit'],
  '927': ['NAO_VENDA', 'Baixa de estoque decorrente de perda, roubo ou deterioração'],
  '928': ['NAO_VENDA', 'Baixa de estoque decorrente de encerramento de atividade'],
  '929': ['CONTRA_LANCAMENTO', 'Lançamento relativo a operação já registrada em ECF/SAT/cupom fiscal (espelho; não somar)'],
  '931': ['VENDA', 'Lançamento relativo a prestação de serviço de transporte de carga com ICMS devido a UF diversa'],
  '932': ['VENDA', 'Prestação de serviço de transporte iniciada em UF diversa daquela do prestador'],
  '933': ['SERVICO_ISS', 'Prestação de serviço tributado pelo ISSQN'],
  '934': ['NAO_VENDA', 'Remessa simbólica de mercadoria depositada em armazém geral ou depósito fechado'],
  '949': ['REVISAR', 'Outra saída de mercadoria ou prestação de serviço não especificado'],
}

const SUFIXO_ENTRADA = {
  '101': ['NAO_VENDA', 'Compra para industrialização'],
  '102': ['NAO_VENDA', 'Compra para comercialização'],
  '111': ['NAO_VENDA', 'Compra para industrialização de mercadoria recebida anteriormente em consignação industrial'],
  '113': ['NAO_VENDA', 'Compra para industrialização de mercadoria recebida em consignação mercantil'],
  '116': ['NAO_VENDA', 'Compra para industrialização originada de encomenda para recebimento futuro'],
  '117': ['NAO_VENDA', 'Compra para comercialização originada de encomenda para recebimento futuro'],
  '118': ['NAO_VENDA', 'Compra de mercadoria para comercialização pelo adquirente originário'],
  '120': ['NAO_VENDA', 'Compra para industrialização, entrega efetuada pelo vendedor remetente'],
  '121': ['NAO_VENDA', 'Compra para utilização na prestação de serviço'],
  '122': ['NAO_VENDA', 'Compra para industrialização em que a mercadoria foi remetida pelo fornecedor ao industrializador'],
  '124': ['NAO_VENDA', 'Industrialização efetuada por outra empresa'],
  '125': ['NAO_VENDA', 'Industrialização efetuada por outra empresa quando a mercadoria não transitar pelo estabelecimento'],
  '126': ['NAO_VENDA', 'Compra para utilização na prestação de serviço sujeita ao ICMS'],

  '151': ['NAO_VENDA', 'Transferência para industrialização'],
  '152': ['NAO_VENDA', 'Transferência para comercialização'],
  '153': ['NAO_VENDA', 'Transferência de energia elétrica'],
  '154': ['NAO_VENDA', 'Transferência para utilização na prestação de serviço'],
  '159': ['NAO_VENDA', 'Entrada decorrente do fornecimento de produto por sociedade cooperativa'],

  // --- Devoluções de VENDA: deduzem a receita
  '201': ['DEVOLUCAO_VENDA', 'Devolução de venda de produção do estabelecimento'],
  '202': ['DEVOLUCAO_VENDA', 'Devolução de venda de mercadoria adquirida ou recebida de terceiros'],
  '203': ['DEVOLUCAO_VENDA', 'Devolução de venda de produção do estabelecimento destinada à ZFM ou ALC'],
  '204': ['DEVOLUCAO_VENDA', 'Devolução de venda de mercadoria de terceiros destinada à ZFM ou ALC'],
  '205': ['DEVOLUCAO_VENDA', 'Anulação de valor relativo à prestação de serviço de comunicação'],
  '206': ['DEVOLUCAO_VENDA', 'Anulação de valor relativo à prestação de serviço de transporte'],
  '207': ['DEVOLUCAO_VENDA', 'Anulação de valor relativo à venda de energia elétrica'],
  '208': ['NAO_VENDA', 'Devolução de produção do estabelecimento remetida em transferência'],
  '209': ['NAO_VENDA', 'Devolução de mercadoria de terceiros remetida em transferência'],
  '212': ['DEVOLUCAO_VENDA', 'Devolução de venda no mercado interno de mercadoria industrializada sob regime de drawback'],
  '213': ['DEVOLUCAO_VENDA', 'Devolução de entrada de mercadoria sujeita ao regime de drawback intermediário'],

  '251': ['NAO_VENDA', 'Compra de energia elétrica para distribuição ou comercialização'],
  '252': ['NAO_VENDA', 'Compra de energia elétrica por estabelecimento industrial'],
  '253': ['NAO_VENDA', 'Compra de energia elétrica por estabelecimento comercial'],
  '254': ['NAO_VENDA', 'Compra de energia elétrica por estabelecimento prestador de serviço de transporte'],
  '255': ['NAO_VENDA', 'Compra de energia elétrica por estabelecimento prestador de serviço de comunicação'],
  '256': ['NAO_VENDA', 'Compra de energia elétrica por estabelecimento de produtor rural'],
  '257': ['NAO_VENDA', 'Compra de energia elétrica para consumo por demanda contratada'],

  '301': ['NAO_VENDA', 'Aquisição de serviço de comunicação para execução de serviço da mesma natureza'],
  '302': ['NAO_VENDA', 'Aquisição de serviço de comunicação por estabelecimento industrial'],
  '303': ['NAO_VENDA', 'Aquisição de serviço de comunicação por estabelecimento comercial'],
  '306': ['NAO_VENDA', 'Aquisição de serviço de comunicação por estabelecimento de produtor rural'],

  '351': ['NAO_VENDA', 'Aquisição de serviço de transporte para execução de serviço da mesma natureza'],
  '352': ['NAO_VENDA', 'Aquisição de serviço de transporte por estabelecimento industrial'],
  '353': ['NAO_VENDA', 'Aquisição de serviço de transporte por estabelecimento comercial'],
  '354': ['NAO_VENDA', 'Aquisição de serviço de transporte por estabelecimento de prestador de serviço de comunicação'],
  '355': ['NAO_VENDA', 'Aquisição de serviço de transporte por estabelecimento de geradora ou distribuidora de energia'],
  '356': ['NAO_VENDA', 'Aquisição de serviço de transporte por estabelecimento de produtor rural'],
  '360': ['NAO_VENDA', 'Aquisição de serviço de transporte por contribuinte substituto em relação ao serviço de transporte'],

  '401': ['NAO_VENDA', 'Compra para industrialização em operação com mercadoria sujeita a ST'],
  '403': ['NAO_VENDA', 'Compra para comercialização em operação com mercadoria sujeita a ST'],
  '406': ['NAO_VENDA', 'Compra de bem para o ativo imobilizado cuja mercadoria está sujeita a ST'],
  '407': ['NAO_VENDA', 'Compra de mercadoria para uso ou consumo cuja mercadoria está sujeita a ST'],
  '408': ['NAO_VENDA', 'Transferência para industrialização em operação com mercadoria sujeita a ST'],
  '409': ['NAO_VENDA', 'Transferência para comercialização em operação com mercadoria sujeita a ST'],
  '410': ['DEVOLUCAO_VENDA', 'Devolução de venda de produção do estabelecimento, mercadoria sujeita a ST'],
  '411': ['DEVOLUCAO_VENDA', 'Devolução de venda de mercadoria de terceiros, sujeita a ST'],
  '414': ['NAO_VENDA', 'Retorno de produção do estabelecimento remetida para venda fora do estabelecimento (ST)'],
  '415': ['NAO_VENDA', 'Retorno de mercadoria de terceiros remetida para venda fora do estabelecimento (ST)'],

  '501': ['NAO_VENDA', 'Entrada de mercadoria recebida com fim específico de exportação'],
  '503': ['DEVOLUCAO_VENDA', 'Entrada decorrente de devolução de produto remetido com fim específico de exportação'],
  '504': ['DEVOLUCAO_VENDA', 'Entrada decorrente de devolução de mercadoria de terceiros remetida com fim específico de exportação'],
  '505': ['DEVOLUCAO_VENDA', 'Entrada decorrente de devolução de mercadoria remetida para formação de lote de exportação'],

  '551': ['NAO_VENDA', 'Compra de bem para o ativo imobilizado'],
  '552': ['NAO_VENDA', 'Transferência de bem do ativo imobilizado'],
  '553': ['NAO_VENDA', 'Devolução de venda de bem do ativo imobilizado'],
  '554': ['NAO_VENDA', 'Retorno de bem do ativo imobilizado remetido para uso fora do estabelecimento'],
  '555': ['NAO_VENDA', 'Entrada de bem do ativo imobilizado de terceiro remetido para uso no estabelecimento'],
  '556': ['NAO_VENDA', 'Compra de material para uso ou consumo'],
  '557': ['NAO_VENDA', 'Transferência de material para uso ou consumo'],

  '601': ['NAO_VENDA', 'Recebimento por transferência de crédito de ICMS'],
  '602': ['NAO_VENDA', 'Recebimento por transferência de saldo devedor de ICMS de outro estabelecimento'],
  '603': ['NAO_VENDA', 'Ressarcimento de ICMS retido por substituição tributária'],
  '605': ['NAO_VENDA', 'Recebimento por transferência de saldo devedor de ICMS'],

  '901': ['NAO_VENDA', 'Entrada para industrialização por encomenda'],
  '902': ['NAO_VENDA', 'Retorno de mercadoria remetida para industrialização por encomenda'],
  '903': ['NAO_VENDA', 'Entrada de mercadoria remetida para industrialização e não aplicada no processo'],
  '904': ['NAO_VENDA', 'Retorno de remessa para venda fora do estabelecimento'],
  '905': ['NAO_VENDA', 'Entrada de mercadoria recebida para depósito em depósito fechado ou armazém geral'],
  '906': ['NAO_VENDA', 'Retorno de mercadoria remetida para depósito fechado ou armazém geral'],
  '907': ['NAO_VENDA', 'Retorno simbólico de mercadoria remetida para depósito fechado ou armazém geral'],
  '908': ['NAO_VENDA', 'Entrada de bem por conta de contrato de comodato ou locação'],
  '909': ['NAO_VENDA', 'Retorno de bem remetido por conta de contrato de comodato ou locação'],
  '910': ['NAO_VENDA', 'Entrada de bonificação, doação ou brinde'],
  '911': ['NAO_VENDA', 'Entrada de amostra grátis'],
  '912': ['NAO_VENDA', 'Entrada de mercadoria ou bem recebido para demonstração ou mostruário'],
  '913': ['NAO_VENDA', 'Retorno de mercadoria ou bem remetido para demonstração ou mostruário'],
  '914': ['NAO_VENDA', 'Retorno de mercadoria ou bem remetido para exposição ou feira'],
  '915': ['NAO_VENDA', 'Entrada de mercadoria ou bem recebido para conserto ou reparo'],
  '916': ['NAO_VENDA', 'Retorno de mercadoria ou bem remetido para conserto ou reparo'],
  '917': ['NAO_VENDA', 'Entrada de mercadoria recebida em consignação mercantil ou industrial'],
  '918': ['NAO_VENDA', 'Devolução de mercadoria remetida em consignação mercantil ou industrial'],
  '919': ['NAO_VENDA', 'Devolução simbólica de mercadoria vendida ou utilizada em consignação'],
  '920': ['NAO_VENDA', 'Entrada de vasilhame ou sacaria'],
  '921': ['NAO_VENDA', 'Retorno de vasilhame ou sacaria'],
  '922': ['CONTRA_LANCAMENTO', 'Lançamento relativo a compra para recebimento futuro (espelho; não somar)'],
  '923': ['NAO_VENDA', 'Entrada de mercadoria recebida do vendedor remetente, em venda à ordem'],
  '924': ['NAO_VENDA', 'Entrada para industrialização por conta e ordem do adquirente, quando não transitar pelo estabelecimento'],
  '925': ['NAO_VENDA', 'Retorno de mercadoria remetida para industrialização por conta e ordem do adquirente'],
  '926': ['NAO_VENDA', 'Reclassificação de mercadoria decorrente de formação ou desagregação de kit'],
  '931': ['NAO_VENDA', 'Lançamento relativo à prestação de serviço de transporte de carga com ICMS devido a UF diversa'],
  '932': ['NAO_VENDA', 'Aquisição de serviço de transporte iniciado em UF diversa daquela do prestador'],
  '933': ['NAO_VENDA', 'Aquisição de serviço tributado pelo ISSQN'],
  '934': ['NAO_VENDA', 'Entrada simbólica de mercadoria recebida de depósito fechado ou armazém geral'],
  '949': ['REVISAR', 'Outra entrada de mercadoria ou prestação de serviço não especificado'],
}

/** Normaliza "5.102", "5102 ", "05102", "5102/SP" -> "5102". Devolve null se inválido. */
export function normalizarCfop (bruto) {
  if (bruto === null || bruto === undefined) return null
  const digitos = String(bruto).replace(/\D/g, '')
  if (digitos.length === 4) return /^[123567]/.test(digitos) ? digitos : null
  if (digitos.length > 4 && /^0+/.test(digitos)) return normalizarCfop(digitos.replace(/^0+/, ''))
  return null
}

/**
 * Classifica um CFOP.
 * @param {string|number} bruto
 * @param {Record<string,{natureza:string,descricao?:string}>} [overrides] regras do usuário
 */
export function classificarCfop (bruto, overrides) {
  const cfop = normalizarCfop(bruto)
  if (!cfop) {
    return { cfop: bruto == null ? '' : String(bruto), valido: false, grupo: null, sentido: null,
             natureza: NATUREZA.DESCONHECIDO, efeito: 0, descricao: 'CFOP inválido ou não reconhecido', fonte: 'invalido' }
  }
  const grupo = Number(cfop[0])
  const info = GRUPOS[grupo]
  if (!info) {
    return { cfop, valido: false, grupo, sentido: null, natureza: NATUREZA.DESCONHECIDO, efeito: 0,
             descricao: 'Grupo de CFOP inexistente', fonte: 'invalido' }
  }
  const sufixo = cfop.slice(1)

  const ov = overrides && overrides[cfop]
  if (ov && ov.natureza) {
    const nat = ov.natureza
    return { cfop, valido: true, grupo, sentido: info.sentido, natureza: nat, efeito: EFEITO[nat] ?? 0,
             descricao: ov.descricao || (tabela(info.sentido)[sufixo]?.[1]) || 'Regra definida pelo usuário',
             escopo: info.escopo, fonte: 'override' }
  }

  const linha = tabela(info.sentido)[sufixo]
  if (!linha) {
    return { cfop, valido: true, grupo, sentido: info.sentido, natureza: NATUREZA.DESCONHECIDO, efeito: 0,
             descricao: 'CFOP fora da tabela embutida — exige classificação manual', escopo: info.escopo, fonte: 'nao_mapeado' }
  }
  const [natureza, descricao] = linha
  return { cfop, valido: true, grupo, sentido: info.sentido, natureza, efeito: EFEITO[natureza] ?? 0,
           descricao, escopo: info.escopo, fonte: 'tabela' }
}

function tabela (sentido) { return sentido === 'entrada' ? SUFIXO_ENTRADA : SUFIXO_SAIDA }

/** Lista completa (para a aba "Tabela de códigos" da interface). */
export function listarCfops () {
  const out = []
  for (const grupo of [1, 2, 3, 5, 6, 7]) {
    const t = tabela(GRUPOS[grupo].sentido)
    for (const sufixo of Object.keys(t).sort()) {
      out.push(classificarCfop(String(grupo) + sufixo))
    }
  }
  return out
}

export const NATUREZA_LABEL = {
  VENDA: 'Venda (soma)',
  DEVOLUCAO_VENDA: 'Devolução de venda (deduz)',
  ANULACAO_SAIDA: 'Anulação de saída (deduz)',
  NAO_VENDA: 'Não é venda (ignora)',
  ATIVO: 'Venda de ativo imobilizado (fora da receita de mercadoria)',
  SERVICO_ISS: 'Serviço tributado pelo ISS (fora do ICMS)',
  CONTRA_LANCAMENTO: 'Contra-lançamento / espelho (ignora p/ não duplicar)',
  REVISAR: 'Genérico — exige revisão manual',
  DESCONHECIDO: 'Não classificado',
}
