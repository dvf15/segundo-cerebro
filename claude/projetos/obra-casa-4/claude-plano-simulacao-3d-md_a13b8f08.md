---
title: "claude/plano-simulacao-3d.md"
date: 2026-10-31
source: "claude-project-doc"
source_id: "a13b8f08-0963-45af-8777-8cc991ef5ffa"
project: "Obra Casa 4"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/plano-simulacao-3d.md

# Plano de simulação 3D — Casa 4 (luminárias, cores, móveis)

Base: inventário da pasta `Obra/Projeto/ARQUITETURA` em 31/10/2026.

## O que existe na pasta

| Pasta | Conteúdo | Uso na simulação |
|---|---|---|
| `3D ORIENTATIVO` | 21 renders fotorrealistas (JPEG via WhatsApp, 27/04/2026): sala/painel TV, escritórios Daniel e Renata, suíte, banhos, lavabo, cozinha, churrasqueira, piscina/deck/sauna | Prova que a Bambu tem modelo 3D texturizado — o arquivo nativo **não está na pasta** |
| `DWG` | `BAMBU-PLA-LO-0000-PRO-R03.dwg` (AutoCAD 2018+, 23 MB) + R00–R02 em SUPERADOS | Base 2D para modelar, se o nativo não vier |
| `PDF` | 13 pranchas R03 (A0, 1:50): 0001 existente, 0002 demolição, 0003 civil, 0004 piso, 0005 forro/luminotécnica, 0006/0006A pontos, 0007 layout, 1001–1006 detalhes | Alturas (PD 2,62–3,04 m), forros, posição e tipo de cada luminária |
| `PLANILHA DE ESPECIFICAÇÕES` | Abas acabamentos (por ambiente, com links), equipamentos, quantitativo metais | Materiais com referência de fabricante para texturizar |

Revisões (carimbo): R00 23/04/2026 liberado p/ obra · R01 07/05 sauna, porta camarão, ar-cond. · R02 19/05 pontos, churrasqueira, lavanderia · R03 03/06 registros, metais, adega. Os renders são anteriores ao R01 — o modelo da Bambu pode estar defasado em relação ao R03.

## Definido (só texturizar) × A definir (onde a simulação decide)

**Definido**
- Pisos: madeira existente (Bona) na sala/suíte/escritórios/closet; Eliane Khali Off White 90×90 (cozinha/externa) e 70×70 (serviço/terraços); Portinari Opera White 90×90 (banhos); Portinari Timeless White 100×100 (lavabo); deck de madeira; Aubicon preto (academia)
- Pedras: quartzito Taj Mahal (bancadas cozinha, churrasqueira, banhos; painel PA07); granito Branco Itaúnas (serviço)
- Parede da lareira: Portobello Aeterna Avorio 120×270
- Forros: gesso liso branco (acrílico fosco / epóxi em áreas molhadas); sanca LS.01 cortineiro
- Luminárias técnicas (todas 2.700 K): LT.01 embutir direcionável 25° 525 lm PAR20 5,5 W · LT.05 quadrada 25° 380 lm 6 W dim TRIAC · LT.08 difusa 120° 1.600 lm 20 W · LT.12 direcionável 36° 500 lm · LT.13 difusa 900 lm 12 W · perfis LP 9,6 W/m 1.000 lm/m · perfis PL em marcenaria 5 W/m 500 lm/m · LA.06 arandela IP65 740 lm · balizador 48 lm
- Equipamentos aprovados (cooktop, forno, coifa, geladeira, parrilha Caixa de Fogo, sauna etc.)

**A definir — prioridade de simulação**
1. Cor das paredes (PA02 "cor a definir") em praticamente todos os ambientes
2. Pedra clara do painel + nicho da TV (PA03) e rodabanca da cozinha — aguardando lote na marmoraria
3. Pendentes LT.09 (máx. 20 W), LT.10 (máx. 50 W), LT.14 (máx. 20 W) — "em definição"
4. Arandela decorativa LA.01, abajures LA.04/LA.05
5. Papel de parede do lavabo (PA11); papel imantado escritório Daniel (PA10); arte escritório Renata (PA09)
6. TV, telão e projetor da sala (EQ-12/13/14)
7. Móveis soltos (sofá, jantar, camas, poltronas) — não constam na planilha
8. Paisagismo (a cargo do fornecedor)

## Caminho recomendado (do mais fiel ao mais rápido)

1. **Pedir à Bambu o modelo nativo** (.skp/.max/.3dm + cena do render + materiais). Argumento: já existe (renders de 27/04). Se houver recusa por propriedade intelectual, pedir exportação .fbx/.obj com texturas. Avisar que o R03 mudou sauna, churrasqueira, lavanderia e porta camarão.
2. **Sem o nativo:** modelar no SketchUp a partir do DWG R03 (importa DWG) com as alturas da prancha 0001-EXI. Orçar com modelador freelancer.
3. **Renderizador:** D5 Render Community (Windows + GPU RTX, grátis p/ uso pessoal) ou Twinmotion (Mac, sem path tracer). Texturas pelos links da planilha; luminárias com IES.
4. **Luminotécnica:** as LT não têm marca nas pranchas → pedir à Bambu os IES/LDT das luminárias especificadas. DIALux evo (grátis) para lux/uniformidade; D5/Twinmotion para o visual.
5. **Cores:** render para comparar opções; decisão final com amostra na parede real, sob a luz 2.700 K.
6. **As-built:** scan LiDAR (iPhone Pro + Polycam) quando a alvenaria estiver pronta, para conferir painel TV, churrasqueira e marcenaria.

## Pendências
- [ ] Hardware disponível (PC com NVIDIA RTX? Mac? iPhone Pro?)
- [ ] E-mail à Bambu pedindo modelo 3D + IES das luminárias
- [ ] Definir se usa D5 (Windows) ou Twinmotion (Mac)

