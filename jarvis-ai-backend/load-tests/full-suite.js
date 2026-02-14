import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');
const totalRequests = new Counter('total_requests');

export const options = {
  scenarios: {
    health_check: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 50,
      exec: 'healthCheck',
    },
    api_traffic: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 30 },
        { duration: '1m', target: 60 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 50 },
        { duration: '30s', target: 0 },
      ],
      exec: 'apiTraffic',
    },
    burst_traffic: {
      executor: 'per-vu-iterations',
      vus: 50,
      iterations: 20,
      startTime: '1m',
      exec: 'burstTraffic',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
    errors: ['rate<0.05'],
    api_latency: ['p(95)<400'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export function healthCheck() {
  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health`);
    totalRequests.add(1);

    check(res, {
      'health: status 200': (r) => r.status === 200,
      'health: response ok': (r) => {
        try { return JSON.parse(r.body).status === 'ok'; } catch { return false; }
      },
    });

    errorRate.add(res.status !== 200);
    apiLatency.add(res.timings.duration);
  });
}

export function apiTraffic() {
  const params = {
    headers: {
      'X-Customer-ID': `customer-${__VU}`,
      'Content-Type': 'application/json',
    },
  };

  group('API Ping', () => {
    const res = http.get(`${BASE_URL}/api/v1/ping`, params);
    totalRequests.add(1);

    check(res, {
      'ping: status 200 or 429': (r) => r.status === 200 || r.status === 429,
      'ping: valid response': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.message === 'pong' || body.error === 'Too Many Requests';
        } catch { return false; }
      },
    });

    errorRate.add(res.status !== 200 && res.status !== 429);
    apiLatency.add(res.timings.duration);
  });

  group('API Docs', () => {
    const res = http.get(`${BASE_URL}/api-docs`, params);
    totalRequests.add(1);

    check(res, {
      'docs: status 200': (r) => r.status === 200,
    });

    errorRate.add(res.status !== 200);
  });

  sleep(0.5);
}

export function burstTraffic() {
  const params = {
    headers: {
      'X-Customer-ID': `burst-customer-${__VU}`,
    },
  };

  // Rapid-fire burst
  for (let i = 0; i < 5; i++) {
    const res = http.get(`${BASE_URL}/api/v1/ping`, params);
    totalRequests.add(1);

    check(res, {
      'burst: got response': (r) => r.status === 200 || r.status === 429,
    });

    errorRate.add(res.status !== 200 && res.status !== 429);
    apiLatency.add(res.timings.duration);
  }

  sleep(0.1);
}
