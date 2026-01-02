import React, { useState } from 'react';
import { SimulationState, SimulationConfig } from '../types';
import { BITCOIN_ORANGE } from '../constants';

interface SimulationScreenProps {
  state: SimulationState;
  config: SimulationConfig;
  onAction: (action: 'HOLD' | 'SELL_EXPENSES' | 'SELL_5') => void;
}

type ActionType = 'HOLD' | 'SELL_EXPENSES' | 'SELL_5';

const SimulationScreen: React.FC<SimulationScreenProps> = ({ state, config, onAction }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  
  // Use the prices from the state (which might be custom) instead of constants
  const currentPrice = state.prices[state.currentCycle] || 0;
  const usdValue = state.btcAmount * currentPrice;
  const cycleExpenses = state.monthlyExpense * 12 * 4;

  const handleConfirm = () => {
    if (selectedAction) {
      onAction(selectedAction);
      setSelectedAction(null); // Reset for next cycle
    }
  };

  const isLastCycle = state.currentCycle === config.horizon;

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Cycle {state.currentCycle} / {config.horizon}</h2>
          <p className="text-2xl font-bold">Years {((state.currentCycle - 1) * 4) + 1} - {state.currentCycle * 4}</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg text-xs text-orange-400 font-mono border border-slate-700">
          Price: ${currentPrice.toLocaleString()}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">₿</div>
          <p className="text-slate-400 text-sm mb-1 relative z-10">Current Net Worth</p>
          <p className="text-4xl font-bold mono text-white mb-2 relative z-10">${usdValue.toLocaleString()}</p>
          <p className="text-orange-400 font-mono font-bold text-lg relative z-10">{state.btcAmount.toFixed(4)} ₿</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tighter">Cycle Spending</p>
            <p className="text-xl font-bold text-slate-200">${cycleExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tighter">Total Spent</p>
            <p className="text-xl font-bold text-red-400">${state.totalSpentUsd.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase px-1">Choose a decision:</h3>
        
        <button
          onClick={() => setSelectedAction('HOLD')}
          className={`w-full border-2 p-4 rounded-2xl flex items-center gap-4 transition-all text-left group ${
            selectedAction === 'HOLD' 
              ? 'bg-orange-500/10 border-orange-500' 
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
            selectedAction === 'HOLD' ? 'bg-orange-500 text-white scale-110' : 'bg-orange-500/10 text-orange-400'
          }`}>
             💎
          </div>
          <div className="flex-1">
            <p className={`font-bold ${selectedAction === 'HOLD' ? 'text-orange-400' : 'text-white'}`}>Hold (HODL)</p>
            <p className="text-xs text-slate-400">Sell nothing. Expenses are covered externally.</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedAction('SELL_EXPENSES')}
          className={`w-full border-2 p-4 rounded-2xl flex items-center gap-4 transition-all text-left group ${
            selectedAction === 'SELL_EXPENSES' 
              ? 'bg-blue-500/10 border-blue-500' 
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
            selectedAction === 'SELL_EXPENSES' ? 'bg-blue-500 text-white scale-110' : 'bg-blue-500/10 text-blue-400'
          }`}>
             💸
          </div>
          <div className="flex-1">
            <p className={`font-bold ${selectedAction === 'SELL_EXPENSES' ? 'text-blue-400' : 'text-white'}`}>Live off BTC this cycle</p>
            <p className="text-xs text-slate-400">Sell {(cycleExpenses / currentPrice).toFixed(4)} ₿ to finance this cycle's expenses.</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedAction('SELL_5')}
          className={`w-full border-2 p-4 rounded-2xl flex items-center gap-4 transition-all text-left group ${
            selectedAction === 'SELL_5' 
              ? 'bg-emerald-500/10 border-emerald-500' 
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
            selectedAction === 'SELL_5' ? 'bg-emerald-500 text-white scale-110' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
             💰
          </div>
          <div className="flex-1">
            <p className={`font-bold ${selectedAction === 'SELL_5' ? 'text-emerald-400' : 'text-white'}`}>Take Profits (5%)</p>
            <p className="text-xs text-slate-400">Sell a small portion to improve your quality of life.</p>
          </div>
        </button>
      </div>

      <button
        disabled={!selectedAction}
        onClick={handleConfirm}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform ${
          selectedAction 
            ? 'bg-white text-slate-900 active:scale-95' 
            : 'bg-slate-800 text-slate-600 cursor-not-allowed grayscale'
        }`}
      >
        {isLastCycle ? 'Finish Simulation' : 'Continue to Next Cycle'}
      </button>
    </div>
  );
};

export default SimulationScreen;