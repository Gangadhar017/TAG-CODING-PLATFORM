import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';
import { getProblemService } from '../../Services/Problem.service.js';
import Solution from './Solution.jsx';
import Description from './Description.jsx';
import DiscussProblem from './DiscussProblem.jsx';
import EditorBox from '../Editor/EditorBox.jsx';
import Submissions from '../Submission/Submissions.jsx';
import { useLocation } from 'react-router-dom';

const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
};

function Problem() {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [activeTab, setActiveTab] = useState('description'); 
    const location = useLocation();
    const { solved } = location.state || {};

    useEffect(() => {
        const helper = async () => {
            const response = await getProblemService(id);
            if (response) setProblem(response);
        }
        helper();
    }, [id]);

    if (!problem) return <Loading />

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

            {/* Ambient gradients */}
            <div className="absolute top-24 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative flex-1 container mx-auto flex flex-col lg:flex-row gap-6 p-6">
                
                {/* Left Column: Problem Details Tab System */}
                <div className="w-full lg:w-1/2 flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-900 p-6 rounded-[28px] shadow-xl min-h-[80vh]">
                    
                    {/* Tab Navigation header */}
                    <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-900/60 overflow-x-auto max-w-full">
                            {[
                                { id: 'description', label: 'Description' },
                                { id: 'solution', label: 'Solution' },
                                { id: 'discuss', label: 'Discuss' },
                                { id: 'submissions', label: 'Submissions' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`px-4 py-2 text-[13.5px] font-semibold font-outfit rounded-lg focus:outline-none transition-all duration-300 ${
                                        activeTab === tab.id 
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Solved Glow Indicator */}
                        {solved && (
                            <div className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-outfit text-xs font-bold shadow-sm">
                                <span className="text-sm">✓</span>
                                <span>Solved</span>
                            </div>
                        )}
                    </div>

                    {/* Problem Meta */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight">
                            {problem.title}
                        </h1>
                        <div className="flex items-center mt-3">
                            <span className={`inline-block px-3 py-1 text-xs font-bold font-outfit rounded-full uppercase tracking-wider ${difficultyColors[problem.difficulty]}`}>
                                {problem.difficulty}
                            </span>
                        </div>
                    </div>

                    {/* Tab Content Panel */}
                    <div className="flex-1 flex flex-col overflow-y-auto pr-1 custom-scrollbar">
                        {activeTab === 'description' && (<Description problem={problem}/>)}
                        {activeTab === 'solution' && (<Solution solution={problem.solution}/>)}
                        {activeTab === 'discuss' && (<DiscussProblem id={id}/>)}
                        {activeTab === 'submissions' && (<Submissions problem_id={id} displayproblem={false}/>)}
                    </div>
                </div>

                {/* Right Column: Code Editor */}
                <div className="w-full lg:w-1/2 flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-900 p-6 rounded-[28px] shadow-xl min-h-[80vh]">
                    <EditorBox problem={problem}/>
                </div>
            </div>
        </div>
    );
}

export default Problem;
