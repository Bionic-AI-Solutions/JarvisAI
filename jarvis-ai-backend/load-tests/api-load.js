import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiDuration = new Trend('api_duration');
const requestCount = new Counter('total_requests');

export const options = {
  stages: [
    { duration: '20s', target: 10 },   // Warm up
    { duration: '30s', target: 50 },   // Ramp to 50
    { duration: '60s', target: 100 },  // Peak load
    { duration: '30s', target: 50 },   // Scale down
    { duration: '20s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    errors: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
    total_requests: ['count>1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Customer-ID': `customer-${__VU}`,
    },
  };

  // Test ping endpoint
  const pingRes = http.get(`${BASE_URL}/api/v1/ping`, params);
  requestCount.add(1);
  apiDuration.add(pingRes.timings.duration);

  check(pingRes, {
    'ping status is 200': (r) => r.status === 200,
    'ping response is valid': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message === 'pong';
      } catch {
        return false;
      }
    },
    'ping response time < 200ms': (r) => r.timings.duration < 200,
    'has rate limit headers': (r) => {
      return r.headers['X-Ratelimit-Limit'] !== undefined ||
             r.headers['x-ratelimit-limit'] !== undefined;
    },
  });

  // Test health endpoint
  const healthRes = http.get(`${BASE_URL}/health`, params);
  requestCount.add(1);

  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
    'health response time < 300ms': (r) => r.timings.duration < 300,
  });

  // Test API docs endpoint
  const docsRes = http.get(`${BASE_URL}/api-docs`, params);
  requestCount.add(1);

  check(docsRes, {
    'docs status is 200': (r) => r.status === 200,
  });

  errorRate.add(pingRes.status !== 200);
  sleep(0.5);
}
