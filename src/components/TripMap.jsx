import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Box, 
  RotateCw, 
  Layers, 
  Compass, 
  Sparkles
} from 'lucide-react';

// Mapbox token loaded from environment variable or decoded fallback for live deployments
const MAP_FALLBACK = 'cGsuZXlKMUlqb2liMjF6WVhkaGJuUXdPU0lzSW1FaU9pSmpiWFV6YmpFMGIyY3dPVzUzTW5weGRteGtZVFpoTkRWcEluMC5iRlduSURCQUFtVEJpZGNlZHY5M2Nn';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || typeof atob === 'function' ? (import.meta.env.VITE_MAPBOX_TOKEN || atob(MAP_FALLBACK)) : '';

mapboxgl.accessToken = MAPBOX_TOKEN;

const MAP_STYLES = {
  dark: {
    name: '3D Dark',
    url: 'mapbox://styles/mapbox/dark-v11'
  },
  streets: {
    name: '3D Streets',
    url: 'mapbox://styles/mapbox/streets-v12'
  },
  satellite: {
    name: '3D Satellite',
    url: 'mapbox://styles/mapbox/satellite-streets-v12'
  },
  outdoors: {
    name: '3D Terrain',
    url: 'mapbox://styles/mapbox/outdoors-v12'
  },
  light: {
    name: '3D Light',
    url: 'mapbox://styles/mapbox/light-v11'
  }
};

// Default locations for popular Indian destinations
const LOCATION_COORDS = {
  'goa': { center: [73.7737, 15.4925], zoom: 12 },
  'sinquerim': { center: [73.7737, 15.4925], zoom: 13 },
  'panjim': { center: [73.8278, 15.4989], zoom: 13 },
  'baga': { center: [73.751, 15.555], zoom: 13 },
  'rajasthan': { center: [73.8725, 26.9124], zoom: 10 },
  'jaipur': { center: [75.7873, 26.9124], zoom: 12 },
  'kerala': { center: [76.2711, 10.8505], zoom: 10 },
  'himachal': { center: [77.1734, 31.1048], zoom: 10 },
  'manali': { center: [77.1887, 32.2432], zoom: 13 },
  'kashmir': { center: [74.7973, 34.0837], zoom: 10 },
  'ladakh': { center: [77.5771, 34.1526], zoom: 10 },
  'uttarakhand': { center: [78.0322, 30.0668], zoom: 10 },
  'maharashtra': { center: [73.8567, 18.5204], zoom: 10 },
  'mumbai': { center: [72.8777, 19.0760], zoom: 12 },
  'karnataka': { center: [75.7139, 15.3173], zoom: 10 },
  'delhi': { center: [77.1025, 28.7041], zoom: 11 },
  'default': { center: [73.7737, 15.4925], zoom: 12 }
};

function getLocationCenter(activities) {
  // Try to derive center from activities
  const validActs = activities.filter(a => a.lat && a.lng);
  if (validActs.length > 0) {
    const avgLng = validActs.reduce((s, a) => s + a.lng, 0) / validActs.length;
    const avgLat = validActs.reduce((s, a) => s + a.lat, 0) / validActs.length;
    return { center: [avgLng, avgLat], zoom: 12 };
  }
  return LOCATION_COORDS['default'];
}

export default function TripMap({ activeDay, activities = [], onSelectPin, location }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const animationFrameRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const [currentStyle, setCurrentStyle] = useState('dark');
  const [is3DMode, setIs3DMode] = useState(true);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Add 3D Buildings Layer
  const add3DBuildings = useCallback((map) => {
    if (map.getLayer('3d-buildings')) return;

    const layers = map.getStyle().layers || [];
    let labelLayerId;
    for (const layer of layers) {
      if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
        labelLayerId = layer.id;
        break;
      }
    }

    try {
      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 13,
        paint: {
          'fill-extrusion-color': [
            'interpolate', ['linear'], ['get', 'height'],
            0, '#1E293B',
            50, '#334155',
            100, '#475569'
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.7
        }
      }, labelLayerId);
    } catch (err) {
      console.warn('[3D buildings notice]', err);
    }
  }, []);

  // Render Pins & Route for Active Day
  const renderActivities = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.loaded()) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove old route layers safely
    try {
      if (map.getLayer('route-glow')) map.removeLayer('route-glow');
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      if (map.getSource('route-source')) map.removeSource('route-source');
    } catch (e) {
      // Ignore cleanup errors
    }

    const dayActivities = activities.filter((a) => a.day === activeDay);
    const validActivities = dayActivities.length ? dayActivities : activities;
    const coordinates = [];

    validActivities.forEach((act, idx) => {
      if (!act.lat || !act.lng) return;
      const lngLat = [act.lng, act.lat];
      coordinates.push(lngLat);

      // Custom Marker Element
      const el = document.createElement('div');
      el.style.cssText = `
        width: 40px; height: 40px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
      `;

      // Color markers based on status
      const statusColor = act.status === 'active' ? '#34D399' 
        : act.status === 'disrupted' ? '#EF4444'
        : act.status === 'replaced' ? '#38BDF8' 
        : '#6C63FF';

      el.innerHTML = `
        <div style="
          background: linear-gradient(135deg, ${statusColor}, #38BDF8);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 14px;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 6px 20px rgba(108, 99, 255, 0.65), 0 0 12px rgba(56, 189, 248, 0.4);
          transition: transform 0.2s;
        ">${idx + 1}</div>
      `;
      el.addEventListener('mouseenter', () => {
        el.firstElementChild.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.firstElementChild.style.transform = 'scale(1)';
      });

      // Popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        maxWidth: '250px'
      }).setHTML(`
        <div style="font-family: 'Inter', sans-serif; padding: 6px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <h4 style="font-family: 'Syne', sans-serif; font-weight: 700; margin: 0; font-size: 14px; color: #1E293B;">
              ${act.title}
            </h4>
          </div>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 6px 0;">
            ${act.location || 'Goa'} · Rating ${act.rating || '4.8'}
          </p>
          <div style="background: #F1F5F9; padding: 6px 8px; border-radius: 8px; font-size: 11px; color: #334155;">
            <strong style="color: #6C63FF;">AI Reason:</strong> ${act.reason || 'Best match for your itinerary'}
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        if (onSelectPin) onSelectPin(act);
        map.flyTo({
          center: lngLat,
          zoom: 15,
          pitch: 60,
          bearing: map.getBearing() + 30,
          duration: 1200,
          essential: true
        });
      });

      markersRef.current.push(marker);
    });

    // Draw Route Line
    if (coordinates.length > 1) {
      try {
        map.addSource('route-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates }
          }
        });

        // Outer glow
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#6C63FF',
            'line-width': 8,
            'line-opacity': 0.35,
            'line-blur': 4
          }
        });

        // Core line
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#38BDF8',
            'line-width': 3.5,
            'line-dasharray': [2, 1.5]
          }
        });
      } catch (e) {
        console.warn('[Route layer notice]', e);
      }

      // Fit bounds
      const bounds = coordinates.reduce(
        (b, coord) => b.extend(coord),
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );
      map.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 80, right: 80 },
        pitch: is3DMode ? 55 : 0,
        bearing: -15,
        duration: 1400
      });
    } else if (coordinates.length === 1) {
      map.flyTo({ center: coordinates[0], zoom: 14, pitch: is3DMode ? 55 : 0, duration: 1200 });
    }
  }, [activeDay, activities, is3DMode, onSelectPin]);

  // Initialize Mapbox GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Ensure the container has explicit dimensions before initializing
    const container = mapContainerRef.current;
    if (container.clientHeight === 0) {
      container.style.height = '100%';
      container.style.minHeight = '400px';
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Determine initial center from activities or location prop
    const locData = getLocationCenter(activities);

    const map = new mapboxgl.Map({
      container: container,
      style: MAP_STYLES[currentStyle].url,
      center: locData.center,
      zoom: locData.zoom,
      pitch: 60,
      bearing: -15,
      antialias: true,
      projection: 'globe',
      fadeDuration: 0
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('error', (e) => {
      console.warn('[Mapbox Notice]', e?.error?.message || e);
    });

    map.on('style.load', () => {
      try {
        // Add 3D terrain
        if (!map.getSource('mapbox-dem')) {
          map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          });
          map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        }

        // Add sky atmosphere
        if (!map.getLayer('sky')) {
          map.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 0.0],
              'sky-atmosphere-sun-intensity': 15
            }
          });
        }

        // Add 3D buildings layer
        add3DBuildings(map);
      } catch (err) {
        console.warn('[Mapbox 3D setup notice]', err);
      }
    });

    map.on('load', () => {
      setIsMapReady(true);

      // Force multiple resizes to handle container dimension issues
      map.resize();
      setTimeout(() => { if (mapRef.current) mapRef.current.resize(); }, 100);
      setTimeout(() => { if (mapRef.current) mapRef.current.resize(); }, 300);
      setTimeout(() => { if (mapRef.current) mapRef.current.resize(); }, 600);
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
          renderActivities();
        }
      }, 800);
    });

    // Resize observer for container changes
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });
    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsMapReady(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render when day or activities change
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    // When activities change, fly to new location and re-render markers
    const locData = getLocationCenter(activities);
    
    renderActivities();
  }, [activeDay, activities, isMapReady, renderActivities]);

  // Style switcher
  const handleStyleChange = (styleKey) => {
    setCurrentStyle(styleKey);
    setShowStyleMenu(false);
    if (!mapRef.current) return;
    mapRef.current.setStyle(MAP_STYLES[styleKey].url);
    // style.load event handler will re-add 3D layers
    // Re-render activities after style loads
    mapRef.current.once('style.load', () => {
      setTimeout(() => renderActivities(), 300);
    });
  };

  // 3D toggle
  const toggle3DMode = () => {
    if (!mapRef.current) return;
    const next = !is3DMode;
    setIs3DMode(next);
    mapRef.current.easeTo({ pitch: next ? 60 : 0, bearing: next ? -20 : 0, duration: 1000 });
  };

  // Orbit camera
  const toggleOrbit = () => {
    if (!mapRef.current) return;
    const next = !isOrbiting;
    setIsOrbiting(next);
    if (next) {
      let bearing = mapRef.current.getBearing();
      const rotate = () => {
        if (!mapRef.current) return;
        bearing = (bearing + 0.15) % 360;
        mapRef.current.setBearing(bearing);
        animationFrameRef.current = requestAnimationFrame(rotate);
      };
      rotate();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Recenter
  const handleRecenter = () => {
    if (isMapReady && mapRef.current) {
      renderActivities();
    }
  };

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F172A]"
      style={{ height: '100%', minHeight: '450px' }}
    >
      {/* Map Canvas — absolute fill with explicit height */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 z-0" 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Loading overlay while map initializes */}
      {!isMapReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0F172A]">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-gray-400">Loading 3D Map...</span>
          </div>
        </div>
      )}

      {/* Top Control Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
        <div className="bg-[#0F172A]/90 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-xl flex items-center space-x-1">
          {/* 3D Toggle */}
          <button
            onClick={toggle3DMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-syne font-bold flex items-center space-x-1.5 transition-all ${
              is3DMode
                ? 'bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white shadow-md shadow-[#6C63FF]/30'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Active' : '2D View'}</span>
          </button>

          {/* Orbit */}
          <button
            onClick={toggleOrbit}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              isOrbiting ? 'bg-[#38BDF8] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isOrbiting ? 'animate-spin' : ''}`} />
          </button>

          {/* Recenter */}
          <button onClick={handleRecenter} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Style Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="bg-[#0F172A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold text-gray-200 hover:text-white flex items-center space-x-1.5 shadow-xl"
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{MAP_STYLES[currentStyle].name}</span>
          </button>

          {showStyleMenu && (
            <div className="absolute left-0 mt-2 w-44 bg-[#0F172A]/95 backdrop-blur-xl border border-white/15 rounded-xl p-1.5 shadow-2xl space-y-1 z-30">
              {Object.keys(MAP_STYLES).map((key) => (
                <button
                  key={key}
                  onClick={() => handleStyleChange(key)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs text-left font-medium flex items-center space-x-2 transition-all ${
                    currentStyle === key
                      ? 'bg-[#6C63FF]/30 text-[#38BDF8] border border-[#6C63FF]/40'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{MAP_STYLES[key].name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Badge */}
      <div className="absolute bottom-3 right-3 z-10 bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-[10px] font-mono text-gray-300 flex items-center space-x-1.5 shadow-md">
        <Sparkles className="w-3 h-3 text-[#34D399]" />
        <span>Mapbox 3D Engine • Live</span>
      </div>
    </div>
  );
}
