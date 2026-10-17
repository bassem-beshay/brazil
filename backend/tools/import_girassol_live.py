from __future__ import annotations

import hashlib
import html
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from bs4 import BeautifulSoup, Tag


ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = ROOT / "frontend" / "src" / "lib" / "siteData.generated.json"
MEDIA_DIR = ROOT / "frontend" / "public" / "girassol-media"
BASE_URL = "https://www.girassolviagens.com"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 Chrome/141.0.0.0 Safari/537.36"
)

PORTUGUESE_MONTHS = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
]


def curl_bytes(url: str) -> bytes:
    last_error = ""
    for _ in range(3):
        result = subprocess.run(
            ["curl.exe", "-L", "--fail", "--silent", "--show-error", "-A", USER_AGENT, url],
            capture_output=True,
        )
        if result.returncode == 0:
            return result.stdout
        last_error = result.stderr.decode("utf-8", "replace")
    raise RuntimeError(f"Could not fetch {url}: {last_error}")


def curl_text(url: str) -> str:
    return curl_bytes(url).decode("utf-8", "replace")


def curl_json(url: str):
    return json.loads(curl_text(url))


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    soup = BeautifulSoup(html.unescape(value), "html.parser")
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True)).strip()


def html_to_text(value: str | None) -> str:
    if not value:
        return ""
    soup = BeautifulSoup(html.unescape(value), "html.parser")
    for node in soup.select("script, style, form, noscript"):
        node.decompose()

    blocks: list[str] = []
    block_names = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote"}
    for node in soup.find_all(block_names):
        if any(isinstance(parent, Tag) and parent.name in block_names for parent in node.parents if parent is not soup):
            continue
        text = re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip()
        if not text:
            continue
        if node.name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            level = min(int(node.name[1]), 2)
            text = f"{'#' * level} {text}"
        elif node.name == "li":
            text = f"- {text}"
        blocks.append(text)

    if not blocks:
        return clean_text(value)
    return "\n\n".join(blocks)


def embedded_media(item: dict, preferred: str = "medium_large") -> str:
    media = (item.get("_embedded") or {}).get("wp:featuredmedia") or []
    if not media:
        return ""
    record = media[0]
    sizes = ((record.get("media_details") or {}).get("sizes") or {})
    for size in [preferred, "large", "medium", "full"]:
        source = (sizes.get(size) or {}).get("source_url")
        if source:
            return source
    return record.get("source_url") or ""


def localize_media(url: str, label: str, verbose: bool = True) -> str:
    if not url:
        return ""
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    suffix = Path(urlparse(url).path).suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        suffix = ".jpg"
    filename = f"{hashlib.sha256(url.encode('utf-8')).hexdigest()[:16]}{suffix}"
    target = MEDIA_DIR / filename
    if not target.exists() or target.stat().st_size < 512:
        target.write_bytes(curl_bytes(url))
    if verbose:
        print(f"media {label}: {filename}")
    return f"/girassol-media/{filename}"


def embedded_terms(item: dict) -> tuple[str, list[str]]:
    groups = (item.get("_embedded") or {}).get("wp:term") or []
    categories: list[str] = []
    tags: list[str] = []
    for group in groups:
        for term in group or []:
            taxonomy = term.get("taxonomy")
            name = clean_text(term.get("name"))
            if not name:
                continue
            if taxonomy == "category":
                categories.append(name)
            elif taxonomy == "post_tag":
                tags.append(name)
    category = next((name for name in categories if name.lower() != "blog"), "Blog")
    return category, tags


def date_label(value: str) -> str:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return f"{parsed.day} de {PORTUGUESE_MONTHS[parsed.month - 1]} de {parsed.year}"
    except (TypeError, ValueError):
        return value[:10] if value else ""


def fetch_posts() -> list[dict]:
    posts: list[dict] = []
    for page in range(1, 9):
        url = (
            f"{BASE_URL}/wp-json/wp/v2/posts?categories=8&per_page=100&page={page}"
            "&order=asc&_embed=wp:featuredmedia,wp:term,author"
        )
        batch = curl_json(url)
        print(f"blog page {page}: {len(batch)} posts")
        for index, item in enumerate(batch):
            content = html_to_text((item.get("content") or {}).get("rendered"))
            excerpt = clean_text((item.get("excerpt") or {}).get("rendered"))
            category, tags = embedded_terms(item)
            authors = (item.get("_embedded") or {}).get("author") or []
            author_name = clean_text(authors[0].get("name")) if authors else "Redação Girassol"
            image_url = embedded_media(item, "medium")
            words = len(re.findall(r"\w+", content, re.UNICODE))
            posts.append(
                {
                    "id": str(item["id"]),
                    "title": clean_text((item.get("title") or {}).get("rendered")),
                    "slug": item.get("slug") or f"post-{item['id']}",
                    "excerpt": excerpt,
                    "content": content,
                    "cover_image": image_url,
                    "category": category,
                    "author": {
                        "name": author_name or "Redação Girassol",
                        "role": "Equipe Girassol Brasil Viagens e Turismo",
                        "avatar": "/brand/girassol-brasil-transparent.png",
                    },
                    "published_at": date_label(item.get("date") or ""),
                    "read_time": f"{max(1, round(words / 200))} min de leitura",
                    "tags": tags,
                    "featured": len(posts) < 3,
                }
            )
    unique_images = sorted({post["cover_image"] for post in posts if post["cover_image"]})
    print(f"localizing {len(unique_images)} blog cover images")
    with ThreadPoolExecutor(max_workers=12) as executor:
        localized = list(executor.map(lambda url: localize_media(url, "blog", False), unique_images))
    image_map = dict(zip(unique_images, localized))
    for post in posts:
        post["cover_image"] = image_map.get(post["cover_image"], post["cover_image"])
    return posts


def listing_order() -> list[str]:
    slugs: list[str] = []
    for url in [f"{BASE_URL}/nossas-viagens/", f"{BASE_URL}/nossas-viagens/2/"]:
        soup = BeautifulSoup(curl_text(url), "html.parser")
        for link in soup.select("article.tour h3.elementor-post__title a[href]"):
            slug = urlparse(link.get("href") or "").path.strip("/").split("/")[-1]
            if slug and slug not in slugs:
                slugs.append(slug)
    return slugs


def package_ratings() -> dict[str, tuple[float, int]]:
    soup = BeautifulSoup(curl_text(f"{BASE_URL}/"), "html.parser")
    ratings: dict[str, tuple[float, int]] = {}
    for wrapper in soup.select(".elementor-star-rating__wrapper"):
        container = wrapper.find_parent(class_=lambda value: value and "elementor-element" in value)
        for _ in range(5):
            if not container:
                break
            link = container.select_one("h4 a[href], h3 a[href]")
            if link:
                slug = urlparse(link.get("href") or "").path.strip("/").split("/")[-1]
                value = wrapper.select_one("[itemprop='ratingValue']")
                count_match = re.search(r"(\d+)\s*Avalia", wrapper.get_text(" ", strip=True), re.I)
                value_match = re.search(r"Rated\s+([\d.]+)", value.get_text(" ", strip=True) if value else "", re.I)
                ratings[slug] = (
                    float(value_match.group(1)) if value_match else 5.0,
                    int(count_match.group(1)) if count_match else 0,
                )
                break
            container = container.parent if isinstance(container.parent, Tag) else None
    return ratings


def section_items(soup: BeautifulSoup, heading_text: str) -> list[str]:
    normalized_target = clean_text(heading_text).lower()
    for heading in soup.select("h2, h3, h4"):
        if clean_text(heading.get_text(" ", strip=True)).lower() != normalized_target:
            continue
        parent = heading
        for _ in range(5):
            parent = parent.parent
            if not isinstance(parent, Tag):
                break
            items = [clean_text(li.get_text(" ", strip=True)) for li in parent.select("li")]
            items = [item for item in items if item]
            if items:
                return items
    return []


def destination_for(title: str, description: str) -> tuple[str, str, str, bool]:
    value = f"{title} {description}".lower()
    matches = []
    for needle, label, country in [
        ("jord", "Jordânia", "Jordânia"),
        ("marrocos", "Marrocos", "Marrocos"),
        ("dubai", "Dubai", "Emirados Árabes Unidos"),
        ("turquia", "Turquia", "Turquia"),
        ("líbano", "Líbano", "Líbano"),
        ("libano", "Líbano", "Líbano"),
        ("egito", "Egito", "Egito"),
        ("cairo", "Egito", "Egito"),
        ("siwa", "Egito", "Egito"),
        ("sinai", "Egito", "Egito"),
        ("mar vermelho", "Egito", "Egito"),
        ("luxor", "Egito", "Egito"),
        ("aswan", "Egito", "Egito"),
    ]:
        if needle in value and label not in [entry[0] for entry in matches]:
            matches.append((label, country))
    if len(matches) > 1:
        return "Multi-destino", "Multi-destino", "Pacotes Multidestinos", True
    if matches:
        label, country = matches[0]
        return label, country, f"Viagens para {label}", False
    return "Mundo", "Internacional", "Viagens Internacionais", False


def fetch_tours() -> list[dict]:
    items = curl_json(f"{BASE_URL}/wp-json/wp/v2/tour?per_page=100&_embed=wp:featuredmedia,wp:term")
    item_by_slug = {item["slug"]: item for item in items}
    order = listing_order()
    ratings = package_ratings()
    ordered_items = [item_by_slug[slug] for slug in order if slug in item_by_slug]
    ordered_items.extend(item for item in items if item["slug"] not in order)

    tours: list[dict] = []
    for position, item in enumerate(ordered_items):
        slug = item["slug"]
        print(f"tour {position + 1}/{len(ordered_items)}: {slug}")
        soup = BeautifulSoup(curl_text(item["link"]), "html.parser")
        title = clean_text((item.get("title") or {}).get("rendered"))
        excerpt = clean_text((item.get("excerpt") or {}).get("rendered"))
        detail = soup.select_one(".ae-acf-content-wrapper")
        description = clean_text(detail.get_text(" ", strip=True) if detail else excerpt) or excerpt

        duration = 1
        for icon_item in soup.select(".elementor-icon-list-item"):
            text = clean_text(icon_item.get_text(" ", strip=True))
            match = re.search(r"(\d+)\s*Dias?", text, re.I)
            if match:
                duration = int(match.group(1))
                break

        body_text = clean_text(soup.get_text(" ", strip=True))
        price_match = re.search(r"A\s+Partir\s+De\s*([\d.,]+)\s*USD", body_text, re.I)
        price = (price_match.group(1).replace(".", "").replace(",", ".") if price_match else "0")

        itinerary = []
        for day_index, day in enumerate(soup.select(".eae-tl-item-content"), start=1):
            heading = day.select_one(".eae-tl-item-title")
            content = day.select_one(".eae-tl-content-innner")
            if not heading or not content:
                continue
            for image in content.select("img"):
                image.decompose()
            itinerary.append(
                {
                    "day": day_index,
                    "title": clean_text(heading.get_text(" ", strip=True)),
                    "description": clean_text(content.get_text(" ", strip=True)),
                    "meals": None,
                }
            )

        primary_source = embedded_media(item, "large")
        primary_image = localize_media(primary_source, slug) if primary_source else ""
        city, country, category, is_multi = destination_for(title, description)
        rating, reviews_count = ratings.get(slug, (5.0, 0))
        tours.append(
            {
                "id": str(item["id"]),
                "name": title,
                "slug": slug,
                "city_name": city,
                "country": country,
                "category": category,
                "duration_days": duration,
                "difficulty": "Fácil",
                "base_price": f"{float(price):.2f}",
                "primary_image": primary_image,
                "gallery": [primary_image] if primary_image else [],
                "average_rating": rating,
                "reviews_count": reviews_count,
                "description": description,
                "inclusions": section_items(soup, "O que Está incluído"),
                "exclusions": section_items(soup, "O que Não está incluído"),
                "itinerary": itinerary,
                "featured": position < 3,
                "is_multi_destination": is_multi,
                "packages": [],
            }
        )
    return tours


ABOUT_CONTENT = """## SOBRE NÓS

GIRASSOL BRASIL VIAGENS E TURISMO é uma Agência de Viagens que vende e organiza viagens ao mundo inteiro. Temos o prazer de apresentar um diversificado menu de opções de roteiros para suas viagens, na busca de melhor servi-lo e de colocar ao seu alcance variadas opções de escolha. Esteja a vontade para escolher o que melhor lhe convier.

Além disso, você mesmo(a) pode criar a sua viagem, e escolher o destino que preferir, e nos enviar o roteiro desejado para avaliarmos a viabilidade operacional e detalhes da realização da mesma.

## Sobre Nossos Valores

Acreditamos em um turismo diferenciado, acessível a todos. Sempre, buscamos a satisfação de nossos clientes, em suas respectivas viagens. Temos propósitos elevados, em relação aos nossos valores e qualidade. Nós utilizamos esses valores como norte dos nossos trabalhos e execução dos nossos serviços.

Estamos aqui para prestar-lhes esse serviço, viabilizando a sua viagem, com ótimos valores e muito cuidado em relação a qualidade e detalhes operacionais, zelando pelas categorias: RESPEITO, CUIDADO, DEDICAÇÃO E ÉTICA.

Nosso trabalho caminha em paralelo a nossa filosofia de AMOR e CUIDADO. Cuidamos de você, de seu companheiro(a) de jornada, de sua família, de seu grupo, de sua empresa, ou qualquer necessidade para viagem.

Compreendemos o quanto viajar, atravessar fronteiras, abrir novos espaços e ir além, é algo revestido, muitas vezes, de expectativas, sonhos e desejos. Proporcionamos a você, uma bela e inesquecível viagem aliada à proposta de um Turismo Consciente e democrático.

## Sobre Nossas Vantagens

Viajando com a GIRASSOL BRASIL VIAGENS E TURISMO…

- Você tem os melhores preços.
- Você tem um serviço de compromisso, dedicação, cuidado e responsabilidade.
- Você conta com credibilidade, sensibilidade e experiência dos seus sócios diretores, que conhecem pessoalmente cada detalhe do seu roteiro.
- Você tem facilidades financeiras no parcelamento sem juros e descontos no pagamento integral.
- Você tem guias turísticos exclusivos que trabalham pautados na Filosofia dos nossos serviços.
- Você tem pontos de descontos promocionais para sua próxima viagem.
- Você também contribui para a construção dos nossos projetos de Responsabilidade Social.

## GIRASSOL BRASIL VIAGENS E TURISMO

É um MEMBRO de GIRASSOL GROUP no Brasil E Egito. É uma empresa de especialistas em operacionalização, receptividade, programação e organização de viagens, roteiros, Tours, passeios e excursões Internacionais e Nacionais, circuitos na Europa e Ásia, pacotes para países do Médio Oriente e o Mediterrâneo. Pacotes para América do norte e América Latina. Colaboramos com cadeias de hospedagem e cruzeiros no Egito, no Médio Oriente e na Europa.

## Viagens Temáticas Especiais

Viagens em grupo, de caráter temático, agendadas com datas prefixadas, abordando temas específicos dentro da diversidade das lendas e mitos da Mitologia egípcia. Especialmente concebida por profissional da egiptologia e da Psicologia dos mitos e lendas da humanidade.

## Viagens Diversas

Viagens ao variados destinos a serem escolhidas com datas livres, dentro de uma série de opções apresentadas, conforme o seu interesse, em viagens individuais, com acompanhantes ou em grupos, em períodos além de sete dias.

## Viagens em Multidestinos

Viagens com mais de um destino, onde você pode aliar a sua visita como: Portugal com Espanha, Inglaterra com França, Dubai com Omã, Turquia com Grécia com Itália, Egito com Grécia, Egito com jordânia e outras. Possui datas livres de saída, podem ser organizadas individualmente, em pequenos ou grandes grupos.

## Viagens Curtas

Para você que está de passagem ou tem pouco tempo de estadia no Egito e quer aproveitar desde 1-7 dias em roteiros que maximizam a sua estadia, tornando produtivo e agradável conhecer áreas específicas do Egito, dentro do tempo possível para você.

## Vários Tipos de Viagens

Dentro de um marco mais amplio, oferecemos viagens de relaxe, viagens culturais, viagens de lua de mel, viagens para estudantes e amadores da cultura egípcia com palestras sobre a arqueologia, mitologia e a história egípcia antiga. Além das viagens religiosas às terras sagradas, organizamos também Viagens de Mergulho nas duas grandes regiões do Mar Vermelho; Sharm El Sheikh e Hurghada. No Egito e em Aqaba na Jordânia.
"""


def main() -> None:
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    tours = fetch_tours()
    posts = fetch_posts()
    payload["MOCK_TOURS"] = tours
    payload["MOCK_BLOG_POSTS"] = posts

    def tour_image(slug: str) -> str:
        return next((tour["primary_image"] for tour in tours if tour["slug"] == slug), "")

    payload["MOCK_DESTINATIONS"] = [
        {
            "id": "egito", "name": "Egito", "slug": "egito", "country": "Egito", "region": "egito",
            "tagline": "Cairo, pirâmides, templos e cruzeiros inesquecíveis pelo Rio Nilo.",
            "description": "Descubra a história milenar do Egito com roteiros completos e acompanhamento especializado.",
            "cover_image": tour_image("egito-classico-e-cruzeiro-no-nilo"), "gallery": [tour_image("egito-classico-e-cruzeiro-no-nilo")],
            "best_time_to_visit": "Outubro a Abril", "ideal_duration": "8 a 14 dias", "language": "Árabe / Português com guia",
            "currency": "EGP / USD", "highlights": ["Cairo", "Gizé", "Luxor", "Aswan", "Rio Nilo"], "starting_price": 1544, "featured": True,
        },
        {
            "id": "jordania", "name": "Jordânia", "slug": "jordania", "country": "Jordânia", "region": "multi-destino",
            "tagline": "Amã, Petra, Wadi Rum, Jerash e as águas do Mar Morto.",
            "description": "Roteiros para conhecer os grandes tesouros históricos e naturais da Jordânia.",
            "cover_image": tour_image("maravilhas-da-jordania"), "gallery": [tour_image("maravilhas-da-jordania")],
            "best_time_to_visit": "Março a Maio e Setembro a Novembro", "ideal_duration": "7 a 10 dias", "language": "Árabe / Inglês / Português com guia",
            "currency": "JOD / USD", "highlights": ["Petra", "Wadi Rum", "Mar Morto", "Jerash", "Amã"], "starting_price": 1397, "featured": True,
        },
        {
            "id": "emirados", "name": "Emirados", "slug": "emirados", "country": "Emirados Árabes Unidos", "region": "multi-destino",
            "tagline": "Dubai, arquitetura contemporânea, deserto e experiências sofisticadas.",
            "description": "Conheça Dubai em roteiros próprios ou combinados com a Jordânia e outros destinos.",
            "cover_image": tour_image("maravilhas-da-jordania-com-dubai"), "gallery": [tour_image("maravilhas-da-jordania-com-dubai")],
            "best_time_to_visit": "Outubro a Abril", "ideal_duration": "4 a 7 dias", "language": "Árabe / Inglês",
            "currency": "AED / USD", "highlights": ["Dubai", "Burj Khalifa", "Deserto", "Marina"], "starting_price": 1397, "featured": True,
        },
        {
            "id": "libano", "name": "Líbano", "slug": "libano", "country": "Líbano", "region": "multi-destino",
            "tagline": "Beirute, Byblos, Harissa, Vale do Bekaa, Anjar e Baalbeck.",
            "description": "Uma jornada por civilizações antigas, paisagens mediterrâneas e cidades históricas.",
            "cover_image": tour_image("viagem-ao-egito-e-libano-por-14-dias"), "gallery": [tour_image("viagem-ao-egito-e-libano-por-14-dias")],
            "best_time_to_visit": "Abril a Junho e Setembro a Novembro", "ideal_duration": "5 a 8 dias", "language": "Árabe / Francês / Inglês",
            "currency": "LBP / USD", "highlights": ["Beirute", "Byblos", "Harissa", "Baalbeck"], "starting_price": 1857, "featured": False,
        },
        {
            "id": "turquia", "name": "Turquia", "slug": "turquia", "country": "Turquia", "region": "multi-destino",
            "tagline": "Istambul e os grandes encontros entre Oriente e Ocidente.",
            "description": "Combine o Egito com a Turquia em uma viagem cultural por duas civilizações extraordinárias.",
            "cover_image": tour_image("o-melhor-do-egito-e-turquia"), "gallery": [tour_image("o-melhor-do-egito-e-turquia")],
            "best_time_to_visit": "Abril a Junho e Setembro a Outubro", "ideal_duration": "6 a 10 dias", "language": "Turco / Inglês",
            "currency": "TRY / EUR", "highlights": ["Istambul", "Bósforo", "Mesquitas", "Bazares"], "starting_price": 1877, "featured": False,
        },
        {
            "id": "marrocos", "name": "Marrocos", "slug": "marrocos", "country": "Marrocos", "region": "multi-destino",
            "tagline": "Casablanca, Rabat, Meknes, Fez, Beni Mellal e Marrakech.",
            "description": "Descubra as cidades imperiais, mercados, palácios e paisagens do Marrocos.",
            "cover_image": tour_image("marrocos-tour-classico"), "gallery": [tour_image("marrocos-tour-classico")],
            "best_time_to_visit": "Março a Maio e Setembro a Novembro", "ideal_duration": "8 a 12 dias", "language": "Árabe / Francês",
            "currency": "MAD / EUR", "highlights": ["Casablanca", "Rabat", "Fez", "Marrakech"], "starting_price": 0, "featured": False,
        },
    ]
    # Positive Trustpilot reviews visible when the revision was supplied. The
    # one-star reviews are intentionally excluded per the client's brief; the
    # interface links to Trustpilot so visitors can still inspect the source.
    payload["MOCK_REVIEWS"] = [
        {
            "id": "trustpilot-karla-paula-2026",
            "author": "Karla e Paula",
            "country": "Brasil",
            "rating": 5,
            "date": "16 de janeiro de 2026",
            "title": "Ótima experiência com a Girassol",
            "comment": "A equipe foi prestativa desde o planejamento e acompanhou o grupo no Egito com conhecimento, flexibilidade e segurança.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-carlos-miyazaki-2025",
            "author": "Carlos Miyazaki",
            "country": "Brasil",
            "rating": 5,
            "date": "17 de outubro de 2025",
            "title": "Passeios incríveis",
            "comment": "As expectativas foram alcançadas com passeios marcantes, paisagens deslumbrantes e explicações históricas detalhadas.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-anisia-miyazaki-2025",
            "author": "Anisia Lobo Miyazaki",
            "country": "Brasil",
            "rating": 5,
            "date": "16 de outubro de 2025",
            "title": "Egito fantástico",
            "comment": "Uma viagem maravilhosa, com roteiro organizado, bom guia e equipe de apoio pontual.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-fatima-albuquerque-2025",
            "author": "Fatima Albuquerque",
            "country": "Brasil",
            "rating": 5,
            "date": "20 de agosto de 2025",
            "title": "Uma experiência única no Egito",
            "comment": "O grupo recebeu acolhimento, um roteiro bem cuidado e suporte durante toda a viagem, do Cairo ao cruzeiro no Nilo.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-elmano-cavalcanti-2025",
            "author": "Elmano P. Cavalcanti",
            "country": "Brasil",
            "rating": 5,
            "date": "26 de maio de 2025",
            "title": "Experiência maravilhosa",
            "comment": "A empresa entregou o combinado e esteve presente do início ao fim, com serviços considerados impecáveis.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-andres-galland-2025",
            "author": "Andres Galland",
            "country": "Brasil",
            "rating": 5,
            "date": "9 de outubro de 2025",
            "title": "Atendimento excelente",
            "comment": "Organização, hotéis, pontualidade e guias foram elogiados, com intenção de contratar a Girassol novamente.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-sain-kaleh-2022",
            "author": "Sain Kaleh",
            "country": "Argentina",
            "rating": 5,
            "date": "8 de dezembro de 2022",
            "title": "Excelente experiência",
            "comment": "O destino e a experiência foram recomendados de forma positiva pelo viajante.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-leandro-alves-2019",
            "author": "Leandro Alves",
            "country": "Brasil",
            "rating": 5,
            "date": "27 de julho de 2019",
            "title": "A empresa cumpriu todo o acordado",
            "comment": "O compromisso da empresa e o cumprimento do que foi combinado receberam avaliação máxima.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
        {
            "id": "trustpilot-alethea-stoeberl-2018",
            "author": "Alethea Stoeberl",
            "country": "Brasil",
            "rating": 5,
            "date": "24 de abril de 2018",
            "title": "Excelente escolha",
            "comment": "Atendimento cuidadoso, seriedade e boas surpresas ao longo da viagem foram os destaques da avaliação.",
            "tour_name": "Avaliação publicada no Trustpilot",
        },
    ]

    pages = [page for page in payload.get("PAGES", []) if page.get("slug") != "sobre-nos"]
    pages.append(
        {
            "id": "7633",
            "title": "SOBRE NÓS",
            "slug": "sobre-nos",
            "content": ABOUT_CONTENT.strip(),
            "is_active": True,
        }
    )
    payload["PAGES"] = pages

    meta = payload.setdefault("SITE_META", {})
    meta.update(
        {
            "siteurl": BASE_URL,
            "blogname": "Girassol Brasil Viagens e Turismo",
            "blogdescription": "Realizando sonhos, conectando destinos",
            "tour_count": len(tours),
            "blog_count": len(posts),
            "post_count": len(posts),
            "page_count": len(pages),
        }
    )
    DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {DATA_FILE}: {len(tours)} tours and {len(posts)} blog posts")


if __name__ == "__main__":
    main()
