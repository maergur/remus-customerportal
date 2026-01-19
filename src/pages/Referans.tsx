import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Gift, Copy, Check, Users, Banknote, ChevronDown, ChevronUp, CheckCircle2, Clock, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import referralHero from "@/assets/referral-hero.jpg";

const Referans = () => {
  const [copied, setCopied] = useState(false);
  const [showReferrals, setShowReferrals] = useState(false);
  const { toast } = useToast();

  // Simple mock data
  const inviteCode = "REMUS2026";
  const referralLink = `https://remus.com.tr/kayit?ref=${inviteCode}`;
  const totalReferrals = 4;
  const totalEarned = 200;
  
  const referrals = [
    { id: 1, name: "Mehmet Y.", status: "completed", earned: 50 },
    { id: 2, name: "Ayşe K.", status: "pending", earned: 0 },
    { id: 3, name: "Ali R.", status: "completed", earned: 50 },
    { id: 4, name: "Fatma S.", status: "completed", earned: 50 },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast({
      title: "Kopyalandı!",
      description: "Davet kodu panoya kopyalandı.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `Remus Enerji'ye geç, ilk faturanda 25 TL indirim kazan! Davet kodum: ${inviteCode}`;
    const encodedMessage = encodeURIComponent(message);
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      sms: `sms:?body=${encodedMessage}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: "Remus Enerji Davet",
      text: `Remus Enerji'ye geç, ilk faturanda 25 TL indirim kazan! Davet kodum: ${inviteCode}`,
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Hero Section - Simple with image */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${referralHero})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">Arkadaşını Getir</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Her arkadaşın için <span className="text-yellow-300">50 TL</span> kazan
            </h1>
            <p className="text-white/80 text-base">
              Arkadaşın da <span className="font-semibold text-white">25 TL</span> indirim kazansın
            </p>
          </div>
        </div>

        {/* Invite Code Card - Main Focus */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Davet Kodunuz</h2>
          
          {/* Code Display */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-secondary rounded-xl px-5 py-4 text-center">
              <span className="text-2xl md:text-3xl font-bold tracking-widest text-foreground">
                {inviteCode}
              </span>
            </div>
            <Button 
              onClick={handleCopy}
              variant="outline"
              size="lg"
              className="h-14 px-5 gap-2"
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {copied ? "Kopyalandı" : "Kopyala"}
            </Button>
          </div>

          {/* Share Buttons - Only 3 options */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => handleShare("whatsapp")}
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white h-12 gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </Button>
            <Button
              onClick={() => handleShare("sms")}
              variant="outline"
              className="h-12 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Mesaj
            </Button>
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="h-12 gap-2"
            >
              <Share2 className="h-5 w-5" />
              Diğer
            </Button>
          </div>
        </div>

        {/* Earnings Summary - Simple 2 metrics */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Kazançlarınız</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-5 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{totalReferrals}</div>
              <div className="text-sm text-muted-foreground">arkadaş davet ettiniz</div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-5 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Banknote className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{totalEarned} ₺</div>
              <div className="text-sm text-muted-foreground">kazandınız</div>
            </div>
          </div>
        </div>

        {/* How it Works - 3 Simple Steps */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Nasıl Çalışır?</h2>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 text-center">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 font-bold">
                1
              </div>
              <p className="text-sm font-medium text-foreground">Kodu paylaş</p>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex-1 text-center">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 font-bold">
                2
              </div>
              <p className="text-sm font-medium text-foreground">Arkadaşın üye olsun</p>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex-1 text-center">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 font-bold">
                3
              </div>
              <p className="text-sm font-medium text-foreground">Kazanın!</p>
            </div>
          </div>
        </div>

        {/* Referrals List - Collapsible */}
        <Collapsible open={showReferrals} onOpenChange={setShowReferrals}>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-5 hover:bg-secondary/50 transition-colors">
                <h2 className="text-lg font-semibold text-foreground">Davet Ettikleriniz</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">{referrals.length} kişi</span>
                  {showReferrals ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="border-t border-border divide-y divide-border">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-medium text-foreground">
                        {referral.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{referral.name}</p>
                        <div className="flex items-center gap-1.5 text-sm">
                          {referral.status === "completed" ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span className="text-emerald-500">Üye oldu</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span className="text-amber-500">Bekliyor</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {referral.earned > 0 ? (
                        <span className="font-bold text-emerald-500">+{referral.earned} ₺</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
};

export default Referans;