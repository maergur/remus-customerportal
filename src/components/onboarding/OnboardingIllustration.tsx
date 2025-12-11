import { cn } from '@/lib/utils';
import solarHero from '@/assets/solar-hero.jpg';

interface OnboardingIllustrationProps {
  step: number;
  className?: string;
}

const stepConfig: Record<number, {
  title: string;
  subtitle: string;
}> = {
  1: { title: 'Temiz Enerjiye', subtitle: 'Adım Atın' },
  2: { title: 'Güvenli', subtitle: 'Doğrulama' },
  3: { title: 'Size Özel', subtitle: 'Tarifeler' },
  4: { title: 'Hızlı', subtitle: 'Kimlik Doğrulama' },
  5: { title: 'Kurumsal', subtitle: 'Çözümler' },
  6: { title: 'Kolay', subtitle: 'Belge Yükleme' },
  7: { title: 'Son Adım', subtitle: 'Sözleşme' },
  8: { title: 'Tebrikler!', subtitle: 'Başvurunuz Alındı' },
  99: { title: 'Sanayi', subtitle: 'Çözümleri' }
};

export const OnboardingIllustration = ({ step, className }: OnboardingIllustrationProps) => {
  const config = stepConfig[step] || stepConfig[1];

  return (
    <div 
      className={cn(
        'relative h-full w-full overflow-hidden rounded-3xl',
        className
      )}
    >
      {/* Background image */}
      <img
        src={solarHero}
        alt="Solar energy background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      {/* Content at bottom left */}
      <div className="absolute bottom-8 left-8 right-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          {config.title}
          <br />
          <span className="text-primary-foreground/90">{config.subtitle}</span>
        </h2>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-6 right-6 h-2 w-2 rounded-full bg-white/50" />
      <div className="absolute top-6 right-12 h-2 w-2 rounded-full bg-white/30" />
      <div className="absolute top-6 right-18 h-2 w-2 rounded-full bg-white/20" />
    </div>
  );
};
