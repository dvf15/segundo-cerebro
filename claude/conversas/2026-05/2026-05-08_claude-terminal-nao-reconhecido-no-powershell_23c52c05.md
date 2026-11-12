---
title: "Claude terminal não reconhecido no PowerShell"
date: 2026-05-08
updated: 2026-05-08
source: "claude-chat"
source_id: "23c52c05-fd2c-4b35-a4bc-b758fa197790"
url: "https://claude.ai/chat/23c52c05-fd2c-4b35-a4bc-b758fa197790"
project: null
messages: 12
generated_files: 0
tags: ["claude", "conversa"]
---
# Claude terminal não reconhecido no PowerShell

> **Resumo:** **Conversation Overview** The person sought help installing and running Claude Code (the terminal/CLI tool) on Windows using PowerShell. The conversation was entirely technical, focused on troubleshooting a `CommandNotFoundException` error when attempting to run the `claude` command. The session progressed through several steps: Claude first identified that the tool was not installed and directed the person to run the native Windows installer (`irm https://claude.ai/install.ps1 | iex`). There was initial confusion as the person ran only `claude --version` without first executing the installer, requiring Claude to clarify the correct sequence. Once the installer was run successfully, it installed Claude Code version 2.1.133 to `C:\Users\dvfre\.local\bin\claude.exe`, but the installer flagged that the install directory was not in the system PATH. Claude then provided a PowerShell command to add the path to the user's environment variables and instructed the person to restart the terminal to apply the change. The conversation ended before confirming whether the final PATH fix resolved the issue.

**Mensagens:** 12 · **Criada:** 2026-05-08 · **Atualizada:** 2026-05-08

---

## 👤 Usuário · 2026-05-08 11:38

estou tentando usar o claude terminal, mas quando digito clude no windows power shell aparece a seguinte mensagem, claude : O termo 'claude' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.
Verifique a grafia do nome ou, se um caminho tiver sido incluído, veja se o caminho está correto e tente novamente.
No linha:1 caractere:1
+ claude
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

## 🤖 Claude · 2026-05-08 11:38

 The user is trying to use Claude Code (claude terminal) on Windows PowerShell but getting a "command not found" error. Let me check the skill for product self-knowledge first, then provide installation guidance.

The issue is likely that Claude Code isn't installed, or it's installed but not in the PATH. Let me provide the correct installation steps.

Claude Code is installed via npm: `npm install -g @anthropic-ai/claude-code`

Let me check the skill to make sure I have accurate info.
```
This block is not supported on your current device yet.
```

Let me fetch the Claude Code docs to get accurate installation info for Windows.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Clear answer: the user simply hasn't installed Claude Code. The recommended method for Windows PowerShell is the native installer command.O problema é simples: o Claude Code não está instalado na sua máquina. O erro que você vê é exatamente o que acontece quando o sistema não encontra o comando.

**Solução recomendada para Windows (mais fácil):**

Cole esse comando direto no PowerShell e execute:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Esse instalador nativo baixa o binário, configura o PATH automaticamente e mantém o Claude Code atualizado em segundo plano. Não precisa de Node.js nem configuração adicional.

Depois feche e reabra o PowerShell, e teste:

```powershell
claude --version
```

---

**Se der erro de política de execução**, rode isso antes:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois execute o comando de instalação novamente.

---

**Observação importante:** o Claude Code requer uma conta paga — Pro ($20/mês), Max, Teams, Enterprise ou uma conta no Console da Anthropic com créditos. O plano gratuito do Claude.ai não inclui acesso ao Claude Code.

---

**Confiança: 9/10**

## 👤 Usuário · 2026-05-08 11:43

nao funcionou

## 🤖 Claude · 2026-05-08 11:43

 The user says it didn't work. I need more details to help. Let me ask what error message they got.Preciso saber o que aconteceu exatamente. Qual mensagem de erro apareceu quando você rodou o comando?

Cole aqui o texto completo que apareceu no PowerShell.

## 👤 Usuário · 2026-05-08 11:43

PS C:\Users\dvfre> claude --version
claude : O termo 'claude' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.
Verifique a grafia do nome ou, se um caminho tiver sido incluído, veja se o caminho está correto e tente novamente.
No linha:1 caractere:1
+ claude --version
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
PS C:\Users\dvfre> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
PS C:\Users\dvfre> claude --version
claude : O termo 'claude' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.
Verifique a grafia do nome ou, se um caminho tiver sido incluído, veja se o caminho está correto e tente novamente.
No linha:1 caractere:1
+ claude --version
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
PS C:\Users\dvfre>

## 🤖 Claude · 2026-05-08 11:44

 The user ran Set-ExecutionPolicy but didn't run the actual installer command `irm https://claude.ai/install.ps1 | iex`. They only ran `claude --version` after setting the execution policy. They need to actually run the installer first.Você mudou a política de execução, mas não rodou o instalador. Faltou esse passo.

Cole esse comando no PowerShell e execute:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Depois que terminar, feche o PowerShell, abra um novo e teste `claude --version`.

Me manda o que aparecer durante a instalação se der problema.

## 👤 Usuário · 2026-05-08 11:45

PS C:\Users\dvfre> claude --version
claude : O termo 'claude' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.
Verifique a grafia do nome ou, se um caminho tiver sido incluído, veja se o caminho está correto e tente novamente.
No linha:1 caractere:1
+ claude --version
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

## 🤖 Claude · 2026-05-08 11:45

 The user seems to still be getting the same error. They may not have run the installer command `irm https://claude.ai/install.ps1 | iex`. Let me ask them to show what happened when they ran that specific command.Você rodou o comando de instalação? Cole o resultado **desse comando específico** aqui:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Preciso ver o que aparece durante a instalação, não só o `claude --version`. O erro atual indica que o instalador não foi executado ainda.

## 👤 Usuário · 2026-05-08 11:46

O Windows PowerShell
Copyright (C) Microsoft Corporation. Todos os direitos reservados.
Instale o PowerShell mais recente para obter novos recursos e aprimoramentos! https://aka.ms/PSWindows
PS C:\Users\dvfre> claude --version
claude : O termo 'claude' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.
Verifique a grafia do nome ou, se um caminho tiver sido incluído, veja se o caminho está correto e tente novamente.
No linha:1 caractere:1
+ claude --version
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
PS C:\Users\dvfre>

## 🤖 Claude · 2026-05-08 11:46

 The user is only running `claude --version` but not running the installer command `irm https://claude.ai/install.ps1 | iex`. I need to be very clear about what they need to do.Você ainda não rodou o instalador. Você só testou `claude --version` de novo.

Cole **exatamente esse comando** e pressione Enter:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Esse é o passo que instala o Claude. O `claude --version` só funciona **depois** da instalação.

## 👤 Usuário · 2026-05-08 11:48

PS C:\Users\dvfre> irm https://claude.ai/install.ps1 | iex
Setting up Claude Code...
√ Claude Code successfully installed!
  Version: 2.1.133
  Location: C:\Users\dvfre\.local\bin\claude.exe
  Next: Run claude --help to get started
‼ Setup notes:
  ● Native installation exists but C:\Users\dvfre\.local\bin is not in your PATH. Add it by opening: System Properties →
     Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal.
✅ Installation complete!
PS C:\Users\dvfre> claude
claude : O termo 'claude' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.
Verifique a grafia do nome ou, se um caminho tiver sido incluído, veja se o caminho está correto e tente novamente.
No linha:1 caractere:1
+ claude
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (claude:String) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : CommandNotFoundException
PS C:\Users\dvfre>

## 🤖 Claude · 2026-05-08 11:48

 The installer worked but the PATH isn't set. I need to help them add the path. I can give them a PowerShell command to do it automatically.Instalou com sucesso, mas o PATH não foi configurado. Rode esse comando para corrigir:

```powershell
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Users\dvfre\.local\bin", "User")
```

Depois **feche o PowerShell completamente e abra um novo**, e teste:

```powershell
claude --version
```
