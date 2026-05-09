"use client";

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { COLLEGES } from '@/lib/constants';

interface Property {
  id: string;
  name: string;
  type: string;
  gender: string;
  price: number;
  priceUnit: string;
  area: string;
  collegeId: string;
  coords: { lat: number; lng: number };
  walkMinutes: number;
  walkDistance: string;
  safetyScore: number;
  isVerified: boolean;
  images: string[];
  rating: number;
}

// Data generation for properties
const MOCK_PROPERTIES: Property[] = Array.from({ length: 150 }).map((_, i) => {
  const college = COLLEGES[i % COLLEGES.length];
  // Add some random offset around the college (approx 0.5km to 3km)
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lngOffset = (Math.random() - 0.5) * 0.02;
  
  return {
    id: `prop-${i}`,
    name: i % 2 === 0 ? `The Hive ${i + 1}` : `Urban Stay ${i + 1}`,
    type: i % 3 === 0 ? 'PG' : 'Hostel',
    gender: i % 4 === 0 ? 'Boys' : i % 4 === 1 ? 'Girls' : 'Co-Ed',
    price: 8000 + (i * 500) % 7000,
    priceUnit: 'month',
    area: college.area,
    collegeId: college.id,
    coords: {
      lat: college.coords.lat + latOffset,
      lng: college.coords.lng + lngOffset
    },
    walkMinutes: 5 + Math.floor(Math.abs(latOffset) * 1000),
    walkDistance: `${5 + Math.floor(Math.abs(latOffset) * 1000)} min walk`,
    safetyScore: 65 + (i % 35),
    isVerified: i % 3 !== 0,
    images: ['https://via.placeholder.com/60'],
    rating: 4.0 + (i % 10) / 10
  };
});

// Create custom icons
const createCollegeIcon = (shortName: string) => {
  return L.divIcon({
    className: 'custom-college-marker',
    html: `
      <div class="w-12 h-12 bg-white rounded-full border-[3px] border-brand-gold shadow-lg flex items-center justify-center relative z-20 transition-transform hover:scale-110 cursor-pointer">
        <span class="font-display font-bold text-brand-ink text-sm">${shortName.substring(0, 3).toUpperCase()}</span>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

const createPropertyIcon = (price: number, isHovered: boolean, isSelected: boolean) => {
  const formattedPrice = `₹${(price / 1000).toFixed(1)}k`;
  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div class="transition-transform duration-300 ${isHovered || isSelected ? 'scale-110 z-30' : 'scale-100 z-10'}">
        <div class="px-2.5 py-1 ${isSelected ? 'bg-brand-gold text-brand-ink' : 'bg-brand-ink text-white'} rounded-full shadow-md font-body text-[11px] font-bold whitespace-nowrap border ${isSelected ? 'border-brand-gold' : 'border-white/20'} ${isHovered ? 'ring-2 ring-brand-gold/50' : ''}">
          ${formattedPrice}
        </div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

const ProximityRings = ({ center }: { center: [number, number] }) => {
  return (
    <>
      <Circle center={center} radius={1000} pathOptions={{ color: '#1D6B5A', fillColor: '#1D6B5A', fillOpacity: 0.1, weight: 1.5 }} className="proximity-ring">
        <Tooltip direction="right" permanent className="bg-transparent border-none shadow-none text-brand-teal font-bold text-xs" offset={[0, -10]}>Walking zone</Tooltip>
      </Circle>
      <Circle center={center} radius={1500} pathOptions={{ color: '#1D6B5A', fillColor: '#1D6B5A', fillOpacity: 0.05, weight: 1.5, dashArray: '4 4' }} className="proximity-ring">
        <Tooltip direction="right" permanent className="bg-transparent border-none shadow-none text-brand-teal font-bold text-xs" offset={[0, -10]}>Cycling zone</Tooltip>
      </Circle>
      <Circle center={center} radius={2000} pathOptions={{ color: '#1D6B5A', fillColor: 'transparent', weight: 1.5, dashArray: '4 4' }} className="proximity-ring">
        <Tooltip direction="right" permanent className="bg-transparent border-none shadow-none text-brand-teal font-bold text-xs" offset={[0, -10]}>Auto zone</Tooltip>
      </Circle>
    </>
  );
}

export default function MapClient({ initialCollegeId }: { initialCollegeId?: string }) {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>(['Co-Ed', 'Under ₹10k']);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.5204, 73.8567]);
  const [mapZoom, setMapZoom] = useState(13);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Handle initial college from props
  useEffect(() => {
    if (initialCollegeId) {
      const college = COLLEGES.find(c => c.id === initialCollegeId);
      if (college) {
        setSelectedCollege(college.id);
        setMapCenter([college.coords.lat, college.coords.lng]);
        setMapZoom(14);
      }
    }
  }, [initialCollegeId]);

  const [sheetState, setSheetState] = useState<'closed' | 'half' | 'full'>('closed');

  // Filter properties based on college
  const filteredProperties = useMemo(() => {
    if (!selectedCollege) return MOCK_PROPERTIES;
    return MOCK_PROPERTIES.filter(p => p.collegeId === selectedCollege);
  }, [selectedCollege]);

  const handleCollegeClick = (college: (typeof COLLEGES)[0]) => {
    setSelectedCollege(college.id);
    setMapCenter([college.coords.lat, college.coords.lng]);
    setMapZoom(14); // zoom in
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property.id);
    setMapCenter([property.coords.lat, property.coords.lng]);
    setMapZoom(16);
    // Scroll left panel to property
    const el = document.getElementById(`card-${property.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Bottom Sheet Variants
  const sheetVariants = {
    closed: { height: 72 },
    half: { height: "45vh" },
    full: { height: "85vh" }
  };

  const toggleSheetState = () => {
    if (sheetState === 'closed') setSheetState('half');
    else if (sheetState === 'half') setSheetState('full');
    else setSheetState('closed');
  };

  return (
    <>
      <style jsx global>{`
        .map-tiles {
          filter: grayscale(30%) contrast(0.9);
        }
        .custom-college-marker {
          background: transparent;
          border: none;
        }
        .custom-property-marker {
          background: transparent;
          border: none;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
        .proximity-ring {
          animation: expandRing 1.5s ease-out forwards;
          transform-origin: center;
        }
        @keyframes expandRing {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .pulse-marker {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(200, 169, 110, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(200, 169, 110, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(200, 169, 110, 0); }
        }
        /* Hide tooltips natively so only text shows */
        .leaflet-tooltip.bg-transparent {
          background: transparent;
          border: none;
          box-shadow: none;
        }
      `}</style>
      
      <div className="flex h-[100dvh] w-full relative bg-brand-sand overflow-hidden pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        
        {/* Desktop Left Panel */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div 
              initial={{ x: -380 }}
              animate={{ x: 0 }}
              exit={{ x: -380 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="hidden md:flex flex-col w-[380px] bg-white shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-20 h-full relative"
            >
              {/* Close Button Desktop */}
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="absolute top-20 -right-12 w-10 h-10 bg-white border border-black/5 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-30"
              >
                <X size={20} className="text-brand-ink/40" />
              </button>

              {/* Header */}
              <div className="p-6 border-b border-black/5 bg-white z-10 shrink-0 pt-24 relative">
                <h1 className="font-display text-2xl text-brand-ink mb-1">
                  {selectedCollege ? COLLEGES.find(c => c.id === selectedCollege)?.name : 'Pune Exploration'}
                </h1>
                <p className="text-sm font-medium text-brand-ink/60 mb-5">{filteredProperties.length} stays found</p>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.map(f => (
                <span key={f} className="inline-flex items-center bg-brand-sand text-brand-ink px-3 py-1.5 rounded-full text-[11px] font-bold">
                  {f}
                  <button className="ml-2 text-brand-ink/50 hover:text-brand-rust transition-colors" onClick={() => setFilters(filters.filter(x => x !== f))}><X size={12} /></button>
                </span>
              ))}
              <button className="inline-flex items-center text-brand-teal px-3 py-1.5 rounded-full text-[11px] font-bold border border-brand-teal/20 hover:bg-brand-teal/5 transition-colors">
                + Add Filter
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/40">Sort by</span>
              <button className="flex items-center text-sm font-semibold text-brand-ink/80 hover:text-brand-ink">
                Nearest first <ChevronDown size={14} className="ml-1" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
            {filteredProperties.map(property => (
              <div 
                key={property.id}
                id={`card-${property.id}`}
                onClick={() => handlePropertyClick(property)}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
                className={`flex gap-4 p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedProperty === property.id ? 'border-brand-gold bg-brand-gold/5 shadow-md' : 'border-black/5 hover:border-black/10 hover:bg-gray-50'}`}
              >
                <div className="w-[72px] h-[72px] rounded-xl bg-gray-200 shrink-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/30 to-brand-ink/20" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-brand-ink line-clamp-1 pr-2">{property.name}</h4>
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${property.safetyScore >= 80 ? 'bg-[#2D7A4F]' : 'bg-[#F59E0B]'}`} title={`Safety Score: ${property.safetyScore}`} />
                  </div>
                  <div className="font-display font-bold text-base text-brand-ink mb-1.5">₹{property.price.toLocaleString()} <span className="text-[10px] font-body text-brand-ink/50 font-normal">/mo</span></div>
                  <div className="text-[10px] text-[#1D6B5A] bg-[#E3EDE9] px-2 py-0.5 rounded-full inline-flex font-bold w-fit items-center">
                    <span className="mr-1">🚶</span> {property.walkDistance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Re-open Panel Button */}
    {!isPanelOpen && (
      <button 
        onClick={() => setIsPanelOpen(true)}
        className="hidden md:flex absolute top-24 left-6 z-[40] bg-white border border-black/5 rounded-full px-5 py-2.5 items-center space-x-2 shadow-lg hover:shadow-xl transition-all active:scale-95 font-bold text-sm text-brand-ink"
      >
        <span>Listings</span>
        <ChevronDown size={16} className="-rotate-90" />
      </button>
    )}

        {/* Map Area */}
        <div className="flex-1 h-full relative z-10 pt-20 md:pt-0">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="w-full h-full"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              className="map-tiles"
            />
            <MapController center={mapCenter} zoom={mapZoom} />

            {selectedCollege && (
              <ProximityRings center={[COLLEGES.find(c => c.id === selectedCollege)!.coords.lat, COLLEGES.find(c => c.id === selectedCollege)!.coords.lng]} />
            )}

            {COLLEGES.map(college => (
              <Marker 
                key={college.id}
                position={[college.coords.lat, college.coords.lng]}
                icon={createCollegeIcon(college.shortName)}
                eventHandlers={{
                  click: () => handleCollegeClick(college)
                }}
              >
                <Popup className="custom-popup" closeButton={false}>
                  <div className="p-2 min-w-[140px] text-center">
                    <h3 className="font-display font-bold text-base text-brand-ink mb-0.5">{college.shortName}</h3>
                    <p className="text-[11px] text-brand-ink/50 mb-2 font-medium">{college.studentCount.toLocaleString()} students</p>
                    <div className="bg-brand-teal/10 text-brand-teal text-[11px] font-bold py-1 px-2 rounded-lg">
                      {MOCK_PROPERTIES.filter(p => p.collegeId === college.id).length} verified stays
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={40}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom={true}
            >
              {filteredProperties.map(property => (
                <Marker
                  key={property.id}
                  position={[property.coords.lat, property.coords.lng]}
                  icon={createPropertyIcon(property.price, hoveredProperty === property.id, selectedProperty === property.id)}
                  eventHandlers={{
                    click: () => handlePropertyClick(property),
                    mouseover: () => setHoveredProperty(property.id),
                    mouseout: () => setHoveredProperty(null)
                  }}
                >
                  {/* Tooltip for property preview on hover could go here, but we use left panel instead */}
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>

          {/* Custom Minimal Attribution */}
          <div className="absolute top-24 right-4 md:bottom-4 md:top-auto md:right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-[10px] text-brand-ink/60 font-medium pointer-events-none">
            Map data © OpenStreetMap
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        <AnimatePresence>
          <motion.div
            className="md:hidden fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 bg-white z-[140] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border-t border-black/5"
            variants={sheetVariants}
            initial="closed"
            animate={sheetState}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.y, velocity.y);
              if (swipe < -1000) {
                // swiped up
                if (sheetState === 'closed') setSheetState('half');
                else if (sheetState === 'half') setSheetState('full');
              } else if (swipe > 1000) {
                // swiped down
                if (sheetState === 'full') setSheetState('half');
                else if (sheetState === 'half') setSheetState('closed');
              }
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Drag Handle Area */}
            <div 
              className="w-full pt-4 pb-2 flex justify-center items-center cursor-pointer bg-white z-10 shrink-0"
              onClick={toggleSheetState}
            >
              <div className="w-9 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Content Header (Visible even when collapsed) */}
            <div className="px-6 flex justify-between items-center shrink-0 pb-4 cursor-pointer" onClick={toggleSheetState}>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-brand-ink leading-tight">
                  {selectedCollege ? COLLEGES.find(c => c.id === selectedCollege)?.shortName : 'Pune'}
                </span>
                {sheetState === 'closed' && (
                  <span className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-wide">
                    {filteredProperties.length} stays · drag up
                  </span>
                )}
              </div>
              <span className="text-[13px] font-bold text-brand-teal bg-brand-teal/10 px-3 py-1.5 rounded-full">{filteredProperties.length} stays</span>
            </div>

            {/* List (scrollable) */}
            <div className={`flex-1 overflow-y-auto p-4 pt-0 space-y-3 ${sheetState === 'closed' ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`} style={{ WebkitOverflowScrolling: 'touch' }}>
              {filteredProperties.map(property => (
                <div 
                  key={property.id}
                  onClick={() => {
                    handlePropertyClick(property);
                    setSheetState('half'); 
                  }}
                  className={`flex gap-4 p-3 rounded-2xl border cursor-pointer active:scale-[0.98] transition-all ${selectedProperty === property.id ? 'border-brand-gold bg-brand-gold/5 shadow-md' : 'border-black/5 hover:bg-gray-50'}`}
                >
                  <div className="w-[60px] h-[60px] rounded-xl bg-gray-200 shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/30 to-brand-ink/20" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-[14px] text-brand-ink line-clamp-1 pr-2">{property.name}</h4>
                    </div>
                    <div className="font-display font-bold text-[15px] text-brand-ink mb-1">₹{property.price.toLocaleString()} <span className="text-[10px] font-body font-medium text-brand-ink/50">/mo</span></div>
                    <div className="text-[10px] text-[#1D6B5A] bg-[#E3EDE9] px-2 py-0.5 rounded-full inline-block font-bold w-fit">
                      🚶 {property.walkDistance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </>
  );
}

// Helper for swipe detection
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
