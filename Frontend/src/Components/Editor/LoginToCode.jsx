import React from 'react'
import { Link } from 'react-router-dom'

function LoginToCode() {
    return (
        <div className="flex items-center justify-center min-h-[450px] py-16 px-6 bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-[28px] text-white font-sans relative overflow-hidden shadow-xl">
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-orange-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 text-center max-w-sm flex flex-col items-center gap-5 p-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center text-2xl shadow-inner">
                    🔐
                </div>
                <h2 className="text-2xl font-bold font-outfit text-white tracking-wide">
                    Coding Workspace Locked
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Please log in to your developer profile to open this editor, save templates, run compilation test cases, and submit your code.
                </p>
                <Link 
                    to="/login"
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold font-outfit rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center block"
                >
                    Login Now
                </Link>
            </div>
        </div>
    );
}

export default LoginToCode
