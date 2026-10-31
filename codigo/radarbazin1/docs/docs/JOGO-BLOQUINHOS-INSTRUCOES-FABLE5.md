# Bloquinhos Mágicos — Instruções de Orquestração para o Fable 5

> Documento de instruções para que o Claude Fable 5 orquestre, do zero, a construção de um
> jogo interativo de matemática para crianças e jovens, inspirado no **material dourado**
> (Montessori) e no desenho **Numberblocks**: bloquinhos de 1 a 9 com personalidades
> próprias que, quando somados, formam peças maiores e novas personalidades.

---

## 1. Visão do produto

**Nome de trabalho:** Bloquinhos Mágicos

**Objetivo:** ensinar crianças (5–10 anos) e jovens (10–14 anos) a *pensar* matemática de
forma divertida e visual — não a decorar contas. Toda quantidade é representada
fisicamente por bloquinhos empilháveis, seguindo o raciocínio do material dourado:

- **Unidade** = 1 cubinho
- **Barra de 10** = 10 cubinhos alinhados (troca automática e animada ao completar 10)
- **Placa de 100** = 10 barras
- **Cubo de 1000** = 10 placas (apenas nos níveis avançados)

**Princípio central:** o número não é um símbolo abstrato — é um personagem feito de
blocos. Somar é literalmente *juntar blocos e ver um personagem novo nascer*. Subtrair é
separar. Multiplicar é formar retângulos. Dividir é repartir em grupos iguais.

**Público e plataforma:** navegador (desktop e mobile), instalável como PWA, 100% offline
após o primeiro carregamento, sem cadastro, sem anúncios, sem coleta de dados (adequado a
LGPD/COPPA para menores). Idioma: português do Brasil.

---

## 2. Os personagens (bloquinhos 1 a 9)

Cada número de 1 a 9 é um personagem com cor, forma de empilhamento, personalidade e
bordão. As fusões (somas) geram os personagens maiores na hora, com animação de
"encaixe" e uma fala curta de apresentação.

| Nº | Nome        | Cor (base)        | Personalidade                                  | Bordão                          |
|----|-------------|-------------------|------------------------------------------------|---------------------------------|
| 1  | Uni         | Vermelho          | Curioso, corajoso, adora ser o primeiro        | "Um por todos!"                 |
| 2  | Dupla       | Laranja           | Dançarina, faz tudo em pares                   | "Dois pés, dois passos!"        |
| 3  | Trio        | Amarelo           | Palhaço, malabarista, conta piadas em 3 tempos | "Um, dois, TRÊS!"               |
| 4  | Quadrado    | Verde             | Organizado, certinho, ama cantos retos         | "Tudo no esquadro!"             |
| 5  | Manola      | Azul-claro        | Estrela do rock, bate palma com 5 dedos        | "Toca aqui!"                    |
| 6  | Dado        | Índigo            | Sortudo, rola como um dado, ama jogos          | "Vamos jogar!"                  |
| 7  | Arco        | Roxo              | Sonhadora, colecionadora de arco-íris          | "Sete cores, sete sonhos!"      |
| 8  | Polvo       | Rosa              | Multitarefa, oito braços, super veloz          | "Oito abraços de uma vez!"      |
| 9  | Quase-Dez   | Marrom-dourado    | Ansioso, vive a um passo de virar 10           | "Só falta UM!"                  |
| 10 | Dezena      | Branco + listras  | Líder da turma, vira uma barra dourada         | "Juntos somos dez!"             |

**Regras de fusão:**
- Somar dois personagens = os blocos se encaixam, a soma "nasce" com fala própria
  (ex.: 3 + 4 → Quadrado e Trio giram, se encaixam e viram Arco: "Sete cores!").
- Ao completar 10, os cubinhos se alinham e viram **uma barra dourada** — a troca do
  material dourado, sempre celebrada com confete e som.
- Números acima de 10 são compostos: barras + personagem do resto (ex.: 23 = 2 barras +
  Trio em cima). Isso ensina valor posicional sem nunca falar "valor posicional".
- Subtração = fusão ao contrário: o personagem se parte com animação de "pulo para fora".

Todos os personagens têm **olhos e boca animados** (SVG), 3 expressões mínimas (neutro,
feliz, pensativo) e uma animação de fusão. Nada de assets externos: tudo desenhado em
SVG/CSS no próprio código.

---

## 3. Modos de jogo

### 3.1 Mundo dos Bloquinhos (sandbox — porta de entrada)
Área livre de brincar: arrastar cubinhos, empilhar, juntar personagens e ver fusões
acontecerem. Sem pontuação, sem erro. É onde a criança descobre as regras por conta
própria. Botão "10!" que desafia a formar uma dezena.

### 3.2 Contas com Blocos (aritmética progressiva)
Contas apresentadas **sempre em dupla representação**: símbolos (3 + 4 = ?) e blocos
manipuláveis. A criança pode responder digitando OU montando os blocos. Níveis:

1. **Faísca (5–7 anos):** contagem, soma e subtração até 10, sem troca.
2. **Chama (7–9 anos):** soma/subtração até 100 **com troca** (o momento "vai um" é a
   animação de 10 cubinhos virando barra — o coração pedagógico do jogo).
3. **Fogueira (9–12 anos):** multiplicação como retângulo de blocos, divisão como
   repartição, dobro/metade.
4. **Vulcão (12–14 anos):** expressões com dois passos, frações com blocos partidos,
   porcentagem visual (barra de 100).

Progressão adaptativa simples: 3 acertos seguidos sobe a dificuldade dentro do nível;
2 erros seguidos desce e mostra a resolução animada com blocos, passo a passo.

### 3.3 Jogos de Lógica (coloridos e rápidos, 3–5 min cada)
- **Complete o 10:** chuva de personagens; toque nos pares que somam 10 antes que a tela
  encha (5+5, 6+4, 7+3...). Treina fatos fundamentais.
- **Padrão Maluco:** sequências de blocos coloridos (2, 4, 6, ?) — a criança arrasta o
  personagem que continua o padrão.
- **Balança Justa:** uma balança de dois pratos; equilibre colocando blocos
  (pré-álgebra: 3 + ? = 7 sem nunca escrever "x").
- **Caça-Quadrados:** monte o maior quadrado possível com N cubinhos (números quadrados
  e área, na prática).
- **Trilha do Tesouro:** tabuleiro onde cada casa exige uma continha para avançar; modo
  de 1 ou 2 jogadores no mesmo aparelho.

### 3.4 Recompensas
Sem ranking e sem pressão de tempo por padrão (modo cronômetro é opcional). Recompensas:
**estrelas por sessão**, **álbum de personagens** (fusões já descobertas — ex.: "você já
viu 6+7?") e **fitas de medalha por nível**. Progresso salvo em `localStorage`.

---

## 4. Requisitos técnicos

- **Stack:** um único `index.html` autocontido (HTML + CSS + JS vanilla + SVG inline),
  sem build, sem dependências externas, sem chamadas de rede. Publicável no GitHub Pages
  na pasta `app-bloquinhos/` deste repositório. Se ultrapassar ~150 KB de JS, dividir em
  módulos ES carregados localmente — nunca CDN.
- **PWA:** `manifest.json` + service worker de cache-first + ícone SVG do Uni.
- **Som:** efeitos gerados por Web Audio API (bipes alegres, acorde na fusão, fanfarra na
  dezena). Botão de mudo persistente. Nenhum arquivo de áudio externo.
- **Acessibilidade:** alvos de toque ≥ 48px, alto contraste nas cores dos personagens
  (verificar razão ≥ 3:1 sobre o fundo), fontes grandes e arredondadas, funciona por
  toque e por teclado, `prefers-reduced-motion` respeitado.
- **Responsivo:** mobile-first (o público usa tablet/celular dos pais); paisagem e
  retrato.
- **Privacidade:** zero rede, zero analytics, zero texto digitado livre.

---

## 5. Plano de orquestração (para o Fable 5 executar)

O Fable 5 deve conduzir a construção em **5 fases**, usando subagentes/workflows quando
indicado. Cada fase termina com um commit na branch de trabalho.

### Fase 0 — Fundação (inline, sem agentes)
1. Criar a estrutura `app-bloquinhos/` com `index.html` esqueleto, `manifest.json`,
   `sw.js` e este documento como referência.
2. Definir no código as constantes de design: paleta dos 10 personagens, tamanhos de
   bloco, durações de animação.

### Fase 1 — Motor de blocos (o núcleo, fazer primeiro e bem feito)
Construir o **BlockEngine**: renderização SVG de cubinhos/barras/placas, arrastar-e-soltar
(pointer events, funciona com dedo), detecção de encaixe, animação de fusão e a **troca
automática 10 cubinhos → 1 barra**. Critério de pronto: no sandbox, arrastar 7 sobre 3
forma uma barra dourada com animação e som.

### Fase 2 — Personagens e sandbox
Desenhar os 10 personagens em SVG (rostos animados, 3 expressões), implementar falas/
bordões em balões, e montar o modo **Mundo dos Bloquinhos** completo sobre o BlockEngine.

> **Paralelização sugerida:** os 10 personagens SVG são independentes entre si — um
> workflow com um agente por personagem (mesmo template de prompt, variando número, cor
> e personalidade) acelera esta fase. O orquestrador integra e harmoniza o estilo.

### Fase 3 — Modos de jogo
Implementar **Contas com Blocos** (4 níveis + progressão adaptativa) e os **5 jogos de
lógica**. Os jogos de lógica são independentes entre si e podem ser paralelizados em
agentes (um por jogo), todos consumindo a mesma API do BlockEngine e o mesmo shell de
navegação. O gerador de contas deve ser puro e testável (`gerarConta(nivel, subnivel)`).

### Fase 4 — Recompensas, PWA e polimento
Álbum de fusões, estrelas, medalhas, persistência em `localStorage`, service worker,
manifest, tela inicial com mapa dos modos, botão de mudo, telas de pais (explicação
pedagógica do material dourado em 1 parágrafo).

### Fase 5 — Verificação e revisão (obrigatória, com agentes adversariais)
1. **Teste funcional real:** abrir o jogo no Chromium headless (Playwright pré-instalado)
   e exercitar: fusão 7+3 → barra; uma conta de cada nível respondida certa e errada;
   um jogo de lógica completo; recarregar e conferir persistência; modo offline.
2. **Revisão adversarial em paralelo** (workflow com 4 lentes): *correção matemática*
   (gerador de contas nunca produz resposta errada ou negativa indevida), *usabilidade
   infantil* (alvos de toque, leitura, frustração), *performance mobile* (60fps no drag,
   sem layout thrash) e *acessibilidade*. Só integrar achados confirmados.
3. Commit final + push. Abrir PR somente se o usuário pedir.

**Regras de orquestração:**
- Branch de trabalho: `claude/math-game-numberblocks-vjfnkf` (nunca commitar em `main`).
- Commits pequenos e descritivos em português, um por fase no mínimo.
- Nenhuma dependência externa entra no projeto sem justificativa escrita no commit.
- Em caso de dúvida de escopo (ex.: adicionar níveis além do Vulcão), perguntar ao
  usuário via `AskUserQuestion`; para todo o resto, decidir e seguir.

---

## 6. Prompt mestre (copiar e colar no Fable 5)

```text
Construa o jogo "Bloquinhos Mágicos" seguindo à risca o documento
docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md deste repositório.

Execute as fases 0 a 5 na ordem, commitando ao fim de cada fase na branch
claude/math-game-numberblocks-vjfnkf. Use workflows/subagentes em paralelo
nas fases 2 (um agente por personagem SVG), 3 (um agente por jogo de lógica)
e 5 (revisão adversarial em 4 lentes). O jogo deve ser um app web autocontido
em app-bloquinhos/ (HTML+CSS+JS+SVG, sem dependências externas, PWA offline,
em português do Brasil).

Critérios de aceite inegociáveis:
1. Arrastar blocos funciona com o dedo em celular; 10 cubinhos viram uma
   barra dourada com animação e som.
2. Os 10 personagens têm rosto, cor, bordão e animação de fusão.
3. Os 4 níveis de contas e os 5 jogos de lógica são jogáveis do início ao fim.
4. O gerador de contas nunca produz uma questão com resposta errada.
5. Progresso persiste após recarregar; o jogo abre offline.
6. Zero chamadas de rede em tempo de jogo; zero coleta de dados.

Ao final, verifique tudo de verdade no Chromium (Playwright) antes do push
e reporte o que foi testado. Não abra PR sem eu pedir.
```

---

## 7. Critérios de aceite (checklist de verificação)

- [ ] Fusão 7 + 3 forma barra dourada com animação, som e confete.
- [ ] 23 é exibido como 2 barras + Trio (valor posicional visual).
- [ ] Subtração com "empresta" mostra a barra se desfazendo em 10 cubinhos.
- [ ] Multiplicação 3 × 4 desenha um retângulo 3 por 4 de cubinhos.
- [ ] Errar 2 vezes mostra resolução animada passo a passo, sem punição.
- [ ] Todos os alvos de toque têm ao menos 48 px.
- [ ] `prefers-reduced-motion` desliga animações não essenciais.
- [ ] Lighthouse PWA instalável; funciona em modo avião após 1ª visita.
- [ ] Nenhuma requisição de rede durante o jogo (aba Network vazia).
- [ ] Funciona em tela de 360 px de largura e em desktop.
