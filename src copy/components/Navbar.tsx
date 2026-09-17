import React, { useState } from 'react';
import { Phone, Mail, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavClick: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ['About', 'Destinations', 'Experiences', 'Global'];

  return (
    <header className="w-full z-40 px-6 sm:px-10 md:px-16 lg:px-20 py-6 md:py-8 flex items-center justify-between" id="site-header">
      {/* Left Navigation Links */}
      <nav className="hidden md:flex items-center gap-7 lg:gap-10" aria-label="Main Navigation">
        {navLinks.map((item) => (
          <button
            key={item}
            onClick={() => onNavClick(item)}
            className="text-white text-xs lg:text-sm font-normal tracking-wider hover:text-neutral-300 transition-colors cursor-pointer py-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Mobile Menu Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Right Contact Info */}
      <div className="flex items-center gap-5 sm:gap-8 lg:gap-10 text-white text-xs lg:text-sm font-normal tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <a 
          href="tel:+971544325050" 
          className="hover:text-neutral-300 transition-colors whitespace-nowrap"
          id="contact-phone"
        >
          +971 54 432 5050
        </a>
        <a 
          href="mailto:info@tripzy.com" 
          className="hover:text-neutral-300 transition-colors whitespace-nowrap font-medium"
          id="contact-email"
        >
          info@tripzy.com
        </a>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-black/95 border-b border-white/10 p-6 flex flex-col gap-4 z-50 md:hidden backdrop-blur-xl">
          {navLinks.map((item) => (
            <button
              key={item}
              onClick={() => {
                onNavClick(item);
                setMobileMenuOpen(false);
              }}
              className="text-white text-left text-base font-normal tracking-wider py-2 border-b border-white/5"
            >
              {item}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2 text-sm text-neutral-300">
            <a href="tel:+971544325050" className="py-1">+971 54 432 5050</a>
            <a href="mailto:info@tripzy.com" className="py-1">info@tripzy.com</a>
          </div>
        </div>
      )}
    </header>
  );
};
