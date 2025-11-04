# Vercel 部署指南

## 概述
Vercel 是部署静态网站的最佳选择，特别适合 Cocos Creator 游戏项目。它提供：
- 无限免费构建时间
- 自动 HTTPS 和 CDN
- 全球边缘网络
- 自动 CI/CD

## 部署前准备

### 1. 项目配置检查
确保以下文件已正确配置：
- ✅ `package.json` - 包含构建脚本
- ✅ `build-config.json` - WebGL 构建配置
- ✅ `vercel.json` - Vercel 部署配置
- ✅ `tsconfig.json` - TypeScript 配置

### 2. 本地测试构建
```bash
# 清理构建目录
npm run clean

# 测试构建
npm run build

# 本地预览
npm run serve
```

## Vercel 部署步骤

### 方法一：通过 GitHub 集成（推荐）

1. **本地构建项目**
   ```bash
   # 在本地使用 Cocos Creator 构建项目
   # 确保 Cocos Creator 已安装并配置
   npm run build:debug
   ```

2. **提交构建文件到 Git**
   ```bash
   # 将构建后的文件添加到 Git
   git add build/web-mobile/
   git commit -m "添加构建文件"
   git push origin main
   ```

3. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

4. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择你的 GitHub 仓库 `FFFausty/memory-game-box`

5. **配置项目**
   - **Framework Preset**: 选择 "Other" 或留空
   - **Root Directory**: 留空（项目根目录）
   - **Build Command**: 留空（已在本地构建）
   - **Output Directory**: `build/web-mobile`

6. **部署**
   - 点击 "Deploy"
   - Vercel 会直接部署已构建的静态文件

### 方法二：通过 Vercel CLI

1. **安装 CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   # 在项目根目录执行
   vercel --prod
   ```

## 部署配置详解

### vercel.json 配置说明
```json
{
  "version": 2,
  "name": "经典游戏盒",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build/web-mobile"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**关键配置项：**
- `distDir`: 构建输出目录
- `routes`: SPA 路由配置（所有路径重定向到 index.html）
- `headers`: 安全头设置

## 构建过程

Vercel 的构建流程：
1. 克隆代码仓库
2. 安装依赖 (`npm install`)
3. 执行构建命令 (`npm run build`)
4. 部署静态文件到 CDN

## 自定义域名

部署成功后，可以绑定自定义域名：
1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS

## 环境配置

### Node.js 版本
Vercel 自动使用项目指定的 Node.js 版本：
```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### 构建缓存
Vercel 会自动缓存 `node_modules` 以加速后续构建。

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `npm run build` 在本地是否成功
   - 查看 Vercel 构建日志中的错误信息

2. **404 错误**
   - 确保 `vercel.json` 中的路由配置正确
   - 检查构建输出目录是否正确

3. **资源加载失败**
   - 确认所有资源路径使用相对路径
   - 检查构建后的文件结构

### 调试技巧

1. **本地构建测试**
   ```bash
   # 模拟 Vercel 环境
   npm install
   npm run build
   npx serve build/web-mobile
   ```

2. **查看构建日志**
   - 在 Vercel 控制台查看详细的构建日志
   - 关注警告和错误信息

## 自动部署

Vercel 支持自动部署：
- **Push 到 main/master 分支**: 自动触发部署
- **Pull Request**: 自动创建预览部署
- **手动触发**: 在控制台手动重新部署

## 性能优化

### 缓存策略
- Vercel 自动配置 CDN 缓存
- 静态资源长期缓存
- HTML 文件短期缓存

### 压缩优化
- 自动 Gzip/Brotli 压缩
- 图片优化
- 代码分割

## 监控和分析

Vercel 提供：
- 实时访问日志
- 性能监控
- 错误追踪
- 流量分析

## 与其他平台对比

| 特性 | Vercel | Netlify | GitHub Pages |
|------|--------|---------|--------------|
| 构建时间 | 无限免费 | 有限免费 | 有限免费 |
| 自动部署 | ✅ | ✅ | ✅ |
| 自定义域名 | ✅ | ✅ | ✅ |
| HTTPS | 自动 | 自动 | 自动 |
| 全球 CDN | ✅ | ✅ | ❌ |

## 总结

Vercel 是部署 Cocos Creator 游戏项目的最佳选择，提供：
- 简单易用的部署流程
- 强大的性能优化
- 完善的监控功能
- 完全免费的套餐

部署成功后，你的游戏将在全球 CDN 上运行，用户可以获得最佳的游戏体验。