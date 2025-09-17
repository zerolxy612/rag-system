// 硬编码的用户表
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  name: string;
  avatar?: string;
}

// 预设用户账号
export const USERS: AuthUser[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@rag.com',
    password: 'admin123',
    role: 'admin',
    name: '系统管理员',
    avatar: '👨‍💼',
  },
  {
    id: '2',
    username: 'editor1',
    email: 'editor1@rag.com',
    password: 'editor123',
    role: 'editor',
    name: '内容编辑员',
    avatar: '✍️',
  },
  {
    id: '3',
    username: 'editor2',
    email: 'editor2@rag.com',
    password: 'editor456',
    role: 'editor',
    name: '高级编辑',
    avatar: '📝',
  },
  {
    id: '4',
    username: 'viewer1',
    email: 'viewer1@rag.com',
    password: 'viewer123',
    role: 'viewer',
    name: '数据查看员',
    avatar: '👀',
  },
  {
    id: '5',
    username: 'viewer2',
    email: 'viewer2@rag.com',
    password: 'viewer456',
    role: 'viewer',
    name: '审计员',
    avatar: '🔍',
  },
];

// 权限类型定义
export type Permission =
  | 'prompts:read' | 'prompts:write' | 'prompts:delete'
  | 'officials:read' | 'officials:write' | 'officials:delete' | 'officials:sync'
  | 'knowledge:read' | 'knowledge:write' | 'knowledge:delete'
  | 'audit:read'
  | 'users:read' | 'users:write';

// 角色权限定义
export const ROLE_PERMISSIONS: Record<AuthUser['role'], Permission[]> = {
  admin: [
    'prompts:read',
    'prompts:write',
    'prompts:delete',
    'officials:read',
    'officials:write',
    'officials:delete',
    'officials:sync',
    'knowledge:read',
    'knowledge:write',
    'knowledge:delete',
    'audit:read',
    'users:read',
    'users:write',
  ],
  editor: [
    'prompts:read',
    'prompts:write',
    'officials:read',
    'knowledge:read',
    'knowledge:write',
    'audit:read',
  ],
  viewer: [
    'prompts:read',
    'officials:read',
    'knowledge:read',
    'audit:read',
  ],
};

// 用户认证函数
export function authenticateUser(usernameOrEmail: string, password: string): AuthUser | null {
  const user = USERS.find(
    u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );
  
  return user || null;
}

// 检查用户权限
export function hasPermission(userRole: AuthUser['role'], permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

// 获取角色显示名称
export function getRoleDisplayName(role: AuthUser['role']): string {
  const roleNames = {
    admin: '管理员',
    editor: '编辑员',
    viewer: '查看员',
  };
  return roleNames[role];
}
