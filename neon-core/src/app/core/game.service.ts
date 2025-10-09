import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Level = 1 | 2 | 3;

export interface LevelConfig {
    gameSpeed: number;
    minRange: number;
    maxRange: number;
    operations: number; // Count of enemies
    pathDuration: number;
}

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
    1: {
        gameSpeed: 1,
        minRange: 1,
        maxRange: 10,
        operations: 3,
        pathDuration: 20,
    },
    2: {
        gameSpeed: 1.2,
        minRange: 1,
        maxRange: 10,
        operations: 30,
        pathDuration: 18,
    },
    3: {
        gameSpeed: 1.5,
        minRange: 1,
        maxRange: 50,
        operations: 3,
        pathDuration: 10,
    },
};

export enum Operator {
    Addition = 'Addition',
}

export interface Operation {
    a: number;
    b: number;
    result: number;
    operator: Operator;
}

export interface GameHistory {
    attempt: number;
    operation: Operation;
    playerInput: number;
}

export enum GameStatus {
    Paused = 'Paused',
    Running = 'Running',
    Won = 'Won',
    GameOver = 'GameOver',
}

interface Enemy {
    defeated: boolean;
    beginS: number;
}

interface GameState {
    status: GameStatus;
    level: Level | null;
    history: GameHistory[];
    gameSpeed: number;
    mistakes: number;
    currentOperation: Operation | null;
    enemies: Enemy[];
}

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private initialState: GameState = {
        status: GameStatus.Paused,
        level: null,
        history: [],
        gameSpeed: 1,
        mistakes: 0,
        currentOperation: null,
        enemies: [],
    };

    private state$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(
        this.initialState,
    );
    readonly vm$ = this.state$.asObservable(); // A viewModel just so we can easily use the observable

    public currentOperation!: Operation;
    public score: number = 0;
    public speedPenalty = 0.1;

    constructor() {}

    get currentState(): GameState {
        return this.state$.value;
    }

    get currentEnemies(): Enemy[] {
        return this.currentState.enemies;
    }

    get enemyCount(): number {
        return this.currentEnemies.length;
    }

    public getLevelConfig(level: Level): LevelConfig {
        return LEVEL_CONFIG[level];
    }

    public startGame(level: Level): void {
        const cfg = LEVEL_CONFIG[level];
        const operation = this.generateOperation(level);

        this.state$.next({
            status: GameStatus.Running,
            level,
            gameSpeed: cfg.gameSpeed,
            mistakes: 0,
            history: [],
            currentOperation: operation,
            enemies: [],
        });
    }

    // private generateEnemies(level: Level): Enemy[] {
    //     const cfg = LEVEL_CONFIG[level]
    //     return new Array(cfg.operations).fill(null).map((_) => {
    //         return { visible: false, defeated: false }
    //     })
    // }

    public generateOperation(level: Level): Operation {
        const a = this.generateRandom(level);
        const b = this.generateRandom(level);
        const result: number = a + b;
        const operator = Operator.Addition; // For now we only have addition

        return { a, b, result, operator };
    }

    public generateRandom(level: Level) {
        const min = LEVEL_CONFIG[level].minRange;
        const max = LEVEL_CONFIG[level].maxRange;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public fireLaser(playerInput: number): void {
        const currentState = this.currentState;

        if (
            currentState.status !== GameStatus.Running ||
            !currentState.level ||
            !currentState.currentOperation
        ) {
            return;
        }

        const enemies = this.currentEnemies;
        const correctAnswer =
            playerInput === currentState.currentOperation.result;
        const history: GameHistory[] = [
            ...currentState.history,
            {
                attempt: currentState.history.length + 1,
                operation: currentState.currentOperation,
                playerInput,
            },
        ];

        let mistakes = currentState.mistakes;
        let gameSpeed = currentState.gameSpeed;

        if (!correctAnswer) {
            gameSpeed += this.speedPenalty;
            mistakes += 1;
        } else {
            enemies.shift(); // We defeated the enemy so we can remove
        }

        const currentOperation = this.generateOperation(currentState.level);
        // Check if the total of correct answers is the same as the total operations set in the level config
        const status =
            history.length - mistakes ===
            LEVEL_CONFIG[currentState.level].operations
                ? GameStatus.Won
                : currentState.status;

        this.state$.next({
            ...currentState,
            history,
            mistakes,
            gameSpeed,
            currentOperation,
            status,
            enemies,
        });
    }

    public addEnemy(beginS: number): void {
        const updatedEnemies = this.currentEnemies;
        updatedEnemies.push({
            defeated: false,
            beginS,
        });

        this.state$.next({
            ...this.currentState,
            enemies: updatedEnemies,
        });
    }

    public changeGameStatus(status: GameStatus) {
        this.state$.next({
            ...this.currentState,
            status,
        });
    }

    public isFirstEnemy(beginS: number): boolean {
        return this.currentEnemies.every((obj) => obj.beginS >= beginS);
    }
}
