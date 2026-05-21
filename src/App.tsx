/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, ShieldAlert, Sparkles, LogIn, Compass, ListTodo, X } from "lucide-react";
import { 
  UserRole, Member, Duty, PaymentProof, ToLetAd, SystemStats, OnboardingState 
} from "./types";
import { 
  initialMembers, initialDuties, initialPaymentProofs, 
  initialToLetAds, initialSystemStats, defaultOnboarding, translations 
} from "./data";
import Header from "./components/Header";
import OnboardingWizard from "./components/OnboardingWizard";
import LoginScreen from "./components/LoginScreen";
import SuperAdminPortal from "./components/SuperAdminPortal";
import ManagerDashboard from "./components/ManagerDashboard";
import MemberDashboard from "./components/MemberDashboard";
import PublicToLetFinder from "./components/PublicToLetFinder";
import { ToastContainer, ToastItem } from "./components/Toast";

export default function App() {
  const [language, setLanguage] = useState<"en" | "bn">("bn"); // Start in beautiful Bangla by default
  const [currentRole, setCurrentRole] = useState<UserRole>("PUBLIC_GUEST");
  const [isSuperAdminUnlocked, setIsSuperAdminUnlocked] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Custom Role state modifier to also show Onboarding, Login, and Central Home mode in simulation list
  const [simulationView, setSimulationView] = useState<UserRole | "ONBOARDING" | "LOGIN" | "HOME">("HOME");

  // Core application states
  const [onboarding, setOnboarding] = useState<OnboardingState>(defaultOnboarding);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [duties, setDuties] = useState<Duty[]>(initialDuties);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>(initialPaymentProofs);
  const [toLetAds, setToLetAds] = useState<ToLetAd[]>(initialToLetAds);
  const [systemStats, setSystemStats] = useState<SystemStats>(initialSystemStats);
  const [loggedInMemberId, setLoggedInMemberId] = useState<string>("m-1");

  // Global Sandbox firewalls state (Simulated Ban state handled by Super Admin)
  const [isBannedPlatform, setIsBannedPlatform] = useState<boolean>(false);

  // Premium Campaign & SaaS Configuration States
  const [showAdBanner, setShowAdBanner] = useState<boolean>(true);
  const [showPromoPopup, setShowPromoPopup] = useState<boolean>(true);
  const [promoCoupon, setPromoCoupon] = useState<string>("MFLOW200");
  const [announcements, setAnnouncements] = useState<Array<{ id: string; textBn: string; textEn: string; date: string }>>([
    {
      id: "ann-1",
      textBn: "⚡ সিস্টেম সংস্করণ v1.1 প্রো সফলভাবে লাইভ করা হয়েছে। এখন আপনার রসিদসমূহ ডাউনলোডযোগ্য!",
      textEn: "⚡ System Version v1.1 Pro is now live. Cash Receipts are now downloadable as printable memos!",
      date: "2026-05-21 18:00"
    },
    {
      id: "ann-2",
      textBn: "🎁 সীমিত সময়ের অফার: কুপন ব্যবহার করে আপনার মেস লাইসেন্স আপডেট করুন!",
      textEn: "🎁 Limited Time Offer: Upgrade your mess subscription license using active promocode today!",
      date: "2026-05-21 15:30"
    }
  ]);

  // Custom Toast notification states
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    const id = "toast-" + Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast in 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Translations shortcut helper
  const t = translations[language];

  const handleLanguageToggle = () => {
    setLanguage(prev => {
      const next = prev === "en" ? "bn" : "en";
      addToast(
        next === "en" ? "🇺🇸 Switched UI to English" : "🇧🇩 ভাষা পরিবর্তন: বাংলা ড্যাশবোর্ড", 
        "info"
      );
      return next;
    });
  };

  const handleRoleChange = (role: UserRole | "ONBOARDING" | "LOGIN" | "HOME") => {
    if (isBannedPlatform && role !== "SUPER_ADMIN" && role !== "PUBLIC_GUEST" && role !== "HOME") {
      addToast(
        language === "en" 
          ? "🔐 Sandbox locked by policy administrators" 
          : "🔐 এডমিন ফায়ারওয়ালের কারণে মেস সার্ভিস সাময়িক অবরুদ্ধ আছে।", 
        "error"
      );
      return;
    }

    setSimulationView(role);
    
    if (role === "SUPER_ADMIN") {
      setCurrentRole("SUPER_ADMIN");
    } else if (role === "MANAGER") {
      setCurrentRole("MANAGER");
      setIsLoggedIn(true);
    } else if (role === "MEMBER") {
      setCurrentRole("MEMBER");
      setIsLoggedIn(true);
    } else if (role === "PUBLIC_GUEST") {
      setCurrentRole("PUBLIC_GUEST");
    } else if (role === "HOME") {
      setCurrentRole("PUBLIC_GUEST");
    }

    const roleNames: Record<string, string> = {
      HOME: language === "en" ? "Central Command Center" : "সেন্ট্রাল কমান্ড সেন্টার",
      PUBLIC_GUEST: language === "en" ? "Public Guest Seat Locator" : "পাবলিক টু-লেট ফাইন্ডার",
      MEMBER: language === "en" ? "Standard Member workspace" : "মেম্বার সেলফ-সার্ভিস ডেস্ক",
      MANAGER: language === "en" ? "Manager Command Center" : "ম্যানেজার কমান্ড কন্ট্রোলার",
      SUPER_ADMIN: language === "en" ? "Hidden Platform Admin Desk" : "গ্লোবাল সুপার এডমিন কন্ট্রোলার",
      ONBOARDING: language === "en" ? "4-Step Mess Setup Wizard" : "৪-ধাপের মেস অনবোর্ডিং সেটআপ",
      LOGIN: language === "en" ? "Secure Login Screen" : "লগইন এন্ট্রি গেট"
    };

    addToast(
      language === "en" ? `🎯 Teleported to: ${roleNames[role]}` : `🎯 টেলিপোর্ট করা হয়েছে: ${roleNames[role]}`,
      "info"
    );
  };

  const handleOnboardingComplete = (onboardData: OnboardingState) => {
    setOnboarding(onboardData);
    
    // Dynamically append new onboarded members to core state listing
    const newOnboardedMembers: Member[] = [
      {
        id: "m-1",
        name: "Manager (" + (onboardData.managerPhone || "Me") + ")",
        phone: onboardData.managerPhone,
        role: "MANAGER",
        balance: 5000,
        meals: { breakfast: true, lunch: true, dinner: true },
        totalMealsMonth: 30,
        badge: null
      },
      ...onboardData.members.map((m, index) => ({
        id: `m-onboarded-${index}`,
        name: m.name,
        phone: m.phone,
        role: "MEMBER" as const,
        balance: 1000,
        meals: { breakfast: true, lunch: true, dinner: false },
        totalMealsMonth: 20,
        badge: null
      }))
    ];

    setMembers(newOnboardedMembers);
    setIsLoggedIn(true);
    setSimulationView("MANAGER");
    setCurrentRole("MANAGER");
  };

  const handleLoginSuccess = (role: "SUPER_ADMIN" | "MANAGER" | "MEMBER", memberId?: string) => {
    setIsLoggedIn(true);
    if (role === "SUPER_ADMIN") {
      setIsSuperAdminUnlocked(true);
      setSimulationView("SUPER_ADMIN");
      setCurrentRole("SUPER_ADMIN");
    } else if (role === "MANAGER") {
      setSimulationView("MANAGER");
      setCurrentRole("MANAGER");
      if (memberId) setLoggedInMemberId(memberId);
    } else if (role === "MEMBER") {
      setSimulationView("MEMBER");
      setCurrentRole("MEMBER");
      if (memberId) setLoggedInMemberId(memberId);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSimulationView("PUBLIC_GUEST");
    setCurrentRole("PUBLIC_GUEST");
    addToast(language === "en" ? "Logged out to Guest view" : "লগআউট সফল! গেস্ট মোডে ফেরত নেওয়া হয়েছে।", "success");
  };

  const handleStatsUpdate = (updatedStats: SystemStats) => {
    setSystemStats(updatedStats);
  };

  const handleToggleBanPlatform = () => {
    setIsBannedPlatform(prev => {
      const next = !prev;
      addToast(
        next 
          ? (language === "en" ? "🔒 Global Policy Ban Screen ACTIVE" : "🔒 গ্লোবাল মেস সেবা সাময়িকভাবে লক আউট করা হয়েছে।")
          : (language === "en" ? "🔓 Global nominal systems RESTORED" : "🔓 গ্লোবাল nominal মেস সেবা পুনরায় একটিভ করা হয়েছে।"),
        next ? "error" : "success"
      );
      // Redirection logic if banned to help demo testing
      if (next) {
        setSimulationView("PUBLIC_GUEST");
        setCurrentRole("PUBLIC_GUEST");
      }
      return next;
    });
  };

  const handleSubmitDeposit = (proof: PaymentProof) => {
    setPaymentProofs(prev => [proof, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col justify-between selection:bg-[#FF9500]/30 selection:text-[#FF9500]">
      
      {/* Toast container notification pops */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Embedded premium top glass navigation bar */}
      <Header
        currentRole={simulationView === "ONBOARDING" || simulationView === "LOGIN" || simulationView === "HOME" ? "PUBLIC_GUEST" : (simulationView as UserRole)}
        language={language}
        isSuperAdminUnlocked={isSuperAdminUnlocked}
        onRoleChange={handleRoleChange}
        onLanguageToggle={handleLanguageToggle}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        simulationView={simulationView}
      />

      {/* CORE FRAME SECURITY FIREWALL WALL */}
      {isBannedPlatform && simulationView !== "SUPER_ADMIN" ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl p-8 rounded-3xl max-w-lg shadow-2xl relative">
            <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-pulse" />
            
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
              {language === "en" ? "SANDBOX FIREWALL LOCKED" : "মেস ফ্লো স্যান্ডবক্স সাময়িকভাবে অবরুদ্ধ"}
            </h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
              {language === "en" 
                ? "A system administrator has toggled the active sandbox lock state off from the Super Admin terminal interface." 
                : "সুপার এডমিনের মূল কন্ট্রোল প্যানেল থেকে মেস ফ্লো প্ল্যাটফর্মটি স্যান্ডবক্স প্রটেক্টেড করা হয়েছে। এটি ডেমো চেক করতে সুপার এডমিন ড্যাশবোর্ড থেকে রিলিজ করুন।"}
            </p>

            <div className="p-4 bg-[#05070a]/80 border border-white/[0.04] rounded-2xl text-left font-mono text-xs text-rose-300">
              <span className="text-[#FF9500] font-bold">BYPASS HINT:</span> Use the Simulator Dropdown selector in the upper right corner to switch directly to the Super Admin Panel, and re-enable systems with one click.
            </div>
          </div>
        </main>
      ) : (
        
        /* STANDARD DYNAMIC APP ROUTING */
        <main className="flex-1 w-full relative z-10">

          {simulationView === "HOME" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 text-left"
            >
              {/* BRAND WELCOME INTRO DECORATED BOX */}
              <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/[0.08] p-8 md:p-12 text-center shadow-2xl">
                {/* Ambient dynamic glowing lights of orange and purple theme */}
                <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#FF9500]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />
                
                <motion.div 
                   initial={{ scale: 0.96 }}
                   animate={{ scale: 1 }}
                   transition={{ duration: 0.4 }}
                   className="relative z-10 max-w-2xl mx-auto space-y-4"
                >
                  <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#FF9500]/10 border border-[#FF9500]/25 text-[11px] font-mono font-bold uppercase text-[#FF9500] tracking-wider">
                    ⚡ {language === "en" ? "Premium Mess Ecosystem" : "দ্বিভাষিক মেস ম্যানেজমেন্ট সিস্টেম"}
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {language === "en" ? "Optimize Your Mess Flow" : "মেস লাইফ হোক পেসফুল ও পরিপাটি"}
                  </h2>
                  
                  <p className="text-slate-400 text-sm md:text-sm leading-relaxed font-sans max-w-lg mx-auto">
                    {language === "en" 
                      ? "The luxury-themed cohousing SaaS: easily split fixed rents, schedule weekly chores without bias, inspect screenshot payments, or broadcast vacancies dynamically."
                      : "মেস লাইফের ঝুটঝামেলা বিদায় করুন! মিল ডায়েরি, ফিক্সড বুয়া-বিল ভাগাভাগি, ন্যায্য কাজের বণ্টন রস্টার ও খালি সিটের টু-লেট বিজ্ঞাপন দিন সহজেই।"}
                  </p>
                </motion.div>
              </div>

              {/* --- LIVE NOTIFICATION FEED FEED DASHBOARD --- */}
              <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9500] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9500]"></span>
                    </span>
                    <h3 className="text-xs md:text-sm font-bold text-white font-mono tracking-wider uppercase">
                      {language === "en" ? "⚡ Live Notification & Feed Hub" : "⚡ লাইভ নোটিশ ও মেস ফ্লো বুলেটিন বোর্ড"}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-lg">UPDATED REAL-TIME</span>
                </div>

                {/* Grid of Dynamic Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                    <span className="text-xl">📢</span>
                    <div>
                      <span className="text-[9px] font-mono text-purple-400 block font-bold uppercase">PUBLIC VACANCIES</span>
                      <span className="text-xs font-bold text-slate-200">
                        {language === "en" ? `${toLetAds.length} live ads` : `${toLetAds.length}টি বিজ্ঞাপন লাইভ আছে`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                    <span className="text-xl">⏰</span>
                    <div>
                      <span className="text-[9px] font-mono text-orange-400 block font-bold uppercase">DAILY LOCKIN</span>
                      <span className="text-xs font-bold text-slate-200">
                        {language === "en" ? "Cutoff 10:00 AM Roster" : "ডেটলাইন: সকাল ১০:০০ টা রস্টার"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex items-center gap-3 hover:bg-white/[0.03] transition-colors">
                    <span className="text-xl">💳</span>
                    <div>
                      <span className="text-[9px] font-mono text-emerald-400 block font-bold uppercase">GATEWAYS ACTIVE</span>
                      <span className="text-xs font-bold text-slate-200">
                        {language === "en" ? "bKash & Nagad Online" : "বিকাশ ও নগদ গেটওয়ে সক্রিয়"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Published Announcements List */}
                <div className="space-y-2.5 pt-2">
                  {announcements.map((ann, i) => (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3.5 rounded-2xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/10 hover:border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[9px] uppercase bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono py-0.5 px-2 rounded-lg font-bold shrink-0">
                          {language === "en" ? "ANNOUNCEMENT" : "ঘোষণা"}
                        </span>
                        <p className="text-xs font-medium text-slate-200 truncate leading-tight">
                          {language === "en" ? ann.textEn : ann.textBn}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {ann.date}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* --- INLINE SAAS AD PROMOTIONAL BANNER --- */}
              {showAdBanner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-purple-500/5 to-emerald-500/5 border border-emerald-500/20 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-purple-500/[0.02]"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/3 w flex items-center justify-center animate-pulse shrink-0">
                      <span className="text-emerald-450 text-base font-bold">🎁</span>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-extrabold text-white leading-tight">
                        {language === "en"
                          ? `Special Premium Discount Deal! Copy Coupon Code: ${promoCoupon}`
                          : `প্রিমিয়াম মেস ফ্লো প্রো সেট অর্ডারে থাকছে স্পেশাল ডিসকাউন্ট! কুপন কোড: ${promoCoupon}`}
                      </p>
                      <p className="text-[10px] text-slate-450 mt-1 font-sans">
                        {language === "en"
                          ? "Includes intelligent automated round-robin duty schedulers, printable memos & live leaderboards."
                          : "এর মাধ্যমে পাবেন অটোমেটিক ডিউটি অ্যালকোরিদম বণ্টন, প্রিন্টযোগ্য মেমো এবং মেম্বার পেমেন্ট গেটওয়ে ভেরিফিকেশন।"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    <button
                      onClick={() => {
                        handleRoleChange("ONBOARDING");
                        addToast(language === "en" ? `Coupon ${promoCoupon} applied!` : `কুপন ${promoCoupon} প্রবিষ্ট হয়েছে!`, "success");
                      }}
                      className="py-2.5 px-5 bg-emerald-550 hover:bg-emerald-600 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs rounded-xl transition-all active:scale-[0.97] cursor-pointer shadow-lg shadow-emerald-550/15"
                    >
                      {language === "en" ? "Upgrade Now ➔" : "এখনই কিনো / Upgrade Now ➔"}
                    </button>
                    <button
                      onClick={() => setShowAdBanner(false)}
                      className="p-2 rounded-xl text-slate-450 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                      title="Hide notification banner"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* CENTRAL BENTO GRID DESKTOP (3-COLUMNS) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CARD 1: PUBLIC TO-LET FINDER */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  onClick={() => handleRoleChange("PUBLIC_GUEST")}
                  className="relative group overflow-hidden rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#FF9500]/45 p-6 flex flex-col justify-between h-[340px] text-left cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF9500]/10 rounded-full blur-2xl group-hover:bg-[#FF9500]/15 transition-all pointer-events-none" />
                  
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FF9500]/10 border border-[#FF9500]/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shrink-0">
                      <Compass className="w-6 h-6 text-[#FF9500]" />
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold font-sans text-white group-hover:text-[#FF9500] transition-colors leading-tight">
                      {language === "en" ? "🔍 Find a Mess / To-Let" : "🔍 খালি সিট খুঁজুন / পাবলিক রেন্টাল বিজ্ঞাপন"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                      {language === "en"
                        ? "Browse real-time listings, filtered by city and custom budget boundaries, uploaded by verified hostel managers."
                        : "এলাকা ও সর্বোচ্চ বাজেট ফিল্টার করে মেস ম্যানেজারদের সরাসরি পোস্ট করা রিয়েল-টাইম খালি সিটের আপডেট দেখুন।"}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between items-center relative z-10 border-t border-white/[0.05] pt-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{toLetAds.length} {language === "en" ? "ACTIVE VACANCIES" : "অনলাইন বিজ্ঞাপন"}</span>
                    </span>
                    <span className="text-[#FF9500] font-bold text-xs group-hover:translate-x-1.5 transition-transform duration-200">
                      {language === "en" ? "Find Cabin ➔" : "খালি সিট খুঁজুন ➔"}
                    </span>
                  </div>
                </motion.div>

                {/* CARD 2: MANAGER WIZARD CREATION */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  onClick={() => handleRoleChange("ONBOARDING")}
                  className="relative group overflow-hidden rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#8B5CF6]/55 p-6 flex flex-col justify-between h-[340px] text-left cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all pointer-events-none" />
                  
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shrink-0">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold font-sans text-white group-hover:text-purple-400 transition-colors leading-tight">
                      {language === "en" ? "🚀 Create New Mess (Setup)" : "🚀 নতুন মেস তৈরি করুন (৪-ধাপের উইজার্ড)"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                      {language === "en"
                        ? "Execute our simple 4-step onboarding manager portal configuration with pre-generated secure join tokens."
                        : "৪টি সহজের ধাপের রিয়াল-টাইম ক্যালকুলেটর সেটআপ সম্পন্ন করে মেসের ইউনিক জয়েনিং টোকেন কোড তৈরি করুন।"}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between items-center relative z-10 border-t border-white/[0.05] pt-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      {language === "en" ? "4-step configuration" : "৪-ধাপের অনবোর্ডিং"}
                    </span>
                    <span className="text-purple-450 font-bold text-xs group-hover:translate-x-1.5 transition-transform duration-200 text-purple-400">
                      {language === "en" ? "Start Setup ➔" : "সেটআপ শুরু করুন ➔"}
                    </span>
                  </div>
                </motion.div>

                {/* CARD 3: SECURE ACCORDING ACCOUNT SIGN-IN */}
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  onClick={() => {
                    if (isLoggedIn) {
                      setSimulationView(currentRole === "PUBLIC_GUEST" ? "MANAGER" : currentRole);
                    } else {
                      handleRoleChange("LOGIN");
                    }
                  }}
                  className="relative group overflow-hidden rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-indigo-400/40 p-6 flex flex-col justify-between h-[340px] text-left cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-all pointer-events-none" />
                  
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shrink-0">
                      <LogIn className="w-6 h-6 text-indigo-400" />
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold font-sans text-white group-hover:text-indigo-400 transition-colors leading-tight">
                      {isLoggedIn 
                        ? (language === "en" ? "👑 Enter Dashboard Active Panel" : "👑 ড্যাশবোর্ড প্যানেলে প্রবেশ করুন")
                        : (language === "en" ? "🔐 Secure Login & Sign Up" : "🔐 লগইন / সাইন-আপ কন্ট্রোল")}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                      {isLoggedIn 
                        ? (language === "en" 
                            ? `Active session detected as ${currentRole}. Hop directly back to your secure dashboard workstation details.`
                            : `সক্রিয় সাইন-ইন সেশন সনাক্ত হয়েছে। আপনার ড্যাশবোর্ড ওয়ার্কস্টেশনে পুনরায় এক ক্লিকে ফেরত প্রবেশ করুন।`)
                        : (language === "en"
                            ? "Sign in to individual member wallet summaries, daily meal lock checklists, or bypass to Hidden Super Admin."
                            : "সদস্যদের মিল ডায়েরি অন/অফ করতে, রসিদ জেনারেটরে ও সুপার এডমিনের গ্লোবাল বাইপাস সেন্টারে প্রবেশ করুন।")}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between items-center relative z-10 border-t border-white/[0.05] pt-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isLoggedIn ? "bg-emerald-400 animate-pulse" : "bg-[#FF9500]"}`} />
                      <span>{isLoggedIn ? (language === "en" ? "ACTIVE SESSION" : "সেশন একটিভ রয়েছে") : (language === "en" ? "SUPER ADMIN BYPASS" : "টেস্ট বাইপাস রেডি")}</span>
                    </span>
                    <span className="text-indigo-400 font-bold text-xs group-hover:translate-x-1.5 transition-transform duration-200">
                      {isLoggedIn 
                        ? (language === "en" ? "Go to Desk ➔" : "প্যানেলে যান ➔") 
                        : (language === "en" ? "Sign In ➔" : "লগইন করুন ➔")}
                    </span>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}

          {simulationView === "ONBOARDING" && (
            <OnboardingWizard
              language={language}
              onOnboardingComplete={handleOnboardingComplete}
              addToast={addToast}
            />
          )}

          {simulationView === "LOGIN" && (
            <LoginScreen
              language={language}
              onLoginSuccess={handleLoginSuccess}
              addToast={addToast}
              onNavigateToOnboarding={() => handleRoleChange("ONBOARDING")}
            />
          )}

          {simulationView === "SUPER_ADMIN" && (
            <SuperAdminPortal
              language={language}
              stats={systemStats}
              onStatsChange={handleStatsUpdate}
              addToast={addToast}
              isBannedPlatform={isBannedPlatform}
              onToggleBanPlatform={handleToggleBanPlatform}
              showAdBanner={showAdBanner}
              onToggleAdBanner={() => setShowAdBanner(prev => !prev)}
              showPromoPopup={showPromoPopup}
              onTogglePromoPopup={() => setShowPromoPopup(prev => !prev)}
              promoCoupon={promoCoupon}
              onUpdatePromoCoupon={setPromoCoupon}
              announcements={announcements}
              onAddAnnouncement={(ann) => setAnnouncements(prev => [ann, ...prev])}
            />
          )}

          {simulationView === "MANAGER" && (
            <ManagerDashboard
              language={language}
              members={members}
              duties={duties}
              paymentProofs={paymentProofs}
              toLetAds={toLetAds}
              messName={onboarding?.messName || "Green Palace Mess"}
              messAddress={onboarding?.address || "Mirpur Block B, Road 12, Dhaka"}
              onUpdateMembers={setMembers}
              onUpdateDuties={setDuties}
              onUpdatePaymentProofs={setPaymentProofs}
              onUpdateToLetAds={setToLetAds}
              addToast={addToast}
            />
          )}

          {simulationView === "MEMBER" && (
            <MemberDashboard
              language={language}
              loggedInMemberId={loggedInMemberId}
              members={members}
              paymentProofs={paymentProofs}
              onSubmitDeposit={handleSubmitDeposit}
              onUpdateMembers={setMembers}
              addToast={addToast}
            />
          )}

          {simulationView === "PUBLIC_GUEST" && (
            <PublicToLetFinder
              ads={toLetAds}
              language={language}
              addToast={addToast}
            />
          )}

          {/* FLOATING ACTION RETURN HOME BUTTON */}
          {simulationView !== "HOME" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSimulationView("HOME");
                setCurrentRole("PUBLIC_GUEST");
                addToast(
                  language === "en" ? "Returned to Central Command Center" : "সেন্ট্রাল কমান্ড সেন্টারে ফিরে যাওয়া হয়েছে",
                  "info"
                );
              }}
              className="fixed bottom-6 left-6 z-50 flex items-center gap-2 py-3 px-4.5 rounded-full bg-[#05070a]/90 hover:bg-[#05070a] border border-[#FF9500]/50 hover:border-[#8B5CF6]/60 text-slate-100 hover:text-white text-xs font-bold font-sans shadow-2xl shadow-[#FF9500]/25 select-none cursor-pointer backdrop-blur-xl group transition-all duration-350"
            >
              <span className="text-[#FF9500] group-hover:text-purple-400 group-hover:-translate-x-1 transition-transform font-mono font-bold">←</span>
              <span>{language === "en" ? "Back to Home / হোমে ফিরুন" : "হোমে ফিরুন / Back to Home"}</span>
            </motion.button>
          )}

        </main>
      )}

      {/* GLOBAL FOOTER WITH WA DIRECT LINK */}
      <footer className="w-full bg-[#05070a]/90 border-t border-white/[0.05] py-8 px-4 text-center mt-12 print:hidden relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
          
          <h4 className="text-sm font-sans font-medium tracking-tight text-slate-300">
            {t.footerAuthor}
          </h4>

          {/* Secure WhatsApp Link Anchored Element with custom pulsing badges */}
          <a
            href="https://wa.me/8801611035490"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-mono font-medium tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping group-hover:bg-emerald-300 shrink-0" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute group-hover:bg-emerald-300 shrink-0" />
            
            <svg
              className="w-4 h-4 ml-1 text-emerald-400 fill-current group-hover:rotate-12 transition-transform duration-200"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
            </svg>
            <span className="font-sans ml-1">{t.footerWhatsApp}</span>
          </a>

          <div className="text-[10px] text-slate-500 font-mono mt-4">
            Mess Flow App (Bilingual Portal) • Built with high-fidelity React, Tailwind CSS, & Motion inside AI Studio.
          </div>

        </div>
      </footer>

      {/* Dynamic Promo Campaign Popup Modal */}
      <AnimatePresence>
        {simulationView === "HOME" && showPromoPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPromoPopup(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="relative w-full max-w-md bg-[#090d16] border border-white/[0.08] hover:border-purple-500/30 rounded-3xl p-6 overflow-hidden shadow-2xl z-10 text-center"
            >
              {/* Background gradient nodes */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9500]/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

              <button
                onClick={() => setShowPromoPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-3xl inline-block mb-3 animate-bounce">🎁 Exclusive Deal</span>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                {language === "en" 
                  ? "Premium Mess Flow Pro Upgrade Offer!" 
                  : "প্রিমিয়াম মেস ফ্লো প্রো সেট অর্ডারে থাকছে স্পেশাল ডিসকাউন্ট!"}
              </h3>
              <p className="text-xs text-slate-350 mt-2 max-w-sm mx-auto leading-relaxed">
                {language === "en" 
                  ? "Bypass manual ledger boundaries and unlock automated duty cycle balancing matrix algorithms instantly." 
                  : "আপনার মেসের জন্য প্রিমিয়াম লাইসেন্স সাবস্ক্রাইব করুন এবং কুপন কোড ব্যবহার করে স্পেশাল ডিসকাউন্ট উপভোগ করুন।"}
              </p>

              {/* Coupon showcase card */}
              <div className="my-5 p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.12] relative group">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block mb-1">
                  {language === "en" ? "ACTIVE COUPON CODE" : "সক্রিয় কুপন কোড"}
                </span>
                <span className="text-2xl font-mono font-black text-[#FF9500] tracking-widest bg-[#FF9500]/10 px-3 py-1 rounded-lg border border-[#FF9500]/20 inline-block">
                  {promoCoupon}
                </span>
                <p className="text-[9px] text-slate-500 font-mono mt-2 uppercase">
                  {language === "en" ? "Apply code in Premium Mess setup" : "মেস সেটআপ করার সময় কোডটি ব্যবহার করুন"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setShowPromoPopup(false);
                    handleRoleChange("ONBOARDING");
                    addToast(language === "en" ? `Coupon ${promoCoupon} applied!` : `কুপন ${promoCoupon} প্রয়োগ করা হয়েছে!`, "success");
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                >
                  <span>{language === "en" ? "Upgrade Now ➔" : "এখনই কিনো / Upgrade Now ➔"}</span>
                </button>
                <button
                  onClick={() => setShowPromoPopup(false)}
                  className="py-3 px-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  {language === "en" ? "Later" : "পরে করবো"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
