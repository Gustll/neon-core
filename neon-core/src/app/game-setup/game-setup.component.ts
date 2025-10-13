import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Level } from '../core/game.service';
import { GameAccessService } from '../core/game-access-service';
import { Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { EnemyPathService } from '../core/enemy-path-service';
import { distinctUntilChanged, filter, map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-game-setup',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
    ],
    templateUrl: './game-setup.component.html',
    styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent {
    public levelControl = new FormControl<Level>(1, {
        validators: [Validators.required],
    });
    public enemyD$!: Observable<string>;

    constructor(
        private router: Router,
        private access: GameAccessService,
        private pathService: EnemyPathService,
    ) {
        this.enemyD$ = this.levelControl.valueChanges.pipe(
            startWith(this.levelControl.value),
            distinctUntilChanged(),
            filter((level) => level !== null),
            map((level: Level) => {
                return this.pathService.levelPath(level);
            }),
        );
    }

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
