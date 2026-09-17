import React, { useState } from 'react';
import {
  Luggage,
  Train,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Radio,
  Ticket,
  Sun,
  Sparkles,
} from 'lucide-react';

export default function MyTripView({ onStartLiveMode }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [expandedDay, setExpandedDay] = useState(1);

  const itineraryDays = [
    { day: 1, title: 'Arrival, Beach, Dinner', desc: 'Calangute walk, Sunset at Vagator & Seafood at Martins' },
    { day: 2, title: 'Fort, Market, Photography', desc: 'Fort Aguada, Kokni Kanteen & Fontainhas Latin Quarter' },
    { day: 3, title: 'Watersports, Sunset, Night Market', desc: 'Scuba diving at Baga, Anjuna sunset & flea market' },
    { day: 4, title: 'Day trip to Dudhsagar', desc: 'Jungle trek, train bridge view & natural waterfall pool' },
    { day: 5, title: 'Leisure, Spa, Farewell dinner', desc: 'Ayurvedic wellness spa, beach lounge & candlelight dinner' },
    { day: 6, title: 'Return journey', desc: 'Souvenir shopping & evening train back to Mumbai' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] pt-24 pb-32 text-white">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-syne font-extrabold text-white">
              MY TRIPS
            </h1>
            <p className="text-xs font-mono text-[#38BDF8] mt-1 uppercase tracking-widest">
              GOA · OCT 12 – OCT 17 · 6 DAYS
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex space-x-2 bg-white/5 p-1 rounded-xl border border-white/5 text-xs font-semibold">
            {['Upcoming', 'Active', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-[#6C63FF] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TRIP SUMMARY CARD */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl bg-gradient-to-r from-[#111827] via-[#1A2234] to-[#111827]">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-widest">
                CONFIRMED TRIP
              </span>
              <h2 className="text-2xl font-syne font-bold text-white mt-1">
                ✦ Goa Adventure
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 text-xs font-mono font-bold">
              Status: Confirmed ✓
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs font-mono text-gray-300">
            <div>
              <p className="text-gray-500">BUDGET</p>
              <p className="font-bold text-white text-sm">₹30,000</p>
            </div>
            <div>
              <p className="text-gray-500">DURATION</p>
              <p className="font-bold text-white text-sm">6 Days</p>
            </div>
            <div>
              <p className="text-gray-500">GUESTS</p>
              <p className="font-bold text-white text-sm">2 Guests</p>
            </div>
          </div>
        </div>

        {/* TRANSPORT SECTION */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-[#38BDF8]">
            <Train className="w-5 h-5" />
            <h3 className="font-syne font-bold text-base text-white">
              Transportation
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold font-syne text-white text-sm">
                🚆 Mumbai → Goa (Rajdhani Express)
              </p>
              <p className="text-gray-400 mt-0.5">
                Oct 12, 08:30 AM · Seat Coach A2, Berths 32/33
              </p>
            </div>
            <button
              onClick={() => alert('Train E-Ticket PNR: 48291039')}
              className="px-3 py-1.5 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold text-xs flex items-center space-x-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>View Ticket</span>
            </button>
          </div>
        </div>

        {/* HOTEL SECTION */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-[#6C63FF]">
            <Building2 className="w-5 h-5" />
            <h3 className="font-syne font-bold text-base text-white">
              Hotel Stay Vouchers
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold font-syne text-white text-sm">
                🏨 Hotel Bougainvillea
              </p>
              <p className="text-gray-400 mt-0.5">
                Candolim, Goa · Oct 12 – Oct 14 (2 Nights) · Confirmed ✓
              </p>
            </div>
            <button
              onClick={() => alert('Hotel Voucher Code: RMQ-H-8829')}
              className="px-3 py-1.5 rounded-lg bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30 font-semibold text-xs flex items-center space-x-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>View Voucher</span>
            </button>
          </div>
        </div>

        {/* EXPANDABLE ITINERARY DAYS */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-syne font-bold text-base text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#34D399]" />
            <span>6-Day Master Itinerary</span>
          </h3>

          <div className="space-y-2">
            {itineraryDays.map((item) => {
              const isExpanded = expandedDay === item.day;
              return (
                <div
                  key={item.day}
                  className="rounded-xl border border-white/5 bg-white/5 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : item.day)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-[#6C63FF]/20 text-[#38BDF8] font-mono font-bold text-xs flex items-center justify-center">
                        D{item.day}
                      </span>
                      <span className="font-syne font-bold text-sm text-white">
                        {item.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 text-xs text-gray-300 border-t border-white/5 bg-black/20">
                      <p className="leading-relaxed">{item.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM LIVE TRIP MODE TRIGGER */}
        <div className="sticky bottom-6 z-30 pt-4">
          <button
            onClick={onStartLiveMode}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white font-syne font-extrabold text-xl shadow-2xl shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-3"
          >
            <Radio className="w-6 h-6 animate-pulse" />
            <span>🔴 Start Live Trip Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
