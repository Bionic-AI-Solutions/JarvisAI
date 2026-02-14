# Phase 2A Technical Specifications - Feature Deep Dives

## Document Overview

**Scope**: Detailed technical specifications for all 5 Phase 2A features + Redis HA  
**Created**: February 13, 2026  
**Status**: Ready for Implementation  
**Audience**: Development team (Amelia, Winston), QA (Quinn), Documentation (Paige)

---

## TABLE OF CONTENTS

1. [OAI-001: OpenAPI Schema Generation](#oai-001-openapi-schema-generation)
2. [OAI-002: Request Validation Middleware](#oai-002-request-validation-middleware)
3. [OAI-003: Swagger UI & ReDoc Deployment](#oai-003-swagger-ui--redoc-deployment)
4. [CORS-001: CORS Middleware](#cors-001-cors-middleware)
5. [CORS-002: Security Headers](#cors-002-security-headers)
6. [SHELL-001: Bash Completion](#shell-001-bash-completion)
7. [SHELL-002: Zsh Completion](#shell-002-zsh-completion)
8. [SHELL-003: Installation Script](#shell-003-installation-script)
9. [HELP-001: Help System Core](#help-001-help-system-core)
10. [HELP-002: Rich Help Formatting](#help-002-rich-help-formatting)
11. [HELP-003: Dynamic Help Registry](#help-003-dynamic-help-registry)
12. [RL-001: Rate Limiter Core](#rl-001-rate-limiter-core)
13. [RL-002: Per-Customer Strategy](#rl-002-per-customer-strategy)
14. [RL-003: Per-IP Strategy](#rl-003-per-ip-strategy)
15. [RL-004: Dual-Layer Strategy](#rl-004-dual-layer-strategy)
16. [RL-005: Chaos & Failover](#rl-005-chaos--failover)
17. [REDIS-HA: Infrastructure](#redis-ha-infrastructure)

---

# FEATURE SPECIFICATIONS

## OAI-001: OpenAPI Schema Generation

**Points**: 3 | **Owner**: Amelia | **Days**: Mon-Tue

### Overview
Automatically generate OpenAPI 3.0 specifications from Zod schemas, enabling comprehensive API documentation with minimal manual effort. Detects and handles circular references in schema definitions.

### Requirements

**Functional Requirements**:
1. Accept Zod schema objects as input
2. Generate valid OpenAPI 3.0 JSON/YAML specification
3. Support nested schemas with proper references ($ref)
4. Detect and handle circular references gracefully
5. Export specification in both JSON and YAML formats

**Non-Functional Requirements**:
- Generation time: < 100ms for typical schemas
- Memory usage: < 50MB for 1000+ schema definitions
- Support multi-level nesting (depth: unlimited with cycle detection)
- Error messages clear and actionable

### Technical Design

**Input Format**:
```typescript
// Zod schema example
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  profile: z.object({
    name: z.string(),
    avatar: z.string().url().optional(),
  }),
  posts: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
  })),
});

// Input object
{
  User: userSchema,
  // ... other schemas
}
```

**Output Format** (OpenAPI 3.0.0):
```json
{
  "_openapi": "3.0.0",
  "info": {
    "title": "Jarvis API",
    "version": "1.0.0"
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "email": { "type": "string", "format": "email" },
          "profile": { "$ref": "#/components/schemas/Profile" },
          "posts": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Post" }
          }
        },
        "required": ["id", "email", "profile", "posts"]
      }
    }
  }
}
```

**Circular Reference Handling**:
```typescript
// Problematic case: Self-referential schema
const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  parent: z.lazy(() => categorySchema).optional(), // ← Circular!
});

// Detection strategy:
// 1. Track visited schemas by name
// 2. Detect when schema references itself (directly or indirectly)
// 3. Use z.lazy() for legitimate recursive structures
// 4. Error or warn on problematic circularity
```

### Implementation Details

**Module Structure**:
```
src/features/openapi/
├── index.ts                         # Public API
├── openapi.service.ts               # Main logic
├── utils/
│   ├── schema-generator.ts          # Zod → OpenAPI conversion
│   ├── circular-ref-detector.ts     # Circular reference detection
│   └── type-mapper.ts               # Zod types → OpenAPI types mapping
└── __tests__/
    ├── schema-generator.test.ts
    └── circular-refs.test.ts
```

**Type Mapper (Zod ↔ OpenAPI)**:
```typescript
// Map Zod types to OpenAPI types
const typeMapping = {
  'ZodString': { type: 'string' },
  'ZodNumber': { type: 'number' },
  'ZodUUID': { type: 'string', format: 'uuid' },
  'ZodEmail': { type: 'string', format: 'email' },
  'ZodArray': { type: 'array', items: {...} },
  'ZodObject': { type: 'object', properties: {...} },
  'ZodUnion': { oneOf: [...] },
};
```

### Acceptance Criteria

- [ ] Accepts Zod schema objects and generates valid OpenAPI 3.0
- [ ] Handles nested schemas with $ref
- [ ] Detects circular references and throws clear error
- [ ] Supports optional fields (marked in "required" array)
- [ ] Generates both JSON and YAML output
- [ ] < 100ms generation time for typical schema (100 properties)
- [ ] Unit tests: 12/12 scenarios passing
- [ ] Circular ref test: Edge cases handled (self-ref, indirect cycles)

### Edge Cases & Mitigations

| Case | Handling |
|------|----------|
| **Circular self-ref** | Detect in graph traversal; throw error with schema name |
| **Indirect cycles** (A→B→C→A) | Track visited path; detect when re-visiting |
| **Legitimate `z.lazy()`** | Allow; assume developer knows what they're doing |
| **Deeply nested** (10+ levels) | No depth limit; validate at runtime |
| **Union types** | Convert to OpenAPI `oneOf` |
| **Discriminated unions** | Use OpenAPI `discriminator` field |

### Testing Strategy

**Unit Tests**:
1. Simple scalar schema (string, number, etc.)
2. Complex nested schema (3+ levels)
3. Array of objects
4. Optional fields
5. Union types
6. Circular reference (self)
7. Circular reference (indirect)
8. Large schema (100+ properties)
9. Custom formats (uuid, email, url)
10. Error messages (clear on failure)
11. YAML output format
12. Schema validation against OpenAPI spec

**Integration Tests**:
- Schema generation in Express middleware
- Swagger UI uses generated schema
- Schema validation works correctly (verified in OAI-002)

---

## OAI-002: Request Validation Middleware

**Points**: 2 | **Owner**: Amelia | **Days**: Tue-Wed

### Overview
Express middleware that validates incoming requests against Zod schemas, ensuring API consistency and type safety at the HTTP boundary.

### Requirements

**Functional Requirements**:
1. Intercept HTTP requests before route handlers
2. Validate request body against schema
3. Validate query parameters against schema (optional)
4. Validate headers against schema (optional)
5. Return 400 with clear error message on validation failure
6. Pass validated data to route handler

**Non-Functional Requirements**:
- Validation overhead: < 5ms per request
- Support both strict and lenient validation modes
- Error messages human-readable and API-friendly

### Technical Design

**Middleware Signature**:
```typescript
// Usage in Express
app.post('/users', 
  validateRequest(userCreateSchema),  // Validate body
  userController.create               // Route handler
);

// Advanced usage
app.post('/orders',
  validateRequest({
    body: orderSchema,
    query: filterSchema,
    headers: authHeadersSchema,
  }),
  orderController.create
);
```

**Error Response Format**:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format",
      "received": "not-an-email"
    },
    {
      "field": "age",
      "message": "Must be a positive number",
      "received": "abc"
    }
  ]
}
```

**Implementation Pattern**:
```typescript
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    
    // Attach validated data to request
    req.validatedBody = result.data;
    next();
  };
}
```

### Acceptance Criteria

- [ ] Validates request body against schema
- [ ] Returns 400 with clear error details on failure
- [ ] Passes validated data to route handler
- [ ] Validation overhead < 5ms
- [ ] Error messages are developer and user-friendly
- [ ] Unit tests: 8/8 scenarios passing
- [ ] Integration test: Validates CORS requests end-to-end

### Testing Strategy

**Unit Tests**:
1. Valid request passes validation
2. Invalid request rejected (missing field)
3. Invalid request rejected (wrong type)
4. Invalid request rejected (format violation)
5. Optional fields handled correctly
6. Nested object validation
7. Array validation
8. Error message formatting

---

## OAI-003: Swagger UI & ReDoc Deployment

**Points**: 2 | **Owner**: Amelia | **Days**: Wed

### Overview
Deploy interactive API documentation endpoints using Swagger UI and ReDoc, making the OpenAPI schema accessible to developers and non-technical stakeholders.

### Requirements

**Functional Requirements**:
1. Expose `/api-docs` endpoint serving Swagger UI
2. Expose `/api-docs/redoc` endpoint serving ReDoc
3. Both UI tools read from generated OpenAPI schema
4. Support schema updates without restart
5. Serve static assets (CSS, JS) from CDN or local

**Non-Functional Requirements**:
- Page load time: < 2 seconds (Swagger UI)
- Responsive design (mobile-friendly)
- Schema updates reflected immediately

### Technical Design

**Endpoints**:
```
GET /api-docs          → Swagger UI HTML
GET /api-docs/redoc    → ReDoc HTML
GET /api-docs/openapi.json → OpenAPI spec JSON
GET /api-docs/openapi.yaml → OpenAPI spec YAML
```

**Implementation**:
```typescript
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';
import { openApiService } from './openapi.service';

// Middleware to generate fresh spec
app.get('/api-docs/openapi.json', (req, res) => {
  const spec = openApiService.generateOpenAPI(allSchemas);
  res.json(spec);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(null, {
  swaggerUrl: '/api-docs/openapi.json', // Dynamic spec URL
}));

// ReDoc
app.get('/api-docs/redoc', redoc.render({
  specUrl: '/api-docs/openapi.json',
}));
```

### Acceptance Criteria

- [ ] Swagger UI endpoint responds with HTML
- [ ] ReDoc endpoint responds with HTML
- [ ] Both UIs display API schema correctly
- [ ] UI updates when schema changes
- [ ] Page loads in < 2 seconds
- [ ] Mobile-responsive
- [ ] Integration test: Swagger UI renders correctly

---

## CORS-001: CORS Middleware

**Points**: 2 | **Owner**: Amelia | **Days**: Thu

### Overview
Implement Cross-Origin Resource Sharing (CORS) middleware to safely allow cross-domain requests, with configurable origin policies and preflight request handling.

### Requirements

**Functional Requirements**:
1. Respond to OPTIONS preflight requests with 204
2. Set `Access-Control-Allow-Origin` header based on origin whitelist
3. Set `Access-Control-Allow-Methods` header
4. Set `Access-Control-Allow-Headers` header
5. Support wildcard origins for public endpoints
6. Support specific origin whitelisting for sensitive endpoints

**Non-Functional Requirements**:
- CORS checks: < 1ms per request
- Support both simple and preflight requests
- Clear configuration per route

### Technical Design

**Configuration**:
```typescript
// CORS config
const corsConfig = {
  allowedOrigins: [
    'http://localhost:3000',
    'https://example.com',
    'https://admin.example.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
```

**Preflight Handling**:
```
Browser Request (CORS):
  GET https://api.example.com/users
  Origin: https://example.com

Server Response:
  Access-Control-Allow-Origin: https://example.com
  Access-Control-Allow-Methods: GET,POST,PUT,DELETE
  Access-Control-Allow-Headers: Content-Type,Authorization
  Access-Control-Allow-Credentials: true
```

**Implementation**:
```typescript
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('origin');
  
  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
}
```

### Acceptance Criteria

- [ ] OPTIONS preflight returns 204
- [ ] Correct CORS headers on simple requests
- [ ] Allows GET, POST, PUT, DELETE methods
- [ ] Allows Content-Type and Authorization headers
- [ ] Respects origin whitelist
- [ ] Unit tests: 5/5 scenarios passing
- [ ] Integration test: Cross-origin requests work

### Known Limitations & Mitigations

| Limitation | Reason | Workaround |
|-----------|--------|-----------|
| **Wildcard origin + credentials not allowed** | Browser security restriction | Use specific origins if credentials needed |
| **CORS errors can't be caught in JavaScript** | Part of CORS security design | Document in API docs; client logs network errors |

---

## CORS-002: Security Headers

**Points**: 1.5 | **Owner**: Amelia | **Days**: Thu

### Overview
Implement critical HTTP security headers (X-Frame-Options, CSP, HSTS) to protect against common web vulnerabilities.

### Requirements

**Headers to Implement**:
1. `X-Content-Type-Options: nosniff` — Prevent MIME type sniffing
2. `X-Frame-Options: DENY` — Prevent clickjacking
3. `Strict-Transport-Security` — Force HTTPS
4. `Content-Security-Policy` — Restrict resource loading

### Technical Design

**Header Values**:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com; style-src 'self' 'unsafe-inline'
```

### Acceptance Criteria

- [ ] All security headers present in responses
- [ ] X-Frame-Options prevents framing
- [ ] HSTS enforces HTTPS
- [ ] CSP restricts external script loading
- [ ] Unit tests: 4/4 scenarios passing

---

## SHELL-001: Bash Completion

**Points**: 1 | **Owner**: Amelia | **Days**: Thu-Fri | **Start**: Phase 1 Week 1

### Overview
Generate dynamic Bash completion scripts enabling tab-completion in Bash shells for the Jarvis CLI.

### Requirements

**Functional Requirements**:
1. Generate `.bash_completion` file with Bash completion function
2. List all available commands
3. Provide command descriptions in tooltips
4. Support partial word completion
5. Dynamic completion based on runtime command registry

**Non-Functional Requirements**:
- Completion response: < 50ms
- Support Bash 3.2+ (macOS, Linux)

### Technical Design

**Bash Completion Function**:
```bash
_jarvis_completion() {
  local cur prev opts lastopt
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"
  opts="create delete update list help"
  
  # Complete subcommands
  if [[ ${cur} == -* ]] ; then
    COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
  fi
  
  return 0
}

complete -o bashdefault -o default -o nospace -F _jarvis_completion jarvis
```

**Installation**:
```bash
# User runs:
curl -s https://example.com/install-bash-completion.sh | bash

# Script adds to ~/.bashrc:
source /usr/local/share/bash-completion.d/jarvis
```

### Acceptance Criteria

- [ ] Generates valid Bash completion script
- [ ] Completion function handles all commands
- [ ] Partial word completion works
- [ ] Installation script adds to ~/.bashrc
- [ ] Unit tests: 3/3 scenarios passing
- [ ] Integration test: Actual tab-completion works

---

## SHELL-002: Zsh Completion

**Points**: 1 | **Owner**: Amelia | **Days**: Week 2

### Overview
Generate dynamic Zsh completion scripts for tab-completion in Zsh shells.

### Requirements

**Similar to Bash but using Zsh syntax**:
1. Generate completion function using `#compdef` syntax
2. List commands with descriptions
3. Support partial word completion

### Technical Design

**Zsh Completion Function**:
```zsh
#compdef jarvis

_jarvis_commands() {
  local commands=(
    'create:Create a new resource'
    'delete:Delete resource'
    'update:Update existing resource'
    'list:List resources'
    'help:Show help'
  )
  
  _describe 'command' commands
}

_jarvis_completion() {
  _jarvis_commands
}

_jarvis_completion
```

### Acceptance Criteria

- [ ] Generates valid Zsh completion script
- [ ] Completion function handles all commands
- [ ] Integration test: Zsh tab-completion works

---

## SHELL-003: Installation Script

**Points**: 0.5 | **Owner**: Amelia | **Days**: Week 2

### Overview
Create installer script that adds shell completion files to system directories and updates shell config files.

### Requirements

**Installation Steps**:
1. Copy `.bash_completion` to system directory
2. Copy `.zsh_completion` to system directory
3. Add source line to `~/.bashrc` or `~/.zshrc`
4. Provide uninstall script

### Acceptance Criteria

- [ ] Installs to correct directories (`/usr/local/share/bash-completion.d/`)
- [ ] Updates `~/.bashrc` and `~/.zshrc` correctly
- [ ] Handles permission errors gracefully
- [ ] Uninstall removes files and lines

---

## HELP-001: Help System Core

**Points**: 2 | **Owner**: Amelia | **Days**: Week 2

### Overview
Build core help system that retrieves and formats command help information with rich formatting support.

### Requirements

**Functional Requirements**:
1. Registry of all CLI commands with metadata
2. Retrieve help for specific command by name
3. Support hierarchical help (category → command → details)
4. Return "not found" for unknown commands
5. Store help data in YAML for easy maintenance

**Technical Design**:

**Help Data Structure** (command-help.yaml):
```yaml
commands:
  create:
    description: "Create a new resource"
    usage: "jarvis create --type <type> --name <name>"
    options:
      - flag: "--type, -t"
        description: "Type of resource (user, post, etc.)"
        required: true
      - flag: "--name, -n"
        description: "Name of resource"
        required: true
      - flag: "--dry-run"
        description: "Preview without saving"
        required: false
    examples:
      - "jarvis create --type user --name Alice"
      - "jarvis create --type post --name 'My Post' --dry-run"

  delete:
    description: "Delete a resource"
    usage: "jarvis delete --id <id>"
    options:
      - flag: "--id, -i"
        description: "ID of resource to delete"
        required: true
      - flag: "--force, -f"
        description: "Skip confirmation"
        required: false
```

### Acceptance Criteria

- [ ] Command help retrieved by name
- [ ] Unknown command returns "not found"
- [ ] Help includes usage, options, examples
- [ ] Data loaded from YAML file at startup
- [ ] Unit tests: 3/3 scenarios passing

---

## HELP-002: Rich Help Formatting

**Points**: 2 | **Owner**: Amelia | **Days**: Week 2

### Overview
Format help output with colors, alignment, and interactive features for better readability.

### Requirements

**Formatting Features**:
1. Colored output (command name in blue, options in green)
2. Section headers (USAGE, OPTIONS, EXAMPLES)
3. Left-aligned option names, descriptions right-aligned
4. Code blocks for examples (monospace font)
5. Interactive features (e.g., "Press ENTER for more")

**Output Example**:
```
┌─────────────────────────────────────────────┐
│                  jarvis create              │
│              Create a new resource          │
└─────────────────────────────────────────────┘

USAGE:
  jarvis create --type <type> --name <name>

OPTIONS:
  --type, -t              Type of resource (user, post, etc.)
  --name, -n              Name of resource
  --dry-run               Preview without saving

EXAMPLES:
  $ jarvis create --type user --name Alice
  $ jarvis create --type post --dry-run
```

### Acceptance Criteria

- [ ] Colored output renders correctly in terminal
- [ ] Text alignment is consistent
- [ ] Code blocks formatted clearly
- [ ] Output works in 80-column width terminals
- [ ] Unit tests: 2/2 scenarios passing

---

## HELP-003: Dynamic Help Registry

**Points**: 1 | **Owner**: Amelia | **Days**: Week 2

### Overview
Enable dynamic registration of help entries, allowing features to self-register help information without modifying central files.

### Requirements

**Dynamic Registration API**:
```typescript
// In each feature module
HelpRegistry.register({
  command: 'rate-limit-status',
  category: 'monitoring',
  description: 'Check rate limit status',
  usage: 'jarvis rate-limit-status <customer-id>',
  options: [...],
});
```

### Acceptance Criteria

- [ ] Features can register help at startup
- [ ] Registered help appears in help system
- [ ] Registry supports multiple registrations
- [ ] Handles duplicate command names gracefully

---

## RL-001: Rate Limiter Core

**Points**: 2 | **Owner**: Amelia | **Days**: Week 2

### Overview
Implement core rate limiting service that tracks request counts and enforces limits using Redis as the backing store.

### Requirements

**Functional Requirements**:
1. Check if request should be rate limited (boolean)
2. Get current count and limit status
3. Support multiple rate limiting strategies
4. Use Redis for distributed state
5. Atomic operations (Lua scripts) to prevent race conditions

**Technical Design**:

**Rate Limit Check Flow**:
```
Request arrives
  ↓
RateLimiterMiddleware checks rate limit
  ↓
Call Redis Lua script (atomic check + increment)
  ↓
If count < limit: Allow, increment counter, return false
  ↓
If count >= limit: Block, return true (429)
  ↓
Counter expires after TTL (sliding window)
```

**Lua Script** (atomic operation in Redis):
```lua
-- check-limit.lua
-- Keys: [customer_key, ip_key]
-- Args: [customer_limit, ip_limit, window_seconds]

local customer_count = tonumber(redis.call('GET', KEYS[1]) or 0)
local ip_count = tonumber(redis.call('GET', KEYS[2]) or 0)

if customer_count >= tonumber(ARGV[1]) or ip_count >= tonumber(ARGV[2]) then
  return 1  -- Limited
end

redis.call('INCR', KEYS[1])
redis.call('EXPIRE', KEYS[1], tonumber(ARGV[3]))
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[3]))

return 0  -- Allowed
```

### Acceptance Criteria

- [ ] Checks rate limit against Redis
- [ ] Atomic increment (no race conditions)
- [ ] TTL-based window expiration
- [ ] Returns 429 on limit exceeded
- [ ] Lua script optimized for performance
- [ ] Unit tests: 5/5 scenarios passing

---

## RL-002: Per-Customer Strategy

**Points**: 2 | **Owner**: Amelia | **Days**: Week 2

### Overview
Implement per-customer rate limiting strategy, tracking usage across all IPs for a single customer.

### Requirements

**Logic**:
- Track requests per customer ID
- Aggregate across all IP addresses for that customer
- Useful for quota management (e.g., "1000 requests/hour per customer")

**Redis Key**:
```
rate-limit:customer:<customer-id>:rl-window
Value: request count
TTL: window duration (e.g., 1 hour)
```

### Acceptance Criteria

- [ ] Tracks requests per customer across all IPs
- [ ] Independent counters for different customers
- [ ] Integration test: Per-customer limiting works

---

## RL-003: Per-IP Strategy

**Points**: 1.5 | **Owner**: Amelia | **Days**: Week 2

### Overview
Implement per-IP rate limiting strategy, tracking usage from single IP addresses.

### Requirements

**Logic**:
- Track requests per IP address
- Useful for DDoS protection (e.g., "10,000 requests/hour per IP")

**Redis Key**:
```
rate-limit:ip:<ip-address>:rl-window
Value: request count
TTL: window duration
```

### Acceptance Criteria

- [ ] Tracks requests per IP independently
- [ ] Different IPs have separate limits
- [ ] Integration test: Per-IP limiting works

---

## RL-004: Dual-Layer Strategy

**Points**: 3 | **Owner**: Amelia | **Days**: Thu-Fri (Week 2)

### Overview
Implement dual-layer rate limiting combining per-customer and per-IP strategies. Request is blocked if EITHER layer exceeds its limit.

### Requirements

**Logic**:
```
if (customer_count >= 1000 OR ip_count >= 10000) {
  return 429 (Too Many Requests)
}
```

**Use Cases**:
- Per-customer quota: 1000 req/hour (prevents heavy users from monopolizing)
- Per-IP quota: 10,000 req/hour (prevents DDoS from single IP)
- Either violation blocks the request

**Configuration**:
```typescript
const rateLimitConfig = {
  strategies: {
    perCustomer: { limit: 1000, window: 3600 }, // 1000 req/hour
    perIP: { limit: 10000, window: 3600 },      // 10,000 req/hour
  },
};
```

### Acceptance Criteria

- [ ] Enforces BOTH per-customer AND per-IP limits
- [ ] Request blocked if either layer exceeds limit
- [ ] Independent counters for each layer
- [ ] Unit tests: 3/3 scenarios passing
- [ ] Integration test: Dual-layer limiting works

---

## RL-005: Chaos & Failover

**Points**: 2 | **Owner**: Amelia | **Days**: Week 2

### Overview
Test rate limiting system under Redis failover scenarios, ensuring graceful degradation and recovery.

### Requirements

**Scenarios**:
1. **Master failure**: Master goes down, Sentinel elects new master
2. **Network partition**: Temporary loss of Redis connectivity
3. **Clock skew**: System time adjusts (affects TTL calculation)
4. **High load**: 1000+ concurrent requests

**Graceful Degradation**:
- If Redis unavailable: Fall back to in-memory rate limiting
- Resume Redis-backed limiting when system recovers
- No data loss on failover (Redis persistence via RDB/AOF)

### Technical Design

**Failover Handler**:
```typescript
export class RateLimiterService {
  private inmemoryFallback = new Map<string, RequestCount>();

  async checkLimit(customerId: string, ip: string): Promise<boolean> {
    try {
      return await this.redisCheckLimit(customerId, ip);
    } catch (error) {
      logger.warn('Redis unavailable, using fallback', { error });
      return this.inMemoryCheckLimit(customerId, ip);
    }
  }

  private inMemoryCheckLimit(customerId: string, ip: string): boolean {
    const key = `${customerId}:${ip}`;
    const count = this.inmemoryFallback.get(key) || 0;
    
    if (count >= LIMIT) return true;
    
    this.inmemoryFallback.set(key, count + 1);
    // Cleanup after window
    setTimeout(() => this.inmemoryFallback.delete(key), WINDOW_MS);
    
    return false;
  }
}
```

### Acceptance Criteria

- [ ] System survives Redis master failure
- [ ] Graceful fallback to in-memory rate limiting
- [ ] Resumes Redis-backed limiting after failover
- [ ] No false positives/negatives during failover
- [ ] Chaos tests: 3/3 scenarios passing

---

## REDIS-HA: Infrastructure

**Points**: 21 | **Owner**: Infrastructure Lead | **Timeline**: Feb 12-24 (Pre-sprint)

### Overview
Provision and configure Redis High Availability infrastructure using Sentinel for automatic failover, supporting rate limiting and caching needs.

### Architecture

**Topology**:
```
┌─────────────────────────────────────────────┐
│        Redis Sentinel Cluster               │
│                                             │
│  Sentinel-1    Sentinel-2    Sentinel-3    │
│    :26379        :26379        :26379       │
│      ↓            ↓              ↓          │
│  ┌────────────────────────────────────┐   │
│  │  Redis Master (6379)               │   │
│  │  • Primary read/write              │   │
│  │  • Persistence (RDB + AOF)         │   │
│  │  • Replication to replicas         │   │
│  └────────────────────────────────────┘   │
│    ↓              ↓              ↓         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │Replica-1│  │Replica-2│  │Replica-3│   │
│  │(6379)   │  │(6379)   │  │(6379)   │   │
│  └─────────┘  └─────────┘  └─────────┘   │
└─────────────────────────────────────────────┘
         (Replication lag: < 50ms)
```

### Benefits

| Feature | Benefit |
|---------|---------|
| **Sentinel Monitoring** | Automatic master failure detection & election |
| **Replication** | Data redundancy; read scaling |
| **Persistence** | Data survives server restart (RDB every 60s + AOF) |
| **Failover < 30s** | Minimal downtime during master failure |

### Configuration Details

**Sentinel Config**:
```
port 26379
quorum 2
down-after-milliseconds 30000
parallel-syncs 1
failover-timeout 180000
```

**Master Config**:
```
port 6379
save 60 1000              # RDB: Save every 60s if 1000+ keys changed
appendonly yes            # AOF: Append-only file for durability
appendfsync everysec      # Fsync every 1 second
repl-diskless-sync no     # Use disk for sync (safer)
```

### Failover Procedure

**Scenario**: Master node crashes

**Timeline**:
1. **T+0**: Requests fail to master
2. **T+10**: Sentinel detects failure (after 30s down threshold)
3. **T+15**: Sentinel elects new master (consensus among sentinels)
4. **T+20**: Clients reconnected (ioredis auto-discovers new master)
5. **T+30**: Service recovered (max 30s downtime)

### Acceptance Criteria

- [ ] 3 Redis nodes + 3 Sentinel nodes provisioned
- [ ] Master-replica replication working
- [ ] Persistence configured (RDB + AOF)
- [ ] Manual failover tested (master down → new master elected)
- [ ] Automatic reconnection verified
- [ ] ioredis connection pool configured
- [ ] Monitoring & alerting set up
- [ ] Chaos tests: 3/3 scenarios passing

---

# CROSS-FEATURE INTEGRATION

## Feature Dependency Graph

```
Rate Limiting (RL)
  ├─ Depends on: Redis HA ✓
  ???─ Used by: All API endpoints
  └─ Related: OpenAPI validation (OAI)

CORS (CORS)
  ├─ Depends on: None
  ├─ Used by: All API endpoints
  └─ Related: Security (headers)

OpenAPI (OAI)
  ├─ Depends on: None
  ├─ Used by: API documentation, validation
  └─ Related: Request validation, schema generation

Shell Completion (SHELL)
  ├─ Depends on: CLI Help system (HELP)
  └─ Related: CLI UX

CLI Help (HELP)
  ├─ Depends on: None
  └─ Related: Shell Completion (SHELL)
```

## End-to-End Flow

```
1. Client makes request → Hits CORS middleware
2. CORS checks origin → Allow/Reject
3. Request → Rate Limiter checks per-customer + per-IP limits
4. If limited → 429 response
5. If allowed → OpenAPI validation middleware
6. Validation fails → 400 response with error details
7. Validation passes → Route handler processes request
8. Response includes security headers (CORS-002)
9. API docs available at /api-docs (Swagger UI, ReDoc)
10. CLI users get shell completion + help system
```

---

# ERROR HANDLING & EDGE CASES

## Common Error Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| **Redis connection fails** | Fall back to in-memory RL; queue message to alert |
| **Invalid request schema** | Return 400 with detailed validation errors |
| **CORS preflight fails** | Browser prevents request; logs in console |
| **Shell completion timeout** | Timeout after 5s; return partial list |
| **Help for unknown command** | Return "Command not found: X; use help for list" |

## Performance Targets

| Component | Target | Success Criteria |
|-----------|--------|------------------|
| **Rate limit check** | < 5ms | Lua script execution + Redis latency |
| **CORS processing** | < 1ms | Header lookup + string operations |
| **OpenAPI validation** | < 5ms per request | Schema matching + error formatting |
| **Shell completion** | < 50ms | Command registry lookup |
| **Help rendering** | < 10ms | YAML parsing + formatting |

---

# DEPLOYMENT CHECKLIST

**Pre-Deployment**:
- [ ] All 5 features coded and tested locally
- [ ] Integration tests passing
- [ ] Chaos tests validate Redis failover
- [ ] Code review approved
- [ ] Documentation updated

**Staging Deployment**:
- [ ] Deploy to staging environment
- [ ] Smoke tests: All endpoints respond
- [ ] Rate limiting: Test with load (1000+ requests/min)
- [ ] CORS: Cross-origin requests work
- [ ] Help + shell completion: CLI works
- [ ] Swagger UI + ReDoc: Docs accessible

**Production Readiness**:
- [ ] Monitoring & alerting configured
- [ ] Runbook for common issues documented
- [ ] Rollback plan prepared
- [ ] Customer communication ready
- [ ] On-call schedule assigned

---

**Document Version**: 1.0  
**Last Updated**: February 13, 2026  
**Contributors**: Amelia (Dev), Winston (Architect), Quinn (QA), Paige (Docs), John (PM)
