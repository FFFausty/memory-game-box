import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

import { GameDifficulty, SpecialRuleType } from './GameManager';

// 游戏统计数据
interface GameStats {
    totalGames: number;
    totalWins: number;
    totalScore: number;
    bestScore: number;
    bestTime: number;
    averageScore: number;
}

// 难度统计数据
interface DifficultyStats {
    [difficulty: number]: {
        gamesPlayed: number;
        wins: number;
        bestScore: number;
        bestTime: number;
    };
}

// 成就数据
interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    unlockDate?: number;
    progress?: number;
    target?: number;
}

// 玩家档案
interface PlayerProfile {
    playerName: string;
    level: number;
    experience: number;
    totalPlayTime: number;
    stats: GameStats;
    difficultyStats: DifficultyStats;
    achievements: Achievement[];
    settings: GameSettings;
}

// 游戏设置
interface GameSettings {
    soundVolume: number;
    musicVolume: number;
    vibration: boolean;
    language: string;
    showTutorial: boolean;
}

@ccclass('DataManager')
export class DataManager extends Component {
    
    private static instance: DataManager = null!;
    private playerProfile: PlayerProfile = null!;
    private readonly STORAGE_KEY = 'memory_game_profile';
    
    onLoad() {
        if (DataManager.instance) {
            this.node.destroy();
            return;
        }
        
        DataManager.instance = this;
        this.loadPlayerProfile();
    }
    
    // 单例模式
    public static getInstance(): DataManager {
        return DataManager.instance;
    }
    
    // 加载玩家档案
    private loadPlayerProfile() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (savedData) {
                this.playerProfile = JSON.parse(savedData);
            } else {
                this.createDefaultProfile();
            }
        } catch (error) {
            console.error('加载玩家档案失败:', error);
            this.createDefaultProfile();
        }
    }
    
    // 创建默认档案
    private createDefaultProfile() {
        this.playerProfile = {
            playerName: '玩家',
            level: 1,
            experience: 0,
            totalPlayTime: 0,
            stats: {
                totalGames: 0,
                totalWins: 0,
                totalScore: 0,
                bestScore: 0,
                bestTime: Infinity,
                averageScore: 0
            },
            difficultyStats: {},
            achievements: this.createDefaultAchievements(),
            settings: {
                soundVolume: 0.8,
                musicVolume: 0.6,
                vibration: true,
                language: 'zh-CN',
                showTutorial: true
            }
        };
        
        this.saveProfile();
    }
    
    // 创建默认成就
    private createDefaultAchievements(): Achievement[] {
        return [
            {
                id: 'first_win',
                name: '初次胜利',
                description: '赢得第一场游戏',
                unlocked: false,
                progress: 0,
                target: 1
            },
            {
                id: 'score_100',
                name: '百分达人',
                description: '单局得分达到100分',
                unlocked: false,
                progress: 0,
                target: 100
            },
            {
                id: 'speed_demon',
                name: '速度之星',
                description: '在3分钟内完成游戏',
                unlocked: false,
                progress: Infinity,
                target: 180
            },
            {
                id: 'perfect_memory',
                name: '完美记忆',
                description: '连续匹配5对卡片无错误',
                unlocked: false,
                progress: 0,
                target: 5
            },
            {
                id: 'difficulty_master',
                name: '难度大师',
                description: '在所有难度下都获得胜利',
                unlocked: false,
                progress: 0,
                target: Object.keys(GameDifficulty).length / 2 // 枚举值数量
            },
            {
                id: 'ai_champion',
                name: 'AI冠军',
                description: '击败所有难度的AI对手',
                unlocked: false,
                progress: 0,
                target: 3 // 三种AI难度
            }
        ];
    }
    
    // 保存档案
    private saveProfile() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.playerProfile));
        } catch (error) {
            console.error('保存玩家档案失败:', error);
        }
    }
    
    // 记录游戏结果
    public recordGameResult(
        difficulty: GameDifficulty,
        score: number,
        time: number,
        isWin: boolean,
        ruleType: SpecialRuleType
    ) {
        // 更新总体统计
        this.playerProfile.stats.totalGames++;
        this.playerProfile.totalPlayTime += time;
        this.playerProfile.stats.totalScore += score;
        
        if (isWin) {
            this.playerProfile.stats.totalWins++;
            this.playerProfile.stats.bestScore = Math.max(this.playerProfile.stats.bestScore, score);
            this.playerProfile.stats.bestTime = Math.min(this.playerProfile.stats.bestTime, time);
        }
        
        this.playerProfile.stats.averageScore = this.playerProfile.stats.totalScore / this.playerProfile.stats.totalGames;
        
        // 更新难度统计
        if (!this.playerProfile.difficultyStats[difficulty]) {
            this.playerProfile.difficultyStats[difficulty] = {
                gamesPlayed: 0,
                wins: 0,
                bestScore: 0,
                bestTime: Infinity
            };
        }
        
        const diffStats = this.playerProfile.difficultyStats[difficulty];
        diffStats.gamesPlayed++;
        
        if (isWin) {
            diffStats.wins++;
            diffStats.bestScore = Math.max(diffStats.bestScore, score);
            diffStats.bestTime = Math.min(diffStats.bestTime, time);
        }
        
        // 检查成就解锁
        this.checkAchievements(difficulty, score, time, isWin, ruleType);
        
        // 计算经验值
        this.calculateExperience(score, isWin);
        
        this.saveProfile();
    }
    
    // 检查成就解锁
    private checkAchievements(
        difficulty: GameDifficulty,
        score: number,
        time: number,
        isWin: boolean,
        ruleType: SpecialRuleType
    ) {
        const unlockedAchievements: string[] = [];
        
        this.playerProfile.achievements.forEach(achievement => {
            if (achievement.unlocked) return;
            
            let progress = achievement.progress || 0;
            
            switch (achievement.id) {
                case 'first_win':
                    if (isWin) {
                        achievement.unlocked = true;
                        achievement.unlockDate = Date.now();
                        unlockedAchievements.push(achievement.id);
                    }
                    break;
                    
                case 'score_100':
                    if (score >= 100) {
                        achievement.unlocked = true;
                        achievement.unlockDate = Date.now();
                        unlockedAchievements.push(achievement.id);
                    } else {
                        achievement.progress = Math.max(achievement.progress || 0, score);
                    }
                    break;
                    
                case 'speed_demon':
                    if (isWin && time <= 180) {
                        achievement.unlocked = true;
                        achievement.unlockDate = Date.now();
                        unlockedAchievements.push(achievement.id);
                    } else if (isWin) {
                        achievement.progress = Math.min(achievement.progress || Infinity, time);
                    }
                    break;
                    
                // 其他成就检查逻辑...
            }
        });
        
        // 如果有新成就解锁，触发事件
        if (unlockedAchievements.length > 0) {
            this.onAchievementUnlocked(unlockedAchievements);
        }
    }
    
    // 成就解锁事件
    private onAchievementUnlocked(achievementIds: string[]) {
        console.log('成就解锁:', achievementIds);
        // TODO: 显示成就解锁UI
    }
    
    // 计算经验值
    private calculateExperience(score: number, isWin: boolean) {
        let expGain = Math.floor(score / 10);
        if (isWin) expGain *= 2;
        
        this.playerProfile.experience += expGain;
        
        // 检查升级
        const expForNextLevel = this.playerProfile.level * 100;
        if (this.playerProfile.experience >= expForNextLevel) {
            this.playerProfile.level++;
            this.playerProfile.experience -= expForNextLevel;
            console.log(`升级到等级 ${this.playerProfile.level}`);
        }
    }
    
    // 获取玩家档案
    public getPlayerProfile(): PlayerProfile {
        return { ...this.playerProfile };
    }
    
    // 更新设置
    public updateSettings(settings: Partial<GameSettings>) {
        this.playerProfile.settings = { ...this.playerProfile.settings, ...settings };
        this.saveProfile();
    }
    
    // 获取设置
    public getSettings(): GameSettings {
        return { ...this.playerProfile.settings };
    }
    
    // 获取成就列表
    public getAchievements(): Achievement[] {
        return [...this.playerProfile.achievements];
    }
    
    // 获取统计信息
    public getStats(): GameStats {
        return { ...this.playerProfile.stats };
    }
    
    // 获取难度统计
    public getDifficultyStats(difficulty: GameDifficulty) {
        return this.playerProfile.difficultyStats[difficulty] || {
            gamesPlayed: 0,
            wins: 0,
            bestScore: 0,
            bestTime: Infinity
        };
    }
    
    // 重置数据（调试用）
    public resetData() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.createDefaultProfile();
    }
}