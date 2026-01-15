import { ReactNode } from 'react';
import remusLogo from '@/assets/remus-logo.svg';

interface StatCard {
  label: string;
  value: string;
}

interface BottomStat {
  value: string;
  label: string;
}

interface AuthLayoutProps {
  children: ReactNode;
  heroImage: string;
  heroImageAlt: string;
  badge: string;
  badgeIcon: ReactNode;
  title: string;
  subtitle: string;
  topStats: StatCard[];
  bottomStats: BottomStat[];
}

const AuthLayout = ({
  children,
  heroImage,
  heroImageAlt,
  badge,
  badgeIcon,
  title,
  subtitle,
  topStats,
  bottomStats,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Sol Panel - Form */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center lg:justify-start">
              <img src={remusLogo} alt="Remus Enerji" className="h-10" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-muted-foreground">
          <p>© 2024 Remus Enerji. Tüm hakları saklıdır.</p>
        </footer>
      </div>

      {/* Sağ Panel - Görsel (mobilde gizli) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img 
          src={heroImage} 
          alt={heroImageAlt} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* İstatistik Kartları */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          {topStats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <p className="text-white/70 text-sm">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/80 flex items-center justify-center">
              {badgeIcon}
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1 border border-white/20">
              <span className="text-sm text-white/90">{badge}</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-white/80 mb-6">
            {subtitle}
          </p>
          <div className="flex items-center gap-6">
            {bottomStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-6">
                {index > 0 && <div className="w-px h-12 bg-white/20" />}
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-primary">{stat.value}</span>
                  <span className="text-sm text-white/70">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
