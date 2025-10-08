import { Routes } from '@angular/router';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    {
        path: 'game-setup',
        component: GameSetupComponent,
    },
    {
        path: 'game',
        component: GameComponent,
    },
    { path: '', redirectTo: 'game-setup', pathMatch: 'full' },
    { path: '**', redirectTo: 'game-setup' },
];
