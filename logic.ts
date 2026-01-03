import { SimulationState, SimulationConfig } from './types';
import { BTC_CYCLE_PRICES } from './constants';

export const calculateCycleAction = (
  state: SimulationState,
  config: SimulationConfig,
  action: 'HOLD' | 'SELL_EXPENSES' | 'SELL_5'
): { 
  newBtc: number; 
  newSpent: number; 
  cyclePrice: number; 
  expenses: number; 
  btcSoldThisTurn: number;
  dcaBtcBought: number;
  currentCycleExpense: number;
} => {
  const prices = state.prices || BTC_CYCLE_PRICES;
  const cyclePrice = prices[state.currentCycle as keyof typeof prices] || 0;
  
  // Calculate expenses for this cycle (4 years)
  // We use the state.monthlyExpense which already has cumulative inflation from previous cycles
  const currentCycleExpense = state.monthlyExpense * 12 * 4;
  
  // DCA Logic: 48 months of contributions
  const dcaFiatThisCycle = config.dcaAmount * 48;
  const dcaBtcBought = dcaFiatThisCycle / cyclePrice;
  
  let newBtc = state.btcAmount + dcaBtcBought;
  let newSpent = state.totalSpentUsd;
  let btcSoldThisTurn = 0;

  if (action === 'SELL_EXPENSES') {
    btcSoldThisTurn = currentCycleExpense / cyclePrice;
    newBtc = Math.max(0, newBtc - btcSoldThisTurn);
    newSpent += currentCycleExpense;
  } else if (action === 'SELL_5') {
    btcSoldThisTurn = newBtc * 0.05;
    newBtc = newBtc - btcSoldThisTurn;
    newSpent += btcSoldThisTurn * cyclePrice;
  }

  return { 
    newBtc, 
    newSpent, 
    cyclePrice, 
    expenses: currentCycleExpense, 
    btcSoldThisTurn, 
    dcaBtcBought,
    currentCycleExpense
  };
};

export const runLogicTests = () => {
  const results = [];
  const defaultPrices = { 1: 250000, 2: 500000, 3: 1000000 };

  const config: SimulationConfig = {
    initialBtc: 1.0,
    lifestyle: 'Balanced' as any,
    horizon: 1,
    customPrices: defaultPrices,
    dcaAmount: 100,
    inflationRate: 0
  };

  const state1: SimulationState = {
    currentCycle: 1,
    btcAmount: 1.0,
    totalBtcSold: 0,
    totalSpentUsd: 0,
    totalDcaInvested: 0,
    history: [],
    isFinished: false,
    monthlyExpense: 1000,
    prices: defaultPrices
  };

  const res1 = calculateCycleAction(state1, config, 'HOLD');
  const expectedDcaBtc = (100 * 48) / 250000;
  const expectedBtc = 1.0 + expectedDcaBtc;
  
  results.push({
    name: "DCA Accumulation Test",
    passed: Math.abs(res1.newBtc - expectedBtc) < 0.00001,
    details: `Expected: ${expectedBtc.toFixed(6)}, Got: ${res1.newBtc.toFixed(6)}`
  });

  return results;
};