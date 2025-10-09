import { TestBed } from '@angular/core/testing';
import {
    GameHistory,
    GameService,
    GameStatus,
    LEVEL_CONFIG,
    Operation,
    Operator,
} from './game.service';
import { take } from 'rxjs';

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [],
        });
        service = TestBed.inject(GameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('gameLogic', async () => {
        it('should initializes state correctly after game start', () => {
            const fakeOp: Operation = {
                a: 4,
                b: 5,
                result: 9,
                operator: Operator.Addition,
            };
            spyOn(service, 'generateOperation').and.returnValue(fakeOp);

            const level = 2;

            service.startGame(level);

            service.vm$.pipe(take(1)).subscribe((state) => {
                expect(state.status).toEqual(GameStatus.Running);
                expect(state.level).toEqual(level);
                expect(state.mistakes).toEqual(0);
                expect(state.history).toEqual([]);
                expect(state.currentOperation).toEqual(fakeOp);
            });
        });

        it('should correctly modify with correct answer', () => {
            const fakeOp: Operation = {
                a: 3,
                b: 5,
                result: 8,
                operator: Operator.Addition,
            };
            spyOn(service, 'generateOperation').and.returnValue(fakeOp);

            const level = 1;

            service.startGame(level);
            service.fireLaser(fakeOp.result);

            const history: GameHistory[] = [
                { attempt: 1, operation: fakeOp, playerInput: fakeOp.result },
            ];

            service.vm$.pipe(take(1)).subscribe((state) => {
                expect(state.status).toEqual(GameStatus.Running);
                expect(state.level).toEqual(level);
                expect(state.mistakes).toEqual(0);
                expect(state.history).toEqual(history);
                expect(state.currentOperation).toEqual(fakeOp);
            });
        });
        it('should correctly modify state with wrong answer', () => {
            const fakeOp: Operation = {
                a: 5,
                b: 5,
                result: 10,
                operator: Operator.Addition,
            };
            spyOn(service, 'generateOperation').and.returnValue(fakeOp);

            const level = 1;

            service.startGame(level);
            service.fireLaser(fakeOp.result);

            const wrongInput = 14;
            service.fireLaser(wrongInput); // Pass in the wrong result

            const history: GameHistory[] = [
                {
                    attempt: 1,
                    operation: fakeOp,
                    playerInput: fakeOp.result,
                },
                { attempt: 2, operation: fakeOp, playerInput: wrongInput },
            ];

            service.vm$.pipe(take(1)).subscribe((state) => {
                expect(state.status).toEqual(GameStatus.Running);
                expect(state.level).toEqual(level);
                expect(state.mistakes).toEqual(1);
                expect(state.history).toEqual(history);
                expect(state.currentOperation).toEqual(fakeOp);
            });
        });

        it('', () => {
            const fakeOp: Operation = {
                a: 5,
                b: 5,
                result: 10,
                operator: Operator.Addition,
            };
            spyOn(service, 'generateOperation').and.returnValue(fakeOp);

            const level = 1;
            const levelConfig = LEVEL_CONFIG[level];

            service.startGame(level);

            // We could also modify the LEVEL_CONFIG to get the right amount of history and operations for the win
            const history: GameHistory[] = Array.from({
                length: levelConfig.operations,
            }).reduce((acc: GameHistory[], _, i: number) => {
                service.fireLaser(fakeOp.result);
                acc.push({
                    attempt: i + 1,
                    operation: fakeOp,
                    playerInput: fakeOp.result,
                });
                return acc;
            }, [] as GameHistory[]);

            service.vm$.pipe(take(1)).subscribe((state) => {
                expect(state.status).toEqual(GameStatus.Won);
                expect(state.level).toEqual(level);
                expect(state.mistakes).toEqual(0);
                expect(state.history).toEqual(history);
                expect(state.currentOperation).toEqual(fakeOp);
            });
        });
    });
});
