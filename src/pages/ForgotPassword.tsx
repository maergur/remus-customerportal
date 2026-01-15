import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Shield, Phone, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import greenEnergyReset from '@/assets/green-energy-reset.jpg';
import {
  findCustomerByPhoneOrEmail,
  generateVerificationCode,
  verifyCode,
  setCustomerPassword,
  MockCustomer,
} from '@/lib/mockCustomers';
import { cn } from '@/lib/utils';

type Step = 'identify' | 'method' | 'verify' | 'password' | 'success';
type ResetMethod = 'sms' | 'email';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>('identify');

  // Kayıt sayfasından gelen identifier'ı otomatik doldur
  useEffect(() => {
    const state = location.state as { identifier?: string } | null;
    if (state?.identifier) {
      setIdentifier(state.identifier);
      // State'i temizle (browser geri/ileri butonlarında tekrar dolmasın)
      window.history.replaceState({}, document.title);
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [resetMethod, setResetMethod] = useState<ResetMethod>('sms');
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
      const customer = findCustomerByPhoneOrEmail(identifier.replace(/\s/g, ''));

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
      
      // Automatically set reset method based on input type and skip method selection
      const inputIsEmail = isEmail(identifier);
      setResetMethod(inputIsEmail ? 'email' : 'sms');
      
      // Generate verification code and go directly to verify step
      const target = inputIsEmail ? customer.email : customer.phone;
      generateVerificationCode(target);
      
      toast.success(
        inputIsEmail
          ? `${customer.email} adresine doğrulama kodu gönderildi`
          : `+90 ${customer.phone} numarasına doğrulama kodu gönderildi`
      );
      
      setStep('verify');
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
  const inputType = isEmail(identifier) ? 'email' : 'phone';
  const identifierHasValue = identifier.length > 0;
  const passwordHasValue = password.length > 0;
  const confirmPasswordHasValue = confirmPassword.length > 0;

  const maskPhone = (phone: string) => {
    return phone.slice(0, 3) + ' *** ** ' + phone.slice(-2);
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return local.slice(0, 2) + '***@' + domain;
  };

  return (
    <AuthLayout
      heroImage={greenEnergyReset}
      heroImageAlt="Yeni Başlangıç"
      badge="Güvenli Şifre Sıfırlama"
      badgeIcon={
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      }
      title="Güvenliğiniz bizim için önemli"
      subtitle="Şifrenizi kolayca sıfırlayın ve hesabınıza erişin"
      topStats={[
        { label: "Güvenlik Puanı", value: "A+" },
        { label: "Şifreli İşlem", value: "256-bit" },
      ]}
      bottomStats={[
        { value: "2FA", label: "Doğrulama" },
        { value: "SSL", label: "Şifreli Bağlantı" },
      ]}
    >
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
              <form onSubmit={handleIdentify} className="space-y-6">
                {/* Floating Label Input - Identifier */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10",
                      (identifierFocused || identifierHasValue) && "opacity-100 text-primary",
                      !identifierFocused && !identifierHasValue && "opacity-70",
                    )}
                  >
                    {inputType === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                  </div>

                  <Input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    onFocus={() => setIdentifierFocused(true)}
                    onBlur={() => setIdentifierFocused(false)}
                    className={cn(
                      "h-10 pl-10 pr-10 transition-all duration-200",
                      "border focus:ring-0",
                      identifierFocused ? "border-primary" : "border-input",
                      identifierValid === false && identifier.length > 0 && "border-destructive",
                      identifierValid === true && "border-primary",
                    )}
                    placeholder="Telefon veya e-posta"
                    required
                  />

                  {/* Floating Label */}
                  <span
                    className={cn(
                      "absolute left-10 transition-all duration-200 pointer-events-none bg-card px-1",
                      identifierFocused || identifierHasValue
                        ? "-top-2 text-xs text-primary"
                        : "top-1/2 -translate-y-1/2 text-muted-foreground hidden",
                    )}
                  >
                    {inputType === 'email' ? 'E-posta Adresi' : 'Telefon Numarası'}
                  </span>

                  {/* Validation Icon */}
                  {identifier.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {identifierValid ? (
                        <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in-50 duration-200" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive animate-in zoom-in-50 duration-200" />
                      )}
                    </div>
                  )}
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] opacity-0 pointer-events-none"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <Button type="submit" className="w-full" disabled={isLoading || !identifierValid}>
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
              <CardTitle className="text-2xl">Yeni Şifre Belirle</CardTitle>
              <CardDescription>
                Hesabınız için yeni ve güvenli bir şifre oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetPassword} className="space-y-4">
                {/* Floating Label Input - Password */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10",
                      (passwordFocused || passwordHasValue) && "opacity-100 text-primary",
                      !passwordFocused && !passwordHasValue && "opacity-70",
                    )}
                  >
                    <Lock className="h-4 w-4" />
                  </div>

                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className={cn(
                      "h-10 pl-10 pr-10 transition-all duration-200",
                      "border focus:ring-0",
                      passwordFocused ? "border-primary" : "border-input",
                    )}
                    placeholder="Yeni şifre"
                    required
                  />

                  {/* Floating Label */}
                  <span
                    className={cn(
                      "absolute left-10 transition-all duration-200 pointer-events-none bg-card px-1",
                      passwordFocused || passwordHasValue
                        ? "-top-2 text-xs text-primary"
                        : "top-1/2 -translate-y-1/2 text-muted-foreground hidden",
                    )}
                  >
                    Yeni Şifre
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password requirements */}
                <div className="space-y-1">
                  {[
                    { label: 'En az 8 karakter', valid: password.length >= 8 },
                    { label: 'Büyük harf', valid: /[A-Z]/.test(password) },
                    { label: 'Küçük harf', valid: /[a-z]/.test(password) },
                    { label: 'Rakam', valid: /[0-9]/.test(password) },
                  ].map((req, i) => (
                    <div
                      key={i}
                      className={`text-xs flex items-center gap-1.5 ${
                        req.valid ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <CheckCircle2 className={`h-3 w-3 ${req.valid ? 'opacity-100' : 'opacity-30'}`} />
                      {req.label}
                    </div>
                  ))}
                </div>

                {/* Floating Label Input - Confirm Password */}
                <div className="relative">
                  <div
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10",
                      (confirmPasswordFocused || confirmPasswordHasValue) && "opacity-100 text-primary",
                      !confirmPasswordFocused && !confirmPasswordHasValue && "opacity-70",
                    )}
                  >
                    <Lock className="h-4 w-4" />
                  </div>

                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    className={cn(
                      "h-10 pl-10 pr-10 transition-all duration-200",
                      "border focus:ring-0",
                      confirmPasswordFocused ? "border-primary" : "border-input",
                      confirmPassword && password !== confirmPassword && "border-destructive",
                      confirmPassword && password === confirmPassword && "border-primary",
                    )}
                    placeholder="Şifre tekrar"
                    required
                  />

                  {/* Floating Label */}
                  <span
                    className={cn(
                      "absolute left-10 transition-all duration-200 pointer-events-none bg-card px-1",
                      confirmPasswordFocused || confirmPasswordHasValue
                        ? "-top-2 text-xs text-primary"
                        : "top-1/2 -translate-y-1/2 text-muted-foreground hidden",
                    )}
                  >
                    Şifre Tekrar
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Şifreler eşleşmiyor</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || passwordErrors.length > 0 || password !== confirmPassword}
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
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Şifreniz Güncellendi!</CardTitle>
              <CardDescription>
                Yeni şifrenizle giriş yapabilirsiniz.
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
    </AuthLayout>
  );
};

export default ForgotPassword;
