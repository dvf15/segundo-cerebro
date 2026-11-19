# Radar de Eventos

App para prospectar e viabilizar eventos em shopping centers: praças de eventos,
áreas internas, áreas externas e estacionamento.

## Como usar

Abra `radar-eventos/index.html` no navegador (funciona direto do arquivo, sem
servidor e sem build). Os dados ficam no próprio navegador (localStorage; plantas
em IndexedDB). Use **Backup** para exportar/importar um `.json`.

Ordem sugerida: **Shopping & caderno técnico** → **Áreas** → **Prospecção no raio**
/ **Operadores** → **Eventos**.

## O que faz

| Módulo | Conteúdo |
|---|---|
| Áreas | Tipo, metragem, pé-direito, lotação, sobrecarga do piso, energia (disponibilidade, carga em kVA, tensão), água, esgoto, planta (link ou arquivo), agenda |
| Caderno técnico | Folga sob o pé-direito, horário de montagem e lista editável de regras de segurança, avaliadas em cada evento |
| Eventos — viabilidade | Confronta requisitos do evento com a área (metragem, altura, carga elétrica, água, esgoto, lotação, piso, conflito de agenda), com as regras e com os documentos. Parecer: Apto / Pendente / Inviável |
| Eventos — fluxo | 11 etapas, da prospecção ao encerramento, com tarefas. Montagem só é liberada com parecer "Apto" e contrato "Assinado" |
| Eventos — contrato | Tipo, status da minuta e controle de signatários |
| Eventos — documentos | Checklist de abertura por evento, copiado de um modelo editável |
| Eventos — simulador | Bilheteria potencial em 3 cenários, locação (fixa ou por m²/dia, somada ou "maior entre" com % da bilheteria), sublocação e mídia |
| Eventos — mídia | Prompt de pesquisa de anunciantes baseado no entorno, no momento e no tema; registro dos anunciantes prospectados |
| Prospecção no raio | Buscas prontas (Google/Maps) e prompt de pesquisa de operadores por tema; a resposta em JSON é importada para o pipeline |
| Operadores | Pipeline em kanban |

## Princípios

- **Nada é estimado.** Dado ausente aparece como `[FALTA: dado]` e o total não fecha.
  O app não traz médias de mercado, ocupação ou ticket de referência.
- **Regras e documentos são modelos genéricos.** Substitua pelo caderno técnico
  oficial do shopping e pelas exigências do Corpo de Bombeiros e da prefeitura
  locais; valide o checklist com o jurídico.
- **A busca de operadores e anunciantes não é automática.** O app é estático e não
  chama APIs de busca: ele gera os links e os prompts, e importa o resultado.

## Arquivos

```
index.html, styles.css   casca e estilo
dados.js                 modelos: etapas do fluxo, checklist, regras, temas
calc.js                  simulador e análise de viabilidade (sem DOM)
app.js                   telas, persistência e ações
tests/calc.test.js       testes do motor de cálculo
```

Testes: `cd radar-eventos && npm test`
