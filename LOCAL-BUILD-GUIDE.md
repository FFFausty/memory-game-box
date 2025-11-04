# 经典游戏盒 - 本地构建详细步骤

## 第一步：安装Cocos Creator

### 1.1 下载Cocos Dashboard
- 访问 [Cocos官网](https://www.cocos.com/)
- 下载Cocos Dashboard安装程序
- 安装并启动Cocos Dashboard

### 1.2 安装Cocos Creator 3.8.7
- 在Dashboard中选择"编辑器"标签
- 点击"安装编辑器"
- 选择版本：**3.8.7**（确保与项目版本匹配）
- 等待安装完成

## 第二步：打开项目

### 2.1 在Cocos Creator中打开项目
- 启动Cocos Creator 3.8.7
- 点击"打开项目"
- 选择项目目录：`c:\Users\Faust\source\game2-demo`
- 等待项目加载完成

### 2.2 验证项目配置
- 检查编辑器右下角版本号是否为3.8.7
- 确认项目资源正常加载
- 检查控制台是否有错误信息

## 第三步：构建项目

### 3.1 配置构建参数
- 点击顶部菜单：**项目(Project) → 构建(Build)**
- 在构建面板中设置：
  - **发布平台(Platform)**：Web Mobile
  - **构建路径(Build Path)**：`build/web-mobile`
  - **游戏名称(Title)**：经典游戏盒
  - **屏幕方向(Orientation)**：Landscape

### 3.2 开始构建
- 点击**构建(Build)**按钮
- 等待构建过程完成（通常需要1-5分钟）
- 构建完成后会在控制台显示"Build finished"

## 第四步：测试本地构建结果

### 4.1 本地预览
```bash
# 在项目根目录打开命令行
cd c:\Users\Faust\source\game2-demo

# 启动本地服务器预览
npm run serve
```

### 4.2 浏览器测试
- 打开浏览器访问：`http://localhost:8080`
- 测试游戏功能是否正常
- 检查控制台是否有错误

## 第五步：准备部署文件

### 5.1 检查构建结果
- 构建完成后会生成`build/web-mobile`目录
- 确认目录包含以下关键文件：
  - `index.html` - 主页面
  - `main.js` - 主程序
  - `src`目录 - 游戏资源
  - `res`目录 - 资源文件

### 5.2 验证构建完整性
- 确保所有游戏资源正确加载
- 测试游戏所有功能
- 检查移动端适配情况

## 第六步：部署到Vercel

### 6.1 上传构建结果
- 将`build/web-mobile`目录推送到Git仓库
- 或者直接上传到Vercel的部署界面

### 6.2 Vercel配置
- 在Vercel中选择部署目录：`build/web-mobile`
- Framework Preset选择：**Other**
- 构建命令留空（因为已经本地构建完成）
- 输出目录：`build/web-mobile`

## 常见问题解决

### 构建失败
- **问题**：构建过程中出现错误
- **解决**：检查控制台错误信息，通常是资源路径问题

### 资源加载失败
- **问题**：游戏可以打开但资源显示异常
- **解决**：检查构建配置中的资源路径设置

### 版本不匹配
- **问题**：Cocos Creator版本与项目不匹配
- **解决**：确保使用3.8.7版本，或更新项目配置

## 构建配置说明

当前项目使用以下构建配置（`build-config.json`）：
```json
{
  "buildPath": "build/web-mobile",
  "platform": "web-mobile", 
  "title": "经典游戏盒",
  "webOrientation": "landscape",
  "startScene": "db://assets/MainMenu.scene"
}
```

## 多平台构建（可选）

### 微信小程序构建
```bash
# 如果需要构建小程序版本
npm run build:wechat
```

### 调试版本构建
```bash
# 构建带调试信息的版本
npm run build:debug
```

## 注意事项

1. **版本一致性**：确保本地Cocos Creator版本与项目配置一致
2. **资源完整性**：构建前确认所有游戏资源已正确导入
3. **测试充分**：本地测试通过后再部署到生产环境
4. **备份重要**：构建前建议备份重要文件

## 技术支持

如果遇到问题，可以：
- 查看Cocos Creator官方文档
- 检查项目中的错误日志
- 在Cocos社区寻求帮助