# 💻 TAG Coding Platform

A high-performance, monolithic **Competitive Programming & Real-Time Technical Interview Platform** built on the MERN stack. Features a sandboxed compilation engine, live collaborative IDE spaces, WebRTC peer-to-peer audio/video connections, and real-time canvas synchronization.

---

### 🚀 Live Deployed Platform
> **Production Live Link:** [https://tag-coding-platform1.onrender.com/](https://tag-coding-platform1.onrender.com/)

---

## 👨‍💻 Creator & Author
* **Gangadhar** — [GitHub: Gangadhar017](https://github.com/Gangadhar017)

---

## 🌟 Key Platform Features

### 1. 🎙️ Premium Collaborative Interview Rooms
* **Interactive Code Pairing**: Multi-user real-time shared workspace utilizing **Monaco Editor** with automatic multi-language synchronization.
* **Peer Audio & Video Channels**: High-fidelity WebRTC peer connection pipelines using PeerJS with instant share-stream buttons, mic mute/unmute, and camera controls.
* **Dynamic Test Case Builder**: Live dynamically managed testcases inside the workspace panel. Allows the host interviewer to dynamically add or delete test cases, syncing configurations to the candidate in real-time.
* **Seeded Problem Selector**: Interactivly query and select seeded algorithmic challenges directly from your cloud database within the Live Room. Auto-populates descriptions and expects inputs/outputs for both interviewer and candidate.
* **Shared Space Timer**: Monospace glowing live countdown timer synchronized between both participants via WebSockets.

### 2. 🧩 Master Problemset Arena
* **Practice Challenges**: A master algorithmic board pre-seeded with 13 core algorithmic challenges (from *Two Sum* to *Climbing Stairs*) filtered by difficulty (Easy, Medium, Hard).
* **Robust Load Safety**: Frontend loader safeguards to ensure graceful error fallbacks on slow or disconnected databases.
* **Comprehensive Submissions History**: Beautiful monospaced timeline cards tracking accepted/rejected details, exact languages, and complete source-code previews.

### 3. 👤 Seamless Profiles & Local Fallbacks
* **Robust Avatar Upload**: Feature-rich profile picture updates. Includes a local storage fallback—if Cloudinary credentials are not configured in the active environment, the backend securely saves files inside `public/temp/` and resolves them locally, ensuring profile photos work 100% of the time.
* **Developer Dashboards**: Beautiful progress bars tracking candidate problem-solving percentage stats by difficulty levels.

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% Styling
    classDef client fill:#1e293b,stroke:#f97316,stroke-width:2px,color:#fff;
    classDef server fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef db fill:#020617,stroke:#10b981,stroke-width:2px,color:#fff;
    
    %% Nodes
    A[Vite Client SPA]:::client
    B[Socket.IO Workspace Sync]:::client
    C[WebRTC P2P Streams]:::client
    
    D[Monolithic Node/Express API]:::server
    E[Dynamic Sandbox Compiler]:::server
    F[Express Static Asset Host]:::server
    
    G[MongoDB tagDB]:::db
    
    %% Relationships
    A -->|HTTP Requests| D
    B <-->|Bidirectional Real-Time| D
    C <-->|Video/Audio P2P| C
    
    D -->|Queries & Seeding| G
    D -->|Executes Compilations| E
    F -->|Serves Production Bundle| A
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Key Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, React Router 6, Monaco Editor, TailwindCSS | User Interface & State Management |
| **Backend** | Node.js, Express.js | Monolithic API Services & Orchestration |
| **Database** | MongoDB, Mongoose | Data Persistence & Agregation Pipelines |
| **Real-time** | Socket.IO, WebRTC (PeerJS) | Dynamic Code & AV Stream Synchronization |
| **Compiler** | Docker, gcc, g++, OpenJDK, Python3 | Sandboxed Code Compilation & Execution |
| **Uploads** | Local Filesystem / Cloudinary | Dynamic Avatar & Upload Handlers |

---

## 📦 Deployment (Render Container Monolith)

The application is fully containerized using **Docker** for production, ensuring that all compiler binaries (`javac`, `g++`, `python3`, `gcc`) are fully pre-installed and available inside the hosting container automatically.

### 1. Production Docker Environment Variables
Configure these variables in your **Render Web Service (Docker)** dashboard:

```env
MONGODB_URI=mongodb+srv://gangadharglau_db_user:DmHlFqwFuW13WAEp@tagdb.wh3trce.mongodb.net/?appName=TAGDB
DB_NAME=tagDB
PORT=8000
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=mysupersecretkey_123456789
REFRESH_TOKEN_SECRET=myrefreshsecretkey_987654321
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
```

### 2. Manual Monolith Compilation & Assembly
To build and compile static assets locally:

```bash
# 1. Install frontend dependencies and build Vite bundle
cd Frontend
npm install
npm run build

# 2. Deploy bundle directly into Backend static public folder
cd ..
rm -rf Backend/public/assets
cp -r Frontend/dist/* Backend/public/

# 3. Commit and push to Git
git add -A
git commit -m "build: compile and assembly production assets"
git push origin main
```

---

## 🧱 Local Development Setup

### Prerequisite Compilers (For Local Sandbox Fallback)
For your local machine to run C++, Java, and Python compilations directly without Docker:
* Install **JDK 17** (adds `javac` and `java` to PATH).
* Install **MinGW / GCC** (adds `g++` and `gcc` to PATH).
* Install **Python 3** (adds `python3` or `python` to PATH).

### Launching Environment
```bash
# Terminal 1 - Launch Backend Node Server (Port 8000)
cd Backend
npm install
npm run dev

# Terminal 2 - Launch Frontend Vite Dev Server (Port 5173)
cd Frontend
npm install
npm run dev
```
Explore the workspace locally at `http://localhost:5173`!
