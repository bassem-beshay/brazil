from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    home = (ROOT / "frontend/src/app/page.tsx").read_text(encoding="utf-8")
    layout = (ROOT / "frontend/src/app/layout.tsx").read_text(encoding="utf-8")
    about = (ROOT / "frontend/src/app/about/page.tsx").read_text(encoding="utf-8")
    blog = (ROOT / "frontend/src/app/blog/page.tsx").read_text(encoding="utf-8")
    data = json.loads((ROOT / "frontend/src/lib/siteData.generated.json").read_text(encoding="utf-8"))

    source_text = "".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "frontend/src").rglob("*")
        if path.is_file() and path.suffix in {".ts", ".tsx", ".css", ".svg"}
    )

    checks = {
        "hero eyebrow": "OPERADORA BRASILEIRA ESPECIALISTA EM EGITO, JORDÂNIA, DUBAI, ORIENTE MÉDIO, ÍNDIA, TAILÂNDIA &amp; OUTROS DESTINOS" in home,
        "hero title": "Descubra o Mundo com" in home and "Anos de Excelência" in home,
        "hero destinations": "Egito, Jordânia, Dubai, Omã, Turquia, Túnica, Marrocos, Índia, Tailândia, Marrocos e outros destinos inesquecíveis." in home,
        "hero support": "Pacotes completos, segurança, conforto supremo e o cuidado de especialistas." in home,
        "left CTA": "Ver Destinos e Pacotes" in home,
        "four institutional statements": all(
            value in home
            for value in [
                "Membro da ABAV 0177- CE — Associação Brasileira de Agências de Viagens",
                "Agência Cadastrada no Cadastur desde 2013",
                "Empresa com CNPJ desde 2013",
                "Membro do Grupo Girassol Viagens Brasil – Egito",
            ]
        ),
        "why label": "POR QUE ESCOLHER GIRASSO BRASIL VIAGENS E TURISMO" in home,
        "why title": "Especialistas em Organizar Viagens Inesquecíveis" in home,
        "why subtitle": "Do Brasil para o mundo: cuidamos de cada detalhe da sua viagem com segurança, conforto e atendimento personalizado." in home,
        "six original benefits": all(
            value in home
            for value in [
                "Variados Destinos", "Facilidades de Aquisição", "Roteiros Encantadores",
                "Reservas Rápidas", "Qualidade no Atendimento", "Amor e Cuidado",
            ]
        ),
        "AI section removed": "AIChatBot" not in home and "Concierge Inteligente" not in home,
        "newsletter anti-spam": "3 + 4 = ?" in home and 'name="company"' in home,
        "menu order": layout.index("label: 'Início'") < layout.index("label: 'Destinos'") < layout.index("label: 'Pacotes'") < layout.index("label: 'Sobre Nós'") < layout.index("label: 'Perguntas Frequentes'") < layout.index("label: 'Blog'") < layout.index("label: 'Contato'"),
        "four footer columns": "lg:grid-cols-4" in layout,
        "footer logos and socials": all(value in layout for value in ["abav-0177-ce.jpg", "cadastur.jpg", "Instagram", "Facebook"]),
        "about title": "SOBRE NÓS" in about,
        "about logos": "girassol-brasil-transparent.png" in about and "girassol-group.png" in about,
        "all original tours": len(data["MOCK_TOURS"]) == 19,
        "all original blog posts": len(data["MOCK_BLOG_POSTS"]) == 744,
        "original blog order": data["MOCK_BLOG_POSTS"][0]["slug"] == "egmont-national-park-nova-zelandia",
        "blog pagination": "POSTS_PER_PAGE = 12" in blog,
        "positive reviews only": len(data["MOCK_REVIEWS"]) == 9 and all(review["rating"] > 1 for review in data["MOCK_REVIEWS"]),
        "blue and orange palette": "#1B5E20" not in source_text and "#0B4EA2" in source_text and "#F59E0B" in source_text,
    }

    for name, passed in checks.items():
        print(f"{'PASS' if passed else 'FAIL'} {name}")
    if not all(checks.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
