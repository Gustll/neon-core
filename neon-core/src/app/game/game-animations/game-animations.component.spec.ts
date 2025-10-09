import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnimationsComponent } from './game-animations.component';

describe('GameAnimationsComponent', () => {
    let component: GameAnimationsComponent;
    let fixture: ComponentFixture<GameAnimationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameAnimationsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameAnimationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
