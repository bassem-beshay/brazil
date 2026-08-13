"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, ChevronDown, Search, MessageCircle, 
  Phone, Mail, ShieldCheck, FileText, CheckCircle2 
} from 'lucide-react';
import { MOCK_FAQS, FAQItem } from '@/lib/mockData';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-2': true });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'Todas as Dúvidas' },
    { id: 'reservas', label: 'Reservas & Pagamentos' },
    { id: 'vistos', label: 'Vistos & Documentação' },
    { id: 'cruzeiro', label: 'Cruzeiro no Rio Nilo' },
    { id: 'seguranca', label: 'Segurança & Saúde' },
    { id: 'geral', label: 'Informações Gerais' }
  ];

  const filteredFAQs = MOCK_FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Central de Ajuda & Informações
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Perguntas Frequentes (FAQ)
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Tudo o que você precisa saber sobre vistos, reservas, cruzeiros no Nilo, vestuário e segurança no Egito.
          </p>
        </div>
      </section>

      {/* 2. Search & Category Tabs */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-premium border border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1B5E20] shrink-0" />
          <input 
            type="text" 
            placeholder="Digite sua dúvida (ex: visto, pagamento, cruzeiro, idioma...)" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm outline-none text-[#263238] placeholder:text-gray-400" 
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1B5E20] text-white shadow'
                  : 'bg-white text-[#546E7A] hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Accordion List */}
      <section className="max-w-4xl mx-auto px-6 mt-12 space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div 
                key={faq.id} 
                className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-bold text-base text-[#263238] flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#1B5E20] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1B5E20]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#546E7A] leading-relaxed font-light border-t border-gray-50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#263238] mb-1">Nenhuma pergunta encontrada</h3>
            <p className="text-xs text-gray-500">Tente buscar por outras palavras-chave ou fale diretamente com nosso concierge.</p>
          </div>
        )}
      </section>

      {/* 4. Still have questions box */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-premium border border-gray-100 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center mx-auto">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#263238] mb-2">Ainda tem dúvidas sobre sua viagem?</h3>
            <p className="text-xs sm:text-sm text-[#546E7A] max-w-lg mx-auto font-light leading-relaxed">
              Nossa equipe de consultores está pronta para esclarecer qualquer ponto sobre roteiros, voos internos e documentação.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://wa.me/201060873700" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow flex items-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp: +20 106 087 3700
            </a>
            <Link 
              href="/contact" 
              className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs px-6 py-3 rounded-xl shadow flex items-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4" /> Enviar Mensagem por Formulário
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
