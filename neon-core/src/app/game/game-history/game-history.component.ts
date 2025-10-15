import { Component, inject } from '@angular/core';
import { GameService } from '../../core/game.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-game-history',
    imports: [CommonModule, MatTooltipModule],
    templateUrl: './game-history.component.html',
    styleUrl: './game-history.component.scss',
    standalone: true,
    host: { class: 'flex flex-auto w-100  overflow-y-auto' },
})
export class GameHistoryComponent {
    private gameService = inject(GameService);
    public vm$ = this.gameService.vm$;
}
