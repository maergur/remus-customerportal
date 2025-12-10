import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import smartEnergyHero from "@/assets/smart-energy-hero.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl h-full min-h-[220px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${smartEnergyHero})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/95 via-[#0a0a1a]/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-start p-6 md:p-8">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white mb-3">
            <Zap className="h-4 w-4" />
            <span>Akıllı Enerji Yönetimi</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Enerji Tüketiminizi Kontrol Edin!
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4">
            Gerçek zamanlı analitik ve akıllı önerilerle faturalarınızı %30'a kadar düşürün.
          </p>
          <Button variant="hero" size="lg" className="group bg-primary hover:bg-primary/90 text-white border-none">
            Detayları Keşfet
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}