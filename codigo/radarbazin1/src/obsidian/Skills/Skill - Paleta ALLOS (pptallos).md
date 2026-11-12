---
tags: [projeto/clausulas, skill, design, allos]
aliases: [pptallos, Paleta ALLOS]
name: pptallos
description: Padroniza a paleta de cores oficial Allos sempre que o usuário pedir uma apresentação PowerPoint (.pptx) no "padrão Allos". Acionar com "padrão Allos", "estilo Allos", "apresentação Allos", "PPT Allos", "slides Allos". Usar SEMPRE junto da skill de geração de artefatos.
---

# Skill — Paleta ALLOS (pptallos)

> [!info]
> Skill no formato Claude Code (ver frontmatter `name`/`description`). Usar junto de [[Skill - Geração de Artefatos (pptx, xlsx, pdf)]].

## Regra fundamental
Usar **exclusivamente** as cores da paleta abaixo. Nada de azul Office nem cinza padrão. Para variação, prefira variar opacidade a introduzir cor nova.

## Paleta oficial
| Cor | HEX | Papel |
|---|---|---|
| Petróleo escuro | `#00616F` | Primária — títulos, cabeçalhos, marca |
| Verde-escuro / quase preto | `#0D454A` | Texto sobre claro; fundos escuros; footers |
| Teal médio | `#368C82` | Secundária — subtítulos, ícones, destaques |
| Vermelho coral | `#CD5151` | Alertas, queda, dados negativos |
| Verde menta | `#6CC680` | Sucesso, crescimento, dados positivos |
| Laranja / âmbar | `#EDA754` | Destaques, KPIs, atenção média |
| Bege claro | `#CCC5BC` | Bordas, divisores, neutros |
| Areia / off-white | `#E5DED4` | Fundos claros, cards, respiro |

## Aplicação
- **Títulos**: `#00616F` sobre claro; `#E5DED4` sobre escuro.
- **Corpo**: `#0D454A` sobre claro; `#E5DED4`/`#CCC5BC` sobre escuro.
- **Subtítulos/destaque suave**: `#368C82`.
- **Fundos**: claro `#FFFFFF`/`#E5DED4`; escuro/capa `#0D454A`/`#00616F`.
- **Cards**: fundo `#E5DED4`, borda `#CCC5BC`, texto `#0D454A`.
- **Semântica de valor**: positivo→`#6CC680`, negativo→`#CD5151`, atenção→`#EDA754`.
- **Ordem de séries em gráficos**: petróleo → âmbar → teal → coral → menta → bege.

## Snippet python-pptx
```python
from pptx.dml.color import RGBColor
ALLOS_PETROLEO     = RGBColor(0x00,0x61,0x6F)
ALLOS_VERDE_ESCURO = RGBColor(0x0D,0x45,0x4A)
ALLOS_TEAL         = RGBColor(0x36,0x8C,0x82)
ALLOS_CORAL        = RGBColor(0xCD,0x51,0x51)
ALLOS_MENTA        = RGBColor(0x6C,0xC6,0x80)
ALLOS_AMBAR        = RGBColor(0xED,0xA7,0x54)
ALLOS_BEGE         = RGBColor(0xCC,0xC5,0xBC)
ALLOS_AREIA        = RGBColor(0xE5,0xDE,0xD4)
ALLOS_SERIES = [ALLOS_PETROLEO, ALLOS_AMBAR, ALLOS_TEAL, ALLOS_CORAL, ALLOS_MENTA, ALLOS_BEGE]
ALLOS_POSITIVO, ALLOS_NEGATIVO, ALLOS_ATENCAO = ALLOS_MENTA, ALLOS_CORAL, ALLOS_AMBAR
```

## Checklist antes de entregar
- [ ] Toda cor está na paleta (sem azul Office / cinza padrão).
- [ ] Títulos em `#00616F` (claro) ou `#E5DED4` (escuro).
- [ ] Gráficos seguem a ordem de séries.
- [ ] Positivo/negativo usam menta/coral.
- [ ] Fundos neutros usam `#E5DED4`/`#CCC5BC`.

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
