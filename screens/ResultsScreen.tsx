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
  const totalFiatInvested = initialUsdValue + state.totalDcaInvested;
  
  const yearsCovered = finalUsdValue / (state.monthlyExpense * 12);
  const totalGrowthPercent = ((finalUsdValue + state.totalSpentUsd) / totalFiatInvested - 1) * 100;
  const opportunityCost = state.totalBtcSold * finalPrice;
  
  const inflationImpact = (state.monthlyExpense / (state.history[0]?.currentMonthlyExpense || 1) - 1) * 100;

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
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-24">
      <header className="mb-6 text-center">
        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Final Summary</h2>
        <p className="text-3xl font-black text-white">Legacy Report</p>
      </header>

      {/* Main Result Card */}
      <div className="bg-slate-800/40 rounded-[2.5rem] p-8 mb-6 text-center border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-500 opacity-50"></div>
        <h3 className={`text-2xl font-black mb-2 ${resultType.color}`}>{resultType.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{resultType.desc}</p>
      </div>

      {/* Dynamic Alerts */}
      <div className="space-y-3 mb-6">
        {state.totalBtcSold > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5">
            <p className="text-red-400 text-[10px] font-black uppercase mb-1 tracking-widest">Opportunity Cost</p>
            <p className="text-slate-300 text-xs leading-relaxed">
              The <span className="text-white font-bold">{state.totalBtcSold.toFixed(4)} ₿</span> you sold would be <span className="text-red-400 font-bold">${opportunityCost.toLocaleString()}</span> today.
            </p>
          </div>
        )}
        
        {config.inflationRate > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-5">
            <p className="text-yellow-500 text-[10px] font-black uppercase mb-1 tracking-widest">Inflation Reality</p>
            <p className="text-slate-300 text-xs leading-relaxed">
              Your cost of living increased by <span className="text-yellow-500 font-bold">{inflationImpact.toFixed(0)}%</span>. You now need <span className="text-white font-bold">${state.monthlyExpense.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</span> for the same life.
            </p>
          </div>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total ROI</p>
          <p className="text-2xl font-black text-emerald-400">+{totalGrowthPercent.toLocaleString(undefined, {maximumFractionDigits: 0})}%</p>
        </div>
        <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Safe Years</p>
          <p className="text-2xl font-black text-white">{yearsCovered.toFixed(1)} <span className="text-xs text-slate-500 font-bold">Y</span></p>
        </div>
        <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Final ₿</p>
          <p className="text-2xl font-black text-orange-400">{state.btcAmount.toFixed(4)}</p>
        </div>
        <div className="bg-slate-800/60 p-5 rounded-3xl border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Final USD</p>
          <p className="text-2xl font-black text-white">${(finalUsdValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <div className="h-44 mb-10 px-2">
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-6">Growth Trajectory</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#1e293b'}}
              contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1.5rem', fontSize: '10px'}}
              labelStyle={{color: '#94a3b8', fontWeight: 'bold'}}
            />
            <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? BITCOIN_ORANGE : '#334155'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 mb-8 bg-slate-800/20 p-6 rounded-[2rem]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase">Initial Principal</span>
          <span className="text-slate-300 font-mono">${initialUsdValue.toLocaleString()}</span>
        </div>
        {state.totalDcaInvested > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase">Total DCA Saved</span>
            <span className="text-blue-400 font-mono">+${state.totalDcaInvested.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase">Total Consumed</span>
          <span className="text-red-400 font-mono">-${state.totalSpentUsd.toLocaleString()}</span>
        </div>
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-slate-300 font-black uppercase tracking-widest text-[10px]">Net Worth</span>
          <span className="text-white font-black text-xl tracking-tighter">${finalUsdValue.toLocaleString()}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-md max-w-md mx-auto">
        <button
          onClick={onReset}
          className="w-full py-4 rounded-2xl font-black text-lg bg-white text-slate-900 shadow-2xl active:scale-95 transition-all"
        >
          Reset Simulation
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;