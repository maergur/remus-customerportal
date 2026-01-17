import { useState } from "react";
import { ArrowLeft, Send, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SupportCategory } from "./SupportCategories";

interface SupportTicketFormProps {
  category: SupportCategory;
  onBack: () => void;
  onSuccess: () => void;
}

export const SupportTicketForm = ({ category, onBack, onSuccess }: SupportTicketFormProps) => {
  const [subCategory, setSubCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Icon = category.icon;
  const maxMessageLength = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subCategory) {
      toast.error("Lütfen konu seçin");
      return;
    }
    if (!subject.trim()) {
      toast.error("Lütfen başlık girin");
      return;
    }
    if (!message.trim()) {
      toast.error("Lütfen mesajınızı yazın");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Destek talebiniz oluşturuldu! En kısa sürede size dönüş yapılacaktır.");
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Geri Dön</span>
      </button>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/30 border-b border-border p-6">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${category.iconColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Destek Kaydı Oluştur</h2>
              <p className="text-sm text-muted-foreground">{category.title}</p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                Adım 01
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Sub Category */}
          {category.subCategories && category.subCategories.length > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Destek Konusu
              </label>
              <Select value={subCategory} onValueChange={setSubCategory}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Konu seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {category.subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Başlık
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Talebinizi kısaca özetleyin..."
              className="h-12 rounded-xl"
            />
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Mesajınız
              </label>
              <span className="text-xs text-muted-foreground">
                {message.length}/{maxMessageLength}
              </span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxMessageLength))}
              placeholder="Mesajınızı buraya yazın..."
              className="min-h-[120px] rounded-xl resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Gönderiliyor...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Destek Kaydı Oluştur
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
