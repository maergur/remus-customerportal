import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const AddressConfirmStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const handleConfirm = () => {
    updateData({ addressConfirmed: true });
    toast.success('Adres onaylandı');
    nextStep();
  };

  const handleReject = () => {
    toast.info('Lütfen ETSO kodunuzu kontrol ediniz');
    prevStep();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Adres Onayı</CardTitle>
        <CardDescription>
          ETSO kodunuzdan bulunan adres bilgisi aşağıdadır
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Tespit Edilen Adres</p>
              <p className="text-foreground mt-1">
                {data.addressFromEtso || 'Adres bulunamadı'}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Bu adres doğru mu? Yanlışsa geri dönüp ETSO kodunuzu kontrol edebilirsiniz.
        </p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReject} className="flex-1">
            Hayır, Düzelt
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Evet, Onaylıyorum
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
