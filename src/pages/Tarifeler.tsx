import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Zap, Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tariffs = [
  {
    id: 1,
    name: "Ev Ekonomi",
    price: "0,89",
    unit: "kWh",
    description: "Küçük haneler için ideal",
    features: ["Tek zamanlı tarife", "Aylık sabit ücret yok", "Online fatura"],
    popular: false,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Ev Konfor",
    price: "0,79",
    unit: "kWh",
    description: "Orta tüketimli haneler için",
    features: ["Çok zamanlı tarife", "Gece tarifesi %40 indirimli", "7/24 destek", "Ücretsiz sayaç"],
    popular: true,
    color: "bg-primary",
  },
  {
    id: 3,
    name: "Yeşil Enerji",
    price: "0,95",
    unit: "kWh",
    description: "%100 yenilenebilir enerji",
    features: ["Rüzgar + Güneş enerjisi", "Karbon nötr sertifika", "Çevre dostu", "Premium destek"],
    popular: false,
    color: "bg-emerald-500",
  },
  {
    id: 4,
    name: "İşyeri Plus",
    price: "0,72",
    unit: "kWh",
    description: "KOBİ'ler için özel tarife",
    features: ["Yüksek tüketim indirimi", "Esnek ödeme", "Özel müşteri temsilcisi", "Enerji danışmanlığı"],
    popular: false,
    color: "bg-purple-500",
  },
];

const Tarifeler = () => {
  const handleSelectTariff = (name: string) => {
    toast.success(`${name} tarifesi için başvurunuz alındı. Size en kısa sürede dönüş yapılacaktır.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Tarifeler</h1>
          <p className="text-muted-foreground mt-2">
            İhtiyacınıza en uygun tarifeyi seçin ve tasarruf etmeye başlayın
          </p>
        </div>

        {/* Current Tariff */}
        <div className="bg-primary/5 rounded-2xl p-4 lg:p-6 border border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mevcut Tarifeniz</p>
                <p className="text-lg font-bold text-foreground">Ev Konfor</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Birim Fiyat</p>
              <p className="text-lg font-bold text-primary">₺0,79 / kWh</p>
            </div>
          </div>
        </div>

        {/* Tariff Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {tariffs.map((tariff) => (
            <div 
              key={tariff.id} 
              className={`relative bg-card rounded-2xl p-5 lg:p-6 border ${tariff.popular ? 'border-primary shadow-glow' : 'border-border'} flex flex-col`}
            >
              {tariff.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    <Star className="h-3 w-3" /> Popüler
                  </span>
                </div>
              )}
              
              <div className={`h-12 w-12 rounded-xl ${tariff.color}/10 flex items-center justify-center mb-4`}>
                <Zap className={`h-6 w-6`} style={{ color: tariff.color === 'bg-primary' ? 'hsl(142, 71%, 45%)' : undefined }} />
              </div>

              <h3 className="text-lg font-bold text-foreground">{tariff.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tariff.description}</p>

              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">₺{tariff.price}</span>
                <span className="text-muted-foreground"> / {tariff.unit}</span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {tariff.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={tariff.popular ? "default" : "outline"} 
                className="w-full"
                onClick={() => handleSelectTariff(tariff.name)}
              >
                {tariff.name === "Ev Konfor" ? "Mevcut Tarife" : "Tarifeyi Seç"}
                {tariff.name !== "Ev Konfor" && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-secondary/50 rounded-2xl p-4 lg:p-6 text-center">
          <p className="text-muted-foreground text-sm lg:text-base">
            Tarife değişikliği için müşteri hizmetlerimizi arayabilir veya online başvuru yapabilirsiniz. 
            Değişiklik bir sonraki fatura döneminden itibaren geçerli olacaktır.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tarifeler;
