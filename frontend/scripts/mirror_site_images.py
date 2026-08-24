from __future__ import annotations

import hashlib
import json
import mimetypes
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests


ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "src" / "lib" / "siteData.generated.json"
ASSET_DIR = ROOT / "public" / "site-assets"
TIMEOUT = 20


def collect_urls(value: Any, urls: set[str]) -> None:
    if isinstance(value, str) and value.startswith("http"):
        urls.add(value)
        return
    if isinstance(value, dict):
        for item in value.values():
            collect_urls(item, urls)
    elif isinstance(value, list):
        for item in value:
            collect_urls(item, urls)


def ext_from_response(url: str, response: requests.Response) -> str:
    ctype = response.headers.get("content-type", "").split(";")[0].strip().lower()
    ext = mimetypes.guess_extension(ctype or "")
    if ext in {".jpe"}:
        ext = ".jpg"
    if ext:
        return ext
    path_ext = Path(urlparse(url).path).suffix
    return path_ext if path_ext else ".img"


def local_name(url: str, ext: str) -> str:
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]
    return f"{digest}{ext}"


def download_url(url: str) -> tuple[str, str | None, str]:
    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 Codex Site Image Mirror"})

    try:
        resp = session.get(url, allow_redirects=True, timeout=TIMEOUT, stream=True)
        if resp.status_code >= 400:
            return url, None, f"HTTP {resp.status_code}"
        ctype = resp.headers.get("content-type", "").split(";")[0].strip().lower()
        if not ctype.startswith("image/"):
            return url, None, f"non-image {ctype or 'unknown'}"

        ext = ext_from_response(url, resp)
        filename = local_name(url, ext)
        target = ASSET_DIR / filename
        target.parent.mkdir(parents=True, exist_ok=True)

        with target.open("wb") as fh:
            for chunk in resp.iter_content(chunk_size=64 * 1024):
                if chunk:
                    fh.write(chunk)

        return url, f"/site-assets/{filename}", "ok"
    except Exception as exc:
        return url, None, f"{type(exc).__name__}: {exc}"


def replace_urls(value: Any, mapping: dict[str, str]) -> Any:
    if isinstance(value, str):
        return mapping.get(value, value)
    if isinstance(value, dict):
        return {k: replace_urls(v, mapping) for k, v in value.items()}
    if isinstance(value, list):
        return [replace_urls(v, mapping) for v in value]
    return value


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    urls: set[str] = set()
    collect_urls(data, urls)

    # Keep actual site roots out of the asset mirror.
    urls = {u for u in urls if not re.fullmatch(r"https?://[^/]+/?", u)}

    print(f"Found {len(urls)} candidate URLs")

    mapping: dict[str, str] = {}
    failures: list[tuple[str, str]] = []

    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_url, url): url for url in sorted(urls)}
        for future in as_completed(futures):
            url, local_path, status = future.result()
            if local_path:
                mapping[url] = local_path
            else:
                failures.append((url, status))

    rewritten = replace_urls(data, mapping)
    JSON_PATH.write_text(json.dumps(rewritten, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print(f"Mirrored {len(mapping)} assets to {ASSET_DIR}")
    print(f"Failed {len(failures)} urls")
    for url, status in failures[:100]:
        print(f"FAIL {status}: {url}")


if __name__ == "__main__":
    main()
