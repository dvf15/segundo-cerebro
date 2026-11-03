---
title: "claude/prompt-modelo-3d.md"
date: 2026-11-02
source: "claude-project-doc"
source_id: "711c33d0-9940-427a-ae35-5817a246f8a9"
project: "Obra Casa 4"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/prompt-modelo-3d.md

# Prompt — modelo 3D editável da Casa 4 a partir dos arquivos de ARQUITETURA

## Pré-requisito (uma vez, no seu PC)
O DWG é binário (AC1032) e nenhuma biblioteca gratuita lê esse formato com confiabilidade. Converter para DXF com o **ODA File Converter** (gratuito, opendesign.com → Downloads → ODA File Converter): pasta de entrada = `ARQUITETURA\DWG`, saída = `ARQUITETURA\DXF`, versão "2018 ASCII DXF". Gera `BAMBU-PLA-LO-0000-PRO-R03.dxf`.

Sem plugin ou conector: tudo roda com bibliotecas Python open source (ezdxf, ifcopenshell, trimesh) que o Claude instala sozinho. Blender (gratuito) é o editor; D5 Render Community ou Twinmotion, o renderizador.

## Prompt (copiar e colar, com a pasta ARQUITETURA vinculada ou o DXF anexado)

```
Construa um modelo 3D editável da Casa 4 a partir dos arquivos da pasta ARQUITETURA (vinculada a esta conversa) ou do DXF anexado.

FONTES
- DXF/BAMBU-PLA-LO-0000-PRO-R03.dxf (todas as pranchas em um único arquivo; unidade provável: metros ou centímetros — confirme pela cota de uma porta ≈ 0,80–0,90 m)
- PDF/BAMBU-PRO-LO-0001-EXI-R03.pdf: pés-direitos (laje P.D. 2,98/3,02/3,04 m; viga 2,62 m) e alturas de peitoris
- PDF/BAMBU-PRO-LO-0003-CIV-R03.pdf: alvenarias novas, quadro de caixilharia (código, largura, altura, peitoril)
- PDF/BAMBU-PRO-LO-0005-FOR-R03.pdf: forros, sancas, posição e tipo de cada luminária (LT/LP/PL/LA/LS)
- PDF/BAMBU-PRO-LO-0007-LAY-R03.pdf: layout de mobiliário
- PLANILHA DE ESPECIFICAÇÕES/*.xlsx: acabamento por ambiente (piso, parede, teto, rodapé)
- 3D ORIENTATIVO/*.jpeg: referência visual (não usar como geometria)

PASSOS
1. Inventário do DXF com ezdxf: liste layers, blocos, quantidade de entidades por layer e a extensão (bounding box) de cada "ilha" de desenho. Identifique qual ilha é a planta do pavimento térreo e qual é a do 1º pavimento (há pranchas de existente, demolição, civil, piso, forro, pontos e layout — use a de CIVIL/PISO como base de paredes). Antes de modelar, me mostre a lista de layers e a sua interpretação (paredes existentes, paredes novas, demolir, esquadrias, mobiliário, texto) e aguarde minha confirmação.
2. Geometria: feche os contornos de parede (polilinhas/linhas nos layers de alvenaria) em polígonos com shapely; corrija pequenas frestas (tolerância 1–2 cm). Separe paredes existentes de novas e exclua as de demolição. Identifique os ambientes pelos textos de nome (SALA, COZINHA, SUÍTE etc.) dentro de cada polígono fechado.
3. Alturas: extruda cada parede até o pé-direito do pavimento (EXI-R03). Lajes de piso e teto por pavimento. Aberturas (portas/janelas) com as dimensões do quadro de caixilharia do CIV-R03; se um vão não casar com a tabela, deixe o vão e registre na lista de pendências.
4. Forro: rebaixos de gesso (FO01/FO04/FO05) e sancas conforme FOR-R03, com a cota de forro da prancha; se a cota não estiver legível, use P.D. − 0,15 m e marque como estimado.
5. Luminárias: um ponto por luminária na posição da prancha FOR-R03, com atributos código (LT.01…), tipo, fluxo (lm), potência (W), ângulo e 2.700 K. Perfis LP/PL como segmentos com comprimento.
6. Mobiliário: caixas (bounding box) com nome, a partir dos blocos do LAY-R03 — só para escala, não para render.
7. Materiais: atribua a cada superfície o código da planilha (PI03, PA02, FO01…) como nome do material, com cor base aproximada.

SAÍDAS (todas na pasta MODELO_3D ao lado de ARQUITETURA, ou enviadas como arquivos)
- casa4.ifc (IfcWall, IfcSlab, IfcDoor, IfcWindow, IfcCovering para forros, IfcLightFixture com os atributos acima, IfcSpace por ambiente) — para DIALux evo, Blender/Bonsai, Revit, Archicad
- casa4.glb e casa4.obj (+ .mtl) com um objeto por parede/laje/forro/móvel, nomeados "Pavimento/Ambiente/Elemento/Material" — para Blender, D5 Render e Twinmotion
- casa4_luminarias.csv: código, ambiente, x, y, z, tipo, lm, W, ângulo
- casa4_pendencias.md: tudo que foi estimado ou não bateu com as pranchas, e a lista de layers interpretados

VERIFICAÇÃO (obrigatória antes de entregar)
- Renderize 3 imagens de checagem com trimesh/pyrender ou matplotlib: planta de cada pavimento sobreposta ao DXF original, e uma perspectiva axonométrica; me mostre.
- Confira 5 medidas contra as pranchas (largura da sala, da cozinha, da suíte, P.D. térreo, uma porta) e reporte a diferença em cm.
- Conte as luminárias por código e compare com a coluna QUANTIDADES da FOR-R03.

LIMITES
- Não invente geometria que não esteja no DXF. Escada, cobertura de vidro e piscina: só se houver linhas claras; senão, listar em pendências.
- Se o DXF não estiver disponível e só houver o DWG, pare e me peça a conversão com o ODA File Converter.
```

## Depois do modelo
1. Abrir `casa4.glb` no Blender (File → Import → glTF) para ajustes manuais; exportar FBX para o D5/Twinmotion.
2. Abrir `casa4.ifc` no DIALux evo (Importar IFC) e colar as luminárias reais (IES do fornecedor) para lux e cenas.
3. No D5/Twinmotion, trocar os materiais pelos links da planilha e testar as pendências (cor PA02, pedra do painel TV, pendentes LT.09/10/14).

## Expectativa realista
O resultado é um modelo "massa branca" preciso em geometria (paredes, lajes, forros, vãos, posições de luminária), não o modelo texturizado da Bambu. Para o visual fiel aos renders, o caminho mais curto continua sendo pedir o arquivo nativo à Bambu; este modelo serve como base própria e para luminotécnica.

