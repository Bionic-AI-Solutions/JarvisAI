# Local Development Setup Guide

**Time to complete**: ~15 minutes  
**Prerequisites**: Node.js 18+, Git, Docker (optional but recommended)

---

## Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone <repo-url>
cd jarvis-ai-backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Start the development server
npm run dev

# 5. Verify it's running
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-24T10:00:00.000Z",
  "services": {
    "redis": "disconnected"
  }
}
```

> **Note**: Redis showing "disconnected" is normal without Docker. The app works fine with in-memory fallback.

---

## Full Setup (With Redis)

### Option A: Docker Compose (Recommended)

```bash
# Start Redis Sentinel cluster + backend
docker compose up -d

# Check services are running
docker compose ps

# Expected output:
# jarvis-redis-master   running  0.0.0.0:6379->6379/tcp
# jarvis-sentinel-1     running  0.0.0.0:26379->26379/tcp
# jarvis-sentinel-2     running  0.0.0.0:26380->26379/tcp
# jarvis-sentinel-3     running  0.0.0.0:26381->26379/tcp
# jarvis-backend        running  0.0.0.0:3000->3000/tcp
```

### Option B: Local Redis (Without Docker)

**Windows:**
```powershell
# Install via Chocolatey
choco install redis-64

# Start Redis
redis-server

# In .env, set:
# REDIS_SENTINELS=
# (leave empty — app will use direct Redis or in-memory fallback)
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### Option C: No Redis (In-Memory Only)

Leave `REDIS_SENTINELS` empty in `.env`. The rate limiter automatically falls back to in-memory storage. This is fine for feature development but NOT for testing rate limiting features.

---

## Environment Configuration

### Required Variables
```dotenv
NODE_ENV=development       # development | test | production
PORT=3000                  # Server port
```

### Optional Variables (with defaults)
```dotenv
# Redis (leave empty for in-memory fallback)
REDIS_SENTINELS=localhost:26379,localhost:26380,localhost:26381
REDIS_SENTINEL_NAME=mymaster
REDIS_PASSWORD=jarvis-dev-password
REDIS_DB=0

# CORS (comma-separated origins)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Rate Limiting (relaxed for dev)
RATE_LIMIT_PER_CUSTOMER=10000
RATE_LIMIT_PER_IP=50000
RATE_LIMIT_WINDOW_MS=3600000

# Logging
LOG_LEVEL=debug            # error | warn | info | debug
LOG_FORMAT=text            # text | json
```

---

## IDE Setup

### VS Code (Recommended)

Install these extensions:
- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **TypeScript Importer** — `pmneo.tsimporter`
- **Jest** — `orta.vscode-jest`
- **Docker** — `ms-azuretools.vscode-docker`

Recommended workspace settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "jest.autoRun": "off"
}
```

### WebStorm / IntelliJ
- Enable TypeScript service (auto-detected)
- Set ESLint → Automatic configuration
- Set Prettier → On save
- Jest → Auto-detect configuration

---

## Project Structure Walkthrough

```
jarvis-ai-backend/
├── src/                          # Source code (TypeScript)
│   ├── index.ts                  # App entry — Express setup + middleware chain
│   ├── config/index.ts           # Environment config loader (typed)
│   ├── features/                 # Feature modules (one folder per feature)
│   │   ├── openapi/index.ts      # OpenAPI schema + validation + Swagger
│   │   ├── cors/index.ts         # CORS middleware + security headers
│   │   ├── shell/index.ts        # Bash/Zsh shell completion generators
│   │   ├── cli-help/index.ts     # Dynamic CLI help system
│   │   └── rate-limiting/        # Rate limiting (Redis + in-memory fallback)
│   │       ├── index.ts          # Middleware + dual-layer check
│   │       └── lua-scripts/      # Atomic Redis Lua scripts
│   ├── middleware/               # Global middleware
│   │   ├── error-handler.ts      # Error classes + global handler
│   │   └── request-logger.ts     # Request/response logging
│   ├── utils/                    # Shared utilities
│   │   ├── redis-client.ts       # Redis Sentinel connection factory
│   │   └── logger.ts             # Winston logger setup
│   └── types/                    # Shared TypeScript types
├── tests/                        # Test suite
│   ├── unit/                     # Unit tests (isolated, no external deps)
│   ├── integration/              # Integration tests (with Redis)
│   ├── e2e/                      # End-to-end tests (full HTTP)
│   └── fixtures/                 # Test helpers, mocks, sample data
├── docker-compose.yml            # Local Redis Sentinel + app
├── .github/workflows/ci.yml      # CI/CD pipeline
└── package.json                  # Dependencies + scripts
```

---

## Development Workflow

### Daily Cycle
```
1. git pull origin develop            # Get latest changes
2. git checkout -b feature/OAI-001    # Create feature branch
3. npm run dev                        # Start dev server (auto-reload)
4. [write code in src/features/...]   # Implement feature
5. npm test -- --watch                # Test in watch mode
6. npm run type-check                 # Verify TypeScript
7. npm run lint:fix                   # Auto-fix lint issues
8. git add . && git commit            # Commit changes
9. git push && create PR              # Open pull request
```

### Branch Naming Convention
```
feature/OAI-001     # New feature (user story ID)
fix/cors-headers    # Bug fix (descriptive name)
test/rl-unit        # Test additions
docs/api-testing    # Documentation updates
```

### Commit Message Format
```
feat(openapi): implement Zod schema generation (OAI-001)
fix(cors): add missing X-XSS-Protection header
test(rate-limit): add dual-layer unit tests
docs(readme): update setup instructions
chore(deps): upgrade express to 4.18.3
```

---

## Useful Commands Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run dev` | Start dev server with ts-node | Daily development |
| `npm run build` | Compile TypeScript to dist/ | Before deployment |
| `npm start` | Run compiled JS | Production/staging |
| `npm test` | Run all tests | Before committing |
| `npm test -- --watch` | Watch mode testing | During development |
| `npm test -- --coverage` | Coverage report | Before PR |
| `npm run type-check` | TypeScript validation | Before committing |
| `npm run lint` | ESLint check | Before committing |
| `npm run lint:fix` | Auto-fix lint issues | Cleanup |

### Docker Commands
```bash
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose logs -f jarvis-backend  # Follow app logs
docker compose logs -f redis-master    # Follow Redis logs
docker compose restart jarvis-backend  # Restart app only
```

### Redis CLI
```bash
# Connect to local Redis (via Docker)
docker exec -it jarvis-redis-master redis-cli -a jarvis-dev-password

# Useful Redis commands
KEYS rl:*              # See all rate limit keys
GET rl:customer:test   # Check customer counter
TTL rl:customer:test   # Check TTL on key
FLUSHDB                # Clear all keys (dev only!)
INFO replication       # Check replication status
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| `npm install` fails | Delete `node_modules` and `package-lock.json`, then `npm install` |
| TypeScript errors | Run `npm run type-check` to see all errors at once |
| Port 3000 in use | `npx kill-port 3000` or change PORT in .env |
| Redis connection refused | Start Docker: `docker compose up -d redis-master` |
| Tests failing | Check NODE_ENV=test in environment |
| ESLint errors | Run `npm run lint:fix` for auto-fixes |

For more detailed troubleshooting, see **SETUP-TROUBLESHOOTING.md**.

---

## Next Steps

After setup is confirmed working:
1. Read **docs/FEATURE-DEV-GUIDE.md** — How to implement features
2. Read your assigned feature spec in **TECH-SPECS-DETAILED.md**
3. Review **docs/API-TESTING.md** — How to test your endpoints
4. Check **PHASE1-SPRINT-BOARD.md** — Your daily tasks

---

**Last Updated**: February 14, 2026
