import { _decorator, Component, Node, Sprite, Button, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { CardData } from './GameManager';

@ccclass('Card')
export class Card extends Component {
    
    @property({ type: Sprite })
    cardFace: Sprite = null!;
    
    @property({ type: Sprite })
    cardBack: Sprite = null!;
    
    private cardData: CardData = null!;
    private gameManager: any = null!;
    private isFlipping: boolean = false;
    
    init(cardData: CardData, gameManager: any) {
        this.cardData = cardData;
        this.gameManager = gameManager;
        
        // 设置卡片初始状态
        this.updateCardDisplay();
        
        // 绑定点击事件
        this.node.on(Node.EventType.TOUCH_END, this.onCardClicked, this);
    }
    
    onCardClicked() {
        console.log(`[Card] 点击卡片: id=${this.cardData.id}, isFlipping=${this.isFlipping}, isFlipped=${this.cardData.isFlipped}, isMatched=${this.cardData.isMatched}`);
        
        // 本地自检：动画中/已翻开/已配对直接拒绝
        if (this.isFlipping || this.cardData.isFlipped || this.cardData.isMatched) {
            console.log(`[Card] 点击被阻止: id=${this.cardData.id}`);
            return;
        }
        // 全局锁校验：在GameManager锁定或已两张翻开的情况下禁止翻牌
        if (this.gameManager && typeof this.gameManager.canFlipCard === 'function') {
            const allowed = this.gameManager.canFlipCard(this.cardData.id);
            if (!allowed) {
                console.log(`[Card] 全局锁阻止点击: id=${this.cardData.id}`);
                return;
            }
        }
        
        console.log(`[Card] 开始翻转卡片: id=${this.cardData.id}`);
        this.flipCard(true);
        this.gameManager.onCardFlipped(this.cardData.id);
    }
    
    flipCard(showFace: boolean) {
        if (this.isFlipping) return;
        
        this.isFlipping = true;
        
        // 确保当前缩放正常
        if (this.node.scale.x === 0) {
            this.node.setScale(1, 1, 1);
        }
        
        // 翻转动画
        tween(this.node)
            .to(0.15, { scale: new Vec3(0, 1, 1) })
            .call(() => {
                this.cardData.isFlipped = showFace;
                this.updateCardDisplay();
            })
            .to(0.15, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.isFlipping = false;
                // 确保动画完成后缩放正确
                this.node.setScale(1, 1, 1);
            })
            .start();
    }
    
    updateCardDisplay() {
        if (this.cardData.isFlipped) {
            // 已翻转的卡片：显示卡面（无论是否匹配）
            this.cardFace.node.active = true;
            this.cardBack.node.active = false;
            this.cardFace.color.set(255, 255, 255, 255); // 不透明
            
            // 根据卡片类型设置不同的面
            this.updateCardFace();
        } else {
            // 未翻转：显示背面
            this.cardFace.node.active = false;
            this.cardBack.node.active = true;
        }
    }
    
    updateCardFace() {
        // 修复缩放问题
        if (this.node.scale.x === 0) {
            this.node.setScale(1, 1, 1);
        }
        
        // 根据卡片数据设置不同的面图案
        if (this.gameManager && this.gameManager.cardFaces && this.gameManager.cardFaces.length > 0) {
            if (this.cardData.isSpecial) {
                // 特殊卡片：使用最后一张作为特殊图案
                const specialIndex = this.gameManager.cardFaces.length - 1;
                this.cardFace.spriteFrame = this.gameManager.cardFaces[specialIndex];
            } else {
                // 普通卡片：根据value值选择图案
                const faceIndex = Math.min(this.cardData.value, this.gameManager.cardFaces.length - 1);
                this.cardFace.spriteFrame = this.gameManager.cardFaces[faceIndex];
            }
        }
        
        // 修复父节点激活问题
        if (this.cardFace.node.parent && !this.cardFace.node.parent.active) {
            this.cardFace.node.parent.active = true;
        }
        
        // 强制刷新渲染
        this.cardFace.markForUpdateRenderData();
    }
    
    // 特殊效果动画
    playMatchEffect() {
        if (!this.cardData.isMatched) return;
        
        // 匹配成功特效
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    }
    
    playSpecialEffect() {
        // 特殊卡片效果动画
        tween(this.node)
            .to(0.2, { scale: new Vec3(1.3, 1.3, 1) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .repeat(2)
            .start();
    }
}