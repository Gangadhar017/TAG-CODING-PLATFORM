import { useState } from 'react';

function Solution({ solution }) {
    const [openSolution, setOpenSolution] = useState(null);
    const toggleSolution = (lang) => {
        setOpenSolution((prev) => (prev === lang ? null : lang));
    };

    const getLangLabel = (lang) => {
        switch (lang.toLowerCase()) {
            case 'cpp': return 'C++';
            case 'c': return 'C';
            case 'java': return 'Java';
            case 'python': return 'Python';
            default: return lang.toUpperCase();
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold font-outfit text-white mb-4 tracking-wide">Official Solutions</h2>
            
            <div className="space-y-3 pr-1">
                {Object.keys(solution).map((lang, index) => (
                    <div 
                        key={index} 
                        className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 transition duration-300 shadow-sm"
                    >
                        <div 
                            className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-slate-900/20 transition-all font-outfit select-none"
                            onClick={() => toggleSolution(lang)}
                        >
                            <span className="text-[15px] font-bold text-orange-400">
                                {getLangLabel(lang)} Solution
                            </span>
                            <span className={`text-[12px] text-slate-500 font-bold transform transition-transform duration-300 ${openSolution === lang ? 'rotate-180 text-orange-400' : ''}`}>
                                ▼
                            </span>
                        </div>
                        
                        {openSolution === lang && (
                            <div className="p-5 border-t border-slate-900 bg-slate-950/90 overflow-x-auto">
                                <pre className="text-[14px] font-medium font-mono text-slate-300 leading-relaxed custom-scrollbar">
                                    <code>{solution[lang]}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Solution;
