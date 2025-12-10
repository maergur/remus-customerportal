import { Sun, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import solarHero from "@/assets/solar-hero.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl h-48 md:h-56">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${solarHero})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient opacity-85" />
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sun className="h-32 w-32 text-foreground animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-8">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-foreground mb-3">
            <Sun className="h-4 w-4" />
            <span>Güneş Enerjisi Sistemleri</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Kışa Hazır Olun!
          </h2>
          <p className="text-foreground/90 text-sm md:text-base mb-4">
            Faturanızı Sabitleyin.
          </p>
          <Button variant="hero" size="lg" className="group">
            Fırsatı İncele
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
