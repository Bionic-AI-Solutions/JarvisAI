# Phase 2A Enhancement User Stories - Complete
## All 5 Enhancements + Infrastructure (Full Sprint Plan)

**Status**: Ready for Implementation  
**Created By**: BMAD Agent Collaboration (Winston, Amelia, John, Quinn, Paige, Bob)  
**Date**: February 12, 2026  
**Sprint Duration**: 14 days (Feb 24 - Mar 10, 2026)  
**Total Story Points**: 93 points

---

## Executive Summary

This document contains ALL user stories needed for Phase 2A enhancements:
- **5 Product Enhancements** (52 dev points + 7 QA points)
- **1 Infrastructure Epic** (21 points - prerequisite)
- **Total**: 93 story points across 3 engineers + 1 tech writer

---

## SECTION 1: INFRASTRUCTURE (PREREQUISITE - COMPLETE BY FEB 24)

### Epic: Redis High Availability Infrastructure

**Epic Owner**: Infrastructure/DevOps  
**Total Points**: 21  
**Prerequisite**: Must complete BEFORE development sprint starts  

---

## STORY GROUP: REDIS HA (21 points) 

### REDIS-001: Design Redis Sentinel Architecture
**Priority**: P0 | **Points**: 5 | **Owner**: Winston (Architect)

**As a** System Architect,  
**I want to** finalize and document the Redis HA architecture (Sentinel vs Cluster),  
**So that** infrastructure team has clear specifications for provisioning.

**Acceptance Criteria**:
- [ ] Architecture decision documented: Sentinel recommended (vs Cluster)
- [ ] Architecture diagram created (3 Sentinel nodes, master/slave relationships)
- [ ] Failure scenarios documented (master down, network partition, clock skew)
- [ ] Monitoring strategy defined (metrics, alerts, thresholds)
- [ ] Cost vs scaling analysis (Sentinel: $200-300/mo, Cluster: $500-700/mo)
- [ ] Approvals obtained: Winston ✓, Infrastructure Lead ✓, John (PM) ✓

**Definition of Done**: Approved architecture document + diagrams in shared drive

---

### REDIS-002: Provision Staging Redis Sentinel Cluster
**Priority**: P0 | **Points**: 8 | **Owner**: Infrastructure Lead

**As an** Infrastructure Engineer,  
**I want to** provision a 3-node Redis Sentinel cluster in staging,  
**So that** developers can test rate limiting and failover scenarios.

**Acceptance Criteria**:
- [ ] 3 Redis nodes provisioned (t3.medium master + 2 replicas)
- [ ] 3 Sentinel nodes provisioned (separate, quorum=2)
- [ ] Network configured (security groups, private subnet)
- [ ] Persistence configured (RDB + AOF, daily S3 backups)
- [ ] DNS endpoints created (`redis-staging-sentinel.internal`)
- [ ] Manual failover tested: master down → new master elected (< 30 sec)
- [ ] Replication verified: data propagates to replicas

**Definition of Done**: 6 instances running, failover tested, monitoring dashboard live

---

### REDIS-003: Configure ioredis Connection Pool
**Priority**: P0 | **Points**: 5 | **Owner**: Amelia (Developer)

**As a** Senior Developer,  
**I want to** configure the ioredis client with Sentinel discovery,  
**So that** rate limiting automatically handles Redis failover.

**Acceptance Criteria**:
- [ ] ioredis v5.3.2+ installed (replaces old redis package)
- [ ] Sentinel discovery configured (automatic master discovery, no hardcoded IPs)
- [ ] Connection pool tuned (10 max connections, 5 sec timeout)
- [ ] Error handling: connection loss → graceful degradation (fallback to in-memory)
- [ ] Health check: periodic PING to Redis (10 sec intervals)
- [ ] Code example provided with environment variables
- [ ] Unit tests (Sentinel discovery, connection pool, failover detection)
- [ ] Integration test in staging: connect → read/write → verify replication

**Definition of Done**: Code merged, all tests passing, connects to staging Redis

---

### REDIS-004: Set Up Monitoring & Alerting
**Priority**: P0 | **Points**: 5 | **Owner**: Infrastructure Lead + Bob

**As an** Operations Engineer,  
**I want to** set up comprehensive monitoring and alerting for Redis,  
**So that** we detect and respond to failures within 5 minutes.

**Acceptance Criteria**:
- [ ] Prometheus exporters installed (redis_exporter, sentinel_exporter)
- [ ] Key metrics tracked: connections, memory, replication lag, cache hits/misses
- [ ] Grafana dashboard created (overview, connections, performance, alerts)
- [ ] CloudWatch alarms (Memory > 80%, Replication lag > 1s, Master down)
- [ ] Slack/PagerDuty integration for critical alerts
- [ ] Runbook documented: alert response procedures
- [ ] Alert test: kill master → verify alert fires (< 1 min)

**Definition of Done**: Dashboard accessible, alerts tested, team trained on runbook

---

### REDIS-005: Create Redis Credentials & IAM Access
**Priority**: P0 | **Points**: 3 | **Owner**: Infrastructure Lead

**As a** Security Engineer,  
**I want to** provision Redis credentials and access controls,  
**So that** applications connect securely without hardcoding passwords.

**Acceptance Criteria**:
- [ ] Redis ACL users created: master user, application user (rate limiting only), monitoring user
- [ ] Passwords stored in AWS Secrets Manager (90-day rotation)
- [ ] IAM roles: app servers can read (app user only), infrastructure can rotate all
- [ ] Environment variables provided: REDIS_HOST, REDIS_PASSWORD, REDIS_SENTINEL_PASSWORD
- [ ] Audit logging enabled (password access, login attempts)
- [ ] Dev team receives connection string

**Definition of Done**: Credentials generated, secrets manager verified, team has access

---

### REDIS-006: Implement Redis Lua Scripting for Atomicity
**Priority**: P0 | **Points**: 5 | **Owner**: Amelia (Developer)

**As a** Senior Developer,  
**I want to** implement Lua scripts for atomic rate limiting operations,  
**So that** race conditions are eliminated in multi-server scenarios.

**Acceptance Criteria**:
- [ ] Lua script for rate limit check-and-increment implemented (atomic GET/SET/DECR)
- [ ] Script cached with SHA-1 hash (no re-eval on every call)
- [ ] Error handling: graceful fallback if script fails
- [ ] Unit tests: tokens decrement correctly, overflow prevention, expiration set
- [ ] Integration test: 5 concurrent processes, atomic operations verified
- [ ] Performance verified: script execution < 2ms per call

**Definition of Done**: Script tested, atomicity proven, merged with 100% test pass

---

### REDIS-007: Implement Redis Failover Testing & Chaos
**Priority**: P0 | **Points**: 5 | **Owner**: Quinn (QA) + Infrastructure

**As a** QA Engineer,  
**I want to** set up automated chaos testing for Redis failover,  
**So that** we verify graceful degradation in production-like conditions.

**Acceptance Criteria**:
- [ ] Kill master node → verify failover (< 30 sec)
- [ ] Kill 1 replica → cluster still works
- [ ] Kill 1 Sentinel node → 2-node quorum still works
- [ ] Network partition → verify quorum decision
- [ ] Automated test script: failover + recovery verification
- [ ] Stress test: 100 req/sec during master failure, rate limiting still works
- [ ] Clock skew test: ±10 second drift, rate limiting still correct

**Definition of Done**: Chaos tests automated, all scenarios passed, results documented

---

### REDIS-008: Documentation: Redis HA Setup Runbook
**Priority**: P0 | **Points**: 3 | **Owner**: Paige (Tech Writer)

**As an** Operations Engineer,  
**I want to** have comprehensive runbook documentation,  
**So that** on-call engineers can troubleshoot Redis issues.

**Acceptance Criteria**:
- [ ] Architecture overview documented (diagram, connection flow, failover process)
- [ ] Common operations documented (check status, trigger failover, scale replicas)
- [ ] Troubleshooting guide (master down, replication lag, memory, connection errors)
- [ ] Alert response procedures (memory, lag, master down)
- [ ] Emergency procedures (total failure recovery, backup restore)
- [ ] Performance baseline documented (latency, memory, replication lag expectations)

**Definition of Done**: Runbook published, team trained, examples tested

---

## SECTION 2: PRODUCT ENHANCEMENTS (DEV SPRINT: FEB 24 - MAR 10)

### Epic 1: OpenAPI 3.0 Integration
**Team**: Amelia (Dev), Quinn (QA), Paige (Tech Writer)  
**Total Points**: 8 dev + 1 QA = 9 points  
**Timeline**: Days 1-3  
**Prerequisite**: None (can start immediately)

---

### OAI-001: Implement OpenAPI Schema Generation (Zod → OpenAPI)
**Priority**: P0 | **Points**: 3 | **Owner**: Amelia (Developer)

**As a** Developer,  
**I want to** generate OpenAPI 3.0 schemas automatically from Zod validation schemas,  
**So that** API documentation is always in sync with code.

**Acceptance Criteria**:
- [ ] zod-to-openapi package installed
- [ ] Zod schemas created for all API endpoints (request + response)
- [ ] OpenAPI document generation implemented (build-time script)
- [ ] Schema includes: parameters, response codes, examples, descriptions
- [ ] Version management: API versioning in path (e.g., `/api/v1/...`)
- [ ] No drift: schema validates 100% of actual API behavior
- [ ] Build artifact: `/api/openapi.json` generated and committed

**Definition of Done**: Schema generated, validates all endpoints, merged to develop

---

### OAI-002: Implement OpenAPI Validation Middleware
**Priority**: P0 | **Points**: 3 | **Owner**: Amelia (Developer)

**As a** Developer,  
**I want to** validate incoming requests against the OpenAPI schema,  
**So that** invalid requests are rejected with clear errors.

**Acceptance Criteria**:
- [ ] express-openapi-validator middleware installed
- [ ] Middleware validates: request body, parameters, query strings
- [ ] Invalid requests rejected with 400 + schema error details
- [ ] Valid requests pass through without overhead
- [ ] Response validation optional (not critical for MVP)
- [ ] Error messages include: field name, type, reason for failure

**Definition of Done**: Middleware implemented, validates all endpoints, tests passing

---

### OAI-003: Set Up OpenAPI Documentation UIs (Swagger + ReDoc)
**Priority**: P0 | **Points**: 2 | **Owner**: Amelia (Developer)

**As a** API Consumer,  
**I want to** access interactive API documentation (Swagger UI) and static reference (ReDoc),  
**So that** I can explore and test endpoints without reading docs.

**Acceptance Criteria**:
- [ ] Swagger UI installed at `/api/docs` (interactive, can execute requests)
- [ ] ReDoc installed at `/api/schema` (static, pretty formatting)
- [ ] Both load `/api/openapi.json` schema automatically
- [ ] Swagger "Try it out" works (needs sample credentials)
- [ ] ReDoc renders all endpoints, parameters, responses correctly
- [ ] Pre-flight caching configured (24 hour cache)
- [ ] Browser compatibility: Chrome, Firefox, Safari, Edge all work

**Definition of Done**: Both UIs accessible, requests executable, merged to develop

---

### OAI-004: Create OpenAPI Integration Guide
**Priority**: P0 | **Points**: 1 | **Owner**: Paige (Tech Writer)

**As an** API Consumer,  
**I want to** follow a guide on how to use OpenAPI with Jarvis,  
**So that** I can integrate with Kong, AWS API Gateway, or other platforms.

**Acceptance Criteria**:
- [ ] Guide document created: "OpenAPI Integration Guide"
- [ ] Explains what OpenAPI is and why it matters
- [ ] Getting started section: link to `/api/openapi.json`, import into Postman
- [ ] Swagger UI guide: link to `/api/docs`, screenshots, execute requests
- [ ] ReDoc guide: link to `/api/schema`, when to use vs Swagger
- [ ] Integration examples: Kong API Gateway, AWS API Gateway, Azure API Management
- [ ] Schema customization (advanced): modifying schemas, adding examples
- [ ] Troubleshooting section

**Definition of Done**: Guide published and accessible, examples tested

---

### OAI-QA-001: Test OpenAPI Schema Generation
**Priority**: P0 | **Points**: 1 | **Owner**: Quinn (QA)

**As a** QA Engineer,  
**I want to** verify that OpenAPI schema generation is correct,  
**So that** documentation accurately reflects the API.

**Acceptance Criteria**:
- [ ] Unit tests: Zod → OpenAPI conversion preserves types
- [ ] Unit tests: required fields correctly marked
- [ ] Unit tests: optional fields correctly marked
- [ ] Unit tests: response codes match implementation
- [ ] Integration tests: Swagger UI loads without errors
- [ ] Integration tests: ReDoc renders schema correctly
- [ ] E2E tests: schema validates real requests in browser
- [ ] Coverage: ≥ 95%

**Definition of Done**: 15+ tests passing, no critical bugs, coverage ≥ 95%

---

### Epic 2: Rate Limiting (Redis Token Bucket)
**Team**: Amelia (Dev), Quinn (QA), Paige (Tech Writer)  
**Total Points**: 13 dev + 3 QA = 16 points  
**Timeline**: Days 5-9  
**Prerequisite**: Redis HA infrastructure (Stories REDIS-001 through REDIS-007)  
**Dependency**: `redis-ha-user-stories.md` must be complete

---

### RL-001: Implement Rate Limiting Abstraction Layer
**Priority**: P0 | **Points**: 2 | **Owner**: Amelia (Developer)

**As a** Developer,  
**I want to** create an abstraction layer for rate limiting,  
**So that** we can swap backends (Redis, in-memory, etc.) without changing business logic.

**Acceptance Criteria**:
- [ ] Interface defined: `RateLimiter` with methods (check, increment, reset)
- [ ] Redis implementation: uses ioredis connection pool
- [ ] In-memory fallback: when Redis unavailable
- [ ] Per-customer limits: configurable quotas (e.g., 500 req/min)
- [ ] Per-IP limits: optional DDoS protection
- [ ] Graceful degradation: Redis down → fallback to in-memory (5 min tolerance)
- [ ] Circuit breaker: retry after 5 min if Redis still down
- [ ] Metrics exposed: active limiters, failed connections

**Definition of Done**: Abstract interface defined, Redis + fallback implemented, tests passing

---

### RL-002: Implement Rate Limiting Middleware
**Priority**: P0 | **Points**: 2 | **Owner**: Amelia (Developer)

**As a** Express Server,  
**I want to** apply rate limiting to API endpoints,  
**So that** clients respect the token bucket limits.

**Acceptance Criteria**:
- [ ] express-rate-limit middleware integrated
- [ ] rate-limit-redis backend configured (uses ioredis)
- [ ] Default limits: 500 requests per 60 seconds (per IP)
- [ ] Per-customer limits: override via config (e.g., premium = 1000 req/min)
- [ ] Burst capacity: allow 10% overage (graceful burst)
- [ ] Response headers: X-RateLimit-Remaining, X-RateLimit-Reset-After
- [ ] 429 status when limit exceeded (Retry-After header included)
- [ ] Whitelist: skip rate limiting for healthcheck endpoints

**Definition of Done**: Middleware applied to API, responds with correct headers, tests passing

---

### RL-003: Implement Token Bucket Logic with Lua Atomicity
**Priority**: P0 | **Points**: 3 | **Owner**: Amelia (Developer)

**As a** Rate Limiter,  
**I want to** use token bucket algorithm with atomic Lua scripts,  
**So that** multi-server coordination works correctly without race conditions.

**Acceptance Criteria**:
- [ ] Token bucket algorithm: tokens refill at correct rate
- [ ] Burst capacity: allow up to max tokens in one request
- [ ] Overflow handling: tokens don't accumulate above max
- [ ] Lua script: atomic check-and-decrement operation
- [ ] Distributed locking: prevents race conditions across servers
- [ ] Time precision: handles ±5 second clock skew
- [ ] Timeout handling: expired keys cleaned up automatically
- [ ] Math verified: 500/60 = 8.33 tokens/sec calculated correctly

**Definition of Done**: Token bucket math verified, Lua script tested, atomicity confirmed across 3 servers

---

### RL-004: Implement Multi-Server Rate Limit Coordination
**Priority**: P0 | **Points**: 3 | **Owner**: Amelia (Developer)

**As a** Distributed System,  
**I want to** coordinate rate limits across 3+ server instances,  
**So that** a customer hitting the limit on Server A also respects the limit on Server B.

**Acceptance Criteria**:
- [ ] Redis is single source of truth (all servers read/write to same Redis)
- [ ] Lua script ensures atomic operations (no double-counting)
- [ ] Distributed counters: each customer/IP has one counter in Redis
- [ ] Multi-server test: 3 servers writing to same limit, no conflicts
- [ ] Replication: limit data syncs to Redis replicas (replication lag < 100ms)
- [ ] Failover: if Redis master fails, new master continues enforcing limits
- [ ] Consistency: limit count same across all 3 servers at all times

**Definition of Done**: 3 servers tested, no race conditions under 100 concurrent requests

---

### RL-005: Implement Redis Failover & Graceful Degradation
**Priority**: P0 | **Points**: 3 | **Owner**: Amelia (Developer)

**As a** Rate Limiter,  
**I want to** handle Redis failures gracefully,  
**So that** application continues even if Redis is temporarily unavailable.

**Acceptance Criteria**:
- [ ] Redis connection lost → switch to in-memory store
- [ ] In-memory store: simple counter, expires after 5 minutes
- [ ] Rate limiting still works (some tokens may be lost, acceptable)
- [ ] Redis recovers → switch back to Redis (sync state)
- [ ] Circuit breaker: don't retry Redis for 5 minutes if failing
- [ ] Metrics: track fallback events (alert if > 3/day)
- [ ] No data loss: existing rate limit state preserved during switchover

**Definition of Done**: Failover tested, fallback works, Redis recovery tested

---

### RL-QA-001: Test Rate Limiting Under Concurrency
**Priority**: P0 | **Points**: 2 | **Owner**: Quinn (QA)

**As a** QA Engineer,  
**I want to** verify rate limiting works correctly under concurrent load,  
**So that** we don't accidentally allow double-counting or race conditions.

**Acceptance Criteria**:
- [ ] Unit test: token bucket math (8.33/sec for 500/60)
- [ ] Unit test: tokens refill at correct rate over time
- [ ] Unit test: overflow prevention (can't exceed max)
- [ ] Integration test: Redis operations atomic (Lua script verified)
- [ ] Load test: 100 concurrent requests, limiting works correctly
- [ ] Stress test: 1000 req/sec burst, stable behavior
- [ ] Long-running test: 10 minutes at steady-state, no memory leaks

**Definition of Done**: 20+ tests passing, 90%+ coverage, load tests show predictable behavior

---

### RL-QA-002: Test Redis Failover & Chaos Scenarios
**Priority**: P0 | **Points**: 1 | **Owner**: Quinn (QA)

**As a** QA Engineer,  
**I want to** verify rate limiting behavior during Redis failures,  
**So that** we handle chaos gracefully.

**Acceptance Criteria**:
- [ ] Chaos test: kill Redis master → failover to replica (< 30 sec)
- [ ] Chaos test: rate limiting works during failover (some tolerance acceptable)
- [ ] Chaos test: Redis recovers → sync state correctly
- [ ] Chaos test: clock skew ±10 seconds → predictable behavior
- [ ] Chaos test: multi-server coordination during failover
- [ ] Results documented: baseline vs failover latency, recovery time

**Definition of Done**: Chaos tests pass, failover time verified (< 30 sec), documented

---

### RL-Doc-001: Create Rate Limiting User Guide
**Priority**: P0 | **Points**: 1 | **Owner**: Paige (Tech Writer)

**As a** API Consumer,  
**I want to** understand how rate limiting works and how to handle limits,  
**So that** I can design my integration properly.

**Acceptance Criteria**:
- [ ] Guide: "Understanding Rate Limiting"
- [ ] Concept explanation: token bucket algorithm, tokens per minute
- [ ] Why rate limiting: protect platform stability, fair resource sharing
- [ ] How it works: example "500 requests per minute"
- [ ] Checking limits: response headers (X-RateLimit-*)
- [ ] Handling limits: Retry-After header, exponential backoff strategies
- [ ] Getting more capacity: upgrade tier, request increase, contact sales

**Definition of Done**: Guide published, examples clear, customer can implement correctly

---

### RL-Doc-002: Create Rate Limiting Configuration Guide (Technical)
**Priority**: P0 | **Points**: 1 | **Owner**: Paige (Tech Writer)

**As an** Operator,  
**I want to** configure rate limiting per customer/tier,  
**So that** I can customize limits based on their subscription.

**Acceptance Criteria**:
- [ ] Configuration guide: per-customer limits, per-IP limits, burst capacity
- [ ] Environment variables documented: RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW
- [ ] Configuration file example: JSON/YAML format
- [ ] Testing configuration: verify limits with curl commands
- [ ] Monitoring rate limits: view violation rates, trends
- [ ] Capacity planning: estimate limits needed for customer size

**Definition of Done**: Configuration documented, deployable to staging

---

### Epic 3: CORS + Security Headers
**Team**: Amelia (Dev), Quinn (QA), Paige (Tech Writer)  
**Total Points**: 3 dev + 0.5 QA = 3.5 points  
**Timeline**: Days 3-4  
**Prerequisite**: None (can start immediately)

---

### CORS-001: Implement CORS Middleware
**Priority**: P0 | **Points**: 2 | **Owner**: Amelia (Developer)

**As a** Browser Client,  
**I want to** call Jarvis APIs from web applications,  
**So that** I can build browser-based integrations.

**Acceptance Criteria**:
- [ ] cors package installed
- [ ] Whitelist-based CORS configuration (not wildcard)
- [ ] Environment-driven: different origins for dev/staging/prod
- [ ] Pre-flight caching: 24 hour cache (CORS preflight responses cached)
- [ ] Credentials mode: withCredentials option supported
- [ ] Invalid origins rejected: 403 response (browser enforces)
- [ ] Example: allow `localhost:3000` in dev, `app.example.com` in prod

**Definition of Done**: CORS working for whitelisted origins, preflight cached, merged

---

### CORS-002: Implement Security Headers
**Priority**: P0 | **Points**: 1 | **Owner**: Amelia (Developer)

**As a** Security Team,  
**I want to** all API responses include security headers,  
**So that** we prevent common vulnerabilities.

**Acceptance Criteria**:
- [ ] helmet package installed
- [ ] Content-Security-Policy header: restrict resource loading
- [ ] X-Frame-Options: DENY (prevent clickjacking)
- [ ] X-Content-Type-Options: nosniff (prevent MIME sniffing)
- [ ] Strict-Transport-Security: only HTTPS (production)
- [ ] X-XSS-Protection: 1; mode=block
- [ ] All headers on every response

**Definition of Done**: All security headers present, tests verify headers, merged

---

### CORS-QA-001: Test CORS and Security Headers
**Priority**: P0 | **Points**: 0.5 | **Owner**: Quinn (QA)

**As a** QA Engineer,  
**I want to** verify CORS and security headers work correctly,  
**So that** no security or functionality bugs slip through.

**Acceptance Criteria**:
- [ ] Unit test: CORS whitelist enforced (allowed / denied origins)
- [ ] Unit test: pre-flight request returns correct headers
- [ ] Unit test: security headers present on all responses
- [ ] E2E test: real browser fetch from whitelisted domain works
- [ ] E2E test: real browser fetch from non-whitelisted domain blocked
- [ ] E2E test: pre-flight caching works (304 responses)
- [ ] Coverage: 100%

**Definition of Done**: All tests passing, 100% coverage, no security issues

---

### CORS-Doc-001: Create CORS Configuration Guide
**Priority**: P0 | **Points**: 1 | **Owner**: Paige (Tech Writer)

**As a** Developer,  
**I want to** understand CORS and configure it for my domain,  
**So that** my browser app can call Jarvis.

**Acceptance Criteria**:
- [ ] Guide: "Cross-Origin Requests (CORS) Support"
- [ ] What is CORS: browser security feature explanation
- [ ] Why it matters: prevent unauthorized cross-origin requests
- [ ] Enabling CORS: configuration for whitelisting domain
- [ ] Environment variables: CORS_ORIGINS config
- [ ] Testing locally: CORS_ORIGINS=localhost:3000 in dev
- [ ] Testing in production: CORS_ORIGINS=myapp.example.com
- [ ] Browser compatibility: which browsers support CORS

**Definition of Done**: Guide published, customer can configure their domain

---

### Epic 4: Shell Completion Scripts
**Team**: Amelia (Dev), Quinn (QA)  
**Total Points**: 3 dev + 1.5 QA = 4.5 points  
**Timeline**: Days 4-7  
**Prerequisite**: None (can start immediately, low priority)

---

### SHELL-001: Implement Bash Shell Completion Scripts
**Priority**: P1 | **Points**: 1 | **Owner**: Amelia (Developer)

**As a** Bash User,  
**I want to** use tab completion with the Jarvis CLI,  
**So that** I can discover commands and options quickly.

**Acceptance Criteria**:
- [ ] Bash completion script created: `dist/completions/jarvis.bash`
- [ ] Completion shows all commands: `jarvis <TAB>`
- [ ] Completion shows all options: `jarvis command <TAB>`
- [ ] Completion shows subcommands: `jarvis config <TAB>`
- [ ] Installation: `jarvis --install-completions --shell bash`
- [ ] Sourcing: add to `~/.bashrc` automatically
- [ ] Works in: Bash 4.0+
- [ ] No syntax errors: shellcheck validation

**Definition of Done**: Script generated, tested in real bash, merged

---

### SHELL-002: Implement Zsh Shell Completion Scripts
**Priority**: P1 | **Points**: 1 | **Owner**: Amelia (Developer)

**As a** Zsh User,  
**I want to** use tab completion with the Jarvis CLI,  
**So that** I can discover commands faster.

**Acceptance Criteria**:
- [ ] Zsh completion script created: `dist/completions/jarvis.zsh`
- [ ] Completion shows all commands: `jarvis <TAB>`
- [ ] Completion shows options with descriptions
- [ ] Completion works with oh-my-zsh
- [ ] Installation: `jarvis --install-completions --shell zsh`
- [ ] Sourcing: add to `~/.zshrc` automatically
- [ ] Works in: Zsh 5.0+
- [ ] No syntax errors: shellcheck validation

**Definition of Done**: Script generated, tested in real zsh, merged

---

### SHELL-003: Integrate Shell Completion Installation
**Priority**: P1 | **Points**: 1 | **Owner**: Amelia (Developer)

**As a** User,  
**I want to** install shell completions easily,  
**So that** I don't have to manually source scripts.

**Acceptance Criteria**:
- [ ] Command implemented: `jarvis --install-completions [--shell bash|zsh]`
- [ ] Postinstall hook: npm/brew automatically runs installer
- [ ] User files updated automatically: `~/.bashrc` or `~/.zshrc`
- [ ] Uninstall command: `jarvis --uninstall-completions`
- [ ] Verification: user doesn't need to restart shell (source immediately)
- [ ] Documentation: clear installation instructions

**Definition of Done**: Installation process automated, tested on multiple systems

---

### SHELL-QA-001: Test Shell Completion Scripts
**Priority**: P1 | **Points**: 1.5 | **Owner**: Quinn (QA)

**As a** QA Engineer,  
**I want to** verify shell completion works correctly,  
**So that** users have working tab completion.

**Acceptance Criteria**:
- [ ] Bash 4.0: completion works
- [ ] Bash 5.0: completion works
- [ ] Zsh 5.0: completion works
- [ ] Zsh 5.8: completion works
- [ ] macOS default shell: works
- [ ] Ubuntu default shell: works
- [ ] CentOS default shell: works
- [ ] Installation via npm: works
- [ ] Installation via brew: works
- [ ] Manual source: works
- [ ] Uninstall: cleans up correctly

**Definition of Done**: Manual testing on 3 shells + 3 OSes, all pass

---

### Epic 5: Interactive CLI Help System
**Team**: Amelia (Dev), Quinn (QA), Paige (Tech Writer)  
**Total Points**: 5 dev + 1 QA = 6 points  
**Timeline**: Days 6-9  
**Prerequisite**: None (can start after shell completion or in parallel)

---

### HELP-001: Implement Help System Core
**Priority**: P0 | **Points**: 2 | **Owner**: Amelia (Developer)

**As a** Developer,  
**I want to** build a command registry with help metadata,  
**So that** all CLI commands are discoverable.

**Acceptance Criteria**:
- [ ] CommandRegistry class: register commands with metadata
- [ ] Metadata fields: name, description, examples, aliases, subcommands
- [ ] List all commands: `jarvis help`
- [ ] Get help for command: `jarvis help <command>`
- [ ] Get help for subcommand: `jarvis help config api`
- [ ] Help rendering: formatted output, readable
- [ ] Plugin architecture: new modules can register help
- [ ] Extensible design: add more metadata in future

**Definition of Done**: Registry implemented, all commands registered, tests passing

---

### HELP-002: Implement Help Middleware & Routing
**Priority**: P0 | **Points**: 1.5 | **Owner**: Amelia (Developer)

**As a** CLI User,  
**I want to** access help through standard CLI patterns,  
**So that** help is predictable and intuitive.

**Acceptance Criteria**:
- [ ] `--help` flag intercepted globally
- [ ] Route all help to centralized help system
- [ ] Short help: `jarvis --help` shows summary
- [ ] Long help: `jarvis --help --verbose` shows details
- [ ] Context-aware help: error message includes relevant help
- [ ] Force help: `jarvis help` always works
- [ ] Help for non-existent command: graceful error with suggestion

**Definition of Done**: Middleware implemented, help accessible from CLI, merged

---

### HELP-003: Implement Interactive REPL with Help
**Priority**: P0 | **Points**: 1.5 | **Owner**: Amelia (Developer)

**As a** User,  
**I want to** use an interactive REPL mode to explore Jarvis,  
**So that** I can experiment without running commands repeatedly.

**Acceptance Criteria**:
- [ ] REPL mode: `jarvis repl` enters interactive prompt
- [ ] REPL prompt: clear, shows current context
- [ ] Help in REPL: `help` shows available commands
- [ ] Command execution: `command arg1 arg2` runs command
- [ ] History: arrow keys navigate previous commands
- [ ] Search: `search <term>` finds relevant topics
- [ ] Exit: `exit` or Ctrl+C closes REPL cleanly
- [ ] Multi-line: can compose complex commands

**Definition of Done**: REPL working, commands executable, help accessible, merged

---

### HELP-004: Implement Help Search & Indexing
**Priority**: P0 | **Points**: 1 | **Owner**: Amelia (Developer)

**As a** User,  
**I want to** search help by keyword,  
**So that** I can find relevant commands quickly.

**Acceptance Criteria**:
- [ ] Search implemented: `jarvis search <term>`
- [ ] Searches command names, descriptions, examples
- [ ] Results ranked by relevance
- [ ] Case-insensitive search
- [ ] Partial matching: `jarvis search rate` finds rate-limiting help
- [ ] Example: `jarvis search help` shows help-related commands
- [ ] No matches: graceful message with suggestions

**Definition of Done**: Search working, ranking logical, tests passing

---

### HELP-QA-001: Test Interactive Help System
**Priority**: P0 | **Points**: 1 | **Owner**: Quinn (QA)

**As a** QA Engineer,  
**I want to** verify the help system works correctly,  
**So that** users have working CLI help.

**Acceptance Criteria**:
- [ ] Unit test: command registration and lookup
- [ ] Unit test: help rendering (formatting correct)
- [ ] Unit test: search finds commands by keyword
- [ ] E2E test: `jarvis help` shows all commands
- [ ] E2E test: `jarvis help config` shows help for command
- [ ] E2E test: REPL mode starts and accepts commands
- [ ] E2E test: `search` in REPL finds results
- [ ] E2E test: `exit` closes cleanly
- [ ] Coverage: ≥ 90%

**Definition of Done**: All tests passing, 90%+ coverage, REPL tested manually

---

### HELP-Doc-001: Create Help System User Guide
**Priority**: P0 | **Points**: 1 | **Owner**: Paige (Tech Writer)

**As a** User,  
**I want to** understand how to use the help system,  
**So that** I can discover commands and learn Jarvis.

**Acceptance Criteria**:
- [ ] Guide: "Getting Help in Jarvis"
- [ ] Help command: `jarvis help [command]`
- [ ] Search command: `jarvis search <term>`
- [ ] REPL mode: `jarvis repl` → interactive exploration
- [ ] Command palette: `helpme` shortcut (if available)
- [ ] Examples for each help pattern
- [ ] Tips: search is most powerful for discovery
- [ ] Feedback: link to report help issues

**Definition of Done**: Guide published, examples clear, customer understands discovery

---

## SECTION 3: SUMMARY & TIMELINE

### Story Point Breakdown

| Enhancement | Dev | QA | Tech | Total |
|-------------|:---:|:---:|:---:|:-----:|
| Redis HA | 10 | 0 | 3 | **13** |
| OpenAPI | 8 | 1 | 1 | **10** |
| Rate Limiting | 13 | 3 | 2 | **18** |
| CORS | 3 | 0.5 | 1 | **4.5** |
| Shell Completion | 3 | 1.5 | 0 | **4.5** |
| CLI Help | 5 | 1 | 1 | **7** |
| **TOTAL** | **42** | **7** | **8** | **57** |

**Plus Infrastructure (prerequisite)**: 21 points  
**Grand Total**: 78 story points

---

### Timeline Overview

```
PHASE 0: INFRASTRUCTURE (Feb 12-24)
  Week 1: Redis design + provisioning (REDIS-001, REDIS-002, REDIS-005, REDIS-008)
  Week 2: Redis client + chaos testing (REDIS-003, REDIS-006, REDIS-007)
  └─ Completion: Feb 24 (4-day buffer)

PHASE 1: DEVELOPMENT SPRINT (Feb 24 - Mar 10)
  Week 1 (Days 1-5):
    Day 1-3:  OpenAPI (OAI-001, OAI-002, OAI-003)
    Day 3-4:  CORS (CORS-001, CORS-002)
    Day 4-7:  Shell (SHELL-001, SHELL-002, SHELL-003)
  
  Week 2 (Days 6-14):
    Day 5-9:   Rate Limiting (RL-001 through RL-005)
    Day 6-9:   CLI Help (HELP-001 through HELP-004)
    Day 10-14: Integration + QA + Staging

PHASE 2: STAGING VALIDATION (Mar 10-14)
  Deploy all 5 enhancements to staging
  UAT with customers
  Final bug fixes
  Prepare for production release
```

---

### Story Sequencing (Critical Path)

**Prerequisite Chain**:
```
REDIS-001 (Design)
    ↓
REDIS-002 (Provision)
    ↓
REDIS-003, REDIS-005, REDIS-006 (Config)
    ↓
RL-001 (Rate limiting implementation)
    ↓
RL-004 (Multi-server coordination)
```

**Parallel Tracks** (can start immediately):
- Track A: OpenAPI (Days 1-3)
- Track B: CORS (Days 3-4)
- Track C: Shell Completion (Days 4-7, lower priority)
- Track D: CLI Help (Days 6-9, after shell)

**After Redis Ready**:
- Track E: Rate Limiting (Days 5-9, depends on REDIS-003)

---

### Definition of Sprint Done

**All user stories are complete when**:

1. ✅ Code merged to develop branch
2. ✅ All tests passing (100% pass rate)
3. ✅ Code review approved (1+ reviewer)
4. ✅ No critical or high issues remaining
5. ✅ Tech documentation drafted
6. ✅ Ready for staging deployment

**All enhancements are production-ready when**:

1. ✅ Deployed to staging
2. ✅ All enhancement tests pass
3. ✅ Customer validation/UAT complete
4. ✅ Performance benchmarks met
5. ✅ Tech documentation final
6. ✅ No critical issues
7. ✅ Ready for production release (Mar 14)

---

## APPENDIX: Story Assignment & Owners

| Role | Stories | Total | Start |
|------|---------|:-----:|:------:|
| **Amelia (Dev Lead)** | OAI-001, OAI-002, OAI-003, RL-001 through RL-005, CORS-001, CORS-002, SHELL-001 through SHELL-003, HELP-001 through HELP-004, REDIS-003, REDIS-006 | 42 | Day 1 |
| **Quinn (QA Lead)** | OAI-QA-001, RL-QA-001, RL-QA-002, CORS-QA-001, SHELL-QA-001, HELP-QA-001, REDIS-007 | 7 | Day 1 |
| **Paige (Tech Writer)** | OAI-004, RL-Doc-001, RL-Doc-002, CORS-Doc-001, SHELL completions coverage, HELP-Doc-001, REDIS-008 | 8 | Day 1 |
| **Winston (Architect)** | REDIS-001 (design), Review RL-001-004, Technical decisions | Design only | Day 0 |
| **Infrastructure Lead** | REDIS-002, REDIS-004, REDIS-005, REDIS-007 partner | Infrastructure | Day -7 |

---

## Next Steps

1. **Immediate** (Feb 12):
   - [ ] Distribute this document to team
   - [ ] Assign story owners
   - [ ] Create Jira epics + stories

2. **By Feb 13**:
   - [ ] Get approvals: Winston, John, Bob, Infrastructure Lead
   - [ ] Confirm resource assignments

3. **By Feb 24**:
   - [ ] Complete all Redis HA infrastructure (prerequisite)
   - [ ] Sprint kickoff meeting
   - [ ] Development sprint starts

4. **By Mar 10**:
   - [ ] All 5 enhancements complete
   - [ ] Staging deployment
   - [ ] Customer UAT begins

---

## Success Criteria (Final Go/No-Go)

**By March 10, 2026, the project succeeds if**:

1. ✅ OpenAPI integration working, Swagger UI live
2. ✅ Rate limiting enforcing limits per customer
3. ✅ CORS enabled for browser clients
4. ✅ Shell completion working in Bash + Zsh
5. ✅ CLI help system fully functional (REPL mode included)
6. ✅ All tests passing with 90%+ coverage
7. ✅ No critical bugs on staging
8. ✅ Tech documentation complete
9. ✅ Customer validation successful
10. ✅ Ready for production release (March 14)

---

*Phase 2A Enhancement - Complete User Stories*  
*Created by BMAD Agents: Winston, Amelia, John, Quinn, Paige, Bob*  
*Status: Ready for Sprint Planning*  
*Date: February 12, 2026*
