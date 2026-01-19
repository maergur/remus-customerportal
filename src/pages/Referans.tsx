import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useReferral } from "@/hooks/useReferral";
import referralHero from "@/assets/referral-hero.jpg";

// Components
import { StatsCard } from "@/components/referral/StatsCard";
import { ShareCard } from "@/components/referral/ShareCard";
import { ContestCard } from "@/components/referral/ContestCard";
import { AchievementsGrid } from "@/components/referral/AchievementsGrid";
import { StreakIndicator } from "@/components/referral/StreakIndicator";
import { ReferralList } from "@/components/referral/ReferralList";
import { AchievementBadge } from "@/components/referral/AchievementBadge";

const Referans = () => {
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);
  
  const {
    copied,
    stats,
    achievements,
    contest,
    referrals,
    nextAchievement,
    nextAchievementProgress,
    handleCopy,
    handleShare,
    handleNativeShare,
  } = useReferral();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Hero Section - Compact with value prop */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${referralHero})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left side - Value proposition */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">Referans Programı</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                  Arkadaşını Getir,<br />
                  <span className="text-yellow-300">Birlikte Kazanın!</span>
                </h1>
                
                <p className="text-white/80 text-base md:text-lg max-w-md mb-4">
                  Her davet ettiğin arkadaş için <span className="font-bold text-white">50 TL</span> kazan,
                  arkadaşın da <span className="font-bold text-white">25 TL</span> indirim kazansın.
                </p>

                {/* Quick CTA */}
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 gap-2 font-semibold shadow-lg"
                  onClick={() => handleNativeShare(stats.inviteCode)}
                >
                  Şimdi Paylaş
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Right side - Quick Stats + Next Achievement */}
              <div className="flex flex-col gap-4 lg:items-end">
                {/* Stats row */}
                <div className="flex gap-4 md:gap-6">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                    <div className="text-2xl md:text-3xl font-bold text-white">{stats.totalReferrals}</div>
                    <div className="text-white/70 text-xs">Davet</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                    <div className="text-2xl md:text-3xl font-bold text-white">{stats.totalEarned} ₺</div>
                    <div className="text-white/70 text-xs">Kazanç</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                    <div className="text-2xl md:text-3xl font-bold text-white">#{stats.rank}</div>
                    <div className="text-white/70 text-xs">Sıralama</div>
                  </div>
                </div>

                {/* Next achievement preview */}
                {nextAchievement && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
                    <AchievementBadge achievement={nextAchievement} size="sm" showTooltip={false} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs">Sonraki Rozet</p>
                      <p className="text-white font-medium text-sm truncate">{nextAchievement.name}</p>
                      <div className="h-1.5 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${nextAchievementProgress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-300 font-bold text-sm">+{nextAchievement.reward} TL</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCard stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Share & Streak */}
          <div className="lg:col-span-2 space-y-6">
            {/* Share Card */}
            <ShareCard
              inviteCode={stats.inviteCode}
              referralLink={stats.referralLink}
              copied={copied}
              onCopy={handleCopy}
              onShare={handleShare}
              onNativeShare={handleNativeShare}
            />

            {/* How it works - Compact */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Nasıl Çalışır?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: 1, title: "Kodu Paylaş", desc: "Davet kodunu arkadaşlarınla paylaş" },
                  { step: 2, title: "Kayıt Olsun", desc: "Arkadaşın kodunu kullanarak üye olsun" },
                  { step: 3, title: "Kazanın", desc: "İkiniz de ödül kazanın!" },
                ].map((item, idx) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{item.step}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    {idx < 2 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block self-center ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Indicator */}
            <StreakIndicator streak={stats.streak} />

            {/* Tabs for Referrals & Full Leaderboard */}
            <Tabs defaultValue="referrals" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="referrals">Davetlerim</TabsTrigger>
                <TabsTrigger value="leaderboard">Genel Sıralama</TabsTrigger>
              </TabsList>
              
              <TabsContent value="referrals" className="mt-4">
                <ReferralList 
                  referrals={referrals} 
                  maxItems={4}
                  onViewAll={() => setShowAllReferrals(true)}
                />
              </TabsContent>
              
              <TabsContent value="leaderboard" className="mt-4">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {[
                      { rank: 1, name: "Emre K.", referrals: 47, earned: "2.350 TL", avatar: "EK" },
                      { rank: 2, name: "Selin A.", referrals: 38, earned: "1.900 TL", avatar: "SA" },
                      { rank: 3, name: "Burak T.", referrals: 31, earned: "1.550 TL", avatar: "BT" },
                      { rank: 4, name: "Ayşe M.", referrals: 28, earned: "1.400 TL", avatar: "AM" },
                      { rank: 5, name: "Can D.", referrals: 24, earned: "1.200 TL", avatar: "CD" },
                      { rank: stats.rank, name: "Sen", referrals: stats.totalReferrals, earned: `${stats.totalEarned} TL`, avatar: "AY", isCurrentUser: true },
                    ].map((user) => (
                      <div 
                        key={user.rank}
                        className={`flex items-center justify-between p-4 ${
                          user.isCurrentUser ? "bg-primary/5" : "hover:bg-secondary/50"
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 text-center font-bold ${
                            user.rank === 1 ? "text-yellow-500" : 
                            user.rank === 2 ? "text-gray-400" : 
                            user.rank === 3 ? "text-amber-600" : "text-muted-foreground"
                          }`}>
                            #{user.rank}
                          </div>
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm ${
                            user.isCurrentUser 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary text-foreground"
                          }`}>
                            {user.avatar}
                          </div>
                          <div>
                            <p className={`font-medium ${user.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                              {user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.referrals} davet</p>
                          </div>
                        </div>
                        <p className="font-bold text-foreground">{user.earned}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Contest & Achievements */}
          <div className="space-y-6">
            {/* Monthly Contest */}
            <ContestCard contest={contest} />

            {/* Achievements */}
            <AchievementsGrid 
              achievements={achievements}
              currentReferrals={stats.totalReferrals}
              onViewAll={() => setShowAllAchievements(true)}
            />
          </div>
        </div>
      </div>

      {/* All Achievements Sheet */}
      <Sheet open={showAllAchievements} onOpenChange={setShowAllAchievements}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tüm Rozetler</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  achievement.unlocked 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-secondary/50 border-border"
                }`}
              >
                <AchievementBadge achievement={achievement} size="md" showTooltip={false} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <p className="text-xs text-emerald-500 mt-1">
                      ✓ {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString("tr-TR")} tarihinde kazanıldı
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.requiredReferrals - stats.totalReferrals} davet kaldı
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${achievement.unlocked ? "text-emerald-500" : "text-muted-foreground"}`}>
                    +{achievement.reward} TL
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* All Referrals Sheet */}
      <Sheet open={showAllReferrals} onOpenChange={setShowAllReferrals}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tüm Davetlerin ({referrals.length})</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ReferralList referrals={referrals} />
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Referans;
