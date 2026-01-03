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
  
  const currentPrice = state.prices[state.currentCycle] || 0;
  const currentCycleExpenses = state.monthlyExpense * 12 * 4;
  const dcaTotalThisCycle = config.dcaAmount * 48;
  const dcaBtcBought = dcaTotalThisCycle / currentPrice;
  const totalBtcAfterDca = state.btcAmount + dcaBtcBought;
  
  const usdValue = totalBtcAfterDca * currentPrice;

  const handleConfirm = () => {
    if (selectedAction) {
      onAction(selectedAction);
      setSelectedAction(null);
    }
  };

  const isLastCycle = state.currentCycle === config.horizon;

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Phase {state.currentCycle} of {config.horizon}</h2>
          <p className="text-2xl font-black text-white">Years {((state.currentCycle - 1) * 4) + 1}-{state.currentCycle * 4}</p>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs text-orange-400 font-mono border border-slate-700 shadow-lg">
          ${currentPrice.toLocaleString()}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 text-9xl group-hover:rotate-12 transition-transform duration-700">₿</div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Portfolio Value</p>
          <p className="text-5xl font-black text-white mb-3 relative z-10 tracking-tighter">${usdValue.toLocaleString()}</p>
          
          <div className="flex items-center justify-center gap-2 relative z-10">
            <span className="text-orange-400 font-mono font-black text-xl">{totalBtcAfterDca.toFixed(4)} ₿</span>
            {config.dcaAmount > 0 && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                +{dcaBtcBought.toFixed(4)} DCA
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/30 p-4 rounded-3xl border border-slate-800/50">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Cycle Expenses</p>
              {config.inflationRate > 0 && <span className="text-[8px] text-red-400 font-bold">Inflated</span>}
            </div>
            <p className="text-xl font-black text-slate-200">${currentCycleExpenses.toLocaleString()}</p>
            <p className="text-[9px] text-slate-500 font-medium">${(currentCycleExpenses/48).toFixed(0)}/mo avg</p>
          </div>
          <div className="bg-slate-800/30 p-4 rounded-3xl border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">DCA Contribution</p>
            <p className="text-xl font-black text-blue-400">${dcaTotalThisCycle.toLocaleString()}</p>
            <p className="text-[9px] text-slate-500 font-medium">${config.dcaAmount}/mo fixed</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Cycle Strategy:</h3>
        
        <button
          onClick={() => setSelectedAction('HOLD')}
          className={`w-full border-2 p-5 rounded-[2rem] flex items-center gap-4 transition-all text-left ${
            selectedAction === 'HOLD' 
              ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/10' 
              : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            selectedAction === 'HOLD' ? 'bg-orange-500 text-white rotate-6' : 'bg-slate-800 text-orange-400'
          }`}>
             💎
          </div>
          <div className="flex-1">
            <p className="font-black text-white">Full Accumulation</p>
            <p className="text-[10px] text-slate-500 leading-tight">Add DCA only. Cover expenses from income.</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedAction('SELL_EXPENSES')}
          className={`w-full border-2 p-5 rounded-[2rem] flex items-center gap-4 transition-all text-left ${
            selectedAction === 'SELL_EXPENSES' 
              ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10' 
              : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            selectedAction === 'SELL_EXPENSES' ? 'bg-blue-500 text-white rotate-6' : 'bg-slate-800 text-blue-400'
          }`}>
             🥂
          </div>
          <div className="flex-1">
            <p className="font-black text-white">Live off Bitcoin</p>
            <p className="text-[10px] text-slate-500 leading-tight">Sell {(currentCycleExpenses / currentPrice).toFixed(4)} ₿ for lifestyle.</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedAction('SELL_5')}
          className={`w-full border-2 p-5 rounded-[2rem] flex items-center gap-4 transition-all text-left ${
            selectedAction === 'SELL_5' 
              ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10' 
              : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            selectedAction === 'SELL_5' ? 'bg-emerald-500 text-white rotate-6' : 'bg-slate-800 text-emerald-400'
          }`}>
             💰
          </div>
          <div className="flex-1">
            <p className="font-black text-white">Strategic Exit (5%)</p>
            <p className="text-[10px] text-slate-500 leading-tight">Harvest some gains while growing the stack.</p>
          </div>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-md max-w-md mx-auto">
        <button
          disabled={!selectedAction}
          onClick={handleConfirm}
          className={`w-full py-4 rounded-2xl font-black text-lg shadow-2xl transition-all ${
            selectedAction 
              ? 'bg-white text-slate-900 shadow-white/10 active:scale-95' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          {isLastCycle ? 'Reveal Final Results' : 'Move to Next Cycle'}
        </button>
      </div>
    </div>
  );
};

export default SimulationScreen;