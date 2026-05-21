/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Users, MapPin, Phone, DollarSign, Calendar, ShieldCheck, 
  Trash2, UserPlus, Share2, Sparkles, ChevronRight, ChevronLeft 
} from "lucide-react";
import { OnboardingState, CostMatrix } from "../types";
import { translations, defaultOnboarding } from "../data";

interface OnboardingWizardProps {
  language: "en" | "bn";
  onOnboardingComplete: (onboardState: OnboardingState) => void;
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function OnboardingWizard({ language, onOnboardingComplete, addToast }: OnboardingWizardProps) {
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [messName, setMessName] = useState<string>("");
  const [totalSeats, setTotalSeats] = useState<number>(5);
  const [address, setAddress] = useState<string>("");
  const [managerPhone, setManagerPhone] = useState<string>("");
  
  // Cost matrix
  const [costs, setCosts] = useState<CostMatrix>({
    houseRent: 15000,
    maidSalary: 3500,
    wifi: 500,
    utility: 3000,
    wasteBill: 500,
  });

  const [mealDeadline, setMealDeadline] = useState<string>("সকাল ১০:০০ টা (10:00 AM)");
  const [rulesText, setRulesText] = useState<string>(
    "১. রাত ১০:০০ টার আগে বাইরে থাকলে জানাবেন।\n২. ওয়াশরুম ও রান্নাঘর পরিষ্কার রাখতে হবে।\n৩. অতিথি হোস্টল বা মেসে নিয়ে আসার পূর্বে জানাবেন।"
  );

  // Members lists
  const [tempMemberName, setTempMemberName] = useState<string>("");
  const [tempMemberPhone, setTempMemberPhone] = useState<string>("");
  const [inviteList, setInviteList] = useState<Array<{ name: string; phone: string }>>([
    { name: "Tanvir Rahman", phone: "01722334455" },
    { name: "Shakil Ahmed", phone: "01511223344" }
  ]);

  const joinCode = "MFLOW-98X2";
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Helper calculation
  const totalFixedCost = 
    (Number(costs.houseRent) || 0) + 
    (Number(costs.maidSalary) || 0) + 
    (Number(costs.wifi) || 0) + 
    (Number(costs.utility) || 0) + 
    (Number(costs.wasteBill) || 0);

  const estimatedPerSeatCost = Math.round(totalFixedCost / (totalSeats || 1));

  const handleCostChange = (field: keyof CostMatrix, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setCosts(prev => ({ ...prev, [field]: num }));
  };

  const handleAddInvite = () => {
    if (!tempMemberName || !tempMemberPhone) {
      addToast(
        language === "en" ? "Please fill both Member Name and Phone" : "অনুগ্রহ করে মেম্বারের নাম এবং মোবাইল নাম্বার দুটোই লিখুন",
        "warning"
      );
      return;
    }
    setInviteList(prev => [...prev, { name: tempMemberName, phone: tempMemberPhone }]);
    addToast(
      language === "en" ? `Added ${tempMemberName} to list` : `${tempMemberName}-কে তালিকায় যুক্ত করা হয়েছে`,
      "success"
    );
    setTempMemberName("");
    setTempMemberPhone("");
  };

  const handleRemoveInvite = (idx: number) => {
    setInviteList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!messName.trim()) {
        addToast(language === "en" ? "Please enter your Mess Name" : "মেসের নাম পূরণ করুন", "warning");
        return;
      }
      if (!address.trim()) {
        addToast(language === "en" ? "Please enter your address" : "মেসের ঠিকানা দিন", "warning");
        return;
      }
      if (!managerPhone.trim()) {
        addToast(language === "en" ? "Please provide your active mobile number" : "ম্যানেজারের সচল মোবাইল নাম্বার দিন", "warning");
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleLaunch = () => {
    // Confetti effect trigger
    setShowConfetti(true);
    addToast(
      language === "en" ? "🚀 Hurrah! Mess Flow setup completed successfully!" : "🚀 মেস অনবোর্ডিং সেটআপ সফলভাবে সম্পন্ন হয়েছে!",
      "success"
    );

    setTimeout(() => {
      onOnboardingComplete({
        messName,
        totalSeats,
        address,
        managerPhone,
        costs,
        mealDeadline,
        rulesText,
        members: inviteList,
        joinCode,
        isCompleted: true
      });
    }, 2500);
  };

  const handleShareWhatsApp = () => {
    const text = language === "en" 
      ? `Hey! Join our new mess "${messName}" on Mess Flow App with the secure code: ${joinCode}`
      : `আসসালামু আলাইকুম! মেস ফ্লো অ্যাপে আমাদের নতুন মেস "${messName}" এ জয়েন করুন। কোড: ${joinCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    addToast(language === "en" ? "Redirecting to WhatsApp..." : "WhatsApp-এ শেয়ার করার জন্য রিডিরেক্ট করা হচ্ছে...", "info");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      
      {/* Confetti Celebration Overlay */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none flex items-center justify-center">
          {Array.from({ length: 90 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: ["#FF9500", "#8B5CF6", "#10B981", "#EC4899", "#3B82F6"][i % 5],
              }}
              initial={{
                x: 0,
                y: 100,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: (Math.random() - 0.5) * window.innerWidth * 0.8,
                y: -(Math.random()) * window.innerHeight * 0.8,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Header Info */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white mb-2">
          {t.onboardingTitle}
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          {t.onboardingSubtitle}
        </p>
      </div>

      {/* Wizard Steps indicator bar */}
      <div className="grid grid-cols-4 gap-2 mb-10 overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.04] p-1.5 backdrop-blur-sm">
        {[1, 2, 3, 4].map((s) => {
          const isActive = step === s;
          const isDone = s < step;
          const stepTitle = [t.step1Title, t.step2Title, t.step3Title, t.step4Title][s - 1];
          const stepDesc = [t.step1Desc, t.step2Desc, t.step3Desc, t.step4Desc][s - 1];

          return (
            <div
              key={s}
              className={`p-2.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-[#FF9500]/30" 
                  : isDone 
                    ? "bg-emerald-950/20 border border-emerald-500/20" 
                    : "border border-transparent"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 text-[10px] font-mono font-bold flex items-center justify-center rounded-full ${
                  isActive 
                    ? "bg-[#FF9500] text-black" 
                    : isDone 
                      ? "bg-emerald-500 text-black" 
                      : "bg-white/10 text-white/50"
                }`}>
                  {s}
                </span>
                <span className={`text-xs font-bold hidden md:inline ${isActive ? "text-[#FF9500]" : isDone ? "text-emerald-400" : "text-slate-500"}`}>
                  {stepTitle}
                </span>
              </div>
              <p className="text-[9px] font-mono text-slate-500 mt-1 hidden lg:block text-center">{stepDesc}</p>
            </div>
          );
        })}
      </div>

      {/* Content Area with Glass Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Aesthetic background mesh glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF9500]/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="relative z-10"
          >
            
            {/* STEP 1: BASIC PROFILE SETUP */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                  <Building2 className="w-5 h-5 text-[#FF9500]" />
                  <h3 className="text-lg font-bold font-sans text-amber-100">
                    {language === "en" ? "Step 1: Mess Profile & Configuration" : "ধাপ ১: মেস প্রোফাইল এবং সেটআপ"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mess Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold font-sans text-slate-300">
                      {t.messNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={messName}
                      onChange={(e) => setMessName(e.target.value)}
                      placeholder={t.messNamePlaceholder}
                      className="w-full bg-[#05070a]/90 text-slate-100 border border-white/[0.1] rounded-xl px-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#FF9500]"
                    />
                  </div>

                  {/* Total Seats with +/- counter widget */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold font-sans text-slate-300">
                      {t.totalSeatsLabel}
                    </label>
                    <div className="flex items-center gap-3 bg-[#05070a]/90 border border-white/[0.1] rounded-xl px-2.5 py-1.5 max-w-[150px]">
                      <button
                        onClick={() => setTotalSeats(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-extrabold text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-[#FF9500] font-mono">{totalSeats}</span>
                      <button
                        onClick={() => setTotalSeats(prev => Math.max(1, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-extrabold text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-semibold font-sans text-slate-300">
                      {t.addressLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t.addressPlaceholder}
                        className="w-full bg-[#05070a]/90 text-slate-100 border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#FF9500]"
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold font-sans text-slate-300">
                      {t.phoneLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={managerPhone}
                        onChange={(e) => setManagerPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        className="w-full bg-[#05070a]/90 text-slate-100 border border-white/[0.1] rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#FF9500] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FIXED COST MATRIX & CALCULATOR */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-5 h-5 text-[#8B5CF6]" />
                    <h3 className="text-lg font-bold font-sans text-amber-100">
                      {language === "en" ? "Step 2: Fixed Monthly Expenses" : "ধাপ ২: ইউটিলিটি ও ফিক্সড খরচসমূহ"}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Costs inputs column */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* houseRent */}
                    <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                      <label className="text-xs font-sans text-slate-300 flex-1">{t.houseRentLabel}</label>
                      <input
                        type="number"
                        value={costs.houseRent}
                        onChange={(e) => handleCostChange("houseRent", e.target.value)}
                        className="bg-[#05070a] text-right text-[#FF9500] font-mono border border-white/[0.1] focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-1.5 w-32 focus:outline-none"
                      />
                    </div>

                    {/* maidSalary */}
                    <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                      <label className="text-xs font-sans text-slate-300 flex-1">{t.maidSalaryLabel}</label>
                      <input
                        type="number"
                        value={costs.maidSalary}
                        onChange={(e) => handleCostChange("maidSalary", e.target.value)}
                        className="bg-[#05070a] text-right text-[#FF9500] font-mono border border-white/[0.1] focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-1.5 w-32 focus:outline-none"
                      />
                    </div>

                    {/* wifi */}
                    <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                      <label className="text-xs font-sans text-slate-300 flex-1">{t.wifiLabel}</label>
                      <input
                        type="number"
                        value={costs.wifi}
                        onChange={(e) => handleCostChange("wifi", e.target.value)}
                        className="bg-[#05070a] text-right text-[#FF9500] font-mono border border-white/[0.1] focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-1.5 w-32 focus:outline-none"
                      />
                    </div>

                    {/* utility */}
                    <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                      <label className="text-xs font-sans text-slate-300 flex-1">{t.utilityLabel}</label>
                      <input
                        type="number"
                        value={costs.utility}
                        onChange={(e) => handleCostChange("utility", e.target.value)}
                        className="bg-[#05070a] text-right text-[#FF9500] font-mono border border-white/[0.1] focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-1.5 w-32 focus:outline-none"
                      />
                    </div>

                    {/* wasteBill */}
                    <div className="flex items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                      <label className="text-xs font-sans text-slate-300 flex-1">{t.wasteBillLabel}</label>
                      <input
                        type="number"
                        value={costs.wasteBill}
                        onChange={(e) => handleCostChange("wasteBill", e.target.value)}
                        className="bg-[#05070a] text-right text-[#FF9500] font-mono border border-white/[0.1] focus:ring-1 focus:ring-purple-500 rounded-lg px-3 py-1.5 w-32 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* CRUCIAL LIVE CALC FLOATING CARD */}
                  <div className="lg:col-span-1" />
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <div className="bg-gradient-to-br from-purple-950/30 to-amber-950/20 backdrop-blur-2xl border-2 border-purple-500/25 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                      {/* Mini light beam indicator */}
                      <span className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-purple-400 to-[#FF9500] animate-pulse rounded-full" />
                      
                      <div className="text-center">
                        <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          {t.fixedCalcTitle}
                        </h4>

                        <div className="my-4">
                          <p className="text-[10px] text-slate-400 leading-tight mb-2 italic">
                            {t.fixedCalcFormula}
                          </p>
                          <div className="text-3xl font-mono font-extrabold text-[#FF9500] tracking-tight">
                            ৳{estimatedPerSeatCost}
                            <span className="text-xs text-slate-400 font-sans block mt-1 tracking-normal font-medium">
                              {language === "en" ? "per seat per month" : "প্রতি সিট / প্রতি মাসে"}
                            </span>
                          </div>
                        </div>

                        <div className="text-left bg-[#05070a]/60 rounded-xl p-3 space-y-1.5 border border-white/[0.04]">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-sans">{t.totalFixedText}:</span>
                            <span className="font-mono font-bold text-slate-300">৳{totalFixedCost}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-white/[0.05]">
                            <span className="text-slate-500 font-sans">{t.totalSeatsLabel}:</span>
                            <span className="font-mono font-bold text-slate-100">{totalSeats} {language === "en" ? "Seats" : "সিট"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: RULES & CONFIG */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                  <Calendar className="w-5 h-5 text-[#FF9500]" />
                  <h3 className="text-lg font-bold font-sans text-amber-100">
                    {language === "en" ? "Step 3: Meal Restrictions and Rules" : "ধাপ ৩: মিলের সময়সীমা ও নিয়ামাবলী"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lock-in Deadline */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold font-sans text-slate-300">
                      {t.mealDeadlineLabel}
                    </label>
                    <select
                      value={mealDeadline}
                      onChange={(e) => setMealDeadline(e.target.value)}
                      className="w-full bg-[#05070a]/90 text-[#FF9500] font-sans border border-white/[0.1] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#FF9500]"
                    >
                      <option value="সকাল ০৯:০০ টা (09:00 AM)">সকাল ০৯:০০ টা (09:00 AM)</option>
                      <option value="সকাল ১০:০০ টা (10:00 AM)">سকাল ১০:০০ টা (10:00 AM)</option>
                      <option value="সকাল ১১:০০ টা (11:00 AM)">সকাল ১১:০০ টা (11:00 AM)</option>
                    </select>
                    <p className="text-[10px] text-slate-500 italic">
                      {language === "en" 
                        ? "Members cannot switch meal toggles for the same day after this deadline." 
                        : "মেম্বাররা এই সময়ের পরে আজকের দিনের মিল অফ বা অন করার সুবিধা পাবেন না।"}
                    </p>
                  </div>

                  {/* Rules board textarea */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-semibold font-sans text-slate-300">
                      {t.rulesNoticeLabel}
                    </label>
                    <textarea
                      rows={5}
                      value={rulesText}
                      onChange={(e) => setRulesText(e.target.value)}
                      placeholder={t.rulesNoticePlaceholder}
                      className="w-full bg-[#05070a]/90 text-slate-100 border border-white/[0.1] rounded-xl p-4 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#FF9500] leading-relaxed text-sm font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MEMBER INVITE & LAUNCH */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold font-sans text-amber-100">
                    {language === "en" ? "Step 4: Launch and Share Connection Code" : "ধাপ ৪: মেম্বার আমন্ত্রণ তালিকা ও মেস স্টার্ট"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form to append invitations */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-purple-300 uppercase tracking-widest">
                      {t.addMemberTitle}
                    </h4>

                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] text-slate-400 font-sans">{t.memberNameLabel}</label>
                      <input
                        type="text"
                        value={tempMemberName}
                        onChange={(e) => setTempMemberName(e.target.value)}
                        placeholder="e.g., Sihab Hossain"
                        className="bg-[#05070a] text-slate-200 text-sm border border-white/[0.1] rounded-xl px-3 py-2 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] text-slate-400 font-sans">{t.memberPhoneLabel}</label>
                      <input
                        type="text"
                        value={tempMemberPhone}
                        onChange={(e) => setTempMemberPhone(e.target.value)}
                        placeholder="e.g., 017xxxxxxxx"
                        className="bg-[#05070a] text-slate-200 text-sm border border-white/[0.1] rounded-xl px-3 py-2 focus:outline-none font-mono"
                      />
                    </div>

                    <button
                      onClick={handleAddInvite}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-center text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      {t.addMemberBtn}
                    </button>
                  </div>

                  {/* List of pending invitations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      {t.membersListTitle} ({inviteList.length})
                    </h4>
                    <div className="bg-[#05070a] border border-white/[0.1] rounded-2xl p-4 max-h-[190px] overflow-y-auto space-y-2">
                      {inviteList.length === 0 ? (
                        <p className="text-xs text-slate-600 text-center italic py-4">
                          No members queued. You can run solo first!
                        </p>
                      ) : (
                        inviteList.map((m, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-slate-200">{m.name}</p>
                              <p className="text-[10px] font-mono text-slate-500">{m.phone}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveInvite(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Highly styled Join Code Box */}
                <div className="mt-8 bg-white/[0.01] border border-white/[0.06] rounded-3xl p-5 text-center">
                  <span className="text-xs font-mono text-[#FF9500] uppercase tracking-wider block mb-2">
                    {t.joinCodeTitle}
                  </span>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-lg mx-auto mb-4">
                    {/* Unique Join Code Visual representation */}
                    <div className="bg-[#05070a] border border-dashed border-purple-500/40 text-2xl font-mono font-black tracking-widest text-[#FF9500] px-8 py-3 rounded-2xl shadow-inner select-all">
                      {joinCode}
                    </div>

                    <button
                      onClick={handleShareWhatsApp}
                      className="py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Share2 className="w-4 h-4" />
                      {t.shareWhatsApp}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer buttons within Glass Card */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="py-2.5 px-5 rounded-xl border border-white/[0.1] hover:bg-white/5 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {language === "en" ? "Previous Step" : "আগের ধাপ"}
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>{language === "en" ? "Continue" : "পরবর্তী ধাপ"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleLaunch}
                  disabled={showConfetti}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#FF9500] via-amber-500 to-[#8B5CF6] text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xl shadow-[#FF9500]/10 hover:shadow-[#8B5CF6]/10 active:scale-95 transition-all select-none disabled:opacity-55"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                  <span>{t.launchWorkspace}</span>
                </button>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
