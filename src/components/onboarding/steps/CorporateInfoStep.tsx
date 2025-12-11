import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Building, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const CorporateInfoStep = () => {
  const { data, updateCorporateInfo, nextStep, prevStep } = useOnboarding();
  const { corporateInfo } = data;

  const handleContinue = () => {
    if (corporateInfo.isCorporate) {
      if (!corporateInfo.companyName.trim()) {
        toast.error('Lütfen şirket unvanını giriniz');
        return;
      }
      if (!corporateInfo.taxNumber.trim()) {
        toast.error('Lütfen vergi numarasını giriniz');
        return;
      }
      if (!corporateInfo.taxOffice.trim()) {
        toast.error('Lütfen vergi dairesini giriniz');
        return;
      }
    }
    nextStep();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Fatura Bilgileri</CardTitle>
        <CardDescription>
          Kurumsal fatura almak istiyorsanız bilgilerinizi giriniz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Kurumsal Fatura</p>
              <p className="text-sm text-muted-foreground">
                Şirket adına fatura düzenlensin
              </p>
            </div>
          </div>
          <Switch
            checked={corporateInfo.isCorporate}
            onCheckedChange={(checked) => updateCorporateInfo({ isCorporate: checked })}
          />
        </div>

        {corporateInfo.isCorporate && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Şirket Unvanı</Label>
              <Input
                id="companyName"
                placeholder="ABC Şirketi Ltd. Şti."
                value={corporateInfo.companyName}
                onChange={(e) => updateCorporateInfo({ companyName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Vergi Numarası</Label>
                <Input
                  id="taxNumber"
                  placeholder="1234567890"
                  maxLength={11}
                  value={corporateInfo.taxNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    updateCorporateInfo({ taxNumber: value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxOffice">Vergi Dairesi</Label>
                <Input
                  id="taxOffice"
                  placeholder="Kadıköy V.D."
                  value={corporateInfo.taxOffice}
                  onChange={(e) => updateCorporateInfo({ taxOffice: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corporateAddress">Kurumsal Adres</Label>
              <Input
                id="corporateAddress"
                placeholder="Şirket adresi"
                value={corporateInfo.corporateAddress}
                onChange={(e) => updateCorporateInfo({ corporateAddress: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            Geri
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            {corporateInfo.isCorporate ? 'Devam Et' : 'Bireysel Fatura ile Devam'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
