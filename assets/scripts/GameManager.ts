import { _decorator, Component, Node, instantiate, Prefab, Label, Sprite, SpriteFrame, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

// 保留枚举以兼容旧引用，但仅支持难度1
export enum GameDifficulty {
    EASY = 1
}

// 卡片数据接口
export interface CardData {
    id: number;
    value: number;
    isSpecial: boolean;
    isFlipped: boolean;
    isMatched: boolean;
}

@ccclass('GameManager')
export class GameManager extends Component {
    
    @property({ type: Prefab })
    cardPrefab: Prefab = null!;
    
    @property({ type: Node })
    gameBoard: Node = null!;
    
    @property({ type: Label })
    scoreLabel: Label = null!;
    
    @property({ type: Label })
    timerLabel: Label = null!;
    
    // 卡片精灵帧资源
    @property({ type: [SpriteFrame] })
    cardFaces: SpriteFrame[] = [];
    
    @property({ type: SpriteFrame })
    cardBack: SpriteFrame = null!;
    
    // 音效相关属性
    @property({ type: AudioSource })
    scoreAudio: AudioSource = null!;
    
    @property({ type: AudioSource })
    matchAudio: AudioSource = null!;
    
    @property({ type: AudioSource })
    specialAudio: AudioSource = null!;
    
    @property({ type: AudioSource })
    victoryAudio: AudioSource = null!;
    
    private currentDifficulty: GameDifficulty = GameDifficulty.EASY;
    private cards: CardData[] = [];
    private flippedCards: number[] = [];
    private score: number = 0;
    private gameTime: number = 0;
    private isGameActive: boolean = false;
    private isLocked: boolean = false; // 锁定状态，防止在匹配判定过程中点击
    
    // 分数机制相关变量
    private flipCount: number = 0; // 翻牌总次数
    private consecutiveMatches: number = 0; // 连续配对次数
    private specialCardFound: boolean = false; // 特殊牌是否已找到
    private startTime: number = 0; // 游戏开始时间
    
    onLoad() {
        this.loadCardResources();
    }
    
    loadCardResources() {
        if (this.cardFaces.length === 0) {
            console.error('错误：cardFaces数组为空！请在编辑器中设置卡片资源。');
        }
        
        this.startNewGame();
    }
    
    // 对外暴露的点击校验：是否允许翻牌
    public canFlipCard(cardId: number): boolean {
        if (!this.isGameActive || this.isLocked) {
            return false;
        }
        if (this.flippedCards.length >= 2) {
            return false;
        }
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return false;
        if (card.isFlipped || card.isMatched) return false;
        return true;
    }

    
    startNewGame() {
        // 初始化游戏状态
        this.score = 0;
        this.gameTime = 0;
        this.isGameActive = true;
        this.flippedCards = [];
        this.flipCount = 0;
        this.consecutiveMatches = 0;
        this.specialCardFound = false;
        this.startTime = Date.now();
        
        // 创建卡片
        this.createCards();
        
        // 更新UI
        this.updateScore();
    }
    
    createCards() {
        // 清空现有卡片
        this.gameBoard.removeAllChildren();
        this.cards = [];
        
        const cardCount = 25;
        const pairsCount = 12;
        
        // 创建卡片数据
        for (let i = 0; i < pairsCount; i++) {
            // 每对卡片
            this.cards.push({ id: i * 2, value: i, isSpecial: false, isFlipped: false, isMatched: false });
            this.cards.push({ id: i * 2 + 1, value: i, isSpecial: false, isFlipped: false, isMatched: false });
        }
        
        // 添加特殊卡片：难度1固定1张
        this.cards.push({ id: cardCount - 1, value: -1, isSpecial: true, isFlipped: false, isMatched: false });
        
        // 洗牌
        this.shuffleCards();
        
        // 创建卡片节点
        this.createCardNodes();
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    createCardNodes() {
        const gridSize = 5;
        const cardSize = 100;
        const spacing = 10;
        
        for (let i = 0; i < this.cards.length; i++) {
            const cardNode = instantiate(this.cardPrefab);
            // 使用正确的组件名称获取Card组件
            const cardScript = cardNode.getComponent('Card') as any;
            
            if (cardScript && cardScript.init) {
                cardScript.init(this.cards[i], this);
            }
            
            // 计算位置
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = col * (cardSize + spacing) - (gridSize * (cardSize + spacing)) / 2 + cardSize / 2;
            const y = row * (cardSize + spacing) - (Math.ceil(this.cards.length / gridSize) * (cardSize + spacing)) / 2 + cardSize / 2;
            
            cardNode.setPosition(x, y, 0);
            this.gameBoard.addChild(cardNode);
        }
    }
    
    onCardFlipped(cardId: number) {
        console.log(`[GameManager] onCardFlipped: cardId=${cardId}, isGameActive=${this.isGameActive}, isLocked=${this.isLocked}, flippedCards=${this.flippedCards.length}`);
        
        // 加强锁定检查：在锁定状态下完全拒绝任何点击
        if (!this.isGameActive || this.isLocked) {
            console.log(`[GameManager] 点击被阻止: isGameActive=${this.isGameActive}, isLocked=${this.isLocked}`);
            return;
        }
        
        // 如果已经有2张牌被翻开，拒绝新的点击
        if (this.flippedCards.length >= 2) {
            console.log(`[GameManager] 点击被阻止: 已有${this.flippedCards.length}张牌翻开`);
            return;
        }
        
        const card = this.cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) {
            console.log(`[GameManager] 点击被阻止: card=${card}, isFlipped=${card?.isFlipped}, isMatched=${card?.isMatched}`);
            return;
        }
        
        // 翻牌扣分：每翻开一张牌扣1分
        this.flipCount++;
        this.score -= 1;
        this.updateScore();
        
        // 播放翻牌音效
        this.playScoreAudio();
        
        // 播放翻牌音效
        this.playScoreAudio();
        
        card.isFlipped = true;
        this.flippedCards.push(cardId);
        console.log(`[GameManager] 卡片翻转成功: id=${cardId}, 当前翻开卡片: ${this.flippedCards}`);
        
        // 如果是特殊牌，立即触发特殊效果
        if (card.isSpecial && this.flippedCards.length === 1) {
            console.log(`[GameManager] 特殊牌触发: id=${cardId}`);
            // 特殊牌点击后立即锁定
            this.isLocked = true;
            this.checkSpecialCardEffect(card, card); // 传递同一个卡片两次表示是点击而非配对
        } else if (this.flippedCards.length === 2) {
            console.log(`[GameManager] 配对检查: 两张牌已翻开 ${this.flippedCards}`);
            // 翻开第二张牌后立即锁定
            this.isLocked = true;
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const card1 = this.cards.find(c => c.id === this.flippedCards[0]);
        const card2 = this.cards.find(c => c.id === this.flippedCards[1]);
        
        if (card1 && card2) {
            if (card1.value === card2.value && card1.id !== card2.id) {
                // 匹配成功
                card1.isMatched = true;
                card2.isMatched = true;
                
                // 配对奖励：+10分
                this.score += 10;
                
                // 连续配对奖励：如果连续配对成功，额外+2分
                this.consecutiveMatches++;
                if (this.consecutiveMatches > 1) {
                    this.score += 2;
                    console.log(`连续配对奖励: +2分 (连续${this.consecutiveMatches}次)`);
                }
                
                this.updateScore();
                
                // 播放配对成功音效
                this.playMatchAudio();
                
                // 检查特殊卡片效果
                this.checkSpecialCardEffect(card1, card2);
                
                // 检查游戏是否结束
                this.checkGameEnd();
                
                // 匹配成功后立即解锁
                this.isLocked = false;
            } else {
                // 匹配失败，翻回
                // 重置连续配对计数
                this.consecutiveMatches = 0;
                
                setTimeout(() => {
                    card1.isFlipped = false;
                    card2.isFlipped = false;
                    this.updateCardDisplay(card1.id);
                    this.updateCardDisplay(card2.id);
                    
                    // 翻回动画完成后解锁
                    this.isLocked = false;
                }, 1000);
            }
        }
        
        this.flippedCards = [];
    }
    
    checkSpecialCardEffect(card1: CardData, card2: CardData) {
        if (card1.isSpecial || card2.isSpecial) {
            // 如果是特殊牌被点击（不是配对），执行特殊效果
            if (this.flippedCards.length === 1) {
                const specialCard = card1.isSpecial ? card1 : card2;
                this.triggerSpecialCardEffect(specialCard);
            }
            // 特殊卡片匹配获得额外分数
            else if (card1.isSpecial && card2.isSpecial) {
                this.score += 20;
                this.updateScore();
            }
        }
    }
    
    triggerSpecialCardEffect(specialCard: CardData) {
        // 特殊牌视为配对成功状态
        specialCard.isMatched = true;
        
        // 特殊牌奖励：第一次找到特殊牌+15分
        if (!this.specialCardFound) {
            this.score += 15;
            this.specialCardFound = true;
            console.log('特殊牌奖励: +15分');
        } else {
            this.score += 5; // 后续找到特殊牌+5分
        }
        
        this.updateScore();
        
        // 播放特殊牌音效
        this.playSpecialAudio();
        
        // 播放特殊牌音效
        this.playSpecialAudio();
        
        // 播放特殊牌音效
        this.playSpecialAudio();
        
        // 播放特殊牌音效
        this.playSpecialAudio();
        
        // 获取特殊牌的位置
        const specialCardIndex = this.cards.findIndex(card => card.id === specialCard.id);
        const gridSize = 5;
        const row = Math.floor(specialCardIndex / gridSize);
        const col = specialCardIndex % gridSize;
        
        // 查找上下左右四张牌
        const adjacentCards: CardData[] = [];
        
        // 上方的牌
        if (row > 0) {
            const upIndex = (row - 1) * gridSize + col;
            if (upIndex < this.cards.length) {
                adjacentCards.push(this.cards[upIndex]);
            }
        }
        
        // 下方的牌
        if (row < Math.ceil(this.cards.length / gridSize) - 1) {
            const downIndex = (row + 1) * gridSize + col;
            if (downIndex < this.cards.length) {
                adjacentCards.push(this.cards[downIndex]);
            }
        }
        
        // 左方的牌
        if (col > 0) {
            const leftIndex = row * gridSize + (col - 1);
            if (leftIndex < this.cards.length) {
                adjacentCards.push(this.cards[leftIndex]);
            }
        }
        
        // 右方的牌
        if (col < gridSize - 1) {
            const rightIndex = row * gridSize + (col + 1);
            if (rightIndex < this.cards.length) {
                adjacentCards.push(this.cards[rightIndex]);
            }
        }
        
        // 记录哪些相邻牌被翻开了（只翻未翻开的牌）
        const flippedAdjacentCards: CardData[] = [];
        
        // 翻开相邻的牌
        adjacentCards.forEach(card => {
            if (!card.isFlipped && !card.isMatched) {
                card.isFlipped = true;
                flippedAdjacentCards.push(card);
                this.updateCardDisplay(card.id);
            }
        });
        
        // 2秒后只翻回被翻开的相邻牌
        if (flippedAdjacentCards.length > 0) {
            setTimeout(() => {
                // 只翻回被翻开的相邻牌
                flippedAdjacentCards.forEach(card => {
                    card.isFlipped = false;
                    this.updateCardDisplay(card.id);
                });
                
                // 清空翻转卡片列表
                this.flippedCards = [];
                
                // 特殊卡片效果完成后解锁
                this.isLocked = false;
                
            }, 2000);
        } else {
            // 如果没有相邻牌被翻开，直接清空翻转列表
            this.flippedCards = [];
            
            // 特殊卡片效果完成后解锁
            this.isLocked = false;
        }
        
        // 更新特殊牌显示状态（保持翻开）
        this.updateCardDisplay(specialCard.id);
    }
    
    checkGameEnd() {
        const remainingCards = this.cards.filter(card => !card.isMatched && !card.isSpecial);
        if (remainingCards.length === 0) {
            this.isGameActive = false;
            
            // 计算时间奖励
            const endTime = Date.now();
            const totalTime = (endTime - this.startTime) / 1000; // 转换为秒
            const timeReward = Math.max(0, 50 - 0.1 * totalTime);
            
            // 添加时间奖励到总分
            this.score += Math.floor(timeReward);
            
            console.log(`游戏结束！用时: ${totalTime.toFixed(1)}秒, 时间奖励: +${Math.floor(timeReward)}分, 最终得分: ${this.score}`);
            
            // 更新最终得分显示
            this.updateScore();
            
            // 播放通关音效
            this.playVictoryAudio();
            
            // 记录游戏结果到数据管理器
            this.recordGameResult(totalTime);
        }
    }
    
    updateScore() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `得分: ${this.score}`;
        }
    }
    
    updateCardDisplay(cardId: number) {
        // 简化版本：通过Card组件更新显示
        const cardNode = this.gameBoard.children.find(child => {
            const cardScript = child.getComponent('Card') as any;
            return cardScript && cardScript.cardData && cardScript.cardData.id === cardId;
        });
        
        if (cardNode) {
            const cardScript = cardNode.getComponent('Card') as any;
            if (cardScript && cardScript.updateCardDisplay) {
                cardScript.updateCardDisplay();
            }
        }
    }
    
    update(dt: number) {
        if (this.isGameActive) {
            this.gameTime += dt;
            if (this.timerLabel) {
                const minutes = Math.floor(this.gameTime / 60);
                const seconds = Math.floor(this.gameTime % 60);
                this.timerLabel.string = `时间: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }
    
    // 记录游戏结果到数据管理器
    private recordGameResult(totalTime: number) {
        try {
            // 尝试获取数据管理器实例
            const dataManager = DataManager.getInstance();
            if (dataManager && typeof dataManager.recordGameResult === 'function') {
                // 记录游戏结果
                dataManager.recordGameResult(
                    this.currentDifficulty,
                    this.score,
                    totalTime,
                    true, // 游戏胜利
                    null as any // 特殊规则类型（暂时设为null）
                );
                console.log('游戏结果已记录到数据管理器');
            }
        } catch (error) {
            console.warn('无法记录游戏结果到数据管理器:', error);
        }
    }
    
    // 音效播放方法
    private playAudio(audioSource: AudioSource) {
        if (audioSource && audioSource.play) {
            audioSource.play();
        }
    }
    
    // 播放特殊牌音效
    private playSpecialAudio() {
        this.playAudio(this.specialAudio);
    }
    
    // 播放配对成功音效（延时0.5秒）
    private playMatchAudio() {
        this.scheduleOnce(() => {
            this.playAudio(this.matchAudio);
        }, 0.5);
    }
    
    // 播放通关音效（延时1.5秒）
    private playVictoryAudio() {
        this.scheduleOnce(() => {
            this.playAudio(this.victoryAudio);
        }, 1.5);
    }
    
    // 播放普通加分音效
    private playScoreAudio() {
        this.playAudio(this.scoreAudio);
    }
}