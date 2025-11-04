const fs = require('fs');
const path = require('path');

// 修复损坏的图片文件
function fixCorruptedImages() {
    const buildPath = path.join(__dirname, 'build', 'web-mobile');
    
    // 检查构建目录是否存在
    if (!fs.existsSync(buildPath)) {
        console.log('构建目录不存在，请先构建项目');
        return;
    }
    
    // 需要修复的图片文件列表（从错误日志中提取）
    const corruptedImages = [
        'assets/main/native/7d/7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca.png',
        'assets/main/native/f9/f9072922-9406-467a-b2d2-151d8756cbd0.png'
    ];
    
    let fixedCount = 0;
    
    corruptedImages.forEach(imagePath => {
        const fullPath = path.join(buildPath, imagePath);
        
        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            
            // 如果文件太小（小于100字节），可能是损坏的
            if (stats.size < 100) {
                console.log(`修复损坏的图片: ${imagePath} (大小: ${stats.size} bytes)`);
                
                // 删除损坏的文件
                fs.unlinkSync(fullPath);
                
                // 创建一个空的占位文件（构建时会重新生成）
                fs.writeFileSync(fullPath, '');
                
                fixedCount++;
            }
        }
    });
    
    console.log(`修复完成: ${fixedCount} 个文件已处理`);
}

// 运行修复
fixCorruptedImages();