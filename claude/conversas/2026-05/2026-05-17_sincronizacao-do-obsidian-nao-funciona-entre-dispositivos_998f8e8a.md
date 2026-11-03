---
title: "Sincronização do Obsidian não funciona entre dispositivos"
date: 2026-05-17
updated: 2026-05-17
source: "claude-chat"
source_id: "998f8e8a-df49-4dfa-ac33-2a5da1a75110"
url: "https://claude.ai/chat/998f8e8a-df49-4dfa-ac33-2a5da1a75110"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Sincronização do Obsidian não funciona entre dispositivos

> **Resumo:** **Conversation Overview**

The person sought help troubleshooting Obsidian Sync, which was not working after they installed Obsidian on their phone (with existing files), installed it on their computer, and subscribed to the Sync plan. The core issue was that they had not yet created a remote vault or linked both devices to the same remote vault — the most common cause of Obsidian Sync failures in this setup.

Claude provided a step-by-step resolution in Portuguese, instructing the person to start the sync process from the mobile device (since it already contained the files) by logging into their Obsidian account, enabling the Sync core plugin, creating a new remote vault with a name, region, and encryption key, and waiting for full sync completion. For the computer, the steps involved logging into the same account, enabling Sync, selecting the same remote vault created on mobile, entering the matching encryption key, and connecting to a new empty local vault to avoid merge conflicts.

Claude also outlined a checklist of additional things to verify if the issue persisted: confirming both devices share the same account, confirming the remote vault name appears on both devices, verifying the subscription is active, ensuring the local vault folder is not nested inside a third-party cloud sync service (such as iCloud, OneDrive, or Dropbox), and checking the Sync log for specific error messages. The response was rated at 8/10 confidence, with Claude noting that the exact root cause could not be pinpointed without seeing the Sync log output.

**Mensagens:** 2 · **Criada:** 2026-05-17 · **Atualizada:** 2026-05-17

---

## 👤 Usuário · 2026-05-17 18:00

Tenho o obsidian instalado no celular com varios arquivos instalados, intalei no computador, depois assinei o plano sync e tentei sincronizar, mas nao esta funcionando, o que devo fazer?

## 🤖 Claude · 2026-05-17 18:01

  The user is asking about Obsidian Sync issues between their mobile and desktop devices. I'm thinking through the typical setup problems—they likely need to create a remote vault first, then connect both devices to it using the same account credentials, and make sure each local vault is properly linked to that remote vault.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 I need to pull up the actual setup page.
```
This block is not supported on your current device yet.
```

 Agora tenho clareza sobre o problema: o usuário criou um vault no celular, instalou no PC e assinou o Sync, mas os dois dispositivos não estão se sincronizando. O cenário mais comum é que ele não tenha criado um cofre remoto ou não conectou ambos os aparelhos ao mesmo cofre. Vou estruturar uma resposta passo a passo para resolver isso.

A solução envolve garantir que ambos os dispositivos estejam logados na mesma conta Obsidian, ativar o plugin Sync em ambos, criar um cofre remoto novo no celular (que já tem os arquivos), fazer upload, e depois conectar o PC ao mesmo cofre remoto, verificando se estão usando a mesma chave de encriptação. Vou apresentar isso de forma prática e direta, já que é uma pergunta de como fazer.O problema mais comum nesse cenário é que o cofre remoto (na nuvem do Sync) ou não foi criado, ou os dois dispositivos não estão conectados ao **mesmo** cofre remoto. O Sync não junta automaticamente um cofre local do celular com outro do PC — você precisa subir um para a nuvem e baixar no outro.

Como o celular é quem já tem os arquivos, faça o upload **a partir dele primeiro**:

**No celular (faça primeiro):**
1. Settings → General → entre com a conta Obsidian (a mesma que assinou o Sync).
2. Settings → Core plugins → ative **Sync**.
3. Settings → Sync → em "Remote vault" toque **Choose** → **Create new vault**.
4. Defina nome, região (escolha a mais próxima, ex: São Paulo) e uma **chave de encriptação** (anote — não dá pra recuperar).
5. Toque **Connect** → **Start syncing** e espere o círculo verde de "Fully synced".

**No computador (depois que o celular subir tudo):**
1. Login com a mesma conta Obsidian.
2. Ative o plugin Sync.
3. Settings → Sync → **Choose** remote vault → selecione o cofre que você criou no celular → **Connect**.
4. Digite a mesma chave de encriptação.
5. Crie um cofre local **vazio** para receber os dados (não aponte para uma pasta já cheia, senão dá conflito de merge).
6. Start syncing.

**Se mesmo assim não funcionar, cheque:**
- Os dois dispositivos estão na mesma conta? (Settings → Account)
- Aparece o mesmo nome de cofre remoto nos dois?
- A assinatura está ativa em obsidian.md/account/sync?
- O cofre local do PC não está dentro de pasta do iCloud/OneDrive/Dropbox (isso causa conflito com o Sync).
- Veja o "Sync log" (ícone do Sync na barra) — ele mostra a mensagem de erro específica.

Fontes: [Configurar o Obsidian Sync (ajuda oficial)](https://obsidian.md/pt/help/sync/setup).

---
**Confiança: 8/10.** O passo a passo segue a documentação oficial atual do Obsidian. O ponto que pode variar é a causa exata do seu "não está funcionando" — pode ser desde não ter criado cofre remoto até conflito com pasta sincronizada por outro serviço, e sem ver a mensagem de erro do Sync log eu estou cobrindo as causas mais comuns, não a sua específica. Se quiser, me diga o que aparece no Sync log ou em que tela trava, que eu refino.
