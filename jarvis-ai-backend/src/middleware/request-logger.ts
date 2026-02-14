import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { randomUUID } from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID().substring(0, 8);
  const startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Override res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(data: any) {
    const duration = Date.now() - startTime;
    logger.info('Outgoing response', {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      method: req.method,
      path: req.path,
    });
    return originalJson(data);
  };

  next();
}
