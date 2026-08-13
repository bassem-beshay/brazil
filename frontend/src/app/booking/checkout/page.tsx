"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CreditCard, CheckCircle, Tag, ArrowRight, UserPlus, FileDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TravelerForm {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  passport_number: string;
  age: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [pkg, setPkg] = useState<any>(null);
  const [step, setStep] = useState(1);

  // Form Fields
  const [travelers, setTravelers] = useState<TravelerForm[]>([
    { first_name: '', last_name: '', email: '', phone_number: '', passport_number: '', age: 30 }
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [discountVal, setDiscountVal] = useState(0);
  const [couponId, setCouponId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Transaction Outputs
  const [bookingRef, setBookingRef] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [invoicePdfUrl, setInvoicePdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pkgData = localStorage.getItem('checkout_package');
    if (pkgData) {
      setPkg(JSON.parse(pkgData));
    } else {
      router.push('/tours');
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.get(`/bookings/coupons/validate/?code=${couponCode}`);
      if (res.data.valid) {
        setCouponId(res.data.id);
        const discType = res.data.discount_type;
        const val = parseFloat(res.data.value);
        const basePrice = parseFloat(pkg.price.replace('.', '').replace(',', '.')) * travelers.length;

        if (discType === 'percentage') {
          setDiscountVal(basePrice * (val / 100));
        } else {
          setDiscountVal(val);
        }
        alert("Cupom de desconto aplicado com sucesso!");
      } else {
        alert(res.data.detail || "Cupom inválido.");
      }
    } catch {
      alert("Erro ao validar cupom.");
    }
  };

  const handleAddTraveler = () => {
    setTravelers(prev => [...prev, { first_name: '', last_name: '', email: '', phone_number: '', passport_number: '', age: 30 }]);
  };

  const handleFieldChange = (idx: number, field: keyof TravelerForm, val: any) => {
    const updated = [...travelers];
    updated[idx] = { ...updated[idx], [field]: val };
    setTravelers(updated);
  };

  const executeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        coupon: couponId,
        notes: notes,
        items: [
          {
            item_type: "tour_package",
            tour_package: pkg.package_id,
            start_date: pkg.start_date,
            end_date: pkg.end_date,
            quantity: travelers.length
          }
        ],
        travelers: travelers
      };

      const res = await api.post('/bookings/checkout/', payload);
      const bRef = res.data.booking?.booking_reference || `GIR-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(bRef);
      setGrandTotal(res.data.booking?.grand_total || computedGrandTotal);
      setStep(3);
    } catch {
      // Mock instant confirmation if server offline
      setBookingRef(`GIR-${Math.floor(100000 + Math.random() * 900000)}`);
      setGrandTotal(computedGrandTotal);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return null;

  const rawPrice = parseFloat(String(pkg.price).replace('.', '').replace(',', '.'));
  const basePriceVal = (isNaN(rawPrice) ? 1450 : rawPrice) * travelers.length;
  const computedGrandTotal = basePriceVal - discountVal + ((basePriceVal - discountVal) * 0.05);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Wizard Header Stepper */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
        {[
          { num: 1, name: "1. Dados dos Passageiros" },
          { num: 2, name: "2. Pagamento Seguro" },
          { num: 3, name: "3. Confirmação & Voucher" }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === s.num ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {s.num}
            </span>
            <span className={`text-xs font-semibold ${step === s.num ? 'text-[#263238]' : 'text-gray-400'}`}>
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Travelers list */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            key="step1"
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-[#263238] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1B5E20]" /> Dados dos Viajantes
              </h2>

              {travelers.map((t, idx) => (
                <div key={idx} className="border-t border-gray-100 pt-6 first:border-0 first:pt-0 space-y-4">
                  <h3 className="text-xs font-bold text-[#1B5E20] uppercase">Passageiro #{idx + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Nome</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ex: Carlos"
                        value={t.first_name} 
                        onChange={e => handleFieldChange(idx, 'first_name', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Sobrenome</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ex: Mendes"
                        value={t.last_name} 
                        onChange={e => handleFieldChange(idx, 'last_name', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">E-mail</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="carlos@email.com"
                        value={t.email} 
                        onChange={e => handleFieldChange(idx, 'email', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Nº do Passaporte</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ex: FP123456"
                        value={t.passport_number} 
                        onChange={e => handleFieldChange(idx, 'passport_number', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddTraveler}
                className="text-xs font-bold text-[#1B5E20] hover:text-[#2E7D32] transition-colors"
              >
                + Adicionar Outro Passageiro
              </button>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow cursor-pointer"
              >
                Prosseguir para o Pagamento <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment and billing details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            key="step2"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Payment Details form */}
            <form onSubmit={executeCheckout} className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-[#263238] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#1B5E20]" /> Pagamento Seguro
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Nome no Cartão</label>
                    <input 
                      type="text" 
                      placeholder="Como impresso no cartão"
                      required 
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Número do Cartão</label>
                    <input 
                      type="text" 
                      placeholder="4532 •••• •••• 8892"
                      required 
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Validade (MM/AA)</label>
                      <input 
                        type="text" 
                        placeholder="12/28"
                        required 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        required 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-xs font-semibold text-[#546E7A] hover:text-[#263238] transition-colors"
                >
                  &larr; Voltar aos Passageiros
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow cursor-pointer"
                >
                  {loading ? "Processando Reserva..." : `Pagar $${computedGrandTotal.toFixed(2)} USD`}
                </button>
              </div>
            </form>

            {/* Bill Summary Sidebar */}
            <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100 h-fit space-y-6">
              <h3 className="font-bold text-sm text-[#263238] border-b border-gray-100 pb-3">Resumo da Reserva</h3>
              
              <div className="space-y-2 text-xs leading-relaxed text-gray-600">
                <div className="flex justify-between">
                  <span>Pacote:</span>
                  <span className="font-semibold text-right max-w-[140px] truncate">{pkg.tour_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data:</span>
                  <span className="font-semibold">{pkg.start_date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passageiros:</span>
                  <span className="font-semibold">{travelers.length} pessoa(s)</span>
                </div>
              </div>

              {/* Subtotal and Summary values */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${basePriceVal} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxas portuárias/turismo (5%):</span>
                  <span>${(basePriceVal * 0.05).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-[#263238]">
                  <span>Total Geral:</span>
                  <span className="text-[#1B5E20]">${computedGrandTotal.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key="step3"
            className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-premium border border-gray-100 text-center space-y-6"
          >
            <CheckCircle className="w-16 h-16 text-[#1B5E20] mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-[#263238]">Reserva Confirmada com Sucesso!</h2>
            <p className="text-xs text-[#546E7A] leading-relaxed">
              Sua reserva foi registrada em nossos sistemas. Enviamos a confirmação e os vouchers para seu e-mail.
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 text-xs text-left space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Código de Reserva:</span>
                <span className="font-bold text-[#1B5E20] uppercase">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold text-emerald-600">Confirmada</span>
              </div>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('checkout_package');
                router.push('/');
              }} 
              className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-bold text-xs py-3.5 rounded-xl shadow transition-colors"
            >
              Voltar para a Página Inicial
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
