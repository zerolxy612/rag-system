'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import type { Prompt, PromptVariable } from '@/entities';

interface PromptEditorProps {
  prompt?: Partial<Prompt>;
  onSave: (prompt: Partial<Prompt>) => void;
  onCancel: () => void;
}

export function PromptEditor({ prompt, onSave, onCancel }: PromptEditorProps) {
  const [formData, setFormData] = useState({
    title: prompt?.title || '',
    content: prompt?.content || '',
    category: prompt?.category || '',
    tags: prompt?.tags?.join(', ') || '',
    variables: prompt?.variables || [],
  });

  const [newVariable, setNewVariable] = useState<Partial<PromptVariable>>({
    name: '',
    type: 'string',
    description: '',
    required: false,
  });

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddVariable = () => {
    if (!newVariable.name) return;
    
    setFormData(prev => ({
      ...prev,
      variables: [...prev.variables, newVariable as PromptVariable],
    }));
    
    setNewVariable({
      name: '',
      type: 'string',
      description: '',
      required: false,
    });
  };

  const handleRemoveVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const promptData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    onSave(promptData);
  };

  // 变量插值预览
  const renderPreview = () => {
    let preview = formData.content;
    formData.variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      const replacement = `<span class="bg-blue-100 text-blue-800 px-1 rounded">${variable.name}</span>`;
      preview = preview.replace(new RegExp(placeholder, 'g'), replacement);
    });
    return preview;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {prompt?.id ? '编辑 Prompt' : '新建 Prompt'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 编辑区域 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="标题"
                value={formData.title}
                onChange={handleInputChange('title')}
                placeholder="输入 Prompt 标题"
              />
              
              <Input
                label="分类"
                value={formData.category}
                onChange={handleInputChange('category')}
                placeholder="输入分类"
              />
              
              <Input
                label="标签"
                value={formData.tags}
                onChange={handleInputChange('tags')}
                placeholder="输入标签，用逗号分隔"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>内容编辑</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt 内容</label>
                <textarea
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.content}
                  onChange={handleInputChange('content')}
                  placeholder="输入 Prompt 内容，使用 {{变量名}} 来定义变量"
                />
                <p className="text-xs text-gray-500">
                  使用 {`{{变量名}}`} 的格式来定义可替换的变量
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>变量管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 现有变量列表 */}
              {formData.variables.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">已定义变量</h4>
                  {formData.variables.map((variable, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{variable.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({variable.type})</span>
                        {variable.required && (
                          <span className="text-xs text-red-600 ml-1">*必填</span>
                        )}
                        {variable.description && (
                          <div className="text-xs text-gray-600">{variable.description}</div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveVariable(index)}
                      >
                        删除
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* 添加新变量 */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">添加变量</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="变量名"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <select
                    className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newVariable.type}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="string">字符串</option>
                    <option value="number">数字</option>
                    <option value="boolean">布尔值</option>
                    <option value="array">数组</option>
                  </select>
                </div>
                <div className="mt-2">
                  <Input
                    placeholder="描述（可选）"
                    value={newVariable.description}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newVariable.required}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, required: e.target.checked }))}
                      className="mr-2"
                    />
                    必填字段
                  </label>
                  <Button size="sm" onClick={handleAddVariable}>
                    添加变量
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 预览区域 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">渲染效果</h4>
                  <div 
                    className="p-3 bg-gray-50 rounded border min-h-[100px]"
                    dangerouslySetInnerHTML={{ __html: renderPreview() }}
                  />
                </div>
                
                {formData.variables.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">变量列表</h4>
                    <div className="space-y-2">
                      {formData.variables.map((variable, index) => (
                        <div key={index} className="text-sm">
                          <code className="bg-blue-100 text-blue-800 px-1 rounded">
                            {`{{${variable.name}}}`}
                          </code>
                          <span className="text-gray-600 ml-2">
                            {variable.description || variable.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>测试面板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  为变量输入测试值来预览最终效果
                </p>
                {formData.variables.map((variable, index) => (
                  <Input
                    key={index}
                    label={variable.name}
                    placeholder={`输入 ${variable.name} 的值`}
                  />
                ))}
                <Button className="w-full" variant="outline">
                  🧪 测试运行
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
