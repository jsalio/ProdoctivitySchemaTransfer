import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitIndicatorComponent } from './await-indicator.component';

describe('AwaitIndicatorComponent', () => {
  let component: AwaitIndicatorComponent;
  let fixture: ComponentFixture<AwaitIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwaitIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AwaitIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
