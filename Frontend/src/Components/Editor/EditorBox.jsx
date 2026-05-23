import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { getdefaultlangtempService, updatedefaultlangService, updateTemplateService } from '../../Services/Problem.service.js';
import { isLoggedIn } from '../../Services/Auth.service.js';
import Loading from '../Loading/Loading.jsx';
import { runExampleCasesService, submitCodeService } from '../../Services/CodeRun.service.js';
import Executing from './Executing.jsx';
import LoginToCode from './LoginToCode.jsx';
import ExampleCasesOutput from './ExampleCasesOutput.jsx';
import SampleCases from './SampleCases.jsx';
import SubmissionResult from './SubmissionResult.jsx';

function EditorBox({ problem }) {
    const runButtonRef = useRef(null);

    const defaultCodes = {
        cpp: `#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n\n    return 0;\n}`,
        c: `#include<stdio.h>\n\nint main() {\n    // Your code here\n\n    return 0;\n}`,
        java: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
        python: `def main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()`,
    };

    const [isLoading, setIsLoading] = useState(true);
    const [template, setTemplate] = useState(defaultCodes);
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState(defaultCodes.cpp);
    const [theme, setTheme] = useState('vs-dark');
    const [exampleCasesExecution, setExampleCasesExecution] = useState(null);
    const [executing, setExecuting] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submissionStatus,setsubmissionStatus] =useState(null);

    const loadTemplateAndLanguage = async () => {
        const data = await getdefaultlangtempService();
        if (data) {
            setTemplate(data.template);
            setLanguage(data.default_language);
            setCode(data.template[data.default_language]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadTemplateAndLanguage();
    }, []);

    const handleLanguageChange = async (newLanguage) => {
        setLanguage(newLanguage);
        setCode(template[newLanguage]);
        await updatedefaultlangService(newLanguage);
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const clickRun = async() => {
        setExampleCasesExecution(null);
        setsubmissionStatus(null);
        setExecuting(true);
        const response = await runExampleCasesService(language, code, problem.example_cases);
        if (response) {
            setExampleCasesExecution(response);
        }
        setExecuting(false);
    };

    const submitCode=async()=>{
        setExampleCasesExecution(null);
        setsubmissionStatus(null);
        setSubmitting(true);
        const response=await submitCodeService(language,code,problem._id);
        if(response)
        {
            setsubmissionStatus(response);
        }
        setSubmitting(false);
    }

    if(isLoading) return <Loading />;
    return (
        <div className="w-full flex flex-col">
            {!isLoggedIn() ? (
                <LoginToCode />
            ) : (
                <div className="bg-slate-900/30 backdrop-blur-md border border-slate-900 p-6 rounded-[28px] shadow-xl relative">
                    {/* Header controls toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-900 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <button 
                                ref={runButtonRef}
                                onClick={clickRun}
                                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-outfit rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all duration-300"
                            >
                                Run
                            </button>
                            {problem && (
                                <button 
                                    onClick={submitCode}
                                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold font-outfit rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-300"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
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

                            <button
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 rounded-xl font-semibold font-outfit text-xs transition duration-300 shadow-md active:scale-[0.98]"
                                onClick={async () => {
                                    await updateTemplateService(language, { code });
                                    setIsLoading(true);
                                    loadTemplateAndLanguage();
                                }}
                            >
                                Set as Template
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor Container */}
                    <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl shadow-inner my-4">
                        <Editor
                            height="63vh"
                            width="100%"
                            language={language}
                            value={code}
                            theme={theme}
                            onChange={(e) => setCode(e)}
                            onMount={(editor, monaco) => {
                                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                                    if (runButtonRef.current) {
                                        runButtonRef.current.click();
                                    }
                                });
                            }}
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
                    {submitting ? (
                        <Executing text="Submitting" />
                    ) : (
                        <>
                            {submissionStatus ? (
                                <SubmissionResult submissionStatus={submissionStatus} />
                            ) : (
                                <>
                                    {problem && (
                                        <div className="mt-4">
                                            {executing ? (
                                                <Executing text="Executing" />
                                            ) : (
                                                <>
                                                    {exampleCasesExecution ? (
                                                        <ExampleCasesOutput exampleCasesExecution={exampleCasesExecution} />
                                                    ) : (
                                                        <SampleCases example_cases={problem.example_cases} />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default EditorBox;
