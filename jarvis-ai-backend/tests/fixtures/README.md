# Test Fixtures and Mocks

This directory contains test helpers and mocks for testing the Jarvis AI backend.

## Fixture Files

- `sample-data.ts` - Sample test data for all features
- `redis.mock.ts` - Mocked Redis client for unit tests
- `server-fixtures.ts` - Express server fixtures for integration tests

## Usage

```typescript
import { createMockRedis } from './redis.mock';
import { sampleSchemas } from './sample-data';

describe('Feature Test', () => {
  let redis: any;

  beforeEach(() => {
    redis = createMockRedis();
  });

  test('example', () => {
    // Use mock and sample data
  });
});
```
