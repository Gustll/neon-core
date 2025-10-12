import { Component, inject } from '@angular/core';
import { GameService } from '../../core/game.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game-history',
    imports: [CommonModule],
    templateUrl: './game-history.component.html',
    styleUrl: './game-history.component.scss',
    standalone: true
})
export class GameHistoryComponent {
    private gameService = inject(GameService);
    public vm$ = this.gameService.vm$;



}
