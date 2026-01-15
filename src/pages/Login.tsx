import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowRight, Phone, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import remusLogo from '@/assets/remus-logo.svg';
import {
  findCustomerByPhone,
  findCustomerByEmail,
  verifyCustomerPassword,
  saveSession,
} from '@/lib/mockCustomers';
import { cn } from '@/lib/utils';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  // Focus states for floating labels
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Validation states
  const [identifierValid, setIdentifierValid] = useState<boolean | null>(null);

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
    
    // If it looks like a phone number (starts with digit and no @), format it
    if (!isEmail(value) && /^\d/.test(value.replace(/\s/g, ''))) {
      const formatted = formatPhoneNumber(value);
      if (formatted.replace(/\s/g, '').length <= 10) {
        setIdentifier(formatted);
      }
    } else {
      setIdentifier(value);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      return;
    }
    
    setIsLoading(true);

    const trimmedIdentifier = identifier.trim();
    let customer;

    if (isEmail(trimmedIdentifier)) {
      customer = findCustomerByEmail(trimmedIdentifier);
    } else {
      const normalizedPhone = trimmedIdentifier.replace(/\s/g, '');
      customer = findCustomerByPhone(normalizedPhone);
    }

    setTimeout(() => {
      if (!customer) {
        toast.error('Bu telefon numarası veya e-posta adresi sistemde kayıtlı değil');
        setIsLoading(false);
        return;
      }

      if (!customer.hasPassword) {
        toast.error('Henüz şifreniz belirlenmemiş. Lütfen kayıt olun.');
        setIsLoading(false);
        return;
      }

      if (!verifyCustomerPassword(customer.id, password)) {
        toast.error('Şifre hatalı');
        setIsLoading(false);
        return;
      }

      saveSession({
        customerId: customer.id,
        customerNumber: customer.customerNumber,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
      });

      toast.success('Giriş başarılı!');
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  const inputType = isEmail(identifier) ? 'email' : 'phone';
  const identifierHasValue = identifier.length > 0;
  const passwordHasValue = password.length > 0;

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
        <Card className="w-full max-w-md overflow-hidden">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Müşteri Portalına Giriş</CardTitle>
            <CardDescription>
              Hesabınıza giriş yapın veya yeni hesap oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Floating Label Input - Identifier */}
              <div className="relative">
                <div className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10",
                  (identifierFocused || identifierHasValue) && "opacity-100",
                  !identifierFocused && !identifierHasValue && "opacity-70"
                )}>
                  <div className={cn(
                    "transition-all duration-300",
                    inputType === 'email' ? "text-primary" : "text-primary"
                  )}>
                    {inputType === 'email' ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <Phone className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onFocus={() => setIdentifierFocused(true)}
                  onBlur={() => setIdentifierFocused(false)}
                  className={cn(
                    "h-14 pl-12 pr-12 text-base transition-all duration-200",
                    "border-2 focus:ring-0",
                    identifierFocused ? "border-primary" : "border-input",
                    identifierValid === false && identifier.length > 0 && "border-destructive",
                    identifierValid === true && "border-primary"
                  )}
                  placeholder="Telefon veya e-posta"
                  required
                />
                
                {/* Floating Label */}
                <span className={cn(
                  "absolute left-12 transition-all duration-200 pointer-events-none bg-card px-1",
                  (identifierFocused || identifierHasValue) 
                    ? "-top-2.5 text-xs text-primary" 
                    : "top-1/2 -translate-y-1/2 text-muted-foreground hidden"
                )}>
                  {inputType === 'email' ? 'E-posta Adresi' : 'Telefon Numarası'}
                </span>
                
                {/* Validation Icon */}
                {identifier.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {identifierValid ? (
                      <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in-50 duration-200" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive animate-in zoom-in-50 duration-200" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Floating Label Input - Password */}
              <div className="relative">
                <div className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10",
                  (passwordFocused || passwordHasValue) && "opacity-100 text-primary",
                  !passwordFocused && !passwordHasValue && "opacity-70"
                )}>
                  <Lock className="h-5 w-5" />
                </div>
                
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={cn(
                    "h-14 pl-12 pr-12 text-base transition-all duration-200",
                    "border-2 focus:ring-0",
                    passwordFocused ? "border-primary" : "border-input"
                  )}
                  placeholder="Şifreniz"
                  required
                />
                
                {/* Floating Label */}
                <span className={cn(
                  "absolute left-12 transition-all duration-200 pointer-events-none bg-card px-1",
                  (passwordFocused || passwordHasValue) 
                    ? "-top-2.5 text-xs text-primary" 
                    : "top-1/2 -translate-y-1/2 text-muted-foreground hidden"
                )}>
                  Şifre
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Honeypot - Hidden from users, visible to bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
              />
              
              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/sifremi-unuttum"
                  className="text-sm text-primary hover:underline"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium transition-all duration-200" 
                disabled={isLoading || !identifierValid}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Giriş yapılıyor...
                  </span>
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground">veya</span>
              </div>
            </div>

            {/* Register Options */}
            <div className="space-y-3">
              <Link to="/kayit">
                <Button variant="outline" className="w-full h-12 group transition-all duration-200 hover:border-primary hover:bg-primary/5">
                  Mevcut Müşteriyim, Hesap Oluştur
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button variant="ghost" className="w-full h-11 text-muted-foreground hover:text-foreground">
                  Yeni Müşteri Olarak Kayıt Ol
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© 2024 Remus Enerji. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default Login;