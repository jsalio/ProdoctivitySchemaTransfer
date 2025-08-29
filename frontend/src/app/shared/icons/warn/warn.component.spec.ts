import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnComponent } from './warn.component';

describe('WarnComponent', () => {
  let component: WarnComponent;
  let fixture: ComponentFixture<WarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
