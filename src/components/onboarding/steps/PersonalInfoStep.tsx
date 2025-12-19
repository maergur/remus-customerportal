import { useOnboarding, SubscriberGroup } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, Mail, Building2, Gift } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const PersonalInfoStep = () => {
  const { data, updatePersonalInfo, nextStep, updateData } = useOnboarding();
  const [captchaChecked, setCaptchaChecked] = useState(data.captchaVerified);

  const validateForm = () => {
    const { firstName, lastName, phone, email, subscriberGroup } = data.personalInfo;
    
    if (!firstName.trim()) {
      toast.error('Lütfen adınızı giriniz');
      return false;
    }
    if (!lastName.trim()) {
      toast.error('Lütfen soyadınızı giriniz');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error('Lütfen geçerli bir telefon numarası giriniz');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return false;
    }
    if (!subscriberGroup) {
      toast.error('Lütfen abone grubunuzu seçiniz');
      return false;
    }
    if (!captchaChecked) {
      toast.error('Lütfen robot olmadığınızı doğrulayın');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    
    updateData({ captchaVerified: true });
    
    if (data.personalInfo.subscriberGroup === 'sanayi') {
      updateData({ step: 99 }); // Special step for industrial
    } else {
      nextStep();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Hoş Geldiniz</CardTitle>
        <CardDescription>
          Abonelik başvurunuz için kişisel bilgilerinizi giriniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="Adınız"
                className="pl-10"
                value={data.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                placeholder="Soyadınız"
                className="pl-10"
                value={data.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon Numarası</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="05XX XXX XX XX"
              className="pl-10"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              className="pl-10"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscriberGroup">Abone Grubu</Label>
          <Select
            value={data.personalInfo.subscriberGroup}
            onValueChange={(value: SubscriberGroup) => updatePersonalInfo({ subscriberGroup: value })}
          >
            <SelectTrigger className="w-full">
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Abone grubunuzu seçiniz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mesken">Mesken (Konut)</SelectItem>
              <SelectItem value="ticari">Ticari (İşyeri)</SelectItem>
              <SelectItem value="sanayi">Sanayi</SelectItem>
            </SelectContent>
        </Select>
        </div>

        {/* Referral/Promo Code */}
        <div className="space-y-2">
          <Label htmlFor="referralCode">Referans/Promosyon Kodu (Opsiyonel)</Label>
          <div className="relative">
            <Gift className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="referralCode"
              placeholder="Varsa referans veya promosyon kodunuzu giriniz"
              className="pl-10"
              value={data.referralCode}
              onChange={(e) => updateData({ referralCode: e.target.value })}
            />
          </div>
        </div>

        {/* Simulated reCAPTCHA */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={captchaChecked}
              onChange={(e) => setCaptchaChecked(e.target.checked)}
              className="w-5 h-5 rounded border-2"
            />
            <span className="text-sm">Robot değilim</span>
            <img 
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
              alt="reCAPTCHA" 
              className="h-8 ml-auto"
            />
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            reCAPTCHA ile korunmaktadır
          </p>
        </div>

        <Button onClick={handleContinue} className="w-full" size="lg">
          Devam Et
        </Button>
      </CardContent>
    </Card>
  );
};
