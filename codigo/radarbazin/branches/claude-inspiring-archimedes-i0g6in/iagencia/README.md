# IAgencia — designer do shopping

App estático (HTML + JS, sem build e sem servidor) que faz o papel do designer
do shopping: guarda o guia do cluster e desdobra o KV da campanha em peças de
impressão no tamanho pedido, com sangria e marcas de corte.

## Como abrir

```bash
python3 -m http.server 8000 --directory iagencia   # depois abra http://localhost:8000
```

Também funciona abrindo `index.html` direto no navegador. As fontes vêm do
Google Fonts, então a primeira carga precisa de internet.

## Fluxo

1. **Cluster** — linha criativa, tom de voz, personas, cores, tipografia e forma.
   O guia pode ser exportado em `.json` e importado pelos outros shoppings do cluster.
2. **KV** — o shopping insere o KV padrão, marca o ponto focal, preenche os
   textos e envia as imagens dos prêmios e as logos das marcas.
3. **Peças** — cada desdobramento é pedido com largura, altura, sangria, margem
   de segurança, quantidade e material.
4. **Entrega** — PDF por peça ou um PDF único, ficha de produção em `.csv` e o
   pedido completo em `.json`.

## O que o PDF tem

- Página no tamanho final com `TrimBox` e `BleedBox`.
- Marcas de corte e de centro vetoriais, fora da sangria.
- Legenda técnica no rodapé (peça, medida, sangria, escala, dpi).
- Escala 1:1; peças que passam do limite de página do PDF (14.400 pt) saem em
  escala reduzida, indicada na legenda e na ficha.

## Limites conhecidos

- A arte é uma imagem **RGB** (JPEG). Conversão para CMYK e cores especiais
  ficam com a gráfica.
- Texto sai rasterizado junto com a arte, não como vetor.
- A resolução é limitada pelo navegador (12.000 px por lado, 60 MP); a aba
  Entrega mostra o dpi que cada peça realmente atinge.
- Não há servidor: tudo fica no navegador (IndexedDB). Para trocar pedidos
  entre shopping e central, use exportar/importar.
- Não gera imagem nem texto por IA: o layout é feito por regras.
- Os clusters iniciais são rascunhos: cores e fontes são propostas, personas e
  conceito estão marcados como `[FALTA]`.

## Arquivos

```
index.html, estilo.css
js/layout.js   motor de layout (recompõe o KV em qualquer proporção)
js/pdf.js      gerador de PDF de impressão, sem dependências
js/app.js      interface, estado e exportação
```
