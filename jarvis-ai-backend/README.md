# Jarvis AI Backend - Phase 2A

Enterprise Platform Features: OpenAPI, CORS, Shell Completion, CLI Help, Rate Limiting

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Type check
npm run type-check

# Run tests
npm test

# Start development server
npm run dev
```

## Project Structure

```
src/
├── config/           # Configuration files
├── features/         # Feature modules (5 features)
│   ├── openapi/     # OpenAPI schema generation + validation
│   ├── cors/        # CORS middleware + security headers
│   ├── shell/       # Bash/Zsh shell completion
│   ├── cli-help/    # CLI help system
│   └── rate-limiting/ # Rate limiting with dual-layer strategy
├── middleware/       # Global middleware
├── utils/           # Utility functions
└── types/           # TypeScript type definitions

tests/
├── unit/            # Unit tests
├── integration/     # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data and mocks
```

## Features

### 1. OpenAPI (OAI-001/002/003)
- Auto-generate OpenAPI 3.0 specs from Zod schemas
- Request validation middleware
- Swagger UI + ReDoc endpoints

### 2. CORS (CORS-001/002)
- Configurable CORS middleware
- Security headers (X-Frame-Options, CSP, HSTS)

### 3. Shell Completion (SHELL-001/002/003)
- Bash completion script generation
- Zsh completion support
- Automatic installation

### 4. CLI Help (HELP-001/002/003)
- Dynamic command help system
- Rich formatting (colors, alignment)
- YAML-based help registry

### 5. Rate Limiting (RL-001/002/003/004/005)
- Per-customer limiting (1000 req/hr)
- Per-IP limiting (10,000 req/hr)
- Dual-layer enforcement
- Redis-backed with Lua scripts
- Automatic failover to in-memory

## Configuration

### Rate Limiting
```typescript
// Dual-layer strategy (default)
- Per customer: 1000 requests/hour
- Per IP: 10,000 requests/hour
- Redis-backed (atomic Lua scripts)
- Fallback: In-memory if Redis unavailable
```

### CORS
```typescript
// Configured origins
- http://localhost:3000 (dev)
- https://example.com (prod)
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Run specific feature tests
npm test -- --testNamePattern="OAI"
npm test -- --testNamePattern="CORS"
npm test -- --testNamePattern="SHELL"
```

## Performance

- Rate limit check: < 5ms
- CORS processing: < 1ms
- OpenAPI validation: < 5ms per request
- Shell completion: < 50ms

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t jarvis-ai-backend .
docker run -p 3000:3000 jarvis-ai-backend
```

## Documentation

- [Technical Specifications](../TECH-SPECS-DETAILED.md)
- [API Documentation](./docs/API.md)
- [Rate Limiting Guide](./docs/RATE-LIMITING.md)

## Status

**Phase**: 2A (Enterprise Enhancements)  
**Sprint**: Feb 24 - Mar 13, 2026  
**Confidence**: 89% (locked by party mode)  
**Target Launch**: March 14, 2026

## Team

- **Amelia**: Development
- **Quinn**: QA
- **Paige**: Technical Writing
- **Winston**: Architecture
- **John**: Product Management
