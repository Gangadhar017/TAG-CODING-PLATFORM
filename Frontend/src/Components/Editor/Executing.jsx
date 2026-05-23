import React from 'react';

const Executing = ({text}) => {
    return (
        <div className="p-8 rounded-[24px] bg-slate-950/75 border border-slate-900 backdrop-blur-md flex items-center justify-center z-50 relative overflow-hidden shadow-2xl">
            {/* Subtle glow underlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-orange-500/10 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center gap-4 py-4 px-10 text-center">
                <div className="relative flex items-center justify-center">
                    {/* Glowing spinner */}
                    <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                    {/* Inner glowing dot */}
                    <div className="absolute w-3 h-3 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
                </div>
                <p className="text-xs font-bold font-outfit text-slate-300 tracking-[0.15em] uppercase animate-pulse">
                    {text}...
                </p>
            </div>
        </div>
    );
};

export default Executing;
