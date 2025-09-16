'use client';

import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate, formatRelativeTime } from '@/shared/utils';
import type { Version } from '@/entities';

interface VersionHistoryProps {
  entityId: string;
  entityType: 'prompt' | 'rule' | 'knowledge';
  versions: Version[];
  currentVersion: number;
  onRollback: (version: number) => void;
  onCompare: (v1: number, v2: number) => void;
}

export function VersionHistory({ 
  entityId, 
  entityType, 
  versions, 
  currentVersion, 
  onRollback, 
  onCompare 
}: VersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);

  const handleVersionSelect = (version: number) => {
    setSelectedVersions(prev => {
      if (prev.includes(version)) {
        return prev.filter(v => v !== version);
      } else if (prev.length < 2) {
        return [...prev, version];
      } else {
        return [prev[1], version];
      }
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      onCompare(selectedVersions[0], selectedVersions[1]);
    }
  };

  const getChangesSummary = (changes: any[]) => {
    if (!changes || changes.length === 0) return '无变更';
    
    const summary = changes.map(change => {
      switch (change.changeType) {
        case 'create':
          return `创建 ${change.field}`;
        case 'update':
          return `更新 ${change.field}`;
        case 'delete':
          return `删除 ${change.field}`;
        default:
          return `修改 ${change.field}`;
      }
    });
    
    return summary.slice(0, 3).join(', ') + (summary.length > 3 ? '...' : '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">版本历史</h3>
        <div className="flex gap-2">
          {selectedVersions.length === 2 && (
            <Button size="sm" onClick={handleCompare}>
              📊 对比版本
            </Button>
          )}
          <Button size="sm" variant="outline">
            📥 导出历史
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {versions.map((version) => (
          <Card 
            key={version.id} 
            className={`transition-all ${
              version.version === currentVersion 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : selectedVersions.includes(version.version)
                ? 'ring-2 ring-green-500 bg-green-50'
                : 'hover:shadow-md'
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.version)}
                    onChange={() => handleVersionSelect(version.version)}
                    className="mt-1"
                    disabled={selectedVersions.length >= 2 && !selectedVersions.includes(version.version)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        版本 {version.version}
                      </span>
                      
                      {version.version === currentVersion && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          当前版本
                        </span>
                      )}
                      
                      {version.publishedAt && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          已发布
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {getChangesSummary(version.changes)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        创建时间: {formatDate(version.createdAt, 'long')}
                      </span>
                      <span>
                        {formatRelativeTime(version.createdAt)}
                      </span>
                      {version.publishedBy && (
                        <span>
                          发布者: {version.publishedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {/* 查看详情 */}}
                  >
                    详情
                  </Button>
                  
                  {version.version !== currentVersion && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRollback(version.version)}
                    >
                      回滚
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 变更详情 */}
              {version.changes && version.changes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                      查看变更详情 ({version.changes.length} 项变更)
                    </summary>
                    <div className="mt-2 space-y-2">
                      {version.changes.map((change, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              change.changeType === 'create' ? 'bg-green-100 text-green-800' :
                              change.changeType === 'update' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {change.changeType === 'create' ? '新增' :
                               change.changeType === 'update' ? '修改' : '删除'}
                            </span>
                            <span className="font-medium">{change.field}</span>
                          </div>
                          
                          {change.changeType === 'update' && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-red-600">- </span>
                                <span className="bg-red-50 px-1 rounded">
                                  {JSON.stringify(change.oldValue)}
                                </span>
                              </div>
                              <div>
                                <span className="text-green-600">+ </span>
                                <span className="bg-green-50 px-1 rounded">
                                  {JSON.stringify(change.newValue)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {versions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">暂无版本历史</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
