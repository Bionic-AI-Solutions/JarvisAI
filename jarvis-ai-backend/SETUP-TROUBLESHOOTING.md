# Setup Troubleshooting Guide

Solutions for common setup issues when installing and running Jarvis AI Backend.

---

## Installation Issues

### Issue: `npm install` fails with ERESOLVE

**Error:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Option 1: Force install (safe for this project)
npm install --legacy-peer-deps

# Option 2: Clean install
rm -rf node_modules package-lock.json
npm install

# Option 3: Use specific npm version
npx npm@9 install
```

---

### Issue: `npm install` fails with permission errors (Windows)

**Error:**
```
npm ERR! Error: EPERM: operation not permitted
```

**Solution:**
```powershell
# Run PowerShell as Administrator, then:
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### Issue: Node.js version too old

**Error:**
```
SyntaxError: Unexpected token '?.' 
# or
error TS2xxx: ... requires ES2020 or later
```

**Solution:**
```bash
# Check current version
node --version

# Need 18+ — install via nvm
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

---

### Issue: TypeScript compilation errors

**Error:**
```
error TS2307: Cannot find module 'express'
```

**Solution:**
```bash
# Install all dev dependencies
npm install

# If @types are missing
npm install -D @types/express @types/node @types/jest
```

---

### Issue: `ts-node` not found

**Error:**
```
'ts-node' is not recognized as an internal or external command
```

**Solution:**
```bash
# It's a devDependency, ensure it's installed
npm install

# Run via npx instead
npx ts-node src/index.ts

# Or use npm script (recommended)
npm run dev
```

---

## Runtime Issues

### Issue: Port already in use

**Error:**
```
EADDRINUSE: address already in use :::3000
```

**Solution:**
```powershell
# Windows: Find and kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id <PID> -Force

# Or just use a different port
$env:PORT=3001; npm run dev
```

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
# Or
PORT=3001 npm run dev
```

---

### Issue: Redis connection refused

**Error:**
```
Redis connection failed, rate limiting will use in-memory fallback
```

**This is NOT a critical error** — the app works without Redis.

**If you DO need Redis:**
```bash
# Start Redis via Docker
docker compose up -d redis-master redis-sentinel-1 redis-sentinel-2 redis-sentinel-3

# Verify
docker compose ps

# Check connection
docker exec -it jarvis-redis-master redis-cli -a jarvis-dev-password ping
# Expected: PONG
```

---

### Issue: Docker Compose errors

**Error:**
```
docker compose: command not found
```

**Solution:**
```bash
# Docker Desktop includes compose v2
# If using older Docker, install compose separately

# On Windows: Ensure Docker Desktop is running
# Open Docker Desktop app first

# Check Docker is running
docker info
```

**Error:**
```
Cannot connect to the Docker daemon
```

**Solution:**
```
Start Docker Desktop application first, then retry.
```

---

### Issue: .env file not found

**Error:**
```
Warning: .env file not found, using defaults
```

**Solution:**
```bash
cp .env.example .env

# Or for development with Docker:
cp .env.development .env
```

---

## Test Issues

### Issue: Tests timeout

**Error:**
```
Timeout - Async callback was not invoked within 5000 ms
```

**Solution:**
```typescript
// Increase timeout for slow tests
test('slow test', async () => {
  // ...
}, 10000); // 10 second timeout

// Or in jest.config.js:
// testTimeout: 10000
```

---

### Issue: Tests can't find modules

**Error:**
```
Cannot find module '../../src/features/cors'
```

**Solution:** Check the import path matches your test file location:
```
tests/unit/cors.test.ts → import from '../../src/features/cors'
tests/integration/cors.test.ts → import from '../../src/features/cors'
```

---

### Issue: Coverage below threshold

**Error:**
```
Jest: "global" coverage threshold for statements (75%) not met: 60%
```

**Solution:**
```bash
# Check which files need coverage
npm test -- --coverage --verbose

# During development, you can temporarily lower threshold in jest.config.js
# But fix before PR!
```

---

## Platform-Specific Issues

### Windows

**Line ending issues (CRLF vs LF):**
```bash
# Configure git
git config core.autocrlf true

# Or add .gitattributes
echo "* text=auto" > .gitattributes
echo "*.ts text eol=lf" >> .gitattributes
echo "*.json text eol=lf" >> .gitattributes
```

**Long file path errors:**
```powershell
# Enable long paths in Windows
git config --system core.longpaths true
```

**PowerShell script execution policy:**
```powershell
# If scripts/setup.sh won't run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### macOS

**Xcode tools missing:**
```bash
xcode-select --install
```

**File watch limit:**
```bash
# If jest --watch fails
echo "kern.maxfiles=524288" | sudo tee -a /etc/sysctl.conf
echo "kern.maxfilesperproc=524288" | sudo tee -a /etc/sysctl.conf
```

### Linux

**Node.js not in PATH after nvm install:**
```bash
source ~/.nvm/nvm.sh
nvm use 20
```

---

## Getting More Help

1. Check **docs/DEBUGGING.md** for runtime debugging
2. Ask in **#jarvis-blockers** Slack channel
3. Create a GitHub issue with:
   - OS and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Full error output
   - Steps to reproduce

---

**Last Updated**: February 14, 2026
