"""Normalize finish photos so the Knuckle is the same size and position in each.

Black Standard is the reference. Each photo is scaled so the Knuckle matches the
reference width, positioned at the same top-left point, and blended onto the
reference photo's wood (colour-matched, with feathered edges) to fill any gaps.

Usage: python3 scripts/normalize-product-images.py
Reads public/*.jpg and overwrites them in place.
"""
from PIL import Image

SIZE = 1200
REFERENCE = "public/anodized_black.jpg"
TARGETS = ["public/silver_satin.jpg", "public/anodized_black_x.jpg"]


def knuckle_bbox(im):
    """Bounding box of the low-saturation Knuckle against saturated wood."""
    w, h = im.size
    px = im.load()
    cols, rows = [0] * w, [0] * h
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            mx, mn = max(r, g, b), min(r, g, b)
            if mx == 0 or (mx - mn) / mx < 0.2:
                cols[x] += 1
                rows[y] += 1
    xs = [i for i, c in enumerate(cols) if c > 0.1 * h]
    ys = [i for i, c in enumerate(rows) if c > 0.1 * w]
    return xs[0], ys[0], xs[-1], ys[-1]


FEATHER = 70  # px soft edge where a photo blends into the reference wood


def wood_mean(im, box):
    """Average colour of a wood-only region."""
    r = g = b = n = 0
    for pr, pg, pb in im.crop(box).getdata():
        r += pr; g += pg; b += pb; n += 1
    return r / n, g / n, b / n


def feather_mask(w, h, left, top, right, bottom):
    """Opaque mask that fades to transparent over FEATHER px on the given edges."""
    mask = Image.new("L", (w, h), 255)
    px = mask.load()
    for y in range(h):
        for x in range(w):
            d = FEATHER
            if left: d = min(d, x)
            if top: d = min(d, y)
            if right: d = min(d, w - 1 - x)
            if bottom: d = min(d, h - 1 - y)
            if d < FEATHER:
                px[x, y] = round(255 * d / FEATHER)
    return mask


def place(im, scale, kx, ky, background):
    """Scale `im` and blend it onto `background` so the Knuckle's top-left is at (kx, ky)."""
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    bx0, by0, _, _ = knuckle_bbox(im)
    ox, oy = round(kx - bx0), round(ky - by0)

    # Match the background wood's colour to this photo's wood.
    sample = (0, 0, min(im.width, 60), min(im.height, 60))
    tr, tg, tb = wood_mean(im, sample)
    br, bg_, bb = wood_mean(background, (ox, oy, ox + 60, oy + 60))
    bg = Image.merge("RGB", [
        ch.point(lambda v, k=k: min(255, round(v * k)))
        for ch, k in zip(background.split(), (tr / br, tg / bg_, tb / bb))
    ])

    mask = feather_mask(im.width, im.height,
                        ox > 0, oy > 0, ox + im.width < SIZE, oy + im.height < SIZE)
    bg.paste(im, (ox, oy), mask)
    return bg


def main():
    ref = Image.open(REFERENCE).convert("RGB")
    s = SIZE / min(ref.size)  # cover-fit the reference into the square
    ref = ref.resize((round(ref.width * s), round(ref.height * s)), Image.LANCZOS)
    cx, cy = (ref.width - SIZE) // 2, (ref.height - SIZE) // 2
    ref = ref.crop((cx, cy, cx + SIZE, cy + SIZE))
    rx0, ry0, rx1, _ = knuckle_bbox(ref)
    ref_w = rx1 - rx0
    ref.save(REFERENCE, quality=85, optimize=True, progressive=True)
    print(f"reference knuckle: x={rx0} y={ry0} w={ref_w}")

    for path in TARGETS:
        im = Image.open(path).convert("RGB")
        x0, _, x1, _ = knuckle_bbox(im)
        out = place(im, ref_w / (x1 - x0), rx0, ry0, ref.copy())
        nx0, ny0, nx1, _ = knuckle_bbox(out)
        out.save(path, quality=85, optimize=True, progressive=True)
        print(f"{path}: knuckle x={nx0} y={ny0} w={nx1 - nx0}")


if __name__ == "__main__":
    main()
