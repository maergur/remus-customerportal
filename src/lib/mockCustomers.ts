// Mock existing customers database
export interface MockCustomer {
  id: string;
  phone: string;
  email: string;
  fullName: string;
  customerNumber: string;
  hasPassword: boolean;
  password?: string;
}

// Simulated existing customers (these would come from your CRM/billing system)
export const mockExistingCustomers: MockCustomer[] = [
  {
    id: '1',
    phone: '5551234567',
    email: 'ahmet.yilmaz@email.com',
    fullName: 'Ahmet Yılmaz',
    customerNumber: 'MUS001234',
    hasPassword: false,
  },
  {
    id: '2',
    phone: '5559876543',
    email: 'fatma.demir@email.com',
    fullName: 'Fatma Demir',
    customerNumber: 'MUS005678',
    hasPassword: true,
    password: 'test123',
  },
  {
    id: '3',
    phone: '5554443322',
    email: 'mehmet.kaya@email.com',
    fullName: 'Mehmet Kaya',
    customerNumber: 'MUS009012',
    hasPassword: false,
  },
];

// Helper functions
export const findCustomerByPhone = (phone: string): MockCustomer | undefined => {
  const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
  return mockExistingCustomers.find(c => c.phone === normalizedPhone);
};

export const findCustomerByEmail = (email: string): MockCustomer | undefined => {
  return mockExistingCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
};

export const findCustomerByPhoneOrEmail = (identifier: string): MockCustomer | undefined => {
  if (identifier.includes('@')) {
    return findCustomerByEmail(identifier);
  }
  return findCustomerByPhone(identifier);
};

// Mock verification code storage
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {};

export const generateVerificationCode = (identifier: string): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[identifier] = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };
  console.log(`[MOCK] Verification code for ${identifier}: ${code}`);
  return code;
};

export const verifyCode = (identifier: string, code: string): boolean => {
  const stored = verificationCodes[identifier];
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    delete verificationCodes[identifier];
    return false;
  }
  if (stored.code === code) {
    delete verificationCodes[identifier];
    return true;
  }
  return false;
};

// Mock password storage (in real app, this would be in database)
const customerPasswords: Record<string, string> = {
  '2': 'test123', // Fatma already has a password
};

export const setCustomerPassword = (customerId: string, password: string): void => {
  customerPasswords[customerId] = password;
  const customer = mockExistingCustomers.find(c => c.id === customerId);
  if (customer) {
    customer.hasPassword = true;
    customer.password = password;
  }
};

export const verifyCustomerPassword = (customerId: string, password: string): boolean => {
  return customerPasswords[customerId] === password;
};

// Mock session storage
export interface AuthSession {
  customerId: string;
  customerNumber: string;
  fullName: string;
  phone: string;
  email: string;
}

export const saveSession = (session: AuthSession): void => {
  localStorage.setItem('authSession', JSON.stringify(session));
};

export const getSession = (): AuthSession | null => {
  const stored = localStorage.getItem('authSession');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearSession = (): void => {
  localStorage.removeItem('authSession');
};
