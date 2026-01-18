import { Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

interface Ticket {
  id: string;
  type: string;
  status: 'pending' | 'in_progress' | 'resolved';
  date: string;
  description: string;
}

interface RecentTicketsProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  isInSheet?: boolean;
}

const statusConfig = {
  pending: {
    label: "Beklemede",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600"
  },
  in_progress: {
    label: "İşlemde",
    icon: AlertCircle,
    className: "bg-blue-500/10 text-blue-600"
  },
  resolved: {
    label: "Çözüldü",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-600"
  }
};

export const RecentTickets = ({ tickets, onSelectTicket, isInSheet = false }: RecentTicketsProps) => {
  if (tickets.length === 0) {
    return (
      <div className={`${isInSheet ? 'p-6' : 'bg-card rounded-2xl border border-border p-6'} text-center`}>
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Henüz bir destek kaydınız bulunmuyor</p>
      </div>
    );
  }

  // Sheet içindeyken sadece liste göster
  if (isInSheet) {
    return (
      <div className="divide-y divide-border">
        {tickets.map((ticket) => {
          const status = statusConfig[ticket.status];
          const StatusIcon = status.icon;
          
          return (
            <button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className="w-full p-4 hover:bg-secondary/30 transition-colors text-left group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">{ticket.type}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{ticket.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{ticket.date}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Normal görünüm (kart içinde)
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Son Başvurularınız
        </h3>
      </div>
      <div className="divide-y divide-border">
        {tickets.map((ticket) => {
          const status = statusConfig[ticket.status];
          const StatusIcon = status.icon;
          
          return (
            <button
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className="w-full p-4 hover:bg-secondary/30 transition-colors text-left group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">{ticket.type}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{ticket.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{ticket.date}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
