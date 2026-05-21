/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { 
  ShieldCheck, ShieldAlert, BadgeDollarSign, Landmark, Users2, Play, 
  Terminal, ShieldX, RefreshCw, Layers, CheckCircle, Megaphone, Percent 
} from "lucide-react";
import { SystemStats } from "../types";
import { translations } from "../data";

interface SuperAdminPortalProps {
  language: "en" | "bn";
  stats: SystemStats;
  onStatsChange: (updated: SystemStats) => void;
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
  isBannedPlatform: boolean;
  onToggleBanPlatform: () => void;
  showAdBanner: boolean;
  onToggleAdBanner: () => void;
  showPromoPopup: boolean;
  onTogglePromoPopup: () => void;
  promoCoupon: string;
  onUpdatePromoCoupon: (coupon: string) => void;
  announcements: Array<{ id: string; textBn: string; textEn: string; date: string }>;
  onAddAnnouncement: (announcement: { id: string; textBn: string; textEn: string; date: string }) => void;
}

interface MessRowProps {
  mess: { id: string; name: string; manager: string; phone: string; members: number; seats: number; isPremium: boolean; isBanned: boolean };
  language: "en" | "bn";
  stats: SystemStats;
  onStatsChange: (updated: SystemStats) => void;
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
  key?: string | number;
}

function MessRow({ mess, language, stats, onStatsChange, addToast }: MessRowProps) {
  const [premiumState, setPremiumState] = useState(mess.isPremium);
  const [banState, setBanState] = useState(mess.isBanned);

  const handleTogglePremium = () => {
    const next = !premiumState;
    setPremiumState(next);
    if (next) {
      onStatsChange({
        ...stats,
        globalRevenue: stats.globalRevenue + 199,
      });
      addToast(
        language === "en" 
          ? `💎 Premium Upgrade Activated for ${mess.name}! Plus ৳199 SaaS Revenue logged.` 
          : `💎 ${mess.name} এর প্রিমিয়াম লাইসেন্স সফলভাবে একটিভ করা হয়েছে! প্লাস ৳১৯৯ সাবস্ক্রিপশন ফান্ড রেজিস্টার করা হয়েছে।`,
        "success"
      );
    } else {
      addToast(
        language === "en" 
          ? `❄️ Premium status disabled for ${mess.name}.` 
          : `❄️ ${mess.name} এর প্রিমিয়াম লাইসেন্স ডি-একটিভ করা হয়েছে।`,
        "info"
      );
    }
  };

  const handleToggleBan = () => {
    const next = !banState;
    setBanState(next);
    addToast(
      next 
        ? (language === "en" ? `🛑 Workspace Block active for ${mess.name}. Isolating sandbox...` : `🛑 ${mess.name} এর মেস এরিয়া লকড করা হয়েছে।`)
        : (language === "en" ? `✅ Rescinded ban on ${mess.name}. Re-instating nominal configurations...` : `✅ ${mess.name} এর লক সফলভাবে রিলিজ করা হয়েছে।`),
      next ? "error" : "success"
    );
  };

  return (
    <tr className={`hover:bg-white/[0.02] transition-colors ${banState ? "bg-red-950/10 opacity-70" : ""}`}>
      <td className="py-3 px-4">
        <div className="font-bold text-slate-100 flex items-center gap-2">
          <span>{mess.name}</span>
          {banState && (
            <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
              Banned
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 block">ID: {mess.id}</span>
      </td>
      <td className="py-3 px-4">
        <div className="text-slate-200 font-medium">{mess.manager}</div>
        <span className="text-[10px] text-slate-500 font-mono block">{mess.phone}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-slate-200 font-bold">{mess.members}</span>
        <span className="text-slate-500"> / {mess.seats} {language === "en" ? "Occupied" : "সিট"}</span>
        <div className="w-16 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
          <div 
            className={`h-full ${premiumState ? "bg-indigo-400" : "bg-slate-400"}`}
            style={{ width: `${(mess.members / mess.seats) * 100}%` }}
          />
        </div>
      </td>
      <td className="py-3 px-4">
        {premiumState ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-505/10 border border-indigo-500/30 px-2 py-0.5 rounded-full bg-indigo-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Premium 💎
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded-full">
            Standard Free ❄️
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <button
            onClick={handleTogglePremium}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
              premiumState 
                ? "bg-indigo-950/50 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30" 
                : "bg-white/[0.04] hover:bg-[#FF9500]/10 hover:text-[#FF9500] hover:border-[#FF9500]/30 text-slate-400 border border-white/[0.08]"
            }`}
          >
            💎 {premiumState ? (language === "en" ? "Downgrade" : "ডাউনগ্রেড") : (language === "en" ? "Activate Premium" : "মেম্বারশিপ একটিভ")}
          </button>

          <button
            onClick={handleToggleBan}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
              banState 
                ? "bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300" 
                : "bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300"
            }`}
          >
            🛑 {banState ? (language === "en" ? "Unban Workspace" : "লক রিলিজ করুন") : (language === "en" ? "Ban Workspace" : "মেস লক করুন")}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function SuperAdminPortal({
  language,
  stats,
  onStatsChange,
  addToast,
  isBannedPlatform,
  onToggleBanPlatform,
  showAdBanner,
  onToggleAdBanner,
  showPromoPopup,
  onTogglePromoPopup,
  promoCoupon,
  onUpdatePromoCoupon,
  announcements,
  onAddAnnouncement,
}: SuperAdminPortalProps) {
  const t = translations[language];

  // Campaign management states
  const [newNoticeEn, setNewNoticeEn] = useState("");
  const [newNoticeBn, setNewNoticeBn] = useState("");
  const [newCouponLocal, setNewCouponLocal] = useState(promoCoupon);

  // Custom live transaction state
  const [txns, setTxns] = useState<Array<{ id: string; desc: string; amount: number; time: string; channel: string }>>([
    { id: "TXN-928A", desc: "Premium Workspace License (Chittagong View)", amount: 1200, time: "2026-05-21 16:20", channel: "bKash" },
    { id: "TXN-039X", desc: "Premium Workspace License (Green Palace Mess)", amount: 1500, time: "2026-05-21 14:05", channel: "Nagad" },
    { id: "TXN-583B", desc: "Standard Seat Renewal License (Farmgate Group)", amount: 800, time: "2026-05-21 11:30", channel: "bKash" },
    { id: "TXN-174C", desc: "Full Mess Pack Bundle License (Nikunja Apex)", amount: 2200, time: "2026-05-21 09:12", channel: "Nagad" },
  ]);

  const handleSimulatePayment = () => {
    const randomAmount = [900, 1200, 1500, 2000][Math.floor(Math.random() * 4)];
    const randomChannels = ["bKash", "Nagad"];
    const channel = randomChannels[Math.floor(Math.random() * 2)];
    const id = "TXN-" + Math.floor(1000 + Math.random() * 9000) + ["A", "B", "C", "X"][Math.floor(Math.random() * 4)];
    const now = new Date();
    const formattedTime = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const messNames = ["Baridhara Heights", "Mohakhali Plaza", "Bashundhara Hub", "Azimpur Boys Mess"];
    const mess = messNames[Math.floor(Math.random() * messNames.length)];

    const updatedStats: SystemStats = {
      ...stats,
      globalRevenue: stats.globalRevenue + randomAmount,
      activeMessCount: stats.activeMessCount + 1,
      totalUsers: stats.totalUsers + 5
    };

    onStatsChange(updatedStats);

    setTxns(prev => [
      { id, desc: `Premium Activation License (${mess})`, amount: randomAmount, time: formattedTime, channel },
      ...prev
    ]);

    addToast(
      language === "en" 
        ? `🎉 Simulated transaction success: ৳${randomAmount} received via ${channel}!` 
        : `🎉 সিমুলেটেড ট্রানজেকশন সফল: ৳${randomAmount} জমা হয়েছে (${channel})!`,
      "success"
    );
  };

  const handleToggleGateway = (gateway: "bkash" | "nagad") => {
    const updated = {
      ...stats,
      isbKashActive: gateway === "bkash" ? !stats.isbKashActive : stats.isbKashActive,
      isNagadActive: gateway === "nagad" ? !stats.isNagadActive : stats.isNagadActive,
    };
    onStatsChange(updated);
    addToast(
      language === "en" ? `${gateway.toUpperCase()} status updated` : `${gateway.toUpperCase()} গেটওয়ে স্ট্যাটাস পরিবর্তন করা হয়েছে`,
      "info"
    );
  };

  const handleSaveCoupon = () => {
    if (!newCouponLocal.trim()) {
      addToast(language === "en" ? "Coupon code cannot be empty" : "কুপন কোড ফাঁকা হতে পারে না", "warning");
      return;
    }
    onUpdatePromoCoupon(newCouponLocal.trim().toUpperCase());
    addToast(
      language === "en" 
        ? `🎁 Promo code updated to: ${newCouponLocal.trim().toUpperCase()}` 
        : `🎁 প্রোকোড সফলভাবে আপডেট করা হয়েছে: ${newCouponLocal.trim().toUpperCase()}`,
      "success"
    );
  };

  const handlePublishAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    if (!newNoticeBn.trim() || !newNoticeEn.trim()) {
      addToast(
        language === "en" ? "Please fill both Bangla & English notices" : "দয়া করে বাংলা ও ইংরেজি নোটিশ লিখুন",
        "warning"
      );
      return;
    }

    const now = new Date();
    const formattedTime = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    onAddAnnouncement({
      id: "ann-" + Date.now(),
      textBn: newNoticeBn.trim(),
      textEn: newNoticeEn.trim(),
      date: formattedTime,
    });

    setNewNoticeBn("");
    setNewNoticeEn("");

    addToast(
      language === "en" ? "📢 Live Announcement published to web clients!" : "📢 লাইভ নোটিশ সফলভাবে পাবলিশ করা হয়েছে!",
      "success"
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Security Level 4 SECURE
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-white">
            {t.superAdminTitle}
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">{t.superAdminSubtitle}</p>
        </div>

        {/* Instant Mock Payment generator */}
        <button
          onClick={handleSimulatePayment}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold font-mono tracking-wide hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-indigo-500/30"
        >
          <Play className="w-4 h-4 text-purple-300 fill-current" />
          <span>SIMULATE LICENSE ORDER (৳)</span>
        </button>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Rev */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl" />
          <BadgeDollarSign className="w-8 h-8 text-emerald-400 mb-4" />
          <div className="text-xs text-slate-400 font-sans">{t.platformRev}</div>
          <div className="text-3xl font-mono font-extrabold text-emerald-400 mt-2">৳{stats.globalRevenue}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-1.5">Direct checkout subscriptions</p>
        </div>

        {/* Active counter */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl" />
          <Landmark className="w-8 h-8 text-purple-400 mb-4" />
          <div className="text-xs text-slate-400 font-sans">{t.activeMessesCount}</div>
          <div className="text-3xl font-mono font-extrabold text-[#FF9500] mt-2">{stats.activeMessCount}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-1.5">Connected sandbox workspaces</p>
        </div>

        {/* Users */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl" />
          <Users2 className="w-8 h-8 text-indigo-400 mb-4" />
          <div className="text-xs text-slate-400 font-sans">{t.totalUsersCount}</div>
          <div className="text-3xl font-mono font-extrabold text-blue-400 mt-2">{stats.totalUsers}</div>
          <p className="text-[10px] text-slate-500 font-mono mt-1.5">Active profiles stored</p>
        </div>
      </div>

      {/* Global Mess Directory Table: A master data grid displaying every registered mess profile */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-8 shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/[0.04]">
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              {language === "en" ? "Global Mess Directory Board (Master Control Grid)" : "গ্লোবাল মেস ডিরেক্টরি বোর্ড (মাস্টার কন্ট্রোল গ্রিড)"}
            </h3>
            <p className="text-[10px] text-slate-450 mt-1 font-sans">
              {language === "en" 
                ? "Manage workspace access states, verify license payments, upgrade premium nodes, or lock down malicious profiles." 
                : "সরাসরি যেকোনো মেসের প্রিমিয়াম মেম্বারশিপ একটিভ বা নিয়মভঙ্গকারী অ্যাকাউন্ট সাময়িক অবরুদ্ধ করুন।"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10.5px] font-mono text-indigo-400 bg-indigo-505/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              4 Total Registries Found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="text-[10px] uppercase text-slate-500 border-b border-white/[0.08] bg-white/[0.01]">
              <tr>
                <th className="py-3 px-4">{language === "en" ? "Workspace / Mess Title" : "মেসের নাম ও এলাকা"}</th>
                <th className="py-3 px-4">{language === "en" ? "Manager Identity" : "ম্যানেজার মোবাইল নম্বর"}</th>
                <th className="py-3 px-4">{language === "en" ? "Members / Seats" : "সীট ও মেম্বার অনুপাত"}</th>
                <th className="py-3 px-4">{language === "en" ? "Subscription Tier" : "সাবস্ক্রিপশন পর্যায়"}</th>
                <th className="py-3 px-4 text-center">{language === "en" ? "Control Plane Actions" : "অ্যাকশন ট্রিগারসমূহ"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                { id: "mess-1", name: "Green Palace Mess", manager: "Jubayer Ahmed Bhuiyan", phone: "01611035490", members: 4, seats: 8, isPremium: false, isBanned: false },
                { id: "mess-2", name: "Nikunja Sky Hostel", manager: "Fahim Rahman", phone: "01712345678", members: 6, seats: 6, isPremium: true, isBanned: false },
                { id: "mess-3", name: "Farmgate VIP Mess", manager: "Shakil Hossain", phone: "01598765432", members: 5, seats: 10, isPremium: false, isBanned: false },
                { id: "mess-4", name: "Mohakhali Plaza Space", manager: "Alim Chowdury", phone: "01811223344", members: 3, seats: 12, isPremium: false, isBanned: true }
              ].map((mess) => (
                <MessRow 
                  key={mess.id} 
                  mess={mess} 
                  language={language} 
                  stats={stats} 
                  onStatsChange={onStatsChange} 
                  addToast={addToast} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom section: Logs and System Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Transaction logs */}
        <div className="lg:col-span-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-2xl overflow-hidden">
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            {t.liveTxnTitle}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-white/[0.08] bg-white/[0.01]">
                <tr>
                  <th className="py-3 px-4">TxID</th>
                  <th className="py-3 px-4">{t.txnDesc}</th>
                  <th className="py-3 px-4">{t.txnAmount}</th>
                  <th className="py-3 px-4">{t.paymentChannel}</th>
                  <th className="py-3 px-4">{t.txnDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {txns.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#FF9500]">{tx.id}</td>
                    <td className="py-3.5 px-4 text-slate-200">{tx.desc}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">৳{tx.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.channel === "bKash" ? "bg-pink-950/40 text-pink-300 border border-pink-500/20" : "bg-orange-950/40 text-orange-300 border border-orange-500/20"}`}>
                        {tx.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Firewalls & Policy ban/unban */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active firewall ban controller */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF9500]" />
              {t.togglePortalStatus}
            </h3>
            <p className="text-[10px] text-slate-500 font-sans mb-5 leading-normal">
              {t.banToggleHelp}
            </p>

            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${isBannedPlatform ? "bg-rose-950/20 border-rose-500/30 text-rose-300" : "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"}`}>
              {isBannedPlatform ? (
                <>
                  <ShieldX className="w-8 h-8 text-rose-400 mb-2 animate-bounce" />
                  <span className="text-xs font-bold font-mono uppercase tracking-widest">{t.bannedStatus}</span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5 mt-1.5 leading-tight">All sandbox connections currently disabled by policy administrators.</p>
                </>
              ) : (
                <>
                  <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                  <span className="text-xs font-bold font-mono uppercase tracking-widest">{t.activeStatus}</span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5 mt-1.5 leading-tight">All sandboxes nominal. Global connections active and healthy.</p>
                </>
              )}

              <button
                onClick={onToggleBanPlatform}
                className={`w-full py-2.5 mt-4 rounded-xl text-xs font-medium font-sans cursor-pointer transition-all active:scale-[0.98] ${isBannedPlatform ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-rose-600 hover:bg-rose-500 text-white"}`}
              >
                {isBannedPlatform ? "RE-ACTIVATE PLATFORM" : "IMMEDIATELY LOCK BAN ALL CORES"}
              </button>
            </div>
          </div>

          {/* Interactive Toggle for Gateway channels */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-5">
              {t.bkashNagadStatus}
            </h3>

            <div className="space-y-4">
              {/* bKash toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-400 font-mono block">bKash Active Gateway</span>
                  <span className="text-[10px] text-slate-500 font-sans">{stats.isbKashActive ? t.gatewayOnline : "Offline / Maintenance"}</span>
                </div>
                <button
                  onClick={() => handleToggleGateway("bkash")}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${stats.isbKashActive ? "bg-emerald-500" : "bg-slate-700"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${stats.isbKashActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Nagad toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <div>
                  <span className="text-xs font-bold text-orange-400 font-mono block">Nagad Active Gateway</span>
                  <span className="text-[10px] text-slate-500 font-sans">{stats.isNagadActive ? t.gatewayOnline : "Offline / Maintenance"}</span>
                </div>
                <button
                  onClick={() => handleToggleGateway("nagad")}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${stats.isNagadActive ? "bg-emerald-500" : "bg-slate-700"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${stats.isNagadActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Campaign & Promo Manager */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5">
            <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              {language === "en" ? "Dynamic SaaS Campaign Manager" : "ডাইনামিক ক্যাম্পেইন ও কুপন ম্যানেজার"}
            </h3>

            {/* Promo Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Show Promo Popup Modal</span>
                  <span className="text-[10px] text-slate-500 font-sans">Active on landing page</span>
                </div>
                <button
                  onClick={onTogglePromoPopup}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${showPromoPopup ? "bg-purple-600" : "bg-slate-700"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${showPromoPopup ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <div>
                  <span className="text-xs font-bold text-slate-300 block">Show Inline Ad Banner</span>
                  <span className="text-[10px] text-slate-500 font-sans">For premium upgrades</span>
                </div>
                <button
                  onClick={onToggleAdBanner}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${showAdBanner ? "bg-[#FF9500]" : "bg-slate-700"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${showAdBanner ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            {/* Coupon String Form */}
            <div className="pt-4 border-t border-white/[0.04] space-y-2">
              <label className="text-[11px] font-mono text-slate-400 block font-bold uppercase">Dynamic Promo Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCouponLocal}
                  onChange={(e) => setNewCouponLocal(e.target.value)}
                  placeholder="CODE"
                  className="bg-[#05070a] border border-white/[0.08] focus:border-[#FF9500] focus:outline-none rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono flex-1 uppercase"
                />
                <button
                  onClick={handleSaveCoupon}
                  className="py-1.5 px-3 bg-[#FF9500] hover:bg-[#FF9500]/90 text-black font-extrabold text-xs rounded-xl cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Publish Public Announcements Form */}
            <form onSubmit={handlePublishAnnouncement} className="pt-4 border-t border-white/[0.04] space-y-3">
              <label className="text-[11px] font-mono text-slate-400 block font-bold uppercase">Publish App Update / Feed</label>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={newNoticeBn}
                  onChange={(e) => setNewNoticeBn(e.target.value)}
                  placeholder="বাংলায় নোটিশ লিখুন..."
                  className="w-full bg-[#05070a] border border-white/[0.08] focus:border-purple-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200 font-sans"
                />
                <input
                  type="text"
                  value={newNoticeEn}
                  onChange={(e) => setNewNoticeEn(e.target.value)}
                  placeholder="Write notice in English..."
                  className="w-full bg-[#05070a] border border-white/[0.08] focus:border-purple-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Publish announcement</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
