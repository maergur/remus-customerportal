import { Gift, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ReferralWidget() {
  const earned = 200;
  const referralCount = 4;

  return (
    <Link to="/referans">
      <div 
        className="bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer animate-fade-in h-full"
        style={{ animationDelay: "0s" }}
      >
        <div className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-energy-blue flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Arkadaşını Getir</h4>
                <p className="text-xs text-muted-foreground">Kazan & Kazandır</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="p-4 pt-3">
          <p className="text-2xl font-bold text-foreground">{earned} ₺ <span className="text-base font-normal text-primary">Kazanıldı</span></p>
          <p className="text-xs text-muted-foreground mt-1">{referralCount} arkadaş davet edildi</p>
        </div>
      </div>
    </Link>
  );
}
