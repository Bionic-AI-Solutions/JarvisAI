import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createRedisClient } from './utils/redis-client';
import { logger } from './utils/logger';
import { corsMiddleware } from './features/cors';
import { openApiMiddleware, openApiRoutes } from './features/openapi';
import { rateLimiterMiddleware } from './features/rate-limiting';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { helmetMiddleware, hppMiddleware, inputSanitizer, securityAuditLogger } from './middleware/security';
import { metricsMiddleware, metricsRouter } from './features/metrics';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis connection
let redis: any = null;
try {
  redis = createRedisClient({
    sentinels: process.env.REDIS_SENTINELS?.split(',').map(s => {
      const [host, port] = s.trim().split(':');
      return { host, port: parseInt(port) };
    }) || [],
    sentinelName: process.env.REDIS_SENTINEL_NAME || 'mymaster',
    password: process.env.REDIS_PASSWORD,
  });
  logger.info('Redis connection initialized');
} catch (error) {
  logger.warn('Redis connection failed, rate limiting will use in-memory fallback', { error });
}

// Security middleware (first in chain)
app.use(helmetMiddleware);
app.use(hppMiddleware);

// Global middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(inputSanitizer);
app.use(securityAuditLogger);
app.use(metricsMiddleware);
app.use(requestLogger);

// Feature middleware (ordered by dependency)
app.use(corsMiddleware); // CORS-001/002
app.use(rateLimiterMiddleware(redis)); // RL-001+ features
app.use(openApiMiddleware); // OAI-001/002

// API routes
app.use('/api-docs', openApiRoutes); // OAI-003 (Swagger UI)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    services: {
      redis: redis ? 'connected' : 'disconnected',
    }
  });
});

// API v1 routes (placeholder for actual API endpoints)
app.get('/api/v1/ping', (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

// Metrics endpoint
app.use('/api/v1', metricsRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
