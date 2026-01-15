import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, Phone, Mail, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import remusLogo from '@/assets/remus-logo.svg';
import {
  findCustomerByPhone,
  findCustomerByEmail,
  generateVerificationCode,
  verifyCode,
  setCustomerPassword,
  saveSession,
  MockCustomer,
} from '@/lib/mockCustomers';

type Step = 'identify' | 'verify' | 'password' | 'success';

const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<Step>('identify');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Found customer
  const [foundCustomer, setFoundCustomer] = useState<MockCustomer | null>(null);
  
  // Captcha state
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 10) {
      setPhone(formatted);
    }
  };

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaChecked) {
      toast.error('Lütfen robot olmadığınızı doğrulayın');
      return;
    }
    
    setIsLoading(true);

    setTimeout(() => {
      let customer: MockCustomer | undefined;
      let identifier: string;

      if (activeTab === 'phone') {
        const normalizedPhone = phone.replace(/\s/g, '');
        customer = findCustomerByPhone(normalizedPhone);
        identifier = normalizedPhone;
      } else {
        customer = findCustomerByEmail(email);
        identifier = email;
      }

      if (!customer) {
        toast.error(
          activeTab === 'phone'
            ? 'Bu telefon numarası sistemimizde kayıtlı değil. Yeni müşteri olarak kayıt olabilirsiniz.'
            : 'Bu e-posta adresi sistemimizde kayıtlı değil. Yeni müşteri olarak kayıt olabilirsiniz.'
        );
        setIsLoading(false);
        return;
      }

      if (customer.hasPassword) {
        toast.info('Bu hesap için zaten şifre belirlenmiş. Şifrenizi hatırlamıyorsanız sıfırlayabilirsiniz.');
        navigate('/sifremi-unuttum');
        setIsLoading(false);
        return;
      }

      setFoundCustomer(customer);
      generateVerificationCode(identifier);
      toast.success(
        activeTab === 'phone'
          ? `+90 ${phone} numarasına doğrulama kodu gönderildi`
          : `${email} adresine doğrulama kodu gönderildi`
      );
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) return;

    setIsLoading(true);
    const identifier = activeTab === 'phone' ? phone.replace(/\s/g, '') : email;

    setTimeout(() => {
      if (verifyCode(identifier, verificationCode)) {
        toast.success('Doğrulama başarılı!');
        setStep('password');
      } else {
        toast.error('Doğrulama kodu hatalı veya süresi dolmuş');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleResendCode = () => {
    const identifier = activeTab === 'phone' ? phone.replace(/\s/g, '') : email;
    generateVerificationCode(identifier);
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
      
      saveSession({
        customerId: foundCustomer.id,
        customerNumber: foundCustomer.customerNumber,
        fullName: foundCustomer.fullName,
        phone: foundCustomer.phone,
        email: foundCustomer.email,
      });

      setStep('success');
      setIsLoading(false);
    }, 1000);
  };

  const passwordErrors = validatePassword(password);

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
                <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
                <CardDescription>
                  Mevcut müşteri bilgilerinizi doğrulayın ve şifrenizi belirleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'phone' | 'email')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefon
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-posta
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="phone">
                    <form onSubmit={handleIdentify} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-phone">Kayıtlı Telefon Numarası</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            +90
                          </span>
                          <Input
                            id="reg-phone"
                            type="tel"
                            placeholder="555 123 45 67"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="pl-12"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Abonelik başvurunuzda kullandığınız telefon numarası
                        </p>
                      </div>
                      {/* Captcha */}
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
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading || !captchaChecked}>
                        {isLoading ? 'Kontrol ediliyor...' : 'Devam Et'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="email">
                    <form onSubmit={handleIdentify} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Kayıtlı E-posta Adresi</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="ornek@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Abonelik başvurunuzda kullandığınız e-posta adresi
                        </p>
                      </div>
                      {/* Captcha */}
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
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isLoading || !captchaChecked}>
                        {isLoading ? 'Kontrol ediliyor...' : 'Devam Et'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

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

          {step === 'verify' && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Doğrulama Kodu</CardTitle>
                <CardDescription>
                  {activeTab === 'phone'
                    ? `+90 ${phone} numarasına gönderilen 6 haneli kodu girin`
                    : `${email} adresine gönderilen 6 haneli kodu girin`}
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
                    setStep('identify');
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
                <CardTitle className="text-2xl">Şifre Belirle</CardTitle>
                <CardDescription>
                  Hesabınız için güvenli bir şifre oluşturun
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
                    {isLoading ? 'Kaydediliyor...' : 'Şifremi Kaydet'}
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
                <CardTitle className="text-2xl">Hesabınız Hazır!</CardTitle>
                <CardDescription>
                  Şifreniz başarıyla oluşturuldu. Artık müşteri portalını kullanabilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Hoş geldiniz,</p>
                  <p className="font-semibold">{foundCustomer?.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Müşteri No: {foundCustomer?.customerNumber}
                  </p>
                </div>
                <Button className="w-full" onClick={() => navigate('/')}>
                  Müşteri Portalına Git
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

export default Register;
