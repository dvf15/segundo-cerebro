# Passo a passo no Claude Code — Shopping Inteligente OS (Fase 1)

> Guia para você executar, do zero, na sua máquina. Cada passo é um comando ou uma mensagem
> que você cola no Claude Code. Siga em ordem. Não pule a leitura dos avisos.

---

## Antes de começar — leia isto

Você vai construir a **Fase 1**: o sistema completo rodando com **dados fictícios**, na sua máquina.
É o esqueleto que vira produção depois da conversa com a TI da Allos. Você não perde nada construindo
assim — chega na TI com algo funcionando, que é a posição mais forte.

**O que você precisa ter:** Claude Code instalado (✓ você já tem) e Python 3.11+ na máquina.
Se não souber se tem Python, o passo 1 verifica.

**Regra de ouro durante toda a Fase 1:** se o Claude Code sugerir conectar a um dado real, ao
Sistema Bahia, ou subir algo em nuvem — **pare e diga "isso é Fase 2, deixe comentado"**. O
arquivo CLAUDE.md já instrui ele a respeitar isso, mas você é o guardião final.

---

## PASSO 0 — Preparar a pasta do projeto

No seu terminal (fora do Claude Code), crie e entre na pasta:

```
mkdir shopping-os
cd shopping-os
```

Copie para dentro dela o arquivo **CLAUDE.md** que veio junto com este guia.
Depois, abra o Claude Code nessa pasta:

```
claude
```

---

## PASSO 1 — Deixar o Claude Code entender o projeto

Cole esta mensagem no Claude Code:

```
Leia o arquivo CLAUDE.md desta pasta. Ele é o contrato deste projeto.
Confirme que entendeu: (1) qual é o objetivo da Fase 1, (2) as regras invioláveis,
e (3) onde a Fase 1 para. Não escreva código ainda. Só me diga, em 5 linhas,
o que você entendeu — incluindo a verificação de que tenho Python 3.11+ instalado.
```

**O que esperar:** ele confirma o entendimento e roda um comando para checar sua versão de Python.
Se faltar Python, ele te orienta a instalar antes de seguir.

---

## PASSO 2 — Pedir o plano (sem código ainda)

Cole:

```
Entre em plan mode. Crie o arquivo tasks/todo.md com o plano completo da Fase 1,
seguindo a estrutura de pastas e a definição de "pronto" do CLAUDE.md.
Quebre em tarefas pequenas e marcáveis, na ordem certa de construção.
Não implemente nada ainda. Me mostre o plano para eu aprovar.
```

**Por que isso importa:** você revisa o caminho inteiro antes de uma linha de código existir.
Leia o `todo.md`. Se algo parecer fora de ordem ou grande demais, peça para ajustar.

**Sua ação:** quando o plano fizer sentido, responda `Plano aprovado. Comece pela primeira tarefa.`

---

## PASSO 3 — Construir as 7 bases fictícias

Quando ele chegar nessa tarefa, ou se precisar empurrar:

```
Implemente apenas a primeira tarefa: criar a pasta dados_ficticios/ com os 7
arquivos JSON, cada um com 3 a 5 registros fictícios realistas (pode usar o
contexto de um shopping cluster Entretenimento na Zona Leste de SP).
Lembre: a base investidores é LGPD — dados claramente inventados, nada que pareça real.
Depois, mostre o conteúdo de 2 arquivos para eu conferir.
```

**Verificação sua:** abra um ou dois JSON e veja se os dados são coerentes e claramente fictícios.

---

## PASSO 4 — Os 4 scores (com teste)

```
Próxima tarefa: criar scores.py com os 4 scores do CLAUDE.md, cada um como
função pura. Crie também um teste simples que prove que cada score calcula certo
com valores de exemplo. Rode o teste e me mostre a saída antes de marcar como concluído.
```

**Verificação sua:** ele deve mostrar o teste passando. Se der erro, deixe ele corrigir até passar.

---

## PASSO 5 — O motor de IA (modo simulado)

⚠️ Atenção especial aqui.

```
Próxima tarefa: criar motor_ia.py. Por padrão ele opera em MODO SIMULADO —
retorna uma resposta de exemplo pré-montada, SEM chamar nenhuma API.
Deixe preparada (mas DESLIGADA e comentada) a opção de chamar a API real do Claude,
lendo a chave de uma variável de ambiente. Não coloque nenhuma chave no código.
Marque a parte da API real como [FASE 2 — opcional]. Me explique como ligar o
modo real no futuro, sem fazer isso agora.
```

**Por que assim:** a Fase 1 não precisa de IA real para demonstrar o fluxo. E manter a chamada
desligada evita custo acidental e mantém você no controle.

---

## PASSO 6 — Três agentes funcionando

```
Próxima tarefa: implementar 3 agentes em agentes/ — Cluster Positioning, Hunter
e Deal Conversion. Cada um lê as bases que precisa, monta o prompt, chama o
motor_ia em modo simulado, e devolve um resultado estruturado.
Implemente um de cada vez, testando cada um antes de seguir para o próximo.
```

**Verificação sua:** peça para rodar cada agente isolado e ver a saída.

---

## PASSO 7 — Orquestrador de ponta a ponta

```
Próxima tarefa: criar orquestrador.py e main.py (CLI). Quero rodar no terminal
um comando como "python main.py" que me deixa escolher um workflow e ver os
agentes sendo acionados em sequência, com dados fictícios, terminando numa
Deal Conversion Table no terminal. Tudo em modo simulado.
```

**Marco importante:** quando isso rodar, você tem a Fase 1 funcional de ponta a ponta. É a sua demo.

---

## PASSO 8 — Fechar e registrar

```
Atualize tasks/todo.md marcando o que foi concluído e adicione uma seção
"Revisão" resumindo o que foi construído. Liste explicitamente os pontos
marcados [FASE 2 — TI] que ficaram propositalmente pendentes.
Confirme que nenhum dado real foi tocado e que nenhuma chave está no código.
```

---

## Depois da Fase 1 — o que vem

1. **Mostre a demo** (rodando no terminal) para a liderança.
2. **Leve o roteiro da TI** (o outro arquivo) para a reunião de segurança.
3. **Só depois das respostas da TI** voltamos aqui e eu te ajudo a montar o passo a passo da
   Fase 2 — agora com as definições reais de hospedagem, Sistema Bahia e LGPD. Aí o
   "mirar produção com dados reais" passa a ser possível de escrever sem adivinhação.

---

## Se algo der errado

- **O Claude Code quer pular para dado real ou nuvem:** responda "isso é Fase 2, deixe comentado e siga".
- **Um teste não passa:** deixe ele depurar; peça para mostrar o erro e a correção.
- **Você se perdeu na ordem:** peça "mostre o tasks/todo.md e me diga em que passo estamos".
- **Ficou grande demais um arquivo:** peça para quebrar em partes menores. Simplicidade primeiro.

---

## Lembrete final

O único motivo de a Fase 1 vir antes da produção é que **metade das definições de produção estão
com a TI da Allos, não com você nem comigo**. Construindo a Fase 1 você aprende, demonstra e chega
forte na conversa — sem retrabalho, porque o código é o mesmo. A diferença para a produção é, na
prática, trocar a fonte de dados. Esse é o caminho que te protege.
