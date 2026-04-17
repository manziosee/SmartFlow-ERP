'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Default to USD, but could be saved in localStorage
  const [currency, setCurrencyState] = useState('$');

  // Hydration safeguard for local storage if we wanted it
  useEffect(() => {
    const saved = localStorage.getItem('smartflow_currency');
    if (saved) setCurrencyState(saved);
  }, []);

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem('smartflow_currency', curr);
  };

  const formatCurrency = (amount: number) => {
    // Basic formatting logic for RWF vs USD
    if (currency === 'Rwf') {
      return `Rwf ${amount.toLocaleString('en-US')}`;
    }
    // Default to putting currency symbol first
    return `${currency}${amount.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
