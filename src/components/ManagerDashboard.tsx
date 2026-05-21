/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, CalendarDays, ClipboardCheck, Sparkles, Inbox, 
  Trash2, Layers, Check, X, Megaphone, Eye, EyeOff, LayoutGrid, CheckCircle2, Download 
} from "lucide-react";
import { Member, Duty, PaymentProof, ToLetAd } from "../types";
import { translations } from "../data";

interface ManagerDashboardProps {
  language: "en" | "bn";
  members: Member[];
  duties: Duty[];
  paymentProofs: PaymentProof[];
  toLetAds: ToLetAd[];
  messName: string;
  messAddress: string;
  onUpdateMembers: (newMembers: Member[]) => void;
  onUpdateDuties: (newDuties: Duty[]) => void;
  onUpdatePaymentProofs: (newProofs: PaymentProof[]) => void;
  onUpdateToLetAds: (newAds: ToLetAd[]) => void;
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function ManagerDashboard({
  language,
  members,
  duties,
  paymentProofs,
  toLetAds,
  messName,
  messAddress,
  onUpdateMembers,
  onUpdateDuties,
  onUpdatePaymentProofs,
  onUpdateToLetAds,
  addToast,
}: ManagerDashboardProps) {
  const t = translations[language];

  // Shuffling animation state
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  
  // Lightbox screenshot visual preview trigger
  const [inspectProof, setInspectProof] = useState<PaymentProof | null>(null);

  // SeatVacancy Ad Creator
  const [showAdForm, setShowAdForm] = useState<boolean>(false);
  const [adMonth, setAdMonth] = useState<string>("June 2026");
  const [adRoomType, setAdRoomType] = useState<"SINGLE" | "SHARED">("SHARED");
  const [adRent, setAdRent] = useState<number>(3000);
  const [adIsLive, setAdIsLive] = useState<boolean>(true);

  // 1. Fair Auto-Scheduler Roster engine
  const handleAutoAssignRoll = () => {
    if (members.length === 0) {
      addToast(
        language === "en" ? "Cannot assign. No members exist!" : "ডিউটি বণ্টন অসম্ভব, কোনো মেম্বার তালিকাভুক্ত নেই!", 
        "error"
      );
      return;
    }

    setIsShuffling(true);
    addToast(
      language === "en" ? "⚡ Executing unbiased auto-assignment shuffle..." : "⚡ পক্ষপাতহীন কাজের ন্যায্য বণ্টন গণনা করা হচ্ছে...", 
      "info"
    );

    let shuffleCount = 0;
    const interval = setInterval(() => {
      // Simulate rolling cycle names in-UI
      const simulatedDuties = duties.map(d => {
        const cleanRand = members[Math.floor(Math.random() * members.length)];
        const bazarRand = members[Math.floor(Math.random() * members.length)];
        return {
          ...d,
          cleaner: cleanRand.name,
          cleanerId: cleanRand.id,
          bazar: bazarRand.name,
          bazarId: bazarRand.id,
          isDoneCleaner: Math.random() > 0.6,
          isDoneBazar: Math.random() > 0.6,
        };
      });
      onUpdateDuties(simulatedDuties);
      shuffleCount++;

      if (shuffleCount > 10) {
        clearInterval(interval);
        
        // Final balanced assignment: Each member gets equal duties where possible
        const finalizedDuties = duties.map((d, i) => {
          // Shuffle member list to ensure fairness
          const cleanIdx = (i) % members.length;
          const bazarIdx = (i + 1) % members.length;
          return {
            ...d,
            cleaner: members[cleanIdx].name,
            cleanerId: members[cleanIdx].id,
            bazar: members[bazarIdx].name,
            bazarId: members[bazarIdx].id,
            isDoneCleaner: false,
            isDoneBazar: false,
          };
        });

        onUpdateDuties(finalizedDuties);
        setIsShuffling(false);
        addToast(
          language === "en" ? "🎉 Roster balanced and uploaded!" : "🎉 রস্টার সফলভাবে পক্ষপাতহীনভাবে বন্টন করা হয়েছে!", 
          "success"
        );
      }
    }, 150);
  };

  // Toggle single duty status: cleaning or bazar
  const handleToggleDutyStatus = (day: string, type: "cleaner" | "bazar") => {
    const nextDuties = duties.map(d => {
      if (d.day === day) {
        return {
          ...d,
          isDoneCleaner: type === "cleaner" ? !d.isDoneCleaner : d.isDoneCleaner,
          isDoneBazar: type === "bazar" ? !d.isDoneBazar : d.isDoneBazar,
        };
      }
      return d;
    });
    onUpdateDuties(nextDuties);
    addToast(language === "en" ? "Duty status updated!" : "কাজের অগ্রগতি সেভ করা হয়েছে!", "success");
  };

  // 2. Receipt verification actions
  const handleVerifyStatus = (id: string, action: "APPROVE" | "REJECT") => {
    const proof = paymentProofs.find(p => p.id === id);
    if (!proof) return;

    if (action === "APPROVE") {
      // Credit member balance
      const nextMembers = members.map(m => {
        if (m.id === proof.memberId) {
          return { ...m, balance: m.balance + proof.amount };
        }
        return m;
      });
      onUpdateMembers(nextMembers);

      addToast(
        language === "en" 
          ? `Approved! Credited ৳${proof.amount} to ${proof.memberName}` 
          : `অনুমোদিত! ${proof.memberName}-এর ব্যালেন্সে ৳${proof.amount} ক্রেডিট করা হয়েছে`, 
        "success"
      );
    } else {
      addToast(
        language === "en" ? `Rejected deposit proof from ${proof.memberName}` : `${proof.memberName}-এর টাকা ডেপোজিটের প্রমাণ প্রত্যাখ্যান করা হয়েছে`, 
        "error"
      );
    }

    // Set status
    const nextProofs = paymentProofs.map(p => {
      if (p.id === id) {
        return { ...p, status: action === "APPROVE" ? "APPROVED" as const : "REJECTED" as const };
      }
      return p;
    });
    onUpdatePaymentProofs(nextProofs);
    setInspectProof(null); // Close Lightbox
  };

  // 3. Fast toggle sheet meals
  const handleToggleMeal = (memberId: string, mealType: "breakfast" | "lunch" | "dinner") => {
    const nextMembers = members.map(m => {
      if (m.id === memberId) {
        const updatedMeals = {
          ...m.meals,
          [mealType]: !m.meals[mealType]
        };
        // Recount fake monthly meals total
        const diff = updatedMeals[mealType] ? 1 : -1;
        return {
          ...m,
          meals: updatedMeals,
          totalMealsMonth: Math.max(0, m.totalMealsMonth + diff)
        };
      }
      return m;
    });
    onUpdateMembers(nextMembers);
  };

  // 4. Create Broadcast Ad
  const handlePublishAd = (e: FormEvent) => {
    e.preventDefault();
    const newAd: ToLetAd = {
      id: "ad-" + Date.now(),
      messName: messName || "Super Palace Mess",
      address: messAddress || "Mirpur Sector 10, Dhaka",
      rent: adRent,
      availableMonth: adMonth,
      roomType: adRoomType,
      contactPhone: members.find(m => m.role === "MANAGER")?.phone || "01611035490",
      isLive: adIsLive
    };

    onUpdateToLetAds([newAd, ...toLetAds]);
    setShowAdForm(false);
    addToast(t.broadcastSuccessToast, "success");
  };

  const handleExportCSV = () => {
    // Generate beautiful CSV content string using real active member states
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Member Name,Role,Breakfast Active,Lunch Active,Dinner Active,Estimated Balance (BDT)\r\n";
    
    members.forEach((m) => {
      csvContent += `${m.id},"${m.name}",${m.role || "MEMBER"},${m.meals?.breakfast ? "ACTIVE" : "OFF"},${m.meals?.lunch ? "ACTIVE" : "OFF"},${m.meals?.dinner ? "ACTIVE" : "OFF"},${m.balance || 0}\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mess_Meal_Ledger_Cycle_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast(
      language === "en" ? "📊 Meal ledger CSV report exported successfully!" : "📊 মিল লেজার CSV রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!",
      "success"
    );
  };

  const pendingProofs = paymentProofs.filter(p => p.status === "PENDING");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-10 text-left">
      
      {/* 1. WEEKLY DUTY ROSTER MATRIX */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glowing background mesh corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-white/[0.06] mb-6">
          <div>
            <h3 className="text-lg font-bold font-sans text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#FF9500]" />
              {t.dutyMatrixTitle}
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {t.dutyMatrixSubtitle}
            </p>
          </div>

          <button
            onClick={handleAutoAssignRoll}
            disabled={isShuffling}
            className={`py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${isShuffling ? "opacity-60 scale-95" : "hover:shadow-lg hover:shadow-purple-500/10"}`}
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isShuffling ? "animate-spin" : ""}`} />
            <span>{t.autoAssignBtn}</span>
          </button>
        </div>

        {/* 7-Day Duties Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {duties.map((duty) => {
            const dayName = language === "en" ? duty.day : duty.dayBn;
            return (
              <div
                key={duty.day}
                className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle light bar indicative of day */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5" />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-amber-300 font-sans">{dayName}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Duties</span>
                  </div>

                  {/* Cleaner details */}
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-mono text-slate-500">{t.cleanerHeader}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-bold text-slate-200">{duty.cleaner}</span>
                      <button
                        onClick={() => handleToggleDutyStatus(duty.day, "cleaner")}
                        className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer border ${
                          duty.isDoneCleaner
                            ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-950/20 text-rose-300 border-rose-500/15"
                        }`}
                      >
                        {duty.isDoneCleaner ? t.statusDone : t.markDone}
                      </button>
                    </div>
                  </div>

                  {/* Bazar details */}
                  <div className="pt-3 border-t border-white/[0.05]">
                    <span className="text-[10px] uppercase font-mono text-slate-500">{t.bazarHeader}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-bold text-slate-200">{duty.bazar}</span>
                      <button
                        onClick={() => handleToggleDutyStatus(duty.day, "bazar")}
                        className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer border ${
                          duty.isDoneBazar
                            ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-950/20 text-rose-300 border-rose-500/15"
                        }`}
                      >
                        {duty.isDoneBazar ? t.statusDone : t.markDone}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. VERIFICATION SCREENSHOTS INBOX */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
        <div className="pb-5 border-b border-white/[0.06] mb-6">
          <h3 className="text-lg font-bold font-sans text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-purple-400" />
            {t.verificationInboxTitle}
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {t.verificationInboxSubtitle}
          </p>
        </div>

        {pendingProofs.length === 0 ? (
          <div className="py-12 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/[0.05]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
            <span className="text-xs text-slate-500 font-sans block">{t.noProofs}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingProofs.map((sub) => (
              <div
                key={sub.id}
                className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{sub.memberName}</h4>
                      <p className="text-[9px] font-mono text-slate-500">
                        {new Date(sub.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-black text-amber-500 bg-[#FF9500]/10 px-2 py-0.5 rounded border border-[#FF9500]/20">
                      ৳{sub.amount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-[#05070a] p-3 rounded-xl border border-white/[0.04] text-[11px] font-mono select-all">
                    <div>
                      <span className="text-slate-600 block text-[9px]">Channel / পদ্ধতি</span>
                      <span className="text-pink-400 font-bold">{sub.channel}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[9px]">TXID / ট্রানজেকশন</span>
                      <span className="text-purple-300 font-bold">{sub.transactionId}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.04] flex gap-2">
                  {/* Inspect preview action trigger */}
                  <button
                    onClick={() => setInspectProof(sub)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === "en" ? "Inspect Slip" : "রসিদ দেখুন"}</span>
                  </button>

                  <button
                    onClick={() => handleVerifyStatus(sub.id, "APPROVE")}
                    className="py-2 px-3 rounded-xl bg-emerald-600/35 hover:bg-emerald-600 text-emerald-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleVerifyStatus(sub.id, "REJECT")}
                    className="py-2 px-3 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. DAILY MEAL ENTRY SHEET */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-hidden">
        <div className="pb-5 border-b border-white/[0.06] mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold font-sans text-white flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-emerald-400" />
              {t.mealSheetTitle}
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {t.mealSheetSubtitle}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="py-2 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 hover:border-emerald-500/60 text-emerald-300 text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{language === "en" ? "Export Meal Ledger (.CSV)" : "মিল লেজার ডাউনলোড করুন (.CSV)"}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-sans">
            <thead className="bg-white/[0.02] text-[10px] uppercase font-mono text-slate-500 border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Member / সদস্য</th>
                <th className="py-3 px-4 text-center">{t.breakfastLabel}</th>
                <th className="py-3 px-4 text-center">{t.lunchLabel}</th>
                <th className="py-3 px-4 text-center">{t.dinnerLabel}</th>
                <th className="py-3 px-4 text-right">Balance / পেমেন্ট</th>
                <th className="py-3 px-4 text-right">{t.totalMeals}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    <div>
                      {m.name}
                      {m.role === "MANAGER" && (
                        <span className="ml-2 text-[9px] font-mono text-[#FF9500] border border-[#FF9500]/30 px-1 py-0.25 rounded">
                          Manager
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Breakfast toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleMeal(m.id, "breakfast")}
                      className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center font-bold text-xs cursor-pointer border ${
                        m.meals.breakfast 
                          ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" 
                          : "bg-white/[0.02] border-white/10 text-slate-600"
                      }`}
                    >
                      B
                    </button>
                  </td>

                  {/* Lunch toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleMeal(m.id, "lunch")}
                      className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center font-bold text-xs cursor-pointer border ${
                        m.meals.lunch 
                          ? "bg-[#FF9500]/10 border-[#FF9500]/30 text-amber-500" 
                          : "bg-white/[0.02] border-white/10 text-slate-600"
                      }`}
                    >
                      L
                    </button>
                  </td>

                  {/* Dinner toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleMeal(m.id, "dinner")}
                      className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center font-bold text-xs cursor-pointer border ${
                        m.meals.dinner 
                          ? "bg-purple-950/40 border-purple-500/30 text-purple-400" 
                          : "bg-white/[0.02] border-white/10 text-slate-600"
                      }`}
                    >
                      D
                    </button>
                  </td>

                  {/* Outstanding Balance */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    <span className={m.balance >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      ৳{m.balance}
                    </span>
                  </td>

                  {/* Total meals */}
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#FF9500]">
                    {m.totalMealsMonth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SEAT VACANCY & TO-LET CREATOR */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-5 border-b border-white/[0.06] mb-6">
          <div>
            <h3 className="text-lg font-bold font-sans text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FF9500]" />
              {t.seatVacancyTitle}
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              {t.seatVacancySubtitle}
            </p>
          </div>

          <button
            onClick={() => setShowAdForm(!showAdForm)}
            className="py-2 px-4 rounded-xl border border-[#FF9500]/30 hover:bg-[#FF9500]/10 text-[#FF9500] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createAdBtn}</span>
          </button>
        </div>

        {showAdForm && (
          <form onSubmit={handlePublishAd} className="bg-[#05070a]/70 border border-white/[0.08] p-5 rounded-2xl mb-6 space-y-4">
            <h4 className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">Configure Advertisement Slots</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* month */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-sans">{t.adMonthLabel}</label>
                <input
                  type="text"
                  value={adMonth}
                  onChange={(e) => setAdMonth(e.target.value)}
                  className="bg-white/[0.02] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* room category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-sans">{t.roomTypeLabel}</label>
                <select
                  value={adRoomType}
                  onChange={(e) => setAdRoomType(e.target.value as "SINGLE" | "SHARED")}
                  className="bg-[#05070a] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="SHARED">{t.sharedType}</option>
                  <option value="SINGLE">{t.singleType}</option>
                </select>
              </div>

              {/* rent */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-sans">Rent / ভাড়া (৳)</label>
                <input
                  type="number"
                  value={adRent}
                  onChange={(e) => setAdRent(Number(e.target.value))}
                  className="bg-white/[0.02] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Address Pre-filled */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/[0.05]">
              <div>📦 <span className="font-semibold text-slate-400">Fixed Address:</span> {messAddress || "House 42, Mirpur 10, Dhaka"}</div>
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-slate-300 font-sans">{t.makeAdLive}</span>
              <button
                type="button"
                onClick={() => setAdIsLive(!adIsLive)}
                className={`w-10 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors ${adIsLive ? "bg-emerald-500" : "bg-slate-700"}`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform ${adIsLive ? "translate-x-4.5" : "translate-x-0"}`} />
              </button>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-[#FF9500] text-black font-extrabold text-xs rounded-xl cursor-pointer hover:shadow-lg transition-all"
            >
              🚀 PUBLISH VACANCY / বিজ্ঞাপন লাইভ করুন
            </button>
          </form>
        )}

        {/* Mini Table list showing currently posted Ads */}
        <div className="space-y-3">
          {toLetAds.filter(ad => ad.messName === (messName || "Green Palace Mess")).map((ad) => (
            <div key={ad.id} className="bg-white/[0.01] border border-white/[0.04] p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20 mr-2">
                  {ad.roomType}
                </span>
                <span className="text-xs font-bold text-slate-200">{ad.availableMonth} slot vacancy</span>
                <p className="text-[10px] text-slate-500 mt-0.5 italic">{ad.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#FF9500]">৳{ad.rent}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/15 rounded">
                  LIVE IN FINDER
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECEIPT INSPECTION LIGHTBOX MODAL */}
      <AnimatePresence>
        {inspectProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#05070a] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setInspectProof(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-sm font-sans font-bold text-amber-100 uppercase tracking-wider mb-4">
                {t.receiptLightboxTitle}
              </h4>

              {/* Simulated visual deposit slip coupon */}
              <div className="bg-gradient-to-br from-purple-950/20 to-pink-950/20 border border-white/[0.08] p-5 rounded-2xl mb-5 text-center relative overflow-hidden">
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest block mb-1">bKash/Nagad digital receipt gateway</span>
                <div className="text-2xl font-mono font-black text-rose-300 my-2">৳{inspectProof.amount}</div>
                <div className="inline-block py-1 px-3 bg-white/5 rounded-full text-[10px] font-mono text-slate-400 border border-white/[0.04]">
                  TxID: {inspectProof.transactionId}
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.05] text-left text-[11px] space-y-1.5 font-mono text-slate-400">
                  <div>👤 Sent by: <span className="text-white font-bold">{inspectProof.memberName}</span></div>
                  <div>📅 Sent at: <span className="text-white">{new Date(inspectProof.submittedAt).toLocaleDateString()} {new Date(inspectProof.submittedAt).toLocaleTimeString()}</span></div>
                  <div>🏷️ Status: <span className="text-pink-300 font-extrabold uppercase">{inspectProof.status}</span></div>
                </div>

                {/* Simulated Visual Screenshot receipt image */}
                <div className="mt-4 p-6 bg-[#05070a] border-2 border-dashed border-white/[0.1] rounded-xl flex flex-col items-center justify-center font-mono text-slate-600">
                  <CheckCircle2 className="w-8 h-8 text-[#FF9500] mb-2" />
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">MFLOW TRANSACTION ENVELOPE</span>
                  <span className="text-[9px] text-slate-500">MOCK_RECEIPT_SLIP_VERIFIED_MD5.PNG</span>
                </div>
              </div>

              {/* Actions inside lightbox */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerifyStatus(inspectProof.id, "APPROVE")}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Accept & Update Balance
                </button>
                <button
                  onClick={() => handleVerifyStatus(inspectProof.id, "REJECT")}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-500/20 transition-colors cursor-pointer text-center"
                >
                  Reject & Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
