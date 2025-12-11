import { useOnboarding, ApplicationStatus } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ApplicationStatusStep = () => {
  const { data, updateData, resetOnboarding, goToStep } = useOnboarding();
  const [status, setStatus] = useState<ApplicationStatus>(data.applicationStatus);

  // Mock status check - in real app, poll backend
  useEffect(() => {
    // Simulating status check after 5 seconds for demo
    const timer = setTimeout(() => {
      // For demo, randomly set status
      const mockStatuses: ApplicationStatus[] = ['ACCEPTED', 'REJECTED', 'UNDER_REVIEW'];
      const randomStatus = mockStatuses[Math.floor(Math.random() * 3)];
      
      setStatus(randomStatus);
      updateData({ 
        applicationStatus: randomStatus,
        rejectionNote: randomStatus === 'REJECTED' ? 'Kimlik belgesi okunamadı. Lütfen daha net bir fotoğraf yükleyiniz.' : '',
        acceptanceDate: randomStatus === 'ACCEPTED' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR') : ''
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    resetOnboarding();
    goToStep(1);
  };

  const handleGoToDashboard = () => {
    window.location.href = '/';
  };

  if (status === 'UNDER_REVIEW') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl">Başvurunuz İnceleniyor</CardTitle>
          <CardDescription>
            Başvurunuz operatörlerimiz tarafından kontrol edilmektedir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Başvurunuz genellikle 1-2 iş günü içinde sonuçlanır. 
              Size e-posta ve SMS ile bilgi vereceğiz.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Başvuru Özeti</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Ad Soyad: {data.personalInfo.firstName} {data.personalInfo.lastName}</p>
              <p>Tarife: {data.selectedTariff}</p>
              <p>Adres: {data.addressFromEtso}</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleGoToDashboard} className="w-full">
            Ana Sayfaya Dön
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'REJECTED') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Başvurunuz Reddedildi</CardTitle>
          <CardDescription>
            Başvurunuz aşağıdaki nedenle reddedilmiştir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-sm text-destructive">Red Nedeni</p>
                <p className="text-sm mt-1">
                  {data.rejectionNote || 'Belirtilmedi'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Bilgilerinizi düzelterek tekrar başvurabilirsiniz.
          </p>

          <Button onClick={handleRetry} className="w-full">
            Tekrar Başvur
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'ACCEPTED') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Tebrikler!</CardTitle>
          <CardDescription>
            Başvurunuz onaylandı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Aboneliğiniz başlayacak</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {data.acceptanceDate || 'Yakında'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Abonelik Bilgileri</p>
            <div className="text-sm text-muted-foreground space-y-1 text-center">
              <p>Tarife: {data.selectedTariff}</p>
              <p>Adres: {data.addressFromEtso}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Detaylı bilgi için müşteri portalına giriş yapabilirsiniz.
          </p>

          <Button onClick={handleGoToDashboard} className="w-full">
            Müşteri Portalına Git
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
