"""
Extraction des photos produits depuis le catalogue La Genovese PDF.
Rend chaque page en haute resolution et decoupe si necessaire.
"""
import fitz  # PyMuPDF
from PIL import Image
import io
import os

PDF_PATH = "Catalogo-La-Genovese.eng_.pdf"
IMG_DIR = "img"
DPI = 300
JPEG_QUALITY = 85
TARGET_WIDTH = 1000

# Pages avec une seule photo (page entiere)
SINGLE_PAGES = {
    18: "grain-anniversario-1kg",
    19: "grain-royal-1kg",
    20: "grain-juta-bio-1kg",
    21: "grain-oro-1kg",
    22: "grain-orientale-1kg",
    23: "grain-coloniale-1kg",
    24: "grain-dek-1kg",
    35: "moulu-blue-gold-250g",
    51: "dosette-grands-crus",
}

# Pages avec 2 photos cote a cote (gauche / droite)
SPLIT_PAGES = {
    29: ("grain-anniversario-250g", "grain-royal-250g"),
    30: ("grain-juta-bio-250g", "grain-oro-250g"),
    31: ("grain-orientale-250g", "grain-coloniale-250g"),
    33: ("moulu-daily-moka-250g", "moulu-juta-bio-250g"),
    34: ("moulu-dek-250g", "moulu-tradizione-250g"),
    39: ("origin-honduras", "origin-perou"),
    40: ("origin-kenya", "origin-ethiopie"),
    41: ("origin-bresil", "origin-colombie"),
    42: ("origin-honduras-shg", "origin-mexique-decaf"),
    47: ("capsule-oro", "capsule-coloniale"),
    48: ("capsule-dek", "capsule-juta-bio"),
}

TASSES_PAGE = 54


def render_page_to_pil(doc, page_num, dpi=DPI):
    """Rend une page en image PIL haute resolution."""
    page = doc[page_num - 1]
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat)
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data))
    if img.mode == "RGBA":
        img = img.convert("RGB")
    return img


def save_jpeg(img, filepath):
    """Redimensionne si besoin et sauvegarde en JPEG."""
    if img.width > 1200:
        ratio = TARGET_WIDTH / img.width
        img = img.resize((TARGET_WIDTH, int(img.height * ratio)), Image.LANCZOS)
    img.save(filepath, "JPEG", quality=JPEG_QUALITY)


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    doc = fitz.open(PDF_PATH)
    print(f"PDF ouvert : {len(doc)} pages")
    created = []

    # Pages simples (1 photo)
    for page_num, name in SINGLE_PAGES.items():
        filepath = os.path.join(IMG_DIR, f"{name}.jpg")
        print(f"  Page {page_num} -> {filepath}")
        img = render_page_to_pil(doc, page_num)
        save_jpeg(img, filepath)
        created.append(filepath)

    # Pages a decouper (2 photos cote a cote)
    for page_num, (name_left, name_right) in SPLIT_PAGES.items():
        img = render_page_to_pil(doc, page_num)
        mid = img.width // 2

        filepath_left = os.path.join(IMG_DIR, f"{name_left}.jpg")
        filepath_right = os.path.join(IMG_DIR, f"{name_right}.jpg")
        print(f"  Page {page_num} -> {filepath_left} + {filepath_right}")

        img_left = img.crop((0, 0, mid, img.height))
        save_jpeg(img_left, filepath_left)
        created.append(filepath_left)

        img_right = img.crop((mid, 0, img.width, img.height))
        save_jpeg(img_right, filepath_right)
        created.append(filepath_right)

    # Page 54 : tasses (4 quadrants, on prend les 2 du haut)
    img = render_page_to_pil(doc, TASSES_PAGE)
    mid_x = img.width // 2
    mid_y = img.height // 2

    fp_esp = os.path.join(IMG_DIR, "tasse-espresso-anniversario.jpg")
    img_tl = img.crop((0, 0, mid_x, mid_y))
    save_jpeg(img_tl, fp_esp)
    created.append(fp_esp)
    print(f"  Page {TASSES_PAGE} haut-gauche -> {fp_esp}")

    fp_cap = os.path.join(IMG_DIR, "tasse-cappuccino-anniversario.jpg")
    img_tr = img.crop((mid_x, 0, img.width, mid_y))
    save_jpeg(img_tr, fp_cap)
    created.append(fp_cap)
    print(f"  Page {TASSES_PAGE} haut-droite -> {fp_cap}")

    doc.close()

    print(f"\n{len(created)} images extraites.")
    for fp in sorted(created):
        size_kb = os.path.getsize(fp) / 1024
        print(f"  {fp} -- {size_kb:.0f} KB")


if __name__ == "__main__":
    main()
