"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type User = {
  name: string;
  email: string;
  collegeId?: string;
  savedStays: string[];
};

type AuthContextType = {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  toggleSaveStay: (id: string) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const login = (email: string, name: string) => {
    setUser({ name, email, savedStays: [] });
  };

  const logout = () => {
    setUser(null);
  };

  const toggleSaveStay = (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setUser(prev => {
      if (!prev) return prev;
      const isSaved = prev.savedStays.includes(id);
      return {
        ...prev,
        savedStays: isSaved ? prev.savedStays.filter(x => x !== id) : [...prev.savedStays, id]
      };
    });
    // Let state update settle before showing toast logic
    setTimeout(() => {
        if (!user.savedStays.includes(id)) {
            showToast("Saved! ♥");
        } else {
            showToast("Removed from wishlist");
        }
    }, 50);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, toggleSaveStay,
      isAuthModalOpen, openAuthModal: () => setIsAuthModalOpen(true), closeAuthModal: () => setIsAuthModalOpen(false),
      toastMessage, showToast
    }}>
      {children}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-brand-ink text-white px-6 py-3.5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center z-[500]"
          >
            <span className="font-semibold text-[15px]">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
