'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils';
import { ProtectedRoute, useAuth, RequirePermission, getRoleDisplayName, type Permission } from '@/shared/auth';

const navigation: Array<{
  name: string;
  href: string;
  icon: string;
  description: string;
  permission: Permission;
}> = [
  {
    name: 'Prompts',
    href: '/dashboard/prompts',
    icon: '📝',
    description: 'Prompt 模板管理',
    permission: 'prompts:read',
  },
  {
    name: 'Officials',
    href: '/dashboard/officials',
    icon: '👥',
    description: '官员名单管理',
    permission: 'officials:read',
  },
  {
    name: 'Knowledge',
    href: '/dashboard/knowledge',
    icon: '📚',
    description: '知识库管理',
    permission: 'knowledge:read',
  },
  {
    name: 'Audit',
    href: '/dashboard/audit',
    icon: '📊',
    description: '审计日志',
    permission: 'audit:read',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 移动端侧边栏背景 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* 侧边栏 */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">RAG 管理系统</h1>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">关闭侧边栏</span>
              ✕
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <RequirePermission key={item.name} permission={item.permission}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                </RequirePermission>
              );
            })}
          </nav>

          {/* 用户信息 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.avatar || user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role && getRoleDisplayName(user.role)}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="退出登录"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">打开侧边栏</span>
                ☰
              </button>

              {/* 面包屑导航 */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                      首页
                    </Link>
                  </li>
                  {pathname !== '/dashboard' && (
                    <>
                      <li className="text-gray-400">/</li>
                      <li className="text-gray-900 font-medium">
                        {navigation.find(item => pathname.startsWith(item.href))?.name || '页面'}
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                🔔
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
