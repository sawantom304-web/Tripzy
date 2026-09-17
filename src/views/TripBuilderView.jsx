import React, { useState, useRef } from 'react';
import {
  Search,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Rocket,
  ArrowRight,
} from 'lucide-react';

const REGIONS = ['All', 'North', 'West', 'South', 'East', 'Northeast', 'Central'];

// ALL 36 STATES AND UNION TERRITORIES OF INDIA WITH TOURIST DESTINATIONS
const ALL_INDIAN_DESTINATIONS = [
  // North (10)
  { name: 'Jammu & Kashmir', region: 'North', rating: '4.9', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&auto=format&fit=crop&q=60', popular: 'Srinagar, Gulmarg, Pahalgam, Sonamarg' },
  { name: 'Ladakh', region: 'North', rating: '4.9', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&auto=format&fit=crop&q=60', popular: 'Leh, Pangong Tso, Nubra Valley' },
  { name: 'Himachal Pradesh', region: 'North', rating: '4.8', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=60', popular: 'Manali, Shimla, Spiti Valley, Kasol' },
  { name: 'Uttarakhand', region: 'North', rating: '4.7', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=60', popular: 'Rishikesh, Nainital, Mussoorie, Auli' },
  { name: 'Rajasthan', region: 'North', rating: '4.8', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=60', popular: 'Jaipur, Udaipur, Jaisalmer, Jodhpur' },
  { name: 'Punjab', region: 'North', rating: '4.6', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=60', popular: 'Amritsar, Golden Temple, Wagah' },
  { name: 'Delhi', region: 'North', rating: '4.6', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60', popular: 'Red Fort, Qutub Minar, India Gate' },
  { name: 'Uttar Pradesh', region: 'North', rating: '4.7', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=60', popular: 'Varanasi, Taj Mahal Agra, Vrindavan' },
  { name: 'Haryana', region: 'North', rating: '4.5', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60', popular: 'Gurugram, Kurukshetra, Sultanpur' },
  { name: 'Chandigarh', region: 'North', rating: '4.6', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=60', popular: 'Rock Garden, Sukhna Lake, Rose Garden' },

  // West (4)
  { name: 'Goa', region: 'West', rating: '4.9', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60', popular: 'Panjim, Calangute, Palolem, Dudhsagar' },
  { name: 'Maharashtra', region: 'West', rating: '4.7', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=60', popular: 'Mumbai, Lonavala, Mahabaleshwar, Ajanta' },
  { name: 'Gujarat', region: 'West', rating: '4.7', image: 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?w=600&auto=format&fit=crop&q=60', popular: 'Rann of Kutch, Gir, Statue of Unity' },
  { name: 'Dadra & Nagar Haveli and Daman & Diu', region: 'West', rating: '4.5', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=60', popular: 'Daman Beach, Diu Fort, Silvassa' },

  // South (8)
  { name: 'Karnataka', region: 'South', rating: '4.8', image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=600&auto=format&fit=crop&q=60', popular: 'Coorg, Hampi, Gokarna, Mysore' },
  { name: 'Kerala', region: 'South', rating: '4.9', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=60', popular: 'Munnar, Alleppey, Wayanad, Varkala' },
  { name: 'Tamil Nadu', region: 'South', rating: '4.7', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=60', popular: 'Ooty, Kodaikanal, Madurai, Rameshwaram' },
  { name: 'Andhra Pradesh', region: 'South', rating: '4.6', image: 'https://images.unsplash.com/photo-1627894099065-921d1d866a2f?w=600&auto=format&fit=crop&q=60', popular: 'Vizag, Tirupati, Araku Valley, Gandikota' },
  { name: 'Telangana', region: 'South', rating: '4.6', image: 'https://images.unsplash.com/photo-1605335870020-f56f4d5d99ca?w=600&auto=format&fit=crop&q=60', popular: 'Hyderabad, Warangal, Ramoji Film City' },
  { name: 'Puducherry', region: 'South', rating: '4.8', image: 'https://images.unsplash.com/photo-1589793907316-f94225488d72?w=600&auto=format&fit=crop&q=60', popular: 'White Town, Auroville, Paradise Beach' },
  { name: 'Lakshadweep', region: 'South', rating: '4.9', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=60', popular: 'Bangaram, Agatti, Kavaratti' },
  { name: 'Andaman & Nicobar Islands', region: 'South', rating: '4.9', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=60', popular: 'Havelock, Radhanagar, Neil Island' },

  // East (5)
  { name: 'West Bengal', region: 'East', rating: '4.7', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=60', popular: 'Darjeeling, Kolkata, Sundarbans' },
  { name: 'Bihar', region: 'East', rating: '4.5', image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=600&auto=format&fit=crop&q=60', popular: 'Bodh Gaya, Nalanda, Rajgir' },
  { name: 'Odisha', region: 'East', rating: '4.6', image: 'https://images.unsplash.com/photo-1627894099065-921d1d866a2f?w=600&auto=format&fit=crop&q=60', popular: 'Puri, Konark Sun Temple, Chilika Lake' },
  { name: 'Assam', region: 'East', rating: '4.8', image: 'https://images.unsplash.com/photo-1608930472483-e18e38d975db?w=600&auto=format&fit=crop&q=60', popular: 'Kaziranga, Majuli Island, Guwahati' },
  { name: 'Sikkim', region: 'East', rating: '4.9', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=60', popular: 'Gangtok, Nathula, Lachung, Pelling' },

  // Northeast (7)
  { name: 'Meghalaya', region: 'Northeast', rating: '4.9', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=60', popular: 'Shillong, Cherrapunji, Dawki, Root Bridges' },
  { name: 'Nagaland', region: 'Northeast', rating: '4.8', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&auto=format&fit=crop&q=60', popular: 'Kohima, Dzukou Valley, Mokokchung' },
  { name: 'Manipur', region: 'Northeast', rating: '4.7', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&auto=format&fit=crop&q=60', popular: 'Imphal, Loktak Floating Lake' },
  { name: 'Mizoram', region: 'Northeast', rating: '4.7', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=60', popular: 'Aizawl, Reiek, Vantawng Falls' },
  { name: 'Tripura', region: 'Northeast', rating: '4.6', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=60', popular: 'Agartala, Ujjayanta, Unakoti' },
  { name: 'Arunachal Pradesh', region: 'Northeast', rating: '4.9', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=60', popular: 'Tawang, Ziro Valley, Bomdila' },

  // Central (3)
  { name: 'Madhya Pradesh', region: 'Central', rating: '4.7', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&auto=format&fit=crop&q=60', popular: 'Khajuraho, Pachmarhi, Kanha, Gwalior' },
  { name: 'Chhattisgarh', region: 'Central', rating: '4.6', image: 'https://images.unsplash.com/photo-1627894099065-921d1d866a2f?w=600&auto=format&fit=crop&q=60', popular: 'Chitrakote Falls, Bastar, Mainpat' },
  { name: 'Jharkhand', region: 'Central', rating: '4.5', image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=600&auto=format&fit=crop&q=60', popular: 'Ranchi, Netarhat, Deoghar' },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=60';

export default function TripBuilderView({ onBuildTrip }) {
  // Form States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  
  // Active Builder Tab
  const [activeBuilderTab, setActiveBuilderTab] = useState('destination');

  // Selected State state (can be null if deselected)
  const [selectedState, setSelectedState] = useState('Goa');
  const [customCity, setCustomCity] = useState('');

  const [budget, setBudget] = useState(30000);
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-17');
  const [flexibleDates, setFlexibleDates] = useState(false);

  const [travelModes, setTravelModes] = useState(['Train', 'Flight']);
  const [experiences, setExperiences] = useState([
    'Beaches',
    'Food & Cuisine',
    'Photography',
    'Hidden & Offbeat',
  ]);
  const [groupType, setGroupType] = useState('Couple');
  const [groupCount, setGroupCount] = useState(2);
  const [pace, setPace] = useState('Balanced');

  const [accommodation, setAccommodation] = useState('Comfort (3 Star)');
  const [accPreferences, setAccPreferences] = useState(['Breakfast included', 'Free cancellation']);

  const [foodPreferences, setFoodPreferences] = useState(['Local / Regional', 'Street Food']);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [crowdPref, setCrowdPref] = useState('Avoid crowds');
  const [walkingPref, setWalkingPref] = useState('Moderate');
  const [specialNotes, setSpecialNotes] = useState('');

  // Horizontal Carousel Scroll Reference
  const carouselRef = useRef(null);

  // Section Refs for smooth scrolling
  const sectionDestinationRef = useRef(null);
  const sectionBudgetRef = useRef(null);
  const sectionDatesRef = useRef(null);
  const sectionExperiencesRef = useRef(null);

  const filteredDestinations = ALL_INDIAN_DESTINATIONS.filter((item) => {
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.popular.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleToggleState = (stateName) => {
    if (selectedState === stateName) {
      setSelectedState(null);
    } else {
      setSelectedState(stateName);
    }
  };

  const toggleTravelMode = (mode) => {
    if (travelModes.includes(mode)) {
      if (travelModes.length > 1) {
        setTravelModes(travelModes.filter((m) => m !== mode));
      }
    } else {
      setTravelModes([...travelModes, mode]);
    }
  };

  const toggleExperience = (exp) => {
    if (experiences.includes(exp)) {
      setExperiences(experiences.filter((e) => e !== exp));
    } else {
      setExperiences([...experiences, exp]);
    }
  };

  const scrollToSection = (tabId, targetRef) => {
    setActiveBuilderTab(tabId);
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedState) {
      alert('Please select a destination state before generating your trip.');
      return;
    }
    onBuildTrip({
      destinationState: selectedState,
      customCity: customCity || 'Panjim',
      budget,
      startDate,
      endDate,
      flexibleDates,
      travelModes,
      experiences,
      groupType,
      groupCount,
      pace,
      accommodation,
      accPreferences,
      foodPreferences,
      crowdPref,
      walkingPref,
      specialNotes,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] pt-24 pb-36 text-white">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* PAGE HEADER */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2">
            <span className="w-6 h-[2px] bg-[#00F5D4]"></span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#00F5D4]">
              TRIPZY AI WIZARD
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif-display font-medium text-white tracking-tight">
            Design Your <span className="italic">Perfect Trip</span>
          </h1>

          <p className="text-[#9CA3AF] text-base md:text-lg max-w-3xl mx-auto font-normal">
            Select your destination, set your budget & preferences. AI will handle the route, stays & timing.
          </p>
        </div>

        {/* WIZARD TABS NAVIGATION */}
        <div className="sticky top-20 z-30 mb-10">
          <div className="glass-card p-2 rounded-2xl border border-white/10 bg-[#111827]/90 backdrop-blur-xl flex items-center justify-around overflow-x-auto no-scrollbar shadow-2xl">
            {[
              { id: 'destination', label: '01 Destination', ref: sectionDestinationRef },
              { id: 'budget', label: '02 Budget', ref: sectionBudgetRef },
              { id: 'dates', label: '03 Dates & Modes', ref: sectionDatesRef },
              { id: 'experiences', label: '04 Experiences', ref: sectionExperiencesRef },
            ].map((tab) => {
              const active = activeBuilderTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id, tab.ref)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-syne font-bold whitespace-nowrap transition-all text-center ${
                    active
                      ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white shadow-md shadow-[#6C63FF]/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SECTION A — DESTINATION CAROUSEL */}
          <div
            ref={sectionDestinationRef}
            className="glass-card-dark p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-widest">
                  SECTION A
                </h2>
                <h3 className="text-2xl md:text-3xl font-serif-display font-bold text-white mt-0.5">
                  Where do you want to go?
                </h3>
              </div>

              {/* Carousel Flip Navigation Arrows */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-gray-400">
                  {ALL_INDIAN_DESTINATIONS.length} Indian States & UTs
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={scrollLeft}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-[#00F5D4] hover:text-black hover:scale-105 transition-all flex items-center justify-center shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={scrollRight}
                    className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-[#00F5D4] hover:text-black hover:scale-105 transition-all flex items-center justify-center shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar & Region Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6 relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search all 36 Indian states, cities or regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111827] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5D4]"
                />
              </div>

              <div className="md:col-span-6 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {REGIONS.map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-syne font-bold whitespace-nowrap transition-all ${
                      selectedRegion === reg
                        ? 'bg-[#00F5D4] text-black shadow-md shadow-[#00F5D4]/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* HORIZONTAL CONTINUOUS SLIDING CAROUSEL CONTAINER */}
            <div
              ref={carouselRef}
              className="flex space-x-4 overflow-x-auto py-3 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {filteredDestinations.map((dest) => {
                const isSelected = selectedState === dest.name;
                return (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => handleToggleState(dest.name)}
                    className={`min-w-[260px] max-w-[260px] snap-start relative rounded-3xl overflow-hidden h-72 border transition-all duration-300 group text-left flex flex-col justify-between p-4 shadow-xl shrink-0 ${
                      isSelected
                        ? 'border-[#00F5D4] ring-4 ring-[#00F5D4]/40 scale-[1.03] shadow-[#00F5D4]/30'
                        : 'border-white/10 hover:border-white/30 hover:scale-[1.02] opacity-85 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-[#FBBF24] flex items-center space-x-1 border border-white/10">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{dest.rating}</span>
                      </span>

                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-[#00F5D4] flex items-center justify-center text-black shadow-lg animate-pulse">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/50 group-hover:text-white">
                          <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 space-y-1">
                      <p className="text-xs font-mono font-bold text-[#00F5D4] uppercase tracking-wider">
                        {dest.region}
                      </p>
                      <h4 className="text-xl font-syne font-extrabold text-white leading-tight">
                        {dest.name}
                      </h4>
                      <p className="text-[11px] text-gray-200 line-clamp-2 leading-relaxed">
                        {dest.popular}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selection Status & Narrow City Input */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-400">
                Selected Destination:{' '}
                {selectedState ? (
                  <strong className="text-[#00F5D4] font-syne font-bold text-sm">
                    {selectedState} (Click card again to deselect)
                  </strong>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    None selected — Click any card above to select
                  </span>
                )}
              </span>
              <input
                type="text"
                placeholder={selectedState ? `Specific city in ${selectedState} (e.g. Panjim)` : 'Specific city or town'}
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full sm:w-80 bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00F5D4]"
              />
            </div>
          </div>

          {/* SECTION B — BUDGET */}
          <div
            ref={sectionBudgetRef}
            className="glass-card-dark p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
          >
            <div>
              <h2 className="text-xs font-mono font-bold text-[#6C63FF] uppercase tracking-widest">
                SECTION B — BUDGET
              </h2>
              <h3 className="text-2xl font-serif-display font-bold text-white mt-0.5">
                What's your total trip budget?
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs text-gray-400">₹10,000</span>
                <span className="text-3xl font-bold font-syne text-[#00F5D4]">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400">₹1,00,000+</span>
              </div>
              <input
                type="range"
                min="10000"
                max="120000"
                step="2500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#00F5D4] bg-gray-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-3">
              {[10000, 25000, 50000, 75000, 100000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudget(val)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    budget === val
                      ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  ₹{val >= 100000 ? '1L+' : `${val / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION C — DATES & MODES */}
          <div
            ref={sectionDatesRef}
            className="glass-card-dark p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
          >
            <div>
              <h2 className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-widest">
                SECTION C & D — DATES & TRAVEL MODES
              </h2>
              <h3 className="text-2xl font-serif-display font-bold text-white mt-0.5">
                When & how do you want to travel?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#34D399]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#34D399]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs text-gray-400 block mb-3">Preferred Travel Modes:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Train' },
                  { name: 'Flight' },
                  { name: 'Car/Cab' },
                  { name: 'Bus' },
                  { name: 'Bike' },
                  { name: 'Ferry/Cruise' },
                ].map((mode) => {
                  const selected = travelModes.includes(mode.name);
                  return (
                    <button
                      key={mode.name}
                      type="button"
                      onClick={() => toggleTravelMode(mode.name)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-[#00F5D4]/20 border-[#00F5D4] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold font-syne">{mode.name}</span>
                      {selected && <Check className="w-4 h-4 text-[#00F5D4]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION E — EXPERIENCES */}
          <div
            ref={sectionExperiencesRef}
            className="glass-card-dark p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl"
          >
            <div>
              <h2 className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-widest">
                SECTION E — EXPERIENCES & VIBE
              </h2>
              <h3 className="text-2xl font-serif-display font-bold text-white mt-0.5">
                What are you into?
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                'Beaches',
                'Mountains',
                'Food & Cuisine',
                'History',
                'Nature',
                'Adventure Sports',
                'Photography',
                'Culture & Arts',
                'Nightlife',
                'Relaxation',
                'Shopping',
                'Hidden & Offbeat',
                'Festivals',
                'Watersports',
                'Wildlife Safari',
                'Fine Dining',
                'Music & Events',
                'Camping',
              ].map((expName) => {
                const selected = experiences.includes(expName);
                return (
                  <button
                    key={expName}
                    type="button"
                    onClick={() => toggleExperience(expName)}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all ${
                      selected
                        ? 'bg-gradient-to-r from-[#00F5D4] to-[#38BDF8] text-black font-bold shadow-md shadow-[#00F5D4]/30 scale-105'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{expName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STICKY BOTTOM BUTTON: BUILD MY JOURNEY */}
          <div className="sticky bottom-6 z-30 pt-4">
            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-[#00F5D4] text-black font-syne font-extrabold text-xl shadow-2xl shadow-[#00F5D4]/40 hover:bg-[#00F5D4]/90 hover:scale-[1.01] transition-all flex items-center justify-center space-x-3 glow-teal cursor-pointer"
            >
              <Sparkles className="w-6 h-6 animate-spin text-black" />
              <span>Build My Journey with Tripzy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
