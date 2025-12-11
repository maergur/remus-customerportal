import { cn } from '@/lib/utils';
import { 
  UserPlus, 
  Smartphone, 
  Zap, 
  FileCheck, 
  Building2, 
  Upload, 
  FileSignature, 
  CheckCircle,
  Factory
} from 'lucide-react';

interface OnboardingIllustrationProps {
  step: number;
  className?: string;
}

const stepConfig: Record<number, {
  icon: typeof UserPlus;
  gradient: string;
  orbColors: string[];
  title: string;
  subtitle: string;
}> = {
  1: {
    icon: UserPlus,
    gradient: 'from-emerald-500/20 via-green-400/10 to-teal-500/20',
    orbColors: ['bg-emerald-400/30', 'bg-green-300/20', 'bg-teal-400/25'],
    title: 'Kişisel Bilgiler',
    subtitle: 'Hesabınızı oluşturun'
  },
  2: {
    icon: Smartphone,
    gradient: 'from-blue-500/20 via-sky-400/10 to-cyan-500/20',
    orbColors: ['bg-blue-400/30', 'bg-sky-300/20', 'bg-cyan-400/25'],
    title: 'Telefon Doğrulama',
    subtitle: 'Numaranızı onaylayın'
  },
  3: {
    icon: Zap,
    gradient: 'from-violet-500/20 via-purple-400/10 to-fuchsia-500/20',
    orbColors: ['bg-violet-400/30', 'bg-purple-300/20', 'bg-fuchsia-400/25'],
    title: 'Tarife Seçimi',
    subtitle: 'Size uygun tarifeyi seçin'
  },
  4: {
    icon: FileCheck,
    gradient: 'from-orange-500/20 via-amber-400/10 to-yellow-500/20',
    orbColors: ['bg-orange-400/30', 'bg-amber-300/20', 'bg-yellow-400/25'],
    title: 'Kimlik & ETSO',
    subtitle: 'Bilgilerinizi doğrulayın'
  },
  5: {
    icon: Building2,
    gradient: 'from-cyan-500/20 via-teal-400/10 to-emerald-500/20',
    orbColors: ['bg-cyan-400/30', 'bg-teal-300/20', 'bg-emerald-400/25'],
    title: 'Kurumsal Bilgiler',
    subtitle: 'Firma detaylarınız'
  },
  6: {
    icon: Upload,
    gradient: 'from-amber-500/20 via-orange-400/10 to-red-500/20',
    orbColors: ['bg-amber-400/30', 'bg-orange-300/20', 'bg-red-400/25'],
    title: 'Belge Yükleme',
    subtitle: 'Gerekli belgeleri yükleyin'
  },
  7: {
    icon: FileSignature,
    gradient: 'from-indigo-500/20 via-blue-400/10 to-violet-500/20',
    orbColors: ['bg-indigo-400/30', 'bg-blue-300/20', 'bg-violet-400/25'],
    title: 'Sözleşme',
    subtitle: 'Sözleşmenizi onaylayın'
  },
  8: {
    icon: CheckCircle,
    gradient: 'from-emerald-500/20 via-green-400/10 to-lime-500/20',
    orbColors: ['bg-emerald-400/30', 'bg-green-300/20', 'bg-lime-400/25'],
    title: 'Başvuru Durumu',
    subtitle: 'Başvurunuz tamamlandı'
  },
  99: {
    icon: Factory,
    gradient: 'from-slate-500/20 via-gray-400/10 to-zinc-500/20',
    orbColors: ['bg-slate-400/30', 'bg-gray-300/20', 'bg-zinc-400/25'],
    title: 'Sanayi Aboneliği',
    subtitle: 'Sizinle iletişime geçeceğiz'
  }
};

export const OnboardingIllustration = ({ step, className }: OnboardingIllustrationProps) => {
  const config = stepConfig[step] || stepConfig[1];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'relative h-full w-full overflow-hidden rounded-3xl',
        `bg-gradient-to-br ${config.gradient}`,
        className
      )}
    >
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className={cn(
        'absolute top-[15%] left-[10%] h-32 w-32 rounded-full blur-3xl animate-pulse-glow',
        config.orbColors[0]
      )} />
      <div className={cn(
        'absolute top-[60%] right-[15%] h-40 w-40 rounded-full blur-3xl animate-pulse-glow',
        config.orbColors[1]
      )} style={{ animationDelay: '1s' }} />
      <div className={cn(
        'absolute bottom-[20%] left-[25%] h-24 w-24 rounded-full blur-2xl animate-pulse-glow',
        config.orbColors[2]
      )} style={{ animationDelay: '2s' }} />

      {/* Geometric shapes */}
      <div className="absolute top-[10%] right-[20%] h-16 w-16 border border-primary/10 rounded-2xl rotate-12 animate-float" />
      <div className="absolute bottom-[30%] left-[15%] h-12 w-12 border border-primary/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[40%] right-[10%] h-8 w-8 bg-primary/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        {/* Large icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse-glow" />
          <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 shadow-xl border border-primary/10">
            <Icon className="h-16 w-16 text-primary animate-float" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title and subtitle */}
        <h3 className="text-xl font-semibold text-foreground/90 mb-2 text-center">
          {config.title}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-[200px]">
          {config.subtitle}
        </p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
    </div>
  );
};
