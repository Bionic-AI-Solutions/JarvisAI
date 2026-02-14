import { openApiRoutes, validateRequest, openApiMiddleware } from '../../src/features/openapi';
import { createMockRequest, createMockResponse, createMockNext, openApiTestData } from '../fixtures/sample-data';
import { z } from 'zod';

describe('OpenAPI Feature', () => {
  describe('openApiRoutes', () => {
    it('should have routes registered', () => {
      expect(openApiRoutes).toBeDefined();
      expect(openApiRoutes.stack).toBeDefined();
    });
  });

  describe('validateRequest', () => {
    const testSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });

    it('should pass valid request body through', () => {
      const middleware = validateRequest(testSchema);
      const req = createMockRequest({
        body: openApiTestData.validRequestBodies.createUser,
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request with missing required fields', () => {
      const middleware = validateRequest(testSchema);
      const req = createMockRequest({
        body: openApiTestData.invalidRequestBodies.missingRequired,
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      const response = (res.json as jest.Mock).mock.calls[0][0];
      expect(response.error).toBe('Validation failed');
      expect(response.details).toBeDefined();
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid types', () => {
      const middleware = validateRequest(testSchema);
      const req = createMockRequest({
        body: openApiTestData.invalidRequestBodies.invalidTypes,
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject empty body', () => {
      const middleware = validateRequest(testSchema);
      const req = createMockRequest({
        body: openApiTestData.invalidRequestBodies.emptyBody,
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should set validatedBody on successful validation', () => {
      const middleware = validateRequest(testSchema);
      const validBody = { name: 'Test', email: 'test@example.com' };
      const req = createMockRequest({ body: validBody }) as any;
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req, res, next);

      expect(req.validatedBody).toEqual(validBody);
      expect(next).toHaveBeenCalled();
    });

    it('should include path info in validation error details', () => {
      const middleware = validateRequest(testSchema);
      const req = createMockRequest({
        body: { name: '', email: 'not-an-email' },
      });
      const res = createMockResponse();
      const next = createMockNext();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      const response = (res.json as jest.Mock).mock.calls[0][0];
      expect(response.details).toBeInstanceOf(Array);
      expect(response.details.length).toBeGreaterThan(0);
      response.details.forEach((detail: any) => {
        expect(detail).toHaveProperty('path');
        expect(detail).toHaveProperty('message');
      });
    });
  });

  describe('openApiMiddleware', () => {
    it('should call next (passthrough)', () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const next = createMockNext();

      openApiMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
