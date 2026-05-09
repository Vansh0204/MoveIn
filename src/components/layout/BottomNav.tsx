"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();

  if (pathname?.startsWith("/dashboard")) return null;

  const TABS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Map", icon: Map, href: "/map" },
    { label: "Saved", icon: Heart, href: "/saved", requireAuth: true },
    { label: "Profile", icon: User, href: "/profile", requireAuth: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 z-[150] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.02)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(64px + env(safe-area-inset-bottom))' }}>
      {TABS.map(tab => {
        const isActive = pathname === tab.href || (tab.href !== "/" && pathname?.startsWith(tab.href));
        const Icon = tab.icon;

        const handleClick = (e: React.MouseEvent) => {
          if (tab.requireAuth && !user) {
            e.preventDefault();
            openAuthModal();
          }
        };

        return (
          <Link 
            key={tab.label} 
            href={tab.href}
            onClick={handleClick}
            className={`flex flex-col items-center justify-center w-full min-h-[44px] relative active:scale-[0.97] transition-transform`}
            aria-label={tab.label}
          >
            <Icon 
              size={24} 
              strokeWidth={isActive ? 2.5 : 2} 
              className={`transition-colors duration-300 ${isActive ? 'text-brand-gold' : 'text-brand-ink/40'}`} 
            />
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 bg-brand-gold rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
