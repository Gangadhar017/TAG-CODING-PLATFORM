// import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'

// const app=express();
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     methods:  ['GET','POST','PUT','DELETE','PATCH'],
//     credentials: true
// }));


// app.use(express.json({limit:'16kb'}));
// app.use(express.urlencoded({extended:false}));
// app.use(express.static("public"));
// app.use(cookieParser());

// //Import routes
// import userRouter from './routes/user.routes.js'
// import tweetRouter from './routes/tweet.routes.js'
// import problemRouter from './routes/problem.routes.js'
// import runcodeRouter from './routes/runcode.route.js'
// import submissionRouter from './routes/submission.routes.js'

// //Routes Declaration
// app.use('/api/v1/users',userRouter);
// app.use('/api/v1/tweet',tweetRouter);
// app.use('/api/v1/problem',problemRouter);
// app.use('/api/v1/runcode',runcodeRouter);
// app.use('/api/v1/submissions',submissionRouter);

// export {app}
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods:  ['GET','POST','PUT','DELETE','PATCH'],
    credentials: true
}));

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import problemRouter from './routes/problem.routes.js'
import runcodeRouter from './routes/runcode.route.js'
import submissionRouter from './routes/submission.routes.js'

// Routes Declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tweet', tweetRouter);
app.use('/api/v1/problem', problemRouter);
app.use('/api/v1/runcode', runcodeRouter);
app.use('/api/v1/submissions', submissionRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Frontend build folder statically
app.use(express.static(path.join(__dirname, "../public")));

// Handle React Router SPA routing fallback
app.get("*", (req, res, next) => {
    if (req.url.startsWith("/api")) {
        return next();
    }
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// ✅ Add this at the end (recommended)
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export { app };
