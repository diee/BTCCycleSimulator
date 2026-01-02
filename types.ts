export enum Lifestyle {
  FRUGAL = 'Minimalist',
  NORMAL = 'Balanced',
  CARO = 'Premium'
}

export interface SimulationConfig {
  initialBtc: number;
  lifestyle: Lifestyle;
  horizon: number; // 1, 2, or 3 cycles
  customPrices: Record<number, number>;
}

export interface CycleSnapshot {
  cycle: number;
  btcPrice: number;
  btcRemaining: number;
  usdValue: number;
  accumulatedSpending: number;
}

export interface SimulationState {
  currentCycle: number;
  btcAmount: number;
  totalBtcSold: number;
  totalSpentUsd: number;
  history: CycleSnapshot[];
  isFinished: boolean;
  monthlyExpense: number;
  prices: Record<number, number>;
}