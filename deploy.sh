#!/bin/bash

# Vercel 部署脚本
# 使用方法: ./deploy.sh [--prod]

set -e

echo "🚀 开始 Vercel 部署流程..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 检查是否需要代理
if [ "$1" = "--proxy" ]; then
    echo "🔧 启用代理设置..."
    export http_proxy=http://127.0.0.1:7890
    export https_proxy=http://127.0.0.1:7890
    shift
fi

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf frontend/dist
rm -rf backend/dist

# 安装依赖
echo "📦 安装项目依赖..."
pnpm run install:all

# 构建项目
echo "🔨 构建项目..."
pnpm run build

# 检查构建结果
if [ ! -d "frontend/dist" ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

if [ ! -f "backend/dist/main.js" ]; then
    echo "❌ 后端构建失败"
    exit 1
fi

echo "✅ 构建完成"

# 部署到 Vercel
if [ "$1" = "--prod" ]; then
    echo "🌍 部署到生产环境..."
    vercel --prod
else
    echo "🧪 部署到预览环境..."
    vercel
fi

echo "🎉 部署完成！"
echo "📝 查看部署状态: vercel ls"
echo "🔗 查看部署日志: vercel logs"