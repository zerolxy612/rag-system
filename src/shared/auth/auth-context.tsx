'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, authenticateUser } from './users';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'rag_auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从 localStorage 恢复用户状态
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to restore user from localStorage:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const authenticatedUser = authenticateUser(usernameOrEmail, password);
      
      if (authenticatedUser) {
        // 不存储密码到 localStorage
        const userToStore = { ...authenticatedUser };
        delete (userToStore as any).password;
        
        setUser(userToStore as AuthUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToStore));
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: '用户名/邮箱或密码错误' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: '登录过程中发生错误，请重试' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 权限检查 Hook
export function usePermission(permission: string) {
  const { user } = useAuth();
  
  if (!user) return false;
  
  const { hasPermission } = require('./users');
  return hasPermission(user.role, permission);
}

// 角色检查 Hook
export function useRole(requiredRole: AuthUser['role'] | AuthUser['role'][]) {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
}
