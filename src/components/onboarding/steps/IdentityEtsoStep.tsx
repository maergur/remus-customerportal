import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, HelpCircle, FileText, MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { ContactWidget } from '@/components/onboarding/ContactWidget';

export const IdentityEtsoStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [addressFound, setAddressFound] = useState(!!data.addressFromEtso);

  const validateTCKimlik = (tcNo: string): boolean => {
    if (tcNo.length !== 11) return false;
    if (tcNo[0] === '0') return false;
    
    const digits = tcNo.split('').map(Number);
    const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
    const check10 = ((sumOdd * 7) - sumEven) % 10;
    const check11 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;
    
    return check10 === digits[9] && check11 === digits[10];
  };

  const handleEtsoLookup = () => {
    if (!data.etsoCode.trim() || data.etsoCode.length < 10) {
      toast.error('Geçersiz ETSO kodu');
      return;
    }
    
    // Mock address lookup
    const mockAddress = 'Atatürk Mah. Cumhuriyet Cad. No:123 Daire:4 Kadıköy/İstanbul';
    updateData({ addressFromEtso: mockAddress, addressConfirmed: false });
    setAddressFound(true);
    toast.success('Adres bulundu');
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

    if (!data.etsoCode.trim() || data.etsoCode.length < 10) {
      toast.error('Lütfen geçerli ETSO kodunu giriniz');
      return;
    }

    if (!addressFound || !data.addressFromEtso) {
      toast.error('Lütfen ETSO kodunu sorgulayınız');
      return;
    }

    if (!data.addressConfirmed) {
      toast.error('Lütfen adresi onaylayınız');
      return;
    }
    
    nextStep();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Kimlik ve Adres Bilgileri</CardTitle>
        <CardDescription>
          TC Kimlik numaranızı ve ETSO kodunuzu giriniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* TC Kimlik */}
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
        </div>

        {/* ETSO */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="etsoCode">ETSO Kodu</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Nerede bulunur?
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>ETSO Kodu Nerede?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-6 h-6 text-primary mt-1" />
                      <p className="text-sm">
                        ETSO kodu, elektrik faturanızın üst kısmında "Sayaç No" veya 
                        "Tesisat No" bölümünde yer alır.
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/50 font-mono text-sm">
                    <p>Abone No: 1234567890</p>
                    <p className="text-primary font-bold">ETSO Kodu: 40123456789012345678</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-2">
            <Input
              id="etsoCode"
              placeholder="Örn: 40123456789012345678"
              value={data.etsoCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                updateData({ etsoCode: value, addressFromEtso: '', addressConfirmed: false });
                setAddressFound(false);
              }}
              maxLength={20}
            />
            <Button variant="outline" onClick={handleEtsoLookup}>
              Sorgula
            </Button>
          </div>
        </div>

        {/* Address Confirmation */}
        {addressFound && data.addressFromEtso && (
          <div className="bg-muted rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Tespit Edilen Adres</p>
                <p className="text-sm mt-1">{data.addressFromEtso}</p>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.addressConfirmed}
                    onChange={(e) => updateData({ addressConfirmed: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Bu adres doğrudur, onaylıyorum</span>
                  {data.addressConfirmed && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Geri
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            Devam Et
          </Button>
        </div>

        <ContactWidget title="ETSO kodunuzu bulamıyor musunuz?" compact />
      </CardContent>
    </Card>
  );
};
