export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    redis: ServiceStatus;
    api: ServiceStatus;
  };
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  message?: string;
}

export interface ApiMetrics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
}

export interface RateLimitInfo {
  tier: string;
  limit: number;
  remaining: number;
  resetTime: string;
  windowMs: number;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: ApiParameter[];
  responses: ApiResponse[];
}

export interface ApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  required: boolean;
  type: string;
  description: string;
}

export interface ApiResponse {
  status: number;
  description: string;
  example?: unknown;
}

export interface ShellCompletion {
  shell: 'bash' | 'zsh';
  script: string;
}

export interface CliCommand {
  name: string;
  description: string;
  usage: string;
  options: CliOption[];
}

export interface CliOption {
  flag: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface SystemInfo {
  nodeVersion: string;
  platform: string;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
  cpuUsage: number;
}

export interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  metadata?: Record<string, unknown>;
}
