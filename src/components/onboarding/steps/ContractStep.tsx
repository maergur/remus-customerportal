import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const ContractStep = () => {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [accepted, setAccepted] = useState(data.contractAccepted);

  const handleContinue = () => {
    if (!accepted) {
      toast.error('Lütfen sözleşmeyi okuyup onaylayınız');
      return;
    }
    
    updateData({ 
      contractAccepted: true,
      applicationStatus: 'UNDER_REVIEW'
    });
    nextStep();
  };

  const contractText = `
ELEKTRİK ENERJİSİ SATIŞ SÖZLEŞMESİ

TARAFLAR

1. SATICI:
Remus Enerji A.Ş.
Adres: İstanbul, Türkiye

2. ALICI:
Ad Soyad: ${data.personalInfo.firstName} ${data.personalInfo.lastName}
TC Kimlik No: ${data.tcKimlikNo}
Adres: ${data.addressFromEtso}
Telefon: ${data.personalInfo.phone}
E-posta: ${data.personalInfo.email}

MADDE 1 - SÖZLEŞMENİN KONUSU
Bu sözleşme, Satıcı'nın Alıcı'ya elektrik enerjisi satışı ve Alıcı'nın bu enerjiyi satın almasına ilişkin koşulları düzenler.

MADDE 2 - TARİFE
Seçilen Tarife: ${data.selectedTariff || 'Belirlenmedi'}
Abone Grubu: ${data.personalInfo.subscriberGroup}

MADDE 3 - ÖDEME KOŞULLARI
Alıcı, fatura bedelini fatura tarihinden itibaren 15 gün içinde ödemeyi kabul eder.

MADDE 4 - SÖZLEŞMENİN SÜRESİ
Bu sözleşme imza tarihinden itibaren 1 (bir) yıl süreyle geçerlidir.

MADDE 5 - FESİH
Taraflardan her biri, 30 gün önceden yazılı bildirimde bulunarak sözleşmeyi feshedebilir.

MADDE 6 - UYUŞMAZLIKLARIN ÇÖZÜMÜ
Bu sözleşmeden doğan uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.

İşbu sözleşme, tarafların karşılıklı mutabakatı ile elektronik ortamda imzalanmıştır.

Sözleşme Tarihi: ${new Date().toLocaleDateString('tr-TR')}
IP Adresi: [Kullanıcı IP adresi kaydedilecektir]
  `;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Sözleşme Onayı</CardTitle>
        <CardDescription>
          Lütfen sözleşmeyi okuyup onaylayınız
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg">
          <div className="flex items-center justify-between p-3 border-b bg-muted/50">
            <span className="text-sm font-medium">Elektrik Satış Sözleşmesi</span>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-1" />
              PDF İndir
            </Button>
          </div>
          <ScrollArea className="h-64 p-4">
            <pre className="text-sm whitespace-pre-wrap font-sans">
              {contractText}
            </pre>
          </ScrollArea>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="accept"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
          />
          <label
            htmlFor="accept"
            className="text-sm leading-relaxed cursor-pointer"
          >
            Yukarıdaki sözleşmeyi okudum ve kabul ediyorum. Kişisel verilerimin 
            işlenmesine ve sözleşme şartlarına onay veriyorum.
          </label>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Geri
          </Button>
          <Button onClick={handleContinue} className="flex-1" disabled={!accepted}>
            Sözleşmeyi Onayla
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
