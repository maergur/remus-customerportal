import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import irecBanner from "@/assets/irec-banner.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl h-full min-h-[200px]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${irecBanner})` }}
      />

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
        <div className="max-w-sm">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-3 py-1 text-xs font-semibold text-emerald-200 mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>I-REC Uluslararası Yeşil Enerji Sertifikası</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-2">
            Enerjinizi Sertifikalandırın,<br />
            <span className="text-emerald-300">Farkınızı Kanıtlayın</span>
          </h2>

          <p className="text-white/75 text-sm md:text-base max-w-sm">
            I-REC sertifikası ile tüketiminizin yenilenebilir kaynaklardan karşılandığını uluslararası geçerlilikte belgeleyin.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            variant="hero"
            size="lg"
            className="group bg-orange-500 hover:bg-orange-400 text-white border-none shadow-lg shadow-orange-900/40"
          >
            Sertifikaya Başvur
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
