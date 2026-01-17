import { 
  Zap, 
  Receipt, 
  FileText, 
  Settings, 
  HelpCircle, 
  AlertTriangle,
  Gauge,
  XCircle
} from "lucide-react";

export interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  helpContent: {
    title: string;
    content: string[];
    contactInfo?: {
      type: 'distribution' | 'remus' | 'both';
      note?: string;
    };
  };
  subCategories?: { id: string; label: string }[];
}

export const supportCategories: SupportCategory[] = [
  {
    id: "elektrik-kesintisi",
    title: "Elektrik Kesintisi",
    description: "Bölgesel veya bireysel elektrik kesintileri",
    icon: Zap,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    helpContent: {
      title: "Elektrik kesintisi mi yaşıyorsunuz?",
      content: [
        "Öncelikle şalterinizi kontrol edin. Sigorta atmış olabilir.",
        "Komşularınızı kontrol edin - bölgesel bir kesinti olabilir.",
        "Planlı kesintiler için dağıtım şirketinin web sitesini kontrol edin.",
        "Bireysel kesintilerde 186 Arıza Hattı'nı arayabilirsiniz."
      ],
      contactInfo: {
        type: 'distribution',
        note: 'Elektrik kesintileri dağıtım şirketi sorumluluğundadır.'
      }
    },
    subCategories: [
      { id: "bolgesel", label: "Bölgesel Kesinti" },
      { id: "bireysel", label: "Sadece Bende Var" },
      { id: "planli", label: "Planlı Kesinti Bilgisi" }
    ]
  },
  {
    id: "fatura-odeme",
    title: "Fatura & Ödeme",
    description: "Fatura sorgulama, ödeme ve itiraz işlemleri",
    icon: Receipt,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    helpContent: {
      title: "Fatura veya ödeme konusunda yardım mı lazım?",
      content: [
        "Faturalarınızı 'Faturalar' menüsünden görüntüleyebilirsiniz.",
        "Online ödeme, havale/EFT veya otomatik ödeme talimatı verebilirsiniz.",
        "Fatura itirazı için 'Destek Kaydı Oluştur' butonunu kullanın.",
        "Ödeme planı için müşteri hizmetlerimizle iletişime geçin."
      ],
      contactInfo: {
        type: 'remus',
        note: 'Fatura ve ödeme işlemleri için Remus Enerji müşteri hizmetleri size yardımcı olacaktır.'
      }
    },
    subCategories: [
      { id: "fatura-sorgulama", label: "Fatura Sorgulama" },
      { id: "fatura-itiraz", label: "Fatura İtirazı" },
      { id: "odeme-sorunu", label: "Ödeme Sorunu" },
      { id: "odeme-plani", label: "Ödeme Planı Talebi" }
    ]
  },
  {
    id: "sayac",
    title: "Sayaç İşlemleri",
    description: "Sayaç arızası, okuma ve değişiklik talepleri",
    icon: Gauge,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    helpContent: {
      title: "Sayaç ile ilgili bir sorun mu var?",
      content: [
        "Sayaç arızası için 186 numaralı hattı arayabilirsiniz.",
        "Sayaç değişikliği talepleri dağıtım şirketi tarafından değerlendirilir.",
        "Endeks okuma hatası düşünüyorsanız fatura itirazı oluşturabilirsiniz.",
        "Akıllı sayaç kurulumu için dağıtım şirketinizle iletişime geçin."
      ],
      contactInfo: {
        type: 'distribution',
        note: 'Sayaç işlemleri dağıtım şirketi sorumluluğundadır.'
      }
    },
    subCategories: [
      { id: "sayac-ariza", label: "Sayaç Arızası" },
      { id: "sayac-okuma", label: "Endeks Okuma Hatası" },
      { id: "sayac-degisim", label: "Sayaç Değişikliği" }
    ]
  },
  {
    id: "sozlesme",
    title: "Sözleşme İşlemleri",
    description: "Tarife değişikliği, devir ve iptal işlemleri",
    icon: FileText,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    helpContent: {
      title: "Sözleşme işlemi mi yapacaksınız?",
      content: [
        "Tarife değişikliği için 'Tarifeler' menüsünden yeni tarife seçebilirsiniz.",
        "Abonelik devri için her iki tarafın kimlik belgesi gereklidir.",
        "İptal işlemleri için en az 15 gün önceden bildirim yapılmalıdır.",
        "Adres değişikliği için müşteri hizmetlerimizi arayın."
      ],
      contactInfo: {
        type: 'remus',
        note: 'Sözleşme işlemleri için Remus Enerji müşteri hizmetleri size yardımcı olacaktır.'
      }
    },
    subCategories: [
      { id: "tarife-degisiklik", label: "Tarife Değişikliği" },
      { id: "abonelik-devir", label: "Abonelik Devri" },
      { id: "iptal", label: "İptal İşlemleri" },
      { id: "adres-degisiklik", label: "Adres Değişikliği" }
    ]
  },
  {
    id: "teknik",
    title: "Teknik Destek",
    description: "Voltaj, kablo ve teknik arızalar",
    icon: Settings,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    helpContent: {
      title: "Teknik bir sorun mu yaşıyorsunuz?",
      content: [
        "Voltaj düşüklüğü veya dalgalanma için 186'yı arayın.",
        "Kablo hasarı gördüğünüzde kesinlikle dokunmayın ve 186'yı arayın.",
        "İç tesisat sorunları için yetkili elektrikçi çağırmanız gerekir.",
        "Trafo arızaları dağıtım şirketi tarafından giderilir."
      ],
      contactInfo: {
        type: 'distribution',
        note: 'Teknik arızalar dağıtım şirketi sorumluluğundadır.'
      }
    },
    subCategories: [
      { id: "voltaj", label: "Voltaj Sorunu" },
      { id: "kablo", label: "Kablo Hasarı" },
      { id: "trafo", label: "Trafo Arızası" }
    ]
  },
  {
    id: "sikayet",
    title: "Şikayet",
    description: "Hizmet kalitesi ve genel şikayetler",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    helpContent: {
      title: "Bir şikayetiniz mi var?",
      content: [
        "Şikayetinizi aşağıdaki form ile bize iletebilirsiniz.",
        "Tüm şikayetler 48 saat içinde değerlendirilir.",
        "EPDK'ya başvuru hakkınız saklıdır.",
        "Şikayetinizin takibi için size bir referans numarası verilecektir."
      ],
      contactInfo: {
        type: 'both'
      }
    },
    subCategories: [
      { id: "hizmet-kalitesi", label: "Hizmet Kalitesi" },
      { id: "cagri-merkezi", label: "Çağrı Merkezi" },
      { id: "diger", label: "Diğer" }
    ]
  }
];

interface SupportCategoriesProps {
  onSelectCategory: (category: SupportCategory) => void;
}

export const SupportCategoriesGrid = ({ onSelectCategory }: SupportCategoriesProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {supportCategories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="group bg-card hover:bg-secondary/50 rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-200 text-left"
          >
            <div className={`h-14 w-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`h-7 w-7 ${category.iconColor}`} />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
          </button>
        );
      })}
    </div>
  );
};
