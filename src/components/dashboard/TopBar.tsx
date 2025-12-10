import { Search, Bell, User, ChevronDown, Zap, FileText, AlertTriangle, Gift, Settings, LogOut, UserCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const notifications = [
  {
    id: 1,
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Yeni fatura oluşturuldu",
    description: "Aralık 2024 faturanız hazır",
    time: "2 saat önce",
    unread: true,
  },
  {
    id: 2,
    icon: Gift,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Referans bonusu kazandınız!",
    description: "50 TL hesabınıza tanımlandı",
    time: "1 gün önce",
    unread: true,
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
    title: "Planlı bakım bildirimi",
    description: "25 Ara 2024, 02:00-06:00",
    time: "2 gün önce",
    unread: false,
  },
  {
    id: 4,
    icon: Zap,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    title: "Enerji tasarruf ipucu",
    description: "Bu ay %12 daha az tüketim",
    time: "3 gün önce",
    unread: false,
  },
];

export function TopBar() {
  const { toggle } = useSidebarContext();
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    toast.success("Başarıyla çıkış yapıldı");
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="İşlem veya Sayfa Ara..."
            className="pl-11 bg-secondary/50 border-transparent focus:border-primary/30"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="h-5 w-5" />
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
              <span className="text-base font-semibold">Bildirimler</span>
              <Button variant="ghost" size="sm" className="text-xs text-primary h-auto py-1 px-2">
                Tümünü okundu işaretle
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
                      <p className="text-sm font-medium text-foreground truncate">{notification.title}</p>
                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm text-primary">
                Tüm bildirimleri görüntüle
              </Button>
            </div>
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
                <p className="text-xs text-muted-foreground">Tesisat No: 1234567</p>
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
            <DropdownMenuItem className="flex items-center gap-3 py-3 cursor-pointer focus:bg-secondary">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span>Profilim</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-3 cursor-pointer focus:bg-secondary">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Ayarlar</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-3 py-3 cursor-pointer focus:bg-secondary text-red-500 focus:text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
