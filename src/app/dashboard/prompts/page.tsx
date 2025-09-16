'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate } from '@/shared/utils';
import { RequirePermission } from '@/shared/auth';

// 模拟数据
const mockPrompts = [
  {
    id: '1',
    title: '客服回复模板',
    content: '您好，感谢您的咨询。关于{{问题类型}}，我们的建议是{{解决方案}}。',
    category: '客服',
    tags: ['客服', '回复'],
    version: 1,
    status: 'published' as const,
    authorId: 'user1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: '政策解读模板',
    content: '根据{{政策名称}}的相关规定，{{具体条款}}。详细信息请参考{{参考链接}}。',
    category: '政策',
    tags: ['政策', '解读'],
    version: 2,
    status: 'draft' as const,
    authorId: 'user2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
];

export default function PromptsPage() {
  const [prompts] = useState(mockPrompts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(prompts.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompt 管理</h1>
          <p className="text-gray-600">管理和编辑 Prompt 模板</p>
        </div>
        <RequirePermission permission="prompts:write">
          <Button>
            ➕ 新建 Prompt
          </Button>
        </RequirePermission>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索 Prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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

      {/* Prompt 列表 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{prompt.title}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  prompt.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {prompt.status === 'published' ? '已发布' : '草稿'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {prompt.content}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>v{prompt.version}</span>
                  <span>{formatDate(prompt.updatedAt)}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <RequirePermission permission="prompts:write">
                    <Button size="sm" variant="outline" className="flex-1">
                      编辑
                    </Button>
                  </RequirePermission>
                  <Button size="sm" variant="outline">
                    测试
                  </Button>
                  <Button size="sm" variant="outline">
                    版本
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">没有找到匹配的 Prompt</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
