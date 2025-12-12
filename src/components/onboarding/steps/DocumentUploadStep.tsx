import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, X, FileCheck, Image } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ContactWidget } from '@/components/onboarding/ContactWidget';

interface DocumentUploadProps {
  label: string;
  description: string;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  required?: boolean;
}

const DocumentUpload = ({ label, description, file, onUpload, onRemove, required }: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }
      onUpload(selectedFile);
      toast.success(`${label} yüklendi`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-4 transition-all',
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        file && 'border-primary bg-primary/5'
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
      />

      {file ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{file.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">
            {label} {required && <span className="text-destructive">*</span>}
          </p>
          <p className="text-xs text-muted-foreground mb-3">{description}</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Dosya Seç
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In real app, open camera
                toast.info('Kamera özelliği yakında eklenecek');
              }}
            >
              <Camera className="w-4 h-4 mr-1" />
              Kamera
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DocumentUploadStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const isCommercial = data.personalInfo.subscriberGroup === 'ticari';

  const handleUpload = (key: keyof typeof data.documents, file: File) => {
    updateData({
      documents: { ...data.documents, [key]: file }
    });
  };

  const handleRemove = (key: keyof typeof data.documents) => {
    updateData({
      documents: { ...data.documents, [key]: null }
    });
  };

  const handleContinue = () => {
    if (!data.documents.idFront) {
      toast.error('Lütfen kimlik ön yüz fotoğrafını yükleyiniz');
      return;
    }
    if (!data.documents.idBack) {
      toast.error('Lütfen kimlik arka yüz fotoğrafını yükleyiniz');
      return;
    }
    if (!data.documents.oldInvoice) {
      toast.error('Lütfen eski fatura fotoğrafını yükleyiniz');
      return;
    }
    if (isCommercial && !data.documents.tradeRegistry) {
      toast.error('Lütfen ticaret sicil belgesini yükleyiniz');
      return;
    }
    nextStep();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Belge Yükleme</CardTitle>
        <CardDescription>
          Başvurunuz için gerekli belgeleri yükleyiniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentUpload
            label="Kimlik Ön Yüz"
            description="TC Kimlik kartınızın ön yüzü"
            file={data.documents.idFront}
            onUpload={(file) => handleUpload('idFront', file)}
            onRemove={() => handleRemove('idFront')}
            required
          />
          <DocumentUpload
            label="Kimlik Arka Yüz"
            description="TC Kimlik kartınızın arka yüzü"
            file={data.documents.idBack}
            onUpload={(file) => handleUpload('idBack', file)}
            onRemove={() => handleRemove('idBack')}
            required
          />
        </div>

        <DocumentUpload
          label="Eski Elektrik Faturası"
          description="Son 3 aya ait elektrik faturanız"
          file={data.documents.oldInvoice}
          onUpload={(file) => handleUpload('oldInvoice', file)}
          onRemove={() => handleRemove('oldInvoice')}
          required
        />

        {isCommercial && (
          <DocumentUpload
            label="Ticaret Sicil Belgesi"
            description="Güncel ticaret sicil belgesi"
            file={data.documents.tradeRegistry}
            onUpload={(file) => handleUpload('tradeRegistry', file)}
            onRemove={() => handleRemove('tradeRegistry')}
            required
          />
        )}

        <p className="text-xs text-muted-foreground text-center">
          Desteklenen formatlar: JPG, PNG, PDF (Maks. 10MB)
        </p>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Geri
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            Devam Et
          </Button>
        </div>

        <ContactWidget title="Belge yükleme sorunu mu yaşıyorsunuz?" compact />
      </CardContent>
    </Card>
  );
};
