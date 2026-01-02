import React, { useState, useEffect } from 'react';
import { runLogicTests } from '../logic';

const DiagnosticsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTestResults(runLogicTests());
      setIsRunning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-6 font-mono text-xs overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-emerald-400 font-bold text-lg">SYSTEM_DIAGNOSTICS v1.0</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-white">CLOSE_X</button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">{" >> "}</span>
          <span>Starting unit test battery...</span>
        </div>

        {isRunning ? (
          <div className="animate-pulse text-slate-500">Running...</div>
        ) : (
          testResults.map((test, i) => (
            <div key={i} className={`p-3 rounded border ${test.passed ? 'border-emerald-900 bg-emerald-950/30' : 'border-red-900 bg-red-950/30'}`}>
              <div className="flex justify-between mb-1">
                <span className={test.passed ? 'text-emerald-400' : 'text-red-400'}>
                  [{test.passed ? 'PASS' : 'FAIL'}] {test.name}
                </span>
              </div>
              <div className="text-slate-500 text-[10px]">{test.details}</div>
            </div>
          ))
        )}

        {!isRunning && (
          <div className="mt-8 pt-4 border-t border-slate-800">
            <p className="text-emerald-500 mb-4">All critical integrity tests have finished.</p>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-emerald-600 text-white rounded font-bold"
            >
              BACK TO APP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticsScreen;