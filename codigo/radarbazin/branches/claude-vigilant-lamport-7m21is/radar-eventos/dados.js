/* Radar de Eventos — modelos editáveis (fluxo, checklist, regras, temas).
   São PONTOS DE PARTIDA. Regras e documentos reais vêm do caderno técnico do shopping,
   do Corpo de Bombeiros e da prefeitura locais — edite em "Shopping & caderno técnico". */
(function (root) {
  'use strict';

  var ETAPAS = [
    { id: 'prospeccao', nome: 'Prospecção', desc: 'Operador identificado e tema aderente ao calendário e ao público do shopping.',
      tarefas: ['Registrar operador no pipeline', 'Levantar histórico de eventos do operador (com fonte)', 'Checar aderência do tema ao perfil do shopping'] },
    { id: 'qualificacao', nome: 'Qualificação', desc: 'Briefing do evento: formato, público, datas, necessidades técnicas.',
      tarefas: ['Receber briefing/apresentação do evento', 'Preencher requisitos técnicos do evento', 'Escolher área candidata'] },
    { id: 'visita', nome: 'Visita técnica', desc: 'Operador e equipe de operações validam a área in loco.',
      tarefas: ['Agendar visita com Operações/Segurança', 'Entregar caderno técnico e planta da área ao operador', 'Registrar restrições observadas'] },
    { id: 'viabilidade', nome: 'Viabilidade técnica', desc: 'Confronto dos requisitos com a área e com o caderno técnico.',
      tarefas: ['Rodar a análise de viabilidade (aba Viabilidade)', 'Resolver itens em falha ou sem dado', 'Parecer de Operações e Segurança'] },
    { id: 'proposta', nome: 'Proposta comercial', desc: 'Simulação de receita e envio de proposta (locação, % bilheteria, sublocação, mídia).',
      tarefas: ['Preencher simulador', 'Aprovar condições internamente (alçada)', 'Enviar proposta ao operador'] },
    { id: 'contrato', nome: 'Minuta e jurídico', desc: 'Minuta de contrato revisada pelas partes.',
      tarefas: ['Emitir minuta', 'Revisão do jurídico do shopping', 'Revisão do operador'] },
    { id: 'assinaturas', nome: 'Assinaturas', desc: 'Coleta de assinaturas de todas as partes.',
      tarefas: ['Enviar para assinatura', 'Conferir todos os signatários', 'Arquivar via assinada'] },
    { id: 'documentacao', nome: 'Documentação e licenças', desc: 'Checklist de documentos para abertura aprovado.',
      tarefas: ['Receber documentos do checklist', 'Aprovar documentos com Operações/Segurança/Jurídico', 'Confirmar licenças emitidas antes da montagem'] },
    { id: 'montagem', nome: 'Montagem', desc: 'Montagem conforme projeto aprovado e regras do caderno técnico.',
      tarefas: ['Liberar acesso de equipe e carga', 'Vistoria de montagem', 'Vistoria final de segurança antes da abertura'] },
    { id: 'operacao', nome: 'Operação', desc: 'Evento aberto ao público.',
      tarefas: ['Acompanhar público e bilheteria', 'Registrar ocorrências', 'Apurar receitas variáveis'] },
    { id: 'encerramento', nome: 'Desmontagem e encerramento', desc: 'Devolução da área e fechamento financeiro.',
      tarefas: ['Vistoria de devolução da área', 'Fechamento financeiro e repasses', 'Registrar aprendizados e resultado realizado'] }
  ];

  var CONTRATO_STATUS = ['Não iniciado', 'Minuta emitida', 'Em análise — jurídico do shopping', 'Em análise — operador', 'Aprovado para assinatura', 'Em assinatura', 'Assinado'];
  var CONTRATO_TIPOS = ['Locação temporária de espaço', 'Cessão de uso de área', 'Sublocação', 'Parceria com participação em bilheteria', 'Merchandising / mídia', 'Outro'];

  var DOCS_MODELO = [
    { nome: 'Contrato social e cartão CNPJ do operador', obrigatorio: true, quando: 'Sempre' },
    { nome: 'Documentos dos representantes legais / procuração', obrigatorio: true, quando: 'Sempre' },
    { nome: 'Certidões negativas (federal, estadual, municipal, trabalhista)', obrigatorio: true, quando: 'Conforme política do shopping' },
    { nome: 'Contrato assinado por todas as partes', obrigatorio: true, quando: 'Sempre' },
    { nome: 'Apólice de seguro de responsabilidade civil do evento', obrigatorio: true, quando: 'Sempre' },
    { nome: 'Projeto / layout em planta com rotas de fuga', obrigatorio: true, quando: 'Sempre' },
    { nome: 'Memorial descritivo de montagem e cronograma', obrigatorio: true, quando: 'Sempre' },
    { nome: 'ART/RRT de projeto e montagem de estruturas', obrigatorio: true, quando: 'Havendo estruturas, palco, arquibancada, tendas' },
    { nome: 'ART de instalações elétricas e diagrama de cargas', obrigatorio: true, quando: 'Havendo instalação elétrica temporária' },
    { nome: 'Laudo de ignifugação / reação ao fogo dos materiais', obrigatorio: true, quando: 'Havendo cenografia, tecidos, carpetes, lonas' },
    { nome: 'Licença do Corpo de Bombeiros para evento temporário', obrigatorio: true, quando: 'Conforme exigência do Corpo de Bombeiros do estado' },
    { nome: 'Alvará / autorização municipal para evento temporário', obrigatorio: true, quando: 'Conforme exigência da prefeitura' },
    { nome: 'Plano de emergência e dimensionamento de brigada', obrigatorio: true, quando: 'Conforme exigência do Corpo de Bombeiros do estado' },
    { nome: 'Licença sanitária', obrigatorio: false, quando: 'Havendo alimentos e bebidas' },
    { nome: 'Licenciamento de direitos autorais (execução musical)', obrigatorio: false, quando: 'Havendo música ao vivo ou mecânica' },
    { nome: 'Autorização judicial para participação de crianças e adolescentes', obrigatorio: false, quando: 'Conforme exigência da Vara da Infância local' },
    { nome: 'Relação de equipe, ASO e treinamentos de segurança do trabalho', obrigatorio: false, quando: 'Montagem com trabalho em altura ou eletricidade' },
    { nome: 'Autorização para uso de gás, pirotecnia ou efeitos especiais', obrigatorio: false, quando: 'Havendo GLP, chama, fumaça, pirotecnia' },
    { nome: 'Plano de mídia e aprovação de marcas/patrocinadores', obrigatorio: false, quando: 'Havendo patrocínio ou mídia' }
  ];

  var REGRAS_MODELO = [
    { texto: 'Rotas de fuga, saídas de emergência e corredores de circulação permanecem desobstruídos', obrigatoria: true },
    { texto: 'Hidrantes, extintores, sprinklers, detectores e acionadores não são obstruídos nem cobertos', obrigatoria: true },
    { texto: 'Estruturas e cenografia respeitam o pé-direito e a folga definida no caderno técnico', obrigatoria: true },
    { texto: 'Materiais de cenografia possuem laudo de reação ao fogo', obrigatoria: true },
    { texto: 'Instalações elétricas temporárias têm responsável técnico e proteção adequada', obrigatoria: true },
    { texto: 'Carga elétrica solicitada está dentro da carga disponível no ponto de entrega', obrigatoria: true },
    { texto: 'Sobrecarga das estruturas respeita o limite do piso/laje', obrigatoria: true },
    { texto: 'Montagem e desmontagem ocorrem nos horários autorizados pelo shopping', obrigatoria: true },
    { texto: 'Lotação do evento respeita a lotação máxima da área', obrigatoria: true },
    { texto: 'Uso de gás, chama aberta, fumaça ou pirotecnia somente com autorização expressa', obrigatoria: true },
    { texto: 'Controle de acesso, filas e segurança dimensionados para o público previsto', obrigatoria: true },
    { texto: 'Acessibilidade garantida no acesso e na circulação do evento', obrigatoria: true },
    { texto: 'Nível sonoro dentro do limite definido pelo shopping', obrigatoria: false },
    { texto: 'Descarte de resíduos e efluentes conforme orientação do shopping', obrigatoria: false }
  ];

  var TEMAS = ['Exposições imersivas', 'Parques e atrações infantis', 'Feiras gastronômicas', 'Feiras de artesanato e design', 'Shows e festivais de música',
    'Pista de patinação / atrações sazonais', 'Circo e espetáculos', 'Eventos esportivos e corridas', 'Feiras automotivas', 'Games e e-sports',
    'Eventos geek e cultura pop', 'Cinema drive-in', 'Feiras pet', 'Bazares e outlets temporários', 'Eventos de bem-estar e saúde',
    'Feiras de noivas e festas', 'Eventos corporativos e ativações de marca'];

  var TIPOS_AREA = ['Praça de eventos', 'Área interna (mall)', 'Área externa', 'Estacionamento', 'Outro'];
  var PIPELINE = ['Novo', 'Contatado', 'Reunião', 'Proposta', 'Parceiro ativo', 'Descartado'];

  /* Clusters e batalhas — Shopping Inteligente OS v5 (02_CONTEXTO_CLUSTERIZACAO_POSICIONAMENTO_v5).
     A ordem das batalhas é a prioridade do cluster. */
  var CLUSTERS = [
    { nome: 'Sofisticados', essencia: 'Vitrines que ampliam seu mundo.', batalhas: ['Lojas', 'Gastronomia', 'Hospitality'] },
    { nome: 'Compactos de Alto Padrão', essencia: 'Proximidade que realiza o seu dia, do seu jeito.', batalhas: ['Serviços', 'Gastronomia', 'Relacionamento com o entorno', 'Jornada sem fricção'] },
    { nome: 'Entretenimento', essencia: 'Seu portal para um mundo de diversão.', batalhas: ['Entretenimento', 'Gastronomia', 'Lojas'] },
    { nome: 'Passeio Familiar', essencia: 'Referência que acompanha e expande a sua vida.', batalhas: ['Gastronomia', 'Entretenimento', 'Ambiência'] },
    { nome: 'Imensos', essencia: 'Um universo de infinitas possibilidades.', batalhas: ['Entretenimento', 'Gastronomia', 'Ambiência'] },
    { nome: 'Convenientes', essencia: 'O shopping sob medida para você.', batalhas: ['Serviços', 'Gastronomia', 'Relacionamento com o entorno', 'Jornada sem fricção'] }
  ];
  var FORA_BATALHA = 'Fora das batalhas do cluster';

  /* Event Occupancy Score — pesos do dicionário v5 (08_DICIONARIO_DADOS_SCORES_UNDERWRITING_v5). Soma 100.
     auto: calculado pelo app a partir de outros dados; os demais são nota 0–5 dada pelo time. */
  var EOS_CRITERIOS = [
    { id: 'fitCluster', nome: 'Fit com o cluster', peso: 20, guia: '5 = atende a 1ª batalha do cluster e o target central · 3 = atende batalha secundária · 0 = fora das batalhas' },
    { id: 'atratividade', nome: 'Atratividade', peso: 20, guia: '5 = atração inédita na praça, com histórico de público comprovado · 0 = conceito já saturado na região' },
    { id: 'seguranca', nome: 'Segurança', peso: 15, auto: true, guia: 'Automático: regras do caderno técnico avaliadas na aba Viabilidade' },
    { id: 'patrocinio', nome: 'Patrocínio', peso: 10, guia: '5 = cotas fechadas ou com proposta aceita · 3 = anunciantes em negociação · 0 = sem prospecção' },
    { id: 'fluxo', nome: 'Fluxo', peso: 15, guia: '5 = gera visita dedicada (motivo de vinda) · 3 = retém o público que já vem · 0 = não altera fluxo' },
    { id: 'lojistas', nome: 'Lojistas conectados', peso: 10, guia: '5 = ação combinada com lojistas (PB, cupom, ativação) · 0 = evento isolado do mix' },
    { id: 'montagem', nome: 'Complexidade de montagem (5 = simples)', peso: 5, guia: '5 = montagem leve, sem obra nem estrutura · 0 = estrutura pesada, longa e de alto risco' },
    { id: 'recorrencia', nome: 'Recorrência', peso: 5, guia: '5 = edição anual/recorrente confirmada · 3 = recorrência possível · 0 = evento único' }
  ];

  /* Deal Conversion Layer — estágios v5 (05_SKILL_1_DEAL_CONVERSION_LAYER_v5) e correspondência com o fluxo do evento. */
  var DCL_ESTAGIOS = ['Lead', 'Qualified Lead', 'Contacted', 'Meeting Scheduled', 'Meeting Done', 'Proposal', 'Technical Feasibility', 'Investor Match',
    'Contract Negotiation', 'Contract Signed', 'Construction / Obra', 'Opening', 'Ramp-up', 'Seller Plan Active', 'Performance Review', 'Lost / Parked'];
  var ETAPA_DCL = { prospeccao: 'Lead', qualificacao: 'Qualified Lead', visita: 'Meeting Done', viabilidade: 'Technical Feasibility', proposta: 'Proposal',
    contrato: 'Contract Negotiation', assinaturas: 'Contract Negotiation', documentacao: 'Contract Signed', montagem: 'Construction / Obra',
    operacao: 'Opening', encerramento: 'Performance Review', cancelado: 'Lost / Parked' };

  root.RadarDados = { ETAPAS: ETAPAS, CONTRATO_STATUS: CONTRATO_STATUS, CONTRATO_TIPOS: CONTRATO_TIPOS, DOCS_MODELO: DOCS_MODELO,
    REGRAS_MODELO: REGRAS_MODELO, TEMAS: TEMAS, TIPOS_AREA: TIPOS_AREA, PIPELINE: PIPELINE,
    CLUSTERS: CLUSTERS, FORA_BATALHA: FORA_BATALHA, EOS_CRITERIOS: EOS_CRITERIOS, DCL_ESTAGIOS: DCL_ESTAGIOS, ETAPA_DCL: ETAPA_DCL };
})(typeof globalThis !== 'undefined' ? globalThis : this);
