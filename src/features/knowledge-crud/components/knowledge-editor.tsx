'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import type { KnowledgeItem } from '@/entities';

interface KnowledgeEditorProps {
  item?: Partial<KnowledgeItem>;
  onSave: (item: Partial<KnowledgeItem>) => void;
  onCancel: () => void;
}

export function KnowledgeEditor({ item, onSave, onCancel }: KnowledgeEditorProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    content: item?.content || '',
    category: item?.category || 'sensitive',
    severity: item?.severity || 'medium',
    keywords: item?.keywords?.join(', ') || '',
    isActive: item?.isActive ?? true,
  });

  const [keywordSuggestions] = useState([
    '政治敏感', '历史事件', '宗教话题', '种族问题', '暴力内容',
    '个人隐私', '商业机密', '法律风险', '医疗建议', '金融投资',
    '错别字', '语法错误', '逻辑错误', '事实错误', '格式问题'
  ]);

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === 'isActive' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const itemData = {
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
    };
    onSave(itemData);
  };

  const addKeywordSuggestion = (keyword: string) => {
    const currentKeywords = formData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (!currentKeywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...currentKeywords, keyword].join(', ')
      }));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sensitive': return '🚨';
      case 'error': return '❌';
      case 'guideline': return '📋';
      case 'policy': return '📜';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {item?.id ? '编辑知识条目' : '新建知识条目'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>
            💾 保存
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要编辑区域 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="标题"
                value={formData.title}
                onChange={handleInputChange('title')}
                placeholder="输入知识条目标题"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类
                  </label>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={handleInputChange('category')}
                  >
                    <option value="sensitive">🚨 敏感内容</option>
                    <option value="error">❌ 常见错误</option>
                    <option value="guideline">📋 操作指南</option>
                    <option value="policy">📜 政策规定</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    严重程度
                  </label>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.severity}
                    onChange={handleInputChange('severity')}
                  >
                    <option value="low">🟢 低</option>
                    <option value="medium">🟡 中</option>
                    <option value="high">🔴 高</option>
                    <option value="critical">🟣 严重</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  简要描述
                </label>
                <Input
                  value={formData.content}
                  onChange={handleInputChange('content')}
                  placeholder="简要描述这个知识条目的用途"
                />
              </div>
            </CardContent>
          </Card>

          {/* 内容编辑 */}
          <Card>
            <CardHeader>
              <CardTitle>详细内容</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">内容详情</label>
                <textarea
                  className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.content}
                  onChange={handleInputChange('content')}
                  placeholder="输入详细的知识内容、处理建议或相关说明..."
                />
                <p className="text-xs text-gray-500">
                  支持 Markdown 格式，可以包含链接、列表等格式化内容
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 关键词管理 */}
          <Card>
            <CardHeader>
              <CardTitle>关键词设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  关键词 (用逗号分隔)
                </label>
                <Input
                  value={formData.keywords}
                  onChange={handleInputChange('keywords')}
                  placeholder="输入相关关键词，用逗号分隔"
                />
              </div>
              
              {/* 关键词建议 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">常用关键词建议:</h4>
                <div className="flex flex-wrap gap-2">
                  {keywordSuggestions.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => addKeywordSuggestion(keyword)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      + {keyword}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 当前关键词显示 */}
              {formData.keywords && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">当前关键词:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.split(',').map((keyword, index) => {
                      const trimmed = keyword.trim();
                      return trimmed ? (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {trimmed}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-4">
          {/* 状态设置 */}
          <Card>
            <CardHeader>
              <CardTitle>状态设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  启用状态
                </label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange('isActive')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getCategoryIcon(formData.category)}</span>
                  <span className="font-medium">{formData.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(formData.severity)}`}>
                    {formData.severity}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {formData.isActive ? '已启用' : '已禁用'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 使用指南 */}
          <Card>
            <CardHeader>
              <CardTitle>使用指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">分类说明:</h4>
                <ul className="space-y-1 text-xs">
                  <li>🚨 <strong>敏感内容</strong>: 需要特别注意的话题</li>
                  <li>❌ <strong>常见错误</strong>: 经常出现的问题</li>
                  <li>📋 <strong>操作指南</strong>: 标准操作流程</li>
                  <li>📜 <strong>政策规定</strong>: 相关政策条款</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">严重程度:</h4>
                <ul className="space-y-1 text-xs">
                  <li>🟢 <strong>低</strong>: 一般性提醒</li>
                  <li>🟡 <strong>中</strong>: 需要注意</li>
                  <li>🔴 <strong>高</strong>: 重要警告</li>
                  <li>🟣 <strong>严重</strong>: 严禁触碰</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">关键词设置:</h4>
                <p className="text-xs">
                  关键词用于自动匹配和检测，建议包含同义词、相关词汇等，提高匹配准确性。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
