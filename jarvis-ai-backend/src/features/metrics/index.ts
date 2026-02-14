import { Request, Response, NextFunction, Router } from 'express';
import { logger } from '../../utils/logger';

/**
 * Application metrics collection and /api/v1/metrics endpoint
 * Tracks: request counts, response times, error rates, memory usage
 */

interface RequestMetric {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: number;
}

class MetricsCollector {
  private requestMetrics: RequestMetric[] = [];
  private readonly maxHistory = 10000;
  private startTime = Date.now();

  recordRequest(metric: RequestMetric): void {
    this.requestMetrics.push(metric);
    if (this.requestMetrics.length > this.maxHistory) {
      this.requestMetrics = this.requestMetrics.slice(-this.maxHistory);
    }
  }

  getMetrics() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const fiveMinutesAgo = now - 300000;

    const recentRequests = this.requestMetrics.filter(m => m.timestamp > oneMinuteAgo);
    const last5MinRequests = this.requestMetrics.filter(m => m.timestamp > fiveMinutesAgo);

    const durations = recentRequests.map(m => m.duration).sort((a, b) => a - b);
    const p50 = this.percentile(durations, 50);
    const p95 = this.percentile(durations, 95);
    const p99 = this.percentile(durations, 99);

    const errorCount = recentRequests.filter(m => m.statusCode >= 400).length;
    const successCount = recentRequests.filter(m => m.statusCode < 400).length;

    // Status code distribution
    const statusCodes: Record<string, number> = {};
    for (const m of recentRequests) {
      const group = `${Math.floor(m.statusCode / 100)}xx`;
      statusCodes[group] = (statusCodes[group] || 0) + 1;
    }

    // Top endpoints by request count
    const endpointCounts: Record<string, number> = {};
    for (const m of last5MinRequests) {
      const key = `${m.method} ${m.path}`;
      endpointCounts[key] = (endpointCounts[key] || 0) + 1;
    }
    const topEndpoints = Object.entries(endpointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    // Memory usage
    const memUsage = process.memoryUsage();

    return {
      uptime: {
        seconds: Math.floor((now - this.startTime) / 1000),
        human: this.formatUptime(now - this.startTime),
      },
      requests: {
        total: this.requestMetrics.length,
        lastMinute: recentRequests.length,
        last5Minutes: last5MinRequests.length,
        ratePerSecond: parseFloat((recentRequests.length / 60).toFixed(2)),
      },
      latency: {
        p50: parseFloat(p50.toFixed(2)),
        p95: parseFloat(p95.toFixed(2)),
        p99: parseFloat(p99.toFixed(2)),
        avg: parseFloat((durations.reduce((a, b) => a + b, 0) / (durations.length || 1)).toFixed(2)),
      },
      errors: {
        count: errorCount,
        rate: parseFloat(((errorCount / (recentRequests.length || 1)) * 100).toFixed(2)),
      },
      success: {
        count: successCount,
        rate: parseFloat(((successCount / (recentRequests.length || 1)) * 100).toFixed(2)),
      },
      statusCodes,
      topEndpoints,
      memory: {
        rss: this.formatBytes(memUsage.rss),
        heapTotal: this.formatBytes(memUsage.heapTotal),
        heapUsed: this.formatBytes(memUsage.heapUsed),
        external: this.formatBytes(memUsage.external),
        rssBytes: memUsage.rss,
        heapUsedBytes: memUsage.heapUsed,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        cpuUsage: process.cpuUsage(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit++;
    }
    return `${value.toFixed(2)} ${units[unit]}`;
  }
}

// Singleton instance
export const metricsCollector = new MetricsCollector();

// Middleware to record request metrics
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Use 'finish' event to capture after response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route?.path || req.path;

    // Don't record metrics endpoint itself to avoid feedback loop
    if (path === '/api/v1/metrics') return;

    metricsCollector.recordRequest({
      method: req.method,
      path,
      statusCode: res.statusCode,
      duration,
      timestamp: Date.now(),
    });
  });

  next();
}

// Router for metrics endpoint
export const metricsRouter = Router();

metricsRouter.get('/metrics', (_req: Request, res: Response) => {
  try {
    const metrics = metricsCollector.getMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Failed to collect metrics', { error });
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});
