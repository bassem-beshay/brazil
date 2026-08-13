import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-[#1B5E20] hover:underline font-bold mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Início
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-premium border border-gray-100 space-y-8 text-[#263238]">
          <div className="border-b border-gray-100 pb-6">
            <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider block mb-1">
              Girasol Viagens e Turismo Ltd.
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Termos de Uso & Condições de Reserva
            </h1>
            <p className="text-xs text-gray-400 mt-2">Última atualização: Agosto de 2026</p>
          </div>

          <section className="space-y-4 text-sm text-[#546E7A] leading-relaxed font-light">
            <h2 className="text-lg font-bold text-[#263238]">1. Introdução e Aceitação</h2>
            <p>
              Ao solicitar orçamentos, contratar serviços ou efetuar reservas através do portal da **Girasol Viagens e Turismo** (doravante denominada "Girasol"), o cliente declara estar ciente e de acordo com todas as cláusulas e condições gerais estabelecidas neste instrumento.
            </p>

            <h2 className="text-lg font-bold text-[#263238]">2. Confirmação de Reserva e Pagamentos</h2>
            <p>
              Para a confirmação de qualquer pacote turístico ou serviço de cruzeiro no Rio Nilo, é necessário o pagamento de um sinal de garantia (geralmente entre 25% e 30% do valor total do pacote). O saldo remanescente deverá ser quitado até 30 dias antes da data de início dos serviços ou conforme acordado com seu consultor de viagens.
            </p>

            <h2 className="text-lg font-bold text-[#263238]">3. Política de Cancelamento e Reembolsos</h2>
            <p>
              Em caso de cancelamento por parte do viajante, as seguintes condições serão aplicadas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Até 45 dias antes do embarque: devolução integral do sinal, deduzidas apenas as taxas administrativas de transferência.</li>
              <li>Entre 44 e 21 dias antes do embarque: retenção de 25% do valor total da reserva.</li>
              <li>Menos de 20 dias antes do embarque: retenção de 50% a 100% dependendo das políticas dos navios e hotéis contratados.</li>
            </ul>

            <h2 className="text-lg font-bold text-[#263238]">4. Responsabilidades do Viajante</h2>
            <p>
              É de responsabilidade exclusiva do passageiro portar passaporte válido com validade mínima de 6 meses a partir da data de entrada no Egito ou país de destino, bem como obter os vistos necessários e certificados de vacinação exigidos pelas autoridades competentes.
            </p>

            <h2 className="text-lg font-bold text-[#263238]">5. Seguro de Viagem</h2>
            <p>
              Recomendamos fortemente a contratação de um seguro de viagem com cobertura para despesas médicas, hospitalares e cancelamento de voos durante todo o período da sua jornada.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
