---
title: Radar de Renovações — Maximização de Renovação Contratual
aliases:
  - Radar de Renovações
  - Renovação de Contratos
  - Leasing Spread
  - LSR
tags:
  - shopping-inteligente
  - renovacao
  - leasing-spread
  - pericia
  - acao-renovatoria
  - ferramenta
created: 2026-10-14
updated: 2026-11-16
status: ativo
---

# Radar de Renovações — Maximização de Renovação Contratual

Ferramenta de apoio ao **executivo comercial de shopping** para conduzir a
renovação das **lojas-satélite**: quem negociar agora, quem está bloqueado e
por quê, quanto pedir, até onde cada alçada pode ceder, o que uma perícia tende
a sustentar e como fica o LSR do ano.

> Arquivo único, sem build, sem dependências: **`public/renovacoes.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve em **`https://radarbazin1.vercel.app/renovacoes.html`**
> após o merge na branch de produção.

## De onde ela vem

- **Método:** o *Book de Renovações* (skill `renovacao-contratos-shopping`):
  classificação por mix e quadrante, janela de negociação, trava de auditoria,
  os 4 argumentos, matriz mix × quadrante, inflação, Tabela ABC, alçadas
  115 → 110 → 105 → 100%, degrau no 12º e 36º mês, bloqueios.
- **Perícia:** *Aspectos técnicos da perícia judicial em avaliações de lojas em
  shopping centers* (2025): método comparativo, similaridade, contemporaneidade,
  linearidade, laudo prévio e checklist técnico.
- **Auditoria:** integra com o Radar de Auditoria (Radar de Dispersão de Vendas): gera a
  agenda de auditoria integral e recebe o CSV de dispersão por CNPJ.
- **Modelo visual:** o mesmo do [[RADAR-VAREJO|Radar de Varejo]] (coluna de
  720 px, cartões, abas em pílulas, ícones SVG, Backup/Importar/CSV).

## As abas

| Aba | O que faz |
|---|---|
| Radar | KPIs do ano, fila priorizada por farol (Negociar · Preparar · Bloqueado · Aguardar · Renovado) e mapa de quadrantes |
| Análise | As 7 fases da loja, histórico desde a última renovação, argumentos com memória de cálculo, LSR real, laudo prévio, alçadas, risco renovatório, ações e dados faltantes; copia a nota em formato Obsidian |
| Laudo | Proposta × laudo prévio por loja, com **risco de perda em renovatória** (baixo · moderado · alto), valor defensável e receita em risco em 60 meses |
| Perícia | Linearidade do AMM/m² (geral, por faixa de área, por piso), lojas fora da curva com racional comercial, eventos estruturais |
| Cadastro | Importação do Excel (abas Lojas, Parametros, Historico), cadastro loja a loja, Backup/Importar JSON, CSV |
| Auditoria | Agenda para o Radar de Auditoria e recebimento do CSV de dispersão |
| Plano | LSR planejado × realizado, meta, incremento por mês, contratos vencidos |
| Comitê | Pacote em Markdown para a reunião semanal |
| Ajustes | Médias do shopping, inflação, meta, regras do Book e limiares do sistema |
| Como usar | Guia de preenchimento e análise, rotina, erros comuns, glossário e vídeos |

## Arquivos

```
public/renovacoes.html                 a ferramenta (gerada; não editar à mão)
public/renovacoes.webmanifest          instalação como app
public/renovacoes-icon(.svg|-180|-192|-512.png)   logo: contrato com selo de renovação
public/renovacoes-como-usar.mp4        vídeo no computador: preenchimento e análises
public/renovacoes-celular.mp4          vídeo vertical no celular
public/exemplos/renovacoes-*           modelo de importação, base de teste (33 lojas),
                                       CSV de dispersão e guia com os resultados esperados
ferramentas/radar-renovacoes/          código-fonte: motor, testes, gerador, fontes do HTML
```

## Como alterar

O HTML é gerado a partir do código-fonte em `ferramentas/radar-renovacoes/`:

```bash
cd ferramentas/radar-renovacoes
node testar.mjs                          # 110 verificações do motor
node gerar.mjs --publicar ../../public   # regrava public/renovacoes.html
```

`motor.mjs` tem todas as regras (as do Book, as da perícia e as heurísticas do
sistema, marcadas `[SISTEMA]` e `[PERÍCIA]`). `src/app.src.html` é a interface
no modelo do Radar de Varejo. O README da pasta detalha o método, o modelo de
dados e os limites.

## Testar com a base fictícia

1. Abra a ferramenta, vá em **Cadastro** e importe `exemplos/renovacoes-base-teste.xlsx`.
2. Em **Auditoria**, receba `exemplos/renovacoes-dispersao-teste.csv`.
3. Ponha a data de referência em **25/10/2026** e confira cada loja com
   `exemplos/renovacoes-guia-de-teste.md`.

## Acesso

Pública, como as demais ferramentas: `renovacoes.html`, o manifesto, os ícones e
os vídeos `renovacoes-*.mp4` estão liberados em `middleware.ts`. A base de lojas
fica no navegador de quem usa (`localStorage`); nada vai para o servidor.

## Limites

- O Book é de 2011: valide nomenclatura e conteúdo jurídico com a política vigente.
- Os limiares do sistema (risco, perda, perícia) são escolhas iniciais, editáveis
  em Ajustes, e precisam de calibração com o histórico de renovações do grupo.
- Não substitui parecer jurídico. A decisão de valor é do comitê comercial.
