import { Leaf, Zap, Sun, Crown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface Tier {
  id: string;
  name: string;
  icon: "leaf" | "zap" | "sun" | "crown";
  requiredReferrals: number;
  color: string;
  bgGradient: string;
  benefits: string[];
}

const tiers: Tier[] = [
  {
    id: "bronze",
    name: "Enerji Dostu",
    icon: "leaf",
    requiredReferrals: 0,
    color: "text-amber-700",
    bgGradient: "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20",
    benefits: ["Her davet için 50 TL"],
  },
  {
    id: "silver",
    name: "Yeşil Kahraman",
    icon: "zap",
    requiredReferrals: 5,
    color: "text-emerald-600",
    bgGradient: "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20",
    benefits: ["Her davet için 75 TL", "%5 fatura indirimi"],
  },
  {
    id: "gold",
    name: "Sürdürülebilirlik Elçisi",
    icon: "sun",
    requiredReferrals: 15,
    color: "text-yellow-600",
    bgGradient: "from-yellow-100 to-amber-50 dark:from-yellow-900/30 dark:to-amber-800/20",
    benefits: ["Her davet için 100 TL", "%10 fatura indirimi", "Öncelikli destek"],
  },
  {
    id: "diamond",
    name: "Enerji Şampiyonu",
    icon: "crown",
    requiredReferrals: 30,
    color: "text-cyan-500",
    bgGradient: "from-cyan-100 to-blue-50 dark:from-cyan-900/30 dark:to-blue-800/20",
    benefits: ["Her davet için 150 TL", "%15 fatura indirimi", "VIP destek", "Özel etkinlik davetleri"],
  },
];

const iconMap = {
  leaf: Leaf,
  zap: Zap,
  sun: Sun,
  crown: Crown,
};

interface TierCardProps {
  currentReferrals: number;
  onViewBenefits?: () => void;
}

export function TierCard({ currentReferrals, onViewBenefits }: TierCardProps) {
  // Find current tier
  const currentTierIndex = tiers.findIndex((tier, index) => {
    const nextTier = tiers[index + 1];
    if (!nextTier) return true;
    return currentReferrals < nextTier.requiredReferrals;
  });

  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];
  const CurrentIcon = iconMap[currentTier.icon];

  // Calculate progress to next tier
  const progressToNext = nextTier
    ? ((currentReferrals - currentTier.requiredReferrals) /
        (nextTier.requiredReferrals - currentTier.requiredReferrals)) *
      100
    : 100;

  const referralsToNext = nextTier
    ? nextTier.requiredReferrals - currentReferrals
    : 0;

  return (
    <div className={cn(
      "rounded-2xl border border-border overflow-hidden",
      `bg-gradient-to-br ${currentTier.bgGradient}`
    )}>
      {/* Tier Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
              "bg-white/80 dark:bg-white/10 shadow-sm"
            )}>
              <CurrentIcon className={cn("h-6 w-6 sm:h-7 sm:w-7", currentTier.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mevcut Seviyen
              </p>
              <h3 className={cn("text-lg sm:text-xl font-bold truncate", currentTier.color)}>
                {currentTier.name}
              </h3>
            </div>
          </div>
          
          {/* Tier badges */}
          <div className="hidden xs:flex gap-1 shrink-0">
            {tiers.map((tier, index) => {
              const Icon = iconMap[tier.icon];
              const isActive = index <= currentTierIndex;
              return (
                <div
                  key={tier.id}
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all",
                    isActive
                      ? "bg-white/80 dark:bg-white/20 shadow-sm"
                      : "bg-black/5 dark:bg-white/5"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors",
                      isActive ? tier.color : "text-muted-foreground/40"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="space-y-2">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 text-sm">
              <span className="text-muted-foreground">
                Sonraki: <span className={cn("font-semibold", nextTier.color)}>{nextTier.name}</span>
              </span>
              <span className="font-medium text-foreground">
                {currentReferrals} / {nextTier.requiredReferrals}
              </span>
            </div>
            <Progress value={progressToNext} className="h-2 sm:h-2.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{referralsToNext} davet</span> ile bir sonraki seviyeye ulaş
            </p>
          </div>
        )}

        {/* Max tier message */}
        {!nextTier && (
          <div className="bg-white/50 dark:bg-white/10 rounded-xl p-3 text-center">
            <p className="text-sm font-medium text-foreground">
              🎉 En yüksek seviyeye ulaştın!
            </p>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="border-t border-border/50 bg-white/30 dark:bg-black/10 p-3 sm:p-4">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1.5">Avantajların</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {currentTier.benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-white/70 dark:bg-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium text-foreground"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
          {onViewBenefits && (
            <button
              onClick={onViewBenefits}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
            >
              Tümü
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { tiers };
