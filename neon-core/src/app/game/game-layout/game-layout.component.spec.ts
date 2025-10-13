import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLayoutComponent } from './game-layout.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('GameLayoutComponent', () => {
    let component: GameLayoutComponent;
    let fixture: ComponentFixture<GameLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameLayoutComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: convertToParamMap({ level: '1' }),
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
