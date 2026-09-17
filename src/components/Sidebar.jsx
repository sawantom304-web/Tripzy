import React, { useState } from 'react';
import {
  Home,
  Globe,
  Sparkles,
  Luggage,
  Heart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'builder', label: 'AI Planner', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: Globe },
    { id: 'my-trips', label: 'My Trips', icon: Luggage },
    { id: 'live-trip', label: 'Live Mode', icon: Radio, highlight: true },
  ];

  const secondaryNavItems = [
    { id: 'saved', label: 'Saved Trips', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-[#111827]/95 border-r border-white/10 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <span className="font-syne font-extrabold text-xl text-white tracking-wider">
                TRIPZY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#6C63FF]/30 text-[#38BDF8] border border-[#6C63FF]/30">
                OS
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#38BDF8]/20 border border-[#6C63FF]/40 text-white font-medium shadow-md shadow-[#6C63FF]/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active
                      ? 'text-[#38BDF8]'
                      : item.highlight
                      ? 'text-red-400 animate-pulse'
                      : 'text-gray-400'
                  }`}
                />
                {!collapsed && (
                  <span className="text-sm truncate font-medium flex-1 text-left">
                    {item.label}
                  </span>
                )}
                {!collapsed && item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>
            );
          })}

          <div className="pt-6 pb-2 px-3">
            <div className="h-px bg-white/10 w-full" />
          </div>

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0 text-gray-400" />
                {!collapsed && (
                  <span className="text-sm truncate font-medium flex-1 text-left">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-white">
              PM
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  Priya Sharma
                </p>
                <p className="text-[10px] text-gray-400 truncate">Pro Traveler</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 border-t border-white/10 backdrop-blur-xl px-4 py-2 flex items-center justify-around">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                active ? 'text-[#38BDF8]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
