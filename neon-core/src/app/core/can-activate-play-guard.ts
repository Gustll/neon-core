import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { GameAccessService } from './game-access-service';

export const playRouteGuard: CanMatchFn = () => {
    const access = inject(GameAccessService);
    const router = inject(Router);

    return access.consumeAllowPlay() ? true : router.parseUrl('/game-setup');
};
