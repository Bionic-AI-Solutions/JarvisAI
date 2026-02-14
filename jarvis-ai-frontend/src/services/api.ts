const API_BASE = '';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  return response.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  health: {
    check: () => request<{
      status: string;
      timestamp: string;
      uptime: number;
      version: string;
      redis: string;
    }>('/health'),
  },

  ping: {
    send: () => request<{ message: string; timestamp: string }>('/api/v1/ping'),
  },

  docs: {
    getSpec: () => request<Record<string, unknown>>('/api-docs'),
  },
};

export default api;
