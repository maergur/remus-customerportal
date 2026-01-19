import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Gift } from "lucide-react";
import { useReferral } from "@/hooks/useReferral";

// Components
import { ShareCard } from "@/components/referral/ShareCard";
import { ContestCard } from "@/components/referral/ContestCard";
import { ReferralList } from "@/components/referral/ReferralList";

// Hero image
import referralHero from "@/assets/referral-hero.jpg";

const Referans = () => {
  const {
    copied,
    stats,
    contest,
    referrals,
    handleCopy,
    handleShare,
    handleNativeShare,
  } = useReferral();

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 animate-page-enter min-h-0">
        {/* Top Row: Hero + Share Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Hero Section */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${referralHero})` }}
            />
            {/* Gradient Overlay - Lighter to show more of the image */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/80 via-emerald-700/60 to-transparent" />

            <div className="relative z-10 p-6 h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Gift className="h-5 w-5 text-emerald-100" />
                </div>
                <span className="text-emerald-100/90 text-sm font-medium">
                  Arkadaşını Getir
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Davet Et, <span className="text-yellow-300">Kazan!</span>
              </h1>
              <p className="text-white/90 text-base max-w-md mb-4">
                Her arkadaşın için{" "}
                <span className="font-bold text-yellow-300">50 TL</span>{" "}
                kazan, arkadaşın da{" "}
                <span className="font-bold text-white">25 TL</span> indirim
                kazansın.
              </p>

              {/* Stats */}
              <div className="flex gap-3">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {stats.totalReferrals}
                  </p>
                  <p className="text-xs text-white/70">Davet</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-yellow-300">
                    {stats.totalEarned}₺
                  </p>
                  <p className="text-xs text-white/70">Kazanç</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Card */}
          <div className="lg:col-span-1">
            <ShareCard
              inviteCode={stats.inviteCode}
              referralLink={stats.referralLink}
              copied={copied}
              onCopy={handleCopy}
              onShare={handleShare}
              onNativeShare={handleNativeShare}
            />
          </div>
        </div>

        {/* Bottom Row: Contest + Referral List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          <ContestCard contest={contest} />
          <ReferralList referrals={referrals} maxItems={4} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referans;
