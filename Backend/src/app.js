import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express();

// ─── CORS: support comma-separated origins in env ──────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, same-origin in prod)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── Simple Request Logger ──────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
});

// ─── API Routes ─────────────────────────────────────────────────────────────
import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import problemRouter from './routes/problem.routes.js'
import runcodeRouter from './routes/runcode.route.js'
import submissionRouter from './routes/submission.routes.js'

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tweet', tweetRouter);
app.use('/api/v1/problem', problemRouter);
app.use('/api/v1/runcode', runcodeRouter);
app.use('/api/v1/submissions', submissionRouter);

// ─── Serve Frontend Static Build ─────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

// ─── SPA Fallback (React Router) ─────────────────────────────────────────────
// Any non-/api GET request serves index.html so React Router handles routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Not Found' });
    }
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export { app };
