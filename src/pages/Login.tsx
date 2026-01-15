import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Phone, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import remusLogo from '@/assets/remus-logo.svg';
import { findCustomerByPhone, findCustomerByEmail, verifyCustomerPassword, saveSession } from '@/lib/mockCustomers';
const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Phone login state
  const [phone, setPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');

  // Email login state
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
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
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const normalizedPhone = phone.replace(/\s/g, '');
    const customer = findCustomerByPhone(normalizedPhone);
    setTimeout(() => {
      if (!customer) {
        toast.error('Bu telefon numarası sistemde kayıtlı değil');
        setIsLoading(false);
        return;
      }
      if (!customer.hasPassword) {
        toast.error('Henüz şifreniz belirlenmemiş. Lütfen kayıt olun.');
        setIsLoading(false);
        return;
      }
      if (!verifyCustomerPassword(customer.id, phonePassword)) {
        toast.error('Şifre hatalı');
        setIsLoading(false);
        return;
      }
      saveSession({
        customerId: customer.id,
        customerNumber: customer.customerNumber,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email
      });
      toast.success('Giriş başarılı!');
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const customer = findCustomerByEmail(email);
    setTimeout(() => {
      if (!customer) {
        toast.error('Bu e-posta adresi sistemde kayıtlı değil');
        setIsLoading(false);
        return;
      }
      if (!customer.hasPassword) {
        toast.error('Henüz şifreniz belirlenmemiş. Lütfen kayıt olun.');
        setIsLoading(false);
        return;
      }
      if (!verifyCustomerPassword(customer.id, emailPassword)) {
        toast.error('Şifre hatalı');
        setIsLoading(false);
        return;
      }
      saveSession({
        customerId: customer.id,
        customerNumber: customer.customerNumber,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email
      });
      toast.success('Giriş başarılı!');
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
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
            <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'phone' | 'email')}>
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
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        +90
                      </span>
                      <Input id="phone" type="tel" placeholder="555 123 45 67" value={phone} onChange={handlePhoneChange} className="pl-12" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="phone-password">Şifre</Label>
                      <Link to="/sifremi-unuttum" className="text-xs text-primary hover:underline">
                        Şifremi Unuttum
                      </Link>
                    </div>
                    <div className="relative">
                      <Input id="phone-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={phonePassword} onChange={e => setPhonePassword(e.target.value)} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <Input id="email" type="email" placeholder="ornek@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-password">Şifre</Label>
                      <Link to="/sifremi-unuttum" className="text-xs text-primary hover:underline">
                        Şifremi Unuttum
                      </Link>
                    </div>
                    <div className="relative">
                      <Input id="email-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            

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
    </div>;
};
export default Login;