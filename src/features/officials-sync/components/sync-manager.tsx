'use client';

import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate } from '@/shared/utils';

interface SyncRecord {
  id: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'partial';
  totalRecords: number;
  addedRecords: number;
  updatedRecords: number;
  errorRecords: number;
  duration: number; // 毫秒
  source: string;
  message?: string;
}

interface OfficialDiff {
  id: string;
  name: string;
  position: string;
  department: string;
  action: 'add' | 'update' | 'remove';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface SyncManagerProps {
  onSync: () => Promise<void>;
  onCancel: () => void;
}

export function SyncManager({ onSync, onCancel }: SyncManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [previewData, setPreviewData] = useState<OfficialDiff[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [syncHistory] = useState<SyncRecord[]>([
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'success',
      totalRecords: 156,
      addedRecords: 12,
      updatedRecords: 8,
      errorRecords: 0,
      duration: 2340,
      source: '政府官网API',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-10T14:20:00'),
      status: 'partial',
      totalRecords: 144,
      addedRecords: 5,
      updatedRecords: 15,
      errorRecords: 3,
      duration: 3120,
      source: '政府官网API',
      message: '部分记录更新失败，请检查数据格式',
    },
  ]);

  // 模拟预览数据
  const mockPreviewData: OfficialDiff[] = [
    {
      id: '1',
      name: '张三',
      position: '市长',
      department: '市政府',
      action: 'add',
    },
    {
      id: '2',
      name: '李四',
      position: '副市长',
      department: '市政府',
      action: 'update',
      changes: [
        { field: '职位', oldValue: '市长助理', newValue: '副市长' },
        { field: '部门', oldValue: '市政府办公室', newValue: '市政府' },
      ],
    },
    {
      id: '3',
      name: '王五',
      position: '局长',
      department: '教育局',
      action: 'remove',
    },
  ];

  const handlePreviewSync = async () => {
    setIsLoading(true);
    setCurrentStep('正在获取最新数据...');
    setSyncProgress(20);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep('正在分析数据差异...');
    setSyncProgress(60);

    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentStep('生成预览报告...');
    setSyncProgress(90);

    await new Promise(resolve => setTimeout(resolve, 500));
    setPreviewData(mockPreviewData);
    setShowPreview(true);
    setIsLoading(false);
    setSyncProgress(100);
    setCurrentStep('预览准备完成');
  };

  const handleConfirmSync = async () => {
    setIsLoading(true);
    setShowPreview(false);
    setCurrentStep('正在同步数据...');
    setSyncProgress(0);

    // 模拟同步过程
    for (let i = 0; i <= 100; i += 10) {
      setSyncProgress(i);
      if (i === 30) setCurrentStep('正在添加新记录...');
      if (i === 60) setCurrentStep('正在更新现有记录...');
      if (i === 90) setCurrentStep('正在清理无效记录...');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setCurrentStep('同步完成');
    setIsLoading(false);
    await onSync();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'partial': return '⚠️';
      default: return '⏳';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'add': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'remove': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'add': return '➕';
      case 'update': return '✏️';
      case 'remove': return '🗑️';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">官员信息同步</h2>
          <p className="text-gray-600">从外部数据源同步最新的官员信息</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            返回
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 同步操作区域 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 同步控制面板 */}
          <Card>
            <CardHeader>
              <CardTitle>同步控制</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPreview ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-900 mb-2">数据源信息</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>📡 <strong>数据源</strong>: 政府官网API</p>
                      <p>🔗 <strong>接口地址</strong>: https://api.gov.cn/officials</p>
                      <p>⏰ <strong>上次同步</strong>: {formatDate(syncHistory[0]?.timestamp)}</p>
                      <p>📊 <strong>当前记录数</strong>: 156 条</p>
                    </div>
                  </div>

                  {isLoading && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{currentStep}</span>
                        <span className="text-sm text-gray-500">{syncProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${syncProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePreviewSync}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? '🔄 处理中...' : '👀 预览更新'}
                    </Button>
                    <Button 
                      onClick={handleConfirmSync}
                      disabled={isLoading || previewData.length === 0}
                      variant="outline"
                    >
                      🚀 直接同步
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-medium text-green-900 mb-2">预览结果</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>📊 <strong>总变更</strong>: {previewData.length} 条</p>
                      <p>➕ <strong>新增</strong>: {previewData.filter(d => d.action === 'add').length} 条</p>
                      <p>✏️ <strong>更新</strong>: {previewData.filter(d => d.action === 'update').length} 条</p>
                      <p>🗑️ <strong>删除</strong>: {previewData.filter(d => d.action === 'remove').length} 条</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleConfirmSync}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      ✅ 确认同步
                    </Button>
                    <Button 
                      onClick={() => setShowPreview(false)}
                      variant="outline"
                    >
                      🔙 重新预览
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 预览详情 */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>变更详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {previewData.map((diff) => (
                    <div key={diff.id} className="p-3 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getActionIcon(diff.action)}</span>
                          <div>
                            <h4 className="font-medium">{diff.name}</h4>
                            <p className="text-sm text-gray-600">{diff.position} • {diff.department}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getActionColor(diff.action)}`}>
                          {diff.action === 'add' ? '新增' : diff.action === 'update' ? '更新' : '删除'}
                        </span>
                      </div>
                      
                      {diff.changes && (
                        <div className="mt-2 space-y-1">
                          {diff.changes.map((change, index) => (
                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                              <span className="font-medium">{change.field}</span>: 
                              <span className="text-red-600 line-through ml-1">{change.oldValue}</span>
                              <span className="mx-1">→</span>
                              <span className="text-green-600">{change.newValue}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧面板 */}
        <div className="space-y-4">
          {/* 同步历史 */}
          <Card>
            <CardHeader>
              <CardTitle>同步历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncHistory.map((record) => (
                  <div key={record.id} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(record.status)}</span>
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(record.status)}`}>
                          {record.status === 'success' ? '成功' : record.status === 'failed' ? '失败' : '部分成功'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(record.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>📊 总计: {record.totalRecords} 条</p>
                      <p>➕ 新增: {record.addedRecords} 条</p>
                      <p>✏️ 更新: {record.updatedRecords} 条</p>
                      {record.errorRecords > 0 && (
                        <p className="text-red-600">❌ 错误: {record.errorRecords} 条</p>
                      )}
                      <p>⏱️ 耗时: {(record.duration / 1000).toFixed(1)}s</p>
                    </div>
                    
                    {record.message && (
                      <p className="text-xs text-yellow-600 mt-2 p-2 bg-yellow-50 rounded">
                        {record.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 配置信息 */}
          <Card>
            <CardHeader>
              <CardTitle>同步配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">数据源设置</h4>
                <p className="text-gray-600">API 地址: api.gov.cn</p>
                <p className="text-gray-600">认证方式: API Key</p>
                <p className="text-gray-600">超时时间: 30秒</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">同步策略</h4>
                <p className="text-gray-600">冲突处理: 外部数据优先</p>
                <p className="text-gray-600">删除策略: 标记为无效</p>
                <p className="text-gray-600">备份策略: 同步前自动备份</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">通知设置</h4>
                <p className="text-gray-600">成功通知: 已启用</p>
                <p className="text-gray-600">失败通知: 已启用</p>
                <p className="text-gray-600">邮件通知: admin@example.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
