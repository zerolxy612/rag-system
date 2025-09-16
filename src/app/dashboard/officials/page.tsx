'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate, formatRelativeTime } from '@/shared/utils';
import { RequirePermission } from '@/shared/auth';
import { SyncManager } from '@/features/officials-sync/components/sync-manager';

// 模拟数据
const mockOfficials = [
  {
    id: '1',
    name: '张三',
    position: '市长',
    department: '市政府',
    level: 1,
    isActive: true,
    lastSyncAt: new Date('2024-01-15T10:30:00'),
    source: '官方网站',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: '李四',
    position: '副市长',
    department: '市政府',
    level: 2,
    isActive: true,
    lastSyncAt: new Date('2024-01-14T15:20:00'),
    source: '官方网站',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: '王五',
    position: '局长',
    department: '教育局',
    level: 3,
    isActive: false,
    lastSyncAt: new Date('2024-01-10T09:15:00'),
    source: '官方网站',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
];

export default function OfficialsPage() {
  const [officials, setOfficials] = useState(mockOfficials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showSyncManager, setShowSyncManager] = useState(false);

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || official.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(officials.map(o => o.department)));

  const handleSync = async () => {
    // 模拟同步成功后的数据更新
    const newOfficials = [
      {
        id: Date.now().toString(),
        name: '张三',
        position: '市长',
        department: '市政府',
        level: 'city',
        phone: '138-0000-0001',
        email: 'zhangsan@gov.cn',
        status: 'active' as const,
        lastUpdated: new Date(),
      },
      ...officials,
    ];
    setOfficials(newOfficials);
    setShowSyncManager(false);
  };

  const handleCancelSync = () => {
    setShowSyncManager(false);
  };

  const handleOpenSyncManager = () => {
    setShowSyncManager(true);
  };

  // 如果显示同步管理器，渲染同步管理器页面
  if (showSyncManager) {
    return (
      <SyncManager
        onSync={handleSync}
        onCancel={handleCancelSync}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">官员名单管理</h1>
          <p className="text-gray-600">管理和同步官员信息</p>
        </div>
        <div className="flex gap-2">
          <RequirePermission permission="officials:write">
            <Button variant="outline">
              ➕ 手动添加
            </Button>
          </RequirePermission>
          <RequirePermission permission="officials:sync">
            <Button onClick={handleOpenSyncManager}>
              🔄 一键同步
            </Button>
          </RequirePermission>
        </div>
      </div>

      {/* 同步状态 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">同步状态</p>
              <p className="text-sm text-gray-600">
                最后同步: {formatRelativeTime(new Date('2024-01-15T10:30:00'))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                总计: {officials.length} 人
              </p>
              <p className="text-sm text-gray-600">
                活跃: {officials.filter(o => o.isActive).length} 人
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索官员姓名或职位..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">所有部门</option>
                {departments.map(department => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 官员列表 */}
      <Card>
        <CardHeader>
          <CardTitle>官员列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">姓名</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">职位</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">部门</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">级别</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">状态</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">最后同步</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficials.map((official) => (
                  <tr key={official.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{official.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{official.position}</td>
                    <td className="py-3 px-4 text-gray-600">{official.department}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        L{official.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        official.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {official.isActive ? '活跃' : '非活跃'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {official.lastSyncAt ? formatRelativeTime(official.lastSyncAt) : '未同步'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant="outline">
                          详情
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOfficials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到匹配的官员信息</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
