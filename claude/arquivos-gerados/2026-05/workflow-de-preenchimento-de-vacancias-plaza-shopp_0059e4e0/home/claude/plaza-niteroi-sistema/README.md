# Plaza Niterói — Sistema Vacancy-to-Contract

Sistema de acompanhamento do pipeline comercial do Plaza Shopping Niterói, conforme metodologia **Shopping Inteligente OS v5** (Workflow 1 — Vacancy-to-Contract Sprint).

**Cluster:** Entretenimento · **ABL:** 43.000 m² · **Operador:** Allos

---

## Estrutura do projeto

```
plaza-niteroi-sistema/
├── README.md                    ← este arquivo (visão geral)
├── app/                         ← Sistema web standalone (HTML+JS)
│   └── index.html              ← Cockpit interativo individual
├── planilha/                    ← Sistema colaborativo Excel
│   └── Plaza_Niteroi_Sistema.xlsx  ← Pipeline + Dashboard + Logs
├── data/                        ← Dados estruturados (JSON/CSV)
│   ├── pipeline-seed.json      ← Dados iniciais (27 oportunidades)
│   └── mix-atual-plaza.json    ← Mix verificado (NÃO duplicar)
└── docs/                        ← Documentação operacional
    ├── 01-COMO-USAR.md         ← Onboarding do time
    ├── 02-METODOLOGIA.md       ← Framework v5 aplicado ao Plaza
    ├── 03-FONTES.md            ← Fontes verificadas (zero API paga)
    └── 04-ROADMAP.md           ← Próximas evoluções
```

---

## Quick start

### Para o EV (uso diário individual)
1. Abrir `app/index.html` no navegador (Chrome/Edge/Safari)
2. Configurar nome em Configurações (entra automaticamente no histórico)
3. Editar oportunidades no Pipeline; ver Dashboard atualizar em tempo real

### Para diretoria (relatórios formais)
1. Subir `planilha/Plaza_Niteroi_Sistema.xlsx` no SharePoint ou OneDrive
2. Compartilhar com EV + diretoria (co-autoria nativa do Excel)
3. Abrir aba Dashboard para visão consolidada

### Para sincronizar HTML ↔ Planilha
1. No HTML: clicar em "📥 Exportar CSV"
2. Colar o CSV na aba Pipeline da planilha
3. Salvar — o Dashboard recalcula automaticamente

---

## Status atual

- **Versão:** v5 (filtro de duplicidade aplicado vs mix Plaza verificado)
- **Oportunidades pré-carregadas:** 27 (incluindo Foyer Cinemark 5.097m² + Lojas Americanas 2.724m² + caixas médias)
- **Marcas-alvo com canal de contato comercial:** 25
- **Workflow:** Vacancy-to-Contract Sprint
- **Confiança da análise:** 8/10 (ressalvas em `docs/03-FONTES.md`)

---

## Próximos passos

Ver `docs/04-ROADMAP.md`. Em síntese:
1. **Curto prazo:** validar duplicidade vs sistema interno Allos
2. **Médio prazo:** liberar acesso ao Sistema Bahia (preço/m², FPP)
3. **Longo prazo:** migrar para Pipedrive/HubSpot quando time > 10 pessoas

---

## Tecnologia

- **app/index.html:** HTML5 + CSS3 + JavaScript vanilla. Persistência via `window.storage` (artefato Claude) ou `localStorage` em deploy próprio. Sem dependências externas.
- **planilha:** Excel com fórmulas COUNTIF/SUMIF/SUMPRODUCT, validação de dados (dropdowns), formatação condicional (semáforos), pronta para SharePoint/OneDrive.

## Licença

Uso interno Allos. Metodologia: Shopping Inteligente OS v5.
