import React, { useState } from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Wifi,
  Coffee,
  ShieldCheck,
  Car,
  Clock,
  Waves,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function HotelDetailsView({ hotel, onProceedToPayment, onBack }) {
  const currentHotel = hotel || {
    name: 'Hotel Bougainvillea',
    rating: 4.7,
    location: 'Candolim, Goa',
    nightlyPrice: 4200,
    subtotal: 8400,
    taxes: 1200,
    total: 9600,
    roomType: 'Deluxe Sea-View Room',
    nights: 2,
    guests: 2,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=60',
    ],
  };

  const [activeImage, setActiveImage] = useState(currentHotel.images[0]);

  const amenities = [
    { label: 'Free Breakfast', icon: Coffee },
    { label: 'Swimming Pool', icon: Waves },
    { label: 'Free WiFi', icon: Wifi },
    { label: 'Free Cancellation', icon: ShieldCheck },
    { label: 'Air Conditioning', icon: CheckCircle2 },
    { label: '24hr Front Desk', icon: Clock },
    { label: 'Parking', icon: Car },
    { label: 'Beach (8 min walk)', icon: MapPin },
  ];

  const aiReasons = [
    'Fits your ₹30K budget — leaves ₹8,600 for activities & food',
    '8 min walk from Day 1 & Day 2 prime itinerary locations',
    '4.7 rating verified with 420+ traveler reviews',
    'Included breakfast saves ~₹600 per day',
    'Free cancellation policy matches your flexible travel preference',
  ];

  const reviews = [
    {
      author: 'Rohan Sharma',
      rating: 5,
      date: 'Sep 2026',
      text: 'Super clean rooms with sea views! Staff was very courteous and breakfast spread was amazing.',
    },
    {
      author: 'Ananya Roy',
      rating: 4.8,
      date: 'Aug 2026',
      text: 'Perfect location in Candolim. Quiet at night yet close to main beach road. Highly recommend!',
    },
    {
      author: 'Vikram Mehta',
      rating: 4.5,
      date: 'Jul 2026',
      text: 'Great value for money. Tripzy recommended this and it matched our expectations 100%.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] pt-24 pb-32 text-white">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        {/* Top Back Navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#38BDF8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* IMAGE GALLERY */}
        <div className="space-y-3">
          <div className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={activeImage}
              alt={currentHotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-[#FBBF24] flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current" />
              <span>{currentHotel.rating} (420 reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {currentHotel.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 rounded-xl overflow-hidden border transition-all ${
                  activeImage === img
                    ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/50'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* MAIN HOTEL DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT CONTENT (Col 1-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header info */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-syne font-extrabold text-white">
                {currentHotel.name}
              </h1>
              <p className="text-sm text-gray-400 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                <span>{currentHotel.location}</span>
                <span>•</span>
                <span className="text-gray-300 font-medium">
                  {currentHotel.roomType}
                </span>
              </p>
            </div>

            {/* WHY AI CHOSE THIS CARD */}
            <div className="glass-card p-6 rounded-2xl border border-[#6C63FF]/40 bg-gradient-to-b from-[#6C63FF]/10 to-transparent space-y-3">
              <div className="flex items-center space-x-2 text-[#38BDF8]">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-syne font-bold text-base text-white">
                  Why AI chose this hotel for you
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                {aiReasons.map((reason, idx) => (
                  <p key={idx} className="flex items-start space-x-2 text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* AMENITIES */}
            <div className="space-y-4">
              <h3 className="font-syne font-bold text-lg text-white">
                Hotel Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {amenities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center space-x-2.5 text-xs text-gray-300"
                    >
                      <Icon className="w-4 h-4 text-[#38BDF8]" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEWS */}
            <div className="space-y-4">
              <h3 className="font-syne font-bold text-lg text-white">
                Verified Guest Reviews
              </h3>
              <div className="space-y-3">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rev.author}</span>
                      <div className="flex items-center space-x-1 text-[#FBBF24]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PRICING SIDEBAR (Col 9-12) */}
          <div className="lg:col-span-4">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6 sticky top-28">
              <h3 className="font-syne font-bold text-lg text-white border-b border-white/10 pb-3">
                Price Breakdown
              </h3>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>₹4,200 × 2 Nights</span>
                  <span className="font-mono text-white">₹8,400</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & GST (14%)</span>
                  <span className="font-mono text-white">₹1,200</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Breakfast (Included)</span>
                  <span>FREE</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#38BDF8]">₹9,600</span>
                </div>
              </div>

              <div className="space-y-3.5">
                <button
                  onClick={() => {
                    const url = currentHotel.booking_url || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(currentHotel.name + ' ' + (currentHotel.location || 'Goa'))}&aid=123456`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#003580] hover:bg-[#00224f] text-white font-syne font-bold text-sm shadow-xl flex items-center justify-center space-x-2 border border-blue-400/30 transition-all cursor-pointer"
                >
                  <span>Open & Book on Booking.com ↗</span>
                </button>

                <button
                  onClick={() => onProceedToPayment(currentHotel)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white font-syne font-bold text-sm shadow-xl shadow-[#6C63FF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Pay & Book with Tripzy →</span>
                </button>
              </div>

              <div className="text-[11px] text-gray-500 text-center space-y-1">
                <p>🔒 256-Bit SSL Encrypted Payment</p>
                <p>Free cancellation up to 24 hours before check-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 border-t border-white/10 backdrop-blur-xl py-3 px-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Total Price for 2 Guests (2 Nights)</p>
          <p className="text-xl font-bold font-mono text-[#38BDF8]">₹9,600</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              const url = currentHotel.booking_url || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(currentHotel.name + ' ' + (currentHotel.location || 'Goa'))}&aid=123456`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            className="px-5 py-2.5 rounded-full bg-[#003580] hover:bg-[#00224f] text-white font-syne font-bold text-xs shadow-lg transition-all border border-blue-400/30 cursor-pointer"
          >
            Booking.com ↗
          </button>
          <button
            onClick={() => onProceedToPayment(currentHotel)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white font-syne font-bold text-xs shadow-lg shadow-[#6C63FF]/30 hover:scale-105 transition-all cursor-pointer"
          >
            Pay & Book →
          </button>
        </div>
      </div>
    </div>
  );
}
