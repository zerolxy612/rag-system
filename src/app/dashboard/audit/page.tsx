'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate, formatRelativeTime } from '@/shared/utils';

// 模拟数据
const mockAuditLogs = [
  {
    id: '1',
    userId: 'user1',
    action: '创建 Prompt',
    entityType: 'prompt',
    entityId: 'prompt1',
    changes: {
      title: '新建客服回复模板',
      status: 'draft',
    },
    metadata: {
      userAgent: 'Mozilla/5.0...',
      ip: '192.168.1.100',
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0',
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:00'),
  },
  {
    id: '2',
    userId: 'user2',
    action: '更新官员信息',
    entityType: 'official',
    entityId: 'official1',
    changes: {
      position: '从副市长更新为市长',
      department: '市政府',
    },
    metadata: {
      syncSource: '官方网站',
    },
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome/120.0.0.0',
    createdAt: new Date('2024-01-15T10:15:00'),
    updatedAt: new Date('2024-01-15T10:15:00'),
  },
  {
    id: '3',
    userId: 'user1',
    action: '删除知识条目',
    entityType: 'knowledge',
    entityId: 'knowledge1',
    changes: {
      title: '已删除的敏感词汇规范',
      isActive: false,
    },
    metadata: {
      reason: '内容过期',
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/120.0.0.0',
    createdAt: new Date('2024-01-14T16:45:00'),
    updatedAt: new Date('2024-01-14T16:45:00'),
  },
];

const actionColors = {
  '创建': 'bg-green-100 text-green-800',
  '更新': 'bg-blue-100 text-blue-800',
  '删除': 'bg-red-100 text-red-800',
  '发布': 'bg-purple-100 text-purple-800',
  '同步': 'bg-yellow-100 text-yellow-800',
};

const entityTypeLabels = {
  prompt: 'Prompt',
  official: '官员',
  knowledge: '知识库',
  rule: '规则',
  user: '用户',
};

export default function AuditPage() {
  const [auditLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState('');
  const [dateRange, setDateRange] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !selectedAction || log.action.includes(selectedAction);
    const matchesEntityType = !selectedEntityType || log.entityType === selectedEntityType;
    
    // 简单的日期筛选
    let matchesDate = true;
    if (dateRange) {
      const today = new Date();
      const logDate = new Date(log.createdAt);
      switch (dateRange) {
        case 'today':
          matchesDate = logDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesEntityType && matchesDate;
  });

  const actions = Array.from(new Set(auditLogs.map(log => log.action.split(' ')[0])));
  const entityTypes = Object.keys(entityTypeLabels);

  // 统计数据
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => {
      const today = new Date();
      const logDate = new Date(log.createdAt);
      return logDate.toDateString() === today.toDateString();
    }).length,
    users: new Set(auditLogs.map(log => log.userId)).size,
    entities: new Set(auditLogs.map(log => log.entityType)).size,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">审计日志</h1>
          <p className="text-gray-600">查看系统操作记录和用户行为</p>
        </div>
        <Button variant="outline">
          📊 导出报告
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">总操作数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
              <div className="text-sm text-gray-600">今日操作</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.users}</div>
              <div className="text-sm text-gray-600">活跃用户</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.entities}</div>
              <div className="text-sm text-gray-600">涉及实体</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="搜索操作或用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="">所有操作</option>
              {actions.map(action => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <select
              className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
            >
              <option value="">所有实体</option>
              {entityTypes.map(type => (
                <option key={type} value={type}>
                  {entityTypeLabels[type as keyof typeof entityTypeLabels]}
                </option>
              ))}
            </select>
            <select
              className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="">所有时间</option>
              <option value="today">今天</option>
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 审计日志列表 */}
      <Card>
        <CardHeader>
          <CardTitle>操作记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        actionColors[log.action.split(' ')[0] as keyof typeof actionColors] || 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {entityTypeLabels[log.entityType as keyof typeof entityTypeLabels]}
                      </span>
                      <span className="text-sm text-gray-600">
                        by {log.userId}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      实体ID: {log.entityId}
                    </div>
                    
                    {log.changes && (
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>变更内容:</strong>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>IP: {log.ipAddress}</span>
                      <span>时间: {formatDate(log.createdAt, 'long')}</span>
                      <span>{formatRelativeTime(log.createdAt)}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    详情
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到匹配的审计记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
