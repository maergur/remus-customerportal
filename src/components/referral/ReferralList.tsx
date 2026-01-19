import { Check, Clock, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Referral } from "@/lib/referralData";
import { Button } from "@/components/ui/button";

interface ReferralListProps {
  referrals: Referral[];
  maxItems?: number;
  onViewAll?: () => void;
}

const statusConfig = {
  active: {
    label: "Aktif",
    icon: Check,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  pending: {
    label: "Bekliyor",
    icon: Clock,
    color: "text-amber-500 bg-amber-500/10",
  },
  churned: {
    label: "İptal",
    icon: XCircle,
    color: "text-red-500 bg-red-500/10",
  },
};

export function ReferralList({ referrals, maxItems, onViewAll }: ReferralListProps) {
  const displayedReferrals = maxItems ? referrals.slice(0, maxItems) : referrals;
  const hasMore = maxItems && referrals.length > maxItems;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  if (referrals.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground mb-1">Henüz davetli yok</p>
        <p className="text-sm text-muted-foreground">
          Arkadaşlarını davet et ve kazanmaya başla!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Davetlerin</h3>
      </div>
      <div className="divide-y divide-border flex-1 overflow-auto">
        {displayedReferrals.map((referral) => {
          const status = statusConfig[referral.status];
          const StatusIcon = status.icon;
          
          return (
            <div
              key={referral.id}
              className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold">
                  {referral.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{referral.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(referral.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium", status.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </div>
                <p className={cn(
                  "font-semibold text-sm",
                  referral.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                )}>
                  {referral.status === "active" ? `+${referral.earnedAmount}₺` : "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {hasMore && onViewAll && (
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full gap-2" onClick={onViewAll}>
            Tümünü Gör ({referrals.length})
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
