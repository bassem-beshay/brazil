import type { SiteContentBundle } from '@/context/SiteContentContext';

export type SitePage = {
  slug: string;
  title: string;
  content: string;
};

export type RelatedTile = {
  href: string;
  title: string;
  description: string;
  image: string;
};

export function getPageBySlug(content: SiteContentBundle, slug: string): SitePage | undefined {
  return content.PAGES.find((page) => page.slug === slug);
}

export function getPageMedia(content: SiteContentBundle, slug: string) {
  const destinationBySlug = Object.fromEntries(
    (content.MOCK_DESTINATIONS || []).map((dest) => [dest.slug, dest])
  );
  const tourBySlug = Object.fromEntries(
    (content.MOCK_TOURS || []).map((tour) => [tour.slug, tour])
  );
  // The import contains a generic legacy thumbnail for many entries. Keep the
  // database content intact, but use the corresponding local destination media
  // on editorial pages so a Nile, desert or city page never shows an airplane.
  const cairo = { ...destinationBySlug.cairo, cover_image: '/site-assets/cc25b2eb94a7e175.png' };
  const luxor = { ...destinationBySlug['luxor-aswan'], cover_image: '/site-assets/2eee2d63670661aa.jpg' };
  const sharm = { ...destinationBySlug['sharm-el-sheikh'], cover_image: '/site-assets/340eaaf95101bd52.png' };
  const hurghada = { ...destinationBySlug.hurghada, cover_image: '/site-assets/fb1a3cc0cf94e9f2.png' };
  const siwa = { ...destinationBySlug.siwa, cover_image: '/site-assets/3b9cb8128b4300d5.png' };
  const jordan = { ...destinationBySlug.jordania, cover_image: '/site-assets/be66a3791d60c940.png' };
  const dubai = { ...destinationBySlug.dubai, cover_image: '/site-assets/beb26a1d728797db.png' };
  const egitoMilenar = { ...tourBySlug['viagem-egito-milenar-10-dias-aereo-com-terrestre'], primary_image: '/site-assets/cc25b2eb94a7e175.png' };
  const caminhoMoises = { ...tourBySlug['caminho-de-moises-ii-com-sharm-el-sheikh-11-dias'], primary_image: '/site-assets/be66a3791d60c940.png' };

  const configs: Record<string, { heroImage: string; heroAlt: string; tiles: RelatedTile[] }> = {
    home: {
      heroImage: cairo?.cover_image || egitoMilenar?.primary_image || '',
      heroAlt: 'Viagem ao Egito',
      tiles: [
        {
          href: '/destinations/cairo',
          title: 'Cairo & Gizé',
          description: 'Pirâmides, museu e o coração histórico do Egito.',
          image: cairo?.cover_image || egitoMilenar?.primary_image || '',
        },
        {
          href: '/destinations/luxor-aswan',
          title: 'Luxor & Aswan',
          description: 'Cruzeiros e templos à beira do Nilo.',
          image: luxor?.cover_image || egitoMilenar?.primary_image || '',
        },
        {
          href: '/tours/viagem-egito-milenar-10-dias-aereo-com-terrestre',
          title: 'Egito Milenar',
          description: 'Roteiro completo com Cairo e cruzeiro.',
          image: egitoMilenar?.primary_image || cairo?.cover_image || '',
        },
      ],
    },
    'quem-somos': {
      heroImage: cairo?.cover_image || egitoMilenar?.primary_image || '',
      heroAlt: 'Quem Somos',
      tiles: [
        {
          href: '/about',
          title: 'Sobre a Girasol',
          description: 'Estrutura, experiência e atendimento.',
          image: cairo?.cover_image || '',
        },
        {
          href: '/destinations/cairo',
          title: 'Base no Cairo',
          description: 'A operação local no Egito.',
          image: cairo?.cover_image || '',
        },
        {
          href: '/contact',
          title: 'Fale com a equipe',
          description: 'Contato direto para reservas e dúvidas.',
          image: sharm?.cover_image || '',
        },
      ],
    },
    'nossa-visao': {
      heroImage: egitoMilenar?.primary_image || cairo?.cover_image || '',
      heroAlt: 'Nossa Visão',
      tiles: [
        {
          href: '/tours',
          title: 'Pacotes de viagem',
          description: 'Roteiros já prontos para reservar.',
          image: egitoMilenar?.primary_image || '',
        },
        {
          href: '/destinations/luxor-aswan',
          title: 'Cruzeiros no Nilo',
          description: 'Experiência central do portfólio.',
          image: luxor?.cover_image || '',
        },
        {
          href: '/contact',
          title: 'Montar viagem',
          description: 'Atendimento para roteiro sob medida.',
          image: dubai?.cover_image || '',
        },
      ],
    },
    'dicas-sobre-egito': {
      heroImage: cairo?.cover_image || '',
      heroAlt: 'Dicas sobre Egito',
      tiles: [
        {
          href: '/destinations/cairo',
          title: 'Cairo e Gizé',
          description: 'Primeiro contato com o Egito clássico.',
          image: cairo?.cover_image || '',
        },
        {
          href: '/destinations/luxor-aswan',
          title: 'Luxor & Aswan',
          description: 'Cruzeiro, templos e logística do Nilo.',
          image: luxor?.cover_image || '',
        },
        {
          href: '/destinations/sharm-el-sheikh',
          title: 'Sharm El Sheikh',
          description: 'Praia, mergulho e Mar Vermelho.',
          image: sharm?.cover_image || '',
        },
      ],
    },
    'solicitar-pacote-para-grupo': {
      heroImage: caminhoMoises?.primary_image || egitoMilenar?.primary_image || '',
      heroAlt: 'Solicitar pacote para grupo',
      tiles: [
        {
          href: '/contact#orcamento',
          title: 'Pedir orçamento',
          description: 'Briefing rápido com a equipe.',
          image: cairo?.cover_image || '',
        },
        {
          href: '/tours',
          title: 'Ver roteiros',
          description: 'Pacotes com datas e preços.',
          image: caminhoMoises?.primary_image || '',
        },
        {
          href: '/faq',
          title: 'Dúvidas frequentes',
          description: 'Pagamentos, vistos e reservas.',
          image: hurghada?.cover_image || '',
        },
      ],
    },
    'regras-e-condicoes-gerais': {
      heroImage: egitoMilenar?.primary_image || cairo?.cover_image || '',
      heroAlt: 'Regras e condições gerais',
      tiles: [
        {
          href: '/faq',
          title: 'FAQ',
          description: 'Respostas curtas para dúvidas comuns.',
          image: cairo?.cover_image || '',
        },
        {
          href: '/terms',
          title: 'Termos de uso',
          description: 'Base contratual e reserva.',
          image: luxor?.cover_image || '',
        },
        {
          href: '/privacy',
          title: 'Privacidade',
          description: 'Uso de dados e informações.',
          image: siwa?.cover_image || '',
        },
      ],
    },
    'criar-sua-viagem': {
      heroImage: egitoMilenar?.primary_image || cairo?.cover_image || '',
      heroAlt: 'Criar sua viagem',
      tiles: [
        {
          href: '/contact#orcamento',
          title: 'Montar orçamento',
          description: 'Roteiro ajustado ao seu perfil.',
          image: egitoMilenar?.primary_image || '',
        },
        {
          href: '/dashboard',
          title: 'Favoritos',
          description: 'Comparar pacotes salvos.',
          image: dubai?.cover_image || '',
        },
        {
          href: '/blog',
          title: 'Dicas de viagem',
          description: 'Artigos e conteúdos úteis.',
          image: cairo?.cover_image || '',
        },
      ],
    },
    'cruzeiros-no-nilo': {
      heroImage: luxor?.cover_image || egitoMilenar?.primary_image || '',
      heroAlt: 'Cruzeiros no Nilo',
      tiles: [
        {
          href: '/destinations/luxor-aswan',
          title: 'Luxor & Aswan',
          description: 'Navegação e templos ao longo do rio.',
          image: luxor?.cover_image || '',
        },
        {
          href: '/tours/viagem-egito-milenar-10-dias-aereo-com-terrestre',
          title: 'Egito Milenar',
          description: 'Cruzeiro incluso no roteiro principal.',
          image: egitoMilenar?.primary_image || '',
        },
        {
          href: '/contact',
          title: 'Reservar cruzeiro',
          description: 'Suporte para disponibilidade e datas.',
          image: cairo?.cover_image || '',
        },
      ],
    },
    contato: {
      heroImage: cairo?.cover_image || '',
      heroAlt: 'Contato',
      tiles: [
        {
          href: '/contact#orcamento',
          title: 'Orçamento',
          description: 'Fale direto com a equipe.',
          image: cairo?.cover_image || '',
        },
        {
          href: '/tours',
          title: 'Pacotes',
          description: 'Escolha o roteiro ideal.',
          image: egitoMilenar?.primary_image || '',
        },
        {
          href: '/faq',
          title: 'Perguntas frequentes',
          description: 'Antes de fechar a reserva.',
          image: sharm?.cover_image || '',
        },
      ],
    },
  };

  return configs[slug] || {
    heroImage: cairo?.cover_image || egitoMilenar?.primary_image || '',
    heroAlt: 'Página institucional',
    tiles: [],
  };
}
