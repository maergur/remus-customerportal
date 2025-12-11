import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PregenerateButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handlePregenerate = async () => {
    setIsLoading(true);
    toast.info('Görseller oluşturuluyor, bu işlem birkaç dakika sürebilir...');

    try {
      const { data, error } = await supabase.functions.invoke('pregenerate-illustrations');

      if (error) {
        throw new Error(error.message);
      }

      if (data?.generated > 0) {
        toast.success(`${data.generated} yeni görsel oluşturuldu!`);
      } else if (data?.cached > 0) {
        toast.success('Tüm görseller zaten önbellekte!');
      }

      if (data?.failed?.length > 0) {
        toast.warning(`${data.failed.length} görsel oluşturulamadı`);
      }

      setIsDone(true);
    } catch (err) {
      console.error('Pregenerate error:', err);
      toast.error('Görseller oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Check className="h-4 w-4 text-primary" />
        Görseller Hazır
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handlePregenerate}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Üretiliyor...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Görselleri Önceden Üret
        </>
      )}
    </Button>
  );
};
