import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Phone, Mail } from 'lucide-react';

export const IndustrialContactStep = () => {
  const { resetOnboarding } = useOnboarding();

  const handleBack = () => {
    resetOnboarding();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Factory className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Sanayi Aboneliği</CardTitle>
        <CardDescription>
          Sanayi müşterilerimiz için özel hizmet sunuyoruz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-sm">
            Sanayi grubu abonelikler için size özel teklif hazırlamamız gerekmektedir. 
            Lütfen bizimle iletişime geçin, ekibimiz en kısa sürede sizinle iletişime geçecektir.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="tel:08502123456"
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Telefon</p>
              <p className="text-sm text-muted-foreground">0850 212 34 56</p>
            </div>
          </a>

          <a
            href="mailto:sanayi@remusenerji.com"
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">E-posta</p>
              <p className="text-sm text-muted-foreground">sanayi@remusenerji.com</p>
            </div>
          </a>
        </div>

        <Button variant="outline" onClick={handleBack} className="w-full">
          Geri Dön
        </Button>
      </CardContent>
    </Card>
  );
};
