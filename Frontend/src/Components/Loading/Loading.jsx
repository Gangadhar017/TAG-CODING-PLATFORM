import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="relative flex items-center justify-center z-10">
        {/* Outer clockwise spinning ring */}
        <div className="w-24 h-24 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        
        {/* Inner counter-clockwise spinning ring */}
        <div 
          className="absolute w-16 h-16 border-2 border-amber-500/10 border-b-amber-400 rounded-full animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
        ></div>
        
        {/* Center brand pulsing node */}
        <div className="absolute w-6 h-6 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.6)]"></div>
      </div>
      
      <div className="mt-8 text-center z-10">
        <p className="text-slate-500 font-outfit text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
          Loading Workspace
        </p>
      </div>
    </div>
  );
};

export default Loading;
