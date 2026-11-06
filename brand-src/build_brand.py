"""Genera i file del logo soulspilot (drone-loto, variante "ellissi").

Uso: python3 brand-src/build_brand.py  (dalla cartella portfolio)
La scritta è convertita in tracciati, così il logo è identico ovunque, anche senza i font.
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

VERDE = "#2f5240"
VERDE_SCURO = "#1c3227"
MENTA = "#9fd3ae"
INK = "#1e2123"
WHITE = "#ffffff"


def mark(color: str, stroke: float = 2.4) -> str:
    """Il simbolo nelle coordinate 0..64: quattro petali-elica in diagonale e il centro."""
    return (
        f'<g fill="none" stroke="{color}" stroke-width="{stroke}" transform="rotate(45 32 32)">'
        '<ellipse cx="32" cy="15.5" rx="6.5" ry="10"/><ellipse cx="32" cy="48.5" rx="6.5" ry="10"/>'
        '<ellipse cx="15.5" cy="32" rx="10" ry="6.5"/><ellipse cx="48.5" cy="32" rx="10" ry="6.5"/>'
        f'</g><circle cx="32" cy="32" r="3.3" fill="{color}"/>'
    )


def text_path(font: TTFont, text: str, size: float, x: float, baseline: float, tracking: float = 0.0):
    """Tracciato SVG del testo e larghezza occupata. tracking in em."""
    upm = font["head"].unitsPerEm
    scale = size / upm
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    hmtx = font["hmtx"]
    pen = SVGPathPen(glyphs)
    cursor = x
    for ch in text:
        name = cmap[ord(ch)]
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, cursor, baseline)))
        cursor += hmtx[name][0] * scale + tracking * size
    return pen.getCommands(), cursor - tracking * size - x


def svg(view: str, body: str, title: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{body}</svg>\n"
    )


manrope = TTFont(ROOT / "brand-src/fonts/Manrope-SemiBold.ttf")
serif = TTFont(ROOT / "brand-src/fonts/InstrumentSerif-Italic.ttf")

# --- simbolo da solo (ritagliato sui petali) ---
MARK_VIEW = "9 9 46 46"
for name, color in [("mark", VERDE), ("mark-white", WHITE), ("mark-black", INK), ("mark-menta", MENTA)]:
    (OUT / f"soulspilot-{name}.svg").write_text(svg(MARK_VIEW, mark(color), "soulspilot"))

# --- simbolo + scritta ---
# il simbolo occupa 44x44 (coordinate 10..54); la scritta parte dopo uno spazio e si centra sull'occhio della x
SOULS, PILOT = 30.0, 34.0
xh = manrope["OS/2"].sxHeight / manrope["head"].unitsPerEm * SOULS
baseline = 32 + xh / 2
souls_d, souls_w = text_path(manrope, "souls", SOULS, 68, baseline, tracking=-0.02)
pilot_d, pilot_w = text_path(serif, "pilot", PILOT, 68 + souls_w + 2, baseline)
width = 68 + souls_w + 2 + pilot_w + 4
LOGO_VIEW = f"9 6 {width - 9:.1f} 52"
for name, mcol, tcol in [("logo", VERDE, INK), ("logo-white", WHITE, WHITE), ("logo-black", INK, INK), ("logo-verde", VERDE, VERDE)]:
    body = mark(mcol) + f'<path fill="{tcol}" d="{souls_d}"/><path fill="{tcol}" d="{pilot_d}"/>'
    (OUT / f"soulspilot-{name}.svg").write_text(svg(LOGO_VIEW, body, "soulspilot"))

# --- icona: tessera verde scuro con il simbolo in menta, tratti più spessi per le misure piccole ---
icon = svg(
    "0 0 64 64",
    f'<rect width="64" height="64" rx="14" fill="{VERDE_SCURO}"/>'
    f'<g transform="translate(32 32) scale(1.18) translate(-32 -32)">{mark(MENTA, 3.4)}</g>',
    "soulspilot",
)
(OUT / "soulspilot-icon.svg").write_text(icon)
(ROOT / "app" / "icon.svg").write_text(icon)

print("file creati in", OUT)
for f in sorted(OUT.iterdir()):
    print(" ", f.name)
