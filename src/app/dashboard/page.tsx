"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Zap,
  Filter
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

// Interfaces
interface Property {
  id: number;
  name: string;
  type: string;
  beds: number;
  price: string;
  score: number;
  status: string;
  image: string;
}

interface Inquiry {
  id: number;
  name: string;
  college: string;
  message: string;
  time: string;
  status: string;
  initial: string;
}

// Mock Data
const VIEW_DATA = [
  { name: "Mon", views: 120 },
  { name: "Tue", views: 210 },
  { name: "Wed", views: 450 },
  { name: "Thu", views: 380 },
  { name: "Fri", views: 520 },
  { name: "Sat", views: 610 },
  { name: "Sun", views: 490 },
];

const SOURCE_DATA = [
  { name: "MoveIn Search", value: 65, color: "#C8A96E" },
  { name: "Map Exploration", value: 20, color: "#1D6B5A" },
  { name: "College Pages", value: 15, color: "#C4603A" },
];

const PROPERTIES: Property[] = [
  { id: 1, name: "The Hive Coliving", type: "PG", beds: 3, price: "8,500", score: 92, status: "Active", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=200" },
  { id: 2, name: "Urban Stay PG", type: "Hostel", beds: 0, price: "7,200", score: 88, status: "Active", image: "https://images.unsplash.com/photo-1502672260266-1c1de2424107?q=80&w=200" },
  { id: 3, name: "Skyline Rooms", type: "Apartment", beds: 1, price: "12,000", score: 95, status: "Pending", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200" },
];

const INQUIRIES: Inquiry[] = [
  { id: 1, name: "Rahul Sharma", college: "COEP", message: "Is a double sharing room available for the next semester?", time: "2h ago", status: "New", initial: "RS" },
  { id: 2, name: "Priya Das", college: "VIT Pune", message: "Wanted to know about the food menu for vegetarians.", time: "5h ago", status: "Responded", initial: "PD" },
  { id: 3, name: "Siddharth Malhotra", college: "PICT", message: "Can I book a visit for tomorrow evening at 5 PM?", time: "1d ago", status: "Booked Visit", initial: "SM" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry>(INQUIRIES[0]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-screen bg-brand-sand" />;

  const NAV_LINKS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "My Properties", icon: Building2 },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare, count: 2 },
    { id: "safety", label: "Safety Audit", icon: ShieldCheck },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-brand-sand overflow-hidden font-body">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-black/5 z-30 h-full shadow-sm">
        <div className="p-8 pb-10">
          <div className="font-display font-bold text-2xl text-brand-ink flex items-center">
            Move<span className="text-brand-gold italic">In</span>
            <span className="ml-2 text-[10px] font-bold bg-brand-ink text-white px-1.5 py-0.5 rounded tracking-widest uppercase">Owner</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === link.id 
                  ? "bg-brand-ink text-white shadow-lg" 
                  : "text-brand-ink/50 hover:bg-gray-50 hover:text-brand-ink"
              }`}
            >
              <div className="flex items-center space-x-3">
                <link.icon size={20} className={activeTab === link.id ? "text-brand-gold" : "text-brand-ink/40 group-hover:text-brand-ink"} />
                <span className="font-semibold text-sm">{link.label}</span>
              </div>
              {link.count && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === link.id ? "bg-brand-gold text-brand-ink" : "bg-brand-rust text-white"}`}>
                  {link.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-brand-sand/50 rounded-2xl p-4 border border-black/5">
            <p className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Need help?</p>
            <button className="w-full text-left text-[13px] font-bold text-brand-teal hover:underline">Support Center</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-brand-sand/80 backdrop-blur-md px-6 py-4 flex items-center justify-between lg:px-10 border-b border-black/5">
          <div className="lg:hidden font-display font-bold text-xl text-brand-ink">
             Move<span className="text-brand-gold">In</span>
          </div>
          
          <h1 className="hidden lg:block font-display text-2xl font-bold text-brand-ink capitalize">
            {activeTab.replace("-", " ")}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 border border-black/5 shadow-sm">
              <Search size={16} className="text-brand-ink/30 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-40" />
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
               <Image src="https://ui-avatars.com/api/?name=Pune+Owner&background=C8A96E&color=fff" alt="Profile" fill className="object-cover" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 pb-24 lg:pb-12">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "properties" && <PropertiesTab />}
          {activeTab === "inquiries" && <InquiriesTab selectedInquiry={selectedInquiry} setSelectedInquiry={setSelectedInquiry} />}
          {activeTab === "safety" && <SafetyTab />}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Views" value="1,247" trend="+12%" trendUp={true} />
        <StatCard label="Active Inquiries" value="23" hasDot={true} />
        <StatCard label="Occupancy Rate" value="87%" progress={87} />
        <StatCard label="Safety Score" value="92/100" isScore={true} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-lg font-bold">Weekly Performance</h3>
            <select className="bg-brand-sand/50 text-[11px] font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VIEW_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500, fill: "#999" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500, fill: "#999" }}
                />
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", fontWeight: 600 }}
                />
                <Bar 
                  dataKey="views" 
                  fill="#C8A96E" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <h3 className="font-display text-lg font-bold mb-8">Inquiry Sources</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SOURCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {SOURCE_DATA.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-[13px] font-medium text-brand-ink/60">{source.name}</span>
                </div>
                <span className="text-[13px] font-bold">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
        <h3 className="font-display text-lg font-bold mb-6">Recent Activity</h3>
        <div className="space-y-6">
          <ActivityItem 
            icon={MessageSquare} 
            color="bg-brand-gold/10 text-brand-gold" 
            title="New Inquiry" 
            desc="Rahul Sharma inquired about The Hive Coliving" 
            time="2h ago" 
          />
          <ActivityItem 
            icon={ShieldCheck} 
            color="bg-brand-teal/10 text-brand-teal" 
            title="Audit Passed" 
            desc="Safety audit completed for Urban Stay PG" 
            time="5h ago" 
          />
          <ActivityItem 
            icon={Star} 
            color="bg-amber-100 text-amber-600" 
            title="New Review" 
            desc="Aarav R. left a 5-star review for The Hive" 
            time="1d ago" 
          />
        </div>
      </div>
    </div>
  );
}

function PropertiesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold">Manage Properties</h2>
          <p className="text-sm text-brand-ink/50">You have 3 active listings in Pune</p>
        </div>
        <button className="bg-brand-gold text-brand-ink font-bold px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg hover:shadow-glow-gold transition-all active:scale-95">
          <Plus size={18} />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-black/5">
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Property</th>
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Available</th>
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Safety</th>
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {PROPERTIES.map((prop) => (
              <tr key={prop.id} className="hover:bg-brand-sand/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                      <Image src={prop.image} fill className="object-cover" alt={prop.name} />
                    </div>
                    <span className="font-bold text-sm">{prop.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-brand-ink/60">{prop.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[13px] font-bold ${prop.beds === 0 ? "text-brand-rust" : "text-brand-ink"}`}>{prop.beds} beds</span>
                    {prop.beds === 0 && <AlertCircle size={12} className="text-brand-rust" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-[13px]">₹{prop.price}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="bg-brand-verified/10 text-brand-verified px-2 py-1 rounded-lg text-[11px] font-bold w-fit">
                    {prop.score}/100
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    prop.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-600"
                  }`}>
                    {prop.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-brand-ink/50 hover:text-brand-gold">
                      <Settings size={18} />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-brand-ink/50 hover:text-brand-teal">
                      <ExternalLink size={18} />
                    </button>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-gold/10 text-brand-gold rounded-lg hover:bg-brand-gold hover:text-brand-ink transition-all active:scale-95 text-xs font-bold">
                       <Zap size={14} fill="currentColor" />
                       <span>Boost</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden space-y-4">
        {PROPERTIES.map((prop) => (
          <div key={prop.id} className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex space-x-4 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0">
                <Image src={prop.image} fill className="object-cover" alt={prop.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-brand-ink">{prop.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">{prop.status}</span>
                </div>
                <div className="text-[12px] text-brand-ink/50 font-medium">{prop.type} &bull; ₹{prop.price}/mo</div>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="bg-brand-verified/10 text-brand-verified px-2 py-0.5 rounded text-[10px] font-bold">
                    {prop.score}/100 Safety
                  </div>
                  <span className="text-[12px] font-bold">{prop.beds} beds available</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 bg-gray-50 rounded-xl font-bold text-xs text-brand-ink/70">Edit</button>
              <button className="py-2 bg-gray-50 rounded-xl font-bold text-xs text-brand-ink/70">View</button>
              <button className="py-2 bg-brand-gold/10 text-brand-gold rounded-xl font-bold text-xs flex items-center justify-center space-x-1">
                 <Zap size={12} fill="currentColor" />
                 <span>Boost</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface InquiriesTabProps {
  selectedInquiry: Inquiry;
  setSelectedInquiry: (inq: Inquiry) => void;
}

function InquiriesTab({ selectedInquiry, setSelectedInquiry }: InquiriesTabProps) {
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col lg:flex-row gap-6">
      {/* Inquiry List */}
      <div className="w-full lg:w-[400px] bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm flex flex-col">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-bold text-brand-ink">All Inquiries</h3>
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-brand-ink/40">
            <Filter size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-black/5">
          {INQUIRIES.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelectedInquiry(inq)}
              className={`w-full p-5 text-left transition-colors flex items-start space-x-4 ${
                selectedInquiry.id === inq.id ? "bg-brand-sand/50" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-sm shrink-0">
                {inq.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm text-brand-ink truncate">{inq.name}</h4>
                  <span className="text-[10px] font-medium text-brand-ink/40">{inq.time}</span>
                </div>
                <p className="text-[12px] text-brand-ink/50 font-medium mb-2">{inq.college}</p>
                <p className="text-[12px] text-brand-ink/70 line-clamp-1 italic">&ldquo;{inq.message}&rdquo;</p>
                <div className="mt-3">
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                     inq.status === "New" ? "bg-blue-100 text-blue-600" : 
                     inq.status === "Responded" ? "bg-green-100 text-green-600" : 
                     "bg-brand-gold text-brand-ink"
                   }`}>
                     {inq.status}
                   </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry Detail */}
      <div className="flex-1 bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm flex flex-col">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-base">
              {selectedInquiry.initial}
            </div>
            <div>
              <h3 className="font-bold text-brand-ink">{selectedInquiry.name}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-[12px] font-bold text-brand-teal uppercase tracking-wide">
                  Going to {selectedInquiry.college}
                </p>
                <span className="w-1 h-1 rounded-full bg-black/10" />
                <p className="text-[11px] font-bold text-brand-rust uppercase tracking-wide">
                  Move-in: 15 July 2025
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-brand-ink/40"><MoreVertical size={20} /></button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="bg-brand-sand/30 rounded-[24px] p-6 max-w-[80%]">
            <p className="text-sm font-medium text-brand-ink/80 leading-relaxed">
              &ldquo;{selectedInquiry.message}&rdquo;
            </p>
            <span className="block mt-4 text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest">Received via MoveIn Search &bull; {selectedInquiry.time}</span>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">Quick Reply Templates</h4>
            <div className="flex flex-wrap gap-2">
               {["Yes, double sharing is available", "The monthly rent is inclusive of meals", "You can visit tomorrow at 5 PM"].map((t) => (
                 <button key={t} className="px-4 py-2 bg-gray-50 border border-black/5 rounded-xl text-[13px] font-medium hover:bg-brand-gold/10 hover:border-brand-gold/20 transition-colors">
                   {t}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-black/5 bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-white border border-black/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-gold transition-colors"
            />
            <button className="bg-brand-ink text-white font-bold px-8 py-4 rounded-2xl hover:bg-black transition-colors shadow-lg active:scale-95">
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafetyTab() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full border-4 border-brand-verified flex flex-col items-center justify-center bg-white shadow-sm">
             <span className="font-display text-2xl font-bold text-brand-ink">92</span>
             <span className="text-[10px] font-bold text-brand-ink/40 uppercase">/ 100</span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-ink">Safety Performance</h2>
            <p className="text-sm text-brand-ink/60 font-medium">Top 5% of properties in Pune</p>
            <div className="mt-2 flex items-center text-[#2D7A4F] text-xs font-bold bg-[#2D7A4F]/10 px-2.5 py-1 rounded-full w-fit">
              <CheckCircle2 size={12} className="mr-1.5" />
              <span>Verified 12 Jan 2025</span>
            </div>
          </div>
        </div>
        <button className="bg-brand-ink text-white font-bold px-8 py-4 rounded-full hover:bg-black transition-all active:scale-95 shadow-lg">
          Request Re-Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
           <h3 className="font-display text-lg font-bold mb-6">Audit Checklist</h3>
           <div className="space-y-4">
              {[
                { label: "CCTV in all common areas", status: "Pass" },
                { label: "Fire extinguishers serviced", status: "Pass" },
                { label: "Emergency exits clearly marked", status: "Pass" },
                { label: "Visitor log system (Digital)", status: "Fail" },
                { label: "Night security guard (24/7)", status: "Pass" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                   <span className="text-sm font-semibold text-brand-ink/80">{item.label}</span>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === "Pass" ? "text-green-600" : "text-brand-rust"}`}>
                     {item.status}
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* Improvement Tips */}
        <div className="bg-brand-ink text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
           <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-brand-gold/10 blur-[50px] rounded-full" />
           <ShieldCheck size={48} className="text-brand-gold mb-6" />
           <h3 className="font-display text-xl font-bold mb-4">Improve Your Score</h3>
           <p className="text-white/60 text-sm leading-relaxed mb-8">
             MoveIn prioritizes properties with higher safety scores in search results. Higher score = Higher visibility.
           </p>
           <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                 <div className="flex items-start space-x-3">
                    <div className="bg-brand-gold text-brand-ink w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">+5</div>
                    <p className="text-[13px] font-semibold">Switch to a Digital Visitor Log (MoveIn App) to increase score by 5 points.</p>
                 </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 opacity-80">
                 <div className="flex items-start space-x-3">
                    <div className="bg-brand-gold text-brand-ink w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">+3</div>
                    <p className="text-[13px] font-semibold">Install emergency buzzer in all common hallways.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  hasDot?: boolean;
  progress?: number;
  isScore?: boolean;
}

function StatCard({ label, value, trend, trendUp, hasDot, progress, isScore }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest">{label}</span>
        {hasDot && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
      </div>
      <div className="flex items-end justify-between">
        <div className="font-display text-2xl font-bold text-brand-ink tabular-nums">{value}</div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {trend}
          </span>
        )}
        {progress && (
           <div className="relative w-10 h-10">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-gray-100" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-brand-gold" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">{progress}%</div>
           </div>
        )}
        {isScore && <ShieldCheck size={20} className="text-brand-verified" />}
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
  time: string;
}

function ActivityItem({ icon: Icon, color, title, desc, time }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="font-bold text-sm text-brand-ink">{title}</h4>
          <span className="text-[10px] font-medium text-brand-ink/40">{time}</span>
        </div>
        <p className="text-[13px] font-medium text-brand-ink/60">{desc}</p>
      </div>
      <button className="text-brand-ink/20 hover:text-brand-ink"><ChevronRight size={16} /></button>
    </div>
  );
}

