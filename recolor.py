import sys
from PIL import Image
import colorsys

def recolor():
    img = Image.open('src/assets/logo-play11.png')
    img = img.convert('RGBA')
    data = img.getdata()
    
    new_data = []
    # Violet is approx ~0.7 to 0.72 hue
    # Original Blue is approx ~0.55 to 0.65 hue
    
    for item in data:
        if item[3] > 0:
            r, g, b = item[:3]
            h, l, s = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
            
            # Target blue range
            if 0.5 < h < 0.7:
                # Shift to vibrant violet
                h_new = 0.71 
                r_new, g_new, b_new = colorsys.hls_to_rgb(h_new, l, s)
                new_data.append((int(r_new*255), int(g_new*255), int(b_new*255), item[3]))
            # Also target the orange '11' if they meant making everything match the theme exactly,
            # but usually they just want the primary color to map. Option B secondary is Hot Pink (hue ~0.9).
            # The '11' is Orange (hue ~0.05 - 0.1). Shift it to Hot Pink.
            elif 0.05 < h < 0.15:
                h_new = 0.91 # Hot pink
                r_new, g_new, b_new = colorsys.hls_to_rgb(h_new, l, s)
                new_data.append((int(r_new*255), int(g_new*255), int(b_new*255), item[3]))
            else:
                new_data.append(item)
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save('src/assets/logo-play11.png')
    print("Recoloring complete. Blue -> Violet, Orange -> Pink")

if __name__ == '__main__':
    recolor()
