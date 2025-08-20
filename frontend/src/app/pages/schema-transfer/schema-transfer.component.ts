import { ChangeDetectionStrategy, Component, OnInit, computed, effect, input, signal } from '@angular/core';
import { DocumentType, DocumentTypesListComponent } from "./document-types-list/document-types-list.component";

import { CommonModule } from "@angular/common";
import { DocumentGroup } from '../../types/contracts/ISchema';
import { DocumentTypeSchemaComponent } from './document-type-schema/document-type-schema.component';
import { GroupListComponent } from "./group-list/group-list.component";

@Component({
  selector: 'app-schema-transfer',
  standalone: true,
  imports: [CommonModule,GroupListComponent, DocumentTypesListComponent, DocumentTypeSchemaComponent],
  templateUrl: './schema-transfer.component.html',
  styleUrl: './schema-transfer.component.css'
})
export class SchemaTransferComponent implements OnInit {
   selectedGroup = signal<DocumentGroup | null>(null);
   selectedDocumentType= signal<DocumentType| null>(null)



  ngOnInit(): void {
  }

  onSelectDocumentGroup = (group:DocumentGroup) => {
      this.selectedGroup.set(group);
  }

  onDocumentTypeSelected = (documentType:DocumentType) =>{
    this.selectedDocumentType.set(documentType)
  }
}
