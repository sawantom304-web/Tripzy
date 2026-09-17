import React, { useState, useEffect } from 'react';
import HeroScrollCanvas from '../components/HeroScrollCanvas';
import { AircraftWindow } from '../components/AircraftWindow';
import { BookingModal } from '../components/BookingModal';
import { InfoDrawer } from '../components/InfoDrawer';
import { JourneySection } from '../components/JourneySection';
import {
  ChevronDown,
  Rocket,
  Compass
} from 'lucide-react';

export default function LandingView({ onStartPlanning }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedNavSection, setSelectedNavSection] = useState(null);

  // Search Widget State
  const [fromLocation, setFromLocation] = useState('Mumbai (BOM)');
  const [toLocation, setToLocation] = useState('Goa, India');

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const currentScroll = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToJourney = () => {
    const el = document.getElementById('journey-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartBookingFlow = () => {
    onStartPlanning();
  };

  const handleBookingSubmit = () => {
    setBookingOpen(false);
    onStartPlanning();
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-[#00F5D4] selection:text-black overflow-x-hidden">
      
      {/* 300-FRAME SCROLLING CANVAS FIXED BACKGROUND */}
      <HeroScrollCanvas scrollProgress={scrollProgress} />

      {/* MAIN CONTAINER LAYER */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col min-h-screen">
        
        {/* HERO SECTION CONTAINER */}
        <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 lg:px-12">
          
          {/* TOP CONCIERGE ACTION BAR */}
          <div className="w-full flex justify-end items-center max-w-[1600px] mx-auto pt-2">
            <button
              onClick={() => setSelectedNavSection('About')}
              className="text-xs font-syne font-bold text-gray-200 hover:text-[#00F5D4] transition-colors flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-xl cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#00F5D4]" />
              <span>Discover Concierge</span>
            </button>
          </div>

          {/* DESKTOP 3-COLUMN HERO LAYOUT */}
          <div className="hidden lg:grid lg:grid-cols-12 items-center max-w-[1600px] mx-auto w-full my-auto py-8">
            
            {/* LEFT COLUMN: "WE ARE MOVEMENT" & "YOUR FREEDOM TO ENJOY LIFE" */}
            <div className="lg:col-span-4 flex flex-col justify-between h-[520px] xl:h-[560px] pr-6 z-20">
              {/* Upper Left Headline */}
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#00F5D4] uppercase block mb-2">
                  TRIPZY PRESENTS
                </span>
                <h1 className="text-5xl xl:text-[4.5rem] 2xl:text-[4.75rem] font-bold text-white tracking-tight leading-[0.98] select-none font-syne drop-shadow-lg">
                  We are<br />movement
                </h1>
              </div>

              {/* Lower Left Feature Block */}
              <div className="max-w-[300px] xl:max-w-[340px] p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                <h2 className="text-xl xl:text-2xl font-bold text-white leading-snug tracking-tight select-none font-syne">
                  Your<br />freedom to<br />enjoy life
                </h2>
                
                {/* Fine White Divider Line */}
                <div className="w-12 h-[1px] bg-[#00F5D4] my-3" />
                
                {/* Description Paragraph */}
                <p className="text-gray-300 text-xs xl:text-[13px] leading-relaxed font-normal">
                  Every journey is designed around your comfort, curiosity, and dreams — so you can immerse yourself in what truly matters.
                </p>
              </div>
            </div>

            {/* CENTER COLUMN: AIRCRAFT WINDOW WITH ATTACHED "START TRAVEL JOURNEY" BUTTON */}
            <div className="lg:col-span-4 flex justify-center items-center z-20">
              <AircraftWindow onBookClick={handleStartBookingFlow} />
            </div>

            {/* RIGHT COLUMN: "WE ARE DISTINCTION" & QUICK SEARCH / SCROLL DOWN */}
            <div className="lg:col-span-4 flex flex-col justify-between h-[520px] xl:h-[560px] pl-6 xl:pl-10 z-20">
              
              {/* Upper Right Headline */}
              <div className="text-right">
                <span className="text-xs font-mono font-bold tracking-widest text-[#38BDF8] uppercase block mb-2">
                  EXPLORE THE UNSEEN
                </span>
                <h2 className="text-5xl xl:text-[4.5rem] 2xl:text-[4.75rem] font-bold text-white tracking-tight leading-[0.98] select-none font-syne drop-shadow-lg">
                  We are<br />distinction
                </h2>
              </div>

              {/* Middle Right Quick Flight / Hotel Search Widget */}
              <div className="p-5 rounded-2xl border border-white/15 bg-black/50 backdrop-blur-md shadow-2xl max-w-sm ml-auto space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-syne font-bold text-white">✈️ Quick AI Flight & Stay</span>
                  <span className="text-[10px] text-[#00F5D4] font-mono uppercase font-semibold">Live Availability</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] text-gray-400 font-mono block uppercase">FROM</span>
                    <input
                      type="text"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="bg-transparent font-semibold text-white focus:outline-none w-full text-xs mt-0.5"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[9px] text-gray-400 font-mono block uppercase">TO</span>
                    <input
                      type="text"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="bg-transparent font-semibold text-white focus:outline-none w-full text-xs mt-0.5"
                    />
                  </div>
                </div>

                <button
                  onClick={handleStartBookingFlow}
                  className="w-full py-3 rounded-xl bg-[#00F5D4] text-black font-syne font-extrabold text-xs shadow-lg hover:bg-[#00F5D4]/90 transition-all flex items-center justify-center space-x-1.5 cursor-pointer glow-teal"
                >
                  <Rocket className="w-4 h-4 fill-black text-black" />
                  <span>Search & Book Trip</span>
                </button>
              </div>

              {/* Bottom Right Scroll Down Button Indicator */}
              <div className="w-full">
                <button 
                  onClick={scrollToJourney}
                  className="group flex items-center gap-3 w-full text-left cursor-pointer hover:opacity-85 transition-opacity bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10"
                  aria-label="Scroll down to start the journey"
                >
                  <div className="flex items-center gap-1.5 text-white text-[11px] xl:text-xs tracking-[0.2em] font-medium whitespace-nowrap uppercase">
                    <ChevronDown className="w-4 h-4 text-[#00F5D4] group-hover:translate-y-0.5 transition-transform" />
                    <span>SCROLL DOWN</span>
                  </div>
                  
                  {/* Connecting Thin Horizontal Line */}
                  <div className="flex-1 h-[1px] bg-white/40 group-hover:bg-[#00F5D4] transition-colors" />
                  
                  <div className="text-white text-[11px] xl:text-xs tracking-[0.2em] font-medium whitespace-nowrap uppercase">
                    <span>TO START THE JOURNEY</span>
                  </div>
                </button>
              </div>

            </div>
          </div>

          {/* RESPONSIVE MOBILE / TABLET LAYOUT */}
          <div className="lg:hidden flex flex-col items-center gap-6 py-6 max-w-lg mx-auto w-full">
            <div className="w-full text-left">
              <h1 className="text-4xl font-bold text-white tracking-tight leading-tight font-syne">
                We are<br />movement
              </h1>
            </div>

            <div className="w-full flex justify-center my-2">
              <AircraftWindow onBookClick={handleStartBookingFlow} />
            </div>

            <div className="w-full text-right">
              <h2 className="text-4xl font-bold text-white tracking-tight leading-tight font-syne">
                We are<br />distinction
              </h2>
            </div>

            <div className="w-full text-left p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
              <h3 className="text-lg font-bold text-white leading-snug font-syne">
                Your freedom to enjoy life
              </h3>
              <div className="w-12 h-[1px] bg-[#00F5D4] my-2" />
              <p className="text-gray-300 text-xs leading-relaxed">
                Every journey is designed around your comfort, curiosity, and dreams — so you can immerse yourself in what truly matters.
              </p>
            </div>

            <div className="w-full pt-2">
              <button
                onClick={scrollToJourney}
                className="flex items-center justify-between gap-3 w-full text-left cursor-pointer bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-1.5 text-white text-xs tracking-[0.16em] uppercase font-medium">
                  <ChevronDown className="w-4 h-4 text-[#00F5D4]" />
                  <span>SCROLL DOWN</span>
                </div>
                <div className="flex-1 h-[1px] bg-white/40" />
                <div className="text-white text-xs tracking-[0.16em] uppercase font-medium">
                  <span>TO START THE JOURNEY</span>
                </div>
              </button>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="max-w-[1600px] mx-auto w-full py-6 flex items-center justify-between text-xs font-mono text-gray-300">
            <div><strong className="text-white font-syne text-sm">36+</strong> Indian States</div>
            <div><strong className="text-white font-syne text-sm">10K+</strong> Happy Travelers</div>
            <div><strong className="text-white font-syne text-sm">100%</strong> Personalization</div>
            <div className="hidden sm:flex items-center space-x-1 text-[#FBBF24]">
              <strong className="text-white font-syne text-sm">4.9</strong>
              <span>⭐ Average Rating</span>
            </div>
          </div>

        </section>

        {/* SECTIONS BELOW HERO (FULLY TRANSPARENT OVER SCROLLING CANVAS) */}
        <div className="relative z-20 w-full pt-8">
          
          {/* JOURNEY SECTION: PHILOSOPHY, WHERE DO YOU WANT TO GO?, INDIAN ESCAPES & CREED */}
          <JourneySection onStartJourney={handleStartBookingFlow} />

          {/* HOW IT WORKS SECTION */}
          <section id="how-it-works" className="py-24 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12">
            <div className="p-4 sm:p-6 text-center">
              <div className="mb-16 space-y-3">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#00F5D4]">
                  01 — SIMPLE 3 STEP PROCESS
                </span>
                <h3 className="text-3xl md:text-5xl font-syne font-bold text-white">
                  How Tripzy Works
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Tell us your preferences',
                    desc: 'Destination, budget, dates, travel group & activity interests. Takes under 2 minutes.',
                    color: 'from-[#6C63FF]/20 to-[#6C63FF]/5',
                    borderColor: 'border-white/10',
                  },
                  {
                    step: '02',
                    title: 'AI builds your full trip',
                    desc: 'Instant personalized route, optimized transport options, vetted hotels & day-by-day itinerary.',
                    color: 'from-[#00F5D4]/20 to-[#00F5D4]/5',
                    borderColor: 'border-white/10',
                  },
                  {
                    step: '03',
                    title: 'Travel with live AI support',
                    desc: 'Real-time turn-by-turn navigation, instant weather rerouting & live budget adjustments on the road.',
                    color: 'from-[#34D399]/20 to-[#34D399]/5',
                    borderColor: 'border-white/10',
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="p-8 rounded-2xl bg-black/40 backdrop-blur-md hover:scale-[1.02] transition-all group text-left"
                  >
                    <span className="text-4xl font-syne font-extrabold text-white/30 group-hover:text-[#00F5D4] transition-colors">
                      {card.step}
                    </span>
                    <h4 className="text-xl font-bold font-syne mt-4 mb-2 text-white">
                      {card.title}
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FINAL HERO CTA BANNER (UNBLOCKED) */}
          <section className="py-16 text-center px-6 sm:px-10 lg:px-12 max-w-[1600px] mx-auto mb-16">
            <div className="py-10">
              <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-white">
                  Ready to travel smarter?
                </h2>
                <p className="text-gray-300 text-base max-w-xl mx-auto">
                  Step through the aircraft window and let Tripzy craft your next dream travel journey.
                </p>
                <div>
                  <button
                    onClick={handleStartBookingFlow}
                    className="px-10 py-5 rounded-full bg-[#00F5D4] text-black font-syne font-extrabold text-xl shadow-2xl shadow-[#00F5D4]/40 hover:bg-[#00F5D4]/90 hover:scale-105 transition-all inline-flex items-center space-x-3 glow-teal cursor-pointer"
                  >
                    <Rocket className="w-6 h-6 fill-black text-black" />
                    <span>🚀 Start My Travel Journey</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* INTERACTIVE TRAVEL JOURNEY PLANNER MODAL */}
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
        onComplete={handleBookingSubmit}
      />

      {/* NAV SECTION DETAILS OVERLAY DRAWER */}
      <InfoDrawer 
        section={selectedNavSection} 
        onClose={() => setSelectedNavSection(null)} 
        onBookClick={handleStartBookingFlow}
      />
    </div>
  );
}
