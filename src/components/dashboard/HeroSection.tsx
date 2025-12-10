import { Tv, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import digiturk from "@/assets/digiturk-campaign.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl h-full min-h-[220px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${digiturk})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-start p-6 md:p-8">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 bg-[#ff6b00]/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white mb-3">
            <Tv className="h-4 w-4" />
            <span>Remus x Digiturk</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            İlk 2 Ay Digiturk Bedava!
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4">
            Remus Enerji müşterilerine özel, Digiturk'e ücretsiz erişim fırsatı.
          </p>
          <Button variant="hero" size="lg" className="group bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white border-none">
            Hemen Başvur
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}