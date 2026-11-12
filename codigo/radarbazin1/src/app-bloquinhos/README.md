# 🧱 Mundo Mágico do Tom

Jogo interativo de matemática para crianças (5–10) e jovens (10–14), baseado no
raciocínio do **material dourado** (Montessori) e inspirado no desenho
**Numberblocks**: os números de 1 a 9 são personagens com personalidade que, quando
somados, se fundem em personagens maiores — e 10 cubinhos sempre viram uma **barra
dourada**.

Especificação completa: [`docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md`](../docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md)

## Como jogar localmente

É um app 100% estático (HTML + CSS + JS puros, sem dependências). Basta servir a
pasta por HTTP:

```bash
cd app-bloquinhos
npx http-server -p 8080        # ou: python3 -m http.server 8080
# abra http://localhost:8080
```

Depois da primeira visita o jogo funciona **offline** (PWA com service worker) e
pode ser instalado na tela inicial do celular.

## Como publicar

Qualquer hospedagem estática serve. No GitHub Pages, aponte o Pages para a branch
e acesse `https://<usuario>.github.io/<repo>/app-bloquinhos/`.

## Modos de jogo

- **Mundo dos Bloquinhos** — sandbox: crie, arraste e funda personagens; duplo
  toque separa 1; desafio "forme 10".
- **Contas com Blocos** — 4 níveis adaptativos (Faísca ✨, Chama 🔥, Fogueira 🏕️,
  Vulcão 🌋), sempre com dupla representação (símbolos + blocos) e resolução
  passo a passo ao errar duas vezes.
- **Jogos de Lógica** — Complete o 10, Padrão Maluco, Balança Justa,
  Caça-Quadrados e Trilha do Tesouro (1 jogador contra o Robô ou 2 no aparelho).
- **Álbum de Fusões** — colecione as 45 fusões possíveis de 1–9.

## Privacidade

Sem internet em tempo de jogo, sem cadastro, sem anúncios, sem coleta de dados.
O progresso fica em `localStorage`, apenas no aparelho.
