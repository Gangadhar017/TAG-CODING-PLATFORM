import { useEffect, useState } from 'react';
import { getSubmissionService } from '../../Services/Submissions.service.js';
import Loading from '../Loading/Loading.jsx';
import SubmissionCard from './SubmissionCard.jsx';

function Submissions({ problem_id,displayproblem}) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { 
        const fetchSubmissions = async () => {
            setLoading(true); 
            const response = await getSubmissionService(problem_id);
            setSubmissions(response);
            setLoading(false); 
        };
        fetchSubmissions();
    }, []);

    return (
        <div className="p-6 bg-slate-900/30 border border-slate-900/80 rounded-[28px] max-h-[75vh] overflow-y-auto custom-scrollbar shadow-lg">
            {loading ? (
                <Loading />
            ) : submissions.length === 0 ? (
                <div className="bg-slate-950/60 border border-slate-900/80 text-slate-500 font-bold font-outfit py-12 px-6 rounded-2xl text-center flex flex-col gap-2">
                    <span className="text-3xl">📭</span>
                    <p className="text-md">No code submissions found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission, index) => (
                        <SubmissionCard key={index} submission={submission} displayproblem={displayproblem} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Submissions;
