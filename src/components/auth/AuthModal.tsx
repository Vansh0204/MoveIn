"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { COLLEGES } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function AuthModal() {
  const { isAuthModalOpen, authMode, setAuthMode, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail, showToast } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [gender, setGender] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShaking, setIsShaking] = useState(false);

  if (!isAuthModalOpen) return null;

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 8) return 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
    return 2;
  };

  const passStrength = getPasswordStrength(password);

  const handleBlur = (field: string) => {
    const newErrors = { ...errors };
    if (field === "email" && email && !validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      delete newErrors.email;
    }
    setErrors(newErrors);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
    setIsGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!email || !validateEmail(email)) newErrors.email = "Valid email is required";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (tab === "signup") {
      if (!name) newErrors.name = "Full name is required";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!agreeTerms) newErrors.terms = "You must agree to the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsLoading(true);

    if (tab === "signin") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrors({ form: error });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      } else {
        showToast("Welcome back! 👋");
        closeAuthModal();
      }
    } else {
      const { error } = await signUpWithEmail(email, password, name, authMode);
      if (error) {
        setErrors({ form: error });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      } else {
        showToast("Account created! Check your email to verify. ✉️");
        closeAuthModal();
      }
    }

    setIsLoading(false);
  };

  const switchTab = (t: "signin" | "signup") => {
    setTab(t);
    setErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-[8px]"
        onClick={closeAuthModal}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={isShaking ? { x: [-10, 10, -10, 10, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: isShaking ? 0.4 : 0.2 }}
        className="relative w-full max-w-[400px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-brand-ink/40 hover:text-brand-ink hover:bg-gray-100 p-1 rounded-full z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-black/5 relative shrink-0">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-4 text-sm font-bold capitalize transition-colors ${tab === t ? "text-brand-ink" : "text-brand-ink/40 hover:text-brand-ink/70"}`}
            >
              {t === "signin" ? "Sign In" : "Create Account"}
              {tab === t && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 h-0.5 bg-brand-gold w-1/2"
                  style={{ left: t === "signin" ? "0%" : "50%" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Role Toggle */}
        <div className="px-6 pt-6 shrink-0">
          <div className="bg-gray-100 p-1 rounded-[16px] flex relative">
            <button
              onClick={() => setAuthMode("student")}
              className={`flex-1 py-2.5 text-[13px] font-bold z-10 transition-colors ${authMode === "student" ? "text-brand-ink" : "text-brand-ink/40"}`}
            >
              Student
            </button>
            <button
              onClick={() => setAuthMode("owner")}
              className={`flex-1 py-2.5 text-[13px] font-bold z-10 transition-colors ${authMode === "owner" ? "text-brand-ink" : "text-brand-ink/40"}`}
            >
              Property Owner
            </button>
            <motion.div
              initial={false}
              animate={{ x: authMode === "student" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[12px] shadow-sm"
            />
          </div>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <h2 id="auth-modal-title" className="font-display text-[24px] font-bold text-brand-ink">
              {tab === "signin" 
                ? (authMode === "owner" ? "Owner Sign In" : "Welcome back") 
                : (authMode === "owner" ? "Join as Property Owner" : "Join MoveIn")}
            </h2>
            {authMode === "owner" && tab === "signup" && (
              <p className="text-[13px] text-brand-ink/50 mt-1 font-medium">Start listing your PG or Hostel today</p>
            )}
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-brand-gold/50 rounded-full py-3 shadow-sm hover:bg-brand-sand/30 transition-colors mb-6 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 size={20} className="animate-spin text-brand-ink/50" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="font-bold text-[14px] text-brand-ink">
              {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
            </span>
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-[11px] text-brand-ink/40 uppercase tracking-widest font-bold">or continue with email</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          {/* Form-level error */}
          {errors.form && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div>
                <input
                  type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-gray-50 border ${errors.name ? "border-red-500 bg-red-50" : "border-transparent focus:border-brand-gold focus:bg-white"} rounded-xl px-4 py-3.5 text-[15px] font-medium placeholder:text-brand-ink/40 outline-none transition-colors`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <input
                type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur("email")}
                className={`w-full bg-gray-50 border ${errors.email ? "border-red-500 bg-red-50" : "border-transparent focus:border-brand-gold focus:bg-white"} rounded-xl px-4 py-3.5 text-[15px] font-medium placeholder:text-brand-ink/40 outline-none transition-colors`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>}
            </div>

            {tab === "signup" && authMode === "student" && (
              <select
                value={collegeId} onChange={(e) => setCollegeId(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-brand-gold focus:bg-white rounded-xl px-4 py-3.5 text-[15px] font-medium text-brand-ink outline-none appearance-none transition-colors"
              >
                <option value="" disabled className="text-brand-ink/40">Select your college (optional)</option>
                {COLLEGES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} placeholder="Password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-gray-50 border ${errors.password ? "border-red-500 bg-red-50" : "border-transparent focus:border-brand-gold focus:bg-white"} rounded-xl px-4 py-3.5 text-[15px] font-medium placeholder:text-brand-ink/40 outline-none transition-colors`}
                  aria-invalid={!!errors.password}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-ink transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {tab === "signup" && password.length > 0 && (
                <div className="flex space-x-1 mt-2 px-1">
                  {[1, 2, 3].map((level) => (
                    <div key={level} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${passStrength >= level ? (passStrength === 1 ? "bg-red-500" : passStrength === 2 ? "bg-amber-500" : "bg-green-500") : "bg-gray-200"}`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>}
            </div>

            {tab === "signup" && (
              <div>
                <input
                  type={showPassword ? "text" : "password"} placeholder="Confirm password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-gray-50 border ${errors.confirmPassword ? "border-red-500 bg-red-50" : "border-transparent focus:border-brand-gold focus:bg-white"} rounded-xl px-4 py-3.5 text-[15px] font-medium placeholder:text-brand-ink/40 outline-none transition-colors`}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.confirmPassword}</p>}
              </div>
            )}

            {tab === "signup" && authMode === "student" && (
              <div className="pt-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-ink/40 mb-3 block">I&apos;m looking for</label>
                <div className="flex space-x-2">
                  {["Boys PG", "Girls PG", "Co-Ed"].map((g) => (
                    <button type="button" key={g} onClick={() => setGender(g)}
                      className={`px-4 py-2 rounded-full text-[12px] font-bold transition-colors ${gender === g ? "bg-brand-ink text-white shadow-md" : "bg-gray-100 text-brand-ink/60 hover:bg-gray-200"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "signin" && (
              <div className="flex justify-end pt-1">
                <a href="#" className="text-[12px] font-bold text-brand-gold hover:text-brand-ink transition-colors">Forgot password?</a>
              </div>
            )}

            {tab === "signup" && (
              <div className="flex items-start mt-4 pt-2">
                <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 mr-3 w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer" />
                <label htmlFor="terms" className="text-[12px] text-brand-ink/60 leading-tight font-medium cursor-pointer">
                  I agree to the <a href="#" className="text-brand-gold hover:underline">Terms of Service</a> and <a href="#" className="text-brand-gold hover:underline">Privacy Policy</a>
                </label>
              </div>
            )}
            {errors.terms && <p className="text-red-500 text-xs ml-7 font-medium">{errors.terms}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-gold text-brand-ink font-bold text-[15px] py-4 rounded-xl hover:bg-brand-ink hover:text-white transition-all shadow-md mt-6 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {tab === "signin" ? "Sign In →" : "Create My Account →"}
            </button>
          </form>

          <div className="text-center mt-6 space-y-4">
            {tab === "signin" ? (
              <p className="text-[14px] text-brand-ink/60 font-medium">
                New to MoveIn?{" "}
                <button onClick={() => switchTab("signup")} className="text-brand-gold font-bold hover:text-brand-ink transition-colors">Create account</button>
              </p>
            ) : (
              <p className="text-[14px] text-brand-ink/60 font-medium">
                Already have an account?{" "}
                <button onClick={() => switchTab("signin")} className="text-brand-gold font-bold hover:text-brand-ink transition-colors">Sign in</button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
