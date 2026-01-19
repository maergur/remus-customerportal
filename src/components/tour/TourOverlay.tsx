import { useEffect, useState, useCallback } from 'react';
import { useTour, tourSteps } from '@/contexts/TourContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay() {
  const { 
    isActive, 
    currentStep, 
    currentStepData, 
    totalSteps,
    nextStep, 
    prevStep, 
    skipTour,
    endTour 
  } = useTour();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const calculatePosition = useCallback(() => {
    if (!currentStepData) return;

    // Special case for welcome and complete steps
    if (currentStepData.target === 'body') {
      setTargetRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
      });
      return;
    }

    const element = document.querySelector(currentStepData.target);
    if (!element) {
      // If element not found, center the tooltip
      setTargetRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 200,
      });
      return;
    }

    const rect = element.getBoundingClientRect();
    const padding = 8;
    
    setTargetRect({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    // Calculate tooltip position based on placement
    const tooltipWidth = 400;
    const tooltipHeight = 280; // Increased for actual tooltip size
    const gap = 16;

    let top = 0;
    let left = 0;
    let placement = currentStepData.placement || 'bottom';

    // Smart placement: if preferred placement would go off-screen, try opposite
    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    if (placement === 'bottom' && spaceBottom < tooltipHeight + gap && spaceTop > spaceBottom) {
      placement = 'top';
    } else if (placement === 'top' && spaceTop < tooltipHeight + gap && spaceBottom > spaceTop) {
      placement = 'bottom';
    } else if (placement === 'right' && spaceRight < tooltipWidth + gap && spaceLeft > spaceRight) {
      placement = 'left';
    } else if (placement === 'left' && spaceLeft < tooltipWidth + gap && spaceRight > spaceLeft) {
      placement = 'right';
    }

    switch (placement) {
      case 'top':
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        break;
      default:
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }

    // Keep tooltip within viewport
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

    setTooltipPosition({ top, left });
  }, [currentStepData]);

  // Navigate to required route when step changes
  useEffect(() => {
    if (!isActive || !currentStepData?.route) return;
    
    if (location.pathname !== currentStepData.route) {
      navigate(currentStepData.route);
    }
  }, [isActive, currentStepData, location.pathname, navigate]);

  // Calculate position when step changes or window resizes
  useEffect(() => {
    if (!isActive) return;

    // Small delay to allow navigation and rendering
    const timer = setTimeout(calculatePosition, 100);

    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isActive, currentStep, calculatePosition]);

  if (!isActive || !currentStepData) return null;

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const title = language === 'tr' ? currentStepData.title : currentStepData.titleEn;
  const content = language === 'tr' ? currentStepData.content : currentStepData.contentEn;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isWelcomeOrComplete = currentStepData.target === 'body';

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Overlay with spotlight using clip-path */}
      {targetRect ? (
        <>
          {/* Dark overlay with cutout for spotlight */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="spotlight-mask">
                {/* White = visible (dark overlay), Black = hidden (spotlight hole) */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={targetRect.left}
                  y={targetRect.top}
                  width={targetRect.width}
                  height={targetRect.height}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.7)"
              mask="url(#spotlight-mask)"
            />
          </svg>
          
          {/* Spotlight ring around the highlighted element */}
          <div
            className="absolute rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background/50 transition-all duration-300 pointer-events-auto"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            }}
          />
        </>
      ) : (
        /* Full dark overlay when no target */
        <div className="absolute inset-0 bg-black/70" />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute z-10 w-[400px] max-w-[calc(100vw-32px)] bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 pointer-events-auto",
          isWelcomeOrComplete && "text-center"
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {language === 'tr' ? 'Tur' : 'Tour'} {currentStep + 1}/{totalSteps}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={skipTour}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isWelcomeOrComplete && (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          )}
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground">{content}</p>
        </div>

        {/* Progress */}
        <div className="px-6 pb-2">
          <Progress value={progress} className="h-1" />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={skipTour}
            className="text-muted-foreground"
          >
            {language === 'tr' ? 'Turu Atla' : 'Skip Tour'}
          </Button>
          
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                {language === 'tr' ? 'Geri' : 'Back'}
              </Button>
            )}
            <Button
              size="sm"
              onClick={isLastStep ? endTour : nextStep}
              className="gap-1"
            >
              {isLastStep 
                ? (language === 'tr' ? 'Bitir' : 'Finish')
                : (language === 'tr' ? 'İleri' : 'Next')
              }
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
