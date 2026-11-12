# -*- coding: utf-8 -*-
import re
SRC = "/mnt/project/claude_book-processos-operacionais-obsidian.md"
OUT = "/mnt/user-data/outputs/Book-Processos-Operacionais-v2.0.md"
lines = open(SRC, encoding="utf-8").read().split("\n")

def idx(prefix):
    for i, l in enumerate(lines):
        if l.startswith(prefix):
            return i
    raise ValueError(prefix)

# ---------------------------------------------------------------- HEADER
HEADER = r'''---
tipo: manual-operacional
área: shopping-centers
status: proposta-v2 (a validar no kickoff)
versão: 2.0 · set/2026
criado: 2026-09-24
base: Book de Processos Operacionais v1.1 (jul/2026) + PES 2020 (brMalls) + Reavaliação EPSO/Portfólio Inteligente (set/2026)
tags:
  - shopping-center
  - processos
  - operacoes
  - governanca
  - manual
  - allos
  - book-processos
  - pes
aliases:
  - Book de Processos Operacionais v2
  - Manual Operacional Allos
  - Book v2
  - Padrão Operacional Shoppings
---

# Book de Processos Operacionais — v2.0 (revisado com base no PES 2020)

> [!abstract] Em uma frase
> O v1.1 dizia **o que fazer**. O v2.0 acrescenta **por que** (argumento estratégico e linha de visão até o objetivo do shopping), **quem de fato faz** (9 posições reais), **como se prova** (autoavaliação → auditoria → dispersão, a mecânica que o PES validou por anos) e **os itens operacionais que o PES cobrava e o v1.1 não tinha** (≈ 50 itens rastreados no [[#Anexo F · Rastreabilidade PES 2020 → Book v2|Anexo F]]).

> [!info] Objetivo do projeto (atualizado)
> Garantir que os processos do book sejam **conhecidos e executados** pelo time da forma **mais rápida, eficiente e uniforme nos 10 shoppings**, **na direção do objetivo de cada shopping** — com execução verificável em **90 dias** (rollout simultâneo nos 10 ativos, escalonado por capítulo em 3 ondas).

> [!warning] Como ler as marcações da v2
> - Texto sem marcação = **conteúdo original do v1.1**, preservado literalmente.
> - `🆕 PES x.y` = item **novo**, trazido do PES 2020 (número do item no manual PES).
> - `🔄` = item do v1.1 **ajustado** (prazo, critério ou evidência).
> - `🧭 v2` = regra de governança **nova** da v2 (vem da [[Reavaliação do plano do book|reavaliação]]).
> - `⚖️ validar` = política comercial/operacional de 2020 que **precisa ser confirmada** como vigente na Allos antes de entrar no checklist.
> - Nada foi removido do v1.1. Onde o PES era mais frouxo que o book (ex.: prestação de contas 15º d.u. vs. D+10 do book), **prevalece o book**.

### O que mudou do v1.1 para o v2.0

| # | Mudança | Onde | Origem |
| --- | --- | --- | --- |
| 1 | Argumento estratégico + linha de visão capítulo → variável (Fluxo/Conversão/Ticket/Risco/NOI) | [[#Parte I · Fundamentos da v2]] | Reavaliação §1–2 |
| 2 | Hierarquia dos pilares como regra de desempate | Parte I | Reavaliação §4 (Disney) |
| 3 | Dono real (9 posições) e escopo Local / Compartilhado / Matricial | Parte I + bloco v2 de cada capítulo | Reavaliação §5 |
| 4 | Regimes **tight** e **loose estruturado** | Parte I + bloco v2 | Reavaliação §6 |
| 5 | CAB v2: **meios × fins**, autoavaliação + auditoria + **dispersão**, Monitor do Book, N/A formal, canal de dúvidas, regras de auditoria | [[#Capítulo 0 · CAB v2 — Ciclo de Acompanhamento do Book]] | PES 2020 §2–5 |
| 6 | ≈ 50 itens operacionais novos ou ajustados, distribuídos nos capítulos | Bloco `🆕 Revisão v2` ao fim de cada capítulo | PES 2020 Cat. 1–6 |
| 7 | Calendário único (Semana de Comitês) absorvendo Book + PES + Handbook + Governance | [[#Anexo D v2 · Calendário único]] | Reavaliação §9 + PES |
| 8 | Matriz de rastreabilidade PES → Book | [[#Anexo F · Rastreabilidade PES 2020 → Book v2]] | Nova |
| 9 | Ferramentas sugeridas por mecanismo (Conhecer / Executar / Verificar / Corrigir) | [[#Anexo G · Ferramentas sugeridas]] | Nova |
| 10 | Glossário ampliado (CRD, ISC, FTR, EPA, Dispersão, Meios/Fins…) | [[#Glossário]] | PES 2020 |

---

## Parte I · Fundamentos da v2

### I.1 Argumento estratégico do Book

> [!quote] Por que este book existe (texto para o vídeo de abertura e o cartão de bolso)
> O shopping cria valor quando **fluxo × conversão × ticket** crescem com **segurança** e a um **custo de ocupação** que o lojista sustenta. Cada macroprocesso deste book move uma dessas variáveis ou protege o ativo que as torna possíveis. Executamos esses processos de forma **verificável** (evidência mensal) porque só assim conseguimos **inferir o que funciona** em cada ativo e recalibrar — em vez de depender da memória de quem está no cargo.

- [ ] 🧭 v2 Teste de clareza no kickoff: 3 superintendentes explicam o argumento em 60 s, sem ler (meta ≥ 7/10 no M2).

### I.2 Hierarquia dos pilares (regra de desempate)

> [!important] Segurança > Hospitalidade > Atratividade > Eficiência
> Quando dois itens conflitam por tempo, verba ou decisão, vence o pilar mais alto. Evento (Atratividade) não acontece sem alvará (Segurança); economia de condomínio (Eficiência) não corta ronda (Segurança/Hospitalidade).

### I.3 Linha de visão: capítulo → variável → objetivo do shopping

| Variável / proteção | Capítulos | Peso no score (proposta) |
| --- | --- | --- |
| **Fluxo** | 08 · 09 · 05 · 02 · 03/04 (segurança percebida) | 1,2 |
| **Conversão** | 07 · 16 · 06 · 09-PB | 1,2 |
| **Ticket** | 08 (mix) · 18 · 09-PB · 16 | 1,2 |
| **Proteção do ativo / licença de operar** | 03 · 04 · 11 · 14 | 1,5 |
| **Proteção do NOI** | 10 · 15 · 17 · 19 · 13 · 01 · 20 · 00 | 1,0 |

> [!warning] Pesos são proposta (a calibrar no kickoff). A ordem vem do próprio book e da hierarquia de pilares; os números não têm benchmark externo.

### I.4 Quem executa: estrutura real (9 posições) e escopo

Estrutura por ativo: **Superintendente + Ger. Negócios + Ger. Marketing + Ger. Operações + Coord. Negócios + Coord. Marketing + Coord. Operações + Coord. Mall/Segurança + Coord. Ambiência**. Jurídico, Controladoria/Auditoria, TI, Suprimentos e Gente & Performance são **matriciais**.

| Capítulo | Dono real no ativo | Escopo |
| --- | --- | --- |
| 00 · 01 | Superintendente | Local |
| 02 · 05 · 14 (facilities) | Coord. Operações (A: Ger. Operações) | Local |
| 03 · 04 | Coord. Mall/Segurança (A: Ger. Operações) | Local |
| 06 · 07 | Coord. Ambiência (A: Ger. Marketing / Ger. Operações) | Local |
| 08 · 16 · 18 | Ger. Negócios + Coord. Negócios | Local |
| 09 · 09-PB | Ger. Marketing + Coord. Marketing | Local (PB compartilhado com CRM corporativo) |
| 10 · 15 | Coord. Negócios (A: Ger. Negócios) | Compartilhado (Tesouraria/Controladoria) |
| 11 · 19 | Jurídico corporativo | Matricial |
| 13 | TI/BI corporativo | Matricial |
| 17 | Controladoria/Auditoria | Matricial (Coord. Negócios faz input e triangulação) |
| 20 | Gente & Performance | Matricial (Super conduz onboarding, PDI, avaliação) |

> [!note] Consequência
> O checklist **do shopping** contém só itens *Local* e *Compartilhado*. Itens *Matriciais* são pontuados nas áreas corporativas — o superintendente não é cobrado por processo que não é dele. **Validar com RH** (ativos de porte P podem acumular funções).

### I.5 Dois regimes no mesmo book

| Regime | Capítulos | Regra |
| --- | --- | --- |
| **Tight** | 00 · 01 · 02 · 03 · 04 · 05 · 10 · 11 · 13 · 14 · 15 · 17 · 19 · 20 | Meta 100%; item ⚠️ pendente = alerta ao sponsor; exceção só documentada |
| **Loose estruturado** | 06 · 07 · 08 · 09 · 16 · 18 | Meta em faixa (≥ 80%); item-experimento declarado não pontua contra, mas exige KPI e critério de parada |

### I.6 Lições do PES — o que a v2 mantém, adapta e abandona

O PES (brMalls, edições 2012 e 2020) é o antecedente direto deste book. Ele funcionou como **mecanismo de verificação** e falhou como **mecanismo de aprendizado** em parte dos ativos (virou ritual de pontuação). A v2 herda a mecânica e corrige o incentivo.

| PES fazia | Na v2 | Por quê |
| --- | --- | --- |
| Autoavaliação trimestral + auditoria externa que só valida o que foi declarado | **Mantém** — mensal (CAB) + auditoria amostral trimestral | Mecânica testada; impossibilita "ganhar" ponto na auditoria |
| **Dispersão** = 1 − (auditado ÷ declarado), com faixas de penalidade | **Mantém e adapta** — dispersão vira indicador central de confiabilidade; consequência é reauditoria e suspensão de selo, não eliminação | Sem competição entre ativos, eliminar não faz sentido; o que importa é a confiabilidade do dado |
| Meios e fins **somados** (500 + 500) no mesmo score | **Adapta** — meios (book) e fins (Farol) em **eixos separados** (quadrante) | Somar esconde o diagnóstico: "executa e não entrega" é informação, não média |
| Monitor do PES (ponto focal obrigatório) | **Mantém** — Monitor do Book | Sem dono do processo no ativo, o prazo escorrega |
| Solicitação formal de N/A com prazo e regra dos 60% | **Mantém e adapta** — N/A parametrizado por porte/maturidade + pedido formal anual | Evita N/A oportunista |
| Canal único de dúvidas com prazo e respostas publicadas como documento oficial | **Mantém** | Uniformidade entre os 10 ativos |
| −100 pontos por dia de atraso | **Adapta** — atraso vira item pendente + alerta | Penalidade aritmética gera negociação, não pontualidade |
| Ranking entre shoppings, prêmio monetário por cargo, critérios de desempate | **Abandona** | O book compara cada ativo **com o próprio histórico** (regra do v1.1) |
| Medalhas Diamante/Ouro/Prata/Bronze por faixa | **Adapta** — Selo Bronze/Prata/Ouro (v1.1) ligado ao Premiallos | Reconhecimento sem ranking |
| Itens operacionais detalhados por área (Estacionamento, Segurança, SAC, Limpeza…) | **Incorpora** (≈ 50 itens) | O v1.1 era genérico nesses capítulos; o PES tinha padrão testado |

> [!note] Fonte complementar
> O arquivo `Manual_PES.pdf` do projeto é o **PES 2012** (12 maratonas, pesos 0,2/0,3/0,5 por autoavaliação, auditoria "quase surpresa" com 1 semana de aviso, janela de correção do relatório de auditoria). O arquivo está parcialmente corrompido; usei só o texto legível e apenas para as lições de desenho acima.

---
'''

# ---------------------------------------------------------------- CAB v2
CAB = r'''## Capítulo 0 · CAB v2 — Ciclo de Acompanhamento do Book

> [!abstract] Governança do book
> Como o book é preenchido, evidenciado, auditado e transformado em aprendizado todo mês — e como o padrão se sustenta mesmo quando o gestor do shopping muda. *(v1.1 preservado; acréscimos da v2 marcados.)*

### Visão geral

- **Objetivo** — Garantir que os processos do book sejam cumpridos de forma verificável, mês a mês, em todos os shoppings do portfólio — e que a adesão sobreviva à troca de gestor.
- **Papéis envolvidos**
  - *Gestor do shopping* — preenche o checklist mensal e anexa evidência.
  - 🆕 PES 4.2 *Monitor do Book* — ponto focal nomeado em cada ativo: acompanha mensalmente cada capítulo, faz a ponte com o PMO/dono corporativo, garante envio no prazo e a estrutura da auditoria. **Não** preenche itens de outros donos nem guarda evidência por eles.
  - *Regional / Portfólio* — acompanha a devolutiva individual de cada ativo.
  - *Auditoria (Cap. 17)* — valida por amostragem trimestral.
- **Painel consolidador** — Recebe os preenchimentos, calcula o score de cada ativo e devolve a evolução individual — sem comparar ativos entre si.

> [!important] O que não muda
> - Comparação é sempre o shopping contra o próprio histórico.
> - Sem ranking entre shoppings do portfólio.
> - Item marcado como **Feito** só conta com evidência anexada.

### Passo a passo do ciclo mensal

1. **Preenchimento** — Dono real de cada item marca Feito / Pendente / N/A, com evidência em todo item Feito, usando os 4 modelos padrão (ata · print datado · documento vigente com validade · planilha do período).
2. **Envio dentro do prazo** — até o 5º dia útil do mês seguinte. 🔄 Atraso não gera desconto aritmético: o item "envio no prazo" fica Pendente e o Monitor recebe alerta.
3. **Consolidação automática** — score de **meios** (ver fórmula abaixo).
4. 🧭 v2 **Leitura Meios × Fins** — o painel coloca o score do book ao lado do **Farol de Metas** do ativo (fins) e classifica o quadrante.
5. **Devolutiva individual** — mês atual vs. anterior vs. média 6 meses vs. melhor histórico; começa pela **variável** em que o ativo está pior no Farol, não pelo capítulo. Formato PDCA (meta → Pareto → porquês → 5W2H com no máximo 5 ações).
6. **Auditoria por amostragem** — trimestral, com as regras de auditoria abaixo; calcula a **dispersão**.
7. **Alerta de continuidade** — queda ≥ 15 p.p. coincidente com troca de gestor → reforço de onboarding (Cap. 20).
8. **Handoff formal** — 12 meses de checklist + evidências repassados ao sucessor.
9. **Selo de maturidade** — Bronze → Prata → Ouro por meses consecutivos acima da meta **e** dispersão < 5% na última auditoria (🆕 condição da v2).

### 🆕 Fórmula de score (v2)

```
Score de meios (mês) = Σ (peso_item × peso_pilar × status) / Σ (peso_item × peso_pilar) dos itens aplicáveis ao mês
   status: Feito com evidência = 1 · Pendente = 0 · N/A aprovado = fora do denominador
Score trimestral = média dos 3 meses validados após auditoria (PES 2020 §3.4 — média aritmética)
Fins = Farol de Metas do ativo (não é somado ao score; é o outro eixo do quadrante)
```

### 🆕 Meios × Fins — quadrante de diagnóstico

| | Farol positivo | Farol negativo |
| --- | --- | --- |
| **Book ≥ 80%** | Executa e entrega → documentar e replicar | Executa e não entrega → **hipótese do capítulo errada para este ativo**: recalibrar |
| **Book < 60%** | Entrega sem executar → checar sustentabilidade e dispersão | Prioridade de reforço → devolutiva presencial |

### 🆕 Dispersão (herdada do PES, adaptada)

```
Dispersão de meios = 1 − (pontuação de meios validada pela auditoria ÷ pontuação de meios declarada)
```

| Dispersão (D) | Consequência na v2 (proposta) | Referência PES 2020 |
| --- | --- | --- |
| D < 5% | Nenhuma — dado confiável | 0 pts debitados |
| 5% ≤ D < 10% | Devolutiva específica + amostra maior no trimestre seguinte | −200 pts |
| 10% ≤ D < 15% | Selo suspenso + reauditoria completa no mês seguinte | −300 pts / eliminatório (≥ 10% meios) |
| D ≥ 15% | Escalonamento ao sponsor; em 2+ ativos → reabrir o checklist (métrica de pivotagem) | −400 a desclassificação |

> [!warning] Limiares v2 são proposta; as faixas e consequências do PES 2020 estão ao lado só como referência histórica.

### 🆕 Regras de auditoria (PES 2020 §3.7, adaptadas)

- Auditoria valida **apenas** itens declarados como Feito — nunca há pontuação auditada maior que a declarada.
- Aviso de **até 2 dias** antes da visita (PES 2020) — auditoria "quase surpresa".
- Evidência **tem que estar na pasta/painel** no momento da auditoria; não vale buscar durante a sessão.
- Pelo menos **3 itens observados no piso** (in loco) por auditoria, além da evidência digital — é o que mede declarado vs. real.
- Auditor pode entrevistar qualquer colaborador da administração ou terceiro sobre o processo.
- 🆕 PES 2012 §3.8 Janela de **5 dias úteis** para o ativo contestar o relatório de auditoria, com decisão do PMO.

### 🆕 Não aplicabilidade (PES 2020 §3.1)

- N/A por **porte (P/M/G)** e **maturidade** é parâmetro do painel (automático).
- Qualquer outro N/A exige pedido formal anual ao PMO, com justificativa; resposta em até 15 dias.
- Ativo com **> 60% dos pontos de um capítulo** em N/A: o capítulo sai do score daquele ativo e vira **plano de adequação** (em vez de ser "ganho" pela ausência).

### 🆕 Canal de dúvidas (PES 2020 §3.5)

- Dúvidas registradas no painel até o **dia 7** de cada mês; respostas publicadas até o fim do mês numa **FAQ oficial do book**, válida para auditoria e igual para os 10 ativos.

### O que o painel consolidador precisa fazer

- [ ] Receber o checklist mensal de cada um dos 10 shoppings, com evidência anexada por item.
- [ ] Aplicar o peso de cada item e calcular o score só sobre os itens aplicáveis ao porte (P/M/G) e à maturidade (Implantação/Consolidada) daquele shopping.
- [ ] Mostrar a cada shopping sua própria evolução (mês atual, mês anterior, média 6 meses, melhor histórico) — nunca a posição dele frente aos outros.
- [ ] Sinalizar quedas de score que coincidam com troca de gestor, para acionar reforço de onboarding.
- [ ] Selecionar automaticamente a amostra trimestral de itens "Feito" para a Auditoria (Cap. 17) validar.
- [ ] Manter o histórico de 12 meses acessível para o handoff formal entre gestores.
- [ ] 🧭 v2 Aplicar peso de pilar (§ I.3) e mostrar só os itens **do mês** e **do dono** (Local/Compartilhado).
- [ ] 🧭 v2 Exibir o quadrante Meios × Fins com o Farol de Metas.
- [ ] 🆕 Calcular a dispersão por auditoria e o histórico de dispersão por ativo.
- [ ] 🧭 v2 Gerar o **Pareto de pendências** do portfólio (item pendente em ≥ 6 ativos por 3 meses → projeto trimestral corporativo, sai do checklist).
- [ ] 🆕 Hospedar a FAQ oficial e o registro de pedidos de N/A.

### Checklist operacional do CAB

| Execução (como fazer) | Periodicidade / Critério | Evidência |
| --- | --- | --- |
| Preencher o checklist mensal do book, item a item | Mensal, até o 5º dia útil | Registro no painel consolidador |
| Anexar evidência em todo item marcado como Feito | No ato do preenchimento | Print, ata, planilha ou link conforme o item |
| Consolidar os scores de todos os shoppings do portfólio | Mensal, após o prazo de envio | Painel consolidador atualizado |
| Gerar e enviar a devolutiva individual a cada shopping | Mensal | Relatório de evolução (mês atual vs. histórico) |
| Selecionar e auditar amostra de itens "Feito" | Trimestral | Relatório de auditoria (Cap. 17) |
| Registrar handoff de checklist + evidências na troca de gestor | No momento da transição | Histórico de 12 meses repassado ao sucessor |
| Recalibrar pesos de itens que pararam de discriminar | Anual | Ata de recalibração |
| 🆕 PES 4.2 Nomear Monitor do Book e comunicar substituição | Na implantação; troca em até 10 dias | E-mail ao PMO |
| 🆕 PES 3.1 Registrar pedidos de N/A fora do parâmetro | Anual (janeiro) | Pedido + resposta do PMO |
| 🆕 Calcular e comunicar dispersão da auditoria | Trimestral | Relatório de auditoria com D% |
| 🧭 v2 Ler Meios × Fins e abrir a RMR dos Supers com 1 ativo | Mensal (5 min) | Slide na RMR |
| 🧭 v2 Recalibração trimestral com superintendentes (pesos, itens, limiares) | Trimestral | Ata de recalibração |

---
'''

# ---------------------------------------------------------------- PER-CHAPTER BLOCKS
def blk(code, dono, escopo, regime, move, itens, notas=""):
    s = f"\n### {code} · 🆕 Revisão v2\n\n"
    s += f"> [!example] Enquadramento v2\n> **Dono real:** {dono} · **Escopo:** {escopo} · **Regime:** {regime} · **Move:** {move}\n"
    if notas:
        s += f">\n> {notas}\n"
    s += "\n"
    if itens:
        s += "**Itens acrescentados / ajustados**\n\n"
        for it in itens:
            s += f"- [ ] {it}\n"
    else:
        s += "_Sem itens novos do PES para este capítulo._\n"
    return s

B = {}
B["01"] = blk("01", "Superintendente", "Local", "Tight", "Proteção do NOI (governança)", [
 "🆕 `PES 2020 §4.2` Nomear o **Monitor do Book** do ativo e avisar substituição em até 10 dias — **Superintendente** · na implantação / por evento · _E-mail ao PMO_",
 "🧭 v2 Abrir a Reunião de Superintendência semanal com o status do book do mês (itens do mês e pendências) — **Superintendente** · semanal · _Pauta/ata_",
 "🧭 v2 Aplicar a hierarquia de pilares em decisões conflitantes e registrar em ata — **Superintendente** · por evento · _Ata_",
])
B["02"] = blk("02", "Coord. Operações (A: Ger. Operações)", "Local", "Tight", "Fluxo (ambiência, climatização) · Proteção do ativo", [
 "🆕 `PES 4.1.1` Manter **catálogo de equipamentos de ar-condicionado** (lojas + mall): localização, capacidade, ano, fabricante, modelo, vazão e tipo/estado da válvula (limitadora+moduladora **ou** independente de pressão); validação trimestral pelo Ger. Operações; plano de substituição de fan coils ≥ 10 anos — **Coord. Operações** · trimestral · _Planilha + e-mail de validação_",
 "🔄 `PES 4.1.2` Sistemas críticos (elétrica, climatização, incêndio) sem pendência aberta **> 30 dias** e sem pendência herdada do trimestre anterior — **Coord. Operações** · mensal · _Relatório do sistema de manutenção_",
 "🆕 `PES 4.1.4` **Checklists diários de limpeza** (abertura e manutenção; sanitários, praça de alimentação, mall, estacionamento), preenchidos pela equipe orgânica **e** pela terceira; máx. 2 dias de falha por equipe no mês, não sequenciais e não simultâneos — **Coord. Operações** · diário · _Checklist (app ou físico)_",
 "🆕 `PES 4.1.4` Rituais de limpeza: análise de desvios **semanal** (orgânico + terceiro), coordenação **mensal**, gerência **bimestral**; análise + plano de ação enviados em até 3 dias úteis — **Coord. Operações** · semanal/mensal/bimestral · _E-mail com plano de ação_",
 "🔄 `PES 4.1.9` Indicadores de utilidades e gestão ambiental (água, energia, resíduos) lançados **mensalmente até o dia 20** — alimenta o item ESG anual — **Coord. Operações** · mensal · _Sistema de gestão ambiental_",
 "🆕 `PES 4.1.6` Projeto de **medição remota/automatização do rateio de utilidades**: marcos documentação → piloto → % de pontos automatizados — **Ger. Operações** · marco trimestral até concluir · _Relatório de pontos de medição_",
], "AVCB: dono único passa a ser o **Coord. Mall/Segurança** (Cap. 04). O item de AVCB deste capítulo vira *consulta*, não execução.")
B["03"] = blk("03", "Coord. Mall/Segurança (A: Ger. Operações)", "Local", "Tight", "Proteção do ativo · Fluxo (segurança percebida)", [
 "🆕 `PES 6.1` ⚖️ validar Política de **não contratação de proteção armada** em mall, estacionamento e área externa; exceção só com aprovação da diretoria corporativa — **Ger. Operações** · anual (estado) · _Contratos + declaração_",
 "🆕 `PES 6.2` **Carro-forte** só fora do horário de funcionamento, em janelas definidas pela administração, com entrada e saída acompanhadas pelo CFTV — **Coord. Mall** · contínuo · _Procedimento + amostra de gravação_",
 "🆕 `PES 6.5` Mapa de **operações sensíveis** (joalheria, celulares, lotérica, câmbio, agências/ATMs) com trajeto até portaria de rua/estacionamento externo **< 50 m**; parecer de Segurança em toda nova locação desse tipo (interface com Cap. 08) — **Coord. Mall** · semestral + por locação · _Planta comercial marcada_",
 "🆕 `PES 6.6` **Caixas eletrônicos** em local que feche após o expediente (porta blindada ou de enrolar), com sensor de presença e câmera fixa de difícil acesso cobrindo todos os terminais — **Coord. Mall** · semestral · _Inspeção in loco_",
 "🔄 `PES 6.7` Treinamento da **política de segurança** (bimestral), do **manual de gestão de crise** (semestral) e **integração** de novos colaboradores (adm. e campo) com Segurança em até 30 dias da admissão — **Coord. Mall** · bimestral/semestral/por admissão · _Ata com assinaturas + fotos_",
])
B["04"] = blk("04", "Coord. Mall/Segurança (A: Ger. Operações)", "Local", "Tight", "Proteção do ativo / licença de operar", [
 "🔄 AVCB: dono único = Coord. Mall; renovação iniciada 90 dias antes do vencimento (unifica Cap. 02 e 04) — **Coord. Mall** · mensal (verificação) · _Certificado vigente_",
 "🆕 `PES 6.3` **Brigada de incêndio** dimensionada conforme tabela mínima (postos/dia), subordinada à supervisão de Segurança/Brigada; contrato e escala conferidos — **Coord. Mall** · trimestral · _Contrato + escala_",
 "🆕 `PES 6.4` **Vistoria de risco das lojas** (instalações, gás, elétrica, obstruções) com classificação de risco 1–4 e prazo de tratamento; loja em risco 4 = ação imediata e comunicação ao Superintendente — **Coord. Mall** · mensal · _Relatório de vistoria no sistema_",
 "🔄 `PES 6.7` Treinamento de **abandono** anual e cronograma do book de brigada — **Coord. Mall** · anual · _Ata + lista de presença_",
])
B["05"] = blk("05", "Coord. Operações (A: Ger. Operações)", "Local (operadora terceirizada executa)", "Tight", "Fluxo · Proteção do NOI (receita de estacionamento)", [
 "🆕 `PES 5.1` **Benchmark de concorrência** 2x/ano (março e setembro): tarifas dos concorrentes e do entorno + visita técnica ao principal concorrente com relatório fotográfico (pagamento, tabela, acesso, valet, motos, guarda-volumes) e teste de ao menos 1 serviço (valet, ticket perdido, mensalista ou interfone) — **Coord. Operações** · semestral · _Apresentação + relatório_",
 "🆕 `PES 5.2` ⚖️ validar **Alçadas para descontos/isenções** com estudo de impacto prévio (PES 2020: até R$ 1 mil Superintendente; R$ 1–20 mil área corporativa; > R$ 20 mil diretoria) e validação anual dos descontos contratuais — **Ger. Operações** · por evento + anual · _Estudo + e-mails de aprovação_",
 "🔄 `PES 5.3` Reajuste de tarifa ou mudança de grade **só com aprovação formal prévia** das alçadas, alinhado à premissa orçamentária — **Ger. Operações** · por evento · _E-mail com resposta de aprovação_",
 "🆕 `PES 5.4` **Reunião trimestral** Ger. Operações × gerente regional da operadora (pauta mínima: equipe, fluxo, custos, qualidade, documentação, regularidade, auditoria, datas especiais), intervalo mínimo de 45 dias — **Ger. Operações** · trimestral · _Ata assinada_",
 "🆕 `PES 5.5` **Dimensionamento da equipe** conforme tabela padrão por volume; qualquer desvio e reforço de datas festivas validados — **Coord. Operações** · mensal · _Folha da operadora vs. tabela_",
 "🆕 `PES 5.6` **POP do estacionamento** derivado do book de contingência, visível na sala da operadora, central de monitoramento, central de segurança e administração; validado pelo Ger. Operações — **Coord. Operações** · anual · _POP assinado + foto dos pontos_",
 "🆕 `PES 5.7` **5 treinamentos/ano** da equipe: auditoria de estacionamento (fev), atendimento (mar e ago), POP/contingência (mai e out) — **Coord. Operações** · conforme calendário · _Resumo + lista de presença + fotos_",
 "🔄 `PES 5.8` 100% das **preventivas de equipamentos** (cancelas, terminais, EPAs) em dia, OS assinada por operadora e mantenedora, lançada no mês — **Coord. Operações** · mensal · _Relatório de OS_",
 "🆕 `PES 5.9` 100% dos **sinistros** do estacionamento registrados no sistema de ocorrências com o fluxo padrão de atendimento — **Coord. Operações** · mensal · _Ocorrências SAC × sinistros cadastrados_",
])
B["06"] = blk("06", "Coord. Ambiência (A: Ger. Marketing)", "Local", "Loose estruturado (SLAs de atendimento são tight)", "Conversão (encantamento e recorrência)", [
 "🆕 `PES 4.1.12` **SLA do atendimento**: 1º retorno em até 24 h · resposta final em até 7 dias úteis · solução em até 60 dias úteis; **100% dos contatos** (telefone, e-mail, site, WhatsApp, presencial) registrados em sistema — planilha não vale; canal WhatsApp obrigatório — **Coord. Ambiência** · mensal · _Relatório de ocorrências_",
 "🆕 `PES 4.1.11` **Serviços mínimos ao consumidor**: espaço cliente, fraldário, banheiro família, empréstimo de carrinho de bebê e cadeira de rodas, carregador de celular, bebedouros nos acessos aos sanitários — **Coord. Ambiência** · trimestral · _Inspeção in loco_",
 "🆕 `PES 1.1.4` **FAQ para o SAC** a cada evento/ação/novidade relevante, enviada com ≥ 48 h úteis de antecedência (interface Cap. 09) — **Coord. Marketing** · por evento · _E-mail datado_",
 "🆕 `PES 4.1.13` **Checklist de Experiência do Consumidor** 2x/semana + rituais quinzenal (coord. Experiência, Operações, Marketing, Negócios), mensal (com Ger. Operações) e bimestral (com Superintendente); plano de ação em até 3 dias úteis — **Coord. Ambiência** · semanal/quinzenal/mensal/bimestral · _Checklist + e-mails_",
 "🆕 `PES 4.1.10` **Treinamento de postura de atendimento** trimestral para todas as equipes de campo (orgânicas e terceiras); novos admitidos em até 30 dias — **Coord. Ambiência** · trimestral · _Lista de presença + fotos_",
 "🧭 v2 Recuperação de serviço: atendente pode sair do script para reconciliar o cliente dentro de alçada definida — conteúdo de dojo, não de checklist.",
])
B["07"] = blk("07", "Coord. Ambiência (A: Ger. Operações / Ger. Negócios)", "Local", "Loose estruturado", "Conversão (venda do lojista)", [
 "🆕 `PES 1.2.1` **Welcome Kit** entregue até o 1º dia útil após inauguração ou troca de operador (carta de boas-vindas, contatos-chave, normas gerais e de segurança, tabela de mídia); não se aplica a reforma, troca de LUC/nome, pop-up e vending — **Superintendente ou gerente** · por evento · _Foto da entrega enviada ao Monitor_",
 "🆕 `PES 2.6` **Reunião com novo lojista** em até 30 dias da inauguração explicando informe de vendas e auditoria, com material padrão enviado por e-mail — **Coord. Negócios** · por evento · _E-mail ou protocolo_",
 "🆕 `PES 1.3.1` **Reunião trimestral com lojistas** (resultados das ações, boas práticas, obras, mudanças de procedimento) — **Ger. Marketing** · trimestral · _Ata assinada_",
 "🆕 `PES 4.1.3` **Jirau/mezanino** de lojas novas ou reformadas adequado ao caderno técnico (ou ao projeto aprovado na prefeitura) — **Coord. Ambiência** · por obra · _Relatório de obra com fotos + projeto aprovado_",
])
B["08"] = blk("08", "Ger. Negócios + Coord. Negócios", "Local", "Loose estruturado (políticas contratuais são tight)", "Fluxo · Ticket (mix)", [
 "🆕 `PES 3.2.2` ⚖️ validar **Condomínio com base em CRD em 100% dos novos contratos** (inclui Key Accounts); contribuição fixa conta como não conforme — **Coord. Negócios** · mensal · _CRM: nº contratos com CRD ÷ nº assinados_",
 "🆕 `PES 3.2.1` ⚖️ validar **Condições mínimas de contratos de mall/quiosque** (PES 2020: prazo indeterminado, 14 aluguéis/ano, condomínio comum ≥ média do ano anterior, condomínio específico quando aplicável) — **Coord. Negócios** · mensal · _Contratos do mês + CRM_",
 "🆕 `PES 3.1.1` **Pós-venda de mídia** no sistema em até 30 dias após o fim da última veiculação, para propostas acima do piso do cluster (valores de 2020 a atualizar) — **Coord. Negócios / executivo de mídia** · mensal · _Sistema de mídia_",
 "🆕 `PES 3.3` **NPS de anunciantes** (externos e lojistas) medido e acompanhado — **fim**, vai para o eixo de resultados — **Ger. Negócios** · semestral · _Pesquisa_",
 "🆕 `PES 6.5` Parecer de Segurança (Cap. 03) antes de locar operação sensível fora do raio de 50 m de portaria — **Ger. Negócios** · por locação · _Parecer anexado à negociação_",
])
B["09"] = blk("09", "Ger. Marketing + Coord. Marketing", "Local (PB compartilhado com CRM corporativo)", "Loose estruturado", "Fluxo · Conversão · Ticket", [
 "🆕 `PES 1.1.1` **Interfaces atualizadas**: site/app (institucional, lojas, eventos, cinema, serviços, horário, contatos, política pet), intranet do lojista, diretórios, totens e sinalização de campanha — **Coord. Marketing** · mensal · _Checagem com prints datados_",
 "🔄 `PES 1.1.2 · 1.1.3` **Sinalização padrão de serviços** (wi-fi, política pet coerente com a regra do ativo) nos acessos, praça de alimentação, elevadores, praça de eventos e lounges — **Coord. Marketing** · semestral · _In loco_",
 "🆕 `PES 1.1.5` **Mídia paga externa** para os principais atrativos com plano de mídia mensal (posts orgânicos não contam) — **Ger. Marketing** · mensal · _Plano de mídia_",
 "🔄 `PES 1.3.2` Evento só abre com **legalização confirmada por Operações** por e-mail até a data de inauguração (complementa o item de alvará ⚠️) — **Coord. Marketing** · por evento · _E-mail de Operações_",
 "🔄 `PES 1.3.3` **Scorecard do evento** em até 30 dias após o término (complementa o item de ROI); ação recorrente = 1 scorecard/ano — **Coord. Marketing** · por evento · _Scorecard_",
 "🔄 `PES 1.4.2` PB: **leads completos** (nome, e-mail, CPF, celular) vs. ano anterior — **fim**, lido junto com share of ID — **Coord. CRM** · trimestral · _Relatório da base_",
 "🧭 v2 Todo evento/campanha **novo** declarado como experimento tem KPI e critério de parada definidos antes (regime loose).",
])
B["10"] = blk("10", "Coord. Negócios (A: Ger. Negócios)", "Compartilhado (Tesouraria/Controladoria)", "Tight", "Proteção do NOI", [
 "🆕 `PES 4.1.8` **ISC do condomínio** saudável: > 50% nos 3 meses do trimestre; entre 0 e 50% só aceitável se crescente mês a mês; negativo = alerta — **Coord. Negócios** · mensal · _Relatório de caixa da Tesouraria_",
 "🆕 `PES 1.4.1` **Saúde de caixa do FPP** (ISC) no fechamento do ano, com faixa-alvo definida pela Tesouraria — **fim** — **Ger. Marketing + Coord. Negócios** · mensal (acompanhamento) · _Resumo de caixa_",
 "🔄 `PES 4.1.7` Prestação de contas ao lojista publicada **exatamente como extraída do sistema** (sem ajuste manual); prazo do book (D+10) prevalece sobre o do PES (15º d.u.) — **Coord. Negócios** · mensal · _Arquivo publicado + data de extração_",
])
B["11"] = blk("11", "Jurídico corporativo", "Matricial", "Tight", "Proteção do ativo", [])
B["13"] = blk("13", "TI/BI corporativo", "Matricial (Super valida dashboards)", "Tight", "Proteção do NOI (dado confiável)", [
 "🧭 v2 Manter o **painel CAB v2** (score ponderado, Meios × Fins, dispersão, Pareto, FAQ, N/A) — **TI/BI** · contínuo · _Painel publicado_",
 "🧭 v2 Garantir que **ocorrências de SAC e sinistros** tenham sistema de registro (não planilha) — pré-requisito dos itens PES 4.1.12 e 5.9 — **TI** · anual · _Sistema ativo_",
])
B["14"] = blk("14", "Coord. Operações (facilities) / Suprimentos", "Local + Matricial", "Tight", "Proteção do ativo (risco solidário)", [
 "🔄 `PES 5.5 · 6.3` Conferência de **efetivo contratado vs. tabela padrão** para operadora de estacionamento e brigada, junto com a validação trabalhista mensal — **Coord. Operações** · mensal · _Folha do terceiro vs. tabela_",
])
B["15"] = blk("15", "Coord. Negócios (A: Ger. Negócios)", "Compartilhado", "Tight", "Proteção do NOI", [])
B["16"] = blk("16", "Ger. Negócios + Coord. Negócios", "Local", "Loose estruturado", "Conversão · Ticket", [
 "🆕 `PES 2.4` **100% das lojas e quiosques com venda informada** (abertura diária) até o 6º dia útil, mesmo não auditáveis; atraso → lançamento por triangulação e sanções das Normas Gerais com aval do comitê — **Coord. Negócios** · mensal · _Mapa de vendas_",
])
B["17"] = blk("17", "Controladoria/Auditoria", "Matricial (Coord. Negócios faz input e triangulação)", "Tight", "Proteção do NOI", [
 "🆕 `PES 2.2` **Carta de aviso de auditoria** em via física até 3 dias corridos antes (exceto auditoria fiscal), com protocolo de recebimento — **Coord. Negócios** · por auditoria · _Protocolo_",
 "🆕 `PES 2.3` **Devolutiva do relatório de auditoria ao lojista** em reunião presencial (≥ 80% das lojas auditadas no mês), até o fim do mês seguinte, com relatório por e-mail em até 2 dias úteis; analista da auditoria presente — **Coord. Negócios** · mensal · _E-mail com pontos da reunião + relatório_",
 "🔄 `PES 2.5` Auditoria fiscal cobrindo os **3 últimos exercícios**; toda cobrança validada em ata do comitê; **termo de quitação** após pagamento integral — **Controladoria** · anual · _Controle + atas + termos_",
 "🆕 `PES 2.1` Equipe de auditores com no máximo **10 estagiários por supervisor**, vínculo formal e requisitos mínimos (mitigação trabalhista) — **Controladoria** · trimestral · _Folha + contratos_",
])
B["18"] = blk("18", "Ger. Negócios + Coord. Negócios", "Local", "Loose estruturado (prazos legais são tight)", "Ticket · Proteção do NOI", [
 "🆕 `PES 2.7` ⚖️ validar **Condomínio com base em CRD em 100% das renovações** assinadas (inclui Key Accounts; renovatórias por sentença fora do cálculo) — **Coord. Negócios** · mensal · _CRM_",
])
B["19"] = blk("19", "Jurídico corporativo (Ger. Negócios participa)", "Matricial", "Tight", "Proteção do NOI", [
 "🆕 `PES 4.2.1` **Ações judiciais de prestação de contas do condomínio**: meta zero novas; acordos que reduzem o estoque; leitura anual acumulada — **fim** — **Jurídico** · trimestral · _Validação do Jurídico por e-mail_",
])
B["20"] = blk("20", "Gente & Performance (Super conduz)", "Matricial", "Tight", "Proteção do NOI (continuidade)", [
 "🆕 `PES 4.1.5` **Reconhecimento das equipes de campo** (orgânicas e terceiras): Funcionário Estrela mensal por grupo de ≥ 15 pessoas + sorteio trimestral; critérios públicos (assiduidade, sem advertência, treinamentos em dia, postura); ritual formal com o líder direto e a superintendência; quadro de gestão à vista — **Superintendente + Coord. Operações** · mensal · _Fotos + quadro atualizado_",
 "🔄 `PES 2.2` Regras de elegibilidade ao reconhecimento do book (Selo/Premiallos): admitidos após o 3º trimestre não elegíveis; entre julho e setembro, pró-rata; transferidos e promovidos pelo período maior — **G&P** · anual · _Regulamento publicado_",
 "🧭 v2 Book no **onboarding D0–D5** e no PDI; competência \"executa com evidência\" nos descritivos de função — **G&P** · por admissão · _Checklist de onboarding_",
])

# ---------------------------------------------------------------- ANEXOS NOVOS
ANEXOS = r'''## Anexo D v2 · Calendário único

> [!important] Um trilho só
> A **Semana de Comitês** absorve os ritos do book, do PES, do Handbook de Operações e do Governance & KPI Monitor. Mesma sequência, mesma semana, nos 10 ativos.

### Semana de Comitês (mensal)

| Quando | Rito | Capítulos |
| --- | --- | --- |
| Toda semana | Reunião de Superintendência · Deal Conversion · alinhamento com operadora de estacionamento · análise de desvios de limpeza | 01 · 08 · 05 · 02 |
| Até 5º d.u. | Envio do checklist CAB · repasse ao empreendedor | 00 · 10 |
| Até 6º d.u. | 100% das vendas informadas | 16 |
| Dia 7 | Prazo de dúvidas do book | 00 |
| S2 (D12–D14) | Performance de Lojas → Auditoria e Performance → Comercial (novas locações, renovações e vacância) | 16 · 17 · 08 · 18 |
| S3 (D16–D18) | Jurídico/Contencioso → Inadimplência → Cluster experience (eventos, PB) | 19 · 10 · 09 |
| Até dia 20 | Utilidades e gestão ambiental lançadas | 02 |
| S4 (D20) | Comitê gestor — consolida e fecha plano de ação | 01 |
| Fim do mês | FAQ oficial publicada · devolutiva CAB | 00 |

### Diária

- [ ] Briefing de turno de Segurança (3 turnos) [03]
- [ ] Round operacional matinal (Super + Ops) — 🧭 v2 vira agenda semanal de posições da liderança
- [ ] Acompanhamento de chamados — SAC, manutenção [02, 06]
- [ ] Monitoramento de fluxo, vendas e ocorrências
- [ ] Conciliação bancária diária — Financeiro [10]
- [ ] Acompanhamento de obras de lojistas em andamento [07]
- [ ] Triagem do dashboard de TI e sistemas críticos [13]
- [ ] Monitoramento de uso do programa de benefícios [09]
- [ ] 🆕 Checklists de limpeza — orgânico e terceiro [02]
- [ ] 🆕 Registro de 100% dos contatos de clientes em sistema [06]

### Semanal

- [ ] Reunião de Superintendência (com 3 gerentes) [01]
- [ ] Reunião interna de cada gerência com sua equipe
- [ ] Atualização do mapa de processos jurídicos [19]
- [ ] Status de obras de lojistas (vistorias) [07]
- [ ] Análise parcial de fluxo, vendas e SAC
- [ ] Inspeções de manutenção rotineira [02]
- [ ] Atualização do pipeline de renovações (12-6m) [18]
- [ ] Análise de campanhas de CRM e engajamento [09]
- [ ] 🆕 Análise de desvios de limpeza (orgânico × terceiro) [02]
- [ ] 🆕 Checklist de Experiência do Consumidor (2x) [06]

### Quinzenal

- [ ] 🆕 Reunião de coordenação de Experiência do Consumidor [06]

### Mensal

- [ ] Repasse para empreendedor — até dia útil 5 [10]
- [ ] Prestação de contas do condomínio — até D+10 [10]
- [ ] Comitê de Performance de Lojas — meio do mês [16]
- [ ] Comitê Jurídico (contencioso) — meio do mês [19]
- [ ] Revisão de base e ROI do programa de benefícios [09]
- [ ] 1:1 com lojas em "atenção" e "crítico" [16]
- [ ] Apuração de KPIs operacionais e SLAs (todos)
- [ ] Validação obrigações trabalhistas dos terceiros [14]
- [ ] Garantias com vencimento em 90 dias — ação [15]
- [ ] Reuniões de comitê por gerência + ata em 48h [01]
- [ ] 🆕 ISC do condomínio e do FPP [10]
- [ ] 🆕 Vistoria de risco das lojas [04]
- [ ] 🆕 Funcionário Estrela + gestão à vista [20]
- [ ] 🆕 Devolutivas de relatório de auditoria aos lojistas [17]
- [ ] 🆕 Checagem de interfaces e mídia paga [09]
- [ ] 🆕 Coordenação de limpeza e de experiência (mensais) [02, 06]

### Bimestral

- [ ] 🆕 Treinamento da política de segurança [03]
- [ ] 🆕 Reunião de gerência de limpeza e de experiência (com GEOP/Superintendente) [02, 06]

### Trimestral

- [ ] 🆕 Reunião com operadora de estacionamento (intervalo ≥ 45 dias) [05]
- [ ] 🆕 Reunião do Marketing com lojistas [07]
- [ ] 🆕 Treinamento de postura de atendimento (campo) [06]
- [ ] 🆕 Validação do catálogo de ar-condicionado [02]
- [ ] 🧭 v2 Auditoria amostral do book + cálculo de dispersão [00, 17]
- [ ] 🧭 v2 Recalibração com superintendentes (pesos, itens, limiares) [00]

### Semestral

- [ ] 🆕 Benchmark de concorrência do estacionamento (março e setembro) [05]
- [ ] 🆕 Treinamento do manual de gestão de crise [03]
- [ ] 🆕 Revisão do mapa de operações sensíveis (50 m) e dos ATMs [03]
- [ ] 🆕 NPS de anunciantes de mídia [08]

### Calendário anual de treinamentos do estacionamento

| Mês | Treinamento |
| --- | --- |
| Fevereiro | Auditoria de estacionamento |
| Março | Qualidade no atendimento |
| Maio | POP / contingência |
| Agosto | Qualidade no atendimento |
| Outubro | POP / contingência |

### Anual

- [ ] Planejamento estratégico (set–out)
- [ ] Orçamento anual (out–nov) [01, 10]
- [ ] Plano anual de marketing — até 30/nov [09]
- [ ] Revisão do regulamento do programa de benefícios [09]
- [ ] Atualização anual de garantias contratuais [15]
- [ ] Plano e execução de auditoria fiscal [17]
- [ ] Simulado de emergência (mín. 1x/ano) [04]
- [ ] Renovação de AVCB e demais licenças [04]
- [ ] Pesquisa de satisfação de lojistas [07]
- [ ] Auditoria externa do condomínio [10]
- [ ] Auditoria LGPD do programa de benefícios (Compliance, área matricial) [09]
- [ ] Análise causa-raiz de renovatórias do ano [18]
- [ ] Revisão deste Book de Processos
- [ ] 🆕 Treinamento de abandono [04]
- [ ] 🆕 POP do estacionamento revisado e enviado [05]
- [ ] 🆕 Pedidos formais de N/A (janeiro) [00]
- [ ] 🆕 Validação dos descontos contratuais de estacionamento [05]
- [ ] 🧭 v2 Revisão do book pelo Strategic Plan Evaluation Engine (7 testes, inclusive critério de parada por item)

---

## Anexo F · Rastreabilidade PES 2020 → Book v2

Legenda: 🆕 incorporado como item novo · 🔄 ajustou item existente · ✅ já coberto pelo v1.1 · ❌ não adotado · ⚖️ política a validar.

### Regulamento

| PES 2020 | Destino na v2 | Status |
| --- | --- | --- |
| §2.2 Regras de participantes (pró-rata, transferidos, promovidos) | Cap. 20 | 🔄 |
| §3.1 Não aplicabilidade formal + regra dos 60% | Cap. 0 | 🔄 |
| §3.2 Autoavaliação (meios + fins) | Cap. 0 (mensal, meios × fins em eixos separados) | 🔄 |
| §3.4 Pontuação = média das autoavaliações validadas | Cap. 0 (fórmula v2) | 🔄 |
| §3.4.1 Critérios de desempate | — | ❌ não há ranking |
| §3.5 Canal de dúvidas até dia 7 + FAQ oficial | Cap. 0 | 🆕 |
| §3.6 Evidências salvas em formato padrão | Cap. 0 (4 modelos de evidência) | ✅ |
| §3.7 Auditoria: só valida o declarado, aviso ≤ 2 dias, evidência na pasta, entrevistas | Cap. 0 | 🆕 |
| §4.1 Critérios eliminatórios (dispersão ≥ 10% meios / ≥ 20% fins) | Cap. 0 (reauditoria + selo suspenso) | 🔄 |
| §4.2 Redução de pontos por dispersão | Cap. 0 (tabela de consequências) | 🔄 |
| §4.2 Monitor do PES | Cap. 0 e 01 (Monitor do Book) | 🆕 |
| Atraso = −100 pts/dia | Cap. 0 (pendência + alerta) | 🔄 |
| §5.1 Medalhas por faixa | Selo Bronze/Prata/Ouro + Premiallos | 🔄 |
| §5.2 Prêmio monetário por cargo | — | ❌ incompatível com "sem ranking" |

### Categorias

| Item PES 2020 | Pts | Destino | Status |
| --- | --- | --- | --- |
| 1.1.1 Interfaces atualizadas | 100 | 09 | 🆕 |
| 1.1.2 Sinalização pet-friendly | 70 | 09 | 🔄 |
| 1.1.3 Sinalização wi-fi | 70 | 09 | 🔄 |
| 1.1.4 FAQ ao SAC ≥ 48 h úteis | 100 | 06 | 🆕 |
| 1.1.5 Mídia paga externa mensal | 80 | 09 | 🆕 |
| 1.2.1 Welcome Kit | 100 | 07 | 🆕 |
| 1.3.1 Reunião trimestral com lojistas | 80 | 07 | 🆕 |
| 1.3.2 Legalização de eventos | 60 | 09 | ✅ + 🔄 |
| 1.3.3 Scorecard em 30 dias | 50 | 09 | 🔄 |
| 1.4.1 ISC do FPP | 150 | 10 | 🆕 (fim) |
| 1.4.2 Geração de leads | 140 | 09-PB | 🔄 (fim) |
| 2.1 Proporção supervisor:auditores | 100 | 17 | 🆕 |
| 2.2 Carta de aviso de auditoria | 150 | 17 | 🆕 |
| 2.3 Devolutiva do relatório ao lojista | 150 | 17 | 🆕 |
| 2.4 Informe de vendas até 6º d.u. | 150 | 16 | 🆕 (complementa input/triangulação do 17) |
| 2.5 Auditoria fiscal + termo de quitação | 150 | 17 | ✅ + 🔄 |
| 2.6 Reunião com novos lojistas | 150 | 07 | 🆕 |
| 2.7 CRD nas renovações | 150 | 18 | 🆕 ⚖️ |
| 3.1.1 Pós-venda de mídia | 150 | 08 | 🆕 (atualizar pisos) |
| 3.2.1 Condições de contratos de mall | 150 | 08 | 🆕 ⚖️ |
| 3.2.2 CRD em novos contratos | 150 | 08 | 🆕 ⚖️ |
| 3.3.1–3.3.2 NPS de anunciantes | 300 | 08 | 🆕 (fim) |
| 4.1.1 Catálogo de ar-condicionado e válvulas | 50 | 02 | 🆕 |
| 4.1.2 Manutenções prioritárias | 85 | 02 | ✅ + 🔄 |
| 4.1.3 Jirau | 70 | 07 | 🆕 |
| 4.1.4 Checklists e rituais de limpeza | 85 | 02 | 🆕 |
| 4.1.5 Funcionário Estrela | 80 | 20 | 🆕 |
| 4.1.6 Automatização do rateio | 50 | 02 | 🆕 (marco de projeto) |
| 4.1.7 Prestação de contas sem ajuste manual | 50 | 10 | ✅ + 🔄 (prazo do book prevalece) |
| 4.1.8 ISC do condomínio | 50 | 10 | 🆕 |
| 4.1.9 Gestão ambiental até dia 20 | 50 | 02 | 🔄 |
| 4.1.10 Treinamento de postura | 85 | 06 | 🆕 |
| 4.1.11 Serviços ao consumidor | 70 | 06 | 🆕 |
| 4.1.12 SLA do SAC | 70 | 06 | 🆕 |
| 4.1.13 Checklist de experiência + rituais | 85 | 06 | 🆕 |
| 4.2.1 Ações de prestação de contas | 95 | 19 | 🆕 (fim) |
| 5.1 Benchmark de concorrência | 100 | 05 | 🆕 |
| 5.2 Alçadas de desconto/isenção | 100 | 05 | 🆕 ⚖️ |
| 5.3 Reajuste de tarifa com aprovação | 110 | 05 | ✅ + 🔄 |
| 5.4 Reunião trimestral com operadora | 90 | 05 | 🆕 |
| 5.5 Dimensionamento da equipe | 110 | 05 · 14 | 🆕 |
| 5.6 POP do estacionamento | 120 | 05 | 🆕 |
| 5.7 Treinamentos (5/ano) | 120 | 05 | 🆕 |
| 5.8 Preventiva de equipamentos | 120 | 05 | 🔄 |
| 5.9 Registro de sinistros | 130 | 05 | 🆕 |
| 6.1 Sem proteção armada | 140 | 03 | 🆕 ⚖️ |
| 6.2 Carro-forte | 140 | 03 | 🆕 |
| 6.3 Brigada dimensionada | 140 | 04 · 14 | ✅ + 🔄 |
| 6.4 Vistoria de risco das lojas | 150 | 04 | 🆕 |
| 6.5 Operações sensíveis < 50 m da portaria | 140 | 03 · 08 | 🆕 |
| 6.6 Caixas eletrônicos | 140 | 03 | 🆕 |
| 6.7 Treinamentos de segurança | 150 | 03 · 04 | 🔄 |

> [!warning] Efeito colateral: o checklist cresce
> O v1.1 tinha **122 itens**; a v2 acrescenta **≈ 55** (entre 🆕 e 🔄 com critério novo). O que impede que isso vire burocracia: (1) o painel mostra **só os itens do mês e do dono** — boa parte dos novos é semestral, anual ou por evento; (2) itens de **estado** (política armada, ATMs, 50 m, serviços ao consumidor) são verificados 1–2x/ano, não mensalmente; (3) a regra do Pareto tira do checklist item crônico e o transforma em projeto. Mesmo assim, recomendo **alocar os novos itens nas ondas** (Onda 1: 03, 04, 05, 02; Onda 2: 06, 07, 08, 09, 16, 17; Onda 3: 10, 18, 19, 20) e medir o **tempo para evidenciar** no dojo — se passar de 5 min por item, cortar.

---

## Anexo G · Ferramentas sugeridas

> [!info] Princípio
> **Uniformidade vem da ferramenta, não do treinamento.** Antes de contratar qualquer coisa, usar o que a Allos já tem (o book já opera sobre SharePoint e DocuSign; o Handbook de Operações usa a ferramenta `operacoes.allos.co`). Nenhuma contratação deve ser feita sem sua confirmação.

### Por mecanismo do plano de 90 dias

| Mecanismo | Necessidade | Sugestão principal | Alternativa | Já existe na casa? |
| --- | --- | --- | --- | --- |
| **Verificar** | Painel CAB v2 (checklist mensal, evidência, score ponderado, dispersão, Pareto) | **Microsoft 365**: lista SharePoint (itens) + Power Apps (formulário por dono/mês) + Power Automate (lembretes D-3, D+1 do 5º d.u.; alerta de ⚠️) + Power BI (score, Meios × Fins, Pareto) | App próprio em **Supabase + Vercel** (mais controle, exige desenvolvedor) ou Airtable | Provável (SharePoint já é a pasta de evidência do book) — confirmar licenças Power Apps/BI com TI |
| **Verificar (campo)** | Checklists in loco com foto, geolocalização, offline, plano de ação — limpeza, experiência, vistoria de risco, estacionamento | Estender a ferramenta do Handbook (`operacoes.allos.co`) | **Checklist Fácil** (brasileira; web + app offline, evidência com foto e assinatura, plano de ação automático, módulo Power BI) | Sim (Handbook) — evitar dupla declaração |
| **Verificar (fins)** | Farol de Metas ao lado do score | Conectar o Farol ao Power BI do painel | Export mensal manual na v1 | Sim (Farol) |
| **Conhecer** | Microvídeos 3 min, cartões de bolso, quiz ≥ 80% | Editar os roteiros já escritos no **Descript**; hospedar no Teams/Stream; quiz no **Microsoft Forms**; QR code no cartão de bolso levando ao vídeo | LMS corporativo, se houver | Parcial |
| **Executar** | Semana de Comitês igual nos 10 ativos | Convites recorrentes padronizados no Outlook/Teams + modelo único de ata | — | Sim |
| **Executar** | Ata em 48 h | Transcrição do Teams ou **Granola** para rascunho de ata | — | Parcial — atenção a consentimento (LGPD) e **não gravar Comitê Jurídico** sem aval do Jurídico |
| **Executar** | Assinatura de atas e contratos | **DocuSign** | — | Sim |
| **Corrigir** | Plano de ação 5W2H e acompanhamento | Microsoft Planner (1 plano por ativo) ligado ao painel | Tarefas dentro do Power Apps | Provável |
| **Inteligência** | Devolutiva, dispersão preditiva, dúvidas | **Copiloto do Book** (projeto Claude com book v2 + cartões + export do painel): rascunha a devolutiva Meios × Fins; aponta evidência suspeita (arquivo repetido, sem data, igual em 2 ativos, data fora do período); responde "como faço o item X"; monta o Pareto | — | Parcial |
| **Inteligência** | Comitês 16/17/18 e governança | Skills já disponíveis: *Performance de Lojas* (risco de subdeclaração → seleção da auditoria), *renovação de contratos* (Cap. 18), *governance-kpi-monitor* (calendário e KPIs), *Strategic Plan Evaluation Engine* (revisão anual do book) | — | Sim |
| **Base de conhecimento** | Versão oficial do book para os 10 ativos | **SharePoint/Teams** como fonte oficial; Obsidian como sua camada de análise (Dataview/Tasks) | — | Sim |

### Sequência recomendada

1. **Semana 0–2** — Painel v1 em SharePoint + Power Apps com os itens da Onda 1; nenhuma contratação nova.
2. **Semana 2–4** — Mapear quais itens de campo já estão no `operacoes.allos.co` e importar a rubrica (Ótimo/Bom/Razoável/Ruim → 100/80/60/0) em vez de declarar duas vezes.
3. **Semana 4–6** — Copiloto do Book rodando sobre o export do M1 (devolutivas + dispersão preditiva).
4. **Semana 6** — Decisão de arquitetura definitiva com TI (manter M365 × app próprio × ferramenta de checklist de campo), com base no **tempo para evidenciar** e na dispersão medidos no M1–M2.

> [!warning] Não verificado
> Não conferi licenças da Allos (Power Apps, Power BI, Planner), preço de nenhuma ferramenta, nem o que o `operacoes.allos.co` já cobre hoje. As descrições do Checklist Fácil vêm de fontes públicas (b2bstack e Mobile Time), não de teste.

---
'''

EXTRA_GLOSS = r'''- **[[CRD]]** — critério de rateio do condomínio proporcional (base de cobrança exigida pelo PES em novos contratos e renovações). *Sigla usada no PES sem definição expandida — confirmar a nomenclatura vigente na Allos.*
- **[[Dispersão]]** — 1 − (pontuação validada pela auditoria ÷ pontuação declarada). Mede a confiabilidade da autoavaliação.
- **[[EPA]]** — Estação de pagamento automático do estacionamento.
- **[[FTR]]** — Vistoria de risco das lojas usada pelo PES (classificação de risco 1 a 4). *Sigla não expandida na fonte.*
- **[[ISC]]** — Indicador de saúde de caixa (condomínio e FPP) usado pela Tesouraria. *Sigla não expandida na fonte.*
- **[[Meios e Fins]]** — Meios: execução dos processos (score do book). Fins: resultados (Farol de Metas).
- **[[Monitor do Book]]** — Ponto focal do book em cada ativo (herdado do "monitor do PES").
- **[[PICV]]** — Válvula independente de pressão (opção 2 do item de fan coils).
- **[[Welcome Kit]]** — Kit de boas-vindas ao lojista entregue até o 1º dia útil após a inauguração.'''

# ---------------------------------------------------------------- ASSEMBLY
i_sum = idx("## Sumário")
i_como = idx("## Como usar este book")
i_cab = idx("## Capítulo 0 · CAB")
i_01 = idx("## 01 · GOV")
i_anexoA = idx("## Anexo A")
i_anexoD = idx("## Anexo D")
i_ref = idx("## Referências e fontes")
i_lac = idx("## Lacunas identificadas")
i_con = idx("## Conexões (Dataview)")

sumario = lines[i_sum:i_como]
# add new general sections to sumário
sumario_txt = "\n".join(sumario).replace(
 "- [[#Capítulo 0 · CAB — Ciclo de Acompanhamento do Book]]",
 "- [[#Parte I · Fundamentos da v2]]\n- [[#Capítulo 0 · CAB v2 — Ciclo de Acompanhamento do Book]]").replace(
 "- [[#Anexo D · Calendário operacional]]",
 "- [[#Anexo D v2 · Calendário único]]\n- [[#Anexo F · Rastreabilidade PES 2020 → Book v2]]\n- [[#Anexo G · Ferramentas sugeridas]]")

front = lines[i_como:i_cab]  # como usar, pilares, glossário
front_txt = "\n".join(front)
front_txt = front_txt.replace("- **[[Turnover]]** — Taxa de rotatividade de colaboradores em um período.",
    "- **[[Turnover]]** — Taxa de rotatividade de colaboradores em um período.\n\n**Acrescentados na v2 (vindos do PES)**\n\n" + EXTRA_GLOSS)
front_txt = front_txt.replace("## Os 4 pilares da operação\n",
    "## Os 4 pilares da operação\n\n> [!important] 🧭 v2 Os pilares estão em **ordem de prioridade** — ver [[#I.2 Hierarquia dos pilares (regra de desempate)]].\n")

# chapters with inserted blocks
ch = lines[i_01:i_anexoA]
out_ch = []
cur = None
for k, l in enumerate(ch):
    m = re.match(r"^## (\d\d) · ", l)
    if m:
        cur = m.group(1)
    # separator before next H2: insert block of current chapter
    if l == "---" and cur and k + 2 < len(ch) and (ch[k+2].startswith("## ") ) :
        out_ch.append(B.get(cur, ""))
        out_ch.append("")
    out_ch.append(l)
# last chapter (20) ends right before Anexo A; its separator is the final '---' in ch
ch_txt = "\n".join(out_ch)
if "### 20 · 🆕 Revisão v2" not in ch_txt:
    # append before trailing separator
    ch_txt = ch_txt.rstrip()
    if ch_txt.endswith("---"):
        ch_txt = ch_txt[:-3].rstrip() + "\n" + B["20"] + "\n---\n"
ch_txt = ch_txt + "\n"

anexAB = "\n".join(lines[i_anexoA:i_anexoD])
ref = "\n".join(lines[i_ref:i_lac]).rstrip()
if ref.endswith("---"):
    ref = ref[:-3].rstrip()
ref += r'''

**Fontes acrescentadas na v2**

- *Programa de Excelência em Shoppings — PES 2020* (brMalls, `PES_2020_v2.pdf`) — regulamento e 6 categorias; base do Anexo F. Os anexos citados no PES (tabelas de dimensionamento, modelos de carta, book de contingência) **não estavam no arquivo**.
- *PES 2012* (brMalls, `Manual_PES.pdf`, parcialmente corrompido) — só lições de desenho (pesos por autoavaliação, auditoria quase surpresa, correção de relatório).
- [[Reavaliação do plano do book]] (set/2026) — argumento estratégico, linha de visão, donos reais, regimes, calendário único.
- [[Plano de Implantação do Book — 90 dias]] · [[Formato 3·30·5]].

---
'''
lac = "\n".join(lines[i_lac:i_con]).rstrip()
if lac.endswith("---"):
    lac = lac[:-3].rstrip()
lac += r'''

**Status na v2**

- [ ] Cap. 12 e 21 — **seguem inexistentes**; a v2 não cria capítulos novos (os itens do PES couberam nos 19 existentes).
- [ ] Visão geral/RACI dos Cap. 08, 10 e 17 — **seguem ausentes**; a v2 cobre parcialmente com o *Dono real* do bloco v2.
- [ ] Anexos C e E — **seguem ausentes**; o Anexo E pode ser substituído pelos 4 modelos de evidência do [[Formato 3·30·5]].
- [ ] Legenda ● ○ – — **a oficializar** no kickoff (proposta: obrigatório / recomendado / não aplicável).
- [ ] 🆕 Políticas marcadas ⚖️ (CRD, contratos de mall, alçadas de estacionamento, proteção armada) — **confirmar vigência na Allos** antes de entrar no checklist.
- [ ] 🆕 Siglas do PES sem definição na fonte (CRD, ISC, FTR) — confirmar nomenclatura interna.
- [ ] 🆕 Valores em R$ do PES (pisos de mídia por cluster, alçadas) são de 2020 — atualizar.

---
'''

TAIL = r'''## Conexões (Dataview)

> [!tip] Requer o plugin Dataview habilitado

**Itens novos da v2 ainda em aberto**

```dataview
TASK
FROM [[]]
WHERE !completed AND (contains(text, "🆕") OR contains(text, "🧭"))
GROUP BY header
```

**Políticas a validar**

```dataview
TASK
FROM [[]]
WHERE !completed AND contains(text, "⚖️")
```

**Notas relacionadas**

```dataview
TABLE tipo AS "Tipo", status AS "Status", file.mtime AS "Atualizado"
FROM #book-processos OR #pes OR #shopping-center
WHERE file.name != this.file.name
SORT file.mtime DESC
LIMIT 25
```

---

## Como usar esta nota no Obsidian

> [!info] Guia rápido
> **Wikilinks** — `[[#Seção]]` navega dentro do arquivo; `[[Nota]]` liga a outras notas do vault (ex.: [[Reavaliação do plano do book]], [[PES 2020]]). Links esmaecidos indicam nota ainda não criada.
>
> **Dataview** — as consultas acima filtram as tarefas pelos marcadores da v2 (`🆕`, `🧭`, `⚖️`). Marcar a caixa no resultado marca no texto.
>
> **Templates** — o bloco `### NN · 🆕 Revisão v2` tem estrutura fixa (Enquadramento → Itens). Salve um em `Templates/` para instanciar por shopping com o *Templater*. A tabela do Anexo F é o template natural de uma futura revisão anual.
>
> **Fonte oficial** — para os 10 ativos, a versão oficial deve morar no SharePoint/Teams; esta nota é a camada de análise e de edição.

---

> [!success] Nível de confiança: **7/10**
> **Alto (9/10):** o conteúdo do v1.1 foi preservado literalmente; cada item do PES 2020 citado corresponde ao número e ao texto do manual (conferido item a item contra o PDF desta conversa); a estrutura de donos, regimes, linha de visão e calendário vem da reavaliação do projeto.
> **Médio (5–6/10) — proposta minha, a validar:** a alocação de cada item PES ao capítulo e ao dono real; a adaptação da dispersão (faixas e consequências); os pesos por pilar; a decisão de separar meios e fins em vez de somar.
> **Não verificado:** se as políticas de 2020 (⚖️) seguem vigentes na Allos; significado das siglas CRD, ISC e FTR; licenças de ferramentas e o escopo atual do `operacoes.allos.co`; preços de ferramentas.
'''

doc = HEADER + "\n" + sumario_txt.rstrip() + "\n\n" + front_txt.rstrip() + "\n\n" + CAB + "\n" + ch_txt + "\n" + anexAB.rstrip() + "\n\n" + ANEXOS + "\n" + ref + "\n" + lac + "\n" + TAIL
open(OUT, "w", encoding="utf-8").write(doc)
print(len(doc), doc.count("🆕"), doc.count("Revisão v2"))
