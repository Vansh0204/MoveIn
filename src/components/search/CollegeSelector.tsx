"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin } from "lucide-react";
import { COLLEGES } from "@/lib/constants";
import { College } from "@/types";

type SearchState = "default" | "open" | "searching" | "selected";

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a));
}

const modalVariants = {
  hidden: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
} as const;

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

export default function CollegeSelector() {
  const [state, setState] = useState<SearchState>("default");
  const [query, setQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const [nearbyCollege, setNearbyCollege] = useState<College | null>(null);
  const [showNearbyBanner, setShowNearbyBanner] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap helper
  useEffect(() => {
    if (state === "open" && inputRef.current) {
      inputRef.current.focus();
      setFocusedIndex(0);
    }
  }, [state]);

  // Nearby Detection
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let minDistance = Infinity;
          let nearest = null;

          COLLEGES.forEach(college => {
            const dist = getDistance(latitude, longitude, college.coords.lat, college.coords.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = college;
            }
          });

          if (nearest && minDistance < 15) { // Within 15km for Pune
            setNearbyCollege(nearest);
            setShowNearbyBanner(true);
          }
        },
        (error) => console.log("Geolocation error:", error)
      );
    }
  }, []);

  // Animated Count for Post-Selection
  useEffect(() => {
    if (state === "selected") {
      let start = 0;
      const end = 247;
      const duration = 800; // ms
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedCount(end);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [state]);

  const filteredColleges = COLLEGES.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.shortName.toLowerCase().includes(query.toLowerCase()) ||
    c.area.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (state !== "open") return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % filteredColleges.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + filteredColleges.length) % filteredColleges.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredColleges[focusedIndex]) {
        handleSelect(filteredColleges[focusedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setState(selectedCollege ? "selected" : "default");
    } else if (e.key === "Tab") {
      e.preventDefault();
      setFocusedIndex(prev => (e.shiftKey ? prev - 1 + filteredColleges.length : prev + 1) % filteredColleges.length);
    }
  };

  const handleSelect = (college: College) => {
    setSelectedCollege(college);
    setState("searching");
    
    setTimeout(() => {
      setState("selected");
      setTimeout(() => {
        router.push(`/listings?college=${college.id}`);
      }, 1500); // Allow time to see the count
    }, 800); // 0.8s for pulsing dots
  };

  return (
    <div className="w-full relative z-50">
      
      {/* Nearby Banner */}
      <AnimatePresence>
        {showNearbyBanner && nearbyCollege && state === "default" && !selectedCollege && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-14 left-0 right-0 mx-auto w-fit bg-brand-teal text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-3 text-sm z-40"
          >
            <MapPin size={16} />
            <span className="font-medium">
              Looks like you&apos;re near {nearbyCollege.shortName} area &mdash; 89 verified stays <span className="font-bold cursor-pointer" onClick={() => handleSelect(nearbyCollege)}>&rarr;</span>
            </span>
            <button 
              onClick={() => setShowNearbyBanner(false)}
              className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Dismiss nearby banner"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button / Selected State */}
      {state === "default" && (
        <button 
          onClick={() => setState("open")}
          className="w-full max-w-lg mx-auto bg-white border border-black/10 rounded-full py-4 px-6 flex items-center space-x-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-brand-gold/50 hover:shadow-[0_4px_20px_rgba(200,169,110,0.15)] transition-all group"
          aria-label="Open college selector"
        >
          <Search size={20} className="text-brand-ink/40 group-hover:text-brand-gold transition-colors" />
          <span className="text-brand-ink/50 font-medium text-lg">🎓 Which college are you going to?</span>
        </button>
      )}

      {state === "searching" && (
        <div className="w-full max-w-lg mx-auto bg-white border border-brand-gold/50 rounded-full py-4 px-6 flex items-center justify-center space-x-3 shadow-[0_4px_20px_rgba(200,169,110,0.15)]">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-brand-gold rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-brand-ink font-semibold">Searching stays near {selectedCollege?.shortName}...</span>
        </div>
      )}

      {state === "selected" && (
        <motion.button 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={() => router.push(`/listings?college=${selectedCollege?.id}`)}
          className="w-full max-w-lg mx-auto bg-brand-ink text-white rounded-full py-4 px-6 flex items-center justify-center space-x-2 shadow-lg hover:bg-black transition-colors"
        >
          <span className="font-medium">{animatedCount} verified stays near </span>
          <span className="font-semibold text-brand-gold">{selectedCollege?.shortName}</span>
          <motion.span 
            initial={{ x: -5 }} 
            animate={{ x: 0 }} 
            transition={{ type: "spring", stiffness: 300 }}
            className="ml-1"
          >
            &rarr;
          </motion.span>
        </motion.button>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {state === "open" && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="college-modal-title"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setState(selectedCollege ? "selected" : "default")}
            />

            {/* Modal Card */}
            <motion.div 
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onKeyDown={handleKeyDown}
              className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Search Header */}
              <div className="p-4 border-b border-black/5 relative">
                <Search size={20} className="absolute left-7 top-1/2 -translate-y-1/2 text-brand-ink/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setFocusedIndex(0);
                  }}
                  placeholder="Search college..."
                  className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20 transition-all font-medium text-brand-ink placeholder:text-brand-ink/40"
                  aria-label="Search college"
                />
                <button 
                  onClick={() => setState(selectedCollege ? "selected" : "default")}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-ink p-1 rounded-md"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* College List */}
              <div className="p-4 overflow-y-auto flex-1">
                <h3 id="college-modal-title" className="text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-3 px-2">
                  {query ? 'Search Results' : 'Popular Colleges in Pune'}
                </h3>
                
                {filteredColleges.length === 0 ? (
                  <div className="text-center py-8 text-brand-ink/50 font-medium">
                    No colleges found matching &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  <motion.div 
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {filteredColleges.map((college, idx) => {
                      const isFocused = idx === focusedIndex;
                      const isSelected = selectedCollege?.id === college.id;

                      return (
                        <motion.button
                          key={college.id}
                          variants={itemVariants}
                          onClick={() => handleSelect(college)}
                          onMouseEnter={() => setFocusedIndex(idx)}
                          className={`
                            relative text-left flex items-center p-3 rounded-xl border transition-all duration-200 w-full outline-none
                            ${isSelected 
                              ? 'bg-brand-gold/10 border-brand-gold shadow-sm' 
                              : isFocused 
                                ? 'bg-brand-sand/50 border-brand-gold/30 shadow-sm' 
                                : 'bg-white border-black/5 hover:border-black/10'
                            }
                          `}
                          aria-selected={isFocused}
                          role="option"
                        >
                          {/* Left: Circle Initials */}
                          <div 
                            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ backgroundColor: college.color }}
                          >
                            {college.shortName.substring(0, 2).toUpperCase()}
                          </div>
                          
                          {/* Center: Info */}
                          <div className="ml-3 flex-1 overflow-hidden">
                            <h4 className={`font-semibold text-[14px] truncate ${isSelected ? 'text-brand-ink' : 'text-brand-ink'}`}>
                              {college.shortName}
                            </h4>
                            <p className="text-[12px] text-brand-ink/50 truncate">
                              {college.area}
                            </p>
                          </div>

                          {/* Right: Badge or Check */}
                          <div className="ml-2 shrink-0">
                            {isSelected ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center text-white"
                              >
                                <motion.svg 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  className="w-4 h-4 stroke-current stroke-2"
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                >
                                  <motion.path
                                    d="M20 6L9 17l-5-5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </motion.svg>
                              </motion.div>
                            ) : (
                              <div className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-brand-ink/40 border border-gray-200">
                                ~{(Math.round(college.studentCount/1000))}k
                              </div>
                            )}
                          </div>

                          {/* Focus outline indicator */}
                          {isFocused && !isSelected && (
                            <motion.div 
                              layoutId="focus-ring"
                              className="absolute inset-0 rounded-xl border-2 border-brand-gold pointer-events-none"
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
