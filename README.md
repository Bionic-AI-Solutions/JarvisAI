# Jarvis AI

Enterprise-grade AI-powered backend platform with real-time dashboard.

## Architecture

```
jarvis-ai-backend/    # Node.js + Express + TypeScript + Redis Sentinel
jarvis-ai-frontend/   # React + TypeScript + Vite Dashboard
```

## Quick Start

### Backend

```bash
cd jarvis-ai-backend
npm install
npm run dev         # Starts on http://localhost:4000
```

### Frontend

```bash
cd jarvis-ai-frontend
npm install
npm run dev         # Starts on http://localhost:3000 (proxies API to :4000)
```

### Docker (Full Stack)

```bash
cd jarvis-ai-backend
docker compose up --build
# Backend: http://localhost:4000
# Frontend: http://localhost:3000
```

## Enterprise Features

| Feature | Description | Status |
|---------|-------------|--------|
| OpenAPI / Swagger | Auto-generated API docs with Zod validation | ✅ Active |
| CORS Management | Origin whitelisting + security headers | ✅ Active |
| Rate Limiting | Dual-layer (Customer ID + IP) with Redis Lua scripts | ✅ Active |
| Shell Completion | Bash & Zsh auto-completion generators | ✅ Active |
| CLI Help System | Registered command help with usage info | ✅ Active |

## Tech Stack

**Backend:** Node.js 20, Express 4.18, TypeScript 5.0, Redis Sentinel (ioredis), Zod, Winston, Jest  
**Frontend:** React 18, TypeScript, Vite 5, React Router, Lucide Icons  
**Infrastructure:** Docker, Nginx, GitHub Actions CI/CD  

## Sprint: Phase 2A

- **Period:** Feb 24 - Mar 13, 2026
- **Story Points:** 93 total (15 Phase 1)
- **Team Size:** 5 members

## License

Proprietary — Bionic AI Solutions
