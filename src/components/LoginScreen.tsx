/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Key, Eye, EyeOff, LogIn, Sparkles, UserCheck, Shield, HelpCircle, ArrowRight } from "lucide-react";
import { translations } from "../data";

interface LoginScreenProps {
  language: "en" | "bn";
  onLoginSuccess: (role: "SUPER_ADMIN" | "MANAGER" | "MEMBER", memberId?: string) => void;
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
  onNavigateToOnboarding?: () => void;
}

export default function LoginScreen({ language, onLoginSuccess, addToast, onNavigateToOnboarding }: LoginScreenProps) {
  const t = translations[language];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Normalize and trim inputs
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      addToast(
        language === "en" ? "⚠️ Please enter your email and password" : "⚠️ দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন",
        "warning"
      );
      return;
    }

    setLoading(true);

    // Context-aware dynamic verification status text
    if (cleanEmail === "jubayerahmedbhuiyan18@gmail.com" && cleanPassword === "3090") {
      setLoadingStatus(
        language === "en" 
          ? "🔐 Verifying Super Admin Credentials... please wait" 
          : "🔐 সুপার এডমিন তথ্য যাচাই করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন"
      );
    } else if (cleanEmail === "manager@messflow.com" || cleanEmail === "manager" || cleanEmail === "01611035490") {
      setLoadingStatus(
        language === "en"
          ? "🚀 Securing Manager Workspace session..."
          : "🚀 ম্যানেজার ওয়ার্কস্পেস সেশন সুরক্ষিত করা হচ্ছে..."
      );
    } else if (
      cleanEmail === "member@messflow.com" || 
      cleanEmail === "member" || 
      ["fahim@messflow.com", "shakil@messflow.com", "sayeedi@messflow.com", "01712345678", "01598765432", "01822446688"].includes(cleanEmail)
    ) {
      setLoadingStatus(
        language === "en"
          ? "🧬 Loading Member Profile & Wallet counters..."
          : "🧬 মেম্বার প্রোফাইল এবং ওয়ালেট কাউন্টার লোড করা হচ্ছে..."
      );
    } else {
      setLoadingStatus(
        language === "en"
          ? "🔍 Identifying credentials..."
          : "🔍 আপনার লগইন তথ্য খোঁজা হচ্ছে..."
      );
    }

    // Realistic network simulated timeout
    setTimeout(() => {
      setLoading(false);
      setLoadingStatus("");

      // 1. SUPER ADMIN BYPASS
      if (cleanEmail === "jubayerahmedbhuiyan18@gmail.com" && cleanPassword === "3090") {
        addToast(
          language === "en" 
            ? "👑 Welcome back, Master Admin! Access Granted to Security Center." 
            : "👑 স্বাগতম বস! মেস ফ্লো প্ল্যাটফর্ম সিকিউরিটি সেন্টারে আপনার প্রবেশাধিকার অনুমোদিত হয়েছে।",
          "success"
        );
        onLoginSuccess("SUPER_ADMIN");
      } 
      // 2. REGISTERED MESS MANAGER
      else if (
        (cleanEmail === "manager@messflow.com" && cleanPassword === "manager123") ||
        (cleanEmail === "manager" && cleanPassword === "manager123") ||
        (cleanEmail === "01611035490" && cleanPassword === "manager123")
      ) {
        addToast(
          language === "en" 
            ? "⚡ Access Granted. Logged in successfully as Manager (Jubayer Ahmed Bhuiyan)" 
            : "⚡ অ্যাক্সেস গ্র্যান্টেড। মেস ম্যানেজার হিসেবে সফল সেশন তৈরি হয়েছে (জুবায়ের আহমেদ ভূঁইয়া)",
          "success"
        );
        onLoginSuccess("MANAGER", "m-1");
      } 
      // 3. REGISTERED MESS MEMBER
      else if (
        (cleanEmail === "member@messflow.com" && cleanPassword === "member123") ||
        (cleanEmail === "member" && cleanPassword === "member123") ||
        (cleanEmail === "fahim@messflow.com" && cleanPassword === "member123") ||
        (cleanEmail === "01712345678" && cleanPassword === "member123")
      ) {
        addToast(
          language === "en" 
            ? "✅ Sign In Success: Authorized as Member (Fahim Rahman)" 
            : "✅ সাইন ইন সফল: মেস মেম্বার হিসেবে প্রবেশ করেছেন (ফাহিম রহমান)",
          "success"
        );
        onLoginSuccess("MEMBER", "m-2");
      } else if (
        (cleanEmail === "shakil@messflow.com" && cleanPassword === "member123") ||
        (cleanEmail === "01598765432" && cleanPassword === "member123")
      ) {
        addToast(
          language === "en" 
            ? "✅ Sign In Success: Authorized as Member (Shakil Hossain)" 
            : "✅ সাইন ইন সফল: মেস মেম্বার হিসেবে প্রবেশ করেছেন (শাকিল হোসেন)",
          "success"
        );
        onLoginSuccess("MEMBER", "m-3");
      } else if (
        (cleanEmail === "sayeedi@messflow.com" && cleanPassword === "member123") ||
        (cleanEmail === "01822446688" && cleanPassword === "member123")
      ) {
        addToast(
          language === "en" 
            ? "✅ Sign In Success: Authorized as Member (Sayeedi Alam)" 
            : "✅ সাইন ইন সফল: মেস মেম্বার হিসেবে প্রবেশ করেছেন (সাঈদী আলম)",
          "success"
        );
        onLoginSuccess("MEMBER", "m-4");
      } 
      // 4. INCORRECT FAIL TOAST
      else {
        addToast(
          language === "en"
            ? "❌ Invalid Email or Password! Please try again."
            : "❌ ভুল ইমেইল বা পাসওয়ার্ড! আবার চেষ্টা করুন।",
          "error"
        );
      }
    }, 1200);
  };

  // Helpers to fast-fill
  const loadDemo = (type: "admin" | "manager" | "member") => {
    switch (type) {
      case "admin":
        setEmail("jubayerahmedbhuiyan18@gmail.com");
        setPassword("3090");
        addToast(language === "en" ? "Super Admin keys preloaded" : "সুপার এডমিন তথ্য লোড করা হয়েছে", "info");
        break;
      case "manager":
        setEmail("manager@messflow.com");
        setPassword("manager123");
        addToast(language === "en" ? "Registered Manager credentials preloaded" : "ম্যানেজারের আইডি-পাসওয়ার্ড লোড করা হয়েছে", "info");
        break;
      case "member":
        setEmail("member@messflow.com");
        setPassword("member123");
        addToast(language === "en" ? "Active member credentials preloaded" : "সদস্যের আইডি-পাসওয়ার্ড লোড করা হয়েছে", "info");
        break;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto px-4 py-12 md:py-20 flex flex-col justify-center items-center"
    >
      {/* Centered Glassmorphic Frosted Box with beautiful orange & purple gradient border ring */}
      <div className="w-full rounded-3xl p-[2px] bg-gradient-to-br from-[#FF9500] via-[#8B5CF6]/50 to-indigo-500 shadow-[0_0_50px_rgba(255,149,0,0.12)]">
        
        {/* Inner Container */}
        <div className="w-full bg-[#05070a]/95 backdrop-blur-2xl rounded-[22px] p-8 md:p-10 relative overflow-hidden">
          
          {/* Aesthetic background beam nodes */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#FF9500]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-36 h-36 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="text-center mb-8 relative z-10">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#FF9500]/10 border border-[#FF9500]/25 text-[10px] font-mono font-bold uppercase text-[#FF9500] tracking-wider mb-3">
              ⚡ Secure Authorization
            </span>
            
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {language === "en" ? "Welcome Back" : "সুরক্ষিত প্যানেল এক্সেস"}
            </h2>
            
            <p className="text-xs text-slate-400 mt-1.5 font-sans">
              {language === "en" 
                ? "Enter your credentials below to access your custom workspace dashboard."
                : "আপনার ম্যানেজার বা মেম্বার একাউন্ট দিয়ে মেস ফ্লো সিস্টেমে প্রবেশ করুন।"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* EMAIL ADRESS */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex justify-between items-center">
                <span>{language === "en" ? "Email Address / Phone Number" : "ইমেইল ঠিকানা বা মোবাইল নম্বর"}</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">Required / আবশ্যক</span>
              </label>
              
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 w-5 h-5 flex items-center justify-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                
                <input
                  type="text"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "en" ? "e.g., manager@messflow.com" : "যেমন: manager@messflow.com বা মোবাইল"}
                  className="w-full bg-[#05070a] text-slate-100 text-sm border border-white/[0.08] focus:border-[#FF9500] rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-transparent transition-all"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex justify-between items-center">
                <span>{language === "en" ? "Password" : "পাসওয়ার্ড"}</span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">Case-sensitive</span>
              </label>
              
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 w-5 h-5 flex items-center justify-center text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "en" ? "Enter your safe password" : "মেসের গোপন পাসওয়ার্ড লিখুন"}
                  className="w-full bg-[#05070a] text-slate-100 text-sm border border-white/[0.08] focus:border-[#8B5CF6] rounded-xl pl-11 pr-12 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-transparent transition-all"
                />

                {/* Show/Hide eye button toggler */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 rounded-md text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT COMPACT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-[#FF9500] to-[#8B5CF6] hover:from-[#FF9500]/90 hover:to-[#8B5CF6]/90 text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg shadow-[#FF9500]/10 hover:shadow-[#FF9500]/20 active:scale-[0.98] transition-all select-none disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2.5">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs font-mono tracking-wide">{loadingStatus}</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span>🔒 {language === "en" ? "Login to Workspace" : "অ্যাকাউন্টে প্রবেশ করুন"}</span>
                </span>
              )}
            </button>
          </form>

          {/* SIGN UP REDIRECT LINK */}
          {onNavigateToOnboarding && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onNavigateToOnboarding}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-[#FF9500] transition-colors cursor-pointer group"
              >
                <span>{language === "en" ? "Want to starting a new Mess? Create New Mess" : "নতুন মেস চালু করতে চান? এখানে অনবোর্ড হোন"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* FAST DEMO PILOT HELPERS BAR */}
          <div className="mt-8 pt-6 border-t border-white/[0.05] relative z-10 text-center">
            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
              <Sparkles className="w-2.5 h-2.5 text-[#FF9500]" />
              <span>Demo Pilot Credentials (SaaS Switchboard)</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              {/* ADMIN FILLER */}
              <button
                onClick={() => loadDemo("admin")}
                className="py-2.5 px-1 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-purple-300 font-bold tracking-tight">Super Admin</span>
              </button>

              {/* MANAGER FILLER */}
              <button
                onClick={() => loadDemo("manager")}
                className="py-2.5 px-1 bg-amber-950/20 hover:bg-amber-950/40 border border-[#FF9500]/20 hover:border-[#FF9500]/40 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#FF9500] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-amber-300 font-bold tracking-tight">Manager Portal</span>
              </button>

              {/* MEMBER FILLER */}
              <button
                onClick={() => loadDemo("member")}
                className="py-2.5 px-1 bg-slate-900/40 hover:bg-slate-800/60 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 group"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-slate-350 font-bold tracking-tight">Standard Member</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* QUICK WHATSAPP HELPLINE ANCHORD LINE */}
      <a
        href="https://wa.me/8801611035490"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-emerald-400 font-mono transition-colors group"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
        <span>Need credentials support? Contact Developer</span>
      </a>
    </motion.div>
  );
}
