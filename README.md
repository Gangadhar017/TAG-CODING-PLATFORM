# TAG Coding Platform

A full-stack competitive programming & technical interview platform built with the MERN stack.

## 👨‍💻 Author
**Gangadhar** — [GitHub: Gangadhar017](https://github.com/Gangadhar017)

## 🚀 Features
- 🧩 **Problem Set** — Browse and solve coding problems with Monaco editor
- 🏃 **Code Execution** — Run code against sample test cases in real-time
- ✅ **Submissions** — Submit solutions, track accepted/rejected history
- 🎙️ **Interview Rooms** — Live collaborative coding sessions with WebRTC video/audio
- 💬 **Discuss** — Community discussion feed per problem
- 👤 **User Profiles** — Track progress, solved counts by difficulty, avatar upload

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, React Router, Monaco Editor, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO, WebRTC (PeerJS) |
| Media | Cloudinary (avatar uploads) |
| Code Execution | Docker sandbox |

## 📦 Deployment (Render / Railway)

### Environment Variables (Backend)
Set these in your cloud provider dashboard:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
DB_NAME=tagDB
PORT=8000
CORS_ORIGIN=https://your-deployed-domain.com
ACCESS_TOKEN_SECRET=<strong-random-secret>
REFRESH_TOKEN_SECRET=<strong-random-secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
NODE_ENV=production
```

### Build & Run
```bash
# 1. Build Frontend
cd Frontend && npm install && npm run build

# 2. Copy dist to Backend/public
cp -r Frontend/dist/* Backend/public/

# 3. Start Backend (serves frontend + API + WebSockets on one port)
cd Backend && npm install && npm start
```

## 🏗️ Local Development
```bash
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Frontend
cd Frontend && npm run dev
```
