---
name: pptallos
description: Padroniza a paleta de cores oficial Allos sempre que o usuário pedir uma apresentação PowerPoint (.pptx) no "padrão Allos". Acionar quando o usuário disser "padrão Allos", "no padrão da Allos", "estilo Allos", "apresentação Allos", "PPT Allos", "slides Allos" ou contexto equivalente. Use SEMPRE em conjunto com a skill `pptx` — esta skill fornece apenas a paleta e as regras de aplicação; a construção técnica do arquivo continua sendo feita pela skill pptx.
---

# pptallos — Paleta oficial Allos para apresentações .pptx

Esta skill define a paleta de cores que deve ser usada em qualquer apresentação criada no padrão Allos. Use em conjunto com a skill `pptx` (responsável pela criação técnica do arquivo).

## Regra fundamental

Usar **exclusivamente** as cores da paleta abaixo. Nada de azul Office, cinza padrão do PowerPoint, ou cores fora da lista. Se precisar de mais variação, prefira variar opacidade/transparência das cores existentes a introduzir cor nova.

## Paleta oficial

| Cor | HEX | Papel sugerido |
|---|---|---|
| Petróleo escuro | `#00616F` | Cor primária — títulos, cabeçalhos, elementos de marca |
| Verde-escuro / quase preto | `#0D454A` | Texto principal sobre fundos claros; fundos escuros; footers |
| Teal médio | `#368C82` | Cor secundária — subtítulos, ícones, destaques moderados |
| Vermelho coral | `#CD5151` | Alertas, queda, dados negativos |
| Verde menta | `#6CC680` | Sucesso, crescimento, dados positivos |
| Laranja / âmbar | `#EDA754` | Destaques, KPIs, dados de atenção média |
| Bege claro | `#CCC5BC` | Bordas, divisores, elementos neutros, séries secundárias |
| Areia / off-white | `#E5DED4` | Fundos claros, áreas de respiro, cards |

## Como aplicar

### Texto
- **Títulos**: `#00616F` sobre fundo claro; `#E5DED4` sobre fundo escuro.
- **Corpo**: `#0D454A` sobre fundo claro; `#E5DED4` ou `#CCC5BC` sobre fundo escuro.
- **Subtítulos / destaque suave**: `#368C82`.

### Fundos
- Fundo claro padrão: branco `#FFFFFF` ou areia `#E5DED4`.
- Fundo escuro / capa: `#0D454A` ou `#00616F`.
- Evite cinza padrão do PowerPoint — sempre `#E5DED4` ou `#CCC5BC` quando precisar de fundo neutro.

### Gráficos
Ordem padrão para séries de dados (do mais importante para o menos):
1. `#00616F` (petróleo)
2. `#EDA754` (âmbar)
3. `#368C82` (teal)
4. `#CD5151` (coral)
5. `#6CC680` (menta)
6. `#CCC5BC` (bege)

Quando o gráfico tiver semântica de valor:
- Positivo / alta / meta atingida → `#6CC680`
- Negativo / queda / alerta → `#CD5151`
- Neutro / atenção média → `#EDA754`

### Elementos visuais
- Linhas divisórias e bordas: `#CCC5BC`.
- Caixas de destaque / cards: fundo `#E5DED4`, borda `#CCC5BC`, texto `#0D454A`.
- Ícones: `#00616F` ou `#368C82`.

## Snippet python-pptx

Quando gerar o arquivo via python-pptx, incluir no topo do script:

```python
from pptx.dml.color import RGBColor

# Paleta Allos
ALLOS_PETROLEO     = RGBColor(0x00, 0x61, 0x6F)  # #00616F
ALLOS_VERDE_ESCURO = RGBColor(0x0D, 0x45, 0x4A)  # #0D454A
ALLOS_TEAL         = RGBColor(0x36, 0x8C, 0x82)  # #368C82
ALLOS_CORAL        = RGBColor(0xCD, 0x51, 0x51)  # #CD5151
ALLOS_MENTA        = RGBColor(0x6C, 0xC6, 0x80)  # #6CC680
ALLOS_AMBAR        = RGBColor(0xED, 0xA7, 0x54)  # #EDA754
ALLOS_BEGE         = RGBColor(0xCC, 0xC5, 0xBC)  # #CCC5BC
ALLOS_AREIA        = RGBColor(0xE5, 0xDE, 0xD4)  # #E5DED4

# Ordem padrão de séries de gráfico
ALLOS_SERIES = [
    ALLOS_PETROLEO, ALLOS_AMBAR, ALLOS_TEAL,
    ALLOS_CORAL, ALLOS_MENTA, ALLOS_BEGE,
]

# Semântica de valor
ALLOS_POSITIVO = ALLOS_MENTA
ALLOS_NEGATIVO = ALLOS_CORAL
ALLOS_ATENCAO  = ALLOS_AMBAR
```

## Checklist antes de entregar

- [ ] Toda cor usada está na paleta Allos (sem azul Office, sem cinza padrão).
- [ ] Títulos em `#00616F` (fundo claro) ou `#E5DED4` (fundo escuro).
- [ ] Gráficos seguem a ordem de séries definida.
- [ ] Dados positivos/negativos usam menta/coral corretamente.
- [ ] Fundos neutros usam `#E5DED4` ou `#CCC5BC`, não cinza padrão do PPT.
