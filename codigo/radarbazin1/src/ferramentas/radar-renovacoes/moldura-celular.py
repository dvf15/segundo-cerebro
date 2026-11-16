# Desenha a moldura de celular (900x1900) e a máscara de cantos da tela (780x1688). Uso: python3 moldura-celular.py <pasta>
import sys, os
from PIL import Image, ImageDraw
d = sys.argv[1]
W, H = 900, 1900
img = Image.new('RGB', (W, H), (18, 28, 31))
dr = ImageDraw.Draw(img)
for y in range(H):  # fundo com leve gradiente
    c = int(18 + 14 * y / H); dr.line([(0, y), (W, y)], fill=(c, c + 10, c + 13))
dr.rounded_rectangle([34, 80, W - 34, H - 80], radius=88, fill=(8, 10, 11))            # corpo
dr.rounded_rectangle([44, 90, W - 44, H - 90], radius=80, fill=(26, 30, 32), outline=(70, 78, 82), width=3)  # aro
dr.rounded_rectangle([60, 106, 60 + 780, 106 + 1688], radius=56, fill=(0, 0, 0))       # tela
dr.rounded_rectangle([W // 2 - 100, 126, W // 2 + 100, 162], radius=18, fill=(8, 10, 11))  # ilha
dr.ellipse([W // 2 + 62, 132, W // 2 + 86, 156], fill=(22, 26, 40))
dr.rounded_rectangle([W // 2 - 110, H - 72, W // 2 + 110, H - 64], radius=4, fill=(60, 66, 70))  # barra inferior
img.save(os.path.join(d, 'moldura.png'))
m = Image.new('L', (780, 1688), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, 779, 1687], radius=56, fill=255); m.save(os.path.join(d, 'mascara.png'))
print('moldura ok')
