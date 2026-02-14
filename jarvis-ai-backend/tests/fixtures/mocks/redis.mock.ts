/**
 * Redis Client Mock for Unit Tests
 *
 * Provides a fully mocked Redis client that simulates
 * ioredis behavior without requiring a real Redis connection.
 */

type RedisValue = string | number | null;
type EventCallback = (...args: any[]) => void;

export class MockRedisClient {
  private store: Map<string, string> = new Map();
  private ttls: Map<string, number> = new Map();
  private events: Map<string, EventCallback[]> = new Map();
  public connected: boolean = true;
  public status: string = 'ready';

  // --- Key/Value Operations ---

  async get(key: string): Promise<string | null> {
    this.checkConnection();
    const ttl = this.ttls.get(key);
    if (ttl && Date.now() > ttl) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: string | number, ...args: any[]): Promise<'OK'> {
    this.checkConnection();
    this.store.set(key, String(value));

    // Handle EX/PX arguments
    for (let i = 0; i < args.length; i++) {
      if (args[i] === 'EX' && args[i + 1]) {
        this.ttls.set(key, Date.now() + Number(args[i + 1]) * 1000);
      } else if (args[i] === 'PX' && args[i + 1]) {
        this.ttls.set(key, Date.now() + Number(args[i + 1]));
      }
    }

    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    this.checkConnection();
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        this.ttls.delete(key);
        count++;
      }
    }
    return count;
  }

  async incr(key: string): Promise<number> {
    this.checkConnection();
    const val = this.store.get(key);
    const newVal = val ? parseInt(val, 10) + 1 : 1;
    this.store.set(key, String(newVal));
    return newVal;
  }

  async decr(key: string): Promise<number> {
    this.checkConnection();
    const val = this.store.get(key);
    const newVal = val ? parseInt(val, 10) - 1 : -1;
    this.store.set(key, String(newVal));
    return newVal;
  }

  async expire(key: string, seconds: number): Promise<number> {
    this.checkConnection();
    if (!this.store.has(key)) return 0;
    this.ttls.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  async ttl(key: string): Promise<number> {
    this.checkConnection();
    if (!this.store.has(key)) return -2;
    const expiry = this.ttls.get(key);
    if (!expiry) return -1;
    return Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
  }

  async exists(...keys: string[]): Promise<number> {
    this.checkConnection();
    return keys.filter((k) => this.store.has(k)).length;
  }

  async keys(pattern: string): Promise<string[]> {
    this.checkConnection();
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return Array.from(this.store.keys()).filter((k) => regex.test(k));
  }

  // --- Hash Operations ---

  async hset(key: string, field: string, value: string): Promise<number> {
    this.checkConnection();
    const hashKey = `${key}::${field}`;
    const existed = this.store.has(hashKey);
    this.store.set(hashKey, value);
    return existed ? 0 : 1;
  }

  async hget(key: string, field: string): Promise<string | null> {
    this.checkConnection();
    return this.store.get(`${key}::${field}`) ?? null;
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    this.checkConnection();
    let count = 0;
    for (const field of fields) {
      if (this.store.delete(`${key}::${field}`)) count++;
    }
    return count;
  }

  // --- Eval (Lua script simulation) ---

  async eval(_script: string, _numKeys: number, ..._args: any[]): Promise<any> {
    this.checkConnection();
    // Return 0 (allowed) by default for rate limiting Lua scripts
    return 0;
  }

  // --- Connection ---

  async ping(): Promise<string> {
    this.checkConnection();
    return 'PONG';
  }

  async quit(): Promise<'OK'> {
    this.connected = false;
    this.status = 'end';
    this.emit('close');
    return 'OK';
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.status = 'end';
    this.emit('close');
  }

  // --- Events ---

  on(event: string, callback: EventCallback): this {
    const callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
      return true;
    }
    return false;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  // --- Test Helpers ---

  /**
   * Clear all stored data (call in beforeEach/afterEach)
   */
  reset(): void {
    this.store.clear();
    this.ttls.clear();
    this.connected = true;
    this.status = 'ready';
  }

  /**
   * Simulate connection failure
   */
  simulateDisconnect(): void {
    this.connected = false;
    this.status = 'reconnecting';
    this.emit('error', new Error('Connection lost'));
    this.emit('close');
  }

  /**
   * Simulate reconnection
   */
  simulateReconnect(): void {
    this.connected = true;
    this.status = 'ready';
    this.emit('connect');
    this.emit('ready');
  }

  /**
   * Get raw store size (for debugging)
   */
  getStoreSize(): number {
    return this.store.size;
  }

  private checkConnection(): void {
    if (!this.connected) {
      throw new Error('Connection is closed');
    }
  }
}

/**
 * Factory to create a fresh mock Redis client for each test
 */
export function createMockRedisClient(): MockRedisClient {
  return new MockRedisClient();
}

/**
 * Create a null Redis client (simulates no Redis connection)
 */
export function createNullRedisClient(): null {
  return null;
}
