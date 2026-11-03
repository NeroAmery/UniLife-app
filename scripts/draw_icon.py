# Dibuja el icono base (assets/icon.png y assets/icon-fg.png). Solo hace falta para regenerarlo.
from PIL import Image, ImageDraw
S, K = 1024, 2
BG = (91, 138, 114, 255)

def art(d):
    f = lambda v: int(v * K)
    d.ellipse([f(200), f(650), f(824), f(850)], fill=(246, 241, 233, 255))           # colina
    d.ellipse([f(640), f(230), f(740), f(330)], fill=(246, 210, 114, 255))            # sol
    def trunk(x, y0, y1): d.rounded_rectangle([f(x-14), f(y0), f(x+14), f(y1)], f(6), fill=(107, 74, 51, 255))
    def pine(x, base, h, w, col):
        for i in range(3):
            top = base - h + i * h * 0.22
            d.polygon([(f(x), f(top)), (f(x + w * (0.55 + i * 0.22)), f(base - h * 0.2 * (2 - i) - 10)),
                       (f(x - w * (0.55 + i * 0.22)), f(base - h * 0.2 * (2 - i) - 10))], fill=col)
    dark = (47, 90, 69, 255)
    trunk(512, 640, 760); pine(512, 700, 400, 120, dark)
    trunk(350, 690, 780); pine(350, 735, 250, 80, (64, 112, 88, 255))
    trunk(690, 690, 780); d.ellipse([f(690-85), f(500), f(690+85), f(690)], fill=(212, 165, 116, 255))

def make(bg):
    im = Image.new('RGBA', (S*K, S*K), BG if bg else (0, 0, 0, 0))
    art(ImageDraw.Draw(im))
    return im.resize((S, S), Image.LANCZOS)

make(True).save('assets/icon.png'); make(False).save('assets/icon-fg.png')
