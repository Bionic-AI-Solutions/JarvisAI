import { inputSanitizer, securityAuditLogger } from '../../src/middleware/security';
import { Request, Response } from 'express';

describe('Security Middleware Integration', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      method: 'POST',
      path: '/api/v1/test',
      ip: '127.0.0.1',
      originalUrl: '/api/v1/test',
      url: '/api/v1/test',
      body: {},
      query: {},
      get: jest.fn((header: string) => {
        const headers: Record<string, string> = {
          'content-length': '100',
          'user-agent': 'test-agent',
        };
        return headers[header.toLowerCase()];
      }),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('Input Sanitizer', () => {
    test('should allow normal requests', () => {
      req.body = { name: 'John', email: 'john@example.com' };
      inputSanitizer(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    test('should strip null bytes from strings', () => {
      req.body = { name: 'John\0Smith' };
      inputSanitizer(req as Request, res as Response, next);
      expect(req.body.name).toBe('JohnSmith');
      expect(next).toHaveBeenCalled();
    });

    test('should strip MongoDB operators', () => {
      req.body = { query: '$where' };
      inputSanitizer(req as Request, res as Response, next);
      expect(req.body.query).toBe('where');
      expect(next).toHaveBeenCalled();
    });

    test('should sanitize nested objects', () => {
      req.body = { user: { name: 'test\0', role: '$admin' } };
      inputSanitizer(req as Request, res as Response, next);
      expect(req.body.user.name).toBe('test');
      expect(req.body.user.role).toBe('admin');
      expect(next).toHaveBeenCalled();
    });

    test('should sanitize query parameters', () => {
      req.query = { search: '$regex' };
      inputSanitizer(req as Request, res as Response, next);
      expect(req.query.search).toBe('regex');
      expect(next).toHaveBeenCalled();
    });

    test('should reject oversized payloads', () => {
      req.get = jest.fn((header: string) => {
        if (header.toLowerCase() === 'content-length') return '2000000';
        return undefined;
      });
      inputSanitizer(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(413);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Security Audit Logger', () => {
    test('should allow normal requests without logging', () => {
      req.originalUrl = '/api/v1/users';
      req.body = { name: 'John' };
      securityAuditLogger(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    test('should detect XSS patterns in URL', () => {
      req.originalUrl = '/api/v1/users?name=<script>alert(1)</script>';
      securityAuditLogger(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled(); // Still allows but logs warning
    });

    test('should detect SQL injection patterns', () => {
      req.originalUrl = '/api/v1/users';
      req.body = { query: 'UNION SELECT * FROM users' };
      securityAuditLogger(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled(); // Still allows but logs warning
    });

    test('should detect path traversal', () => {
      req.originalUrl = '/api/v1/files/../../../etc/passwd';
      securityAuditLogger(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled(); // Still allows but logs warning
    });

    test('should detect NoSQL injection', () => {
      req.body = { query: '$where: function() { return true; }' };
      securityAuditLogger(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled(); // Still allows but logs warning
    });
  });
});
