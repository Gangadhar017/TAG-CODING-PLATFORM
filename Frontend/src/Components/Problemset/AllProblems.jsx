import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProblemsService } from '../../Services/Problem.service';
import Loading from '../Loading/Loading.jsx';
import { getSolvedProblemService } from '../../Services/Submissions.service.js';

const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
};

const AllProblems = () => {
    const [solvedProblems, setSolvedProblems] = useState(new Set());
    const navigate = useNavigate();
    const [problems, setproblems] = useState(null);
    const [debugInfo, setDebugInfo] = useState("Initializing...");

    useEffect(() => {
        const helper = async () => {
            try {
                setDebugInfo("Fetching problems from service...");
                const response1 = await getAllProblemsService();
                
                if (response1) {
                    setDebugInfo(`Problems successfully loaded: ${response1.length} items.`);
                    setproblems(response1);
                } else {
                    setDebugInfo("Problems service returned falsy. (Database empty or Server unreachable)");
                    setproblems([]);
                }
                
                const response2 = await getSolvedProblemService();
                if (response2) setSolvedProblems(response2);
            } catch (err) {
                setDebugInfo(`Exception caught in helper: ${err.message || String(err)}`);
                setproblems([]);
            }
        };
        helper();
    }, []);

    if (!problems) return <Loading />;

    const totalProblems = problems.length;
    const solvedCount = problems.filter(p => solvedProblems.has(p._id)).length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

            {/* Ambient gradients */}
            <div className="absolute top-24 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-24 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative container mx-auto flex flex-col lg:flex-row gap-8 py-12 px-6 xl:px-12">
                
                {/* Left Card: Summary Stats */}
                <div className="w-full lg:w-[320px] shrink-0">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
                            <img 
                                src="/homelogo.png" 
                                alt="Logo" 
                                className="relative h-32 w-32 rounded-full object-cover shadow-2xl border border-slate-800"
                            />
                        </div>

                        <h2 className="text-xl font-bold font-outfit text-white mb-2 text-center">Problem Dashboard</h2>
                        <p className="text-slate-400 text-xs font-outfit text-center mb-6">Master your coding skills</p>
                        
                        <div className="w-full space-y-4 font-outfit border-t border-slate-900/60 pt-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Total Problems</span>
                                <span className="text-[16px] font-extrabold text-slate-200">{totalProblems}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">Solved</span>
                                <span className="text-[16px] font-extrabold text-emerald-400">{solvedCount}</span>
                            </div>
                        </div>

                        {/* Progress ring or visual bar */}
                        <div className="w-full mt-6">
                            <div className="w-full bg-slate-950/80 border border-slate-900 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                                    style={{ width: `${totalProblems ? (solvedCount / totalProblems) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Problems Table */}
                <div className="flex-1 flex flex-col space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-900 pb-4">
                        <h1 className="text-4xl font-extrabold font-outfit tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Problemset
                        </h1>
                        <span className="text-[13px] bg-slate-900 text-slate-400 font-semibold font-outfit px-3 py-1.5 rounded-full border border-slate-800">
                            Practice Arena
                        </span>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between shadow-inner">
                      <span className="truncate"><strong>System Status:</strong> {debugInfo}</span>
                      <button 
                        onClick={async () => {
                          setDebugInfo("Re-fetching problems manually...");
                          try {
                            const res = await getAllProblemsService();
                            if (res) {
                              setDebugInfo(`Manual re-fetch successful: ${res.length} items.`);
                              setproblems(res);
                            } else {
                              setDebugInfo("Manual re-fetch returned falsy. (Check network/database)");
                            }
                          } catch (e) {
                            setDebugInfo(`Manual re-fetch error: ${e.message || String(e)}`);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] font-bold text-orange-400 hover:text-orange-300 transition shrink-0 ml-4 uppercase tracking-wider"
                      >
                        Retry
                      </button>
                    </div>

                    <div className="bg-slate-900/20 backdrop-blur-md border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="border-b border-slate-900 bg-slate-900/60 font-outfit text-[12px] font-bold text-slate-400 uppercase tracking-wider text-left">
                                    <th className="px-8 py-5">Title</th>
                                    <th className="px-6 py-5 text-center w-36">Difficulty</th>
                                    <th className="px-8 py-5 text-center w-24">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900/60 font-sans">
                                {problems.map((problem, index) => (
                                    <tr 
                                        key={problem._id} 
                                        onClick={() => {
                                            navigate(`/problems/${problem._id}`, { state: { solved: solvedProblems.has(problem._id) } });
                                        }} 
                                        className="hover:bg-slate-900/40 transition duration-300 ease-in-out cursor-pointer group"
                                    >
                                        <td className="px-8 py-4 whitespace-nowrap text-[15px] font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                                            {index + 1}. {problem.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-block px-3 py-1 text-xs font-bold font-outfit rounded-full uppercase tracking-wider ${difficultyColors[problem.difficulty]}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center">
                                                {solvedProblems.has(problem._id) ? (
                                                    <span className="text-xl text-emerald-400 bg-emerald-500/10 w-7 h-7 rounded-full flex items-center justify-center border border-emerald-500/20">
                                                        ✓
                                                    </span>
                                                ) : (
                                                    <span className="text-[13px] font-semibold font-outfit text-slate-600">—</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AllProblems;
