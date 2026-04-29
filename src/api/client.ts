/**
 * Medusa API Client Configuration
 *
 * Centralized API client for Medusa e-commerce backend.
 * Handles request/response interceptors, error handling, and auth tokens.
 */

const MEDUSA_API_URL = import.meta.env.VITE_MEDUSA_API_URL || 'http://localhost:9000';
const MEDUSA_PUBLISHABLE_API_KEY = import.meta.env.VITE_MEDUSA_API_KEY || '';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

class MedusaClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = MEDUSA_API_URL;
    this.apiKey = MEDUSA_PUBLISHABLE_API_KEY;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`/store${endpoint}`, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-publishable-api-key'] = this.apiKey;
    }

    // Add cart ID if available (for session management)
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
      headers['x-cart-id'] = cartId;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchConfig } = config;
    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: {
          ...this.getHeaders(),
          ...(fetchConfig.headers || {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        ok: response.ok,
      };
    } catch (error) {
      console.error(`Medusa API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async update<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const medusaClient = new MedusaClient();
export default medusaClient;
