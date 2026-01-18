import { Rocket, Star, Flame, Crown, Diamond, Zap, Heart, Target, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/referralData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  onClick?: () => void;
}

const iconMap = {
  rocket: Rocket,
  star: Star,
  fire: Flame,
  crown: Crown,
  diamond: Diamond,
  zap: Zap,
  heart: Heart,
  target: Target,
};

const colorMap = {
  rocket: "from-blue-400 to-blue-600",
  star: "from-yellow-400 to-amber-500",
  fire: "from-orange-400 to-red-500",
  crown: "from-yellow-300 to-yellow-500",
  diamond: "from-cyan-300 to-blue-500",
  zap: "from-purple-400 to-purple-600",
  heart: "from-pink-400 to-rose-500",
  target: "from-emerald-400 to-teal-500",
};

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const iconSizeMap = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
};

export function AchievementBadge({
  achievement,
  size = "md",
  showTooltip = true,
  onClick,
}: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon];
  const isLocked = !achievement.unlocked;

  const badge = (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "relative rounded-full flex items-center justify-center transition-all duration-300",
        sizeMap[size],
        isLocked
          ? "bg-secondary/80 border-2 border-dashed border-muted-foreground/30"
          : `bg-gradient-to-br ${colorMap[achievement.icon]} shadow-lg ring-2 ring-white/20`,
        onClick && "hover:scale-110 cursor-pointer",
        !isLocked && "animate-pulse-subtle"
      )}
    >
      {isLocked ? (
        <Lock className={cn("text-muted-foreground/50", iconSizeMap[size])} />
      ) : (
        <Icon className={cn("text-white drop-shadow-md", iconSizeMap[size])} />
      )}
      
      {/* Glow effect for unlocked */}
      {!isLocked && (
        <div className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-50 blur-md -z-10",
          colorMap[achievement.icon]
        )} />
      )}
    </button>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] text-center">
          <p className="font-semibold">{achievement.name}</p>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
          {isLocked ? (
            <p className="text-xs mt-1 text-primary font-medium">
              {achievement.requiredReferrals} davet gerekli
            </p>
          ) : (
            <p className="text-xs mt-1 text-emerald-500 font-medium">
              +{achievement.reward} TL kazanıldı!
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
