/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, MapPin, DollarSign, Phone, CheckCircle, Home, Users } from "lucide-react";
import { ToLetAd } from "../types";
import { translations } from "../data";

interface PublicToLetFinderProps {
  ads: ToLetAd[];
  language: "en" | "bn";
  addToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function PublicToLetFinder({ ads, language, addToast }: PublicToLetFinderProps) {
  const t = translations[language];
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [maxBudget, setMaxBudget] = useState<number>(6000);

  // Extract unique locations from current active ads
  const targetAds = ads.filter(ad => ad.isLive);
  const locations = ["ALL", ...Array.from(new Set(targetAds.map(ad => {
    if (ad.address.toLowerCase().includes("mirpur")) return "Mirpur";
    if (ad.address.toLowerCase().includes("nikunja")) return "Nikunja";
    if (ad.address.toLowerCase().includes("farmgate")) return "Farmgate";
    return ad.address.split(",")[0].trim();
  })))];

  const filteredAds = targetAds.filter(ad => {
    const isLocationMatched = selectedLocation === "ALL" || ad.address.toLowerCase().includes(selectedLocation.toLowerCase());
    const isBudgetMatched = ad.rent <= maxBudget;
    return isLocationMatched && isBudgetMatched;
  });

  const handleContact = (phone: string, messName: string) => {
    navigator.clipboard.writeText(phone);
    addToast(`${t.copiedContact} ${phone} (${messName})`, "success");
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Title & Subtitle */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#FF9500] to-purple-400 mb-3" id="finder-title">
          {t.finderTitle}
        </h2>
        <p className="text-sm md:text-md text-slate-400 max-w-2xl mx-auto font-sans">
          {t.finderSubtitle}
        </p>
      </div>

      {/* Glassmorphic Filters Widget */}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative purple glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Location Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF9500]" />
              {t.locationFilter}
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#05070a]/80 text-[#FF9500] border border-white/[0.1] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#FF9500] shadow-xl backdrop-blur-lg"
            >
              <option value="ALL">🌍 {t.allLocations}</option>
              <option value="Mirpur">📍 Mirpur (মিরপুর)</option>
              <option value="Nikunja">📍 Nikunja (নিকুঞ্জ)</option>
              <option value="Farmgate">📍 Farmgate (ফার্মগেট)</option>
              {locations.filter(l => l !== "ALL" && !["Mirpur", "Nikunja", "Farmgate"].includes(l)).map(loc => (
                <option key={loc} value={loc}>📍 {loc}</option>
              ))}
            </select>
          </div>

          {/* Budget Range Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                {t.budgetFilter}
              </label>
              <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                ৳{maxBudget}
              </span>
            </div>
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs text-slate-500 font-mono">৳1,500</span>
              <input
                type="range"
                min="1500"
                max="8000"
                step="100"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="flex-1 accent-[#FF9500] h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-slate-500 font-mono">৳8,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.length > 0 ? (
          filteredAds.map((ad, idx) => (
            <div
              key={ad.id}
              className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-6 shadow-2xl transition-all duration-300 group hover:translate-y-[-4px] relative flex flex-col justify-between"
            >
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF9500]/10 to-purple-500/0 rounded-full blur-2xl pointer-events-none group-hover:from-purple-500/15" />
              
              <div>
                {/* Header section */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    {ad.roomType === "SINGLE" ? (
                      <>
                        <Home className="w-3 h-3 text-purple-400" />
                        {t.singleType}
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3 text-amber-400" />
                        {t.sharedType}
                      </>
                    )}
                  </span>
                  
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Rent / ভাড়া</span>
                    <span className="text-xl font-mono font-extrabold text-[#FF9500]">
                      ৳{ad.rent} <span className="text-xs text-slate-400">/m</span>
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <h3 className="text-lg font-sans font-semibold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
                  {ad.messName}
                </h3>

                <p className="text-xs text-slate-400 mb-6 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{ad.address}</span>
                </p>
              </div>

              {/* Action and footer info */}
              <div className="mt-4 pt-4 border-t border-white/[0.05]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-mono text-slate-500 uppercase">Available From / তারিখ</span>
                  <span className="text-[11px] font-mono font-semibold text-purple-300 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                    {ad.availableMonth}
                  </span>
                </div>

                <button
                  onClick={() => handleContact(ad.contactPhone, ad.messName)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF9500] hover:from-purple-600 hover:to-[#8B5CF6] text-white font-semibold text-sm shadow-xl shadow-[#FF9500]/10 hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t.contactManagerBtn}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-white/[0.01] border border-white/[0.04] rounded-2xl backdrop-blur-sm">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-sans text-slate-300 font-medium mb-1">
              {t.noAdsFound}
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting the max budget slider or switching back to "All Areas"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
