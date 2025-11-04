# Netlify 部署指南 - 经典游戏盒

## 🚀 快速开始

### 方法一：直接拖拽部署（最简单）
1. 访问 [netlify.com](https://netlify.com)
2. 注册/登录账号
3. 点击 "Deploy to Netlify"
4. 将 `build/web-mobile` 文件夹拖拽到部署区域

### 方法二：GitHub集成部署（推荐）
1. 在Netlify中连接你的GitHub账号
2. 选择 `FFFausty/memory-game-box` 仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`build/web-mobile`
5. 点击部署

## 📋 部署配置

### 构建设置
- **构建命令**: `npm run build`
- **发布目录**: `build/web-mobile`
- **Node版本**: 18

### 环境变量（可选）
```
NODE_VERSION=18
```

## 🌐 自定义域名

部署完成后，你可以：
1. 在Netlify设置中添加自定义域名
2. 配置SSL证书
3. 设置重定向规则

## 🔧 手动构建测试

在部署前，建议先本地测试构建：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 本地预览
npm run serve
```

## 📊 部署状态检查

部署完成后，访问你的Netlify域名检查：
- ✅ 游戏是否能正常加载
- ✅ 所有资源是否正确加载
- ✅ 响应式设计是否正常工作

## 🆘 故障排除

### 常见问题
1. **构建失败**: 检查Node版本和依赖安装
2. **资源404**: 确认发布目录设置正确
3. **白屏问题**: 检查控制台错误信息

### 技术支持
- Netlify文档: https://docs.netlify.com/
- 项目GitHub Issues: https://github.com/FFFausty/memory-game-box/issues

## 🎯 部署优势

- ✅ **全球CDN加速**
- ✅ **自动SSL证书**
- ✅ **自定义域名支持**
- ✅ **自动部署触发**
- ✅ **回滚功能**
- ✅ **性能监控**