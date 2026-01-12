import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ArrowRight, Lock, TrendingUp, Percent, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const tariffs = [
  {
    id: 'sabit',
    name: 'Yıllık Sabit Fiyat',
    price: '2,80',
    unit: 'TL/kWh',
    description: 'Fiyat dalgalanmalarından etkilenmek istemeyenler için',
    icon: Lock,
    popular: true,
  },
  {
    id: 'degisken-standart',
    name: 'Değişken Standart',
    price: 'PTF+YEKDEM',
    unit: '×1.035 marj',
    description: 'Piyasa koşullarına göre aylık değişen tarife',
    icon: TrendingUp,
    popular: false,
  },
  {
    id: 'degisken-on-odeme',
    name: 'Değişken Ön Ödeme',
    price: 'PTF+YEKDEM',
    unit: '×1.005-1.02',
    description: 'Peşin ödemede en avantajlı fiyat',
    icon: Percent,
    popular: false,
  },
];

// 1000 TL baz fatura karşılaştırması
const comparisonScenarios = [
  {
    tariff: 'Yıllık Sabit Fiyat',
    icon: Lock,
    baseBill: '1.000 TL',
    actualBill: '1.000 TL',
    note: 'Fiyat sabit, değişmez',
  },
  {
    tariff: 'Değişken Standart',
    icon: TrendingUp,
    baseBill: '1.000 TL',
    actualBill: '850 - 1.150 TL',
    note: 'Piyasaya göre ±%15 değişir',
  },
  {
    tariff: 'Değişken Ön Ödeme',
    icon: Percent,
    baseBill: '1.000 TL',
    actualBill: '820 - 1.100 TL',
    note: 'Peşin ödemede en düşük marj',
  },
];

const Tarifeler = () => {
  const handleSelectTariff = (name: string) => {
    toast.success(`${name} tarifesi için başvurunuz alındı.`);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-4">
        {/* Header - Compact */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Tarifeler</h1>
            <p className="text-sm text-muted-foreground">Size en uygun enerji tarifesini seçin</p>
          </div>
          {/* Current Tariff Badge */}
          <div className="hidden sm:flex items-center gap-3 bg-primary/5 rounded-xl px-4 py-2 border border-primary/20">
            <Lock className="h-5 w-5 text-primary" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Mevcut Tarife</p>
              <p className="text-sm font-bold text-foreground">Yıllık Sabit • ₺2,80/kWh</p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
          {/* Left: Tariff Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tariffs.map((tariff) => {
              const Icon = tariff.icon;
              const isCurrent = tariff.id === 'sabit';
              
              return (
                <div 
                  key={tariff.id} 
                  className={`relative bg-card rounded-xl p-4 border ${tariff.popular ? 'border-primary shadow-glow' : 'border-border'} flex flex-col`}
                >
                  {tariff.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                        Popüler
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">{tariff.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{tariff.description}</p>
                    </div>
                  </div>

                  <div className="mb-3 flex-1">
                    {tariff.id === 'sabit' ? (
                      <div>
                        <span className="text-xl font-bold text-foreground">{tariff.price}</span>
                        <span className="text-muted-foreground text-xs ml-1">{tariff.unit}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-lg font-bold text-foreground">{tariff.unit}</span>
                        <p className="text-[10px] text-muted-foreground/60">{tariff.price}</p>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant={tariff.popular ? "default" : "outline"} 
                    size="sm"
                    className="w-full"
                    onClick={() => handleSelectTariff(tariff.name)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Mevcut" : "Seç"}
                    {!isCurrent && <ArrowRight className="h-3.5 w-3.5 ml-1" />}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Right: Comparison Card */}
          <Card className="lg:col-span-2 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden flex flex-col">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">Fatura Karşılaştırması</CardTitle>
                  <CardDescription className="text-xs">1.000 TL baz fatura örneği</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-4 pb-4 pt-2">
              <div className="grid grid-cols-1 gap-2 h-full">
                {comparisonScenarios.map((scenario, index) => {
                  const Icon = scenario.icon;
                  return (
                    <div
                      key={index}
                      className="bg-background rounded-lg p-3 border border-border/50 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{scenario.tariff}</p>
                        <p className="text-[10px] text-muted-foreground">{scenario.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">{scenario.actualBill}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info - Compact */}
        <div className="bg-secondary/50 rounded-xl px-4 py-2.5 text-center">
          <p className="text-muted-foreground text-xs">
            Tarife değişikliği bir sonraki fatura döneminden itibaren geçerli olacaktır.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tarifeler;
