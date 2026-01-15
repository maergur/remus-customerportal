import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { toast } from 'sonner';
import remusLogo from '@/assets/remus-logo.svg';
import {
  findCustomerByPhone,
  findCustomerByEmail,
  verifyCustomerPassword,
  saveSession,
} from '@/lib/mockCustomers';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const isEmail = (value: string) => {
    return value.includes('@');
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
  };

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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Müşteri Portalına Giriş</CardTitle>
            <CardDescription>
              Hesabınıza giriş yapın veya yeni hesap oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Telefon Numarası veya E-posta</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="555 123 45 67 veya ornek@email.com"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link
                    to="/sifremi-unuttum"
                    className="text-xs text-primary hover:underline"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
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
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">veya</span>
              </div>
            </div>

            {/* Register Options */}
            <div className="space-y-3">
              <Link to="/kayit">
                <Button variant="outline" className="w-full group">
                  Mevcut Müşteriyim, Hesap Oluştur
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button variant="ghost" className="w-full text-muted-foreground">
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
