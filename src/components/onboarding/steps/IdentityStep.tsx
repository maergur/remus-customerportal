import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export const IdentityStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();

  const validateTCKimlik = (tcNo: string): boolean => {
    if (tcNo.length !== 11) return false;
    if (tcNo[0] === '0') return false;
    
    const digits = tcNo.split('').map(Number);
    
    // Algorithm validation
    const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
    const check10 = ((sumOdd * 7) - sumEven) % 10;
    const check11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
    
    return check10 === digits[9] && check11 === digits[10];
  };

  const handleContinue = () => {
    if (!data.tcKimlikNo.trim()) {
      toast.error('Lütfen TC Kimlik numaranızı giriniz');
      return;
    }
    
    if (!validateTCKimlik(data.tcKimlikNo)) {
      toast.error('Geçersiz TC Kimlik numarası');
      return;
    }
    
    nextStep();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Kimlik Bilgileri</CardTitle>
        <CardDescription>
          Abonelik işlemi için TC Kimlik numaranızı giriniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tcKimlik">TC Kimlik Numarası</Label>
          <Input
            id="tcKimlik"
            placeholder="XXXXXXXXXXX"
            maxLength={11}
            value={data.tcKimlikNo}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              updateData({ tcKimlikNo: value });
            }}
          />
          <p className="text-xs text-muted-foreground">
            11 haneli TC Kimlik numaranızı giriniz
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
