import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, HeartHandshake } from 'lucide-react';
import type { BenefitPage } from '@/lib/benefitPages';

export default function BenefitDetailView({ page }: { page: BenefitPage }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#082F5B] via-[#0B4EA2] to-[#073B7A] px-6 py-20 text-white sm:py-24">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F59E0B]/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <Image src="/brand/girassol-brasil-transparent.png" alt="Girassol Brasil Viagens e Turismo" width={1322} height={784} className="mx-auto mb-7 h-auto w-52 sm:w-64" priority />
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#FDBA2D]">Por que escolher a Girassol</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{page.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-blue-50/90 sm:text-base">{page.cardText}</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-10 max-w-5xl px-6">
        <article className="rounded-3xl border border-gray-100 bg-white p-7 shadow-premium sm:p-12">
          <div className="mb-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B4EA2] to-[#F59E0B] text-white shadow-md">
            <HeartHandshake className="h-7 w-7" />
          </div>

          <div className="space-y-10">
            {page.sections.map((section, sectionIndex) => (
              <section key={`${page.slug}-${sectionIndex}`}>
                {section.heading && <h2 className="mb-5 text-2xl font-bold text-[#0B4EA2]">{section.heading}</h2>}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mb-4 text-justify text-sm leading-7 text-[#546E7A] sm:text-base sm:leading-8">{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-4">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-[#546E7A] sm:text-base">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#F59E0B]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-between">
            <Link href="/#por-que-girassol" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0B4EA2]/20 px-6 py-3 text-sm font-bold text-[#0B4EA2] transition-colors hover:border-[#0B4EA2]">
              <ArrowLeft className="h-4 w-4" /> Ver todas as vantagens
            </Link>
            <Link href="/contact#orcamento" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-bold text-[#082F5B] shadow-md transition-colors hover:bg-[#D97706]">
              Faça Contato <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
