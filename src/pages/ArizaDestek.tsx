import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HelpCircle, ClipboardList, X, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { SupportCategoriesGrid, SupportCategory, supportCategories } from "@/components/support/SupportCategories";
import { SupportHelpContent } from "@/components/support/SupportHelpContent";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";
import { SupportTicketDetail } from "@/components/support/SupportTicketDetail";
import { RecentTickets } from "@/components/support/RecentTickets";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Dağıtım firmalarının iletişim bilgileri
const distributionCompanies: Record<string, {
  name: string;
  phone: string;
  faultLine: string;
  address: string;
  website: string;
  region: string;
}> = {
  "BEDAS": {
    name: "Boğaziçi Elektrik Dağıtım A.Ş.",
    phone: "0212 324 24 24",
    faultLine: "186",
    address: "Abdurrahmangazi Mah. Güleryüz Sok. No:4 Sancaktepe/İstanbul",
    website: "https://www.bedas.com.tr",
    region: "İstanbul Avrupa Yakası",
  },
  "AYEDAS": {
    name: "İstanbul Anadolu Yakası Elektrik Dağıtım A.Ş.",
    phone: "0216 522 01 86",
    faultLine: "186",
    address: "Barbaros Mah. Şebboy Sok. No:4 Ataşehir/İstanbul",
    website: "https://www.ayedas.com.tr",
    region: "İstanbul Anadolu Yakası",
  },
};

// Ticket tipi
type TicketStatus = 'pending' | 'in_progress' | 'resolved';

interface Ticket {
  id: string;
  type: string;
  status: TicketStatus;
  date: string;
  description: string;
}

// Örnek ticket'lar
const sampleTickets: Ticket[] = [
  { 
    id: "DST-2026-045", 
    type: "Fatura İtirazı", 
    status: "in_progress", 
    date: "15 Ara 2026", 
    description: "Aralık faturası normalden yüksek geldi" 
  },
  { 
    id: "DST-2026-032", 
    type: "Sayaç Arızası", 
    status: "resolved", 
    date: "28 Kas 2026", 
    description: "Sayaç ekranı yanmıyor" 
  },
  { 
    id: "DST-2026-018", 
    type: "Tarife Değişikliği", 
    status: "resolved", 
    date: "10 Kas 2026", 
    description: "Yeşil Enerji tarifesine geçiş talebi" 
  },
];

type ViewState = 
  | { type: 'categories' }
  | { type: 'help'; category: SupportCategory }
  | { type: 'form'; category: SupportCategory }
  | { type: 'ticket-detail'; ticket: Ticket };

const ArizaDestek = () => {
  const [view, setView] = useState<ViewState>({ type: 'categories' });
  const [isTicketsSheetOpen, setIsTicketsSheetOpen] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  
  // Müşterinin kayıtlı dağıtım firmasını al
  const customerCompany = distributionCompanies["BEDAS"];
  
  // Aktif ticket'ları hesapla
  const activeTickets = sampleTickets.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const latestActiveTicket = activeTickets[0];

  const handleSelectCategory = (category: SupportCategory) => {
    setView({ type: 'help', category });
  };

  const handleHelpful = (helpful: boolean) => {
    if (helpful) {
      toast.success("Geri bildiriminiz için teşekkürler! 🎉");
      setView({ type: 'categories' });
    } else {
      // Show ticket form
      if (view.type === 'help') {
        setView({ type: 'form', category: view.category });
      }
    }
  };

  const handleBackToCategories = () => {
    setView({ type: 'categories' });
  };

  const handleBackToHelp = () => {
    if (view.type === 'form') {
      setView({ type: 'help', category: view.category });
    } else {
      setView({ type: 'categories' });
    }
  };

  const handleTicketSuccess = () => {
    setView({ type: 'categories' });
  };

  const handleSelectTicket = (ticket: typeof sampleTickets[0]) => {
    setView({ type: 'ticket-detail', ticket });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Başvurularım Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Yardım Merkezi</h1>
            <p className="text-muted-foreground">Size nasıl yardımcı olabiliriz?</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsTicketsSheetOpen(true)}
            className="flex items-center gap-2 shrink-0"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Başvurularım</span>
            {sampleTickets.length > 0 && (
              <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-medium ${
                activeTickets.length > 0 
                  ? 'bg-amber-500/10 text-amber-600' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {sampleTickets.length}
              </span>
            )}
          </Button>
        </div>

        {/* Active Ticket Alert Banner */}
        {view.type === 'categories' && latestActiveTicket && !isAlertDismissed && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activeTickets.length} başvurunuz işlemde: "{latestActiveTicket.type}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSelectTicket(latestActiveTicket)}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
              >
                İncele
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsAlertDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {view.type === 'categories' && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Konu Seçin</h2>
                <p className="text-sm text-muted-foreground">İlgili kategoriyi seçerek başlayın</p>
              </div>
            </div>
            <SupportCategoriesGrid onSelectCategory={handleSelectCategory} />
          </div>
        )}

        {view.type === 'help' && (
          <SupportHelpContent
            category={view.category}
            distributionCompany={customerCompany}
            onBack={handleBackToCategories}
            onHelpful={handleHelpful}
          />
        )}

        {view.type === 'form' && (
          <SupportTicketForm
            category={view.category}
            onBack={handleBackToHelp}
            onSuccess={handleTicketSuccess}
          />
        )}

        {view.type === 'ticket-detail' && (
          <SupportTicketDetail
            ticket={view.ticket}
            onBack={handleBackToCategories}
          />
        )}
      </div>

      {/* Tickets Sheet */}
      <Sheet open={isTicketsSheetOpen} onOpenChange={setIsTicketsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Başvurularınız
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
            <RecentTickets 
              tickets={sampleTickets} 
              onSelectTicket={(ticket) => {
                setIsTicketsSheetOpen(false);
                handleSelectTicket(ticket);
              }}
              isInSheet
            />
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default ArizaDestek;
