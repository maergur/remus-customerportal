import { Home, BarChart3, FileText, AlertTriangle, Zap, X, Gift } from "lucide-react";
import remusLogo from "@/assets/remus-logo.svg";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useSidebarContext } from "@/contexts/SidebarContext";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Tüketim Analizi", href: "/tuketim-analizi" },
  { icon: FileText, label: "Faturalar & Ödemeler", href: "/faturalar" },
  { icon: AlertTriangle, label: "Arıza & Destek", href: "/ariza-destek" },
  { icon: Zap, label: "Tarifeler", href: "/tarifeler" },
  { icon: Gift, label: "Arkadaşını Getir", href: "/referans" },
];
export function Sidebar() {
  const { isOpen, close } = useSidebarContext();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Close Button */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-sidebar-border">
          <img src={remusLogo} alt="Remus Enerji" className="h-7 w-auto" />
          <button 
            onClick={close}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              onClick={close}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2024 Remus Enerji
          </div>
        </div>
      </aside>
    </>
  );
}
