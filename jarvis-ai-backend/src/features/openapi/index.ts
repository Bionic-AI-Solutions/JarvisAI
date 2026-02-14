import { Router } from 'express';
import { z } from 'zod';

export const openApiRoutes = Router();

// Placeholder route that will be implemented with actual Swagger UI setup
openApiRoutes.get('/', (_req, res) => {
  res.send('Swagger UI will be configured here');
});

openApiRoutes.get('/openapi.json', (_req, res) => {
  // Placeholder for OpenAPI spec
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Jarvis AI Backend API',
      version: '2.0.0',
    },
    paths: {},
  });
});

export function validateRequest(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    req.validatedBody = result.data;
    next();
  };
}

export function openApiMiddleware(_req: any, _res: any, next: any) {
  // Placeholder for OpenAPI validation middleware
  next();
}
