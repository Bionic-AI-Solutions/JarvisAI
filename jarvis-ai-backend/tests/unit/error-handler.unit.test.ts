import {
  ValidationError,
  NotFoundError,
  RateLimitError,
  errorHandler,
} from '../../src/middleware/error-handler';
import { createMockRequest, createMockResponse, createMockNext, errorTestData } from '../fixtures/sample-data';

describe('Error Handler Middleware', () => {
  describe('Custom Error Classes', () => {
    describe('ValidationError', () => {
      it('should create error with status 400', () => {
        const err = new ValidationError(errorTestData.validationError.message);
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(ValidationError);
        expect(err.message).toBe(errorTestData.validationError.message);
        expect(err.statusCode).toBe(400);
      });

      it('should have correct name', () => {
        const err = new ValidationError('test');
        expect(err.name).toBe('ValidationError');
      });
    });

    describe('NotFoundError', () => {
      it('should create error with status 404', () => {
        const message = `${errorTestData.notFoundError.resource} ${errorTestData.notFoundError.id} not found`;
        const err = new NotFoundError(message);
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(NotFoundError);
        expect(err.statusCode).toBe(404);
      });

      it('should have correct name', () => {
        const err = new NotFoundError('test');
        expect(err.name).toBe('NotFoundError');
      });
    });

    describe('RateLimitError', () => {
      it('should create error with status 429', () => {
        const err = new RateLimitError('Too many requests');
        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(RateLimitError);
        expect(err.statusCode).toBe(429);
      });

      it('should have correct name', () => {
        const err = new RateLimitError('test');
        expect(err.name).toBe('RateLimitError');
      });
    });
  });

  describe('Error Handler Function', () => {
    it('should return 400 for ValidationError', () => {
      const err = new ValidationError('Invalid input');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 for NotFoundError', () => {
      const err = new NotFoundError('Resource not found');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 429 for RateLimitError', () => {
      const err = new RateLimitError('Rate limit exceeded');
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(429);
    });

    it('should return 500 for generic Error', () => {
      const err = new Error('Something went wrong') as any;
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
