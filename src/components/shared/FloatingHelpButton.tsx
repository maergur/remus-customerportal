import { useState } from 'react';
import { HelpCircle, Phone, MessageSquare, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popup */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-64 bg-card border rounded-xl shadow-lg p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium text-sm">Yardıma mı ihtiyacınız var?</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <a
              href="tel:186"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">186</p>
                <p className="text-xs text-muted-foreground">7/24 Çağrı Merkezi</p>
              </div>
            </a>

            <a
              href="https://wa.me/905321860000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Hızlı mesajlaşma</p>
              </div>
            </a>

            <a
              href="mailto:destek@remusenerji.com"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">E-posta</p>
                <p className="text-xs text-muted-foreground">destek@remusenerji.com</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-12 h-12 rounded-full shadow-lg transition-all duration-200',
          isOpen 
            ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110'
        )}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <HelpCircle className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};
