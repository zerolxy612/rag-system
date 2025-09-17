// 基础实体类型定义
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Prompt 实体
export interface Prompt extends BaseEntity {
  title: string;
  content: string;
  variables: PromptVariable[];
  category: string;
  tags: string[];
  version: number;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description?: string;
  defaultValue?: unknown;
  required: boolean;
}

// Rule 实体
export interface Rule extends BaseEntity {
  name: string;
  description: string;
  type: 'validation' | 'transformation' | 'filter';
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  enabled: boolean;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  value: string | number | boolean | RegExp;
}

export interface RuleAction {
  type: 'modify' | 'reject' | 'flag' | 'transform';
  parameters: Record<string, unknown>;
}

// KnowledgeItem 实体
export interface KnowledgeItem extends BaseEntity {
  title: string;
  content: string;
  type: 'sensitive' | 'common_error' | 'faq' | 'guideline';
  keywords: string[];
  category: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

// Official 实体
export interface Official extends BaseEntity {
  name: string;
  position: string;
  department: string;
  level: number;
  isActive: boolean;
  lastSyncAt?: Date;
  source: string;
}

// Version 实体
export interface Version extends BaseEntity {
  entityId: string;
  entityType: 'prompt' | 'rule' | 'knowledge';
  version: number;
  changes: VersionChange[];
  publishedAt?: Date;
  publishedBy?: string;
  rollbackFrom?: string;
}

export interface VersionChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changeType: 'create' | 'update' | 'delete';
}

// Audit 实体
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// User 实体
export interface User extends BaseEntity {
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  lastLoginAt?: Date;
  isActive: boolean;
}
