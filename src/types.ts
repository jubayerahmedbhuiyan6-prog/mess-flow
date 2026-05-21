/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CostMatrix {
  houseRent: number;
  maidSalary: number;
  wifi: number;
  utility: number;
  wasteBill: number;
}

export interface OnboardingState {
  messName: string;
  totalSeats: number;
  address: string;
  managerPhone: string;
  costs: CostMatrix;
  mealDeadline: string;
  rulesText: string;
  members: Array<{ name: string; phone: string }>;
  joinCode: string;
  isCompleted: boolean;
}

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "MEMBER" | "PUBLIC_GUEST";

export interface Member {
  id: string;
  name: string;
  banglaName?: string;
  phone: string;
  role: "MANAGER" | "MEMBER";
  balance: number;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  totalMealsMonth: number;
  badge?: "MEAL_KING" | "DUE_KING" | null;
}

export interface Duty {
  day: string; // "Saturday" | "Sunday" | ...
  dayBn: string; // "শনিবার" | "রবিবার" | ...
  cleaner: string;
  cleanerId: string;
  bazar: string;
  bazarId: string;
  isDoneCleaner: boolean;
  isDoneBazar: boolean;
}

export interface PaymentProof {
  id: string;
  memberName: string;
  memberId: string;
  amount: number;
  channel: "bKash" | "Nagad";
  transactionId: string;
  screenshotUrl: string; // Mock visual representation or base64 or custom stylish SVG card
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  comment?: string;
}

export interface ToLetAd {
  id: string;
  messName: string;
  address: string;
  rent: number;
  availableMonth: string; // e.g., "June 2026"
  roomType: "SINGLE" | "SHARED";
  contactPhone: string;
  isLive: boolean;
}

export interface SystemStats {
  globalRevenue: number;
  activeMessCount: number;
  totalUsers: number;
  isbKashActive: boolean;
  isNagadActive: boolean;
}

export interface AppState {
  currentRole: UserRole;
  language: "en" | "bn";
  onboarding: OnboardingState;
  members: Member[];
  duties: Duty[];
  paymentProofs: PaymentProof[];
  toLetAds: ToLetAd[];
  systemStats: SystemStats;
  isLoggedIn: boolean;
  loggedInMemberId: string;
}
