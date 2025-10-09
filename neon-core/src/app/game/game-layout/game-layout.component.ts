import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { GameService } from '../../core/game.service';

@Component({
    selector: 'app-game-layout',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './game-layout.component.html',
    styleUrl: './game-layout.component.scss',
    standalone: true,
})
export class GameLayoutComponent {
    private gameService = inject(GameService);

    public vm$ = this.gameService.vm$;
    public gameForm = new FormGroup({
        playerInput: new FormControl<number | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    ngOnInit(): void {
        // TODO : change so we get the level based on the game setup
        this.gameService.startGame(1);
    }

    public fireLaser() {
        const { playerInput } = this.gameForm.getRawValue();
        if (playerInput) {
            this.gameService.fireLaser(playerInput);
        }
    }
}
