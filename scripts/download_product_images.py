"""
Telechargement et conversion des images produits depuis shop.lagenovese.it
WebP/JPEG/PNG -> JPG 800px max, qualite 85

IMPORTANT : Le serveur shop.lagenovese.it bloque les telechargements automatiques
(protection anti-hotlink / WAF). Deux modes d'utilisation :

  Mode 1 — Telechargement auto (si le serveur le permet) :
    python scripts/download_product_images.py

  Mode 2 — Conversion locale (recommande) :
    1. Ouvrez chaque URL dans votre navigateur
    2. Clic droit > Enregistrer l'image sous... dans le dossier img/downloads/
    3. Lancez : python scripts/download_product_images.py --local
    Le script convertit toutes les images de img/downloads/ en JPG 800px dans img/
"""
import os
import sys
import glob
import requests
from PIL import Image
from io import BytesIO

IMG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "img")
MAX_WIDTH = 800
JPEG_QUALITY = 85
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Referer": "https://shop.lagenovese.it/",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
}

BASE = "https://shop.portale.lagenovese.it/wp-content/uploads/sites/4"

IMAGES = {
    # =====================================================================
    # Grains pro 1kg
    # =====================================================================
    "grain-anniversario-1kg": f"{BASE}/2024/09/MISCELA-ANNIVERSARIO-1Kg-25.jpg",
    "grain-royal-1kg": f"{BASE}/2024/09/prodotti_genovese62-Large.jpeg",
    "grain-oro-1kg": f"{BASE}/2018/01/MISCELA-ORO-1Kg-25.jpg",
    "grain-coloniale-1kg": f"{BASE}/2024/09/PHOTO-2025-10-01-14-18-09.jpg",
    "grain-juta-bio-1kg": f"{BASE}/2024/09/MISCELA-JUTA-1Kg-2025.jpg",
    "grain-dek-1kg": f"{BASE}/2018/03/MISCELA-DEK-1Kg.webp",
    "grain-orientale-1kg": f"{BASE}/2017/11/prodotti_genovese83-Large.jpeg",

    # =====================================================================
    # Grains maison 250g (doypack)
    # =====================================================================
    "grain-anniversario-250g": f"{BASE}/2024/09/MISCELA-ANNIVERSARIO-250g-25.jpg",
    "grain-royal-250g": f"{BASE}/2024/09/prodotti_genovese67-Large.jpeg",
    "grain-oro-250g": f"{BASE}/2022/10/MISCELA-ORO-250g.webp",
    "grain-juta-bio-250g": f"{BASE}/2024/09/MISCELA-JUTA-1Kg-2025-grani.jpg",
    "grain-orientale-250g": f"{BASE}/2023/05/prodotti_genovese85-Large.jpeg",
    "grain-coloniale-250g": f"{BASE}/2024/09/prodotti_genovese21-Large.jpeg",

    # =====================================================================
    # Moulus
    # =====================================================================
    "moulu-blue-gold-250g": f"{BASE}/2018/03/Blue-Gold.webp",
    "moulu-daily-moka-250g": f"{BASE}/2018/03/Daily-Moka-lattina.webp",
    "moulu-tradizione-250g": f"{BASE}/2018/03/Tradizione.webp",
    "moulu-juta-bio-250g": f"{BASE}/2024/09/MISCELA-JUTA-1Kg-2025-grani.jpg",
    "moulu-dek-250g": f"{BASE}/2018/03/Dek-lattina.webp",

    # =====================================================================
    # Capsules et dosettes
    # =====================================================================
    "capsule-oro": f"{BASE}/2021/07/Capsule-Oro.webp",
    "capsule-coloniale": f"{BASE}/2021/07/Capsule-Coloniale.webp",
    "capsule-juta-bio": f"{BASE}/2018/03/Astuccio-Cialde-Juta-Bio.webp",
    "capsule-dek": f"{BASE}/2021/07/Capsule-Dek.webp",

    # =====================================================================
    # Single origins
    # =====================================================================
    "origin-bresil": f"{BASE}/2020/08/prodotti_genovese133-Large.jpeg",
    "origin-colombie": f"{BASE}/2020/08/prodotti_genovese127-Large.jpeg",
    "origin-ethiopie": f"{BASE}/2020/08/prodotti_genovese43-Large.jpeg",
    "origin-kenya": f"{BASE}/2020/08/Kenya.webp",
    "origin-honduras": f"{BASE}/2020/08/prodotti_genovese132-Large.jpeg",
    "origin-perou": f"{BASE}/2021/04/Mokastyle-SantIgnazio-bio-grani-250g.webp",
    "origin-mexique-decaf": f"{BASE}/2017/11/Mokastyle-Altura-Dek-Bio-grani-250g.webp",
}


def download_and_convert(name, url, output_dir):
    """Telecharge une image et la sauvegarde en JPG."""
    filepath = os.path.join(output_dir, f"{name}.jpg")

    if url == "URL_A_REMPLIR":
        print(f"  [SKIP] {name} -- URL non renseignee")
        return False

    try:
        print(f"  Telechargement: {name}...", end=" ", flush=True)
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()

        img = Image.open(BytesIO(resp.content))

        # Convertir en RGB (WebP peut avoir un canal alpha)
        if img.mode in ("RGBA", "P", "LA"):
            background = Image.new("RGB", img.size, (250, 248, 245))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if "A" in img.mode else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Redimensionner si trop large
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_size = (MAX_WIDTH, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        img.save(filepath, "JPEG", quality=JPEG_QUALITY)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"OK ({img.width}x{img.height}, {size_kb:.0f} KB)")
        return True

    except Exception as e:
        print(f"ERREUR: {e}")
        return False


def convert_local_file(src_path, name, output_dir):
    """Convertit un fichier image local en JPG."""
    filepath = os.path.join(output_dir, f"{name}.jpg")
    try:
        print(f"  Conversion: {os.path.basename(src_path)} -> {name}.jpg...", end=" ", flush=True)
        img = Image.open(src_path)

        if img.mode in ("RGBA", "P", "LA"):
            background = Image.new("RGB", img.size, (250, 248, 245))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if "A" in img.mode else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_size = (MAX_WIDTH, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        img.save(filepath, "JPEG", quality=JPEG_QUALITY)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"OK ({img.width}x{img.height}, {size_kb:.0f} KB)")
        return True
    except Exception as e:
        print(f"ERREUR: {e}")
        return False


def run_local_mode():
    """Convertit les images telechargees manuellement depuis img/downloads/."""
    downloads_dir = os.path.join(IMG_DIR, "downloads")
    if not os.path.isdir(downloads_dir):
        print(f"Dossier {downloads_dir} introuvable.")
        print("Instructions :")
        print("  1. Creez le dossier img/downloads/")
        print("  2. Ouvrez les URLs ci-dessous dans votre navigateur :")
        print()
        for name, url in IMAGES.items():
            if url != "URL_A_REMPLIR":
                print(f"     {name}:")
                print(f"       {url}")
        print()
        print("  3. Clic droit > Enregistrer l'image sous...")
        print(f"     Nommez chaque fichier avec le nom exact (ex: grain-anniversario-1kg.webp)")
        print(f"     Sauvegardez dans : {downloads_dir}")
        print("  4. Relancez : python scripts/download_product_images.py --local")
        return

    files = glob.glob(os.path.join(downloads_dir, "*.*"))
    image_exts = {".webp", ".jpg", ".jpeg", ".png", ".gif"}
    image_files = [f for f in files if os.path.splitext(f)[1].lower() in image_exts]

    if not image_files:
        print(f"Aucune image trouvee dans {downloads_dir}")
        return

    print(f"Images trouvees dans downloads/: {len(image_files)}\n")
    success = 0
    errors = 0

    for src_path in sorted(image_files):
        name = os.path.splitext(os.path.basename(src_path))[0]
        if convert_local_file(src_path, name, IMG_DIR):
            success += 1
        else:
            errors += 1

    print(f"\n{'=' * 50}")
    print(f"Resultats: {success} converties, {errors} erreurs")
    print(f"Total images dans img/: {len([f for f in os.listdir(IMG_DIR) if f.endswith('.jpg')])}")


def run_download_mode():
    """Telecharge les images depuis les URLs (peut echouer si le serveur bloque)."""
    os.makedirs(IMG_DIR, exist_ok=True)
    print(f"Dossier de sortie: {IMG_DIR}")
    print(f"Images a telecharger: {len(IMAGES)}\n")

    success = 0
    errors = 0
    skipped = 0

    for name, url in IMAGES.items():
        if url == "URL_A_REMPLIR":
            skipped += 1
            print(f"  [SKIP] {name} -- URL non renseignee")
            continue
        if download_and_convert(name, url, IMG_DIR):
            success += 1
        else:
            errors += 1

    print(f"\n{'=' * 50}")
    print(f"Resultats: {success} telechargees, {errors} erreurs, {skipped} ignorees")

    if errors > 0:
        print(f"\n/!\\ {errors} erreurs de telechargement.")
        print("Le serveur bloque probablement les requetes automatiques.")
        print("Utilisez le mode local : python scripts/download_product_images.py --local")

    if skipped > 0:
        print(f"\nURLs manquantes :")
        for name, url in IMAGES.items():
            if url == "URL_A_REMPLIR":
                print(f"  - {name}")


def main():
    if "--local" in sys.argv:
        run_local_mode()
    else:
        run_download_mode()


if __name__ == "__main__":
    main()
