import { createContext, useContext, useState, ReactNode } from 'react';

export interface Installation {
  id: number;
  name: string;
  address: string;
  tariff: string;
  installationNo: string;
  active: boolean;
}

// Mock installations data
export const mockInstallations: Installation[] = [
  {
    id: 1,
    name: "Ev",
    address: "Atatürk Mah. Cumhuriyet Cad. No:42 D:5, Kadıköy/İstanbul",
    tariff: "Yeşil Enerji Pro",
    installationNo: "1234567",
    active: true,
  },
  {
    id: 2,
    name: "Yazlık",
    address: "Sahil Mah. Deniz Sok. No:15, Bodrum/Muğla",
    tariff: "Standart Tarife",
    installationNo: "7654321",
    active: true,
  },
  {
    id: 3,
    name: "İş Yeri",
    address: "Levent Mah. İş Kuleleri No:8 K:12, Beşiktaş/İstanbul",
    tariff: "Ticari Tarife",
    installationNo: "9876543",
    active: true,
  },
];

interface InstallationContextType {
  installations: Installation[];
  selectedInstallation: Installation;
  setSelectedInstallation: (installation: Installation) => void;
}

const InstallationContext = createContext<InstallationContextType | undefined>(undefined);

export function InstallationProvider({ children }: { children: ReactNode }) {
  const [selectedInstallation, setSelectedInstallation] = useState<Installation>(mockInstallations[0]);

  return (
    <InstallationContext.Provider value={{
      installations: mockInstallations,
      selectedInstallation,
      setSelectedInstallation,
    }}>
      {children}
    </InstallationContext.Provider>
  );
}

export function useInstallation() {
  const context = useContext(InstallationContext);
  if (context === undefined) {
    throw new Error('useInstallation must be used within an InstallationProvider');
  }
  return context;
}
