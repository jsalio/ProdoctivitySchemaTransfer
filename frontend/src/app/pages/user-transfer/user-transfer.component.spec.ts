import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransferComponent } from './user-transfer.component';

describe('UserTransferComponent', () => {
  let component: UserTransferComponent;
  let fixture: ComponentFixture<UserTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
