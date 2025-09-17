'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';
import { AuthUser, hasPermission, type Permission } from './users';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AuthUser['role'] | AuthUser['role'][];
  requiredPermission?: Permission;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 未登录，重定向到登录页
  if (!user) {
    router.push('/login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在跳转到登录页面...</p>
        </div>
      </div>
    );
  }

  // 检查角色权限
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
    
    if (!hasRequiredRole) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h1>
            <p className="text-gray-600 mb-4">
              您没有访问此页面的权限。需要角色: {
                Array.isArray(requiredRole) 
                  ? requiredRole.join(' 或 ')
                  : requiredRole
              }
            </p>
            <p className="text-sm text-gray-500">
              当前角色: {user.role}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回上一页
            </button>
          </div>
        </div>
      );
    }
  }

  // 检查具体权限
  if (requiredPermission) {
    const hasRequiredPermission = hasPermission(user.role, requiredPermission);
    
    if (!hasRequiredPermission) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">权限不足</h1>
            <p className="text-gray-600 mb-4">
              您没有执行此操作的权限。需要权限: {requiredPermission}
            </p>
            <p className="text-sm text-gray-500">
              当前角色: {user.role}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回上一页
            </button>
          </div>
        </div>
      );
    }
  }

  // 权限检查通过，渲染子组件
  return <>{children}</>;
}

// 便捷的权限检查组件
interface RequirePermissionProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({ permission, children, fallback }: RequirePermissionProps) {
  const { user } = useAuth();
  
  if (!user) return null;

  const hasRequiredPermission = hasPermission(user.role, permission);
  
  if (!hasRequiredPermission) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

// 便捷的角色检查组件
interface RequireRoleProps {
  role: AuthUser['role'] | AuthUser['role'][];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ role, children, fallback }: RequireRoleProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const hasRequiredRole = Array.isArray(role) 
    ? role.includes(user.role)
    : user.role === role;
  
  if (!hasRequiredRole) {
    return fallback || null;
  }
  
  return <>{children}</>;
}
