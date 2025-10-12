import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { GameService, GameStatus, Level } from '../../core/game.service';
import { GameAnimationsComponent } from '../game-animations/game-animations.component';
import { GameHistoryComponent } from '../game-history/game-history.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-game-layout',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        GameAnimationsComponent,
        GameHistoryComponent,
    ],
    templateUrl: './game-layout.component.html',
    styleUrl: './game-layout.component.scss',
    standalone: true,
})
export class GameLayoutComponent implements AfterViewInit {
    @ViewChild('game') game!: GameAnimationsComponent;
    private gameService = inject(GameService);

    public GameStatus = GameStatus;
    public vm$ = this.gameService.vm$;
    public gameForm = new FormGroup({
        playerInput: new FormControl<number | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    public countdown: string = '';

    constructor(private route: ActivatedRoute) {}
    ngAfterViewInit(): void {
        // TODO - using a typeguard here would be much better as we should not be casting like this...
        const level = this.route.snapshot.queryParamMap.get('level')
            ? (Number(this.route.snapshot.queryParamMap.get('level')) as Level)
            : 1;

        Promise.resolve().then(() => {
            const unpauseDelayMs = 4000;
            this.startCountdown(unpauseDelayMs);
            this.gameService.unpauseGame(level, unpauseDelayMs);
            setTimeout(() => this.game.animateGame(), unpauseDelayMs);
        });
    }

    public fireLaser() {
        const { playerInput } = this.gameForm.getRawValue();
        if (playerInput) {
            this.game.animateLaser(playerInput);
            this.gameService.fireLaser(playerInput);
        }
        this.gameForm.reset();
    }

    private startCountdown(unpauseDelayMs: number) {
        let counter = unpauseDelayMs / 1000 - 1;
        this.countdown = '3';
        const countdownInterval = setInterval(() => {
            if (counter === 1) {
                this.countdown = 'START!';
                counter -= 1;
            } else if (counter > 0) {
                this.countdown = `${counter - 1}`;
                counter -= 1;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }
}
