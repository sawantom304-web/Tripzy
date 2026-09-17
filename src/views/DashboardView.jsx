import React, { useState } from 'react';
import TripMap from '../components/TripMap';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  HelpCircle,
  AlertTriangle,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sun,
  Cloud,
  CloudRain,
  SlidersHorizontal,
} from 'lucide-react';

const INITIAL_ACTIVITIES = [
  // Day 1
  {
    id: 1,
    day: 1,
    time: '08:30 AM',
    type: 'train',
    icon: '',
    title: 'Mumbai → Goa (Rajdhani Express)',
    location: 'Madgaon Junction',
    duration: '6 hrs',
    lat: 15.2736,
    lng: 73.9581,
    rating: 4.8,
    reason: 'Fastest luxury rail connection within your transportation budget.',
  },
  {
    id: 2,
    day: 1,
    time: '02:30 PM',
    type: 'hotel',
    icon: '',
    title: 'Hotel Check-in',
    location: 'Hotel Bougainvillea, Candolim',
    duration: '1 hr',
    lat: 15.5176,
    lng: 73.7634,
    rating: 4.7,
    reason: 'Strategic central location near beach, saving 35 mins daily travel.',
  },
  {
    id: 3,
    day: 1,
    time: '04:00 PM',
    type: 'beach',
    icon: '',
    title: 'Calangute Beach Walk',
    location: 'Calangute',
    duration: '2 hrs',
    lat: 15.5494,
    lng: 73.7535,
    rating: 4.5,
    reason: 'Matches your beach preference, best late afternoon crowd reduction.',
  },
  {
    id: 4,
    day: 1,
    time: '07:00 PM',
    type: 'sunset',
    icon: '',
    title: 'Sunset at Vagator Beach',
    location: 'Vagator Cliff',
    duration: '1.5 hrs',
    lat: 15.603,
    lng: 73.7336,
    rating: 4.9,
    reason: 'Top photography vantage point for coastal golden hour.',
  },
  {
    id: 5,
    day: 1,
    time: '08:30 PM',
    type: 'food',
    icon: '',
    title: "Local Seafood Dinner at Martin's Corner",
    location: 'Betalbatim / Candolim branch',
    duration: '2 hrs',
    lat: 15.52,
    lng: 73.77,
    rating: 4.8,
    reason: 'Authentic Goan curry & fresh seafood fit for your regional food choice.',
  },

  // Day 2
  {
    id: 6,
    day: 2,
    time: '09:00 AM',
    type: 'history',
    icon: '',
    title: 'Fort Aguada & Lighthouse',
    location: 'Sinquerim',
    duration: '2.5 hrs',
    lat: 15.4925,
    lng: 73.7737,
    rating: 4.6,
    reason: 'Historical landmark with scenic sea views, minimal morning heat.',
  },
  {
    id: 7,
    day: 2,
    time: '12:30 PM',
    type: 'food',
    icon: '',
    title: 'Goan Thali Lunch at Kokni Kanteen',
    location: 'Panjim',
    duration: '1.5 hrs',
    lat: 15.4989,
    lng: 73.8278,
    rating: 4.7,
    reason: 'Top rated local heritage eatery with traditional spice blend.',
  },
  {
    id: 8,
    day: 2,
    time: '03:00 PM',
    type: 'culture',
    icon: '',
    title: 'Fontainhas Latin Quarter Photo Walk',
    location: 'Panjim Old Town',
    duration: '2 hrs',
    lat: 15.496,
    lng: 73.832,
    rating: 4.9,
    reason: 'Vibrant Portuguese heritage architecture ideal for photography.',
  },

  // Day 3
  {
    id: 9,
    day: 3,
    time: '10:00 AM',
    type: 'adventure',
    icon: '',
    title: 'Scuba Diving & Watersports',
    location: 'Grand Island / Baga',
    duration: '4 hrs',
    lat: 15.555,
    lng: 73.751,
    rating: 4.8,
    reason: 'Fits your watersports tag; clear underwater visibility scheduled.',
  },

  // Day 4
  {
    id: 10,
    day: 4,
    time: '08:00 AM',
    type: 'nature',
    icon: '',
    title: 'Dudhsagar Waterfalls Day Trek',
    location: 'Mollem National Park',
    duration: '6 hrs',
    lat: 15.3144,
    lng: 74.3143,
    rating: 4.9,
    reason: 'Breathtaking jungle trek and train bridge view.',
  },

  // Day 5
  {
    id: 11,
    day: 5,
    time: '11:00 AM',
    type: 'relax',
    icon: '',
    title: 'Ayurvedic Spa & Beach Lounge',
    location: 'Anjuna',
    duration: '3 hrs',
    lat: 15.587,
    lng: 73.744,
    rating: 4.7,
    reason: 'Deep relaxation after trekking day.',
  },

  // Day 6
  {
    id: 12,
    day: 6,
    time: '02:00 PM',
    type: 'return',
    icon: '',
    title: 'Return Journey to Mumbai',
    location: 'Thivim / Madgaon Station',
    duration: '6 hrs',
    lat: 15.602,
    lng: 73.871,
    rating: 4.8,
    reason: 'Optimized evening arrival back home.',
  },
];

export default function DashboardView({ tripParams, onSelectHotel }) {
  const [activeDay, setActiveDay] = useState(1);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Chat state
  const [messages, setMessages] = useState([
    {
      sender: 'user',
      text: 'Add a scuba diving activity',
    },
    {
      sender: 'ai',
      text: 'Found two options near Baga. Adding the ₹1,200 option keeps you ₹7,400 within budget. Done!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Reason Tooltip Modal State
  const [selectedReason, setSelectedReason] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');

  const destinationState = tripParams?.destinationState || 'Goa';
  const customCity = tripParams?.customCity || 'Panjim';
  const budgetTotal = tripParams?.budget || 30000;

  // Handle Chat Send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Simulated AI response
    setTimeout(() => {
      let aiText = `I have updated your itinerary based on "${userText}". Route efficiency remains 95% optimal.`;
      if (userText.toLowerCase().includes('sunset')) {
        aiText = 'Adjusted Day 2 timing to arrive at Chapora Fort by 06:15 PM for prime sunset viewing!';
      } else if (userText.toLowerCase().includes('budget') || userText.toLowerCase().includes('cheap')) {
        aiText = 'Recalculating spending... Found local transport options saving ₹1,500 on cab fares!';
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
    }, 600);
  };

  const handleRemoveActivity = (id) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;
    const newAct = {
      id: Date.now(),
      day: activeDay,
      time: '05:00 PM',
      icon: '✨',
      title: newActivityTitle,
      location: `${destinationState} spot`,
      duration: '1.5 hrs',
      lat: 15.52,
      lng: 73.78,
      rating: 4.7,
      reason: 'Added custom activity by user request.',
    };
    setActivities([...activities, newAct]);
    setNewActivityTitle('');
    setShowAddModal(false);
  };

  const currentDayActivities = activities.filter((a) => a.day === activeDay);

  return (
    <div className="min-h-screen bg-[#0A0E1A] pb-24 text-white">
      {/* Dashboard Top Header Bar */}
      <div className="bg-[#111827]/80 border-b border-white/10 py-3 px-6 backdrop-blur-md sticky top-32 z-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#34D399] animate-pulse"></div>
          <h1 className="text-sm md:text-lg font-syne font-bold text-white tracking-wide">
            TRIPZY TRIP OS — {destinationState.toUpperCase()}
          </h1>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono text-[#38BDF8]">
            6 Days · ₹{budgetTotal.toLocaleString('en-IN')} Budget
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6C63FF]" />
            <span>Refine AI Plan</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 space-y-10">
        {/* 3-COLUMN DESKTOP LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL — AI ASSISTANT (Col 1-3) */}
          <div className="lg:col-span-3 glass-card p-5 rounded-2xl border border-white/10 flex flex-col h-[620px]">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#38BDF8]" />
              <h2 className="font-syne font-bold text-base text-white">
                AI Travel Assistant
              </h2>
            </div>

            {/* Persona Summary Card */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2 mb-4 text-xs">
              <p className="font-semibold text-gray-300">
                Trip tuned to your style:
              </p>
              <ul className="space-y-1 text-gray-400">
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>₹{budgetTotal.toLocaleString('en-IN')} budget target</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Photography & Hidden places</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Local Goan food focus</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Balanced travel pace</span>
                </li>
              </ul>
            </div>

            {/* Chat Conversation History */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs no-scrollbar mb-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#6C63FF] text-white rounded-br-none'
                        : 'bg-[#1F2937] text-gray-200 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                placeholder="Ask me anything about your trip..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#38BDF8]"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1 rounded-lg bg-[#38BDF8] text-black hover:bg-[#38BDF8]/80 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* CENTER PANEL — ITINERARY (Col 4-8) */}
          <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-white/10 flex flex-col h-[620px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="font-syne font-bold text-base text-white">
                Day-by-Day Schedule
              </h2>
              <span className="text-xs font-mono text-[#38BDF8]">
                {currentDayActivities.length} Activities
              </span>
            </div>

            {/* Day Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
              {[1, 2, 3, 4, 5, 6].map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-syne whitespace-nowrap transition-all ${
                    activeDay === dayNum
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white shadow-md shadow-[#6C63FF]/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Day {dayNum}
                </button>
              ))}
            </div>

            {/* Timeline List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
              {currentDayActivities.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No activities planned for Day {activeDay} yet.
                </div>
              ) : (
                currentDayActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group relative flex items-start justify-between space-x-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center text-xl shrink-0 mt-0.5">
                        {act.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono text-[#38BDF8]">
                            {act.time}
                          </span>
                          <span className="text-[10px] text-gray-500">•</span>
                          <span className="text-[10px] text-gray-400">
                            {act.duration}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-syne mt-0.5">
                          {act.title}
                        </h4>
                        <p className="text-xs text-gray-400 flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span>{act.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => setSelectedReason(act)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-[#6C63FF]/20 text-[10px] font-semibold text-[#38BDF8] border border-white/10 transition-colors flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why this?</span>
                      </button>
                      <button
                        onClick={() => handleRemoveActivity(act.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Add Activity Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-xs font-semibold text-gray-400 hover:text-white hover:border-[#38BDF8] hover:bg-[#38BDF8]/5 transition-all flex items-center justify-center space-x-2 mt-4"
              >
                <Plus className="w-4 h-4 text-[#38BDF8]" />
                <span>+ Add activity to Day {activeDay}</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL — INTERACTIVE MAP (Col 9-12) */}
          <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-white/10 flex flex-col h-[620px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="font-syne font-bold text-base text-white">
                Interactive Map
              </h2>
              <span className="text-xs font-mono text-[#34D399]">
                Live Route
              </span>
            </div>

            <div className="flex-1 w-full relative">
              <TripMap
                activeDay={activeDay}
                activities={activities}
                onSelectPin={(act) => setSelectedReason(act)}
              />
            </div>
          </div>
        </div>

        {/* SECTION BELOW 3-COLUMN DASHBOARD */}

        {/* HOTEL RECOMMENDATIONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-syne font-bold text-white flex items-center space-x-2">
              <span>Where to Stay — AI Selected</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#6C63FF]/20 text-[#38BDF8]">
                Best Match
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'h1',
                name: 'Hotel Bougainvillea',
                rating: 4.7,
                location: 'Candolim, Goa',
                nightlyPrice: 4200,
                totalPrice: 8400,
                nights: 2,
                image:
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60',
                highlights: [
                  'Near beach (8 min walk)',
                  'Breakfast included',
                  'Free cancellation',
                ],
                whyAI:
                  'Fits your ₹30K budget — leaves ₹8,600 for activities. 8 min walk from Day 1 & Day 2 locations.',
              },
              {
                id: 'h2',
                name: 'Santana Beach Resort',
                rating: 4.6,
                location: 'Candolim Coast',
                nightlyPrice: 4800,
                totalPrice: 9600,
                nights: 2,
                image:
                  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60',
                highlights: [
                  'Beachfront view',
                  'Swimming pool',
                  'High review score',
                ],
                whyAI:
                  'Slightly higher luxury tier with direct beach access matching your relaxation preference.',
              },
              {
                id: 'h3',
                name: 'The Heritage Boutique Stays',
                rating: 4.8,
                location: 'Fontainhas, Panjim',
                nightlyPrice: 3900,
                totalPrice: 7800,
                nights: 2,
                image:
                  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60',
                highlights: [
                  'Colonial architecture',
                  'Boutique vibe',
                  'City central',
                ],
                whyAI:
                  'Ideal for photography lovers staying in the heart of Old Goan Latin Quarter.',
              },
            ].map((hotel) => (
              <div
                key={hotel.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-[#6C63FF]/40 transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-[#FBBF24] flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-lg font-bold font-syne text-white">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-gray-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#38BDF8]" />
                      <span>{hotel.location}</span>
                    </p>

                    <div className="mt-3 space-y-1">
                      {hotel.highlights.map((h, i) => (
                        <p key={i} className="text-xs text-gray-300 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                          <span>{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="bg-white/5 p-2.5 rounded-lg text-xs text-gray-300">
                      <span className="font-semibold text-[#38BDF8]">Why AI recommended this:</span>{' '}
                      {hotel.whyAI}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold font-mono text-white">
                          ₹{hotel.nightlyPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400"> / night</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const url = hotel.booking_url || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.location)}&aid=123456`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          className="px-3 py-2 rounded-xl bg-[#003580] hover:bg-[#00224f] text-white text-xs font-bold font-syne transition-all shadow-md cursor-pointer border border-blue-400/30"
                        >
                          Booking.com ↗
                        </button>
                        <button
                          onClick={() => onSelectHotel(hotel)}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white text-xs font-bold font-syne hover:scale-105 transition-all shadow-md shadow-[#6C63FF]/20 cursor-pointer"
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WEATHER & BUDGET PANELS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WEATHER PANEL */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-syne font-bold text-lg text-white flex items-center space-x-2">
                <Sun className="w-5 h-5 text-[#FBBF24]" />
                <span>Trip Weather Forecast — Goa</span>
              </h3>
              <span className="text-xs font-mono text-gray-400">Oct 12 - 16</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { day: 'Mon 12', icon: Sun, temp: '29°C', desc: 'Clear' },
                { day: 'Tue 13', icon: Cloud, temp: '28°C', desc: 'Partly cloudy' },
                { day: 'Wed 14', icon: CloudRain, temp: '26°C', desc: 'Afternoon rain', alert: true },
                { day: 'Thu 15', icon: Sun, temp: '30°C', desc: 'Clear' },
                { day: 'Fri 16', icon: Sun, temp: '31°C', desc: 'Sunny' },
              ].map((w, idx) => {
                const IconComponent = w.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col items-center space-y-1.5 ${
                      w.alert
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border-white/5 text-gray-300'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-semibold">
                      {w.day}
                    </span>
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-bold font-mono">{w.temp}</span>
                    <span className="text-[9px] truncate max-w-full">{w.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* AI Weather Alert Banner */}
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Rain expected Wednesday afternoon.</p>
                <p className="mt-0.5 text-amber-300">
                  AI has automatically swapped outdoor beach visits to Thursday morning and scheduled indoor Goan cooking class alternatives for Wednesday PM.
                </p>
              </div>
            </div>
          </div>

          {/* BUDGET & HEALTH SCORE PANEL */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-syne font-bold text-lg text-white">
                Trip Budget & Health Score
              </h3>
              <span className="text-lg font-bold font-mono text-[#38BDF8]">
                ₹{budgetTotal.toLocaleString('en-IN')} Total
              </span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 text-xs">
              {[
                { label: 'Transport', cost: 5200, pct: '24%' },
                { label: 'Hotel (2 Nights)', cost: 8400, pct: '39%' },
                { label: 'Food & Dining', cost: 4000, pct: '18%' },
                { label: 'Activities & Tickets', cost: 2800, pct: '13%' },
                { label: 'Buffer / Contingency', cost: 1000, pct: '6%' },
              ].map((b, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-gray-300">
                    <span>{b.label}</span>
                    <span className="font-mono">₹{b.cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] h-full"
                      style={{ width: b.pct }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <div>
                <span className="text-gray-400">Planned: </span>
                <span className="font-mono font-bold text-white">₹21,400</span>
              </div>
              <div>
                <span className="text-gray-400">Remaining Buffer: </span>
                <span className="font-mono font-bold text-[#34D399]">₹8,600</span>
              </div>
            </div>

            {/* Health Score */}
            <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  AI TRIP HEALTH SCORE
                </p>
                <div className="text-2xl font-syne font-extrabold text-[#34D399]">
                  91 <span className="text-sm font-normal text-gray-500">/ 100</span>
                </div>
              </div>
              <div className="text-right text-[10px] space-y-0.5 text-gray-400">
                <p>Budget fit: <span className="text-[#34D399]">100%</span></p>
                <p>Route efficiency: <span className="text-[#34D399]">96%</span></p>
                <p>Experience match: <span className="text-[#34D399]">92%</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHY THIS MODAL */}
      {selectedReason && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-[#6C63FF]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-syne font-bold text-lg text-white">
                {selectedReason.title}
              </h3>
              <button
                onClick={() => setSelectedReason(null)}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-gray-400">
              {selectedReason.location} · ⭐ {selectedReason.rating} rating
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
              <p className="font-bold text-[#38BDF8]">Why AI Selected This:</p>
              <p className="text-gray-200 leading-relaxed">
                {selectedReason.reason}
              </p>
            </div>
            <button
              onClick={() => setSelectedReason(null)}
              className="w-full py-2.5 rounded-xl bg-[#6C63FF] text-white text-xs font-bold font-syne hover:bg-[#6C63FF]/80 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ADD ACTIVITY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddActivity}
            className="glass-card max-w-md w-full p-6 rounded-2xl border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-syne font-bold text-lg text-white">
                Add Activity to Day {activeDay}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Activity Title
              </label>
              <input
                type="text"
                placeholder="e.g. Sunset Boat Cruise or Cafe Hopping"
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                className="w-full bg-[#111827] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-[#38BDF8] text-black text-xs font-bold font-syne hover:bg-[#38BDF8]/90"
              >
                Add Activity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
