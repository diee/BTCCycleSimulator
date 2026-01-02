import React, { useEffect } from 'react';
import { BITCOIN_ORANGE } from '../constants';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
      <div 
        className="w-24 h-24 mb-6 rounded-full flex items-center justify-center animate-pulse"
        style={{ backgroundColor: BITCOIN_ORANGE }}
      >
        <span className="text-white text-5xl font-bold">₿</span>
      </div>
      <h1 className="text-3xl font-bold mb-2 tracking-tight">BTC Cycles</h1>
      <p className="text-slate-400 text-sm">Financial Freedom Simulator</p>
      
      <div className="absolute bottom-12 w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;