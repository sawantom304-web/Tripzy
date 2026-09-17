import React, { useState } from 'react';
import TripMap from '../components/TripMap';
import {
  Radio,
  Navigation,
  Sun,
  AlertTriangle,
  Check,
  RefreshCw,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function LiveTripView({ onExitLive }) {
  const [showDisruptionAlert, setShowDisruptionAlert] = useState(true);
  const [replaced, setReplaced] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [budgetRemaining, setBudgetRemaining] = useState(8600);

  const [todaysActivities, setTodaysActivities] = useState([
    {
      id: 1,
      title: 'Fort Aguada & Lighthouse',
      time: '08:30 AM – 11:00 AM',
      icon: '',
      location: 'Sinquerim cliff',
      status: 'active',
      travelTime: '12 min away · Light traffic',
      lat: 15.4925,
      lng: 73.7737,
      day: 2,
    },
    {
      id: 2,
      title: 'Goan Thali Lunch at Kokni Kanteen',
      time: '12:30 PM – 02:00 PM',
      icon: '',
      location: 'Panjim Old Town',
      status: 'upcoming',
      travelTime: '20 min away',
      lat: 15.4989,
      lng: 73.8278,
      day: 2,
    },
    {
      id: 3,
      title: 'Baga Beach Sunset & Watersports',
      time: '04:00 PM – 07:00 PM',
      icon: '',
      location: 'Baga Coast',
      status: 'disrupted',
      travelTime: '15 min away',
      lat: 15.555,
      lng: 73.751,
      day: 2,
    },
  ]);

  const handleReplaceActivity = () => {
    // Replace Baga Beach with Goan Cooking Experience
    setTodaysActivities((prev) =>
      prev.map((act) =>
        act.id === 3
          ? {
              id: 3,
              title: "Local Goan Cooking Experience at Martin's Kitchen",
              time: '04:00 PM – 06:30 PM',
              icon: '',
              location: 'Panjim (Indoor)',
              status: 'replaced',
              travelTime: '11 min away',
              lat: 15.494,
              lng: 73.825,
              day: 2,
            }
          : act
      )
    );
    setReplaced(true);
    setShowDisruptionAlert(false);
    setBudgetRemaining(7700);
    setToastMessage('Itinerary updated. Budget: ₹7,700 remaining.');

    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const nextActivity = todaysActivities.find(
    (a) => a.status === 'active' || a.status === 'upcoming' || a.status === 'replaced'
  );

  return (
    <div className="relative min-h-screen bg-[#0A0E1A] text-white flex flex-col overflow-hidden">
      {/* PAGE 9 — LIVE TOP BAR */}
      <div className="bg-red-950/90 border-b border-red-500/30 py-3 px-6 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h1 className="font-syne font-extrabold text-sm md:text-base text-white tracking-widest uppercase">
            LIVE · DAY 2 · GOA · OCT 13
          </h1>
        </div>

        <button
          onClick={onExitLive}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          Exit Live Mode
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#34D399] text-black px-6 py-3 rounded-full font-syne font-bold text-sm shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* PAGE 10 — AI LIVE REPLANNING DISRUPTION BANNER */}
      {showDisruptionAlert && !replaced && (
        <div className="z-30 bg-amber-500/95 text-black p-4 md:p-6 backdrop-blur-lg shadow-2xl border-b border-amber-400 space-y-4 animate-slide-down">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-syne font-extrabold text-base tracking-wider uppercase">
                <AlertTriangle className="w-6 h-6 text-black fill-amber-300" />
                <span>YOUR PLAN NEEDS AN UPDATE</span>
              </div>
              <span className="text-xs font-mono bg-black/20 px-2.5 py-0.5 rounded-full font-bold">
                Live AI Alert
              </span>
            </div>

            <p className="text-xs md:text-sm font-medium">
              Heavy rain expected at 4:00 PM today in North Goa. Baga Beach watersports may not be ideal.
            </p>

            <div className="p-3.5 rounded-xl bg-black/10 border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  AI Recommended Alternative:
                </span>
                <p className="font-syne font-bold text-sm mt-0.5">
                  Local Goan Cooking Experience at Martin's Kitchen
                </p>
                <p className="text-black/80">
                  Panjim — 11 min away · ₹900 per person · Rating 4.8 · Available now
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleReplaceActivity}
                  className="px-4 py-2 rounded-lg bg-black text-white font-syne font-bold hover:bg-gray-900 transition-all flex items-center space-x-1.5 shadow-lg"
                >
                  <Check className="w-4 h-4 text-[#34D399]" />
                  <span>Replace Activity</span>
                </button>
                <button
                  onClick={() => setShowDisruptionAlert(false)}
                  className="px-3 py-2 rounded-lg bg-black/10 hover:bg-black/20 text-black font-semibold"
                >
                  Keep Current
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN AREA: FULL MAP WITH LIVE LOCATION MARKER */}
      <div className="flex-1 relative w-full" style={{ height: 'calc(100vh - 120px)', minHeight: '500px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <TripMap
            activeDay={2}
            activities={todaysActivities}
            onSelectPin={(act) => {
              // When user clicks a pin, fly to that location
              console.log('Selected activity:', act.title);
            }}
            location="goa"
          />
        </div>

        {/* LIVE LOCATION PIN OVERLAY */}
        <div className="absolute top-4 left-4 z-20 px-4 py-2 rounded-xl bg-[#111827]/90 border border-white/10 backdrop-blur-md text-xs flex items-center space-x-2 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping"></span>
          <span className="text-white font-bold">YOU ARE HERE: Sinquerim, Goa</span>
        </div>

        {/* QUICK STATS STRIP */}
        <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-[#111827]/90 border border-white/10 backdrop-blur-md text-xs font-mono text-gray-300 flex items-center space-x-4">
          <span>30°C</span>
          <span>•</span>
          <span>Budget left: <strong className="text-[#34D399]">₹{budgetRemaining.toLocaleString('en-IN')}</strong></span>
          <span>•</span>
          <span>Day 2 of 6</span>
        </div>

        {/* NEXT ACTIVITY DRAWER SLIDES UP FROM BOTTOM */}
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-2xl mx-auto">
          {nextActivity && (
            <div className="glass-card p-5 rounded-2xl border border-white/15 shadow-2xl bg-[#111827]/95 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#38BDF8] font-bold uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NEXT ACTIVITY</span>
                </span>
                <span className="text-gray-400">{nextActivity.travelTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center text-2xl">
                    {nextActivity.icon}
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-base text-white">
                      {nextActivity.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {nextActivity.time} · {nextActivity.location}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Starting turn-by-turn navigation to ${nextActivity.title}`)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white font-syne font-bold text-xs shadow-lg shadow-[#6C63FF]/30 hover:scale-105 transition-all flex items-center space-x-1.5"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Navigate</span>
                </button>
              </div>

              {/* TODAY'S HORIZONTAL TIMELINE STRIP */}
              <div className="pt-2 border-t border-white/10 flex items-center space-x-2 overflow-x-auto no-scrollbar">
                {todaysActivities.map((act) => (
                  <div
                    key={act.id}
                    className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap flex items-center space-x-1.5 ${
                      act.status === 'active' || act.status === 'replaced'
                        ? 'bg-[#6C63FF]/30 border border-[#6C63FF] text-white font-semibold'
                        : 'bg-white/5 border border-white/5 text-gray-400'
                    }`}
                  >
                    <span>{act.icon}</span>
                    <span>{act.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
