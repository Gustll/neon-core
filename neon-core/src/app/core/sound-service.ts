import { Injectable } from '@angular/core';

export type SoundName =
    | 'music'
    | 'fireLaser'
    | 'gameWon'
    | 'gameOver'
    | 'levelChange';

@Injectable({
    providedIn: 'root',
})
export class SoundService {
    private sounds: Map<SoundName, HTMLAudioElement> = new Map();
    public canPlaySound = false;

    // Preload all sounds before the game starts
    public preloadSounds(): Promise<void> {
        const soundFiles: Record<SoundName, string> = {
            music: 'assets/sounds/retro-arcade-game-music.mp3',
            fireLaser: 'assets/sounds/fire-laser.mp3',
            gameWon: 'assets/sounds/game-won.mp3',
            gameOver: 'assets/sounds/game-over.mp3',
            levelChange: 'assets/sounds/level-change.mp3',
        };

        const promises = Object.entries(soundFiles).map(
            ([name, src]) =>
                new Promise<void>((resolve, reject) => {
                    const audio = new Audio(src);
                    audio.load();
                    audio.oncanplaythrough = () => {
                        this.sounds.set(name as SoundName, audio);
                        resolve();
                    };
                    audio.onerror = (err) => {
                        console.error(`Error loading sound ${name}:`, err);
                        reject(err);
                    };
                }),
        );
        return Promise.all(promises).then(() => undefined);
    }

    public play(
        name: SoundName,
        loop: boolean = false,
        volume: number = 1,
    ): void {
        const audio = this.sounds.get(name);
        if (!audio || !this.canPlaySound) {
            return;
        }

        audio.loop = loop;
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play();
    }

    // Stop a sound by name
    public stop(name: SoundName): void {
        const audio = this.sounds.get(name);
        if (!audio || !this.canPlaySound) {
            return;
        }

        audio.pause();
        audio.currentTime = 0;
    }
}
