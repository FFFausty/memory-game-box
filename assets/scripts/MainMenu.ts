import { _decorator, Component, Node, Sprite, Label, Button, SpriteFrame, Color, tween, Vec3, UITransform, director, ScrollView, Widget, EventTouch } from 'cc';
import { ModeSelector, GameMode } from './ModeSelector';
const { ccclass, property } = _decorator;

// 游戏入口配置
interface GameEntryConfig {
    id: string;
    title: string;
    description: string;
    icon: string;
    bgColor: Color;
}

@ccclass('MainMenu')
export class MainMenu extends Component {
    
    @property({ type: Node })
    header: Node = null!;
    
    @property({ type: Node })
    mainContent: Node = null!;
    
    @property({ type: Node })
    footer: Node = null!;
    
    @property({ type: [Node] })
    gameEntries: Node[] = [];
    
    @property({ type: Label })
    titleLabel: Label = null!;
    
    @property({ type: SpriteFrame })
    cardBackSprite: SpriteFrame = null!;
    
    @property({ type: SpriteFrame })
    cardFaceSprite: SpriteFrame = null!;
    
    @property({ type: Node })
    topLeftDecoration: Node = null!;
    
    @property({ type: Node })
    bottomRightDecoration: Node = null!;
    
    @property({ type: Node })
    recordsItem: Node = null!;
    
    @property({ type: Node })
    achievementsItem: Node = null!;
    
    @property({ type: Node })
    shopItem: Node = null!;
    
    @property({ type: Node })
    modeSelectorNode: Node = null!;
    
    private modeSelector: ModeSelector = null!;
    
    // 游戏入口配置 - 多个游戏入口
    private gameConfigs: GameEntryConfig[] = [
        {
            id: 'game1',
            title: '游戏1',
            description: '第一个游戏',
            icon: '🎮',
            bgColor: new Color(74, 107, 136, 255)
        },
        {
            id: 'game2', 
            title: '游戏2',
            description: '第二个游戏',
            icon: '🎯',
            bgColor: new Color(136, 74, 107, 255)
        }
    ];
    
    private currentSelectedGame: string = 'game1';
    
    onLoad() {
        console.log('MainMenu组件加载完成');
        
        // 初始化ModeSelector组件
        if (this.modeSelectorNode) {
            this.modeSelector = this.modeSelectorNode.getComponent(ModeSelector);
            if (!this.modeSelector) {
                console.error('ModeSelector节点缺少ModeSelector组件');
            }
        } else {
            // 尝试动态查找ModeSelector节点
            const modeSelectorNode = this.node.parent?.getChildByName('ModeSelector');
            if (modeSelectorNode) {
                this.modeSelector = modeSelectorNode.getComponent(ModeSelector);
            }
        }
        
        this.initUI();
        this.setupAnimations();
    }
    
    initUI() {
        console.log('开始初始化MainMenu UI');
        
        // 设置标题
        if (this.titleLabel) {
            this.titleLabel.string = '经典游戏盒';
            console.log('标题设置为: 经典游戏盒');
        } else {
            console.warn('标题Label组件未配置');
        }
        
        // 初始化游戏入口
        this.initGameEntries();
        
        // 设置装饰元素动画
        this.setupDecorationAnimations();
        
        // 初始化底部功能按钮
        this.setupFooterButtons();
        
        console.log('MainMenu UI初始化完成');
    }
    
    initGameEntries() {
        console.log('开始初始化游戏入口');
        console.log(`游戏配置数量: ${this.gameConfigs.length}, 游戏入口数量: ${this.gameEntries.length}`);
        
        this.gameEntries.forEach((entryNode, index) => {
            if (index < this.gameConfigs.length) {
                const config = this.gameConfigs[index];
                console.log(`设置游戏入口 ${index}: ${config.title}`);
                this.setupGameEntry(entryNode, config);
            } else {
                console.warn(`游戏入口索引 ${index} 超出配置范围`);
            }
        });
        
        console.log('游戏入口初始化完成');
    }
    
    setupGameEntry(entryNode: Node, config: GameEntryConfig) {
        console.log(`设置游戏入口: ${config.title} (ID: ${config.id})`);
        
        // 设置开始游戏按钮文字
        const startBtnLabel = entryNode.getChildByName('StartButton')?.getComponent(Label);
        if (startBtnLabel) {
            startBtnLabel.string = '开始游戏';
            console.log(`开始游戏按钮文字设置为: 开始游戏`);
        } else {
            console.warn(`游戏入口 ${config.title} 缺少StartButton或Label组件`);
        }
        
        // 设置发光效果
        const glowEffect = entryNode.getChildByName('GlowEffect')?.getComponent(Sprite);
        if (glowEffect) {
            // 可以设置发光颜色或动画
            glowEffect.color = new Color(100, 149, 237, 100);
            console.log(`发光效果已设置`);
        } else {
            console.log(`游戏入口 ${config.title} 未找到发光效果组件`);
        }
        
        // 设置开始按钮点击事件
        const startButton = entryNode.getChildByName('StartButton')?.getComponent(Button);
        if (startButton) {
            startButton.node.on(Node.EventType.TOUCH_END, () => {
                console.log(`用户点击开始游戏按钮: ${config.title}`);
                this.startGame(config.id);
            });
            console.log(`开始游戏按钮点击事件已绑定`);
        } else {
            console.warn(`游戏入口 ${config.title} 缺少StartButton或Button组件`);
        }
        
        // 设置游戏入口整体点击事件
        const entryButton = entryNode.getComponent(Button);
        if (entryButton) {
            entryButton.node.on(Node.EventType.TOUCH_END, () => {
                console.log(`用户点击游戏入口: ${config.title}`);
                this.startGame(config.id);
            });
            console.log(`游戏入口整体点击事件已绑定`);
        } else {
            console.log(`游戏入口 ${config.title} 未找到Button组件，将添加Button组件`);
            const newButton = entryNode.addComponent(Button);
            newButton.node.on(Node.EventType.TOUCH_END, () => {
                console.log(`用户点击游戏入口: ${config.title}`);
                this.startGame(config.id);
            });
        }
        
        // 可选悬停效果（PC 上）
        this.setupEntryHoverEffects(entryNode);
        
        console.log(`游戏入口 ${config.title} 设置完成`);
    }
    
    // 入口不再单独配置 ModeSelector
    
    setupEntryHoverEffects(entryNode: Node) {
        const button = entryNode.getComponent(Button) || entryNode.addComponent(Button);
        
        // 鼠标进入时可进行轻微放大
        button.node.on(Node.EventType.MOUSE_ENTER, () => {
            tween(entryNode)
                .to(0.3, { scale: new Vec3(1.05, 1.05, 1) })
                .start();
        });
        
        // 鼠标离开时复位
        button.node.on(Node.EventType.MOUSE_LEAVE, () => {
            tween(entryNode)
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .start();
        });
    }

    getEntryId(entryNode: Node): string {
        const index = this.gameEntries.indexOf(entryNode);
        return index >= 0 && index < this.gameConfigs.length ? this.gameConfigs[index].id : '';
    }
    
    setupAnimations() {
        // 设置装饰元素动画
        this.setupDecorationAnimations();
        
        // 初始化底部功能按钮
        this.setupFooterButtons();
    }
    
    setupFooterButtons() {
        // 设置游戏记录按钮
        if (this.recordsItem) {
            const button = this.recordsItem.getComponent(Button) || this.recordsItem.addComponent(Button);
            button.node.on(Node.EventType.TOUCH_END, () => {
                this.onRecordsClick();
            });
        }
        
        // 设置成就系统按钮
        if (this.achievementsItem) {
            const button = this.achievementsItem.getComponent(Button) || this.achievementsItem.addComponent(Button);
            button.node.on(Node.EventType.TOUCH_END, () => {
                this.onAchievementsClick();
            });
        }
        
        // 设置商店按钮
        if (this.shopItem) {
            const button = this.shopItem.getComponent(Button) || this.shopItem.addComponent(Button);
            button.node.on(Node.EventType.TOUCH_END, () => {
                this.onShopClick();
            });
        }
    }
    
    setupDecorationAnimations() {
        // 顶部左侧装饰动画
        if (this.topLeftDecoration) {
            tween(this.topLeftDecoration)
                .by(3, { position: new Vec3(0, 20, 0) })
                .by(3, { position: new Vec3(0, -20, 0) })
                .union()
                .repeatForever()
                .start();
        }
        
        // 底部右侧装饰动画
        if (this.bottomRightDecoration) {
            tween(this.bottomRightDecoration)
                .by(4, { position: new Vec3(0, 15, 0) })
                .by(4, { position: new Vec3(0, -15, 0) })
                .union()
                .repeatForever()
                .start();
        }
    }
    

    
    startGame(gameId: string) {
        console.log(`=== 开始游戏流程 ===`);
        console.log(`游戏ID: ${gameId}`);
        
        const gameConfig = this.gameConfigs.find(c => c.id === gameId);
        
        if (!gameConfig) {
            console.error(`未找到游戏配置: ${gameId}`);
            return;
        }
        
        console.log(`找到游戏配置: ${gameConfig.title}`);
        
        const selectedMode = this.modeSelector ? this.modeSelector.getCurrentMode() : GameMode.SingleMode;
        console.log(`开始游戏: ${gameConfig.title}, 模式: ${selectedMode}`);
        
        console.log(`🎮 开始游戏: ${gameConfig.title}, 模式: ${selectedMode}`);
        
        // 保存游戏设置到全局变量
        if (window) {
            (window as any).selectedGame = gameId;
            (window as any).selectedGameMode = selectedMode;
            console.log(`游戏设置已保存到全局变量: game=${gameId}, mode=${selectedMode}`);
        } else {
            console.warn('window对象不存在，无法保存全局变量');
        }
        
        // 根据模式打开对应的游戏场景
        console.log(`正在加载游戏场景...`);
        this.loadGameScene(gameId, selectedMode);
        
        console.log(`=== 游戏启动流程完成 ===`);
    }
    
    loadGameScene(gameId: string, mode: GameMode) {
        console.log(`根据游戏和模式组合加载场景: 游戏=${gameId}, 模式=${mode}`);
        
        // 场景映射表：游戏ID + 模式 -> 场景名称
        const sceneMap = {
            // 游戏1的场景映射
            'game1_SingleMode': 'GameScence',      // 游戏1单机模式 -> GameScence.scene
            'game1_AIMode': 'GameScence2',         // 游戏1AI模式 -> GameScence2.scene
            'game1_LANMode': 'GameScence3',        // 游戏1联机模式 -> GameScence3.scene
            
            // 游戏2的场景映射
            'game2_SingleMode': 'Game2Scence',     // 游戏2单机模式 -> Game2Scence.scene
            'game2_AIMode': 'Game2Scence2',        // 游戏2AI模式 -> Game2Scence2.scene
            'game2_LANMode': 'Game2Scence3'        // 游戏2联机模式 -> Game2Scence3.scene
        };
        
        const sceneKey = `${gameId}_${mode}`;
        const sceneName = sceneMap[sceneKey] || 'GameScence'; // 默认场景
        
        console.log(`场景键: ${sceneKey}, 场景名称: ${sceneName}`);
        
        // 检查场景是否存在，如果不存在则使用默认场景
        if (sceneMap[sceneKey]) {
            console.log(`✅ 加载场景: ${sceneName}`);
            director.loadScene(sceneName);
        } else {
            console.warn(`⚠️ 场景 ${sceneName} 未找到，使用默认场景`);
            director.loadScene('GameScence');
        }
    }
    
    navigateTo(page: string) {
        console.log('导航到:', page);
        
        switch (page) {
            case 'records':
                console.log('打开游戏记录页面');
                break;
            case 'achievements':
                console.log('打开成就系统页面');
                break;
            case 'shop':
                console.log('打开商店页面');
                break;
        }
    }
    
    // 底部功能按钮点击事件
    onRecordsClick() {
        this.navigateTo('records');
    }
    
    onAchievementsClick() {
        this.navigateTo('achievements');
    }
    
    onShopClick() {
        this.navigateTo('shop');
    }
}