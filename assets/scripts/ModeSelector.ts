import { _decorator, Component, Node, Button, Label, Sprite, Color, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

// 游戏模式枚举
export enum GameMode {
    SingleMode = 'SingleMode',
    AIMode = 'AIMode', 
    LANMode = 'LANMode'
}

// 模式选项配置
interface ModeOptionConfig {
    mode: GameMode;
    label: string;
    description: string;
}

@ccclass('ModeSelector')
export class ModeSelector extends Component {
    
    @property({ type: [Node] })
    modeButtons: Node[] = [];
    
    @property({ type: Node })
    modeDescription: Node = null!;
    
    @property({ type: Color })
    selectedColor: Color = new Color(100, 149, 237, 255);
    
    @property({ type: Color })
    normalColor: Color = new Color(200, 200, 200, 255);
    
    // 模式选项配置
    private modeConfigs: ModeOptionConfig[] = [
        {
            mode: GameMode.SingleMode,
            label: '单机模式',
            description: '单人游戏，挑战自我'
        },
        {
            mode: GameMode.AIMode,
            label: 'AI对战',
            description: '与人工智能对战'
        },
        {
            mode: GameMode.LANMode,
            label: '本地联机',
            description: '与朋友本地对战'
        }
    ];
    
    private currentMode: GameMode = GameMode.SingleMode;
    
    onLoad() {
        console.log('ModeSelector组件加载完成');
        console.log(`检测到 ${this.modeButtons.length} 个模式按钮`);
        this.initModeSelector();
    }
    
    initModeSelector() {
        console.log('开始初始化模式选择器');
        
        // 初始化模式按钮
        this.modeButtons.forEach((buttonNode, index) => {
            if (index < this.modeConfigs.length) {
                const config = this.modeConfigs[index];
                console.log(`初始化模式按钮: ${config.label} (${config.mode})`);
                this.setupModeButton(buttonNode, config);
            } else {
                console.warn(`模式按钮索引 ${index} 超出配置范围`);
            }
        });
        
        // 默认选择单机模式
        console.log('设置默认模式: SingleMode');
        this.selectMode(GameMode.SingleMode);
        
        console.log('模式选择器初始化完成');
    }
    
    setupModeButton(buttonNode: Node, config: ModeOptionConfig) {
        console.log(`设置模式按钮: ${config.label}`);
        
        // 设置按钮文字
        const label = buttonNode.getComponent(Label);
        if (label) {
            label.string = config.label;
            console.log(`按钮文字设置为: ${config.label}`);
        } else {
            console.warn(`按钮节点缺少Label组件: ${config.label}`);
        }
        
        // 设置按钮点击事件
        const button = buttonNode.getComponent(Button) || buttonNode.addComponent(Button);
        button.node.on(Node.EventType.TOUCH_END, () => {
            console.log(`用户点击模式按钮: ${config.label} (${config.mode})`);
            this.selectMode(config.mode);
        });
        
        // 设置悬停效果
        this.setupButtonHoverEffects(buttonNode);
        
        console.log(`模式按钮 ${config.label} 设置完成`);
    }
    
    setupButtonHoverEffects(buttonNode: Node) {
        const button = buttonNode.getComponent(Button);
        
        button.node.on(Node.EventType.MOUSE_ENTER, () => {
            if (this.getModeFromButton(buttonNode) !== this.currentMode) {
                tween(buttonNode)
                    .to(0.2, { scale: new Vec3(1.05, 1.05, 1) })
                    .start();
            }
        });
        
        button.node.on(Node.EventType.MOUSE_LEAVE, () => {
            if (this.getModeFromButton(buttonNode) !== this.currentMode) {
                tween(buttonNode)
                    .to(0.2, { scale: new Vec3(1, 1, 1) })
                    .start();
            }
        });
    }
    
    selectMode(mode: GameMode) {
        console.log(`尝试选择模式: ${mode}, 当前模式: ${this.currentMode}`);
        
        // 如果点击的是当前已选模式，不进行任何操作
        if (mode === this.currentMode) {
            console.log(`模式 ${mode} 已是当前选择，忽略点击`);
            return;
        }
        
        console.log(`开始切换模式: ${this.currentMode} -> ${mode}`);
        
        // 取消之前的选择状态
        this.deselectAllModes();
        
        // 设置新的选择状态
        this.currentMode = mode;
        
        // 更新选中按钮的视觉效果
        const selectedButton = this.getButtonByMode(mode);
        if (selectedButton) {
            console.log(`找到对应按钮，开始高亮显示`);
            this.highlightSelectedButton(selectedButton);
        } else {
            console.error(`未找到模式 ${mode} 对应的按钮`);
        }
        
        // 更新模式描述
        this.updateModeDescription(mode);
        
        console.log(`✅ 模式切换完成: ${mode}`);
    }
    
    deselectAllModes() {
        this.modeButtons.forEach(buttonNode => {
            this.resetButtonAppearance(buttonNode);
        });
    }
    
    highlightSelectedButton(buttonNode: Node) {
        // 放大效果
        tween(buttonNode)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1) })
            .start();
        
        // 颜色变化
        const sprite = buttonNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = this.selectedColor;
        }
        
        // 添加阴影效果（如果有阴影组件）
        const label = buttonNode.getComponent(Label);
        if (label) {
            label.enableShadow = true;
            label.shadowColor = new Color(0, 0, 0, 100);
            label.shadowOffset = new Vec3(2, 2, 0);
            label.shadowBlur = 5;
        }
    }
    
    resetButtonAppearance(buttonNode: Node) {
        // 恢复原始大小
        tween(buttonNode)
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();
        
        // 恢复原始颜色
        const sprite = buttonNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = this.normalColor;
        }
        
        // 移除阴影效果
        const label = buttonNode.getComponent(Label);
        if (label) {
            label.enableShadow = false;
        }
    }
    
    getButtonByMode(mode: GameMode): Node | null {
        const index = this.modeConfigs.findIndex(config => config.mode === mode);
        return index >= 0 && index < this.modeButtons.length ? this.modeButtons[index] : null;
    }
    
    getModeFromButton(buttonNode: Node): GameMode | null {
        const index = this.modeButtons.indexOf(buttonNode);
        return index >= 0 && index < this.modeConfigs.length ? this.modeConfigs[index].mode : null;
    }
    
    updateModeDescription(mode: GameMode) {
        if (!this.modeDescription) return;
        
        const config = this.modeConfigs.find(c => c.mode === mode);
        if (config && this.modeDescription) {
            const label = this.modeDescription.getComponent(Label);
            if (label) {
                label.string = config.description;
            }
        }
    }
    
    // 获取当前选择的模式
    getCurrentMode(): GameMode {
        return this.currentMode;
    }
    
    // 设置模式（外部调用）
    setMode(mode: GameMode) {
        this.selectMode(mode);
    }
}