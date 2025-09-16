// API 服务封装
import { fetcher } from './fetcher';
import type { 
  Prompt, 
  Official, 
  KnowledgeItem, 
  Rule, 
  AuditLog, 
  Version, 
  User 
} from '@/entities';

// Prompt 服务
export const promptService = {
  getList: (params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    status?: string;
    search?: string;
  }) => fetcher.get<{ items: Prompt[]; total: number }>('/prompts', params),
  
  getById: (id: string) => fetcher.get<Prompt>(`/prompts/${id}`),
  
  create: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => 
    fetcher.post<Prompt>('/prompts', data),
  
  update: (id: string, data: Partial<Prompt>) => 
    fetcher.put<Prompt>(`/prompts/${id}`, data),
  
  delete: (id: string) => fetcher.delete(`/prompts/${id}`),
  
  publish: (id: string) => fetcher.post(`/prompts/${id}/publish`),
  
  test: (id: string, variables: Record<string, any>) => 
    fetcher.post<{ result: string }>(`/prompts/${id}/test`, { variables }),
  
  getVersions: (id: string) => fetcher.get<Version[]>(`/prompts/${id}/versions`),
  
  rollback: (id: string, version: number) => 
    fetcher.post(`/prompts/${id}/rollback`, { version }),
};

// Official 服务
export const officialService = {
  getList: (params?: { 
    page?: number; 
    limit?: number; 
    department?: string; 
    level?: number;
    search?: string;
  }) => fetcher.get<{ items: Official[]; total: number }>('/officials', params),
  
  getById: (id: string) => fetcher.get<Official>(`/officials/${id}`),
  
  create: (data: Omit<Official, 'id' | 'createdAt' | 'updatedAt'>) => 
    fetcher.post<Official>('/officials', data),
  
  update: (id: string, data: Partial<Official>) => 
    fetcher.put<Official>(`/officials/${id}`, data),
  
  delete: (id: string) => fetcher.delete(`/officials/${id}`),
  
  sync: () => fetcher.post<{ updated: number; added: number }>('/officials/sync'),
  
  getSyncStatus: () => fetcher.get<{ lastSyncAt: string; status: string }>('/officials/sync/status'),
};

// Knowledge 服务
export const knowledgeService = {
  getList: (params?: { 
    page?: number; 
    limit?: number; 
    type?: string; 
    category?: string;
    search?: string;
  }) => fetcher.get<{ items: KnowledgeItem[]; total: number }>('/knowledge', params),
  
  getById: (id: string) => fetcher.get<KnowledgeItem>(`/knowledge/${id}`),
  
  create: (data: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => 
    fetcher.post<KnowledgeItem>('/knowledge', data),
  
  update: (id: string, data: Partial<KnowledgeItem>) => 
    fetcher.put<KnowledgeItem>(`/knowledge/${id}`, data),
  
  delete: (id: string) => fetcher.delete(`/knowledge/${id}`),
  
  getCategories: () => fetcher.get<string[]>('/knowledge/categories'),
  
  search: (query: string, type?: string) => 
    fetcher.get<KnowledgeItem[]>('/knowledge/search', { query, type }),
};

// Rule 服务
export const ruleService = {
  getList: (params?: { 
    page?: number; 
    limit?: number; 
    type?: string; 
    enabled?: boolean;
  }) => fetcher.get<{ items: Rule[]; total: number }>('/rules', params),
  
  getById: (id: string) => fetcher.get<Rule>(`/rules/${id}`),
  
  create: (data: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => 
    fetcher.post<Rule>('/rules', data),
  
  update: (id: string, data: Partial<Rule>) => 
    fetcher.put<Rule>(`/rules/${id}`, data),
  
  delete: (id: string) => fetcher.delete(`/rules/${id}`),
  
  toggle: (id: string, enabled: boolean) => 
    fetcher.patch(`/rules/${id}`, { enabled }),
  
  test: (id: string, input: any) => 
    fetcher.post<{ result: any; matched: boolean }>(`/rules/${id}/test`, { input }),
};

// Audit 服务
export const auditService = {
  getLogs: (params?: { 
    page?: number; 
    limit?: number; 
    userId?: string; 
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  }) => fetcher.get<{ items: AuditLog[]; total: number }>('/audit/logs', params),
  
  getStats: (params?: { 
    startDate?: string; 
    endDate?: string; 
  }) => fetcher.get<{
    totalActions: number;
    userActions: Record<string, number>;
    entityActions: Record<string, number>;
    dailyStats: Array<{ date: string; count: number }>;
  }>('/audit/stats', params),
};

// User 服务
export const userService = {
  getProfile: () => fetcher.get<User>('/users/profile'),
  
  updateProfile: (data: Partial<User>) => 
    fetcher.put<User>('/users/profile', data),
  
  getList: (params?: { 
    page?: number; 
    limit?: number; 
    role?: string;
    search?: string;
  }) => fetcher.get<{ items: User[]; total: number }>('/users', params),
  
  getById: (id: string) => fetcher.get<User>(`/users/${id}`),
  
  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
    fetcher.post<User>('/users', data),
  
  update: (id: string, data: Partial<User>) => 
    fetcher.put<User>(`/users/${id}`, data),
  
  delete: (id: string) => fetcher.delete(`/users/${id}`),
};
