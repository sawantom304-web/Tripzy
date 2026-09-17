import React, { useState, useRef } from 'react';
import { Compass, Globe, MapPin, Sparkles, Heart, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

export function JourneySection({ onStartJourney }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStates, setSelectedStates] = useState(['Goa', 'Kerala', 'Jammu & Kashmir']);
  const sliderRef = useRef(null);

  const indianStates = [
    {
      name: 'Goa',
      region: 'West Coast',
      places: 'Calangute, Palolem, Panaji, Dudhsagar',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Kerala',
      region: 'South India',
      places: 'Alleppey, Munnar, Kochi, Varkala',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Jammu & Kashmir',
      region: 'Himalayan Crown',
      places: 'Srinagar Dal Lake, Gulmarg Snow Slopes, Pahalgam',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Rajasthan',
      region: 'North India',
      places: 'Jaipur Amber Fort, Udaipur Lakes, Jaisalmer Dunes',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Himachal Pradesh',
      region: 'Himalayas',
      places: 'Manali Pine Ridges, Shimla, Dharamshala, Spiti',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Ladakh',
      region: 'High Desert',
      places: 'Pangong Tso, Nubra Valley, Leh Palace, Khardung La',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Sikkim',
      region: 'Northeast Himalayas',
      places: 'Gangtok, Tsomgo Lake, Nathula Pass, Pelling',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Karnataka',
      region: 'South-Western',
      places: 'UNESCO Hampi Ruins, Coorg Coffee, Mysore Palace',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Uttarakhand',
      region: 'Himalayan Foothills',
      places: 'Rishikesh Aarti, Nainital Lake, Mussoorie, Auli',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Meghalaya',
      region: 'Northeast',
      places: 'Cherrapunji Falls, Dawki River, Living Root Bridges',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Maharashtra',
      region: 'Western India',
      places: 'Mumbai Marine Drive, Lonavala, Ajanta-Ellora',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Tamil Nadu',
      region: 'Deep South',
      places: 'Meenakshi Temple, Ooty Hills, Kodaikanal',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Gujarat',
      region: 'Western Coast',
      places: 'White Rann of Kutch, Statue of Unity, Gir Lions',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Uttar Pradesh',
      region: 'Northern Heartland',
      places: 'Varanasi Ganga Ghats, Taj Mahal Agra, Ayodhya',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'West Bengal',
      region: 'Eastern India',
      places: 'Darjeeling Tea Valleys, Kolkata Heritage, Sundarbans',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Punjab',
      region: 'North-Western',
      places: 'Golden Temple Amritsar, Wagah Border, Patiala',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Assam',
      region: 'Northeast',
      places: 'Kaziranga One-Horned Rhinos, Guwahati, Majuli Island',
      image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Odisha',
      region: 'Eastern Coast',
      places: 'Konark Sun Temple, Puri Sea Beach, Chilika Lake',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Madhya Pradesh',
      region: 'Central Heartland',
      places: 'Khajuraho Temples, Kanha Tiger Reserve, Gwalior',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const toggleStateSelection = (stateName) => {
    setSelectedStates((prev) =>
      prev.includes(stateName)
        ? prev.filter((s) => s !== stateName)
        : [...prev, stateName]
    );
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

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
      tagline: "God's Own Country — Emerald Backwaters & Mist-clad Tea Hills",
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
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
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
    }
  ];

  const filteredDestinations = selectedCategory === 'All' 
    ? destinations 
    : destinations.filter((d) => d.category === selectedCategory);

  return (
    <section id="journey-section" className="w-full bg-transparent text-white py-12 px-6 sm:px-10 lg:px-12 scroll-mt-24">
      <div className="max-w-[1600px] w-full mx-auto space-y-24">
        
        {/* SECTION A: WHERE DO YOU WANT TO GO? (INTERACTIVE STATE SELECTION CAROUSEL) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.28em] text-[#00F5D4] block mb-2 font-semibold flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00F5D4]" /> SECTION A — SELECT YOUR HORIZON
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif-display font-medium tracking-tight text-white leading-tight">
                Where do you want to go?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Click any Indian state card to select or deselect. Slide left/right to browse all 19 tourist regions.
              </p>
            </div>

            {/* Slider Navigation Arrows & Selected Counter */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-[#00F5D4] bg-[#00F5D4]/10 border border-[#00F5D4]/30 px-3.5 py-1.5 rounded-full font-bold">
                {selectedStates.length} Selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={slideLeft}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-[#00F5D4] hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
                  title="Slide left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={slideRight}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-[#00F5D4] hover:text-black border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
                  title="Slide right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sliding Cards Container with padding to prevent left card clipping */}
          <div
            ref={sliderRef}
            className="flex space-x-5 overflow-x-auto scrollbar-none py-4 px-2 sm:px-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {indianStates.map((stateItem, idx) => {
              const isSelected = selectedStates.includes(stateItem.name);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStateSelection(stateItem.name)}
                  className={`relative shrink-0 w-72 sm:w-80 h-96 rounded-3xl overflow-hidden border cursor-pointer group transition-all duration-300 transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-[#00F5D4] shadow-[0_0_30px_rgba(0,245,212,0.45)] ring-2 ring-[#00F5D4]'
                      : 'border-white/20 hover:border-white/50 bg-black/30'
                  }`}
                >
                  {/* Card Background Image */}
                  <img
                    src={stateItem.image}
                    alt={stateItem.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Top Badge: Region & Checkmark */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono tracking-widest uppercase font-semibold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#00F5D4]">
                      {stateItem.region}
                    </span>
                    
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#00F5D4] text-black shadow-lg' : 'bg-black/60 border border-white/30 text-white/50'
                    }`}>
                      <Check className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Content Info */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 space-y-2">
                    <h3 className="text-2xl font-syne font-bold text-white group-hover:text-[#00F5D4] transition-colors">
                      {stateItem.name}
                    </h3>
                    <p className="text-xs text-gray-300 leading-snug line-clamp-2">
                      <span className="text-[#00F5D4] font-semibold">Popular:</span> {stateItem.places}
                    </p>
                    
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-300 border-t border-white/20">
                      <span>{isSelected ? '✓ State Selected' : 'Click to Select'}</span>
                      <span className="text-[#00F5D4] font-semibold">Explore →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer for Selected States */}
          {selectedStates.length > 0 && (
            <div className="p-4 rounded-2xl border border-[#00F5D4]/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/50 backdrop-blur-md">
              <div className="text-xs">
                <span className="text-gray-300">Selected Destinations: </span>
                <strong className="text-[#00F5D4] font-syne text-sm">
                  {selectedStates.join(', ')}
                </strong>
              </div>
              <button
                onClick={onStartJourney}
                className="px-6 py-2.5 rounded-full bg-[#00F5D4] text-black font-syne font-bold text-xs shadow-lg shadow-[#00F5D4]/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer glow-teal"
              >
                <span>🚀 Plan Trip for Selected States ({selectedStates.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* TRAVEL PHILOSOPHY PILLARS */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.28em] text-[#00F5D4] block mb-3 font-semibold flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> All About Travelling with Tripzy
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif-display font-medium tracking-tight text-white leading-tight">
                To travel is to live,<br /><span className="italic font-normal">to wander is to be free.</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
              Tripzy is born from a deep devotion to world exploration. Travel breaks the routine of everyday existence, introduces us to untold perspectives, and turns distant landscapes into lifelong memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md hover:border-[#00F5D4]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#00F5D4]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-[#00F5D4]" />
              </div>
              <h3 className="text-xl font-syne font-bold text-white mb-2">Uncharted Horizons</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                True travel begins where ordinary maps conclude. From secluded coastal coves to mountain sanctuaries, Tripzy uncovers journeys that ignite curiosity.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md hover:border-[#38BDF8]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-[#38BDF8]" />
              </div>
              <h3 className="text-xl font-syne font-bold text-white mb-2">Slow & Immersive Living</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                We champion slow travel — savoring local markets, conversing with generational artisans, and lingering for sunsets rather than rushing through checklists.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-white/20 bg-black/40 backdrop-blur-md hover:border-[#6C63FF]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-[#6C63FF]" />
              </div>
              <h3 className="text-xl font-syne font-bold text-white mb-2">Effortless Discovery</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Every detail of your travel journey is curated with intuitive ease. You bring your curiosity and aspirations; Tripzy takes care of orchestrating the magic.
              </p>
            </div>
          </div>
        </div>

        {/* CURATED DESTINATIONS & TRAVEL INSPIRATIONS */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] block mb-1">Incredible India Journeys</span>
              <h3 className="text-2xl sm:text-4xl font-serif-display font-bold text-white">Iconic Escapes Across Indian States</h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {travelCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-syne font-bold tracking-wider transition-colors cursor-pointer backdrop-blur-md ${
                    selectedCategory === cat 
                      ? 'bg-[#00F5D4] text-black shadow-md shadow-[#00F5D4]/30' 
                      : 'border border-white/30 bg-black/50 text-neutral-300 hover:text-white hover:border-white/60'
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
                className="border border-white/20 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden group hover:border-[#00F5D4]/60 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 w-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#00F5D4]">
                    {dest.category}
                  </span>

                  {/* Season Badge */}
                  <span className="absolute bottom-3 left-3 text-xs font-mono font-medium text-white/90 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                    {dest.season}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="text-xl font-syne font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#00F5D4] shrink-0" />
                        <span>{dest.title}</span>
                      </h4>
                      <span className="text-[11px] text-neutral-400 font-mono">{dest.state}</span>
                    </div>
                    <p className="text-xs text-neutral-300 mb-3 italic">
                      "{dest.tagline}"
                    </p>
                    <p className="text-xs text-neutral-200 leading-relaxed mb-4">
                      {dest.highlights}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider">Vibe: {dest.vibe}</span>
                    <button 
                      onClick={onStartJourney}
                      className="text-xs text-[#00F5D4] font-syne font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THE WANDERER'S CREED STORY FEATURE (UNBLOCKED) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#00F5D4] block font-semibold">The Wanderer's Creed</span>
            <h3 className="text-3xl sm:text-4xl font-serif-display font-bold text-white leading-tight">
              Why we pack our bags and seek what lies beyond.
            </h3>
            <p className="text-neutral-200 text-sm leading-relaxed">
              Every travel journey across India is an encounter with millennia of living heritage, diverse languages, and awe-inspiring geographies. From the high mountain desert passes of the north to the serene coastal lagoons of the deep south, every state unfolds like an entirely new world.
            </p>
            <p className="text-neutral-300 text-sm leading-relaxed">
              At Tripzy, we curate transformative escapes that immerse you in the authentic heart of each state. Whether waking to morning chants on the ghats, cruising mist-draped backwaters, or stargazing in royal desert sands, your voyage begins with an invitation to discover.
            </p>

            <div className="pt-2 flex items-center gap-6 text-sm text-white font-mono">
              <div>
                <strong className="text-2xl font-bold font-syne text-[#00F5D4] block">36</strong>
                <span className="text-xs text-neutral-300">States & UTs</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <strong className="text-2xl font-bold font-syne text-[#38BDF8] block">5,000+</strong>
                <span className="text-xs text-neutral-300">Years of Heritage</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <strong className="text-2xl font-bold font-syne text-[#34D399] block">100%</strong>
                <span className="text-xs text-neutral-300">Incredible Wonder</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80" 
              alt="Incredible India Heritage" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
              className="w-full h-80 sm:h-96 object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-6 rounded-2xl">
              <p className="text-white text-sm font-medium tracking-wide italic">
                "India is not just a destination; it is an emotion, a sensory awakening, and a voyage of the spirit."
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION (UNBLOCKED) */}
        <div className="text-center py-10 relative overflow-hidden">
          <h3 className="text-3xl sm:text-5xl font-serif-display font-bold text-white mb-4 tracking-tight">Your next story is waiting.</h3>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Step through the aircraft window and explore the world with Tripzy. Tell us your dream travel horizon, and let us design an unforgettable escape.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="bg-[#00F5D4] text-black font-syne font-bold px-8 py-4 rounded-full hover:bg-[#00F5D4]/90 transition-colors flex items-center gap-2 cursor-pointer shadow-lg glow-teal"
            >
              <span>🚀 Start Travel Journey</span>
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
