import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Lightbulb, TrendingDown, Zap, ThermometerSun, Plug, Leaf, Clock, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const tips = [
  {
    icon: Plug,
    title: { tr: "Bekleme Modundan Kaçının", en: "Avoid Standby Mode" },
    description: { tr: "Cihazlarınızı bekleme modunda bırakmayın. Yılda ortalama 50₺ tasarruf edebilirsiniz.", en: "Don't leave devices on standby. Save approximately 50₺ per year." },
    savings: "50₺/yıl",
    category: { tr: "Elektrik", en: "Electricity" },
  },
  {
    icon: Lightbulb,
    title: { tr: "LED Ampul Kullanın", en: "Use LED Bulbs" },
    description: { tr: "Geleneksel ampullerden LED'e geçiş yaparak aydınlatma giderlerinizde %80'e varan tasarruf sağlayın.", en: "Switch from traditional bulbs to LED and save up to 80% on lighting costs." },
    savings: "%80",
    category: { tr: "Aydınlatma", en: "Lighting" },
  },
  {
    icon: ThermometerSun,
    title: { tr: "Termostat Ayarları", en: "Thermostat Settings" },
    description: { tr: "Kış aylarında termostatınızı 1°C düşürerek ısıtma giderlerinizde %10 tasarruf edin.", en: "Lower your thermostat by 1°C in winter to save 10% on heating costs." },
    savings: "%10",
    category: { tr: "Isıtma", en: "Heating" },
  },
  {
    icon: Clock,
    title: { tr: "Gece Tarifesinden Yararlanın", en: "Use Night Tariff" },
    description: { tr: "Çamaşır ve bulaşık makinenizi gece saatlerinde çalıştırarak düşük tarifeden faydalanın.", en: "Run washing machines and dishwashers at night to benefit from lower rates." },
    savings: "%25",
    category: { tr: "Zamanlama", en: "Timing" },
  },
  {
    icon: Zap,
    title: { tr: "Enerji Verimli Cihazlar", en: "Energy Efficient Appliances" },
    description: { tr: "A+++ enerji sınıfı cihazlar, eski cihazlara göre %50'ye kadar daha az enerji tüketir.", en: "A+++ energy class appliances consume up to 50% less energy than older devices." },
    savings: "%50",
    category: { tr: "Cihazlar", en: "Appliances" },
  },
  {
    icon: Leaf,
    title: { tr: "Doğal Aydınlatma", en: "Natural Lighting" },
    description: { tr: "Gün içinde perdelerinizi açık tutarak doğal ışıktan maksimum faydalanın.", en: "Keep curtains open during the day to maximize natural light." },
    savings: "%15",
    category: { tr: "Aydınlatma", en: "Lighting" },
  },
];

const insights = [
  {
    title: { tr: "Bu Ay Tüketiminiz Arttı", en: "Your Consumption Increased This Month" },
    description: { tr: "Geçen aya göre %9 daha fazla enerji tükettiniz. Isıtma cihazlarınızı kontrol edin.", en: "You consumed 9% more energy compared to last month. Check your heating devices." },
    type: "warning",
  },
  {
    title: { tr: "En Yüksek Tüketim Saati", en: "Peak Consumption Hour" },
    description: { tr: "En yüksek tüketiminiz 19:00-21:00 arasında. Bu saatlerde dikkatli olun.", en: "Your peak consumption is between 7-9 PM. Be mindful during these hours." },
    type: "info",
  },
  {
    title: { tr: "Tasarruf Fırsatı", en: "Savings Opportunity" },
    description: { tr: "Gece tarifesine geçerek aylık 45₺ tasarruf edebilirsiniz.", en: "Switch to night tariff to save 45₺ monthly." },
    type: "success",
  },
];

const Ipuclari = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === "tr" ? "İpuçları & İçgörüler" : "Tips & Insights"}
          </h1>
          <p className="text-muted-foreground">
            {language === "tr" 
              ? "Enerji tüketiminizi optimize etmek için kişiselleştirilmiş öneriler" 
              : "Personalized recommendations to optimize your energy consumption"}
          </p>
        </div>

        {/* Personal Insights */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {language === "tr" ? "Kişisel İçgörüler" : "Personal Insights"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`rounded-2xl p-4 border ${
                  insight.type === 'warning' 
                    ? 'bg-amber-500/10 border-amber-500/20' 
                    : insight.type === 'success'
                    ? 'bg-primary/10 border-primary/20'
                    : 'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <h3 className="font-semibold text-foreground text-sm mb-2">
                  {insight.title[language]}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {insight.description[language]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Savings Tips */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            {language === "tr" ? "Tasarruf İpuçları" : "Savings Tips"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div 
                  key={index} 
                  className="bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                      <TrendingDown className="h-3 w-3 text-primary" />
                      <span className="text-xs font-semibold text-primary">{tip.savings}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {tip.category[language]}
                  </span>
                  <h3 className="font-semibold text-foreground text-sm mt-1 mb-2">
                    {tip.title[language]}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip.description[language]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-2xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {language === "tr" ? "Daha Fazla Tasarruf İster misiniz?" : "Want More Savings?"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "tr" 
                  ? "Yeşil Enerji Pro tarifesine geçerek aylık %15 daha fazla tasarruf edin." 
                  : "Switch to Green Energy Pro tariff and save 15% more monthly."}
              </p>
            </div>
            <Button className="gap-2">
              {language === "tr" ? "Tarifeleri İncele" : "View Tariffs"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Ipuclari;