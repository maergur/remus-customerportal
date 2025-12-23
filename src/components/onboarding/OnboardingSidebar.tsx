import { useOnboarding } from '@/contexts/OnboardingContext';
import { Zap, Shield, Wallet, FileCheck, Building2, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface StepContent {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  benefits: string[];
}

const stepContents: Record<number, StepContent> = {
  1: {
    icon: Zap,
    title: "Enerjide Yeni Dönem",
    subtitle: "Remus Enerji ile tanışın",
    benefits: [
      "Hesaplı faturalar",
      "Şeffaf fiyatlandırma",
      "7/24 dijital destek",
      "Kolay başvuru süreci"
    ]
  },
  2: {
    icon: Shield,
    title: "Güvenliğiniz Bizim İçin Önemli",
    subtitle: "Hesabınızı doğrulayın",
    benefits: [
      "Kişisel verileriniz korunur",
      "Güvenli doğrulama sistemi",
      "Hızlı onay süreci"
    ]
  },
  3: {
    icon: Wallet,
    title: "Size Özel Tarifeler",
    subtitle: "İhtiyacınıza uygun planı seçin",
    benefits: [
      "Esnek ödeme seçenekleri",
      "Rekabetçi fiyatlar",
      "Gizli maliyet yok"
    ]
  },
  4: {
    icon: FileCheck,
    title: "Son Birkaç Adım",
    subtitle: "Kimlik ve adres bilgilerinizi girin",
    benefits: [
      "Hızlı başvuru süreci",
      "Güvenli veri saklama",
      "Kolay doğrulama"
    ]
  },
  5: {
    icon: Building2,
    title: "İşletmeniz İçin Avantajlar",
    subtitle: "Kurumsal bilgilerinizi girin",
    benefits: [
      "Kurumsal fatura desteği",
      "Vergi avantajları",
      "Özel müşteri temsilcisi"
    ]
  },
  6: {
    icon: Upload,
    title: "Belgelerinizi Yükleyin",
    subtitle: "Başvurunuzu tamamlayın",
    benefits: [
      "Güvenli yükleme",
      "Hızlı doğrulama",
      "Kolay takip"
    ]
  },
  7: {
    icon: FileText,
    title: "Neredeyse Tamamlandı!",
    subtitle: "Sözleşmenizi inceleyin",
    benefits: [
      "Şeffaf sözleşme koşulları",
      "Gizli maliyet yok",
      "İstediğiniz zaman iptal"
    ]
  },
  8: {
    icon: CheckCircle2,
    title: "Başvurunuz Alındı!",
    subtitle: "En kısa sürede size ulaşacağız",
    benefits: [
      "Hızlı değerlendirme",
      "SMS ile bilgilendirme",
      "Kolay aktivasyon"
    ]
  }
};

export const OnboardingSidebar = () => {
  const { data } = useOnboarding();
  const currentStep = data.step;
  const content = stepContents[currentStep] || stepContents[1];
  const Icon = content.icon;

  const totalSteps = 7;
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="hidden lg:flex flex-col h-full bg-gradient-to-br from-primary/5 via-primary/3 to-background border-r border-border/50 p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-5 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Adım {Math.min(currentStep, totalSteps)}/{totalSteps}</span>
          <span className="text-primary font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div key={currentStep} className="flex-1 flex flex-col animate-fade-in">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {content.title}
        </h2>
        <p className="text-muted-foreground mb-8">
          {content.subtitle}
        </p>

        {/* Benefits */}
        <div className="space-y-4">
          {content.benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-foreground/80">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Encouragement message */}
        <div className="mt-auto pt-8">
          <div className="p-4 rounded-xl bg-background/50 border border-border/50">
            <p className="text-sm text-muted-foreground">
              {currentStep <= 2 && "Harika başladınız! Birkaç adım daha..."}
              {currentStep > 2 && currentStep <= 5 && "Harika gidiyorsunuz! Az kaldı..."}
              {currentStep > 5 && currentStep < 8 && "Neredeyse tamamlandı!"}
              {currentStep === 8 && "Başvurunuz başarıyla tamamlandı!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
