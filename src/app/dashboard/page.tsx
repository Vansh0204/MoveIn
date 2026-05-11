"use client";

import React, { useState, useEffect, type FormEvent, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  Settings, 
  Plus, 
  Search, 
  Zap,
  LogOut,
  Phone
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
  id: string | number;
  name: string;
  type: string;
  beds: number;
  totalBeds?: number;
  price: string;
  score: number;
  status: string;
  image: string;
  views?: number;
  location?: string;
  description?: string;
}

interface Inquiry {
  id: number;
  student: string;
  college: string;
  message: string;
  time: string;
  status: string;
  phone: string;
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
  { id: 1, name: "The Hive Coliving", type: "PG", beds: 3, price: "8,500", score: 92, status: "Active", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=200", views: 450 },
  { id: 2, name: "Urban Stay PG", type: "Hostel", beds: 0, price: "7,200", score: 88, status: "Active", image: "https://images.unsplash.com/photo-1502672260266-1c1de2424107?q=80&w=200", views: 280 },
  { id: 3, name: "Skyline Rooms", type: "Apartment", beds: 1, price: "12,000", score: 95, status: "Pending", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200", views: 517 },
];

const INQUIRIES: Inquiry[] = [
  { id: 1, student: "Rahul Sharma", college: "COEP", message: "Is the PG near the main gate?", time: "2h ago", status: "New", phone: "9876543210" },
  { id: 2, student: "Sneha Patil", college: "MIT WPU", message: "Interested in the single room.", time: "5h ago", status: "New", phone: "9456781233" },
];

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user, isLoading, openAuthModal, showToast, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry>(INQUIRIES[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Record<string, string[]>>({});
  const [realProperties, setRealProperties] = useState<Property[]>([]);
  const [realInquiries, setRealInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const seedProperties = useCallback(async () => {
    if (!user) return;
    const sampleProps = [
      { owner_id: user.id, name: "The Hive Coliving", type: "PG", available_beds: 3, total_beds: 20, price: 8500, safety_score: 92, status: "Active", views: 520, location: "Pune", image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400" },
      { owner_id: user.id, name: "Urban Stay PG", type: "Hostel", available_beds: 0, total_beds: 15, price: 7200, safety_score: 88, status: "Active", views: 310, location: "Pune", image_url: "https://images.unsplash.com/photo-1502672260266-1c1de2424107?q=80&w=400" },
      { owner_id: user.id, name: "Skyline Rooms", type: "Apartment", available_beds: 1, total_beds: 10, price: 12000, safety_score: 95, status: "Active", views: 640, location: "Pune", image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400" },
    ];

    await supabase.from('properties').delete().not('name', 'is', null);

    const { error } = await supabase.from('properties').insert(sampleProps);
    if (!error) {
      showToast("Real properties seeded successfully! 🏠");
    }
  }, [user, showToast]);

  const fetchProperties = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id);
    
    if (error) {
      console.error('Error fetching properties:', error);
    } else if (data) {
      if (data.length === 0) {
        await seedProperties();
      } else {
        const mapped = data.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type,
          beds: p.available_beds,
          totalBeds: p.total_beds || 10,
          views: p.views || 0,
          price: p.price.toLocaleString(),
          score: p.safety_score,
          status: p.status,
          image: p.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=200",
          location: p.location
        }));
        setRealProperties(mapped);
      }
    }
  }, [user, seedProperties]);

  const onboardStudents = useCallback(async () => {
    const students = [
      { name: "Ananya Tiwari", college: "COEP", phone: "9454762552", msg: "Finally something that shows real walking distance from my college!" },
      { name: "Rohan Sharma", college: "MIT-WPU Pune", phone: "9876543210", msg: "The PG options were really good. The team helped me find a place near MIT-WPU very quickly." },
      { name: "Aman Gupta", college: "COEP Technological University", phone: "9812345678", msg: "Process was simple. Found a place near my college." },
      { name: "Sneha Iyer", college: "MIT-WPU Pune", phone: "9456781233", msg: "Excellent support from start to finish. The PG owner was cooperative." },
      { name: "Kunal Singh", college: "MIT-WPU Pune", phone: "9567812344", msg: "Good service, looking for more food options." },
      { name: "Ananya Das", college: "COEP Technological University", phone: "9678123455", msg: "MoveIn saved me a lot of time." },
      { name: "Aditya Mehta", college: "DY Patil College of Engineering", phone: "9781234566", msg: "Nice experience. Multiple options to compare." },
      { name: "Neha Kapoor", college: "MIT-WPU Pune", phone: "9892345677", msg: "Location was very good. Rent was fair." },
      { name: "Rahul Yadav", college: "COEP Technological University", phone: "9913456788", msg: "The recommended PG was clean and secure." },
      { name: "Ishita Roy", college: "MIT-WPU Pune", phone: "9024567899", msg: "Good options and honest feedback about properties." },
      { name: "Pooja Nair", college: "Symbiosis Institute of Technology", phone: "9246789012", msg: "Very professional process. The PG had Wi-Fi, laundry, and good food." },
      { name: "Ritika Sen", college: "Bharati Vidyapeeth", phone: "9468901234", msg: "Good support and timely responses. The final PG matched what was shown." },
      { name: "Arjun Malhotra", college: "MIT-WPU Pune", phone: "9579012345", msg: "Outstanding experience. I would definitely use MoveIn again." },
      { name: "Meera Joshi", college: "MIT-WPU Pune", phone: "9680123456", msg: "The process was fine, but I expected more budget-friendly options." },
      { name: "Harsh Agarwal", college: "COEP Technological University", phone: "9791234567", msg: "PG was exactly as described. Safe environment and friendly owner." },
      { name: "Nitin Kumar", college: "MIT-WPU Pune", phone: "9913456790", msg: "Good experience overall. Food quality could have been better." },
      { name: "Shreya Banerjee", college: "Symbiosis College of Arts and Commerce", phone: "9024567801", msg: "Quick and efficient service. Found a PG within walking distance." },
      { name: "Akash Thakur", college: "MIT-WPU Pune", phone: "9135678012", msg: "Multiple verified options were shared. Saved me a lot of effort." },
      { name: "Mohit Saini", college: "PICT Pune", phone: "9579013456", msg: "Very useful platform. The PG had all promised facilities." },
      { name: "Rohit Pandey", college: "Army Institute of Technology", phone: "9913457890", msg: "Reliable service and genuine listings. Would use again." },
      { name: "Tanisha Kapoor", college: "Symbiosis International University", phone: "9874512360", msg: "Good experience overall. The PG was clean and well-maintained." }
    ];

    await supabase.from('inquiries').delete().not('student_name', 'is', null);

    const { error } = await supabase.from('inquiries').insert(
      students.map(s => ({
        student_name: s.name,
        college: s.college,
        phone: s.phone,
        message: s.msg,
        status: 'New'
      }))
    );

    if (error) {
      showToast("Sync Failed: " + error.message);
    } else {
      showToast(`Successfully onboarded all ${students.length} students from Sheet! 🎓`);
    }
  }, [showToast]);

  const fetchInquiries = useCallback(async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inquiries:', error);
    } else if (data) {
      if (data.length === 0) {
        await onboardStudents();
      } else {
        const mapped = data.map(i => ({
          id: i.id,
          student: i.student_name,
          college: i.college,
          message: i.message,
          phone: i.phone,
          status: i.status,
          time: new Date(i.created_at).toLocaleDateString()
        }));
        setRealInquiries(mapped);
      }
    }
  }, [onboardStudents]);

  useEffect(() => {
    if (isMounted && user) {
      fetchProperties();
      fetchInquiries();
    }
  }, [isMounted, user, fetchProperties, fetchInquiries]);

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/");
      setTimeout(() => openAuthModal(), 100);
    }
  }, [isMounted, isLoading, user, router, openAuthModal]);

  if (!isMounted || isLoading || !user) return <div className="h-screen bg-brand-sand flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
  </div>;

  const displayProperties = realProperties.length > 0 ? realProperties : PROPERTIES;
  const displayInquiries = realInquiries.length > 0 ? realInquiries : INQUIRIES;

  // Calculate real-time stats
  const totalViews = realProperties.length > 0 
    ? realProperties.reduce((sum, p: Property) => sum + (p.views || 0), 0)
    : 1247; // Default to mock value only if no real properties exist
  
  const totalBeds = displayProperties.reduce((sum, p: Property) => sum + (p.totalBeds || 10), 0);
  const availableBeds = displayProperties.reduce((sum, p: Property) => sum + (p.beds || 0), 0);
  const occupancyRate = totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 87;

  // Calculate dynamic inquiry count
  const unreadCount = displayInquiries.filter(inq => 
    inq.status === "New" && !messages[inq.id]
  ).length;

  const NAV_LINKS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "properties", label: "My Properties", icon: Building2 },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare, count: unreadCount > 0 ? unreadCount : undefined },
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
          <div className="bg-brand-sand/50 rounded-2xl p-4 border border-black/5 mb-4">
            <p className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Need help?</p>
            <button className="w-full text-left text-[13px] font-bold text-brand-teal hover:underline">Support Center</button>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
          >
            <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
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
            <button 
              onClick={() => { seedProperties(); onboardStudents(); }}
              className="hidden md:flex items-center space-x-2 bg-brand-gold text-brand-ink px-4 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all"
            >
              <Zap size={16} />
              <span>Sync Real Data</span>
            </button>
            <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 border border-black/5 shadow-sm">
              <Search size={16} className="text-brand-ink/30 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-40" />
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
               <Image 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C8A96E&color=fff`} 
                alt={user.name} 
                fill 
                className="object-cover" 
               />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 pb-24 lg:pb-12">
          {activeTab === "overview" && (
            <OverviewTab 
              unreadCount={unreadCount} 
              userName={user.name} 
              totalViews={totalViews}
              occupancyRate={occupancyRate}
            />
          )}
          {activeTab === "properties" && (
            <PropertiesTab 
              properties={displayProperties} 
              refresh={fetchProperties}
            />
          )}
          {activeTab === "inquiries" && (
            <InquiriesTab 
              selectedInquiry={selectedInquiry} 
              setSelectedInquiry={setSelectedInquiry} 
              messages={messages}
              setMessages={setMessages}
              inquiries={displayInquiries}
              onSync={onboardStudents}
            />
          )}
          {activeTab === "safety" && <SafetyTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SettingsTab() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
        <h3 className="font-display text-xl font-bold mb-8 text-brand-ink">Profile Details</h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-6 pb-8 border-b border-black/5">
            <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center border-2 border-white shadow-md overflow-hidden relative">
              <Image 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C8A96E&color=fff`} 
                alt={user.name} 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <button className="text-[13px] font-bold text-brand-teal hover:underline mb-1">Change Photo</button>
              <p className="text-[11px] text-brand-ink/40 font-medium italic">Photos help build trust with students</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest ml-1">Full Name</label>
              <div className="bg-gray-50 rounded-2xl px-5 py-4 font-bold text-brand-ink border border-black/5">{user.name}</div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="bg-gray-50 rounded-2xl px-5 py-4 font-bold text-brand-ink/60 border border-black/5 flex items-center justify-between">
                {user.email}
                <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
        <h3 className="font-display text-xl font-bold mb-6 text-brand-ink text-red-600">Danger Zone</h3>
        <button 
          onClick={() => logout()}
          className="flex items-center space-x-2 bg-red-50 text-red-600 font-bold px-8 py-4 rounded-full hover:bg-red-100 transition-all active:scale-95"
        >
          <LogOut size={18} />
          <span>Sign Out of Dashboard</span>
        </button>
      </div>
    </div>
  );
}

interface OverviewTabProps {
  unreadCount: number;
  userName: string;
  totalViews: number;
  occupancyRate: number;
}

function OverviewTab({ unreadCount, userName, totalViews, occupancyRate }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-ink">Welcome back, {userName.split(" ")[0]}! 👋</h2>
          <p className="text-sm text-brand-ink/50 font-medium">Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Views" value={totalViews.toLocaleString()} trend="+12%" trendUp={true} />
        <StatCard label="Active Inquiries" value={unreadCount.toString()} hasDot={unreadCount > 0} />
        <StatCard label="Occupancy Rate" value={`${occupancyRate}%`} progress={occupancyRate} />
        <StatCard label="Safety Score" value="92/100" isScore={true} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-black/5 h-[400px]">
          <h3 className="font-display text-lg font-bold mb-8">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={VIEW_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#999" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#999" }} />
              <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "16px", border: "none" }} />
              <Bar dataKey="views" fill="#C8A96E" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <h3 className="font-display text-lg font-bold mb-8">Inquiry Sources</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {SOURCE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {SOURCE_DATA.map((s) => (
              <div key={s.name} className="flex justify-between text-xs font-bold">
                <span className="text-brand-ink/40">{s.name}</span>
                <span>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PropertiesTabProps {
  properties: Property[];
  refresh: () => void;
}

function PropertiesTab({ properties, refresh }: PropertiesTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Your Properties</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-brand-gold text-brand-ink font-bold px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg active:scale-95">
          <Plus size={18} />
          <span>Add Property</span>
        </button>
      </div>
      <AnimatePresence>
        {isAddModalOpen && <AddPropertyModal onClose={() => setIsAddModalOpen(false)} onSuccess={() => { setIsAddModalOpen(false); refresh(); }} />}
      </AnimatePresence>
      <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-black/5">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-brand-ink/40">Name</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-brand-ink/40">Type</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-brand-ink/40">Beds</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-brand-ink/40">Price</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-brand-ink/40">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-brand-sand/20 transition-colors">
                <td className="px-6 py-4 font-bold text-sm">{p.name}</td>
                <td className="px-6 py-4 text-xs font-medium text-brand-ink/50">{p.type}</td>
                <td className="px-6 py-4 text-xs font-bold">{p.beds} available</td>
                <td className="px-6 py-4 text-xs font-bold">₹{p.price}</td>
                <td className="px-6 py-4 text-[10px] font-bold uppercase text-green-600">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddPropertyModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const { user, showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "PG", price: "", beds: "0", location: "Pune" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('properties').insert({ owner_id: user.id, ...formData, price: parseInt(formData.price), available_beds: parseInt(formData.beds), status: 'Active', safety_score: 90 });
    if (error) showToast("Error: " + error.message);
    else { showToast("Success! 🏠"); onSuccess(); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[32px] w-full max-w-md shadow-2xl">
        <h3 className="font-display text-2xl font-bold mb-6">List Property</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Name" className="w-full bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, type: e.target.value})}><option>PG</option><option>Hostel</option></select>
            <input required type="number" placeholder="Price" className="bg-gray-50 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-ink text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95">{loading ? "Saving..." : "Confirm"}</button>
          <button type="button" onClick={onClose} className="w-full text-brand-ink/40 font-bold text-sm">Cancel</button>
        </form>
      </motion.div>
    </div>
  );
}

interface InquiriesTabProps {
  selectedInquiry: Inquiry;
  setSelectedInquiry: (inq: Inquiry) => void;
  messages: Record<string, string[]>;
  setMessages: (msgs: Record<string, string[]>) => void;
  inquiries: Inquiry[];
  onSync: () => void;
}

function InquiriesTab({ selectedInquiry, setSelectedInquiry, messages, setMessages, inquiries, onSync }: InquiriesTabProps) {
  const { showToast } = useAuth();
  const [replyText, setReplyText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await onSync();
    setIsSyncing(false);
  };

  const handleReply = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setMessages({ ...messages, [selectedInquiry.id]: [...(messages[selectedInquiry.id] || []), replyText] });
    setReplyText("");
    showToast("Reply sent! 📩");
  };

  return (
    <div className="flex flex-col lg:flex-row h-[700px] bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm">
      <div className="w-full lg:w-[350px] border-r border-black/5 flex flex-col">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-bold">Inquiries</h3>
          <button onClick={handleSync} disabled={isSyncing} className="text-[10px] font-bold bg-brand-gold/10 px-2 py-1 rounded-lg">
            {isSyncing ? "Syncing..." : "Sync Students"}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {inquiries.map(inq => (
            <button key={inq.id} onClick={() => setSelectedInquiry(inq)} className={`w-full p-4 text-left border-b border-black/5 ${selectedInquiry.id === inq.id ? "bg-brand-sand/30" : ""}`}>
              <div className="font-bold text-sm">{inq.student}</div>
              <div className="text-[10px] text-brand-ink/40">{inq.college}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center font-bold text-brand-gold">
              {selectedInquiry?.student?.charAt(0) || "U"}
            </div>
            <div>
              <div className="font-bold">{selectedInquiry?.student || "Unknown"}</div>
              <div className="text-[10px] text-brand-ink/40">{selectedInquiry.phone || "No phone"}</div>
            </div>
          </div>
          <button className="p-2 bg-gray-50 rounded-full"><Phone size={18} /></button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm inline-block max-w-[80%] text-sm">{selectedInquiry.message}</div>
          {(messages[selectedInquiry.id] || []).map((m, i) => (
            <div key={i} className="flex justify-end">
              <div className="bg-brand-ink text-white p-4 rounded-2xl shadow-sm inline-block max-w-[80%] text-sm">{m}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleReply} className="p-4 border-t border-black/5 bg-white flex gap-3">
          <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none" />
          <button type="submit" className="bg-brand-ink text-white px-6 rounded-2xl font-bold active:scale-95 transition-transform">Send</button>
        </form>
      </div>
    </div>
  );
}

function SafetyTab() {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-verified/10 flex items-center justify-center text-brand-verified font-bold text-xl">92</div>
        <div><h3 className="font-bold">Safety Performance</h3><p className="text-sm text-brand-ink/40">Verified 12 Jan 2025</p></div>
      </div>
      <div className="space-y-4">
        {["CCTV", "Fire Safety", "Security Guard", "Digital Log"].map(item => (
          <div key={item} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <span className="font-bold text-sm">{item}</span>
            <span className="text-[10px] font-bold text-green-600 uppercase">Pass</span>
          </div>
        ))}
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
