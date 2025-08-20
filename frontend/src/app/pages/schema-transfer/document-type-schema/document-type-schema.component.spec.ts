import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeSchemaComponent } from './document-type-schema.component';

describe('DocumentTypeSchemaComponent', () => {
  let component: DocumentTypeSchemaComponent;
  let fixture: ComponentFixture<DocumentTypeSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypeSchemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTypeSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
