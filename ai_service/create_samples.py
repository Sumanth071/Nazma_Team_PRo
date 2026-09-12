import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def create_sample_images():
    dirs = [
        "sample_images",
        "client/public/sample_images",
        "server/uploads"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

    samples = [
        ("adenomatous_polyp_sample_01.jpg", "Adenomatous", (185, 75, 75), (215, 120, 110), 0.35),
        ("hyperplastic_polyp_sample_02.jpg", "Hyperplastic", (210, 150, 140), (225, 180, 170), 0.25),
        ("serrated_polyp_sample_03.jpg", "Serrated", (195, 130, 115), (230, 205, 185), 0.40),
        ("normal_mucosa_sample_04.jpg", "Normal", (215, 125, 120), (225, 145, 135), 0.05),
    ]

    size = (512, 512)

    for filename, polyp_type, base_col, highlight_col, elevation in samples:
        # Create rich mucosal background
        img = Image.new("RGB", size, (160, 50, 50))
        draw = ImageDraw.Draw(img)

        # Draw colon lumen & radial mucosal folds
        cx, cy = size[0] // 2, size[1] // 2
        for r in range(250, 20, -15):
            factor = r / 250.0
            col = (
                int(base_col[0] * factor + 30),
                int(base_col[1] * factor + 15),
                int(base_col[2] * factor + 15)
            )
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)

        # Mucosal vascular network lines
        for angle in range(0, 360, 18):
            rad = math.radians(angle)
            x2 = cx + int(math.cos(rad) * 230)
            y2 = cy + int(math.sin(rad) * 230)
            draw.line([cx, cy, x2, y2], fill=(130, 30, 30), width=2)

        # Draw polyp lesion if not normal
        if polyp_type != "Normal":
            px, py = cx + 25, cy - 20
            pr = int(120 * elevation + 40)
            
            # Draw multi-lobed lesion
            for ox, oy, rad_mod in [(-15, -10, 0.9), (20, -15, 0.85), (0, 20, 0.95), (10, 5, 1.1)]:
                draw.ellipse(
                    [px + ox - int(pr * rad_mod), py + oy - int(pr * rad_mod),
                     px + ox + int(pr * rad_mod), py + oy + int(pr * rad_mod)],
                    fill=highlight_col
                )

            # Draw surface pit pattern crypts
            for _ in range(75):
                rx = px + int(np.random.normal(0, pr * 0.55))
                ry = py + int(np.random.normal(0, pr * 0.55))
                if (rx - px)**2 + (ry - py)**2 < (pr * 0.9)**2:
                    draw.ellipse([rx - 3, ry - 3, rx + 3, ry + 3], fill=(100, 30, 35))

            # Light reflection / glare typical of colonoscope light
            draw.ellipse([px - 25, py - 30, px - 10, py - 18], fill=(255, 255, 255))
            draw.ellipse([px + 30, py + 15, px + 38, py + 22], fill=(255, 255, 255))

        # Soft lens vignette & blur for endoscopic realism
        img = img.filter(ImageFilter.GaussianBlur(radius=1.2))

        for d in dirs:
            target_path = os.path.join(d, filename)
            img.save(target_path, "JPEG", quality=92)
            print(f"[Samples] Generated {target_path}")

if __name__ == "__main__":
    create_sample_images()
