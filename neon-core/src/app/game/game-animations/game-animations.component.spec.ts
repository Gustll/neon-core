import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAnimationsComponent } from './game-animations.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('GameAnimationsComponent', () => {
    let component: GameAnimationsComponent;
    let fixture: ComponentFixture<GameAnimationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameAnimationsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: convertToParamMap({ level: '3' }),
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameAnimationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
