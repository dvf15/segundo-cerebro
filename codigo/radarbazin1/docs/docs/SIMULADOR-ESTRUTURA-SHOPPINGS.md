---
title: Simulador de Estrutura de Shoppings — Direcionamentos de Orquestração
aliases:
  - Simulador de Estrutura
  - Simulador Organograma Shoppings
tags:
  - shoppings
  - organograma
  - simulador
  - claude-code
  - orquestracao
created: 2026-07-14
updated: 2026-07-14
status: direcionamento
---

# Simulador de Estrutura de Administração de Shoppings — Direcionamentos para orquestração do desenvolvimento

> [!abstract] O que é
> Ferramenta que simula a **estrutura de administração de um shopping center**
> (organograma, headcount e custo) a partir das variáveis e da realidade de
> cada empreendimento, seguindo a metodologia do estudo de estrutura da
> **empresa de shoppings**: matriz de criticidade (12 fatores), volumetria de
> atividades (horas → colaboradores), organogramas de referência por área e
> plano de R&S.

**Fonte de verdade do domínio**: a skill
[`skill/simulador-estrutura-shoppings/SKILL.md`](../skill/simulador-estrutura-shoppings/SKILL.md)
e o arquivo de dados
[`skill/simulador-estrutura-shoppings/referencia-dados.md`](../skill/simulador-estrutura-shoppings/referencia-dados.md).
Nenhuma regra de negócio deve ser inventada fora deles — se faltar regra,
ela é adicionada primeiro à skill, depois implementada.

---

## 1. Visão do produto

**Usuários**: time de G&G (guardião da estrutura), superintendentes,
diretoria de operações e área de planejamento.

**Pergunta que a ferramenta responde**: *"dado o perfil deste shopping, qual
é a estrutura de administração adequada, quanto ela custa e o que muda em
relação à estrutura atual?"*

**Fluxo do usuário** (uma simulação):

1. Cadastra o shopping e preenche as **12 variáveis** da matriz de
   criticidade + variáveis de volumetria (ficha técnica) + flags (Retrofit,
   produtos digitais, GMV do e-shopping).
2. A ferramenta calcula **criticidade**, **volumetria** e monta o
   **organograma proposto** por área (Comercial, Marketing, Operações).
3. O usuário informa (ou importa) a **estrutura atual** do shopping.
4. A ferramenta gera **QLP atual × proposto**, **comparativo de custos** e o
   **plano de R&S** (Contrata / Reduz-reaproveita / Mantém).
5. Exporta relatório (CSV / JSON / impressão) e salva a simulação na base
   local para comparar cenários.

## 2. Arquitetura e padrão do repositório

Seguir o mesmo padrão do Radar Quiosques:

- **Arquivo único, sem build, sem dependências**:
  `public/simulador-estrutura.html` (HTML + CSS + JS vanilla).
- Persistência em **localStorage** (base de shoppings e simulações), com
  **exportar/importar JSON** para backup e **exportar CSV** para planilhas.
- Servido pela Vercel em `https://radarbazin1.vercel.app/simulador-estrutura.html`
  após merge na branch de produção; também abre com duplo clique.
- Organograma renderizado em HTML/CSS (árvore indentada ou caixas), sem
  biblioteca externa.

### Abas da ferramenta

1. **Shopping** — cadastro do empreendimento e das variáveis de entrada
   (matriz de criticidade com as opções 1/3/5 em linguagem de negócio, ficha
   técnica de volumetria, flags).
2. **Criticidade** — pontuação por fator, total e classificação (1 a 4), com
   destaque para o que puxa a nota.
3. **Volumetria** — blocos de horas (core + omni), margem de 5%, conversão
   para headcount (capacidade 185 h/mês), editável para cenários.
4. **Organograma** — estrutura proposta por área com as regras condicionais
   (assistentes fin./com. 1–7, coordenador de obras só em Retrofit, time
   omni conforme produtos digitais e GMV).
5. **QLP & Custos** — atual × proposto por camada (gestão / base / adm /
   produtos digitais), Δ headcount e Δ custo; tabela de salários de
   referência **parametrizável** (nunca hardcoded no meio do código).
6. **Plano de R&S** — mudanças classificadas em Contrata / Reduz-reaproveita
   / Mantém, com o resumo 144 = 52 + 32 + 60 como modelo de leitura.
7. **Premissas & Governança** — texto fixo com as premissas do modelo e as
   regras de governança (exceções, orçamento, rollout).

### Modelo de dados (localStorage)

```json
{
  "config": { "salarios": { "GCOM": 0, "CCOM": 0, "...": 0 }, "capacidadeHorasMes": 185, "margem": 0.05 },
  "shoppings": [
    {
      "id": "uuid",
      "nome": "Shopping Exemplo",
      "criticidade": { "socio": 3, "atc": 1, "fluxoVeiculos": 3, "riscoTecnico": 1,
        "riscoSeguranca": 3, "idade": 5, "timeOrganico": 1, "numLojas": 3,
        "regularizacao": 1, "condominio": 3, "capex": 1, "produtosDigitais": 3 },
      "fichaTecnica": { "lojas": 170, "lojasDisponiveis": 24, "garantiasMes": 1,
        "renovacoesMes": 1, "pontosMall": 11, "comitePerformance": 5, "rps": 7,
        "matinalMidia": 8, "bigShots": 7, "padrinhos": 26 },
      "flags": { "retrofit": false, "eShopping": true, "gmvMedio": 80000,
        "produtosDigitaisQtde": 2 },
      "estruturaAtual": [ { "area": "comercial", "cargo": "GCOM", "qtde": 1 } ],
      "simulacoes": [ { "data": "2026-07-14", "resultado": { } } ]
    }
  ]
}
```

## 3. Motor de cálculo (regras que o código implementa)

Todas detalhadas em `referencia-dados.md`; resumo do contrato:

| Função | Entrada | Saída | Validação obrigatória |
|--------|---------|-------|------------------------|
| `calcularCriticidade(notas)` | 12 notas (1/3/5) | soma + classe 1–4 | soma 20–35→1, 36–42→2, 43–50→3, 51–60→4 |
| `calcularVolumetria(ficha)` | ficha técnica | horas por bloco, HC core + omni | shopping médio → 1.588 h core / 9 HC; 347 h omni / 2 HC; total 11 HC |
| `montarOrganograma(shopping)` | criticidade, flags, volumetria | árvore por área | regras condicionais dos §4.1–4.3 da referência |
| `calcularQlpCustos(atual, proposto, salarios)` | estruturas + salários | Δ HC e Δ R$ por camada | gestão Δ = 0%; portfólio de calibração ≈ +11,1% HC / +5,6% custo |
| `planoRS(atual, proposto)` | estruturas | Contrata / Reduz / Mantém | reduções marcadas como "reaproveitar (G&G)" |

> [!warning] Regra de ouro
> A camada de **gestão não muda** na simulação. Se um cálculo alterar
> gestão, é bug — a evolução acontece apenas na equipe de base.

## 4. Orquestração do desenvolvimento (fases)

Desenvolvimento dirigido por fases curtas, cada uma com entregável testável.
Em cada fase, **ler a skill antes de codar** e validar contra os números de
calibração da referência.

### Fase 0 — Modelagem (sem código)
- **Entregável**: modelo de dados revisado + lista de cargos canônica
  (códigos: GCOM, CCOM, EV, AN.COMERCIAL, AN.PERFORMANCE, AN.RECEBIVEIS,
  SUP.PERFORMANCE, ASSISTENTE, ESTAG, GMKT, AN.CRM, AN.COMUNICAÇÃO, AN.CM,
  AN.TRADE, AN.MKT.III, AC, AUXILIAR.AC, AN.OMNI.ATIVACAO, GEOP, COORD.OP,
  COORD.EXP, COORD.SEG, COORD.OBRAS, AN.PROJETOS, AN.OP).
- **Aceite**: todo cargo citado nos organogramas da referência tem código.

### Fase 1 — Motor de cálculo puro
- **Entregável**: as 5 funções do §3 em JS puro, dentro do HTML, isoladas da
  UI (objeto `Motor`), com um bloco de **autoteste** que roda no console.
- **Aceite**: autoteste reproduz o shopping médio (11 HC comercial), os
  ranges de criticidade e o Δ 0% da gestão.

### Fase 2 — UI de entrada + criticidade
- **Entregável**: abas Shopping e Criticidade funcionando com localStorage.
- **Aceite**: preencher as 12 variáveis em linguagem de negócio (sem exigir
  que o usuário saiba as notas) e ver a classe de criticidade ao vivo.

### Fase 3 — Volumetria + organograma
- **Entregável**: abas Volumetria e Organograma.
- **Aceite**: alterar a ficha técnica muda o headcount; flags (Retrofit,
  e-shopping, GMV) ligam/desligam os cargos condicionais corretamente.

### Fase 4 — QLP, custos e R&S
- **Entregável**: abas QLP & Custos e Plano de R&S + exportar CSV/JSON.
- **Aceite**: comparativo com Δ por camada; reduções sempre rotuladas como
  reaproveitamento a avaliar com G&G; salários editáveis na própria tela.

### Fase 5 — Polimento e publicação
- **Entregável**: aba Premissas & Governança, impressão limpa (CSS print),
  revisão de textos (nenhuma menção a nomes reais de empreendimentos ou da
  companhia — usar sempre "empresa de shoppings").
- **Aceite**: `/verify` do fluxo completo (cadastrar → simular → exportar) e
  link da Vercel funcionando.

### Divisão em agentes (quando usar orquestração multi-agente)

Fases 1–4 podem ser paralelizadas com subagentes, desde que a Fase 0 esteja
fechada (o contrato do `Motor` é a interface entre eles):

| Agente | Escopo | Insumo |
|--------|--------|--------|
| **motor** | funções de cálculo + autoteste | referencia-dados.md §§2–3, 5–7 |
| **ui-entrada** | abas Shopping, Criticidade, Volumetria | contrato do Motor |
| **ui-resultado** | abas Organograma, QLP & Custos, R&S, export | contrato do Motor |
| **revisor** | confere números contra a calibração, textos, anonimização | skill completa |

O revisor roda **por último e sempre**: valida os números de calibração,
confere que gestão fecha em Δ 0% e que não sobrou nenhuma referência ao nome
real da companhia (usar sempre "empresa de shoppings").

## 5. Prompts sugeridos (vibe-coding)

- *"Leia `skill/simulador-estrutura-shoppings/SKILL.md` e
  `referencia-dados.md` e implemente a Fase 1 do
  `docs/SIMULADOR-ESTRUTURA-SHOPPINGS.md`: o objeto `Motor` com autoteste."*
- *"Na aba Criticidade, mostre quais fatores mais puxaram a nota e o que
  falta para mudar de classe."*
- *"Simule o shopping médio da ficha técnica e confira se o resultado bate
  com a tabela de validação (11 colaboradores no comercial)."*
- *"Adicione um comparador de cenários: mesma simulação com e sem produtos
  digitais, lado a lado."*

## 6. Evoluções futuras (backlog — vem do §9 da referência)

1. Volumetria por **tempos & movimentos** (substituir a base empírica).
2. Pesagem da estrutura de **liderança** (ex.: gerente de negócios único).
3. Módulo de **plano de carreira e remuneração**.
4. Simulação por **jornadas** (cliente e lojista) com operações como suporte.
5. **Rateios entre entidades** (estruturas compartilhadas entre shoppings).
6. Novas variáveis para Operações (obras vs. analistas de projetos, POs).

> [!note] Anonimização
> Todo material derivado deste estudo usa **"empresa de shoppings"** no lugar
> do nome da companhia de origem, e evita citar nomes reais de
> empreendimentos — os exemplos usam perfis genéricos ("shopping médio",
> "maior empreendimento do portfólio", "shoppings com e-shopping").
