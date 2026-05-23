import React from 'react'

function Description({ problem }) {
    return (
        <div className="space-y-6">
            {/* Core Description Text */}
            <div className="text-[15px] font-medium text-slate-300 leading-relaxed font-sans">
                <p className="whitespace-pre-line">{problem.description}</p>
            </div>

            {/* Input Format Card */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition duration-300 shadow-sm">
                <h3 className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest mb-3">Input Format</h3>
                <p className="whitespace-pre-line text-[14.5px] font-medium text-slate-300 leading-relaxed font-sans">
                    {problem.input_format}
                </p>
            </div>

            {/* Output Format Card */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition duration-300 shadow-sm">
                <h3 className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest mb-3">Output Format</h3>
                <p className="whitespace-pre-line text-[14.5px] font-medium text-slate-300 leading-relaxed font-sans">
                    {problem.output_format}
                </p>
            </div>

            {/* Constraints Card */}
            {problem.constraints && problem.constraints.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition duration-300 shadow-sm">
                    <h3 className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest mb-3">Constraints</h3>
                    <ul className="space-y-2.5 text-[14.5px] font-medium text-slate-300 leading-relaxed font-sans list-none">
                        {problem.constraints.map((constraint, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-orange-500 mr-2.5 mt-0.5 select-none font-bold font-outfit text-sm">•</span>
                                <span>{constraint}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Description
