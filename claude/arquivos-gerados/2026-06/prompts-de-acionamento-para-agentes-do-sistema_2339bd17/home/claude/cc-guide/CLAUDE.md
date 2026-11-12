# CLAUDE.md — Shopping Inteligente OS (Fase 1)

> Este arquivo orienta o Claude Code. Ele é lido automaticamente no início de cada sessão.
> Mantenha-o atualizado conforme o projeto evolui.

## O que é este projeto

Sistema de agentes de IA para acelerar a comercialização de shopping centers (operador: Allos).
Esta é a **FASE 1**: um protótipo funcional, em código, que roda **somente com dados fictícios**,
na máquina do desenvolvedor. O objetivo é (a) aprender a construir o sistema e (b) ter uma demo
para apresentar à liderança e à TI da Allos antes de qualquer passo com dados reais.

A arquitetura é a mesma que vira produção depois. Só a fonte de dados muda: na Fase 1 são arquivos
fictícios; na Fase 2 (após aprovação da TI) serão os sistemas reais.

## ⛔ REGRAS INVIOLÁVEIS (segurança e compliance)

1. **NUNCA conectar a dados reais nesta fase.** Nada de Sistema Bahia, base real de investidores,
   contratos, vendas. Apenas os arquivos em `dados_ficticios/`.
2. **NUNCA inserir credenciais reais** (senhas, tokens, chaves de API de produção) no código ou em
   arquivos. Se precisar de uma chave para testar a IA, use variável de ambiente e documente como `EXEMPLO`.
3. **A base de Investidores contém dado pessoal (LGPD).** Mesmo fictícia, trate-a com o mesmo cuidado
   da real: nunca logar conteúdo dela, nunca expor em telas públicas.
4. **Não acionar nenhuma API paga** sem que o desenvolvedor confirme explicitamente. Antes de usar,
   pergunte: "Isso pode gerar custo. Confirma?"
5. **Pontos marcados `[FASE 2 — TI]`** no código e nas tarefas NÃO devem ser implementados agora.
   São decisões da TI da Allos. Deixe um comentário claro e pare.

## Como o Claude Code deve trabalhar aqui

(baseado nas práticas de orquestração que o desenvolvedor segue)

- **Plan mode primeiro.** Antes de qualquer tarefa com 3+ passos, escreva o plano em
  `tasks/todo.md` com itens marcáveis. Mostre o plano e espere revisão antes de implementar.
- **Uma tarefa por vez.** Implemente, verifique que funciona, marque como concluída, então siga.
- **Verifique antes de dar como pronto.** Rode o código, mostre a saída. Nunca marque "concluído"
  sem provar que funciona.
- **Simplicidade primeiro.** Menor mudança possível. Sem over-engineering. Este é um protótipo.
- **Registre aprendizados.** Quando o desenvolvedor corrigir algo, anote o padrão em `tasks/licoes.md`
  para não repetir o erro.
- **Idioma:** todo código, comentários e telas em **português (Brasil)**.

## Stack desta fase (mínima, sem nuvem)

- **Linguagem:** Python 3.11+ (mais fácil para o desenvolvedor evoluir depois)
- **Dados:** arquivos JSON locais em `dados_ficticios/` (um por base). Sem banco real nesta fase.
- **Interface:** começar por linha de comando (CLI) simples. Web fica para depois, se houver tempo.
- **IA:** a chamada ao Claude fica encapsulada em UM único arquivo (`motor_ia.py`) com um modo
  "simulado" (resposta pré-montada) como padrão. Chamada real à API só se o desenvolvedor ativar
  e fornecer chave própria — e isso é opcional na Fase 1.

## As 7 bases de dados (esquema)

Cada uma vira um arquivo `dados_ficticios/<nome>.json` com 3–5 registros de exemplo:

1. `pontos_vagos` — loja_id, piso, m2, vitrine_ml, energia_kva, status, preco_m2, cluster_fit_min
2. `investidores` — id, nome, capital, experiencia, suitability_score, segmento, contato  ⚠️ LGPD
3. `marcas_ka` — marca, categoria, requisitos_tecnicos, investimento, pracas_interesse
4. `plano_mix` — categoria_alvo, prioridade, marcas_alvo, lacunas, batalha
5. `fornecedores` — id, categoria, especialidade, avaliacao, homologado
6. `hunter_targets` — marca, local, distancia_km, sinais_tracao, fonte, cluster_fit
7. `produtos_financeiros` — tipo, taxa, elegibilidade, parceiro, link

## Os scores (lógica que NÃO muda entre fases)

Implementar em `scores.py`, cada um como função pura que recebe um dicionário de notas (0–10) e
retorna 0–100. Pesos:

- **SRIS Score:** cluster 20, lacuna_mix 20, marca 15, tracao 15, venda 10, diferenciacao 10, operacional 5, risco 5
- **Cluster Fit:** faixas 0–40 baixo / 41–70 aceitável / 71–85 forte / 86–100 estratégico
- **Conversion Score:** dor 15, financeiro 15, prontidao 15, fit_espaco 15, aluguel 15, interesse 10, obra 10, risco 5
- **Financial Impact:** vacancia 20, aluguel 15, vendas_m2 15, fluxo 15, ticket 10, midia 10, posicionamento 10, risco 5

## Os 12 agentes

Cada agente é uma função em `agentes/` que: lê as bases relevantes → monta um prompt → (na Fase 1)
retorna uma saída simulada OU chama o motor_ia → devolve resultado estruturado. Lista:
Orquestrador, Cluster Positioning, Deal Conversion, Hunter, Farmer, KA, Plataforma de Espaços,
Alavancador, Builder, Seller, Entertainer, Governance.

## Estrutura de pastas alvo

```
shopping-os/
├── CLAUDE.md                  (este arquivo)
├── tasks/
│   ├── todo.md                (plano de trabalho)
│   └── licoes.md              (aprendizados)
├── dados_ficticios/           (7 arquivos JSON de exemplo)
├── scores.py                  (os 4 scores)
├── motor_ia.py                (única porta para a IA; modo simulado por padrão)
├── agentes/                   (um arquivo por agente)
├── orquestrador.py            (aciona agentes)
└── main.py                    (CLI: ponto de entrada)
```

## Definição de "pronto" para a Fase 1

- [ ] As 7 bases existem como JSON fictício e carregam sem erro
- [ ] Os 4 scores calculam corretamente (com testes simples)
- [ ] Pelo menos 3 agentes funcionam em modo simulado (Cluster, Hunter, Deal Conversion)
- [ ] O orquestrador roda um workflow de ponta a ponta com dados fictícios
- [ ] Nada toca dado real; todos os pontos `[FASE 2 — TI]` estão apenas comentados

## ⛔ Onde a Fase 1 PARA

Não implemente: conexão a banco real, integração Sistema Bahia, carga de dados reais, deploy em
nuvem, autenticação corporativa. Tudo isso é `[FASE 2 — TI]` e depende de definições da Allos.
