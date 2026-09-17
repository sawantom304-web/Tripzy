import React, { useState } from 'react';
import { Plane, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AircraftWindowProps {
  onBookClick: () => void;
}

export const AircraftWindow: React.FC<AircraftWindowProps> = ({ onBookClick }) => {
  const [shadePosition, setShadePosition] = useState<number>(0); // 0 = fully open, 100 = fully closed
  const [isHovered, setIsHovered] = useState(false);

  const toggleShade = () => {
    setShadePosition((prev) => (prev > 50 ? 0 : 85));
  };

  return (
    <div className="relative flex flex-col items-center select-none" id="aircraft-window-container">
      {/* Outer Glow / Fuselage Ambient Light on Black */}
      <div className="absolute inset-0 -m-8 rounded-[160px] bg-gradient-to-b from-white/[0.08] to-transparent blur-2xl pointer-events-none" />

      {/* Main Aircraft Window Bezel Outer Structure */}
      <div 
        className="relative w-[280px] h-[390px] xs:w-[310px] xs:h-[430px] sm:w-[350px] sm:h-[490px] md:w-[380px] md:h-[530px] lg:w-[410px] lg:h-[570px] rounded-[135px] sm:rounded-[165px] md:rounded-[185px] p-[16px] sm:p-[20px] md:p-[24px] shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
        style={{
          background: 'linear-gradient(175deg, #e5e7eb 0%, #b8bec7 18%, #858e9b 48%, #5a626d 78%, #727b87 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.18), 0 30px 90px rgba(0,0,0,0.95), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -4px 8px rgba(0,0,0,0.6)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Recessed Molded Inner Bezel Chamfer */}
        <div 
          className="relative w-full h-full rounded-[118px] sm:rounded-[145px] md:rounded-[162px] p-[12px] sm:p-[15px] md:p-[18px]"
          style={{
            background: 'linear-gradient(180deg, #3d434c 0%, #5d6673 25%, #949ea9 65%, #c8ced5 95%)',
            boxShadow: 'inset 0 16px 30px rgba(0,0,0,0.85), inset 0 2px 6px rgba(0,0,0,0.9), inset 0 -6px 14px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {/* Inner Seal Trim & Window Casing */}
          <div 
            className="relative w-full h-full rounded-[105px] sm:rounded-[130px] md:rounded-[144px] overflow-hidden"
            style={{
              background: '#0a0d12',
              boxShadow: 'inset 0 12px 24px rgba(0,0,0,0.95), inset 0 -8px 16px rgba(255,255,255,0.35)'
            }}
          >
            {/* Sky Background with Clouds */}
            <div className="absolute inset-0 bg-[#2582d9]">
              {/* Daytime high-altitude sky gradient */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, #1b6fb8 0%, #3a97de 30%, #68b5ea 60%, #9dd0f3 85%, #cde7fa 100%)'
                }}
              />

              {/* Realistic Cumulus Cloud Photography Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-85 mix-blend-screen transform scale-110"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80')`,
                  animation: 'driftClouds 45s linear infinite alternate'
                }}
              />

              {/* Secondary Soft Cloud Layer for Atmosphere */}
              <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  background: 'radial-gradient(circle at 65% 35%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 45%, transparent 75%)'
                }}
              />
            </div>

            {/* Aviation Double-Pane Glass Specular Reflection */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(125deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 32%, transparent 48%, rgba(255,255,255,0.04) 65%, transparent 100%)'
              }}
            />

            {/* Subtle Inner Lens Vignette and Pane Depth */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 45px rgba(10,25,45,0.45), inset 0 6px 12px rgba(0,0,0,0.6), inset 0 -8px 18px rgba(255,255,255,0.4)'
              }}
            />

            {/* "Tripzy" text on glass pane (matches aesthetic from reference) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span 
                className="text-white/95 text-lg xs:text-xl sm:text-2xl md:text-3xl font-light tracking-[0.28em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] uppercase transform -translate-y-2 select-none"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.28em'
                }}
              >
                Tripzy
              </span>
            </div>

            {/* Pull-down Window Shade */}
            <motion.div 
              className="absolute top-0 left-0 right-0 z-20 overflow-hidden"
              initial={false}
              animate={{ height: `${shadePosition}%` }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            >
              {/* Shade Plastic Ribbed Material */}
              <div 
                className="w-full h-full relative"
                style={{
                  background: 'linear-gradient(180deg, #d3d7de 0%, #b4bac3 40%, #9ba3ae 85%, #88909c 100%)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.85), inset 0 2px 3px rgba(255,255,255,0.6)'
                }}
              >
                {/* Horizontal slats/texture on blind */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 12px)'
                  }}
                />
              </div>
            </motion.div>

            {/* Shade Top Visor & Handle Grip (Always visible at top of window frame, exactly as in reference image) */}
            <div 
              className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-auto"
              style={{
                top: `${shadePosition}%`,
                transition: 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Curved Top Cap / Shade guide */}
              <div 
                className="relative -top-[1px] w-40 sm:w-48 h-8 sm:h-9 rounded-b-[24px] flex items-center justify-center cursor-pointer shadow-md group"
                onClick={toggleShade}
                title={shadePosition > 50 ? "Open window shade" : "Close window shade"}
                style={{
                  background: 'linear-gradient(180deg, #383e47 0%, #515964 45%, #7b8593 100%)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.65), inset 0 1px 2px rgba(255,255,255,0.4)'
                }}
              >
                {/* Ergonomic Finger Handle Indentation */}
                <div 
                  className="w-14 sm:w-16 h-3 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(180deg, #1f2329 0%, #303640 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.3)'
                  }}
                >
                  <div className="w-8 h-[2px] rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            {/* Breathing Ambient Light pulse on glass edges */}
            <div className="absolute inset-0 rounded-[105px] sm:rounded-[130px] md:rounded-[144px] pointer-events-none ring-1 ring-white/20" />
          </div>
        </div>
      </div>

      {/* "Start Travel Journey" Pill Button with Compass/Plane Icon */}
      <div className="relative -mt-6 sm:-mt-7 z-30 flex items-center justify-center">
        <motion.button
          id="start-travel-journey-button"
          onClick={onBookClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center gap-2 sm:gap-2.5 bg-white text-black font-medium text-xs sm:text-sm pl-5 pr-2 py-2 sm:py-2.5 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
        >
          <span className="font-medium text-neutral-900 tracking-tight">Start Travel Journey</span>
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:rotate-12">
            <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-[-45deg] transition-transform group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
          </span>
        </motion.button>
      </div>

      <style>{`
        @keyframes driftClouds {
          0% { transform: scale(1.08) translateX(-3%) translateY(0); }
          100% { transform: scale(1.12) translateX(3%) translateY(-2%); }
        }
      `}</style>
    </div>
  );
};
