# Se ejecuta en GitHub: reemplaza los iconos de Android por los de assets/
import os, re
from PIL import Image
RES = 'android/app/src/main/res'
full, fg = Image.open('assets/icon.png').convert('RGBA'), Image.open('assets/icon-fg.png').convert('RGBA')
for d, legacy, adaptive in [('mdpi',48,108),('hdpi',72,162),('xhdpi',96,216),('xxhdpi',144,324),('xxxhdpi',192,432)]:
    p = f'{RES}/mipmap-{d}'
    full.resize((legacy, legacy), Image.LANCZOS).save(f'{p}/ic_launcher.png')
    full.resize((legacy, legacy), Image.LANCZOS).save(f'{p}/ic_launcher_round.png')
    fg.resize((adaptive, adaptive), Image.LANCZOS).save(f'{p}/ic_launcher_foreground.png')
bgx = f'{RES}/values/ic_launcher_background.xml'
if os.path.exists(bgx):
    t = open(bgx, encoding='utf-8').read()
    open(bgx, 'w', encoding='utf-8').write(re.sub(r'#[0-9A-Fa-f]{6,8}', '#5B8A72', t))
print('Iconos actualizados')
