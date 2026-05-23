import { useState } from 'react';

function SubmissionCard({ submission,displayproblem}) {
    const [showCode, setShowCode] = useState(false);
    const toggleCode = () => setShowCode(!showCode);
    return (
        <div className="bg-slate-950/45 border border-slate-900 hover:border-slate-850 p-6 rounded-2xl shadow-md flex flex-col space-y-4 hover:shadow-lg transition duration-300">
            {displayproblem && (
                <div className="bg-slate-950 border border-slate-900/60 py-3 px-4 rounded-xl flex justify-between items-center">
                    <div className="text-base font-bold font-outfit text-white">
                        {submission.problem.title}
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest font-outfit px-3 py-1 rounded-full border ${
                        submission.problem.difficulty === 'easy' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : submission.problem.difficulty === 'medium' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                        {submission.problem.difficulty}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                <span className="flex text-sm font-semibold font-outfit text-slate-400 items-center">
                    Language : 
                    <p className="text-orange-400 ml-2 font-bold font-mono uppercase bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/15 text-[11px] tracking-wider">
                        {submission.language}
                    </p>
                </span>
                <span className="text-slate-500 font-outfit text-xs font-medium">
                    {new Date(submission.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <span className={`font-bold font-outfit text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border ${
                    submission.status 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.05)]'
                }`}>
                    {submission.status ? 'Accepted' : 'Rejected'}
                </span>
            </div>
            
            <div className="flex flex-col pt-1">
                <button
                    className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold font-outfit rounded-xl border border-slate-800 hover:border-slate-700 transition duration-300 text-xs shadow-inner"
                    onClick={toggleCode}
                >
                    {showCode ? 'Hide Source Code' : 'View Source Code'}
                </button>
                {showCode && (
                    <div className="relative mt-3">
                        <pre className="whitespace-pre-wrap bg-slate-950 border border-slate-900 text-slate-300 p-4 rounded-xl shadow-inner overflow-auto max-h-64 font-mono text-[13px] custom-scrollbar leading-relaxed">
                            {submission.code}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubmissionCard;
