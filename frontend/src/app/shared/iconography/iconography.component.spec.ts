import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconographyComponent } from './iconography.component';

describe('IconographyComponent', () => {
  let component: IconographyComponent;
  let fixture: ComponentFixture<IconographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconographyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
