import { useEffect, useState } from 'react';
import { getMyProfile } from '../../Services/Auth.service';
import Loading from '../Loading/Loading.jsx';
import ProblemStats from './ProblemStats.jsx';
import UserDetails from './UserDetails.jsx';
import UserTweets from './UserTweets.jsx';
import Submissions from '../Submission/Submissions.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('submissions'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await getMyProfile(); 
      setUser(response);
      if (!response) {
        navigate('/login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    };
    fetchUserProfile();
  }, []);

  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative container mx-auto flex flex-col lg:flex-row gap-8 py-10 px-6 xl:px-12">
        {/* Left column (UserDetails) */}
        <div className="w-full lg:w-[320px] shrink-0">
          <UserDetails user={user} />
        </div>
        
        {/* Right column */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-extrabold font-outfit tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {user.fullname}
                </h1>
                <p className="text-slate-400 font-outfit mt-1">Software Engineer & Coding Competitor</p>
              </div>
            </div>
            
            <div className="mt-8">
              <ProblemStats user={user} />
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex flex-col space-y-6">
            <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-900/80 self-center sm:self-start">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-2.5 px-6 font-outfit text-[15px] font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === 'submissions' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/15' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Solved Questions
              </button>
              <button
                onClick={() => setActiveTab('tweets')}
                className={`py-2.5 px-6 font-outfit text-[15px] font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === 'tweets' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/15' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                My Tweets
              </button>
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 rounded-3xl p-6 shadow-xl min-h-[300px]">
              {activeTab === 'tweets' ? (
                <UserTweets user={user} />
              ) : (
                <div className="overflow-hidden rounded-2xl">
                  <Submissions displayproblem={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
