# Análise de risco — Grupo Casas Bahia (agosto/2026)

Deck de apoio à decisão para uma empresa de shopping centers com lojas da rede no portfólio.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `Analise-Risco-Casas-Bahia.pptx` | Deck final, 23 slides, 16:9 |
| `gerar-deck.js` | Gerador (pptxgenjs). `npm i pptxgenjs && node gerar-deck.js saida.pptx` |

## Estrutura do deck

1. Capa
2. Sumário executivo — probabilidades e as quatro leituras principais
3. Histórico recente — linha do tempo 2019 → 1S/2026
4. Decisões estratégicas erradas dos últimos anos
5. Venda de ativos e parcerias estratégicas — o que sinalizam ao locador
6. Resultado do 2T26 — prejuízo contábil vs. prejuízo ajustado, composição dos não recorrentes
7. Radiografia de solvência — PL negativo, capital de giro, abstenção da EY
8. Notícias recentes de agosto de 2026
9. Cinco cenários com probabilidade estimada
10. Exposição por administradora de shopping
11. Mecânica jurídica — RE vs. RJ vs. falência sob a ótica do locador
12. Despejo, essencialidade e stay period
13. Os oito riscos de quem loca imóvel à rede
14. Precedente de mercado — renegociação do HSLG11
15. Segmentos em crescimento — para onde a demanda por ABL está indo
16. Pipeline de reocupação para 600 a 1.200 m²
17. Três arranjos de ocupação para um vão de 1.000 m²
18. Playbook 30 / 60 / 90 dias
19. Matriz de decisão por tipo de loja (A / B / C)
20. Cláusulas e garantias a exigir em repactuação
21. Painel de gatilhos de monitoramento
22. Recomendação
23. Fontes e ressalvas

## Base factual

Divulgação de resultados do 2T26 (14/08/2026) e relatório de revisão da EY; noticiário de
agosto de 2026 sobre o fechamento de 298 lojas e os desligamentos; homologação da recuperação
extrajudicial de junho de 2024 e reperfilamento posterior das debêntures; fato relevante do
HSI Logística FII (HSLG11) sobre renegociação de contratos de locação; jurisprudência do STJ
sobre despejo e recuperação judicial e Lei 11.101/2005. Para os blocos novos: aquisições de
2020-2022 (ASAP Log, banQi, i9XP, Distrito, CNT), sale and leaseback de sete imóveis próprios,
parcerias com Mercado Livre, Amazon e Shopee e a plataforma CB Full; perfil de portfólio por
administradora de shopping segundo o Bradesco BBI; faturamento e projeção do setor pela Abrasce;
e planos de expansão públicos de Smart Fit, Petz-Cobasi, Decathlon, Renner/Camicado e dr.consulta.

O ranking de exposição por administradora é uma leitura de perfil de portfólio, não uma contagem
de contratos — nenhuma companhia divulga publicamente quantas lojas da rede opera. As faixas de
ABL do slide de pipeline são estimativas de mercado por formato, não dados publicados pelas redes.

As probabilidades de cenário são estimativas do analista a partir de informações públicas
disponíveis até 16/08/2026, não são projeções oficiais da companhia, e o documento não
constitui recomendação de investimento nem parecer jurídico.

## Verificação aplicada

- `validate.py` do skill `pptx` — schema, relacionamentos, content types e gráficos: aprovado
- Checagem geométrica de margens, sobreposição e estimativa de overflow de texto
- Inspeção visual slide a slide via render aproximado (o LibreOffice do ambiente de build não
  carrega arquivos e não pôde ser usado para o render de referência)
