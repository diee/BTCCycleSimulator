import React, { useState } from 'react';
import { Lifestyle, SimulationConfig } from '../types';
import { INITIAL_BTC_PRESETS, BITCOIN_ORANGE, BTC_CYCLE_PRICES } from '../constants';

interface SetupScreenProps {
  onStart: (config: SimulationConfig) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [initialBtc, setInitialBtc] = useState(0.1);
  const [lifestyle, setLifestyle] = useState<Lifestyle>(Lifestyle.NORMAL);
  const [horizon, setHorizon] = useState(2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [prices, setPrices] = useState<Record<number, number>>({ ...BTC_CYCLE_PRICES });
  
  // New features
  const [dcaAmount, setDcaAmount] = useState(200);
  const [inflationRate, setInflationRate] = useState(3);

  const handleStart = () => {
    onStart({ 
      initialBtc, 
      lifestyle, 
      horizon,
      customPrices: prices,
      dcaAmount,
      inflationRate
    });
  };

  const updatePrice = (cycle: number, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setPrices(prev => ({ ...prev, [cycle]: num }));
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto pb-24">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1 tracking-tight">Setup Scenario</h2>
          <p className="text-slate-400 text-sm">Fine-tune your future path</p>
        </div>
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2 rounded-xl transition-all ${showAdvanced ? 'bg-orange-500 text-white rotate-12 scale-110 shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400'}`}
          title="Advanced Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </header>

      <div className="space-y-8 flex-1">
        {showAdvanced && (
          <section className="bg-slate-800/40 border border-slate-700 rounded-3xl p-5 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div>
              <h3 className="text-xs font-black text-orange-400 uppercase mb-4 tracking-widest">Market & Economic Config</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(c => (
                  <div key={c} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono w-14">C{c} Price</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                      <input 
                        type="text" 
                        value={prices[c].toLocaleString()}
                        onChange={(e) => updatePrice(c, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-6 pr-3 text-sm font-mono focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Monthly DCA Saving</label>
                <span className="text-sm font-mono text-white">${dcaAmount}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="50" 
                value={dcaAmount}
                onChange={(e) => setDcaAmount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-[10px] text-slate-500 mt-2 italic">How much fiat you save into BTC monthly.</p>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-red-400 uppercase tracking-widest">Fiat Inflation</label>
                <span className="text-sm font-mono text-white">{inflationRate}% / yr</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.5" 
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <p className="text-[10px] text-slate-500 mt-2 italic">Yearly increase in cost of living.</p>
            </div>
          </section>
        )}

        {/* BTC Section */}
        <section>
          <label className="block text-sm font-bold text-slate-300 mb-4">Initial Stack</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {INITIAL_BTC_PRESETS.slice(0, 3).map(preset => (
              <button
                key={preset}
                onClick={() => setInitialBtc(preset)}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-bold ${
                  initialBtc === preset 
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-500/5' 
                    : 'border-slate-800 bg-slate-800/50 text-slate-500'
                }`}
              >
                {preset} ₿
              </button>
            ))}
          </div>
          <input 
            type="range" 
            min="0.01" 
            max="1" 
            step="0.01" 
            value={initialBtc}
            onChange={(e) => setInitialBtc(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
            <span>0.01 ₿</span>
            <span className="text-orange-400 font-bold bg-orange-400/10 px-2 py-0.5 rounded">{initialBtc.toFixed(2)} ₿</span>
            <span>1.00 ₿</span>
          </div>
        </section>

        {/* Lifestyle Section */}
        <section>
          <label className="block text-sm font-bold text-slate-300 mb-4">Current Lifestyle</label>
          <div className="grid grid-cols-3 gap-2">
            {[Lifestyle.FRUGAL, Lifestyle.NORMAL, Lifestyle.CARO].map(style => (
              <button
                key={style}
                onClick={() => setLifestyle(style)}
                className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${
                  lifestyle === style 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5' 
                    : 'border-slate-800 bg-slate-800/50 text-slate-500'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        {/* Horizon Section */}
        <section>
          <label className="block text-sm font-bold text-slate-300 mb-4">Time Horizon</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(h => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold ${
                  horizon === h 
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5' 
                    : 'border-slate-800 bg-slate-800/50 text-slate-500'
                }`}
              >
                {h} Cycle{h > 1 ? 's' : ''}
                <span className="block text-[10px] opacity-70 font-normal">({h * 4} yrs)</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-md max-w-md mx-auto">
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-lg shadow-2xl hover:brightness-110 active:scale-95 transition-all text-white"
          style={{ backgroundColor: BITCOIN_ORANGE }}
        >
          Start Simulation
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;