# Phase 2A Code Scaffolding - Project Structure

## Project Organization

```
jarvis-ai-backend/
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci-test.yml
│       └── ci-deploy-staging.yml
│
├── src/
│   ├── index.ts                          # Entry point
│   ├── config/
│   │   ├── index.ts                      # Config loader
│   │   ├── redis.config.ts               # Redis connection setup
│   │   └── logger.config.ts              # Winston logger setup
│   │
│   ├── features/                          # PHASE 2A FEATURES
│   │
│   ├── features/openapi/                 # OAI-001/002/003
│   │   ├── index.ts
│   │   ├── openapi.service.ts            # Schema generation
│   │   ├── openapi.middleware.ts         # Validation middleware
│   │   ├── openapi.routes.ts             # Swagger UI routes
│   │   ├── types/
│   │   │   ├── schema.types.ts
│   │   │   └── openapi.types.ts
│   │   ├── utils/
│   │   │   ├── schema-generator.ts       # Zod → OpenAPI converter
│   │   │   ├── circular-ref-detector.ts  # Circular reference handling
│   │   │   └── validation-engine.ts      # Schema validation
│   │   └── __tests__/
│   │       ├── openapi.service.test.ts
│   │       ├── schema-generator.test.ts
│   │       └── circular-refs.test.ts
│   │
│   ├── features/cors/                    # CORS-001/002
│   │   ├── index.ts
│   │   ├── cors.middleware.ts            # CORS implementation
│   │   ├── cors.config.ts                # CORS configuration
│   │   ├── security-headers.ts           # X-Frame-Options, CSP, etc.
│   │   ├── types/
│   │   │   └── cors.types.ts
│   │   └── __tests__/
│   │       ├── cors.middleware.test.ts
│   │       └── security-headers.test.ts
│   │
│   ├── features/shell/                   # SHELL-001/002/003
│   │   ├── index.ts
│   │   ├── bash-completion.service.ts    # Bash completion generation
│   │   ├── zsh-completion.service.ts     # Zsh completion generation
│   │   ├── shell-installer.ts            # Install script generation
│   │   ├── types/
│   │   │   └── shell-completion.types.ts
│   │   ├── utils/
│   │   │   ├── command-parser.ts
│   │   │   └── dynamic-completion.ts     # Runtime completion generation
│   │   └── __tests__/
│   │       ├── bash-completion.test.ts
│   │       ├── zsh-completion.test.ts
│   │       └── shell-installer.test.ts
│   │
│   ├── features/cli-help/                # HELP-001/002/003
│   │   ├── index.ts
│   │   ├── help.service.ts               # Help system orchestration
│   │   ├── help-formatter.ts             # Rich help formatting
│   │   ├── command-registry.ts           # Command metadata registry
│   │   ├── types/
│   │   │   └── help.types.ts
│   │   ├── data/
│   │   │   └── command-help.yaml         # Help content database
│   │   └── __tests__/
│   │       ├── help.service.test.ts
│   │       └── help-formatter.test.ts
│   │
│   ├── features/rate-limiting/           # RL-001/002/003/004/005
│   │   ├── index.ts
│   │   ├── rate-limiter.service.ts       # Rate limiting logic
│   │   ├── rate-limiter.middleware.ts    # Express middleware
│   │   ├── redis-adapter.ts              # Redis backend adapter
│   │   ├── strategies/
│   │   │   ├── per-customer.strategy.ts  # Per-customer rate limiting
│   │   │   ├── per-ip.strategy.ts        # Per-IP rate limiting
│   │   │   └── dual-layer.strategy.ts    # DUAL strategy (both layers)
│   │   ├── types/
│   │   │   └── rate-limit.types.ts
│   │   ├── lua-scripts/
│   │   │   ├── check-limit.lua           # Atomic Redis check
│   │   │   └── increment-counter.lua     # Atomic Redis increment
│   │   └── __tests__/
│   │       ├── rate-limiter.test.ts
│   │       ├── redis-adapter.test.ts
│   │       ├── per-customer.test.ts
│   │       ├── per-ip.test.ts
│   │       └── dual-layer.test.ts
│   │
│   ├── middleware/
│   │   ├── error-handler.ts              # Global error handling
│   │   ├── request-logger.ts             # Request/response logging
│   │   ├── request-tracking.ts           # Request ID tracking
│   │   └── health-check.ts               # Health check endpoint
│   │
│   ├── utils/
│   │   ├── redis-client.ts               # Redis connection helper
│   │   ├── logger.ts                     # Logging utility
│   │   ├── metrics.ts                    # Prometheus metrics
│   │   └── errors.ts                     # Custom error classes
│   │
│   └── types/
│       ├── express.d.ts                  # Express type extensions
│       └── global.types.ts               # Global type definitions
│
├── tests/
│   ├── integration/
│   │   ├── openapi-integration.test.ts
│   │   ├── cors-integration.test.ts
│   │   ├── shell-integration.test.ts
│   │   ├── help-integration.test.ts
│   │   └── rate-limit-integration.test.ts
│   ├── e2e/
│   │   ├── feature-flow.test.ts
│   │   └── chaos-testing.test.ts
│   └── fixtures/
│       ├── sample-schemas.ts
│       ├── test-data.ts
│       └── mocks/
│           ├── redis.mock.ts
│           └── express.mock.ts
│
├── docs/
│   ├── API.md
│   ├── OPENAPI.md
│   ├── CORS.md
│   ├── SHELL-COMPLETION.md
│   ├── CLI-HELP.md
│   ├── RATE-LIMITING.md
│   └── ARCHITECTURE.md
│
├── scripts/
│   ├── setup.sh
│   ├── test.sh
│   ├── lint.sh
│   └── deploy-staging.sh
│
└── .env.production
```

---

## File-by-File Scaffolding Templates

### 1. **package.json** (Dependency manifest)
```json
{
  "name": "jarvis-ai-backend",
  "version": "2.0.0",
  "description": "Phase 2A - Enterprise Platform Features",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "ioredis": "^5.3.2",
    "zod": "^3.22.4",
    "openapi-types": "^12.1.3",
    "swagger-ui-express": "^5.0.0",
    "redoc-express": "^2.1.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.0",
    "typescript": "^5.0.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.1",
    "eslint": "^8.40.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

### 2. **src/index.ts** (Application entry point)
```typescript
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createRedisClient } from './utils/redis-client';
import { corsMiddleware } from './features/cors';
import { openApiMiddleware, openApiRoutes } from './features/openapi';
import { rateLimiterMiddleware } from './features/rate-limiting';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis connection
const redis = createRedisClient({
  sentinels: process.env.REDIS_SENTINELS?.split(',') || [],
  name: process.env.REDIS_SENTINEL_NAME || 'mymaster',
});

// Global middleware
app.use(express.json());
app.use(requestLogger);

// Feature middleware (ordered by dependency)
app.use(corsMiddleware); // CORS-001/002
app.use(rateLimiterMiddleware(redis)); // RL-001+
app.use(openApiMiddleware); // OAI-001/002

// API routes
app.use('/api-docs', openApiRoutes); // OAI-003 (Swagger UI)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

### 3. **src/features/openapi/openapi.service.ts**
```typescript
import { ZodSchema } from 'zod';
import { generateOpenAPIFromZod } from './utils/schema-generator';
import { detectCircularRefs } from './utils/circular-ref-detector';

export class OpenAPIService {
  /**
   * Generate OpenAPI 3.0 specification from Zod schemas
   */
  generateOpenAPI(schemas: Record<string, ZodSchema>) {
    // Check for circular refs
    const circularRefs = detectCircularRefs(schemas);
    if (circularRefs.length > 0) {
      throw new Error(`Circular references detected: ${circularRefs.join(', ')}`);
    }

    // Generate OpenAPI spec
    const openapi = generateOpenAPIFromZod(schemas);
    return openapi;
  }

  /**
   * Validate incoming request against schema
   */
  validateRequest(data: unknown, schema: ZodSchema) {
    return schema.safeParse(data);
  }
}
```

### 4. **src/features/cors/cors.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import { corsConfig } from './cors.config';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Set CORS headers based on config
  const origin = req.get('origin');
  
  if (corsConfig.allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Apply security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('Strict-Transport-Security', 'max-age=31536000');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
}
```

### 5. **src/features/shell/bash-completion.service.ts**
```typescript
export class BashCompletionService {
  /**
   * Generate bash completion script
   */
  generateCompletionScript(commands: CommandMetadata[]): string {
    const script = `
    _jarvis_completion() {
      local cur prev opts
      COMPREPLY=()
      cur="\${COMP_WORDS[COMP_CWORD]}"
      prev="\${COMP_WORDS[COMP_CWORD-1]}"
      opts="${commands.map(c => c.name).join(' ')}"
      
      if [[ \${cur} == -* ]] ; then
        COMPREPLY=( $(compgen -W "\${opts}" -- \${cur}) )
      fi
    }
    complete -o bashdefault -o default -o nospace -F _jarvis_completion jarvis
    `;
    return script;
  }
}
```

### 6. **src/features/cli-help/help.service.ts**
```typescript
export class HelpService {
  /**
   * Generate rich help output for command
   */
  getCommandHelp(commandName: string): string {
    // Fetch from registry
    const command = this.commandRegistry.get(commandName);
    if (!command) return `Command not found: ${commandName}`;
    
    return `
    ${command.name} - ${command.description}
    
    USAGE:
      ${command.usage}
    
    OPTIONS:
      ${command.options.map(o => `${o.flag}  ${o.description}`).join('\n  ')}
    
    EXAMPLES:
      ${command.examples.map(e => `$ ${e}`).join('\n  ')}
    `;
  }
}
```

### 7. **src/features/rate-limiting/rate-limiter.service.ts**
```typescript
import Redis from 'ioredis';
import { RateLimitStrategy } from './types/rate-limit.types';
import { DualLayerStrategy } from './strategies/dual-layer.strategy';

export class RateLimiterService {
  private strategy: RateLimitStrategy;

  constructor(redis: Redis, strategy: 'per-customer' | 'per-ip' | 'dual') {
    this.strategy = new DualLayerStrategy(redis); // DUAL-LAYER strategy
  }

  /**
   * Check if request should be rate limited
   */
  async checkLimit(customerId: string, ipAddress: string): Promise<boolean> {
    return this.strategy.isLimited(customerId, ipAddress);
  }

  /**
   * Get current rate limit status
   */
  async getStatus(customerId: string, ipAddress: string) {
    return this.strategy.getStatus(customerId, ipAddress);
  }
}
```

### 8. **src/features/rate-limiting/lua-scripts/check-limit.lua**
```lua
-- Redis Lua script for atomic rate limit check
-- Keys: [customer_key, ip_key]
-- Args: [customer_limit, ip_limit, ttl, current_time]

local customer_key = KEYS[1]
local ip_key = KEYS[2]
local customer_limit = tonumber(ARGV[1])
local ip_limit = tonumber(ARGV[2])
local ttl = tonumber(ARGV[3])

local customer_count = redis.call('GET', customer_key) or 0
local ip_count = redis.call('GET', ip_key) or 0

if tonumber(customer_count) >= customer_limit or tonumber(ip_count) >= ip_limit then
  return 1 -- Limited
end

redis.call('INCR', customer_key)
redis.call('EXPIRE', customer_key, ttl)
redis.call('INCR', ip_key)
redis.call('EXPIRE', ip_key, ttl)

return 0 -- Not limited
```

---

## Test Framework Files

### **jest.config.js**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### **tests/fixtures/sample-schemas.ts**
```typescript
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
  })),
  total: z.number().nonnegative(),
});
```

---

## Build & Deployment Scripts

### **scripts/setup.sh**
```bash
#!/bin/bash
echo "Setting up Jarvis AI Phase 2A..."
npm install
npm run type-check
npm run lint
npm test
echo "Setup complete!"
```

### **scripts/test.sh**
```bash
#!/bin/bash
echo "Running tests..."
npm run test -- --coverage
echo "Tests complete!"
```

---

## Environment Configuration

### **.env.example**
```
NODE_ENV=development
PORT=3000

# Redis
REDIS_SENTINELS=sentinel1:26379,sentinel2:26379,sentinel3:26379
REDIS_SENTINEL_NAME=mymaster
REDIS_PASSWORD=

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://example.com

# Rate Limiting
RATE_LIMIT_PER_CUSTOMER=1000
RATE_LIMIT_PER_IP=10000
RATE_LIMIT_WINDOW_MS=3600000

# Logging
LOG_LEVEL=info
```

---

## Dependencies & Versions

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | HTTP server framework |
| ioredis | ^5.3.2 | Redis client with Sentinel support |
| zod | ^3.22.4 | Schema validation (OpenAPI generation) |
| swagger-ui-express | ^5.0.0 | Swagger UI endpoint |
| redoc-express | ^2.1.0 | ReDoc endpoint |
| ts-jest | ^29.1.0 | Jest TypeScript support |
| winston | ^3.11.0 | Structured logging |

---

## Folder Initialization Commands

```bash
# Create folder structure
mkdir -p src/{config,features,middleware,utils,types}
mkdir -p src/features/{openapi,cors,shell,cli-help,rate-limiting}
mkdir -p src/features/openapi/{utils,types,__tests__}
mkdir -p src/features/cors/{types,__tests__}
mkdir -p src/features/shell/{utils,types,__tests__}
mkdir -p src/features/cli-help/{data,types,__tests__}
mkdir -p src/features/rate-limiting/{strategies,types,__tests__,lua-scripts}
mkdir -p tests/{integration,e2e,fixtures/mocks}
mkdir -p docs scripts

# Initialize files
touch src/index.ts
touch src/config/index.ts
touch src/utils/redis-client.ts
# ... continue for all files
```
