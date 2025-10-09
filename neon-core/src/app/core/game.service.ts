import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Level = 1 | 2 | 3;

export interface LevelConfig {
    minRange: number;
    maxRange: number;
    operations: number; // Count of enemies
    pathDuration: number;
}

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
    1: {
        minRange: 1,
        maxRange: 10,
        operations: 3,
        pathDuration: 20,
    },
    2: {
        minRange: 1,
        maxRange: 10,
        operations: 30,
        pathDuration: 18,
    },
    3: {
        minRange: 1,
        maxRange: 50,
        operations: 3,
        pathDuration: 15,
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
    Resumed = 'Resumed',
    Running = 'Running',
    Won = 'Won',
    GameOver = 'GameOver',
}

interface Enemy {
    defeated: boolean;
    beginS: number;
}

export interface GameState {
    status: GameStatus;
    level: Level | null;
    history: GameHistory[];
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
        mistakes: 0,
        currentOperation: null,
        enemies: [],
    };

    private state$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(
        this.initialState,
    );
    readonly vm$ = this.state$.asObservable(); // A viewModel just so we can easily use the observable

    public score: number = 0;

    get currentState(): GameState {
        return this.state$.value;
    }

    get currentEnemies(): Enemy[] {
        return this.currentState.enemies;
    }

    get gameHistory(): GameHistory[] {
        return this.currentState.history;
    }

    get enemyCount(): number {
        return this.currentEnemies.length;
    }

    get totalDefeatedEnemies(): number {
        return this.gameHistory.length - this.currentState.mistakes;
    }

    public getLevelConfig(level: Level): LevelConfig {
        return LEVEL_CONFIG[level];
    }

    // We unpause the game in 3s
    public unpauseGame(level: Level, delay: number): void {
        this.changeGameStatus(GameStatus.Resumed);
        setTimeout(() => this.startGame(level), delay);
    }

    public startGame(level: Level): void {
        const operation = this.generateOperation(level);

        this.state$.next({
            status: GameStatus.Running,
            level,
            mistakes: 0,
            history: [],
            currentOperation: operation,
            enemies: [],
        });
    }

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
        const correctAnswer = this.isInputCorrect(playerInput);
        const history: GameHistory[] = [
            ...currentState.history,
            {
                attempt: currentState.history.length + 1,
                operation: currentState.currentOperation,
                playerInput,
            },
        ];

        let mistakes = currentState.mistakes;

        if (!correctAnswer) {
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
            currentOperation,
            status,
            enemies,
        });
    }

    public addEnemy(beginS: number): void {
        if (this.currentState.status !== GameStatus.Running) {
            return;
        }
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

    public isInputCorrect(playerInput: number): boolean {
        const currentOperation = this.currentState.currentOperation;
        if (currentOperation) {
            return playerInput === currentOperation.result;
        }
        return false;
    }
}
