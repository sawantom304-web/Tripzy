import React, { useState, useEffect } from 'react';
import {
  Home,
  Globe,
  Sparkles,
  Luggage,
  Heart,
  Settings,
  Radio,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'builder', label: 'AI Planner', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: Globe },
    { id: 'my-trips', label: 'My Trips', icon: Luggage },
    { id: 'live-trip', label: 'Live Mode', icon: Radio, highlight: true },
  ];

  const secondaryItems = [
    { id: 'saved', label: 'Saved Trips', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0A0E1A]/95 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/60'
          : 'bg-[#0A0E1A]/90 backdrop-blur-md border-white/5'
      }`}
    >


      {/* Main Navbar Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-5 flex items-center justify-between">
        {/* BRAND LOGO — ENLARGED WITH CUSTOM EMBLEM */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center space-x-3 text-left group cursor-pointer shrink-0"
        >
          <img
            src="/tripzy-logo.png"
            alt="Tripzy Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter invert brightness-200 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="font-syne font-extrabold text-3xl sm:text-4xl text-white tracking-wider group-hover:text-[#38BDF8] transition-colors">
            TRIPZY
          </span>
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#6C63FF]/30 text-[#38BDF8] border border-[#6C63FF]/40 shadow-md">
            OS
          </span>
        </button>

        {/* DESKTOP NAVIGATION CENTER LINKS — ENLARGED */}
        <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative px-5 py-2.5 rounded-xl text-sm xl:text-base font-bold flex items-center space-x-2.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white shadow-xl shadow-[#6C63FF]/35 scale-[1.02]'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active
                      ? 'text-white'
                      : item.highlight
                      ? 'text-red-400 animate-pulse'
                      : 'text-gray-400'
                  }`}
                />
                <span>{item.label}</span>

                {item.highlight && !active && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT ACTION BUTTONS & USER PROFILE — ENLARGED */}
        <div className="hidden md:flex items-center space-x-4 shrink-0">
          {/* Secondary Actions: Saved & Settings */}
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  active
                    ? 'bg-white/15 border-white/25 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}

          <div className="h-8 w-px bg-white/15 mx-1" />

          {/* User Profile Pill — Larger */}
          <div className="flex items-center space-x-3.5 pl-1.5 pr-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all cursor-pointer shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center font-extrabold text-sm text-white shadow-md">
              PM
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white leading-tight">Priya Sharma</p>
              <p className="text-xs text-gray-400 leading-tight">Pro Traveler</p>
            </div>
          </div>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-200 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 border-t border-white/10 bg-[#0A0E1A]/95 backdrop-blur-2xl px-6 py-6 space-y-3 animate-slide-down">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-white">
                PM
              </div>
              <span className="text-sm font-semibold text-white">Priya Sharma</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
