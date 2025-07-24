# Vercel 部署指南

## 部署策略

本项目采用 **前后端一体化部署** 策略，在单个 Vercel 项目中同时部署前端和后端。

### 架构说明

- **前端**: React + Vite 应用，部署为静态文件
- **后端**: NestJS API，部署为 Serverless Functions
- **路由**: 通过 Vercel 路由配置实现前后端分离

## 部署配置

### 1. Vercel 配置文件

项目根目录的 `vercel.json` 配置了：
- 前端构建：使用 `@vercel/static-build`
- 后端构建：使用 `@vercel/node`
- 路由规则：`/api/*` 路由到后端，其他路由到前端

### 2. 环境变量

- **开发环境**: 使用 `VITE_API_BASE_URL=http://localhost:3001`
- **生产环境**: 自动使用相对路径，无需配置

### 3. 构建命令

```bash
# 安装依赖
pnpm run install:all

# 构建项目
pnpm run build
```

## 部署步骤

### 方式一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
vercel
```

### 方式二：通过 GitHub 集成

1. 将代码推送到 GitHub
2. 在 Vercel 控制台导入 GitHub 仓库
3. Vercel 会自动检测配置并部署

## 网络配置

### Proxy 设置

**Vercel 部署不需要 proxy**，因为：
- Vercel 的 Serverless Functions 运行在全球边缘网络
- 自动处理 CORS 和网络请求
- 内置 CDN 加速

### API 路由

- 前端页面：`https://your-app.vercel.app/`
- API 接口：`https://your-app.vercel.app/api/ip-location/*`

## 注意事项

1. **构建顺序**：先构建前端，再构建后端
2. **环境变量**：生产环境会自动使用相对路径调用 API
3. **文件大小**：Serverless Functions 有 50MB 限制
4. **冷启动**：首次请求可能有轻微延迟

## 监控和调试

- 使用 Vercel 控制台查看部署日志
- 通过 Functions 标签页监控 API 性能
- 查看 Analytics 了解访问情况

## 成本优化

- Hobby 计划：免费，适合个人项目
- Pro 计划：$20/月，适合商业项目
- 无需额外的服务器成本