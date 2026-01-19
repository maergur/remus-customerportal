import { Search, Bell, User, ChevronDown, Zap, FileText, AlertTriangle, Gift, Settings, LogOut, Menu, Sun, Moon, Languages, CheckCircle2, MapPin, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInstallation } from "@/contexts/InstallationContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearSession } from "@/lib/mockCustomers";

const notifications = [
  {
    id: 1,
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: { tr: "Yeni fatura oluşturuldu", en: "New invoice created" },
    description: { tr: "Aralık 2026 faturanız hazır", en: "Your December 2026 invoice is ready" },
    time: { tr: "2 saat önce", en: "2 hours ago" },
    unread: true,
  },
  {
    id: 2,
    icon: Gift,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: { tr: "Referans bonusu kazandınız!", en: "You earned a referral bonus!" },
    description: { tr: "50 TL hesabınıza tanımlandı", en: "50 TL added to your account" },
    time: { tr: "1 gün önce", en: "1 day ago" },
    unread: true,
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    title: { tr: "Planlı bakım bildirimi", en: "Scheduled maintenance notice" },
    description: { tr: "25 Ara 2026, 02:00-06:00", en: "Dec 25, 2026, 02:00-06:00" },
    time: { tr: "2 gün önce", en: "2 days ago" },
    unread: false,
  },
  {
    id: 4,
    icon: Zap,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    title: { tr: "Enerji tasarruf ipucu", en: "Energy saving tip" },
    description: { tr: "Bu ay %12 daha az tüketim", en: "12% less consumption this month" },
    time: { tr: "3 gün önce", en: "3 days ago" },
    unread: false,
  },
];

export function TopBar() {
  const { toggle } = useSidebarContext();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { installations, selectedInstallation, setSelectedInstallation } = useInstallation();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => n.unread).length;

  const [completionPercent, setCompletionPercent] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const items = [
          !!(data.personalInfo?.firstName && data.personalInfo?.lastName && data.personalInfo?.email),
          !!data.phoneVerified,
          !!data.addressConfirmed,
          !!data.selectedTariff,
          !!data.contractAccepted,
        ];
        const completed = items.filter(Boolean).length;
        setCompletionPercent(Math.round((completed / items.length) * 100));
      } catch {
        setCompletionPercent(0);
      }
    }
  }, []);

  const isComplete = completionPercent === 100;

  const handleLogout = () => {
    clearSession();
    toast.success(language === "tr" ? "Başarıyla çıkış yapıldı" : "Successfully logged out");
    navigate('/giris');
  };

  const handleProfileClick = () => {
    navigate('/profil');
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden flex-shrink-0"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === "tr" ? "Ara..." : "Search..."}
            className="pl-9 w-48 lg:w-64 bg-secondary/50 border-transparent focus:border-primary/30 h-9"
          />
        </div>

        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Profile Completion Bar */}
        <button 
          onClick={handleProfileClick}
          className="hidden sm:flex items-center gap-2 bg-secondary/50 hover:bg-secondary/80 transition-colors rounded-lg px-3 py-2 flex-shrink-0"
        >
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-primary">{Math.round(completionPercent / 20)}</span>
            </div>
          )}
          <span className="text-sm text-foreground whitespace-nowrap hidden lg:inline">
            {isComplete 
              ? (language === "tr" ? "Profil Tamamlandı" : "Profile Complete")
              : (language === "tr" ? "Profilimi Tamamla" : "Complete Profile")
            }
          </span>
          <div className="w-16 lg:w-20">
            <Progress value={completionPercent} variant="glow" className="h-1.5" />
          </div>
          <span className="text-xs font-bold text-primary">{completionPercent}%</span>
        </button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>


        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border shadow-lg z-50">
            <DropdownMenuLabel className="flex items-center justify-between py-3">
              <span className="text-base font-semibold">{t("notifications")}</span>
              <Button variant="ghost" size="sm" className="text-xs text-primary h-auto py-1 px-2">
                {language === "tr" ? "Tümünü okundu işaretle" : "Mark all as read"}
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-3 cursor-pointer focus:bg-secondary ${notification.unread ? 'bg-primary/5' : ''}`}
                >
                  <div className={`h-10 w-10 rounded-xl ${notification.iconBg} flex items-center justify-center shrink-0`}>
                    <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{notification.title[language]}</p>
                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{notification.description[language]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time[language]}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm text-primary">
                {language === "tr" ? "Tüm bildirimleri görüntüle" : "View all notifications"}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Installation Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:flex items-center gap-2 bg-secondary/50 hover:bg-secondary/80 transition-colors rounded-lg px-3 py-2">
              <Zap className="h-4 w-4 text-primary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">{language === "tr" ? "Tesisat" : "Installation"}</p>
                <p className="text-sm font-medium text-foreground">{selectedInstallation.name}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-card border-border shadow-lg z-50">
            <DropdownMenuLabel className="py-2">
              <span className="text-sm font-semibold">{language === "tr" ? "Tesisat Seç" : "Select Installation"}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {installations.map((inst) => (
              <DropdownMenuItem
                key={inst.id}
                className="flex items-start gap-3 p-3 cursor-pointer focus:bg-secondary"
                onClick={() => {
                  setSelectedInstallation(inst);
                  toast.success(language === "tr" ? `${inst.name} tesisatına geçildi` : `Switched to ${inst.name}`);
                }}
              >
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  selectedInstallation.id === inst.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                }`}>
                  {selectedInstallation.id === inst.id && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{inst.name}</p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {inst.address.split(',')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">No: {inst.installationNo}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-center gap-2 py-2 cursor-pointer text-primary"
              onClick={() => navigate('/profil')}
            >
              <span className="text-sm">{language === "tr" ? "Tüm Tesisatları Yönet" : "Manage All Installations"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 lg:gap-3 lg:pl-4 lg:border-l border-border hover:bg-secondary/50 rounded-lg px-2 lg:px-3 py-2 transition-colors cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-foreground">Ahmet Yılmaz</p>
                <p className="text-xs text-muted-foreground">ahmet@email.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg z-50">
            <DropdownMenuLabel className="py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Ahmet Yılmaz</p>
                  <p className="text-xs text-muted-foreground">ahmet@email.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-3 py-3 cursor-pointer focus:bg-secondary"
              onClick={handleProfileClick}
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>{language === "tr" ? "Profil & Ayarlar" : "Profile & Settings"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center justify-between py-3 cursor-pointer focus:bg-secondary"
              onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            >
              <div className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span>{language === "tr" ? "Dil" : "Language"}</span>
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                {language === "tr" ? "TR" : "EN"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-3 py-3 cursor-pointer focus:bg-secondary text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>{language === "tr" ? "Çıkış Yap" : "Log Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
