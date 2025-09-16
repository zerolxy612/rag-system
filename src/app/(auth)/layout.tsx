import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">RAG 管理系统</h1>
          <p className="mt-2 text-sm text-gray-600">
            智能问答内容管理平台
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
