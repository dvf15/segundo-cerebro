---
tipo: skill
área: leasing
status: ativo
criado: 2026-10-18
tags:
  - skill
  - shopping-center
  - leasing
  - junta-comercial
  - taxa-de-transferencia
  - due-diligence-lojista
aliases:
  - Levantamento de TT
  - Certidão de Inteiro Teor
  - Checagem de TT na Junta Comercial
---

# Skill — Levantamento de TT via Junta Comercial

> [!info] Objetivo
> Identificar, a partir dos atos arquivados na [[Junta Comercial]] local, quais lojistas sofreram alterações societárias que podem caracterizar [[TT]] desde o início do contrato com o shopping — e só então pagar as guias de [[Certidão de Inteiro Teor]] dos casos relevantes.

> [!warning] Premissa a confirmar
> "TT" foi lido aqui como taxa de transferência (alteração societária do lojista equiparada a cessão do contrato). Os nomes dos menus e da guia de pagamento variam conforme a junta comercial de cada estado.

**No Radar de Auditoria:** aba **Societário** — o passo a passo abaixo está no bloco "Passo a passo no portal da Junta", e o checklist por lojista aparece em cada cartão, com progresso (itens de certidão não se aplicam a quem não tem gatilho de TT). O Dashboard conta *checklist completo* e *certidão paga aguardando download*.

## Quando usar
- [ ] Auditoria periódica da base de lojistas
- [ ] Antes de renovação ou aditivo contratual (ver [[Renovação de Contratos]])
- [ ] Suspeita de troca de sócio/controle não comunicada ao shopping

## Gatilhos de TT (o que procurar nos arquivamentos)
> [!tip] Possíveis causas de TT
> - Alteração de capital social
> - Alteração de sócio / administrador
> - Entrada ou saída de sócio / administrador
> - Alteração de objeto social

## Etapa 1 — Triagem gratuita
1. Acessar o Portal de Serviços da [[Junta Comercial]] local.
2. Fazer login com CPF e senha.
3. Clicar em **Serviços Web**.
4. Clicar em **Certidão de Inteiro Teor** (disponível e validada apenas pela internet).
5. Buscar a empresa pelo nome, NIRE ou CNPJ.
6. Selecionar a empresa desejada.

> [!success] Até aqui a consulta é gratuita
> Já é possível ver a lista de alterações arquivadas e identificar as que podem caracterizar [[TT]]. Faça essa triagem para todas as lojas antes de pagar qualquer guia.

## Etapa 2 — Solicitação da certidão (paga)
7. Selecionar o(s) arquivamento(s) desejado(s) e clicar em **Selecionar atos**.
8. Conferir os dados e clicar em **Solicitar serviço**.
9. Selecionar o requerente e clicar em **Confirmar**.
10. Conferir os dados e clicar em **Confirmar**.
11. Anotar o número de protocolo da solicitação.
12. Imprimir a guia de recolhimento (em MG, chamada DAE; o nome varia por estado) e efetuar o pagamento.

## Etapa 3 — Download após compensação
13. Após a compensação do pagamento, acessar o Portal de Serviços.
14. Fazer login com CPF e senha.
15. Clicar em **Serviços Web**.
16. Clicar em **Download Serviços**.
17. Digitar o número de protocolo e os caracteres da imagem (captcha) e clicar em **Download Serviço**.

## Regras de ouro
> [!important] Observações importantes
> - Fazer o levantamento de **todas** as lojas, mas pagar guias **somente** das que possam caracterizar TT.
> - Considerar a **data de início do contrato** do lojista com o shopping: só interessam as alterações a partir dessa data.

## Checklist por lojista
- [ ] CNPJ / NIRE confirmado
- [ ] Data de início do contrato anotada
- [ ] Atos posteriores à data do contrato listados
- [ ] Algum gatilho de TT identificado? (capital / sócio / administrador / objeto)
- [ ] Se sim: certidão solicitada, protocolo anotado, guia paga
- [ ] Certidão baixada e arquivada
- [ ] Caso encaminhado para cobrança / jurídico

## Conexões
- [[TT]]
- [[Junta Comercial]]
- [[Certidão de Inteiro Teor]]
- [[Renovação de Contratos]]
- [[Shopping Inteligente]]

```dataview
LIST
FROM [[]] OR #taxa-de-transferencia OR #junta-comercial
WHERE file.name != this.file.name
SORT file.mtime DESC
```
