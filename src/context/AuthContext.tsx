"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "student" | "owner";
  savedStays: string[];
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string, role?: "student" | "owner") => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  toggleSaveStay: (id: string) => void;
  isAuthModalOpen: boolean;
  authMode: "student" | "owner";
  setAuthMode: (mode: "student" | "owner") => void;
  openAuthModal: (mode?: "student" | "owner") => void;
  closeAuthModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  updateUserRole: (role: "student" | "owner") => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supaUser: SupabaseUser): User {
  const meta = supaUser.user_metadata ?? {};
  
  // Check multiple metadata locations for the role
  const role = meta.role || supaUser.app_metadata?.role || "student";
  
  return {
    id: supaUser.id,
    name: meta.full_name ?? meta.name ?? supaUser.email?.split("@")[0] ?? "User",
    email: supaUser.email ?? "",
    avatarUrl: meta.avatar_url ?? meta.picture ?? undefined,
    role: (role === "owner" ? "owner" : "student") as "student" | "owner",
    savedStays: [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"student" | "owner">("student");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate session on mount & subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const mappedUser = session?.user ? mapSupabaseUser(session.user) : null;
      
      // If we have a session but no role in metadata, check localStorage
      if (session?.user && mappedUser && !session.user.user_metadata?.role) {
        const intendedRole = localStorage.getItem("intended_role") as "student" | "owner";
        if (intendedRole) {
          await supabase.auth.updateUser({
            data: { role: intendedRole }
          });
          mappedUser.role = intendedRole;
          localStorage.removeItem("intended_role");
        }
      }
      
      setUser(mappedUser);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (role: "student" | "owner" = "student") => {
    // Store intended role to apply after redirect if user is new
    if (typeof window !== "undefined") {
      localStorage.setItem("intended_role", role);
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) showToast("Google sign-in failed. Try again.");
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    showToast("Welcome back! 👋");
    setIsAuthModalOpen(false);
    return { error: null };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: "student" | "owner" = "student"
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: role } },
    });
    if (error) return { error: error.message };
    showToast("Account created! Check your email to verify. ✉️");
    setIsAuthModalOpen(false);
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    showToast("Signed out successfully.");
  };

  const toggleSaveStay = (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setUser((prev) => {
      if (!prev) return prev;
      const isSaved = prev.savedStays.includes(id);
      const updatedStays = isSaved
        ? prev.savedStays.filter((x) => x !== id)
        : [...prev.savedStays, id];
      setTimeout(() => showToast(isSaved ? "Removed from wishlist" : "Saved! ♥"), 50);
      return { ...prev, savedStays: updatedStays };
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateUserRole = async (role: "student" | "owner") => {
    const { error } = await supabase.auth.updateUser({
      data: { role }
    });
    if (!error) {
      setUser(prev => prev ? { ...prev, role } : null);
      showToast(`Role updated to ${role}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        toggleSaveStay,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal: (mode: "student" | "owner" = "student") => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        toastMessage,
        showToast,
        updateUserRole,
      }}
    >
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
