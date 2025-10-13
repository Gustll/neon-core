import { test, expect } from '@playwright/test';
import { GameService, GameState, GameStatus, Level, Operator } from '../src/app/core/game.service';

const SETUP_PATH = '/game-setup';

const PLAY_COMPONENT_SELECTOR = 'app-game-layout';
const LEVEL: Level = 2;

test('startGame(level=2) initializes expected GameState and enemies', async ({ page }) => {
    await page.goto(SETUP_PATH);

    // Wait for the toggle group to be present
    const group = page.locator('mat-button-toggle-group[name="level"]');
    await expect(group).toBeVisible();

    await page.getByTestId('level-group').waitFor();
    await page
        .getByTestId('level-2')
        .locator('button, .mat-button-toggle-button, .mdc-button')
        .first()
        .click();

    await page.getByTestId('play-btn').click();

    await expect(page).toHaveURL((url) => {
        const u = new URL(url);
        return (
            u.pathname.endsWith('/play') &&
            u.searchParams.get('level') === `${LEVEL}`
        );
    });

    // Wait for the game component to be present
    await page.waitForSelector(PLAY_COMPONENT_SELECTOR);

    const mockOp = { a: 1, b: 2, operator: Operator.Addition, result: 3 };

    // 1️⃣ Check initial state before startGame runs
    const initial = await page.evaluate(({ sel }) => {
        const host = document.querySelector(sel)!;
        const cmp = (window as any).ng.getComponent(host);
        const gameService = cmp.gameService as GameService;

        return {
            state: gameService.currentState
        };
    }, { sel: PLAY_COMPONENT_SELECTOR });

    expect(initial.state.level).toBe(null);
    expect(initial.state.status).toBe(GameStatus.Resumed);
    expect(initial.state.mistakes).toBe(0);
    expect(initial.state.history).toStrictEqual([]);
    expect(initial.state.enemies).toStrictEqual([]);
    expect(initial.state.currentOperation).toEqual(null);

    const afterStart = await page.evaluate(
        ({ sel, mock, level }) => {
            const host = document.querySelector(sel)!;
            const cmp = (window as any).ng.getComponent(host);
            const gameService = cmp.gameService as GameService;

            // Override operation generator before starting the game
            gameService.generateOperation = (_level: number) => mock;

            // Start the game for the specified level
            gameService.startGame(level);

            // Wait for both status = Running and enemies drawn
            return new Promise<{ state: GameState; levelConfig: any }>((resolve) => {
                const checkState = () => {
                    const state = gameService.currentState;
                    const expectedEnemies = gameService.getLevelConfig(level).operations;

                    if (state.status === 'Running' && state.enemies.length === expectedEnemies) {
                        const levelConfig = gameService.getLevelConfig(level);
                        resolve({ state, levelConfig });
                    } else {
                        setTimeout(checkState, 50);
                    }
                };
                checkState();
            });
        },
        { sel: PLAY_COMPONENT_SELECTOR, mock: mockOp, level: LEVEL }
    );

    // Assertions after startGame
    expect(afterStart.state.level).toBe(LEVEL);
    expect(afterStart.state.status).toBe(GameStatus.Running);
    expect(afterStart.state.mistakes).toBe(0);
    expect(afterStart.state.history).toStrictEqual([]);
    expect(afterStart.state.enemies.length).toBe(afterStart.levelConfig.operations);
    expect(afterStart.state.currentOperation).toEqual(mockOp);

    await page.fill('input[formControlName="playerInput"]', `${mockOp.result}`);
    await page.getByTestId('fire-laser').click()

    // Wait for the game state to update
    const afterAnswerState = await page.evaluate(({ sel }) => {
        const host = document.querySelector(sel)!;
        const cmp = (window as any).ng.getComponent(host);
        const gameService = cmp.gameService as GameService;

        // Wait until history has one entry and enemies reduced by 1
        return new Promise<GameState>((resolve) => {
            const expectedEnemies = gameService.currentState.enemies.length + 1; // previous length
            const checkState = () => {
                const state = gameService.currentState;
                if (state.history.length === 1 && state.enemies.length === expectedEnemies - 1) {
                    resolve(state);
                } else {
                    setTimeout(checkState, 50);
                }
            };
            checkState();
        });
    }, { sel: PLAY_COMPONENT_SELECTOR });

    expect(afterAnswerState.enemies.length).toBe(afterStart.state.enemies.length - 1);
    expect(afterAnswerState.history.length).toBe(1);
    expect(afterAnswerState.history[0]).toEqual({ attempt: 1, operation: mockOp, playerCorrect: true, playerInput: 3 });
});
