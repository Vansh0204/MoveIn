"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Heart, ChevronLeft, ChevronRight, X, CheckCircle2, Utensils, Wifi, ShieldCheck, Tv, Wind, Droplet, Dumbbell } from 'lucide-react';
import SafetyAudit from '@/components/safety/SafetyAudit';
import ReactGA from "react-ga4";

const StaticPropertyMap = dynamic(() => import('@/components/map/StaticPropertyMap'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-[24px]" /> 
});

const IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070",
  "https://images.unsplash.com/photo-1502672260266-1c1de2424107?q=80&w=1964",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
];

const AMENITIES = [
  { cat: "Meals & Kitchen", included: [{n: "3 Meals Daily", i: Utensils}, {n: "RO Water", i: Droplet}], excluded: [{n: "Shared Kitchen", i: Utensils}] },
  { cat: "Room Facilities", included: [{n: "Air Conditioning", i: Wind}, {n: "Study Table", i: Tv}], excluded: [] },
  { cat: "Bathroom", included: [{n: "Attached Washroom", i: Droplet}, {n: "Geyser", i: Flame}], excluded: [] },
  { cat: "Security", included: [{n: "24/7 CCTV", i: ShieldCheck}, {n: "Biometric Entry", i: ShieldCheck}], excluded: [] },
  { cat: "Connectivity", included: [{n: "High-speed WiFi", i: Wifi}], excluded: [] },
  { cat: "Recreation", included: [{n: "Common TV Room", i: Tv}], excluded: [{n: "Gym", i: Dumbbell}] }
];

// Helper to avoid missing Flame icon
function Flame(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
}

import { useAuth, type User } from '@/context/AuthContext';

interface BookingCardProps {
  isMobile?: boolean;
  user: User | null;
  openAuthModal: () => void;
  onBook: () => void;
  isBooked: boolean;
}

const BookingCard = ({ isMobile = false, user, openAuthModal, onBook, isBooked }: BookingCardProps) => (
  <div className={`bg-white ${isMobile ? '' : 'border border-black/5 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6'}`}>
    {!isMobile && (
      <>
        <div className="flex items-end mb-5">
          <span className="font-display text-[32px] font-bold text-brand-ink leading-none">₹8,500</span>
          <span className="text-[14px] text-brand-ink/60 font-medium ml-1.5 mb-1">/month</span>
        </div>
        
        <div className="space-y-2.5 mb-6 text-[13px] font-medium text-brand-ink/70 border-b border-black/5 pb-5">
          <div className="flex items-center"><CheckCircle2 size={16} className="text-[#2D7A4F] mr-2.5 shrink-0" /> <span className="pt-0.5">Meals included (Breakfast & Dinner)</span></div>
          <div className="flex items-center"><CheckCircle2 size={16} className="text-[#2D7A4F] mr-2.5 shrink-0" /> <span className="pt-0.5">High-speed WiFi (100Mbps)</span></div>
          <div className="flex items-center"><CheckCircle2 size={16} className="text-[#2D7A4F] mr-2.5 shrink-0" /> <span className="pt-0.5">Electricity & Water included</span></div>
        </div>
      </>
    )}

    <div className={`flex items-center space-x-2 mb-5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full w-fit ${isMobile ? 'mx-auto' : ''}`}>
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-bold uppercase tracking-wide">3 beds available</span>
    </div>

    <div className="space-y-3">
      {isBooked ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-[#E3EDE9] text-[#1D6B5A] font-bold py-4 rounded-full flex items-center justify-center space-x-2 border border-[#1D6B5A]/20"
        >
          <CheckCircle2 size={20} />
          <span>Request Sent!</span>
        </motion.div>
      ) : (
        <button 
          onClick={() => {
            if (!user) {
              openAuthModal();
            } else {
              onBook();
            }
          }}
          className="w-full bg-brand-gold text-brand-ink font-bold py-4 rounded-full hover:bg-brand-ink hover:text-white transition-all active:scale-95 shadow-sm"
        >
          Book a Visit
        </button>
      )}
      <button className="w-full flex items-center justify-center space-x-2 bg-transparent text-brand-ink/60 font-semibold py-3 hover:text-brand-ink hover:bg-gray-50 rounded-full transition-colors">
        <Heart size={18} />
        <span>Save to Wishlist</span>
      </button>
    </div>

    {!isMobile && (
      <div className="mt-6 space-y-3 text-[12px] font-medium text-center text-brand-ink/50 bg-gray-50 p-4 rounded-xl">
        <p className="flex items-center justify-center"><span className="text-brand-rust mr-1.5 text-sm">⚡</span> Usually responds in &lt; 2 hours</p>
        <p className="flex items-center justify-center"><span className="text-brand-teal mr-1.5 text-sm">🛡️</span> Free cancellation within 24 hours</p>
      </div>
    )}
  </div>
);

export default function PropertyDetailPage() {
  const { user, openAuthModal, showToast } = useAuth();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isMobileBookingOpen, setIsMobileBookingOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  const handleBook = () => {
    setIsBooked(true);
    showToast("Visit request sent successfully! The owner will contact you shortly.");
    ReactGA.event({ category: "User", action: "visit_booked", label: "The Hive Coliving" });
  };
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 450 && !showStickyHeader) setShowStickyHeader(true);
    if (latest <= 450 && showStickyHeader) setShowStickyHeader(false);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % IMAGES.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + IMAGES.length) % IMAGES.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const scrollToReviews = () => {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="bg-white min-h-screen pb-32 md:pb-12 relative">
      
      {/* Sticky Header */}
      <AnimatePresence>
        {showStickyHeader && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-brand-gold/20 z-50 shadow-sm hidden md:block"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-brand-ink leading-tight">The Hive Premium Coliving</h2>
                <div className="text-sm font-semibold text-brand-ink/60">₹8,500/month</div>
              </div>
              <button 
                onClick={() => {
                  if (!user) {
                    openAuthModal();
                  } else if (!isBooked) {
                    handleBook();
                  }
                }}
                className={`${isBooked ? 'bg-[#E3EDE9] text-[#1D6B5A]' : 'bg-brand-gold text-brand-ink'} font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-all flex items-center space-x-2`}
              >
                {isBooked ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Request Sent</span>
                  </>
                ) : (
                  <span>Book Visit</span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Gallery */}
      <div className="w-full max-w-6xl mx-auto md:px-6 md:pt-6 mb-8">
        
        {/* Mobile Swipeable Gallery */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory w-full h-[250px] sm:h-[350px] relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="absolute top-4 left-4 z-10 bg-[#2D7A4F] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-md">
            <span className="mr-1">✓</span> MoveIn Verified
          </div>
          {IMAGES.map((img, i) => (
            <div 
              key={i} 
              className="min-w-full h-full snap-center shrink-0 relative" 
              onClick={() => { setLightboxIndex(i); setIsLightboxOpen(true); }}
            >
              <Image src={img} alt={`Property ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority={i === 0} loading={i === 0 ? "eager" : "lazy"} />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                {i + 1} / {IMAGES.length}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid Gallery */}
        <div className="hidden md:grid relative rounded-[24px] overflow-hidden bg-gray-100 grid-cols-5 gap-2 h-[450px]">
          
          {/* Verified Badge */}
          <div className="absolute top-4 left-4 z-10 bg-[#2D7A4F] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-md">
            <span className="mr-1">✓</span> MoveIn Verified
          </div>

          <div 
            className="col-span-3 h-full relative cursor-pointer group"
            onClick={() => { setLightboxIndex(0); setIsLightboxOpen(true); }}
          >
            <Image src={IMAGES[0]} alt="Property Hero" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="60vw" priority loading="eager" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          
          <div className="flex flex-col col-span-2 gap-2 h-full">
            <div 
              className="h-1/2 relative cursor-pointer group overflow-hidden"
              onClick={() => { setLightboxIndex(1); setIsLightboxOpen(true); }}
            >
              <Image src={IMAGES[1]} alt="Property 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="40vw" loading="lazy" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div 
              className="h-1/2 relative cursor-pointer group overflow-hidden"
              onClick={() => { setLightboxIndex(2); setIsLightboxOpen(true); }}
            >
              <Image src={IMAGES[2]} alt="Property 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="40vw" loading="lazy" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>View all 12 photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12">
        
        {/* Left Column */}
        <div className="w-full md:w-[60%] lg:w-[65%] space-y-12">
          
          {/* Title Section */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-brand-ink text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">PG / Coliving</span>
              <span className="bg-gray-100 text-brand-ink text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Boys Hub</span>
            </div>
            
            <h1 className="font-display text-[32px] md:text-[40px] font-bold text-brand-ink leading-tight mb-4">
              The Hive Premium Coliving
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-brand-ink/70 mb-6">
              <div className="flex items-center space-x-1 cursor-pointer hover:underline" onClick={scrollToReviews}>
                <Star size={16} className="fill-brand-gold text-brand-gold" />
                <span className="font-bold text-brand-ink">4.8</span>
                <span>(24 reviews)</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <div className="flex items-center space-x-1">
                <MapPin size={16} className="text-brand-ink/50" />
                <span>Shivajinagar, Pune</span>
              </div>
            </div>

            {/* Prominent Walk Distance Card */}
            <div className="bg-[#E3EDE9] rounded-2xl p-4 flex items-center justify-between border border-[#1D6B5A]/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🚶‍♂️</span>
                </div>
                <div>
                  <div className="font-bold text-[#1D6B5A] text-lg">8 min walk to campus</div>
                  <div className="text-sm font-medium text-[#1D6B5A]/70">Just 650m from COEP main gate</div>
                </div>
              </div>
              <div className="hidden sm:block w-[100px] h-[60px] bg-white rounded-lg border border-[#1D6B5A]/20 overflow-hidden relative opacity-80 mix-blend-multiply">
                <div className="absolute inset-0 bg-[#1D6B5A]/10" />
                <MapPin size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1D6B5A]" />
              </div>
            </div>
          </section>

          <hr className="border-black/5" />

          {/* Safety Section */}
          <section>
            <SafetyAudit />
          </section>

          <hr className="border-black/5" />

          {/* Amenities Grid */}
          <section>
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-6">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
              {AMENITIES.map((category, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-4">{category.cat}</h3>
                  <div className="space-y-3">
                    {category.included.map((item, i) => {
                      const Icon = item.i;
                      return (
                        <div key={i} className="flex items-center space-x-3 text-brand-ink">
                          <Icon size={18} strokeWidth={2.5} className="text-brand-ink/70" />
                          <span className="font-medium text-sm">{item.n}</span>
                        </div>
                      )
                    })}
                    {category.excluded.map((item, i) => {
                      const Icon = item.i;
                      return (
                        <div key={i} className="flex items-center space-x-3 text-brand-ink/40">
                          <Icon size={18} strokeWidth={2} />
                          <span className="font-medium text-sm line-through decoration-black/20">{item.n}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-black/5" />

          {/* Map Section */}
          <section>
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-6">Location & Nearby</h2>
            <div className="w-full h-[300px] bg-gray-100 rounded-[24px] overflow-hidden border border-black/5 relative mb-6">
               <StaticPropertyMap propCoords={[18.5286, 73.8548]} collegeCoords={[18.5310, 73.8560]} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-black/5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">Nearest Grocery</div>
                <div className="font-bold text-brand-ink text-sm">Reliance Fresh • 200m</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-black/5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">Nearest Cafe</div>
                <div className="font-bold text-brand-ink text-sm">FC Road • 350m</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-black/5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-1">Transport</div>
                <div className="font-bold text-brand-ink text-sm">Auto Stand • 100m</div>
              </div>
            </div>
          </section>

          <hr className="border-black/5" />

          {/* Reviews Section */}
          <section id="reviews-section">
            <h2 className="font-display text-2xl font-bold text-brand-ink mb-6">Student Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 bg-brand-sand/50 p-6 rounded-2xl border border-brand-gold/10">
              <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-black/5 pb-6 md:pb-0 md:pr-8 flex flex-col justify-center">
                <div className="font-display text-6xl font-bold text-brand-ink mb-1">4.8</div>
                <div className="flex text-brand-gold mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} fill={i<=4 ? "currentColor" : "none"} size={18} />)}
                </div>
                <div className="text-sm font-semibold text-brand-ink/60">Based on 24 verified reviews</div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center space-y-2">
                {[5,4,3,2,1].map(star => (
                  <div key={star} className="flex items-center text-sm font-bold text-brand-ink/50">
                    <span className="w-3">{star}</span>
                    <Star size={12} className="mx-2" />
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-black/5">
                      <div className="h-full bg-brand-gold rounded-full" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : star === 3 ? '5%' : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2].map((_, i) => (
                <div key={i} className="bg-white border border-black/5 p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm">
                        AR
                      </div>
                      <div>
                        <div className="font-bold text-brand-ink text-sm">Aarav Reddy</div>
                        <div className="text-[12px] font-medium text-brand-ink/50">COEP Student • Stayed 1 year</div>
                      </div>
                    </div>
                    <div className="text-[12px] font-semibold text-brand-ink/40">12 Jan 2025</div>
                  </div>
                  <div className="flex text-brand-gold mb-3">
                    {[1,2,3,4,5].map(star => <Star key={star} fill="currentColor" size={14} className="mr-0.5" />)}
                  </div>
                  <p className="text-brand-ink/80 text-sm leading-relaxed">
                    &ldquo;Really loved the safety and hygiene here. The walk to campus is super short so I never needed an auto. Food is decent, but the WiFi speed is phenomenal for gaming and assignments. Highly recommend for freshers!&rdquo;
                  </p>
                </div>
              ))}
            </div>
            
            <button className="mt-8 font-bold text-brand-ink border-b-2 border-brand-ink pb-0.5 hover:text-brand-rust hover:border-brand-rust transition-colors">
              Show all 24 reviews
            </button>
          </section>

        </div>

        <div className="hidden md:block w-full md:w-[40%] lg:w-[35%] shrink-0">
          <div className="sticky top-28">
            <BookingCard user={user} openAuthModal={openAuthModal} onBook={handleBook} isBooked={isBooked} />
          </div>
        </div>
        
      </div>

      {/* Mobile Bottom Booking Bar */}
      <div className="md:hidden fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 bg-white border-t border-black/10 px-6 py-4 flex justify-between items-center z-[80] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div>
          <div className="font-display font-bold text-[24px] text-brand-ink leading-none">₹8,500</div>
          <div className="text-[12px] font-medium text-brand-ink/50 mt-1">/month</div>
        </div>
        <button 
          onClick={() => setIsMobileBookingOpen(true)}
          className="bg-brand-gold text-brand-ink font-bold px-8 py-3.5 rounded-full shadow-md active:scale-95 transition-transform"
        >
          Book Visit
        </button>
      </div>

      {/* Mobile Booking Bottom Sheet */}
      <AnimatePresence>
        {isMobileBookingOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileBookingOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] md:hidden"
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(e, info) => { if (info.offset.y > 100) setIsMobileBookingOpen(false) }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[210] p-6 pb-[max(env(safe-area-inset-bottom),24px)] md:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-t border-black/5"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <BookingCard isMobile={true} user={user} openAuthModal={openAuthModal} onBook={handleBook} isBooked={isBooked} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black flex items-center justify-center"
          >
            <button onClick={() => setIsLightboxOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 rounded-full p-2 z-10 active:scale-95 transition-transform">
              <X size={24} />
            </button>
            
            <button onClick={() => setLightboxIndex(i => (i - 1 + IMAGES.length) % IMAGES.length)} className="absolute left-4 text-white/50 hover:text-white p-4 z-10 active:scale-90 transition-transform">
              <ChevronLeft size={32} />
            </button>
            
            <motion.img 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={IMAGES[lightboxIndex]} 
              className="max-h-[85vh] max-w-[100vw] object-contain shadow-2xl" 
            />
            
            <button onClick={() => setLightboxIndex(i => (i + 1) % IMAGES.length)} className="absolute right-4 text-white/50 hover:text-white p-4 z-10 active:scale-90 transition-transform">
              <ChevronRight size={32} />
            </button>
            
            <div className="absolute bottom-6 font-medium text-white/70 tracking-widest text-sm z-10">
              {lightboxIndex + 1} / {IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
