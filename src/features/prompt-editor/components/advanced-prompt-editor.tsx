'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import type { Prompt, PromptVariable } from '@/entities';

// 动态导入 Monaco Editor 以避免 SSR 问题
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-80 bg-gray-100 rounded-md flex items-center justify-center">
        <div className="text-gray-500">加载编辑器中...</div>
      </div>
    )
  }
);

interface AdvancedPromptEditorProps {
  prompt?: Partial<Prompt>;
  onSave: (prompt: Partial<Prompt>) => void;
  onCancel: () => void;
  onTest?: (content: string, variables: Record<string, string>) => Promise<string>;
}

export function AdvancedPromptEditor({ 
  prompt, 
  onSave, 
  onCancel, 
  onTest 
}: AdvancedPromptEditorProps) {
  const [formData, setFormData] = useState({
    title: prompt?.title || '',
    content: prompt?.content || '',
    category: prompt?.category || '',
    tags: prompt?.tags?.join(', ') || '',
    variables: prompt?.variables || [],
  });

  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const editorRef = useRef<unknown>(null);

  // 解析内容中的变量
  const parseVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\w+)\}\}/g);
    return matches ? [...new Set(matches.map(match => match.slice(2, -2)))] : [];
  };

  // 验证 Prompt 内容
  const validatePrompt = (text: string): string[] => {
    const errors: string[] = [];
    const detectedVars = parseVariables(text);
    const definedVars = formData.variables.map(v => v.name);
    
    // 检查未定义的变量
    const undefinedVars = detectedVars.filter(v => !definedVars.includes(v));
    if (undefinedVars.length > 0) {
      errors.push(`未定义的变量: ${undefinedVars.join(', ')}`);
    }
    
    // 检查嵌套变量
    const nestedMatches = text.match(/\{\{[^}]*\{\{|\}\}[^{]*\}\}/g);
    if (nestedMatches) {
      errors.push('检测到嵌套变量，请检查语法');
    }
    
    return errors;
  };

  // 生成预览内容
  const generatePreview = () => {
    let previewText = formData.content;
    const missingVars: string[] = [];
    
    formData.variables.forEach(variable => {
      const value = testValues[variable.name];
      if (value !== undefined && value !== '') {
        const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
        previewText = previewText.replace(regex, String(value));
      } else if (variable.required) {
        missingVars.push(variable.name);
      }
    });
    
    if (missingVars.length > 0) {
      setPreview(`⚠️ 缺少必填变量: ${missingVars.join(', ')}\n\n${previewText}`);
    } else {
      setPreview(previewText);
    }
  };

  const handleContentChange = (newContent: string | undefined) => {
    if (newContent === undefined) return;
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // 验证内容
    const validationErrors = validatePrompt(newContent);
    setErrors(validationErrors);
    
    // 自动检测新变量
    const detectedVars = parseVariables(newContent);
    const existingVarNames = formData.variables.map(v => v.name);
    
    const newVariables = detectedVars
      .filter(varName => !existingVarNames.includes(varName))
      .map(varName => ({
        name: varName,
        type: 'string' as const,
        description: '',
        required: true,
      }));
    
    if (newVariables.length > 0) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, ...newVariables]
      }));
    }
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleVariableChange = (index: number, field: keyof PromptVariable, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.map((variable, i) => 
        i === index ? { ...variable, [field]: value } : variable
      )
    }));
  };

  const handleTestValueChange = (varName: string, value: string) => {
    setTestValues(prev => ({ ...prev, [varName]: value }));
  };

  const handleRemoveVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const handleTest = async () => {
    if (!onTest) {
      // 如果没有测试函数，只生成预览
      generatePreview();
      return;
    }
    
    setIsTestLoading(true);
    try {
      const result = await onTest(formData.content, testValues);
      setTestResult(result);
    } catch (error) {
      setTestResult(`测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSave = () => {
    const promptData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    onSave(promptData);
  };

  const handleEditorDidMount = (editor: unknown) => {
    editorRef.current = editor;
    // 编辑器挂载成功，不需要额外配置
    console.log('Monaco Editor mounted successfully');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {prompt?.id ? '编辑 Prompt' : '新建 Prompt'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={errors.length > 0}>
            💾 保存
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium mb-2">验证错误:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 编辑器区域 */}
        <div className="xl:col-span-2 space-y-4">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="标签，用逗号分隔"
              />
            </CardContent>
          </Card>

          {/* Monaco 编辑器 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prompt 编辑器</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={generatePreview}
                  >
                    🔍 预览
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <MonacoEditor
                  height="400px"
                  defaultLanguage="text"
                  value={formData.content}
                  onChange={handleContentChange}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    folding: false,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    cursorStyle: 'line',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  }}
                />
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 使用 <code className="bg-gray-100 px-1 rounded">{'{{变量名}}'}</code> 格式定义变量</p>
                <p>📝 变量会自动检测并添加到变量管理中</p>
              </div>
            </CardContent>
          </Card>

          {/* 预览区域 */}
          <Card>
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border rounded-md p-4 min-h-32 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {preview || '点击"预览"按钮查看变量替换效果'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-4">
          {/* 变量管理 */}
          <Card>
            <CardHeader>
              <CardTitle>变量管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 现有变量列表 */}
              {formData.variables.length > 0 ? (
                <div className="space-y-3">
                  {formData.variables.map((variable, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Input
                            label="变量名"
                            value={variable.name}
                            onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                            className="mb-2"
                          />
                          <select
                            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={variable.type}
                            onChange={(e) => handleVariableChange(index, 'type', e.target.value)}
                          >
                            <option value="string">文本</option>
                            <option value="number">数字</option>
                            <option value="boolean">布尔值</option>
                            <option value="array">数组</option>
                          </select>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveVariable(index)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      </div>

                      <Input
                        label="描述"
                        value={variable.description}
                        onChange={(e) => handleVariableChange(index, 'description', e.target.value)}
                        placeholder="变量用途说明"
                        className="mb-2"
                      />

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={variable.required}
                          onChange={(e) => handleVariableChange(index, 'required', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-600">必填字段</label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  在 Prompt 中使用 {`{{变量名}}`} 格式会自动检测变量
                </p>
              )}
            </CardContent>
          </Card>

          {/* 测试面板 */}
          <Card>
            <CardHeader>
              <CardTitle>测试面板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  为变量输入测试值来预览最终效果
                </p>

                {formData.variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable.name}
                      {variable.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <Input
                      value={testValues[variable.name] || ''}
                      onChange={(e) => handleTestValueChange(variable.name, e.target.value)}
                      placeholder={variable.description || `输入 ${variable.name} 的值`}
                    />
                  </div>
                ))}

                <Button
                  className="w-full mt-4"
                  onClick={handleTest}
                  disabled={isTestLoading || formData.variables.some(v => v.required && !testValues[v.name])}
                >
                  {isTestLoading ? '🔄 测试中...' : '🧪 测试 Prompt'}
                </Button>

                {/* 测试结果 */}
                {testResult && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">测试结果:</h4>
                    <div className="bg-gray-50 border rounded-md p-3 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {testResult}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const template = "你是一个专业的{{role}}，请根据以下要求：\n\n{{requirements}}\n\n请提供详细的回答。";
                  setFormData(prev => ({ ...prev, content: template }));
                }}
              >
                📝 插入角色模板
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const template = "请分析以下内容：\n\n{{content}}\n\n从以下角度进行分析：\n1. {{aspect1}}\n2. {{aspect2}}\n3. {{aspect3}}";
                  setFormData(prev => ({ ...prev, content: template }));
                }}
              >
                🔍 插入分析模板
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const template = "请将以下{{source_language}}文本翻译成{{target_language}}：\n\n{{text}}\n\n要求：\n- 保持原意\n- 语言自然流畅\n- 符合{{target_language}}表达习惯";
                  setFormData(prev => ({ ...prev, content: template }));
                }}
              >
                🌐 插入翻译模板
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
