# 经典游戏盒 - 手动构建指南

由于本地环境缺少Cocos Creator CLI，请按照以下步骤在GitHub Actions中自动构建：

## 步骤1：推送代码到GitHub

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "feat: 初始化经典游戏盒项目"

# 设置远程仓库
git remote add origin https://github.com/FFFausty/memory-game-box.git

# 推送代码
git branch -M main
git push -u origin main
```

## 步骤2：在GitHub中启用GitHub Pages

1. 访问 https://github.com/FFFausty/memory-game-box
2. 进入 Settings → Pages
3. 选择 Source: "GitHub Actions"
4. 保存设置

## 步骤3：等待自动构建

GitHub Actions会自动：
- 安装Cocos Creator CLI
- 构建WebGL版本
- 部署到GitHub Pages

## 步骤4：访问游戏

构建完成后，访问：
https://fffausty.github.io/memory-game-box/

## 手动构建（可选）

如果你有Cocos Creator环境：
```bash
# 安装Cocos Creator CLI
npm install -g cocos-creator-cli

# 构建项目
npm run build

# 本地预览
npm run serve
```

## 项目结构说明

- `assets/` - 游戏资源文件
- `build-config.json` - 构建配置
- `.github/workflows/deploy.yml` - 自动部署配置
- `DEPLOYMENT-GUIDE.md` - 详细部署指南