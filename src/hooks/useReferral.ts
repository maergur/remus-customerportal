import { useState, useCallback } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  mockAchievements,
  mockStats,
  mockContest,
  mockReferrals,
  type Achievement,
  type ReferralStats,
  type MonthlyContest,
  type Referral,
} from "@/lib/referralData";

export function useReferral() {
  const [copied, setCopied] = useState(false);
  const [stats] = useState<ReferralStats>(mockStats);
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [contest] = useState<MonthlyContest>(mockContest);
  const [referrals] = useState<Referral[]>(mockReferrals);

  const handleCopy = useCallback(async (text: string, type: "code" | "link" = "code") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(type === "code" ? "Davet kodu kopyalandı!" : "Referans linki kopyalandı!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopyalama başarısız oldu");
    }
  }, []);

  const handleShare = useCallback((platform: string, code: string) => {
    const message = `Remus Enerji'ye katıl ve enerji faturalarından tasarruf et! 🌱⚡\n\nDavet kodum: ${code}\n\nHemen üye ol, ikimiz de kazanalım!`;
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?text=${encodeURIComponent(message)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleNativeShare = useCallback(async (code: string) => {
    const shareData = {
      title: "Remus Enerji Davet",
      text: `Remus Enerji'ye katıl ve enerji faturalarından tasarruf et! Davet kodum: ${code}`,
      url: `https://remus.energy/ref/${code}`,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Paylaşım başarılı!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Paylaşım başarısız oldu");
        }
      }
    } else {
      // Fallback to copy
      handleCopy(`https://remus.energy/ref/${code}`, "link");
    }
  }, [handleCopy]);

  const triggerCelebration = useCallback(() => {
    // Confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#07A86C", "#0EA5E9", "#F59E0B", "#8B5CF6"],
    });
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const nextAchievement = lockedAchievements[0] || null;
  const nextAchievementProgress = nextAchievement
    ? (stats.totalReferrals / nextAchievement.requiredReferrals) * 100
    : 100;

  return {
    // State
    copied,
    stats,
    achievements,
    contest,
    referrals,
    
    // Computed
    unlockedAchievements,
    lockedAchievements,
    nextAchievement,
    nextAchievementProgress,
    
    // Actions
    handleCopy,
    handleShare,
    handleNativeShare,
    triggerCelebration,
  };
}
