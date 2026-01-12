import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  FileText, 
  Shield, 
  CheckCircle2, 
  Circle,
  Edit3,
  Plus,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  tariff: string;
  subscriberGroup: string;
  contractAccepted: boolean;
  phoneVerified: boolean;
  addressConfirmed: boolean;
}

const Profil = () => {
  const { language } = useLanguage();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [completionPercent, setCompletionPercent] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        const profile: ProfileData = {
          firstName: data.personalInfo?.firstName || '',
          lastName: data.personalInfo?.lastName || '',
          email: data.personalInfo?.email || '',
          phone: data.personalInfo?.phone || '',
          address: data.addressFromEtso || '',
          tariff: data.selectedTariff || '',
          subscriberGroup: data.personalInfo?.subscriberGroup || '',
          contractAccepted: !!data.contractAccepted,
          phoneVerified: !!data.phoneVerified,
          addressConfirmed: !!data.addressConfirmed,
        };
        
        setProfileData(profile);

        // Calculate completion
        const items = [
          !!(profile.firstName && profile.lastName && profile.email),
          profile.phoneVerified,
          profile.addressConfirmed,
          !!profile.tariff,
          profile.contractAccepted,
        ];
        const completedCount = items.filter(Boolean).length;
        setCompletionPercent(Math.round((completedCount / items.length) * 100));
      } catch {
        setProfileData(null);
      }
    }
  }, []);

  const subscriptions = [
    {
      id: 1,
      name: language === "tr" ? "Ev Aboneliği" : "Home Subscription",
      address: "Atatürk Mah. Cumhuriyet Cad. No:42 D:5",
      tariff: language === "tr" ? "Yeşil Enerji Pro" : "Green Energy Pro",
      installationNo: "1234567",
      active: true,
    },
  ];

  const profileItems = [
    {
      key: 'personalInfo',
      labelTr: 'Kişisel Bilgiler',
      labelEn: 'Personal Info',
      completed: !!(profileData?.firstName && profileData?.lastName && profileData?.email),
    },
    {
      key: 'phone',
      labelTr: 'Telefon Doğrulama',
      labelEn: 'Phone Verification',
      completed: !!profileData?.phoneVerified,
    },
    {
      key: 'address',
      labelTr: 'Adres Bilgileri',
      labelEn: 'Address Info',
      completed: !!profileData?.addressConfirmed,
    },
    {
      key: 'tariff',
      labelTr: 'Tarife Seçimi',
      labelEn: 'Tariff Selection',
      completed: !!profileData?.tariff,
    },
    {
      key: 'contract',
      labelTr: 'Sözleşme Onayı',
      labelEn: 'Contract Approval',
      completed: !!profileData?.contractAccepted,
    },
  ];

  const subscriberGroupLabels: Record<string, { tr: string; en: string }> = {
    mesken: { tr: "Mesken", en: "Residential" },
    ticari: { tr: "Ticari", en: "Commercial" },
    sanayi: { tr: "Sanayi", en: "Industrial" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-page-enter">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === "tr" ? "Profilim" : "My Profile"}
            </h1>
            <p className="text-muted-foreground">
              {language === "tr" ? "Hesap bilgilerinizi ve aboneliklerinizi yönetin" : "Manage your account and subscriptions"}
            </p>
          </div>
          <Link to="/onboarding">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              {language === "tr" ? "Yeni Abonelik Ekle" : "Add New Subscription"}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Kişisel Bilgiler" : "Personal Information"}
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  {language === "tr" ? "Düzenle" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      {language === "tr" ? "Ad" : "First Name"}
                    </Label>
                    <Input 
                      value={profileData?.firstName || "Ahmet"} 
                      readOnly 
                      className="bg-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      {language === "tr" ? "Soyad" : "Last Name"}
                    </Label>
                    <Input 
                      value={profileData?.lastName || "Yılmaz"} 
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
                    value={profileData?.email || "ahmet@email.com"} 
                    readOnly 
                    className="bg-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {language === "tr" ? "Telefon" : "Phone"}
                    {profileData?.phoneVerified && (
                      <span className="text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                        {language === "tr" ? "Doğrulandı" : "Verified"}
                      </span>
                    )}
                  </Label>
                  <Input 
                    value={profileData?.phone || "+90 555 123 4567"} 
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
                    value={
                      profileData?.subscriberGroup 
                        ? subscriberGroupLabels[profileData.subscriberGroup]?.[language] || profileData.subscriberGroup
                        : (language === "tr" ? "Mesken" : "Residential")
                    } 
                    readOnly 
                    className="bg-secondary/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Aboneliklerim" : "My Subscriptions"}
                </CardTitle>
                <Link to="/onboarding">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {language === "tr" ? "Yeni Abonelik" : "New Subscription"}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          {sub.name}
                          {sub.active && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {language === "tr" ? "Aktif" : "Active"}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === "tr" ? "Tesisat No" : "Installation No"}: {sub.installationNo}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{sub.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-foreground font-medium">{sub.tariff}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Completion & Security */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-base">
                    {language === "tr" ? "Profil Durumu" : "Profile Status"}
                  </span>
                  <span className="text-2xl font-bold text-primary">{completionPercent}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={completionPercent} variant="glow" className="h-2" />
                
                <div className="space-y-2">
                  {profileItems.map((item) => (
                    <div 
                      key={item.key}
                      className={`flex items-center gap-2 text-sm ${item.completed ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                      <span className={item.completed ? 'line-through' : ''}>
                        {language === "tr" ? item.labelTr : item.labelEn}
                      </span>
                    </div>
                  ))}
                </div>

                {completionPercent < 100 && (
                  <Link to="/onboarding" className="block">
                    <Button variant="outline" className="w-full mt-2">
                      {language === "tr" ? "Eksikleri Tamamla" : "Complete Missing Items"}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" />
                  {language === "tr" ? "Güvenlik" : "Security"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  {language === "tr" ? "Sözleşmelerim" : "My Contracts"}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  {language === "tr" ? "Şifre Değiştir" : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profil;
