import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { ApiError } from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('health.check', () => {
    it('should fetch health status', async () => {
      const mockHealth = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: 1234,
        version: '2.0.0',
        redis: 'connected',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHealth),
      });

      const result = await api.health.check();
      expect(result).toEqual(mockHealth);
      expect(global.fetch).toHaveBeenCalledWith('/health', expect.any(Object));
    });

    it('should throw ApiError on failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ message: 'Server error' }),
      });

      await expect(api.health.check()).rejects.toThrow(ApiError);
      await expect(api.health.check()).rejects.toThrow();
    });
  });

  describe('ping.send', () => {
    it('should fetch ping response', async () => {
      const mockPing = { message: 'pong', timestamp: new Date().toISOString() };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPing),
      });

      const result = await api.ping.send();
      expect(result).toEqual(mockPing);
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/ping', expect.any(Object));
    });
  });

  describe('docs.getSpec', () => {
    it('should fetch API spec', async () => {
      const mockSpec = { openapi: '3.0.0', info: { title: 'Jarvis AI' } };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSpec),
      });

      const result = await api.docs.getSpec();
      expect(result).toEqual(mockSpec);
    });
  });

  describe('ApiError', () => {
    it('should include status code', () => {
      const error = new ApiError(404, 'Not found');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.name).toBe('ApiError');
    });

    it('should be an instance of Error', () => {
      const error = new ApiError(500, 'Server error');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
