---
title: "Skill Obsidian junta comercial"
date: 2026-10-17
updated: 2026-10-18
source: "claude-chat"
source_id: "e2fe6d4d-2a71-4b8d-9a12-03e4b51b3654"
url: "https://claude.ai/chat/e2fe6d4d-2a71-4b8d-9a12-03e4b51b3654"
project: null
messages: 6
generated_files: 1
tags: ["claude", "conversa"]
---
# Skill Obsidian junta comercial

> **Resumo:** **Conversation overview:** The person works in leasing (área de leasing) and needed to convert a procedural PowerPoint presentation about checking for "TT" (interpreted as taxa de transferência / transfer fee) during Brazilian commercial registry (Junta Comercial) lookups into an indexed Markdown skill file for use in Obsidian. The person asked Claude to remove any shopping mall name from the content and replace references to "JUCEMG" (the Minas Gerais state commercial registry) with generic "junta comercial local" phrasing, so the skill could apply across different Brazilian states. Claude initially attempted to fetch the presentation directly from a OneDrive link but was blocked by OneDrive's restrictions on automated access. The person then pasted the full procedural text manually, covering a 17-step process split into three phases: free triage research via the registry's online portal, paid certificate request (Certidão de Inteiro Teor), and downloading the completed certificate after payment clears. The text also listed specific triggers for "TT" (changes to corporate capital, changes in partners/administrators, entry/exit of partners or administrators, changes to corporate purpose) and noted two key operational rules: research all stores but only pay for certificates on cases showing TT triggers, and only alterations occurring after the tenant's contract start date are relevant. Claude built the Markdown file with YAML frontmatter, Obsidian wikilinks (e.g., [[TT]], [[Junta Comercial]], [[Certidão de Inteiro Teor]]), callout blocks for warnings and tips, a per-tenant checklist, and a Dataview query block for linking related notes. Claude flagged as an assumption that "TT" means taxa de transferência and noted that menu names and portal flows (e.g., "DAE" payment slip terminology) are specific to Minas Gerais and may differ in other states' registries, leaving this generalization marked for the person's confirmation. Minor typos in the original text (e.g., "loguin," "ALTEREÇÃO") were corrected during the transcription.

**Mensagens:** 6 · **Criada:** 2026-10-17 · **Atualizada:** 2026-10-18

---

## 👤 Usuário · 2026-10-17 12:19

https://1drv.ms/p/c/3c0358c807f339f6/IQD2OfMHyFgDIIA8fIUAAAAAAZcizcrr6kOF7jIbnvpEiNQ
Com base ness documento, crie uma skill em .md indexada para obsidian,, excluindo o nome do shopping e troque jucemg por junta comercial local

## 🤖 Claude · 2026-10-17 12:19

Vou abrir a apresentação do OneDrive para extrair o conteúdo e montar a skill.
```
This block is not supported on your current device yet.
```

Não consegui abrir o link: o OneDrive bloqueia acesso automatizado, então não tenho como ler a apresentação por ele.

O jeito mais rápido é você anexar o arquivo aqui na conversa (o .pptx ou um PDF exportado dele). Assim que chegar, eu crio a skill em .md para o Obsidian, tiro o nome do shopping e troco "JUCEMG" por "junta comercial local".

Confiança: 9/10. O bloqueio veio na própria resposta do OneDrive, então tenho certeza de que não consegui ler o arquivo.

## 👤 Usuário · 2026-10-18 10:36

1º Passo: Acessar o Portal de Serviços (http://portalservicos.jucemg.mg.gov.br/Portal/ )

2º Passo: Efetuar o loguin no Portal digitando seu CPF e senha. 

3º Passo: Clicar em Serviços Web.

4º Passo: Clicar em Certidão Inteiro Teor disponível e validada apenas pela internet. 

5º Passo: Realizar a busca da empresa digitando o nome ou o NIRE ou o CNPJ da empresa.

6º Passo: Selecionar a empresa desejada.
Obs: Até este momento a consulta é gratuita e já é possível levantar quais são as alterações realizadas e que podem caracterizar TT

7º Passo: Selecionar o(os) arquivamento(s) desejado(s) e clicar em selecionar atos.

## 🤖 Claude · 2026-10-18 10:36

_(sem texto)_

## 👤 Usuário · 2026-10-18 10:37

1º Passo: Acessar o Portal de Serviços (http://portalservicos.jucemg.mg.gov.br/Portal/ )

2º Passo: Efetuar o loguin no Portal digitando seu CPF e senha. 

3º Passo: Clicar em Serviços Web.

4º Passo: Clicar em Certidão Inteiro Teor disponível e validada apenas pela internet. 

5º Passo: Realizar a busca da empresa digitando o nome ou o NIRE ou o CNPJ da empresa.

6º Passo: Selecionar a empresa desejada.
Obs: Até este momento a consulta é gratuita e já é possível levantar quais são as alterações realizadas e que podem caracterizar TT

7º Passo: Selecionar o(os) arquivamento(s) desejado(s) e clicar em selecionar atos.8º Passo: Conferir os dados e clicar em Solicitar Serviço.​
​
9º Passo: Selecionar o requerente e clicar em confirmar.​
​
10º Passo: Conferir os dados e clicar em confirmar.​
​
11º Passo: Anotar o número de protocolo da solicitação.​
​
12º Passo: Imprimir o DAE e efetuar o pagamento.​
​
13º Passo: Após a compensação do pagamento, acessar o Portal de Serviços​
​
14º Passo: Efetuar o loguin no Portal digitando seu CPF e senha. ​
​
15º Passo: Clicar em Serviços Web.​
​
16º Passo: Clicar em Download Serviços. ​
​
17º Passo: Digitar o número de protocolo e os caracteres que aparecerem na imagem e clicar em Download Serviço.​

​Possiveis causas de TT ALTEREÇÃO DE CAPITAL SOCIAL ​

ALTERAÇÃO DE SÓCIO/ADMINISTRADOR​

 ENTRADA/SAÍDA DE SÓCIO/ADMINISTRADOR ​

ALTERAÇÃO DE OBJETO SOCIAL ​ Observações importantes​

​

Realizar o levantamento de todas as lojas e pagar as guias somente das que possam caracterizar TT.​

​

Atentar para a data de inicio do contrato do lojista com o shopping e as suas alterações a partir desta data.​

​

​

​  

## 🤖 Claude · 2026-10-18 10:38


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

A skill está pronta em **skill-levantamento-tt-junta-comercial.md**. Ela vem com frontmatter YAML, wikilinks, callouts, um checklist por lojista e um bloco Dataview no fim.

O que mudei em relação ao texto original:
- **JUCEMG** virou "Junta Comercial local". Também tirei o link do portal, porque ele era específico de MG.
- **DAE** virou "guia de recolhimento (em MG, DAE)". O nome da guia muda de estado para estado.
- O texto não citava nenhum shopping pelo nome, então ficou só "o shopping" em sentido genérico.
- Corrigi alguns erros de digitação ("loguin", "ALTEREÇÃO").

Uma ressalva: os passos 3 a 17 seguem o menu da JUCEMG. Em outras juntas, os nomes dos menus ("Serviços Web", "Download Serviços") e o fluxo podem ser diferentes. Por isso a skill avisa que é preciso conferir no portal de cada estado.

**Confiança: 8/10.** Não tenho certeza de que "TT" significa *taxa de transferência*. Foi o que deduzi pelo contexto, e deixei essa suposição marcada num callout de aviso para você confirmar ou corrigir.

- 📎 skill-levantamento-tt-junta-comercial.md


---

## Arquivos gerados nesta conversa

- [[claude/arquivos-gerados/2026-10/skill-obsidian-junta-comercial_e2fe6d4d/skill-levantamento-tt-junta-comercial.md]] (4 KB)
