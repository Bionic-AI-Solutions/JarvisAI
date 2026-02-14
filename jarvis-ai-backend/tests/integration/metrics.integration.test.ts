import { metricsCollector, metricsMiddleware } from '../../src/features/metrics';
import { Request, Response } from 'express';
import { EventEmitter } from 'events';

describe('Metrics Feature Integration', () => {
  beforeEach(() => {
    // Reset metrics by creating fresh collector reference
    // (In production, the singleton persists across requests)
  });

  describe('MetricsCollector', () => {
    test('should collect request metrics', () => {
      metricsCollector.recordRequest({
        method: 'GET',
        path: '/api/v1/ping',
        statusCode: 200,
        duration: 15,
        timestamp: Date.now(),
      });

      const metrics = metricsCollector.getMetrics();
      expect(metrics.requests.total).toBeGreaterThan(0);
    });

    test('should calculate latency percentiles', () => {
      // Record multiple requests with different durations
      for (let i = 1; i <= 100; i++) {
        metricsCollector.recordRequest({
          method: 'GET',
          path: '/api/v1/test',
          statusCode: 200,
          duration: i * 2,
          timestamp: Date.now(),
        });
      }

      const metrics = metricsCollector.getMetrics();
      expect(metrics.latency.p50).toBeGreaterThan(0);
      expect(metrics.latency.p95).toBeGreaterThan(metrics.latency.p50);
      expect(metrics.latency.p99).toBeGreaterThanOrEqual(metrics.latency.p95);
    });

    test('should track error rates', () => {
      metricsCollector.recordRequest({
        method: 'GET',
        path: '/api/v1/fail',
        statusCode: 500,
        duration: 100,
        timestamp: Date.now(),
      });

      const metrics = metricsCollector.getMetrics();
      expect(metrics.errors.count).toBeGreaterThan(0);
    });

    test('should report memory usage', () => {
      const metrics = metricsCollector.getMetrics();
      expect(metrics.memory.rss).toBeDefined();
      expect(metrics.memory.heapUsed).toBeDefined();
      expect(metrics.memory.heapTotal).toBeDefined();
      expect(metrics.memory.rssBytes).toBeGreaterThan(0);
    });

    test('should report system info', () => {
      const metrics = metricsCollector.getMetrics();
      expect(metrics.system.nodeVersion).toMatch(/^v\d+/);
      expect(metrics.system.platform).toBeDefined();
      expect(metrics.system.pid).toBeGreaterThan(0);
    });

    test('should track top endpoints', () => {
      for (let i = 0; i < 10; i++) {
        metricsCollector.recordRequest({
          method: 'GET',
          path: '/api/v1/popular',
          statusCode: 200,
          duration: 10,
          timestamp: Date.now(),
        });
      }

      const metrics = metricsCollector.getMetrics();
      expect(metrics.topEndpoints.length).toBeGreaterThan(0);
    });

    test('should report uptime', () => {
      const metrics = metricsCollector.getMetrics();
      expect(metrics.uptime.seconds).toBeGreaterThanOrEqual(0);
      expect(metrics.uptime.human).toMatch(/\d+s/);
    });

    test('should include status code distribution', () => {
      const metrics = metricsCollector.getMetrics();
      expect(metrics.statusCodes).toBeDefined();
      expect(typeof metrics.statusCodes).toBe('object');
    });
  });

  describe('metricsMiddleware', () => {
    test('should call next()', () => {
      const req = { method: 'GET', path: '/test', route: { path: '/test' } } as any;
      const res = new EventEmitter() as any;
      res.statusCode = 200;
      const next = jest.fn();

      metricsMiddleware(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    test('should record metrics on response finish', () => {
      const req = { method: 'GET', path: '/test', route: { path: '/test' } } as any;
      const res = new EventEmitter() as any;
      res.statusCode = 200;
      const next = jest.fn();

      const beforeCount = metricsCollector.getMetrics().requests.total;

      metricsMiddleware(req as Request, res as Response, next);
      res.emit('finish');

      const afterCount = metricsCollector.getMetrics().requests.total;
      expect(afterCount).toBeGreaterThan(beforeCount);
    });
  });
});
