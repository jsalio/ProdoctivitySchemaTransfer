import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTransferComponent } from './schema-transfer.component';

describe('SchemaTransferComponent', () => {
  let component: SchemaTransferComponent;
  let fixture: ComponentFixture<SchemaTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
