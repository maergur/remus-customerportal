import { Home, BarChart3, Receipt, AlertTriangle, Leaf, User } from "lucide-react";
import remusLogo from "@/assets/remus-logo.svg";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "#", active: true },
  { icon: BarChart3, label: "Tüketim Analizi", href: "#" },
  { icon: Receipt, label: "Faturalar & Ödemeler", href: "#" },
  { icon: AlertTriangle, label: "Arıza & Destek", href: "#" },
  { icon: Leaf, label: "Yeşil Tarifeler", href: "#" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <img src={remusLogo} alt="Remus Enerji" className="h-8 w-auto" />
      </div>

      {/* User Profile */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-sidebar-accent">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Ahmet Yılmaz</p>
            <p className="text-xs text-muted-foreground">Tesisat No: 1234567</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              item.active
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", item.active && "text-primary")} />
            <span>{item.label}</span>
            {item.active && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 Remus Enerji
        </div>
      </div>
    </aside>
  );
}
