import { ArrowLeft, Phone, ExternalLink, CheckCircle, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportCategory } from "./SupportCategories";

interface DistributionCompany {
  name: string;
  phone: string;
  faultLine: string;
  address: string;
  website: string;
  region: string;
}

interface SupportHelpContentProps {
  category: SupportCategory;
  distributionCompany: DistributionCompany;
  onBack: () => void;
  onHelpful: (helpful: boolean) => void;
}

export const SupportHelpContent = ({ 
  category, 
  distributionCompany, 
  onBack, 
  onHelpful 
}: SupportHelpContentProps) => {
  const { helpContent } = category;
  const Icon = category.icon;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Kategorilere Dön</span>
      </button>

      {/* Category Header */}
      <div className="flex items-center gap-4">
        <div className={`h-14 w-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
          <Icon className={`h-7 w-7 ${category.iconColor}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Help Content Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {helpContent.title}
          </h3>
          <ul className="space-y-3">
            {helpContent.content.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Section */}
        {helpContent.contactInfo && (
          <div className="border-t border-border bg-secondary/30 p-6">
            {helpContent.contactInfo.note && (
              <p className="text-sm text-muted-foreground mb-4">
                ℹ️ {helpContent.contactInfo.note}
              </p>
            )}
            
            {/* Distribution company card - only for distribution or both */}
            {(helpContent.contactInfo.type === 'distribution' || helpContent.contactInfo.type === 'both') && (
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Dağıtım Şirketi</p>
                <p className="font-semibold text-foreground">{distributionCompany.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  <span className="font-bold text-lg text-foreground">{distributionCompany.faultLine}</span>
                </div>
                <a 
                  href={distributionCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                >
                  Web sitesi <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <p className="text-foreground font-medium mb-4 text-center">Sorununuz çözüldü mü?</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onHelpful(true)}
            className="min-w-[180px] gap-2 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-600"
          >
            <CheckCircle className="h-4 w-4" />
            Evet, teşekkürler
          </Button>
          <Button
            size="lg"
            onClick={() => onHelpful(false)}
            className="min-w-[180px] gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Destek talebi oluştur
          </Button>
        </div>
      </div>
    </div>
  );
};
