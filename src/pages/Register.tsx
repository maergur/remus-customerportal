import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, Phone, Mail, ArrowLeft, CheckCircle2, Shield, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import remusLogo from '@/assets/remus-logo.svg';
import solarHero from '@/assets/solar-hero.jpg';
import { findCustomerByPhone, findCustomerByEmail, generateVerificationCode, verifyCode, setCustomerPassword, saveSession, MockCustomer } from '@/lib/mockCustomers';
import { cn } from '@/lib/utils';
type Step = 'identify' | 'verify' | 'password' | 'success';
const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identify');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Focus states for floating labels
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  // Validation states
  const [identifierValid, setIdentifierValid] = useState<boolean | null>(null);

  // Found customer
  const [foundCustomer, setFoundCustomer] = useState<MockCustomer | null>(null);
  const isEmail = (value: string) => {
    return value.includes('@');
  };
  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };
  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10;
  };
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
  };

  // Validate identifier on change
  useEffect(() => {
    if (!identifier) {
      setIdentifierValid(null);
      return;
    }
    if (isEmail(identifier)) {
      setIdentifierValid(isValidEmail(identifier));
    } else {
      setIdentifierValid(isValidPhone(identifier));
    }
  }, [identifier]);
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isEmail(value) && /^\d/.test(value.replace(/\s/g, ''))) {
      const formatted = formatPhoneNumber(value);
      if (formatted.replace(/\s/g, '').length <= 10) {
        setIdentifier(formatted);
      }
    } else {
      setIdentifier(value);
    }
  };
  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      let customer: MockCustomer | undefined;
      const trimmedIdentifier = identifier.trim();
      if (isEmail(trimmedIdentifier)) {
        customer = findCustomerByEmail(trimmedIdentifier);
      } else {
        const normalizedPhone = trimmedIdentifier.replace(/\s/g, '');
        customer = findCustomerByPhone(normalizedPhone);
      }
      if (!customer) {
        toast.error('Bu bilgilerle kayıtlı bir hesap bulunamadı. Yeni müşteri olarak kayıt olabilirsiniz.');
        setIsLoading(false);
        return;
      }
      if (customer.hasPassword) {
        toast.error('Bu hesap için zaten şifre belirlenmiş. Şifrenizi sıfırlayabilirsiniz.');
        navigate('/sifremi-unuttum', { state: { identifier: identifier.trim() } });
        setIsLoading(false);
        return;
      }
      setFoundCustomer(customer);
      const target = isEmail(trimmedIdentifier) ? trimmedIdentifier : trimmedIdentifier.replace(/\s/g, '');
      generateVerificationCode(target);
      toast.success(isEmail(trimmedIdentifier) ? `${trimmedIdentifier} adresine doğrulama kodu gönderildi` : `+90 ${identifier} numarasına doğrulama kodu gönderildi`);
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };
  const handleVerify = async () => {
    if (verificationCode.length !== 6) return;
    setIsLoading(true);
    const trimmedIdentifier = identifier.trim();
    const target = isEmail(trimmedIdentifier) ? trimmedIdentifier : trimmedIdentifier.replace(/\s/g, '');
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
    const trimmedIdentifier = identifier.trim();
    const target = isEmail(trimmedIdentifier) ? trimmedIdentifier : trimmedIdentifier.replace(/\s/g, '');
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
      saveSession({
        customerId: foundCustomer.id,
        customerNumber: foundCustomer.customerNumber,
        fullName: foundCustomer.fullName,
        phone: foundCustomer.phone,
        email: foundCustomer.email
      });
      setStep('success');
      setIsLoading(false);
    }, 1000);
  };
  const passwordErrors = validatePassword(password);
  const inputType = isEmail(identifier) ? 'email' : 'phone';
  const identifierHasValue = identifier.length > 0;
  const passwordHasValue = password.length > 0;
  const confirmPasswordHasValue = confirmPassword.length > 0;
  return <div className="min-h-screen flex">
      {/* Sol Panel - Form */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center lg:justify-start">
              <img src={remusLogo} alt="Remus Enerji" className="h-10" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
          {step === 'identify' && <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
              <CardDescription>
                  Abonelik başvurunuzda kullandığınız telefon veya e-posta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleIdentify} className="space-y-6">
                  {/* Floating Label Input - Identifier */}
                  <div className="relative">
                    <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10", (identifierFocused || identifierHasValue) && "opacity-100 text-primary", !identifierFocused && !identifierHasValue && "opacity-70")}>
                      {inputType === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    </div>

                    <Input id="identifier" type="text" value={identifier} onChange={handleIdentifierChange} onFocus={() => setIdentifierFocused(true)} onBlur={() => setIdentifierFocused(false)} className={cn("h-10 pl-10 pr-10 transition-all duration-200", "border focus:ring-0", identifierFocused ? "border-primary" : "border-input", identifierValid === false && identifier.length > 0 && "border-destructive", identifierValid === true && "border-primary")} placeholder="Telefon veya e-posta" required />

                    {/* Floating Label */}
                    <span className={cn("absolute left-10 transition-all duration-200 pointer-events-none bg-card px-1", identifierFocused || identifierHasValue ? "-top-2 text-xs text-primary" : "top-1/2 -translate-y-1/2 text-muted-foreground hidden")}>
                      {inputType === 'email' ? 'E-posta Adresi' : 'Telefon Numarası'}
                    </span>

                    {/* Validation Icon */}
                    {identifier.length > 0 && <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {identifierValid ? <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in-50 duration-200" /> : <AlertCircle className="h-4 w-4 text-destructive animate-in zoom-in-50 duration-200" />}
                      </div>}
                  </div>

                  

                  {/* Honeypot */}
                  <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} className="absolute -left-[9999px] opacity-0 pointer-events-none" tabIndex={-1} autoComplete="off" />

                  <Button type="submit" className="w-full" disabled={isLoading || !identifierValid}>
                    {isLoading ? 'Kontrol ediliyor...' : 'Devam Et'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/giris" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Giriş sayfasına dön
                  </Link>
                </div>
              </CardContent>
            </>}

          {step === 'verify' && <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Doğrulama Kodu</CardTitle>
                <CardDescription>
                  {isEmail(identifier) ? `${identifier} adresine gönderilen 6 haneli kodu girin` : `+90 ${identifier} numarasına gönderilen 6 haneli kodu girin`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
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

                <Button className="w-full" onClick={handleVerify} disabled={verificationCode.length !== 6 || isLoading}>
                  {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Kod gelmedi mi?</p>
                  <Button variant="link" onClick={handleResendCode} className="text-primary">
                    Tekrar Gönder
                  </Button>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => {
              setStep('identify');
              setVerificationCode('');
            }}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri Dön
                </Button>
              </CardContent>
            </>}

          {step === 'password' && <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Şifre Belirle</CardTitle>
                <CardDescription>
                  Hesabınız için güvenli bir şifre oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetPassword} className="space-y-4">
                  {/* Floating Label Input - Password */}
                  <div className="relative">
                    <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10", (passwordFocused || passwordHasValue) && "opacity-100 text-primary", !passwordFocused && !passwordHasValue && "opacity-70")}>
                      <Lock className="h-4 w-4" />
                    </div>

                    <Input id="new-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} className={cn("h-10 pl-10 pr-10 transition-all duration-200", "border focus:ring-0", passwordFocused ? "border-primary" : "border-input")} placeholder="Yeni şifre" required />

                    {/* Floating Label */}
                    <span className={cn("absolute left-10 transition-all duration-200 pointer-events-none bg-card px-1", passwordFocused || passwordHasValue ? "-top-2 text-xs text-primary" : "top-1/2 -translate-y-1/2 text-muted-foreground hidden")}>
                      Yeni Şifre
                    </span>

                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password requirements */}
                  <div className="space-y-1">
                    {[{
                  label: 'En az 8 karakter',
                  valid: password.length >= 8
                }, {
                  label: 'Büyük harf',
                  valid: /[A-Z]/.test(password)
                }, {
                  label: 'Küçük harf',
                  valid: /[a-z]/.test(password)
                }, {
                  label: 'Rakam',
                  valid: /[0-9]/.test(password)
                }].map((req, i) => <div key={i} className={`text-xs flex items-center gap-1.5 ${req.valid ? 'text-primary' : 'text-muted-foreground'}`}>
                        <CheckCircle2 className={`h-3 w-3 ${req.valid ? 'opacity-100' : 'opacity-30'}`} />
                        {req.label}
                      </div>)}
                  </div>

                  {/* Floating Label Input - Confirm Password */}
                  <div className="relative">
                    <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10", (confirmPasswordFocused || confirmPasswordHasValue) && "opacity-100 text-primary", !confirmPasswordFocused && !confirmPasswordHasValue && "opacity-70")}>
                      <Lock className="h-4 w-4" />
                    </div>

                    <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onFocus={() => setConfirmPasswordFocused(true)} onBlur={() => setConfirmPasswordFocused(false)} className={cn("h-10 pl-10 pr-10 transition-all duration-200", "border focus:ring-0", confirmPasswordFocused ? "border-primary" : "border-input", confirmPassword && password !== confirmPassword && "border-destructive", confirmPassword && password === confirmPassword && "border-primary")} placeholder="Şifre tekrar" required />

                    {/* Floating Label */}
                    <span className={cn("absolute left-10 transition-all duration-200 pointer-events-none bg-card px-1", confirmPasswordFocused || confirmPasswordHasValue ? "-top-2 text-xs text-primary" : "top-1/2 -translate-y-1/2 text-muted-foreground hidden")}>
                      Şifre Tekrar
                    </span>

                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {confirmPassword && password !== confirmPassword && <p className="text-xs text-destructive">Şifreler eşleşmiyor</p>}

                  <Button type="submit" className="w-full" disabled={isLoading || passwordErrors.length > 0 || password !== confirmPassword}>
                    {isLoading ? 'Kaydediliyor...' : 'Şifremi Kaydet'}
                  </Button>
                </form>
              </CardContent>
            </>}

          {step === 'success' && <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
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
                  Portala Git
                </Button>
              </CardContent>
            </>}
        </Card>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-muted-foreground">
          <p>© 2024 Remus Enerji. Tüm hakları saklıdır.</p>
        </footer>
      </div>

      {/* Sağ Panel - Görsel (mobilde gizli) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img 
          src={solarHero} 
          alt="Solar Energy" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Geleceğe birlikte adım atın
          </h2>
          <p className="text-lg text-white/80">
            Sürdürülebilir enerji ile tasarrufun keyfini çıkarın
          </p>
        </div>
      </div>
    </div>;
};

export default Register;