/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, Duty, PaymentProof, ToLetAd, SystemStats, OnboardingState } from "./types";

// Translation dictionaries for comprehensive Bangla/English switching
export const translations = {
  en: {
    appTitle: "Mess Flow",
    bilingualIndicator: "English / বাংলা",
    roleSelector: "Switch View (Simulator)",
    logout: "Log Out",
    loginTitle: "Secure Dashboard Access",
    loginSubtitle: "Sign in with your Mess Flow account",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    submitLogin: "Sign In",
    unlockedSuperAdmin: "🎉 Super Admin mode unlocked!",
    incorrectCredentials: "❌ Incorrect credentials for Super Admin bypass.",
    
    // Onboarding
    onboardingTitle: "Manager Onboarding Setup",
    onboardingSubtitle: "Configure your mess workspace in 4 quick steps",
    step1Title: "Profile",
    step1Desc: "Basic Info",
    step2Title: "Costs",
    step2Desc: "Fixed Utility Matrix",
    step3Title: "Rules",
    step3Desc: "Lock-in Hours & Notice",
    step4Title: "Launch",
    step4Desc: "Invite & Launch",
    
    messNameLabel: "Mess Name",
    messNamePlaceholder: "e.g., Green Palace / সবুজ প্রাসাদ",
    totalSeatsLabel: "Total Seats",
    addressLabel: "Mess Address",
    addressPlaceholder: "e.g., House 42, Road 5, Mirpur 10, Dhaka",
    phoneLabel: "Manager's bKash/Nagad Mobile",
    phonePlaceholder: "e.g., 017xxxxxxxx",
    
    houseRentLabel: "House Rent (৳)",
    maidSalaryLabel: "Maid Salary (৳)",
    wifiLabel: "WiFi Bill (৳)",
    utilityLabel: "Gas & Electricity (৳)",
    wasteBillLabel: "Waste & Water Bill (৳)",
    fixedCalcTitle: "Estimated Fixed Cost per Seat",
    fixedCalcFormula: "Fixed Cost per Seat = Total Fixed Cost ÷ Total Seats",
    totalFixedText: "Total Fixed Cost",
    perMemberCostText: "Per Member Fixed Share",
    
    mealDeadlineLabel: "Daily Meal Lock-in Deadline",
    rulesNoticeLabel: "Mess Rules & Notice Board",
    rulesNoticePlaceholder: "Write the basic guidelines here e.g., No guests allowed after 10 PM. Lights off by 12 AM...",
    
    addMemberTitle: "Add Core Members",
    memberNameLabel: "Member Name",
    memberPhoneLabel: "Member Phone Number",
    addMemberBtn: "Add to invite list",
    membersListTitle: "Pending Invite List",
    joinCodeTitle: "Mess Unique Join Code",
    shareWhatsApp: "Share Join Code on WhatsApp",
    launchWorkspace: "⚡ Launch Workspace (Confetti!)",
    successOnboard: "Workspace created! Shared code: ",
    
    // Super Admin Portal
    superAdminTitle: "Super Admin Command Dashboard",
    superAdminSubtitle: "Invisible to standard members. Global platform control center.",
    platformRev: "Global Platform Revenue (Licenses & Subscriptions)",
    activeMessesCount: "Total Active Messes",
    totalUsersCount: "Registered Users",
    bkashNagadStatus: "Payment Gateways Status",
    liveTxnTitle: "Real-time Platform Transaction Logs",
    txnDate: "Time",
    txnDesc: "Details",
    txnAmount: "Amount",
    statusText: "Status",
    togglePortalStatus: "Live Global Workspace Firewalls",
    activeStatus: "ACTIVE",
    bannedStatus: "SUSPENDED",
    banToggleHelp: "Click to immediately mock ban/unban the entire platform sandbox",
    gatewayOnline: "Online / Active",
    
    // Manager Command Center
    managerTitle: "Manager Command Center",
    managerSubtitle: "Roster actions, payment approvals, and meal matrices",
    dutyMatrixTitle: "Weekly Duty Matrix (Equal Allocation)",
    dutyMatrixSubtitle: "Fair, randomized, unbiased distribution of tasks",
    autoAssignBtn: "⚡ Auto-Assign Duties Fairly",
    cleanerHeader: "Cleaning Duty (ঝাড়ু দেওয়া)",
    bazarHeader: "Bazar Duty (বাজার করা)",
    statusDone: "Done",
    statusPending: "Pending",
    markDone: "Mark Done",
    verificationInboxTitle: "Receipt Verification Inbox",
    verificationInboxSubtitle: "Verify screenshot uploads and deposit confirmations",
    noProofs: "No pending payment proofs to verify",
    paymentAmount: "Amount",
    paymentChannel: "Channel",
    paymentTxID: "TxID",
    acceptBtn: "Accept & Credit",
    rejectBtn: "Reject",
    receiptLightboxTitle: "Proof Receipt Visual Inspection",
    mealSheetTitle: "Daily Meal Entry Sheet",
    mealSheetSubtitle: "Fast toggle switches for standard breakfast, lunch, and dinner entries",
    breakfastLabel: "Breakfast (B)",
    lunchLabel: "Lunch (L)",
    dinnerLabel: "Dinner (D)",
    totalMeals: "Total",
    seatVacancyTitle: "Seat Vacancy & To-Let Broadcaster",
    seatVacancySubtitle: "Broadcast vacant rooms/seats to the public Finder",
    createAdBtn: "📢 Create To-Let Advertisement",
    adMonthLabel: "Available From Month",
    roomTypeLabel: "Room Type",
    singleType: "Single Room",
    sharedType: "Shared Seat",
    makeAdLive: "Set Advertisement Active & Live",
    broadcastSuccessToast: "🚀 To-Let advertisement broadcasted successfully to the public board!",
    
    // Member Dashboard
    memberTitle: "Member Workspace",
    memberSubtitle: "Self-service meal schedules, deposit submissions, and receipts",
    myBalance: "My Balance",
    submitDepositBtn: "Submit Deposit Proof",
    depositAmountLabel: "Deposit Amount (৳)",
    depositChannelLabel: "Channel Type",
    txnIdLabel: "Transaction ID",
    screenshotLabel: "Upload Receipt Screenshot (File Name or URL)",
    submitProofConfirm: "🚀 Submission received! Manager verification pending.",
    downReceiptTitle: "Verified Cash Receipts",
    downReceiptBtn: "Download PDF Cash Memo",
    mealDeadlineAlert: "⚠️ Lock-in active after 10:00 AM. Changing meals now affects tomorrow's roster.",
    selfServiceMeals: "Self-Service Meal Toggles",
    mealKingBadge: "👑 Meal King (Most meals consumed)",
    dueKingBadge: "💸 Due King (Highest outstanding balance)",
    analyticsLeaderboard: "Mess Gamified Engagement Leaderboard",
    scoreRank: "Ranks & Badges",
    
    // Public Finder
    finderTitle: "🔍 Find Vacant Mess Seats / খালি সিট খুঁজুন",
    finderSubtitle: "Real-time listings broadcasted directly by verified mess managers",
    locationFilter: "Filter by Location / Area",
    budgetFilter: "Max Budget (৳)",
    allLocations: "All Areas / সকল এলাকা",
    contactManagerBtn: "📞 Contact Manager via Mess Flow",
    noAdsFound: "No vacant seats match your criteria currently. Check back later!",
    copiedContact: "📞 Manager contact copied: ",
    
    // Footer redirect
    footerAuthor: "Created by Jubayer Ahmed Bhuiyan",
    footerWhatsApp: "Tap to chat securely on WhatsApp"
  },
  bn: {
    appTitle: "মেস ফ্লো (Mess Flow)",
    bilingualIndicator: "বাংলা / English",
    roleSelector: "ভিউ পরিবর্তন করুন (সিমুলেটর)",
    logout: "লগ আউট",
    loginTitle: "সুরক্ষিত ড্যাশবোর্ড এক্সেস",
    loginSubtitle: "আপনার মেস ফ্লো অ্যাকাউন্ট দিয়ে সাইন ইন করুন",
    emailPlaceholder: "ইমেইল এড্রেস",
    passwordPlaceholder: "পাসওয়ার্ড",
    submitLogin: "সাইন ইন করুন",
    unlockedSuperAdmin: "🎉 সুপার এডমিন মোড আনলক হয়েছে!",
    incorrectCredentials: "❌ সুপার এডমিন বাইপাস ক্রেডেনশিয়াল ভুল হয়েছে।",
    
    // Onboarding
    onboardingTitle: "ম্যানেজার অনবোর্ডিং সেটআপ",
    onboardingSubtitle: "৪টি সহজ ধাপে আপনার মেস সেটআপ সম্পন্ন করুন",
    step1Title: "মেস প্রোফাইল",
    step1Desc: "প্রাথমিক তথ্য",
    step2Title: "খরচ ম্যাট্রিক্স",
    step2Desc: "স্থির মাসিক খরচ",
    step3Title: "নিয়ামাবলী",
    step3Desc: "সময়সীমা ও নোটিশ",
    step4Title: "লঞ্চ",
    step4Desc: "মেম্বার আমন্ত্রন",
    
    messNameLabel: "মেসের নাম",
    messNamePlaceholder: "যেমন: সবুজ প্রাসাদ / গ্রিন প্যালেস",
    totalSeatsLabel: "মোট সিট সংখ্যা",
    addressLabel: "মেসের ঠিকানা",
    addressPlaceholder: "যেমন: হাউজ ৪২, রোড ৫, মিরপুর ১০, ঢাকা",
    phoneLabel: "ম্যানেজারের bKash/Nagad মোবাইল নম্বর",
    phonePlaceholder: "যেমন: ০১৭xxxxxxxx",
    
    houseRentLabel: "বাড়ি ভাড়া (৳)",
    maidSalaryLabel: "বুয়া বিল (৳)",
    wifiLabel: "ওয়াইফাই বিল (৳)",
    utilityLabel: "গ্যাস ও বিদ্যুৎ বিল (৳)",
    wasteBillLabel: "পানি ও ময়লা বিল (৳)",
    fixedCalcTitle: "মেম্বার প্রতি আনুমানিক ফিক্সড খরচ",
    fixedCalcFormula: "মেম্বার প্রতি ফিক্সড খরচ = মোট ফিক্সড খরচ ÷ মোট সিট",
    totalFixedText: "মোট ফিক্সড খরচ",
    perMemberCostText: "মেম্বার প্রতি ফিক্সড অংশ",
    
    mealDeadlineLabel: "প্রতিদিনের মিল লক-ইন ডেডলাইন",
    rulesNoticeLabel: "মেস নিয়ামাবলী এবং নোটিশ বোর্ড",
    rulesNoticePlaceholder: "মেসের মৌলিক নির্দেশাবলী এখানে লিখুন যেমন: রাত ১০টার পর গেস্ট প্রবেশ নিষেধ। রাত ১২টার পর লাইট বন্ধ...",
    
    addMemberTitle: "মেসের কোর মেম্বার যুক্ত করুন",
    memberNameLabel: "মেম্বারের নাম",
    memberPhoneLabel: "মেম্বারের মোবাইল নম্বর",
    addMemberBtn: "আমন্ত্রণ তালিকায় যুক্ত করুন",
    membersListTitle: "অপেক্ষমান আমন্ত্রণ তালিকা",
    joinCodeTitle: "মেসের অনন্য জয়েন কোড (Join Code)",
    shareWhatsApp: "WhatsApp-এ জয়েন কোড শেয়ার করুন",
    launchWorkspace: "⚡ লঞ্চ ওয়ার্কস্পেস (কনফেটি অ্যানিমেশন!)",
    successOnboard: "মেস ওয়ার্কস্পেস তৈরি হয়েছে! শেয়ার কোড: ",
    
    // Super Admin Portal
    superAdminTitle: "সুপার এডমিন কমান্ড ড্যাশবোর্ড",
    superAdminSubtitle: "সাধারণ ব্যবহারকারীদের দেখার সুযোগ নেই। গ্লোবাল প্ল্যাটফর্ম নিয়ন্ত্রণ কেন্দ্র।",
    platformRev: "গ্লোবাল প্ল্যাটফর্ম মোট রাজস্ব (লাইসেন্স ও সাবস্ক্রিপশন)",
    activeMessesCount: "মোট সক্রিয় মেস সংখ্যা",
    totalUsersCount: "মোট নিবন্ধিত ইউজার",
    bkashNagadStatus: "পেমেন্ট গেটওয়ে স্ট্যাটাস",
    liveTxnTitle: "প্ল্যাটফর্মের লাইভ ট্রানজেকশন লগ",
    txnDate: "সময়",
    txnDesc: "বিস্তারিত",
    txnAmount: "পরিমাণ",
    statusText: "স্ট্যাটাস",
    togglePortalStatus: "স্যান্ডবক্স গ্লোবাল মেস ফায়ারওয়াল নিষ্ক্রিয়/সক্রিয় করুন",
    activeStatus: "সক্রিয়",
    bannedStatus: "সাময়িক স্থগিত",
    banToggleHelp: "এই প্ল্যাটফর্মের সকল মেসের স্যান্ডবক্স সাময়িকভাবে ব্লক বা একটিভ করার ডেমো বাটন",
    gatewayOnline: "অনলাইন / চালু রয়েছে",
    
    // Manager Command Center
    managerTitle: "ম্যানেজার কমান্ড সেন্টার",
    managerSubtitle: "রস্টার অ্যাকশন, পেমেন্ট অনুমোদন এবং মিল ম্যাট্রিক্স ভিউ",
    dutyMatrixTitle: "সাপ্তাহিক ডিউটি ম্যাট্রিক্স (পক্ষপাতহীন স্বয়ংক্রিয় বণ্টনকারী)",
    dutyMatrixSubtitle: "মেস মেম্বারদের সুবিধার জন্য সম্পূর্ণ পক্ষপাতহীন ও র্যান্ডম কাজের বন্টন",
    autoAssignBtn: "⚡ স্বয়ংক্রিয় ডিউটি বণ্টন (অটো-অ্যাসাইন)",
    cleanerHeader: "ঝাড়ু দেওয়ার কাজ (Cleaning Rota)",
    bazarHeader: "বাজার করার কাজ (Bazar Rota)",
    statusDone: "সম্পন্ন",
    statusPending: "বাকি আছে",
    markDone: "ডান চিহ্নিত করুন",
    verificationInboxTitle: "টাকা জমার রসিদ ভেরিফিকেশন ইনবক্স",
    verificationInboxSubtitle: "সদস্যদের আপলোড করা স্ক্রিনশট এবং ট্রানজেকশন আইডি যাচাই করুন",
    noProofs: "যাচাই করার মতো কোনো পেন্ডিং পেমেন্ট রসিদ নেই",
    paymentAmount: "টাকার পরিমাণ",
    paymentChannel: "পদ্ধতি",
    paymentTxID: "ট্রানজেকশন ID",
    acceptBtn: "অনুমোদন ও ব্যালেন্স যোগ করুন",
    rejectBtn: "বাতিল করুন",
    receiptLightboxTitle: "টাকা জমার আপলোড করা স্ক্রিনশট রসিদ",
    mealSheetTitle: "দৈনিক মিল এন্ট্রি শিট",
    mealSheetSubtitle: "সদস্যদের সকাল, দুপুর ও রাতের মিল এন্ট্রি দ্রুত অন/অফ করার গ্রিড",
    breakfastLabel: "সকালের খাবার (B)",
    lunchLabel: "দুপুরের খাবার (L)",
    dinnerLabel: "রাতের খাবার (D)",
    totalMeals: "মোট মিল",
    seatVacancyTitle: "খালি সিট বিজ্ঞাপন এবং টু-লেট প্রচারকারী",
    seatVacancySubtitle: "পাবলিক টু-লেট ফাইন্ডার বোর্ডে সরাসরি খালি মেস বা সিটের বিজ্ঞাপন দিন",
    createAdBtn: "📢 টু-লেট বিজ্ঞাপন তৈরি করুন",
    adMonthLabel: "কোন মাস থেকে খালি",
    roomTypeLabel: "রুমের ধরণ",
    singleType: "সিঙ্গেল রুম",
    sharedType: "শেয়ারড সিট",
    makeAdLive: "টু-লেট বিজ্ঞাপনটি সরাসরি লাইভ করে দিন",
    broadcastSuccessToast: "🚀 টু-লেট বিজ্ঞাপনটি পাবলিক ফাইন্ডার বোর্ডে লাইভ করা হয়েছে!",
    
    // Member Dashboard
    memberTitle: "মেম্বার ড্যাশবোর্ড",
    memberSubtitle: "নিজের মিল অন/অফ, টাকা জমা দেওয়ার রসিদ পাঠানো এবং ক্যাশ মেমো ডাউনলোড",
    myBalance: "আমার বর্তমান ব্যালেন্স",
    submitDepositBtn: "টাকা জমার প্রমাণ আপলোড করুন",
    depositAmountLabel: "টাকার পরিমাণ (৳)",
    depositChannelLabel: "কোন মাধ্যমে পাঠিয়েছেন?",
    txnIdLabel: "ট্রানজেকশন আই ডি (TxID)",
    screenshotLabel: "টাকা পাঠানোর স্ক্রিনশট লিংক / ডেমো ফটো নাম",
    submitProofConfirm: "🚀 স্ক্রিনশটসহ টাকা জমার রসিদ পাঠানো হয়েছে! ম্যানেজার অনুমোদনের পর যোগ হবে।",
    downReceiptTitle: "অনুমোদিত ক্যাশ মেমোসমূহ",
    downReceiptBtn: "ডিজিটাল ক্যাশ মেমো ডাউনলোড করুন",
    mealDeadlineAlert: "⚠️ প্রতিদিনের মিল লক-ইন সকাল ১০:০০ টা। সময় পার হলে পরিবর্তন আগামীকালের জন্য কার্যকর হবে।",
    selfServiceMeals: "সেলফ-সার্ভিস মিল সুইচ",
    mealKingBadge: "👑 মিল কিং (সবচেয়ে বেশি মিল খেয়েছেন)",
    dueKingBadge: "💸 ডিউ কিং (সর্বোচ্চ বাকি টাকা আছে)",
    analyticsLeaderboard: "লিডারবোর্ড এবং মেস র‍্যাংকিং",
    scoreRank: "র‍্যাংক এবং ব্যাজ",
    
    // Public Finder
    finderTitle: "🔍 খালি সিট ও টু-লেট খুঁজুন (To-Let Finder)",
    finderSubtitle: "মেস ম্যানেজারদের সরাসরি প্রচার করা রিয়েল-টাইম খালি সিটের আপডেট",
    locationFilter: "এলাকা নির্বাচন করুন",
    budgetFilter: "সর্বোচ্চ বাজেট (৳)",
    allLocations: "সকল এলাকা",
    contactManagerBtn: "📞 মেস ফ্লো তে ম্যানেজারের সাথে যোগাযোগ করুন",
    noAdsFound: "দুঃখিত, এই ফিল্টারের সাথে মিলে যাওয়ার মতো কোনো খালি সিট পাওয়া যায়নি।",
    copiedContact: "📞 ম্যানেজারের মোবাইল নম্বর কপি করা হয়েছে: ",
    
    // Footer redirect
    footerAuthor: "Created by Jubayer Ahmed Bhuiyan",
    footerWhatsApp: "WhatsApp-এ সরাসরি চ্যাট করুন"
  }
};

// Seed initial state components
export const initialMembers: Member[] = [
  {
    id: "m-1",
    name: "Jubayer Ahmed Bhuiyan",
    phone: "01611035490",
    role: "MANAGER",
    balance: 4500,
    meals: { breakfast: true, lunch: true, dinner: true },
    totalMealsMonth: 48,
    badge: null
  },
  {
    id: "m-2",
    name: "Fahim Rahman",
    phone: "01712345678",
    role: "MEMBER",
    balance: 3200,
    meals: { breakfast: true, lunch: true, dinner: false },
    totalMealsMonth: 58, // Meal King
    badge: "MEAL_KING"
  },
  {
    id: "m-3",
    name: "Shakil Hossain",
    phone: "01598765432",
    role: "MEMBER",
    balance: 1500,
    meals: { breakfast: false, lunch: true, dinner: true },
    totalMealsMonth: 35,
    badge: null
  },
  {
    id: "m-4",
    name: "Sayeedi Alam",
    phone: "01822446688",
    role: "MEMBER",
    balance: -1200, // Due King
    meals: { breakfast: true, lunch: false, dinner: true },
    totalMealsMonth: 22,
    badge: "DUE_KING"
  }
];

export const initialDuties: Duty[] = [
  { day: "Saturday", dayBn: "শনিবার", cleaner: "Fahim Rahman", cleanerId: "m-2", bazar: "Shakil Hossain", bazarId: "m-3", isDoneCleaner: true, isDoneBazar: true },
  { day: "Sunday", dayBn: "রবিবার", cleaner: "Shakil Hossain", cleanerId: "m-3", bazar: "Sayeedi Alam", bazarId: "m-4", isDoneCleaner: true, isDoneBazar: false },
  { day: "Monday", dayBn: "সোমবার", cleaner: "Sayeedi Alam", cleanerId: "m-4", bazar: "Jubayer Ahmed Bhuiyan", bazarId: "m-1", isDoneCleaner: false, isDoneBazar: true },
  { day: "Tuesday", dayBn: "মঙ্গলবার", cleaner: "Jubayer Ahmed Bhuiyan", cleanerId: "m-1", bazar: "Fahim Rahman", bazarId: "m-2", isDoneCleaner: false, isDoneBazar: false },
  { day: "Wednesday", dayBn: "বুধবার", cleaner: "Fahim Rahman", cleanerId: "m-2", bazar: "Shakil Hossain", bazarId: "m-3", isDoneCleaner: false, isDoneBazar: false },
  { day: "Thursday", dayBn: "বৃহস্পতিবার", cleaner: "Shakil Hossain", cleanerId: "m-3", bazar: "Sayeedi Alam", bazarId: "m-4", isDoneCleaner: false, isDoneBazar: false },
  { day: "Friday", dayBn: "শুক্রবার", cleaner: "Sayeedi Alam", cleanerId: "m-4", bazar: "Jubayer Ahmed Bhuiyan", bazarId: "m-1", isDoneCleaner: false, isDoneBazar: false }
];

export const initialPaymentProofs: PaymentProof[] = [
  {
    id: "proof-1",
    memberName: "Fahim Rahman",
    memberId: "m-2",
    amount: 2500,
    channel: "bKash",
    transactionId: "BK9X38D7K",
    screenshotUrl: "bkash_receipt_2500.png",
    status: "PENDING",
    submittedAt: "2026-05-21T10:15:00Z"
  },
  {
    id: "proof-2",
    memberName: "Sayeedi Alam",
    memberId: "m-4",
    amount: 1800,
    channel: "Nagad",
    transactionId: "NG88729A3",
    screenshotUrl: "nagad_receipt_1800.png",
    status: "PENDING",
    submittedAt: "2026-05-21T14:45:00Z"
  }
];

export const initialToLetAds: ToLetAd[] = [
  {
    id: "ad-1",
    messName: "Green Palace Mess",
    address: "Block B, Road 12, Mirpur 11.5, Dhaka - Near Metro Rail Station",
    rent: 2800,
    availableMonth: "June 2026",
    roomType: "SHARED",
    contactPhone: "01611035490",
    isLive: true
  },
  {
    id: "ad-2",
    messName: "Nikunja Sky Hostel",
    address: "Lake Road, Nikunja 2, Khilkhet, Dhaka",
    rent: 5500,
    availableMonth: "July 2026",
    roomType: "SINGLE",
    contactPhone: "01712345678",
    isLive: true
  },
  {
    id: "ad-3",
    messName: "Farmgate VIP Mess",
    address: "West Tejturi Bazar, Farmgate, Dhaka",
    rent: 3200,
    availableMonth: "June 2026",
    roomType: "SHARED",
    contactPhone: "01598765432",
    isLive: true
  }
];

export const initialSystemStats: SystemStats = {
  globalRevenue: 45900,
  activeMessCount: 134,
  totalUsers: 843,
  isbKashActive: true,
  isNagadActive: true
};

export const defaultOnboarding: OnboardingState = {
  messName: "",
  totalSeats: 4,
  address: "",
  managerPhone: "",
  costs: {
    houseRent: 12000,
    maidSalary: 3000,
    wifi: 500,
    utility: 2500,
    wasteBill: 300
  },
  mealDeadline: "সকাল ১০:০০ টা (10:00 AM)",
  rulesText: "১. গেস্ট নিয়ে আসার ট্রানজিটের ক্ষেত্রে ম্যানেজারকে জানাতে হবে।\n২. রুম ও ওয়াশরুম সবসময় পরিষ্কার রাখতে হবে।\n৩. রাত ১১:৩০ এর মধ্যে ডিনার শেষ করতে হবে।",
  members: [
    { name: "Sihab Uddin", phone: "01944556677" },
    { name: "Tanvir Hasan", phone: "01322114455" }
  ],
  joinCode: "MFLOW-98X2",
  isCompleted: false
};
