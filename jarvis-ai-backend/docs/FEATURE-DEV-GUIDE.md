# Feature Development Guide

How to implement, test, and ship features in the Jarvis AI Backend.

---

## Feature Module Pattern

Every feature follows this structure:

```
src/features/<feature-name>/
├── index.ts              # Main exports (middleware, routes, services)
├── <feature>.service.ts  # Business logic
├── <feature>.types.ts    # TypeScript interfaces/types
├── <feature>.schemas.ts  # Zod schemas for validation
├── utils/                # Feature-specific utilities
├── data/                 # Static data (YAML, JSON)
└── __tests__/            # Co-located tests (optional)
```

---

## Step-by-Step: Implementing a Feature

### Step 1: Create the Service

```typescript
// src/features/my-feature/my-feature.service.ts
import { logger } from '../../utils/logger';
import { config } from '../../config';

export class MyFeatureService {
  constructor() {
    logger.info('MyFeature service initialized');
  }

  async doSomething(input: string): Promise<string> {
    // Business logic here
    logger.debug('Processing input', { input });
    return `Processed: ${input}`;
  }
}

export const myFeatureService = new MyFeatureService();
```

### Step 2: Define Types

```typescript
// src/features/my-feature/my-feature.types.ts
export interface MyFeatureInput {
  name: string;
  value: number;
  options?: MyFeatureOptions;
}

export interface MyFeatureOptions {
  timeout: number;
  retries: number;
}

export interface MyFeatureResult {
  success: boolean;
  data: any;
  timestamp: Date;
}
```

### Step 3: Create Zod Schemas

```typescript
// src/features/my-feature/my-feature.schemas.ts
import { z } from 'zod';

export const MyFeatureInputSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.number().int().positive(),
  options: z.object({
    timeout: z.number().int().min(100).max(30000).default(5000),
    retries: z.number().int().min(0).max(5).default(3),
  }).optional(),
});

export type MyFeatureInputDTO = z.infer<typeof MyFeatureInputSchema>;
```

### Step 4: Create Routes / Middleware

```typescript
// src/features/my-feature/index.ts
import { Router, Request, Response, NextFunction } from 'express';
import { myFeatureService } from './my-feature.service';
import { MyFeatureInputSchema } from './my-feature.schemas';
import { validateRequest } from '../openapi';
import { logger } from '../../utils/logger';

export const myFeatureRoutes = Router();

// GET endpoint
myFeatureRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await myFeatureService.doSomething('test');
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

// POST endpoint with validation
myFeatureRoutes.post(
  '/',
  validateRequest(MyFeatureInputSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = (req as any).validatedBody;
      const result = await myFeatureService.doSomething(input.name);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }
);

// Export middleware if this feature is a middleware
export function myFeatureMiddleware(req: Request, res: Response, next: NextFunction) {
  // Middleware logic
  next();
}
```

### Step 5: Register in App

```typescript
// src/index.ts — add to the middleware chain or routes
import { myFeatureRoutes, myFeatureMiddleware } from './features/my-feature';

// If it's middleware:
app.use(myFeatureMiddleware);

// If it has routes:
app.use('/api/v1/my-feature', myFeatureRoutes);
```

### Step 6: Write Tests

```typescript
// tests/unit/my-feature.unit.test.ts
import { MyFeatureService } from '../../src/features/my-feature/my-feature.service';
import { MyFeatureInputSchema } from '../../src/features/my-feature/my-feature.schemas';

describe('MyFeature Service', () => {
  let service: MyFeatureService;

  beforeEach(() => {
    service = new MyFeatureService();
  });

  test('should process input correctly', async () => {
    const result = await service.doSomething('hello');
    expect(result).toBe('Processed: hello');
  });

  test('should handle empty input', async () => {
    const result = await service.doSomething('');
    expect(result).toBe('Processed: ');
  });
});

describe('MyFeature Schema Validation', () => {
  test('should accept valid input', () => {
    const result = MyFeatureInputSchema.safeParse({
      name: 'test',
      value: 42,
    });
    expect(result.success).toBe(true);
  });

  test('should reject invalid input', () => {
    const result = MyFeatureInputSchema.safeParse({
      name: '',
      value: -1,
    });
    expect(result.success).toBe(false);
  });
});
```

---

## Coding Standards

### TypeScript
- **Strict mode** is enabled — no `any` without justification
- Use `interface` for object shapes, `type` for unions/computed types
- All functions must have explicit return types
- Use `readonly` for immutable properties
- Prefer `const` over `let`, never use `var`

### Error Handling
```typescript
// DO: Use custom error classes
import { ValidationError, NotFoundError } from '../../middleware/error-handler';

throw new ValidationError('Invalid input', { field: 'name', value: '' });
throw new NotFoundError('Resource not found', { id: '123' });

// DON'T: Throw raw errors
throw new Error('Something went wrong'); // ❌ No status code
```

### Logging
```typescript
import { logger } from '../../utils/logger';

// DO: Use structured logging with context
logger.info('User created', { userId: '123', email: 'test@example.com' });
logger.error('Database query failed', { query: 'SELECT...', error: err.message });

// DON'T: Use console.log
console.log('User created');  // ❌ Not structured, no levels
```

### Async/Await
```typescript
// DO: Use try/catch with next(error)
app.get('/route', async (req, res, next) => {
  try {
    const data = await service.getData();
    res.json(data);
  } catch (error) {
    next(error); // Passes to error handler
  }
});

// DON'T: Unhandled promises
app.get('/route', async (req, res) => {
  const data = await service.getData(); // ❌ Uncaught rejection
  res.json(data);
});
```

---

## PR Checklist

Before opening a Pull Request:

- [ ] Code compiles: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Coverage maintained (>75%): `npm test -- --coverage`
- [ ] No `console.log` — use `logger` instead
- [ ] No hardcoded values — use `config`
- [ ] Error handling uses custom error classes
- [ ] New endpoints have Zod validation
- [ ] Inline comments for complex logic
- [ ] Branch named correctly (`feature/OAI-001`)
- [ ] Commit messages follow convention
- [ ] PR description includes:
  - User story reference
  - What changed
  - How to test
  - Screenshots (if UI-related)

---

## Testing Strategy

### Unit Tests (Mandatory)
- Test every public function/method
- Mock external dependencies (Redis, HTTP)
- Fast — should run in <5 seconds total
- Location: `tests/unit/`

### Integration Tests (Required for middleware)
- Test middleware chain interactions
- Use real Redis (via Docker or CI service)
- Test error paths and fallbacks
- Location: `tests/integration/`

### E2E Tests (Required for routes)
- Test full HTTP request/response cycle
- Use `supertest` for HTTP testing
- Test authentication, validation, error responses
- Location: `tests/e2e/`

### Coverage Targets
| Metric | Target | Minimum |
|--------|--------|---------|
| Statements | 85% | 75% |
| Branches | 80% | 70% |
| Functions | 90% | 80% |
| Lines | 85% | 75% |

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Service | `<feature>.service.ts` | `openapi.service.ts` |
| Types | `<feature>.types.ts` | `cors.types.ts` |
| Schemas | `<feature>.schemas.ts` | `rate-limit.schemas.ts` |
| Routes | `<feature>.routes.ts` or `index.ts` | `openapi.routes.ts` |
| Unit Tests | `<feature>.unit.test.ts` | `cors.unit.test.ts` |
| Integration | `<feature>.integration.test.ts` | `redis.integration.test.ts` |
| E2E Tests | `<feature>.e2e.test.ts` | `health.e2e.test.ts` |

---

## Import Order Convention

```typescript
// 1. Node.js built-ins
import path from 'path';
import fs from 'fs';

// 2. External packages
import express from 'express';
import { z } from 'zod';

// 3. Internal modules (absolute)
import { config } from '../../config';
import { logger } from '../../utils/logger';

// 4. Feature-local imports
import { MyService } from './my.service';
import { MySchema } from './my.schemas';

// 5. Types (separate section)
import type { MyInterface } from './my.types';
```

---

**Last Updated**: February 14, 2026
