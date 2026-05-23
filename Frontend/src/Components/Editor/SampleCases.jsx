import { useState } from 'react'

function SampleCases({example_cases}) {
    const [visibleIndex, setVisibleIndex] = useState(0);
    return (
        <div className="w-full flex flex-col font-sans">
            <h3 className="text-lg font-bold font-outfit text-white tracking-wide mb-4">Example Cases</h3>
            <div className="flex flex-wrap gap-2 mb-6">
                {example_cases.map((x, index) => (
                    <button 
                        key={index} 
                        className={`px-4 py-2.5 text-xs font-bold font-outfit rounded-xl transition-all duration-300 ${
                            visibleIndex === index
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/15'
                                : 'bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        onClick={() => setVisibleIndex(index)}
                    >
                        Case {index + 1}
                    </button>
                ))}
            </div>

            {example_cases.map((example, index) =>
                visibleIndex === index ? (
                    <div key={index} className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl mb-4 shadow-md flex flex-col gap-4">
                        <h4 className="text-sm font-bold font-outfit text-slate-300 uppercase tracking-widest border-b border-slate-900 pb-2">
                            Example {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Input:</span>
                                <pre className="bg-slate-950 border border-slate-900 text-slate-200 p-4 rounded-xl mt-1.5 whitespace-pre-wrap font-mono text-[13px] shadow-inner">
                                    {example.input}
                                </pre>
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Expected Output:</span>
                                <pre className="bg-slate-950 border border-slate-900 text-slate-200 p-4 rounded-xl mt-1.5 whitespace-pre-wrap font-mono text-[13px] shadow-inner">
                                    {example.output}
                                </pre>
                            </div>
                        </div>
                        {example.explanation && (
                            <div className="text-slate-400 text-sm italic font-outfit mt-2 bg-slate-900/30 p-4 rounded-xl border border-slate-900/60">
                                <strong>Explanation: </strong> {example.explanation}
                            </div>
                        )}
                    </div>
                ) : null
            )}
        </div>
    );
}

export default SampleCases
