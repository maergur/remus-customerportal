import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { SupportCategoriesGrid, SupportCategory, supportCategories } from "@/components/support/SupportCategories";
import { SupportHelpContent } from "@/components/support/SupportHelpContent";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";
import { SupportTicketDetail } from "@/components/support/SupportTicketDetail";
import { RecentTickets } from "@/components/support/RecentTickets";

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

// Örnek ticket'lar
type TicketStatus = 'pending' | 'in_progress' | 'resolved';

interface Ticket {
  id: string;
  type: string;
  status: TicketStatus;
  date: string;
  description: string;
}

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
  | { type: 'ticket-detail'; ticket: typeof sampleTickets[0] };

const ArizaDestek = () => {
  const [view, setView] = useState<ViewState>({ type: 'categories' });
  
  // Müşterinin kayıtlı dağıtım firmasını al
  const customerCompany = distributionCompanies["BEDAS"];

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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yardım Merkezi</h1>
          <p className="text-muted-foreground">Size nasıl yardımcı olabiliriz?</p>
        </div>

        {/* Main Content */}
{view.type === 'categories' && (
          <>
            {/* Mobile: Active Ticket Banner */}
            {sampleTickets.filter(t => t.status === 'in_progress' || t.status === 'pending').length > 0 && (
              <div className="lg:hidden bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {sampleTickets.filter(t => t.status === 'in_progress' || t.status === 'pending').length} aktif başvurunuz var
                  </span>
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('recent-tickets-mobile');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Gör →
                </button>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Categories (2/3 width) */}
              <div className="lg:col-span-2">
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
              </div>

              {/* Right Column: Recent Tickets (1/3 width) - Sticky on Desktop */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-6">
                  <RecentTickets 
                    tickets={sampleTickets} 
                    onSelectTicket={handleSelectTicket}
                    compact
                  />
                </div>
              </div>
            </div>

            {/* Mobile: Full Tickets List */}
            <div id="recent-tickets-mobile" className="lg:hidden">
              <RecentTickets 
                tickets={sampleTickets} 
                onSelectTicket={handleSelectTicket}
              />
            </div>
          </>
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
    </DashboardLayout>
  );
};

export default ArizaDestek;
