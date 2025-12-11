import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, HelpCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const EtsoCodeStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const handleContinue = () => {
    if (!data.etsoCode.trim()) {
      toast.error('Lütfen ETSO kodunuzu giriniz');
      return;
    }
    
    if (data.etsoCode.length < 10) {
      toast.error('Geçersiz ETSO kodu');
      return;
    }
    
    // Mock address lookup
    const mockAddress = 'Atatürk Mah. Cumhuriyet Cad. No:123 Daire:4 Kadıköy/İstanbul';
    updateData({ addressFromEtso: mockAddress });
    nextStep();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">ETSO Kodu</CardTitle>
        <CardDescription>
          Elektrik faturanızda bulunan ETSO kodunu giriniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="etsoCode">ETSO Kodu</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  ETSO kodu nerede?
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>ETSO Kodu Nerede Bulunur?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Elektrik Faturanızda</p>
                        <p className="text-sm text-muted-foreground">
                          ETSO kodu, elektrik faturanızın üst kısmında "Sayaç No" veya 
                          "Tesisat No" bölümünde yer almaktadır.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-card">
                    <p className="text-sm font-medium mb-2">Örnek Fatura Görünümü:</p>
                    <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                      <p>Abone No: 1234567890</p>
                      <p className="text-primary font-bold">ETSO Kodu: 40123456789012345678</p>
                      <p>Sayaç No: 98765432</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    ETSO kodu genellikle 16-20 haneli bir sayıdır ve her tesisat için benzersizdir.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Input
            id="etsoCode"
            placeholder="Örn: 40123456789012345678"
            value={data.etsoCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              updateData({ etsoCode: value });
            }}
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground">
            16-20 haneli ETSO kodunuzu giriniz
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Geri
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            Devam Et
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
