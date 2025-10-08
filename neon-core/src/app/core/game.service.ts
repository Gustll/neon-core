import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Level = 1 | 2 | 3 | 4 | 5;

interface LevelConfig {
    gameSpeed: number;
    minRange: number;
    maxRange: number;
    operations: number;
}

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
    1: { gameSpeed: 1, minRange: 1, maxRange: 10, operations: 3 },
    2: { gameSpeed: 1.2, minRange: 1, maxRange: 10, operations: 30 },
    3: { gameSpeed: 1.5, minRange: 1, maxRange: 50, operations: 50 },
    4: { gameSpeed: 1.7, minRange: 50, maxRange: 100, operations: 100 },
    5: { gameSpeed: 2, minRange: 50, maxRange: 150, operations: 150 },
};

enum Operator {
    Addition = 'Addition',
}

interface Operation {
    a: number;
    b: number;
    result: number;
    operator: Operator;
}

interface GameHistory {
    attempt: number;
    operation: Operation;
    playerInput: number;
}

enum GameStatus {
    Idle = 'idle',
    Running = 'running',
    Won = 'won',
    Lost = 'lost',
}

interface GameState {
    status: GameStatus;
    level: Level | null;
    history: GameHistory[];
    gameSpeed: number;
    mistakes: number;
    currentOperation: Operation | null;
}

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private initialState: GameState = {
        status: GameStatus.Idle,
        level: null,
        history: [],
        gameSpeed: 1,
        mistakes: 0,
        currentOperation: null,
    };

    private state$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(
        this.initialState,
    );
    readonly vm$ = this.state$.asObservable(); // A viewModel just so we can easily use the observable

    public currentOperation!: Operation;
    public score: number = 0;
    public attempt: number = 0;

    constructor() {}

    get currentState(): GameState {
        return this.state$.value;
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

        const correctAnswer =
            playerInput === currentState.currentOperation.result;

        const history: GameHistory[] = [
            ...currentState.history,
            {
                attempt: this.attempt,
                operation: currentState.currentOperation,
                playerInput,
            },
        ];

        let mistakes = currentState.mistakes;
        let gameSpeed = currentState.gameSpeed;

        if (!correctAnswer) {
            gameSpeed += 0.1;
            mistakes += 1;
        }

        const currentOperation = this.generateOperation(currentState.level);
        // Check if the total of correct answers is the same as the total operations set in the level config
        const status =
            currentState.history.length + 1 - mistakes ===
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
        });

        //this.currentOperation = this.generateOperation()
    }
}
