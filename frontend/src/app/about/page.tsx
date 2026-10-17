"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Compass, Heart, ShieldCheck } from 'lucide-react';

const advantages = [
  'Você tem os melhores preços.',
  'Você tem um serviço de compromisso, dedicação, cuidado e responsabilidade.',
  'Você conta com credibilidade, sensibilidade e experiência dos seus sócios diretores, que conhecem pessoalmente cada detalhe do seu roteiro.',
  'Você tem facilidades financeiras no parcelamento sem juros e descontos no pagamento integral.',
  'Você tem guias turísticos exclusivos que trabalham pautados na Filosofia dos nossos serviços.',
  'Você tem pontos de descontos promocionais para sua próxima viagem.',
  'Você também contribui para a construção dos nossos projetos de Responsabilidade Social.',
];

const travelTypes = [
  {
    title: 'Viagens Temáticas Especiais',
    text: 'Viagens em grupo, de caráter temático, agendadas com datas prefixadas, abordando temas específicos dentro da diversidade das lendas e mitos da Mitologia egípcia. Especialmente concebida por profissional da egiptologia e da Psicologia dos mitos e lendas da humanidade.',
  },
  {
    title: 'Viagens Diversas',
    text: 'Viagens ao variados destinos a serem escolhidas com datas livres, dentro de uma série de opções apresentadas, conforme o seu interesse, em viagens individuais, com acompanhantes ou em grupos, em períodos além de sete dias.',
  },
  {
    title: 'Viagens em Multidestinos',
    text: 'Viagens com mais de um destino, onde você pode aliar a sua visita como: Portugal com Espanha, Inglaterra com França, Dubai com Omã, Turquia com Grécia com Itália, Egito com Grécia, Egito com jordânia e outras. Possui datas livres de saída, podem ser organizadas individualmente, em pequenos ou grandes grupos.',
  },
  {
    title: 'Viagens Curtas',
    text: 'Para você que está de passagem ou tem pouco tempo de estadia no Egito e quer aproveitar desde 1-7 dias em roteiros que maximizam a sua estadia, tornando produtivo e agradável conhecer áreas específicas do Egito, dentro do tempo possível para você.',
  },
  {
    title: 'Vários Tipos de Viagens',
    text: 'Dentro de um marco mais amplio, oferecemos viagens de relaxe, viagens culturais, viagens de lua de mel, viagens para estudantes e amadores da cultura egípcia com palestras sobre a arqueologia, mitologia e a história egípcia antiga. Além das viagens religiosas às terras sagradas, organizamos também Viagens de Mergulho nas duas grandes regiões do Mar Vermelho; Sharm El Sheikh e Hurghada. No Egito e em Aqaba na Jordânia.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      <section className="relative min-h-[390px] bg-[#082F5B] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#F59E0B,transparent_45%)]" />
        <div className="relative z-10 text-center px-6 pt-8">
          <Image src="/brand/girassol-brasil-transparent.png" alt="Girassol Brasil Viagens e Turismo" width={1322} height={784} priority className="w-64 sm:w-80 h-auto mx-auto mb-8" />
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-display">SOBRE NÓS</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-premium border border-gray-100">
          <div className="inline-flex items-center gap-2 bg-[#0B4EA2]/10 text-[#0B4EA2] font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Compass className="w-4 h-4" /> Sobre nós
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
            <div className="space-y-5 text-sm sm:text-base text-[#546E7A] leading-relaxed text-justify">
              <p><strong className="text-[#263238]">GIRASSOL BRASIL VIAGENS E TURISMO</strong> é uma Agência de Viagens que vende e organiza viagens ao mundo inteiro. Temos o prazer de apresentar um diversificado menu de opções de roteiros para suas viagens, na busca de melhor servi-lo e de colocar ao seu alcance variadas opções de escolha. Esteja a vontade para escolher o que melhor lhe convier.</p>
              <p>Além disso, você mesmo(a) pode criar a sua viagem, e escolher o destino que preferir, e nos enviar o roteiro desejado para avaliarmos a viabilidade operacional e detalhes da realização da mesma.</p>
            </div>
            <Image src="/brand/girassol-group.png" alt="Girassol Group Brasil e Egito" width={1318} height={726} className="w-full h-auto rounded-2xl border border-gray-100" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <article className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
          <div className="w-14 h-14 bg-[#0B4EA2]/10 text-[#0B4EA2] rounded-2xl flex items-center justify-center mb-6"><Heart className="w-7 h-7" /></div>
          <h2 className="text-2xl font-bold text-[#263238] mb-5">Sobre Nossos Valores</h2>
          <div className="space-y-4 text-sm text-[#546E7A] leading-relaxed text-justify">
            <p>Acreditamos em um turismo diferenciado, acessível a todos. Sempre, buscamos a satisfação de nossos clientes, em suas respectivas viagens. Temos propósitos elevados, em relação aos nossos valores e qualidade. Nós utilizamos esses valores como norte dos nossos trabalhos e execução dos nossos serviços.</p>
            <p>Estamos aqui para prestar-lhes esse serviço, viabilizando a sua viagem, com ótimos valores e muito cuidado em relação a qualidade e detalhes operacionais, zelando pelas categorias: <strong className="text-[#0B4EA2]">RESPEITO, CUIDADO, DEDICAÇÃO E ÉTICA.</strong></p>
            <p>Nosso trabalho caminha em paralelo a nossa filosofia de <strong className="text-[#F59E0B]">AMOR e CUIDADO</strong>. Cuidamos de você, de seu companheiro(a) de jornada, de sua família, de seu grupo, de sua empresa, ou qualquer necessidade para viagem.</p>
            <p>Compreendemos o quanto viajar, atravessar fronteiras, abrir novos espaços e ir além, é algo revestido, muitas vezes, de expectativas, sonhos e desejos. Proporcionamos a você, uma bela e inesquecível viagem aliada à proposta de um Turismo Consciente e democrático.</p>
          </div>
        </article>

        <article className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
          <div className="w-14 h-14 bg-[#F59E0B]/15 text-[#D97706] rounded-2xl flex items-center justify-center mb-6"><ShieldCheck className="w-7 h-7" /></div>
          <h2 className="text-2xl font-bold text-[#263238] mb-2">Sobre Nossas Vantagens</h2>
          <p className="text-sm text-[#546E7A] mb-5">Viajando com a GIRASSOL BRASIL VIAGENS E TURISMO…</p>
          <ul className="space-y-3">
            {advantages.map((advantage) => (
              <li key={advantage} className="flex gap-3 text-sm text-[#546E7A] leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-[#0B4EA2] shrink-0 mt-0.5" /> {advantage}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-20">
        <div className="bg-gradient-to-br from-[#082F5B] to-[#0B4EA2] rounded-3xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl font-bold mb-5">GIRASSOL BRASIL VIAGENS E TURISMO</h2>
          <p className="text-sm sm:text-base text-blue-50/90 leading-relaxed text-justify">
            É um MEMBRO de GIRASSOL GROUP no Brasil E Egito. É uma empresa de especialistas em operacionalização, receptividade, programação e organização de viagens, roteiros, Tours, passeios e excursões Internacionais e Nacionais, circuitos na Europa e Ásia, pacotes para países do Médio Oriente e o Mediterrâneo. Pacotes para América do norte e América Latina. Colaboramos com cadeias de hospedagem e cruzeiros no Egito, no Médio Oriente e na Europa. Apresentamos um variado menu de viagens, onde você pode escolher entre:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-8">
          {travelTypes.map((type, index) => (
            <article key={type.title} className={`${index === travelTypes.length - 1 ? 'md:col-span-2' : ''} bg-white rounded-3xl p-8 shadow-premium border border-gray-100`}>
              <h3 className="text-xl font-bold text-[#0B4EA2] mb-3">{type.title}</h3>
              <p className="text-sm text-[#546E7A] leading-relaxed text-justify">{type.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-20 text-center">
        <div className="bg-gradient-to-r from-[#0B4EA2] to-[#F59E0B] rounded-3xl p-10 sm:p-14 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para Planejar Sua Próxima Viagem?</h2>
          <p className="text-sm text-white/90 mb-7">Conte-nos o destino dos seus sonhos e cuidaremos dos detalhes.</p>
          <Link href="/contact#orcamento" className="inline-flex bg-white text-[#0B4EA2] font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform">Solicitar Orçamento</Link>
        </div>
      </section>
    </div>
  );
}
