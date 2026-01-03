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
  dcaAmount: number; // New: USD invested monthly
  inflationRate: number; // New: Annual % inflation
}

export interface CycleSnapshot {
  cycle: number;
  btcPrice: number;
  btcRemaining: number;
  usdValue: number;
  accumulatedSpending: number;
  currentMonthlyExpense: number; // Track inflation impact
}

export interface SimulationState {
  currentCycle: number;
  btcAmount: number;
  totalBtcSold: number;
  totalSpentUsd: number;
  totalDcaInvested: number; // New: track total fiat put in via DCA
  history: CycleSnapshot[];
  isFinished: boolean;
  monthlyExpense: number; // Base expense (will grow with inflation)
  prices: Record<number, number>;
}