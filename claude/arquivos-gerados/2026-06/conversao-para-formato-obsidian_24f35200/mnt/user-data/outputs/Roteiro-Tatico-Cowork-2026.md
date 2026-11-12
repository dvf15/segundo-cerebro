---
tipo: roteiro-operacional
área: shopping-inteligente
status: ativo
criado: 2026-06-09
tags: [cowork, agentes-ia, workshop, claude, shopping, hunter, farmer, builder, entertainer, zell, levy]
aliases: [Roteiro Cowork 2026, WS Supers e Gerentes, Montagem de Agente IA]
---

# Roteiro Tático do Cowork — WS Supers e Gerentes 2026

> [!info] Sobre este documento
> Guia passo a passo para montar um [[Agente de IA]] para o shopping durante o workshop. Cada passo tem um bloco pronto para colar no [[Claude Code]] (Cowork) e um exemplo preenchido para o Agente Hunter como referência. Campos entre `[colchetes]` são preenchidos pela própria pessoa.

---

## Antes de Começar (2 minutos)

> [!warning] Três conferências rápidas — já deixadas prontas por quem preparou as máquinas

- [ ] Abrir o app Claude no computador e **trocar para o modo Cowork** (não o chat comum)
- [ ] Confirmar pasta `Workshop Agentes` no caminho correto:
	- Windows: `C:\Users\SEU-USUARIO\Workshop Agentes`
	- Mac: `/Users/SEU-USUARIO/Workshop Agentes`
- [ ] Nas configurações de privacidade: **uso de dados para treinamento → desligado**

> [!danger] Regra de ouro do dia
> Apenas dados públicos ou fictícios. Sem nome de lojista, contrato, aluguel, faturamento ou dado pessoal. Se precisar de um número interno, invente um e escreva a palavra **fictício** ao lado.
> O agente **nunca apaga, compra ou contrata nada sem dupla confirmação humana**.

---

## O Que Será Construído

Ao final, cada pessoa termina com uma **pasta no computador** contendo o agente inteiro:
- identidade
- skills (tarefas que ele sabe fazer)
- primeiros resultados

Essa pasta é da equipe, abre em qualquer máquina e pode ser apresentada ao time do shopping.

**Jornada em uma linha:** Preparar pasta → escrever identidade → ensinar skills → testar → guardar → levar para o shopping.

> [!note] Quem cria o quê
> - **Operações** → [[Agente Builder]]
> - **Marketing** → [[Agente Entertainer]]
> - **Negócios** (Comercial) → [[Agente Hunter]] + [[Agente Farmer]] *(única exceção: dois agentes)*
>
> **Total:** 3 grupos, 4 agentes.

> [!note] Mínimo de skills por grupo
> - Builder e Entertainer: **mínimo 3 skills**
> - Negócios: **mínimo 4 skills** no total (Hunter + Farmer), com **1 skill de conexão** na qual o lead do Hunter vira match do Farmer
>
> Regra geral: comece pela skill mais valiosa e detalhe as demais na sequência.

---

## Passo 1 — Apresente-se ao Cowork e Fixe a Pasta de Trabalho

Primeira mensagem da sessão. Diz ao Cowork onde salvar tudo e pede que conduza por etapas, sem fazer tudo de uma vez.

> [!tip] Cole isto no Cowork
> ```
> Você vai me ajudar a construir um agente de IA para um shopping, do zero, comigo.
> 
> Regras de trabalho para esta sessão inteira:
> 1. Salve TODOS os arquivos que criarmos dentro desta pasta: [C:\Users\SEU-USUARIO\Workshop Agentes\Agente-NOME]. Crie essa pasta agora se ela não existir.
> 2. Dentro dela, use sempre esta organização: um arquivo contexto.md na raiz; uma subpasta skills com uma subpasta por skill, cada uma com um arquivo SKILL.md; uma subpasta entradas; uma subpasta saidas.
> 3. Trabalhe SEMPRE por etapas. Faça uma etapa de cada vez, me mostre o resultado, e só siga para a próxima quando eu disser ok, próxima.
> 4. Use apenas dados públicos ou fictícios. Se eu não fornecer um dado, escreva VERIFICAR no lugar e nunca invente número.
> 5. Antes de criar, mover ou apagar qualquer arquivo, me avise o que vai fazer e espere a minha confirmação.
> 
> Comece confirmando que entendeu essas regras e criando a estrutura de pastas vazia. Depois pare e espere o meu ok.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> Substituir `[Agente-NOME]` por `Agente-Hunter`:
> `C:\Users\SEU-USUARIO\Workshop Agentes\Agente-Hunter`
>
> O Cowork responde algo como: *"Criei a pasta Agente-Hunter com as subpastas skills, entradas e saidas, e um contexto.md vazio. Posso seguir?"*

> [!check] O que observar
> - Troque NOME pelo seu agente: Builder, Hunter, Farmer ou Entertainer
> - O Cowork pede permissão para criar as pastas — leia e aprove
> - Se ele tentar fazer tudo de uma vez, responda: *"Pare, faça só uma etapa por vez"*

---

## Passo 2 — Escreva a Identidade do Agente (contexto.md)

Fornecer ao Cowork a matéria-prima da identidade: escolhas de [[mentalidade Sam Zell]] e [[execução Zé Roberto Levy]] que formam o **Zél** da área, mais o que a área sabe da operação. O Cowork transforma no arquivo `contexto.md`.

> [!tip] Cole isto no Cowork
> ```
> Agora vamos montar a IDENTIDADE do agente e salvar como contexto.md na pasta.
> Use exatamente estes 5 campos como seções do arquivo:
>   1. Missão em uma frase
>   2. Quem ele é (persona, tom, mentalidade)
>   3. O que ele sabe (shopping, cluster, mercado)
>   4. Regras de decisão (critérios concretos de bom e ruim)
>   5. O que ele NUNCA faz (limites e segurança)
> 
> Aqui está a matéria-prima da minha área:
> 
> MENTALIDADE (Sam Zell): [cole as frases do Zell que sua mesa escolheu]
> EXECUÇÃO (Zé Roberto Levy): [cole os mandamentos do Levy que sua mesa escolheu]
> O QUE O AGENTE FAZ, PARA QUEM E COM QUE RESULTADO: [missão em uma frase]
> O QUE ELE SABE DA NOSSA OPERAÇÃO: [cluster, público, batalhas em aberto, lacunas de mix, vias, concorrentes]
> O QUE ELE NUNCA PODE FAZER: [limites da área, além das regras de segurança já dadas]
> 
> Monte o contexto.md com base apenas nisso. Onde faltar informação, escreva VERIFICAR e me pergunte. Me mostre o texto final antes de salvar.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> - **Mentalidade (Zell):** leia o risco e comece pelo lado negativo; onde há escassez, o preço não é problema
> - **Execução (Levy):** monitore o cluster e os concorrentes; faça prospecção de rua, rua por rua
> - **Missão:** buscar marcas em rua e em concorrentes que fechem as batalhas do cluster, conectando cada lead a uma oportunidade financeira
> - **O que ele sabe:** shopping familiar de classe B, com lacuna em gastronomia rápida; principais vias de comércio da cidade
> - **O que nunca faz:** usar nome real de lojista, contrato ou faturamento

> [!check] Teste de qualidade do contexto
> - [ ] Alguém de fora do grupo saberia como o agente decide um caso novo?
> - [ ] Há número ou critério concreto (não apenas adjetivo como "proativo" ou "eficiente")?
> - [ ] O contexto diz com clareza o que o agente **não** faz?
>
> Três respostas "sim" = contexto pronto.

---

## Passo 3 — Ensine a Primeira Tarefa (Primeira Skill)

[[Skill]] é uma tarefa repetitiva escrita como procedimento, para o agente fazer sempre da mesma forma. A pessoa descreve a tarefa, o Cowork formata no padrão `SKILL.md` com os 6 campos.

> [!tip] Cole isto no Cowork
> ```
> Agora vamos criar a primeira SKILL e salvá-la como SKILL.md dentro de skills/[nome-curto-da-skill]/.
> O arquivo deve começar com um cabeçalho entre três hifens, contendo name e description, e depois ter estes 6 campos como seções:
>   Gatilho, Passos numerados, Fontes, Output (a tabela coluna a coluna), Dono.
> 
> A tarefa que quero transformar em skill: [descreva com suas palavras a tarefa repetitiva]
> Quando ela deve rodar: [ex.: toda segunda-feira de manhã, ou sob demanda]
> De onde o agente tira os dados: [ex.: Google Maps, Instagram, sites, imprensa local]
> As colunas exatas que quero na tabela de resultado (use a barra para separar):
>   [ex.: Marca │ Categoria │ Local │ Sinais │ Fit │ Fonte │ Próxima ação]
> Quem recebe o resultado e o que faz com ele:
>   [ex.: o gerente comercial, que leva os melhores para a reunião]
> 
> Regra fixa do output: dado que faltar recebe a marca VERIFICAR, e fonte com link por linha.
> Monte o SKILL.md e me mostre antes de salvar.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> - **Tarefa:** toda segunda, varrer as 3 principais ruas e listar marcas fortes para prospecção
> - **Quando roda:** toda segunda-feira, antes da reunião comercial
> - **Fontes:** Google Maps, Instagram, iFood, imprensa local
> - **Colunas:** `Marca │ Categoria │ Local │ Sinais │ Batalha │ Fit │ Fonte │ Próxima ação`
> - **Dono:** gerente comercial, que leva os 3 leads mais quentes para a reunião de segunda

> [!warning] Repita até atingir o mínimo de skills
> Quando a primeira skill estiver salva, diga: *"Ótimo, vamos criar a próxima skill"* e cole de novo o bloco acima, mudando a tarefa.
>
> - Builder e Entertainer: **mínimo 3 skills**
> - Negócios: **mínimo 4 skills** (Hunter + Farmer), com 1 skill de conexão entre os dois
>
> **Skill sem tabela de output definida não é skill.** Defina sempre as colunas.

---

## Passo 4 — Teste o Agente com Dados Fictícios

> [!tip] Cole isto no Cowork
> ```
> Vamos testar o agente agora.
> 1. Leia o arquivo contexto.md da pasta e assuma essa identidade.
> 2. Rode a skill [nome da skill] usando apenas dados públicos ou fictícios.
> 3. Entregue o resultado na tabela exata definida na skill.
> 4. Salve o resultado como arquivo Excel na subpasta saidas, com a data no começo do nome:
>    [2026-06-15-nome-da-skill.xlsx]
> 
> Onde faltar dado real, escreva VERIFICAR. Não invente números.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> Rodar a skill `varredura-de-rua-semanal` e salvar como `2026-06-15-varredura.xlsx`
>
> Para iterar e melhorar:
> *"O que está faltando nesta tabela para a equipe usar amanhã sem retrabalho? Aplique apenas a melhoria que eu escolher e salve uma nova versão na pasta saidas."*

> [!check] Régua de qualidade
> - [ ] **Formato:** veio na tabela definida, com todas as colunas?
> - [ ] **Fontes:** cada dado pesquisado tem link?
> - [ ] **Honestidade:** o que faltou está marcado como VERIFICAR (sem invenção)?
> - [ ] **Utilidade:** a equipe consegue agir com isso sem refazer?

---

## Passo 5 — Transforme um Acerto em Skill Nova (Opcional)

Se durante o teste surgir uma forma melhor de fazer algo, congele como procedimento. É assim que o agente aprende.

> [!tip] Cole isto no Cowork
> ```
> Funcionou bem. Agora transforme exatamente o que acabamos de fazer em um procedimento passo a passo e salve como uma nova SKILL.md em skills/, no mesmo formato das anteriores, com cabeçalho entre três hifens contendo name e description, e os 6 campos.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> *"Transforme em skill a forma como separamos a coluna Sinais em nota e evidência, e salve como `skills/sinais-detalhados/SKILL.md`."*

---

## Passo 6 — Gere o Documento de Resumo do Agente

Documento de uma página para apresentar ao time do shopping. O Cowork monta a partir do que já está na pasta.

> [!tip] Cole isto no Cowork
> ```
> Para fechar, gere um documento Word chamado [Resumo-Agente-NOME.docx] e salve na raiz da pasta do agente. Ele deve conter, em uma a duas páginas:
> 1. A missão do agente em uma frase.
> 2. A persona e as regras de decisão, resumidas do contexto.md.
> 3. A lista das skills criadas, com o que cada uma faz em uma linha.
> 4. Os aprendizados do teste (o que funcionou e o que foi ajustado).
> 5. O entregável D0: de 3 a 5 ações que a equipe consegue rodar com o agente desde o primeiro dia, com responsável e frequência.
> 
> Use linguagem simples, para apresentar a uma equipe que não conhece o agente.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> Arquivo final: `Resumo-Agente-Hunter.docx`

---

## Passo 7 — Guarde Tudo e Leve para o Shopping

Os arquivos já estão na pasta, no computador. Agora garantir que a pessoa leva uma cópia. Ações feitas no computador (não no Cowork).

> [!tip] Opcional — cole para o Cowork compactar
> ```
> Compacte a pasta inteira do agente em um único arquivo .zip e me diga onde ela ficou salva, para eu copiar para o Drive.
> ```

Depois, manualmente:
- [ ] Copiar o `.zip` para o Google Drive ou Teams da equipe
- [ ] Para confirmar que abre em qualquer lugar: descompactar em outra máquina e abrir o Excel de saídas + o Word de resumo
- [ ] Confirmar que abrem **sem precisar do Claude** (prova que o trabalho é da equipe)

---

## Passo 8 — Reabra e Continue em Outro Dia

Ao voltar ao shopping e querer rodar o agente de novo ou evoluí-lo, não é preciso recomeçar.

> [!tip] Cole para reabrir o agente
> ```
> Leia o contexto.md desta pasta e assuma essa identidade. Liste as skills que existem na subpasta skills e me pergunte qual delas eu quero rodar hoje.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> O Cowork responde algo como:
> *"Identidade do Hunter carregada. Tenho 4 skills salvas: varredura-de-rua-semanal, espiao-de-concorrente, radar-de-marcas e conexao-com-farmer. Qual delas você quer rodar hoje?"*

---

## Depois do Workshop — Virar uma IA do Time (Project)

Tudo acima vive no computador via Cowork. Para a equipe inteira do shopping usar o mesmo agente sem depender de uma máquina, leve-o para um **[[Claude Project]]** no claude.ai.

- [ ] No claude.ai, criar um Project com o nome do agente (ex.: *Agente Hunter*)
- [ ] No campo de instruções do Project, colar o conteúdo inteiro do `contexto.md`
- [ ] No conhecimento do Project, anexar fichas e listas fictícias (sem dado sensível)
- [ ] Qualquer pessoa do time que abrir esse Project já conversa com o agente, sem montar nada

> [!warning] Confirmar antes de prometer ao time
> O compartilhamento real com a equipe exige plano **Team** ou **Enterprise**. Em plano individual, o compartilhamento é mais limitado.
> Confirme o plano da empresa com a área responsável.
>
> **Divisão de papéis:**
> - **Cowork** → gera os arquivos
> - **Project** → compartilha a identidade do agente para a equipe conversar e analisar

---

## Opcional — Painel Visual para a Reunião (Artefato)

Para apresentar resultados de forma visual na reunião (calendário, painel de leads, checklist clicável).

> [!tip] Cole se quiser um painel visual
> ```
> Transforme a tabela de [nome da skill] em um painel visual (artefato), com os itens em alerta destacados no topo, para eu apresentar na reunião.
> ```

> [!example] Exemplo preenchido — Agente Hunter
> *"Transforme a tabela de varredura-de-rua-semanal em um painel visual, com os 3 leads mais quentes destacados no topo."*

> [!info] Não confunda os três
> | Ferramenta | Para quê |
> |---|---|
> | **Cowork** | O agente trabalha e gera os arquivos — o que a equipe leva embora |
> | **Project** | O agente fica disponível para o time conversar |
> | **Artefato** | Apenas a apresentação visual na hora da reunião — para guardar, exporte como arquivo |

---

## Anexo A — Estrutura de Pastas

```
Workshop Agentes/
  └── Agente-NOME/
        ├── contexto.md              ← identidade do agente
        ├── Resumo-Agente-NOME.docx  ← para apresentar ao time
        ├── skills/                  ← uma pasta por skill
        │     └── nome-da-skill/
        │           └── SKILL.md
        ├── entradas/                ← listas e dados fictícios
        └── saidas/                  ← resultados datados
```

**Exemplo de nome de saída datado:** `2026-06-15-varredura.xlsx`

---

## Anexo B — Modelo de SKILL.md

```markdown
---
name: varredura-de-rua-semanal
description: Use toda segunda-feira, antes da reunião comercial, para varrer as 3 principais vias da cidade, mapear marcas com sinais de força e gerar a tabela de leads. Acione também sob demanda.
---

# Varredura de Rua Semanal — Agente Hunter

## Gatilho
Toda segunda-feira, antes da reunião comercial.

## Passos
1. Varrer Google Maps e Instagram das 3 principais vias da cidade.
2. Identificar operações com sinais de força (fila, avaliações 4,5+, crescimento de seguidores).
3. Classificar fit com as batalhas do cluster.
4. Cruzar com lacunas de mix.
5. Montar tabela e destacar os 3 leads mais quentes.

## Fontes
Google Maps e avaliações, Instagram, iFood, imprensa local.
Fonte com link obrigatória por linha.

## Output
Marca │ Categoria │ Local │ Sinais │ Batalha │ Fit │ Fonte │ Próxima ação
Dado faltante recebe a marca VERIFICAR.

## Dono
Gerente comercial, que leva os 3 leads quentes para a reunião de segunda.
```

---

## Resumo de Bolso

- [ ] **Passo 1:** Apresentar-se ao Cowork e fixar a pasta
- [ ] **Passo 2:** Escrever a identidade no `contexto.md`
- [ ] **Passo 3:** Ensinar as skills — mínimo do seu grupo, um `SKILL.md` cada
- [ ] **Passo 4:** Testar com dados fictícios e iterar
- [ ] **Passo 5:** Congelar acertos em skills novas *(opcional)*
- [ ] **Passo 6:** Gerar o resumo do agente
- [ ] **Passo 7:** Compactar e levar para o Drive
- [ ] **Passo 8:** Reabrir a pasta ao voltar
- [ ] **Depois:** Virar Project para o time; usar o artefato apenas para apresentar

---

> *"Make big plans; aim high in hope and work."* — Sam Zell

---

## Nota de Uso

> [!tip] Wikilinks, Dataview e Templates
> - Os termos entre `[[colchetes duplos]]` são wikilinks — crie as notas correspondentes no vault para ativar a navegação
> - O bloco Dataview abaixo lista automaticamente notas relacionadas por tag
> - Para criar uma nova nota de agente, use o template de agente do vault (`Ctrl/Cmd + T`)

```dataview
TABLE área, status, criado
FROM #agentes-ia OR #cowork OR #shopping-inteligente
SORT criado DESC
```

---

**Confiança:** 9/10