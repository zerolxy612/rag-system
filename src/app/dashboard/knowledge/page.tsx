'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate } from '@/shared/utils';
import { RequirePermission } from '@/shared/auth';
import { KnowledgeEditor } from '@/features/knowledge-crud/components/knowledge-editor';
import type { KnowledgeItem } from '@/entities';

// 模拟数据
const mockKnowledge = [
  {
    id: '1',
    title: '敏感词汇处理规范',
    content: '在处理用户咨询时，需要特别注意以下敏感词汇的使用和回应方式...',
    type: 'sensitive' as const,
    keywords: ['敏感词', '政治', '规范'],
    category: '内容审核',
    severity: 'high' as const,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: '常见错误问题汇总',
    content: '用户经常询问的错误信息包括：1. 政策理解偏差 2. 流程操作错误...',
    type: 'common_error' as const,
    keywords: ['错误', '政策', '流程'],
    category: '问题解答',
    severity: 'medium' as const,
    isActive: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    title: '政策解读指南',
    content: '针对新出台的政策，需要按照以下步骤进行解读和回应...',
    type: 'guideline' as const,
    keywords: ['政策', '解读', '指南'],
    category: '政策解读',
    severity: 'low' as const,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
  },
];

const typeLabels = {
  sensitive: '敏感内容',
  common_error: '常见错误',
  faq: '常见问题',
  guideline: '操作指南',
};

const severityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '严重',
};

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(mockKnowledge);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<KnowledgeItem> | undefined>();

  const filteredKnowledge = knowledge.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !selectedType || item.type === selectedType;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const types = Object.keys(typeLabels);
  const categories = Array.from(new Set(knowledge.map(k => k.category)));

  // 编辑器处理函数
  const handleCreateItem = () => {
    setEditingItem(undefined);
    setShowEditor(true);
  };

  const handleEditItem = (item: KnowledgeItem) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  const handleSaveItem = (itemData: Partial<KnowledgeItem>) => {
    if (editingItem?.id) {
      // 更新现有条目
      setKnowledge(prev => prev.map(item =>
        item.id === editingItem.id
          ? { ...item, ...itemData, updatedAt: new Date() } as KnowledgeItem
          : item
      ));
    } else {
      // 创建新条目
      const newItem: KnowledgeItem = {
        id: Date.now().toString(),
        title: itemData.title || '',
        content: itemData.content || '',
        type: (itemData.type as KnowledgeItem['type']) || 'faq',
        category: itemData.category || '',
        severity: itemData.severity || 'medium',
        keywords: itemData.keywords || [],
        isActive: itemData.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setKnowledge(prev => [newItem, ...prev]);
    }
    setShowEditor(false);
    setEditingItem(undefined);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingItem(undefined);
  };

  // 如果显示编辑器，渲染编辑器页面
  if (showEditor) {
    return (
      <KnowledgeEditor
        item={editingItem}
        onSave={handleSaveItem}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">知识库管理</h1>
          <p className="text-gray-600">管理敏感内容和常见问题</p>
        </div>
        <RequirePermission permission="knowledge:write">
          <Button onClick={handleCreateItem}>
            ➕ 新建知识条目
          </Button>
        </RequirePermission>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(typeLabels).map(([type, label]) => {
          const count = knowledge.filter(k => k.type === type).length;
          return (
            <Card key={type}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索标题、内容或关键词..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">所有类型</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {typeLabels[type as keyof typeof typeLabels]}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">所有分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 知识条目列表 */}
      <div className="space-y-4">
        {filteredKnowledge.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {typeLabels[item.type]}
                    </span>
                    {item.severity && (
                      <span className={`px-2 py-1 text-xs rounded ${severityColors[item.severity]}`}>
                        {severityLabels[item.severity]}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.isActive ? '启用' : '禁用'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {item.category} • {formatDate(item.updatedAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <RequirePermission permission="knowledge:write">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditItem(item)}
                    >
                      ✏️ 编辑
                    </Button>
                  </RequirePermission>
                  <Button size="sm" variant="outline">
                    📄 详情
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={item.isActive ? 'text-red-600' : 'text-green-600'}
                  >
                    {item.isActive ? '🔴 禁用' : '🟢 启用'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredKnowledge.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">没有找到匹配的知识条目</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
