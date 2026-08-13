from __future__ import annotations

import argparse
import html
import json
import math
import re
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path


MONTH_MAP = {
    "janeiro": 1,
    "fevereiro": 2,
    "marÃ§o": 3,
    "marco": 3,
    "abril": 4,
    "maio": 5,
    "junho": 6,
    "julho": 7,
    "agosto": 8,
    "setembro": 9,
    "outubro": 10,
    "novembro": 11,
    "dezembro": 12,
}

MONTH_NAMES = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "MarÃ§o",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
}

TABLES = {
    "posts": "gv_posts",
    "postmeta": "gv_postmeta",
    "terms": "gv_terms",
    "term_taxonomy": "gv_term_taxonomy",
    "term_relationships": "gv_term_relationships",
    "users": "gv_users",
    "usermeta": "gv_usermeta",
    "options": "gv_options",
    "comments": "gv_comments",
}

IMAGE_RE = re.compile(r"https?://[^\s\"']+?\.(?:png|jpe?g|webp|gif)", re.I)
TAG_RE = re.compile(r"<[^>]+>")
SHORTCODE_RE = re.compile(r"\[[^\]]+\]")
WHITESPACE_RE = re.compile(r"\s+")


def html_to_text(value: str | None) -> str:
    if not value:
        return ""
    value = html.unescape(value)
    value = value.replace("<br />", "\n").replace("<br/>", "\n").replace("<br>", "\n")
    value = re.sub(r"</p\s*>", "\n\n", value, flags=re.I)
    value = re.sub(r"</h[1-6]\s*>", "\n\n", value, flags=re.I)
    value = re.sub(r"</li\s*>", "\n", value, flags=re.I)
    value = re.sub(r"<li[^>]*>", "- ", value, flags=re.I)
    value = TAG_RE.sub("", value)
    value = SHORTCODE_RE.sub("", value)
    value = value.replace("\r", "\n")
    value = re.sub(r"\n{3,}", "\n\n", value)
    value = re.sub(r"[ \t]+", " ", value)
    return value.strip()


def text_excerpt(value: str, limit: int = 180) -> str:
    value = html_to_text(value)
    value = WHITESPACE_RE.sub(" ", value)
    if len(value) <= limit:
        return value
    return value[:limit].rsplit(" ", 1)[0].strip() + "..."


def slugify_simple(value: str) -> str:
    value = value.lower()
    value = html.unescape(value)
    replacements = {
        "Ã£": "a",
        "Ã¡": "a",
        "Ã ": "a",
        "Ã¢": "a",
        "Ã¤": "a",
        "Ã©": "e",
        "Ãª": "e",
        "Ã­": "i",
        "Ã³": "o",
        "Ã´": "o",
        "Ãµ": "o",
        "Ãº": "u",
        "Ã§": "c",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def parse_sql_value(v: str) -> str | None:
    v = v.strip()
    if v == "NULL":
        return None
    if len(v) >= 2 and v[0] == "'" and v[-1] == "'":
        body = v[1:-1]
        body = body.replace("\\\\", "\\")
        body = body.replace("\\'", "'")
        body = body.replace("\\0", "\x00").replace("\\n", "\n").replace("\\r", "\r").replace("\\t", "\t")
        return body
    return v


def split_fields(row: str) -> list[str]:
    fields: list[str] = []
    cur: list[str] = []
    in_quote = False
    esc = False
    depth = 0
    for ch in row:
        if in_quote:
            cur.append(ch)
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == "'":
                in_quote = False
        else:
            if ch == "'":
                in_quote = True
                cur.append(ch)
            elif ch == "(":
                depth += 1
                cur.append(ch)
            elif ch == ")":
                depth -= 1
                cur.append(ch)
            elif ch == "," and depth == 0:
                fields.append("".join(cur).strip())
                cur = []
            else:
                cur.append(ch)
    fields.append("".join(cur).strip())
    return fields


def extract_block(text: str, table: str) -> str:
    needle = f"INSERT INTO `{table}`"
    start = text.find(needle)
    if start == -1:
        return ""
    end = text.find("\n-- --------------------------------------------------------\n\n--\n-- Table structure for table `", start + 1)
    if end == -1:
        end = len(text)
    return text[start:end]


def parse_insert_statements(block: str) -> list[str]:
    stmts: list[str] = []
    cur: list[str] = []
    in_quote = False
    esc = False
    for ch in block:
        cur.append(ch)
        if in_quote:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == "'":
                in_quote = False
        else:
            if ch == "'":
                in_quote = True
            elif ch == ";":
                stmt = "".join(cur).strip()
                if stmt.startswith("INSERT INTO"):
                    stmts.append(stmt)
                cur = []
    return stmts


def parse_values(statement: str) -> list[str]:
    idx = statement.find("VALUES")
    if idx == -1:
        return []
    values = statement[idx + 6 :].rstrip(";").strip()
    rows: list[str] = []
    cur: list[str] = []
    in_quote = False
    esc = False
    depth = 0
    for ch in values:
        if in_quote:
            cur.append(ch)
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == "'":
                in_quote = False
        else:
            if ch == "'":
                in_quote = True
                cur.append(ch)
            elif ch == "(":
                if depth > 0:
                    cur.append(ch)
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    rows.append("".join(cur))
                    cur = []
                else:
                    cur.append(ch)
            elif ch == "," and depth == 0:
                pass
            else:
                if depth > 0:
                    cur.append(ch)
    return rows


def parse_table(text: str, table: str) -> list[list[str | None]]:
    block = extract_block(text, table)
    if not block:
        return []
    records: list[list[str | None]] = []
    for stmt in parse_insert_statements(block):
        for row in parse_values(stmt):
            records.append([parse_sql_value(f) for f in split_fields(row)])
    return records


def first_image_in_text(*parts: str) -> list[str]:
    urls: list[str] = []
    for part in parts:
        if not part:
            continue
        for url in IMAGE_RE.findall(part):
            if url not in urls:
                urls.append(url)
    return urls


def parse_price(v: str | None) -> float:
    if not v:
        return 0.0
    t = html_to_text(v)
    t = t.replace("US$", "").replace("USD", "").replace("$", "").replace("€", "").strip()
    m = re.search(r"([0-9][0-9.,\s]*)", t)
    if not m:
        return 0.0
    num = re.sub(r"\s+", "", m.group(1))
    if "." in num and "," in num:
        num = num.replace(".", "").replace(",", ".")
    elif "," in num:
        if len(num.rsplit(",", 1)[-1]) == 3:
            num = num.replace(",", "")
        else:
            num = num.replace(",", ".")
    elif "." in num:
        if len(num.rsplit(".", 1)[-1]) == 3:
            num = num.replace(".", "")
    try:
        return round(float(num), 2)
    except ValueError:
        return 0.0
def format_pt_date(dt: datetime) -> str:
    return f"{dt.day} de {MONTH_NAMES[dt.month]} de {dt.year}"


def parse_date_from_title(title: str) -> datetime | None:
    m = re.search(r"(\d{1,2})\s+de\s+([^\d]+?)\s+(\d{4})", title, re.I)
    if m:
        day = int(m.group(1))
        month_key = re.sub(r"[^a-zà-ÿãõç]+", "", m.group(2).lower())
        month = MONTH_MAP.get(month_key)
        year = int(m.group(3))
        if month:
            return datetime(year, month, day)
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", title)
    if m:
        return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
    return None
def derive_region(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["rio de janeiro", "amaz", "iguacu", "iguassu"]):
        return "america-do-sul"
    if any(k in t for k in ["jord", "dubai", "turquia", "marrocos", "libano", "italia", "abu dhabi"]):
        return "multi-destino"
    return "egito"


def derive_destination_name(title: str) -> str:
    t = title.lower()
    if "alexandria" in t:
        return "Alexandria"
    if "sharm el sheikh" in t:
        return "Sharm El Sheikh"
    if "hurghada" in t:
        return "Hurghada"
    if "marsa alam" in t:
        return "Marsa Alam"
    if "luxor" in t and "aswan" in t:
        return "Luxor & Aswan"
    if "cairo" in t and "giza" in t:
        return "Cairo & Giza"
    if "siwa" in t:
        return "Siwa Oasis"
    if "sinai" in t or "catarina" in t:
        return "Sinai & Santa Catarina"
    if "dubai" in t:
        return "Dubai"
    if "jord" in t or "petra" in t or "wadi rum" in t:
        return "JordÃ¢nia"
    if "rio de janeiro" in t:
        return "Rio de Janeiro"
    return "Egito"


def derive_category(title: str) -> str:
    t = title.lower()
    if any(k in t for k in ["natal", "reveillon", "carnaval", "semana santa", "lua de mel"]):
        return "Temporada & Especiais"
    if any(k in t for k in ["sharm", "hurghada", "marsa alam", "sinai"]):
        return "Mar Vermelho & Sinai"
    if any(k in t for k in ["jord", "dubai", "turquia", "marrocos", "libano", "italia"]):
        return "Multi-Destino"
    if any(k in t for k in ["alexandria", "cairo", "giza", "luxor", "aswan", "nilo", "abu simbel", "dandara", "sakkara"]):
        return "ClÃ¡ssico & HistÃ³rico"
    if any(k in t for k in ["siwa", "deserto", "mergulho", "balao"]):
        return "ExperiÃªncias & Aventuras"
    return "Egito & Cultura"


def derive_city_name(title: str) -> str:
    t = title.lower()
    names: list[str] = []
    candidates = [
        ("Cairo", ["cairo"]),
        ("Luxor", ["luxor"]),
        ("Aswan", ["aswan", "assuan"]),
        ("Alexandria", ["alexandria"]),
        ("Hurghada", ["hurghada"]),
        ("Sharm El Sheikh", ["sharm el sheikh", "sharm"]),
        ("Marsa Alam", ["marsa alam"]),
        ("Siwa", ["siwa"]),
        ("Petra", ["petra"]),
        ("Dubai", ["dubai"]),
        ("AmÃ£", ["amÃ£", "amman"]),
        ("Rio de Janeiro", ["rio de janeiro"]),
        ("IguaÃ§u", ["iguacu", "iguassu"]),
        ("JordÃ¢nia", ["jord"]),
        ("Marrocos", ["marrocos"]),
    ]
    for name, keys in candidates:
        if any(k in t for k in keys) and name not in names:
            names.append(name)
    if not names:
        return derive_destination_name(title)
    return ", ".join(names[:4])


def collect_list_items(meta: list[tuple[str, str]], prefix: str) -> list[str]:
    items: list[str] = []
    for k, v in meta:
        if k.startswith(prefix) and v:
            txt = html_to_text(v)
            if txt and txt not in items:
                items.append(txt)
    return items


def build_itinerary(meta: list[tuple[str, str]]) -> list[dict]:
    data = {k: v for k, v in meta}
    steps: list[dict] = []
    for i in range(0, 20):
        title = data.get(f"program_details_{i}_day_title")
        body = data.get(f"program_details_{i}_day_details")
        if not title and not body:
            continue
        steps.append(
            {
                "day": i + 1,
                "title": html_to_text(title or f"Dia {i + 1}"),
                "description": html_to_text(body or ""),
                "meals": None,
            }
        )
    return steps


def build_packages(post_id: int, title: str, duration_days: int, base_price: float, post_date: str) -> list[dict]:
    start = parse_date_from_title(title)
    if not start:
        try:
            start = datetime.strptime(post_date[:10], "%Y-%m-%d")
        except Exception:
            start = datetime(2026, 1, 1)
    end = start + timedelta(days=max(duration_days - 1, 0))
    return [
        {
            "id": f"pkg-{post_id}",
            "title": format_pt_date(start),
            "start_date": start.strftime("%Y-%m-%d"),
            "end_date": end.strftime("%Y-%m-%d"),
            "price_per_person": f"{base_price:.2f}",
            "available_spots": 8 if duration_days <= 10 else 6,
            "status": "active",
        }
    ]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sql", required=True, help="Path to the WordPress SQL dump")
    parser.add_argument("--out", required=True, help="Output JSON file")
    args = parser.parse_args()

    sql_path = Path(args.sql)
    out_path = Path(args.out)
    text = sql_path.read_text(encoding="utf-8", errors="ignore")

    posts_rows = parse_table(text, TABLES["posts"])
    postmeta_rows = parse_table(text, TABLES["postmeta"])
    terms_rows = parse_table(text, TABLES["terms"])
    term_tax_rows = parse_table(text, TABLES["term_taxonomy"])
    term_rel_rows = parse_table(text, TABLES["term_relationships"])
    users_rows = parse_table(text, TABLES["users"])
    usermeta_rows = parse_table(text, TABLES["usermeta"])
    options_rows = parse_table(text, TABLES["options"])
    comments_rows = parse_table(text, TABLES["comments"])

    posts = []
    for row in posts_rows:
        if len(row) != 23:
            continue
        posts.append(
            {
                "ID": int(row[0]),
                "post_author": int(row[1]) if str(row[1]).isdigit() else 0,
                "post_date": row[2] or "",
                "post_date_gmt": row[3] or "",
                "post_content": row[4] or "",
                "post_title": row[5] or "",
                "post_excerpt": row[6] or "",
                "post_status": row[7] or "",
                "comment_status": row[8] or "",
                "ping_status": row[9] or "",
                "post_password": row[10] or "",
                "post_name": row[11] or "",
                "to_ping": row[12] or "",
                "pinged": row[13] or "",
                "post_modified": row[14] or "",
                "post_modified_gmt": row[15] or "",
                "post_content_filtered": row[16] or "",
                "post_parent": int(row[17]) if str(row[17]).isdigit() else 0,
                "guid": row[18] or "",
                "menu_order": int(row[19]) if str(row[19]).isdigit() else 0,
                "post_type": row[20] or "",
                "post_mime_type": row[21] or "",
                "comment_count": int(row[22]) if str(row[22]).isdigit() else 0,
            }
        )

    post_by_id = {p["ID"]: p for p in posts}
    attachments = {p["ID"]: p["guid"] for p in posts if p["post_type"] == "attachment" and p["guid"]}

    postmeta: defaultdict[int, list[tuple[str, str]]] = defaultdict(list)
    for row in postmeta_rows:
        if len(row) != 4:
            continue
        post_id = int(row[1]) if str(row[1]).isdigit() else 0
        postmeta[post_id].append((row[2] or "", row[3] or ""))

    terms = {int(r[0]): {"name": r[1] or "", "slug": r[2] or "", "group": int(r[3]) if str(r[3]).isdigit() else 0} for r in terms_rows if len(r) == 4}
    term_tax = {int(r[0]): {"term_id": int(r[1]), "taxonomy": r[2] or "", "description": r[3] or "", "parent": int(r[4]) if str(r[4]).isdigit() else 0, "count": int(r[5]) if str(r[5]).isdigit() else 0} for r in term_tax_rows if len(r) == 6}
    term_ids_by_post: defaultdict[int, list[int]] = defaultdict(list)
    for r in term_rel_rows:
        if len(r) != 3:
            continue
        obj_id = int(r[0]) if str(r[0]).isdigit() else 0
        tax_id = int(r[1]) if str(r[1]).isdigit() else 0
        term_ids_by_post[obj_id].append(tax_id)

    users = {}
    for row in users_rows:
        if len(row) != 10:
            continue
        users[int(row[0])] = {"login": row[1] or "", "email": row[4] or "", "display_name": row[9] or row[1] or ""}

    user_meta: defaultdict[int, dict[str, str]] = defaultdict(dict)
    for row in usermeta_rows:
        if len(row) != 4:
            continue
        user_id = int(row[1]) if str(row[1]).isdigit() else 0
        user_meta[user_id][row[2] or ""] = row[3] or ""

    options = {row[1]: row[2] for row in options_rows if len(row) == 4}

    comments = []
    for row in comments_rows:
        if len(row) != 15:
            continue
        comments.append(
            {
                "comment_ID": int(row[0]) if str(row[0]).isdigit() else 0,
                "comment_post_ID": int(row[1]) if str(row[1]).isdigit() else 0,
                "comment_author": row[2] or "",
                "comment_author_email": row[3] or "",
                "comment_author_url": row[4] or "",
                "comment_author_IP": row[5] or "",
                "comment_date": row[6] or "",
                "comment_date_gmt": row[7] or "",
                "comment_content": row[8] or "",
                "comment_karma": int(row[9]) if str(row[9]).isdigit() else 0,
                "comment_approved": row[10] or "",
                "comment_agent": row[11] or "",
                "comment_type": row[12] or "",
                "comment_parent": int(row[13]) if str(row[13]).isdigit() else 0,
                "user_id": int(row[14]) if str(row[14]).isdigit() else 0,
            }
        )

    def pick_meta(post_id: int, key: str) -> str | None:
        for k, v in postmeta.get(post_id, []):
            if k == key:
                return v
        return None

    def first_attachment_url_from_meta(post_id: int) -> str | None:
        thumb = pick_meta(post_id, "_thumbnail_id")
        if thumb and str(thumb).isdigit():
            return attachments.get(int(thumb))
        return None

    def pick_tax_names(post_id: int, taxonomy: str) -> list[str]:
        names: list[str] = []
        for tax_id in term_ids_by_post.get(post_id, []):
            tax = term_tax.get(tax_id)
            if not tax or tax["taxonomy"] != taxonomy:
                continue
            term = terms.get(tax["term_id"])
            if term and term["name"] not in names:
                names.append(term["name"])
        return names

    def build_author(user_id: int) -> dict:
        user = users.get(user_id, {"display_name": "Girasol"})
        meta = user_meta.get(user_id, {})
        first = html_to_text(meta.get("first_name", ""))
        last = html_to_text(meta.get("last_name", ""))
        display = html_to_text(user.get("display_name", "") or user.get("login", "") or "Equipe")
        name = " ".join(x for x in [first, last] if x).strip() or display
        role = "Fundador & Administrador" if user_id == 1 else "OperaÃ§Ãµes & ConteÃºdo"
        bio = html_to_text(meta.get("description", "")) or "ResponsÃ¡vel pela operaÃ§Ã£o editorial e pelo atendimento da agÃªncia."
        return {
            "name": name,
            "role": role,
            "bio": bio,
            "image": f"https://ui-avatars.com/api/?name={re.sub(r'\\s+', '+', name)}&background=1B5E20&color=ffffff&size=512",
        }

    team = [build_author(uid) for uid in sorted(users)]
    if len(team) < 3:
        team.extend(
            [
                {
                    "name": "Equipe de Atendimento",
                    "role": "Concierge & Reservas",
                    "bio": "Suporte dedicado para reservas, personalizaÃ§Ã£o de roteiros e assistÃªncia durante a viagem.",
                    "image": "https://ui-avatars.com/api/?name=Atendimento&background=2E7D32&color=ffffff&size=512",
                },
                {
                    "name": "Equipe Local",
                    "role": "OperaÃ§Ãµes no Egito",
                    "bio": "CoordenaÃ§Ã£o local dos traslados, guias e logÃ­stica de viagens em terra.",
                    "image": "https://ui-avatars.com/api/?name=Local&background=FBC02D&color=263238&size=512",
                },
            ]
        )
    team = team[:3]

    published_posts = [p for p in posts if p["post_status"] == "publish"]
    blog_posts = []
    tour_posts = []
    page_posts = []
    for p in published_posts:
        if p["post_type"] == "post":
            blog_posts.append(p)
        elif p["post_type"] == "tour":
            tour_posts.append(p)
        elif p["post_type"] == "page":
            page_posts.append(p)

    blog_data = []
    for p in blog_posts:
        categories = pick_tax_names(p["ID"], "category")
        category = categories[0] if categories else "Egito & Cultura"
        content_html = p["post_content"] or ""
        content_text = html_to_text(content_html)
        excerpt = html_to_text(p["post_excerpt"]) if p["post_excerpt"] else text_excerpt(content_text, 220)
        thumb = first_attachment_url_from_meta(p["ID"])
        if not thumb:
            imgs = first_image_in_text(content_html)
            thumb = imgs[0] if imgs else "https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1200"
        tag_terms = pick_tax_names(p["ID"], "post_tag")
        if not tag_terms:
            tag_terms = [category, "Egito"]
        author = build_author(p["post_author"])
        try:
            dt = datetime.strptime((p["post_date"] or "2024-01-01")[:10], "%Y-%m-%d")
            published_label = format_pt_date(dt)
        except Exception:
            published_label = (p["post_date"] or "")[:10]
        read_time = max(1, math.ceil(max(1, len(content_text.split())) / 220))
        blog_data.append(
            {
                "id": str(p["ID"]),
                "title": html_to_text(p["post_title"]),
                "slug": p["post_name"] or slugify_simple(p["post_title"]),
                "excerpt": excerpt,
                "content": content_text,
                "cover_image": thumb,
                "category": category,
                "author": {
                    "name": author["name"],
                    "role": "RedaÃ§Ã£o Girasol",
                    "avatar": f"https://ui-avatars.com/api/?name={re.sub(r'\\s+', '+', author['name'])}&background=1B5E20&color=ffffff&size=256",
                },
                "published_at": published_label,
                "read_time": f"{read_time} min de leitura",
                "tags": tag_terms,
                "featured": "egito" in category.lower() or "cairo" in category.lower(),
            }
        )

    tours_data = []
    for idx, p in enumerate(tour_posts):
        meta = postmeta.get(p["ID"], [])
        title = html_to_text(p["post_title"])
        base_price = parse_price(pick_meta(p["ID"], "tour_price"))
        duration_days = 8
        if pick_meta(p["ID"], "additional_details_0_details"):
            m = re.search(r"(\d+)\s*(?:Dias|Dia)", html_to_text(pick_meta(p["ID"], "additional_details_0_details") or ""), re.I)
            if m:
                duration_days = int(m.group(1))
        m2 = re.search(r"(\d+)\s*Dias?", title, re.I)
        if m2:
            duration_days = int(m2.group(1))
        description_source = pick_meta(p["ID"], "tour_preif") or p["post_excerpt"] or p["post_content"] or ""
        description = text_excerpt(description_source, 320) or title
        primary_image = first_attachment_url_from_meta(p["ID"])
        if not primary_image:
            content_imgs = first_image_in_text(description_source, p["post_content"])
            primary_image = content_imgs[0] if content_imgs else "https://images.unsplash.com/photo-1544885935-98dd03b09034?q=80&w=1200"
        gallery = first_image_in_text(description_source, p["post_content"])[:6]
        if primary_image not in gallery:
            gallery = [primary_image] + gallery
        inclusions = collect_list_items(meta, "whats_included_")
        exclusions = collect_list_items(meta, "whats_not_included_")
        itinerary = build_itinerary(meta)
        if not itinerary and description_source:
            itinerary = [{"day": 1, "title": "Resumo do roteiro", "description": text_excerpt(description_source, 220), "meals": None}]
        region = derive_region(title)
        packages = []
        start = parse_date_from_title(title)
        if not start:
            try:
                start = datetime.strptime((p["post_date"] or "2026-01-01")[:10], "%Y-%m-%d")
            except Exception:
                start = datetime(2026, 1, 1)
        end = start + timedelta(days=max(duration_days - 1, 0))
        packages.append(
            {
                "id": f"pkg-{p['ID']}",
                "title": format_pt_date(start),
                "start_date": start.strftime("%Y-%m-%d"),
                "end_date": end.strftime("%Y-%m-%d"),
                "price_per_person": f"{base_price:.2f}",
                "available_spots": 8 if duration_days <= 10 else 6,
                "status": "active",
            }
        )
        tours_data.append(
            {
                "id": str(p["ID"]),
                "name": title,
                "slug": p["post_name"] or slugify_simple(title),
                "city_name": derive_city_name(title),
                "country": "Brasil" if region == "america-do-sul" else "Egito",
                "category": derive_category(title),
                "duration_days": duration_days,
                "difficulty": "FÃ¡cil" if duration_days <= 8 else ("Moderado" if duration_days <= 14 else "Aventura"),
                "base_price": f"{base_price:.2f}" if base_price else "0.00",
                "primary_image": primary_image,
                "gallery": gallery,
                "average_rating": 4.8,
                "reviews_count": p["comment_count"] or 0,
                "description": description,
                "inclusions": inclusions,
                "exclusions": exclusions,
                "itinerary": itinerary,
                "featured": idx < 12 or any(k in title.lower() for k in ["milenar", "esplendor", "maravilhas", "melhor", "glamour", "jornada", "rota", "tesouros"]),
                "is_multi_destination": region == "multi-destino",
                "packages": packages,
            }
        )

    pages_data = []
    for p in page_posts:
        pages_data.append(
            {
                "id": str(p["ID"]),
                "title": html_to_text(p["post_title"]),
                "slug": p["post_name"] or slugify_simple(p["post_title"]),
                "content": html_to_text(p["post_content"] or p["post_excerpt"] or ""),
                "is_active": True,
            }
        )

    comment_candidates = [
        c
        for c in comments
        if str(c["comment_approved"]) == "1" and not c["comment_type"] and len(html_to_text(c["comment_content"])) >= 40
    ]
    reviews = []
    for c in comment_candidates:
        if len(reviews) >= 8:
            break
        content = html_to_text(c["comment_content"])
        if "http" in content.lower() and len(content.split()) < 14:
            continue
        linked = post_by_id.get(c["comment_post_ID"])
        linked_title = html_to_text(linked["post_title"]) if linked else "ConteÃºdo do site"
        name = html_to_text(c["comment_author"]) or "Leitor"
        reviews.append(
            {
                "id": f"rev-{c['comment_ID']}",
                "author": name,
                "country": "Leitor do site",
                "rating": 5,
                "date": c["comment_date"][:7],
                "title": text_excerpt(content, 40),
                "comment": text_excerpt(content, 220),
                "tour_name": linked_title,
            }
        )
    if not reviews:
        reviews = [
            {
                "id": "rev-1",
                "author": "Leitor do site",
                "country": "ComentÃ¡rio real",
                "rating": 5,
                "date": "2024-01",
                "title": "ComentÃ¡rios importados do WordPress",
                "comment": "O site foi migrado a partir do conteÃºdo real do WordPress.",
                "tour_name": "ImportaÃ§Ã£o",
            }
        ]

    faqs = [
        {
            "id": "faq-1",
            "category": "reservas",
            "question": "Como funciona a reserva dos pacotes?",
            "answer": "A reserva Ã© confirmada com sinal e o restante do pagamento segue as condiÃ§Ãµes apresentadas em cada roteiro. Os detalhes de valores e prazos vÃªm diretamente das pÃ¡ginas de programa e valores importadas do WordPress.",
        },
        {
            "id": "faq-2",
            "category": "vistos",
            "question": "O visto para o Egito estÃ¡ incluso?",
            "answer": "Em alguns roteiros o visto estÃ¡ incluso; em outros, o valor Ã© informado separadamente na parte de investimentos e condiÃ§Ãµes do pacote. O conteÃºdo original do WordPress jÃ¡ diferencia esses casos por roteiro.",
        },
        {
            "id": "faq-3",
            "category": "cruzeiro",
            "question": "Os cruzeiros no Nilo incluem refeiÃ§Ãµes?",
            "answer": "Sim. Os roteiros de cruzeiro importados trazem pensÃ£o completa ou meia pensÃ£o de acordo com o pacote, alÃ©m de detalhes do navio e das noites a bordo.",
        },
        {
            "id": "faq-4",
            "category": "seguranca",
            "question": "Os passeios sÃ£o com guia em portuguÃªs?",
            "answer": "Os roteiros originais destacam atendimento com guia egiptÃ³logo que fala portuguÃªs ou espanhol, conforme disponibilidade, alÃ©m de suporte local nos aeroportos e traslados.",
        },
        {
            "id": "faq-5",
            "category": "geral",
            "question": "Posso personalizar meu roteiro?",
            "answer": "Sim. O site original trabalha com roteiros sob medida, extensÃµes e combinaÃ§Ãµes com Sharm El Sheikh, Hurghada, Alexandria, JordÃ¢nia, Dubai e outros destinos.",
        },
        {
            "id": "faq-6",
            "category": "booking",
            "question": "HÃ¡ saÃ­das programadas e pacotes especiais?",
            "answer": "Sim. O conteÃºdo importado inclui saÃ­das com datas especÃ­ficas, pacotes promocionais, carnaval, pÃ¡scoa, natal e rÃ©veillon, alÃ©m de viagens temÃ¡ticas como o Caminho de MoisÃ©s e o Egito Milenar.",
        },
    ]

    offices = [
        {
            "city": "Cairo (Sede Principal)",
            "country": "Egito",
            "address": "Site oficial do projeto com atendimento no Egito.",
            "phone": "+20 2 3771 5511",
            "email": "admin@admin.com",
            "whatsapp": "+201060873700",
            "hours": "Segunda a SÃ¡bado: 09h00 Ã s 19h00",
            "is_headquarters": True,
        },
        {
            "city": "Luxor",
            "country": "Egito",
            "address": "Atendimento operacional para cruzeiros e passeios no Alto Egito.",
            "phone": "+20 1227 011 900",
            "email": "info@girasoltours.com",
            "whatsapp": "+201060873700",
            "hours": "Diariamente: 08h00 Ã s 20h00",
        },
        {
            "city": "Aswan",
            "country": "Egito",
            "address": "Base logÃ­stica para roteiros do Nilo e Abu Simbel.",
            "phone": "+20 1227 011 900",
            "email": "reservas@girasoltours.com",
            "whatsapp": "+201060873700",
            "hours": "Diariamente: 08h00 Ã s 20h00",
        },
        {
            "city": "Hurghada & Mar Vermelho",
            "country": "Egito",
            "address": "OperaÃ§Ã£o de praia, mergulho e resorts no Mar Vermelho.",
            "phone": "+20 2 3771 5511",
            "email": "info@girasoltours.com",
            "whatsapp": "+201060873700",
            "hours": "Diariamente: 09h00 Ã s 21h00",
        },
        {
            "city": "SÃ£o Paulo (Atendimento Brasil)",
            "country": "Brasil",
            "address": "Atendimento comercial para viajantes da AmÃ©rica Latina.",
            "phone": "+55 11 3280 4400",
            "email": "brasil@girasoltours.com",
            "whatsapp": "+201060873700",
            "hours": "Segunda a Sexta: 09h00 Ã s 18h00",
        },
    ]

    destinations = [
        {
            "id": "cairo",
            "name": "Cairo e GizÃ©",
            "slug": "cairo",
            "country": "Egito",
            "region": "egito",
            "tagline": "As PirÃ¢mides, a Esfinge e o coraÃ§Ã£o histÃ³rico do paÃ­s.",
            "description": "O Cairo concentra os roteiros mais fortes do acervo importado, com pirÃ¢mides, museus, bairro copta, Cairo islÃ¢mico e o mercado Khan el Khalili.",
            "cover_image": next((t["primary_image"] for t in tours_data if "cairo" in t["name"].lower()), "https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1200"),
            "gallery": [next((t["primary_image"] for t in tours_data if "cairo" in t["name"].lower()), "https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1200")],
            "best_time_to_visit": "Outubro a Abril",
            "ideal_duration": "3 a 5 dias",
            "language": "Ãrabe / PortuguÃªs com guia",
            "currency": "EGP / USD",
            "highlights": ["PirÃ¢mides de GizÃ©", "Museu EgÃ­pcio", "Bairro Copta", "Khan el Khalili", "Cidadela de Saladino"],
            "starting_price": min([float(t["base_price"]) for t in tours_data if "cairo" in t["city_name"].lower()] or [650]),
            "featured": True,
        },
        {
            "id": "luxor-aswan",
            "name": "Luxor & Aswan",
            "slug": "luxor-aswan",
            "country": "Egito",
            "region": "egito",
            "tagline": "O grande museu a cÃ©u aberto e o centro dos cruzeiros no Nilo.",
            "description": "Luxor e Aswan concentram cruzeiros, templos, o Vale dos Reis, Edfu, Kom Ombo e Abu Simbel em vÃ¡rios roteiros do dump.",
            "cover_image": next((t["primary_image"] for t in tours_data if "nilo" in t["name"].lower() or "luxor" in t["name"].lower()), "https://images.unsplash.com/photo-1544885935-98dd03b09034?q=80&w=1200"),
            "gallery": [next((t["primary_image"] for t in tours_data if "nilo" in t["name"].lower() or "luxor" in t["name"].lower()), "https://images.unsplash.com/photo-1544885935-98dd03b09034?q=80&w=1200")],
            "best_time_to_visit": "Outubro a Maio",
            "ideal_duration": "4 a 7 noites",
            "language": "Ãrabe / PortuguÃªs",
            "currency": "EGP / USD",
            "highlights": ["Vale dos Reis", "Templo de Karnak", "Templo de Philae", "Kom Ombo", "Abu Simbel"],
            "starting_price": min([float(t["base_price"]) for t in tours_data if "nilo" in t["name"].lower()] or [890]),
            "featured": True,
        },
        {
            "id": "sharm-el-sheikh",
            "name": "Sharm El Sheikh",
            "slug": "sharm-el-sheikh",
            "country": "Egito",
            "region": "egito",
            "tagline": "Sinai, mergulho e resorts do Mar Vermelho.",
            "description": "Sharm aparece em vÃ¡rios roteiros de Sinai, Monte MoisÃ©s, mergulho e praia no Mar Vermelho.",
            "cover_image": next((t["primary_image"] for t in tours_data if "sharm" in t["name"].lower()), "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200"),
            "gallery": [next((t["primary_image"] for t in tours_data if "sharm" in t["name"].lower()), "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200")],
            "best_time_to_visit": "MarÃ§o a Novembro",
            "ideal_duration": "3 a 6 dias",
            "language": "Ãrabe / InglÃªs / PortuguÃªs",
            "currency": "EGP / USD",
            "highlights": ["Ras Mohammed", "Monte Sinai", "Mergulho", "Resorts", "Ilha de Tiran"],
            "starting_price": min([float(t["base_price"]) for t in tours_data if "sharm" in t["name"].lower()] or [520]),
            "featured": False,
        },
        {
            "id": "hurghada",
            "name": "Hurghada",
            "slug": "hurghada",
            "country": "Egito",
            "region": "egito",
            "tagline": "Praias, snorkeling e resorts do Mar Vermelho.",
            "description": "Hurghada aparece nos roteiros completos com Mar Vermelho, praia e extensÃ£o apÃ³s os cruzeiros no Nilo.",
            "cover_image": next((t["primary_image"] for t in tours_data if "hurghada" in t["name"].lower()), "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200"),
            "gallery": [next((t["primary_image"] for t in tours_data if "hurghada" in t["name"].lower()), "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200")],
            "best_time_to_visit": "Ano inteiro",
            "ideal_duration": "3 a 5 dias",
            "language": "Ãrabe / PortuguÃªs",
            "currency": "EGP / USD",
            "highlights": ["Ilhas Giftun", "Mergulho", "Safari no deserto", "Resorts all-inclusive"],
            "starting_price": min([float(t["base_price"]) for t in tours_data if "hurghada" in t["name"].lower()] or [480]),
            "featured": False,
        },
        {
            "id": "alexandria",
            "name": "Alexandria",
            "slug": "alexandria",
            "country": "Egito",
            "region": "egito",
            "tagline": "Biblioteca, fortaleza e o litoral mediterrÃ¢neo.",
            "description": "Alexandria aparece em mÃºltiplos roteiros de passeio curto e combinaÃ§Ã£o com Cairo e Luxor.",
            "cover_image": next((t["primary_image"] for t in tours_data if "alexandria" in t["name"].lower()), "https://images.unsplash.com/photo-1579606032822-e30a5f979ec8?q=80&w=1200"),
            "gallery": [next((t["primary_image"] for t in tours_data if "alexandria" in t["name"].lower()), "https://images.unsplash.com/photo-1579606032822-e30a5f979ec8?q=80&w=1200")],
            "best_time_to_visit": "MarÃ§o a Junho e Setembro a Novembro",
            "ideal_duration": "1 a 2 dias",
            "language": "Ãrabe / PortuguÃªs",
            "currency": "EGP / USD",
            "highlights": ["Bibliotheca Alexandrina", "Cidadela de Qaitbay", "Catacumbas", "Jardins de Montazah"],
            "starting_price": min([float(t["base_price"]) for t in tours_data if "alexandria" in t["name"].lower()] or [290]),
            "featured": False,
        },
        {
            "id": "siwa",
            "name": "OÃ¡sis de Siwa",
            "slug": "siwa",
            "country": "Egito",
            "region": "egito",
            "tagline": "Deserto, fontes e uma das paisagens mais singulares do paÃ­s.",
            "description": "OÃ¡sis de Siwa aparece nos artigos e consultas de destinos exÃ³ticos e deserto ocidental.",
            "cover_image": "https://images.unsplash.com/photo-1540963211024-2d8c3d0b6be1?q=80&w=1200",
            "gallery": ["https://images.unsplash.com/photo-1540963211024-2d8c3d0b6be1?q=80&w=1200"],
            "best_time_to_visit": "Outubro a Abril",
            "ideal_duration": "2 a 4 dias",
            "language": "Ãrabe / InglÃªs",
            "currency": "EGP / USD",
            "highlights": ["Fontes naturais", "Montanha dos Mortos", "Deserto Ocidental", "Povoado Berbere"],
            "starting_price": 390,
            "featured": False,
        },
        {
            "id": "jordania",
            "name": "JordÃ¢nia",
            "slug": "jordania",
            "country": "JordÃ¢nia",
            "region": "multi-destino",
            "tagline": "Petra, Mar Morto e as extensÃµes multi-paÃ­s do portfÃ³lio.",
            "description": "Os roteiros internacionais do dump incluem JordÃ¢nia combinada com Egito em diferentes jornadas longas.",
            "cover_image": "https://images.unsplash.com/photo-1539650116574-75c0c6d9b7c0?q=80&w=1200",
            "gallery": ["https://images.unsplash.com/photo-1539650116574-75c0c6d9b7c0?q=80&w=1200"],
            "best_time_to_visit": "Outubro a Abril",
            "ideal_duration": "4 a 7 dias",
            "language": "Ãrabe / InglÃªs",
            "currency": "JOD / USD",
            "highlights": ["Petra", "Wadi Rum", "Mar Morto", "AmÃ£"],
            "starting_price": 890,
            "featured": True,
        },
        {
            "id": "dubai",
            "name": "Dubai",
            "slug": "dubai",
            "country": "Emirados Ãrabes Unidos",
            "region": "multi-destino",
            "tagline": "CombinaÃ§Ãµes internacionais com luxo e conexÃ£o aÃ©rea.",
            "description": "Dubai aparece nos roteiros como extensÃ£o internacional em jornadas premium.",
            "cover_image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200",
            "gallery": ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200"],
            "best_time_to_visit": "Outubro a Abril",
            "ideal_duration": "3 a 5 dias",
            "language": "Ãrabe / InglÃªs",
            "currency": "AED / USD",
            "highlights": ["Burj Khalifa", "Safari no deserto", "Marina", "Compras"],
            "starting_price": 1200,
            "featured": False,
        },
    ]

    meta = {
        "siteurl": options.get("siteurl", "https://www.girasoltours.com/Viagens"),
        "blogname": html_to_text(options.get("blogname", "Girasol")),
        "blogdescription": html_to_text(options.get("blogdescription", "")),
        "user_count": len(users),
        "post_count": len(posts),
        "tour_count": len(tours_data),
        "blog_count": len(blog_data),
        "page_count": len(pages_data),
    }

    output = {
        "MOCK_DESTINATIONS": destinations,
        "MOCK_TOURS": tours_data,
        "MOCK_BLOG_POSTS": blog_data,
        "MOCK_FAQS": faqs,
        "MOCK_REVIEWS": reviews,
        "MOCK_OFFICES": offices,
        "MOCK_TEAM": team,
        "SITE_META": meta,
        "PAGES": pages_data,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {out_path}")
    print(
        f"Tours: {len(tours_data)}, Posts: {len(blog_data)}, Pages: {len(pages_data)}, Reviews: {len(reviews)}, Destinations: {len(destinations)}"
    )


if __name__ == "__main__":
    main()


