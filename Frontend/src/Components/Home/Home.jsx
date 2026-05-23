import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';

function Home() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer); 
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    const features = [
        {
            to: "/problems",
            title: "Problemset",
            description: "Practice your algorithms and solve challenges across C, C++, Java, and Python.",
            icon: "💻",
            accentColor: "from-emerald-500/20 to-teal-500/20 hover:border-emerald-500/40",
            iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        },
        {
            to: "/discuss",
            title: "Discuss",
            description: "Engage with other developers, share solutions, and discuss interview questions.",
            icon: "💬",
            accentColor: "from-blue-500/20 to-indigo-500/20 hover:border-blue-500/40",
            iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        },
        {
            to: "/join-interview",
            title: "Join Interview",
            description: "Step into an active collaborative code room to participate in a live technical interview.",
            icon: "🚪",
            accentColor: "from-purple-500/20 to-fuchsia-500/20 hover:border-purple-500/40",
            iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        },
        {
            to: "/host-interview",
            title: "Host Interview",
            description: "Create a collaborative, secure interview room with shared editors and real-time execution.",
            icon: "🎙️",
            accentColor: "from-orange-500/20 to-amber-500/20 hover:border-orange-500/40",
            iconBg: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

            {/* Decorative ambient blur glows */}
            <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-24 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative flex-1 container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 py-16 px-6 xl:px-16">
                
                {/* Left Visual Column */}
                <div className="w-full lg:w-[400px] flex justify-center shrink-0">
                    <div className="relative group">
                        {/* Pulse glow background ring */}
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-amber-500 opacity-20 blur-[20px] group-hover:opacity-40 group-hover:blur-[25px] transition-all duration-700 animate-pulse"></div>
                        <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl flex items-center justify-center">
                            <img 
                                src="/dist/homelogo.png" 
                                alt="TAG Platform Logo" 
                                className="h-72 w-72 rounded-full object-cover transform hover:scale-[1.03] transition-all duration-700 shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Content Column */}
                <div className="flex-1 flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left">
                    <div>
                        <span className="text-[12px] bg-orange-950/40 text-orange-400 font-extrabold tracking-widest uppercase py-1.5 px-4 rounded-full border border-orange-900/50 font-outfit shadow-sm">
                            Next-Gen Coding Ecosystem
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-black font-outfit mt-4 leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                            Welcome to <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">TAG</span>
                        </h1>
                        <p className="text-slate-400 font-medium font-outfit max-w-xl text-lg mt-3">
                            The ultimate, high-performance coding and collaborative technical interview platform built for modern developers.
                        </p>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                        {features.map((feature, index) => (
                            <Link 
                                key={index} 
                                to={feature.to} 
                                className="group w-full"
                            >
                                <div className={`h-full bg-gradient-to-b ${feature.accentColor} hover:bg-slate-900/30 border border-slate-900 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col space-y-3`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${feature.iconBg}`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold font-outfit text-slate-200 group-hover:text-orange-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-400 text-[13.5px] leading-relaxed font-sans">
                                        {feature.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;
