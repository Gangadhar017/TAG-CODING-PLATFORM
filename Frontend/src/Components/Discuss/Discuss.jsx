import { useEffect, useState } from 'react';
import { fetchTweets } from '../../Services/Tweet.service';
import Reply from './Reply';
import Loading from '../Loading/Loading.jsx';

const Discuss = () => {
    const [tweets, setTweets] = useState(null);
    const [replyToTweetId, setReplyToTweetId] = useState(null);
    const [hasNewReply, setHasNewReply] = useState(false); 
    
    useEffect(() => {
        const helper = async () => {
            const response = await fetchTweets();
            setTweets(response);
        };
        helper();
    }, [replyToTweetId, hasNewReply]);  

    if (tweets === null) return (<Loading/>);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
            
            {/* Ambient background glows */}
            <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative container mx-auto max-w-4xl py-12 px-6 xl:px-12 flex flex-col space-y-8">
                
                {/* Header and Title */}
                <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-900 pb-4 mb-4 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold font-outfit tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Developer Discussion
                        </h1>
                        <p className="text-slate-400 font-outfit text-sm mt-1">Connect, share insights, and discuss solutions</p>
                    </div>
                    <span className="text-[13px] bg-slate-900 text-slate-400 font-semibold font-outfit px-3 py-1.5 rounded-full border border-slate-800">
                        Community Forum
                    </span>
                </div>

                {/* Composer Panel */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-8 rounded-[28px] shadow-xl">
                    <h2 className="text-lg font-bold font-outfit text-white mb-4 tracking-wide">Compose New Thought</h2>
                    <Reply onReplySuccess={() => setHasNewReply(!hasNewReply)} />
                </div>

                {/* Tweets List Container */}
                <div className="space-y-6">
                    {tweets && tweets.length > 0 ? (
                        tweets.map((tweet, index) => (
                            <div 
                                key={index} 
                                className="bg-slate-900/30 backdrop-blur-md border border-slate-900 p-8 rounded-[28px] shadow-lg flex flex-col space-y-5 hover:border-slate-850 transition duration-300 group"
                            >
                                {/* Author metadata */}
                                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 blur"></div>
                                            {tweet?.owner?.avatar ? (
                                                <img 
                                                    src={tweet.owner.avatar} 
                                                    alt="User Avatar" 
                                                    className="relative w-10 h-10 rounded-full object-cover border border-slate-800" 
                                                />
                                            ) : (
                                                <div className="relative w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-slate-300">
                                                    U
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[15px] font-bold font-outfit text-slate-200">
                                            {tweet.owner?.username || 'Unknown User'}
                                        </span>
                                    </div>
                                    <span className="text-slate-500 font-outfit text-[12px] font-medium">
                                        {new Date(tweet.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-slate-300 text-[16px] leading-relaxed font-sans font-medium">
                                    {tweet.content}
                                </p>
                                
                                {tweet.image && (
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-900/80 max-w-full">
                                        <img 
                                            src={tweet.image} 
                                            alt="Post Image" 
                                            className="w-full h-auto object-cover transform group-hover:scale-[1.005] transition duration-500" 
                                        />
                                    </div>
                                )}

                                {/* Replies Panel */}
                                {tweet.replys && tweet.replys.length > 0 && (
                                    <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-2xl flex flex-col space-y-4">
                                        <h3 className="text-slate-400 font-outfit font-bold text-[13px] uppercase tracking-widest border-b border-slate-900/60 pb-2">
                                            Replies
                                        </h3>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {tweet.replys.map((reply, replyIndex) => (
                                                <div 
                                                    key={replyIndex} 
                                                    className="bg-slate-900/20 border border-slate-900/60 p-4 rounded-xl flex flex-col space-y-2.5"
                                                >
                                                    <div className="flex items-center justify-between border-b border-slate-900/40 pb-1.5">
                                                        <div className="flex items-center space-x-2">
                                                            {reply?.owner?.avatar && (
                                                                <img 
                                                                    src={reply.owner.avatar} 
                                                                    alt="Reply Avatar" 
                                                                    className="w-6 h-6 rounded-full object-cover border border-slate-800" 
                                                                />
                                                            )}
                                                            <span className="text-[13px] font-bold font-outfit text-slate-300">
                                                                {reply.owner?.username || 'Unknown User'}
                                                            </span>
                                                        </div>
                                                        <span className="text-slate-500 font-outfit text-[11px] font-medium">
                                                            {new Date(reply.createdAt).toLocaleDateString(undefined, {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 text-[13.5px] font-sans font-medium leading-relaxed">
                                                        {reply.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Inline reply editor toggle */}
                                {replyToTweetId === tweet._id && (
                                    <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl mt-4">
                                        <Reply replyOf={replyToTweetId} onReplySuccess={() => setHasNewReply(!hasNewReply)} />
                                    </div>
                                )}

                                {/* Card Actions */}
                                <div className="flex justify-end font-outfit mt-4">
                                    <button 
                                        onClick={() => setReplyToTweetId(replyToTweetId === tweet._id ? null : tweet._id)}
                                        className={`py-2 px-6 font-semibold text-[14px] border rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 ${
                                            replyToTweetId === tweet._id
                                                ? 'bg-red-950/20 text-red-400 border-red-900/40 hover:bg-red-600 hover:text-white hover:border-red-500'
                                                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border-slate-700/60'
                                        }`}
                                    >
                                        {replyToTweetId === tweet._id ? 'Cancel' : 'Reply'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-900/20 border border-slate-900/60 rounded-[28px]">
                            <span className="text-5xl">💬</span>
                            <div className="text-slate-400 font-outfit font-semibold text-lg">No discussions yet</div>
                            <p className="text-slate-500 text-sm max-w-sm font-sans leading-relaxed">Be the first to share your thoughts, solutions, or questions with the developer community!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discuss;
