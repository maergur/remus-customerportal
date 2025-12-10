import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="h-16 bg-card/50 backdrop-blur-lg border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="İşlem veya Sayfa Ara..."
          className="pl-11 bg-secondary/30 border-transparent focus:border-primary/30"
        />
      </div>

      {/* Notifications */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
        </Button>
      </div>
    </header>
  );
}
