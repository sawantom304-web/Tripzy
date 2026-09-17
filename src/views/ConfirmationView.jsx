import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Mail, Download, ArrowRight, Sparkles } from 'lucide-react';

export default function ConfirmationView({ bookingDetails, onViewMyTrip }) {
  const details = bookingDetails || {
    bookingId: 'TPZ-48291',
    hotelName: 'Hotel Bougainvillea',
    location: 'Candolim, Goa',
    dates: 'October 12 → October 14',
    guests: 2,
    nights: 2,
    totalAmount: 9600,
  };

  useEffect(() => {
    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C63FF', '#38BDF8', '#34D399'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1A] pt-24 pb-32 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Animated Check Circle */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#34D399] to-[#38BDF8] flex items-center justify-center mx-auto shadow-2xl shadow-[#34D399]/40 animate-bounce">
          <Check className="w-12 h-12 text-black stroke-[3]" />
        </div>

        <div>
          <h1 className="text-3xl md:text-5xl font-syne font-extrabold text-white tracking-wide">
            BOOKING CONFIRMED
          </h1>
          <p className="text-xs font-mono text-[#34D399] mt-2 uppercase tracking-widest">
            Booking ID: {details.bookingId}
          </p>
        </div>

        {/* Voucher Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 text-left shadow-2xl">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold font-syne text-white">
              {details.hotelName}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{details.location}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500 font-mono">DATES</p>
              <p className="font-semibold text-white mt-0.5">{details.dates}</p>
            </div>
            <div>
              <p className="text-gray-500 font-mono">STAY DURATION</p>
              <p className="font-semibold text-white mt-0.5">
                {details.nights} Nights · {details.guests} Guests
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono">
            <span className="text-xs text-gray-400">Total Paid:</span>
            <span className="text-xl font-bold text-[#34D399]">
              ₹{details.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 flex items-center justify-center space-x-1.5">
          <Mail className="w-4 h-4 text-[#38BDF8]" />
          <span>Confirmation & PDF voucher sent to your email.</span>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onViewMyTrip}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white font-syne font-bold text-sm shadow-xl shadow-[#6C63FF]/30 hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <span>View My Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('PDF Voucher Downloaded')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-syne font-semibold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
