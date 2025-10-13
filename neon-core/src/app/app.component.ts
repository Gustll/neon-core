import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SoundService } from './core/sound-service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
})
export class AppComponent implements OnInit {
    title = 'neon-core';

    loading = true;

    constructor(private soundService: SoundService) {}

    async ngOnInit() {
        try {
            await this.soundService.preloadSounds();
            this.loading = false;
            this.soundService.play('music', true, 0.5);
        } catch (err) {
            console.error('Failed to load sounds', err);
        }

        const unlockAudio = () => {
            this.soundService.canPlaySound = true;
            this.soundService.play('music', true, 0.5);
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('keydown', unlockAudio);
    }
}
