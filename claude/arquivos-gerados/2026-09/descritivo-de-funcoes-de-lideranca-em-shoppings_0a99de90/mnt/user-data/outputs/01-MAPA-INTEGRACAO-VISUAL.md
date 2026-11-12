# 🗺️ Mapa de Integração Visual - Descritivos Allos

## 📊 Estrutura Hierárquica Integrada

```
                        ┌─────────────────────────────┐
                        │  DIRETOR/SUPERINTENDENTE    │
                        │      (Não documentado)      │
                        └──────────────┬──────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
          ┌─────────▼──────────┐ ┌────▼────────────┐ ┌──▼──────────────┐
          │ GERENTE NEGÓCIOS   │ │ GERENTE MARKETING│ │GERENTE OPERAÇÕES│
          │  gerente-negocios  │ │ gerente-marketing│ │gerente-operacoes│
          │                    │ │                  │ │                 │
          │ ✅ 11 seções       │ │ ✅ 11 seções     │ │ ✅ 11 seções    │
          │ ✅ KPIs (7 itens)  │ │ ✅ KPIs (9 itens)│ │ ✅ KPIs (9 itens)│
          │ ✅ 5-8 anos exp.   │ │ ✅ 5-8 anos exp. │ │ ✅ 5-8 anos exp.│
          └────────┬───────────┘ └────┬─────────────┘ └──┬──────────────┘
                   │                  │                  │
        ┌──────────▼───────────┐     │          ┌───────┴────┬────────────┬─────────┐
        │                      │     │          │            │            │         │
    ┌───▼──────────────┐  (Rel)      │          │            │            │         │
    │ COORD. NEGÓCIOS  │  Comércio   │          │            │            │         │
    │coordenador-neg...│             │          │            │            │         │
    │                  │        ┌────▼─────────┐│ ┌──────────▼──┐ ┌──────▼──┐┌───▼────┐
    │ ✅ 10 seções    │        │              ││ │             │ │         ││        │
    │ ✅ KPIs (7)     │        │              ││ │             │ │         ││        │
    │ ✅ 2-3 anos exp.│   ┌────▼──────────────┘│ │ COORD.      │ │ COORD.  ││COORD. │
    │                  │   │                   │ │ OPERAÇÕES   │ │ MALL    ││AMBIÊNCIA
    └──────────────────┘   │ COORD. MARKETING  │ │coord-oper...│ │coord-...││coord-...
                           │ coordenador-mar...│ │             │ │         ││        │
                           │                   │ │ ✅ 10 seções│ │✅ 11    ││✅ 11   │
                           │ ✅ 10 seções     │ │ ✅ KPIs (9) │ │✅ KPIs  ││✅ KPIs │
                           │ ✅ KPIs (9)      │ │ ✅ 2-3 anos │ │✅ 3-5   ││✅ 2-3  │
                           │ ✅ 2-3 anos exp. │ │             │ │ anos    ││ anos   │
                           │                   │ │             │ │         ││        │
                           └───────────────────┘ └─────────────┘ └─────────┘└────────┘
                                (Marketing)        (Operações) x3
```

---

## 🔗 Mapa de Wikilinks & Integrações

### Estrutura de Links (como funcionam no Obsidian)

```
INDICE-FUNCOES-LIDERANCA.md
│
├─→ [[gerente-negocios]]
│   ├─→ [[diretor-superintendente]] (reporta)
│   ├─→ [[coordenador-negocios]] (supervisiona)
│   ├─→ [[gerente-marketing]] (interface)
│   ├─→ [[gerente-operacoes]] (interface)
│   └─→ [[shopping-center]] (contexto)
│
├─→ [[gerente-marketing]]
│   ├─→ [[diretor-superintendente]] (reporta)
│   ├─→ [[coordenador-marketing]] (supervisiona)
│   ├─→ [[gerente-negocios]] (interface)
│   ├─→ [[gerente-operacoes]] (interface)
│   └─→ [[shopping-center]] (contexto)
│
└─→ [[gerente-operacoes]]
    ├─→ [[diretor-superintendente]] (reporta)
    ├─→ [[coordenador-operacoes]] (supervisiona)
    ├─→ [[coordenador-mall]] (supervisiona)
    ├─→ [[coordenador-ambiencia]] (supervisiona)
    ├─→ [[gerente-negocios]] (interface)
    ├─→ [[gerente-marketing]] (interface)
    └─→ [[shopping-center]] (contexto)
```

---

## 📁 Arquivos do ZIP & Organização Recomendada

```
funcoes-lideranca-allos.zip
│
├── 00-INSTRUCOES-INTEGRACAO.md
│   └─ Guia de uso (leia primeiro!)
│
├── INDICE-FUNCOES-LIDERANCA.md
│   └─ Mapa mestre (todas as funções listadas)
│
├─ 📂 GERENTES (3 arquivos - NÍVEL ESTRATÉGICO)
│  │
│  ├── gerente-negocios.md
│  │   └─ Receita | NOI | Ocupação | Negociações
│  │
│  ├── gerente-marketing.md
│  │   └─ Tráfego | Campanhas | Eventos | Reputação
│  │
│  └── gerente-operacoes.md
│      └─ Infraestrutura | Segurança | Equipes | NOI
│
└─ 📂 COORDENADORES (5 arquivos - NÍVEL TÁTICO-OPERACIONAL)
   │
   ├── coordenador-negocios.md
   │   └─ Negociações táticas | Contratos | KPIs
   │
   ├── coordenador-marketing.md
   │   └─ Campanhas operacionais | Eventos | ROI
   │
   ├── coordenador-operacoes.md
   │   └─ Manutenção | Condomínio | Utilidades
   │
   ├── coordenador-mall.md
   │   └─ Segurança patrimonial | Brigada incêndio | AVCB
   │
   └── coordenador-ambiencia.md
       └─ Obras | Reformas | Padrões visuais
```

---

## 🎯 Fluxo de Uso Recomendado

### 1️⃣ Primeira Vez
```
1. Extraia o ZIP
2. Copie os 9 .md para Obsidian
3. Abra: 00-INSTRUCOES-INTEGRACAO.md (5 min)
4. Abra: INDICE-FUNCOES-LIDERANCA.md (10 min)
5. Clique em [[gerente-negocios]] para testar (1 min)
```

### 2️⃣ Para Recrutar
```
1. Abra: INDICE-FUNCOES-LIDERANCA.md
2. Procure função desejada (ex: [[coordenador-marketing]])
3. Abra o arquivo
4. Cópie seção "Requisitos"
5. Customize para sua vaga
6. Use "Métrica de Sucesso" como benchmarks
```

### 3️⃣ Para Onboarding
```
1. Abra: arquivo da função
2. Vá para: "Checklist de Onboarding (Primeiros 90 dias)"
3. Use como plano de ação
4. Acompanhe com: "Métricas de Sucesso (3-6-12 meses)"
5. Refira: "Documentos Críticos" (domínios obrigatórios)
```

### 4️⃣ Para Desenvolvimento
```
1. Abra: "Trilha de Carreira"
2. Identif: próxima posição (ex: Coord → Gerente)
3. Use: "Treinamentos Recomendados"
4. Mensure: "KPIs de Monitoramento"
5. Promova: quando métricas 12m atingidas
```

### 5️⃣ Para Planejamento
```
1. Abra: INDICE-FUNCOES-LIDERANCA.md
2. Revise: "Estrutura Organizacional Simplificada"
3. Análise: "Interfaces & Relacionamentos" por área
4. Documente: "Processos Críticos"
5. Valide: com RH e Operações
```

---

## 📐 Cada Arquivo Contém

### Gerentes (3 arquivos × 11 seções cada = 33 seções)

| Seção | Tempo | Exemplo |
|-------|-------|---------|
| 1. Identificação | 1m | Cargo, Reporta a, Supervisiona |
| 2. Missão & Propósito | 2m | "Liderar performance financeira..." |
| 3. Responsabilidades | 5m | 5 categorias com checkboxes |
| 4. KPIs Críticos | 3m | 7-9 indicadores em tabela |
| 5. Competências & Requisitos | 8m | Formação, Experiência, Técnicas, Comportamentais |
| 6. Dia Típico | 3m | Cronograma 08:00-17:00 |
| 7. Interfaces | 3m | Internas + Externas |
| 8. Documentos Críticos | 2m | Domínios obrigatórios |
| 9. Desenvolvimento | 4m | Próximas posições + Treinamentos |
| 10. Desafios & Estratégias | 4m | Tabela com soluções |
| 11. Métricas de Sucesso | 5m | 3 meses / 6 meses / 12 meses |

### Coordenadores (5 arquivos × 10 seções cada = 50 seções)

Mesma estrutura que Gerentes, mas com:
- Experiência mínima menor (2-3 vs 5-8 anos)
- Responsabilidades mais operacionais
- KPIs mais específicos da execução

---

## 🔀 Como os Arquivos Se Comunicam

### Exemplo: Desenvolvimento de Carreira

```
PASSO 1: Coordenador de Negócios
└─ Abra: coordenador-negocios.md
└─ Vá para: "Próximas Posições"
└─ Lê: "Gerente de Negócios"
   │
   └─ Clique: [[gerente-negocios]]
      │
      PASSO 2: Gerente de Negócios
      └─ Abra: gerente-negocios.md
      └─ Analise: KPIs (mais complexos)
      └─ Revise: Responsabilidades (mais estratégicas)
      └─ Estude: Treinamentos Recomendados
         │
         └─ 12 meses depois...
            └─ PROMOVIDO! 🎉
```

---

## 🔍 Mapa de Busca Rápida

### Por Palavra-Chave (Use Ctrl+F)

| Busca | Funções | Arquivo |
|-------|---------|---------|
| "renovação" | Coord. Negócios | coordenador-negocios.md |
| "evento" | GM Marketing, Coord. Marketing | ambos |
| "segurança" | Coord. Mall | coordenador-mall.md |
| "orçamento" | Todos (em seções diferentes) | todos |
| "equipe" | Todos | todos |
| "conformidade" | Coord. Mall | coordenador-mall.md |
| "AVCB" | Coord. Mall | coordenador-mall.md |
| "campanha" | GM Marketing, Coord. Marketing | ambos |
| "manutenção" | Coord. Operações | coordenador-operacoes.md |

---

## 🎨 Customização Por Org

### Adicione em Cada Arquivo

#### Seção: Identificação (APÓS "Cargo")
```markdown
| **Salário Indicado** | R$ X.XXX - R$ X.XXX |
| **Benefícios** | Vale refeição, Convênio, Seguros |
| **Localização** | Shopping X (endereço) |
```

#### Seção: Documentos Críticos (ADICIONE LINKS)
```markdown
- [ ] [[seu-template-contrato-aluguel|Template Aluguel - Wiki Allos]]
- [ ] [[suas-politicas-comerciais|Políticas Comerciais - Confluence]]
```

#### Seção: Processos Críticos (CUSTOMIZE FLUXO)
```markdown
Fluxo Allos de Renovação:
1. [[aprovacao-gerente|Aprovação Gerente]] (prazo: 5 dias)
2. [[validacao-financeira|Validação Financeira]] (prazo: 3 dias)
3. [[formalizacao-juridica|Formalização Jurídica]] (prazo: 7 dias)
```

---

## 📊 Análise de Cobertura

### Por Função

| Função | Seções | KPIs | Req. | Processos | Onboarding |
|--------|--------|------|------|-----------|------------|
| GM Negócios | 11 | 7 | ✅ | 2 | ✅ |
| GM Marketing | 11 | 9 | ✅ | 2 | ✅ |
| GM Operações | 11 | 9 | ✅ | 3 | ✅ |
| Coord. Negócios | 10 | 7 | ✅ | 2 | ✅ |
| Coord. Marketing | 10 | 9 | ✅ | 2 | ✅ |
| Coord. Operações | 10 | 9 | ✅ | 3 | ✅ |
| Coord. Mall | 11 | 9 | ✅ | 3 | ✅ |
| Coord. Ambiência | 10 | 9 | ✅ | 3 | ✅ |

**Total:** 8 funções | 84 seções | 68 KPIs | 20+ processos documentados

---

## ✅ Checklist de Primeiro Uso

- [ ] Extrair ZIP
- [ ] Copiar 9 .md para Obsidian
- [ ] Testar wikilinks (clicar em links azuis)
- [ ] Ler: 00-INSTRUCOES-INTEGRACAO.md
- [ ] Abrir: gerente-negocios.md
- [ ] Clicar: [[coordenador-negocios]] (deve abrir)
- [ ] Buscar: Ctrl+F "renovação" (deve achar no Coord. Negócios)
- [ ] Revisar: Métricas de Sucesso em 2-3 funções
- [ ] Compartilhar com RH para validação

---

**Criado em:** 2026-09-20  
**Integração:** Total com Obsidian + Markdown  
**Confiança:** 9/10 ⭐

🚀 Pronto para usar! Qualquer dúvida → releia o arquivo 00-INSTRUCOES-INTEGRACAO.md
