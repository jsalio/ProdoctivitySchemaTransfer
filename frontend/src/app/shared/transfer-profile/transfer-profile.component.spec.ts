import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferProfileComponent } from './transfer-profile.component';

describe('TransferProfileComponent', () => {
  let component: TransferProfileComponent;
  let fixture: ComponentFixture<TransferProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
