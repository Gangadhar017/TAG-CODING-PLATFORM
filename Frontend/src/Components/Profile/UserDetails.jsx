import React from 'react'
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function UserDetails({ user }) {
    const navigate = useNavigate();
    
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center w-full">
            {/* Avatar container with glowing ring */}
            <div className="relative group mb-6 mt-2">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
                <img 
                    src={user.avatar} 
                    alt="User Avatar" 
                    className="relative h-48 w-48 rounded-3xl object-cover shadow-2xl border border-slate-800" 
                />
            </div>

            {/* Profile actions */}
            <button 
                onClick={() => navigate('/editprofile')} 
                className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/60 font-semibold font-outfit py-2.5 rounded-2xl shadow-md transition duration-300 transform hover:-translate-y-0.5"
            >
                Edit Avatar
            </button>

            {/* Detailed metadata */}
            <div className="w-full space-y-4 my-8 font-outfit border-t border-slate-900/60 pt-6">
                <div>
                    <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Email</div>
                    <div className="text-[15px] font-medium text-slate-300 truncate mt-0.5">{user.email}</div>
                </div>
                <div>
                    <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Username</div>
                    <div className="text-[15px] font-medium text-slate-300 truncate mt-0.5">@{user.username}</div>
                </div>
            </div>

            {/* Logout button container */}
            <div className="w-full border-t border-slate-900/60 pt-6">
                <LogoutButton />
            </div>
        </div>
    )
}

export default UserDetails
