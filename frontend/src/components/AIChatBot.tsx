"use client";

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      sender: 'bot', 
      text: "Olá! Sou o Concierge Virtual da Girasol Viagens. Como posso ajudar a planejar sua viagem dos sonhos para o Egito ou América do Sul hoje?" 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Como funciona o Cruzeiro no Rio Nilo?",
    "Brasileiros precisam de visto para o Egito?",
    "Quais os melhores pacotes com guias em português?"
  ]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat/', { message: textToSend });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
      if (response.data.suggested_questions) {
        setSuggestions(response.data.suggested_questions);
      }
    } catch {
      // Friendly Portuguese fallback response
      setTimeout(() => {
        let reply = "Com certeza! Nossos pacotes contam com guias egiptólogos profissionais em língua portuguesa, cruzeiros 5 estrelas com pensão completa e assistência VIP 24h. Você pode solicitar um orçamento sem compromisso na nossa aba de Contato ou conversar diretamente via WhatsApp no +20 106 087 3700.";
        if (textToSend.toLowerCase().includes("visto")) {
          reply = "Para cidadãos brasileiros e portugueses, o visto de turismo para o Egito custa US$ 25 e pode ser emitido na chegada ao aeroporto do Cairo com o auxílio direto da equipe de desembarque da Girasol!";
        } else if (textToSend.toLowerCase().includes("cruzeiro") || textToSend.toLowerCase().includes("nilo")) {
          reply = "Nossos cruzeiros pelo Nilo entre Luxor e Aswan têm duração de 4 a 5 noites em navios 5 estrelas de alto luxo, com todas as refeições inclusas e passeios aos templos de Karnak, Luxor, Edfu, Kom Ombo e Philae.";
        }
        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-2 border-white"
        title="Fale com nosso Concierge Virtual"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white p-4 flex items-center justify-between shadow">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FBC02D]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Girasol Concierge AI</h4>
                  <span className="text-[10px] text-emerald-200">Assistente de Viagens 24h</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/70">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#1B5E20] text-white rounded-tr-none shadow'
                        : 'bg-white text-[#263238] shadow-sm border border-gray-100 rounded-tl-none font-light'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 text-xs text-gray-400 shadow-sm border border-gray-100 animate-pulse">
                    Digitando resposta...
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            {suggestions.length > 0 && (
              <div className="p-3 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    className="text-[10px] bg-gray-50 hover:bg-[#1B5E20]/10 hover:text-[#1B5E20] border border-gray-200 rounded-full px-2.5 py-1 text-[#263238] transition-colors cursor-pointer text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Tire suas dúvidas sobre pacotes, datas..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#1B5E20] text-[#263238]"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
