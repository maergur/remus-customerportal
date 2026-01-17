import { Clock, CheckCircle, AlertCircle, ChevronRight, Ticket } from "lucide-react";

interface TicketData {
  id: string;
  type: string;
  status: 'pending' | 'in_progress' | 'resolved';
  date: string;
  description: string;
}

interface RecentTicketsProps {
  tickets: TicketData[];
  onSelectTicket: (ticket: TicketData) => void;
  compact?: boolean;
}

const statusConfig = {
  pending: {
    label: "Beklemede",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  },
  in_progress: {
    label: "İşlemde",
    icon: AlertCircle,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
  resolved: {
    label: "Çözüldü",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
};

export const RecentTickets = ({ tickets, onSelectTicket, compact = false }: RecentTicketsProps) => {
  // In compact mode, show max 4 tickets
  const displayTickets = compact ? tickets.slice(0, 4) : tickets;
  const hasMore = compact && tickets.length > 4;
  const activeCount = tickets.filter(t => t.status === 'in_progress' || t.status === 'pending').length;

  if (tickets.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Henüz bir destek kaydınız bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Ticket className="h-5 w-5 text-muted-foreground" />
            Son Başvurularınız
          </h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              {activeCount} aktif
            </span>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className="divide-y divide-border">
        {displayTickets.map((ticket) => {
          const status = statusConfig[ticket.status];
          const StatusIcon = status.icon;
          
          if (compact) {
            // Compact view for sidebar
            return (
              <button
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="w-full p-3 hover:bg-secondary/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-lg ${status.className.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-').split(' ')[0]} flex items-center justify-center`}>
                    <StatusIcon className={`h-4 w-4 ${status.className.split(' ').slice(1).join(' ')}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ticket.type}</p>
                    <p className="text-xs text-muted-foreground">{ticket.date}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                </div>
              </button>
            );
          }

          // Full view
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

      {/* Show more link in compact mode */}
      {hasMore && (
        <div className="p-3 border-t border-border bg-secondary/20">
          <button className="w-full text-center text-sm font-medium text-primary hover:underline">
            Tümünü Gör ({tickets.length})
          </button>
        </div>
      )}
    </div>
  );
};
