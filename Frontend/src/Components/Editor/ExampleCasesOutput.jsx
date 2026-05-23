import { useState } from 'react';

function ExampleCasesOutput({ exampleCasesExecution }) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  console.log(exampleCasesExecution);

  if (exampleCasesExecution.statusCode === 403) {
    return (
      <div className="border border-rose-500/30 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.05)] p-6 rounded-2xl text-white font-sans">
        <h1 className="text-xl font-bold font-outfit text-rose-400 tracking-wide flex items-center gap-2">
          <span>⚠️</span> Runtime Error
        </h1>
        <pre className="bg-slate-950 border border-slate-900 text-slate-300 p-4 rounded-xl mt-4 whitespace-pre-wrap font-mono text-[13px] shadow-inner">
          {exampleCasesExecution.data}
        </pre>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans">
      <h3 className="text-lg font-bold font-outfit text-white tracking-wide mb-4">Execution Results</h3>
      
      {/* Testcase tabs with pass/fail indicators */}
      <div className="flex flex-wrap gap-2 mb-6">
        {exampleCasesExecution.data.map((execution, index) => (
          <button
            key={index}
            className={`px-4 py-2.5 rounded-xl font-bold font-outfit transition-all duration-300 flex items-center text-sm ${
              visibleIndex === index
                ? 'bg-slate-900 border border-slate-800 text-white shadow-lg' 
                : 'bg-slate-950/60 border border-slate-900 hover:bg-slate-900 text-slate-400 hover:text-slate-200' 
            }`}
            onClick={() => setVisibleIndex(index)}
          >
            {execution.isMatch ? (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            )}
            Case {index + 1}
          </button>
        ))}
      </div>

      {/* Selected testcase detailed diff console */}
      {exampleCasesExecution.data.map((execution, index) =>
        visibleIndex === index ? (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-md text-white transition-all duration-500 ease-in-out border ${
              execution.isMatch 
                ? 'border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.03)]' 
                : 'border-rose-500/20 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.03)]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 mb-4">
              <h4 className="text-sm font-bold font-outfit text-slate-300 uppercase tracking-widest">
                Test Case {index + 1}
              </h4>
              <span className={`text-xs font-bold font-outfit px-3 py-1 rounded-full border ${
                execution.isMatch 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {execution.isMatch ? 'Passed' : 'Failed'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {/* Input */}
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-outfit mb-1.5">Input:</span>
                <pre className="bg-slate-950 border border-slate-900 text-slate-200 p-4 rounded-xl whitespace-pre-wrap font-mono text-[13px] shadow-inner flex-1 min-h-[60px]">
                  {execution.input}
                </pre>
              </div>

              {/* Expected Output */}
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-outfit mb-1.5">Expected Output:</span>
                <pre className="bg-slate-950 border border-slate-900 text-slate-200 p-4 rounded-xl whitespace-pre-wrap font-mono text-[13px] shadow-inner flex-1 min-h-[60px]">
                  {execution.expectedOutput}
                </pre>
              </div>

              {/* Actual Output */}
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-outfit mb-1.5">Actual Output:</span>
                <pre className="bg-slate-950 border border-slate-900 text-slate-200 p-4 rounded-xl whitespace-pre-wrap font-mono text-[13px] shadow-inner flex-1 min-h-[60px]">
                  {execution.actualOutput}
                </pre>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

export default ExampleCasesOutput;
