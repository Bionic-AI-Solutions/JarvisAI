import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  details?: Record<string, any>;
}

export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  details: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ValidationError';
    this.details = details || {};
  }
}

export class RateLimitError extends Error implements ApiError {
  statusCode = 429;
  details: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'RateLimitError';
    this.details = details || {};
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  details: Record<string, any>;

  constructor(message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'NotFoundError';
    this.details = details || {};
  }
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Request error', {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    details: err.details,
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
