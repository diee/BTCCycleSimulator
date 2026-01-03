import React, { useState } from 'react';
import { SimulationConfig, SimulationState, Lifestyle, CycleSnapshot } from './types';
import { MONTHLY_EXPENSES } from './constants';
import { calculateCycleAction } from './logic';
import SetupScreen from './screens/SetupScreen';
import SimulationScreen from './screens/SimulationScreen';
import ResultsScreen from './screens/ResultsScreen';
import SplashScreen from './screens/SplashScreen';
import DiagnosticsScreen from './screens/DiagnosticsScreen';

type AppScreen = 'SPLASH' | 'SETUP' | 'SIMULATION' | 'RESULTS';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('SPLASH');
  const [config, setConfig] = useState<SimulationConfig | null>(null);
  const [state, setState] = useState<SimulationState | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const startSimulation = (newConfig: SimulationConfig) => {
    setConfig(newConfig);
    const monthlyExpense = MONTHLY_EXPENSES[newConfig.lifestyle];
    
    setState({
      currentCycle: 1,
      btcAmount: newConfig.initialBtc,
      totalBtcSold: 0,
      totalSpentUsd: 0,
      totalDcaInvested: 0,
      history: [],
      isFinished: false,
      monthlyExpense,
      prices: newConfig.customPrices,
    });
    setScreen('SIMULATION');
  };

  const handleCycleAction = (action: 'HOLD' | 'SELL_EXPENSES' | 'SELL_5') => {
    if (!state || !config) return;

    const { newBtc, newSpent, cyclePrice, btcSoldThisTurn, dcaBtcBought, currentCycleExpense } = calculateCycleAction(state, config, action);

    const snapshot: CycleSnapshot = {
      cycle: state.currentCycle,
      btcPrice: cyclePrice,
      btcRemaining: newBtc,
      usdValue: newBtc * cyclePrice,
      accumulatedSpending: newSpent,
      currentMonthlyExpense: currentCycleExpense / 12 / 4
    };

    const nextCycle = state.currentCycle + 1;
    const isFinished = state.currentCycle >= config.horizon;

    setState(prev => prev ? ({
      ...prev,
      currentCycle: nextCycle,
      btcAmount: newBtc,
      totalBtcSold: prev.totalBtcSold + btcSoldThisTurn,
      totalSpentUsd: newSpent,
      totalDcaInvested: prev.totalDcaInvested + (config.dcaAmount * 48),
      history: [...prev.history, snapshot],
      isFinished,
      // Update monthly expense for next cycle based on inflation (4 years)
      monthlyExpense: prev.monthlyExpense * Math.pow(1 + config.inflationRate / 100, 4)
    }) : null);

    if (isFinished) {
      setScreen('RESULTS');
    }
  };

  const reset = () => {
    setScreen('SETUP');
    setConfig(null);
    setState(null);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-900 shadow-2xl overflow-hidden flex flex-col relative">
      {showDiagnostics && <DiagnosticsScreen onClose={() => setShowDiagnostics(false)} />}
      
      {screen === 'SPLASH' && <SplashScreen onFinish={() => setScreen('SETUP')} />}
      {screen === 'SETUP' && <SetupScreen onStart={startSimulation} />}
      {screen === 'SIMULATION' && state && config && (
        <SimulationScreen 
          state={state} 
          config={config} 
          onAction={handleCycleAction} 
        />
      )}
      {screen === 'RESULTS' && state && config && (
        <ResultsScreen 
          state={state} 
          config={config} 
          onReset={reset} 
        />
      )}

      <div 
        className="absolute top-2 right-2 w-8 h-8 opacity-0 hover:opacity-10 cursor-help"
        onClick={() => setShowDiagnostics(true)}
      />

      <footer className="p-4 text-[10px] text-slate-500 text-center bg-slate-900/80 backdrop-blur-sm">
        Educational simulation. Not financial advice. Fictional market values.
      </footer>
    </div>
  );
};

export default App;