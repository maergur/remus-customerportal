import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SubscriberGroup = 'mesken' | 'ticari' | 'sanayi' | '';
export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'REJECTED' | 'ACCEPTED';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subscriberGroup: SubscriberGroup;
}

export interface CorporateInfo {
  isCorporate: boolean;
  companyName: string;
  taxNumber: string;
  taxOffice: string;
  corporateAddress: string;
}

export interface OnboardingData {
  step: number;
  personalInfo: PersonalInfo;
  captchaVerified: boolean;
  phoneVerified: boolean;
  verificationCode: string;
  selectedTariff: string;
  tcKimlikNo: string;
  etsoCode: string;
  addressFromEtso: string;
  addressConfirmed: boolean;
  corporateInfo: CorporateInfo;
  documents: {
    idFront: File | null;
    idBack: File | null;
    oldInvoice: File | null;
    tradeRegistry: File | null;
  };
  contractAccepted: boolean;
  applicationStatus: ApplicationStatus;
  rejectionNote: string;
  acceptanceDate: string;
}

const initialData: OnboardingData = {
  step: 1,
  personalInfo: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subscriberGroup: '',
  },
  captchaVerified: false,
  phoneVerified: false,
  verificationCode: '',
  selectedTariff: '',
  tcKimlikNo: '',
  etsoCode: '',
  addressFromEtso: '',
  addressConfirmed: false,
  corporateInfo: {
    isCorporate: false,
    companyName: '',
    taxNumber: '',
    taxOffice: '',
    corporateAddress: '',
  },
  documents: {
    idFront: null,
    idBack: null,
    oldInvoice: null,
    tradeRegistry: null,
  },
  contractAccepted: false,
  applicationStatus: 'PENDING',
  rejectionNote: '',
  acceptanceDate: '',
};

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  updateCorporateInfo: (updates: Partial<CorporateInfo>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialData, ...parsed, documents: initialData.documents };
      } catch {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    const { documents, ...dataToSave } = data;
    localStorage.setItem('onboardingData', JSON.stringify(dataToSave));
  }, [data]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates },
    }));
  };

  const updateCorporateInfo = (updates: Partial<CorporateInfo>) => {
    setData(prev => ({
      ...prev,
      corporateInfo: { ...prev.corporateInfo, ...updates },
    }));
  };

  const nextStep = () => {
    setData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setData(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const goToStep = (step: number) => {
    setData(prev => ({ ...prev, step }));
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingData');
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        updatePersonalInfo,
        updateCorporateInfo,
        nextStep,
        prevStep,
        goToStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
