// 认证模块导出
export { AuthProvider, useAuth, usePermission, useRole } from './auth-context';
export { ProtectedRoute, RequirePermission, RequireRole } from './protected-route';
export { USERS, ROLE_PERMISSIONS, authenticateUser, hasPermission, getRoleDisplayName } from './users';
export type { AuthUser, Permission } from './users';
