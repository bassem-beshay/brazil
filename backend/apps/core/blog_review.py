from __future__ import annotations

import re


PAGES_5_9_DELETE_SLUGS = frozenset({
    'pacotes-promocionais-janeiro-2017',
    'lazer-natureza-bonito',
    'baleias-no-sul-do-brasil',
    'costumes-indianos-india-de-tradicoes',
    'danca-mexicana-tradicional',
    'as-maiores-arvores-de-natal-do-mundo',
    'boto-cor-de-rosa-na-amazonia',
    'origem-da-danca-do-ventre',
    'esqui-em-jackson-hole-estados-unidos',
    'virada-do-ano-pelo-mundo',
    'no-embalo-do-jazz-em-montreal',
    'desvendando-as-florestas-tropicais-de-borneu',
    'fantastico-museu-egipcio-no-cairo',
    'parque-de-neve-snowland-em-gramado',
    'beto-carrero-world',
    'santuarios-da-grande-deusa-em-malta',
    'san-andres-a-ilha-caribenha',
    'festival-holi-cores-na-india',
    'paixao-de-cristo-em-nova-jerusalem-pe',
    'festival-de-las-fallas-em-valencia',
    'malaga-na-espanha',
    'parque-magico-de-tivoli-em-copenhague',
    'externsteine-um-santuario-alemao',
})


def _gallery(slug: str, count: int, *, credit: str = '') -> list[dict[str, str]]:
    names = ['main.webp', *(f'gallery-{index:02d}.webp' for index in range(1, count))]
    return [
        {
            'url': f'/blog-sources/{slug}/{name}',
            'credit': credit,
            'source_url': '',
        }
        for name in names
    ]


PAGES_5_9_IMAGE_DIRECTIVES = {
    'natureza-aberta-descubra-chile': {
        'gallery': _gallery('natureza-aberta-descubra-chile', 1),
    },
    'culinaria-egipcia-e-seus-muitos-sabores': {
        'gallery': _gallery('culinaria-egipcia-e-seus-muitos-sabores', 9),
    },
    'bruges-um-destino-romance-europa': {
        'gallery': _gallery('bruges-um-destino-romance-europa', 1),
    },
    'o-sorriso-tailandes': {
        'gallery': _gallery('o-sorriso-tailandes', 1),
    },
    'creta-uma-ilha-de-riqueza-historica': {
        'gallery': _gallery('creta-uma-ilha-de-riqueza-historica', 17, credit='Emad Khalifa'),
        'credit': 'Emad Khalifa',
    },
    'costumes-das-mulheres-padaung': {
        'gallery': _gallery('costumes-das-mulheres-padaung', 1),
    },
    'beleza-dos-jardins-do-sul-da-inglaterra': {
        'gallery': _gallery('beleza-dos-jardins-do-sul-da-inglaterra', 1),
    },
    'luxor-oeste-e-o-vale-dos-reis': {
        'gallery': _gallery('luxor-oeste-e-o-vale-dos-reis', 1, credit='Emad Khalifa'),
        'credit': 'Emad Khalifa',
    },
    'o-mistico-templo-de-stonehenge': {
        'gallery': _gallery('o-mistico-templo-de-stonehenge', 6, credit='Emad Khalifa'),
        'credit': 'Emad Khalifa',
    },
    'monasterio-de-santa-catarina': {
        'gallery': _gallery('monasterio-de-santa-catarina', 1, credit='Emad Khalifa'),
        'credit': 'Emad Khalifa',
    },
    'moais': {
        'gallery': _gallery('moais', 1),
    },
    'ismailia-ain-sukhna-e-za-farana': {
        'gallery': _gallery('ismailia-ain-sukhna-e-za-farana', 1),
    },
    'abuh-dhabi': {
        'gallery': _gallery('abuh-dhabi', 1),
    },
    'haka-danca-maori': {
        'gallery': _gallery('haka-danca-maori', 1, credit='Emad Khalifa'),
        'credit': 'Emad Khalifa',
    },
    'templo-ad-dayr-riquezas-de-petra': {
        'gallery': _gallery('templo-ad-dayr-riquezas-de-petra', 1),
    },
    'colossos-de-memnon-no-egito': {
        'gallery': _gallery('colossos-de-memnon-no-egito', 1),
    },
    'soho-square-sharm-el-sheikh': {
        'gallery': [{
            'url': '/girassol-media/da15a829fe19a9c2.webp',
            'credit': '',
            'source_url': '',
        }],
        'keep_cover': True,
    },
    'o-oraculo-de-delfos': {
        'gallery': _gallery('o-oraculo-de-delfos', 8, credit='Emad Khalifa'),
        'credit': 'Emad Khalifa',
    },
}


TITLE_REPAIRS = {
    'onde-viajar-em-setembro-2': '10 Melhores Destinos para Visitar em Setembro',
    'viajar-em-setembro': 'Melhores Lugares para Viajar em Setembro',
    'melhores-destinos-para-visitar': 'Melhores Destinos para Visitar em 2018',
    'melhores-destinos-para-visitar-2': 'Melhores Destinos para Visitar em Janeiro',
}


CONTENT_REPAIRS = {
    'moderna-apaixonante-sao-petersburgo': """## Uma cidade moldada pela história

São Petersburgo nasceu às margens do rio Neva e reúne palácios, canais, pontes e grandes avenidas. A antiga capital imperial da Rússia conserva um conjunto arquitetônico marcante e uma vida cultural intensa.

## Palácios e museus

O Museu Hermitage, instalado no complexo do Palácio de Inverno, é um dos grandes símbolos da cidade. Igrejas como a do Salvador do Sangue Derramado e a Catedral de Santo Isaac ajudam a contar diferentes capítulos da história local.

## Canais, ilhas e pontes

Passeios pelas margens do Neva e pelos canais revelam perspectivas diferentes dos edifícios históricos. Durante os meses de verão, as noites claras e a abertura das pontes levadiças criam um cenário especialmente bonito.

## Planejando a visita

Reserve tempo para caminhar pelo centro histórico, visitar os principais museus e conhecer os arredores. Peterhof e o Palácio de Catarina são boas opções para quem deseja ampliar o roteiro além da área central.""",
    'sofisticada-cultural-londres-inglaterra': """## Tradição e modernidade

Londres combina monumentos históricos, bairros multiculturais, parques, mercados e uma agenda cultural permanente. A cidade pode ser descoberta em etapas, com cada região oferecendo uma experiência diferente.

## Ícones de Londres

Westminster, o Palácio de Buckingham, a Tower Bridge e a Torre de Londres estão entre os pontos mais conhecidos. Um passeio pelo Tâmisa ajuda a compreender a relação da capital britânica com o rio.

## Museus, teatros e bairros

Os grandes museus, as galerias e os teatros do West End fazem parte da identidade cultural da cidade. Covent Garden, Notting Hill, Camden e Greenwich acrescentam mercados, arquitetura e atmosferas próprias ao roteiro.

## Dicas para organizar o roteiro

Agrupe as visitas por região e utilize o transporte público para reduzir deslocamentos. Inclua momentos livres para caminhar pelos parques, conhecer cafés e observar o cotidiano londrino.""",
    'belissima-floresta-negra-alemanha': """## Paisagens de conto de fadas

A Floresta Negra, no sudoeste da Alemanha, reúne montanhas, vales, lagos e vilarejos cercados por uma extensa área verde. A região é ideal para quem gosta de natureza, estradas panorâmicas e pequenas cidades históricas.

## Vilarejos e tradições

Casas de madeira, oficinas artesanais e receitas regionais ajudam a formar a identidade local. Freiburg, Triberg e os povoados próximos podem servir como base para explorar diferentes trechos da região.

## Lagos e trilhas

Titisee e Schluchsee estão entre os lugares procurados para caminhadas e passeios tranquilos. Há rotas para diferentes níveis de preparo, além de mirantes e áreas de descanso.

## Como aproveitar melhor

Um roteiro de carro ou trem permite combinar natureza e cidades. Verifique a época do ano, o tempo disponível e o ritmo desejado antes de escolher as trilhas e os passeios.""",
    'fantasticas-exoticas-ilhas-galapagos': """## Um arquipélago singular

As Ilhas Galápagos formam um arquipélago vulcânico no oceano Pacífico e são conhecidas pela paisagem preservada e pela observação de animais em seu ambiente natural.

## Natureza e vida selvagem

Tartarugas-gigantes, iguanas-marinhas, aves e leões-marinhos estão entre os habitantes mais conhecidos das ilhas. Cada área possui regras de visitação destinadas a proteger os ecossistemas locais.

## Experiências nas ilhas

Passeios de barco, trilhas guiadas e atividades aquáticas permitem conhecer praias, formações vulcânicas e pontos de observação. A programação varia conforme a ilha escolhida e as condições do mar.

## Viagem responsável

Siga sempre as orientações dos guias, mantenha distância dos animais e evite deixar qualquer resíduo. Planejamento antecipado ajuda a organizar deslocamentos, autorizações e hospedagem.""",
    'esplendor-cultural-praga': """## Uma cidade de grande riqueza cultural

Praga reúne torres, pontes, igrejas e palácios às margens do rio Vltava. O centro histórico pode ser explorado a pé e revela diferentes períodos da arquitetura europeia.

## Cidade Velha e Ponte Carlos

A Praça da Cidade Velha, o relógio astronômico e a Ponte Carlos formam um dos percursos mais conhecidos. Pela manhã, o trajeto costuma ser mais tranquilo para fotografar e observar os detalhes.

## Castelo e bairros históricos

O complexo do Castelo de Praga, a Catedral de São Vito e o bairro de Malá Strana completam a visita. Concertos, teatros e cafés mantêm viva a tradição artística da cidade.

## Organizando a viagem

Separe ao menos dois dias para os principais pontos e acrescente tempo para museus ou passeios fora do centro. Calçados confortáveis são importantes por causa das ruas de pedra e das subidas.""",
    'impressionante-paradisiaca-california': """## Uma viagem pela costa da Califórnia

A Califórnia combina grandes cidades, praias, vinhedos, parques e estradas panorâmicas. Um roteiro pela costa permite alternar paisagens naturais com experiências urbanas.

## São Francisco e o litoral central

São Francisco é um bom ponto de partida para conhecer bairros históricos, mirantes e a baía. Seguindo pela costa, cidades como Monterey e Carmel oferecem aquários, praias e trechos cênicos.

## Estradas e paisagens

A Highway 1 é conhecida por suas curvas junto ao oceano e por paradas com vistas amplas do Pacífico. O tempo de viagem deve considerar pausas, condições da estrada e mudanças no clima.

## Los Angeles e o sul do estado

Los Angeles reúne praias, museus, cinema e bairros com personalidades diferentes. Para um roteiro equilibrado, escolha poucas regiões por dia e reserve margem para os deslocamentos.

## Planejamento

Defina as bases de hospedagem antes de distribuir os passeios. Em viagens de carro, confirme as condições das rotas, as regras de estacionamento e o tempo necessário entre cada parada.""",
}


EMPTY_COVER_REPAIRS = {
    'dicas-de-viagem': '/girassol-media/4353dab4362b5fc5.webp',
}


SHORTCODE_PATTERN = re.compile(r'\[/?vc_[^\]]*\]', flags=re.IGNORECASE)


def strip_legacy_shortcodes(value: str) -> str:
    return SHORTCODE_PATTERN.sub('', value or '').strip()


def apply_blog_review_data(items: list[dict]) -> list[dict]:
    """Apply approved review files and safe legacy repairs to imported blog data."""
    reviewed = []
    for item in items:
        slug = item.get('slug') or ''
        if slug in PAGES_5_9_DELETE_SLUGS:
            continue

        image_directive = PAGES_5_9_IMAGE_DIRECTIVES.get(slug)
        if image_directive:
            gallery = image_directive['gallery']
            if not image_directive.get('keep_cover'):
                item['cover_image'] = gallery[0]['url']
            item['gallery'] = gallery
            item['image_credit'] = image_directive.get('credit', '')
            item['image_source_url'] = ''

        if slug in TITLE_REPAIRS:
            item['title'] = TITLE_REPAIRS[slug]
            item['seo_title'] = TITLE_REPAIRS[slug]

        if slug in CONTENT_REPAIRS:
            item['content'] = CONTENT_REPAIRS[slug]

        if slug in EMPTY_COVER_REPAIRS and not str(item.get('cover_image') or '').strip():
            item['cover_image'] = EMPTY_COVER_REPAIRS[slug]

        item['content'] = strip_legacy_shortcodes(str(item.get('content') or ''))
        item['excerpt'] = strip_legacy_shortcodes(str(item.get('excerpt') or ''))
        if not item.get('tags'):
            item['tags'] = [item.get('category') or 'Viagens']
        reviewed.append(item)
    return reviewed
