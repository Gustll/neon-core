import { Injectable } from "@angular/core";
import { Level } from "./game.service";

@Injectable({
    providedIn: 'root',
})
export class EnemyPathService {

    public generateSpawnIntervalMs(level: Level, pathDurationMs: number, r: number): number {
        const enemyD = this.levelPath(level)
        const gap = 0;
        const L = this.pathLengthFromD(enemyD);
        return (pathDurationMs * (2 * r + gap)) / L;
    }

    private pathLengthFromD(d: string): number {
        const ns = 'http://www.w3.org/2000/svg';
        const p = document.createElementNS(ns, 'path');
        p.setAttribute('d', d);
        return p.getTotalLength();
    }

    public levelPath(level: Level): string {
        switch (level) {
            case 1:
                return this.straighPath();
            case 2:
                return this.cubicPath();
            case 3: return this.zigZagPath();
            default:
                return this.straighPath();
        }
    }

    private straighPath(): string {
        return `M 50 0 L 50 95`;
    }

    private cubicPath(): string {
        return 'M50 0C65 12 6 23 50 34S35 60 28 66 108 72 50 95';
    }

    private zigZagPath(): string {
        return 'M50 0V20H70V40H30V60H70V80H49V95';
    }


}