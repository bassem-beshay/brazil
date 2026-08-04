"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CreditCard, CheckCircle, Tag, ArrowRight, UserPlus, FileDown } from 'lucide-react';
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
        const basePrice = parseFloat(pkg.price) * travelers.length;

        if (discType === 'percentage') {
          setDiscountVal(basePrice * (val / 100));
        } else {
          setDiscountVal(val);
        }
        alert("Promo coupon applied successfully!");
      } else {
        alert(res.data.detail || "Coupon is invalid.");
      }
    } catch {
      alert("Error checking coupon validation.");
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
      // 1. Submit checkout to create pending booking and get mock Stripe intent
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
      const bRef = res.data.booking.booking_reference;
      setBookingRef(bRef);
      setGrandTotal(res.data.booking.grand_total);

      // 2. Trigger Stripe webhook mockup to confirm booking and build pdf invoice in database
      const stripeClientSecret = res.data.stripe_client_secret;
      
      // Auto confirm for mock flow
      await api.post('/bookings/webhook/stripe/', {
        type: "payment_intent.succeeded",
        booking_reference: bRef,
        data: {
          object: {
            id: `ch_mock_${bRef.slice(0, 8)}`,
            amount: parseFloat(res.data.booking.grand_total) * 100
          }
        }
      });

      // Fetch invoice details
      let attempts = 0;
      const checkInvoice = setInterval(async () => {
        attempts++;
        try {
          const detailRes = await api.get(`/bookings/checkout/${bRef}/`);
          if (detailRes.data.invoice?.pdf_file_url) {
            setInvoicePdfUrl(detailRes.data.invoice.pdf_file_url);
            clearInterval(checkInvoice);
            setStep(3);
            setLoading(false);
          }
        } catch {}
        if (attempts > 10) {
          clearInterval(checkInvoice);
          setStep(3);
          setLoading(false);
        }
      }, 1500);

    } catch (err) {
      alert("Checkout failed. Check inputs.");
      setLoading(false);
    }
  };

  if (!pkg) return null;

  const basePriceVal = parseFloat(pkg.price) * travelers.length;
  const computedGrandTotal = basePriceVal - discountVal + ((basePriceVal - discountVal) * 0.05);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Wizard Header Stepper */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
        {[
          { num: 1, name: "Traveler Details" },
          { num: 2, name: "Billing & Secure Payment" },
          { num: 3, name: "Confirmation & Invoice" }
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
            <div className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-[#263238] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1B5E20]" /> Traveler Manifest Details
              </h2>

              {travelers.map((t, idx) => (
                <div key={idx} className="border-t border-gray-100 pt-6 first:border-0 first:pt-0 space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Traveler #{idx + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 mb-1 block">First Name</label>
                      <input 
                        type="text" 
                        required 
                        value={t.first_name} 
                        onChange={e => handleFieldChange(idx, 'first_name', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Last Name</label>
                      <input 
                        type="text" 
                        required 
                        value={t.last_name} 
                        onChange={e => handleFieldChange(idx, 'last_name', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={t.email} 
                        onChange={e => handleFieldChange(idx, 'email', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Passport Number</label>
                      <input 
                        type="text" 
                        required 
                        value={t.passport_number} 
                        onChange={e => handleFieldChange(idx, 'passport_number', e.target.value)} 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button" 
                onClick={handleAddTraveler}
                className="text-xs font-semibold text-[#1B5E20] hover:text-[#2E7D32] transition-colors"
              >
                + Add Another Passenger
              </button>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold text-xs px-8 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                Continue to Payment <ArrowRight className="w-4 h-4" />
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
              <div className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-[#263238] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#1B5E20]" /> Secure Payment
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      required 
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      required 
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM / YY"
                        required 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 mb-1 block">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        required 
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full outline-none focus:border-[#1B5E20]"
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
                  &larr; Back to Travelers
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold text-xs px-8 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {loading ? "Confirming Order..." : `Pay $${computedGrandTotal.toFixed(2)}`}
                </button>
              </div>
            </form>

            {/* Bill Summary Sidebar */}
            <div className="bg-white rounded-2xl p-6 shadow-premium border border-gray-100 h-fit space-y-6">
              <h3 className="font-bold text-sm text-[#263238] border-b border-gray-100 pb-3">Booking Summary</h3>
              
              <div className="space-y-2 text-xs leading-relaxed text-gray-600">
                <div className="flex justify-between">
                  <span>Tour Package:</span>
                  <span className="font-semibold text-right max-w-[120px] truncate">{pkg.tour_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers Count:</span>
                  <span className="font-semibold">{travelers.length} Passengers</span>
                </div>
              </div>

              {/* Promo Coupon Entry */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <label className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#1B5E20]" /> Promo Coupon
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="BRAZIL2026"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] flex-1 outline-none" 
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    className="bg-[#1B5E20] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#2E7D32] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Subtotal and Summary values */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${basePriceVal}</span>
                </div>
                {discountVal > 0 && (
                  <div className="flex justify-between text-[#EC407A]">
                    <span>Discount:</span>
                    <span>-${discountVal}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (5%):</span>
                  <span>${((basePriceVal - discountVal) * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-[#263238]">
                  <span>Total Bill:</span>
                  <span className="text-[#1B5E20]">${computedGrandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success or failure */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key="step3"
            className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-premium border border-gray-100 text-center space-y-6"
          >
            <CheckCircle className="w-16 h-16 text-[#1B5E20] mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-[#263238]">Reservation Confirmed!</h2>
            <p className="text-xs text-[#546E7A] leading-relaxed">
              Your transaction succeeded. We have registered your passenger credentials and generated your premium PDF invoice.
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 text-xs text-left space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking Ref:</span>
                <span className="font-bold text-[#263238] uppercase">{bookingRef.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Charged:</span>
                <span className="font-bold text-[#1B5E20]">${grandTotal}</span>
              </div>
            </div>

            {invoicePdfUrl && (
              <a 
                href={invoicePdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer w-full"
              >
                <FileDown className="w-4 h-4" /> Download PDF Invoice
              </a>
            )}

            <button 
              onClick={() => {
                localStorage.removeItem('checkout_package');
                router.push('/');
              }} 
              className="text-xs font-semibold text-[#1B5E20] hover:text-[#2E7D32] transition-colors"
            >
              Back to Homepage
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
