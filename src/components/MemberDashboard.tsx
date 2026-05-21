/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Coins, Send, Receipt, Ban, Flame, Award, 
  Crown, HelpCircle, Check, Printer, FileDown, Download, Sparkles 
} from "lucide-react";
import { Member, PaymentProof } from "../types";
import { translations } from "../data";

interface MemberDashboardProps {
  language: "en" | "bn";
  loggedInMemberId: string;
  members: Member[];
  paymentProofs: PaymentProof[];
  onSubmitDeposit: (proof: PaymentProof) => void;
  onUpdateMembers: (newMembers: Member[]) => void;
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function MemberDashboard({
  language,
  loggedInMemberId,
  members,
  paymentProofs,
  onSubmitDeposit,
  onUpdateMembers,
  addToast,
}: MemberDashboardProps) {
  const t = translations[language];

  // Current logged in member
  const currentMember = members.find(m => m.id === loggedInMemberId) || members[1]; // fallback

  // Modal Deposit controller
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositChannel, setDepositChannel] = useState<"bKash" | "Nagad">("bKash");
  const [txnId, setTxnId] = useState<string>("");

  // Simulation state for meal lock timeline testing
  const [simulatedHour, setSimulatedHour] = useState<number>(9); // 9 AM default (unlocked)

  // Printable receipt state
  const [selectedReceiptPrint, setSelectedReceiptPrint] = useState<PaymentProof | null>(null);

  // Self Service meal switches
  const handleToggleSelfMeal = (mealType: "breakfast" | "lunch" | "dinner") => {
    // Check if after 10:00 AM
    const isPastDeadline = simulatedHour >= 10;

    if (isPastDeadline) {
      addToast(
        language === "en" 
          ? "⚠️ Cannot alter: Meal lock is active post-10:00 AM cutoff time." 
          : "⚠️ পরিবর্তন অসম্ভব: সকাল ১০:০০ টার ডেডলাইন পার হওয়ায় মিল রস্টার লকড করা হয়েছে।", 
        "error"
      );
      return;
    }

    const nextMembers = members.map(m => {
      if (m.id === currentMember.id) {
        const nextMeals = {
          ...m.meals,
          [mealType]: !m.meals[mealType]
        };
        const diff = nextMeals[mealType] ? 1 : -1;
        return {
          ...m,
          meals: nextMeals,
          totalMealsMonth: Math.max(0, m.totalMealsMonth + diff)
        };
      }
      return m;
    });

    onUpdateMembers(nextMembers);
    addToast(language === "en" ? "Meal schedule saved!" : "মিলের সময়সূচী আপডেট করা হয়েছে!", "success");
  };

  const handleDepositSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!txnId) {
      addToast(language === "en" ? "Please fill the Transaction ID" : "ট্রানজেকশন আইডি প্রদান করুন", "warning");
      return;
    }

    const newProof: PaymentProof = {
      id: "proof-" + Date.now(),
      memberName: currentMember.name,
      memberId: currentMember.id,
      amount: Number(depositAmount),
      channel: depositChannel,
      transactionId: txnId.toUpperCase(),
      screenshotUrl: "bkash_receipt_mock.png",
      status: "PENDING",
      submittedAt: new Date().toISOString()
    };

    onSubmitDeposit(newProof);
    setShowDepositModal(false);
    setTxnId("");
    addToast(t.submitProofConfirm, "success");
  };

  // Generate automated prefilled TXID
  const handleQuickTxId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let tid = "BK";
    for (let i = 0; i < 7; i++) {
      tid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTxnId(tid);
  };

  const myReceipts = paymentProofs.filter(p => p.memberId === currentMember.id && p.status === "APPROVED");

  // Print trigger
  const handlePrintAction = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-10 text-left">
      
      {/* 1. MY WALLET BALANCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Wallet balance display card */}
        <div className={`md:col-span-4 bg-gradient-to-br rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-550 border ${
          currentMember.balance < 0
            ? "from-rose-950/40 to-red-950/20 border-red-500/55 shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-pulse"
            : "from-purple-950/20 to-amber-950/10 border-white/[0.08]"
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF9500]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">{t.myBalance} / আমার ব্যালেন্স</span>
            <div className={`text-4xl font-mono font-black mt-2 tracking-tight ${currentMember.balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ৳{currentMember.balance}
            </div>
            
            <p className="text-[10px] font-sans mt-2">
              {currentMember.balance >= 0 ? (
                <span className="text-slate-500">
                  {language === "en" ? "🎉 In surplus. No food delays expected." : "🎉 ব্যালেন্স ইতিবাচক রয়েছে। কোনো মিল আটকের ভয় নেই।"}
                </span>
              ) : (
                <span className="text-rose-400 font-bold animate-pulse">
                  {language === "en" ? "⚠️ Please pay your dues" : "⚠️ বকেয়া টাকা পরিশোধ করুন"}
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => {
              setShowDepositModal(true);
              handleQuickTxId(); // Pre-generate stylish ID for quick UX
            }}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF9500] hover:from-purple-600 hover:to-purple-500 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-[0.98]"
          >
            <Coins className="w-4 h-4" />
            <span>{t.submitDepositBtn}</span>
          </button>
        </div>

        {/* Self Service meal schedules toggles */}
        <div className="md:col-span-8 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
              <div>
                <h3 className="text-md font-bold font-sans text-slate-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF9500]" />
                  {t.selfServiceMeals}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">
                  {language === "en" ? "Self Service meal switches automatically locks at 10:00 AM" : "মেসের মিলের তালিকা প্রতিদিন সকাল ১০:০০ টায় লক হয়ে যায়"}
                </p>
              </div>

              {/* Time simulation toggler */}
              <div className="flex items-center gap-1.5 p-1 bg-[#05070a]/90 rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedHour(9);
                    addToast(language === "en" ? "⏰ Time set to 9:00 AM (Unlocked)" : "⏰ সময় নির্ধারণ: সকাল ৯:০০ টা (আনলকড)", "info");
                  }}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-lg cursor-pointer transition-all ${simulatedHour < 10 ? "bg-[#FF9500] text-black" : "text-slate-400 hover:text-white"}`}
                >
                  9:00 AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedHour(11);
                    addToast(language === "en" ? "🔒 Time set to 11:30 AM (Locked)" : "🔒 সময় নির্ধারণ: সকাল ১১:৩০ টা (লকড)", "warning");
                  }}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded-lg cursor-pointer transition-all ${simulatedHour >= 10 ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  11:30 AM
                </button>
              </div>
            </div>

            {/* Countdown notice banner */}
            <div className={`mb-6 p-3 rounded-xl text-[11px] italic font-sans flex items-start gap-2 max-w-xl border ${simulatedHour >= 10 ? "bg-rose-500/10 border-rose-500/25 text-rose-300" : "bg-amber-500/10 border-[#FF9500]/20 text-[#FF9500]"}`}>
              <span className="shrink-0 mt-0.5 animate-pulse">⏰</span>
              <span>
                {simulatedHour >= 10
                  ? (language === "en" ? "🔒 Meal schedule is LOCKED. Cutting off meal changes post 10:00 AM." : "🔒 মিল রস্টার চিরতরে লকড। সকাল ১০:০০ টা অতিক্রম করায় আজকের মিল আর পরিবর্তন সম্ভব নয়।")
                  : t.mealDeadlineAlert}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Breakfast button switch */}
              <button
                onClick={() => handleToggleSelfMeal("breakfast")}
                disabled={simulatedHour >= 10}
                className={`py-5 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  simulatedHour >= 10 
                    ? "bg-[#05070a]/20 border-white/[0.03] text-slate-650 cursor-not-allowed opacity-40 text-slate-500" 
                    : currentMember.meals.breakfast
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 cursor-pointer hover:bg-emerald-950/30"
                      : "bg-[#05070a]/30 border-white/5 text-slate-500 hover:border-white/10 cursor-pointer"
                }`}
              >
                <span className="text-xl font-mono font-black block mb-1">
                  {simulatedHour >= 10 ? "🔒" : "B"}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider">{language === "en" ? "Breakfast" : "সকালের খাবার"}</span>
                <span className="text-[9px] mt-1 font-mono text-slate-500">
                  {simulatedHour >= 10 ? "LOCKED" : currentMember.meals.breakfast ? "ACTIVE" : "INACTIVE"}
                </span>
              </button>

              {/* Lunch button switch */}
              <button
                onClick={() => handleToggleSelfMeal("lunch")}
                disabled={simulatedHour >= 10}
                className={`py-5 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  simulatedHour >= 10 
                    ? "bg-[#05070a]/20 border-white/[0.03] text-slate-650 cursor-not-allowed opacity-40 text-slate-500" 
                    : currentMember.meals.lunch
                      ? "bg-[#FF9500]/10 border-[#FF9500]/30 text-amber-500 cursor-pointer hover:bg-[#FF9500]/15"
                      : "bg-[#05070a]/30 border-white/5 text-slate-500 hover:border-white/10 cursor-pointer"
                }`}
              >
                <span className="text-xl font-mono font-black block mb-1">
                  {simulatedHour >= 10 ? "🔒" : "L"}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider">{language === "en" ? "Lunch" : "দুপুরের খাবার"}</span>
                <span className="text-[9px] mt-1 font-mono text-slate-500">
                  {simulatedHour >= 10 ? "LOCKED" : currentMember.meals.lunch ? "ACTIVE" : "INACTIVE"}
                </span>
              </button>

              {/* Dinner button switch */}
              <button
                onClick={() => handleToggleSelfMeal("dinner")}
                disabled={simulatedHour >= 10}
                className={`py-5 px-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  simulatedHour >= 10 
                    ? "bg-[#05070a]/20 border-white/[0.03] text-slate-650 cursor-not-allowed opacity-40 text-slate-500" 
                    : currentMember.meals.dinner
                      ? "bg-purple-950/20 border-purple-500/30 text-purple-400 cursor-pointer hover:bg-purple-950/30"
                      : "bg-[#05070a]/30 border-white/5 text-slate-500 hover:border-white/10 cursor-pointer"
                }`}
              >
                <span className="text-xl font-mono font-black block mb-1">
                  {simulatedHour >= 10 ? "🔒" : "D"}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider">{language === "en" ? "Dinner" : "রাতের খাবার"}</span>
                <span className="text-[9px] mt-1 font-mono text-slate-500">
                  {simulatedHour >= 10 ? "LOCKED" : currentMember.meals.dinner ? "ACTIVE" : "INACTIVE"}
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 2. RECEIPMTS LISTING LOGS */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
        <div className="pb-5 border-b border-white/[0.06] mb-6">
          <h3 className="text-md font-bold font-sans text-white flex items-center gap-2">
            <Receipt className="w-4.5 h-4.5 text-purple-400" />
            {t.downReceiptTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === "en" ? "Instant verified vouchers ready to be downloaded" : "অনুমোদিত ক্যাশ মেমোসমূহ যেকোনো সময় ডাউনলোড বা প্রিন্ট করুন"}
          </p>
        </div>

        {myReceipts.length === 0 ? (
          <div className="py-8 text-center bg-white/[0.01] border border-white/[0.04] rounded-2xl">
            <p className="text-xs text-slate-600 font-sans italic">No verified vouchers found. Deposit funds to create receipts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myReceipts.map((proof) => (
              <div key={proof.id} className="bg-[#05070a] border border-white/[0.08] p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">VERIFIED</span>
                    <span className="text-xs font-mono font-bold text-[#FF9500]">৳{proof.amount}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">{proof.channel} Deposit Memo</p>
                  <p className="text-[9px] font-mono text-slate-600 mt-0.5">TxID: {proof.transactionId}</p>
                </div>

                <button
                  onClick={() => setSelectedReceiptPrint(proof)}
                  className="w-full mt-4 py-2 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{t.downReceiptBtn}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. GAMIFIED MESS ROAST LEADERBOARD */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
        <div className="pb-5 border-b border-white/[0.06] mb-6">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-yellow-400 font-sans" />
            {t.analyticsLeaderboard}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Leaderboards are automatically re-calculated based on active consumption matrices
          </p>
        </div>

        <div className="space-y-3">
          {members.map((m, idx) => {
            const isMealKing = m.badge === "MEAL_KING";
            const isDueKing = m.badge === "DUE_KING";

            return (
              <div
                key={m.id}
                className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between transition-colors flex-wrap gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-slate-500 w-5">#{idx + 1}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{m.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{m.phone}</span>
                  </div>
                </div>

                {/* Gamified badge display logic */}
                <div className="flex items-center gap-3">
                  {isMealKing && (
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 flex-wrap">
                      <Crown className="w-3 h-3 text-amber-400" />
                      {t.mealKingBadge}
                    </span>
                  )}

                  {isDueKing && (
                    <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/15 flex items-center gap-1 flex-wrap">
                      <Flame className="w-3 h-3 text-rose-400" />
                      {t.dueKingBadge}
                    </span>
                  )}

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-mono">Consumptions / খাদক স্কোর</span>
                    <span className="text-xs font-mono font-bold text-purple-400">{m.totalMealsMonth} global meals</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SUBMIT DEPOSIT DIALOG MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-[#05070a] border border-white/[0.12] w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-left"
            >
              <button
                onClick={() => setShowDepositModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Ban className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-white tracking-tight">{t.submitDepositBtn}</h4>
                <p className="text-xs text-slate-500 mt-1">Submit the mobile ledger transfer properties safely to your manager.</p>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                {/* Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-300 font-semibold">{t.depositAmountLabel}</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-[#FF9500]"
                  />
                </div>

                {/* Channel dropdown selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-300 font-semibold">{t.depositChannelLabel}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositChannel("bKash")}
                      className={`py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer text-center ${depositChannel === "bKash" ? "bg-pink-950/20 text-pink-400 border-pink-500/40" : "bg-[#05070a] text-slate-500 border-white/5"}`}
                    >
                      bKash (বিকাশ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositChannel("Nagad")}
                      className={`py-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer text-center ${depositChannel === "Nagad" ? "bg-orange-950/20 text-orange-450 border-orange-500/40" : "bg-[#05070a] text-slate-500 border-white/5"}`}
                    >
                      Nagad (নগদ)
                    </button>
                  </div>
                </div>

                {/* TXID preloaded visual helper */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-slate-300 font-semibold">{t.txnIdLabel}</label>
                    <button
                      type="button"
                      onClick={handleQuickTxId}
                      className="text-[10px] font-mono text-[#FF9500] hover:underline cursor-pointer"
                    >
                      ⚡ Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="e.g. BK89D88A1"
                    className="bg-white/[0.02] border border-white/[0.1] rounded-xl px-4 py-2.5 text-slate-100 font-mono tracking-widest focus:outline-none uppercase"
                  />
                </div>

                {/* Visual Attachment placeholder */}
                <div className="bg-white/[0.01] border border-dashed border-white/[0.06] p-4 rounded-xl text-center text-[11px] text-slate-500">
                  📷 Screenshot Receipt: <span className="font-bold text-[#FF9500]">{depositChannel.toLowerCase()}_receipt_{depositAmount}.png</span> Attached successfully!
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-[#FF9500] text-black font-extrabold text-sm rounded-xl cursor-pointer hover:shadow-lg transition-all"
                >
                  🚀 TRANSMIT PROOF RECEIPT
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. AESTHETIC PRINATBLE PDF RECEIPT LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedReceiptPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card-print bg-zinc-950 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReceiptPrint(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer print:hidden"
              >
                Close
              </button>

              {/* PRINTABLE RECEIPT FRAME */}
              <div className="space-y-6" id="printable-memo-slot">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-dashed border-zinc-800 pb-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded bg-[#FF9500] flex items-center justify-center">
                        <span className="text-black font-extrabold text-[10px] font-mono">MF</span>
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">Mess Flow Ledger</span>
                    </div>
                    <span className="text-xl font-mono font-extrabold text-white">CASH RECEIPT VOUCHER</span>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Secure SaaS Cryptographic Invoice</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Slip ID/রসিদ</span>
                    <span className="text-xs font-mono font-bold text-amber-500">MFLOW-{selectedReceiptPrint.id.substring(6,12).toUpperCase()}</span>
                  </div>
                </div>

                {/* Grid attributes */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans pb-4 border-b border-zinc-900">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-650 uppercase tracking-wide block mb-1 text-slate-500">Received From / গ্রাহক</span>
                    <span className="text-sm font-bold text-white block">{selectedReceiptPrint.memberName}</span>
                    <span className="text-[10px] font-mono text-zinc-500">ID: {selectedReceiptPrint.memberId}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-650 uppercase tracking-wide block mb-1 text-slate-500">Receipt Date / তারিখ</span>
                    <span className="text-sm font-medium text-white block">{new Date(selectedReceiptPrint.submittedAt).toLocaleDateString()}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{new Date(selectedReceiptPrint.submittedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Ledger specific amount card */}
                <div className="bg-zinc-920 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Payment Particulars</span>
                    <span className="text-xs font-semibold text-white mt-1 block">Advanced Security Deposit / মেস ফান্ড রিচার্জ</span>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">TxID Gateway: {selectedReceiptPrint.transactionId} ({selectedReceiptPrint.channel})</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">Total Received / প্রাপ্তি</span>
                    <span className="text-xl font-mono font-black text-emerald-400">৳{selectedReceiptPrint.amount}</span>
                  </div>
                </div>

                {/* Security Sign Block */}
                <div className="pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <div>
                    <div>System Operator Certificate</div>
                    <div className="text-amber-500/70 font-bold mt-1">✓ INVOICE VERIFIED ONLINE</div>
                  </div>
                  <div className="text-right">
                    <div>Authorized Audit Stamp</div>
                    <div className="text-zinc-400 font-bold mt-1">MFLOW-DESK-SECURE</div>
                  </div>
                </div>

              </div>

              {/* Printers triggers */}
              <div className="mt-8 pt-6 border-t border-zinc-900 flex gap-3 print:hidden">
                <button
                  onClick={handlePrintAction}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt (PDF)</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptPrint(null)}
                  className="py-3 px-5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-slate-400 text-xs font-bold cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
