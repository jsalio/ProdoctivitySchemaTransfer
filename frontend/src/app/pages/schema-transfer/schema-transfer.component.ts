import { Component, OnInit, signal } from '@angular/core';
import { DocumentTypesListComponent, SchemaDocumentType } from "./document-types-list/document-types-list.component";
import { GroupListComponent, SchemaDocumentGroup } from "./group-list/group-list.component";

import { CommonModule } from "@angular/common";
import { Credentials } from '../../types/models/Credentials';
import { DataElement } from '../../types/contracts/ISchema';
import { DocumentTypeSchemaComponent } from './document-type-schema/document-type-schema.component';
import { LocalDataService } from '../../services/ui/local-data.service';
import { ObservableHandler } from '../../shared/utils/Obserbable-handler';
import { SchemaService } from '../../services/backend/schema.service';

@Component({
  selector: 'app-schema-transfer',
  standalone: true,
  imports: [CommonModule, GroupListComponent, DocumentTypesListComponent, DocumentTypeSchemaComponent],
  templateUrl: './schema-transfer.component.html',
  styleUrl: './schema-transfer.component.css'
})
export class SchemaTransferComponent implements OnInit {
  selectedGroup = signal<SchemaDocumentGroup | null>(null);
  selectedDocumentType = signal<SchemaDocumentType | null>(null)
  loadingDataElements = signal<boolean>(false)

  systemTargetDataElements= signal<DataElement[]>([])
  /**
   *
   */
  constructor(private readonly schema: SchemaService, private readonly localData: LocalDataService) {
    // super();

  }


  ngOnInit(): void {
    const credentialsOfFluency = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (credentialsOfFluency) {
      this.executeCall(credentialsOfFluency, (response) => {
        console.log(response)
        this.systemTargetDataElements.set(response.data)
      })
    }
  }

  onSelectDocumentGroup = (group: SchemaDocumentGroup) => {
    this.selectedGroup.set(group);
  }

  onDocumentTypeSelected = (documentType: SchemaDocumentType) => {
    this.selectedDocumentType.set(documentType)
  }

  executeCall = (credentials: Credentials, callback: (response: { data: Array<DataElement>, success: boolean }) => void) => {
    ObservableHandler.handle(this.schema.getAllDataElements(credentials))
      .onNext(callback)
      .onStart(() => this.loadingDataElements.set(true))
      .onError((errr) => {
        console.warn(errr)
      })
      .onFinalize(() => this.loadingDataElements.set(false))
      .execute()
  }
}
