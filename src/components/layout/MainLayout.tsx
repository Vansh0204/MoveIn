"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className={`${!isDashboard ? "pt-20 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0" : ""}`}>
        {children}
      </div>
      {!isDashboard && <BottomNav />}
      <AuthModal />
    </>
  );
}
