'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { useAuth, USERS } from '@/shared/auth';

interface LoginForm {
  usernameOrEmail: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState<LoginForm>({
    usernameOrEmail: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<keyof LoginForm, string | null>>({
    usernameOrEmail: null,
    password: null,
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // 如果已登录，重定向到仪表板
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    // 清除错误信息
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }

    // 清除登录错误
    if (loginError) {
      setLoginError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 简单验证
    const newErrors: Record<keyof LoginForm, string | null> = {
      usernameOrEmail: null,
      password: null,
    };

    if (!form.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = '请输入用户名或邮箱';
    }

    if (!form.password.trim()) {
      newErrors.password = '请输入密码';
    }

    if (newErrors.usernameOrEmail || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setLoginError(null);

    try {
      const result = await login(form.usernameOrEmail, form.password);

      if (result.success) {
        // 登录成功，重定向到仪表板
        router.push('/dashboard');
      } else {
        setLoginError(result.error || '登录失败');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('登录过程中发生错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <Input
              label="用户名或邮箱"
              type="text"
              value={form.usernameOrEmail}
              onChange={handleInputChange('usernameOrEmail')}
              error={errors.usernameOrEmail || undefined}
              placeholder="请输入用户名或邮箱地址"
            />

            <Input
              label="密码"
              type="password"
              value={form.password}
              onChange={handleInputChange('password')}
              error={errors.password || undefined}
              placeholder="请输入密码"
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              登录
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 测试账号信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">测试账号</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              您可以使用以下任一账号进行登录测试：
            </p>

            {USERS.map((user) => (
              <div
                key={user.id}
                className="p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setForm({
                    usernameOrEmail: user.username,
                    password: user.password,
                  });
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.username} / {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-700">{user.username}</p>
                    <p className="text-sm font-mono text-gray-700">{user.password}</p>
                  </div>
                </div>
              </div>
            ))}

            <p className="text-xs text-gray-500 mt-3">
              💡 点击任一账号卡片可自动填充登录信息
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
