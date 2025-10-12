import { Routes } from '@angular/router';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameLayoutComponent } from './game/game-layout/game-layout.component';
import { playRouteGuard } from './core/can-activate-play-guard';

export const routes: Routes = [
    {
        path: 'game-setup',
        component: GameSetupComponent,
    },
    {
        path: 'play',
        component: GameLayoutComponent,
        canMatch: [playRouteGuard],
    },
    { path: '', redirectTo: 'game-setup', pathMatch: 'full' },
    { path: '**', redirectTo: 'game-setup' },
];
