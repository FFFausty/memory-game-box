#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始部署经典游戏盒...\n');

// 检查必要文件
const requiredFiles = [
  'package.json',
  'build-config.json',
  'assets/MainMenu.scene',
  'assets/GameScence.scene'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ 缺少必要文件: ${file}`);
    process.exit(1);
  }
}

console.log('✅ 项目文件检查完成');

// 安装依赖
try {
  console.log('📦 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 依赖安装失败');
  process.exit(1);
}

// 构建项目
try {
  console.log('🔨 构建WebGL版本...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 构建失败');
  process.exit(1);
}

// 检查构建结果
const buildDir = 'build/web-mobile';
if (!fs.existsSync(buildDir)) {
  console.error('❌ 构建目录不存在');
  process.exit(1);
}

console.log('✅ 构建完成');

// 创建部署说明
const deployInfo = `
🎮 经典游戏盒部署完成

📁 构建目录: ${buildDir}
🌐 本地预览: npm run serve
📊 文件大小: ${getDirectorySize(buildDir)} MB

📋 部署选项:
1. GitHub Pages: 推送到GitHub仓库并启用GitHub Pages
2. Netlify: 拖拽build/web-mobile文件夹到Netlify
3. Vercel: 连接GitHub仓库自动部署
4. 静态托管: 上传到任意静态文件服务器

🔗 访问地址: 部署后可通过相应平台提供的URL访问
`;

console.log(deployInfo);

// 保存部署信息
fs.writeFileSync('deploy-info.txt', deployInfo);
console.log('📄 部署信息已保存到 deploy-info.txt');

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  }
  
  return (size / 1024 / 1024).toFixed(2);
}