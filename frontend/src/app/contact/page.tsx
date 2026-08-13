"use client";

import React, { useState } from 'react';
import { 
  Phone, Mail, MessageCircle, MapPin, Clock, 
  Send, CheckCircle2, ShieldCheck, Sparkles, HelpCircle 
} from 'lucide-react';
import { MOCK_OFFICES } from '@/lib/mockData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Egito Clássico: Cairo & Cruzeiro no Nilo',
    travelDate: '',
    adults: '2',
    children: '0',
    hotelCategory: '5-estrelas-luxo',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Hero Header */}
      <section className="relative h-72 bg-[#1A252C] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-35 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503177112294-7337da2a563d?q=80&w=1600')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A252C] via-black/40 to-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="text-[#FBC02D] font-bold text-xs uppercase tracking-widest block mb-2">
            Atendimento Personalizado &bull; Suporte 24/7
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 font-display">
            Fale Conosco & Solicite Seu Orçamento
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Monte sua viagem sob medida com nossa equipe de especialistas no Egito e no Brasil.
          </p>
        </div>
      </section>

      {/* 2. Main Form & Info Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Interactive Quote Builder (Col-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-12 shadow-premium border border-gray-100" id="orcamento">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#263238]">Solicitação Recebida com Sucesso!</h3>
              <p className="text-sm text-[#546E7A] max-w-md mx-auto leading-relaxed">
                Muito obrigado, <strong>{formData.name}</strong>. Um de nossos consultores egiptólogos já está analisando suas preferências e entrará em contato via WhatsApp/E-mail em até poucas horas com a proposta personalizada.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-[#1B5E20] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow mt-4"
              >
                Enviar Nova Solicitação
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-[#FBC02D]" />
                  Planeje Sua Jornada Sem Compromisso
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#263238]">
                  Solicitar Orçamento Personalizado
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Preencha o formulário abaixo e receba seu roteiro detalhado com tarifas exclusivas de operadora.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">Nome Completo *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: João da Silva"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">E-mail *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Ex: joao@email.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">WhatsApp / Telefone com DDI *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Ex: +55 (11) 99999-9999"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">Destino de Interesse *</label>
                    <select 
                      value={formData.destination}
                      onChange={e => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]"
                    >
                      <option value="Egito Clássico: Cairo & Cruzeiro no Nilo">Egito Clássico: Cairo & Cruzeiro no Nilo (8 Dias)</option>
                      <option value="Egito Completo: Pirâmides, Nilo & Hurghada">Egito Completo: Pirâmides, Nilo & Hurghada (11 Dias)</option>
                      <option value="Egito, Jordânia (Petra) & Dubai">Multi-Destino: Egito, Jordânia & Dubai (14 Dias)</option>
                      <option value="Brasil Grand Luxury: Rio, Amazônia & Iguaçu">Brasil Grand Luxury: Rio, Amazônia & Iguaçu (10 Dias)</option>
                      <option value="Roteiro 100% Personalizado">Roteiro 100% Personalizado (Sob Medida)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">Data Prevista de Viagem</label>
                    <input 
                      type="date" 
                      value={formData.travelDate}
                      onChange={e => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">Adultos</label>
                    <select 
                      value={formData.adults}
                      onChange={e => setFormData({ ...formData, adults: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]"
                    >
                      <option value="1">1 Adulto</option>
                      <option value="2">2 Adultos</option>
                      <option value="3">3 Adultos</option>
                      <option value="4+">4 ou mais Adultos (Grupo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#263238] block mb-1.5">Categoria de Hotéis</label>
                    <select 
                      value={formData.hotelCategory}
                      onChange={e => setFormData({ ...formData, hotelCategory: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-[#1B5E20]"
                    >
                      <option value="5-estrelas-luxo">5 Estrelas Luxo (Padrão Girasol)</option>
                      <option value="5-estrelas-ultra">5 Estrelas Ultra-Luxo / Boutique</option>
                      <option value="4-estrelas-superior">4 Estrelas Superior</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1.5">Observações ou Pedidos Especiais</label>
                  <textarea 
                    rows={4}
                    placeholder="Conte-nos sobre seus interesses especiais (Ex: voo de balão em Luxor, lua de mel, quartos conjugados, refeições especiais...)"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs sm:text-sm outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Enviando Solicitação..." : "Enviar Solicitação de Orçamento"} <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Contact Info & Direct Channels (Col-1) */}
        <div className="space-y-8">
          {/* WhatsApp Direct Card */}
          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-8 text-white shadow-premium space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FBC02D] block">
              Atendimento Imediato
            </span>
            <h3 className="text-xl font-bold">Prefere Falar no WhatsApp?</h3>
            <p className="text-xs text-gray-100 font-light leading-relaxed">
              Nossa equipe de plantão está pronta para conversar diretamente com você sobre itinerários e tirar dúvidas em tempo real.
            </p>
            <a 
              href="https://wa.me/201060873700"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Iniciar Conversa no WhatsApp
            </a>
          </div>

          {/* Direct Phone & Email List */}
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 space-y-6">
            <h4 className="font-bold text-base text-[#263238]">Canais Oficiais de Contato</h4>

            <div className="space-y-4 text-xs text-[#546E7A]">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#263238] block">Central Telefônica Egito:</span>
                  <span>+20 2 3771 5511 / +20 1227 011 900</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#263238] block">E-mails de Atendimento:</span>
                  <span>info@girasoltours.com / reservas@girasoltours.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#263238] block">Horário de Funcionamento:</span>
                  <span>Segunda a Sábado: 09h00 às 19h00 (Plantão 24/7)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Global Offices Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl font-bold text-[#263238]">Nossas Filiais no Egito e no Brasil</h3>
          <p className="text-xs text-gray-500 mt-1">Presença local para garantir assistência presencial e pontualidade.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_OFFICES.map((off, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-premium border border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1B5E20]" />
                <h4 className="font-bold text-sm text-[#263238]">{off.city}</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{off.address}</p>
              <p className="text-xs font-semibold text-[#1B5E20]">{off.phone}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
