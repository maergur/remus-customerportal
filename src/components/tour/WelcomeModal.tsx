import { useEffect, useState } from 'react';
import { useTour } from '@/contexts/TourContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

export function WelcomeModal() {
  const { hasCompletedTour, startTour, markTourComplete } = useTour();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show welcome modal only if tour hasn't been completed
    // and user is logged in (has session)
    const session = localStorage.getItem('authSession');
    if (!hasCompletedTour && session) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour]);

  const handleStartTour = () => {
    setIsOpen(false);
    startTour();
  };

  const handleSkip = () => {
    setIsOpen(false);
    markTourComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl">
            {language === 'tr' ? 'Hoş Geldiniz! 👋' : 'Welcome! 👋'}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {language === 'tr' 
              ? 'Remus Enerji müşteri portalına hoş geldiniz. Portalı keşfetmeniz için kısa bir tur hazırladık.' 
              : 'Welcome to Remus Energy customer portal. We\'ve prepared a short tour to help you explore.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {language === 'tr' ? '2 dakikalık interaktif tur' : '2-minute interactive tour'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'tr' ? 'Tüm özellikleri keşfedin' : 'Discover all features'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleStartTour} className="w-full gap-2">
            {language === 'tr' ? 'Turu Başlat' : 'Start Tour'}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="w-full">
            {language === 'tr' ? 'Şimdi Değil' : 'Maybe Later'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
