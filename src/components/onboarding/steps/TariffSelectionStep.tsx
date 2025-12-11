import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Leaf, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const tariffs = [
  {
    id: 'ekonomik',
    name: 'Ekonomik Tarife',
    description: 'Temel enerji ihtiyaçları için uygun fiyatlı plan',
    price: '0,89',
    unit: 'TL/kWh',
    features: ['7/24 Destek', 'Online Fatura', 'Mobil Uygulama'],
    icon: Zap,
    popular: false,
  },
  {
    id: 'yesil',
    name: 'Yeşil Enerji',
    description: '%100 yenilenebilir enerji kaynakları',
    price: '0,99',
    unit: 'TL/kWh',
    features: ['7/24 Destek', 'Online Fatura', 'Mobil Uygulama', 'Karbon Ayak İzi Raporu'],
    icon: Leaf,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Tarife',
    description: 'Ekstra avantajlar ve öncelikli destek',
    price: '1,09',
    unit: 'TL/kWh',
    features: ['Öncelikli Destek', 'Online Fatura', 'Mobil Uygulama', 'Enerji Analizi', 'Taksitli Ödeme'],
    icon: Star,
    popular: false,
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
                <div className="mb-4">
                  <span className="text-3xl font-bold">{tariff.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{tariff.unit}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {tariff.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
