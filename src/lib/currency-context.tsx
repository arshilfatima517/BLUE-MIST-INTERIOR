import { createContext, useContext, useState, type ReactNode } from 'react';

type Currency = 'INR' | 'USD';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
  format: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const symbol = currency === 'INR' ? '₹' : '$';

  const format = (amount: number) => {
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
    return `$${amount.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
