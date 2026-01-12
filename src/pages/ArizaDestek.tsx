import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, Phone, MessageSquare, Clock, CheckCircle, Building2, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useOnboarding } from "@/contexts/OnboardingContext";

// Dağıtım firmalarının iletişim bilgileri
const distributionCompanies: Record<string, {
  name: string;
  phone: string;
  faultLine: string;
  address: string;
  website: string;
  region: string;
}> = {
  "BEDAS": {
    name: "Boğaziçi Elektrik Dağıtım A.Ş.",
    phone: "0212 324 24 24",
    faultLine: "186",
    address: "Abdurrahmangazi Mah. Güleryüz Sok. No:4 Sancaktepe/İstanbul",
    website: "https://www.bedas.com.tr",
    region: "İstanbul Avrupa Yakası",
  },
  "AYEDAS": {
    name: "İstanbul Anadolu Yakası Elektrik Dağıtım A.Ş.",
    phone: "0216 522 01 86",
    faultLine: "186",
    address: "Barbaros Mah. Şebboy Sok. No:4 Ataşehir/İstanbul",
    website: "https://www.ayedas.com.tr",
    region: "İstanbul Anadolu Yakası",
  },
  "KCETAS": {
    name: "Kayseri ve Civarı Elektrik T.A.Ş.",
    phone: "0352 222 41 86",
    faultLine: "186",
    address: "Kocasinan Bulvarı No:159 Kocasinan/Kayseri",
    website: "https://www.kcetas.com.tr",
    region: "Kayseri ve Çevresi",
  },
  "SEDAS": {
    name: "Sakarya Elektrik Dağıtım A.Ş.",
    phone: "0264 888 01 86",
    faultLine: "186",
    address: "Esentepe Mah. Akyol Cad. No:76 Serdivan/Sakarya",
    website: "https://www.sedas.com",
    region: "Sakarya Bölgesi",
  },
  "UEDAS": {
    name: "Uludağ Elektrik Dağıtım A.Ş.",
    phone: "0224 270 01 86",
    faultLine: "186",
    address: "Odunluk Mah. Akademi Cad. No:2 Nilüfer/Bursa",
    website: "https://www.uedas.com.tr",
    region: "Bursa ve Çevresi",
  },
  "TEDAS": {
    name: "Türkiye Elektrik Dağıtım A.Ş.",
    phone: "444 0 186",
    faultLine: "186",
    address: "İnönü Bulvarı No:27 Bahçelievler/Ankara",
    website: "https://www.tedas.gov.tr",
    region: "Çeşitli Bölgeler",
  },
  "DICLE_EDAS": {
    name: "Dicle Elektrik Dağıtım A.Ş.",
    phone: "0412 251 01 86",
    faultLine: "186",
    address: "Şanlıurfa Yolu 3. Km Bağlar/Diyarbakır",
    website: "https://www.dedas.com.tr",
    region: "Güneydoğu Anadolu",
  },
  "TOROSLAR_EDAS": {
    name: "Toroslar Elektrik Dağıtım A.Ş.",
    phone: "0324 237 01 86",
    faultLine: "186",
    address: "Güvenevler Mah. 1913 Sok. No:5 Yenişehir/Mersin",
    website: "https://www.toroslarelektrik.com.tr",
    region: "Akdeniz Bölgesi",
  },
};

// Varsayılan dağıtım firması (eğer müşteri bilgisi yoksa)
const defaultCompany = distributionCompanies["BEDAS"];

const recentTickets = [
  { id: "ARZ-2026-045", type: "Elektrik Kesintisi", status: "resolved", date: "15 Ara 2026", description: "Bölgede planlı bakım çalışması" },
  { id: "ARZ-2026-032", type: "Sayaç Arızası", status: "resolved", date: "28 Kas 2026", description: "Sayaç değişimi yapıldı" },
  { id: "ARZ-2026-018", type: "Voltaj Düşüklüğü", status: "resolved", date: "10 Kas 2026", description: "Trafo bakımı tamamlandı" },
];

const ArizaDestek = () => {
  const [description, setDescription] = useState("");
  const { data } = useOnboarding();
  
  // Müşterinin kayıtlı dağıtım firmasını al (şimdilik varsayılan kullanılıyor)
  // İleride OnboardingContext'e distributionCompany alanı eklenebilir
  const customerCompany = defaultCompany;

  const handleSubmit = () => {
    if (!description) {
      toast.error("Lütfen arıza açıklaması girin");
      return;
    }
    toast.success("Arıza bildiriminiz alındı. En kısa sürede size dönüş yapılacaktır.");
    setDescription("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arıza & Destek</h1>
          <p className="text-muted-foreground">Arıza bildirin veya destek talebi oluşturun</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acil Arıza Hattı</p>
                <p className="text-lg font-bold text-foreground">{customerCompany.faultLine}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">7/24 hizmetinizdeyiz</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Müşteri Hizmetleri</p>
                <p className="text-lg font-bold text-foreground">{customerCompany.phone}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{customerCompany.name}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dağıtım Firması</p>
                <p className="text-base font-bold text-foreground leading-tight">{customerCompany.region}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{customerCompany.address}</p>
            <a 
              href={customerCompany.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
            >
              Web sitesini ziyaret et <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Ticket Form */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Yeni Arıza Bildirimi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Arıza Türü</label>
                <select className="w-full h-11 rounded-xl border border-border bg-secondary/50 px-4 text-foreground">
                  <option>Elektrik Kesintisi</option>
                  <option>Sayaç Arızası</option>
                  <option>Voltaj Problemi</option>
                  <option>Kablo Hasarı</option>
                  <option>Diğer</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Açıklama</label>
                <textarea 
                  className="w-full h-24 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground resize-none"
                  placeholder="Arıza hakkında detaylı bilgi verin..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button variant="default" className="w-full" onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Bildirim Gönder
              </Button>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Son Başvurularınız
            </h3>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{ticket.type}</p>
                      <p className="text-xs text-muted-foreground">{ticket.id}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <CheckCircle className="h-3 w-3" /> Çözüldü
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{ticket.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArizaDestek;
