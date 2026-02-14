import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { logger } from '../utils/logger';

/**
 * Security middleware stack for Jarvis AI Backend
 * Implements OWASP security headers and protections
 */

// Helmet: Sets various HTTP security headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for Swagger UI
      styleSrc: ["'self'", "'unsafe-inline'"],  // Needed for Swagger UI
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow Swagger UI
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
});

// HPP: Protect against HTTP Parameter Pollution
export const hppMiddleware = hpp();

// Input sanitization middleware
export function inputSanitizer(req: Request, _res: Response, next: NextFunction): void {
  // Reject excessively large request bodies
  const contentLength = parseInt(req.get('content-length') || '0');
  if (contentLength > 1048576) { // 1MB limit
    logger.warn('Request body too large', { 
      ip: req.ip, 
      contentLength,
      path: req.path 
    });
    _res.status(413).json({
      error: 'Payload Too Large',
      message: 'Request body must not exceed 1MB',
    });
    return;
  }

  // Sanitize string values in body (prevent NoSQL injection, XSS)
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query as Record<string, any>);
  }

  next();
}

function sanitizeObject(obj: Record<string, any>): void {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      // Remove null bytes
      obj[key] = obj[key].replace(/\0/g, '');
      // Remove MongoDB operators (NoSQL injection prevention)
      if (obj[key].startsWith('$')) {
        obj[key] = obj[key].slice(1);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// Request size limiter for JSON and URL-encoded
export const jsonLimiter = {
  limit: '1mb',
  type: 'application/json',
};

export const urlencodedLimiter = {
  limit: '1mb',
  extended: true,
};

// Security audit logging middleware
export function securityAuditLogger(req: Request, _res: Response, next: NextFunction): void {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /(<script|javascript:|on\w+=)/i,  // XSS attempts
    /(union\s+select|drop\s+table)/i, // SQL injection
    /(\.\.\/)|(\.\.\\)/,              // Path traversal
    /(\$where|\$regex)/i,             // MongoDB injection
  ];

  const url = req.originalUrl || req.url;
  const body = JSON.stringify(req.body || {});

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(body)) {
      logger.warn('Suspicious request detected', {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        pattern: pattern.source,
        userAgent: req.get('user-agent'),
      });
      break;
    }
  }

  next();
}
