"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Heart, User, Map, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-black/5 z-[150] flex items-center justify-between px-6 lg:px-12 transition-all">
      <Link href="/" className="font-display font-bold text-[28px] text-brand-ink flex items-center hover:opacity-80 transition-opacity">
        Move<span className="text-brand-gold italic">In</span>
      </Link>

      <div className="flex items-center space-x-6">
        <Link href="/map" className="text-sm font-bold text-brand-ink/60 hover:text-brand-ink hidden md:flex items-center transition-colors">
          <Map size={16} className="mr-1.5" /> Explore Map
        </Link>
        <Link href="/listings" className="text-sm font-bold text-brand-ink/60 hover:text-brand-ink hidden md:block transition-colors">All Stays</Link>
        {(!user || user.role !== "student") && (
          <button 
            onClick={() => {
              if (user) {
                router.push("/dashboard");
              } else {
                openAuthModal("owner");
              }
            }}
            className="text-[12px] font-bold px-4 py-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full hover:bg-brand-gold hover:text-brand-ink hidden lg:block transition-all active:scale-95"
          >
            List Your Stay
          </button>
        )}
        
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white hover:scale-105 transition-transform overflow-hidden"
            >
              {(user as { avatarUrl?: string }).avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(user as { avatarUrl?: string }).avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.substring(0, 2).toUpperCase()
              )}
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setIsDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-black/5 bg-gray-50/50">
                      <div className="font-bold text-brand-ink text-sm truncate">{user.name}</div>
                      <div className="text-[12px] font-medium text-brand-ink/50 truncate mt-0.5">{user.email}</div>
                    </div>
                    <div className="p-2 space-y-1">
                      {user.role !== "student" && (
                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-semibold text-brand-ink hover:bg-gray-50 rounded-xl transition-colors">
                          <LayoutDashboard size={16} className="mr-3 text-brand-ink/50" /> My Dashboard
                        </Link>
                      )}
                      <Link href="/saved" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-semibold text-brand-ink hover:bg-gray-50 rounded-xl transition-colors">
                        <Heart size={16} className="mr-3 text-brand-ink/50" /> Saved Stays
                      </Link>
                      <button className="w-full flex items-center px-3 py-2.5 text-sm font-semibold text-brand-ink hover:bg-gray-50 rounded-xl transition-colors">
                        <User size={16} className="mr-3 text-brand-ink/50" /> My Profile
                      </button>
                      <div className="h-px bg-black/5 my-1 mx-2" />
                      <button onClick={async () => { await logout(); setIsDropdownOpen(false); }} className="w-full flex items-center px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut size={16} className="mr-3 text-red-500" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button onClick={() => openAuthModal()} className="bg-brand-ink text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-brand-gold hover:text-brand-ink transition-all shadow-sm active:scale-95">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
