import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PaymentView({ bookingData, onPaymentSuccess, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('priya@okicici');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);

  const hotelName = bookingData?.name || 'Hotel Bougainvillea';
  const location = bookingData?.location || 'Candolim, Goa';
  const totalAmount = bookingData?.total || 9600;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        bookingId: 'RMQ-48291',
        hotelName,
        location,
        totalAmount,
        dates: 'October 12 → October 14',
        guests: 2,
        nights: 2,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] pt-24 pb-32 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#38BDF8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hotel Details</span>
        </button>

        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl font-syne font-extrabold text-white">
                Secure Checkout
              </h1>
              <p className="text-xs text-gray-400">
                Encrypted 256-bit payment transaction
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#34D399]/20 flex items-center justify-center text-[#34D399]">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
            <p className="font-bold text-base font-syne text-white">
              {hotelName}
            </p>
            <p className="text-gray-400">{location} · Oct 12 – Oct 14 (2 Nights, 2 Guests)</p>
            <div className="pt-2 border-t border-white/10 flex justify-between font-mono text-sm font-bold text-[#38BDF8]">
              <span>Total Amount Payable:</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* PAYMENT METHOD TABS */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-semibold block">
                Select Payment Method:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI (GPay / PhonePe)' },
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'netbanking', label: 'Net Banking' },
                  { id: 'emi', label: 'EMI Options' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      paymentMethod === m.id
                        ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FIELDS */}
            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <label className="text-xs text-gray-300 block">Enter VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@upi"
                  className="w-full bg-[#111827] border border-white/15 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#111827] border border-white/15 rounded-xl p-3 text-sm font-mono text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl p-3 text-sm font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">CVV Code</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#111827] border border-white/15 rounded-xl p-3 text-sm font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TRUST SIGNALS */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400 py-2 border-y border-white/5">
              <div className="flex items-center justify-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-[#34D399]" />
                <span>256-Bit SSL Secured</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <CreditCard className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Razorpay Powered</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span>PCI DSS Compliant</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white font-syne font-bold text-base shadow-xl shadow-[#6C63FF]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay ₹{totalAmount.toLocaleString('en-IN')} Securely</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
