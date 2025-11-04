const fs = require('fs');
const path = require('path');

// 修复图像配置文件
function fixImageConfigs() {
    const buildDir = path.join(__dirname, 'build', 'web-mobile');
    const assetsDir = path.join(buildDir, 'assets', 'main', 'import');
    
    // 获取所有需要修复的JSON文件
    const filesToFix = [
        // WebP文件 (fmt=4)
        { file: path.join(assetsDir, '8a', '8accd683-4976-4371-905e-c7b279dfbe56.json'), width: 480, height: 480 },
        { file: path.join(assetsDir, 'cc', 'cc0678fb-867e-4f9c-ba72-23d0266e5d6f.json'), width: 480, height: 480 },
        { file: path.join(assetsDir, '91', '91497063-bc4e-4c2f-9201-96714e1bf7bb.json'), width: 480, height: 480 },
        
        // PNG文件 (fmt=0) - 根据实际图像尺寸修复
        { file: path.join(assetsDir, '0f', '0f49b437-c0a2-424f-9769-3e3feb54767c.json'), width: 1040, height: 1040 },
        { file: path.join(assetsDir, '14', '14dee062-aa44-493f-9329-1d1599311d5e.json'), width: 1992, height: 1992 },
        { file: path.join(assetsDir, '16', '162aacc3-df76-4119-b28c-88c3ef9fb06f.json'), width: 95, height: 95 },
        { file: path.join(assetsDir, '20', '20835ba4-6145-4fbc-a58a-051ce700aa3e.json'), width: 11, height: 11 },
        { file: path.join(assetsDir, '27', '27872f08-8193-41db-9453-f29c9dad973a.json'), width: 122, height: 122 },
        { file: path.join(assetsDir, '47', '47cbe4d8-84c8-4ebf-a316-f75fb957a9f8.json'), width: 1066, height: 1066 },
        { file: path.join(assetsDir, '4b', '4bdca58d-33d9-48d9-9e59-1c30c5468203.json'), width: 1106, height: 1106 },
        { file: path.join(assetsDir, '50', '5099da7c-f066-40bb-b1dc-8f20de93ffb9.json'), width: 59, height: 59 },
        { file: path.join(assetsDir, '54', '544e49d6-3f05-4fa8-9a9e-091f98fc2ce8.json'), width: 11, height: 11 },
        { file: path.join(assetsDir, '55', '55d70499-862e-464f-92ce-02efa8fc8248.json'), width: 1200, height: 1200 },
        { file: path.join(assetsDir, '57', '57520716-48c8-4a19-8acf-41c9f8777fb0.json'), width: 16, height: 16 },
        { file: path.join(assetsDir, '5b', '5b128e78-b732-4101-9406-913fadced2af.json'), width: 1007, height: 1007 },
        { file: path.join(assetsDir, '69', '6975870d-f09f-4ab4-9324-93e8c2cc7c2e.json'), width: 51, height: 51 },
        { file: path.join(assetsDir, '7d', '7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca.json'), width: 1, height: 1 },
        { file: path.join(assetsDir, '8a', '8ad0118b-4339-4d95-9bfb-24e34e420dcc.json'), width: 2318, height: 2318 },
        { file: path.join(assetsDir, '8c', '8c38b0fb-406a-46c8-ad2c-fb2fb67bb600.json'), width: 1167, height: 1167 },
        { file: path.join(assetsDir, '90', '902cbbde-2411-4303-8e02-3248aa853b36.json'), width: 1061, height: 1061 },
        { file: path.join(assetsDir, '95', '951249e0-9f16-456d-8b85-a6ca954da16b.json'), width: 10, height: 10 },
        { file: path.join(assetsDir, '96', '963c353d-4bcb-4be9-8ae7-030eaad3fa51.json'), width: 1123, height: 1123 },
        { file: path.join(assetsDir, 'a0', 'a031f9c6-d6a5-48aa-a7d0-256b9a1560c6.json'), width: 1844, height: 1844 },
        { file: path.join(assetsDir, 'b4', 'b488f0c8-53ba-4934-8205-36560abb0bdd.json'), width: 1081, height: 1081 },
        { file: path.join(assetsDir, 'b6', 'b67e11d8-bd87-4254-8d7c-b4707232e683.json'), width: 975, height: 975 },
        { file: path.join(assetsDir, 'b9', 'b95c263d-8418-4055-8e20-112d56557a0e.json'), width: 1130, height: 1130 },
        { file: path.join(assetsDir, 'ba', 'ba4a63f7-d12b-46d4-9eb9-19f06b6bd96d.json'), width: 433, height: 433 },
        { file: path.join(assetsDir, 'de', 'deb49c3e-5a80-4ac3-95a5-1e6181a1d82e.json'), width: 1064, height: 1064 },
        { file: path.join(assetsDir, 'eb', 'ebed1a53-2600-4879-9027-3ad3f40d7a12.json'), width: 1106, height: 1106 },
        { file: path.join(assetsDir, 'f9', 'f9072922-9406-467a-b2d2-151d8756cbd0.json'), width: 1525, height: 1525 }
    ];
    
    let fixedCount = 0;
    let errorCount = 0;
    
    filesToFix.forEach(config => {
        try {
            if (fs.existsSync(config.file)) {
                const content = fs.readFileSync(config.file, 'utf8');
                // 修复宽度和高度
                const fixedContent = content.replace(/"w":0,"h":0/g, `"w":${config.width},"h":${config.height}`);
                
                if (content !== fixedContent) {
                    fs.writeFileSync(config.file, fixedContent, 'utf8');
                    console.log(`✅ 修复: ${path.basename(config.file)} -> ${config.width}x${config.height}`);
                    fixedCount++;
                } else {
                    console.log(`ℹ️  无需修复: ${path.basename(config.file)}`);
                }
            } else {
                console.log(`❌ 文件不存在: ${config.file}`);
                errorCount++;
            }
        } catch (error) {
            console.log(`❌ 修复失败: ${path.basename(config.file)} - ${error.message}`);
            errorCount++;
        }
    });
    
    console.log(`\n📊 修复完成:`);
    console.log(`✅ 成功修复: ${fixedCount} 个文件`);
    console.log(`❌ 修复失败: ${errorCount} 个文件`);
    
    return { fixedCount, errorCount };
}

// 运行修复
fixImageConfigs();