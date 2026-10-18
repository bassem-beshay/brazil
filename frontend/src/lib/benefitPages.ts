export type BenefitPage = {
  slug: string;
  title: string;
  cardTitle: string;
  cardText: string;
  sections: Array<{
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
};

export const BENEFIT_PAGES: BenefitPage[] = [
  {
    slug: 'variados-destinos',
    title: 'Variados Destinos',
    cardTitle: 'Variados Destinos',
    cardText: 'Ao viajar conosco você escolhe um time de pessoas que trabalham para a sua máxima satisfação.',
    sections: [
      {
        paragraphs: [
          'Oferecemos viagens diferenciadas a variados destinos. Ao viajar conosco você escolhe um time de pessoas que trabalham para a sua máxima satisfação em variados destinos. As viagens são coordenadas por especialistas de diversas áreas como do Turismo à Psicologia e que se dedicam a buscar a Alta Performance e Excelência no que realizam com o compromisso de converter em resultados, a sua satisfação, pautados nos valores que nos movem: ética, amor, cuidado e respeito.',
        ],
      },
      {
        heading: 'Além desses variados destinos você verá:',
        bullets: [
          'Nossa capacidade de trabalhar com variados produtos e serviços, nos mais diversos segmentos de públicos e necessidades.',
          'Segmento de serviço diferenciado como a nossa oferta de Destinos Exóticos e nossas Viagens Temáticas que são pacotes exclusivos, podem até ser personalizados, mas que envolvem a rota dos destinos com um tema diferenciado.',
          'Serviço diferenciado no Egito, Oriente Médio e alguns países da Ásia e África, com valores excelentes de venda, visto que nossa empresa também possui uma sede no Cairo-Egito.',
          'Um serviço de Compromisso, Credibilidade, Qualidade e Responsabilidade no Padrão Girassol.',
          'Especialmente no Egito, Guias que também são egiptólogos e que falam Português ou Espanhol e que trabalham pautados na Filosofia e valores dos nossos serviços.',
          'Você conta com a sensibilidade e experiência dos seus sócios diretores, que conhecem pessoalmente detalhes da maioria dos principais destinos.',
          'Você vai a diversas partes do mundo, realizando através de nós o seu contato conosco em Português, facilitando a clareza da emissão e compreensão das informações.',
          'Facilidades financeiras nos parcelamentos sem juros, e descontos promocionais em pagamentos integrais.',
          'Você viaja ao exterior, e pode realizar pagamentos em Bancos Brasileiros ou com cartão de crédito.',
          'Serviço de Consultoria para o destino escolhido, e apostila exclusiva de material descritivo, sobre cada elemento que compõe o roteiro (para as chamadas viagens temáticas especiais).',
          'Recebe pontos de descontos promocionais para as próximas viagens.',
          'Você contribui para a construção dos nossos projetos de Responsabilidade Social.',
        ],
      },
    ],
  },
  {
    slug: 'facilidades-de-aquisicao',
    title: 'Facilidades de Aquisição',
    cardTitle: 'Facilidades de Aquisição',
    cardText: 'Na Girassol Brasil Viagens e Turismo você tem um sistema de facilidades de aquisição.',
    sections: [
      {
        paragraphs: [
          'Na Girassol Brasil Viagens e Turismo você tem um sistema de facilidades de aquisição em parcelamentos flexíveis e atrativos, que lhe permitem adquirir qualquer um de nossos serviços seja na estrutura de um pacote de viagens, seja em serviços individuais realizados por nossa Agência.',
          'Nosso número de parcelas pode variar com ou sem entrada, e entre 5X até 10X de parcelamentos para a diferença do valor orçado. Alguns destinos específicos podemos dar 10X. Em geral e em função da proximidade da data, podem apresentar número de parcelas reduzidos e para outros destinos, mesmo adquirindo sua viagem na véspera ainda é possível manter os privilégios de parcelamentos a mais longo prazo.',
        ],
      },
      {
        heading: 'Formas de Pagamento — Pacote Terrestre',
        bullets: [
          'Pagamento à vista.',
          'Parcelado, venda superior a 500 USD por cartões de crédito das bandeiras Visa, Mastercard e Diners emitidos no Brasil, em até 5X, sendo 35% de entrada à vista + taxas. Em alguns pacotes específicos se pode facilitar a aquisição através de entrada de 25% + em até 5X no cartão de crédito sem juros. O número de parcelas pode ser modificado em função da aquisição mais próxima à data da viagem.',
          'Para pagamentos parcelados em mais de 6 vezes, oferecemos financiamento (com juros) em até 10 vezes conforme cada pacote e data da viagem. As opções para pagamento parcelado poderão ser alteradas sem aviso prévio.',
          'Para mais parcelas ou para menos parcelas será por negociação direta com a empresa, analisando cada caso e cada pacote.',
          'Pagamento à vista/integral por link no cartão de crédito ou débito (somente bandeiras Mastercard ou Visa).',
        ],
      },
      {
        heading: 'Formas de Pagamento — Passagens Aéreas',
        bullets: [
          'Pagamento à vista.',
          'Parcelado, venda superior a 300 USD por cartões de crédito das bandeiras Visa, Mastercard e Diners emitidos no Brasil, em até 9 vezes conforme cada empresa aérea.',
          'Pagamento em espécie.',
          'Pagamento à vista/integral por link no cartão de crédito ou débito (somente bandeiras Mastercard ou Visa).',
        ],
      },
    ],
  },
  {
    slug: 'destinos-encantadores',
    title: 'Destinos Encantadores',
    cardTitle: 'Roteiros Encantadores',
    cardText: 'Sabemos que realizar a sua viagem muitas vezes faz parte de um sonho, de uma intenção.',
    sections: [
      {
        paragraphs: [
          'Nossas viagens tanto internacionais como nacionais foram criadas para perfis distintos de passageiros. Ao viajar conosco, você escolhe um time de pessoas que trabalham para a sua máxima satisfação. Em variados destinos pelo mundo oferecemos o melhor para você e sua família devido às razões seguintes:',
        ],
        bullets: [
          'Nossas viagens são coordenadas por especialistas de diversas áreas como do Turismo e a Psicologia e que se dedicam a buscar a Alta Performance e Excelência no que realizam com o compromisso de converter em resultados a sua satisfação, pautados nos valores que nos movem: ética, amor, cuidado e respeito.',
          'O nosso serviço é diferenciado como a nossa oferta de Destinos Exóticos e nossas Viagens Temáticas que são pacotes exclusivos, podem até ser personalizados, mas que envolvem a rota dos destinos com um tema diferenciado.',
          'Serviço diferenciado no Egito, Oriente Médio e alguns países da Ásia e África, com valores excelentes de venda.',
        ],
      },
      {
        heading: 'O que mais pode receber pelas nossas viagens?',
        bullets: [
          'Facilidades financeiras nos parcelamentos sem juros, e descontos promocionais em pagamentos integrais.',
          'Nossos serviços se aplicam a todos os destinos nacionais e internacionais, desde viagens clássicas até viagens exóticas e inusitadas, passando por viagens românticas, de Safari, de Mergulho, de Aventura e tantos outros estilos. Nós temos, também, destinos segmentados por temas: são as nossas Viagens Temáticas, que incluem destinos encantadores com um roteiro turístico que integra o lazer, a cultura e a diversão, e destacam ainda temas de Crescimento Pessoal e Autodesenvolvimento.',
        ],
      },
    ],
  },
  {
    slug: 'reservas-rapidas',
    title: 'Reservas Rápidas',
    cardTitle: 'Reservas Rápidas',
    cardText: 'A nossa equipe em Girassol Brasil Viagens e Turismo atende você, realizando as reservas.',
    sections: [
      {
        paragraphs: [
          'A nossa equipe em Girassol Brasil Viagens e Turismo atende você, realizando as reservas e ou emissões necessárias em tempo rápido, com agilidade e eficácia. A nossa equipe, altamente qualificada, é treinada em atender perfis diferentes de necessidades e de clientes.',
          'Entendemos e valorizamos a importância do seu tempo e o nosso dever em solucionar sua necessidade e zelar por sua satisfação. Oferecemos excelentes opções de hotéis, seguro viagem, passagens aéreas nacionais e internacionais, pacotes terrestres e pacotes completos com aéreo a valores diferenciados em cotações individualizadas, exclusivas, ou em grupos conforme a sua necessidade. O nosso objetivo é sempre responder e solucionar a sua necessidade, oferecendo reservas rápidas de um serviço de maneira eficaz.',
          'Você pode se comunicar conosco através de nossa página de contato, pelo e-mail contato@girassolviagens.com, por ligação telefônica +55 85 3067-6311 ou por mensagem de WhatsApp +55 85 99994-8137.',
        ],
      },
      {
        heading: 'Vantagens para os nossos clientes',
        bullets: [
          'Reservas rápidas, eficazes, claras e práticas sem inconvenientes.',
          'Serviço gratuito: você não paga taxa para isso.',
          'Reserva garantida.',
        ],
      },
    ],
  },
  {
    slug: 'qualidade-no-atendimento',
    title: 'Qualidade no Atendimento',
    cardTitle: 'Qualidade no Atendimento',
    cardText: 'Além de ser um atendimento rápido, o nosso atendimento é diferenciado.',
    sections: [
      {
        paragraphs: [
          'Zelamos pela qualidade, respeito e integridade no atendimento ao nosso viajante. Priorizamos os seus requisitos e necessidades, oferecendo um serviço de qualidade. Valorizamos a importância do seu tempo e o nosso dever em solucionar sua necessidade. Além disso, nossa equipe profissional e especialista nos destinos que vendemos fornece todas as dicas, informações e conselhos aos nossos viajantes. Somos movidos a atender com presteza. Realizamos sonhos e criamos viagens memoráveis.',
        ],
      },
      {
        heading: 'Entre os padrões de nossa qualidade de atendimento oferecemos:',
        bullets: [
          'Facilidade e flexibilidade nas aquisições dos pacotes.',
          'Responsabilidade e compromisso de serviço.',
          'Rapidez e pronto atendimento às suas solicitações e necessidades.',
          'Executamos seu pacote e, portanto, temos a propriedade para oferecer dicas e sugestões.',
          'Aceitamos o feedback dos nossos viajantes com gratidão e apreciamos quando eles compartilham sua experiência da viagem para melhorar o nosso serviço e viagens.',
        ],
      },
    ],
  },
  {
    slug: 'amor-e-cuidado',
    title: 'Amor e Cuidado',
    cardTitle: 'Amor e Cuidado',
    cardText: 'A nossa filosofia usada em Girassol Brasil Viagens e Turismo é baseada no amor e cuidado.',
    sections: [
      {
        paragraphs: [
          'A filosofia utilizada na Girassol Brasil Viagens e Turismo é baseada no amor e cuidado ao produto e ao serviço que prestamos ao cliente. Cuidamos também de tudo aquilo que é mais importante para você, em todos os detalhes para que sua viagem seja inesquecível. Amamos o que fazemos, desde a criação de um roteiro até a realização e concretização de um sonho. Nosso principal objetivo é a realização dos seus desejos, pois é um imenso prazer tê-lo conosco. Amamos quando nossos clientes compartilham sua paixão pelas nossas viagens e ficamos particularmente felizes e gratificados quando nos contam uma lembrança, uma parte dessa maravilhosa experiência. Zelamos por ouvir os seus comentários e feedback, que são muito importantes para a realização do nosso trabalho, sempre com ética, respeito à lei, cooperação, flexibilidade e excelência. Amamos ajudar na realização dos seus sonhos. Em Girassol Brasil Viagens e Turismo os detalhes são importantes, sobretudo o carinho e cuidado empregado na realização dos nossos serviços.',
        ],
      },
      {
        heading: 'Dentro do Padrão de Amor e Cuidado o nosso cliente encontra:',
        bullets: [
          'Um serviço de compromisso, qualidade e responsabilidade.',
          'Credibilidade, sensibilidade e cuidado da nossa equipe e diretores que tratam pessoalmente cada detalhe da execução de seu roteiro.',
          'Desfrutar de pontos de descontos promocionais em sua próxima viagem conosco (desde que em roteiros que não estejam divulgados como promocionais no nosso site).',
          'Dicas e orientações antes, durante e depois da sua viagem pelos nossos consultores de viagem.',
          'Disponibilidade de atendimento 24 horas por tipos diferentes de contato.',
          'Contribuição para a construção de nossos projetos de Responsabilidade Social.',
        ],
      },
      {
        paragraphs: [
          'O nosso Amor e Cuidado reflete-se na preocupação que temos com a sua viagem. Sabemos que não é corriqueiro conseguir todas as condições para realizar uma viagem (férias, tempo disponível, condições financeiras…), por isso nós cuidamos de todos os detalhes para corresponder às suas expectativas.',
        ],
      },
    ],
  },
];

export function getBenefitPage(slug: string) {
  return BENEFIT_PAGES.find((page) => page.slug === slug);
}
