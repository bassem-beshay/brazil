import Link from 'next/link';
import { RelatedTile, SitePage } from '@/lib/sitePages';

function cleanContent(content: string) {
  return content
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function SitePageView({
  page,
  heroImage,
  heroAlt,
  related = [],
}: {
  page: SitePage;
  heroImage: string;
  heroAlt: string;
  related?: RelatedTile[];
}) {
  const content = cleanContent(page.content);

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#0B4EA2] bg-[#0B4EA2]/10 px-4 py-2 rounded-full">
              Conteudo institucional
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#263238]">
                {page.title}
              </h1>
              <p className="text-base sm:text-lg text-[#546E7A] leading-8 max-w-2xl">
                Pagina importada do conteudo real do site original e publicada no novo ambiente com imagens e estrutura propria.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact#orcamento"
                className="bg-[#0B4EA2] hover:bg-[#073B7A] text-white text-sm font-bold px-5 py-3 rounded-full shadow-md transition-colors"
              >
                Pedir orcamento
              </Link>
              <Link
                href="/tours"
                className="bg-white border border-gray-200 hover:border-[#0B4EA2] text-[#263238] text-sm font-bold px-5 py-3 rounded-full shadow-sm transition-colors"
              >
                Ver pacotes
              </Link>
            </div>
          </div>

          <div className="relative">
            {heroImage ? (
              <div className="relative rounded-[2rem] overflow-hidden shadow-premium border border-gray-100 min-h-[320px]">
                <img
                  src={heroImage}
                  alt={heroAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102018]/70 via-[#102018]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#F59E0B] font-bold">
                    Imagem relacionada
                  </p>
                  <p className="text-lg font-semibold mt-1">{heroAlt}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] min-h-[320px] bg-gradient-to-br from-[#0B4EA2] to-[#073B7A] shadow-premium" />
            )}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-12">
        <article className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100">
          <div className="text-[#546E7A] leading-8 whitespace-pre-line text-sm sm:text-[15px]">
            {content}
          </div>
        </article>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] font-bold text-[#0B4EA2]">Relacionados</p>
              <h2 className="text-2xl font-bold text-[#263238]">Paginas e imagens relacionadas</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {related.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="group bg-white rounded-3xl overflow-hidden shadow-premium border border-gray-100 hover:-translate-y-1 transition-transform"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-[#263238]">{tile.title}</h3>
                  <p className="text-sm text-[#546E7A] leading-7">{tile.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
