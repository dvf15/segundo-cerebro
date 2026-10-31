# Base fictícia de testes — Radar de Varejo

Arquivos para o time experimentar o app sem mexer em dados reais:

| Arquivo | Para quê | Como usar |
|---|---|---|
| `radar-varejo-base-teste.json` | 17 leads, 10 pontos do shopping (com mix e marcas indicadas), parâmetros e dados do shopping | No app, aba **Leads › Importar**. Substitui o que está no aparelho: faça um **Backup** antes se tiver dados reais |
| `radar-varejo-base-teste.xlsx` | A mesma base em Excel: leads (31 colunas, como o CSV do app), casos de teste, pontos, parâmetros, shopping e as 3 fichas | Para consultar, filtrar e conferir resultados; o app importa o `.json` |
| `fichas-para-receber.txt` | 3 fichas de lojista, como chegam pelo WhatsApp | Copie o bloco de uma ficha (pode ser a mensagem inteira) e cole em **Triagem › Receber resposta › Lançar no banco** |

Tudo é inventado: nomes, telefones, empresas e o "Shopping Horizonte" (Campinas). As marcas citadas são as da base de referência do app.

## O que cada lead testa

A coluna "Caso de teste" também está nas **notas** de cada lead dentro do app.

| Lead | Caso | Onde ver |
|---|---|---|
| Mariana Lopes | Franqueada clássica: Cacau Show em mente, cabe no capital, segmento no mix da Q-03 | Triagem: saída A, Cacau Show em 1º com "citada"; Cruzamento: candidata da Q-03 |
| Dr. Henrique Sato | Marca própria com nome: o app avalia a marca dele, não sugere outras | Abrir na triagem: "Avaliação da marca própria"; está em Proposta |
| Carlos Andrade | Investidor sem operação: capital alto, dedicação baixa, contrata gerente | Saída B; banner "Enquadramento × perfil" |
| Vanessa Prado | Capital abaixo do mínimo para quiosque | Standby; abrir na triagem: aviso "Capital abaixo do mínimo" apontando para os parâmetros |
| Rafael Nunes | Quer chocolates em loja, mas a L-310 já tem Cacau Show Loja e nenhuma vaga de loja pede chocolates | Aviso "Ranking × interesse": outro segmento sobe |
| Beatriz Carvalho | Lacuna da base: livraria em quiosque não existe na base | Aviso "Lacuna da base" |
| Gustavo Ferreira | Pede cosméticos em quiosque; nenhum quiosque vago pede cosméticos; a Biscoitê indicada na Q-03 sobe | Aviso "Ranking × interesse" com a melhor opção em cosméticos |
| Paula Mendes | Marca indicada vence: Biscoitê (procura investidor) em 1º com ★ | Triagem: bloco "Marcas indicadas pelo shopping"; Cruzamento Q-03 |
| Jorge Ribeiro | Giro maior que a implantação (valores trocados) | Abrir na triagem e recalcular: "Confira com o lead"; etiqueta "triagem indicou Standby" na aba Leads |
| Eduarda Ferreira | Ticket de R$ 4 mil com R$ 10 mil de faturamento | "Confira com o lead": 3 vendas por mês |
| Kleber Silva | Rede de franquia marcada como marca própria; celular sem o 9 | "Confira com o lead": sugere marcar Franqueado |
| Grupo Aventura Franquias | Multifranqueado, megaloja, entretenimento (mix da M-01) | Saída A em megaloja; Cruzamento M-01 |
| Lucas Tavares | Marca em criação, sem material, dedicação parcial | Diagnóstico: notas de marca em criação e de material |
| Daniela Zanola | Parada há mais de 7 dias em Viabilidade | Aba Leads: etiqueta vermelha; filtro "Parados há +7 dias" |
| Juliana Prado | Interesse em outros shoppings da Allos na região | Cartão "Também: …"; nota inicial; briefing com lembrete |
| Renato Souza | Fechado | Fora do funil e do Cruzamento |
| Fábio Monteiro | Descartado | Idem; filtro de status |

## Planejamento que vem junto

- Shopping Horizonte · Campinas / SP · site com página de lojas · raio 2–50 km · outros shoppings da região: Shopping Vale Verde e Shopping Estação Norte (aparecem na ficha do lojista).
- 10 pontos: 7 vagos (3 quiosques, 3 lojas satélite, 1 megaloja) e 3 ocupados (Morana, O Boticário, Cacau Show Loja).
- Marcas indicadas: Biscoitê (procura investidor) na Q-03; Monreale (quer entrar) na Q-08; Anacapri (quer entrar) na L-118; Track&Field (aderente) na L-232.
- Parâmetros padrão. Para testar o aviso de capital abaixo do mínimo de outro jeito, baixe a implantação de quiosque em **Planejamento › Parâmetros** e recalcule a Vanessa.

## Roteiros rápidos

1. **Ficha de ponta a ponta:** Triagem › Enviar ficha › abra o link em outra aba › preencha › copie o código › Receber resposta.
2. **Fichas prontas:** cole cada bloco de `fichas-para-receber.txt`. A de Thiago Moreira mostra o nome da marca vindo do campo empresa; a de Simone Alves cai em saída B.
3. **Follow-up:** Leads › filtro "Parados há +7 dias" (Daniela) e "Estágio ≠ triagem" (Jorge, Eduarda).
4. **Briefing:** Leads › Briefing da vacância › "Base completa" › Copiar.
5. **Prompts:** Planejamento › Prompts de mapeamento › escolha o modelo (Copilot ou os demais) › um tipo de busca › Copiar ou Baixar.
6. **Ficha repetida:** cole a mesma ficha de `fichas-para-receber.txt` duas vezes. Na segunda, o app pergunta se atualiza o lead existente em vez de duplicar.
7. **Backup de colega:** Leads › Backup gera o `.json`; importe-o de volta e veja o shopping, a região e os pontos do Planejamento atualizados.
8. **Exportar:** Leads › Excel (CSV) gera `radar-varejo-leads-shopping-horizonte.csv`, pronto para a planilha de acompanhamento.

Para voltar ao estado inicial, importe o `.json` de novo.
