import { useState } from "react";
import { CreditCard, Building2, RefreshCw, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface PayNowPanelProps {
  amount: number;
  onClose: () => void;
}

export function PayNowPanel({ amount, onClose }: PayNowPanelProps) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "auto">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = () => {
    toast({
      title: t("securePayment"),
      description: `${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`,
    });
    onClose();
  };

  const paymentMethods = [
    { id: "card" as const, icon: CreditCard, label: t("creditCard") },
    { id: "bank" as const, icon: Building2, label: t("bankTransfer") },
    { id: "auto" as const, icon: RefreshCw, label: t("autoPayment") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t("securePayment")}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Amount */}
        <div className="p-4 bg-primary/5 border-b border-border">
          <p className="text-sm text-muted-foreground">{t("paymentAmount")}</p>
          <p className="text-3xl font-bold text-foreground">
            {amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-lg">₺</span>
          </p>
        </div>

        {/* Payment Methods */}
        <div className="p-4 border-b border-border">
          <p className="text-sm font-medium text-foreground mb-3">{t("selectPaymentMethod")}</p>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  paymentMethod === method.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <method.icon className={`h-5 w-5 ${paymentMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${paymentMethod === method.id ? "text-primary" : "text-foreground"}`}>
                  {method.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Form */}
        {paymentMethod === "card" && (
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("cardNumber")}</label>
              <Input
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("cardHolder")}</label>
              <Input
                placeholder="JOHN DOE"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("expiryDate")}</label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("cvv")}</label>
                <Input
                  placeholder="123"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Info */}
        {paymentMethod === "bank" && (
          <div className="p-4">
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Remus Enerji A.Ş.</p>
              <p className="text-xs text-muted-foreground">IBAN: TR00 0000 0000 0000 0000 0000 00</p>
              <p className="text-xs text-muted-foreground">Açıklama: Müşteri No: 12345678</p>
            </div>
          </div>
        )}

        {/* Auto Payment Info */}
        {paymentMethod === "auto" && (
          <div className="p-4">
            <div className="bg-primary/5 rounded-xl p-4">
              <p className="text-sm text-foreground">
                Otomatik ödeme talimatı vererek faturalarınızı zamanında ödeyin.
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="p-4 border-t border-border">
          <Button className="w-full" size="lg" onClick={handlePayment}>
            <Lock className="h-4 w-4 mr-2" />
            {t("confirmPayment")}
          </Button>
        </div>
      </div>
    </div>
  );
}
