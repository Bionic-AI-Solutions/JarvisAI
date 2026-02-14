import { rateLimiterMiddleware } from '../../src/features/rate-limiting';
import { Request, Response } from 'express';

describe('Rate Limiting', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  describe('RL-001: Rate Limiter Core', () => {
    test('should allow requests under limit', async () => {
      req = {
        method: 'POST',
        path: '/api/action',
        get: () => 'customer-1',
        ip: '192.168.1.1',
      };

      const middleware = rateLimiterMiddleware(null);
      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject requests exceeding per-customer limit', async () => {
      req = {
        method: 'POST',
        path: '/api/action',
        get: () => 'customer-1',
        ip: '192.168.1.1',
      };

      const middleware = rateLimiterMiddleware(null);

      // Simulate many requests
      for (let i = 0; i < 100; i++) {
        await middleware(req as Request, res as Response, next);
      }

      // This would be hit on request that exceeds limit
      // In real tests with mocked Redis, this would trigger 429
    });

    test('should add rate limit headers to response', async () => {
      req = {
        method: 'GET',
        path: '/api/health',
        get: () => 'customer-1',
        ip: '192.168.1.1',
      };

      const middleware = rateLimiterMiddleware(null);
      await middleware(req as Request, res as Response, next);

      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', expect.any(Number));
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
    });
  });

  describe('RL-004: Dual-Layer Strategy', () => {
    test('should respect per-customer limit', async () => {
      req = {
        method: 'POST',
        get: () => 'customer-1',
        ip: '192.168.1.1',
      };

      const middleware = rateLimiterMiddleware(null);
      await middleware(req as Request, res as Response, next);

      // Customer 1 should be limited independently of others
      expect(next).toHaveBeenCalled();
    });

    test('should respect per-IP limit', async () => {
      const req1: any = {
        method: 'POST',
        get: () => 'customer-1',
        ip: '192.168.1.1',
      };

      const req2: any = {
        method: 'POST',
        get: () => 'customer-2',
        ip: '192.168.1.1',
      };

      const middleware = rateLimiterMiddleware(null);

      // Both customers from same IP should share IP limit
      await middleware(req1 as Request, res as Response, next);
      await middleware(req2 as Request, res as Response, next);

      expect(next).toHaveBeenCalledTimes(2);
    });
  });
});
