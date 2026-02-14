import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get('origin');
  const allowedOrigins = config.cors.allowedOrigins;

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else if (allowedOrigins.includes('*')) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  // CORS headers
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Customer-ID');
  
  // Security headers - CORS-002
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
}
