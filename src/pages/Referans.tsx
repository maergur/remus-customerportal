import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Gift, Copy, Check, Users, TrendingUp, Trophy, Sparkles, Crown, Medal, Award, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Referans = () => {
  const [copied, setCopied] = useState(false);
  const inviteCode = "REMUS2024";
  const earned = 200;
  const goal = 500;
  const progress = (earned / goal) * 100;
  const referralCount = 4;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("Davet kodu kopyalandı!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `Remus Enerji'ye katıl ve enerji faturalarından tasarruf et! Davet kodum: ${inviteCode}`;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`,
    };
    window.open(urls[platform], "_blank");
  };

  const steps = [
    { step: 1, title: "Kodu Paylaş", desc: "Arkadaşlarınla davet kodunu paylaş", icon: Gift },
    { step: 2, title: "Kayıt Olsun", desc: "Arkadaşın Remus'a üye olsun", icon: Users },
    { step: 3, title: "Kazanın", desc: "İkiniz de ödül kazanın!", icon: Sparkles },
  ];

  const leaderboard = [
    { rank: 1, name: "Emre K.", referrals: 47, earned: "2.350 TL", avatar: "EK", isCurrentUser: false },
    { rank: 2, name: "Selin A.", referrals: 38, earned: "1.900 TL", avatar: "SA", isCurrentUser: false },
    { rank: 3, name: "Burak T.", referrals: 31, earned: "1.550 TL", avatar: "BT", isCurrentUser: false },
    { rank: 4, name: "Ayşe M.", referrals: 28, earned: "1.400 TL", avatar: "AM", isCurrentUser: false },
    { rank: 5, name: "Can D.", referrals: 24, earned: "1.200 TL", avatar: "CD", isCurrentUser: false },
    { rank: 42, name: "Sen", referrals: 4, earned: "200 TL", avatar: "AY", isCurrentUser: true },
  ];

  const referrals = [
    { name: "Mehmet K.", date: "2 gün önce", status: "active", earned: "50 TL" },
    { name: "Ayşe Y.", date: "1 hafta önce", status: "active", earned: "50 TL" },
    { name: "Can D.", date: "2 hafta önce", status: "active", earned: "50 TL" },
    { name: "Zeynep A.", date: "3 hafta önce", status: "pending", earned: "Bekliyor" },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Compact Hero with Value Proposition */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-energy-blue p-6 md:p-8">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-20">
            <Gift className="w-full h-full" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Arkadaşını Getir, Kazan!
              </h1>
              <p className="text-white/80 text-base max-w-md">
                Her arkadaşın için <span className="font-bold text-white">50 TL</span> kazan,
                arkadaşın da <span className="font-bold text-white">25 TL</span> indirim kazansın.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{referralCount}</div>
                <div className="text-white/70 text-sm">Davet</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{earned} ₺</div>
                <div className="text-white/70 text-sm">Kazanç</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Horizontal Steps */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-5">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((item, idx) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Share Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invite Code Card */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Davet Kodun</h2>
              
              <div className="bg-white dark:bg-card rounded-xl p-5 border border-primary/20 shadow-sm mb-5">
                <div className="flex items-center justify-between gap-3">
                  <code className="text-2xl font-bold text-foreground tracking-[0.2em]">
                    {inviteCode}
                  </code>
                  <Button
                    variant={copied ? "default" : "outline"}
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0 gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Kopyalandı!" : "Kopyala"}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">Arkadaşlarınla paylaş:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-[#25D366]/5 hover:bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366]"
                  onClick={() => handleShare("whatsapp")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#1DA1F2]/5 hover:bg-[#1DA1F2]/10 border-[#1DA1F2]/20 text-[#1DA1F2]"
                  onClick={() => handleShare("twitter")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#1877F2]/5 hover:bg-[#1877F2]/10 border-[#1877F2]/20 text-[#1877F2]"
                  onClick={() => handleShare("facebook")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Hedefin</h2>
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">+100 TL Bonus</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">İlerleme</span>
                  <span className="font-semibold">
                    <span className="text-primary">{earned} TL</span>
                    <span className="text-muted-foreground"> / {goal} TL</span>
                  </span>
                </div>
                <Progress value={progress} variant="glow" className="h-3" />
              </div>
              
              <p className="text-sm text-muted-foreground">
                {goal - earned} TL daha kazanarak <span className="text-primary font-medium">bonus ödülü</span> aç!
              </p>
            </div>
          </div>

          {/* Right Column - Tabs for Leaderboard & Referrals */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="leaderboard" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="leaderboard" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Sıralama
                </TabsTrigger>
                <TabsTrigger value="referrals" className="gap-2">
                  <Users className="h-4 w-4" />
                  Davetlerim
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="leaderboard" className="mt-0">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  {/* Top 3 Podium */}
                  <div className="bg-gradient-to-b from-primary/5 to-transparent p-6">
                    <div className="flex justify-center items-end gap-4">
                      {/* 2nd Place */}
                      <div className="flex flex-col items-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg mb-2">
                          {leaderboard[1].avatar}
                        </div>
                        <Medal className="h-5 w-5 text-gray-400 mb-1" />
                        <p className="text-sm font-medium text-foreground">{leaderboard[1].name}</p>
                        <p className="text-xs text-muted-foreground">{leaderboard[1].referrals} davet</p>
                        <div className="mt-2 h-16 w-20 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-t-lg flex items-center justify-center shadow-sm">
                          <span className="text-lg font-bold text-gray-500">2</span>
                        </div>
                      </div>
                      
                      {/* 1st Place */}
                      <div className="flex flex-col items-center -mt-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xl mb-2 ring-4 ring-yellow-400/30">
                          {leaderboard[0].avatar}
                        </div>
                        <Crown className="h-6 w-6 text-yellow-500 mb-1" />
                        <p className="text-sm font-medium text-foreground">{leaderboard[0].name}</p>
                        <p className="text-xs text-muted-foreground">{leaderboard[0].referrals} davet</p>
                        <div className="mt-2 h-20 w-20 bg-white dark:bg-card rounded-t-lg flex items-center justify-center border-2 border-yellow-400/50 shadow-sm">
                          <span className="text-xl font-bold text-yellow-500">1</span>
                        </div>
                      </div>
                      
                      {/* 3rd Place */}
                      <div className="flex flex-col items-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                          {leaderboard[2].avatar}
                        </div>
                        <Award className="h-5 w-5 text-amber-600 mb-1" />
                        <p className="text-sm font-medium text-foreground">{leaderboard[2].name}</p>
                        <p className="text-xs text-muted-foreground">{leaderboard[2].referrals} davet</p>
                        <div className="mt-2 h-12 w-20 bg-white dark:bg-card border border-amber-200 dark:border-border rounded-t-lg flex items-center justify-center shadow-sm">
                          <span className="text-lg font-bold text-amber-600">3</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rest of leaderboard */}
                  <div className="divide-y divide-border">
                    {leaderboard.slice(3).map((user) => (
                      <div 
                        key={user.rank}
                        className={`flex items-center justify-between p-4 transition-colors ${
                          user.isCurrentUser ? "bg-primary/5" : "hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 text-center">
                            {getRankIcon(user.rank)}
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
                              {user.name} {user.isCurrentUser && <span className="text-xs">(Sen)</span>}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.referrals} davet</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{user.earned}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="referrals" className="mt-0">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {referrals.map((referral, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-energy-blue flex items-center justify-center text-white font-bold">
                            {referral.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{referral.name}</p>
                            <p className="text-sm text-muted-foreground">{referral.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${referral.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                            {referral.earned}
                          </p>
                          <p className={`text-xs ${referral.status === 'active' ? 'text-energy-green' : 'text-energy-orange'}`}>
                            {referral.status === 'active' ? 'Aktif' : 'Beklemede'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {referrals.length === 0 && (
                    <div className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Henüz davet yok</p>
                      <p className="text-sm text-muted-foreground">Kodunu paylaş ve kazanmaya başla!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referans;
