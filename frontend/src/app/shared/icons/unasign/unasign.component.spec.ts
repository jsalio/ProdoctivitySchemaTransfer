import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnasignComponent } from './unasign.component';

describe('UnasignComponent', () => {
  let component: UnasignComponent;
  let fixture: ComponentFixture<UnasignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnasignComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnasignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
