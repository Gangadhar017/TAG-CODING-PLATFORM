import React from 'react'

function UserTweets({ user }) {
    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
                <h2 className="text-xl font-bold font-outfit text-white tracking-wide">Your Shared Thoughts</h2>
                <span className="text-[13px] bg-slate-800 text-slate-400 font-semibold font-outfit px-3 py-1 rounded-full border border-slate-700/40">
                    {user.mytweets ? user.mytweets.length : 0} Tweets
                </span>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {(user.mytweets && user.mytweets.length > 0) ? (
                    user.mytweets.map((tweet, index) => (
                        <div 
                            key={index} 
                            className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-900 hover:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <img 
                                        src={user.avatar} 
                                        alt="User Avatar" 
                                        className="w-8 h-8 rounded-full object-cover border border-slate-800"
                                    />
                                    <span className="text-[14px] font-bold font-outfit text-slate-200">
                                        {user.fullname}
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
                            
                            <p className="text-slate-300 mb-4 text-[15px] font-medium leading-relaxed font-sans">
                                {tweet.content}
                            </p>

                            {tweet.image && (
                                <div className="relative overflow-hidden rounded-xl border border-slate-900/60 max-w-md">
                                    <img 
                                        src={tweet.image} 
                                        alt="Tweet" 
                                        className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition duration-500"
                                    />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-slate-950/20 border border-slate-900/50 rounded-2xl">
                        <span className="text-4xl">💬</span>
                        <div className="text-slate-400 font-outfit font-semibold text-[15px]">No tweets yet</div>
                        <p className="text-slate-500 text-[13px] max-w-xs font-sans">Share your coding journey or interview experiences with the community!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserTweets
