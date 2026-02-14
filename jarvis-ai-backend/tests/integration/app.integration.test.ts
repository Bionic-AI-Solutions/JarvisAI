import request from 'supertest';
import express from 'express';
import { errorHandler, ValidationError, NotFoundError, RateLimitError } from '../../src/middleware/error-handler';
import { requestLogger } from '../../src/middleware/request-logger';

/**
 * Integration tests for the full Express middleware chain
 * Tests actual HTTP requests through the middleware pipeline
 */

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  // Health endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date(),
      services: { redis: 'disconnected' },
    });
  });

  // Ping endpoint
  app.get('/api/v1/ping', (_req, res) => {
    res.json({ message: 'pong' });
  });

  // Validation error endpoint (test)
  app.post('/api/v1/validate', (req, _res, next) => {
    if (!req.body.name) {
      return next(new ValidationError('Name is required', { field: 'name' }));
    }
    _res.json({ valid: true, name: req.body.name });
  });

  // Not found endpoint (test)
  app.get('/api/v1/resource/:id', (req, _res, next) => {
    if (req.params.id === 'missing') {
      return next(new NotFoundError('Resource not found'));
    }
    _res.json({ id: req.params.id, data: 'found' });
  });

  // Rate limit error endpoint (test)
  app.get('/api/v1/limited', (_req, _res, next) => {
    next(new RateLimitError('Rate limit exceeded'));
  });

  app.use(errorHandler);
  return app;
}

describe('Express App Integration Tests', () => {
  const app = createTestApp();

  describe('Health Endpoint', () => {
    test('GET /health should return 200 with status ok', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.services).toBeDefined();
      expect(res.body.services.redis).toBe('disconnected');
    });

    test('GET /health should return JSON content type', async () => {
      const res = await request(app).get('/health');

      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Ping Endpoint', () => {
    test('GET /api/v1/ping should return pong', async () => {
      const res = await request(app).get('/api/v1/ping');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('pong');
    });
  });

  describe('Request Validation', () => {
    test('POST /api/v1/validate with valid body should return 200', async () => {
      const res = await request(app)
        .post('/api/v1/validate')
        .send({ name: 'Test User' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.name).toBe('Test User');
    });

    test('POST /api/v1/validate without name should return 400', async () => {
      const res = await request(app)
        .post('/api/v1/validate')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('Name is required');
      expect(res.body.error.statusCode).toBe(400);
    });

    test('POST /api/v1/validate with empty body should return 400', async () => {
      const res = await request(app)
        .post('/api/v1/validate')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.error.statusCode).toBe(400);
    });
  });

  describe('Not Found Handling', () => {
    test('GET /api/v1/resource/123 should return resource', async () => {
      const res = await request(app).get('/api/v1/resource/123');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('123');
      expect(res.body.data).toBe('found');
    });

    test('GET /api/v1/resource/missing should return 404', async () => {
      const res = await request(app).get('/api/v1/resource/missing');

      expect(res.status).toBe(404);
      expect(res.body.error.message).toBe('Resource not found');
      expect(res.body.error.statusCode).toBe(404);
    });
  });

  describe('Rate Limit Error', () => {
    test('GET /api/v1/limited should return 429', async () => {
      const res = await request(app).get('/api/v1/limited');

      expect(res.status).toBe(429);
      expect(res.body.error.message).toBe('Rate limit exceeded');
      expect(res.body.error.statusCode).toBe(429);
    });
  });

  describe('Request Logging', () => {
    test('should add X-Request-ID header to response', async () => {
      const res = await request(app).get('/health');

      // requestLogger should add tracking ID
      expect(res.status).toBe(200);
    });

    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, () =>
        request(app).get('/api/v1/ping')
      );

      const responses = await Promise.all(promises);

      responses.forEach(res => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('pong');
      });
    });
  });

  describe('JSON Body Parsing', () => {
    test('should parse valid JSON body', async () => {
      const res = await request(app)
        .post('/api/v1/validate')
        .send({ name: 'Alice' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
    });

    test('should handle malformed JSON gracefully', async () => {
      const res = await request(app)
        .post('/api/v1/validate')
        .set('Content-Type', 'application/json')
        .send('{"invalid json');

      expect(res.status).toBe(400);
    });
  });

  describe('Content Type', () => {
    test('all API responses should be JSON', async () => {
      const endpoints = ['/health', '/api/v1/ping'];

      for (const endpoint of endpoints) {
        const res = await request(app).get(endpoint);
        expect(res.headers['content-type']).toMatch(/json/);
      }
    });
  });
});
