import {Component, OnInit, signal} from '@angular/core';
import { DocumentTypesListComponent, SchemaDocumentType } from "./document-types-list/document-types-list.component";
import { GroupListComponent, SchemaDocumentGroup } from "./group-list/group-list.component";

import { CommonModule } from "@angular/common";
import { DocumentTypeSchemaComponent } from './document-type-schema/document-type-schema.component';

@Component({
  selector: 'app-schema-transfer',
  standalone: true,
  imports: [CommonModule,GroupListComponent, DocumentTypesListComponent, DocumentTypeSchemaComponent],
  templateUrl: './schema-transfer.component.html',
  styleUrl: './schema-transfer.component.css'
})
export class SchemaTransferComponent implements OnInit {
   selectedGroup = signal<SchemaDocumentGroup | null>(null);
   selectedDocumentType= signal<SchemaDocumentType| null>(null)



  ngOnInit(): void {
  }

  onSelectDocumentGroup = (group:SchemaDocumentGroup) => {
      this.selectedGroup.set(group);
  }

  onDocumentTypeSelected = (documentType:SchemaDocumentType) =>{
    this.selectedDocumentType.set(documentType)
  }
}
