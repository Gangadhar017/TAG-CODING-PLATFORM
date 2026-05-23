import React from 'react'

function ProblemStats({ user }) {
    const problems = {
        easy: 2,
        medium: 2,
        hard: 2,
    };

    const stats = [
        {
            label: "Easy",
            count: user.easyCount || 0,
            total: problems.easy,
            colorClass: "text-emerald-400",
            barGradient: "from-emerald-500 to-green-400",
            shadowClass: "shadow-[0_0_12px_rgba(52,211,153,0.3)]",
        },
        {
            label: "Medium",
            count: user.mediumCount || 0,
            total: problems.medium,
            colorClass: "text-amber-400",
            barGradient: "from-amber-500 to-yellow-400",
            shadowClass: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
        },
        {
            label: "Hard",
            count: user.hardCount || 0,
            total: problems.hard,
            colorClass: "text-rose-400",
            barGradient: "from-rose-500 to-red-400",
            shadowClass: "shadow-[0_0_12px_rgba(244,63,94,0.3)]",
        },
    ];

    return (
        <div className="bg-slate-900/10 rounded-2xl">
            <h2 className="text-xl font-bold font-outfit text-white mb-6 tracking-wide">Problem-solving Progress</h2>
            <div className="space-y-5">
                {stats.map((stat, index) => {
                    const percentage = Math.min(((stat.count / stat.total) * 100), 100);
                    return (
                        <div key={index} className="flex flex-col space-y-2">
                            <div className="flex justify-between items-center font-outfit">
                                <span className={`text-[15px] font-semibold tracking-wide ${stat.colorClass}`}>
                                    {stat.label}
                                </span>
                                <span className="text-[14px] font-medium text-slate-400">
                                    <strong className="text-slate-100">{stat.count}</strong> / {stat.total} solved
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1 bg-slate-950/80 border border-slate-900 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-gradient-to-r ${stat.barGradient} rounded-full transition-all duration-1000 ${stat.shadowClass}`} 
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="ml-4 w-10 text-right text-[13px] font-bold font-outfit text-slate-400">
                                    {Math.round(percentage)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ProblemStats
