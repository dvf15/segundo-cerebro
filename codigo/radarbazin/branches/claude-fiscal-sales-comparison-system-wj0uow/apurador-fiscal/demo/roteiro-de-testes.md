# Roteiro de testes — base fictícia do Radar de Auditoria

Gerada em 27/10/2026. 40 lojistas inventados; os 27 cenários abaixo são fixos (sempre iguais), os demais lojistas são aleatórios para dar volume.

| # | Loja | CNPJ | Processo | O que deve aparecer | Onde |
|---|---|---|---|---|---|
| 1 | Bela Cosméticos | 11.222.333/0001-81 | Auditoria fiscal | Ciclo completo: recebido, apurado, negociado e cobrado (R$ 36.000) | Painel · Dashboard |
| 2 | Bela Cosméticos | 11.222.333/0001-81 | Triangulação | DISPERSO em 09/2026: PDV acima da redução Z (alerta grave) | Triangulação · Dashboard |
| 3 | Bela Cosméticos | 11.222.333/0001-81 | Societário | TT confirmada este mês, 1ª notificação devida (R$ 15.000) | Societário · Notificações |
| 4 | Bela Cosméticos — quiosque | 11.222.333/0002-62 | Auditoria fiscal | Livro recebido, aguardando apuração — carregue os livros de demo/ e ele vira AUDITADO sozinho | Auditoria fiscal · Painel |
| 5 | Bela Cosméticos — quiosque | 11.222.333/0002-62 | Societário | Triagem sem indício de TT | Societário |
| 6 | Café Aurora | 69.781.682/0001-13 | Auditoria fiscal | Livro não recebido, três notificações feitas, próxima etapa devida | Notificações |
| 7 | Trilha & Cia | 47.231.337/0001-73 | Auditoria fiscal | Livro não recebido, multa enviada | Notificações · Painel (multados) |
| 8 | Ótica Horizonte | 18.637.317/0001-07 | Auditoria fiscal | Livro não recebido, só a 1ª notificação: etapas acumuladas | Notificações |
| 9 | Brinquedos Pipa | 66.681.907/0001-71 | Auditoria fiscal | Apurado com divergência de R$ 18.400, aguardando negociação | Dashboard (pendências) |
| 10 | Casa Linho | 80.926.487/0001-77 | Auditoria fiscal | Negociado (R$ 8.000), aguardando cobrança | Dashboard (pendências) |
| 11 | Studio Vinil | 73.624.117/0001-10 | Auditoria fiscal | Livro não recebido, sem e-mail nem WhatsApp, nenhuma notificação | Notificações |
| 12 | Sabor da Serra | 88.967.134/0001-27 | Cadastro | Sem UF e sem início do contrato: a Junta não abre e a aba avisa | Societário · Lojistas |
| 13 | Vértice Calçados | 24.538.526/0001-98 | Societário | Indício na triagem, guia a pagar | Societário · Dashboard |
| 14 | Lume Joias | 17.385.654/0001-83 | Societário | Certidão paga, aguardando download | Societário · Dashboard |
| 15 | Pão de Ló Confeitaria | 32.185.023/0001-04 | Societário | Alteração de capital ANTERIOR ao início do contrato: não é TT | Societário |
| 16 | Urbano Moda Masculina | 56.288.060/0001-06 | Societário | Outra alteração (endereço): não é TT | Societário |
| 17 | Flor de Sal | 28.428.793/0001-63 | Societário | Mudança marcada sem a data: "informe a data da alteração" | Societário |
| 18 | Mundo Pet Center | 80.230.013/0001-96 | Societário | Troca de administrador há 3 meses: sinalizado, aguardando validação | Societário · Dashboard |
| 19 | Ateliê Brisa | 12.673.096/0001-38 | Societário | Alteração dentro do limite contratual: isento | Societário |
| 20 | Tech Point Celulares | 94.810.329/0001-61 | Societário | TT em cobrança há 3 meses com só a 1ª notificação: etapas acumuladas (R$ 22.000) | Societário · Notificações |
| 21 | Livraria Página 9 | 47.484.133/0001-44 | Societário | TT negociada (R$ 14.500 de R$ 18.000) | Societário · Dashboard |
| 22 | Doce Lima Sorvetes | 37.304.836/0001-90 | Societário | TT cobrada (R$ 27.000), alteração há 9 meses | Societário · Dashboard |
| 23 | Nuvem Kids | 24.806.316/0001-33 | Triangulação | Só a redução Z no mês: FONTE ÚNICA | Triangulação (histórico) |
| 24 | Forma Academia Store | 66.152.371/0001-05 | Triangulação | Sem Z nem PDV no mês de referência | Dashboard (pendências) |
| 25 | Raiz Natural | 79.153.668/0001-29 | Triangulação + Societário | Z, PDV, NAPP e declarado variam R$ 50: COERENTE; sem mudança societária; checklist completo | Triangulação · Societário |
| 26 | Farol Óculos | 16.105.826/0001-55 | Triangulação | NAPP é o maior valor em 09/2026 (R$ 104.500): R$ 6.500 acima do declarado, DISPERSO | Triangulação (histórico) · Dashboard |
| 27 | Estação Games | 32.126.452/0001-00 | Cadastro | Lojista inativo: fora do painel, das notificações e do dashboard | Lojistas |
