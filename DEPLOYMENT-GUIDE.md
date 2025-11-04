# 经典游戏盒 - 部署指南

## 🎯 项目概述

这是一个基于Cocos Creator 3.8.7开发的经典游戏合集，包含神经衰弱记忆游戏等多款经典游戏，支持WebGL、微信小程序和移动端部署。

## 📦 项目打包

### 方法一：使用部署脚本（推荐）

```bash
# 进入项目目录
cd c:\Users\Faust\source\game2-demo

# 运行部署脚本
node deploy-script.js
```

### 方法二：手动构建

```bash
# 安装依赖
npm install

# 构建WebGL版本
npm run build

# 本地预览
npm run serve
```

## 🌐 Web端部署选项

### 1. GitHub Pages（推荐）

**步骤：**
1. 在GitHub创建新仓库：`memory-game-neuro`
2. 推送代码到GitHub：
```bash
git init
git add .
git commit -m "Initial commit: Memory Game Neuro"
git branch -M main
git remote add origin https://github.com/your-username/memory-game-neuro.git
git push -u origin main
```
3. 在仓库设置中启用GitHub Pages，选择`gh-pages`分支
4. 访问地址：`https://your-username.github.io/memory-game-neuro`

### 2. Netlify部署

**步骤：**
1. 访问 [netlify.com](https://netlify.com)
2. 拖拽`build/web-mobile`文件夹到部署区域
3. 自动生成访问地址

### 3. Vercel部署

**步骤：**
1. 访问 [vercel.com](https://vercel.com)
2. 连接GitHub仓库
3. 自动部署，每次推送代码自动更新

### 4. 腾讯云Cloud Studio部署

**步骤：**
1. 确保已安装Cocos Creator CLI工具
2. 使用Cloud Studio的自动部署功能
3. 配置构建命令：`npm run build`
4. 设置发布目录：`build/web-mobile`

## 🔧 技术配置

### 构建配置
- **平台**: WebGL (web-mobile)
- **入口场景**: MainMenu.scene
- **分辨率**: 自适应横屏
- **压缩**: 启用MD5缓存

### 文件结构
```
build/web-mobile/
├── index.html          # 入口文件
├── main.js            # 游戏主逻辑
├── style.css          # 样式文件
├── src/               # 游戏资源
└── res/               # 静态资源
```

## 📱 多平台适配

### WebGL版本特性
- ✅ 支持现代浏览器
- ✅ 响应式设计
- ✅ 触摸屏支持
- ✅ 键盘快捷键

### 移动端优化
- 📱 触摸操作优化
- 📱 性能自适应
- 📱 横屏显示

## 🚀 快速部署命令

```bash
# 一键部署到GitHub Pages
git add .
git commit -m "Deploy memory game"
git push origin main

# 本地测试
npm run preview
```

## 🔍 部署检查清单

- [ ] 项目构建成功
- [ ] 本地预览正常
- [ ] 所有资源加载正常
- [ ] 游戏逻辑运行正常
- [ ] 移动端适配测试
- [ ] 性能优化完成

## 📞 技术支持

如遇部署问题，请检查：
1. Node.js版本 >= 14.0.0
2. Cocos Creator CLI工具已安装
3. 网络连接正常
4. 文件权限正确

## 📄 许可证

MIT License - 可自由部署和使用

---

**最后更新**: 2025-11-04  
**版本**: v1.0.0