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

// Senaryo verileri - her tarife için farklı senaryolar
const scenarios = {
  sabit: {
    title: 'Sabit Fiyat Senaryosu',
    subtitle: 'Piyasa dalgalansa da faturanız aynı kalır',
    scenarios: [
      { label: 'Düşük Tüketim', usage: '500 kWh', bill: '1.400 TL', note: 'Küçük işletme / ev' },
      { label: 'Orta Tüketim', usage: '1.000 kWh', bill: '2.800 TL', note: 'Orta ölçekli işletme' },
      { label: 'Yüksek Tüketim', usage: '2.500 kWh', bill: '7.000 TL', note: 'Büyük işletme' },
    ],
    highlight: 'Fiyat garantisi ile bütçenizi önceden planlayın',
    color: 'primary',
  },
  'degisken-standart': {
    title: 'Değişken Standart Senaryosu',
    subtitle: 'Piyasa koşullarına göre faturanız değişir',
    scenarios: [
      { label: 'Düşük Tüketim', usage: '500 kWh', bill: '1.225 - 1.450 TL', note: 'Piyasa bağımlı' },
      { label: 'Orta Tüketim', usage: '1.000 kWh', bill: '2.450 - 2.900 TL', note: 'Piyasa bağımlı' },
      { label: 'Yüksek Tüketim', usage: '2.500 kWh', bill: '6.125 - 7.250 TL', note: 'Piyasa bağımlı' },
    ],
    highlight: 'Piyasa düşükken %15\'e kadar tasarruf potansiyeli',
    color: 'blue',
  },
  'degisken-on-odeme': {
    title: 'Ön Ödeme Senaryosu',
    subtitle: 'Peşin ödeme ile en düşük marj avantajı',
    scenarios: [
      { label: 'Düşük Tüketim', usage: '500 kWh', bill: '1.190 - 1.360 TL', note: 'En avantajlı' },
      { label: 'Orta Tüketim', usage: '1.000 kWh', bill: '2.380 - 2.720 TL', note: 'En avantajlı' },
      { label: 'Yüksek Tüketim', usage: '2.500 kWh', bill: '5.950 - 6.800 TL', note: 'En avantajlı' },
    ],
    highlight: 'Peşin ödeme ile %3-5 ek tasarruf',
    color: 'green',
  },
};

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

  const selectedScenario = data.selectedTariff ? scenarios[data.selectedTariff as keyof typeof scenarios] : null;

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

      {/* Senaryo Kutusu - Tarife Seçildiğinde Görünür */}
      {selectedScenario ? (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{selectedScenario.title}</CardTitle>
                <CardDescription>{selectedScenario.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedScenario.scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-4 border border-border/50"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-1">{scenario.label}</p>
                  <div className="flex items-baseline gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{scenario.usage}</span>
                  </div>
                  <p className="text-xl font-bold mt-2">{scenario.bill}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenario.note}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm font-medium text-primary">{selectedScenario.highlight}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center">
          <Calculator className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Örnek fatura senaryolarını görmek için bir tarife seçin
          </p>
        </div>
      )}

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
