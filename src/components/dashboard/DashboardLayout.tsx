import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { FloatingHelpButton } from "@/components/shared/FloatingHelpButton";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:ml-64 transition-all duration-300 min-h-screen flex flex-col">
          <TopBar />
          <div className="p-4 lg:p-6 flex-1 flex flex-col">
            {children}
          </div>
        </main>
        <FloatingHelpButton />
      </div>
    </SidebarProvider>
  );
}
