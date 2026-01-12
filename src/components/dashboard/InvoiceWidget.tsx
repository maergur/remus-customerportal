import { useState } from "react";
import { FileText, Clock, AlertTriangle, CheckCircle, Zap, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PayNowPanel } from "./PayNowPanel";

interface InvoiceWidgetProps {
  compact?: boolean;
}

const InvoiceWidget = ({ compact = false }: InvoiceWidgetProps) => {
  const { t } = useLanguage();
  const [showPayPanel, setShowPayPanel] = useState(false);
  
  const invoice = {
    month: "Aralık 2026",
    monthEn: "December 2026",
    amount: 847.50,
    previousAmount: 745.20,
    dueDate: "15 Aralık 2026",
    dueDateEn: "December 15, 2026",
    daysLeft: 5,
    consumption: 312,
    previousConsumption: 285,
    status: "pending" as "pending" | "paid" | "overdue",
  };

  const amountChange = ((invoice.amount - invoice.previousAmount) / invoice.previousAmount) * 100;
  const isAmountIncrease = amountChange > 0;

  const consumptionChange = ((invoice.consumption - invoice.previousConsumption) / invoice.previousConsumption) * 100;
  const isIncrease = consumptionChange > 0;

  const getStatusConfig = () => {
    switch (invoice.status) {
      case "paid":
        return {
          icon: CheckCircle,
          label: t("paid"),
          color: "text-primary",
          bgColor: "bg-primary/10",
        };
      case "overdue":
        return {
          icon: AlertTriangle,
          label: t("overdue"),
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        };
      default:
        return {
          icon: Clock,
          label: `${invoice.daysLeft} ${t("daysLeft")}`,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-500/10",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <>
        <div className="bg-card rounded-2xl border border-border h-full p-3 flex flex-col">
          {/* Header - ikon ve durum badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
              <span className={`text-[10px] font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>
          </div>

          {/* Başlık */}
          <div className="mb-1">
            <h3 className="font-semibold text-foreground text-sm">{t("lastInvoice")}</h3>
            <p className="text-[11px] text-muted-foreground">{invoice.month}</p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Tutar - büyük ve merkezi */}
          <div className="text-center py-3">
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              <span className="text-base font-medium ml-0.5">₺</span>
            </p>
          </div>

          {/* Alt bilgiler */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{t("dueDate")}</span>
              <span className="font-medium text-foreground">{invoice.dueDate}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Zap className="h-3 w-3 text-primary" />
                <span>Tüketim</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{invoice.consumption} kWh</span>
                <span className={`font-medium ${isIncrease ? 'text-amber-600' : 'text-primary'}`}>
                  {isIncrease ? '+' : ''}{consumptionChange.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Buton */}
          <Button 
            className="w-full" 
            size="sm" 
            onClick={() => setShowPayPanel(true)}
          >
            {t("payNow")}
          </Button>
        </div>
        
        {showPayPanel && (
          <PayNowPanel amount={invoice.amount} onClose={() => setShowPayPanel(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{t("lastInvoice")}</h3>
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
              <p className="text-xs text-muted-foreground mb-1">{t("amountDue")}</p>
              <p className="text-3xl font-bold text-foreground">
                {invoice.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-lg">₺</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">{t("dueDate")}</p>
              <p className="text-sm font-medium text-foreground">{invoice.dueDate}</p>
            </div>
          </div>


          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 gap-2" size="sm" onClick={() => setShowPayPanel(true)}>
              {t("payNow")}
            </Button>
            <Button variant="outline" size="sm" asChild className="bg-card">
              <Link to="/faturalar" className="gap-1">
                {t("details")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {showPayPanel && (
        <PayNowPanel amount={invoice.amount} onClose={() => setShowPayPanel(false)} />
      )}
    </>
  );
};

export { InvoiceWidget };
