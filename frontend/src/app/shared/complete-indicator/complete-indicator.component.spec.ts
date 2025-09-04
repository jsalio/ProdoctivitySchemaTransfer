import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteIndicatorComponent } from './complete-indicator.component';

describe('CompleteIndicatorComponent', () => {
  let component: CompleteIndicatorComponent;
  let fixture: ComponentFixture<CompleteIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
