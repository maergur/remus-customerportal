import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, TrendingUp, Percent, Zap, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tariffs = [
  {
    id: 'sabit',
    name: 'Yıllık Sabit Fiyat',
    description: 'Fiyat dalgalanmalarından etkilenmek istemeyenler için',
    price: '2,80',
    unit: 'TL/kWh',
    icon: Lock,
    popular: true,
  },
  {
    id: 'degisken-standart',
    name: 'Değişken Standart',
    description: 'Piyasa koşullarına göre aylık değişen tarife',
    price: 'PTF+YEKDEM',
    unit: '×1.035 marj',
    icon: TrendingUp,
    popular: false,
  },
  {
    id: 'degisken-on-odeme',
    name: 'Değişken Ön Ödeme',
    description: 'Peşin ödemede en avantajlı fiyat',
    price: 'PTF+YEKDEM',
    unit: '×1.005-1.02',
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
    color: 'primary',
  },
  {
    tariff: 'Değişken Standart',
    icon: TrendingUp,
    baseBill: '1.000 TL',
    actualBill: '850 - 1.150 TL',
    note: 'Piyasaya göre ±%15 değişir',
    color: 'blue',
  },
  {
    tariff: 'Değişken Ön Ödeme',
    icon: Percent,
    baseBill: '1.000 TL',
    actualBill: '820 - 1.100 TL',
    note: 'Peşin ödemede en düşük marj',
    color: 'green',
  },
];

export const TariffSelectionStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const handleSelectTariff = (tariffId: string) => {
    updateData({ selectedTariff: tariffId });
  };

  const handleContinue = () => {
    if (!data.selectedTariff) {
      toast.error('Lütfen bir tarife seçiniz');
      return;
    }
    nextStep();
  };

  

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Tarife Seçimi</h2>
        <p className="text-muted-foreground mt-2">
          Size en uygun enerji tarifesini seçin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tariffs.map((tariff) => {
          const Icon = tariff.icon;
          const isSelected = data.selectedTariff === tariff.id;

          return (
            <Card
              key={tariff.id}
              className={cn(
                'relative cursor-pointer transition-all hover:shadow-lg',
                isSelected && 'ring-2 ring-primary',
                tariff.popular && 'border-primary'
              )}
              onClick={() => handleSelectTariff(tariff.id)}
            >
              {tariff.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    Popüler
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={cn(
                  'mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{tariff.name}</CardTitle>
                <CardDescription className="text-xs">{tariff.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div>
                  {tariff.id === 'sabit' ? (
                    <div>
                      <span className="text-2xl font-bold">{tariff.price}</span>
                      <span className="text-muted-foreground text-sm ml-1">{tariff.unit}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between px-2">
                      <span className="text-2xl font-bold">{tariff.unit}</span>
                      <span className="text-xs text-muted-foreground/50">{tariff.price}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statik Karşılaştırma Kutusu - 1000 TL Baz Fatura */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Fatura Karşılaştırması</CardTitle>
              <CardDescription>1.000 TL baz fatura üzerinden örnek hesaplama</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {comparisonScenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <div
                  key={index}
                  className="bg-background rounded-lg p-4 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-semibold">{scenario.tariff}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Tahmini Fatura</p>
                  <p className="text-xl font-bold text-foreground">{scenario.actualBill}</p>
                  <p className="text-xs text-muted-foreground mt-2">{scenario.note}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 max-w-md mx-auto">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Geri
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Devam Et
        </Button>
      </div>
    </div>
  );
};
