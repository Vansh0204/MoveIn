"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Map, List, SlidersHorizontal, ChevronDown, MapPinOff } from "lucide-react";
import PropertyCard, { PropertyCardProps } from "@/components/ui/PropertyCard";
import { COLLEGES } from "@/lib/constants";

// Mock Data Generator
const MOCK_PROPERTIES: PropertyCardProps['property'][] = Array.from({ length: 48 }).map((_, i) => ({
  id: `prop-${i}`,
  name: i % 2 === 0 ? `The Hive ${i + 1}` : `Urban Stay ${i + 1}`,
  type: i % 3 === 0 ? 'PG' : 'Hostel',
  gender: i % 4 === 0 ? 'Boys' : i % 4 === 1 ? 'Girls' : 'Co-Ed',
  price: 8000 + (i * 500) % 7000,
  priceUnit: 'month',
  area: COLLEGES[i % COLLEGES.length].area,
  college: COLLEGES[i % COLLEGES.length].shortName,
  walkMinutes: 5 + (i % 10),
  walkDistance: `${5 + (i % 10)} min walk`,
  safetyScore: 65 + (i % 35),
  isVerified: i % 3 !== 0,
  isFeatured: i % 7 === 0,
  amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'Cleaning'].slice(0, 3 + (i % 3)),
  images: [
    `https://images.unsplash.com/photo-${[
      '1522708323590-d24dbb6b0267',
      '1502672260266-1c1de2424107',
      '1497366216548-37526070297c',
      '1484154218962-a197022b5858',
      '1493663284031-b7e3aefcae8e'
    ][i % 5]}?q=80&w=800`
  ],
  reviewCount: 12 + (i * 3),
  rating: 4.0 + (i % 10) / 10
}));

const MapClient = dynamic(() => import("@/components/map/MapClient"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#E3EDE9] animate-pulse rounded-3xl" />
});

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const collegeParam = searchParams.get("college");

  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState<PropertyCardProps['property'][]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCollege, setActiveCollege] = useState<string | null>(collegeParam);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'safety'>('recommended');
  
  const handleCollegeChange = (id: string | null) => {
    setActiveCollege(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("college", id);
    } else {
      params.delete("college");
    }
    router.push(`/listings?${params.toString()}`, { scroll: false });
  };
  
  // Filter and Sort MOCK_PROPERTIES
  const allFilteredProperties = MOCK_PROPERTIES
    .filter(p => !activeCollege || p.college === COLLEGES.find(c => c.id === activeCollege)?.shortName)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'safety') return b.safetyScore - a.safetyScore;
      return 0;
    });

  useEffect(() => {
    // Reset when filter changes
    setPage(1);
    setProperties(allFilteredProperties.slice(0, 9));
    setHasMore(allFilteredProperties.length > 9);
  }, [activeCollege, allFilteredProperties]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  useEffect(() => {
    if (page > 1) {
      // Simulate API load
      const timer = setTimeout(() => {
        const nextProps = allFilteredProperties.slice((page - 1) * 9, page * 9);
        if (nextProps.length === 0 || properties.length + nextProps.length >= allFilteredProperties.length) {
          setHasMore(false);
        }
        setProperties(prev => [...prev, ...nextProps]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [page, allFilteredProperties, properties.length]);

  const toggleView = () => setView(v => v === 'grid' ? 'map' : 'grid');

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Sticky Top Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/5 pt-4 pb-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button className="flex items-center space-x-2 bg-brand-ink text-white px-4 py-2 rounded-full text-sm font-medium shrink-0">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
            <div className="h-6 w-px bg-black/10 shrink-0 mx-1" />
            {['All', 'Boys', 'Girls', 'Co-Ed'].map(gender => (
              <button key={gender} className={`px-4 py-2 rounded-full border border-black/10 text-sm font-medium shrink-0 transition-colors ${gender === 'All' ? 'bg-brand-ink text-white' : 'text-brand-ink hover:bg-gray-50'}`}>
                {gender}
              </button>
            ))}
            <div className="h-6 w-px bg-black/10 shrink-0 mx-1" />
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full border border-black/10 text-sm font-medium text-brand-ink hover:bg-gray-50 shrink-0 transition-colors">
              <span>Price Range</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between md:justify-end space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-brand-ink shrink-0 hover:bg-gray-50 rounded-full transition-colors">
                <span>Sort by: {sortBy === 'recommended' ? 'Recommended' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Safety Score'}</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-black/5 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                {[
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'safety', label: 'Safety Score' }
                ].map(option => (
                  <button 
                    key={option.id}
                    onClick={() => setSortBy(option.id as 'recommended' | 'price-low' | 'price-high' | 'safety')}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-colors ${sortBy === option.id ? 'bg-brand-sand text-brand-ink font-bold' : 'text-brand-ink/60 hover:bg-gray-50'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={toggleView}
              className="flex items-center space-x-2 bg-brand-sand text-brand-ink px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-brand-gold/20 shrink-0"
            >
              {view === 'grid' ? <Map size={16} /> : <List size={16} />}
              <span>{view === 'grid' ? 'Map View' : 'List View'}</span>
            </button>
          </div>
        </div>
        
        {/* College Chips */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-4 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-ink/40 mr-2 shrink-0">Colleges:</span>
          {COLLEGES.map(college => (
            <button 
              key={college.id}
              onClick={() => handleCollegeChange(activeCollege === college.id ? null : college.id)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold shrink-0 transition-all ${
                activeCollege === college.id 
                ? 'bg-brand-teal text-white shadow-md' 
                : 'bg-white border border-black/10 text-brand-ink/70 hover:border-brand-teal hover:text-brand-teal'
              }`}
            >
              {college.shortName}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-32 md:pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-[28px] md:text-4xl text-brand-ink mb-2 leading-tight">
            Stays near {activeCollege ? COLLEGES.find(c => c.id === activeCollege)?.name : 'Pune'}
          </h1>
          <p className="font-body text-brand-ink/60 font-medium">Showing {allFilteredProperties.length} verified properties matching your preferences.</p>
        </div>

        {properties.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-black/5 text-center px-4 shadow-sm">
            <div className="w-20 h-20 bg-brand-rust/10 rounded-full flex items-center justify-center mb-6">
              <MapPinOff size={32} className="text-brand-rust" />
            </div>
            <h3 className="font-display text-2xl font-bold text-brand-ink mb-2">No stays found</h3>
            <p className="font-body text-brand-ink/60 max-w-md mx-auto mb-8 font-medium">
              We couldn&apos;t find any properties near {activeCollege ? COLLEGES.find(c => c.id === activeCollege)?.name : 'your location'} matching your current filters.
            </p>
            <button 
              onClick={() => setActiveCollege(null)}
              className="bg-brand-ink text-white px-8 py-3.5 rounded-full font-bold font-body hover:bg-black transition-colors active:scale-[0.97]"
            >
              Adjust Filters
            </button>
          </div>
        ) : (
          /* Grid View */
          <div className="flex gap-8 relative">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ${view === 'map' ? 'lg:w-[60%]' : ''}`}>
              {properties.map((property, index) => {
                if (index === properties.length - 1) {
                  return (
                    <div ref={lastElementRef} key={property.id}>
                      <PropertyCard property={property} />
                    </div>
                  );
                }
                return <PropertyCard key={property.id} property={property} />;
              })}
              
              {hasMore && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-10 flex justify-center">
                  <div className="w-8 h-8 border-4 border-brand-sand border-t-brand-gold rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Map View Desktop Sidebar */}
            {view === 'map' && (
              <div className="hidden lg:block lg:w-[40%] sticky top-[180px] h-[calc(100vh-200px)] rounded-3xl overflow-hidden border border-black/10 shadow-sm">
                <MapClient initialCollegeId={activeCollege || undefined} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Floating Map View Pill Button */}
      <div className="md:hidden fixed bottom-[90px] left-0 right-0 flex justify-center z-[140] pointer-events-none">
        <button 
          onClick={() => window.location.href = '/map'}
          className="pointer-events-auto bg-brand-gold text-brand-ink px-6 py-3.5 rounded-full shadow-xl flex items-center space-x-2 font-bold active:scale-[0.97] transition-transform"
        >
          <Map size={18} strokeWidth={2.5} />
          <span>Map View</span>
        </button>
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sand border-t-brand-gold rounded-full animate-spin" />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
