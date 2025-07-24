# IP地理位置查询应用

一个现代化的IP地理位置查询应用，使用React + Antd作为前端，Nest.js作为后端，支持地图可视化展示。

## 功能特性

- 🌍 IP地理位置查询
- 📍 当前IP位置获取
- 🗺️ 交互式地图展示
- 📱 响应式设计
- 🎨 现代化UI界面
- ⚡ 快速查询响应

## 技术栈

### 前端
- React 19
- TypeScript
- Ant Design
- Leaflet (地图)
- Vite
- Axios

### 后端
- Nest.js
- TypeScript
- Axios
- ip-api.com (IP地理位置API)

## 快速开始

### 安装依赖

```bash
# 安装所有依赖
pnpm run install:all

# 或者分别安装
pnpm install
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 开发模式

```bash
# 同时启动前后端开发服务器
pnpm run dev

# 或者分别启动
pnpm run dev:frontend  # 前端: http://localhost:5173
pnpm run dev:backend   # 后端: http://localhost:3001
```

### 构建生产版本

```bash
# 构建前后端
pnpm run build

# 或者分别构建
pnpm run build:frontend
pnpm run build:backend
```

### 生产环境运行

```bash
pnpm run start
```

## 项目结构

```
ipGet/
├── frontend/          # React前端应用
│   ├── src/
│   │   ├── components/
│   │   │   └── MapComponent.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
├── backend/           # Nest.js后端应用
│   ├── src/
│   │   ├── ip-location.controller.ts
│   │   ├── ip-location.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── package.json       # 根目录package.json
└── README.md
```

## API接口

### 获取当前IP位置
```
GET /api/ip-location/current
```

### 查询指定IP位置
```
GET /api/ip-location/query?ip=8.8.8.8
```

### 响应格式
```json
{
  "ip": "8.8.8.8",
  "country": "United States",
  "region": "California",
  "city": "Mountain View",
  "latitude": 37.4056,
  "longitude": -122.0775,
  "timezone": "America/Los_Angeles",
  "isp": "Google LLC"
}
```

## 部署到Vercel

### 前端部署

1. 在Vercel中创建新项目
2. 连接到你的GitHub仓库
3. 设置构建配置：
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`

### 后端部署

1. 在Vercel中创建另一个项目用于后端
2. 设置构建配置：
   - Framework Preset: `Other`
   - Root Directory: `backend`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`

3. 添加vercel.json配置文件到backend目录：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

4. 更新前端的API_BASE_URL为后端的Vercel URL

## 环境变量

### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:3001
```

### 后端 (.env)
```
PORT=3001
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！