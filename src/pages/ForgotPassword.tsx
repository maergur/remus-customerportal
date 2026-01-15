import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Shield, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import remusLogo from '@/assets/remus-logo.svg';
import {
  findCustomerByPhoneOrEmail,
  generateVerificationCode,
  verifyCode,
  setCustomerPassword,
  MockCustomer,
} from '@/lib/mockCustomers';

type Step = 'identify' | 'method' | 'verify' | 'password' | 'success';
type ResetMethod = 'sms' | 'email';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identify');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [resetMethod, setResetMethod] = useState<ResetMethod>('sms');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Found customer
  const [foundCustomer, setFoundCustomer] = useState<MockCustomer | null>(null);

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const customer = findCustomerByPhoneOrEmail(identifier);

      if (!customer) {
        toast.error('Bu bilgilerle kayıtlı bir hesap bulunamadı');
        setIsLoading(false);
        return;
      }

      if (!customer.hasPassword) {
        toast.error('Henüz şifreniz belirlenmemiş. Lütfen kayıt olun.');
        navigate('/kayit');
        setIsLoading(false);
        return;
      }

      setFoundCustomer(customer);
      setStep('method');
      setIsLoading(false);
    }, 1000);
  };

  const handleMethodSelect = () => {
    if (!foundCustomer) return;

    setIsLoading(true);

    const target = resetMethod === 'sms' ? foundCustomer.phone : foundCustomer.email;
    generateVerificationCode(target);

    setTimeout(() => {
      toast.success(
        resetMethod === 'sms'
          ? `+90 ${foundCustomer.phone} numarasına doğrulama kodu gönderildi`
          : `${foundCustomer.email} adresine doğrulama kodu gönderildi`
      );
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6 || !foundCustomer) return;

    setIsLoading(true);
    const target = resetMethod === 'sms' ? foundCustomer.phone : foundCustomer.email;

    setTimeout(() => {
      if (verifyCode(target, verificationCode)) {
        toast.success('Doğrulama başarılı!');
        setStep('password');
      } else {
        toast.error('Doğrulama kodu hatalı veya süresi dolmuş');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleResendCode = () => {
    if (!foundCustomer) return;
    const target = resetMethod === 'sms' ? foundCustomer.phone : foundCustomer.email;
    generateVerificationCode(target);
    toast.success('Yeni doğrulama kodu gönderildi');
    setVerificationCode('');
  };

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('En az 8 karakter olmalı');
    if (!/[A-Z]/.test(pwd)) errors.push('En az bir büyük harf içermeli');
    if (!/[a-z]/.test(pwd)) errors.push('En az bir küçük harf içermeli');
    if (!/[0-9]/.test(pwd)) errors.push('En az bir rakam içermeli');
    return errors;
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validatePassword(password);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (!foundCustomer) return;

    setIsLoading(true);

    setTimeout(() => {
      setCustomerPassword(foundCustomer.id, password);
      setStep('success');
      setIsLoading(false);
    }, 1000);
  };

  const passwordErrors = validatePassword(password);

  const maskPhone = (phone: string) => {
    return phone.slice(0, 3) + ' *** ** ' + phone.slice(-2);
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return local.slice(0, 2) + '***@' + domain;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img src={remusLogo} alt="Remus Enerji" className="h-10" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {step === 'identify' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Şifremi Unuttum</CardTitle>
                <CardDescription>
                  Hesabınızı bulmak için telefon numaranızı veya e-posta adresinizi girin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleIdentify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Telefon veya E-posta</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="5551234567 veya ornek@email.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Aranıyor...' : 'Devam Et'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/giris"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Giriş sayfasına dön
                  </Link>
                </div>
              </CardContent>
            </>
          )}

          {step === 'method' && foundCustomer && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Doğrulama Yöntemi</CardTitle>
                <CardDescription>
                  Şifrenizi sıfırlamak için doğrulama kodunu nasıl almak istiyorsunuz?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={resetMethod} onValueChange={(v) => setResetMethod(v as ResetMethod)}>
                  <div
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      resetMethod === 'sms' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setResetMethod('sms')}
                  >
                    <RadioGroupItem value="sms" id="sms" />
                    <div className="flex-1">
                      <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                        <Phone className="h-4 w-4" />
                        SMS ile gönder
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        +90 {maskPhone(foundCustomer.phone)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      resetMethod === 'email' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setResetMethod('email')}
                  >
                    <RadioGroupItem value="email" id="email" />
                    <div className="flex-1">
                      <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                        <Mail className="h-4 w-4" />
                        E-posta ile gönder
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {maskEmail(foundCustomer.email)}
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                <Button className="w-full" onClick={handleMethodSelect} disabled={isLoading}>
                  {isLoading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep('identify')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri Dön
                </Button>
              </CardContent>
            </>
          )}

          {step === 'verify' && foundCustomer && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Doğrulama Kodu</CardTitle>
                <CardDescription>
                  {resetMethod === 'sms'
                    ? `+90 ${maskPhone(foundCustomer.phone)} numarasına gönderilen 6 haneli kodu girin`
                    : `${maskEmail(foundCustomer.email)} adresine gönderilen 6 haneli kodu girin`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                  >
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

                <Button
                  className="w-full"
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6 || isLoading}
                >
                  {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Kod gelmedi mi?</p>
                  <Button variant="link" onClick={handleResendCode} className="text-primary">
                    Tekrar Gönder
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep('method');
                    setVerificationCode('');
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri Dön
                </Button>
              </CardContent>
            </>
          )}

          {step === 'password' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Yeni Şifre Belirle</CardTitle>
                <CardDescription>
                  Hesabınız için yeni bir şifre oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Yeni Şifre</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {/* Password requirements */}
                    <div className="space-y-1 mt-2">
                      {[
                        { label: 'En az 8 karakter', valid: password.length >= 8 },
                        { label: 'Büyük harf', valid: /[A-Z]/.test(password) },
                        { label: 'Küçük harf', valid: /[a-z]/.test(password) },
                        { label: 'Rakam', valid: /[0-9]/.test(password) },
                      ].map((req, i) => (
                        <div
                          key={i}
                          className={`text-xs flex items-center gap-1.5 ${
                            req.valid ? 'text-green-600' : 'text-muted-foreground'
                          }`}
                        >
                          <CheckCircle2 className={`h-3 w-3 ${req.valid ? 'opacity-100' : 'opacity-30'}`} />
                          {req.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive">Şifreler eşleşmiyor</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isLoading ||
                      passwordErrors.length > 0 ||
                      password !== confirmPassword
                    }
                  >
                    {isLoading ? 'Kaydediliyor...' : 'Şifremi Güncelle'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'success' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Şifreniz Güncellendi!</CardTitle>
                <CardDescription>
                  Yeni şifreniz başarıyla kaydedildi. Artık giriş yapabilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/giris')}>
                  Giriş Yap
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© 2024 Remus Enerji. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
