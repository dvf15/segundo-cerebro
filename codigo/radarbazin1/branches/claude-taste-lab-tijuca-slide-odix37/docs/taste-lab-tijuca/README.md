# Slide — Taste Lab Tijuca (Highlights · uso interno ALLOS)

Slide único para apresentação interna da ALLOS com os highlights do Taste Lab Tijuca.

- `Taste-Lab-Tijuca-Highlights.pptx` — slide editável (PowerPoint/Keynote/Google Slides).
- `preview.png` — pré-visualização do layout.
- `build_slide.py` — gera o `.pptx` (requer `python-pptx`).

## Características

- **Paleta oficial ALLOS** (skill `pptallos`): petróleo `#00616F`, verde-escuro
  `#0D454A`, teal `#368C82`, âmbar `#EDA754`, bege `#CCC5BC`, areia `#E5DED4`.
- **Texto em caixa editável** com todos os bullets — os marcadores
  `X` / `x,x` / `xx` / `xxx` foram **mantidos de propósito** para preenchimento
  dos dados sensíveis antes de apresentar.
- **Área reservada para imagem** oficial do Taste Lab Tijuca (substituir o
  placeholder pela foto pública do espaço gastronômico).

## Observações

- **Fonte:** a constante `FONT` em `build_slide.py` usa `Poppins` como
  substituto limpo. Se houver a fonte oficial da marca ALLOS instalada, basta
  trocar o valor e regenerar.
- Não foi possível embutir uma foto oficial automaticamente (os sites da ALLOS /
  Shopping Tijuca bloqueiam download direto). Inserir a imagem manualmente no
  espaço reservado.

## Regenerar

```bash
pip install python-pptx
python3 build_slide.py
```
