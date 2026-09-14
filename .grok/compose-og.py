#!/usr/bin/env python3
"""Cinematic Velora OG card — 1200x630 JPEG, code-drawn (gen quota exhausted)."""
from __future__ import annotations

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 2400, 1260  # 2x of 1200x630 — ffmpeg only downscales
OFF_WHITE = (245, 245, 245)
FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Bold.ttf"
OUT = Path("/workspace/.grok/og-raw.png")


def gradient_background(w: int, h: int) -> Image.Image:
    y = np.linspace(0.0, 1.0, h, dtype=np.float32)[:, None, None]
    x = np.linspace(0.0, 1.0, w, dtype=np.float32)[None, :, None]
    top = np.array([8, 8, 10], dtype=np.float32).reshape(1, 1, 3)
    mid = np.array([18, 16, 20], dtype=np.float32).reshape(1, 1, 3)
    bot = np.array([12, 10, 12], dtype=np.float32).reshape(1, 1, 3)
    crimson = np.array([225, 29, 46], dtype=np.float32).reshape(1, 1, 3)
    snow_col = np.array([48, 52, 60], dtype=np.float32).reshape(1, 1, 3)

    t = np.clip((y - 0.12) / 0.70, 0, 1)
    base = top * (1 - t) + mid * t
    t2 = np.clip((y - 0.52) / 0.48, 0, 1)
    base = base * (1 - t2) + bot * t2

    snow = np.clip((y - 0.50) / 0.50, 0, 1)
    cx = np.exp(-((x - 0.5) ** 2) / (2 * 0.42 ** 2))
    snow_mix = snow * cx * 0.62
    base = base * (1 - snow_mix) + snow_col * snow_mix

    horizon = np.exp(-((y - 0.56) ** 2) / (2 * 0.032 ** 2))
    base = base + crimson * horizon * cx * 0.32

    leak = np.exp(-(((x - 0.10) ** 2) / (2 * 0.20 ** 2) + ((y - 0.70) ** 2) / (2 * 0.24 ** 2)))
    base = base + crimson * leak * 0.18

    img = np.clip(base, 0, 255).astype(np.uint8)
    return Image.fromarray(img, "RGB")


def mountain_ridge(draw: ImageDraw.ImageDraw, w: int, h: int) -> None:
    rng = random.Random(7)
    pts = []
    y_base = int(h * 0.56)
    n = 22
    for i in range(n + 1):
        x = int(w * i / n)
        jag = rng.uniform(-0.035, 0.05) * h
        peak = -abs(math.sin(i / n * math.pi * 1.7)) * h * 0.09
        pts.append((x, int(y_base + jag + peak)))
    pts.append((w, h))
    pts.append((0, h))
    draw.polygon(pts, fill=(20, 20, 24))
    bank = [
        (0, int(h * 0.80)),
        (int(w * 0.16), int(h * 0.76)),
        (int(w * 0.40), int(h * 0.78)),
        (int(w * 0.68), int(h * 0.74)),
        (int(w * 0.90), int(h * 0.77)),
        (w, int(h * 0.75)),
        (w, h),
        (0, h),
    ]
    draw.polygon(bank, fill=(30, 32, 38))


def distant_figure(w: int, h: int) -> Image.Image:
    """Tiny lone figure on the right ridgeline — atmosphere, not the lockup."""
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = int(w * 0.78), int(h * 0.52)
    s = h / 1260.0 * 0.55

    def p(dx: float, dy: float) -> tuple[int, int]:
        return (cx + int(dx * s), cy + int(dy * s))

    cloak = [p(-18, -20), p(8, -28), p(40, 20), p(28, 70), p(-8, 62), p(-22, 20)]
    body = [p(-10, -22), p(10, -22), p(12, 40), p(-12, 40)]
    head = [p(-7, -42), p(0, -50), p(7, -42), p(6, -24), p(-6, -24)]
    spear = [p(16, -70), p(20, -70), p(8, 78), p(4, 78)]
    legs = [p(-10, 38), p(-2, 38), p(-6, 78), p(-14, 78), p(2, 38), p(10, 38), p(14, 78), p(6, 78)]
    for sh in (cloak, body, head, spear, legs):
        d.polygon(sh, fill=(6, 6, 8, 210))
    return layer.filter(ImageFilter.GaussianBlur(radius=0.8))


def play_mark(w: int, h: int) -> Image.Image:
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    d = ImageDraw.Draw(layer)
    cx, cy = w // 2, int(h * 0.34)
    size = int(h * 0.145)
    tri = [
        (cx - int(size * 0.42), cy - size),
        (cx - int(size * 0.42), cy + size),
        (cx + int(size * 0.78), cy),
    ]
    gd.polygon(tri, fill=(225, 29, 46, 200))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=32))
    d.polygon(tri, fill=(225, 29, 46, 255))
    # Hairline off-white ring suggesting a play button
    pad = int(size * 1.55)
    d.ellipse(
        [cx - pad, cy - pad, cx + pad, cy + pad],
        outline=(245, 245, 245, 36),
        width=3,
    )
    return Image.alpha_composite(glow, layer)


def draw_tracked_text(
    base: Image.Image, text: str, y: int, size: int, fill, tracking: int
) -> tuple[Image.Image, int, int]:
    font = ImageFont.truetype(FONT_PATH, size)
    widths = []
    for ch in text:
        bbox = font.getbbox(ch)
        widths.append(bbox[2] - bbox[0])
    total = sum(widths) + tracking * (len(text) - 1)
    x = (base.width - total) // 2
    ascent = font.getbbox(text[0])[3] - font.getbbox(text[0])[1]
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx = x
    for ch, ww in zip(text, widths):
        gd.text((gx, y), ch, font=font, fill=(225, 29, 46, 80))
        gx += ww + tracking
    glow = glow.filter(ImageFilter.GaussianBlur(radius=14))
    cx = x
    for ch, ww in zip(text, widths):
        d.text((cx, y), ch, font=font, fill=fill)
        cx += ww + tracking
    composed = Image.alpha_composite(base.convert("RGBA"), glow)
    composed = Image.alpha_composite(composed, overlay)
    return composed, total, ascent


def widescreen_frame(w: int, h: int) -> Image.Image:
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    m_x, m_y = int(w * 0.05), int(h * 0.075)
    d.rounded_rectangle(
        [m_x, m_y, w - m_x, h - m_y],
        radius=16,
        outline=(245, 245, 245, 32),
        width=3,
    )
    tick = 34
    c = (225, 29, 46, 110)
    inset = 12
    x0, y0, x1, y1 = m_x + inset, m_y + inset, w - m_x - inset, h - m_y - inset
    for (ax, ay, bx, by) in (
        (x0, y0, x0 + tick, y0),
        (x0, y0, x0, y0 + tick),
        (x1, y0, x1 - tick, y0),
        (x1, y0, x1, y0 + tick),
        (x0, y1, x0 + tick, y1),
        (x0, y1, x0, y1 - tick),
        (x1, y1, x1 - tick, y1),
        (x1, y1, x1, y1 - tick),
    ):
        d.line([(ax, ay), (bx, by)], fill=c, width=3)
    return layer


def snow_particles(w: int, h: int, n: int = 480, seed: int = 11) -> Image.Image:
    rng = np.random.default_rng(seed)
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = layer.load()
    xs = rng.integers(0, w, n)
    ys = rng.integers(0, h, n)
    sizes = rng.integers(1, 3, n)
    alphas = rng.integers(35, 130, n)
    for x, y, s, a in zip(xs, ys, sizes, alphas):
        for dx in range(int(s)):
            for dy in range(int(s)):
                xx, yy = int(x + dx), int(y + dy)
                if 0 <= xx < w and 0 <= yy < h:
                    px[xx, yy] = (245, 245, 245, int(a))
    return layer.filter(ImageFilter.GaussianBlur(radius=0.5))


def vignette(w: int, h: int) -> Image.Image:
    yy = np.linspace(-1, 1, h)[:, None]
    xx = np.linspace(-1, 1, w)[None, :]
    r = np.sqrt((xx * 1.02) ** 2 + (yy * 1.22) ** 2)
    strength = np.clip((r - 0.42) / 0.88, 0, 1) ** 1.55
    a = (strength * 220).astype(np.uint8)
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0] = 6
    rgba[..., 1] = 6
    rgba[..., 2] = 7
    rgba[..., 3] = a
    return Image.fromarray(rgba, "RGBA")


def film_grain(w: int, h: int, amount: int = 11, seed: int = 3) -> Image.Image:
    rng = np.random.default_rng(seed)
    noise = rng.integers(-amount, amount + 1, size=(h, w), dtype=np.int16)
    a = np.clip(np.abs(noise) * 3, 0, 36).astype(np.uint8)
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    n = np.clip(128 + noise, 0, 255).astype(np.uint8)
    rgba[..., 0] = n
    rgba[..., 1] = n
    rgba[..., 2] = n
    rgba[..., 3] = a
    return Image.fromarray(rgba, "RGBA")


def main() -> None:
    random.seed(7)
    bg = gradient_background(W, H)
    draw = ImageDraw.Draw(bg)
    mountain_ridge(draw, W, H)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=1.15))

    canvas = bg.convert("RGBA")
    canvas = Image.alpha_composite(canvas, distant_figure(W, H))
    canvas = Image.alpha_composite(canvas, snow_particles(W, H))
    canvas = Image.alpha_composite(canvas, play_mark(W, H))

    title_size = 340
    tracking = 36
    title_y = int(H * 0.50)
    canvas, text_w, ascent = draw_tracked_text(
        canvas, "VELORA", title_y, title_size, (*OFF_WHITE, 255), tracking
    )
    print(f"title_width_frac={text_w / W:.3f}  (target 0.50–0.66)")
    print(f"title_y={title_y} ascent~{ascent} bottom={title_y + ascent} H={H}")
    print(f"title vertical span {title_y / H:.3f}–{(title_y + ascent) / H:.3f}")

    canvas = Image.alpha_composite(canvas, widescreen_frame(W, H))
    canvas = Image.alpha_composite(canvas, vignette(W, H))
    canvas = Image.alpha_composite(canvas, film_grain(W, H))

    rgb = canvas.convert("RGB")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    rgb.save(OUT, "PNG")
    print(f"wrote {OUT} {rgb.size}")


if __name__ == "__main__":
    main()
