
import React, { useMemo } from 'react';
import { SimulationState, SimulationConfig } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BITCOIN_ORANGE } from '../constants';

interface ResultsScreenProps {
  state: SimulationState;
  config: SimulationConfig;
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ state, config, onReset }) => {
  const finalPrice = state.history[state.history.length - 1]?.btcPrice || 0;
  const initialPrice = state.history[0]?.btcPrice || 25000; 
  
  const finalUsdValue = state.btcAmount * finalPrice;
  const initialUsdValue = config.initialBtc * initialPrice;
  
  const yearsCovered = finalUsdValue / (state.monthlyExpense * 12);
  const totalGrowthPercent = ((finalUsdValue + state.totalSpentUsd) / initialUsdValue - 1) * 100;
  const opportunityCost = state.totalBtcSold * finalPrice;
  
  const chartData = useMemo(() => {
    return state.history.map(h => ({
      name: `C${h.cycle}`,
      valor: h.usdValue,
    }));
  }, [state.history]);

  const resultType = useMemo(() => {
    if (yearsCovered > 25) return { title: 'Generational Wealth', desc: `Your stack supports your lifestyle for ${yearsCovered.toFixed(0)} years. You've reached "Escape Velocity".`, color: 'text-emerald-400' };
    if (yearsCovered > 10) return { title: 'Solid Independence', desc: 'Over a decade of expenses covered. You have high leverage over your time.', color: 'text-blue-400' };
    if (yearsCovered > 3) return { title: 'Strategic Buffer', desc: 'You have enough to pivot your life or take significant risks.', color: 'text-orange-400' };
    return { title: 'Portfolio Seeded', desc: 'Simulation finished. The focus remains on accumulation and lowering expenses.', color: 'text-slate-400' };
  }, [yearsCovered]);

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <header className="mb-6 text-center">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Deep Insights</h2>
        <p className="text-3xl font-black text-white">Simulation Over</p>
      </header>

      {/* Main Result Card */}
      <div className="bg-slate-800/40 rounded-3xl p-6 mb-6 text-center border border-slate-700 shadow-xl">
        <h3 className={`text-2xl font-black mb-2 ${resultType.color}`}>{resultType.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{resultType.desc}</p>
      </div>

      {/* Opportunity Cost Alert */}
      {state.totalBtcSold > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-red-400 text-xs font-bold uppercase mb-1">Opportunity Cost</p>
              <p className="text-slate-300 text-sm">
                The <span className="text-white font-bold">{state.totalBtcSold.toFixed(4)} ₿</span> you sold to cover expenses would be worth <span className="text-red-400 font-bold">${opportunityCost.toLocaleString()}</span> today.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Growth</p>
          <p className="text-xl font-bold text-emerald-400">+{totalGrowthPercent.toLocaleString(undefined, {maximumFractionDigits: 0})}%</p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Safe Years</p>
          <p className="text-xl font-bold text-white">{yearsCovered.toFixed(1)} <span className="text-xs text-slate-500">y</span></p>
          <p className="text-[9px] text-blue-400 font-medium mt-1">Based on ${state.monthlyExpense}/mo</p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Final Stack</p>
          <p className="text-xl font-bold text-orange-400">{state.btcAmount.toFixed(4)} ₿</p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Final Value</p>
          <p className="text-xl font-bold text-white">${(finalUsdValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <div className="h-40 mb-8 px-2">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-4">Portfolio USD Trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#1e293b'}}
              contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px'}}
              labelStyle={{color: '#94a3b8'}}
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? BITCOIN_ORANGE : '#334155'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed breakdown list */}
      <div className="space-y-3 mb-8 bg-slate-800/20 p-4 rounded-2xl">
        <div className="flex justify-between text-xs py-1">
          <span className="text-slate-500">Selected Lifestyle</span>
          <span className="text-blue-400 font-bold">{config.lifestyle} (${state.monthlyExpense}/mo)</span>
        </div>
        <div className="flex justify-between text-xs py-1">
          <span className="text-slate-500">Initial BTC Value</span>
          <span className="text-slate-300">${initialUsdValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs py-1">
          <span className="text-slate-500">Total Spent (Simulation)</span>
          <span className="text-red-400">-${state.totalSpentUsd.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs py-1 border-t border-slate-800 mt-2 pt-2">
          <span className="text-slate-400 font-bold uppercase">Estimated Net Worth</span>
          <span className="text-white font-bold">${finalUsdValue.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 rounded-2xl font-bold bg-white text-slate-900 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        New Simulation
      </button>
    </div>
  );
};

export default ResultsScreen;
