"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LucideIcon, Heart, MapPin, Star, Wifi, AirVent, Utensils, WashingMachine, Sparkles, Shield, Dumbbell, Zap, Tv, Car } from "lucide-react";

export interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    type: 'PG' | 'Hostel' | 'Co-Living' | 'Apartment';
    gender: 'Boys' | 'Girls' | 'Co-Ed';
    price: number;
    priceUnit: 'month';
    area: string;
    college: string;
    walkMinutes: number;
    walkDistance: string;
    safetyScore: number; // 0-100
    isVerified: boolean;
    isFeatured?: boolean;
    amenities: string[];
    images: string[];
    reviewCount: number;
    rating: number;
  };
  variant?: 'grid' | 'map-popup' | 'featured';
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

const amenityIconMap: Record<string, LucideIcon> = {
  'WiFi': Wifi,
  'AC': AirVent,
  'Meals': Utensils,
  'Laundry': WashingMachine,
  'Cleaning': Sparkles,
  'Security': Shield,
  'Gym': Dumbbell,
  'Power': Zap,
  'TV': Tv,
  'Parking': Car
};

export default function PropertyCard({ property, variant = 'grid', onSave, isSaved = false }: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (onSave) onSave(property.id);
  };

  const getGradient = () => {
    if (property.isVerified) return "from-brand-teal/40 to-brand-teal/80";
    if (property.isFeatured) return "from-brand-gold/40 to-brand-gold/80";
    return "from-gray-200 to-gray-300";
  };

  const getSafetyColor = (score: number) => {
    if (score >= 80) return "#2D7A4F"; // Green
    if (score >= 60) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const safetyColor = getSafetyColor(property.safetyScore);

  const displayAmenities = property.amenities.slice(0, 4);
  const extraAmenitiesCount = property.amenities.length - 4;

  return (
    <div 
      className={`group relative bg-white border border-black/5 rounded-[20px] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[5px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] cursor-pointer flex flex-col ${variant === 'map-popup' ? 'w-[280px]' : 'w-full'}`}
    >
      {/* Image Area */}
      <div className="relative h-[200px] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} transition-transform duration-500 group-hover:scale-105`} />
        
        {/* Top Left Badge */}
        {property.isVerified && (
          <div className="absolute top-3 left-3 bg-[#2D7A4F] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-10">
            <span className="mr-1">✓</span> MoveIn Verified
          </div>
        )}
        
        {/* Top Right Badge */}
        <div className="absolute top-3 right-3 bg-white text-brand-ink text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
          {property.gender === 'Boys' ? 'Boys Hub' : property.gender === 'Girls' ? 'Girls Hub' : 'Co-Ed'}
        </div>

        {/* Bottom Right Save Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
        >
          <motion.div animate={{ scale: saved ? 1.2 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Heart size={16} className={saved ? "fill-brand-gold text-brand-gold" : "text-brand-ink/70"} />
          </motion.div>
        </motion.button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Row 1 */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-body text-[14px] font-semibold text-brand-ink line-clamp-1 flex-1 pr-2">{property.name}</h3>
          <div className="flex items-center text-[12px] text-brand-ink/60 whitespace-nowrap">
            <Star size={12} className="fill-brand-gold text-brand-gold mr-1" />
            <span className="font-medium text-brand-ink">{property.rating.toFixed(1)}</span>
            <span className="mx-1">·</span>
            <span>{property.reviewCount} reviews</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center text-[12px] text-brand-ink/60 mb-3">
          <MapPin size={12} className="mr-1 shrink-0" />
          <span className="line-clamp-1">{property.area} • Near {property.college}</span>
        </div>

        {/* Walk Distance Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center bg-[#E3EDE9] text-[#1D6B5A] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <span className="mr-1.5 text-[12px]">🚶</span> {property.walkMinutes} min walk
          </div>
        </div>

        {/* Safety Score */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-brand-ink/50 font-bold">Safety Score</span>
            <span className="text-[11px] font-bold" style={{ color: safetyColor }}>{property.safetyScore}/100</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${property.safetyScore}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: safetyColor }}
            />
          </div>
        </div>

        <div className="mt-auto">
          {/* Price & CTA Row */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="font-display text-[20px] font-bold text-brand-ink">₹{property.price.toLocaleString()}</span>
              <span className="text-[12px] text-brand-ink/50 font-medium ml-1">/{property.priceUnit}</span>
            </div>
            <button className="text-[13px] font-semibold text-brand-ink/70 hover:text-brand-ink hover:bg-brand-gold px-3 py-1.5 rounded-full transition-colors group/btn flex items-center">
              Book Visit <span className="ml-1 group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Amenities Row */}
          <div className="flex items-center gap-1.5 pt-3 border-t border-black/5">
            {displayAmenities.map((amenity, i) => {
              const Icon = amenityIconMap[amenity] || Sparkles;
              return (
                <div key={i} className="bg-gray-50 border border-gray-100 p-1.5 rounded-md text-brand-ink/60" title={amenity}>
                  <Icon size={14} strokeWidth={2.5} />
                </div>
              );
            })}
            {extraAmenitiesCount > 0 && (
              <div className="text-[10px] font-bold text-brand-ink/50 ml-1">
                +{extraAmenitiesCount} more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
