import { useEffect, useState } from 'react'
import { isLoggedIn} from '../../Services/Auth.service.js'
import { Link, useNavigate } from 'react-router-dom'
import { useSocket } from '../../Features/useSocket.js';
import Executing from '../Editor/Executing.jsx';

function JoinInterview() {
    const socket=useSocket();
    const navigate=useNavigate();
    const [room,setroom]=useState('');
    const [joining,setjoining]=useState(false);


    const handleJoinRoom = (data)=>{
        const {ta,room,id,requser_id}=data;
        if(room==='')return;
        setjoining(false);
        navigate(`/room/${room}`,{state:ta});
        console.log('id isss-',ta);
    }

    useEffect(()=>{
        socket.on('room:join',handleJoinRoom);
        return ()=>{
            socket.off('room:join',handleJoinRoom);
        }
    },[socket]);

    const handleSubmit=(e)=>{
        if(room=="")return;
        e.preventDefault();
        const nonparsedUser=localStorage.getItem('user');
        const user = JSON.parse(nonparsedUser); 
        setjoining(true); 
        socket.emit('room:join_request',{room,user,id:socket.id});
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden">
            {/* Ambient gradients */}
            <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center bg-slate-900/40 backdrop-blur-md border border-slate-900 p-8 md:p-16 rounded-[32px] shadow-2xl">
                
                {/* Left Visual side */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-4">
                    <div className="relative group mb-8">
                        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
                        <img 
                            src="/dist/homelogo.png" 
                            alt="Logo" 
                            className="relative h-60 w-60 md:h-72 md:w-72 rounded-full object-cover shadow-2xl border border-slate-800/80" 
                        />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold font-outfit tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                        TAG Interview Rooms
                    </h1>
                    <p className="text-slate-400 font-outfit text-sm md:text-[15px] mt-3 max-w-sm leading-relaxed">
                        Host real-time cooperative code pairing sessions with video streams, shared timers, and shared execution workspaces.
                    </p>
                </div>

                {/* Right Action side */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                    {isLoggedIn() ? (
                        <div className="w-full max-w-md bg-slate-950/60 border border-slate-900 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col gap-6">
                            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                <label htmlFor="roomId" className="text-3xl font-extrabold font-outfit text-white tracking-wide text-center">
                                    Join Room
                                </label>
                                <p className="text-slate-400 text-center font-sans text-sm leading-relaxed">
                                    Got a session token? Enter your collaborative room ID below to join the pair programming workbench.
                                </p>
                                <input 
                                    type="text" 
                                    id="roomId" 
                                    value={room} 
                                    onChange={(e) => setroom(e.target.value)}
                                    className="px-5 py-4 rounded-2xl bg-slate-900 border border-slate-850 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-300 placeholder-slate-500 font-medium"
                                    placeholder="Enter Room ID"
                                />
                                {joining ? (
                                    <div className="mt-2">
                                        <Executing text="Joining room" />
                                    </div>
                                ) : (
                                    <button 
                                        onClick={(e) => handleSubmit(e)}
                                        className="w-full py-4 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold font-outfit rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    >
                                        Join Room
                                    </button>
                                )}
                            </form>
                        </div>
                    ) : (
                        <div className="w-full max-w-md bg-slate-950/60 border border-slate-900 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col gap-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-2xl shadow-inner">
                                🔐
                            </div>
                            <h2 className="text-2xl font-bold font-outfit text-white">Authentication Required</h2>
                            <p className="text-slate-400 text-sm font-sans leading-relaxed">
                                Please log in to create or host private video pairing session workspaces.
                            </p>
                            <Link
                                to="/login"
                                className="w-full py-3.5 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold font-outfit rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center block"
                            >
                                Login Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JoinInterview;
