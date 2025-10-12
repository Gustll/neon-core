import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameAccessService {
    private _allowPlay = false;

    public allowPlayOnce() {
        this._allowPlay = true;
    }

    public consumeAllowPlay(): boolean {
        const ok = this._allowPlay;
        this._allowPlay = false;
        return ok;
    }
}
