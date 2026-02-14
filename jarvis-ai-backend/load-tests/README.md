# Load Testing with k6

## Prerequisites

Install k6: https://k6.io/docs/get-started/installation/

```bash
# Windows (chocolatey)
choco install k6

# macOS
brew install k6

# Docker
docker pull grafana/k6
```

## Running Tests

```bash
# Health endpoint stress test
k6 run load-tests/health-stress.js

# API endpoint load test
k6 run load-tests/api-load.js

# Rate limit validation
k6 run load-tests/rate-limit-validation.js

# Full suite (all tests)
k6 run load-tests/full-suite.js

# With custom options
k6 run --vus 100 --duration 60s load-tests/api-load.js

# Generate HTML report
k6 run --out json=results.json load-tests/full-suite.js
```

## Test Scenarios

| Test | VUs | Duration | Target |
|------|-----|----------|--------|
| Health Stress | 50→200 | 2m | /health endpoint |
| API Load | 10→100 | 3m | /api/v1/ping |
| Rate Limit | 50 | 1m | Validate 429 responses |
| Full Suite | Mixed | 5m | All endpoints |

## Thresholds

- p(95) response time < 500ms
- p(99) response time < 1500ms
- Error rate < 1%
- Throughput > 100 req/s
