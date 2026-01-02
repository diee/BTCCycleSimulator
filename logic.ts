import { SimulationState } from './types';
import { BTC_CYCLE_PRICES } from './constants';

export const calculateCycleAction = (
  state: SimulationState,
  action: 'HOLD' | 'SELL_EXPENSES' | 'SELL_5'
): { newBtc: number; newSpent: number; cyclePrice: number; expenses: number; btcSoldThisTurn: number } => {
  const prices = state.prices || BTC_CYCLE_PRICES;
  const cyclePrice = prices[state.currentCycle as keyof typeof prices] || 0;
  const yearsInCycle = 4;
  const cycleExpenses = state.monthlyExpense * 12 * yearsInCycle;
  
  let newBtc = state.btcAmount;
  let newSpent = state.totalSpentUsd;
  let btcSoldThisTurn = 0;

  if (action === 'SELL_EXPENSES') {
    btcSoldThisTurn = cycleExpenses / cyclePrice;
    newBtc = Math.max(0, state.btcAmount - btcSoldThisTurn);
    newSpent += cycleExpenses;
  } else if (action === 'SELL_5') {
    btcSoldThisTurn = state.btcAmount * 0.05;
    newBtc = state.btcAmount - btcSoldThisTurn;
    newSpent += btcSoldThisTurn * cyclePrice;
  }

  return { newBtc, newSpent, cyclePrice, expenses: cycleExpenses, btcSoldThisTurn };
};

export const runLogicTests = () => {
  const results = [];
  const defaultPrices = { 1: 250000, 2: 500000, 3: 1000000 };

  const state1: SimulationState = {
    currentCycle: 1,
    btcAmount: 1.0,
    totalBtcSold: 0,
    totalSpentUsd: 0,
    history: [],
    isFinished: false,
    monthlyExpense: 1000,
    prices: defaultPrices
  };

  const res1 = calculateCycleAction(state1, 'SELL_EXPENSES');
  const expectedBtc = 1.0 - (48000 / 250000);
  results.push({
    name: "Expense selling calculation (Cycle 1)",
    passed: Math.abs(res1.newBtc - expectedBtc) < 0.00001,
    details: `Expected: ${expectedBtc.toFixed(4)}, Got: ${res1.newBtc.toFixed(4)}`
  });

  return results;
};