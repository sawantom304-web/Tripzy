import React, { useState } from 'react';
import { ChevronDown, ArrowDown } from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { AircraftWindow } from './components/AircraftWindow.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { InfoDrawer } from './components/InfoDrawer.tsx';
import { JourneySection } from './components/JourneySection.tsx';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedNavSection, setSelectedNavSection] = useState<string | null>(null);

  const scrollToJourney = () => {
    const el = document.getElementById('journey-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative flex flex-col justify-between overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top Header / Navigation Bar */}
      <Navbar onNavClick={(section) => setSelectedNavSection(section)} />

      {/* Main Hero Banner Container */}
      <main className="relative flex-1 w-full max-w-[1920px] mx-auto flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-4 lg:py-0 min-h-[calc(100vh-100px)]">
        
        {/* Desktop 3-Column Precise Hero Layout (Matches Reference Image) */}
        <div className="hidden lg:grid lg:grid-cols-12 items-center w-full h-full relative z-10 py-6">
          
          {/* Left Column: "We are movement" (Upper) & "Your freedom to enjoy life" (Lower) */}
          <div className="lg:col-span-4 flex flex-col justify-between h-[560px] xl:h-[620px] pr-4 z-20">
            {/* Top-Mid Left Headline */}
            <div className="pt-2 xl:pt-4">
              <h1 className="text-5xl xl:text-[4.75rem] 2xl:text-[5.25rem] font-bold text-white tracking-tight leading-[0.98] select-none">
                We are<br />movement
              </h1>
            </div>

            {/* Bottom-Left Feature Block */}
            <div className="max-w-[280px] xl:max-w-[320px] pb-2">
              <h2 className="text-xl xl:text-2xl font-bold text-white leading-snug tracking-tight select-none">
                Your<br />freedom to<br />enjoy life
              </h2>
              
              {/* Fine White Divider Line */}
              <div className="w-12 h-[1px] bg-white/70 my-3.5" />
              
              {/* Description Paragraph */}
              <p className="text-white text-xs xl:text-[13px] leading-relaxed font-normal opacity-90">
                Every journey is designed around your comfort, curiosity, and dreams — so you can immerse yourself in what truly matters, while we take care of everything else.
              </p>
            </div>
          </div>

          {/* Center Column: Airplane Window with Attached "Book the Flight" Pill */}
          <div className="lg:col-span-4 flex justify-center items-center z-10">
            <AircraftWindow onBookClick={() => setBookingOpen(true)} />
          </div>

          {/* Right Column: "We are distinction" (Lower-Mid) & "SCROLL DOWN ... TO START THE JOURNEY" (Bottom) */}
          <div className="lg:col-span-4 flex flex-col justify-end h-[560px] xl:h-[620px] pl-6 xl:pl-10 z-20">
            {/* Lower-Mid Right Headline */}
            <div className="mb-14 xl:mb-18">
              <h2 className="text-5xl xl:text-[4.75rem] 2xl:text-[5.25rem] font-bold text-white tracking-tight leading-[0.98] select-none">
                We are<br />distinction
              </h2>
            </div>

            {/* Bottom-Right Footer Indicator */}
            <div className="w-full pb-2">
              <button 
                onClick={scrollToJourney}
                className="group flex items-center gap-3 w-full text-left cursor-pointer hover:opacity-85 transition-opacity"
                aria-label="Scroll down to start the journey"
              >
                <div className="flex items-center gap-1.5 text-white text-[11px] xl:text-xs tracking-[0.2em] font-medium whitespace-nowrap uppercase">
                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  <span>SCROLL DOWN</span>
                </div>
                
                {/* Connecting Thin Horizontal Line */}
                <div className="flex-1 h-[1px] bg-white/60 group-hover:bg-white transition-colors" />
                
                <div className="text-white text-[11px] xl:text-xs tracking-[0.2em] font-medium whitespace-nowrap uppercase">
                  <span>TO START THE JOURNEY</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Layout (Clean vertical flow without clipping) */}
        <div className="lg:hidden flex flex-col items-center gap-10 py-6">
          {/* Top Headline on Mobile */}
          <div className="w-full text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              We are<br />movement
            </h1>
          </div>

          {/* Center Airplane Window */}
          <div className="w-full flex justify-center my-2">
            <AircraftWindow onBookClick={() => setBookingOpen(true)} />
          </div>

          {/* Distinction Headline on Mobile */}
          <div className="w-full text-left sm:text-right">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              We are<br />distinction
            </h2>
          </div>

          {/* Freedom to enjoy life section on Mobile */}
          <div className="w-full max-w-md self-start text-left mt-2">
            <h3 className="text-xl font-bold text-white leading-snug">
              Your freedom to enjoy life
            </h3>
            <div className="w-12 h-[1px] bg-white/70 my-3" />
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              Every journey is designed around your comfort, curiosity, and dreams — so you can immerse yourself in what truly matters, while we take care of everything else.
            </p>
          </div>

          {/* Scroll down footer indicator on Mobile */}
          <div className="w-full pt-4">
            <button
              onClick={scrollToJourney}
              className="flex items-center justify-between gap-3 w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-white text-xs tracking-[0.16em] uppercase font-medium">
                <ChevronDown className="w-3.5 h-3.5" />
                <span>SCROLL DOWN</span>
              </div>
              <div className="flex-1 h-[1px] bg-white/50" />
              <div className="text-white text-xs tracking-[0.16em] uppercase font-medium">
                <span>TO START THE JOURNEY</span>
              </div>
            </button>
          </div>
        </div>

      </main>

      {/* Interactive Travel Journey Planner Modal */}
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
      />

      {/* Nav Section Details Overlay */}
      <InfoDrawer 
        section={selectedNavSection} 
        onClose={() => setSelectedNavSection(null)} 
        onBookClick={() => setBookingOpen(true)}
      />

      {/* Secondary Details Section (Revealed when scrolling down) */}
      <JourneySection onStartJourney={() => setBookingOpen(true)} />
    </div>
  );
}
