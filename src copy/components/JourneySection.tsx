import React, { useState } from 'react';
import { Compass, Globe, MapPin, Sparkles, Heart, Sun, Mountain, Camera, ArrowRight } from 'lucide-react';

interface JourneySectionProps {
  onStartJourney: () => void;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ onStartJourney }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const travelCategories = ['All', 'Himalayan', 'Backwaters & Coastal', 'Heritage', 'Nature & Wilderness'];

  const destinations = [
    {
      title: 'Rajasthan',
      state: 'Northern India',
      category: 'Heritage',
      tagline: 'Majestic Forts, Royal Haveli Palaces & Golden Thar Dunes',
      highlights: 'Udaipur Lake Pichola boat journeys, Jaipur Amber Fort sunset views, Jaisalmer starlit desert camps',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
      season: 'October – March',
      vibe: 'Regal, Historic, Vibrant'
    },
    {
      title: 'Kerala',
      state: 'Southern India',
      category: 'Backwaters & Coastal',
      tagline: 'God\'s Own Country — Emerald Backwaters & Mist-clad Tea Hills',
      highlights: 'Alleppey private wooden houseboats, Munnar cardamom estates, Marari tranquil shores & Ayurveda',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
      season: 'September – March',
      vibe: 'Tranquil, Verdant, Rejuvenating'
    },
    {
      title: 'Himachal Pradesh',
      state: 'Northern Himalayas',
      category: 'Himalayan',
      tagline: 'Valley of the Gods — Cedar Ridges & High Mountain Passes',
      highlights: 'Spiti Valley ancient monasteries, Manali pine forest trails, Dharamshala Tibetan sanctuaries',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
      season: 'March – June & Winter Snow',
      vibe: 'Alpine, Serene, Adventurous'
    },
    {
      title: 'Goa',
      state: 'Western Coast',
      category: 'Backwaters & Coastal',
      tagline: 'Golden Sands, Portuguese Quarters & Sunkissed Shores',
      highlights: 'Secluded South Goa beaches, colorful Fontainhas heritage walks, private catamaran sunset cruises',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
      season: 'November – April',
      vibe: 'Laid-back, Coastal, Festive'
    },
    {
      title: 'Jammu & Kashmir',
      state: 'Himalayan Crown',
      category: 'Himalayan',
      tagline: 'Paradise on Earth — Floating Shikaras & Snow-capped Glens',
      highlights: 'Dal Lake cedarwood houseboats, Gulmarg world-class gondola slopes, Pahalgam Lidder river valleys',
      image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=900&q=80',
      season: 'April – October & Winter Wonderland',
      vibe: 'Enchanting, Romantic, Majestic'
    },
    {
      title: 'Meghalaya',
      state: 'Northeast India',
      category: 'Nature & Wilderness',
      tagline: 'Abode of Clouds — Living Root Bridges & Crystal Rivers',
      highlights: 'Cherrapunji rainforest waterfalls, Dawki glass-bottom river cruises, Mawlynnong bamboo trails',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80',
      season: 'September – May',
      vibe: 'Mystical, Lush, Untamed'
    },
    {
      title: 'Uttarakhand',
      state: 'Himalayan Foothills',
      category: 'Himalayan',
      tagline: 'Land of Sacred Valleys, Alpine Bugyals & Holy Rivers',
      highlights: 'Rishikesh spiritual Ganges aarti, Valley of Flowers national park trek, Auli snow ridges',
      image: 'https://images.unsplash.com/photo-1609137144822-263a9254d3be?auto=format&fit=crop&w=900&q=80',
      season: 'Year-Round Alpine Magic',
      vibe: 'Spiritual, Scenic, Invigorating'
    },
    {
      title: 'Karnataka',
      state: 'South-Western India',
      category: 'Heritage',
      tagline: 'Cradle of Stone Empires, Mysore Splendor & Coffee Groves',
      highlights: 'UNESCO World Heritage Hampi boulder ruins, misty Coorg coffee plantations, royal Mysore palaces',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=900&q=80',
      season: 'October – March',
      vibe: 'Timeless, Architectural, Aromatic'
    }
  ];

  const filteredDestinations = selectedCategory === 'All' 
    ? destinations 
    : destinations.filter((d) => d.category === selectedCategory);

  return (
    <section id="journey-section" className="w-full bg-black text-white py-24 px-6 sm:px-12 lg:px-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Travel Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-white/70 block mb-3 font-medium flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" /> All About Travelling with Tripzy
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              To travel is to live,<br />to wander is to be free.
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
            Tripzy is born from a deep devotion to world exploration. Travel breaks the routine of everyday existence, introduces us to untold perspectives, and turns distant landscapes into lifelong memories.
          </p>
        </div>

        {/* Travel Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="border border-white/15 rounded-2xl p-8 bg-neutral-950/60 hover:border-white/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Uncharted Horizons</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              True travel begins where ordinary maps conclude. From secluded coastal coves to secluded mountain sanctuaries, Tripzy uncovers journeys that ignite curiosity.
            </p>
          </div>

          <div className="border border-white/15 rounded-2xl p-8 bg-neutral-950/60 hover:border-white/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Slow & Immersive Living</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We champion slow travel — savoring local markets, conversing with generational artisans, and lingering for sunsets rather than rushing through checklists.
            </p>
          </div>

          <div className="border border-white/15 rounded-2xl p-8 bg-neutral-950/60 hover:border-white/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Effortless Discovery</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every detail of your travel journey is curated with intuitive ease. You bring your curiosity and aspirations; Tripzy takes care of orchestrating the magic.
            </p>
          </div>
        </div>

        {/* Curated Destinations & Travel Inspirations */}
        <div className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 block mb-1">Incredible India Journeys</span>
              <h3 className="text-2xl sm:text-4xl font-bold text-white">Iconic Escapes Across Indian States</h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {travelCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-colors cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-white text-black' 
                      : 'border border-white/20 text-neutral-400 hover:text-white hover:border-white/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest, idx) => (
              <div 
                key={idx} 
                className="border border-white/15 rounded-2xl overflow-hidden bg-neutral-950 group hover:border-white/40 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 w-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white">
                    {dest.category}
                  </span>

                  {/* Season Badge */}
                  <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                    {dest.season}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="text-xl font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-white/70 shrink-0" />
                        <span>{dest.title}</span>
                      </h4>
                      <span className="text-[11px] text-neutral-400 font-normal tracking-wide">{dest.state}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3 italic">
                      "{dest.tagline}"
                    </p>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                      {dest.highlights}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Vibe: {dest.vibe}</span>
                    <button 
                      onClick={onStartJourney}
                      className="text-xs text-white font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Joy of Traveling Story Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-24 border border-white/15 rounded-3xl p-8 sm:p-12 bg-neutral-950/80">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-white/70 block font-medium">The Wanderer's Creed</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Why we pack our bags and seek what lies beyond.
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Every travel journey across India is an encounter with millennia of living heritage, diverse languages, and awe-inspiring geographies. From the high mountain desert passes of the north to the serene coastal lagoons of the deep south, every state unfolds like an entirely new world.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              At Tripzy, we curate transformative escapes that immerse you in the authentic heart of each state. Whether waking to morning chants on the ghats, cruising mist-draped backwaters, or stargazing in royal desert sands, your voyage begins with an invitation to discover.
            </p>

            <div className="pt-2 flex items-center gap-6 text-sm text-white">
              <div>
                <strong className="text-2xl font-bold block">28+</strong>
                <span className="text-xs text-neutral-400">States & Territories</span>
              </div>
              <div className="w-[1px] h-8 bg-white/20" />
              <div>
                <strong className="text-2xl font-bold block">5,000+</strong>
                <span className="text-xs text-neutral-400">Years of Heritage</span>
              </div>
              <div className="w-[1px] h-8 bg-white/20" />
              <div>
                <strong className="text-2xl font-bold block">100%</strong>
                <span className="text-xs text-neutral-400">Incredible Wonder</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl overflow-hidden relative shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80" 
              alt="Incredible India Heritage" 
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <p className="text-white text-sm font-medium tracking-wide">
                "India is not just a destination; it is an emotion, a sensory awakening, and a voyage of the spirit."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="border border-white/20 rounded-3xl p-8 sm:p-14 text-center bg-gradient-to-b from-neutral-900/60 to-black relative overflow-hidden">
          <h3 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Your next story is waiting.</h3>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Step through the window and explore the world with Tripzy. Tell us your dream travel horizon, and let us design an unforgettable escape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="bg-white text-black font-semibold px-8 py-3.5 rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-white/20"
            >
              <span>Start Travel Journey</span>
              <Compass className="w-4 h-4" />
            </button>
            <a
              href="mailto:info@tripzy.com"
              className="px-8 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium"
            >
              Contact Tripzy Concierge
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
