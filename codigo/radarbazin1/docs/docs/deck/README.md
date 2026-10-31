# Deck "NutriTreino — Do problema ao produto"

Apresentação da evolução do produto.

- `../NutriTreino-Evolucao.pptx` — versão editável (PowerPoint/Keynote/Google Slides).
- `../NutriTreino-Evolucao.pdf` — versão para visualização em qualquer aparelho.

## Como regenerar

- `build_deck.py` — gera o `.pptx` (requer `python-pptx` e os assets de imagem).
- `build_pdf.py` — gera o `.pdf` (requer `reportlab`, `Pillow` e os assets).

As capturas de tela (`sc/`) **não são versionadas** por conterem dados
pessoais/exames; os ícones e screenshots ficam fora do repositório. Os scripts
esperam os assets em `/tmp/sc` e `/tmp/ic`.
