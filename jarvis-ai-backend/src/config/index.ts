import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  
  redis: {
    sentinels: process.env.REDIS_SENTINELS?.split(',').map(s => {
      const [host, port] = s.trim().split(':');
      return { host, port: parseInt(port) };
    }) || [],
    sentinelName: process.env.REDIS_SENTINEL_NAME || 'mymaster',
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
  },

  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },

  rateLimit: {
    perCustomer: parseInt(process.env.RATE_LIMIT_PER_CUSTOMER || '1000'),
    perIp: parseInt(process.env.RATE_LIMIT_PER_IP || '10000'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  api: {
    version: process.env.API_VERSION || '2.0.0',
    title: process.env.API_TITLE || 'Jarvis AI Backend',
  },
};

export default config;
