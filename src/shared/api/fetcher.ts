// API 请求封装
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  code?: number;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: unknown;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // 添加认证token
    const token = this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    // 从localStorage或其他地方获取token
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>): Promise<ApiResponse<T>> {
    const searchParams = params
      ? new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>((acc, [key, val]) => {
            if (val === undefined || val === null) return acc;
            acc[key] = String(val);
            return acc;
          }, {})
        )
      : null;
    const url = searchParams ? `${endpoint}?${searchParams.toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH 请求
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// 默认API客户端实例
export const apiClient = new ApiClient();

// 便捷的请求方法
export const fetcher = {
  get: <T>(url: string, params?: Record<string, string | number | boolean | null | undefined>) => apiClient.get<T>(url, params),
  post: <T>(url: string, data?: unknown) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: unknown) => apiClient.put<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
  patch: <T>(url: string, data?: unknown) => apiClient.patch<T>(url, data),
};
