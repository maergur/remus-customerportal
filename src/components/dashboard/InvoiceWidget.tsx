import { Receipt, Clock, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const InvoiceWidget = () => {
  const invoice = {
    month: "Aralık 2024",
    amount: 847.50,
    dueDate: "15 Aralık 2024",
    daysLeft: 5,
    consumption: 312,
    previousConsumption: 285,
    status: "pending" as "pending" | "paid" | "overdue",
  };

  const consumptionChange = ((invoice.consumption - invoice.previousConsumption) / invoice.previousConsumption) * 100;

  const getStatusConfig = () => {
    switch (invoice.status) {
      case "paid":
        return {
          icon: CheckCircle,
          label: "Ödendi",
          color: "text-primary",
          bgColor: "bg-primary/10",
        };
      case "overdue":
        return {
          icon: AlertTriangle,
          label: "Gecikmiş",
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        };
      default:
        return {
          icon: Clock,
          label: `${invoice.daysLeft} gün kaldı`,
          color: "text-amber-600",
          bgColor: "bg-amber-500/10",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Son Fatura</h3>
              <p className="text-xs text-muted-foreground">{invoice.month}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bgColor}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
            <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="p-4 pb-3">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Ödenecek Tutar</p>
            <p className="text-3xl font-bold text-foreground">
              {invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-lg">₺</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Son Ödeme</p>
            <p className="text-sm font-medium text-foreground">{invoice.dueDate}</p>
          </div>
        </div>

        {/* Consumption Info */}
        <div className="bg-white dark:bg-background/50 rounded-xl p-3 border border-border/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Tüketim</span>
            <span className={`text-xs font-medium ${consumptionChange > 0 ? 'text-destructive' : 'text-primary'}`}>
              {consumptionChange > 0 ? '+' : ''}{consumptionChange.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={(invoice.consumption / 400) * 100} className="h-2 flex-1" />
            <span className="text-sm font-semibold text-foreground">{invoice.consumption} kWh</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 gap-2" size="sm">
            Şimdi Öde
          </Button>
          <Button variant="outline" size="sm" asChild className="bg-white dark:bg-card">
            <Link to="/faturalar" className="gap-1">
              Detay
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { InvoiceWidget };
