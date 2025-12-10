import { Snowflake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import winterCampaign from "@/assets/winter-campaign.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl h-48 md:h-56">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${winterCampaign})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-energy-navy/90 via-energy-navy/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-white mb-3">
            <Snowflake className="h-4 w-4" />
            <span>Kış Kampanyası</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            %20 Kış İndirimi!
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-4">
            Doğalgaz faturanızı sabit tutun, kışı rahat geçirin.
          </p>
          <Button variant="hero" size="lg" className="group">
            Kampanyaya Katıl
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
