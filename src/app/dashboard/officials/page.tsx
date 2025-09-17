'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/shared/ui';
import { formatDate, formatRelativeTime } from '@/shared/utils';
import { RequirePermission } from '@/shared/auth';

// 官员名单类型定义
interface OfficialList {
  id: string;
  name: string;
  description: string;
  content: string;
  lastUpdated: Date;
  updatedBy: string;
  isActive: boolean;
}

// 模拟数据 - 改为文本形式的名单
const mockOfficialLists: OfficialList[] = [
  {
    id: '1',
    name: '立法会议员名单',
    description: '香港特别行政区立法会议员完整名单',
    content: `陈克勤 - 新界东选区
李慧琼 - 新界西选区
梁君彦 - 新界东选区
何君尧 - 新界南选区
容海恩 - 新界西选区
葛珮帆 - 新界东选区
郭伟强 - 九龙西选区
廖长江 - 九龙东选区
刘国勋 - 新界北选区
马逢国 - 体育、演艺、文化及出版界
田北辰 - 航运交通界
易志明 - 纺织及制衣界`,
    lastUpdated: new Date('2024-01-15T10:30:00'),
    updatedBy: '管理员',
    isActive: true,
  },
  {
    id: '2',
    name: '行政会议成员名单',
    description: '香港特别行政区行政会议成员名单',
    content: `李家超 - 行政长官
陈国基 - 政务司司长
陈茂波 - 财政司司长
邓炳强 - 保安局局长
杨润雄 - 教育局局长
卢宠茂 - 医务卫生局局长
何永贤 - 房屋局局长
孙东 - 创新科技及工业局局长`,
    lastUpdated: new Date('2024-01-14T15:20:00'),
    updatedBy: '运营专员',
    isActive: true,
  },
  {
    id: '3',
    name: '区议会主席名单',
    description: '各区区议会主席名单',
    content: `中西区区议会 - 甘乃威
湾仔区区议会 - 杨雪盈
东区区议会 - 赵家贤
南区区议会 - 司马文
油尖旺区议会 - 钟港武
深水埗区议会 - 郭振华
九龙城区议会 - 潘国华
黄大仙区议会 - 郭秀英`,
    lastUpdated: new Date('2024-01-10T09:15:00'),
    updatedBy: '数据维护员',
    isActive: false,
  },
];

export default function OfficialsPage() {
  const [officialLists, setOfficialLists] = useState<OfficialList[]>(mockOfficialLists);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingList, setEditingList] = useState<OfficialList | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // 筛选名单
  const filteredLists = officialLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 创建新名单
  const handleCreateNew = () => {
    const newList: OfficialList = {
      id: Date.now().toString(),
      name: '',
      description: '',
      content: '',
      lastUpdated: new Date(),
      updatedBy: '当前用户',
      isActive: true,
    };
    setEditingList(newList);
    setIsCreating(true);
  };

  // 编辑名单
  const handleEdit = (list: OfficialList) => {
    setEditingList({ ...list });
    setIsCreating(false);
  };

  // 保存名单
  const handleSave = async () => {
    if (!editingList || !editingList.name.trim()) {
      alert('请填写名单名称');
      return;
    }

    setSaving(true);

    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedList = {
      ...editingList,
      lastUpdated: new Date(),
      updatedBy: '当前用户',
    };

    if (isCreating) {
      setOfficialLists([updatedList, ...officialLists]);
    } else {
      setOfficialLists(officialLists.map(list =>
        list.id === editingList.id ? updatedList : list
      ));
    }

    setSaving(false);
    setEditingList(null);
    setIsCreating(false);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingList(null);
    setIsCreating(false);
  };

  // 切换激活状态
  const handleToggleActive = (id: string) => {
    setOfficialLists(officialLists.map(list =>
      list.id === id ? { ...list, isActive: !list.isActive } : list
    ));
  };

  // 删除名单
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个名单吗？')) {
      setOfficialLists(officialLists.filter(list => list.id !== id));
    }
  };

  // 如果正在编辑，显示编辑界面
  if (editingList) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isCreating ? '创建新名单' : '编辑名单'}
            </h1>
            <p className="text-gray-600">
              {isCreating ? '创建一个新的官员名单' : '编辑现有的官员名单'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* 名单基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  名单名称 *
                </label>
                <Input
                  value={editingList.name}
                  onChange={(e) => setEditingList({
                    ...editingList,
                    name: e.target.value
                  })}
                  placeholder="例如：立法会议员名单"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingList.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditingList({
                    ...editingList,
                    isActive: e.target.value === 'active'
                  })}
                >
                  <option value="active">启用</option>
                  <option value="inactive">禁用</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <Input
                value={editingList.description}
                onChange={(e) => setEditingList({
                  ...editingList,
                  description: e.target.value
                })}
                placeholder="简要描述这个名单的用途"
              />
            </div>

            {/* 名单内容编辑 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                名单内容
              </label>
              <div className="text-sm text-gray-600 mb-2">
                💡 每行一个条目，格式：姓名 - 职位/选区/部门
              </div>
              <textarea
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                value={editingList.content}
                onChange={(e) => setEditingList({
                  ...editingList,
                  content: e.target.value
                })}
                placeholder={`陈克勤 - 新界东选区
李慧琼 - 新界西选区
梁君彦 - 新界东选区
何君尧 - 新界南选区`}
              />
              <div className="text-xs text-gray-500 mt-1">
                行数: {editingList.content.split('\n').filter(line => line.trim()).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">官员名单管理</h1>
          <p className="text-gray-600">管理各类官员名单，支持文本编辑模式</p>
        </div>
        <div className="flex gap-2">
          <RequirePermission permission="officials:write">
            <Button onClick={handleCreateNew}>
              ➕ 新建名单
            </Button>
          </RequirePermission>
        </div>
      </div>

      {/* 统计信息 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{officialLists.length}</p>
              <p className="text-sm text-gray-600">总名单数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {officialLists.filter(list => list.isActive).length}
              </p>
              <p className="text-sm text-gray-600">启用中</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {officialLists.reduce((total, list) =>
                  total + list.content.split('\n').filter(line => line.trim()).length, 0
                )}
              </p>
              <p className="text-sm text-gray-600">总条目数</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索 */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="搜索名单名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* 名单列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLists.map((list) => (
          <Card key={list.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {list.name}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      list.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {list.isActive ? '启用' : '禁用'}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 名单预览 */}
              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <div className="text-xs text-gray-500 mb-2">内容预览:</div>
                <div className="font-mono text-xs text-gray-700 max-h-32 overflow-y-auto">
                  {list.content.split('\n').slice(0, 6).map((line, index) => (
                    <div key={index} className="truncate">
                      {line || <span className="text-gray-400">（空行）</span>}
                    </div>
                  ))}
                  {list.content.split('\n').length > 6 && (
                    <div className="text-gray-400 text-center mt-1">
                      ... 还有 {list.content.split('\n').length - 6} 行
                    </div>
                  )}
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>
                  条目数: {list.content.split('\n').filter(line => line.trim()).length}
                </span>
                <span>
                  更新: {formatRelativeTime(list.lastUpdated)}
                </span>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <RequirePermission permission="officials:write">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(list)}
                    className="flex-1"
                  >
                    ✏️ 编辑
                  </Button>
                </RequirePermission>
                <RequirePermission permission="officials:write">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(list.id)}
                  >
                    {list.isActive ? '禁用' : '启用'}
                  </Button>
                </RequirePermission>
                <RequirePermission permission="officials:delete">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(list.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    🗑️
                  </Button>
                </RequirePermission>
              </div>

              {/* 更新信息 */}
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                最后更新: {formatDate(list.lastUpdated)} by {list.updatedBy}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLists.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? '没有找到匹配的名单' : '暂无名单，点击"新建名单"开始创建'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
