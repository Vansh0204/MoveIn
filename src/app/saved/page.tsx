"use client";

import { useAuth } from "@/context/AuthContext";
import { HeartCrack, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[80vh] bg-brand-sand flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-[24px] shadow-xl border border-black/5 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2 text-brand-ink">Please sign in</h2>
          <p className="text-brand-ink/60 font-medium mb-8">You need to sign in to view your personalized wishlist and saved stays.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 bg-brand-sand">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display text-[32px] md:text-[40px] font-bold text-brand-ink mb-2">Saved Stays</h1>
        <p className="text-brand-ink/60 font-medium mb-10">You have {user.savedStays.length} saved properties.</p>
        
        {user.savedStays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[24px] border border-black/5 text-center px-4 shadow-sm">
            <div className="w-24 h-24 bg-brand-rust/5 rounded-full flex items-center justify-center mb-6 border border-brand-rust/10">
              <HeartCrack size={36} className="text-brand-rust" />
            </div>
            <h3 className="font-display text-2xl font-bold text-brand-ink mb-3">No saved stays yet</h3>
            <p className="font-body text-brand-ink/60 max-w-md mx-auto mb-8 font-medium">
              Explore our verified properties and click the heart icon to save your favorites here for easy comparison.
            </p>
            <Link href="/listings" className="bg-brand-ink text-white px-8 py-3.5 rounded-full font-bold hover:bg-brand-gold hover:text-brand-ink transition-all shadow-md flex items-center space-x-2">
              <span>Explore Stays</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Mock implementation of saved cards using placeholder since we don't have a global MOCK_PROPERTIES export */}
             {user.savedStays.map(id => (
               <div key={id} className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-black/5 hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300 group">
                 <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/30 to-brand-ink/20" />
                   <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                   </div>
                 </div>
                 <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-brand-ink group-hover:text-brand-gold transition-colors">Property {id}</h3>
                     <span className="font-bold text-brand-ink">₹8.5k<span className="text-[10px] text-brand-ink/50 font-normal">/mo</span></span>
                   </div>
                   <div className="text-sm font-medium text-brand-ink/60 mb-4 flex items-center">
                     <span className="w-2 h-2 rounded-full bg-[#2D7A4F] mr-2" />
                     Verified Co-Living
                   </div>
                   <Link href={`/listings/${id}`} className="block w-full text-center bg-gray-50 border border-black/5 text-brand-ink font-bold py-2.5 rounded-xl hover:bg-brand-ink hover:text-white transition-colors">
                     View Details
                   </Link>
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
