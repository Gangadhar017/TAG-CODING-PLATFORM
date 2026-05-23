import { useEffect } from 'react';
import { isLoggedIn } from '../../Services/Auth.service.js';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../../Features/useSocket.js';
import { generateRoomId } from './helper.js';

function HostInterview() {
    const socket = useSocket();
    const navigate = useNavigate();

    const handleJoinRoom = (data) => {
        const {user,room} = data;
        navigate(`/room/${room}`,{state:user});
    };

    useEffect(() => {
        socket.on('room:join', handleJoinRoom);
        return () => {
            socket.off('room:join', handleJoinRoom);
        };
    }, [socket]);

    const handleCreateRoom = (e) => {
        e.preventDefault();
        const nonparsedUser = localStorage.getItem('user');
        const user = JSON.parse(nonparsedUser);
        const randomRoomId = generateRoomId();
        socket.emit('create-room', { room: randomRoomId, user});
    };

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
                            <h2 className="text-3xl font-extrabold font-outfit text-white tracking-wide text-center">
                                Host Room
                            </h2>
                            <p className="text-slate-400 text-center font-sans text-sm leading-relaxed">
                                Ready to interview? Generate a unique collaborative room instantly. Share the generated token with your candidate or peer to begin.
                            </p>
                            <button
                                onClick={handleCreateRoom}
                                className="w-full py-4 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold font-outfit rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                Create Room
                            </button>
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

export default HostInterview;
