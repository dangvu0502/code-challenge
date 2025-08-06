import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnrichedToken, SwapTransaction } from "@/types/swap";
import { TokenInputSection } from "./TokenInputSection";
import { ExchangeRateDisplay } from "./ExchangeRateDisplay";
import { SwapButton } from "./SwapButton";
import { useSwapForm } from "@/hooks/useSwapForm";
import { useTokenAutoSelect } from "@/hooks/useTokenAutoSelect";
import { useSwapExecution } from "@/hooks/useSwapExecution";
import {
  calculateExchangeAmount,
  calculateExchangeRate,
} from "@/lib/precision";

interface SwapCardProps {
  tokens: EnrichedToken[];
}

export const SwapCard = ({ tokens }: SwapCardProps) => {
  const {
    formData,
    isValid,
    updateFromToken,
    updateToToken,
    updateFromAmount,
    swapTokens,
    setTokens,
    handleAmountChange,
    handleKeyDown,
  } = useSwapForm();

  const { fromToken, toToken, fromAmount } = formData;

  // Auto-select first two tokens
  useTokenAutoSelect(tokens, !!fromToken, !!toToken, setTokens);

  const { isLoading, executeSwap } = useSwapExecution();

  const canCalculateExchange =
    fromToken && toToken && fromToken.price > 0 && toToken.price > 0;

  const exchangeRate = canCalculateExchange
    ? calculateExchangeRate(fromToken.price, toToken.price)
    : null;

  const toAmount =
    canCalculateExchange && fromAmount
      ? calculateExchangeAmount(fromAmount, fromToken.price, toToken.price)
      : "";

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAmountChange(e.target.value);
  };

  const handleSwap = async () => {
    if (!isValid) return;

    await executeSwap(
      {
        fromToken,
        toToken,
        fromAmount,
        toAmount,
      } as SwapTransaction,
      () => updateFromAmount("")
    );
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto pulse-glow border-2">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Swap Tokens
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Exchange tokens instantly with the best rates
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* From Token Section */}
        <TokenInputSection
          label="From"
          token={fromToken}
          amount={fromAmount}
          onTokenSelect={updateFromToken}
          onAmountChange={handleFromAmountChange}
          onKeyDown={handleKeyDown}
          tokens={tokens}
          autoFocus
        />

        {/* Swap Icon */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={swapTokens}
            className="swap-icon h-12 w-12 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
          >
            <ArrowUpDown className="h-6 w-6 text-primary" />
          </Button>
        </div>

        {/* To Token Section */}
        <TokenInputSection
          label="To"
          token={toToken}
          amount={toAmount}
          onTokenSelect={updateToToken}
          tokens={tokens}
          readOnly
        />

        {/* Exchange Rate Info */}
        <ExchangeRateDisplay
          exchangeRate={exchangeRate}
          fromToken={fromToken}
          toToken={toToken}
        />

        {/* Swap Button */}
        <SwapButton
          onClick={handleSwap}
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
