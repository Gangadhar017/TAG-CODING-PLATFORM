import React from 'react';

const SubmissionResult = ({ submissionStatus }) => {
    if (!submissionStatus) {
        return null;
    }

    if (submissionStatus.statusCode === 200) {
        const isCorrect = !submissionStatus.data;
        const resultMessage = isCorrect ? "Correct Submission" : "Wrong Submission";
        const borderStyle = isCorrect 
            ? "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.03)]" 
            : "border-rose-500/20 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.03)]";
        const titleColor = isCorrect ? "text-emerald-400" : "text-rose-400";
        const icon = isCorrect ? "✨" : "⚠️";
        
        return (
            <div className={`p-6 rounded-2xl border shadow-lg ${borderStyle} text-white font-sans`}>
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-900/60 mb-4">
                    <span className="text-2xl">{icon}</span>
                    <h1 className={`text-2xl font-extrabold font-outfit tracking-wide ${titleColor}`}>{resultMessage}</h1>
                </div>
                {!isCorrect && (
                    <div className="mt-2 flex flex-col">
                        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-outfit mb-2">Failed on testcase:</h2>
                        <pre className="bg-slate-950 border border-slate-900 text-slate-300 p-4 rounded-xl whitespace-pre-wrap font-mono text-[13px] shadow-inner leading-relaxed">
                            <strong className="text-slate-500">Input:</strong> {submissionStatus.data.input}
                            <br />
                            <strong className="text-slate-500">Output:</strong> <span className="text-rose-400">{submissionStatus.data.output}</span>
                            <br />
                            <strong className="text-slate-500">Expected:</strong> <span className="text-emerald-400">{submissionStatus.data.expectedOutput}</span>
                        </pre>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="p-6 rounded-2xl border border-rose-500/25 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.03)] text-white font-sans">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-900/60 mb-4">
                    <span className="text-2xl">⚠️</span>
                    <h2 className="text-2xl font-extrabold font-outfit text-rose-400 tracking-wide">Submission Error</h2>
                </div>
                <pre className="bg-slate-950 border border-slate-900 text-slate-300 p-4 rounded-xl whitespace-pre-wrap font-mono text-[13px] shadow-inner leading-relaxed">{submissionStatus.data}</pre>
            </div>
        );
    }
};

export default SubmissionResult;
