/**
 * Sample test data for all features
 *
 * Centralized test data to ensure consistency across unit and integration tests.
 */

// --- Express Request/Response Mocks ---

import { Request, NextFunction } from 'express';

export function createMockRequest(overrides: Partial<Request> & { _headers?: Record<string, string> } = {}): any {
  const { _headers, ...rest } = overrides as any;
  return {
    method: 'GET',
    url: '/api/v1/test',
    path: '/api/v1/test',
    ip: '127.0.0.1',
    headers: {},
    get: jest.fn((header: string) => {
      const headers: Record<string, string> = {
        'X-Customer-ID': 'test-customer-001',
        'Origin': 'http://localhost:3000',
        'x-request-id': 'test-request-id-001',
        ...(_headers || {}),
      };
      return headers[header] || headers[header.toLowerCase()];
    }),
    body: {},
    query: {},
    params: {},
    ...rest,
  };
}

export function createMockResponse(): any {
  const res: any = {
    _headers: {},
    _status: 200,
    _json: null,
    _body: '',
    status: jest.fn(function (this: any, code: number) {
      this._status = code;
      return this;
    }),
    json: jest.fn(function (this: any, obj: any) {
      this._json = obj;
      return this;
    }),
    send: jest.fn(function (this: any, body: string) {
      this._body = body;
      return this;
    }),
    setHeader: jest.fn(function (this: any, name: string, value: string) {
      this._headers[name] = value;
      return this;
    }),
    set: jest.fn(function (this: any, name: string, value: string) {
      this._headers[name] = value;
      return this;
    }),
    end: jest.fn(),
    headersSent: false,
  };
  return res;
}

export function createMockNext(): NextFunction {
  return jest.fn();
}

// --- Rate Limiting Test Data ---

export const rateLimitTestData = {
  validCustomerIds: [
    'customer-001',
    'customer-002',
    'enterprise-client-xyz',
    'free-tier-user-123',
  ],
  validIpAddresses: [
    '192.168.1.100',
    '10.0.0.1',
    '172.16.0.50',
    '::1',
    '::ffff:127.0.0.1',
  ],
  limits: {
    perCustomer: 1000,
    perIp: 10000,
    windowMs: 3600000,  // 1 hour
  },
  scenarios: {
    underLimit: {
      customerCount: 5,
      ipCount: 10,
      expectedAllowed: true,
    },
    atLimit: {
      customerCount: 1000,
      ipCount: 10000,
      expectedAllowed: false,
    },
    overLimit: {
      customerCount: 1001,
      ipCount: 10001,
      expectedAllowed: false,
    },
  },
};

// --- CORS Test Data ---

export const corsTestData = {
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://jarvis-ai.example.com',
  ],
  blockedOrigins: [
    'http://evil-site.com',
    'https://phishing.example.org',
    'http://localhost:9999',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  expectedHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  },
};

// --- OpenAPI Test Data ---

export const openApiTestData = {
  validRequestBodies: {
    createUser: {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    },
    updateUser: {
      name: 'Updated User',
      email: 'updated@example.com',
    },
  },
  invalidRequestBodies: {
    missingRequired: {
      name: 'Test User',
      // missing email
    },
    invalidTypes: {
      name: 12345,
      email: true,
    },
    emptyBody: {},
  },
  expectedOpenApiSpec: {
    openapi: '3.0.0',
    info: {
      title: 'Jarvis AI Backend API',
      version: '2.0.0',
    },
  },
};

// --- CLI Help Test Data ---

export const cliHelpTestData = {
  commands: [
    {
      name: 'create',
      description: 'Create a new resource',
      usage: 'jarvis create <resource-type> [options]',
      options: [
        { flag: '--name <name>', description: 'Resource name' },
        { flag: '--type <type>', description: 'Resource type' },
        { flag: '--dry-run', description: 'Simulate without creating' },
      ],
      examples: [
        'jarvis create project --name "My Project"',
        'jarvis create user --name "John" --type admin',
      ],
    },
    {
      name: 'list',
      description: 'List all resources',
      usage: 'jarvis list [resource-type] [options]',
      options: [
        { flag: '--format <format>', description: 'Output format (json|table)' },
        { flag: '--limit <n>', description: 'Limit results' },
      ],
      examples: [
        'jarvis list projects',
        'jarvis list users --format json --limit 10',
      ],
    },
    {
      name: 'delete',
      description: 'Delete a resource',
      usage: 'jarvis delete <resource-type> <id> [options]',
      options: [
        { flag: '--force', description: 'Skip confirmation' },
      ],
      examples: [
        'jarvis delete project proj-001',
        'jarvis delete user usr-123 --force',
      ],
    },
  ],
  unknownCommand: 'nonexistent-command',
};

// --- Shell Completion Test Data ---

export const shellTestData = {
  expectedBashKeywords: ['_jarvis_completion', 'COMPREPLY', 'compgen', 'complete'],
  expectedZshKeywords: ['#compdef', '_jarvis_commands', '_describe'],
  expectedCommands: ['create', 'delete', 'update', 'list', 'help'],
};

// --- Health Check Test Data ---

export const healthCheckTestData = {
  expectedResponse: {
    status: 'ok',
  },
  endpoint: '/health',
  method: 'GET',
  expectedStatus: 200,
};

// --- Error Test Data ---

export const errorTestData = {
  validationError: {
    field: 'email',
    message: 'Invalid email format',
    statusCode: 400,
  },
  notFoundError: {
    resource: 'User',
    id: 'usr-999',
    statusCode: 404,
  },
  rateLimitError: {
    customerId: 'customer-001',
    statusCode: 429,
    retryAfter: 3600,
  },
  internalError: {
    message: 'Unexpected server error',
    statusCode: 500,
  },
};
