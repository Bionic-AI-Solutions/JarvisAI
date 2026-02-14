import { corsMiddleware } from '../../src/features/cors';
import { Request, Response } from 'express';

describe('CORS Middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    res = {
      header: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('CORS-001: CORS Middleware', () => {
    test('should set correct Allow-Origin header for allowed origins', () => {
      req = {
        method: 'GET',
        get: (header: string) => header === 'origin' ? 'http://localhost:3000' : undefined,
      };

      corsMiddleware(req as Request, res as Response, next);

      expect(res.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000'
      );
      expect(next).toHaveBeenCalled();
    });

    test('should handle OPTIONS preflight request', () => {
      req = {
        method: 'OPTIONS',
        get: jest.fn(),
      };

      corsMiddleware(req as Request, res as Response, next);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('CORS-002: Security Headers', () => {
    test('should set security headers', () => {
      req = {
        method: 'GET',
        get: jest.fn(),
      };

      corsMiddleware(req as Request, res as Response, next);

      expect(res.header).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(res.header).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(res.header).toHaveBeenCalledWith(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      );
    });
  });
});
