import React from 'react';
import { X, Globe2, Compass, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function InfoDrawer({ section, onClose, onBookClick }) {
  if (!section) return null;

  const contentMap = {
    'About': {
      title: 'About Tripzy',
      subtitle: 'Inspiring Meaningful Journeys Across the Earth',
      icon: <Award className="w-8 h-8 text-[#00F5D4] mb-2" />,
      body: [
        'Tripzy was founded on an enduring passion: to inspire travelers to venture beyond conventional tourist trails and discover the raw beauty of our planet.',
        'We believe travelling is not merely visiting a place, but opening oneself to new cultures, flavors, and moments that fundamentally enrich who we are.'
      ],
      points: [
        'Hand-curated travel itineraries crafted by veteran explorers',
        'Emphasis on sustainable, slow, and respectful local community engagement',
        '24/7 dedicated Tripzy travel concierge supporting you at every border'
      ]
    },
    'Destinations': {
      title: 'Curated Indian States',
      subtitle: 'From Royal Thar Dunes to Serene Backwaters & Himalayan Peaks',
      icon: <Compass className="w-8 h-8 text-[#00F5D4] mb-2" />,
      body: [
        'Whether your spirit seeks the golden havelis of Rajasthan, the emerald labyrinth of Kerala\'s backwaters, the alpine pine vales of Himachal & Kashmir, or the mist-clad waterfalls of Meghalaya, Tripzy curates journeys across India with unmatched depth.',
        'Each state itinerary is meticulously researched, providing heritage stays, seasonal recommendations, and authentic local discoveries.'
      ],
      points: [
        'Royal Heritage States: Rajasthan (Jaipur, Udaipur, Jaisalmer), Karnataka (Hampi, Mysore)',
        'Coastal & Backwater Havens: Kerala (Alleppey, Munnar), Goa (Fontainhas & secluded southern coves)',
        'Himalayan Crowns & Northeast: Jammu & Kashmir, Himachal Pradesh, Uttarakhand, Meghalaya'
      ]
    },
    'Experiences': {
      title: 'Travel Experiences',
      subtitle: 'Memories That Outlast Any Souvenir',
      icon: <Sparkles className="w-8 h-8 text-[#00F5D4] mb-2" />,
      body: [
        'The heart of travel beats in the moments between destinations: learning traditional cuisine, floating in a shikara at sunrise over Dal Lake, or stargazing under Thar skies.',
        'Tripzy crafts unscripted moments that turn every holiday into a transformational chapter of your life.'
      ],
      points: [
        'Bespoke private excursions with knowledgeable local historians & guides',
        'Culinary immersions, private farm-to-table vineyard dining, and night market strolls',
        'Wellness retreats, geothermal hot springs, and secluded nature treks'
      ]
    },
    'Global': {
      title: 'Global Travel Network',
      subtitle: 'Connecting Curious Travelers Worldwide',
      icon: <Globe2 className="w-8 h-8 text-[#00F5D4] mb-2" />,
      body: [
        'Tripzy maintains trusted relationships with local boutique hoteliers, eco-lodges, and cultural custodians across more than 140 nations.',
        'Wherever your curiosity leads you, our global network ensures welcoming hospitality, effortless logistics, and complete peace of mind.'
      ],
      points: [
        'On-the-ground local support in every major destination time zone',
        'Transparent travel insights, visa guidelines, and weather intelligence',
        'Exclusive access to private reserves, historic estates, and sanctuary villas'
      ]
    }
  };

  const data = contentMap[section] || contentMap['About'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-lg bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div>{data.icon}</div>
        <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white mb-1">{data.title}</h2>
        <p className="text-[#00F5D4] font-mono text-xs sm:text-sm mb-5 uppercase tracking-wider">{data.subtitle}</p>

        <div className="space-y-3 mb-6 text-sm text-neutral-300 leading-relaxed">
          {data.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {data.points && (
          <ul className="space-y-2 mb-8 border-t border-white/10 pt-4">
            {data.points.map((pt, i) => (
              <li key={i} className="text-xs sm:text-sm text-neutral-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] mt-1.5 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              onBookClick();
            }}
            className="flex-1 bg-[#00F5D4] text-black font-syne font-bold py-2.5 rounded-full text-xs sm:text-sm hover:bg-[#00F5D4]/90 transition-colors cursor-pointer glow-teal"
          >
            Start Travel Journey
          </button>
          <button
            onClick={onClose}
            className="px-5 border border-white/30 text-white rounded-full text-xs sm:text-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
