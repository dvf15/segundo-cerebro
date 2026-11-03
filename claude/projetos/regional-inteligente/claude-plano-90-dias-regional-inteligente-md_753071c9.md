---
title: "claude/plano-90-dias-regional-inteligente.md"
date: 2026-10-29
source: "claude-project-doc"
source_id: "753071c9-d71b-47a4-88f2-f133c3b84083"
project: "Regional Inteligente"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/plano-90-dias-regional-inteligente.md

# Regional Inteligente — plano de implantação em 90 dias (resumo do deck)

Versão: 2026-10-31 · 57 slides · arquivo: Regional_Inteligente_Plano_90_dias.pptx
Período: 2/nov/2026 a 29/jan/2027 (13 semanas) · 5 usuários Claude Enterprise
Parâmetros da companhia (podem mudar): 4 portfólios hoje (1 piloto + 3); 5 licenças Claude Enterprise por portfólio (uma por papel).

## Dois propósitos que o plano serve
- **Regional:** propagar a cultura; formar lideranças; entregar metas e estratégia dos ativos maximizando criação e captura de valor; evoluir as pessoas técnica e gerencialmente; eliminar entraves burocráticos e otimizar processos continuamente, respeitando as políticas.
- **Cada shopping:** as melhores ofertas de lojas, serviços, entretenimento e gastronomia conforme o posicionamento; mais frequência de visita e ticket médio; experiência qualificada e segura; mais venda para lojistas e anunciantes; retorno de longo prazo ao empreendedor.

## Hipóteses do teste (regional inteligente vs. modelo atual)
H1 Pessoas e cultura · H2 Processos e políticas · H3 Valor no shopping · H4 Escala (modelo modular e portátil em .md; outra regional replica em 8 semanas)

## Time: papéis, não pessoas
Cada frente tem dono e suplente (diretor ↔ gerente regional; negócios → operações; marketing → negócios; operações → marketing). Acessos, Projects, alertas e licenças são atribuídos ao papel (grupos SSO no Claude Enterprise), não à pessoa.

## Etapa 0 — fundação técnica (pré-requisito)
- Conexão com a base de dados da companhia: inventário de fontes, minimização de dados (LGPD), classificação (SI + Jurídico), usuário somente leitura com credencial em cofre, conector MCP ou exportação para CSV, habilitado só para os 5 usuários, reconciliação contra o BI.
- Validação no Orca e liberação em produção: plano de risco e segurança nas funções do NIST CSF 2.0 (Governar, Identificar, Proteger, Detectar, Responder, Recuperar) com resposta a incidentes; ambientes dev/homologação/produção, ativos registrados, varredura, tratamento de achados, aprovação na gestão de mudanças, deploy, monitoramento contínuo.
- Gates: G1 S4 (conector + segundo cérebro) · G2 S6 (gestão à vista, placar das batalhas, renovações, cláusulas) · G3 S7 (radar de auditoria + 4 pilotos) · G4 S9 (manual operacional e automações).

## Frentes
0. Segundo cérebro em .md (00-governanca, 01-regional, 02-shoppings/_modelo (template) e 02-shoppings/<nome>/ com posicionamento, batalhas e contratos/, 03-processos, 04-conhecimento, 05-agentes, 06-dados, 07-treinamento, 99-arquivo para shoppings e pessoas desligados). Cabeçalho YAML padrão; status rascunho/validado; teste de portabilidade em outro modelo na S12.
1. Gestão à vista integrada: shopping → RMR → regional, indicadores da visita estruturada + do propósito; atualização automática; visita estruturada gerada do painel.
   - **Monitor das batalhas de posicionamento:** batalhas e pesos de cada shopping vêm do posicionamento/cluster oficiais. Ficha .md por batalha; indicadores por batalha; iniciativas marcadas com a batalha que servem; placar nos três níveis (G2); RMR e visita abrem pelo placar; revisão com a diretoria na S13 e trimestral. Scorecard: % de batalhas no prazo.
2. Apps de processo: gestão de renovações (negócios), radar de auditoria (operações), manual operacional (operações).
3. Pilotos operacionais (um shopping por app, baseline 3 semanas, 6 semanas de operação, decisão na S13):
   - **Radar de varejo regional:** busca ativa priorizada pelas batalhas + canal único (opção A: link centralizado, recomendada para começar; opção B: bot, fase 2) para investidores, multifranqueados, lojistas e marcas; triagem por IA, dossiê, resposta em 48 h, CRM em 06-dados.
   - **Radar de mídia:** anunciantes e patrocínios mapeados e priorizados.
   - **Otimizador de obras:** caderno técnico em .md por capítulo; link único para projetos de lojas e quiosques; conferência projeto × caderno × checklist regulatório; parecer padrão assinado pela engenharia; meta inicial de devolução em 5 dias úteis.
   - **Auditoria de boletos:** case Shopping Tijuca.
4. Gestão de cláusulas: contratos em .md (piloto S2–S5, regional S6–S11), ferramenta de busca/comparação/alertas, índice na S12. Condição: regras de uso validadas com TI, Jurídico e SI.
5. Treinamento em IA: fundamentos (S1–S3), prática por função (S3–S8), avançado (S8–S12), formação externa (Asimov para os 4 gerentes; MIT para o diretor na próxima turma disponível), demo day na S13. Lideranças formadas no trabalho: dono de frente, pares revisam pares, palco mensal na diretoria, decisões registradas, mentoria do diretor, multiplicadores.

## Curso do MIT no plano (método, não pré-requisito)
- Curso: "liderar a adoção de IA generativa e agêntica", MIT Professional Education (Abel Sanchez e John R. Williams), entrega pela Global Alumni; executivo, sem programação; 8 semanas online, 8 a 10 h/semana; 2 sessões ao vivo com o MIT + até 8 com facilitadores. Última turma em português 1/set–27/out/2026 (US$ 1.870); versão em inglês US$ 3.200; próxima turma em português sem data divulgada. Projeto final: plano de integração de IA ou apresentação executiva com risco-benefício, custos e KPIs.
- Regras: o plano não espera a turma (os 90 dias começam em 2/nov); os frameworks do curso já estão aplicados; este deck e o relatório da S13 são o projeto final. Leitura franca: módulos 1–3 tendem a ser básicos; valor em segurança, KPIs, governança e certificado; regulação ensinada é GDPR/CCPA/HIPAA → traduzir para LGPD.
- Mapa módulo → plano: (1) fundamentos e custo → treinamento e estrutura de custo; (2) plataformas → decisão de plataforma registrada em 00-governanca + teste de portabilidade; (3) conectar agentes → Etapa 0A, tabela hoje → com o plano, especificação dos apps; (4) NIST CSF → Etapa 0B e resposta a incidentes; (5) agentes por função → frentes por ponto focal, um agente por app; (6) 3–5 KPIs → KPIs por app; (7) governança e testes → sandbox (dev mascarado), A/B (back-test e regional de comparação), quadrante Risco–Velocidade, LGPD; (8) ética e projeto final → regras do jogo, transparência (quem fala com a IA sabe que é IA), este plano.
- **Quadrante Risco–Velocidade (ordem dos apps):** começar já = segundo cérebro, gestão à vista e batalhas, manual operacional; entrar cedo com gates reforçados = renovações, auditoria de boletos, radar de auditoria; preparar a base = otimizador de obras, radar de mídia, radar de varejo (busca ativa); por último com controle máximo = cláusulas, canal público/bot. Leitura inicial, a validar com SI.
- **NIST CSF 2.0:** Governar (política de IA, papéis, LGPD, comitê) · Identificar (inventário, matriz frente × campos, Orca, quadrante) · Proteger (somente leitura, cofre, grupos SSO, dados mascarados, gates) · Detectar (Orca contínuo, logs, alertas, revisão de saídas) · Responder (SI + diretor; isolar em 1 h; Jurídico e encarregado LGPD; registro) · Recuperar (repositório versionado, reconciliar com BI, lições, retorno pelos gates). Cenários de incidente: dado confidencial exposto; saída errada usada em decisão; abuso do canal público.
- **3 a 5 KPIs por app** (ex.: renovações = tratadas na janela %, leasing spread, tempo de preparação, aderência às batalhas; boletos = conferidos %, precisão, receita recuperada, tempo; obras = dias para devolver projeto, aprovados na 1ª análise %, assinatura → inauguração, retrabalho). Metas no baseline S1–S3.
- **Estrutura de custo:** licenças (5 por portfólio, valor do contrato a confirmar), horas do time (~24 h/semana × 13 ≈ 310 h no piloto; ~8 semanas por portfólio no rollout), TI e SI (a estimar na S1), formação externa (MIT US$ 1.870 PT / US$ 3.200 EN; Asimov a confirmar), infraestrutura (marginal; bot a estimar). Benefício medido no scorecard. Custo por portfólio = licenças × papéis + horas + TI/SI, fechado na S13.

## Mudanças no portfólio e no time (desenhado para mudar)
- Seis regras: modular por shopping (pasta autocontida), papel não pessoa, conhecimento em arquivo, dono e suplente, acessos por grupo (SSO), catálogo versionado.
- **Playbook shopping — entrada em 15 dias úteis / saída em 10 dias úteis.** Troca de regional: a pasta viaja com o shopping.
- **Playbook pessoa — entrada em 10 dias úteis; saída do aviso ao último dia; substituição com suplente interino e revisão de 30 dias.**
- Teste na S12: simular saída de um ponto focal e entrada de um shopping fictício. Scorecard de adoção inclui "dias para integrar pessoa ou shopping novo".

## Scorecard
- Regional: pessoas e lideranças; cultura e processos; políticas e segurança; adoção (inclui tempo de integração).
- Shopping: oferta e mix (batalhas no prazo, vacância, operações aderentes, renovações na janela, leasing spread); consumidor; lojistas e anunciantes; retorno.
- Método: baseline S1–S3, regional de comparação, comparar evolução, revisão mensal com a diretoria. 90 dias concluem sobre pessoas, processo e adoção; financeiro só em tendência.

## Rollout aos demais portfólios (depois dos 90 dias)
- Dimensionado para 4 portfólios (1 piloto + 3) e 5 licenças por portfólio; se qualquer um dos dois mudar, as ondas e o total de licenças se redimensionam, o método não.
- **Pacote de replicação:** segundo cérebro modelo; catálogo de apps v1; esteira já aprovada no Orca (portfólio novo = mudança padrão); trilha de treinamento gravada; playbooks; scorecard e resultados do piloto; multiplicadores.
- **Ondas 2027:** Onda 0 piloto = portfólio 1 (go/no-go na S13) · Onda 1 = portfólio 2 (fev–abr) · Onda 2 = portfólios 3 e 4 em paralelo (mai–jul) · Consolidação (ago–set) · Reserva out–dez para portfólio novo. Centro de excelência leve (diretor do piloto + 2 multiplicadores). Licenças: uma por papel, 20 na companhia ao fim.
- **Entrada de cada portfólio em 8 semanas** (sponsor e time → diagnóstico → segundo cérebro → dados e segurança → gestão à vista → apps e pilotos → treinamento → scorecard e passagem).
- **Go/no-go na S13**, pré-requisitos por portfólio, governança (comitê mensal; central vs. local), decisões de agora e da S13.

## Pendências a confirmar
- Próxima turma do curso do MIT (português ou inglês) e se a grade em português é igual à inglesa.
- Ordem de entrada dos 3 portfólios restantes; lista oficial das batalhas e pesos; indicadores da visita estruturada; dono da auditoria de boletos.
- Arquitetura de dados (tipo de conector), escopo da varredura no Orca e se aceita "mudança padrão"; escopo final do plano NIST com SI.
- Canal de captação: link ou bot; prazo atual de devolução de projetos; formato do caderno técnico; valor unitário da licença; horas de TI/SI.
- Prazos dos playbooks e horas de dedicação são estimativas iniciais; realocação de licenças entre pessoas no contrato Enterprise.

