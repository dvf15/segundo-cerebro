---
tags: [projeto/clausulas, conceito, proposta]
aliases: [Copiloto, A Solução]
---

# Solução — Copiloto de Decisão

> [!tip] Em resumo
> O copiloto **acelera e padroniza** a análise. A **decisão continua humana** — modo apoio ao superintendente.

## O que é
Não é digitalizar a planilha. É transformar a lógica dela num **apoio à decisão** que lê uma cláusula real e devolve uma recomendação justificada, com custo, risco e roteamento.

## O fluxo (5 verbos)
1. **Lê** — identifica o **tema + tipo** da cláusula no texto livre (papel do LLM).
2. **Compara** — mostra onde a redação proposta difere da cláusula-padrão (diff semântico).
3. **Aplica regras** — usa a matriz por segmento + as ressalvas atuais (**determinístico e auditável**).
4. **Pondera** — pesa [[Custo da Concessão|custo]], risco e [[Marca Estratégica|valor estratégico]].
5. **Encaminha** — recomenda e leva ao nível de [[Alçadas e Roteamento|alçada]] certo.

## Princípio de design
> [!important] LLM lê; regras decidem
> O LLM faz **só** o que a planilha não faz: ler e classificar texto livre. As **regras de negócio permanecem determinísticas** (matriz + ressalvas). Em contexto jurídico/financeiro, isso é essencial.

## Por que "humano decide" (modo apoio)
- Elimina o risco jurídico de uma decisão automática errada.
- Reduz a resistência cultural das áreas.
- O modelo pode errar ocasionalmente sem gerar prejuízo.
- **Cada decisão registrada vira dado rotulado** que calibra o modelo (ver [[Custo da Concessão]]).

Métricas de sucesso: **tempo de análise por cláusula** e **consistência entre analistas** — não "% de acerto do modelo".

---
Próximo: [[Balança de Decisão]]. Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
