# Contributing to Jarvis AI Backend

Thank you for contributing to Jarvis AI Backend! This guide covers the process and standards for all contributions.

---

## Getting Started

1. **Read the docs**: [LOCAL-SETUP.md](docs/LOCAL-SETUP.md) → [FEATURE-DEV-GUIDE.md](docs/FEATURE-DEV-GUIDE.md)
2. **Set up your environment**: Follow LOCAL-SETUP.md (15 minutes)
3. **Verify**: `npm run dev`, `npm test`, `npm run lint` all pass

---

## Branch Strategy

```
main          ← production-ready code (protected)
└── develop   ← integration branch (protected)
    └── feature/OAI-001-openapi-schema   ← your work
    └── feature/RL-002-rate-limit-redis
    └── fix/cors-header-missing
    └── chore/update-dependencies
```

### Naming Convention
| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<ticket>-<short-desc>` | `feature/OAI-001-openapi-schema` |
| Bug fix | `fix/<short-desc>` | `fix/cors-allow-credentials` |
| Chore | `chore/<short-desc>` | `chore/update-eslint` |
| Docs | `docs/<short-desc>` | `docs/rate-limit-guide` |

---

## Development Workflow

### 1. Pick a Task
- Find your assigned task on the sprint board
- Move it to "In Progress"
- Create your branch from `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b feature/OAI-001-openapi-schema
```

### 2. Write Code
Follow the **Feature Module Pattern**:
```
src/features/<feature-name>/
├── index.ts         # Exports (router + middleware)
├── routes.ts        # Route definitions
├── controller.ts    # Request handlers
├── service.ts       # Business logic
├── schemas.ts       # Zod schemas
└── types.ts         # TypeScript types
```

### 3. Write Tests (TDD Recommended)
```bash
# Write test first
tests/unit/<feature>.unit.test.ts

# Run tests in watch mode
npm test -- --watch --testPathPattern=<feature>

# Check coverage
npm test -- --coverage
```

### 4. Lint & Format
```bash
npm run lint          # Check for lint errors
npm run lint:fix      # Auto-fix lint errors
npm run format        # Format with Prettier
npm run type-check    # TypeScript type checking
```

### 5. Commit
```bash
git add .
git commit -m "feat(OAI-001): add OpenAPI schema generation

- Add Zod-to-OpenAPI conversion
- Add /api-docs route with Swagger UI
- Add schema validation middleware
- 95% test coverage for schema module"
```

#### Commit Message Format
```
<type>(<scope>): <short description>

<body - what and why>
```

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Adding tests |
| `docs` | Documentation |
| `refactor` | Code restructuring (no behavior change) |
| `chore` | Build, config, tooling |
| `perf` | Performance improvement |

### 6. Push & Create PR
```bash
git push origin feature/OAI-001-openapi-schema
```

Create a Pull Request to `develop` using the PR template.

---

## Pull Request Process

### PR Requirements
- [ ] Title follows format: `feat(OAI-001): description`
- [ ] Description explains what and why
- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Type-check passes (`npm run type-check`)
- [ ] Coverage ≥ 75%
- [ ] No `console.log` statements (use `logger` instead)
- [ ] Reviewed by at least 1 team member

### PR Review
- Reviews required within **4 hours** during business hours
- Reviewer checks:
  - Code follows feature module pattern
  - Error handling is comprehensive
  - Types are explicit (no `any`)
  - Tests cover happy path + error cases
  - No security issues
- Use "Request Changes" or "Approve" — not "Comment" for final review

### Merge Strategy
- **Squash merge** to `develop` (single clean commit)
- Delete branch after merge
- CI must pass before merge

---

## Coding Standards

### TypeScript
```typescript
// ✅ DO: Explicit types, const, async/await
export const createUser = async (data: CreateUserInput): Promise<User> => {
  const validated = userSchema.parse(data);
  return await userService.create(validated);
};

// ❌ DON'T: any, var, callbacks
export function createUser(data: any, callback: Function) {
  var user = userService.create(data);
  callback(null, user);
}
```

### Error Handling
```typescript
// ✅ DO: Use custom error classes
import { ValidationError, NotFoundError } from '../../middleware/error-handler';

if (!user) {
  throw new NotFoundError('User not found');
}

// ❌ DON'T: Generic errors or swallowing
try { doSomething(); } catch (e) { /* ignore */ }
```

### Logging
```typescript
// ✅ DO: Use structured logger
import { logger } from '../../utils/logger';
logger.info('User created', { userId: user.id, action: 'create' });

// ❌ DON'T: console.log
console.log('user created');
```

### Testing
```typescript
// ✅ DO: Descriptive test names, arrange-act-assert
describe('RateLimiter', () => {
  describe('when customer exceeds limit', () => {
    it('should return 429 with rate limit headers', async () => {
      // Arrange
      const req = createMockRequest({ customerId: 'test-123' });
      
      // Act
      const res = await rateLimiter.check(req);
      
      // Assert
      expect(res.status).toBe(429);
      expect(res.headers['X-RateLimit-Remaining']).toBe('0');
    });
  });
});
```

---

## Definition of Done

A feature is "Done" when:
1. ✅ Code implements the user story acceptance criteria
2. ✅ Unit tests pass with ≥ 75% coverage
3. ✅ Integration tests pass (if applicable)
4. ✅ ESLint passes with zero errors
5. ✅ TypeScript compilation succeeds (strict mode)
6. ✅ PR reviewed and approved
7. ✅ Merged to `develop`
8. ✅ Deployed to staging and verified

---

## Getting Help

- **Setup issues**: See [SETUP-TROUBLESHOOTING.md](SETUP-TROUBLESHOOTING.md)
- **Debugging**: See [docs/DEBUGGING.md](docs/DEBUGGING.md)
- **API testing**: See [docs/API-TESTING.md](docs/API-TESTING.md)
- **Quick question**: Post in #jarvis-dev Slack
- **Blocked**: Post in #jarvis-blockers Slack with ticket number

---

**Last Updated**: February 14, 2026
