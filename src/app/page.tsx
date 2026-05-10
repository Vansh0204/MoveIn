"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { COLLEGES } from "@/lib/constants";
import { ChevronDown, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

// Helper components
const AnimatedHeadline = () => {
  const wordsLine1 = ["Find", "Your", "Home,"];
  const wordsLine2 = ["Near", "Your", "College."];

  return (
    <h1 className="font-display text-[40px] md:text-[64px] leading-tight text-white mb-6">
      {wordsLine1.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
      <br />
      {wordsLine2.map((word, i) => (
        <motion.em
          key={i + 3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (i + 3) * 0.05, duration: 0.6, ease: "easeOut" }}
          className="inline-block mr-3 text-brand-gold not-italic md:italic"
          style={{ fontStyle: 'italic' }}
        >
          {word}
        </motion.em>
      ))}
    </h1>
  );
};

const StatCounter = ({ endValue, prefix = "", suffix = "", label }: { endValue: number, prefix?: string, suffix?: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(endValue);
    }
  }, [isInView, motionValue, endValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <div ref={ref} className="flex flex-col md:items-center justify-center space-y-1">
      <div className="font-display text-3xl md:text-4xl text-white">
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div className="font-body text-[11px] uppercase tracking-wider text-brand-gold/60 font-medium">
        {label}
      </div>
    </div>
  );
};

export default function Home() {
  const [isSelectorExpanded, setIsSelectorExpanded] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);

  const selectedCollege = COLLEGES.find(c => c.id === selectedCollegeId);

  const previewCards = [
    { id: 1, name: "The Hive Coliving", price: "₹12,000", score: 95, distance: "5 min walk", rotation: -2, delay: 0.1, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800" },
    { id: 2, name: "Urban Stay PG", price: "₹8,500", score: 88, distance: "10 min walk", rotation: 0, delay: 0.2, image: "https://images.unsplash.com/photo-1502672260266-1c1de2424107?q=80&w=800" },
    { id: 3, name: "Premium Space", price: "₹15,000", score: 98, distance: "2 min walk", rotation: 2, delay: 0.3, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800" },
  ];

  return (
    <main className="min-h-[90vh] bg-brand-ink relative overflow-hidden flex flex-col justify-between pt-20 md:pt-0">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(200, 169, 110, 0.05) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Top Gradient for subtle glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex-1 flex flex-col md:flex-row items-center pt-10 pb-20 md:py-20">
        
        {/* Left Column (60%) */}
        <div className="w-full md:w-[60%] pr-0 md:pr-12 mb-16 md:mb-0">
          
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4 mb-8"
          >
            <div className="w-6 h-[24px] border-l-[2px] border-brand-gold flex items-center pl-4">
               <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                  PUNE&apos;S #1 STUDENT HOUSING PLATFORM
               </span>
            </div>
          </motion.div>

          <AnimatedHeadline />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-body font-light text-[17px] text-white/50 mb-10 max-w-md leading-relaxed"
          >
            Verified stays. Real distances. Zero scams. Built for students moving to Pune.
          </motion.p>

          {/* College Selector Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            layout
            className="bg-[#151412] border border-brand-gold/30 rounded-[20px] px-6 py-5 shadow-glow-gold max-w-lg mb-8"
          >
            {!selectedCollegeId || isSelectorExpanded ? (
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setIsSelectorExpanded(!isSelectorExpanded)}
              >
                <div className="flex items-center space-x-3 text-white">
                  <span className="text-xl">🎓</span>
                  <span className="font-body text-lg font-medium group-hover:text-brand-gold transition-colors">
                    {selectedCollegeId ? selectedCollege?.name : "Select your college"}
                  </span>
                </div>
                <motion.div 
                  animate={{ rotate: isSelectorExpanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <ChevronDown className="text-brand-gold/70" size={20} />
                </motion.div>
              </div>
            ) : null}

            <AnimatePresence>
              {(isSelectorExpanded || !selectedCollegeId) && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ opacity: { duration: 0.2 } }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 grid grid-cols-2 gap-3">
                    {COLLEGES.map((college) => (
                      <button
                        key={college.id}
                        onClick={() => {
                          setSelectedCollegeId(college.id);
                          setIsSelectorExpanded(false);
                        }}
                        className={`py-3 px-4 rounded-[8px] font-body text-sm font-medium transition-all duration-300 text-left truncate
                          ${selectedCollegeId === college.id 
                            ? 'bg-brand-gold text-brand-ink' 
                            : 'bg-brand-ink text-white/70 border border-white/5 hover:border-brand-gold/50 hover:text-white'
                          }`}
                      >
                        {college.shortName}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedCollegeId && !isSelectorExpanded && (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <Link 
                  href={`/listings?college=${selectedCollege?.id}`}
                  className="w-full mt-4 py-4 bg-brand-gold text-brand-ink rounded-[40px] font-body font-semibold flex items-center justify-center space-x-2 hover:bg-white transition-colors"
                >
                  <span>247 verified stays near {selectedCollege?.shortName}</span>
                  <span className="text-xl leading-none">→</span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4 text-white/60 font-body text-sm"
          >
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={16} className="text-brand-verified" />
              <span>Safety Verified</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={16} className="text-brand-verified" />
              <span>Real Distances</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={16} className="text-brand-verified" />
              <span>Zero Broker Fee</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column (40%) - Floating Cards (Desktop Stacked, Mobile Horizontal) */}
        <div className="w-full md:w-[40%] relative md:h-[500px] flex flex-col items-center justify-center mt-10 md:mt-0 -mx-6 md:mx-0 px-6 md:px-0">
          
          {/* Desktop Stacked Cards */}
          <div className="hidden md:block relative w-[280px] h-[340px]">
            {previewCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: i * 15, y: i * 20 }}
                transition={{ delay: 0.8 + card.delay, duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ y: (i * 20) - 8, scale: 1.02, zIndex: 10 }}
                style={{
                  rotate: card.rotation,
                  zIndex: previewCards.length - i,
                  willChange: 'transform'
                }}
                className="absolute top-0 left-0 w-full bg-[#1A1815] border border-white/5 rounded-[20px] overflow-hidden shadow-float hover:shadow-glow-gold transition-shadow duration-300"
              >
                <div className="h-40 relative overflow-hidden bg-brand-gold/5">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="280px"
                  />
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 bg-brand-ink/40 backdrop-blur-md px-2.5 py-1 rounded-[8px] flex items-center space-x-1 border border-white/10">
                    <MapPin size={12} className="text-brand-gold" />
                    <span className="text-[10px] text-white font-medium">{card.distance}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display text-white text-lg font-medium">{card.name}</h3>
                    <span className="font-body text-brand-gold font-semibold">{card.price}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-brand-verified/10 text-brand-verified px-2 py-1.5 rounded-[8px] w-fit">
                    <ShieldCheck size={14} />
                    <span className="text-xs font-bold">Safety Score: {card.score}/100</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Horizontal Scroll Cards */}
          <div className="md:hidden w-full overflow-x-auto flex space-x-4 pb-6 pt-2 snap-x snap-mandatory px-6 -ml-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {previewCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (i * 0.1), duration: 0.4 }}
                className="min-w-[260px] bg-[#1A1815] border border-white/5 rounded-[20px] overflow-hidden shadow-lg snap-center shrink-0"
              >
                <div className="h-36 relative overflow-hidden bg-brand-gold/5">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="260px"
                  />
                  <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 bg-brand-ink/40 backdrop-blur-md px-2.5 py-1 rounded-[8px] flex items-center space-x-1 border border-white/10">
                    <MapPin size={12} className="text-brand-gold" />
                    <span className="text-[10px] text-white font-medium">{card.distance}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display text-white text-lg font-medium">{card.name}</h3>
                    <span className="font-body text-brand-gold font-semibold">{card.price}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-brand-verified/10 text-brand-verified px-2 py-1.5 rounded-[8px] w-fit">
                    <ShieldCheck size={14} />
                    <span className="text-xs font-bold">Safety Score: {card.score}/100</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Stats Bar */}
      <div className="w-full bg-[#0A0908] border-t border-brand-gold/10 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <StatCounter endValue={1200} suffix="+" label="Verified Stays" />
            <StatCounter endValue={8} label="College Zones" />
            <StatCounter endValue={25} suffix="-Point" label="Safety Audit" />
            <StatCounter endValue={0} prefix="₹" label="Broker Fee" />
          </div>
        </div>
      </div>
    </main>
  );
}
