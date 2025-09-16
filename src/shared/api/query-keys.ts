// React Query 查询键管理
export const queryKeys = {
  // Prompts
  prompts: {
    all: ['prompts'] as const,
    lists: () => [...queryKeys.prompts.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.prompts.lists(), filters] as const,
    details: () => [...queryKeys.prompts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.prompts.details(), id] as const,
    versions: (id: string) => [...queryKeys.prompts.detail(id), 'versions'] as const,
  },

  // Officials
  officials: {
    all: ['officials'] as const,
    lists: () => [...queryKeys.officials.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.officials.lists(), filters] as const,
    details: () => [...queryKeys.officials.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.officials.details(), id] as const,
    sync: () => [...queryKeys.officials.all, 'sync'] as const,
  },

  // Knowledge
  knowledge: {
    all: ['knowledge'] as const,
    lists: () => [...queryKeys.knowledge.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.knowledge.lists(), filters] as const,
    details: () => [...queryKeys.knowledge.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.knowledge.details(), id] as const,
    categories: () => [...queryKeys.knowledge.all, 'categories'] as const,
  },

  // Rules
  rules: {
    all: ['rules'] as const,
    lists: () => [...queryKeys.rules.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.rules.lists(), filters] as const,
    details: () => [...queryKeys.rules.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.rules.details(), id] as const,
  },

  // Audit
  audit: {
    all: ['audit'] as const,
    logs: () => [...queryKeys.audit.all, 'logs'] as const,
    log: (filters: Record<string, any>) => [...queryKeys.audit.logs(), filters] as const,
    stats: () => [...queryKeys.audit.all, 'stats'] as const,
  },

  // Versions
  versions: {
    all: ['versions'] as const,
    entity: (entityType: string, entityId: string) => 
      [...queryKeys.versions.all, entityType, entityId] as const,
    compare: (entityType: string, entityId: string, v1: number, v2: number) =>
      [...queryKeys.versions.entity(entityType, entityId), 'compare', v1, v2] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },
} as const;

// 查询键工具函数
export const invalidateQueries = {
  prompts: {
    all: () => queryKeys.prompts.all,
    list: () => queryKeys.prompts.lists(),
    detail: (id: string) => queryKeys.prompts.detail(id),
  },
  officials: {
    all: () => queryKeys.officials.all,
    list: () => queryKeys.officials.lists(),
    detail: (id: string) => queryKeys.officials.detail(id),
  },
  knowledge: {
    all: () => queryKeys.knowledge.all,
    list: () => queryKeys.knowledge.lists(),
    detail: (id: string) => queryKeys.knowledge.detail(id),
  },
  audit: {
    all: () => queryKeys.audit.all,
    logs: () => queryKeys.audit.logs(),
  },
};
