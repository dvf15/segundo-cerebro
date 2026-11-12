# Como usar no Claude chat (ambiente corporativo)

Guia para operar o Copiloto **dentro do Claude** (claude.ai) na sua empresa — sem instalar nada.

## Parte 1 — Montar o Projeto (uma vez)
1. No Claude corporativo, crie um **Projeto** (ex.: "Copiloto de Cláusulas — ALLOS").
2. Abra **Instruções do Projeto** (Custom Instructions) e cole todo o conteúdo de
   `instrucoes/SYSTEM_PROMPT.md`.
3. No **conhecimento do Projeto**, anexe os arquivos da pasta `config/`:
   `clausulas.json`, `parametros.json`, `recomendacoes.json`, `segmentos.json`, `marcas.csv`.
   (Opcional: `_fonte/MODELO_FONTE.md` para contexto completo.)
4. Pronto. Todas as conversas dentro desse Projeto já operam como o Copiloto.

> Para **atualizar a parametrização** depois, basta substituir os arquivos anexados (ex.: novo `marcas.csv`
> ou `parametros.json`) — o Copiloto passa a usar os novos valores.

## Parte 2 — Avaliar uma cláusula (uso diário)
Cole no chat algo como:

> **Cláusula:** "Por mera liberalidade, a LOCADORA reduz de forma gradual e decrescente a multa rescisória…"
> **Segmento:** Vestuário Feminino · **Marca:** Boutique Beta

O Copiloto responde com: tipo detectado, diff vs padrão, status (🟢/🟡/🔴), custo (local e efetivo × FR),
comportas, **alçada** e veredito — e, se for Diretoria de Operações, o **business case**.

### Exemplo de resposta esperada
```
Cláusula: Multa → Redução de Multa Rescisória Gradual
Diff vs padrão: mantém a multa mas a torna decrescente no tempo.
Status (guia): 🔴 Não Recomendado
Custo: 3% (estimado) × FR 1,0 = 3% do aluguel anual
Comportas: status=Diretoria de Operações · custo=Diretor de Portfólio · pegada=Superintendente
➡️ ALÇADA: Diretoria de Operações
Veredito: Exceção — requer business case
📋 Business case: (marca, grau, pegada, custo, risco, decisão)
```

## Parte 3 — Importar um lote de cláusulas
Cole uma tabela (ou anexe um CSV com colunas `texto,segmento,marca`) e peça:
> "Avalie cada cláusula abaixo e me devolva uma tabela com tipo, status, alçada e veredito."

O Copiloto processa item a item e devolve o quadro comparado com os filtros. (Para volumes grandes ou
cálculo exato reproduzível, use o script `motor/importar_clausulas.py` ou o console.)

## Parte 4 — Console web (opcional, cálculo exato)
Abra `console/index.html` no navegador — ou publique como **Artifact** no Claude — para:
- Cadastrar/editar **marcas** e ajustar **tetos/fatores** (aba Parametrização; salva no navegador).
- **Avaliar** com números exatos (custo, FR, comportas, alçada, business case).
- **Exportar/Importar** a configuração (JSON) para levar entre máquinas.

## Boas práticas
- **O Copiloto é apoio** — a decisão e a aprovação são sempre da pessoa/alçada indicada.
- **Compliance (Anticorrupção, PEP, LGPD, Confidencialidade)** é inegociável: o Copiloto sinaliza e não
  flexibiliza.
- Informe **aluguel anual e os valores da cláusula** quando quiser custo exato (senão, ele estima por risco).
- Mantenha `marcas.csv` e `parametros.json` atualizados — é o que garante decisões consistentes.
