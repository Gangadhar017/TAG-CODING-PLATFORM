import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { saveInputFiles } from './saveCodeFile.middleware.js';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatically add Docker installation path to PATH on Windows if missing
if (process.platform === 'win32') {
    const dockerPaths = [
        'C:\\Program Files\\Docker\\Docker\\resources\\bin',
    ];
    for (const p of dockerPaths) {
        if (fs.existsSync(p)) {
            for (const key of ['PATH', 'Path', 'path']) {
                let val = process.env[key] || '';
                if (!val.toLowerCase().includes(p.toLowerCase())) {
                    process.env[key] = val ? `${p};${val}` : p;
                }
            }
        }
    }
}

// Cache for Docker availability
let dockerChecked = false;
let isDockerRunning = false;

const checkDocker = async () => {
    if (dockerChecked) return isDockerRunning;
    try {
        await execPromise('docker ps');
        isDockerRunning = true;
    } catch (err) {
        console.log("Docker is not running or not installed. Falling back to local execution.");
        isDockerRunning = false;
    }
    dockerChecked = true;
    return isDockerRunning;
};

function getExtension(language) {
    switch (language) {
        case 'c': return 'c';
        case 'cpp': return 'cpp';
        case 'python': return 'py';
        case 'java': return 'java';
        default: 
            throw new ApiError(400,"Unsupported Language");
    }
}

function getDockerImage(language) {
    switch (language) {
        case 'c': return 'gcc';
        case 'cpp': return 'gcc';
        case 'python': return 'python';
        case 'java': return 'eclipse-temurin';
        default: 
            throw new ApiError(400,"Unsupported Language");
    }
}

function getRunCMD(containerID,filename,language){
    switch (language) {
        case 'c': return `docker exec ${containerID} sh -c "g++ /usr/src/app/${filename}.c -o /usr/src/app/a && /usr/src/app/a < /usr/src/app/${filename}.txt"`;
        case 'cpp': return `docker exec ${containerID} sh -c "g++ /usr/src/app/${filename}.cpp -o /usr/src/app/a && /usr/src/app/a < /usr/src/app/${filename}.txt"`;
        case 'python': return `docker exec ${containerID} sh -c "python3 /usr/src/app/${filename}.py < /usr/src/app/${filename}.txt"`;
        case 'java': return `docker exec ${containerID} sh -c "javac /usr/src/app/${filename}.java && java -cp /usr/src/app ${filename} < /usr/src/app/${filename}.txt"`;
        default: 
            throw new ApiError(400,"Unsupported Language");
    }
}

const formatErrorMessage = (stderr) => {
    const lines = stderr.split('\n');
    const errorLines = [];
    const errorPattern = /[\w-]+\.cpp:(\d+):\d+:\s+(error|warning):\s+(.+)/;
    lines.forEach(line => {
        const match = line.match(errorPattern);
        if (match) {
            const lineNumber = match[1];
            const errorType = match[2];
            const errorMessage = match[3];
            errorLines.push(`Line ${lineNumber} - ${errorType}: ${errorMessage}`);
        }
    });
    return errorLines.length ? errorLines.join('\n') : stderr;
};

// Clean up local files
const cleanupLocalFiles = (filename, language) => {
    const ext = getExtension(language);
    const codeDir = path.join(__dirname, '../../');
    const sourcePath = path.join(codeDir, `${filename}.${ext}`);
    const inputPath = path.join(codeDir, `${filename}.txt`);
    try {
        if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (err) {
        console.error("Error cleaning up local code files:", err);
    }
};

// Run code locally on the host machine
const runLocalCode = async (filename, language, inputVal = null) => {
    const ext = getExtension(language);
    const codeDir = path.join(__dirname, '../../');
    const sourcePath = path.join(codeDir, `${filename}.${ext}`);
    const inputPath = path.join(codeDir, `${filename}.txt`);
    
    if (inputVal !== null) {
        fs.writeFileSync(inputPath, inputVal);
    }

    let compileCmd = '';
    let runCmd = '';

    if (language === 'python') {
        runCmd = `python "${sourcePath}" < "${inputPath}"`;
    } else if (language === 'c' || language === 'cpp') {
        const exePath = path.join(codeDir, `${filename}.exe`);
        compileCmd = `g++ "${sourcePath}" -o "${exePath}"`;
        runCmd = `"${exePath}" < "${inputPath}"`;
    } else if (language === 'java') {
        compileCmd = `javac "${sourcePath}"`;
        runCmd = `java -cp "${codeDir}" Main < "${inputPath}"`;
    } else {
        throw new ApiError(400, "Unsupported Language");
    }

    // Compile step
    if (compileCmd) {
        try {
            await execPromise(compileCmd);
        } catch (compileError) {
            const stderr = compileError.stderr || compileError.message;
            throw { type: 'compile_error', message: stderr };
        }
    }

    // Execution step
    try {
        const TIME_LIMIT = 5000; // 5 seconds
        const runPromise = execPromise(runCmd);
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Time Limit Exceeded")), TIME_LIMIT)
        );

        const result = await Promise.race([runPromise, timeoutPromise]);
        return result.stdout;
    } catch (runError) {
        if (runError.message === "Time Limit Exceeded") {
            throw { type: 'tle', message: 'Time Limit Exceeded' };
        }
        const stderr = runError.stderr || runError.message;
        throw { type: 'runtime_error', message: stderr };
    } finally {
        // Clean up locally compiled executables or class files
        try {
            if (language === 'c' || language === 'cpp') {
                const exePath = path.join(codeDir, `${filename}.exe`);
                if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
            } else if (language === 'java') {
                const classPath = path.join(codeDir, `Main.class`);
                if (fs.existsSync(classPath)) fs.unlinkSync(classPath);
            }
        } catch (cleanupError) {
            console.error('Local runner executable cleanup error:', cleanupError);
        }
    }
};

export const runCompilerDockerContainer = async(filename, language, res) => {
    const useDocker = await checkDocker();
    if (!useDocker) {
        try {
            const stdout = await runLocalCode(filename, language);
            return res.status(201).json(new ApiResponse(200, stdout, "Executed Successfully"));
        } catch (error) {
            console.error("Local execution error:", error);
            const errMsg = error.message || "Execution failed";
            return res.status(403).json({ stderr: formatErrorMessage(errMsg) });
        } finally {
            cleanupLocalFiles(filename, language);
        }
    }

    let containerID = null;
    try {
        const response = await execPromise(`docker run -d ${getDockerImage(language)}:latest sleep infinity`);
        containerID = response.stdout.trim();
        console.log("Container ID:", containerID);

        await execPromise(`docker exec ${containerID} sh -c "mkdir -p /usr/src/app"`);
        await execPromise(`docker cp ${filename}.${getExtension(language)} ${containerID}:/usr/src/app/`);
        await execPromise(`docker cp ${filename}.txt ${containerID}:/usr/src/app/`);

        const result = await execPromise(getRunCMD(containerID,filename,language));
        console.log(result);

        res.status(201).json(new ApiResponse(200, result.stdout, "Executed Successfully"));
    } catch (error) {
        console.error("Error:", error);
        try {
            await execPromise(`docker rm -f ${containerID}`);
        } catch (removeError) {
            console.error('Error removing files:', removeError);
        }
        res.status(500).json({ stderr: error.stderr });
    } finally {
        if (containerID) {
            try {
                await execPromise(`docker rm -f ${containerID}`);
            } catch (removeError) {
                console.error('Error removing Docker container:', removeError);
            }
        }
        cleanupLocalFiles(filename, language);
    }
};

export const runExampleCasesDockerContainer = async (examplecases, language, filename) => {
    const useDocker = await checkDocker();
    if (!useDocker) {
        let res_output = [];
        try {
            for (const x of examplecases) {
                const stdout = await runLocalCode(filename, language, x.input);
                const output = stdout.trim();
                const expectedOutput = x.output.trim();
                const isMatch = output === expectedOutput;

                res_output.push({
                    input: x.input,
                    expectedOutput,
                    actualOutput: output,
                    isMatch,
                });
            }
            return { statusCode: 200, data: res_output };
        } catch (error) {
            console.error("Local example cases execution error:", error);
            if (error.type === 'tle') {
                return { statusCode: 403, data: "TLE" };
            }
            return { statusCode: 403, data: formatErrorMessage(error.message) };
        } finally {
            cleanupLocalFiles(filename, language);
        }
    }

    let containerID = null;
    const TIME_LIMIT = 20000; 
    let res_output = [];

    try {
        const response = await execPromise(`docker run -d ${getDockerImage(language)}:latest sleep infinity`);
        containerID = response.stdout.trim();
        console.log("Container ID:", containerID);
        await execPromise(`docker exec ${containerID} sh -c "mkdir -p /usr/src/app"`);
        await execPromise(`docker cp ${filename}.${getExtension(language)} ${containerID}:/usr/src/app/`);
        for (const x of examplecases) 
        {
            saveInputFiles(x.input, filename);
            await execPromise(`docker cp ${filename}.txt ${containerID}:/usr/src/app/`);
            const executionPromise = execPromise(getRunCMD(containerID, filename, language));
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Time Limit Exceeded")), TIME_LIMIT)
            );

            try {
                const result = await Promise.race([executionPromise, timeoutPromise]); 
                const output = result.stdout.trim();
                const expectedOutput = x.output.trim();
                const isMatch = output === expectedOutput;

                res_output.push({
                    input: x.input,
                    expectedOutput,
                    actualOutput: output,
                    isMatch,
                });

                console.log(`Input: ${x.input}, Expected: ${expectedOutput}, Actual: ${output}, Match: ${isMatch}`);
            } catch (execError) {
                if (execError.message === "Time Limit Exceeded") {
                    console.error('Error: Time Limit Exceeded');
                    return { statusCode: 403, data:"TLE"}; 
                } else {
                    console.error('Execution error:', execError);
                    throw execError; 
                }
            } finally {
                try {
                    await execPromise(`docker exec ${containerID} rm -f /usr/src/app/${filename}.txt`);
                } catch (removeError) {
                    console.error('Error removing input file inside Docker:', removeError);
                }
            }
        }

        await execPromise(`docker exec ${containerID} rm -f /usr/src/app/${filename}.${getExtension(language)}`);
        return { statusCode: 200, data: res_output };

    } catch (error) {
        if (error.stderr) {
            console.error('Standard error:', error.stderr);
            return { statusCode: 403, data: formatErrorMessage(error.stderr)}; 
        } else if (error.message === "Time Limit Exceeded") {
            console.error('Error: Time Limit Exceeded');
            return { statusCode: 403, data: "Error: Time Limit Exceeded" }; 
        }

        console.error('Server error:', error);
        return { statusCode: 500, data: "Server error" };

    } finally {
        if (containerID) {
            try {
                await execPromise(`docker rm -f ${containerID}`);
                console.log('Docker container removed successfully:', containerID);
            } catch (removeError) {
                console.error('Error removing Docker container:', removeError);
            }
        }
        cleanupLocalFiles(filename, language);
    }
};

export const runTestCasesDokerContainer= async(test_cases,language,filename)=>{
    const useDocker = await checkDocker();
    if (!useDocker) {
        let failedTestCase = null;
        try {
            for (const x of test_cases) {
                const stdout = await runLocalCode(filename, language, x.input);
                const output = stdout.trim();
                const expectedOutput = x.output.trim();
                const isMatch = output === expectedOutput;
                if (!isMatch) {
                    failedTestCase = { input: x.input, output, expectedOutput };
                    break;
                }
            }
            return { statusCode: 200, data: failedTestCase };
        } catch (error) {
            console.error("Local test cases execution error:", error);
            if (error.type === 'tle') {
                return { statusCode: 403, data: "Time Limit Exceeded" };
            }
            return { statusCode: 403, data: formatErrorMessage(error.message) };
        } finally {
            cleanupLocalFiles(filename, language);
        }
    }

    let containerID = null;
    const TIME_LIMIT = 30000;
    try {
        const response = await execPromise(`docker run -d ${getDockerImage(language)}:latest sleep infinity`);
        containerID = response.stdout.trim();
        console.log("Container ID:", containerID);
        await execPromise(`docker exec ${containerID} sh -c "mkdir -p /usr/src/app"`);
        await execPromise(`docker cp ${filename}.${getExtension(language)} ${containerID}:/usr/src/app/`);
        let failedTestCase=null;
        for (const x of test_cases) 
        {
            if(failedTestCase)break;
            saveInputFiles(x.input, filename);
            await execPromise(`docker cp ${filename}.txt ${containerID}:/usr/src/app/`);
            const executionPromise = execPromise(getRunCMD(containerID, filename, language));
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Time Limit Exceeded")), TIME_LIMIT)
            );

            try {
                const result = await Promise.race([executionPromise, timeoutPromise]);
                const output = result.stdout.trim();
                const expectedOutput = x.output.trim();
                const isMatch = output === expectedOutput;
                if (!isMatch && !failedTestCase) 
                {
                    failedTestCase={input:x.input,output,expectedOutput};
                }
                console.log(`Test case passed. Input: ${x.input}, Output: ${output}`);
            } catch (execError) {
                if (execError.message === "Time Limit Exceeded") {
                    console.error('Error: Time Limit Exceeded');
                    return { statusCode: 403, data:"TLE"}; 
                } else {
                    console.error('Execution error:', execError);
                    throw execError; 
                }
            } finally {
                try {
                    await execPromise(`docker exec ${containerID} rm -f /usr/src/app/${filename}.txt`);
                } catch (removeError) {
                    console.error('Error removing input file inside Docker:', removeError);
                }
            }
        }
        
        await execPromise(`docker exec ${containerID} rm /usr/src/app/${filename}.${getExtension(language)}`);
        return {statusCode: 200, data: failedTestCase};
    } 
    catch (error) 
    {
        try {
            if (containerID) {
                await execPromise(`docker exec ${containerID} rm /usr/src/app/${filename}.${getExtension(language)}`);
            }
        } catch (removeError) {
            console.error('Error removing files from container:', removeError);
        }

        if (error.stderr) {
            return { statusCode: 403, data: formatErrorMessage(error.stderr) };
        } else if (error.message === "Time Limit Exceeded") {
            return { statusCode: 403, data: "Time Limit Exceeded" };
        }
        return { statusCode: 500, data: "Server error" };
    } finally {
        if (containerID) {
            try {
                await execPromise(`docker rm -f ${containerID}`);
            } catch (removeError) {
                console.error('Error removing Docker container:', removeError);
            }
        }
        cleanupLocalFiles(filename, language);
    }
};