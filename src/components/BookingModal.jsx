import React, { useState } from 'react';
import { X, Compass, Calendar, Users, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function BookingModal({ isOpen, onClose, onStartJourney }) {
  const [destination, setDestination] = useState('Rajasthan (Jaipur & Udaipur)');
  const [departureDate, setDepartureDate] = useState('2026-10-10');
  const [duration, setDuration] = useState('10 Days');
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Royal Heritage & Palaces');
  const [notes, setNotes] = useState('Looking for haveli suites, lake palace dinners, private desert dunes camp, and local bazaars.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      if (onStartJourney) onStartJourney();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="travel-modal-overlay">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close travel modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center text-center">
            <CheckCircle className="w-16 h-16 text-[#00F5D4] mb-4 animate-pulse" />
            <h3 className="text-2xl font-syne font-bold mb-2">Your Journey Has Begun</h3>
            <p className="text-neutral-400 max-w-sm text-sm">
              Our Tripzy travel curator is preparing your bespoke escape to {destination}. Redirecting to your AI itinerary...
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-3.5 h-3.5 text-[#00F5D4]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#00F5D4] font-mono">Tripzy Travel Curator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white mb-2">Start Your Travel Journey</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mb-6">
              Tailored itineraries, immersive experiences, and unhurried wanderlust.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3.5 h-3.5" /> Dream Destination or Region
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Rajasthan, Kerala, Himachal Pradesh, Goa, Kashmir, Meghalaya..."
                  required
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> Target Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5 font-mono">
                    <Users className="w-3.5 h-3.5" /> Travelers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Solo Traveler' : `${num} Travelers`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" /> Travel Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                  >
                    <option value="Royal Heritage & Palaces">Royal Heritage & Palaces</option>
                    <option value="Backwaters & Coastal Living">Backwaters & Coastal Living</option>
                    <option value="High Himalayan Trekking & Retreats">High Himalayan Trekking & Retreats</option>
                    <option value="Wildlife Safari & Rainforests">Wildlife Safari & Rainforests</option>
                    <option value="Ayurvedic Wellness & Spiritual Havens">Ayurvedic Wellness & Spiritual Havens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> Trip Length
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
                  >
                    <option value="Weekend Getaway (3-4 Days)">Weekend Getaway (3-4 Days)</option>
                    <option value="1 Week (7 Days)">1 Week (7 Days)</option>
                    <option value="10 Days">10 Days</option>
                    <option value="2 Weeks (14 Days)">2 Weeks (14 Days)</option>
                    <option value="Month-Long Odyssey (30+ Days)">Month-Long Odyssey (30+ Days)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-mono">
                  Special Travel Desires
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00F5D4] transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#00F5D4] text-black font-syne font-bold py-3.5 rounded-full hover:bg-[#00F5D4]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg glow-teal"
                >
                  <span>🚀 Start Travel Journey</span>
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
