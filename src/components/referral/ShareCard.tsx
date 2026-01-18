import { useState } from "react";
import { Copy, Check, Share2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareCardProps {
  inviteCode: string;
  referralLink: string;
  copied: boolean;
  onCopy: (text: string, type: "code" | "link") => void;
  onShare: (platform: string, code: string) => void;
  onNativeShare: (code: string) => void;
}

const socialPlatforms = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/20",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: Send,
    color: "bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border-[#0088cc]/20",
  },
  {
    id: "twitter",
    name: "X",
    icon: () => (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: "bg-foreground/5 hover:bg-foreground/10 text-foreground border-border",
  },
];

export function ShareCard({
  inviteCode,
  referralLink,
  copied,
  onCopy,
  onShare,
  onNativeShare,
}: ShareCardProps) {
  const [activeTab, setActiveTab] = useState<"code" | "link">("code");

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("code")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "code"
              ? "bg-primary/5 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Davet Kodu
        </button>
        <button
          onClick={() => setActiveTab("link")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "link"
              ? "bg-primary/5 text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Referans Linki
        </button>
      </div>

      <div className="p-5">
        {activeTab === "code" ? (
          /* Invite Code */
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Davet Kodun</p>
                <code className="text-2xl md:text-3xl font-bold text-foreground tracking-[0.15em] font-mono">
                  {inviteCode}
                </code>
              </div>
              <Button
                variant={copied ? "default" : "outline"}
                size="lg"
                onClick={() => onCopy(inviteCode, "code")}
                className="shrink-0 gap-2 h-12"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? "Kopyalandı!" : "Kopyala"}
              </Button>
            </div>
          </div>
        ) : (
          /* Referral Link */
          <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Referans Linkin</p>
                <code className="text-sm md:text-base font-medium text-foreground truncate block">
                  {referralLink}
                </code>
              </div>
              <Button
                variant={copied ? "default" : "outline"}
                size="lg"
                onClick={() => onCopy(`https://${referralLink}`, "link")}
                className="shrink-0 gap-2 h-12"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? "Kopyalandı!" : "Kopyala"}
              </Button>
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="mt-5">
          <p className="text-sm font-medium text-muted-foreground mb-3">Hızlı Paylaş</p>
          <div className="grid grid-cols-4 gap-2">
            {socialPlatforms.map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                className={cn("flex-col h-auto py-3 gap-1.5", platform.color)}
                onClick={() => onShare(platform.id, inviteCode)}
              >
                <platform.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{platform.name}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              className="flex-col h-auto py-3 gap-1.5 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
              onClick={() => onNativeShare(inviteCode)}
            >
              <Share2 className="h-5 w-5" />
              <span className="text-[10px] font-medium">Diğer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
