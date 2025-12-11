import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const PhoneVerificationStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendCode = () => {
    setCountdown(60);
    setCanResend(false);
    toast.success('Doğrulama kodu tekrar gönderildi');
  };

  const handleVerify = () => {
    // Mock verification - in real app, verify with backend
    if (otp.length === 6) {
      updateData({ phoneVerified: true, verificationCode: otp });
      toast.success('Telefon numaranız doğrulandı');
      nextStep();
    } else {
      toast.error('Lütfen 6 haneli kodu giriniz');
    }
  };

  const maskedPhone = data.personalInfo.phone.replace(/(\d{2})\d{5}(\d{2})/, '$1*****$2');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Telefon Doğrulama</CardTitle>
        <CardDescription>
          <span className="font-medium">{maskedPhone}</span> numarasına gönderilen 6 haneli kodu giriniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="text-center">
          {canResend ? (
            <Button variant="ghost" onClick={handleResendCode} className="text-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Kodu Tekrar Gönder
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Kod {countdown} saniye içinde tekrar gönderilebilir
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Geri
          </Button>
          <Button onClick={handleVerify} className="flex-1">
            Doğrula
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
