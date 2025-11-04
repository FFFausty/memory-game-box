import { _decorator, Component, Node, Button, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;



@ccclass('UIManager')
export class UIManager extends Component {
    
    @property({ type: Node })
    mainMenu: Node = null!;
    
    @property({ type: Node })
    gameUI: Node = null!;
    
    @property({ type: Node })
    gameOverUI: Node = null!;
    
    @property({ type: Button })
    startButton: Button = null!;
    
    @property({ type: Label })
    finalScoreLabel: Label = null!;
    
    private gameManager: any = null!;
    
    onLoad() {
        this.showMainMenu();
        
        // 绑定按钮事件
        this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
    }
    
    setGameManager(gameManager: any) {
        this.gameManager = gameManager;
    }
    
    showMainMenu() {
        this.mainMenu.active = true;
        this.gameUI.active = false;
        this.gameOverUI.active = false;
    }
    
    showGameUI() {
        this.mainMenu.active = false;
        this.gameUI.active = true;
        this.gameOverUI.active = false;
    }
    
    showGameOverUI(finalScore: number) {
        this.mainMenu.active = false;
        this.gameUI.active = false;
        this.gameOverUI.active = true;
        
        this.finalScoreLabel.string = `最终得分: ${finalScore}`;
    }
    
    onStartGame() {
        this.showGameUI();
        if (this.gameManager) {
            this.gameManager.startNewGame();
        }
    }
    
    // 难度已固定，无需选择
    
  /*  updateRuleInfo(ruleType: SpecialRuleType) {
        let ruleText = '';
        
        switch (ruleType) {
            case SpecialRuleType.BENEFIT:
                ruleText = '当前规则：增益规则\n- 特殊牌提供帮助效果\n- 匹配成功获得额外奖励';
                break;
            case SpecialRuleType.PENALTY:
                ruleText = '当前规则：减益规则\n- 特殊牌带来挑战效果\n- 谨慎处理特殊牌';
                break;
        }
        
        // 在游戏界面显示规则信息
        console.log(ruleText);
    }
    */
    onRestartGame() {
        this.showMainMenu();
    }
    
    onBackToMenu() {
        this.showMainMenu();
    }
}