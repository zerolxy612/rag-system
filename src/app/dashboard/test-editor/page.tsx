'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';

// 动态导入 Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
        <div className="text-gray-500">加载编辑器中...</div>
      </div>
    )
  }
);

export default function TestEditorPage() {
  const [content, setContent] = useState('你是一个专业的{{role}}，请根据以下要求：\n\n{{requirements}}\n\n请提供详细的回答。');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('Monaco Editor mounted successfully!');
    console.log('Editor:', editor);
    console.log('Monaco:', monaco);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Monaco Editor 测试</h1>
        <Button onClick={() => console.log('Current content:', content)}>
          打印内容
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>编辑器测试</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <MonacoEditor
              height="300px"
              defaultLanguage="text"
              value={content}
              onChange={handleEditorChange}
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
          
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">当前内容:</h4>
            <pre className="text-sm whitespace-pre-wrap">{content}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
