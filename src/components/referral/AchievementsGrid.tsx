import { Progress } from "@/components/ui/progress";
import { AchievementBadge } from "./AchievementBadge";
import type { Achievement } from "@/lib/referralData";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementsGridProps {
  achievements: Achievement[];
  currentReferrals: number;
  onViewAll?: () => void;
}

export function AchievementsGrid({ achievements, currentReferrals, onViewAll }: AchievementsGridProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const nextAchievement = achievements.find(a => !a.unlocked);
  const progress = nextAchievement
    ? (currentReferrals / nextAchievement.requiredReferrals) * 100
    : 100;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Rozetler</h3>
              <p className="text-xs text-muted-foreground">
                {unlockedCount} / {achievements.length} rozet kazanıldı
              </p>
            </div>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" className="gap-1" onClick={onViewAll}>
              Tümü
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {achievements.slice(0, 6).map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              size="md"
            />
          ))}
        </div>
      </div>

      {/* Next Achievement Progress */}
      {nextAchievement && (
        <div className="p-4 pt-0">
          <div className="bg-secondary/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AchievementBadge achievement={nextAchievement} size="sm" showTooltip={false} />
                <div>
                  <p className="text-sm font-medium text-foreground">{nextAchievement.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {nextAchievement.requiredReferrals - currentReferrals} davet kaldı
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">+{nextAchievement.reward} TL</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
}
