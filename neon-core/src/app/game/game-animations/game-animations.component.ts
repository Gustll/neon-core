import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    GameService,
    GameStatus,
    Level,
    LevelConfig,
} from '../../core/game.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

interface Laser {
    targetX: number;
    targetY: number;
    color: string;
}

@Component({
    selector: 'app-game-animations',
    imports: [CommonModule],
    templateUrl: './game-animations.component.html',
    styleUrl: './game-animations.component.scss',
})
export class GameAnimationsComponent implements OnInit {
    @ViewChild('game', { static: false }) game!: ElementRef<SVGSVGElement>;

    private gameService = inject(GameService);

    private readonly SPAWN_MS = 500;

    public GameStatus = GameStatus;
    public vm$ = this.gameService.vm$;
    public enemyD!: string;
    public cfg!: LevelConfig;
    public laser$ = new BehaviorSubject<Laser | null>(null);
    public timestamp = Date.now();
    public timeDelta!: number;
    public r: number = 1.5;
    private spawnIntervalMs!: number;
    public svgLoadTimeDelta = 0;

    ngOnInit(): void {
        const level = 1;
        this.cfg = this.gameService.getLevelConfig(level);
        this.enemyD = this.levelPath(level);
        this.spawnIntervalMs = this.generateSpawnIntervalMs();
    }

    public generateSpawnIntervalMs(): number {
        const gap = 0;
        const L = this.pathLengthFromD(this.enemyD);
        const T = this.cfg.pathDurationMs; // ms
        return (T * (2 * this.r + gap)) / L;
    }

    private pathLengthFromD(d: string): number {
        const ns = 'http://www.w3.org/2000/svg';
        const p = document.createElementNS(ns, 'path');
        p.setAttribute('d', d);
        return p.getTotalLength();
    }

    private levelPath(level: Level): string {
        switch (level) {
            case 1:
                return this.straighPath();

            default:
                return this.straighPath();
        }
    }

    private straighPath(): string {
        return `M 50 0 L 50 95`;
    }

    public animateGame(): void {
        this.drawEnemies();
        this.animateEnemies();
    }

    public drawEnemies(): void {
        const totalEnemies = this.cfg.operations;
        this.svgLoadTimeDelta = Date.now() - this.timestamp;

        for (let enemyCount = 0; enemyCount < totalEnemies; enemyCount++) {
            // The svg loads faster than we start the game so we need to offset the begin of circle load for the time duration
            const beginMs =
                this.spawnIntervalMs * this.gameService.enemyCount +
                this.svgLoadTimeDelta;
            this.gameService.addEnemy(beginMs);
        }
    }

    public animateEnemies(): void {
        const now = Date.now();
        const timeDelta = now - this.timestamp;

        const enemies = this.gameService.currentEnemies;

        if (
            enemies.length > 0 &&
            this.gameService.currentStatus === GameStatus.Running
        ) {
            const leader = enemies[0];
            const leaderBeginMS = leader.beginMs;
            const leaderTimeDelta = timeDelta - leaderBeginMS;

            if (leaderTimeDelta >= this.cfg.pathDurationMs) {
                this.gameOver();
            } else {
                window.requestAnimationFrame(() => {
                    this.animateEnemies();
                });
            }
        }
    }

    public gameOver(): void {
        this.gameService.changeGameStatus(GameStatus.GameOver);
    }

    public animateLaser(playerInput: number) {
        const svg = this.game?.nativeElement;
        if (!svg) {
            return;
        }

        const firstEnemy = svg.querySelector(
            '#first-enemy',
        ) as SVGGraphicsElement | null;
        if (!firstEnemy) {
            return;
        } // No enemies

        // 1) get its current animated box in screen pixels
        const rect = firstEnemy.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // 2) convert screen -> SVG user units (so it matches path/line coords)
        const pt = svg.createSVGPoint();
        pt.x = cx;
        pt.y = cy;
        const ctm = svg.getScreenCTM();
        if (!ctm) {
            return;
        }
        const svgPt = pt.matrixTransform(ctm.inverse());

        const color = this.gameService.isInputCorrect(playerInput)
            ? 'blue'
            : 'red';

        this.laser$.next({ targetX: svgPt.x, targetY: svgPt.y, color });

        setTimeout(() => this.laser$.next(null), 250);
    }

    public isFirstEnemy(beginS: number): boolean {
        return this.gameService.isFirstEnemy(beginS);
    }
}
