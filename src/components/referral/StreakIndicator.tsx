import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Streak } from "@/lib/referralData";

interface StreakIndicatorProps {
  streak: Streak;
  compact?: boolean;
}

export function StreakIndicator({ streak, compact = false }: StreakIndicatorProps) {
  const { currentWeeks, maxWeeks, bonusPerWeek } = streak;
  const isActive = currentWeeks > 0;

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        isActive 
          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" 
          : "bg-secondary text-muted-foreground"
      )}>
        <Flame className={cn("h-3.5 w-3.5", isActive && "animate-pulse")} />
        <span>{currentWeeks} hafta</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-xl p-4 border border-orange-200/50 dark:border-orange-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            isActive 
              ? "bg-gradient-to-br from-orange-400 to-red-500" 
              : "bg-secondary"
          )}>
            <Flame className={cn(
              "h-5 w-5",
              isActive ? "text-white" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Davet Serisi</p>
            <p className="text-xs text-muted-foreground">Her hafta davet et, bonus kazan!</p>
          </div>
        </div>
        {isActive && (
          <div className="text-right">
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              +{currentWeeks * bonusPerWeek} TL
            </p>
            <p className="text-xs text-muted-foreground">bonus</p>
          </div>
        )}
      </div>

      {/* Streak dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: maxWeeks }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-full transition-all",
              i < currentWeeks
                ? "bg-gradient-to-r from-orange-400 to-amber-500"
                : "bg-secondary"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Hafta 1</span>
        <span>Hafta {maxWeeks}</span>
      </div>
    </div>
  );
}
