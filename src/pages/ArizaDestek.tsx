import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, Phone, MessageSquare, Clock, CheckCircle, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const recentTickets = [
  { id: "ARZ-2026-045", type: "Elektrik Kesintisi", status: "resolved", date: "15 Ara 2026", description: "Bölgede planlı bakım çalışması" },
  { id: "ARZ-2026-032", type: "Sayaç Arızası", status: "resolved", date: "28 Kas 2026", description: "Sayaç değişimi yapıldı" },
  { id: "ARZ-2026-018", type: "Voltaj Düşüklüğü", status: "resolved", date: "10 Kas 2026", description: "Trafo bakımı tamamlandı" },
];

const ArizaDestek = () => {
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!description) {
      toast.error("Lütfen arıza açıklaması girin");
      return;
    }
    toast.success("Arıza bildiriminiz alındı. En kısa sürede size dönüş yapılacaktır.");
    setDescription("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arıza & Destek</h1>
          <p className="text-muted-foreground">Arıza bildirin veya destek talebi oluşturun</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acil Arıza Hattı</p>
                <p className="text-lg font-bold text-foreground">186</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">7/24 hizmetinizdeyiz</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp Destek</p>
                <p className="text-lg font-bold text-foreground">0532 186 00 00</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Mesaj ile destek alın</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Yakın Merkez</p>
                <p className="text-lg font-bold text-foreground">2.3 km</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Kadıköy Müşteri Merkezi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Ticket Form */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Yeni Arıza Bildirimi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Arıza Türü</label>
                <select className="w-full h-11 rounded-xl border border-border bg-secondary/50 px-4 text-foreground">
                  <option>Elektrik Kesintisi</option>
                  <option>Sayaç Arızası</option>
                  <option>Voltaj Problemi</option>
                  <option>Kablo Hasarı</option>
                  <option>Diğer</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Açıklama</label>
                <textarea 
                  className="w-full h-24 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground resize-none"
                  placeholder="Arıza hakkında detaylı bilgi verin..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button variant="default" className="w-full" onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Bildirim Gönder
              </Button>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Son Başvurularınız
            </h3>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{ticket.type}</p>
                      <p className="text-xs text-muted-foreground">{ticket.id}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <CheckCircle className="h-3 w-3" /> Çözüldü
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{ticket.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArizaDestek;
