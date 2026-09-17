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
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 py-2.5 flex items-center justify-between">
        {/* BRAND LOGO */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center space-x-2 text-left group cursor-pointer shrink-0"
        >
          <img
            src="/tripzy-logo.png"
            alt="Tripzy Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter invert brightness-200 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-syne font-extrabold text-lg sm:text-xl text-white tracking-wider group-hover:text-[#38BDF8] transition-colors">
            TRIPZY
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-[#6C63FF]/30 text-[#38BDF8] border border-[#6C63FF]/40 shadow-sm">
            OS
          </span>
        </button>

        {/* DESKTOP NAVIGATION CENTER LINKS — MEDIUM SIZING */}
        <div className="hidden lg:flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-xl shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white shadow-md shadow-[#6C63FF]/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    active
                      ? 'text-white'
                      : item.highlight
                      ? 'text-red-400 animate-pulse'
                      : 'text-gray-400'
                  }`}
                />
                <span>{item.label}</span>

                {item.highlight && !active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT ACTION BUTTONS & USER PROFILE — MEDIUM SIZING */}
        <div className="hidden md:flex items-center space-x-2.5 shrink-0">
          {/* Secondary Actions: Saved & Settings */}
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  active
                    ? 'bg-white/15 border-white/25 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          <div className="h-5 w-px bg-white/15 mx-0.5" />

          {/* User Profile Pill */}
          <div className="flex items-center space-x-2 pl-1 pr-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all cursor-pointer shadow-sm">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center font-bold text-[11px] text-white shadow-xs">
              PM
            </div>
            <div className="text-left">
              <p className="text-[11px] font-semibold text-white leading-tight">Priya Sharma</p>
              <p className="text-[9px] text-gray-400 leading-tight">Pro Traveler</p>
            </div>
          </div>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0A0E1A]/95 backdrop-blur-2xl px-5 py-4 space-y-2.5 animate-slide-down">
          <div className="space-y-1">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-white">
                PM
              </div>
              <span className="text-xs font-semibold text-white">Priya Sharma</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
