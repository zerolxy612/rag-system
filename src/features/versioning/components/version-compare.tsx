'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/shared/ui';
import { formatDate } from '@/shared/utils';

interface VersionCompareProps {
  entityType: string;
  version1: {
    version: number;
    data: any;
    createdAt: Date;
    publishedBy?: string;
  };
  version2: {
    version: number;
    data: any;
    createdAt: Date;
    publishedBy?: string;
  };
  onClose: () => void;
}

export function VersionCompare({ entityType, version1, version2, onClose }: VersionCompareProps) {
  // 计算差异
  const calculateDiff = (obj1: any, obj2: any) => {
    const diff: Array<{
      field: string;
      oldValue: any;
      newValue: any;
      type: 'added' | 'removed' | 'modified' | 'unchanged';
    }> = [];

    const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    allKeys.forEach(key => {
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (val1 === undefined && val2 !== undefined) {
        diff.push({ field: key, oldValue: undefined, newValue: val2, type: 'added' });
      } else if (val1 !== undefined && val2 === undefined) {
        diff.push({ field: key, oldValue: val1, newValue: undefined, type: 'removed' });
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        diff.push({ field: key, oldValue: val1, newValue: val2, type: 'modified' });
      } else {
        diff.push({ field: key, oldValue: val1, newValue: val2, type: 'unchanged' });
      }
    });

    return diff;
  };

  const differences = calculateDiff(version1.data, version2.data);
  const hasChanges = differences.some(d => d.type !== 'unchanged');

  const renderValue = (value: any) => {
    if (value === undefined) return <span className="text-gray-400 italic">未定义</span>;
    if (value === null) return <span className="text-gray-400 italic">null</span>;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    return JSON.stringify(value, null, 2);
  };

  const getFieldDisplayName = (field: string) => {
    const fieldNames: Record<string, string> = {
      title: '标题',
      content: '内容',
      category: '分类',
      tags: '标签',
      variables: '变量',
      status: '状态',
      name: '名称',
      description: '描述',
      type: '类型',
      keywords: '关键词',
      severity: '严重程度',
      isActive: '是否启用',
    };
    return fieldNames[field] || field;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            版本对比: v{version1.version} vs v{version2.version}
          </h2>
          <Button variant="outline" onClick={onClose}>
            ✕ 关闭
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 版本信息 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">版本 {version1.version}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">创建时间:</span> {formatDate(version1.createdAt, 'long')}
                  </div>
                  {version1.publishedBy && (
                    <div>
                      <span className="font-medium">发布者:</span> {version1.publishedBy}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">版本 {version2.version}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">创建时间:</span> {formatDate(version2.createdAt, 'long')}
                  </div>
                  {version2.publishedBy && (
                    <div>
                      <span className="font-medium">发布者:</span> {version2.publishedBy}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 差异对比 */}
          <Card>
            <CardHeader>
              <CardTitle>字段对比</CardTitle>
              {!hasChanges && (
                <p className="text-sm text-gray-600">两个版本之间没有差异</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {differences.map((diff, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${
                      diff.type === 'added' ? 'bg-green-50 border-green-200' :
                      diff.type === 'removed' ? 'bg-red-50 border-red-200' :
                      diff.type === 'modified' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {getFieldDisplayName(diff.field)}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        diff.type === 'added' ? 'bg-green-100 text-green-800' :
                        diff.type === 'removed' ? 'bg-red-100 text-red-800' :
                        diff.type === 'modified' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {diff.type === 'added' ? '新增' :
                         diff.type === 'removed' ? '删除' :
                         diff.type === 'modified' ? '修改' : '无变化'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          版本 {version1.version}
                        </div>
                        <div className={`p-2 rounded text-sm font-mono ${
                          diff.type === 'removed' ? 'bg-red-100' :
                          diff.type === 'modified' ? 'bg-red-50' : 'bg-white'
                        }`}>
                          {renderValue(diff.oldValue)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          版本 {version2.version}
                        </div>
                        <div className={`p-2 rounded text-sm font-mono ${
                          diff.type === 'added' ? 'bg-green-100' :
                          diff.type === 'modified' ? 'bg-green-50' : 'bg-white'
                        }`}>
                          {renderValue(diff.newValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
          <Button>
            导出对比报告
          </Button>
        </div>
      </div>
    </div>
  );
}
