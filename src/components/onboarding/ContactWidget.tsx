import { Phone, MessageSquare, Mail } from 'lucide-react';

interface ContactWidgetProps {
  title: string;
  compact?: boolean;
}

export const ContactWidget = ({ title, compact = false }: ContactWidgetProps) => (
  <div className={`bg-muted/50 rounded-lg ${compact ? 'p-3' : 'p-4 mt-4'}`}>
    <p className={`font-medium text-center ${compact ? 'text-xs mb-2' : 'text-sm mb-3'}`}>{title}</p>
    <div className={`flex flex-wrap justify-center gap-4 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-primary" />
        <span className="font-medium">186</span>
      </div>
      <a 
        href="https://wa.me/905321860000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-green-600 transition-colors"
      >
        <MessageSquare className="w-4 h-4 text-green-500" />
        <span>WhatsApp</span>
      </a>
      <a 
        href="mailto:destek@remusenerji.com"
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <Mail className="w-4 h-4 text-muted-foreground" />
        <span>E-posta</span>
      </a>
    </div>
  </div>
);
