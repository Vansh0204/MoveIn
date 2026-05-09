"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Shield, 
  Droplet, 
  Flame, 
  Users, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Camera, 
  IdCard, 
  Download 
} from "lucide-react";

type SafetyItem = { name: string; passed: boolean; note?: string };
type SafetyCategory = { id: string; name: string; icon: React.ElementType; items: SafetyItem[] };

const SAFETY_DATA: SafetyCategory[] = [
  {
    id: "structural",
    name: "Structural Safety",
    icon: Home,
    items: [
      { name: "Building stability verified", passed: true },
      { name: "No water seepage", passed: true },
      { name: "Proper ventilation", passed: true },
      { name: "Clean common areas", passed: true },
      { name: "Working lifts/stairs", passed: true, note: "Lift serviced monthly" },
    ]
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    items: [
      { name: "24/7 security guard", passed: true, note: "2 guards per shift" },
      { name: "CCTV cameras", passed: true, note: "CCTV installed at entry, stairs, parking" },
      { name: "Secure main gate", passed: true },
      { name: "Visitor log system", passed: false, note: "Currently using manual register, upgrading to app" },
      { name: "Emergency contacts posted", passed: true },
    ]
  },
  {
    id: "hygiene",
    name: "Hygiene & Facilities",
    icon: Droplet,
    items: [
      { name: "Clean washrooms", passed: true },
      { name: "Regular pest control", passed: true, note: "Done every 3 months" },
      { name: "Garbage disposal", passed: true },
      { name: "Clean water supply", passed: true, note: "RO filter checked weekly" },
      { name: "Functional geysers", passed: false, note: "1 geyser under repair on 2nd floor" },
    ]
  },
  {
    id: "fire",
    name: "Fire Safety",
    icon: Flame,
    items: [
      { name: "Fire extinguisher", passed: true },
      { name: "Smoke detectors", passed: false, note: "Planned for installation next month" },
      { name: "Emergency exits marked", passed: true },
      { name: "No fire hazards", passed: true },
      { name: "Electrical safety", passed: true },
    ]
  },
  {
    id: "womens",
    name: "Women's Safety",
    icon: Users,
    items: [
      { name: "Women-only floors/wings", passed: true },
      { name: "Internal locks", passed: true },
      { name: "Female caretaker", passed: true, note: "Available 24/7 on premises" },
      { name: "Well-lit corridors", passed: true },
      { name: "Emergency buzzer", passed: true },
    ]
  }
];

export default function SafetyAudit() {
  const [expandedCats, setExpandedCats] = useState<string[]>(['security']); // Default open one

  const totalChecks = SAFETY_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
  const passedChecks = SAFETY_DATA.reduce((acc, cat) => acc + cat.items.filter(i => i.passed).length, 0);
  const score = Math.round((passedChecks / totalChecks) * 100);

  const getScoreColor = (s: number) => {
    if (s >= 85) return "#22c55e"; // Green
    if (s >= 65) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const scoreColor = getScoreColor(score);
  
  // SVG Circle calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10 p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
        
        {/* Score Indicator */}
        <div className="flex flex-col items-center">
          <div className="relative w-[120px] h-[120px]">
            <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
              {/* Background Circle */}
              <circle
                cx="60" cy="60" r={radius}
                fill="transparent"
                stroke="#F3F4F6"
                strokeWidth="8"
              />
              {/* Foreground Animated Circle */}
              <motion.circle
                cx="60" cy="60" r={radius}
                fill="transparent"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
              <div className="flex items-baseline">
                <span className="font-display text-[32px] font-bold text-brand-ink leading-none">{score}</span>
                <span className="text-[12px] font-medium text-brand-ink/50 ml-0.5">/100</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[12px] font-bold text-[#22c55e] flex items-center bg-[#22c55e]/10 px-2.5 py-1 rounded-full">
            <span>MoveIn Verified</span>
            <CheckCircle2 size={12} className="ml-1" />
          </div>
        </div>

        {/* Score Breakdown Summary */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-3">Comprehensive Safety Audit</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start text-brand-ink">
              <CheckCircle2 size={18} className="text-[#22c55e] mr-2" />
              <span className="font-medium">{passedChecks} of {totalChecks} checks passed</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-brand-ink/60 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-ink/20 mr-2" />
              Audited 12 Jan 2025
            </div>
            <div className="flex items-center justify-center md:justify-start text-brand-ink/60 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-ink/20 mr-2" />
              by <span className="font-semibold text-brand-ink ml-1">MoveIn Safety Team</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCORDION BREAKDOWN (Desktop) */}
      <h3 className="hidden md:block font-body text-sm font-bold uppercase tracking-wider text-brand-ink/50 mb-4 px-2">
        Category Breakdown
      </h3>
      <div className="hidden md:block space-y-3 mb-10">
        {SAFETY_DATA.map(category => {
          const isExpanded = expandedCats.includes(category.id);
          const catPassed = category.items.filter(i => i.passed).length;
          const catTotal = category.items.length;
          const catColor = getScoreColor((catPassed / catTotal) * 100);
          const Icon = category.icon;

          return (
            <div key={category.id} className="bg-white border border-black/5 rounded-[12px] overflow-hidden transition-shadow hover:shadow-sm">
              <button 
                onClick={() => toggleCategory(category.id)}
                className="w-full p-4 flex items-center justify-between bg-white z-10 relative"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-sand flex items-center justify-center text-brand-ink/70">
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-brand-ink text-[15px]">{category.name}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Mini Progress Bar */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: catColor }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(catPassed / catTotal) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: catColor }}>
                      {catPassed}/{catTotal}
                    </span>
                  </div>
                  
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-brand-ink/40">
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1">
                      <div className="border-t border-black/5 pt-3 space-y-2">
                        {category.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-start p-3 rounded-lg transition-colors ${
                              item.passed ? 'bg-green-50/50' : 'bg-red-50/50'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {item.passed 
                                ? <CheckCircle2 size={16} className="text-green-600" /> 
                                : <XCircle size={16} className="text-red-500" />
                              }
                            </div>
                            <div className="ml-3 flex-1">
                              <span className={`text-[14px] font-medium ${
                                item.passed ? 'text-green-800' : 'text-red-700 line-through opacity-80'
                              }`}>
                                {item.name}
                              </span>
                              {item.note && (
                                <p className={`text-[12px] mt-0.5 ${
                                  item.passed ? 'text-green-700/70' : 'text-red-600/80'
                                }`}>
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* HORIZONTAL TABS (Mobile) */}
      <div className="md:hidden mb-10">
        <h3 className="font-body text-sm font-bold uppercase tracking-wider text-brand-ink/50 mb-4 px-2">
          Category Breakdown
        </h3>
        <div className="flex overflow-x-auto space-x-2 pb-4 snap-x px-2 -mx-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SAFETY_DATA.map(category => (
            <button 
              key={category.id} 
              onClick={() => {
                if (!expandedCats.includes(category.id)) {
                  setExpandedCats([category.id]);
                }
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-[13px] font-bold snap-start transition-colors border ${expandedCats.includes(category.id) ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white text-brand-ink/70 border-black/10'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="bg-white border border-black/5 rounded-[16px] overflow-hidden">
          {SAFETY_DATA.filter(c => expandedCats.includes(c.id) || (expandedCats.length === 0 && c.id === 'security')).map(category => (
            <div key={category.id} className="p-4">
              <div className="flex items-center space-x-3 mb-4 border-b border-black/5 pb-3">
                <div className="w-10 h-10 rounded-full bg-brand-sand flex items-center justify-center text-brand-ink/70">
                  <category.icon size={20} />
                </div>
                <span className="font-bold text-brand-ink text-[16px]">{category.name}</span>
              </div>
              <div className="space-y-2">
                {category.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start p-3 rounded-lg ${
                      item.passed ? 'bg-green-50/50' : 'bg-red-50/50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.passed 
                        ? <CheckCircle2 size={16} className="text-green-600" /> 
                        : <XCircle size={16} className="text-red-500" />
                      }
                    </div>
                    <div className="ml-3 flex-1">
                      <span className={`text-[14px] font-medium ${
                        item.passed ? 'text-green-800' : 'text-red-700 line-through opacity-80'
                      }`}>
                        {item.name}
                      </span>
                      {item.note && (
                        <p className={`text-[12px] mt-0.5 ${
                          item.passed ? 'text-green-700/70' : 'text-red-600/80'
                        }`}>
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="flex justify-center mb-10">
        <button className="flex items-center space-x-2 text-sm font-semibold text-brand-ink bg-transparent border border-brand-ink/20 px-6 py-3 rounded-full hover:bg-brand-ink hover:text-white hover:border-brand-ink transition-colors">
          <Download size={16} />
          <span>Download Safety Report PDF</span>
        </button>
      </div>

      {/* TRUST BADGES ROW */}
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex items-center space-x-1.5 px-4 py-2 border border-[#1D6B5A]/20 bg-[#1D6B5A]/5 rounded-full text-[#1D6B5A]">
          <ShieldCheck size={14} />
          <span className="text-[12px] font-bold uppercase tracking-wide">Physically Inspected</span>
        </div>
        <div className="flex items-center space-x-1.5 px-4 py-2 border border-blue-600/20 bg-blue-600/5 rounded-full text-blue-700">
          <Camera size={14} />
          <span className="text-[12px] font-bold uppercase tracking-wide">Photo Verified</span>
        </div>
        <div className="flex items-center space-x-1.5 px-4 py-2 border border-brand-gold/30 bg-brand-gold/10 rounded-full text-[#9c7b41]">
          <IdCard size={14} />
          <span className="text-[12px] font-bold uppercase tracking-wide">Owner ID Verified</span>
        </div>
      </div>

    </div>
  );
}
