import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotSyncComponent } from './not-sync.component';

describe('NotSyncComponent', () => {
  let component: NotSyncComponent;
  let fixture: ComponentFixture<NotSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotSyncComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
