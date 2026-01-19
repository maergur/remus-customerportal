import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInstallation } from "@/contexts/InstallationContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  FileText, 
  Shield, 
  Plus,
  Zap,
  Check,
  Lock,
  Bell,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const Profil = () => {
  const { language } = useLanguage();
  const { installations, selectedInstallation, setSelectedInstallation } = useInstallation();

  const subscriberGroupLabels: Record<string, { tr: string; en: string }> = {
    mesken: { tr: "Mesken", en: "Residential" },
    ticari: { tr: "Ticari", en: "Commercial" },
    sanayi: { tr: "Sanayi", en: "Industrial" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-page-enter">
        {/* Page Header */}
        <div data-tour="profile">
          <h1 className="text-2xl font-bold text-foreground">
            {language === "tr" ? "Profil & Ayarlar" : "Profile & Settings"}
          </h1>
          <p className="text-muted-foreground">
            {language === "tr" ? "Hesap bilgilerinizi ve tercihlerinizi yönetin" : "Manage your account and preferences"}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "tr" ? "Hesap" : "Account"}</span>
            </TabsTrigger>
            <TabsTrigger value="installations" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "tr" ? "Tesisatlar" : "Installations"}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "tr" ? "Güvenlik" : "Security"}</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Kişisel Bilgiler" : "Personal Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      {language === "tr" ? "Ad" : "First Name"}
                    </Label>
                    <Input 
                      value="Ahmet" 
                      readOnly 
                      className="bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      {language === "tr" ? "Soyad" : "Last Name"}
                    </Label>
                    <Input 
                      value="Yılmaz" 
                      readOnly 
                      className="bg-secondary/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {language === "tr" ? "E-posta" : "Email"}
                  </Label>
                  <Input 
                    value="ahmet@email.com" 
                    readOnly 
                    className="bg-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {language === "tr" ? "Telefon" : "Phone"}
                    <span className="text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                      {language === "tr" ? "Doğrulandı" : "Verified"}
                    </span>
                  </Label>
                  <Input 
                    value="+90 555 123 4567" 
                    readOnly 
                    className="bg-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    {language === "tr" ? "Abone Grubu" : "Subscriber Group"}
                  </Label>
                  <Input 
                    value={language === "tr" ? "Mesken" : "Residential"} 
                    readOnly 
                    className="bg-secondary/30"
                  />
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  {language === "tr" 
                    ? "Bilgilerinizi güncellemek için müşteri hizmetleri ile iletişime geçin."
                    : "Contact customer service to update your information."}
                </p>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Bildirim Tercihleri" : "Notification Preferences"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{language === "tr" ? "E-posta Bildirimleri" : "Email Notifications"}</p>
                    <p className="text-sm text-muted-foreground">{language === "tr" ? "Fatura ve kampanya bildirimleri" : "Invoice and campaign notifications"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{language === "tr" ? "SMS Bildirimleri" : "SMS Notifications"}</p>
                    <p className="text-sm text-muted-foreground">{language === "tr" ? "Acil durum ve kesinti bildirimleri" : "Emergency and outage notifications"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{language === "tr" ? "Pazarlama İletişimi" : "Marketing Communications"}</p>
                    <p className="text-sm text-muted-foreground">{language === "tr" ? "Özel teklifler ve haberler" : "Special offers and news"}</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Installations Tab */}
          <TabsContent value="installations" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Tesisatlarım" : "My Installations"}
                </CardTitle>
                <Link to="/onboarding">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {language === "tr" ? "Yeni Tesisat" : "New Installation"}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "tr" 
                    ? "Panelde görüntülemek istediğiniz tesisatı seçin." 
                    : "Select the installation you want to view in the dashboard."}
                </p>
                <div className="space-y-3">
                  {installations.map((inst) => {
                    const isSelected = selectedInstallation.id === inst.id;
                    return (
                      <button
                        key={inst.id}
                        onClick={() => setSelectedInstallation(inst)}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all",
                          isSelected 
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                            : "border-border bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                            )}>
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {inst.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {language === "tr" ? "Tesisat No" : "Installation No"}: {inst.installationNo}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                              {language === "tr" ? "Aktif" : "Active"}
                            </span>
                          )}
                        </div>
                        
                        <div className="ml-8 space-y-1 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{inst.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-foreground font-medium">{inst.tariff}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Şifre & Giriş" : "Password & Login"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">{language === "tr" ? "Şifre" : "Password"}</p>
                    <p className="text-sm text-muted-foreground">{language === "tr" ? "Son değişiklik: 3 ay önce" : "Last changed: 3 months ago"}</p>
                  </div>
                  <Button variant="outline">
                    {language === "tr" ? "Değiştir" : "Change"}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">{language === "tr" ? "İki Faktörlü Doğrulama" : "Two-Factor Authentication"}</p>
                    <p className="text-sm text-muted-foreground">{language === "tr" ? "Hesabınızı daha güvenli hale getirin" : "Make your account more secure"}</p>
                  </div>
                  <Button variant="outline">
                    {language === "tr" ? "Etkinleştir" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Sözleşmeler" : "Contracts"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{language === "tr" ? "Elektrik Satış Sözleşmesi" : "Electricity Sales Agreement"}</p>
                      <p className="text-sm text-muted-foreground">PDF • 245 KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {language === "tr" ? "İndir" : "Download"}
                  </Button>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{language === "tr" ? "KVKK Aydınlatma Metni" : "Privacy Policy"}</p>
                      <p className="text-sm text-muted-foreground">PDF • 128 KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {language === "tr" ? "İndir" : "Download"}
                  </Button>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Ödeme Yöntemleri" : "Payment Methods"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">{language === "tr" ? "Son kullanma: 12/28" : "Expires: 12/28"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === "tr" ? "Düzenle" : "Edit"}
                  </Button>
                </div>
                <Button variant="ghost" className="w-full mt-3 gap-2">
                  <Plus className="h-4 w-4" />
                  {language === "tr" ? "Yeni Kart Ekle" : "Add New Card"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profil;
