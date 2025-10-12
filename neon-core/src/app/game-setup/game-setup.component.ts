import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Level } from '../core/game.service';
import { GameAccessService } from '../core/game-access-service';
import { Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-game-setup',
    imports: [ReactiveFormsModule, MatButtonToggleModule, MatButtonModule],
    templateUrl: './game-setup.component.html',
    styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent {
    public levelControl = new FormControl<Level>(1, {
        validators: [Validators.required],
    });

    constructor(
        private router: Router,
        private access: GameAccessService,
    ) {}

    public play(): void {
        if (!this.levelControl.valid) {
            return;
        }

        this.access.allowPlayOnce();
        this.router.navigate(['/play'], {
            queryParams: { level: this.levelControl.value },
        });
    }
}
