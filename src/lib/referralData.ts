// Referral System Types & Mock Data
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "rocket" | "star" | "fire" | "crown" | "diamond" | "zap" | "heart" | "target";
  requiredReferrals: number;
  reward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Streak {
  currentWeeks: number;
  maxWeeks: number;
  bonusPerWeek: number;
  lastActiveWeek: string;
}

export interface MonthlyContest {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prizes: {
    rank: number;
    prize: string;
    icon: "crown" | "medal" | "award";
  }[];
  topParticipants: {
    rank: number;
    name: string;
    avatar: string;
    referrals: number;
    isCurrentUser: boolean;
  }[];
  userRank: number;
  userReferralsThisMonth: number;
  totalParticipants: number;
}

export interface Referral {
  id: string;
  name: string;
  email: string;
  date: string;
  status: "pending" | "active" | "churned";
  earnedAmount: number;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
  rank: number;
  totalUsers: number;
  inviteCode: string;
  referralLink: string;
  streak: Streak;
}

// Mock Data
export const mockAchievements: Achievement[] = [
  {
    id: "first-invite",
    name: "İlk Adım",
    description: "İlk arkadaşını davet et",
    icon: "rocket",
    requiredReferrals: 1,
    reward: 10,
    unlocked: true,
    unlockedAt: "2026-01-05",
  },
  {
    id: "social-butterfly",
    name: "Sosyal Kelebek",
    description: "5 arkadaş davet et",
    icon: "heart",
    requiredReferrals: 5,
    reward: 50,
    unlocked: false,
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "10 arkadaş davet et",
    icon: "star",
    requiredReferrals: 10,
    reward: 100,
    unlocked: false,
  },
  {
    id: "ambassador",
    name: "Marka Elçisi",
    description: "25 arkadaş davet et",
    icon: "fire",
    requiredReferrals: 25,
    reward: 250,
    unlocked: false,
  },
  {
    id: "legend",
    name: "Efsane",
    description: "50 arkadaş davet et",
    icon: "crown",
    requiredReferrals: 50,
    reward: 500,
    unlocked: false,
  },
  {
    id: "diamond",
    name: "Elmas Üye",
    description: "100 arkadaş davet et",
    icon: "diamond",
    requiredReferrals: 100,
    reward: 1000,
    unlocked: false,
  },
];

export const mockStats: ReferralStats = {
  totalReferrals: 4,
  activeReferrals: 3,
  pendingReferrals: 1,
  totalEarned: 200,
  rank: 42,
  totalUsers: 1250,
  inviteCode: "REMUS2026",
  referralLink: "remus.energy/ref/REMUS2026",
  streak: {
    currentWeeks: 2,
    maxWeeks: 4,
    bonusPerWeek: 10,
    lastActiveWeek: "2026-01-13",
  },
};

export const mockContest: MonthlyContest = {
  id: "jan-2026",
  name: "Ocak 2026 Yarışması",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  prizes: [
    { rank: 1, prize: "1.000 TL + iPhone 16", icon: "crown" },
    { rank: 2, prize: "500 TL + AirPods", icon: "medal" },
    { rank: 3, prize: "250 TL", icon: "award" },
  ],
  topParticipants: [
    { rank: 1, name: "Emre K.", avatar: "EK", referrals: 23, isCurrentUser: false },
    { rank: 2, name: "Selin A.", avatar: "SA", referrals: 18, isCurrentUser: false },
    { rank: 3, name: "Burak T.", avatar: "BT", referrals: 15, isCurrentUser: false },
    { rank: 4, name: "Ayşe M.", avatar: "AM", referrals: 12, isCurrentUser: false },
    { rank: 5, name: "Can D.", avatar: "CD", referrals: 10, isCurrentUser: false },
    { rank: 42, name: "Sen", avatar: "AY", referrals: 2, isCurrentUser: true },
  ],
  userRank: 42,
  userReferralsThisMonth: 2,
  totalParticipants: 847,
};

export const mockReferrals: Referral[] = [
  { id: "1", name: "Mehmet K.", email: "m***@gmail.com", date: "2026-01-16", status: "active", earnedAmount: 50 },
  { id: "2", name: "Ayşe Y.", email: "a***@gmail.com", date: "2026-01-10", status: "active", earnedAmount: 50 },
  { id: "3", name: "Can D.", email: "c***@hotmail.com", date: "2026-01-03", status: "active", earnedAmount: 50 },
  { id: "4", name: "Zeynep A.", email: "z***@outlook.com", date: "2025-12-28", status: "pending", earnedAmount: 0 },
];

// Helper functions
export function getTimeUntilContestEnd(endDate: string): { days: number; hours: number; minutes: number } {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}

export function getNextAchievement(achievements: Achievement[], currentReferrals: number): Achievement | null {
  return achievements.find(a => !a.unlocked && a.requiredReferrals > currentReferrals) || null;
}

export function getAchievementProgress(achievement: Achievement, currentReferrals: number): number {
  if (achievement.unlocked) return 100;
  return Math.min(100, (currentReferrals / achievement.requiredReferrals) * 100);
}
