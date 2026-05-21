/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, X } from "lucide-react";
import { UserRole } from "../types";
import { translations } from "../data";

interface HeaderProps {
  currentRole: UserRole;
  language: "en" | "bn";
  isSuperAdminUnlocked: boolean;
  onRoleChange: (role: any) => void;
  onLanguageToggle: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  simulationView?: UserRole | "ONBOARDING" | "LOGIN" | "HOME";
}

export default function Header({
  currentRole,
  language,
  isSuperAdminUnlocked,
  onRoleChange,
  onLanguageToggle,
  onLogout,
  isLoggedIn,
  simulationView = "HOME",
}: HeaderProps) {
  const t = translations[language];
  const [showRulesModal, setShowRulesModal] = useState(false);

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "PUBLIC_GUEST":
        return language === "en" ? "Guest Seat Finder" : "গেস্ট সিট ফাইন্ডার";
      case "MEMBER":
        return language === "en" ? "Member Desk" : "মেম্বার ডেস্ক";
      case "MANAGER":
        return language === "en" ? "Manager Portal" : "ম্যানেজার পোর্টাল";
      case "SUPER_ADMIN":
        return language === "en" ? "Super Admin" : "সুপার এডমিন";
      default:
        return role;
    }
  };

  // Pre-defined premium list of core policies for the glassmorphic Rules Modal
  const rulesList = [
    {
      id: 1,
      tag: "Time Limits",
      textEn: "Daily meal lock-in active after 10:00 AM sharp. Changes apply for the next roster cycles.",
      textBn: "প্রতিদিন সকাল ১০টার পর মিল লক হয়ে যায়। এরপর কোনো পরিবর্তন করলে তা পরবর্তী তালিকার অন্তর্ভুক্ত হবে।",
    },
    {
      id: 2,
      tag: "Guests Rule",
      textEn: "No outside guests allowed in rooms after 10:00 PM without manager's formal approval.",
      textBn: "ম্যানেজারের পূর্ব অনুমতি ব্যতীত রাত ১০টার পর বহিরাগত কারো মেসে অবস্থান নিষেধ।",
    },
    {
      id: 3,
      tag: "Duty Cycle",
      textEn: "Weekly cleaning and bazar duties are fairly auto-assigned by the system with zero bias.",
      textBn: "সাপ্তাহিক বাজার ও ঝাড়ু দেবার কাজের দায়িত্ব সিস্টেম কর্তৃক অটো-অ্যাসাইন ও সমবণ্টন করা হয়।",
    },
    {
      id: 4,
      tag: "Clear Ledger",
      textEn: "All payment screenshot proof must be verified by the manager before updating the wallet.",
      textBn: "সকল পেমেন্ট রসিদের স্ক্রিনশট ম্যানেজার দ্বারা অনুমোদিত হওয়ার পরই ওয়ালেটে যুক্ত হবে।",
    },
    {
      id: 5,
      tag: "Strict Curfew",
      textEn: "Main entrance gate is locked at 11:30 PM for safety. Inform manager in case of emergencies.",
      textBn: "নিরাপত্তার স্বার্থে রাত ১১:৩০ মিনিটে মেসের মূল ফটক বন্ধ করে দেওয়া হয়।",
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#05070a]/90 backdrop-blur-md border-b border-white/[0.08] shadow-xl px-4 py-3 flex items-center justify-between gap-4 transition-all duration-300 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo element is shrink-0 to never compress */}
          <div 
            onClick={() => onRoleChange("HOME")}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF9500] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#FF9500]/15 shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xs tracking-wider">MF</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[15px] font-black font-sans tracking-tight text-white group-hover:text-amber-400 transition-colors flex items-center gap-0.5">
                  Mess Flow<span className="text-[#FF9500]">⚡</span>
                </h1>
                <span className="text-[8px] font-mono font-bold tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full uppercase">
                  SaaS v1.1
                </span>
              </div>
            </div>
          </div>

          {/* Unified horizontal scrollable row with all tabs on ONE line (both mobile & desktop) */}
          <div className="flex-1 overflow-x-auto whitespace-nowrap flex items-center gap-2 px-1 py-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-end">
            
            {/* 1. প্রচ্ছদ হোম */}
            <button
              onClick={() => onRoleChange("HOME")}
              className={`text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer shrink-0 ${
                simulationView === "HOME"
                  ? "text-[#FF9500] bg-white/[0.06] border border-[#FF9500]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {language === "en" ? "Home" : "প্রচ্ছদ হোম"}
            </button>

            {/* 2. লগইন / Sign Up */}
            <button
              onClick={() => onRoleChange("LOGIN")}
              className={`text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer shrink-0 ${
                simulationView === "LOGIN"
                  ? "text-[#FF9500] bg-white/[0.06] border border-[#FF9500]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {language === "en" ? "Login" : "লগইন"}
            </button>

            {/* 3. খালি সিট খুঁজুন */}
            <button
              onClick={() => onRoleChange("PUBLIC_GUEST")}
              className={`text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer shrink-0 ${
                simulationView === "PUBLIC_GUEST"
                  ? "text-[#FF9500] bg-white/[0.06] border border-[#FF9500]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {language === "en" ? "Find Seat" : "খালি সিট খুঁজুন"}
            </button>

            {/* 4. নতুন মেস তৈরি করুন */}
            <button
              onClick={() => onRoleChange("ONBOARDING")}
              className={`text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer shrink-0 ${
                simulationView === "ONBOARDING"
                  ? "text-[#FF9500] bg-white/[0.06] border border-[#FF9500]/30"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {language === "en" ? "Create Mess" : "নতুন মেস তৈরি করুন"}
            </button>

            {/* 5. লাইভ নোটিশ ও রুলস */}
            <button
              onClick={() => setShowRulesModal(true)}
              className="text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.02] transition-all duration-200 cursor-pointer shrink-0"
            >
              {language === "en" ? "Live Rules" : "লাইভ নোটিশ ও রুলস"}
            </button>

            {/* 6. বাংলা / English (ভাষা) Toggle Switch */}
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-white/[0.08] hover:border-white/[0.22] hover:bg-white/[0.04] text-[10px] font-black text-white hover:text-[#FF9500] cursor-pointer transition-all bg-[#05070a]/40 shrink-0"
              title="Toggle Bangla / English UI"
            >
              🌐 <span className={language === "en" ? "text-[#FF9500]" : "text-slate-400"}>EN</span>
              <span className="text-white/20">|</span>
              <span className={language === "bn" ? "text-[#FF9500]" : "text-slate-400"}>বাং</span>
            </button>

            {/* 7. যোগাযোগ করুন */}
            <a
              href="https://wa.me/8801611035490"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-extrabold uppercase py-1.5 px-3 rounded-lg text-slate-300 hover:text-emerald-400 bg-[#25D366]/5 border border-[#25D366]/20 hover:bg-[#25D366]/15 hover:border-[#25D366]/40 transition-all duration-200 cursor-pointer flex items-center gap-1 shrink-0"
            >
              🟢 {language === "en" ? "Contact" : "যোগাযোগ করুন"}
            </a>

            {/* Premium session states displayed as extra horizontal scroll tags to login / logout */}
            {isLoggedIn && (
              <>
                <div className="h-4 w-[1px] bg-white/10 shrink-0" />
                <button
                  onClick={() => onRoleChange(currentRole)}
                  className="py-1.5 px-3 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black rounded-lg shrink-0 hover:bg-purple-500/20"
                >
                  👑 {getRoleDisplayName(currentRole)}
                </button>
                <button
                  onClick={onLogout}
                  className="py-1.5 px-3 rounded-lg bg-red-950/20 border border-red-500/20 hover:border-red-500/40 text-rose-300 text-[10px] font-black shrink-0 active:scale-[0.97] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="text-[8px]">❌</span>
                  <span>{language === "en" ? "Exit" : "লগআউট"}</span>
                </button>
              </>
            )}

          </div>
        </div>
      </header>

      {/* --- LIVE RULES & POLICY DIALOG MODAL --- */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesModal(false)}
              className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md"
            />

            {/* Rules Modal Box with rich glowing border ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-xl bg-[#090d16] border border-white/[0.08] rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl z-10"
            >
              {/* Outer light beam nodes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9500]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button top-right */}
              <button
                onClick={() => setShowRulesModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/20 flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight text-left">
                    {language === "en" ? "📝 Live Rules & Mess Policy Board" : "📝 লাইভ নোটিশ ও মেস নীতিমালা"}
                  </h3>
                  <p className="text-xs text-slate-400 text-left">
                    {language === "en" ? "Active guidelines and cohousing parameters" : "মেসের সব মেম্বারদের জন্য প্রযোজ্য নির্দেশনা"}
                  </p>
                </div>
              </div>

              {/* Policy List rows */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {rulesList.map((rule) => (
                  <div 
                    key={rule.id}
                    className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/[0.1] text-left transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400 bg-purple-500/10 py-0.5 px-2.5 rounded-full">
                        {rule.tag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Rule #{rule.id}
                      </span>
                    </div>
                    <p className="text-xs md:text-xs text-slate-200 leading-relaxed font-sans font-medium">
                      {language === "en" ? rule.textEn : rule.textBn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Confirmation / Info Close block */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>⚡ Auto-enforced by policy algorithms</span>
                <button
                  onClick={() => setShowRulesModal(false)}
                  className="py-1.5 px-4 bg-gradient-to-r from-[#FF9500] to-[#8B5CF6] hover:from-[#FF9500]/90 hover:to-[#8B5CF6]/90 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {language === "en" ? "Acknowledge" : "বুঝেছি ধন্যবাদ"}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
