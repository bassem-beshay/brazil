from __future__ import annotations

import hashlib
import json
import mimetypes
import re
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests


ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "src" / "lib" / "siteData.generated.json"
ASSET_DIR = ROOT / "public" / "site-assets"


VISIBLE_URLS = [
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2023/05/Egito-milenar-original-10-dias.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Viagem-Caminho-de-Moises1.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/pyramid-1.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/egypt.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Foto-do-roteiro-Rota-do-Nilo-III-e1727309461222.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Egito-sharm-EL-Sheikh-e-Monte-Siani.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Passeios-e-Excursoes-no-Egito.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Piramide-de-Giza-640X480.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Passeio-Menfis-Sakkara-e-Dahshur-por-1-Dia-okokok.jpg",
    "https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1200",
]

AVATAR_MATCHES = [
    "https://ui-avatars.com/api/?name=Atendimento&background=2E7D32&color=ffffff&size=512",
    "https://ui-avatars.com/api/?name=admin&background=1B5E20&color=ffffff&size=256",
    "https://ui-avatars.com/api/?name=admin&background=1B5E20&color=ffffff&size=512",
    "https://ui-avatars.com/api/?name=mr emad&background=1B5E20&color=ffffff&size=512",
]

LOCAL_OVERRIDES = {
    # Main visible site images.
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2023/05/Egito-milenar-original-10-dias.jpg": "/site-assets/129c99e2660a92ad.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Viagem-Caminho-de-Moises1.jpg": "/site-assets/f7e27d30cbc56bd7.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/pyramid-1.jpg": "/site-assets/cc25b2eb94a7e175.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/egypt.jpg": "/site-assets/cc25b2eb94a7e175.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Foto-do-roteiro-Rota-do-Nilo-III-e1727309461222.png": "/site-assets/2eee2d63670661aa.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Egito-sharm-EL-Sheikh-e-Monte-Siani.jpg": "/site-assets/340eaaf95101bd52.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Passeios-e-Excursoes-no-Egito.jpg": "/site-assets/02c648d21222bbd8.jpg",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Piramide-de-Giza-640X480.jpg": "/site-assets/cc25b2eb94a7e175.png",
    "https://www.girasoltours.com/Viagens/wp-content/uploads/2024/10/Passeio-Menfis-Sakkara-e-Dahshur-por-1-Dia-okokok.jpg": "/site-assets/b98551e2cca124da.png",
    "https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1200": "/site-assets/129c99e2660a92ad.png",

    # Blog / article thumbnails currently present in the dump.
    "https://www.descobriregipto.com/wp-content/uploads/2017/08/Philae.jpg": "/site-assets/48afe4e7527c2896.png",
    "https://www.descobriregipto.com/wp-content/uploads/2017/08/Tutmés-III.jpg": "/site-assets/658f72b9c727042b.png",
    "https://www.descobriregipto.com/wp-content/uploads/2017/08/IMG_20170604_135141.jpg": "/site-assets/026241b0b38575ff.jpg",
    "https://www.descobriregipto.com/wp-content/uploads/2017/09/Sakkara-Complexo.jpg": "/site-assets/358040cf5f578b59.png",
    "https://www.girasoltours.com/Viagens/saiba-por-que-voce-deve-ir-ao-egito-ao-menos-uma-vez-na-vida-saiba-por-que-deve-ir-ao-egito-ao-menos-uma-vez-na-vida-webp/": "/site-assets/cc25b2eb94a7e175.png",
}

DEFAULT_ASSET = "/site-assets/129c99e2660a92ad.png"
ASSET_CHOICES = {
    "pyramids": "/site-assets/cc25b2eb94a7e175.png",
    "desert": "/site-assets/bcbfed32d2b98bb5.png",
    "sea": "/site-assets/340eaaf95101bd52.png",
    "coptic": "/site-assets/026241b0b38575ff.jpg",
    "cruise": "/site-assets/2eee2d63670661aa.jpg",
    "market": "/site-assets/02c648d21222bbd8.jpg",
    "museum": "/site-assets/761e921bfc20f100.png",
    "night": "/site-assets/7d6b87f2d9b6c89f.png",
    "cairo": "/site-assets/beb26a1d728797db.png",
    "dubai": "/site-assets/e1e55c12fedb65ac.jpg",
    "resort": "/site-assets/fb1a3cc0cf94e9f2.png",
}

IMAGE_URL_RE = re.compile(r"\.(?:jpe?g|png|webp|gif|svg)(?:$|[?#])", re.IGNORECASE)


def local_name(url: str) -> str:
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]
    return digest


def download(url: str) -> str:
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    content_type = resp.headers.get("content-type", "").split(";")[0].lower()
    ext = mimetypes.guess_extension(content_type) or Path(url).suffix or ".img"
    if ext == ".jpe":
        ext = ".jpg"
    name = f"{local_name(url)}{ext}"
    target = ASSET_DIR / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(resp.content)
    return f"/site-assets/{name}"


def is_image_url(url: str) -> bool:
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    path = parsed.path.lower()
    return (
        bool(IMAGE_URL_RE.search(path))
        or "images.unsplash.com" in host
        or "ui-avatars.com" in host
        or "shortpixel.ai" in host
        or "/wp-content/uploads/" in path
    )


def pick_local_asset(url: str) -> str:
    lower = url.lower()
    tokens = [
        ("dubai", ASSET_CHOICES["dubai"]),
        ("emirate", ASSET_CHOICES["dubai"]),
        ("uae", ASSET_CHOICES["dubai"]),
        ("piram", ASSET_CHOICES["pyramids"]),
        ("giza", ASSET_CHOICES["pyramids"]),
        ("sphinx", ASSET_CHOICES["pyramids"]),
        ("egypt", ASSET_CHOICES["pyramids"]),
        ("cairo", ASSET_CHOICES["cairo"]),
        ("luxor", ASSET_CHOICES["museum"]),
        ("karnak", ASSET_CHOICES["museum"]),
        ("philae", ASSET_CHOICES["museum"]),
        ("aswan", ASSET_CHOICES["cruise"]),
        ("nilo", ASSET_CHOICES["cruise"]),
        ("cruise", ASSET_CHOICES["cruise"]),
        ("feluca", ASSET_CHOICES["cruise"]),
        ("boat", ASSET_CHOICES["cruise"]),
        ("sharm", ASSET_CHOICES["sea"]),
        ("hurghada", ASSET_CHOICES["sea"]),
        ("marsa", ASSET_CHOICES["sea"]),
        ("red-sea", ASSET_CHOICES["sea"]),
        ("beach", ASSET_CHOICES["sea"]),
        ("mergulho", ASSET_CHOICES["sea"]),
        ("desert", ASSET_CHOICES["desert"]),
        ("siwa", ASSET_CHOICES["desert"]),
        ("sinai", ASSET_CHOICES["desert"]),
        ("wadi", ASSET_CHOICES["desert"]),
        ("copt", ASSET_CHOICES["coptic"]),
        ("church", ASSET_CHOICES["coptic"]),
        ("sergio", ASSET_CHOICES["coptic"]),
        ("barbara", ASSET_CHOICES["coptic"]),
        ("saladino", ASSET_CHOICES["cairo"]),
        ("bazaar", ASSET_CHOICES["market"]),
        ("market", ASSET_CHOICES["market"]),
        ("souk", ASSET_CHOICES["market"]),
        ("museum", ASSET_CHOICES["museum"]),
        ("museu", ASSET_CHOICES["museum"]),
        ("tut", ASSET_CHOICES["museum"]),
        ("mummy", ASSET_CHOICES["museum"]),
        ("night", ASSET_CHOICES["night"]),
        ("hotel", ASSET_CHOICES["resort"]),
        ("resort", ASSET_CHOICES["resort"]),
    ]
    for needle, asset in tokens:
        if needle in lower:
            return asset
    return DEFAULT_ASSET


def write_avatar() -> str:
    target = ASSET_DIR / "avatar-generic.svg"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        """<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\">
  <rect width=\"256\" height=\"256\" rx=\"64\" fill=\"#1B5E20\"/>
  <circle cx=\"128\" cy=\"104\" r=\"42\" fill=\"#FBC02D\" opacity=\"0.95\"/>
  <path d=\"M54 214c15-38 49-58 74-58s59 20 74 58\" fill=\"#FBC02D\" opacity=\"0.95\"/>
  <text x=\"128\" y=\"149\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"38\" font-weight=\"700\" fill=\"#ffffff\">G</text>
</svg>""",
        encoding="utf-8",
    )
    return "/site-assets/avatar-generic.svg"


def replace(value: Any, mapping: dict[str, str]) -> Any:
    if isinstance(value, str):
        return mapping.get(value, value)
    if isinstance(value, list):
        return [replace(item, mapping) for item in value]
    if isinstance(value, dict):
        return {k: replace(v, mapping) for k, v in value.items()}
    return value


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    mapping: dict[str, str] = {}

    avatar_path = write_avatar()
    for url in AVATAR_MATCHES:
        mapping[url] = avatar_path

    for url, target in LOCAL_OVERRIDES.items():
        mapping[url] = target

    for url in VISIBLE_URLS:
        if url in mapping:
            continue
        try:
            mapping[url] = download(url)
        except Exception as exc:
            print(f"skip {url}: {type(exc).__name__}: {exc}")

    def build_generic_mapping(value: Any) -> None:
        if isinstance(value, str):
            if value.startswith("/site-assets/"):
                return
            if value in mapping:
                return
            if is_image_url(value):
                mapping[value] = pick_local_asset(value)
        elif isinstance(value, list):
            for item in value:
                build_generic_mapping(item)
        elif isinstance(value, dict):
            for item in value.values():
                build_generic_mapping(item)

    build_generic_mapping(data)

    rewritten = replace(data, mapping)
    JSON_PATH.write_text(json.dumps(rewritten, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print(f"mapped {len(mapping)} urls")
    for source, target in mapping.items():
        print(f"{source} -> {target}")


if __name__ == "__main__":
    main()
