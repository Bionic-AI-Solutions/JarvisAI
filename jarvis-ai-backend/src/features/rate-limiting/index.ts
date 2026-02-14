import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { config } from '../../config';

const inmemoryStore = new Map<string, { count: number; expires: number }>();

export function rateLimiterMiddleware(redisClient: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.get('X-Customer-ID') || 'anonymous';
      const ipAddress = req.ip || 'unknown';

      const isLimited = await checkRateLimit(redisClient, customerId, ipAddress);

      if (isLimited) {
        logger.warn('Rate limit exceeded', { customerId, ipAddress });
        res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
        });
        return;
      }

      res.setHeader('X-RateLimit-Limit', config.rateLimit.perCustomer);
      res.setHeader('X-RateLimit-Remaining', config.rateLimit.perCustomer - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + 3600);

      next();
    } catch (error) {
      logger.error('Rate limiting error', { error });
      next(); // Allow request if rate limiting fails
    }
  };
}

async function checkRateLimit(
  redisClient: any,
  customerId: string,
  ipAddress: string
): Promise<boolean> {
  if (!redisClient) {
    return checkRateLimitInMemory(customerId, ipAddress);
  }

  try {
    const customerKey = `rl:customer:${customerId}`;
    const ipKey = `rl:ip:${ipAddress}`;

    const customerCount = await redisClient.get(customerKey);
    const ipCount = await redisClient.get(ipKey);

    if (
      (customerCount && parseInt(customerCount) >= config.rateLimit.perCustomer) ||
      (ipCount && parseInt(ipCount) >= config.rateLimit.perIp)
    ) {
      return true;
    }

    // Increment counters
    await redisClient.incr(customerKey);
    await redisClient.expire(customerKey, config.rateLimit.windowMs / 1000);
    await redisClient.incr(ipKey);
    await redisClient.expire(ipKey, config.rateLimit.windowMs / 1000);

    return false;
  } catch (error) {
    logger.warn('Redis rate limit check failed, falling back to in-memory', { error });
    return checkRateLimitInMemory(customerId, ipAddress);
  }
}

function checkRateLimitInMemory(customerId: string, ipAddress: string): boolean {
  const now = Date.now();
  const customerKey = `mem:customer:${customerId}`;
  const ipKey = `mem:ip:${ipAddress}`;

  const customerEntry = inmemoryStore.get(customerKey);
  if (customerEntry) {
    if (now > customerEntry.expires) {
      inmemoryStore.delete(customerKey);
    } else if (customerEntry.count >= config.rateLimit.perCustomer) {
      return true;
    }
  }

  const ipEntry = inmemoryStore.get(ipKey);
  if (ipEntry) {
    if (now > ipEntry.expires) {
      inmemoryStore.delete(ipKey);
    } else if (ipEntry.count >= config.rateLimit.perIp) {
      return true;
    }
  }

  // Increment in-memory counters
  if (customerEntry) {
    customerEntry.count++;
  } else {
    inmemoryStore.set(customerKey, { count: 1, expires: now + config.rateLimit.windowMs });
  }

  if (ipEntry) {
    ipEntry.count++;
  } else {
    inmemoryStore.set(ipKey, { count: 1, expires: now + config.rateLimit.windowMs });
  }

  return false;
}
