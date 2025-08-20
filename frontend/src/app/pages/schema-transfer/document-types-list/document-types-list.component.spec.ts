import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypesListComponent } from './document-types-list.component';

describe('DocumentTypesListComponent', () => {
  let component: DocumentTypesListComponent;
  let fixture: ComponentFixture<DocumentTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
