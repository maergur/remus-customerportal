import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Gift, Copy, Check, Share2, Users, TrendingUp, Trophy, Sparkles, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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

  const rewards = [
    { friends: 1, reward: "50 TL", unlocked: true },
    { friends: 3, reward: "150 TL", unlocked: true },
    { friends: 5, reward: "300 TL + Bonus", unlocked: false },
    { friends: 10, reward: "750 TL + VIP", unlocked: false },
  ];

  const referrals = [
    { name: "Mehmet K.", date: "2 gün önce", status: "active", earned: "50 TL" },
    { name: "Ayşe Y.", date: "1 hafta önce", status: "active", earned: "50 TL" },
    { name: "Can D.", date: "2 hafta önce", status: "active", earned: "50 TL" },
    { name: "Zeynep A.", date: "3 hafta önce", status: "active", earned: "50 TL" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-energy-blue p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <div className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-float">
              <Gift className="h-10 w-10 md:h-14 md:w-14 text-white" />
            </div>
          </div>
          
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Referans Programı</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Arkadaşını Getir,<br />
              <span className="text-white/90">Enerjini Bedavaya Getir!</span>
            </h1>
            <p className="text-white/80 text-lg mb-6">
              Her başarılı davet için <span className="font-bold text-white">50 TL</span> kazanın. 
              Arkadaşlarınız da ilk faturaları için <span className="font-bold text-white">25 TL indirim</span> kazansın!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Davet</p>
                <p className="text-3xl font-bold text-foreground">{referralCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-energy-green/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-energy-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Kazanç</p>
                <p className="text-3xl font-bold text-foreground">{earned} <span className="text-lg">TL</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-energy-orange/10 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-energy-orange" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sıralama</p>
                <p className="text-3xl font-bold text-foreground">#42</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invite Code Section */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Davet Kodunuz</h2>
            
            <div className="bg-secondary/50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between gap-4">
                <code className="text-2xl md:text-3xl font-bold text-foreground tracking-widest">
                  {inviteCode}
                </code>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                  {copied ? "Kopyalandı" : "Kopyala"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground mb-3">Paylaş</p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="secondary"
                  className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/20"
                  onClick={() => handleShare("whatsapp")}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  variant="secondary"
                  className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border-[#1DA1F2]/20"
                  onClick={() => handleShare("twitter")}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter
                </Button>
                <Button
                  variant="secondary"
                  className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/20"
                  onClick={() => handleShare("facebook")}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </div>

          {/* Progress & Rewards */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Ödül Seviyeleri</h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Hedefe ilerleme</span>
                <span className="font-semibold text-foreground">
                  <span className="text-primary">{earned} TL</span> / {goal} TL
                </span>
              </div>
              <Progress value={progress} variant="glow" className="h-3" />
            </div>

            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    reward.unlocked 
                      ? "bg-primary/10 border border-primary/20" 
                      : "bg-secondary/50 border border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      reward.unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {reward.unlocked ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{reward.friends}</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${reward.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                        {reward.friends} Arkadaş
                      </p>
                      <p className={`text-sm ${reward.unlocked ? "text-primary" : "text-muted-foreground"}`}>
                        {reward.reward}
                      </p>
                    </div>
                  </div>
                  {reward.unlocked && (
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Kazanıldı</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Son Davetler</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              Tümünü Gör
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {referrals.map((referral, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-energy-blue flex items-center justify-center text-white font-bold">
                    {referral.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{referral.earned}</p>
                  <p className="text-xs text-energy-green">Aktif</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referans;
