import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ArrowRight, Lock, TrendingUp, Percent, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const tariffs = [
  {
    id: "sabit",
    name: "Yıllık Sabit Fiyat",
    price: "2,80",
    unit: "TL/kWh",
    description: "Fiyat dalgalanmalarından etkilenmek istemeyenler için",
    icon: Lock,
    popular: true,
  },
  {
    id: "degisken-standart",
    name: "Değişken Standart",
    price: "PTF+YEKDEM",
    unit: "×1.035 marj",
    description: "Piyasa koşullarına göre aylık değişen tarife",
    icon: TrendingUp,
    popular: false,
  },
  {
    id: "degisken-on-odeme",
    name: "Değişken Ön Ödeme",
    price: "PTF+YEKDEM",
    unit: "×1.005-1.02",
    description: "Peşin ödemede en avantajlı fiyat",
    icon: Percent,
    popular: false,
  },
];

// 1000 TL baz fatura karşılaştırması
const comparisonScenarios = [
  {
    tariff: "Yıllık Sabit Fiyat",
    icon: Lock,
    baseBill: "1.000 TL",
    actualBill: "1.000 TL",
    note: "Fiyat sabit, değişmez",
  },
  {
    tariff: "Değişken Standart",
    icon: TrendingUp,
    baseBill: "1.000 TL",
    actualBill: "850 - 1.150 TL",
    note: "Piyasaya göre ±%15 değişir",
  },
  {
    tariff: "Değişken Ön Ödeme",
    icon: Percent,
    baseBill: "1.000 TL",
    actualBill: "820 - 1.100 TL",
    note: "Peşin ödemede en düşük marj",
  },
];

const Tarifeler = () => {
  const handleSelectTariff = (name: string) => {
    toast.success(`${name} tarifesi için başvurunuz alındı.`);
  };

  return (
    <DashboardLayout>
      {/*
        Goal: avoid page scroll by fitting content to the viewport area under TopBar.
        TopBar is h-16 (4rem). DashboardLayout content wrapper uses p-4 (2rem total vertical) and p-6 on lg (3rem total).
      */}
      <div className="animate-page-enter flex flex-col gap-6 min-h-[calc(100vh-4rem-2rem)] max-h-[calc(100vh-4rem-2rem)] lg:min-h-[calc(100vh-4rem-3rem)] lg:max-h-[calc(100vh-4rem-3rem)] overflow-hidden">
        {/* Header (same typography style as other pages) */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tarifeler</h1>
            <p className="text-muted-foreground mt-1">Size en uygun enerji tarifesini seçin</p>
          </div>

          {/* Current Tariff - compact so it doesn't force scroll */}
          <div className="bg-primary/5 rounded-2xl px-4 py-3 border border-primary/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Mevcut Tarifeniz</p>
                <p className="text-sm font-bold text-foreground truncate">Yıllık Sabit Fiyat • ₺2,80/kWh</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content: cards + comparison side by side on desktop to use full screen without scroll */}
        <section className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Tariff Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {tariffs.map((tariff) => {
              const Icon = tariff.icon;
              const isCurrent = tariff.id === "sabit";

              return (
                <div
                  key={tariff.id}
                  className={`relative bg-card rounded-2xl p-6 border ${
                    tariff.popular ? "border-primary shadow-glow" : "border-border"
                  } flex flex-col`}
                >
                  {tariff.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                        Popüler
                      </span>
                    </div>
                  )}

                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">{tariff.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tariff.description}</p>

                  <div className="mb-5 flex-1">
                    {tariff.id === "sabit" ? (
                      <div>
                        <span className="text-3xl font-bold text-foreground">{tariff.price}</span>
                        <span className="text-muted-foreground text-sm ml-1">{tariff.unit}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-bold text-foreground">{tariff.unit}</span>
                        <p className="text-xs text-muted-foreground/60 mt-1">{tariff.price}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant={tariff.popular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectTariff(tariff.name)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Mevcut Tarife" : "Seç"}
                    {!isCurrent && <ArrowRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Comparison */}
          <Card className="lg:col-span-2 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent flex flex-col min-h-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Fatura Karşılaştırması</CardTitle>
                  <CardDescription>1.000 TL baz fatura üzerinden örnek hesaplama</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 flex flex-col">
              <div className="grid grid-cols-1 gap-4">
                {comparisonScenarios.map((scenario, index) => {
                  const Icon = scenario.icon;
                  return (
                    <div
                      key={index}
                      className="bg-background rounded-xl p-4 border border-border/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{scenario.tariff}</p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">{scenario.note}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">Tahmini</p>
                          <p className="text-lg font-bold text-foreground leading-tight">{scenario.actualBill}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer note moved into the right panel to save vertical space */}
              <div className="mt-auto pt-4">
                <div className="bg-secondary/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Tarife değişikliği bir sonraki fatura döneminden itibaren geçerli olacaktır.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Tarifeler;
