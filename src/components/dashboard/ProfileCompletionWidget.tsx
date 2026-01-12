import { User, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface ProfileItem {
  key: string;
  labelTr: string;
  labelEn: string;
  completed: boolean;
}

export function ProfileCompletionWidget() {
  const { language } = useLanguage();
  const [profileItems, setProfileItems] = useState<ProfileItem[]>([]);
  const [completionPercent, setCompletionPercent] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        const items: ProfileItem[] = [
          {
            key: 'personalInfo',
            labelTr: 'Kişisel Bilgiler',
            labelEn: 'Personal Info',
            completed: !!(data.personalInfo?.firstName && data.personalInfo?.lastName && data.personalInfo?.email),
          },
          {
            key: 'phone',
            labelTr: 'Telefon Doğrulama',
            labelEn: 'Phone Verification',
            completed: !!data.phoneVerified,
          },
          {
            key: 'address',
            labelTr: 'Adres Bilgileri',
            labelEn: 'Address Info',
            completed: !!data.addressConfirmed,
          },
          {
            key: 'tariff',
            labelTr: 'Tarife Seçimi',
            labelEn: 'Tariff Selection',
            completed: !!data.selectedTariff,
          },
          {
            key: 'contract',
            labelTr: 'Sözleşme Onayı',
            labelEn: 'Contract Approval',
            completed: !!data.contractAccepted,
          },
        ];

        setProfileItems(items);
        
        const completedCount = items.filter(item => item.completed).length;
        setCompletionPercent(Math.round((completedCount / items.length) * 100));
      } catch {
        setProfileItems([]);
        setCompletionPercent(0);
      }
    }
  }, []);

  const isComplete = completionPercent === 100;

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">
              {language === "tr" ? "Profilimi Tamamla" : "Complete My Profile"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isComplete 
                ? (language === "tr" ? "Tebrikler! Profiliniz tamamlandı" : "Congratulations! Profile complete")
                : (language === "tr" ? `${completionPercent}% tamamlandı` : `${completionPercent}% complete`)
              }
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-primary">{completionPercent}%</span>
      </div>

      {/* Progress Bar */}
      <Progress value={completionPercent} variant="glow" className="h-2 mb-4" />

      {/* Checklist */}
      <div className="space-y-2">
        {profileItems.map((item) => (
          <div 
            key={item.key}
            className={`flex items-center gap-2 text-sm ${item.completed ? 'text-muted-foreground' : 'text-foreground'}`}
          >
            {item.completed ? (
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            )}
            <span className={item.completed ? 'line-through' : ''}>
              {language === "tr" ? item.labelTr : item.labelEn}
            </span>
          </div>
        ))}
      </div>

      {/* Action Link */}
      {!isComplete && (
        <Link to="/onboarding" className="block mt-4">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors">
            <span className="text-sm font-medium text-primary">
              {language === "tr" ? "Eksikleri Tamamla" : "Complete Missing Items"}
            </span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </div>
        </Link>
      )}
    </div>
  );
}
