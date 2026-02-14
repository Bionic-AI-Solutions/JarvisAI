# Debugging Guide

Common issues, debugging strategies, and log analysis for the Jarvis AI Backend.

---

## General Debugging Strategy

### Step 1: Check the Logs
```bash
# Development — logs print to console
npm run dev

# Docker — follow container logs
docker compose logs -f jarvis-backend

# production log files
# logs/combined.log  — all logs
# logs/error.log     — errors only
```

### Step 2: Reproduce the Issue
```bash
# Use curl to replicate the request
curl -v http://localhost:3000/health
curl -v -H "X-Customer-ID: test" http://localhost:3000/api/v1/ping
curl -v -X OPTIONS http://localhost:3000/api/v1/ping
```

### Step 3: Enable Debug Logging
```dotenv
# In .env
LOG_LEVEL=debug
LOG_FORMAT=text    # More readable than JSON
```

### Step 4: Use Node.js Debugger
```bash
# Start with inspect flag
node --inspect -r ts-node/register src/index.ts

# Then attach VS Code debugger or open chrome://inspect
```

---

## Common Errors & Solutions

### 1. Application Won't Start

#### Error: `EADDRINUSE: address already in use :::3000`
```
Port 3000 is already occupied by another process.
```
**Fix:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# macOS/Linux
npx kill-port 3000

# Or change port in .env
PORT=3001
```

#### Error: `Cannot find module 'express'`
```
Dependencies not installed.
```
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: `SyntaxError: Cannot use import statement outside a module`
```
Running .ts file with node instead of ts-node.
```
**Fix:**
```bash
# Use npm scripts (they use ts-node)
npm run dev

# Or explicitly use ts-node
npx ts-node src/index.ts
```

---

### 2. Redis Connection Issues

#### Warning: `Redis connection failed, rate limiting will use in-memory fallback`
```
Not an error — intentional fallback. App continues to work.
Redis is optional for development.
```
**Fix (if you need Redis):**
```bash
# Start Redis via Docker
docker compose up -d redis-master redis-sentinel-1 redis-sentinel-2 redis-sentinel-3

# Verify Redis is running
docker exec -it jarvis-redis-master redis-cli -a jarvis-dev-password ping
# Expected: PONG

# Check .env has correct values
REDIS_SENTINELS=localhost:26379,localhost:26380,localhost:26381
REDIS_SENTINEL_NAME=mymaster
REDIS_PASSWORD=jarvis-dev-password
```

#### Error: `WRONGPASS invalid username-password pair`
```
Redis password mismatch between .env and Redis config.
```
**Fix:**
```bash
# Check Docker Redis password
docker exec -it jarvis-redis-master redis-cli
> AUTH jarvis-dev-password
# Should return: OK

# Update .env to match
REDIS_PASSWORD=jarvis-dev-password
```

#### Error: `Redis connection to sentinel refused`
```
Sentinel instances not running or wrong port.
```
**Fix:**
```bash
# Check all sentinels are running
docker compose ps | grep sentinel
# All 3 should be "running"

# If not, restart
docker compose restart redis-sentinel-1 redis-sentinel-2 redis-sentinel-3
```

---

### 3. TypeScript Errors

#### Error: `Property 'X' does not exist on type 'Request'`
```
Custom property not declared on Express Request type.
```
**Fix:** Add to `src/types/express.d.ts`:
```typescript
declare namespace Express {
  interface Request {
    validatedBody?: any;
    customerId?: string;
  }
}
```

#### Error: `Type 'string | undefined' is not assignable to type 'string'`
```
Strict null checks catching optional values.
```
**Fix:**
```typescript
// Use nullish coalescing
const value = process.env.MY_VAR ?? 'default';

// Or type assertion (when you're sure)
const value = process.env.MY_VAR!;

// Or guard
if (process.env.MY_VAR) {
  // value is string here
}
```

#### Error: `Could not find declaration file for module 'X'`
```
Missing @types package.
```
**Fix:**
```bash
npm install -D @types/package-name
```

---

### 4. Test Failures

#### Error: `Your test suite must contain at least one test`
```
Test file exists but has no test() or it() calls.
```
**Fix:** Add at least one test:
```typescript
describe('MyFeature', () => {
  test('placeholder', () => {
    expect(true).toBe(true);
  });
});
```

#### Error: `Cannot find module '../src/features/X'`
```
Import path wrong in test file.
```
**Fix:** Use correct relative path:
```typescript
// From tests/unit/feature.test.ts
import { myFunction } from '../../src/features/my-feature';
```

#### Error: `ReferenceError: fetch is not defined`
```
Node.js < 18 doesn't have global fetch.
```
**Fix:**
```bash
# Ensure Node 18+
node --version  # Should be v18.x or v20.x

# Or in tests, use supertest instead of fetch
import request from 'supertest';
```

---

### 5. CORS Issues

#### Browser Error: `Access to fetch has been blocked by CORS policy`
```
Origin not in allowed list.
```
**Fix:**
```dotenv
# Add your frontend origin to .env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,http://your-frontend:4200
```

#### Browser Error: `Request header 'X-Custom-Header' is not allowed by CORS`
```
Custom header not in Access-Control-Allow-Headers.
```
**Fix:** Add header in `src/features/cors/index.ts`:
```typescript
res.header('Access-Control-Allow-Headers', 
  'Content-Type,Authorization,X-Customer-ID,X-Custom-Header'
);
```

---

### 6. Rate Limiting Issues

#### All requests return 429 immediately
```
Rate limit counter not resetting (TTL issue).
```
**Fix:**
```bash
# Clear rate limit keys in Redis
docker exec -it jarvis-redis-master redis-cli -a jarvis-dev-password
> KEYS rl:*
> DEL rl:customer:your-customer-id
> DEL rl:ip:your-ip

# Or flush entire dev database
> FLUSHDB
```

#### Rate limiter not working (always allows)
```
Missing X-Customer-ID header or Redis not connected.
```
**Fix:**
```bash
# Include customer ID in requests
curl -H "X-Customer-ID: test-customer" http://localhost:3000/api/v1/ping

# Check Redis connection
curl http://localhost:3000/health
# services.redis should be "connected"
```

---

## Debugging Tools

### VS Code Launch Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/ts-node",
      "args": ["${workspaceFolder}/src/index.ts"],
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "${file}"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Useful VS Code Debug Breakpoints
- `src/index.ts:34` — After Redis initialization (check redis variable)
- `src/features/rate-limiting/index.ts:14` — Before rate limit check
- `src/middleware/error-handler.ts:45` — On error catch
- `src/features/cors/index.ts:10` — On origin check

### Request Debugging
```bash
# Verbose curl output (see all headers)
curl -v http://localhost:3000/health

# See response headers only
curl -I http://localhost:3000/health

# POST with JSON body
curl -X POST -H "Content-Type: application/json" \
  -H "X-Customer-ID: debug-test" \
  -d '{"key": "value"}' \
  http://localhost:3000/api/v1/ping

# Check rate limit headers
curl -i http://localhost:3000/api/v1/ping | grep X-RateLimit
```

---

## Log Format Reference

### Development Mode (LOG_FORMAT=text)
```
2026-02-24 10:15:00 [info]: Server running on port 3000
2026-02-24 10:15:01 [debug]: Incoming request { method: 'GET', path: '/health', ip: '::1' }
2026-02-24 10:15:01 [info]: Request completed { status: 200, duration: '2ms' }
```

### Production Mode (LOG_FORMAT=json)
```json
{"level":"info","message":"Server running on port 3000","timestamp":"2026-02-24T10:15:00.000Z","service":"jarvis-ai-backend"}
{"level":"debug","message":"Incoming request","method":"GET","path":"/health","ip":"::1","timestamp":"2026-02-24T10:15:01.000Z"}
```

### Log Levels (in order of severity)
| Level | When to Use | Example |
|-------|-------------|---------|
| `error` | Something broke | Redis connection lost, unhandled exception |
| `warn` | Something concerning | Rate limit fallback to in-memory |
| `info` | Normal operations | Server started, request completed |
| `debug` | Development detail | Request headers, Redis commands |

---

## Performance Debugging

### Slow Requests
```bash
# Check request-logger output for duration
# Look for requests > 100ms

# Enable debug logging
LOG_LEVEL=debug

# Check Redis latency
docker exec -it jarvis-redis-master redis-cli -a jarvis-dev-password --latency
```

### Memory Leaks
```bash
# Start with heap snapshot
node --inspect --max-old-space-size=512 -r ts-node/register src/index.ts

# In Chrome DevTools (chrome://inspect):
# 1. Take heap snapshot
# 2. Reproduce the issue
# 3. Take another snapshot
# 4. Compare
```

### High CPU Usage
```bash
# Profile with clinic.js
npm install -g clinic
clinic doctor -- node dist/index.js
# Opens browser with diagnosis
```

---

## Getting Help

1. **Check this guide first** — Most issues are covered above
2. **Search existing issues** — Someone might have hit this before
3. **Ask in #jarvis-blockers** — Team Slack channel
4. **Create a GitHub issue** — With reproduction steps

### Issue Template
```markdown
**Environment**: Node v20.x / Windows 11 / Docker Desktop 4.x
**Steps to Reproduce**:
1. Run `npm run dev`
2. Execute `curl http://localhost:3000/health`
3. Observe error

**Expected**: 200 OK with health status
**Actual**: Connection refused

**Logs**: [paste relevant logs]
**Attempted Fixes**: [what you tried]
```

---

**Last Updated**: February 14, 2026
