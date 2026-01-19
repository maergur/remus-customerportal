import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  route?: string; // Navigate to this route before showing step
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: 'Remus Enerji\'ye Hoş Geldiniz! 👋',
    titleEn: 'Welcome to Remus Energy! 👋',
    content: 'Müşteri portalınızda neler yapabileceğinizi keşfetmek için kısa bir tur yapalım.',
    contentEn: 'Let\'s take a quick tour to discover what you can do in your customer portal.',
    placement: 'bottom',
  },
  {
    id: 'installation-selector',
    target: '[data-tour="installation-selector"]',
    title: 'Tesisat Seçimi',
    titleEn: 'Installation Selection',
    content: 'Birden fazla tesisatınız varsa buradan kolayca geçiş yapabilirsiniz. Seçilen tesisat tüm paneli etkiler.',
    contentEn: 'If you have multiple installations, you can easily switch between them here. The selected installation affects the entire panel.',
    placement: 'bottom',
  },
  {
    id: 'sidebar-nav',
    target: '[data-tour="sidebar-nav"]',
    title: 'Navigasyon Menüsü',
    titleEn: 'Navigation Menu',
    content: 'Sol menüden tüm sayfalara erişebilirsiniz: Dashboard, Tüketim Analizi, Faturalar ve daha fazlası.',
    contentEn: 'You can access all pages from the left menu: Dashboard, Consumption Analysis, Invoices and more.',
    placement: 'right',
  },
  {
    id: 'dashboard-summary',
    target: '[data-tour="dashboard-summary"]',
    title: 'Hızlı Bakış',
    titleEn: 'Quick Overview',
    content: 'Dashboard\'da güncel fatura, tüketim özeti ve kampanyaları tek bakışta görebilirsiniz.',
    contentEn: 'On the dashboard, you can see your current invoice, consumption summary and campaigns at a glance.',
    placement: 'bottom',
    route: '/',
  },
  {
    id: 'invoice-widget',
    target: '[data-tour="invoice-widget"]',
    title: 'Fatura Bilgisi',
    titleEn: 'Invoice Information',
    content: 'Güncel faturanızı görüntüleyin ve tek tıkla ödeme yapın. Geçmiş faturalarınıza da buradan ulaşabilirsiniz.',
    contentEn: 'View your current invoice and pay with a single click. You can also access your past invoices here.',
    placement: 'left',
    route: '/',
  },
  {
    id: 'consumption',
    target: '[data-tour="consumption"]',
    title: 'Tüketim Analizi',
    titleEn: 'Consumption Analysis',
    content: 'Aylık ve günlük tüketiminizi grafiklerle takip edin. Tasarruf fırsatlarını keşfedin.',
    contentEn: 'Track your monthly and daily consumption with charts. Discover saving opportunities.',
    placement: 'bottom',
    route: '/tuketim-analizi',
  },
  {
    id: 'support',
    target: '[data-tour="support"]',
    title: 'Yardım Merkezi',
    titleEn: 'Help Center',
    content: 'Sorularınız mı var? Yardım merkezinden destek talebi oluşturabilir veya SSS\'lere göz atabilirsiniz.',
    contentEn: 'Have questions? You can create a support ticket or browse FAQs from the help center.',
    placement: 'bottom',
    route: '/ariza-destek',
  },
  {
    id: 'referral',
    target: '[data-tour="referral"]',
    title: 'Arkadaşını Getir',
    titleEn: 'Refer a Friend',
    content: 'Arkadaşlarınızı davet edin, her biri için 50 TL kazanın! Onlar da 25 TL indirim kazansın.',
    contentEn: 'Invite your friends, earn 50 TL for each! They also get 25 TL discount.',
    placement: 'bottom',
    route: '/referans',
  },
  {
    id: 'profile',
    target: '[data-tour="profile"]',
    title: 'Profil & Ayarlar',
    titleEn: 'Profile & Settings',
    content: 'Hesap bilgilerinizi, bildirim tercihlerinizi ve güvenlik ayarlarınızı buradan yönetebilirsiniz.',
    contentEn: 'You can manage your account information, notification preferences and security settings here.',
    placement: 'bottom',
    route: '/profil',
  },
  {
    id: 'complete',
    target: 'body',
    title: 'Tur Tamamlandı! 🎉',
    titleEn: 'Tour Complete! 🎉',
    content: 'Artık portalı kullanmaya hazırsınız. İstediğiniz zaman yardım menüsünden turu tekrar başlatabilirsiniz.',
    contentEn: 'You\'re now ready to use the portal. You can restart the tour anytime from the help menu.',
    placement: 'bottom',
  },
];

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  currentStepData: TourStep | null;
  totalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  goToStep: (index: number) => void;
  hasCompletedTour: boolean;
  markTourComplete: () => void;
  resetTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_STORAGE_KEY = 'remus_tour_completed';

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    setHasCompletedTour(completed === 'true');
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setHasCompletedTour(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tour complete
      setIsActive(false);
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      setHasCompletedTour(true);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < tourSteps.length) {
      setCurrentStep(index);
    }
  }, []);

  const markTourComplete = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setHasCompletedTour(true);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setHasCompletedTour(false);
    setCurrentStep(0);
  }, []);

  const currentStepData = isActive ? tourSteps[currentStep] : null;

  return (
    <TourContext.Provider value={{
      isActive,
      currentStep,
      currentStepData,
      totalSteps: tourSteps.length,
      startTour,
      endTour,
      nextStep,
      prevStep,
      skipTour,
      goToStep,
      hasCompletedTour,
      markTourComplete,
      resetTour,
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
