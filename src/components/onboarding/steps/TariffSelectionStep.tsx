import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Lock, TrendingUp, Percent, Calculator, Zap, ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState, useMemo, useEffect } from 'react';

const tariffs = [
  {
    id: 'sabit',
    name: 'Yıllık Sabit Fiyat',
    description: 'Fiyat dalgalanmalarından etkilenmek istemeyenler için',
    pricePerKwh: 2.80,
    displayPrice: '2,80',
    unit: 'TL/kWh',
    icon: Lock,
    popular: true,
    ptfType: 'sabit' as const,
  },
  {
    id: 'degisken-standart',
    name: 'Değişken Standart',
    description: 'Piyasa koşullarına göre aylık değişen tarife',
    pricePerKwh: 2.65,
    displayPrice: 'PTF+YEKDEM',
    unit: '×1.04 marj',
    icon: TrendingUp,
    popular: false,
    varianceMin: 0.85,
    varianceMax: 1.15,
    ptfType: 'degisken' as const,
  },
  {
    id: 'degisken-on-odeme',
    name: 'Değişken Ön Ödeme',
    description: 'Peşin ödemede en avantajlı fiyat',
    pricePerKwh: 2.55,
    displayPrice: 'PTF+YEKDEM',
    unit: '×0.99 marj',
    icon: Percent,
    popular: false,
    varianceMin: 0.82,
    varianceMax: 1.10,
    ptfType: 'degisken' as const,
  },
];

const calculateScenarios = (monthlyKwh: number) => {
  const sabitTariff = tariffs.find(t => t.id === 'sabit')!;
  const degiskenStandart = tariffs.find(t => t.id === 'degisken-standart')!;
  const degiskenOnOdeme = tariffs.find(t => t.id === 'degisken-on-odeme')!;

  const sabitBill = monthlyKwh * sabitTariff.pricePerKwh;
  const standartMin = monthlyKwh * degiskenStandart.pricePerKwh * degiskenStandart.varianceMin!;
  const standartMax = monthlyKwh * degiskenStandart.pricePerKwh * degiskenStandart.varianceMax!;
  const onOdemeMin = monthlyKwh * degiskenOnOdeme.pricePerKwh * degiskenOnOdeme.varianceMin!;
  const onOdemeMax = monthlyKwh * degiskenOnOdeme.pricePerKwh * degiskenOnOdeme.varianceMax!;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'decimal', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value) + ' TL';
  };

  return [
    {
      tariff: 'Yıllık Sabit Fiyat',
      icon: Lock,
      actualBill: formatCurrency(sabitBill),
      note: 'Fiyat sabit, değişmez',
    },
    {
      tariff: 'Değişken Standart',
      icon: TrendingUp,
      actualBill: `${formatCurrency(standartMin)} - ${formatCurrency(standartMax)}`,
      note: 'Piyasaya göre ±%15 değişir',
    },
    {
      tariff: 'Değişken Ön Ödeme',
      icon: Percent,
      actualBill: `${formatCurrency(onOdemeMin)} - ${formatCurrency(onOdemeMax)}`,
      note: 'Peşin ödemede en düşük marj',
    },
  ];
};

export const TariffSelectionStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [monthlyKwh, setMonthlyKwh] = useState<number>(357);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Tarife seçildiğinde hesaplayıcıyı otomatik aç
  useEffect(() => {
    if (data.selectedTariff) {
      setIsCalculatorOpen(true);
    }
  }, [data.selectedTariff]);

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

  const comparisonScenarios = useMemo(() => {
    return calculateScenarios(monthlyKwh);
  }, [monthlyKwh]);

  const handleKwhChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setMonthlyKwh(Math.max(0, Math.min(10000, numValue)));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Tarife Seçimi</h2>
        <p className="text-muted-foreground mt-2">
          Size en uygun enerji tarifesini seçin
        </p>
      </div>

      {/* Tarife Değişikliği Bilgilendirmesi - Moved to top */}
      <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>
        <p className="text-sm text-orange-800 dark:text-orange-200">
          <span className="font-medium">1 ay önce bildirmek kaydıyla</span> müşteri portalı üzerinden istediğiniz zaman tarife değişikliği yapabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {tariffs.map((tariff) => {
          const Icon = tariff.icon;
          const isSelected = data.selectedTariff === tariff.id;

          return (
            <Card
              key={tariff.id}
              className={cn(
                'relative cursor-pointer transition-all hover:shadow-lg',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => handleSelectTariff(tariff.id)}
            >
              {/* PTF Type Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
                {tariff.ptfType === 'degisken' ? (
                  <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent text-xs">
                    Değişken PTF
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground border-secondary text-xs whitespace-nowrap">
                    Sabit PTF
                  </Badge>
                )}
                {tariff.popular && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Popüler
                  </Badge>
                )}
              </div>
              <CardHeader className="text-center pb-2 pt-6">
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
                      <span className="text-2xl font-bold">{tariff.displayPrice}</span>
                      <span className="text-muted-foreground text-sm ml-1">{tariff.unit}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between px-2">
                      <span className="text-2xl font-bold">{tariff.unit}</span>
                      <span className="text-xs text-muted-foreground/50">{tariff.displayPrice}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Collapsible Fatura Hesaplayıcı */}
      <Collapsible open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Fatura Hesaplayıcı</CardTitle>
                    <CardDescription>Tüketiminize göre tarifeleri karşılaştırın</CardDescription>
                  </div>
                </div>
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-300",
                    isCalculatorOpen && "rotate-180"
                  )} 
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <CardContent className="pt-0">
              {/* kWh Input */}
              <div className="flex items-center justify-center gap-2 bg-background rounded-lg p-3 border border-border mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <Label htmlFor="kwh-input" className="text-sm font-medium whitespace-nowrap">
                  Aylık Tüketim:
                </Label>
                <Input
                  id="kwh-input"
                  type="number"
                  value={monthlyKwh}
                  onChange={(e) => handleKwhChange(e.target.value)}
                  className="w-24 h-8 text-center font-semibold"
                  min={0}
                  max={10000}
                />
                <span className="text-sm text-muted-foreground font-medium">kWh</span>
              </div>

              {/* Karşılaştırma Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {comparisonScenarios.map((scenario, index) => {
                  const Icon = scenario.icon;
                  return (
                    <div
                      key={index}
                      className="bg-background rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-semibold">{scenario.tariff}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Tahmini Aylık Fatura</p>
                      <p className="text-xl font-bold text-foreground">{scenario.actualBill}</p>
                      <p className="text-xs text-muted-foreground mt-2">{scenario.note}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                * Hesaplamalar örnek fiyatlandırma üzerinden yapılmıştır. Gerçek faturanız piyasa koşullarına göre değişebilir.
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

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
