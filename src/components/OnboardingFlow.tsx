import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2,
  User,
  Users,
  UsersRound,
  Home,
  Building,
  Building2,
  Castle,
  Flame,
  Zap,
  Thermometer,
  Recycle,
  TrendingDown,
  BarChart3,
  Sun,
  Leaf,
  Sunrise,
  Moon,
  Scale,
  HelpCircle,
  BatteryCharging,
  Car,
  Clock,
  Ban,
  Sparkles,
  BadgePercent,
  ShieldCheck,
  Headphones,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionOption {
  value: string;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
}

interface Question {
  id: string;
  title: string;
  options: QuestionOption[];
  multiSelect?: boolean;
}

const questions: Question[] = [
  {
    id: 'householdSize',
    title: 'Evde kaç kişi yaşıyor?',
    options: [
      { value: '1', label: '1 kişi', icon: User, iconColor: 'text-blue-500' },
      { value: '2', label: '2 kişi', icon: Users, iconColor: 'text-indigo-500' },
      { value: '3-4', label: '3–4 kişi', icon: UsersRound, iconColor: 'text-violet-500' },
      { value: '5+', label: '5+', icon: UsersRound, iconColor: 'text-purple-500' },
    ],
  },
  {
    id: 'homeSize',
    title: 'Eviniz ne kadar büyük?',
    options: [
      { value: '<75', label: "75m²'ye kadar", icon: Home, iconColor: 'text-emerald-500' },
      { value: '75-120', label: '75–120m²', icon: Building, iconColor: 'text-teal-500' },
      { value: '120-200', label: '120–200m²', icon: Building2, iconColor: 'text-cyan-500' },
      { value: '200+', label: '200m²+', icon: Castle, iconColor: 'text-sky-500' },
    ],
  },
  {
    id: 'heatingType',
    title: 'Isınmak için ne kullanıyorsunuz?',
    options: [
      { value: 'gas', label: 'Doğalgaz', icon: Flame, iconColor: 'text-orange-500' },
      { value: 'electric', label: 'Elektrikli ısıtıcı', icon: Zap, iconColor: 'text-yellow-500' },
      { value: 'heatpump', label: 'Isı pompası/Klima', icon: Thermometer, iconColor: 'text-blue-500' },
      { value: 'other', label: 'Diğer', icon: Recycle, iconColor: 'text-green-500' },
    ],
  },
  {
    id: 'interests',
    title: 'En çok neyi merak ediyorsunuz?',
    multiSelect: true,
    options: [
      { value: 'reduce-bill', label: 'Faturamı nasıl düşürürüm', icon: TrendingDown, iconColor: 'text-emerald-500' },
      { value: 'ptf-optimize', label: 'PTF saatlerinde tüketimi optimize etmek', icon: BarChart3, iconColor: 'text-blue-500' },
      { value: 'solar', label: 'Güneş paneli yatırımı', icon: Sun, iconColor: 'text-amber-500' },
      { value: 'carbon', label: 'Karbon ayak izimi takip etmek', icon: Leaf, iconColor: 'text-green-500' },
    ],
  },
  {
    id: 'peakUsage',
    title: 'Tüketiminiz hangi saatlerde yoğun?',
    options: [
      { value: 'day', label: 'Gündüz', icon: Sunrise, iconColor: 'text-amber-500' },
      { value: 'night', label: 'Gece', icon: Moon, iconColor: 'text-indigo-500' },
      { value: 'balanced', label: 'Dengeli', icon: Scale, iconColor: 'text-slate-500' },
      { value: 'unknown', label: 'Bilmiyorum', icon: HelpCircle, iconColor: 'text-gray-400' },
    ],
  },
  {
    id: 'electricVehicle',
    title: 'Elektrikli araç kullanıyor musunuz?',
    options: [
      { value: 'daily', label: 'Evet her gün', icon: BatteryCharging, iconColor: 'text-green-500' },
      { value: 'sometimes', label: 'Evet ara sıra', icon: Car, iconColor: 'text-blue-500' },
      { value: 'planned', label: 'Yok ama planlıyorum', icon: Clock, iconColor: 'text-amber-500' },
      { value: 'no', label: 'Hayır', icon: Ban, iconColor: 'text-gray-400' },
    ],
  },
  {
    id: 'choiceReason',
    title: 'Bizi tercih etme sebebiniz nedir?',
    multiSelect: true,
    options: [
      { value: 'innovation', label: 'Yenilikçi teknoloji', icon: Sparkles, iconColor: 'text-violet-500' },
      { value: 'price', label: 'Uygun fiyat', icon: BadgePercent, iconColor: 'text-emerald-500' },
      { value: 'trust', label: 'Güvenilirlik', icon: ShieldCheck, iconColor: 'text-blue-500' },
      { value: 'support', label: 'Müşteri desteği', icon: Headphones, iconColor: 'text-pink-500' },
    ],
  },
];

const questionLabels: Record<string, string> = {
  householdSize: 'Hane Büyüklüğü',
  homeSize: 'Ev Büyüklüğü',
  heatingType: 'Isınma Tipi',
  interests: 'İlgi Alanları',
  peakUsage: 'Yoğun Tüketim Saati',
  electricVehicle: 'Elektrikli Araç',
  choiceReason: 'Tercih Sebebi',
};

interface OnboardingFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

type Answers = Record<string, string | string[]>;

export function OnboardingFlow({ open, onOpenChange, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showSummary, setShowSummary] = useState(false);

  const totalSteps = questions.length;
  const progress = showSummary ? 100 : ((currentStep + 1) / totalSteps) * 100;

  const currentQuestion = questions[currentStep];

  const handleSelect = (value: string) => {
    if (currentQuestion.multiSelect) {
      const currentValues = (answers[currentQuestion.id] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      setAnswers({ ...answers, [currentQuestion.id]: newValues });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
      setTimeout(() => handleNext(), 150);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveAndShowSummary();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveAndShowSummary();
    }
  };

  const saveAndShowSummary = () => {
    localStorage.setItem('userProfile', JSON.stringify(answers));
    setShowSummary(true);
  };

  const handleGoToDashboard = () => {
    onOpenChange(false);
    onComplete?.();
    resetFlow();
  };

  const resetFlow = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowSummary(false);
  };

  const getAnswerLabel = (questionId: string, answerValue: string | string[]) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return '';

    if (Array.isArray(answerValue)) {
      return answerValue
        .map((v) => {
          const option = question.options.find((o) => o.value === v);
          return option ? option.label : v;
        })
        .join(', ');
    }

    const option = question.options.find((o) => o.value === answerValue);
    return option ? option.label : answerValue;
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  const canProceedMultiSelect =
    currentQuestion?.multiSelect &&
    Array.isArray(answers[currentQuestion.id]) &&
    (answers[currentQuestion.id] as string[]).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl">
            {showSummary ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Profiliniz Hazır!
              </span>
            ) : (
              'Profilinizi Tamamlayın'
            )}
          </DialogTitle>
          {!showSummary && (
            <DialogDescription>
              Size özel öneriler sunabilmemiz için birkaç soru sormak istiyoruz.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{showSummary ? 'Tamamlandı' : `${currentStep + 1} / ${totalSteps}`}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {showSummary ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Cevaplarınız kaydedildi. İşte profilinizin özeti:
              </p>

              <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
                {Object.entries(answers).map(([questionId, answer]) => (
                  <div key={questionId} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {questionLabels[questionId]}
                    </span>
                    <span className="text-sm font-medium">
                      {getAnswerLabel(questionId, answer)}
                    </span>
                  </div>
                ))}
                {Object.keys(answers).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Henüz cevap verilmedi
                  </p>
                )}
              </div>

              <Button onClick={handleGoToDashboard} className="w-full gap-2">
                Dashboard'a git
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center py-2">
                {currentQuestion.title}
              </h3>

              {currentQuestion.multiSelect && (
                <p className="text-sm text-muted-foreground text-center -mt-2">
                  Birden fazla seçebilirsiniz
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200',
                        'hover:border-primary/50 hover:bg-primary/5 hover:shadow-md',
                        isSelected(option.value)
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border bg-background'
                      )}
                    >
                      <div
                        className={cn(
                          'h-12 w-12 rounded-xl flex items-center justify-center transition-colors',
                          isSelected(option.value)
                            ? 'bg-primary/20'
                            : 'bg-secondary'
                        )}
                      >
                        <Icon className={cn('h-6 w-6', option.iconColor || 'text-primary')} />
                      </div>
                      <span className="text-sm font-medium text-center leading-tight">
                        {option.label}
                      </span>
                      {isSelected(option.value) && (
                        <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              {currentQuestion.multiSelect && canProceedMultiSelect && (
                <Button onClick={handleNext} className="w-full gap-2">
                  Devam Et
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              <div className="flex items-center justify-between pt-2">
                {currentStep > 0 ? (
                  <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Geri
                  </Button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleSkip}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Şimdilik geç
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
