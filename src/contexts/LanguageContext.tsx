import { createContext, useContext, useState, ReactNode } from "react";

type Language = "tr" | "en";

interface Translations {
  [key: string]: {
    tr: string;
    en: string;
  };
}

const translations: Translations = {
  // Dashboard
  quickActions: { tr: "Hızlı İşlemler", en: "Quick Actions" },
  
  // Invoice Widget
  lastInvoice: { tr: "Son Fatura", en: "Latest Invoice" },
  daysLeft: { tr: "gün kaldı", en: "days left" },
  paid: { tr: "Ödendi", en: "Paid" },
  overdue: { tr: "Gecikmiş", en: "Overdue" },
  amountDue: { tr: "Ödenecek Tutar", en: "Amount Due" },
  dueDate: { tr: "Son Ödeme", en: "Due Date" },
  consumption: { tr: "Tüketim", en: "Consumption" },
  payNow: { tr: "Şimdi Öde", en: "Pay Now" },
  details: { tr: "Detay", en: "Details" },
  
  // Pay Now Panel
  paymentAmount: { tr: "Ödeme Tutarı", en: "Payment Amount" },
  selectPaymentMethod: { tr: "Ödeme Yöntemi Seçin", en: "Select Payment Method" },
  creditCard: { tr: "Kredi Kartı", en: "Credit Card" },
  bankTransfer: { tr: "Havale/EFT", en: "Bank Transfer" },
  autoPayment: { tr: "Otomatik Ödeme", en: "Auto Payment" },
  cardNumber: { tr: "Kart Numarası", en: "Card Number" },
  expiryDate: { tr: "Son Kullanma", en: "Expiry Date" },
  cvv: { tr: "CVV", en: "CVV" },
  cardHolder: { tr: "Kart Sahibi", en: "Card Holder" },
  confirmPayment: { tr: "Ödemeyi Onayla", en: "Confirm Payment" },
  securePayment: { tr: "Güvenli Ödeme", en: "Secure Payment" },
  
  // Hero Section
  digiturk: { tr: "Remus x Digiturk", en: "Remus x Digiturk" },
  digiturk2MonthsFree: { tr: "İlk 2 Ay Digiturk Bedava!", en: "First 2 Months Digiturk Free!" },
  digiturkDesc: { tr: "Remus Enerji müşterilerine özel, Digiturk'e ücretsiz erişim fırsatı.", en: "Exclusive free Digiturk access for Remus Energy customers." },
  applyNow: { tr: "Hemen Başvur", en: "Apply Now" },
  
  // Referral Widget
  referFriends: { tr: "Arkadaşını Davet Et", en: "Refer Friends" },
  referralDesc: { tr: "Arkadaşlarını davet et, birlikte kazanın!", en: "Invite friends, earn together!" },
  yourCode: { tr: "Davet Kodunuz", en: "Your Code" },
  copied: { tr: "Kopyalandı!", en: "Copied!" },
  yourRank: { tr: "Sıralaman", en: "Your Rank" },
  shareNow: { tr: "Şimdi Paylaş", en: "Share Now" },
  
  // Quick Actions
  viewInvoices: { tr: "Faturalarım", en: "My Invoices" },
  viewInvoicesDesc: { tr: "Geçmiş ve güncel faturalar", en: "Past and current invoices" },
  consumptionAnalysis: { tr: "Tüketim Analizi", en: "Consumption Analysis" },
  consumptionAnalysisDesc: { tr: "Detaylı enerji raporları", en: "Detailed energy reports" },
  tariffs: { tr: "Tarifeler", en: "Tariffs" },
  tariffsDesc: { tr: "Size uygun tarifeler", en: "Tariffs for you" },
  support: { tr: "Destek", en: "Support" },
  supportDesc: { tr: "Yardım ve iletişim", en: "Help and contact" },
  
  // Sidebar
  dashboard: { tr: "Ana Sayfa", en: "Dashboard" },
  invoices: { tr: "Faturalar", en: "Invoices" },
  reference: { tr: "Referans", en: "Reference" },
  issueSupport: { tr: "Arıza & Destek", en: "Issue & Support" },
  
  // TopBar
  notifications: { tr: "Bildirimler", en: "Notifications" },
  profile: { tr: "Profil", en: "Profile" },
  
  // Theme
  lightMode: { tr: "Açık Mod", en: "Light Mode" },
  darkMode: { tr: "Koyu Mod", en: "Dark Mode" },
  
  // Onboarding Status Widget
  continueApplication: { tr: "Başvuruya Devam Et", en: "Continue Application" },
  completeYourApplication: { tr: "Başvurunuzu Tamamlayın", en: "Complete Your Application" },
  applicationProgress: { tr: "İlerleme", en: "Progress" },
  stepsCompleted: { tr: "adım tamamlandı", en: "steps completed" },
  progress: { tr: "İlerleme", en: "Progress" },
  underReview: { tr: "İnceleniyor", en: "Under Review" },
  applicationUnderReview: { tr: "Başvurunuz İnceleniyor", en: "Application Under Review" },
  applicationUnderReviewDesc: { tr: "Başvurunuz ekibimiz tarafından incelenmektedir. En kısa sürede size dönüş yapacağız.", en: "Your application is being reviewed by our team. We will get back to you soon." },
  estimatedReviewTime: { tr: "Tahmini süre", en: "Estimated time" },
  businessDays: { tr: "iş günü", en: "business days" },
  applicationRejected: { tr: "Başvuru Reddedildi", en: "Application Rejected" },
  applicationNeedsCorrection: { tr: "Başvurunuz Düzeltme Gerektiriyor", en: "Your Application Needs Correction" },
  reason: { tr: "Sebep", en: "Reason" },
  correctAndResubmit: { tr: "Düzelt ve Tekrar Gönder", en: "Correct and Resubmit" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr");

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
