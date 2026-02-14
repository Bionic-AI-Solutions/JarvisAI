# API Testing Guide

How to test Jarvis AI Backend endpoints locally and in CI.

---

## Quick Test Commands

```bash
# Health check
curl http://localhost:3000/health

# Ping endpoint
curl http://localhost:3000/api/v1/ping

# OpenAPI spec
curl http://localhost:3000/api-docs/openapi.json

# With headers
curl -H "X-Customer-ID: test-user" http://localhost:3000/api/v1/ping

# POST with JSON body
curl -X POST -H "Content-Type: application/json" \
  -d '{"key": "value"}' \
  http://localhost:3000/api/v1/ping
```

---

## Testing Each Feature

### 1. Health Check
```bash
curl -s http://localhost:3000/health | jq .
```
**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-24T10:00:00.000Z",
  "services": {
    "redis": "connected"
  }
}
```

---

### 2. CORS (CORS-001/002)

#### Test Allowed Origin
```bash
curl -v -H "Origin: http://localhost:3000" http://localhost:3000/health 2>&1 | grep -i "access-control"
```
**Expected:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
Access-Control-Allow-Headers: Content-Type,Authorization,X-Customer-ID
```

#### Test Blocked Origin
```bash
curl -v -H "Origin: http://evil-site.com" http://localhost:3000/health 2>&1 | grep -i "access-control-allow-origin"
```
**Expected:** No `Access-Control-Allow-Origin` header in response.

#### Test Preflight (OPTIONS)
```bash
curl -v -X OPTIONS http://localhost:3000/api/v1/ping 2>&1 | grep "< HTTP"
```
**Expected:** `HTTP/1.1 204 No Content`

#### Test Security Headers (CORS-002)
```bash
curl -I http://localhost:3000/health
```
**Expected headers present:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

---

### 3. Rate Limiting (RL-001 through RL-005)

#### Test Rate Limit Headers
```bash
curl -i -H "X-Customer-ID: test" http://localhost:3000/api/v1/ping 2>&1 | grep "X-RateLimit"
```
**Expected:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1740000000
```

#### Test Rate Limit Enforcement (Stress Test)
```bash
# Send 100 rapid requests (PowerShell)
1..100 | ForEach-Object {
  $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/ping" -Headers @{"X-Customer-ID"="stress-test"} -UseBasicParsing
  Write-Host "Request $_`: Status $($response.StatusCode)"
}

# Send 100 rapid requests (Bash)
for i in $(seq 1 100); do
  status=$(curl -s -o /dev/null -w "%{http_code}" -H "X-Customer-ID: stress-test" http://localhost:3000/api/v1/ping)
  echo "Request $i: $status"
done
```

#### Test 429 Response
```bash
# After exceeding limit, expect:
curl -s -H "X-Customer-ID: exceeded" http://localhost:3000/api/v1/ping | jq .
```
**Expected (when limit exceeded):**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later."
}
```

#### Test Per-IP Rate Limiting
```bash
# Requests without X-Customer-ID use IP-based limiting
curl -i http://localhost:3000/api/v1/ping 2>&1 | grep "X-RateLimit"
```

#### Test In-Memory Fallback
```bash
# Stop Redis
docker compose stop redis-master

# Request should still work (in-memory fallback)
curl -s http://localhost:3000/health | jq .
# Redis should show "disconnected"

# Rate limiting still works via in-memory
curl -H "X-Customer-ID: fallback-test" http://localhost:3000/api/v1/ping

# Restart Redis
docker compose start redis-master
```

---

### 4. OpenAPI (OAI-001/002/003)

#### Get OpenAPI Spec
```bash
curl -s http://localhost:3000/api-docs/openapi.json | jq .
```
**Expected:**
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Jarvis AI Backend API",
    "version": "2.0.0"
  },
  "paths": {}
}
```

#### Access Swagger UI
```
Open in browser: http://localhost:3000/api-docs/
```

#### Test Request Validation
```bash
# Valid request (should pass)
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 42}' \
  http://localhost:3000/api/v1/resource

# Invalid request (should fail with 400)
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name": "", "value": -1}' \
  http://localhost:3000/api/v1/resource | jq .
```
**Expected (invalid):**
```json
{
  "error": "Validation failed",
  "details": [
    { "path": "name", "message": "String must contain at least 1 character(s)" },
    { "path": "value", "message": "Number must be greater than 0" }
  ]
}
```

---

### 5. Error Handling

#### Test 404
```bash
curl -s http://localhost:3000/nonexistent | jq .
```
**Expected:**
```json
{
  "error": "Not Found",
  "message": "Route not found",
  "statusCode": 404
}
```

#### Test 500 (Server Error)
```
Internal server errors are logged but return generic message.
Check logs/error.log for details.
```

---

## Automated Testing with Jest

### Run All Tests
```bash
npm test
```

### Run Specific Feature Tests
```bash
# CORS tests only
npm test -- --testPathPattern="cors"

# Rate limiting tests only
npm test -- --testPathPattern="rate-limit"

# OpenAPI tests only
npm test -- --testPathPattern="openapi"
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Watch Mode (TDD)
```bash
npm test -- --watch
```

---

## Testing with Supertest (E2E)

```typescript
// tests/e2e/health.e2e.test.ts
import request from 'supertest';
import app from '../../src/index';

describe('Health Endpoint', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.services).toBeDefined();
  });
});

describe('CORS', () => {
  test('allows whitelisted origin', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:3000')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  test('preflight returns 204', async () => {
    await request(app)
      .options('/api/v1/ping')
      .expect(204);
  });
});

describe('Rate Limiting', () => {
  test('includes rate limit headers', async () => {
    const response = await request(app)
      .get('/api/v1/ping')
      .set('X-Customer-ID', 'e2e-test');

    expect(response.headers['x-ratelimit-limit']).toBeDefined();
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    expect(response.headers['x-ratelimit-reset']).toBeDefined();
  });
});
```

---

## PowerShell Test Scripts

### Full API Test Suite
```powershell
# Save as scripts/test-api.ps1
$baseUrl = "http://localhost:3000"
$passed = 0
$failed = 0

function Test-Endpoint {
    param($Name, $Method, $Url, $ExpectedStatus, $Headers)
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        if ($Headers) { $params.Headers = $Headers }
        
        $response = Invoke-WebRequest @params
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "  PASS: $Name (HTTP $($response.StatusCode))" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host "  FAIL: $Name (Expected $ExpectedStatus, got $($response.StatusCode))" -ForegroundColor Red
            $script:failed++
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  PASS: $Name (HTTP $statusCode)" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host "  FAIL: $Name - $($_.Exception.Message)" -ForegroundColor Red
            $script:failed++
        }
    }
}

Write-Host "`nJarvis AI Backend - API Test Suite" -ForegroundColor Cyan
Write-Host "=" * 50

Write-Host "`nHealth & Core:" -ForegroundColor Yellow
Test-Endpoint "Health Check" "GET" "$baseUrl/health" 200
Test-Endpoint "Ping" "GET" "$baseUrl/api/v1/ping" 200
Test-Endpoint "404 Not Found" "GET" "$baseUrl/nonexistent" 404

Write-Host "`nCORS:" -ForegroundColor Yellow
Test-Endpoint "OPTIONS Preflight" "OPTIONS" "$baseUrl/api/v1/ping" 204
Test-Endpoint "Allowed Origin" "GET" "$baseUrl/health" 200 @{"Origin"="http://localhost:3000"}

Write-Host "`nOpenAPI:" -ForegroundColor Yellow
Test-Endpoint "OpenAPI Spec" "GET" "$baseUrl/api-docs/openapi.json" 200
Test-Endpoint "Swagger UI" "GET" "$baseUrl/api-docs/" 200

Write-Host "`nRate Limiting:" -ForegroundColor Yellow
Test-Endpoint "With Customer ID" "GET" "$baseUrl/api/v1/ping" 200 @{"X-Customer-ID"="test"}

Write-Host "`n" + "=" * 50
Write-Host "Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) {"Green"} else {"Red"})
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Jarvis AI Backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000" }
  ],
  "item": [
    {
      "name": "Health",
      "item": [
        { "name": "Health Check", "request": { "method": "GET", "url": "{{baseUrl}}/health" } },
        { "name": "Ping", "request": { "method": "GET", "url": "{{baseUrl}}/api/v1/ping" } }
      ]
    },
    {
      "name": "CORS",
      "item": [
        { "name": "Preflight", "request": { "method": "OPTIONS", "url": "{{baseUrl}}/api/v1/ping" } },
        { "name": "With Origin", "request": { "method": "GET", "url": "{{baseUrl}}/health", "header": [{ "key": "Origin", "value": "http://localhost:3000" }] } }
      ]
    },
    {
      "name": "OpenAPI",
      "item": [
        { "name": "Get Spec", "request": { "method": "GET", "url": "{{baseUrl}}/api-docs/openapi.json" } },
        { "name": "Swagger UI", "request": { "method": "GET", "url": "{{baseUrl}}/api-docs/" } }
      ]
    },
    {
      "name": "Rate Limiting",
      "item": [
        { "name": "With Customer", "request": { "method": "GET", "url": "{{baseUrl}}/api/v1/ping", "header": [{ "key": "X-Customer-ID", "value": "postman-test" }] } }
      ]
    }
  ]
}
```

---

**Last Updated**: February 14, 2026
