import React, { useState, useEffect } from 'react';
import { useSocket } from '../../Features/useSocket';

const Timer = ({previlige,remoteSocketId}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState(''); 
  const socket=useSocket();

  const help1=({tm})=>{
    setTime(tm);
  };

  useEffect(()=>{
    socket.on('change:time',help1);
    return ()=>{
      socket.off('change:time',help1);
    };
  },[socket]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(()=>{
    if(previlige)
    {
      socket.emit('time:change',{remoteSocketId,tm:time});
    }
  },[time]);

  const handleStart = () => {
    if (inputTime > 0) {
      setTime(60 * inputTime);
      setIsRunning(true);
      setInputTime('');
    } else if (time > 0) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputTime('');
  };

  const handlePreset = (mins) => {
    setTime(60 * mins);
    setIsRunning(true);
    setInputTime('');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setInputTime(Number(value));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-5 bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-[24px] w-full shadow-lg gap-4 font-sans">
      
      {/* Monospace Clock Face */}
      <div className="w-full flex flex-col items-center select-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5 font-outfit">
          Session Timer
        </span>
        <div className="font-mono text-4xl font-extrabold text-orange-400 bg-slate-950 border border-slate-900 px-6 py-3 rounded-2xl shadow-[inset_0_0_12px_rgba(0,0,0,0.8),0_0_15px_rgba(249,115,22,0.05)] tracking-widest">
          {formatTime(time)}
        </div>
      </div>

      {previlige ? (
        <div className="w-full flex flex-col gap-3.5 pt-3.5 border-t border-slate-900/60">
          
          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-outfit mr-1">Presets:</span>
            {[15, 30, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => handlePreset(mins)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-900 hover:border-slate-800 text-[11px] font-bold font-outfit text-slate-400 hover:text-white rounded-lg transition duration-200 active:scale-95"
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Quick Setup Form */}
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1" 
              value={inputTime || ''} 
              onChange={handleInputChange} 
              placeholder="Custom Mins"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-850 text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-outfit text-xs font-semibold placeholder-slate-700 min-w-0"
            />
            <button 
              onClick={handleStart} 
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold font-outfit text-xs rounded-xl shadow-md transition duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              Set
            </button>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={handleStart} 
              className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl font-outfit text-[11px] font-bold transition duration-300 active:scale-95 shadow-sm shadow-emerald-950/20 text-center"
            >
              {time > 0 && !isRunning ? 'Resume' : 'Start'}
            </button>
            <button 
              onClick={handleStop} 
              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-xl font-outfit text-[11px] font-bold transition duration-300 active:scale-95 shadow-sm shadow-amber-950/20 text-center"
            >
              Pause
            </button>
            <button 
              onClick={handleReset} 
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-xl font-outfit text-[11px] font-bold transition duration-300 active:scale-95 shadow-sm shadow-rose-950/20 text-center"
            >
              Reset
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center py-1">
          <span className="text-[10px] bg-slate-950 border border-slate-900 text-slate-500 font-bold font-outfit px-3 py-1 rounded-full uppercase tracking-wider">
            {isRunning ? '⏱️ Interview Active' : '⏱️ Timer Paused'}
          </span>
        </div>
      )}

    </div>
  );
};

export default Timer;
