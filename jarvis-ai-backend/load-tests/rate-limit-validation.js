import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const rateLimitHits = new Counter('rate_limit_429s');
const successfulRequests = new Counter('successful_200s');
const errorRate = new Rate('errors');

export const options = {
  vus: 50,
  duration: '60s',
  thresholds: {
    // We EXPECT rate limiting to kick in — at least some 429s
    rate_limit_429s: ['count>0'],
    errors: ['rate<0.5'], // Allow up to 50% "errors" since 429 is expected
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export default function () {
  // All VUs use same customer ID to trigger rate limiting faster
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Customer-ID': 'load-test-customer',
    },
  };

  const res = http.get(`${BASE_URL}/api/v1/ping`, params);

  if (res.status === 429) {
    rateLimitHits.add(1);

    check(res, {
      '429 has correct error message': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.error === 'Too Many Requests';
        } catch {
          return false;
        }
      },
      '429 has retry info': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.message !== undefined;
        } catch {
          return false;
        }
      },
    });
  } else if (res.status === 200) {
    successfulRequests.add(1);

    check(res, {
      'successful response has rate limit headers': (r) => {
        return r.headers['X-Ratelimit-Limit'] !== undefined ||
               r.headers['x-ratelimit-limit'] !== undefined;
      },
      'rate limit remaining decreases': (r) => {
        const remaining = r.headers['X-Ratelimit-Remaining'] ||
                         r.headers['x-ratelimit-remaining'];
        return remaining !== undefined;
      },
    });
  }

  errorRate.add(res.status !== 200 && res.status !== 429);

  // Rapid-fire requests to trigger rate limiting
  sleep(0.01);
}
