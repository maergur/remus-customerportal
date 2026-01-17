import { useState } from "react";
import { ArrowLeft, Send, CheckCircle, Clock, AlertCircle, User, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: 'user' | 'support';
  content: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  type: string;
  status: 'pending' | 'in_progress' | 'resolved';
  date: string;
  description: string;
  messages?: Message[];
}

interface SupportTicketDetailProps {
  ticket: Ticket;
  onBack: () => void;
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

export const SupportTicketDetail = ({ ticket, onBack }: SupportTicketDetailProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(ticket.messages || [
    {
      id: "1",
      sender: 'user',
      content: ticket.description,
      timestamp: ticket.date
    },
    {
      id: "2",
      sender: 'support',
      content: "Talebiniz alınmıştır. En kısa sürede değerlendirip size dönüş yapacağız.",
      timestamp: ticket.date
    }
  ]);

  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setMessages([...messages, message]);
    setNewMessage("");
    toast.success("Mesajınız gönderildi");
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Başvurularıma Dön</span>
      </button>

      {/* Ticket Header */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">{ticket.type}</h2>
            <p className="text-sm text-muted-foreground">{ticket.id}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.className}`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Oluşturulma: {ticket.date}
        </p>
      </div>

      {/* Messages */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30">
          <h3 className="font-semibold text-foreground">Mesajlar</h3>
        </div>
        
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Headphones className="h-5 w-5" />
                )}
              </div>
              <div className={`flex-1 max-w-[75%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-secondary text-foreground rounded-tl-sm'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        {ticket.status !== 'resolved' && (
          <div className="p-4 border-t border-border bg-secondary/30">
            <div className="flex gap-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="min-h-[80px] rounded-xl resize-none flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                className="self-end"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
