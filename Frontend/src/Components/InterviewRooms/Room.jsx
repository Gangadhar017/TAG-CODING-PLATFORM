import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../Features/useSocket.js';
import Editor from '@monaco-editor/react';
import Timer from './Timer.jsx';
import { runExampleCasesService } from '../../Services/CodeRun.service.js';
import Executing from '../Editor/Executing.jsx'
import ExampleCasesOutput from '../Editor/ExampleCasesOutput.jsx';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { defaultCodes, enterFullScreen } from './helper.js';
import { toast } from 'react-hot-toast';
import peer from '../../Services/peer.js';
import Loading from '../Loading/Loading.jsx';
import { getAllProblemsService, getProblemService } from '../../Services/Problem.service.js';

function Room() {
  const navigate=useNavigate();
  const [question,setquestion]=useState("");
  const [show_share_streams,set_show_share_streams]=useState(0);
  const [code, setCode] = useState(defaultCodes.cpp);
  const [cases, setCases] = useState([
    { id: 1, input: '', output: '' },
    { id: 2, input: '', output: '' }
  ]);

  
  
  const { roomId } = useParams();
  const [remoteUser,setremoteUser]=useState(null);
  const [remoteSocketId,setremoteSocketId]=useState(null);
  const [requsername,setrequestusername]=useState([]);
  const [connectionReady,setconnectionReady]=useState(false);
  
  
  const [exampleCasesExecution, setExampleCasesExecution] = useState(null);
  const location = useLocation();
  const extraInfo = location.state;
  const [previlige,setprevilige]=useState(false);
  const [dbProblems, setDbProblems] = useState([]);
  useEffect(()=>{
      const nonparsedUser = localStorage.getItem('user');
      const user = JSON.parse(nonparsedUser); 
      if(extraInfo && extraInfo._id===user._id)setprevilige(true);
      else if(extraInfo)
      {
          set_show_share_streams(1);
          enterFullScreen();
          setremoteSocketId(extraInfo);
          setconnectionReady(true);
      }
  },[remoteSocketId]);

  useEffect(() => {
    if (previlige) {
      const fetchProblems = async () => {
        const response = await getAllProblemsService();
        if (response) {
          setDbProblems(response);
        }
      };
      fetchProblems();
    }
  }, [previlige]);

  const socket=useSocket();

  const handleJoinRequest=({user,id,requser_id})=>{
    setrequestusername((prev) => {
      return [...prev, { user, id, requser_id }];
    });
  };

  const acceptrequest=(index)=>{
    const setmystreamfunc = async()=>{
      const offer=await peer.getOffer();
      socket.emit("user:call",{remoteSocketId,offer});
    }
    setmystreamfunc();
    
    setconnectionReady(true);
    setremoteUser(requsername[index].user);
    setremoteSocketId(requsername[index].id);
    setrequestusername([]);
    socket.emit('host:req_accepted',{ta:socket.id,user:requsername[index].user,room:roomId,id:requsername[index].id,requser_id:requsername[index].requser_id});
  }

  const help1=()=>{
    if (mystream) {
      const tracks = mystream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    }
    setMystream(null);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.log(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    }
    toast.error('Host Ended call');
    navigate('/join-interview');
  };

  const help2=({msg})=>{
    // if (mystream) {
    //   const tracks = mystream.getTracks();
    //   tracks.forEach(track => {
    //     track.stop();
    //   });
    // }
    // setMystream(null);
    
    if(!msg)
    {
      toast.error("Interviewee left");
      setconnectionReady(false);
      setremoteSocketId(false);
    }
    else toast.error(msg);
    
    //setMystream(null);
  }

  const help3=({code})=>{
    setCode(code);
  }

  const help4=({language})=>{
    setLanguage(language);
    setCode(defaultCodes[language]);
  }

  const help5=({cases})=>{
    setCases(cases);
  }

  const help6=({exampleCasesExecution})=>{
    setExampleCasesExecution(exampleCasesExecution);
  }

  const help7=({question})=>{
    setquestion(question);
  }

  const help9=({})=>{
    if(previlige)
    {
      set_show_share_streams(1);
    }
  }


  const [remoteStream,setRemoteStream]=useState(null);
  useEffect(()=>{
    peer.peer.addEventListener('track',async ev =>{
      const rstream=ev.streams;
      console.log("GOT TRACKS");
      setRemoteStream(rstream[0]);
    })
  },[])

  const handleNegotiation=async()=>{
    const offer=await peer.getOffer();
    socket.emit('peer:nego:needed',{offer,to:remoteSocketId});
  }

  useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded',handleNegotiation);
    return ()=>{
      peer.peer.removeEventListener('negotiationneeded',handleNegotiation);
    }
  },[handleNegotiation])


  useEffect(()=>{
    const sthel=async()=>{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setMystream(stream);
    }
    sthel();
    //if(mystream && !previlige)sendstreams();
  },[])

  const handleIncommingCall=async({from,offer})=>{
    const answer=await peer.getAnswer(offer);
    setremoteSocketId(from);
    socket.emit('call:accepted',{to:from,answer});
  }

  const sendstreams=()=>{
    console.log("MS-",mystream);
    console.log("RS-",remoteStream);

    if(mystream)
    {
      const tracks = mystream.getTracks();
      tracks.forEach(track => {
        peer.peer.addTrack(track,mystream);
      });
    }

    if(!previlige)
    {
        socket.emit('set:share_streams',{to:remoteSocketId});
    }
    set_show_share_streams(0);
    
  }

  const handleCallAccepted=async({from,answer})=>{
    peer.setLocalDescription(answer);
    sendstreams();
  }

  const handleNegotiationIncomming=async({from,offer})=>{
    const ans=await peer.getAnswer(offer);
    socket.emit('peer:nego:done',{to:from,ans}); 
  }
  
  const handleFinalNego=async({ans})=>{
    await peer.setLocalDescription(ans)
  }



  useEffect(()=>{
    socket.on('user:requested_to_join',handleJoinRequest);
    socket.on('host:hasleft',help1);
    socket.on('interviewee:hasleft',help2);
    socket.on('change:code',help3);
    socket.on('change:question',help7);
    socket.on('change:language',help4);
    socket.on('change:cases',help5);
    socket.on('run:code',help6);
    socket.on('incomming:call',handleIncommingCall);
    socket.on('call:accepted',handleCallAccepted);
    socket.on('peer:nego:needed',handleNegotiationIncomming);
    socket.on('peer:nego:final',handleFinalNego);
    socket.on('set:share_streams',help9);
    return ()=>{
      socket.off('user:requested_to_join',handleJoinRequest);
      socket.off('host:hasleft',help1);
      socket.off('interviewee:hasleft',help2);
      socket.off('change:code',help3);
      socket.off('change:question',help7);
      socket.off('change:language',help4);
      socket.off('change:cases',help5);
      socket.off('run:code',help6);
      socket.off('incomming:call',handleIncommingCall);
      socket.off('call:accepted',handleCallAccepted);
      socket.off('peer:nego:needed',handleNegotiationIncomming);
      socket.off('peer:nego:final',handleFinalNego);
      socket.off('set:share_streams',help9);
    }
  },[socket,handleJoinRequest,help1,help2,help3,help4,help9,help5,help6,help7,handleIncommingCall,handleCallAccepted,handleNegotiationIncomming,handleFinalNego]);

  const [mystream,setMystream]=useState(null);
  const [isAudioOn,setAudioOn]=useState(true);
  const [isVideoOn,setVideoOn]=useState(true);

  const toggleAudio = () => {
    if (mystream) {
      const audioTrack = mystream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; 
        setAudioOn(audioTrack.enabled); 
      }
    }
  };
  
  const toggleVideo = () => {
    console.log("MS-",mystream);
    console.log("RS-",remoteStream);
    if (mystream) {
      const videoTrack = mystream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; 
        setVideoOn(videoTrack.enabled);
      }
    }
  };
  
  const [language, setLanguage] = useState('cpp');
  const handleLanguageChange = async (newLanguage) => {
      setLanguage(newLanguage);
      setCode(defaultCodes[newLanguage]);
      socket.emit('language:change',{remoteSocketId,language:newLanguage});
  };

  const [theme, setTheme] = useState('vs-dark');
  const handleThemeChange = (newTheme) => {
      setTheme(newTheme);
  };

  const handleInputChange = (index, field, value) => {
    if(!previlige)return;
    const newCases = [...cases];
    newCases[index][field] = value;
    setCases(newCases);
    socket.emit('cases:change',{remoteSocketId,cases:newCases});
  };

  const [executing, setExecuting] = useState(false);
  const clickRun = async() => {
        setExampleCasesExecution(null);
        setExecuting(true);
        const response = await runExampleCasesService(language, code, cases);
        if (response) {
            setExampleCasesExecution(response);
        }
        if(!previlige)
        {
          socket.emit('code:run',{remoteSocketId,exampleCasesExecution:response});
        }
        setExecuting(false);
  };
  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); 
      })
      .catch(() => {
        setCopySuccess(false);
      });
  };

  const exitroom=({msg})=>{
    if (mystream) {
      const tracks = mystream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    }
    setMystream(null);
    if(previlige)
    {
      socket.emit('host:leave',{remoteSocketId,room:roomId});
      navigate('/host-interview');
    }
    else 
    {
      socket.emit('interviewee:leave',{remoteSocketId,room:roomId,msg});
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.log(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      }
      navigate('/join-interview');
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !previlige) {
        toast.error("You Tried to exit Fullscreen");
        socket.emit('interviewee:leave',{remoteSocketId,room:roomId,msg:"Interviewee has Exited Fullscreen"});
      }
    };
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !previlige) {
            toast.error("You tried to switch Tab");
            socket.emit('interviewee:leave',{remoteSocketId,room:roomId,msg:"Interviewee tried to switch Tab"});
        }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  const changecode=(e)=>{
    setCode(e);
    socket.emit('code:change',{remoteSocketId,code:e});
  }

  const changeQs = (e) => {
    const newQuestion = e.target.value;
    setquestion(newQuestion);
    socket.emit('question:change', { remoteSocketId, question: newQuestion });
  };

  const [showQuestion, setShowQuestion] = useState(false);
  const dropdownqs = () => {
    setShowQuestion((prev) => !prev);
  };

  const handleLoadSeededProblem = async (problemId) => {
    if (!problemId) return;
    toast.loading("Loading problem details...", { id: "load-prob" });
    const fullProblem = await getProblemService(problemId);
    if (fullProblem) {
      const formattedQs = `TITLE: ${fullProblem.title}
DIFFICULTY: ${fullProblem.difficulty.toUpperCase()}

DESCRIPTION:
${fullProblem.description}

CONSTRAINTS:
${fullProblem.constraints && fullProblem.constraints.length > 0 ? fullProblem.constraints.map(c => `- ${c}`).join('\n') : "None"}

INPUT FORMAT:
${fullProblem.input_format || "Standard input"}

OUTPUT FORMAT:
${fullProblem.output_format || "Standard output"}
`;
      
      setquestion(formattedQs);
      socket.emit('question:change', { remoteSocketId, question: formattedQs });

      if (fullProblem.example_cases && fullProblem.example_cases.length > 0) {
        const newCases = fullProblem.example_cases.map((ec, idx) => ({
          id: idx + 1,
          input: ec.input,
          output: ec.output
        }));
        setCases(newCases);
        socket.emit('cases:change', { remoteSocketId, cases: newCases });
      }
      toast.success("Problem loaded and synced successfully!", { id: "load-prob" });
    } else {
      toast.error("Failed to load problem details.", { id: "load-prob" });
    }
  };

  const handleAddCase = () => {
    if (!previlige) return;
    const newCases = [...cases, { id: Date.now(), input: '', output: '' }];
    setCases(newCases);
    socket.emit('cases:change', { remoteSocketId, cases: newCases });
  };

  const handleRemoveCase = (indexToRemove) => {
    if (!previlige) return;
    if (cases.length <= 1) {
      toast.error("At least one testcase is required");
      return;
    }
    const newCases = cases.filter((_, idx) => idx !== indexToRemove);
    setCases(newCases);
    socket.emit('cases:change', { remoteSocketId, cases: newCases });
  };

  if(!mystream)
  {
    return (
      <>
        <Loading/>
      </>
    )
  }

  return (
    <div className="min-h-screen lg:h-screen p-6 bg-slate-950 text-slate-100 flex flex-col lg:flex-row gap-6 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-24 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Left panel: Actions, Timer & Testcases */}
      <div className="w-full lg:w-1/4 flex flex-col bg-slate-900/30 backdrop-blur-md border border-slate-900/80 p-6 rounded-[28px] shadow-xl space-y-6 z-10 shrink-0">
        <div className="flex flex-col space-y-6">
          
          {/* Hardware & Exit controls */}
          <div className="flex items-center justify-center gap-3">
            <button 
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-500 p-3.5 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center" 
              onClick={exitroom}
              title="Exit Room"
            >
              <img className="h-5.5 w-5.5 filter invert-[45%] sepia-[90%] saturate-[2000%] hue-rotate-[335deg]" src="/endcall.png" alt="end call" />
            </button>
            <button 
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center ${
                isAudioOn 
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700/60 shadow-sm' 
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/25 shadow-md shadow-rose-500/5'
              }`} 
              onClick={toggleAudio}
              title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              <img className="h-5.5 w-5.5" src={isAudioOn ? '/micon.png' : '/micoff.png'} alt="Microphone" />
            </button>
            <button 
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center ${
                isVideoOn 
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700/60 shadow-sm' 
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/25 shadow-md shadow-rose-500/5'
              }`} 
              onClick={toggleVideo}
              title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              <img className="h-5.5 w-5.5" src={isVideoOn ? '/camera-on.png' : '/camera-off.png'} alt="Camera" />
            </button>
          </div>

          {/* Test cases panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-outfit text-white tracking-wide border-b border-slate-900 pb-2">
              Test Cases
            </h3>
            {executing ? (
              <Executing text="Executing" />
            ) : (
              <>
                {exampleCasesExecution ? (
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 max-h-[30vh] overflow-y-auto custom-scrollbar shadow-inner">
                      <ExampleCasesOutput exampleCasesExecution={exampleCasesExecution} />
                    </div>
                    <button 
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold font-outfit border border-slate-700/60 transition duration-300" 
                      onClick={() => setExampleCasesExecution(null)}
                    >
                      Reset Testcases
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                    {cases.map((exampleCase, index) => (
                      <div key={exampleCase.id} className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-2xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-900/40 pb-1.5">
                          <span className="text-[12px] font-bold font-outfit text-orange-400/80 uppercase tracking-widest">
                            Case {index + 1}
                          </span>
                          {previlige && (
                            <button
                              onClick={() => handleRemoveCase(index)}
                              className="text-[11px] font-bold font-outfit text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/20 hover:border-rose-500/40 transition duration-300"
                              title="Delete Test Case"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="pb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Input</label>
                          <input
                            type="text"
                            value={exampleCase.input}
                            onChange={(e) => handleInputChange(index, 'input', e.target.value)}
                            readOnly={!previlige}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-mono text-[13px] placeholder-slate-700 transition"
                          />
                        </div>
                        <div>
                          <label className="pb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expected Output</label>
                          <input
                            type="text"
                            value={exampleCase.output}
                            onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                            readOnly={!previlige}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-mono text-[13px] placeholder-slate-700 transition"
                          />
                        </div>
                      </div>
                    ))}
                    {previlige && (
                      <button
                        onClick={handleAddCase}
                        className="w-full py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 hover:border-orange-500/40 rounded-xl font-bold font-outfit text-xs transition duration-300 shadow-sm"
                      >
                        + Add Test Case
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            
            {/* Embedded modern shared timer */}
            <div className="pt-2">
              <Timer previlige={previlige} remoteSocketId={remoteSocketId} />
            </div>
          </div>

        </div>
      </div>

      {/* Middle panel: Code Editor Workbench */}
      <div className="flex-1 flex flex-col bg-slate-900/30 backdrop-blur-md border border-slate-900 p-6 rounded-[28px] shadow-xl z-10 overflow-hidden">
        <div className="flex flex-col h-full relative">
          
          {/* Coding workbench headers */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-900 pb-4 mb-4">
            
            {/* Workbench Actions */}
            <div className="flex space-x-3">
              <button 
                onClick={clickRun} 
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-outfit rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all duration-300"
              >
                Run
              </button>
              <button 
                onClick={dropdownqs} 
                className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white font-bold font-outfit rounded-xl border border-slate-750 transition-all duration-300"
              >
                See Question
              </button>

              {/* Responsive custom design see-question modal overlay */}
              {showQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
                  <div className="bg-slate-900 border border-slate-850 rounded-[32px] max-w-3xl w-full p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
                    
                    <div className="flex justify-between items-center pb-4 border-b border-slate-850 mb-6">
                      <h2 className="text-2xl font-bold font-outfit bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Coding Assignment
                      </h2>
                      <button 
                        onClick={dropdownqs} 
                        className="text-slate-400 hover:text-white transition text-xl font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      {previlige ? (
                        <>
                          {dbProblems.length > 0 && (
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col gap-2 font-outfit">
                              <label className="text-[12px] font-bold text-orange-400/80 uppercase tracking-widest">
                                Load Seeded Problem
                              </label>
                              <select
                                onChange={(e) => handleLoadSeededProblem(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500/30 text-sm font-semibold cursor-pointer transition duration-300"
                                defaultValue=""
                              >
                                <option value="" disabled>-- Select a pre-seeded coding problem --</option>
                                {dbProblems.map((p) => (
                                  <option key={p._id} value={p._id}>
                                    {p.title} ({p.difficulty})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <textarea
                            value={question}
                            onChange={(e) => {changeQs(e)}}
                            className="w-full h-[35vh] p-5 rounded-2xl bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-mono text-[14px] leading-relaxed resize-none custom-scrollbar"
                            placeholder="Write or edit the programming question here..."
                          />
                        </>
                      ) : (
                        <p className="whitespace-pre-wrap text-slate-300 font-sans text-[15px] leading-relaxed bg-slate-950/40 border border-slate-950 p-6 rounded-2xl">
                          {question || "The interviewer has not added a question description yet."}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={dropdownqs} 
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold font-outfit rounded-xl border border-slate-700/60 transition duration-300"
                      >
                        Back to Editor
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Workbench Config Selectors */}
            <div className="flex space-x-3 items-center">
              <select 
                onChange={(e) => handleLanguageChange(e.target.value)}
                value={language}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-outfit text-sm font-semibold cursor-pointer transition duration-300"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>

              <select
                onChange={(e) => handleThemeChange(e.target.value)}
                value={theme}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-outfit text-sm font-semibold cursor-pointer transition duration-300"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>

          </div>

          {/* Monaco Editor Canvas Container */}
          <div className="flex-1 p-4 bg-slate-950/60 border border-slate-900 rounded-2xl shadow-inner flex flex-col">
            <Editor 
              height="100%" 
              width="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={(e) => {changecode(e)}}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
              className="rounded-xl overflow-hidden border border-slate-900"
            />
          </div>

        </div>
      </div>
    
      {/* Right panel: Video Feeds & Connection panel */}
      <div className="w-full lg:w-1/4 flex flex-col bg-slate-900/30 backdrop-blur-md border border-slate-900 p-6 rounded-[28px] shadow-xl z-10 shrink-0 overflow-y-auto custom-scrollbar gap-4">
        
        {/* Room code banner */}
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center justify-between shadow-sm shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Session ID</span>
            <p className="text-lg font-bold font-mono text-white tracking-wider mt-0.5">{roomId}</p>
          </div>
          {copySuccess ? (
            <span className="text-xs text-orange-400 font-bold font-outfit bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/25">
              Copied!
            </span>
          ) : (
            <button 
              onClick={handleCopy} 
              className="bg-slate-950 hover:bg-slate-900 border border-slate-850 p-2 rounded-xl transition duration-300 flex items-center justify-center shrink-0 shadow-inner"
              title="Copy Room ID"
            >
              <img className="w-5 h-5 filter invert-[70%]" src="/copy.png" alt="Copy" />
            </button>
          )}
        </div>

        {/* Video Streams Container (Always Visible!) */}
        <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-2xl shadow-inner flex flex-col gap-4">
          
          {/* Peer Video Card */}
          <div className="bg-slate-900/60 border border-slate-900/80 p-3.5 rounded-xl flex flex-col items-center">
            <h3 className="text-xs font-bold font-outfit mb-2.5 text-slate-300 tracking-wide">
              {connectionReady && remoteUser ? remoteUser.fullname : (previlige ? 'Candidate' : 'Interviewer')}
            </h3>
            <div className="bg-slate-950 h-36 w-full rounded-xl flex justify-center items-center text-slate-400 shadow-inner border border-slate-900 overflow-hidden relative">
              {connectionReady && remoteStream ? (
                <video
                  ref={videoRef => {
                    if (videoRef && remoteStream) {
                      videoRef.srcObject = remoteStream;
                      videoRef.muted = false;
                    }
                  }}
                  autoPlay
                  playsInline
                  className="rounded-xl h-full w-full object-cover border border-emerald-500/20"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
                  <p className="text-[11px] font-outfit font-bold text-slate-500 uppercase tracking-widest">
                    Awaiting Partner...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Self Video Card */}
          <div className="bg-slate-900/60 border border-slate-900/80 p-3.5 rounded-xl flex flex-col items-center">
            <h3 className="text-xs font-bold font-outfit mb-2.5 text-slate-300 tracking-wide">You</h3>
            <ReactPlayer muted={!isAudioOn} height="0%" width="0%" url={mystream} />
            <div className="bg-slate-950 h-36 w-full rounded-xl flex justify-center items-center text-slate-400 shadow-inner border border-slate-900 overflow-hidden relative">
              {isVideoOn ? (
                <ReactPlayer 
                  playing={isVideoOn} 
                  muted={!isAudioOn}
                  height="100%" 
                  width="100%" 
                  url={mystream}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl">📷</span>
                  <p className="text-xs font-outfit font-semibold text-slate-500">Camera Off</p>
                </div>
              )}
            </div>
          </div>

          {/* Share stream action */}
          {connectionReady && show_share_streams ? (
            <button 
              onClick={sendstreams} 
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-outfit text-xs rounded-xl shadow-lg transition duration-300"
            >
              Share Stream
            </button>
          ) : null}

        </div>

        {/* Requests & Host Tools (Shown if host and not connected yet) */}
        {previlige && !connectionReady && (
          <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-2xl shadow-inner flex flex-col flex-1 min-h-[150px]">
            <p className="text-[11px] font-bold font-outfit text-slate-400 mb-3 tracking-widest uppercase border-b border-slate-900 pb-1.5">
              Join Requests
            </p>
            {requsername.length ? (
              <div className="space-y-2 overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
                {requsername.map((x, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-900/60 border border-slate-900 p-2.5 rounded-xl gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img className="h-7 w-7 rounded-full border border-slate-800 shrink-0" src={x.user.avatar} alt="avatar" />
                      <p className="text-xs text-slate-200 font-medium truncate font-outfit">{x.user.fullname}</p>
                    </div>
                    <button 
                      onClick={() => {acceptrequest(index)}} 
                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg font-bold text-[10px] transition duration-300 shrink-0"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center m-auto text-center gap-1.5 py-4">
                <span className="text-xl animate-pulse">📡</span>
                <p className="text-[10px] font-outfit font-semibold text-slate-500 tracking-wider">Awaiting connections...</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}

export default Room;
