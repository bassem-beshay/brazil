import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
              Política de Privacidade & Proteção de Dados
            </h1>
            <p className="text-xs text-gray-400 mt-2">Última atualização: Agosto de 2026</p>
          </div>

          <section className="space-y-4 text-sm text-[#546E7A] leading-relaxed font-light">
            <h2 className="text-lg font-bold text-[#263238]">1. Coleta de Informações</h2>
            <p>
              A **Girasol Viagens e Turismo** coleta informações pessoais necessárias para a prestação de serviços turísticos, tais como: nome completo, endereço de e-mail, número de telefone/WhatsApp, dados de passaporte (para emissão de bilhetes de voos internos, permissões de templos e reservas de hotéis) e preferências de viagem.
            </p>

            <h2 className="text-lg font-bold text-[#263238]">2. Uso dos Dados</h2>
            <p>
              Os dados coletados são utilizados estritamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Processar cotações, emitir vouchers e formalizar contratos de viagem;</li>
              <li>Prestar suporte e assistência 24/7 durante o roteiro;</li>
              <li>Enviar informativos sobre novidades e promoções com opção permanente de descadastramento.</li>
            </ul>

            <h2 className="text-lg font-bold text-[#263238]">3. Compartilhamento Seguro</h2>
            <p>
              Não comercializamos, alugamos ou compartilhamos seus dados com terceiros para fins publicitários. Os dados são repassados exclusivamente aos fornecedores diretamente envolvidos na sua viagem (companhias aéreas, hotéis, navios de cruzeiro e autoridades de turismo do Egito).
            </p>

            <h2 className="text-lg font-bold text-[#263238]">4. Seus Direitos</h2>
            <p>
              Você pode solicitar a qualquer momento a visualização, retificação ou exclusão dos seus dados cadastrais em nossos sistemas entrando em contato através do e-mail: <strong>privacy@girasoltours.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
