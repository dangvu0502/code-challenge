import { useState } from 'react';
import type { SwapFormData, EnrichedToken } from '@/types/swap';
import { DEFAULT_DECIMALS, sanitizeAmountInput } from '@/lib/precision';

export const useSwapForm = () => {
  const [formData, setFormData] = useState<SwapFormData>({
    fromToken: null,
    toToken: null,
    fromAmount: '',
  });

  const updateFromToken = (token: EnrichedToken) => {
    setFormData(prev => ({ ...prev, fromToken: token }));
  };

  const updateToToken = (token: EnrichedToken) => {
    setFormData(prev => ({ ...prev, toToken: token }));
  };

  const updateFromAmount = (amount: string) => {
    setFormData(prev => ({ ...prev, fromAmount: amount }));
  };


  const swapTokens = () => {
    setFormData(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: '',
    }));
  };


  const setTokens = (fromToken: EnrichedToken, toToken: EnrichedToken) => {
    setFormData(prev => ({
      ...prev,
      fromToken,
      toToken,
    }));
  };


  const handleAmountChange = (value: string) => {
    // Use precision library for input sanitization
    const decimals = formData.fromToken?.decimals || DEFAULT_DECIMALS;
    const sanitizedValue = sanitizeAmountInput(value, decimals);
    updateFromAmount(sanitizedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = parseFloat(formData.fromAmount) || 0;
    let newValue = currentValue;

    // Define increment values based on current amount
    const increment = currentValue >= 100 ? 10 : currentValue >= 10 ? 1 : 0.1;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      newValue = currentValue + increment;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      newValue = Math.max(0, currentValue - increment);
    } else {
      return;
    }

    // Format to appropriate decimal places
    const decimals = increment < 1 ? 1 : 0;
    updateFromAmount(newValue.toFixed(decimals));
  };

  const isValid =
    formData.fromToken !== null &&
    formData.toToken !== null &&
    formData.fromAmount !== '' &&
    formData.fromAmount !== '0' &&
    formData.fromToken.currency !== formData.toToken.currency &&
    formData.fromToken.price > 0 &&
    formData.toToken.price > 0;

  return {
    formData,
    updateFromToken,
    updateToToken,
    updateFromAmount,
    swapTokens,
    setTokens,
    handleAmountChange,
    handleKeyDown,
    isValid,
  };
};