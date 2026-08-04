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
    { sender: 'bot', text: "Olá! I am your Girasol AI Concierge. How can I help you plan your luxury South American escape today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Suggest a tour in Rio de Janeiro",
    "Tell me about Amazon packages",
    "How do payments and invoices work?"
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
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Apologies, I encountered an issue synchronizing with our central servers. Please try again shortly." }]);
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
        className="w-14 h-14 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
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
            className="absolute bottom-16 right-0 w-90 h-120 glass-effect rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white"
          >
            {/* Header */}
            <div className="bg-[#1B5E20] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FBC02D]" />
                <div>
                  <h4 className="font-bold text-sm tracking-wide">Girasol Concierge</h4>
                  <span className="text-[10px] text-gray-200">AI Travel Assistant</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#1B5E20] text-white rounded-tr-none'
                        : 'bg-white text-[#263238] shadow-sm border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-gray-400 shadow-sm border border-gray-100 animate-pulse">
                    Typing query...
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            {suggestions.length > 0 && (
              <div className="p-3 bg-white/70 border-t border-gray-100 flex flex-wrap gap-1.5">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    className="text-[10px] bg-gray-100 hover:bg-[#1B5E20]/10 hover:text-[#1B5E20] border border-gray-200 rounded-full px-2.5 py-1 text-[#263238] transition-colors cursor-pointer"
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
                placeholder="Ask about tours, hotels or details..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1B5E20]"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white p-2 rounded-xl transition-colors cursor-pointer"
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
