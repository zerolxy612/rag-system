# RAG 管理系统

基于 Next.js 15 + React 18 + TypeScript 构建的智能问答内容管理平台。

## 🚀 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **开发工具**: Turbopack (开发模式)
- **代码规范**: ESLint

## 📁 项目结构

```
src/
├── app/                   # Next.js App Router
│   ├── (auth)/           # 认证相关页面
│   │   └── login/        # 登录页面
│   └── (dashboard)/      # 仪表板布局
│       ├── prompts/      # Prompt 管理
│       ├── officials/    # 官员名单管理
│       ├── knowledge/    # 知识库管理
│       └── audit/        # 审计日志
├── entities/             # 基础实体类型定义
├── features/             # 功能模块
│   ├── prompt-editor/    # Prompt 编辑器 (含 Monaco、变量插值、测试面板)
│   ├── versioning/       # 版本管理 (草稿/发布/回滚/对比)
│   ├── officials-sync/   # 官员信息同步
│   └── knowledge-crud/   # 知识库 CRUD
└── shared/               # 共享资源
    ├── api/              # API 封装 (fetcher、Query keys、服务)
    ├── ui/               # 通用 UI 组件
    ├── hooks/            # 自定义 Hooks
    └── utils/            # 工具函数
```

## 🎯 核心功能

### 1. Prompt 管理
- ✅ Prompt 模板的创建、编辑、删除
- ✅ 变量插值支持 ({{变量名}} 格式)
- ✅ 实时预览和测试面板
- ✅ 分类和标签管理
- ✅ 版本控制和发布流程

### 2. 官员名单管理
- ✅ 官员信息的增删改查
- ✅ 一键同步官方数据源
- ✅ 按部门、级别筛选
- ✅ 同步状态监控

### 3. 知识库管理
- ✅ 敏感内容和常见问题维护
- ✅ 按类型、严重程度分类
- ✅ 关键词搜索和匹配
- ✅ 启用/禁用状态管理

### 4. 版本管理
- ✅ 完整的版本历史记录
- ✅ 版本对比功能
- ✅ 一键回滚操作
- ✅ 变更详情追踪

### 5. 审计日志
- ✅ 所有操作的详细记录
- ✅ 用户行为追踪
- ✅ 操作统计和分析
- ✅ 日志搜索和筛选

## 🛠️ 开发指南

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

## 🎨 设计系统

### UI 组件
- `Button` - 按钮组件，支持多种变体和状态
- `Input` - 输入框组件，支持标签和错误提示
- `Card` - 卡片容器组件
- 更多组件持续添加中...

### 工具函数
- 日期格式化 (`formatDate`, `formatRelativeTime`)
- 表单验证 (`validateForm`, `commonRules`)
- 防抖节流 (`debounce`, `throttle`)
- 深拷贝和其他实用工具

### 自定义 Hooks
- `useLocalStorage` - 本地存储管理
- `useDebounce` - 防抖处理
- `useToggle` - 状态切换

## 📋 待实现功能

- [ ] 用户认证和权限管理
- [ ] Monaco Editor 集成 (代码编辑器)
- [ ] React Query 数据管理
- [ ] 国际化支持
- [ ] 主题切换 (明暗模式)
- [ ] 移动端适配优化
- [ ] 单元测试覆盖
- [ ] API 接口集成
- [ ] 数据持久化

## 🚀 部署

推荐使用 [Vercel](https://vercel.com) 进行部署：

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

## 📄 许可证

MIT License
