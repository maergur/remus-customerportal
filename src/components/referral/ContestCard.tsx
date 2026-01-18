import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, Award, Clock, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { MonthlyContest } from "@/lib/referralData";
import { getTimeUntilContestEnd } from "@/lib/referralData";

interface ContestCardProps {
  contest: MonthlyContest;
  onViewDetails?: () => void;
}

const rankIcons = {
  crown: Crown,
  medal: Medal,
  award: Award,
};

const rankColors = {
  1: "from-yellow-400 to-amber-500",
  2: "from-gray-300 to-gray-400",
  3: "from-amber-500 to-orange-600",
};

export function ContestCard({ contest, onViewDetails }: ContestCardProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilContestEnd(contest.endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilContestEnd(contest.endDate));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [contest.endDate]);

  const topThree = contest.topParticipants.filter(p => p.rank <= 3);
  const userEntry = contest.topParticipants.find(p => p.isCurrentUser);

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-card rounded-2xl border border-primary/20 overflow-hidden">
      {/* Header with countdown */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">{contest.name}</h3>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Users className="h-3 w-3" />
                <span>{contest.totalParticipants} katılımcı</span>
              </div>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
              <Clock className="h-3 w-3" />
              <span>Bitiş:</span>
            </div>
            <div className="flex gap-1">
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold text-sm">{timeLeft.days}</span>
                <span className="text-white/70 text-[10px] ml-0.5">G</span>
              </div>
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold text-sm">{timeLeft.hours}</span>
                <span className="text-white/70 text-[10px] ml-0.5">S</span>
              </div>
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="text-white font-bold text-sm">{timeLeft.minutes}</span>
                <span className="text-white/70 text-[10px] ml-0.5">D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-3">ÖDÜLLER</p>
        <div className="grid grid-cols-3 gap-2">
          {contest.prizes.map((prize) => {
            const Icon = rankIcons[prize.icon];
            return (
              <div
                key={prize.rank}
                className={cn(
                  "text-center p-3 rounded-xl border",
                  prize.rank === 1 
                    ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30" 
                    : "bg-secondary/50 border-border"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full mx-auto mb-2 flex items-center justify-center",
                  prize.rank === 1 && "bg-gradient-to-br from-yellow-400 to-amber-500",
                  prize.rank === 2 && "bg-gradient-to-br from-gray-300 to-gray-400",
                  prize.rank === 3 && "bg-gradient-to-br from-amber-500 to-orange-600"
                )}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-[10px] text-muted-foreground">{prize.rank}. Sıra</p>
                <p className="text-xs font-semibold text-foreground mt-0.5 line-clamp-2">{prize.prize}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-3">LİDERLER</p>
        <div className="flex justify-center items-end gap-2">
          {/* 2nd place */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
              `bg-gradient-to-br ${rankColors[2]}`
            )}>
              {topThree[1]?.avatar}
            </div>
            <Medal className="h-4 w-4 text-gray-400 mt-1" />
            <p className="text-xs font-medium text-foreground mt-1">{topThree[1]?.name}</p>
            <p className="text-[10px] text-muted-foreground">{topThree[1]?.referrals} davet</p>
            <div className="mt-2 h-12 w-16 bg-secondary rounded-t-lg flex items-center justify-center">
              <span className="text-lg font-bold text-gray-500">2</span>
            </div>
          </div>
          
          {/* 1st place */}
          <div className="flex flex-col items-center -mt-4">
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ring-4 ring-yellow-400/30",
              `bg-gradient-to-br ${rankColors[1]}`
            )}>
              {topThree[0]?.avatar}
            </div>
            <Crown className="h-5 w-5 text-yellow-500 mt-1" />
            <p className="text-xs font-medium text-foreground mt-1">{topThree[0]?.name}</p>
            <p className="text-[10px] text-muted-foreground">{topThree[0]?.referrals} davet</p>
            <div className="mt-2 h-16 w-16 bg-gradient-to-t from-yellow-100 to-white dark:from-yellow-500/20 dark:to-card rounded-t-lg flex items-center justify-center border-2 border-yellow-400/50">
              <span className="text-xl font-bold text-yellow-500">1</span>
            </div>
          </div>
          
          {/* 3rd place */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
              `bg-gradient-to-br ${rankColors[3]}`
            )}>
              {topThree[2]?.avatar}
            </div>
            <Award className="h-4 w-4 text-amber-600 mt-1" />
            <p className="text-xs font-medium text-foreground mt-1">{topThree[2]?.name}</p>
            <p className="text-[10px] text-muted-foreground">{topThree[2]?.referrals} davet</p>
            <div className="mt-2 h-10 w-16 bg-secondary rounded-t-lg flex items-center justify-center">
              <span className="text-lg font-bold text-amber-600">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's position */}
      {userEntry && (
        <div className="p-4">
          <div className="flex items-center justify-between bg-primary/5 rounded-xl p-3 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {userEntry.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">Senin Sıran</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    #{contest.userRank}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bu ay {contest.userReferralsThisMonth} davet
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onViewDetails} className="gap-1">
              Detay
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress to next rank */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Bir sonraki sıraya</span>
              <span>{8 - contest.userReferralsThisMonth} davet kaldı</span>
            </div>
            <Progress value={(contest.userReferralsThisMonth / 8) * 100} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
}
